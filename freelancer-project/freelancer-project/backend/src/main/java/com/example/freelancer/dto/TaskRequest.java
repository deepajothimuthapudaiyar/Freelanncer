package com.example.freelancer.dto;

import com.example.freelancer.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TaskRequest {
    private Long projectId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private TaskStatus status;
}
