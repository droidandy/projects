package com.benrevo.common.params;

public class ValidateAccountParams {
	
	private String email;
	// Account verification code
	private String av;
	
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getAv() {
		return av;
	}
	public void setAv(String av) {
		this.av = av;
	}
}