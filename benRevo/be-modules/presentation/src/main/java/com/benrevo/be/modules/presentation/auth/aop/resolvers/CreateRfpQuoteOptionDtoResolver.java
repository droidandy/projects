package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.dto.CreateRfpQuoteOptionDto;
import org.springframework.stereotype.Service;

@Service
public class CreateRfpQuoteOptionDtoResolver implements ClientIdResolver<CreateRfpQuoteOptionDto> {

    @Override
    public Long resolveClientId(CreateRfpQuoteOptionDto dto) {
        return dto.getClientId();
    }
}
