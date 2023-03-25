package com.benrevo.broker.service;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.client.controller.ClientController;
import com.benrevo.be.modules.rfp.service.BaseRfpService;
import com.benrevo.be.modules.rfp.service.RfpSubmitter;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.ValidationDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientDetailsStatus;
import com.benrevo.common.enums.ClientState;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientFileRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpRepository;

import java.io.InputStream;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.web.context.HttpSessionSecurityContextRepository
    .SPRING_SECURITY_CONTEXT_KEY;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ValidationServiceTest extends AbstractControllerTest {
    
    @Autowired
    private ValidationService validationService;

    @Autowired
    private ClientController clientController;

    @Autowired
    private ClientFileRepository clientFileRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpSubmitter rfpSubmitter;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private BaseRfpService baseRfpService;

    @Autowired
    private SharedRfpService sharedRfpService;

    private String currDir;

    @Before
    @Override
    public void init() throws Auth0Exception {
        currDir = Paths.get("").toAbsolutePath().toString();
        initController(clientController);

        User user = new User("test");
        user.setEmail("test@domain.test");
        user.setUserMetadata( build( entry("first_name", "FirstName"), entry("last_name", "LastName") ) );

        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);
    }

    @Test
    public void test_client_status_no_rfp_products() {
        Client clientWithNoRfpProducts = testEntityHelper.createTestClient();

        ValidationDto dto = validationService.getClientDetailsStatus(
            clientWithNoRfpProducts.getClientId());

        assertThat(dto.getClient()).isEqualTo(ClientDetailsStatus.READY);
        assertThat(dto.getRfp()).isEqualTo(ClientDetailsStatus.NOT_STARTED);
        assertThat(dto.getPresentation()).isEqualTo(ClientDetailsStatus.NOT_STARTED);
    }

    @Test
    public void test_client_status_completed() {
        Client client = testEntityHelper.createTestClient();

        ClientRfpProduct medicalRfpProduct = testEntityHelper.createTestClientRfpProduct(client,
            Constants.MEDICAL);

        ValidationDto dto = validationService.getClientDetailsStatus(
            client.getClientId());

        assertThat(dto.getClient()).isEqualTo(ClientDetailsStatus.COMPLETED);
        assertThat(dto.getRfp()).isEqualTo(ClientDetailsStatus.READY);
        assertThat(dto.getPresentation()).isEqualTo(ClientDetailsStatus.NOT_STARTED);
    }

    @Test
    public void test_rfp_status_ready() throws Exception{
        ClientDto clientDto = uploadClient(null);
        ValidationDto dto = validationService.getClientDetailsStatus(
            clientDto.getId());

        assertThat(dto.getClient()).isEqualTo(ClientDetailsStatus.COMPLETED);
        assertThat(dto.getRfp()).isEqualTo(ClientDetailsStatus.READY);
        assertThat(dto.getPresentation()).isEqualTo(ClientDetailsStatus.NOT_STARTED);
    }

    @Test
    public void test_rfp_status_complete() throws Exception{
        ClientDto clientDto = uploadClient(null);

        uploadFakeQuoteSummary(clientDto.getId());

        // create rfp submissions
        Carrier incumbentCarrier = carrierRepository.findByName(CarrierType.ANTHEM_BLUE_CROSS.name());

        // These three lines are required because this method breaks out of the security context
        // (not within the @Test scope)
        SecurityContext sc = (SecurityContext) mockSession.getAttribute(SPRING_SECURITY_CONTEXT_KEY);
        SecurityContextHolder.setContext(sc);
        SecurityContextHolder.getContext().setAuthentication(sc.getAuthentication());

        rfpSubmitter.createRfpSubmissions(clientRepository.findOne(clientDto.getId()),
            incumbentCarrier.getCarrierId(), sharedRfpService.getRfpIdsByClientId(clientDto.getId()));

        ValidationDto dto = validationService.getClientDetailsStatus(
            clientDto.getId());

        assertThat(dto.getClient()).isEqualTo(ClientDetailsStatus.COMPLETED);
        assertThat(dto.getRfp()).isEqualTo(ClientDetailsStatus.COMPLETED);
        assertThat(dto.getPresentation()).isEqualTo(ClientDetailsStatus.READY);
    }

    @Test
    @Ignore
    public void test_presentation_complete() throws Exception{
        ClientDto clientDto = uploadClient(null);

        uploadFakeQuoteSummary(clientDto.getId());

        Carrier carrier = testEntityHelper.createTestCarrier(appCarrier[0], appCarrier[0]);
        // trigger rfp submission
        rfpSubmitter.createRfpSubmissions(
            clientRepository.findOne(clientDto.getId()),
            carrier.getCarrierId(),
            baseRfpService.getRfpIdsByClientId(clientDto.getId()) 
        );

        updateClientState(clientDto.getId(), ClientState.QUOTED);

        ValidationDto dto = validationService.getClientDetailsStatus(
            clientDto.getId());

        assertThat(dto.getClient()).isEqualTo(ClientDetailsStatus.COMPLETED);
        assertThat(dto.getRfp()).isEqualTo(ClientDetailsStatus.COMPLETED);
        assertThat(dto.getPresentation()).isEqualTo(ClientDetailsStatus.READY);
    }

    private ClientDto uploadClient(String clientName) throws Exception{
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream r = classLoader.getResourceAsStream("files/" + "Unit Test Completed RFP.xml");

        clientName = isEmpty(clientName) ? "Unit Test Completed RFP" : clientName;

        MockMultipartFile mockFile = new MockMultipartFile("file", "client.xml",
            "application/xml", r);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/v1/clients/upload")
            .file(mockFile)
            .param("clientName", clientName)
            .param("override", "true")
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
            .andExpect(status().isCreated())
            .andReturn();

        testEntityHelper.flushAndClear();

        ClientDto clientDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto.class);
        return clientDto;
    }

    private Client updateClientState(Long clientId, ClientState newClientState){
        Client client = clientRepository.findOne(clientId);
        client.setClientState(newClientState);
        return clientRepository.save(client);
    }

    private void uploadFakeQuoteSummary(Long clientId){

        List<RFP> rfps = rfpRepository.findByClientClientId(clientId);
        if(rfps != null){
            for(RFP rfp : rfps){
                ClientFileUpload fileUpload = new ClientFileUpload();
                fileUpload.setRfpId(rfp.getRfpId());
                fileUpload.setS3Key("rfp/07ed3198-40a0-4a8a-9ae4-d972063d9df9_FAKE.pdf");
                fileUpload.setType("application/pdf");
                fileUpload.setSection("fileSummary");
                fileUpload.setDeleted(false);
                fileUpload.setSize(433994L);

                SimpleDateFormat dateFormatter = new SimpleDateFormat(Constants.DATETIME_FORMAT);
                fileUpload.setCreated(dateFormatter.format(new Date()));
                clientFileRepository.save(fileUpload);
            }
            testEntityHelper.flushAndClear();
        }
    }
}
