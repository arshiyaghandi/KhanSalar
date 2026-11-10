package com.khansalar.gateway.controller;

import com.khansalar.common.dto.ApiResponse;
import com.khansalar.gateway.dto.AuthDto;
import com.khansalar.gateway.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtils jwtUtils;

    // Default system seed users for development and testing
    private static final Map<String, UserProfile> USERS = Map.of(
            "admin", new UserProfile("admin123", "System Administrator", List.of("ROLE_ADMIN", "ROLE_ACCOUNTANT")),
            "cashier", new UserProfile("123456", "Restaurant Cashier", List.of("ROLE_CASHIER")),
            "waiter", new UserProfile("123456", "Floor Waiter", List.of("ROLE_WAITER"))
    );

    @PostMapping("/login")
    public Mono<ResponseEntity<ApiResponse<AuthDto.LoginResponse>>> login(@RequestBody AuthDto.LoginRequest request) {
        UserProfile user = USERS.get(request.getUsername());

        if (user != null && user.password().equals(request.getPassword())) {
            String token = jwtUtils.generateToken(request.getUsername(), user.roles());
            AuthDto.LoginResponse response = AuthDto.LoginResponse.builder()
                    .token(token)
                    .username(request.getUsername())
                    .fullName(user.fullName())
                    .roles(user.roles())
                    .build();

            return Mono.just(ResponseEntity.ok(ApiResponse.ok("Login successful", response)));
        }

        return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Invalid username or password")));
    }

    private record UserProfile(String password, String fullName, List<String> roles) {}
}
