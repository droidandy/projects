package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class UpdateShortAnswerDto {
    @NotNull
    private Long answerId;
    private String value;
    private Long variantId;

    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Long getVariantId() {
        return variantId;
    }

    public void setVariantId(Long variantId) {
        this.variantId = variantId;
    }
}