package com.benrevo.data.persistence.dao;

import com.benrevo.data.persistence.entities.User;
import com.google.gson.annotations.SerializedName;

public class UserWithOperationStatus {

	public static final String OPERATION_RESULT_SUCCESS = "SUCCESS";
	public static final String OPERATION_RESULT_USER_NOT_FOUND = "USER_NOT_FOUND";
	public static final String OPERATION_RESULT_CHAMPION_NOT_FOUND = "CHAMPION_NOT_FOUND";
	
	private User user;
	@SerializedName("operation_status")
	private String operationStatus;

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getOperationStatus() {
		return operationStatus;
	}

	public void setOperationStatus(String operationStatus) {
		this.operationStatus = operationStatus;
	}
}
