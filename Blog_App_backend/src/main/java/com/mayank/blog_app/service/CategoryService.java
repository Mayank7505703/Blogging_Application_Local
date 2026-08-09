package com.mayank.blog_app.service;

import com.mayank.blog_app.payload.CategoryDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CategoryService {
    CategoryDto createCategory(CategoryDto categoryDto);
    CategoryDto updateCategory(CategoryDto categoryDto , long id);
    void deleteCategory(long id);
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(long id);
}
