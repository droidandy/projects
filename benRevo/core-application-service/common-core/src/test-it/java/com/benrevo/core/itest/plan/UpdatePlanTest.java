package com.benrevo.core.itest.plan;

import static com.benrevo.core.itest.util.DataConstants.JSON_EMPTY_OBJECT;
import static com.benrevo.core.itest.util.DataConstants.THE_FORMS_WERE_SUCCESSFULLY_UPDATE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_MAY_NOT_BE_EMPTY;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ERRORS_BENEFITS_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PATH_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.PLANS_CREATE_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.PLANS_UPDATE_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.HttpStatus.UNSUPPORTED_MEDIA_TYPE;

import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.core.AbstractBaseIt;
import org.testng.annotations.Test;


/**
 * The Update plan test.
 */
public class UpdatePlanTest extends AbstractBaseIt {

    private Long rfpQuoteNetworkId = 1L;


    // FIXME: 10/4/2017 Need to fixed, No RFP quote network found, temporary this test is disabled.
    @Test(description = "PUT /v1/plans/update Update plan in existing quote network",
        enabled = false)
    public void testUpdatePlanInExistingQuoteNetwork() {

        CreatePlanDto createPlanDto = random(CreatePlanDto.class);
        createPlanDto.setRfpQuoteNetworkId(rfpQuoteNetworkId);

        given().spec(baseSpec()).body(createPlanDto).post(PLANS_CREATE_PATH).then();

        CreatePlanDto ucreatePlanDto = random(CreatePlanDto.class);
        createPlanDto.setRfpQuoteNetworkId(rfpQuoteNetworkId);
        createPlanDto.setNameByNetwork("PPO test plan");
        given().spec(baseSpec())
            .contentType(JSON)
            .body(ucreatePlanDto)
            .put(PLANS_UPDATE_PATH)
            .then()
            .body(MESSAGE_BODY_PATH, message -> is(THE_FORMS_WERE_SUCCESSFULLY_UPDATE));

    }

    @Test(description = "PUT /v1/plans/update Update plan in existing quote network. Unauthorized.")
    public void testUpdatePlanInExistingQuoteNetworkUnauthorized() {
        CreatePlanDto createPlanDto = random(CreatePlanDto.class);
        createPlanDto.setRfpQuoteNetworkId(rfpQuoteNetworkId);

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(createPlanDto)
            .put(PLANS_UPDATE_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, message -> is(ERROR_UNAUTHORIZED))
            .body(PATH_BODY_PATH, path -> containsString(PLANS_UPDATE_PATH));

    }

    @Test(description = "PUT /v1/plans/update Update plan in existing quote network. Empty Body.")
    public void testUpdatePlanInExistingQuoteNetworkEmptyBody() {
        CreatePlanDto createPlanDto = random(CreatePlanDto.class);
        createPlanDto.setRfpQuoteNetworkId(rfpQuoteNetworkId);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(EMPTY)
            .put(PLANS_UPDATE_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, message -> startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING))

        ;

    }

    @Test(description = "PUT /v1/plans/update Update plan in existing quote network. Error Body.")
    public void testUpdatePlanInExistingQuoteNetworkErrorBody() {
        CreatePlanDto createPlanDto = random(CreatePlanDto.class);
        createPlanDto.setRfpQuoteNetworkId(rfpQuoteNetworkId);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(createPlanDto)
            .put(PLANS_UPDATE_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_BENEFITS_BODY_PATH, message -> startsWith(ERROR_MAY_NOT_BE_EMPTY))

        ;

    }

    @Test(description = "PUT /v1/plans/update Update plan in existing quote network. Content error type.")
    public void testUpdatePlanInExistingQuoteNetworkContentErrorType() {
        CreatePlanDto createPlanDto = random(CreatePlanDto.class);
        createPlanDto.setRfpQuoteNetworkId(rfpQuoteNetworkId);

        given().spec(baseSpec())
            .body(JSON_EMPTY_OBJECT)
            .put(PLANS_UPDATE_PATH)
            .then()
            .statusCode(UNSUPPORTED_MEDIA_TYPE.value())
            .body(
                MESSAGE_BODY_PATH, message -> startsWith(
                    ERROR_CONTENT_TYPE_TEXT_PLAIN_CHARSET_ISO_8859_1_NOT_SUPPORTED))

        ;

    }


}
