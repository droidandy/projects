package com.benrevo.common.dto.ancillary;

import javax.validation.constraints.NotNull;

public class SelectRfpQuoteAnsillaryPlanDto {
	@NotNull
	Long rfpQuoteAncillaryOptionId;
	
	Long rfpQuoteAncillaryPlanId;
	
	Long secondRfpQuoteAncillaryPlanId;
	
	public SelectRfpQuoteAnsillaryPlanDto() {
	}
    
    public Long getRfpQuoteAncillaryOptionId() {
        return rfpQuoteAncillaryOptionId;
    }
    
    public void setRfpQuoteAncillaryOptionId(Long rfpQuoteAncillaryOptionId) {
        this.rfpQuoteAncillaryOptionId = rfpQuoteAncillaryOptionId;
    }
    
    public Long getRfpQuoteAncillaryPlanId() {
        return rfpQuoteAncillaryPlanId;
    }

    public void setRfpQuoteAncillaryPlanId(Long rfpQuoteAncillaryPlanId) {
        this.rfpQuoteAncillaryPlanId = rfpQuoteAncillaryPlanId;
    }

	public Long getSecondRfpQuoteAncillaryPlanId() {
		return secondRfpQuoteAncillaryPlanId;
	}

	public void setSecondRfpQuoteAncillaryPlanId(Long secondRfpQuoteAncillaryPlanId) {
		this.secondRfpQuoteAncillaryPlanId = secondRfpQuoteAncillaryPlanId;
	}
}
