/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.services;

import com.ltlt.dto.PaymentRequest;
import com.ltlt.dto.ResidentPaymentRequest;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
/**
 *
 * @author aicon
 */
public interface PaymentService {
    void savePayment(String username, PaymentRequest paymentRequest);
     List<ResidentPaymentRequest> getApprovedPaymentsForResident(String username);
}


