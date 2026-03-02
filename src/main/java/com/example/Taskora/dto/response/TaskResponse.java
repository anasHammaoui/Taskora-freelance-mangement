package com.example.Taskora.dto.response;

import com.example.Taskora.entity.TaskStatus;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private TaskStatus status;
    private LocalDateTime createdAt;
    private Long projectId;
    private String projectTitle;
    private Long userId;
    private String userFullName;
}
