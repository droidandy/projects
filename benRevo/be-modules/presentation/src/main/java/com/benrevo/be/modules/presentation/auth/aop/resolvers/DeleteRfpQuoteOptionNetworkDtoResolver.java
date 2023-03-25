package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.dto.DeleteRfpQuoteOptionNetworkDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class DeleteRfpQuoteOptionNetworkDtoResolver implements ClientIdResolver<DeleteRfpQuoteOptionNetworkDto> {

    @Autowired
    private RfpQuoteOptionNetworkIdResolver rfpQuoteOptionNetworkIdResolver;

    @Override
    public Long resolveClientId(DeleteRfpQuoteOptionNetworkDto parameter) {
        Long rfpQuoteOptionNetworkId = parameter.getRfpQuoteOptionNetworkId();
        return rfpQuoteOptionNetworkIdResolver.resolveClientId(rfpQuoteOptionNetworkId);
    }
}
