package com.benrevo.be.modules.shared.controller;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.*;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.mapper.ClientPlanMapper;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;

public class SharedClientPlanControllerTest extends AbstractControllerTest {

    @Autowired
    private SharedClientPlanController sharedClientPlanController;
    
	@Autowired
	private PlanNameByNetworkRepository planNameByNetworkRepository;
	
	@Autowired
	private PlanRepository planRepository;
	
	@Autowired
	private BenefitRepository benefitRepository;
	
    @Before
    @Override
    public void init() {
        initController(sharedClientPlanController);
    }

	// @Ignore // TODO/FIXME: Only works with UHC...
    // it works now
	@Test
    public void createAndSetPlan() throws Exception {
		Client client = testEntityHelper.createTestClient();
    	Carrier carrier = testEntityHelper.createTestCarrier();
    	Network network = testEntityHelper.createTestNetwork(carrier, "HMO");
    	ClientPlan clientPlan = testEntityHelper.createTestClientPlan(client, network.getType(), (PlanNameByNetwork) null);
    			
    	final int currentYear = client.getEffectiveYear();
    	
    	CreatePlanDto createPlanDto = newCreatePlanDto(network.getNetworkId());
    			/*new CreatePlanDto();
        createPlanDto.setNameByNetwork("Test plan name");
        createPlanDto.setRfpQuoteNetworkId(network.getNetworkId());
        QuoteOptionAltRxDto extRx = new QuoteOptionAltRxDto();
        extRx.setName("Ext rx plan");
        extRx.getRx().add(new Rx(Constants.TIER1_RX_SYSNAME, "Member Copay Tier 1", "0.98", Constants.VALUE_TYPE_STRING));
        createPlanDto.setExtRx(extRx);*/

    	MvcResult result = performPostAndAssertResult(jsonUtils.toJson(createPlanDto), null, "/admin/clients/plans/{id}/createPlan", clientPlan.getClientPlanId());
        String response = result.getResponse().getContentAsString();
        
        ClientPlanDto clientPlanDto = jsonUtils.fromJson(response, ClientPlanDto.class);
        assertThat(clientPlanDto.getPnnId()).isNotNull();
        assertThat(clientPlanDto.getRxPnnId()).isNotNull();
        
        PlanNameByNetwork createdPnn = planNameByNetworkRepository.findOne(clientPlanDto.getPnnId());
        assertThat(createdPnn).isNotNull();
        assertThat(createdPnn.getPlan().getPlanYear()).isEqualTo(currentYear);
        
        PlanNameByNetwork createdRxPnn = planNameByNetworkRepository.findOne(clientPlanDto.getRxPnnId());
        assertThat(createdRxPnn).isNotNull();
        
        Plan createdPlan = planRepository.findByCarrierCarrierIdAndPlanTypeAndNameAndPlanYear(carrier.getCarrierId(), network.getType(), clientPlanDto.getPlanName(), currentYear);
        assertThat(createdPlan).isNotNull();
        assertThat(createdPlan.getPlanId()).isEqualTo(createdPnn.getPlan().getPlanId());
        
        List<PlanNameByNetwork> createdPnns = planNameByNetworkRepository.findByPlanCarrierAndPlanTypeAndPlanPlanYear(carrier, network.getType(), currentYear);
        assertThat(createdPnns).hasSize(1);
        assertThat(createdPnns.get(0).getPnnId()).isEqualTo(createdPnn.getPnnId());
        assertThat(createdPnns.get(0).getName()).isEqualTo(createPlanDto.getNameByNetwork());
        assertThat(createdPnns.get(0).getPlan().getPlanId()).isEqualTo(createdPlan.getPlanId());

        List<Benefit> benefits = benefitRepository.findByPlanId(createdPlan.getPlanId());
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

        // check created RX plan and related PNN
        final String rxPlanType = "RX_" + network.getType();
        Plan createdRxPlan = planRepository.findByCarrierCarrierIdAndPlanTypeAndNameAndPlanYear(
        		carrier.getCarrierId(), rxPlanType, "ext rx plan", currentYear);
        assertThat(createdRxPlan).isNotNull();
        assertThat(createdRxPlan.getPlanId()).isEqualTo(createdRxPnn.getPlan().getPlanId());
        
        List<PlanNameByNetwork> createdRxPnns = planNameByNetworkRepository
        		.findByPlanCarrierAndPlanTypeAndPlanPlanYear(carrier, rxPlanType, currentYear);
        assertThat(createdRxPnns).hasSize(1);
        assertThat(createdRxPnns.get(0).getPnnId()).isEqualTo(createdRxPnn.getPnnId());

        for (PlanNameByNetwork rxPnn : createdRxPnns) {
        	assertThat(rxPnn.getPlan().getPlanId()).isEqualTo(createdRxPlan.getPlanId());
        	assertThat(rxPnn.getPlan().getPlanType()).isEqualTo(rxPlanType);
            assertThat(rxPnn.getPlanType()).isEqualTo(rxPlanType);
            assertThat(rxPnn.getName()).isEqualTo(createPlanDto.getExtRx().getName());
        }
        
        // check for updates existing pnns and rxPnn
        
        createPlanDto.getBenefits().get(0).value = "123";
        createPlanDto.getExtRx().getRx().get(0).value = "4.56";
        
        result = performPostAndAssertResult(jsonUtils.toJson(createPlanDto), null, "/admin/clients/plans/{id}/createPlan", clientPlan.getClientPlanId());
        response = result.getResponse().getContentAsString();
        
        ClientPlanDto updatedClientPlanDto = jsonUtils.fromJson(response, ClientPlanDto.class);
        assertThat(updatedClientPlanDto.getPnnId()).isEqualTo(createdPnn.getPnnId());
        assertThat(updatedClientPlanDto.getRxPnnId()).isEqualTo(createdRxPnn.getPnnId());
        
        benefits = benefitRepository.findByPlanId(createdPlan.getPlanId());
        assertThat(benefits).hasSize(4);
        Benefit updatedBenefit = null;
        for (Benefit ben : benefits) {
            if (ben.getBenefitName().getName().equals("AMBULANCE")) {
            	updatedBenefit = ben;
            	break;
            }
        }
        assertThat(updatedBenefit.getValue()).isEqualTo("123");
        
        benefits = benefitRepository.findByPlanId(createdRxPlan.getPlanId());
        assertThat(benefits).hasSize(1);
        assertThat(benefits.get(0).getBenefitName().getName()).isEqualTo(Constants.TIER1_RX_SYSNAME);
        assertThat(benefits.get(0).getValue()).isEqualTo("4.56");
   
    }
	
	private CreatePlanDto newCreatePlanDto(Long networkId) {
        CreatePlanDto createPlanDto = new CreatePlanDto();
        createPlanDto.setNameByNetwork("Test plan name");
        createPlanDto.setRfpQuoteNetworkId(networkId);
        createPlanDto.getBenefits().add(new QuoteOptionAltPlanDto.Benefit("AMBULANCE", "Ambulance", "1", "STRING"));
        createPlanDto.getBenefits().add( new QuoteOptionAltPlanDto.Benefit("PCP", "PCP", "$10", "10%", "DOLLAR", "PERCENT"));
//        createPlanDto.getCost().add(new Cost(Constants.TIER1_PLAN_NAME, "1.1", Constants.VALUE_TYPE_STRING));
//        createPlanDto.getCost().add(new Cost(Constants.TIER2_PLAN_NAME, "1.2", Constants.VALUE_TYPE_STRING));
//        createPlanDto.getCost().add(new Cost(Constants.TIER3_PLAN_NAME, "1.3", Constants.VALUE_TYPE_STRING));
//        createPlanDto.getCost().add(new Cost(Constants.TIER4_PLAN_NAME, "1.4", Constants.VALUE_TYPE_STRING));
        createPlanDto.getRx().add(new Rx("RX_INDIVIDUAL_DEDUCTIBLE", "Rx Individual Deductible", "1", Constants.VALUE_TYPE_STRING));
        QuoteOptionAltRxDto extRx = new QuoteOptionAltRxDto();
        extRx.setName("ext rx plan");
        extRx.getRx().add(new Rx(Constants.TIER1_RX_SYSNAME, "Member Copay Tier 1", "0.98", Constants.VALUE_TYPE_STRING));
        createPlanDto.setExtRx(extRx);
        return createPlanDto;
    }

    @Test
    public void updatePlans() throws Exception{
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier();
        Network network = testEntityHelper.createTestNetwork(carrier, "HMO");
        ClientPlan clientPlan = testEntityHelper.createTestClientPlan(client, network.getType());

        final int currentYear = Year.now().getValue();

        CreatePlanDto createPlanDto = newCreatePlanDto(network.getNetworkId());

        performPostAndAssertResult(jsonUtils.toJson(createPlanDto), null, "/admin/clients/plans/{id}/createPlan", clientPlan.getClientPlanId());

        clientPlan.setTier1ErContribution(new Float(1.1));
        clientPlan.setTier4Census(new Long(22));

        ClientPlanDto dto = ClientPlanMapper.toDto(clientPlan);
        dto.setOutOfState(true);
        List<ClientPlanDto> dtos = new ArrayList<>();
        dtos.add(dto);

        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(dtos), null, "/admin/clients/plans/updatePlan");
        ClientPlanDto[] clientPlanDtos = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientPlanDto[].class);
        assertThat(clientPlanDtos).hasSize(1);
        ClientPlanDto clientPlanDto = clientPlanDtos[0];
        assertThat(clientPlanDto.getTier1ErContribution().equals(new Float(1.1))).isTrue();
        assertThat(clientPlanDto.getTier4Census().equals(new Long(22))).isTrue();
        assertThat(clientPlanDto.getOutOfState()).isTrue();
    }
}
