package com.benrevo.dashboard.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.RelativeMarketPosition;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.CompetitiveInfoOption;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.repository.ClientRepository;

public class UHCManagerViewControllerTest extends AbstractControllerTest {

    @Autowired
    private ManagerViewController managerViewController;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Before
    @Override
    public void init() throws Exception{
        initController(managerViewController);
    }

    @Test
    public void getRelativeMarketPosition() throws Exception {
        Broker benrevoBroker = testEntityHelper.createTestBroker("testBenrevoBroker");
        
        token = authenticationService.createTokenForBroker(benrevoBroker.getBrokerToken(), 
        		testAuthId, new String[] {AccountRole.CARRIER_SALES_RENEWAL.getValue()}, appCarrier);
        User user = new User();
        user.setEmail(benrevoBroker.getSalesEmail());
        when(mgmtAPI.users().get(testAuthId, null).execute()).thenReturn(user);
        
        Client client1 = testEntityHelper.buildTestClient("test_RelativeMarketPosition 1", benrevoBroker);
        client1.setClientState(ClientState.QUOTED);
        client1 = clientRepository.save(client1);
        testEntityHelper.createTestClientAttribute(client1, AttributeName.RENEWAL);
        
        Broker nonBenrevoBroker = testEntityHelper.createTestBroker("testNonBenrevoBroker");
        Client client2 = testEntityHelper.buildTestClient("test_RelativeMarketPosition 2", nonBenrevoBroker);
        client2.setClientState(ClientState.ON_BOARDING);
        client2 = clientRepository.save(client2);
        testEntityHelper.createTestClientAttribute(client2, AttributeName.RENEWAL);

        String[] testProducts = new String[] {Constants.MEDICAL, Constants.DENTAL};
        Client[] testClients = new Client[] {client1, client2};
        String[][] testDiffPercents = new String[][] {{"-5", "-6"}, {"-7", "-8"}};

        for(String product : testProducts) {
            for(int i = 0; i < testClients.length; i++) {
                Client client = testClients[i];
                RfpQuote quote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], product);
                ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.UHC.name(), 
                    product.equals(Constants.MEDICAL) ? "HMO" : "DHMO");
                
                RfpQuoteOption option = testEntityHelper.createTestRfpQuoteOption(quote, "Renewal 1");
                
                RfpQuoteNetwork network = testEntityHelper.createTestQuoteNetwork(quote, cp.getPlanType());
                // using 0.9 factor to get diffPercent = -10
                float quoteFactor = 0.9f;
                RfpQuoteNetworkPlan networkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test plan", network, 
                    cp.getTier1Rate() * quoteFactor, 
                    cp.getTier2Rate() * quoteFactor, 
                    cp.getTier3Rate() * quoteFactor, 
                    cp.getTier4Rate() * quoteFactor);
                testEntityHelper.createTestRfpQuoteOptionNetwork(
                    option, network, networkPlan, cp, 
                    cp.getTier1Census(), cp.getTier2Census(), cp.getTier3Census(), cp.getTier4Census(), 
                    cp.getErContributionFormat(), 
                    cp.getTier1ErContribution(), cp.getTier2ErContribution(), cp.getTier3ErContribution(), cp.getTier4ErContribution());
                     
                testEntityHelper.createTestActivity(client, CarrierType.AETNA.name(), 
                    product, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), 
                    testDiffPercents[i][0]);
                testEntityHelper.createTestActivity(client, CarrierType.BLUE_SHIELD.name(), 
                    product, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), 
                    testDiffPercents[i][1]);
               
            }    
        }
        
        // client 3 will be filtered because it have no option_1/percentDiff
        
        Client client3 = testEntityHelper.buildTestClient("test_RelativeMarketPosition 3", benrevoBroker);
        client3.setClientState(ClientState.QUOTED);
        client3 = clientRepository.save(client3);

        testEntityHelper.createTestRfpQuote(client3, appCarrier[0], Constants.MEDICAL, QuoteType.DECLINED);
        
        testEntityHelper.createTestActivity(client3, CarrierType.AMERITAS.name(), 
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
