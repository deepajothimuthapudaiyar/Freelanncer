package com.example.freelancer.dto;

import com.example.freelancer.model.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDashboardResponse {
    private long totalProjects;
    private long openProjects;
    private long activeProjects;
    private long completedProjects;
    private List<Project> recentProjects;
}
