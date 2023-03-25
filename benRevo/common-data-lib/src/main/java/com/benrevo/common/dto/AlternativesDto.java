package com.benrevo.common.dto;

import java.util.Map;

public class AlternativesDto {
	private long rfpQuoteOptionNetworkId;
	private AlternativeDto current;
	private Map<String, AlternativeDto> alternatives;

	public long getRfpQuoteOptionNetworkId() {
		return rfpQuoteOptionNetworkId;
	}

	public void setRfpQuoteOptionNetworkId(long rfpQuoteOptionNetworkId) {
		this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
	}

	public AlternativeDto getCurrent() {
		return current;
	}

	public void setCurrent(AlternativeDto current) {
		this.current = current;
	}

	public Map<String, AlternativeDto> getAlternatives() {
		return alternatives;
	}

	public void setAlternatives(Map<String, AlternativeDto> alternatives) {
		this.alternatives = alternatives;
	}

	
}
