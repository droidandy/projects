package com.benrevo.be.modules.onboarding.service.email.report;

import com.benrevo.common.exception.DocumentGeneratorException;

import java.io.InputStream;
import java.util.Map;

public interface DocumentProcessor<T> {
    Document<T> load(InputStream inputStream);
    Document<T> build(String pathToTemplate, Map<String, String> dataMap) throws DocumentGeneratorException;
}