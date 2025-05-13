package com.nhtg.web.repository;

import com.nhtg.web.model.SurveyResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, Long> {
    List<SurveyResponse> findBySurveyId(Long surveyId);
} 