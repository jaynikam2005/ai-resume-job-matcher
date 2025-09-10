package com.airesumemaker.controller;

import com.airesumemaker.dto.AuthRequest;
import com.airesumemaker.dto.AuthResponse;
import com.airesumemaker.dto.RegisterRequest;
import com.airesumemaker.dto.ResumeLoginRequest;
import com.airesumemaker.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import com.airesumemaker.entity.User;
import com.airesumemaker.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/resume-login")
    public ResponseEntity<AuthResponse> resumeLogin(@Valid @RequestBody ResumeLoginRequest request) {
        return ResponseEntity.ok(authService.resumeLogin(request));
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
