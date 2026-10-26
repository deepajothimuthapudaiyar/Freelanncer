package com.example.freelancer.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "freelancer_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FreelancerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 1000)
    private String skills;

    @Column(length = 2000)
    private String bio;

    @Column(length = 2000)
    private String portfolio;

    @Builder.Default
    private Double averageRating = 0.0;
}
