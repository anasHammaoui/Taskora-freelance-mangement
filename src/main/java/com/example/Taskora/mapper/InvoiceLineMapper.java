package com.example.Taskora.mapper;

import com.example.Taskora.dto.request.CreateInvoiceLineRequest;
import com.example.Taskora.dto.response.InvoiceLineResponse;
import com.example.Taskora.entity.InvoiceLine;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface InvoiceLineMapper {

    @Mapping(target = "invoice", ignore = true)
    @Mapping(target = "subtotal", ignore = true)
    InvoiceLine toEntity(CreateInvoiceLineRequest request);

    InvoiceLineResponse toResponse(InvoiceLine invoiceLine);
}
