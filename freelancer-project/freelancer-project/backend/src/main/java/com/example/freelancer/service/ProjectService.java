package com.example.freelancer.service;

import com.example.freelancer.dto.ClientDashboardResponse;
import com.example.freelancer.dto.ProjectRequest;
import com.example.freelancer.exception.BadRequestException;
import com.example.freelancer.exception.ResourceNotFoundException;
import com.example.freelancer.exception.UnauthorizedActionException;
import com.example.freelancer.model.Project;
import com.example.freelancer.model.ProjectStatus;
import com.example.freelancer.model.Role;
import com.example.freelancer.model.User;
import com.example.freelancer.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public Project createProject(ProjectRequest request, User client) {
        if (client.getRole() != Role.ROLE_CLIENT) {
            throw new UnauthorizedActionException("Only clients can create projects");
        }
        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .budget(request.getBudget())
                .deadline(request.getDeadline())
                .status(ProjectStatus.OPEN)
                .client(client)
                .build();
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> searchProjects(String keyword, String status) {
        List<Project> projects;
        if (keyword != null && !keyword.isBlank()) {
            projects = projectRepository.findByTitleContainingIgnoreCase(keyword);
        } else {
            projects = projectRepository.findAll();
        }
        if (status != null && !status.isBlank()) {
            ProjectStatus ps = ProjectStatus.valueOf(status.toUpperCase());
            projects = projects.stream().filter(p -> p.getStatus() == ps).toList();
        }
        return projects;
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public List<Project> getProjectsByClient(User client) {
        return projectRepository.findByClient(client);
    }

    public List<Project> getProjectsByFreelancer(User freelancer) {
        return projectRepository.findByFreelancer(freelancer);
    }

    public Project updateProject(Long id, ProjectRequest request, User requester) {
        Project project = getProjectById(id);
        validateOwner(project, requester);
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setBudget(request.getBudget());
        project.setDeadline(request.getDeadline());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id, User requester) {
        Project project = getProjectById(id);
        if (requester.getRole() != Role.ROLE_ADMIN) {
            validateOwner(project, requester);
        }
        projectRepository.delete(project);
    }

    public Project assignFreelancer(Long projectId, User freelancer) {
        Project project = getProjectById(projectId);
        project.setFreelancer(freelancer);
        project.setStatus(ProjectStatus.IN_PROGRESS);
        return projectRepository.save(project);
    }

    public Project completeProject(Long id, User requester) {
        Project project = getProjectById(id);
        validateOwner(project, requester);
        if (project.getStatus() != ProjectStatus.IN_PROGRESS) {
            throw new BadRequestException("Only in-progress projects can be marked completed");
        }
        project.setStatus(ProjectStatus.COMPLETED);
        return projectRepository.save(project);
    }

    public Project cancelProject(Long id, User requester) {
        Project project = getProjectById(id);
        validateOwner(project, requester);
        project.setStatus(ProjectStatus.CANCELLED);
        return projectRepository.save(project);
    }

    private void validateOwner(Project project, User requester) {
        if (!project.getClient().getId().equals(requester.getId())) {
            throw new UnauthorizedActionException("You are not the owner of this project");
        }
    }

    public ClientDashboardResponse getClientDashboard(User client) {
        List<Project> projects = projectRepository.findByClient(client);
        long open = projects.stream().filter(p -> p.getStatus() == ProjectStatus.OPEN).count();
        long active = projects.stream().filter(p -> p.getStatus() == ProjectStatus.IN_PROGRESS).count();
        long completed = projects.stream().filter(p -> p.getStatus() == ProjectStatus.COMPLETED).count();
        List<Project> recent = projects.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .toList();
        return ClientDashboardResponse.builder()
                .totalProjects(projects.size())
                .openProjects(open)
                .activeProjects(active)
                .completedProjects(completed)
                .recentProjects(recent)
                .build();
    }
}
