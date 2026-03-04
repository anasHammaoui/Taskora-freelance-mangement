package com.example.Taskora.repository;

import com.example.Taskora.entity.Invoice;
import com.example.Taskora.entity.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Page<Invoice> findByUserId(Long userId, Pageable pageable);
    Page<Invoice> findByProjectId(Long projectId, Pageable pageable);
    Page<Invoice> findByUserIdAndStatus(Long userId, InvoiceStatus status, Pageable pageable);
    Page<Invoice> findByStatus(InvoiceStatus status, Pageable pageable);
    long countByUserIdAndStatus(Long userId, InvoiceStatus status);

    @Query("SELECT COALESCE(SUM(i.totalTTC), 0) FROM Invoice i WHERE i.user.id = :userId AND i.status = 'PAYEE' AND i.issueDate >= :startDate AND i.issueDate <= :endDate")
    BigDecimal sumPaidRevenueByUserAndPeriod(Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(i.totalTTC), 0) FROM Invoice i WHERE i.status = 'PAYEE' AND i.issueDate >= :startDate AND i.issueDate <= :endDate")
    BigDecimal sumTotalPaidRevenueByPeriod(LocalDate startDate, LocalDate endDate);

    @Query("SELECT i.issueDate, COALESCE(SUM(i.totalTTC), 0) FROM Invoice i WHERE i.user.id = :userId AND i.status = 'PAYEE' AND i.issueDate >= :startDate GROUP BY FUNCTION('MONTH', i.issueDate), FUNCTION('YEAR', i.issueDate) ORDER BY i.issueDate ASC")
    List<Object[]> findMonthlyRevenueByUser(Long userId, LocalDate startDate);

    @Query("SELECT i.issueDate, COALESCE(SUM(i.totalTTC), 0) FROM Invoice i WHERE i.status = 'PAYEE' AND i.issueDate >= :startDate GROUP BY FUNCTION('MONTH', i.issueDate), FUNCTION('YEAR', i.issueDate) ORDER BY i.issueDate ASC")
    List<Object[]> findMonthlyRevenueGlobal(LocalDate startDate);

    boolean existsByInvoiceNumber(String invoiceNumber);

    @Query("SELECT COUNT(i) FROM Invoice i WHERE FUNCTION('YEAR', i.issueDate) = :year AND FUNCTION('MONTH', i.issueDate) = :month")
    long countByYearAndMonth(int year, int month);
}
