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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author aicon
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class ApiAdminController {

    private static final Logger LOGGER = Logger.getLogger(ApiUserController.class.getName());

    @Autowired
    private UserService userDetailsService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "keyword", required = false) String keyword
    ) {
        List<User> users = userDetailsService.getUsers(page, size, keyword);
        return ResponseEntity.ok(users);
    }

    @PostMapping(path = "/register-account",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> create(@RequestParam Map<String, String> params, @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        try {
            User newUser = this.userDetailsService.addUser(params, avatar);
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            // Lỗi do thiếu trường hoặc username đã tồn tại
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error while registering user: {0}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống");
        }
    }

    /**
     * Khoá tài khoản (dành cho quản trị viên)
     */
    @PostMapping("/users/deactivate-user")
    public ResponseEntity<?> deactivateUser(@RequestParam("userId") int userId) {
        try {
            this.userDetailsService.deactivateUser(userId);
            return ResponseEntity.ok().body("User deactivated successfully.");
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error deactivating user: {0}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi khoá tài khoản");
        }
    }

    @PostMapping("/users/activate-user")
    public ResponseEntity<?> activateUser(@RequestParam("userId") int userId) {
        try {
            this.userDetailsService.activateUser(userId);
            return ResponseEntity.ok().body("User activated successfully.");
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error activating user: {0}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi khoá tài khoản");
        }
    }

    @PostMapping("/users/delete-user")
    public ResponseEntity<?> deleteUser(@RequestParam("userId") int userId) {
        try {
            boolean deleted = this.userDetailsService.deleteUser(userId);
            if (deleted) {
                return ResponseEntity.ok("User deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error deleting user: {0}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi xoá tài khoản");
        }
    }

    @PostMapping(path = "/users/update-user",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        try {
            User updated = this.userDetailsService.updateUser(user);
            return ResponseEntity.ok(updated);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error updating user: {0}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi cập nhật tài khoản");
        }
    }

    @Autowired
    private LockerService lockerService;

    @GetMapping("/users/locker")
    public ResponseEntity<?> getMyLockers(@RequestParam("userId") int userId) {
        List<Locker> lockers = lockerService.getItemsForUser(userId);
        return ResponseEntity.ok(lockers);
    }

    @PostMapping("/users/locker/update-status")
    public ResponseEntity<?> updateStatus(@RequestParam("lockerId") int id, @RequestParam("status") String status) {
        boolean result = lockerService.changeLockerStatus(id, status);
        if (result) {
            return ResponseEntity.ok("Cập nhật trạng thái thành công.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy tủ.");
        }
    }

    @PostMapping("/users/locker/add-locker-item")
    public ResponseEntity<?> addLockerItem(@RequestBody Locker locker) {
        try {
            lockerService.addNewItem(locker);
            return ResponseEntity.ok("Thêm tủ đồ thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thêm thất bại: " + e.getMessage());
        }
    }

}
