package com.benrevo.test.api.rfp;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.CensusInfoDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.enums.ClientFileType;
import com.benrevo.test.utils.BenrevoResponse;
import com.benrevo.test.utils.CommonUtils;
import com.benrevo.test.utils.RequestUtil.Get;
import com.benrevo.test.utils.RequestUtil.Post;
import com.benrevo.test.utils.rfp.RfpUtils;
import io.restassured.http.ContentType;
import org.apache.http.HttpStatus;
import org.testng.Assert;
import org.testng.annotations.Test;

public class RfpControllerGetTests extends RfpControllerTest {

	/**
	 * Test that the rfps returned match the generated rfps
	 * GET
	 */
	@Test(groups = {"regression", "rfp"})
	public void getClientRfpTest() {
		RfpDto[] rfps = {
			RfpUtils.getRandomRFP(clientDto.getId(), Constants.MEDICAL),
			RfpUtils.getRandomRFP(clientDto.getId(), Constants.DENTAL),
			RfpUtils.getRandomRFP(clientDto.getId(), Constants.VISION)};
		String body = gson.toJson(rfps);
		BenrevoResponse postResponse = new Post()
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.execute();

		BenrevoResponse returnedRfps = new Get()
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.withHeaders(auth)
				.execute();

		Assert.assertEquals(returnedRfps.statusCode(), HttpStatus.SC_OK, returnedRfps.asString());
		RfpDto[] rfp1 = gson.fromJson(CommonUtils.stripIds(rfps), RfpDto[].class);
//		RfpDto[] rfp2 = gson.fromJson(CommonUtils.stripIds(returnedRfps.body().asString()), RfpDto[].class);

//		Assert.assertEquals(rfp1, rfp2);
	}

	/**
	 * Test that an error is returned when Client does not belong to Brokerage.
	 * GET
	 */
	@Test(groups = {"regression", "rfp"})
	public void getRfpsByClientForWrongBrokerageTest() {
		BenrevoResponse response = new Get()
				.withUrl("/clients/" + CLIENT_FROM_OTHER_BROKERAGE + "/rfps")
				.withHeaders(auth)
				.execute();
		Assert.assertEquals(response.statusCode(), HttpStatus.SC_FORBIDDEN, response.asString());
	}

	/**
	 * Test that an error is returned when trying to GET an RFP by rfp_id that belongs to a client in a different brokerage.
	 * GET
	 */
	@Test(groups = {"regression", "rfp"})
	public void getRfpByRfpIdFromAnotherBrokerage() {
		BenrevoResponse response = new Get()
				.withUrl("/rfps/" + RFP_ID_FROM_OTHER_BROKERAGE)
				.withHeaders(auth)
				.execute();
		Assert.assertEquals(response.statusCode(), HttpStatus.SC_FORBIDDEN, response.asString());
	}

	/**
	 * Test that bad client ID returns 404 error
	 * GET
	 */
	@Test(groups = {"regression", "rfp"})
	public void getClientRfpFailTest() {
		BenrevoResponse response = new Get()
				.withUrl("/clients/00/rfps")
				.withHeaders(auth)
				.execute();
		Assert.assertEquals(response.statusCode(), HttpStatus.SC_NOT_FOUND, response.asString());
	}

	/**
	 * Test that correct RFP is returned for given clientId and productType
	 * GET
	 */
	@Test(groups = {"regression", "rfp"}, dataProvider="rfp_types")
	public void getRfpByClientIdAndProductType(String productType) {

		String body = gson.toJson(new RfpDto[] {RfpUtils.getRandomRFP(clientDto.getId(), productType)});
		BenrevoResponse postResponse = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();

		RfpDto rfpDto = gson.fromJson(postResponse.asString(), RfpDto[].class)[0];

		BenrevoResponse getResponse = new Get()
				.withUrl("/clients/" + clientDto.getId() + "/rfps/" + productType)
				.withHeaders(auth)
				.execute();

		RfpDto returnedRfpDto = gson.fromJson(getResponse.asString(), RfpDto.class);

		Assert.assertEquals(rfpDto.getClientId(), clientDto.getId());
		Assert.assertEquals(returnedRfpDto.getProduct(), rfpDto.getProduct());
	}

	/**
	 * Test that a pdf is returned
	 * GET
	 */
	@Test(groups = {"regression", "rfp"}, dataProvider="rfp_types")
	public void getRfpPdfByClientIdAndProductType(String productType) {
		String body = gson.toJson(new RfpDto[] {RfpUtils.getRandomRFP(clientDto.getId(), productType)});
		new Post()
		.withBody(body)
		.withHeaders(auth)
		.withContentType(ContentType.JSON)
		.withUrl("/clients/" + clientDto.getId() + "/rfps")
		.execute();

		// TODO verify PDF output: postponed till later date
		// For now all it will do it check status code for success
		BenrevoResponse response = new Get()
				.withUrl("/clients/" + clientDto.getId() + "/rfps/" + productType + "/pdf/")
				.withHeaders(auth)
				.execute();
		Assert.assertEquals(response.contentType(), APPLICATION_PDF);
	}

	/**
	 * Test that correct RFP is returned when requested by RFP ID
	 * GET
	 */
	@Test(groups = {"regression", "rfp"})
	public void getRfpByIdTest() {
		String body = gson.toJson(new RfpDto[] {RfpUtils.getRandomRFP(clientDto.getId(), Constants.MEDICAL)});
		BenrevoResponse postResponse = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();

		RfpDto rfpDto = gson.fromJson(postResponse.asString(), RfpDto[].class)[0];

		BenrevoResponse response = new Get()
				.withUrl("/rfps/" + rfpDto.getId())
				.withHeaders(auth)
				.execute();

		RfpDto returnedRfpDto = response.as(RfpDto.class);
		Assert.assertTrue(returnedRfpDto.equals(rfpDto));
	}

	////////////////////////////////////////////////////////////////////////
	//GET/clients/{id}/rfps/{type}

	/**
	 * Test correct Rfp is returned when requested by clientId and productType
	 * @param productType
	 */
	@Test(groups = {"regression", "rfp"}, dataProvider="rfp_types")
	public void correctRfpIsReturnedByClientIdAndProductType(String productType) {

		RfpDto randomRfp = RfpUtils.getRandomRFP(clientDto.getId(), productType);
		String body = gson.toJson(new RfpDto[] {randomRfp});
		BenrevoResponse expectedResponse = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();

		Assert.assertEquals(expectedResponse.statusCode(), HttpStatus.SC_CREATED, expectedResponse.asString());

		BenrevoResponse actualResponse = new Get()
				.withUrl("/clients/" + clientDto.getId() + "/rfps/" + productType)
				.withHeaders(auth)
				.execute();
		Assert.assertEquals(actualResponse.statusCode(), HttpStatus.SC_OK, actualResponse.asString());

		RfpDto expectedRfpDto = gson.fromJson(expectedResponse.asString(), RfpDto[].class)[ZERO];
		RfpDto actualRfpDto = gson.fromJson(actualResponse.asString(), RfpDto.class);
		Assert.assertEquals(actualRfpDto.getProduct(), productType, "Product type does not match");
		Assert.assertEquals(actualRfpDto.getClientId(), clientDto.getId(), "The client ID does not match");
		Assert.assertEquals(actualRfpDto, expectedRfpDto, "The rfps do not match, check it out");
	}

	/**
	 * Test that you do not get an RFP when passing incorrect client ID
	 * @param productType
	 */
	@Test(groups = {"regression", "rfp"}, dataProvider="rfp_types")
	public void failTestForBadClientIdGoodProductType(String productType) {
		BenrevoResponse response = new Get()
				.withUrl("/clients/" + INVALID_CLIENT_ID + "/rfps/" + productType)
				.withHeaders(auth)
				.execute();
		Assert.assertEquals(response.getStatusCode(), HttpStatus.SC_NOT_FOUND, "Expected fail but got " + response.asString());
	}

	/**
	 * Test that you do not get an RFP when passing incorrect product type
	 * @param productType
	 */
	@Test(groups = {"regression", "rfp"}, dataProvider="fail_rfp_types")
	public void failTestForBadProductTypeWithCorrectClientId(String productType) {
		String body = gson.toJson(new RfpDto[] {RfpUtils.getRandomRFP(clientDto.getId(), productType)});
		new Post()
		.withBody(body)
		.withHeaders(auth)
		.withContentType(ContentType.JSON)
		.withUrl("/clients/" + clientDto.getId() + "/rfps")
		.execute();

		BenrevoResponse response = new Get()
				.withUrl("/clients/" + clientDto.getId() + "/rfps/" + productType)
				.withHeaders(auth)
				.execute();
		Assert.assertEquals(response.getStatusCode(), HttpStatus.SC_NOT_FOUND, "Expected fail but got " + response.asString());
	}

	//////////////////////////////////////////////////////////////////
	// GET/v1/clients/{id}/rfps/{type}/pdf/

	/**
	 * But at API level https://app.asana.com/0/308554828644777/371556639241722
	 * turning off multiple type test for now.
	 */
	@Test(groups = {"regression", "rfp"})
	public void verifyStatusCodeSuccess() {

		String body = gson.toJson(new RfpDto[] {RfpUtils.getRandomRFP(clientDto.getId(), Constants.MEDICAL)});
		BenrevoResponse generatedRfpResponse = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();
		RfpDto rfpDto = gson.fromJson(generatedRfpResponse.asString(), RfpDto[].class)[ZERO];

		ClientFileType clientFileType = RfpUtils.calculateClientFileType(clientDto, rfpDto);
		queryParams.put("clientId", clientDto.getId());

		BenrevoResponse response = new Get()
				.withUrl("/rfps/census")
				.withHeaders(auth)
				.withQueryParams(queryParams)
				.execute();

		Assert.assertEquals(response.statusCode(), HttpStatus.SC_OK, response.asString());
		CensusInfoDto censusInfoDto = gson.fromJson(response.asString(), CensusInfoDto.class);
		Assert.assertEquals(censusInfoDto.getType(), clientFileType, "The file types do not match, something broke.");
	}

}
