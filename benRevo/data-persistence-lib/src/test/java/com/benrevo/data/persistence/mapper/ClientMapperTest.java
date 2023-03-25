package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.Arrays;

public class ClientMapperTest {

	@Test
	public void validateTest() {
	    
	    ObjectMapperUtils.getTypeMap(ClientDto.class, Client.class).validate();
        ObjectMapperUtils.getTypeMap(Client.class, ClientDto.class).validate();
	}

	@Test
    public void toDtoTest() {
        
	    ClientDto dto = new ClientDto();
	    
	    ClientMemberDto memberDto = new ClientMemberDto();
	    memberDto.setId(14L);
	    memberDto.setEmail("email");
	    memberDto.setFirstName("firstName");
	    memberDto.setLastName("lastName");
	    
	    dto.setClientMembers(Arrays.asList(memberDto));
	    dto.setBrokerId(2L);
	    Client client = ClientMapper.dtoToClient(dto);
	    
	    assertNotNull(client.getBroker());
	    assertEquals(Long.valueOf(2L), client.getBroker().getBrokerId());
	    
	    assertNotNull(client.getClientTeamList());
	    assertEquals(1, client.getClientTeamList().size());
	    assertEquals("firstName lastName", client.getClientTeamList().get(0).getName());
	    
    }

	
	@Test
    public void fromDtoTest() {
        
        Client client = new Client();
        Broker broker = new Broker();
        broker.setBrokerId(3L);
        broker.setName("broker name");
        client.setBroker(broker);
        
        client.setAttributes(
                Arrays.asList(new ClientAttribute(client, AttributeName.DIRECT_TO_PRESENTATION)));
        
        ClientDto clientDto = ClientMapper.clientToDTO(client);

        assertEquals(Long.valueOf(3), clientDto.getBrokerId());
        assertEquals("broker name", clientDto.getBrokerName());
        
        assertNotNull(clientDto.getAttributes());
        assertEquals(1, clientDto.getAttributes().size());
        assertEquals(AttributeName.DIRECT_TO_PRESENTATION, clientDto.getAttributes().get(0));
        
    }

}
