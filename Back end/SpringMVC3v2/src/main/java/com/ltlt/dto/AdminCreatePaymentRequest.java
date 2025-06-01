/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.dto;

import java.util.List;

/**
 *
 * @author aicon
 */
public class AdminCreatePaymentRequest {
    private String username;
    private List<PaymentItemRequest> items;

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
     * @return the items
     */
    public List<PaymentItemRequest> getItems() {
        return items;
    }

    /**
     * @param items the items to set
     */
    public void setItems(List<PaymentItemRequest> items) {
        this.items = items;
    }
    
    
    
}
