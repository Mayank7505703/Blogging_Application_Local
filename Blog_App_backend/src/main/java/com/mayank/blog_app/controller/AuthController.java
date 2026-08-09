package com.mayank.blog_app.controller;

import com.mayank.blog_app.entity.Role;
import com.mayank.blog_app.entity.User;
import com.mayank.blog_app.exception.ResourceAlreadyExistsException;
import com.mayank.blog_app.payload.UserDto;
import com.mayank.blog_app.payload.auth.AuthResponse;
import com.mayank.blog_app.payload.auth.LoginRequest;
import com.mayank.blog_app.payload.auth.RegisterRequest;
import com.mayank.blog_app.repository.UserRepository;
import com.mayank.blog_app.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final ModelMapper modelMapper;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new ResourceAlreadyExistsException("User with email " + request.getEmail() + " already exists.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .about(request.getAbout() != null ? request.getAbout() : "")
                .role(Role.ROLE_USER)
                .build();

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);

        return new ResponseEntity<>(
                AuthResponse.builder()
                        .token(token)
                        .tokenType("Bearer")
                        .user(modelMapper.map(saved, UserDto.class))
                        .build(),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail());
        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(
                AuthResponse.builder()
                        .token(token)
                        .tokenType("Bearer")
                        .user(modelMapper.map(user, UserDto.class))
                        .build()
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@org.springframework.security.core.annotation.AuthenticationPrincipal User user) {
        return ResponseEntity.ok(modelMapper.map(user, UserDto.class));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMe(@org.springframework.security.core.annotation.AuthenticationPrincipal User currentUser,
                                             @Valid @RequestBody com.mayank.blog_app.payload.auth.UpdateProfileRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new com.mayank.blog_app.exception.ResourceNotFoundException("User", "id", currentUser.getId()));

        user.setName(request.getName());
        user.setAbout(request.getAbout());
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new org.springframework.security.authentication.BadCredentialsException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        User saved = userRepository.save(user);
        return ResponseEntity.ok(modelMapper.map(saved, UserDto.class));
    }
}
