package com.benrevo.be.modules.shared.util;

import static com.benrevo.be.modules.shared.util.PlanCalcHelper.getDollarRXRates;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.getRXRates;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.isSelectedPlanFromKaiser;
import static com.benrevo.common.util.MathUtils.round;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.ObjectUtils.defaultIfNull;

import com.benrevo.common.Constants;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.MathUtils;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.BasicRate;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PlanCalcHelper {

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    private static String[] appCarrier;
    
    /**
     * Use Spring @Autowired or static methods call
     */
    @Deprecated 
    public PlanCalcHelper() {}
    
    @Value("${app.carrier}")
    public void setAppCarrier(String[] appCarrier) {
        PlanCalcHelper.appCarrier = appCarrier;
    }

    public static Float calcClientPlanRenewalTotal(ClientPlan clientPlan) {
        return round(
            defaultIfNull(clientPlan.getTier1Renewal(), 0F) * defaultIfNull(clientPlan.getTier1Census(), 0L) +
                defaultIfNull(clientPlan.getTier2Renewal(), 0F) * defaultIfNull(clientPlan.getTier2Census(), 0L) +
                defaultIfNull(clientPlan.getTier3Renewal(), 0F) * defaultIfNull(clientPlan.getTier3Census(), 0L) +
                defaultIfNull(clientPlan.getTier4Renewal(), 0F) * defaultIfNull(clientPlan.getTier4Census(), 0L),
            2);
    }

    public static Long calRfpQuoteOptionNetworkTotalEnrollment(RfpQuoteOptionNetwork rqon) {
        return defaultIfNull(rqon.getTier1Census(), 0L) +
            defaultIfNull(rqon.getTier2Census(), 0L) +
            defaultIfNull(rqon.getTier3Census(), 0L) +
            defaultIfNull(rqon.getTier4Census(), 0L);
    }


    public static Float calcClientPlanTotal(ClientPlan clientPlan) {
        if(clientPlan.getAncillaryPlan() != null) {
            return (float) calcAncillaryPlanTotal(clientPlan.getAncillaryPlan(), 
                PlanCategory.findByPlanType(clientPlan.getPlanType()));
        } 
        return round(
            clientPlan.getTier1Rate() * clientPlan.getTier1Census() + clientPlan.getTier2Rate() * clientPlan.getTier2Census() + clientPlan.getTier3Rate() * clientPlan.getTier3Census()
                + clientPlan.getTier4Rate() * clientPlan.getTier4Census(),
            2);
    }

    public static Float calcAlterRateBankPlanTotal(RfpQuoteOptionNetwork optNetwork, RfpQuoteNetworkPlan networkPlan) {
        return round(
            (defaultIfNull(optNetwork.getTier1Census(), 0L) * defaultIfNull(networkPlan.getTier1Rate(), 0F))
                + (defaultIfNull(optNetwork.getTier2Census(), 0L) * defaultIfNull(networkPlan.getTier2Rate(), 0F))
                + (defaultIfNull(optNetwork.getTier3Census(), 0L) * defaultIfNull(networkPlan.getTier3Rate(), 0F))
                + (defaultIfNull(optNetwork.getTier4Census(), 0L) * defaultIfNull(networkPlan.getTier4Rate(), 0F)),
            2);
    }

    public static Float calcAlterPlanTotal(RfpQuoteOptionNetwork optNetwork, RfpQuoteNetworkPlan networkPlan, RfpQuoteNetworkPlan networkRxPlan, float discountPercent) {

        float[] rxRates = getRXRates(networkRxPlan);
        float[] dollarRxRates = getDollarRXRates(networkRxPlan);
        float[] riders = getRiderCosts(optNetwork);
        float[] specialRiders = getSpecialRiderCosts(optNetwork);
        float discountFactor = 1f;
        if(isDiscountApplicable(optNetwork, networkPlan)) {
            discountFactor = MathUtils.getDiscountFactor(discountPercent);
        }
        // FIXME take into account RatingTiers like in the getRiderCosts()?
        // some test plans in DEV have tier4 values but RatingTiers = 3
        return round(
            (optNetwork.getTier1Census() * (((defaultIfNull(networkPlan.getTier1Rate(), 0F) * rxRates[0] + dollarRxRates[0] + specialRiders[0]) * discountFactor) + riders[0]))
                + (optNetwork.getTier2Census() * (((defaultIfNull(networkPlan.getTier2Rate(), 0F) * rxRates[1] + dollarRxRates[1] + specialRiders[1]) * discountFactor) + riders[1]))
                + (optNetwork.getTier3Census() * (((defaultIfNull(networkPlan.getTier3Rate(), 0F) * rxRates[2] + dollarRxRates[2] + specialRiders[2]) * discountFactor) + riders[2]))
                + (optNetwork.getTier4Census() * (((defaultIfNull(networkPlan.getTier4Rate(), 0F) * rxRates[3] + dollarRxRates[3] + specialRiders[3]) * discountFactor) + riders[3])),
            2);
    }
    public static Float calcAlterPlanTotal(RfpQuoteOptionNetwork optNetwork, RfpQuoteNetworkPlan networkPlan, float discountPercent) {
        return calcAlterPlanTotal(optNetwork, networkPlan, !isNull(optNetwork) ? optNetwork.getSelectedRfpQuoteNetworkRxPlan() : null, discountPercent);
    }
    
    public static double calcPlanTotalBaseForDiscount(RfpQuoteOptionNetwork optNetwork, RfpQuoteNetworkPlan networkPlan) {
        if(isSelectedPlanFromKaiser(optNetwork)) {
            return 0.0;
        }
        float[] rxRates = getRXRates(optNetwork.getSelectedRfpQuoteNetworkRxPlan());
        float[] dollarRxRates = getDollarRXRates(optNetwork.getSelectedRfpQuoteNetworkRxPlan());
        // no riders included, only specialRiders! 
        float[] specialRiders = getSpecialRiderCosts(optNetwork);
        return round(
            (optNetwork.getTier1Census() * (defaultIfNull(networkPlan.getTier1Rate(), 0F) * rxRates[0] + dollarRxRates[0] + specialRiders[0]))
                + (optNetwork.getTier2Census() * (defaultIfNull(networkPlan.getTier2Rate(), 0F) * rxRates[1] + dollarRxRates[1] + specialRiders[1]))
                + (optNetwork.getTier3Census() * (defaultIfNull(networkPlan.getTier3Rate(), 0F) * rxRates[2] + dollarRxRates[2] + specialRiders[2]))
                + (optNetwork.getTier4Census() * (defaultIfNull(networkPlan.getTier4Rate(), 0F) * rxRates[3] + dollarRxRates[3] + specialRiders[3])),
            2);
    }
    
    public static double calcAncillaryPlanTotal(AncillaryPlan plan, PlanCategory category) {
        double optionTotal = 0.0;
        if(plan.getPlanType() == AncillaryPlanType.VOLUNTARY) {
            VoluntaryRate rate = (VoluntaryRate) plan.getRates();
            if(rate != null) {
                optionTotal = rate.getMonthlyCost();
            }
        } else {
            BasicRate rate = (BasicRate) plan.getRates();
            if(rate != null) {
                if (category == PlanCategory.LIFE) {
                    optionTotal =
                        rate.getVolume() / 1000.0 * (rate.getCurrentLife() + rate.getCurrentADD());
                } else if (category == PlanCategory.STD) {
                    optionTotal = rate.getVolume() / 10.0 * rate.getCurrentSL();
                } else if (category == PlanCategory.LTD) {
                    optionTotal = rate.getVolume() / 100.0 * rate.getCurrentSL();
                } else {
                    throw new BaseException("Unknown plan category: " + category);
                }
            }
        }
        return round(optionTotal, 2);
    }

    public static boolean isDiscountApplicable(RfpQuoteOptionNetwork optNetwork, RfpQuoteNetworkPlan networkPlan) {
        
        // bundle discount applied only for non-Kaiser, Medical plans and appCarrier

        RfpCarrier optCarrier = optNetwork.getRfpQuoteOption().getRfpQuote().getRfpSubmission().getRfpCarrier();
        String optionCategory = optCarrier.getCategory();
        
        if (!Constants.MEDICAL.equals(optionCategory)) {
            return false;
        }

        QuoteType quoteType = optNetwork.getRfpQuoteOption().getRfpQuote().getQuoteType();
        if (QuoteType.isTrustProgramType(quoteType)) {
            return false;
        }

        if (isSelectedPlanFromKaiser(optNetwork)) {
            return false;
        }
        
        if (!CarrierType.carrierMatches(CarrierType.BENREVO.name(), appCarrier)) { 
            // NOTE the plan carrier can differ from option carrier in multi-carrier options
            Carrier planCarrier = networkPlan.getPnn().getNetwork().getCarrier();
            if (!CarrierType.isCarrierNameAppCarrier(planCarrier.getName(), appCarrier)) {
                return false;
            }
        }

        return true;
    }

    public static boolean isSelectedPlanFromKaiser(RfpQuoteOptionNetwork optNetwork) {
        RfpQuoteNetworkPlan selectedPlan = optNetwork.getSelectedRfpQuoteNetworkPlan();
        if(selectedPlan == null) {
            return false;
        }

        Carrier carrier = getPlanCarrier(selectedPlan.getPnn());
        return carrier != null && Constants.KAISER_CARRIER.equals(carrier.getName());
    }

    public static Carrier extractClientPlanCarrier(ClientPlan clientPlan) {
        PlanNameByNetwork pnn = clientPlan != null ? clientPlan.getPnn() : null;
        return getPlanCarrier(pnn);
    }

    private static Carrier getPlanCarrier(PlanNameByNetwork pnn) {
        Plan plan = pnn != null ? pnn.getPlan() : null;
        return plan != null ? plan.getCarrier() : null;
    }
    
    /**
     * If the plan has dollar rx attribute, return default of 1f
     * @param rxPlan
     * @return
     */
    public static float[] getRXRates(RfpQuoteNetworkPlan rxPlan) {
        if(rxPlan != null) {
            QuotePlanAttribute attr = rxPlan.getAttributes()
                .stream()
                .filter(attribute -> attribute.getName().equals(QuotePlanAttributeName.DOLLAR_RX_RATE))
                .findFirst()
                .orElse(null);

            if(attr != null){
                return new float[] {1f, 1f, 1f, 1f};
            }

            return new float[] {
                defaultIfNull(rxPlan.getTier1Rate(), 1f),
                defaultIfNull(rxPlan.getTier2Rate(), 1f),
                defaultIfNull(rxPlan.getTier3Rate(), 1f),
                defaultIfNull(rxPlan.getTier4Rate(), 1f)
            };
        } else {
            return new float[] {1f, 1f, 1f, 1f};
        }
    }
    
    /**
     * For carriers like Anthem, Rx rates are included in medical plan rates
     * For UHC, Rx rates are external and can be:
     *  (1) Multiple Rx rates e.g. 0.99, 1, etc
     *  (2) Dollar Rx rates e.g. $62.73
     * @param rxPlan
     * @return
     */
    public static float[] getDollarRXRates(RfpQuoteNetworkPlan rxPlan) {
        if(rxPlan != null) {
            QuotePlanAttribute attr = rxPlan.getAttributes()
                .stream()
                .filter(attribute -> attribute.getName().equals(QuotePlanAttributeName.DOLLAR_RX_RATE))
                .findFirst()
                .orElse(null);

            if(attr == null){
                return new float[] {0f, 0f, 0f, 0f};
            }

            return new float[] {
                defaultIfNull(rxPlan.getTier1Rate(), 0f),
                defaultIfNull(rxPlan.getTier2Rate(), 0f),
                defaultIfNull(rxPlan.getTier3Rate(), 0f),
                defaultIfNull(rxPlan.getTier4Rate(), 0f)
            };
        } else {
            return new float[] {0f, 0f, 0f, 0f};
        }
    }
    
    /* FIXME refactor total/cost calculation methods to use Double type
     * 
     * See problem example below:
 
    public static void main(String[] args) {
        // float data truncation
        float a = 167426.28f;
        float b = 88883.73f;
        System.out.print(a + " + " + b + " = " + (a + b)); // 256310.0
        System.out.println(" // but expected 256310.01 !!"); 
        
        //  result with double only
        double a2 = 167426.28d;
        double b2 = 88883.73d;
        System.out.print(a2 + " + " + b2 + " = " + (a2 + b2)); // 256310.01 
        System.out.println(" // correct"); 
        
        // float cast to double problem
        double a3 = (double) a;
        double b3 = (double) b;  
        System.out.print(a3 + " + " + b3 + " = " + (a3 + b3)); // 256310.0078125
        System.out.println(" // wrong"); 
        
        // float data type overflow
        float a4 = 55203.2f; // totalMonthlyAnthemPremium
        float b4 = 62762.48f; // totalRenewalMonthlyCostOfIncumbentPlans
        System.out.print(a4 * 12 - b4 * 12); // -90711.375
        System.out.println(" // but expected -90711.36 !!"); 
    }*/
    
    public static float[] getRiderCosts(RfpQuoteOptionNetwork optNetwork) {
        Set<Rider> allRiders = new HashSet<>();
        if(optNetwork.getSelectedRiders() != null) {
            Set<Rider> standardOnly = optNetwork.getSelectedRiders().stream()
                // NOT starts with "Special"
                .filter(r -> r.getRiderMeta().getCategory() == null 
                    || !r.getRiderMeta().getCategory().startsWith("Special"))
                .collect(Collectors.toSet());
            allRiders.addAll(standardOnly);
        }
        if(optNetwork.getSelectedRfpQuoteNetworkPlan() != null && optNetwork.getSelectedRfpQuoteNetworkPlan().getRiders() != null) {
            allRiders.addAll(optNetwork.getSelectedRfpQuoteNetworkPlan().getRiders());
        }
        return getRiderCosts(allRiders, optNetwork.getRfpQuoteOption().getRfpQuote().getRatingTiers());
    }

    public static float[] getSpecialRiderCosts(RfpQuoteOptionNetwork optNetwork) {
        if(optNetwork.getSelectedRiders() != null) {
            Set<Rider> specialOnly = optNetwork.getSelectedRiders().stream()
                .filter(r -> r.getRiderMeta().getCategory() != null 
                    && r.getRiderMeta().getCategory().startsWith("Special"))
                .collect(Collectors.toSet());
            return getRiderCosts(specialOnly, optNetwork.getRfpQuoteOption().getRfpQuote().getRatingTiers());
        } else {
            return new float[] {0f, 0f, 0f, 0f};
        }
    }
    
    private static float[] getRiderCosts(Collection<Rider> selectedRiders, int ratingTiers) {
        float[] riderValues = new float[] {0f, 0f, 0f, 0f};
        for(Rider rider : selectedRiders) {
            riderValues[0] += rider.getTier1Rate();
            if(ratingTiers >= 2) {
                riderValues[1] += rider.getTier2Rate();
            }
            if(ratingTiers >= 3) {
                riderValues[2] += rider.getTier3Rate();
            }
            if(ratingTiers == 4) {
                riderValues[3] += rider.getTier4Rate();
            }
        } 
        return riderValues;
    }
    
    public static float calcEmployerCost(ClientPlan clientPlan) {
        Float employer1, employer2, employer3, employer4;
        if(clientPlan.getErContributionFormat().equals(Constants.ER_CONTRIBUTION_FORMAT_PERCENT)) {
            employer1 = clientPlan.getTier1ErContribution() * clientPlan.getTier1Census() * clientPlan.getTier1Rate() / 100f;
            employer2 = clientPlan.getTier2ErContribution() * clientPlan.getTier2Census() * clientPlan.getTier2Rate() / 100f;
            employer3 = clientPlan.getTier3ErContribution() * clientPlan.getTier3Census() * clientPlan.getTier3Rate() / 100f;
            employer4 = clientPlan.getTier4ErContribution() * clientPlan.getTier4Census() * clientPlan.getTier4Rate() / 100f;
        } else {
            employer1 = clientPlan.getTier1ErContribution() * clientPlan.getTier1Census();
            employer2 = clientPlan.getTier2ErContribution() * clientPlan.getTier2Census();
            employer3 = clientPlan.getTier3ErContribution() * clientPlan.getTier3Census();
            employer4 = clientPlan.getTier4ErContribution() * clientPlan.getTier4Census();
        }
        return round((employer1 + employer2 + employer3 + employer4), 2);
    }

    public static float calcEmployerCost(RfpQuoteOptionNetwork optNetwork, RfpQuoteNetworkPlan networkPlan, RfpQuoteNetworkPlan networkRxPlan, float discountPercent) {
        Float employer1, employer2, employer3, employer4;
        float[] rxRates = getRXRates(networkRxPlan);
        float[] dollarRxRates = getDollarRXRates(networkRxPlan);
        float[] riders = getRiderCosts(optNetwork);
        float[] specialRiders = getSpecialRiderCosts(optNetwork);
        if(optNetwork.getErContributionFormat().equals(Constants.ER_CONTRIBUTION_FORMAT_PERCENT)) {
            float discountFactor = 1f;
            if(isDiscountApplicable(optNetwork, networkPlan)) {
                discountFactor = MathUtils.getDiscountFactor(discountPercent);
            }
            employer1 = optNetwork.getTier1ErContribution() * optNetwork.getTier1Census()
                * ((defaultIfNull(networkPlan.getTier1Rate(), 0F) * rxRates[0] + dollarRxRates[0] + specialRiders[0]) * discountFactor + riders[0]) / 100f;
            employer2 = optNetwork.getTier2ErContribution() * optNetwork.getTier2Census()
                * ((defaultIfNull(networkPlan.getTier2Rate(), 0F) * rxRates[1] + dollarRxRates[1] + specialRiders[1]) * discountFactor + riders[1]) / 100f;
            employer3 = optNetwork.getTier3ErContribution() * optNetwork.getTier3Census()
                * ((defaultIfNull(networkPlan.getTier3Rate(), 0F) * rxRates[2] + dollarRxRates[2] + specialRiders[2]) * discountFactor + riders[2]) / 100f;
            employer4 = optNetwork.getTier4ErContribution() * optNetwork.getTier4Census()
                * ((defaultIfNull(networkPlan.getTier4Rate(), 0F) * rxRates[3] + dollarRxRates[3] + specialRiders[3]) * discountFactor + riders[3]) / 100f;
        } else {
            employer1 = optNetwork.getTier1ErContribution() * optNetwork.getTier1Census();
            employer2 = optNetwork.getTier2ErContribution() * optNetwork.getTier2Census();
            employer3 = optNetwork.getTier3ErContribution() * optNetwork.getTier3Census();
            employer4 = optNetwork.getTier4ErContribution() * optNetwork.getTier4Census();
        }
        return round((employer1 + employer2 + employer3 + employer4), 2);
    }

    public static float calcEmployerCost(RfpQuoteOptionNetwork optNetwork, RfpQuoteNetworkPlan networkPlan, float discountPercent) {
        return calcEmployerCost(optNetwork, networkPlan, !isNull(optNetwork) ? optNetwork.getSelectedRfpQuoteNetworkRxPlan() : null, discountPercent);
    }

    public static float calcEmployeeCost(Number premium, Number censusTier1, Number censusTier2, 
            Number censusTier3, Number censusTier4) {
        float monthlyPremium = premium.floatValue();
        float totalEnrollment = floatValue(censusTier1) + floatValue(censusTier2) 
            + floatValue(censusTier3) + floatValue(censusTier4);

        return totalEnrollment == 0f ? 0f : round(monthlyPremium / totalEnrollment, 2);
    }
    
    public static float floatValue(Number value) {
        return value == null ? 0F : value.floatValue();
    }
    
    public static double doubleValue(Number value) {
        return value == null ? 0D : value.doubleValue();
    }
    
    public static long longValue(Number value) {
        return value == null ? 0L : value.longValue();
    }
    
    public static float[] calcEmployeeRates(RfpQuoteOptionNetwork optNetwork, RfpQuoteNetworkPlan networkPlan, float discountPercent) {
        Float employee1, employee2, employee3, employee4;
        float[] rxRates = getRXRates(optNetwork.getSelectedRfpQuoteNetworkRxPlan());
        float[] dollarRxRates = getDollarRXRates(optNetwork.getSelectedRfpQuoteNetworkRxPlan());
        float[] riders = getRiderCosts(optNetwork);
        float[] specialRiders = getSpecialRiderCosts(optNetwork);
        float discountFactor = 1f;
        if(isDiscountApplicable(optNetwork, networkPlan)) {
            discountFactor = MathUtils.getDiscountFactor(discountPercent);
        }
        if(optNetwork.getErContributionFormat().equals(Constants.ER_CONTRIBUTION_FORMAT_PERCENT)) {
            employee1 = (riders[0] + (specialRiders[0] + dollarRxRates[0] + rxRates[0] * defaultIfNull(networkPlan.getTier1Rate(), 0F)) * discountFactor) * (1f - (optNetwork.getTier1ErContribution() / 100f));
            employee2 = (riders[1] + (specialRiders[1] + dollarRxRates[1] + rxRates[1] * defaultIfNull(networkPlan.getTier2Rate(), 0F)) * discountFactor) * (1f - (optNetwork.getTier2ErContribution() / 100f));
            employee3 = (riders[2] + (specialRiders[2] + dollarRxRates[2] + rxRates[2] * defaultIfNull(networkPlan.getTier3Rate(), 0F)) * discountFactor) * (1f - (optNetwork.getTier3ErContribution() / 100f));
            employee4 = (riders[3] + (specialRiders[3] + dollarRxRates[3] + rxRates[3] * defaultIfNull(networkPlan.getTier4Rate(), 0F)) * discountFactor) * (1f - (optNetwork.getTier4ErContribution() / 100f));
        } else {
            employee1 = (riders[0] + (specialRiders[0] + dollarRxRates[0] + rxRates[0] * defaultIfNull(networkPlan.getTier1Rate(), 0F)) * discountFactor) - optNetwork.getTier1ErContribution();
            employee2 = (riders[1] + (specialRiders[1] + dollarRxRates[1] + rxRates[1] * defaultIfNull(networkPlan.getTier2Rate(), 0F)) * discountFactor) - optNetwork.getTier2ErContribution();
            employee3 = (riders[2] + (specialRiders[2] + dollarRxRates[2] + rxRates[2] * defaultIfNull(networkPlan.getTier3Rate(), 0F)) * discountFactor) - optNetwork.getTier3ErContribution();
            employee4 = (riders[3] + (specialRiders[3] + dollarRxRates[3] + rxRates[3] * defaultIfNull(networkPlan.getTier4Rate(), 0F)) * discountFactor) - optNetwork.getTier4ErContribution();
        }

        return new float[] {round(employee1, 2), round(employee2, 2), round(employee3, 2), round(employee4, 2)};
    }

    public static float[] calcEmployeeRates(ClientPlan clientPlan) {
        Float employee1, employee2, employee3, employee4;

        if(clientPlan.getErContributionFormat().equals(Constants.ER_CONTRIBUTION_FORMAT_PERCENT)) {
            employee1 = (clientPlan.getTier1Rate() - (clientPlan.getTier1Rate() * clientPlan.getTier1ErContribution() / 100f));
            employee2 = (clientPlan.getTier2Rate() - (clientPlan.getTier2Rate() * clientPlan.getTier2ErContribution() / 100f));
            employee3 = (clientPlan.getTier3Rate() - (clientPlan.getTier3Rate() * clientPlan.getTier3ErContribution() / 100f));
            employee4 = (clientPlan.getTier4Rate() - (clientPlan.getTier4Rate() * clientPlan.getTier4ErContribution() / 100f));
        } else {
            employee1 = (clientPlan.getTier1Rate() - clientPlan.getTier1ErContribution());
            employee2 = (clientPlan.getTier2Rate() - clientPlan.getTier2ErContribution());
            employee3 = (clientPlan.getTier3Rate() - clientPlan.getTier3ErContribution());
            employee4 = (clientPlan.getTier4Rate() - clientPlan.getTier4ErContribution());
        }

        return new float[] {round(employee1, 2), round(employee2, 2), round(employee3, 2), round(employee4, 2)};
    }

    public static Float calcEmployerFund(RfpQuoteOptionNetwork optNetwork, String planType) {
        Float employerFund = 0F;
        if("HSA".equalsIgnoreCase(planType) && optNetwork.getTier1EeFund() != null && optNetwork.getTier2EeFund() != null && optNetwork.getTier3EeFund() != null
            && optNetwork.getTier4EeFund() != null) {
            employerFund += optNetwork.getTier1EeFund() * optNetwork.getTier1Census();
            employerFund += optNetwork.getTier2EeFund() * optNetwork.getTier2Census();
            employerFund += optNetwork.getTier3EeFund() * optNetwork.getTier3Census();
            employerFund += optNetwork.getTier4EeFund() * optNetwork.getTier4Census();
        }
        // EmployerFund - is a annual total, but we need Monthly
        return round(employerFund / 12, 2);
    }
}
