/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ltlt.repositories;

import com.ltlt.pojo.Survey;
import jakarta.data.repository.Query;
import java.util.List;

/**
 *
 * @author aicon
 */
public interface SurveyRepository {

    List<Survey> getAllSurveys();

    Survey getSurveyById(int id);

    void addSurvey(Survey survey);

    Survey getLatestSurvey();

    Survey getSurveyWithResults(int surveyId);

    void deleteSurvey(Survey survey);

}
