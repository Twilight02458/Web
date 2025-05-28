/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.repositories.impl;

import com.ltlt.pojo.Payment;
import com.ltlt.repositories.PaymentRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public class PaymentRepositoryImpl implements PaymentRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void save(Payment payment) {
        entityManager.persist(payment);
    }

    @Override
    public void updateStatus(String transactionCode, String status) {
        Payment payment = findByTransactionCode(transactionCode);
        if (payment != null) {
            payment.setStatus(status);
            entityManager.merge(payment);
        }
    }

    @Override
    public Payment findByTransactionCode(String transactionCode) {
        try {
            return entityManager.createQuery(
                    "SELECT p FROM Payment p WHERE p.transactionCode = :transactionCode", Payment.class)
                    .setParameter("transactionCode", transactionCode)
                    .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<Payment> getPaymentByUserId(int userId) {
        return entityManager.createQuery(
                "SELECT p FROM Payment p WHERE p.userId.id = :userId AND p.status = 'PENDING' ORDER BY p.paymentDate DESC", Payment.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Override
    public Optional<Payment> findByTransactionCodeAndUserId(String transactionCode, int userId) {
        try {
            Payment payment = entityManager.createQuery(
                    "SELECT p FROM Payment p WHERE p.transactionCode = :transactionCode AND p.userId.id = :userId", Payment.class)
                    .setParameter("transactionCode", transactionCode)
                    .setParameter("userId", userId)
                    .getSingleResult();
            return Optional.ofNullable(payment);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    @Override
    public List<Payment> getApprovedPaymentsByUserId(int userId) {
        String jpql = "SELECT p FROM Payment p WHERE p.userId.id = :userId AND p.status = 'APPROVED'";
        return entityManager.createQuery(jpql, Payment.class)
                 .setParameter("userId", userId)
                 .getResultList();
    }

}
