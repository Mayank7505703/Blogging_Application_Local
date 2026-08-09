package com.mayank.blog_app.controller;

import com.mayank.blog_app.entity.Role;
import com.mayank.blog_app.entity.User;
import com.mayank.blog_app.payload.ApiResponse;
import com.mayank.blog_app.payload.CommentDto;
import com.mayank.blog_app.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/post/{postId}/comment")
    public ResponseEntity<CommentDto> addComment(@PathVariable long postId,
                                                  @Valid @RequestBody CommentDto commentDto,
                                                  @AuthenticationPrincipal User currentUser) {
        return new ResponseEntity<>(commentService.addComment(postId, currentUser.getId(), commentDto), HttpStatus.CREATED);
    }

    @GetMapping("/post/{postId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable long postId) {
        return ResponseEntity.ok(commentService.getCommentsForPost(postId));
    }

    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity<ApiResponse> deleteComment(@PathVariable long commentId,
                                                       @AuthenticationPrincipal User currentUser) {
        commentService.deleteComment(commentId, currentUser.getId(), currentUser.getRole() == Role.ROLE_ADMIN);
        return ResponseEntity.ok(new ApiResponse("Comment deleted successfully", true));
    }
}
