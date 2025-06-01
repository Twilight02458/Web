package com.ltlt.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ltlt.configs.VnPayConfig;
import com.ltlt.dto.PaymentItemRequest;
import com.ltlt.dto.PaymentProveRequest;
import com.ltlt.dto.PaymentRequest;
import com.ltlt.dto.ResidentPaymentRequest;
import com.ltlt.pojo.Payment;
import com.ltlt.pojo.PaymentItem;
import com.ltlt.pojo.PaymentProve;
import com.ltlt.pojo.User;
import com.ltlt.repositories.PaymentItemRepository;
import com.ltlt.repositories.PaymentProveRepository;
import com.ltlt.repositories.PaymentRepository;
import com.ltlt.repositories.UserRepository;
import com.ltlt.services.PaymentService;
import com.ltlt.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private UserRepository userRepository; // hoặc userService để lấy user

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentItemRepository paymentItemRepository;

    @Override
    @Transactional
    public void savePayment(String username, PaymentRequest paymentRequest) {
        User user = userRepository.getUserByUsername(username);
        if (user == null) {
            throw new RuntimeException("User không tồn tại");
        }

        // Tìm payment đã có theo transactionCode và user
        Optional<Payment> existingPaymentOpt = paymentRepository.findByTransactionCodeAndUserId(paymentRequest.getTransactionCode(), user.getId());

        Payment payment;
        if (existingPaymentOpt.isPresent()) {
            payment = existingPaymentOpt.get();

            // Nếu đã thanh toán thì có thể không cho sửa, hoặc throw lỗi
            if ("APPROVED".equals(payment.getStatus())) {
                throw new RuntimeException("Phiếu thanh toán đã được xử lý");
            }

            // Nếu chưa thanh toán, cập nhật thông tin Payment
            payment.setMethod(paymentRequest.getMethod());
            payment.setPaymentDate(new Date());

            // Xóa các PaymentItem cũ (nếu cần cập nhật)
            paymentItemRepository.deleteByPaymentId(payment.getId());

        } else {
            // Nếu chưa có thì tạo mới Payment
            payment = new Payment();
            payment.setUserId(user);
            payment.setTransactionCode(paymentRequest.getTransactionCode());
            payment.setStatus("PENDING");
            payment.setMethod(paymentRequest.getMethod());
            payment.setPaymentDate(new Date());
        }

        // Tính tổng tiền mới từ items
        BigDecimal totalAmount = paymentRequest.getItems()
                .stream().map(PaymentItemRequest::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        payment.setTotalAmount(totalAmount);

        paymentRepository.save(payment);

        // Lưu các PaymentItem mới
        for (PaymentItemRequest itemReq : paymentRequest.getItems()) {
            PaymentItem item = new PaymentItem();
            item.setPaymentId(payment);
            item.setFeeType(itemReq.getFeeType());
            item.setAmount(itemReq.getAmount());
            paymentItemRepository.save(item);
        }
    }

    @Override
    public List<ResidentPaymentRequest> getApprovedPaymentsForResident(String username) {
        User user = userRepository.getUserByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        List<Payment> payments = paymentRepository.getApprovedPaymentsByUserId(user.getId());

        return payments.stream()
                .map(payment -> {
                    // Lấy items bằng repository, không dùng collection LAZY
                    List<PaymentItem> items = paymentItemRepository.getItemsByPaymentId(payment.getId());
                    return new ResidentPaymentRequest(payment, items);
                })
                .collect(Collectors.toList());
    }

    @Autowired
    private Cloudinary cloudinary;

    @Override
    @Transactional
    public PaymentProve savePaymentProof(int paymentId, String transactionCode, MultipartFile file, String username) throws IOException {
        Payment payment = paymentRepository.findById(paymentId);
        if (payment == null) {
            throw new RuntimeException("Không tìm thấy payment");
        }

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String imageUrl = uploadResult.get("secure_url").toString();

        PaymentProve prove = new PaymentProve();
        prove.setPaymentId(payment);
        prove.setTransactionCode(transactionCode);
        prove.setProofImageUrl(imageUrl);
        prove.setSubmittedAt(new Date());

        paymentRepository.save(prove);
        return prove;
    }

    @Autowired
    private PaymentProveRepository paymentProveRepository;

    public List<PaymentProve> getPendingProves(int userId) {
        return paymentProveRepository.getPendingProvesByUserId(userId);
    }

    @Override
    public List<PaymentProveRequest> getPendingProvesByUserId(int userId) {
    List<PaymentProve> proves = paymentProveRepository.getPendingProvesByUserId(userId);
    return proves.stream()
                 .map(PaymentProveRequest::new)
                 .collect(Collectors.toList());
}


    @Override
    public void approvePaymentProve(int proveId) {
        PaymentProve prove = paymentProveRepository.getById(proveId);

        if (prove != null && prove.getPaymentId() != null) {
            Payment payment = prove.getPaymentId();

            if ("PENDING".equalsIgnoreCase(payment.getStatus())) {
                payment.setStatus("APPROVED");

                // Lưu payment riêng
                paymentRepository.save(payment);

                // Lưu PaymentProve (nếu có cập nhật gì)
                paymentProveRepository.save(prove);
            }
        }
    }
    
}
