package com.nhtg.web.repository;

import com.nhtg.web.model.SurveyQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SurveyQuestionRepository extends JpaRepository<SurveyQuestion, Long> {
    List<SurveyQuestion> findBySurveyId(Long surveyId);
} 