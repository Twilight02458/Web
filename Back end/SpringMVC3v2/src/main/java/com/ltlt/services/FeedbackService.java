/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ltlt.services;

import com.ltlt.pojo.Feedback;
import java.util.List;

/**
 *
 * @author aicon
 */
public interface FeedbackService {
    void submitFeedback(Feedback feedback);
    List<Feedback> getAll();
    void deleteById(int id);
    void saveFeedback(Feedback feedback);
}

