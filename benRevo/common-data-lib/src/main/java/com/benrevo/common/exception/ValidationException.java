package com.benrevo.common.exception;

public class ValidationException extends BadRequestException {

    public ValidationException(String message) {
        super(message);
    }
}