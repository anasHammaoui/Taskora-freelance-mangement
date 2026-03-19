package com.example.Taskora.service;

import com.example.Taskora.dto.request.CreateInvoiceRequest;
import com.example.Taskora.dto.response.InvoiceResponse;
import com.example.Taskora.entity.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InvoiceService {
    InvoiceResponse createInvoice(CreateInvoiceRequest request);
    InvoiceResponse getInvoiceById(Long id);
    Page<InvoiceResponse> getAllInvoices(Pageable pageable);
    Page<InvoiceResponse> getInvoicesByUser(Long userId, Pageable pageable);
    Page<InvoiceResponse> getInvoicesByProject(Long projectId, Pageable pageable);
    Page<InvoiceResponse> getInvoicesByUserAndStatus(Long userId, InvoiceStatus status, Pageable pageable);
    InvoiceResponse markAsPaid(Long id);
    InvoiceResponse cancelInvoice(Long id);
    void deleteInvoice(Long id);
}
