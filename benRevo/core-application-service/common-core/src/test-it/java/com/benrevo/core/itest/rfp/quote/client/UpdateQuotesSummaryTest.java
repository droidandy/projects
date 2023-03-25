package com.benrevo.core.itest.rfp.quote.client;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_SUMMARY_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.testng.Assert.assertEquals;

import com.benrevo.common.dto.RfpQuoteSummaryDto;
import com.benrevo.common.dto.RfpQuoteSummaryShortDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The  Update quotes summary  api test. Swagger -https://devapi.benrevo.com/swagger-ui.html#!/rfp-quote-controller/updateRfpQuoteSummaryUsingPUT
 */
public class UpdateQuotesSummaryTest extends AbstractBaseIt {

    @Test(description = "PUT /v1/clients/{id}/quotes/summary Updating an rfp quote summary")
    public void testUpdatingRfpQuoteSummary() {
        RfpQuoteSummaryShortDto rfpQuoteSummaryShort = er.nextObject(RfpQuoteSummaryShortDto.class);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(rfpQuoteSummaryShort)
            .post(QUOTES_SUMMARY_PATH, getClientIdL())
            .then();
        RfpQuoteSummaryDto expectedRfpQuoteSummary = random(RfpQuoteSummaryDto.class);
        RfpQuoteSummaryDto actualQuoteSummary = given().spec(baseSpec())
            .contentType(JSON)
            .body(expectedRfpQuoteSummary)
            .put(QUOTES_SUMMARY_PATH, getClientIdL())
            .then()
            .statusCode(OK.value())
            .extract()
            .body()
            .as(RfpQuoteSummaryDto.class);

        assertEquals(actualQuoteSummary.getDentalNotes(), expectedRfpQuoteSummary.getDentalNotes());
        assertEquals(
            actualQuoteSummary.getMedicalNotes(), expectedRfpQuoteSummary.getMedicalNotes());
        assertEquals(actualQuoteSummary.getMedicalWithKaiserNotes(),
            expectedRfpQuoteSummary.getMedicalWithKaiserNotes()
        );
        assertEquals(actualQuoteSummary.getVisionNotes(), expectedRfpQuoteSummary.getVisionNotes());
    }

    @Test(description = "PUT /v1/clients/{id}/quotes/summary Updating an rfp quote summary empty body")
    public void testUpdatingRfpQuoteSummaryEmpty() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(QUOTES_SUMMARY_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));

    }

    @Test(description = "PUT /v1/clients/{id}/quotes/summary Updating an rfp quote summary not found client id")
    public void testUpdatingRfpQuoteSummaryInvalidClientId() {
        RfpQuoteSummaryShortDto rfpQuoteSummaryShort = er.nextObject(RfpQuoteSummaryShortDto.class);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(rfpQuoteSummaryShort)
            .put(QUOTES_SUMMARY_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));

    }

    @Test(description = "PUT /v1/clients/{id}/quotes/summary Updating an rfp quote summary invalid client id")
    public void testUpdatingRfpQuoteSummaryInvalidFormatClientId() {
        RfpQuoteSummaryShortDto rfpQuoteSummaryShort = er.nextObject(RfpQuoteSummaryShortDto.class);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(rfpQuoteSummaryShort)
            .put(QUOTES_SUMMARY_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));

    }

    @Test(description = "PUT /v1/clients/{id}/quotes/summary Updating an rfp quote summary. Unauthorized.")
    public void testUpdatingRfpQuoteSummaryUnauthorized() {
        RfpQuoteSummaryShortDto rfpQuoteSummaryShort = er.nextObject(RfpQuoteSummaryShortDto.class);
        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(rfpQuoteSummaryShort)
            .put(QUOTES_SUMMARY_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));

    }

}
