package com.benrevo.core.itest.file;

import static com.benrevo.common.Constants.LTD;
import static com.benrevo.core.itest.util.DataConstants.FILE_TYPE;
import static com.benrevo.core.itest.util.DataConstants.INVALID_FORMAT;
import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_RFP_FILE_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_LONG_PARAMETER_ID_IS_NOT_PRESENT;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_RFP_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CLIENT_FILE_UPLOAD_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.RFP_ID_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_RFPS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.FILE_ID_INVALID_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.FILE_ID_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.PATH_FILE;
import static com.benrevo.core.itest.util.RequestPathConstants.RFPS_ID_FILES_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.RFP_ID_FILES_RFP_UPLOAD_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static io.restassured.mapper.ObjectMapperType.GSON;
import static java.util.Collections.singletonList;
import static java.util.stream.Stream.of;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.RfpDto;
import com.benrevo.core.AbstractBaseIt;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import org.testng.annotations.Test;


/**
 * The Get file test. Swagger https://devapi.benrevo.com/swagger-ui.html#!/file45controller/downloadUsingGET_1
 */
public class GetFileTest extends AbstractBaseIt {


    private String[] excludedFields =
        of("id", "options", "carrierHistories", "fileInfoList").toArray(String[]::new);

    @Test(description = "GET /v1/file Download file by file id.")
    public void testGetDownloadFileById() throws FileNotFoundException {

        RfpDto ltd = random(RfpDto.class, excludedFields);
        ltd.setProduct(LTD);
        ltd.setClientId(6L);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(ltd), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, 6)
            .then();
        String workingDir = System.getProperty("user.dir");
        String filePath = workingDir + PATH_FILE;
        File file = new File(filePath);
        FileInputStream fis = new FileInputStream(file);
        String fileName = file.getName();
        given().spec(baseSpec())
            .multiPart(FILE_TYPE, fileName, fis)
            .post(RFP_ID_FILES_RFP_UPLOAD_PATH, getClientRpf())
            .then();
        given().spec(baseSpec()).get(FILE_ID_PATH, 1).then().statusCode(OK.value());
    }

    @Test(description = "GET /v1/file Download file by file id. Not found.")
    public void testGetDownloadFileByIdNotFound() {

        given().spec(baseSpec())
            .get(FILE_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_RFP_FILE_FOUND));
    }

    @Test(description = "GET /v1/file Download file by file id. Unauthorized.")
    public void testGetDownloadFileByIdUnauthorized() {

        given().spec(unauthorizedSpec())
            .get(FILE_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "GET /v1/file Download file by file id. Invalid format.")
    public void testGetDownloadFileByIdInvalidFormat() {

        given().spec(baseSpec())
            .get(FILE_ID_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/file Download file by file id. Required Long parameter.")
    public void testGetDownloadFileByIdRequiredParameter() {

        given().spec(baseSpec())
            .get(FILE_ID_INVALID_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_LONG_PARAMETER_ID_IS_NOT_PRESENT));
    }

    @Test(description = "GET /v1/rfps/{id}/files Retrieving the rfp's files by rfp_id")
    public void testGetRetrievingRfpFilesByRfpId() {

        given().spec(baseSpec())
            .get(RFPS_ID_FILES_PATH, 1)
            .then()
            .statusCode(OK.value())
            .body(CLIENT_FILE_UPLOAD_ID_BODY_PATH, hasItem(1))
            .body(RFP_ID_BODY_PATH, hasItem(1));
    }

    @Test(description = "GET /v1/rfps/{id}/files Retrieving the rfp's files by rfp_id. Not found.")
    public void testGetRetrievingRfpFilesByRfpIdNotFound() {

        given().spec(baseSpec())
            .get(RFPS_ID_FILES_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_RFP_NOT_FOUND));
    }

    @Test(description = "GET /v1/rfps/{id}/files Retrieving the rfp's files by rfp_id. Invalid format.")
    public void testGetRetrievingRfpFilesByRfpIdInvalidFormat() {

        given().spec(baseSpec())
            .get(RFPS_ID_FILES_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/rfps/{id}/files Retrieving the rfp's files by rfp_id. Unauthorized.")
    public void testGetRetrievingRfpFilesByRfpIdUnauthorized() {

        given().spec(unauthorizedSpec())
            .get(RFPS_ID_FILES_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }
}
