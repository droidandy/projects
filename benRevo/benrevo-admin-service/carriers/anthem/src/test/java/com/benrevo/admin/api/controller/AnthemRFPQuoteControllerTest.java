package com.benrevo.admin.api.controller;

import com.benrevo.admin.AnthemAdminServiceApplication;
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
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.google.common.collect.ImmutableMap;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class AnthemRFPQuoteControllerTest extends AdminAbstractControllerTest {

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Test
    public void testCreateOption1_defaultAdmFee() throws Exception {
        Client client = testEntityHelper.createTestClient();
        
        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan(client, "samplePlanName", "HMO");
        ClientPlan hsaClientPlan = testEntityHelper.createTestClientPlan(client, "samplePlanName","HSA");

		Map<String, String> defaultFeeByCarrier = new HashMap<>();
		defaultFeeByCarrier.put(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_BLUE_CROSS);
		defaultFeeByCarrier.put(CarrierType.ANTHEM_CLEAR_VALUE.name(), Constants.DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_CLEAR_VALUE);
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
    public void testCreateOption1() throws Exception {
        Client client = testEntityHelper.createTestClient();

        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan(client, "samplePlanName","HMO");
        ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan(client, "samplePlanName","PPO");

        RfpQuote quote = testEntityHelper.createTestRfpQuote();

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "PPO option", "PPO");

        rfpQuoteRepository.save(quote);

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
    }
    
    @Test
    public void testPlanDifferences() throws Exception {
      Client client = testEntityHelper.createTestClient();
      
      Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.UHC.name(), CarrierType.UHC.name());
      RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
      RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);
      
      RfpQuote stdQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);
      RfpQuote kaiserQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.KAISER);

      ClientPlan hmoClientPlan =  testEntityHelper.createTestClientPlan(client, "test hmo client plan", "HMO");
      ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan(client, "test ppo client plan", "PPO");
      ClientPlan hsaClientPlan = testEntityHelper.createTestClientPlan(client, "test hsa client plan", "HSA");
      ClientPlan hsaClientPlan2 = testEntityHelper.createTestClientPlan(client, "test hsa client plan 2", "HSA");

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
        
        MvcResult result = performGetAndAssertResult(null, "/admin/getLatestQuotes/{clientId}/{carrierName}/{optionType}",
            quote.getRfpSubmission().getClient().getClientId(), quote.getRfpSubmission().getRfpCarrier().getCarrier().getName(), OptionType.OPTION
        );
        
        RfpQuoteDto[] rfpQuoteDtoList = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteDto[].class);

        assertThat(rfpQuoteDtoList).isNotNull();
        assertThat(rfpQuoteDtoList).hasSize(1);

    }
}
