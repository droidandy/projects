package com.benrevo.admin.api.controller;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.PersonDto;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.repository.BrokerRepository;

import java.util.Arrays;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.UHC;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class BrokerControllerTest extends AdminAbstractControllerTest {

	@Autowired
	private BrokerRepository brokerRepository;
	 
    @Test
    public void testAccessGrantedForSuperAdmin() throws Exception {
        String token = createToken(TEST_BROKERAGE_ID, "superadmin");
   
        mockMvc.perform(MockMvcRequestBuilders.get("/admin/brokers/all/")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());
        
        token = createToken(TEST_BROKERAGE_ID, "admin");

        mockMvc.perform(MockMvcRequestBuilders.get("/admin/brokers/all/")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void filterTestBrokerages() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("filterTestBrokerages");

        final Broker finalBroker = broker;

        MvcResult result = performGetAndAssertResult(null, "/v1/brokers/brokerages");

        BrokerDto[] brokerages = jsonUtils.fromJson(result.getResponse().getContentAsString(), BrokerDto[].class);

        BrokerDto testBroker = Arrays.stream(brokerages)
            .filter(b -> b.getName().equals(finalBroker.getName()))
            .findFirst().orElse(null);

        assertThat(testBroker).isNotNull();

        // check the same filter but on another API

        result = performGetAndAssertResult(null, "/admin/brokers/all/");

        brokerages = jsonUtils.fromJson(result.getResponse().getContentAsString(), BrokerDto[].class);

        testBroker = Arrays.stream(brokerages)
            .filter(b -> b.getName().equals(finalBroker.getName()))
            .findFirst().orElse(null);

        assertThat(testBroker).isNotNull();
    }

}
