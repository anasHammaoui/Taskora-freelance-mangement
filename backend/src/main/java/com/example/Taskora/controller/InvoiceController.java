package com.example.Taskora.controller;

import com.example.Taskora.dto.request.CreateInvoiceRequest;
import com.example.Taskora.dto.response.InvoiceResponse;
import com.example.Taskora.entity.InvoiceStatus;
import com.example.Taskora.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoice Management", description = "APIs for managing invoices")
@PreAuthorize("hasRole('FREELANCER')")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    @Operation(summary = "Create a new invoice with automatic number, HT/TVA/TTC calculation")
    public ResponseEntity<InvoiceResponse> createInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.createInvoice(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get invoice by ID")
    public ResponseEntity<InvoiceResponse> getInvoiceById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @GetMapping
    @Operation(summary = "Get all invoices")
    public ResponseEntity<Page<InvoiceResponse>> getAllInvoices(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(invoiceService.getAllInvoices(pageable));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get invoices for a specific user, optionally filtered by status")
    public ResponseEntity<Page<InvoiceResponse>> getInvoicesByUser(
            @PathVariable Long userId,
            @RequestParam(required = false) InvoiceStatus status,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        if (status != null) {
            return ResponseEntity.ok(invoiceService.getInvoicesByUserAndStatus(userId, status, pageable));
        }
        return ResponseEntity.ok(invoiceService.getInvoicesByUser(userId, pageable));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get invoices for a specific project")
    public ResponseEntity<Page<InvoiceResponse>> getInvoicesByProject(
            @PathVariable Long projectId,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(invoiceService.getInvoicesByProject(projectId, pageable));
    }

    @PatchMapping("/{id}/pay")
    @Operation(summary = "Mark invoice as paid")
    public ResponseEntity<InvoiceResponse> markAsPaid(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.markAsPaid(id));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel an invoice")
    public ResponseEntity<InvoiceResponse> cancelInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.cancelInvoice(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an invoice")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}
