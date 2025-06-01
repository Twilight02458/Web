package com.ltlt.repositories.impl;

import com.ltlt.pojo.Payment;
import com.ltlt.pojo.PaymentProve;
import com.ltlt.repositories.PaymentRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

@Repository
@Transactional
public class PaymentRepositoryImpl implements PaymentRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    private static final Logger LOGGER = Logger.getLogger(PaymentRepositoryImpl.class.getName());

    @Override
    public void save(Payment payment) {
        Session session = factory.getObject().getCurrentSession();
        if (payment.getId() == null) {
            session.persist(payment);
        } else {
            session.merge(payment);
        }
    }

    @Override
    public void save(PaymentProve prove) {
        Session session = factory.getObject().getCurrentSession();
        if (prove.getId() == null) {
            session.persist(prove);
        } else {
            session.merge(prove);
        }
    }

    @Override
    public void updateStatus(String transactionCode, String status) {
        Payment payment = findByTransactionCode(transactionCode);
        if (payment != null) {
            payment.setStatus(status);
            save(payment); // gọi lại save để cập nhật
        }
    }

    @Override
    public Payment findByTransactionCode(String transactionCode) {
        try {
            Session session = factory.getObject().getCurrentSession();
            String hql = "FROM Payment p WHERE p.transactionCode = :transactionCode";
            Query<Payment> query = session.createQuery(hql, Payment.class);
            query.setParameter("transactionCode", transactionCode);
            return query.uniqueResult();
        } catch (Exception ex) {
            LOGGER.log(Level.WARNING, "Không tìm thấy payment theo transactionCode: {0}", transactionCode);
            return null;
        }
    }

    @Override
    public Optional<Payment> findByTransactionCodeAndUserId(String transactionCode, int userId) {
        try {
            Session session = factory.getObject().getCurrentSession();
            String hql = "FROM Payment p WHERE p.transactionCode = :transactionCode AND p.userId.id = :userId";
            Query<Payment> query = session.createQuery(hql, Payment.class);
            query.setParameter("transactionCode", transactionCode);
            query.setParameter("userId", userId);
            return Optional.ofNullable(query.uniqueResult());
        } catch (Exception ex) {
            LOGGER.log(Level.WARNING, "Không tìm thấy payment theo transactionCode và userId");
            return Optional.empty();
        }
    }

    @Override
    public List<Payment> getPaymentByUserId(int userId) {
        Session session = factory.getObject().getCurrentSession();
        String hql = "FROM Payment p WHERE p.userId.id = :userId AND p.status = 'PENDING' ORDER BY p.paymentDate DESC";
        Query<Payment> query = session.createQuery(hql, Payment.class);
        query.setParameter("userId", userId);
        return query.getResultList();
    }

    @Override
    public List<Payment> getAllPaymentByUserId(int userId) {
        Session session = factory.getObject().getCurrentSession();
        String hql = "FROM Payment p WHERE p.userId.id = :userId ORDER BY p.paymentDate DESC";
        Query<Payment> query = session.createQuery(hql, Payment.class);
        query.setParameter("userId", userId);
        return query.getResultList();
    }

    @Override
    public List<Payment> getApprovedPaymentsByUserId(int userId) {
        Session session = factory.getObject().getCurrentSession();
        String hql = "FROM Payment p WHERE p.userId.id = :userId AND p.status = 'APPROVED'";
        Query<Payment> query = session.createQuery(hql, Payment.class);
        query.setParameter("userId", userId);
        return query.getResultList();
    }

    @Override
    public Payment findById(int id) {
        Session session = factory.getObject().getCurrentSession();
        return session.get(Payment.class, id);
    }
     @Override
    public List<Payment> getPaymentByUserIdAndStatus(int userId, String status) {
        Session session = factory.getObject().getCurrentSession();

        String hql = "FROM Payment p WHERE p.userId.id = :userId AND p.status = :status ORDER BY p.paymentDate DESC";
        Query<Payment> query = session.createQuery(hql, Payment.class);
        query.setParameter("userId", userId);
        query.setParameter("status", status);

        return query.getResultList();
    }
}
