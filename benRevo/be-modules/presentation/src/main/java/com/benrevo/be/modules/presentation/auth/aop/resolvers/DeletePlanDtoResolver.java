package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.dto.DeletePlanDto;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import static com.benrevo.common.util.MapBuilder.field;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeletePlanDtoResolver implements ClientIdResolver<DeletePlanDto> {

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;
    
    @Override
    public Long resolveClientId(DeletePlanDto dto) {
        
        RfpQuoteNetwork rfpQuoteNetwork = rfpQuoteNetworkRepository.findOne(dto.getRfpQuoteNetworkId());

        if(rfpQuoteNetwork == null) {
            throw new NotFoundException("No RFP quote network found").withFields(
                field("rfp_quote_network_id", dto.getRfpQuoteNetworkId()));
        }

        return rfpQuoteNetwork.getRfpQuote().getRfpSubmission().getClient().getClientId();

    }
}
