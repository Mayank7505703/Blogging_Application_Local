package com.mayank.blog_app.service;

import com.mayank.blog_app.payload.PostDto;
import com.mayank.blog_app.payload.PostResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PostService {
    PostDto createPost(PostDto postDto , long userId , long categoryId);
    PostDto updatePost(PostDto postDto , long id);
    void deletePost(long id);
    PostResponse getAllPosts(int pageNumber, int pageSize);
    PostDto getPostByID(long id);
    List<PostDto> getPostByCategory(long categoryId);
    List<PostDto> getPostByUser(long id);
    PostResponse searchPost(String search, int pageNumber, int pageSize);
}
