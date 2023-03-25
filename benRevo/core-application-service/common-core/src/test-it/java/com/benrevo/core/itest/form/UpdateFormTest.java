package com.benrevo.core.itest.form;


import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.NAME_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PATH_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.FORMS_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static java.util.Collections.singletonList;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.CreateFormDto;
import com.benrevo.common.dto.FormDto;
import com.benrevo.common.dto.ShortQuestionDto;
import com.benrevo.common.dto.UpdateFormDto;
import com.benrevo.core.AbstractBaseIt;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;


/**
 * The  Update form test. See swagger https://devapi.benrevo.com/swagger-ui.html#/form-controller
 */
public class UpdateFormTest extends AbstractBaseIt {

    private List<Long> ids = new ArrayList<>();
    private String name;
    private UpdateFormDto updateFormDto;

    @BeforeClass
    public void setUp() {
        CreateFormDto createFormDto = new CreateFormDto();
        createFormDto.setCarrierId(1L);
        createFormDto.setName("GetFormTest");
        ShortQuestionDto shortQuestionDto = new ShortQuestionDto();
        shortQuestionDto.setQuestionId(10L);
        shortQuestionDto.setRequired(true);
        createFormDto.setQuestions(singletonList(shortQuestionDto));
        FormDto[] formDto = given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(createFormDto))
            .post(FORMS_PATH)
            .then()
            .extract()
            .as(FormDto[].class);
        List<FormDto> formDtoList = Arrays.asList(formDto);
        Long formId = formDtoList.get(0).getFormId();
        ids.add(formId);
        updateFormDto = new UpdateFormDto();
        updateFormDto.setFormId(formId);
        name = random(String.class);
        updateFormDto.setName(name);
        updateFormDto.setCarrierId(1L);
        updateFormDto.setQuestions(singletonList(shortQuestionDto));
    }

    @Test(description = "PUT /v1/forms Updating the forms")
    public void testUpdatingTheForms() {
        given().spec(baseSpec())
            .contentType(JSON)
            .body(Collections.singleton(updateFormDto))
            .put(FORMS_PATH)
            .then()
            .body(NAME_FIRST_BODY_PATH, is(name));
    }

    @Test(description = "PUT /v1/forms Updating the forms")
    public void testUpdatingTheFormsEmpty() {
        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(FORMS_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "PUT /v1/forms Updating the forms. Unauthorized.")
    public void testUpdatingTheFormsEmptyUnauthorized() {
        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(FORMS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED))
            .body(PATH_BODY_PATH, containsString(FORMS_PATH));
    }

}
