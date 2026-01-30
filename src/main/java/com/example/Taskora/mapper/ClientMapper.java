package com.example.Taskora.mapper;

import com.example.Taskora.dto.request.CreateClientRequest;
import com.example.Taskora.dto.response.ClientResponse;
import com.example.Taskora.entity.Client;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ClientMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "projects", ignore = true)
    Client toEntity(CreateClientRequest request);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "userFullName")
    ClientResponse toResponse(Client client);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "projects", ignore = true)
    void updateEntityFromRequest(CreateClientRequest request, @MappingTarget Client client);
}
