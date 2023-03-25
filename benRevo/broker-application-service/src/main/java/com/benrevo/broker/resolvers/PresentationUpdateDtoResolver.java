package com.benrevo.broker.resolvers;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.dto.PresentationUpdateDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PresentationUpdateDtoResolver implements ClientIdResolver<PresentationUpdateDto> {

    @Autowired
    private PresentationOptionIdResolver presentationOptionIdResolver;

    @Override
    public Long resolveClientId(PresentationUpdateDto parameter) {
        return presentationOptionIdResolver.resolveClientId(parameter.getPresentationOptionId());
    }
}
