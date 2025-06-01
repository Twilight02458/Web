/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.dto;

/**
 *
 * @author aicon
 */

public class SurveyAnswerRequest {
    private int surveyId;
    private int questionId;
    private int optionId;
    
    public SurveyAnswerRequest() {}
    /**
     * @return the surveyId
     */
    public int getSurveyId() {
        return surveyId;
    }

    /**
     * @param surveyId the surveyId to set
     */
    public void setSurveyId(int surveyId) {
        this.surveyId = surveyId;
    }

    /**
     * @return the questionId
     */
    public int getQuestionId() {
        return questionId;
    }

    /**
     * @param questionId the questionId to set
     */
    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    /**
     * @return the optionId
     */
    public int getOptionId() {
        return optionId;
    }

    /**
     * @param optionId the optionId to set
     */
    public void setOptionId(int optionId) {
        this.optionId = optionId;
    }
    
    
}
