package com.benrevo.data.persistence.repository;

import java.util.Map;

public interface AnswerRepositoryCustom extends CustomRepository {
    Map<String, String> getAnswers(String formName, long clientId);

    Map<String, String> getMultiselectableAnswers(String formName, long clientId);
}