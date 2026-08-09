package com.mayank.blog_app.payload.auth;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {
    @NotEmpty
    @Size(min = 3, message = "Name must be at least 3 characters")
    private String name;

    private String about;

    // Only required if the user wants to change their password
    private String currentPassword;

    @Size(min = 6, max = 20, message = "New password must be between 6 and 20 characters")
    private String newPassword;
}
