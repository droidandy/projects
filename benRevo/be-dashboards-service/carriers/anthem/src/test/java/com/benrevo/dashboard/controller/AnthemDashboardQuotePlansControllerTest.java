package com.benrevo.dashboard.controller;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.admin.util.helper.QuoteHelper;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientTeamRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import java.util.List;
import java.util.UUID;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.SharedHistoryService;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.ClientAllQuoteDto;
import com.benrevo.common.dto.ClientRateBankDto;
import com.benrevo.common.dto.HistoryDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;

public class AnthemDashboardQuotePlansControllerTest extends AbstractControllerTest {
    
    @Autowired
    private TestEntityHelper testEntityHelper;

    @Autowired
    private AnthemDashboardQuotePlansController controller;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;
    
    @Autowired
    private SharedHistoryService sharedHistoryService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientTeamRepository clientTeamRepository;

    @Autowired
    private QuoteHelper quoteHelper;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;
    
    @Before
    public void init() {
        initController(controller);
    }

    @Test
    public void test_getQuotePlans() throws Exception {

        // create quote and medical option 1
        Client client = testEntityHelper.createTestClient();
        
        testEntityHelper.createTestClientAttribute(client, AttributeName.DENTAL_DISCOUNT, "true");
        testEntityHelper.createTestClientAttribute(client, AttributeName.PREMIUM_CREDIT, "100");
        
        testEntityHelper.createClientTeam(client.getBroker(), client, null, "Client Team 1");
        testEntityHelper.createClientTeam(client.getBroker(), client, null, "Client Team 2");
        
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

        testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            hmoNetwork, hmoPlan, hmoClientPlan, 11L, 12L, 10L, 7L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            ppoNetwork, ppoPlan, ppoClientPlan, 9L, 7L, 4L, 3L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        flushAndClear();

        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/quotePlans", client.getClientId());

        ClientAllQuoteDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientAllQuoteDto.class);

        assertThat(dto.getTotalAnnualPremium()).isEqualTo(663120.0F);
        assertThat(dto.getProjectedBundleDiscountPercent()).isEqualTo(RfpQuoteService.DENTAL_BUNDLE_DISCOUNT_PERCENT);
        assertThat(dto.getClientMembers())
            .hasSize(2)
            .extracting("fullName")
            .containsExactlyInAnyOrder("Client Team 1","Client Team 2");
        
        ClientRateBankDto medicalDto = dto.getMedicalQuote();
        
        assertThat(medicalDto).isNotNull();
        
        assertThat(medicalDto.getRateBankAmountRequested()).isEqualTo(73680.0F);
        assertThat(medicalDto.getTotalDollarDifference()).isEqualTo(-9417.0F);
        assertThat(medicalDto.getCostVsCurrent()).isEqualTo(-113004.0F);
        assertThat(medicalDto.getTotalPremium()).isEqualTo(663120.0F);
        assertThat(medicalDto.getCostVsCurrentPercentage()).isEqualTo(-14.56F);
        assertThat(medicalDto.getTotalRenewalDollarDifference()).isEqualTo(55260.0F);
        assertThat(medicalDto.getCostVsRenewal()).isEqualTo(663120.0F);
        assertThat(medicalDto.getCostVsRenewalPercentage()).isNull();
    }

    @Test
    public void test_updateQuotePlans() throws Exception {

        Client client = testEntityHelper.createTestClient();

        testEntityHelper.createTestClientAttribute(client, AttributeName.VISION_DISCOUNT, "true");

        ClientAllQuoteDto update = new ClientAllQuoteDto();
        update.setLifeDiscount(true);
        
        flushAndClear();

        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(update), null, "/dashboard/client/{clientId}/quotePlans", client.getClientId());

        ClientAllQuoteDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientAllQuoteDto.class);
        
        assertThat(dto.getLifeDiscount()).isTrue();
        assertThat(dto.getVisionDiscount()).isTrue();
        
    }

    @Test
    public void testSendQuoteReady() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.setCarrierOwned(true);
        clientRepository.save(client);
        testSendQuoteReadyHelper(client);

        performPostAndAssertResult(null, null, "/dashboard/client/{clientId}/quotePlans/send", client.getClientId());

        // check notification was saved
        List<HistoryDto> notifications = sharedHistoryService.getLastNotifications(client.getClientId(), "EMAIL", "QUOTE_READY");
        assertThat(notifications).hasSize(1);

        List<ClientTeam> cts = clientTeamRepository.findByClientClientId(client.getClientId());
        ClientTeam clientTeam = cts.get(0);

        // check send was called
        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        ArgumentCaptor<List<AttachmentDto>> attacheCaptor = ArgumentCaptor.forClass((Class)List.class);

        Mockito.verify(smtpMailer, Mockito.times(1)).send(mailCaptor.capture(), attacheCaptor.capture());

        MailDto mailDto = mailCaptor.getValue();

        assertThat(mailDto.getRecipients()).hasSize(1);
        assertThat(mailDto.getRecipients().get(0)).isEqualTo(clientTeam.getEmail());
        assertThat(mailDto.getSubject())
            .contains("Your quote for")
            .contains("is ready for review")
            .contains(client.getClientName());

        //java.io.File html = new java.io.File("quote_ready_template.html");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(html, mailCaptor.getValue().getContent().getBytes());

        assertThat(attacheCaptor.getValue()).hasSize(1);

        AttachmentDto attachment = attacheCaptor.getValue().get(0);
        assertThat(attachment).isNotNull();

        //java.io.File file = new java.io.File("financial_summary_test.pdf");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(file, attachment.getContent());
    }


    public void testSendQuoteReadyHelper(Client client) throws Exception {
        testEntityHelper.createTestRfpQuoteSummary(client);
        ClientTeam clientTeam = testEntityHelper.createClientTeam(client.getBroker(), client);

        // create quote and medical option 1
        testEntityHelper.createTestClientAttribute(client, AttributeName.DENTAL_DISCOUNT, "true");
        testEntityHelper.createTestClientAttribute(client, AttributeName.PREMIUM_CREDIT, "100");

        RfpQuote stdQuote = testEntityHelper.createTestRfpQuote(client, ANTHEM_BLUE_CROSS.name(), Constants.MEDICAL);

        // create client plan
        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan(client, "test hmo client plan",null, "HMO",
            680F, 970F, 720F, 1200F,
            11L, 12L, 10L, 7L,
            1F, 1F, 1F, 1F);

        ClientPlan ppoClientPlan = testEntityHelper.createTestClientPlan(client, "test ppo client plan", null, "PPO",
            952F, 1500F, 1340F, 1843F,
            9L, 7L, 4L, 3L,
            1F, 1F, 1F, 1F);

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

        testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            hmoNetwork, hmoPlan, hmoClientPlan, 11L, 12L, 10L, 7L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        testEntityHelper.createTestRfpQuoteOptionNetwork(standardOption1,
            ppoNetwork, ppoPlan, ppoClientPlan, 9L, 7L, 4L, 3L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        // dental
        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, ANTHEM_BLUE_CROSS.name(), Constants.DENTAL);

        // create client plan
        ClientPlan dhmoClientPlan = testEntityHelper.createTestClientPlan(client, "test dhmo client plan", CarrierType.AETNA, "DHMO",
            680F, 970F, 720F, 1200F,
            11L, 12L, 10L, 7L,
            1F, 1F, 1F, 1F);

        ClientPlan dppoClientPlan = testEntityHelper.createTestClientPlan(client, "test dppo client plan", CarrierType.CIGNA, "DPPO",
            952F, 1500F, 1340F, 1843F,
            9L, 7L, 4L, 3L,
            1F, 1F, 1F, 1F);

        RfpQuoteNetwork dhmoNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DHMO option", "DHMO");
        RfpQuoteNetwork dppoNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DPPO option", "DPPO");

        RfpQuoteNetworkPlan dhmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test dhmo plan",
            dhmoNetwork, 600f, 900f, 700f, 1100f, true);

        RfpQuoteNetworkPlan dppoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test dppo plan",
            dppoNetwork, 950f, 1450f, 1300f, 1800f, true);

        RfpQuoteOption dentalOption1 = testEntityHelper.createTestRfpQuoteOption(dentalQuote, "Option 1");

        testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption1,
            dhmoNetwork, dhmoPlan, dhmoClientPlan, 11L, 12L, 10L, 7L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption1,
            dppoNetwork, dppoPlan, dppoClientPlan, 9L, 7L, 4L, 3L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        // vision
        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, ANTHEM_BLUE_CROSS.name(), Constants.VISION);

        // create client plan
        ClientPlan visionClientPlan = testEntityHelper.createTestClientPlan(client, "test vision client plan", CarrierType.CIGNA, "VISION",
            952F, 1500F, 1340F, 1843F,
            9L, 7L, 4L, 3L,
            900F, 1500F, 1340F, 1800F);

        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION option", "VISION");

        RfpQuoteNetworkPlan visionPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan",
            visionNetwork, 600f, 900f, 700f, 1100f, true);

        RfpQuoteOption visionOption1 = testEntityHelper.createTestRfpQuoteOption(visionQuote, "Option 1");

        testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption1,
            visionNetwork, visionPlan, visionClientPlan, 9L, 7L, 4L, 3L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);
        
        
        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        
        flushAndClear();
    }


    @Test
    public void testSendQuoteReadyAndClientQuoteUpdate() throws Exception {
        // send to broker which creates non carrier owned client
        Client client = testEntityHelper.createTestClient();
        client.setCarrierOwned(true);
        client.setClientToken(UUID.randomUUID().toString());
        clientRepository.save(client);
        testSendQuoteReadyHelper(client);

        performPostAndAssertResult(null, null, "/dashboard/client/{clientId}/quotePlans/send", client.getClientId());

        client = clientRepository.findOne(client.getClientId());
        assertThat(client.getClientToken()).isNotEmpty();

        // update quote for carrier owned client
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(ANTHEM_BLUE_CROSS.name(), Constants.VISION);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);
        RfpQuote currentVisionQuote = rfpQuoteRepository.findByRfpSubmissionAndRfpSubmissionClientClientIdAndLatestIsTrue(rfpSubmission, client.getClientId());

        // new vision quote
        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, ANTHEM_BLUE_CROSS.name(), Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION option", "VISION");
        RfpQuoteNetworkPlan visionPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan",
            visionNetwork, 600f, 900f, 700f, 1100f, true);

        RfpQuoteNetworkPlan visionPlan2 = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan 2",
            visionNetwork, 650f, 950f, 750f, 1150f, true);

        quoteHelper.updateQuote(currentVisionQuote, visionQuote, null, true);

        // send to broker and assert the new vision plan rate change in both carrier and non carrier owned clients
        performPostAndAssertResult(null, null, "/dashboard/client/{clientId}/quotePlans/send", client.getClientId());
        visionQuote = rfpQuoteRepository.findOne(visionQuote.getRfpQuoteId());
        assertPlanRates(visionQuote, "test vision plan 2", 650f, 950f, 750f, 1150f);

    }

    private void assertPlanRates(RfpQuote rfpQuote, String planName,
        Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate){

        for(RfpQuoteNetwork rfpQuoteNetwork : rfpQuote.getRfpQuoteNetworks()){
            for(RfpQuoteNetworkPlan rfpQuoteNetworkPlan : rfpQuoteNetwork.getRfpQuoteNetworkPlans()){
                if(rfpQuoteNetworkPlan.getPnn().getName().equals(planName)){
                    assertThat(rfpQuoteNetworkPlan.getTier1Rate()).isEqualTo(tier1Rate);
                    assertThat(rfpQuoteNetworkPlan.getTier2Rate()).isEqualTo(tier2Rate);
                    assertThat(rfpQuoteNetworkPlan.getTier3Rate()).isEqualTo(tier3Rate);
                    assertThat(rfpQuoteNetworkPlan.getTier4Rate()).isEqualTo(tier4Rate);
                }
            }
        }

    }

}
