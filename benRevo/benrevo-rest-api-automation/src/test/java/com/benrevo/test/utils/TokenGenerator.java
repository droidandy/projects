package com.benrevo.test.utils;


import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by lemdy on 6/6/17.
 */
public class TokenGenerator {

	//oauth secret
//	private static 

	private static  HashMap<String, String> auth = new HashMap<String, String>();


	public static HashMap<String,String> createAuthMap(String secret) throws UnsupportedEncodingException {
		String accessToken = createToken(secret);
		auth.put("Authorization", "Bearer " + accessToken);
		return auth;
	}

	public static String createToken(String secret) throws UnsupportedEncodingException {
		// brokerage ID
		return createTokenForBroker("ad53547e-8512-4b81-9738-6e703aebe6ff", secret);
	}

	public static String createTokenForBroker(String brokerageId, String secret) throws UnsupportedEncodingException {
		LinkedHashMap<String, String> linkedHashMap = new LinkedHashMap<String, String>();

		linkedHashMap.put("roles", "Delegated Admin - User");
		linkedHashMap.put("brokerage", "BenRevo Automation");
		linkedHashMap.put("brokerageRole", "admin");
		linkedHashMap.put("brokerageId", brokerageId);

//		JwtBuilder JWT = Jwts.builder().claim("app_metadata", linkedHashMap)
//				.setHeaderParam("typ", "JWT")
//				.setIssuer("https://cryptyk.auth0.com/")
//				.setSubject("auth0|58c362ab6c180767800b938b")
//				.setAudience("sgHcHFge9CWD48Asz77uM7YsmbHRUzWQ")
//				.signWith(SignatureAlgorithm.HS256, secret.getBytes("UTF-8"));
//
//		return JWT.compact();

		return null;
	}

	public static String getAPIToken() {
		String JWT = null;

		Map<String, String> dataMap = new HashMap<String, String>();
		dataMap.put("grant_type", "client_credentials");
		dataMap.put("client_id", "jKvsPYpoUpVuVab1XANMm34HP7AjIuBf");
		dataMap.put("client_secret", "pPF_7bQn7hMeAPJFFbr_sgn5xbtgwOGT5xIE-0uy7id9BdJzqZSmS1Mg92tHyDVF");
		dataMap.put("audience", "https://cryptyk.auth0.com/api/v2/");
		JSONObject dataJson = new JSONObject(dataMap);

		StringEntity requestEntity = new StringEntity(dataJson.toString(), ContentType.APPLICATION_JSON);

		HttpClient httpClient = HttpClientBuilder.create().build();

		final String url = "https://cryptyk.auth0.com/oauth/token";
		HttpPost post = new HttpPost(url);
		post.setHeader("Content-type", "application/json");
		post.setEntity(requestEntity);

		try {
			HttpResponse rawResponse = httpClient.execute(post);
			String json = EntityUtils.toString(rawResponse.getEntity());
			EntityUtils.consume(rawResponse.getEntity());
			JSONObject jsonObject = new JSONObject(json);
			JWT = jsonObject.getString("access_token");
		} catch (IOException e) {
			e.printStackTrace();
		}

		return JWT;
	}
}
