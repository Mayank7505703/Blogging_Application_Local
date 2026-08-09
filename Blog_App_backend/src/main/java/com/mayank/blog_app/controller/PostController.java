package com.mayank.blog_app.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mayank.blog_app.entity.Role;
import com.mayank.blog_app.entity.User;
import com.mayank.blog_app.payload.ApiResponse;
import com.mayank.blog_app.payload.PostDto;
import com.mayank.blog_app.service.FileService;
import com.mayank.blog_app.service.PostService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PostController {

    private final PostService postService;
    @Autowired
    private FileService fileService;


    private void assertOwnerOrAdmin(User currentUser, long postOwnerId) {
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;
        boolean isOwner = currentUser.getId() == postOwnerId;
        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("You are not allowed to modify this post");
        }
    }

    @PostMapping("post/image/upload/{postId}")
    public ResponseEntity<PostDto> fileUpload(
            @RequestParam("image") MultipartFile image, @PathVariable long postId,
            @AuthenticationPrincipal User currentUser) {

        try {
            PostDto existing = postService.getPostByID(postId);
            assertOwnerOrAdmin(currentUser, existing.getUser().getId());

            String fileName = fileService.uploadImage(image);
            existing.setImageName(fileName);
            PostDto updatedImage = postService.updatePost(existing, postId);

            return new ResponseEntity<>(updatedImage, HttpStatus.OK);

        } catch (AccessDeniedException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/user/{userId}/category/{categoryId}")
    public ResponseEntity<PostDto> createPost(@Valid @RequestBody PostDto postDto, @PathVariable long userId,
                                               @PathVariable long categoryId,
                                               @AuthenticationPrincipal User currentUser) {

                                                    System.out.println("====== CREATE POST CONTROLLER HIT ======");

        // Users may only create posts under their own account, admins may create for anyone
        if (currentUser.getRole() != Role.ROLE_ADMIN && currentUser.getId() != userId) {
            throw new AccessDeniedException("You can only create posts under your own account");
        }
        return new ResponseEntity<>(postService.createPost(postDto, userId, categoryId), HttpStatus.OK);
    }

    @GetMapping("/posts")
    public ResponseEntity<com.mayank.blog_app.payload.PostResponse> getAllPosts(@RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
                                                       @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize) {
        return new ResponseEntity<>(postService.getAllPosts(pageNumber, pageSize), HttpStatus.OK);
    }

    @GetMapping("/posts/search")
    public ResponseEntity<com.mayank.blog_app.payload.PostResponse> searchPosts(@RequestParam("query") String query,
                                                       @RequestParam(value = "pageNumber", defaultValue = "0", required = false) int pageNumber,
                                                       @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize) {
        return new ResponseEntity<>(postService.searchPost(query, pageNumber, pageSize), HttpStatus.OK);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<PostDto> getPostById(@PathVariable long postId) {
        return new ResponseEntity<>(postService.getPostByID(postId), HttpStatus.OK);
    }

    @GetMapping("/user/{userId}/posts")
    public ResponseEntity<List<PostDto>> getPostByUSer(@PathVariable long userId) {
        return new ResponseEntity<>(postService.getPostByUser(userId), HttpStatus.OK);
    }

    @GetMapping("/category/{categoryId}/posts")
    public ResponseEntity<List<PostDto>> getPostByCategory(@PathVariable long categoryId) {
        return new ResponseEntity<>(postService.getPostByCategory(categoryId), HttpStatus.OK);
    }

    @DeleteMapping("/post/delete/{id}")
    public ResponseEntity<ApiResponse> deletePostById(@PathVariable long id, @AuthenticationPrincipal User currentUser) {
        PostDto existing = postService.getPostByID(id);
        assertOwnerOrAdmin(currentUser, existing.getUser().getId());
        postService.deletePost(id);
        return new ResponseEntity<>(new ApiResponse("Post deleted Successfully", true), HttpStatus.OK);
    }

    @PutMapping("/post/update/{postId}")
    public ResponseEntity<PostDto> updatePost(@PathVariable long postId, @Valid @RequestBody PostDto postDto,
                                               @AuthenticationPrincipal User currentUser) {
        PostDto existing = postService.getPostByID(postId);
        assertOwnerOrAdmin(currentUser, existing.getUser().getId());
        return new ResponseEntity<>(postService.updatePost(postDto, postId), HttpStatus.OK);
    }
}
