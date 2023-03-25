package com.benrevo.core.api;

import static com.benrevo.common.util.StreamUtils.mapToMap;
import static java.util.stream.Collectors.toList;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import com.benrevo.be.modules.onboarding.controller.PostSalesController;
import com.benrevo.be.modules.onboarding.controller.PostSalesControllerTest;
import com.benrevo.be.modules.onboarding.service.email.report.Document;
import com.benrevo.be.modules.onboarding.service.email.report.XSSFWorkbookProcessor;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.FormType;
import com.benrevo.core.UHCCoreServiceApplication;
import com.benrevo.core.service.UHCQuestionnaireDataService;
import com.benrevo.data.persistence.entities.Answer;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Form;
import com.benrevo.data.persistence.entities.FormQuestion;
import com.benrevo.data.persistence.entities.Question;
import com.benrevo.data.persistence.repository.AnswerRepository;
import com.benrevo.data.persistence.repository.FormRepository;
import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.stream.IntStream;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest(classes = UHCCoreServiceApplication.class)
public class UHCPostSalesControllerTest extends PostSalesControllerTest {
    private static final String QUESTIONNAIRE_ENDPOINT_URI = "/v1/files/questionnaire";
    private static final String EMPLOYER_APPLICATION_ENDPOINT_URI = "/v1/files/employer-application";

    @Autowired
    private PostSalesController postSalesController;

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private UHCQuestionnaireDataService uhcQuestionnaireDataService;

    @Before
    @Override
    public void init() {
        initController(postSalesController);
    }

    @Test
    public void testGetQuestionnaire() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Form form = testEntityHelper.createTestForm();

        token = createToken(client.getBroker().getBrokerToken());
        mockMvc.perform(MockMvcRequestBuilders.get(QUESTIONNAIRE_ENDPOINT_URI)
                .param("clientId", client.getClientId().toString())
                .param("formName", form.getName())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(Constants.HTTP_HEADER_CONTENT_TYPE_XLSX))
                .andReturn();
    }

    @Test
    public void testGetEmployerApplication() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Form form = testEntityHelper.createTestForm();

        token = createToken(client.getBroker().getBrokerToken());
        createTestProductSelectionData(client);

        mockMvc.perform(MockMvcRequestBuilders.get(EMPLOYER_APPLICATION_ENDPOINT_URI)
                .param("clientId", client.getClientId().toString())
                .param("formName", form.getName())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF_VALUE))
                .andReturn();
    }

    @Test
    public void testUHCEmployerApplication() throws Exception {
        Client client = testEntityHelper.createTestClient();
        createTestProductSelectionData(client);
        testPdfForm(client, FormType.EMPLOYER_APPLICATION, EMPLOYER_APPLICATION_ENDPOINT_URI);
    }

    @Test
    public void testUHCQuestionnaire() throws Exception {
        Client client = testEntityHelper.createTestClient();
        List<Form> forms = formRepository.findByNameIn(FormType.QUESTIONNAIRE.getMessage());

        assertEquals(1, forms.size());

        //get uhc employer application form and extract answers
        Form form = forms.get(0);
        List<Question> questions = form.getFormQuestions().stream().filter(x -> !x.isInvisible()).map(FormQuestion::getQuestion).collect(toList());

        //get answers not form answer table (they are already in db in other tables)
        Map<String, String> data = uhcQuestionnaireDataService.getData(client);
        List<Question> filtered = questions.stream().filter(x -> !data.keySet().contains(x.getCode())).collect(toList());

        //build random answers
        Random random = new Random();
        String prefix = "testxlsx-";
        Map<String, String> testAnswers = mapToMap(filtered, Question::getCode,
                question -> question.getVariants().size() > 0 ? question.getVariants().get(0).getOption() : prefix + String.valueOf(random.nextLong()));

        Map<String, Answer> answerMap = mapToMap(filtered, Question::getCode, x -> testEntityHelper.buildTestAnswer(client, x, testAnswers.get(x.getCode())));
        answerRepository.save(answerMap.values());
        flushAndClear();
        //---------------

        Map<String, String> answerCodeMap = new HashMap<>();
        answerMap.entrySet().stream()
                .filter(x -> x.getValue().getQuestion().getVariants() == null || x.getValue().getQuestion().getVariants().size() == 0)
                .forEach(entry -> {
            answerCodeMap.put(entry.getValue().getValue(), entry.getKey());
        });

        token = createToken(client.getBroker().getBrokerToken());

        //request the employer application form
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get(QUESTIONNAIRE_ENDPOINT_URI)
                .param("clientId", client.getClientId().toString())
                .param("formName", form.getName())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(Constants.HTTP_HEADER_CONTENT_TYPE_XLSX))
                .andReturn();
        byte[] xlsx = result.getResponse().getContentAsByteArray();
        //----------------

        //load and populate xlsx
        XSSFWorkbookProcessor xssfWorkbookProcessor = new XSSFWorkbookProcessor();
        Document<XSSFWorkbook> document = xssfWorkbookProcessor.load(new ByteArrayInputStream(xlsx));
        document = xssfWorkbookProcessor.build(document, testAnswers);

        Map<String, String> allData = uhcQuestionnaireDataService.getData(client);
        List<String> textFieldAnswers = allData.values().stream().filter(x -> x.contains(prefix)).collect(toList());


        int pageCount = document.getDocument().getNumberOfSheets();
        final Document<XSSFWorkbook> finalDocument = document;

        final List<String> answersFound = new ArrayList<>();
        IntStream.range(0, pageCount).forEach(sheetIndex -> {
            XSSFSheet xssfSheet = finalDocument.getDocument().getSheetAt(sheetIndex);

            int firstRowIndex = xssfSheet.getFirstRowNum();
            int lastRowIndex = xssfSheet.getLastRowNum();
            IntStream.range(firstRowIndex, lastRowIndex).forEach(rowIndex -> {
                XSSFRow xssfRow = xssfSheet.getRow(rowIndex);

                int firstCellIndex = xssfRow.getFirstCellNum();
                int lastCellIndex = xssfRow.getLastCellNum();
                IntStream.range(firstCellIndex, lastCellIndex).forEach(cellIndex -> {
                    XSSFCell xssfCell = xssfRow.getCell(cellIndex);

                    if(xssfCell.getCellTypeEnum() == CellType.STRING) {
                        StringBuilder value = new StringBuilder(xssfCell.getStringCellValue());
                        if (value.toString().contains(prefix)) {
                            if (value.toString().contains(",")) {
                                Arrays.stream(value.toString().split(",")).forEach(s -> {
                                    answersFound.add(s.trim());
                                });
                            } else if (value.toString().contains(":")) {
                                answersFound.add(value.toString().split(": ")[1]);
                            } else {
                                answersFound.add(value.toString());
                            }
                        }
                    }
                });
            });
        });

        textFieldAnswers.forEach(x -> {
            assertTrue("The answer is not found for key: " + findKey(x, answerCodeMap), answersFound.contains(x));
        });
    }

    private String findKey(String valuePart, Map<String, String> answerCodeMap) {
        Optional<Map.Entry<String, String>> entry = answerCodeMap.entrySet().stream().filter(x -> x.getKey().contains(valuePart)).findAny();
        return entry.isPresent() ? entry.get().getValue() : null;
    }
}
