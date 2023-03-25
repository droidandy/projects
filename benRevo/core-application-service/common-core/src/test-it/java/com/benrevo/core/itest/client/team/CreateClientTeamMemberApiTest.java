package com.benrevo.core.itest.client.team;


import static com.benrevo.core.itest.util.DataConstants.FORBIDDEN_CLIENT_ID;
import static com.benrevo.core.itest.util.DataConstants.INVALID_FORMAT;
import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.AUTH_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.EMAIL_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_MEMBERS_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static java.util.Collections.singletonList;
import static java.util.stream.Stream.of;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import java.util.List;
import org.testng.annotations.Test;


/**
 * The Create team member api test. <p> Swagger https://devapi.benrevo.com/swagger-ui.html#/client-team-controller
 */
public class CreateClientTeamMemberApiTest extends ClientTeamBaseTest {

    @Test(description = "POST /v1/clients/{id}/members Adding a users to the client members team.")
    public void testAddingUsersToTheClientMembersTeam() {

        teamMemberList = given().spec(baseSpec())
            .body(of(teamMemberFirst).toArray())
            .contentType(JSON)
            .post(CLIENTS_ID_MEMBERS_PATH, getClientIdL())
            .then()
            .body(AUTH_ID_BODY_PATH, is(singletonList(teamMemberFirst.getAuthId())),
                EMAIL_BODY_PATH, is(singletonList(teamMemberFirst.getEmail()))
            )
            .statusCode(OK.value())
            .extract()
            .body()
            .as(List.class);
    }

    @Test(description = "POST /v1/clients/{id}/members Adding a users to the client members team. Not Found.")
    public void testAddingUsersToTheClientMembersTeamInvalidClientId() {

        given().spec(baseSpec())
            .body(of(teamMemberFirst).toArray())
            .contentType(JSON)
            .post(CLIENTS_ID_MEMBERS_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "POST /v1/clients/{id}/members Adding a users to the client members team. Invalid Format.")
    public void testAddingUsersToTheClientMembersTeamInvalidFormat() {

        given().spec(baseSpec())
            .body(of(teamMemberFirst).toArray())
            .contentType(JSON)
            .post(CLIENTS_ID_MEMBERS_PATH, INVALID_FORMAT)
            .then()

            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "POST /v1/clients/{id}/members Adding a users to the client members team. Invalid Format.")
    public void testAddingUsersToTheClientMembersTeamEmptyBody() {

        given().spec(baseSpec())
            .body(EMPTY)
            .contentType(JSON)
            .post(CLIENTS_ID_MEMBERS_PATH, INVALID_FORMAT)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "POST /v1/clients/{id}/members Adding a users to the client members team. Forbidden.")
    public void testAddingUsersToTheClientMembersTeamForbiddenClientId() {

        given().spec(baseSpec())
            .body(of(teamMemberFirst).toArray())
            .contentType(JSON)
            .post(CLIENTS_ID_MEMBERS_PATH, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "POST /v1/clients/{id}/members Adding a users to the client members team. Unauthorized.")
    public void testAddingUsersToTheClientMembersTeamUnauthorized() {

        given().spec(unauthorizedSpec())
            .body(of(teamMemberFirst).toArray())
            .contentType(JSON)
            .post(CLIENTS_ID_MEMBERS_PATH, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

}
