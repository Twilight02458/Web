package com.nhtg.web.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "survey_responses")
public class SurveyResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private SurveyQuestion question;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "response_text")
    private String responseText;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Survey getSurvey() { return survey; }
    public void setSurvey(Survey survey) { this.survey = survey; }
    public SurveyQuestion getQuestion() { return question; }
    public void setQuestion(SurveyQuestion question) { this.question = question; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getResponseText() { return responseText; }
    public void setResponseText(String responseText) { this.responseText = responseText; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 