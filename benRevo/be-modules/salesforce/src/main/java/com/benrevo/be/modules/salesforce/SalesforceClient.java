package com.benrevo.be.modules.salesforce;

import com.benrevo.be.modules.salesforce.dto.query.SFQuery;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.be.modules.salesforce.dto.SFBase;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import io.vavr.control.Try;

import org.apache.http.client.fluent.Form;
import org.apache.http.client.fluent.Request;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import static com.fasterxml.jackson.databind.SerializationFeature.WRITE_ENUMS_USING_TO_STRING;
import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.apache.http.entity.ContentType.APPLICATION_JSON;
import static org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED_VALUE;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;


/**
 * Created by ebrandell on 11/6/17 at 12:34 PM.
 */
@Component
@ConditionalOnProperty(name = "salesforce.enabled", havingValue = "true")
public class SalesforceClient implements InitializingBean {

    static ObjectMapper mapper = new ObjectMapper();
    static final String TOKEN_FMT = "Bearer %s";

    @Autowired
    CustomLogger logger;

    @Value("${salesforce.grant-type}")
    String grantType;

    @Value("${salesforce.token.url}")
    String tokenUrl;

    @Value("${salesforce.service.sobjects.url}")
    String sobjectsUrl;

    @Value("${salesforce.service.search.url}")
    String searchUrl;

    @Value("${salesforce.service.query.url}")
    String queryUrl;

    @Value("${salesforce.client-id}")
    String clientId;

    @Value("${salesforce.client-secret}")
    String clientSecret;

    @Value("${salesforce.username}")
    String username;

    @Value("${salesforce.password}")
    String password;

    @Value("${salesforce.http.timeout}")
    int timeout;

    @Override
    public void afterPropertiesSet() {
        mapper.enable(WRITE_ENUMS_USING_TO_STRING);
    }

    /**
     * Make a request to the Salesforce API to retrieve an access_token for future calls.
     *
     * @return String string in the form of "Bearer &lt;token&gt;"
     */
    public String getAccessToken() {
        return Try.of(() -> Request.Post(tokenUrl)
            .connectTimeout(timeout)
            .socketTimeout(timeout)
            .addHeader("X-PrettyPrint", "1")
            .addHeader("Content-Type", APPLICATION_FORM_URLENCODED_VALUE)
            .bodyForm(Form.form()
                .add("username", username)
                .add("password", password)
                .add("client_id", clientId)
                .add("client_secret", clientSecret)
                .add("grant_type", grantType)
                .build())
            .execute()
            .handleResponse(r -> {
                String s = EntityUtils.toString(r.getEntity(), "UTF-8");

                EntityUtils.consumeQuietly(r.getEntity());

                if(r.getStatusLine().getStatusCode() == 200) {
                    JsonNode root = mapper.readTree(s);

                    return root.has("access_token") ? format(
                        TOKEN_FMT, root.get("access_token").asText()) : null;
                }

                return null;
            })).onFailure(t -> logger.errorLog(t.getMessage(), t)).getOrNull();
    }

    /**
     * Create the requested object in Salesforce. Returns the id of the object created.
     *
     * @param obj
     *     the object to persist in Salesforce
     */
    public String insert(SFBase obj) {
        return Try.of(() -> Request.Post(format(sobjectsUrl, obj.getsObjectType().name()) + "/Id")
            .connectTimeout(timeout)
            .socketTimeout(timeout)
            .addHeader("X-PrettyPrint", "1")
            .addHeader("Content-Type", APPLICATION_JSON_UTF8_VALUE)
            .addHeader("Authorization", getAccessToken())
            .bodyString(mapper.writeValueAsString(obj), APPLICATION_JSON)
            .execute()
            .handleResponse(r -> {
                String s = EntityUtils.toString(r.getEntity(), "UTF-8");

                EntityUtils.consumeQuietly(r.getEntity());

                if(r.getStatusLine().getStatusCode() >= 200 && r.getStatusLine().getStatusCode() < 300) {
                    return (String) JsonPath
                        .parse(s, Configuration.builder().options(Option.SUPPRESS_EXCEPTIONS).build())
                        .read("$.id");
                } else {
                    logger.errorLog(s);
                }

                return null;
            })).onFailure(t -> logger.errorLog(t.getMessage(), t)).getOrNull();
    }

    /**
     * Update an existing object.
     *
     * @param id
     *     id of the object
     * @param obj
     *     the object to update in Salesforce
     */
    public void update(String id, SFBase obj) {
        Try.of(() -> Request.Patch(format(sobjectsUrl, obj.getsObjectType().name()) + "/" + id)
            .connectTimeout(timeout)
            .socketTimeout(timeout)
            .addHeader("X-PrettyPrint", "1")
            .addHeader("Content-Type", APPLICATION_JSON_UTF8_VALUE)
            .addHeader("Authorization", getAccessToken())
            .bodyString(mapper.writeValueAsString(obj), APPLICATION_JSON)
            .execute()).onFailure(t -> logger.errorLog(t.getMessage(), t)).getOrNull();
    }

    /**
     * Generic query method to retrieve the identifier for an object based on the provided criteria.
     *
     * @param query
     *     {@link SFQuery} object
     * @param returnType
     *     class type for the return object
     * @return
     *     T
     */
    public <T> T query(SFQuery query, Class<T> returnType) {
        return Try.of(
            () -> Request.Get(
                new URIBuilder(queryUrl)
                    .addParameter("q", query.toString())
                    .build()
            )
            .connectTimeout(timeout)
            .socketTimeout(timeout)
            .addHeader("X-PrettyPrint", "1")
            .addHeader("Content-Type", APPLICATION_JSON_UTF8_VALUE)
            .addHeader("Authorization", getAccessToken())
            .execute()
            .handleResponse(r -> {
                String s = EntityUtils.toString(r.getEntity(), "UTF-8");

                EntityUtils.consumeQuietly(r.getEntity());

                if(r.getStatusLine().getStatusCode() == 200) {
                    return JsonPath
                        .parse(s, Configuration.builder().options(Option.SUPPRESS_EXCEPTIONS).build())
                        .read(isNotBlank(query.getJsonPath()) ? query.getJsonPath() : "$.records[0].Id", returnType);
                }

                return null;
            })
        ).onFailure(t -> logger.errorLog(t.getMessage(), t)).getOrNull();
    }
}
