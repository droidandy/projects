package com.benrevo.common.dto.ancillary;

import java.util.ArrayList;
import java.util.List;

public class RfpQuoteAncillaryOptionDto {

    private Long rfpQuoteAncillaryOptionId;
    private Long rfpQuoteId;
    private String name;
    private String displayName;
    private Double totalAnnualPremium;
    private Float percentDifference;
    private Double dollarDifference;
    private List<RfpQuoteAncillaryPlanDto> plans = new ArrayList<>();
    
    public RfpQuoteAncillaryOptionDto() {  
	}

    public Long getRfpQuoteId() {
        return rfpQuoteId;
    }

    public void setRfpQuoteId(Long rfpQuoteId) {
        this.rfpQuoteId = rfpQuoteId;
    }
    
    public Long getRfpQuoteAncillaryOptionId() {
        return rfpQuoteAncillaryOptionId;
    }
    
    public void setRfpQuoteAncillaryOptionId(Long rfpQuoteAncillaryOptionId) {
        this.rfpQuoteAncillaryOptionId = rfpQuoteAncillaryOptionId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public List<RfpQuoteAncillaryPlanDto> getPlans() {
        return plans;
    }

    public void setPlans(List<RfpQuoteAncillaryPlanDto> plans) {
        this.plans = plans;
    }
  
    public Double getTotalAnnualPremium() {
        return totalAnnualPremium;
    }

    public void setTotalAnnualPremium(Double totalAnnualPremium) {
        this.totalAnnualPremium = totalAnnualPremium;
    }
 
    public Float getPercentDifference() {
        return percentDifference;
    }

    public void setPercentDifference(Float percentDifference) {
        this.percentDifference = percentDifference;
    }

    public Double getDollarDifference() {
        return dollarDifference;
    }

    public void setDollarDifference(Double dollarDifference) {
        this.dollarDifference = dollarDifference;
    }
}
