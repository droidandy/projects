package com.benrevo.broker.service;

import static com.benrevo.common.enums.CarrierType.BENREVO;

import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(BENREVO)
@Transactional
public class BrokerPlanService extends SharedPlanService {

    @Autowired
    private PresentationService presentationService;

    @Override
    public AncillaryPlanDto updateAncillaryPlan(Long clientId, AncillaryPlanDto planParams) {
        AncillaryPlanDto updated = super.updateAncillaryPlan(clientId, planParams);
        presentationService.updateBrokerAppAncillaryRenewalCardFromCurrentPlan(clientId, updated);
        return updated;
    }
}
