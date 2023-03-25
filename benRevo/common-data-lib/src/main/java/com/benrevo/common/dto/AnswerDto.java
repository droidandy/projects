package com.benrevo.common.dto;

import java.util.List;
import java.util.Map;

public class AnswerDto {

    private Long clientId;
    private Map<String, String> answers;
    private Map<String, List<String>> multiAnswers;
    private String submittedDate;

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Map<String, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<String, String> answers) {
        this.answers = answers;
    }

    public Map<String, List<String>> getMultiAnswers() {
        return multiAnswers;
    }

    public void setMultiAnswers(Map<String, List<String>> multiAnswers) {
        this.multiAnswers = multiAnswers;
    }

    public String getSubmittedDate() {
        return submittedDate;
    }

    public void setSubmittedDate(String submittedDate) {
        this.submittedDate = submittedDate;
    }
}
