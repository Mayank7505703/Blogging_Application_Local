package com.mayank.blog_app.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDto {

    private long categoryId;

    @NotBlank
    @Size(min = 4 , message = "Minimum size of category is 4")
    private String categoryTitle;

    @NotBlank
    @Size(min =4 , message ="Minimum size of category description is 10")
    private String categoryDescription;
}
