package com.example.freelancer.controller;

import com.example.freelancer.dto.ProfileRequest;
import com.example.freelancer.dto.UserResponse;
import com.example.freelancer.model.FreelancerProfile;
import com.example.freelancer.model.User;
import com.example.freelancer.security.CustomUserDetails;
import com.example.freelancer.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id,
                                                     @RequestBody User updated,
                                                     @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(userService.updateUser(id, updated, principal.getUser().getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/profile")
    public ResponseEntity<FreelancerProfile> getMyProfile(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(userService.getFreelancerProfile(principal.getUser().getId()));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<FreelancerProfile> updateMyProfile(@Valid @RequestBody ProfileRequest request,
                                                                @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(userService.updateFreelancerProfile(principal.getUser().getId(), request));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<FreelancerProfile> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getFreelancerProfile(id));
    }
}
