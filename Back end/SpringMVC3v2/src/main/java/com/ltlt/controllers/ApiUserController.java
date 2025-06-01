/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.controllers;

import com.ltlt.dto.FeedbackRequest;
import com.ltlt.dto.PaymentProveRequest;
import com.ltlt.dto.ResidentPaymentRequest;
import com.ltlt.dto.SurveyAnswerRequest;
import com.ltlt.dto.SurveyRequest;
import com.ltlt.pojo.Feedback;
import com.ltlt.pojo.Locker;
import com.ltlt.pojo.Payment;
import com.ltlt.pojo.PaymentItem;
import com.ltlt.pojo.PaymentProve;
import com.ltlt.pojo.Survey;
import com.ltlt.pojo.SurveyAnswer;
import com.ltlt.pojo.SurveyOption;
import com.ltlt.pojo.SurveyQuestion;
import com.ltlt.pojo.User;
import com.ltlt.repositories.FeedbackRepository;
import com.ltlt.repositories.PaymentItemRepository;
import com.ltlt.repositories.PaymentRepository;
import com.ltlt.repositories.UserRepository;
import com.ltlt.services.FeedbackService;
import com.ltlt.services.LockerService;
import com.ltlt.services.PaymentService;
import com.ltlt.services.SurveyService;
import com.ltlt.services.UserService;
import com.ltlt.utils.JwtUtils;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
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

            if (!user.getActive()) {
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
                    "passwordChanged", user.getPasswordChanged(),
                    "avatarUploaded", user.getAvatarUploaded()
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
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private PaymentItemRepository paymentItemRepository;

    @GetMapping("/user/my-payment")
    public ResponseEntity<?> getMyPayments() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.getUserByUsername(username);
        System.out.println("User ID: " + user.getId());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
        }

        List<Payment> payments = paymentRepository.getPaymentByUserId(user.getId());

        List<ResidentPaymentRequest> result = payments.stream()
                .map(p -> {
                    List<PaymentItem> items = paymentItemRepository.getItemsByPaymentId(p.getId());
                    return new ResidentPaymentRequest(p, items);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/user/paymentdetail")
    public ResponseEntity<List<ResidentPaymentRequest>> getMyApprovedPayments(Principal principal) {
        String username = principal.getName();
        List<ResidentPaymentRequest> result = paymentService.getApprovedPaymentsForResident(username);
        return ResponseEntity.ok(result);
    }
    @Autowired
    private SurveyService surveyService;

//    @GetMapping("/user/survey")
//    public ResponseEntity<Survey> getLatestSurveyForUser(Principal principal) {
//        int userId = userDetailsService.getUserByUsername(principal.getName()).getId();
//        Survey latestSurvey = surveyService.getLatestSurveyForUser(userId);
//        return ResponseEntity.ok(latestSurvey);
//    }
    @GetMapping("/user/survey")
    public ResponseEntity<?> getSurveyForUser(Principal principal) {
        int userId = userDetailsService.getUserByUsername(principal.getName()).getId();
        Survey survey = surveyService.getLatestSurveyForUser(userId);

        if (survey == null) {
            return ResponseEntity.ok(null);
        }

        SurveyRequest dto = surveyService.convertToRequest(survey);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/user/survey/submit")
    @Transactional
    public ResponseEntity<?> submitSurvey(@RequestBody List<SurveyAnswerRequest> answers,
            Principal principal) {
        int userId = userDetailsService.getUserByUsername(principal.getName()).getId();

        List<SurveyAnswer> entities = new ArrayList<>();
        for (SurveyAnswerRequest req : answers) {
            SurveyAnswer ans = new SurveyAnswer();
            ans.setUserId(new User(userId));
            ans.setSurveyId(new Survey(req.getSurveyId()));
            ans.setQuestionId(new SurveyQuestion(req.getQuestionId()));
            ans.setOptionId(new SurveyOption(req.getOptionId()));
            ans.setAnsweredAt(new Date());
            entities.add(ans);
        }

        surveyService.saveSurveyAnswers(entities);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/payment-proof")
    public ResponseEntity<?> uploadProof(
            @RequestParam("paymentId") int paymentId,
            @RequestParam("transactionCode") String transactionCode,
            @RequestParam("file") MultipartFile file,
            Principal principal) {
        try {
            PaymentProve prove = paymentService.savePaymentProof(paymentId, transactionCode, file, principal.getName());
            PaymentProveRequest dto = new PaymentProveRequest(prove);

            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Tải lên thất bại: " + e.getMessage()));
        }
    }

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping("/user/feedback")
    @ResponseBody
    public ResponseEntity<?> saveFeedback(@RequestBody FeedbackRequest request, Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Bạn cần đăng nhập"));
            }

            User user = userDetailsService.getUserByUsername(principal.getName());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Không tìm thấy user"));
            }

            Feedback feedback = new Feedback();
            feedback.setTitle(request.getTitle());
            feedback.setContent(request.getContent());
            feedback.setCreatedAt(new Date());
            feedback.setUserId(user);

            feedbackRepository.save(feedback);

            return ResponseEntity.ok(Map.of("message", "Phản ánh đã được gửi thành công"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi khi gửi phản ánh"));
        }
    }

}
