package com.example.Taskora.service.impl;

import com.example.Taskora.dto.request.CreateTaskRequest;
import com.example.Taskora.dto.response.TaskResponse;
import com.example.Taskora.entity.Project;
import com.example.Taskora.entity.Task;
import com.example.Taskora.entity.TaskStatus;
import com.example.Taskora.entity.User;
import com.example.Taskora.exception.ResourceNotFoundException;
import com.example.Taskora.mapper.TaskMapper;
import com.example.Taskora.repository.ProjectRepository;
import com.example.Taskora.repository.TaskRepository;
import com.example.Taskora.repository.UserRepository;
import com.example.Taskora.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    @Override
    public TaskResponse createTask(CreateTaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", request.getProjectId()));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getUserId()));
        Task task = taskMapper.toEntity(request);
        task.setProject(project);
        task.setUser(user);
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.A_FAIRE);
        }
        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        return taskMapper.toResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksByProject(Long projectId, Pageable pageable) {
        return taskRepository.findByProjectId(projectId, pageable).map(taskMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksByProjectAndStatus(Long projectId, TaskStatus status, Pageable pageable) {
        return taskRepository.findByProjectIdAndStatus(projectId, status, pageable).map(taskMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksByUser(Long userId, Pageable pageable) {
        return taskRepository.findByUserId(userId, pageable).map(taskMapper::toResponse);
    }

    @Override
    public TaskResponse updateTask(Long id, CreateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", request.getProjectId()));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getUserId()));
        taskMapper.updateEntityFromRequest(request, task);
        task.setProject(project);
        task.setUser(user);
        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }

    @Override
    public TaskResponse markAsDone(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));
        task.setStatus(TaskStatus.TERMINEE);
        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task", id);
        }
        taskRepository.deleteById(id);
    }
}
