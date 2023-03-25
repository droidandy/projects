package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class ShortQuestionDto {
    @NotNull
    private Long questionId;
    private boolean required;

    public ShortQuestionDto() {
    }

    public ShortQuestionDto(Long questionId, boolean required) {
        this.questionId = questionId;
        this.required = required;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ShortQuestionDto)) return false;

        ShortQuestionDto that = (ShortQuestionDto) o;

        if (required != that.required) return false;
        if (!questionId.equals(that.questionId)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = questionId.hashCode();
        result = 31 * result + (required ? 1 : 0);
        return result;
    }
}