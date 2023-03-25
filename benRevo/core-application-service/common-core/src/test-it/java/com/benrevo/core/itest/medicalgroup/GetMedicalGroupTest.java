package com.benrevo.core.itest.medicalgroup;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.NETWORKS_NETWORK_ID_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PATH_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.MEDICAL_GROUPS_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.core.AbstractBaseIt;
import org.testng.annotations.Test;


public class GetMedicalGroupTest extends AbstractBaseIt {


    // TODO/FIXME: need to rework this to not use hard-coded UHC carrier...
    @Test(description = "GET /v1/medical-groups Retrieving all medical groups", enabled = false)
    public void testRetrievingAllMedicalGroups() {
        given().spec(baseSpec())
            .contentType(JSON)
            .get(MEDICAL_GROUPS_PATH)
            .then()
            .statusCode(OK.value())
            .body(NETWORKS_NETWORK_ID_FIRST_BODY_PATH, hasItem(25));

    }

    @Test(description = "GET /v1/medical-groups Retrieving all medical groups. Unauthorized.")
    public void testRetrievingAllMedicalGroupsUnauthorized() {
        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(MEDICAL_GROUPS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED))
            .body(PATH_BODY_PATH, containsString(MEDICAL_GROUPS_PATH));

    }
}
