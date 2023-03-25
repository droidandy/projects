package com.benrevo.core.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import com.benrevo.data.persistence.entities.Carrier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.benrevo.common.dto.TimelineDto;
import com.benrevo.common.dto.TimelineGroupDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.Timeline;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.TimelineRepository;
import com.benrevo.common.util.ObjectMapperUtils;

import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.carrierMatches;
import static com.benrevo.common.util.MapBuilder.field;

@Service
@Transactional
public class TimelineService {

	@Autowired
	private TimelineRepository timelineRepository;

	@Autowired
	private ClientRepository clientRepository;

	@Autowired
	private CarrierRepository carrierRepository;
	
	@Autowired
	private AnthemTimelineEmailService anthemTimelineEmailService;
    
	@Autowired
	private AttributeRepository attributeRepository;

	@Value("${app.carrier}")
	String[] appCarrier;

	public TimelineDto updateCompleted(Long timelineId, boolean isCompleted, Boolean shouldSendNotification) {
		Timeline timeline = getTimeline(timelineId);
		if (timeline.isCompleted() != isCompleted) { // skip if not changed
		    
			timeline.setCompletedTime(isCompleted ? new Date() : null);
			timeline.setCompleted(isCompleted);
			timeline.setCarrierId(getCarrier().getCarrierId());
    
			timeline = timelineRepository.save(timeline);
		
			if (isCompleted && shouldSendNotification != null && shouldSendNotification) {
			    // send notification
                anthemTimelineEmailService.sendCompletionNotification(timeline.getClientId(), timeline.getMilestone());
			}
		}
		return ObjectMapperUtils.map(timeline, TimelineDto.class);
	}

	public TimelineDto updateProjectedTime(Long timelineId, Date projectedTime) {
		Timeline timeline = getTimeline(timelineId);
		timeline.setProjectedTime(projectedTime);
        timeline.setCarrierId(getCarrier().getCarrierId());

		timeline = timelineRepository.save(timeline);

		return ObjectMapperUtils.map(timeline, TimelineDto.class);
	}

	public List<TimelineGroupDto> getTimelinesByClientId(Long clientId) {
		List<Timeline> timelines = timelineRepository.findByClientIdAndCarrierIdOrderByRefNumAsc(clientId, getCarrier().getCarrierId());

		List<TimelineDto> timelinesDto = ObjectMapperUtils.mapAll(timelines, TimelineDto.class);
		
		return createTimelineGroups(timelinesDto);
	}

	private List<TimelineGroupDto> createTimelineGroups(List<TimelineDto> timelines) {
	    if (timelines.size() < 12) {
	        throw new BaseException("The number of timelines is less than 12");
	    }
	    List<TimelineGroupDto> result = new ArrayList<>();
        result.add(new TimelineGroupDto("Pre-Implementation", timelines.subList(0, 4)));
        result.add(new TimelineGroupDto("Implementation Kick-Off Meeting", timelines.subList(4, 5)));
        result.add(new TimelineGroupDto("Case Set Up", timelines.subList(5, 7)));
        result.add(new TimelineGroupDto("Eligibility Submission", timelines.subList(7, 12)));
        
        return result;
	}
	
	public List<TimelineGroupDto> createTimelinesForClientIdCarrierId(Long clientId) {
	    
	    List<TimelineDto> timelinesDto = Collections.emptyList(); 
	    if(carrierMatches(appCarrier[0], ANTHEM_BLUE_CROSS)) {
	        Long carrierId = getCarrier().getCarrierId();
	        List<Timeline> timelines = timelineRepository.findByClientIdAndCarrierIdOrderByRefNumAsc(clientId, carrierId);
	        timelinesDto = ObjectMapperUtils.mapAll(timelines, TimelineDto.class);
	    }      
	    
	    Client client = getClient(clientId);
	    if (timelinesDto.isEmpty()) {
     		timelinesDto = getDefaultCarrierTimelines(client);
    		for (TimelineDto dto : timelinesDto) {
    			Timeline tl = ObjectMapperUtils.map(dto, Timeline.class);
    			tl = timelineRepository.save(tl);
    			dto.setTimelineId(tl.getTimelineId());
    		}
	    }
		
	    ClientAttribute attribute = attributeRepository.findClientAttributeByClientIdAndName(clientId, AttributeName.TIMELINE_IS_ENABLED);
	    // do not create second time
	    if (attribute == null) {
		    attributeRepository.save(new ClientAttribute(client, AttributeName.TIMELINE_IS_ENABLED));
	    }
	
	    return createTimelineGroups(timelinesDto);
	}

	private Timeline getTimeline(Long timelineId) {
		Timeline timeline = timelineRepository.findOne(timelineId);
		if (timeline == null) {
 			throw new NotFoundException("Timeline not found")
				.withFields(
					field("timeline_id", timelineId)
				);
 		}
		return timeline;
	}

	private Client getClient(Long clientId) {
		Client client = clientRepository.findOne(clientId);
 		if (client == null) {
 			throw new NotFoundException("Client not found")
				.withFields(
					field("client_id", clientId)
				);
 		}
 		return client;
	}

	private Carrier getCarrier() {
	    return carrierRepository.findByName(appCarrier[0]);
    }

	private List<TimelineDto> getDefaultCarrierTimelines(Client client) {
        List<TimelineDto> result = new ArrayList<>();

        if(carrierMatches(appCarrier[0], ANTHEM_BLUE_CROSS)) {
            Long clientId = client.getClientId();
            Long carrierId = getCarrier().getCarrierId();

 			result.add(new TimelineDto(1, clientId,  carrierId, "Confirm sold products, plans and rates", "Client", getDate(1)));
 			result.add(new TimelineDto(2, clientId, carrierId, "Identify product offering by classification or location", "Client", getDate(3)));
 			result.add(new TimelineDto(3, clientId, carrierId, "Return executed new group paperwork", "Client", getDate(4)));
 			result.add(new TimelineDto(4, clientId, carrierId, "First Impressions Set-up [If Applicable]", "Anthem", getDate(5)));
 			result.add(new TimelineDto(5, clientId, carrierId, "Introduce Kickoff meeting", "Client", getDate(9)));
 			result.add(new TimelineDto(6, clientId, carrierId, "Develop billing and administrative group structure", "Client", getDate(11)));
 			result.add(new TimelineDto(7, clientId, carrierId, "Provide approval on group structure", "Client", getDate(14)));
 			result.add(new TimelineDto(8, clientId, carrierId, "Confirm Eligibility Submission Format", "Client", getDate(16)));
 			result.add(new TimelineDto(9, clientId, carrierId, "Submit Enrollment", "Client", getDate(39)));
 			result.add(new TimelineDto(10, clientId, carrierId, "Eligibility Loading", "Client", getDate(46)));
 			result.add(new TimelineDto(11, clientId, carrierId, "Missing Information Report [If Applicable]", "Anthem", getDate(47)));
 			result.add(new TimelineDto(12, clientId, carrierId, "Confirm release of ID Cards", "Anthem", getDate(47)));
 		}

 		return result;
 	}

	private Date getDate(int daysFromNow) {
		Calendar c = Calendar.getInstance();
		c.add(Calendar.DATE, daysFromNow);
		return c.getTime();
	}



}
