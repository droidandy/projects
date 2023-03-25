package com.benrevo.core.itest.rfp.quote.client;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_SUMMARY_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.testng.Assert.assertEquals;

import com.benrevo.common.dto.RfpQuoteSummaryDto;
import com.benrevo.common.dto.RfpQuoteSummaryShortDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The type Get quotes summary test.
 */
public class GetQuotesSummaryTest extends AbstractBaseIt {

    @Test(description = "GET /v1/clients/{id}/quotes/summary Retrieving an rfp quote summary by quote id", enabled = false)
    public void testRetrievingAnRfpQuoteSummaryByQuoteId() {
        RfpQuoteSummaryShortDto rfpQuoteSummaryShort = er.nextObject(RfpQuoteSummaryShortDto.class);
        RfpQuoteSummaryShortDto rfpQuoteSummary = given().spec(baseSpec())
            .contentType(JSON)
            .body(rfpQuoteSummaryShort)
            .post(QUOTES_SUMMARY_PATH, getClientIdL())
            .then()
            .extract()
            .body()
            .as(RfpQuoteSummaryDto.class);

        RfpQuoteSummaryShortDto actualQuoteSummary = given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_SUMMARY_PATH, getClientIdL())
            .then()
            .statusCode(OK.value())
            .extract()
            .body()
            .as(RfpQuoteSummaryDto.class);

        assertEquals(actualQuoteSummary.getDentalNotes(), rfpQuoteSummary.getDentalNotes());
        assertEquals(actualQuoteSummary.getMedicalNotes(), rfpQuoteSummary.getMedicalNotes());
        assertEquals(
            actualQuoteSummary.getMedicalWithKaiserNotes(),
            rfpQuoteSummary.getMedicalWithKaiserNotes()
        );
        assertEquals(actualQuoteSummary.getVisionNotes(), rfpQuoteSummary.getVisionNotes());
    }

    @Test(description = "GET /v1/clients/{id}/quotes/summary Retrieving an rfp quote summary by not found client id")
    public void testRetrievingAnRfpQuoteSummaryByQuoteInvalidId() {
        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_SUMMARY_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/clients/{id}/quotes/summary Retrieving an rfp quote summary by invalid format client id")
    public void testRetrievingAnRfpQuoteSummaryByQuoteInvalidFormatId() {
        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_SUMMARY_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/clients/{id}/quotes/summary Retrieving an rfp quote summary by. Unauthorized.")
    public void testRetrievingAnRfpQuoteSummaryByQuoteUnauthorized() {
        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(QUOTES_SUMMARY_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

}
