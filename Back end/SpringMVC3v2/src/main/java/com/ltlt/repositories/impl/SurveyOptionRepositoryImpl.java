package com.ltlt.repositories.impl;

import com.ltlt.pojo.SurveyOption;
import com.ltlt.repositories.SurveyOptionRepository;
import java.util.List;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class SurveyOptionRepositoryImpl implements SurveyOptionRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public List<SurveyOption> getOptionsByQuestionId(int questionId) {
        Session session = factory.getObject().getCurrentSession();
        String hql = "FROM SurveyOption o WHERE o.questionId = :questionId";
        return session.createQuery(hql, SurveyOption.class)
                      .setParameter("questionId", questionId)
                      .getResultList();
    }

    @Override
    public void addOption(SurveyOption option) {
        Session session = factory.getObject().getCurrentSession();
        session.save(option);
    }
}
