package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class AccountRequestVerificationDto {

	@NotNull
    private Long accountRequestId;

    private String denyReason;

	private String bcc;

	public AccountRequestVerificationDto() {
	}

	public String getBcc() {
		return bcc;
	}

	public void setBcc(String bcc) {
		this.bcc = bcc;
	}

	public Long getAccountRequestId() {
		return accountRequestId;
	}

	public void setAccountRequestId(Long accountRequestId) {
		this.accountRequestId = accountRequestId;
	}

	public String getDenyReason() {
		return denyReason;
	}

	public void setDenyReason(String denyReason) {
		this.denyReason = denyReason;
	}
}
