package com.benrevo.core.itest.file;

import static com.benrevo.common.Constants.VISION;
import static com.benrevo.core.itest.util.DataConstants.FILE_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_RFP_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.NAME_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_RFPS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.PATH_FILE;
import static com.benrevo.core.itest.util.RequestPathConstants.RFP_ID_FILES_RFP_UPLOAD_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static io.restassured.mapper.ObjectMapperType.GSON;
import static java.util.Collections.singletonList;
import static java.util.stream.Stream.of;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.RfpDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import org.testng.annotations.Test;


/**
 * The  Upload file api test. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/file-controller/fileUploadUsingPOST_1
 */
public class UploadFileTest extends AbstractBaseIt {

    private String[] excludedFields =
        of("id", "options", "carrierHistories", "fileInfoList").toArray(String[]::new);

    @Test(description = "POST /v1/rfp/{id}/files/{section}/upload Uploading file as multipart/form-data")
    public void testUploadingFileAsMultipartFormData() throws FileNotFoundException {

        RfpDto medical = random(RfpDto.class, excludedFields);
        medical.setProduct(VISION);
        medical.setClientId(6L);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(medical), GSON)
            .post(CLIENTS_CLIENT_ID_RFPS_PATH, 6)
            .then()
            .statusCode(CREATED.value());
        String workingDir = System.getProperty("user.dir");
        String filePath = workingDir + PATH_FILE;
        File file = new File(filePath);
        FileInputStream fis = new FileInputStream(file);
        String fileName = file.getName();
        given().spec(baseSpec())
            .multiPart(FILE_TYPE, fileName, fis)
            .post(RFP_ID_FILES_RFP_UPLOAD_PATH, getClientRpf())
            .then()
            .statusCode(OK.value())
            .body(NAME_BODY_PATH, is(fileName));
    }

    @Test(description = "POST /v1/rfp/{id}/files/{section}/upload Uploading file as multipart/form-data. Unauthorized.")
    public void testUploadingFileAsMultipartFormDataUnauthorized() throws FileNotFoundException {
        String workingDir = System.getProperty("user.dir");
        String filePath = workingDir + PATH_FILE;
        File file = new File(filePath);
        FileInputStream fis = new FileInputStream(file);
        String fileName = file.getName();
        given().spec(unauthorizedSpec())
            .multiPart(FILE_TYPE, fileName, fis)
            .post(RFP_ID_FILES_RFP_UPLOAD_PATH, getClientRpf())
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "POST /v1/rfp/{id}/files/{section}/upload Uploading file as multipart/form-data. Not Found.")
    public void testUploadingFileAsMultipartFormDataNotFound() throws FileNotFoundException {
        String workingDir = System.getProperty("user.dir");
        String filePath = workingDir + PATH_FILE;
        File file = new File(filePath);
        FileInputStream fis = new FileInputStream(file);
        String fileName = file.getName();
        given().spec(baseSpec())
            .multiPart(FILE_TYPE, fileName, fis)
            .post(RFP_ID_FILES_RFP_UPLOAD_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_RFP_NOT_FOUND));
    }

    @Test(description = "POST /v1/rfp/{id}/files/{section}/upload Uploading file as multipart/form-data.Invalid Format.")
    public void testUploadingFileAsMultipartFormDataInvalidFormat() throws FileNotFoundException {
        String workingDir = System.getProperty("user.dir");
        String filePath = workingDir + PATH_FILE;
        File file = new File(filePath);
        FileInputStream fis = new FileInputStream(file);
        String fileName = file.getName();
        given().spec(baseSpec())
            .multiPart(FILE_TYPE, fileName, fis)
            .post(RFP_ID_FILES_RFP_UPLOAD_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }


}
