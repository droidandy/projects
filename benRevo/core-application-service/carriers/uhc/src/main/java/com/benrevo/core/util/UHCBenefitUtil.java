package com.benrevo.core.util;

import com.benrevo.be.modules.shared.util.BenefitUtil;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionPlanAlternativesDto;
import com.benrevo.data.persistence.entities.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import static com.benrevo.common.enums.CarrierType.UHC;

/**
 * Created by AKorchak on 17/1/18.
 */
@AppCarrier(UHC)
@Component
public class UHCBenefitUtil extends BenefitUtil {
    
    final float MOTION_PPO_INDIVIDUAL_DISCOUNT = 1460f;
    final float MOTION_PPO_FAMILY_DISCOUNT = 2920f;
    final float MOTION_HSA_INDIVIDUAL_DISCOUNT = 1095f;
    final float MOTION_HSA_FAMILY_DISCOUNT = 2190f;
    final String MOTION_DISCOUNT_TYPE = "MOTION";

    @Override
    public void applyDiscount(QuoteOptionPlanAlternativesDto result, RfpQuoteNetwork rfpQuoteNetwork) {

        if (StringUtils.containsIgnoreCase(rfpQuoteNetwork.getRfpQuoteOptionName(),"motion")) {
            
            // apply MOTION discount
            float individualDiscount;
            float familyDiscount;
            switch (rfpQuoteNetwork.getNetwork().getType()) {
                case "PPO":
                    individualDiscount = MOTION_PPO_INDIVIDUAL_DISCOUNT;
                    familyDiscount = MOTION_PPO_FAMILY_DISCOUNT;
                    break;
                case "HSA":
                    individualDiscount = MOTION_HSA_INDIVIDUAL_DISCOUNT;
                    familyDiscount = MOTION_HSA_FAMILY_DISCOUNT;
                    break;
                default:
                    // no discount
                    return;
            }
            
            for (QuoteOptionAltPlanDto plan : result.getPlans()) {
                if (QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT.equals(plan.getType())) {
                    // skip current plan
                    continue;
                }
                
                for (QuoteOptionAltPlanDto.Benefit benefit : plan.getBenefits()) {
                    if ("INDIVIDUAL_DEDUCTIBLE".equals(benefit.sysName)) {
                        benefit.name = "Net " + benefit.name;
                        calculateValues(benefit, individualDiscount);
                    } else if ("FAMILY_DEDUCTIBLE".equals(benefit.sysName)) {
                        benefit.name = "Net " + benefit.name;
                        calculateValues(benefit, familyDiscount);
                    }
                }
            }
        }
    }

    private void calculateValues(QuoteOptionAltPlanDto.Benefit benefit, float discount) {
        if (benefit.value != null) {
            benefit.discountType = MOTION_DISCOUNT_TYPE;
            benefit.originalValue = benefit.value;
            benefit.discountValue = Float.toString(discount);
            benefit.value = calculateValue(benefit.type, benefit.value, discount, benefit.discountValue);
        }
        if (benefit.valueIn != null) {
            benefit.discountTypeIn = MOTION_DISCOUNT_TYPE;
            benefit.originalValueIn = benefit.valueIn;
            benefit.discountValueIn = Float.toString(discount);
            benefit.valueIn = calculateValue(benefit.typeIn, benefit.valueIn, discount, benefit.discountValueIn);
        }
        if (benefit.valueOut != null) {
            benefit.discountTypeOut = MOTION_DISCOUNT_TYPE;
            benefit.originalValueOut = benefit.valueOut;
            benefit.discountValueOut = Float.toString(discount);
            benefit.valueOut = calculateValue(benefit.typeOut, benefit.valueOut, discount, benefit.discountValueOut);
        }
    }

    private String calculateValue(String type, String strValue, float discount, String strDiscount) {
        String result = null;
        if ("DOLLAR".equals(type)) {
            try {
                float value = Float.parseFloat(strValue);
                float netValue = value - discount;
                result = (netValue <= 0) ? "0" : Float.toString(netValue);
            } catch (NumberFormatException e) {
                // Skip
            }
        } 
        
        if (result == null) {
            // FIXME What to do if we can't calculate
            result = strValue + " - " + strDiscount; 
        }
        return result;
    }

    
}
