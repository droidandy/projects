package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import static com.benrevo.common.util.MapBuilder.field;
import static org.apache.commons.collections4.CollectionUtils.isEmpty;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RfpQuoteOptionIdListResolver implements ClientIdResolver<List<Long>>{

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Override
    public Long resolveClientId(List<Long> rfpQuoteOptionIds) {
        if(isEmpty(rfpQuoteOptionIds)) {
            throw new BadRequestException("No rfp quote option ids provided");
        }

        Long rfpQuoteOptionId = rfpQuoteOptionIds.get(0);

        RfpQuoteOption quoteOption = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);

        if(quoteOption == null) {
            throw new NotFoundException("No quote option found")
                .withFields(field("rfp_quote_option_id", rfpQuoteOptionId));
        }

        return quoteOption.getRfpQuote().getRfpSubmission().getClient().getClientId();
    }
}
