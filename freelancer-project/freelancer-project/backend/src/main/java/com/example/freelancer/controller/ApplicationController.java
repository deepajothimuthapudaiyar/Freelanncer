package com.example.freelancer.controller;

import com.example.freelancer.dto.ApplicationRequest;
import com.example.freelancer.model.Application;
import com.example.freelancer.security.CustomUserDetails;
import com.example.freelancer.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<Application> apply(@Valid @RequestBody ApplicationRequest request,
                                               @AuthenticationPrincipal CustomUserDetails principal) {
        return new ResponseEntity<>(applicationService.apply(request, principal.getUser()), HttpStatus.CREATED);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Application>> getForProject(@PathVariable Long projectId,
                                                              @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(applicationService.getApplicationsForProject(projectId, principal.getUser()));
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<Application>> getForFreelancer(@PathVariable Long freelancerId,
                                                                 @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(applicationService.getApplicationsForFreelancer(freelancerId, principal.getUser()));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Application> accept(@PathVariable Long id,
                                                @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(applicationService.acceptApplication(id, principal.getUser()));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Application> reject(@PathVariable Long id,
                                                @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(applicationService.rejectApplication(id, principal.getUser()));
    }
}
