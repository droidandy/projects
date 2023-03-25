package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.dto.FavoriteRfpQuoteNetworkPlanDto;
import com.benrevo.common.dto.SelectRfpQuoteOptionNetworkPlanDto;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FavoriteRfpQuoteNetworkPlanDtoResolver implements ClientIdResolver<FavoriteRfpQuoteNetworkPlanDto> {

    @Autowired
    private RfpQuoteIdResolver rfpQuoteIdResolver;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Override
    public Long resolveClientId(FavoriteRfpQuoteNetworkPlanDto parameter) {
        Long rfpQuoteNetworkId =  parameter.getRfpQuoteNetworkId();
        RfpQuoteNetwork rqn = rfpQuoteNetworkRepository.findOne(rfpQuoteNetworkId);

        if(rqn == null || rqn.getRfpQuote() == null){
            return null;
        }
        return rfpQuoteIdResolver.resolveClientId(rqn.getRfpQuote().getRfpQuoteId());
    }
}
