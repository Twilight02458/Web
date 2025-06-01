/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.services.impl;


import com.ltlt.pojo.Feedback;
import com.ltlt.repositories.FeedbackRepository;
import com.ltlt.services.FeedbackService;
import java.util.Date;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
/**
 *
 * @author aicon
 */
@Service
public class FeedbackServiceImpl implements FeedbackService {
    
    
    @Autowired
    private SessionFactory sessionFactory;
    @Autowired
    private FeedbackRepository feedbackRepository;

    @Override
    public void submitFeedback(Feedback feedback) {
        feedbackRepository.save(feedback);
    }

    @Override
    public List<Feedback> getAll() {
        return feedbackRepository.findAllOrderByCreatedAtDesc();
    }

    @Override
    public void deleteById(int id) {
        feedbackRepository.deleteById(id);
    }
    
    @Override
    @Transactional
    public void saveFeedback(Feedback feedback) {
        Session session = sessionFactory.getCurrentSession();
        feedback.setCreatedAt(new Date()); // set ngày gửi phản ánh
        session.save(feedback);
    }
}

