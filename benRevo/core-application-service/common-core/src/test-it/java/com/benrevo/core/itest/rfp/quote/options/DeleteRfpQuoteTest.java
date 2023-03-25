package com.benrevo.core.itest.rfp.quote.options;


import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_MAY_NOT_BE_NULL;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_QUOTE_OPTION_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ERRORS_RFP_QUOTE_OPTION_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.DeleteRfpQuoteOptionDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The Delete rfp quote api test.
 */
public class DeleteRfpQuoteTest extends AbstractBaseIt {

    private static final String QUOTES_OPTIONS_DELETE_PATH = "/quotes/options/delete";
    private DeleteRfpQuoteOptionDto deleteQuoteOption = new DeleteRfpQuoteOptionDto();

    @Test(description = "DELETE /v1/quotes/options/delete Deleting quote option by rfp_quote_option_id")
    public void testDeletingQuoteOptionByQfpQuoteOptionId() {


        deleteQuoteOption.setRfpQuoteOptionId(1L);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(deleteQuoteOption)
            .delete(QUOTES_OPTIONS_DELETE_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "DELETE /v1/quotes/options/delete Deleting quote option by rfp_quote_option_id empty body")
    public void testDeletingQuoteOptionByQfpQuoteOptionIdEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .delete(QUOTES_OPTIONS_DELETE_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "DELETE /v1/quotes/options/delete Deleting quote option by rfp_quote_option_id error")
    public void testDeletingQuoteOptionByQfpQuoteOptionIdError() {
        deleteQuoteOption.setRfpQuoteOptionId(null);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(deleteQuoteOption)
            .delete(QUOTES_OPTIONS_DELETE_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_RFP_QUOTE_OPTION_ID_BODY_PATH, startsWith(ERROR_MAY_NOT_BE_NULL));
    }

    @Test(description = "DELETE /v1/quotes/options/delete Deleting quote option by rfp_quote_option_id not found")
    public void testDeletingQuoteOptionByQfpQuoteOptionIdErrorNotFound() {
        deleteQuoteOption.setRfpQuoteOptionId(DataConstants.NOT_FOUND_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(deleteQuoteOption)
            .delete(QUOTES_OPTIONS_DELETE_PATH)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "DELETE /v1/quotes/options/delete Deleting quote option by rfp_quote_option_id. Unauthorized.")
    public void testDeletingQuoteOptionByQfpQuoteOptionIdUnauthorized() {
        deleteQuoteOption.setRfpQuoteOptionId(DataConstants.NOT_FOUND_ID);

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(deleteQuoteOption)
            .delete(QUOTES_OPTIONS_DELETE_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

}
