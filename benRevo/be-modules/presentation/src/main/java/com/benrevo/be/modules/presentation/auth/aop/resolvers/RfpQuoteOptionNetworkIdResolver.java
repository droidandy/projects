package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import static com.benrevo.common.util.MapBuilder.field;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RfpQuoteOptionNetworkIdResolver implements ClientIdResolver<Long> {

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Override
    public Long resolveClientId(Long rfpQuoteOptionNetworkId) {
        RfpQuoteOptionNetwork quoteOptionNetwork = rfpQuoteOptionNetworkRepository.findOne(rfpQuoteOptionNetworkId);

        if(quoteOptionNetwork == null) {
            throw new NotFoundException("No quote option network found")
            .withFields(field("rfp_quote_option_network_id", rfpQuoteOptionNetworkId));
        }

        return quoteOptionNetwork.getRfpQuoteOption().getRfpQuote().getRfpSubmission().getClient().getClientId();
    }
}
