package com.ltlt.repositories.impl;

import com.ltlt.pojo.Feedback;
import com.ltlt.repositories.FeedbackRepository;
import java.util.List;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class FeedbackRepositoryImpl implements FeedbackRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public void save(Feedback feedback) {
        Session session = factory.getObject().getCurrentSession();
        session.saveOrUpdate(feedback);
    }

    @Override
    public List<Feedback> findAllOrderByCreatedAtDesc() {
        Session session = factory.getObject().getCurrentSession();
        String hql = "FROM Feedback ORDER BY createdAt DESC";
        return session.createQuery(hql, Feedback.class).getResultList();
    }

    @Override
    public void deleteById(int id) {
        Session session = factory.getObject().getCurrentSession();
        Feedback feedback = session.get(Feedback.class, id);
        if (feedback != null) {
            session.delete(feedback);
        }
    }
}
