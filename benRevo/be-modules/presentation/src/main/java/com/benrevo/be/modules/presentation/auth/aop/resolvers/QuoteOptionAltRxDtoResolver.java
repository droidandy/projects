package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.dto.QuoteOptionAltRxDto;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;

@Service
public class QuoteOptionAltRxDtoResolver implements ClientIdResolver<QuoteOptionAltRxDto> {

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;
    
    @Override
    public Long resolveClientId(QuoteOptionAltRxDto dto) {
    	Long clientId = null;
    	RfpQuoteNetworkPlan plan = null;
		if (dto.getRfpQuoteNetworkPlanId() != null) {
			plan = rfpQuoteNetworkPlanRepository.findOne(dto.getRfpQuoteNetworkPlanId());
			if (plan != null) {
				clientId = plan.getRfpQuoteNetwork().getRfpQuote().getRfpSubmission().getClient().getClientId();
			}
		}
        return clientId;
    }
}
