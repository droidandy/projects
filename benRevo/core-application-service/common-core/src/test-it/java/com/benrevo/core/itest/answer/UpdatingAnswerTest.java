package com.benrevo.core.itest.answer;

import static com.benrevo.core.itest.util.DataConstants.THE_ANSWERS_WERE_SUCCESSFULLY_UPDATED_CREATED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_ENTITY_IS_NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_THE_GIVEN_ID_MUST_NOT_BE_NULL;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.ANSWERS_PATH;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.AnswerDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import io.restassured.http.ContentType;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.testng.annotations.Test;


/**
 * The Updating answer api test. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/answer-controller/updateAnswersUsingPUT
 */
public class UpdatingAnswerTest extends AbstractBaseIt {

    @Test(description = "PUT /v1/answers Updating or creating the answers")
    public void testUpdatingOrCreatingTheAnswers() {
        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(getClientIdL());
        Map<String, String> answers = new HashMap<>();
        answerDto.setAnswers(answers);

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(answerDto)
            .put(ANSWERS_PATH)
            .then()
            .statusCode(CREATED.value())
            .body(MESSAGE_BODY_PATH, is(THE_ANSWERS_WERE_SUCCESSFULLY_UPDATED_CREATED));
    }

    @Test(description = "PUT /v1/answers Updating or creating the answers. Empty Body.")
    public void testUpdatingOrCreatingTheAnswersEmpty() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(StringUtils.EMPTY)
            .put(ANSWERS_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "PUT /v1/answers Updating or creating the answers. Client is Null.")
    public void testUpdatingOrCreatingTheAnswersNotNull() {
        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(null);

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(answerDto)
            .put(ANSWERS_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_THE_GIVEN_ID_MUST_NOT_BE_NULL));
    }

    @Test(description = "PUT /v1/answers Updating or creating the answers. Not found.")
    public void testUpdatingOrCreatingTheAnswersClientNotFound() {
        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(DataConstants.NOT_FOUND_ID);

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(answerDto)
            .put(ANSWERS_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_ENTITY_IS_NOT_FOUND_ID));
    }

    @Test(description = "PUT /v1/answers Updating or creating the answers. Forbidden.")
    public void testUpdatingOrCreatingTheAnswersClientForbidden() {
        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(DataConstants.FORBIDDEN_CLIENT_ID);

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(answerDto)
            .put(ANSWERS_PATH)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FORBIDDEN));
    }

    @Test(description = "PUT /v1/answers Updating or creating the answers. Unauthorized.")
    public void testUpdatingOrCreatingTheAnswersUnauthorized() {
        AnswerDto answerDto = new AnswerDto();
        answerDto.setClientId(DataConstants.NOT_FOUND_ID);

        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .body(answerDto)
            .put(ANSWERS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_UNAUTHORIZED));
    }
}
