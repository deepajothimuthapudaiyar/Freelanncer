package com.example.freelancer.service;

import com.example.freelancer.dto.ProfileRequest;
import com.example.freelancer.dto.UserResponse;
import com.example.freelancer.exception.BadRequestException;
import com.example.freelancer.exception.ResourceNotFoundException;
import com.example.freelancer.model.FreelancerProfile;
import com.example.freelancer.model.Role;
import com.example.freelancer.model.User;
import com.example.freelancer.repository.FreelancerProfileRepository;
import com.example.freelancer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse getUserById(Long id) {
        User user = findUser(id);
        return toResponse(user);
    }

    public User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public UserResponse updateUser(Long id, User updated, Long requesterId) {
        if (!id.equals(requesterId)) {
            throw new BadRequestException("You can only update your own profile");
        }
        User user = findUser(id);
        if (updated.getName() != null) user.setName(updated.getName());
        userRepository.save(user);
        return toResponse(user);
    }

    public void deleteUser(Long id) {
        User user = findUser(id);
        userRepository.delete(user);
    }

    public FreelancerProfile updateFreelancerProfile(Long userId, ProfileRequest request) {
        User user = findUser(userId);
        if (user.getRole() != Role.ROLE_FREELANCER) {
            throw new BadRequestException("Only freelancers can have a profile");
        }
        FreelancerProfile profile = freelancerProfileRepository.findByUser(user)
                .orElse(FreelancerProfile.builder().user(user).build());
        profile.setSkills(request.getSkills());
        profile.setBio(request.getBio());
        profile.setPortfolio(request.getPortfolio());
        return freelancerProfileRepository.save(profile);
    }

    public FreelancerProfile getFreelancerProfile(Long userId) {
        User user = findUser(userId);
        return freelancerProfileRepository.findByUser(user)
                .orElse(FreelancerProfile.builder().user(user).skills("").bio("").portfolio("").averageRating(0.0).build());
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
