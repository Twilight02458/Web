/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.services.impl;

import com.ltlt.dto.SurveyOptionRequest;
import com.ltlt.dto.SurveyQuestionRequest;
import com.ltlt.dto.SurveyRequest;
import com.ltlt.pojo.Survey;
import com.ltlt.pojo.SurveyAnswer;
import com.ltlt.pojo.SurveyOption;
import com.ltlt.pojo.SurveyQuestion;
import com.ltlt.repositories.SurveyAnswerRepository;
import com.ltlt.repositories.SurveyOptionRepository;
import com.ltlt.repositories.SurveyQuestionRepository;
import com.ltlt.repositories.SurveyRepository;
import com.ltlt.services.SurveyService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author aicon
 */
@Service
public class SurveyServiceImpl implements SurveyService {

    @Autowired
    private SurveyRepository surveyRepo;
    @Autowired
    private SurveyQuestionRepository questionRepo;
    @Autowired
    private SurveyOptionRepository optionRepo;

    @Override
    public List<Survey> getAllSurveys() {
        return surveyRepo.getAllSurveys();
    }

    @Override
    public Survey getSurveyById(int id) {
        return surveyRepo.getSurveyById(id);
    }

    @Override
    @Transactional
    public void createSurvey(Survey survey) {
        surveyRepo.addSurvey(survey);  
    }

    @Autowired
    private SurveyAnswerRepository surveyAnswerRepo;

    @Override
    public Survey getLatestSurveyForUser(int userId) {
        Survey latest = surveyRepo.getLatestSurvey();
        if (latest != null && !surveyAnswerRepo.hasUserAnsweredSurvey(userId, latest.getId())) {
            return latest;
        }
        return null;
    }


    @Override
    public SurveyRequest convertToRequest(Survey survey) {
        SurveyRequest req = new SurveyRequest();
        req.setId(survey.getId());
        req.setTitle(survey.getTitle());
        req.setDescription(survey.getDescription());
        req.setCreatedAt(survey.getCreatedAt());

        List<SurveyQuestionRequest> questionReqs = new ArrayList<>();
        for (SurveyQuestion question : survey.getSurveyQuestionCollection()) {
            SurveyQuestionRequest qReq = new SurveyQuestionRequest();
            qReq.setId(question.getId());
            qReq.setQuestionText(question.getQuestionText());

            List<SurveyOptionRequest> optionReqs = new ArrayList<>();
            for (SurveyOption option : question.getSurveyOptionCollection()) {
                SurveyOptionRequest oReq = new SurveyOptionRequest();
                oReq.setId(option.getId());
                oReq.setOptionText(option.getOptionText());
                optionReqs.add(oReq);
            }

            qReq.setOptions(optionReqs);
            questionReqs.add(qReq);
        }

        req.setQuestions(questionReqs);
        return req;
    }

    @Override
    @Transactional
    public void saveSurveyAnswers(List<SurveyAnswer> answers) {
        for (SurveyAnswer answer : answers) {
            surveyAnswerRepo.save(answer);
        }
    }

    @Override
    public boolean hasUserAnswered(int userId, int surveyId) {
        return surveyAnswerRepo.hasUserAnsweredSurvey(userId, surveyId);
    }

    @Override
    public List<SurveyAnswer> getAnswersBySurvey(int surveyId) {
        return surveyAnswerRepo.findBySurveyId(surveyId);
    }

    @Override
    @Transactional
    public void deleteAnswersIfNotSubmitted(int userId, int surveyId) {
        if (!hasUserAnswered(userId, surveyId)) {
            surveyAnswerRepo.deleteBySurveyIdAndUserId(surveyId, userId);
        }
    }
    @Autowired
    private LocalSessionFactoryBean sessionFactory;
    
    @Override
    public Map<Integer, Map<Integer, Long>> getSurveyResult(int surveyId) {
        List<Object[]> raw = surveyAnswerRepo.countAnswersByQuestionAndOption(surveyId);
        Map<Integer, Map<Integer, Long>> result = new HashMap<>();
        for (Object[] row : raw) {
            Integer qId = (Integer) row[0];
            Integer optId = (Integer) row[1];
            Long count = (Long) row[2];
            result.computeIfAbsent(qId, k -> new HashMap<>()).put(optId, count);
        }
        return result;
    }
    

    @Override
    public Survey getSurveyWithResults(int surveyId) {
        return surveyRepo.getSurveyWithResults(surveyId);
    }
}
