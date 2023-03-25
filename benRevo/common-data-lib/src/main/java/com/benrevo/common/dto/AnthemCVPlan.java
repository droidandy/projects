package com.benrevo.common.dto;

import java.util.Date;

public class AnthemCVPlan {
    private String medName;
    private String rxName;
    private Float planRel;
    private String networkName;
    private String networkType;
    private String networkSubtype;

    private Float trend;
    private Float areaFactor;
    private Float demoFactor;
    private Float sicFactor;
    private Float combinedFactor;
    private Float G6;
    private Float tier1Rate;
    private Float tier2Rate;
    private Float tier3Rate;
    private Float tier4Rate;

    private Float currentEEtier1RateDiff;

    private Integer ratingTiers;
    private String predominantCounty;
    private Date effectiveDate;
    private Float averageAge;
    private String sicCode;
    private String paymentMethod;
    private String commission;

    public AnthemCVPlan(String medName, String rxName, Float planRel, String networkName, String networkType, String networkSubtype) {
        this.medName = medName;
        this.rxName = rxName;
        this.planRel = planRel;
        this.networkName = networkName;
        this.networkType = networkType;
        this.networkSubtype = networkSubtype;
    }

    public String getMedName() {
        return medName;
    }

    public String getRxName() {
        return rxName;
    }

    public Float getPlanRel() {
        return planRel;
    }

    public String getNetworkName() {
        return networkName;
    }

    public String getNetworkType() {
        return networkType;
    }

    public String getNetworkSubtype() {
        return networkSubtype;
    }

    public void setPlanRel(Float planRel) {
        this.planRel = planRel;
    }

    public Float getTrend() {
        return trend;
    }

    public void setTrend(Float trend) {
        this.trend = trend;
    }

    public Float getAreaFactor() {
        return areaFactor;
    }

    public void setAreaFactor(Float areaFactor) {
        this.areaFactor = areaFactor;
    }

    public Float getDemoFactor() {
        return demoFactor;
    }

    public void setDemoFactor(Float demoFactor) {
        this.demoFactor = demoFactor;
    }

    public Float getSicFactor() {
        return sicFactor;
    }

    public void setSicFactor(Float sicFactor) {
        this.sicFactor = sicFactor;
    }

    public Float getCombinedFactor() {
        return combinedFactor;
    }

    public void setCombinedFactor(Float combinedFactor) {
        this.combinedFactor = combinedFactor;
    }

    public Float getG6() {
        return G6;
    }

    public void setG6(Float g6) {
        G6 = g6;
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

    public Float getCurrentEEtier1RateDiff() {
        return currentEEtier1RateDiff;
    }

    public void setCurrentEEtier1RateDiff(Float currentEEtier1RateDiff) {
        this.currentEEtier1RateDiff = currentEEtier1RateDiff;
    }

    public Integer getRatingTiers() {
        return ratingTiers;
    }

    public void setRatingTiers(Integer ratingTiers) {
        this.ratingTiers = ratingTiers;
    }

    public String getPredominantCounty() {
        return predominantCounty;
    }

    public void setPredominantCounty(String predominantCounty) {
        this.predominantCounty = predominantCounty;
    }

    public Date getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(Date effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public Float getAverageAge() {
        return averageAge;
    }

    public void setAverageAge(Float averageAge) {
        this.averageAge = averageAge;
    }

    public String getSicCode() {
        return sicCode;
    }

    public void setSicCode(String sicCode) {
        this.sicCode = sicCode;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getCommission() {
        return commission;
    }

    public void setCommission(String commission) {
        this.commission = commission;
    }
}
