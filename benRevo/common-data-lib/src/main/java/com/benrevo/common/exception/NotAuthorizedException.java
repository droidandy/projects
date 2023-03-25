package com.benrevo.common.exception;

import static org.apache.http.HttpStatus.SC_UNAUTHORIZED;

public class NotAuthorizedException extends BaseException {

    public NotAuthorizedException() {
        super("Unauthorized", SC_UNAUTHORIZED);
    }

    public NotAuthorizedException(String message) {
        super(message, SC_UNAUTHORIZED);
    }

    public NotAuthorizedException(String message, Throwable cause) {
        super(message, SC_UNAUTHORIZED, cause);
    }

    public NotAuthorizedException(String message, int status) {
        super(message, status);
    }

    public NotAuthorizedException(String message, int status, Throwable cause) {
        super(message, status, cause);
    }
}
