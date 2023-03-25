package com.benrevo.common.params;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RFPParams {
	
	public int companyId;
	@JsonProperty("groupId")
	public int clientId;
	
	
	public int getCompanyId() {
		return companyId;
	}
	public void setCompanyId(int companyId) {
		this.companyId = companyId;
	}
	public int getClientId() {
		return clientId;
	}
	public void setClientId(int clientId) {
		this.clientId = clientId;
	}
}
