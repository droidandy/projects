package com.benrevo.core.itest.network;

import static com.benrevo.core.itest.util.DataConstants.PLAN_TYPE;
import static com.benrevo.core.itest.util.DataConstants.TYPE_HSA;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.TYPE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CARRIER_CARRIER_ID_NETWORK_TYPE_ALL_PATH;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.core.AbstractBaseIt;
import io.restassured.http.ContentType;
import org.testng.annotations.Test;


/**
 * The type Get network test.
 */
public class GetNetworkTest extends AbstractBaseIt {

    @Test(description = "GET /v1/carrier/{carrierId}/network/{type}/all Retrieves a carrier's networks")
    public void testRetrievesCarrierNetworks() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(CARRIER_CARRIER_ID_NETWORK_TYPE_ALL_PATH, 1, PLAN_TYPE)
            .then()
            .statusCode(OK.value())
            .body(TYPE_BODY_PATH, hasItem(PLAN_TYPE));
    }

    @Test(description = "GET /v1/carrier/{carrierId}/network/{type}/all Retrieves a carrier's networks. Unauthorized")
    public void testRetrievesCarrierNetworksUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .get(CARRIER_CARRIER_ID_NETWORK_TYPE_ALL_PATH, 1, TYPE_HSA)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

}
