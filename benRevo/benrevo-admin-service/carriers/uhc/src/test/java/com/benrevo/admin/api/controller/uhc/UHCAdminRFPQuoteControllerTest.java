package com.benrevo.admin.api.controller.uhc;


import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.benrevo.admin.UHCAdminServiceApplication;
import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.UseTestProperties;
import com.benrevo.common.dto.CreateOption1Dto;
import com.benrevo.common.dto.PlanDifferenceDto;
import com.benrevo.common.dto.PlanDifferenceDto.DifferenceItem;
import com.benrevo.common.dto.QuoteOptionNameToMatchingPlan;
import com.benrevo.common.dto.RfpQuoteDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.google.common.collect.ImmutableMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class UHCAdminRFPQuoteControllerTest extends AdminAbstractControllerTest {

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Test
    public void testCreateOption1_defaultAdmFee() throws Exception {
        Client client = testEntityHelper.createTestClient();

        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan("test hmo client plan", client, CarrierType.UHC.name(), "HMO");
        ClientPlan hsaClientPlan = testEntityHelper.createTestClientPlan("test hsa client plan", client, CarrierType.UHC.name(), "HSA");

        Map<String, String> defaultFeeByCarrier = new HashMap<>();
        defaultFeeByCarrier.put(CarrierType.UHC.name(), Constants.DEFAULT_ADMINISTRATIVE_FEE_UHC);
        defaultFeeByCarrier.put(CarrierType.CIGNA.name(), null);

        for (Entry<String, String> entry : defaultFeeByCarrier.entrySet()) {
            final String carrierName = entry.getKey();
            final String defaultAdmFeeName = entry.getValue();

            Carrier carrier = testEntityHelper.createTestCarrier(carrierName, carrierName);
            RfpCarrier rfpMedicalCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
            RfpSubmission rfpMedicalSubmission = testEntityHelper.createTestRfpSubmission(client, rfpMedicalCarrier);

            RfpQuote quote = testEntityHelper.createTestRfpQuote(rfpMedicalSubmission, QuoteType.STANDARD);

            RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
            RfpQuoteNetwork hsaNetwork = testEntityHelper.createTestQuoteNetwork(quote, "HSA option", "HSA");

            rfpQuoteRepository.save(quote);

            RfpQuoteNetworkPlan p1 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan", hmoNetwork, 0f, 0f, 0f, 0f, true);
            testEntityHelper.createTestRfpQuoteNetworkRxPlan("test rx hmo plan", hmoNetwork, 0f, 0f, 0f, 0f, true);

            RfpQuoteNetworkPlan p2 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hsa plan", hsaNetwork, 0f, 0f, 0f, 0f, true);
            testEntityHelper.createTestRfpQuoteNetworkRxPlan("test rx hsa plan", hsaNetwork, 0f, 0f, 0f, 0f, true);

            CreateOption1Dto dto = new CreateOption1Dto();
            dto.setCategory(Constants.MEDICAL);
            dto.setRfpQuoteId(quote.getRfpQuoteId());
            dto.setOptionType(OptionType.OPTION);

            QuoteOptionNameToMatchingPlan hmoMatching = new QuoteOptionNameToMatchingPlan();
            hmoMatching.setPnnId(p1.getPnn().getPnnId());
            hmoMatching.setQuoteOptionName("HMO option");

            QuoteOptionNameToMatchingPlan hsaMatching = new QuoteOptionNameToMatchingPlan();
            hsaMatching.setPnnId(p2.getPnn().getPnnId());
            hsaMatching.setQuoteOptionName("HSA option");

            dto.setClientPlanToNetwork(ImmutableMap.of(hmoClientPlan.getClientPlanId(), hmoMatching,
                hsaClientPlan.getClientPlanId(), hsaMatching));

            flushAndClear();

            MvcResult result = performPostAndAssertResult(jsonUtils.toJson(dto), null, "/admin/createOption");

            flushAndClear();

            Long createdOptionId = jsonUtils.fromJson(result.getResponse().getContentAsString(), Long.class);

            RfpQuoteOption quoteOption = rfpQuoteOptionRepository.findOne(createdOptionId);

            assertThat(quoteOption).isNotNull();
            assertThat(quoteOption.getRfpQuoteOptionNetworks()).hasSize(2);
            for (RfpQuoteOptionNetwork rqon : quoteOption.getRfpQuoteOptionNetworks()) {
                if (!rqon.getRfpQuoteNetwork().getNetwork().getType().equals("HSA")
                    || carrierName.equals(CarrierType.CIGNA.name())) { // CIGNA has no default fees
                    assertThat(rqon.getAdministrativeFee()).isNull();
                } else {
                    assertThat(rqon.getAdministrativeFee()).isNotNull();
                    assertThat(rqon.getAdministrativeFee().getName()).isEqualTo(defaultAdmFeeName);
                }
            }
        }
    }

    @Test
    public void testCreateOption1_GroupsValidation() throws Exception {
        Client client = testEntityHelper.createTestClient();

        ClientPlan hmoClientPlan1 = testEntityHelper.createTestClientPlan(client, "HMO");
        ClientPlan hmoClientPlan2 = testEntityHelper.createTestClientPlan(client, "HMO");

        RfpQuote quote = testEntityHelper.createTestRfpQuote();


        RfpQuoteNetwork hmoNetwork1 = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetworkPlan p1 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan", hmoNetwork1, 0f, 0f, 0f, 0f, true);
        RfpQuoteNetworkPlan p2 = testEntityHelper.createTestRfpQuoteNetworkRxPlan("test rx hmo plan", hmoNetwork1, 0f, 0f, 0f, 0f, true);

        rfpQuoteRepository.save(quote);

        CreateOption1Dto dto = new CreateOption1Dto();
        dto.setCategory(Constants.MEDICAL);
        dto.setRfpQuoteId(quote.getRfpQuoteId());
        dto.setOptionType(OptionType.OPTION);

        QuoteOptionNameToMatchingPlan hmoMatching1 = new QuoteOptionNameToMatchingPlan();
        hmoMatching1.setPnnId(p1.getPnn().getPnnId());
        hmoMatching1.setQuoteOptionName("HMO option");
        hmoMatching1.setNetworkGroup("A");

        QuoteOptionNameToMatchingPlan hmoMatching2 = new QuoteOptionNameToMatchingPlan();
        hmoMatching2.setPnnId(p1.getPnn().getPnnId());
        hmoMatching2.setQuoteOptionName("HMO option");
        hmoMatching2.setNetworkGroup("B");

        dto.setClientPlanToNetwork(ImmutableMap.of(
            hmoClientPlan1.getClientPlanId(), hmoMatching1,
            hmoClientPlan2.getClientPlanId(), hmoMatching2));

        flushAndClear();

        mockMvc.perform(MockMvcRequestBuilders.post("/admin/createOption")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(jsonUtils.toJson(dto))
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andReturn();

        hmoMatching2.setPnnId(2L);
        hmoMatching2.setNetworkGroup("A");

        mockMvc.perform(MockMvcRequestBuilders.post("/admin/createOption")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(jsonUtils.toJson(dto))
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is5xxServerError())
            .andExpect(jsonPath("$.message").value("Option Network HMO option should have the same Match Plan"))
            .andReturn();

    }

    @Test
    public void testCreateOption1WithPlanId() throws Exception {
        Client client = testEntityHelper.createTestClient();

        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan("test hmo client plan", client, CarrierType.UHC.name(), "HMO");
        ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan("test ppo client plan", client, CarrierType.UHC.name(), "PPO");

        RfpQuote quote = testEntityHelper.createTestRfpQuote();

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "PPO option", "PPO");

        RfpQuoteNetworkPlan hmo1 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan1", hmoNetwork, 0f, 0f, 0f, 0f, true);
        RfpQuoteNetworkPlan hmo2 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan2", hmoNetwork, 0f, 0f, 0f, 0f, false);
        
        testEntityHelper.createTestRfpQuoteNetworkRxPlan("test rx hmo plan", hmoNetwork, 0f, 0f, 0f, 0f, true);

        RfpQuoteNetworkPlan ppo1 = testEntityHelper.createTestRfpQuoteNetworkPlan("test ppo plan", ppoNetwork, 0f, 0f, 0f, 0f, true);
        testEntityHelper.createTestRfpQuoteNetworkRxPlan("test rx ppo plan", ppoNetwork, 0f, 0f, 0f, 0f, true);

        CreateOption1Dto dto = new CreateOption1Dto();
        dto.setCategory(Constants.MEDICAL);
        dto.setRfpQuoteId(quote.getRfpQuoteId());
        dto.setOptionType(OptionType.OPTION);

        QuoteOptionNameToMatchingPlan hmoMatching = new QuoteOptionNameToMatchingPlan();
        hmoMatching.setPnnId(hmo2.getPnn().getPnnId());
        hmoMatching.setQuoteOptionName("HMO option");

        QuoteOptionNameToMatchingPlan ppoMatching = new QuoteOptionNameToMatchingPlan();
        ppoMatching.setQuoteOptionName("PPO option");

        dto.setClientPlanToNetwork(ImmutableMap.of(hmoClientPlan.getClientPlanId(), hmoMatching, ppoClientPlan.getClientPlanId(), ppoMatching));

        flushAndClear();

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(dto), null, "/admin/createOption");

        flushAndClear();

        Long createdOptionId = jsonUtils.fromJson(result.getResponse().getContentAsString(), Long.class);

        RfpQuoteOption quoteOption = rfpQuoteOptionRepository.findOne(createdOptionId);

        assertThat(quoteOption).isNotNull();
        assertThat(quoteOption.getRfpQuoteOptionNetworks()).hasSize(2);
        RfpQuoteOptionNetwork hmoOptionNetwork = quoteOption.getRfpQuoteOptionNetworks()
            .stream()
            .filter(rqon -> hmoClientPlan.getClientPlanId().equals(rqon.getClientPlan().getClientPlanId()))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("hmoOptionNetwork not found"));
        
        assertThat(hmoOptionNetwork.getSelectedRfpQuoteNetworkPlan().getPnn().getPnnId()).isEqualTo(hmo2.getPnn().getPnnId());

    }

    @Test
    public void testCreateOption1() throws Exception {
        Client client = testEntityHelper.createTestClient();

        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan("test hmo client plan", client, CarrierType.UHC.name(), "HMO");
        ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan("test ppo client plan", client, CarrierType.UHC.name(), "PPO");

        RfpQuote quote = testEntityHelper.createTestRfpQuote();

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "PPO option", "PPO");

        Rider rider1 = testEntityHelper.createTestRider("test rider1 code", 1F, 1F, 1F, 1F);
        rider1.setMatch(true);
        hmoNetwork.getRiders().add(rider1);
        Rider rider2 = testEntityHelper.createTestRider("test rider2 code", 1F, 1F, 1F, 1F);
        hmoNetwork.getRiders().add(rider2);

        RfpQuoteNetworkPlan p1 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan", hmoNetwork, 0f, 0f, 0f, 0f, true);
        testEntityHelper.createTestRfpQuoteNetworkRxPlan("test rx hmo plan", hmoNetwork, 0f, 0f, 0f, 0f, true);

        RfpQuoteNetworkPlan p2 = testEntityHelper.createTestRfpQuoteNetworkPlan("test ppo plan", ppoNetwork, 0f, 0f, 0f, 0f, true);
        testEntityHelper.createTestRfpQuoteNetworkRxPlan("test rx ppo plan", ppoNetwork, 0f, 0f, 0f, 0f, true);

        CreateOption1Dto dto = new CreateOption1Dto();
        dto.setCategory(Constants.MEDICAL);
        dto.setRfpQuoteId(quote.getRfpQuoteId());
        dto.setOptionType(OptionType.OPTION);

        QuoteOptionNameToMatchingPlan hmoMatching = new QuoteOptionNameToMatchingPlan();
        hmoMatching.setPnnId(p1.getPnn().getPnnId());
        hmoMatching.setQuoteOptionName("HMO option");
        hmoMatching.setNetworkGroup("A");

        QuoteOptionNameToMatchingPlan ppoMatching = new QuoteOptionNameToMatchingPlan();
        ppoMatching.setPnnId(p2.getPnn().getPnnId());
        ppoMatching.setQuoteOptionName("PPO option");
        ppoMatching.setNetworkGroup("B");

        dto.setClientPlanToNetwork(ImmutableMap.of(hmoClientPlan.getClientPlanId(), hmoMatching, ppoClientPlan.getClientPlanId(), ppoMatching));

        flushAndClear();

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(dto), null, "/admin/createOption");

        flushAndClear();

        Long createdOptionId = jsonUtils.fromJson(result.getResponse().getContentAsString(), Long.class);

        RfpQuoteOption quoteOption = rfpQuoteOptionRepository.findOne(createdOptionId);

        assertThat(quoteOption).isNotNull();
        assertThat(quoteOption.getRfpQuoteOptionNetworks()).hasSize(2);
        RfpQuoteOptionNetwork hmoOptionNetwork;
        if (hmoClientPlan.getClientPlanId().equals(quoteOption.getRfpQuoteOptionNetworks().get(0).getClientPlan().getClientPlanId())) {
            hmoOptionNetwork = quoteOption.getRfpQuoteOptionNetworks().get(0);
        } else if (hmoClientPlan.getClientPlanId().equals(quoteOption.getRfpQuoteOptionNetworks().get(1).getClientPlan().getClientPlanId())) {
            hmoOptionNetwork = quoteOption.getRfpQuoteOptionNetworks().get(1);
        } else {
            throw new RuntimeException("hmoOptionNetwork not found");
        }
        assertThat(hmoOptionNetwork.getTier1Census()).isEqualTo(hmoClientPlan.getTier1Census());
        assertThat(hmoOptionNetwork.getTier2Census()).isEqualTo(hmoClientPlan.getTier2Census());
        assertThat(hmoOptionNetwork.getTier3Census()).isEqualTo(hmoClientPlan.getTier3Census());
        assertThat(hmoOptionNetwork.getTier4Census()).isEqualTo(hmoClientPlan.getTier4Census());
        assertThat(hmoOptionNetwork.getNetworkGroup()).isEqualTo(hmoMatching.getNetworkGroup());

        dto.setClientPlanToNetwork(ImmutableMap.of(hmoClientPlan.getClientPlanId(), hmoMatching));
        performPostAndAssertResult(jsonUtils.toJson(dto), null, "/admin/createOption");

        flushAndClear();

        quoteOption = rfpQuoteOptionRepository.findOne(createdOptionId);

        assertThat(quoteOption).isNotNull();
        assertThat(quoteOption.getRfpQuoteOptionNetworks()).hasSize(1);

        assertThat(hmoOptionNetwork.getRfpQuoteNetwork().getRiders()).hasSize(2);
        assertThat(hmoOptionNetwork.getSelectedRiders()).hasSize(1);
        assertThat(hmoOptionNetwork.getSelectedRiders().iterator().next().getRiderId()).isEqualTo(rider1.getRiderId());

        
    }

    @Test
    public void testCopyOverRenewal2() throws Exception {
        Client client = testEntityHelper.createTestClient();

        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan("test hmo client plan", client, CarrierType.UHC.name(), "HMO");
        RfpQuote quote = testEntityHelper.createTestRfpQuote();
        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan", hmoNetwork, 0f, 0f, 0f, 0f, true);
        testEntityHelper.createTestRfpQuoteNetworkRxPlan("test rx hmo plan", hmoNetwork, 0f, 0f, 0f, 0f, true);

        RfpQuoteOption renewal1 = testEntityHelper.createTestRfpQuoteOption(quote, "Renewal 1");
        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(renewal1,
            hmoNetwork, hmoPlan, hmoClientPlan, 9L, 7L, 4L, 3L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        RfpQuoteOption renewal2 = testEntityHelper.createTestRfpQuoteOption(quote, "Renewal 2");
        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(renewal2,
            hmoNetwork, hmoPlan, hmoClientPlan, 9L, 7L, 4L, 3L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        
        CreateOption1Dto dto = new CreateOption1Dto();
        dto.setCategory(Constants.MEDICAL);
        dto.setRfpQuoteId(quote.getRfpQuoteId());
        dto.setOptionType(OptionType.RENEWAL);

        QuoteOptionNameToMatchingPlan hmoMatching = new QuoteOptionNameToMatchingPlan();
        hmoMatching.setPnnId(hmoPlan.getPnn().getPnnId());
        hmoMatching.setQuoteOptionName("HMO option");
        hmoMatching.setNetworkGroup("A");

        dto.setClientPlanToNetwork(ImmutableMap.of(
                hmoClientPlan.getClientPlanId(), hmoMatching));

        flushAndClear();

        performPostAndAssertResult(jsonUtils.toJson(dto), null, "/admin/createOption");

        flushAndClear();
        
        List<RfpQuoteOption> quoteOptions = rfpQuoteOptionRepository.findByRfpQuoteRfpQuoteId(quote.getRfpQuoteId());

        assertThat(quoteOptions).extracting(o->o.getRfpQuoteOptionName()).containsExactlyInAnyOrder("Renewal 1","Renewal 2");
        
        for (RfpQuoteOption o : quoteOptions) {
            assertThat(o.getRfpQuoteOptionNetworks())
                .as("Option name=%s", o.getRfpQuoteOptionName())
                .hasSize(1);
            RfpQuoteOptionNetwork rqon = o.getRfpQuoteOptionNetworks().get(0);
            assertThat(rqon.getErContributionFormat())
                .as("Option name=%s", o.getRfpQuoteOptionName())
                .isEqualTo(hmoClientPlan.getErContributionFormat());
            assertThat(rqon.getTier1ErContribution())
                .as("Option name=%s", o.getRfpQuoteOptionName())
                .isEqualTo(hmoClientPlan.getTier1ErContribution());
            assertThat(rqon.getTier2ErContribution())
                .as("Option name=%s", o.getRfpQuoteOptionName())
                .isEqualTo(hmoClientPlan.getTier2ErContribution());
            assertThat(rqon.getTier3ErContribution())
                .as("Option name=%s", o.getRfpQuoteOptionName())
                .isEqualTo(hmoClientPlan.getTier3ErContribution());
            assertThat(rqon.getTier4ErContribution())
                .as("Option name=%s", o.getRfpQuoteOptionName())
                .isEqualTo(hmoClientPlan.getTier4ErContribution());
        }
    }

    
    @Test
    public void testPlanDifferences() throws Exception {
        Client client = testEntityHelper.createTestClient();

        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.UHC.name(), CarrierType.UHC.name());
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote stdQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);
        RfpQuote kaiserQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.KAISER);

        ClientPlan hmoClientPlan =  testEntityHelper.createTestClientPlan("test hmo client plan", client, CarrierType.UHC.name(), "HMO");
        ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan("test ppo client plan", client, CarrierType.UHC.name(), "PPO");
        ClientPlan hsaClientPlan = testEntityHelper.createTestClientPlan("test hsa client plan", client, CarrierType.UHC.name(), "HSA");
        ClientPlan hsaClientPlan2 = testEntityHelper.createTestClientPlan("test hsa client plan 2", client, CarrierType.UHC.name(), "HSA");

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "HMO option", "HMO");
        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "PPO option", "PPO");
        RfpQuoteNetwork hsaNetwork = testEntityHelper.createTestQuoteNetwork(kaiserQuote, "HSA option", "HSA");

        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan", hmoNetwork, 1f, 2f, 3f, 4f, true);
        RfpQuoteNetworkPlan ppoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test ppo plan", ppoNetwork, 1.1f, 2.2f, 3.3f, 4.4f, true);
        RfpQuoteNetworkPlan hsaPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hsa plan", hsaNetwork, 0.9f, 1.8f, 2.7f, 3.6f, true);

        RfpQuoteOption standardOption1 = testEntityHelper.createTestRfpQuoteOption(stdQuote, "Option 1");
        RfpQuoteOption kaiserOption1 = testEntityHelper.createTestRfpQuoteOption(kaiserQuote, "Option 1");

        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1, hmoNetwork, hmoPlan, hmoClientPlan, 1L, 2L, 3L, 4L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 1f, 2f, 3f, 4f);
        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1, ppoNetwork, ppoPlan, ppoClientPlan, 1L, 2L, 3L, 4L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 1f, 2f, 3f, 4f);
        RfpQuoteOptionNetwork rqon3 = testEntityHelper.createTestRfpQuoteOptionNetwork(kaiserOption1, hsaNetwork, hsaPlan, hsaClientPlan, 1L, 2L, 3L, 4L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 1f, 2f, 3f, 4f);
        RfpQuoteOptionNetwork rqon4 = testEntityHelper.createTestRfpQuoteOptionNetwork(kaiserOption1, hsaNetwork, null, hsaClientPlan2, 1L, 2L, 3L, 4L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 1f, 2f, 3f, 4f);

        flushAndClear();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/planDifferences")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .param("clientId", client.getClientId().toString())
            .param("optionType", OptionType.OPTION.name())
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        PlanDifferenceDto[] planDifferenceList = jsonUtils.fromJson(result.getResponse().getContentAsString(), PlanDifferenceDto[].class);

        assertThat(planDifferenceList).hasSize(2);
        for (PlanDifferenceDto planDifferenceDto : planDifferenceList) {
            if (planDifferenceDto.getQuoteType().equals(QuoteType.STANDARD)) {
                assertThat(planDifferenceDto.getPlans()).hasSize(4);
                for (DifferenceItem plan : planDifferenceDto.getPlans()) {
                    if (plan.getCurrentPlanName().equals(hmoClientPlan.getPnn().getName())) {
                        assertThat(plan.getMatchPlanName()).isEqualTo(rqon1.getSelectedRfpQuoteNetworkPlan().getPnn().getName());
                        assertThat(plan).hasNoNullFieldsOrProperties();
                    } else if (plan.getCurrentPlanName().equals(ppoClientPlan.getPnn().getName())) {
                        assertThat(plan.getMatchPlanName()).isEqualTo(rqon2.getSelectedRfpQuoteNetworkPlan().getPnn().getName());
                        assertThat(plan).hasNoNullFieldsOrProperties();
                    } else if (plan.getCurrentPlanName().equals(hsaClientPlan.getPnn().getName())) {
                        assertThat(plan.getMatchPlanName()).isNull();
                    } else if (plan.getCurrentPlanName().equals(hsaClientPlan2.getPnn().getName())) {
                        assertThat(plan.getCurrentPlanName()).isEqualTo(hsaClientPlan2.getPnn().getName());
                        assertThat(plan.getMatchPlanName()).isNull();
                    }
                }
            } else {
                assertThat(planDifferenceDto.getQuoteType()).isEqualTo(QuoteType.KAISER);
                assertThat(planDifferenceDto.getPlans()).hasSize(4);
                for (DifferenceItem plan : planDifferenceDto.getPlans()) {
                    if (plan.getCurrentPlanName().equals(hmoClientPlan.getPnn().getName())) {
                        assertThat(plan.getMatchPlanName()).isNull();
                    } else if (plan.getCurrentPlanName().equals(ppoClientPlan.getPnn().getName())) {
                        assertThat(plan.getMatchPlanName()).isNull();
                    } else if (plan.getCurrentPlanName().equals(hsaClientPlan.getPnn().getName())) {
                        assertThat(plan.getMatchPlanName()).isEqualTo(rqon3.getSelectedRfpQuoteNetworkPlan().getPnn().getName());
                        assertThat(plan).hasNoNullFieldsOrProperties();
                    } else if (plan.getCurrentPlanName().equals(hsaClientPlan2.getPnn().getName())) {
                        assertThat(plan.getMatchPlanName()).isNull();
                    }
                }
            }
        }
    }

    @Test
    public void testGetLatestQuotes() throws Exception {

        RfpQuote quote = testEntityHelper.createTestRfpQuote();

        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan(quote.getRfpSubmission().getClient(), "HMO");
        ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan(quote.getRfpSubmission().getClient(), "PPO");

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "PPO option", "PPO");

        rfpQuoteRepository.save(quote);

        testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan", hmoNetwork, 0f, 0f, 0f, 0f, true);
        testEntityHelper.createTestRfpQuoteNetworkRxPlan("test rx hmo plan", hmoNetwork, 0f, 0f, 0f, 0f, true);

        testEntityHelper.createTestRfpQuoteNetworkPlan("test ppo plan", ppoNetwork, 0f, 0f, 0f, 0f, true);
        testEntityHelper.createTestRfpQuoteNetworkRxPlan("test rx ppo plan", ppoNetwork, 0f, 0f, 0f, 0f, true);

        flushAndClear();

        MvcResult result = performGetAndAssertResult(null, "/admin/getLatestQuotes/{clientId}/{carrierName}/{optonType}",
            quote.getRfpSubmission().getClient().getClientId(),
            quote.getRfpSubmission().getRfpCarrier().getCarrier().getName(),
            OptionType.OPTION.name()
        );

        RfpQuoteDto[] rfpQuoteDtoList = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class);

        assertThat(rfpQuoteDtoList).isNotNull();
        assertThat(rfpQuoteDtoList).hasSize(1);

    }

}
