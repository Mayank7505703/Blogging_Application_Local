package com.mayank.blog_app.security;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

      try {
    final String userEmail = jwtService.extractUsername(jwt);

    System.out.println("Email from JWT: " + userEmail);

    if (userEmail != null &&
            SecurityContextHolder.getContext().getAuthentication() == null) {

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(userEmail);

        System.out.println("User loaded: " + userDetails.getUsername());
        System.out.println("Authorities: " + userDetails.getAuthorities());

        boolean valid = jwtService.isTokenValid(jwt, userDetails);

        System.out.println("Token valid: " + valid);

        if (valid) {

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authToken.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authToken);

            System.out.println("JWT AUTHENTICATION SUCCESS");
        }
    }

} catch (Exception ex) {

    System.out.println("JWT AUTH ERROR: " + ex.getClass().getName());
    System.out.println("JWT AUTH MESSAGE: " + ex.getMessage());
    ex.printStackTrace();

    SecurityContextHolder.clearContext();
}
        filterChain.doFilter(request, response);
    }
}
