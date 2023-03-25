package com.benrevo.core.service;

import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.core.service.AnthemOnboardingEmailService;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.repository.BrokerRepository;
import java.util.List;
import java.util.Random;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.FormType;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Form;
import com.benrevo.data.persistence.entities.FormQuestion;
import com.benrevo.data.persistence.entities.Question;
import com.benrevo.data.persistence.repository.FormRepository;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class AnthemEmailServiceTest extends AbstractControllerTest {

    @Autowired
    private AnthemOnboardingEmailService anthemEmailService;

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Before
    @Override
    public void init() throws Exception {
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
    }

    @After
    public void cleanUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void sendPostSalesNotification() throws Exception {

        Client client = testEntityHelper.createTestClient();

        anthemEmailService.sendPostSalesNotification(client.getClientId());

        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        ArgumentCaptor<List<AttachmentDto>> listAttachmentCaptor = ArgumentCaptor.forClass((Class) List.class);
        verify(smtpMailer, times(1)).send(mailCaptor.capture(), listAttachmentCaptor.capture());

        List<AttachmentDto> attachs = listAttachmentCaptor.getValue();
        // check for missing Meetings_and_Packets attach (no client answers)
        //assertThat(attachs).hasSize(3);
        assertThat(attachs).extracting("fileName").containsExactlyInAnyOrder(
                AnthemOnboardingEmailService.EMPLOYER_APPLICATION_FILENAME,
                AnthemOnboardingEmailService.EMPLOYER_ACCESS_FILENAME,
                AnthemOnboardingEmailService.QUESTIONNAIRE_FILENAME,
                AnthemOnboardingEmailService.COMMON_OWNERSHIP_FILENAME
                );

        Form form = formRepository.findByName(FormType.ANTHEM_KIT_REQUESTS.getMessage());
        List<Question> questions = form.getFormQuestions().stream().map(FormQuestion::getQuestion).collect(toList());

        Random random = new Random();
        for(Question q : questions) {
            switch(q.getCode()) {
                case "are_open_enrollment_meetings_planned":
                    testEntityHelper.createTestAnswer(client, q, "Yes");
                    break;
                case "meetings_planned_count":
                    testEntityHelper.createTestAnswer(client, q, "5");
                    break;
                case "does_the_group_want_enrollment_packets":
                    testEntityHelper.createTestAnswer(client, q, "Yes");
                    break;
                default:
                    testEntityHelper.createTestAnswer(client, q, "Random text & " + random.nextInt());
                    break;
            }
        }

        Mockito.reset(smtpMailer);
        
        // check for attached Meetings_and_Packets file
        anthemEmailService.sendPostSalesNotification(client.getClientId());
        verify(smtpMailer, times(1)).send(mailCaptor.capture(), listAttachmentCaptor.capture());
        attachs = listAttachmentCaptor.getValue();
        
        assertThat(attachs).extracting("fileName").containsExactlyInAnyOrder(
                AnthemOnboardingEmailService.EMPLOYER_APPLICATION_FILENAME, 
                AnthemOnboardingEmailService.QUESTIONNAIRE_FILENAME,
                AnthemOnboardingEmailService.EMPLOYER_ACCESS_FILENAME,
                AnthemOnboardingEmailService.COMMON_OWNERSHIP_FILENAME,
                AnthemOnboardingEmailService.MEETINGS_AND_PACKETS_REQUEST_FILENAME
                );

//        java.io.File file = new java.io.File(AnthemOnboardingEmailService.MEETINGS_AND_PACKETS_REQUEST_FILENAME);
//        org.apache.commons.io.FileUtils.writeByteArrayToFile(file, meetingsPackets.getContent());
    }

    @Test
    public void sendPostSalesNotificationWithTPAs() throws Exception {

        Client client = testEntityHelper.createTestClient();

        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        ArgumentCaptor<List<AttachmentDto>> listAttachmentCaptor = ArgumentCaptor.forClass((Class) List.class);
        List<AttachmentDto> attachs = null;
        
        Form form = formRepository.findByName("anthem-tpa-2");
        for (FormQuestion fq : form.getFormQuestions()) {
            if ("tpa_quantity".equals(fq.getQuestion().getCode())) {
                testEntityHelper.createTestAnswer(client, fq.getQuestion(), "5");
            }
        }

        // check for attached form files
        anthemEmailService.sendPostSalesNotification(client.getClientId());
        verify(smtpMailer, times(1)).send(mailCaptor.capture(), listAttachmentCaptor.capture());
        attachs = listAttachmentCaptor.getValue();
        
        assertThat(attachs).hasSize(8);
        assertThat(attachs).extracting("fileName").containsExactlyInAnyOrder(
                AnthemOnboardingEmailService.EMPLOYER_APPLICATION_FILENAME, 
                AnthemOnboardingEmailService.QUESTIONNAIRE_FILENAME,
                AnthemOnboardingEmailService.COMMON_OWNERSHIP_FILENAME,
                AnthemOnboardingEmailService.EMPLOYER_ACCESS_FILENAME,
                String.format(AnthemOnboardingEmailService.TPA_FILENAME_FORMAT, 2),
                String.format(AnthemOnboardingEmailService.TPA_FILENAME_FORMAT, 3),
                String.format(AnthemOnboardingEmailService.TPA_FILENAME_FORMAT, 4),
                String.format(AnthemOnboardingEmailService.TPA_FILENAME_FORMAT, 5)
                );

    }

}
