/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.repositories.impl;

import com.ltlt.pojo.Survey;
import com.ltlt.repositories.SurveyRepository;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author aicon
 */
@Repository
@Transactional
public class SurveyRepositoryImpl implements SurveyRepository {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<Survey> getAllSurveys() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM Survey", Survey.class).getResultList();
    }

    @Override
    public Survey getSurveyById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(Survey.class, id);
    }

    @Override
    public void addSurvey(Survey survey) {
        Session session = sessionFactory.getCurrentSession();
        session.save(survey);
    }

    @Override
    public Survey getLatestSurvey() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery(
                "SELECT s FROM Survey s "
                + "LEFT JOIN FETCH s.surveyQuestionCollection q "
                + "LEFT JOIN FETCH q.surveyOptionCollection "
                + "ORDER BY s.createdAt DESC", Survey.class)
                .setMaxResults(1)
                .uniqueResult();
    }

    // SurveyRepositoryImpl.java (hoặc service)
    @Override
    public Survey getSurveyWithResults(int surveyId) {
        Session session = sessionFactory.getCurrentSession();
        Query<Survey> q = session.createQuery(
                "SELECT s FROM Survey s "
                + "JOIN FETCH s.surveyQuestionCollection q "
                + "JOIN FETCH q.surveyOptionCollection "
                + "WHERE s.id = :id",
                Survey.class
        );
        q.setParameter("id", surveyId);
        return q.getSingleResult();
    }

    @Override
    public void deleteSurvey(Survey survey) {
        Session session = sessionFactory.getCurrentSession();
        session.delete(survey);
    }

}
