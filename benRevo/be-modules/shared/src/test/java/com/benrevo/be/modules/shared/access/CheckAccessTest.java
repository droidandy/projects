package com.benrevo.be.modules.shared.access;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.PersonRelation;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.PersonRelationRepository;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.junit.After;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

public class CheckAccessTest extends AbstractControllerTest {

    @Autowired
    private CheckAccess checkAccess;
    
    @Autowired
    private PersonRelationRepository personRelationRepository;

    @Autowired
    private BrokerRepository brokerRepository;
    
    @Override
    public void init() throws Exception {

    }
    
    @After
    public void cleanUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void findAvailableBrokers() throws Exception {

        Person testManager = testEntityHelper.createTestPerson(PersonType.CARRIER_MANAGER, 
            "testCarrManager", "testCarrierManagerEmail", appCarrier[0]);
        
        Broker presalesBroker = testEntityHelper.createTestBroker("testPresalesBroker");
        
        Broker salesBroker = testEntityHelper.createTestBroker("testSalesBroker");

        for(Person presale : presalesBroker.getPresales()) {
            PersonRelation pr1 = personRelationRepository.save(new PersonRelation(testManager, presale)); 
        }
        for(Person sale : salesBroker.getSales()) {
            PersonRelation pr2 = personRelationRepository.save(new PersonRelation(testManager, sale));
        }

        AuthenticatedUser authentication = new AuthenticatedUser.Builder()
            .withRoles(Arrays.asList(AccountRole.CARRIER_MANAGER.getValue()))
            .withEmail(testManager.getEmail()).build();
        
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        User user = Mockito.mock(User.class);
        when(user.getLoginsCount()).thenReturn(3);
        when(user.getLastLogin()).thenReturn(new Date());
        when(user.getEmail()).thenReturn("testCarrierManagerEmail");
        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);
        
        List<Broker> brokers = checkAccess.findAvailableBrokers();
         
        assertThat(brokers).containsExactlyInAnyOrder(salesBroker, presalesBroker);
    }
}
