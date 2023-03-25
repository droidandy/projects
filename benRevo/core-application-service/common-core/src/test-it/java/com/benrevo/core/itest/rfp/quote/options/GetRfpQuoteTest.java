package com.benrevo.core.itest.rfp.quote.options;


import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_ENUM_CONSTANT_PLAN_CATEGORY;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CATEGORY_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.RRP_QUOTE_OPTIONS_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The Get rfp quote api test. Swagger - https://devapi.benrevo.com/swagger-ui.html#!/rfp-quote-controller/getRfpQuoteOptionsUsingGET
 */
public class GetRfpQuoteTest extends AbstractBaseIt {

    @Test(description = "GET /v1/quotes/options Retrieving the rfp quote options by client_id and category DENTAL")
    void testRetrievingTheRfpQuoteOptionsByClientIdAndCategoryDental() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RRP_QUOTE_OPTIONS_PATH, getClientIdL(), DENTAL)
            .then()
            .statusCode(OK.value())
            .body(CATEGORY_BODY_PATH, is(DENTAL));
    }

    @Test(description = "GET /v1/quotes/options Retrieving the rfp quote options by invalid client_id and category DENTAL")
    void testRetrievingTheRfpQuoteOptionsByInvalidClientIdAndCategoryDental() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RRP_QUOTE_OPTIONS_PATH, DataConstants.NOT_FOUND_ID, DENTAL)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/quotes/options Retrieving the rfp quote options by forbidden client_id and category DENTAL")
    void testRetrievingTheRfpQuoteOptionsByForbiddenClientIdAndCategoryDental() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RRP_QUOTE_OPTIONS_PATH, DataConstants.FORBIDDEN_CLIENT_ID, DENTAL)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "GET /v1/quotes/options Retrieving the rfp quote options by client_id and category MEDICAL")
    void testRetrievingTheRfpQuoteOptionsByClientIdAndCategoryMedical() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RRP_QUOTE_OPTIONS_PATH, getClientIdL(), MEDICAL)
            .then()
            .statusCode(OK.value())
            .body(CATEGORY_BODY_PATH, is(MEDICAL));
    }

    @Test(description = "GET /v1/quotes/options Retrieving the rfp quote options by client_id and category VISION")
    void testRetrievingTheRfpQuoteOptionsByClientIdAndCategoryVision() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RRP_QUOTE_OPTIONS_PATH, getClientIdL(), VISION)
            .then()
            .statusCode(OK.value())
            .body(CATEGORY_BODY_PATH, is(VISION));
    }

    @Test(description = "GET /v1/quotes/options Retrieving the rfp quote options by client_id and category EMPTY")
    void testRetrievingTheRfpQuoteOptionsByClientIdAndCategoryEmpty() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RRP_QUOTE_OPTIONS_PATH, getClientIdL(), EMPTY)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_ENUM_CONSTANT_PLAN_CATEGORY))

        ;
    }

    @Test(description = "GET /v1/quotes/options Retrieving the rfp quote options by client_id and category invalid format")
    void testRetrievingTheRfpQuoteOptionsByClientIdAndCategoryInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RRP_QUOTE_OPTIONS_PATH, DataConstants.INVALID_FORMAT, VISION)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE))

        ;
    }

    @Test(description = "GET /v1/quotes/options Retrieving the rfp quote options by client_id and category. Unauthorized.")
    void testRetrievingTheRfpQuoteOptionsByClientIdAndCategoryUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(RRP_QUOTE_OPTIONS_PATH, DataConstants.INVALID_FORMAT, VISION)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_UNAUTHORIZED))

        ;
    }

}
