package com.example.Taskora.controller;

import com.example.Taskora.dto.request.CreateTaskRequest;
import com.example.Taskora.dto.response.TaskResponse;
import com.example.Taskora.entity.TaskStatus;
import com.example.Taskora.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Task Management", description = "APIs for managing tasks")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get all tasks for a project, optionally filtered by status")
    public ResponseEntity<Page<TaskResponse>> getTasksByProject(
            @PathVariable Long projectId,
            @RequestParam(required = false) TaskStatus status,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        if (status != null) {
            return ResponseEntity.ok(taskService.getTasksByProjectAndStatus(projectId, status, pageable));
        }
        return ResponseEntity.ok(taskService.getTasksByProject(projectId, pageable));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all tasks for a specific user")
    public ResponseEntity<Page<TaskResponse>> getTasksByUser(
            @PathVariable Long userId,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(taskService.getTasksByUser(userId, pageable));
    }

    @PatchMapping("/{id}/done")
    @Operation(summary = "Mark a task as done")
    public ResponseEntity<TaskResponse> markAsDone(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.markAsDone(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a task")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
