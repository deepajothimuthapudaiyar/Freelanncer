package com.example.freelancer.repository;

import com.example.freelancer.model.Project;
import com.example.freelancer.model.Task;
import com.example.freelancer.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProject(Project project);
    long countByProject(Project project);
    long countByProjectAndStatus(Project project, TaskStatus status);
}
