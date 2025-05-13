package com.nhtg.web.controller;

import com.nhtg.web.model.Survey;
import com.nhtg.web.model.SurveyQuestion;
import com.nhtg.web.model.SurveyResponse;
import com.nhtg.web.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/surveys")
public class SurveyController {
    @Autowired
    private SurveyService surveyService;

    // Quản trị viên tạo khảo sát
    @PostMapping
    public ResponseEntity<Survey> createSurvey(@RequestBody SurveyRequest surveyRequest) {
        Survey survey = new Survey();
        survey.setTitle(surveyRequest.getTitle());
        survey.setDescription(surveyRequest.getDescription());
        Survey createdSurvey = surveyService.createSurvey(survey, surveyRequest.getQuestions(), surveyRequest.getAdminId());
        return ResponseEntity.ok(createdSurvey);
    }

    // Lấy danh sách khảo sát
    @GetMapping
    public ResponseEntity<List<Survey>> getAllSurveys() {
        return ResponseEntity.ok(surveyService.getAllSurveys());
    }

    // Lấy chi tiết khảo sát
    @GetMapping("/{id}")
    public ResponseEntity<Survey> getSurveyById(@PathVariable Long id) {
        return ResponseEntity.ok(surveyService.getSurveyById(id));
    }

    // Lấy câu hỏi của khảo sát
    @GetMapping("/{id}/questions")
    public ResponseEntity<List<SurveyQuestion>> getQuestionsBySurveyId(@PathVariable Long id) {
        return ResponseEntity.ok(surveyService.getQuestionsBySurveyId(id));
    }

    // Cư dân gửi câu trả lời
    @PostMapping("/responses")
    public ResponseEntity<SurveyResponse> submitResponse(@RequestBody SurveyResponse response, @RequestParam Long userId) {
        return ResponseEntity.ok(surveyService.submitResponse(response, userId));
    }

    // Quản trị viên xem kết quả khảo sát
    @GetMapping("/{id}/responses")
    public ResponseEntity<List<SurveyResponse>> getResponsesBySurveyId(@PathVariable Long id) {
        return ResponseEntity.ok(surveyService.getResponsesBySurveyId(id));
    }
}

// DTO để nhận dữ liệu từ Frontend
class SurveyRequest {
    private String title;
    private String description;
    private Long adminId;
    private List<SurveyQuestion> questions;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }
    public List<SurveyQuestion> getQuestions() { return questions; }
    public void setQuestions(List<SurveyQuestion> questions) { this.questions = questions; }
} 