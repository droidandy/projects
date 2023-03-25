package com.benrevo.core.api.controller;

import com.benrevo.be.modules.rfp.controller.RfpPlanController;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;

import java.util.Arrays;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;

public class UHCRfpPlanControllerTest extends AbstractControllerTest {
    private static final String CREATE_PLAN_IN_RFP_ENDPOINT_URI = "/v1/plans/rfp/{rfpId}/create";
    private static final String GET_CURRENT_PLAN_ENDPOINT_URI = "/v1/plans/rfp/{rfpId}";

    @Autowired
    private RfpPlanController rfpPlanController;

    @Autowired
    private RfpToPnnRepository rfpToPnnRepository;
    
    @Before
    @Override
    public void init() {
        initController(rfpPlanController);
    }
    
    @Test
    public void testCreatePlansInRfp_Medical_Dental_Vision() throws Exception {
        RFP rfp = testEntityHelper.createTestRFP();
        Carrier carrier = testEntityHelper.createTestCarrier();
        Network networkMedical = testEntityHelper.createTestNetwork(carrier, "HMO");
        Network networkDental = testEntityHelper.createTestNetwork(carrier, "DHMO");
        Network networkVision = testEntityHelper.createTestNetwork(carrier, "VISION");

        CreatePlanDto dtoMedical = new CreatePlanDto();
        dtoMedical.setNameByNetwork("Medical test plan");
        dtoMedical.setRfpQuoteNetworkId(networkMedical.getNetworkId());
        dtoMedical.setOptionId(1L);
        
        CreatePlanDto dtoDental = new CreatePlanDto();
        dtoDental.setNameByNetwork("Dental test plan");
        dtoDental.setRfpQuoteNetworkId(networkDental.getNetworkId());
        dtoDental.setOptionId(2L);

        CreatePlanDto dtoVision = new CreatePlanDto();
        dtoVision.setNameByNetwork("Vision test plan");
        dtoVision.setRfpQuoteNetworkId(networkVision.getNetworkId());
        dtoVision.setOptionId(3L);

        token = createToken(rfp.getClient().getBroker().getBrokerToken());

        performPostAndAssertResult(jsonUtils.toJson(Arrays.asList(dtoMedical, dtoDental, dtoVision)), null, CREATE_PLAN_IN_RFP_ENDPOINT_URI, rfp.getRfpId());

        flushAndClear();
        
        MvcResult result = performGetAndAssertResult(null, GET_CURRENT_PLAN_ENDPOINT_URI, rfp.getRfpId());
        CreatePlanDto[] plans = jsonUtils.fromJson(result.getResponse().getContentAsString(), CreatePlanDto[].class);
        assertThat(plans.length).isEqualTo(4);
        assertThat(plans).extracting(CreatePlanDto::getPlanType).containsExactlyInAnyOrder(
            "HMO", "RX_HMO", "DHMO", "VISION");
        
        for(CreatePlanDto plan : plans) {
            assertThat(plan.getRx()).isEmpty();
            if(plan.getPlanType().equals("RX_HMO")) {
                assertThat(plan.getBenefits()).isEmpty();
                assertThat(plan.getExtRx()).isNotNull();
                assertThat(plan.getExtRx().getRx()).isNotEmpty();
            } else {
                assertThat(plan.getBenefits()).isNotEmpty();
                assertThat(plan.getExtRx()).isNull();
            }     
        }
        List<RfpToPnn> rfpToPnns = rfpToPnnRepository.findByRfpRfpId(rfp.getRfpId());
        assertThat(rfpToPnns).hasSize(4);
        // no RX_DHMO or RX_VISION
        assertThat(rfpToPnns).extracting(r -> r.getPnn().getPlanType()).containsExactlyInAnyOrder(
            "HMO", "RX_HMO", "DHMO", "VISION");
    }
  
}



