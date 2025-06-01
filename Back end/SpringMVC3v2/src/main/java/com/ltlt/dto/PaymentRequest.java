package com.ltlt.dto;

import java.math.BigDecimal;
import java.util.List;

public class PaymentRequest {
    private List<PaymentItemRequest> items;
    private String method;
    private String transactionCode;
    // getter + setter

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
     * @return the method
     */
    public String getMethod() {
        return method;
    }

    /**
     * @param method the method to set
     */
    public void setMethod(String method) {
        this.method = method;
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