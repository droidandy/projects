package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.ClientTeam;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class ClientMemberMapperTest {

	@Test
	public void validateTest() {
	    
	    ObjectMapperUtils.getTypeMap(ClientMemberDto.class, ClientTeam.class).validate();
	    ObjectMapperUtils.getTypeMap(ClientTeam.class, ClientMemberDto.class)
            .addMapping(s -> s.getBroker().getName(), ClientMemberDto::setBrokerName)
            .addMapping(s -> s.getBroker().isGeneralAgent(), ClientMemberDto::setGeneralAgent)
            .validate();
	}

	@Test
    public void toDtoTest() {
        
	    ClientTeam clientTeam = new ClientTeam();
	    Broker broker = new Broker();
	    broker.setBrokerId(6L); 
	    clientTeam.setBroker(broker);
	    clientTeam.setName("clientTeam name");
        ClientMemberDto dto = ClientMemberMapper.clientTeamToDto(clientTeam);
        
        assertNotNull(dto);
        
        assertEquals(clientTeam.getName(), dto.getFullName());
        assertEquals(clientTeam.getBroker().getBrokerId(), dto.getBrokerageId());
        
    }
	
	@Test
    public void fromDtoTest() {
        
        ClientMemberDto dto = new ClientMemberDto();
        dto.setFirstName("firstName");
        dto.setLastName("lastName");
        dto.setBrokerageId(5L);
        
        ClientTeam clientTeam = ClientMemberMapper.dtoToClientTeam(dto);

        assertNotNull(clientTeam);
        assertEquals("firstName lastName", clientTeam.getName());
        
        assertNotNull(clientTeam.getBroker());
        assertEquals(Long.valueOf(5L), clientTeam.getBroker().getBrokerId());
        
    }
	
}
