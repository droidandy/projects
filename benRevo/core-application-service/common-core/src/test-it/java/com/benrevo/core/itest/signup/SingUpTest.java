package com.benrevo.core.itest.signup;

import static com.benrevo.core.itest.util.DataConstants.EMAIL_AUTOMATION_BENREVO_COM;
import static com.benrevo.core.itest.util.DataConstants.JSON_EMPTY_OBJECT;
import static com.benrevo.core.itest.util.DataConstants.LAST_NAME;
import static com.benrevo.core.itest.util.DataConstants.NEW_SIGN_UP_REQUEST_FOR_BEN_REVO;
import static com.benrevo.core.itest.util.DataConstants.SIGN_UP_REQUEST_RECEIVED_SUCCESSFULLY;
import static com.benrevo.core.itest.util.DataConstants.TEST_NAME;
import static com.benrevo.core.itest.util.EmailBodyUtil.getBodyEmail;
import static com.benrevo.core.itest.util.EmailBodyUtil.getSubjectEmail;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CANNOT_CREATE_SIGN_UP_DTO_BROKERAGE_FIRM_NAME_CANNOT_BE_NULL_OR_EMPTY;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.SIGN_UP_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNSUPPORTED_MEDIA_TYPE;

import com.benrevo.common.dto.SignupDto;
import com.benrevo.core.itest.util.base.SmtpMailServerBase;
import java.io.IOException;
import javax.mail.MessagingException;
import org.testng.annotations.Test;


/**
 * The Sing up test. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/sign-up-controller/signupUsingPOST
 */

public class SingUpTest extends SmtpMailServerBase {

    @Test(description = "POST /v1/signup Signs up a user by sending email inquiry.")
    public void testSignsUpUserBySendingEmailInquiryCreated()
        throws MessagingException, IOException {
        SignupDto signupDto = random(SignupDto.class);
        signupDto.setFirstName(TEST_NAME);
        signupDto.setLastName(LAST_NAME);
        signupDto.setEmail(EMAIL_AUTOMATION_BENREVO_COM);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(signupDto)
            .post(SIGN_UP_PATH)
            .then()
            .statusCode(OK.value())
            .body(MESSAGE_BODY_PATH, is(SIGN_UP_REQUEST_RECEIVED_SUCCESSFULLY));

        String bodyEmail = getBodyEmail(wiser);
        assertThat(getSubjectEmail(wiser), is(NEW_SIGN_UP_REQUEST_FOR_BEN_REVO));
        assertThat(bodyEmail, containsString(EMAIL_AUTOMATION_BENREVO_COM));
        assertThat(bodyEmail, containsString(TEST_NAME));
        assertThat(bodyEmail, containsString(LAST_NAME));
    }

    @Test(description = "POST /v1/signup Signs up a user by sending email inquiry. Empty Body.")
    public void testSignsUpUserBySendingEmailInquiryEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .post(SIGN_UP_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "POST /v1/signup Signs up a user by sending email inquiry. Empty Json Object.")
    public void testSignsUpUserBySendingEmailInquiryJsonEmptyObject() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(JSON_EMPTY_OBJECT)
            .post(SIGN_UP_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(
                MESSAGE_BODY_PATH, startsWith(
                    ERROR_CANNOT_CREATE_SIGN_UP_DTO_BROKERAGE_FIRM_NAME_CANNOT_BE_NULL_OR_EMPTY));
    }

    @Test(description = "POST /v1/signup Signs up a user by sending email inquiry. Unsupported Media Type.")
    public void testSignsUpUserBySendingEmailInquiryUnsupportedMediaType() {

        given().spec(unauthorizedSpec())
            .body(JSON_EMPTY_OBJECT)
            .post(SIGN_UP_PATH)
            .then()
            .statusCode(UNSUPPORTED_MEDIA_TYPE.value())
            .body(
                MESSAGE_BODY_PATH,
                is(ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED)
            );
    }

}
