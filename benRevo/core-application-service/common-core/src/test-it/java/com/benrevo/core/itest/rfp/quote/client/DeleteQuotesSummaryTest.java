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
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.RfpQuoteSummaryShortDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The type Delete quotes summary test. Swagger - https://devapi.benrevo.com/swagger-ui.html#!/rfp-quote-controller/deleteRfpQuoteSummaryUsingDELETE
 */
public class DeleteQuotesSummaryTest extends AbstractBaseIt {

    @Test(description = "DELETE /v1/clients/{id}/quotes/summary Deleting an rfp quote summary")
    public void testDeletingAnRfpQuoteSummary() {
        RfpQuoteSummaryShortDto rfpQuoteSummaryShort = er.nextObject(RfpQuoteSummaryShortDto.class);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(rfpQuoteSummaryShort)
            .post(QUOTES_SUMMARY_PATH, getClientIdL());

        given().spec(baseSpec())
            .contentType(JSON)
            .delete(QUOTES_SUMMARY_PATH, getClientIdL())
            .then()
            .body(MESSAGE_BODY_PATH, is("The rfp quote summary was successfully removed"));
    }

    @Test(description = "DELETE /v1/clients/{id}/quotes/summary Deleting an rfp quote summary not found client id")
    public void testDeletingAnRfpQuoteSummaryInvalidClientId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .delete(QUOTES_SUMMARY_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "DELETE /v1/clients/{id}/quotes/summary Deleting an rfp quote summary invalid format client id")
    public void testDeletingAnRfpQuoteSummaryInvalidFormatClientId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .delete(QUOTES_SUMMARY_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "DELETE /v1/clients/{id}/quotes/summary Deleting an rfp quote summary. Unauthorized.")
    public void testDeletingAnRfpQuoteSummaryUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .delete(QUOTES_SUMMARY_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

}
