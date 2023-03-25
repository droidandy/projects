package com.benrevo.broker.service;

import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import java.io.File;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class BrokerDocumentServiceTest extends AbstractControllerTest {
    
    @Autowired
    private BrokerDocumentService brokerDocumentService;
    
    @Autowired
    private RfpRepository rfpRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Override
    public void init() throws Exception {
    }
    
    @After
    public void cleanUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void buildTrustDocument() throws Exception {
        
        Client client = testEntityHelper.buildTestClient();
        client.setSicCode("3572");
        client.setAddress("testAddress");
        client.setZip("90001");
        client.setCity("testCity");
        client.setDueDate(new Date());
        client = clientRepository.save(client);

        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        rfps.get(0).setWaitingPeriod("waitingPeriod");
        rfpRepository.save(rfps.get(0));
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.VOYA.name(), CarrierType.VOYA.displayName);
        for(String extProduct : new String[] {Constants.LIFE, Constants.STD, Constants.LTD}) {
            RFP rfp = testEntityHelper.createTestRFP(client, extProduct);
            AncillaryPlan ancPlan = testEntityHelper.createTestAncillaryPlan(
                extProduct + " plan", PlanCategory.valueOf(extProduct), AncillaryPlanType.BASIC, carrier);
            testEntityHelper.createTestRfpToAncillaryPlan(rfp, ancPlan);
            rfp = rfpRepository.save(rfp);
            rfps.add(rfp);
        }

        ClientPlan cpHmo = testEntityHelper.createTestClientPlan("hmo client plan", client, CarrierType.AETNA.name(), "HMO");
        ClientPlan cpPpo = testEntityHelper.createTestClientPlan("ppo client plan", client, CarrierType.CIGNA.name(), "PPO");
        ClientPlan cpDppo = testEntityHelper.createTestClientPlan("dppo client plan", client, CarrierType.AMERITAS.name(), "DPPO");
        ClientPlan cpVision = testEntityHelper.createTestClientPlan("vision client plan", client, CarrierType.ASSURANT.name(), "VISION");
        cpVision.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        cpVision.setOutOfState(true);
        
        float rate = 10f;
        float renewal = 50f;
        float contr = 80f;
        for(ClientPlan cp : Arrays.asList(cpHmo, cpPpo, cpDppo, cpVision)) {
            cp.setTier1Rate(rate++);
            cp.setTier2Rate(rate++);
            cp.setTier3Rate(rate++);
            cp.setTier4Rate(rate++);
            cp.setTier1Renewal(renewal++);
            cp.setTier2Renewal(renewal++);
            cp.setTier3Renewal(renewal++);
            cp.setTier4Renewal(renewal++);
            if(cp.getErContributionFormat().equals(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR)) {
                cp.setTier1ErContribution(cp.getTier1Rate() * 0.9f); 
                cp.setTier2ErContribution(cp.getTier2Rate() * 0.9f); 
                cp.setTier3ErContribution(cp.getTier3Rate() * 0.9f); 
                cp.setTier4ErContribution(cp.getTier4Rate() * 0.9f); 
            } else {
                cp.setTier1ErContribution(contr++);   
                cp.setTier2ErContribution(contr++);   
                cp.setTier3ErContribution(contr++);   
                cp.setTier4ErContribution(contr++);   
            }
            clientPlanRepository.save(cp);
        }

        Broker broker = testEntityHelper.createTestBroker("TrustDocument broker");
        
        User user = new User("test");
        user.setEmail("test@domain.test");
        user.setUserMetadata(build(entry("first_name", "FirstName"), entry("last_name", "LastName")));
        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);
        
        AuthenticatedUser authentication = new AuthenticatedUser.Builder().withAuthId("any").build();
        
        // TODO move to AbstractServiteTest class
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        
        flushAndClear();
        
        byte[] bytes1 = brokerDocumentService.buildTrustDocument(Constants.TECH_TRUST_PROGRAM, 
            client.getClientId(), broker, rfps);

        byte[] bytes2 = brokerDocumentService.buildTrustDocument(Constants.BEYOND_BENEFITS_TRUST_PROGRAM, 
            client.getClientId(), broker, rfps);

        // uncomment for manual testing
//        File xlsm1 = new File("test-TECH_TRUST.xlsm");
//        FileUtils.writeByteArrayToFile(xlsm1, bytes1);
//        File xlsm2 = new File("test-BEYOND_BENEFITS_TRUST.xlsm");
//        FileUtils.writeByteArrayToFile(xlsm2, bytes2);
        
    }

}
