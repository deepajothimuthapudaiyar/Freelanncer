package com.example.freelancer.service;

import com.example.freelancer.exception.BadRequestException;
import com.example.freelancer.exception.ResourceNotFoundException;
import com.example.freelancer.model.FileEntity;
import com.example.freelancer.model.Project;
import com.example.freelancer.model.User;
import com.example.freelancer.repository.FileRepository;
import com.example.freelancer.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final ProjectRepository projectRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public FileEntity uploadFile(Long projectId, MultipartFile file, User uploadedBy) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String originalName = file.getOriginalFilename();
            String storedName = UUID.randomUUID() + "_" + originalName;
            Path filePath = uploadPath.resolve(storedName);
            Files.copy(file.getInputStream(), filePath);

            FileEntity fileEntity = FileEntity.builder()
                    .project(project)
                    .fileName(originalName)
                    .filePath("/uploads/" + storedName)
                    .uploadedBy(uploadedBy)
                    .build();
            return fileRepository.save(fileEntity);
        } catch (IOException e) {
            throw new BadRequestException("Failed to store file: " + e.getMessage());
        }
    }

    public FileEntity getFile(Long id) {
        return fileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id: " + id));
    }

    public List<FileEntity> getFilesForProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        return fileRepository.findByProject(project);
    }

    public void deleteFile(Long id) {
        FileEntity file = getFile(id);
        try {
            Path path = Paths.get(uploadDir).resolve(Paths.get(file.getFilePath()).getFileName().toString());
            Files.deleteIfExists(path);
        } catch (IOException ignored) {
        }
        fileRepository.delete(file);
    }
}
