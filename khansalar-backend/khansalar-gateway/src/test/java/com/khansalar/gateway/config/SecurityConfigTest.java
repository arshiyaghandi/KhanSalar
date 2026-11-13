package com.khansalar.gateway.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khansalar.gateway.security.AuthenticationManager;
import com.khansalar.gateway.security.SecurityContextRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebHandler;
import reactor.core.publisher.Mono;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class SecurityConfigTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private SecurityContextRepository securityContextRepository;

    private WebTestClient webTestClient;

    @BeforeEach
    void setUp() {
        when(securityContextRepository.load(any())).thenReturn(Mono.empty());

        SecurityConfig securityConfig = new SecurityConfig(
                authenticationManager,
                securityContextRepository,
                new ObjectMapper().findAndRegisterModules()
        );

        ServerHttpSecurity http = ServerHttpSecurity.http();
        SecurityWebFilterChain filterChain = securityConfig.securityWebFilterChain(http);

        WebHandler dummyHandler = exchange -> {
            exchange.getResponse().setRawStatusCode(200);
            return exchange.getResponse().setComplete();
        };

        List<WebFilter> webFilters = filterChain.getWebFilters().collectList().block();
        var clientBuilder = WebTestClient.bindToWebHandler(dummyHandler);
        if (webFilters != null) {
            for (WebFilter filter : webFilters) {
                clientBuilder.webFilter(filter);
            }
        }

        this.webTestClient = clientBuilder.build();
    }

    @Test
    @DisplayName("Reservations GET and POST endpoints must require authentication and reject unauthenticated requests with 401")
    void testReservationsEndpointsRequireAuth() {
        webTestClient.get()
                .uri("/api/v1/reservations")
                .exchange()
                .expectStatus().isUnauthorized();

        webTestClient.post()
                .uri("/api/v1/reservations")
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    @DisplayName("Analytics endpoints must require authentication and reject unauthenticated requests with 401")
    void testAnalyticsEndpointsRequireAuth() {
        webTestClient.get()
                .uri("/api/v1/analytics/summary")
                .exchange()
                .expectStatus().isUnauthorized();

        webTestClient.get()
                .uri("/api/v1/analytics/menu-engineering")
                .exchange()
                .expectStatus().isUnauthorized();
    }

    @Test
    @DisplayName("Public endpoints (menu, tables, guest) must be permitted without authentication")
    void testPublicEndpointsPermitted() {
        webTestClient.get()
                .uri("/api/v1/menu")
                .exchange()
                .expectStatus().isOk();

        webTestClient.get()
                .uri("/api/v1/tables")
                .exchange()
                .expectStatus().isOk();

        webTestClient.get()
                .uri("/api/v1/guest/menu")
                .exchange()
                .expectStatus().isOk();

        webTestClient.post()
                .uri("/api/v1/guest/orders")
                .exchange()
                .expectStatus().isOk();
    }
}
