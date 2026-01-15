package com.example.Taskora.dto.response;

import com.example.Taskora.entity.ProjectStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal budget;
    private ProjectStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private Long clientId;
    private String clientName;
    private Long userId;
    private String userFullName;
}
