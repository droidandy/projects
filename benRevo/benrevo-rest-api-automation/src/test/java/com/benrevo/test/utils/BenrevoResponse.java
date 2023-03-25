package com.benrevo.test.utils;

import com.benrevo.test.api.BaseTest;
import io.restassured.RestAssured;
import io.restassured.http.Cookie;
import io.restassured.http.Cookies;
import io.restassured.http.Headers;
import io.restassured.mapper.ObjectMapper;
import io.restassured.mapper.ObjectMapperType;
import io.restassured.path.json.JsonPath;
import io.restassured.path.json.config.JsonPathConfig;
import io.restassured.path.xml.XmlPath;
import io.restassured.path.xml.XmlPath.CompatibilityMode;
import io.restassured.path.xml.config.XmlPathConfig;
import io.restassured.response.Response;
import io.restassured.response.ResponseBody;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;

import java.io.InputStream;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class BenrevoResponse {
	
	private Response response;
	
	public BenrevoResponse get(RequestSpecification requestSpecification) {
		response = RestAssured.given(requestSpecification)
							  .get();
		return this;
	}
	
	public BenrevoResponse put(RequestSpecification requestSpecification) {
		response = RestAssured.given(requestSpecification)
				.put();
		return this;
	}
	
	public BenrevoResponse post(RequestSpecification requestSpecification) {
		response = RestAssured.given(requestSpecification)
				.post();
		return this;
	}
	
	public BenrevoResponse delete(RequestSpecification requestSpecification) {
		response = RestAssured.given(requestSpecification)
				.delete();
		return this;
	}
	
	public <T> T getAsType(Class<T> type) {
		return BaseTest.gson.fromJson(response.asString(), type);
	}

	public String asString() {
		return response.asString();
	}

	public String print() {
		return response.print();
	}

	public ValidatableResponse then() {
		return response.then();
	}

	public Response andReturn() {
		return response.andReturn();
	}

	public byte[] asByteArray() {
		return response.asByteArray();
	}

	public Response thenReturn() {
		return response.thenReturn();
	}

	public String prettyPrint() {
		return response.prettyPrint();
	}

	public InputStream asInputStream() {
		return response.asInputStream();
	}

	public <T> T as(Class<T> cls) {
		return response.as(cls);
	}

	public ResponseBody<?> body() {
		return response.body();
	}

	public ResponseBody<?> getBody() {
		return response.getBody();
	}

	public Response peek() {
		return response.peek();
	}

	public Headers headers() {
		return response.headers();
	}

	public Headers getHeaders() {
		return response.getHeaders();
	}

	public <T> T as(Class<T> cls, ObjectMapperType mapperType) {
		return response.as(cls, mapperType);
	}

	public String header(String name) {
		return response.header(name);
	}

	public <T> T as(Class<T> cls, ObjectMapper mapper) {
		return response.as(cls, mapper);
	}

	public Response prettyPeek() {
		return response.prettyPeek();
	}

	public String getHeader(String name) {
		return response.getHeader(name);
	}

	public JsonPath jsonPath() {
		return response.jsonPath();
	}

	public Map<String, String> cookies() {
		return response.cookies();
	}

	public Cookies detailedCookies() {
		return response.detailedCookies();
	}

	public JsonPath jsonPath(JsonPathConfig config) {
		return response.jsonPath(config);
	}

	public Map<String, String> getCookies() {
		return response.getCookies();
	}

	public XmlPath xmlPath() {
		return response.xmlPath();
	}

	public Cookies getDetailedCookies() {
		return response.getDetailedCookies();
	}

	public String cookie(String name) {
		return response.cookie(name);
	}

	public XmlPath xmlPath(XmlPathConfig config) {
		return response.xmlPath(config);
	}

	public String getCookie(String name) {
		return response.getCookie(name);
	}

	public XmlPath xmlPath(CompatibilityMode compatibilityMode) {
		return response.xmlPath(compatibilityMode);
	}

	public Cookie detailedCookie(String name) {
		return response.detailedCookie(name);
	}

	public Cookie getDetailedCookie(String name) {
		return response.getDetailedCookie(name);
	}

	public XmlPath htmlPath() {
		return response.htmlPath();
	}

	public String contentType() {
		return response.contentType();
	}

	public String getContentType() {
		return response.getContentType();
	}

	public <T> T path(String path, String... arguments) {
		return response.path(path, arguments);
	}

	public String statusLine() {
		return response.statusLine();
	}

	public String getStatusLine() {
		return response.getStatusLine();
	}

	public String sessionId() {
		return response.sessionId();
	}

	public String getSessionId() {
		return response.getSessionId();
	}

	public int statusCode() {
		return response.statusCode();
	}

	public int getStatusCode() {
		return response.getStatusCode();
	}

	public long time() {
		return response.time();
	}

	public long timeIn(TimeUnit timeUnit) {
		return response.timeIn(timeUnit);
	}

	public long getTime() {
		return response.getTime();
	}

	public long getTimeIn(TimeUnit timeUnit) {
		return response.getTimeIn(timeUnit);
	}
}
