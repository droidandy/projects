package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class SelectRfpQuoteOptionNetworkPlanDto {
	@NotNull
	Long rfpQuoteOptionNetworkId;
	@NotNull
	Long rfpQuoteNetworkPlanId;
	
	public SelectRfpQuoteOptionNetworkPlanDto() {
	}

	public Long getRfpQuoteOptionNetworkId() {
		return rfpQuoteOptionNetworkId;
	}

	public void setRfpQuoteOptionNetworkId(Long rfpQuoteOptionNetworkId) {
		this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
	}

	public Long getRfpQuoteNetworkPlanId() {
		return rfpQuoteNetworkPlanId;
	}

	public void setRfpQuoteNetworkPlanId(Long rfpQuoteNetworkPlanId) {
		this.rfpQuoteNetworkPlanId = rfpQuoteNetworkPlanId;
	}
}
