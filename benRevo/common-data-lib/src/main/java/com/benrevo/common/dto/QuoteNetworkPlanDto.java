package com.benrevo.common.dto;

public class QuoteNetworkPlanDto {

	private Long pnnId;

	private String planName;

	private String planType;

	private boolean matchPlan;

	private Float tier1Rate;

	private Float tier2Rate;

	private Float tier3Rate;

	private Float tier4Rate;

	public QuoteNetworkPlanDto() {
	}

	public QuoteNetworkPlanDto(String planName, String planType, boolean matchPlan, Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate) {
		this.planName = planName;
		this.planType = planType;
		this.matchPlan = matchPlan;
		this.tier1Rate = tier1Rate;
		this.tier2Rate = tier2Rate;
		this.tier3Rate = tier3Rate;
		this.tier4Rate = tier4Rate;
	}

	public String getPlanName() {
		return planName;
	}

	public void setPlanName(String planName) {
		this.planName = planName;
	}

	public String getPlanType() {
		return planType;
	}

	public void setPlanType(String planType) {
		this.planType = planType;
	}

	public boolean isMatchPlan() {
		return matchPlan;
	}

	public void setMatchPlan(boolean matchPlan) {
		this.matchPlan = matchPlan;
	}

	public Float getTier1Rate() {
		return tier1Rate;
	}

	public void setTier1Rate(Float tier1Rate) {
		this.tier1Rate = tier1Rate;
	}

	public Float getTier2Rate() {
		return tier2Rate;
	}

	public void setTier2Rate(Float tier2Rate) {
		this.tier2Rate = tier2Rate;
	}

	public Float getTier3Rate() {
		return tier3Rate;
	}

	public void setTier3Rate(Float tier3Rate) {
		this.tier3Rate = tier3Rate;
	}

	public Float getTier4Rate() {
		return tier4Rate;
	}

	public void setTier4Rate(Float tier4Rate) {
		this.tier4Rate = tier4Rate;
	}

	public Long getPnnId() {
		return pnnId;
	}

	public void setPnnId(Long pnnId) {
		this.pnnId = pnnId;
	}
}
