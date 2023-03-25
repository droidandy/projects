package com.benrevo.core.itest.client.plan;

import static com.benrevo.core.itest.util.RequestPathConstants.CLIENTS_CLIENT_ID_PLANS_PATH;
import static io.restassured.RestAssured.given;
import static io.restassured.http.ContentType.JSON;

import com.benrevo.core.AbstractBaseIt;


/**
 * The type Client plan base.
 */
public class ClientPlanBase extends AbstractBaseIt {

    Long clientPlanId = 1L;
    String clientPlan = "{" + "\"client_id\": 1," + "\"pnn_id\": 1," + "\"tier1_census\": 20,"
        + "\"tier2_census\": 20," + "\"tier3_census\": 20," + "\"tier4_census\": 20,"
        + "\"tier1_rate\": 500," + "\"tier2_rate\": 1000," + "\"tier3_rate\": 1400,"
        + "\"tier4_rate\": 1800," + "\"tier1_renewal\": 0," + "\"tier2_renewal\": 0,"
        + "\"tier3_renewal\": 0," + "\"tier4_renewal\": 0,"
        + "\"er_contribution_format\": \"DOLLAR\"," + "\"tier1_er_contribution\": 55,"
        + "\"tier2_er_contribution\": 50," + "\"tier3_er_contribution\": 50,"
        + "\"tier4_er_contribution\": 50," + "\"out_of_state\": false," + "\"planType\": \"HMO\","
        + "\"isKaiser\": false }";


    public void createClintPlan() {
        given().spec(baseSpec())
            .contentType(JSON)
            .body(clientPlan)
            .post(CLIENTS_CLIENT_ID_PLANS_PATH, getClientIdL());

    }

}
