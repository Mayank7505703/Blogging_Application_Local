package com.mayank.blog_app.service.impl;

import com.mayank.blog_app.entity.Category;
import com.mayank.blog_app.exception.ResourceNotFoundException;
import com.mayank.blog_app.payload.CategoryDto;
import com.mayank.blog_app.repository.CategoryRepository;
import com.mayank.blog_app.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category category = modelMapper.map(categoryDto, Category.class);
        Category savedCategory = categoryRepository.save(category);
        return modelMapper.map(savedCategory , CategoryDto.class);
    }

    @Override
    public CategoryDto updateCategory(CategoryDto categoryDto, long id) {
        Category category = categoryRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category" , "id" , id));
        category.setCategoryDescription(categoryDto.getCategoryDescription());
        category.setCategoryTitle(categoryDto.getCategoryTitle());
        Category updatedCategory = categoryRepository.save(category);
        return modelMapper.map(updatedCategory , CategoryDto.class);
    }

    @Override
    public void deleteCategory(long id) {
        Category category= categoryRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category", "id", id));
        categoryRepository.delete(category);
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(e->modelMapper.map(e , CategoryDto.class))
                .toList();
    }

    @Override
    public CategoryDto getCategoryById(long id) {
        Category category = categoryRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category" , "id" , id));
        return modelMapper.map(category , CategoryDto.class);
    }
}
