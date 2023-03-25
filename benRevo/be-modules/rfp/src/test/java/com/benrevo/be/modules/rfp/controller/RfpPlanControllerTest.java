package com.benrevo.be.modules.rfp.controller;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpToAncillaryPlanRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.hamcrest.core.IsEqual;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;

public class RfpPlanControllerTest extends AbstractControllerTest {
    private static final String CREATE_PLAN_IN_RFP_ENDPOINT_URI = "/v1/plans/rfp/{rfpId}/create";
    private static final String GET_CURRENT_ANTHEM_PLAN_ENDPOINT_URI = "/v1/plans/rfp/{rfpId}";

    @Autowired
    private RfpPlanController rfpPlanController;

    @Autowired
    private RfpToPnnRepository rfpToPnnRepository;
    
    @Autowired
    private RfpRepository rfpRepository;
    
    @Autowired
    private RfpToAncillaryPlanRepository rfpToAncillaryPlanRepository;
    
    @Before
    @Override
    public void init() {
        initController(rfpPlanController);
    }
    
    @Test
    public void testCreate_GetAncillaryPlansInRfp() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.displayName);
        
        AncillaryPlan basicPlan = testEntityHelper.buildTestAncillaryPlan("Basic Life",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);
        
        AncillaryPlan voluntaryPlan = testEntityHelper.buildTestAncillaryPlan("Voluntary Life",
                PlanCategory.VOL_LIFE, AncillaryPlanType.VOLUNTARY, carrier);

        RFP basicRfp = testEntityHelper.createTestRFP(client, PlanCategory.LIFE.name());
        // create
        
        List<AncillaryPlanDto> createParams = new ArrayList<>();
        createParams.add(RfpMapper.rfpPlanToRfpPlanDto(basicPlan));
        createParams.add(RfpMapper.rfpPlanToRfpPlanDto(voluntaryPlan));
        
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(createParams), null, 
        		"/v1/plans/rfp/{rfpId}/createAncillary", basicRfp.getRfpId());
        AncillaryPlanDto[] createApiResponse = jsonUtils.fromJson(result.getResponse().getContentAsString(), AncillaryPlanDto[].class);
        
        List<RFP> rfps = rfpRepository.findByClientClientId(client.getClientId());
        assertThat(rfps).hasSize(2);
        assertThat(rfps).extracting(RFP::getProduct).containsExactlyInAnyOrder("LIFE", "VOL_LIFE");
           
        RfpToAncillaryPlan basicRfpToAncillaryPlan = null;
        RfpToAncillaryPlan voluntaryRfpToAncillaryPlan = null;
        for (RFP rfp : rfps) {
        	List<RfpToAncillaryPlan> createdPlans = rfpToAncillaryPlanRepository.findByRfp_RfpId(rfp.getRfpId());
        	assertThat(createdPlans).hasSize(1);
        	if(rfp.getProduct().equals("LIFE")) {
        		basicRfpToAncillaryPlan = createdPlans.get(0);
        		assertThat(rfp.getRfpId()).isEqualTo(basicRfp.getRfpId());
        		assertThat(createdPlans.get(0).getAncillaryPlan().getPlanName()).isEqualTo(basicPlan.getPlanName());
        	} else {
        		voluntaryRfpToAncillaryPlan = createdPlans.get(0);
        		assertThat(createdPlans.get(0).getAncillaryPlan().getPlanName()).isEqualTo(voluntaryPlan.getPlanName());
        	}
		}
        
        // get by basic RFP
        
        result = performGetAndAssertResult(null, "/v1/plans/rfp/{rfpId}/getAncillary", basicRfp.getRfpId());
        AncillaryPlanDto[] plans = jsonUtils.fromJson(result.getResponse().getContentAsString(), AncillaryPlanDto[].class);
        assertThat(plans).hasSize(2);
        assertThat(plans).extracting(AncillaryPlanDto::getPlanType)
        	.containsExactlyInAnyOrder(AncillaryPlanType.BASIC, AncillaryPlanType.VOLUNTARY);
        
        // check for identical response of /createAncillary and /getAncillary APIs
        assertThat(plans).usingRecursiveFieldByFieldElementComparator().isEqualTo(createApiResponse);
        
        // update and select only basic plan
        
        List<AncillaryPlanDto> updateParams = new ArrayList<>();
        
        if (plans[0].getPlanType() == AncillaryPlanType.BASIC) {
        	updateParams.add(plans[0]);
        } else {
        	updateParams.add(plans[1]);
        } 
        
        performPostAndAssertResult(jsonUtils.toJson(updateParams), null, 
        		"/v1/plans/rfp/{rfpId}/createAncillary", basicRfp.getRfpId());
        
        rfps = rfpRepository.findByClientClientId(client.getClientId());
        assertThat(rfps).hasSize(1);
        assertThat(rfps.get(0).getRfpId()).isEqualTo(basicRfp.getRfpId());

        List<RfpToAncillaryPlan> createdPlans = rfpToAncillaryPlanRepository.findByRfp_RfpId(rfps.get(0).getRfpId());
    	assertThat(createdPlans).hasSize(1);
    	
    	
    	assertThat(rfpToAncillaryPlanRepository.findByRfp_RfpId(basicRfp.getRfpId()))
    		.isNotEmpty();
    	assertThat(rfpToAncillaryPlanRepository.findByRfp_RfpId(voluntaryRfpToAncillaryPlan.getRfp().getRfpId()))
    		.isEmpty();
    }

    @Test
    public void testCreatePlansInRfp() throws Exception {
        RFP rfp = testEntityHelper.createTestRFP();
        Carrier carrier = testEntityHelper.createTestCarrier();
        Network networkHMO = testEntityHelper.createTestNetwork(carrier, "HMO");
        Network networkPPO = testEntityHelper.createTestNetwork(carrier, "PPO");

        CreatePlanDto dtoHMO = new CreatePlanDto();
        dtoHMO.setNameByNetwork("HMO test plan");
        dtoHMO.setRfpQuoteNetworkId(networkHMO.getNetworkId());
        dtoHMO.getBenefits().add(new QuoteOptionAltPlanDto.Benefit("AMBULANCE", "Ambulance", "1", "STRING"));
        dtoHMO.getBenefits().add( new QuoteOptionAltPlanDto.Benefit("PCP", "PCP", "$10", "10%", "DOLLAR", "PERCENT"));
        dtoHMO.getRx().add(new Rx("RX_INDIVIDUAL_DEDUCTIBLE", "Rx Individual Deductible", "1", Constants.VALUE_TYPE_STRING));
        dtoHMO.setOptionId(1L);

        CreatePlanDto dtoPPO = new CreatePlanDto();
        dtoPPO.setNameByNetwork("PPO test plan");
        dtoPPO.setRfpQuoteNetworkId(networkPPO.getNetworkId());
        dtoPPO.getBenefits().add(new QuoteOptionAltPlanDto.Benefit("AMBULANCE", "Ambulance", "1", "STRING"));
        dtoPPO.getBenefits().add( new QuoteOptionAltPlanDto.Benefit("PCP", "PCP", "$10", "10%", "DOLLAR", "PERCENT"));
        dtoPPO.getRx().add(new Rx("RX_INDIVIDUAL_DEDUCTIBLE", "Rx Individual Deductible", "1", Constants.VALUE_TYPE_STRING));
        dtoPPO.setOptionId(2L);

        token = createToken(rfp.getClient().getBroker().getBrokerToken());

        performPostAndAssertResult(jsonUtils.toJson(Arrays.asList(dtoHMO, dtoPPO)), null, CREATE_PLAN_IN_RFP_ENDPOINT_URI, rfp.getRfpId());

        MvcResult result = performGetAndAssertResult(null, GET_CURRENT_ANTHEM_PLAN_ENDPOINT_URI, rfp.getRfpId());
        CreatePlanDto[] plans = jsonUtils.fromJson(result.getResponse().getContentAsString(), CreatePlanDto[].class);
        assertThat(plans.length).isEqualTo(2);
        CreatePlanDto hmoPlan;
        if (networkHMO.getNetworkId().equals(plans[0].getRfpQuoteNetworkId())) {
            hmoPlan = plans[0];
        } else if (networkHMO.getNetworkId().equals(plans[1].getRfpQuoteNetworkId())) {
            hmoPlan = plans[1];
        } else {
            throw new RuntimeException("HMO plan not found");
        }
        assertThat(hmoPlan.getNameByNetwork()).isEqualTo(dtoHMO.getNameByNetwork());
        assertThat(hmoPlan.getRfpQuoteNetworkId()).isEqualTo(dtoHMO.getRfpQuoteNetworkId());
        Assert.assertTrue(hmoPlan.getBenefits().size() > dtoHMO.getBenefits().size());

        // TODO: @lemdy -- is there a fix for this?
//        Assert.assertTrue(hmoPlan.getRx().size() > dtoHMO.getRx().size());
        
        // emulate rfp submissions and links client plan
        List<RfpToPnn> rfpToPnns1 = rfpToPnnRepository.findByRfpRfpId(rfp.getRfpId());
        assertThat(rfpToPnns1).hasSize(2);
        for (RfpToPnn rfpToPnn : rfpToPnns1) {
        	 ClientPlan clientPlan = testEntityHelper.createTestClientPlan(rfp.getClient(), rfpToPnn.getPnn());
		}
 
        // check for Re-creation logic
        
        // dtoHMO will be reused and updated
        dtoHMO.setNameByNetwork("HMO test plan");
        dtoHMO.getBenefits().clear();
        dtoHMO.getBenefits().add(new QuoteOptionAltPlanDto.Benefit("FRAME_ALLOWANCE", "Frame Allowance", "1", Constants.VALUE_TYPE_STRING));
        dtoHMO.getRx().clear();
        dtoHMO.getRx().add(new Rx("RX_FAMILY_DEDUCTIBLE", "Rx Family Deductible", "1", Constants.VALUE_TYPE_STRING));

        // dtoHMO will be re-created 
        dtoPPO.setNameByNetwork("PPO test plan 2");
        dtoPPO.getBenefits().clear();
        dtoPPO.getBenefits().add(new QuoteOptionAltPlanDto.Benefit("EMERGENCY_ROOM", "Emergency Room", "1", Constants.VALUE_TYPE_STRING));
        dtoPPO.getRx().clear();
        dtoPPO.getRx().add(new Rx("MEMBER_COPAY_TIER_1", "Member Copay Tier 1", "1", Constants.VALUE_TYPE_STRING));

        performPostAndAssertResult(jsonUtils.toJson(Arrays.asList(dtoHMO, dtoPPO)), null, CREATE_PLAN_IN_RFP_ENDPOINT_URI, rfp.getRfpId());
        
        flushAndClear();
        
        List<RfpToPnn> rfpToPnns2 = rfpToPnnRepository.findByRfpRfpId(rfp.getRfpId());
        assertThat(rfpToPnns2).hasSize(2);
        rfpToPnns2.sort((o1, o2) -> o1.getPlanType().compareTo(o2.getPlanType()));
        rfpToPnns1.sort((o1, o2) -> o1.getPlanType().compareTo(o2.getPlanType()));
        // check for HMO plan was reused
        assertThat(rfpToPnns2.get(0).getPnn().getPnnId()).isEqualTo(rfpToPnns1.get(0).getPnn().getPnnId());
        // check for PPO plan was creted new
        assertThat(rfpToPnns2.get(1).getPnn().getPnnId()).isNotEqualTo(rfpToPnns1.get(1).getPnn().getPnnId());

        result = performGetAndAssertResult(null, GET_CURRENT_ANTHEM_PLAN_ENDPOINT_URI, rfp.getRfpId());
        plans = jsonUtils.fromJson(result.getResponse().getContentAsString(), CreatePlanDto[].class);
        assertThat(plans.length).isEqualTo(2);
        
        CreatePlanDto ppoPlan;
        if (networkHMO.getNetworkId().equals(plans[0].getRfpQuoteNetworkId())) {
            hmoPlan = plans[0];
            ppoPlan = plans[1];
        } else {
            hmoPlan = plans[1];
            ppoPlan = plans[0];
        } 
        assertThat(hmoPlan.getNameByNetwork()).isEqualTo(dtoHMO.getNameByNetwork());
        assertThat(hmoPlan.getRfpQuoteNetworkId()).isEqualTo(dtoHMO.getRfpQuoteNetworkId());
        Assert.assertTrue(hmoPlan.getBenefits().size() > dtoHMO.getBenefits().size());
        // FIXME
        //Assert.assertTrue(hmoPlan.getRx().size() > dtoHMO.getRx().size());
        
        assertThat(ppoPlan.getNameByNetwork()).isEqualTo(dtoPPO.getNameByNetwork());
        assertThat(ppoPlan.getRfpQuoteNetworkId()).isEqualTo(dtoPPO.getRfpQuoteNetworkId());
        Assert.assertTrue(ppoPlan.getBenefits().size() > dtoPPO.getBenefits().size());
        // FIXME
        //Assert.assertTrue(ppoPlan.getRx().size() > dtoPPO.getRx().size());
    }
}



