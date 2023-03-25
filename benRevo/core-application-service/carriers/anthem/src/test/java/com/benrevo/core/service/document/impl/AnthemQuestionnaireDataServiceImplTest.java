package com.benrevo.core.service.document.impl;

import static org.assertj.core.api.Assertions.assertThat;
import com.benrevo.be.modules.onboarding.service.email.report.Document;
import com.benrevo.be.modules.onboarding.service.email.report.PdfProcessor;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.enums.FormType;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.core.service.AnthemQuestionnaireDataServiceImpl;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Form;
import com.benrevo.data.persistence.entities.FormQuestion;
import com.benrevo.data.persistence.entities.Question;
import com.benrevo.data.persistence.repository.FormRepository;
import java.io.FileOutputStream;
import java.util.Map;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class AnthemQuestionnaireDataServiceImplTest extends AbstractControllerTest {

    private static final String TEMPLATE_ANTHEM_QUESTIONNAIRE =
            "/templates/anthem_blue_cross/postsales/anthem-questionnaire.pdf";

    @Autowired
    private AnthemQuestionnaireDataServiceImpl dataService;

    @Autowired
    private TestEntityHelper testEntityHelper;

    @Autowired
    private FormRepository formRepository;

    @Override
    public void init() {}

    @Test
    public void testProposedEnrollmentEeetingDateFormat() throws Exception {

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
            } else if (question.getCode().equals("tpa_quantity")) {
                testEntityHelper.createTestAnswer(client, question, "1");
            } else if (question.getCode().equals("tpa_name_1")) {
                testEntityHelper.createTestAnswer(client, question, "Tpa Name 1");
            } else if (question.getCode().equals("tpa_phone_1")) {
                testEntityHelper.createTestAnswer(client, question, "(555) 000000");
            } else if (question.getCode().equals("tpa_city_1")) {
                testEntityHelper.createTestAnswer(client, question, "Tpa City 1");
            } else if (question.getCode().equals("tpa_email_1")) {
                testEntityHelper.createTestAnswer(client, question, "tpa1_email@domain.test");
            } else if (question.getCode().equals("tpa_state_1")) {
                testEntityHelper.createTestAnswer(client, question, "Tpa State 1");
            } else if (question.getCode().equals("tpa_title_1")) {
                testEntityHelper.createTestAnswer(client, question, "Tpa Title 1");
            } else if (question.getCode().equals("tpa_zip_1")) {
                testEntityHelper.createTestAnswer(client, question, "Tpa Zip 1");
            } else if (question.getCode().equals("is_tpa_broker_1")) {
                testEntityHelper.createTestAnswer(client, question, "Yes");
            } else if (question.getCode().equals("tpa_administration_fee_1")) {
                testEntityHelper.createTestAnswer(client, question, "$ per subscriber");
            } else if (question.getCode().equals("tpa_functions_1")) {
                testEntityHelper.createTestAnswer(client, question, "Other");
            } else if (question.getCode().equals("tpa_remittance_1")) {
                testEntityHelper.createTestAnswer(client, question, "Remits net");
            } else if (question.getCode().equals("tpa_other_value_1")) {
                testEntityHelper.createTestAnswer(client, question, "Other value 1");
            } else if (question.getCode().equals("tpa_fee_per_subscriber_1")) {
                testEntityHelper.createTestAnswer(client, question, "9");
            } else if (question.getCode().equals("tpa_fee_per_member_1")) {
                testEntityHelper.createTestAnswer(client, question, "11");
            } else if (question.getCode().equals("tpa_how_admin_fee_paid_1")) {
                testEntityHelper.createTestAnswer(client, question,
                        "TPA nets out fee from collected premium");
            } else if (question.getCode().equals("tpa_street_address_1")) {
                testEntityHelper.createTestAnswer(client, question, "Street Address 1");
            }

        }

        Map<String, String> data = dataService.getData(client);

        assertThat(data.get("first_proposed_enrollment_meeting_date")).isEqualTo("12311999");
        assertThat(data.get("eoc_name")).isEqualTo("TestClientName");
        assertThat(data.get("eoc_email")).isEqualTo("TestClientEmail");

        assertThat(data.get("Group Administrator_name")).isEqualTo("TestClientName");
        assertThat(data.get("Group Administrator_email")).isEqualTo("TestClientEmail");

        assertThat(data.get("Billing Contact_name")).isEqualTo("TestClientName");
        assertThat(data.get("Billing Contact_email")).isEqualTo("TestClientEmail");

        assertThat(data.get("Designated HIPAA Representative_name")).isEqualTo("TestClientName2");
        assertThat(data.get("Designated HIPAA Representative_email")).isEqualTo("TestClientEmail2");

        assertThat(data.get("Decision Maker_name")).isEqualTo("TestClientName2");
        assertThat(data.get("Decision Maker_email")).isEqualTo("TestClientEmail2");

        assertThat(data.get("Decision Maker_zip")).isNull();

        assertThat(data.get("tpa")).isEqualTo("Yes");
        assertThat(data.get("tpa_name_1")).isEqualTo("Tpa Name 1");

        // Uncomment for manual check
        Document<PDDocument> result = new PdfProcessor().build(TEMPLATE_ANTHEM_QUESTIONNAIRE, data);
        // FileOutputStream fos = new FileOutputStream("test-anthem-questionnaire.pdf");
        // result.getDocument().save(fos);
        result.getDocument().close();
        // fos.close();
    }
}
