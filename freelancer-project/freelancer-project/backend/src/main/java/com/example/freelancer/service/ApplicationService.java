package com.example.freelancer.service;

import com.example.freelancer.dto.ApplicationRequest;
import com.example.freelancer.exception.BadRequestException;
import com.example.freelancer.exception.ResourceNotFoundException;
import com.example.freelancer.exception.UnauthorizedActionException;
import com.example.freelancer.model.*;
import com.example.freelancer.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ProjectService projectService;
    private final NotificationService notificationService;

    public Application apply(ApplicationRequest request, User freelancer) {
        if (freelancer.getRole() != Role.ROLE_FREELANCER) {
            throw new UnauthorizedActionException("Only freelancers can apply to projects");
        }
        Project project = projectService.getProjectById(request.getProjectId());

        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new BadRequestException("This project is not open for applications");
        }
        if (project.getClient().getId().equals(freelancer.getId())) {
            throw new BadRequestException("You cannot apply to your own project");
        }
        if (applicationRepository.existsByProjectAndFreelancer(project, freelancer)) {
            throw new BadRequestException("You have already applied to this project");
        }

        Application application = Application.builder()
                .project(project)
                .freelancer(freelancer)
                .bidAmount(request.getBidAmount())
                .deliveryDays(request.getDeliveryDays())
                .proposal(request.getProposal())
                .status(ApplicationStatus.PENDING)
                .build();
        Application saved = applicationRepository.save(application);

        notificationService.notify(project.getClient(),
                freelancer.getName() + " applied to your project: " + project.getTitle());

        return saved;
    }

    public List<Application> getApplicationsForProject(Long projectId, User requester) {
        Project project = projectService.getProjectById(projectId);
        if (requester.getRole() == Role.ROLE_CLIENT && !project.getClient().getId().equals(requester.getId())) {
            throw new UnauthorizedActionException("You cannot view applications for this project");
        }
        return applicationRepository.findByProject(project);
    }

    public List<Application> getApplicationsForFreelancer(Long freelancerId, User requester) {
        if (!requester.getId().equals(freelancerId) && requester.getRole() != Role.ROLE_ADMIN) {
            throw new UnauthorizedActionException("You cannot view another freelancer's applications");
        }
        User freelancer = requester;
        return applicationRepository.findByFreelancer(freelancer);
    }

    public Application acceptApplication(Long applicationId, User client) {
        Application application = getApplication(applicationId);
        Project project = application.getProject();

        if (!project.getClient().getId().equals(client.getId())) {
            throw new UnauthorizedActionException("Only the project owner can accept applications");
        }
        if (project.getStatus() != ProjectStatus.OPEN) {
            throw new BadRequestException("Project is not open");
        }

        application.setStatus(ApplicationStatus.ACCEPTED);
        applicationRepository.save(application);

        projectService.assignFreelancer(project.getId(), application.getFreelancer());

        List<Application> others = applicationRepository.findByProject(project);
        for (Application other : others) {
            if (!other.getId().equals(application.getId()) && other.getStatus() == ApplicationStatus.PENDING) {
                other.setStatus(ApplicationStatus.REJECTED);
                applicationRepository.save(other);
                notificationService.notify(other.getFreelancer(),
                        "Your application for '" + project.getTitle() + "' was not selected");
            }
        }

        notificationService.notify(application.getFreelancer(),
                "You were accepted for the project: " + project.getTitle());
        notificationService.notify(project.getClient(),
                "Project '" + project.getTitle() + "' has been assigned to " + application.getFreelancer().getName());

        return application;
    }

    public Application rejectApplication(Long applicationId, User client) {
        Application application = getApplication(applicationId);
        Project project = application.getProject();

        if (!project.getClient().getId().equals(client.getId())) {
            throw new UnauthorizedActionException("Only the project owner can reject applications");
        }

        application.setStatus(ApplicationStatus.REJECTED);
        applicationRepository.save(application);

        notificationService.notify(application.getFreelancer(),
                "Your application for '" + project.getTitle() + "' was rejected");

        return application;
    }

    private Application getApplication(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
    }
}
