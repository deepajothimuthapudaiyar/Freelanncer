package com.example.freelancer.controller;

import com.example.freelancer.model.Notification;
import com.example.freelancer.security.CustomUserDetails;
import com.example.freelancer.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(principal.getUser()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id,
                                                      @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(notificationService.markAsRead(id, principal.getUser()));
    }
}
