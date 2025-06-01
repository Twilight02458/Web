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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Collection;

/**
 *
 * @author aicon
 */
@Entity
@Table(name = "survey_option")
@NamedQueries({
    @NamedQuery(name = "SurveyOption.findAll", query = "SELECT s FROM SurveyOption s"),
    @NamedQuery(name = "SurveyOption.findById", query = "SELECT s FROM SurveyOption s WHERE s.id = :id"),
    @NamedQuery(name = "SurveyOption.findByOptionText", query = "SELECT s FROM SurveyOption s WHERE s.optionText = :optionText")})
public class SurveyOption implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Size(max = 100)
    @Column(name = "option_text")
    private String optionText;
    @OneToMany(mappedBy = "optionId")
    private Collection<SurveyAnswer> surveyAnswerCollection;
    @JoinColumn(name = "question_id", referencedColumnName = "id")
    @ManyToOne
    private SurveyQuestion questionId;

    public SurveyOption() {
    }

    public SurveyOption(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public Collection<SurveyAnswer> getSurveyAnswerCollection() {
        return surveyAnswerCollection;
    }

    public void setSurveyAnswerCollection(Collection<SurveyAnswer> surveyAnswerCollection) {
        this.surveyAnswerCollection = surveyAnswerCollection;
    }

    public SurveyQuestion getQuestionId() {
        return questionId;
    }

    public void setQuestionId(SurveyQuestion questionId) {
        this.questionId = questionId;
    }

    @Override
public boolean equals(Object object) {
    if (this == object) return true;
    if (!(object instanceof SurveyOption)) return false;
    SurveyOption other = (SurveyOption) object;

    if (this.id != null && other.id != null) {
        return this.id.equals(other.id);
    }

    return this.optionText != null && this.optionText.equals(other.optionText);
}

@Override
public int hashCode() {
    if (id != null) {
        return id.hashCode();
    }
    return optionText != null ? optionText.hashCode() : 0;
}


    @Override
    public String toString() {
        return "com.ltlt.pojo.SurveyOption[ id=" + id + " ]";
    }
    
}
