package com.benrevo.common.params.rfp;

import java.util.List;

import com.benrevo.common.dto.BenefitClientData;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RFPSaveDataParams {

    @JsonProperty("client_id")
	private long clientId;
	@JsonProperty("client_data")
	private List<BenefitClientData> clientData;
	
	public long getClientId() {
		return clientId;
	}

	public void setClientId(long clientId) {
		this.clientId = clientId;
	}

	public List<BenefitClientData> getClientData() {
		return clientData;
	}

	public void setClientData(List<BenefitClientData> clientData) {
		this.clientData = clientData;
	}
}
