package com.benrevo.core.itest.rfp;


import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.LIFE;
import static com.benrevo.common.Constants.LTD;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.STD;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CANNOT_CREATE_RFP_AS_DUPLICATE_RFP_WITH_PROVIDED_PRODUCT_TYPE_EXISTS;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PRODUCT_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.RFP_SUBMITTED_FIRST_SUCCESSFULLY_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_RFPS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_RFPS_SUBMIT_RFP_IDS_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static io.restassured.mapper.ObjectMapperType.GSON;
import static java.util.Collections.singletonList;
import static java.util.stream.Stream.of;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.CarrierHistoryDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import com.benrevo.core.itest.util.ErrorMessageConstants;
import java.util.ArrayList;
import java.util.List;
import org.testng.annotations.Test;


/**
 * Basic test suite for RFPs. See swagger https://devapi.benrevo.com/swagger-ui.html#/rfp-controller
 * RestAssured: https://github.com/rest-assured/rest-assured/wiki/GettingStarted#jsonpath
 */
public class CreateRfpApiTests extends AbstractBaseIt {

    private String[] excludedFields =
        of("id", "options", "carrierHistories", "fileInfoList").toArray(String[]::new);

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. STD Duplicate")
    public void testCreatingArrayOfRfpsStdDuplicate() {
        RfpDto std = random(RfpDto.class, excludedFields);
        std.setProduct(STD);
        std.setClientId(getClientIdL());
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(std), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH,
                is(ERROR_CANNOT_CREATE_RFP_AS_DUPLICATE_RFP_WITH_PROVIDED_PRODUCT_TYPE_EXISTS)
            );
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. LIFE Duplicate")
    public void testCreatingArrayOfRfpsLifeDuplicate() {
        RfpDto life = random(RfpDto.class, excludedFields);
        life.setProduct(LIFE);
        life.setClientId(getClientIdL());
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(life), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH,
                is(ERROR_CANNOT_CREATE_RFP_AS_DUPLICATE_RFP_WITH_PROVIDED_PRODUCT_TYPE_EXISTS)
            );
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. LTD Duplicate")
    public void testCreatingArrayOfRfpsLtdDuplicate() {
        RfpDto ltd = random(RfpDto.class, excludedFields);
        ltd.setProduct(LTD);
        ltd.setClientId(getClientIdL());
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(ltd), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH,
                is(ERROR_CANNOT_CREATE_RFP_AS_DUPLICATE_RFP_WITH_PROVIDED_PRODUCT_TYPE_EXISTS)
            );
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. Std")
    public void testCreatingArrayOfRfpsStd() {
        Long clientId = getNewClientIdL();
        RfpDto std = random(RfpDto.class, excludedFields);
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
        std.setCarrierHistories(carrierHistories);
        std.setProduct(STD);
        std.setClientId(clientId);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(std), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, clientId)
            .then()
            .statusCode(CREATED.value())
            .body(PRODUCT_BODY_PATH, hasItems(STD));
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. Unauthorized")
    public void testCreatingArrayOfRfpsUnauthorized() {

        RfpDto dental = random(RfpDto.class, excludedFields);
        dental.setProduct(STD);
        dental.setClientId(getClientIdL());

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(singletonList(dental), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, getClientIdL())
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. Empty Body")
    public void testCreatingArrayOfRfpsEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. Life")
    public void testCreatingArrayOfRfpsLife() {
        Long clientId = getNewClientIdL();
        RfpDto life = random(RfpDto.class, excludedFields);
        life.setProduct(LIFE);
        life.setClientId(clientId);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(life), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, clientId)
            .then()
            .statusCode(CREATED.value())
            .body(PRODUCT_BODY_PATH, hasItems(LIFE));
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. Ltd")
    public void testCreatingArrayOfRfpsLtd() {
        Long clientId = getNewClientIdL();
        RfpDto ltd = random(RfpDto.class, excludedFields);
        ltd.setProduct(LTD);
        ltd.setClientId(clientId);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(ltd), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, clientId)
            .then()
            .statusCode(CREATED.value())
            .body(PRODUCT_BODY_PATH, hasItems(LTD));
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. Dental")
    public void testCreatingArrayOfRfpsDental() {
        Long clientId = getNewClientIdL();
        RfpDto dental = random(RfpDto.class, excludedFields);
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
        dental.setCarrierHistories(carrierHistories);
        dental.setProduct(DENTAL);
        dental.setClientId(clientId);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(dental), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, clientId)
            .then()
            .statusCode(CREATED.value())
            .body(PRODUCT_BODY_PATH, hasItems(DENTAL));
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. Medical")
    public void testCreatingArrayOfRfpsMedical() {
        Long clientId = getNewClientIdL();
        RfpDto medical = random(RfpDto.class, excludedFields);
        medical.setProduct(MEDICAL);
        medical.setClientId(clientId);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(medical), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, clientId)
            .then()
            .statusCode(CREATED.value())
            .body(PRODUCT_BODY_PATH, hasItems(MEDICAL));
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. Vision")
    public void testCreatingArrayOfRfpsVision() {
        Long clientId = getNewClientIdL();
        RfpDto vision = random(RfpDto.class, excludedFields);
        vision.setProduct(VISION);
        vision.setClientId(clientId);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(vision), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, clientId)
            .then()
            .statusCode(CREATED.value())
            .body(PRODUCT_BODY_PATH, hasItems(VISION));
    }

    @Test(description = "POST /v1/clients/{id}/rfps/submit Client's RFPs submission",
        enabled = false)
    public void testClientRfpSubmission() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_ID_RFPS_SUBMIT_RFP_IDS_PATH, getClientIdL(), getClientRpf())
            .then()
            .body(RFP_SUBMITTED_FIRST_SUCCESSFULLY_BODY_PATH, is(true));
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps Medical. Duplicate")
    public void testCreatingArrayOfRfpsMedicalDuplicate() {
        RfpDto medicalDuplicate = random(RfpDto.class, excludedFields);
        medicalDuplicate.setProduct(MEDICAL);
        medicalDuplicate.setClientId(getClientIdL());
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(medicalDuplicate), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH,
                is(ERROR_CANNOT_CREATE_RFP_AS_DUPLICATE_RFP_WITH_PROVIDED_PRODUCT_TYPE_EXISTS)
            )

        ;
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps.")
    public void testCreatingArrayOfRfpsInvalidProduct() {
        RfpDto invalidProduct = random(RfpDto.class, excludedFields);
        invalidProduct.setProduct(DataConstants.INVALID_FORMAT);
        invalidProduct.setClientId(getClientIdL());
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(invalidProduct), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, getClientIdL())
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, is(ErrorMessageConstants.ERROR_INVALID_PRODUCT_TYPE_PROVIDED));
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. Not found")
    public void testCreatingArrayOfRfpsInvalidProductNotFound() {
        RfpDto invalidProduct = random(RfpDto.class, excludedFields);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(invalidProduct), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "POST /v1/clients/{id}/rfps Creating an array of rfps. Forbidden")
    public void testCreatingArrayOfRfpsInvalidProductForbidden() {
        RfpDto invalidProduct = random(RfpDto.class, excludedFields);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(invalidProduct), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "POST /v1/clients/{id}/rfps/submit Client's RFPs submission. Not found client id")
    public void testClientRfpSubmissionNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_ID_RFPS_SUBMIT_RFP_IDS_PATH, DataConstants.NOT_FOUND_ID, getClientRpf())
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "POST /v1/clients/{id}/rfps/submit Client's RFPs submission. Forbidden")
    public void testClientRfpSubmissionForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_ID_RFPS_SUBMIT_RFP_IDS_PATH, DataConstants.FORBIDDEN_CLIENT_ID,
                getClientRpf()
            )
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "POST /v1/clients/{id}/rfps/submit Client's RFPs submission. Invalid format")
    public void testClientRfpSubmissionInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(CLIENTS_ID_RFPS_SUBMIT_RFP_IDS_PATH, DataConstants.INVALID_FORMAT, getClientRpf())
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

}
