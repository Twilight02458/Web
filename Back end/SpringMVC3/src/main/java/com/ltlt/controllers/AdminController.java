/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.controllers;

import com.ltlt.dto.PaymentRequest;
import com.ltlt.pojo.Locker;
import com.ltlt.pojo.User;
import com.ltlt.services.LockerService;
import com.ltlt.services.PaymentService;
import com.ltlt.services.UserService;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 *
 * @author aicon
 */
@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public String listUsers(Model model,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "keyword", required = false) String keyword) {
        List<User> users = userService.getUsers(page - 1, size, keyword);
        model.addAttribute("users", users);
        model.addAttribute("currentPage", page);
        model.addAttribute("size", size);
        model.addAttribute("keyword", keyword != null ? keyword : "");
        return "user-list";
    }

    @PostMapping("/users/update")
    public String editUser(@ModelAttribute User user, RedirectAttributes redirectAttributes) {
        try {
            userService.updateUser(user);
            redirectAttributes.addFlashAttribute("msg", "Cập nhật thành công!");
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("msg", "Cập nhật thất bại: " + ex.getMessage());
        }
        // Redirect về trang danh sách người dùng để load lại dữ liệu mới
        return "redirect:/admin/users";
    }

    @PostMapping("/users/activate")
    public String toggleLock(@RequestParam("userId") int userId, RedirectAttributes redirectAttributes) {
        try {
            userService.toggleUserStatus(userId); // gọi phương thức toggle
            redirectAttributes.addFlashAttribute("msg", "Cập nhật trạng thái thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("msg", "Lỗi: " + e.getMessage());
        }
        return "redirect:/admin/users";
    }

    @GetMapping("/register")
    public String showRegisterForm() {
        return "register-form"; // file thymeleaf
    }

    @PostMapping("/register")
    public String processRegister(
            @RequestParam Map<String, String> params,
            @RequestParam("avatar") MultipartFile avatar,
            RedirectAttributes redirectAttributes) {

        try {
            userService.addUser(params, avatar);
            redirectAttributes.addFlashAttribute("msg", "Tạo tài khoản thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("msg", "Có lỗi xảy ra khi tạo tài khoản: " + e.getMessage());
        }

        return "redirect:/admin/register";
    }
    @Autowired
    private LockerService lockerService;

    // 1. Hiển thị danh sách tủ đồ của cư dân
    @GetMapping("/locker")
    public String getLockerItems(@RequestParam("userId") int userId,
            @RequestParam(value = "filter", defaultValue = "ALL") String filter,
            Model model) {
        List<Locker> lockers = lockerService.getItemsForUser(userId);

        // Lọc trạng thái nếu có
        if (!filter.equals("ALL")) {
            lockers = lockers.stream()
                    .filter(l -> l.getStatus().equalsIgnoreCase(filter))
                    .toList();
        }

        model.addAttribute("userId", userId);
        model.addAttribute("items", lockers);
        model.addAttribute("filter", filter);
        return "resident-locker"; // Thymeleaf template in src/main/resources/templates/
    }

    // 2. Cập nhật trạng thái item (VD: đánh dấu đã nhận)
    @PostMapping("/locker/status")
    public String updateLockerStatus(@RequestParam("lockerId") int lockerId,
            @RequestParam("status") String status,
            @RequestParam("userId") int userId,
            RedirectAttributes redirectAttributes) {
        boolean result = lockerService.changeLockerStatus(lockerId, status);
        if (!result) {
            redirectAttributes.addFlashAttribute("msg", "Không tìm thấy tủ.");
        }
        return "redirect:/admin/locker?userId=" + userId;
    }

    // 3. Thêm item mới vào tủ đồ
    @PostMapping("/locker/add")
    public String addLockerItem(@RequestParam("userId") int userId,
            @RequestParam("itemName") String itemName,
            RedirectAttributes redirectAttributes) {
        try {
            User user = new User();
            user.setId(userId);

            Locker locker = new Locker();
            locker.setUserId(user); // GÁN ĐÚNG userId
            locker.setItemName(itemName);
            locker.setStatus("PENDING");
            locker.setReceivedAt(new Date()); // java.util.Date

            lockerService.addNewItem(locker);
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("msg", "Thêm thất bại: " + e.getMessage());
        }

        return "redirect:/admin/locker?userId=" + userId;
    }

    @Autowired
    private PaymentService paymentService;

    @PostMapping("users/{username}/create-payment")
    public String createPaymentForUser(
            @PathVariable("username") String username,
            @RequestParam("method") String method,
            @RequestParam("transactionCode") String transactionCode,
            @ModelAttribute PaymentRequest paymentRequest,
            RedirectAttributes redirectAttributes) {
        try {
            paymentRequest.setTransactionCode(transactionCode);
            paymentRequest.setMethod(method);
            paymentService.savePayment(username, paymentRequest);
            redirectAttributes.addFlashAttribute("msg", "Tạo phiếu thành công cho " + username);
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("msg", "Lỗi: " + e.getMessage());
        }
        return "redirect:/admin/users";
    }

    @GetMapping("users/{username}/create-payment")
    public String showCreatePaymentForm(@PathVariable("username") String username, Model model) {
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setMethod("VNPay");
        model.addAttribute("paymentRequest", paymentRequest);
        model.addAttribute("username", username);
        model.addAttribute("transactionCode", String.valueOf(System.currentTimeMillis()));
        return "create-payment";
    }

}

//
//@GetMapping("/admin/users/{id}/locker")
//public String viewLocker(@PathVariable("id") int userId, Model model) {
//    List<Locker> lockers = lockerService.getItemsForUser(userId);
//    model.addAttribute("userId", userId);
//    model.addAttribute("items", lockers);
//    return "user-locker";
//}
//@PostMapping("/admin/users/locker/{lockerId}/mark-received")
//public String markReceived(@PathVariable int lockerId) {
//    lockerService.changeLockerStatus(lockerId, "RECEIVED");
//    Locker locker = lockerService.findById(lockerId);
//    return "redirect:/admin/users/" + locker.getUser().getId() + "/locker";
//}
//
//@PostMapping("/admin/users/{id}/locker/add")
//public String addLockerItem(@PathVariable("id") int userId,
//                            @RequestParam("itemName") String itemName) {
//    Locker locker = new Locker();
//    locker.setItemName(itemName);
//    locker.setUser(userService.findById(userId));
//    locker.setStatus("PENDING");
//    locker.setReceivedAt(LocalDateTime.now());
//    lockerService.addNewItem(locker);
//    return "redirect:/admin/users/" + userId + "/locker";
//}

