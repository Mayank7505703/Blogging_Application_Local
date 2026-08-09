package com.mayank.blog_app.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mayank.blog_app.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Long id;

    @NotEmpty
    @Size(min = 3 , message = "Username must be min of 3 characters")
    private String name;

    @Email(message = "Email address is not valid")
    @NotNull
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotEmpty(message = "Password must not be empty")
    @Size(min=3 , max=20 , message = "Password must be min of 3 chars and maximum of 20 chars")
    private String password;

    @NotEmpty
    private String about;

    private Role role;
}
