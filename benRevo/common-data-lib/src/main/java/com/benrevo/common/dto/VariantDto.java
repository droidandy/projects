package com.benrevo.common.dto;

public class VariantDto {
    private Long variantId;

    private String option;

    private QuestionDto question;

    public Long getVariantId() {
        return variantId;
    }

    public void setVariantId(Long variantId) {
        this.variantId = variantId;
    }
}