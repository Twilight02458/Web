package com.nhtg.web.service;

import com.nhtg.web.model.*;
import com.nhtg.web.repository.SurveyQuestionRepository;
import com.nhtg.web.repository.SurveyRepository;
import com.nhtg.web.repository.SurveyResponseRepository;
import com.nhtg.web.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SurveyService {
    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private SurveyQuestionRepository questionRepository;

    @Autowired
    private SurveyResponseRepository responseRepository;

    @Autowired
    private UserRepository userRepository;

    public Survey createSurvey(Survey survey, List<SurveyQuestion> questions, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        survey.setCreatedBy(admin);
        survey.setCreatedAt(LocalDateTime.now());
        survey.setStatus(Survey.Status.OPEN);
        Survey savedSurvey = surveyRepository.save(survey);

        for (SurveyQuestion question : questions) {
            question.setSurvey(savedSurvey);
            questionRepository.save(question);
        }
        return savedSurvey;
    }

    public List<Survey> getAllSurveys() {
        return surveyRepository.findAll();
    }

    public Survey getSurveyById(Long id) {
        return surveyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Survey not found"));
    }

    public List<SurveyQuestion> getQuestionsBySurveyId(Long surveyId) {
        return questionRepository.findBySurveyId(surveyId);
    }

    public SurveyResponse submitResponse(SurveyResponse response, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        response.setUser(user);
        response.setCreatedAt(LocalDateTime.now());
        return responseRepository.save(response);
    }

    public List<SurveyResponse> getResponsesBySurveyId(Long surveyId) {
        return responseRepository.findBySurveyId(surveyId);
    }
} 