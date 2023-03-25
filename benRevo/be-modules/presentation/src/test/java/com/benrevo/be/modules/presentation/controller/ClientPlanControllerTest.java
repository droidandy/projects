package com.benrevo.be.modules.presentation.controller;

import com.benrevo.be.modules.presentation.service.ClientPlanService;
import com.benrevo.be.modules.shared.controller.BaseControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientPlanDto;
import com.benrevo.common.dto.ClientPlanEnrollmentsDto;
import com.benrevo.common.dto.ClientPlanEnrollmentsDto.Enrollment;
import com.benrevo.common.dto.UpdateClientPlanEnrollmentsDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.common.util.ObjectMapperUtils;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ClientPlanControllerTest extends BaseControllerTest {

    @Autowired
    private ClientPlanController controller;

    @Autowired
    private ClientPlanService clientPlanService;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Override
    protected Object getController() {
        return controller;
    }

    @Test
    public void update_getClientPlanEnrollments() throws Exception {
        Carrier carrier = testEntityHelper.createTestCarrier();
        Client client = testEntityHelper.createTestClient();
        Plan plan = testEntityHelper.createTestPlan(carrier);
        Network hmoNetwork = testEntityHelper.createTestNetwork(carrier, "HMO");
        PlanNameByNetwork medicalPnn = testEntityHelper.createTestPlanNameByNetwork(plan, hmoNetwork);
        ClientPlan medical = testEntityHelper.createTestClientPlan(client, medicalPnn);
        Network dhmoNetwork = testEntityHelper.createTestNetwork(carrier, "DHMO");
        PlanNameByNetwork dentalPnn = testEntityHelper.createTestPlanNameByNetwork(plan, dhmoNetwork);
        ClientPlan dental = testEntityHelper.createTestClientPlan(client, dentalPnn);
        Network visionNetwork = testEntityHelper.createTestNetwork(carrier, "VISION");
        PlanNameByNetwork visionPnn = testEntityHelper.createTestPlanNameByNetwork(plan, visionNetwork);
        ClientPlan vision = testEntityHelper.createTestClientPlan(client, visionPnn);

        UpdateClientPlanEnrollmentsDto upd1 = new UpdateClientPlanEnrollmentsDto();
        upd1.setClientPlanId(medical.getClientPlanId());
        upd1.setTier1Enrollment(100501L);
        upd1.setTier2Enrollment(100502L);
        upd1.setTier3Enrollment(100503L);
        upd1.setTier4Enrollment(100504L);
        UpdateClientPlanEnrollmentsDto upd2 = new UpdateClientPlanEnrollmentsDto();
        ObjectMapperUtils.map(upd1, upd2);
        upd2.setClientPlanId(dental.getClientPlanId());
        UpdateClientPlanEnrollmentsDto upd3 = new UpdateClientPlanEnrollmentsDto();
        ObjectMapperUtils.map(upd1, upd3);
        upd3.setClientPlanId(vision.getClientPlanId());
        List<UpdateClientPlanEnrollmentsDto> params = Arrays.asList(upd1, upd2, upd3);

        // check get for enrollments apdate
        String response = performPut("/v1/clients/plans/enrollments", params);
        Enrollment updated = gson.fromJson(response, Enrollment.class);
        assertThat(updated.getNetworks()).hasSize(3);
        assertThat(updated.getNetworks().get(0).planName).isEqualTo(medicalPnn.getName());
        assertThat(updated.getNetworks().get(1).planName).isEqualTo(dentalPnn.getName());
        assertThat(updated.getNetworks().get(2).planName).isEqualTo(visionPnn.getName());
        assertThat(updated.getTotal().get(0).value).isEqualTo(medical.getTier1Census() + medical.getTier2Census() +
            medical.getTier3Census() + medical.getTier4Census());
        assertThat(updated.getTotal().get(1).value).isEqualTo(dental.getTier1Census() + dental.getTier2Census() +
            dental.getTier3Census() + dental.getTier4Census());
        assertThat(updated.getTotal().get(2).value).isEqualTo(vision.getTier1Census() + vision.getTier2Census() +
            vision.getTier3Census() + vision.getTier4Census());

        assertThat(updated.getContributions().get(0).values.get(0).value).isEqualTo(upd1.getTier1Enrollment().longValue());

        // check get for all enrollments
        token = createToken(client.getBroker().getBrokerToken());
        response = performGet("/v1/clients/{id}/plans/enrollments", EMPTY, client.getClientId());

        ClientPlanEnrollmentsDto result = gson.fromJson(response, ClientPlanEnrollmentsDto.class);

        assertThat(result).hasNoNullFieldsOrProperties();
        assertThat(result.getMedical().getContributions()).hasSize(4);
        assertThat(result.getMedical().getContributions().get(0).values).hasSize(1);
        assertThat(result.getMedical().getNetworks()).hasSize(1);
        assertThat(result.getMedical().getTotal().get(0).value).isEqualTo(medical.getTier1Census() + medical.getTier2Census() +
            medical.getTier3Census() + medical.getTier4Census());
        assertThat(result.getDental().getTotal().get(0).value).isEqualTo(dental.getTier1Census() + dental.getTier2Census() +
            dental.getTier3Census() + dental.getTier4Census());
        assertThat(result.getVision().getTotal().get(0).value).isEqualTo(vision.getTier1Census() + vision.getTier2Census() +
            vision.getTier3Census() + vision.getTier4Census());
    }


    @Test
    public void getPlansByClientId() throws Exception {
        Carrier carrier = testEntityHelper.createTestCarrier();
        Client client = testEntityHelper.createTestClient();
        Plan plan = testEntityHelper.createTestPlan(carrier);
        Network network = testEntityHelper.createTestNetwork(carrier, "HMO");
        PlanNameByNetwork pnn = testEntityHelper.createTestPlanNameByNetwork(plan, network);
        ClientPlan clientPlan = testEntityHelper.createTestClientPlan(client, pnn);
        ClientPlan clientPlanPpo = testEntityHelper.createTestClientPlan(client, "PPO");

        List<ClientPlan> clientPlans = new ArrayList<>();
        clientPlans.add(clientPlan);
        clientPlans.add(clientPlanPpo);
        testEntityHelper.updateTestClientPlan(client, clientPlans);
        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{id}/plans", client.getClientId())
            .param("product", Constants.MEDICAL)
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                /*.andExpect(content().json(jsonUtils.toJson(ClientMapper.clientsToDTOs(clients))))*/
            .andReturn();
        ClientPlanDto[] testClientPlan = gson.fromJson(result.getResponse().getContentAsString(), ClientPlanDto[].class);
        Assert.assertEquals(1, testClientPlan.length);
        ClientPlanDto expectedClientPlan = clientPlanService.getById(clientPlan.getClientPlanId());
        assertThat(testClientPlan[0]).isEqualToComparingFieldByField(expectedClientPlan);
    }
    
    @Test
    public void create_GetClientAncillaryPlansByClientId() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.displayName);

        AncillaryPlan ancillaryPlan1 = testEntityHelper.buildTestAncillaryPlan("Voluntary Life",
            PlanCategory.VOL_LIFE, AncillaryPlanType.VOLUNTARY, carrier);
        
        // create client plan
        
        AncillaryPlanDto createParams = RfpMapper.rfpPlanToRfpPlanDto(ancillaryPlan1);

        String createResult = performPost("/v1/clients/{id}/plans/createAncillary", createParams, client.getClientId());

        AncillaryPlanDto createdPlanDto = gson.fromJson(createResult, AncillaryPlanDto.class);
        
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(clientPlans).hasSize(1);
        assertThat(clientPlans.get(0).getAncillaryPlan()).isNotNull();
        assertThat(clientPlans.get(0).getAncillaryPlan().getAncillaryPlanId()).isEqualTo(createdPlanDto.getAncillaryPlanId());
        
        AncillaryPlan ancillaryPlan2 = testEntityHelper.createTestAncillaryPlan("Basic STD",
            PlanCategory.STD, AncillaryPlanType.BASIC, carrier);
        testEntityHelper.createTestAncillaryClientPlan(client, ancillaryPlan2, PlanCategory.STD);

        // get by product
        
        String result = performGet("/v1/clients/{id}/plans/ancillary", 
            new Object[] {"product", PlanCategory.VOL_LIFE.name()},
            client.getClientId());
            
        AncillaryPlanDto[] plans = gson.fromJson(result, AncillaryPlanDto[].class);
        
        assertThat(plans).hasSize(1);
        
        // get all plans
        
        result = performGet("/v1/clients/{id}/plans/ancillary", EMPTY, client.getClientId());
        
        plans = gson.fromJson(result, AncillaryPlanDto[].class);
        
        assertThat(plans).hasSize(2);
    }

    @Test
    public void clientPlanCRUD() throws Exception {
        ClientPlanDto createdClientPlan = createClientPlan();

        ClientPlanDto foundClientPlan = findClientPlan(createdClientPlan.getClientPlanId());

        assertThat(createdClientPlan).isEqualToComparingFieldByField(foundClientPlan);

        updateClientPlan(foundClientPlan.getClientPlanId(), foundClientPlan);

        deleteClientPlan(createdClientPlan.getClientPlanId());
    }

    private ClientPlanDto createClientPlan() throws Exception {
        Client client = testEntityHelper.createTestClient();

        ClientPlanDto newClientPlanDto = new ClientPlanDto();
        newClientPlanDto.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        newClientPlanDto.setTier1Census(1L);
        newClientPlanDto.setTier1ErContribution(2f);
        newClientPlanDto.setTier1Rate(3f);
        newClientPlanDto.setTier1Renewal(4f);
        newClientPlanDto.setTier2Census(5L);
        newClientPlanDto.setTier2ErContribution(6f);
        newClientPlanDto.setTier2Rate(7f);
        newClientPlanDto.setTier2Renewal(8f);
        newClientPlanDto.setTier3Census(9L);
        newClientPlanDto.setTier3ErContribution(10f);
        newClientPlanDto.setTier3Rate(11f);
        newClientPlanDto.setTier3Renewal(12f);
        newClientPlanDto.setTier4Census(13L);
        newClientPlanDto.setTier4ErContribution(14f);
        newClientPlanDto.setTier4Rate(15f);
        newClientPlanDto.setTier4Renewal(16f);
        newClientPlanDto.setClientId(client.getClientId());
        newClientPlanDto.setPlanType("HMO");

        Carrier carrier = testEntityHelper.createTestCarrier();
        Plan plan = testEntityHelper.createTestPlan(carrier);
        Network network = testEntityHelper.createTestNetwork(carrier, "HMO");
        PlanNameByNetwork testPnn = testEntityHelper.createTestPlanNameByNetwork(plan, network);
        newClientPlanDto.setPnnId(testPnn.getPnnId());
        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/v1/clients/{id}/plans", client.getClientId())
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(gson.toJson(newClientPlanDto)))
            .andExpect(status().isCreated())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
        newClientPlanDto = gson.fromJson(result.getResponse().getContentAsString(), ClientPlanDto.class);
        Assert.assertNotNull(newClientPlanDto.getClientPlanId());
        return newClientPlanDto;
    }

    private ClientPlanDto findClientPlan(Long id) throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/plans/{id}", id)
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
        ClientPlanDto foundClientPlanDto = gson.fromJson(result.getResponse().getContentAsString(), ClientPlanDto.class);
        return foundClientPlanDto;
    }

    private ClientPlanDto updateClientPlan(Long id, ClientPlanDto toUpdate) throws Exception {
        toUpdate.setTier1Census(100500L);
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.put("/v1/clients/plans/{id}", id)
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(gson.toJson(toUpdate)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
        ClientPlanDto updatedClientPlanDto = gson.fromJson(result.getResponse().getContentAsString(), ClientPlanDto.class);
        Assert.assertEquals(toUpdate.getTier1Census(), updatedClientPlanDto.getTier1Census());
        return updatedClientPlanDto;
    }

    private void deleteClientPlan(Long id) throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/v1/clients/plans/{id}", id)
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andReturn();

        performGet(HttpStatus.NOT_FOUND, "/v1/clients/plans/{id}", EMPTY, id);
    }
}
