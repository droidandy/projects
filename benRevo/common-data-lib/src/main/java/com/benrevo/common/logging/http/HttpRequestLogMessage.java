package com.benrevo.common.logging.http;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;

import java.util.Map;
import org.apache.logging.log4j.message.Message;

/**
 * Custom {@link Message} to store HTTP request info and log in Splunk/Log4j2.
 */
public class HttpRequestLogMessage implements Message {

    private static final Gson gson = new GsonBuilder()
        .disableHtmlEscaping()
        .setPrettyPrinting()
        .create();

    private Map<String, Object> properties;

    public HttpRequestLogMessage(final Map<String, Object> properties) {
        this.properties = properties;
    }

    @Override
    public String getFormattedMessage() {
        return gson.toJson(properties);
    }

    @Override
    public String getFormat() {
        return null;
    }

    @Override
    public Object[] getParameters() {
        return null;
    }

    @Override
    public Throwable getThrowable() {
        return null;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public JsonElement getPropertiesAsJsonElement() {
        return gson.toJsonTree(properties);
    }
}
