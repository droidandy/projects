package com.benrevo.be.modules.presentation.controller;

import static com.benrevo.common.Constants.DHMO;
import static com.benrevo.common.Constants.DPPO;
import static com.benrevo.common.Constants.HMO;
import static com.benrevo.common.Constants.HSA;
import static com.benrevo.common.Constants.PPO;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.common.Constants.RX_HMO;
import static com.benrevo.common.Constants.RX_PPO;
import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.UHC;
import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.common.dto.DeletePlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Cost;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.dto.QuoteOptionAltRxDto;
import com.benrevo.common.dto.RfpQuoteDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

public class BenefitControllerTest extends AbstractControllerTest {

    private static final String BENEFIT_NAME_BY_PLANTYPE_AND_CARRIERID_ENDPOINT_URI = "/v1/benefitNames/";

    @Autowired
    private BenefitController benefitController;

    @Autowired
    private BenefitRepository benefitRepository;

    @Before
    @Override
    public void init() {
        initController(benefitController);
    }

    @Test
    public void testGetAllDefaultBenefits() throws Exception {
        MvcResult result = performGetAndAssertResult(null, "/v1/benefitNames/all");
        
        Map<String, List<QuoteOptionAltPlanDto.Benefit>> response = jsonUtils.fromJson(
            result.getResponse().getContentAsString(), new TypeReference<Map<String, List<QuoteOptionAltPlanDto.Benefit>>>() {});

        for(String type : new String[] {HMO, PPO, HSA, DPPO, DHMO, VISION, RX_HMO, RX_PPO, "RX_HSA"}) {
            assertThat(response.get(type)).isNotEmpty();
        }  
    }
    
    @Test
    public void testGetBenefitsByPlanType() throws Exception {
        // HMO include RX
        benefitHelper(ANTHEM_BLUE_CROSS, HMO, 19, true);
        benefitHelper(UHC, HMO, 19, true);

        // HMO exclude rx
        benefitHelper(ANTHEM_BLUE_CROSS, HMO, 12, false);
        benefitHelper(UHC, HMO, 12, false);

        // PPO include rx
        benefitHelper(ANTHEM_BLUE_CROSS, PPO, 18, true);
        benefitHelper(UHC, PPO, 18, true);

        // PPO exclude rx
        benefitHelper(ANTHEM_BLUE_CROSS, PPO, 11, false);
        benefitHelper(UHC, PPO, 11, false);

        // HSA
        benefitHelper(ANTHEM_BLUE_CROSS, HSA, 18, true);
        benefitHelper(UHC, HSA, 18, true);

        // DPPO
        benefitHelper(ANTHEM_BLUE_CROSS, DPPO, 12, true);
        benefitHelper(UHC, DPPO, 12, true);

        // DHMO
        benefitHelper(ANTHEM_BLUE_CROSS, DHMO, 10, true);
        benefitHelper(UHC, DHMO, 10, true);

        // VISION
        benefitHelper(ANTHEM_BLUE_CROSS, VISION, 8, true);
        benefitHelper(UHC, VISION, 8, true);

    }

    private void benefitHelper(CarrierType carrier, String planType, int numberOfBenefits, boolean includeRx) throws Exception{
        MvcResult result = performGetAndAssertResult(null, BENEFIT_NAME_BY_PLANTYPE_AND_CARRIERID_ENDPOINT_URI, new Object[] { "planType", planType, "includeRx", includeRx});
        QuoteOptionAltPlanDto.Benefit[] response = jsonUtils.fromJson(result.getResponse().getContentAsString(), QuoteOptionAltPlanDto.Benefit[].class);
        assertThat(response.length).isEqualTo(numberOfBenefits);
    }

}



