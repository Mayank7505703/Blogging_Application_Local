package com.mayank.blog_app.service.impl;

import com.mayank.blog_app.entity.Category;
import com.mayank.blog_app.entity.Post;
import com.mayank.blog_app.entity.User;
import com.mayank.blog_app.exception.ResourceNotFoundException;
import com.mayank.blog_app.payload.PostDto;
import com.mayank.blog_app.payload.PostResponse;
import com.mayank.blog_app.repository.CategoryRepository;
import com.mayank.blog_app.repository.PostRepository;
import com.mayank.blog_app.repository.UserRepository;
import com.mayank.blog_app.service.PostService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public PostDto createPost(PostDto postDto , long userId , long categoryId) {
        User user = userRepository.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User","id",userId));
        Category category= categoryRepository.findById(categoryId).orElseThrow(()-> new ResourceNotFoundException("Category","id",categoryId));
        Post post = modelMapper.map(postDto,Post.class);
        post.setPostId(0);
        post.setImageName(postDto.getImageName() != null ? postDto.getImageName() : "default.png");
        post.setUser(user);
        post.setCategory(category);
        Post savedPost= postRepository.save(post);
        return modelMapper.map(savedPost, PostDto.class);
    }

    @Override
    public PostDto updatePost(PostDto postDto, long id) {
        Post post = postRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
        if (postDto.getImageName() != null) {
            post.setImageName(postDto.getImageName());
        }
        if (postDto.getTitle() != null) {
            post.setTitle(postDto.getTitle());
        }
        if (postDto.getContent() != null) {
            post.setContent(postDto.getContent());
        }
        Post savedPost = postRepository.save(post);
        return modelMapper.map(savedPost,PostDto.class);
    }

    @Override
    public void deletePost(long id) {
        Post post = postRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
        postRepository.delete(post);
    }

    @Override
    public PostResponse getAllPosts(int pageNumber, int pageSize) {
        Pageable p = PageRequest.of(pageNumber, pageSize, Sort.by("postId").descending());
        Page<Post> posts = postRepository.findAll(p);
        return toResponse(posts);
    }

    @Override
    public PostDto getPostByID(long id) {
        Post post = postRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("post","id",id));
        return modelMapper.map(post,PostDto.class);
    }

    @Override
    public List<PostDto> getPostByCategory(long categoryId) {
        Category cat= categoryRepository.findById(categoryId).orElseThrow(()-> new ResourceNotFoundException("Category","id",categoryId));
        List<Post> post= postRepository.findByCategory(cat);
        return post.stream().map(e-> modelMapper.map(e,PostDto.class)).toList();
    }

    @Override
    public List<PostDto> getPostByUser(long id) {
        User user = userRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("User","id",id));
        List<Post> post = postRepository.findByUser(user);
        return post.stream().map(e->modelMapper.map(e,PostDto.class)).toList();
    }

    @Override
    public PostResponse searchPost(String search, int pageNumber, int pageSize) {
        Pageable p = PageRequest.of(pageNumber, pageSize, Sort.by("postId").descending());
        Page<Post> posts = postRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(search, search, p);
        return toResponse(posts);
    }

    private PostResponse toResponse(Page<Post> posts) {
        List<PostDto> content = posts.getContent().stream().map(e -> modelMapper.map(e, PostDto.class)).toList();
        return PostResponse.builder()
                .content(content)
                .pageNumber(posts.getNumber())
                .pageSize(posts.getSize())
                .totalElements(posts.getTotalElements())
                .totalPages(posts.getTotalPages())
                .lastPage(posts.isLast())
                .build();
    }
}
