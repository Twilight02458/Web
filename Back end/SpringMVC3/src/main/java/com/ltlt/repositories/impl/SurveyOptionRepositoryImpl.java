/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.repositories.impl;

import com.ltlt.pojo.SurveyOption;
import com.ltlt.repositories.SurveyOptionRepository;
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
public class SurveyOptionRepositoryImpl implements SurveyOptionRepository {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<SurveyOption> getOptionsByQuestionId(int questionId) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM SurveyOption o WHERE o.questionId = :questionId";
        return session.createQuery(hql, SurveyOption.class)
                      .setParameter("questionId", questionId)
                      .getResultList();
    }

    @Override
    public void addOption(SurveyOption option) {
        Session session = sessionFactory.getCurrentSession();
        session.save(option);
    }
}

