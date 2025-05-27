package com.ltlt.services.impl;

import com.ltlt.pojo.FamilyMember;
import com.ltlt.repositories.FamilyMemberRepository;
import com.ltlt.services.FamilyMemberService;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FamilyMemberServiceImpl implements FamilyMemberService {
    
    private final FamilyMemberRepository familyMemberRepository;
    
    @Autowired
    public FamilyMemberServiceImpl(FamilyMemberRepository familyMemberRepository) {
        this.familyMemberRepository = familyMemberRepository;
    }
    
    @Override
    @Transactional
    public boolean addFamilyMember(FamilyMember familyMember) {
        familyMember.setRegisteredAt(new Date());
        familyMember.setStatus("PENDING");
        familyMember.setHasParkingCard(false);
        familyMember.setHasGateAccess(false);
        return this.familyMemberRepository.addFamilyMember(familyMember);
    }
    
    @Override
    @Transactional
    public boolean updateFamilyMember(FamilyMember familyMember) {
        return this.familyMemberRepository.updateFamilyMember(familyMember);
    }
    
    @Override
    @Transactional
    public boolean deleteFamilyMember(int id) {
        return this.familyMemberRepository.deleteFamilyMember(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<FamilyMember> getFamilyMembersByResidentId(int residentId) {
        return this.familyMemberRepository.getFamilyMembersByResidentId(residentId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public FamilyMember getFamilyMemberById(int id) {
        return this.familyMemberRepository.getFamilyMemberById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<FamilyMember> getAllFamilyMembers() {
        return this.familyMemberRepository.getAllFamilyMembers();
    }
} 