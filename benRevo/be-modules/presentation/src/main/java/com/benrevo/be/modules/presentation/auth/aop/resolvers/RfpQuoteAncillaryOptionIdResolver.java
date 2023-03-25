package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import static com.benrevo.common.util.MapBuilder.field;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RfpQuoteAncillaryOptionIdResolver implements ClientIdResolver<Long> {

    @Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;

    @Override
    public Long resolveClientId(Long rfpQuoteAncillaryOptionId) {
        RfpQuoteAncillaryOption quoteOption = rfpQuoteAncillaryOptionRepository.findOne(rfpQuoteAncillaryOptionId);

        if(quoteOption == null) {
            throw new NotFoundException("No ancillary quote option found")
                .withFields(field("rfp_quote_ancillary_option_id", rfpQuoteAncillaryOptionId));
        }

        return quoteOption.getRfpQuote().getRfpSubmission().getClient().getClientId();
    }
}
