package com.benrevo.core.itest.rfp.carrier;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.LIFE;
import static com.benrevo.common.Constants.LTD;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.STD;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.core.itest.util.DataConstants.OAMC_OPEN_ACCESS_MANAGED_CHOICE_HSA;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_STRING_PARAMETER_NETWORK_TYPE_IS_NOT_PRESENT;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_RFP_CARRIER_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CATEGORY_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.NAME_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.RFP_CARRIERS_CATEGORY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.RFP_CARRIERS_ID_NETWORKS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.RFP_CARRIERS_RFP_CARRIER_ID_NETWORKS_NETWORK_TYPE_PATH;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The Rfp carrier api tests. See swagger - https://devapi.benrevo.com/swagger-ui.html#/rfp-carrier-controller
 */
//TODO: FIXME - these fail with "Cannot start a new transaction without ending the existing transaction."
public class RfpCarrierTests extends AbstractBaseIt {

    @Test(enabled = false,
        description = "GET /v1/rfpcarriers Retrieving the rfp carriers by category Dental")
    public void testRetrievingTheRfpCarriersByCategoryDental() {

        given().spec(baseSpec())
            .get(RFP_CARRIERS_CATEGORY_PATH, DENTAL)
            .then()
            .statusCode(OK.value())
            .body(CATEGORY_FIRST_BODY_PATH, is(DENTAL));
    }

    @Test(enabled = false,
        description = "GET /v1/rfpcarriers Retrieving the rfp carriers by category Vision")
    public void testRetrievingTheRfpCarriersByCategoryVision() {

        given().spec(baseSpec())
            .get(RFP_CARRIERS_CATEGORY_PATH, VISION)
            .then()
            .statusCode(OK.value())
            .body(CATEGORY_FIRST_BODY_PATH, is(VISION));
    }

    @Test(description = "GET /v1/rfpcarriers Retrieving the rfp carriers by category Life")
    public void testRetrievingTheRfpCarriersByCategoryLife() {

        given().spec(baseSpec())
            .get(RFP_CARRIERS_CATEGORY_PATH, LIFE)
            .then()
            .statusCode(OK.value())
            .body(CATEGORY_FIRST_BODY_PATH, is(LIFE));
    }

    @Test(description = "GET /v1/rfpcarriers Retrieving the rfp carriers by category Ltd")
    public void testRetrievingTheRfpCarriersByCategoryLtd() {

        given().spec(baseSpec())
            .get(RFP_CARRIERS_CATEGORY_PATH, LTD)
            .then()
            .statusCode(OK.value())
            .body(CATEGORY_FIRST_BODY_PATH, is(LTD));
    }

    @Test(description = "GET /v1/rfpcarriers Retrieving the rfp carriers by category Std")
    public void testRetrievingTheRfpCarriersByCategoryStd() {

        given().spec(baseSpec())
            .get(RFP_CARRIERS_CATEGORY_PATH, STD)
            .then()
            .statusCode(OK.value())
            .body(CATEGORY_FIRST_BODY_PATH, is(STD));
    }

    @Test(description = "GET /v1/rfpcarriers Retrieving the rfp carriers by category Unauthorized")
    public void testRetrievingTheRfpCarriersByCategoryUnauthorized() {

        given().spec(unauthorizedSpec())
            .get(RFP_CARRIERS_CATEGORY_PATH, STD)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(enabled = false,
        description = "GET /v1/rfpcarriers Retrieving the rfp carriers by category Medical")
    public void testRetrievingTheRfpCarriersByCategoryMedical() {

        given().spec(baseSpec())
            .get(RFP_CARRIERS_CATEGORY_PATH, MEDICAL)
            .then()
            .statusCode(OK.value())
            .body(CATEGORY_FIRST_BODY_PATH, is(MEDICAL));
    }

    @Test(enabled = false,
        description = "GET /v1/rfpcarriers/{id}/networks Retrieving the rfp carrier networks by network type")
    public void testRetrievingTheRfpCarrierNetworksByNetworkType() {

        given().spec(baseSpec())
            .get(RFP_CARRIERS_RFP_CARRIER_ID_NETWORKS_NETWORK_TYPE_PATH, 1, "CIGNA")
            .then()
            .statusCode(OK.value())
            .body(NAME_FIRST_BODY_PATH, is(OAMC_OPEN_ACCESS_MANAGED_CHOICE_HSA));
    }

    @Test(description = "GET /v1/rfpcarriers/{id}/networks Retrieving the rfp carrier networks by network type not found if")
    public void testRetrievingTheRfpCarrierNetworksByNetworkTypeNotFoundCarrierId() {

        given().spec(baseSpec())
            .get(RFP_CARRIERS_RFP_CARRIER_ID_NETWORKS_NETWORK_TYPE_PATH, DataConstants.NOT_FOUND_ID,
                "hso"
            )
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_RFP_CARRIER_NOT_FOUND));
    }

    @Test(description = "GET /v1/rfpcarriers/{id}/networks Retrieving the rfp carrier networks by network type invalid format")
    public void testRetrievingTheRfpCarrierNetworksByNetworkTypeInvalidFormat() {

        given().spec(baseSpec())
            .get(RFP_CARRIERS_RFP_CARRIER_ID_NETWORKS_NETWORK_TYPE_PATH,
                DataConstants.INVALID_FORMAT, "hso"
            )
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/rfpcarriers/{id}/networks Retrieving the rfp carrier networks by network type Unauthorized")
    public void testRetrievingTheRfpCarrierNetworksByNetworkTypeUnauthorized() {

        given().spec(unauthorizedSpec())
            .get(RFP_CARRIERS_RFP_CARRIER_ID_NETWORKS_NETWORK_TYPE_PATH,
                DataConstants.INVALID_FORMAT, "hso"
            )
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "GET /v1/rfpcarriers/{id}/networks Retrieving the rfp carrier networks by network type required")
    public void testRetrievingTheRfpCarrierNetworksByNetworkTypeIsNone() {

        given().spec(baseSpec())
            .get(RFP_CARRIERS_ID_NETWORKS_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .body(MESSAGE_BODY_PATH,
                is(ERROR_REQUIRED_STRING_PARAMETER_NETWORK_TYPE_IS_NOT_PRESENT)
            );
    }


}
