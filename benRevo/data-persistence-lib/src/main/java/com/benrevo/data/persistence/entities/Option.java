package com.benrevo.data.persistence.entities;

import com.benrevo.common.enums.RateType;
import com.benrevo.data.persistence.converter.type.RateTypeConverter;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.springframework.beans.BeanUtils;

@Entity
@Table(name = "options")
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column	(name = "option_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rfp_id", nullable = false)
    private RFP rfp;

    @Column(name = "plan_type")
    private String planType;

    private String label;

    //contribution
    @Column(name = "tier1_contribution")
    private Double contributionTier1;

    @Column(name = "tier2_contribution")
    private Double contributionTier2;

    @Column(name = "tier3_contribution")
    private Double contributionTier3;

    @Column(name = "tier4_contribution")
    private Double contributionTier4;

    @Column(name = "out_of_state_contribution")
    private boolean outOfStateContribution;

    @Column(name = "tier1_oos_contribution")
    private Double oosContributionTier1;

    @Column(name = "tier2_oos_contribution")
    private Double oosContributionTier2;

    @Column(name = "tier3_oos_contribution")
    private Double oosContributionTier3;

    @Column(name = "tier4_oos_contribution")
    private Double oosContributionTier4;

    //rate
    @Column(name = "rate_type")
    @Convert(converter = RateTypeConverter.class)
    private RateType rateType;

    @Column(name = "monthly_banded_premium")
    private Double monthlyBandedPremium;

    @Column(name = "oos_monthly_banded_premium")
    private Double oufOfStateMonthlyBandedPremium;

    @Column(name = "tier1_rate")
    private Double rateTier1;

    @Column(name = "tier2_rate")
    private Double rateTier2;

    @Column(name = "tier3_rate")
    private Double rateTier3;

    @Column(name = "tier4_rate")
    private Double rateTier4;

    @Column(name = "out_of_state_rate")
    private boolean outOfStateRate;

    @Column(name = "tier1_oos_rate")
    private Double oosRateTier1;

    @Column(name = "tier2_oos_rate")
    private Double oosRateTier2;

    @Column(name = "tier3_oos_rate")
    private Double oosRateTier3;

    @Column(name = "tier4_oos_rate")
    private Double oosRateTier4;

    //renewal

    @Column(name = "monthly_banded_premium_renewal")
    private Double monthlyBandedPremiumRenewal;

    @Column(name = "oos_monthly_banded_premium_renewal")
    private Double oufOfStateMonthlyBandedPremiumRenewal;

    @Column(name = "tier1_renewal")
    private Double renewalTier1;

    @Column(name = "tier2_renewal")
    private Double renewalTier2;

    @Column(name = "tier3_renewal")
    private Double renewalTier3;

    @Column(name = "tier4_renewal")
    private Double renewalTier4;

    @Column(name = "out_of_state_renewal")
    private boolean outOfStateRenewal;

    @Column(name = "tier1_oos_renewal")
    private Double oosRenewalTier1;

    @Column(name = "tier2_oos_renewal")
    private Double oosRenewalTier2;

    @Column(name = "tier3_oos_renewal")
    private Double oosRenewalTier3;

    @Column(name = "tier4_oos_renewal")
    private Double oosRenewalTier4;

    @Column(name = "tier1_census")
    private Double censusTier1;

    @Column(name = "tier2_census")
    private Double censusTier2;

    @Column(name = "tier3_census")
    private Double censusTier3;

    @Column(name = "tier4_census")
    private Double censusTier4;

    @Column(name = "out_of_state_census")
    private boolean outOfStateCensus;

    @Column(name = "tier1_oos_census")
    private Double oosCensusTier1;

    @Column(name = "tier2_oos_census")
    private Double oosCensusTier2;

    @Column(name = "tier3_oos_census")
    private Double oosCensusTier3;

    @Column(name = "tier4_oos_census")
    private Double oosCensusTier4;

    @Column(name = "match_current")
    private boolean matchCurrent;

    @Column(name = "quote_alt")
    private boolean quoteAlt;

    @Column(name = "alt_request")
    private String altRequest;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RFP getRfp() {
        return rfp;
    }

    public void setRfp(RFP rfp) {
        this.rfp = rfp;
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

    public Double getContributionTier1() {
        return contributionTier1;
    }

    public void setContributionTier1(Double contributionTier1) {
        this.contributionTier1 = contributionTier1;
    }

    public Double getContributionTier2() {
        return contributionTier2;
    }

    public void setContributionTier2(Double contributionTier2) {
        this.contributionTier2 = contributionTier2;
    }

    public Double getContributionTier3() {
        return contributionTier3;
    }

    public void setContributionTier3(Double contributionTier3) {
        this.contributionTier3 = contributionTier3;
    }

    public Double getContributionTier4() {
        return contributionTier4;
    }

    public void setContributionTier4(Double contributionTier4) {
        this.contributionTier4 = contributionTier4;
    }

    public boolean isOutOfStateContribution() {
        return outOfStateContribution;
    }

    public void setOutOfStateContribution(boolean outOfStateContribution) {
        this.outOfStateContribution = outOfStateContribution;
    }

    public Double getOosContributionTier1() {
        return oosContributionTier1;
    }

    public void setOosContributionTier1(Double oosContributionTier1) {
        this.oosContributionTier1 = oosContributionTier1;
    }

    public Double getOosContributionTier2() {
        return oosContributionTier2;
    }

    public void setOosContributionTier2(Double oosContributionTier2) {
        this.oosContributionTier2 = oosContributionTier2;
    }

    public Double getOosContributionTier3() {
        return oosContributionTier3;
    }

    public void setOosContributionTier3(Double oosContributionTier3) {
        this.oosContributionTier3 = oosContributionTier3;
    }

    public Double getOosContributionTier4() {
        return oosContributionTier4;
    }

    public void setOosContributionTier4(Double oosContributionTier4) {
        this.oosContributionTier4 = oosContributionTier4;
    }

    public Double getRateTier1() {
        return rateTier1;
    }

    public void setRateTier1(Double rateTier1) {
        this.rateTier1 = rateTier1;
    }

    public Double getRateTier2() {
        return rateTier2;
    }

    public void setRateTier2(Double rateTier2) {
        this.rateTier2 = rateTier2;
    }

    public Double getRateTier3() {
        return rateTier3;
    }

    public void setRateTier3(Double rateTier3) {
        this.rateTier3 = rateTier3;
    }

    public Double getRateTier4() {
        return rateTier4;
    }

    public void setRateTier4(Double rateTier4) {
        this.rateTier4 = rateTier4;
    }

    public boolean isOutOfStateRate() {
        return outOfStateRate;
    }

    public void setOutOfStateRate(boolean outOfStateRate) {
        this.outOfStateRate = outOfStateRate;
    }

    public Double getOosRateTier1() {
        return oosRateTier1;
    }

    public void setOosRateTier1(Double oosRateTier1) {
        this.oosRateTier1 = oosRateTier1;
    }

    public Double getOosRateTier2() {
        return oosRateTier2;
    }

    public void setOosRateTier2(Double oosRateTier2) {
        this.oosRateTier2 = oosRateTier2;
    }

    public Double getOosRateTier3() {
        return oosRateTier3;
    }

    public void setOosRateTier3(Double oosRateTier3) {
        this.oosRateTier3 = oosRateTier3;
    }

    public Double getOosRateTier4() {
        return oosRateTier4;
    }

    public void setOosRateTier4(Double oosRateTier4) {
        this.oosRateTier4 = oosRateTier4;
    }

    public Double getRenewalTier1() {
        return renewalTier1;
    }

    public void setRenewalTier1(Double renewalTier1) {
        this.renewalTier1 = renewalTier1;
    }

    public Double getRenewalTier2() {
        return renewalTier2;
    }

    public void setRenewalTier2(Double renewalTier2) {
        this.renewalTier2 = renewalTier2;
    }

    public Double getRenewalTier3() {
        return renewalTier3;
    }

    public void setRenewalTier3(Double renewalTier3) {
        this.renewalTier3 = renewalTier3;
    }

    public Double getRenewalTier4() {
        return renewalTier4;
    }

    public void setRenewalTier4(Double renewalTier4) {
        this.renewalTier4 = renewalTier4;
    }

    public boolean isOutOfStateRenewal() {
        return outOfStateRenewal;
    }

    public void setOutOfStateRenewal(boolean outOfStateRenewal) {
        this.outOfStateRenewal = outOfStateRenewal;
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

    public Double getOosRenewalTier1() {
        return oosRenewalTier1;
    }

    public void setOosRenewalTier1(Double oosRenewalTier1) {
        this.oosRenewalTier1 = oosRenewalTier1;
    }

    public Double getOosRenewalTier2() {
        return oosRenewalTier2;
    }

    public void setOosRenewalTier2(Double oosRenewalTier2) {
        this.oosRenewalTier2 = oosRenewalTier2;
    }

    public Double getOosRenewalTier3() {
        return oosRenewalTier3;
    }

    public void setOosRenewalTier3(Double oosRenewalTier3) {
        this.oosRenewalTier3 = oosRenewalTier3;
    }

    public Double getOosRenewalTier4() {
        return oosRenewalTier4;
    }

    public void setOosRenewalTier4(Double oosRenewalTier4) {
        this.oosRenewalTier4 = oosRenewalTier4;
    }

    public Double getCensusTier1() {
        return censusTier1;
    }

    public void setCensusTier1(Double censusTier1) {
        this.censusTier1 = censusTier1;
    }

    public Double getCensusTier2() {
        return censusTier2;
    }

    public void setCensusTier2(Double censusTier2) {
        this.censusTier2 = censusTier2;
    }

    public Double getCensusTier3() {
        return censusTier3;
    }

    public void setCensusTier3(Double censusTier3) {
        this.censusTier3 = censusTier3;
    }

    public Double getCensusTier4() {
        return censusTier4;
    }

    public void setCensusTier4(Double censusTier4) {
        this.censusTier4 = censusTier4;
    }

    public boolean isOutOfStateCensus() {
        return outOfStateCensus;
    }

    public void setOutOfStateCensus(boolean outOfStateCensus) {
        this.outOfStateCensus = outOfStateCensus;
    }

    public Double getOosCensusTier1() {
        return oosCensusTier1;
    }

    public void setOosCensusTier1(Double oosCensusTier1) {
        this.oosCensusTier1 = oosCensusTier1;
    }

    public Double getOosCensusTier2() {
        return oosCensusTier2;
    }

    public void setOosCensusTier2(Double oosCensusTier2) {
        this.oosCensusTier2 = oosCensusTier2;
    }

    public Double getOosCensusTier3() {
        return oosCensusTier3;
    }

    public void setOosCensusTier3(Double oosCensusTier3) {
        this.oosCensusTier3 = oosCensusTier3;
    }

    public Double getOosCensusTier4() {
        return oosCensusTier4;
    }

    public void setOosCensusTier4(Double oosCensusTier4) {
        this.oosCensusTier4 = oosCensusTier4;
    }

    public String getAltRequest() {
        return altRequest;
    }

    public void setAltRequest(String altRequest) {
        this.altRequest = altRequest;
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
    
    public Option copy() {
        Option copy = new Option();
        BeanUtils.copyProperties(this, copy, "id");
        return copy;
    } 
}
