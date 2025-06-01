/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ltlt.repositories;

import com.ltlt.pojo.PaymentItem;
import java.util.List;

public interface PaymentItemRepository {
    void save(PaymentItem paymentItem);
    List<PaymentItem> getItemsByPaymentId(int paymentId);
    void deleteByPaymentId(int paymentId);

}

