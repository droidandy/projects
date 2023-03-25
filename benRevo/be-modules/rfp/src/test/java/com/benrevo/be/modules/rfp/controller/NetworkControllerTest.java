package com.benrevo.be.modules.rfp.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.BaseControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AdministrativeFeeDto;
import com.benrevo.common.dto.CarrierByProductDto;
import com.benrevo.common.dto.CarrierDto;
import com.benrevo.common.dto.NetworkDto;
import com.benrevo.common.dto.PlanNameByNetworkDto;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.google.common.collect.Sets;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class NetworkControllerTest extends BaseControllerTest {

	@Autowired
	private NetworkController networkController;   
	
	@Override
	protected Object getController() {
		return networkController;
	}
	
	@Test
    public void getNetworksForCarrier() throws Exception { 
	    Carrier carrier = testEntityHelper.createTestCarrier();
	    
	    testEntityHelper.createTestNetwork(carrier, "HMO");
	    testEntityHelper.createTestNetwork(carrier, "PPO");
	    
	    String result = performGet("/v1/carrier/{carrierId}/network/{type}/all", EMPTY, 
	        carrier.getCarrierId(), "HMO");
	    NetworkDto[] resultList = gson.fromJson(result, NetworkDto[].class);
	    assertThat(resultList).hasSize(1);
	    assertThat(resultList[0]).hasNoNullFieldsOrProperties();
	}
	
	@Test
    public void getAllNetworksForCarrier() throws Exception { 
        Carrier carrier = testEntityHelper.createTestCarrier();
        
        testEntityHelper.createTestNetwork(carrier, "HMO");
        testEntityHelper.createTestNetwork(carrier, "PPO");
        
        String result = performGet("/v1/carrier/{carrierId}/networks", EMPTY, carrier.getCarrierId());
        NetworkDto[] resultList = gson.fromJson(result, NetworkDto[].class);
        assertThat(resultList).hasSize(2);
        assertThat(resultList[0]).hasNoNullFieldsOrProperties();
    }
	
	
	@Test
	public void getPlansForNetwork() throws Exception {			
	    Carrier carrier = testEntityHelper.createTestCarrier();
        Network network = testEntityHelper.createTestNetwork(carrier, "HMO", "Test network");
        Plan plan1 = testEntityHelper.createTestPlan(carrier, "Plan 1", "HMO");
        Plan plan2 = testEntityHelper.createTestPlan(carrier, "Plan 2", "HMO");
        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork(plan1, network);
        PlanNameByNetwork pnn2 = testEntityHelper.createTestPlanNameByNetwork(plan2, network);


		String response = performGet("/v1/network/{networkId}/plans", EMPTY, network.getNetworkId());
		
		PlanNameByNetworkDto[] result = gson.fromJson(response, PlanNameByNetworkDto[].class);

		assertThat(result).hasSize(2);
		for(PlanNameByNetworkDto pnn : result) {
		    assertThat(pnn).hasNoNullFieldsOrProperties();
        }
		assertThat(result).extracting(PlanNameByNetworkDto::getPnnId)
		    .containsExactlyInAnyOrder(pnn1.getPnnId(), pnn2.getPnnId());
	}
}
