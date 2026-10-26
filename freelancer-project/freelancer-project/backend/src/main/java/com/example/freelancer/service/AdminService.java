package com.example.freelancer.service;

import com.example.freelancer.dto.AdminDashboardResponse;
import com.example.freelancer.model.Project;
import com.example.freelancer.model.ProjectStatus;
import com.example.freelancer.model.Role;
import com.example.freelancer.model.User;
import com.example.freelancer.repository.ProjectRepository;
import com.example.freelancer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public AdminDashboardResponse getDashboard() {
        long totalUsers = userRepository.count();
        long totalClients = userRepository.countByRole(Role.ROLE_CLIENT);
        long totalFreelancers = userRepository.countByRole(Role.ROLE_FREELANCER);
        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.countByStatus(ProjectStatus.IN_PROGRESS);
        long completedProjects = projectRepository.countByStatus(ProjectStatus.COMPLETED);

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalClients(totalClients)
                .totalFreelancers(totalFreelancers)
                .totalProjects(totalProjects)
                .activeProjects(activeProjects)
                .completedProjects(completedProjects)
                .build();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
