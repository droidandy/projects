package com.benrevo.core.itest.rfp.quote.client;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_SUMMARY_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.testng.Assert.assertEquals;

import com.benrevo.common.dto.RfpQuoteSummaryDto;
import com.benrevo.common.dto.RfpQuoteSummaryShortDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The  Create quotes summary  api test. Swagger https://devapi.benrevo.com/swagger-ui.html#!/rfp-quote-controller/createRfpQuoteSummaryUsingPOST
 */
public class CreateQuotesSummaryTest extends AbstractBaseIt {

    @Test(description = "POST /v1/clients/{id}/quotes/summary Creating an rfp quote summary")
    void testCreatingRfpQuoteSummary() {
        RfpQuoteSummaryShortDto rfpQuoteSummaryShort = er.nextObject(RfpQuoteSummaryShortDto.class);
        RfpQuoteSummaryShortDto rfpQuoteSummary = given().spec(baseSpec())
            .contentType(JSON)
            .body(rfpQuoteSummaryShort)
            .post(QUOTES_SUMMARY_PATH, 3L)
            .then()
            .statusCode(CREATED.value())
            .extract()
            .body()
            .as(RfpQuoteSummaryDto.class);

        assertEquals(rfpQuoteSummary.getDentalNotes(), rfpQuoteSummaryShort.getDentalNotes());
        assertEquals(rfpQuoteSummary.getMedicalNotes(), rfpQuoteSummaryShort.getMedicalNotes());
        assertEquals(
            rfpQuoteSummary.getMedicalWithKaiserNotes(),
            rfpQuoteSummaryShort.getMedicalWithKaiserNotes()
        );
        assertEquals(rfpQuoteSummary.getVisionNotes(), rfpQuoteSummaryShort.getVisionNotes());
    }

    @Test(description = "POST /v1/clients/{id}/quotes/summary Creating an rfp quote summary invalid client id")
    void testCreatingRfpQuoteSummaryInvalidClientId() {
        RfpQuoteSummaryShortDto rfpQuoteSummaryShort = er.nextObject(RfpQuoteSummaryShortDto.class);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(rfpQuoteSummaryShort)
            .post(QUOTES_SUMMARY_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "POST /v1/clients/{id}/quotes/summary Creating an rfp quote summary body empty")
    void testCreatingRfpQuoteSummaryIdEmpty() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .post(QUOTES_SUMMARY_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "POST /v1/clients/{id}/quotes/summary Creating an rfp quote summary forbidden client id")
    void testCreatingRfpQuoteSummaryForbiddenClientId() {
        RfpQuoteSummaryShortDto rfpQuoteSummaryShort = er.nextObject(RfpQuoteSummaryShortDto.class);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(rfpQuoteSummaryShort)
            .post(QUOTES_SUMMARY_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "POST /v1/clients/{id}/quotes/summary Creating an rfp quote summary invalid format client id")
    void testCreatingRfpQuoteSummaryInvalidFormatClientId() {
        RfpQuoteSummaryShortDto rfpQuoteSummaryShort = er.nextObject(RfpQuoteSummaryShortDto.class);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(rfpQuoteSummaryShort)
            .post(QUOTES_SUMMARY_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "POST /v1/clients/{id}/quotes/summary Creating an rfp quote summary. Unauthorized.")
    void testCreatingRfpQuoteSummaryUnauthorized() {
        RfpQuoteSummaryShortDto rfpQuoteSummaryShort = er.nextObject(RfpQuoteSummaryShortDto.class);
        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(rfpQuoteSummaryShort)
            .post(QUOTES_SUMMARY_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

}
