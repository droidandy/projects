package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.salesforce.SalesforceClient;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.configuration.SecurityConfig;
import com.benrevo.be.modules.shared.configuration.SharedTestConfiguration;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.security.TokenAuthenticationService;
import com.benrevo.common.annotation.UseTestProperties;
import com.benrevo.data.persistence.entities.Broker;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.UnsupportedEncodingException;
import java.util.List;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.boot.test.mock.mockito.MockReset.BEFORE;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
    .springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = SharedTestConfiguration.class)
@Transactional(rollbackFor = Exception.class)
@UseTestProperties
@Import(SecurityConfig.class)
public abstract class AdminAbstractControllerTest extends AbstractControllerTest {
    
    @Autowired
    protected TokenAuthenticationService tokenAuthenticationService;

    @Autowired
    private FilterChainProxy springSecurityFilterChain;

    @Autowired
    private WebApplicationContext context;

    @MockBean(reset = BEFORE)
    protected SalesforceClient client;

    protected Broker broker;
    
    protected String token;

    @Before
    public void init() throws Exception {
        this.mockMvc = MockMvcBuilders
            .webAppContextSetup(context)
            .apply(springSecurity(springSecurityFilterChain))
            .build();
        broker = testEntityHelper.createTestBroker();
        token = createToken(TEST_BROKERAGE_ID);
    }
    
    protected String createToken(String brokerToken, String brokerRole) throws UnsupportedEncodingException {
        return tokenAuthenticationService
            .createTokenForBroker(brokerToken, testAuthId, brokerRole, new String[] {AccountRole.ADMINISTRATOR.getValue()}, appCarrier);
    }

    protected MvcResult sendFilesAndAssertResult(List<MockMultipartFile> mockFiles, Object objectToExpect, String urlTemplate, Object... uriVars) throws Exception {

        ResultActions ra;
        if (mockFiles != null && !mockFiles.isEmpty()) {
            MockMultipartHttpServletRequestBuilder req = MockMvcRequestBuilders.fileUpload(urlTemplate, uriVars);
            mockFiles.forEach(f -> req.file(f));
            ra = mockMvc.perform(req
                                     .contentType(MediaType.MULTIPART_FORM_DATA)
                                     .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                                     .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is2xxSuccessful())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
        } else {
            ra = mockMvc.perform(MockMvcRequestBuilders.post(urlTemplate, uriVars)
                                     .contentType(MediaType.MULTIPART_FORM_DATA)
                                     .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                                     .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is2xxSuccessful())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));
        }
        if(objectToExpect != null) {
            ra.andExpect(content().json(new ObjectMapper().writeValueAsString(objectToExpect), true));
        }

        return ra.andReturn();
    }
}
