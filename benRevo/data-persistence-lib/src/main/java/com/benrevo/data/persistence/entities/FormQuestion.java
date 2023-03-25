package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "form_question")
public class FormQuestion {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "form_question_id")
    private Long formQuestionId;

    @Column (name = "required")
    private boolean required;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id", nullable = false)
    private Form form;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column (name = "invisible", nullable = false)
    private boolean invisible;

    public Long getFormQuestionId() {
        return formQuestionId;
    }

    public void setFormQuestionId(Long formQuestionId) {
        this.formQuestionId = formQuestionId;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public Form getForm() {
        return form;
    }

    public void setForm(Form form) {
        this.form = form;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public boolean isInvisible() {
        return invisible;
    }

    public void setInvisible(boolean invisible) {
        this.invisible = invisible;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FormQuestion)) return false;

        FormQuestion that = (FormQuestion) o;

        if (invisible != that.invisible) return false;
        if (required != that.required) return false;
        if (!form.equals(that.form)) return false;
        if (!formQuestionId.equals(that.formQuestionId)) return false;
        if (!question.equals(that.question)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = formQuestionId.hashCode();
        result = 31 * result + (required ? 1 : 0);
        result = 31 * result + form.hashCode();
        result = 31 * result + question.hashCode();
        result = 31 * result + (invisible ? 1 : 0);
        return result;
    }
}