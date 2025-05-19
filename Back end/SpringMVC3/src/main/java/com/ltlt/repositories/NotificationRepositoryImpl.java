package com.ltlt.repositories;

import com.ltlt.pojo.NotificationPreference;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class NotificationRepositoryImpl implements NotificationRepository {
    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public NotificationPreference getPreferenceByUserId(Integer userId) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.createNamedQuery("NotificationPreference.findByUserId", NotificationPreference.class)
                .setParameter("userId", userId)
                .uniqueResult();
    }

    @Override
    public boolean addNotificationPreference(NotificationPreference preference) {
        Session s = this.factory.getObject().getCurrentSession();
        try {
            s.save(preference);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean updateNotificationPreference(NotificationPreference preference) {
        Session s = this.factory.getObject().getCurrentSession();
        try {
            s.update(preference);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean updateFcmToken(Integer userId, String token) {
        Session s = this.factory.getObject().getCurrentSession();
        try {
            NotificationPreference pref = getPreferenceByUserId(userId);
            if (pref != null) {
                pref.setFcmToken(token);
                s.update(pref);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
} 