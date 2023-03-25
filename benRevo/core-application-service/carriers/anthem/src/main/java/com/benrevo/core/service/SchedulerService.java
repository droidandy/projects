package com.benrevo.core.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;

import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.enums.ConfigurationName;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Configuration;
import com.benrevo.data.persistence.entities.Timeline;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ConfigurationRepository;
import com.benrevo.data.persistence.repository.TimelineRepository;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@ConditionalOnExpression("'${app.env}'!='local'") // prevent from running during tests
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class SchedulerService {

    @Autowired
    CustomLogger LOGGER;
    
    @Autowired
    private TimelineRepository timelineRepository;

    @Autowired
    private CarrierRepository carrierRepository;
    
    @Autowired
    private ConfigurationRepository configurationRepository;
    
    @Autowired
    private AnthemTimelineEmailService anthemTimelineEmailService;
    
    public SchedulerService() {
    }
    
    // testing purpose
    public SchedulerService(CustomLogger lOGGER, TimelineRepository timelineRepository,
            CarrierRepository carrierRepository, ConfigurationRepository configurationRepository,
            AnthemTimelineEmailService anthemTimelineEmailService) {
        super();
        LOGGER = lOGGER;
        this.timelineRepository = timelineRepository;
        this.carrierRepository = carrierRepository;
        this.configurationRepository = configurationRepository;
        this.anthemTimelineEmailService = anthemTimelineEmailService;
    }

    @Scheduled(cron = "0 0 9-17 * * MON-FRI", zone="America/Los_Angeles")
    public void checkReminderThreshold() {
        try {
            LOGGER.info("checkReminderThreshold: started");
            Long carrierId = getCarrier().getCarrierId();
            Configuration runAttribute = configurationRepository.findByCarrierIdAndName(carrierId, ConfigurationName.RUN_REMINDER_SERVICE);
            if (runAttribute == null || !"true".equals(runAttribute.getValue()) ) {
                LOGGER.warn("SchedulerService - Timeline reminder is turned off");
                // skip, service is turned off
                return;
            }
            
            Configuration thresholdAttribute = configurationRepository.findByCarrierIdAndName(carrierId, ConfigurationName.OVERDUE_NOTIFICATION_THRESHOLD);
            if (thresholdAttribute == null) {
                LOGGER.error("checkReminderThreshold: Threshold not found");
                return;
            }
            int thresholdDays = Integer.parseInt(thresholdAttribute.getValue());
            Date thresholdDate = getDate(-thresholdDays);
            List<Timeline> items = timelineRepository.findOverduesByCarrierIdAndProjectedTime(carrierId, thresholdDate);
            Map<Long, List<Timeline>> itemMap = items.stream().collect(Collectors.groupingBy(Timeline::getClientId));
      
            for (Entry<Long, List<Timeline>> entry: itemMap.entrySet()) {
                StringBuilder sb = new StringBuilder("checkReminderThreshold: Found overdues: clientId=");
                sb.append(entry.getKey());
                sb.append(", milestones=");
                for(Timeline item: entry.getValue()) {
                    item.setOverdueNotificationTime(new Date());
                    timelineRepository.save(item);
                    sb.append(item.getMilestone());
                    sb.append(", ");
                }
                LOGGER.info(sb);
                // send notification
                anthemTimelineEmailService.sendReminderNotification(entry.getKey(), entry.getValue());
            }
        } catch(Exception ex) {
            LOGGER.error("checkReminderThreshold: " + ex.getMessage(), ex);
        }
    }
    
    

    private Carrier getCarrier() {
        return carrierRepository.findByName(Constants.ANTHEM_CARRIER);
    }

    private Date getDate(int daysFromNow) {
        Calendar c = Calendar.getInstance();
        c.add(Calendar.DATE, daysFromNow);
        return c.getTime();
    }
}
