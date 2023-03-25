package com.benrevo.common.dto;

import com.benrevo.common.enums.RateType;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlTransient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

@XmlAccessorType(XmlAccessType.FIELD)
public class OptionDto {
    
    @XmlTransient
    private Long id;
    @XmlTransient
    private Long rfpId;
    private String planType;
    private String label;

    //contribution
    private Double tier1Contribution;
    private Double tier2Contribution;
    private Double tier3Contribution;
    private Double tier4Contribution;
    private boolean outOfStateContribution;
    private Double tier1OosContribution;
    private Double tier2OosContribution;
    private Double tier3OosContribution;
    private Double tier4OosContribution;

    //rate
    private RateType rateType;
    private Double monthlyBandedPremium;
    private Double oufOfStateMonthlyBandedPremium;

    private Double tier1Rate;
    private Double tier2Rate;
    private Double tier3Rate;
    private Double tier4Rate;
    private boolean outOfStateRate;
    private Double tier1OosRate;
    private Double tier2OosRate;
    private Double tier3OosRate;
    private Double tier4OosRate;

    //renewal
    private Double monthlyBandedPremiumRenewal;
    private Double oufOfStateMonthlyBandedPremiumRenewal;
    private Double tier1Renewal;
    private Double tier2Renewal;
    private Double tier3Renewal;
    private Double tier4Renewal;
    private boolean outOfStateRenewal;
    private Double tier1OosRenewal;
    private Double tier2OosRenewal;
    private Double tier3OosRenewal;
    private Double tier4OosRenewal;

    //census
    private Double tier1Census;
    private Double tier2Census;
    private Double tier3Census;
    private Double tier4Census;
    private boolean outOfStateCensus;
    private Double tier1OosCensus;
    private Double tier2OosCensus;
    private Double tier3OosCensus;
    private Double tier4OosCensus;

    private boolean matchCurrent;
    private boolean quoteAlt;
    private String altRequest;
    
    private List<CreatePlanDto> plans;

    public OptionDto(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRfpId() {
        return rfpId;
    }

    public void setRfpId(Long rfpId) {
        this.rfpId = rfpId;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Double getTier1Contribution() {
        return tier1Contribution;
    }

    public void setTier1Contribution(Double tier1Contribution) {
        this.tier1Contribution = tier1Contribution;
    }

    public Double getTier2Contribution() {
        return tier2Contribution;
    }

    public void setTier2Contribution(Double tier2Contribution) {
        this.tier2Contribution = tier2Contribution;
    }

    public Double getTier3Contribution() {
        return tier3Contribution;
    }

    public void setTier3Contribution(Double tier3Contribution) {
        this.tier3Contribution = tier3Contribution;
    }

    public Double getTier4Contribution() {
        return tier4Contribution;
    }

    public void setTier4Contribution(Double tier4Contribution) {
        this.tier4Contribution = tier4Contribution;
    }

    public boolean isOutOfStateContribution() {
        return outOfStateContribution;
    }

    public void setOutOfStateContribution(boolean outOfStateContribution) {
        this.outOfStateContribution = outOfStateContribution;
    }

    public Double getTier1OosContribution() {
        return tier1OosContribution;
    }

    public void setTier1OosContribution(Double tier1OosContribution) {
        this.tier1OosContribution = tier1OosContribution;
    }

    public Double getTier2OosContribution() {
        return tier2OosContribution;
    }

    public void setTier2OosContribution(Double tier2OosContribution) {
        this.tier2OosContribution = tier2OosContribution;
    }

    public Double getTier3OosContribution() {
        return tier3OosContribution;
    }

    public void setTier3OosContribution(Double tier3OosContribution) {
        this.tier3OosContribution = tier3OosContribution;
    }

    public Double getTier4OosContribution() {
        return tier4OosContribution;
    }

    public void setTier4OosContribution(Double tier4OosContribution) {
        this.tier4OosContribution = tier4OosContribution;
    }

    public Double getTier1Rate() {
        return tier1Rate;
    }

    public void setTier1Rate(Double tier1Rate) {
        this.tier1Rate = tier1Rate;
    }

    public Double getTier2Rate() {
        return tier2Rate;
    }

    public void setTier2Rate(Double tier2Rate) {
        this.tier2Rate = tier2Rate;
    }

    public Double getTier3Rate() {
        return tier3Rate;
    }

    public void setTier3Rate(Double tier3Rate) {
        this.tier3Rate = tier3Rate;
    }

    public Double getTier4Rate() {
        return tier4Rate;
    }

    public void setTier4Rate(Double tier4Rate) {
        this.tier4Rate = tier4Rate;
    }

    public boolean isOutOfStateRate() {
        return outOfStateRate;
    }

    public void setOutOfStateRate(boolean outOfStateRate) {
        this.outOfStateRate = outOfStateRate;
    }

    public Double getTier1OosRate() {
        return tier1OosRate;
    }

    public void setTier1OosRate(Double tier1OosRate) {
        this.tier1OosRate = tier1OosRate;
    }

    public Double getTier2OosRate() {
        return tier2OosRate;
    }

    public void setTier2OosRate(Double tier2OosRate) {
        this.tier2OosRate = tier2OosRate;
    }

    public Double getTier3OosRate() {
        return tier3OosRate;
    }

    public void setTier3OosRate(Double tier3OosRate) {
        this.tier3OosRate = tier3OosRate;
    }

    public Double getTier4OosRate() {
        return tier4OosRate;
    }

    public void setTier4OosRate(Double tier4OosRate) {
        this.tier4OosRate = tier4OosRate;
    }

    public Double getTier1Renewal() {
        return tier1Renewal;
    }

    public void setTier1Renewal(Double tier1Renewal) {
        this.tier1Renewal = tier1Renewal;
    }

    public Double getTier2Renewal() {
        return tier2Renewal;
    }

    public void setTier2Renewal(Double tier2Renewal) {
        this.tier2Renewal = tier2Renewal;
    }

    public Double getTier3Renewal() {
        return tier3Renewal;
    }

    public void setTier3Renewal(Double tier3Renewal) {
        this.tier3Renewal = tier3Renewal;
    }

    public Double getTier4Renewal() {
        return tier4Renewal;
    }

    public void setTier4Renewal(Double tier4Renewal) {
        this.tier4Renewal = tier4Renewal;
    }

    public boolean isOutOfStateRenewal() {
        return outOfStateRenewal;
    }

    public void setOutOfStateRenewal(boolean outOfStateRenewal) {
        this.outOfStateRenewal = outOfStateRenewal;
    }

    public Double getTier1OosRenewal() {
        return tier1OosRenewal;
    }

    public void setTier1OosRenewal(Double tier1OosRenewal) {
        this.tier1OosRenewal = tier1OosRenewal;
    }

    public Double getTier2OosRenewal() {
        return tier2OosRenewal;
    }

    public void setTier2OosRenewal(Double tier2OosRenewal) {
        this.tier2OosRenewal = tier2OosRenewal;
    }

    public Double getTier3OosRenewal() {
        return tier3OosRenewal;
    }

    public void setTier3OosRenewal(Double tier3OosRenewal) {
        this.tier3OosRenewal = tier3OosRenewal;
    }

    public Double getTier4OosRenewal() {
        return tier4OosRenewal;
    }

    public void setTier4OosRenewal(Double tier4OosRenewal) {
        this.tier4OosRenewal = tier4OosRenewal;
    }

    public Double getTier1Census() {
        return tier1Census;
    }

    public void setTier1Census(Double tier1Census) {
        this.tier1Census = tier1Census;
    }

    public Double getTier2Census() {
        return tier2Census;
    }

    public void setTier2Census(Double tier2Census) {
        this.tier2Census = tier2Census;
    }

    public Double getTier3Census() {
        return tier3Census;
    }

    public void setTier3Census(Double tier3Census) {
        this.tier3Census = tier3Census;
    }

    public Double getTier4Census() {
        return tier4Census;
    }

    public boolean isOutOfStateCensus() {
        return outOfStateCensus;
    }

    public void setOutOfStateCensus(boolean outOfStateCensus) {
        this.outOfStateCensus = outOfStateCensus;
    }

    public Double getTier1OosCensus() {
        return tier1OosCensus;
    }

    public void setTier1OosCensus(Double tier1OosCensus) {
        this.tier1OosCensus = tier1OosCensus;
    }

    public Double getTier2OosCensus() {
        return tier2OosCensus;
    }

    public void setTier2OosCensus(Double tier2OosCensus) {
        this.tier2OosCensus = tier2OosCensus;
    }

    public Double getTier3OosCensus() {
        return tier3OosCensus;
    }

    public void setTier3OosCensus(Double tier3OosCensus) {
        this.tier3OosCensus = tier3OosCensus;
    }

    public Double getTier4OosCensus() {
        return tier4OosCensus;
    }

    public void setTier4OosCensus(Double tier4OosCensus) {
        this.tier4OosCensus = tier4OosCensus;
    }

    public void setTier4Census(Double tier4Census) {
        this.tier4Census = tier4Census;
    }

    public boolean isMatchCurrent() {
        return matchCurrent;
    }

    public void setMatchCurrent(boolean matchCurrent) {
        this.matchCurrent = matchCurrent;
    }

    public boolean isQuoteAlt() {
        return quoteAlt;
    }

    public void setQuoteAlt(boolean quoteAlt) {
        this.quoteAlt = quoteAlt;
    }

    public String getAltRequest() {
        return altRequest;
    }

    public void setAltRequest(String altRequest) {
        this.altRequest = altRequest;
    }
    
    public List<CreatePlanDto> getPlans() {
        return plans;
    }

    public void setPlans(List<CreatePlanDto> plans) {
        this.plans = plans;
    }

    public RateType getRateType() {
        return rateType;
    }

    public void setRateType(RateType rateType) {
        this.rateType = rateType;
    }

    public Double getMonthlyBandedPremium() {
        return monthlyBandedPremium;
    }

    public void setMonthlyBandedPremium(Double monthlyBandedPremium) {
        this.monthlyBandedPremium = monthlyBandedPremium;
    }

    public Double getOufOfStateMonthlyBandedPremium() {
        return oufOfStateMonthlyBandedPremium;
    }

    public void setOufOfStateMonthlyBandedPremium(Double oufOfStateMonthlyBandedPremium) {
        this.oufOfStateMonthlyBandedPremium = oufOfStateMonthlyBandedPremium;
    }

    public Double getMonthlyBandedPremiumRenewal() {
        return monthlyBandedPremiumRenewal;
    }

    public void setMonthlyBandedPremiumRenewal(Double monthlyBandedPremiumRenewal) {
        this.monthlyBandedPremiumRenewal = monthlyBandedPremiumRenewal;
    }

    public Double getOufOfStateMonthlyBandedPremiumRenewal() {
        return oufOfStateMonthlyBandedPremiumRenewal;
    }

    public void setOufOfStateMonthlyBandedPremiumRenewal(
        Double oufOfStateMonthlyBandedPremiumRenewal) {
        this.oufOfStateMonthlyBandedPremiumRenewal = oufOfStateMonthlyBandedPremiumRenewal;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) {
            return true;
        }

        if(!(o instanceof OptionDto)) {
            return false;
        }

        OptionDto optionDto = (OptionDto) o;

        return new EqualsBuilder()
            .append(isOutOfStateContribution(), optionDto.isOutOfStateContribution())
            .append(isOutOfStateRate(), optionDto.isOutOfStateRate())
            .append(isOutOfStateRenewal(), optionDto.isOutOfStateRenewal())
            .append(isMatchCurrent(), optionDto.isMatchCurrent())
            .append(isQuoteAlt(), optionDto.isQuoteAlt())
            .append(getId(), optionDto.getId())
            .append(getRfpId(), optionDto.getRfpId())
            .append(getPlanType(), optionDto.getPlanType())
            .append(getLabel(), optionDto.getLabel())
            .append(getTier1Contribution(), optionDto.getTier1Contribution())
            .append(getTier2Contribution(), optionDto.getTier2Contribution())
            .append(getTier3Contribution(), optionDto.getTier3Contribution())
            .append(getTier4Contribution(), optionDto.getTier4Contribution())
            .append(getTier1OosContribution(), optionDto.getTier1OosContribution())
            .append(getTier2OosContribution(), optionDto.getTier2OosContribution())
            .append(getTier3OosContribution(), optionDto.getTier3OosContribution())
            .append(getTier4OosContribution(), optionDto.getTier4OosContribution())
            .append(getTier1Rate(), optionDto.getTier1Rate())
            .append(getTier2Rate(), optionDto.getTier2Rate())
            .append(getTier3Rate(), optionDto.getTier3Rate())
            .append(getTier4Rate(), optionDto.getTier4Rate())
            .append(getTier1OosRate(), optionDto.getTier1OosRate())
            .append(getTier2OosRate(), optionDto.getTier2OosRate())
            .append(getTier3OosRate(), optionDto.getTier3OosRate())
            .append(getTier4OosRate(), optionDto.getTier4OosRate())
            .append(getTier1Renewal(), optionDto.getTier1Renewal())
            .append(getTier2Renewal(), optionDto.getTier2Renewal())
            .append(getTier3Renewal(), optionDto.getTier3Renewal())
            .append(getTier4Renewal(), optionDto.getTier4Renewal())
            .append(getTier1OosRenewal(), optionDto.getTier1OosRenewal())
            .append(getTier2OosRenewal(), optionDto.getTier2OosRenewal())
            .append(getTier3OosRenewal(), optionDto.getTier3OosRenewal())
            .append(getTier4OosRenewal(), optionDto.getTier4OosRenewal())
            .append(getTier1Census(), optionDto.getTier1Census())
            .append(getTier2Census(), optionDto.getTier2Census())
            .append(getTier3Census(), optionDto.getTier3Census())
            .append(getTier4Census(), optionDto.getTier4Census())
            .append(getAltRequest(), optionDto.getAltRequest())
            .append(getRateType(), optionDto.getRateType())
            .append(getMonthlyBandedPremium(), optionDto.getMonthlyBandedPremium())
            .append(getMonthlyBandedPremiumRenewal(), optionDto.getMonthlyBandedPremiumRenewal())
            .append(getOufOfStateMonthlyBandedPremium(), optionDto.getOufOfStateMonthlyBandedPremium())
            .append(getOufOfStateMonthlyBandedPremiumRenewal(), optionDto.getOufOfStateMonthlyBandedPremiumRenewal())
            .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(getId())
            .append(getRfpId())
            .append(getPlanType())
            .append(getLabel())
            .append(getTier1Contribution())
            .append(getTier2Contribution())
            .append(getTier3Contribution())
            .append(getTier4Contribution())
            .append(isOutOfStateContribution())
            .append(getTier1OosContribution())
            .append(getTier2OosContribution())
            .append(getTier3OosContribution())
            .append(getTier4OosContribution())
            .append(getTier1Rate())
            .append(getTier2Rate())
            .append(getTier3Rate())
            .append(getTier4Rate())
            .append(isOutOfStateRate())
            .append(getTier1OosRate())
            .append(getTier2OosRate())
            .append(getTier3OosRate())
            .append(getTier4OosRate())
            .append(getTier1Renewal())
            .append(getTier2Renewal())
            .append(getTier3Renewal())
            .append(getTier4Renewal())
            .append(isOutOfStateRenewal())
            .append(getTier1OosRenewal())
            .append(getTier2OosRenewal())
            .append(getTier3OosRenewal())
            .append(getTier4OosRenewal())
            .append(getTier1Census())
            .append(getTier2Census())
            .append(getTier3Census())
            .append(getTier4Census())
            .append(isMatchCurrent())
            .append(isQuoteAlt())
            .append(getAltRequest())
            .append(getMonthlyBandedPremium())
            .append(getMonthlyBandedPremiumRenewal())
            .append(getOufOfStateMonthlyBandedPremium())
            .append(getOufOfStateMonthlyBandedPremiumRenewal())
            .toHashCode();
    }
    
}
