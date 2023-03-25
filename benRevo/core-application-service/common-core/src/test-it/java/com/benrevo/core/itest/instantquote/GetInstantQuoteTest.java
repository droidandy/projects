package com.benrevo.core.itest.instantquote;

import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_THERE_WAS_AN_ISSUE_WITH_YOUR_REQUEST_PLEASE_TRY_AGAIN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUALIFICATION_CLEAR_VALUE_ID_RFP_IDS_INVALID_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUALIFICATION_CLEAR_VALUE_ID_RFP_IDS_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The Get instant quote api test. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/instant-quote-controller/checkIfUserQualifiesForAnthemCVUsingGET
 */
public class GetInstantQuoteTest extends AbstractBaseIt {


    @Test(description = "GET /v1/qualification/clearValue/{id} check if user qualifies for Anthem Clear Value")
    public void testCheckIfUserQualifiesForAnthemClearValue() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUALIFICATION_CLEAR_VALUE_ID_RFP_IDS_PATH, getClientIdL(), NOT_FOUND_ID,
                NOT_FOUND_ID
            )
            .then()
            .body(MESSAGE_BODY_PATH,
                is(ERROR_THERE_WAS_AN_ISSUE_WITH_YOUR_REQUEST_PLEASE_TRY_AGAIN)
            );
    }

    @Test(description = "GET /v1/qualification/clearValue/{id} check if user qualifies for Anthem Clear Value Unauthorized")
    public void testCheckIfUserQualifiesForAnthemClearValueUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(QUALIFICATION_CLEAR_VALUE_ID_RFP_IDS_PATH, getClientIdL(), NOT_FOUND_ID,
                NOT_FOUND_ID
            )
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "GET /v1/qualification/clearValue/{id} check if user qualifies for Anthem Clear Value Not Found")
    public void testCheckIfUserQualifiesForAnthemClearValueNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUALIFICATION_CLEAR_VALUE_ID_RFP_IDS_PATH, NOT_FOUND_ID, NOT_FOUND_ID,
                NOT_FOUND_ID
            )
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/qualification/clearValue/{id} check if user qualifies for Anthem Clear Value Invalid Format")
    public void testCheckIfUserQualifiesForAnthemClearValueInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUALIFICATION_CLEAR_VALUE_ID_RFP_IDS_PATH, DataConstants.INVALID_FORMAT,
                NOT_FOUND_ID, NOT_FOUND_ID
            )
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/qualification/clearValue/{id} check if user qualifies for Anthem Clear Value Required Fields")
    public void testCheckIfUserQualifiesForAnthemClearValueRequiredFields() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUALIFICATION_CLEAR_VALUE_ID_RFP_IDS_INVALID_PATH, getClientIdL())
            .then()
            .body(MESSAGE_BODY_PATH,
                is(ERROR_THERE_WAS_AN_ISSUE_WITH_YOUR_REQUEST_PLEASE_TRY_AGAIN)
            );
    }

}
