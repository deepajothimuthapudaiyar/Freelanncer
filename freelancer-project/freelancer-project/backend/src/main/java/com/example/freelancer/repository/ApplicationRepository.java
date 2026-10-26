package com.example.freelancer.repository;

import com.example.freelancer.model.Application;
import com.example.freelancer.model.ApplicationStatus;
import com.example.freelancer.model.Project;
import com.example.freelancer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByProject(Project project);
    List<Application> findByFreelancer(User freelancer);
    Optional<Application> findByProjectAndFreelancer(Project project, User freelancer);
    boolean existsByProjectAndFreelancer(Project project, User freelancer);
    List<Application> findByProjectAndStatus(Project project, ApplicationStatus status);
}
