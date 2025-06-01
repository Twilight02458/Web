package com.ltlt.services;

import com.ltlt.pojo.FamilyMember;
import java.util.List;


public interface FamilyMemberService {
    boolean addFamilyMember(FamilyMember familyMember);
    boolean updateFamilyMember(FamilyMember familyMember);
    boolean deleteFamilyMember(int id);
    List<FamilyMember> getFamilyMembersByResidentId(int residentId);
    FamilyMember getFamilyMemberById(int id);
    List<FamilyMember> getAllFamilyMembers();
} 