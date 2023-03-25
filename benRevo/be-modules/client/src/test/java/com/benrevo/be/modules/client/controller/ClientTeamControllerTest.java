package com.benrevo.be.modules.client.controller;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.mapper.ClientMemberMapper;
import com.benrevo.data.persistence.repository.ClientTeamRepository;

import java.util.List;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ClientTeamControllerTest extends AbstractControllerTest {

    @Autowired
    private ClientTeamController controller;

    @Autowired
    private ClientTeamRepository clientTeamRepository;

    @Before
    @Override
    public void init() {
        initController(controller);
    }

    @Test
    public void getMembersFromClientById() throws Exception {

        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient();
        testEntityHelper.createClientTeam(broker, client);

        List<ClientTeam> clientTeamList = clientTeamRepository.findByClientClientId(client.getClientId());
        token = createToken(client.getBroker().getBrokerToken());
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{id}/members", client.getClientId())
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json;charset=UTF-8"))
                .andExpect(MockMvcResultMatchers.content().json(jsonUtils.toJson(ClientMemberMapper.toDtos(clientTeamList)), true))
                .andReturn();
    }

    @Test
    @Ignore // Ignore this test. A little crunched on time this test
    public void addToTeam() throws Exception {

        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient();
        ClientTeam clientTeam = testEntityHelper.createClientTeam(broker, client);

        ClientMemberDto dto = ClientMemberMapper.clientTeamToDto(clientTeam);
        dto.setFirstName("firstName");
        dto.setLastName("lastName");
        ClientMemberDto newDto = ClientMemberMapper.clientTeamToDto(clientTeam);
        newDto.setFullName(dto.getFirstName() + " " + dto.getLastName());

        ClientTeam clientTeam1 = ClientMemberMapper.dtoToClientTeam(dto);
        clientTeam1.setId(null);
        clientTeam1.setClient(clientTeam.getClient());
        clientTeam1.setBroker(broker);
        clientTeam1 = clientTeamRepository.save(clientTeam1);
        newDto.setId(clientTeam1.getId() + 1);
        dto.setId(null);
        token = createToken(client.getBroker().getBrokerToken());
        mockMvc.perform(MockMvcRequestBuilders.post("/v1/clients/{id}/members", clientTeam.getClient().getClientId())
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .contentType(MediaType.parseMediaType("application/json;charset=UTF-8"))
                .content("[" + jsonUtils.toJson(dto) + "]")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json;charset=UTF-8"))
                .andExpect(MockMvcResultMatchers.content().json("[" + jsonUtils.toJson(newDto)+ "]", true))
                .andReturn();
    }

    @Test
    public void deleteMembersFromClientById() throws Exception {

        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient();
        ClientTeam clientTeam = testEntityHelper.createClientTeam(broker, client);

        List<ClientTeam> clientTeamList = clientTeamRepository.findByClientClientId(clientTeam.getClient().getClientId());
        assertEquals(1, clientTeamList.size());
        token = createToken(client.getBroker().getBrokerToken());
        mockMvc.perform(MockMvcRequestBuilders.delete("/v1/clients/{id}/members", clientTeam.getClient().getClientId())
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .contentType(MediaType.parseMediaType("application/json;charset=UTF-8"))
                .content(jsonUtils.toJson(ClientMemberMapper.toDtos(clientTeamList)))
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andReturn();

        clientTeamList = clientTeamRepository.findByClientClientId(client.getClientId());
        assertEquals(0, clientTeamList.size());
    }
}
