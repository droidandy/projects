package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import static com.benrevo.common.util.MapBuilder.field;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;

@Service
public class CreatePlanDtoResolver implements ClientIdResolver<CreatePlanDto> {

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;
    
    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;
    
    @Override
    public Long resolveClientId(CreatePlanDto dto) {
		if (dto.getRfpQuoteNetworkPlanId() != null) { // required for /plans/update API call
			RfpQuoteNetworkPlan plan = rfpQuoteNetworkPlanRepository.findOne(dto.getRfpQuoteNetworkPlanId());
			if (plan != null) {
				return plan.getRfpQuoteNetwork().getRfpQuote().getRfpSubmission().getClient().getClientId();
			} else {
				return null;
			}
		} else { //  required for most API call except /plans/update
	        RfpQuoteNetwork rfpQuoteNetwork = rfpQuoteNetworkRepository.findOne(dto.getRfpQuoteNetworkId());

	        if(rfpQuoteNetwork == null) {
	            throw new NotFoundException("No RFP quote network found").withFields(
	                field("rfp_quote_network_id", dto.getRfpQuoteNetworkId()));
	        }

	        return rfpQuoteNetwork.getRfpQuote().getRfpSubmission().getClient().getClientId();
		}
    }
}
