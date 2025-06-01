/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ltlt.repositories;

import com.ltlt.pojo.SurveyQuestion;
import java.util.List;

/**
 *
 * @author aicon
 */
public interface SurveyQuestionRepository {
    List<SurveyQuestion> getQuestionsBySurveyId(int surveyId);
    void addQuestion(SurveyQuestion question);
}
