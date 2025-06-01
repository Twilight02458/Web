/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ltlt.repositories;

import com.ltlt.pojo.SurveyAnswer;
import java.util.List;

/**
 *
 * @author aicon
 */
public interface SurveyAnswerRepository {
    void addAnswer(SurveyAnswer answer);
    List<SurveyAnswer> getAnswersBySurveyId(int surveyId);
    void save(SurveyAnswer answer);
    List<SurveyAnswer> findBySurveyId(int surveyId);
    boolean hasUserAnsweredSurvey(int userId, int surveyId);
    void deleteBySurveyIdAndUserId(int surveyId, int userId);
    List<Object[]> countAnswersByQuestionAndOption(int surveyId);
}