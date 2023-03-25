package com.benrevo.core.service;


import static com.benrevo.common.enums.CarrierType.UHC;
import static java.util.Optional.ofNullable;
import java.util.Comparator;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.QuoteOptionPlanDetailsDto;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.Rider;

@Service
@AppCarrier(UHC)
@Transactional
public class UHCRfpQuoteService extends RfpQuoteService {
	
    @Override
    protected void setQuoteDiscount(QuoteOptionPlanDetailsDto detailedPlan, RfpQuoteOptionNetwork optNetwork) {
        if (StringUtils.containsIgnoreCase(optNetwork.getRfpQuoteNetwork().getRfpQuoteOptionName(),"motion")) {
            detailedPlan.setDiscountType("MOTION");
        }
    } 

    @Override
    protected void autoSelectPlan(RfpQuoteOptionNetwork rqon) {
        ofNullable(rqon)
            .map(RfpQuoteOptionNetwork::getRfpQuoteOption)
            .map(RfpQuoteOption::getRfpQuote)
            .map(RfpQuote::getRfpSubmission)
            .map(RfpSubmission::getClient)
            .ifPresent(client -> {
                RfpQuoteNetworkPlan matchPlan = null;
                RfpQuoteNetworkPlan matchRxPlan = null;
                int planYear = client.getEffectiveYear();
                for(RfpQuoteNetworkPlan plan : rqon.getRfpQuoteNetwork().getRfpQuoteNetworkPlans()) {
                    if(plan.isMatchPlan() && plan.getPnn().getPlan().getPlanYear() == planYear) {
                        if(plan.getPnn().getPlanType().startsWith("RX_")) {
                            matchRxPlan = plan;
                        } else {
                            matchPlan = plan;
                        }
                    }
                }
                if(matchPlan != null) {
                    selectQuoteOptionNetworkPlan(rqon.getRfpQuoteOptionNetworkId(), matchPlan.getRfpQuoteNetworkPlanId());
                }
                if(matchRxPlan != null) {
                    selectQuoteOptionNetworkPlan(rqon.getRfpQuoteOptionNetworkId(), matchRxPlan.getRfpQuoteNetworkPlanId());
                }
                
                for(Rider rider : rqon.getRfpQuoteNetwork().getRiders()) {
                    if (rider.isMatch()) {
                        rqon.getSelectedRiders().add(rider);
                    }
                }
            });
    };
}
