/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ltlt.pojo.User;
import com.ltlt.repositories.UserRepository;
import com.ltlt.services.UserService;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author admin
 */
@Service("userDetailsService")
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private Cloudinary cloudinary;

    private static final Logger LOGGER = Logger.getLogger(UserServiceImpl.class.getName());

    @Override
    public User getUserByUsername(String username) {
        return this.userRepo.getUserByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = this.getUserByUsername(username);
        if (u == null) {
            throw new UsernameNotFoundException("Invalid username!");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + u.getRole()));


        return new org.springframework.security.core.userdetails.User(
                u.getUsername(), u.getPassword(), authorities);
    }

    @Override
    public User addUser(Map<String, String> params, MultipartFile avatar) {
        // Kiểm tra các trường dữ liệu bắt buộc
        if (params.get("username") == null || params.get("password") == null || params.get("email") == null) {
            throw new IllegalArgumentException("Username, password, and email are required.");
        }

        User user = new User();
        user.setFirstName(params.getOrDefault("firstName", "")); // Họ (nếu không có, để trống)
        user.setLastName(params.getOrDefault("lastName", ""));   // Tên (nếu không có, để trống)
        user.setUsername(params.get("username")); // Tên đăng nhập
        user.setPassword(this.passwordEncoder.encode(params.get("password"))); // Mã hoá mật khẩu
        user.setPhone(params.getOrDefault("phone", "")); // Số điện thoại (nếu không có, để trống)
        user.setEmail(params.get("email")); // Email

        // Đặt vai trò
        String role = params.getOrDefault("role", "RESIDENT");
        if (!role.equals("ADMIN") && !role.equals("RESIDENT")) {
            throw new IllegalArgumentException("Invalid role. Allowed values are ADMIN or RESIDENT.");
        }
        user.setRole(role);

        // Đặt trạng thái kích hoạt
        user.setActive(Boolean.parseBoolean(params.getOrDefault("active", "true")));

        // Xử lý avatar
        if (avatar != null && !avatar.isEmpty()) {
            try {
                Map res = cloudinary.uploader().upload(avatar.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
                user.setAvatar(res.get("secure_url").toString());
            } catch (IOException ex) {
                LOGGER.log(Level.SEVERE, "Error while uploading avatar", ex);
                throw new RuntimeException("Could not upload avatar. Please try again later.");
            }
        } else {
            // Đặt avatar mặc định nếu không có avatar được tải lên
            user.setAvatar("https://res.cloudinary.com/dxtrdrgwz/image/upload/v1747319915/q4krrtxjsfcjnx21joxh.png");
        }

        // Lưu người dùng vào cơ sở dữ liệu
        try {
            return this.userRepo.addUser(user);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error while saving user", ex);
            throw new RuntimeException("Could not create user. Please check your input.");
        }
    }

    @Override
    public boolean authenticate(String username, String password) {
        return this.userRepo.authenticate(username, password);
    }

    @Override
    public void toggleUserStatus(int userId) {
        User user = this.userRepo.getUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        user.setActive(!user.isActive()); // toggle true <-> false
        this.userRepo.updateUser(user);
    }

    @Override
    public void changePassword(int userId, String newPassword) {
        User user = this.userRepo.getUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        user.setPassword(this.passwordEncoder.encode(newPassword));
        user.setPasswordChanged(true);
        this.userRepo.updateUser(user);
    }

    @Override
    public void uploadAvatar(int userId, MultipartFile avatar) {
        User user = this.userRepo.getUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (avatar != null && !avatar.isEmpty()) {
            try {
                Map res = cloudinary.uploader().upload(avatar.getBytes(), ObjectUtils.asMap("resource_type", "auto"));
                user.setAvatar(res.get("secure_url").toString());
                user.setAvatarUploaded(true);
                this.userRepo.updateUser(user);
            } catch (IOException ex) {
                LOGGER.log(Level.SEVERE, "Error while uploading avatar", ex);
                throw new RuntimeException("Could not upload avatar. Please try again later.");
            }
        } else {
            throw new RuntimeException("Avatar file is empty");
        }
    }

    @Override
    public boolean deleteUser(int userId) {
        return this.userRepo.deleteUser(userId);
    }

    @Override
    public User updateUser(User user) {
        this.userRepo.updateUser(user);
        return user;
    }

    @Override
    public List<User> getAllUsers() {
        return this.userRepo.getAllUsers();
    }

    @Override
    public List<User> getUsers(int page, int size, String keyword) {
        return userRepo.getUsers(page, size, keyword);
    }

}
