package com.benrevo.core.service.document;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;
import com.benrevo.be.modules.onboarding.service.email.report.Document;
import com.benrevo.be.modules.onboarding.service.email.report.PdfProcessor;
import com.benrevo.be.modules.onboarding.service.email.report.XSSFWorkbookProcessor;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.enums.FormType;
import com.benrevo.core.service.UHCEmployerApplicationDataService;
import com.benrevo.core.service.UHCQuestionnaireDataService;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Form;
import com.benrevo.data.persistence.entities.FormQuestion;
import com.benrevo.data.persistence.entities.Question;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.FormRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.assertj.core.util.Lists;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class UhcDocumentProcessorTest extends AbstractControllerTest  {

    private PdfProcessor pdfProcessor = new PdfProcessor();
    private XSSFWorkbookProcessor xssfWorkbookProcessor = new XSSFWorkbookProcessor();

    @Autowired
    private FormRepository formRepository;
    
    @Autowired
    private UHCEmployerApplicationDataService employerApplicationdataService;

    @Autowired
    private UHCQuestionnaireDataService dataService;

    private static final String TEMPLATE_GROUP_DOCUMENT = "/templates/uhc/postsales/employer-application.pdf";
    private static final String TEMPLATE_QUESTIONNAIRE = "/templates/uhc/postsales/questionnaire.xlsx";

    private List<String> employerApplicationMandatoryFields = Arrays.asList(
            "effective_date",
            "groups_legal_name",
            "general_information_address",
            "general_information_city",
            "general_information_state",
            "general_information_zip_code",
            "total_employees",
            "elligible_employees",
            "cobra_participants",
            "industry_sic_code",
            "number_of_hours_per_week_to_be_eligible",
            "first_of_month",
            "months_days_of_employment_following_date_of_hire"
    );
    
    @Override
        public void init() {
    	
    }

    @Test
    public void testBuildPdfSuccess() {
        String testString = "test";
        Form form = formRepository.findByName(FormType.EMPLOYER_APPLICATION.getMessage());
        Map<String, String> testAnswers = new HashMap<>();
        form.getFormQuestions().stream().filter(x -> !x.isInvisible()).forEach(formQuestion -> {
            testAnswers.putIfAbsent(formQuestion.getQuestion().getCode(), formQuestion.getQuestion().getVariants().size() > 0 ? formQuestion.getQuestion().getVariants().get(0).getOption() : testString);
        });

        //add fields from rfp and on-boarding
        employerApplicationMandatoryFields.forEach(x -> {
            testAnswers.put(x, testString);
        });

        Document<PDDocument> result = pdfProcessor.build(TEMPLATE_GROUP_DOCUMENT, testAnswers);
        assertNotNull(result);

        PDDocumentCatalog docCatalog = result.getDocument().getDocumentCatalog();
        PDAcroForm acroForm = docCatalog.getAcroForm();
        testAnswers.keySet().forEach(key -> {
            assertNotNull("Cannot find field with key -> " + key, acroForm.getField(key));
            assertEquals("Wrong value for field with key -> " + key, acroForm.getField(key).getValueAsString(), testAnswers.get(key));
        });

        if (result.getDocument() != null) {
            try {
                result.getDocument().close();
            } catch (IOException e) {
                fail("Can't close the pdf");
            }
        }
    }

    @Autowired
    private RfpRepository rfpRepository;

    @Test
    public void testBuildXlsxSuccess() {
        Form form = formRepository.findByName(FormType.QUESTIONNAIRE.getMessage());
        Map<String, String> testAnwsers = form.getFormQuestions().stream().map(FormQuestion::getQuestion).distinct().collect(Collectors.toMap(
                Question::getCode, question -> question.getVariants().size() > 0 ? question.getVariants().get(0).getOption() : "test"));

        Document<XSSFWorkbook> result = xssfWorkbookProcessor.build(TEMPLATE_QUESTIONNAIRE, testAnwsers);
        assertNotNull(result);

        rfpRepository.findByClientClientIdAndRfpIdIn(1L, Lists.emptyList());
    }
    
    @Test
    public void buildEmployerApplication() throws Exception {

        RFP medicalRfp = testEntityHelper.createTestRFP();

        // 1 test
        medicalRfp.setWaitingPeriod("1st of the month following 30 days from date of hire");
        Map<String, String> answers = employerApplicationdataService.getData(medicalRfp.getClient());
        assertThat(answers.get("waiting_period_for_new_hires")).isEqualTo("First Of The Month");
        assertThat(answers.get("first_of_month")).isEqualTo("30 days");

        // 2 test
        medicalRfp.setWaitingPeriod("2 months from date of hire");
        answers = employerApplicationdataService.getData(medicalRfp.getClient());
        assertThat(answers.get("waiting_period_for_new_hires")).isEqualTo("Amount of days");
        assertThat(answers.get("months_days_of_employment_following_date_of_hire")).isEqualTo("2 months");

        // 3 test
        medicalRfp.setWaitingPeriod("Date of hire");
        answers = employerApplicationdataService.getData(medicalRfp.getClient());
        assertThat(answers.get("waiting_period_for_new_hires")).isEqualTo("Date of Hire No Waiting Period");
        assertThat(answers.get("months_days_of_employment_following_date_of_hire")).isNull();
        assertThat(answers.get("first_of_month")).isNull();
        
        Document<PDDocument> result = new PdfProcessor().build(TEMPLATE_GROUP_DOCUMENT, answers);
        //java.io.FileOutputStream fos = new java.io.FileOutputStream("test-uhc-employer-application.pdf");
        //result.getDocument().save(fos);
        result.getDocument().close();
        //fos.close();
        
    }

    @Test
    public void testBuildQuestionnaire() throws IOException {
    
    Client client = testEntityHelper.createTestClient();

    Form form = formRepository.findByName(FormType.QUESTIONNAIRE.getMessage());

    for (FormQuestion fq : form.getFormQuestions()) {
        Question question = fq.getQuestion();
        if (question.getCode().equals("initial_eligibility_transmission_option")) {
            testEntityHelper.createTestAnswer(client, question, "Excel spreadsheet / xTool (Standard)");
        } else if (question.getCode().equals("subsequent_eligibility_transmission_option")) {
            testEntityHelper.createTestAnswer(client, question, "Enrollment Forms");
        }    
    }

    Map<String, String> testAnswers = dataService.getData(client);

    assertThat(testAnswers.get("type_of_eligibility_transmission_1")).isEqualTo("Excel spreadsheet / xTool (Standard)");
    assertThat(testAnswers.get("type_of_eligibility_transmission_4")).isEqualTo("Enrollment Forms");

    Document<XSSFWorkbook> result = xssfWorkbookProcessor.build(TEMPLATE_QUESTIONNAIRE, testAnswers);
    assertNotNull(result);

    //java.io.FileOutputStream fos = new java.io.FileOutputStream("test-uhc-questionnaire.xlsx");
    //result.getDocument().write(fos);
    result.getDocument().close();
    //fos.close();
    }

}
