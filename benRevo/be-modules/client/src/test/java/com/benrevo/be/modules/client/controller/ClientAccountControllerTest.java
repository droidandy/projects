package com.benrevo.be.modules.client.controller;

import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.controller.BaseControllerTest;
import com.benrevo.common.dto.ClientAccountDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.repository.ClientTeamRepository;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

public class ClientAccountControllerTest extends BaseControllerTest {

	@Value("${app.carrier}")
	private String[] appCarrier;

	@Autowired
	private ClientAccountController accountController;
	
	@Autowired
	private ClientTeamRepository clientTeamRepository;

    @Override
    protected Object getController() {
        return accountController;
    }

	@Test
	public void updateClientAccountMetadata() throws Exception {

		Client client = testEntityHelper.createTestClient();
		ClientTeam team = testEntityHelper.createClientTeam(client.getBroker(), client);
		token = authenticationService.createTokenForBroker(client.getBroker().getBrokerToken(), team.getAuthId(), appCarrier);
		
		ClientAccountDto params = new ClientAccountDto();
		params.setFirstName("firstName");
		params.setLastName("lastName");

		User res = new User("test");
		res.setUserMetadata(
			build(
				entry("first_name", params.getFirstName()),
				entry("last_name", params.getLastName())
			)
		);
		res.setEmail("value1");
		
		when(mgmtAPI.users().update(anyString(), any(User.class)).execute()).thenReturn(res);

		String result = performPut("/v1/accounts/users", params);
		ClientMemberDto cm = gson.fromJson(result, ClientMemberDto.class);
		
		assertThat(cm.getFirstName()).isEqualTo(params.getFirstName());
		assertThat(cm.getLastName()).isEqualTo(params.getLastName());
		assertThat(cm.getFullName()).isEqualTo(params.getFirstName() + " " + params.getLastName());
		
		// check for client team name updated in DB
		ClientTeam updatedTeam = clientTeamRepository.findOne(team.getId());
		assertThat(updatedTeam.getName()).isEqualTo(cm.getFullName());
		
	}


}
