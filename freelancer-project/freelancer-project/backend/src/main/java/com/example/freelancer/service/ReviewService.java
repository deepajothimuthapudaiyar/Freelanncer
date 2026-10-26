package com.example.freelancer.service;

import com.example.freelancer.dto.ReviewRequest;
import com.example.freelancer.exception.BadRequestException;
import com.example.freelancer.exception.UnauthorizedActionException;
import com.example.freelancer.model.*;
import com.example.freelancer.repository.FreelancerProfileRepository;
import com.example.freelancer.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProjectService projectService;
    private final UserService userService;
    private final NotificationService notificationService;
    private final FreelancerProfileRepository freelancerProfileRepository;

    public Review submitReview(ReviewRequest request, User reviewer) {
        Project project = projectService.getProjectById(request.getProjectId());

        if (project.getStatus() != ProjectStatus.COMPLETED) {
            throw new BadRequestException("Reviews can only be submitted after project completion");
        }
        if (!project.getClient().getId().equals(reviewer.getId())) {
            throw new UnauthorizedActionException("Only the client can review the freelancer");
        }
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        User reviewedUser = userService.findUser(request.getReviewedUserId());

        Review review = Review.builder()
                .project(project)
                .reviewer(reviewer)
                .reviewedUser(reviewedUser)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        Review saved = reviewRepository.save(review);

        updateAverageRating(reviewedUser);

        notificationService.notify(reviewedUser,
                reviewer.getName() + " left you a review for project: " + project.getTitle());

        return saved;
    }

    public List<Review> getReviewsForUser(Long userId) {
        return reviewRepository.findByReviewedUserId(userId);
    }

    private void updateAverageRating(User user) {
        List<Review> reviews = reviewRepository.findByReviewedUser(user);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        freelancerProfileRepository.findByUser(user).ifPresent(profile -> {
            profile.setAverageRating(Math.round(avg * 100.0) / 100.0);
            freelancerProfileRepository.save(profile);
        });
    }
}
