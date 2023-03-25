package com.benrevo.dashboard.controller;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.KAISER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.data.Offset.offset;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.benrevo.be.modules.rfp.controller.RfpController;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CarrierHistoryDto;
import com.benrevo.common.dto.ClientRateBankDto;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.enums.RFPAttributeName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.CarrierHistory;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RFPAttribute;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.mapper.CarrierHistoryMapper;
import com.benrevo.data.persistence.mapper.OptionMapper;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import java.util.Arrays;
import java.util.List;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import springfox.documentation.annotations.ApiIgnore;

public class AnthemDashboardRateBankControllerTest extends AbstractControllerTest {
    
    @Autowired
    private TestEntityHelper testEntityHelper;

    @Autowired
    private AnthemDashboardRateBankController controller;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;
    
    @Before
    public void init() {
        initController(controller);
    }

    @Test
    public void test_getRateBankPageDetails() throws Exception {

        // create quote and medical option 1
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), ANTHEM_BLUE_CROSS.name());
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote stdQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);

        // create client plan
        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan(client, "test hmo client plan",null, "HMO",
            680F, 970F, 720F, 1200F,
            11L, 12L, 10L, 7L,
            0F, 0F, 0F, 0F);

        ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan(client, "test ppo client plan", null, "PPO",
            952F, 1500F, 1340F, 1843F,
            9L, 7L, 4L, 3L,
            0F, 0F, 0F, 0F);

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "HMO option", "HMO");
        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "PPO option", "PPO");

        // set rate bank
        hmoNetwork.setDiscountPercent(10F);
        ppoNetwork.setDiscountPercent(10F);
        rfpQuoteNetworkRepository.save(hmoNetwork);
        rfpQuoteNetworkRepository.save(ppoNetwork);

        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork, 600f, 900f, 700f, 1100f, true);

        RfpQuoteNetworkPlan ppoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test ppo plan",
            ppoNetwork, 950f, 1450f, 1300f, 1800f, true);

        RfpQuoteOption standardOption1 = testEntityHelper.createTestRfpQuoteOption(stdQuote, "Option 1");

        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            hmoNetwork, hmoPlan, hmoClientPlan, 11L, 12L, 10L, 7L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            ppoNetwork, ppoPlan, ppoClientPlan, 9L, 7L, 4L, 3L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        flushAndClear();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/dashboard/client/{clientId}/rateBank/{quoteType}", client.getClientId(), QuoteType.STANDARD.name())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        ClientRateBankDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientRateBankDto.class);

        assertThat(dto.getCommunicationBudget()).isNull();
        assertThat(dto.getWellnessBudget()).isNull();
        assertThat(dto.getImplementationBudget()).isNull();

        assertThat(dto.getPEPY()).isEqualTo(1169.52F);
        assertThat(dto.getRateBankAmountRequested()).isEqualTo(73680.0F);
        assertThat(dto.getCostVsCurrent()).isEqualTo(-113004.0F);
        assertThat(dto.getTotalPremium()).isEqualTo(663120.0F);
        assertThat(dto.getCostVsCurrentPercentage()).isEqualTo(-14.56F);
        assertThat(dto.getCostVsRenewal()).isEqualTo(663120.0F);
        assertThat(dto.getCostVsRenewalPercentage()).isNull();
    }

    @Test
    public void test_getRateBankPageDetails_ppo_no_rate_bank() throws Exception {

        // create quote and medical option 1
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), ANTHEM_BLUE_CROSS.name());
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote stdQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);

        // create client plan
        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan(client, "test hmo client plan",null, "HMO",
            680F, 970F, 720F, 1200F,
            11L, 12L, 10L, 7L,
            0F, 0F, 0F, 0F);

        ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan(client, "test ppo client plan",null, "PPO",
            952F, 1500F, 1340F, 1843F,
            9L, 7L, 4L, 3L,
            0F, 0F, 0F, 0F);

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "HMO option", "HMO");
        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "PPO option", "PPO");

        // set rate bank
        hmoNetwork.setDiscountPercent(10F);
        rfpQuoteNetworkRepository.save(hmoNetwork);

        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork, 600f, 900f, 700f, 1100f, true);

        RfpQuoteNetworkPlan ppoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test ppo plan",
            ppoNetwork, 950f, 1450f, 1300f, 1800f, true);

        RfpQuoteOption standardOption1 = testEntityHelper.createTestRfpQuoteOption(stdQuote, "Option 1");

        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            hmoNetwork, hmoPlan, hmoClientPlan, 11L, 12L, 10L, 7L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            ppoNetwork, ppoPlan, ppoClientPlan, 9L, 7L, 4L, 3L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        flushAndClear();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/dashboard/client/{clientId}/rateBank/{quoteType}", client.getClientId(), QuoteType.STANDARD.name())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        ClientRateBankDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientRateBankDto.class);

        assertThat(dto.getCommunicationBudget()).isNull();
        assertThat(dto.getWellnessBudget()).isNull();
        assertThat(dto.getImplementationBudget()).isNull();

        assertThat(dto.getPEPY()).isEqualTo(6192.38F);
        assertThat(dto.getRateBankAmountRequested()).isEqualTo(390120.0F);
        assertThat(dto.getCostVsCurrent()).isEqualTo(-77844F);
        assertThat(dto.getTotalPremium()).isEqualTo(698280F);
        assertThat(dto.getCostVsCurrentPercentage()).isEqualTo(-10.03F);
        assertThat(dto.getCostVsRenewal()).isEqualTo(698280F);
        assertThat(dto.getCostVsRenewalPercentage()).isNull();
    }

    @Test
    public void test_getRateBankPageDetails_optimizer_client() throws Exception {

        // create quote and medical option 1
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), ANTHEM_BLUE_CROSS.name());
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote stdQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);

        // create client plan
        ClientPlan hsaClientPlan = testEntityHelper.createTestClientPlan(client, "test hsa client plan",null, "HSA",
            372.36F, 819.17F, 670.23F, 1154.25F,
            28L, 17L, 7L, 23L,
            420.39F, 924.84F, 756.69F, 1303.15F);

        RfpQuoteNetwork hsaNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "HSA option", "HSA");

        // set rate bank
        hsaNetwork.setDiscountPercent(10F);
        rfpQuoteNetworkRepository.save(hsaNetwork);

        RfpQuoteNetworkPlan hsaPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hsa plan",
            hsaNetwork, 410.83f, 903.83f, 739.49f, 1273.57f, true);

        RfpQuoteOption standardOption1 = testEntityHelper.createTestRfpQuoteOption(stdQuote, "Option 1");

        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            hsaNetwork, hsaPlan, hsaClientPlan, 28L, 17L, 7L, 23L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        flushAndClear();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/dashboard/client/{clientId}/rateBank/{quoteType}", client.getClientId(), QuoteType.STANDARD.name())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        ClientRateBankDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientRateBankDto.class);

        assertThat(dto.getCommunicationBudget()).isNull();
        assertThat(dto.getWellnessBudget()).isNull();
        assertThat(dto.getImplementationBudget()).isNull();

        assertThat(dto.getPEPY()).isEqualTo(981.390F);
        assertThat(dto.getRateBankAmountRequested()).isEqualTo(73604.31F);
        assertThat(dto.getCostVsCurrent()).isEqualTo(-4657.56F);
        assertThat(dto.getTotalPremium()).isEqualTo(662438.4F);
        assertThat(dto.getCostVsCurrentPercentage()).isEqualTo(-0.7F);
        assertThat(dto.getCostVsRenewal()).isEqualTo(-90711.38F); // need to update after float->double replacement fix
        assertThat(dto.getCostVsRenewalPercentage()).isEqualTo(-12.04F);
    }

    @Test
    public void test_getRateBankPageDetails_optimizer_client_2_alongside_kaiser_1() throws Exception {

        // create quote and medical option 1
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), ANTHEM_BLUE_CROSS.name());
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote stdQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.KAISER);

        // create client plan
        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan(client, "test hmo client plan", null, "HMO",
            680F, 970F, 720F, 1200F,
            11L, 12L, 10L, 7L,
            0F, 0F, 0F, 0F);

        ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan(client, "test ppo client plan",null, "PPO",
            952F, 1500F, 1340F, 1843F,
            9L, 7L, 4L, 3L,
            0F, 0F, 0F, 0F);

        ClientPlan kaiserHmoClientPlan = testEntityHelper.createTestClientPlan(client, "test hmo client plan", KAISER, "HMO",
            552F, 821F, 655F, 1009F,
            15L, 8L, 9L, 10L,
            0F, 0F, 0F, 0F);

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "HMO option", "HMO");
        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "PPO option", "PPO");

        // kaiser rfpQuoteNetwork
        Carrier kaiserCarrier = testEntityHelper.createTestCarrier(Constants.KAISER_CARRIER, "Kaiser");
        Network kaiserNetwork = testEntityHelper.createTestNetwork("Kaiser network", "HMO", kaiserCarrier);
        RfpQuoteNetwork kaiserQuoteNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, kaiserNetwork);

        // set rate bank
        hmoNetwork.setDiscountPercent(10F);
        ppoNetwork.setDiscountPercent(10F);
        rfpQuoteNetworkRepository.save(hmoNetwork);
        rfpQuoteNetworkRepository.save(kaiserQuoteNetwork);
        rfpQuoteNetworkRepository.save(ppoNetwork);

        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork, 600f, 900f, 700f, 1100f, true);

        RfpQuoteNetworkPlan ppoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test ppo plan",
            ppoNetwork, 950f, 1450f, 1300f, 1800f, true);

        RfpQuoteNetworkPlan kaiserPPOPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test kaiser hmo plan",
            kaiserQuoteNetwork, 584f, 891f, 572f, 1104f, true);

        RfpQuoteOption standardOption1 = testEntityHelper.createTestRfpQuoteOption(stdQuote, "Option 1");

        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            hmoNetwork, hmoPlan, hmoClientPlan, 11L, 12L, 10L, 7L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            ppoNetwork, ppoPlan, ppoClientPlan, 9L, 7L, 4L, 3L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        RfpQuoteOptionNetwork rqon3 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            kaiserQuoteNetwork, kaiserPPOPlan, kaiserHmoClientPlan, 15L, 8L, 9L, 10L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        flushAndClear();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/dashboard/client/{clientId}/rateBank/{quoteType}",
            client.getClientId(), QuoteType.KAISER.name())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        ClientRateBankDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientRateBankDto.class);

        assertThat(dto.getCommunicationBudget()).isNull();
        assertThat(dto.getWellnessBudget()).isNull();
        assertThat(dto.getImplementationBudget()).isNull();

        assertThat(dto.getPEPY()).isEqualTo(1169.52F);
        assertThat(dto.getRateBankAmountRequested()).isEqualTo(73680.0F);
        assertThat(dto.getCostVsCurrent()).isEqualTo(-113004.0F);
        assertThat(dto.getTotalPremium()).isEqualTo(663120.0F);
        assertThat(dto.getCostVsCurrentPercentage()).isEqualTo(-14.56F);
        assertThat(dto.getCostVsRenewal()).isEqualTo(663120.0F);
        assertThat(dto.getCostVsRenewalPercentage()).isNull();

        for(ClientRateBankDto.RateBankPlanDto plan : dto.getPlans()){
            if(plan.getPlanName().equals("test hmo plan on HMO option")){
                assertPlanInfo(plan, 10.0F, true, false,
                    false, 40L, -5830.0F, -16.8F,
                    28890.0F, 100.0F);
            }else if(plan.getPlanName().equals("test ppo plan on PPO option")){
                assertPlanInfo(plan, 10.0F, true, false,
                    false, 23L, -3587.0F, -12.0F,
                    26370.0F, 100.0F);
            }else if(plan.getPlanName().equals("test kaiser hmo plan on Kaiser network")){
                assertPlanInfo(plan, null, false, true,
                    false, 42L, null, null,
                    null, null);
            }
        }
    }

    /**
     * Gotten from https://app.asana.com/0/391058210043498/625327034385418
     * @throws Exception
     */
    @Test
    public void test_getRateBankPageDetails_optimizer_client_2_alongside_kaiser() throws Exception {

        // create quote and medical option 1
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), ANTHEM_BLUE_CROSS.name());
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote stdQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.KAISER);

        // create client plan
        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan(client, "test hmo client plan", null, "HMO",
            414.00F, 912F, 788F, 1284F,
            25L, 1L, 6L, 4L,
            556F, 984F, 849F, 1384F);

        ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan(client, "test ppo client plan",null, "PPO",
            596F, 1311F, 1133F, 1846F,
            16L, 0L, 3L, 3L,
            643F, 1414F, 1222F, 1991F);

        ClientPlan kaiserHmoClientPlan = testEntityHelper.createTestClientPlan(client, "test hmo client plan", KAISER, "HMO",
            431F, 990F, 818F, 1305F,
            31L, 1L, 1L, 1L,
            779.82F, 779.82F, 779.82F, 779.82F);

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "HMO option", "HMO");
        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "PPO option", "PPO");

        // kaiser rfpQuoteNetwork
        Carrier kaiserCarrier = testEntityHelper.createTestCarrier(Constants.KAISER_CARRIER, "Kaiser");
        Network kaiserNetwork = testEntityHelper.createTestNetwork("Kaiser network", "HMO", kaiserCarrier);
        RfpQuoteNetwork kaiserQuoteNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, kaiserNetwork);

        // set rate bank
        hmoNetwork.setDiscountPercent(15F);
        ppoNetwork.setDiscountPercent(22F);
        rfpQuoteNetworkRepository.save(hmoNetwork);
        rfpQuoteNetworkRepository.save(kaiserQuoteNetwork);

        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork, 410.10f, 902.22f, 738.18f, 1271.32f, true);

        RfpQuoteNetworkPlan ppoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test ppo plan",
            ppoNetwork, 922.73f, 2030.01f, 1660.91f, 2860.46f, true);

        RfpQuoteNetworkPlan kaiserPPOPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test kaiser ppo plan",
            kaiserQuoteNetwork, 612.12f, 1346.66f, 1101.82f, 1897.57f, true);

        RfpQuoteOption standardOption1 = testEntityHelper.createTestRfpQuoteOption(stdQuote, "Option 1");

        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            hmoNetwork, hmoPlan, hmoClientPlan, 25L, 1L, 6L, 4L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            ppoNetwork, ppoPlan, ppoClientPlan, 16L, 0L, 3L, 3L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        RfpQuoteOptionNetwork rqon3 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            kaiserQuoteNetwork, kaiserPPOPlan, kaiserHmoClientPlan, 31L, 1L, 1L, 1L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        flushAndClear();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/dashboard/client/{clientId}/rateBank/{quoteType}",
            client.getClientId(), QuoteType.KAISER.name())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        ClientRateBankDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientRateBankDto.class);

        assertThat(dto.getCommunicationBudget()).isNull();
        assertThat(dto.getWellnessBudget()).isNull();
        assertThat(dto.getImplementationBudget()).isNull();

        assertThat(dto.getPEPY()).isEqualTo(1930.86F);
        assertThat(dto.getRateBankAmountRequested()).isEqualTo(111989.69F);
        assertThat(dto.getCostVsCurrent()).isEqualTo(784.69F);
        assertThat(dto.getTotalPremium()).isEqualTo(475972.7F);
        assertThat(dto.getCostVsCurrentPercentage()).isEqualTo(0.17F);
        assertThat(dto.getCostVsRenewal()).isEqualTo(-69319.31F);
        assertThat(dto.getCostVsRenewalPercentage()).isEqualTo(-12.71F);

        for(ClientRateBankDto.RateBankPlanDto plan : dto.getPlans()){
            if(plan.getPlanName().equals("test hmo plan on HMO option")){
                assertPlanInfo(plan, 15.0F, true, false,
                    false, 36L, -3557.2812F, -16.8F,
                    -7945.2812F, -31.1F);
            }else if(plan.getPlanName().equals("test ppo plan on PPO option")){
                assertPlanInfo(plan, 22.0F, true, false,
                    false, 22L, 3622.6738F, 19.6F,
                    2168.6738F, 10.9F);
            }else if(plan.getPlanName().equals("test kaiser ppo plan on Kaiser network")){
                assertPlanInfo(plan, null, false, true,
                    false, 34L, null, null,
                    null, null);
            }
        }
    }

    /**
     * Gotten from https://app.asana.com/0/391058210043498/625327034385418
     * @throws Exception
     */
    @Test
    public void test_getRateBankPageDetails_optimizer_client_2_full_takeover() throws Exception {

        // create quote and medical option 1
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), ANTHEM_BLUE_CROSS.name());
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote stdQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);

        // create client plan
        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan(client, "test hmo client plan", null, "HMO",
            414.00F, 912F, 788F, 1284F,
            25L, 1L, 6L, 4L,
            556F, 984F, 849F, 1384F);

        ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan(client, "test ppo client plan",null, "PPO",
            596F, 1311F, 1133F, 1846F,
            16L, 0L, 3L, 3L,
            643F, 1414F, 1222F, 1991F);

        ClientPlan kaiserHmoClientPlan = testEntityHelper.createTestClientPlan(client, "test hmo client plan", null, "HMO",
            431F, 990F, 818F, 1305F,
            31L, 1L, 1L, 1L,
            463.00F, 1066F, 881F, 1404F);

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "HMO option", "HMO");
        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "PPO option", "PPO");

        // set rate bank
        hmoNetwork.setDiscountPercent(15F);
        ppoNetwork.setDiscountPercent(22F);
        rfpQuoteNetworkRepository.save(hmoNetwork);
        rfpQuoteNetworkRepository.save(ppoNetwork);

        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan 1",
            hmoNetwork, 410.10f, 902.22f, 738.18f, 1271.32f, true);

        RfpQuoteNetworkPlan ppoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test ppo plan 2",
            ppoNetwork, 922.73f, 2030.01f, 1660.91f, 2860.46f, true);

        RfpQuoteNetworkPlan kaiserHMOPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test kaiser replacement hmo plan",
            hmoNetwork, 612.12F, 1346.66F, 1101.82F, 1897.57F, true);

        RfpQuoteOption standardOption1 = testEntityHelper.createTestRfpQuoteOption(stdQuote, "Option 1");

        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            hmoNetwork, hmoPlan, hmoClientPlan, 25L, 1L, 6L, 4L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            ppoNetwork, ppoPlan, ppoClientPlan, 16L, 0L, 3L, 3L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        RfpQuoteOptionNetwork rqon3 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            hmoNetwork, kaiserHMOPlan, kaiserHmoClientPlan, 31L, 1L, 1L, 1L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        flushAndClear();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/dashboard/client/{clientId}/rateBank/{quoteType}",
            client.getClientId(), QuoteType.STANDARD.name())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        ClientRateBankDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientRateBankDto.class);

        assertThat(dto.getCommunicationBudget()).isNull();
        assertThat(dto.getWellnessBudget()).isNull();
        assertThat(dto.getImplementationBudget()).isNull();

        assertThat(dto.getPEPY()).isEqualTo(1673.58F);
        assertThat(dto.getRateBankAmountRequested()).isEqualTo(153968.94F);
        assertThat(dto.getCostVsCurrent()).isEqualTo(40978.75F);
        assertThat(dto.getTotalPremium()).isEqualTo(713854.75F);
        assertThat(dto.getCostVsCurrentPercentage()).isEqualTo(6.09F);
        assertThat(dto.getCostVsRenewal()).isEqualTo(-43885.25F);
        assertThat(dto.getCostVsRenewalPercentage()).isEqualTo(-5.79F);

        for(ClientRateBankDto.RateBankPlanDto plan : dto.getPlans()){
            if(plan.getPlanName().equals("test hmo plan 1 on HMO option")){
                assertPlanInfo(plan, 15.0F, true, false,
                    false, 36L, -3557.2812F, -16.8F,
                    -7945.2812F, -31.1F);
            }else if(plan.getPlanName().equals("test ppo plan 2 on PPO option")){
                assertPlanInfo(plan, 22.0F, true, false,
                    false, 22L, 3622.6738F, 19.6F,
                    2168.6738F, 10.9F);
            }else if(plan.getPlanName().equals("test kaiser replacement hmo plan on HMO option")){
                assertPlanInfo(plan, 15.0F, true, false,
                    false, 34L, 3349.504F, 20.3F,
                    2119.504F, 12.0F);
            }
        }
    }

    private void assertPlanInfo(ClientRateBankDto.RateBankPlanDto plan, Float networkRateBank,
        boolean isRateBankApplied, boolean isKaiserNetwork, boolean outOfState, Long enrollment,
        Float dollarDifference, Float percentDifference, Float renewalDifference,
        Float renewalPercentDifference){

        assertThat(plan.getNetworkRateBank()).isEqualTo(networkRateBank);
        assertThat(plan.isRateBankApplied()).isEqualTo(isRateBankApplied);
        assertThat(plan.isKaiserNetwork()).isEqualTo(isKaiserNetwork);
        assertThat(plan.isOutOfState()).isEqualTo(outOfState);
        assertThat(plan.getEnrollment()).isEqualTo(enrollment);
        assertThat(plan.getDollarDifference()).isEqualTo(dollarDifference);
        assertThat(plan.getPercentDifference()).isEqualTo(percentDifference);
        assertThat(plan.getRenewalDollarDifference()).isEqualTo(renewalDifference);
        assertThat(plan.getRenewalPercentDifference()).isEqualTo(renewalPercentDifference);
    }
}
