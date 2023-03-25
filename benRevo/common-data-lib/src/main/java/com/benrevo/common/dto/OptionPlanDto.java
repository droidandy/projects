package com.benrevo.common.dto;

import com.benrevo.common.enums.RateType;

public class OptionPlanDto {

    private Long planId; // client_plan_id (Current option) or rfp_quote_option_network_id (other option)

    private Long carrierId;
    private String carrierDisplayName;
    
    private Long incumbentPlanId; // pnn_id (Current option) or client_plan_id (other option)
    private String incumbentPlanType;
    private String incumbentPlanName;

    private Long incumbentNetworkId;
    private String incumbentNetworkName;
    
    private Long replacementPlanId; // pnn_id
    private String replacementPlanName;

    private Long replacementNetworkId;
    private String replacementNetworkName;

    private RateType rateType;
    private Float monthlyBandedPremium;
    private Float outOfStateMonthlyBandedPremium;
    
    // rate // FIXME default value = 0 ?
    private Float tier1Rate;
    private Float tier2Rate;
    private Float tier3Rate;
    private Float tier4Rate;
    private boolean outOfStateRate;
    private Float tier1OosRate;
    private Float tier2OosRate;
    private Float tier3OosRate;
    private Float tier4OosRate;

    // contribution // FIXME default value = 0 ?
    private Float tier1Contribution;
    private Float tier2Contribution;
    private Float tier3Contribution;
    private Float tier4Contribution;
    private boolean outOfStateContribution;
    private Float tier1OosContribution;
    private Float tier2OosContribution;
    private Float tier3OosContribution;
    private Float tier4OosContribution;
    private String erContributionFormat;   

    // enrollment // FIXME default value = 0 ?
    private Long tier1Enrollment;
    private Long tier2Enrollment;
    private Long tier3Enrollment;
    private Long tier4Enrollment;
    private boolean outOfStateEnrollment;
    private Long tier1OosEnrollment;
    private Long tier2OosEnrollment;
    private Long tier3OosEnrollment;
    private Long tier4OosEnrollment;

    public OptionPlanDto() {}

    public Long getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }

    public String getCarrierDisplayName() {
        return carrierDisplayName;
    }

    public void setCarrierDisplayName(String carrierDisplayName) {
        this.carrierDisplayName = carrierDisplayName;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public Long getIncumbentPlanId() {
        return incumbentPlanId;
    }

    public void setIncumbentPlanId(Long incumbentPlanId) {
        this.incumbentPlanId = incumbentPlanId;
    }
    
    public String getIncumbentPlanType() {
        return incumbentPlanType;
    }
    
    public void setIncumbentPlanType(String incumbentPlanType) {
        this.incumbentPlanType = incumbentPlanType;
    }
    
    public String getIncumbentPlanName() {
        return incumbentPlanName;
    }

    
    public void setIncumbentPlanName(String incumbentPlanName) {
        this.incumbentPlanName = incumbentPlanName;
    }
    
    public Long getIncumbentNetworkId() {
        return incumbentNetworkId;
    }
    
    public void setIncumbentNetworkId(Long incumbentNetworkId) {
        this.incumbentNetworkId = incumbentNetworkId;
    }
    
    public String getIncumbentNetworkName() {
        return incumbentNetworkName;
    }
    
    public void setIncumbentNetworkName(String incumbentNetworkName) {
        this.incumbentNetworkName = incumbentNetworkName;
    }

    public Float getTier1Rate() {
        return tier1Rate;
    }

    public void setTier1Rate(Float tier1Rate) {
        this.tier1Rate = tier1Rate;
    }

    public Float getTier2Rate() {
        return tier2Rate;
    }

    public void setTier2Rate(Float tier2Rate) {
        this.tier2Rate = tier2Rate;
    }

    public Float getTier3Rate() {
        return tier3Rate;
    }

    public void setTier3Rate(Float tier3Rate) {
        this.tier3Rate = tier3Rate;
    }

    public Float getTier4Rate() {
        return tier4Rate;
    }

    public void setTier4Rate(Float tier4Rate) {
        this.tier4Rate = tier4Rate;
    }

    public boolean isOutOfStateRate() {
        return outOfStateRate;
    }

    public void setOutOfStateRate(boolean outOfStateRate) {
        this.outOfStateRate = outOfStateRate;
    }

    public Float getTier1Contribution() {
        return tier1Contribution;
    }

    public void setTier1Contribution(Float tier1Contribution) {
        this.tier1Contribution = tier1Contribution;
    }

    public Float getTier2Contribution() {
        return tier2Contribution;
    }

    public void setTier2Contribution(Float tier2Contribution) {
        this.tier2Contribution = tier2Contribution;
    }

    public Float getTier3Contribution() {
        return tier3Contribution;
    }

    public void setTier3Contribution(Float tier3Contribution) {
        this.tier3Contribution = tier3Contribution;
    }

    public Float getTier4Contribution() {
        return tier4Contribution;
    }

    public void setTier4Contribution(Float tier4Contribution) {
        this.tier4Contribution = tier4Contribution;
    }

    public boolean isOutOfStateContribution() {
        return outOfStateContribution;
    }

    public void setOutOfStateContribution(boolean outOfStateContribution) {
        this.outOfStateContribution = outOfStateContribution;
    }

    public String getErContributionFormat() {
        return erContributionFormat;
    }
 
    public void setErContributionFormat(String erContributionFormat) {
        this.erContributionFormat = erContributionFormat;
    }

    public Long getTier1Enrollment() {
        return tier1Enrollment;
    }

    public void setTier1Enrollment(Long tier1Enrollment) {
        this.tier1Enrollment = tier1Enrollment;
    }

    public Long getTier2Enrollment() {
        return tier2Enrollment;
    }

    public void setTier2Enrollment(Long tier2Enrollment) {
        this.tier2Enrollment = tier2Enrollment;
    }

    public Long getTier3Enrollment() {
        return tier3Enrollment;
    }

    public void setTier3Enrollment(Long tier3Enrollment) {
        this.tier3Enrollment = tier3Enrollment;
    }

    public Long getTier4Enrollment() {
        return tier4Enrollment;
    }

    public void setTier4Enrollment(Long tier4Enrollment) {
        this.tier4Enrollment = tier4Enrollment;
    }

    public boolean isOutOfStateEnrollment() {
        return outOfStateEnrollment;
    }

    public void setOutOfStateEnrollment(boolean outOfStateEnrollment) {
        this.outOfStateEnrollment = outOfStateEnrollment;
    }
    
    public Long getReplacementPlanId() {
        return replacementPlanId;
    }

    public void setReplacementPlanId(Long replacementPlanId) {
        this.replacementPlanId = replacementPlanId;
    }
    
    public String getReplacementPlanName() {
        return replacementPlanName;
    }
    
    public void setReplacementPlanName(String replacementPlanName) {
        this.replacementPlanName = replacementPlanName;
    }
    
    public Long getReplacementNetworkId() {
        return replacementNetworkId;
    }
 
    public void setReplacementNetworkId(Long replacementNetworkId) {
        this.replacementNetworkId = replacementNetworkId;
    }
    
    public String getReplacementNetworkName() {
        return replacementNetworkName;
    }
    
    public void setReplacementNetworkName(String replacementNetworkName) {
        this.replacementNetworkName = replacementNetworkName;
    }
    
    public Float getTier1OosRate() {
        return tier1OosRate;
    }
    
    public void setTier1OosRate(Float tier1OosRate) {
        this.tier1OosRate = tier1OosRate;
    }
    
    public Float getTier2OosRate() {
        return tier2OosRate;
    }
    
    public void setTier2OosRate(Float tier2OosRate) {
        this.tier2OosRate = tier2OosRate;
    }
    
    public Float getTier3OosRate() {
        return tier3OosRate;
    }
    
    public void setTier3OosRate(Float tier3OosRate) {
        this.tier3OosRate = tier3OosRate;
    }
    
    public Float getTier4OosRate() {
        return tier4OosRate;
    }
    
    public void setTier4OosRate(Float tier4OosRate) {
        this.tier4OosRate = tier4OosRate;
    }
    
    public Float getTier1OosContribution() {
        return tier1OosContribution;
    }
    
    public void setTier1OosContribution(Float tier1OosContribution) {
        this.tier1OosContribution = tier1OosContribution;
    }
    
    public Float getTier2OosContribution() {
        return tier2OosContribution;
    }
    
    public void setTier2OosContribution(Float tier2OosContribution) {
        this.tier2OosContribution = tier2OosContribution;
    }
    
    public Float getTier3OosContribution() {
        return tier3OosContribution;
    }
    
    public void setTier3OosContribution(Float tier3OosContribution) {
        this.tier3OosContribution = tier3OosContribution;
    }
    
    public Float getTier4OosContribution() {
        return tier4OosContribution;
    }
    
    public void setTier4OosContribution(Float tier4OosContribution) {
        this.tier4OosContribution = tier4OosContribution;
    }
    
    public Long getTier1OosEnrollment() {
        return tier1OosEnrollment;
    }
    
    public void setTier1OosEnrollment(Long tier1OosEnrollment) {
        this.tier1OosEnrollment = tier1OosEnrollment;
    }
    
    public Long getTier2OosEnrollment() {
        return tier2OosEnrollment;
    }
    
    public void setTier2OosEnrollment(Long tier2OosEnrollment) {
        this.tier2OosEnrollment = tier2OosEnrollment;
    }
    
    public Long getTier3OosEnrollment() {
        return tier3OosEnrollment;
    }
    
    public void setTier3OosEnrollment(Long tier3OosEnrollment) {
        this.tier3OosEnrollment = tier3OosEnrollment;
    }

    public Long getTier4OosEnrollment() {
        return tier4OosEnrollment;
    }
    
    public void setTier4OosEnrollment(Long tier4OosEnrollment) {
        this.tier4OosEnrollment = tier4OosEnrollment;
    }

    public RateType getRateType() {
        return rateType;
    }

    public void setRateType(RateType rateType) {
        this.rateType = rateType;
    }
    
    public Float getMonthlyBandedPremium() {
        return monthlyBandedPremium;
    }

    public void setMonthlyBandedPremium(Float monthlyBandedPremium) {
        this.monthlyBandedPremium = monthlyBandedPremium;
    }

    public Float getOutOfStateMonthlyBandedPremium() {
        return outOfStateMonthlyBandedPremium;
    }

    public void setOutOfStateMonthlyBandedPremium(Float outOfStateMonthlyBandedPremium) {
        this.outOfStateMonthlyBandedPremium = outOfStateMonthlyBandedPremium;
    }
}
