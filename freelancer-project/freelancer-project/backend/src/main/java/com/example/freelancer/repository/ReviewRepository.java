package com.example.freelancer.repository;

import com.example.freelancer.model.Review;
import com.example.freelancer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByReviewedUser(User reviewedUser);
    List<Review> findByReviewedUserId(Long userId);
}
