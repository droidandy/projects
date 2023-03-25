package com.benrevo.broker.api.controller;

import com.auth0.exception.Auth0Exception;
import com.benrevo.be.modules.presentation.controller.PlanController;
import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.broker.service.PresentationService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.OptionPlanDto;
import com.benrevo.common.dto.PresentationAlternativeDto;
import com.benrevo.common.dto.PresentationAlternativeDto.PresentationAlternativeBundlingDiscount;
import com.benrevo.common.dto.PresentationAlternativeDto.PresentationAlternativeOption;
import com.benrevo.common.dto.PresentationQuoteOptionListDto;
import com.benrevo.common.dto.PresentationUpdateDto;
import com.benrevo.common.dto.QuoteOptionBriefDto;
import com.benrevo.common.dto.QuoteOptionDisclaimerDto;
import com.benrevo.common.dto.QuoteOptionListDto;
import com.benrevo.common.dto.QuoteOptionPlanComparisonDto;
import com.benrevo.common.dto.RfpQuoteOptionDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.dto.ancillary.AncillaryRateAgeDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryOptionDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryPlanComparisonDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryPlanDto;
import com.benrevo.common.dto.ancillary.VoluntaryRateDto;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.enums.RateType;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.AncillaryRateAge;
import com.benrevo.data.persistence.entities.ancillary.BasicRate;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientRfpProductRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PresentationOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import org.assertj.core.data.Offset;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document.OutputSettings;
import org.jsoup.safety.Whitelist;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static com.benrevo.common.Constants.MEDICAL;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class PresentationControllerTest extends AbstractControllerTest {

    @Autowired
    private PresentationController presentationController;
    
    @Autowired
    private PlanController planController;
    
    @Autowired
    private RfpQuoteService rfpQuoteService;
    
    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;
    
    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private PlanNameByNetworkRepository pnnRepository;

    @Autowired
    private PresentationService presentationService;

    @Autowired
    private ClientRfpProductRepository clientRfpProductRepository;

    @Autowired
    private PresentationOptionRepository presentationOptionRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;
    
    @Autowired
    private SharedPlanService sharedPlanService;

    @Before
    @Override
    public void init() throws Auth0Exception {
        initController(presentationController, planController);
    }
    
    @Test
    public void testRenewal_InitByProduct() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);

        ClientPlan cpMedical = testEntityHelper.createTestClientPlan(client, "Medical Client plan", "HMO");
        ClientPlan cpDental = testEntityHelper.createTestClientPlan(client, "Dental Client plan", "DHMO");
        ClientPlan cpVision = testEntityHelper.createTestClientPlan(client, "Vision Client plan", "VISION");
        
        
        RfpQuoteOptionDto params = new RfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setProduct(Constants.MEDICAL);
        params.setCarrierId(carrier.getCarrierId());
        
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null, "/broker/presentation/initOptions");

        // These three lines are required because this method breaks out of the security context
        // (not within the @Test scope)
        SecurityContext sc = (SecurityContext) mockSession.getAttribute(SPRING_SECURITY_CONTEXT_KEY);
        SecurityContextHolder.setContext(sc);
        SecurityContextHolder.getContext().setAuthentication(sc.getAuthentication());
        
        QuoteOptionListDto optList = rfpQuoteService.getQuoteOptions(params.getClientId(), params.getProduct());
        
        assertThat(optList.getOptions()).hasSize(1);
        QuoteOptionBriefDto renewal = optList.getOptions().get(0);
        assertThat(renewal.getName()).isEqualTo("Renewal");
        // Dental and Medical should be ignored
        assertThat(renewal.getPlanTypes()).hasSize(1).containsExactly(cpMedical.getPlanType());
        
        RfpQuoteOption renewalOption = rfpQuoteOptionRepository.findOne(renewal.getId());
        assertThat(renewalOption).isNotNull();
        // Only one Medical HMO rqon
        assertThat(renewalOption.getRfpQuoteOptionNetworks()).hasSize(1);
        assertThat(renewalOption.getRfpQuoteOptionNetworks())
            .extracting(rqon -> rqon.getClientPlan().getClientPlanId()).containsExactly(cpMedical.getClientPlanId());

    }
    
    @Test
    public void testRenewalAncillaryUpdate() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.displayName);
        
        // prepare Current option and init Renewal
        
        AncillaryPlan clientAncillary = testEntityHelper.createTestAncillaryPlan("Basic Life",
                PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);
        ClientPlan cpLife = testEntityHelper.createTestAncillaryClientPlan(client, clientAncillary, PlanCategory.LIFE);

        RfpQuoteOptionDto params = new RfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setProduct(PlanCategory.LIFE.name());
        
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null, "/broker/presentation/initOptions");

        flushAndClear();
        
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(params.getClientId(), params.getProduct());
        assertThat(rfpQuotes).hasSize(1);
    	RfpQuote rfpQuote = rfpQuotes.get(0);
    	List<RfpQuoteAncillaryOption> optionList = rfpQuoteAncillaryOptionRepository.findByRfpQuote(rfpQuote);
        assertThat(optionList).hasSize(1);
        RfpQuoteAncillaryOption renewal = optionList.get(0);
        assertThat(renewal.getName()).isEqualTo("Renewal");
        assertThat(renewal.getRfpQuote().getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(renewal.getRfpQuoteAncillaryPlan()).isNotNull();

        // update client plan
        
        AncillaryPlanDto getDto = sharedPlanService.getAncillaryPlan(clientAncillary.getAncillaryPlanId());

        AncillaryPlanDto updateParams = getDto;
        updateParams.setPlanName("Updated plan name");
        updateParams.getClasses().remove(0);
        updateParams.getClasses().get(0).setName("Updated class name");
        // set new carrier
        RfpCarrier newRfpCarrier = testEntityHelper.createTestRfpCarrier(CarrierType.METLIFE.name(), PlanCategory.LIFE.name());
        updateParams.setCarrierId(newRfpCarrier.getCarrier().getCarrierId());

        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/v1/plans/{clientId}/{id}/updateAncillary", 
        		client.getClientId(), updateParams.getAncillaryPlanId());

        flushAndClear();
        
        // check for updated Renewal by client plan
        
        RfpQuoteAncillaryOption updatedRenewal = rfpQuoteAncillaryOptionRepository.findOne(renewal.getRfpQuoteAncillaryOptionId());
        AncillaryPlan updatedRenewalPlan = updatedRenewal.getRfpQuoteAncillaryPlan().getAncillaryPlan();
        assertThat(updatedRenewalPlan.getPlanName()).isEqualTo(updateParams.getPlanName());
        assertThat(updatedRenewalPlan.getClasses()).hasSize(updateParams.getClasses().size());
        assertThat(updatedRenewalPlan.getClasses().get(0).getName()).isEqualTo("Updated class name");
        assertThat(updatedRenewal.getRfpQuote().getRfpSubmission().getRfpCarrier().getRfpCarrierId())
        	.isEqualTo(newRfpCarrier.getRfpCarrierId());
    }
    
    @Test
    public void testRenewalAncillaryInit() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.VOYA.name(), CarrierType.VOYA.displayName);
        
        // 1) Basic
        
        AncillaryPlan basicPlan = testEntityHelper.createTestAncillaryPlan("Basic Life",
                PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);
        ClientPlan cpLife = testEntityHelper.createTestAncillaryClientPlan(client, basicPlan, PlanCategory.LIFE);

        RfpQuoteOptionDto params = new RfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setProduct(PlanCategory.LIFE.name());
        
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null, "/broker/presentation/initOptions");

        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(params.getClientId(), params.getProduct());
        assertThat(rfpQuotes).hasSize(1);
    	RfpQuote rfpQuote = rfpQuotes.get(0);
    	List<RfpQuoteAncillaryOption> optionList = rfpQuoteAncillaryOptionRepository.findByRfpQuote(rfpQuote);
        assertThat(optionList).hasSize(1);
        RfpQuoteAncillaryOption renewal = optionList.get(0);
        assertThat(renewal.getName()).isEqualTo("Renewal");
        assertThat(renewal.getRfpQuote().getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(renewal.getRfpQuoteAncillaryPlan()).isNotNull();
        BasicRate baseRates = (BasicRate) renewal.getRfpQuoteAncillaryPlan().getAncillaryPlan().getRates();
        // check for initial renewal rates
        assertThat(baseRates.getCurrentADD()).isEqualTo(((BasicRate) basicPlan.getRates()).getRenewalADD());
        assertThat(baseRates.getCurrentLife()).isEqualTo(((BasicRate) basicPlan.getRates()).getRenewalLife());

        // 2) Voluntary
        
        AncillaryPlan volPlan = testEntityHelper.createTestAncillaryPlan("Vol Life",
        		PlanCategory.VOL_LIFE, AncillaryPlanType.VOLUNTARY, carrier);
        VoluntaryRate cpVolRate = (VoluntaryRate) volPlan.getRates();
        ClientPlan cpVolLife = testEntityHelper.createTestAncillaryClientPlan(client, volPlan, PlanCategory.VOL_LIFE);

        params = new RfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setProduct(PlanCategory.VOL_LIFE.name());
        
        result = performPostAndAssertResult(jsonUtils.toJson(params), null, "/broker/presentation/initOptions");

        rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(params.getClientId(), params.getProduct());
        assertThat(rfpQuotes).hasSize(1);
    	rfpQuote = rfpQuotes.get(0);
    	optionList = rfpQuoteAncillaryOptionRepository.findByRfpQuote(rfpQuote);
        assertThat(optionList).hasSize(1);
        renewal = optionList.get(0);
        
        assertThat(renewal.getName()).isEqualTo("Renewal");
        assertThat(renewal.getRfpQuote().getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(renewal.getRfpQuoteAncillaryPlan()).isNotNull();
        VoluntaryRate volRates = (VoluntaryRate) renewal.getRfpQuoteAncillaryPlan().getAncillaryPlan().getRates();
        // check for initial renewal rates
        assertThat(volRates.getAges()).hasSize(2);
        assertThat(volRates.getAges()).extracting(AncillaryRateAge::getCurrentEmp)
        	.containsExactlyInAnyOrder(
        			cpVolRate.getAges().get(0).getRenewalEmp(),
        			cpVolRate.getAges().get(1).getRenewalEmp());
    }

    @Test
    public void testRenewal_InitByProduct_Multiple_Carriers() throws Exception {
        Client client = testEntityHelper.createTestClient();

        ClientPlan cpMedical = testEntityHelper.createTestClientPlan("Medical Client plan", client, CarrierType.AETNA.name(), "HMO");
        ClientPlan cpMedical2 = testEntityHelper.createTestClientPlan("Medical Client plan", client, CarrierType.UHC.name(), "HMO");

        RfpQuoteOptionDto params = new RfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setProduct(Constants.MEDICAL);

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null, "/broker/presentation/initOptions");

        // These three lines are required because this method breaks out of the security context
        // (not within the @Test scope)
        SecurityContext sc = (SecurityContext) mockSession.getAttribute(SPRING_SECURITY_CONTEXT_KEY);
        SecurityContextHolder.setContext(sc);
        SecurityContextHolder.getContext().setAuthentication(sc.getAuthentication());

        QuoteOptionListDto optList = rfpQuoteService.getQuoteOptions(params.getClientId(), params.getProduct());

        assertThat(optList.getOptions()).hasSize(1);
        QuoteOptionBriefDto renewal = optList.getOptions().get(0);
        assertThat(renewal.getName()).isEqualTo("Renewal");
        assertThat(renewal.getCarrier()).isEqualTo("Multiple Carriers");
    }
    
    protected RfpQuoteOption testRenewal_Init(RfpQuoteOptionDto params) throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/broker/presentation/initOptions")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .content(jsonUtils.toJson(params))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        // These three lines are required because this method breaks out of the security context
        // (not within the @Test scope)
        SecurityContext sc = (SecurityContext) mockSession.getAttribute(SPRING_SECURITY_CONTEXT_KEY);
        SecurityContextHolder.setContext(sc);
        SecurityContextHolder.getContext().setAuthentication(sc.getAuthentication());

        QuoteOptionListDto optList = rfpQuoteService.getQuoteOptions(params.getClientId(), params.getProduct());
        
        assertThat(optList.getCurrentOption()).isNotNull();
        assertThat(optList.getCurrentOption().getName()).isEqualTo(Constants.CURRENT_NAME);
        
        assertThat(optList.getOptions()).hasSize(1);
        QuoteOptionBriefDto renewal = optList.getOptions().get(0);
        assertThat(renewal.getName()).isEqualTo("Renewal");
        
        RfpQuoteOption renewalOption = rfpQuoteOptionRepository.findOne(renewal.getId());
        assertThat(renewalOption).isNotNull();
        
        return renewalOption;
    }

    @Test
    public void testRenewal_Init_Virgin_Product() throws Exception {
        Client client = testEntityHelper.createTestClient();
        ClientRfpProduct medicalRfpProduct = testEntityHelper.createTestClientRfpProduct(client, MEDICAL);
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);
        ClientPlan cpMedical = testEntityHelper.createTestClientPlan("Medical Client plan", client, CarrierType.OTHER.name(), "HMO");

        RfpQuoteOptionDto params = new RfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setProduct(MEDICAL);
        params.setCarrierId(carrier.getCarrierId());

        // Client has medical rfp product and is not virgin
        RfpQuoteOption renewalOption = testRenewal_Init(params);
        rfpQuoteService.deleteQuoteOption(renewalOption.getOptionId());
        //rfpQuoteOptionRepository.delete(renewalOption.getOptionId());

        // Now change client rfp medical product with virgin = true
        medicalRfpProduct.setVirginGroup(true);
        clientRfpProductRepository.save(medicalRfpProduct);

        mockMvc.perform(MockMvcRequestBuilders.post("/broker/presentation/initOptions")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .content(jsonUtils.toJson(params))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        List<RfpQuoteOption> rfpQuoteOptions = rfpQuoteOptionRepository.findByClientIdAndCategory(params.getClientId(), params.getProduct());
        assertThat(rfpQuoteOptions.stream().anyMatch(opt -> opt.getRfpQuoteOptionName().equals("Renewal"))).isFalse();
    }

    @Test
    public void testRenewal_Init_Update_ByCurrent() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);
        ClientPlan cpMedical = testEntityHelper.createTestClientPlan("Medical Client plan", client, CarrierType.OTHER.name(), "HMO");
        ClientPlan cpMedical2 = testEntityHelper.createTestClientPlan("Medical Client plan", client, CarrierType.OTHER.name(), "PPO");

        RfpQuoteOptionDto params = new RfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setProduct(MEDICAL);
        params.setCarrierId(carrier.getCarrierId());
         
        RfpQuoteOption renewalOption = testRenewal_Init(params);
        
        flushAndClear();
        
        // Update Current option and create new plans
        
        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork("Plan 1", carrier.getName(), "HMO");
        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork("Plan 2", carrier.getName(), "PPO");
        RfpQuoteOptionDto updateParams = new RfpQuoteOptionDto();
        updateParams.setClientId(client.getClientId());
        updateParams.setProduct(MEDICAL);
        updateParams.setRatingTiers(1);
        OptionPlanDto plan1 = new OptionPlanDto();
        plan1.setIncumbentPlanName(pnn1.getName());
        plan1.setIncumbentNetworkId(pnn1.getNetwork().getNetworkId());
        plan1.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        plan1.setTier1Contribution(100f);
        plan1.setTier1Enrollment(10L);
        plan1.setTier1Rate(1000f);
        updateParams.getOptionPlans().add(plan1);
        OptionPlanDto plan2 = new OptionPlanDto();
        plan2.setIncumbentPlanName(pnn2.getName());
        plan2.setIncumbentNetworkId(pnn2.getNetwork().getNetworkId());
        plan2.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        plan2.setTier1Contribution(200f);
        plan2.setTier1Enrollment(20L);
        plan2.setTier1Rate(2000f);
        updateParams.getOptionPlans().add(plan2);

        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        RfpQuoteOptionDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);

        flushAndClear();
        
        renewalOption = rfpQuoteOptionRepository.findOne(renewalOption.getRfpQuoteOptionId());
        
        assertThat(renewalOption.getRfpQuoteOptionNetworks()).hasSize(2);
        assertThat(renewalOption.getRfpQuoteOptionNetworks())
            .extracting(r -> r.getClientPlan().getPnn().getName())
            .containsExactlyInAnyOrder(pnn1.getName(), pnn2.getName());
        assertThat(renewalOption.getRfpQuoteOptionNetworks())
            .extracting(RfpQuoteOptionNetwork::getTier1Census)
            .containsExactlyInAnyOrder(plan1.getTier1Enrollment(), plan2.getTier1Enrollment());
        assertThat(renewalOption.getRfpQuoteOptionNetworks())
            .extracting(RfpQuoteOptionNetwork::getTier1ErContribution)
            .containsExactlyInAnyOrder(plan1.getTier1Contribution(), plan2.getTier1Contribution());
        // no check for updated rates: renewal rates can be updated only 1) on RFP submit or 2) Renewal option update
        
        
        // find client plan and update renewal (emulate external change after RFP submit)
        ClientPlan cp2 = renewalOption.getRfpQuoteOptionNetworks().stream()
            .map(RfpQuoteOptionNetwork::getClientPlan)
            .filter(cp -> cp.getPnn().getName().equals(pnn2.getName()))
            .findFirst().orElse(null);
        assertThat(cp2).isNotNull();
        cp2.setTier1Renewal(12345f);
        clientPlanRepository.save(cp2);
        
        // Update Current option plans and check for updated Renewal
        
        updateParams = updated;
        // remove Plan 1 and add Plan 3 (Kaiser to update quote type to KAISER)
        updateParams.getOptionPlans().remove(0);
        
        Carrier kaiserCarrier = testEntityHelper.createTestCarrier(CarrierType.KAISER.name(), CarrierType.KAISER.displayName);
        PlanNameByNetwork pnn3 = testEntityHelper.createTestPlanNameByNetwork("Plan 3", kaiserCarrier.getName(), "HSA");
        
        OptionPlanDto plan3 = new OptionPlanDto();
        plan3.setIncumbentPlanName(pnn3.getName());
        plan3.setIncumbentNetworkId(pnn3.getNetwork().getNetworkId());
        plan3.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        plan3.setTier1Contribution(300f);
        plan3.setTier1Enrollment(30L);
        plan3.setTier1Rate(3000f);
        updateParams.getOptionPlans().add(plan3);

        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        assertThat(updated.getQuoteType()).isEqualTo(QuoteType.KAISER);
        
        flushAndClear();
        
        renewalOption = rfpQuoteOptionRepository.findOne(renewalOption.getRfpQuoteOptionId());
        
        assertThat(renewalOption.getRfpQuote().getQuoteType()).isEqualTo(QuoteType.KAISER);
        assertThat(renewalOption.getRfpQuoteOptionNetworks()).hasSize(2);
        assertThat(renewalOption.getRfpQuoteOptionNetworks())
            .extracting(r -> r.getClientPlan().getPnn().getName())
            .containsExactlyInAnyOrder(pnn2.getName(), pnn3.getName());
        assertThat(renewalOption.getRfpQuoteOptionNetworks())
            .extracting(RfpQuoteOptionNetwork::getTier1Census)
            .containsExactlyInAnyOrder(plan2.getTier1Enrollment(), plan3.getTier1Enrollment());
        assertThat(renewalOption.getRfpQuoteOptionNetworks())
            .extracting(RfpQuoteOptionNetwork::getTier1ErContribution)
            .containsExactlyInAnyOrder(plan2.getTier1Contribution(), plan3.getTier1Contribution());
        assertThat(renewalOption.getRfpQuoteOptionNetworks())
            .extracting(r -> r.getSelectedRfpQuoteNetworkPlan().getTier1Rate())
            .containsExactlyInAnyOrder(
                0F, // new created client plan "Plan 3"
                0F); // renewal rates no longer updated from current
    }
    
    @Test
    public void testCurrent_Update_BandedRateType() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);

        // Update Current option and create new plans
        
        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork("Plan 1", carrier.getName(), "HMO");
      
        RfpQuoteOptionDto updateParams = new RfpQuoteOptionDto();
        updateParams.setClientId(client.getClientId());
        updateParams.setProduct(MEDICAL);
        updateParams.setRatingTiers(2);
        OptionPlanDto plan1 = new OptionPlanDto();
        plan1.setIncumbentPlanName(pnn1.getName());
        plan1.setIncumbentNetworkId(pnn1.getNetwork().getNetworkId());
        plan1.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        plan1.setTier1Contribution(100f);
        plan1.setTier1Enrollment(10L);
        plan1.setTier2Contribution(200f);
        plan1.setTier2Enrollment(20L);
        plan1.setRateType(RateType.BANDED);
        plan1.setMonthlyBandedPremium(1000f);
        updateParams.getOptionPlans().add(plan1);

        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        RfpQuoteOptionDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        assertThat(updated).hasNoNullFieldsOrPropertiesExcept("rfpQuoteOptionId");
        assertThat(updated.getOptionPlans()).hasSize(1);
        // RateType.BANDED plan have filled Tier1Rate and Tier2Rate only (see  updateParams.setRatingTiers(2))
        assertThat(updated.getRatingTiers()).isEqualTo(2);
        
        for(OptionPlanDto plan : updated.getOptionPlans()) {
            // 100 = MonthlyBandedPremium (1000) / totalEnrollment (30)
            assertThat(plan.getTier1Rate()).isEqualTo(33.33f);
            assertThat(plan.getTier2Rate()).isEqualTo(33.33f);
            // raringTuers = 2 => tier3 and tier4 rates are empty
            assertThat(plan.getTier3Rate()).isEqualTo(0f);
            assertThat(plan.getTier4Rate()).isEqualTo(0f);
            assertThat(plan.getRateType()).isEqualTo(RateType.BANDED); 
        }
    }
    
    @Test
    public void testQuoteOption_Update_BandedRateType() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, MEDICAL);
        
        ClientPlan cpHmo = testEntityHelper.createTestClientPlan(client, "Client plan 1", "HMO");
   
        Long optionId = rfpQuoteService.createQuoteOption(client.getClientId(), rfpCarrier.getRfpCarrierId(), 
            null, QuoteType.STANDARD, OptionType.OPTION);

        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(optionId);
        presentationService.createRfpQuoteOptionNetworkByClientPlan(option, cpHmo);

        MvcResult result = performGetAndAssertResult(token, (Object) null, "/broker/presentation/getOption",
            "rfpQuoteOptionId", optionId);
        RfpQuoteOptionDto toUpdate = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);

        RfpQuoteOptionDto updateParams = toUpdate;
        assertThat(toUpdate.getOptionPlans()).hasSize(1);
        OptionPlanDto planToUpdate = toUpdate.getOptionPlans().get(0);
        assertThat(planToUpdate.getRateType()).isEqualTo(RateType.COMPOSITE);
        assertThat(planToUpdate.getMonthlyBandedPremium()).isNull();
        // set new rate type
        planToUpdate.setRateType(RateType.BANDED);
        planToUpdate.setMonthlyBandedPremium(1000f);

        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        RfpQuoteOptionDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);

        assertThat(updated.getOptionPlans()).hasSize(1);
        OptionPlanDto updatedPlan = updated.getOptionPlans().get(0);
        assertThat(updatedPlan.getRateType()).isEqualTo(RateType.BANDED);
        assertThat(updatedPlan.getMonthlyBandedPremium()).isEqualTo(1000f);
        long totalEnrollment = updatedPlan.getTier1Enrollment() + updatedPlan.getTier2Enrollment() 
            + updatedPlan.getTier3Enrollment() + updatedPlan.getTier4Enrollment();
        assertThat(updatedPlan.getTier1Rate()).isEqualTo(1000f / totalEnrollment, Offset.offset(0.001f));
        assertThat(updatedPlan.getTier2Rate()).isEqualTo(1000f / totalEnrollment, Offset.offset(0.001f));
        assertThat(updatedPlan.getTier3Rate()).isEqualTo(1000f / totalEnrollment, Offset.offset(0.001f));
        assertThat(updatedPlan.getTier4Rate()).isEqualTo(1000f / totalEnrollment, Offset.offset(0.001f));
    }
    
    @Test
    public void testCurrent_Update_Create_Update_Pnn() throws Exception {
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);
            
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);

        // Create new ClientPlan and new IncumbentPlan
        
        Network network = testEntityHelper.createTestNetwork(carrier, "HMO", "Test HMO network");
       
        RfpQuoteOptionDto updateParams = new RfpQuoteOptionDto();
        updateParams.setClientId(client.getClientId());
        updateParams.setProduct(MEDICAL);
        updateParams.setRatingTiers(1);
        OptionPlanDto plan1 = new OptionPlanDto();
        // create pnn by IncumbentPlanName and IncumbentNetworkId
        plan1.setIncumbentPlanName("Plan 1");
        plan1.setIncumbentNetworkId(network.getNetworkId());  
        plan1.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        plan1.setTier1Contribution(100f);
        plan1.setTier1Enrollment(10L);
        plan1.setTier1Rate(1000f);
        updateParams.getOptionPlans().add(plan1);

        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        RfpQuoteOptionDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);

        assertThat(updated.getOptionPlans()).hasSize(1);
        assertThat(updated.getOptionPlans().get(0).getIncumbentPlanId()).isNotNull(); // new created pnn
        assertThat(updated.getOptionPlans().get(0).getIncumbentPlanName()).isEqualTo(plan1.getIncumbentPlanName());
        assertThat(updated.getOptionPlans().get(0).getIncumbentNetworkId()).isEqualTo(network.getNetworkId());
        assertThat(updated.getOptionPlans().get(0).getIncumbentNetworkName()).isEqualTo(network.getName());

        final Long incumbentPlanId = updated.getOptionPlans().get(0).getIncumbentPlanId();
        
        // Create new ClientPlan and use existing IncumbentPlan
        
        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork(
            "Plan 2", carrier.getName(), "PPO", "Test HMO network 1");
        pnn2.setCustomPlan(false);
        pnn2.setClientId(client.getClientId());
        pnn2 = pnnRepository.save(pnn2);
        
        updateParams = updated;
        OptionPlanDto plan2 = new OptionPlanDto();
        // create pnn by IncumbentPlanName and IncumbentNetworkId
        plan2.setIncumbentPlanName(pnn2.getName());
        plan2.setIncumbentNetworkId(pnn2.getNetwork().getNetworkId());  
        plan2.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        plan2.setTier1Contribution(100f);
        plan2.setTier1Enrollment(10L);
        plan2.setTier1Rate(1000f);
        updateParams.getOptionPlans().add(plan2);
        
        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        assertThat(updated.getOptionPlans()).hasSize(2);
        
        OptionPlanDto updatedPlan = null;
        for(OptionPlanDto plan : updated.getOptionPlans()) {
            if(plan.getIncumbentPlanName().equals("Plan 1")) { // not changed
                assertThat(plan.getIncumbentPlanId()).isEqualTo(incumbentPlanId);
                assertThat(plan.getIncumbentNetworkName()).isEqualTo(network.getName());
                assertThat(plan.getIncumbentNetworkId()).isEqualTo(network.getNetworkId());
            } else {
                assertThat(plan.getIncumbentPlanName()).isEqualTo(pnn2.getName());
                assertThat(plan.getIncumbentPlanId()).isEqualTo(pnn2.getPnnId());
                assertThat(plan.getIncumbentNetworkName()).isEqualTo(pnn2.getNetwork().getName());
                assertThat(plan.getIncumbentNetworkId()).isEqualTo(pnn2.getNetwork().getNetworkId());
                
                updatedPlan = plan;
            }
        }
        
        // Update IncumbentPlanName and IncumbentNetworkId to different network with same type (PPO -> PPO)
        
        Network network2 = testEntityHelper.createTestNetwork(carrier, "PPO", "Test PPO network 2");
        
        updateParams = updated;
        updatedPlan.setIncumbentPlanName("Plan 3");
        updatedPlan.setIncumbentNetworkId(network2.getNetworkId());
        
        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        assertThat(updated.getOptionPlans()).hasSize(2);
        
        for(OptionPlanDto plan : updated.getOptionPlans()) {
            if(plan.getIncumbentPlanName().equals("Plan 1")) { // not changed
                assertThat(plan.getIncumbentPlanId()).isEqualTo(incumbentPlanId);
                assertThat(plan.getIncumbentNetworkName()).isEqualTo(network.getName());
                assertThat(plan.getIncumbentNetworkId()).isEqualTo(network.getNetworkId());
            } else {
                // pnnId not changed
                assertThat(plan.getIncumbentPlanId()).isEqualTo(pnn2.getPnnId());
                // but...
                assertThat(plan.getIncumbentPlanName()).isEqualTo("Plan 3");
                assertThat(plan.getIncumbentNetworkName()).isEqualTo(network2.getName());
                assertThat(plan.getIncumbentNetworkId()).isEqualTo(network2.getNetworkId());
                
                updatedPlan = plan;
            }
        } 
        
        // Update IncumbentPlanName and IncumbentNetworkId to network with different type (PPO -> HSA)
        
        Network network3 = testEntityHelper.createTestNetwork(carrier, "HSA", "Test HSA network");
        
        updateParams = updated;
        updatedPlan.setIncumbentPlanName("Plan 4");
        updatedPlan.setIncumbentNetworkId(network3.getNetworkId());
        
        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        assertThat(updated.getOptionPlans()).hasSize(2);
        
        for(OptionPlanDto plan : updated.getOptionPlans()) {
            if(plan.getIncumbentPlanName().equals("Plan 1")) { // not changed
                assertThat(plan.getIncumbentPlanId()).isEqualTo(incumbentPlanId);
                assertThat(plan.getIncumbentNetworkName()).isEqualTo(network.getName());
                assertThat(plan.getIncumbentNetworkId()).isEqualTo(network.getNetworkId());
            } else {
                // pnnId have changed (NOT equal)
                assertThat(plan.getIncumbentPlanId()).isNotEqualTo(pnn2.getPnnId());
                // networr and name have changed as well
                assertThat(plan.getIncumbentPlanName()).isEqualTo("Plan 4");
                assertThat(plan.getIncumbentNetworkName()).isEqualTo(network3.getName());
                assertThat(plan.getIncumbentNetworkId()).isEqualTo(network3.getNetworkId());
            }
        } 
    }

    @Test
    public void testCurrent_Update_UpdateRenewalCarrier() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);
        Carrier aetnaCarrier = testEntityHelper.createTestCarrier(CarrierType.AETNA.name(), CarrierType.AETNA.displayName);
        ClientPlan cpMedical = testEntityHelper.createTestClientPlan("Medical Client plan", client, CarrierType.OTHER.name(), "HMO");
        ClientPlan cpMedical2 = testEntityHelper.createTestClientPlan("Medical Client plan", client, CarrierType.OTHER.name(), "PPO");

        RfpQuoteOptionDto params = new RfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setProduct(MEDICAL);
        params.setCarrierId(carrier.getCarrierId());

        RfpQuoteOption renewalOption = testRenewal_Init(params);
        flushAndClear();

        // Update Current option and create new plans
        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork("Plan 1", aetnaCarrier.getName(), "HMO");
        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork("Plan 2", aetnaCarrier.getName(), "PPO");
        RfpQuoteOptionDto updateParams = new RfpQuoteOptionDto();
        updateParams.setClientId(client.getClientId());
        updateParams.setProduct(MEDICAL);
        updateParams.setRatingTiers(1);
        OptionPlanDto plan1 = new OptionPlanDto();
        plan1.setIncumbentPlanName(pnn1.getName());
        plan1.setIncumbentNetworkId(pnn1.getNetwork().getNetworkId());
        plan1.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        plan1.setTier1Contribution(100f);
        plan1.setTier1Enrollment(10L);
        plan1.setTier1Rate(1000f);
        updateParams.getOptionPlans().add(plan1);
        OptionPlanDto plan2 = new OptionPlanDto();
        plan2.setIncumbentPlanName(pnn2.getName());
        plan2.setIncumbentNetworkId(pnn2.getNetwork().getNetworkId());
        plan2.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        plan2.setTier1Contribution(200f);
        plan2.setTier1Enrollment(20L);
        plan2.setTier1Rate(2000f);
        updateParams.getOptionPlans().add(plan2);

        // assert renewal carrier is OTHER
        assertThat(renewalOption.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier().getName()).isEqualTo(CarrierType.OTHER.name());

        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        RfpQuoteOptionDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);

        flushAndClear();

        renewalOption = rfpQuoteOptionRepository.findOne(renewalOption.getRfpQuoteOptionId());
        // assert renewal carrier changed to AETNA
        assertThat(renewalOption.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier().getName()).isEqualTo(CarrierType.AETNA.name());
    }

    @Test
    public void testCurrent_Update_Get() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);

        // Update Current option and create new plans
        
        Network network1 = testEntityHelper.createTestNetwork(carrier, "HMO", "Test HMO network");
        Network network2 = testEntityHelper.createTestNetwork(carrier, "PPO", "Test PPO network");
        RfpQuoteOptionDto updateParams = new RfpQuoteOptionDto();
        updateParams.setClientId(client.getClientId());
        updateParams.setProduct(MEDICAL);
        updateParams.setRatingTiers(1);
        OptionPlanDto plan1 = new OptionPlanDto();
        // create pnn by IncumbentPlanName and IncumbentNetworkId
        plan1.setIncumbentPlanName("Plan 1");
        plan1.setIncumbentNetworkId(network1.getNetworkId());  
        plan1.setErContributionFormat(Constants.ER_CONTRIBUTION_TYPE_VOLUNTARY);
        plan1.setTier1Contribution(100f);
        plan1.setTier1Enrollment(10L);
        plan1.setTier1Rate(1000f);
        updateParams.getOptionPlans().add(plan1);
        OptionPlanDto plan2 = new OptionPlanDto();
        plan2.setIncumbentPlanName("Plan 2");
        plan2.setIncumbentNetworkId(network2.getNetworkId());  
        plan2.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_PERCENT);
        plan2.setTier1Contribution(90f);
        plan2.setTier1Enrollment(20L);
        plan2.setTier1Rate(2000f);
        // should be ignored by input RatingTiers = 1
        plan2.setTier2Contribution(90f);
        plan2.setTier2Enrollment(20L);
        plan2.setTier2Rate(2000f);
        updateParams.getOptionPlans().add(plan2);
        
        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        RfpQuoteOptionDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        assertThat(updated).hasNoNullFieldsOrPropertiesExcept("rfpQuoteOptionId");
        assertThat(updated.getOptionPlans()).hasSize(2);
        // check for correct calculated RatingTiers
        assertThat(updated.getRatingTiers()).isEqualTo(1);
        
        for(OptionPlanDto plan : updated.getOptionPlans()) {
            assertThat(plan.getPlanId()).isNotNull();
            assertThat(plan.getCarrierDisplayName()).isEqualTo(carrier.getDisplayName());
            assertThat(plan.getIncumbentPlanName()).isNotNull();
            assertThat(plan.getIncumbentNetworkName()).isNotNull();
            if(plan.getIncumbentPlanName().equals("Plan 1")) {
                // last contribution format of plan replaces RFP/Option contribution format
                assertThat(plan.getErContributionFormat()).isEqualTo(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
                // default value for VOLUNTARY
                assertThat(plan.getTier1Contribution()).isZero();
            } else {
                assertThat(plan.getTier1Contribution()).isNotZero();
            }
            assertThat(plan.getTier1Rate()).isNotZero();
            assertThat(plan.getTier1Enrollment()).isNotZero();
            // should be = 0 (default stored value in DB)
            assertThat(plan.getTier2Rate()).isZero();
            assertThat(plan.getTier2Contribution()).isZero();
            assertThat(plan.getTier2Enrollment()).isZero();
        }
        
        // Update Current option plan rates
        
        updateParams = updated;
        updateParams.setRatingTiers(2);
        OptionPlanDto updatedPlan = updateParams.getOptionPlans().get(1);
        updatedPlan.setTier2Rate(100f);
        updatedPlan.setTier2Contribution(200f);
        updatedPlan.setTier2Enrollment(200L);
        
        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        assertThat(updated.getOptionPlans()).hasSize(2);
        assertThat(updated.getRatingTiers()).isEqualTo(2);
        
        for(OptionPlanDto plan : updated.getOptionPlans()) {
            if(plan.getIncumbentPlanId().equals(updatedPlan.getIncumbentPlanId())) {
                assertThat(plan.getIncumbentPlanName()).isEqualTo("Plan 2");
                assertThat(plan.getTier2Rate()).isEqualTo(updatedPlan.getTier2Rate());
                assertThat(plan.getTier2Contribution()).isEqualTo(updatedPlan.getTier2Contribution());
                assertThat(plan.getTier2Enrollment()).isEqualTo(updatedPlan.getTier2Enrollment()); 
            } else {
                assertThat(plan.getIncumbentPlanName()).isEqualTo("Plan 1");
                assertThat(plan.getErContributionFormat()).isEqualTo(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
                assertThat(plan.getTier2Rate()).isEqualTo(0f);
                assertThat(plan.getTier2Contribution()).isEqualTo(0f);
                assertThat(plan.getTier2Enrollment()).isEqualTo(0L);
            }       
        }
        
        // Get Current option 
        
        result = performGetAndAssertResult((Object) null, "/broker/presentation/getOption", 
            "clientId", client.getClientId(), "product", MEDICAL);
        RfpQuoteOptionDto found = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        assertThat(found).isEqualToComparingFieldByFieldRecursively(updated);
    }

    @Test
    public void testRenewal_rider_cost_included() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper
            .createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);

        RfpQuoteOptionDto params = new RfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setProduct(MEDICAL);
        params.setCarrierId(carrier.getCarrierId());
        ClientPlan cpHmo = testEntityHelper.createTestClientPlan(client, "Client plan 1", "HMO");
        cpHmo.setTier1Renewal(400F);
        cpHmo.setTier2Renewal(1100F);
        cpHmo.setTier3Renewal(800F);
        cpHmo.setTier4Renewal(1400F);
        clientPlanRepository.save(cpHmo);

        RfpQuoteOption renewalOption = testRenewal_Init(params);
        Rider rider = testEntityHelper.createTestRider("CG9", 4.23F, 10.15F, 7.40F, 12.50F);
        for(RfpQuoteOptionNetwork rqon : renewalOption.getRfpQuoteOptionNetworks()){
            RfpQuoteNetwork rqn = rqon.getRfpQuoteNetwork();
            rqn.getRiders().add(rider);
            rqon.getSelectedRiders().add(rider);
        }

        flushAndClear();
        MvcResult result = performGetAndAssertResult((Object) null, "/broker/presentation/getOption",
            "rfpQuoteOptionId", renewalOption.getRfpQuoteOptionId());
        RfpQuoteOptionDto found = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        for(OptionPlanDto planDto : found.getOptionPlans()){
            assertThat(planDto.getTier1Rate()).isEqualTo(cpHmo.getTier1Renewal() + rider.getTier1Rate());
            assertThat(planDto.getTier2Rate()).isEqualTo(cpHmo.getTier2Renewal() + rider.getTier2Rate());
            assertThat(planDto.getTier3Rate()).isEqualTo(cpHmo.getTier3Renewal() + rider.getTier3Rate());
            assertThat(planDto.getTier4Rate()).isEqualTo(cpHmo.getTier4Renewal() + rider.getTier4Rate());
        }
    }

    @Test
    public void testRenewal_Init_Update_Get() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);
        
        RfpQuoteOptionDto params = new RfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setProduct(MEDICAL);
        params.setCarrierId(carrier.getCarrierId());
        ClientPlan cpHmo = testEntityHelper.createTestClientPlan(client, "Client plan 1", "HMO");
        ClientPlan cpPpo = testEntityHelper.createTestClientPlan(client, "Client plan 2", "PPO");
         
        RfpQuoteOption renewalOption = testRenewal_Init(params);
        
        // add test renewal plans
//        RfpQuoteNetwork rqnHmo = testEntityHelper.createTestQuoteNetwork(renewalOption.getRfpQuote(), "HMO");
//        RfpQuoteNetwork rqnPpo = testEntityHelper.createTestQuoteNetwork(renewalOption.getRfpQuote(), "HMO");
//        RfpQuoteNetworkPlan planHmo = testEntityHelper.createTestRfpQuoteNetworkPlan("plan 1", rqnHmo, 100f, 120f, 140f, 160f);
//        RfpQuoteOptionNetwork rqonHmo = testEntityHelper.createTestRfpQuoteOptionNetwork(renewalOption, rqnHmo, planHmo, cpHmo, 10L, 15L, 20L, 25L, "DOLLAR", 81f, 82f, 83f, 84f);
//        RfpQuoteNetworkPlan planPpo = testEntityHelper.createTestRfpQuoteNetworkPlan("plan 2", rqnHmo, 101f, 121f, 141f, 161f);
//        RfpQuoteOptionNetwork rqonPpo = testEntityHelper.createTestRfpQuoteOptionNetwork(renewalOption, rqnPpo, planPpo, cpPpo, 30L, 35L, 40L, 45L, "DOLLAR", 91f, 92f, 93f, 94f);
//
        flushAndClear();
        
        // find option to get original parameters
        
        MvcResult result = performGetAndAssertResult((Object) null, "/broker/presentation/getOption", 
            "rfpQuoteOptionId", renewalOption.getRfpQuoteOptionId());
        
        RfpQuoteOptionDto found = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        assertThat(found).hasNoNullFieldsOrProperties();
        assertThat(found.getOptionPlans()).hasSize(2);
        
        // Update Renewal option and create new plans

        RfpQuoteOptionDto updateParams = found;

        OptionPlanDto plan1 = updateParams.getOptionPlans().get(0);
        OptionPlanDto plan2 = updateParams.getOptionPlans().get(1);

        RfpQuoteOptionNetwork rqonHmo = rfpQuoteOptionNetworkRepository.findOne(plan1.getPlanId());
        RfpQuoteOptionNetwork rqonPpo = rfpQuoteOptionNetworkRepository.findOne(plan2.getPlanId());
        RfpQuoteNetworkPlan planPpo = rqonPpo.getSelectedRfpQuoteNetworkPlan();
        RfpQuoteNetworkPlan planHmo = rqonHmo.getSelectedRfpQuoteNetworkPlan();

        plan1.setTier1Rate(1000f);
        plan1.setTier1Contribution(null);
        plan2.setTier1Rate(2000f);
        plan2.setTier1Contribution(null);

        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        RfpQuoteOptionDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        assertThat(updated).hasNoNullFieldsOrProperties();
        assertThat(updated.getOptionPlans()).hasSize(2);
        
        for(OptionPlanDto plan : updated.getOptionPlans()) {
            if(plan.getPlanId().equals(rqonHmo.getRfpQuoteOptionNetworkId())) {
                assertThat(plan.getTier1Rate()).isEqualTo(plan1.getTier1Rate());
                assertThat(plan.getTier2Rate()).isEqualTo(planHmo.getTier2Rate()); // not updated
                assertThat(plan.getTier1Contribution()).isEqualTo(rqonHmo.getTier1ErContribution()); // not updated
            } else {
                assertThat(plan.getTier1Rate()).isEqualTo(plan2.getTier1Rate());
                assertThat(plan.getTier2Rate()).isEqualTo(planPpo.getTier2Rate()); // not updated
                assertThat(plan.getTier1Contribution()).isEqualTo(rqonPpo.getTier1ErContribution()); // not updated
            }       
        }
        
        // Get Renewal option 
        
        result = performGetAndAssertResult((Object) null, "/broker/presentation/getOption", 
            "rfpQuoteOptionId", renewalOption.getRfpQuoteOptionId());
        found = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        assertThat(found).isEqualToComparingFieldByFieldRecursively(updated);
    }
    
    @Test
    public void testQuoteOption_Get_PlanTemplateByCurrent() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, MEDICAL);
        
        ClientPlan cpHmo = testEntityHelper.createTestClientPlan(client, "Client plan 1", "HMO");
        ClientPlan cpPpo = testEntityHelper.createTestClientPlan(client, "Client plan 2", "PPO");
        
        Long optionId = rfpQuoteService.createQuoteOption(client.getClientId(), rfpCarrier.getRfpCarrierId(), 
            null, QuoteType.STANDARD, OptionType.OPTION);

        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(optionId);
        RfpQuoteOptionNetwork plan1 = presentationService.createRfpQuoteOptionNetworkByClientPlan(option, cpHmo);
        RfpQuoteOptionNetwork plan2 = presentationService.createRfpQuoteOptionNetworkByClientPlan(option, cpPpo);
        
        MvcResult result = performGetAndAssertResult((Object) null, "/broker/presentation/getOption", 
            "rfpQuoteOptionId", optionId);
        RfpQuoteOptionDto found = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        assertThat(found).isNotNull();
        assertThat(found.getOptionPlans()).hasSize(2);
        assertThat(found.getOptionPlans()).extracting(OptionPlanDto::getIncumbentPlanName)
            .containsExactlyInAnyOrder(cpHmo.getPnn().getName(), cpPpo.getPnn().getName());
        assertThat(found.getOptionPlans()).extracting(OptionPlanDto::getIncumbentPlanId)
            .containsExactlyInAnyOrder(cpHmo.getClientPlanId(), cpPpo.getClientPlanId());
        assertThat(found.getOptionPlans()).extracting(OptionPlanDto::getPlanId)
            .containsExactlyInAnyOrder(
                plan1.getRfpQuoteOptionNetworkId(), 
                plan2.getRfpQuoteOptionNetworkId());
        assertThat(found.getOptionPlans()).extracting(OptionPlanDto::getReplacementPlanId)
            .containsExactlyInAnyOrder(
                plan1.getSelectedRfpQuoteNetworkPlan().getPnn().getPnnId(),
                plan2.getSelectedRfpQuoteNetworkPlan().getPnn().getPnnId());
    }

    @Test
    public void testQuoteOption_Update() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, MEDICAL);
        
        ClientPlan cpHmo = testEntityHelper.createTestClientPlan(client, "Client plan 1", "HMO");
        ClientPlan cpPpo = testEntityHelper.createTestClientPlan(client, "Client plan 2", "PPO");
        
        Long optionId = rfpQuoteService.createQuoteOption(client.getClientId(), rfpCarrier.getRfpCarrierId(), 
            null, QuoteType.STANDARD, OptionType.OPTION);

        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(optionId);
        presentationService.createRfpQuoteOptionNetworkByClientPlan(option, cpHmo);
        presentationService.createRfpQuoteOptionNetworkByClientPlan(option, cpPpo);
        
        MvcResult result = performGetAndAssertResult(token, (Object) null, "/broker/presentation/getOption",
            "rfpQuoteOptionId", optionId);
        RfpQuoteOptionDto toUpdate = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        assertThat(toUpdate.getOptionPlans()).hasSize(2);
        
        RfpQuoteOptionDto updateParams = toUpdate;
        assertThat(updateParams.getRatingTiers()).isEqualTo(4);
        // set new value
        updateParams.setRatingTiers(3);
        
        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork("Plan 1", carrier.getName(), "HMO");
        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork("Plan 2", carrier.getName(), "PPO");

        for(OptionPlanDto plan : updateParams.getOptionPlans()) {
            if(plan.getIncumbentPlanId().equals(cpHmo.getClientPlanId())) {
                plan.setReplacementPlanId(pnn1.getPnnId());
                plan.setTier1Rate(1f);
                plan.setTier2Rate(2f);
                plan.setTier3Rate(3f);
                plan.setTier4Rate(4f); // should be ignored by RatingTiers = 3
            } else {
                plan.setReplacementPlanId(pnn2.getPnnId());
                plan.setTier1Rate(10f);
                plan.setTier2Rate(20f);
                plan.setTier3Rate(30f);
                plan.setTier4Rate(40f); // should be ignored by RatingTiers = 3
            }
        }

        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        RfpQuoteOptionDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);

        assertThat(updated.getOptionPlans()).extracting(OptionPlanDto::getIncumbentPlanId)
            .containsExactlyInAnyOrder(cpHmo.getClientPlanId(), cpPpo.getClientPlanId());
        assertThat(updated.getOptionPlans()).extracting(OptionPlanDto::getReplacementPlanId)
            .containsExactlyInAnyOrder(pnn1.getPnnId(), pnn2.getPnnId());
        
        assertThat(updated.getRatingTiers()).isEqualTo(3);
        
        for(OptionPlanDto plan : updated.getOptionPlans()) {
            assertThat(plan.getPlanId()).isNotNull();
            RfpQuoteOptionNetwork rqon = rfpQuoteOptionNetworkRepository.findOne(plan.getPlanId());
            assertThat(plan.getRateType()).isEqualTo(RateType.COMPOSITE);
            if(plan.getIncumbentPlanId().equals(cpHmo.getClientPlanId())) {
                assertThat(plan.getReplacementPlanId()).isEqualTo(pnn1.getPnnId());
                assertThat(rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getPnnId()).isEqualTo(pnn1.getPnnId());
                assertThat(rqon.getSelectedRfpQuoteNetworkPlan().getTier1Rate()).isEqualTo(1f);
                assertThat(rqon.getSelectedRfpQuoteNetworkPlan().getTier2Rate()).isEqualTo(2f);
                assertThat(rqon.getSelectedRfpQuoteNetworkPlan().getTier3Rate()).isEqualTo(3f);
                assertThat(rqon.getSelectedRfpQuoteNetworkPlan().getTier4Rate()).isEqualTo(0f);
            } else {
                assertThat(plan.getReplacementPlanId()).isEqualTo(pnn2.getPnnId());
                assertThat(rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getPnnId()).isEqualTo(pnn2.getPnnId());
                assertThat(rqon.getSelectedRfpQuoteNetworkPlan().getTier1Rate()).isEqualTo(10f);
                assertThat(rqon.getSelectedRfpQuoteNetworkPlan().getTier2Rate()).isEqualTo(20f);
                assertThat(rqon.getSelectedRfpQuoteNetworkPlan().getTier3Rate()).isEqualTo(30f);
                assertThat(rqon.getSelectedRfpQuoteNetworkPlan().getTier4Rate()).isEqualTo(0f);
            }
        }
    }
    
    @Test
    public void testQuoteOption_UpdateOutOfState() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, MEDICAL);
        
        ClientPlan cpHmo = testEntityHelper.createTestClientPlan(client, "Client plan 1", "HMO");
        ClientPlan cpPpo = testEntityHelper.createTestClientPlan(client, "Client plan 2", "PPO");
        
        Long optionId = rfpQuoteService.createQuoteOption(client.getClientId(), rfpCarrier.getRfpCarrierId(), 
            null, QuoteType.STANDARD, OptionType.OPTION);

        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(optionId);
        presentationService.createRfpQuoteOptionNetworkByClientPlan(option, cpHmo);
        presentationService.createRfpQuoteOptionNetworkByClientPlan(option, cpPpo);

        MvcResult result = performGetAndAssertResult(token, (Object) null, "/broker/presentation/getOption",
            "rfpQuoteOptionId", optionId);
        RfpQuoteOptionDto toUpdate = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        assertThat(toUpdate.getOptionPlans()).hasSize(2);
        
        RfpQuoteOptionDto updateParams = toUpdate;

        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork("Plan 1", carrier.getName(), "HMO");
        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork("Plan 2", carrier.getName(), "PPO");

        OptionPlanDto oosPlan = null;
        for(OptionPlanDto plan : updateParams.getOptionPlans()) {
            if(plan.getIncumbentPlanId().equals(cpHmo.getClientPlanId())) {
                plan.setReplacementPlanId(pnn1.getPnnId());
                plan.setTier1Rate(1f);
                plan.setTier1OosRate(555f);
                plan.setOutOfStateRate(true);
                oosPlan = plan;
            } else {
                plan.setReplacementPlanId(pnn2.getPnnId());
                plan.setTier1Rate(5f);
            }
        }

        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        RfpQuoteOptionDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);

        RfpQuoteOption updatedOption = rfpQuoteOptionRepository.findOne(optionId);
        assertThat(updatedOption.getRfpQuoteOptionNetworks()).hasSize(3);
        RfpQuoteOptionNetwork oosRenewalPlan = updatedOption.getRfpQuoteOptionNetworks().stream()
            .filter(RfpQuoteOptionNetwork::isOutOfState)
            .findFirst().orElse(null);
        assertThat(oosRenewalPlan).isNotNull();
        assertThat(oosRenewalPlan.getSelectedRfpQuoteNetworkPlan().getTier1Rate()).isEqualTo(oosPlan.getTier1OosRate());
           
        // remove out of state
        
        updateParams = updated;
        updateParams.getOptionPlans().forEach(p -> p.setOutOfStateRate(false));
        
        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        flushAndClear();
        
        updatedOption = rfpQuoteOptionRepository.findOne(optionId);
        assertThat(updatedOption.getRfpQuoteOptionNetworks()).hasSize(2);
    }
    
    @Test
    public void testCurrent_UpdateOutOfState() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);
        
        Network network1 = testEntityHelper.createTestNetwork(carrier, "HMO", "Test HMO network");
        Network network2 = testEntityHelper.createTestNetwork(carrier, "PPO", "Test PPO network");
        ClientPlan cpMedical = testEntityHelper.createTestClientPlan("Medical Client plan", client, CarrierType.OTHER.name(), "HMO");
        
        RfpQuoteOptionDto updateParams = new RfpQuoteOptionDto();
        updateParams.setClientId(client.getClientId());
        updateParams.setProduct(MEDICAL);
        updateParams.setRatingTiers(1);
        
        // create empty Renewal to check updated OutOfState
        updateParams.setCarrierId(carrier.getCarrierId());
        RfpQuoteOption renewalOption = testRenewal_Init(updateParams);
        
        flushAndClear();
        
        OptionPlanDto plan1 = new OptionPlanDto();
        plan1.setIncumbentPlanName("Plan 1");
        plan1.setIncumbentNetworkId(network1.getNetworkId());
        plan1.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        plan1.setTier1Contribution(100f);
        plan1.setTier1OosContribution(101f);
        plan1.setOutOfStateContribution(true);
        plan1.setTier1Enrollment(10L);
        plan1.setTier1OosEnrollment(11L);
        plan1.setOutOfStateEnrollment(true);
        plan1.setTier1Rate(1000f);
        plan1.setTier1OosRate(1001f);
        plan1.setOutOfStateRate(true);
        updateParams.getOptionPlans().add(plan1);
        
        OptionPlanDto plan2 = new OptionPlanDto();
        plan2.setIncumbentPlanName("Plan 2");
        plan2.setIncumbentNetworkId(network2.getNetworkId());
        plan2.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_PERCENT);
        plan2.setTier1Contribution(90f);
        plan2.setTier1Enrollment(20L);
        plan2.setTier1Rate(2000f);
        updateParams.getOptionPlans().add(plan2);
        
        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        RfpQuoteOptionDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        assertThat(updated).hasNoNullFieldsOrPropertiesExcept("rfpQuoteOptionId");
        assertThat(updated.getOptionPlans()).hasSize(2);
        assertThat(updated.getOptionPlans()).extracting(OptionPlanDto::isOutOfStateRate)
            .containsExactlyInAnyOrder(true, false);
        
        for(OptionPlanDto plan : updated.getOptionPlans()) {
            if(plan.isOutOfStateRate()) {
                assertThat(plan.getIncumbentPlanName()).isEqualTo(plan1.getIncumbentPlanName());
                assertThat(plan.getIncumbentNetworkId()).isEqualTo(plan1.getIncumbentNetworkId());
                assertThat(plan.getTier1OosRate()).isEqualTo(plan1.getTier1OosRate());
                assertThat(plan.getTier1OosContribution()).isEqualTo(plan1.getTier1OosContribution());
                assertThat(plan.getTier1OosEnrollment()).isEqualTo(plan1.getTier1OosEnrollment()); 
            }
            assertThat(plan.getPlanId()).isNotNull();
            assertThat(plan.getTier1Rate()).isNotNull();
            assertThat(plan.getTier1Contribution()).isNotNull();
            assertThat(plan.getTier1Enrollment()).isNotNull();
        }
        
        List<ClientPlan> plans = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(plans).hasSize(3);
        ClientPlan oosPlan = plans.stream().filter(ClientPlan::isOutOfState).findFirst().orElse(null);
        assertThat(oosPlan).isNotNull();
        assertThat(oosPlan.getTier1Rate()).isEqualTo(plan1.getTier1OosRate());
        assertThat(oosPlan.getTier1ErContribution()).isEqualTo(plan1.getTier1OosContribution());
        assertThat(oosPlan.getTier1Census()).isEqualTo(plan1.getTier1OosEnrollment());
        
        // check updated renewal
        renewalOption = rfpQuoteOptionRepository.findOne(renewalOption.getRfpQuoteOptionId());
        
        assertThat(renewalOption.getRfpQuoteOptionNetworks()).hasSize(3);
        RfpQuoteOptionNetwork oosRenewalPlan = renewalOption.getRfpQuoteOptionNetworks().stream()
            .filter(RfpQuoteOptionNetwork::isOutOfState)
            .findFirst().orElse(null);
        assertThat(oosRenewalPlan).isNotNull();
        assertThat(oosRenewalPlan.getTier1Census()).isEqualTo(plan1.getTier1OosEnrollment());
        assertThat(oosRenewalPlan.getTier1ErContribution()).isEqualTo(plan1.getTier1OosContribution());
        // no check for updated rates: renewal rates can be updated only 1) on RFP submit or 2) Renewal option update
        assertThat(oosRenewalPlan.getSelectedRfpQuoteNetworkPlan().getTier1Rate()).isEqualTo(0F);
        
        // remove out of state
        
        updateParams = updated;
        updateParams.getOptionPlans().forEach(p -> p.setOutOfStateRate(false));

        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, "/broker/presentation/updateOption");
        updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteOptionDto.class);
        
        flushAndClear();
        
        plans = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(plans).hasSize(2);
        
        renewalOption = rfpQuoteOptionRepository.findOne(renewalOption.getRfpQuoteOptionId());
        assertThat(renewalOption.getRfpQuoteOptionNetworks()).hasSize(2);
    }

    @Test
    public void downloadPowerPointPresentation() throws Exception {
        Client client = testEntityHelper.createTestClient();
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/broker/presentation/file/powerPoint", new Object[] {})
                .header("Authorization", "Bearer " + token)
                .param("clientId", client.getClientId().toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(Constants.HTTP_HEADER_CONTENT_TYPE_PPTX))
                .andReturn();
        byte[] bytes = result.getResponse().getContentAsByteArray();

        assertThat(bytes).isNotEmpty();
        
    }
    
    @Test
    public void comparePlans_EmptyResult() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        ClientPlan clientPlanHmo1 = testEntityHelper.createTestClientPlan("clientPlan HMO 1", client, 
            CarrierType.AETNA.name(), "HMO");
        
        Carrier currentCarrier = clientPlanHmo1.getPnn().getPlan().getCarrier();
        Carrier differentCarrier = testEntityHelper.createTestCarrier(CarrierType.AMERITAS.name(), CarrierType.AMERITAS.displayName);
        
        // current and alternative plans missing
        
        MvcResult result = performGetAndAssertResult((Object) null, "/broker/presentation/comparePlans", 
            "product", MEDICAL, "clientPlanId", clientPlanHmo1.getClientPlanId().toString(),
            "carrierIds", differentCarrier.getCarrierId().toString());
        
        QuoteOptionPlanComparisonDto[] resultList = jsonUtils.fromJson(
            result.getResponse().getContentAsString(), QuoteOptionPlanComparisonDto[].class);

        assertThat(resultList).hasSize(0);
        
        result = mockMvc.perform(MockMvcRequestBuilders.get("/broker/presentation/comparePlans/file")
            .header("Authorization", "Bearer " + token)
            .param("product", MEDICAL)
            .param("carrierIds", differentCarrier.getCarrierId().toString())
            .param("clientPlanId", clientPlanHmo1.getClientPlanId().toString()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(Constants.HTTP_HEADER_CONTENT_TYPE_XLSX))
            .andReturn();
        
        // current only found
        
        /* not implemented: to many regression changes required
       
        result = performGetAndAssertResult((Object) null, "/broker/presentation/comparePlans", 
            "product", Constants.MEDICAL, "clientPlanId", clientPlanHmo1.getClientPlanId().toString(),
            "carrierIds", currentCarrier.getCarrierId().toString());
        
        resultList = jsonUtils.fromJson(result.getResponse().getContentAsString(), QuoteOptionPlanComparisonDto[].class);

        assertThat(resultList).hasSize(1);
        assertThat(resultList[0].getName()).isEqualTo("Current");
        
        result = mockMvc.perform(MockMvcRequestBuilders.get("/broker/presentation/comparePlans/file")
            .header("Authorization", "Bearer " + token)
            .param("product", Constants.MEDICAL)
            .param("carrierIds", currentCarrier.getCarrierId().toString())
            .param("clientPlanId", clientPlanHmo1.getClientPlanId().toString()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(Constants.HTTP_HEADER_CONTENT_TYPE_XLSX))
            .andReturn();
        */
    }
    
    @Test
    public void compareAncillaryPlans_SortOrder() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        Carrier currentCarrier = testEntityHelper.createTestCarrier(CarrierType.SUN_LIFE.name(), CarrierType.SUN_LIFE.displayName);
        AncillaryPlan currentAncillaryPlan = testEntityHelper.createTestAncillaryPlan("Current Basic Life",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, currentCarrier);
        ClientPlan currentPlan = testEntityHelper.createTestAncillaryClientPlan(client, currentAncillaryPlan, PlanCategory.LIFE);
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.VOYA.name(), CarrierType.VOYA.displayName);
        
        AncillaryPlan ancillaryPlan1 = testEntityHelper.createTestAncillaryPlan("Basic Life 1",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);
        
        AncillaryPlan ancillaryPlan2 = testEntityHelper.createTestAncillaryPlan("Basic Life 2",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);
 
        AncillaryPlan ancillaryPlanRenewal = testEntityHelper.createTestAncillaryPlan("Renewal Basic Life",
                PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.LIFE);

        RfpQuoteAncillaryPlan alternative2 = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan1);
        RfpQuoteAncillaryPlan alternative1 = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan2);
        RfpQuoteAncillaryPlan renewal = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlanRenewal);
        
        RfpQuoteAncillaryOption option1 = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", alternative2);
        RfpQuoteAncillaryOption option2 = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 2", alternative1);
        RfpQuoteAncillaryOption renewalOpt = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", renewal);
        RfpQuoteAncillaryOption option3 = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 3", alternative1);
        
        flushAndClear();
        
        String result = performGet("/broker/presentation/compareAncillaryPlans", new Object[] {
            "product", PlanCategory.LIFE.name(), 
            "clientId", client.getClientId()});
        
        RfpQuoteAncillaryPlanComparisonDto[] quoteOptionDto = jsonUtils.fromJson(result, RfpQuoteAncillaryPlanComparisonDto[].class);
        
        assertThat(quoteOptionDto).hasSize(4);
        assertThat(quoteOptionDto).extracting(RfpQuoteAncillaryPlanComparisonDto::getPlanName)
    		.containsExactly(
    				currentAncillaryPlan.getPlanName(), 
    				renewal.getAncillaryPlan().getPlanName(),
    				alternative2.getAncillaryPlan().getPlanName(),
    				alternative1.getAncillaryPlan().getPlanName());
        assertThat(quoteOptionDto).extracting(RfpQuoteAncillaryPlanComparisonDto::getOptionName)
            .containsExactly("Current", "Renewal", "Option 1", "Option 2, Option 3");

    }
    
    @Test
    public void compareAncillaryPlans() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        Carrier currentCarrier = testEntityHelper.createTestCarrier(CarrierType.SUN_LIFE.name(), CarrierType.SUN_LIFE.displayName);
        AncillaryPlan currentAncillaryPlan = testEntityHelper.createTestAncillaryPlan("Current Basic Life",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, currentCarrier);
        ClientPlan currentPlan = testEntityHelper.createTestAncillaryClientPlan(client, currentAncillaryPlan, PlanCategory.LIFE);
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.VOYA.name(), CarrierType.VOYA.displayName);
        
        AncillaryPlan ancillaryPlan1 = testEntityHelper.createTestAncillaryPlan("Basic Life 1",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);
        
        AncillaryPlan ancillaryPlan2 = testEntityHelper.createTestAncillaryPlan("Basic Life 2",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), 
            Constants.LIFE);
        rfpQuote.setDisclaimer("<p>Test VOYA Carrier Disclaimer</p><p>Disclaimer text</p>");
        rfpQuote = rfpQuoteRepository.save(rfpQuote);
        
        RfpQuoteAncillaryPlan selected = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan1);
        RfpQuoteAncillaryPlan alternative = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan2);
        
        RfpQuoteAncillaryOption option1 = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", selected);
        RfpQuoteAncillaryOption option2 = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 2", selected);
        
        flushAndClear();
        
        String result = performGet("/broker/presentation/compareAncillaryPlans", new Object[] {
            "product", PlanCategory.LIFE.name(), 
            "clientId", client.getClientId(), 
            "carrierIds", currentCarrier.getCarrierId().toString() + "," + carrier.getCarrierId()});
        
        RfpQuoteAncillaryPlanComparisonDto[] quoteOptionDto = jsonUtils.fromJson(result, RfpQuoteAncillaryPlanComparisonDto[].class);
        
        assertThat(quoteOptionDto).hasSize(2);
        assertThat(quoteOptionDto).extracting(RfpQuoteAncillaryPlanComparisonDto::getPlanName)
    		.containsExactlyInAnyOrder(currentAncillaryPlan.getPlanName(), selected.getAncillaryPlan().getPlanName());
        assertThat(quoteOptionDto).extracting(RfpQuoteAncillaryPlanComparisonDto::getOptionName)
            .containsExactlyInAnyOrder("Current", "Option 1, Option 2");
        
        // manual check generated file
        MvcResult downloadResult = mockMvc.perform(MockMvcRequestBuilders.get("/broker/presentation/compareAncillaryPlans/file")
            .header("Authorization", "Bearer " + token)
            .param("product", PlanCategory.LIFE.name())
            .param("carrierIds", (currentCarrier.getCarrierId().toString() + "," + carrier.getCarrierId()))
            .param("clientId", client.getClientId().toString()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(Constants.HTTP_HEADER_CONTENT_TYPE_XLSX))
            .andReturn();
        //byte[] bytes = downloadResult.getResponse().getContentAsByteArray();
        //java.io.File xlsx = new java.io.File("comparePlans.xlsx");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(xlsx, bytes);

    }
    
    @Test
    public void comparePlans() throws Exception {
        final String[] testBenefits = new String[]{"FAMILY_DEDUCTIBLE", "CO_INSURANCE", "INPATIENT_HOSPITAL"};
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        ClientPlan clientPlanHmo1 = testEntityHelper.createTestClientPlan("clientPlan HMO 1", client, 
            CarrierType.AETNA.name(), "HMO");
        testEntityHelper.createTestBenefits(clientPlanHmo1.getPnn().getPlan(), testBenefits);

        ClientPlan clientPlanHmo2 = testEntityHelper.createTestClientPlan("clientPlan HMO 2", client, 
            CarrierType.CIGNA.name(), "HMO");
        testEntityHelper.createTestBenefits(clientPlanHmo2.getPnn().getPlan(), testBenefits);
 
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.AMERITAS.name(), MEDICAL);
        RfpQuoteNetwork rqnHmo = testEntityHelper.createTestQuoteNetwork(rfpQuote, "quote network 1", "HMO");
        
        RfpQuoteNetworkPlan planHmo1 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan 1", rqnHmo, 100.1f, 120.2f, 140.3f, 160.4f);
        testEntityHelper.createTestBenefits(planHmo1.getPnn().getPlan(), testBenefits);
        
        RfpQuoteNetworkPlan planHmo2 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan 2", rqnHmo, 100.1f, 120.2f, 140.3f, 160.4f);
        testEntityHelper.createTestBenefits(planHmo2.getPnn().getPlan(), testBenefits);
        
        RfpQuoteOption option1 = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 1");

        RfpQuoteOptionNetwork rqonHmo1 = testEntityHelper.createTestRfpQuoteOptionNetwork(
            option1, rqnHmo, planHmo1, clientPlanHmo1, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqonHmo2 = testEntityHelper.createTestRfpQuoteOptionNetwork(
            option1, rqnHmo, planHmo2, clientPlanHmo2, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        RfpQuote rfpQuote2 = testEntityHelper.createTestRfpQuote(client, CarrierType.BLUE_SHIELD.name(), MEDICAL);
        RfpQuoteNetwork rqnHmo2 = testEntityHelper.createTestQuoteNetwork(rfpQuote2, "quote network 2", "HMO");
        RfpQuoteNetworkPlan planHmo3 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan 3", rqnHmo2, 100.1f, 120.2f, 140.3f, 160.4f);
        testEntityHelper.createTestBenefits(planHmo3.getPnn().getPlan(), testBenefits);
        
        RfpQuoteOption option2 = testEntityHelper.createTestRfpQuoteOption(rfpQuote2, "Option 2");
 
        RfpQuoteOptionNetwork rqonHmo3 = testEntityHelper.createTestRfpQuoteOptionNetwork(
            option2, rqnHmo2, planHmo3, clientPlanHmo1, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
         
        RfpQuoteOption duplicate = testEntityHelper.createTestRfpQuoteOption(rfpQuote2, "Option 3");
        
        RfpQuoteOptionNetwork rqonHmo4 = testEntityHelper.createTestRfpQuoteOptionNetwork(
            duplicate, rqnHmo2, planHmo3, clientPlanHmo1, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        flushAndClear();
        
        Carrier option1Carrier = option1.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
        Carrier option2Carrier = option2.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier(); 

        MvcResult result = performGetAndAssertResult((Object) null, "/broker/presentation/comparePlans", 
            "product", MEDICAL, "clientPlanId", clientPlanHmo1.getClientPlanId().toString(),
            "carrierIds", (option1Carrier.getCarrierId().toString() + "," + option2Carrier.getCarrierId()));
     
        QuoteOptionPlanComparisonDto[] resultList = jsonUtils.fromJson(
            result.getResponse().getContentAsString(), QuoteOptionPlanComparisonDto[].class);

        assertThat(resultList).hasSize(3);
        assertThat(resultList).extracting(QuoteOptionPlanComparisonDto::getName)
            .containsExactly("Current", "Option 1", "Option 2, Option 3"); // joined options names
        
        for(QuoteOptionPlanComparisonDto comp : resultList) {
            assertThat(comp.getPlans()).hasSize(1);  
            comp.getPlans().forEach(p -> {
                if(comp.getName().equals(Constants.CURRENT_NAME)) {
                    assertThat(p.networkPlan.getPercentDifference()).isNull();
                } else {
                    assertThat(p.networkPlan.getPercentDifference()).isNotNull();
                }
                assertThat(p.networkPlan.getCost()).isNotEmpty();
                assertThat(p.networkPlan.getBenefits()).isNotEmpty();
            });
        }
        assertThat(resultList).extracting(r -> r.getPlans().get(0).networkName)
            .containsExactly(clientPlanHmo1.getPnn().getName(), clientPlanHmo1.getPnn().getName(), 
                clientPlanHmo1.getPnn().getName());
        assertThat(resultList).extracting(r -> r.getPlans().get(0).networkPlan.getName())
            .containsExactly(clientPlanHmo1.getPnn().getName(), planHmo1.getPnn().getName(), 
                planHmo3.getPnn().getName());
        assertThat(resultList).extracting(r -> r.getPlans().get(0).networkPlan.getNetworkName())
            .containsExactly(clientPlanHmo1.getPnn().getNetwork().getName(), 
                planHmo1.getRfpQuoteNetwork().getNetwork().getName(), 
                planHmo3.getRfpQuoteNetwork().getNetwork().getName());

        // check filtering by clientPlanId = clientPlanHmo2
        result = performGetAndAssertResult((Object) null, "/broker/presentation/comparePlans", 
            "product", MEDICAL, "clientPlanId", clientPlanHmo2.getClientPlanId().toString(),
            "carrierIds", (option1Carrier.getCarrierId().toString() + "," + option2Carrier.getCarrierId()));
     
        resultList = jsonUtils.fromJson(result.getResponse().getContentAsString(), QuoteOptionPlanComparisonDto[].class);

        // Option 2 do not have plans linked to clientPlanHmo2
        assertThat(resultList).hasSize(2);
        assertThat(resultList).extracting(QuoteOptionPlanComparisonDto::getName)
            .containsExactly("Current", "Option 1");  

        // check filtering by carrierIds = option1Carrier
        result = performGetAndAssertResult((Object) null, "/broker/presentation/comparePlans", 
            "product", MEDICAL, "clientPlanId", clientPlanHmo1.getClientPlanId().toString(),
            "carrierIds", (option1Carrier.getCarrierId().toString()));
     
        resultList = jsonUtils.fromJson(result.getResponse().getContentAsString(), QuoteOptionPlanComparisonDto[].class);

        assertThat(resultList).hasSize(2);
        assertThat(resultList).extracting(QuoteOptionPlanComparisonDto::getName)
            .containsExactly("Current", "Option 1");
        
        // check filtering by poduct = DENTAL
        result = performGetAndAssertResult((Object) null, "/broker/presentation/comparePlans", 
            "product", Constants.DENTAL, "clientPlanId", clientPlanHmo1.getClientPlanId().toString(),
            "carrierIds", (option1Carrier.getCarrierId().toString() + "," + option2Carrier.getCarrierId()));
     
        resultList = jsonUtils.fromJson(result.getResponse().getContentAsString(), QuoteOptionPlanComparisonDto[].class);
        assertThat(resultList).isEmpty();

        // manual check generated file
        result = mockMvc.perform(MockMvcRequestBuilders.get("/broker/presentation/comparePlans/file")
            .header("Authorization", "Bearer " + token)
            .param("product", MEDICAL)
            .param("carrierIds", (option1Carrier.getCarrierId().toString() + "," + option2Carrier.getCarrierId()))
            .param("clientPlanId", clientPlanHmo1.getClientPlanId().toString()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(Constants.HTTP_HEADER_CONTENT_TYPE_XLSX))
            .andReturn();
        
//        byte[] bytes = result.getResponse().getContentAsByteArray();
//        java.io.File xlsx = new java.io.File("comparePlans.xlsx");
//        org.apache.commons.io.FileUtils.writeByteArrayToFile(xlsx, bytes);
    }

    @Test
    public void getQuoteDisclosures() throws Exception {
        Client client = testEntityHelper.createTestClient();
        // check for returned last quote disclaimer
        RfpQuote oldUhcMed = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        oldUhcMed.setDisclaimer("Previous UHC medical disclaimer");
        rfpQuoteRepository.save(oldUhcMed);
        
        RfpQuote uhcMed = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        uhcMed.setDisclaimer("UHC medical disclaimer");
        rfpQuoteRepository.save(uhcMed);
        
        RfpQuote uhcDen = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.DENTAL);
        uhcDen.setDisclaimer("UHC dental disclaimer");
        rfpQuoteRepository.save(uhcDen);
        
        RfpQuote anthemDen = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.DENTAL);
        anthemDen.setDisclaimer("Anthem dental disclaimer");
        rfpQuoteRepository.save(anthemDen);
        
        RfpQuote anthemVision = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.VISION);
        anthemVision.setDisclaimer("Anthem vision disclaimer");
        rfpQuoteRepository.save(anthemVision);
        
        RfpQuote cvDen = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_CLEAR_VALUE.name(), Constants.DENTAL);
        cvDen.setDisclaimer("CV dental disclaimer");
        rfpQuoteRepository.save(cvDen);
        
        RfpQuote cvVision = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_CLEAR_VALUE.name(), Constants.VISION);
        cvVision.setDisclaimer("CV vision disclaimer");
        rfpQuoteRepository.save(cvVision);
        
        // check empty carrier filter
        MvcResult result = performGetAndAssertResult((Object) null, "/broker/presentation/disclosures", 
        	"clientId", client.getClientId(),
        	"product", Constants.MEDICAL);
        
        TypeReference respType = new TypeReference<Map<String, QuoteOptionDisclaimerDto>>() {};
       
        Map<String, QuoteOptionDisclaimerDto> resp = jsonUtils.fromJson(result.getResponse().getContentAsString(), respType);
        assertThat(resp).hasSize(1);
        assertThat(resp.get("UHC").getDisclaimer()).isEqualTo(uhcMed.getDisclaimer());
      
        // check anthem and CV from DB if Dental product
        result = performGetAndAssertResult((Object) null, "/broker/presentation/disclosures", 
        	"clientId", client.getClientId(),
            "product", Constants.DENTAL);
        
        resp = jsonUtils.fromJson(result.getResponse().getContentAsString(), respType);
        assertThat(resp.get("UHC").getDisclaimer()).isEqualTo(uhcDen.getDisclaimer());
        assertThat(resp.get("ANTHEM_BLUE_CROSS").getDisclaimer()).isEqualTo(anthemDen.getDisclaimer());
        assertThat(resp.get("ANTHEM_CLEAR_VALUE").getDisclaimer()).isEqualTo(cvDen.getDisclaimer());
        
        // check filter by carrier names
        result = performGetAndAssertResult((Object) null, "/broker/presentation/disclosures", 
        	"clientId", client.getClientId(),
            "product", Constants.VISION, "carrierNames", "ANTHEM_BLUE_CROSS, ANTHEM_CLEAR_VALUE");
        
        resp = jsonUtils.fromJson(result.getResponse().getContentAsString(), respType);
        assertThat(resp.get("UHC")).isNull();
        assertThat(resp.get("ANTHEM_BLUE_CROSS").getDisclaimer()).isEqualTo(anthemVision.getDisclaimer());
        assertThat(resp.get("ANTHEM_CLEAR_VALUE").getDisclaimer()).isEqualTo(cvVision.getDisclaimer());
    }
    
    @Test
    public void getQuoteSeveralDisclosures() throws Exception {
        Client client = testEntityHelper.createTestClient();

        RfpQuote oldUhcMed = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        oldUhcMed.setDisclaimer("Previous UHC medical disclaimer");
        
        RfpQuote uhcMed = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        uhcMed.addDisclaimer("HMO", "UHC HMO medical disclaimer");
        uhcMed.addDisclaimer("PPO", "UHC PPO medical disclaimer");
        
        MvcResult result = performGetAndAssertResult((Object) null, "/broker/presentation/disclosures", 
            "clientId", client.getClientId(),
            "product", Constants.MEDICAL);
        
        TypeReference<Map<String, QuoteOptionDisclaimerDto>> respType = 
                new TypeReference<Map<String, QuoteOptionDisclaimerDto>>() {};
       
        Map<String, QuoteOptionDisclaimerDto> resp = jsonUtils.fromJson(result.getResponse().getContentAsString(), respType);
        assertThat(resp).hasSize(1);
        assertThat(resp.get("UHC").getDisclaimer()).isEqualTo(
                "UHC HMO medical disclaimer &lt;br/&gt; &lt;br/&gt; UHC PPO medical disclaimer");
      
    }

    @Test
    public void testGetPresentationOption() throws Exception {

        Client client = testEntityHelper.createTestClient();
        ClientPlan clientPlanCarrier2 = testEntityHelper
            .createTestClientPlan("hmo client plan", client, Constants.UHC_CARRIER, "HMO");

        PresentationOption presentationOption = testEntityHelper.createTestPresentationOption(client, "Alternative 1");

        RfpQuote quote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL, QuoteType.KAISER);
        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork, 100.91f, 200.90f, 290.00f, 450.19f, true);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(quote, "Option 1");
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption,
            hmoNetwork, hmoPlan, clientPlanCarrier2, 80L, 10L, 80L, 5L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        MvcResult result =  performGetAndAssertResult( null, "/broker/presentation/{clientId}/presentationOption", client.getClientId());
        PresentationQuoteOptionListDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), PresentationQuoteOptionListDto.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getCurrents()).hasSize(6);
        assertThat(dto.getAlternatives()).hasSize(1);

        // update first alternative
        PresentationUpdateDto presentationUpdateDto = new PresentationUpdateDto();
        presentationUpdateDto.setPresentationOptionId(presentationOption.getPresentationOptionId());
        presentationUpdateDto.setRfpQuoteOptionId(medicalOption.getOptionId());
        presentationUpdateDto.setProduct(Constants.MEDICAL);

        performPutAndAssertResult(jsonUtils.toJson(presentationUpdateDto), null, "/broker/presentation/presentationOption");
        flushAndClear();

        result =  performGetAndAssertResult( null, "/broker/presentation/{clientId}/presentationOption", client.getClientId());
        dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), PresentationQuoteOptionListDto.class);
        assertThat(dto).isNotNull();
        assertThat(dto.getCurrentTotal()).isEqualTo(506400.0F);
        assertThat(dto.getAlternatives()).hasSize(1);
        PresentationAlternativeDto alternative1 = dto.getAlternatives().get(0);
        assertThat(alternative1.getTotal()).isEqualTo(426393.0F);
        assertThat(alternative1.getPercentage()).isEqualTo(-15.8F);
        assertThat(alternative1.getProductsOptions()).hasSize(1);
        PresentationAlternativeOption product1 = alternative1.getProductsOptions().get(0);
        assertThat(product1.getProduct()).isEqualTo(Constants.MEDICAL);
        assertThat(product1.getQuoteType()).isEqualTo(QuoteType.KAISER);
    }

    @Test
    public void testPostPresentationOption() throws Exception {
        Client client = testEntityHelper.createTestClient();

        RfpQuote quote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork, 1f, 1f, 1f, 1f, true);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(quote, "Option 1");
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption,
            hmoNetwork, hmoPlan, null, 1L, 1L, 1L, 1L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        PresentationAlternativeDto createDto = new PresentationAlternativeDto();

        PresentationAlternativeOption dto = new PresentationAlternativeOption();
        dto.setRfpQuoteOptionId(medicalOption.getOptionId());
        dto.setProduct(Constants.MEDICAL);
        createDto.getProductsOptions().add(dto);
        createDto.getBundlingDiscounts().add(new PresentationAlternativeBundlingDiscount(Constants.DENTAL, 1.0F));

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(Arrays.asList(createDto)), null,
            "/broker/presentation/{clientId}/alternativeColumn/create", client.getClientId());

        PresentationAlternativeDto[] list = jsonUtils.fromJson(result.getResponse().getContentAsString(), PresentationAlternativeDto[].class);

        assertThat(list).isNotNull();
        assertThat(list).hasSize(1);
        assertThat(list[0].getName()).isEqualTo("Alternative 1");
        assertThat(list[0].getPresentationOptionId()).isNotEmpty();
        assertThat(list[0].getProductsOptions()).hasSize(1);
        assertThat(list[0].getBundlingDiscounts()).hasSize(1);
    }

    
    @Test
    public void testUpdatePresentationOption() throws Exception {
        
        Client client = testEntityHelper.createTestClient();
        PresentationOption presentationOption = testEntityHelper.createTestPresentationOption(client, "Alternative test");
        
        RfpQuote quote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork, 1f, 1f, 1f, 1f, true);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(quote, "Option 1");
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption,
            hmoNetwork, hmoPlan, null, 1L, 1L, 1L, 1L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        PresentationUpdateDto dto = new PresentationUpdateDto();

        dto.setPresentationOptionId(presentationOption.getPresentationOptionId());
        dto.setRfpQuoteOptionId(medicalOption.getOptionId());
        dto.setProduct(Constants.MEDICAL);
        dto.getBundlingDiscounts().add(new PresentationAlternativeBundlingDiscount(Constants.DENTAL, 1.0F));

        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(dto), null, "/broker/presentation/presentationOption");
        PresentationQuoteOptionListDto list = jsonUtils.fromJson(result.getResponse().getContentAsString(), PresentationQuoteOptionListDto.class);
        assertThat(presentationOption.getMedicalRfpQuoteOption()).isNotNull();
        assertThat(presentationOption.getMedicalRfpQuoteOption().getOptionId()).isEqualTo(medicalOption.getOptionId());
        assertThat(list.getAlternatives()).hasSize(1);
        assertThat(list.getAlternatives().get(0).getBundlingDiscounts()).hasSize(1);
        assertThat(list.getAlternatives().get(0).getBundlingDiscounts().get(0).getDiscount()).isEqualTo(1.0F);
        assertThat(list.getAlternatives().get(0).getBundlingDiscounts().get(0).getProduct()).isEqualTo("DENTAL");
    }

    @Test
    public void testDeletePresentationOption() throws Exception {

        Client client = testEntityHelper.createTestClient();
        PresentationOption presentationOption = testEntityHelper.createTestPresentationOption(client, "Alternative test");
        RfpQuote quote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.DENTAL);
        RfpQuoteOption dentalOption = testEntityHelper.createTestRfpQuoteOption(quote, "Option 1");
        presentationOption.setDentalRfpQuoteOption(dentalOption);

        PresentationUpdateDto dto = new PresentationUpdateDto();

        dto.setPresentationOptionId(presentationOption.getPresentationOptionId());
        dto.setProduct(Constants.DENTAL);

        performDeleteAndAssertResult(jsonUtils.toJson(dto), "/broker/presentation/presentationOption");
        
        assertThat(presentationOption.getDentalRfpQuoteOption()).isNull();
    }

    @Test
    public void testDeletePresentationOptionById() throws Exception {
        Client client = testEntityHelper.createTestClient();
        PresentationOption presentationOption = testEntityHelper.createTestPresentationOption(client, "Alternative test");
        RfpQuote quote = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.DENTAL);
        RfpQuoteOption dentalOption = testEntityHelper.createTestRfpQuoteOption(quote, "Option 1");
        presentationOption.setDentalRfpQuoteOption(dentalOption);

        PresentationUpdateDto dto = new PresentationUpdateDto();

        dto.setPresentationOptionId(presentationOption.getPresentationOptionId());
        dto.setProduct(Constants.DENTAL);

        performDelete("/broker/presentation/presentationOption/{id}",null, presentationOption.getPresentationOptionId());

        flushAndClear();
        PresentationOption dbOption = presentationOptionRepository.findOne(presentationOption.getPresentationOptionId());
        assertThat(dbOption).isNull();
    }

}
