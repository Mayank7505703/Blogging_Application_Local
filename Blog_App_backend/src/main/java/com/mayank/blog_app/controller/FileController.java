package com.mayank.blog_app.controller;

import com.mayank.blog_app.entity.FileResponse;
import com.mayank.blog_app.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileResponse> fileUpload(
            @RequestParam("image") MultipartFile image) {

        try {
            String fileName = fileService.uploadImage(image);

            return new ResponseEntity<>(
                    new FileResponse(
                            fileName,
                            "Image uploaded successfully"
                    ),
                    HttpStatus.OK
            );

        } catch (IOException e) {

            return new ResponseEntity<>(
                    new FileResponse(
                            null,
                            "Image upload failed"
                    ),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}