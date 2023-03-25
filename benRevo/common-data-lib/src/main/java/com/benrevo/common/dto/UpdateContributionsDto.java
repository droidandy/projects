package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class UpdateContributionsDto {
	@NotNull
	private Long rfpQuoteOptionNetworkId;
	@NotNull
	private String erContributionFormat;
	private float tier1ErContribution;
	private float tier2ErContribution;
	private float tier3ErContribution;
	private float tier4ErContribution;
	private long tier1Enrollment;
	private long tier2Enrollment;
	private long tier3Enrollment;
	private long tier4Enrollment;
	private float tier1EeFund;
	private float tier2EeFund;
	private float tier3EeFund;
	private float tier4EeFund;

	public UpdateContributionsDto() {
	}

	public Long getRfpQuoteOptionNetworkId() {
		return rfpQuoteOptionNetworkId;
	}

	public void setRfpQuoteOptionNetworkId(Long rfpQuoteOptionNetworkId) {
		this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
	}

	public String getErContributionFormat() {
		return erContributionFormat;
	}

	public void setErContributionFormat(String erContributionFormat) {
		this.erContributionFormat = erContributionFormat;
	}

	public float getTier1ErContribution() {
		return tier1ErContribution;
	}

	public void setTier1ErContribution(float tier1ErContribution) {
		this.tier1ErContribution = tier1ErContribution;
	}

	public float getTier2ErContribution() {
		return tier2ErContribution;
	}

	public void setTier2ErContribution(float tier2ErContribution) {
		this.tier2ErContribution = tier2ErContribution;
	}

	public float getTier3ErContribution() {
		return tier3ErContribution;
	}

	public void setTier3ErContribution(float tier3ErContribution) {
		this.tier3ErContribution = tier3ErContribution;
	}

	public float getTier4ErContribution() {
		return tier4ErContribution;
	}

	public void setTier4ErContribution(float tier4ErContribution) {
		this.tier4ErContribution = tier4ErContribution;
	}

	public long getTier1Enrollment() {
		return tier1Enrollment;
	}

	public void setTier1Enrollment(long tier1Enrollment) {
		this.tier1Enrollment = tier1Enrollment;
	}

	public long getTier2Enrollment() {
		return tier2Enrollment;
	}

	public void setTier2Enrollment(long tier2Enrollment) {
		this.tier2Enrollment = tier2Enrollment;
	}

	public long getTier3Enrollment() {
		return tier3Enrollment;
	}

	public void setTier3Enrollment(long tier3Enrollment) {
		this.tier3Enrollment = tier3Enrollment;
	}

	public long getTier4Enrollment() {
		return tier4Enrollment;
	}

	public void setTier4Enrollment(long tier4Enrollment) {
		this.tier4Enrollment = tier4Enrollment;
	}

	public float getTier1EeFund() {
		return tier1EeFund;
	}

	public void setTier1EeFund(float tier1EeFund) {
		this.tier1EeFund = tier1EeFund;
	}

	public float getTier2EeFund() {
		return tier2EeFund;
	}

	public void setTier2EeFund(float tier2EeFund) {
		this.tier2EeFund = tier2EeFund;
	}

	public float getTier3EeFund() {
		return tier3EeFund;
	}

	public void setTier3EeFund(float tier3EeFund) {
		this.tier3EeFund = tier3EeFund;
	}

	public float getTier4EeFund() {
		return tier4EeFund;
	}

	public void setTier4EeFund(float tier4EeFund) {
		this.tier4EeFund = tier4EeFund;
	}
}
