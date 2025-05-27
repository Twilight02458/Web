/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.services;

import com.ltlt.pojo.User;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author admin
 */
public interface UserService extends UserDetailsService {

    User getUserByUsername(String username);

    User getUserById(int userId);

    User addUser(Map<String, String> params, MultipartFile avatar);

    boolean authenticate(String username, String password);

    boolean updateUser(User user);

    boolean deleteUser(int userId);     // Xóa user

    boolean changePassword(int userId, String newPassword);

    void uploadAvatar(int userId, MultipartFile avatar);

    List<User> getAllUsers();           // Danh sách tất cả user
    
    List<User> getUsers(int page, int size, String keyword);

    void toggleUserStatus(int userId);
}
