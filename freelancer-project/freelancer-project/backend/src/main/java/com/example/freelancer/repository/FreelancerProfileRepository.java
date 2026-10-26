package com.example.freelancer.repository;

import com.example.freelancer.model.FreelancerProfile;
import com.example.freelancer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FreelancerProfileRepository extends JpaRepository<FreelancerProfile, Long> {
    Optional<FreelancerProfile> findByUser(User user);
    Optional<FreelancerProfile> findByUserId(Long userId);
}
