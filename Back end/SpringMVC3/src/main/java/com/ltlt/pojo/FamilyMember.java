package com.ltlt.pojo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "family_member")
@NamedQueries({
    @NamedQuery(name = "FamilyMember.findAll", query = "SELECT f FROM FamilyMember f"),
    @NamedQuery(name = "FamilyMember.findById", query = "SELECT f FROM FamilyMember f WHERE f.id = :id"),
    @NamedQuery(name = "FamilyMember.findByResidentId", query = "SELECT f FROM FamilyMember f WHERE f.residentId = :residentId"),
    @NamedQuery(name = "FamilyMember.findByStatus", query = "SELECT f FROM FamilyMember f WHERE f.status = :status")
})
public class FamilyMember implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    
    @NotNull
    @Size(max = 100)
    @Column(name = "full_name")
    private String fullName;
    
    @NotNull
    @Size(max = 20)
    @Column(name = "id_number")
    private String idNumber;
    
    @NotNull
    @Size(max = 15)
    @Column(name = "phone")
    private String phone;
    
    @NotNull
    @Size(max = 50)
    @Column(name = "relationship")
    private String relationship;
    
    @Column(name = "registered_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date registeredAt;
    
    @Size(max = 10)
    @Column(name = "status")
    private String status;
    
    @Column(name = "has_parking_card")
    private Boolean hasParkingCard;
    
    @Column(name = "has_gate_access")
    private Boolean hasGateAccess;
    
    @JoinColumn(name = "resident_id", referencedColumnName = "id")
    @ManyToOne
    private User residentId;

    public FamilyMember() {
    }

    public FamilyMember(Integer id) {
        this.id = id;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public Date getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(Date registeredAt) {
        this.registeredAt = registeredAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getHasParkingCard() {
        return hasParkingCard;
    }

    public void setHasParkingCard(Boolean hasParkingCard) {
        this.hasParkingCard = hasParkingCard;
    }

    public Boolean getHasGateAccess() {
        return hasGateAccess;
    }

    public void setHasGateAccess(Boolean hasGateAccess) {
        this.hasGateAccess = hasGateAccess;
    }

    public User getResidentId() {
        return residentId;
    }

    public void setResidentId(User residentId) {
        this.residentId = residentId;
    }
} 