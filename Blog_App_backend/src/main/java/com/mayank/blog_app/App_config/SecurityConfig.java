package com.mayank.blog_app.App_config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.mayank.blog_app.security.JwtAuthEntryPoint;
import com.mayank.blog_app.security.JwtAuthFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;

    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // AUTHENTICATION PROVIDER
    // =========================================================

    @Bean
    public DaoAuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService) {

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of("*"));

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration);

        return source;
    }

    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // -------------------------------------------------
                // CSRF
                // -------------------------------------------------

                .csrf(csrf -> csrf.disable())

                // -------------------------------------------------
                // CORS
                // -------------------------------------------------

                .cors(cors -> cors.configurationSource(
                        corsConfigurationSource()))

                // -------------------------------------------------
                // UNAUTHORIZED HANDLER
                // -------------------------------------------------

                .exceptionHandling(exception ->

                exception.authenticationEntryPoint(
                        jwtAuthEntryPoint))

                // -------------------------------------------------
                // STATELESS JWT SESSION
                // -------------------------------------------------

                .sessionManagement(session ->

                session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS))

                // =================================================
                // AUTHORIZATION RULES
                // =================================================

                .authorizeHttpRequests(auth -> auth

                        // =========================================
                        // AUTH APIs
                        // =========================================

                        // Anyone can register
                        .requestMatchers(
                                "/api/auth/register")
                        .permitAll()

                        // Anyone can login
                        .requestMatchers(
                                "/api/auth/login")
                        .permitAll()

                        // Must be logged in to get current user
                        .requestMatchers(
                                "/api/auth/me")
                        .authenticated()

                        // =========================================
                        // PUBLIC POST APIs
                        // =========================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/posts",
                                "/api/posts/**",
                                "/api/post/**",
                                "/api/posts/search")
                        .permitAll()

                        // =========================================
                        // PUBLIC CATEGORY APIs
                        // =========================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/category/**")
                        .permitAll()

                        // =========================================
                        // GET POSTS BY USER
                        // =========================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/user/*/posts")
                        .permitAll()

                        // =========================================
                        // GET POSTS BY CATEGORY
                        // =========================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/category/*/posts")
                        .permitAll()

                        // =========================================
                        // IMAGES / FILES
                        // =========================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/images/**",
                                "/file/**")
                        .permitAll()

                        // =========================================
                        // CREATE POST
                        // =========================================

                        /*
                         * IMPORTANT:
                         *
                         * This MUST come BEFORE:
                         *
                         * /api/user/**
                         *
                         * because the create-post URL also starts
                         * with /api/user/.
                         *
                         * Example:
                         *
                         * POST /api/user/3/category/2
                         */

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/user/*/category/*")
                        .authenticated()

                        // =========================================
                        // CATEGORY MANAGEMENT
                        // ADMIN ONLY
                        // =========================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/category/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/category/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/category/**")
                        .hasRole("ADMIN")

                        // =========================================
                        // USER MANAGEMENT
                        // ADMIN ONLY
                        // =========================================

                        /*
                         * Keep this AFTER the create-post matcher.
                         */

                        .requestMatchers(
                                "/api/user/**")
                        .hasRole("ADMIN")

                        // =========================================
                        // EVERYTHING ELSE
                        // =========================================

                        /*
                         * Update post
                         * Delete post
                         * Add comment
                         * Upload image
                         * etc.
                         *
                         * User must be logged in.
                         */

                        .anyRequest()
                        .authenticated())

                // =================================================
                // AUTHENTICATION PROVIDER
                // =================================================

                .authenticationProvider(
                        authenticationProvider(
                                userDetailsService))

                // =================================================
                // JWT FILTER
                // =================================================

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}