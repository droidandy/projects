package com.benrevo.core.api;

import com.benrevo.be.modules.onboarding.controller.PostSalesController;
import com.benrevo.be.modules.onboarding.controller.PostSalesControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.FormType;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.repository.AttributeRepository;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.io.File;
import java.util.List;
import org.apache.commons.io.FileUtils;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class AnthemPostSalesControllerTest extends PostSalesControllerTest {

    private static final String ANTHEM_EMPLOYER_APPLICATION_ENDPOINT_URI = "/v1/files/anthem-blue-cross-employer-application";
    private static final String ANTHEM_QUESTIONNAIRE_ENDPOINT_URI = "/v1/files/anthem-blue-cross-questionnaire";

    @Autowired
    private PostSalesController postSalesController;
    
    @Autowired
    private AttributeRepository attributeRepository;

    @Before
    @Override
    public void init() {
        initController(postSalesController);
    }

    @Test
    @Ignore
    public void testAnthemQuestionnaire() throws Exception {
        testPdfForm(testEntityHelper.createTestClient(), FormType.ANTHEM_QUESTIONNAIRE, ANTHEM_QUESTIONNAIRE_ENDPOINT_URI);
    }

    @Test
    public void testAnthemEmployerApplication() throws Exception {
        Client testClient = testEntityHelper.createTestClient();
        testEntityHelper.createTestRFPs(testClient);
        testPdfForm(testClient, FormType.ANTHEM_EMPLOYER_APPLICATION, ANTHEM_EMPLOYER_APPLICATION_ENDPOINT_URI);
    }

    @Test
    public void postsalesPrimePlans() throws Exception {

        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        testEntityHelper.createTestRFPs(client);

        RfpQuote dentalRfpQuote = testEntityHelper.createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.DENTAL);
        RfpQuoteOption dentalRqo = testEntityHelper.createTestRfpQuoteOption(dentalRfpQuote, "optionName");

        RfpQuoteNetwork dppoRqn = testEntityHelper.createTestQuoteNetwork(dentalRfpQuote, "DPPO");
        
        RfpQuoteNetworkPlan rqnp4 = testEntityHelper.createTestRfpQuoteNetworkPlan("Test DPPO plan", dppoRqn, 100f, 120f, 140f, 160f);
        RfpQuoteOptionNetwork rqon4 = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalRqo, dppoRqn, rqnp4, null, 10L, 15L, 20L, 25L, "PERCENT", 95.2f, 96.2f, 97.2f, 98.2f);
        attributeRepository.save(new QuotePlanAttribute(rqnp4, QuotePlanAttributeName.PROGRAM, "Prime"));

        RfpQuoteNetworkPlan rqnp5 = testEntityHelper.createTestRfpQuoteNetworkPlan("Test DPPO plan Voluntary", dppoRqn, 100f, 120f, 140f, 160f);
        rqnp5.setVoluntary(true);
        RfpQuoteOptionNetwork rqon5 = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalRqo, dppoRqn, rqnp5, null, 10L, 15L, 20L, 25L, "PERCENT", 95.3f, 96.3f, 97.3f, 98.3f);
        attributeRepository.save(new QuotePlanAttribute(rqnp5, QuotePlanAttributeName.PROGRAM, "Prime"));
        
        mockMvc.perform(MockMvcRequestBuilders.post("/v1/clients/{clientId}/postsales", client.getClientId())
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isCreated())
            .andReturn();

        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        ArgumentCaptor<List<AttachmentDto>> listAttachmentCaptor  = ArgumentCaptor.forClass((Class) List.class);
        verify(smtpMailer, times(1)).send(mailCaptor.capture(), listAttachmentCaptor.capture());
        
        List<AttachmentDto> attachs = listAttachmentCaptor.getValue();
        
        //assertThat(attachs).hasSize(3);

        for (AttachmentDto attach : attachs) {
            // uncomment for manual testing
            //FileUtils.writeByteArrayToFile(new File("anthemPostsalesPrimePlansTest-" + attach.getFileName()), attach.getContent());
        }
        
        MailDto mailDto = mailCaptor.getValue();
        assertThat(mailDto.getSubject()).contains(client.getClientName());
        assertThat(mailDto.getContent()).contains(client.getClientName());
        assertThat(mailDto.getContent()).containsIgnoringCase("On-boarding");
        
        // uncomment for manual testing
        //FileUtils.writeByteArrayToFile(new File("postsalesTest-mail.html"), mailDto.getContent().getBytes());

    }

}
