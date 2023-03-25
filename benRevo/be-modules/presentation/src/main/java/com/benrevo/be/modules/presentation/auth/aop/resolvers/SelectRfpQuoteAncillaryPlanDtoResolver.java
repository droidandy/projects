package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import static com.benrevo.common.util.MapBuilder.field;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.dto.ancillary.SelectRfpQuoteAnsillaryPlanDto;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SelectRfpQuoteAncillaryPlanDtoResolver implements ClientIdResolver<SelectRfpQuoteAnsillaryPlanDto> {

    @Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;

    @Override
    public Long resolveClientId(SelectRfpQuoteAnsillaryPlanDto parameter) {
        if(parameter == null) {
            return null;
        }
        Long rfpQuoteAncillaryOptionId = parameter.getRfpQuoteAncillaryOptionId();
        RfpQuoteAncillaryOption opt = rfpQuoteAncillaryOptionRepository.findOne(rfpQuoteAncillaryOptionId);
        if(opt == null) {
            throw new NotFoundException("No RfpQuoteAncillaryOption found by id")
                .withFields(field("rfp_quote_ancillary_option_id", rfpQuoteAncillaryOptionId));
        }
        return opt.getRfpQuote().getRfpSubmission().getClient().getClientId();
    }
}
