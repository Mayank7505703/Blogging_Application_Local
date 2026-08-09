package com.mayank.blog_app.repository;


import com.mayank.blog_app.entity.Category;
import com.mayank.blog_app.entity.Post;
import com.mayank.blog_app.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post , Long> {

    List<Post> findByUser(User user);
    List<Post> findByCategory(Category category);
    Page<Post> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content, Pageable pageable);
}
