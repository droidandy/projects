package com.benrevo.core.api;


import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.UNUM;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import java.util.Date;
import com.benrevo.common.dto.OnBoardingClientDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.ClientState;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.be.modules.client.controller.ClientController;
import com.benrevo.be.modules.client.service.ClientService;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Timeline;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.TimelineRepository;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class AnthemClientControllerTest extends AbstractControllerTest {

	@Autowired
	private ClientController controller;

	@Autowired
    private TimelineRepository timelineRepository;
	
	@Autowired
    private BrokerRepository brokerRepository;
	
	@Autowired
    private ClientRepository clientRepository;
	
	@Autowired
    private ClientService clientService;
	
	@Before
	@Override
	public void init() {
		initController(controller);
	}

	@Test
    public void getOnBoardingClients_Unauthorized() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = authenticationService.createTokenForBroker(client.getBroker().getBrokerToken(), testAuthId, new String[] {UNUM.name()});

        mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/onboarding")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isUnauthorized())
                .andReturn();
    }
    
    @Test
    public void getOnBoardingClients() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();

        Client client1 = testEntityHelper.createTestClient("client1", broker);
        client1.setClientState(ClientState.ON_BOARDING);
        client1 = clientRepository.save(client1);
        clientService.setAttribute(client1, AttributeName.TIMELINE_IS_ENABLED);
        
        Client client2 = testEntityHelper.createTestClient("client2", broker);
        client2.setClientState(ClientState.COMPLETED);
        client2 = clientRepository.save(client2);
        
        Client client3 = testEntityHelper.createTestClient("client2", broker);
        // must be filtered in API
        client3.setClientState(ClientState.RFP_STARTED);
        client3 = clientRepository.save(client3);
        
        Client hasCompletedDateClient4 = testEntityHelper.createTestClient("client4", broker);
        hasCompletedDateClient4.setClientState(ClientState.COMPLETED);
        hasCompletedDateClient4 = clientRepository.save(hasCompletedDateClient4);
        
        Client noTimelinesClient5 = testEntityHelper.createTestClient("client5", broker);
        noTimelinesClient5.setClientState(ClientState.COMPLETED);
        noTimelinesClient5 = clientRepository.save(noTimelinesClient5);
        
        Carrier carrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), ANTHEM_BLUE_CROSS.name());
        
        Timeline timeline1 = testEntityHelper.createTestTimeline(client1, carrier, 1L);
        timeline1.setCompleted(true);
        timeline1.setCompletedTime(new Date());
        timeline1 = timelineRepository.save(timeline1);
        Timeline timeline2 = testEntityHelper.createTestTimeline(client1, carrier, 2L);
        Timeline timeline3 = testEntityHelper.createTestTimeline(client1, carrier, 3L);
        
        Timeline timeline4 = testEntityHelper.createTestTimeline(client2, carrier, 4L);
        Timeline timeline5 = testEntityHelper.createTestTimeline(client2, carrier, 5L);
        Timeline timeline6 = testEntityHelper.createTestTimeline(client2, carrier, 6L);
        
        Timeline timeline7 = testEntityHelper.createTestTimeline(client3, carrier, 7L);
        
        Timeline timeline8 = testEntityHelper.createTestTimeline(hasCompletedDateClient4, carrier, 8L);
        timeline8.setCompleted(true);
        // MySQL not supports milliseconds
        timeline8.setCompletedTime(DateUtils.setMilliseconds(new Date(), 0));
        timeline8 = timelineRepository.save(timeline8);
        Timeline timeline9 = testEntityHelper.createTestTimeline(hasCompletedDateClient4, carrier, 9L);
        timeline9.setCompleted(true);
        timeline9.setCompletedTime(DateUtils.addDays(timeline8.getCompletedTime(), 1));
        timeline9 = timelineRepository.save(timeline9);

        flushAndClear();
        
        MvcResult result = performGetAndAssertResult(null, "/v1/clients/onboarding");
        
        OnBoardingClientDto[] clients = jsonUtils.fromJson(result.getResponse().getContentAsString(), OnBoardingClientDto[].class);
        
        for (OnBoardingClientDto clientDto : clients) {
            if (clientDto.getId().equals(client1.getClientId())) {
                assertThat(clientDto.getProgressPercent()).isEqualTo(33); 
                assertThat(clientDto.getCompletedDate()).isNull();
                assertThat(clientDto).hasNoNullFieldsOrPropertiesExcept("completedDate");
                assertThat(clientDto.getSalesRepName()).isEqualTo(broker.getSalesFullName());
                assertThat(clientDto.isTimelineEnabled()).isTrue();
            } else if (clientDto.getId().equals(client2.getClientId())) {
                assertThat(clientDto.getProgressPercent()).isEqualTo(0);
                assertThat(clientDto).hasNoNullFieldsOrPropertiesExcept("completedDate");
                assertThat(clientDto.getSalesRepName()).isEqualTo(broker.getSalesFullName());
                assertThat(clientDto.isTimelineEnabled()).isFalse();
            } else if (clientDto.getId().equals(hasCompletedDateClient4.getClientId())) {
                assertThat(clientDto.getProgressPercent()).isEqualTo(100);
                assertThat(clientDto.getCompletedDate()).isEqualTo(timeline9.getCompletedTime());
                assertThat(clientDto).hasNoNullFieldsOrProperties();
            } else if (clientDto.getId().equals(noTimelinesClient5.getClientId())) {
                assertThat(clientDto.getProgressPercent()).isNull();
                assertThat(clientDto.getCompletedDate()).isNull();
                assertThat(clientDto).hasNoNullFieldsOrPropertiesExcept("progressPercent", "completedDate");
                assertThat(clientDto.isTimelineEnabled()).isFalse();
            } else if (clientDto.getId().equals(client3.getClientId())){
                Assert.fail("Client " + client3.getClientName() + " should not return");
            } else {
                assertThat(clientDto.isTimelineEnabled()).isFalse();
            }
        }
    }

	
}
