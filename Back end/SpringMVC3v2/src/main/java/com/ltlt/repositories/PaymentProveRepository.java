/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ltlt.repositories;

import com.ltlt.pojo.PaymentProve;
import java.util.List;


/**
 *
 * @author aicon
 */

public interface PaymentProveRepository {
     List<PaymentProve> getPendingProvesByUserId(int userId);
     PaymentProve getById(int id); // hoặc Optional<PaymentProve> findById(int id);

    void save(PaymentProve prove);
}
