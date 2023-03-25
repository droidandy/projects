package com.benrevo.core.itest.rfp;

import static com.benrevo.core.itest.util.DataConstants.FORBIDDEN_CLIENT_ID;
import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CLIENT_FIRST_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.COMMENTS_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_ID_RFPS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.RFPS_ID_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static io.restassured.mapper.ObjectMapperType.GSON;
import static java.util.Collections.singletonList;
import static java.util.stream.Stream.of;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.CarrierHistoryDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.core.AbstractBaseIt;
import java.util.ArrayList;
import java.util.List;
import org.testng.annotations.Test;


/**
 * The Update rfp api test. Swagger https://devapi.benrevo.com/swagger-ui.html#!/rfp-controller/updateRFPUsingPUT
 */
public class UpdateRfpApiTest extends AbstractBaseIt {

    private String[] excludedFields =
        of("id", "options", "carrierHistories", "fileInfoList").toArray(String[]::new);

    @Test(description = "PUT /v1/clients/{id}/rfps Updating a rfp by rfp_id.", enabled = false)
    public void testUpdatingRfpByRfpId() {

        RfpDto updateRfp =
            given().spec(baseSpec()).get(RFPS_ID_PATH, 6).then().extract().as(RfpDto.class);
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
        updateRfp.setCarrierHistories(carrierHistories);
        String newComments = random(String.class);
        updateRfp.setComments(newComments);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(updateRfp), GSON)
            .put(CLIENTS_ID_RFPS_PATH, 6)
            .then()
            .statusCode(OK.value())
            .body(COMMENTS_BODY_PATH, hasItem(newComments), CLIENT_FIRST_ID_BODY_PATH, equalTo(6));
    }

    @Test(description = "PUT /v1/clients/{id}/rfps Updating a rfp by rfp_id. Not Found.")
    public void testNotFoundUpdatingRfpByRfpId() {
        RfpDto newCommission = random(RfpDto.class, excludedFields);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(newCommission), GSON)
            .put(CLIENTS_ID_RFPS_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "PUT /v1/clients/{id}/rfps Updating a rfp by rfp_id. Empty Body.")
    public void testUpdatingRfpByRfpIdEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(CLIENTS_ID_RFPS_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "PUT /v1/clients/{id}/rfps Updating a rfp empty forbidden. Forbidden.")
    public void testUpdatingRfpByRfpIdForbidden() {
        RfpDto updateRfp = random(RfpDto.class, excludedFields);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(updateRfp))
            .put(CLIENTS_ID_RFPS_PATH, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FORBIDDEN));
    }

    @Test(description = "PUT /v1/clients/{id}/rfps Updating a rfp empty forbidden. Unauthorized.")
    public void testUpdatingRfpByRfpIdUnauthorized() {
        RfpDto updateRfp = random(RfpDto.class, excludedFields);

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(singletonList(updateRfp))
            .put(CLIENTS_ID_RFPS_PATH, FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

}
