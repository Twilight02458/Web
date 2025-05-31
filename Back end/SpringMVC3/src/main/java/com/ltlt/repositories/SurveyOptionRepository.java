/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ltlt.repositories;

import com.ltlt.pojo.SurveyOption;
import java.util.List;

/**
 *
 * @author aicon
 */
public interface SurveyOptionRepository {
    List<SurveyOption> getOptionsByQuestionId(int questionId);
    void addOption(SurveyOption option);
}

