package com.benrevo.core.api.controller;

import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doAnswer;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.rfp.controller.RfpController;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class RfpControllerTest extends AbstractControllerTest {
    
    // make room to rfp.pdf file
    static int SIZE_LIMITATION = 5 * 1024 * 1024 - 100000;

    @Autowired
    private TestEntityHelper testEntityHelper;

    @Autowired
    private RfpSubmissionRepository submissionRepository;
    
    @Autowired
    private RfpController controller;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Before
    public void init() throws Auth0Exception {
        initController(controller);
        
        User user = new User("test");
        user.setEmail("test@domain.test");
        user.setUserMetadata( build( entry("first_name", "FirstName"), entry("last_name", "LastName") ) );

        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);

    }

    @Test
    public void submitRfpsTest() throws Exception {
        Client client = testEntityHelper.createTestClient();
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        token = createToken(client.getBroker().getBrokerToken());
        
        mockMvc.perform(MockMvcRequestBuilders.post("/v1/clients/{id}/rfps/submit", client.getClientId())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .param("rfpIds", getCommaSeparatedRFPIds(rfps))
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andReturn();

        List<RfpSubmission> rfpSubmissions = submissionRepository.findByClient(client);
        assertThat(rfps.size()).isEqualTo(rfpSubmissions.size());
    
        for ( RfpSubmission rfpSubmission : rfpSubmissions) {
            assertThat(rfpSubmission.getSubmittedBy()).isEqualTo("test@domain.test");
            assertThat(rfpSubmission.getRfpCarrier().getCarrier().getName()).isEqualTo(appCarrier[0]);
        }

        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        ArgumentCaptor<List<AttachmentDto>> listAttachmentCaptor  = ArgumentCaptor.forClass((Class) List.class);
        verify(smtpMailer, times(1)).send(mailCaptor.capture(), listAttachmentCaptor.capture());
        
        List<AttachmentDto> attachs = listAttachmentCaptor.getValue();
        
        assertThat(attachs).hasSize(1);
        AttachmentDto attach = attachs.get(0);
        assertThat(attach.getFileName()).isEqualTo("rfp-submission.zip");

        // uncomment for manual testing
        //FileUtils.writeByteArrayToFile(new File("submitRfpsTest-" + attach.getFileName()), 
        //        attach.getContent());
        
        MailDto mailDto = mailCaptor.getValue();
        assertThat(mailDto.getSubject()).contains(client.getClientName());
        
        // looking for a carrier client copy
        List<Client> carrierClients = clientRepository.findByClientNameAndBrokerBrokerIdAndCarrierOwned(client.getClientName(), client.getBroker().getBrokerId(), true);
        assertThat(carrierClients).hasSize(1);
        
        flushAndClear();
        
    }
    
    public void submitRfpsTest_MultipleCarriers() throws Exception {
        Client client = testEntityHelper.createTestClient();
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        token = createToken(client.getBroker().getBrokerToken());
        
        Carrier c1 = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.displayName);
        Carrier c2 = testEntityHelper.createTestCarrier(CarrierType.AETNA.name(), CarrierType.AETNA.displayName);
        
        mockMvc.perform(MockMvcRequestBuilders.post("/v1/clients/{id}/rfps/submit", client.getClientId())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .param("rfpIds", getCommaSeparatedRFPIds(rfps))
            .param("carrierIds", c1.getCarrierId().toString() + "," + c2.getCarrierId())
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andReturn();

        List<RfpSubmission> rfpSubmissions = submissionRepository.findByClient(client);
        assertThat(rfps.size()).isEqualTo(rfpSubmissions.size() * 2); // x2 carrier
        
        assertThat(rfpSubmissions).extracting(sub -> sub.getRfpCarrier().getCarrier().getName())
            .containsExactlyInAnyOrder(CarrierType.CIGNA.name(), CarrierType.AETNA.name());
    }

    @Test
    public void submitRfpsWithClientTeamTest() throws Exception {
        Client client = testEntityHelper.createTestClient();
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        testEntityHelper.createClientTeam(client.getBroker(), client);
        token = createToken(client.getBroker().getBrokerToken());
        
        List<MailDto> mailDtos = new ArrayList<>();
        List<List<AttachmentDto>> attachsList = new ArrayList<>();
        doAnswer(invocation -> {
                final MailDto mailDto = invocation.getArgumentAt(0, MailDto.class);
                List<AttachmentDto> attachs = invocation.getArgumentAt(1, List.class);
                // make deep copy, because Mockito captures only references
                MailDto copyMailDto = new MailDto();
                copyMailDto.setSubject(mailDto.getSubject());
                copyMailDto.setContent(mailDto.getContent());
                mailDtos.add(copyMailDto);
                attachsList.add(attachs);
                return null;
        }).when(smtpMailer).send(anyObject(), anyObject());
        
        performPostWithParamsAndAssertResult(
                null, 
                null, 
                "/v1/clients/{id}/rfps/submit", 
                new Object[] {"rfpIds", getCommaSeparatedRFPIds(rfps)}, 
                client.getClientId());
        
        assertThat(attachsList.size()).isEqualTo(2);
        assertThat(mailDtos.size()).isEqualTo(2);
        
        MailDto mailToCarrierDto = mailDtos.get(0);
        assertThat(mailToCarrierDto.getContent()).contains(client.getClientName(), "optimizer");
        assertThat(mailToCarrierDto.getSubject()).contains(client.getClientName());
        // uncomment for manual testing
        //FileUtils.writeByteArrayToFile(new File("submitRfpsWithClientTeamTest-MailToCarrier.html" ), 
        //        mailToCarrierDto.getContent().getBytes());

        MailDto mailToTeamDto = mailDtos.get(1);
        assertThat(mailToTeamDto.getContent()).contains(client.getClientName()).doesNotContain("optimizer");
        assertThat(mailToTeamDto.getSubject()).contains(client.getClientName());
        // uncomment for manual testing
        //FileUtils.writeByteArrayToFile(new File("submitRfpsWithClientTeamTest-MailToTeam.html" ), 
        //        mailToTeamDto.getContent().getBytes());

        // test that rfp.pdf and optimizer files were sent to carrier 
        assertThat(attachsList.get(0)).hasSize(1);
        AttachmentDto attachToCarrier = attachsList.get(0).get(0);
        assertThat(attachToCarrier.getFileName()).isEqualTo("rfp-submission.zip");
        
        // uncomment for manual testing
        //FileUtils.writeByteArrayToFile(
        //        new File("submitRfpsWithClientTeamTest-ToCarrier-" + attachToCarrier.getFileName()), 
        //        attachToCarrier.getContent());

        ZipInputStream zin = new ZipInputStream(new ByteArrayInputStream(attachToCarrier.getContent()));
        
        ZipEntry rfpFile = zin.getNextEntry();
        assertThat(rfpFile).isNotNull();
        assertThat(rfpFile.getName()).isEqualTo("RFP.pdf");

        ZipEntry optimizerFile = zin.getNextEntry();
        assertThat(optimizerFile).isNotNull();
        assertThat(optimizerFile.getName()).containsIgnoringCase("optimizer");
        
        // no more files
        assertThat(zin.getNextEntry()).isNull();
        
        zin.close();
        
        // test that only rfp.pdf (without optimizer) was sent to team 
        assertThat(attachsList.get(1)).hasSize(1);
        AttachmentDto attachToTeam = attachsList.get(1).get(0);
        assertThat(attachToTeam.getFileName()).isEqualTo("rfp-submission.zip");

        // uncomment for manual testing
        //FileUtils.writeByteArrayToFile(
        //        new File("submitRfpsWithClientTeamTest-ToTeam-" + attachToTeam.getFileName()), 
        //        attachToTeam.getContent());
        
        zin = new ZipInputStream(new ByteArrayInputStream(attachToTeam.getContent()));
        
        rfpFile = zin.getNextEntry();
        assertThat(rfpFile).isNotNull();
        assertThat(rfpFile.getName()).isEqualTo("RFP.pdf");

        // should not be an optimizer file
        optimizerFile = zin.getNextEntry();
        assertThat(optimizerFile).isNull();
        
        zin.close();
        
    }

    @Test
    public void submitRfpsWithBigFileTest() throws Exception {
        Client client = testEntityHelper.createTestClient();
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        testEntityHelper.createTestRFPFile(rfps.get(0));
        token = createToken(client.getBroker().getBrokerToken());
        
        FileDto testFile = new FileDto();
        testFile.setContent(new byte[SIZE_LIMITATION]);
        testFile.setSize((long)SIZE_LIMITATION);
        testFile.setName("test");
        testFile.setType(MediaType.APPLICATION_PDF_VALUE);
        
        when(s3FileManager.download(anyString())).thenReturn(testFile);
        when(s3FileManager.getNameFromKey(anyString())).thenReturn("testFileName");
        
        List<MailDto> mailDtos = new ArrayList<>();
        List<List<AttachmentDto>> attachsList = new ArrayList<>();
        doAnswer(invocation -> {
                final MailDto mailDto = invocation.getArgumentAt(0, MailDto.class);
                List<AttachmentDto> attachs = invocation.getArgumentAt(1, List.class);
                // make deep copy, because Mockito captures only references
                MailDto copyMailDto = new MailDto();
                copyMailDto.setSubject(mailDto.getSubject());
                copyMailDto.setContent(mailDto.getContent());
                mailDtos.add(copyMailDto);
                attachsList.add(attachs);
                return null;
        }).when(smtpMailer).send(anyObject(), anyObject());
        
        performPostWithParamsAndAssertResult(
                null, 
                null, 
                "/v1/clients/{id}/rfps/submit", 
                new Object[] {"rfpIds", getCommaSeparatedRFPIds(rfps)}, 
                client.getClientId());
        
        assertThat(attachsList.size()).isEqualTo(2);
        assertThat(mailDtos.size()).isEqualTo(2);
        
        MailDto mailDto0 = mailDtos.get(0);
        assertThat(mailDto0.getContent()).contains(client.getClientName());
        assertThat(mailDto0.getSubject()).contains(client.getClientName());
        // uncomment for manual testing
        //FileUtils.writeByteArrayToFile(new File("submitRfpsWithBigFileTest-Mail.html" ), 
        //        mailDto0.getContent().getBytes());
        
        MailDto mailDto1 = mailDtos.get(1);
        // second email body should be empty
        assertThat(mailDto1.getContent()).isEmpty();
        assertThat(mailDto1.getSubject()).contains(client.getClientName());
        
        AttachmentDto attach0 = attachsList.get(0).get(0);
        assertThat(attach0.getFileName()).isEqualTo("rfp-submission-1-of-2.zip");
        // uncomment for manual testing
        //FileUtils.writeByteArrayToFile(new File("submitRfpsWithBigFileTest0-" + attach0.getFileName()), 
        //        attach0.getContent());

        AttachmentDto attach1 = attachsList.get(1).get(0);
        assertThat(attach1.getFileName()).isEqualTo("rfp-submission-2-of-2.zip");
        // uncomment for manual testing
        //FileUtils.writeByteArrayToFile(new File("submitRfpsWithBigFileTest1-" + attach1.getFileName()), 
        //        attach1.getContent());

    }

    private String getCommaSeparatedRFPIds(List<RFP> rfps){
        StringJoiner joiner = new StringJoiner(",");
        for(RFP rfp : rfps){
            joiner.add(String.valueOf(rfp.getRfpId()));
        }
        return joiner.toString();
    }
    
}
