package com.benrevo.core.service.document.impl;

import static org.assertj.core.api.Assertions.assertThat;
import com.benrevo.be.modules.onboarding.service.document.DocumentDataContext;
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
public class AnthemCommonOwershipDataServiceImplTest extends AbstractControllerTest {

    private static final String TEMPLATE_ANTHEM_COMMON_OWNERSHIP =
            "/templates/anthem_blue_cross/postsales/anthem-common-ownership.pdf";

    @Autowired
    private DocumentDataContext documentDataContext;

    @Autowired
    private TestEntityHelper testEntityHelper;

    @Autowired
    private FormRepository formRepository;

    @Test
    public void testData() throws Exception {

        Client client = testEntityHelper.createTestClient();

        Form form = formRepository.findByName(FormType.ANTHEM_COMMON_OWNERSHIP.getMessage());

        assertThat(form).isNotNull();
        
        for (FormQuestion fq : form.getFormQuestions()) {
            Question question = fq.getQuestion();
            String code = question.getCode();
            if (code.startsWith("affiliated_company_name")) {
                testEntityHelper.createTestAnswer(client, question,
                        "Affiliated Company Name " + code.substring(24));
            } else if (code.startsWith("affiliated_company_address")) {
                testEntityHelper.createTestAnswer(client, question,
                        "Affiliated Company Address " + code.substring(27));
            } else if (code.startsWith("affiliated_company_ein")) {
                testEntityHelper.createTestAnswer(client, question,
                        "12345678" + code.substring(23));
            } else if (code.equals("affiliated_firms_quantity")) {
                testEntityHelper.createTestAnswer(client, question, "10");
            }
        }

        Map<String, String> data = documentDataContext.getData(client, FormType.ANTHEM_COMMON_OWNERSHIP);

        assertThat(data.get("affiliated_company_ein_1")).isEqualTo("123456781");
        assertThat(data.get("affiliated_company_ein_10")).isEqualTo("1234567810");
        assertThat(data.get("affiliated_company_name_and_address_1")).isEqualTo("Affiliated Company Name 1 Affiliated Company Address 1");
        assertThat(data.get("affiliated_company_name_and_address_10")).isEqualTo("Affiliated Company Name 10 Affiliated Company Address 10");
        
        // Uncomment for manual check
        Document<PDDocument> result = new PdfProcessor().build(TEMPLATE_ANTHEM_COMMON_OWNERSHIP, data);
        //FileOutputStream fos = new FileOutputStream("test-anthem-common-ownership.pdf");
        //result.getDocument().save(fos);
        //result.getDocument().close();
        //fos.close();
    }
}
