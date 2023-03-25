package com.benrevo.core.util.mapper;

import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.mapper.ClientMemberMapper;
import org.junit.Test;
import uk.co.jemos.podam.api.AbstractClassInfoStrategy;
import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;

import java.util.Date;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class ClientMapperTest {
    private PodamFactory podamFactory = new PodamFactoryImpl();

    public ClientMapperTest() {
    	AbstractClassInfoStrategy classInfoStrategy = new AbstractClassInfoStrategy() {};
		classInfoStrategy
				.addExcludedField(Client.class, "clientPlans")
				.addExcludedField(Client.class, "broker")
				.addExcludedField(Client.class, "attributes")
				
                .addExcludedField(ClientTeam.class, "broker")
                .addExcludedField(ClientTeam.class, "client")
                .addExcludedField(ClientDto.class, "rfps")
                .addExcludedField(ClientDto.class, "attributes")
                .addExcludedField(ClientDto.class, "rfpProducts")
                ;
		podamFactory.setClassStrategy(classInfoStrategy);
    }

    @Test
    public void clientToDTO() throws Exception {
        Client client = podamFactory.manufacturePojo(Client.class);
        ClientDto clientDto = ClientMapper.clientToDTO(client);
        assertNotNull(clientDto);
        assertEquals(client.getClientId(), clientDto.getId());
        assertEquals(client.getAddress(), clientDto.getAddress());
        assertEquals(client.getClientTeamList().size(), clientDto.getClientMembers().size());
        assertEquals(client.getClientTeamList().get(0).getName(), clientDto.getClientMembers().get(0).getFullName());
        assertEquals(client.getState(), clientDto.getState());
        assertEquals(client.getClientState(), clientDto.getClientState());
    }

    @Test
    public void dtoToClient() throws Exception {
        ClientDto clientDto = podamFactory.manufacturePojo(ClientDto.class);
        clientDto.setDueDate(DateHelper.fromDateToString(new Date()));
        clientDto.setEffectiveDate(DateHelper.fromDateToString(new Date()));
        Client client = ClientMapper.dtoToClient(clientDto);
        assertNotNull(client);
        assertEquals(clientDto.getClientName(), client.getClientName());
        assertEquals(clientDto.getAddress(), client.getAddress());
        assertEquals(clientDto.getClientMembers().size(), client.getClientTeamList().size());
        assertEquals(ClientMemberMapper.getFullName(clientDto.getClientMembers().get(0)), client.getClientTeamList().get(0).getName());
        assertEquals(clientDto.getState(), client.getState());
        assertEquals(clientDto.getClientState(), client.getClientState());
    }

}
