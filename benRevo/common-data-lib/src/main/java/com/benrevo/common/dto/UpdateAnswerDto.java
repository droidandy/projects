package com.benrevo.common.dto;

import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import java.util.List;

public class UpdateAnswerDto {
    @NotNull
    private Long clientId;
    @NotNull
    @NotEmpty
    private List<UpdateShortAnswerDto> answers;

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public List<UpdateShortAnswerDto> getAnswers() {
        return answers;
    }

    public void setAnswers(List<UpdateShortAnswerDto> answers) {
        this.answers = answers;
    }
}