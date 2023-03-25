package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class QuoteOptionPlanAlternativesDto {

	private Long rfpQuoteOptionId;
	private Long rfpQuoteNetworkId;
	private String optionName;
	private List<QuoteOptionAltPlanDto> plans = new ArrayList<>();
	private List<QuoteOptionAltRxDto> rx = new ArrayList<>();
	
	public QuoteOptionPlanAlternativesDto() {
	}

	public List<QuoteOptionAltPlanDto> getPlans() {
		return plans;
	}

	public void setPlans(List<QuoteOptionAltPlanDto> plans) {
		this.plans = plans;
	}

	public List<QuoteOptionAltRxDto> getRx() {
		return rx;
	}

	public void setRx(List<QuoteOptionAltRxDto> rx) {
		this.rx = rx;
	}

	public Long getRfpQuoteOptionId() {
		return rfpQuoteOptionId;
	}

	public void setRfpQuoteOptionId(Long rfpQuoteOptionId) {
		this.rfpQuoteOptionId = rfpQuoteOptionId;
	}

	public String getOptionName() {
		return optionName;
	}

	public void setOptionName(String optionName) {
		this.optionName = optionName;
	}

    public Long getRfpQuoteNetworkId() {
        return rfpQuoteNetworkId;
    }

    public void setRfpQuoteNetworkId(Long rfpQuoteNetworkId) {
        this.rfpQuoteNetworkId = rfpQuoteNetworkId;
    }
}
