/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.repositories.impl;

import com.ltlt.pojo.Feedback;
import com.ltlt.repositories.FeedbackRepository;
import java.util.List;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author aicon
 */
@Repository
@Transactional
public class FeedbackRepositoryImpl implements FeedbackRepository {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void save(Feedback feedback) {
        sessionFactory.getCurrentSession().saveOrUpdate(feedback);
    }

    @Override
    public List<Feedback> findAllOrderByCreatedAtDesc() {
        String hql = "FROM Feedback ORDER BY createdAt DESC";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, Feedback.class)
                .getResultList();
    }

    @Override
    public void deleteById(int id) {
        Feedback feedback = sessionFactory.getCurrentSession().get(Feedback.class, id);
        if (feedback != null) {
            sessionFactory.getCurrentSession().delete(feedback);
        }
    }
}
