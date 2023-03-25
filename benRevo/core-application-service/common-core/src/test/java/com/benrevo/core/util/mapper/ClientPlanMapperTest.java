package com.benrevo.core.util.mapper;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientPlanDto;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.ancillary.*;
import com.benrevo.data.persistence.mapper.ClientPlanMapper;
import org.junit.Test;
import uk.co.jemos.podam.api.AbstractClassInfoStrategy;
import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class ClientPlanMapperTest {
    private PodamFactory podamFactory = new PodamFactoryImpl();

    public ClientPlanMapperTest() {
    	AbstractClassInfoStrategy classInfoStrategy = new AbstractClassInfoStrategy() {};
		classInfoStrategy
                .addExcludedField(ClientPlan.class, "erContributionFormat")
                .addExcludedField(ClientPlan.class, "pnn")
                .addExcludedField(ClientPlan.class, "client")
                .addExcludedField(PlanNameByNetwork.class, "plan")
                .addExcludedField(AncillaryClass.class, "ancillaryPlan")
                .addExcludedField(AncillaryRate.class, "ancillaryPlan");

		podamFactory.setClassStrategy(classInfoStrategy);
        podamFactory.getStrategy()
                .addOrReplaceSpecific(AncillaryClass.class, LifeClass.class)
                .addOrReplaceSpecific(AncillaryRate.class, BasicRate.class);
    }

    @Test
    public void toDto() throws Exception {
        ClientPlan clientPlan = podamFactory.manufacturePojo(ClientPlan.class);
        clientPlan.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_PERCENT);
        ClientPlanDto clientPlanDto = ClientPlanMapper.toDto(clientPlan);
        assertNotNull(clientPlanDto);
        assertEquals(clientPlan.getRxPnn().getPnnId(), clientPlanDto.getRxPnnId());
        assertEquals(clientPlan.getClientPlanId(), clientPlanDto.getClientPlanId());
        assertEquals(clientPlan.getPlanType(), clientPlanDto.getPlanType());
    }

    @Test
    public void toEntity() throws Exception {
        ClientPlanDto clientPlanDto = podamFactory.manufacturePojo(ClientPlanDto.class);
        clientPlanDto.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_PERCENT);
        ClientPlan clientPlan = ClientPlanMapper.toEntity(clientPlanDto);
        assertNotNull(clientPlanDto);
        assertEquals(clientPlanDto.getRxPnnId(), clientPlan.getRxPnn().getPnnId());
        assertEquals(clientPlanDto.getClientPlanId(), clientPlan.getClientPlanId());
        assertEquals(clientPlanDto.getPlanType(), clientPlan.getPlanType());
    }

}
