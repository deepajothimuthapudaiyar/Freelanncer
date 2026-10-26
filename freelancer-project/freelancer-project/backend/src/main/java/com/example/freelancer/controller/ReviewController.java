package com.example.freelancer.controller;

import com.example.freelancer.dto.ReviewRequest;
import com.example.freelancer.model.Review;
import com.example.freelancer.security.CustomUserDetails;
import com.example.freelancer.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> submitReview(@Valid @RequestBody ReviewRequest request,
                                                 @AuthenticationPrincipal CustomUserDetails principal) {
        return new ResponseEntity<>(reviewService.submitReview(request, principal.getUser()), HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsForUser(userId));
    }
}
