package com.benrevo.be.modules.shared.controller;

import static org.apache.commons.lang3.ArrayUtils.toArray;

import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.access.BrokerageRole;
import com.benrevo.be.modules.shared.access.CheckAccess;
import com.benrevo.be.modules.shared.security.TokenAuthenticationService;
import com.benrevo.common.dto.AnswerDto;
import com.benrevo.data.persistence.entities.Client;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

public class RoleAccessTestControllerTest extends BaseControllerTest {

    @Autowired
	private RoleAccessTestController roleAccessTestController;   
    
    @Autowired
    protected TokenAuthenticationService authenticationService;
	
    @Override
	protected Object getController() {
		return roleAccessTestController;
	}
    
    @Test
    public void brokerageCheck() throws Exception {   
        Client client = testEntityHelper.createTestClient();
        // no role check on annotation, allowes access for all roles
        token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, TEST_AUTHID, 
            BrokerageRole.USER.getValue(), toArray("any_role"), appCarrier);
        // use token from wrong broker: access to client not allowed
        performGet(HttpStatus.FORBIDDEN, "/v1/brokerageCheck/{clientId}", EMPTY, client.getClientId());
        
        // use token from client's broker: access to client allowed
        token = authenticationService.createTokenForBroker(client.getBroker().getBrokerToken(), TEST_AUTHID, 
            toArray("any_role"), appCarrier);

        performGet("/v1/brokerageCheck/{clientId}", EMPTY, client.getClientId());
    }
    
    @Test
    public void brokerageCheck_CarrierRep() throws Exception {   
        Client client = testEntityHelper.createTestClient();
        // use token from test broker (not linked to current client)
        token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, TEST_AUTHID, 
            BrokerageRole.USER.getValue(), toArray("any_role"), appCarrier);
        // access to client not allowed
        performGet(HttpStatus.FORBIDDEN, "/v1/brokerageCheck/{clientId}", EMPTY, client.getClientId());
        
        // but if broker has any role from Carrier Rep list, brokerage check will be ignored
        token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, TEST_AUTHID, 
            toArray(AccountRole.CARRIER_MANAGER.getValue()), appCarrier);

        performGet("/v1/brokerageCheck/{clientId}", EMPTY, client.getClientId());
    }
    
    @Test
    public void brokerageCheck_AnyRoleRequired() throws Exception {
        Client client = testEntityHelper.createTestClient();
        
        // no role check on annotation, allowes access for any role 
        token = authenticationService.createTokenForBroker(client.getBroker().getBrokerToken(), 
            TEST_AUTHID, toArray("any_role"), appCarrier);
        performGet("/v1/brokerageCheck/{clientId}", EMPTY, client.getClientId());
        
        // but default role access check requires not null role
        token = authenticationService.createTokenForBroker(
            client.getBroker().getBrokerToken(), TEST_AUTHID, null, appCarrier);
        performGet(HttpStatus.FORBIDDEN, "/v1/brokerageCheck/{clientId}", EMPTY, client.getClientId());
    }
    
    @Ignore // resolver moved to onboarding module
    @Test
    public void brokerageCheckWithResolver() throws Exception {
        
        Client client = testEntityHelper.createTestClient();
        // no role check on annotation, allowes access for all roles
        token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, TEST_AUTHID, 
            BrokerageRole.USER.getValue(), toArray("any_role"), appCarrier);

        AnswerDto dto = new AnswerDto();
        dto.setClientId(client.getClientId());
        // access with wrong brokerage is restricted
        performPost(HttpStatus.FORBIDDEN, "/v1/brokerageCheckWithResolver", dto);

        // correct brokerage
        token = authenticationService.createTokenForBroker(
            client.getBroker().getBrokerToken(), TEST_AUTHID, toArray("any_role"), appCarrier);
        performPost("/v1/brokerageCheckWithResolver", dto);
    }
    
    @Test
    public void brokerageCheckResolveOnExpression() throws Exception {
        Client client = testEntityHelper.createTestClient();
        AnswerDto dto = new AnswerDto();
        dto.setClientId(client.getClientId());

        token = authenticationService.createTokenForBroker(
            client.getBroker().getBrokerToken(), TEST_AUTHID, toArray("any_role"), appCarrier);
        performPost("/v1/brokerageCheckResolveOnExpression", dto);
    }

    @Ignore // resolver moved to onboarding module
    @Test
    public void brokerageCheckWithResolverAndRoles() throws Exception {    
        Client client = testEntityHelper.createTestClient();
        AnswerDto dto = new AnswerDto();
        dto.setClientId(client.getClientId());
        
        //  API allow access for 'client' role only
        // access with wrong role is restricted
        token = authenticationService.createTokenForBroker(
            client.getBroker().getBrokerToken(), TEST_AUTHID, toArray("any_role"), appCarrier);
        performPost(HttpStatus.FORBIDDEN, "/v1/brokerageCheckWithResolverAndRoles", dto);

        // correct role
        token = authenticationService.createTokenForBroker(
            client.getBroker().getBrokerToken(), TEST_AUTHID, toArray(AccountRole.CLIENT.getValue()), appCarrier);
        
        performPost("/v1/brokerageCheckWithResolverAndRoles", dto);
    }
    
	@Test
	public void controllerRoleCheck() throws Exception {
	    
	    // allowead any from CheckAccess.CLIENT_MODULE_ACCESS_ROLES array
	    token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, TEST_AUTHID, 
	        toArray(CheckAccess.CLIENT_MODULE_ACCESS_ROLES[0].getValue()), appCarrier);

		performGet("/v1/controllerRoleCheck", EMPTY);
		
		// not allowed for 'any_role'
		token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, TEST_AUTHID, 
		    toArray("any_role"), appCarrier);
		performGet(HttpStatus.FORBIDDEN, "/v1/controllerRoleCheck", EMPTY);
	}
	
	@Test
    public void methodSingleRoleCheck() throws Exception {
	    // allowed role for method explicitly set to 'client'
        token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, TEST_AUTHID, 
            toArray(AccountRole.CLIENT.getValue()), appCarrier);

        performGet("/v1/methodSingleRoleCheck", EMPTY);
    }

	@Test
    public void methodModuleRoleCheck() throws Exception {
        // allowed roles for method set by module predefined constant
        token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, TEST_AUTHID, 
            toArray(CheckAccess.PRESENTATION_MODULE_ACCESS_ROLES[0].getValue()), appCarrier);

        performGet("/v1/methodModuleRoleCheck", EMPTY);
    }
}
