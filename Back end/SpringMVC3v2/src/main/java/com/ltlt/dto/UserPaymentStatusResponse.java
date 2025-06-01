/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.dto;

import com.ltlt.pojo.Payment;
import com.ltlt.pojo.User;
import java.util.List;

/**
 *
 * @author aicon
 */
public class UserPaymentStatusResponse {
    private int userId;
    private String fullName;
    private String username;
    private String status;
    private boolean hasPendingProve;

    public UserPaymentStatusResponse(User user, List<Payment> payments, boolean hasPendingProve) {
        this.userId = user.getId();
        this.fullName = user.getFirstName()+" "+user.getLastName(); // hoặc user.getName() tùy project
        this.username = user.getUsername();
        boolean hasPending = payments.stream().anyMatch(p -> "PENDING".equals(p.getStatus()));
        this.status = hasPending ? "Chờ thanh toán" : "Đã thanh toán";
        this.hasPendingProve = hasPendingProve;
    }

    /**
     * @return the userId
     */
    
    
    public int getUserId() {
        return userId;
    }

    /**
     * @param userId the userId to set
     */
    public void setUserId(int userId) {
        this.userId = userId;
    }

    /**
     * @return the fullName
     */
    public String getFullName() {
        return fullName;
    }

    /**
     * @param fullName the fullName to set
     */
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    /**
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * @return the status
     */
    public String getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * @return the hasPendingProve
     */
    public boolean isHasPendingProve() {
        return hasPendingProve;
    }

    /**
     * @param hasPendingProve the hasPendingProve to set
     */
    public void setHasPendingProve(boolean hasPendingProve) {
        this.hasPendingProve = hasPendingProve;
    }
    
    
}
