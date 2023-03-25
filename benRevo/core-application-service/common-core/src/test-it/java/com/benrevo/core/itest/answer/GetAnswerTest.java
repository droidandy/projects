package com.benrevo.core.itest.answer;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CLIENT_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.ANSWERS_ID_PATH;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import io.restassured.http.ContentType;
import org.testng.annotations.Test;


/**
 * The Get answer api test. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/answer-controller/getAnswersUsingGET
 */
public class GetAnswerTest extends AbstractBaseIt {

    @Test(description = "GET /v1/answers/{clientId} Get answers for client.")
    public void testGetAnswersForClient() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(ANSWERS_ID_PATH, getClientIdL())
            .then()
            .statusCode(OK.value())
            .body(CLIENT_ID_BODY_PATH, is(getClientIdL().intValue()));
    }

    @Test(description = "GET /v1/answers/{clientId} Get answers for client. Not Found.")
    public void testGetAnswersForInvalidClientId() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(ANSWERS_ID_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/answers/{clientId} Get answers for client. Invalid Format.")
    public void testGetAnswersForInvalidFormatClientId() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(ANSWERS_ID_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/answers/{clientId} Get answers for client. Forbidden.")
    public void testGetAnswersForForbiddenClientId() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(ANSWERS_ID_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "GET /v1/answers/{clientId} Get answers for client. Unauthorized.")
    public void testGetAnswersForClientUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .get(ANSWERS_ID_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }
}
