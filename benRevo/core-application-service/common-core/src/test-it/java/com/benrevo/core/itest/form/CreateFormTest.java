package com.benrevo.core.itest.form;


import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_ENTITY_IS_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_MAY_NOT_BE_NULL;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.FORM_FIRST_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PATH_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.FORMS_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static java.util.Collections.singletonList;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.CreateFormDto;
import com.benrevo.common.dto.ShortQuestionDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.testng.annotations.Test;


/**
 * The Create form test. See swagger https://devapi.benrevo.com/swagger-ui.html#/form-controller
 */
public class CreateFormTest extends AbstractBaseIt {


    private CreateFormDto createFormDto = new CreateFormDto();
    private List<Long> ids = new ArrayList<>();

    @Test(description = "POST /v1/forms Creating an array of forms")
    public void testCreatingAnArrayOfForms() {
        createFormDto = new CreateFormDto();
        createFormDto.setCarrierId(1L);
        createFormDto.setName("GetFormTest");
        ShortQuestionDto shortQuestionDto = new ShortQuestionDto();
        shortQuestionDto.setQuestionId(10L);
        shortQuestionDto.setRequired(true);
        createFormDto.setQuestions(singletonList(shortQuestionDto));

        String formId = given().spec(baseSpec())
            .contentType(JSON)
            .body(Collections.singleton(createFormDto))
            .post(FORMS_PATH)
            .then()
            .statusCode(CREATED.value())
            .extract()
            .path(FORM_FIRST_ID_BODY_PATH)
            .toString();

        ids.add(Long.valueOf(formId));

    }

    @Test(description = "POST /v1/forms Creating an array of forms. Entity not found.")
    public void testCreatingAnArrayOfFormsEntityNotFound() {
        createFormDto.setCarrierId(DataConstants.NOT_FOUND_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(Collections.singleton(createFormDto))
            .post(FORMS_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_ENTITY_IS_NOT_FOUND));

    }

    @Test(description = "POST /v1/forms Creating an array of forms. Questions Null.")
    public void testCreatingAnArrayOfFormsQuestionsNull() {
        createFormDto.setQuestions(null);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(Collections.singleton(createFormDto))
            .post(FORMS_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, containsString(ERROR_MAY_NOT_BE_NULL));

    }

    @Test(description = "POST /v1/forms Creating an array of forms")
    public void testCreatingAnArrayOfFormsEmpty() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .post(FORMS_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));

    }

    @Test(description = "POST /v1/forms Creating an array of forms. Unauthorized.")
    public void testCreatingAnArrayOfFormsUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(EMPTY)
            .post(FORMS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED))
            .body(PATH_BODY_PATH, containsString(FORMS_PATH));

    }

}
