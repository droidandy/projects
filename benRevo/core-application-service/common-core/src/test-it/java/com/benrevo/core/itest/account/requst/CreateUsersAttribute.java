package com.benrevo.core.itest.account.requst;

import static com.benrevo.common.enums.UserAttributeName.OPTION_LIST_TOUR_COMPLETED;
import static com.benrevo.common.enums.UserAttributeName.OPTION_OVERVIEW_TOUR_COMPLETED;
import static com.benrevo.common.enums.UserAttributeName.VIEW_ALTERNATIVE_TOUR_COMPLETED;
import static com.benrevo.core.itest.util.DataConstants.ATTRIBUTE_PARAMETER;
import static com.benrevo.core.itest.util.DataConstants.INVALID_FORMAT;
import static com.benrevo.core.itest.util.DataConstants.THE_ATTRIBUTE_WAS_SUCCESSFULLY_CREATED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.FAILED_TO_CONVERT_VALUE_OF_TYPE_JAVA_LANG_STRING_TO_REQUIRED_TYPE;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.ACCOUNTS_USERS_ATTRIBUTE_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.core.AbstractBaseIt;
import org.testng.annotations.Test;


/**
 * The Create users attribute api. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/account45controller/createUserAttributeUsingPOST
 */
public class CreateUsersAttribute extends AbstractBaseIt {


    @Test(description = "POST /v1/accounts/users/attribute Creating attribute for current user. OPTION_LIST_TOUR_COMPLETED")
    public void testCreatingAttributeForCurrentUserOptionListTourCompleted() {
        Object[] pathParams = {ATTRIBUTE_PARAMETER, OPTION_LIST_TOUR_COMPLETED};
        given().spec(baseSpec())
            .contentType(JSON)
            .post(ACCOUNTS_USERS_ATTRIBUTE_PATH, pathParams)
            .then()
            .body(MESSAGE_BODY_PATH, is(THE_ATTRIBUTE_WAS_SUCCESSFULLY_CREATED));
    }

    @Test(description = "POST /v1/accounts/users/attribute Creating attribute for current user. OPTION_OVERVIEW_TOUR_COMPLETED")
    public void testCreatingAttributeForCurrentUserOptionOverviewTourCompleted() {
        Object[] pathParams = {ATTRIBUTE_PARAMETER, OPTION_OVERVIEW_TOUR_COMPLETED};
        given().spec(baseSpec())
            .contentType(JSON)
            .post(ACCOUNTS_USERS_ATTRIBUTE_PATH, pathParams)
            .then()
            .body(MESSAGE_BODY_PATH, is(THE_ATTRIBUTE_WAS_SUCCESSFULLY_CREATED));
    }

    @Test(description = "POST /v1/accounts/users/attribute Creating attribute for current user. VIEW_ALTERNATIVE_TOUR_COMPLETED")
    public void testCreatingAttributeForCurrentUserViewAlternativeTourCompleted() {
        Object[] pathParams = {ATTRIBUTE_PARAMETER, VIEW_ALTERNATIVE_TOUR_COMPLETED};
        given().spec(baseSpec())
            .contentType(JSON)
            .post(ACCOUNTS_USERS_ATTRIBUTE_PATH, pathParams)
            .then()
            .body(MESSAGE_BODY_PATH, is(THE_ATTRIBUTE_WAS_SUCCESSFULLY_CREATED));
    }

    @Test(description = "POST /v1/accounts/users/attribute Creating attribute for current user. Unauthorized.")
    public void testCreatingAttributeForCurrentUserUnauthorized() {
        Object[] pathParams = {ATTRIBUTE_PARAMETER, VIEW_ALTERNATIVE_TOUR_COMPLETED};
        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .post(ACCOUNTS_USERS_ATTRIBUTE_PATH, pathParams)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "POST /v1/accounts/users/attribute Creating attribute for current user. INVALID_FORMAT.")
    public void testCreatingAttributeForCurrentUserInvalidFormat() {
        Object[] pathParams = {ATTRIBUTE_PARAMETER, INVALID_FORMAT};
        given().spec(baseSpec())
            .contentType(JSON)
            .post(ACCOUNTS_USERS_ATTRIBUTE_PATH, pathParams)
            .then()
            .body(
                MESSAGE_BODY_PATH,
                containsString(FAILED_TO_CONVERT_VALUE_OF_TYPE_JAVA_LANG_STRING_TO_REQUIRED_TYPE)
            );
    }


}
