package com.mayank.blog_app.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public interface FileService {

    String uploadImage(MultipartFile file) throws IOException;
}