package com.benrevo.core.itest.client.team;


import static com.benrevo.core.itest.util.DataConstants.FORBIDDEN_CLIENT_ID;
import static com.benrevo.core.itest.util.DataConstants.INVALID_FORMAT;
import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_MEMBERS_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
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
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;


/**
 * The Delete team member api test. <p> See swagger https://devapi.benrevo.com/swagger-ui.html#/client-team-controller
 */
public class DeleteClientTeamMemberApiTest extends ClientTeamBaseTest {


    private static final String MEMBERS_SUCCESSFULLY_DELETED_FROM_CLIENT_TEAM =
        "Members successfully deleted from client team.";

    @BeforeClass
    public void setUpTeamMember() {
        teamMemberList = given().spec(baseSpec())
            .body(of(teamMemberFirst).toArray())
            .contentType(JSON)
            .post(CLIENTS_ID_MEMBERS_PATH, getClientIdL())
            .then()
            .extract()
            .body()
            .as(List.class);
    }

    @Test(description = "DELETE /v1/clients/{id}/members Remove client team members.")
    public void testRemoveClientTeamMembers() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(teamMemberList)
            .delete(CLIENTS_ID_MEMBERS_PATH, getClientIdL())
            .then()
            .statusCode(OK.value())
            .body(MESSAGE_BODY_PATH, is(MEMBERS_SUCCESSFULLY_DELETED_FROM_CLIENT_TEAM));
    }

    @Test(description = "DELETE /v1/clients/{id}/members Remove client team members invalid client id.")
    public void testRemoveClientTeamMembersInvalidIdClient() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(teamMemberList)
            .delete(CLIENTS_ID_MEMBERS_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "DELETE /v1/clients/{id}/members Remove client team members forbidden client id.")
    public void testRemoveClientTeamMembersForbiddenClientId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(teamMemberList)
            .delete(CLIENTS_ID_MEMBERS_PATH, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "DELETE /v1/clients/{id}/members Remove client team members. Empty Body.")
    public void testRemoveClientTeamMembersEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .delete(CLIENTS_ID_MEMBERS_PATH, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "DELETE /v1/clients/{id}/members Remove client team members. Invalid Format.")
    public void testRemoveClientTeamMembersInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(teamMemberList)
            .delete(CLIENTS_ID_MEMBERS_PATH, INVALID_FORMAT)
            .then()

            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "DELETE /v1/clients/{id}/members Remove client team members. Unauthorized.")
    public void testRemoveClientTeamMembersInvalidFormatUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(teamMemberList)
            .delete(CLIENTS_ID_MEMBERS_PATH, INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_UNAUTHORIZED));
    }

}
