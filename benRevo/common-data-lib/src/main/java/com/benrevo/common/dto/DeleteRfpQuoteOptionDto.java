package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class DeleteRfpQuoteOptionDto {
	
	@NotNull
	private Long rfpQuoteOptionId;

	public DeleteRfpQuoteOptionDto() {
	}

	public DeleteRfpQuoteOptionDto(Long rfpQuoteOptionId) {
		this.rfpQuoteOptionId = rfpQuoteOptionId;
	}

	public Long getRfpQuoteOptionId() {
		return rfpQuoteOptionId;
	}

	public void setRfpQuoteOptionId(Long rfpQuoteOptionId) {
		this.rfpQuoteOptionId = rfpQuoteOptionId;
	}
}
