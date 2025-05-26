/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.services.impl;

import com.ltlt.dto.AdminCreatePaymentRequest;
import com.ltlt.dto.PaymentItemRequest;
import com.ltlt.pojo.Payment;
import com.ltlt.pojo.PaymentItem;
import com.ltlt.pojo.User;
import com.ltlt.repositories.PaymentItemRepository;
import com.ltlt.repositories.PaymentRepository;
import com.ltlt.repositories.UserRepository;
import com.ltlt.services.PaymentForResidentService;
import java.math.BigDecimal;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author aicon
 */
public class PaymentForResidentServiceImpl implements PaymentForResidentService {
    
     @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentItemRepository paymentItemRepository;
    
    @Override
    public void createPaymentForResident(AdminCreatePaymentRequest req) {
        User user = userRepository.getUserByUsername(req.getUsername());
        if (user == null) {
            throw new RuntimeException("Cư dân không tồn tại!");
        }

        Payment payment = new Payment();
        payment.setUserId(user);
        payment.setStatus("PENDING");
        payment.setPaymentDate(new Date());

        BigDecimal total = req.getItems().stream()
                .map(PaymentItemRequest::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        payment.setTotalAmount(total);

        paymentRepository.save(payment);

        for (PaymentItemRequest itemReq : req.getItems()) {
            PaymentItem item = new PaymentItem();
            item.setPaymentId(payment);
            item.setFeeType(itemReq.getFeeType());
            item.setAmount(itemReq.getAmount());
            paymentItemRepository.save(item);
        }
    }

}
