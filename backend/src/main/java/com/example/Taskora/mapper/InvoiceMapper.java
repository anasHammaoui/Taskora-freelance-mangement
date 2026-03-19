package com.example.Taskora.mapper;

import com.example.Taskora.dto.request.CreateInvoiceRequest;
import com.example.Taskora.dto.response.InvoiceResponse;
import com.example.Taskora.entity.Invoice;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {InvoiceLineMapper.class})
public interface InvoiceMapper {

    @Mapping(target = "project", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "lines", ignore = true)
    @Mapping(target = "invoiceNumber", ignore = true)
    @Mapping(target = "totalHT", ignore = true)
    @Mapping(target = "totalTVA", ignore = true)
    @Mapping(target = "totalTTC", ignore = true)
    @Mapping(target = "status", ignore = true)
    Invoice toEntity(CreateInvoiceRequest request);

    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "project.title", target = "projectTitle")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "userFullName")
    InvoiceResponse toResponse(Invoice invoice);
}
