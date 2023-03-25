package com.benrevo.be.modules.onboarding.controller;

import com.benrevo.common.dto.CreateFormDto;
import com.benrevo.common.dto.FormDto;
import com.benrevo.common.dto.ShortQuestionDto;
import com.benrevo.common.dto.UpdateFormDto;
import com.benrevo.be.modules.onboarding.controller.FormController;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Form;
import com.benrevo.data.persistence.entities.FormQuestion;
import com.benrevo.data.persistence.entities.Question;
import com.benrevo.data.persistence.repository.FormRepository;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class FormControllerTest extends AbstractControllerTest {
    private static final String FORMS_ENDPOINT_URI = "/v1/forms";

    @Autowired
    private FormController formController;

    @Autowired
    private FormRepository formRepository;

    @Before
    public void init() {
        initController(formController);
    }

    @Test
    public void testGetFormById() throws Exception {
        Form form = testEntityHelper.createTestForm();

        Long formId = form.getFormId();

        mockMvc.perform(MockMvcRequestBuilders.get(FORMS_ENDPOINT_URI + "/{id}", formId)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.formId", true).value(formId))
                .andExpect(jsonPath("$.name", true).value(form.getName()))
                .andReturn();
    }

    @Test
    public void testCreateForms() throws Exception {
        Carrier carrier = testEntityHelper.createTestCarrier();
        Question firstQuestion = testEntityHelper.createTestQuestion("code1", "test1", true);
        Question secondQuestion = testEntityHelper.createTestQuestion("code2", "test2", true);
        Question thirdQuestion = testEntityHelper.createTestQuestion("code3", "test3", false);

        ShortQuestionDto first = new ShortQuestionDto(firstQuestion.getQuestionId(), true);
        ShortQuestionDto second = new ShortQuestionDto(secondQuestion.getQuestionId(), true);
        ShortQuestionDto third = new ShortQuestionDto(thirdQuestion.getQuestionId(), true);
        List<ShortQuestionDto> questionDtoList = Arrays.asList(first, second, third);

        CreateFormDto createFormDto = new CreateFormDto();
        createFormDto.setCarrierId(carrier.getCarrierId());
        createFormDto.setName("test");
        createFormDto.setQuestions(questionDtoList);

        String requestContent = "[" + jsonUtils.toJson(createFormDto) + "]";

        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.post(FORMS_ENDPOINT_URI)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$", hasSize(1)))
                .andReturn();

        MockHttpServletResponse response = mvcResult.getResponse();
        String responseContent = response.getContentAsString();

        String jsonObject = responseContent.substring(1, responseContent.length() - 1);

        FormDto responseDto = jsonUtils.fromJson(jsonObject, FormDto.class);
        assertNotNull(responseDto);
        assertNotNull(responseDto.getFormId());
        assertNotNull(responseDto.getName());

        Form form = formRepository.findOne(responseDto.getFormId());
        assertNotNull(form);
        assertEquals(responseDto.getFormId(), form.getFormId());
        assertEquals(responseDto.getName(), form.getName());
    }

    @Test
    public void testUpdateForms() throws Exception {
        //create new form with 1 question
        Form form = testEntityHelper.createTestForm();
        Question firstQuestion = testEntityHelper.createTestQuestion("code1", "test1", true);
        Question secondQuestion = testEntityHelper.createTestQuestion("code2", "test2", true);

        FormQuestion formQuestion = new FormQuestion();
        formQuestion.setForm(form);
        formQuestion.setQuestion(firstQuestion);
        formQuestion.setRequired(true);

        List<FormQuestion> formQuestions = new ArrayList<>(1);
        formQuestions.add(formQuestion);

        form.setFormQuestions(formQuestions);
        formRepository.save(form);

        //create new carrier
        Carrier carrier = testEntityHelper.createTestCarrier("testCarrierName" + System.currentTimeMillis(),"testDisplayCarrierName");

        ShortQuestionDto second = new ShortQuestionDto(secondQuestion.getQuestionId(), true);

        //as we only added the second question in the update dto, then the first one should be deleted, but the second should be added
        List<ShortQuestionDto> questionDtoList = Arrays.asList(second);
        String newFormName = form.getName() + System.currentTimeMillis();

        UpdateFormDto updateFormDto = new UpdateFormDto();
        updateFormDto.setFormId(form.getFormId());
        updateFormDto.setCarrierId(carrier.getCarrierId());
        updateFormDto.setName(newFormName);
        updateFormDto.setQuestions(questionDtoList);

        String content = "[" + jsonUtils.toJson(updateFormDto) + "]";

        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.post(FORMS_ENDPOINT_URI)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(content)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$", hasSize(1)))
                .andReturn();


        MockHttpServletResponse response = mvcResult.getResponse();
        String responseContent = response.getContentAsString();

        String jsonObject = responseContent.substring(1, responseContent.length() - 1);

        FormDto responseDto = jsonUtils.fromJson(jsonObject, FormDto.class);
        assertNotNull(responseDto);
        assertNotNull(responseDto.getFormId());

        Form updatedForm = formRepository.findOne(responseDto.getFormId());
        assertNotNull(form);
        assertEquals(responseDto.getFormId(), updatedForm.getFormId());
        assertEquals(responseDto.getName(), updatedForm.getName());

        assertNotNull(updatedForm.getFormQuestions());
        assertEquals(1, updatedForm.getFormQuestions().size());

        FormQuestion newFormQuestion = updatedForm.getFormQuestions().get(0);
        assertNotNull(newFormQuestion.getQuestion());
        assertEquals(newFormQuestion.getQuestion().getQuestionId(), second.getQuestionId());
    }

    @Test
    public void testDeleteForms() throws Exception {
        Form form = testEntityHelper.createTestForm();

        long formId = form.getFormId();

        assertNotNull(formRepository.findOne(formId));

        String content = "[" + formId + "]";
        performDeleteAndAssertResult(content, FORMS_ENDPOINT_URI);

        assertNull(formRepository.findOne(formId));
    }
}
