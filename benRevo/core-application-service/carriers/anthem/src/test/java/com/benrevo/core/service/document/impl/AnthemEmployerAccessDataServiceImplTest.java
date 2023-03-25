package com.benrevo.core.service.document.impl;

import static org.assertj.core.api.Assertions.assertThat;
import com.benrevo.be.modules.onboarding.service.document.DocumentDataContext;
import com.benrevo.be.modules.onboarding.service.email.report.Document;
import com.benrevo.be.modules.onboarding.service.email.report.PdfProcessor;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.enums.FormType;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Form;
import com.benrevo.data.persistence.entities.FormQuestion;
import com.benrevo.data.persistence.entities.Question;
import com.benrevo.data.persistence.repository.FormRepository;
import java.io.ByteArrayOutputStream;
import java.util.Map;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class AnthemEmployerAccessDataServiceImplTest extends AbstractControllerTest {

    private static final String TEMPLATE_ANTHEM_EMPLOYER_ACCESS =
            "/templates/anthem_blue_cross/postsales/anthem-employer-access.pdf";

    @Autowired
    private DocumentDataContext documentDataContext;

    @Autowired
    private TestEntityHelper testEntityHelper;

    @Autowired
    private FormRepository formRepository;

    @Test
    public void testData() throws Exception {

        Client client = testEntityHelper.createTestClient();

        Form form = formRepository.findByName(FormType.ANTHEM_EMPLOYER_ACCESS.getMessage());

        assertThat(form).isNotNull();
        
        for (FormQuestion fq : form.getFormQuestions()) {
            Question question = fq.getQuestion();
            if (question.getCode().equals("contact_name_5")) {
                testEntityHelper.createTestAnswer(client, question, "User Name");
            } else if (question.getCode().equals("contact_email_5")) {
                testEntityHelper.createTestAnswer(client, question, "User@Email.test");
            } else if (question.getCode().equals("contact_email_type_5")) {
                //testEntityHelper.createTestAnswer(client, question, "Personal Company's email");
                testEntityHelper.createTestAnswer(client, question, "Company's General email");
            } else if (question.getCode().equals("contact_user_is_5")) {
                testEntityHelper.createTestAnswer(client, question, 
                        "An employee of the Group and responsible for the administration of the Group's employee benefit plan");
                //testEntityHelper.createTestAnswer(client, question, "the Group's Third Party Administrator / Broker");
            } else if (question.getCode().equals("contact_city_5")) {
                testEntityHelper.createTestAnswer(client, question, "City");
            } else if (question.getCode().equals("contact_address_5")) {
                testEntityHelper.createTestAnswer(client, question, "Address, 000, 0");
            } else if (question.getCode().equals("contact_state_5")) {
                testEntityHelper.createTestAnswer(client, question, "State");
            } else if (question.getCode().equals("contact_zip_5")) {
                testEntityHelper.createTestAnswer(client, question, "00000");
            } else if (question.getCode().equals("contact_phone_5")) {
                testEntityHelper.createTestAnswer(client, question, "(555) 1234567");
            } else if (question.getCode().equals("contact_role_5")) {
                testEntityHelper.createTestAnswer(client, question, "Anthem Employer access administrator");
            } else if (question.getCode().equals("contact_counter")) {
                testEntityHelper.createTestAnswer(client, question, "5");
            }
        }

        Map<String, String> data = documentDataContext.getData(client, FormType.ANTHEM_EMPLOYER_ACCESS);

        assertThat(data.get("Anthem Employer access administrator_name")).isEqualTo("User Name");
        assertThat(data.get("Anthem Employer access administrator_email_type")).isEqualTo("Company's General email");
        assertThat(data.get("Anthem Employer access administrator_address")).isEqualTo("Address, 000, 0");
        assertThat(data.get("Anthem Employer access administrator_phone")).isEqualTo("(555) 1234567");
        assertThat(data.get("Anthem Employer access administrator_user_is"))
            .isEqualTo("An employee of the Group and responsible for the administration of the Group's employee benefit plan");
        assertThat(data.get("Anthem Employer access administrator_city_state_zip"))
            .isEqualTo("City, State, 00000");

        Document<PDDocument> result = new PdfProcessor().build(TEMPLATE_ANTHEM_EMPLOYER_ACCESS, data);
        ByteArrayOutputStream baos = new ByteArrayOutputStream(); 
        result.getDocument().save(baos);
        result.getDocument().close();
        
        assertThat(baos.size()).isGreaterThan(0);
        
        // Uncomment for manual check
        //FileOutputStream fos = new FileOutputStream("test-anthem-employer-access.pdf");
        //baos.writeTo(fos);
        //fos.close();
    }
}
