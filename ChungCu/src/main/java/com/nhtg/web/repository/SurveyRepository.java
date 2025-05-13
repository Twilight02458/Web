package com.nhtg.web.repository;

import com.nhtg.web.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
} 