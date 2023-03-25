package com.benrevo.core.itest.plan;


import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PATH_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.PLANS_CREATE_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static java.util.Collections.singleton;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.HttpStatus.UNSUPPORTED_MEDIA_TYPE;

import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.core.AbstractBaseIt;
import org.testng.annotations.Test;


/**
 * The Create plan test.
 */
public class CreateUpdatePlanTest extends AbstractBaseIt {

    private CreatePlanDto createPlanDto = random(CreatePlanDto.class);

    // FIXME: 10/4/2017 Need to fixed, No RFP quote network found, temporary this test is disabled.
    @Test(description = "POST /v1/plans/rfp/{rfpId}/create Create or update plans in rfp",
        enabled = false)
    public void testCreateOrUpdatePlanInRfp() {
        createPlanDto.setRfpQuoteNetworkId(1L);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(singleton(createPlanDto))
            .post(PLANS_CREATE_PATH)
            .then()
            .statusCode(OK.value())
            .body(MESSAGE_BODY_PATH, message -> is("The forms were successfully created"));
    }

    @Test(description = "POST /v1/plans/rfp/{rfpId}/create Create or update plans in rfp. Unauthorized.")
    public void testCreateOrUpdatePlanInRfpUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(singleton(createPlanDto))
            .post(PLANS_CREATE_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED))
            .body(PATH_BODY_PATH, containsString(PLANS_CREATE_PATH));
    }

    @Test(description = "POST /v1/plans/rfp/{rfpId}/create Create or update plans in rfp. Empty Body.")
    public void testCreateOrUpdatePlanInRfpEmptyBody() {

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .post(PLANS_CREATE_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING))

        ;
    }

    @Test(description = "POST /v1/plans/rfp/{rfpId}/create Create or update plans in rfp. Content type error.")
    public void testCreateOrUpdatePlanInRfpErrorContentType() {

        given().spec(baseSpec())
            .body(EMPTY)
            .post(PLANS_CREATE_PATH)
            .then()
            .statusCode(UNSUPPORTED_MEDIA_TYPE.value())
            .body(
                MESSAGE_BODY_PATH,
                is(ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED)
            )

        ;
    }

}


