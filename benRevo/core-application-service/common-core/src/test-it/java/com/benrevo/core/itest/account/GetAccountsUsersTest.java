package com.benrevo.core.itest.account;

import static com.benrevo.common.enums.UserAttributeName.OPTION_LIST_TOUR_COMPLETED;
import static com.benrevo.common.enums.UserAttributeName.OPTION_OVERVIEW_TOUR_COMPLETED;
import static com.benrevo.common.enums.UserAttributeName.VIEW_ALTERNATIVE_TOUR_COMPLETED;
import static com.benrevo.core.itest.util.DataConstants.ATTRIBUTE_PARAMETER;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ATTRIBUTES_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.BROKERAGE_FIRST_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.LOGIN_COUNT_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.ACCOUNTS_USERS_ATTRIBUTE_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.ACCOUNTS_USERS_LOGIN_COUNT_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.ACCOUNTS_USERS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.ACCOUNTS_USERS_STATUS_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.core.AbstractBaseIt;
import org.testng.annotations.Test;


/**
 * The Get accounts users api test.
 * Swagger:
 * https://devapi.benrevo.com/swagger-ui.html#!/account-controller/getMembersByBrokerIdUsingGET
 * https://devapi.benrevo.com/swagger-ui.html#!/account-controller/getClientLoginCountUsingGET
 */
public class GetAccountsUsersTest extends AbstractBaseIt {



    @Test(description = "GET /v1/accounts/users Retrieving brokers for brokerage by brokerage name GET /v1/users?name=.")
    public void testRetrievingBrokersForBrokerageByBrokerageName() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(ACCOUNTS_USERS_PATH)
            .then()
            .statusCode(OK.value())
            .body(BROKERAGE_FIRST_ID_BODY_PATH, is(11)); // first broker_id = 10, see <changeSet author="golovchenkoaa" id="10-11-17 17:00"
    }

    @Test(description = "GET /v1/accounts/users Retrieving brokers for brokerage by brokerage name GET /v1/users?name= .Unauthorized.")
    public void testRetrievingBrokersForBrokerageByBrokerageNameUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(ACCOUNTS_USERS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    //FIXME: 11/10/2017 for ANTHEM_BLUE_CROSS
    @Test(description = "GET /v1/accounts/users/loginCount Retrieve login count from auth0 for user authid",enabled = false)
    public void testRetrieveLoginCountFromAuth0ForUserAuthid() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(ACCOUNTS_USERS_LOGIN_COUNT_PATH)
            .then()
            .body(LOGIN_COUNT_BODY_PATH, notNullValue());
    }

    @Test(description = "GET /v1/accounts/users/loginCount Retrieve login count from auth0 for user authid. Unauthorized.")
    public void testRetrieveLoginCountFromAuth0ForUserAuthidUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(ACCOUNTS_USERS_LOGIN_COUNT_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "GET /v1/accounts/users/status Retrieve status for user authid. OPTION_LIST_TOUR_COMPLETED")
    public void testRetrieveStatusForUserAuthidOptionListTourCompleted() {

        Object[] pathParams = {ATTRIBUTE_PARAMETER, OPTION_LIST_TOUR_COMPLETED};
        given().spec(baseSpec()).contentType(JSON).post(ACCOUNTS_USERS_ATTRIBUTE_PATH, pathParams);

        given().spec(baseSpec())
            .contentType(JSON)
            .get(ACCOUNTS_USERS_STATUS_PATH)
            .then()
            .body(ATTRIBUTES_BODY_PATH, hasItem(OPTION_LIST_TOUR_COMPLETED.toString()));

    }

    @Test(description = "GET /v1/accounts/users/status Retrieve status for user authid. OPTION_OVERVIEW_TOUR_COMPLETED")
    public void testRetrieveStatusForUserAuthidOptionOverviewTourCompleted() {

        Object[] pathParams = {ATTRIBUTE_PARAMETER, OPTION_OVERVIEW_TOUR_COMPLETED};
        given().spec(baseSpec()).contentType(JSON).post(ACCOUNTS_USERS_ATTRIBUTE_PATH, pathParams);

        given().spec(baseSpec())
            .contentType(JSON)
            .get(ACCOUNTS_USERS_STATUS_PATH)
            .then()
            .body(ATTRIBUTES_BODY_PATH, hasItem(OPTION_OVERVIEW_TOUR_COMPLETED.toString()));
    }

    @Test(description = "GET /v1/accounts/users/status Retrieve status for user authid. VIEW_ALTERNATIVE_TOUR_COMPLETED")
    public void testRetrieveStatusForUserAuthidViewAlternativeTourCompleted() {

        Object[] pathParams = {ATTRIBUTE_PARAMETER, VIEW_ALTERNATIVE_TOUR_COMPLETED};
        given().spec(baseSpec()).contentType(JSON).post(ACCOUNTS_USERS_ATTRIBUTE_PATH, pathParams);

        given().spec(baseSpec())
            .contentType(JSON)
            .get(ACCOUNTS_USERS_STATUS_PATH)
            .then()
            .body(ATTRIBUTES_BODY_PATH, hasItem(VIEW_ALTERNATIVE_TOUR_COMPLETED.toString()));
    }

}
