package com.benrevo.core.itest.carrier;


import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_RFP_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CARRIER_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.DENTAL_CARRIER_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MEDICAL_CARRIER_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.VISION_CARRIER_ID_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CARRIERS_ALL_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CARRIERS_ID_FEES_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CARRIERS_PRODUCT_ALL_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_RFPS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENT_CLIENT_ID_RFP_CATEGORY_CARRIER_HISTORY_ALL_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static io.restassured.mapper.ObjectMapperType.GSON;
import static java.util.Arrays.asList;
import static org.apache.commons.lang3.ArrayUtils.toArray;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.CarrierHistoryDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import io.restassured.http.ContentType;
import java.util.ArrayList;
import java.util.List;
import org.testng.annotations.Test;


/**
 * The Get carrier test. Swagger -https://devapi.benrevo.com/swagger-ui.html#/carrier-controller
 */
public class GetCarrierTest extends AbstractBaseIt {

    @Test(description = "GET /v1/carriers/all/ Retrieve all carriers.")
    public void testRetrieveAllCarriers() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(CARRIERS_ALL_PATH)
            .then()
            .statusCode(OK.value())
            .body(CARRIER_ID_BODY_PATH, hasSize(greaterThan(1)));

    }

    @Test(description = "GET /v1/carriers/all/ Retrieve all carriers. Unauthorized.")
    public void testRetrieveAllCarriersUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .get(CARRIERS_ALL_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_UNAUTHORIZED));

    }

    // TODO: FIXME - why does this return 500?
    @Test(enabled = false, description = "GET /v1/carriers/product/all Retrieve all carriers.")
    public void testRetrieveAllCarriersProduct() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(CARRIERS_PRODUCT_ALL_PATH)
            .then()
            .statusCode(OK.value())
            .body(MEDICAL_CARRIER_ID_BODY_PATH, hasSize(greaterThan(1)))
            .body(DENTAL_CARRIER_ID_BODY_PATH, hasSize(greaterThan(1)))
            .body(VISION_CARRIER_ID_BODY_PATH, hasSize(greaterThan(1)));

    }

    @Test(description = "GET /v1/carriers/product/all Retrieve all carriers. Unauthorized.")
    public void testRetrieveAllCarriersProductUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .get(CARRIERS_PRODUCT_ALL_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_UNAUTHORIZED));

    }

    @Test(description = "GET /v1/carriers/{id}/fees Retrieve all сarrier administrative fees.")
    public void testRetrieveAllCarriersAdministrativeFees() {
      given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(CARRIERS_ID_FEES_PATH, 22)
            .then()
            .statusCode(OK.value())
            .body(MESSAGE_BODY_PATH, hasSize(greaterThan(1)));

    }

    @Test(description = "GET /v1/carriers/{id}/fees Retrieve all сarrier administrative fees. Invalid Format.")
    public void testRetrieveAllCarriersAdministrativeFeesInvalidFormat() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(CARRIERS_ID_FEES_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));

    }

    @Test(description = "GET /v1/carriers/{id}/fees Retrieve all сarrier administrative fees. Unauthorized.")
    public void testRetrieveAllCarriersAdministrativeFeesUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .get(CARRIERS_ID_FEES_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_UNAUTHORIZED));

    }

    @Test(description = "GET /v1/client/{clientId}/rfp/{category}/carrierHistory/all/ Retrieve all carriers from the client's rfp.",
        enabled = false)
    public void testRetrieveAllCarriersFromTheClientsRfp() {
        String[] excludedFields = toArray("id", "options.id", "carrierHistories");
        RfpDto one = er.nextObject(RfpDto.class, excludedFields);
        List<CarrierHistoryDto> carrierHistories = new ArrayList<>();
        CarrierHistoryDto firstCarrierHistories = new CarrierHistoryDto();
        firstCarrierHistories.setName("Anthem");
        firstCarrierHistories.setCurrent(true);
        firstCarrierHistories.setYears(3);
        CarrierHistoryDto secondCarrierHistories = new CarrierHistoryDto();
        secondCarrierHistories.setName("Anthem");
        secondCarrierHistories.setCurrent(true);
        secondCarrierHistories.setYears(3);
        carrierHistories.add(firstCarrierHistories);
        carrierHistories.add(secondCarrierHistories);
        one.setCarrierHistories(carrierHistories);
        one.setId(null);
        one.setProduct(VISION);
        one.setClientId(5L);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(asList(one), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, 5L)
            .then()
            .statusCode(CREATED.value());
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(CLIENT_CLIENT_ID_RFP_CATEGORY_CARRIER_HISTORY_ALL_PATH, 5L, VISION)
            .then()
            .statusCode(OK.value())
            .body(CARRIER_ID_BODY_PATH, hasSize(greaterThan(1)));
    }

    @Test(description = "GET /v1/client/{clientId}/rfp/{category}/carrierHistory/all/ Retrieve all carriers from the client. Not Found.")
    public void testRetrieveAllCarriersFromTheClientsRfpClientNotFound() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(CLIENT_CLIENT_ID_RFP_CATEGORY_CARRIER_HISTORY_ALL_PATH, DataConstants.NOT_FOUND_ID,
                DENTAL
            )
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/client/{clientId}/rfp/{category}/carrierHistory/all/ Retrieve all carriers from the client. Forbidden.")
    public void testRetrieveAllCarriersFromTheClientsRfpForbidden() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(CLIENT_CLIENT_ID_RFP_CATEGORY_CARRIER_HISTORY_ALL_PATH,
                DataConstants.FORBIDDEN_CLIENT_ID, DENTAL
            )
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "GET /v1/client/{clientId}/rfp/{category}/carrierHistory/all/ Retrieve all carriers from client's rfp. Rfp Not Found.")
    public void testRetrieveAllCarriersFromTheClientsRfpNotFound() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(CLIENT_CLIENT_ID_RFP_CATEGORY_CARRIER_HISTORY_ALL_PATH, getClientIdL(),
                DataConstants.INVALID_FORMAT
            )
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_RFP_FOUND));
    }

    @Test(description = "GET /v1/client/{clientId}/rfp/{category}/carrierHistory/all/ Retrieve all carriers from client's rfp. Unauthorized.")
    public void testRetrieveAllCarriersFromTheClientsRfpUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .get(CLIENT_CLIENT_ID_RFP_CATEGORY_CARRIER_HISTORY_ALL_PATH, getClientIdL(),
                DataConstants.INVALID_FORMAT
            )
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_UNAUTHORIZED));
    }

}
