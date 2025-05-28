package com.ltlt.repositories;

import com.ltlt.pojo.Payment;
import java.util.List;
import java.util.Optional;



public interface PaymentRepository {
    void save(Payment payment);
    void updateStatus(String transactionCode, String status);
    Payment findByTransactionCode(String transactionCode);
    List<Payment> getPaymentByUserId(int userId);
    Optional<Payment> findByTransactionCodeAndUserId(String transactionCode, int userId);
    List<Payment> getApprovedPaymentsByUserId(int userId);
}
