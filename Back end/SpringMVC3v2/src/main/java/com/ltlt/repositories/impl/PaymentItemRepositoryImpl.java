package com.ltlt.repositories.impl;

import com.ltlt.pojo.PaymentItem;
import com.ltlt.repositories.PaymentItemRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Repository
@Transactional
public class PaymentItemRepositoryImpl implements PaymentItemRepository {

    private static final Logger LOGGER = Logger.getLogger(PaymentItemRepositoryImpl.class.getName());

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public void save(PaymentItem paymentItem) {
        try {
            Session session = factory.getObject().getCurrentSession();
            session.save(paymentItem);
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error saving payment item: {0}", ex.getMessage());
            throw ex;
        }
    }

    @Override
    public List<PaymentItem> getItemsByPaymentId(int paymentId) {
        try {
            Session session = factory.getObject().getCurrentSession();
            String hql = "FROM PaymentItem pi WHERE pi.paymentId.id = :paymentId";
            Query<PaymentItem> query = session.createQuery(hql, PaymentItem.class);
            query.setParameter("paymentId", paymentId);
            return query.getResultList();
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error fetching payment items by payment ID: {0}", ex.getMessage());
            return null;
        }
    }

    @Override
    public void deleteByPaymentId(int paymentId) {
        try {
            Session session = factory.getObject().getCurrentSession();
            String hql = "DELETE FROM PaymentItem pi WHERE pi.paymentId.id = :paymentId";
            Query<?> query = session.createQuery(hql);
            query.setParameter("paymentId", paymentId);
            query.executeUpdate();
        } catch (Exception ex) {
            LOGGER.log(Level.SEVERE, "Error deleting payment items by payment ID: {0}", ex.getMessage());
            throw ex;
        }
    }
}
