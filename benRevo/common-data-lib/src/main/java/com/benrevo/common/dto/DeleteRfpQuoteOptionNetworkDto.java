package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class DeleteRfpQuoteOptionNetworkDto {
	
	@NotNull
	private Long rfpQuoteOptionNetworkId;

	public DeleteRfpQuoteOptionNetworkDto() {
	}

	public DeleteRfpQuoteOptionNetworkDto(Long rfpQuoteOptionNetworkId) {
		this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
	}

	public Long getRfpQuoteOptionNetworkId() {
		return rfpQuoteOptionNetworkId;
	}

	public void setRfpQuoteOptionNetworkId(Long rfpQuoteOptionNetworkId) {
		this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
	}
}
