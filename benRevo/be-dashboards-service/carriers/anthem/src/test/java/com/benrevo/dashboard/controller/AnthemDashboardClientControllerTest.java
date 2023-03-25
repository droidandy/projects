package com.benrevo.dashboard.controller;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import com.auth0.exception.Auth0Exception;
import com.benrevo.be.modules.client.controller.ClientController;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ExtClientAccess;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.repository.ExtClientAccessRepository;


public class AnthemDashboardClientControllerTest extends AbstractControllerTest {

	@Autowired
	private ClientController controller;

	@Autowired
	private ExtClientAccessRepository extClientAccessRepository;
	
    @Before
    @Override
    public void init() throws Auth0Exception {
        initController(controller);
    }
    
    @Test
    public void createClient() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Broker ga = testEntityHelper.createTestGeneralAgent();

        ClientDto dto = new ClientDto();
        dto.setClientName("testClientName");
        dto.setBrokerId(broker.getBrokerId());
        dto.setGaId(ga.getBrokerId());

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(dto), null, "/v1/clients");
        
        ClientDto clientDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto.class);

        assertThat(clientDto.getClientName()).isEqualTo(dto.getClientName());
        assertThat(clientDto.getCarrierOwned()).isTrue();
        assertThat(clientDto.getBrokerId()).isEqualTo(broker.getBrokerId());
        assertThat(clientDto.getGaId()).isEqualTo(ga.getBrokerId());

    }


    @Test
    public void getClientByIdWithAgent() throws Exception {
	    
        Broker broker = testEntityHelper.createTestBroker();
        Broker ga = testEntityHelper.createTestGeneralAgent();
        
        token = createToken(broker.getBrokerToken());

        Client client = testEntityHelper.createTestClient("Client1", broker);
        
        extClientAccessRepository.save(new ExtClientAccess(ga, client));
        
        MvcResult result = performGetAndAssertResult(null, "/v1/clients/{id}", client.getClientId());
        
        ClientDto clientDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto.class);
        assertThat(clientDto.getGaId()).isEqualTo(ga.getBrokerId());

    }
	
    @Test
    public void updateClientAddNewGaAndDeleteOldGa() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Broker newGa = testEntityHelper.createTestGeneralAgent();
        Broker oldGa = testEntityHelper.createTestGeneralAgent();
        testEntityHelper.createExtClientAccess(oldGa, client);

        ClientDto clientDto = ClientMapper.clientToDTO(client);
        clientDto.setGaId(newGa.getBrokerId());
        token = createToken(client.getBroker().getBrokerToken());
        
        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(clientDto), null, "/v1/clients/{id}", client.getClientId());

        ClientDto updatedClientDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto.class);
        assertThat(updatedClientDto.getGaId()).isEqualTo(newGa.getBrokerId());

    }

    @Test
    public void updateClientDeleteGa() throws Exception {
        Client client = testEntityHelper.createTestClient();
        Broker ga = testEntityHelper.createTestGeneralAgent();
        testEntityHelper.createExtClientAccess(ga, client);
        
        ClientDto clientDto = ClientMapper.clientToDTO(client);
        clientDto.setGaId(null);
        token = createToken(client.getBroker().getBrokerToken());
        
        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(clientDto), null, "/v1/clients/{id}", client.getClientId());

        flushAndClear();
        
        ClientDto updatedClientDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto.class);
        assertThat(updatedClientDto.getGaId()).isNull();

    }

	
}
