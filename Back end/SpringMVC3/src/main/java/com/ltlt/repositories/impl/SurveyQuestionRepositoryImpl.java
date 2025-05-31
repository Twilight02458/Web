/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.repositories.impl;



import com.ltlt.pojo.SurveyQuestion;
import com.ltlt.repositories.SurveyQuestionRepository;
import java.util.List;
import org.hibernate.Session;
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
public class SurveyQuestionRepositoryImpl implements SurveyQuestionRepository {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<SurveyQuestion> getQuestionsBySurveyId(int surveyId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM SurveyQuestion q WHERE q.surveyId = :surveyId";
        return session.createQuery(hql, SurveyQuestion.class)
                      .setParameter("surveyId", surveyId)
                      .getResultList();
    }

    @Override
    public void addQuestion(SurveyQuestion question) {
        Session session = sessionFactory.getCurrentSession();
        session.save(question);
    }
}

