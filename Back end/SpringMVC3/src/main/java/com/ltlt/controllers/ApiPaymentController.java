package com.ltlt.controllers;

import com.ltlt.configs.VnPayConfig;
import com.ltlt.dto.PaymentItemRequest;
import com.ltlt.dto.PaymentRequest;
import com.ltlt.pojo.Payment;
import com.ltlt.pojo.PaymentItem;
import com.ltlt.repositories.PaymentItemRepository;
import com.ltlt.repositories.PaymentRepository;
import com.ltlt.services.PaymentService;
import com.ltlt.services.UserService;
import com.ltlt.utils.VNPayUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/payment")
public class ApiPaymentController {

    @Autowired
    private VnPayConfig vnPayConfig;

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private PaymentItemRepository paymentItemRepository;

    // GET request không đúng, nên ta giữ POST như sau:
    @PostMapping("/create")
    @ResponseBody
    public ResponseEntity<String> createVNPayUrl(@RequestParam("transactionCode") String transactionCode) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            Payment payment = paymentRepository.findByTransactionCode(transactionCode);
            if (payment == null || !payment.getUserId().getUsername().equals(username)) {
                return ResponseEntity.status(404).body("Không tìm thấy phiếu thanh toán");
            }

            if ("APPROVED".equals(payment.getStatus())) {
                return ResponseEntity.badRequest().body("Phiếu thanh toán đã được xử lý trước đó");
            }

            List<PaymentItem> items = paymentItemRepository.getItemsByPaymentId(payment.getId());
            BigDecimal totalAmount = items.stream()
                    .map(PaymentItem::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String paymentUrl = VNPayUtils.generateVNPayUrl(
                    vnPayConfig.getTmnCode(),
                    vnPayConfig.getHashSecret(),
                    vnPayConfig.getVnpayUrl(),
                    vnPayConfig.getReturnUrl(),
                    totalAmount.longValue(),
                    "Thanh toán dịch vụ",
                    transactionCode
            );

            return ResponseEntity.ok(paymentUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/vnpay-return")
    public String getPaymentResult(HttpServletRequest request) {
        try {
            String vnp_Amount = request.getParameter("vnp_Amount");
            String vnp_TxnRef = request.getParameter("vnp_TxnRef");
            String vnp_OrderInfo = request.getParameter("vnp_OrderInfo");
            String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");

            if (!"00".equals(vnp_ResponseCode)) {
                String message = URLEncoder.encode("Giao dịch không thành công! Mã phản hồi: " + vnp_ResponseCode, "UTF-8");
                return "redirect:http://localhost:3000/payment/result?status=failed&message=" + message;
            }

            Payment payment = paymentRepository.findByTransactionCode(vnp_TxnRef);
            if (payment == null) {
                String message = URLEncoder.encode("Không tìm thấy giao dịch!", "UTF-8");
                return "redirect:http://localhost:3000/payment/result?status=error&message=" + message;
            }

            payment.setStatus("APPROVED");
            paymentRepository.updateStatus(vnp_TxnRef, "APPROVED");

            // Lấy feeType qua repository để tránh lỗi lazy
            List<PaymentItem> items = paymentItemRepository.getItemsByPaymentId(payment.getId());
            String feeTypes = items.stream()
                    .map(PaymentItem::getFeeType)
                    .collect(Collectors.joining(", "));

            return "redirect:http://localhost:3000/payment/result?status=success"
                    + "&amount=" + payment.getTotalAmount()
                    + "&feeType=" + URLEncoder.encode(feeTypes, "UTF-8")
                    + "&transactionCode=" + vnp_TxnRef
                    + "&paymentDate=" + payment.getPaymentDate().getTime();
        } catch (Exception e) {
            e.printStackTrace();
            String message = "";
            try {
                message = URLEncoder.encode("Lỗi xử lý kết quả giao dịch: " + e.getMessage(), "UTF-8");
            } catch (Exception ex) {
            }
            return "redirect:http://localhost:3000/payment/result?status=error&message=" + message;
        }
    }
    
    
}
