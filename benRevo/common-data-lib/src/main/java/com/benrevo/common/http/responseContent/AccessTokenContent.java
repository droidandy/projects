package com.benrevo.common.http.responseContent;

import com.benrevo.common.dto.deprecated.AccessToken;
import com.benrevo.common.util.Encryptor;
import com.google.gson.Gson;

public class AccessTokenContent {

	private String accessToken;

	public String getAccessToken() {
		return accessToken;
	}
	
	public void setAccessToken(AccessToken accessToken) {
		Gson gson = new Gson();
		String token = Encryptor.encrypt(gson.toJson(accessToken));
		this.accessToken = token;
	}

}
