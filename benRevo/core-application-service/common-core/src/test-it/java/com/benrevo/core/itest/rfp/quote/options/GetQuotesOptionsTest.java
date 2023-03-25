package com.benrevo.core.itest.rfp.quote.options;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.core.itest.util.DataConstants.ANTHEM_BLUE_CROSS;
import static com.benrevo.core.itest.util.DataConstants.INVALID_FORMAT;
import static com.benrevo.core.itest.util.DataConstants.MEDICAL_OPTION;
import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.DataConstants.PLAN_TYPE;
import static com.benrevo.core.itest.util.DataConstants.QUOTE_ID;
import static com.benrevo.core.itest.util.DataConstants.RFP_CARRIER_ID;
import static com.benrevo.core.itest.util.DataConstants.RFP_QUOTE_NETWORK_ID;
import static com.benrevo.core.itest.util.DataConstants.RFP_QUOTE_OPTION_ID;
import static com.benrevo.core.itest.util.DataConstants.RFP_QUOTE_OPTION_NETWORK_ID;
import static com.benrevo.core.itest.util.DataConstants.RFP_QUOTE_OPTION_SECOND_ID;
import static com.benrevo.core.itest.util.DataConstants.RIDERS_ID;
import static com.benrevo.core.itest.util.DataConstants.RIDER_CODE;
import static com.benrevo.core.itest.util.DataConstants.RIDER_DESCRIPTION_SIMPLY_ENGAGED;
import static com.benrevo.core.itest.util.DataConstants.STANDARD;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_CLIENT_PLANS_WERE_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_QUOTE_OPTION_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_QUOTE_OPTION_NETWORK_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_RFP_QUOTE_OPTION_IDS_PROVIDED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_LONG_PARAMETER_RFP_QUOTE_OPTION_ID_IS_NOT_PRESENT;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_THERE_WAS_AN_ISSUE_WITH_YOUR_REQUEST_PLEASE_TRY_AGAIN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_THE_GIVEN_ID_MUST_NOT_BE_NULL;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CARRIER_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.CATEGORY_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.DETAILED_PLANS_CARRIER_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.DETAILED_PLANS_RFP_CARRIER_ID_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.DETAILED_PLANS_RFP_QUOTE_NETWORK_ID_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.DETAILED_PLANS_RFP_QUOTE_OPTION_NETWORK_ID_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.DETAILED_PLANS_TYPE_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.NAME_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.NAME_SECOND_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.QUOTE_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.QUOTE_TYPE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.QUOTE_TYPE_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.QUOTE_TYPE_SECOND_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.RFP_QUOTE_OPTION_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.RFP_QUOTE_OPTION_ID_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.RFP_QUOTE_OPTION_ID_SECOND_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.RIDERS_RIDER_CODE_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.RIDERS_RIDER_DESCRIPTION_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.RIDERS_RIDER_ID_FIRST_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_ALTERNATIVES_ID_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_CLIENT_ID_CATEGORY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_COMPARE_FILE_IDS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_COMPARE_IDS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_COMPARE_IDS_PATH_EMPTY;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_CONTRIBUTIONS_IDS_REQUIRED_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_CONTRIBUTIONS_RFP_QUOTE_OPTION_ID_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_ID_AVAILABLE_NETWORKS_RAP_QUOTE_NETWORK_ID_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_ID_AVAILABLE_NETWORKS_REQUIRED_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_ID_DISCLAIMER_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_ID_NETWORKS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_ID_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_ID_RIDERS_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_SELECTED_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_RFP_QUOTE_ID_FILE_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_STATUS_CLIENT_ID_CATEGORY_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;

import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The Get quotes options api tests. Swagger https://devapi.benrevo.com/swagger-ui.html#/rfp-quote-controller
 */
public class GetQuotesOptionsTest extends AbstractBaseIt {

    @Test(description = "GET /v1/quotes/options Retrieving the rfp quote options by client_id and category DENTAL")
    public void testRetrievingTheRfpQuoteOptionsByClientIdAndCategoryDental() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_CLIENT_ID_CATEGORY_PATH, getClientIdL(), DENTAL)
            .then()
            .statusCode(OK.value())
            .body(CATEGORY_BODY_PATH, is(DENTAL));
    }

    @Test(description = "GET /v1/quotes/options/alternatives Retrieving the rfp quote network alternative plans by not found id")
    public void testRetrievingTheRfpQuoteNetworkAlternativePlansByRfpQuoteOptionNetworkId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ALTERNATIVES_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_NETWORK_FOUND));
    }

    @Test(description = "GET /v1/quotes/options/alternatives Retrieving the rfp quote network alternative plans by invalid format")
    public void testRetrievingTheRfpQuoteNetworkAlternativePlansByRfpQuoteOptionNetworkIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ALTERNATIVES_ID_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/quotes/options/compare Retrieving the quote options comparison by  not found id")
    public void testRetrievingTheQuoteOptionsComparisonByArrayOfRfpQuoteOptionNetworkNotFoundId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_COMPARE_IDS_PATH, NOT_FOUND_ID, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "GET /v1/quotes/options/compare Retrieving the quote options comparison by quote option network id")
    public void testRetrievingTheQuoteOptionsComparisonByArrayOfRfpQuoteOptionNetworkId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_COMPARE_IDS_PATH, RFP_QUOTE_OPTION_ID, RFP_QUOTE_OPTION_SECOND_ID)
            .then()
            .body(RFP_QUOTE_OPTION_ID_FIRST_BODY_PATH, is(RFP_QUOTE_OPTION_ID.intValue()))
            .body(NAME_FIRST_BODY_PATH, is(MEDICAL_OPTION))
            .body(QUOTE_TYPE_FIRST_BODY_PATH, is(STANDARD))
            .body(QUOTE_TYPE_SECOND_BODY_PATH, is(STANDARD))
            .body(NAME_SECOND_BODY_PATH, is(MEDICAL_OPTION))
            .body(RFP_QUOTE_OPTION_ID_SECOND_BODY_PATH, is(RFP_QUOTE_OPTION_SECOND_ID.intValue()))
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/quotes/options/compare Retrieving the quote options comparison by invalid format")
    public void testRetrievingTheQuoteOptionsComparisonByArrayOfRfpQuoteOptionNetworkInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_COMPARE_IDS_PATH, INVALID_FORMAT, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/quotes/options/compare Retrieving the quote options comparison by invalid format")
    public void testRetrievingTheQuoteOptionsComparisonByArrayOfRfpQuoteOptionNetworkNull() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_COMPARE_IDS_PATH, EMPTY, EMPTY)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_THE_GIVEN_ID_MUST_NOT_BE_NULL));
    }

    @Test(description = "GET /v1/quotes/options/compare Retrieving the quote options comparison by invalid format")
    public void testRetrievingTheQuoteOptionsComparisonByArrayOfRfpQuoteOptionNetworkEmpty() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_COMPARE_IDS_PATH_EMPTY)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_NO_RFP_QUOTE_OPTION_IDS_PROVIDED));
    }

    @Test(description = "GET /v1/quotes/options/compare/file Retrieving the quote options comparison by array of not found id via excel file")
    public void testRetrievingTheQuoteOptionsComparisonByArrayOfRfpQuoteOptionNetworkIViaExcelFileNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_COMPARE_FILE_IDS_PATH, NOT_FOUND_ID, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "GET /v1/quotes/options/compare/file Retrieving the quote options comparison by array of no client plans  via excel file")
    public void testRetrievingTheQuoteOptionsComparisonByArrayOfRfpQuoteOptionNetworkIViaExcelFilNoClientPlan() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_COMPARE_FILE_IDS_PATH, RFP_QUOTE_OPTION_ID,
                RFP_QUOTE_OPTION_SECOND_ID
            )
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_CLIENT_PLANS_WERE_FOUND));
    }

    @Test(description = "GET /v1/quotes/options/contributions Retrieving the rfp quote option contributions not found option id")
    public void testRetrievingTheRfpQuoteOptionContributionsByQuoteNotFoundOptionId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_CONTRIBUTIONS_RFP_QUOTE_OPTION_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "GET /v1/quotes/options/contributions Retrieving the rfp quote option contributions invalid format")
    public void testRetrievingTheRfpQuoteOptionContributionsByQuoteInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_CONTRIBUTIONS_RFP_QUOTE_OPTION_ID_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/quotes/options/contributions Retrieving the rfp quote option contributions by rfp_quote_option_id")
    public void testRetrievingTheRfpQuoteOptionContributionsByQuoteId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_CONTRIBUTIONS_RFP_QUOTE_OPTION_ID_PATH, RFP_QUOTE_OPTION_ID)
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/quotes/options/contributions Retrieving the rfp quote option contributions required parameter")
    public void testRetrievingTheRfpQuoteOptionContributionsNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_CONTRIBUTIONS_IDS_REQUIRED_PATH, NOT_FOUND_ID)
            .then()
            .body(MESSAGE_BODY_PATH,
                is(ERROR_REQUIRED_LONG_PARAMETER_RFP_QUOTE_OPTION_ID_IS_NOT_PRESENT)
            );
    }

    @Test(description = "GET /v1/quotes/{rfpQuoteId}/file Download quote file error")
    public void testDownloadQuoteFileError() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_RFP_QUOTE_ID_FILE_PATH, NOT_FOUND_ID)
            .then()
            .body(MESSAGE_BODY_PATH,
                is(ERROR_THERE_WAS_AN_ISSUE_WITH_YOUR_REQUEST_PLEASE_TRY_AGAIN)
            );
    }

    @Test(description = "GET /v1/quotes/{rfpQuoteId}/file Download quote file invalid format")
    public void testDownloadQuoteFileInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_RFP_QUOTE_ID_FILE_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/quotes/status Retrieving status of quotes category dental")
    public void testRetrievingStatusOfQuotesDental() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_STATUS_CLIENT_ID_CATEGORY_PATH, getClientIdL(), DENTAL)
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/quotes/status Retrieving status of quotes category vision")
    public void testRetrievingStatusOfQuotesVision() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_STATUS_CLIENT_ID_CATEGORY_PATH, getClientIdL(), VISION)
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/quotes/status Retrieving status of quotes category medical")
    public void testRetrievingStatusOfQuotesMedical() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_STATUS_CLIENT_ID_CATEGORY_PATH, getClientIdL(), MEDICAL)
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/quotes/status Retrieving status of quotes invalid format")
    public void testRetrievingStatusOfQuotesInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_STATUS_CLIENT_ID_CATEGORY_PATH, INVALID_FORMAT, DENTAL)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/quotes/status Retrieving status of quotes not found client id")
    public void testRetrievingStatusOfQuotesNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_STATUS_CLIENT_ID_CATEGORY_PATH, NOT_FOUND_ID, DENTAL)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/quotes/status Retrieving status of quotes forbidden client id")
    public void testRetrievingStatusOfQuotesForbiddenClientId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_STATUS_CLIENT_ID_CATEGORY_PATH, DataConstants.FORBIDDEN_CLIENT_ID, DENTAL)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "GET /v1/quotes/options/{id}/riders Retrieving the riders by rfp_quote_option_id")
    public void testRetrievingTheRidersByRfpQuoteOptionId() {
        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_RIDERS_PATH, RFP_QUOTE_OPTION_ID)
            .then()
            .body(RFP_QUOTE_OPTION_ID_BODY_PATH, is(RFP_QUOTE_OPTION_ID.intValue()))
            .body(CARRIER_BODY_PATH, is(ANTHEM_BLUE_CROSS))
            .body(RIDERS_RIDER_ID_FIRST_BODY_PATH, is(RIDERS_ID))
            .body(RIDERS_RIDER_CODE_FIRST_BODY_PATH, is(RIDER_CODE))
            .body(RIDERS_RIDER_DESCRIPTION_FIRST_BODY_PATH, is(RIDER_DESCRIPTION_SIMPLY_ENGAGED))
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/quotes/options/{id}/riders Retrieving the riders no quote option found")
    public void testRetrievingTheRidersByRfpQuoteOptionIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_RIDERS_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "GET /v1/quotes/options/{id}/riders Retrieving the riders invalid format")
    public void testRetrievingTheRidersByRfpQuoteOptionIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_RIDERS_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/quotes/options/{id}/networks Retrieving the available networks for quote option by rfp_quote_option_id")
    public void testsRetrievingAvailableNetworksForQuoteOptionByRfpQuoteOptionId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_NETWORKS_PATH, RFP_QUOTE_OPTION_ID)
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/quotes/options/{id}/networks Retrieving the available networks for quote option by rfp_quote_option_id not found")
    public void testsRetrievingAvailableNetworksForQuoteOptionByRfpQuoteOptionIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_NETWORKS_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "GET /v1/quotes/options/{id}/networks Retrieving the available networks for quote option by rfp_quote_option_id invalid format")
    public void testsRetrievingAvailableNetworksForQuoteOptionByRfpQuoteOptionIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_NETWORKS_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/quotes/options/{id}/disclaimer Retrieving the disclaimer by rfp_quote_option_id")
    public void testsRetrievingTheDisclaimerByByRfpQuoteOptionId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_DISCLAIMER_PATH, RFP_QUOTE_OPTION_ID)
            .then()
            .statusCode(OK.value())
            .body(RFP_QUOTE_OPTION_ID_BODY_PATH, is(RFP_QUOTE_OPTION_ID.intValue()));
    }

    @Test(description = "GET /v1/quotes/options/{id}/disclaimer Retrieving the disclaimer by rfp_quote_option_id invalid format")
    public void testsRetrievingTheDisclaimerByByRfpQuoteOptionIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_DISCLAIMER_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/quotes/options/{id}/disclaimer Retrieving the disclaimer by rfp_quote_option_id not found")
    public void testsRetrievingTheDisclaimerByByRfpQuoteOptionIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_DISCLAIMER_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "GET /v1/quotes/options/{id}/avaliableNetworks Retrieving the available networks for switching from rfpQuoteNetworkId in current option by rfp_quote_option_id required")
    public void testsRetrievingTheAvailableNetworksForSwitchingFromRapQuoteNetworkIdInCurrentOptionByRapQuoteOptionIdRequired() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_AVAILABLE_NETWORKS_REQUIRED_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/quotes/options/{id}/avaliableNetworks Retrieving the available networks for switching from rfpQuoteNetworkId in current option by rfp_quote_option_id required not found option")
    public void testsRetrievingTheAvailableNetworksForSwitchingFromRapQuoteNetworkIdInCurrentOptionByRapQuoteOptionIdNotFoundOption() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_AVAILABLE_NETWORKS_RAP_QUOTE_NETWORK_ID_PATH, NOT_FOUND_ID,
                NOT_FOUND_ID
            )
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "GET /v1/quotes/options/{id}/avaliableNetworks Retrieving the available networks for switching from rfpQuoteNetworkId in current option by rfp_quote_option_id")
    public void testsRetrievingTheAvailableNetworksForSwitchingFromRapQuoteNetworkIdInCurrentOptionByRapQuoteOptionIdNotFoundQuote() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_AVAILABLE_NETWORKS_RAP_QUOTE_NETWORK_ID_PATH,
                RFP_QUOTE_OPTION_ID, RFP_QUOTE_OPTION_SECOND_ID
            )
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/quotes/options/{id}/avaliableNetworks Retrieving the available networks for switching from rfpQuoteNetworkId in current option by rfp_quote_option_id invalid format")
    public void testsRetrievingTheAvailableNetworksForSwitchingFromRapQuoteNetworkIdInCurrentOptionByRapQuoteOptionInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_AVAILABLE_NETWORKS_RAP_QUOTE_NETWORK_ID_PATH, INVALID_FORMAT,
                INVALID_FORMAT
            )
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/quotes/options/{id} Retrieving the rfp quote option by rfp_quote_option_id")
    public void testsRetrievingTheRfpQuoteOptionByRfpQuoteOptionId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_PATH, RFP_QUOTE_OPTION_ID)
            .then()
            .body(DETAILED_PLANS_RFP_QUOTE_OPTION_NETWORK_ID_FIRST_BODY_PATH,
                is(RFP_QUOTE_OPTION_NETWORK_ID)
            )
            .body(DETAILED_PLANS_RFP_QUOTE_NETWORK_ID_FIRST_BODY_PATH, is(RFP_QUOTE_NETWORK_ID))
            .body(DETAILED_PLANS_CARRIER_FIRST_BODY_PATH, is(ANTHEM_BLUE_CROSS))
            .body(DETAILED_PLANS_RFP_CARRIER_ID_FIRST_BODY_PATH, is(RFP_CARRIER_ID))
            .body(DETAILED_PLANS_TYPE_FIRST_BODY_PATH, is(PLAN_TYPE))
            .body(QUOTE_ID_BODY_PATH, is(QUOTE_ID))
            .body(ID_BODY_PATH, is(RFP_QUOTE_OPTION_ID.intValue()))
            .body(QUOTE_TYPE_BODY_PATH, is(STANDARD))
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/quotes/options/{id} Retrieving the rfp quote option by rfp_quote_option_id invalid format")
    public void testsRetrievingTheRfpQuoteOptionByRfpQuoteOptionIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "GET /v1/quotes/options/{id} Retrieving the rfp quote option by rfp_quote_option_id not found")
    public void testsRetrievingTheRfpQuoteOptionByRfpQuoteOptionIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_ID_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "GET /v1/quotes/options/selected Select the rfp quote option for final selection")
    public void testsSelectTheRfpQuoteOptionForFinalSelection() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_SELECTED_PATH, getClientIdL())
            .then()
            .statusCode(OK.value());
    }

    @Test(description = "GET /v1/quotes/options/selected Select the rfp quote option for final selection client not found")
    public void testsSelectTheRfpQuoteOptionForFinalSelectionClientNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_SELECTED_PATH, NOT_FOUND)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_CLIENT_NOT_FOUND));
    }

    @Test(description = "GET /v1/quotes/options/selected Select the rfp quote option for final selection Forbidden client")
    public void testsSelectTheRfpQuoteOptionForFinalSelectionForbiddenClient() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_SELECTED_PATH, DataConstants.FORBIDDEN_CLIENT_ID)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_FORBIDDEN));
    }

    @Test(description = "GET /v1/quotes/options/selected Select the rfp quote option for final selection invalid format")
    public void testsSelectTheRfpQuoteOptionForFinalSelectionInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .get(QUOTES_OPTIONS_SELECTED_PATH, INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }


}
