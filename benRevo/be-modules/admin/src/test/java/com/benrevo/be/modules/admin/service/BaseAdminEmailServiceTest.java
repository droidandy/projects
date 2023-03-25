package com.benrevo.be.modules.admin.service;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.enums.RfpQuoteOptionAttributeName;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.ActivityRepository;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;

import java.util.List;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import static com.benrevo.common.Constants.*;
import static com.benrevo.common.enums.AttributeName.DIRECT_TO_PRESENTATION;
import static com.benrevo.common.enums.CarrierType.UHC;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class BaseAdminEmailServiceTest extends AdminAbstractControllerTest {

    @Autowired
    private BaseAdminEmailService emailService;

    @Autowired
    protected TestEntityHelper testEntityHelper;

    @Autowired
    protected RfpSubmissionRepository rfpSubmissionRepository;
    
    @Autowired
    protected ActivityRepository activityRepository;

    @Autowired
    protected AttributeRepository attributeRepository;

    @Autowired
    private BaseAdminEmailService baseAdminEmailService;

    @Before
    public void setUp() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getDetails()).thenReturn(1L);
        SecurityContextHolder.setContext(securityContext);
    }

    @After
    public void cleanUp() {
        SecurityContextHolder.clearContext();
    }

    @Test(expected = BaseException.class)
//    @WithMockUser(authorities = "superadmin")
    public void testSendToBrokerNoOption1() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier currentCarrier = testEntityHelper.createTestCarrier(appCarrier[0], appCarrier[0]);

        float RATE_REDUCER = 0.9f;

        RfpQuote medicalRfpQuote1 = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.MEDICAL);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.ANTHEM_BLUE_CROSS.name(), "HMO");
        emailService.sendQuoteReadyNotification(client.getClientId(), CarrierType.ANTHEM_BLUE_CROSS.name());
    }

    @Test(expected = BaseException.class)
//    @WithMockUser(authorities = "superadmin")
    public void testSendToBrokerNoQuoteSummaries() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier currentCarrier = testEntityHelper.createTestCarrier(appCarrier[0], appCarrier[0]);

        float RATE_REDUCER = 0.9f;

        RfpQuote medicalRfpQuote1 = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.MEDICAL);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.ANTHEM_BLUE_CROSS.name(), "HMO");

        // now create option 1
        createQuoteOption(RATE_REDUCER, medicalRfpQuote1, cp, "HMO", "test medical plan");

        emailService.sendQuoteReadyNotification(client.getClientId(), CarrierType.ANTHEM_BLUE_CROSS.name());
    }


    @Test
    public void testRenewalHelperMethod(){

        Client client = testEntityHelper.createTestClient();
        RfpQuote uhcRfpQuote = testEntityHelper.createTestRfpQuote(client, UHC.name(), Constants.MEDICAL,
            QuoteType.STANDARD);

        RfpQuoteOption rqoOption = testEntityHelper.createTestRfpQuoteOption(uhcRfpQuote, "Option 1");
        assertThat(baseAdminEmailService.isAppCarrierRenewal(client.getClientId(), MEDICAL))
            .isFalse();

        // create renewal option
        RfpQuoteOption rqoRenewal = testEntityHelper.createTestRfpQuoteOption(uhcRfpQuote, "Renewal");
        if(appCarrier[0].equalsIgnoreCase(UHC.name())) {
            assertThat(baseAdminEmailService.isAppCarrierRenewal(client.getClientId(), MEDICAL))
                .isTrue();
        }else{
            assertThat(baseAdminEmailService.isAppCarrierRenewal(client.getClientId(), MEDICAL))
                .isFalse();
        }

    }

    @Test
    public void testSendToBrokerAllQuotesDTQ(){
        float RATE_REDUCER = 0.9f;
        Client client = testEntityHelper.createTestClient();
        Long clientId = client.getClientId();
        Carrier currentCarrier = testEntityHelper.createTestCarrier(appCarrier[0], appCarrier[0]);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.ANTHEM_BLUE_CROSS.name(), "HMO");

        /* Test on having no quotes */
        assertThat(emailService.allQuotesAreDTQ(clientId)).isTrue();
        assertThat(doesOption1Exist(clientId)).isFalse();

        /* Test on only Clear Value quote */
        RfpQuote cvRfpQuote = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.MEDICAL);
        cvRfpQuote.setQuoteType(QuoteType.CLEAR_VALUE);
        assertThat(emailService.allQuotesAreDTQ(clientId)).isTrue();
        assertThat(doesOption1Exist(clientId)).isFalse();

        /* Test on additional Medical Quote (DTQ with Option 1) */
        RfpQuote medicalRfpQuote = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.MEDICAL);
        medicalRfpQuote.setQuoteType(QuoteType.DECLINED);
        createQuoteOption(RATE_REDUCER, medicalRfpQuote, cp, "HMO", "test medical plan");
        assertThat(emailService.allQuotesAreDTQ(clientId)).isTrue();
        assertThat(doesOption1Exist(clientId)).isFalse();

        /* Test on additional Medical Quote (Standard and without Option 1) */
        medicalRfpQuote = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.MEDICAL);
        medicalRfpQuote.setQuoteType(QuoteType.STANDARD);
        assertThat(emailService.allQuotesAreDTQ(clientId)).isFalse();
        assertThat(doesOption1Exist(clientId)).isFalse();

        /* Test on additional Medical Quote (Standard and with Option 1) */
        medicalRfpQuote = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.MEDICAL);
        medicalRfpQuote.setQuoteType(QuoteType.STANDARD);
        createQuoteOption(RATE_REDUCER, medicalRfpQuote, cp, "HMO", "test medical plan");
        assertThat(emailService.allQuotesAreDTQ(clientId)).isFalse();
        assertThat(doesOption1Exist(clientId)).isTrue();

        /*Test creating additional Standard Dental and DTQ Vision */
        RfpQuote dentalRfpQuote = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.DENTAL);
        createQuoteOption(RATE_REDUCER, dentalRfpQuote, cp, "HMO", "test dental plan");
        RfpQuote visionRfpQuote = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.VISION);
        visionRfpQuote.setQuoteType(QuoteType.DECLINED);
        createQuoteOption(RATE_REDUCER, visionRfpQuote , cp, "HMO", "test vision plan");
        assertThat(emailService.allQuotesAreDTQ(clientId)).isFalse();
        assertThat(doesOption1Exist(clientId)).isTrue();
    }

    @Test
    public void testCreateOption1ReleasedActivity() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier currentCarrier = testEntityHelper.createTestCarrier(appCarrier[0], appCarrier[0]);
        
        float RATE_REDUCER = 0.9f;

        RfpQuote medicalRfpQuote1 = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.MEDICAL);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), "HMO");
        createQuoteOption(RATE_REDUCER, medicalRfpQuote1, cp, "HMO", "test medical plan");

        RATE_REDUCER = 1.05f;
        
        RfpQuote dentalRfpQuote1 = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.DENTAL);
        ClientPlan dhmo = testEntityHelper.createTestClientPlan("dhmo name", client, CarrierType.CIGNA.name(), "DHMO");
        createQuoteOption(RATE_REDUCER, dentalRfpQuote1, dhmo, "DHMO", "test dental plan");
        
        flushAndClear();
 
        emailService.createOption1ReleasedActivity(client.getClientId(), MEDICAL);
        emailService.createOption1ReleasedActivity(client.getClientId(), DENTAL);
        emailService.createOption1ReleasedActivity(client.getClientId(), VISION);

        List<Activity> activities = activityRepository.findByClientId(client.getClientId());
        
        assertThat(activities).hasSize(2);
        
        for (Activity activity : activities) {
            switch(activity.getProduct()) {
                case Constants.MEDICAL:
                    assertThat(activity.getType()).isEqualTo(ActivityType.OPTION1_RELEASED);
                    assertThat(activity.getValue()).isEqualTo("-10.9"); // including discount for dental
                    assertThat(activity.getNotes()).isEqualTo("Medical Option 1 released at 10.9% below current");
                    break;
                case Constants.DENTAL:
                    assertThat(activity.getType()).isEqualTo(ActivityType.OPTION1_RELEASED);
                    assertThat(activity.getValue()).isEqualTo("5.0");
                    assertThat(activity.getNotes()).isEqualTo("Dental Option 1 released at 5.0% above current");
                    break;
                default:
                    // No VISION
                    Assert.fail("Unexpected product"); 
                    break;
            }
        }
    }

    @Test
    public void testCreateOption1ReleasedActivity_KaiserAndStandardQuotes() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier currentCarrier = testEntityHelper.createTestCarrier(appCarrier[0], appCarrier[0]);

        float RATE_REDUCER = 0.9f;

        RfpQuote medicalRfpQuote1 = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.MEDICAL);
        RfpQuote kaiserMedicalRfpQuote1 = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.MEDICAL, QuoteType.KAISER);

        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), "HMO");
        ClientPlan kaiserCP = testEntityHelper.createTestClientPlan("kaiser cp name", client, CarrierType.KAISER.name(), "HMO");

        createQuoteOption(RATE_REDUCER, medicalRfpQuote1, cp, "HMO", "test medical plan");
        RATE_REDUCER = 1.05f;

        createQuoteOption(RATE_REDUCER, kaiserMedicalRfpQuote1, kaiserCP, "HMO", "test medical plan");
        RATE_REDUCER = 1.25f;

        RfpQuote dentalRfpQuote1 = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.DENTAL);
        ClientPlan dhmo = testEntityHelper.createTestClientPlan("dhmo name", client, CarrierType.CIGNA.name(), "DHMO");
        createQuoteOption(RATE_REDUCER, dentalRfpQuote1, dhmo, "DHMO", "test dental plan");

        flushAndClear();

        emailService.createOption1ReleasedActivity(client.getClientId(), MEDICAL);
        emailService.createOption1ReleasedActivity(client.getClientId(), DENTAL);
        emailService.createOption1ReleasedActivity(client.getClientId(), VISION);

        List<Activity> activities = activityRepository.findByClientId(client.getClientId());

        assertThat(activities).hasSize(2);

        for (Activity activity : activities) {
            switch(activity.getProduct()) {
                case Constants.MEDICAL:
                    assertThat(activity.getType()).isEqualTo(ActivityType.OPTION1_RELEASED);
                    assertThat(activity.getValue()).isEqualTo("-48.03"); // including discount for dental
                    assertThat(activity.getNotes()).isEqualTo("Medical Option 1 released at 48.03% below current");
                    break;
                case Constants.DENTAL:
                    assertThat(activity.getType()).isEqualTo(ActivityType.OPTION1_RELEASED);
                    assertThat(activity.getValue()).isEqualTo("25.0");
                    assertThat(activity.getNotes()).isEqualTo("Dental Option 1 released at 25.0% above current");
                    break;
                default:
                    // No VISION
                    Assert.fail("Unexpected product");
                    break;
            }

        }


    }

    @Test
    public void testCreateOption1ReleasedActivity_Renewal() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier currentCarrier = testEntityHelper.createTestCarrier(appCarrier[0], appCarrier[0]);
        
        float RATE_REDUCER = 0.9f;

        RfpQuote medicalRfpQuote1 = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.MEDICAL);
        ClientPlan cp = testEntityHelper.createTestClientPlan("cp name", client, CarrierType.CIGNA.name(), "HMO");
        RfpQuoteOption medicalRenewal1 = createQuoteOption(RATE_REDUCER, medicalRfpQuote1, cp, "HMO", "test medical plan", "Renewal 1");

        RATE_REDUCER = 1.05f;
        
        RfpQuote dentalRfpQuote1 = testEntityHelper.createTestRfpQuote(client, currentCarrier.getName(), Constants.DENTAL);
        ClientPlan dhmo = testEntityHelper.createTestClientPlan("dhmo name", client, CarrierType.CIGNA.name(), "DHMO");
        RfpQuoteOption dentalRenewal1 = createQuoteOption(RATE_REDUCER, dentalRfpQuote1, dhmo, "DHMO", "test dental plan", "Renewal 1");
        
        flushAndClear();
 
        emailService.createOption1ReleasedActivity(client.getClientId(), MEDICAL);
        emailService.createOption1ReleasedActivity(client.getClientId(), DENTAL);
        emailService.createOption1ReleasedActivity(client.getClientId(), VISION);

        List<Activity> activities = activityRepository.findByClientId(client.getClientId());
        
        assertThat(activities).hasSize(2);
        
        for (Activity activity : activities) {
            switch(activity.getProduct()) {
                case Constants.MEDICAL:
                    assertThat(activity.getType()).isEqualTo(ActivityType.INITIAL_RENEWAL);
                    assertThat(activity.getValue()).isEqualTo("-10.0"); // no discount for dental
                    assertThat(activity.getNotes()).isEqualTo("Medical starting Renewal rates");
                    break;
                case Constants.DENTAL:
                    assertThat(activity.getType()).isEqualTo(ActivityType.INITIAL_RENEWAL);
                    assertThat(activity.getValue()).isEqualTo("5.0");
                    assertThat(activity.getNotes()).isEqualTo("Dental starting Renewal rates");
                    break;
                default:
                    // No VISION
                    Assert.fail("Unexpected product"); 
                    break;
            }
        }
        
        RfpQuoteOptionAttribute medicalAttribute = attributeRepository.findRfpQuoteOptionAttributeByRfpQuoteOptionIdAndName(
                medicalRenewal1.getRfpQuoteOptionId(), RfpQuoteOptionAttributeName.STARTING_TOTAL);
        assertThat(medicalAttribute).isNotNull();

        RfpQuoteOptionAttribute dentalAttribute = attributeRepository.findRfpQuoteOptionAttributeByRfpQuoteOptionIdAndName(
                dentalRenewal1.getRfpQuoteOptionId(), RfpQuoteOptionAttributeName.STARTING_TOTAL);
        assertThat(dentalAttribute).isNotNull();

    }


    private void createQuoteOption(float RATE_REDUCER, RfpQuote medicalRfpQuote1, ClientPlan cp,
            String planType, String rfpQuoteNetworkPlanName) {
        createQuoteOption(RATE_REDUCER, medicalRfpQuote1, cp, planType, rfpQuoteNetworkPlanName, "Option 1");
    }
    
    private RfpQuoteOption createQuoteOption(float RATE_REDUCER, RfpQuote medicalRfpQuote1, ClientPlan cp,
        String planType, String rfpQuoteNetworkPlanName, String optionName) {
        RfpQuoteOption rfpQuoteOption = testEntityHelper.createTestRfpQuoteOption(medicalRfpQuote1, optionName);
        RfpQuoteNetwork rfpQuoteNetwork = testEntityHelper.createTestQuoteNetwork(medicalRfpQuote1, planType);
        RfpQuoteNetworkPlan rfpQuoteNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan(rfpQuoteNetworkPlanName, rfpQuoteNetwork,
            cp.getTier1Rate() * RATE_REDUCER,
            cp.getTier2Rate() * RATE_REDUCER,
            cp.getTier3Rate() * RATE_REDUCER,
            cp.getTier4Rate() * RATE_REDUCER);

        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(
            rfpQuoteOption, rfpQuoteNetwork, rfpQuoteNetworkPlan, cp,
            cp.getTier1Census(), cp.getTier2Census(), cp.getTier3Census(), cp.getTier4Census(),
            cp.getErContributionFormat(),
            cp.getTier1ErContribution(), cp.getTier2ErContribution(), cp.getTier3ErContribution(), cp.getTier4ErContribution());
        
        return rfpQuoteOption;
    }

    private boolean doesOption1Exist(Long clientId){ //returns true if a (non-DTQ and non-Clear Value) Option 1 exists
        try{
            emailService.validateOption1Exists(clientId);
        }
        catch(Exception e){
            return false;
        }
        return true;
    }

}
