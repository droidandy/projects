package com.benrevo.test.utils.presentation;

import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.RfpQuoteSummaryDto;
import com.benrevo.test.api.BaseTest;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.apache.http.HttpStatus;
import org.testng.Assert;

import java.util.Random;

public class RfpQuoteSummaryUtil extends BaseTest {

	private static Gson gson = new GsonBuilder().create();

	public static RfpQuoteSummaryDto getRandomRfpQuoteSummaryDto() {
		Random random = new Random();
		RfpQuoteSummaryDto quoteSummaryDto = new RfpQuoteSummaryDto();

		quoteSummaryDto.setMedicalNotes("This is a randomly generated Medical note number " + random.nextInt(9999));
		quoteSummaryDto.setDentalNotes("This is a randomly generated Dental note number " + random.nextInt(9999));
		quoteSummaryDto.setVisionNotes("This is a randomly generated Vision note number " + random.nextInt(9999));

		return quoteSummaryDto;
	}

	public static RfpQuoteSummaryDto createRfpQuoteSummary(RfpQuoteSummaryDto rfpQuoteSummaryDto, ClientDto clientDto) {
		
		Response response = RestAssured.given()
				.headers(BaseTest.auth)
				.contentType(ContentType.JSON)
				.body(gson.toJson(rfpQuoteSummaryDto))
				.when()
				.post("/clients/" + clientDto.getId() + "/quotes/summary")
				.andReturn();
		if (response.statusCode() == HttpStatus.SC_CREATED) {
			return gson.fromJson(response.asString(), RfpQuoteSummaryDto.class);			
		}
		Assert.fail(response.asString());
		return null;
	}

	public static RfpQuoteSummaryDto getRfpQuoteSummary(ClientDto clientDto) {
		Response response = RestAssured.given()
				.headers(BaseTest.auth)
				.contentType(ContentType.JSON)
				.when()
				.get("/clients/" + clientDto.getId() + "/quotes/summary")
				.andReturn();
		if (response.statusCode() == HttpStatus.SC_OK) {
			return gson.fromJson(response.asString(), RfpQuoteSummaryDto.class);			
		}
		Assert.fail(response.asString());
		return null;
	}
	
	public static Response deleteRfpQuoteSummary(ClientDto clientDto) {
		Response response = RestAssured.given()
				.headers(BaseTest.auth)
				.contentType(ContentType.JSON)
				.when()
				.delete("/clients/" + clientDto.getId() + "/quotes/summary")
				.andReturn();
		if (response.statusCode() == HttpStatus.SC_OK) {
			return response;
		}
		Assert.fail(response.asString());
		return null;
	}
	
	public static RfpQuoteSummaryDto updateRfpQuoteSummary(ClientDto clientDto, RfpQuoteSummaryDto rfpQuoteSummaryDto) {
		Response response = RestAssured.given()
				.headers(BaseTest.auth)
				.contentType(ContentType.JSON)
				.body(gson.toJson(rfpQuoteSummaryDto))
				.when()
				.get("/clients/" + clientDto.getId() + "/quotes/summary")
				.andReturn();
		if (response.statusCode() == HttpStatus.SC_OK) {
			return gson.fromJson(response.asString(), RfpQuoteSummaryDto.class);			
		}
		Assert.fail(response.asString());
		return null;
	}
}
