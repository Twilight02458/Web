package com.ltlt.repositories.impl;

import com.ltlt.pojo.SurveyAnswer;
import com.ltlt.repositories.SurveyAnswerRepository;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class SurveyAnswerRepositoryImpl implements SurveyAnswerRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public void addAnswer(SurveyAnswer answer) {
        Session session = factory.getObject().getCurrentSession();
        session.save(answer);
    }

    @Override
    public List<SurveyAnswer> getAnswersBySurveyId(int surveyId) {
        Session session = factory.getObject().getCurrentSession();
        String hql = "FROM SurveyAnswer a WHERE a.surveyId.id = :surveyId";
        return session.createQuery(hql, SurveyAnswer.class)
                .setParameter("surveyId", surveyId)
                .getResultList();
    }

    @Override
    public void save(SurveyAnswer answer) {
        Session session = factory.getObject().getCurrentSession();
        session.save(answer);
    }

    @Override
    public List<SurveyAnswer> findBySurveyId(int surveyId) {
        Session session = factory.getObject().getCurrentSession();
        Query<SurveyAnswer> query = session.createQuery(
            "FROM SurveyAnswer WHERE surveyId.id = :surveyId", SurveyAnswer.class);
        query.setParameter("surveyId", surveyId);
        return query.getResultList();
    }

    @Override
    public boolean hasUserAnsweredSurvey(int userId, int surveyId) {
        Session session = factory.getObject().getCurrentSession();
        Query<Long> query = session.createQuery(
            "SELECT COUNT(*) FROM SurveyAnswer WHERE userId.id = :userId AND surveyId.id = :surveyId", Long.class);
        query.setParameter("userId", userId);
        query.setParameter("surveyId", surveyId);
        return query.uniqueResult() > 0;
    }

    @Override
    public void deleteBySurveyIdAndUserId(int surveyId, int userId) {
        Session session = factory.getObject().getCurrentSession();
        Query<?> query = session.createQuery(
            "DELETE FROM SurveyAnswer WHERE userId.id = :userId AND surveyId.id = :surveyId");
        query.setParameter("userId", userId);
        query.setParameter("surveyId", surveyId);
        query.executeUpdate();
    }

    @Override
    public List<Object[]> countAnswersByQuestionAndOption(int surveyId) {
        Session session = factory.getObject().getCurrentSession();
        String hql = "SELECT a.questionId.id, a.optionId.id, COUNT(a.id) "
                   + "FROM SurveyAnswer a WHERE a.surveyId.id = :surveyId "
                   + "GROUP BY a.questionId.id, a.optionId.id";
        return session.createQuery(hql, Object[].class)
                .setParameter("surveyId", surveyId)
                .getResultList();
    }
}
