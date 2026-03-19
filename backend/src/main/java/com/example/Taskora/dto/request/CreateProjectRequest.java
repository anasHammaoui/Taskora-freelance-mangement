package com.example.Taskora.dto.request;

import com.example.Taskora.entity.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateProjectRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private BigDecimal budget;

    @NotNull(message = "Status is required")
    private ProjectStatus status;

    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull(message = "Client ID is required")
    private Long clientId;

    @NotNull(message = "User ID is required")
    private Long userId;
}
