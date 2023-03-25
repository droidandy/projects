package com.benrevo.be.modules.onboarding.controller;

import com.benrevo.common.dto.QuestionDto;
import com.benrevo.be.modules.onboarding.controller.QuestionController;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.data.persistence.entities.Question;
import com.benrevo.data.persistence.repository.QuestionRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import java.util.Collections;

import static com.benrevo.common.util.ObjectMapperUtils.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class QuestionControllerTest extends AbstractControllerTest {
    private static final String QUESTIONS_ENDPOINT_URI = "/v1/questions";

    @Autowired
    private QuestionController questionController;

    @Autowired
    private QuestionRepository questionRepository;

    @Before
    @Override
    public void init() {
        initController(questionController);
    }

    @Test
    public void testGetQuestionById() throws Exception {
        Question question = testEntityHelper.createTestQuestion();

        long questionId = question.getQuestionId();

        performGetAndAssertResult(map(question, QuestionDto.class), QUESTIONS_ENDPOINT_URI + "/{id}", questionId);
    }

    @Test
    public void testCreateQuestions() throws Exception {
        QuestionDto questionDto = new QuestionDto();
        questionDto.setCode("code");
        questionDto.setTitle("test");

        String requestContent = "[" + jsonUtils.toJson(questionDto) + "]";

        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.post(QUESTIONS_ENDPOINT_URI)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        MockHttpServletResponse response = mvcResult.getResponse();
        String responseContent = response.getContentAsString();

        String jsonObject = responseContent.substring(1, responseContent.length() - 1);

        QuestionDto responseDto = jsonUtils.fromJson(jsonObject, QuestionDto.class);
        assertNotNull(responseDto);
        assertNotNull(responseDto.getQuestionId());
        assertNotNull(responseDto.getTitle());

        Question question = questionRepository.findOne(responseDto.getQuestionId());
        assertNotNull(question);
        assertEquals(responseDto.getQuestionId(), question.getQuestionId());
        assertEquals(responseDto.getTitle(), question.getTitle());
    }

    @Test
    public void testUpdateQuestions() throws Exception {
        Question question = testEntityHelper.createTestQuestion();

        QuestionDto newStateDto = map(question, QuestionDto.class);
        newStateDto.setTitle(newStateDto.getTitle() + System.currentTimeMillis());
        newStateDto.setMultiselectable(!newStateDto.isMultiselectable());

        String content = "[" + jsonUtils.toJson(newStateDto) + "]";

        performPutAndAssertResult(content, Collections.singletonList(newStateDto), QUESTIONS_ENDPOINT_URI);
    }

    @Test
    public void testDeleteQuestions() throws Exception {
        Question question = testEntityHelper.createTestQuestion();

        long questionId = question.getQuestionId();

        assertNotNull(questionRepository.findOne(questionId));

        String content = "[" + questionId + "]";
        performDeleteAndAssertResult(content, QUESTIONS_ENDPOINT_URI);

        assertNull(questionRepository.findOne(questionId));
    }
}
