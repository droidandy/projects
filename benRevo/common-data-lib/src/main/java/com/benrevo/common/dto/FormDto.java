package com.benrevo.common.dto;

import java.util.List;

public class FormDto {
    private Long formId;

    private String name;

    private CarrierDto carrier;

    private List<FormQuestionDto> formQuestions;

    public Long getFormId() {
        return formId;
    }

    public void setFormId(Long formId) {
        this.formId = formId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CarrierDto getCarrier() {
        return carrier;
    }

    public void setCarrier(CarrierDto carrier) {
        this.carrier = carrier;
    }

    public List<FormQuestionDto> getFormQuestions() {
        return formQuestions;
    }

    public void setFormQuestions(List<FormQuestionDto> formQuestions) {
        this.formQuestions = formQuestions;
    }
}