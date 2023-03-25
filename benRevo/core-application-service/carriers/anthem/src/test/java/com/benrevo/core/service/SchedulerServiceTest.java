package com.benrevo.core.service;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.ConfigurationName;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Configuration;
import com.benrevo.data.persistence.entities.Timeline;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ConfigurationRepository;
import com.benrevo.data.persistence.repository.TimelineRepository;
import com.benrevo.core.AnthemCoreServiceApplication;

import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = AnthemCoreServiceApplication.class)
public class SchedulerServiceTest extends AbstractControllerTest {
    
    @Autowired
    CustomLogger LOGGER;
    
    @Autowired
    private TimelineService timelineService;
    
    @Autowired
    private TimelineRepository timelineRepository;
    
    @Autowired
    private ConfigurationRepository configurationRepository;
    
    @Autowired
    private CarrierRepository carrierRepository;
    
    @Autowired
    private AnthemTimelineEmailService anthemTimelineEmailService;
  
    
    @Test
    public void overdueNotificationTest() throws IOException {
        
        SchedulerService anthemSchedulerService = new SchedulerService(
                LOGGER,
                timelineRepository, 
                carrierRepository,
                configurationRepository, 
                anthemTimelineEmailService);
        
        Client testClient = testEntityHelper.createTestClient();
        Carrier carrierAnthem = testEntityHelper.createTestCarrier(ANTHEM_BLUE_CROSS.name(), "");
        
        final int THRESHOLD_DAYS = 2;
        
        // turn on reminder service
        configurationRepository.save(new Configuration(
                carrierAnthem.getCarrierId(),
                ConfigurationName.RUN_REMINDER_SERVICE,
                "true"));
        
        // set threshold
        configurationRepository.save(new Configuration(
                carrierAnthem.getCarrierId(),
                ConfigurationName.OVERDUE_NOTIFICATION_THRESHOLD,
                Integer.toString(THRESHOLD_DAYS)));
        
        // calculate test date
        Calendar c = Calendar.getInstance();
        c.add(Calendar.DATE, -THRESHOLD_DAYS);
        c.add(Calendar.MINUTE, -1); // for sure
        Date testProjectedTime = c.getTime();
        
        Timeline timeline1 = testEntityHelper.createTestTimeline(testClient, carrierAnthem, 1L);
        
        Timeline timeline2 = testEntityHelper.buildTestTimeline(testClient, carrierAnthem, 2L);
        timeline2.setMilestone("testMilestone2");
        timeline2.setProjectedTime(testProjectedTime);
        timelineRepository.save(timeline2);
        
        Timeline timeline3 = testEntityHelper.buildTestTimeline(testClient, carrierAnthem, 3L);
        timeline3.setMilestone("testMilestone3");
        timeline3.setProjectedTime(testProjectedTime);
        timelineRepository.save(timeline3);
        
        Timeline timeline4 = testEntityHelper.buildTestTimeline(testClient, carrierAnthem, 4L);
        timeline4.setMilestone("testMilestone4");
        timeline4.setCompleted(true);
        timeline4.setProjectedTime(testProjectedTime);
        timelineRepository.save(timeline4);
        
        // action
        anthemSchedulerService.checkReminderThreshold();
        
        // test send was called 
        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        Mockito.verify(smtpMailer, Mockito.atLeast(1)).send(mailCaptor.capture());

        for(MailDto mailDto : mailCaptor.getAllValues()){
            if(mailDto.getSubject().contains(testClient.getClientName())) {
                assertThat(mailDto.getContent()).contains(testClient.getClientName());
                assertThat(mailDto.getContent()).doesNotContain(timeline1.getMilestone());
                assertThat(mailDto.getContent()).contains(timeline2.getMilestone());
                assertThat(mailDto.getContent()).contains(timeline3.getMilestone());
                assertThat(mailDto.getContent()).doesNotContain(timeline4.getMilestone());
            }
        }
        
        // uncomment for manual testing
        //File html = new File("testReminderNotification.html");
        //FileUtils.writeByteArrayToFile(html, mailDto.getContent().getBytes());

        // reset invocation counter
        Mockito.reset(smtpMailer);

        // action
        anthemSchedulerService.checkReminderThreshold();

        // test send was not called second time
        Mockito.verify(smtpMailer, Mockito.never()).send(Mockito.any(MailDto.class));
    }

	@Override
	public void init() {
		initController(timelineService);
	}
}
