package com.benrevo.core.itest.account.requst;


import static com.benrevo.core.itest.util.DataConstants.EMAIL_AUTOMATION_BENREVO_COM;
import static com.benrevo.core.itest.util.DataConstants.JSON_EMPTY_OBJECT;
import static com.benrevo.core.itest.util.DataConstants.PLEASE_VERIFY_YOUR_EMAIL;
import static com.benrevo.core.itest.util.DataConstants.TEST_NAME;
import static com.benrevo.core.itest.util.DataConstants.THE_VERIFICATION_CODE_WAS_SUCCESSFULLY_PROCESSED;
import static com.benrevo.core.itest.util.EmailBodyUtil.getBodyEmail;
import static com.benrevo.core.itest.util.EmailBodyUtil.getSubjectEmail;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_ATTEMPTING_TO_BUILD_MAIL_MESSAGE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_STRING_PARAMETER_VERIFICATION_CODE_IS_NOT_PRESENT;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_WRONG_CODE;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.ACCOUNT_REQUEST_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.VERIFY_EMAIL_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.VERIFY_EMAIL_VERIFICATION_CODE_PATH;
import static io.restassured.RestAssured.given;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.springframework.http.HttpStatus.CREATED;

import com.benrevo.common.dto.AccountRequestDto;
import com.benrevo.core.itest.util.base.SmtpMailServerBase;
import io.restassured.http.ContentType;
import java.io.IOException;
import java.util.UUID;
import javax.mail.MessagingException;
import org.testng.annotations.Test;


/**
 * The  Create account request test. Swagger: https://devapi.benrevo.com/swagger-ui.html#!/sign-up-controller/createAccountRequestUsingPOST
 * https://devapi.benrevo.com/swagger-ui.html#!/sign-up-controller/verifyAccountRequestUsingPOST
 */
public class CreateAccountRequestTest extends SmtpMailServerBase {

    @Test(description = "POST /v1/accountRequest Create account request")
    public void testCreateAccountRequest() throws IOException, MessagingException {
        AccountRequestDto dto = new AccountRequestDto();
        dto.setBrokerName("brokerName");
        dto.setBrokerAddress("brokerAddress");
        dto.setBrokerCity("brokerCity");
        dto.setBrokerEmail(EMAIL_AUTOMATION_BENREVO_COM);
        dto.setBrokerState("brokerState");
        dto.setBrokerZip("brokerZip");
        dto.setGaName("gaName");
        dto.setGaAddress("gaAddress");
        dto.setGaCity("gaCity");
        dto.setGaState("gaState");
        dto.setGaZip("gaZip");
        dto.setAgentName(TEST_NAME);
        dto.setAgentEmail(EMAIL_AUTOMATION_BENREVO_COM);

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(dto)
            .post(ACCOUNT_REQUEST_PATH)
            .then()
            .statusCode(CREATED.value());


        String bodyEmail = getBodyEmail(wiser);
        assertThat(getSubjectEmail(wiser), is(PLEASE_VERIFY_YOUR_EMAIL));
        assertThat(bodyEmail, containsString(TEST_NAME));
    }

    @Test(description = "POST /v1/accountRequest Create account request. Empty")
    public void testCreateAccountRequestEmpty() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(EMPTY)
            .post(ACCOUNT_REQUEST_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));

    }

    @Test(description = "POST /v1/accountRequest Create account request. Empty JSON object")
    public void testCreateAccountRequestEmptyEmptyJson() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(JSON_EMPTY_OBJECT)
            .post(ACCOUNT_REQUEST_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_ATTEMPTING_TO_BUILD_MAIL_MESSAGE));

    }

    @Test(description = "POST /v1/verifyEmail Verify Email", enabled = false)
    public void testVerificationEmailWithoutAuthorization() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .post(VERIFY_EMAIL_VERIFICATION_CODE_PATH, 1)
            .then()
            .body(MESSAGE_BODY_PATH, is(THE_VERIFICATION_CODE_WAS_SUCCESSFULLY_PROCESSED));
    }

    @Test(description = "POST /v1/verifyEmail Verify Email")
    public void testVerificationEmailWithoutAuthorizationWrongCode() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .post(VERIFY_EMAIL_VERIFICATION_CODE_PATH, UUID.randomUUID().toString())
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_WRONG_CODE));
    }

    @Test(description = "POST /v1/verifyEmail Verify Email. not verification code")
    public void testVerificationEmailWithoutAuthorizationNotVerificationCode() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(EMPTY)
            .post(VERIFY_EMAIL_PATH)
            .then()
            .body(
                MESSAGE_BODY_PATH,
                is(ERROR_REQUIRED_STRING_PARAMETER_VERIFICATION_CODE_IS_NOT_PRESENT)
            );
    }
}
