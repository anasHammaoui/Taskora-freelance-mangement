package com.example.Taskora.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClientResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String company;
    private LocalDateTime createdAt;
    private Long userId;
    private String userFullName;
}
