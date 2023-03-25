package com.benrevo.core.itest.question;

import static com.benrevo.core.itest.util.DataConstants.JSON_EMPTY_OBJECT;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_JSON_PARSE_ERROR;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CODE_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PATH_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.QUESTION_ID_FIRST_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.TITLE_FIST_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUESTIONS_PATH;
import static io.restassured.RestAssured.given;
import static java.util.Collections.singletonList;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.HttpStatus.UNSUPPORTED_MEDIA_TYPE;

import io.restassured.http.ContentType;
import org.apache.commons.lang3.StringUtils;
import org.testng.annotations.Test;


/**
 * The  Create question test. Swagger - https://devapi.benrevo.com/swagger-ui.html#/question-controller
 */
public class CreateQuestionTest extends QuestionBaseTest {

    @Test(description = "POST /v1/questions Creating an array of questions")
    public void testCreatingAnArrayOfQuestions() {
        questionDto.setQuestionId(IDS);
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(singletonList(questionDto))
            .post(QUESTIONS_PATH)
            .then()
            .statusCode(CREATED.value())
            .body(TITLE_FIST_BODY_PATH, is(questionDto.getTitle()), CODE_FIRST_BODY_PATH,
                is(questionDto.getCode()), QUESTION_ID_FIRST_PATH,
                is(questionDto.getQuestionId().intValue())
            )

        ;
    }

    @Test(description = "POST /v1/questions Creating an array of questions. Unsupported Media Type.")
    public void testCreatingAnArrayOfQuestionsUnsupportedMediaType() {

        given().spec(baseSpec())
            .body(singletonList(questionDto))
            .post(QUESTIONS_PATH)
            .then()
            .statusCode(UNSUPPORTED_MEDIA_TYPE.value())
            .body(PATH_BODY_PATH, containsString(QUESTIONS_PATH))
            .body(MESSAGE_BODY_PATH,
                is(ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED)
            );
    }

    @Test(description = "POST /v1/questions Creating an array of questions. Unauthorized.")
    public void testCreatingAnArrayOfQuestionsUnauthorized() {
        questionDto.setQuestionId(IDS);
        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .body(singletonList(questionDto))
            .post(QUESTIONS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED))
            .body(PATH_BODY_PATH, containsString(QUESTIONS_PATH));
    }

    @Test(description = "POST /v1/questions Creating an array of questions. Empty Body.")
    public void testCreatingAnArrayOfQuestionsEmptyBody() {
        questionDto.setQuestionId(IDS);
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(StringUtils.EMPTY)
            .post(QUESTIONS_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "POST /v1/questions Creating an array of questions. Json Empty Object.")
    public void testCreatingAnArrayOfQuestionsJsonEmptyObject() {
        questionDto.setQuestionId(IDS);
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(JSON_EMPTY_OBJECT)
            .post(QUESTIONS_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_JSON_PARSE_ERROR));
    }
}
