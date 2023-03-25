package com.benrevo.common.enums;

public enum  ClientFileType {
    SUBSCRIBER("Subscriber"),
    MEMBER("Member");

    ClientFileType(String message) {
        this.message = message;
    }

    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}