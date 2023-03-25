package com.benrevo.common.logging;

import com.benrevo.common.logging.http.HttpRequestLogMessage;
import com.splunk.logging.HttpEventCollectorEventInfo;

import java.util.List;
import org.apache.commons.lang3.tuple.Pair;

/**
 * Created by awelemdyorakwue on 5/22/17.
 */
public class CustomHttpEventCollectorEventInfo extends HttpEventCollectorEventInfo {
    private String tid;
    private String authId;
    private String brokerId;
    private String brokerName;
    private String loggerName;
    private String method;
    private String stackTrace;
    private List<Pair<String, Object>> fields;
    private HttpRequestLogMessage httpDetails;

    private CustomHttpEventCollectorEventInfo(Builder builder) {
        super(builder.severity, builder.message);

        tid = builder.tid;
        authId = builder.authId;
        brokerId = builder.brokerId;
        brokerName = builder.brokerName;
        loggerName = builder.loggerName;
        method = builder.method;
        stackTrace = builder.stackTrace;
        fields = builder.fields;
        httpDetails = builder.httpDetails;
    }

    public final String getTid() {
        return this.tid;
    }

    public final String getAuthId() {
        return this.authId;
    }

    public String getBrokerId() {
        return brokerId;
    }

    public String getBrokerName() {
        return brokerName;
    }

    public final String getLoggerName() {
        return this.loggerName;
    }

    public String getMethod() {
        return method;
    }

    public final String getStackTrace() {
        return stackTrace;
    }

    public List<Pair<String, Object>> getFields() {
        return fields;
    }

    public HttpRequestLogMessage getHttpDetails() {
        return httpDetails;
    }

    public static final class Builder {
        private String severity;
        private String message;
        private String tid;
        private String authId;
        private String brokerId;
        private String brokerName;
        private String loggerName;
        private String method;
        private String stackTrace;
        private List<Pair<String, Object>> fields;
        private HttpRequestLogMessage httpDetails;

        public Builder() {}

        public Builder withSeverity(String val) {
            severity = val;
            return this;
        }

        public Builder withMessage(String val) {
            message = val;
            return this;
        }

        public Builder withTid(String val) {
            tid = val;
            return this;
        }

        public Builder withAuthId(String val) {
            authId = val;
            return this;
        }

        public Builder withBrokerId(String val) {
            brokerId = val;
            return this;
        }

        public Builder withBrokerName(String val) {
            brokerName = val;
            return this;
        }

        public Builder withLoggerName(String val) {
            loggerName = val;
            return this;
        }

        public Builder withMethod(String val) {
            method = val;
            return this;
        }

        public Builder withStackTrace(String val) {
            stackTrace = val;
            return this;
        }

        public Builder withFields(List<Pair<String, Object>> val) {
            if(val != null && val.size() > 0) {
                fields = val;
            }

            return this;
        }

        public Builder withHttpDetails(HttpRequestLogMessage val) {
            httpDetails = val;

            return this;
        }

        public CustomHttpEventCollectorEventInfo build() {
            return new CustomHttpEventCollectorEventInfo(this);
        }
    }
}