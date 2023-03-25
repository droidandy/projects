package com.benrevo.core.itest.plan;


import static com.benrevo.core.itest.util.DataConstants.JSON_EMPTY_OBJECT;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_BAD_REQUEST_CREATE_PLAN_DTO_HAS_2_ERROR_S;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_QUOTE_NETWORK_NOT_FOUND;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_REQUIRED_REQUEST_BODY_IS_MISSING;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.RFP_QUOTE_NETWORK_PLAN_IDS_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.PLANS_CREATE_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static org.apache.commons.lang3.StringUtils.EMPTY;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.common.dto.DeletePlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.core.AbstractBaseIt;
import com.benrevo.core.itest.util.DataConstants;
import io.restassured.http.ContentType;
import java.util.Arrays;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;


/**
 * The Create plan test.
 */
public class CreatePlanTest extends AbstractBaseIt {

    private CreatePlanDto createPlanDto;
    private DeletePlanDto deletePlanDto;

    @BeforeClass
    public void setUp() {
        long rfpQuoteNetworkId = 1L;
        createPlanDto = random(CreatePlanDto.class);
        QuoteOptionAltPlanDto.Benefit ambulance =
            new QuoteOptionAltPlanDto.Benefit("AMBULANCE", "Ambulance", "1", "STRING");
        QuoteOptionAltPlanDto.Benefit pcp =
            new QuoteOptionAltPlanDto.Benefit("PCP", "PCP", "$10", "10%", "DOLLAR", "PERCENT");
        createPlanDto.setBenefits(Arrays.asList(ambulance, pcp));
        createPlanDto.setRfpQuoteNetworkId(rfpQuoteNetworkId);
        createPlanDto.setCarrierId(1L);

        deletePlanDto = new DeletePlanDto();
        deletePlanDto.setRfpQuoteNetworkId(rfpQuoteNetworkId);
    }

    // FIXME: 10/4/2017 Need to fixed, No RFP quote network found, temporary this test is disabled.
    @Test(description = "POST /v1/plans/create Create new plan in existing quote network",
        enabled = false)
    public void testCreateNewPlanInExistingQuoteNetwork() {
        deletePlanDto.setRfpQuoteNetworkPlanIds(given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(createPlanDto)
            .post(PLANS_CREATE_PATH)
            .then()
            .statusCode(OK.value())
            .extract()
            .path(RFP_QUOTE_NETWORK_PLAN_IDS_BODY_PATH));
    }

    @Test(description = "POST /v1/plans/create Create new plan in existing quote network. Not Found.")
    public void testCreateNewPlanInExistingQuoteNetworkNotFound() {
        createPlanDto.setCarrierId(DataConstants.NOT_FOUND_ID);
        createPlanDto.setNameByNetwork(DataConstants.INVALID_FORMAT);
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(createPlanDto)
            .post(PLANS_CREATE_PATH)
            .then()
            .statusCode(NOT_FOUND.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_QUOTE_NETWORK_NOT_FOUND));
    }

    @Test(description = "POST /v1/plans/create Create new plan in existing quote network.Unauthorized.")
    public void testCreateNewPlanInExistingQuoteNetworkUnauthorized() {

        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .body(createPlanDto)
            .post(PLANS_CREATE_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, is(ERROR_UNAUTHORIZED));
    }

    @Test(description = "POST /v1/plans/create Create new plan in existing quote network. Empty Body.")
    public void testCreateNewPlanInExistingQuoteNetworkEmptyBody() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(EMPTY)
            .post(PLANS_CREATE_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_REQUIRED_REQUEST_BODY_IS_MISSING));
    }

    @Test(description = "POST /v1/plans/create Create new plan in existing quote network.Json Empty Object.")
    public void testCreateNewPlanInExistingQuoteNetworkJsonEmptyObject() {

        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(JSON_EMPTY_OBJECT)
            .post(PLANS_CREATE_PATH)
            .then()
            .statusCode(BAD_REQUEST.value())
            .body(MESSAGE_BODY_PATH, startsWith(ERROR_BAD_REQUEST_CREATE_PLAN_DTO_HAS_2_ERROR_S));
    }

}


