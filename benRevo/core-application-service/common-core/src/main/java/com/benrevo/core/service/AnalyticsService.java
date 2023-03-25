package com.benrevo.core.service;

import static com.benrevo.common.util.MapBuilder.field;
import static java.time.Clock.systemDefaultZone;
import static java.time.Duration.between;
import static java.time.Instant.now;
import static java.util.concurrent.TimeUnit.SECONDS;
import static okhttp3.MediaType.parse;
import static okhttp3.RequestBody.create;
import static org.apache.commons.lang3.StringUtils.defaultString;
import static org.apache.commons.lang3.StringUtils.isAnyBlank;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.transaction.event.TransactionPhase.AFTER_COMMIT;

import com.auth0.client.mgmt.ManagementAPI;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.client.service.ClientService;
import com.benrevo.common.event.AnalyticsEvent;
import com.benrevo.common.event.AnalyticsEvent.EventContext;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionalEventListener;

@Lazy
@Service
@ConditionalOnProperty(name = "analytics.enabled", havingValue = "true")
public class AnalyticsService {

    @Autowired
    CustomLogger LOGGER;

    @Value("${analytics.url.event}")
    String eventUrl;

    @Value("${analytics.api.key}")
    String apiKey;

    @Value("${app.env:local}")
    String appEnv;

    @Value("${app.carrier}")
    String[] appCarrier;

    @Autowired
    ClientService clientService;

    @Autowired
    BrokerRepository brokerRepository;

    @Autowired
    ManagementAPI mgmtAPI;

    final String APP_CARRIER = "app_carrier";
    final String APP_ENV = "app_env";
    final String BROKERAGE = "brokerage";
    final String BROKER_EMAIL = "broker_email";

    static final ObjectMapper mapper = new ObjectMapper();
    static final OkHttpClient client = new OkHttpClient.Builder()
        .connectTimeout(10, SECONDS)
        .writeTimeout(10, SECONDS)
        .readTimeout(10, SECONDS)
        .build();

    @Async
    @TransactionalEventListener(
        phase = AFTER_COMMIT,
        condition = "#event.properties.size() > 0 && #event.collection != null"
    )
    public void handleAnalyticsEvent(AnalyticsEvent event) {

        // If we're missing the eventUrl or apiKey, fail fast.
        if(isAnyBlank(eventUrl, apiKey)) {
            LOGGER.warn("Missing credentials for analytics beacons!");

            return;
        }

        Instant start = now(systemDefaultZone());

        event.setProperties(getGlobalProperties());
        event.setApi(
            new EventContext.Builder()
                .withApiKey(apiKey)
                .withUploadTime(start.toEpochMilli())
                .build()
        );

        try {
            RequestBody body = create(
                parse(APPLICATION_JSON_VALUE),
                mapper.writer().writeValueAsString(event)
            );

            Request request = new Request.Builder()
                .url(eventUrl)
                .post(body)
                .build();

            try(Response response = client.newCall(request).execute()) {
                if(!response.isSuccessful()) {
                    LOGGER.errorLog(
                        "Received error code from analytics API",
                        field("status_code", response.code()),
                        field("response", response.body().string()),
                        field(
                            "time",
                            between(start, now(systemDefaultZone())).toMillis()
                        )
                    );
                } else {
                    LOGGER.infoLog(
                        "Successfully submitted analytics event",
                        field("type", event.getCollection()),
                        field("time", between(start, now(systemDefaultZone())).toMillis())
                    );
                }
            } catch(IOException e) {
                LOGGER.errorLog("Error sending analytics event", e);
            }
        } catch(Exception e) {
            LOGGER.errorLog("Error sending analytics event", e);
        }
    }

    /**
     * Get global properties.
     *
     * @return
     *     Map of properties
     */
    Map<String, String> getGlobalProperties() {

        Map<String, String> properties = new HashMap<>();

        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder
            .getContext()
            .getAuthentication();

        if(authentication != null) {
            try {
                User u = mgmtAPI.users().get(authentication.getName(), null).execute();

                if(u != null) {
                    properties.put(BROKER_EMAIL, defaultString(u.getEmail(), "N/A"));
                    properties.put(BROKERAGE, defaultString(authentication.getBrokerName(), "N/A"));
                    properties.put(APP_CARRIER, String.join(",", appCarrier));
                    properties.put(APP_ENV, defaultString(appEnv, "N/A"));
                }
            } catch(Exception e) {
                LOGGER.errorLog(e.getMessage(), e);
            }
        }

        return properties;
    }
}
