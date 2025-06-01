/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author aicon
 */
@Entity
@Table(name = "payment_prove")
@NamedQueries({
    @NamedQuery(name = "PaymentProve.findAll", query = "SELECT p FROM PaymentProve p"),
    @NamedQuery(name = "PaymentProve.findById", query = "SELECT p FROM PaymentProve p WHERE p.id = :id"),
    @NamedQuery(name = "PaymentProve.findByTransactionCode", query = "SELECT p FROM PaymentProve p WHERE p.transactionCode = :transactionCode"),
    @NamedQuery(name = "PaymentProve.findByProofImageUrl", query = "SELECT p FROM PaymentProve p WHERE p.proofImageUrl = :proofImageUrl"),
    @NamedQuery(name = "PaymentProve.findBySubmittedAt", query = "SELECT p FROM PaymentProve p WHERE p.submittedAt = :submittedAt")})
public class PaymentProve implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Size(max = 100)
    @Column(name = "transaction_code")
    private String transactionCode;
    @Size(max = 255)
    @Column(name = "proof_image_url")
    private String proofImageUrl;
    @Column(name = "submitted_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date submittedAt;
    @JoinColumn(name = "payment_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Payment paymentId;

    public PaymentProve() {
    }

    public PaymentProve(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    public Payment getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Payment paymentId) {
        this.paymentId = paymentId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof PaymentProve)) {
            return false;
        }
        PaymentProve other = (PaymentProve) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.ltlt.pojo.PaymentProve[ id=" + id + " ]";
    }
    
}
