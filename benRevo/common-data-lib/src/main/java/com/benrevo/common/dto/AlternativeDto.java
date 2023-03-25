package com.benrevo.common.dto;

public class AlternativeDto {
	private Long rfpQuoteNetworkPlanId;
	private String carrier;
	private String planName;
	private boolean selected;
	private String deductible;
	private float percentDifference;
	private float total;

	public Long getRfpQuoteNetworkPlanId() {
		return rfpQuoteNetworkPlanId;
	}

	public void setRfpQuoteNetworkPlanId(Long rfpQuoteNetworkPlanId) {
		this.rfpQuoteNetworkPlanId = rfpQuoteNetworkPlanId;
	}

	public String getCarrier() {
		return carrier;
	}

	public void setCarrier(String carrier) {
		this.carrier = carrier;
	}

	public String getPlanName() {
		return planName;
	}

	public void setPlanName(String planName) {
		this.planName = planName;
	}

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}

	public String getDeductible() {
		return deductible;
	}

	public void setDeductible(String deductible) {
		this.deductible = deductible;
	}

	public float getPercentDifference() {
		return percentDifference;
	}

	public void setPercentDifference(float percentDifference) {
		this.percentDifference = percentDifference;
	}

	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}
	
	
}
