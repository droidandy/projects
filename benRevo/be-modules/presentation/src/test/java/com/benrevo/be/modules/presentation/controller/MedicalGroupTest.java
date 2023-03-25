package com.benrevo.be.modules.presentation.controller;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.MedicalGroupDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class MedicalGroupTest extends AbstractControllerTest {

    @Autowired
    private MedicalGroupController medicalGroupController;

    @Autowired
    private ObjectMapper mapper;

    @Before
    @Override
    public void init() {
        initController(medicalGroupController);
    }

    @Test
    public void testGetAll() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/medical-groups")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();
    }

    @Test
    public void testGetAllAndGroupByIncumbentCarriers() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/medical-groups/carriers")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        TypeReference<Map<String, List<MedicalGroupDto>>> mapType = new TypeReference<Map<String, List<MedicalGroupDto>>>() {};
        Map<String, List<MedicalGroupDto>> r = mapper.readValue(result.getResponse().getContentAsString(), mapType);

        assertThat(r.get("UHC")).isNotNull().isNotEmpty();
        assertThat(r.get("ANTHEM_BLUE_CROSS")).isNotNull().isNotEmpty();

        assertThat(r.get("VSP")).isNull();
    }
}