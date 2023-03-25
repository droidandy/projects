package com.benrevo.core.itest.basicerror;

import static com.benrevo.core.itest.util.RequestPathConstants.ERROR_PATH;
import static io.restassured.RestAssured.given;
import static org.springframework.http.HttpStatus.OK;

import com.benrevo.core.AbstractBaseIt;
import io.restassured.http.ContentType;
import org.testng.annotations.Test;


/**
 * The  Basic error api test. Swagger - https://devapi.benrevo.com/swagger-ui.html#!/basic-error-controller/
 */

public class BasicErrorTest extends AbstractBaseIt {

    // FIXME: 10/4/2017  need to fix. temporary this test is disabled
    @Test(description = "DELETE /error error", enabled = false)
    public void testDeleteError() {


        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .delete(ERROR_PATH)
            .then()
            .statusCode(OK.value());
    }

    // FIXME: 10/4/2017  need to fix. temporary this test is disabled
    @Test(description = "GET /error error", enabled = false)
    public void testGetError() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(ERROR_PATH)
            .then()
            .statusCode(OK.value());
    }

    // FIXME: 10/4/2017  need to fix. temporary this test is disabled
    @Test(description = "HEAD /error error", enabled = false)
    public void testHeadError() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .head(ERROR_PATH)
            .then()
            .statusCode(OK.value());
    }

    // FIXME: 10/4/2017  need to fix. temporary this test is disabled
    @Test(description = "OPTIONS /error error", enabled = false)
    public void testOptionsError() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .options(ERROR_PATH)
            .then()
            .statusCode(OK.value());
    }

    // FIXME: 10/4/2017  need to fix. temporary this test is disabled
    @Test(description = "PATCH /error error", enabled = false)
    public void testPatchError() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .patch(ERROR_PATH)
            .then()
            .statusCode(OK.value());
    }

    // FIXME: 10/4/2017  need to fix. temporary this test is disabled
    @Test(description = "POST /error error", enabled = false)
    public void testPostError() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .post(ERROR_PATH)
            .then()
            .statusCode(OK.value());
    }

    // FIXME: 10/4/2017  need to fix. temporary this test is disabled
    @Test(description = "PUT /error error", enabled = false)
    public void testPutError() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .put(ERROR_PATH)
            .then()
            .statusCode(OK.value());
    }
}
