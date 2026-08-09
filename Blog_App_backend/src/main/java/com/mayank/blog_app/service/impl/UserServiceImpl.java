package com.mayank.blog_app.service.impl;

import com.mayank.blog_app.entity.Role;
import com.mayank.blog_app.entity.User;
import com.mayank.blog_app.exception.ResourceAlreadyExistsException;
import com.mayank.blog_app.exception.ResourceNotFoundException;
import com.mayank.blog_app.payload.UserDto;
import com.mayank.blog_app.repository.UserRepository;
import com.mayank.blog_app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto createUser( UserDto userDto) {
        User userExist = userRepository.findByEmail(userDto.getEmail());
        if(userExist != null){
            throw new ResourceAlreadyExistsException("User with " + userDto.getEmail() + " already exists.");
        }
        User user = modelMapper.map(userDto,User.class);
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setRole(Role.ROLE_USER);
        User savedUser=userRepository.save(user);
        return modelMapper.map(savedUser,UserDto.class);
    }

    @Override
    public UserDto updateUser(UserDto userDto, long id) {
        User user = userRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("user" , "id" , id));

        user.setName(userDto.getName());
        user.setAbout(userDto.getAbout());
        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        User updatedUser=userRepository.save(user);
        return modelMapper.map(updatedUser,UserDto.class);
    }

    @Override
    public UserDto getUserById(long id) {
        User user = userRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("user","id",id));
        return modelMapper.map(user,UserDto.class);
    }

    @Override
    public List<UserDto> getAllUser() {
        return userRepository.findAll()
                .stream()
                .map(e->modelMapper.map(e,UserDto.class))
                .toList();
    }

    @Override
    public void deleteUser(long id) {
        User user = userRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("User", "id",id));
        userRepository.delete(user);
    }
}
