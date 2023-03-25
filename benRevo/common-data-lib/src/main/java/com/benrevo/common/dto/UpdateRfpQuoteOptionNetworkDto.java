package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class UpdateRfpQuoteOptionNetworkDto {

	@NotNull
	private Long rfpQuoteOptionNetworkId;
	
	private Long rfpQuoteNetworkId;

	private Long networkId;
	
	public UpdateRfpQuoteOptionNetworkDto() {
	}

	public UpdateRfpQuoteOptionNetworkDto(Long rfpQuoteOptionNetworkId, Long rfpQuoteNetworkId) {
		this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
		this.rfpQuoteNetworkId = rfpQuoteNetworkId;
	}

	public Long getRfpQuoteNetworkId() {
		return rfpQuoteNetworkId;
	}

	public void setRfpQuoteNetworkId(Long rfpQuoteNetworkId) {
		this.rfpQuoteNetworkId = rfpQuoteNetworkId;
	}

	public Long getRfpQuoteOptionNetworkId() {
		return rfpQuoteOptionNetworkId;
	}

	public void setRfpQuoteOptionNetworkId(Long rfpQuoteOptionNetworkId) {
		this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
	}
  
    public Long getNetworkId() {
        return networkId;
    }
    
    public void setNetworkId(Long networkId) {
        this.networkId = networkId;
    }
}
