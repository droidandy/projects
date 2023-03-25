package com.benrevo.core.service.email.impl;

import static java.lang.String.format;
import static java.util.Arrays.asList;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.testng.Assert.assertEquals;
import com.benrevo.be.modules.client.service.ClientService;
import com.benrevo.be.modules.rfp.service.RfpEmailService;
import com.benrevo.be.modules.rfp.service.RfpVelocityService;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.DocumentGeneratorService;
import com.benrevo.be.modules.shared.service.SharedBrokerService;
import com.benrevo.be.modules.shared.service.SharedClientService;
import com.benrevo.be.modules.shared.service.SharedFileService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.PersonType;
import com.benrevo.core.UHCCoreServiceApplication;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientFileUpload;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientTeamRepository;
import com.benrevo.data.persistence.repository.NotificationRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import org.assertj.core.util.Lists;
import org.assertj.core.util.Strings;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;


@SpringBootTest(classes = UHCCoreServiceApplication.class)
public class UHCRfpEmailServiceTest  extends AbstractControllerTest {

    @Override
    public void init() throws Exception {
    }

    @Autowired
    private RfpEmailService emailService;
    
    @MockBean
    private RfpVelocityService velocityService;

    @MockBean(name = "sharedClientService")
    private SharedClientService sharedClientService;

    @MockBean
    private ClientService clientService;

    @MockBean
    private ClientTeamRepository clientTeamRepository;

    @MockBean
    private RfpRepository rfpRepository;

    @MockBean
    private DocumentGeneratorService documentGeneratorService;

    @MockBean
    private SharedFileService fileService;


    @MockBean
    private NotificationRepository notificationRepository;
    
    @MockBean
    private SharedBrokerService brokerService;
    
    private ClientDto clientDto;

    @Before
    public void setUp() {
        if(clientDto == null) {
            Broker broker = testEntityHelper.createTestBroker();
            Person specialty = testEntityHelper.createTestPerson(PersonType.SPECIALTY, "specFirstName specLastName", 
                Constants.BENREVO_DEVSPECIALTY_EMAIL, appCarrier[0]);
            broker.setSpecialty(specialty);
            
            Client client = testEntityHelper.createTestClient("testName", broker);
            clientDto = ClientMapper.clientToDTO(client);
        }
        
        Authentication authentication = mock(Authentication.class);
        // Mockito.whens() for your authorization object
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getDetails()).thenReturn(clientDto.getBrokerId());
        SecurityContextHolder.setContext(securityContext);
        
        when(sharedClientService.getById(anyLong())).thenReturn(clientDto);
        String emailTemplate = "testTemplate";
        when(velocityService.getSubmissionTemplate(
            anyString(),
            anyObject(),
            anyObject()
        )).thenReturn(emailTemplate);
        List<RFP> rfps = new ArrayList<>();
        RFP rfp = new RFP();
        rfp.setProduct("DENTAL");
        rfp.setRfpId(1L);
        rfps.add(rfp);
        rfps.add(rfp);
        rfps.add(rfp);
        when(velocityService.getRfpPagesArray(
            anyObject(),
            anyObject(),
            anyString()
        )).thenReturn(new String[] {"test"});
        List<ClientFileUpload> clientFileUploads = new ArrayList<>();
        ClientFileUpload clientFileUpload = new ClientFileUpload();
        clientFileUploads.add(clientFileUpload);
        clientFileUploads.add(clientFileUpload);
        clientFileUploads.add(clientFileUpload);
        when(fileService.getClientFilesByRfpId(anyLong())).thenReturn(clientFileUploads);
        // 9 files for send
        when(rfpRepository.findByClientClientIdAndRfpIdIn(anyLong(), anyObject())).thenReturn(rfps);
//        when(smtpMailer.send(anyObject(), anyObject(), anyObject())).thenReturn(true);
        when(s3FileManager.getNameFromKey(anyString())).thenReturn("test_file_name");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        when(documentGeneratorService.stringArrayToPdfOS(anyObject())).thenReturn(baos);
        when(documentGeneratorService.stringArrayToDocxOS(anyObject())).thenReturn(baos);

        ClientTeam ct = new ClientTeam();
        ct.setEmail("info+devpresale@benrevo.com");

        when(clientTeamRepository.findByClientClientId(anyLong())).thenReturn(asList(ct));
    }

    @After
    public void cleanUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void sendRFPSubmission() throws Exception {
        ArgumentCaptor<MailDto> argument = ArgumentCaptor.forClass(MailDto.class);

        FileDto testFile = new FileDto();
        testFile.setContent(new byte[1024 * 1024]);
        
        when(s3FileManager.download(anyString())).thenReturn(testFile);
        emailService.sendRFPSubmission(clientDto.getId(), Lists.emptyList());
        verify(smtpMailer, times(4)).send(anyObject(), anyObject());

        testFile.setContent(new byte[5 * 1024 * 1024]);
        when(s3FileManager.download(anyString())).thenReturn(testFile);
        reset(smtpMailer);
        emailService.sendRFPSubmission(clientDto.getId(), Lists.emptyList());
        verify(smtpMailer, times(18)).send(anyObject(), anyObject());

        testFile.setContent(new byte[7 * 1024 * 1024]);
        when(s3FileManager.download(anyString())).thenReturn(testFile);
        reset(smtpMailer);
        emailService.sendRFPSubmission(clientDto.getId(), Lists.emptyList());
        verify(smtpMailer, times(18)).send(anyObject(), anyObject());

        testFile.setContent(new byte[5 * 1024 * 512]);
        when(s3FileManager.download(anyString())).thenReturn(testFile);
        reset(smtpMailer);
        emailService.sendRFPSubmission(clientDto.getId(), Lists.emptyList());
        verify(smtpMailer, times(10)).send(argument.capture(), anyObject());

        String subject = format(Constants.RFP_SUBMISSION_SUBJECT, clientDto.getClientName(), clientDto.getBrokerName(), clientDto.getEffectiveDate());

        assertEquals(argument.getValue().getSubject(), "[testName] (5 of 5) " + subject);
        assertTrue(Strings.isNullOrEmpty(argument.getValue().getContent()));

        testFile.setContent(new byte[5 * 256 * 256]);
        when(s3FileManager.download(anyString())).thenReturn(testFile);
        reset(smtpMailer);
        emailService.sendRFPSubmission(clientDto.getId(), Lists.emptyList());
        verify(smtpMailer, times(2)).send(argument.capture(), anyObject());
        assertEquals(argument.getValue().getSubject(), subject);
    }

    @Test
    public void sendRFPSubmissionNoClientTeam() throws Exception {
        when(clientTeamRepository.findByClientClientId(anyLong())).thenReturn(new ArrayList<>());

        ArgumentCaptor<MailDto> argument = ArgumentCaptor.forClass(MailDto.class);

        FileDto testFile = new FileDto();
        testFile.setContent(new byte[1024 * 1024]);

        when(s3FileManager.download(anyString())).thenReturn(testFile);
        emailService.sendRFPSubmission(clientDto.getId(), Lists.emptyList());
        verify(smtpMailer, times(2)).send(anyObject(), anyObject());

        testFile.setContent(new byte[5 * 1024 * 1024]);
        when(s3FileManager.download(anyString())).thenReturn(testFile);
        reset(smtpMailer);
        emailService.sendRFPSubmission(clientDto.getId(), Lists.emptyList());
        verify(smtpMailer, times(9)).send(anyObject(), anyObject());

        testFile.setContent(new byte[7 * 1024 * 1024]);
        when(s3FileManager.download(anyString())).thenReturn(testFile);
        reset(smtpMailer);
        emailService.sendRFPSubmission(clientDto.getId(), Lists.emptyList());
        verify(smtpMailer, times(9)).send(anyObject(), anyObject());

        testFile.setContent(new byte[5 * 1024 * 512]);
        when(s3FileManager.download(anyString())).thenReturn(testFile);
        reset(smtpMailer);
        emailService.sendRFPSubmission(clientDto.getId(), Lists.emptyList());
        verify(smtpMailer, times(5)).send(argument.capture(), anyObject());

        String subject = format(Constants.RFP_SUBMISSION_SUBJECT, clientDto.getClientName(), clientDto.getBrokerName(), clientDto.getEffectiveDate());

        assertEquals(argument.getValue().getSubject(), "[testName] (5 of 5) " + subject);
        assertTrue(Strings.isNullOrEmpty(argument.getValue().getContent()));

        testFile.setContent(new byte[5 * 256 * 256]);
        when(s3FileManager.download(anyString())).thenReturn(testFile);
        reset(smtpMailer);
        emailService.sendRFPSubmission(clientDto.getId(), Lists.emptyList());
        verify(smtpMailer, times(1)).send(argument.capture(), anyObject());
        assertEquals(argument.getValue().getSubject(), subject);
    }

    @Test
    public void sendRFPSubmissionWithoutSpecialtyBroker() throws Exception {
        ArgumentCaptor<MailDto> argument = ArgumentCaptor.forClass(MailDto.class);

        List<RFP> rfps = new ArrayList<>();
        RFP rfp = new RFP();
        rfp.setRfpId(1L);
        rfp.setProduct("MEDICAL");

        rfps.add(rfp);

        when(rfpRepository.findByClientClientIdAndRfpIdIn(anyLong(), anyObject())).thenReturn(rfps);
        when(rfpRepository.findByClientClientId(anyLong())).thenReturn(rfps);

        FileDto testFile = new FileDto();
        testFile.setContent(new byte[5 * 256 * 256]);
        
        
        when(s3FileManager.download(anyString())).thenReturn(testFile);
        reset(smtpMailer);
        emailService.sendRFPSubmission(clientDto.getId(), Lists.emptyList());
        verify(smtpMailer, times(2)).send(argument.capture(), anyObject());

        String subject = format(Constants.RFP_SUBMISSION_SUBJECT, clientDto.getClientName(), clientDto.getBrokerName(), clientDto.getEffectiveDate());

        assertEquals(argument.getValue().getSubject(), subject);
        assertTrue(
            "Only DENTAL/VISION rfp product types should include the specialty broker email",
            argument.getAllValues().stream().filter(m -> m.getRecipients().contains("info+devspecialty@benrevo.com")).count() == 0
        );
    }

    @Test
    public void sendRFPSubmissionWithSpecialtyBroker() throws Exception {
        ArgumentCaptor<MailDto> argument = ArgumentCaptor.forClass(MailDto.class);

        List<RFP> rfps = new ArrayList<>();
        RFP rfp = new RFP();
        rfp.setRfpId(1L);
        rfp.setProduct("VISION");

        rfps.add(rfp);

        when(rfpRepository.findByClientClientIdAndRfpIdIn(anyLong(), anyObject())).thenReturn(rfps);
        when(rfpRepository.findByClientClientId(anyLong())).thenReturn(rfps);

        FileDto testFile = new FileDto();
        testFile.setContent(new byte[5 * 256 * 256]);
        when(s3FileManager.download(anyString())).thenReturn(testFile);
        reset(smtpMailer);
        emailService.sendRFPSubmission(clientDto.getId(), Lists.emptyList());
        verify(smtpMailer, times(2)).send(argument.capture(), anyObject());

        String subject = format(Constants.RFP_SUBMISSION_SUBJECT, clientDto.getClientName(), clientDto.getBrokerName(), clientDto.getEffectiveDate());

        assertEquals(argument.getValue().getSubject(), subject);
        assertTrue(
            "DENTAL/VISION rfp product types should include the specialty broker email!",
            argument.getAllValues().stream().filter(m -> m.getRecipients().contains("info+devspecialty@benrevo.com")).count() == 1
        );
    }

}
