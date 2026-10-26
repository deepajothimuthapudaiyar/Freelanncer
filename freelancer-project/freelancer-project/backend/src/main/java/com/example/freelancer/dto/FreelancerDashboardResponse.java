package com.example.freelancer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FreelancerDashboardResponse {
    private long appliedProjects;
    private long acceptedProjects;
    private long activeProjects;
    private long completedProjects;
    private double averageRating;
}
