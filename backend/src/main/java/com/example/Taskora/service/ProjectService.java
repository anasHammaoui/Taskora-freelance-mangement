package com.example.Taskora.service;

import com.example.Taskora.dto.request.CreateProjectRequest;
import com.example.Taskora.dto.response.ProjectResponse;
import com.example.Taskora.entity.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectService {
    ProjectResponse createProject(CreateProjectRequest request);
    ProjectResponse getProjectById(Long id);
    Page<ProjectResponse> getAllProjects(Pageable pageable);
    Page<ProjectResponse> getProjectsByUser(Long userId, Pageable pageable);
    Page<ProjectResponse> getProjectsByStatus(ProjectStatus status, Pageable pageable);
    Page<ProjectResponse> getProjectsByUserAndStatus(Long userId, ProjectStatus status, Pageable pageable);
    ProjectResponse updateProject(Long id, CreateProjectRequest request);
    ProjectResponse markAsComplete(Long id);
    void deleteProject(Long id);
}
