package com.benrevo.core.itest.question;

import static com.benrevo.core.itest.util.DataConstants.THE_QUESTIONS_WERE_SUCCESSFULLY_DELETED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PATH_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUESTIONS_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static java.util.Collections.singletonList;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.HttpStatus.UNSUPPORTED_MEDIA_TYPE;

import org.apache.commons.lang3.StringUtils;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;


/**
 * The  Delete question test. Swagger - https://devapi.benrevo.com/swagger-ui.html#/question-controller
 */
public class DeleteQuestionTest extends QuestionBaseTest {


    @BeforeClass
    public void createQuestionDto() {
        questionDto.setQuestionId(IDS);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(questionDto))
            .post(QUESTIONS_PATH);
    }

    // FIXME: 10/4/2017 could not execute statement; SQL [n/a]; constraint,temporary this test is disabled.
    @Test(description = "DELETE /v1/questions Deleting the questions", enabled = false)
    public void tearDeletingTheQuestions() {
        given().spec(baseSpec())
            .contentType(JSON)
            .body(ids)
            .delete(QUESTIONS_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(THE_QUESTIONS_WERE_SUCCESSFULLY_DELETED));

    }

    @Test(description = "DELETE /v1/questions Deleting the questions. Empty body.")
    public void tearDeletingTheQuestionsEmptyBody() {
        given().spec(baseSpec())
            .contentType(JSON)
            .body(StringUtils.EMPTY)
            .delete(QUESTIONS_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));

    }

    @Test(description = "DELETE /v1/questions Deleting the questions.Unsupported Media Type.")
    public void tearDeletingTheQuestionsUnsupportedMediaType() {
        given().spec(baseSpec())

            .body(StringUtils.EMPTY)
            .delete(QUESTIONS_PATH)
            .then()
            .statusCode(UNSUPPORTED_MEDIA_TYPE.value())
            .body(PATH_BODY_PATH, containsString(QUESTIONS_PATH))
            .body(
                MESSAGE_BODY_PATH,
                is(ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED)
            );

    }

    @Test(description = "DELETE /v1/questions Deleting the questions")
    public void tearDeletingTheQuestionsUnauthorized() {
        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(ids)
            .delete(QUESTIONS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED))
            .body(PATH_BODY_PATH, containsString(QUESTIONS_PATH));

    }


}
