package com.benrevo.be.modules.presentation.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.BaseControllerTest;
import com.benrevo.common.enums.UserAttributeName;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.UserAttribute;
import com.benrevo.data.persistence.repository.UserAttributeRepository;
import java.util.List;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

public class PresentationAccountControllerTest extends BaseControllerTest {

	@Value("${app.carrier}")
	private String[] appCarrier;

	@Autowired
	private PresentationAccountController accountController;
	
	@Autowired
	private UserAttributeRepository userAttributeRepository;

	@Override
	protected Object getController() {
		return accountController;
	}

	@Test
    public void createUserAttributeTest() throws Exception {

        Broker broker = testEntityHelper.createTestBroker();
        token = createToken(broker.getBrokerToken());
        
        performPostWithParam("/v1/accounts/users/attribute", new Object[] {"attribute", UserAttributeName.OPTION_LIST_TOUR_COMPLETED});

        List<UserAttribute> attributes = userAttributeRepository.findByAuthId(TEST_AUTHID);
        
        assertThat(attributes).hasSize(1);
        assertThat(attributes.get(0).getName()).isEqualTo(UserAttributeName.OPTION_LIST_TOUR_COMPLETED);

	}
	
}
