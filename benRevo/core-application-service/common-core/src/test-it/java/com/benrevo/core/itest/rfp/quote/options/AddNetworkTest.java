package com.benrevo.core.itest.rfp.quote.options;

import static com.benrevo.core.itest.util.DataConstants.NOT_FOUND_ID;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_CLIENT_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_FORBIDDEN;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_MAY_NOT_BE_NULL;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_QUOTE_OPTION_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_NO_QUOTE_OPTION_NETWORK_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.SELECT_RIDER_BY_OPTION_NETWORK;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.ERRORS_CLIENT_ID_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_ID_ADD_NETWORK_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_NETWORKS_ID_RIDERS_ID_UNSELECT_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_NETWORKS_NETWORK_ID_RIDERS_RIDER_ID_SELECT_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_SELECT_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_UN_SELECT_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.QUOTES_OPTIONS_SUBMIT;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;

import com.benrevo.common.dto.CreateRfpQuoteOptionNetworkDto;
import com.benrevo.common.dto.QuoteOptionSubmissionDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import org.testng.annotations.Test;


/**
 * The  Add network api test. Swagger https://devapi.benrevo.com/swagger-ui.html#!/rfp-quote-controller/createRfpQuoteOptionNetworkUsingPOST
 */
public class AddNetworkTest extends AbstractBaseIt {

    private static final long NETWORK_ID = 2L;
    private static final long RFP_QUOTE_NETWORK_ID = 33L;
    private Long rfpQuoteOptionId = 1L;
    private Long riderId = 1L;


    @Test(description = "POST /v1/quotes/options/{id}/addNetwork Adding the RfpQuoteOptionNetwork item to existing option Invalid Combination")
    public void testAddingTheRfpQuoteOptionNetworkItemToExistingOptionInvalidCombination() {
        CreateRfpQuoteOptionNetworkDto createRfpQuoteOptionNetworkDto =
            new CreateRfpQuoteOptionNetworkDto();
        createRfpQuoteOptionNetworkDto.setClientPlanId(getClientIdL());
        createRfpQuoteOptionNetworkDto.setNetworkId(NETWORK_ID);
        createRfpQuoteOptionNetworkDto.setRfpQuoteNetworkId(RFP_QUOTE_NETWORK_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(createRfpQuoteOptionNetworkDto)
            .post(QUOTES_OPTIONS_ID_ADD_NETWORK_PATH, rfpQuoteOptionId)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "POST /v1/quotes/options/{id}/addNetwork Adding the RfpQuoteOptionNetwork item to existing option error")
    public void testAddingTheRfpQuoteOptionNetworkItemToExistingOptionError() {
        CreateRfpQuoteOptionNetworkDto createRfpQuoteOptionNetworkDto =
            new CreateRfpQuoteOptionNetworkDto();
        createRfpQuoteOptionNetworkDto.setRfpQuoteNetworkId(RFP_QUOTE_NETWORK_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(createRfpQuoteOptionNetworkDto)
            .post(QUOTES_OPTIONS_ID_ADD_NETWORK_PATH, rfpQuoteOptionId)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "POST /v1/quotes/options/{id}/addNetwork Adding the RfpQuoteOptionNetwork item to existing option")
    public void testAddingTheRfpQuoteOptionNetworkItemToExistingOption() {
        CreateRfpQuoteOptionNetworkDto createRfpQuoteOptionNetworkDto =
            new CreateRfpQuoteOptionNetworkDto();
        createRfpQuoteOptionNetworkDto.setClientPlanId(getClientIdL());
        createRfpQuoteOptionNetworkDto.setNetworkId(NETWORK_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(createRfpQuoteOptionNetworkDto)
            .post(QUOTES_OPTIONS_ID_ADD_NETWORK_PATH, rfpQuoteOptionId)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "POST /v1/quotes/options/{id}/addNetwork Adding the RfpQuoteOptionNetwork item to existing option not found")
    public void testAddingTheRfpQuoteOptionNetworkItemToExistingNotFoundOptionId() {
        CreateRfpQuoteOptionNetworkDto createRfpQuoteOptionNetworkDto =
            new CreateRfpQuoteOptionNetworkDto();
        createRfpQuoteOptionNetworkDto.setClientPlanId(getClientIdL());
        createRfpQuoteOptionNetworkDto.setNetworkId(NETWORK_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(createRfpQuoteOptionNetworkDto)
            .post(QUOTES_OPTIONS_ID_ADD_NETWORK_PATH, NOT_FOUND_ID)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "POST /v1/quotes/options/{id}/addNetwork Adding the RfpQuoteOptionNetwork item to existing option invalid format")
    public void testAddingTheRfpQuoteOptionNetworkItemToExistingInvalidFormat() {
        CreateRfpQuoteOptionNetworkDto createRfpQuoteOptionNetworkDto =
            new CreateRfpQuoteOptionNetworkDto();
        createRfpQuoteOptionNetworkDto.setClientPlanId(getClientIdL());
        createRfpQuoteOptionNetworkDto.setNetworkId(NETWORK_ID);

        given().spec(baseSpec())
            .contentType(JSON)
            .body(createRfpQuoteOptionNetworkDto)
            .post(QUOTES_OPTIONS_ID_ADD_NETWORK_PATH, DataConstants.INVALID_FORMAT)
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "POST /v1/quotes/options/{optionId}/riders/{riderId}/select Select rider by option id and rider id")
    public void testSelectRiderByOptionIdAndRiderId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_SELECT_PATH, rfpQuoteOptionId, riderId)
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "POST /v1/quotes/options/{optionId}/riders/{riderId}/select Select rider by option id and rider id error")
    public void testSelectRiderByOptionIdAndRiderIdError() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_SELECT_PATH, rfpQuoteOptionId,
                NOT_FOUND_ID
            )
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "POST /v1/quotes/options/{optionId}/riders/{riderId}/select Select rider by option id and rider id invalid format")
    public void testSelectRiderByOptionIdAndRiderIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_SELECT_PATH,
                DataConstants.INVALID_FORMAT, riderId
            )
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "POST /v1/quotes/options/{optionId}/riders/{riderId}/select Select rider by option id and rider id not found")
    public void testSelectRiderByOptionIdAndRiderIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_SELECT_PATH, NOT_FOUND_ID,
                riderId
            )
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_NO_QUOTE_OPTION_FOUND))

        ;
    }

    @Test(description = "POST /v1/quotes/options/{optionId}/riders/{riderId}/unselect Unselect rider by option id and rider")
    public void testUnSelectRiderByOptionIdAndRiderId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_UN_SELECT_PATH, rfpQuoteOptionId,
                riderId
            )
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "POST /v1/quotes/options/{optionId}/riders/{riderId}/unselect Unselect rider by option id and rider id error")
    public void testUnSelectRiderByOptionIdAndRiderIdError() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_UN_SELECT_PATH, rfpQuoteOptionId,
                NOT_FOUND_ID
            )
            .then()
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "POST /v1/quotes/options/{optionId}/riders/{riderId}/unselect Unselect rider by option id and rider id invalid format")
    public void testUnSelectRiderByOptionIdAndRiderIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_UN_SELECT_PATH,
                DataConstants.INVALID_FORMAT, NOT_FOUND_ID
            )
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));
    }

    @Test(description = "POST /v1/quotes/options/{optionId}/riders/{riderId}/unselect Unselect rider by option id and rider id not found")
    public void testUnSelectRiderByOptionIdAndRiderIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_OPTION_ID_RIDERS_RIDER_ID_UN_SELECT_PATH,
                NOT_FOUND_ID, NOT_FOUND_ID
            )
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_FOUND));
    }

    @Test(description = "POST /v1/quotes/options/submit Submit the rfp quote option for purchase to the carrier error")
    public void testSubmitTheRfpQuoteOptionForPurchaseToTheCarrierError() {

        QuoteOptionSubmissionDto quoteOptionSubmissionDto = new QuoteOptionSubmissionDto();
        given().spec(baseSpec())
            .contentType(JSON)
            .body(quoteOptionSubmissionDto)
            .post(QUOTES_OPTIONS_SUBMIT)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_CLIENT_ID_BODY_PATH, startsWith(ERROR_MAY_NOT_BE_NULL));

    }

    @Test(description = "POST /v1/quotes/options/submit Submit the rfp quote option for purchase to the carrier not found client id")
    public void testSubmitTheRfpQuoteOptionForPurchaseToTheCarrierNotFoundClient() {

        QuoteOptionSubmissionDto quoteOptionSubmissionDto = random(QuoteOptionSubmissionDto.class);
        quoteOptionSubmissionDto.setDentalQuoteOptionId(null);
        quoteOptionSubmissionDto.setMedicalQuoteOptionId(null);
        quoteOptionSubmissionDto.setVisionQuoteOptionId(null);
        quoteOptionSubmissionDto.setSubmissionSuccessful(false);
        quoteOptionSubmissionDto.setErrorMessage("not found");
        quoteOptionSubmissionDto.setClientId(NOT_FOUND_ID);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(quoteOptionSubmissionDto)
            .post(QUOTES_OPTIONS_SUBMIT)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_CLIENT_NOT_FOUND));

    }

    @Test(description = "POST /v1/quotes/options/submit Submit the rfp quote option for purchase to the carrier forbidden client id")
    public void testSubmitTheRfpQuoteOptionForPurchaseToTheCarrierForbidden() {

        QuoteOptionSubmissionDto quoteOptionSubmissionDto = random(QuoteOptionSubmissionDto.class);
        quoteOptionSubmissionDto.setClientId(DataConstants.FORBIDDEN_CLIENT_ID);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(quoteOptionSubmissionDto)
            .post(QUOTES_OPTIONS_SUBMIT)
            .then()
            .statusCode(FORBIDDEN.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FORBIDDEN));

    }

    @Test(description = "POST /v1/quotes/options/submit Submit the rfp quote option for purchase to the carrie, client id null")
    public void testSubmitTheRfpQuoteOptionForPurchaseToTheCarrierClientIdNull() {

        QuoteOptionSubmissionDto quoteOptionSubmissionDto = random(QuoteOptionSubmissionDto.class);
        quoteOptionSubmissionDto.setClientId(null);
        given().spec(baseSpec())
            .contentType(JSON)
            .body(quoteOptionSubmissionDto)
            .post(QUOTES_OPTIONS_SUBMIT)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(ERRORS_CLIENT_ID_BODY_PATH, startsWith(ERROR_MAY_NOT_BE_NULL));

    }

    // FIXME: 10/5/2017 "No quote option network found",
    @Test(description = "POST /v1/quotes/options/networks/{networkId}/riders/{riderId}/select Select rider by option network id and rider id",
        enabled = false)
    public void testSelectRiderByOptionNetworkIdAndRiderId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_NETWORKS_NETWORK_ID_RIDERS_RIDER_ID_SELECT_PATH, NETWORK_ID,
                riderId
            )
            .then()
            .statusCode(OK.value())
            .body(MESSAGE_BODY_PATH, is(SELECT_RIDER_BY_OPTION_NETWORK))

        ;
    }

    @Test(description = "POST /v1/quotes/options/networks/{networkId}/riders/{riderId}/select Select rider by option network id and rider id not found")
    public void testSelectRiderByOptionNetworkIdAndRiderIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_NETWORKS_NETWORK_ID_RIDERS_RIDER_ID_SELECT_PATH,
                NOT_FOUND_ID, NOT_FOUND_ID
            )
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_NETWORK_FOUND))

        ;

    }

    @Test(description = "POST /v1/quotes/options/networks/{networkId}/riders/{riderId}/select Select rider by option network id and rider id invalid format")
    public void testSelectRiderByOptionNetworkIdAndRiderIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_NETWORKS_NETWORK_ID_RIDERS_RIDER_ID_SELECT_PATH,
                DataConstants.INVALID_FORMAT, DataConstants.INVALID_FORMAT
            )
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));

    }

    @Test(description = "POST /v1/quotes/options/networks/{networkId}/riders/{riderId}/unselect Unselect rider by option network id and rider id")
    public void testUnSelectRiderByOptionNetworkIdAndRiderIdInvalidFormat() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_NETWORKS_ID_RIDERS_ID_UNSELECT_PATH, DataConstants.INVALID_FORMAT,
                DataConstants.INVALID_FORMAT
            )
            .then()
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_FAILED_TO_CONVERT_VALUE_OF_TYPE));

    }

    // FIXME: 10/5/2017 "No quote option network found"
    @Test(description = "POST /v1/quotes/options/networks/{networkId}/riders/{riderId}/unselect Unselect rider by option network id and rider id",
        enabled = false)
    public void testUnSelectRiderByOptionNetworkIdAndRiderId() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_NETWORKS_ID_RIDERS_ID_UNSELECT_PATH, NETWORK_ID, riderId)
            .then()
            .statusCode(OK.value())
            .body(MESSAGE_BODY_PATH, is(SELECT_RIDER_BY_OPTION_NETWORK))

        ;
    }

    @Test(description = "POST /v1/quotes/options/networks/{networkId}/riders/{riderId}/unselect Unselect rider by option network id and rider id not found")
    public void testUnSelectRiderByOptionNetworkIdAndRiderIdNotFound() {

        given().spec(baseSpec())
            .contentType(JSON)
            .post(QUOTES_OPTIONS_NETWORKS_ID_RIDERS_ID_UNSELECT_PATH, NOT_FOUND_ID,
                NOT_FOUND_ID
            )
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_NO_QUOTE_OPTION_NETWORK_FOUND))

        ;

    }


}
