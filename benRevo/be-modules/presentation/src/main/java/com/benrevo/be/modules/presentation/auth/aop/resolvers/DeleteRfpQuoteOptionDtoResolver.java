package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.dto.DeleteRfpQuoteOptionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeleteRfpQuoteOptionDtoResolver implements ClientIdResolver<DeleteRfpQuoteOptionDto> {

    @Autowired
    private RfpQuoteOptionIdResolver rfpQuoteOptionIdResolver;

    @Override
    public Long resolveClientId(DeleteRfpQuoteOptionDto parameter) {
        Long rfpQuoteOptionId = parameter.getRfpQuoteOptionId();
        return rfpQuoteOptionIdResolver.resolveClientId(rfpQuoteOptionId);
    }
}
