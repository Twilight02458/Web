/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ltlt.repositories;

import com.ltlt.pojo.Feedback;
import java.util.List;

/**
 *
 * @author aicon
 */
public interface FeedbackRepository {

    void save(Feedback feedback);

    List<Feedback> findAllOrderByCreatedAtDesc();

    void deleteById(int id);
}
