package com.benrevo.common.http;

import com.benrevo.common.http.responseContent.AccessTokenContent;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ServerResponse {

	private Object success;
	private Object result;
	private Object authorization;

	public Object getSuccess() {
		return success;
	}
	
	public void setAuthorized(Object auth, Object content, String message) {
		setSuccess(content, message);
		setAuthorization((AccessTokenContent) auth);
	}
	
	public void setAuthorized(Object auth, String message) {
		setSuccess(message);
		setAuthorization((AccessTokenContent) auth);
	}
	
	public void setSuccess(Object toJson, String message) {
		success = new Boolean(true);
		setResult(message, toJson);
	}
	
	public void setSuccess(String message) {
		success = new Boolean(true);
		setResult(message);
	}
	
	public void setError(Object toJson, String message) {
		success = new Boolean(false);
		setResult(message, toJson);
	}
	
	public void setError(String message) {
		success = new Boolean(false);
		setResult(message);
	}
	
	public Object getResult() {
		return result;
	}
	
	public void setResult(String message) {
		setResult(message, null);
	}
	
	public void setResult(String message, Object content) {
		Result result = new Result();
		result.setMessage(message);
		result.setContent(content);
		this.result = result;		
	}

	public Object getAuthorization() {
		return authorization;
	}

	public void setAuthorization(AccessTokenContent accessToken) {
		Authorization auth = new Authorization();
		auth.setAccessToken(accessToken.getAccessToken());
		this.authorization = auth;
	}

	class Result {
		
		private Object message;
		private Object content;
		
		public Object getMessage() {
			return message;
		}
		
		public void setMessage(String message) {
			this.message = message;
		}
		
		public Object getContent() {
			return content;
		}
		
		public void setContent(Object content) {
			this.content = content != null ? content : new Object();
		}		
	}
	
	class Authorization {

	    @JsonProperty("access_token")
		private Object accessToken;
		
		public Object getAccessToken() {
			return accessToken;
		}
		
		public void setAccessToken(Object accessToken) {
			this.accessToken = accessToken;
		}		
	}

}
