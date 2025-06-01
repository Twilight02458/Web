package com.ltlt.repositories;

import com.ltlt.pojo.FamilyMember;
import java.util.List;

public interface FamilyMemberRepository {
    boolean addFamilyMember(FamilyMember familyMember);
    boolean updateFamilyMember(FamilyMember familyMember);
    boolean deleteFamilyMember(int id);
    List<FamilyMember> getFamilyMembersByResidentId(int residentId);
    FamilyMember getFamilyMemberById(int id);
    List<FamilyMember> getAllFamilyMembers();
} 