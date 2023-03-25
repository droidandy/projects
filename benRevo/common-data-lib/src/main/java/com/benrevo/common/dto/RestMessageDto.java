package com.benrevo.common.dto;

import java.util.Map;

public class RestMessageDto {

    private String message;
    private boolean success;
    private boolean clientMessage;
    private Map<String, Object> errors;

    public RestMessageDto() {}

    public RestMessageDto(final String message, final boolean success, final boolean clientMessage) {
        this.message = message;
        this.success = success;
        this.clientMessage = clientMessage;
    }

    public RestMessageDto(final String message, final boolean success) {
        this(message, success, false);
    }

    public RestMessageDto(final String message) {
        this(message, false);
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isClientMessage() {
        return clientMessage;
    }

    public void setClientMessage(boolean clientMessage) {
        this.clientMessage = clientMessage;
    }

    public Map<String, Object> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, Object> errors) {
        this.errors = errors;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public static RestMessageDto createSuccessRestMessageDTO(String message) {
        return new RestMessageDto(message, true);
    }

    public static RestMessageDto createFailureRestMessageDTO(String message) {
        return new RestMessageDto(message, false);
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) {
            return true;
        }
        if(o == null || getClass() != o.getClass()) {
            return false;
        }

        RestMessageDto that = (RestMessageDto) o;

        if(success != that.success) {
            return false;
        }
        if(clientMessage != that.clientMessage) {
            return false;
        }
        return message != null ? message.equals(that.message) : that.message == null;
    }

    @Override
    public int hashCode() {
        int result = message != null ? message.hashCode() : 0;
        result = 31 * result + (success ? 1 : 0);
        result = 31 * result + (clientMessage ? 1 : 0);
        return result;
    }

    @Override
    public String toString() {
        return "RestMessageDTO{" +
               "message='" + message + '\'' +
               ", success=" + success +
               ", clientMessage=" + clientMessage +
               '}';
    }
}
