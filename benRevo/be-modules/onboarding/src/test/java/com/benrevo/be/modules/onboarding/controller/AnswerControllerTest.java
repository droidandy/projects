package com.benrevo.be.modules.onboarding.controller;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AnswerDto;
import com.benrevo.common.enums.FormType;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.*;

import com.benrevo.data.persistence.repository.AnswerRepository;
import com.benrevo.data.persistence.repository.FormRepository;
import org.apache.commons.lang.RandomStringUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.benrevo.common.util.StreamUtils.mapToList;
import static com.benrevo.common.util.StreamUtils.mapToMap;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AnswerControllerTest extends AbstractControllerTest {
    private static final String ANSWERS_ENDPOINT_URI = "/v1/answers";

    @Autowired
    private AnswerController answerController;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private TestEntityHelper testEntityHelper;
    
    //SharedServiceApplication sharedServiceApplication;
    //@Autowired
    //private TokenAuthenticationService tokenAuthenticationService;

    @Before
    @Override
    public void init() {
        initController(answerController);
    }

    @Test
    public void testGetAnswerByClientId() throws Exception {
        Answer answer = testEntityHelper.createTestAnswer();
        token = createToken(answer.getClient().getBroker().getBrokerToken());
        Date date = new Date();
        answer.getClient().setDateFormSubmitted(date);
        Map<String, String> answers = new HashMap<>();
        answers.put(answer.getQuestion().getCode(), answer.getValue());

        AnswerDto dto = new AnswerDto();
        dto.setAnswers(answers);
        dto.setClientId(answer.getClient().getClientId());
        dto.setSubmittedDate(DateHelper.fromDateToString(date, Constants.DATETIME_FORMAT));
        dto.setMultiAnswers(new HashMap<>());

        performGetAndAssertResult(dto, ANSWERS_ENDPOINT_URI + "/{clientId}", answer.getClient().getClientId());
    }

    @Test
    public void testCreateAnswers() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        token = createToken(broker.getBrokerToken());

        List<Form> forms = (List<Form>) formRepository.findAll();
        Map<String, String> testAnswers = forms.stream().map(Form::getFormQuestions).flatMap(List::stream).map(FormQuestion::getQuestion).distinct().collect(Collectors
                .toMap(Question::getCode, question -> question.getVariants().size() > 0 ? question.getVariants().get(0).getOption() : RandomStringUtils.random(10, false, true)));

        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(client.getClientId());
        answerDto.setAnswers(testAnswers);

        String requestContent = jsonUtils.toJson(answerDto);

        mockMvc.perform(MockMvcRequestBuilders.put(ANSWERS_ENDPOINT_URI)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isCreated())
                .andReturn();

        //check if all answers were created
        List<Answer> answers = answerRepository.findByClientClientId(client.getClientId());
        Map<String, String> created = mapToMap(answers, answer -> answer.getQuestion().getCode(), Answer::getValue);
        assertTrue(testAnswers.size() == created.size());

        testAnswers.entrySet().forEach(entry -> {
            String key = entry.getKey();
            String value = entry.getValue();

            String createdValue = created.get(key);
            assertEquals(value, createdValue);
        });
    }

    @Test
    public void testUpdateAnswers() throws Exception {
        List<Form> forms = formRepository.findByNameIn(FormType.QUESTIONNAIRE.getMessage());
        Question randomQuestion = forms.stream().map(Form::getFormQuestions).flatMap(List::stream)
                .map(FormQuestion::getQuestion).filter(question -> question.getVariants().size() == 0).findAny().get();
        assertNotNull(randomQuestion);

        Client client = testEntityHelper.createTestClient();
        Answer answer = testEntityHelper.createTestAnswer(client, randomQuestion, "testValue");
        token = createToken(client.getBroker().getBrokerToken());

        String newValue = "test-" + RandomStringUtils.random(10, false, true);

        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(client.getClientId());
        answerDto.setAnswers(new HashMap<>());
        answerDto.getAnswers().put(answer.getQuestion().getCode(), newValue);

        String requestContent = jsonUtils.toJson(answerDto);

        mockMvc.perform(MockMvcRequestBuilders.put(ANSWERS_ENDPOINT_URI)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isCreated())
                .andReturn();

        //check if the answer was updated
        List<Answer> answers = answerRepository.findByClientClientId(client.getClientId());
        List<Answer> updated = answers.stream().filter(x -> x.getQuestion().getCode().equals(answer.getQuestion().getCode())).collect(Collectors.toList());
        assertNotNull(updated);
        assertEquals(1, updated.size());
        assertEquals(updated.get(0).getValue(), newValue);
    }

    @Test
    public void testUpdateSomeAnswers() throws Exception {
        String code1 = "testQuestion1";
        String code2 = "testQuestion2";
        String code3 = "testQuestion3";

        //create a new test form with 3 questions
        Question question1 = testEntityHelper.createTestQuestion(code1, code1, false);
        Question question2 = testEntityHelper.createTestQuestion(code2, code2, false);
        Question question3 = testEntityHelper.createTestQuestion(code3, code3, false);
        testEntityHelper.createTestForm("testForm", Arrays.asList(question1, question2, question3));

        String testAnswer1 = "testAnswer1";
        String testAnswer2 = "testAnswer2";

        Client client = testEntityHelper.createTestClient();

        //answer the 1st and the 2nd question
        Answer answer1 = testEntityHelper.createTestAnswer(client, question1, testAnswer1);
        testEntityHelper.createTestAnswer(client, question2, testAnswer2);

        token = createToken(client.getBroker().getBrokerToken());

        String newValue = "test-" + RandomStringUtils.random(10, false, true);

        //update the 2nd question
        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(client.getClientId());
        answerDto.setAnswers(new HashMap<>());
        answerDto.getAnswers().put(question2.getCode(), newValue);

        String requestContent = jsonUtils.toJson(answerDto);

        mockMvc.perform(MockMvcRequestBuilders.put(ANSWERS_ENDPOINT_URI)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isCreated())
                .andReturn();

        //find all answers of the client
        List<Answer> answers = answerRepository.findByClientClientId(client.getClientId());

        //check if the answer to question 1 wasn't removed or changed
        List<Answer> updated1 = answers.stream().filter(x -> x.getQuestion().getCode().equals(question1.getCode())).collect(Collectors.toList());
        assertNotNull(updated1);
        assertEquals(1, updated1.size());
        assertEquals(updated1.get(0).getValue(), answer1.getValue());

        //check if the answer to question 2 was updated
        List<Answer> updated2 = answers.stream().filter(x -> x.getQuestion().getCode().equals(question2.getCode())).collect(Collectors.toList());
        assertNotNull(updated2);
        assertEquals(1, updated2.size());
        assertEquals(updated2.get(0).getValue(), newValue);

        //check if the answer to question 3 wasn't added
        List<Answer> updated3 = answers.stream().filter(x -> x.getQuestion().getCode().equals(question3.getCode())).collect(Collectors.toList());
        assertNotNull(updated3);
        assertEquals(0, updated3.size());
    }

    @Test
    public void testUpdateMultiAnswers() throws Exception {
        String code1 = "testQuestion1";
        String code2 = "testQuestion2";

        String variant1 = "variant1";
        String variant2 = "variant2";
        String variant3 = "variant3";

        //create a new test form with 2 questions
        Question question1 = testEntityHelper.createTestQuestion(code1, code1, false);
        Question question2 = testEntityHelper.createTestQuestion(code2, code2, true, Arrays.asList(variant1, variant2, variant3)); //the question allows multi-answer
        testEntityHelper.createTestForm("testForm", Arrays.asList(question1, question2));

        String testAnswer1 = "testAnswer1";

        Client client = testEntityHelper.createTestClient();

        //create the answer for the 1st question
        Answer answer1 = testEntityHelper.createTestAnswer(client, question1, testAnswer1);

        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());

        //answer the 2nd questions with 2 values
        List<String> multiAnswers = Arrays.asList(variant2, variant3);

        //update the 2nd question
        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(client.getClientId());
        answerDto.setMultiAnswers(new HashMap<>());
        answerDto.getMultiAnswers().put(question2.getCode(), multiAnswers);

        String requestContent = jsonUtils.toJson(answerDto);

        mockMvc.perform(MockMvcRequestBuilders.put(ANSWERS_ENDPOINT_URI)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isCreated())
                .andReturn();

        //find all answers of the client
        List<Answer> answers = answerRepository.findByClientClientId(client.getClientId());

        //check if the answer to question 1 wasn't removed or changed
        List<Answer> updated1 = answers.stream().filter(x -> x.getQuestion().getCode().equals(question1.getCode())).collect(Collectors.toList());
        assertNotNull(updated1);
        assertEquals(1, updated1.size());
        assertEquals(updated1.get(0).getValue(), answer1.getValue());

        //check if the answer to question 2 was updated with 2 values: variant2 and variant3
        List<Answer> updated2 = answers.stream().filter(x -> x.getQuestion().getCode().equals(question2.getCode())).collect(Collectors.toList());
        assertNotNull(updated2);
        assertEquals(2, updated2.size());

        List<String> updated2Values = mapToList(updated2, Answer::getValue);
        multiAnswers.forEach(value -> {
            assertTrue(updated2Values.contains(value));
        });

        //check if the answer to question 2 wasn't updated with variant1
        assertTrue(!updated2Values.contains(variant1));
    }

    @Test
    public void testUpdateMultiAnswersWhenQuestionIsNotMultiSelectable() throws Exception {
        String code = "testQuestion";

        String variant1 = "variant1";
        String variant2 = "variant2";
        String variant3 = "variant3";

        //create a new test form with a multi-variant but non-multi-selectable question
        Question question = testEntityHelper.createTestQuestion(code, code, false, Arrays.asList(variant1, variant2, variant3)); //the question doesn't allow multi-answer
        testEntityHelper.createTestForm("testForm", Arrays.asList(question));

        Client client = testEntityHelper.createTestClient();

        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());

        //answer the question with 2 values
        List<String> multiAnswers = Arrays.asList(variant2, variant3);

        //update the 2nd question
        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(client.getClientId());
        answerDto.setMultiAnswers(new HashMap<>());
        answerDto.getMultiAnswers().put(question.getCode(), multiAnswers);

        String requestContent = jsonUtils.toJson(answerDto);
 
        mockMvc.perform(MockMvcRequestBuilders.put(ANSWERS_ENDPOINT_URI)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isBadRequest())
                .andReturn();
    }
 

}
