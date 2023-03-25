package com.benrevo.dashboard.service;

import static com.benrevo.common.enums.CarrierType.UHC;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.ActivityDto;
import com.benrevo.common.dto.ClientDetailsDto;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.data.persistence.entities.Activity;

@Service
@AppCarrier(UHC)
@Transactional
public class UHCDashboardClientDetailsService extends ClientDetailsService {
    
    private static final String DECREASED = "decreased";
    private static final String INCREASED = "increased";
    private static final String RENEWAL_NOTES_FORMAT = "%s renewal %s from %s to %s.";

    @Override
    public ClientDetailsDto getClientDetails(Long clientId, String product) {
        
        ClientDetailsDto result = super.getClientDetails(clientId, product);
        List<ActivityDto> differences = new ArrayList<>();

        Activity initialActivity = activityRepository
                .findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(
                        clientId, ActivityType.INITIAL_RENEWAL, null, product, null);
        if (initialActivity != null) {
            ActivityDto initialRenewal = toDto(initialActivity);
            initialRenewal.setText(
                    NumberUtils.toFloat(initialActivity.getValue(), 0F) >= 0F 
                    ? "Starting Increase"
                    : "Starting Decrease");
            differences.add(initialRenewal);
        };

        for (ActivityDto difference : result.getDifferences()) {
            if (ActivityType.RENEWAL_ADDED.equals(difference.getType())) {
                if (initialActivity == null || Objects.equals(initialActivity.getValue(), difference.getValue())) {
                    // remove RenewalAdded with difference == 0
                    // it could happened if current renewal total was changed back to a starting value
                    continue;
                }
                
                difference.setText(
                        NumberUtils.toFloat(difference.getValue(), 0F) >= 0F
                        ? "Current Increase"
                        : "Current Decrease");
            }
            differences.add(difference);
        }
        result.setDifferences(differences);
        
        return result;
        
    }
    
    @Override
    public List<ActivityDto> getAllActivities(Long clientId) {

        List<ActivityDto> activities = super.getAllActivities(clientId);

        // find initial values
        ActivityDto medicalInitial = null;
        ActivityDto dentalInitial = null;
        ActivityDto visionInitial = null;
        for (ActivityDto activity : activities) {
            if (ActivityType.INITIAL_RENEWAL.equals(activity.getType())) {
                if (Constants.MEDICAL.equals(activity.getProduct())) {
                    medicalInitial = activity;
                } else if (Constants.DENTAL.equals(activity.getProduct())) {
                    dentalInitial = activity;
                } else if (Constants.VISION.equals(activity.getProduct())) {
                    visionInitial = activity;
                }
            }
        }

        List<ActivityDto> result = new ArrayList<>();
        for (ActivityDto a : activities) {
            if (ActivityType.RENEWAL_ADDED.equals(a.getType())) {
                String initialDiffValue = null;
                if (medicalInitial != null && Constants.MEDICAL.equals(a.getProduct())) {
                    initialDiffValue = medicalInitial.getValue(); 
                } else if (dentalInitial != null && Constants.DENTAL.equals(a.getProduct())) {
                    initialDiffValue = dentalInitial.getValue();
                } else if (visionInitial != null && Constants.VISION.equals(a.getProduct())) {
                    initialDiffValue = visionInitial.getValue();
                }
                if (initialDiffValue == null || Objects.equals(initialDiffValue, a.getValue())) {
                    // remove RenewalAdded with difference == 0
                    // it could happened if current renewal total was changed back to a starting value
                    continue;
                }
                float diff = NumberUtils.toFloat(a.getValue(), 0F) - NumberUtils.toFloat(initialDiffValue, 0F);
                a.setText(String.format("(%s%%)", Float.toString(diff)));
                a.setNotes(String.format(RENEWAL_NOTES_FORMAT, 
                        StringUtils.capitalize(StringUtils.lowerCase(a.getProduct())), 
                        diff >= 0 ? INCREASED : DECREASED, 
                        initialDiffValue, 
                        a.getValue()));
            }
            result.add(a);
        }

        // for UI to display
        if (medicalInitial != null) {
            medicalInitial.setType(ActivityType.RENEWAL_ADDED);
        }
        if (dentalInitial != null) {
            dentalInitial.setType(ActivityType.RENEWAL_ADDED);
        }
        if (visionInitial != null) {
            visionInitial.setType(ActivityType.RENEWAL_ADDED);
        }
        
        return result;
    }
}
