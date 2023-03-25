package com.benrevo.broker.service.program.CLSA;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.DHMO;
import static com.benrevo.common.Constants.DPPO;
import static com.benrevo.common.Constants.ER_CONTRIBUTION_TYPE_VOLUNTARY;
import static com.benrevo.common.Constants.HMO;
import static com.benrevo.common.Constants.HSA;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.LIFE;
import static com.benrevo.common.Constants.PPO;
import static com.benrevo.common.Constants.RX_HMO;
import static com.benrevo.common.Constants.RX_PPO;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.common.Constants.CLSA_TRUST_PROGRAM;
import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static java.util.Objects.isNull;
import static java.util.function.Function.identity;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.quote.instant.service.anthem.AnthemInstantQuoteService;
import com.benrevo.be.modules.quote.instant.service.program.CLSA.CLSAInstantQuoteService;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.SharedBrokerProgramService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AnthemCVCalculatedPlanDetails;
import com.benrevo.common.dto.CreateProgramQuoteDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.CompetitiveInfoOption;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.ClientRfpProduct;
import com.benrevo.data.persistence.entities.ExtProduct;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.repository.ActivityRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientRfpProductRepository;
import com.benrevo.data.persistence.repository.ExtProductRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpQuoteSummaryRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryPlanRepository;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.LocalDate;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class CLSAInstantQuoteServiceTest extends AbstractControllerTest {

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CLSAInstantQuoteService clsaInstantQuoteService;
    
    @Autowired
    private SharedBrokerProgramService sharedBrokerProgramService;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;
    
    @Autowired
    private RfpQuoteAncillaryPlanRepository rfpQuoteAncillaryPlanRepository;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Before
    @Override
    public void init() throws Exception{
        Broker broker = brokerRepository.findByBrokerToken(AbstractControllerTest.TEST_BROKERAGE_ID);
        broker.setBcc("test@a.com");
        brokerRepository.save(broker);

        AuthenticatedUser authentication = mock(AuthenticatedUser.class);
        // Mockito.whens() for your authorization object
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getDetails()).thenReturn(broker.getBrokerId());
        when(authentication.getName()).thenReturn("auth0|59b9d5a4af05bc3774a3045f");
        SecurityContextHolder.setContext(securityContext);

        ArgumentCaptor<MailDto> argument = ArgumentCaptor.forClass(MailDto.class);

        User user = new User("test");
        user.setUserMetadata( build( entry("first_name", "FirstName"), entry("last_name", "LastName") ) );

        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);
    }

    @After
    public void cleanUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void testMedicalInstantQuote() throws Exception {
        testInstantQuoteByProduct(MEDICAL);
    }

    @Test
    public void testDentalInstantQuote() throws Exception {
        testInstantQuoteByProduct(DENTAL);
    }

    @Test
    public void testVisionInstantQuote() throws Exception {
        testInstantQuoteByProduct(VISION);
    }
    
    @Test
    public void testAncillaryInstantQuote() throws Exception {
    	// the same implementation for all products, using any (LIFE)
        testInstantQuoteByProduct(LIFE);
    }

    public void testInstantQuoteByProduct(String product) throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);
        Program program = null;

        if(product.equals(MEDICAL)) {
            ClientPlan clientPlan1 = testEntityHelper
                .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
            ClientPlan clientPlan2 = testEntityHelper
                .createTestClientPlan("ppo client plan", client, "BLUE_SHIELD", "PPO");
            ClientPlan clientPlan3 = testEntityHelper
                .createTestClientPlan("hsa client plan", client, "BLUE_SHIELD", "HSA");

            PlanNameByNetwork rx_hmo = testEntityHelper
                .createTestPlanNameByNetwork("rx hmo client plan", "BLUE_SHIELD", "RX_HMO");
            PlanNameByNetwork rx_ppo = testEntityHelper
                .createTestPlanNameByNetwork("rx ppo client plan", "BLUE_SHIELD", "RX_PPO");
            PlanNameByNetwork rx_hsa = testEntityHelper
                .createTestPlanNameByNetwork("rx hsa client plan", "BLUE_SHIELD", "RX_HSA");
            clientPlan1.setRxPnn(rx_hmo);
            clientPlan2.setRxPnn(rx_ppo);
            clientPlan3.setRxPnn(rx_hsa);
            clientPlanRepository.save(Arrays.asList(clientPlan1, clientPlan2, clientPlan3));

            RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(CarrierType.UHC.name(), MEDICAL);
            program = programRepository.findByRfpCarrierAndName(rfpCarrier, CLSA_TRUST_PROGRAM);
        } else if(product.equals(DENTAL)) {

            ClientPlan clientPlan4 = testEntityHelper
                .createTestClientPlan("dhmo client plan", client, "BLUE_SHIELD", "DHMO");
            ClientPlan clientPlan5 = testEntityHelper
                .createTestClientPlan("dppo client plan", client, "BLUE_SHIELD", "DPPO");

            RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(CarrierType.METLIFE.name(), DENTAL);
            program = programRepository.findByRfpCarrierAndName(rfpCarrier, CLSA_TRUST_PROGRAM);
        } else if (product.equals(VISION)) {
            ClientPlan clientPlan6 = testEntityHelper
                .createTestClientPlan("vision client plan", client, "BLUE_SHIELD", "VISION");

            RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(CarrierType.METLIFE.name(), VISION);
            program = programRepository.findByRfpCarrierAndName(rfpCarrier, CLSA_TRUST_PROGRAM);
        } else if (PlanCategory.isAncillary(product)) {
        	RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(CarrierType.CIGNA.name(), LIFE);
            program = programRepository.findByRfpCarrierAndName(rfpCarrier, CLSA_TRUST_PROGRAM);

            Carrier currentCarrier = testEntityHelper.createTestCarrier(CarrierType.VOYA.name(), CarrierType.VOYA.displayName);
            PlanCategory planCategory = PlanCategory.valueOf(product);
        	AncillaryPlan ancillaryPlan = testEntityHelper.createTestAncillaryPlan("Current Ancillary",
        			planCategory, 
        			product.startsWith("VOL_") ? AncillaryPlanType.VOLUNTARY : AncillaryPlanType.BASIC, 
        			currentCarrier);
            testEntityHelper.createTestAncillaryClientPlan(client, ancillaryPlan, planCategory);
                
            CreateProgramQuoteDto params = new CreateProgramQuoteDto();
            params.setClientId(client.getClientId());
            params.setProgramId(program.getProgramId());

            clsaInstantQuoteService.generateProgramTrustQuote(client.getClientId(), params);
            
            assertAncillaryInstantQuote(client, product);
            // test body below for non-ancillary quotes
            return;
        }

        testEntityHelper.createTestRFPs(client);
        assertThat(program).isNotNull();

        // Product Instant Quote
        CreateProgramQuoteDto params = new CreateProgramQuoteDto();
        params.setClientId(client.getClientId());
        params.setProgramId(program.getProgramId());
        params.setZipCode("92101");
        params.setAverageAge("43");
        params.setNumEligibleEmployees("100");

        clsaInstantQuoteService.generateProgramTrustQuote(client.getClientId(), params);

        List<RfpQuoteOption> rfpQuoteOptions = rfpQuoteOptionRepository.findByClientIdAndCategory(client.getClientId(), product);
        assertThat(rfpQuoteOptions).isNotEmpty();
        assertThat(rfpQuoteOptions).hasSize(1);

        RfpQuoteOption rfpQuoteOption = rfpQuoteOptions.get(0);
        for(RfpQuoteOptionNetwork rqon : rfpQuoteOption.getRfpQuoteOptionNetworks()){
            RfpQuoteNetworkPlan selectedPlan = rqon.getSelectedRfpQuoteNetworkPlan();
            RfpQuoteNetworkPlan selectedRxPlan = rqon.getSelectedRfpQuoteNetworkRxPlan();
            PlanNameByNetwork pnn = null;

            if(selectedPlan != null && selectedPlan.getPnn()!= null) {
                pnn = selectedPlan.getPnn();
                switch (pnn.getPlanType()) {
                    case HMO:
                        assertThat(pnn.getName())
                            .isEqualTo(sharedBrokerProgramService.getDEFAULT_HMO_PLAN_NAME());
                        break;
                    case PPO:
                        assertThat(pnn.getName())
                            .isEqualTo(sharedBrokerProgramService.getDEFAULT_PPO_PLAN_NAME());
                        break;
                    case HSA:
                        assertThat(pnn.getName())
                            .isEqualTo(sharedBrokerProgramService.getDEFAULT_HSA_PLAN_NAME());
                        break;
                    case DHMO:
                        assertThat(pnn.getName())
                            .isEqualTo(sharedBrokerProgramService.getDEFAULT_DHMO_PLAN_NAME());
                        break;
                    case DPPO:
                        assertThat(pnn.getName())
                            .isEqualTo(sharedBrokerProgramService.getDEFAULT_DPPO_PLAN_NAME());
                        break;
                    case VISION:
                        assertThat(pnn.getName())
                            .isEqualTo(sharedBrokerProgramService.getDEFAULT_VPPO_PLAN_NAME());
                        break;
                }
            }

            if(selectedRxPlan != null && selectedRxPlan.getPnn() != null) {
                PlanNameByNetwork rxPnn = selectedRxPlan.getPnn();
                switch (rxPnn.getPlanType()) {
                    case RX_HMO:
                        assertThat(rxPnn.getName())
                            .isEqualTo(sharedBrokerProgramService.getDEFAULT_RX_HMO_PLAN_NAME());
                        break;
                    case RX_PPO:
                        if (pnn != null && pnn.getPlanType().equals(PPO)) {
                            assertThat(rxPnn.getName())
                                .isEqualTo(sharedBrokerProgramService.getDEFAULT_RX_PPO_PLAN_NAME());
                        } else if (pnn != null && pnn.getPlanType().equals(HSA)) {
                            assertThat(rxPnn.getName())
                                .isEqualTo(sharedBrokerProgramService.getDEFAULT_RX_HSA_PLAN_NAME());
                        }
                        break;
                }
            }
        }
    }
    
	private void assertAncillaryInstantQuote(Client client, String product) {
		List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), product);
        assertThat(rfpQuotes).hasSize(1);
		List<RfpQuoteAncillaryOption> rfpQuoteOptions = rfpQuoteAncillaryOptionRepository.findByRfpQuote(rfpQuotes.get(0));
        assertThat(rfpQuoteOptions).hasSize(1);
        RfpQuoteAncillaryOption rfpQuoteOption = rfpQuoteOptions.get(0);
        assertThat(rfpQuoteOption.getRfpQuoteAncillaryPlan()).isNotNull();
        assertThat(rfpQuoteOption.getRfpQuoteAncillaryPlan().getAncillaryPlan().getRates()).isNotNull();
        assertThat(rfpQuoteOption.getRfpQuoteAncillaryPlan().getAncillaryPlan().getRates().getVolume()).isNotZero();
        String matchPlanName = rfpQuoteOption.getRfpQuoteAncillaryPlan().getAncillaryPlan().getPlanName();
        PlanCategory planCategory = PlanCategory.valueOf(product);
        switch (planCategory) {
		case LIFE:
			assertThat(matchPlanName).startsWith(sharedBrokerProgramService.getDEFAULT_LIFE_PLAN_NAME_PREFIX());
			break;
		case VOL_LIFE:
			assertThat(matchPlanName).startsWith(sharedBrokerProgramService.getDEFAULT_VOL_LIFE_PLAN_NAME_PREFIX());
			break;
		case STD:
			assertThat(matchPlanName).startsWith(sharedBrokerProgramService.getDEFAULT_STD_PLAN_NAME_PREFIX());
			break;
		case LTD:
			assertThat(matchPlanName).startsWith(sharedBrokerProgramService.getDEFAULT_LTD_PLAN_NAME_PREFIX());
			break;
		default:
			throw new BaseException("Ancillary product not supported yet: " + product);
		}
        // check for covered volume have been copied to CLSA plans
        RfpQuote rfpQuote = rfpQuotes.get(0);
        List<RfpQuoteAncillaryPlan> alternatives = rfpQuoteAncillaryPlanRepository.findByRfpQuote(rfpQuote);
        List<ClientPlan> clientPlanList = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(
				rfpQuote.getRfpSubmission().getClient().getClientId(), planCategory.getPlanTypes());
        assertThat(clientPlanList).hasSize(1);
        for (RfpQuoteAncillaryPlan altPlan : alternatives) {
        	assertThat(altPlan.getAncillaryPlan().getRates().getVolume()).isNotZero();
		}
    }
}
