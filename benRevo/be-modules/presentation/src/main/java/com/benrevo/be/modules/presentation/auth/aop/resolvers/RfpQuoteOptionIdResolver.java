package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import static com.benrevo.common.util.MapBuilder.field;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.dto.QuoteOptionDto;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RfpQuoteOptionIdResolver implements ClientIdResolver<Long> {

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Override
    public Long resolveClientId(Long rfpQuoteOptionId) {
        RfpQuoteOption quoteOption = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);

        if(quoteOption == null) {
            throw new NotFoundException("No quote option found")
                .withFields(field("rfp_quote_option_id", rfpQuoteOptionId));
        }

        return quoteOption.getRfpQuote().getRfpSubmission().getClient().getClientId();
    }
}
