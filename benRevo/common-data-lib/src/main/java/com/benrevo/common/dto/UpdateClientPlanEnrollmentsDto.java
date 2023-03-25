package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class UpdateClientPlanEnrollmentsDto {
	@NotNull
	private Long clientPlanId;
	@NotNull
	private Long tier1Enrollment;
	@NotNull
	private Long tier2Enrollment;
	@NotNull
	private Long tier3Enrollment;
	@NotNull
	private Long tier4Enrollment;
	
	public UpdateClientPlanEnrollmentsDto() {
	}

	public Long getClientPlanId() {
		return clientPlanId;
	}

	public void setClientPlanId(Long clientPlanId) {
		this.clientPlanId = clientPlanId;
	}

	public Long getTier1Enrollment() {
		return tier1Enrollment;
	}

	public void setTier1Enrollment(Long tier1Enrollment) {
		this.tier1Enrollment = tier1Enrollment;
	}

	public Long getTier2Enrollment() {
		return tier2Enrollment;
	}

	public void setTier2Enrollment(Long tier2Enrollment) {
		this.tier2Enrollment = tier2Enrollment;
	}

	public Long getTier3Enrollment() {
		return tier3Enrollment;
	}

	public void setTier3Enrollment(Long tier3Enrollment) {
		this.tier3Enrollment = tier3Enrollment;
	}

	public Long getTier4Enrollment() {
		return tier4Enrollment;
	}

	public void setTier4Enrollment(Long tier4Enrollment) {
		this.tier4Enrollment = tier4Enrollment;
	}
}
