package com.benrevo.core.api.controller;

import static com.benrevo.be.modules.shared.service.SharedRfpQuoteService.DENTAL_BUNDLE_DISCOUNT_PERCENT;
import static com.benrevo.be.modules.shared.service.SharedRfpQuoteService.MONTHS_IN_YEAR;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcAlterPlanTotal;
import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static com.benrevo.common.util.MathUtils.getDiscountFactor;
import static com.benrevo.common.util.MathUtils.round;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.data.Offset.offset;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.testng.Assert.fail;
import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.presentation.controller.RfpQuoteController;
import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.shared.controller.BaseControllerTest;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService.BundleDiscounts;
import com.benrevo.be.modules.shared.util.PlanCalcHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CreateRfpQuoteOptionDto;
import com.benrevo.common.dto.CreateRfpQuoteOptionNetworkDto;
import com.benrevo.common.dto.DeleteRfpQuoteOptionDto;
import com.benrevo.common.dto.ExtProductDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Cost;
import com.benrevo.common.dto.QuoteOptionContributionsDto;
import com.benrevo.common.dto.QuoteOptionDetailsDto;
import com.benrevo.common.dto.QuoteOptionFinalSelectionDto;
import com.benrevo.common.dto.QuoteOptionListDto;
import com.benrevo.common.dto.QuoteOptionPlanAlternativesDto;
import com.benrevo.common.dto.QuoteOptionPlanBriefDto;
import com.benrevo.common.dto.QuoteOptionPlanDetailsDto;
import com.benrevo.common.dto.QuoteOptionSubmissionDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.SelectRfpQuoteOptionNetworkPlanDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.core.UHCCoreServiceApplicationTest;
import com.benrevo.core.service.UHCRfpQuoteService;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.apache.commons.io.FileUtils;
import org.assertj.core.api.Condition;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@UHCCoreServiceApplicationTest
public class RfpQuoteControllerTest extends BaseControllerTest {

    @Autowired
    private RfpQuoteController controller;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;
    
    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;
    
    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CarrierRepository carrierRepository;
    
    @Autowired
    private UHCRfpQuoteService rfpQuoteService;
        
    @Override
    protected Object getController() {
        return controller;
    }
    
    @Before
    public void init() throws Auth0Exception {
        User user = new User("test");
        user.setEmail("test@domain.test");
        user.setUserMetadata( build( entry("first_name", "FirstName"), entry("last_name", "LastName") ) );

        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);
    }

    @Test
    public void getSelectedRfpQuoteOptions_DiscountsAlongsideKaiser() throws Exception {
      Client client = testEntityHelper.buildTestClient();
      client.setDateQuoteOptionSubmitted(new Date());
      client = clientRepository.save(client);
  
      token = createToken(client.getBroker().getBrokerToken());
  
      ClientPlan kaiserClientPlan = testEntityHelper.createTestClientPlan("hmo kaiser plan", client, "KAISER", "HMO");
      RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.MEDICAL);
      RfpQuote kaiserQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.MEDICAL, QuoteType.KAISER);
      RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");

      Network kaiserHMONetwork = testEntityHelper.createTestNetwork("Kaiser HMO Network", "HMO", carrierRepository.findByName("KAISER"));
      RfpQuoteNetwork kaiserNetwork = testEntityHelper.createTestQuoteNetwork(kaiserQuote, kaiserHMONetwork);

      RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
      RfpQuoteNetworkPlan kaiserNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test kaiser plan", kaiserNetwork, 10f, 11f, 12f, 13f);

      RfpQuoteOption medicalKaiserOption = testEntityHelper.createTestRfpQuoteOption(kaiserQuote, "medical kaiser option");

      // Given it is alongside kaiser, option network can include kaiser quoteNetwork and non kaiser quote network
      RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalKaiserOption, medicalNetwork, medicalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
      RfpQuoteOptionNetwork kaiserMedicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalKaiserOption, kaiserNetwork, kaiserNetworkPlan, kaiserClientPlan, 1L, 1L, 2L, 2L, "DOLLAR", 90f, 90f, 90f, 90f);
      // update related entities used in rfpQuoteService.calcBundleDiscount()
      medicalKaiserOption.getRfpQuoteOptionNetworks().add(medicalOptNetwork);
      medicalKaiserOption.getRfpQuoteOptionNetworks().add(kaiserMedicalOptNetwork);
      
      RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.DENTAL);
      RfpQuoteNetwork dentalNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DPPO");
      RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
      RfpQuoteOption dentalOption = testEntityHelper.createTestRfpQuoteOption(dentalQuote, "dental option");
      RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
      RfpQuoteOptionNetwork dentalOptNetwork2 = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null, 1L, 1L, 2L, 2L, "DOLLAR", 90f, 90f, 90f, 90f);
  
      RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.VISION);
      RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION");
      RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
      RfpQuoteOption visionOption = testEntityHelper.createTestRfpQuoteOption(visionQuote, "vision option");
      RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
      RfpQuoteOptionNetwork visionOptNetwork2 = testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null, 1L, 1L, 2L, 2L, "DOLLAR", 90f, 90f, 90f, 90f);
  
      flushAndClear();

      String result = performGet("/v1/quotes/options/selected", new Object[] {"clientId", client.getClientId()});
      
      QuoteOptionFinalSelectionDto finalSelectionDto = gson.fromJson(result, QuoteOptionFinalSelectionDto.class);
  
      Float summaryBundleDiscountPercent = finalSelectionDto.getDentalBundleDiscountPercent() + finalSelectionDto.getVisionBundleDiscountPercent();
      
      double expectedMedicalTotal = round((double) (calcAlterPlanTotal(medicalOptNetwork, medicalNetworkPlan, summaryBundleDiscountPercent)
              + calcAlterPlanTotal(kaiserMedicalOptNetwork, kaiserNetworkPlan, 0f)) * MONTHS_IN_YEAR, 2);
      assertThat(finalSelectionDto.getMedicalTotal()).isEqualTo(expectedMedicalTotal);
  
      double medicalTotalWithoutKaiser = round((double) calcAlterPlanTotal(medicalOptNetwork, medicalNetworkPlan, summaryBundleDiscountPercent) * MONTHS_IN_YEAR, 2);
      assertThat(finalSelectionDto.getMedicalWithoutKaiserTotal()).isNotNull();
      assertThat(finalSelectionDto.getMedicalWithoutKaiserTotal()).isEqualTo(medicalTotalWithoutKaiser, offset(0.001));
      
      assertThat(medicalTotalWithoutKaiser).isLessThan(expectedMedicalTotal);

      
      
      BundleDiscounts discounts = rfpQuoteService.calcBundleDiscount(client.getClientId(), Arrays.asList(
          medicalKaiserOption, dentalOption, visionOption));
      
      double expectedDentalDiscount = round(discounts.medicalDiscountBaseTotal * finalSelectionDto.getDentalBundleDiscountPercent() / 100.0, 2);
      assertThat(finalSelectionDto.getDentalBundleDiscount()).isEqualTo(expectedDentalDiscount);
      
      double expectedVisionDiscount = round(discounts.medicalDiscountBaseTotal * finalSelectionDto.getVisionBundleDiscountPercent() / 100.0, 2);
      assertThat(finalSelectionDto.getVisionBundleDiscount()).isEqualTo(expectedVisionDiscount);
      
      assertThat(finalSelectionDto.getTotal()).isEqualTo(finalSelectionDto.getMedicalTotal() 
              + finalSelectionDto.getDentalTotal() + finalSelectionDto.getVisionTotal(), offset(0.001));
      assertThat(finalSelectionDto.getSummaryBundleDiscount()).isEqualTo(finalSelectionDto.getDentalBundleDiscount()
          + finalSelectionDto.getVisionBundleDiscount(), offset(0.001));
    }
    
    @Test
    public void getSelectedRfpQuoteOptions_KaiserOptionDiscount() throws Exception {
      Client client = testEntityHelper.buildTestClient();
      client.setDateQuoteOptionSubmitted(new Date());
      client = clientRepository.save(client);

      token = createToken(client.getBroker().getBrokerToken());
      
      ClientPlan clientPlan = testEntityHelper.createTestClientPlan("client plan", client, CarrierType.UHC.name(), "PPO");
      ClientPlan kaiserClientPlan = testEntityHelper.createTestClientPlan("kaiser client plan", client, CarrierType.KAISER.name(), "HMO");
      RfpQuote kaiserQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL, QuoteType.KAISER);

      Network kaiserHMONetwork = testEntityHelper.createTestNetwork("Kaiser HMO Network", "HMO", carrierRepository.findByName("KAISER"));
      RfpQuoteNetwork kaiserNetwork = testEntityHelper.createTestQuoteNetwork(kaiserQuote, kaiserHMONetwork); // carrier is KAISER

      RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(kaiserQuote, "PPO"); // carrier is UHC
      
      PlanNameByNetwork nonKaiserPnn = testEntityHelper.createTestPlanNameByNetwork("test medical plan", CarrierType.UHC.name(), "PPO");
      RfpQuoteNetworkPlan nonKaiserNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan(nonKaiserPnn, ppoNetwork, 10f, 11f, 12f, 13f);

      PlanNameByNetwork kaiserPnn = testEntityHelper.createTestPlanNameByNetwork("test kaiser plan", CarrierType.KAISER.name(), "HMO");
      RfpQuoteNetworkPlan kaiserNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan(kaiserPnn, kaiserNetwork, 10f, 11f, 12f, 13f);

      RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(kaiserQuote, "medical kaiser option");
      
      // client plan in not KAISER
      RfpQuoteOptionNetwork nonKaiserOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(
          medicalOption, ppoNetwork, nonKaiserNetworkPlan, clientPlan, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
      
      RfpQuoteOptionNetwork kaiserOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(
          medicalOption, kaiserNetwork, kaiserNetworkPlan, kaiserClientPlan, 1L, 1L, 2L, 2L, "DOLLAR", 90f, 90f, 90f, 90f);
      
      // update related entities used in rfpQuoteService.calcBundleDiscount()
      medicalOption.getRfpQuoteOptionNetworks().add(nonKaiserOptNetwork);
      medicalOption.getRfpQuoteOptionNetworks().add(kaiserOptNetwork);
      
      RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.VISION);
      RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION");
      RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
      RfpQuoteOption visionOption = testEntityHelper.createTestRfpQuoteOption(visionQuote, "vision option");
      RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
      
      flushAndClear();
  
      String result = performGet("/v1/quotes/options/selected", new Object[] {"clientId", client.getClientId()});
  
      QuoteOptionFinalSelectionDto finalSelectionDto = gson.fromJson(result, QuoteOptionFinalSelectionDto.class);
  
      Float summaryBundleDiscountPercent = finalSelectionDto.getVisionBundleDiscountPercent();
      
      // Kaiser + non-Kaiser medical total
      double expectedMedicalTotal = round((double) (calcAlterPlanTotal(nonKaiserOptNetwork, nonKaiserNetworkPlan, summaryBundleDiscountPercent)
              + calcAlterPlanTotal(kaiserOptNetwork, kaiserNetworkPlan, 0f)) * MONTHS_IN_YEAR, 2);
      assertThat(finalSelectionDto.getMedicalTotal()).isEqualTo(expectedMedicalTotal);
  
      double medicalTotalWithoutKaiser = round((double) calcAlterPlanTotal(nonKaiserOptNetwork, nonKaiserNetworkPlan, summaryBundleDiscountPercent) * MONTHS_IN_YEAR, 2);
      assertThat(finalSelectionDto.getMedicalWithoutKaiserTotal()).isNotNull().isGreaterThan(0f);
      assertThat(finalSelectionDto.getMedicalWithoutKaiserTotal()).isEqualTo(medicalTotalWithoutKaiser, offset(0.001));
      
      assertThat(medicalTotalWithoutKaiser).isLessThan(expectedMedicalTotal);

      BundleDiscounts discounts = rfpQuoteService.calcBundleDiscount(client.getClientId(), Arrays.asList(
          medicalOption, visionOption));
      
      double expectedVisionDiscount = round(discounts.medicalDiscountBaseTotal * finalSelectionDto.getVisionBundleDiscountPercent() / 100.0, 2);
      assertThat(finalSelectionDto.getVisionBundleDiscount()).isEqualTo(expectedVisionDiscount);
      
      assertThat(finalSelectionDto.getTotal()).isEqualTo(finalSelectionDto.getMedicalTotal() 
              + finalSelectionDto.getVisionTotal(), offset(0.001));
      assertThat(finalSelectionDto.getSummaryBundleDiscount()).isEqualTo(
              finalSelectionDto.getVisionBundleDiscount(), offset(0.001));
    }
    
    @Test
    public void getSelectedRfpQuoteOptions() throws Exception {
        Client client = testEntityHelper.buildTestClient();
        client.setDateQuoteOptionSubmitted(new Date());
        client = clientRepository.save(client);
        
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);

        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork medicalOptNetwork2 = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan, null, 1L, 1L, 2L, 2L, "DOLLAR", 90f, 90f, 90f, 90f);
        
        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        RfpQuoteOption dentalOption = testEntityHelper.createTestRfpQuoteOption(dentalQuote, "dental option");
        RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork dentalOptNetwork2 = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null, 1L, 1L, 2L, 2L, "DOLLAR", 90f, 90f, 90f, 90f);
        
        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
        RfpQuoteOption visionOption = testEntityHelper.createTestRfpQuoteOption(visionQuote, "vision option");
        RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork visionOptNetwork2 = testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null, 1L, 1L, 2L, 2L, "DOLLAR", 90f, 90f, 90f, 90f);
        
        testEntityHelper.createTestClientExtProduct(client, Constants.LIFE);
        
        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options/selected")
                .param("clientId", client.getClientId().toString())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();
        
        
        QuoteOptionFinalSelectionDto finalSelectionDto = gson.fromJson(result.getResponse().getContentAsString(), QuoteOptionFinalSelectionDto.class);
        assertThat(finalSelectionDto.getMedicalPlans()).hasSize(1);
        assertThat(finalSelectionDto.getDentalPlans()).hasSize(1);
        assertThat(finalSelectionDto.getVisionPlans()).hasSize(1);
        assertThat(finalSelectionDto.getExternalProducts()).hasSize(1);
        
        Float summaryBundleDiscountPercent = finalSelectionDto.getDentalBundleDiscountPercent() 
                + finalSelectionDto.getVisionBundleDiscountPercent()
                + finalSelectionDto.getExternalProducts().get(0).getDiscountPercent();

        Float medicalTotalWithoutDiscount = (calcAlterPlanTotal(medicalOptNetwork, medicalNetworkPlan, 0f) + 
                calcAlterPlanTotal(medicalOptNetwork2, medicalNetworkPlan, 0f)) * MONTHS_IN_YEAR;
        double expectedMedicalTotal = round((double) (calcAlterPlanTotal(medicalOptNetwork, medicalNetworkPlan, summaryBundleDiscountPercent) + 
                calcAlterPlanTotal(medicalOptNetwork2, medicalNetworkPlan, summaryBundleDiscountPercent)) * MONTHS_IN_YEAR, 2);
        
        assertThat(finalSelectionDto.getMedicalTotal()).isEqualTo(expectedMedicalTotal);
        double expectedDentalTotal = round((double)
                (calcAlterPlanTotal(dentalOptNetwork, dentalNetworkPlan, 0f) + 
                 calcAlterPlanTotal(dentalOptNetwork2, dentalNetworkPlan, 0f)) * MONTHS_IN_YEAR, 2);
        assertThat(finalSelectionDto.getDentalTotal()).isEqualTo(expectedDentalTotal);
        double expectedVisionTotal = round((double)
                (calcAlterPlanTotal(visionOptNetwork, visionNetworkPlan, 0f) + 
                 calcAlterPlanTotal(visionOptNetwork2, visionNetworkPlan, 0f)) * MONTHS_IN_YEAR, 2);
        assertThat(finalSelectionDto.getVisionTotal()).isEqualTo(expectedVisionTotal);      
        assertThat(finalSelectionDto.getMedicalTotal()).isLessThan(finalSelectionDto.getDentalTotal());
        assertThat(finalSelectionDto.getDentalTotal()).isLessThan(finalSelectionDto.getVisionTotal());
        
        ExtProductDto expRroducDiscount = finalSelectionDto.getExternalProducts().get(0);
        assertThat(expRroducDiscount.getDiscountPercent()).isEqualTo(RfpQuoteService.CV_PRODUCT_DISCOUNT_PERCENT.get(Constants.LIFE));
        assertThat(expRroducDiscount.getDiscount()).isEqualTo(expRroducDiscount.getDiscountPercent() / 100.0 * medicalTotalWithoutDiscount, offset(0.001));

        assertThat(finalSelectionDto.getTotal()).isEqualTo(finalSelectionDto.getMedicalTotal() 
                + finalSelectionDto.getDentalTotal() + finalSelectionDto.getVisionTotal(), offset(0.001));
        assertThat(finalSelectionDto.getSummaryBundleDiscount()).isEqualTo(finalSelectionDto.getDentalBundleDiscount() 
                + finalSelectionDto.getVisionBundleDiscount() + expRroducDiscount.getDiscount(), offset(0.001));
        assertThat(finalSelectionDto.getSubmittedDate()).isNotNull();
        
        assertThat(finalSelectionDto.getDentalBundleDiscountApplied()).isTrue();
        assertThat(finalSelectionDto.getVisionBundleDiscountApplied()).isTrue();
 
        // get medical option 
        MvcResult medicalResult =  mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options/{id}", medicalOption.getRfpQuoteOptionId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        QuoteOptionDetailsDto medicalDto = gson.fromJson(medicalResult.getResponse().getContentAsString(), QuoteOptionDetailsDto.class);

        assertThat(medicalDto.getMaxBundleDiscount()).isNotNull();
        assertThat(medicalDto.getMaxBundleDiscount()).isGreaterThan(0f);
      
        // get vision option 
        MvcResult visionResult =  mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options/{id}", visionOption.getRfpQuoteOptionId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        
        QuoteOptionDetailsDto visionDto = gson.fromJson(visionResult.getResponse().getContentAsString(), QuoteOptionDetailsDto.class);
        
        assertThat(visionDto.getMaxBundleDiscount()).isEqualTo(medicalDto.getMaxBundleDiscount());
        
    }

    @Test
    public void getSelectedRfpQuoteOptionsNoVisionEnrollment() throws Exception {
        Client client = testEntityHelper.buildTestClient();
        client.setDateQuoteOptionSubmitted(new Date());
        client = clientRepository.save(client);
        
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);

        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
        RfpQuoteOption visionOption = testEntityHelper.createTestRfpQuoteOption(visionQuote, "vision option");
        RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null, 0L, 0L, 0L, 0L, "PERCENT", 90f, 90f, 90f, 90f);
        
        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options/selected")
                .param("clientId", client.getClientId().toString())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();
        
        
        QuoteOptionFinalSelectionDto finalSelectionDto = gson.fromJson(result.getResponse().getContentAsString(), QuoteOptionFinalSelectionDto.class);
        assertThat(finalSelectionDto.getMedicalPlans()).hasSize(1);
        assertThat(finalSelectionDto.getDentalPlans()).hasSize(0);
        assertThat(finalSelectionDto.getVisionPlans()).hasSize(1);
        
        assertThat(finalSelectionDto.getDentalTotal()).isEqualTo(0F);
        assertThat(finalSelectionDto.getVisionTotal()).isEqualTo(0F);
        
        assertThat(finalSelectionDto.getDentalBundleDiscount()).isGreaterThan(0F);
        assertThat(finalSelectionDto.getDentalBundleDiscountApplied()).isFalse();
        assertThat(finalSelectionDto.getVisionBundleDiscount()).isGreaterThan(0F);
        assertThat(finalSelectionDto.getVisionBundleDiscountApplied()).isTrue();
 
    }

    
    @Test
    public void getSelectedRfpQuoteOptionsNoDiscount() throws Exception {
        Client client = testEntityHelper.createTestClient();

        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan, null, 11L, 14L, 21L, 24L, "PERCENT", 90f, 90f, 90f, 90f);
        
        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options/selected")
                .param("clientId", client.getClientId().toString())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        
        QuoteOptionFinalSelectionDto finalSelectionDto = gson.fromJson(result.getResponse().getContentAsString(), QuoteOptionFinalSelectionDto.class);
        assertThat(finalSelectionDto.getMedicalPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getDentalPlans()).isEmpty();
        assertThat(finalSelectionDto.getVisionPlans()).isEmpty();
        assertThat(finalSelectionDto.getTotal()).isEqualTo(finalSelectionDto.getMedicalTotal());
        assertNull(finalSelectionDto.getSummaryBundleDiscount());
    }

    @Test
    public void getSelectedRfpQuoteOptions_MedicalAppCarrier_DentalAndVisionSavingMsg() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan, null, 11L, 14L, 21L, 24L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DPPO");

        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.BLUE_SHIELD.name(), Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION");

        flushAndClear();
        
        String result = performGet("/v1/quotes/options/selected", new Object[] {"clientId", client.getClientId()});

        // 2. Medical with carrier UHC, no dental or vision options selected -> Dental and Vision savings message
        
        QuoteOptionFinalSelectionDto finalSelectionDto = gson.fromJson(result, QuoteOptionFinalSelectionDto.class);
        
        assertThat(finalSelectionDto.getMedicalPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getDentalPlans()).isEmpty();
        assertThat(finalSelectionDto.getVisionPlans()).isEmpty();
        
        assertThat(finalSelectionDto.getTotal()).isEqualTo(finalSelectionDto.getMedicalTotal());
        assertNotNull(finalSelectionDto.getDentalBundleDiscountPercent());
        assertNotNull(finalSelectionDto.getDentalBundleDiscount());
        assertNotNull(finalSelectionDto.getVisionBundleDiscountPercent());
        assertNotNull(finalSelectionDto.getVisionBundleDiscount());
        assertThat(finalSelectionDto.getSummaryBundleDiscount()).isEqualTo(0f);
    }
    
    @Test
    public void getSelectedRfpQuoteOptions_MedicalAppCarrier_DentalDiscountAndVisionSavingMsg() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan, null, 11L, 14L, 21L, 24L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        RfpQuoteOption dentalOption = testEntityHelper.createTestRfpQuoteOption(dentalQuote, "dental option");
        RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.BLUE_SHIELD.name(), Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION");

        flushAndClear();
        
        String result = performGet("/v1/quotes/options/selected", new Object[] {"clientId", client.getClientId()});

        // 3. Medical with carrier UHC, Dental/ Vision option selected, bundle discount applied and display
        
        QuoteOptionFinalSelectionDto finalSelectionDto = gson.fromJson(result, QuoteOptionFinalSelectionDto.class);
        
        assertThat(finalSelectionDto.getMedicalPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getDentalPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getVisionPlans()).isEmpty();
        
        assertThat(finalSelectionDto.getDentalBundleDiscount()).isNotNull();
        assertThat(finalSelectionDto.getDentalBundleDiscountPercent()).isNotNull();
        assertThat(finalSelectionDto.getVisionBundleDiscount()).isNotNull();
        assertThat(finalSelectionDto.getVisionBundleDiscountPercent()).isNotNull();

        assertThat(finalSelectionDto.getTotal()).isEqualTo(finalSelectionDto.getMedicalTotal() 
                + finalSelectionDto.getDentalTotal(), offset(0.001));
        assertThat(finalSelectionDto.getSummaryBundleDiscount()).isEqualTo(finalSelectionDto.getDentalBundleDiscount(), offset(0.001));
    }
    
    @Test
    public void getSelectedRfpQuoteOptions_MedicalAppCarrier_DentalDiscountAndVisionRenewalNoDiscount() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        // Renewal 1 medical
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(medicalQuote, RfpQuoteService.RENEWAL_1_NAME);
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan, null, 11L, 14L, 21L, 24L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        // Dental is new business
        RfpQuoteOption dentalOption = testEntityHelper.createTestRfpQuoteOption(dentalQuote, "dental option");
        RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 14f, 15f, 16f, 17f);
        // Vision is renewal
        RfpQuoteOption visionOption = testEntityHelper.createTestRfpQuoteOption(visionQuote, RfpQuoteService.RENEWAL_OPTION_NAME);
        RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
 
        flushAndClear();
        
        String result = performGet("/v1/quotes/options/selected", new Object[] {"clientId", client.getClientId()});
 
        QuoteOptionFinalSelectionDto finalSelectionDto = gson.fromJson(result, QuoteOptionFinalSelectionDto.class);
        
        assertThat(finalSelectionDto.getMedicalPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getDentalPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getVisionPlans()).isNotEmpty();
        
        // Dental is new business, discount applied
        assertThat(finalSelectionDto.getDentalBundleDiscountApplied()).isTrue();
        assertThat(finalSelectionDto.getDentalBundleDiscount()).isNotNull();
        assertThat(finalSelectionDto.getDentalBundleDiscountPercent()).isNotNull();
        
        // Vision is renewal, NO discount applied
        assertThat(finalSelectionDto.getVisionBundleDiscountApplied()).isNull();
        assertThat(finalSelectionDto.getVisionBundleDiscount()).isNull();
        assertThat(finalSelectionDto.getVisionBundleDiscountPercent()).isNull();

        assertThat(finalSelectionDto.getTotal()).isEqualTo(finalSelectionDto.getMedicalTotal() 
                + finalSelectionDto.getDentalTotal() + finalSelectionDto.getVisionTotal(), offset(0.001));
        assertThat(finalSelectionDto.getSummaryBundleDiscount()).isEqualTo(finalSelectionDto.getDentalBundleDiscount(), offset(0.001));
    }
    
    @Test
    public void getSelectedRfpQuoteOptions_DentalVoluntaryAndVisionEmployerPaid() throws Exception {
        Client client = testEntityHelper.createTestClient();
        
        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        dentalNetworkPlan.setVoluntary(true);
        dentalNetworkPlan = rfpQuoteNetworkPlanRepository.save(dentalNetworkPlan);
        RfpQuoteOption dentalOption = testEntityHelper.createTestRfpQuoteOption(dentalQuote, "dental option");
        RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteOption visionOption = testEntityHelper.createTestRfpQuoteOption(visionQuote, "vision option");
        
        RfpQuoteNetworkPlan visionNetworkPlanVoluntary = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan 1", visionNetwork, 18f, 19f, 20f, 21f);
        visionNetworkPlanVoluntary.setVoluntary(true);
        visionNetworkPlanVoluntary = rfpQuoteNetworkPlanRepository.save(visionNetworkPlanVoluntary);
        RfpQuoteOptionNetwork visionOptNetwork1 = testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlanVoluntary, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        RfpQuoteNetworkPlan visionNetworkPlanEmployerPaid = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan 2", visionNetwork, 18f, 19f, 20f, 21f);
        RfpQuoteOptionNetwork visionOptNetwork2 = testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlanEmployerPaid, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options/selected")
                .param("clientId", client.getClientId().toString())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();
        
        QuoteOptionFinalSelectionDto finalSelectionDto = gson.fromJson(result.getResponse().getContentAsString(), QuoteOptionFinalSelectionDto.class);
        assertThat(finalSelectionDto.getVisionPlans()).hasSize(2);
        assertThat(finalSelectionDto.getDentalBundleDiscount()).isNull();
        assertThat(finalSelectionDto.getVisionBundleDiscount()).isGreaterThan(0.0f);
        assertThat(finalSelectionDto.getSummaryBundleDiscount()).isEqualTo(finalSelectionDto.getVisionBundleDiscount());
             
    }
    
    @Test
    public void getRfpQuoteOptions_BundleDiscount() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
 
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, null, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
             
        assertThat(rqo.isFinalSelection()).isTrue();
        
        flushAndClear();
        
        String result =  performGet("/v1/quotes/options", new Object[] {"category", Constants.MEDICAL, "clientId", client.getClientId()});
        QuoteOptionListDto quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
        assertThat(quoteOptionListDto.getOptions()).hasSize(1);
        Float medicalTotalAnnualPremium = quoteOptionListDto.getOptions().get(0).getTotalAnnualPremium();
        assertThat(medicalTotalAnnualPremium).isGreaterThan(0f);
        
        // add and select Dental to get Bundle Discount
        RfpQuote rfpQuoteDental = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.DENTAL);
        RfpQuoteNetwork rqnDental = testEntityHelper.createTestQuoteNetwork(rfpQuoteDental, "HMO");
        RfpQuoteNetworkPlan rqnpDental = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan Dental", rqnDental, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqoDental = testEntityHelper.createTestRfpQuoteOption(rfpQuoteDental, "optionName Dental");
        RfpQuoteOptionNetwork rqonDental = testEntityHelper.createTestRfpQuoteOptionNetwork(rqoDental, rqnDental, rqnpDental, null, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
        
        assertThat(rqoDental.isFinalSelection()).isTrue();
        
        flushAndClear();
        
        result =  performGet("/v1/quotes/options", new Object[] {"category", Constants.MEDICAL, "clientId", client.getClientId()});
        quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
        assertThat(quoteOptionListDto.getOptions()).hasSize(1);
        Float dicountedMedicalTotalAnnualPremium = quoteOptionListDto.getOptions().get(0).getTotalAnnualPremium();
        
        // check for Bundle Discount = 1%
        assertThat(dicountedMedicalTotalAnnualPremium).isEqualTo(
                medicalTotalAnnualPremium * getDiscountFactor(DENTAL_BUNDLE_DISCOUNT_PERCENT));
    
    }

    @Test
    public void getRfpQuoteOptionById_BundleDiscount() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
 
        ClientPlan cpHmo = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, cpHmo, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
             
        assertThat(rqo.isFinalSelection()).isTrue();
        
        flushAndClear();
        
        String result =  performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId());
        
        QuoteOptionDetailsDto dto = gson.fromJson(result, QuoteOptionDetailsDto.class);

        assertThat(dto.getOverviewPlans()).hasSize(2);
        Float planBriefTotal = dto.getOverviewPlans().get(0).getTotal();
        assertThat(planBriefTotal).isGreaterThan(0f);
        
        assertThat(dto.getDetailedPlans()).hasSize(1);
        QuoteOptionPlanBriefDto newPlanDetails = dto.getDetailedPlans().get(0).getNewPlan();
        assertThat(newPlanDetails.getTotal()).isEqualTo(planBriefTotal);
        
        // add and select Dental to get Bundle Discount
        RfpQuote rfpQuoteDental = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.DENTAL);
        RfpQuoteNetwork rqnDental = testEntityHelper.createTestQuoteNetwork(rfpQuoteDental, "HMO");
        RfpQuoteNetworkPlan rqnpDental = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan Dental", rqnDental, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqoDental = testEntityHelper.createTestRfpQuoteOption(rfpQuoteDental, "optionName Dental");
        RfpQuoteOptionNetwork rqonDental = testEntityHelper.createTestRfpQuoteOptionNetwork(rqoDental, rqnDental, rqnpDental, cpHmo, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
        
        assertThat(rqoDental.isFinalSelection()).isTrue();
        
        flushAndClear();
        
        result =  performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId());
        
        dto = gson.fromJson(result, QuoteOptionDetailsDto.class);
        
        Float dicountedPlanBriefTotal = dto.getOverviewPlans().get(0).getTotal();
        newPlanDetails = dto.getDetailedPlans().get(0).getNewPlan();
        assertThat(newPlanDetails.getTotal()).isEqualTo(dicountedPlanBriefTotal);

        // check for Bundle Discount = 1%
        assertThat(dicountedPlanBriefTotal).isEqualTo(
                planBriefTotal * getDiscountFactor(DENTAL_BUNDLE_DISCOUNT_PERCENT));
    }

    @Test
    public void getRfpQuoteOptionAlternatives_BundleDiscount() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);
        token = createToken(client.getBroker().getBrokerToken());
        
        ClientPlan clientPlan = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan selectedPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test selected plan", rqn, 100f, 120f, 140f, 160f);
        
        PlanNameByNetwork otherCarrierPnn = testEntityHelper.createTestPlanNameByNetwork("test alter plan", CarrierType.HEALTHNET.name(), "HMO");
        RfpQuoteNetworkPlan alterPlan = testEntityHelper.createTestRfpQuoteNetworkPlan(otherCarrierPnn, rqn, 1000f, 1200f, 1400f, 1600f);
        
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, selectedPlan, clientPlan, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);

        flushAndClear();
        
        String result = performGet("/v1/quotes/options/alternatives", new Object[]{"rfpQuoteOptionNetworkId", rqon.getRfpQuoteOptionNetworkId()});
        
        QuoteOptionPlanAlternativesDto dto = gson.fromJson(result, QuoteOptionPlanAlternativesDto.class);
        assertThat(dto.getPlans()).hasSize(3);
        
        Float[] selectedPlanRates = new Float[5];
        Float[] alterPlanRates = new Float[5];
        
        Condition<Float> nonZero = new Condition<Float>("Non-zero condition") {
            @Override
            public boolean matches(Float value) {
                return value > 0.0f;
        }};
        // copy original rates before discount apply
        for (QuoteOptionAltPlanDto plan : dto.getPlans()) {
            if (plan.getType().equals(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT)) {
                continue;
            }
            Float[] target = plan.isSelected() ? selectedPlanRates : alterPlanRates;
            target[0] = Float.parseFloat(plan.getCost().get(2).value); // tier 1
            target[1] = Float.parseFloat(plan.getCost().get(3).value); // tier 2
            target[2] = Float.parseFloat(plan.getCost().get(4).value); // tier 3
            target[3] = Float.parseFloat(plan.getCost().get(5).value); // tier 4
            target[4] = Float.parseFloat(plan.getCost().get(0).value); // Monthly cost
            assertThat(target).are(nonZero);
        }
        
        // add and select Dental to get Bundle Discount
        RfpQuote rfpQuoteDental = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.DENTAL);
        RfpQuoteNetwork rqnDental = testEntityHelper.createTestQuoteNetwork(rfpQuoteDental, "HMO");
        RfpQuoteNetworkPlan rqnpDental = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan Dental", rqnDental, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqoDental = testEntityHelper.createTestRfpQuoteOption(rfpQuoteDental, "optionName Dental");
        RfpQuoteOptionNetwork rqonDental = testEntityHelper.createTestRfpQuoteOptionNetwork(rqoDental, rqnDental, rqnpDental, null, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
        
        assertThat(rqoDental.isFinalSelection()).isTrue();
        
        flushAndClear();
        
        result = performGet("/v1/quotes/options/alternatives", new Object[]{"rfpQuoteOptionNetworkId", rqon.getRfpQuoteOptionNetworkId()});
        
        dto = gson.fromJson(result, QuoteOptionPlanAlternativesDto.class);
        
        // check for Bundle Discount = 1% applied for selected plan (see comment below)
        for (QuoteOptionAltPlanDto plan : dto.getPlans()) {
            if (plan.getType().equals(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT)) {
                continue;
            }
            Float[] discountedRates = new Float[5];
            discountedRates[0] = Float.parseFloat(plan.getCost().get(2).value);
            discountedRates[1] = Float.parseFloat(plan.getCost().get(3).value);
            discountedRates[2] = Float.parseFloat(plan.getCost().get(4).value);
            discountedRates[3] = Float.parseFloat(plan.getCost().get(5).value);
            discountedRates[4] = Float.parseFloat(plan.getCost().get(0).value); 
            Float[] originalRates = plan.isSelected() ? selectedPlanRates : alterPlanRates;
            for (int i = 0; i < originalRates.length; i++) {
                if(plan.isSelected()) {
                    // Dental bundle discounts should be applied
                    assertThat(discountedRates[i]).isEqualTo(
                        originalRates[i] * getDiscountFactor(DENTAL_BUNDLE_DISCOUNT_PERCENT));
                } else {
                    // alter plan has carrier != appCarrier and discounts should not be applied
                    assertThat(discountedRates[i]).isEqualTo(originalRates[i]);
                }
            }
        }
    }

    @Test
    public void submitQuoteOptions() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        RfpQuoteOption dentalOption = testEntityHelper.createTestRfpQuoteOption(dentalQuote, "dental option");
        RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, "BLUE_SHIELD", Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
        RfpQuoteOption visionOption = testEntityHelper.createTestRfpQuoteOption(visionQuote, "vision option");
        RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        flushAndClear();
        
        QuoteOptionSubmissionDto params = new QuoteOptionSubmissionDto();
        params.setClientId(client.getClientId());
        params.setMedicalQuoteOptionId(medicalOption.getRfpQuoteOptionId());
        params.setDentalQuoteOptionId(dentalOption.getRfpQuoteOptionId());
        params.setVisionQuoteOptionId(visionOption.getRfpQuoteOptionId());
        
        String result = performPost("/v1/quotes/options/submit", params);
        QuoteOptionSubmissionDto resp = gson.fromJson(result, QuoteOptionSubmissionDto.class);
        assertThat(resp.isSubmissionSuccessful());
        
        Client updatedClient = clientRepository.findOne(client.getClientId());
        assertNotNull(updatedClient);
        assertEquals(ClientState.PENDING_APPROVAL, updatedClient.getClientState());
        
        // test send was called 
        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        Mockito.verify(smtpMailer, Mockito.times(1)).send(mailCaptor.capture());
        
        MailDto mailDto = mailCaptor.getValue();
        
        assertThat(mailDto.getSubject()).contains(client.getClientName());
        
        // uncomment for manual testing
        //File html = new File("testNewSaleNotification.html");
        //FileUtils.writeByteArrayToFile(html, mailDto.getContent().getBytes());

    }
    
    @Test
    public void submitQuoteOptions_RenewalPenalty() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        testEntityHelper.createTestClientAttribute(client, AttributeName.RENEWAL);
        
        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "Renewal 1");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        Rider rider = testEntityHelper.createTestRider("test rider 1", 10f, 20f, 30f, 40f);
        medicalNetwork.getRiders().add(rider);
        medicalOptNetwork.getSelectedRiders().add(rider);
        
        RfpQuoteNetworkPlan medicalNetworkRxPlan = testEntityHelper.createTestRfpQuoteNetworkRxPlan("test Dollar RX plan", medicalNetwork, 4f, 8f, 12f, 20f);
        medicalOptNetwork.setSelectedRfpQuoteNetworkRxPlan(medicalNetworkRxPlan);
        rfpQuoteOptionNetworkRepository.save(medicalOptNetwork);

        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        RfpQuoteOption dentalOption = testEntityHelper.createTestRfpQuoteOption(dentalQuote, "Renewal 2");
        dentalOption.setFinalSelection(false);
        rfpQuoteOptionRepository.save(dentalOption);
        
        RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
        RfpQuoteOption visionOption = testEntityHelper.createTestRfpQuoteOption(visionQuote, "Renewal 3");
        visionOption.setFinalSelection(false);
        rfpQuoteOptionRepository.save(visionOption);
        
        RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        final float originalTier1Rate = medicalNetworkPlan.getTier1Rate();
        final float originalTier2Rate = medicalNetworkPlan.getTier2Rate();
        final float originalTier3Rate = medicalNetworkPlan.getTier3Rate();
        final float originalTier4Rate = medicalNetworkPlan.getTier4Rate();
        
        final float originalTier1RxRate = medicalNetworkRxPlan.getTier1Rate();
        final float originalTier2RxRate = medicalNetworkRxPlan.getTier2Rate();
        final float originalTier3RxRate = medicalNetworkRxPlan.getTier3Rate();
        final float originalTier4RxRate = medicalNetworkRxPlan.getTier4Rate();
        
        flushAndClear();
        
        QuoteOptionSubmissionDto params = new QuoteOptionSubmissionDto();
        params.setClientId(client.getClientId());

        String result = performPost("/v1/quotes/options/submit", params);
        QuoteOptionSubmissionDto resp = gson.fromJson(result, QuoteOptionSubmissionDto.class);
        assertThat(resp.isSubmissionSuccessful());

        // test send was called 
        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        Mockito.verify(smtpMailer, Mockito.times(1)).send(mailCaptor.capture());
        
        MailDto mailDto = mailCaptor.getValue();
        assertThat(mailDto.getContent()).doesNotContain("Bundled:");
        assertThat(mailDto.getContent()).contains("1.0% was added to the medical rates due to removing Dental coverage");
        assertThat(mailDto.getContent()).contains("0.5% was added to the medical rates due to removing Vision coverage");
        
        // uncomment for manual testing
        //File html = new File("testNewSaleNotification.html");
        //FileUtils.writeByteArrayToFile(html, mailDto.getContent().getBytes());
        
        // Important check: rates should NOT be changed in DB after API call
        
        flushAndClear();
        
        medicalNetworkPlan = rfpQuoteNetworkPlanRepository.findOne(medicalNetworkPlan.getRfpQuoteNetworkPlanId());
        
        assertThat(medicalNetworkPlan.getTier1Rate()).isEqualTo(originalTier1Rate);
        assertThat(medicalNetworkPlan.getTier2Rate()).isEqualTo(originalTier2Rate);
        assertThat(medicalNetworkPlan.getTier3Rate()).isEqualTo(originalTier3Rate);
        assertThat(medicalNetworkPlan.getTier4Rate()).isEqualTo(originalTier4Rate);
        
        assertThat(medicalNetworkRxPlan.getTier1Rate()).isEqualTo(originalTier1RxRate);
        assertThat(medicalNetworkRxPlan.getTier2Rate()).isEqualTo(originalTier2RxRate);
        assertThat(medicalNetworkRxPlan.getTier3Rate()).isEqualTo(originalTier3RxRate);
        assertThat(medicalNetworkRxPlan.getTier4Rate()).isEqualTo(originalTier4RxRate);
    }
    
    @Test
    public void getRfpQuoteOptionContributions_BundleDiscount() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
 
        ClientPlan cp = testEntityHelper.createTestClientPlan("test client plan", client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, cp, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
             
        flushAndClear();
        
        String resp = performGet("/v1/quotes/options/contributions", new Object[] {"rfpQuoteOptionId", rqo.getRfpQuoteOptionId()});
        
        QuoteOptionContributionsDto[] resultList = gson.fromJson(resp, QuoteOptionContributionsDto[].class);
        assertThat(resultList).hasSize(1);
        
        Float proposedEE = resultList[0].getContributions().get(0).getProposedEE();
        assertThat(proposedEE).isGreaterThan(0f);
        Float proposedERTotal = resultList[0].getProposedERTotal();
        assertThat(proposedERTotal).isGreaterThan(0f);
        Float proposedERTotalCost = resultList[0].getProposedERTotalCost();
        assertThat(proposedERTotalCost).isGreaterThan(0f);
        
        // add and select Dental to get Bundle Discount
        RfpQuote rfpQuoteDental = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.DENTAL);
        RfpQuoteNetwork rqnDental = testEntityHelper.createTestQuoteNetwork(rfpQuoteDental, "HMO");
        RfpQuoteNetworkPlan rqnpDental = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan Dental", rqnDental, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqoDental = testEntityHelper.createTestRfpQuoteOption(rfpQuoteDental, "optionName Dental");
        RfpQuoteOptionNetwork rqonDental = testEntityHelper.createTestRfpQuoteOptionNetwork(rqoDental, rqnDental, rqnpDental, null, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
        
        flushAndClear();
        
        resp = performGet("/v1/quotes/options/contributions", new Object[] {"rfpQuoteOptionId", rqo.getRfpQuoteOptionId()});
        
        resultList = gson.fromJson(resp, QuoteOptionContributionsDto[].class);
        
        // check for Bundle Discount = 1%
        
        Float discProposedEE = resultList[0].getContributions().get(0).getProposedEE();
        assertThat(discProposedEE).isEqualTo(proposedEE * getDiscountFactor(DENTAL_BUNDLE_DISCOUNT_PERCENT));
        
        Float discProposedERTotal = resultList[0].getProposedERTotal();
        assertThat(discProposedERTotal).isEqualTo(proposedERTotal * getDiscountFactor(DENTAL_BUNDLE_DISCOUNT_PERCENT));
        
        Float discProposedERTotalCost = resultList[0].getProposedERTotalCost();
        assertThat(discProposedERTotalCost).isEqualTo(proposedERTotalCost * getDiscountFactor(DENTAL_BUNDLE_DISCOUNT_PERCENT));

    }

    
    @Test
    public void getRfpQuoteOption_MotionDiscount() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
 
        ClientPlan cp = testEntityHelper.createTestClientPlan("test client plan", client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "PPO");
        rqn.setRfpQuoteOptionName(rqn.getRfpQuoteOptionName() + " - Motion");
        RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, cp, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
             
        flushAndClear();
        
        String resp = performGet("/v1/quotes/options/{id}", new Object[] {}, rqo.getRfpQuoteOptionId());
        
        QuoteOptionDetailsDto dto = gson.fromJson(resp, QuoteOptionDetailsDto.class);
        
        assertThat(dto.getDetailedPlans()).hasSize(1);
        assertThat(dto.getDetailedPlans().get(0).getDiscountType()).isEqualTo("MOTION");
        
    }

    @Test
    public void getRfpQuoteOptionAlternatives_MotionDiscount() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);
        token = createToken(client.getBroker().getBrokerToken());
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");
        rqn.setRfpQuoteOptionName(rqn.getRfpQuoteOptionName() + " - Motion");
        RfpQuoteNetworkPlan selectedPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test selected plan", rqn, 100f, 120f, 140f, 160f);
        testEntityHelper.createTestBenefit("PCP", selectedPlan.getPnn().getPlan(), "$100", null);
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", selectedPlan.getPnn().getPlan(), "$1000", "$2000");
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", selectedPlan.getPnn().getPlan(), "$1100", "$2200");
        
        RfpQuoteNetworkPlan altPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test alter plan", rqn, 1000f, 1200f, 1400f, 1600f);
        testEntityHelper.createTestBenefit("PCP", altPlan.getPnn().getPlan(), "$110", null);
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", altPlan.getPnn().getPlan(), "$1200", "$2400");
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", altPlan.getPnn().getPlan(), "$1300", "$2600");

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, selectedPlan, null, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);

        flushAndClear();
        
        String result = performGet("/v1/quotes/options/alternatives", new Object[]{"rfpQuoteOptionNetworkId", rqon.getRfpQuoteOptionNetworkId()});

        QuoteOptionPlanAlternativesDto dto = gson.fromJson(result, QuoteOptionPlanAlternativesDto.class);
        
        assertThat(dto.getPlans()).hasSize(2);
        
        for (QuoteOptionAltPlanDto plan : dto.getPlans()) {
            assertThat(plan.getBenefits()).hasSize(3);
            if (plan.isSelected()) {
                for (QuoteOptionAltPlanDto.Benefit benefit : plan.getBenefits()) {
                    switch (benefit.sysName) {
                        case "INDIVIDUAL_DEDUCTIBLE":
                            assertThat(benefit.discountTypeIn).isEqualTo("MOTION");
                            assertThat(benefit.discountTypeOut).isEqualTo("MOTION");
                            assertThat(benefit.originalValueIn).isEqualTo("1000");
                            assertThat(benefit.originalValueOut).isEqualTo("2000");
                            assertThat(benefit.valueIn).isEqualTo("0");
                            assertThat(benefit.valueOut).isEqualTo("905.0");
                            assertThat(benefit.discountValueIn).isEqualTo("1095.0");
                            assertThat(benefit.discountValueOut).isEqualTo("1095.0");
                            break;
                        case "FAMILY_DEDUCTIBLE":
                            assertThat(benefit.discountTypeIn).isEqualTo("MOTION");
                            assertThat(benefit.discountTypeOut).isEqualTo("MOTION");
                            assertThat(benefit.originalValueIn).isEqualTo("1100");
                            assertThat(benefit.originalValueOut).isEqualTo("2200");
                            assertThat(benefit.valueIn).isEqualTo("0");
                            assertThat(benefit.valueOut).isEqualTo("10.0");
                            assertThat(benefit.discountValueIn).isEqualTo("2190.0");
                            assertThat(benefit.discountValueOut).isEqualTo("2190.0");
                            break;
                        case "PCP":
                            assertThat(benefit.discountType).isNull();
                            assertThat(benefit.discountTypeIn).isNull();
                            assertThat(benefit.discountTypeOut).isNull();
                            break;
                        default:
                            fail("Unexpected benefit");
                            break;
                        
                    }
                }
            } else {
                if (plan.isSelected()) {
                    for (QuoteOptionAltPlanDto.Benefit benefit : plan.getBenefits()) {
                        switch (benefit.sysName) {
                            case "INDIVIDUAL_DEDUCTIBLE":
                                assertThat(benefit.discountTypeIn).isEqualTo("MOTION");
                                assertThat(benefit.discountTypeOut).isEqualTo("MOTION");
                                assertThat(benefit.originalValueIn).isEqualTo("1200");
                                assertThat(benefit.originalValueOut).isEqualTo("2400");
                                assertThat(benefit.valueIn).isEqualTo("105.0");
                                assertThat(benefit.valueOut).isEqualTo("1305.0");
                                assertThat(benefit.discountValueIn).isEqualTo("1095.0");
                                assertThat(benefit.discountValueOut).isEqualTo("1095.0");
                                break;
                            case "FAMILY_DEDUCTIBLE":
                                assertThat(benefit.discountTypeIn).isEqualTo("MOTION");
                                assertThat(benefit.discountTypeOut).isEqualTo("MOTION");
                                assertThat(benefit.originalValueIn).isEqualTo("1300");
                                assertThat(benefit.originalValueOut).isEqualTo("2600");
                                assertThat(benefit.valueIn).isEqualTo("0");
                                assertThat(benefit.valueOut).isEqualTo("410.0");
                                assertThat(benefit.discountValueIn).isEqualTo("2190.0");
                                assertThat(benefit.discountValueOut).isEqualTo("2190.0");
                                break;
                            case "PCP":
                                assertThat(benefit.discountType).isNull();
                                assertThat(benefit.discountTypeIn).isNull();
                                assertThat(benefit.discountTypeOut).isNull();
                                break;
                            default:
                                fail("Unexpected benefit");
                                break;
                            
                        }
                    }
                }    
            }
            
        }
        
    }

    
    @Test
    public void createRfpQuoteOption() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        ClientPlan clientPlan = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 1");
        RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, clientPlan, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        flushAndClear();
        
        // crete option for current carrier
        
        CreateRfpQuoteOptionDto params = new CreateRfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setRfpCarrierId(rfpQuote.getRfpSubmission().getRfpCarrier().getRfpCarrierId());

        String result = performPost("/v1/quotes/options/create", params);
        
        QuoteOptionDetailsDto quoteOption2Dto = gson.fromJson(result, QuoteOptionDetailsDto.class);
        assertThat(quoteOption2Dto.getName()).isEqualTo("Option 2");
        
        RfpQuoteOption createdOption = rfpQuoteOptionRepository.findOne(quoteOption2Dto.getId());
        assertThat(createdOption).isNotNull();
        assertThat(createdOption.getRfpQuote().getRfpQuoteId()).isEqualTo(rfpQuote.getRfpQuoteId());
        
        // check for Option 2 is copy of Option 1 comparing by fields
        QuoteOptionDetailsDto quoteOption1Dto = gson.fromJson(performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId()), QuoteOptionDetailsDto.class);
                 
        assertThat(quoteOption2Dto).isEqualToComparingOnlyGivenFields(quoteOption1Dto, "totalAnnualPremium", "percentDifference", "dollarDifference");
        for (int i = 0; i < quoteOption1Dto.getDetailedPlans().size(); i++) {
            QuoteOptionPlanDetailsDto base = quoteOption1Dto.getDetailedPlans().get(i);
            QuoteOptionPlanDetailsDto created = quoteOption2Dto.getDetailedPlans().get(i);
            assertThat(created.getCurrentPlan()).isEqualToIgnoringGivenFields(base.getCurrentPlan(), "cost", "benefit", "rx");
            assertThat(created.getNewPlan()).isEqualToIgnoringGivenFields(base.getNewPlan(), "cost", "benefit", "rx");
        }
        assertThat(quoteOption2Dto.getOverviewPlans()).usingFieldByFieldElementComparator().isEqualTo(quoteOption1Dto.getOverviewPlans());
        
        flushAndClear();

        // crete option for new carrier

        Carrier carrier = testEntityHelper.createTestCarrier("OTHER", "Other");
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        params.setRfpCarrierId(rfpCarrier.getRfpCarrierId());
        params.setQuoteType(QuoteType.CLEAR_VALUE);

        result = performPost("/v1/quotes/options/create", params);
        QuoteOptionDetailsDto quoteOption3Dto = gson.fromJson(result, QuoteOptionDetailsDto.class);

        // check for new created RfpQuote
        RfpQuoteOption createdOption3 = rfpQuoteOptionRepository.findOne(quoteOption3Dto.getId());
        assertThat(createdOption3).isNotNull();
        assertThat(createdOption3.getRfpQuote().getRfpQuoteId()).isNotEqualTo(rfpQuote.getRfpQuoteId());
        assertThat(createdOption3.getRfpQuote().getQuoteType()).isEqualTo(QuoteType.CLEAR_VALUE);
        
        // check created option cards (overview page)
        assertThat(quoteOption3Dto.getName()).isEqualTo("Option 3");
        assertThat(quoteOption3Dto.getOverviewPlans()).hasSize(2); // current and new
        QuoteOptionPlanBriefDto newOverviewPlan = quoteOption3Dto.getOverviewPlans().get(0);
        assertThat(newOverviewPlan.getName()).isNull();
        QuoteOptionPlanBriefDto currentOverviewPlan = quoteOption3Dto.getOverviewPlans().get(1);
        assertThat(currentOverviewPlan.getCarrier()).isEqualTo(clientPlan.getPnn().getPlan().getCarrier().getDisplayName());

        assertThat(quoteOption3Dto.getDetailedPlans()).hasSize(1);
        QuoteOptionPlanDetailsDto detail = quoteOption3Dto.getDetailedPlans().get(0);
        assertThat(detail.getType()).isEqualTo("HMO");
        assertThat(detail.getCurrentPlan().getName()).isEqualTo(clientPlan.getPnn().getName());
        assertThat(detail.getNewPlan()).isNull(); // not created item in rfp_quote_option_network
        
        flushAndClear();
        
        // crete Option 4 for new carrier
        
        result = performPost("/v1/quotes/options/create", params);
        QuoteOptionDetailsDto quoteOption4Dto = gson.fromJson(result, QuoteOptionDetailsDto.class);
        assertThat(quoteOption4Dto.getName()).isEqualTo("Option 4");
        
        // check for new created RfpQuote
        RfpQuoteOption createdOption4 = rfpQuoteOptionRepository.findOne(quoteOption3Dto.getId());
        assertThat(createdOption4.getRfpQuote().getRfpQuoteId()).isEqualTo(createdOption3.getRfpQuote().getRfpQuoteId());
        
        // check for incremental option number
        result = performDelete("/v1/quotes/options/delete", new DeleteRfpQuoteOptionDto(quoteOption3Dto.getId()));
        result = performPost("/v1/quotes/options/create", params);
        QuoteOptionDetailsDto quoteOption5Dto = gson.fromJson(result, QuoteOptionDetailsDto.class);
        assertThat(quoteOption5Dto.getName()).isEqualTo("Option 5");
    }

    @Test
    public void testCreateKaiserOption() throws Exception {
        //1 create client
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        //2 create create client plan and rfp
        ClientPlan clientPlan = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        ClientPlan kaiserClientPlan = testEntityHelper.createTestClientPlan("hmo client plan", client, "KAISER", "HMO");

        // 3 create rfp carrier and rfp submission which are the same for both quotes
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(Constants.UHC_CARRIER, Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        //3 create rfp quotes
        RfpQuote replaceKaiser = testEntityHelper.createTestRfpQuote(client, rfpSubmission, Constants.UHC_CARRIER, Constants.MEDICAL, QuoteType.STANDARD);
        RfpQuote withKaiser = testEntityHelper.createTestRfpQuote(client, rfpSubmission, Constants.UHC_CARRIER, Constants.MEDICAL, QuoteType.KAISER);

        //4 rfp quote networks
        RfpQuoteNetwork replaceKaiserNetwork = testEntityHelper.createTestQuoteNetwork(replaceKaiser, "HMO");
        // Kaiser RfpQuoteNetwork should have "Kaiser" carrier
        Carrier kaiser = carrierRepository.findByName(CarrierType.KAISER.name());
        Network kaiserNetwork = testEntityHelper.createTestNetwork("Kaiser HMO Network", "HMO", kaiser);
        RfpQuoteNetwork withKaiserNetwork = testEntityHelper.createTestQuoteNetwork(withKaiser, kaiserNetwork);

        //5 rfp quote network plans
        RfpQuoteNetworkPlan replaceKaiserRqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", replaceKaiserNetwork, 100f, 120f, 140f, 160f);
        RfpQuoteNetworkPlan withKaiserRqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", withKaiserNetwork, 100f, 120f, 140f, 160f);

        //6 rfp quote options
        RfpQuoteOption replaceKaiserRqo = testEntityHelper.createTestRfpQuoteOption(replaceKaiser, "Option 1");
        RfpQuoteOption withKaiserRqo = testEntityHelper.createTestRfpQuoteOption(withKaiser, "Option 1");

        //7 rfp quote option networks
        RfpQuoteOptionNetwork replaceKaiserRqon = testEntityHelper.createTestRfpQuoteOptionNetwork(replaceKaiserRqo, replaceKaiserNetwork,
                replaceKaiserRqnp, clientPlan, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork withKaiserRqon = testEntityHelper.createTestRfpQuoteOptionNetwork(withKaiserRqo, withKaiserNetwork,
                withKaiserRqnp, kaiserClientPlan, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        CreateRfpQuoteOptionDto params = new CreateRfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setRfpCarrierId(withKaiser.getRfpSubmission().getRfpCarrier().getRfpCarrierId());
        params.setQuoteType(QuoteType.KAISER);

        String result = performPost("/v1/quotes/options/create", params);

        QuoteOptionDetailsDto newOption = gson.fromJson(result, QuoteOptionDetailsDto.class);
        assertThat(newOption.getName()).isEqualTo("Option 2");

        assertThat(newOption.getDetailedPlans()).extracting("KaiserNetwork").contains(true,false);
        
        RfpQuoteOption createdOption = rfpQuoteOptionRepository.findOne(newOption.getId());
        assertThat(createdOption).isNotNull();
        assertThat(createdOption.getRfpQuote().getRfpQuoteId()).isEqualTo(withKaiser.getRfpQuoteId());
    }

    @Test
    public void createRfpQuoteOptionNetwork_UHC_DefaultAdmFee() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(new Date());
        token = createToken(client.getBroker().getBrokerToken());
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");
        
        RfpQuoteNetworkPlan altPlan = testEntityHelper
                .createTestRfpQuoteNetworkPlan("alt plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteNetworkPlan matchPlan = testEntityHelper
                .createTestRfpQuoteNetworkPlan("match plan", rqn, 100f, 120f, 140f, 160f, true);
        RfpQuoteNetworkPlan matchRxPlan = testEntityHelper
            .createTestRfpQuoteNetworkRxPlan("match rx", rqn, 100f, 120f, 140f, 160f, true);
        RfpQuoteNetworkPlan notMatchRxPlan = testEntityHelper
            .createTestRfpQuoteNetworkRxPlan("not match rx ", rqn, 100f, 120f, 140f, 160f, false);
    matchPlan.setMatchPlan(true);
        
        flushAndClear();
        
        // create new option network based with default values
        CreateRfpQuoteOptionNetworkDto params = new CreateRfpQuoteOptionNetworkDto();
        params.setRfpQuoteNetworkId(rqn.getRfpQuoteNetworkId());

        String result = performPost("/v1/quotes/options/{id}/addNetwork", params, rqo.getRfpQuoteOptionId());

        flushAndClear();
        
        Long quoteOptionNetworkId1 = Long.parseLong(result);
        RfpQuoteOptionNetwork optionNetwork = rfpQuoteOptionNetworkRepository.findOne(quoteOptionNetworkId1);
        assertThat(optionNetwork).isNotNull();
        assertThat(optionNetwork.getAdministrativeFee()).isNotNull();
        assertThat(optionNetwork.getAdministrativeFee().getName()).isEqualTo(Constants.DEFAULT_ADMINISTRATIVE_FEE_UHC);
        
        // test autoSelectPlan
        assertThat(optionNetwork.getSelectedRfpQuoteNetworkPlan()).isNotNull();
        assertThat(optionNetwork.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId()).
                isEqualTo(matchPlan.getRfpQuoteNetworkPlanId());
        // test autoSelectPlan for extRX plan
        assertThat(optionNetwork.getSelectedRfpQuoteNetworkRxPlan()).isNotNull();
        assertThat(optionNetwork.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId()).
                isEqualTo(matchRxPlan.getRfpQuoteNetworkPlanId());
        
        // create new option network based on client plan
        Network network = testEntityHelper.createTestNetwork("Network 1", "HSA", rqn.getNetwork().getCarrier());
        ClientPlan cp = testEntityHelper.createTestClientPlan("hsa client plan", client, "BLUE_SHIELD", "HSA");
        params.setRfpQuoteNetworkId(null);
        params.setClientPlanId(cp.getClientPlanId());
        params.setNetworkId(network.getNetworkId());
        result = performPost("/v1/quotes/options/{id}/addNetwork", params, rqo.getRfpQuoteOptionId());
                
        flushAndClear();
        
        Long quoteOptionNetworkId2 = Long.parseLong(result);
        optionNetwork = rfpQuoteOptionNetworkRepository.findOne(quoteOptionNetworkId2);
        assertThat(optionNetwork).isNotNull();
        assertThat(optionNetwork.getAdministrativeFee()).isNotNull();
        assertThat(optionNetwork.getAdministrativeFee().getName()).isEqualTo(Constants.DEFAULT_ADMINISTRATIVE_FEE_UHC);
    }
    
    @Test
    public void createRfpQuoteOptionNetwork_UHC_restrictions() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        ClientPlan cp1 = testEntityHelper.createTestClientPlan("hmo client plan 1", client, "BLUE_SHIELD", "HMO");
        
        // check QuoteType.EASY restrictions
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL, QuoteType.EASY);
        
        RfpQuoteNetwork rqn1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork rqn3 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork rqn2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork rqn4 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "PPO");
        RfpQuoteNetwork rqn5 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "PPO");
        RfpQuoteNetwork rqn6 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");
        RfpQuoteNetwork rqn7 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");
        
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        
        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn1, null, cp1, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn2, null, cp1, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqon3 = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn3, null, cp1, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqon4 = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn4, null, cp1, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
        
        flushAndClear();
        
        CreateRfpQuoteOptionNetworkDto params = new CreateRfpQuoteOptionNetworkDto(rqn5.getRfpQuoteNetworkId());
    
        String result = performPost(HttpStatus.INTERNAL_SERVER_ERROR, "/v1/quotes/options/{id}/addNetwork", params, rqo.getRfpQuoteOptionId());
        RestMessageDto resp = gson.fromJson(result, RestMessageDto.class);
        assertThat(resp.isClientMessage()).isTrue();
        assertThat(resp.getMessage()).isEqualTo(RfpQuoteService.UHC_RESTRICTION_FOR_EASY_QUOTE_TYPE);

        // check QuoteType.STANDARD restrictions
        
        rfpQuote.setQuoteType(QuoteType.STANDARD);
        rfpQuote = rfpQuoteRepository.save(rfpQuote);
        
        // add 5th network
        params.setRfpQuoteNetworkId(rqn5.getRfpQuoteNetworkId());
        result = performPost("/v1/quotes/options/{id}/addNetwork", params, rqo.getRfpQuoteOptionId());
        // add 6th network
        params.setRfpQuoteNetworkId(rqn6.getRfpQuoteNetworkId());
        result = performPost("/v1/quotes/options/{id}/addNetwork", params, rqo.getRfpQuoteOptionId());
        
        flushAndClear();
        
        // 7th network not allowed
        params.setRfpQuoteNetworkId(rqn7.getRfpQuoteNetworkId());
        
        result = performPost(HttpStatus.INTERNAL_SERVER_ERROR, "/v1/quotes/options/{id}/addNetwork", params, rqo.getRfpQuoteOptionId());
        resp = gson.fromJson(result, RestMessageDto.class);
        assertThat(resp.isClientMessage()).isTrue();
        assertThat(resp.getMessage()).isEqualTo(RfpQuoteService.UHC_RESTRICTION_FOR_STANDARD_QUOTE_TYPE);
    }

    @Test
    public void getRfpQuoteOption_Select_Dollar_RX_Plan() throws Exception {
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);
        token = createToken(client.getBroker().getBrokerToken());

        ClientPlan clientPlan = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");

        RfpQuote medicalQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper
            .createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan plan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption rqo = testEntityHelper
            .createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork rqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, medicalNetwork, plan, clientPlan, 10L, 15L, 20L, 25L,
                "DOLLAR", 90f, 90f, 90f, 90f);

        RfpQuoteNetworkPlan selectedRxPlan = testEntityHelper
            .createTestRfpQuoteNetworkRxPlan("rx plan 1", medicalNetwork, 10f, 10f, 10f, 10f);

        flushAndClear();

        SelectRfpQuoteOptionNetworkPlanDto params = new SelectRfpQuoteOptionNetworkPlanDto();
        params.setRfpQuoteNetworkPlanId(plan.getRfpQuoteNetworkPlanId());
        params.setRfpQuoteOptionNetworkId(rqon.getRfpQuoteOptionNetworkId());

        String result = performPut("/v1/quotes/options/selectNetworkPlan", params);

        flushAndClear();

        QuoteOptionDetailsDto quoteOption1Dto = gson
            .fromJson(performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId()),
                QuoteOptionDetailsDto.class);

        assertThat(quoteOption1Dto.getDetailedPlans()).hasSize(1);

        // select RX
        params.setRfpQuoteNetworkPlanId(selectedRxPlan.getRfpQuoteNetworkPlanId());
        result = performPut("/v1/quotes/options/selectNetworkPlan", params);

        flushAndClear();

        quoteOption1Dto = gson
            .fromJson(performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId()),
                QuoteOptionDetailsDto.class);

        assertThat(quoteOption1Dto.getDetailedPlans()).hasSize(1);
        QuoteOptionPlanDetailsDto planDetails = quoteOption1Dto.getDetailedPlans().get(0);

        // first assert that rates are calculated wrong
        assertThat(planDetails.getPercentDifference()).isEqualTo(-80.3F);
        assertThat(planDetails.getDollarDifference()).isEqualTo(-33900.0F);
        QuoteOptionPlanBriefDto newPlan = planDetails.getNewPlan();
        assertThat(newPlan.getTotal()).isEqualTo(8300.0F);
        assertThat(newPlan.getEmployee()).isEqualTo(2000.0F);
        assertThat(newPlan.getEmployer()).isEqualTo(6300.0F);

        // now add the rx dollar attribute and assert right rates
        testEntityHelper.createTestQuotePlanAttribute(selectedRxPlan, QuotePlanAttributeName.DOLLAR_RX_RATE, null);
        flushAndClear();

        quoteOption1Dto = gson
            .fromJson(performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId()),
                QuoteOptionDetailsDto.class);

        assertThat(quoteOption1Dto.getDetailedPlans()).hasSize(1);
        planDetails = quoteOption1Dto.getDetailedPlans().get(0);

        assertThat(planDetails.getPercentDifference()).isEqualTo(-96.4F);
        assertThat(planDetails.getDollarDifference()).isEqualTo(-40670.0F);
        newPlan = planDetails.getNewPlan();
        assertThat(newPlan.getTotal()).isEqualTo(1530.0F);
        assertThat(newPlan.getEmployee()).isEqualTo(-4770.0F);
        assertThat(newPlan.getEmployer()).isEqualTo(6300.0F);
    }
}
