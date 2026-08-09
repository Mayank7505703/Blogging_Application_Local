package com.mayank.blog_app.payload;

import java.time.LocalDate;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDto {

    private Long postId;

    @NotEmpty(message = "Title should not be empty")
    @Size(min = 4, message = "Size of title must be greater than 4 characters")
    private String title;

    @NotEmpty(message = "Content should not be empty")
    @Size(min = 4, message = "Size of content must be greater than 4 characters")
    private String content;

    private String imageName;

    private LocalDate publishDate;

    private CategoryDto category;

    private UserDto user;
}