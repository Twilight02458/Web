/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.repositories.impl;

import com.ltlt.pojo.PaymentProve;
import com.ltlt.repositories.PaymentProveRepository;
import java.util.List;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author aicon
 */
@Repository
@Transactional
public class PaymentProveRepositoryImpl implements PaymentProveRepository {

    @Autowired
    private LocalSessionFactoryBean sessionFactory;

    @Override
    public List<PaymentProve> getPendingProvesByUserId(int userId) {
        Session session = sessionFactory.getObject().getCurrentSession();

        String hql = "FROM PaymentProve p WHERE p.paymentId.userId.id = :userId AND p.paymentId.status = 'PENDING'";
        return session.createQuery(hql, PaymentProve.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Override
    public PaymentProve getById(int id) {
        Session session = sessionFactory.getObject().getCurrentSession();
        return session.get(PaymentProve.class, id);
    }

    @Override
    public void save(PaymentProve prove) {
        Session session = sessionFactory.getObject().getCurrentSession();
        session.saveOrUpdate(prove);
    }

}
