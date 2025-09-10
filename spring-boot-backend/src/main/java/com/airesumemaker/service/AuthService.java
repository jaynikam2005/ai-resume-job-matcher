package com.airesumemaker.service;

import com.airesumemaker.dto.AuthRequest;
import com.airesumemaker.dto.AuthResponse;
import com.airesumemaker.dto.RegisterRequest;
import com.airesumemaker.dto.ResumeLoginRequest;
import com.airesumemaker.entity.User;
import com.airesumemaker.repository.UserRepository;
import com.airesumemaker.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager, UserDetailsServiceImpl userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(User.Role.valueOf(request.getRole()));

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole().toString());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole().toString());
    }

    public AuthResponse resumeLogin(ResumeLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseGet(() -> {
            User u = new User();
            String email = request.getEmail();
            String suggestedUsername = email.substring(0, email.indexOf('@'));
            String username = suggestedUsername;
            int suffix = 1;
            while (userRepository.existsByUsername(username)) {
                username = suggestedUsername + suffix++;
            }
            u.setUsername(username);
            u.setEmail(email);
            // generate a random password so account is valid even if later password is set
            u.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
            u.setFirstName(request.getFirstName() != null ? request.getFirstName() : "");
            u.setLastName(request.getLastName() != null ? request.getLastName() : "");
            u.setRole(User.Role.JOB_SEEKER);
            return userRepository.save(u);
        });

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole().toString());
    }
}
