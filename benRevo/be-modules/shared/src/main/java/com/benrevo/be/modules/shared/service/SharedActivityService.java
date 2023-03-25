package com.benrevo.be.modules.shared.service;

import static java.util.Optional.ofNullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.common.enums.CompetitiveInfoOption;
import com.benrevo.common.enums.ProbabilityOption;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.repository.ActivityRepository;

@Service
@Transactional
public class SharedActivityService {
    
    @Autowired
    private ActivityRepository activityRepository;

    public Activity save(Activity activity) {
        
        validate(activity);

        // set latest=false for previous activities
        ofNullable(activityRepository.findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(
                activity.getClientId(),
                activity.getType(), 
                activity.getOption(),
                activity.getProduct(),
                activity.getCarrierId()))
            .ifPresent(prev -> {
                prev.setLatest(false);
            });

        return activityRepository.save(activity);

    }

    public void validate(Activity activity) {
        switch(activity.getType()) {
            case COMPETITIVE_INFO:
                // validate enum
                CompetitiveInfoOption optionEnum = CompetitiveInfoOption.valueOf(activity.getOption());
                if (optionEnum != CompetitiveInfoOption.DIFFERENCE) {
                    activity.setCarrierId(null);
                    activity.setProduct(null);
                } 
                break;
            case PROBABILITY:
                // validate enum
                ProbabilityOption.valueOf(activity.getValue());
                activity.setCarrierId(null);
                activity.setProduct(null);
                activity.setOption(null);
                break;
            case OPTION1_RELEASED: case RENEWAL_ADDED:
                activity.setCarrierId(null);
                activity.setOption(null);
                break;
            case QUOTE_VIEWED:
                activity.setCarrierId(null);
                activity.setOption(null);
                break;
            case REWARD:
                activity.setCarrierId(null);
                activity.setProduct(null);
                activity.setOption(null);
                break;
            default:
                break;
        }
    }

}
