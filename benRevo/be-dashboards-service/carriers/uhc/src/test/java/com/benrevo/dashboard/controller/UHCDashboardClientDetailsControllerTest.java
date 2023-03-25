package com.benrevo.dashboard.controller;

import static com.benrevo.common.enums.ActivityType.RENEWAL_ADDED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.testng.Assert.fail;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import com.auth0.exception.Auth0Exception;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ActivityDto;
import com.benrevo.common.dto.ClientDetailsDto;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;

public class UHCDashboardClientDetailsControllerTest extends AbstractControllerTest {
    
    @Autowired
    private ClientDetailsController clientDetailsController;

    @Autowired
    private TestEntityHelper testEntityHelper;
    
    @Before
    @Override
    public void init() throws Auth0Exception {
        initController(clientDetailsController);
    }

    @Test
    public void testClientDetails() throws Exception {
        Client client = testEntityHelper.createTestClient();
        
        token = createToken(client.getBroker().getBrokerToken());

        Activity activity1 = testEntityHelper.createTestActivity(client, null, Constants.MEDICAL,
                ActivityType.INITIAL_RENEWAL, null, "-17");

        Activity activity2 = testEntityHelper.createTestActivity(client, null, Constants.MEDICAL,
                RENEWAL_ADDED, null, "-15");
        activity2.setLatest(false);
        activity2.setCreated(null);

        testEntityHelper.createTestActivity(client, null, Constants.MEDICAL,
                RENEWAL_ADDED, null, "12");

        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/details/{product}", client.getClientId(),Constants.MEDICAL);
    
        ClientDetailsDto details = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDetailsDto.class);
        
        assertThat(details.getDifferences()).hasSize(2);
        for (ActivityDto diff : details.getDifferences()) {
            if (ActivityType.INITIAL_RENEWAL.equals(diff.getType())) {
                assertThat(diff.getValue()).isEqualTo("-17");
                assertThat(diff.getText()).isEqualTo("Starting Decrease");
            } else if (ActivityType.RENEWAL_ADDED.equals(diff.getType())) {
                assertThat(diff.getValue()).isEqualTo("12");
                assertThat(diff.getText()).isEqualTo("Current Increase");
            } else {
                fail("Unexpected activity type");
            }
        }
      
    }

    @Test
    public void testGetActivitiesByClientId() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("testName", broker);
        token = createToken(broker.getBrokerToken());
        
        testEntityHelper.createTestActivity(client, null, Constants.MEDICAL,
                ActivityType.INITIAL_RENEWAL, null, "17");

        testEntityHelper.createTestActivity(client, null, Constants.MEDICAL,
                ActivityType.RENEWAL_ADDED, null, "12");

        testEntityHelper.createTestActivity(client, null, Constants.DENTAL,
                ActivityType.INITIAL_RENEWAL, null, "14");

        testEntityHelper.createTestActivity(client, null, Constants.DENTAL,
                ActivityType.RENEWAL_ADDED, null, "18");

        testEntityHelper.createTestActivity(client, null, Constants.VISION,
                ActivityType.INITIAL_RENEWAL, null, "11");

        // it should not be in the result because value equals initial value
        testEntityHelper.createTestActivity(client, null, Constants.VISION,
                ActivityType.RENEWAL_ADDED, null, "11");

        MvcResult result = performGetAndAssertResult(null, "/dashboard/client/{clientId}/activities", client.getClientId());

        ActivityDto[] activityDtos = jsonUtils.fromJson(result.getResponse().getContentAsString(), ActivityDto[].class);
        
        assertThat(activityDtos).isNotNull();
        assertThat(activityDtos).hasSize(5);
        assertThat(activityDtos).extracting("value").containsExactlyInAnyOrder("17","12","14","18","11");
        assertThat(activityDtos).extracting("text").containsExactlyInAnyOrder(null,"(-5.0%)",null,"(4.0%)",null);
        assertThat(activityDtos).extracting("notes").contains("Medical renewal decreased from 17 to 12.","Dental renewal increased from 14 to 18.");

    }


}
