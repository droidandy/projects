package com.benrevo.core.itest.account;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUEST_FAILED_WITH_STATUS_CODE_404_THE_USER_DOES_NOT_EXIST;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.FIRST_NAME_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.LAST_NAME_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.ACCOUNTS_USERS_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.ClientAccountDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The Updating auth0 client api test. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/account-controller/updateClientAccountMetadataUsingPUT
 */
public class UpdatingAuth0ClientTest extends AbstractBaseIt {

    // FIXME: 10/4/2017 The user does not exist. temporary this test is disabled
    @Test(description = "PUT /v1/accounts/users Updating auth0 client user_metadata",
        enabled = false)
    public void testUpdatingAuth0ClientUserMetadata() {
        ClientAccountDto accountDto = random(ClientAccountDto.class);
        accountDto.setEmail(DataConstants.EMAIL_AUTOMATION_BENREVO_COM);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(accountDto)
            .put(ACCOUNTS_USERS_PATH)
            .then()
            .statusCode(OK.value())
            .body(LAST_NAME_BODY_PATH, is(accountDto.getLastName()))
            .body(FIRST_NAME_BODY_PATH, is(accountDto.getFirstName()));

    }

    @Test(description = "PUT /v1/accounts/users Updating auth0 client user_metadata. Required Fields.",
        enabled = false)
    public void testUpdatingAuth0ClientUserMetadataRequiredFields() {
        ClientAccountDto accountDto = new ClientAccountDto();

        given().spec(baseSpec())
            .contentType(JSON)
            .body(accountDto)
            .put(ACCOUNTS_USERS_PATH)
            .then()
            .body(
                MESSAGE_BODY_PATH,
                is(ERROR_REQUEST_FAILED_WITH_STATUS_CODE_404_THE_USER_DOES_NOT_EXIST)
            );

    }

    @Test(description = "PUT /v1/accounts/users Updating auth0 client user_metadata. Empty Body.")
    public void testUpdatingAuth0ClientUserMetadataEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(ACCOUNTS_USERS_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));

    }

    @Test(description = "PUT /v1/accounts/users Updating auth0 client user_metadata. Unauthorized.")
    public void testUpdatingAuth0ClientUserMetadataUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(ACCOUNTS_USERS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));

    }

}
