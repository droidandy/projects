package com.benrevo.common.http.responseContent;

import com.benrevo.common.dto.Account;
import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginContent {

	private Object account;

	public Object getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		Content content = new Content();
		content.setActive(account.getActive());
		content.setVerified(account.getVerified());
		content.setNotified(account.getNotified());
		content.setEmail(account.getEmail());
		content.setBrokerId(account.getBrokerId());
		content.setName(account.getName());
		this.account = content;
	}
	
	class Content {
		
		private String email;
		private int verified;
		private int active;
		private int notified;
		@JsonProperty("broker_id")
		private long brokerId;
		private String name;
		
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public int getVerified() {
			return verified;
		}
		public void setVerified(int verified) {
			this.verified = verified;
		}
		public int getActive() {
			return active;
		}
		public void setActive(int active) {
			this.active = active;
		}
		public long getBrokerId() {
			return brokerId;
		}
		public void setBrokerId(long brokerId) {
			this.brokerId = brokerId;
		}
		public int getNotified() {
			return notified;
		}
		public void setNotified(int notified) {
			this.notified = notified;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		
	}
}
