package com.benrevo.dashboard.controller;

import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.BrokerVolumeDto;
import com.benrevo.common.dto.BrokerVolumeDto.BrokerVolumeItem;
import com.benrevo.common.dto.BrokerVolumeDto.BrokerVolumeItem.CarrierInfo;
import com.benrevo.common.dto.RelativeMarketPosition;
import com.benrevo.common.enums.*;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.PersonRelationRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import java.util.Arrays;
import java.util.function.Predicate;
import java.util.List;
import org.assertj.core.api.Condition;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

public class ManagerViewControllerTest extends AbstractControllerTest {

    @Autowired
    private ManagerViewController managerViewController;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private BrokerRepository brokerRepository;
    
    @Autowired
    private PersonRelationRepository personRelationRepository;
    
    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Before
    @Override
    public void init() throws Exception{
        initController(managerViewController);
    }

    @Test
    public void getBrokerVolume_CarrierSalesRoleRestriction() throws Exception {   
        AuthenticatedUser authentication = new AuthenticatedUser.Builder()
            .withRoles(Arrays.asList(AccountRole.CARRIER_SALES.getValue()))
            .withAuthId("testSalesBroker").build();

        String token2 = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, "testSalesBroker", new String[]{AccountRole.CARRIER_SALES.getValue()}, appCarrier);

        Broker broker = testEntityHelper.createTestBroker("testBrokerVolumeBroker");

        User user = new User();
        user.setEmail(broker.getSalesEmail());
        when(mgmtAPI.users().get(authentication.getName(), null).execute()).thenReturn(user);
        
        
        
        Client client = testEntityHelper.buildTestClient("testClientName", broker);
        client.setClientState(ClientState.QUOTED);
        client = clientRepository.save(client);
        
        RfpQuote quote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL);
        RfpQuoteOption option = testEntityHelper.createTestRfpQuoteOption(quote, "Option 1");
        
        MvcResult result = performGetAndAssertResult(token2, (Object) null, "/dashboard/manager/brokerVolume",
            "clientState", ClientState.QUOTED, "product", Constants.MEDICAL);

        BrokerVolumeDto response = jsonUtils.fromJson(result.getResponse().getContentAsString(), BrokerVolumeDto.class);
   
        assertThat(response.getItems()).isNotEmpty();
        
        // all of the returned brokers should have specified SalesEmail

        for(BrokerVolumeItem vi : response.getItems()) {
            Broker b = brokerRepository.findByName(vi.getBrokerName());
            assertThat(b).isNotNull();
            assertThat(b.getSalesEmail()).isEqualTo(user.getEmail());
        }
    }
    
    @Test
    public void getBrokerVolume() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("testBrokerVolumeBroker");

        Client client = testEntityHelper.buildTestClient("testBrokerVolumeClient 1", broker);
        client.setClientState(ClientState.SOLD);
        client = clientRepository.save(client);   
        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork("Plan 1", CarrierType.AETNA.name(), "HMO");
        ClientPlan cp1 = testEntityHelper.createTestClientPlan(client, pnn1);
     
        Client client2 = testEntityHelper.buildTestClient("testBrokerVolumeClient 2", broker);
        client2.setClientState(ClientState.ON_BOARDING);
        client2 = clientRepository.save(client2); 
        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork("Plan 2", CarrierType.AETNA.name(), "HMO");
        ClientPlan cp2 = testEntityHelper.createTestClientPlan(client2, pnn2);
        
        Client client3 = testEntityHelper.buildTestClient("testBrokerVolumeClient 3", broker);
        client3.setClientState(ClientState.ON_BOARDING);
        client3 = clientRepository.save(client3); 
        PlanNameByNetwork pnn3 = testEntityHelper.createTestPlanNameByNetwork("Plan 3", CarrierType.AMERITAS.name(), "PPO");
        ClientPlan cp3 = testEntityHelper.createTestClientPlan(client3, pnn3);
        
        RfpQuote quote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL);
        RfpQuoteOption option = testEntityHelper.createTestRfpQuoteOption(quote, "Option 1");
        
        RfpQuote quote2 = testEntityHelper.createTestRfpQuote(client2, appCarrier[0], Constants.MEDICAL);
        RfpQuoteOption option2 = testEntityHelper.createTestRfpQuoteOption(quote2, "Option 1");
       
        RfpQuote quote3 = testEntityHelper.createTestRfpQuote(client3, appCarrier[0], Constants.MEDICAL);
        RfpQuoteOption option3 = testEntityHelper.createTestRfpQuoteOption(quote3, "Option 1");

        MvcResult result = performGetAndAssertResult((Object) null, "/dashboard/manager/brokerVolume", 
            "clientState", "ON_BOARDING,SOLD", "product", Constants.MEDICAL);

        BrokerVolumeDto response = jsonUtils.fromJson(result.getResponse().getContentAsString(), BrokerVolumeDto.class);
        
        assertThat(response).hasNoNullFieldsOrProperties();
        assertThat(response.getItems()).isNotEmpty();
        
        Predicate<BrokerVolumeItem> predicate = i -> i.getBrokerName().equals("testBrokerVolumeBroker");
        Condition<BrokerVolumeItem> cond = new Condition<BrokerVolumeItem>(predicate, "Contains test broker");
        
        assertThat(response.getItems()).haveAtLeastOne(cond);
        
        for(BrokerVolumeItem item : response.getItems()) {
            if(item.getBrokerId().equals(broker.getBrokerId())) {
                assertThat(item).hasNoNullFieldsOrProperties();
                assertThat(item.getCarriers()).hasSize(2); // AMERITAS, AETNA (see client plans above)
                for(CarrierInfo ci : item.getCarriers()) {
                    if(ci.carrierLogoUrl.endsWith("AETNA.png")) {
                        assertThat(ci.count).isEqualTo(2);
                    } else {
                        assertThat(ci.count).isEqualTo(1); // AMERITAS
                    }
                }
            }
        }   
        
        // filter by missing product
        result = performGetAndAssertResult((Object) null, "/dashboard/manager/brokerVolume", 
            "clientState", "ON_BOARDING,SOLD", "product", Constants.DENTAL);
        response = jsonUtils.fromJson(result.getResponse().getContentAsString(), BrokerVolumeDto.class);
        
        assertThat(response.getItems()).doNotHave(cond);
    }
    
    @Test
    public void getRelativeMarketPosition_CarrierManagerRoleRestriction() throws Exception {
        
        final String carrManagerEmail = "testCarrierManagerEmail";
        
        Person testManager = testEntityHelper.createTestPerson(PersonType.CARRIER_MANAGER, 
            "testCarrManager", carrManagerEmail, appCarrier[0]);
        
        Broker presalesBroker = testEntityHelper.createTestBroker("testPresalesBroker");

        for(Person presale : presalesBroker.getPresales()) {
            PersonRelation pr = new PersonRelation(testManager, presale);
            pr = personRelationRepository.save(pr);
        }
        PersonRelation pr = new PersonRelation(testManager, presalesBroker.getPresales().get(0));
        pr = personRelationRepository.save(pr);
        
        Client client = testEntityHelper.buildTestClient("test_RelativeMarketPosition 1", presalesBroker);
        client.setClientState(ClientState.QUOTED);
        client = clientRepository.save(client);
        
        Activity diff1 = testEntityHelper.createTestActivity(client, CarrierType.AETNA.name(), 
            Constants.MEDICAL, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "10");

        RfpQuote quote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), "HMO");
        RfpQuoteOption option = testEntityHelper.createTestRfpQuoteOption(quote, "Option 1");

        // row for otherCarrier will be filtered because anyTestBroker.presalesEmail != testPresales.email
        Broker anyTestBroker = testEntityHelper.createTestBroker("anyTestBroker");
        Client client2 = testEntityHelper.buildTestClient("test_RelativeMarketPosition 2", anyTestBroker);
        client2.setClientState(ClientState.QUOTED);
        client2 = clientRepository.save(client2);
        
        Activity diff2 = testEntityHelper.createTestActivity(client2, CarrierType.BLUE_SHIELD.name(), 
            Constants.MEDICAL, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "20");
        
        RfpQuote quote2 = testEntityHelper.createTestRfpQuote(client2, appCarrier[0], Constants.MEDICAL);
        ClientPlan cp2 = testEntityHelper.createTestClientPlan("cp name", client2, CarrierType.CIGNA.name(), "HMO");
        RfpQuoteOption option2 = testEntityHelper.createTestRfpQuoteOption(quote2, "Option 1");

        flushAndClear();
        
        // used default AuthenticatedUser with admin role (no filtering applied)
        
        MvcResult result = performGetAndAssertResult((Object) null, "/dashboard/manager/relativeMarketPosition", 
            "product", Constants.MEDICAL);

        RelativeMarketPosition[] response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RelativeMarketPosition[].class);
        
        assertThat(response).hasSize(2);
        
        // after filtering by logged on CarrierManager API should return less records
        
        AuthenticatedUser authentication = new AuthenticatedUser.Builder()
            .withRoles(Arrays.asList(AccountRole.CARRIER_MANAGER.getValue()))
            .withAuthId("testCarrierManager").build();

        User user = new User();
        user.setEmail(carrManagerEmail);
        when(mgmtAPI.users().get(authentication.getName(), null).execute()).thenReturn(user);

        String token2 = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, "testCarrierManager", new String[]{AccountRole.CARRIER_MANAGER.getValue()}, appCarrier);

        result = performGetAndAssertResult(token2, (Object) null, "/dashboard/manager/relativeMarketPosition",
            "product", Constants.MEDICAL);

        RelativeMarketPosition[] response2 = jsonUtils.fromJson(result.getResponse().getContentAsString(), RelativeMarketPosition[].class);
        
        assertThat(response2.length).isLessThan(response.length);
        assertThat(response2).hasSize(1);
    } 
    
    @Test
    public void getAverageQuoteDifferences() throws Exception {

        Broker presalesBroker = testEntityHelper.createTestBroker("testPresalesBroker");
//        presalesBroker.setPresalesEmail("avgQuoteDiffEmail");
//        presalesBroker = brokerRepository.save(presalesBroker);

        Client client1 = testEntityHelper.buildTestClient("test_AverageQuoteDifferences 1", presalesBroker);
        client1.setClientState(ClientState.QUOTED);
        client1 = clientRepository.save(client1);
        
        Client client2 = testEntityHelper.buildTestClient("test_AverageQuoteDifferences 2", presalesBroker);
        client2.setClientState(ClientState.QUOTED);
        client2 = clientRepository.save(client2);
        
        Client client3 = testEntityHelper.buildTestClient("test_AverageQuoteDifferences 3", presalesBroker);
        client3.setClientState(ClientState.QUOTED);
        client3 = clientRepository.save(client3);
        
        Client[] testClients = new Client[] {client1, client2, client3};
        float[] diffFactors = new float[] {1.05f, 1.1f, 1.2f}; // diff +5%, +10% and +20%
         
        for(int i = 0; i < testClients.length; i++) {
            Client client = testClients[i];
            RfpQuote quote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL);
            ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), "HMO");
            
            RfpQuoteOption option = testEntityHelper.createTestRfpQuoteOption(quote, "Option 1");
            RfpQuoteNetwork network = testEntityHelper.createTestQuoteNetwork(quote, cp.getPlanType());
            RfpQuoteNetworkPlan networkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test plan", network, 
                cp.getTier1Rate() * diffFactors[i], cp.getTier2Rate() * diffFactors[i], cp.getTier3Rate() * diffFactors[i], cp.getTier4Rate() * diffFactors[i]);
            RfpQuoteOptionNetwork optNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(
                option, network, networkPlan, cp, 
                cp.getTier1Census(), cp.getTier2Census(), cp.getTier3Census(), cp.getTier4Census(), 
                cp.getErContributionFormat(), 
                cp.getTier1ErContribution(), cp.getTier2ErContribution(), cp.getTier3ErContribution(), cp.getTier4ErContribution());
        }
        
        flushAndClear();
        
        AuthenticatedUser authentication = new AuthenticatedUser.Builder()
            .withRoles(Arrays.asList(AccountRole.CARRIER_PRESALE.getValue()))
            .withAuthId("testPresales").build();

        User user = new User();
        user.setEmail(presalesBroker.getPresalesEmail());
        when(mgmtAPI.users().get(authentication.getName(), null).execute()).thenReturn(user);

        String token2 = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, "testPresales", new String[]{AccountRole.CARRIER_PRESALE.getValue()}, appCarrier);

        MvcResult result = performGetAndAssertResult(token2, (Object) null, "/dashboard/manager/quoteDifference",
            "product", Constants.MEDICAL);

        RelativeMarketPosition[] response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RelativeMarketPosition[].class);
        
        assertThat(response).isNotEmpty();

        response = Arrays.stream(response)
            .filter(p -> p.getCarrierName().equals(CarrierType.CIGNA.name()))
            .toArray(RelativeMarketPosition[]::new);
        assertThat(response).hasSize(1);
        
        assertThat(response[0].getCarrierId()).isNotNull();
        assertThat(response[0].getCarrierName()).isEqualTo(CarrierType.CIGNA.name());
        // AvgDiffPercent = 5% + 10% + 20% / 3 = 11.666667
        assertThat(response[0].getAvgDiffPercent()).isEqualTo(11.67f);
        // MedianDiffPercent = 10%
        assertThat(response[0].getMedianDiffPercent()).isEqualTo(10f);
        assertThat(response[0].getGroups()).isEqualTo(3);
    }
    
    @Test
    public void getAverageQuoteDifferences_DeclinedQuote() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("avg_DTQBroker");
        Client client = testEntityHelper.buildTestClient("test_AverageQuoteDifferences 1", broker);
        client.setClientState(ClientState.QUOTED);
        client = clientRepository.save(client);

        RfpQuote quote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), "HMO");
        
        RfpQuoteOption option = testEntityHelper.createTestRfpQuoteOption(quote, "Option 1");
        RfpQuoteNetwork network = testEntityHelper.createTestQuoteNetwork(quote, cp.getPlanType());
        RfpQuoteNetworkPlan networkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test plan", network, 
            cp.getTier1Rate() * 1.1f, cp.getTier2Rate() * 1.1f, cp.getTier3Rate() * 1.1f, cp.getTier4Rate() * 1.1f);
        RfpQuoteOptionNetwork optNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(
            option, network, networkPlan, cp, 
            cp.getTier1Census(), cp.getTier2Census(), cp.getTier3Census(), cp.getTier4Census(), 
            cp.getErContributionFormat(), 
            cp.getTier1ErContribution(), cp.getTier2ErContribution(), cp.getTier3ErContribution(), cp.getTier4ErContribution());

        flushAndClear();

        MvcResult result = performGetAndAssertResult((Object) null, "/dashboard/manager/quoteDifference", 
            "product", Constants.MEDICAL);

        RelativeMarketPosition[] response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RelativeMarketPosition[].class);
        response = Arrays.stream(response)
            .filter(p -> p.getCarrierName().equals(CarrierType.CIGNA.name()))
            .toArray(RelativeMarketPosition[]::new);
        assertThat(response).hasSize(1);

        // check ans save values to compare with declined quote values
        
        assertThat(response[0].getCarrierName()).isEqualTo(CarrierType.CIGNA.name());
        assertThat(response[0].getAvgDiffPercent()).isNotEqualTo(0f);
        assertThat(response[0].getMedianDiffPercent()).isNotEqualTo(0f);
        assertThat(response[0].getGroups()).isGreaterThanOrEqualTo(1);
        
        // decline test client quote
        
        sharedRfpQuoteService.processDeclinedQuote(client.getClientId(), client.getBroker().getBrokerId(), 
            appCarrier[0], Constants.MEDICAL, true);

        List<RfpQuote> quotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);
        assertThat(quotes).hasSize(0);
        RfpQuote declinedQuote = rfpQuoteRepository.findOne(quote.getRfpQuoteId());
        assertThat(declinedQuote.getQuoteType()).isEqualTo(QuoteType.DECLINED);

        flushAndClear();
        
        result = performGetAndAssertResult((Object) null, "/dashboard/manager/quoteDifference", 
            "product", Constants.MEDICAL);
        
        RelativeMarketPosition[] dqtResp = jsonUtils.fromJson(result.getResponse().getContentAsString(), RelativeMarketPosition[].class);
        dqtResp = Arrays.stream(dqtResp)
            .filter(p -> p.getCarrierName().equals(CarrierType.CIGNA.name()))
            .toArray(RelativeMarketPosition[]::new);
        assertThat(dqtResp).hasSize(1);
        
        // result after quote decline should not change
        assertThat(response[0].getAvgDiffPercent()).isEqualTo(dqtResp[0].getAvgDiffPercent());
        assertThat(response[0].getMedianDiffPercent()).isEqualTo(dqtResp[0].getMedianDiffPercent());
        assertThat(response[0].getGroups()).isEqualTo(dqtResp[0].getGroups());
    }
    
    @Test
    public void getRelativeMarketPosition() throws Exception {
        Broker benrevoBroker = testEntityHelper.createTestBroker("testBenrevoBroker");

        Client client1 = testEntityHelper.buildTestClient("test_RelativeMarketPosition 1", benrevoBroker);
        client1.setClientState(ClientState.QUOTED);
        client1 = clientRepository.save(client1);
        
        Broker nonBenrevoBroker = testEntityHelper.createTestBroker("testNonBenrevoBroker");
        Client client2 = testEntityHelper.buildTestClient("test_RelativeMarketPosition 2", nonBenrevoBroker);
        client2.setClientState(ClientState.ON_BOARDING);
        client2 = clientRepository.save(client2);
        
        String[] testProducts = new String[] {Constants.MEDICAL, Constants.DENTAL};
        Client[] testClients = new Client[] {client1, client2};
        String[][] testDiffPercents = new String[][] {{"-5", "-6"}, {"-7", "-8"}};

        for(String product : testProducts) {
            for(int i = 0; i < testClients.length; i++) {
                Client client = testClients[i];
                RfpQuote quote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], product);
                ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), 
                    product.equals(Constants.MEDICAL) ? "HMO" : "DHMO");
                
                RfpQuoteOption option = testEntityHelper.createTestRfpQuoteOption(quote, "Option 1");
                option.setFinalSelection(false); // to disable bundle discounts
                option = rfpQuoteOptionRepository.save(option);
                
                RfpQuoteNetwork network = testEntityHelper.createTestQuoteNetwork(quote, cp.getPlanType());
                // using 0.9 factor to get diffPercent = -10
                RfpQuoteNetworkPlan networkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test plan", network, 
                    cp.getTier1Rate() * 0.9f, cp.getTier2Rate() * 0.9f, cp.getTier3Rate() * 0.9f, cp.getTier4Rate() * 0.9f);
                RfpQuoteOptionNetwork optNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(
                    option, network, networkPlan, cp, 
                    cp.getTier1Census(), cp.getTier2Census(), cp.getTier3Census(), cp.getTier4Census(), 
                    cp.getErContributionFormat(), 
                    cp.getTier1ErContribution(), cp.getTier2ErContribution(), cp.getTier3ErContribution(), cp.getTier4ErContribution());
                     
                Activity diff1 = testEntityHelper.createTestActivity(client, CarrierType.AETNA.name(), 
                    product, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), 
                    testDiffPercents[i][0]);
                Activity diff2 = testEntityHelper.createTestActivity(client, CarrierType.BLUE_SHIELD.name(), 
                    product, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), 
                    testDiffPercents[i][1]);
               
            }    
        }
        
        // client 3 will be filtered because it have no option_1/percentDiff
        
        Client client3 = testEntityHelper.buildTestClient("test_RelativeMarketPosition 3", benrevoBroker);
        client3.setClientState(ClientState.QUOTED);
        client3 = clientRepository.save(client3);

        RfpQuote quote = testEntityHelper.createTestRfpQuote(client3, appCarrier[0], Constants.MEDICAL, QuoteType.DECLINED);
        
        Activity diff3 = testEntityHelper.createTestActivity(client3, CarrierType.AMERITAS.name(), 
            Constants.MEDICAL, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "10");
        
        flushAndClear();
        
        for(String product : testProducts) {
            MvcResult result = performGetAndAssertResult((Object) null, "/dashboard/manager/relativeMarketPosition", 
                "product", product);
    
            RelativeMarketPosition[] response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RelativeMarketPosition[].class);
            
            assertThat(response).isNotEmpty();

            response = Arrays.stream(response)
                .filter(p -> p.getCarrierName().equals(CarrierType.AETNA.name())
                            || p.getCarrierName().equals(CarrierType.BLUE_SHIELD.name()))
                .toArray(RelativeMarketPosition[]::new);
            assertThat(response).hasSize(2);
            assertThat(response).extracting("carrierId").doesNotContainNull();
            assertThat(response).extracting("carrierName").containsExactly(
                CarrierType.AETNA.name(), CarrierType.BLUE_SHIELD.name());
            // option1DiffPercent = -10
            // AETNA: -10--5=-5; -10--7=-3; avg=(-5-3)/2=-4
            // BLUE_SHIELD: -10--6=-4; -10--8=-2; avg=(-4-2)/2=-3
            assertThat(response).extracting("avgDiffPercent").containsExactly(-4f, -3f);
            // in current case median = avg, because we have only 2 value
            assertThat(response).extracting("medianDiffPercent").containsExactly(-4f, -3f);
            assertThat(response).extracting("groups").containsExactly(2, 2);
        }
    } 
}
