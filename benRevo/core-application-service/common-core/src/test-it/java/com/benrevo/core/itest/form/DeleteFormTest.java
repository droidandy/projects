package com.benrevo.core.itest.form;

import static com.benrevo.core.itest.util.DataConstants.JSON_EMPTY_OBJECT;
import static com.benrevo.core.itest.util.DataConstants.THE_FORMS_WERE_SUCCESSFULLY_DELETED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_JSON_PARSE_ERROR;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.FORM_FIRST_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PATH_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.FORMS_PATH;
import static io.restassured.RestAssured.given;
import static java.util.Collections.singleton;
import static java.util.Collections.singletonList;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.CreateFormDto;
import com.benrevo.common.dto.ShortQuestionDto;
import com.benrevo.core.AbstractBaseIt;
import io.restassured.http.ContentType;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;


/**
 * The  Delete form test. See swagger https://devapi.benrevo.com/swagger-ui.html#/form-controller
 */
public class DeleteFormTest extends AbstractBaseIt {


    private List<Long> ids = new ArrayList<>();

    @BeforeClass
    public void setUp() {
        CreateFormDto createFormDto = new CreateFormDto();
        createFormDto.setCarrierId(1L);
        createFormDto.setName("GetFormTest");
        ShortQuestionDto shortQuestionDto = new ShortQuestionDto();
        shortQuestionDto.setQuestionId(10L);
        shortQuestionDto.setRequired(true);
        createFormDto.setQuestions(singletonList(shortQuestionDto));
        String formId = given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(singleton(createFormDto))
            .post(FORMS_PATH)
            .then()
            .extract()
            .path(FORM_FIRST_ID_BODY_PATH)
            .toString();
        ids.add(Long.valueOf(formId));
    }

    @Test(description = "DELETE /v1/forms Deleting the forms")
    public void tearDeletingTheForms() {
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(ids)
            .delete(FORMS_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(THE_FORMS_WERE_SUCCESSFULLY_DELETED));
    }

    @Test(description = "DELETE /v1/forms Deleting the forms. Empty Body.")
    public void tearDeletingTheFormsEmpty() {
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(StringUtils.EMPTY)
            .delete(FORMS_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "DELETE /v1/forms Deleting the forms. Json Empty Object.")
    public void tearDeletingTheFormsJsonEmptyObject() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(JSON_EMPTY_OBJECT)
            .delete(FORMS_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_JSON_PARSE_ERROR));
    }

    @Test(description = "DELETE /v1/forms Deleting the forms")
    public void tearDeletingTheFormsEmptyUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .body(ids)
            .delete(FORMS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED))
            .body(PATH_BODY_PATH, containsString(FORMS_PATH));
    }

}
