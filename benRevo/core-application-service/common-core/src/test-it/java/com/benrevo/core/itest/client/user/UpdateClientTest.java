package com.benrevo.core.itest.client.user;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CLIENT_NAME_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.ClientDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The  Update client test. Swagger - https://devapi.benrevo.com/swagger-ui.html#/client-controller
 */
public class UpdateClientTest extends AbstractBaseIt {


    @Test(description = "PUT /v1/clients/{id} Updating a client by id")
    public void testUpdatingClientById() {
        ClientDto clientDto = given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_PATH, getClientIdL())
            .then()
            .extract()
            .as(ClientDto.class);
        String newClientName = random(String.class);
        clientDto.setClientName(newClientName);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(clientDto)
            .put(CLIENTS_ID_PATH, getClientIdL())
            .then()
            .statusCode(OK.value())
            .body(CLIENT_NAME_BODY_PATH, is(newClientName));
    }

    @Test(description = "PUT /v1/clients/{id} Updating a client by not found client id")
    public void testUpdatingClientByInvalidId() {
        ClientDto clientDto = new ClientDto();

        given().spec(baseSpec())
            .contentType(JSON)
            .body(clientDto)
            .put(CLIENTS_ID_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "PUT /v1/clients/{id} Updating a client by forbidden client id")
    public void testUpdatingClientByForbiddenId() {
        ClientDto clientDto = new ClientDto();

        given().spec(baseSpec())
            .contentType(JSON)
            .body(clientDto)
            .put(CLIENTS_ID_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "PUT /v1/clients/{id} Updating a client. Unauthorized.")
    public void testUpdatingClientByUnauthorized() {
        ClientDto clientDto = new ClientDto();

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(clientDto)
            .put(CLIENTS_ID_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "PUT /v1/clients/{id} Updating a client by empty body")
    public void testUpdatingClientByIdEmpty() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(CLIENTS_ID_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }
}
