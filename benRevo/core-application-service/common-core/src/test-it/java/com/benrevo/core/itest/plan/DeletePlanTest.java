package com.benrevo.core.itest.plan;

import static com.benrevo.core.itest.util.DataConstants.THE_FORMS_WERE_SUCCESSFULLY_DELETED;
import static com.benrevo.core.itest.util.ErrorMessageConstants.ERROR_UNAUTHORIZED;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.MESSAGE_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.PATH_BODY_PATH;
import static com.benrevo.core.itest.util.JsonBodyPathConstants.RFP_QUOTE_NETWORK_PLAN_IDS_BODY_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.PLANS_CREATE_PATH;
import static com.benrevo.core.itest.util.RequestPathConstants.PLANS_DELETE_PATH;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.common.dto.DeletePlanDto;
import com.benrevo.core.AbstractBaseIt;
import io.restassured.http.ContentType;
import org.testng.annotations.Test;


/**
 * The  Delete plan test.
 */
public class DeletePlanTest extends AbstractBaseIt {


    private DeletePlanDto deletePlanDto = new DeletePlanDto();


    // FIXME: 10/4/2017 Need to fixed, No RFP quote network found, temporary this test is disabled.
    @Test(description = "DELETE /v1/plans/delete Delete plan in existing quote network",
        enabled = false)
    public void testDeletePlanInExistingQuoteNetwork() {
        long rfpQuoteNetworkId = 1L;
        CreatePlanDto createPlanDto = random(CreatePlanDto.class);
        createPlanDto.setRfpQuoteNetworkId(rfpQuoteNetworkId);
        deletePlanDto = new DeletePlanDto();
        deletePlanDto.setRfpQuoteNetworkId(rfpQuoteNetworkId);
        deletePlanDto.setRfpQuoteNetworkPlanIds(given().spec(baseSpec())
            .body(createPlanDto)
            .post(PLANS_CREATE_PATH)
            .then()
            .extract()
            .path(RFP_QUOTE_NETWORK_PLAN_IDS_BODY_PATH));
        given().spec(baseSpec())
            .contentType(ContentType.JSON)
            .body(deletePlanDto)
            .delete(PLANS_DELETE_PATH)
            .then()
            .statusCode(OK.value())
            .body(MESSAGE_BODY_PATH, message -> is(THE_FORMS_WERE_SUCCESSFULLY_DELETED));
    }

    @Test(description = "DELETE /v1/plans/delete Delete plan in existing quote network. Unauthorized.")
    public void testDeletePlanInExistingQuoteNetworkUnauthorized() {
        given().spec(unauthorizedSpec())
            .contentType(ContentType.JSON)
            .body(deletePlanDto)
            .delete(PLANS_DELETE_PATH)
            .then()
            .statusCode(UNAUTHORIZED.value())
            .body(MESSAGE_BODY_PATH, message -> is(ERROR_UNAUTHORIZED))
            .body(PATH_BODY_PATH, path -> containsString(PLANS_DELETE_PATH));
    }

}
