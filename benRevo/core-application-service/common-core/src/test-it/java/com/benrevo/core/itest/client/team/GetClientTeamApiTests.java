package com.benrevo.core.itest.client.team;


import static com.benrevo.core.itest.util.DataConstants.FORBIDDEN_CLIENT_ID;
import static com.benrevo.core.itest.util.DataConstants.INVALID_FORMAT;
import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.BROKERAGE_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_MEMBERS_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static java.util.stream.Stream.of;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import java.util.List;
import org.testng.annotations.Test;


/**
 * The Client team api tests. <p> See swagger https://devapi.benrevo.com/swagger-ui.html#/client-team-controller
 */

public class GetClientTeamApiTests extends ClientTeamBaseTest {

    @Test(description = "GET /v1/clients/{id}/members Get users belongs to client team by client_id.")
    public void testGetUsersBelongsToClientTeamByClientId() {

        teamMemberList = given().spec(baseSpec())
            .contentType(JSON)
            .body(of(teamMemberFirst, teamMemberSecond).toArray())
            .post(CLIENTS_ID_MEMBERS_PATH, getClientIdL())
            .then()
            .extract()
            .body()
            .as(List.class);
        given().spec(baseSpec())
            .get(CLIENTS_ID_MEMBERS_PATH, getClientIdL())
            .then()
            .statusCode(OK.value())
            .body(BROKERAGE_ID_BODY_PATH, hasSize(greaterThan(1)));
    }

    @Test(description = "GET /v1/clients/{id}/members Get users belongs to client team by client_id. Invalid Id.")
    public void testGetUsersBelongsToClientTeamByInvalidClientId() {

        given().spec(baseSpec())
            .get(CLIENTS_ID_MEMBERS_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND))

        ;
    }

    @Test(description = "GET /v1/clients/{id}/members Get users belongs to client team by client_id. Forbidden.")
    public void testGetUsersBelongsToClientTeamForbidden() {

        given().spec(baseSpec())
            .get(CLIENTS_ID_MEMBERS_PATH, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN))

        ;
    }

    @Test(description = "GET /v1/clients/{id}/members Get users belongs to client team by client_id. Invalid Format.")
    public void testGetUsersBelongsToClientTeamInvalidFormat() {

        given().spec(baseSpec())
            .get(CLIENTS_ID_MEMBERS_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE))

        ;
    }

    @Test(description = "GET /v1/clients/{id}/members Get users belongs to client team by client_id. Unauthorized.")
    public void testGetUsersBelongsToClientTeamUnauthorized() {

        given().spec(unauthorizedSpec())
            .get(CLIENTS_ID_MEMBERS_PATH, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED))

        ;
    }

}
