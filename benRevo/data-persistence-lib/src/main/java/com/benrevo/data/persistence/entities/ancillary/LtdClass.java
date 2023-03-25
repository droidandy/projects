package com.benrevo.data.persistence.entities.ancillary;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "ltd_class")
public class LtdClass extends AncillaryClass {

    @Column(name = "monthly_benefit")
    private String monthlyBenefit;

    @Column(name = "max_benefit")
    private String maxBenefit;

    @Column(name = "max_benefit_duration")
    private String maxBenefitDuration;

    @Column(name = "elimination_period")
    private String eliminationPeriod;

    @Column(name = "condition_exclusion")
    private String conditionExclusion;

    @Column(name = "condition_exclusion_other")
    private String conditionExclusionOther;

    @Column(name = "occupation_definition")
    private String occupationDefinition;

    @Column(name = "occupation_definition_other")
    private String occupationDefinitionOther;

    @Column(name = "abuse_limitation")
    private String abuseLimitation;

    @Column(name = "abuse_limitation_other")
    private String abuseLimitationOther;

    @Column(name = "premiums_paid")
    private String premiumsPaid;

    @Override
    public int hashCode() {
        return new org.apache.commons.lang3.builder.HashCodeBuilder(1, 31)
                .append(getAncillaryClassId())
                .append(getName())
                .append(getMonthlyBenefit())
                .append(getMaxBenefit())
                .append(getMaxBenefitDuration())
                .append(getEliminationPeriod())
                .append(getConditionExclusion())
                .append(getConditionExclusionOther())
                .append(getOccupationDefinition())
                .append(getOccupationDefinitionOther())
                .append(getAbuseLimitation())
                .append(getAbuseLimitationOther())
                .append(getPremiumsPaid())
                .toHashCode();
    }

    @Override
    public AncillaryClass newInstance() {
        return new LtdClass();
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
