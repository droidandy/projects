package com.benrevo.core.itest.client.plan;

import static com.benrevo.core.itest.util.DataConstants.FORBIDDEN_CLIENT_ID;
import static com.benrevo.core.itest.util.DataConstants.INVALID_FORMAT;
import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_PLAN_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_PLANS;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_PLANS_ENROLLMENTS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_PLANS_CLIENT_PLAN_ID_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import org.testng.annotations.Test;


/**
 * The type Get client plan test. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/client-plan-controller/getClientPlanUsingGET
 * https://devapi.benrevo.com/swagger-ui.html#!/client-plan-controller/getClientPlansByClientIdUsingGET
 * https://devapi.benrevo.com/swagger-ui.html#!/client-plan-controller/getClientPlanEnrollmentsUsingGET
 */
public class GetClientPlanTest extends ClientPlanBase {

    @Test(description = "GET /v1/clients/plans/{id} Get client plan by id", enabled = false)
    public void testGetClientPlanById() {
        createClintPlan();
        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_PLANS_CLIENT_PLAN_ID_PATH, 1)
            .then()
            .statusCode(OK.value())
            .body("client_id", is(getClientIdL().intValue()))
            .body("client_plan_id", is(clientPlanId.intValue()));

    }

    @Test(description = "GET /v1/clients/plans/{id} Get client plan by id. Not Found.")
    public void testGetClientPlanByIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_PLANS_CLIENT_PLAN_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_PLAN_NOT_FOUND));

    }

    @Test(description = "GET /v1/clients/plans/{id} Get client plan by id. Invalid Format.")
    public void testGetClientPlanByIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_PLANS_CLIENT_PLAN_ID_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));

    }

    @Test(description = "GET /v1/clients/plans/{id} Get client plan by id. Unauthorized.")
    public void testGetClientPlanByIdUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(CLIENTS_PLANS_CLIENT_PLAN_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));

    }

    @Test(description = "GET /v1/clients/{id}/plans Retrieving plans for client by client_id")
    public void testRetrievingPlansForClientByClientId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_CLIENT_ID_PLANS, getClientIdL())
            .then()
            .statusCode(OK.value());

    }

    @Test(description = "GET /v1/clients/{id}/plans Retrieving plans for client by client_id. Not Found.")
    public void testRetrievingPlansForClientByClientIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_CLIENT_ID_PLANS, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));

    }

    @Test(description = "GET /v1/clients/{id}/plans Retrieving plans for client by client_id. Forbidden.")
    public void testRetrievingPlansForClientByClientIForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_CLIENT_ID_PLANS, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));

    }

    @Test(description = "GET /v1/clients/{id}/plans Retrieving plans for client by client_id. Invalid Format.")
    public void testRetrievingPlansForClientByClientIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_CLIENT_ID_PLANS, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));

    }

    @Test(description = "GET /v1/clients/{id}/plans Retrieving plans for client by client_id. Unauthorized.")
    public void testRetrievingPlansForClientByClientIdUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(CLIENTS_CLIENT_ID_PLANS, getClientIdL())
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));

    }

    @Test(description = "GET /v1/clients/{id}/plans/enrollments Retrieving client plans enrollments by client_id")
    public void testRetrievingClientPlansEnrollmentsByClientId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_CLIENT_ID_PLANS_ENROLLMENTS_PATH, getClientIdL())
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/clients/{id}/plans/enrollments Retrieving client plans enrollments by client_id. Not Found.")
    public void testRetrievingClientPlansEnrollmentsByClientIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_CLIENT_ID_PLANS_ENROLLMENTS_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/clients/{id}/plans/enrollments Retrieving client plans enrollments by client_id. Forbidden.")
    public void testRetrievingClientPlansEnrollmentsByClientIdForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_CLIENT_ID_PLANS_ENROLLMENTS_PATH, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "GET /v1/clients/{id}/plans/enrollments Retrieving client plans enrollments by client_id. Invalid Format.")
    public void testRetrievingClientPlansEnrollmentsByClientIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_CLIENT_ID_PLANS_ENROLLMENTS_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/clients/{id}/plans/enrollments Retrieving client plans enrollments by client_id. Unauthorized.")
    public void testRetrievingClientPlansEnrollmentsByClientIdUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(CLIENTS_CLIENT_ID_PLANS_ENROLLMENTS_PATH, getClientIdL())
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

}
