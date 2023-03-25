package com.benrevo.be.modules.shared.controller;

import com.auth0.client.auth.AuthAPI;
import com.auth0.client.mgmt.ManagementAPI;
import com.benrevo.be.modules.shared.configuration.SecurityConfig;
import com.benrevo.be.modules.shared.configuration.SharedTestConfiguration;
import com.benrevo.be.modules.shared.configuration.SharedTestConfiguration.MockSession;
import com.benrevo.be.modules.shared.exception.GlobalControllerExceptionHandler;
import com.benrevo.be.modules.shared.security.TokenAuthenticationService;
import com.benrevo.be.modules.shared.service.S3FileManager;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.UseTestProperties;
import com.benrevo.common.mail.SMTPMailer;
import com.benrevo.common.util.JsonUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.UnsupportedEncodingException;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockReset;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import static org.mockito.Answers.RETURNS_DEEP_STUBS;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
    .springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = SharedTestConfiguration.class)
@Transactional(rollbackFor = Exception.class)
@UseTestProperties
@Import(SecurityConfig.class)
public abstract class AbstractControllerTest {
    public static final String AUTHORIZATION_HEADER_BEARER = "Bearer";

    protected static final String TEST_BROKERAGE_ID = "1ed74511-c44d-4d31-a841-cb062015bdbc";

    protected String token;

    protected MockMvc mockMvc;

    @Autowired
    protected MockSession mockSession;

    @Value("${app.carrier}")
    protected String[] appCarrier;

    @Autowired
    protected TestEntityHelper testEntityHelper;

    @Autowired
    protected TokenAuthenticationService authenticationService;

    @Value("${auth0.test.authId}")
    protected String testAuthId;

    @Autowired
    private FilterChainProxy springSecurityFilterChain;

    @Autowired
    protected JsonUtils jsonUtils;

    @Autowired
    protected MappingJackson2HttpMessageConverter messageConverter;

    @MockBean(reset = MockReset.AFTER)
    protected SMTPMailer smtpMailer;

    @MockBean(reset = MockReset.AFTER, answer = RETURNS_DEEP_STUBS)
    protected ManagementAPI mgmtAPI;

    @MockBean(reset = MockReset.AFTER, answer = RETURNS_DEEP_STUBS)
    protected ApplicationEventPublisher publisher;

    @MockBean(reset = MockReset.AFTER, answer = RETURNS_DEEP_STUBS)
    protected S3FileManager s3FileManager;

    @MockBean(answer = RETURNS_DEEP_STUBS, reset = MockReset.AFTER)
    private AuthAPI authAPI;

    public void init() throws Exception {
        // No default implementation
    };

    @PersistenceContext
    private EntityManager entityManager;

    protected void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }

    protected String createToken(String brokerToken) {
        return authenticationService.createTokenForBroker(brokerToken, testAuthId, appCarrier);
    }

    protected void initController(Object... controllers) {
        this.mockMvc = MockMvcBuilders.standaloneSetup(controllers)
            .setControllerAdvice(new GlobalControllerExceptionHandler())
            .setMessageConverters(messageConverter)
            .apply(springSecurity(springSecurityFilterChain))
            .build();
    }

    @Before
    public void setUp() {
        this.token = createToken(TEST_BROKERAGE_ID);
    }

    protected MvcResult performGetAndAssertResult(Object objectToExpect, String urlTemplate, Object... uriVars) throws Exception {
        return performGetAndAssertResult(token, objectToExpect, urlTemplate, uriVars);
    }

    protected MvcResult performGetAndAssertResult(String token, Object objectToExpect, String urlTemplate, Object... uriVars) throws Exception {
        MockHttpServletRequestBuilder req = MockMvcRequestBuilders.get(urlTemplate, uriVars);
        if (uriVars.length % 2 == 0) {
            for (int i = 0; i < uriVars.length; i += 2) {
                req.param(uriVars[i].toString(), uriVars[i + 1].toString());
            }
        }
        ResultActions ra = mockMvc.perform(req
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));

        if(objectToExpect != null) {
            ra.andExpect(content().json(jsonUtils.toJson(objectToExpect), true));
        }

        return ra.andReturn();
    }

    protected MvcResult performPutAndAssertResult(String requestBody, Object objectToExpect, String urlTemplate, Object... uriVars) throws Exception {
        ResultActions ra = mockMvc.perform(MockMvcRequestBuilders.put(urlTemplate, uriVars)
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(requestBody)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));

        if(objectToExpect != null) {
            ra.andExpect(content().json(jsonUtils.toJson(objectToExpect), true));
        }

        return ra.andReturn();
    }

    protected MvcResult perform(MockHttpServletRequestBuilder req, String requestBody, Object objectToExpect, HttpStatus expectedStatus) throws Exception {

        req .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8);

        if (requestBody != null) {
            req.content(requestBody);
        }

        ResultActions ra = mockMvc.perform(req)
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));

        if (expectedStatus == null) {
            ra.andExpect(status().is2xxSuccessful());
        } else {
            ra.andExpect(status().is(expectedStatus.value()));
        }

        if(objectToExpect != null) {
            ra.andExpect(content().json(jsonUtils.toJson(objectToExpect), true));
        }

        return ra.andReturn();
    }

    protected MvcResult performPostAndAssertResult(String requestBody, Object objectToExpect, String urlTemplate, Object... uriVars) throws Exception {
        MockHttpServletRequestBuilder req = MockMvcRequestBuilders.post(urlTemplate, uriVars);
        return perform(req, requestBody, objectToExpect, null);
    }

    protected MvcResult performPostWithParamsAndAssertResult(String requestBody, Object objectToExpect, String urlTemplate, Object[] params, Object... uriVars) throws Exception {
        MockHttpServletRequestBuilder req = MockMvcRequestBuilders.post(urlTemplate, uriVars);
        for (int i = 0; i < params.length; i += 2) {
            req.param(params[i].toString(), params[i + 1].toString());
        }
        return perform(req, requestBody, objectToExpect, null);
    }

    protected MvcResult performDeleteAndAssertResult(String requestBody, String urlTemplate, Object... uriVars) throws Exception {
        return mockMvc.perform(MockMvcRequestBuilders.delete(urlTemplate, uriVars)
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(requestBody)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
    }

    protected String performPost(String urlTemplate, Object content, Object... uriVars) throws Exception {
        // part of APIs return CREATED, but another - OK
        return performPost(null, urlTemplate, content, uriVars);
    }

    protected String performPost(HttpStatus expectedStatus, String urlTemplate, Object content, Object... uriVars) throws Exception {
        return perform(expectedStatus, MockMvcRequestBuilders.post(urlTemplate, uriVars), content);
    }

    protected String performPut(String urlTemplate, Object content, Object... uriVars) throws Exception {
        // part of APIs return CREATED, but another - OK
        return performPut(null, urlTemplate, content, uriVars);
    }

    protected String performPut(HttpStatus expectedStatus, String urlTemplate, Object content, Object... uriVars) throws Exception {
        return perform(expectedStatus, MockMvcRequestBuilders.put(urlTemplate, uriVars), content);
    }

    protected String performDelete(String urlTemplate, Object content, Object... uriVars) throws Exception {
        return perform(null, MockMvcRequestBuilders.delete(urlTemplate, uriVars), content);
    }

    private String perform(HttpStatus expectedStatus, MockHttpServletRequestBuilder req, Object content) throws Exception {
        if (content != null) {
            req.content(jsonUtils.toJson(content));
            req.contentType(MediaType.APPLICATION_JSON_UTF8);
        }
        ResultActions ra = mockMvc.perform(req.header("Authorization", "Bearer " + token));
//		ra.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
        if (expectedStatus == null) {
            ra.andExpect(status().is2xxSuccessful());
        } else {
            ra.andExpect(status().is(expectedStatus.value()));
        }
        MvcResult result = ra.andReturn();
        return result.getResponse().getContentAsString();
    }

    protected String performGet(String urlTemplate, Object[] params, Object... uriVars) throws Exception {
        return performGet(HttpStatus.OK, urlTemplate, params, uriVars);
    }

    protected String performGet(HttpStatus expectesStatus, String urlTemplate, Object[] params, Object... uriVars) throws Exception {
        MockHttpServletRequestBuilder req = MockMvcRequestBuilders.get(urlTemplate, uriVars);
        for (int i = 0; i < params.length; i += 2) {
            req.param(params[i].toString(), params[i + 1].toString());
        }
        return perform(expectesStatus, req, null);
    }

    protected String performPostWithParam(String urlTemplate, Object[] params, Object... uriVars) throws Exception {
        MockHttpServletRequestBuilder req = MockMvcRequestBuilders.post(urlTemplate, uriVars);
        for (int i = 0; i < params.length; i += 2) {
            req.param(params[i].toString(), params[i + 1].toString());
        }
        return perform(null, req, null);
    }

    protected byte[] performGetAsBytes(String urlTemplate, Object[] params, Object... uriVars) throws Exception {
        MockHttpServletRequestBuilder req = MockMvcRequestBuilders.get(urlTemplate, uriVars);
        for (int i = 0; i < params.length; i += 2) {
            req.param(params[i].toString(), params[i + 1].toString());
        }
        MvcResult result = mockMvc.perform(req.header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(Constants.HTTP_HEADER_CONTENT_TYPE_XLSX))
            .andReturn();
        return result.getResponse().getContentAsByteArray();
    }
}
