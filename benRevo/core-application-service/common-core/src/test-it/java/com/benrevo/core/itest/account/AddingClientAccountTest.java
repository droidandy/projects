package com.benrevo.core.itest.account;

import static com.benrevo.core.itest.util.DataConstants.INVALID_FORMAT;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_INVALID_EMAIL_PROVIDED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUEST_FAILED_WITH_STATUS_CODE_400_THE_USER_ALREADY_EXISTS;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.ACCOUNTS_CLIENTS_ID_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.ClientAccountDto;
import com.benrevo.core.itest.util.DataConstants;
import com.benrevo.core.itest.util.base.SmtpMailServerBase;
import org.testng.annotations.Test;


/**
 * The  Adding client account  api test. <p> Swagger: https://devapi.benrevo.com/swagger-ui.html#!/account-controller/addClientAccountToBrokerageUsingPOST
 */
public class AddingClientAccountTest extends SmtpMailServerBase {

    @Test(description = "POST /v1/accounts/clients/{id} Adding a client account to the brokerage.")
    public void testAddingClientAccountToTheBrokerageTheUserAlreadyExists() {
        ClientAccountDto automationClientAccount = new ClientAccountDto();
        automationClientAccount.setEmail(DataConstants.EMAIL_AUTOMATION_BENREVO_COM);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(automationClientAccount)
            .post(ACCOUNTS_CLIENTS_ID_PATH, getClientIdL())
            .then()
            .body(
                MESSAGE_BODY_PATH,
                is(ERROR_REQUEST_FAILED_WITH_STATUS_CODE_400_THE_USER_ALREADY_EXISTS)
            );

    }

    @Test(description = "POST /v1/accounts/clients/{id} Adding a client account to the brokerage. Invalid email.")
    public void testAddingClientAccountToTheBrokerageInvalidEmail() {
        ClientAccountDto automationClientAccount = new ClientAccountDto();

        given().spec(baseSpec())
            .contentType(JSON)
            .body(automationClientAccount)
            .post(ACCOUNTS_CLIENTS_ID_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_INVALID_EMAIL_PROVIDED));

    }

    @Test(description = "POST /v1/accounts/clients/{id} Adding a client account to the brokerage. Unauthorized.")
    public void testAddingClientAccountToTheBrokerageUnauthorized() {
        ClientAccountDto automationClientAccount = new ClientAccountDto();

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(automationClientAccount)
            .post(ACCOUNTS_CLIENTS_ID_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));

    }

    @Test(description = "POST /v1/accounts/clients/{id} Adding a client account to the brokerage. Not Found.")
    public void testAddingClientAccountToTheBrokerageNotFound() {
        ClientAccountDto automationClientAccount = new ClientAccountDto();
        automationClientAccount.setEmail(DataConstants.EMAIL_AUTOMATION_BENREVO_COM);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(automationClientAccount)
            .post(ACCOUNTS_CLIENTS_ID_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));

    }

    @Test(description = "POST /v1/accounts/clients/{id} Adding a client account to the brokerage. Invalid Format.")
    public void testAddingClientAccountToTheBrokerageInvalidFormat() {
        ClientAccountDto automationClientAccount = new ClientAccountDto();

        given().spec(baseSpec())
            .contentType(JSON)
            .body(automationClientAccount)
            .post(ACCOUNTS_CLIENTS_ID_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));

    }

    @Test(description = "POST /v1/accounts/clients/{id} Adding a client account to the brokerage. Empty Body.")
    public void testAddingClientAccountToTheBrokerageEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .post(ACCOUNTS_CLIENTS_ID_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));

    }
}
