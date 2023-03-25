package com.benrevo.core.api.controller;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.RequestDemoDto;
import com.benrevo.core.service.email.CoreEmailService;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;

import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.mockito.Answers.RETURNS_DEEP_STUBS;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Created by elliott on 10/9/17 at 1:52 PM.
 */
public class RequestDemoControllerTest extends AbstractControllerTest {

    @MockBean(answer = RETURNS_DEEP_STUBS)
    CoreEmailService emailService;

    @Autowired
    @InjectMocks
    RequestDemoController controller;

    @Before
    @Override
    public void init() throws Exception {
        initController(controller);
    }

    @Test
    public void requestDemo_Success() throws Exception {
        RequestDemoDto d = new RequestDemoDto.Builder()
            .withCompanyName("company1")
            .withEmail("myemail@benrevo.com")
            .withName("myname")
            .withPhoneNumber("+1 (888) 888-8888")
            .build();

        mockMvc.perform(
            post("/v1/requestDemo")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(jsonUtils.toJson(d))
                .accept(MediaType.APPLICATION_JSON_UTF8)
        )
        .andExpect(status().is2xxSuccessful())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(r -> isNotBlank(r.getResponse().getContentAsString()))
        .andReturn();
    }

    @Test
    public void requestDemo_InvalidPhone() throws Exception {
        RequestDemoDto d = new RequestDemoDto.Builder()
            .withCompanyName("company1")
            .withEmail("myemail@benrevo.com")
            .withName("myname")
            .withPhoneNumber("(888) 888-8888")
            .build();

        mockMvc.perform(
            post("/v1/requestDemo")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(jsonUtils.toJson(d))
                .accept(MediaType.APPLICATION_JSON_UTF8)
            )
            .andExpect(status().is4xxClientError())
            .andReturn();
    }

    @Test
    public void requestDemo_InvalidName() throws Exception {
        RequestDemoDto d = new RequestDemoDto.Builder()
            .withCompanyName("company1")
            .withEmail("myemail@benrevo.com")
            .withName(null)
            .withPhoneNumber("1234567890")
            .build();

        mockMvc.perform(
            post("/v1/requestDemo")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(jsonUtils.toJson(d))
                .accept(MediaType.APPLICATION_JSON_UTF8)
        )
        .andExpect(status().is4xxClientError())
        .andReturn();
    }
}
