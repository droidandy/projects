package com.benrevo.core.service;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.benrevo.be.modules.onboarding.service.email.report.Document.Output;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.enums.FormType;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Form;
import com.benrevo.data.persistence.entities.FormQuestion;
import com.benrevo.data.persistence.entities.Question;
import com.benrevo.data.persistence.repository.FormRepository;


@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class AnthemPostSalesDocumentServiceTest extends AbstractControllerTest {

    @Autowired
    private AnthemPostSalesDocumentService service;

    @Autowired
    private TestEntityHelper testEntityHelper;

    @Autowired
    private FormRepository formRepository;

    @Override
    public void init() {}

    @Test
    public void testAnthemQuestionnaire() throws Exception {

        Client client = testEntityHelper.createTestClient();

        Form form = formRepository.findByName(FormType.ANTHEM_QUESTIONNAIRE.getMessage());

        for (FormQuestion fq : form.getFormQuestions()) {
            Question question = fq.getQuestion();
            if (question.getCode().equals("first_proposed_enrollment_meeting_date")) {
                testEntityHelper.createTestAnswer(client, question, "12/31/1999");
            } else if (question.getCode().equals("eoc_will_be_sent_out_to")) {
                testEntityHelper.createTestAnswer(client, question, "Group administrator");
            } else if (question.getCode().equals("contact_name_1")) {
                testEntityHelper.createTestAnswer(client, question, "TestClientName");
            } else if (question.getCode().equals("contact_email_1")) {
                testEntityHelper.createTestAnswer(client, question, "TestClientEmail");
            } else if (question.getCode().equals("contact_role_1")) {
                testEntityHelper.createTestAnswer(client, question, "Group Administrator");
                testEntityHelper.createTestAnswer(client, question, "Billing Contact");
            } else if (question.getCode().equals("contact_name_2")) {
                testEntityHelper.createTestAnswer(client, question, "TestClientName2");
            } else if (question.getCode().equals("contact_email_2")) {
                testEntityHelper.createTestAnswer(client, question, "TestClientEmail2");
            } else if (question.getCode().equals("contact_role_2")) {
                testEntityHelper.createTestAnswer(client, question,
                        "Designated HIPAA Representative");
                testEntityHelper.createTestAnswer(client, question, "Decision Maker");
            } else if (question.getCode().equals("contact_zip_3")) {
                testEntityHelper.createTestAnswer(client, question, "TestClientZip3");
            } else if (question.getCode().equals("contact_role_3")) {
                testEntityHelper.createTestAnswer(client, question, "Decision Maker");
            } else if (question.getCode().equals("contact_counter")) {
                testEntityHelper.createTestAnswer(client, question, "2");
            }
        }

        Output data = service.getDocument("anthem-blue-cross-questionnaire", client.getClientId());

        assertThat(data.getFilename()).isEqualTo("questionnaire.pdf");
        
        // Uncomment for manual check
        // FileOutputStream fos = new FileOutputStream("test-anthem-questionnaire.pdf");
        // data.getOutputStream().writeTo(fos);
        // fos.close();

    }

    @Test
    public void testAnthemTpaForm() throws Exception {

        Client client = testEntityHelper.createTestClient();

        Form form = formRepository.findByName("anthem-tpa-2");

        for (FormQuestion fq : form.getFormQuestions()) {
            Question question = fq.getQuestion();
            if (question.getCode().equals("tpa_quantity")) {
                testEntityHelper.createTestAnswer(client, question, "2");
            } else if (question.getCode().equals("tpa_name_2")) {
                testEntityHelper.createTestAnswer(client, question, "Tpa Name 2");
            } else if (question.getCode().equals("tpa_phone_2")) {
                testEntityHelper.createTestAnswer(client, question, "(555) 000000");
            } else if (question.getCode().equals("tpa_city_2")) {
                testEntityHelper.createTestAnswer(client, question, "Tpa City 2");
            } else if (question.getCode().equals("tpa_email_2")) {
                testEntityHelper.createTestAnswer(client, question, "tpa2_email@domain.test");
            } else if (question.getCode().equals("tpa_state_2")) {
                testEntityHelper.createTestAnswer(client, question, "Tpa State 2");
            } else if (question.getCode().equals("tpa_title_2")) {
                testEntityHelper.createTestAnswer(client, question, "Tpa Title 2");
            } else if (question.getCode().equals("tpa_zip_2")) {
                testEntityHelper.createTestAnswer(client, question, "Tpa Zip 2");
            } else if (question.getCode().equals("is_tpa_broker_2")) {
                testEntityHelper.createTestAnswer(client, question, "Yes");
            } else if (question.getCode().equals("tpa_administration_fee_2")) {
                testEntityHelper.createTestAnswer(client, question, "$ per subscriber");
            } else if (question.getCode().equals("tpa_functions_2")) {
                testEntityHelper.createTestAnswer(client, question, "Other");
                testEntityHelper.createTestAnswer(client, question, "COBRA");
            } else if (question.getCode().equals("tpa_remittance_2")) {
                testEntityHelper.createTestAnswer(client, question, "Remits net");
            } else if (question.getCode().equals("tpa_other_value_2")) {
                testEntityHelper.createTestAnswer(client, question, "Other value 2");
            } else if (question.getCode().equals("tpa_fee_per_subscriber_2")) {
                testEntityHelper.createTestAnswer(client, question, "10");
            } else if (question.getCode().equals("tpa_fee_per_member_2")) {
                testEntityHelper.createTestAnswer(client, question, "11");
            } else if (question.getCode().equals("tpa_how_admin_fee_paid_2")) {
                testEntityHelper.createTestAnswer(client, question,
                        "TPA nets out fee from collected premium");
            } else if (question.getCode().equals("tpa_street_address_2")) {
                testEntityHelper.createTestAnswer(client, question, "Street Address 2");
            }

        }

        Output data = service.getDocument("anthem-tpa-2", client.getClientId());

        assertThat(data.getFilename()).isEqualTo("tpa-2.pdf");
        // Uncomment for manual check
        // FileOutputStream fos = new FileOutputStream("test-anthem-tpa-2.pdf");
        // data.getOutputStream().writeTo(fos);
        // fos.close();
    }

}
