package com.example.Taskora.service;

import com.example.Taskora.dto.request.LoginRequest;
import com.example.Taskora.dto.request.RegisterRequest;
import com.example.Taskora.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
