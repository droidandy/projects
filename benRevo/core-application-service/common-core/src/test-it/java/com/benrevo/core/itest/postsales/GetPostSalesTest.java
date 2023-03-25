package com.benrevo.core.itest.postsales;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.FILES_CODE_CLIENT_ID_PATH;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The type Get post sales test. Swagger: https://devapi.benrevo.com/swagger-ui.html#/post-sales-controller
 */
public class GetPostSalesTest extends AbstractBaseIt {


    private String CODE = "code";

    // FIXME: 10/4/2017 need find code, temporary this test is disabled.
    @Test(description = "GET /v1/files/{code} Download the document by client id and document code",
        enabled = false)
    public void testDownloadDocumentByClientIdAndDocumentCode() {
        given().spec(baseSpec())
            .get(FILES_CODE_CLIENT_ID_PATH, CODE, getClientIdL())
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/files/{code} Download the document by client id and document code. Unauthorized.")
    public void testDownloadDocumentByClientIdAndDocumentCodeUnauthorized() {
        given().spec(unauthorizedSpec())
            .get(FILES_CODE_CLIENT_ID_PATH, CODE, getClientIdL())
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "GET /v1/files/{code} Download the document by client id and document code. Not Found.")
    public void testDownloadDocumentByClientIdAndDocumentCodeNotFound() {
        given().spec(baseSpec())
            .get(FILES_CODE_CLIENT_ID_PATH, CODE, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/files/{code} Download the document by client id and document code. Forbidden.")
    public void testDownloadDocumentByClientIdAndDocumentCodeForbidden() {
        given().spec(baseSpec())
            .get(FILES_CODE_CLIENT_ID_PATH, CODE, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "GET /v1/files/{code} Download the document by client id and document code. Invalid Format.")
    public void testDownloadDocumentByClientIdAndDocumentCodeInvalidFormat() {
        given().spec(baseSpec())
            .get(FILES_CODE_CLIENT_ID_PATH, CODE, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }
}
