package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

import com.benrevo.common.enums.QuoteType;

public class QuoteOptionPlanComparisonDto {
	
	public static class PlanByNetwork {
		public String networkName;
		public QuoteOptionAltPlanDto networkPlan;
		public String networkType;
	}
	private Long rfpQuoteOptionId;
	private String name;
	private String carrier;
	private boolean selected; // final selection
	private List<PlanByNetwork> plans = new ArrayList<>();
	private QuoteType quoteType;

	public QuoteOptionPlanComparisonDto() {
	}

	public Long getRfpQuoteOptionId() {
		return rfpQuoteOptionId;
	}

	public void setRfpQuoteOptionId(Long rfpQuoteOptionId) {
		this.rfpQuoteOptionId = rfpQuoteOptionId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCarrier() {
		return carrier;
	}

	public void setCarrier(String carrier) {
		this.carrier = carrier;
	}

	public List<PlanByNetwork> getPlans() {
		return plans;
	}

	public void setPlans(List<PlanByNetwork> plans) {
		this.plans = plans;
	}

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}

	public QuoteType getQuoteType() {
		return quoteType;
	}

	public void setQuoteType(QuoteType quoteType) {
		this.quoteType = quoteType;
	}
}
