package com.example.freelancer.repository;

import com.example.freelancer.model.Project;
import com.example.freelancer.model.ProjectStatus;
import com.example.freelancer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByClient(User client);
    List<Project> findByFreelancer(User freelancer);
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByTitleContainingIgnoreCase(String title);
    long countByStatus(ProjectStatus status);
}
