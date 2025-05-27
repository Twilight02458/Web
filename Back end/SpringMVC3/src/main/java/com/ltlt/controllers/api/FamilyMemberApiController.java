package com.ltlt.controllers.api;

import com.ltlt.pojo.FamilyMember;
import com.ltlt.pojo.User;
import com.ltlt.services.FamilyMemberService;
import com.ltlt.services.UserService;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/secure")
public class FamilyMemberApiController {
    private static final Logger LOGGER = Logger.getLogger(FamilyMemberApiController.class.getName());
    
    @Autowired
    private FamilyMemberService familyMemberService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping(path = "/family-members", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FamilyMember> addFamilyMember(@RequestBody Map<String, String> params) {
        try {
            String fullName = params.get("fullName");
            String idNumber = params.get("idNumber");
            String phone = params.get("phone");
            String relationship = params.get("relationship");
            int residentId = Integer.parseInt(params.get("residentId"));
            
            User resident = userService.getUserById(residentId);
            if (resident == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            FamilyMember familyMember = new FamilyMember();
            familyMember.setFullName(fullName);
            familyMember.setIdNumber(idNumber);
            familyMember.setPhone(phone);
            familyMember.setRelationship(relationship);
            familyMember.setResidentId(resident);
            
            if (this.familyMemberService.addFamilyMember(familyMember)) {
                return new ResponseEntity<>(familyMember, HttpStatus.CREATED);
            }
            
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.severe("Error adding family member: " + ex.getMessage());
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping(path = "/family-members/resident/{residentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<FamilyMember>> getFamilyMembersByResidentId(@PathVariable(value = "residentId") int residentId) {
        try {
            List<FamilyMember> familyMembers = this.familyMemberService.getFamilyMembersByResidentId(residentId);
            return new ResponseEntity<>(familyMembers, HttpStatus.OK);
        } catch (Exception ex) {
            LOGGER.severe("Error getting family members by resident ID: " + ex.getMessage());
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping(path = "/family-members/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FamilyMember> getFamilyMemberById(@PathVariable(value = "id") int id) {
        try {
            FamilyMember familyMember = this.familyMemberService.getFamilyMemberById(id);
            if (familyMember != null) {
                return new ResponseEntity<>(familyMember, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            LOGGER.severe("Error getting family member by ID: " + ex.getMessage());
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping(path = "/family-members/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FamilyMember> updateFamilyMember(@PathVariable(value = "id") int id, 
                                                         @RequestBody Map<String, String> params) {
        try {
            LOGGER.info("Received PUT request for family member ID: " + id);
            LOGGER.info("Request parameters: " + params);
            
            FamilyMember familyMember = this.familyMemberService.getFamilyMemberById(id);
            if (familyMember == null) {
                LOGGER.warning("Family member not found with ID: " + id);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            if (params.containsKey("fullName")) {
                familyMember.setFullName(params.get("fullName"));
            }
            if (params.containsKey("phone")) {
                familyMember.setPhone(params.get("phone"));
            }
            if (params.containsKey("relationship")) {
                familyMember.setRelationship(params.get("relationship"));
            }
            if (params.containsKey("status")) {
                familyMember.setStatus(params.get("status"));
            }
            if (params.containsKey("hasParkingCard")) {
                familyMember.setHasParkingCard(Boolean.parseBoolean(params.get("hasParkingCard")));
            }
            if (params.containsKey("hasGateAccess")) {
                familyMember.setHasGateAccess(Boolean.parseBoolean(params.get("hasGateAccess")));
            }
            
            if (this.familyMemberService.updateFamilyMember(familyMember)) {
                LOGGER.info("Successfully updated family member with ID: " + id);
                return new ResponseEntity<>(familyMember, HttpStatus.OK);
            }
            
            LOGGER.warning("Failed to update family member with ID: " + id);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            LOGGER.severe("Error updating family member: " + ex.getMessage());
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @DeleteMapping(path = "/family-members/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> deleteFamilyMember(@PathVariable(value = "id") int id) {
        try {
            if (this.familyMemberService.deleteFamilyMember(id)) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            LOGGER.severe("Error deleting family member: " + ex.getMessage());
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/admin/family-members", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<FamilyMember>> getAllFamilyMembers() {
        try {
            List<FamilyMember> familyMembers = this.familyMemberService.getAllFamilyMembers();
            return new ResponseEntity<>(familyMembers, HttpStatus.OK);
        } catch (Exception ex) {
            LOGGER.severe("Error getting all family members: " + ex.getMessage());
            ex.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 