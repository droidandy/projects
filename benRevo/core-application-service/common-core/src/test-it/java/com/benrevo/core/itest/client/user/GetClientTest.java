package com.benrevo.core.itest.client.user;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.BROKERS_ID_CLIENTS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.hamcrest.CoreMatchers.hasItem;
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
 * The  Get client api test. Swagger - https://devapi.benrevo.com/swagger-ui.html#/client-controller
 */
public class GetClientTest extends AbstractBaseIt {

    @Test(description = "GET /v1/clients/{id} Get a client by id")
    public void testGetClientById() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_PATH, getClientIdL())
            .then()
            .statusCode(OK.value())
            .body(ID_BODY_PATH, is(getClientIdL().intValue()));
    }

    @Test(description = "GET /v1/clients/{id} Get a client by not found client id")
    public void testGetClientByInvalidId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/clients/{id} Get a client by forbidden client id")
    public void testGetClientByIdForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "GET /v1/clients/{id} Get a client. Unauthorized.")
    public void testGetClientByIdUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "GET /v1/clients/{id} Get a client by invalid format id")
    public void testGetClientByIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/brokers/{id}/clients Retrieving clients for broker by broker_id")
    public void testRetrievingClientsForBrokerByBrokerId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(BROKERS_ID_CLIENTS_PATH, getBrokerIdL())
            .then()
            .statusCode(OK.value())
            .body(ID_BODY_PATH, hasItem(getBrokerIdL().intValue()));
    }

    @Test(description = "GET /v1/brokers/{id}/clients Retrieving clients for broker by broker_id. Invalid Format.")
    public void testRetrievingClientsForBrokerByBrokerInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(BROKERS_ID_CLIENTS_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/brokers/{id}/clients Retrieving clients for broker by broker_id. Unauthorized.")
    public void testRetrievingClientsForBrokerByBrokerUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(BROKERS_ID_CLIENTS_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "GET /v1/clients Retrieving clients for current broker")
    public void testRetrievingClientsForCurrentBroker() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_PATH)
            .then()
            .statusCode(OK.value())
            .body(ID_BODY_PATH, hasItem(getClientIdL().intValue()));
    }

    @Test(description = "GET /v1/clients Retrieving clients for current broker. Unauthorized.")
    public void testRetrievingClientsForCurrentBrokerUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(CLIENTS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }
}
