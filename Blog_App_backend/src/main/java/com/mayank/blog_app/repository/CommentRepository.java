package com.mayank.blog_app.repository;

import com.mayank.blog_app.entity.Comment;
import com.mayank.blog_app.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreatedAtAsc(Post post);
}
