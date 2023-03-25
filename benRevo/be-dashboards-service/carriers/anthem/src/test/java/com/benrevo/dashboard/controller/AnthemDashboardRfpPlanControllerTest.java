package com.benrevo.dashboard.controller;

import com.benrevo.be.modules.rfp.controller.RfpPlanController;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.RFP;

import java.util.Arrays;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;

public class AnthemDashboardRfpPlanControllerTest extends AbstractControllerTest {
    private static final String CREATE_PLAN_IN_RFP_ENDPOINT_URI = "/v1/plans/rfp/{rfpId}/create";
    private static final String GET_CURRENT_PLAN_ENDPOINT_URI = "/v1/plans/rfp/{rfpId}";

    @Autowired
    private RfpPlanController rfpPlanController;

    @Before
    @Override
    public void init() {
        initController(rfpPlanController);
    }
    
    @Test
    public void testCreatePlansInRfp_Medical_Dental_Vision() throws Exception {
        RFP rfp = testEntityHelper.createTestRFP();
        Carrier carrier = testEntityHelper.createTestCarrier(
                CarrierType.ANTHEM_BLUE_CROSS.name(), CarrierType.ANTHEM_BLUE_CROSS.name());

        CreatePlanDto dtoMedical1 = new CreatePlanDto();
        dtoMedical1.setNameByNetwork("Medical test plan");
        dtoMedical1.setPlanType("VIVITY");
        dtoMedical1.setCarrierId(carrier.getCarrierId());
        dtoMedical1.setOptionId(1L);

        QuoteOptionAltPlanDto.Benefit mb1 = new QuoteOptionAltPlanDto.Benefit();
        mb1.sysName = "INDIVIDUAL_DEDUCTIBLE";
        mb1.value = "$81";
        dtoMedical1.getBenefits().add(mb1);

        QuoteOptionAltPlanDto.Rx mb2 = new QuoteOptionAltPlanDto.Rx();
        mb2.sysName = "RX_FAMILY_DEDUCTIBLE";
        mb2.value = "93%";
        dtoMedical1.getRx().add(mb2);
        
        CreatePlanDto dtoMedical2 = new CreatePlanDto();
        dtoMedical2.setNameByNetwork("Medical test plan");
        dtoMedical2.setPlanType("KAISER");
        dtoMedical2.setCarrierId(carrier.getCarrierId());
        dtoMedical2.setOptionId(2L);

        CreatePlanDto dtoMedical3 = new CreatePlanDto();
        dtoMedical3.setNameByNetwork("Medical test plan");
        dtoMedical3.setPlanType("SOL");
        dtoMedical3.setCarrierId(carrier.getCarrierId());
        dtoMedical3.setOptionId(3L);

        CreatePlanDto dtoMedical4 = new CreatePlanDto();
        dtoMedical4.setNameByNetwork("Medical test plan");
        dtoMedical4.setPlanType("THMO");
        dtoMedical4.setCarrierId(carrier.getCarrierId());
        dtoMedical4.setOptionId(4L);

        CreatePlanDto dtoMedical5 = new CreatePlanDto();
        dtoMedical5.setNameByNetwork("Medical test plan");
        dtoMedical5.setPlanType("SHMO");
        dtoMedical5.setCarrierId(carrier.getCarrierId());
        dtoMedical5.setOptionId(5L);

        CreatePlanDto dtoMedical6 = new CreatePlanDto();
        dtoMedical6.setNameByNetwork("Medical test plan");
        dtoMedical6.setPlanType("PSHMO");
        dtoMedical6.setCarrierId(carrier.getCarrierId());
        dtoMedical6.setOptionId(6L);


        CreatePlanDto dtoDhmo = new CreatePlanDto();
        dtoDhmo.setNameByNetwork("Dental test plan");
        dtoDhmo.setPlanType("DHMO");
        dtoDhmo.setCarrierId(carrier.getCarrierId());
        dtoDhmo.setOptionId(7L);

        CreatePlanDto dtoDppo = new CreatePlanDto();
        dtoDppo.setNameByNetwork("Dental test plan");
        dtoDppo.setPlanType("DPPO");
        dtoDppo.setCarrierId(carrier.getCarrierId());
        dtoDppo.setOptionId(8L);

        QuoteOptionAltPlanDto.Benefit b = new QuoteOptionAltPlanDto.Benefit();
        b.sysName = "NON_SURGICAL_ENDODONTICS";
        b.valueIn = "80%";
        b.valueOut = "70%";
        b.restriction = "Basic Service";
        dtoDppo.getBenefits().add(b);

        QuoteOptionAltPlanDto.Benefit b2 = new QuoteOptionAltPlanDto.Benefit();
        b2.sysName = "INPATIENT_HOSPITAL";
        b2.valueIn = "";
        b2.valueOut = "80%";
        b2.restriction = "Basic Service";
        dtoDppo.getBenefits().add(b2);
        
        CreatePlanDto dtoVision = new CreatePlanDto();
        dtoVision.setNameByNetwork("Vision test plan");
        dtoVision.setPlanType("VISION");
        dtoVision.setCarrierId(carrier.getCarrierId());
        dtoVision.setOptionId(9L);

        token = createToken(rfp.getClient().getBroker().getBrokerToken());

        performPostAndAssertResult(
                jsonUtils.toJson(Arrays.asList(dtoMedical1, dtoMedical2, dtoMedical3, dtoMedical4, 
                        dtoMedical5, dtoMedical6, dtoDhmo, dtoDppo, dtoVision)), 
                null, 
                CREATE_PLAN_IN_RFP_ENDPOINT_URI, 
                rfp.getRfpId());

        flushAndClear();
        
        MvcResult result = performGetAndAssertResult(null, GET_CURRENT_PLAN_ENDPOINT_URI, rfp.getRfpId());
        CreatePlanDto[] plans = jsonUtils.fromJson(result.getResponse().getContentAsString(), CreatePlanDto[].class);
        assertThat(plans).hasSize(9);
        assertThat(plans).extracting(CreatePlanDto::getPlanType).containsExactlyInAnyOrder(
            "VIVITY", "KAISER", "SOL", "THMO", "SHMO", "PSHMO", "DPPO", "DHMO", "VISION");
        
        for (CreatePlanDto plan : plans) {
            if ("DPPO".equals(plan.getPlanType())) {
                assertThat(plan.getBenefits()).hasSize(2);
                for (Benefit benefit : plan.getBenefits()) {
                    if("NON_SURGICAL_ENDODONTICS".equals(benefit.sysName)) {
                        assertThat(benefit.valueIn).isEqualTo("80");
                        assertThat(benefit.typeIn).isEqualTo("PERCENT");
                        assertThat(benefit.valueOut).isEqualTo("70");
                        assertThat(benefit.typeOut).isEqualTo("PERCENT");
                        assertThat(benefit.restriction).isEqualTo("Basic Service");
                    } else if("INPATIENT_HOSPITAL".equals(benefit.sysName)) {
                        assertThat(benefit.valueIn).isEqualTo("");
                        assertThat(benefit.typeIn).isEqualTo("STRING");
                        assertThat(benefit.valueOut).isEqualTo("80");
                        assertThat(benefit.typeOut).isEqualTo("PERCENT");
                        assertThat(benefit.restriction).isEqualTo("Basic Service");
                    } else {
                        Assert.fail("Unexpected benefit name");
                    }
                }
            } else if ("VIVITY".equals(plan.getPlanType())) {
                assertThat(plan.getBenefits()).hasSize(1);
                Benefit benefit = plan.getBenefits().get(0);
                assertThat(benefit.sysName).isEqualTo("INDIVIDUAL_DEDUCTIBLE");
                assertThat(benefit.value).isEqualTo("81");
                assertThat(benefit.type).isEqualTo("DOLLAR");
                    
                assertThat(plan.getRx()).hasSize(1);
                Rx rx = plan.getRx().get(0);
                assertThat(rx.sysName).isEqualTo("RX_FAMILY_DEDUCTIBLE");
                assertThat(rx.value).isEqualTo("93");
                assertThat(rx.type).isEqualTo("PERCENT");
            }
        }
    }
  
}

