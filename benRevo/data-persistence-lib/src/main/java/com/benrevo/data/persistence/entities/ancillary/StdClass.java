package com.benrevo.data.persistence.entities.ancillary;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "std_class")
public class StdClass extends AncillaryClass {

    @Column(name = "waiting_period_accident")
    private String waitingPeriodAccident;

    @Column(name = "waiting_period_sickness")
    private String waitingPeriodSickness;

    @Column(name = "weekly_benefit")
    private String weeklyBenefit;

    @Column(name = "max_weekly_benefit")
    private String maxWeeklyBenefit;

    @Column(name = "max_benefit_duration")
    private String maxBenefitDuration;

    @Column(name = "condition_exclusion")
    private String conditionExclusion;

    @Column(name = "condition_exclusion_other")
    private String conditionExclusionOther;

    @Override
    public int hashCode() {
        return new org.apache.commons.lang3.builder.HashCodeBuilder(1, 31)
                .append(getAncillaryClassId())
                .append(getName())
                .append(getWaitingPeriodAccident())
                .append(getWaitingPeriodSickness())
                .append(getWeeklyBenefit())
                .append(getMaxWeeklyBenefit())
                .append(getMaxBenefitDuration())
                .append(getConditionExclusion())
                .append(getConditionExclusionOther())
                .toHashCode();
    }

    public String getWaitingPeriodAccident() {
        return waitingPeriodAccident;
    }

    public void setWaitingPeriodAccident(String waitingPeriodAccident) {
        this.waitingPeriodAccident = waitingPeriodAccident;
    }

    public String getWaitingPeriodSickness() {
        return waitingPeriodSickness;
    }

    public void setWaitingPeriodSickness(String waitingPeriodSickness) {
        this.waitingPeriodSickness = waitingPeriodSickness;
    }

    public String getWeeklyBenefit() {
        return weeklyBenefit;
    }

    public void setWeeklyBenefit(String weeklyBenefit) {
        this.weeklyBenefit = weeklyBenefit;
    }

    public String getMaxWeeklyBenefit() {
        return maxWeeklyBenefit;
    }

    public void setMaxWeeklyBenefit(String maxWeeklyBenefit) {
        this.maxWeeklyBenefit = maxWeeklyBenefit;
    }

    public String getMaxBenefitDuration() {
        return maxBenefitDuration;
    }

    public void setMaxBenefitDuration(String maxBenefitDuration) {
        this.maxBenefitDuration = maxBenefitDuration;
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

    @Override
    public AncillaryClass newInstance() {
        return new StdClass();
    }
}
