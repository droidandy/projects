package com.benrevo.common.exception;

import static org.apache.http.HttpStatus.SC_NOT_FOUND;

public class NotFoundException extends BaseException {

    public NotFoundException() {
        super("Not Found", SC_NOT_FOUND);
    }

    public NotFoundException(String message) {
        super(message, SC_NOT_FOUND);
    }

    public NotFoundException(String message, Throwable cause) {
        super(message, SC_NOT_FOUND, cause);
    }

    public NotFoundException(String message, int status) {
        super(message, status);
    }

    public NotFoundException(String message, int status, Throwable cause) {
        super(message, status, cause);
    }
}
