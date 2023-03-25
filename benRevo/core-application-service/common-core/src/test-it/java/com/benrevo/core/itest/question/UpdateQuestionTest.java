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
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static java.util.Collections.singletonList;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.HttpStatus.UNSUPPORTED_MEDIA_TYPE;

import com.benrevo.common.dto.QuestionDto;
import org.apache.commons.lang3.StringUtils;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;


/**
 * The Update question test.
 */
public class UpdateQuestionTest extends QuestionBaseTest {

    @BeforeClass
    public void setUp() {
        questionDto.setQuestionId(IDS);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(questionDto))
            .post(QUESTIONS_PATH);
    }

    @Test(description = "PUT /v1/questions Updating the questions")
    public void testRetrievingQuestionByQuestionId() {
        QuestionDto questionDto = random(QuestionDto.class);
        questionDto.setQuestionId(4L);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(questionDto))
            .post(QUESTIONS_PATH);

        questionDto.setTitle(random(String.class));
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singletonList(questionDto))
            .put(QUESTIONS_PATH)
            .then()
            .body(TITLE_FIST_BODY_PATH, title -> is(questionDto.getTitle()))
            .body(CODE_FIRST_BODY_PATH, code -> is(questionDto.getCode()))
            .body(QUESTION_ID_FIRST_PATH, id -> is(4));

    }

    @Test(description = "PUT /v1/questions Updating the questions. Unauthorized.")
    public void testRetrievingQuestionByQuestionIdUnauthorized() {
        questionDto.setTitle(random(String.class));
        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(singletonList(questionDto))
            .put(QUESTIONS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED))
            .body(PATH_BODY_PATH, containsString(QUESTIONS_PATH))

        ;

    }

    @Test(description = "PUT /v1/questions Updating the questions. Empty Body.")
    public void testRetrievingQuestionByQuestionIdEmptyBody() {
        questionDto.setTitle(random(String.class));
        given().spec(baseSpec())
            .contentType(JSON)
            .body(StringUtils.EMPTY)
            .put(QUESTIONS_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));

    }

    @Test(description = "PUT /v1/questions Updating the questions. Json Empty Object.")
    public void testRetrievingQuestionByQuestionIdJsonEmptyObject() {
        questionDto.setTitle(random(String.class));
        given().spec(baseSpec())
            .contentType(JSON)
            .body(JSON_EMPTY_OBJECT)
            .put(QUESTIONS_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_JSON_PARSE_ERROR));

    }

    @Test(description = "PUT /v1/questions Updating the questions. Unsupported Media Type.")
    public void testRetrievingQuestionByQuestionIdUnsupportedMediaType() {
        questionDto.setTitle(random(String.class));
        given().spec(baseSpec())
            .body(JSON_EMPTY_OBJECT)
            .put(QUESTIONS_PATH)
            .then()
            .statusCode(UNSUPPORTED_MEDIA_TYPE.value())
            .body(
                MESSAGE_BODY_PATH,
                startsWith(ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED)
            );

    }
}
