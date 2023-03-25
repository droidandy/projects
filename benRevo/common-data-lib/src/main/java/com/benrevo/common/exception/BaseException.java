package com.benrevo.common.exception;

import org.apache.commons.lang3.tuple.Pair;
import org.apache.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

import static java.util.Arrays.asList;

public class BaseException extends RuntimeException {

    private List<Pair<String, Object>> fields = new ArrayList<>();
    private String message = "Internal Server Error";
    private int status = HttpStatus.SC_INTERNAL_SERVER_ERROR;

    public BaseException(String message) {
        super(message);

        this.message = message;
    }

    public BaseException(String message, Throwable cause) {
        super(message, cause);

        this.message = message;
    }

    public BaseException(String message, int status) {
        super(message);

        this.message = message;
        this.status = status;
    }

    public BaseException(String message, int status, Throwable cause) {
        super(message, cause);

        this.message = message;
        this.status = status;
    }

    public BaseException withFields(Pair<String, Object>... fields) {
        if(fields != null) {
            this.fields = new ArrayList<>(asList(fields));
        }

        return this;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public List<Pair<String, Object>> getFields() {
        return fields;
    }

    public Pair<String, Object>[] getFieldsAsArray() {
        Pair<String, Object>[] f = fields.toArray(new Pair[fields.size()]);

        return f.length > 0 ? f : null;
    }
}