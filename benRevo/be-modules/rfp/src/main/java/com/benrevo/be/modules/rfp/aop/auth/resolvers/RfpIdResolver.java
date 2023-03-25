package com.benrevo.be.modules.rfp.aop.auth.resolvers;

import com.benrevo.be.modules.rfp.service.BaseRfpService;
import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RfpIdResolver implements ClientIdResolver<Long> {

    @Autowired
    private BaseRfpService baseRfpService;

    @Override
    public Long resolveClientId(Long rfpId) {
        return baseRfpService.getById(rfpId).getClientId();
    }
}
