package com.example.Taskora.dto.response;

import com.example.Taskora.entity.InvoiceStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private InvoiceStatus status;
    private BigDecimal taxRate;
    private BigDecimal totalHT;
    private BigDecimal totalTVA;
    private BigDecimal totalTTC;
    private LocalDateTime createdAt;
    private Long projectId;
    private String projectTitle;
    private Long userId;
    private String userFullName;
    private List<InvoiceLineResponse> lines;
}
