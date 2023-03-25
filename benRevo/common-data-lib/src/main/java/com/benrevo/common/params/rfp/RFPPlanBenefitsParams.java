package com.benrevo.common.params.rfp;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RFPPlanBenefitsParams {

    @JsonProperty("plan_id")
	private int planId;
	@JsonProperty("client_id")
	private int clientId;

	public int getPlanId() {
		return planId;
	}

	public void setPlanId(int planId) {
		this.planId = planId;
	}

	public int getClientId() {
		return clientId;
	}

	public void setClientId(int clientId) {
		this.clientId = clientId;
	}
}
