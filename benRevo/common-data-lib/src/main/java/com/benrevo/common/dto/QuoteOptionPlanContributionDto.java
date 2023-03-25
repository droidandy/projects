package com.benrevo.common.dto;

public class QuoteOptionPlanContributionDto {
	private String planName;
	private Float currentER;
	private Float fundEE;
	private Float proposedER;
	private Float proposedEE;
	private Float diffEE;
	private Long currentEnrollment;
	private Long proposedEnrollment;
	
	public QuoteOptionPlanContributionDto() {
	}

	public String getPlanName() {
		return planName;
	}

	public void setPlanName(String planName) {
		this.planName = planName;
	}

	public Float getCurrentER() {
		return currentER;
	}

	public void setCurrentER(Float currentER) {
		this.currentER = currentER;
	}

	public Float getProposedER() {
		return proposedER;
	}

	public void setProposedER(Float proposedER) {
		this.proposedER = proposedER;
	}

	public Float getProposedEE() {
		return proposedEE;
	}

	public void setProposedEE(Float proposedEE) {
		this.proposedEE = proposedEE;
	}

	public Float getDiffEE() {
		return diffEE;
	}

	public void setDiffEE(Float diffEE) {
		this.diffEE = diffEE;
	}

	public Long getCurrentEnrollment() {
		return currentEnrollment;
	}

	public void setCurrentEnrollment(Long currentEnrollment) {
		this.currentEnrollment = currentEnrollment;
	}

	public Long getProposedEnrollment() {
		return proposedEnrollment;
	}

	public void setProposedEnrollment(Long proposedEnrollment) {
		this.proposedEnrollment = proposedEnrollment;
	}

	public Float getFundEE() {
		return fundEE;
	}

	public void setFundEE(Float fundEE) {
		this.fundEE = fundEE;
	}
}
