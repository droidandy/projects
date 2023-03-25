package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.dto.UpdateContributionsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UpdateContributionsDtoListResolver implements ClientIdResolver<List<UpdateContributionsDto>> {

    @Autowired
    private RfpQuoteOptionNetworkIdResolver rfpQuoteOptionNetworkIdResolver;

    @Override
    public Long resolveClientId(List<UpdateContributionsDto> parameter) {
        Long rfpQuoteOptionNetworkId = parameter.get(0).getRfpQuoteOptionNetworkId();
        return rfpQuoteOptionNetworkIdResolver.resolveClientId(rfpQuoteOptionNetworkId);
    }
}
