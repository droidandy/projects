package com.benrevo.admin.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;

import com.benrevo.be.modules.admin.service.BaseTimelineService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.Timeline;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.TimelineRepository;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemTimelineService extends BaseTimelineService {

	@Autowired
	private TimelineRepository timelineRepository;

	@Autowired
	private CarrierRepository carrierRepository;
	
	@Autowired
	private AttributeRepository attributeRepository;

	@Value("${app.carrier}")
	String[] appCarrier;

    @Override
	public void removeTimelinesByClientId(Long clientId) {
		List<Timeline> timelines = timelineRepository.findByClientIdAndCarrierIdOrderByRefNumAsc(clientId, getCarrier().getCarrierId());
		timelineRepository.delete(timelines);
		
		ClientAttribute attribute = attributeRepository.findClientAttributeByClientIdAndName(clientId, AttributeName.TIMELINE_IS_ENABLED);
		if (attribute != null) {
		    attributeRepository.delete(attribute);
		}
	}

	private Carrier getCarrier() {
	    return carrierRepository.findByName(appCarrier[0]);
    }
}
