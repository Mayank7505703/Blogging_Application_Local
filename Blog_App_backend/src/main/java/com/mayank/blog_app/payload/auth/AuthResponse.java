package com.mayank.blog_app.payload.auth;

import com.mayank.blog_app.payload.UserDto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String tokenType;
    private UserDto user;
}
