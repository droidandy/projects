package com.benrevo.core.itest.option;

import static com.benrevo.common.Constants.STD;
import static com.benrevo.common.enums.AncillaryPlanType.BASIC;
import static com.benrevo.common.enums.AncillaryPlanType.VOLUNTARY;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_RFP_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ID_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.RFP_ID_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_RFPS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.RFPS_ID_OPTIONS_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static io.restassured.mapper.ObjectMapperType.GSON;
import static java.util.Collections.singletonList;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import java.util.Collections;
import org.testng.annotations.Test;


/**
 * The  Get option api test.
 */
public class GetOptionTest extends AbstractBaseIt {

    @Test(description = "GET /v1/rfps/{id}/options Retrieving the options for rfp by rfp_id.")
    public void testRetrievingTheOptionsForRfpByRfpId() {
        RfpDto std = random(RfpDto.class, "id", "options", "carrierHistories", "fileInfoList");
        OptionDto optionDto = random(OptionDto.class, "plans", "id", "rfpId");
        std.setOptions(Collections.singletonList(optionDto));
        std.setProduct(STD);
        std.setClientId(6L);
        Long clientRpf = Long.valueOf(given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(std), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, 6L)
            .then()
            .extract()
            .path(ID_FIRST_BODY_PATH)
            .toString());


        given().spec(baseSpec())
            .contentType(JSON)
            .get(RFPS_ID_OPTIONS_PATH, clientRpf)
            .then()
            .statusCode(OK.value())
            .body(RFP_ID_BODY_PATH, hasItem(clientRpf.intValue()));
    }

    @Test(description = "GET /v1/rfps/{id}/options Retrieving the options for rfp by rfp_id. Not Found.")
    public void testRetrievingTheOptionsForRfpByRfpIdNotFound() {
        given().spec(baseSpec())
            .contentType(JSON)
            .get(RFPS_ID_OPTIONS_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_RFP_NOT_FOUND));
    }

    @Test(description = "GET /v1/rfps/{id}/options Retrieving the options for rfp by rfp_id. Invalid Format.")
    public void testRetrievingTheOptionsForRfpByRfpIdInvalidFormat() {
        given().spec(baseSpec())
            .contentType(JSON)
            .get(RFPS_ID_OPTIONS_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/rfps/{id}/options Retrieving the options for rfp by rfp_id. Unauthorized.")
    public void testRetrievingTheOptionsForRfpByRfpIdInvalidUnauthorized() {
        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(RFPS_ID_OPTIONS_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

}
