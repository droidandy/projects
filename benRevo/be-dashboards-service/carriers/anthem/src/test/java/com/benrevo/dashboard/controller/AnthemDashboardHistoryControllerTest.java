package com.benrevo.dashboard.controller;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.ArrayList;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.HistoryDto;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Notification;

public class AnthemDashboardHistoryControllerTest extends AbstractControllerTest {

    @Autowired
    private AnthemDashboardHistoryController controller;

    @Before
    @Override
    public void init() {
        initController(controller);
    }

    @Test
    public void getEmailLastNotification() throws Exception {

        Client client = testEntityHelper.createTestClient();
        
        List<Notification> notifications = new ArrayList<>();
        notifications.add(testEntityHelper.createNotification(client.getClientId(), "SENT_TO_RATER", "EMAIL"));
        notifications.add(testEntityHelper.createNotification(client.getClientId(), "SENT_TO_RATER", "EMAIL"));

        token = createToken(client.getBroker().getBrokerToken());

        MvcResult result = performGetAndAssertResult(null, "/dashboard/notifications/{clientId}/EMAIL/SENT_TO_RATER", client.getClientId());
        
        List<HistoryDto> dtos = jsonUtils.fromJson(result.getResponse().getContentAsString(), List.class);
        
        assertThat(dtos).hasSize(2);
        
    }

}
