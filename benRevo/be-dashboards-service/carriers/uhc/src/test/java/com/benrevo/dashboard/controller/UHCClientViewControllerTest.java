package com.benrevo.dashboard.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientSearchResult;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.RfpQuoteOptionAttributeName;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionAttribute;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.ClientSearchRepository;

public class UHCClientViewControllerTest extends AbstractControllerTest {

    @Autowired
    private ClientViewController clientViewController;
    
    @Autowired
    private ClientSearchRepository clientSearchRepository;
    
    @Autowired
    private AttributeRepository attributeRepository;
    
    @Before
    @Override
    public void init() {
        initController(clientViewController);
        ReflectionTestUtils.setField(clientSearchRepository, "appEnv", "local");
    }

    @Test
    public void searchClientsByParams() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("ClientSearchBroker");
        
        token = authenticationService.createTokenForBroker(broker.getBrokerToken(), 
        		testAuthId, new String[] {AccountRole.CARRIER_SALES_RENEWAL.getValue()}, appCarrier);
        User user = new User();
        user.setEmail(broker.getSalesEmail());
        when(mgmtAPI.users().get(testAuthId, null).execute()).thenReturn(user);

        Client client1 = testEntityHelper.createTestClient("ClientSearchTest", broker);

        testEntityHelper.createTestClientAttribute(client1, AttributeName.TOP_CLIENT);
        testEntityHelper.createTestClientAttribute(client1, AttributeName.RENEWAL);
        
        Activity activityStarting = testEntityHelper.createTestActivity(client1, null, Constants.MEDICAL,
                ActivityType.INITIAL_RENEWAL, null, "-17");

        Activity activityCurrent = testEntityHelper.createTestActivity(client1, null, Constants.MEDICAL,
                ActivityType.RENEWAL_ADDED, null, "-15");
        activityCurrent.setLatest(true);

        RfpQuote quote = testEntityHelper.createTestRfpQuote(client1, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork hmo = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmo, 100f, 100f, 100f, 100f, true);
        RfpQuoteOption renewal1 = testEntityHelper.createTestRfpQuoteOption(quote, "Renewal 1");
        testEntityHelper.createTestRfpQuoteOptionNetwork(renewal1,
                hmo, hmoPlan, null, 1L, 1L, 1L, 1L,
                Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);
        attributeRepository.save(new RfpQuoteOptionAttribute(renewal1, RfpQuoteOptionAttributeName.STARTING_TOTAL, "5000.0"));

        // client2
        Client client2 = testEntityHelper.createTestClient("ClientSearchTest2", broker);
        RfpQuote quote2 = testEntityHelper.createTestRfpQuote(client2, CarrierType.UHC.name(), Constants.MEDICAL);
        testEntityHelper.createTestRfpQuoteOption(quote2, "Renewal 1");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", "MEDICAL");
        params.add("brokerIds", broker.getBrokerId().toString());
        params.add("clientStates", client1.getClientState().name());
        params.add("clientStates", client2.getClientState().name());
        
        flushAndClear();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/dashboard/clients/search")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .params(params)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        ClientSearchResult[] response = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientSearchResult[].class);
        
        assertThat(response).hasSize(1);
        assertThat(response[0].getClientId()).isEqualTo(client1.getClientId());
        assertThat(response[0].getQuotedProducts()).containsExactlyInAnyOrder(Constants.MEDICAL);
        
        assertThat(response[0].getClientAttributes()).containsExactlyInAnyOrder(AttributeName.TOP_CLIENT, AttributeName.RENEWAL);
        assertThat(response[0].getStartingRenewalIncrease()).isNotNull().isEqualTo(activityStarting.getValue());
        assertThat(response[0].getCurrentRenewalIncrease()).isNotNull().isEqualTo(activityCurrent.getValue());
        assertThat(response[0].getSalesName()).isNotNull().isEqualTo(client1.getSalesFullName());
        assertThat(response[0].getPresalesName()).isNotNull().isEqualTo(client1.getPresalesFullName());
    }
    
    @Test
    public void searchClientsByParamsNewBusinessAndRenewal() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("ClientSearchBroker");

        Client newBusinessClient  = testEntityHelper.createTestClient("ClientNewBusiness", broker);

        RfpQuote quote1 = testEntityHelper.createTestRfpQuote(newBusinessClient, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork hmo = testEntityHelper.createTestQuoteNetwork(quote1, "HMO network", "HMO");
        testEntityHelper.createTestRfpQuoteOption(quote1, "Option 1");

        Client renewalClient = testEntityHelper.createTestClient("ClientRenewal", broker);
        testEntityHelper.createTestClientAttribute(renewalClient, AttributeName.RENEWAL);
        
        RfpQuote quote2 = testEntityHelper.createTestRfpQuote(renewalClient, CarrierType.UHC.name(), Constants.MEDICAL);
        testEntityHelper.createTestRfpQuoteOption(quote2, "Renewal 1");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", "MEDICAL");
        params.add("brokerIds", broker.getBrokerId().toString());
        params.add("clientStates", newBusinessClient.getClientState().name());
        params.add("clientStates", renewalClient.getClientState().name());
        
        flushAndClear();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/dashboard/clients/search")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .params(params)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        ClientSearchResult[] response = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientSearchResult[].class);
        
        // returned only 1 New Business client (w/o RENEWAL attribute)
        
        assertThat(response).hasSize(1);
        assertThat(response[0].getClientId()).isEqualTo(newBusinessClient.getClientId());
        assertThat(response[0].getClientAttributes()).isEmpty();
        
        // set up loggeg user role CARRIER_SALES_RENEWAL to enable clients filter Renewal
        
        token = authenticationService.createTokenForBroker(broker.getBrokerToken(), 
        		testAuthId, new String[] {AccountRole.CARRIER_SALES_RENEWAL.getValue()}, appCarrier);
		User user = new User();
		user.setEmail(broker.getSalesEmail());
		when(mgmtAPI.users().get(testAuthId, null).execute()).thenReturn(user);
		
		result = mockMvc.perform(MockMvcRequestBuilders.get("/dashboard/clients/search")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .params(params)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        response = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientSearchResult[].class);
        
        assertThat(response).hasSize(1);
        assertThat(response[0].getClientId()).isEqualTo(renewalClient.getClientId());
        assertThat(response[0].getClientAttributes()).containsExactly(AttributeName.RENEWAL);
    }
}
