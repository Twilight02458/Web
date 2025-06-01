/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ltlt.services;

import com.ltlt.pojo.Locker;
import java.util.List;

/**
 *
 * @author aicon
 */
public interface LockerService {
    List<Locker> getItemsForUser(int userId);
    List<Locker> getPendingItems(int userId);
    void addNewItem(Locker item);
    boolean changeLockerStatus(int lockerId, String status);

}
