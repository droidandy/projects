package com.benrevo.common.dto.ancillary;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

@XmlAccessorType(XmlAccessType.FIELD)
public class LtdClassDto extends AncillaryClassDto {

    private String monthlyBenefit;
    private String maxBenefit;
    private String maxBenefitDuration;
    private String eliminationPeriod;
    private String conditionExclusion;
    private String conditionExclusionOther;
    private String occupationDefinition;
    private String occupationDefinitionOther;
    private String abuseLimitation;
    private String abuseLimitationOther;
    private String premiumsPaid;

    public LtdClassDto() {
    }

    public String getMonthlyBenefit() {
        return monthlyBenefit;
    }

    public void setMonthlyBenefit(String monthlyBenefit) {
        this.monthlyBenefit = monthlyBenefit;
    }

    public String getMaxBenefit() {
        return maxBenefit;
    }

    public void setMaxBenefit(String maxBenefit) {
        this.maxBenefit = maxBenefit;
    }

    public String getMaxBenefitDuration() {
        return maxBenefitDuration;
    }

    public void setMaxBenefitDuration(String maxBenefitDuration) {
        this.maxBenefitDuration = maxBenefitDuration;
    }

    public String getEliminationPeriod() {
        return eliminationPeriod;
    }

    public void setEliminationPeriod(String eliminationPeriod) {
        this.eliminationPeriod = eliminationPeriod;
    }

    public String getConditionExclusion() {
        return conditionExclusion;
    }

    public void setConditionExclusion(String conditionExclusion) {
        this.conditionExclusion = conditionExclusion;
    }

    public String getConditionExclusionOther() {
        return conditionExclusionOther;
    }

    public void setConditionExclusionOther(String conditionExclusionOther) {
        this.conditionExclusionOther = conditionExclusionOther;
    }

    public String getOccupationDefinition() {
        return occupationDefinition;
    }

    public void setOccupationDefinition(String occupationDefinition) {
        this.occupationDefinition = occupationDefinition;
    }

    public String getOccupationDefinitionOther() {
        return occupationDefinitionOther;
    }

    public void setOccupationDefinitionOther(String occupationDefinitionOther) {
        this.occupationDefinitionOther = occupationDefinitionOther;
    }

    public String getAbuseLimitation() {
        return abuseLimitation;
    }

    public void setAbuseLimitation(String abuseLimitation) {
        this.abuseLimitation = abuseLimitation;
    }

    public String getAbuseLimitationOther() {
        return abuseLimitationOther;
    }

    public void setAbuseLimitationOther(String abuseLimitationOther) {
        this.abuseLimitationOther = abuseLimitationOther;
    }

    public String getPremiumsPaid() {
        return premiumsPaid;
    }

    public void setPremiumsPaid(String premiumsPaid) {
        this.premiumsPaid = premiumsPaid;
    }

}
