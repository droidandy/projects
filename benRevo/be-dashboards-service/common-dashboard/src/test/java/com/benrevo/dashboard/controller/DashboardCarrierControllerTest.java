package com.benrevo.dashboard.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.CarrierDto;
import com.benrevo.data.persistence.entities.Carrier;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

public class DashboardCarrierControllerTest extends AbstractControllerTest {

    @Autowired
    private DashboardCarrierController carrierController;
    
    @Before
    @Override
    public void init() throws Exception {
        initController(carrierController);
    }
    
    @Test
    public void testGetAllCarriers() throws Exception {
        Carrier c = testEntityHelper.createTestCarrier();
        
        MvcResult result = performGetAndAssertResult(null, "/dashboard/carriers/all");
        CarrierDto[] carriers = jsonUtils.fromJson(result.getResponse().getContentAsString(), CarrierDto[].class);
        
        assertThat(carriers).isNotEmpty();
    }
}
