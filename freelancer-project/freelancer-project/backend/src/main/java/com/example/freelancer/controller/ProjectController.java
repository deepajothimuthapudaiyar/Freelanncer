package com.example.freelancer.controller;

import com.example.freelancer.dto.ClientDashboardResponse;
import com.example.freelancer.dto.ProjectRequest;
import com.example.freelancer.model.Project;
import com.example.freelancer.security.CustomUserDetails;
import com.example.freelancer.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectRequest request,
                                                   @AuthenticationPrincipal CustomUserDetails principal) {
        return new ResponseEntity<>(projectService.createProject(request, principal.getUser()), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(@RequestParam(required = false) String search,
                                                          @RequestParam(required = false) String status) {
        return ResponseEntity.ok(projectService.searchProjects(search, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id,
                                                   @Valid @RequestBody ProjectRequest request,
                                                   @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(projectService.updateProject(id, request, principal.getUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id,
                                                @AuthenticationPrincipal CustomUserDetails principal) {
        projectService.deleteProject(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<Project>> getMyProjects(@AuthenticationPrincipal CustomUserDetails principal) {
        if (principal.getUser().getRole().name().equals("ROLE_CLIENT")) {
            return ResponseEntity.ok(projectService.getProjectsByClient(principal.getUser()));
        }
        return ResponseEntity.ok(projectService.getProjectsByFreelancer(principal.getUser()));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Project> completeProject(@PathVariable Long id,
                                                      @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(projectService.completeProject(id, principal.getUser()));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Project> cancelProject(@PathVariable Long id,
                                                    @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(projectService.cancelProject(id, principal.getUser()));
    }

    @GetMapping("/dashboard/client")
    public ResponseEntity<ClientDashboardResponse> getClientDashboard(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(projectService.getClientDashboard(principal.getUser()));
    }
}
