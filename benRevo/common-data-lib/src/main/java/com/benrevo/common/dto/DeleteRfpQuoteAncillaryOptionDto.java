package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class DeleteRfpQuoteAncillaryOptionDto {
	
	@NotNull
	private Long rfpQuoteAncillaryOptionId;

	public DeleteRfpQuoteAncillaryOptionDto() {
	}

	public DeleteRfpQuoteAncillaryOptionDto(Long rfpQuoteAncillaryOptionId) {
		this.rfpQuoteAncillaryOptionId = rfpQuoteAncillaryOptionId;
	}
    
    public Long getRfpQuoteAncillaryOptionId() {
        return rfpQuoteAncillaryOptionId;
    }
    
    public void setRfpQuoteAncillaryOptionId(Long rfpQuoteAncillaryOptionId) {
        this.rfpQuoteAncillaryOptionId = rfpQuoteAncillaryOptionId;
    }
}
