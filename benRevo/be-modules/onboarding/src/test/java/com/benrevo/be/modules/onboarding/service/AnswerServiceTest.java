package com.benrevo.be.modules.onboarding.service;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.AnswerDto;
import com.benrevo.common.enums.FormType;
import com.benrevo.common.exception.ValidationException;
import com.benrevo.data.persistence.entities.Answer;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Form;
import com.benrevo.data.persistence.entities.FormQuestion;
import com.benrevo.data.persistence.entities.Question;
import com.benrevo.data.persistence.repository.AnswerRepository;
import com.benrevo.data.persistence.repository.FormRepository;
import com.google.common.base.CharMatcher;
import com.google.common.collect.Iterables;
import com.benrevo.common.exception.BaseException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AnswerServiceTest extends AbstractControllerTest {
    @Autowired
    private AnswerService answerService;
    @Autowired
    private FormRepository formRepository;
    @Autowired
    private AnswerRepository answerRepository;

    private Client testClient;
    private Broker testBroker;
    private Map<String, String> testAnswers = new HashMap<>();

    @Before
    public void setUp() {
        List<Form> forms = formRepository.findByNameIn(FormType.QUESTIONNAIRE.getMessage(), FormType.EMPLOYER_APPLICATION.getMessage(), FormType.EMPLOYER_APPLICATION_OTHER.getMessage());
        forms.forEach(form -> testAnswers.putAll(buildTestAnswers(form)));
        testBroker = testEntityHelper.createTestBroker();
        testClient = testEntityHelper.createTestClient("testClient", testBroker);

        Authentication authentication = mock(Authentication.class);
        // Mockito.whens() for your authorization object
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getDetails()).thenReturn(testBroker.getBrokerId());
        SecurityContextHolder.setContext(securityContext);
    }
    
    @After
    public void cleanUp() {
        SecurityContextHolder.clearContext();
    }

    private Map<String, String> buildTestAnswers(Form form) {
        return form.getFormQuestions().stream().map(FormQuestion::getQuestion).distinct().collect(Collectors
                .toMap(Question::getCode, question -> question.getVariants().size() > 0 ? question.getVariants().get(0).getOption() : "test"));
    }

    @Test
    public void createOrUpdate() throws Exception {
        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(testClient.getClientId());
        answerDto.setAnswers(testAnswers);
        answerService.createOrUpdate(answerDto);
    }
    
    @Test
    public void createOrUpdate_ControlCharsRemoving() throws Exception {
        AnswerDto createDto = new AnswerDto();
        createDto.setClientId(testClient.getClientId());
        
        final String TEST_ANSWER_KEY = Iterables.getFirst(testAnswers.keySet(), "anyKey");

        char controlChar = 0x0009; // U+0009 ('controlHT')
        
        Map<String, String> answers = new HashMap<>();
        answers.put(TEST_ANSWER_KEY, testAnswers.get(TEST_ANSWER_KEY) + controlChar);
        createDto.setAnswers(answers);
        answerService.createOrUpdate(createDto);
        
        AnswerDto getDto = answerService.getAnswers(testClient.getClientId());
        
        assertNotEquals(answers.get(TEST_ANSWER_KEY), getDto.getAnswers().get(TEST_ANSWER_KEY));
        assertEquals(CharMatcher.JAVA_ISO_CONTROL.removeFrom(answers.get(TEST_ANSWER_KEY)), getDto.getAnswers().get(TEST_ANSWER_KEY)); 
    }

    @Test
    public void createOrUpdateWrongClient() throws Exception {
        Client client = testEntityHelper.createTestClient();
        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(client.getClientId());
        answerDto.setAnswers(testAnswers);
        try {
            answerService.createOrUpdate(answerDto);
            fail("Expected BaseException");
        } catch (BaseException e) {
            assertFalse(e.getMessage().isEmpty());
        }

        answerDto.setClientId(3847598379458734589L);
        try {
            answerService.createOrUpdate(answerDto);
            fail("Expected ValidationException");
        } catch (ValidationException e) {
            assertFalse(e.getMessage().isEmpty());
        }
    }

    @Test
    public void createOrUpdateWrongQuestionOrAnswer() {
        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(testClient.getClientId());
        answerDto.setAnswers(testAnswers);
        testAnswers.put("local_living_wage_law", "test_value_which_not_a_variant");
        try {
            answerService.createOrUpdate(answerDto);
            fail("Expected BaseException");
        } catch (ValidationException e) {
            assertFalse(e.getMessage().isEmpty());
        }
        testAnswers.remove("local_living_wage_law");
        testAnswers.put("new_test_key_which_not_a_question", "testValue");
        try {
            answerService.createOrUpdate(answerDto);
            fail("Expected BaseException");
        } catch (BaseException e) {
            assertFalse(e.getMessage().isEmpty());
        }
    }

    @Test
    public void testAutoclearAnswersOnCreate() {
        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(testClient.getClientId());
        answerDto.setAnswers(testAnswers);
        answerService.createOrUpdate(answerDto);
        List<Answer> answers = answerRepository.findByClientClientId(testClient.getClientId());
        assertEquals(answerDto.getAnswers().keySet().size(), answers.size());

        answerService.createOrUpdate(answerDto);
        answers = answerRepository.findByClientClientId(testClient.getClientId());
        assertEquals(answerDto.getAnswers().keySet().size(), answers.size());
    }

    @Test
    public void getAnswers() throws Exception {
        Answer answer = new Answer();
        answer.setClient(testClient);
        answer.setQuestion(formRepository.findByName(FormType.EMPLOYER_APPLICATION.getMessage()).getFormQuestions().get(0).getQuestion());

        answer.setValue("testValue");
        AnswerDto answers = answerService.getAnswers(testClient.getClientId());

        assertEquals(0, answers.getAnswers().size());

        answerRepository.save(answer);

        answers = answerService.getAnswers(testClient.getClientId());
        assertNotNull(answers);
        assertEquals(1, answers.getAnswers().size());
        assertEquals(answer.getValue(), answers.getAnswers().get(answer.getQuestion().getCode()));
    }

    @Test
    public void getAnswersWrongClient() {
        Client client = testEntityHelper.createTestClient();
        try {
            answerService.getAnswers(client.getClientId());
            fail("Expected BaseException");
        } catch (BaseException e) {
            assertFalse(e.getMessage().isEmpty());
        }

        try {
            answerService.getAnswers(938475893795833834L);
            fail("Expected ValidationException");
        } catch (ValidationException e) {
            assertFalse(e.getMessage().isEmpty());
        }
    }

	@Override
	public void init() {
		initController(answerService);
	}
}
