package com.example.Taskora.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateInvoiceRequest {

    private LocalDate issueDate;

    private LocalDate dueDate;

    private BigDecimal taxRate;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotEmpty(message = "At least one invoice line is required")
    @Valid
    private List<CreateInvoiceLineRequest> lines;
}
