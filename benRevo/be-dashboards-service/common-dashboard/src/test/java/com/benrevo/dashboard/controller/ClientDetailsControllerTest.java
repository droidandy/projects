package com.benrevo.dashboard.controller;

import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;
import static com.benrevo.common.enums.ActivityType.*;
import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ActivityClientTeamDto;
import com.benrevo.common.dto.ActivityDto;
import com.benrevo.common.dto.ActivityDto.Option;
import com.benrevo.common.dto.ClientDetailsDto;
import com.benrevo.common.dto.QuoteOptionBriefDto;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.CompetitiveInfoOption;
import com.benrevo.common.enums.ProbabilityOption;
import com.benrevo.common.enums.QuoteState;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.ActivityRepository;
import com.benrevo.data.persistence.repository.RewardRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.testng.Assert.fail;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class ClientDetailsControllerTest extends AbstractControllerTest {
    
    @Autowired
    private ClientDetailsController clientDetailsController;

    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private RewardRepository rewardRepository;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;
    
    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;

    @Autowired
    private TestEntityHelper testEntityHelper;
    
    @Before
    @Override
    public void init() throws Auth0Exception {
        initController(clientDetailsController);
        User user = new User("test");
        user.setEmail("test@domain.test");
        user.setUserMetadata( build( entry("first_name", "FirstName"), entry("last_name", "LastName") ) );

        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);
    }

    @Test
    public void testClientDetails_RenewalOption() throws Exception {
        Client client = testEntityHelper.createTestClient();
        
        RfpQuote dtqQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
        RfpQuoteNetwork dtqrqn = testEntityHelper.createTestQuoteNetwork(dtqQuote, "HMO");
        RfpQuoteOption dtqrqo = testEntityHelper.createTestRfpQuoteOption(dtqQuote, "optionName");
        RfpQuoteOptionNetwork dtqrqon = testEntityHelper.createTestRfpQuoteOptionNetwork(dtqrqo, dtqrqn, null, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        RfpQuoteOption renewalOption = testEntityHelper.createTestRfpQuoteOption(dtqQuote, RfpQuoteService.RENEWAL_OPTION_NAME);
        
        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/details/{product}", 
            client.getClientId(), Constants.MEDICAL);
    
        ClientDetailsDto details = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDetailsDto.class);

        // Renewal should be filtered
        assertThat(details.getOptions()).hasSize(1);
        assertThat(details.getOptions()).extracting(QuoteOptionBriefDto::getName)
            .containsExactly(dtqrqo.getRfpQuoteOptionName());
    }
    
    @Test
    public void testClientDetails_DeclinedQuote() throws Exception {
        Client client = testEntityHelper.createTestClient();
        
        ClientPlan clientPlan1 = testEntityHelper.createTestClientPlan("medical client plan", client, CarrierType.BLUE_SHIELD.name(), "DHMO");

        RfpQuote dtqQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.DENTAL);
        dtqQuote.setUpdated(DateUtils.truncate(DateUtils.addDays(new Date(), -1), Calendar.SECOND));
        rfpQuoteRepository.save(dtqQuote);
        
        RfpQuoteNetwork dtqrqn = testEntityHelper.createTestQuoteNetwork(dtqQuote, "DHMO");
        RfpQuoteNetworkPlan dtqrqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", dtqrqn, 100f, 120f, 140f, 160f);
        RfpQuoteOption dtqrqo = testEntityHelper.createTestRfpQuoteOption(dtqQuote, "optionName");
        RfpQuoteOptionNetwork dtqrqon = testEntityHelper.createTestRfpQuoteOptionNetwork(dtqrqo, dtqrqn, dtqrqnp, clientPlan1, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        Activity activity = testEntityHelper.createTestActivity(
            client, 
            null,
            Constants.DENTAL,
            ActivityType.OPTION1_RELEASED, 
            null, 
            "123");
        
        flushAndClear();
        
        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/details/{product}", 
            client.getClientId(), Constants.DENTAL);
    
        ClientDetailsDto details = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDetailsDto.class);
        
        assertThat(details.getClientState()).isEqualTo(client.getClientState());
        assertThat(details.getOptions()).hasSize(1);
        assertThat(details.getOptions().get(0).getPercentDifference()).isNotNull().isNotEqualTo(0f);
        assertThat(details.getDateUploaded()).isEqualTo(dtqQuote.getUpdated());
        assertThat(details.getCurrentCarrierName()).isEqualTo(clientPlan1.getPnn().getNetwork().getCarrier().getDisplayName());
        assertThat(details.getQuoteType()).isEqualTo(QuoteType.STANDARD);
        
        sharedRfpQuoteService.processDeclinedQuote(client.getClientId(), client.getBroker().getBrokerId(), 
            CarrierType.OTHER.name(), Constants.DENTAL, true);
        
        List<RfpQuote> quotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), Constants.DENTAL);
        assertThat(quotes).hasSize(0);
        RfpQuote declinedQuote = rfpQuoteRepository.findOne(dtqQuote.getRfpQuoteId());
        assertThat(declinedQuote.getQuoteType()).isEqualTo(QuoteType.DECLINED);

        Activity dtqActivity = activityRepository.findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(client.getClientId(), ActivityType.OPTION1_RELEASED, null, Constants.DENTAL, null);
        assertThat(dtqActivity).isNotNull();
        assertThat(dtqActivity.getActivityId()).isEqualTo(activity.getActivityId());
        assertThat(dtqActivity.getNotes()).startsWith("DTQ Dental Option 1");
        assertThat(dtqActivity.getNotes()).endsWith("Quote not released to broker");
        
        flushAndClear();
        
        result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/details/{product}", 
            client.getClientId(), Constants.DENTAL);
        
        details = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDetailsDto.class);
        
        assertThat(details.getClientState()).isEqualTo(client.getClientState());
        assertThat(details.getOptions()).hasSize(1);
        assertThat(details.getOptions().get(0).getQuoteState()).isEqualTo(QuoteState.DECLINED);
        assertThat(details.getOptions().get(0).getPercentDifference()).isNotNull().isNotEqualTo(0f);
        assertThat(details.getDateUploaded()).isEqualTo(dtqQuote.getUpdated());
        assertThat(details.getQuoteType()).isEqualTo(QuoteType.DECLINED);
    }
    
    @Test
    public void testClientDetails() throws Exception {
        Client client = testEntityHelper.createTestClient();
        
        token = createToken(client.getBroker().getBrokerToken());

        Activity activity1 = testEntityHelper.createTestActivity(
                client,
                CarrierType.AETNA.name(),
                Constants.MEDICAL,
                ActivityType.COMPETITIVE_INFO, 
                CompetitiveInfoOption.DIFFERENCE.name(), 
                "10");
  
        Activity activity2 = testEntityHelper.createTestActivity(
                client, 
                CarrierType.OTHER.name(),
                Constants.MEDICAL,
                ActivityType.COMPETITIVE_INFO, 
                CompetitiveInfoOption.DIFFERENCE.name(), 
                "15");
        
        Activity activity3 = testEntityHelper.createTestActivity(
                client,
                null,
                null,
                ActivityType.PROBABILITY, 
                null,
                ProbabilityOption.LOW.name());

        Activity activity4 = testEntityHelper.createTestActivity(
                client, 
                null,
                Constants.MEDICAL,
                ActivityType.OPTION1_RELEASED, 
                null, 
                "11");
        
        Activity activity5 = testEntityHelper.createTestActivity(
                client, 
                null,
                Constants.DENTAL,
                ActivityType.OPTION1_RELEASED, 
                null, 
                "114");
        
        Activity activity6 = testEntityHelper.createTestActivity(
            client, 
            null,
            Constants.MEDICAL,
            ActivityType.RENEWAL_ADDED, 
            null, 
            "17");
        
        testEntityHelper.createTestRFPs(client);
        
        ClientPlan clientPlan1 = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        ClientPlan clientPlan2 = testEntityHelper.createTestClientPlan("hsa client plan", client, "KAISER", "HSA");
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, clientPlan1, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
                
        flushAndClear();
        
        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/details/{product}", client.getClientId(),Constants.MEDICAL);
    
        ClientDetailsDto details = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDetailsDto.class);
        
        assertThat(details.getClientName()).isEqualTo(client.getClientName());
        assertThat(details.getClientState()).isEqualTo(client.getClientState());
        assertThat(details.getProbability()).isEqualTo(ProbabilityOption.LOW.name());
        assertThat(details.getDifferences()).hasSize(4);
        assertThat(details.getDifferences()).extracting(ActivityDto::getType)
            .containsExactly(COMPETITIVE_INFO, COMPETITIVE_INFO, OPTION1_RELEASED, RENEWAL_ADDED);
        assertThat(details.getOptions()).hasSize(1);
        assertThat(details.getDateUploaded()).isCloseTo(rfpQuote.getUpdated(), 1000L /* 1 sec */);
        assertThat(details.getCurrentCarrierName()).isEqualTo(clientPlan1.getPnn().getNetwork().getCarrier().getDisplayName());
        assertThat(details.getQuoteType()).isEqualTo(QuoteType.KAISER);
      
    }

    @Test
    public void testClientDetailsWithGa() throws Exception {
        
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        Broker ga = testEntityHelper.createTestBroker("Ga Broker Name");
        testEntityHelper.createExtClientAccess(ga, client);
        
        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/details/{product}", client.getClientId(),Constants.MEDICAL);
    
        ClientDetailsDto details = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDetailsDto.class);
        
        assertThat(details.getClientName()).isEqualTo(client.getClientName());
        assertThat(details.getBrokerName()).isEqualTo(client.getBroker().getName());
        assertThat(details.getGaName()).isEqualTo(ga.getName());
        assertThat(details.getSalesName()).isEqualTo(client.getSalesFullName());
    }

    
    @Test
    public void testGetActivitiesByClientId() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        token = createToken(broker.getBrokerToken());
        ClientTeam clientTeam1 = testEntityHelper.createClientTeam(broker, client);
        ClientTeam clientTeam2 = testEntityHelper.createClientTeam(broker, client);
        ClientTeam clientTeam3 = testEntityHelper.createClientTeam(broker, client);

        Activity activity1 = testEntityHelper.createTestActivity(
                client, null, null, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "20");
        Activity activity2 = testEntityHelper.createTestActivity(
                client, null, null, ActivityType.REWARD, ActivityType.REWARD.name(), "200");
        Activity activity3 = testEntityHelper.createTestActivity(
                client, null, Constants.MEDICAL, ActivityType.OPTION1_RELEASED, null, "11");
       
        Reward reward1 = new Reward(activity2.getActivityId(), clientTeam1.getId());
        rewardRepository.save(reward1);
        Reward reward2 = new Reward(activity2.getActivityId(), clientTeam2.getId());
        rewardRepository.save(reward2);

        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/activities", client.getClientId());

        ActivityDto[] activityDtos = jsonUtils.fromJson(result.getResponse().getContentAsString(), ActivityDto[].class);
        
        assertThat(activityDtos).isNotNull();
        assertThat(activityDtos).hasSize(3);
        assertThat(activityDtos).extracting("value").containsExactly("20","200","11");
        assertThat(activityDtos).extracting("type").containsExactly(ActivityType.COMPETITIVE_INFO, ActivityType.REWARD, ActivityType.OPTION1_RELEASED);
        // only clientTeam1 and clientTeam2 selected
        String rewardNotes = "100 reward points sent to " + clientTeam1.getName() + ", " + clientTeam2.getName();
        assertThat(activityDtos).extracting("notes").containsExactly("notes", rewardNotes, "notes");
    }

    @Test
    public void testDeleteActivity() throws Exception {

        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        token = createToken(broker.getBrokerToken());

        Activity activity1 = testEntityHelper.createTestActivity(
            client, null, null, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "20");
        
        Activity activity2 = testEntityHelper.createTestActivity(
            client, null, null, ActivityType.REWARD, ActivityType.REWARD.name(), "200");
        ClientTeam clientTeam1 = testEntityHelper.createClientTeam(broker, client);
        rewardRepository.save(new Reward(activity2.getActivityId(), clientTeam1.getId()));
        
        Activity activity3 = testEntityHelper.createTestActivity(
            client, null, Constants.MEDICAL, ActivityType.OPTION1_RELEASED, null, "11");

        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/activities", client.getClientId());

        ActivityDto[] activityDtos = jsonUtils.fromJson(result.getResponse().getContentAsString(), ActivityDto[].class);

        assertThat(activityDtos).isNotNull();
        assertThat(activityDtos).hasSize(3);
        
        for(Activity activity : Arrays.asList(activity1, activity2, activity3)) {
            result = performDeleteAndAssertResult("", "/dashboard/activities/{activityId}", activity.getActivityId());
            Activity x = activityRepository.findOne(activity.getActivityId());
            assertThat(x).isNull();
        }  
    }

    @Test
    public void testDeleteActivityWithPrevious() throws Exception {

        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        token = createToken(broker.getBrokerToken());

        Activity prev1 = testEntityHelper.createTestActivity(
            client, null, null, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "20");
        prev1.setLatest(false);
        prev1.setCreated(new Date(prev1.getCreated().getTime() - 1000));
        
        Activity prev2 = testEntityHelper.createTestActivity(
            client, null, null, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "22");
        prev2.setLatest(false);
       
        
        Activity current = testEntityHelper.createTestActivity(
                client, null, null, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "25");
        
        flushAndClear();

        performDeleteAndAssertResult("", "/dashboard/activities/{activityId}", current.getActivityId());
        
        flushAndClear();

        activityRepository
            .findByClientId(client.getClientId())
            .forEach(activity -> {
                if  (activity.getActivityId().equals(prev1.getActivityId())) {
                    assertThat(activity.getLatest()).isFalse();            
                } else if  (activity.getActivityId().equals(prev2.getActivityId())) {
                    assertThat(activity.getLatest()).isTrue();
                } else {
                    fail("Unexpected activity");
                }
            });
        
    }
    
    @Test
    public void testDeleteActivityNotFoundException() throws Exception {

        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        token = createToken(broker.getBrokerToken());

        Activity activity1 = testEntityHelper.createTestActivity(
            client, null, null, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "20");
        Activity activity2 = testEntityHelper.createTestActivity(
            client, null, null, ActivityType.REWARD, ActivityType.REWARD.name(), "200");
        Activity activity3 = testEntityHelper.createTestActivity(
            client, null, Constants.MEDICAL, ActivityType.OPTION1_RELEASED, null, "11");

        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/activities", client.getClientId());

        ActivityDto[] activityDtos = jsonUtils.fromJson(result.getResponse().getContentAsString(), ActivityDto[].class);

        assertThat(activityDtos).isNotNull();
        assertThat(activityDtos).hasSize(3);
        assertThat(activityDtos).extracting("value").containsExactly("20","200","11");
        assertThat(activityDtos).extracting("type").containsExactly(ActivityType.COMPETITIVE_INFO, ActivityType.REWARD, ActivityType.OPTION1_RELEASED);
        assertThat(activityDtos).extracting("notes").containsExactly("notes", null, "notes");

        result = performDeleteAndAssertResult("", "/dashboard/activities/{activityId}", activity1.getActivityId());

        Activity x = activityRepository.findOne(activity1.getActivityId());
        assertThat(x).isNull();

        mockMvc.perform(MockMvcRequestBuilders.delete("/dashboard/activities/{activityId}", activity1.getActivityId())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content("")
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isNotFound())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
    }

    @Test
    public void testGetNewActivityForClient() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        token = createToken(broker.getBrokerToken());

        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/activities/{activityType}", 
                client.getClientId(), ActivityType.COMPETITIVE_INFO);
    
        ActivityDto activityDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ActivityDto.class);
        
        assertThat(activityDto).isNotNull();
        assertThat(activityDto.getType()).isEqualTo(ActivityType.COMPETITIVE_INFO);
        assertThat(activityDto.getOptions()).hasSize(CompetitiveInfoOption.values().length);

    }

    @Test
    public void testGetNewRewardForClient() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        ClientTeam clientTeam1 = testEntityHelper.createClientTeam(broker, client);
        ClientTeam clientTeam2 = testEntityHelper.createClientTeam(broker, client);

        token = createToken(broker.getBrokerToken());

        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/activities/{activityType}", client.getClientId(), ActivityType.REWARD);
    
        ActivityDto activityDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ActivityDto.class);
        
        assertThat(activityDto).isNotNull();
        assertThat(activityDto.getType()).isEqualTo(ActivityType.REWARD);
        assertThat(activityDto.getClientTeams()).hasSize(2);
        assertThat(activityDto.getClientTeams()).extracting("clientTeamId")
                .contains(clientTeam1.getId(), clientTeam2.getId());
        
    }
    
    @Test
    public void testGetNewRewardForClientWithGA() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        Broker ga = testEntityHelper.createTestBroker("Ga Name");
        ga.setGeneralAgent(true);
        ClientTeam clientTeam1 = testEntityHelper.createClientTeam(broker, client);
        ClientTeam clientTeam2 = testEntityHelper.createClientTeam(ga, client);
        clientTeam2.setName(null);
        ClientTeam clientTeam3 = testEntityHelper.createClientTeam(broker, client);
        clientTeam3.setName("   ");

        token = createToken(broker.getBrokerToken());

        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/activities/{activityType}", client.getClientId(), ActivityType.REWARD);
    
        ActivityDto activityDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ActivityDto.class);
        
        assertThat(activityDto).isNotNull();
        assertThat(activityDto.getType()).isEqualTo(ActivityType.REWARD);
        assertThat(activityDto.getClientTeams()).hasSize(3);
        for (ActivityClientTeamDto team : activityDto.getClientTeams()) {
            if (team.getClientTeamId().equals(clientTeam1.getId())) {
                assertThat(team.getName()).isEqualTo(clientTeam1.getName());
            } else if (team.getClientTeamId().equals(clientTeam2.getId())) {
                assertThat(team.getName()).isEqualTo(clientTeam2.getEmail() + " (" + clientTeam2.getBroker().getName() + ")");
            } else if (team.getClientTeamId().equals(clientTeam3.getId())) {
                assertThat(team.getName()).isEqualTo(clientTeam3.getEmail());
            } else {
                fail("Unexpected clientTeamId");
            }
        }
        
    }

    
    @Test
    public void testCreateRewardActivity() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        ClientTeam clientTeam = testEntityHelper.createClientTeam(broker, client);
        token = createToken(broker.getBrokerToken());

        ActivityDto activityDto = new ActivityDto();
        activityDto.setType(ActivityType.REWARD);
        activityDto.setClientTeamIds(Arrays.asList(clientTeam.getId()));
        activityDto.setValue(null);
        
        String requestBody = jsonUtils.toJson(activityDto);
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.put("/dashboard/client/{clientId}/activities/create", client.getClientId())
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestBody)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();
        
        List<Activity> activities = activityRepository.findByClientId(client.getClientId());
        
        assertThat(activities).hasSize(1);
        assertThat(activities.get(0).getType()).isEqualTo(ActivityType.REWARD);
        assertThat(activities.get(0).getValue()).isEqualTo("100"); // default constant for Reward value
        
        List<ActivityClientTeamDto> rewarded = rewardRepository.findActivityClientTeamByClientIdAndActivityId(client.getClientId(), activities.get(0).getActivityId());
        
        assertThat(rewarded).hasSize(1);
        assertThat(rewarded.get(0).getName()).isEqualTo(clientTeam.getName());
        assertThat(rewarded.get(0).isSelected()).isTrue();
        
    }

    @Test
    public void testUpdateDifferenceActivity() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        token = createToken(broker.getBrokerToken());

        Activity activity = testEntityHelper.createTestActivity( client, null, null, 
                ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "20");
       
        ActivityDto activityDto = new ActivityDto();
        activityDto.setActivityId(activity.getActivityId());
        activityDto.setOption(activity.getOption());
        activityDto.setValue("33");
        
        String requestBody = jsonUtils.toJson(activityDto);
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.put("/dashboard/activities/{activityId}/update", activity.getActivityId())
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestBody)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();
        
        List<Activity> activities = activityRepository.findByClientId(client.getClientId());
        
        assertThat(activities).hasSize(1);
        assertThat(activities.get(0).getValue()).isEqualTo("33");
        
    }

    @Test
    public void testUpdateRewardActivity() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        ClientTeam clientTeam1 = testEntityHelper.createClientTeam(broker, client);
        ClientTeam clientTeam2 = testEntityHelper.createClientTeam(broker, client);
        ClientTeam clientTeam3 = testEntityHelper.createClientTeam(broker, client);
        token = createToken(broker.getBrokerToken());

        Activity activity = testEntityHelper.createTestActivity(client, null, null, 
                ActivityType.REWARD, ActivityType.REWARD.name(), "200");
        Reward reward1 = new Reward(activity.getActivityId(), clientTeam1.getId());
        rewardRepository.save(reward1);
        Reward reward2 = new Reward(activity.getActivityId(), clientTeam2.getId());
        rewardRepository.save(reward2);

        ActivityDto activityDto = new ActivityDto();
        activityDto.setActivityId(activity.getActivityId());
        activityDto.setClientTeamIds(Arrays.asList(clientTeam2.getId(),clientTeam3.getId()));
        activityDto.setValue("300");
        
        String requestBody = jsonUtils.toJson(activityDto);
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.put("/dashboard/activities/{activityId}/update", activity.getActivityId())
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestBody)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();
        
        List<Activity> activities = activityRepository.findByClientId(client.getClientId());

        assertThat(activities).hasSize(1);
        assertThat(activities.get(0).getActivityId()).isEqualTo(activity.getActivityId());
        assertThat(activities.get(0).getValue()).isEqualTo("300");
        
        List<Reward> rewards = rewardRepository.findByActivityId(activity.getActivityId());

        assertThat(rewards).hasSize(2);
        assertThat(rewards).extracting("clientTeamId").containsExactly(clientTeam2.getId(), clientTeam3.getId());

    }
    
    @Test
    public void testGetActivity() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        token = createToken(broker.getBrokerToken());

        Activity activity = testEntityHelper.createTestActivity(
                client, null, null, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "20");
       
        MvcResult result = performGetAndAssertResult(null, "/dashboard/activities/{activityId}", activity.getActivityId());
        
        ActivityDto activityDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ActivityDto.class);
        
        assertThat(activityDto).isNotNull();
        assertThat(activityDto.getType()).isEqualTo(ActivityType.COMPETITIVE_INFO);
        assertThat(activityDto.getValue()).isEqualTo("20");
        assertThat(activityDto.getOptions()).hasSameSizeAs(CompetitiveInfoOption.values());
        assertThat(activityDto.getNotes()).isEqualTo("notes");
        for (Option option : activityDto.getOptions()) {
            if (option.getName().equals(CompetitiveInfoOption.DIFFERENCE.name())) {
                assertThat(option.isSelected()).isTrue();
            } else {
                assertThat(option.isSelected()).isFalse();
            }
        }
        
    }

    @Test
    public void testGetReward() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        ClientTeam clientTeam1 = testEntityHelper.createClientTeam(broker, client);
        ClientTeam clientTeam2 = testEntityHelper.createClientTeam(broker, client);
        
        token = createToken(broker.getBrokerToken());

        Activity activity = testEntityHelper.createTestActivity(
                client, null, null, ActivityType.REWARD, ActivityType.REWARD.name(), "200");
        activity.setCompleted(new Date());

        Reward reward = new Reward(activity.getActivityId(), clientTeam2.getId());
        rewardRepository.save(reward);
        
        MvcResult result = performGetAndAssertResult(null, "/dashboard/activities/{activityId}", activity.getActivityId());
        
        ActivityDto activityDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ActivityDto.class);
        
        assertThat(activityDto).isNotNull();
        assertThat(activityDto.getType()).isEqualTo(ActivityType.REWARD);
        assertThat(activityDto.getValue()).isEqualTo("200");
        assertThat(activityDto.getCompleted()).isNotNull();
        assertThat(activityDto.getCompleted()).isTrue();
        assertThat(activityDto.getClientTeams()).hasSize(2);
        
        for (ActivityClientTeamDto clientTeam : activityDto.getClientTeams()) {
            if (clientTeam.getClientTeamId().equals(clientTeam1.getId())) {
                assertThat(clientTeam.isSelected()).isFalse();
            } else {
                assertThat(clientTeam.isSelected()).isTrue();
            }
        }
    }

    @Test
    public void testGetDifferences() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        
        token = createToken(broker.getBrokerToken());
        Carrier carrier1 = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.name());
        Activity activity1 = testEntityHelper.createTestActivity(
                client,
                carrier1.getName(),
                Constants.MEDICAL,
                ActivityType.COMPETITIVE_INFO, 
                CompetitiveInfoOption.DIFFERENCE.name(), 
                "10");
        Carrier carrier2 = testEntityHelper.createTestCarrier(CarrierType.ASSURANT.name(), CarrierType.ASSURANT.name());
        Activity activity2 = testEntityHelper.createTestActivity(
                client,
                carrier2.getName(),
                Constants.MEDICAL,
                ActivityType.COMPETITIVE_INFO, 
                CompetitiveInfoOption.DIFFERENCE.name(), 
                "15");
        Carrier carrier3 = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.name());
        Activity activity3 = testEntityHelper.createTestActivity(
                client,
                carrier3.getName(),
                Constants.DENTAL,
                ActivityType.COMPETITIVE_INFO, 
                CompetitiveInfoOption.DIFFERENCE.name(), 
                "25");

        
        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/differences/{product}", client.getClientId(),Constants.MEDICAL);
        
        ActivityDto[] activityDtos = jsonUtils.fromJson(result.getResponse().getContentAsString(), ActivityDto[].class);
        
        assertThat(activityDtos).isNotNull();
        assertThat(activityDtos).hasSize(2);
        assertThat(activityDtos).extracting("product").containsExactly(Constants.MEDICAL,Constants.MEDICAL);
        assertThat(activityDtos).extracting("value").containsExactlyInAnyOrder("10","15");
        assertThat(activityDtos).extracting("carrierId").containsExactlyInAnyOrder(carrier1.getCarrierId(),carrier2.getCarrierId());
      
    }

    @Test
    public void testGetProbability() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        
        token = createToken(broker.getBrokerToken());

        Activity activity1 = testEntityHelper.createTestActivity(
                client,
                null,
                null,
                ActivityType.PROBABILITY, 
                null,
                ProbabilityOption.LOW.name());
        activity1.setLatest(false);

        Activity activity2 = testEntityHelper.createTestActivity(
                client, 
                null,
                null,
                ActivityType.PROBABILITY, 
                null,
                ProbabilityOption.HIGH.name());

        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/probability", client.getClientId());
        
        ActivityDto activityDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ActivityDto.class);
        
        assertThat(activityDto).isNotNull();
        assertThat(activityDto.getType()).isEqualTo(ActivityType.PROBABILITY);
        assertThat(activityDto.getValue()).isEqualTo(ProbabilityOption.HIGH.name());

    }

}
