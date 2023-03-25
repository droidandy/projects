package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RfpQuoteIdResolver implements ClientIdResolver<Long> {

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Override
    public Long resolveClientId(Long rfpQuoteId) {
        RfpQuote rfpQuote = rfpQuoteRepository.findOne(rfpQuoteId);
        return rfpQuote.getRfpSubmission().getClient().getClientId();
    }
}
