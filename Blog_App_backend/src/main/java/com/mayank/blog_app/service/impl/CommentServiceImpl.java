package com.mayank.blog_app.service.impl;

import com.mayank.blog_app.entity.Comment;
import com.mayank.blog_app.entity.Post;
import com.mayank.blog_app.entity.User;
import com.mayank.blog_app.exception.ResourceNotFoundException;
import com.mayank.blog_app.payload.CommentDto;
import com.mayank.blog_app.payload.UserDto;
import com.mayank.blog_app.repository.CommentRepository;
import com.mayank.blog_app.repository.PostRepository;
import com.mayank.blog_app.repository.UserRepository;
import com.mayank.blog_app.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    private CommentDto toDto(Comment comment) {
        return CommentDto.builder()
                .commentId(comment.getComment_id())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .user(UserDto.builder()
                        .id(comment.getUser().getId())
                        .name(comment.getUser().getName())
                        .email(comment.getUser().getEmail())
                        .about(comment.getUser().getAbout())
                        .role(comment.getUser().getRole())
                        .build())
                .build();
    }

    @Override
    public CommentDto addComment(long postId, long userId, CommentDto commentDto) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Comment comment = Comment.builder()
                .content(commentDto.getContent())
                .post(post)
                .user(user)
                .build();

        return toDto(commentRepository.save(comment));
    }

    @Override
    public List<CommentDto> getCommentsForPost(long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        return commentRepository.findByPostOrderByCreatedAtAsc(post)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public void deleteComment(long commentId, long currentUserId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!isAdmin && comment.getUser().getId() != currentUserId) {
            throw new AccessDeniedException("You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
