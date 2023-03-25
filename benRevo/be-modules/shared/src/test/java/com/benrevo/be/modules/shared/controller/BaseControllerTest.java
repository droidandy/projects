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

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.UnsupportedEncodingException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockReset;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Import;
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

// TODO merge with AbstractControllerTest

/**
 * DEPRECATED.
 *
 * Use {@link AbstractControllerTest}
 */
@Deprecated
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SharedTestConfiguration.class)
@Transactional(rollbackFor = Exception.class)
@UseTestProperties
@Import(SecurityConfig.class)
public abstract class BaseControllerTest {

	protected static final Object[] EMPTY = {};
	
	protected MockMvc mockMvc;

    @Autowired
    protected MockSession mockSession;

	@Value("${app.carrier}")
    protected String[] appCarrier;
	
	@Autowired
	protected TestEntityHelper testEntityHelper;

	@Autowired
	protected TokenAuthenticationService authenticationService;

    @Autowired
    protected FilterChainProxy springSecurityFilterChain;
	
	@MockBean(reset = MockReset.AFTER)
	protected SMTPMailer smtpMailer;
	
	@MockBean(reset = MockReset.AFTER, answer = RETURNS_DEEP_STUBS)
	protected ManagementAPI mgmtAPI;
	
	@MockBean(reset = MockReset.AFTER)
	protected ApplicationEventPublisher publisher;
	    
	@MockBean(reset = MockReset.AFTER, answer = RETURNS_DEEP_STUBS)
	protected S3FileManager s3FileManager;

	@MockBean(answer = RETURNS_DEEP_STUBS, reset = MockReset.AFTER)
	private AuthAPI authAPI;

	protected static final String TEST_AUTHID = "auth0|58c362ab6c180767800b938b";
	protected static final String TEST_BROKERAGE_ID = "1ed74511-c44d-4d31-a841-cb062015bdbc";

	@PersistenceContext
	private EntityManager entityManager;

	protected String token;
	
	@Autowired
	protected JsonUtils gson;
	
	@Autowired
    protected MappingJackson2HttpMessageConverter messageConverter;

	protected abstract Object getController();

	protected void flushAndClear() {
		entityManager.flush();
		entityManager.clear();
	}

	@PostConstruct
	public void setUpBase() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(getController())
            .setControllerAdvice(new GlobalControllerExceptionHandler())
            .setMessageConverters(messageConverter)
            .apply(springSecurity(springSecurityFilterChain))
            .build();

		// TODO: This should really not be done here, as individual unit tests may need to create their own tokens
		this.token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, TEST_AUTHID, appCarrier);
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
	
	protected String performDelete(HttpStatus expectedStatus, String urlTemplate, Object content, Object... uriVars) throws Exception {
        return perform(expectedStatus, MockMvcRequestBuilders.delete(urlTemplate, uriVars), content);
    }
	
	private String perform(HttpStatus expectedStatus, MockHttpServletRequestBuilder req, Object content) throws Exception {
		if (content != null) {
			req.content(gson.toJson(content));
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

	protected String createToken(String brokerToken) {
		return authenticationService.createTokenForBroker(brokerToken, TEST_AUTHID, appCarrier);
	}
}
