package com.benrevo.be.modules.presentation.auth.aop.resolvers;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClientPlanIdResolver implements ClientIdResolver<Long> {

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Override
    public Long resolveClientId(Long clientPlanId) {
        ClientPlan plan = clientPlanRepository.findOne(clientPlanId);
        return plan == null ? null : plan.getClient().getClientId();
    }
}
