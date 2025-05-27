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
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 *
 * @author aicon
 */
@Entity
@Table(name = "payment_item")
@NamedQueries({
    @NamedQuery(name = "PaymentItem.findAll", query = "SELECT p FROM PaymentItem p"),
    @NamedQuery(name = "PaymentItem.findById", query = "SELECT p FROM PaymentItem p WHERE p.id = :id"),
    @NamedQuery(name = "PaymentItem.findByFeeType", query = "SELECT p FROM PaymentItem p WHERE p.feeType = :feeType"),
    @NamedQuery(name = "PaymentItem.findByAmount", query = "SELECT p FROM PaymentItem p WHERE p.amount = :amount")})
public class PaymentItem implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "fee_type")
    private String feeType;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Basic(optional = false)
    @NotNull
    @Column(name = "amount")
    private BigDecimal amount;
    @JoinColumn(name = "payment_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Payment paymentId;

    public PaymentItem() {
    }

    public PaymentItem(Integer id) {
        this.id = id;
    }

    public PaymentItem(Integer id, String feeType, BigDecimal amount) {
        this.id = id;
        this.feeType = feeType;
        this.amount = amount;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFeeType() {
        return feeType;
    }

    public void setFeeType(String feeType) {
        this.feeType = feeType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
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
        if (!(object instanceof PaymentItem)) {
            return false;
        }
        PaymentItem other = (PaymentItem) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.ltlt.pojo.PaymentItem[ id=" + id + " ]";
    }
    
}
