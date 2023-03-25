package com.benrevo.test.api.rfp;

import com.benrevo.common.dto.RfpDto;
import com.benrevo.test.utils.BenrevoResponse;
import com.benrevo.test.utils.RequestUtil.Post;
import com.benrevo.test.utils.RequestUtil.Put;
import com.benrevo.test.utils.rfp.RfpUtils;
import io.restassured.http.ContentType;
import org.apache.http.HttpStatus;
import org.testng.Assert;
import org.testng.annotations.Test;


public class RfpControllerUpdateTests extends RfpControllerTest {

	/**
	 * Test that creates an RFP, posts it to the DB, modifies all the fields in the RFP
	 * with the exception of all ID's and then perfoms a PUT/update call and then compares the modified
	 * RFP to the one returned by the update call.
	 * @param productType
	 */
	@Test(groups = {"regression", "rfp", "update"}, dataProvider="rfp_types")
	public void modifyFieldsAndVerifyResult(String productType) {
		RfpDto randomRfp = RfpUtils.getRandomRFP(clientDto.getId(), productType);
		String body = gson.toJson(new RfpDto[] {randomRfp});
		BenrevoResponse response = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();
		RfpDto responseRfp = gson.fromJson(response.asString(), RfpDto[].class)[0];

		RfpDto modifiedRfp = RfpUtils.modifyRfpFields(responseRfp);
		String randomlyModifiedRfp = gson.toJson(new RfpDto[] {modifiedRfp});

		BenrevoResponse modifiedRfpResponse = new Put()
				.withBody(randomlyModifiedRfp)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();

		Assert.assertEquals(modifiedRfpResponse.statusCode(), HttpStatus.SC_OK, modifiedRfpResponse.asString());
		RfpDto modifiedRfpDto = gson.fromJson(modifiedRfpResponse.asString(), RfpDto[].class)[0];
		Assert.assertEquals(modifiedRfpDto, modifiedRfp, "The randomly modified RFP does not match what was returned");
	}

	/**
	 * Test that creates an RFP, posts it to the DB, modifies all the fields in the RFP
	 * with the exception of all ID's and then perfoms a PUT/update call and then compares the modified
	 * RFP to the one returned by the update call.
	 * 
	 * 
	 * This is failing for now, Need to look into checking for Null OptionList
	 * @param productType
	 */
	@Test(groups = {"regression", "rfp", "update"}, dataProvider="rfp_types")
	public void createThenRemoveAllFieldsExceptProductType(String productType) {
		RfpDto randomRfp = RfpUtils.getRandomRFP(clientDto.getId(), productType);
		String body = gson.toJson(new RfpDto[] {randomRfp});
		BenrevoResponse response = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();
		RfpDto responseRfp = gson.fromJson(response.asString(), RfpDto[].class)[0];

		RfpDto newRfpDto = new RfpDto();
		newRfpDto.setId(responseRfp.getId());
		newRfpDto.setClientId(clientDto.getId());
		newRfpDto.setProduct(responseRfp.getProduct());

		String newBody = gson.toJson(new RfpDto[] {newRfpDto});
		BenrevoResponse clearedRfpResponse = new Put()
				.withBody(newBody)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();

		Assert.assertEquals(clearedRfpResponse.statusCode(), HttpStatus.SC_OK, clearedRfpResponse.asString());
		RfpDto clearedDto = gson.fromJson(clearedRfpResponse.asString(), RfpDto[].class)[0];
		Assert.assertEquals(clearedDto, newRfpDto);
	}

	/**
	 * Test that creates an RFP, posts it to the DB, sets the OptionLisat to null the do
	 *  a PUT/update call and then compares the modified
	 * RFP to the one returned by the update call.
	 * 
	 * 
	 * This is failing for now, Need to look into checking for Null OptionList
	 * @param productType
	 */
	@Test(groups = {"regression", "rfp", "update"}, dataProvider="rfp_types")
	public void createRfpWithOptionsThenRemoveOptionsAndUpdate(String productType) {
		RfpDto randomRfp = RfpUtils.getRandomRFP(clientDto.getId(), productType);
		String body = gson.toJson(new RfpDto[] {randomRfp});
		BenrevoResponse response = new Post()
				.withBody(body)
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();
		RfpDto responseRfp = gson.fromJson(response.asString(), RfpDto[].class)[0];

		// Sett OptionList to null
		responseRfp.setOptionCount(0);
		responseRfp.setOptions(null);

		String newBody = gson.toJson(new RfpDto[] {responseRfp});
		BenrevoResponse clearedRfpResponse = new Put()
				.withHeaders(auth)
				.withContentType(ContentType.JSON)
				.withBody(newBody)
				.withUrl("/clients/" + clientDto.getId() + "/rfps")
				.execute();

		Assert.assertEquals(clearedRfpResponse.statusCode(), HttpStatus.SC_OK, clearedRfpResponse.asString());
		RfpDto clearedDto = gson.fromJson(clearedRfpResponse.asString(), RfpDto[].class)[0];
		Assert.assertEquals(clearedDto, responseRfp);

	}

}