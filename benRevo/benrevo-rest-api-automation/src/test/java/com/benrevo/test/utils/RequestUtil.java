package com.benrevo.test.utils;

import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;
import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;

public class RequestUtil {



	public static final class Post {
		String baseUrl = RestAssured.baseURI;
		String path;
		String body;
		HashMap<String, Object> queryParameters;
		HashMap<String, String> headers;
		ContentType contentType;

		public Post() {}

		public Post withUrl(String val) {
			path = val;
			return this;
		}
		
		public Post withContentType(ContentType contentType) {
			this.contentType = contentType;
			return this;
		}

		public Post withQueryParams(HashMap<String, Object> querryParams) {
			queryParameters = querryParams;
			return this;
		}
		
		public Post withHeaders(HashMap<String, String> headers) {
			this.headers = headers;
			return this;
		}

		public Post withBaseUrl(String val) {
			if(StringUtils.isNotBlank(val)){
				baseUrl = val;
			}
			return this;
		}

		public Post withBody(String val) {
			body = val;
			return this;
		}

		public BenrevoResponse execute() {
			RequestSpecBuilder builder = new RequestSpecBuilder();
			if (body != null) {
				builder.setBody(body);				
			}
			if (baseUrl != null && path != null) {
				builder.setBaseUri(baseUrl + path);				
			}
			if (queryParameters != null) {
				builder.addQueryParameters(queryParameters);
			}
			if (headers != null) {
				builder.addHeaders(headers);
			}
			if (contentType != null) {
				builder.setContentType(this.contentType);
			}

			return new BenrevoResponse()
					.post(builder.build());

		}
	}

	public static final class Get {
		String baseUrl = RestAssured.baseURI;
		String path;
		String body;
		HashMap<String, Object> queryParameters;
		HashMap<String, String> headers;

		public Get() {}

		public Get withUrl(String val) {
			path = val;
			return this;
		}

		public Get withQueryParams(HashMap<String, Object> querryParams) {
			queryParameters = querryParams;
			return this;
		}
		
		public Get withHeaders(HashMap<String, String> headers) {
			this.headers = headers;
			return this;
		}

		public Get withBaseUrl(String val) {
			if(StringUtils.isNotBlank(val)){
				baseUrl = val;
			}
			return this;
		}

		public Get withBody(String val) {
			body = val;
			return this;
		}

		public BenrevoResponse execute() {
			RequestSpecBuilder builder = new RequestSpecBuilder();
			if (body != null) {
				builder.setBody(body);				
			}
			if (baseUrl != null && path != null) {
				builder.setBaseUri(baseUrl + path);				
			}
			if (queryParameters != null) {
				builder.addQueryParameters(queryParameters);
			}
			if (headers != null) {
				builder.addHeaders(headers);
			}

			return new BenrevoResponse()
					.get(builder.build());

		}
	}
	
	public static final class Put {
		String baseUrl = RestAssured.baseURI;
		String path;
		String body;
		ContentType contentType;
		HashMap<String, Object> queryParameters;
		HashMap<String, String> headers;

		public Put() {}

		public Put withUrl(String val) {
			path = val;
			return this;
		}

		public Put withQueryParams(HashMap<String, Object> querryParams) {
			queryParameters = querryParams;
			return this;
		}
		
		public Put withHeaders(HashMap<String, String> headers) {
			this.headers = headers;
			return this;
		}

		public Put withBaseUrl(String val) {
			if(StringUtils.isNotBlank(val)){
				baseUrl = val;
			}
			return this;
		}

		public Put withBody(String val) {
			body = val;
			return this;
		}
		
		public Put withContentType(ContentType contentType) {
			this.contentType = contentType;
			return this;
		}

		public BenrevoResponse execute() {
			RequestSpecBuilder builder = new RequestSpecBuilder();
			if (body != null) {
				builder.setBody(body);				
			}
			if (baseUrl != null && path != null) {
				builder.setBaseUri(baseUrl + path);				
			}
			if (queryParameters != null) {
				builder.addQueryParameters(queryParameters);
			}
			if (headers != null) {
				builder.addHeaders(headers);
			}
			if (contentType != null) {
				builder.setContentType(contentType);
			}

			return new BenrevoResponse()
					.put(builder.build());

		}

	}
}
