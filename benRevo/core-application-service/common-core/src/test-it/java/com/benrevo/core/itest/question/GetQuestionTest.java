package com.benrevo.core.itest.question;

import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_QUESTION_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CODE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.QUESTION_ID_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.TITLE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUESTIONS_ID_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUESTIONS_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static java.util.Collections.singletonList;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.QuestionDto;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;


/**
 * The  Get question test. Swagger - https://devapi.benrevo.com/swagger-ui.html#/question-controller
 */
public class GetQuestionTest extends QuestionBaseTest {

    @BeforeClass
    public void setUp() {
        questionDto.setQuestionId(IDS);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(questionDto))
            .post(QUESTIONS_PATH);
    }

    @Test(description = "GET /v1/questions/{id} Retrieving a question by question id")
    public void testRetrievingQuestionByQuestionId() {
        QuestionDto questionDto = random(QuestionDto.class);

        questionDto.setQuestionId(2L);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(questionDto))
            .post(QUESTIONS_PATH);
        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUESTIONS_ID_PATH, 2L)
            .then()
            .body(TITLE_BODY_PATH, title -> is(questionDto.getTitle()))
            .body(CODE_BODY_PATH, code -> is(questionDto.getCode()))
            .body(QUESTION_ID_PATH, id -> is(2));

    }

    @Test(description = "GET /v1/questions/{id} Retrieving a question by question id. Invalid Format.")
    public void testRetrievingQuestionByQuestionIdInvalidFormat() {
        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUESTIONS_ID_PATH, DataConstants.INVALID_FORMAT)
            .then()

            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));

    }

    @Test(description = "GET /v1/questions/{id} Retrieving a question by question id. Not Found.")
    public void testRetrievingQuestionByQuestionIdINotFound() {
        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUESTIONS_ID_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_QUESTION_NOT_FOUND));

    }

    @Test(description = "GET /v1/questions/{id} Retrieving a question by question id. Unauthorized.")
    public void testRetrievingQuestionByQuestionIdUnauthorized() {
        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .get(QUESTIONS_ID_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));

    }
}
