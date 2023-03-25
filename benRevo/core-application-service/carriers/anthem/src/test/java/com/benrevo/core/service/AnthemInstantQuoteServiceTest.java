package com.benrevo.core.service;

import static com.benrevo.common.Constants.ER_CONTRIBUTION_TYPE_VOLUNTARY;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.apache.commons.lang3.StringUtils.capitalize;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.lowerCase;

import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.CompetitiveInfoOption;
import com.benrevo.data.persistence.entities.Activity;
import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.quote.instant.service.InstantQuoteService;
import com.benrevo.be.modules.quote.instant.service.anthem.AnthemInstantQuoteService;
import com.benrevo.be.modules.rfp.service.BaseRfpService;
import com.benrevo.be.modules.rfp.service.RfpSubmitter;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AnthemCVCalculatedPlanDetails;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.QuoteOptionDetailsDto;
import com.benrevo.common.dto.QuoteOptionListDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.DateHelper;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.ClientRfpProduct;
import com.benrevo.data.persistence.entities.ExtProduct;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.repository.*;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientRfpProductRepository;
import com.benrevo.data.persistence.repository.ExtProductRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpQuoteSummaryRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpHeaders;
import org.joda.time.LocalDate;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class AnthemInstantQuoteServiceTest extends AbstractControllerTest {

    @Autowired
    private AnthemInstantQuoteService instantQuoteService;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpSubmitter rfpSubmitter;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private BaseRfpService rfpService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private RfpQuoteSummaryRepository rfpQuoteSummaryRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private ExtProductRepository extProductRepository;

    @Autowired
    private ClientRfpProductRepository clientRfpProductRepository;

    @Autowired
    ActivityRepository activityRepository;

    private static final String MEDICAL_PLAN_NAME = "T-Anthem Clear Value HMO 20/40/250/4 days 4000 OOP Rx:Essential $5/$20/$50/$70/30%";
    private static final String MEDICAL_NETWORK_NAME = "CV HMO Network";
    private static final String MEDICAL_FIVE_PERCENT_CHEAPER_PLAN_NAME = "S-Anthem Clear Value Ded HMO 2000 30/60/30% 7000 OOP Rx:Essential $5/$20/$50/$70/30%";
    private static final String MEDICAL_NETWORK_TYPE = "HMO";
    private static final int MEDICAL_COMMISSION = 20;

    private static final String VISION_PLAN_NAME = "BV 3A";
    private static final String VISION_NETWORK_NAME = "CV Vision Network";
    private static final String VISION_NETWORK_TYPE = "VISION";

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

    /**
     * To generate test rate files, create sheets for tier 4, 3, and 3
     * Use formulas ->
     * tier 4 ==> =CONCATENATE(Summary!AA8,"|",ROUND(Summary!AI8,2), "|",ROUND(Summary!AJ8,2),"|",ROUND(Summary!AK8,2),"|",ROUND(Summary!AL8,2))
     * tier 3 ==> =CONCATENATE(Summary!AA8, "|",ROUND(Summary!AN8,2),"|",ROUND(Summary!AO8,2),"|",ROUND(Summary!AP8,2))
     * tier 2 ==> =CONCATENATE(Summary!AA8,"|",ROUND(Summary!AR8,2),"|",ROUND(Summary!AS8,2))
     */
    @Test
    public void testMedicalInstantQuoteTierRates() {

        String[] testRatesFiles = new String[]{
            "Alameda_32_213_tier4_PlanRates", "Alameda_32_213_tier3_PlanRates", "Alameda_32_213_tier2_PlanRates",
            "LOS ANGELES_32_711_tier4_PlanRates", "LOS ANGELES_32_711_tier3_PlanRates", "LOS ANGELES_32_711_tier2_PlanRates"
        };

        ClassLoader classLoader = getClass().getClassLoader();
        Carrier carrier = carrierRepository.findByName(Constants.ANTHEM_CLEAR_VALUE_CARRIER);

        for(String fileName : testRatesFiles){
            System.out.println("File = "  + fileName);
            Map<String, Map<String, Float>> planToRatesMap = new HashMap<>();
            String[] values = StringUtils.split(fileName, "_");
            String predominantCounty = values[0];
            Float averageAge = Float.parseFloat(values[1]);
            String sicCode = values[2];
            String tierValue = values[3];

            Integer tier = 4;
            if(tierValue.contains("4")){
                tier = 4;
            }else if(tierValue.contains("3")){
                tier = 3;
            } else if(tierValue.contains("2")){
                tier = 2;
            } else if(tierValue.contains("1")){
                tier = 1;
            }

            InputStream r = classLoader.getResourceAsStream("anthem/" + fileName);
             List<String> lines = new BufferedReader(new InputStreamReader(r,
                StandardCharsets.UTF_8)).lines().collect(Collectors.toList());

            final Integer tierNumber = tier;
            lines.forEach(line -> {
                String[] lineSplit = StringUtils.split(line, "|");
                Map<String, Float> rates = new HashMap<>();
                if(tierNumber == 2) {
                    Float f1 = Float.parseFloat(lineSplit[1]);
                    Float f2 = Float.parseFloat(lineSplit[2]);
                    rates.put("tier1Rate", f1 + MEDICAL_COMMISSION);
                    rates.put("tier2Rate", f2 + MEDICAL_COMMISSION);
                }else if(tierNumber == 3) {
                    Float f1 = Float.parseFloat(lineSplit[1]);
                    Float f2 = Float.parseFloat(lineSplit[2]);
                    Float f3 = Float.parseFloat(lineSplit[3]);
                    rates.put("tier1Rate", f1 + MEDICAL_COMMISSION);
                    rates.put("tier2Rate", f2 + MEDICAL_COMMISSION);
                    rates.put("tier3Rate", f3 + MEDICAL_COMMISSION);
                } else if(tierNumber == 4) {
                    Float f1 = Float.parseFloat(lineSplit[1]);
                    Float f2 = Float.parseFloat(lineSplit[2]);
                    Float f3 = Float.parseFloat(lineSplit[3]);
                    Float f4 = Float.parseFloat(lineSplit[4]);
                    rates.put("tier1Rate", f1 + MEDICAL_COMMISSION);
                    rates.put("tier2Rate", f2 + MEDICAL_COMMISSION);
                    rates.put("tier3Rate", f3 + MEDICAL_COMMISSION);
                    rates.put("tier4Rate", f4 + MEDICAL_COMMISSION);
                }
                planToRatesMap.put(lineSplit[0], rates);
            });

            RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
            Client client = testEntityHelper.createTestClient();
            client.setAverageAge(averageAge);
            client.setPredominantCounty(predominantCounty);
            client.setSicCode(sicCode);
            client.setEffectiveDate(new LocalDate(2018, 7, 1).toDate());
            RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

            RFP rfp = new RFP();
            rfp.setClient(client);
            rfp.setRatingTiers(tier);
            rfp.setPaymentMethod("PEPM");
            rfp.setCommission(MEDICAL_COMMISSION + "");

            instantQuoteService.setShouldAddMedicalOnePercent(false);
            AnthemCVCalculatedPlanDetails detail = new AnthemCVCalculatedPlanDetails();
            RfpQuote rfpQuote = instantQuoteService.generateInstantQuote(rfp, rfpSubmission, Constants.MEDICAL, detail, true);
            rfpQuote.getRfpQuoteNetworks().forEach(rqn -> {
                rqn.getRfpQuoteNetworkPlans().forEach(rqnp -> {
                    String planName = rqnp.getPnn().getName();

                    assertTrue(planToRatesMap.containsKey(planName));
                    Map<String, Float> rates = planToRatesMap.get(planName);

                    if(tierNumber == 2) {
                        assertTrue(planName,rqnp.getTier1Rate().intValue() == rates.get("tier1Rate").intValue());
                        assertTrue(planName,rqnp.getTier2Rate().intValue() == rates.get("tier2Rate").intValue());
                    }else if(tierNumber == 3) {
                        assertTrue(planName,rqnp.getTier1Rate().intValue() == rates.get("tier1Rate").intValue());
                        assertTrue(planName,rqnp.getTier2Rate().intValue() == rates.get("tier2Rate").intValue());
                        assertTrue(planName,rqnp.getTier3Rate().intValue() == rates.get("tier3Rate").intValue());
                    } else if(tierNumber == 4) {
                        assertTrue(planName,rqnp.getTier1Rate().intValue() == rates.get("tier1Rate").intValue());
                        assertTrue(planName,rqnp.getTier2Rate().intValue() == rates.get("tier2Rate").intValue());
                        assertTrue(planName,rqnp.getTier3Rate().intValue() == rates.get("tier3Rate").intValue());
                        assertTrue(planName,rqnp.getTier4Rate().intValue() == rates.get("tier4Rate").intValue());
                    }
                });
            });
        }
    }

    private Float removeOnePercentToMedicalRates(Float rate){
        return rate - (rate * 0.010000f);
    }

    @Test
    public void testMedicalInstantQuoteWithOnePercentCreation() {
        Carrier carrier = carrierRepository.findByName(Constants.ANTHEM_CLEAR_VALUE_CARRIER);
        Network network = networkRepository.findByNameAndTypeAndCarrier(MEDICAL_NETWORK_NAME, MEDICAL_NETWORK_TYPE, carrier);
        if (network == null) {
            network = testEntityHelper.createTestNetwork(carrier, MEDICAL_NETWORK_TYPE, MEDICAL_NETWORK_NAME);
        }
        List<PlanNameByNetwork> pnnList = planNameByNetworkRepository.findByNetworkAndNameAndPlanType(network, MEDICAL_PLAN_NAME, MEDICAL_NETWORK_TYPE);
        if (CollectionUtils.isEmpty(pnnList)) {
            Plan plan = testEntityHelper.createTestPlan(carrier, MEDICAL_PLAN_NAME, MEDICAL_NETWORK_TYPE);
            testEntityHelper.createTestPlanNameByNetwork(plan, network);
        }
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        Client client = testEntityHelper.createTestClient();
        client.setAverageAge(32f);
        client.setPredominantCounty("Alameda");
        client.setSicCode("213");
        client.setEffectiveDate(new LocalDate(2018, 7, 1).toDate());
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RFP rfp = new RFP();
        rfp.setClient(client);
        rfp.setRatingTiers(4);
        rfp.setPaymentMethod("PEPM");
        rfp.setCommission(MEDICAL_COMMISSION + "");

        instantQuoteService.setShouldAddMedicalOnePercent(true);
        AnthemCVCalculatedPlanDetails detail = new AnthemCVCalculatedPlanDetails();
        RfpQuote rfpQuote = instantQuoteService.generateInstantQuote(rfp, rfpSubmission, Constants.MEDICAL, detail, true);
        rfpQuote = rfpQuoteRepository.findOne(rfpQuote.getRfpQuoteId());

        assertThat(rfpQuote).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotEmpty();
        RfpQuoteNetwork hmoTraditionalNetwork = rfpQuote.getRfpQuoteNetworks().stream()
            .filter(net -> MEDICAL_NETWORK_NAME.equals(net.getNetwork().getName()) && MEDICAL_NETWORK_TYPE.equals(net.getNetwork().getType()))
            .findFirst().orElse(null);
        assertThat(hmoTraditionalNetwork).isNotNull();

        assertThat(hmoTraditionalNetwork.getRfpQuoteNetworkPlans()).isNotNull();
        assertThat(hmoTraditionalNetwork.getRfpQuoteNetworkPlans()).isNotEmpty();

        RfpQuoteNetworkPlan pl = hmoTraditionalNetwork.getRfpQuoteNetworkPlans().stream().filter(plan -> MEDICAL_PLAN_NAME.equals(plan.getPnn().getName())).findFirst().orElse(null);
        assertThat(pl).isNotNull();
        assertTierRates(pl, 410 + MEDICAL_COMMISSION, 903 + MEDICAL_COMMISSION,
            739 + MEDICAL_COMMISSION, 1273 + MEDICAL_COMMISSION);

    }

    @Test
    public void testMedicalInstantQuoteCreation() {
        Carrier carrier = carrierRepository.findByName(Constants.ANTHEM_CLEAR_VALUE_CARRIER);
        Network network = networkRepository.findByNameAndTypeAndCarrier(MEDICAL_NETWORK_NAME, MEDICAL_NETWORK_TYPE, carrier);
        if (network == null) {
            network = testEntityHelper.createTestNetwork(carrier, MEDICAL_NETWORK_TYPE, MEDICAL_NETWORK_NAME);
        }
        List<PlanNameByNetwork> pnnList = planNameByNetworkRepository.findByNetworkAndNameAndPlanType(network, MEDICAL_PLAN_NAME, MEDICAL_NETWORK_TYPE);
        if (CollectionUtils.isEmpty(pnnList)) {
            Plan plan = testEntityHelper.createTestPlan(carrier, MEDICAL_PLAN_NAME, MEDICAL_NETWORK_TYPE);
            testEntityHelper.createTestPlanNameByNetwork(plan, network);
        }
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        Client client = testEntityHelper.createTestClient();
        client.setAverageAge(32f);
        client.setPredominantCounty("Alameda");
        client.setSicCode("213");
        client.setEffectiveDate(new LocalDate(2018, 7, 1).toDate());
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RFP rfp = new RFP();
        rfp.setClient(client);
        rfp.setRatingTiers(4);
        rfp.setPaymentMethod("PEPM");
        rfp.setCommission(MEDICAL_COMMISSION + "");

        instantQuoteService.setShouldAddMedicalOnePercent(false);
        AnthemCVCalculatedPlanDetails detail = new AnthemCVCalculatedPlanDetails();
        RfpQuote rfpQuote = instantQuoteService.generateInstantQuote(rfp, rfpSubmission, Constants.MEDICAL, detail, true);
        rfpQuote = rfpQuoteRepository.findOne(rfpQuote.getRfpQuoteId());

        assertThat(rfpQuote).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotEmpty();
        RfpQuoteNetwork hmoTraditionalNetwork = rfpQuote.getRfpQuoteNetworks().stream()
                .filter(net -> MEDICAL_NETWORK_NAME.equals(net.getNetwork().getName()) && MEDICAL_NETWORK_TYPE.equals(net.getNetwork().getType()))
                .findFirst().orElse(null);
        assertThat(hmoTraditionalNetwork).isNotNull();

        assertThat(hmoTraditionalNetwork.getRfpQuoteNetworkPlans()).isNotNull();
        assertThat(hmoTraditionalNetwork.getRfpQuoteNetworkPlans()).isNotEmpty();

        RfpQuoteNetworkPlan pl = hmoTraditionalNetwork.getRfpQuoteNetworkPlans().stream().filter(plan -> MEDICAL_PLAN_NAME.equals(plan.getPnn().getName())).findFirst().orElse(null);
        assertThat(pl).isNotNull();
        assertTierRates(pl, 406 + MEDICAL_COMMISSION, 894 + MEDICAL_COMMISSION,
            731 + MEDICAL_COMMISSION, 1260 + MEDICAL_COMMISSION);

        // 3 tiers test
        rfp.setRatingTiers(3);

        instantQuoteService.setShouldAddMedicalOnePercent(false);
        detail = new AnthemCVCalculatedPlanDetails();
        rfpQuote = instantQuoteService.generateInstantQuote(rfp, rfpSubmission, Constants.MEDICAL, detail, true);
        rfpQuote = rfpQuoteRepository.findOne(rfpQuote.getRfpQuoteId());

        assertThat(rfpQuote).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotEmpty();
        hmoTraditionalNetwork = rfpQuote.getRfpQuoteNetworks().stream()
                .filter(net -> MEDICAL_NETWORK_NAME.equals(net.getNetwork().getName()) && MEDICAL_NETWORK_TYPE.equals(net.getNetwork().getType()))
                .findFirst().orElse(null);
        assertThat(hmoTraditionalNetwork).isNotNull();

        assertThat(hmoTraditionalNetwork.getRfpQuoteNetworkPlans()).isNotNull();
        assertThat(hmoTraditionalNetwork.getRfpQuoteNetworkPlans()).isNotEmpty();

        pl = hmoTraditionalNetwork.getRfpQuoteNetworkPlans().stream().filter(plan -> MEDICAL_PLAN_NAME.equals(plan.getPnn().getName())).findFirst().orElse(null);
        assertThat(pl).isNotNull();
        assertThat(pl.getTier1Rate().intValue()).isEqualTo(406 + MEDICAL_COMMISSION);
        assertThat(pl.getTier2Rate().intValue()).isEqualTo(853 + MEDICAL_COMMISSION);
        assertThat(pl.getTier3Rate().intValue()).isEqualTo(1219 + MEDICAL_COMMISSION);
        assertThat(pl.getTier4Rate()).isNotNull();

        // % payment method
        rfp.setPaymentMethod("%");

        instantQuoteService.setShouldAddMedicalOnePercent(false);
        detail = new AnthemCVCalculatedPlanDetails();
        rfpQuote = instantQuoteService.generateInstantQuote(rfp, rfpSubmission, Constants.MEDICAL, detail, true);
        rfpQuote = rfpQuoteRepository.findOne(rfpQuote.getRfpQuoteId());

        assertThat(rfpQuote).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotEmpty();
        hmoTraditionalNetwork = rfpQuote.getRfpQuoteNetworks().stream()
                .filter(net -> MEDICAL_NETWORK_NAME.equals(net.getNetwork().getName()) && MEDICAL_NETWORK_TYPE.equals(net.getNetwork().getType()))
                .findFirst().orElse(null);
        assertThat(hmoTraditionalNetwork).isNotNull();

        assertThat(hmoTraditionalNetwork.getRfpQuoteNetworkPlans()).isNotNull();
        assertThat(hmoTraditionalNetwork.getRfpQuoteNetworkPlans()).isNotEmpty();

        pl = hmoTraditionalNetwork.getRfpQuoteNetworkPlans().stream().filter(plan -> MEDICAL_PLAN_NAME.equals(plan.getPnn().getName())).findFirst().orElse(null);
        assertThat(pl).isNotNull();
        assertThat(pl.getTier1Rate().intValue()).isEqualTo(Math.round(406*(MEDICAL_COMMISSION /100f + 1)));
        assertThat(pl.getTier2Rate().intValue()).isEqualTo(Math.round(853*(MEDICAL_COMMISSION /100f + 1)));
        assertThat(pl.getTier3Rate().intValue()).isEqualTo(Math.round(1219*(MEDICAL_COMMISSION /100f + 1)));
        assertThat(pl.getTier4Rate()).isNotNull();
    }

    @Test
    public void testDentalInstantQuoteCreation_SouthClient() {
    	Broker broker = testEntityHelper.createTestBroker("testBrokerName");
    	RfpQuote rfpQuote = testDentalInstantQuoteCreation(broker, null, "Kern", null); // SOUTH

    	Map<String, RfpQuoteNetwork> networksByName = rfpQuote.getRfpQuoteNetworks().stream()
    			.collect(Collectors.toMap(n -> n.getNetwork().getName(), identity()));

    	// check created networks
    	assertThat(networksByName).hasSize(2);

    	RfpQuoteNetwork dppoNetwork = networksByName.get(Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK);
    	RfpQuoteNetwork dhmoNetwork = networksByName.get(Constants.ANTHEM_CV_DENTAL_DHMO_NETWORK);
    	assertThat(dppoNetwork).isNotNull();
        assertThat(dhmoNetwork).isNotNull();

        // check created plans
        Map<String, RfpQuoteNetworkPlan> dppoPlansByName = dppoNetwork.getRfpQuoteNetworkPlans().stream()
    			.collect(Collectors.toMap(p -> p.getPnn().getName(), identity()));

        assertThat(dppoPlansByName).hasSize(2);
        assertThat(dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_MEDIUM_PLAN)).isNotNull();
        assertThat(dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_HIGH_PLAN)).isNotNull();

        Map<String, RfpQuoteNetworkPlan> dhmoPlansByName = dhmoNetwork.getRfpQuoteNetworkPlans().stream()
    			.collect(Collectors.toMap(p -> p.getPnn().getName(), identity()));

        assertThat(dhmoPlansByName).hasSize(1);
        assertThat(dhmoPlansByName.get(Constants.ANTHEM_CV_DENTAL_DHMO_2000A)).isNotNull();
    }

    @Test
    public void testDentalInstantQuoteCreation_NorthClient() {
    	Broker broker = testEntityHelper.createTestBroker("testBrokerName");

        RFP rfp = new RFP();
        rfp.setRatingTiers(4);
        rfp.setPaymentMethod("%");
        rfp.setCommission("5");

    	RfpQuote rfpQuote = testDentalInstantQuoteCreation(broker, rfp,"Lake", null); // NORTH

    	Map<String, RfpQuoteNetwork> networksByName = rfpQuote.getRfpQuoteNetworks().stream()
    			.collect(Collectors.toMap(n -> n.getNetwork().getName(), identity()));

    	// check created networks
    	assertThat(networksByName).hasSize(2);

    	RfpQuoteNetwork dppoNetwork = networksByName.get(Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK);
    	RfpQuoteNetwork dhmoNetwork = networksByName.get(Constants.ANTHEM_CV_DENTAL_DHMO_NETWORK);
    	assertThat(dppoNetwork).isNotNull();
        assertThat(dhmoNetwork).isNotNull();

        // check created plans
        Map<String, RfpQuoteNetworkPlan> dppoPlansByName = dppoNetwork.getRfpQuoteNetworkPlans().stream()
    			.collect(Collectors.toMap(p -> p.getPnn().getName(), identity()));

        assertThat(dppoPlansByName).hasSize(3);
        assertThat(dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_LOW_PLAN)).isNotNull();
        assertThat(dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_MEDIUM_PLAN)).isNotNull();
        assertThat(dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_HIGH_PLAN)).isNotNull();

        RfpQuoteNetworkPlan pl = dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_LOW_PLAN);
        RfpQuoteNetworkPlan mdPln = dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_MEDIUM_PLAN);
        RfpQuoteNetworkPlan highPln = dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_HIGH_PLAN);

        // magic values? // code from old test implementation, not removed
        assertTierRates(pl, 19, 40, 44, 67);

        assertTierRates(mdPln, 29, 59, 66, 101);

        assertTierRates(highPln, 32, 66, 82, 122);

        Map<String, RfpQuoteNetworkPlan> dhmoPlansByName = dhmoNetwork.getRfpQuoteNetworkPlans().stream()
    			.collect(Collectors.toMap(p -> p.getPnn().getName(), identity()));

        assertThat(dhmoPlansByName).hasSize(0);
    }

    @Test
    public void testDentalInstantQuoteCreation_NorthClient_With_06022018_EffectiveDate() {
        Broker broker = testEntityHelper.createTestBroker("testBrokerName");

        RFP rfp = new RFP();
        rfp.setRatingTiers(4);
        rfp.setPaymentMethod("%");
        rfp.setCommission("5");

        RfpQuote rfpQuote = testDentalInstantQuoteCreation(broker, rfp,"Lake",
            DateHelper.fromStringToDate("06/02/2018")); // NORTH

        Map<String, RfpQuoteNetwork> networksByName = rfpQuote.getRfpQuoteNetworks().stream()
            .collect(Collectors.toMap(n -> n.getNetwork().getName(), identity()));

        // check created networks
        assertThat(networksByName).hasSize(2);

        RfpQuoteNetwork dppoNetwork = networksByName.get(Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK);
        RfpQuoteNetwork dhmoNetwork = networksByName.get(Constants.ANTHEM_CV_DENTAL_DHMO_NETWORK);
        assertThat(dppoNetwork).isNotNull();
        assertThat(dhmoNetwork).isNotNull();

        // check created plans
        Map<String, RfpQuoteNetworkPlan> dppoPlansByName = dppoNetwork.getRfpQuoteNetworkPlans().stream()
            .collect(Collectors.toMap(p -> p.getPnn().getName(), identity()));

        assertThat(dppoPlansByName).hasSize(3);
        assertThat(dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_LOW_PLAN)).isNotNull();
        assertThat(dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_MEDIUM_PLAN)).isNotNull();
        assertThat(dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_HIGH_PLAN)).isNotNull();

        RfpQuoteNetworkPlan pl = dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_LOW_PLAN);
        RfpQuoteNetworkPlan mdPln = dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_MEDIUM_PLAN);
        RfpQuoteNetworkPlan highPln = dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_HIGH_PLAN);

        // magic values? // code from old test implementation, not removed
        assertTierRates(pl, 20, 41, 45, 69);

        assertTierRates(mdPln, 29, 61, 68, 103);

        assertTierRates(highPln, 33, 68, 84, 125);

        Map<String, RfpQuoteNetworkPlan> dhmoPlansByName = dhmoNetwork.getRfpQuoteNetworkPlans().stream()
            .collect(Collectors.toMap(p -> p.getPnn().getName(), identity()));

        assertThat(dhmoPlansByName).hasSize(0);
    }

    private void assertTierRates(RfpQuoteNetworkPlan highPln, int tier1, int tier2,
        int tier3, int tier4) {
        assertThat(highPln.getTier1Rate().intValue()).isEqualTo(tier1);
        assertThat(highPln.getTier2Rate().intValue()).isEqualTo(tier2);
        assertThat(highPln.getTier3Rate().intValue()).isEqualTo(tier3);
        assertThat(highPln.getTier4Rate().intValue()).isEqualTo(tier4);
    }

    @Ignore // now use client locale based on predominant_county
            // but it cannot be null as InstantQuoteService#generateDentalQuote uses it
    @Test
    public void testDentalInstantQuoteCreation_NullLocaleBroker() {
    	Broker broker = testEntityHelper.createTestBroker("testBrokerName", null);
    	RfpQuote rfpQuote = testDentalInstantQuoteCreation(broker, null, null, null);

    	Map<String, RfpQuoteNetwork> networksByName = rfpQuote.getRfpQuoteNetworks().stream()
    			.collect(Collectors.toMap(n -> n.getNetwork().getName(), identity()));

    	// check created networks
    	assertThat(networksByName).hasSize(2);

    	RfpQuoteNetwork dppoNetwork = networksByName.get(Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK);
    	RfpQuoteNetwork dhmoNetwork = networksByName.get(Constants.ANTHEM_CV_DENTAL_DHMO_NETWORK);
    	assertThat(dppoNetwork).isNotNull();
        assertThat(dhmoNetwork).isNotNull();

        // check created plans
        Map<String, RfpQuoteNetworkPlan> dppoPlansByName = dppoNetwork.getRfpQuoteNetworkPlans().stream()
    			.collect(Collectors.toMap(p -> p.getPnn().getName(), identity()));

        assertThat(dppoPlansByName).hasSize(3);
        assertThat(dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_LOW_PLAN)).isNotNull();
        assertThat(dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_MEDIUM_PLAN)).isNotNull();
        assertThat(dppoPlansByName.get(Constants.ANTHEM_CV_DENTAL_HIGH_PLAN)).isNotNull();

        Map<String, RfpQuoteNetworkPlan> dhmoPlansByName = dhmoNetwork.getRfpQuoteNetworkPlans().stream()
    			.collect(Collectors.toMap(p -> p.getPnn().getName(), identity()));

        assertThat(dhmoPlansByName).hasSize(1);
        assertThat(dhmoPlansByName.get(Constants.ANTHEM_CV_DENTAL_DHMO_2000A)).isNotNull();
    }


    private RfpQuote testDentalInstantQuoteCreation(Broker broker, RFP rfp, String predominantCounty,
        Date effectiveDate) {
        Carrier carrier = carrierRepository.findByName(Constants.ANTHEM_CLEAR_VALUE_CARRIER);
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.DENTAL);
        Client client = testEntityHelper.createTestClient("testClientName", broker);
        client.setAverageAge(32f);
        client.setEffectiveDate(isNull(effectiveDate) ? DateHelper.fromStringToDate("01/01/2018") : effectiveDate);
        client.setPredominantCounty(predominantCounty == null ? "Lake" : predominantCounty);
        client.setSicCode("111");
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        if(rfp == null) {
            rfp = new RFP();
            rfp.setRatingTiers(4);
        }
        rfp.setClient(client);

        instantQuoteService.setShouldAddMedicalOnePercent(false);
        AnthemCVCalculatedPlanDetails detail = new AnthemCVCalculatedPlanDetails();
        RfpQuote rfpQuote = instantQuoteService.generateInstantQuote(rfp, rfpSubmission, Constants.DENTAL, detail, true);
        rfpQuote = rfpQuoteRepository.findOne(rfpQuote.getRfpQuoteId());

        return rfpQuote;

    }

    @Test
    public void testVisionInstantQuoteCreation() {
        Carrier carrier = carrierRepository.findByName(Constants.ANTHEM_CLEAR_VALUE_CARRIER);
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.VISION);
        Client client = testEntityHelper.createTestClient();
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RFP rfp = new RFP();
        rfp.setRatingTiers(2);
        rfp.setClient(client);

        instantQuoteService.setShouldAddMedicalOnePercent(false);
        AnthemCVCalculatedPlanDetails detail = new AnthemCVCalculatedPlanDetails();
        RfpQuote rfpQuote = instantQuoteService.generateInstantQuote(rfp, rfpSubmission, Constants.VISION, detail, true);
        rfpQuote = rfpQuoteRepository.findOne(rfpQuote.getRfpQuoteId());

        assertThat(rfpQuote).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotEmpty();
        RfpQuoteNetwork visionNetwork = rfpQuote.getRfpQuoteNetworks().stream()
                .filter(net -> VISION_NETWORK_NAME.equals(net.getNetwork().getName()) && VISION_NETWORK_TYPE.equals(net.getNetwork().getType()))
                .findFirst().orElse(null);
        assertThat(visionNetwork).isNotNull();

        assertThat(visionNetwork.getRfpQuoteNetworkPlans()).isNotNull();
        assertThat(visionNetwork.getRfpQuoteNetworkPlans()).isNotEmpty();

        RfpQuoteNetworkPlan pl = visionNetwork.getRfpQuoteNetworkPlans().stream().filter(plan -> VISION_PLAN_NAME.equals(plan.getPnn().getName())).findFirst().orElse(null);
        assertThat(pl).isNotNull();
        assertThat(pl.getTier1Rate().intValue()).isEqualTo(9);
        assertThat(pl.getTier2Rate().intValue()).isEqualTo(21);
        assertThat(pl.getTier3Rate()).isNotNull();
        assertThat(pl.getTier4Rate()).isNotNull();

        // 3 tiers test
        rfp.setRatingTiers(3);

        instantQuoteService.setShouldAddMedicalOnePercent(false);
        detail = new AnthemCVCalculatedPlanDetails();
        rfpQuote = instantQuoteService.generateInstantQuote(rfp, rfpSubmission, Constants.VISION, detail, true);
        rfpQuote = rfpQuoteRepository.findOne(rfpQuote.getRfpQuoteId());

        assertThat(rfpQuote).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotEmpty();
        visionNetwork = rfpQuote.getRfpQuoteNetworks().stream()
                .filter(net -> VISION_NETWORK_NAME.equals(net.getNetwork().getName()) && VISION_NETWORK_TYPE.equals(net.getNetwork().getType()))
                .findFirst().orElse(null);
        assertThat(visionNetwork).isNotNull();

        assertThat(visionNetwork.getRfpQuoteNetworkPlans()).isNotNull();
        assertThat(visionNetwork.getRfpQuoteNetworkPlans()).isNotEmpty();

        pl = visionNetwork.getRfpQuoteNetworkPlans().stream().filter(plan -> VISION_PLAN_NAME.equals(plan.getPnn().getName())).findFirst().orElse(null);
        assertThat(pl).isNotNull();
        assertThat(pl.getTier1Rate().intValue()).isEqualTo(9);
        assertThat(pl.getTier2Rate().intValue()).isEqualTo(15);
        assertThat(pl.getTier3Rate().intValue()).isEqualTo(25);
        assertThat(pl.getTier4Rate()).isNotNull();

        // 4 tiers test
        rfp.setRatingTiers(4);

        instantQuoteService.setShouldAddMedicalOnePercent(false);
        detail = new AnthemCVCalculatedPlanDetails();
        rfpQuote = instantQuoteService.generateInstantQuote(rfp, rfpSubmission, Constants.VISION, detail, true);
        rfpQuote = rfpQuoteRepository.findOne(rfpQuote.getRfpQuoteId());

        assertThat(rfpQuote).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotNull();
        assertThat(rfpQuote.getRfpQuoteNetworks()).isNotEmpty();
        visionNetwork = rfpQuote.getRfpQuoteNetworks().stream()
                .filter(net -> VISION_NETWORK_NAME.equals(net.getNetwork().getName()) && VISION_NETWORK_TYPE.equals(net.getNetwork().getType()))
                .findFirst().orElse(null);
        assertThat(visionNetwork).isNotNull();

        assertThat(visionNetwork.getRfpQuoteNetworkPlans()).isNotNull();
        assertThat(visionNetwork.getRfpQuoteNetworkPlans()).isNotEmpty();

        pl = visionNetwork.getRfpQuoteNetworkPlans().stream().filter(plan -> VISION_PLAN_NAME.equals(plan.getPnn().getName())).findFirst().orElse(null);
        assertThat(pl).isNotNull();
        assertTierRates(pl, 9, 16, 17, 25);
    }

    /**@Test
    public void testMedicalOption1Creation() throws Exception {
        Carrier carrier = carrierRepository.findByName(Constants.ANTHEM_CLEAR_VALUE_CARRIER);
        Network network = networkRepository.findByNameAndTypeAndCarrier(MEDICAL_NETWORK_NAME, MEDICAL_NETWORK_TYPE, carrier);
        if (network == null) {
            network = testEntityHelper.createTestNetwork(carrier, MEDICAL_NETWORK_TYPE, MEDICAL_NETWORK_NAME);
        }
        List<PlanNameByNetwork> pnnList = planNameByNetworkRepository.findByNetworkAndNameAndPlanType(network, MEDICAL_PLAN_NAME, MEDICAL_NETWORK_TYPE);
        PlanNameByNetwork pnn;
        if (CollectionUtils.isEmpty(pnnList)) {
            Plan plan = testEntityHelper.createTestPlan(carrier, MEDICAL_PLAN_NAME, MEDICAL_NETWORK_TYPE);
            pnn = testEntityHelper.createTestPlanNameByNetwork(plan, network);
        }else{
            pnn = pnnList.get(0);
        }


        RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(carrier.getName(), Constants.MEDICAL);
        if(rfpCarrier == null){
            rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        }

        Broker b = brokerRepository.findByName("FTP Brokerage");
        Client client = testEntityHelper.buildTestClient("testClient", b);
        client.setAverageAge(32f);
        client.setPredominantCounty("Alameda");
        client.setSicCode("213");
        client.setEffectiveDate(new LocalDate(2018, 7, 1).toDate());
        client = clientRepository.save(client);


        RFP rfp = new RFP();
        rfp.setClient(client);
        rfp.setRatingTiers(4);
        rfp.setPaymentMethod("PEPM");
        rfp.setCommission(MEDICAL_COMMISSION + "");
        rfp.setProduct(Constants.MEDICAL);
        rfp = rfpRepository.save(rfp);
        rfp.setOptions(testEntityHelper.createTestRfpOptions(rfp, 1));

        RFP visionRfp = new RFP();
        visionRfp.setClient(client);
        visionRfp.setRatingTiers(4);
        visionRfp.setPaymentMethod("PEPM");
        visionRfp.setCommission(MEDICAL_COMMISSION + "");
        visionRfp.setProduct(Constants.VISION);
        visionRfp = rfpRepository.save(visionRfp);
        visionRfp.setOptions(testEntityHelper.createTestRfpOptions(visionRfp, 1));

        RfpToPnn rfpToPnn = testEntityHelper.createTestRfpToPNN(rfp, pnn);

        List<Long> rfps = new ArrayList<>();
        rfps.add(rfp.getRfpId());
        rfps.add(visionRfp.getRfpId());

        rfpSubmitter.createRfpSubmissions(client, rfps);
        rfpService.createClientPlans(client, rfps);
        instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfps);
        flushAndClear();


        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options")
            .param("clientId", client.getClientId().toString())
            .param("category", Constants.MEDICAL)
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andReturn();

        MockHttpServletResponse response = mvcResult.getResponse();
        String responseContent = response.getContentAsString();

        QuoteOptionListDto quoteOptionListDto = jsonUtils.fromJson(responseContent, QuoteOptionListDto.class);

        mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options/{optionId}", quoteOptionListDto.getOptions().get(0).getId())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andReturn();

        responseContent = mvcResult.getResponse().getContentAsString();
        QuoteOptionDetailsDto optionDetailsDto = jsonUtils.fromJson(responseContent, QuoteOptionDetailsDto.class);
        assertThat(optionDetailsDto).isNotNull();
        assertThat(optionDetailsDto.getName()).isEqualTo("Option 1");
        assertThat(optionDetailsDto.getDetailedPlans()).hasSize(1);
        assertThat(optionDetailsDto.getDetailedPlans().get(0).getNetworkName()).isEqualTo(MEDICAL_NETWORK_NAME);
        assertThat(optionDetailsDto.getDetailedPlans().get(0).getNewPlan().getName()).isEqualTo(MEDICAL_FIVE_PERCENT_CHEAPER_PLAN_NAME);
    }*/

    private RFP getRfpByProduct(List<RFP> rfps, String product){
        RFP r = null;
        for(RFP rfp : rfps){
            if(rfp.getProduct().equalsIgnoreCase(product)){
                r = rfp;
                break;
            }
        }
        if(r == null){
            throw new NotFoundException("AnthemRfpSubmitterServiceTest - RFP with product=" + product + " not found");
        }
        return r;
    }

    @Test
    public void testSuccessfulRFPSubmitter() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(AnthemInstantQuoteService.ANTHEM_CV_START_EFFECTIVE_DATE);
        client = clientRepository.save(client);
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto submissionStatusDto = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);
        assertNotNull(submissionStatusDto);
        assertTrue(submissionStatusDto.isRfpSubmittedSuccessfully());

        testInstantQuoteActivitiesCreated(client, true, true, true, 3);
    }

    @Test
    public void testRFPSubmitter_NoEnoughEligibleEmployees() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEligibleEmployees(90L);
        clientRepository.save(client);
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto cvRfpSubmissionStatus = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);
        assertNotNull(cvRfpSubmissionStatus);

        verifyNoQuoteAndQuoteSummaryCreated(client, rfps,0, true);

        assertFalse(cvRfpSubmissionStatus.isRfpSubmittedSuccessfully());
        assertEquals(cvRfpSubmissionStatus.getDisqualificationReason(), instantQuoteService.getAnthemCvNotEnoughEligibleEmployeesDisqualificationReason());
    }

    @Test
    public void testRFPSubmitter_NotEnoughPercentParticipatingEmployees() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEligibleEmployees(101L);
        client.setParticipatingEmployees(75L);
        clientRepository.save(client);
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto cvRfpSubmissionStatus = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);
        assertNotNull(cvRfpSubmissionStatus);

        verifyNoQuoteAndQuoteSummaryCreated(client, rfps,0, true);

        assertFalse(cvRfpSubmissionStatus.isRfpSubmittedSuccessfully());
        assertEquals(cvRfpSubmissionStatus.getDisqualificationReason(), instantQuoteService.getAnthemCvPercentParticipatingEmployeesReason());
    }

    @Test
    public void test_ignore_participation_for_virgin_medical() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEligibleEmployees(101L);
        client.setParticipatingEmployees(0L);
        client = clientRepository.save(client);

        ExtProduct medical = extProductRepository.findByName(Constants.MEDICAL);
        ClientRfpProduct cp1 = new ClientRfpProduct(client.getClientId(), medical, true);
        clientRfpProductRepository.save(cp1);

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto cvRfpSubmissionStatus = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);
        assertNotNull(cvRfpSubmissionStatus);

        assertTrue(cvRfpSubmissionStatus.isRfpSubmittedSuccessfully());
        assertEquals(cvRfpSubmissionStatus.getDisqualificationReason(), null);
    }

    @Test
    public void test_anthem_cv_virgin_products_plan_selection() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEligibleEmployees(101L);
        client.setParticipatingEmployees(0L);
        client = clientRepository.save(client);

        ExtProduct medical = extProductRepository.findByName(Constants.MEDICAL);
        ClientRfpProduct cp1 = new ClientRfpProduct(client.getClientId(), medical, true);
        clientRfpProductRepository.save(cp1);

        ExtProduct dental = extProductRepository.findByName(Constants.DENTAL);
        ClientRfpProduct cp2 = new ClientRfpProduct(client.getClientId(), dental, true);
        clientRfpProductRepository.save(cp2);

        ExtProduct vision = extProductRepository.findByName(Constants.VISION);
        ClientRfpProduct cp3 = new ClientRfpProduct(client.getClientId(), vision, true);
        clientRfpProductRepository.save(cp3);

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        ClientPlan clientPlan1 = testEntityHelper.createTestClientPlan("hmo client plan 1", client, "BLUE_SHIELD", "HMO");
        ClientPlan clientPlan2 = testEntityHelper.createTestClientPlan("hmo client plan 2", client, "BLUE_SHIELD", "HMO");
        ClientPlan clientPlan3 = testEntityHelper.createTestClientPlan("ppo client plan 1", client, "BLUE_SHIELD", "PPO");
        ClientPlan clientPlan4 = testEntityHelper.createTestClientPlan("ppo client plan 2", client, "BLUE_SHIELD", "PPO");
        ClientPlan clientPlan5 = testEntityHelper.createTestClientPlan("hsa client plan 1", client, "BLUE_SHIELD", "HSA");
        ClientPlan clientPlan6 = testEntityHelper.createTestClientPlan("vision client plan", client, "BLUE_SHIELD", "VISION");
        ClientPlan clientPlan7 = testEntityHelper.createTestClientPlan("dhmo client plan", client, "BLUE_SHIELD", "DHMO");

        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto cvRfpSubmissionStatus = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);
        assertNotNull(cvRfpSubmissionStatus);

        assertTrue(cvRfpSubmissionStatus.isRfpSubmittedSuccessfully());
        assertEquals(cvRfpSubmissionStatus.getDisqualificationReason(), null);

        List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientId(client.getClientId());
        String clientLocale = instantQuoteService.getDentalLocale(client.getPredominantCounty(), client.getEffectiveDate());
        for(RfpQuoteOption opt : options){
            RfpQuote quote = opt.getRfpQuote();

            for(RfpQuoteNetwork rqn : quote.getRfpQuoteNetworks()){
                List<RfpQuoteOptionNetwork> rqons = rfpQuoteOptionNetworkRepository.findByRfpQuoteOptionAndRfpQuoteNetwork(opt, rqn);
                if(rqons.size() > 0){
                    for(RfpQuoteOptionNetwork rqon : rqons){
                        String networkType = null;
                        if(rqon.getSelectedRfpQuoteNetworkPlan() != null){
                            networkType = rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getPlanType();
                        }else if(rqon.getClientPlan() != null){
                            networkType = rqon.getClientPlan().getPnn().getPlanType();
                        }

                        if(networkType != null && networkType.equalsIgnoreCase("HMO")){
                            Assert.assertEquals(rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getName(),"S-Anthem Clear Value HMO 20/40/250/4 days 4000 OOP Rx:Essential $5/$20/$50/$70/30%");
                        }else if(networkType != null && networkType.equalsIgnoreCase("PPO")){
                            Assert.assertEquals(rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getName(),"T-Anthem Clear Value PPO 2500 Rx:Essential $5/$20/$50/$70/30%");
                        }else if(networkType != null && networkType.equalsIgnoreCase("HSA")){
                            Assert.assertEquals(rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getName(),"T-Anthem Clear Value PPO HSA 3500/30/50 Rx:Essential $5/$20/$50/$70/30%");
                        }else if(networkType != null && networkType.equalsIgnoreCase("DHMO") && clientLocale == null){
                            Assert.assertEquals(rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getName(),"DentalNet 2000A");
                        }else if(networkType != null && networkType.equalsIgnoreCase("DPPO") && clientLocale == null){
                            Assert.assertEquals(rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getName(),"Medium Plan");
                        }else if(networkType != null && networkType.equalsIgnoreCase("DPPO") && "Northern".equals(clientLocale)){
                            Assert.assertEquals(rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getName(),"Medium Plan");
                        }else if(networkType != null && networkType.equalsIgnoreCase("DHMO") && "Southern".equals(clientLocale)){
                            Assert.assertEquals(rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getName(),"DentalNet 2000A");
                        }else if(networkType != null && networkType.equalsIgnoreCase("DPPO") && "Southern".equals(clientLocale)){
                            Assert.assertEquals(rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getName(),"Medium Plan");
                        }else if(networkType != null && networkType.equalsIgnoreCase("VISION")){
                            Assert.assertEquals(rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getName(),"BV 3B");
                        }
                    }
                }

            }
        }
    }

    @Test
    public void testRFPSubmitter_NoMedical() throws Exception {
        Client client = testEntityHelper.createTestClient();
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);

        rfpRepository.delete(rfps.remove(0)); // remove medical RFP
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto cvRfpSubmissionStatus = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);
        assertNotNull(cvRfpSubmissionStatus);

        verifyNoQuoteAndQuoteSummaryCreated(client, rfps,0, true);

        assertFalse(cvRfpSubmissionStatus.isRfpSubmittedSuccessfully());
        assertEquals(cvRfpSubmissionStatus.getDisqualificationReason(), instantQuoteService.getAnthemCvNoMedicalDisqualificationReason());
    }

    @Test
    public void testRFPSubmitter_NoDentalOrVision() throws Exception {
        Client client = testEntityHelper.createTestClient();
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        rfpRepository.delete(rfps.remove(1)); // remove dental RFP
        rfpRepository.delete(rfps.remove(1)); // remove vision RFP
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto cvRfpSubmissionStatus = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);
        assertNotNull(cvRfpSubmissionStatus);

        verifyNoQuoteAndQuoteSummaryCreated(client, rfps,0, true);

        assertFalse(cvRfpSubmissionStatus.isRfpSubmittedSuccessfully());
        assertEquals(cvRfpSubmissionStatus.getDisqualificationReason(), instantQuoteService.getAnthemCvMedicalNoDentalOrVisionDisqualificationReason());
    }

    @Test
    public void testRFPSubmitter_WithRetirees() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setRetireesCount(10);
        client = clientRepository.save(client);

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto cvRfpSubmissionStatus = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);
        assertNotNull(cvRfpSubmissionStatus);

        verifyNoQuoteAndQuoteSummaryCreated(client, rfps,0, true);

        assertFalse(cvRfpSubmissionStatus.isRfpSubmittedSuccessfully());
        assertEquals(cvRfpSubmissionStatus.getDisqualificationReason(), instantQuoteService.getAnthemCvRetireesDisqualificationReason());
    }

    @Test
    public void testRFPSubmitter_InvalidEffectiveDate() throws Exception {
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(DateHelper.fromStringToDate("01/01/2017"));
        client = clientRepository.save(client);

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto cvRfpSubmissionStatus = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);
        assertNotNull(cvRfpSubmissionStatus);

        assertFalse(cvRfpSubmissionStatus.isRfpSubmittedSuccessfully());
        assertEquals(cvRfpSubmissionStatus.getDisqualificationReason(), instantQuoteService.getAnthemCvEffectiveDateDisqualificationReason());
    }

    @Test
    public void testRFPSubmitter_InvalidTiers() throws Exception {
        Client client = testEntityHelper.createTestClient();

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        RFP medicalRfp = getRfpByProduct(rfps, Constants.MEDICAL);
        medicalRfp.setRatingTiers(1);
        rfpRepository.save(medicalRfp);
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto cvRfpSubmissionStatus = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);
        assertNotNull(cvRfpSubmissionStatus);

        verifyNoQuoteAndQuoteSummaryCreated(client, rfps,0, true);

        assertFalse(cvRfpSubmissionStatus.isRfpSubmittedSuccessfully());
        assertEquals(cvRfpSubmissionStatus.getDisqualificationReason(), instantQuoteService.getAnthemCvTier1DisqualificationReason());
    }

    @Test
    public void testRFPSubmitter_dentalAndVisionVoluntaryContributionTypes() throws Exception {
        Client client = testEntityHelper.createTestClient();

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        RFP dentalRfp = getRfpByProduct(rfps, Constants.DENTAL);
        RFP visionRfp = getRfpByProduct(rfps, Constants.VISION);
        dentalRfp.setContributionType(ER_CONTRIBUTION_TYPE_VOLUNTARY);
        visionRfp.setContributionType(ER_CONTRIBUTION_TYPE_VOLUNTARY);
        rfpRepository.save(dentalRfp);
        rfpRepository.save(visionRfp);
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto cvRfpSubmissionStatus = instantQuoteService.startInstantQuoteGeneration(client.getClientId(),rfpIds);
        assertNotNull(cvRfpSubmissionStatus);

        verifyNoQuoteAndQuoteSummaryCreated(client, rfps, 0, true);

        assertFalse(cvRfpSubmissionStatus.isRfpSubmittedSuccessfully());
        assertEquals(cvRfpSubmissionStatus.getDisqualificationReason(), instantQuoteService.getAnthemCvDentalOrVision_voluntaryDisqualificationReason());
    }

    @Test
    public void testRFPSubmitter_createDentalOption1_NorthClient() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("testBrokerName");
        Client client = testEntityHelper.createTestClient("testClientName", broker);
        ClientPlan clientPlanDhmo = testEntityHelper.createTestClientPlan("client plan", client, "BLUE_SHIELD", "DHMO");
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CARRIER, Constants.DENTAL);

        RfpQuoteNetwork dhmoNetwork = testEntityHelper.createTestQuoteNetwork(rfpQuote, "DHMO");
        RfpQuoteNetwork dppoNetwork = testEntityHelper.createTestQuoteNetwork(rfpQuote, "DPPO");
        rfpQuote.getRfpQuoteNetworks().add(dhmoNetwork);
        rfpQuote.getRfpQuoteNetworks().add(dppoNetwork);

        RfpQuoteNetworkPlan dppoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test dppo plan", dppoNetwork, 100f, 120f, 140f, 160f);
        dppoNetwork.getRfpQuoteNetworkPlans().add(dppoPlan);

        RFP rfp = testEntityHelper.createTestRFP(client);
        rfp.setProduct(Constants.DENTAL);
        rfpRepository.save(rfp);

        Long oprionId = instantQuoteService.createOption1(rfpQuote, rfp);

        testEntityHelper.flushAndClear();

        RfpQuoteOption option1 = rfpQuoteOptionRepository.findOne(oprionId);

        assertThat(option1.getRfpQuoteOptionNetworks()).hasSize(2);
        for(RfpQuoteOptionNetwork rqon : option1.getRfpQuoteOptionNetworks()) {
            if(rqon.getRfpQuoteNetwork().getNetwork().getType().equals("DPPO")) {
                assertThat(rqon.getRfpQuoteNetwork().getNetwork().getName()).isEqualTo(dppoNetwork.getNetwork().getName());
                assertThat(rqon.getSelectedRfpQuoteNetworkPlan()).isNotNull();
            } else {
                assertThat(rqon.getRfpQuoteNetwork().getNetwork().getName()).isEqualTo(dhmoNetwork.getNetwork().getName());
                assertThat(rqon.getSelectedRfpQuoteNetworkPlan()).isNull();
            }
        }
    }

    @Test
    public void testRFPSubmitter_dentalVoluntaryContributionType() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(AnthemInstantQuoteService.ANTHEM_CV_START_EFFECTIVE_DATE);
        client = clientRepository.save(client);

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        RFP dentalRfp = getRfpByProduct(rfps, Constants.DENTAL);
        dentalRfp.setContributionType(ER_CONTRIBUTION_TYPE_VOLUNTARY);
        rfpRepository.save(dentalRfp);
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto cvRfpSubmissionStatus = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);
        assertNotNull(cvRfpSubmissionStatus);

        for(RFP rfp : rfps){
            List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), rfp.getProduct());
            if(rfp.getProduct().equalsIgnoreCase(Constants.DENTAL)){
                assertEquals(rfpQuotes.size(), 0);
            }else{
                assertEquals(rfpQuotes.size(), 1);
            }
        }

        RfpSubmissionStatusDto testDto = new RfpSubmissionStatusDto();
        instantQuoteService.doesUserQualifyForClearValue(client.getClientId(), rfps, testDto);

        assertTrue(cvRfpSubmissionStatus.isRfpSubmittedSuccessfully());
        assertEquals(testDto.getDisqualificationReason(), instantQuoteService.getAnthemCvDentalVoluntaryDisqualificationReason());

        testInstantQuoteActivitiesCreated(client, true, false, true, 2);
    }

    @Test
    public void testRFPSubmitter_visionVoluntaryContributionType() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(AnthemInstantQuoteService.ANTHEM_CV_START_EFFECTIVE_DATE);
        client = clientRepository.save(client);

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        RFP visionRfp = getRfpByProduct(rfps, Constants.VISION);
        visionRfp.setContributionType(ER_CONTRIBUTION_TYPE_VOLUNTARY);
        rfpRepository.save(visionRfp);
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto cvRfpSubmissionStatus = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);
        assertNotNull(cvRfpSubmissionStatus);

        for(RFP rfp : rfps){
            List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), rfp.getProduct());
            if(rfp.getProduct().equalsIgnoreCase(Constants.VISION)){
                assertEquals(rfpQuotes.size(), 0);
            }else{
                assertEquals(rfpQuotes.size(), 1);
            }
        }

        RfpSubmissionStatusDto testDto = new RfpSubmissionStatusDto();
        instantQuoteService.doesUserQualifyForClearValue(client.getClientId(), rfps, testDto);

        assertTrue(cvRfpSubmissionStatus.isRfpSubmittedSuccessfully());
        assertEquals(testDto.getDisqualificationReason(), instantQuoteService.getAnthemCvVisionVoluntaryDisqualificationReason());
    }

    @Test
    public void testRFPSubmitter_noDentalAndVisionVoluntaryContributionType() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(AnthemInstantQuoteService.ANTHEM_CV_START_EFFECTIVE_DATE);
        client = clientRepository.save(client);

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        RFP dentalRfp = getRfpByProduct(rfps, Constants.DENTAL);
        rfpRepository.delete(dentalRfp);
        rfps.remove(dentalRfp);

        RFP visionRfp = getRfpByProduct(rfps, Constants.VISION);
        visionRfp.setContributionType(ER_CONTRIBUTION_TYPE_VOLUNTARY);
        rfpRepository.save(visionRfp);
        
        RfpSubmissionStatusDto testDto = new RfpSubmissionStatusDto();
        instantQuoteService.doesUserQualifyForClearValue(client.getClientId(), rfps, testDto);

        assertEquals(testDto.getDisqualificationReason(), instantQuoteService.getAnthemCvDentalOrVision_voluntaryDisqualificationReason());
    }

    @Test
    public void testRFPSubmitter_noVisionAndDentalVoluntaryContributionType() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(AnthemInstantQuoteService.ANTHEM_CV_START_EFFECTIVE_DATE);
        client = clientRepository.save(client);

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        RFP visionRfp = getRfpByProduct(rfps, Constants.VISION);
        rfpRepository.delete(visionRfp);
        rfps.remove(visionRfp);

        RFP dentalRfp = getRfpByProduct(rfps, Constants.DENTAL);
        dentalRfp.setContributionType(ER_CONTRIBUTION_TYPE_VOLUNTARY);
        rfpRepository.save(dentalRfp);

        RfpSubmissionStatusDto testDto = new RfpSubmissionStatusDto();
        instantQuoteService.doesUserQualifyForClearValue(client.getClientId(), rfps, testDto);

        assertEquals(testDto.getDisqualificationReason(), instantQuoteService.getAnthemCvDentalOrVision_voluntaryDisqualificationReason());
    }


    @Test
    public void testRFPSubmitter_createMedicalOption1_DefaultAdmFee() throws Exception {
        Client client = testEntityHelper.createTestClient();
        ClientPlan clientPlanHmo = testEntityHelper.createTestClientPlan("client plan 1", client, "BLUE_SHIELD", "HMO");
        ClientPlan clientPlanHsa = testEntityHelper.createTestClientPlan("client plan 2", client, "BLUE_SHIELD", "HSA");
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, Constants.ANTHEM_CARRIER, Constants.MEDICAL);

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork hsaNetwork = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");
        rfpQuote.getRfpQuoteNetworks().add(hmoNetwork);
        rfpQuote.getRfpQuoteNetworks().add(hsaNetwork);

        RFP rfp = testEntityHelper.createTestRFP(client);

        Long optionId = instantQuoteService.createOption1(rfpQuote, rfp);

        testEntityHelper.flushAndClear();

        RfpQuoteOption option1 = rfpQuoteOptionRepository.findOne(optionId);

        assertThat(option1.getRfpQuoteOptionNetworks()).hasSize(2);
        for(RfpQuoteOptionNetwork rqon : option1.getRfpQuoteOptionNetworks()) {
            if(rqon.getRfpQuoteNetwork().getNetwork().getType().equals("HSA")) {
                assertThat(rqon.getAdministrativeFee()).isNotNull();
                assertThat(rqon.getAdministrativeFee().getName()).isEqualTo(Constants.DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_BLUE_CROSS);
            } else {
                assertThat(rqon.getAdministrativeFee()).isNull();
            }
        }
    }

    @Test
    public void test_checkIfUserHasBeenDisqualifiedViaRfpSubmission() throws Exception {
        Client client = testEntityHelper.createTestClient();

        RfpCarrier medicalRfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(
            Constants.ANTHEM_CLEAR_VALUE_CARRIER, Constants.MEDICAL);

        RfpCarrier dentalRfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(
            Constants.ANTHEM_CLEAR_VALUE_CARRIER, Constants.DENTAL);

        RfpCarrier visionRfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(
            Constants.ANTHEM_CLEAR_VALUE_CARRIER, Constants.VISION);

        RfpSubmission medicalRfpSubmission = testEntityHelper.createTestRfpSubmission(client, medicalRfpCarrier);
        RfpSubmission dentalRfpSubmission = testEntityHelper.createTestRfpSubmission(client, dentalRfpCarrier);
        RfpSubmission visionRfpSubmission = testEntityHelper.createTestRfpSubmission(client, visionRfpCarrier);
        medicalRfpSubmission.setDisqualificationReason("Sample disqualification reason");
        dentalRfpSubmission.setDisqualificationReason("Sample disqualification reason");
        visionRfpSubmission.setDisqualificationReason("Sample disqualification reason");
        rfpSubmissionRepository.save(medicalRfpSubmission);
        rfpSubmissionRepository.save(dentalRfpSubmission);
        rfpSubmissionRepository.save(visionRfpSubmission);

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        
        RfpSubmissionStatusDto rfpSubmissionStatusDto = new RfpSubmissionStatusDto();

        instantQuoteService.doesUserQualifyForClearValue(client.getClientId(), rfps, rfpSubmissionStatusDto);

        assertThat(rfpSubmissionStatusDto.isRfpSubmittedSuccessfully()).isFalse();
        assertThat(rfpSubmissionStatusDto.getDisqualificationReason()).
            isEqualToIgnoringCase(medicalRfpSubmission.getDisqualificationReason());


    }

    @Test
    public void test_checkIfUserHasBeenDisqualifiedViaRfpSubmission_partial() throws Exception {
        Client client = testEntityHelper.createTestClient();

        RfpCarrier medicalRfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(
            Constants.ANTHEM_CLEAR_VALUE_CARRIER, Constants.MEDICAL);

        RfpCarrier visionRfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(
            Constants.ANTHEM_CLEAR_VALUE_CARRIER, Constants.VISION);

        RfpSubmission medicalRfpSubmission = testEntityHelper.createTestRfpSubmission(client, medicalRfpCarrier);
        RfpSubmission visionRfpSubmission = testEntityHelper.createTestRfpSubmission(client, visionRfpCarrier);
        medicalRfpSubmission.setDisqualificationReason("Sample disqualification reason");
        visionRfpSubmission.setDisqualificationReason("Sample disqualification reason");
        rfpSubmissionRepository.save(medicalRfpSubmission);
        rfpSubmissionRepository.save(visionRfpSubmission);

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        RFP dentalRFP = getRfpByProduct(rfps, Constants.DENTAL);
        rfpRepository.delete(dentalRFP);

        RfpSubmissionStatusDto rfpSubmissionStatusDto = new RfpSubmissionStatusDto();

        instantQuoteService.doesUserQualifyForClearValue(client.getClientId(), rfps, rfpSubmissionStatusDto);

        assertThat(rfpSubmissionStatusDto.getDisqualificationReason()).
            isEqualToIgnoringCase(medicalRfpSubmission.getDisqualificationReason());


    }

    private void verifyNoQuoteAndQuoteSummaryCreated(Client client, List<RFP> rfps, int quoteSize, boolean isSummaryNull) {
        for(RFP rfp : rfps){
            List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), rfp.getProduct());
            assertEquals(rfpQuotes.size(), quoteSize);
        }
        RfpQuoteSummary summary = rfpQuoteSummaryRepository.findByClientClientId(client.getClientId());
        if(isSummaryNull)
            assertNull(summary);
        else
            assertNotNull(summary);
    }

    private void testInstantQuoteActivitiesCreated(Client client, boolean expectMedical, boolean expectDental, boolean expectVision, int expectedNumActivities) {
        boolean foundMedical = false, foundDental = false, foundVision = false;

        List<Activity> activities = activityRepository.findByClientId(client.getClientId());

        assertThat(activities).hasSize(expectedNumActivities);

        for(Activity activity : activities){
            if(activity.getProduct().equalsIgnoreCase("Medical")){
                foundMedical = true;
            }else if(activity.getProduct().equalsIgnoreCase("Dental")){
                foundDental = true;
            }else if(activity.getProduct().equalsIgnoreCase("Vision")){
                foundVision = true;
            }
            assertThat(activity.getNotes().equals("competitve info"));
            assertThat(activity.getType().equals(ActivityType.COMPETITIVE_INFO));
            assertThat(activity.getOption().equals(CompetitiveInfoOption.DIFFERENCE.name()));
            assertThat(activity.getCarrierId().equals(carrierRepository.findByName(Constants.ANTHEM_CLEAR_VALUE_CARRIER).getCarrierId()));
        }
        assertThat((expectMedical==foundMedical) && (expectDental==foundDental) && (expectVision==foundVision)).isTrue();
    }
    
    @Test
    public void testInstantQuoteAndCompetitiveInfo() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(AnthemInstantQuoteService.ANTHEM_CV_START_EFFECTIVE_DATE);
        client = clientRepository.save(client);
        
        ClientPlan clientPlan1 = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        ClientPlan clientPlan2 = testEntityHelper.createTestClientPlan("dhmo client plan", client, "BLUE_SHIELD", "DHMO");
        ClientPlan clientPlan3 = testEntityHelper.createTestClientPlan("vision client plan", client, "BLUE_SHIELD", "VISION");
        
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        List<Long> rfpIds = rfps.stream().map(RFP::getRfpId).collect(Collectors.toList());
        RfpSubmissionStatusDto submissionStatusDto = instantQuoteService.startInstantQuoteGeneration(client.getClientId(), rfpIds);

        assertNotNull(submissionStatusDto);
        assertTrue(submissionStatusDto.isRfpSubmittedSuccessfully());

        List<Activity> activities = activityRepository.findByClientId(client.getClientId());

        assertThat(activities).hasSize(3);
        
        for(Activity activity : activities){
            assertThat(activity.getNotes().equals("competitve info"));
            assertThat(activity.getType().equals(ActivityType.COMPETITIVE_INFO));
            assertThat(activity.getOption().equals(CompetitiveInfoOption.DIFFERENCE.name()));
            assertThat(activity.getCarrierId().equals(carrierRepository.findByName(Constants.ANTHEM_CLEAR_VALUE_CARRIER).getCarrierId()));
            
            switch(activity.getProduct()) {
                case Constants.MEDICAL:
                    assertThat(activity.getValue()).isEqualTo("-12.93");
                    break;
                case Constants.DENTAL:
                    assertThat(activity.getValue()).isEqualTo("-90.57");
                    break;
                case Constants.VISION:
                    assertThat(activity.getValue()).isEqualTo("-98.21");
                    break;
            }
        }
    }

}
