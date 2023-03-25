package com.benrevo.be.modules.onboarding.controller;


import com.benrevo.be.modules.onboarding.service.document.DocumentDataContext;
import com.benrevo.be.modules.onboarding.service.email.report.Document;
import com.benrevo.be.modules.onboarding.service.email.report.PdfProcessor;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.FormType;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.AnswerRepository;
import com.benrevo.data.persistence.repository.FormRepository;
import org.apache.commons.io.FileUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDField;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.util.*;

import static com.benrevo.common.util.StreamUtils.mapToList;
import static com.benrevo.common.util.StreamUtils.mapToMap;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static java.util.stream.Collectors.toList;
import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

public abstract class PostSalesControllerTest extends AbstractControllerTest{

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private DocumentDataContext documentDataContext;

    @Autowired
    private AnswerRepository answerRepository;

    @Test
    public void postsales() throws Exception {

        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        testEntityHelper.createTestRFPs(client);

        RfpQuote rfpQuote1 = testEntityHelper.createTestRfpQuote(client, "OTHER", Constants.MEDICAL);
        RfpQuoteNetwork rqn1 = testEntityHelper.createTestQuoteNetwork(rfpQuote1, "HMO");
        RfpQuoteNetworkPlan rqnp1 = testEntityHelper.createTestRfpQuoteNetworkPlan("test HMO plan", rqn1, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqo1 = testEntityHelper.createTestRfpQuoteOption(rfpQuote1, "optionName");
        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo1, rqn1, rqnp1, null, 10L, 15L, 20L, 25L, "PERCENT", 91f, 92f, 93f, 94f);

        RfpQuote dentalRfpQuote = testEntityHelper.createTestRfpQuote(client, "OTHER", Constants.DENTAL);
        RfpQuoteOption dentalRqo = testEntityHelper.createTestRfpQuoteOption(dentalRfpQuote, "optionName");

        RfpQuoteNetwork dhmoRqn = testEntityHelper.createTestQuoteNetwork(dentalRfpQuote, "DHMO");
        
        RfpQuoteNetworkPlan rqnp2 = testEntityHelper.createTestRfpQuoteNetworkPlan("Test DHMO plan", dhmoRqn, 100f, 120f, 140f, 160f);
        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalRqo, dhmoRqn, rqnp2, null, 10L, 15L, 20L, 25L, "PERCENT", 95f, 96f, 97f, 98f);

        RfpQuoteNetworkPlan rqnp3 = testEntityHelper.createTestRfpQuoteNetworkPlan("Test DHMO plan Voluntary", dhmoRqn, 100f, 120f, 140f, 160f);
        rqnp3.setVoluntary(true);
        RfpQuoteOptionNetwork rqon3 = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalRqo, dhmoRqn, rqnp3, null, 10L, 15L, 20L, 25L, "PERCENT", 95.1f, 96.1f, 97.1f, 98.1f);

        RfpQuoteNetwork dppoRqn = testEntityHelper.createTestQuoteNetwork(dentalRfpQuote, "DPPO");
        
        RfpQuoteNetworkPlan rqnp4 = testEntityHelper.createTestRfpQuoteNetworkPlan("Test DPPO plan", dppoRqn, 100f, 120f, 140f, 160f);
        RfpQuoteOptionNetwork rqon4 = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalRqo, dppoRqn, rqnp4, null, 10L, 15L, 20L, 25L, "PERCENT", 95.2f, 96.2f, 97.2f, 98.2f);

        RfpQuoteNetworkPlan rqnp5 = testEntityHelper.createTestRfpQuoteNetworkPlan("Test DPPO plan Voluntary", dppoRqn, 100f, 120f, 140f, 160f);
        rqnp5.setVoluntary(true);
        RfpQuoteOptionNetwork rqon5 = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalRqo, dppoRqn, rqnp5, null, 10L, 15L, 20L, 25L, "PERCENT", 95.3f, 96.3f, 97.3f, 98.3f);

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
            //FileUtils.writeByteArrayToFile(new File("postsalesTest-" + attach.getFileName()), attach.getContent());
        }
        
        MailDto mailDto = mailCaptor.getValue();
        assertThat(mailDto.getSubject()).contains(client.getClientName());
        assertThat(mailDto.getContent()).contains(client.getClientName());
        assertThat(mailDto.getContent()).containsIgnoringCase("On-boarding");
        
        // uncomment for manual testing
        //FileUtils.writeByteArrayToFile(new File("postsalesTest-mail.html"), mailDto.getContent().getBytes());

    }

    protected void testPdfForm(Client client, FormType formType, String path) throws Exception {
        List<Form> forms = formRepository.findByNameIn(formType.getMessage());

        assertEquals(1, forms.size());

        //get pdf form and extract answers
        Form form = forms.get(0);
        List<Question> questions = form.getFormQuestions().stream().filter(x -> !x.isInvisible()).map(FormQuestion::getQuestion).collect(toList());

        createTestProductSelectionData(client);

        //get answers not form answer table (they are already in db in other tables)
        Map<String, String> data = documentDataContext.getData(client, formType);
        List<Question> filtered = questions.stream().filter(x -> !data.keySet().contains(x.getCode())).collect(toList());

        //build random answers
        Random random = new Random();
        Map<String, String> testAnswers = mapToMap(filtered, Question::getCode,
                question -> question.getVariants().size() > 0 ? question.getVariants().get(0).getOption() : String.valueOf(random.nextLong()));

        Map<String, Answer> answerMap = mapToMap(filtered, Question::getCode, x -> testEntityHelper.buildTestAnswer(client, x, testAnswers.get(x.getCode())));
        answerRepository.save(answerMap.values());
        flushAndClear();
        //---------------

        token = createToken(client.getBroker().getBrokerToken());

        //request the employer application form
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get(path)
                .param("clientId", client.getClientId().toString())
                .param("formName", form.getName())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF_VALUE))
                .andReturn();
        byte[] pdf = result.getResponse().getContentAsByteArray();
        //----------------

        //load and populate pdf
        PdfProcessor pdfProcessor = new PdfProcessor();
        Document<PDDocument> document = pdfProcessor.load(new ByteArrayInputStream(pdf));
        document = pdfProcessor.build(document, testAnswers);

        //assert data
        PDDocumentCatalog docCatalog = document.getDocument().getDocumentCatalog();
        PDAcroForm acroForm = docCatalog.getAcroForm();

        List<PDField> fieldList = acroForm.getFields();
        List<String> fieldNames = mapToList(fieldList, PDField::getFullyQualifiedName);

        Map<String, String> allData = documentDataContext.getData(client, formType);

        List<String> successFields = new ArrayList<>();
        fieldNames.stream().filter(Objects::nonNull).forEach(fieldName -> {
            String value = allData.get(fieldName);
            PDField field = acroForm.getField(fieldName);

            assertNotNull(field);

            if(allData.containsKey(fieldName) && value != null) {
                assertTrue(field.getValueAsString().contains(value));
                successFields.add(fieldName);
            } else if (allData.containsKey(fieldName) && value == null) {
                if (field.getValueAsString() != null) {
                    fail("field assertion failed: " + fieldName);
                }
            }
        });
        assertEquals(successFields.size(), allData.size());

        if (document.getDocument() != null) {
            try {
                document.getDocument().close();
            } catch (IOException e) {
                fail("Can't close the pdf");
            }
        }
    }


    protected void createTestProductSelectionData(Client client) throws Exception {
        // prepare options to Final Selection (used in "Page 3" of generated document)
        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        RfpQuoteOption dentalOption = testEntityHelper.createTestRfpQuoteOption(dentalQuote, "dental option");
        testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);

        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
        RfpQuoteOption visionOption = testEntityHelper.createTestRfpQuoteOption(visionQuote, "vision option");
        testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        flushAndClear();
    }
}
