package com.benrevo.common.params;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ClientFileUploadParams {

	private long id;
	@JsonProperty("set_id")
	private int infoValueId;

	public int getInfoValueId() {
		return infoValueId;
	}

	public void setInfoValueId(int infoValueId) {
		this.infoValueId = infoValueId;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
}
