package com.benrevo.common.dto;

import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import java.util.List;

public class CreateAnswerDto {
    @NotNull
    private Long clientId;
    @NotNull
    @NotEmpty
    private List<ShortAnswerDto> answers;

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public List<ShortAnswerDto> getAnswers() {
        return answers;
    }

    public void setAnswers(List<ShortAnswerDto> answers) {
        this.answers = answers;
    }
}