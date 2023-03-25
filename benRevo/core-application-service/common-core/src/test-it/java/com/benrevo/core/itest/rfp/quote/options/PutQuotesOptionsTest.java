package com.benrevo.core.itest.rfp.quote.options;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_MAY_NOT_BE_NULL;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_QUOTE_OPTION_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_QUOTE_OPTION_NETWORK_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_RFP_QUOTE_OPTION_NETWORK_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ERRORS_RFP_QUOTE_NETWORK_PLAN_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ERRORS_RFP_QUOTE_OPTION_NETWORK_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_CLIENT_ID_CATEGORY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_CONTRIBUTIONS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_ID_CHANGE_NETWORK_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_ID_SELECT_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_ID_UN_SELECT_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_SELECT_ADMINISTRATIVE_FEE_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_UN_SELECT_NETWORK_PLAN_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static io.restassured.mapper.ObjectMapperType.GSON;
import static java.util.Collections.singleton;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.QuoteOptionListDto;
import com.benrevo.common.dto.UpdateContributionsDto;
import com.benrevo.common.dto.UpdateRfpQuoteOptionNetworkDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import com.benrevo.core.itest.util.JsonBodyPathConstants;
import org.testng.annotations.Test;


/**
 * The Put quotes options api test. Swagger -https://devapi.benrevo.com/swagger-ui.html#!/rfp-quote-controller/unselectRfpQuoteOptionUsingPUT
 */
public class PutQuotesOptionsTest extends AbstractBaseIt {

    private static final long RFP_QUOTE_NETWORK_ID = 1L;
    private static final long RFP_QUOTE_OPTION_NETWORK_ID = 1L;
    private Long rfpQuoteOptionId = 0L;


    @Test(description = "PUT /v1/quotes/options/{id}/unselect Remove the rfp quote option from final selection")
    public void testRemoveTheRfpQuoteOptionFromFinalSelection() {

        given().spec(baseSpec())
            .contentType(JSON)
            .put(QUOTES_OPTIONS_ID_UN_SELECT_PATH, rfpQuoteOptionId)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "PUT /v1/quotes/options/{id}/unselect Remove the rfp quote option from final selection not found")
    public void testRemoveTheRfpQuoteOptionFromFinalSelectionNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .put(QUOTES_OPTIONS_ID_UN_SELECT_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "PUT /v1/quotes/options/{id}/unselect Remove the rfp quote option from final selection invalid format")
    public void testRemoveTheRfpQuoteOptionFromFinalSelectionInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .put(QUOTES_OPTIONS_ID_UN_SELECT_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "PUT /v1/quotes/options/{id}/unselect Remove the rfp quote option from final selection. Unauthorized.")
    public void testRemoveTheRfpQuoteOptionFromFinalSelectionUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .put(QUOTES_OPTIONS_ID_UN_SELECT_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "PUT /v1/quotes/options/{id}/select Select the rfp quote option for final selection")
    public void testSelectTheRfpQuoteOptionForFinalSelection() {
        QuoteOptionListDto quoteOptionListDto = given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_CLIENT_ID_CATEGORY_PATH, getClientIdL(), DENTAL)
            .then()
            .extract()
            .as(QuoteOptionListDto.class);

        rfpQuoteOptionId = 1L;
        given().spec(baseSpec())
            .contentType(JSON)
            .put(QUOTES_OPTIONS_ID_SELECT_PATH, rfpQuoteOptionId)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "PUT /v1/quotes/options/{id}/select Select the rfp quote option for final selection not found")
    public void testSelectTheRfpQuoteOptionForFinalSelectionNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .put(QUOTES_OPTIONS_ID_SELECT_PATH, DataConstants.NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "PUT /v1/quotes/options/{id}/select Select the rfp quote option for final selection invalid format")
    public void testSelectTheRfpQuoteOptionForFinalSelectionInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .put(QUOTES_OPTIONS_ID_SELECT_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "PUT /v1/quotes/options/{id}/select Select the rfp quote option for final selection. Unauthorized.")
    public void testSelectTheRfpQuoteOptionForFinalSelectionUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .put(QUOTES_OPTIONS_ID_SELECT_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "PUT /v1/quotes/options/{id}/changeNetwork Updating the RfpQuoteOptionNetwork item: - set new RfpQuoteNetwork - set ClientPlan to null - set selected and RX plans to null")
    public void testUpdatingRfpQuoteOptionNetworkItem() {

        given().spec(baseSpec())
            .contentType(JSON)
            .put(QUOTES_OPTIONS_ID_CHANGE_NETWORK_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "PUT /v1/quotes/options/{id}/changeNetwork Updating the RfpQuoteOptionNetwork item: - set new RfpQuoteNetwork - set ClientPlan to null - set selected and RX plans to null invalid format")
    public void testUpdatingRfpQuoteOptionNetworkItemInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .put(QUOTES_OPTIONS_ID_CHANGE_NETWORK_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "PUT /v1/quotes/options/{id}/changeNetwork Updating the RfpQuoteOptionNetwork item: - set new RfpQuoteNetwork - set ClientPlan to null - set selected and RX plans to null not found")
    public void testUpdatingRfpQuoteOptionNetworkItemNotFound() {
        UpdateRfpQuoteOptionNetworkDto updateRfpQuoteOptionNetworkDto =
            new UpdateRfpQuoteOptionNetworkDto();
        updateRfpQuoteOptionNetworkDto.setRfpQuoteNetworkId(RFP_QUOTE_NETWORK_ID);
        updateRfpQuoteOptionNetworkDto.setRfpQuoteOptionNetworkId(RFP_QUOTE_OPTION_NETWORK_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(updateRfpQuoteOptionNetworkDto, GSON)
            .put(QUOTES_OPTIONS_ID_CHANGE_NETWORK_PATH, rfpQuoteOptionId)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "PUT /v1/quotes/options/{id}/changeNetwork Updating the RfpQuoteOptionNetwork item: - set new RfpQuoteNetwork - set ClientPlan to null - set selected and RX plans. Unauthorized.")
    public void testUpdatingRfpQuoteOptionNetworkItemUnauthorized() {
        UpdateRfpQuoteOptionNetworkDto updateRfpQuoteOptionNetworkDto =
            new UpdateRfpQuoteOptionNetworkDto();
        updateRfpQuoteOptionNetworkDto.setRfpQuoteNetworkId(RFP_QUOTE_NETWORK_ID);
        updateRfpQuoteOptionNetworkDto.setRfpQuoteOptionNetworkId(RFP_QUOTE_OPTION_NETWORK_ID);

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(updateRfpQuoteOptionNetworkDto, GSON)
            .put(QUOTES_OPTIONS_ID_CHANGE_NETWORK_PATH, rfpQuoteOptionId)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "PUT /v1/quotes/options/unselectNetworkPlan Remove plan selection from specified quote option network valid error")
    public void testRemovePlanSelectionFromSpecifiedQuoteOptionNetworkValidError() {
        UpdateRfpQuoteOptionNetworkDto updateRfpQuoteOptionNetworkDto =
            new UpdateRfpQuoteOptionNetworkDto();
        updateRfpQuoteOptionNetworkDto.setRfpQuoteNetworkId(RFP_QUOTE_NETWORK_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(updateRfpQuoteOptionNetworkDto, GSON)
            .put(QUOTES_OPTIONS_UN_SELECT_NETWORK_PLAN_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_RFP_QUOTE_NETWORK_PLAN_ID_BODY_PATH, startsWith(ERROR_MAY_NOT_BE_NULL))
            .body(
                JsonBodyPathConstants.ERRORS_RFP_QUOTE_OPTION_NETWORK_ID_BODY_PATH,
                startsWith(ERROR_MAY_NOT_BE_NULL)
            );
    }

    @Test(description = "PUT /v1/quotes/options/selectNetworkPlan Setting plan as selected for specified quote option network valid error")
    public void testSettingPlanAsSelectedForSpecifiedQuoteOptionNetworkValidError() {
        UpdateRfpQuoteOptionNetworkDto updateRfpQuoteOptionNetworkDto =
            new UpdateRfpQuoteOptionNetworkDto();
        updateRfpQuoteOptionNetworkDto.setRfpQuoteNetworkId(RFP_QUOTE_NETWORK_ID);
        updateRfpQuoteOptionNetworkDto.setRfpQuoteOptionNetworkId(RFP_QUOTE_OPTION_NETWORK_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(updateRfpQuoteOptionNetworkDto, GSON)
            .put(QUOTES_OPTIONS_UN_SELECT_NETWORK_PLAN_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_RFP_QUOTE_NETWORK_PLAN_ID_BODY_PATH, startsWith(ERROR_MAY_NOT_BE_NULL));
    }

    @Test(description = "PUT /v1/quotes/options/selectNetworkPlan Setting plan as selected for specified quote option network valid error. Unauthorized.")
    public void testSettingPlanAsSelectedForSpecifiedQuoteOptionNetworkUnauthorized() {
        UpdateRfpQuoteOptionNetworkDto updateRfpQuoteOptionNetworkDto =
            new UpdateRfpQuoteOptionNetworkDto();
        updateRfpQuoteOptionNetworkDto.setRfpQuoteNetworkId(RFP_QUOTE_NETWORK_ID);
        updateRfpQuoteOptionNetworkDto.setRfpQuoteOptionNetworkId(RFP_QUOTE_OPTION_NETWORK_ID);

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(updateRfpQuoteOptionNetworkDto, GSON)
            .put(QUOTES_OPTIONS_UN_SELECT_NETWORK_PLAN_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "PUT /v1/quotes/options/selectAdministrativeFee Select administrative fee invalid error")
    public void testSelectAdministrativeFeeValidError() {
        UpdateRfpQuoteOptionNetworkDto updateRfpQuoteOptionNetworkDto =
            new UpdateRfpQuoteOptionNetworkDto();
        updateRfpQuoteOptionNetworkDto.setRfpQuoteNetworkId(RFP_QUOTE_NETWORK_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(updateRfpQuoteOptionNetworkDto, GSON)
            .put(QUOTES_OPTIONS_SELECT_ADMINISTRATIVE_FEE_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_RFP_QUOTE_OPTION_NETWORK_ID_BODY_PATH, startsWith(ERROR_MAY_NOT_BE_NULL));
    }

    // FIXME: 10/5/2017  "RfpQuoteOptionNetwork not found",
    @Test(description = "PUT /v1/quotes/options/selectAdministrativeFee Select administrative fee not found",
        enabled = false)
    public void testSelectAdministrativeFeeNotFound() {
        UpdateRfpQuoteOptionNetworkDto updateRfpQuoteOptionNetworkDto =
            new UpdateRfpQuoteOptionNetworkDto();
        updateRfpQuoteOptionNetworkDto.setRfpQuoteNetworkId(RFP_QUOTE_NETWORK_ID);
        updateRfpQuoteOptionNetworkDto.setRfpQuoteOptionNetworkId(RFP_QUOTE_OPTION_NETWORK_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(updateRfpQuoteOptionNetworkDto, GSON)
            .put(QUOTES_OPTIONS_SELECT_ADMINISTRATIVE_FEE_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "PUT /v1/quotes/options/selectAdministrativeFee Select administrative fee Unauthorized")
    public void testSelectAdministrativeFeeUnauthorized() {
        UpdateRfpQuoteOptionNetworkDto updateRfpQuoteOptionNetworkDto =
            new UpdateRfpQuoteOptionNetworkDto();
        updateRfpQuoteOptionNetworkDto.setRfpQuoteNetworkId(RFP_QUOTE_NETWORK_ID);
        updateRfpQuoteOptionNetworkDto.setRfpQuoteOptionNetworkId(RFP_QUOTE_OPTION_NETWORK_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(updateRfpQuoteOptionNetworkDto, GSON)
            .put(QUOTES_OPTIONS_SELECT_ADMINISTRATIVE_FEE_PATH)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_RFP_QUOTE_OPTION_NETWORK_NOT_FOUND));
    }

    @Test(description = "PUT /v1/quotes/options/contributions Updating the rfp quote option contributions by rfp_quote_option_id not found")
    public void testUpdatingTheRfpQuoteOptionContributionsByRfpQuoteOptionIdNotFound() {
        UpdateContributionsDto updateContributionsDto = random(UpdateContributionsDto.class);
        updateContributionsDto.setRfpQuoteOptionNetworkId(RFP_QUOTE_OPTION_NETWORK_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(singleton(updateContributionsDto))
            .put(QUOTES_OPTIONS_CONTRIBUTIONS_PATH)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_NO_QUOTE_OPTION_NETWORK_FOUND));
    }

    @Test(description = "PUT /v1/quotes/options/contributions Updating the rfp quote option contributions by rfp_quote_option_id. Unauthorized.")
    public void testUpdatingTheRfpQuoteOptionContributionsByRfpQuoteOptionIdUnauthorized() {
        UpdateContributionsDto updateContributionsDto = random(UpdateContributionsDto.class);
        updateContributionsDto.setRfpQuoteOptionNetworkId(RFP_QUOTE_OPTION_NETWORK_ID);

        given().spec(unauthorizedSpec())
            .contentType(JSON)
            .body(singleton(updateContributionsDto))
            .put(QUOTES_OPTIONS_CONTRIBUTIONS_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

}
