/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ltlt.repositories;

import com.ltlt.pojo.Locker;
import java.util.List;

/**
 *
 * @author aicon
 */
public interface LockerRepository {
    List<Locker> getItemsByUserId(int userId);
    List<Locker> getPendingItemsByUserId(int userId);
    void addLockerItem(Locker item);
    boolean updateStatus(int lockerId, String status);

}
