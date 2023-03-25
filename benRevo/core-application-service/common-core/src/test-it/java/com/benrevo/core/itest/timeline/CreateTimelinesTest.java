package com.benrevo.core.itest.timeline;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_THE_GIVEN_ID_MUST_NOT_BE_NULL;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.TIMELINES_INIT_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.TimelineDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The  Create timelines api  test. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/timeline-controller/initTimelinesUsingPOST
 */
public class CreateTimelinesTest extends AbstractBaseIt {

    // FIXME: 10/5/2017 timeline id ,temporary this test is disabled.
    @Test(description = "POST /v1/timelines/init Create the default Timelines by carrierId and clientId.",
        enabled = false)
    public void testCreateTheDefaultTimelinesByCarrierIdAndClientId() {
        TimelineDto timelineDto = new TimelineDto();
        timelineDto.setClientId(getClientIdL());
        timelineDto.setCarrierId(42L);
        timelineDto.setRefNum(1L);
        timelineDto.setMilestone("Confirm Final Notification of Sale");

        given().spec(baseSpec())
            .contentType(JSON)
            .body(timelineDto)
            .post(TIMELINES_INIT_PATH)
            .then()
            .statusCode(CREATED.value());
    }

    @Test(description = "POST /v1/timelines/init Create the default Timelines by carrierId and clientId. Empty Body.")
    public void testCreateTheDefaultTimelinesByCarrierIdAndClientIdEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .post(TIMELINES_INIT_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "POST /v1/timelines/init Create the default Timelines by carrierId and clientId. Not Found.")
    public void testCreateTheDefaultTimelinesByCarrierIdAndClientIdNotFound() {
        TimelineDto timelineDto = new TimelineDto();
        timelineDto.setClientId(DataConstants.NOT_FOUND_ID);
        timelineDto.setCarrierId(DataConstants.NOT_FOUND_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(timelineDto)
            .post(TIMELINES_INIT_PATH)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "POST /v1/timelines/init Create the default Timelines by carrierId and clientId. Id is Null.")
    public void testCreateTheDefaultTimelinesByCarrierIdAndClientIdNull() {
        TimelineDto timelineDto = new TimelineDto();


        given().spec(baseSpec())
            .contentType(JSON)
            .body(timelineDto)
            .post(TIMELINES_INIT_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_THE_GIVEN_ID_MUST_NOT_BE_NULL));
    }

    @Test(description = "POST /v1/timelines/init Create the default Timelines by carrierId and clientId. Unauthorized.")
    public void testCreateTheDefaultTimelinesByCarrierIdAndClientIdUnauthorized() {
        TimelineDto timelineDto = random(TimelineDto.class);

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(timelineDto)
            .post(TIMELINES_INIT_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }
}
