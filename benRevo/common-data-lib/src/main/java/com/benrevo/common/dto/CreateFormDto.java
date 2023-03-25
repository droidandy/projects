package com.benrevo.common.dto;

import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

public class CreateFormDto {
    @NotNull
    private String name;

    @NotNull
    private Long carrierId;

    @Valid
    @NotNull
    @NotEmpty
    private List<ShortQuestionDto> questions;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }

    public List<ShortQuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<ShortQuestionDto> questions) {
        this.questions = questions;
    }
}