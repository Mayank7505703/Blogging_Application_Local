package com.mayank.blog_app.service;

import com.mayank.blog_app.payload.UserDto;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface UserService {

    UserDto createUser(UserDto user);
    UserDto updateUser(UserDto user , long id);
    UserDto getUserById(long id);
    List<UserDto> getAllUser();
    void deleteUser(long id);
}
