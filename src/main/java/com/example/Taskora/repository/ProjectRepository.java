package com.example.Taskora.repository;

import com.example.Taskora.entity.Project;
import com.example.Taskora.entity.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByUserId(Long userId, Pageable pageable);
    Page<Project> findByClientId(Long clientId, Pageable pageable);
    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);
    Page<Project> findByUserIdAndStatus(Long userId, ProjectStatus status, Pageable pageable);
    long countByUserIdAndStatus(Long userId, ProjectStatus status);
    long countByStatus(ProjectStatus status);
}
