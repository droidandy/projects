package com.benrevo.core.itest.client.plan;


import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_PLAN_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_PLANS_ID_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import org.testng.annotations.Test;


/**
 * The Update client plan test. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/client-plan-controller/updateClientPlanEnrollmentsUsingPUT
 * https://devapi.benrevo.com/swagger-ui.html#!/client-plan-controller/updateClientPlanUsingPUT
 */
public class UpdateClientPlanTest extends ClientPlanBase {

    @Test(description = "PUT /v1/clients/plans/{id} Update client plan by id. Not Found.")
    public void testUpdateClientPlanByIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(clientPlan)
            .put(CLIENTS_PLANS_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_PLAN_NOT_FOUND));

    }

    @Test(description = "PUT /v1/clients/plans/{id} Update client plan by id. Empty Body.")
    public void testUpdateClientPlanByIdEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(CLIENTS_PLANS_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING))

        ;

    }

    @Test(description = "PUT /v1/clients/plans/{id} Update client plan by id. Unauthorized.")
    public void testUpdateClientPlanByIdUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(clientPlan)
            .put(CLIENTS_PLANS_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

}
