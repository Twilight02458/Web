/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.repositories.impl;

import com.ltlt.pojo.SurveyAnswer;
import com.ltlt.repositories.SurveyAnswerRepository;
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
public class SurveyAnswerRepositoryImpl implements SurveyAnswerRepository {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void addAnswer(SurveyAnswer answer) {
        Session session = sessionFactory.getCurrentSession();
        session.save(answer);
    }

    @Override
    public List<SurveyAnswer> getAnswersBySurveyId(int surveyId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM SurveyAnswer a WHERE a.surveyId = :surveyId";
        return session.createQuery(hql, SurveyAnswer.class)
                .setParameter("surveyId", surveyId)
                .getResultList();
    }

    @Override
    public void save(SurveyAnswer answer) {
        Session session = sessionFactory.getCurrentSession();
        session.save(answer);
    }

    @Override
    public List<SurveyAnswer> findBySurveyId(int surveyId) {
        Session session = sessionFactory.getCurrentSession();
        Query<SurveyAnswer> query = session.createQuery("FROM SurveyAnswer WHERE surveyId.id = :surveyId", SurveyAnswer.class);
        query.setParameter("surveyId", surveyId);
        return query.getResultList();
    }

    @Override
    public boolean hasUserAnsweredSurvey(int userId, int surveyId) {
        Session session = sessionFactory.getCurrentSession();
        Query<Long> query = session.createQuery("SELECT COUNT(*) FROM SurveyAnswer WHERE userId.id = :userId AND surveyId.id = :surveyId", Long.class);
        query.setParameter("userId", userId);
        query.setParameter("surveyId", surveyId);
        return query.uniqueResult() > 0;
    }

    @Override
    public void deleteBySurveyIdAndUserId(int surveyId, int userId) {
        Session session = sessionFactory.getCurrentSession();
        Query query = session.createQuery("DELETE FROM SurveyAnswer WHERE userId.id = :userId AND surveyId.id = :surveyId");
        query.setParameter("userId", userId);
        query.setParameter("surveyId", surveyId);
        query.executeUpdate();
    }

    @Override
    public List<Object[]> countAnswersByQuestionAndOption(int surveyId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "SELECT a.questionId.id, a.optionId.id, COUNT(a.id) "
                + "FROM SurveyAnswer a WHERE a.surveyId.id = :surveyId "
                + "GROUP BY a.questionId.id, a.optionId.id";
        return session.createQuery(hql, Object[].class)
                .setParameter("surveyId", surveyId)
                .getResultList();
    }
}
