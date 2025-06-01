package com.ltlt.repositories.impl;

import com.ltlt.pojo.Survey;
import com.ltlt.repositories.SurveyRepository;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class SurveyRepositoryImpl implements SurveyRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<Survey> getAllSurveys() {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery("FROM Survey", Survey.class).getResultList();
    }

    @Override
    public Survey getSurveyById(int id) {
        Session session = factory.getObject().getCurrentSession();
        return session.get(Survey.class, id);
    }

    @Override
    public void addSurvey(Survey survey) {
        Session session = factory.getObject().getCurrentSession();
        session.save(survey);
    }

    @Override
    public Survey getLatestSurvey() {
        Session session = factory.getObject().getCurrentSession();
        return session.createQuery(
                "SELECT s FROM Survey s "
                + "LEFT JOIN FETCH s.surveyQuestionCollection q "
                + "LEFT JOIN FETCH q.surveyOptionCollection "
                + "ORDER BY s.createdAt DESC", Survey.class)
                .setMaxResults(1)
                .uniqueResult();
    }

    @Override
    public Survey getSurveyWithResults(int surveyId) {
        Session session = factory.getObject().getCurrentSession();
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
        Session session = factory.getObject().getCurrentSession();
        session.delete(survey);
    }
}
