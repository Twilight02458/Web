/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.dto;

import java.util.List;

/**
 *
 * @author aicon
 */
public class SurveyQuestionRequest {
    private Integer id;
    private String questionText;
    private List<SurveyOptionRequest> options;

    /**
     * @return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * @return the questionText
     */
    public String getQuestionText() {
        return questionText;
    }

    /**
     * @param questionText the questionText to set
     */
    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    /**
     * @return the options
     */
    public List<SurveyOptionRequest> getOptions() {
        return options;
    }

    /**
     * @param options the options to set
     */
    public void setOptions(List<SurveyOptionRequest> options) {
        this.options = options;
    }
    
    
}
