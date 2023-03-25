package com.benrevo.be.modules.shared.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.json.mgmt.users.User;
import com.benrevo.common.dto.UserStatusDto;
import com.benrevo.common.enums.UserAttributeName;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.UserAttribute;
import com.benrevo.data.persistence.repository.UserAttributeRepository;
import java.util.Date;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

public class SharedAccountControllerTest extends BaseControllerTest {

	@Value("${app.carrier}")
	private String[] appCarrier;

	@Autowired
	private SharedAccountController accountController;
	
	@Autowired
	private UserAttributeRepository userAttributeRepository;

	@Override
	protected Object getController() {
		return accountController;
	}

	@Test
    public void getUserStatusTest() throws Exception {

        Broker broker = testEntityHelper.createTestBroker();
        token = createToken(broker.getBrokerToken());

        userAttributeRepository.save(new UserAttribute(TEST_AUTHID, UserAttributeName.OPTION_OVERVIEW_TOUR_COMPLETED));
        
        User user = Mockito.mock(User.class);
        when(user.getLoginsCount()).thenReturn(3);
        when(user.getLastLogin()).thenReturn(new Date());
        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);

        String result = performGet("/v1/accounts/users/status", new Object[] {});
        
        UserStatusDto status = gson.fromJson(result, UserStatusDto.class);
        
        assertThat(status.getLoginCount()).isEqualTo(3);
        assertThat(status.getAttributes()).hasSize(1);
        assertThat(status.getAttributes().get(0)).isEqualTo(UserAttributeName.OPTION_OVERVIEW_TOUR_COMPLETED);

    }

}
