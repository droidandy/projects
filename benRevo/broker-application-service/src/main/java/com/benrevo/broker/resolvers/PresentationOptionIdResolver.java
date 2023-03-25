package com.benrevo.broker.resolvers;

import static com.benrevo.common.util.MapBuilder.field;

import com.benrevo.be.modules.shared.aop.auth.resolvers.ClientIdResolver;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.PresentationOption;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.repository.PresentationOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PresentationOptionIdResolver implements ClientIdResolver<Long> {

    @Autowired
    private PresentationOptionRepository presentationOptionRepository;

    @Override
    public Long resolveClientId(Long presentationOptionId) {
        PresentationOption option = presentationOptionRepository.findOne(presentationOptionId);

        if(option == null) {
            throw new NotFoundException("No presentation option found")
                .withFields(field("presentation_option_id", presentationOptionId));
        }

        return option.getClient().getClientId();
    }
}
