package com.benrevo.core.itest.form;


import static com.benrevo.core.itest.util.DataConstants.INVALID_FORMAT;
import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_FORM_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.FORM_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.NAME_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PATH_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.FORMS_ID_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.FORMS_PATH;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.FormDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.RequestPathConstants;
import io.restassured.http.ContentType;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;


/**
 * The type Get form test. See swagger https://devapi.benrevo.com/swagger-ui.html#/form-controller
 */
public class GetFormTest extends AbstractBaseIt {

    private static final int GET_FIRST_INDEX = 0;
    private List<Long> ids = new ArrayList<>();
    private List<FormDto> formDtoList;

    @BeforeClass
    public void setUp() {
        final String createFormDto =
            "[ { \"carrierId\": 10, \"name\": \"GetFormTest\", \"questions\": [ { \"questionId\":10, \"required\": true } ] } ]";

        FormDto[] formDto = given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(createFormDto)
            .post(FORMS_PATH)
            .then()
            .extract()
            .as(FormDto[].class);
        formDtoList = Arrays.asList(formDto);
        ids.add(formDtoList.get(GET_FIRST_INDEX).getFormId());

    }

    @Test(description = "GET /v1/forms/{id} Retrieving a form by form id")
    public void testRetrievingFormByFormId() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(FORMS_ID_PATH, ids.get(GET_FIRST_INDEX))
            .then()
            .body(FORM_ID_BODY_PATH, is(formDtoList.get(GET_FIRST_INDEX).getFormId().intValue()),
                NAME_BODY_PATH, is(formDtoList.get(GET_FIRST_INDEX).getName())
            );
    }

    @Test(description = "GET /v1/forms/{id} Retrieving a form by form id. Not Found.")
    public void testRetrievingFormByFormInvalidId() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(FORMS_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_FORM_FOUND));
    }

    @Test(description = "GET /v1/forms/{id} Retrieving a form by form id. Invalid Format.")
    public void testRetrievingFormByFormInvalidFormat() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .get(FORMS_ID_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/forms/{id} Retrieving a form by form id. Unauthorized.")
    public void testRetrievingFormByFormInvalidIdUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .get(FORMS_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED))
            .body(PATH_BODY_PATH, containsString(RequestPathConstants.FORMS_PATH));
    }
}
