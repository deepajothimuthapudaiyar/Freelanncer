package com.example.freelancer.repository;

import com.example.freelancer.model.FileEntity;
import com.example.freelancer.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
    List<FileEntity> findByProject(Project project);
}
