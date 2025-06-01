package com.ltlt.repositories.impl;

import com.ltlt.pojo.FamilyMember;
import com.ltlt.repositories.FamilyMemberRepository;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class FamilyMemberRepositoryImpl implements FamilyMemberRepository {

    private static final Logger LOGGER = Logger.getLogger(FamilyMemberRepositoryImpl.class.getName());

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public boolean addFamilyMember(FamilyMember familyMember) {
        Session session = factory.getObject().getCurrentSession();
        try {
            session.persist(familyMember);
            return true;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error adding family member: {0}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean updateFamilyMember(FamilyMember familyMember) {
        Session session = factory.getObject().getCurrentSession();
        try {
            session.update(familyMember);
            return true;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error updating family member: {0}", e.getMessage());
            return false;
        }
    }

    @Override
    public boolean deleteFamilyMember(int id) {
        Session session = factory.getObject().getCurrentSession();
        try {
            FamilyMember member = session.get(FamilyMember.class, id);
            if (member != null) {
                session.delete(member);
                return true;
            }
            return false;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error deleting family member: {0}", e.getMessage());
            return false;
        }
    }

    @Override
    public List<FamilyMember> getFamilyMembersByResidentId(int residentId) {
        Session session = factory.getObject().getCurrentSession();
        try {
            String hql = "FROM FamilyMember f WHERE f.residentId.id = :residentId";
            Query<FamilyMember> query = session.createQuery(hql, FamilyMember.class);
            query.setParameter("residentId", residentId);
            return query.getResultList();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error getting family members by resident ID: {0}", e.getMessage());
            return null;
        }
    }

    @Override
    public FamilyMember getFamilyMemberById(int id) {
        Session session = factory.getObject().getCurrentSession();
        try {
            return session.get(FamilyMember.class, id);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error getting family member by ID: {0}", e.getMessage());
            return null;
        }
    }

    @Override
    public List<FamilyMember> getAllFamilyMembers() {
        Session session = factory.getObject().getCurrentSession();
        try {
            Query<FamilyMember> query = session.createQuery("FROM FamilyMember", FamilyMember.class);
            return query.getResultList();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error getting all family members: {0}", e.getMessage());
            return null;
        }
    }
}
