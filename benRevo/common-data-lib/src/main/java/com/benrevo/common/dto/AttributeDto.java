package com.benrevo.common.dto;

import com.benrevo.common.enums.AttributeName;

public class AttributeDto {

    private AttributeName attributeName;
    private String value;
    private String description;

    public AttributeDto(){}

    public AttributeDto(AttributeName attributeName, String value) {
        this.attributeName = attributeName;
        this.value = value;
    }

    public AttributeDto(AttributeName attributeName, String value, String description) {
        this.attributeName = attributeName;
        this.value = value;
        this.description = description;
    }

    public AttributeName getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(AttributeName attributeName) {
        this.attributeName = attributeName;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
