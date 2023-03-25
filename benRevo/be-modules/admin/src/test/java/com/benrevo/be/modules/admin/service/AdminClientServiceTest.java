package com.benrevo.be.modules.admin.service;


import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.common.enums.ClientState;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.ExtBrokerageAccess;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientTeamRepository;
import com.benrevo.data.persistence.repository.ExtBrokerageAccessRepository;
import com.benrevo.data.persistence.repository.ExtClientAccessRepository;
import java.util.Date;
import java.util.List;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class AdminClientServiceTest extends AdminAbstractControllerTest {

    @Autowired
    protected ClientRepository clientRepository;

    @Autowired
    protected ClientTeamRepository clientTeamRepository;

    @Autowired
    protected AdminClientService adminClientService;

    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;

    @Test
    public void updateClientStateToClosed() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.buildTestClient("ClosedStateClient", broker);
        client.setClientState(ClientState.QUOTED);
        client.setEffectiveDate(DateUtils.addYears(new Date(), 1));
        client = clientRepository.save(client);
        
        flushAndClear();
        
        adminClientService.updateClientStateToClosed();
        
        client = clientRepository.findOne(client.getClientId());
        
        // state should not changed, because EffectiveDate is actual
        assertThat(client.getClientState()).isEqualTo(ClientState.QUOTED);
        
        // set effectiveDate to past
        
        client.setEffectiveDate(DateUtils.addDays(new Date(), -1));
        client = clientRepository.save(client);
        
        flushAndClear();
        
        adminClientService.updateClientStateToClosed();
        
        client = clientRepository.findOne(client.getClientId());
        
        assertThat(client.getClientState()).isEqualTo(ClientState.CLOSED);
    }

    @Test
    public void moveClientsBetweenBrokerages_noGA() throws Exception {

        Broker brokerA = testEntityHelper.createTestBroker();
        Broker brokerB = testEntityHelper.createTestBroker();

        Client clientA = testEntityHelper.buildTestClient("Client A", brokerA);

        clientA = clientRepository.save(clientA);

        ClientTeam clientTeamA = testEntityHelper.createClientTeam(brokerA, clientA);

        flushAndClear();

        adminClientService.moveClientFromOneBrokerageToAnother(brokerA.getBrokerId(),
            brokerB.getBrokerId(), clientA.getClientId());

        clientA = clientRepository.findOne(clientA.getClientId());

        assertThat(clientA.getBroker().getBrokerId()).isEqualTo(brokerB.getBrokerId());

        validateClientTeam(clientA);

    }

    private void validateClientTeam(Client client) {
        List<ClientTeam> clientTeams = clientTeamRepository.findByClientClientId(client.getClientId());
        assertThat(clientTeams.size()).isEqualTo(0);
    }

    @Test
    public void swapClientsBetweenBrokerages_withGA_Access() throws Exception {

        Broker brokerA = testEntityHelper.createTestBroker();
        Broker brokerB = testEntityHelper.createTestBroker();

        Broker gaBroker1 = testEntityHelper.createTestGABroker("gaBroker1");

        testEntityHelper.createExtBrokerageAccess(gaBroker1, brokerA);

        Client clientA = testEntityHelper.buildTestClient("Client A", brokerA);

        clientA = clientRepository.save(clientA);

        testEntityHelper.createExtClientAccess(gaBroker1, clientA);

        ClientTeam clientTeamA = testEntityHelper.createClientTeam(brokerA, clientA);

        flushAndClear();

        adminClientService.moveClientFromOneBrokerageToAnother(brokerA.getBrokerId(),
            brokerB.getBrokerId(), clientA.getClientId());

        clientA = clientRepository.findOne(clientA.getClientId());

        assertThat(clientA.getBroker().getBrokerId()).isEqualTo(brokerB.getBrokerId());

        validateClientTeam(clientA);
    }
}
