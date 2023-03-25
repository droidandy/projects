package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class SelectRfpQuoteOptionNetworkAdmFeeDto {
	@NotNull
	Long rfpQuoteOptionNetworkId;
	
	Long administrativeFeeId;
	
	public SelectRfpQuoteOptionNetworkAdmFeeDto() {
	}

	public Long getRfpQuoteOptionNetworkId() {
		return rfpQuoteOptionNetworkId;
	}

	public void setRfpQuoteOptionNetworkId(Long rfpQuoteOptionNetworkId) {
		this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
	}

	public Long getAdministrativeFeeId() {
		return administrativeFeeId;
	}

	public void setAdministrativeFeeId(Long administrativeFeeId) {
		this.administrativeFeeId = administrativeFeeId;
	}
}
