package com.benrevo.be.modules.shared.util;

import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionPlanAlternativesDto;
import com.benrevo.data.persistence.entities.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import static java.util.function.Function.identity;

/**
 * Created by AKorchak on 17/1/18.
 */
@Component
public class BenefitUtil {
    
    private static Pattern SPLIT_PATTERN1 = 
            Pattern.compile("^\\$?([\\d,]++)\\s*+(?>x|X)([\\d\\.]++)$"); // $3,000x2.75 or 3,000X2.75 or $3000 x2
    private static Pattern SPLIT_PATTERN2 = 
            Pattern.compile("^\\$([\\d,]++)/\\$?([\\d,]++)$"); // $3,000/$6,000 or $3,000/6,000
    private static Pattern SPLIT_PATTERN3 = 
            Pattern.compile("^\\$([\\d,]++)/\\$?([\\d,]+)[/,]\\$([\\d,]++)$"); // $3,000/$6,000/$9,000 or $3,000/$6,000,$9,000 
    
    public void highlight(QuoteOptionPlanAlternativesDto result,
            QuoteOptionAltPlanDto currentPlan) {
        // highlight benefits
        if(currentPlan != null) {
            Map<String, QuoteOptionAltPlanDto.Benefit> benefitsToHighlight =
                    currentPlan.getBenefits()
                    .stream()
                    .filter(b -> (b.highlightType != null))
                    .collect(Collectors.toMap(b -> b.sysName, identity()));
            
            for (QuoteOptionAltPlanDto plan : result.getPlans()) {
                if (QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT.equals(plan.getType())) {
                    // skip current plan
                    continue;
                }
                
                for (QuoteOptionAltPlanDto.Benefit benefit : plan.getBenefits()) {
                    QuoteOptionAltPlanDto.Benefit currentBenefit = benefitsToHighlight.get(benefit.sysName);
                    if (currentBenefit != null) {
                        compareAndHighlight(benefit, currentBenefit);
                    }
                }
            }
        }
    }

    private void compareAndHighlight(QuoteOptionAltPlanDto.Benefit benefit, QuoteOptionAltPlanDto.Benefit currentBenefit) {
        benefit.highlight = compareValues(benefit.type, currentBenefit.type, benefit.value, currentBenefit.value, currentBenefit.highlightType);
        benefit.highlightIn = compareValues(benefit.typeIn, currentBenefit.typeIn, benefit.valueIn, currentBenefit.valueIn, currentBenefit.highlightType);
        benefit.highlightOut = compareValues(benefit.typeOut, currentBenefit.typeOut, benefit.valueOut, currentBenefit.valueOut, currentBenefit.highlightType);
    }

    private String compareValues(String type, String currentType, String value, String currentValue, String highlightType) {
        if (currentType == null) { return null; }
        if (!currentType.equals(type)) {
            // TODO compare different formats
            return null;
        }

        switch (currentType) {
            case "DOLLAR":
            case "PERCENT":
            case "MULTIPLE":
            case "NUMBER":
                float floatValue;
                float floatCurrentValue;
                try {
                    floatValue = Float.parseFloat(value);
                    floatCurrentValue = Float.parseFloat(currentValue);
                } catch (Exception e) {
                    return null;
                }
                if (floatValue == floatCurrentValue) {
                    return null; // do not highlight or return NONE
                }
                if ("MORE".equals(highlightType)) {
                    return (floatValue > floatCurrentValue)?"POS":"NEG";
                }
                if ("LESS".equals(highlightType)) {
                    return (floatValue > floatCurrentValue)?"NEG":"POS";
                }
                break;
        }
        // TODO compare STRING format
        return null;
    }

    public void applyDiscount(QuoteOptionPlanAlternativesDto result,
            RfpQuoteNetwork rfpQuoteNetwork) {
        // do nothing
    }

    public List<String> splitBenefits(String valueToSplit) {
        String individual = null;
        String family = null;
               
        if (valueToSplit == null ||
                valueToSplit.length() == 0 ||
                valueToSplit.equalsIgnoreCase("N/A") || 
                valueToSplit.equals("$0") ) {
            individual = "N/A";
            family = "N/A";
        } else if (StringUtils.containsIgnoreCase(valueToSplit,"per member")) {
            individual = valueToSplit;
            family = valueToSplit;
        } else {
            List<String> values = new ArrayList<>(3);
            if (contains(valueToSplit, SPLIT_PATTERN1, values)) {
                individual = "$" + values.get(0);
                family = "$" + Math.round(
                        Integer.parseInt(values.get(0).replace(",", "")) * 
                        Float.parseFloat(values.get(1)));
            } else if (contains(valueToSplit, SPLIT_PATTERN2, values)) {
                individual = "$" + values.get(0);
                family = "$" + values.get(1);
            } else if (contains(valueToSplit, SPLIT_PATTERN3, values)) {
                individual = (values.get(0).equals(values.get(1))) ?
                            "$" + values.get(0) :
                            "$" + values.get(0) + "/$" + values.get(1);
                family = "$" + values.get(2);
            } else {
                throw new IllegalArgumentException(String.format("Can't split value=%s", valueToSplit));
            }
        }
        return Arrays.asList(individual, family);
    }
    
    public List<String> getValuesOrSplitBenefits(String individual, String family) {
        if (StringUtils.isBlank(family)) {
            return splitBenefits(individual);
        }
        return Arrays.asList(individual, family);
    }
    
    private boolean contains(String value, Pattern pattern, List<String> values) {
        Matcher m = pattern.matcher(value);
        if (m.find()) {
            if (values != null) {
                values.clear();
                for (int i=1; i <= m.groupCount(); i++) {
                    values.add(m.group(i));
                }
            }
            return true;
        }
        return false;
    }

    
}
