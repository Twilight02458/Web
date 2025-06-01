/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.repositories.impl;

import com.ltlt.pojo.PaymentItem;
import com.ltlt.repositories.PaymentItemRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class PaymentItemRepositoryImpl implements PaymentItemRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void save(PaymentItem paymentItem) {
        entityManager.persist(paymentItem);
    }

    @Override
    public List<PaymentItem> getItemsByPaymentId(int paymentId) {
        String jpql = "SELECT pi FROM PaymentItem pi WHERE pi.paymentId.id = :paymentId";
        TypedQuery<PaymentItem> query = entityManager.createQuery(jpql, PaymentItem.class);
        query.setParameter("paymentId", paymentId);
        return query.getResultList();
    }

    @Override
    public void deleteByPaymentId(int paymentId) {
        entityManager.createQuery("DELETE FROM PaymentItem pi WHERE pi.paymentId.id = :paymentId")
                .setParameter("paymentId", paymentId)
                .executeUpdate();
    }

}
