package com.benrevo.core.api.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.util.Map;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import com.auth0.exception.Auth0Exception;
import com.benrevo.be.modules.onboarding.controller.FormController;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Form;
import com.benrevo.data.persistence.entities.FormQuestion;
import com.benrevo.data.persistence.repository.FormRepository;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class AnthemFormControllerTest extends AbstractControllerTest {

    @Autowired
    private FormController controller;
    
    @Autowired
    private FormRepository formRepository;

    @Before
    public void init() throws Auth0Exception {
        initController(controller);
    }

    @Test
    public void testGetAvailableFormList() throws Exception {
        
        Client client = testEntityHelper.createTestClient();
        Form form = formRepository.findByName("anthem-tpa-2");
        for (FormQuestion fq : form.getFormQuestions()) {
            if ("tpa_quantity".equals(fq.getQuestion().getCode())) {
                testEntityHelper.createTestAnswer(client, fq.getQuestion(), "5");
            }
        }
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{clientId}/forms", client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is2xxSuccessful())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        String body = result.getResponse().getContentAsString();
        Gson gson = new GsonBuilder().create();
        Map<String, String> formList = gson.fromJson(body, Map.class);
        assertThat(formList).isNotNull();
        assertThat(formList).hasSize(8);
    }
}
