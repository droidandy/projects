package com.benrevo.common.event;

import static java.util.Arrays.copyOf;
import static java.util.Arrays.stream;
import static java.util.stream.Collectors.toMap;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang3.tuple.Pair;

/**
 * Created by elliott on 9/21/17 at 6:09 PM.
 */
public class AnalyticsEvent {

    @JsonProperty("collection")
    private String collection;

    @JsonProperty("api")
    private EventContext api;

    @JsonProperty("properties")
    private Map<String, String> properties = new HashMap<>();

    public AnalyticsEvent() {}

    @JsonIgnore
    private AnalyticsEvent(Builder builder) {
        setCollection(builder.collection);
        setApi(builder.api);
        setProperties(builder.properties);
    }

    public String getCollection() {
        return collection;
    }

    public void setCollection(String collection) {
        this.collection = collection;
    }

    public EventContext getApi() {
        return api;
    }

    public void setApi(EventContext api) {
        this.api = api;
    }

    public Map<String, String> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, String> properties) {
        if(this.properties.size() > 0) {
            this.properties.putAll(properties);
        } else {
            this.properties = properties;
        }
    }

    public static final class Builder {

        private String collection;
        private EventContext api;
        private Map<String, String> properties = new HashMap<>();

        public Builder() {}

        public Builder withCollection(String val) {
            collection = val;
            return this;
        }

        public Builder withApi(EventContext val) {
            api = val;
            return this;
        }

        public Builder withProperties(Map<String, String> val) {
            properties = val != null ? val : new HashMap<>();
            return this;
        }

        public Builder withProperties(Pair<String, String>... val) {
            properties = stream(copyOf(val, val.length))
                .collect(
                    toMap(
                        Pair::getKey,
                        Pair::getValue
                    )
                );

            return this;
        }

        public AnalyticsEvent build() {
            return new AnalyticsEvent(this);
        }
    }

    public static class EventContext {

        @JsonProperty("api_key")
        private String apiKey;

        @JsonProperty("api_version")
        private String apiVersion;

        @JsonProperty("upload_time")
        private Long uploadTime;

        @JsonProperty("checksum")
        private String checksum;

        public EventContext() {}

        @JsonIgnore
        private EventContext(Builder builder) {
            setApiKey(builder.apiKey);
            setApiVersion(builder.apiVersion);
            setUploadTime(builder.uploadTime);
            setChecksum(builder.checksum);
        }

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }

        public String getApiVersion() {
            return apiVersion;
        }

        public void setApiVersion(String apiVersion) {
            this.apiVersion = apiVersion;
        }

        public Long getUploadTime() {
            return uploadTime;
        }

        public void setUploadTime(Long uploadTime) {
            this.uploadTime = uploadTime;
        }

        public String getChecksum() {
            return checksum;
        }

        public void setChecksum(String checksum) {
            this.checksum = checksum;
        }

        public static final class Builder {

            private String apiKey;
            private String apiVersion;
            private Long uploadTime;
            private String checksum;

            public Builder() {}

            public Builder withApiKey(String val) {
                apiKey = val;
                return this;
            }

            public Builder withApiVersion(String val) {
                apiVersion = val;
                return this;
            }

            public Builder withUploadTime(Long val) {
                uploadTime = val;
                return this;
            }

            public Builder withChecksum(String val) {
                checksum = val;
                return this;
            }

            public EventContext build() {
                return new EventContext(this);
            }
        }
    }
}
