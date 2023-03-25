package com.benrevo.core.itest.client.plan;


import static com.benrevo.core.itest.util.DataConstants.FORBIDDEN_CLIENT_ID;
import static com.benrevo.core.itest.util.DataConstants.INVALID_FORMAT;
import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_INVALID_ER_CONTRIBUTION_FORMAT_NULL;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ER_CONTRIBUTION_FORMAT_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PLAN_TYPE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_PLANS_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.ClientPlanDto;
import org.testng.annotations.Test;


/**
 * The type Create new client plan test. See swagger https://devapi.benrevo.com/swagger-ui.html#/client-plan-controller
 */
public class CreateNewClientPlanTest extends ClientPlanBase {

    @Test(description = "POST /v1/clients/{id}/plans Create new client plan.")
    public void testCreateClientPlanById() {
        given().spec(baseSpec())
            .contentType(JSON)
            .body(clientPlan)
            .post(CLIENTS_CLIENT_ID_PLANS_PATH, getClientIdL())
            .then()
            .body(PLAN_TYPE_BODY_PATH, is("HMO"))
            .body(ER_CONTRIBUTION_FORMAT_BODY_PATH, is("DOLLAR"))
            .statusCode(CREATED.value());
    }

    @Test(description = "POST /v1/clients/{id}/plans Create new client plan. Unauthorized.")
    public void testCreateClientPlanByIdUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(clientPlan)
            .post(CLIENTS_CLIENT_ID_PLANS_PATH, getClientIdL())
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "POST /v1/clients/{id}/plans Create new client plan. Empty Body.")
    public void testCreateClientPlanByIdEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .post(CLIENTS_CLIENT_ID_PLANS_PATH, -1L)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "POST /v1/clients/{id}/plans Create new client plan. Not Found.")
    public void testCreateClientPlanByIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(clientPlan)
            .post(CLIENTS_CLIENT_ID_PLANS_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "POST /v1/clients/{id}/plans Create new client plan. Forbidden.")
    public void testCreateClientPlanByIdForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(clientPlan)
            .post(CLIENTS_CLIENT_ID_PLANS_PATH, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "POST /v1/clients/{id}/plans Create new client plan. Invalid Format.")
    public void testCreateClientPlanByIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(clientPlan)
            .post(CLIENTS_CLIENT_ID_PLANS_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "POST /v1/clients/{id}/plans Create new client plan. NUll ER_CONTRIBUTION_FORMAT.")
    public void testCreateClientPlanByIdNullErContributionFormat() {
        ClientPlanDto clientPlan = random(ClientPlanDto.class);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(clientPlan)
            .post(CLIENTS_CLIENT_ID_PLANS_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, containsString(ERROR_INVALID_ER_CONTRIBUTION_FORMAT_NULL));
    }

}
