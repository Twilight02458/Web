/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.dto;

import java.math.BigDecimal;

/**
 *
 * @author aicon
 */
public class PaymentItemRequest {

    private String feeType;
    private BigDecimal amount;

    public PaymentItemRequest() {
    }

    public PaymentItemRequest(String feeType, BigDecimal amount) {
        this.feeType = feeType;
        this.amount = amount;
    }

    /**
     * @return the feeType
     */
    public String getFeeType() {
        return feeType;
    }

    /**
     * @param feeType the feeType to set
     */
    public void setFeeType(String feeType) {
        this.feeType = feeType;
    }

    /**
     * @return the amount
     */
    public BigDecimal getAmount() {
        return amount;
    }

    /**
     * @param amount the amount to set
     */
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

}
