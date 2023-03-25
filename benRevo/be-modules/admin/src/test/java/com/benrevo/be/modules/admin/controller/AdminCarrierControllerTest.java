package com.benrevo.be.modules.admin.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.common.dto.CarrierDto;
import com.benrevo.data.persistence.entities.Carrier;
import java.util.Arrays;
import org.junit.Test;
import org.springframework.test.web.servlet.MvcResult;

public class AdminCarrierControllerTest extends AdminAbstractControllerTest {

    @Test
    public void testGetAllCarriers() throws Exception {

        Carrier carrier = testEntityHelper.createTestCarrier();
        
        MvcResult result = performGetAndAssertResult(null, "/admin/carriers/all/");
        
        CarrierDto[] carriers = jsonUtils.fromJson(result.getResponse().getContentAsString(), CarrierDto[].class);
        
        assertThat(carriers.length).isGreaterThanOrEqualTo(1);
        
        CarrierDto testCarrier = Arrays.stream(carriers)
            .filter(c -> c.getCarrierId().equals(carrier.getCarrierId()))
            .findFirst().orElse(null);
        
        assertThat(testCarrier).isNotNull();
        assertThat(testCarrier).hasNoNullFieldsOrPropertiesExcept("networks");
    }

}
