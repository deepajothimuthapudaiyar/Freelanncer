package com.example.freelancer.controller;

import com.example.freelancer.dto.ProjectProgressResponse;
import com.example.freelancer.dto.TaskRequest;
import com.example.freelancer.model.Task;
import com.example.freelancer.security.CustomUserDetails;
import com.example.freelancer.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskRequest request,
                                             @AuthenticationPrincipal CustomUserDetails principal) {
        return new ResponseEntity<>(taskService.createTask(request, principal.getUser()), HttpStatus.CREATED);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getForProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getTasksForProject(projectId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id,
                                             @RequestBody TaskRequest request,
                                             @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(taskService.updateTask(id, request, principal.getUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id,
                                             @AuthenticationPrincipal CustomUserDetails principal) {
        taskService.deleteTask(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/project/{projectId}/progress")
    public ResponseEntity<ProjectProgressResponse> getProgress(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getProgress(projectId));
    }
}
