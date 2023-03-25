package com.benrevo.be.modules.presentation.controller;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.common.dto.DeletePlanDto;
import com.benrevo.common.dto.PlanNameByNetworkDetailsDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Cost;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.dto.QuoteOptionAltRxDto;
import com.benrevo.common.dto.ancillary.AncillaryClassDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.dto.ancillary.AncillaryRateAgeDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryPlanDto;
import com.benrevo.common.dto.ancillary.VoluntaryRateDto;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.AncillaryRateAge;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryPlanRepository;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;

public class PlanControllerTest extends AbstractControllerTest {
    private static final String CREATE_PLAN_ENDPOINT_URI = "/v1/plans/create";
    private static final String UPDATE_PLAN_ENDPOINT_URI = "/v1/plans/update";
    private static final String UPDATE_RX_PLAN_ENDPOINT_URI = "/v1/plans/updateRx";
    private static final String UPDATE_CURRENT_PLAN_ENDPOINT_URI = "/v1/plans/current/{clientPlanId}/update";
    private static final String UPDATE_CURRENT_RX_PLAN_ENDPOINT_URI = "/v1/plans/current/{clientPlanId}/updateRx";
    private static final String DELETE_PLAN_ENDPOINT_URI = "/v1/plans/delete";

    @Autowired
    private PlanController planController;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;
    
    @Autowired
    private AncillaryPlanRepository ancillaryPlanRepository;
    
    @Autowired
    private RfpQuoteAncillaryPlanRepository rfpQuoteAncillaryPlanRepository;
    
    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;
    
    @Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;
    
    @Before
    @Override
    public void init() {
        initController(planController);
    }

    @Test
    public void ancillaryPlan_CreateUpdateGet() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.displayName);
        
        AncillaryPlan ancillaryPlan = testEntityHelper.buildTestAncillaryPlan("Voluntary Life",
            PlanCategory.VOL_LIFE, AncillaryPlanType.VOLUNTARY, carrier);

        // create
        
        AncillaryPlanDto createParams = RfpMapper.rfpPlanToRfpPlanDto(ancillaryPlan);
        
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(createParams), null, "/v1/plans/createAncillary");
        AncillaryPlanDto createdDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), AncillaryPlanDto.class);
        
        assertThat(createdDto.getClasses()).hasSize(2);
        assertThat(((VoluntaryRateDto) createdDto.getRates()).getAges()).hasSize(2);
        assertThat(createdDto.getRates().getVolume()).isNotZero(); 
        
        AncillaryPlan createdPlan = ancillaryPlanRepository.findOne(createdDto.getAncillaryPlanId());
        assertThat(createdPlan).isNotNull(); 
        assertThat(createdPlan.getRates().getVolume()).isNotZero();
        
        // update
        AncillaryPlanDto updateParams = createdDto;
        updateParams.setPlanName("Updated plan name");

        updateParams.getClasses().remove(0);
        updateParams.getClasses().get(0).setName("Updated class name");
        AncillaryRateAgeDto removedAge = ((VoluntaryRateDto)updateParams.getRates()).getAges().remove(0);
        
        AncillaryRateAgeDto updatedAge = ((VoluntaryRateDto)updateParams.getRates()).getAges().get(0);
        updatedAge.setFrom(100);
        updatedAge.setTo(200);
        updatedAge.setCurrentEmp(updatedAge.getCurrentEmp() + 10f);
        
        AncillaryRateAgeDto addedAge = new AncillaryRateAgeDto();
        addedAge.setFrom(50);
        addedAge.setTo(60);
        addedAge.setCurrentEmp(0.99f);
        ((VoluntaryRateDto) updateParams.getRates()).getAges().add(addedAge);

        // updateParams.getRates().setVolume(null);
        // emulate missing "volume" property from UI call
        String body = jsonUtils.toJson(updateParams);
        body = body.replace("\"volume\"", "\"anyRandomValue\"");
        
        result = performPutAndAssertResult(body, null, "/v1/plans/{clientId}/{id}/updateAncillary", client.getClientId(), updateParams.getAncillaryPlanId());
        AncillaryPlanDto updatedDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), AncillaryPlanDto.class);

        assertThat(updatedDto.getPlanName()).isEqualTo(updateParams.getPlanName());

        // check for default value: 0
        assertThat(updatedDto.getRates().getVolume()).isEqualTo(0f);
        
        flushAndClear();
        
        AncillaryPlan updatedPlan = ancillaryPlanRepository.findOne(updatedDto.getAncillaryPlanId());
        assertThat(updatedPlan).isNotNull();
        // check for default value: 0
        assertThat(updatedPlan.getRates().getVolume()).isEqualTo(0f);
        
        assertThat(updatedPlan.getClasses()).hasSize(1);
        assertThat(updatedPlan.getClasses().get(0).getName())
        	.isEqualTo( updateParams.getClasses().get(0).getName());
        
        assertThat(((VoluntaryRate) updatedPlan.getRates()).getAges()).hasSize(2);
        assertThat(((VoluntaryRate) updatedPlan.getRates()).getAges()).extracting(AncillaryRateAge::getCurrentEmp)
        	.containsExactlyInAnyOrder(addedAge.getCurrentEmp(), updatedAge.getCurrentEmp());

        // get
        result = performGetAndAssertResult(null, "/v1/plans/ancillary/{id}", updatedPlan.getAncillaryPlanId());
        AncillaryPlanDto getDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), AncillaryPlanDto.class);
        
        // check for sorted ages
        Collections.sort(((VoluntaryRateDto) updatedDto.getRates()).getAges(), (a1, a2) -> {
        	return a1.getFrom().compareTo(a2.getFrom());
        });
        assertThat(getDto).isEqualToComparingFieldByFieldRecursively(updatedDto);
    }
    
    @Test
    public void rfpQuoteAncillaryPlan_SelectOnCreate() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.displayName);
        
        AncillaryPlan ancillaryPlan = testEntityHelper.buildTestAncillaryPlan("Voluntary Life",
            PlanCategory.VOL_LIFE, AncillaryPlanType.VOLUNTARY, carrier);
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), 
                Constants.LIFE);
        
        RfpQuoteAncillaryOption option = testEntityHelper.createTestRfpQuoteAncillaryOption("Option", rfpQuote);
        assertThat(option.getRfpQuoteAncillaryPlan()).isNull();
        
        
        RfpQuoteAncillaryPlan ancQuotePlan = testEntityHelper.buildTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan);

        // create
        
        RfpQuoteAncillaryPlanDto createParams = RfpMapper.ancQuotePlanToAncQuotePlanDto(ancQuotePlan);
        createParams.setRfpQuoteAncillaryOptionId(option.getRfpQuoteAncillaryOptionId());
        
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(createParams), null, "/v1/plans/createQuoteAncillary");
        RfpQuoteAncillaryPlanDto createdDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteAncillaryPlanDto.class);
        assertThat(createdDto.getRfpQuoteAncillaryOptionId()).isEqualTo(option.getOptionId());
        
        flushAndClear();
        
        option = rfpQuoteAncillaryOptionRepository.findOne(option.getOptionId());
        assertThat(option.getRfpQuoteAncillaryPlan()).isNotNull();
        assertThat(option.getRfpQuoteAncillaryPlan().getRfpQuoteAncillaryPlanId()).isEqualTo(createdDto.getRfpQuoteAncillaryPlanId());
    }
    
    @Test
    public void rfpQuoteAncillaryPlan_CreateUpdateGet() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.displayName);
        
        AncillaryPlan ancillaryPlan = testEntityHelper.buildTestAncillaryPlan("Voluntary Life",
            PlanCategory.VOL_LIFE, AncillaryPlanType.VOLUNTARY, carrier);
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), 
                Constants.LIFE);
        
        RfpQuoteAncillaryPlan ancQuotePlan = testEntityHelper.buildTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan);

        // create
        
        RfpQuoteAncillaryPlanDto createParams = RfpMapper.ancQuotePlanToAncQuotePlanDto(ancQuotePlan);
        assertThat(createParams.getCarrierId()).isEqualTo(carrier.getCarrierId());
        
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(createParams), null, "/v1/plans/createQuoteAncillary");
        RfpQuoteAncillaryPlanDto createdDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteAncillaryPlanDto.class);
        
        // plan carrier should be overridden by quote carrier
        Carrier quoteCarrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();
        assertThat(createdDto.getCarrierId()).isEqualTo(quoteCarrier.getCarrierId());
        
        flushAndClear();
        
        RfpQuoteAncillaryPlan createdPlan = rfpQuoteAncillaryPlanRepository.findOne(createdDto.getRfpQuoteAncillaryPlanId());
        assertThat(createdPlan).isNotNull();
        assertThat(createdPlan.getAncillaryPlan().getCarrier().getCarrierId()).isEqualTo(quoteCarrier.getCarrierId());
        
        // update
        
        RfpQuoteAncillaryPlanDto updateParams = createdDto;
        updateParams.setPlanName("Updated plan name");
        updateParams.setMatchPlan(!updateParams.isMatchPlan());
        updateParams.getClasses().get(0).setName("Updated class name");
        updateParams.getRates().setVolume(9999f);
        
        result = performPutAndAssertResult(jsonUtils.toJson(updateParams), null, 
            "/v1/plans/{id}/updateQuoteAncillary", updateParams.getRfpQuoteAncillaryPlanId());
        RfpQuoteAncillaryPlanDto updatedDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteAncillaryPlanDto.class);
        
        assertThat(updatedDto.getPlanName()).isEqualTo(updateParams.getPlanName());
        assertThat(updatedDto.isMatchPlan()).isEqualTo(updateParams.isMatchPlan());
        assertThat(updatedDto.getClasses().get(0).getName()).isEqualTo(updateParams.getClasses().get(0).getName());
        assertThat(updatedDto.getRates().getVolume()).isEqualTo(updateParams.getRates().getVolume());
        
        RfpQuoteAncillaryPlan updatedPlan = rfpQuoteAncillaryPlanRepository.findOne(updatedDto.getRfpQuoteAncillaryPlanId());
        assertThat(updatedPlan).isNotNull();
        
        // get
        
        result = performGetAndAssertResult(null, "/v1/plans/quoteAncillary/{id}", updatedPlan.getRfpQuoteAncillaryPlanId());
        RfpQuoteAncillaryPlanDto getDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteAncillaryPlanDto.class);
        assertThat(getDto).isEqualToComparingFieldByFieldRecursively(updatedDto);
    }
    
    @Test
    public void testCreatePlan_SelectOnCreation() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client);
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);
        RfpQuoteNetwork rqn = testEntityHelper.createTestRfpQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, null, null, 10L, 15L, 20L, 25L,"DOLLAR", 90f, 90f, 90f, 90f);
        
        CreatePlanDto createPlanDto = new CreatePlanDto();
        createPlanDto.setNameByNetwork("Test plan name");
        createPlanDto.setRfpQuoteNetworkId(rqn.getRfpQuoteNetworkId());
        createPlanDto.setOptionId(1L);
        createPlanDto.getBenefits().add(new QuoteOptionAltPlanDto.Benefit("AMBULANCE", "Ambulance", "1", "STRING"));
        createPlanDto.getCost().add(new Cost(Constants.TIER1_PLAN_NAME, "1.1", Constants.VALUE_TYPE_STRING));
        // set rqon for selecting created plan
        createPlanDto.setRfpQuoteOptionNetworkId(rqon.getRfpQuoteOptionNetworkId());
        
        MvcResult r = performPostAndAssertResult(jsonUtils.toJson(createPlanDto), null, CREATE_PLAN_ENDPOINT_URI);

        flushAndClear();
        
        Long createdPlanId = Long.parseLong(r.getResponse().getContentAsString());

        rqon = rfpQuoteOptionNetworkRepository.findOne(rqon.getRfpQuoteOptionNetworkId());
        
        assertThat(rqon.getSelectedRfpQuoteNetworkPlan()).isNotNull();
        assertThat(rqon.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId()).isEqualTo(createdPlanId);

    }
    
    @Test
    public void getPlanNameByNetworkById() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        PlanNameByNetwork pnn = testEntityHelper.createTestPlanNameByNetwork(
            "test Pnn", CarrierType.OTHER.name(), "HMO");
        
        testEntityHelper.createTestBenefits(pnn.getPlan(), "FAMILY_DEDUCTIBLE", "CO_INSURANCE");
        // RX benefits
        testEntityHelper.createTestBenefits(pnn.getPlan(),"RX_INDIVIDUAL_DEDUCTIBLE", "MAIL_ORDER");
        
        MvcResult result = performGetAndAssertResult(null, "/v1/plans/network/{pnnId}", pnn.getPnnId());

        PlanNameByNetworkDetailsDto resp = jsonUtils.fromJson(result.getResponse().getContentAsString(), PlanNameByNetworkDetailsDto.class);
        
        assertThat(resp).hasNoNullFieldsOrProperties();
        assertThat(resp.getBenefits()).isNotEmpty();
        assertThat(resp.getRx()).isNotEmpty();
    }

    
    @Test
    public void testCreatePlan() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client);
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);
        RfpQuoteNetwork rfpQuoteNetwork = testEntityHelper.createTestRfpQuoteNetwork(rfpQuote, "HMO");

        CreatePlanDto createPlanDto = newCreatePlanDto(rfpQuoteNetwork.getRfpQuoteNetworkId());

        MvcResult r = performPostAndAssertResult(jsonUtils.toJson(createPlanDto), null, CREATE_PLAN_ENDPOINT_URI);

        String response = r.getResponse().getContentAsString();

        Long rfpQuoteNetworkPlanId = Long.parseLong(response);

        RfpQuoteNetworkPlan createdPlan = rfpQuoteNetworkPlanRepository.findOne(rfpQuoteNetworkPlanId);

        assertThat(createdPlan).isNotNull();
        assertThat(createdPlan.getPnn().getName()).isEqualTo(createPlanDto.getNameByNetwork());
        assertThat(createdPlan.getTier1Rate().toString()).isEqualTo(createPlanDto.getCost().get(0).value);
        assertThat(createdPlan.getTier2Rate().toString()).isEqualTo(createPlanDto.getCost().get(1).value);
        assertThat(createdPlan.getTier3Rate().toString()).isEqualTo(createPlanDto.getCost().get(2).value);
        assertThat(createdPlan.getTier4Rate().toString()).isEqualTo(createPlanDto.getCost().get(3).value);

        List<Benefit> benefits = benefitRepository.findByPlanId(createdPlan.getPnn().getPlan().getPlanId());
        assertThat(benefits).hasSize(4);
        for (Benefit ben : benefits) {
            if (ben.getBenefitName().getName().equals("AMBULANCE")) {
                assertThat(ben.getInOutNetwork()).isEqualTo("IN");
                assertThat(ben.getValue()).isEqualTo("1");
            } else if (ben.getBenefitName().getName().equals("PCP")) {
                if (ben.getInOutNetwork().equals("IN")) {
                    assertThat(ben.getValue()).isEqualTo("10");
                    assertThat(ben.getFormat()).isEqualTo("DOLLAR");
                } else {
                    assertThat(ben.getValue()).isEqualTo("10");
                    assertThat(ben.getFormat()).isEqualTo("PERCENT");
                }
            } else {
                assertThat(ben.getBenefitName().getName()).isEqualTo("RX_INDIVIDUAL_DEDUCTIBLE");
                assertThat(ben.getValue()).isEqualTo("1");
                assertThat(ben.getFormat()).isEqualTo(Constants.VALUE_TYPE_NUMBER);
            }
        }

        // check created RX plan
        List<RfpQuoteNetworkPlan> createdPlans = rfpQuoteNetworkPlanRepository
            .findByRfpQuoteNetwork(createdPlan.getRfpQuoteNetwork());
        assertThat(createdPlans).hasSize(2);

        for (RfpQuoteNetworkPlan plan : createdPlans) {
            if (plan.getRfpQuoteNetworkPlanId().equals(createdPlan.getRfpQuoteNetworkPlanId())) {
                continue; // already checked above
            }
            assertThat(plan.getPnn().getPlanType()).isEqualTo("RX_" + rfpQuoteNetwork.getNetwork().getType());
            assertThat(plan.getPnn().getName()).isEqualTo(createPlanDto.getExtRx().getName());
            assertThat(plan.getTier1Rate()).isEqualTo(0.98f);
        }
    }

    private CreatePlanDto newCreatePlanDto(Long rfpQuoteNetworkId) {
        CreatePlanDto createPlanDto = new CreatePlanDto();
        createPlanDto.setNameByNetwork("Test plan name");
        createPlanDto.setRfpQuoteNetworkId(rfpQuoteNetworkId);
        createPlanDto.setOptionId(1L);
        createPlanDto.getBenefits().add(new QuoteOptionAltPlanDto.Benefit("AMBULANCE", "Ambulance", "1", "STRING"));
        createPlanDto.getBenefits().add( new QuoteOptionAltPlanDto.Benefit("PCP", "PCP", "$10", "10%", "DOLLAR", "PERCENT"));
        createPlanDto.getCost().add(new Cost(Constants.TIER1_PLAN_NAME, "1.1", Constants.VALUE_TYPE_STRING));
        createPlanDto.getCost().add(new Cost(Constants.TIER2_PLAN_NAME, "1.2", Constants.VALUE_TYPE_STRING));
        createPlanDto.getCost().add(new Cost(Constants.TIER3_PLAN_NAME, "1.3", Constants.VALUE_TYPE_STRING));
        createPlanDto.getCost().add(new Cost(Constants.TIER4_PLAN_NAME, "1.4", Constants.VALUE_TYPE_STRING));
        createPlanDto.getRx().add(new Rx("RX_INDIVIDUAL_DEDUCTIBLE", "Rx Individual Deductible", "1", Constants.VALUE_TYPE_STRING));
        QuoteOptionAltRxDto extRx = new QuoteOptionAltRxDto();
        extRx.setName("ext rx plan");
        extRx.getRx().add(new Rx(Constants.TIER1_RX_SYSNAME, "Member Copay Tier 1", "0.98", Constants.VALUE_TYPE_STRING));
        createPlanDto.setExtRx(extRx);
        return createPlanDto;
    }

    @Test
    public void testUpdateCurrentPlan() throws Exception {
    	Client client = testEntityHelper.createTestClient();
    	token = createToken(client.getBroker().getBrokerToken());
    	 
		ClientPlan clientPlan = testEntityHelper.createTestClientPlan("test client plan", client, Constants.UHC_CARRIER, "HMO");
		Benefit clientPlanBenefit = testEntityHelper.createTestBenefit("ADVANCED_RADIOLOGY", clientPlan.getPnn().getPlan(), false);
		Benefit clientPlanRxBenefit = testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", clientPlan.getPnn().getPlan(), false);
		PlanNameByNetwork rxClientPnn = testEntityHelper.createTestRxPlanNameByNetwork("rx client plan", clientPlan.getPnn().getNetwork(), client.getClientId());
		clientPlan.setRxPnn(rxClientPnn);
		clientPlan = clientPlanRepository.save(clientPlan);
		
		flushAndClear();
		
		CreatePlanDto createPlanDto = new CreatePlanDto();
        createPlanDto.setNameByNetwork(clientPlan.getPnn().getName() + " updated");
        createPlanDto.getBenefits().add(new QuoteOptionAltPlanDto.Benefit("AMBULANCE", "Ambulance", "10", StringUtils.EMPTY));
        createPlanDto.getBenefits().add( new QuoteOptionAltPlanDto.Benefit("ADVANCED_RADIOLOGY", "Advanced Radiology", "$10", StringUtils.EMPTY));
        createPlanDto.getCost().add(new Cost(Constants.TIER1_PLAN_NAME, "1.1", Constants.VALUE_TYPE_STRING));
        createPlanDto.getCost().add(new Cost(Constants.TIER2_PLAN_NAME, "1.2", Constants.VALUE_TYPE_STRING));
        createPlanDto.getCost().add(new Cost(Constants.TIER3_PLAN_NAME, "1.3", Constants.VALUE_TYPE_STRING));
        createPlanDto.getCost().add(new Cost(Constants.TIER4_PLAN_NAME, "1.4", Constants.VALUE_TYPE_STRING));
        createPlanDto.getRx().add(new Rx("RX_INDIVIDUAL_DEDUCTIBLE", "Rx Individual Deductible", "10", StringUtils.EMPTY));
        QuoteOptionAltRxDto extRx = new QuoteOptionAltRxDto();
        extRx.setName(rxClientPnn.getName() + " updated");
        extRx.getRx().add(new Rx(Constants.TIER1_RX_SYSNAME, "Member Copay Tier 1", "98", Constants.VALUE_TYPE_NUMBER));
        createPlanDto.setExtRx(extRx);
		
		flushAndClear();
		
		performPutAndAssertResult(jsonUtils.toJson(createPlanDto), null, UPDATE_CURRENT_PLAN_ENDPOINT_URI, clientPlan.getClientPlanId());

        flushAndClear();
		ClientPlan updatedPlan = clientPlanRepository.findOne(clientPlan.getClientPlanId());
		
		assertThat(updatedPlan.getPnn().getName()).isEqualTo(createPlanDto.getNameByNetwork());
        
		List<Benefit> benefits = benefitRepository.findByPlanId(updatedPlan.getPnn().getPlan().getPlanId());
		assertThat(benefits).hasSize(3); // 2 plan benefits + 1 RX benefit
		for (Benefit ben : benefits) {
            if (ben.getBenefitName().getName().equals("AMBULANCE")) {
                assertThat(ben.getValue()).isEqualTo("10");
                assertThat(ben.getFormat()).isEqualTo(Constants.VALUE_TYPE_NUMBER);
            } else if (ben.getBenefitName().getName().equals("ADVANCED_RADIOLOGY")) {
            	assertThat(ben.getValue()).isEqualTo("10");
            	assertThat(ben.getFormat()).isEqualTo(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
            } else {
            	assertThat(ben.getBenefitName().getName()).isEqualTo("RX_INDIVIDUAL_DEDUCTIBLE");
            	assertThat(ben.getValue()).isEqualTo(createPlanDto.getRx().get(0).value);
            	assertThat(ben.getFormat()).isEqualTo(Constants.VALUE_TYPE_NUMBER);
            }
        }
        assertThat(updatedPlan.getTier1Rate().toString()).isEqualTo(createPlanDto.getCost().get(0).value);
        assertThat(updatedPlan.getTier2Rate().toString()).isEqualTo(createPlanDto.getCost().get(1).value);
        assertThat(updatedPlan.getTier3Rate().toString()).isEqualTo(createPlanDto.getCost().get(2).value);
        assertThat(updatedPlan.getTier4Rate().toString()).isEqualTo(createPlanDto.getCost().get(3).value);

        PlanNameByNetwork updatedRxPlan = updatedPlan.getRxPnn();
        assertThat(updatedRxPlan.getName()).isEqualTo(extRx.getName());
        
        List<Benefit> rxBenefits = benefitRepository.findByPlanId(updatedRxPlan.getPlan().getPlanId());
		assertThat(rxBenefits).hasSize(1);

    	assertThat(rxBenefits.get(0).getBenefitName().getName()).isEqualTo(Constants.TIER1_RX_SYSNAME);
    	assertThat(rxBenefits.get(0).getValue()).isEqualTo(extRx.getRx().get(0).value);
    	assertThat(rxBenefits.get(0).getFormat()).isEqualTo("NUMBER");
    }
    
    @Test
    public void testUpdatePlan() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client);
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);
        RfpQuoteNetwork rfpQuoteNetwork = testEntityHelper.createTestRfpQuoteNetwork(rfpQuote, "HMO");

        CreatePlanDto createPlanDto = newCreatePlanDto(rfpQuoteNetwork.getRfpQuoteNetworkId());

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(createPlanDto), null, CREATE_PLAN_ENDPOINT_URI);

        String response = result.getResponse().getContentAsString();

        Long rfpQuoteNetworkPlanId = Long.parseLong(response);

        RfpQuoteNetworkPlan createdPlan = rfpQuoteNetworkPlanRepository.findOne(rfpQuoteNetworkPlanId);
        List<RfpQuoteNetworkPlan> createdPlans = rfpQuoteNetworkPlanRepository.findByRfpQuoteNetwork(createdPlan.getRfpQuoteNetwork());
        RfpQuoteNetworkPlan createdRxPlan = createdPlans.stream().filter(plan -> plan.getPnn().getPlanType().startsWith("RX_")).findFirst().orElse(null);

        createPlanDto.setRfpQuoteNetworkPlanId(rfpQuoteNetworkPlanId);
        createPlanDto.setRfpQuoteNetworkId(null);
        createPlanDto.setNameByNetwork("Test plan name updated");
        createPlanDto.getBenefits().clear();
        createPlanDto.getBenefits().add(new QuoteOptionAltPlanDto.Benefit("AMBULANCE", "Ambulance", "5", "STRING"));
        createPlanDto.getBenefits().add( new QuoteOptionAltPlanDto.Benefit("PCP", "PCP", "$20", "50%", "DOLLAR", "PERCENT"));
        createPlanDto.getCost().clear();
        createPlanDto.getCost().add(new Cost(Constants.TIER1_PLAN_NAME, "2.1", Constants.VALUE_TYPE_STRING));
        createPlanDto.getCost().add(new Cost(Constants.TIER2_PLAN_NAME, "2.2", Constants.VALUE_TYPE_STRING));
        createPlanDto.getCost().add(new Cost(Constants.TIER3_PLAN_NAME, "", Constants.VALUE_TYPE_STRING));
        createPlanDto.getCost().add(new Cost(Constants.TIER4_PLAN_NAME, null, Constants.VALUE_TYPE_STRING));
        createPlanDto.getExtRx().setRfpQuoteNetworkPlanId(createdRxPlan.getRfpQuoteNetworkPlanId());
        createPlanDto.getExtRx().setName("ext rx plan updated");
        createPlanDto.getExtRx().getRx().clear();
        createPlanDto.getExtRx().getRx().add(new Rx(Constants.TIER1_RX_SYSNAME, "Member Copay Tier 1", "88", Constants.VALUE_TYPE_STRING));

        performPutAndAssertResult(jsonUtils.toJson(createPlanDto), null, UPDATE_PLAN_ENDPOINT_URI);

        RfpQuoteNetworkPlan updatedPlan = rfpQuoteNetworkPlanRepository.findOne(rfpQuoteNetworkPlanId);
        List<Benefit> benefits = benefitRepository.findByPlanId(updatedPlan.getPnn().getPlan().getPlanId());
        assertThat(updatedPlan.getPnn().getName()).isEqualTo(createPlanDto.getNameByNetwork());
        for (Benefit ben : benefits) {
            if (ben.getBenefitName().getName().equals("AMBULANCE")) {
                assertThat(ben.getInOutNetwork()).isEqualTo("IN");
                assertThat(ben.getValue()).isEqualTo("5");
            } else if (ben.getBenefitName().getName().equals("PCP")) {
                assertThat(ben.getBenefitName().getName()).isEqualTo("PCP");
                if (ben.getInOutNetwork().equals("IN")) {
                    assertThat(ben.getValue()).isEqualTo("20");
                    assertThat(ben.getFormat()).isEqualTo("DOLLAR");
                } else {
                    assertThat(ben.getValue()).isEqualTo("50");
                    assertThat(ben.getFormat()).isEqualTo("PERCENT");
                }
            }
        }
        assertThat(updatedPlan.getTier1Rate().toString()).isEqualTo(createPlanDto.getCost().get(0).value);
        assertThat(updatedPlan.getTier2Rate().toString()).isEqualTo(createPlanDto.getCost().get(1).value);
        assertThat(updatedPlan.getTier3Rate()).isEqualTo(0f);
        assertThat(updatedPlan.getTier4Rate()).isEqualTo(0f);

        assertThat(createdPlans).hasSize(2);

        List<RfpQuoteNetworkPlan> updatedPlans = rfpQuoteNetworkPlanRepository.findByRfpQuoteNetwork(createdPlan.getRfpQuoteNetwork());
        RfpQuoteNetworkPlan updatedRxPlan = createdPlans.stream().filter(plan -> plan.getPnn().getPlanType().startsWith("RX_")).findFirst().orElse(null);

        assertThat(updatedRxPlan.getPnn().getName()).isEqualTo("ext rx plan updated");
        assertThat(updatedRxPlan.getTier1Rate()).isEqualTo(88f);
    }
    
    @Test
    public void testUpdateRxPlanOnly() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client);
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);
        RfpQuoteNetwork rfpQuoteNetwork = testEntityHelper.createTestRfpQuoteNetwork(rfpQuote, "HMO");

        // prepare and create new plan for update
        CreatePlanDto createPlanDto = newCreatePlanDto(rfpQuoteNetwork.getRfpQuoteNetworkId());

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(createPlanDto), null, CREATE_PLAN_ENDPOINT_URI);

        String response = result.getResponse().getContentAsString();

        Long rfpQuoteNetworkPlanId = Long.parseLong(response);

        RfpQuoteNetworkPlan createdPlan = rfpQuoteNetworkPlanRepository.findOne(rfpQuoteNetworkPlanId);
        List<RfpQuoteNetworkPlan> createdPlans = rfpQuoteNetworkPlanRepository.findByRfpQuoteNetwork(createdPlan.getRfpQuoteNetwork());
        RfpQuoteNetworkPlan createdRxPlan = createdPlans.stream().filter(plan -> plan.getPnn().getPlanType().startsWith("RX_")).findFirst().orElse(null);

        // prepare update params for RX plan only and update it
      
        QuoteOptionAltRxDto rxUpdateParams = new QuoteOptionAltRxDto();
        
        rxUpdateParams.setRfpQuoteNetworkPlanId(createdRxPlan.getRfpQuoteNetworkPlanId());
        rxUpdateParams.setName("ext rx plan updated");
        rxUpdateParams.getRx().add(new Rx("RX_INDIVIDUAL_DEDUCTIBLE", "Rx Individual Deductible", "22", Constants.VALUE_TYPE_STRING));
        rxUpdateParams.getRx().add(new Rx(Constants.TIER1_RX_SYSNAME, "Member Copay Tier 1", "88", Constants.VALUE_TYPE_STRING));

        performPutAndAssertResult(jsonUtils.toJson(rxUpdateParams), null, UPDATE_RX_PLAN_ENDPOINT_URI);

        RfpQuoteNetworkPlan updatedRxPlan = rfpQuoteNetworkPlanRepository.findOne(createdRxPlan.getRfpQuoteNetworkPlanId());

        assertThat(updatedRxPlan.getTier1Rate()).isEqualTo(88f);
        assertThat(updatedRxPlan.getPnn().getName()).isEqualTo(rxUpdateParams.getName());
        
        List<Benefit> rxBenefits = benefitRepository.findByPlanId(updatedRxPlan.getPnn().getPlan().getPlanId());
        assertThat(rxBenefits).hasSize(2);
        for (Benefit benefit : rxBenefits) {
        	if (benefit.getBenefitName().getName().equals(Constants.TIER1_RX_SYSNAME)) {
        		assertThat(benefit.getValue()).isEqualTo(rxUpdateParams.getRx().get(1).value);
        	} else {
        		assertThat(benefit.getValue()).isEqualTo(rxUpdateParams.getRx().get(0).value);
        	}
		}
    }
    
    @Test
    public void testUpdateClientRxPlanOnly() throws Exception {
    	Client client = testEntityHelper.createTestClient();
    	token = createToken(client.getBroker().getBrokerToken());
    	
    	ClientPlan clientPlan = testEntityHelper.createTestClientPlan("test client plan", client, Constants.UHC_CARRIER, "HMO");
		Benefit clientPlanBenefit = testEntityHelper.createTestBenefit("ADVANCED_RADIOLOGY", clientPlan.getPnn().getPlan(), false);
		Benefit clientPlanRxBenefit1 = testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", clientPlan.getPnn().getPlan(), false);
		Benefit clientPlanRxBenefit2 = testEntityHelper.createTestBenefit(Constants.TIER1_RX_SYSNAME, clientPlan.getPnn().getPlan(), false);
		PlanNameByNetwork rxClientPnn = testEntityHelper.createTestRxPlanNameByNetwork("rx client plan", clientPlan.getPnn().getNetwork());
		clientPlan.setRxPnn(rxClientPnn);
        rxClientPnn.setClientId(client.getClientId());
		clientPlan = clientPlanRepository.save(clientPlan);
		
		flushAndClear();
		
		QuoteOptionAltRxDto rxUpdateParams = new QuoteOptionAltRxDto();
	        
        rxUpdateParams.setName("ext rx plan updated");
        rxUpdateParams.getRx().add(new Rx("RX_INDIVIDUAL_DEDUCTIBLE", "Rx Individual Deductible", "22", Constants.VALUE_TYPE_STRING));
        rxUpdateParams.getRx().add(new Rx(Constants.TIER1_RX_SYSNAME, "Member Copay Tier 1", "88", Constants.VALUE_TYPE_STRING));

        performPutAndAssertResult(jsonUtils.toJson(rxUpdateParams), null, UPDATE_CURRENT_RX_PLAN_ENDPOINT_URI, clientPlan.getClientPlanId());

        flushAndClear();
        
    	ClientPlan updatedPlan = clientPlanRepository.findOne(clientPlan.getClientPlanId());
		
		assertThat(updatedPlan.getRxPnn().getName()).isEqualTo(rxUpdateParams.getName());

        List<Benefit> rxBenefits = benefitRepository.findByPlanId(updatedPlan.getRxPnn().getPlan().getPlanId());
        assertThat(rxBenefits).hasSize(2);
        for (Benefit benefit : rxBenefits) {
        	if (benefit.getBenefitName().getName().equals(Constants.TIER1_RX_SYSNAME)) {
        		assertThat(benefit.getValue()).isEqualTo(rxUpdateParams.getRx().get(1).value);
        	} else {
        		assertThat(benefit.getValue()).isEqualTo(rxUpdateParams.getRx().get(0).value);
        	}
		}
    }

    @Test
    public void testDeletePlan() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client);
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);
        RfpQuoteNetwork rfpQuoteNetwork = testEntityHelper.createTestRfpQuoteNetwork(rfpQuote, "HMO");

        CreatePlanDto createPlanDto = newCreatePlanDto(rfpQuoteNetwork.getRfpQuoteNetworkId());

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(createPlanDto), null, CREATE_PLAN_ENDPOINT_URI);

        String response = result.getResponse().getContentAsString();

        Long rfpQuoteNetworkPlanId = Long.parseLong(response);

        RfpQuoteNetworkPlan createdPlan = rfpQuoteNetworkPlanRepository.findOne(rfpQuoteNetworkPlanId);
        List<RfpQuoteNetworkPlan> createdPlans = rfpQuoteNetworkPlanRepository.findByRfpQuoteNetwork(createdPlan.getRfpQuoteNetwork());

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "test_option");
        testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rfpQuoteNetwork, createdPlan, null, 0L, 0L, 0L, 0L, "DOLLAR", 0f, 0f, 0f, 0f);

        DeletePlanDto deletePlanDto = new DeletePlanDto();
        deletePlanDto.setRfpQuoteNetworkId(createPlanDto.getRfpQuoteNetworkId());
        deletePlanDto.setRfpQuoteNetworkPlanIds(createdPlans.stream().mapToLong(RfpQuoteNetworkPlan::getRfpQuoteNetworkPlanId).boxed().collect(Collectors.toList()));

        performDeleteAndAssertResult(jsonUtils.toJson(deletePlanDto), DELETE_PLAN_ENDPOINT_URI);
        assertThat(rfpQuoteNetworkPlanRepository.findByRfpQuoteNetwork(createdPlan.getRfpQuoteNetwork()).size()).isEqualTo(0);
    }

}



