/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.dto;

import com.ltlt.pojo.Payment;
import com.ltlt.pojo.PaymentItem;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 * @author aicon
 */
public class ResidentPaymentRequest {
    private int id;
    private BigDecimal totalAmount;
    private String transactionCode;
    private String status;
    private Date paymentDate;
    private List<PaymentItemRequest> items;
    
    
    public ResidentPaymentRequest(Payment p, List<PaymentItem> items) {
        this.id = p.getId();
        this.transactionCode = p.getTransactionCode();
        this.totalAmount = p.getTotalAmount();
        this.status = p.getStatus();
        this.paymentDate = p.getPaymentDate();
        this.items = items.stream()
                .map(i -> new PaymentItemRequest(i.getFeeType(), i.getAmount()))
                .collect(Collectors.toList());
    }
    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the totalAmount
     */
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    /**
     * @param totalAmount the totalAmount to set
     */
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
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
     * @return the paymentDate
     */
    public Date getPaymentDate() {
        return paymentDate;
    }

    /**
     * @param paymentDate the paymentDate to set
     */
    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
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

    /**
     * @return the transactionCode
     */
    public String getTransactionCode() {
        return transactionCode;
    }

    /**
     * @param transactionCode the transactionCode to set
     */
    public void setTransactionCode(String transactionCode) {
        this.transactionCode = transactionCode;
    }
    
    
    
}
