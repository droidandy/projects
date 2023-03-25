package com.benrevo.core.itest.rfp;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.LIFE;
import static com.benrevo.common.Constants.LTD;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.STD;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.core.itest.util.DataConstants.FORBIDDEN_CLIENT_ID;
import static com.benrevo.core.itest.util.DataConstants.INVALID_FORMAT;
import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_RFP_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CLIENT_FIRST_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PRODUCT_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_RFPS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_RFPS_ALL_DOCX_RFP_IDS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_RFPS_ALL_PDF_RFP_IDS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_RFPS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_RFPS_TYPE_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_RFPS_TYPE_PDF_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_RFP_STATUS_RFP_IDS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.RFPS_CENSUS_CLIENT_ID_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.RFPS_COUNTY_LIST_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.RFPS_ID_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.ANY;
import static io.restassured.http.ContentType.JSON;
import static io.restassured.mapper.ObjectMapperType.GSON;
import static java.util.Collections.singletonList;
import static java.util.stream.Stream.of;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.Matchers.hasItems;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.RfpDto;
import com.benrevo.core.AbstractBaseIt;
import org.hamcrest.CoreMatchers;
import org.testng.annotations.Test;


/**
 * The type Get rrp api test. Swagger - https://devapi.benrevo.com/swagger-ui.html#/rfp-controller
 */
public class GetRfpApiTest extends AbstractBaseIt {

    String[] excludedFields =
        of("id", "options", "carrierHistories", "fileInfoList").toArray(String[]::new);
    private Long localClientId = 4L;

    @Test(description = "GET /v1/clients/{id}/rfp/status Client's RFPs submission status", enabled = false)
    public void testClientRfpSubmissionStatus() {

        RfpDto vision = random(RfpDto.class, excludedFields);
        vision.setProduct(VISION);
        vision.setClientId(localClientId);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(vision), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, localClientId)
            .then()
            .statusCode(CREATED.value());
        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFP_STATUS_RFP_IDS_PATH, getClientIdL(), getClientRpf())
            .then()
            .statusCode(OK.value());

    }

    @Test(description = "GET /v1/clients/{id}/rfp/status Client's RFPs submission status not found client id")
    public void testClientRfpSubmissionStatusNoFoundClientId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFP_STATUS_RFP_IDS_PATH, NOT_FOUND_ID, getClientRpf())
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));

    }

    @Test(description = "GET /v1/clients/{id}/rfp/status Client's RFPs submission status invalid format")
    public void testClientRfpSubmissionStatusInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFP_STATUS_RFP_IDS_PATH, getClientIdL(), INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));

    }

    @Test(description = "GET /v1/clients/{id}/rfp/status Client's RFPs submission status. Forbidden")
    public void testClientRfpSubmissionStatusForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFP_STATUS_RFP_IDS_PATH, FORBIDDEN_CLIENT_ID, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));

    }

    @Test(description = "GET /v1/clients/{id}/rfp/status Client's RFPs submission status. Unauthorized")
    public void testClientRfpSubmissionStatusUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFP_STATUS_RFP_IDS_PATH, FORBIDDEN_CLIENT_ID, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));

    }

    @Test(description = "GET /v1/clients/{id}/rfps Retrieving a rfp for client by clientId")
    public void testRetrievingRfpForClientByClientId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_PATH, localClientId)
            .then()
            .statusCode(OK.value())
            .body(CLIENT_FIRST_ID_BODY_PATH, is(localClientId.intValue()));
    }

    @Test(description = "GET /v1/clients/{id}/rfps Retrieving a rfp for client by not found clientId")
    public void testRetrievingRfpForClientByClientIdNotFound() {
        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/clients/{id}/rfps Retrieving a rfp for client by not found forbidden")
    public void testRetrievingRfpForClientByClientIdForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_PATH, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "GET /v1/clients/{id}/rfps Retrieving a rfp for client by invalid format")
    public void testRetrievingRfpForClientByClientIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/clients/{id}/rfps Retrieving a rfp for client by. Unauthorized.")
    public void testRetrievingRfpForClientByClientIdUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_PATH, INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/all/docx/ Generates an RFP submission DOCX preview for all rfp types")
    public void testGeneratesRfpSubmissionDocxPreviewForAllRfpTypes() {

        given().spec(baseSpec())
            .contentType(ANY)
            .get(CLIENTS_ID_RFPS_ALL_DOCX_RFP_IDS_PATH, getClientIdL(), getClientRpf())
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/clients/{id}/rfps/all/docx/ Generates an RFP submission DOCX preview for all rfp types invalid format")
    public void testGeneratesRfpSubmissionDocxPreviewForAllRfpTypesInvalidFormat() {

        given().spec(baseSpec())
            .contentType(ANY)
            .get(CLIENTS_ID_RFPS_ALL_DOCX_RFP_IDS_PATH, getClientIdL(), INVALID_FORMAT)
            .then()
            .statusCode(NOT_ACCEPTABLE.value());
    }

    @Test(description = "GET /v1/clients/{id}/rfps/all/docx/ Generates an RFP submission DOCX preview for all rfp types. Unauthorized")
    public void testGeneratesRfpSubmissionDocxPreviewForAllRfpUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ANY)
            .get(CLIENTS_ID_RFPS_ALL_DOCX_RFP_IDS_PATH, getClientIdL(), NOT_FOUND_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/all/pdf/ Generates an RFP submission PDF preview for all rfp type",
        enabled = false)
    public void testGeneratesRfpSubmissionPdfPreviewForAllRfpTypes() {

        given().spec(baseSpec())
            .contentType(ANY)
            .get(CLIENTS_ID_RFPS_ALL_PDF_RFP_IDS_PATH, getClientIdL(), getClientRpf())
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/clients/{id}/rfps/all/pdf/ Generates an RFP submission PDF preview for all rfp type invalid format")
    public void testGeneratesRfpSubmissionPdfPreviewForAllRfpTypesInvalidFormat() {

        given().spec(baseSpec())
            .contentType(ANY)
            .get(CLIENTS_ID_RFPS_ALL_PDF_RFP_IDS_PATH, getClientIdL(), INVALID_FORMAT)
            .then()
            .statusCode(NOT_ACCEPTABLE.value());
    }

    @Test(description = "GET /v1/clients/{id}/rfps/all/pdf/ Generates an RFP submission PDF preview for all rfp type Unauthorized")
    public void testGeneratesRfpSubmissionPdfPreviewForAllRfpTypesUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ANY)
            .get(CLIENTS_ID_RFPS_ALL_PDF_RFP_IDS_PATH, getClientIdL(), INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type} Retrieving a rfp for client by type Medical")
    public void testRetrievingRfpForClientByTypeMedical() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PATH, localClientId, MEDICAL)
            .then()
            .statusCode(OK.value())
            .body(PRODUCT_BODY_PATH, is(MEDICAL));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type} Retrieving a rfp for client by type Dental")
    public void testRetrievingRfpForClientByTypeDental() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PATH, localClientId, DENTAL)
            .then()
            .statusCode(OK.value())
            .body(PRODUCT_BODY_PATH, is(DENTAL));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type} Retrieving a rfp for client by type LIFE")
    public void testRetrievingRfpForClientByTypeLIfe() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PATH, localClientId, LIFE)
            .then()
            .statusCode(OK.value())
            .body(PRODUCT_BODY_PATH, is(LIFE));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type} Retrieving a rfp for client by type STD")
    public void testRetrievingRfpForClientByTypeStd() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PATH, localClientId, STD)
            .then()
            .statusCode(OK.value())
            .body(PRODUCT_BODY_PATH, is(STD));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type} Retrieving a rfp for client by type LTD")
    public void testRetrievingRfpForClientByTypeLtd() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PATH, localClientId, LTD)
            .then()
            .statusCode(OK.value())
            .body(PRODUCT_BODY_PATH, is(LTD));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type} Retrieving a rfp for client by type Vision", enabled=false)
    public void testRetrievingRfpForClientByTypeVision() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PATH, localClientId, VISION)
            .then()
            .statusCode(OK.value())
            .body(PRODUCT_BODY_PATH, is(VISION));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type} Retrieving a rfp for client by type Unauthorized")
    public void testRetrievingRfpForClientByTypeUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PATH, getClientIdL(), VISION)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type} Retrieving a rfp for client by invalid type")
    public void testRetrievingRfpForClientByTypeVisionInvalidType() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PATH, getClientIdL(), INVALID_FORMAT)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_RFP_NOT_FOUND));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type} Retrieving a rfp client not found")
    public void testRetrievingRfpForClientByTypeClientNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PATH, NOT_FOUND_ID, VISION)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type} Retrieving a rfp client forbidden")
    public void testRetrievingRfpForClientByTypeClientForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PATH, FORBIDDEN_CLIENT_ID, VISION)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type} Retrieving a rfp client invalid format")
    public void testRetrievingRfpForClientByTypeClientInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PATH, INVALID_FORMAT, VISION)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type}/pdf/ Generates an RFP submission PDF preview Medical")
    public void testGeneratesRfpSubmissionPdfPreviewMedical() {
        RfpDto medical = random(RfpDto.class, excludedFields);
        medical.setProduct(MEDICAL);
        medical.setClientId(localClientId);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(medical), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, localClientId)
            .then()
            .statusCode(CREATED.value());
        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PDF_PATH, localClientId, MEDICAL)
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type}/pdf/ Generates an RFP submission PDF preview Dental")
    public void testGeneratesRfpSubmissionPdfPreviewDental() {
        RfpDto medical = random(RfpDto.class, excludedFields);
        medical.setProduct(DENTAL);
        medical.setClientId(localClientId);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(medical), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, localClientId)
            .then()
            .statusCode(CREATED.value());
        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PDF_PATH, localClientId, DENTAL)
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type}/pdf/ Generates an RFP submission PDF preview Vision", enabled=false)
    public void testGeneratesRfpSubmissionPdfPreviewVision() {
        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PDF_PATH, localClientId, VISION)
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type}/pdf/ Generates an RFP submission PDF preview Life")
    public void testGeneratesRfpSubmissionPdfPreviewLife() {

        RfpDto life = random(RfpDto.class, excludedFields);
        life.setProduct(LIFE);
        life.setClientId(localClientId);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(life), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, localClientId)
            .then()
            .statusCode(CREATED.value());
        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PDF_PATH, localClientId, LIFE)
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type}/pdf/ Generates an RFP submission PDF preview Ltd")
    public void testGeneratesRfpSubmissionPdfPreviewLtd() {

        RfpDto ltd = random(RfpDto.class, excludedFields);
        ltd.setProduct(LTD);
        ltd.setClientId(localClientId);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(ltd), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, localClientId)
            .then()
            .statusCode(CREATED.value());
        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PDF_PATH, localClientId, LTD)
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type}/pdf/ Generates an RFP submission PDF preview Std")
    public void testGeneratesRfpSubmissionPdfPreviewStd() {

        RfpDto std = random(RfpDto.class, excludedFields);
        std.setProduct(STD);
        std.setClientId(localClientId);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(std), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, localClientId)
            .then()
            .statusCode(CREATED.value());
        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PDF_PATH, localClientId, STD)
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type}/pdf/ Generates an RFP submission PDF preview Unauthorized")
    public void testGeneratesRfpSubmissionPdfPreviewUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PDF_PATH, getClientIdL(), STD)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "GET /v1/clients/{id}/rfps/{type}/pdf/ Generates an RFP submission PDF preview Vision")
    public void testGeneratesRfpSubmissionPdfPreviewVisionInvalidType() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(CLIENTS_ID_RFPS_TYPE_PDF_PATH, getClientIdL(), INVALID_FORMAT)
            .then()
            .statusCode(NOT_ACCEPTABLE.value());
    }

    @Test(description = "GET /v1/rfps/census Get census info dto", enabled = false)
    public void testGetCensusInfoDto() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RFPS_CENSUS_CLIENT_ID_PATH, getClientIdL())
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/rfps/census Get census info dto not found")
    public void testGetCensusInfoDtoNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RFPS_CENSUS_CLIENT_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/rfps/census Get census info dto forbidden")
    public void testGetCensusInfoDtoForbidden() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RFPS_CENSUS_CLIENT_ID_PATH, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "GET /v1/rfps/census Get census info dto Invalid format")
    public void testGetCensusInfoDtoInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RFPS_CENSUS_CLIENT_ID_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/rfps/census Get census info dto Unauthorized")
    public void testGetCensusInfoDtoUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(RFPS_CENSUS_CLIENT_ID_PATH, INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    // FIXME
    @Test(description = "GET /v1/rfps/countyList Get available county list", enabled=false)
    public void testGetAvailableCountyList() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RFPS_COUNTY_LIST_PATH)
            .then()
            .statusCode(OK.value())
            .body("", hasItems("ALAMEDA", "CONTRA COSTA", "SOLANO"));

    }

    @Test(description = "GET /v1/rfps/{id} Retrieving a rfp by rfp_id")
    public void testRetrievingRfpByRfpIid() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RFPS_ID_PATH, getClientRpf())
            .then()
            .statusCode(OK.value())
            .body(ID_BODY_PATH, is(CoreMatchers.notNullValue()));
    }

    @Test(description = "GET /v1/rfps/{id} Retrieving a rfp by rfp_id not found")
    public void testRetrievingRfpByRfpIidNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RFPS_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_RFP_NOT_FOUND))

        ;
    }

    @Test(description = "GET /v1/rfps/{id} Retrieving a rfp by rfp_id invalid format")
    public void testRetrievingRfpByRfpIidInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(RFPS_ID_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE))

        ;
    }

    @Test(description = "GET /v1/rfps/{id} Retrieving a rfp by rfp_id Unauthorized")
    public void testRetrievingRfpByRfpIidInvalidFormatUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(RFPS_ID_PATH, INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED))

        ;
    }
}
