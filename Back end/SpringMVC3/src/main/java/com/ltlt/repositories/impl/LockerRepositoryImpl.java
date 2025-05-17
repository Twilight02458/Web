/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.repositories.impl;

import com.ltlt.pojo.Locker;
import com.ltlt.repositories.LockerRepository;
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
public class LockerRepositoryImpl implements LockerRepository {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<Locker> getItemsByUserId(int userId) {
        Session s = sessionFactory.getCurrentSession();
        Query<Locker> q = s.createQuery("FROM Locker WHERE userId.id = :uid", Locker.class);
        q.setParameter("uid", userId);
        return q.getResultList();
    }

    @Override
    public List<Locker> getPendingItemsByUserId(int userId) {
        Session s = sessionFactory.getCurrentSession();
        Query<Locker> q = s.createQuery("FROM Locker WHERE userId.id = :uid AND status = 'pending'", Locker.class);
        q.setParameter("uid", userId);
        return q.getResultList();
    }

    @Override
    public void addLockerItem(Locker item) {
        Session session = sessionFactory.getCurrentSession();
        session.save(item);
    }
   

    @Override
    public boolean updateStatus(int lockerId, String status) {
        Session session = sessionFactory.getCurrentSession();
        Locker locker = session.get(Locker.class, lockerId);
        if (locker != null) {
            locker.setStatus(status);
            session.update(locker);
            return true;
        }
        return false;
    }

}
