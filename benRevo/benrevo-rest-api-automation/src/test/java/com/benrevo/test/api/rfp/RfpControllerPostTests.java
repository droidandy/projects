package com.benrevo.test.api.rfp;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.CarrierHistoryDto;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.test.utils.BenrevoResponse;
import com.benrevo.test.utils.RequestUtil.Get;
import com.benrevo.test.utils.RequestUtil.Post;
import com.benrevo.test.utils.RequestUtil.Put;
import com.benrevo.test.utils.rfp.CarrierHistoryUtils;
import com.benrevo.test.utils.rfp.OptionUtils;
import com.benrevo.test.utils.rfp.RfpUtils;
import io.restassured.http.ContentType;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpStatus;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.util.ArrayList;


public class RfpControllerPostTests extends RfpControllerTest {

	/**
	 * Test that 400 is returned when posting RFP with invalid productType
	 * This should be throwing an exception that means something
	 * POST
	 */
	@Test(groups = {"regression", "rfp"})
	public void postRfpWithInvalidProductType() {
		RfpDto rfpDto = RfpUtils.getRandomRFP(clientDto.getId(), INVALID_PRODUCT_TYPE);
		String body = gson.toJson(new RfpDto[] {rfpDto});
		BenrevoResponse response = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();
		Assert.assertEquals(response.statusCode(), HttpStatus.SC_BAD_REQUEST, response.asString());
	}

	/**
	 * Test that error is returned when posting RFP without required field
	 * This should be throwing an exception that means something
	 * POST
	 */
	@Test(groups = {"regression", "rfp"})
	public void postRfpWithoutProductType() {
		RfpDto rfpDto = RfpUtils.getRandomRFP(clientDto.getId(), Constants.MEDICAL);
		rfpDto.setProduct(null);
		String body = gson.toJson(new RfpDto[] {rfpDto});
		BenrevoResponse response = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();
		Assert.assertEquals(response.statusCode(), HttpStatus.SC_BAD_REQUEST, response.asString());
	}

	/**
	 * Test that RFP posts successfully with only productType and clientId set
	 * POST
	 */
	@Test(groups = {"regression", "rfp"})
	public void postRfpWithOnlyRequireFields() {
		RfpDto rfpDto = new RfpDto();
		rfpDto.setProduct(Constants.MEDICAL);
		String body = gson.toJson(new RfpDto[] {rfpDto});
		BenrevoResponse response = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();
		Assert.assertEquals(response.statusCode(), HttpStatus.SC_CREATED, response.asString());
	}

	/**
	 * Test that 404 is returned when posting to invalid client
	 * POST
	 */
	@Test(groups = {"regression", "rfp"})
	public void postRfpToClientFromAnotherBrokerage() {
		RfpDto[] rfps = {RfpUtils.getRandomRFP(INVALID_CLIENT_ID, Constants.MEDICAL)};
		String body = gson.toJson(rfps);
		BenrevoResponse response = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + INVALID_CLIENT_ID + "/rfps")
				.execute();
		Assert.assertEquals(response.statusCode(), HttpStatus.SC_NOT_FOUND, response.asString());
	}

	/**
	 * Test that an error is returned when trying to POST an RFP to a client in a different brokerage.
	 * POST
	 */
	@Test(groups= {"regression", "rfp"})
	public void postRfpToInvalidClient() {
		RfpDto[] rfps = {RfpUtils.getRandomRFP(CLIENT_FROM_OTHER_BROKERAGE, Constants.MEDICAL),
				RfpUtils.getRandomRFP(CLIENT_FROM_OTHER_BROKERAGE, Constants.DENTAL), 
				RfpUtils.getRandomRFP(CLIENT_FROM_OTHER_BROKERAGE, Constants.VISION)};
		String body = gson.toJson(rfps);
		BenrevoResponse response = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + CLIENT_FROM_OTHER_BROKERAGE + "/rfps")
				.execute();
		Assert.assertEquals(response.statusCode(), HttpStatus.SC_FORBIDDEN, response.asString());
	}

	/**
	 * Test that the number of options entered is the same as returned for larger than normal number
	 * POST
	 */
	@Test(groups = {"regression", "rfp"}, dataProvider = "rfp_types")
	public void boundryTestForOptions(String productType) {
		RfpDto rfpDto = RfpUtils.getRandomRFP(clientDto.getId(), productType);
		rfpDto.setOptionCount(FIFTEEN);
		ArrayList<OptionDto> options = new ArrayList<OptionDto>();
		for(int i = ZERO; i<rfpDto.getOptionCount(); i++) {
			options.add(OptionUtils.getRandomOptionDto(rfpDto));
		}
		rfpDto.setOptions(options);

		String body = gson.toJson(new RfpDto[] {rfpDto});
		BenrevoResponse response = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();
		Assert.assertEquals(response.statusCode(), HttpStatus.SC_CREATED, response.asString());
		RfpDto rfp = gson.fromJson(response.asString(), RfpDto[].class)[ZERO];			
		Assert.assertEquals(rfpDto.getOptionCount(), rfp.getOptionCount());
		Assert.assertEquals(rfpDto.getOptionCount(), new Integer(rfp.getOptions().size()));
	}

	/**
	 * Test carrier history can have large number of carrier histories without throwing error
	 * POST
	 */
	@Test(groups = {"regression", "rfp"}, dataProvider = "rfp_types")
	public void boundryTestForCarrierHistory(String productType) {
		RfpDto rfpDto = RfpUtils.getRandomRFP(clientDto.getId(), productType);
		ArrayList<CarrierHistoryDto> carrierHistories = new ArrayList<CarrierHistoryDto>();
		for(int i = ZERO; i<rfpDto.getOptionCount(); i++) {
			carrierHistories.add(CarrierHistoryUtils.getRandomCarrierHistory(rfpDto));
		}
		rfpDto.setCarrierHistories(carrierHistories);

		String body = gson.toJson(new RfpDto[] {rfpDto});
		BenrevoResponse response = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();
		Assert.assertEquals(response.statusCode(), HttpStatus.SC_CREATED, response.asString());
		RfpDto rfp = gson.fromJson(response.asString(), RfpDto[].class)[ZERO];			
		Assert.assertEquals(rfpDto.getCarrierHistories().size(), rfp.getCarrierHistories().size());
	}

	/**
	 * Test error is thrown when RFP of same type is POSTed and one already exists in the DB
	 * POST
	 * @param s
	 */
	@Test(groups = {"regression", "rfp"}, dataProvider="rfp_types")
	public void boundryTestForRfpPostRfpOfSameTypeThatExistsInDb(String s) {
		RfpDto rfpDto = RfpUtils.getRandomRFP(clientDto.getId(), s);
		RfpDto rfpDto2 = RfpUtils.getRandomRFP(clientDto.getId(), s);

		// Post first Rfp and assert success
		String body = gson.toJson(new RfpDto[] {rfpDto});
		BenrevoResponse response = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();

		RfpDto[] postedRfps = gson.fromJson(response.asString(), RfpDto[].class);
		Assert.assertEquals(response.statusCode(), HttpStatus.SC_CREATED);
		// Post second Rfp of same type and assert error
		String body2 = gson.toJson(new RfpDto[] {rfpDto2});
		BenrevoResponse responseFail = new Post()
				.withBody(body2)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();
		Assert.assertEquals(responseFail.statusCode(), HttpStatus.SC_BAD_REQUEST, responseFail.asString());

		// Test that second RFP of same type was not posted to the DB and that
		//   the RFP in the DB is the same as the first one that was posted
		BenrevoResponse getResponse = new Get()
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.withHeaders(auth)
				.execute();

		RfpDto[] rfps = gson.fromJson(getResponse.asString(), RfpDto[].class);

		Assert.assertEquals(rfps.length, postedRfps.length, getResponse.asString());

		for (int i = ZERO; i<rfps.length; i++) {
			Assert.assertEquals(rfps[i].getId(), postedRfps[i].getId(), "The RFP Id's should have matched.");
		}
	}

	/**
	 * Test error is thrown when more than one RFP of same type is POSTed
	 * Should we block entire POST call if two RFPs are of same type? Not a UI issue but an API issue
	 * POST
	 * @param s
	 */
	@Test(groups = {"regression", "rfp"}, dataProvider="rfp_types")
	public void boundryTestForRfpPostWithTwoOfSameType(String s) {
		RfpDto rfpDto = RfpUtils.getRandomRFP(clientDto.getId(), s);
		RfpDto rfpDto2 = RfpUtils.getRandomRFP(clientDto.getId(), s);
		// Post two Rfps of same type and assert failure.
		String body = gson.toJson(new RfpDto[] {rfpDto, rfpDto2});
		BenrevoResponse postResponse = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();
		Assert.assertEquals(postResponse.statusCode(), HttpStatus.SC_BAD_REQUEST, postResponse.asString());

		// Test that no RFP was successfully posted to the DB
		BenrevoResponse getResponse = new Get()
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.withHeaders(auth)
				.execute();
		RfpDto[] rfps = gson.fromJson(getResponse.asString(), RfpDto[].class);
		Assert.assertEquals(rfps.length, ZERO, "There should not have been an RFP posted to the DB");
	}

	/**
	 * Test that you can successfully submit an RFP
	 * POST
	 */
	@Test(groups = {"regression", "rfp"})
	public void rfpE2eTest() {
		RfpDto rfpDto = RfpUtils.getRandomRFP(clientDto.getId(), Constants.MEDICAL);
		String body = gson.toJson(new RfpDto[] {rfpDto});
		RfpDto returnedRfpDto = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute()
				.as(RfpDto[].class)[0];
		RfpDto editedRfp = new Put()
				.withBody(gson.toJson(new RfpDto[] {RfpUtils.modifyRfpFields(returnedRfpDto)}))
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.execute().as(RfpDto[].class)[ZERO];

		// Validate that the returned product-type is correct
		Assert.assertEquals(editedRfp.getProduct(), returnedRfpDto.getProduct());

		// Test that the Options belong to the RFP
		for(int i = ZERO; i<editedRfp.getOptions().size(); i++ ) {
			Assert.assertTrue(editedRfp.getOptions().get(i).getRfpId().equals(returnedRfpDto.getId()), "The Option does not belong to this RFP");
		}
		// Test that the Carrier History belongs to the RFP
		for(int i = ZERO; i<editedRfp.getCarrierHistories().size(); i++ ) {
			Assert.assertTrue(editedRfp.getCarrierHistories().get(i).getRfpId().equals(returnedRfpDto.getId()), "The Carrier History does not belong to this RFP");
		}

		String rfpIds = StringUtils.join(new String[] { returnedRfpDto.getId().toString() }, ",");

		queryParams.put("rfpIds", rfpIds);
		BenrevoResponse response = new Post()
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withQueryParams(queryParams)
				.withUrl("/clients/" + clientDto.getId() + "/rfps/submit")
				.execute();

		Assert.assertEquals(response.statusCode(), HttpStatus.SC_OK, "Could not submit the RFP to the carrier " + response.getBody().asString());
	}

	/**
	 * Test that error is thrown if any RFP_ID in the RFP_ID list does not exist/or does not belong to client.
	 */
	@Test(groups = {"regression", "rfp"})
	public void testErrorOnSubmissionWithInvalidRfpIds() {
		String rfpIds = StringUtils.join(new String[] { "23", "33", "55" }, ",");

		queryParams.put("rfpIds", rfpIds);
		BenrevoResponse response = new Post()
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withQueryParams(queryParams)
				.withUrl("/clients/" + clientDto.getId() + "/rfps/submit")
				.execute();

		Assert.assertEquals(response.statusCode(), HttpStatus.SC_NOT_FOUND, "Was able to submit the RFP to the carrier " + response.getBody().asString());
	}
}
