package com.benrevo.common.dto;

public class FormQuestionDto {
    private Long formQuestionId;

    private Integer indexNumber;

    private boolean required;

    private QuestionDto question;

    public Long getFormQuestionId() {
        return formQuestionId;
    }

    public void setFormQuestionId(Long formQuestionId) {
        this.formQuestionId = formQuestionId;
    }

    public Integer getIndexNumber() {
        return indexNumber;
    }

    public void setIndexNumber(Integer indexNumber) {
        this.indexNumber = indexNumber;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public QuestionDto getQuestion() {
        return question;
    }

    public void setQuestion(QuestionDto question) {
        this.question = question;
    }
}