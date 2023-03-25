package com.benrevo.core.itest.plan;

import static com.benrevo.common.Constants.LTD;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CONTENT_TYPE_NULL_NOT_SUPPORTED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_RFP_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_RFPS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.PLANS_RFP_ID_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static io.restassured.mapper.ObjectMapperType.GSON;
import static java.util.Collections.singletonList;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.HttpStatus.UNSUPPORTED_MEDIA_TYPE;

import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import io.restassured.http.ContentType;
import java.util.Collections;
import org.testng.annotations.Test;


/**
 * The Get plan test.
 */
public class GetPlanTest extends AbstractBaseIt {

    @Test(description = "GET /v1/plans/rfp/{rfpId} Retrieve plans by rfp")
    public void testRetrievePlansByRfp() {
        RfpDto ltd = random(RfpDto.class, "id", "options", "carrierHistories", "fileInfoList");
        OptionDto optionDto = random(OptionDto.class, "plans", "id", "rfpId");
        ltd.setOptions(Collections.singletonList(optionDto));
        ltd.setProduct(LTD);
        ltd.setClientId(3L);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(ltd), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, 3)
            .then()
            .statusCode(CREATED.value())

        ;
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(PLANS_RFP_ID_PATH, 1)
            .then()
            .statusCode(OK.value());

    }

    @Test(description = "GET /v1/plans/rfp/{rfpId} Retrieve plans by rfp. Not Found.")
    public void testRetrievePlansByRfpNotFound() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(PLANS_RFP_ID_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_RFP_NOT_FOUND));

    }

    @Test(description = "GET /v1/plans/rfp/{rfpId} Retrieve plans by rfp. Invalid Format.")
    public void testRetrievePlansByRfpInvalidFormat() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(PLANS_RFP_ID_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));

    }

    @Test(description = "GET /v1/plans/rfp/{rfpId} Retrieve plans by rfp. Unauthorized.")
    public void testRetrievePlansByRfpUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .get(PLANS_RFP_ID_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));

    }

    @Test(description = "GET /v1/plans/rfp/{rfpId} Retrieve plans by rfp. Content error type.")
    public void testRetrievePlansByRfpContentErrorType() {

        given().spec(baseSpec())
            .get(PLANS_RFP_ID_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNSUPPORTED_MEDIA_TYPE.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CONTENT_TYPE_NULL_NOT_SUPPORTED));

    }
}
