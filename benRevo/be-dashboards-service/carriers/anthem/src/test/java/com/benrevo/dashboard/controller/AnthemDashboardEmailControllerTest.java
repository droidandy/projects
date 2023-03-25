package com.benrevo.dashboard.controller;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;
import com.auth0.json.mgmt.users.User;
import com.auth0.client.mgmt.filter.UserFilter;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.SharedHistoryService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.HistoryDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.enums.RFPAttributeName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import java.io.ByteArrayInputStream;
import java.util.Date;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class AnthemDashboardEmailControllerTest extends AbstractControllerTest {

    @Autowired
    private AnthemDashboardEmailController controller;

    @Autowired
    private SharedHistoryService sharedHistoryService;
    
    @Before
    @Override
    public void init() {
        initController(controller);
    }
    
    @Test
    public void testSendOptimiserToRater() throws Exception {
        
        Client client = testEntityHelper.createTestClient();
        client.setDueDate(new Date());
        
        RFP medicalRfp = testEntityHelper.createTestRFP(client, Constants.MEDICAL);
        medicalRfp.setPaymentMethod("$");
        medicalRfp.setCommission("15");
        testEntityHelper.createTestRfpAttribute(medicalRfp, RFPAttributeName.INVALID_WAIVERS, "5");
        testEntityHelper.createTestRfpAttribute(medicalRfp, RFPAttributeName.VALID_WAIVERS, "17");
        testEntityHelper.createTestRfpAttribute(medicalRfp, RFPAttributeName.KAISER_OR_SIMNSA, "Alongside Kaiser/SIMNSA");
        
        List<Option> medicalOptions = testEntityHelper.createTestRfpOptions(medicalRfp);
        medicalRfp.setOptions(medicalOptions);
        PlanNameByNetwork hmoPnn = testEntityHelper.createTestPlanNameByNetwork("Test HMO", Constants.ANTHEM_CARRIER, "HMO");
        testEntityHelper.createTestRfpToPNN(medicalRfp, hmoPnn, medicalOptions.get(0));        
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", hmoPnn.getPlan(), "$1000", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", hmoPnn.getPlan(), "$2000", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", hmoPnn.getPlan(), "$100", null);
        testEntityHelper.createTestBenefit("MAIL_ORDER", hmoPnn.getPlan(), "2x 1/2/3/4", null);

        PlanNameByNetwork ppoPnn = testEntityHelper.createTestPlanNameByNetwork("Test PPO", Constants.ANTHEM_CARRIER, "PPO");
        testEntityHelper.createTestRfpToPNN(medicalRfp, ppoPnn, medicalOptions.get(1));        

        RFP dentalRfp = testEntityHelper.createTestRFP(client, Constants.DENTAL);
        testEntityHelper.createTestRfpAttribute(dentalRfp, RFPAttributeName.CONTRACT_LENGTH_12_MONTHS, "true");
        testEntityHelper.createTestRfpAttribute(dentalRfp, RFPAttributeName.QUOTING_SCENARIOS, "QUOTING SCENARIOS");

        
        List<Option> dentalOptions = testEntityHelper.createTestRfpOptions(dentalRfp);
        dentalRfp.setOptions(dentalOptions);
        dentalOptions.get(0).setPlanType("DHMO");
        PlanNameByNetwork dhmoPnn = testEntityHelper.createTestPlanNameByNetwork("Test DHMO", Constants.ANTHEM_CARRIER, "DHMO");
        testEntityHelper.createTestRfpToPNN(dentalRfp, dhmoPnn, dentalOptions.get(0));        
        testEntityHelper.createTestBenefit("PRODUCT_TYPE", dhmoPnn.getPlan(), "Consumer Choice", null);
        testEntityHelper.createTestBenefit("NETWORK", dhmoPnn.getPlan(), "Prime", null);

        PlanNameByNetwork dppoPnn1 = testEntityHelper.createTestPlanNameByNetwork("Test DPPO", Constants.ANTHEM_CARRIER, "DPPO");
        dentalOptions.get(1).setPlanType("DPPO");
        testEntityHelper.createTestRfpToPNN(dentalRfp, dppoPnn1, dentalOptions.get(1));
        testEntityHelper.createTestBenefit("CLASS_1_PREVENTIVE", dppoPnn1.getPlan(), "65%", "75%");
        testEntityHelper.createTestBenefit("NON_SURGICAL_ENDODONTICS", dppoPnn1.getPlan(), "70%", "90%").setRestriction("Basic Service");;
        testEntityHelper.createTestBenefit("SURGICAL_ENDODONTICS", dppoPnn1.getPlan(), "-", "30").setRestriction("Major Service");
        testEntityHelper.createTestBenefit("NON_SURGICAL_PERIODONTICS", dppoPnn1.getPlan(), "40%", "40").setRestriction("Major Service");
        testEntityHelper.createTestBenefit("BASIC_WAITING_PERIOD", dppoPnn1.getPlan(), "3 months", null);
        testEntityHelper.createTestBenefit("DENTAL_INDIVIDUAL", dppoPnn1.getPlan(), "$75", "$100");
        testEntityHelper.createTestBenefit("INDIVIDUAL_OOP_LIMIT", dppoPnn1.getPlan(), "$1000", "$1750");
        testEntityHelper.createTestBenefit("REIMBURSEMENT_SCHEDULE", dppoPnn1.getPlan(), "60%", null);
        testEntityHelper.createTestBenefit("CARRY_IN", dppoPnn1.getPlan(), "Yes", null);
        testEntityHelper.createTestBenefit("CROWNS", dppoPnn1.getPlan(), "No limit", null);

        PlanNameByNetwork dppoPnn2 = testEntityHelper.createTestPlanNameByNetwork("Test DPPO", Constants.ANTHEM_CARRIER, "DPPO");
        dentalOptions.get(2).setPlanType("DPPO");
        testEntityHelper.createTestRfpToPNN(dentalRfp, dppoPnn2, dentalOptions.get(2));
        testEntityHelper.createTestBenefit("CLASS_1_PREVENTIVE", dppoPnn2.getPlan(), "75%", "85%");
        testEntityHelper.createTestBenefit("NON_SURGICAL_ENDODONTICS", dppoPnn2.getPlan(), "60%", "65%").setRestriction("Major Service");;
        testEntityHelper.createTestBenefit("SURGICAL_ENDODONTICS", dppoPnn2.getPlan(), "45%", "-").setRestriction("Basic Service");
        testEntityHelper.createTestBenefit("NON_SURGICAL_PERIODONTICS", dppoPnn2.getPlan(), "-", "50%").setRestriction("Major Service");
        testEntityHelper.createTestBenefit("BASIC_WAITING_PERIOD", dppoPnn2.getPlan(), "6 months", null);
        testEntityHelper.createTestBenefit("DENTAL_INDIVIDUAL", dppoPnn2.getPlan(), "$50", "$120");
        testEntityHelper.createTestBenefit("INDIVIDUAL_OOP_LIMIT", dppoPnn2.getPlan(), "$2000", "$2250");
        testEntityHelper.createTestBenefit("REIMBURSEMENT_SCHEDULE", dppoPnn2.getPlan(), "70%", null);
        testEntityHelper.createTestBenefit("TMJ", dppoPnn2.getPlan(), "Covered", null);
        testEntityHelper.createTestBenefit("CROWNS", dppoPnn2.getPlan(), "1 per tooth per 60 months", null);

        RFP visionRfp = testEntityHelper.createTestRFP(client, Constants.MEDICAL);
        visionRfp.setOptions(testEntityHelper.createTestRfpOptions(visionRfp));

        Carrier carrier = testEntityHelper.createTestCarrier(
                CarrierType.ANTHEM_BLUE_CROSS.name(), CarrierType.ANTHEM_BLUE_CROSS.name());
        Person rater = testEntityHelper.createTestPerson(
                PersonType.RATER, "fullName", "email@test.com", CarrierType.ANTHEM_BLUE_CROSS.name());
        
        token = createToken(client.getBroker().getBrokerToken());
        
        User user = new User("test");
        user.setEmail("test@domain.test");
        user.setUserMetadata( build( entry("first_name", "FirstName"), entry("last_name", "LastName") ) );

        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);

        flushAndClear();
        
        byte[] bytes = "test".getBytes();
        ByteArrayInputStream is = new ByteArrayInputStream(bytes);
        MockMultipartFile mockFile = new MockMultipartFile("file", "fileName", "text/plain", is);

        MvcResult result = mockMvc.perform(
            MockMvcRequestBuilders.fileUpload("/dashboard/clients/{clientId}/email/optimizer",
                client.getClientId() )
                .file(mockFile)
                .param("personId", rater.getPersonId().toString())
                .param("note", "note")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        // check notification was saved
        List<HistoryDto> notifications = sharedHistoryService.getLastNotifications(client.getClientId(), "EMAIL", "SENT_TO_RATER");
        assertThat(notifications).hasSize(1);
        
        // check send was called 
        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        ArgumentCaptor<List<AttachmentDto>> attacheCaptor = ArgumentCaptor.forClass((Class)List.class);
        
        Mockito.verify(smtpMailer, Mockito.times(1)).send(mailCaptor.capture(), attacheCaptor.capture());
        
        MailDto mailDto = mailCaptor.getValue();
        
        assertThat(mailDto.getRecipients()).hasSize(1);
        assertThat(mailDto.getRecipients().get(0)).isEqualTo(rater.getEmail());
        assertThat(mailDto.getSubject())
            .contains("Rating Request:")
            .contains(client.getClientName());   
        
        assertThat(attacheCaptor.getValue()).hasSize(2);
        
        AttachmentDto optimizerAttachmnent = null;
        AttachmentDto testAttachmnent = null;
        for (AttachmentDto attach : attacheCaptor.getValue()) {
            if (attach.getFileName().contains("Optimizer")) {
                optimizerAttachmnent = attach;
            } else {
                testAttachmnent = attach;
            }
        }
        
        assertThat(optimizerAttachmnent).isNotNull();
        assertThat(testAttachmnent).isNotNull();

        byte[] optimizerFile = optimizerAttachmnent.getContent();
        assertThat(optimizerFile).isNotEmpty();
        
        //java.io.File file = new java.io.File("rater_optimizer_test.xlsm");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(file, optimizerFile);

        //java.io.File file2 = new java.io.File("rater_test.txt");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(file2, testAttachmnent.getContent());

        
        //java.io.File html = new java.io.File("rater_template.html");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(html, mailCaptor.getValue().getContent().getBytes());

        
    }
  
}



