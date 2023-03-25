package com.benrevo.core.itest.contact;

import static com.benrevo.core.itest.util.DataConstants.CONTACT_REQUEST_RECEIVED_SUCCESSFULLY;
import static com.benrevo.core.itest.util.DataConstants.JSON_EMPTY_OBJECT;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_BAD_REQUEST_CONTACT_US_DTO_HAS_3_ERROR_S;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_MAY_NOT_BE_EMPTY;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NOT_A_WELL_FORMED_EMAIL_ADDRESS;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REGEX_NUMBER_PHONE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ERRORS_EMAIL_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ERRORS_MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ERRORS_NAME_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ERRORS_PHONE_NUMBER_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.CONTACT_US_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNSUPPORTED_MEDIA_TYPE;

import com.benrevo.common.dto.ContactUsDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import io.restassured.http.ContentType;
import org.testng.annotations.Test;


/**
 * The  Send contact api test. Swagger - https://devapi.benrevo.com/swagger-ui.html#/contact-us-controller
 */
public class SendContactTest extends AbstractBaseIt {

    // FIXME: Turn off the test that tests the account sign up or contact from the home.
    @Test(description = "POST /v1/contactus Sends a contact request email to us.", enabled = false)
    public void testSendsContactRequestEmailToUs() {
        ContactUsDto contactUsDto = random(ContactUsDto.class);
        contactUsDto.setEmail(DataConstants.EMAIL_AUTOMATION_BENREVO_COM);

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(contactUsDto)
            .post(CONTACT_US_PATH)
            .then()
            .statusCode(OK.value())
            .body(MESSAGE_BODY_PATH, is(CONTACT_REQUEST_RECEIVED_SUCCESSFULLY));

    }

    @Test(description = "POST /v1/contactus Sends a contact request email to us body empty.")
    public void testSendsContactRequestEmailToUsBodyEmpty() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(EMPTY)
            .post(CONTACT_US_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));

    }

    @Test(description = "POST /v1/contactus Sends a contact request email to us body empty. Unsupported Media Type.")
    public void testSendsContactRequestEmailToUnsupportedMediaType() {

        given().spec(baseSpec())
            .body(EMPTY)
            .post(CONTACT_US_PATH)
            .then()
            .statusCode(UNSUPPORTED_MEDIA_TYPE.value())
            .body(
                MESSAGE_BODY_PATH,
                is(ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED)
            );

    }

    @Test(description = "POST /v1/contactus Sends a contact request email to us. Empty Json Body. ")
    public void testSendsContactRequestEmailToEmptyJsonBody() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(JSON_EMPTY_OBJECT)
            .post(CONTACT_US_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_BAD_REQUEST_CONTACT_US_DTO_HAS_3_ERROR_S));

    }

    @Test(description = "POST /v1/contactus Sends a contact request email to us. Null Email. ")
    public void testSendsContactRequestEmailToNullEmail() {
        ContactUsDto contactUsDto = random(ContactUsDto.class);
        contactUsDto.setEmail(null);
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(contactUsDto)
            .post(CONTACT_US_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_PHONE_NUMBER_BODY_PATH, is(ERROR_REGEX_NUMBER_PHONE));

    }

    @Test(description = "POST /v1/contactus Sends a contact request email to us. Null Name. ")
    public void testSendsContactRequestEmailToNullName() {
        ContactUsDto contactUsDto = random(ContactUsDto.class);
        contactUsDto.setName(null);
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(contactUsDto)
            .post(CONTACT_US_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_EMAIL_BODY_PATH, is(ERROR_NOT_A_WELL_FORMED_EMAIL_ADDRESS));

    }

    @Test(description = "POST /v1/contactus Sends a contact request email to us. Null Message. ")
    public void testSendsContactRequestEmailToNullMessage() {
        ContactUsDto contactUsDto = random(ContactUsDto.class);
        contactUsDto.setMessage(null);
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(contactUsDto)
            .post(CONTACT_US_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_MESSAGE_BODY_PATH, is(ERROR_MAY_NOT_BE_EMPTY));

    }

    @Test(description = "POST /v1/contactus Sends a contact request email to us. Company Name Empty. ")
    public void testSendsContactRequestEmailToEmptyCompanyName() {
        ContactUsDto contactUsDto = random(ContactUsDto.class);
        contactUsDto.setCompanyName(EMPTY);
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(JSON_EMPTY_OBJECT)
            .post(CONTACT_US_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_BAD_REQUEST_CONTACT_US_DTO_HAS_3_ERROR_S));

    }

    @Test(description = "POST /v1/contactus Sends a contact request email to us. Empty Email. ")
    public void testSendsContactRequestEmailToEmptyEmail() {
        ContactUsDto contactUsDto = random(ContactUsDto.class);
        contactUsDto.setEmail(EMPTY);
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(contactUsDto)
            .post(CONTACT_US_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_EMAIL_BODY_PATH, is(ERROR_MAY_NOT_BE_EMPTY));

    }

    @Test(description = "POST /v1/contactus Sends a contact request email to us. Empty Name. ")
    public void testSendsContactRequestEmailToEmptyName() {
        ContactUsDto contactUsDto = random(ContactUsDto.class);
        contactUsDto.setName(EMPTY);
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(contactUsDto)
            .post(CONTACT_US_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_NAME_BODY_PATH, is(ERROR_MAY_NOT_BE_EMPTY));

    }

    @Test(description = "POST /v1/contactus Sends a contact request email to us. Empty Message. ")
    public void testSendsContactRequestEmailToEmptyMessage() {
        ContactUsDto contactUsDto = random(ContactUsDto.class);
        contactUsDto.setMessage(EMPTY);
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(contactUsDto)
            .post(CONTACT_US_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_MESSAGE_BODY_PATH, is(ERROR_MAY_NOT_BE_EMPTY));

    }
}
