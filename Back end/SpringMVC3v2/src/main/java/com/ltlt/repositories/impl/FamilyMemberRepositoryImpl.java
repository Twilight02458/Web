package com.ltlt.repositories.impl;

import com.ltlt.pojo.FamilyMember;
import com.ltlt.repositories.FamilyMemberRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.util.List;
import java.util.logging.Logger;
import org.springframework.stereotype.Repository;

@Repository
public class FamilyMemberRepositoryImpl implements FamilyMemberRepository {
    private static final Logger LOGGER = Logger.getLogger(FamilyMemberRepositoryImpl.class.getName());
    
    @PersistenceContext
    private EntityManager em;

    @Override
    public boolean addFamilyMember(FamilyMember familyMember) {
        try {
            em.persist(familyMember);
            return true;
        } catch (Exception e) {
            LOGGER.severe("Error adding family member: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean updateFamilyMember(FamilyMember familyMember) {
        try {
            em.merge(familyMember);
            return true;
        } catch (Exception e) {
            LOGGER.severe("Error updating family member: " + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean deleteFamilyMember(int id) {
        try {
            FamilyMember familyMember = em.find(FamilyMember.class, id);
            if (familyMember != null) {
                em.remove(familyMember);
                return true;
            }
            return false;
        } catch (Exception e) {
            LOGGER.severe("Error deleting family member: " + e.getMessage());
            return false;
        }
    }

    @Override
    public List<FamilyMember> getFamilyMembersByResidentId(int residentId) {
        try {
            Query q = em.createQuery("FROM FamilyMember f WHERE f.residentId.id = :residentId");
            q.setParameter("residentId", residentId);
            return q.getResultList();
        } catch (Exception e) {
            LOGGER.severe("Error getting family members by resident ID: " + e.getMessage());
            return null;
        }
    }

    @Override
    public FamilyMember getFamilyMemberById(int id) {
        try {
            return em.find(FamilyMember.class, id);
        } catch (Exception e) {
            LOGGER.severe("Error getting family member by ID: " + e.getMessage());
            return null;
        }
    }

    @Override
    public List<FamilyMember> getAllFamilyMembers() {
        try {
            Query q = em.createQuery("FROM FamilyMember");
            return q.getResultList();
        } catch (Exception e) {
            LOGGER.severe("Error getting all family members: " + e.getMessage());
            return null;
        }
    }
} 