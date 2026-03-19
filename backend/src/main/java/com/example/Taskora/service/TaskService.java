package com.example.Taskora.service;

import com.example.Taskora.dto.request.CreateTaskRequest;
import com.example.Taskora.dto.response.TaskResponse;
import com.example.Taskora.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {
    TaskResponse createTask(CreateTaskRequest request);
    TaskResponse getTaskById(Long id);
    Page<TaskResponse> getTasksByProject(Long projectId, Pageable pageable);
    Page<TaskResponse> getTasksByProjectAndStatus(Long projectId, TaskStatus status, Pageable pageable);
    Page<TaskResponse> getTasksByUser(Long userId, Pageable pageable);
    TaskResponse updateTask(Long id, CreateTaskRequest request);
    TaskResponse markAsDone(Long id);
    void deleteTask(Long id);
}
