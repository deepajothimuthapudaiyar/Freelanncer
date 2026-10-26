package com.example.freelancer.service;

import com.example.freelancer.dto.ProjectProgressResponse;
import com.example.freelancer.dto.TaskRequest;
import com.example.freelancer.exception.BadRequestException;
import com.example.freelancer.exception.ResourceNotFoundException;
import com.example.freelancer.exception.UnauthorizedActionException;
import com.example.freelancer.model.Project;
import com.example.freelancer.model.Task;
import com.example.freelancer.model.TaskStatus;
import com.example.freelancer.model.User;
import com.example.freelancer.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;

    public Task createTask(TaskRequest request, User requester) {
        Project project = projectService.getProjectById(request.getProjectId());
        validateAssignedFreelancer(project, requester);

        Task task = Task.builder()
                .project(project)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .build();
        return taskRepository.save(task);
    }

    public List<Task> getTasksForProject(Long projectId) {
        Project project = projectService.getProjectById(projectId);
        return taskRepository.findByProject(project);
    }

    public Task updateTask(Long id, TaskRequest request, User requester) {
        Task task = getTask(id);
        validateAssignedFreelancer(task.getProject(), requester);

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        return taskRepository.save(task);
    }

    public void deleteTask(Long id, User requester) {
        Task task = getTask(id);
        validateAssignedFreelancer(task.getProject(), requester);
        taskRepository.delete(task);
    }

    public ProjectProgressResponse getProgress(Long projectId) {
        Project project = projectService.getProjectById(projectId);
        long total = taskRepository.countByProject(project);
        long completed = taskRepository.countByProjectAndStatus(project, TaskStatus.COMPLETED);
        double percentage = total == 0 ? 0.0 : (completed * 100.0) / total;
        return ProjectProgressResponse.builder()
                .totalTasks(total)
                .completedTasks(completed)
                .progressPercentage(Math.round(percentage * 100.0) / 100.0)
                .build();
    }

    private Task getTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private void validateAssignedFreelancer(Project project, User requester) {
        if (project.getFreelancer() == null || !project.getFreelancer().getId().equals(requester.getId())) {
            throw new UnauthorizedActionException("Only the assigned freelancer can manage tasks for this project");
        }
    }
}
