package com.benrevo.core.service.document;

import com.benrevo.be.modules.onboarding.service.email.report.Document;
import com.benrevo.be.modules.onboarding.service.email.report.PdfProcessor;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.enums.FormType;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.data.persistence.entities.Form;
import com.benrevo.data.persistence.repository.FormRepository;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;


@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class AnthemDocumentProcessorTest extends AbstractControllerTest  {
	
    private PdfProcessor pdfProcessor = new PdfProcessor();

    @Autowired
    private FormRepository formRepository;

    private static final String TEMPLATE_QUESTIONNAIRE = "/templates/anthem_blue_cross/postsales/anthem-questionnaire.pdf";
    private static final String TEMPLATE_EMPLOYER_APPLICATION = "/templates/anthem_blue_cross/postsales/anthem-employer-application.pdf";

    @Override
    public void init(){
    }
    
    @Test
    @Ignore
    public void testAnthemQuestionnairePDFGeneration() throws Exception {
        Form form = formRepository.findByName(FormType.ANTHEM_QUESTIONNAIRE.getMessage());
        Map<String, String> testAnswers = new HashMap<>();
        form.getFormQuestions().stream().filter(x -> !x.isInvisible()).forEach(formQuestion -> {
            String code = formQuestion.getQuestion().getCode();
            if (formQuestion.getQuestion().isMultiselectable()) {
            	code = formQuestion.getQuestion().getVariants().get(0).getAlias();
            }
        	testAnswers.putIfAbsent(code, formQuestion.getQuestion().getVariants().size() > 0 ? formQuestion.getQuestion().getVariants().get(0).getOption() : "test");
        });
        
        Document<PDDocument> result = pdfProcessor.build(TEMPLATE_QUESTIONNAIRE, testAnswers);
        assertNotNull(result);

        PDDocumentCatalog docCatalog = result.getDocument().getDocumentCatalog();
        PDAcroForm acroForm = docCatalog.getAcroForm();
        testAnswers.keySet().forEach(key -> {
            assertNotNull("Cannot find field with key -> " + key, acroForm.getField(key));
            assertEquals("Wrong value for field with key -> " + key, acroForm.getField(key).getValueAsString(), testAnswers.get(key));
        });

    	ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        result.getDocument().save(byteArrayOutputStream);
//        File pdf = new File("test-anthem-questionnaire.pdf");
//        FileUtils.writeByteArrayToFile(pdf, byteArrayOutputStream.toByteArray());
        result.getDocument().close();
    }
    
    @Test
    public void testAnthemEmployerApplicationPDFGeneration() throws Exception {
        Form form = formRepository.findByName(FormType.ANTHEM_EMPLOYER_APPLICATION.getMessage());
        Map<String, String> testAnswers = new HashMap<>();
        form.getFormQuestions().stream().filter(x -> !x.isInvisible()).forEach(formQuestion -> {
            String code = formQuestion.getQuestion().getCode();
            if (formQuestion.getQuestion().isMultiselectable()) {
                code = formQuestion.getQuestion().getVariants().get(0).getAlias();
            }
            testAnswers.putIfAbsent(code, formQuestion.getQuestion().getVariants().size() > 0 ? formQuestion.getQuestion().getVariants().get(0).getOption() : "test");
        });
        
        Document<PDDocument> result = pdfProcessor.build(TEMPLATE_EMPLOYER_APPLICATION, testAnswers);
        assertNotNull(result);

        PDDocumentCatalog docCatalog = result.getDocument().getDocumentCatalog();
        PDAcroForm acroForm = docCatalog.getAcroForm();
        testAnswers.keySet().forEach(key -> {
            assertNotNull("Cannot find field with key -> " + key, acroForm.getField(key));
            String expectedValue = acroForm.getField(key).getValueAsString();
            if (expectedValue.startsWith("[")) { // truncate [] from "combobox type" values
              expectedValue = expectedValue.substring(1, expectedValue.length() - 1);
            }
            assertEquals("Wrong value for field with key -> " + key, expectedValue, testAnswers.get(key));
        });

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        result.getDocument().save(byteArrayOutputStream);
//        File pdf = new File("test-anthem-employer-application.pdf");
//        FileUtils.writeByteArrayToFile(pdf, byteArrayOutputStream.toByteArray());
        result.getDocument().close();
    }
}
