package com.example.freelancer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalUsers;
    private long totalClients;
    private long totalFreelancers;
    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
}
