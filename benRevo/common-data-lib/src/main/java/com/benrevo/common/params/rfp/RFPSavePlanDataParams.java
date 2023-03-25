package com.benrevo.common.params.rfp;

import java.util.List;

import com.benrevo.common.dto.PlanClientData;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RFPSavePlanDataParams {

    @JsonProperty("client_id")
	private int clientId;
	@JsonProperty("client_data")
	private List<PlanClientData> clientData;
	
	public int getClientId() {
		return clientId;
	}

	public void setClientId(int clientId) {
		this.clientId = clientId;
	}

	public List<PlanClientData> getClientData() {
		return clientData;
	}

	public void setClientData(List<PlanClientData> clientData) {
		this.clientData = clientData;
	}
}
