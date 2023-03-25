package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class ValidationErrorDto {

    private List<String> errors = new ArrayList<>();


    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }
}
