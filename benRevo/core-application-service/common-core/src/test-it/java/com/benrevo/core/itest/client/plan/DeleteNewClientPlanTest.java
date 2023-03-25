package com.benrevo.core.itest.client.plan;


import static com.benrevo.core.itest.util.DataConstants.INVALID_FORMAT;
import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_PLAN_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_PLANS_ID_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import org.testng.annotations.Test;


/**
 * The type Delete new client plan test. See swagger https://devapi.benrevo.com/swagger-ui.html#/client-plan-controller
 */
public class DeleteNewClientPlanTest extends ClientPlanBase {

    @Test(description = "DELETE /v1/clients/plans/{id} Remove client plan by id")
    public void testRemoveClientPlanById() {
        createClintPlan();
        given().spec(baseSpec())
            .contentType(JSON)
            .delete(CLIENTS_PLANS_ID_PATH, clientPlanId)
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "DELETE /v1/clients/plans/{id} Remove client plan by id. Unauthorized.")
    public void testRemoveClientPlanByIdUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .delete(CLIENTS_PLANS_ID_PATH, getClientIdL())
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "DELETE /v1/clients/plans/{id} Remove client plan by id. Not Found.")
    public void testRemoveClientPlanByIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .delete(CLIENTS_PLANS_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_CLIENT_PLAN_NOT_FOUND));
    }

    @Test(description = "DELETE /v1/clients/plans/{id} Remove client plan by id. Invalid format.")
    public void testRemoveClientPlanByIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .delete(CLIENTS_PLANS_ID_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }
}
