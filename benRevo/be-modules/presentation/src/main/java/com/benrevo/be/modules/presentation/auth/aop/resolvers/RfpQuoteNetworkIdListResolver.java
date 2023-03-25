package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import static com.benrevo.common.util.MapBuilder.field;
import static org.apache.commons.collections4.CollectionUtils.isEmpty;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RfpQuoteNetworkIdListResolver implements ClientIdResolver<List<Long>>{

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Override
    public Long resolveClientId(List<Long> rfpQuoteNetworkIds) {
        if(isEmpty(rfpQuoteNetworkIds)) {
            throw new BadRequestException("No rfp quote network ids provided");
        }

        Long rfpQuoteNetworkId = rfpQuoteNetworkIds.get(0);

        RfpQuoteNetwork rfpQuoteNetwork = rfpQuoteNetworkRepository.findOne(rfpQuoteNetworkId);

        if(rfpQuoteNetwork == null) {
            throw new NotFoundException("No quote network found")
                .withFields(field("rfp_quote_network_id", rfpQuoteNetwork));
        }

        return rfpQuoteNetwork.getRfpQuote().getRfpSubmission().getClient().getClientId();
    }
}
