package com.benrevo.core.itest.timeline;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_LONG_PARAMETER_CLIENT_ID_IS_NOT_PRESENT;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.TIMELINES_CLIENT_ID_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.TIMELINES_INVALID_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.hamcrest.CoreMatchers.is;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.core.AbstractBaseIt;
import org.testng.annotations.Test;


/**
 * The Get timelines api test. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/timeline-controller/getTimelinesUsingGET
 */
public class GetTimelinesTest extends AbstractBaseIt {

    // FIXME: 10/5/2017 timeline id ,temporary this test is disabled.
    @Test(description = "GET /v1/timelines Retrieving the Timelines by carrierId and clientId.",
        enabled = false)
    public void testRetrievingTheTimelinesByCarrierIdAndClientId() {
        given().spec(baseSpec())
            .contentType(JSON)
            .get(TIMELINES_CLIENT_ID_PATH, getClientIdL())
            .then()
            .statusCode(OK.value());

    }

    @Test(description = "GET /v1/timelines Retrieving the Timelines by carrierId and clientId. Required Fields.")
    public void testRetrievingTheTimelinesByCarrierIdAndClientIdRequiredFields() {
        given().spec(baseSpec())
            .contentType(JSON)
            .get(TIMELINES_INVALID_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_REQUIRED_LONG_PARAMETER_CLIENT_ID_IS_NOT_PRESENT));

    }

    @Test(description = "GET /v1/timelines Retrieving the Timelines by carrierId and clientId. Unauthorized.")
    public void testRetrievingTheTimelinesByCarrierIdAndClientIdUnauthorized() {
        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(TIMELINES_CLIENT_ID_PATH, getClientIdL())
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));

    }
}
