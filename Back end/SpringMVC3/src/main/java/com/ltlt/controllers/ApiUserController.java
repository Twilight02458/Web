/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.controllers;

import com.ltlt.pojo.Locker;
import com.ltlt.pojo.User;
import com.ltlt.services.LockerService;
import com.ltlt.services.UserService;
import com.ltlt.utils.JwtUtils;
import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author admin
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ApiUserController {

    private static final Logger LOGGER = Logger.getLogger(ApiUserController.class.getName());

    @Autowired
    private UserService userDetailsService;

    /**
     * Đăng nhập
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User u) {
        try {
            User user = this.userDetailsService.getUserByUsername(u.getUsername());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("errorCode", "USER_NOT_FOUND", "message", "Tên đăng nhập không tồn tại"));
            }

            if (!user.isActive()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("errorCode", "ACCOUNT_LOCKED", "message", "Tài khoản đã bị khoá"));
            }

            if (!userDetailsService.authenticate(u.getUsername(), u.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("errorCode", "WRONG_PASSWORD", "message", "Mật khẩu không đúng"));
            }

           
            String token = JwtUtils.generateToken(user);
            return ResponseEntity.ok().body(Map.of(
                    "token", token,
                    "passwordChanged", user.isPasswordChanged(),
                    "avatarUploaded", user.isAvatarUploaded()
            ));

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error during login: {0}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xử lý đăng nhập");
        }
    }

    /**
     * Lấy thông tin hồ sơ
     */
    @RequestMapping("/secure/profile")
    @ResponseBody
    @CrossOrigin
    public ResponseEntity<User> getProfile(Principal principal) {
        try {
            User user = this.userDetailsService.getUserByUsername(principal.getName());
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error fetching user profile: {0}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Thay đổi mật khẩu
     */
    @PostMapping("/secure/change-password")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody Map<String, String> payload) {
        try {
            String newPassword = payload.get("newPassword");
            String username = principal.getName();

            User user = this.userDetailsService.getUserByUsername(username);
            if (user != null) {
                this.userDetailsService.changePassword(user.getId(), newPassword);
                return ResponseEntity.ok().body("Password changed successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error changing password: {0}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi thay đổi mật khẩu");
        }
    }

    /**
     * Upload avatar
     */
    @PostMapping(path = "/secure/upload-avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(Principal principal, @RequestParam("avatar") MultipartFile avatar) {
        try {
            String username = principal.getName();
            User user = this.userDetailsService.getUserByUsername(username);

            if (user != null) {
                this.userDetailsService.uploadAvatar(user.getId(), avatar);
                return ResponseEntity.ok().body("Avatar uploaded successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error uploading avatar: {0}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi upload avatar");
        }
    }

    @Autowired
    private LockerService lockerService;

    @GetMapping("/user/locker")
    public ResponseEntity<List<Locker>> getPendingLockers(Principal principal) {
        User user = this.userDetailsService.getUserByUsername(principal.getName());
        List<Locker> pendingItems = lockerService.getPendingItems(user.getId());
        return new ResponseEntity<>(pendingItems, HttpStatus.OK);
    }

}
