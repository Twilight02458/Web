/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.services;

import com.ltlt.dto.PaymentProveRequest;
import com.ltlt.dto.PaymentRequest;
import com.ltlt.dto.ResidentPaymentRequest;
import com.ltlt.pojo.PaymentProve;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
/**
 *
 * @author aicon
 */
public interface PaymentService {
    void savePayment(String username, PaymentRequest paymentRequest);
     List<ResidentPaymentRequest> getApprovedPaymentsForResident(String username);
    PaymentProveRequest getPendingProveByUserId(int userId);
    void approvePaymentProve(int proveId);
     PaymentProve savePaymentProof(int paymentId, String transactionCode, MultipartFile file, String username) throws IOException;
}


