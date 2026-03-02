package com.example.Taskora.service.impl;

import com.example.Taskora.dto.request.CreateInvoiceLineRequest;
import com.example.Taskora.dto.request.CreateInvoiceRequest;
import com.example.Taskora.dto.response.InvoiceResponse;
import com.example.Taskora.entity.*;
import com.example.Taskora.exception.ResourceNotFoundException;
import com.example.Taskora.mapper.InvoiceLineMapper;
import com.example.Taskora.mapper.InvoiceMapper;
import com.example.Taskora.repository.InvoiceRepository;
import com.example.Taskora.repository.ProjectRepository;
import com.example.Taskora.repository.UserRepository;
import com.example.Taskora.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final InvoiceMapper invoiceMapper;
    private final InvoiceLineMapper invoiceLineMapper;

    @Override
    public InvoiceResponse createInvoice(CreateInvoiceRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", request.getProjectId()));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getUserId()));

        Invoice invoice = invoiceMapper.toEntity(request);
        invoice.setProject(project);
        invoice.setUser(user);
        invoice.setStatus(InvoiceStatus.EN_ATTENTE);
        invoice.setInvoiceNumber(generateInvoiceNumber());

        if (request.getTaxRate() != null) {
            invoice.setTaxRate(request.getTaxRate());
        }

        // Build lines and compute totals
        List<InvoiceLine> lines = new ArrayList<>();
        BigDecimal totalHT = BigDecimal.ZERO;

        for (CreateInvoiceLineRequest lineReq : request.getLines()) {
            InvoiceLine line = invoiceLineMapper.toEntity(lineReq);
            BigDecimal subtotal = lineReq.getUnitPrice()
                    .multiply(new BigDecimal(lineReq.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);
            line.setSubtotal(subtotal);
            line.setInvoice(invoice);
            lines.add(line);
            totalHT = totalHT.add(subtotal);
        }

        invoice.setLines(lines);
        invoice.setTotalHT(totalHT.setScale(2, RoundingMode.HALF_UP));

        BigDecimal taxRate = invoice.getTaxRate();
        BigDecimal totalTVA = totalHT.multiply(taxRate)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal totalTTC = totalHT.add(totalTVA).setScale(2, RoundingMode.HALF_UP);

        invoice.setTotalTVA(totalTVA);
        invoice.setTotalTTC(totalTTC);

        Invoice saved = invoiceRepository.save(invoice);
        return invoiceMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", id));
        return invoiceMapper.toResponse(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getAllInvoices(Pageable pageable) {
        return invoiceRepository.findAll(pageable).map(invoiceMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesByUser(Long userId, Pageable pageable) {
        return invoiceRepository.findByUserId(userId, pageable).map(invoiceMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesByProject(Long projectId, Pageable pageable) {
        return invoiceRepository.findByProjectId(projectId, pageable).map(invoiceMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesByUserAndStatus(Long userId, InvoiceStatus status, Pageable pageable) {
        return invoiceRepository.findByUserIdAndStatus(userId, status, pageable).map(invoiceMapper::toResponse);
    }

    @Override
    public InvoiceResponse markAsPaid(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", id));
        invoice.setStatus(InvoiceStatus.PAYEE);
        Invoice saved = invoiceRepository.save(invoice);
        return invoiceMapper.toResponse(saved);
    }

    @Override
    public InvoiceResponse cancelInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", id));
        invoice.setStatus(InvoiceStatus.ANNULEE);
        Invoice saved = invoiceRepository.save(invoice);
        return invoiceMapper.toResponse(saved);
    }

    @Override
    public void deleteInvoice(Long id) {
        if (!invoiceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Invoice", id);
        }
        invoiceRepository.deleteById(id);
    }

    private String generateInvoiceNumber() {
        LocalDate now = LocalDate.now();
        String prefix = "INV-" + now.format(DateTimeFormatter.ofPattern("yyyyMM")) + "-";
        long count = invoiceRepository.countByYearAndMonth(now.getYear(), now.getMonthValue());
        String sequence = String.format("%04d", count + 1);
        String candidate = prefix + sequence;
        // Ensure uniqueness
        while (invoiceRepository.existsByInvoiceNumber(candidate)) {
            count++;
            candidate = prefix + String.format("%04d", count + 1);
        }
        return candidate;
    }
}
