package com.example.Taskora.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class InvoiceLineResponse {
    private Long id;
    private String description;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}
