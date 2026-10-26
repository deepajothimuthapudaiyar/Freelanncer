package com.example.freelancer.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationRequest {
    @NotNull(message = "Project id is required")
    private Long projectId;

    @NotNull(message = "Bid amount is required")
    private Double bidAmount;

    @NotNull(message = "Delivery days is required")
    private Integer deliveryDays;

    private String proposal;
}
