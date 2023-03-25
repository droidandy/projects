package com.benrevo.common.exception;

import static org.apache.http.HttpStatus.SC_BAD_REQUEST;

public class BadRequestException extends BaseException {

    public BadRequestException() {
        super("Bad Request", SC_BAD_REQUEST);
    }

    public BadRequestException(String message) {
        super(message, SC_BAD_REQUEST);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, SC_BAD_REQUEST, cause);
    }

    public BadRequestException(String message, int status) {
        super(message, status);
    }

    public BadRequestException(String message, int status, Throwable cause) {
        super(message, status, cause);
    }
}
