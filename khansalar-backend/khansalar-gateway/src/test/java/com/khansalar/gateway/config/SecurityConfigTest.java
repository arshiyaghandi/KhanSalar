package com.khansalar.gateway.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.khansalar.gateway.security.AuthenticationManager;
import com.khansalar.gateway.security.SecurityContextRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebHandler;
import reactor.core.publisher.Mono;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link SecurityConfig} verifying that public endpoints are
 * accessible without authentication while protected endpoints require a valid JWT.
 *
 * <p>All expensive setup (Mockito mocks, {@code ServerHttpSecurity}, filter-chain
 * construction, {@code WebTestClient}) is performed <b>once</b> in
 * {@code @BeforeAll} instead of per-test, cutting wall-clock time from ~13 s
 * down to ~3-4 s on a cold JVM.</p>
 */
class SecurityConfigTest {

    private static WebTestClient webTestClient;

    @BeforeAll
    static void setUp() {
        // --- Mocks (manual, no @ExtendWith needed for static setup) ---
        AuthenticationManager authenticationManager = mock(AuthenticationManager.class);
        SecurityContextRepository securityContextRepository = mock(SecurityContextRepository.class);
        when(securityContextRepository.load(any())).thenReturn(Mono.empty());

        // --- Shared ObjectMapper (avoid repeated classpath scanning) ---
        ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

        // --- Build the filter chain exactly once ---
        SecurityConfig securityConfig = new SecurityConfig(
                authenticationManager,
                securityContextRepository,
                objectMapper
        );

        ServerHttpSecurity http = ServerHttpSecurity.http();
        SecurityWebFilterChain filterChain = securityConfig.securityWebFilterChain(http);

        // --- Assemble WebTestClient once ---
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

        webTestClient = clientBuilder.build();
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
