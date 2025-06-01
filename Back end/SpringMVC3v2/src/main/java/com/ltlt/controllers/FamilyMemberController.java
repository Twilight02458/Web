package com.ltlt.controllers;

import com.ltlt.pojo.FamilyMember;
import com.ltlt.services.FamilyMemberService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class FamilyMemberController {
    
    @Autowired
    private FamilyMemberService familyMemberService;
    
    @GetMapping("/family-members")
    public String listFamilyMembers(Model model) {
        List<FamilyMember> familyMembers = familyMemberService.getAllFamilyMembers();
        model.addAttribute("familyMembers", familyMembers);
        return "family-members";
    }
} 