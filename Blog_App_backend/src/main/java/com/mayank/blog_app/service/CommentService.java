package com.mayank.blog_app.service;

import com.mayank.blog_app.payload.CommentDto;

import java.util.List;

public interface CommentService {
    CommentDto addComment(long postId, long userId, CommentDto commentDto);
    List<CommentDto> getCommentsForPost(long postId);
    void deleteComment(long commentId, long currentUserId, boolean isAdmin);
}
