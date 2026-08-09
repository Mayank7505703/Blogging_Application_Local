package com.mayank.blog_app.payload;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
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
public class CommentDto {

    private Long commentId;

    @NotBlank(message = "Comment must not be empty")
    @Size(max = 2000, message = "Comment is too long")
    private String content;

    private LocalDateTime createdAt;

    private UserDto user;
}