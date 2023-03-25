package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class FavoriteRfpQuoteNetworkPlanDto {
	@NotNull
	Long rfpQuoteNetworkId;
	@NotNull
	Long rfpQuoteNetworkPlanId;

	public FavoriteRfpQuoteNetworkPlanDto() {
	}

	public Long getRfpQuoteNetworkId() {
		return rfpQuoteNetworkId;
	}

	public void setRfpQuoteNetworkId(Long rfpQuoteNetworkId) {
		this.rfpQuoteNetworkId = rfpQuoteNetworkId;
	}

	public Long getRfpQuoteNetworkPlanId() {
		return rfpQuoteNetworkPlanId;
	}

	public void setRfpQuoteNetworkPlanId(Long rfpQuoteNetworkPlanId) {
		this.rfpQuoteNetworkPlanId = rfpQuoteNetworkPlanId;
	}
}
