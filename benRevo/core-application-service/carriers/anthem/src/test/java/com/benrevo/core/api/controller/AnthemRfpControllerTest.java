package com.benrevo.core.api.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.auth0.exception.Auth0Exception;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class AnthemRfpControllerTest extends AbstractControllerTest {

    @Autowired
    private AnthemRfpController controller;

    @Before
    public void init() throws Auth0Exception {
        initController(controller);
    }

    @Test
    public void testGetCountyList() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/rfps/countyList")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is2xxSuccessful())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        String body = result.getResponse().getContentAsString();
        Gson gson = new GsonBuilder().create();
        String[] countyList = gson.fromJson(body, String[].class);
        assertThat(countyList).isNotNull();
        assertThat(countyList).hasSize(58);
        assertThat(countyList).contains("ALAMEDA");
    }
}
