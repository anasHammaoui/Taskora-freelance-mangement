package com.example.Taskora.mapper;

import com.example.Taskora.dto.request.CreateTaskRequest;
import com.example.Taskora.dto.response.TaskResponse;
import com.example.Taskora.entity.Task;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping(target = "project", ignore = true)
    @Mapping(target = "user", ignore = true)
    Task toEntity(CreateTaskRequest request);

    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "project.title", target = "projectTitle")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "userFullName")
    TaskResponse toResponse(Task task);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateEntityFromRequest(CreateTaskRequest request, @MappingTarget Task task);
}
