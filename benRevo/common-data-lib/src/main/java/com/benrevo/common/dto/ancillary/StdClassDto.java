package com.benrevo.common.dto.ancillary;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

@XmlAccessorType(XmlAccessType.FIELD)
public class StdClassDto extends AncillaryClassDto {

    private String waitingPeriodAccident;
    private String waitingPeriodSickness;
    private String weeklyBenefit;
    private String maxWeeklyBenefit;
    private String maxBenefitDuration;
    private String conditionExclusion;
    private String conditionExclusionOther;

    public StdClassDto() {
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
}
