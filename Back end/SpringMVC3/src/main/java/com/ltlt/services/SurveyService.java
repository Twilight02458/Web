/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ltlt.services;

import com.ltlt.dto.SurveyRequest;
import com.ltlt.pojo.Survey;
import com.ltlt.pojo.SurveyAnswer;
import com.ltlt.pojo.SurveyQuestion;
import java.util.List;
import java.util.Map;

/**
 *
 * @author aicon
 */
public interface SurveyService {
    List<Survey> getAllSurveys();
    Survey getSurveyById(int id);
    void createSurvey(Survey survey);
     Survey getLatestSurveyForUser(int userId);
    void saveSurveyAnswers(List<SurveyAnswer> answers);
    SurveyRequest convertToRequest(Survey survey); 
    boolean hasUserAnswered(int userId, int surveyId);
    List<SurveyAnswer> getAnswersBySurvey(int surveyId);
    void deleteAnswersIfNotSubmitted(int userId, int surveyId); 
    Map<Integer, Map<Integer, Long>> getSurveyResult(int surveyId);
Survey getSurveyWithResults(int surveyId);
void deleteSurvey(int id);

}
