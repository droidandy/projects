package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.ClientPlanDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;

import org.junit.Test;

import static com.benrevo.common.Constants.ER_CONTRIBUTION_FORMAT_PERCENT;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class ClientPlanMapperTest {

	@Test
	public void validateTest() {
	    
	    ObjectMapperUtils.getTypeMap(ClientPlanDto.class, ClientPlan.class).validate();
        ObjectMapperUtils.getTypeMap(ClientPlan.class, ClientPlanDto.class).validate();
	}

	@Test
    public void toEntityTest() {
        
	    ClientPlanDto dto = new ClientPlanDto();
	    
	    dto.setErContributionFormat(ER_CONTRIBUTION_FORMAT_PERCENT);
	    dto.setClientId(7L);
	    dto.setPnnId(8L);

	    ClientPlan clientPlan = ClientPlanMapper.toEntity(dto);
	    
	    assertNotNull(clientPlan.getClient());
	    assertEquals(Long.valueOf(7L), clientPlan.getClient().getClientId());
	    assertNotNull(clientPlan.getPnn());
	    assertEquals(Long.valueOf(8L), clientPlan.getPnn().getPnnId());
	    assertNull(clientPlan.getRxPnn());
        
    }

	
	@Test
    public void toDtoTest() {
        
        ClientPlan clientPlan = new ClientPlan();
 
        Client client = new Client();
        client.setClientId(6L);
        clientPlan.setClient(client);
        
        PlanNameByNetwork pnn = new PlanNameByNetwork();
        pnn.setPnnId(9L);
        clientPlan.setPnn(pnn);
        
        ClientPlanDto clientPlanDto = ClientPlanMapper.toDto(clientPlan);

        assertEquals(Long.valueOf(6), clientPlanDto.getClientId());
        assertEquals(Long.valueOf(9), clientPlanDto.getPnnId());
        
        assertNull(clientPlanDto.getRxPnnId());
        
    }

}
