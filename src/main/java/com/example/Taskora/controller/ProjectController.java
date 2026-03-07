package com.example.Taskora.controller;

import com.example.Taskora.dto.request.CreateProjectRequest;
import com.example.Taskora.dto.response.ProjectResponse;
import com.example.Taskora.entity.ProjectStatus;
import com.example.Taskora.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project Management", description = "APIs for managing projects")
@PreAuthorize("hasRole('FREELANCER')")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @Operation(summary = "Create a new project")
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping
    @Operation(summary = "Get all projects, optionally filtered by status")
    public ResponseEntity<Page<ProjectResponse>> getAllProjects(
            @RequestParam(required = false) ProjectStatus status,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        if (status != null) {
            return ResponseEntity.ok(projectService.getProjectsByStatus(status, pageable));
        }
        return ResponseEntity.ok(projectService.getAllProjects(pageable));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all projects for a specific user, optionally filtered by status")
    public ResponseEntity<Page<ProjectResponse>> getProjectsByUser(
            @PathVariable Long userId,
            @RequestParam(required = false) ProjectStatus status,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        if (status != null) {
            return ResponseEntity.ok(projectService.getProjectsByUserAndStatus(userId, status, pageable));
        }
        return ResponseEntity.ok(projectService.getProjectsByUser(userId, pageable));
    }

    @PatchMapping("/{id}/complete")
    @Operation(summary = "Mark project as complete")
    public ResponseEntity<ProjectResponse> markAsComplete(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.markAsComplete(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a project")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
