package com.example.freelancer.controller;

import com.example.freelancer.model.FileEntity;
import com.example.freelancer.security.CustomUserDetails;
import com.example.freelancer.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileEntity> upload(@RequestParam("projectId") Long projectId,
                                               @RequestParam("file") MultipartFile file,
                                               @AuthenticationPrincipal CustomUserDetails principal) {
        return new ResponseEntity<>(fileService.uploadFile(projectId, file, principal.getUser()), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FileEntity> getFile(@PathVariable Long id) {
        return ResponseEntity.ok(fileService.getFile(id));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<FileEntity>> getForProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(fileService.getFilesForProject(projectId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
        fileService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }
}
