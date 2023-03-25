package com.benrevo.be.modules.shared.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class SharedPlanServiceTest extends AbstractControllerTest {

    @Autowired
    private SharedPlanService sharedPlanService;
    
    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;
    
    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Override
    public void init() { }

    @Test
    public void testBenefitsSaving() throws Exception {
        PlanNameByNetwork planNameByNetwork = testEntityHelper.createTestPlanNameByNetwork(
            "sample", ANTHEM_BLUE_CROSS.name(), "DPPO");

        Plan plan = planNameByNetwork.getPlan();
        List<Benefit> benefits = new ArrayList<>();

        // all cases
        benefits.add(testEntityHelper.createTestBenefit(
            "COSMETICS", "Cosmetics", "", "", ""));

        benefits.add(testEntityHelper.createTestBenefit(
            "BRUSH_BIOPSY", "Brush Biopsy", "90%", null, null));

        benefits.add(testEntityHelper.createTestBenefit(
            "CLASS_1_PREVENTIVE", "Diagnostic and Preventive", null, "50%", "90%"));

        benefits.add(testEntityHelper.createTestBenefit(
            "CLASS_2_BASIC", "Basic Restorative", null, "", "90%"));

        benefits.add(testEntityHelper.createTestBenefit(
            "SURGICAL_ENDODONTICS", "Surgical Endodontics", null, "", ""));

        benefits.add(testEntityHelper.createTestBenefit(
            "SURGICAL_PERIODONTICS", "Surgical Periodontics", null, "", "$45"));

        sharedPlanService.createAndSaveBenefits(benefits, plan);

        List<Rx> rx = new ArrayList<>();
        List<QuoteOptionAltPlanDto.Benefit> benefitsResponse = sharedPlanService.findBenefits(plan.getPlanId(), rx);

        for(QuoteOptionAltPlanDto.Benefit b : benefitsResponse){
            if("COSMETICS".equals(b.sysName)){
                assertThat(b.value).isEqualTo("");
                assertThat(b.type).isEqualTo("STRING");
                assertThat(b.valueIn).isNull();
                assertThat(b.typeIn).isNull();
                assertThat(b.valueOut).isNull();
                assertThat(b.typeOut).isNull();
            } else if("BRUSH_BIOPSY".equals(b.sysName)){
                assertThat(b.value).isEqualTo("90");
                assertThat(b.type).isEqualTo("PERCENT");
                assertThat(b.valueIn).isNull();
                assertThat(b.typeIn).isNull();
                assertThat(b.valueOut).isNull();
                assertThat(b.typeOut).isNull();
            } else if("CLASS_1_PREVENTIVE".equals(b.sysName)){
                assertThat(b.value).isNull();
                assertThat(b.type).isNull();
                assertThat(b.valueIn).isEqualTo("50");
                assertThat(b.typeIn).isEqualTo("PERCENT");
                assertThat(b.valueOut).isEqualTo("90");
                assertThat(b.typeOut).isEqualTo("PERCENT");
            } else if("CLASS_2_BASIC".equals(b.sysName)){
                assertThat(b.value).isNull();
                assertThat(b.type).isNull();
                assertThat(b.valueIn).isEqualTo("");
                assertThat(b.typeIn).isEqualTo("STRING");
                assertThat(b.valueOut).isEqualTo("90");
                assertThat(b.typeOut).isEqualTo("PERCENT");
            } else if("SURGICAL_ENDODONTICS".equals(b.sysName)){
                assertThat(b.value).isNull();
                assertThat(b.type).isNull();
                assertThat(b.valueIn).isEqualTo("");
                assertThat(b.typeIn).isEqualTo("STRING");
                assertThat(b.valueOut).isEqualTo("");
                assertThat(b.typeOut).isEqualTo("STRING");
            } else if("SURGICAL_PERIODONTICS".equals(b.sysName)){
                assertThat(b.value).isNull();
                assertThat(b.type).isNull();
                assertThat(b.valueIn).isEqualTo("");
                assertThat(b.typeIn).isEqualTo("STRING");
                assertThat(b.valueOut).isEqualTo("45");
                assertThat(b.typeOut).isEqualTo("DOLLAR");
            }
        }
    }

}
