package com.benrevo.be.modules.admin.controller;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.UpdateStatusDto;
import com.benrevo.common.enums.ClientState;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.repository.ClientRepository;
import java.util.Collections;
import org.json.JSONArray;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class ClientControllerTest extends AdminAbstractControllerTest {

    @Autowired
    private ClientRepository clientRepository;

    @Test
    public void testGetClientByBrokerid() throws Exception {

        Client client = testEntityHelper.createTestClient("unitTestClient", broker);
        ClientDto clientDto = ClientMapper.clientToDTO(client);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/brokers/" + broker.getBrokerId() + "/clients")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andReturn();

        String body = result.getResponse().getContentAsString();
        JSONArray array = new JSONArray(body);
        Assert.assertEquals(array.length(), 1);
        Assert.assertEquals(array.getJSONObject(0).getLong("brokerId"), (long) clientDto.getBrokerId());
    }

    @Test
    public void testGetClientByBrokerid_NotFoundException() throws Exception {

       mockMvc.perform(MockMvcRequestBuilders.get("/admin/brokers/" + broker.getBrokerId() + "/clients")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());
    }

    @Test
    public void testUpdateClientStatus() throws Exception {

        ClientState state = ClientState.ON_BOARDING;
        Client client = testEntityHelper.createTestClient();

        assertNotEquals(state.toString(), client.getClientState());

        UpdateStatusDto dto = new UpdateStatusDto();
        dto.setClientState(state);

        String requestContent = jsonUtils.toJson(dto);

        mockMvc.perform(MockMvcRequestBuilders.post("/admin/clients/" + client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        Client updatedClient = clientRepository.findOne(client.getClientId());
        assertNotNull(updatedClient);
        assertEquals(state, updatedClient.getClientState());

    }

    @Test
    public void testUpdateClientStatusMovingBackwards() throws Exception{
        ClientState state = ClientState.ON_BOARDING;
        Client client = testEntityHelper.createTestClient();
        client.setClientState(state);
        clientRepository.save(client);

        ClientState nextState = ClientState.RFP_STARTED;
        UpdateStatusDto dto = new UpdateStatusDto();
        dto.setClientState(nextState);
        String requestContent = jsonUtils.toJson(dto);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/admin/clients/" + client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isInternalServerError())
                .andReturn();
        String response = result.getResponse().getContentAsString();
        Client updatedClient = clientRepository.findOne(client.getClientId());
        assertTrue(response.contains("Client State cannot be changed backwards"));
        assertEquals(updatedClient.getClientState(),state);



        state = ClientState.ON_BOARDING;
        client = testEntityHelper.createTestClient();
        client.setClientState(state);
        clientRepository.save(client);

        nextState = ClientState.QUOTED;
        dto = new UpdateStatusDto();
        dto.setClientState(nextState);
        requestContent = jsonUtils.toJson(dto);

        result = mockMvc.perform(MockMvcRequestBuilders.post("/admin/clients/" + client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is2xxSuccessful())
                .andReturn();
        response = result.getResponse().getContentAsString();
        updatedClient = clientRepository.findOne(client.getClientId());
        assertTrue(response.contains("The client state was successfully updated "));
        assertEquals(updatedClient.getClientState(),nextState);

        state = ClientState.SOLD;
        client = testEntityHelper.createTestClient();
        client.setClientState(state);
        clientRepository.save(client);

        nextState = ClientState.CLOSED;
        dto = new UpdateStatusDto();
        dto.setClientState(nextState);
        requestContent = jsonUtils.toJson(dto);

        result = mockMvc.perform(MockMvcRequestBuilders.post("/admin/clients/" + client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is2xxSuccessful())
                .andReturn();
        response = result.getResponse().getContentAsString();
        updatedClient = clientRepository.findOne(client.getClientId());
        assertTrue(response.contains("The client state was successfully updated "));
        assertEquals(updatedClient.getClientState(),nextState);

        state = ClientState.CLOSED;
        client = testEntityHelper.createTestClient();
        client.setClientState(state);
        clientRepository.save(client);

        nextState = ClientState.SOLD;
        dto = new UpdateStatusDto();
        dto.setClientState(nextState);
        requestContent = jsonUtils.toJson(dto);

        result = mockMvc.perform(MockMvcRequestBuilders.post("/admin/clients/" + client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is2xxSuccessful())
                .andReturn();
        response = result.getResponse().getContentAsString();
        updatedClient = clientRepository.findOne(client.getClientId());
        assertTrue(response.contains("The client state was successfully updated "));
        assertEquals(updatedClient.getClientState(),nextState);
    }

    @Test
    public void testUpdateClientStatusWithNoStatus_NotFoundException() throws Exception {

        Client client = testEntityHelper.createTestClient();

        UpdateStatusDto dto = new UpdateStatusDto();

        String requestContent = jsonUtils.toJson(dto);

        mockMvc.perform(MockMvcRequestBuilders.post("/admin/clients/" + client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testUpdateClientStatusWithWrongClient_NotFoundException() throws Exception {

        Client client = testEntityHelper.createTestClient();

        UpdateStatusDto dto = new UpdateStatusDto();

        String requestContent = jsonUtils.toJson(dto);

        mockMvc.perform(MockMvcRequestBuilders.post("/admin/clients/" + client.getClientId() + 1)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isNotFound());
    }

    @Test
    public void getClientById() throws Exception {
        Client client = testEntityHelper.createTestClient();
        
        flushAndClear();
        
        ClientDto expected = ClientMapper.clientToDTO(client);
        // Client.clientTeamList with FetchType.EAGER return emptylist, NOT null
        expected.setClientMembers(Collections.emptyList());
        
        performGetAndAssertResult(expected, "/admin/clients/{id}", client.getClientId());
    }

    @Test
    public void updateClient() throws Exception {
        Client client = testEntityHelper.createTestClient();

        flushAndClear();
        long clientId = client.getClientId();
        client.setClientName("UPDATED1");
        client.setImage(null);
        client.setLastVisited(null);
        client.setCobraCount(123);
        client.setState("NewTestState");
        client.setEligibleEmployees(2L);
        client.setEmployeeCount(20L);
        client.setPredominantCounty("test_county");
        client.setAverageAge(33f);
        client.setDeclinedOutside(false);
        ClientDto clientDto = ClientMapper.clientToDTO(client);
        ClientDto clientForCompare = ClientMapper.clientToDTO(client);
        clientDto.setClientState(ClientState.COMPLETED); // Should be ignored on update

        performPutAndAssertResult(jsonUtils.toJson(clientDto), clientForCompare, "/admin/clients/{id}", clientId);
        flushAndClear();
        Client updatedClient = clientRepository.findOne(clientId);
        assertEquals(client.getState(), updatedClient.getState());
        assertEquals(client.getCobraCount(), updatedClient.getCobraCount());
        assertEquals(client.getClientState(), updatedClient.getClientState());
        assertEquals(client.getEligibleEmployees(), updatedClient.getEligibleEmployees());
        assertEquals(client.getEmployeeCount(), updatedClient.getEmployeeCount());
        assertEquals(client.getPredominantCounty(), updatedClient.getPredominantCounty());
        assertEquals(client.getAverageAge().intValue(), updatedClient.getAverageAge().intValue());
        assertNotEquals(clientDto.getClientState(), updatedClient.getClientState());
        assertEquals(client.isDeclinedOutside(), updatedClient.isDeclinedOutside());

    }

    @Test
    @Ignore // FIXME Broken test
    public void searchByClientName() throws Exception{
        String[] clientNames = {"George Karma","Georgie Karma","Emily Karma"};
        String[] searchAttempts = {"Karma","Georg","Em","x"};
        int[] expectedNumResultsArray = {3, 2, 1, 0};

        for(String clientName : clientNames){
            Broker broker = testEntityHelper.createTestBroker(clientName + "'s Broker");
            testEntityHelper.createTestClient(clientName,broker);
        }

        for(int i = 0; i < searchAttempts.length; i++){
            String searchAttempt = searchAttempts[i];
            int expectedNumResults = expectedNumResultsArray[i];

            MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                    .get("/admin/clients/" + searchAttempt + "/search")
                    .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON_UTF8))
                    .andExpect(status().isOk())
                    .andReturn();

            ClientDto[] response = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto[].class);
            assertEquals(response.length, expectedNumResults);
            for(ClientDto clientDto : response){
                assertTrue(clientDto.getClientName().contains(searchAttempt));
                assertEquals(clientDto.getBrokerName(),clientDto.getClientName() + "'s Broker");
            }
        }
    }
}
