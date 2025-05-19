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

    User addUser(Map<String, String> params, MultipartFile avatar);

    boolean authenticate(String username, String password);

    void deactivateUser(int userId); // Khoá tài khoản cư dân
    void activateUser(int userId); // Khoá tài khoản cư dân


    void changePassword(int userId, String newPassword); // Thay đổi mật khẩu

    void uploadAvatar(int userId, MultipartFile avatar);

    boolean deleteUser(int userId);     // Xóa user

    User updateUser(User user);         // Sửa thông tin user

    List<User> getAllUsers();           // Danh sách tất cả user
    
    List<User> getUsers(int page, int size, String keyword);
}
