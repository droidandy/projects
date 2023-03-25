package com.benrevo.be.modules.rfp.controller;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import com.benrevo.be.modules.rfp.controller.RfpCarrierController;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AuthorizationTest extends AbstractControllerTest {

    @Autowired
    private RfpCarrierController rfpCarrierController;

    @Before
    @Override
    public void init() {
        initController(rfpCarrierController);
    }

    @Test
    public void requestWithBrokenToken() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/rfpcarriers?category=MEDICAL")
                .header("Authorization", "Bearer " + token.replace('y', 'x'))
                .header("Content-Type", "application/json")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isUnauthorized())
                .andReturn();
    }

    @Test
    public void requestWithoutBearer() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/rfpcarriers?category=MEDICAL")
                .header("Authorization", token)
                .header("Content-Type", "application/json")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isUnauthorized())
                .andReturn();
    }

    @Test
    public void requestWithoutHeader() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/rfpcarriers?category=MEDICAL")
                .header("Content-Type", "application/json")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isUnauthorized())
                .andReturn();
    }

    @Test
    public void optionsWithoutHeader() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.options("/v1/rfpcarriers?category=MEDICAL")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    public void optionsCORSTest() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.options("/v1/rfpcarriers?category=MEDICAL")
                .header("Origin", "http://local.benrevo.com:3000")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andReturn();
    }
}
