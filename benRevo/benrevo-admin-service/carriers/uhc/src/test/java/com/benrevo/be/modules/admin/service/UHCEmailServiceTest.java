package com.benrevo.be.modules.admin.service;


import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.service.BaseAdminEmailService;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import java.io.IOException;
import java.util.Date;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class UHCEmailServiceTest extends AdminAbstractControllerTest {

    @Autowired
    private BaseAdminEmailService emailService;

    @Autowired
    protected TestEntityHelper testEntityHelper;

    @Autowired
    protected RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    protected ClientPlanRepository clientPlanRepository;

    @Before
    public void setUp(){
        Authentication authentication = mock(Authentication.class);
        // Mockito.whens() for your authorization object
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getDetails()).thenReturn(1L);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void testApproveEmail() throws IOException {

        Client client = testEntityHelper.createTestClient();
        ClientTeam ct = testEntityHelper.createClientTeam(client.getBroker(), client);
        MailDto mailDto = emailService.prepareApproveMailDto(client.getClientId());

        Assert.assertTrue(mailDto.getSubject().contains(client.getClientName()));
        Assert.assertTrue(
            mailDto.getBccRecipients().contains(client.getBroker().getPresalesEmail()));
        Assert.assertTrue(mailDto.getContent().toLowerCase().contains("uhc"));
    }

    @Test
    public void testQuoteReadyNotificationEmail() throws Exception {
        Client client = testEntityHelper.createTestClient();
        ClientTeam ct = testEntityHelper.createClientTeam(client.getBroker(), client);
        Carrier carrier =
            testEntityHelper.createTestCarrier(Constants.UHC_CARRIER, Constants.UHC_CARRIER);

        RfpCarrier rfpMedicalCarrier =
            testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpMedicalSubmission =
            testEntityHelper.createTestRfpSubmission(client, rfpMedicalCarrier);
        rfpMedicalSubmission.setSubmittedDate(new Date());
        rfpSubmissionRepository.save(rfpMedicalSubmission);
        RfpQuote medicalQuote =
            testEntityHelper.createTestRfpQuote(rfpMedicalSubmission, QuoteType.STANDARD);

        MailDto mailDto = emailService.prepareQuoteReadyNotificationMailDto(client.getClientId(),
            Constants.UHC_CARRIER,
            null
        );
        assertThat(mailDto.getContent()).contains("YOUR QUOTE IS READY");

        RfpCarrier rfpDentalCarrier =
            testEntityHelper.createTestRfpCarrier(carrier, Constants.DENTAL);
        RfpSubmission rfpDentalSubmission =
            testEntityHelper.createTestRfpSubmission(client, rfpDentalCarrier);
        rfpDentalSubmission.setSubmittedDate(new Date());
        rfpSubmissionRepository.save(rfpDentalSubmission);
        RfpQuote dentalQuote =
            testEntityHelper.createTestRfpQuote(rfpDentalSubmission, QuoteType.STANDARD);

        mailDto = emailService.prepareQuoteReadyNotificationMailDto(client.getClientId(),
            Constants.UHC_CARRIER,
            null
        );
        assertThat(mailDto.getBccRecipients()).contains(client.getSalesEmail(), client.getPresalesEmail());
        assertThat(mailDto.getContent()).contains("YOUR QUOTE IS READY");

        RfpCarrier rfpVisionCarrier =
            testEntityHelper.createTestRfpCarrier(carrier, Constants.VISION);
        RfpSubmission rfpVisionSubmission =
            testEntityHelper.createTestRfpSubmission(client, rfpVisionCarrier);
        rfpVisionSubmission.setSubmittedDate(new Date());
        rfpSubmissionRepository.save(rfpVisionSubmission);
        RfpQuote visionQuote =
            testEntityHelper.createTestRfpQuote(rfpVisionSubmission, QuoteType.STANDARD);

        mailDto = emailService.prepareQuoteReadyNotificationMailDto(client.getClientId(),
            Constants.UHC_CARRIER,
            null
        );
        assertThat(mailDto.getContent()).contains("YOUR QUOTE IS READY");
    }

    @Test
    public void testQuoteReadyNotificationEmail_renewal_client_bcc_recipients() throws Exception {
        Client client = testEntityHelper.createTestClient();
        testEntityHelper.createTestClientAttribute(client, AttributeName.RENEWAL);
        ClientTeam ct = testEntityHelper.createClientTeam(client.getBroker(), client);
        Carrier carrier =
            testEntityHelper.createTestCarrier(Constants.UHC_CARRIER, Constants.UHC_CARRIER);

        RfpCarrier rfpMedicalCarrier =
            testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpMedicalSubmission =
            testEntityHelper.createTestRfpSubmission(client, rfpMedicalCarrier);
        rfpMedicalSubmission.setSubmittedDate(new Date());
        rfpSubmissionRepository.save(rfpMedicalSubmission);
        RfpQuote medicalQuote =
            testEntityHelper.createTestRfpQuote(rfpMedicalSubmission, QuoteType.STANDARD);

        flushAndClear();
        MailDto mailDto = emailService.prepareQuoteReadyNotificationMailDto(client.getClientId(),
            Constants.UHC_CARRIER,
            null
        );
        assertThat(mailDto.getBccRecipients())
            .containsExactly(client.getSalesEmail());
        assertThat(mailDto.getRecipients()).containsExactly(ct.getEmail());
        assertThat(mailDto.getContent()).contains("YOUR QUOTE IS READY");
    }

    @Test
    public void testQuoteReadyNotificationEmail_renewal_client() throws Exception {
        Client client = testEntityHelper.createTestClient();
        testEntityHelper.createTestClientAttribute(client, AttributeName.RENEWAL);

        PlanNameByNetwork pnn = testEntityHelper.createTestPlanNameByNetwork("Client plan 1", CarrierType.AETNA.name(), "HMO");
        ClientPlan clientPlan = new ClientPlan();
        clientPlan.setClient(client);
        clientPlan.setPnn(pnn);
        clientPlanRepository.save(clientPlan);

        Carrier carrier =
            testEntityHelper.createTestCarrier(Constants.UHC_CARRIER, Constants.UHC_CARRIER);
        RfpCarrier rfpVisionCarrier =
            testEntityHelper.createTestRfpCarrier(carrier, Constants.VISION);
        RfpSubmission rfpVisionSubmission =
            testEntityHelper.createTestRfpSubmission(client, rfpVisionCarrier);
        rfpVisionSubmission.setSubmittedDate(new Date());
        rfpSubmissionRepository.save(rfpVisionSubmission);
        testEntityHelper.createTestRfpQuote(rfpVisionSubmission, QuoteType.STANDARD);

        flushAndClear();

        // throw when ErContributionFormat is not set
        assertThatThrownBy(() -> emailService.sendQuoteReadyNotification(
            client.getClientId(), CarrierType.UHC.name())
        ).isInstanceOf(BaseException.class).hasMessageContaining("Client plan missing ERContributionFormat");

    }
}
