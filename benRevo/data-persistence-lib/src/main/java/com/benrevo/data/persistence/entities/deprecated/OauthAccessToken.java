package com.benrevo.data.persistence.entities.deprecated;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.benrevo.common.dto.deprecated.AccessToken;
import com.benrevo.common.util.Secure;

//@Entity
//@Table(name = "oauth_access_token")
public class OauthAccessToken {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "oauth_access_token_id")
	private Long oauthAccessTokenId;
	
	@Column	(name = "user_id")
	private Long userId;
	
	@Column	(name = "expires_in")
	private Long expiresIn;
	
	@Column (name = "access_token")
	private String accessToken;

	public OauthAccessToken() {} 
	
	public OauthAccessToken(Long userId) {
		this.userId = userId;
		expiresIn = 36600L;
		accessToken = Secure.generateRandomToken();
	}

	public Long getOauthAccessTokenId() {
		return oauthAccessTokenId;
	}

	public void setOauthAccessTokenId(Long oauthAccessTokenId) {
		this.oauthAccessTokenId = oauthAccessTokenId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getExpiresIn() {
		return expiresIn;
	}

	public void setExpiresIn(Long expiresIn) {
		this.expiresIn = expiresIn;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}
	
	public AccessToken toAccessToken() {
		AccessToken result = new AccessToken();
		result.setAccessToken(this.getAccessToken());
		result.setExpiresIn(this.getExpiresIn());
		result.setUsersId(this.getUserId());
		result.setTokenType("Bearer");
		return result;
	}
}
