package com.benrevo.core.itest.timeline;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_TIMELINE_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.TIMELINES_ID_UPDATE_COMPLETED_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.TIMELINES_ID_UPDATE_PROJECTED_TIME_PATH;
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
 * The Update timeline api test. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/timeline-controller/updateCompletedUsingPUT
 * https://devapi.benrevo.com/swagger-ui.html#!/timeline-controller/updateProjectedTimeUsingPUT
 */
public class UpdateTimelineTest extends AbstractBaseIt {

    private Integer timelineId = 0;


    @Test(description = "PUT /v1/timelines/{id}/updateCompleted Updating a timeline completed status by timeline_Id.",
        enabled = false)
    public void testUpdatingTimelineCompletedStatusByTimelineId() {
        TimelineDto timelineDto = new TimelineDto();
        timelineDto.setClientId(getClientIdL());
        timelineDto.setCarrierId(1L);
        timelineDto.setRefNum(1L);
        timelineDto.setMilestone("Confirm Final Notification of Sale");

        given().spec(baseSpec())
            .contentType(JSON)
            .body(timelineDto)
            .put(TIMELINES_ID_UPDATE_COMPLETED_PATH, timelineId)
            .then()
            .statusCode(CREATED.value());
    }

    @Test(description = "PUT /v1/timelines/{id}/updateCompleted Updating a timeline completed status by timeline_Id. Empty Body.")
    public void testUpdatingTimelineCompletedStatusByTimelineIdEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(TIMELINES_ID_UPDATE_COMPLETED_PATH, timelineId)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "PUT /v1/timelines/{id}/updateCompleted Updating a timeline completed status by timeline_Id. Invalid Format.")
    public void testUpdatingTimelineCompletedStatusByTimelineIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(TIMELINES_ID_UPDATE_COMPLETED_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "PUT /v1/timelines/{id}/updateCompleted Updating a timeline completed status by timeline_Id. Not Found.")
    public void testUpdatingTimelineCompletedStatusByTimelineIdNotFound() {
        TimelineDto timelineDto = new TimelineDto();

        given().spec(baseSpec())
            .contentType(JSON)
            .body(timelineDto)
            .put(TIMELINES_ID_UPDATE_COMPLETED_PATH, timelineId)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_TIMELINE_NOT_FOUND));
    }

    @Test(description = "PUT /v1/timelines/{id}/updateCompleted Updating a timeline completed status by timeline_Id. Unauthorized.")
    public void testUpdatingTimelineCompletedStatusByTimelineIdUnauthorized() {
        TimelineDto timelineDto = new TimelineDto();

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(timelineDto)
            .put(TIMELINES_ID_UPDATE_COMPLETED_PATH, timelineId)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    // FIXME: 10/5/2017 timeline id ,temporary this test is disabled.
    @Test(description = "PUT /v1/timelines/{id}/updateProjectedTime Updating a timeline projected time by timeline_Id.",
        enabled = false)
    public void testUpdatingTimelineProjectedTimeByTimelineId() {
        TimelineDto timelineDto = new TimelineDto();
        timelineDto.setClientId(getClientIdL());
        timelineDto.setCarrierId(1L);
        timelineDto.setRefNum(1L);
        timelineDto.setMilestone("Confirm Final Notification of Sale");

        given().spec(baseSpec())
            .contentType(JSON)
            .body(timelineDto)
            .put(TIMELINES_ID_UPDATE_PROJECTED_TIME_PATH, timelineId)
            .then()
            .statusCode(CREATED.value());
    }

    @Test(description = "PUT /v1/timelines/{id}/updateProjectedTime Updating a timeline projected time by timeline_Id. Empty Body.")
    public void testUpdatingTimelineProjectedTimeByTimelineIdEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(TIMELINES_ID_UPDATE_PROJECTED_TIME_PATH, timelineId)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "PUT /v1/timelines/{id}/updateProjectedTime Updating a timeline projected time by timeline_Id. Invalid Format.")
    public void testUpdatingTimelineProjectedTimeByTimelineIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(TIMELINES_ID_UPDATE_PROJECTED_TIME_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "PUT /v1/timelines/{id}/updateProjectedTime Updating a timeline projected time by timeline_Id. Not Found.")
    public void testUpdatingTimelineProjectedTimeByTimelineIdNotFound() {
        TimelineDto timelineDto = new TimelineDto();

        given().spec(baseSpec())
            .contentType(JSON)
            .body(timelineDto)
            .put(TIMELINES_ID_UPDATE_PROJECTED_TIME_PATH, timelineId)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_TIMELINE_NOT_FOUND));
    }

    @Test(description = "PUT /v1/timelines/{id}/updateProjectedTime Updating a timeline projected time by timeline_Id. Unauthorized.")
    public void testUpdatingTimelineProjectedTimeByTimelineIdUnauthorized() {
        TimelineDto timelineDto = new TimelineDto();

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(timelineDto)
            .put(TIMELINES_ID_UPDATE_PROJECTED_TIME_PATH, timelineId)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }


}
