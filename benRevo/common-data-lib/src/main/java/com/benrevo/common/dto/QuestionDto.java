package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class QuestionDto {
    private Long questionId;

    @NotNull
    private String code;

    @NotNull
    private String title;

    private boolean multiselectable;

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isMultiselectable() {
        return multiselectable;
    }

    public void setMultiselectable(boolean multiselectable) {
        this.multiselectable = multiselectable;
    }
}