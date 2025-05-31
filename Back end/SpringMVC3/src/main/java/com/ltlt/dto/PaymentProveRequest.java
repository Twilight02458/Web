/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.dto;

/**
 *
 * @author aicon
 */


import com.ltlt.pojo.PaymentProve;
import java.util.Date;

public class PaymentProveRequest {
    private int id;
    private String transactionCode;
    private String proofImageUrl;
    private Date submittedAt;

    // Các trường từ Payment (chỉ lấy ID và Status hoặc thêm nếu cần)
    private int paymentId;
    private String paymentStatus;

    public PaymentProveRequest() {
    }

    public PaymentProveRequest(int id, String transactionCode, String proofImageUrl, Date submittedAt, int paymentId, String paymentStatus) {
        this.id = id;
        this.transactionCode = transactionCode;
        this.proofImageUrl = proofImageUrl;
        this.submittedAt = submittedAt;
        this.paymentId = paymentId;
        this.paymentStatus = paymentStatus;
    }
    public PaymentProveRequest(PaymentProve prove) {
        this.id = prove.getId();
        this.transactionCode = prove.getTransactionCode();
        this.proofImageUrl = prove.getProofImageUrl();
        this.submittedAt = prove.getSubmittedAt();

        if (prove.getPaymentId() != null) {
            this.paymentId = prove.getPaymentId().getId();
            this.paymentStatus = prove.getPaymentId().getStatus();
        }
    }

    // Getters and setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTransactionCode() {
        return transactionCode;
    }

    public void setTransactionCode(String transactionCode) {
        this.transactionCode = transactionCode;
    }

    public String getProofImageUrl() {
        return proofImageUrl;
    }

    public void setProofImageUrl(String proofImageUrl) {
        this.proofImageUrl = proofImageUrl;
    }

    public Date getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Date submittedAt) {
        this.submittedAt = submittedAt;
    }

    public int getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(int paymentId) {
        this.paymentId = paymentId;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}

