package com.benrevo.common.logging;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.apache.commons.lang3.exception.ExceptionUtils.getStackTrace;

import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.http.HttpRequestLogMessage;
import com.google.gson.JsonObject;
import com.splunk.logging.HttpEventCollectorErrorHandler;
import com.splunk.logging.HttpEventCollectorErrorHandler.ServerErrorException;
import com.splunk.logging.HttpEventCollectorEventInfo;
import com.splunk.logging.HttpEventCollectorMiddleware;
import com.splunk.logging.HttpEventCollectorMiddleware.HttpSenderMiddleware;
import com.splunk.logging.HttpEventCollectorMiddleware.IHttpSender;
import com.splunk.logging.HttpEventCollectorMiddleware.IHttpSenderCallback;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Dictionary;
import java.util.LinkedList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import javax.net.ssl.SSLContext;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.concurrent.FutureCallback;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.nio.client.CloseableHttpAsyncClient;
import org.apache.http.impl.nio.client.HttpAsyncClients;
import org.apache.http.ssl.SSLContexts;
import org.apache.http.util.EntityUtils;
import org.apache.logging.log4j.ThreadContext;
import org.apache.logging.log4j.core.LogEvent;

/**
 * Created by awelemdy orakwue on 5/22/17.
 */
final class CustomHttpEventCollectorSender extends TimerTask implements IHttpSender {

    private String url;
    private String token;
    private long maxEventsBatchCount;
    private long maxEventsBatchSize;
    private Dictionary<String, String> metadata;
    private Timer timer;
    private List<HttpEventCollectorEventInfo> eventsBatch = new LinkedList<>();
    private long eventsBatchSize = 0L;
    private CloseableHttpAsyncClient httpClient;
    private boolean disableCertificateValidation = false;
    private CustomHttpEventCollectorSender.SendMode sendMode;
    private HttpEventCollectorMiddleware middleware;

    CustomHttpEventCollectorSender(String url, String token, long delay, long maxEventsBatchCount, long maxEventsBatchSize, String sendModeStr, Dictionary<String, String> metadata) {
        this.sendMode = CustomHttpEventCollectorSender.SendMode.Sequential;
        this.middleware = new HttpEventCollectorMiddleware();
        this.url = url + "/services/collector/event/1.0";
        this.token = token;

        if(maxEventsBatchCount == 0L && maxEventsBatchSize > 0L) {
            maxEventsBatchCount = 9223372036854775807L;
        } else if(maxEventsBatchSize == 0L && maxEventsBatchCount > 0L) {
            maxEventsBatchSize = 9223372036854775807L;
        }

        this.maxEventsBatchCount = maxEventsBatchCount;
        this.maxEventsBatchSize = maxEventsBatchSize;
        this.metadata = metadata;

        if(sendModeStr != null) {
            if(sendModeStr.equals("sequential")) {
                this.sendMode = CustomHttpEventCollectorSender.SendMode.Sequential;
            } else {
                if(!sendModeStr.equals("parallel")) {
                    throw new IllegalArgumentException("Unknown send mode: " + sendModeStr);
                }

                this.sendMode = CustomHttpEventCollectorSender.SendMode.Parallel;
            }
        }

        if(delay > 0L) {
            this.timer = new Timer();
            this.timer.scheduleAtFixedRate(this, delay, delay);
        }

    }

    void addMiddleware(HttpSenderMiddleware middleware) {
        this.middleware.add(middleware);
    }

    public synchronized void send(LogEvent event) {
        List<Pair<String, Object>> fields = new ArrayList<>();

        Throwable e = event.getThrown();

        // Grab fields from exception if applicable
        if(e != null && e instanceof BaseException) {
            fields.addAll(((BaseException) e).getFields());
        }

        String severity = event.getLevel().name();
        String message = event.getMessage().getFormattedMessage();
        String loggerName = event.getLoggerName();
        String stackTrace = event.getThrown() != null ? getStackTrace(event.getThrown()) : null;

        CustomHttpEventCollectorEventInfo eventInfo = new CustomHttpEventCollectorEventInfo.Builder()
            .withSeverity(severity)
            .withMessage(message)
            .withLoggerName(loggerName)
            .withMethod(ThreadContext.get("method"))
            .withTid(ThreadContext.get("tid"))
            .withAuthId(ThreadContext.get("authId"))
            .withBrokerId(ThreadContext.get("brokerId"))
            .withBrokerName(ThreadContext.get("brokerName"))
            .withHttpDetails(
                event.getMessage() instanceof HttpRequestLogMessage
                    ? (HttpRequestLogMessage) event.getMessage()
                    : null
            )
            .withFields(fields)
            .withStackTrace(stackTrace)
            .build();

        this.eventsBatch.add(eventInfo);
        this.eventsBatchSize += (long) ((severity != null ? severity.length() : 0) + (message != null ? message.length() : 0));

        if((long) this.eventsBatch.size() >= this.maxEventsBatchCount || this.eventsBatchSize > this.maxEventsBatchSize) {
            this.flush();
        }
    }

    synchronized void flush() {
        if(this.eventsBatch.size() > 0) {
            this.postEventsAsync(this.eventsBatch);
        }

        this.eventsBatch = new LinkedList<>();
        this.eventsBatchSize = 0L;
    }

    public void run() {
        this.flush();
    }

    void disableCertificateValidation() {
        this.disableCertificateValidation = true;
    }

    private String serializeEventInfo(CustomHttpEventCollectorEventInfo eventInfo) {
        // Construct outer object
        JsonObject event = new JsonObject();

        String index = this.metadata.get("index");
        String source = this.metadata.get("source");
        String sourceType = this.metadata.get("sourcetype");
        String appCarrier = this.metadata.get("app_carrier");

        event.addProperty("time", String.format("%.3f", eventInfo.getTime()));

        if(isNotBlank(index)) {
            event.addProperty("index", index);
        }

        if(isNotBlank(source)) {
            event.addProperty("source", source);
        }

        if(isNotBlank(sourceType)) {
            event.addProperty("sourcetype", sourceType);
        }

        // Construct inner object
        JsonObject body = new JsonObject();
        JsonObject fields = new JsonObject();

        body.addProperty("severity", eventInfo.getSeverity().toUpperCase());


        if(isNotBlank(appCarrier)) {
            body.addProperty("appCarrier", appCarrier);
        }

        // Start Splunk custom information
        if(isNotBlank(eventInfo.getTid())) {
            body.addProperty("tid", eventInfo.getTid());
        }

        if(isNotBlank(eventInfo.getAuthId())) {
            body.addProperty("authId", eventInfo.getAuthId());
        }

        if(isNotBlank(eventInfo.getBrokerId())) {
            body.addProperty("brokerId", eventInfo.getBrokerId());
        }

        if(isNotBlank(eventInfo.getBrokerName())) {
            body.addProperty("brokerName", eventInfo.getBrokerName());
        }

        if(isNotBlank(eventInfo.getLoggerName())) {
            body.addProperty("class", eventInfo.getLoggerName());
        }

        if(isNotBlank(eventInfo.getMethod())) {
            body.addProperty("method", eventInfo.getMethod());
        }

        if(isNotBlank(eventInfo.getStackTrace())) {
            body.addProperty("stackTrace", eventInfo.getStackTrace());
        }

        if(eventInfo.getHttpDetails() != null && eventInfo.getHttpDetails().getProperties() != null) {
            body.addProperty("message", "HTTP");
            body.add("httpDetails", eventInfo.getHttpDetails().getPropertiesAsJsonElement());
        } else {
            body.addProperty("message", eventInfo.getMessage());
        }

        if(eventInfo.getFields() != null && eventInfo.getFields().size() > 0) {
            eventInfo.getFields()
                .forEach(p -> fields.addProperty(
                    p.getKey(),
                    String.valueOf(p.getValue()))
                );

            // Add fields to object
            body.add("fields", fields);
        }

        // Add inner object to outer (body to event)
        event.add("event", body);

        return event.toString();
    }

    private void startHttpClient() {
        if(this.httpClient == null) {
            int maxConnTotal = this.sendMode == CustomHttpEventCollectorSender.SendMode.Sequential ? 1 : 0;

            if(!this.disableCertificateValidation) {
                this.httpClient = HttpAsyncClients.custom().setMaxConnTotal(maxConnTotal).build();
            } else {
                TrustStrategy acceptingTrustStrategy = (certificate, type) -> true;
                SSLContext sslContext;

                try {
                    sslContext = SSLContexts.custom()
                        .loadTrustMaterial(null, acceptingTrustStrategy)
                        .build();
                    this.httpClient = HttpAsyncClients.custom()
                        .setMaxConnTotal(maxConnTotal)
                        .setSSLHostnameVerifier(NoopHostnameVerifier.INSTANCE)
                        .setSSLContext(sslContext)
                        .build();
                } catch(Exception ignored) {
                }
            }

            if(this.httpClient != null) {
                this.httpClient.start();
            }
        }
    }

    private void postEventsAsync(final List<HttpEventCollectorEventInfo> events) {
        this.middleware.postEvents(events, this, new IHttpSenderCallback() {
            public void completed(int statusCode, String reply) {
                if(statusCode != 200) {
                    HttpEventCollectorErrorHandler.error(events, new ServerErrorException(reply));
                }
            }

            public void failed(Exception ex) {
                HttpEventCollectorErrorHandler.error(
                    CustomHttpEventCollectorSender.this.eventsBatch,
                    new ServerErrorException(ex.getMessage())
                );
            }
        });
    }

    public void postEvents(List<HttpEventCollectorEventInfo> events, final IHttpSenderCallback callback) {
        this.startHttpClient();

        StringBuilder eventsBatchString = new StringBuilder();

        for(Object event : events) {
            CustomHttpEventCollectorEventInfo eventInfo = (CustomHttpEventCollectorEventInfo) event;
            eventsBatchString.append(this.serializeEventInfo(eventInfo));
        }

        HttpPost httpPost = new HttpPost(this.url);
        httpPost.setHeader(HttpHeaders.AUTHORIZATION, String.format("Splunk %s", this.token));
        StringEntity entity = new StringEntity(eventsBatchString.toString(), UTF_8.name());
        entity.setContentType("application/json; profile=urn:splunk:event:1.0; charset=" + UTF_8.name());
        httpPost.setEntity(entity);

        this.httpClient.execute(httpPost, new FutureCallback<HttpResponse>() {
            public void completed(HttpResponse response) {
                String reply = "";
                int httpStatusCode = response.getStatusLine().getStatusCode();

                if(httpStatusCode != 200) {
                    try {
                        reply = EntityUtils.toString(response.getEntity(), UTF_8.name());
                    } catch(IOException e) {
                        reply = e.getMessage();
                    }
                }

                callback.completed(httpStatusCode, reply);
            }

            public void failed(Exception ex) {
                callback.failed(ex);
            }

            public void cancelled() {
            }
        });
    }

    public enum SendMode {
        Sequential,
        Parallel
    }
}
