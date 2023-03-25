package com.benrevo.core.itest.rfp.quote.options;


import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_MAY_NOT_BE_NULL;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_QUOTE_FOUND_FOR_CARRIER_CLIENT;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_RFP_CARRIER_ENTITY_IS_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ERRORS_CLIENT_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_CREATE_PATH;
import static io.restassured.RestAssured.given;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;

import com.benrevo.common.dto.CreateRfpQuoteOptionDto;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import io.restassured.http.ContentType;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;


/**
 * The Create rfp quote api test.
 */
public class CreateRfpQuoteTest extends AbstractBaseIt {

    private CreateRfpQuoteOptionDto rfpQuoteOption;
    private CreateRfpQuoteOptionDto rfpQuoteOptionStandard;
    private CreateRfpQuoteOptionDto rfpQuoteOptionTypeRenewal;
    private CreateRfpQuoteOptionDto rfpQuoteOptionTypeNegotiated;

    // TODO/FIXME: need to rework this to not use hard-coded UHC carrier...
    @BeforeClass
    public void setUp() {
        rfpQuoteOption = new CreateRfpQuoteOptionDto();
        rfpQuoteOption.setOptionType(OptionType.OPTION);
        rfpQuoteOption.setQuoteType(QuoteType.EASY);
        rfpQuoteOption.setClientId(getClientIdL());
        rfpQuoteOption.setRfpCarrierId(getRfpCarrierId());

        rfpQuoteOptionStandard = new CreateRfpQuoteOptionDto();
        rfpQuoteOptionStandard.setOptionType(OptionType.RENEWAL);
        rfpQuoteOptionStandard.setQuoteType(QuoteType.DECLINED);
        rfpQuoteOptionStandard.setClientId(getClientIdL());
        rfpQuoteOptionStandard.setRfpCarrierId(getRfpCarrierId());

        rfpQuoteOptionTypeRenewal = new CreateRfpQuoteOptionDto();
        rfpQuoteOptionTypeRenewal.setOptionType(OptionType.RENEWAL);
        rfpQuoteOptionTypeRenewal.setQuoteType(QuoteType.STANDARD);
        rfpQuoteOptionTypeRenewal.setClientId(getClientIdL());
        rfpQuoteOptionTypeRenewal.setRfpCarrierId(getRfpCarrierId());

        rfpQuoteOptionTypeNegotiated = new CreateRfpQuoteOptionDto();
        rfpQuoteOptionTypeNegotiated.setOptionType(OptionType.NEGOTIATED);
        rfpQuoteOptionTypeNegotiated.setQuoteType(QuoteType.STANDARD);
        rfpQuoteOptionTypeNegotiated.setClientId(getClientIdL());
        rfpQuoteOptionTypeNegotiated.setRfpCarrierId(getRfpCarrierId());
    }

    // TODO/FIXME: need to rework this to not use hard-coded UHC carrier...
    @Test(description = "POST /v1/quotes/options/create Creating a new quote option based by 'Option 1", enabled = false)
    public void testCreatingNewQuoteOptionBasedByOption() {
        rfpQuoteOption.setClientId(0L);
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(rfpQuoteOption)
            .post(QUOTES_OPTIONS_CREATE_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_FOUND_FOR_CARRIER_CLIENT));

    }

    // TODO/FIXME: need to rework this to not use hard-coded UHC carrier...
    @Test(description = "POST /v1/quotes/options/create Creating a new quote option based by 'Option Standard", enabled = false)
    public void testCreatingNewQuoteOptionBasedByOptionStandard() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(rfpQuoteOptionStandard)
            .post(QUOTES_OPTIONS_CREATE_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_FOUND_FOR_CARRIER_CLIENT));
    }

    // TODO/FIXME: need to rework this to not use hard-coded UHC carrier...
    @Test(description = "POST /v1/quotes/options/create Creating a new quote option based by 'Type Renewal", enabled = false)
    public void testCreatingNewQuoteOptionBasedByOptionTypeRenewal() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(rfpQuoteOptionTypeRenewal)
            .post(QUOTES_OPTIONS_CREATE_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_FOUND_FOR_CARRIER_CLIENT));
    }

    // TODO/FIXME: need to rework this to not use hard-coded UHC carrier...
    @Test(description = "POST /v1/quotes/options/create Creating a new quote option based by ' Type Negotiated", enabled = false)
    public void testCreatingNewQuoteOptionBasedByOptionTypNegotiated() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(rfpQuoteOptionTypeNegotiated)
            .post(QUOTES_OPTIONS_CREATE_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_FOUND_FOR_CARRIER_CLIENT));
    }
    // TODO/FIXME: need to rework this to not use hard-coded UHC carrier...
    @Test(description = "POST /v1/quotes/options/create Creating a new quote option based by 'Option 1. Not Found.", enabled = false)
    public void testCreatingNewQuoteOptionBasedByNotFound() {

        rfpQuoteOption.setClientId(DataConstants.NOT_FOUND_ID);

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(rfpQuoteOption)
            .post(QUOTES_OPTIONS_CREATE_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_FOUND_FOR_CARRIER_CLIENT));
    }

    @Test(description = "POST /v1/quotes/options/create Creating a new quote option based by 'Option 1. Forbidden.")
    public void testCreatingNewQuoteOptionBasedByForbidden() {

        rfpQuoteOption.setClientId(DataConstants.FORBIDDEN_CLIENT_ID);

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(rfpQuoteOption)
            .post(QUOTES_OPTIONS_CREATE_PATH)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "POST /v1/quotes/options/create Creating a new quote option based by 'Option 1. Empty Body.")
    public void testCreatingNewQuoteOptionBasedByEmptyBody() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(EMPTY)
            .post(QUOTES_OPTIONS_CREATE_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "POST /v1/quotes/options/create Creating a new quote option based by 'Option 1. Null.")
    public void testCreatingNewQuoteOptionBasedByNull() {

        rfpQuoteOption.setClientId(null);

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(rfpQuoteOption)
            .post(QUOTES_OPTIONS_CREATE_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_CLIENT_ID_BODY_PATH, is(ERROR_MAY_NOT_BE_NULL));
    }

    @Test(description = "POST /v1/quotes/options/create Creating a new quote option based by 'Option 1. Rfp Carrier Not Found.")
    public void testCreatingNewQuoteOptionBasedRfpCarrierNotFound() {

        rfpQuoteOption.setClientId(getClientIdL());
        rfpQuoteOption.setRfpCarrierId(DataConstants.NOT_FOUND_ID);

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(rfpQuoteOption)
            .post(QUOTES_OPTIONS_CREATE_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_RFP_CARRIER_ENTITY_IS_NOT_FOUND));
    }

    @Test(description = "POST /v1/quotes/options/create Creating a new quote option based by 'Option 1. Unauthorized.")
    public void testCreatingNewQuoteOptionBasedByUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .body(rfpQuoteOption)
            .post(QUOTES_OPTIONS_CREATE_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }


}
