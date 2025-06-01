/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/**
 *
 * @author aicon
 */
@Entity
@Table(name = "survey_question")
@NamedQueries({
    @NamedQuery(name = "SurveyQuestion.findAll", query = "SELECT s FROM SurveyQuestion s"),
    @NamedQuery(name = "SurveyQuestion.findById", query = "SELECT s FROM SurveyQuestion s WHERE s.id = :id"),
    @NamedQuery(name = "SurveyQuestion.findByQuestionText", query = "SELECT s FROM SurveyQuestion s WHERE s.questionText = :questionText")})
public class SurveyQuestion implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Size(max = 255)
    @Column(name = "question_text")
    private String questionText;
    @OneToMany(mappedBy = "questionId")
    private Collection<SurveyAnswer> surveyAnswerCollection;
    @JoinColumn(name = "survey_id", referencedColumnName = "id")
    @ManyToOne
    private Survey surveyId;
    @OneToMany(mappedBy = "questionId", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SurveyOption> surveyOptionCollection= new HashSet<>();;

    public SurveyQuestion() {
    }

    public SurveyQuestion(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public Collection<SurveyAnswer> getSurveyAnswerCollection() {
        return surveyAnswerCollection;
    }

    public void setSurveyAnswerCollection(Collection<SurveyAnswer> surveyAnswerCollection) {
        this.surveyAnswerCollection = surveyAnswerCollection;
    }

    public Survey getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Survey surveyId) {
        this.surveyId = surveyId;
    }

    public Collection<SurveyOption> getSurveyOptionCollection() {
        return surveyOptionCollection;
    }

    public void setSurveyOptionCollection(Set<SurveyOption> surveyOptionCollection) {
        this.surveyOptionCollection = surveyOptionCollection;
    }
    
    public void addOption(SurveyOption option) {
    surveyOptionCollection.add(option);
    option.setQuestionId(this);
}
@Override
public boolean equals(Object object) {
    if (this == object) return true;
    if (!(object instanceof SurveyQuestion)) return false;
    SurveyQuestion other = (SurveyQuestion) object;

    if (this.id != null && other.id != null) {
        return this.id.equals(other.id);
    }

    // Nếu chưa có id, so sánh theo thuộc tính khác (ví dụ questionText)
    return this.questionText != null && this.questionText.equals(other.questionText);
}

@Override
public int hashCode() {
    if (id != null) {
        return id.hashCode();
    }
    return questionText != null ? questionText.hashCode() : 0;
}


    @Override
    public String toString() {
        return "com.ltlt.pojo.SurveyQuestion[ id=" + id + " ]";
    }
    
}
