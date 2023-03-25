package com.benrevo.common.dto;

import java.util.Objects;

public class QuoteParserErrorDto {

    private String mainMessage;
    private String subMessage;

    public QuoteParserErrorDto() {}

    public QuoteParserErrorDto(String mainMessage) {
        this.mainMessage = mainMessage;
    }

    public QuoteParserErrorDto(String mainMessage, String subMessage) {
        this.mainMessage = mainMessage;
        this.subMessage = subMessage;
    }

    public String getMainMessage() {
        return mainMessage;
    }

    public void setMainMessage(String mainMessage) {
        this.mainMessage = mainMessage;
    }

    public String getSubMessage() {
        return subMessage;
    }

    public void setSubMessage(String subMessage) {
        this.subMessage = subMessage;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        QuoteParserErrorDto that = (QuoteParserErrorDto) o;
        return Objects.equals(mainMessage, that.mainMessage);
    }

    @Override
    public int hashCode() {
        return Objects.hash(mainMessage);
    }
}
