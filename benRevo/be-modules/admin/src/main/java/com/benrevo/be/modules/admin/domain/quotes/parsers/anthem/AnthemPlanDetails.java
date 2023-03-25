package com.benrevo.be.modules.admin.domain.quotes.parsers.anthem;

import java.util.ArrayList;
import java.util.List;
import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;

public class AnthemPlanDetails {

    private String networkName;
    private String networkType;
    private String rfpQuoteOptionName;
    private String planName;
    private String planNameLocation;
    private String planCopay;
    private boolean voluntary = false;

    private String rateDescription = "";

    //Enrollment or Census Section
    private String tier1Census = "0"; // employee
    private String tier2Census = "0"; // Employee + Spouse
    private String tier3Census = "0"; // Employee + Child(ren)
    private String tier4Census = "0"; // Employee + Family
    private String censusTotal = "0";

    // Rates
    private String tier1Rate;
    private String tier2Rate;
    private String tier3Rate;
    private String tier4Rate;
    private String tier1RateLocation = "";
    private String tier2RateLocation = "";
    private String tier3RateLocation = "";
    private String tier4RateLocation = "";

    // For use in generic way when needing to create a plan on the fly when reading a quote.
    // Currently only used for Dental PPO 
    private GenericPlanDetails genericPlanDetails; 
    
    private List<QuotePlanAttribute> attributes = new ArrayList<>();

    public String getNetworkName() {
        return networkName;
    }

    public void setNetworkName(String networkName) {
        this.networkName = networkName;
    }

    public String getNetworkType() {
        return networkType;
    }

    public void setNetworkType(String networkType) {
        this.networkType = networkType;
    }

    public void setPlanCopay(String planCopay) {
        this.planCopay = planCopay;
    }

    public boolean isVoluntary() {
        return voluntary;
    }

    public void setVoluntary(boolean voluntary) {
        this.voluntary = voluntary;
    }

    public String getRfpQuoteOptionName() {
        return rfpQuoteOptionName;
    }

    public void setRfpQuoteOptionName(String rfpQuoteOptionName) {
        this.rfpQuoteOptionName = rfpQuoteOptionName;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getPlanCopay() {
        return planCopay;
    }

    public String getRateDescription() {
        return rateDescription;
    }

    public void setRateDescription(String rateDescription) {
        this.rateDescription = rateDescription;
    }

    public String getTier1Census() {
        return tier1Census;
    }

    public void setTier1Census(String tier1Census) {
        this.tier1Census = tier1Census;
    }

    public String getTier2Census() {
        return tier2Census;
    }

    public void setTier2Census(String tier2Census) {
        this.tier2Census = tier2Census;
    }

    public String getTier3Census() {
        return tier3Census;
    }

    public void setTier3Census(String tier3Census) {
        this.tier3Census = tier3Census;
    }

    public String getTier4Census() {
        return tier4Census;
    }

    public void setTier4Census(String tier4Census) {
        this.tier4Census = tier4Census;
    }

    public String getTier1Rate() {
        return tier1Rate;
    }

    public void setTier1Rate(String tier1Rate) {
        this.tier1Rate = tier1Rate;
    }

    public String getTier2Rate() {
        return tier2Rate;
    }

    public void setTier2Rate(String tier2Rate) {
        this.tier2Rate = tier2Rate;
    }

    public String getTier3Rate() {
        return tier3Rate;
    }

    public void setTier3Rate(String tier3Rate) {
        this.tier3Rate = tier3Rate;
    }

    public String getTier4Rate() {
        return tier4Rate;
    }

    public void setTier4Rate(String tier4Rate) {
        this.tier4Rate = tier4Rate;
    }

    public GenericPlanDetails getGenericPlanDetails() {
        return genericPlanDetails;
    }

    public void setGenericPlanDetails(GenericPlanDetails genericPlanDetails) {
        this.genericPlanDetails = genericPlanDetails;
    }

    public List<QuotePlanAttribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<QuotePlanAttribute> attributes) {
        this.attributes = attributes;
    }

    public void addAttribute(QuotePlanAttributeName name, String value) {
        attributes.add(new QuotePlanAttribute(name, value));
    }

    public String getPlanNameLocation() {
        return planNameLocation;
    }

    public void setPlanNameLocation(String planNameLocation) {
        this.planNameLocation = planNameLocation;
    }

    public String getTier1RateLocation() {
        return tier1RateLocation;
    }

    public void setTier1RateLocation(String tier1RateLocation) {
        this.tier1RateLocation = tier1RateLocation;
    }

    public String getTier2RateLocation() {
        return tier2RateLocation;
    }

    public void setTier2RateLocation(String tier2RateLocation) {
        this.tier2RateLocation = tier2RateLocation;
    }

    public String getTier3RateLocation() {
        return tier3RateLocation;
    }

    public void setTier3RateLocation(String tier3RateLocation) {
        this.tier3RateLocation = tier3RateLocation;
    }

    public String getTier4RateLocation() {
        return tier4RateLocation;
    }

    public void setTier4RateLocation(String tier4RateLocation) {
        this.tier4RateLocation = tier4RateLocation;
    }
}
