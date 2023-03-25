package com.benrevo.common.dto;

public class CreateRfpQuoteOptionNetworkDto {

	private Long rfpQuoteNetworkId;
	private Long clientPlanId; 
	private Long networkId;

	public CreateRfpQuoteOptionNetworkDto() {
	}

	public CreateRfpQuoteOptionNetworkDto(Long rfpQuoteNetworkId) {
		this.rfpQuoteNetworkId = rfpQuoteNetworkId;
	}

	public Long getRfpQuoteNetworkId() {
		return rfpQuoteNetworkId;
	}

	public void setRfpQuoteNetworkId(Long rfpQuoteNetworkId) {
		this.rfpQuoteNetworkId = rfpQuoteNetworkId;
	}

	public Long getClientPlanId() {
		return clientPlanId;
	}

	public void setClientPlanId(Long clientPlanId) {
		this.clientPlanId = clientPlanId;
	}

	public Long getNetworkId() {
		return networkId;
	}

	public void setNetworkId(Long networkId) {
		this.networkId = networkId;
	}
}
