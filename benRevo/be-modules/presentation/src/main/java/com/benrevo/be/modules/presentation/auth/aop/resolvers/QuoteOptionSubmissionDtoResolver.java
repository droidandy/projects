package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.dto.QuoteOptionSubmissionDto;
import org.springframework.stereotype.Service;

@Service
public class QuoteOptionSubmissionDtoResolver implements ClientIdResolver<QuoteOptionSubmissionDto> {

    @Override
    public Long resolveClientId(QuoteOptionSubmissionDto parameter) {
        return parameter.getClientId();
    }
}
