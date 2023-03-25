package com.benrevo.dashboard.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientPreQuotedDto;
import com.benrevo.common.dto.ClientSearchFilterParams;
import com.benrevo.common.dto.ClientSearchResult;
import com.benrevo.common.dto.RewardsInfoDto;
import com.benrevo.common.enums.*;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.repository.ActivityRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientSearchRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.lang3.time.DateUtils;
import org.assertj.core.data.Offset;
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

public class ClientViewControllerTest extends AbstractControllerTest {

    @Autowired
    private ClientViewController clientViewController;
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private ClientSearchRepository clientSearchRepository;
    
    @Autowired
    private BrokerRepository brokerRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;
    
    @Before
    @Override
    public void init() {
        initController(clientViewController);
        ReflectionTestUtils.setField(clientSearchRepository, "appEnv", "local");
    }

    @Test
    public void refreshCachedOptions() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("RefreshCachedOptionsBroker");
        Client client = testEntityHelper.createTestClient("RefreshCachedOptionsClient", broker);
        RfpQuote rfpQuote1 = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), "HMO");
        
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(rfpQuote1, "Option 1");
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(rfpQuote1, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 
            cp.getTier1Rate() * 0.9f, cp.getTier2Rate() * 0.9f, cp.getTier3Rate() * 0.9f, cp.getTier4Rate() * 0.9f);
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(
            medicalOption, medicalNetwork, medicalNetworkPlan, cp, 
            cp.getTier1Census(), cp.getTier2Census(), cp.getTier3Census(), cp.getTier4Census(), 
            cp.getErContributionFormat(), 
            cp.getTier1ErContribution(), cp.getTier2ErContribution(), cp.getTier3ErContribution(), cp.getTier4ErContribution());

        Activity opt1Released = testEntityHelper.createTestActivity(client, null, 
            Constants.MEDICAL, ActivityType.OPTION1_RELEASED, null, "123");
        opt1Released.setCreated(DateUtils.addDays(opt1Released.getCreated(), -1));
        opt1Released = activityRepository.save(opt1Released);
               
        final Integer expectedCountResult = 1;
        MvcResult result = performGetAndAssertResult(expectedCountResult, "/dashboard/refreshCachedOptions", 
            "clientId", client.getClientId(), "brokerId", broker.getBrokerId());

        // TODO check for option added to cache
        
        // OPTION1_RELEASED activity should be updated on cache update
        Activity updated = activityRepository.getOne(opt1Released.getActivityId());
        assertThat(updated.getCreated()).isEqualToIgnoringMillis(opt1Released.getCreated());
//        isEqualTo(opt1Released.getCreated().getTime());
        assertThat(updated.getUpdated().after(opt1Released.getCreated()));
        assertThat(updated.getValue()).isNotEqualTo("123");
        
    }
    
    @Test
    public void searchClientsByParams_CarrierPresalesRoleRestriction() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("ClientSearchBroker");
        Client client = testEntityHelper.createTestClient("ClientSearchTest", broker);
        RfpQuote rfpQuote1 = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(rfpQuote1, "Option 1");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", "MEDICAL");
     
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
        
        assertThat(response).isNotEmpty();

        // after filtering by logged on carrier_presales API should return empty list
        
        AuthenticatedUser authentication = new AuthenticatedUser.Builder()
            .withRoles(Arrays.asList(AccountRole.CARRIER_PRESALE.getValue()))
            .withAuthId("testCarrierPresale").build();

        User user = new User();
        user.setEmail("testCarrierPresaleEmail");
        when(mgmtAPI.users().get(authentication.getName(), null).execute()).thenReturn(user);

        String token2 = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, "testCarrierPresale", new String[]{AccountRole.CARRIER_PRESALE.getValue()}, appCarrier);
        
        result = mockMvc.perform(MockMvcRequestBuilders.get("/dashboard/clients/search")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token2)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .params(params)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
        
        ClientSearchResult[] response2 = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientSearchResult[].class);
        
        assertThat(response2).isEmpty();
    }

    @Test
    public void testCountClientsByState() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("test_client", broker);
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 1");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", "MEDICAL");

        flushAndClear();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/dashboard/clients/countByState")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .params(params)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is2xxSuccessful())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        Map response = jsonUtils.fromJson(result.getResponse().getContentAsString(), Map.class);

        assertThat(response.containsKey("TOTAL"));
        assertThat(response.containsKey("QUOTED"));
        assertThat(response.containsKey("COMPETITIVE"));
        assertThat(response.containsKey("SOLD"));
    }

    @Test
    public void testCountClientsByProbability() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("test_client", broker);
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 1");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", "MEDICAL");

        flushAndClear();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/dashboard/clients/countByProbability")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .params(params)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is2xxSuccessful())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        Map response = jsonUtils.fromJson(result.getResponse().getContentAsString(), Map.class);

        assertThat(response.containsKey(ProbabilityOption.HIGH.name()));
        assertThat(response.containsKey(ProbabilityOption.MEDIUM.name()));
        assertThat(response.containsKey(ProbabilityOption.LOW.name()));
        assertThat(response.containsKey("NOT REPORTED"));
    }

    private String formatDate(Calendar cal){
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        int day = cal.get(Calendar.DAY_OF_MONTH);
        return year + "/" + month + "/" + day;
    }
    
    @Test
    public void searchClientsByParams_KaiserCarrierFilter() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("ClientSearchBroker");
        
        // has only 1 carrier: KAISER
        Client kaiserOnlyClient = testEntityHelper.createTestClient("ClientSearchKaiserFilterTest1", broker);
        RfpQuote kaiserQuote = testEntityHelper.createTestRfpQuote(kaiserOnlyClient, appCarrier[0], Constants.MEDICAL, 
            QuoteType.STANDARD);
        ClientPlan cpKaiserOnly = testEntityHelper.createTestClientPlan("cp name 1", kaiserOnlyClient, CarrierType.KAISER.name(), "HMO");
        RfpQuoteOption kaiserOption1 = testEntityHelper.createTestRfpQuoteOption(kaiserQuote, "Option 1");
        
        // has 2 carriers: CIGNA and KAISER
        Client withKaiserClient = testEntityHelper.createTestClient("ClientSearchKaiserFilterTest2", broker);
        RfpQuote withKaiserQuote = testEntityHelper.createTestRfpQuote(withKaiserClient, appCarrier[0], Constants.MEDICAL, 
            QuoteType.STANDARD);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name 2", withKaiserClient, CarrierType.CIGNA.name(), "HMO");
        ClientPlan cpWithKaiser = testEntityHelper.createTestClientPlan("cp name 3", withKaiserClient, CarrierType.KAISER.name(), "HMO");
        RfpQuoteOption withKaiserOption1 = testEntityHelper.createTestRfpQuoteOption(withKaiserQuote, "Option 1");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", Constants.MEDICAL);
        params.add("brokerIds", broker.getBrokerId().toString());
        params.add("clientStates", kaiserOnlyClient.getClientState().name());
        params.add("clientStates", withKaiserClient.getClientState().name());

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
        
        assertThat(response).hasSize(2);
        assertThat(response).extracting(ClientSearchResult::getClientId)
            .containsExactlyInAnyOrder(kaiserOnlyClient.getClientId(), withKaiserClient.getClientId());
        assertThat(response).extracting(ClientSearchResult::getQuoteType)
            .containsExactlyInAnyOrder(QuoteType.STANDARD.name(), QuoteType.KAISER.name());
        if(response[0].getQuoteType().equals(QuoteType.STANDARD.name())) {
            assertThat(response[0].getCarrierLogoUrl()).endsWith("/KAISER.png");
        } else {
            assertThat(response[1].getCarrierLogoUrl()).endsWith("CIGNA_KAISER.png");
        }
        
        // add KAISER filter and check for only one client with Carrier = Kaiser  will be found
        
        params.add("carrierIds", cpKaiserOnly.getPnn().getPlan().getCarrier().getCarrierId().toString());
        
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
        
        assertThat(response).hasSize(1); // unique tests client
        assertThat(response[0].getClientId()).isEqualTo(kaiserOnlyClient.getClientId());
        assertThat(response[0].getQuoteType()).isEqualTo(QuoteType.STANDARD.name());
        assertThat(response[0].getCarrierLogoUrl()).endsWith("/KAISER.png");
    }
    
    @Test
    public void searchClientsByParams_KaiserOption1() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("ClientSearchBroker");

        Client client = testEntityHelper.createTestClient("ClientSearchKaiserOptionTest", broker);
        RfpQuote standardQuote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL, 
            QuoteType.STANDARD);
        RfpQuote kaiserQuote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL, 
            QuoteType.KAISER);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), "HMO");
        
        RfpQuoteOption standardOption1 = testEntityHelper.createTestRfpQuoteOption(standardQuote, "Option 1");
        RfpQuoteOption kaiserOption1 = testEntityHelper.createTestRfpQuoteOption(kaiserQuote, "Option 1");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", Constants.MEDICAL);
        params.add("brokerIds", broker.getBrokerId().toString());
        params.add("clientName", client.getClientName());
        params.add("clientStates", client.getClientState().name());

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
        
        assertThat(response).hasSize(1); // unique tests client
        assertThat(response[0].getOption1Id()).isEqualTo(standardOption1.getRfpQuoteOptionId());
        
        // add KAISER plan and check for selected Kaiser Option 1
        
        ClientPlan cpKaiser = testEntityHelper.createTestClientPlan("cp Kaiser", client, CarrierType.KAISER.name(), "PPO");
        
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
        
        assertThat(response).hasSize(1); // unique tests client
        assertThat(response[0].getOption1Id()).isEqualTo(kaiserOption1.getRfpQuoteOptionId());
        assertThat(response[0].getQuoteType()).isEqualTo(QuoteType.KAISER.name());
        assertThat(response[0].getCarrierLogoUrl()).endsWith("CIGNA_KAISER.png");
        
        // remove KAISER quote and check for selected Standard Option 1
        
        rfpQuoteOptionRepository.delete(kaiserOption1.getRfpQuoteOptionId());
        rfpQuoteRepository.delete(kaiserQuote.getRfpQuoteId());
        
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
        
        assertThat(response).hasSize(1); // unique tests client
        assertThat(response[0].getOption1Id()).isEqualTo(standardOption1.getRfpQuoteOptionId());
        // quoteType - type of incumbent (current) client option determinated by client plans carrier
        // in current case CIGNA + KAISER -> quoteType=KAISER
        assertThat(response[0].getQuoteType()).isEqualTo(QuoteType.KAISER.name());
        assertThat(response[0].getCarrierLogoUrl()).endsWith("CIGNA_KAISER.png");
    }
    
    @Test
    public void getClientFilterParams() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("ClientSearchBroker");

        assertThat(broker.getPresales()).hasSize(1);
        Person testPresales = broker.getPresales().get(0);
        assertThat(broker.getSales()).hasSize(1);
        Person testSales = broker.getSales().get(0);
        
        Client client = testEntityHelper.createTestClient("ClientSearchTest", broker);
        client.setClientState(ClientState.SOLD); 
        client = clientRepository.save(client);
        
        RfpQuote rfpQuote1 = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), "HMO");
        
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(rfpQuote1, "Option 1");
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(rfpQuote1, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 
            cp.getTier1Rate() * 0.9f, cp.getTier2Rate() * 0.9f, cp.getTier3Rate() * 0.9f, cp.getTier4Rate() * 0.9f);
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(
            medicalOption, medicalNetwork, medicalNetworkPlan, cp, 
            cp.getTier1Census(), cp.getTier2Census(), cp.getTier3Census(), cp.getTier4Census(), 
            cp.getErContributionFormat(), 
            cp.getTier1ErContribution(), cp.getTier2ErContribution(), cp.getTier3ErContribution(), cp.getTier4ErContribution());
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", "MEDICAL");

        flushAndClear();

        MvcResult result = performGetAndAssertResult((Object) null, "/dashboard/clients/search/filters", "product", "MEDICAL");

        ClientSearchFilterParams response = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientSearchFilterParams.class);

        assertThat(response.getBrokerages().size()).isGreaterThanOrEqualTo(1);
        assertThat(response.getSales()).size().isGreaterThanOrEqualTo(1);
        assertThat(response.getSales()).extracting(m -> String.valueOf(m.get("id")) + m.get("name"))
            .contains(String.valueOf(testSales.getPersonId()) + testSales.getFullName());
        assertThat(response.getPresales()).size().isGreaterThanOrEqualTo(1);
        assertThat(response.getPresales()).extracting(m -> String.valueOf(m.get("id")) + m.get("name"))
            .contains(String.valueOf(testPresales.getPersonId()) + testPresales.getFullName());
        assertThat(response.getIncumbentCarriers().size()).isGreaterThanOrEqualTo(1);
        assertThat(response.getIncumbentCarriers()).extracting(m -> String.valueOf(m.get("id")) + m.get("name"))
            .contains(String.valueOf(cp.getPnn().getPlan().getCarrier().getCarrierId()) + CarrierType.CIGNA.displayName);
        assertThat(response.getDiffPercentFrom()).isNotEqualTo(0f);
        assertThat(response.getDiffPercentTo()).isNotEqualTo(0f);
        assertThat(response.getClientsTotalCount()).isGreaterThanOrEqualTo(1);
        
    }
    
    @Test
    public void getRewardsInfo() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("RewardsInfoClientBroker");
        Client client = testEntityHelper.createTestClient("RewardsInfoClient1", broker);
        Client client2 = testEntityHelper.createTestClient("RewardsInfoClient2", broker);
        
        ClientTeam clientTeam1 = testEntityHelper.createClientTeam(broker, client, "auth0|1", "Recipient 3");
        ClientTeam clientTeam2 = testEntityHelper.createClientTeam(broker, client2, "auth0|2", "Recipient 2");
        ClientTeam clientTeam3 = testEntityHelper.createClientTeam(broker, client, "auth0|3", null);
        
        Activity activity1 = testEntityHelper.createTestActivity(client, null, null, 
            ActivityType.REWARD, null, "100", clientTeam1.getId(), clientTeam3.getId());

        Activity activity2 = testEntityHelper.createTestActivity(client, null, null, 
            ActivityType.REWARD, null, "100", clientTeam2.getId());
        activity2.setCompleted(new Date());
        activityRepository.save(activity2);
        
        MvcResult result = performGetAndAssertResult(null, "/dashboard/clients/rewards");
        
        RewardsInfoDto[] rewards = jsonUtils.fromJson(result.getResponse().getContentAsString(), RewardsInfoDto[].class);
        assertThat(rewards).hasSize(3);
        // check for order by
        assertThat(rewards).extracting(RewardsInfoDto::getRecipientName)
            // email returned if name is missing
            .containsExactly("test@domain.com", "Recipient 2", "Recipient 3");
        for(RewardsInfoDto rewardsInfoDto : rewards) {
            assertThat(rewardsInfoDto).hasNoNullFieldsOrProperties();
            if(rewardsInfoDto.getRecipientName().equals("Recipient 2")) {
                assertThat(rewardsInfoDto.isSent()).isTrue();
            } else {
                assertThat(rewardsInfoDto.isSent()).isFalse();
            }
        }
    }
    
    @Test
    public void searchClientsByParams() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("ClientSearchBroker");

        Client client = testEntityHelper.createTestClient("ClientSearchTest", broker);
        RfpQuote rfpQuote1 = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
        RfpQuote rfpQuote2 = testEntityHelper.createTestRfpQuote(client, CarrierType.AETNA.name(), Constants.DENTAL);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), "HMO");
        
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(rfpQuote1, "Option 1");
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(rfpQuote1, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 
            cp.getTier1Rate() * 0.9f, cp.getTier2Rate() * 0.9f, cp.getTier3Rate() * 0.9f, cp.getTier4Rate() * 0.9f);
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(
            medicalOption, medicalNetwork, medicalNetworkPlan, cp, 
            cp.getTier1Census(), cp.getTier2Census(), cp.getTier3Census(), cp.getTier4Census(), 
            cp.getErContributionFormat(), 
            cp.getTier1ErContribution(), cp.getTier2ErContribution(), cp.getTier3ErContribution(), cp.getTier4ErContribution());
        
        Activity lastProb = testEntityHelper.createTestActivity(client, CarrierType.OTHER.name(), 
            Constants.MEDICAL, ActivityType.PROBABILITY, null, "lastValue");
        Activity diff = testEntityHelper.createTestActivity(client, CarrierType.OTHER.name(), 
            Constants.MEDICAL, ActivityType.PROBABILITY, null, "oldValue");
        // change date to check returned last (by date) probability
        diff.setLatest(false);
        diff = activityRepository.save(diff);

        Calendar effectiveDateFrom = Calendar.getInstance();
        Calendar effectiveDateTo = Calendar.getInstance();
        effectiveDateFrom.setTime(new Date());
        effectiveDateTo.setTime(new Date());
        effectiveDateTo.add(Calendar.YEAR, 4);
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", "MEDICAL");
        params.add("brokerIds", broker.getBrokerId().toString());
        params.add("clientName", client.getClientName());
        params.add("saleIds", client.getSales().get(0).getPersonId().toString());
        params.add("presaleIds", client.getPresales().get(0).getPersonId().toString());
        params.add("carrierIds", cp.getPnn().getPlan().getCarrier().getCarrierId().toString());
        params.add("effectiveDateFrom", formatDate(effectiveDateFrom));
        params.add("effectiveDateTo", formatDate(effectiveDateTo));
        params.add("clientStates", client.getClientState().name());
        params.add("employeeCountFrom", client.getParticipatingEmployees().toString());
        params.add("employeeCountTo", client.getParticipatingEmployees().toString());
        params.add("diffPercentFrom", "-100.0");
        params.add("diffPercentTo", "100.0");
        params.add("diffDollarFrom", "-100000");
        params.add("diffDollarTo", "100000");
        //params.add("probability", "HIGH");
        params.add("rateBankAmount", "123");
        
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
        
        assertThat(response).hasSize(1); // unique tests client
        assertThat(response[0]).hasNoNullFieldsOrPropertiesExcept(
                "renewal1Id",
                "clientAttributes",
                "startingRenewalIncrease",
                "currentRenewalIncrease");
        
        assertThat(response[0].getDiffPercent()).isEqualTo(-10, Offset.offset(0.001f));
        assertThat(response[0].getCompetitiveVsCurrent()).isEqualTo(response[0].getDiffPercent());
        assertThat(response[0].getProbability()).isEqualTo(lastProb.getValue());
        assertThat(response[0].getQuotedProducts()).containsExactlyInAnyOrder(Constants.MEDICAL, Constants.DENTAL);
        
        // check search for missing value
        params.add("probability", "HIGH");
        
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
        
        assertThat(response).hasSize(0);
    }

    @Test
    public void searchClientsByMultipleCarriers() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("ClientSearchBroker");
        Client multipleCarriersClient = testEntityHelper.buildTestClient("MultipleCarriersClient", broker);
        multipleCarriersClient.setClientState(ClientState.QUOTED); 
        multipleCarriersClient = clientRepository.save(multipleCarriersClient);
 
        RfpQuote rfpQuote1 = testEntityHelper.createTestRfpQuote(multipleCarriersClient, appCarrier[0], Constants.MEDICAL);
        ClientPlan cp1 = testEntityHelper.createTestClientPlan("cp name 1", multipleCarriersClient, CarrierType.CIGNA.name(), "HMO");
        ClientPlan cp2 = testEntityHelper.createTestClientPlan("cp name 2", multipleCarriersClient, CarrierType.AETNA.name(), "HMO");
        ClientPlan cp3 = testEntityHelper.createTestClientPlan("cp name 3", multipleCarriersClient, CarrierType.OTHER.name(), "HMO");
        
        RfpQuoteOption medicalOption1 = testEntityHelper.createTestRfpQuoteOption(rfpQuote1, "Option 1");
        
        Client client = testEntityHelper.buildTestClient("SingleCarriersClient", broker);
        client.setClientState(ClientState.QUOTED); 
        client = clientRepository.save(client);
        
        RfpQuote rfpQuote2 = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL);
        RfpQuoteOption medicalOption2 = testEntityHelper.createTestRfpQuoteOption(rfpQuote2, "Option 1");
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), "HMO");
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", Constants.MEDICAL);
        params.add("brokerIds", broker.getBrokerId().toString());
        params.add("multipleCarriers", Boolean.toString(true));

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
        assertThat(response[0].getClientId()).isEqualTo(multipleCarriersClient.getClientId());
        assertThat(response[0].getCarrierDisplayName()).isEqualTo(Constants.MULTIPLE_CARRIER_DISPLAY_NAME);
        
        // check for single carrier client (CIGNA)
        params.add("carrierIds", cp.getPnn().getPlan().getCarrier().getCarrierId().toString());
        
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
        assertThat(response).extracting(ClientSearchResult::getClientId)
            .containsExactlyInAnyOrder(client.getClientId());
        assertThat(response).extracting(ClientSearchResult::getCarrierDisplayName)
            .containsExactlyInAnyOrder(CarrierType.CIGNA.displayName);
    }
    
    @Test
    public void searchClientsByCompetitiveInfoCarrier() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("ClientSearchBroker");
        Client client = testEntityHelper.buildTestClient("ClientSearchCompetitiveInfoCarrierTest", broker);
        client.setClientState(ClientSearchRepository.COMPETITIVE_INFO_SEARCH_FILTER_STATES.get(0));
        client = clientRepository.save(client);

        RfpQuote rfpQuote1 = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), "HMO");
        
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(rfpQuote1, "Option 1");
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(rfpQuote1, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 
            cp.getTier1Rate() * 0.9f, cp.getTier2Rate() * 0.9f, cp.getTier3Rate() * 0.9f, cp.getTier4Rate() * 0.9f);
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(
            medicalOption, medicalNetwork, medicalNetworkPlan, cp, 
            cp.getTier1Census(), cp.getTier2Census(), cp.getTier3Census(), cp.getTier4Census(), 
            cp.getErContributionFormat(), 
            cp.getTier1ErContribution(), cp.getTier2ErContribution(), cp.getTier3ErContribution(), cp.getTier4ErContribution());
        
        Activity competitiveInfo1 = testEntityHelper.createTestActivity(client, CarrierType.OTHER.name(), 
            Constants.MEDICAL, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "5");
        
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", "MEDICAL");
        params.add("competitiveInfoCarrier", CarrierType.OTHER.name());
        
        //flushAndClear();

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
        response = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientSearchResult[].class);
        final Client finalClient = client;
        List<ClientSearchResult> resultList = Arrays.stream(response).filter(r -> r.getClientId().equals(finalClient.getClientId())).collect(Collectors.toList());

        assertThat(resultList).hasSize(1); // unique tests client
        assertThat(resultList.get(0).getClientId()).isEqualTo(client.getClientId());
        
        // check search for missing value
        params.put("competitiveInfoCarrier", Collections.singletonList(CarrierType.CIGNA.name()));
        
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
        resultList = Arrays.stream(response).filter(r -> r.getClientId().equals(finalClient.getClientId())).collect(Collectors.toList());
        
        assertThat(resultList).hasSize(0);
    }

    @Test
    public void searchClientsWithDeclinedQuote() throws Exception {

        Broker broker = testEntityHelper.createTestBroker("ClientSearchBroker");
        Client cl = testEntityHelper.buildTestClient("ClientSearchWithDeclinedQuote", broker);
        cl.setClientState(ClientState.QUOTED); 
        final Client client = clientRepository.save(cl);

        ClientPlan cp = testEntityHelper.createTestClientPlan("testClientPlan",
            cl, CarrierType.OTHER.name(), "HMO");

        RfpQuote rfpQuote1 = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(),
                Constants.MEDICAL);
        rfpQuote1.setQuoteType(QuoteType.DECLINED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", "MEDICAL");

        MvcResult result = mockMvc
                .perform(MockMvcRequestBuilders.get("/dashboard/clients/search")
                        .header(HttpHeaders.AUTHORIZATION,
                                AUTHORIZATION_HEADER_BEARER + " " + token)
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON).params(params)
                        .contentType(MediaType.APPLICATION_JSON_UTF8)
                        .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is2xxSuccessful())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andReturn();

        ClientSearchResult[] response = jsonUtils
                .fromJson(result.getResponse().getContentAsString(), ClientSearchResult[].class);

        assertThat(response).isNotNull();

        ClientSearchResult clientSearchResult = Arrays.stream(response)
                .filter(r -> r.getClientId().equals(client.getClientId())).findFirst().orElse(null);

        assertThat(clientSearchResult).isNotNull();
        assertThat(clientSearchResult.getClientState()).isEqualTo(client.getClientState());
        assertThat(clientSearchResult.getQuoteType()).isEqualTo(QuoteType.DECLINED.name());
        assertThat(clientSearchResult.getCarrierName()).isEqualTo(CarrierType.OTHER.name());
    }

    @Test
    public void searchClientsByParams_QuotedProductsWithClearValueQuote() throws Exception {

        Broker broker = testEntityHelper.createTestBroker("ClientSearchBroker");
        Client client = testEntityHelper.createTestClient("ClientSearchWithClearValueQuote", broker);
        client.setClientState(ClientState.QUOTED); 
                
        RfpQuote medicalRfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(),
                Constants.MEDICAL);
        medicalRfpQuote.setQuoteType(QuoteType.CLEAR_VALUE);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(medicalRfpQuote, "Option 1");

        RfpQuote dentalRfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(),
                Constants.DENTAL);
        RfpQuoteOption dentalOption = testEntityHelper.createTestRfpQuoteOption(dentalRfpQuote, "Option 1");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("product", Constants.DENTAL);
        params.add("brokerIds", broker.getBrokerId().toString());
        params.add("clientName", client.getClientName());
        params.add("clientStates", client.getClientState().name());
        
        MvcResult result = mockMvc
                .perform(MockMvcRequestBuilders.get("/dashboard/clients/search")
                        .header(HttpHeaders.AUTHORIZATION,
                                AUTHORIZATION_HEADER_BEARER + " " + token)
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON).params(params)
                        .contentType(MediaType.APPLICATION_JSON_UTF8)
                        .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is2xxSuccessful())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andReturn();

        ClientSearchResult[] response = jsonUtils
                .fromJson(result.getResponse().getContentAsString(), ClientSearchResult[].class);

        assertThat(response).isNotNull();

        ClientSearchResult clientSearchResult = Arrays.stream(response)
                .filter(r -> r.getClientId().equals(client.getClientId())).findFirst().orElse(null);

        assertThat(clientSearchResult).isNotNull();
        assertThat(clientSearchResult.getClientState()).isEqualTo(client.getClientState());
        assertThat(clientSearchResult.getQuoteType()).isEqualTo(QuoteType.STANDARD.name());
        assertThat(clientSearchResult.getQuotedProducts()).containsExactly(Constants.DENTAL);

    }

    @Test
    public void getPreQuotedClientsTest() throws Exception {

        Broker broker = testEntityHelper.createTestBroker("PreQuotedClientsTestBroker");
        Client client1 = testEntityHelper.createTestClient("PreQuotedClientsTestClient1", broker);
        client1.setClientState(ClientState.RATES_ISSUED);
        client1.setCarrierOwned(true);
        client1.getAttributes().add(
                testEntityHelper.createTestClientAttribute(client1, AttributeName.NOT_VIEWED_IN_DASHBOARD, ""));
        
        Client client2 = testEntityHelper.createTestClient("PreQuotedClientsTestClient2", broker);
        client2.setClientState(ClientState.OPPORTUNITY_IN_PROGRESS); 
        client2.setCarrierOwned(true);
        client2.setEffectiveDate(null);
        
        Client client3 = testEntityHelper.createTestClient("PreQuotedClientsTestClient3", broker);
        client3.setClientState(ClientState.SENT_TO_RATER); 
        client3.setCarrierOwned(true);
        client3.setEffectiveDate(DateUtils.addDays(client3.getEffectiveDate(), 1));

        Client client4 = testEntityHelper.createTestClient("PreQuotedClientsTestClient4", broker);
        client4.setClientState(ClientState.OPPORTUNITY_IN_PROGRESS); 
        client4.setCarrierOwned(true);
                
        MvcResult result = performGetAndAssertResult(null, "/dashboard/clients/preQuoted");
        
        Map<String , List<ClientPreQuotedDto>> response = 
                jsonUtils.fromJson(result.getResponse().getContentAsString(), Map.class);

        assertThat(response).isNotNull();
        assertThat(response).hasSize(2);
        assertThat(response.get("NewRfps"))
            .isNotNull()
            .hasSize(1);
        assertThat(response.get("InProgress"))
            .isNotNull()
            .hasSize(3)
            .extracting("clientName")
            .containsExactly("PreQuotedClientsTestClient4","PreQuotedClientsTestClient3","PreQuotedClientsTestClient2");

    }

}
