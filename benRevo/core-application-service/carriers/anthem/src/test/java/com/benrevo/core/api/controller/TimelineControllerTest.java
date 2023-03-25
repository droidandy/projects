package com.benrevo.core.api.controller;

import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.TimelineDto;
import com.benrevo.common.dto.TimelineGroupDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.core.service.TimelineService;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.TimelineRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.test.web.support.WebTestUtils;
import org.springframework.security.web.context.HttpRequestResponseHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.util.DateHelper.fromDateToString;
import static org.apache.commons.lang3.ArrayUtils.toArray;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class TimelineControllerTest extends AbstractControllerTest {

    @Autowired
    private TimelineService timelineService;

	@Autowired
	private TimelineController timelineController;
	
	@Autowired
	private ClientRepository clientRepository;

	@Autowired
	private AttributeRepository attributeRepository;
	
	@Autowired
	private TimelineRepository timelineRepository;

    @Before
    @Override
    public void init() {
        initController(timelineController);
    }

	@Test
    public void getTimelines_Implementation_Manager() throws Exception {
        final Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), "");
        create12Timelines(client, carrier);
        Broker randomBroker = testEntityHelper.createTestBroker("Randon Broker");
        assertThat(randomBroker.getBrokerToken()).isNotEqualTo(client.getBroker().getBrokerToken());
        
        flushAndClear();
        
        // client not accessible for other broker
        token = authenticationService.createTokenForBroker(
                randomBroker.getBrokerToken(), testAuthId, new String[] {ANTHEM_BLUE_CROSS.name()});

        // check for Forbidden
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/timelines")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .param("clientId", client.getClientId().toString())
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isForbidden())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
        
        // but implementation_manager role have access to client only in any ON_BOARDING and COMPLETED states
        token = authenticationService.createTokenForBroker(
                randomBroker.getBrokerToken(), testAuthId,
                toArray(AccountRole.IMPLEMENTATION_MANAGER.getValue()), 
                toArray(ANTHEM_BLUE_CROSS.name()));
        
        // check for Forbidden
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/timelines")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .param("clientId", client.getClientId().toString())
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isForbidden())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        // check for access without errors
        
        client.setClientState(ClientState.ON_BOARDING);
        clientRepository.save(client);
        
        flushAndClear();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/timelines")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .param("clientId", client.getClientId().toString())
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            // check for logged user replacement (to Implementation Manager fake broker)
            .andExpect(
                r -> {
                    HttpRequestResponseHolder holder = new HttpRequestResponseHolder(r.getRequest(), r.getResponse());
                    SecurityContextRepository repository = WebTestUtils.getSecurityContextRepository(r.getRequest());
                    SecurityContext context = repository.loadContext(holder);

                    AuthenticatedUser currentUser = (AuthenticatedUser) context.getAuthentication();

                    assertThat(currentUser.getBrokerName()).isEqualTo(Constants.ANTHEM_IMPLEMENTATION_MANAGER_BROKE_NAME);
                    assertThat(currentUser.getRoles()).containsExactly(AccountRole.IMPLEMENTATION_MANAGER.getValue());
                }
            )
            .andReturn();

        TimelineGroupDto[] timelines = jsonUtils.fromJson(result.getResponse().getContentAsString(), TimelineGroupDto[].class);
        assertThat(timelines).isNotEmpty();
        

	}
	
	private List<Timeline> create12Timelines(Client client, Carrier carrier) {
	    List<Timeline> timelines = new ArrayList<>();
	    timelines.add(testEntityHelper.createTestTimeline(client, carrier, 1L));
	    timelines.add(testEntityHelper.createTestTimeline(client, carrier, 2L));
	    timelines.add(testEntityHelper.createTestTimeline(client, carrier, 3L));
	    timelines.add(testEntityHelper.createTestTimeline(client, carrier, 4L));
        timelines.add(testEntityHelper.createTestTimeline(client, carrier, 5L));
        timelines.add(testEntityHelper.createTestTimeline(client, carrier, 6L));
        timelines.add(testEntityHelper.createTestTimeline(client, carrier, 7L));
        timelines.add(testEntityHelper.createTestTimeline(client, carrier, 8L));
        timelines.add(testEntityHelper.createTestTimeline(client, carrier, 9L));
        timelines.add(testEntityHelper.createTestTimeline(client, carrier, 10L));
        timelines.add(testEntityHelper.createTestTimeline(client, carrier, 11L));
        timelines.add(testEntityHelper.createTestTimeline(client, carrier, 12L));
        return timelines;
	}
	
	@Test
	public void getTimelines() throws Exception {
		Client client = testEntityHelper.createTestClient();
		token = createToken(client.getBroker().getBrokerToken());
		Carrier carrierUhc = testEntityHelper.createTestCarrier(UHC.name(), "");
		Carrier carrierAnthem = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), "");
		Timeline timelineUhc = testEntityHelper.createTestTimeline(client, carrierUhc, 1L);
		List<Timeline> timelines1_12 = create12Timelines(client, carrierAnthem);
		Timeline timeline1 = timelines1_12.get(0);

		timelineService.updateCompleted(timeline1.getTimelineId(), true, false);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/timelines")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .param("clientId", client.getClientId().toString())
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
		
		TimelineGroupDto[] timelines = jsonUtils.fromJson(result.getResponse().getContentAsString(), TimelineGroupDto[].class);
		
		assertThat(timelines).hasSize(4);
		for (TimelineGroupDto timelineGroup : timelines) {
	        for (TimelineDto timeline : timelineGroup.getTimelines()) {
	            assertThat(timeline.getTimelineId()).isNotEqualTo(timelineUhc.getTimelineId());
	            if (timeline.getTimelineId().equals(timeline1.getTimelineId()) ) {
	                assertThat(timeline.isCompleted()).isTrue();
	                assertThat(timeline).hasNoNullFieldsOrPropertiesExcept("createTime", "carrierId", "shouldSendNotification");
	            } else {
	                assertThat(timeline.isCompleted()).isFalse();
	                assertThat(timeline).hasNoNullFieldsOrPropertiesExcept("completedTime", "createTime", "carrierId", "shouldSendNotification");
	            }
	        }
		}
	}
	
	@Test
	public void initTimelines() throws Exception {
		Client client = testEntityHelper.createTestClient();
		
		TimelineDto params = new TimelineDto();
		params.setClientId(client.getClientId());

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/v1/timelines/init")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .content(jsonUtils.toJson(params))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
		
		TimelineGroupDto[] timelineGroups = jsonUtils.fromJson(result.getResponse().getContentAsString(), TimelineGroupDto[].class);
		
		assertThat(timelineGroups).hasSize(4);
		for (TimelineGroupDto timelineGroup : timelineGroups) {
		    for (TimelineDto timeline : timelineGroup.getTimelines()) {
		        assertThat(timeline).hasNoNullFieldsOrPropertiesExcept("completedTime", "createTime", "carrierId", "shouldSendNotification");
		    }
		}
		
		ClientAttribute attribute = attributeRepository.findClientAttributeByClientIdAndName(client.getClientId(), AttributeName.TIMELINE_IS_ENABLED);
		assertThat(attribute).isNotNull();
		
		// try to init second time
        mockMvc.perform(MockMvcRequestBuilders.post("/v1/timelines/init")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .content(jsonUtils.toJson(params))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
		Carrier anthemCarrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), "");
		List<Timeline> timelines = timelineRepository.findByClientIdAndCarrierIdOrderByRefNumAsc(client.getClientId(), anthemCarrier.getCarrierId());
        
		assertThat(timelines).hasSize(12);

		attribute = attributeRepository.findClientAttributeByClientIdAndName(client.getClientId(), AttributeName.TIMELINE_IS_ENABLED);
		assertThat(attribute).isNotNull();
	}
	
	@Test
	public void updateCompleted() throws Exception {
		Client client = testEntityHelper.createTestClient();
		Carrier carrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), "");
		Timeline timeline = testEntityHelper.createTestTimeline(client, carrier, 1L);
		
		TimelineDto params = new TimelineDto();
		params.setCompleted(true);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.put("/v1/timelines/{id}/updateCompleted", timeline.getTimelineId().toString())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .content(jsonUtils.toJson(params))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

		TimelineDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), TimelineDto.class);
		
		assertThat(updated.isCompleted()).isTrue();
		assertThat(updated.getCompletedTime()).isNotNull();
		
		params.setCompleted(false);
        result = mockMvc.perform(MockMvcRequestBuilders.put("/v1/timelines/{id}/updateCompleted", timeline.getTimelineId().toString())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .content(jsonUtils.toJson(params))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
		updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), TimelineDto.class);
		
		assertThat(updated.isCompleted()).isFalse();
		assertThat(updated.getCompletedTime()).isNull();
	}
	
	@Test
	//@Ignore
	public void updateProjectedTime() throws Exception {
		Client client = testEntityHelper.createTestClient();
		Carrier carrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), "");
		Timeline timeline = testEntityHelper.createTestTimeline(client, carrier, 1L);
		
		TimelineDto params = new TimelineDto();
		// MySQL not store milliseconds
		final Date projectedTime = DateUtils.setMilliseconds(DateUtils.addYears(timeline.getCreateTime(), 1), 0);
		params.setProjectedTime(projectedTime);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.put("/v1/timelines/{id}/updateProjectedTime", timeline.getTimelineId().toString())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .content(jsonUtils.toJson(params))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

		TimelineDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), TimelineDto.class);
		
		assertThat(fromDateToString(updated.getProjectedTime())).isEqualTo(fromDateToString(projectedTime));
	}
	
	@Test
    public void updateCompletedWithNotification() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), "");
        Timeline timeline = testEntityHelper.createTestTimeline(client, carrier, 1L);
        
        TimelineDto params = new TimelineDto();
        params.setCompleted(true);
        params.setShouldSendNotification(true);
        
        // action
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.put("/v1/timelines/{id}/updateCompleted", timeline.getTimelineId().toString())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .content(jsonUtils.toJson(params))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
        
        TimelineDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), TimelineDto.class);
        assertThat(updated.isCompleted()).isTrue();
        assertThat(updated.getCompletedTime()).isNotNull();

        // test send was called 
        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        Mockito.verify(smtpMailer, Mockito.times(1)).send(mailCaptor.capture());
        
        MailDto mailDto = mailCaptor.getValue();
        assertThat(mailDto.getContent()).contains(timeline.getMilestone());
        assertThat(mailDto.getContent()).contains(client.getClientName());
        
        // uncomment for manual testing
        //File html = new File("testCompletedNotification.html");
        //FileUtils.writeByteArrayToFile(html, mailDto.getContent().getBytes());

        // reset invocation counter
        Mockito.reset(smtpMailer);

        // action
        mockMvc.perform(MockMvcRequestBuilders.put("/v1/timelines/{id}/updateCompleted", timeline.getTimelineId().toString())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .content(jsonUtils.toJson(params))
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        // test send was not called second time
        Mockito.verify(smtpMailer, Mockito.never()).send(Mockito.any(MailDto.class));
        
    }
}
