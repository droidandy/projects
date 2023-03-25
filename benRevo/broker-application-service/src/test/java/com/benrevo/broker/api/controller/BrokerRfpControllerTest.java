package com.benrevo.broker.api.controller;

import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyList;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.DocumentGeneratorService;
import com.benrevo.broker.service.BrokerDocumentService;
import com.benrevo.broker.service.VelocityService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.RfpSubmissionDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.BrokerProgramAccess;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.repository.BrokerProgramAccessRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.MockReset;
import org.springframework.test.web.servlet.MvcResult;

public class BrokerRfpControllerTest extends AbstractControllerTest {

    @Autowired
    private BrokerRfpController brokerRfpController;
    
    @Autowired
    private RfpSubmissionRepository submissionRepository; 
    
    @Autowired
    private ProgramRepository programRepository;
    
    @Autowired
    private BrokerProgramAccessRepository brokerProgramAccessRepository;
    
    @MockBean(reset = MockReset.AFTER)
    private BrokerDocumentService documentService;

    @Before
    @Override
    public void init() {
        initController(brokerRfpController);
    }
    
    @Test
    public void submitRFPs() throws Exception {

        Client client = testEntityHelper.createTestClient();
        RFP medicalRRP = testEntityHelper.createTestRFP(client, Constants.MEDICAL);
        RFP dentalRRP = testEntityHelper.createTestRFP(client, Constants.DENTAL);

        Carrier c1 = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.displayName);
        Carrier c2 = testEntityHelper.createTestCarrier(CarrierType.AETNA.name(), CarrierType.AETNA.displayName);

        List<RfpSubmissionDto> params = new ArrayList<>();
        RfpSubmissionDto sub1 = new RfpSubmissionDto();
        sub1.setCarrierId(c1.getCarrierId());
        sub1.setRfpIds(Arrays.asList(medicalRRP.getRfpId(), dentalRRP.getRfpId()));
        sub1.setEmails(Arrays.asList("email_1"));
        params.add(sub1);
        RfpSubmissionDto sub2 = new RfpSubmissionDto();
        sub2.setCarrierId(c2.getCarrierId());
        sub2.setRfpIds(Arrays.asList(medicalRRP.getRfpId()));
        sub2.setEmails(Arrays.asList("email_2"));
        params.add(sub2);

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null, "/broker/clients/{id}/rfps/submit", client.getClientId());

        RfpSubmissionStatusDto[] statuses = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpSubmissionStatusDto[].class);
        assertThat(statuses).hasSize(3);
        assertThat(statuses).extracting(st -> st.getCarrierName())
            .containsExactlyInAnyOrder(CarrierType.CIGNA.name(), CarrierType.CIGNA.name(), CarrierType.AETNA.name());
        assertThat(statuses).extracting(st -> st.getProduct())
            .containsExactlyInAnyOrder(Constants.MEDICAL, Constants.DENTAL, Constants.MEDICAL);

        List<RfpSubmission> rfpSubmissions = submissionRepository.findByClient(client);
        assertThat(rfpSubmissions).hasSize(3);
        assertThat(rfpSubmissions).extracting(sub -> sub.getRfpCarrier().getCarrier().getName())
            .containsExactlyInAnyOrder(CarrierType.CIGNA.name(), CarrierType.CIGNA.name(), CarrierType.AETNA.name());
        assertThat(rfpSubmissions).extracting(sub -> sub.getRfpCarrier().getCategory())
            .containsExactlyInAnyOrder(Constants.MEDICAL, Constants.DENTAL, Constants.MEDICAL);

    }
    
    @Test
    public void submitRFPs_BBTProgram() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("submitRFPs_BBT_Client", broker);
        token = createToken(broker.getBrokerToken());
        
        ClientTeam ct = testEntityHelper.createClientTeam(broker, client);
        
        RFP medicalRFP = testEntityHelper.createTestRFP(client, Constants.MEDICAL);
        RFP dentalRFP = testEntityHelper.createTestRFP(client, Constants.DENTAL);
        RFP visionRFP = testEntityHelper.createTestRFP(client, Constants.VISION);

        RfpCarrier antMed = testEntityHelper.createTestRfpCarrier(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.MEDICAL);
        RfpCarrier antDen = testEntityHelper.createTestRfpCarrier(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.DENTAL);
        RfpCarrier antVis = testEntityHelper.createTestRfpCarrier(CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.VISION);
        RfpCarrier delDen = testEntityHelper.createTestRfpCarrier(CarrierType.DELTA_DENTAL.name(), Constants.DENTAL);
        RfpCarrier vspVis = testEntityHelper.createTestRfpCarrier(CarrierType.VSP.name(), Constants.VISION);

        Program program1 = programRepository.findByRfpCarrierAndName(antMed, Constants.BEYOND_BENEFITS_TRUST_PROGRAM);
        Program program2 = programRepository.findByRfpCarrierAndName(antDen, Constants.BEYOND_BENEFITS_TRUST_PROGRAM);
        Program program3 = programRepository.findByRfpCarrierAndName(antVis, Constants.BEYOND_BENEFITS_TRUST_PROGRAM);
        Program program4 = programRepository.findByRfpCarrierAndName(delDen, Constants.BEYOND_BENEFITS_TRUST_PROGRAM);
        Program program5 = programRepository.findByRfpCarrierAndName(vspVis, Constants.BEYOND_BENEFITS_TRUST_PROGRAM);
        
        User user = new User("test");
        user.setEmail("test@domain.test");
        user.setUserMetadata(build(entry("first_name", "FirstName"), entry("last_name", "LastName")));
        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);
        
        // we do not need to check documentService is this test
        when(documentService.buildTrustDocument(anyString(), any(), any(), anyList())).thenReturn(new byte[] {0, 1, 0, 1});
   
        List<RfpSubmissionDto> params = new ArrayList<>();
        RfpSubmissionDto sub1 = new RfpSubmissionDto();
        sub1.setRfpIds(Arrays.asList(medicalRFP.getRfpId(), dentalRFP.getRfpId(), visionRFP.getRfpId()));
        sub1.setEmails(Arrays.asList("email_1"));
        sub1.setProgramName(Constants.BEYOND_BENEFITS_TRUST_PROGRAM);
        params.add(sub1);

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null, "/broker/clients/{id}/rfps/submit", client.getClientId());

        RfpSubmissionStatusDto[] statuses = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpSubmissionStatusDto[].class);
        assertThat(statuses).hasSize(5);
        assertThat(statuses).extracting(st -> st.getCarrierName())
            .containsExactlyInAnyOrder(CarrierType.ANTHEM_BLUE_CROSS.name(), 
                CarrierType.ANTHEM_BLUE_CROSS.name(), CarrierType.ANTHEM_BLUE_CROSS.name(),
                CarrierType.DELTA_DENTAL.name(), CarrierType.VSP.name());
        assertThat(statuses).extracting(st -> st.getProduct())
            .containsExactlyInAnyOrder(Constants.MEDICAL, Constants.DENTAL, Constants.VISION, 
                Constants.DENTAL, Constants.VISION);
        assertThat(statuses).extracting(st -> st.getProgramId())
            .containsExactlyInAnyOrder(program1.getProgramId(), program2.getProgramId(),
                program3.getProgramId(), program4.getProgramId(), program5.getProgramId());
        
        // test correct emails was sent 
        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        ArgumentCaptor<List> attacheCaptor = ArgumentCaptor.forClass(List.class);
        Mockito.verify(smtpMailer, Mockito.times(4)).send(mailCaptor.capture(), attacheCaptor.capture());
        
        List<MailDto> mailDtos = mailCaptor.getAllValues();
        assertThat(mailDtos).hasSize(4);
        // FIXME need to order for checking check
//        assertThat(mailDtos.get(0).getContent()).contains("RFP Request").contains(">MEDICAL, DENTAL, VISION<");
//        assertThat(mailDtos.get(1).getContent()).contains("RFP Request").contains(">DENTAL<");
//        assertThat(mailDtos.get(2).getContent()).contains("RFP Request").contains(">VISION<");
//        assertThat(mailDtos.get(3).getContent()).contains("RFP Submitted");
//        assertThat(mailDtos.get(3).getRecipients()).contains(ct.getEmail());
        
       
        List<List> attachements = attacheCaptor.getAllValues();
        assertThat(attachements).hasSize(4);
    }
}
