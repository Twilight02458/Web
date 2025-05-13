package com.nhtg.web.model;

import jakarta.persistence.*;

@Entity
@Table(name = "survey_questions")
public class SurveyQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "survey_id", nullable = false)
    private Survey survey;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false)
    private QuestionType questionType;

    @Column(columnDefinition = "JSON")
    private String options; // Lưu dưới dạng JSON cho MULTIPLE_CHOICE

    public enum QuestionType {
        TEXT, MULTIPLE_CHOICE, RATING
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Survey getSurvey() { return survey; }
    public void setSurvey(Survey survey) { this.survey = survey; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public QuestionType getQuestionType() { return questionType; }
    public void setQuestionType(QuestionType questionType) { this.questionType = questionType; }
    public String getOptions() { return options; }
    public void setOptions(String options) { this.options = options; }
} 