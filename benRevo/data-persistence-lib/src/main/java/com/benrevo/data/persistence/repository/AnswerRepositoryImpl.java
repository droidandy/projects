package com.benrevo.data.persistence.repository;

import java.util.HashMap;
import java.util.Map;

public class AnswerRepositoryImpl extends AbstractCustomRepository implements AnswerRepositoryCustom {
    private static final String QUERY_CLIENT_ANSWERS = "SELECT q.code, a.value  " +
            "FROM Client c, Answer a, Question q, FormQuestion fq, Form f " +
            "WHERE c.clientId = a.client.clientId AND a.question.questionId = q.questionId AND q.questionId = fq.question.questionId " +
            "AND q.multiselectable = false AND fq.form.formId = f.formId AND f.name = :formName AND c.clientId = :clientId";

    private static final String QUERY_CLIENT_MULTISELECTABLE_ANSWERS = "SELECT v.alias, v.option " +
            "FROM Client c, Answer a, Question q, FormQuestion fq, Form f, Variant v " +
            "WHERE c.clientId = a.client.clientId AND a.question.questionId = q.questionId " +
            "AND q.questionId = fq.question.questionId AND q.multiselectable = true " +
            "AND v.question.questionId = q.questionId AND v.option = a.value " +
            "AND fq.form.formId = f.formId AND f.name = :formName AND c.clientId = :clientId";

    @Override
    public Map<String, String> getAnswers(String formName, long clientId) {
        Map<String, Object> params = new HashMap<>();
        params.put("formName", formName);
        params.put("clientId", clientId);
        return resultAsMap(QUERY_CLIENT_ANSWERS, params);
    }

    @Override
    public Map<String, String> getMultiselectableAnswers(String formName, long clientId){
        Map<String, Object> params = new HashMap<>();
        params.put("formName", formName);
        params.put("clientId", clientId);
        return resultAsMap(QUERY_CLIENT_MULTISELECTABLE_ANSWERS, params);
    }
}