package com.benrevo.dashboard.service;


import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.ClientRateBankDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.RewardDetailsDto;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.EmailType;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.Recipient;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.RecipientRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.mail.Message.RecipientType;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockReset;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class AnthemDashboardEmailServiceTest extends AbstractControllerTest {

    @Autowired
    private AnthemDashboardEmailService dashboardEmailService;
    
    @MockBean(reset = MockReset.AFTER)
    private ClientDetailsService clientDetailsService;
    
    @Autowired
    private RecipientRepository recipientRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private AnthemDashboardRateBankService anthemDashboardRateBankService;

    @Autowired
    protected DashboardVelocityService velocityService;

    @Override
    public void init() throws Exception {
    }
    
    @Test
    public void sendRewardsNotification() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("RewardsEmailBroker");
        Client client = testEntityHelper.createTestClient("RewardsEmailClient", broker);
        Recipient recipient = testEntityHelper.createTestRecipient("email_1", 
            EmailType.REWARDS, RecipientType.TO, appCarrier[0]);
        Recipient nonActiveRecipient = testEntityHelper.createTestRecipient("email_2", 
            EmailType.REWARDS, RecipientType.TO, appCarrier[0]);
        nonActiveRecipient.setActive(false);
        recipientRepository.save(nonActiveRecipient);
        
        List<Activity> activities = new ArrayList<>();
        List<RewardDetailsDto> rewards = new ArrayList<>();
        for(int i = 1; i < 5; i++) {
            Activity activity = testEntityHelper.createTestActivity(client, null, null, 
                ActivityType.REWARD, null, null);
            activities.add(activity);
            
            RewardDetailsDto dto = new RewardDetailsDto();
            dto.setActivityId(activity.getActivityId());
            dto.setAddress("address" + i);
            dto.setCity("city" + i);
            dto.setState("state" + i);
            dto.setZip("zip" + i);
            dto.setBrokerageName("brokerageName" + i);
            dto.setEmail("email" + i);
            dto.setFirstName("firstName" + i);
            dto.setLastName("lastName" + i);
            dto.setParticipantId(dto.getEmail());
            dto.setPoints(50 + i);
            dto.setCreated(new Date());
            dto.setFirstReward(i % 2 == 0);
            rewards.add(dto);
        }
        when(clientDetailsService.getLastRewardsDetails()).thenReturn(rewards);
        
        dashboardEmailService.sendRewardsNotification();
        // test send was called 
        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        ArgumentCaptor<List> attacheCaptor = ArgumentCaptor.forClass(List.class);
        
        Mockito.verify(smtpMailer, Mockito.times(1)).send(mailCaptor.capture(), attacheCaptor.capture());
        
        MailDto mailDto = mailCaptor.getValue();
        
        assertThat(mailDto.getRecipients()).hasSize(1);
        assertThat(mailDto.getRecipients().get(0)).isEqualTo(recipient.getEmail());
        
        assertThat(mailDto.getSubject()).isEqualTo("Anthem Broker Rewards Program – Weekly List");   
        
        assertThat(attacheCaptor.getValue()).hasSize(1);
        AttachmentDto attachmnent = ((AttachmentDto) attacheCaptor.getValue().get(0));
        
        assertThat(attachmnent.getFileName()).isEqualTo(
                String.format("rewards_%s.xls", DateHelper.fromDateToString(new Date(), "MM_dd_yyyy")));
        byte[] rewardDoc = attachmnent.getContent();
        assertThat(rewardDoc).isNotEmpty();
        
        for(Activity a : activities) {
            assertThat(a.getCompleted()).isNotNull();
        }
        // uncomment for manual testing
        //java.io.File file = new java.io.File("rewards_test.xls");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(file, rewardDoc);
    }

    @Test
    public void sendRateBankApproval() throws Exception {

        // create quote and medical option 1
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), ANTHEM_BLUE_CROSS.name());
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote stdQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);

        // create client plan
        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan(client, "test hmo client plan",null, "HMO",
            680F, 970F, 720F, 1200F,
            11L, 12L, 10L, 7L,
            0F, 0F, 0F, 0F);

        ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan(client, "test ppo client plan", null, "PPO",
            952F, 1500F, 1340F, 1843F,
            9L, 7L, 4L, 3L,
            0F, 0F, 0F, 0F);

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "HMO option", "HMO");
        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(stdQuote, "PPO option", "PPO");

        // set rate bank
        hmoNetwork.setDiscountPercent(10F);
        ppoNetwork.setDiscountPercent(10F);
        rfpQuoteNetworkRepository.save(hmoNetwork);
        rfpQuoteNetworkRepository.save(ppoNetwork);

        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork, 600f, 900f, 700f, 1100f, true);

        RfpQuoteNetworkPlan ppoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test ppo plan",
            ppoNetwork, 950f, 1450f, 1300f, 1800f, true);

        RfpQuoteOption standardOption1 = testEntityHelper.createTestRfpQuoteOption(stdQuote, "Option 1");

        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            hmoNetwork, hmoPlan, hmoClientPlan, 11L, 12L, 10L, 7L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            ppoNetwork, ppoPlan, ppoClientPlan, 9L, 7L, 4L, 3L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        Person rater = testEntityHelper.createTestPerson(PersonType.RATER, "testRater", "testRater@benrevo.com", ANTHEM_BLUE_CROSS.name());
        flushAndClear();

        ClientRateBankDto dto = anthemDashboardRateBankService.getRateBankPlans(client.getClientId(),
            QuoteType.STANDARD, Constants.MEDICAL);


        String templatePath = dashboardEmailService.getPrefix() + dashboardEmailService.RATER_REQUEST_APPROVAL_TEMPLATE;
        String emailContent = velocityService.getRaterBankApprovalEmailTemplate(templatePath, client,
            dto, "sample notes", rater.getFullName());

        assertThat(emailContent).isNotNull();
    }
}
