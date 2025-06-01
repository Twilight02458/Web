package com.ltlt.repositories.impl;

import com.ltlt.pojo.SurveyQuestion;
import com.ltlt.repositories.SurveyQuestionRepository;
import java.util.List;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class SurveyQuestionRepositoryImpl implements SurveyQuestionRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<SurveyQuestion> getQuestionsBySurveyId(int surveyId) {
        Session session = factory.getObject().getCurrentSession();
        String hql = "FROM SurveyQuestion q WHERE q.surveyId = :surveyId";
        return session.createQuery(hql, SurveyQuestion.class)
                      .setParameter("surveyId", surveyId)
                      .getResultList();
    }

    @Override
    public void addQuestion(SurveyQuestion question) {
        Session session = factory.getObject().getCurrentSession();
        session.save(question);
    }
}
