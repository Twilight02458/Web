/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ltlt.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author aicon
 */
@Entity
@Table(name = "survey_answer")
@NamedQueries({
    @NamedQuery(name = "SurveyAnswer.findAll", query = "SELECT s FROM SurveyAnswer s"),
    @NamedQuery(name = "SurveyAnswer.findById", query = "SELECT s FROM SurveyAnswer s WHERE s.id = :id"),
    @NamedQuery(name = "SurveyAnswer.findByAnsweredAt", query = "SELECT s FROM SurveyAnswer s WHERE s.answeredAt = :answeredAt")})
public class SurveyAnswer implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "answered_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date answeredAt;
    @JoinColumn(name = "survey_id", referencedColumnName = "id")
    @ManyToOne
    private Survey surveyId;
    @JoinColumn(name = "option_id", referencedColumnName = "id")
    @ManyToOne
    private SurveyOption optionId;
    @JoinColumn(name = "question_id", referencedColumnName = "id")
    @ManyToOne
    private SurveyQuestion questionId;
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @ManyToOne
    private User userId;

    public SurveyAnswer() {
    }

    public SurveyAnswer(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getAnsweredAt() {
        return answeredAt;
    }

    public void setAnsweredAt(Date answeredAt) {
        this.answeredAt = answeredAt;
    }

    public Survey getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Survey surveyId) {
        this.surveyId = surveyId;
    }

    public SurveyOption getOptionId() {
        return optionId;
    }

    public void setOptionId(SurveyOption optionId) {
        this.optionId = optionId;
    }

    public SurveyQuestion getQuestionId() {
        return questionId;
    }

    public void setQuestionId(SurveyQuestion questionId) {
        this.questionId = questionId;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof SurveyAnswer)) {
            return false;
        }
        SurveyAnswer other = (SurveyAnswer) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.ltlt.pojo.SurveyAnswer[ id=" + id + " ]";
    }
    
}
