package com.benrevo.be.modules.client.controller;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.client.service.ClientService;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.access.BrokerageRole;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AttributeDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.ExtProductDto;
import com.benrevo.common.dto.ancillary.BasicRateDto;
import com.benrevo.common.dto.ancillary.LifeClassDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.dto.ancillary.VoluntaryRateDto;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.*;
import com.benrevo.data.persistence.repository.ancillary.RfpToAncillaryPlanRepository;
import org.apache.commons.io.FileUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static com.benrevo.common.enums.CarrierType.*;
import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.apache.commons.lang3.ArrayUtils.toArray;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.*;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


public class ClientControllerTest extends AbstractControllerTest {

	@Autowired
	private ClientController controller;

	@Autowired
	private ClientRepository clientRepository;
	
	@Autowired
	private ExtProductRepository extProductRepository;
	
	@Autowired
	private ClientRfpProductRepository clientRfpProductRepository;

	@Autowired
	private RfpRepository rfpRepository;
    
	@Autowired
	private RfpToPnnRepository rfpToPnnRepository;
    
	@Autowired
	private BenefitRepository benefitRepository;
	
	@Autowired
	private ClientService clientService;
	
	@Autowired
	private ExtClientAccessRepository extClientAccessRepository;
	
	@Autowired
	private ExtBrokerageAccessRepository extBrokerageAccessRepository;

	@Autowired
	private ClientTeamRepository clientTeamRepository;

	@Autowired
    private RfpToAncillaryPlanRepository rfpToAncillaryPlanRepository;

    @Autowired
    private AttributeRepository attributeRepository;

    @Before
    @Override
    public void init() throws Auth0Exception {
        initController(controller);

        User user = new User("test");
        user.setEmail("test@domain.test");
        user.setUserMetadata( build( entry("first_name", "FirstName"), entry("last_name", "LastName") ) );

        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);

    }

    @Test
    public void getClientsByBrokerId_FilterClientTeamByBrokerId() throws Exception {
        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("test", broker);

        // create client team
        Broker gaBroker = testEntityHelper.createTestGABroker("testGABroker");
        ClientTeam ct1 = testEntityHelper.createClientTeam(broker, client);
        ClientTeam ct2 = testEntityHelper.createClientTeam(gaBroker, client);

        // get clients
        List<Client> clientsWithNormalClientTeam = clientRepository.findByBrokerBrokerIdAndCarrierOwnedIsFalse(broker.getBrokerId());
        List<Client> clientsWithGAClientTeam = clientRepository.findByBrokerBrokerIdAndCarrierOwnedIsFalse(gaBroker.getBrokerId());

        clientService.filterClientClientTeamByBrokerId(clientsWithNormalClientTeam, broker.getBrokerId());
        clientService.filterClientClientTeamByBrokerId(clientsWithGAClientTeam, gaBroker.getBrokerId());

        token = createToken(broker.getBrokerToken());
        performGetAndAssertResult(ClientMapper.clientsToDTOs(clientsWithNormalClientTeam), "/v1/brokers/{id}/clients", broker.getBrokerId());

        token = createToken(gaBroker.getBrokerToken());
        performGetAndAssertResult(ClientMapper.clientsToDTOs(clientsWithGAClientTeam), "/v1/brokers/{id}/clients", gaBroker.getBrokerId());
    }

	@Test
	public void getClientsByBrokerId() throws Exception {
		Broker broker = testEntityHelper.createTestBroker();
		testEntityHelper.createTestClient("test", broker);
		List<Client> clients = clientRepository.findByBrokerBrokerIdAndCarrierOwnedIsFalse(broker.getBrokerId());
		token = createToken(broker.getBrokerToken());
		performGetAndAssertResult(ClientMapper.clientsToDTOs(clients), "/v1/brokers/{id}/clients", broker.getBrokerId());
	}

	@Test
	public void getClientsByBrokerIdFromToken() throws Exception {
		Broker broker = testEntityHelper.createTestBroker();
		Client client1 = testEntityHelper.createTestClient("client1ForBroker", broker);
		Client client2 = testEntityHelper.createTestClient("client2ForBroker", broker);
		token = createToken(client1.getBroker().getBrokerToken());
		
		List<Client> brokerClients = clientRepository.findByBrokerBrokerIdAndCarrierOwnedIsFalse(broker.getBrokerId());
		assertThat(brokerClients).hasSize(2);
		
		List<ClientDto> expectedClients = ClientMapper.clientsToDTOs(brokerClients);
		
		performGetAndAssertResult(expectedClients, "/v1/clients");	
	}
	
	@Test
	public void getClientsByBrokerIdFromToken_RfpProducts() throws Exception {
		Broker broker = testEntityHelper.createTestBroker();
		Client client = testEntityHelper.createTestClient("client1ForBroker", broker);
		token = createToken(client.getBroker().getBrokerToken());
		
		ExtProduct medical = extProductRepository.findByName(Constants.MEDICAL);
		ExtProduct dental = extProductRepository.findByName(Constants.DENTAL);
		
		ClientRfpProduct cp1 = new ClientRfpProduct(client.getClientId(), medical, false);
		clientRfpProductRepository.save(cp1);
		ClientRfpProduct cp2 = new ClientRfpProduct(client.getClientId(), dental, false);
		clientRfpProductRepository.save(cp2);

		MvcResult result = performGetAndAssertResult(null, "/v1/clients");
		ClientDto[] clients = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto[].class);
		assertThat(clients).hasSize(1);
		assertThat(clients[0].getRfpProducts()).hasSize(2);
	}

	@Test
    @Ignore
	public void createClient() throws Exception {
		Client client = testEntityHelper.createTestClient();
		ClientDto dto = ClientMapper.clientToDTO(client);
		ClientDto dto1 = ClientMapper.clientToDTO(client);
		dto1.setId(dto.getId() + 1);
		dto.setId(null);
		dto1.setBrokerId(1l);
		dto1.setClientState(ClientState.RFP_STARTED);

		performPostAndAssertResult(jsonUtils.toJson(dto), dto1, "/v1/clients");
	}

	@Test
	public void getClientById() throws Exception {
		Client client = testEntityHelper.createTestClient();
		token = createToken(client.getBroker().getBrokerToken());
		performGetAndAssertResult(ClientMapper.clientToDTO(client), "/v1/clients/{id}", client.getClientId());
	}

	@Test
    public void getClientByIdWithAgent() throws Exception {
	    
        Broker broker = testEntityHelper.createTestBroker();
        Broker generalAgent = testEntityHelper.createTestGeneralAgent();
        
        token = createToken(generalAgent.getBrokerToken());

        Client client = testEntityHelper.createTestClient("Client1", broker);
        
        extBrokerageAccessRepository.save(new ExtBrokerageAccess(generalAgent, broker));
        extClientAccessRepository.save(new ExtClientAccess(generalAgent, client));
        // add logged-in user to client team
        testEntityHelper.createClientTeam(generalAgent, client, testAuthId);
        
        performGetAndAssertResult(ClientMapper.clientToDTO(client), "/v1/clients/{id}", client.getClientId());
    }
	
	@Test
    public void getClientByIdWithAgentWithFullClientAccess() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Broker generalAgent = testEntityHelper.createTestGeneralAgent();
        
        token = authenticationService.createTokenForBroker(
                generalAgent.getBrokerToken(),
                testAuthId,
                BrokerageRole.FULL_CLIENT_ACCESS.getValue(),
                toArray(AccountRole.BROKER.getValue()),
                new String[] {UHC.name(), ANTHEM_BLUE_CROSS.name(), UNUM.name()});
        
        Client client = testEntityHelper.createTestClient("Client1", broker);
        
        extBrokerageAccessRepository.save(new ExtBrokerageAccess(generalAgent, broker));
        extClientAccessRepository.save(new ExtClientAccess(generalAgent, client));

        performGetAndAssertResult(ClientMapper.clientToDTO(client), "/v1/clients/{id}", client.getClientId());
    }
	
	@Test
    public void getClientByIdWithAgentWithoutClientTeamAndFullClientAccess() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Broker generalAgent = testEntityHelper.createTestGeneralAgent();
        
        Client client = testEntityHelper.createTestClient("Client1", broker);
        token = authenticationService.createTokenForBroker(generalAgent.getBrokerToken(), testAuthId, 
            BrokerageRole.ADMIN.getValue(), toArray(AccountRole.USER.getValue()), appCarrier);
        
        extBrokerageAccessRepository.save(new ExtBrokerageAccess(generalAgent, broker));
        extClientAccessRepository.save(new ExtClientAccess(generalAgent, client));

        mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{id}", client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AbstractControllerTest.AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isForbidden())
                .andReturn();
    }
	
	@Test
    public void getClientByIdWithWrongBroker() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Broker broker2 = testEntityHelper.createTestBroker();

        token = authenticationService.createTokenForBroker(broker2.getBrokerToken(), 
            testAuthId, BrokerageRole.ADMIN.getValue(), toArray(AccountRole.USER.getValue()), appCarrier);
        
        Client client = testEntityHelper.createTestClient("Client1", broker);
        
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{id}", client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AbstractControllerTest.AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isForbidden())
                .andReturn();      
    }
	
	@Test
    public void getClientByIdWithWrongRole() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();

        token = authenticationService.createTokenForBroker(broker.getBrokerToken(), testAuthId, 
            toArray("not_allowed_role"), appCarrier);
        
        Client client = testEntityHelper.createTestClient("Client1", broker);
        
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{id}", client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AbstractControllerTest.AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isForbidden())
                .andReturn();      
    }
	
	@Test
    public void getClientByIdWithWrongAgent() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Broker broker2 = testEntityHelper.createTestBroker();
        Broker generalAgent = testEntityHelper.createTestGeneralAgent();
        
        token = authenticationService.createTokenForBroker(generalAgent.getBrokerToken(), testAuthId, 
            BrokerageRole.ADMIN.getValue(), toArray(AccountRole.USER.getValue()), appCarrier);
        
        Client client = testEntityHelper.createTestClient("Client1", broker);
        
        extBrokerageAccessRepository.save(new ExtBrokerageAccess(generalAgent, broker2));
        
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{id}", client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AbstractControllerTest.AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isForbidden())
                .andReturn();
    }
	
	@Test
	public void updateClient() throws Exception {
		Client client = testEntityHelper.createTestClient();

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
		client.setDba("testDba");
		ClientDto clientDto = ClientMapper.clientToDTO(client);
		ClientDto clientForCompare = ClientMapper.clientToDTO(client);
		clientDto.setClientState(ClientState.COMPLETED); // Should be ignored on update
		token = createToken(client.getBroker().getBrokerToken());
		performPutAndAssertResult(jsonUtils.toJson(clientDto), clientForCompare, "/v1/clients/{id}", clientId);
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
		assertEquals(client.getDba(), updatedClient.getDba());
		
	}
	
	@Test
    public void updateClientWithAttribute() throws Exception {
	    
        Client client = testEntityHelper.createTestClient();
        clientService.setAttribute(client, AttributeName.DIRECT_TO_PRESENTATION);
        
        flushAndClear();

        client.setClientName("UPDATED1");
        ClientDto clientDto = ClientMapper.clientToDTO(client);
        
        token = createToken(client.getBroker().getBrokerToken());

        performPutAndAssertResult(jsonUtils.toJson(clientDto), null, "/v1/clients/{id}", client.getClientId());

        flushAndClear();
        
        Client updatedClient = clientRepository.findOne(client.getClientId());
        
        assertEquals("UPDATED1", updatedClient.getClientName());

    }

	
	@Test
    public void clientRfpProductsCRUD() throws Exception {
		Broker broker = testEntityHelper.createTestBroker();
		Client client = testEntityHelper.buildTestClient("clientForProductsCRUD", broker);
		token = createToken(client.getBroker().getBrokerToken());

		List<ExtProduct> allRfpProducts = extProductRepository.findAll();
		String[] allRfpProductNames = allRfpProducts.stream().map(p -> p.getName()).toArray(size -> new String[size]);

		// create client with default rfp products
		ClientDto clientDto = ClientMapper.clientToDTO(client);
		clientDto.setRfpProducts(null);
		
		MvcResult result = performPostAndAssertResult(jsonUtils.toJson(clientDto), null, "/v1/clients");
		ClientDto createdClient = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto.class);
		assertThat(createdClient.getRfpProducts()).isNotNull();

		List<String> productNames = createdClient.getRfpProducts().stream().map(p -> p.getName()).collect(Collectors.toList());
		assertThat(productNames).containsExactlyInAnyOrder(allRfpProductNames);
		
		// check that client team was created
		List<ClientTeam> clientTeams = clientTeamRepository.findByClientClientId(createdClient.getId());
		assertThat(clientTeams).hasSize(1);
		assertThat(clientTeams.get(0).getName()).isEqualTo("FirstName LastName");

		// update client rfp products
		List<ExtProductDto> products = new ArrayList<>();
		products.add(new ExtProductDto(null, Constants.MEDICAL, null, true));
		products.add(new ExtProductDto(null, Constants.DENTAL, null, false));
		clientDto.setRfpProducts(products);

		result = performPutAndAssertResult(jsonUtils.toJson(clientDto), null, "/v1/clients/{id}", createdClient.getId());
		
		ClientDto updatedClient = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto.class);
		assertThat(updatedClient.getRfpProducts()).isNotNull();
		productNames = updatedClient.getRfpProducts().stream().map(p -> p.getName()).collect(Collectors.toList());
		assertThat(productNames).containsExactlyInAnyOrder(Constants.MEDICAL, Constants.DENTAL);
		for (ExtProductDto product : updatedClient.getRfpProducts()) {
		    switch(product.getName()) {
		    case Constants.MEDICAL:
		        assertThat(product.isVirginGroup()).isTrue();
		        break;
		    case Constants.DENTAL:
		        assertThat(product.isVirginGroup()).isFalse();
		        break;
		    }
		}
		
		// get client and rfp products by clientId
		result = performGetAndAssertResult(null, "/v1/clients/{id}", updatedClient.getId());
		
		ClientDto foundClient = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto.class);
		assertThat(foundClient.getRfpProducts()).isNotNull();
		productNames = foundClient.getRfpProducts().stream().map(p -> p.getName()).collect(Collectors.toList());
		assertThat(productNames).containsExactlyInAnyOrder(Constants.MEDICAL, Constants.DENTAL);
		
		// delete client and check for deleted rfp products
		// TODO: we have no API to delete client by id...
	}
	
	
	
	@Test
	public void exportImportClient_LifeProductRFP() throws Exception {

		Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        RFP exportedRfp = testEntityHelper.createTestRFP(client, Constants.LIFE);
        exportedRfp = rfpRepository.save(exportedRfp);
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.VOYA.name(), CarrierType.VOYA.displayName);

        AncillaryPlan basicPlan = testEntityHelper.createTestAncillaryPlan(
            "Basic Plan", PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);
        AncillaryPlan voluntaryPlan = testEntityHelper.createTestAncillaryPlan(
            "Voluntary Plan", PlanCategory.VOL_LIFE, AncillaryPlanType.VOLUNTARY, carrier);
        testEntityHelper.createTestRfpToAncillaryPlan(exportedRfp, basicPlan);
        testEntityHelper.createTestRfpToAncillaryPlan(exportedRfp, voluntaryPlan);

        testEntityHelper.flushAndClear();
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{clientId}/file", client.getClientId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(Constants.HTTP_HEADER_CONTENT_TYPE_XML))
                .andReturn();
        byte[] bytes = result.getResponse().getContentAsByteArray();
        
        // FileUtils.writeByteArrayToFile(new File("export.xml"), bytes);
        
        ByteArrayInputStream inputStream = new ByteArrayInputStream(bytes);
        MockMultipartFile mockFile = new MockMultipartFile("file", "client.xml", "application/xml", inputStream);
        
        String newClientName = client.getClientName() + " NEW";
        result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/v1/clients/upload")
                .file(mockFile)
                .param("clientName", newClientName)
                .param("override", "true")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isCreated())
                .andReturn();
        
        testEntityHelper.flushAndClear();
        
        // check if new loaded RFP has correct data
        List<Client> newClients = clientRepository.findByClientNameAndBrokerBrokerIdAndCarrierOwned(
            newClientName, client.getBroker().getBrokerId(), false);
        assertThat(newClients).hasSize(1);
        RFP newRfp = rfpRepository.findByClientClientIdAndProduct(newClients.get(0).getClientId(), exportedRfp.getProduct());

        assertThat(newRfp).isNotNull();
        assertThat(newRfp.getRfpId()).isNotEqualTo(exportedRfp.getRfpId());
        List<RfpToAncillaryPlan> ancPlans = rfpToAncillaryPlanRepository.findByRfp_RfpId(newRfp.getRfpId());
        assertThat(ancPlans).hasSize(2);
        for(RfpToAncillaryPlan rfpToAncillaryPlan : ancPlans) {
            AncillaryPlanDto dto1 = RfpMapper.rfpPlanToRfpPlanDto(rfpToAncillaryPlan.getAncillaryPlan());
            AncillaryPlanDto dto2;
            if(rfpToAncillaryPlan.getAncillaryPlan().getPlanType() == AncillaryPlanType.BASIC) {
                dto2 = RfpMapper.rfpPlanToRfpPlanDto(basicPlan); 
                assertThat(dto1.getRates()).isEqualToIgnoringGivenFields(dto2.getRates(), "ancillaryRateId");
            } else {
                dto2 = RfpMapper.rfpPlanToRfpPlanDto(voluntaryPlan); 
                assertThat(dto1.getRates()).isEqualToIgnoringGivenFields(dto2.getRates(), "ancillaryRateId", "ages");
                assertThat(((VoluntaryRateDto) dto1.getRates()).getAges())
                    .usingElementComparatorIgnoringFields("ancillaryRateAgeId")
                    .isEqualTo(((VoluntaryRateDto) dto2.getRates()).getAges());
            }
            assertThat(dto1).isEqualToIgnoringGivenFields(dto2, "ancillaryPlanId", "classes", "rates");
            assertThat(dto1.getClasses()).usingElementComparatorIgnoringFields("ancillaryClassId")
                .isEqualTo(dto2.getClasses());
        }
	}
	
    @Test
    public void exportImportClient() throws Exception {
        
        Client client = testEntityHelper.createTestClient();
        RFP rfp = testEntityHelper.createTestRFPWithOptionsAndCarrierHistory(client);
        PlanNameByNetwork pnn = testEntityHelper.createTestPlanNameByNetwork("Test HMO", Constants.UHC_CARRIER, "HMO");
        testEntityHelper.createTestRfpToPNN(rfp, pnn);        
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", pnn.getPlan(), "$10", "$20");
        testEntityHelper.createTestBenefit("CO_INSURANCE", pnn.getPlan(), "50%", "80%");
        testEntityHelper.createTestBenefit("INPATIENT_HOSPITAL", pnn.getPlan(), "3x", "5x");
        testEntityHelper.createTestBenefit("ORTHO_ELIGIBILITY", pnn.getPlan(), "Child", null);
        testEntityHelper.createTestBenefit("INDIVIDUAL_OOP_LIMIT", pnn.getPlan(), "45", "55");

        token = createToken(client.getBroker().getBrokerToken());
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{clientId}/file", client.getClientId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(Constants.HTTP_HEADER_CONTENT_TYPE_XML))
                .andReturn();
        
        byte[] bytes = result.getResponse().getContentAsByteArray();
        ByteArrayInputStream inputStream = new ByteArrayInputStream(bytes);
        
        MockMultipartFile mockFile = new MockMultipartFile("file", "client.xml", "application/xml", inputStream);

        // test if file exists
        MvcResult result2 = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/v1/clients/upload")
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andReturn();

        // set override flag
        MvcResult result3 = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/v1/clients/upload")
                .file(mockFile)
                .param("override", "true")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isCreated())
                .andReturn();

        // set new file name
        MvcResult result4 = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/v1/clients/upload")
                .file(mockFile)
                .param("clientName", client.getClientName() + " NEW")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isCreated())
                .andReturn();

        // check if new loaded benefits have correct value and format
        List<Client> newClients = clientRepository.findByClientNameAndBrokerBrokerIdAndCarrierOwned(
            client.getClientName() + " NEW", client.getBroker().getBrokerId(), false);
        assertThat(newClients).hasSize(1);
        RFP newRfp = rfpRepository.findByClientClientIdAndProduct(newClients.get(0).getClientId(), rfp.getProduct());
        List<RfpToPnn> newPnns = rfpToPnnRepository.findByRfpRfpId(newRfp.getRfpId());
        assertThat(newPnns).hasSize(1);
        Plan newPlan = newPnns.get(0).getPnn().getPlan();
        List<Benefit> benefits = benefitRepository.findByPlanId(newPlan.getPlanId());
        assertThat(benefits).hasSize(9);
        for (Benefit ben : benefits) {
            if (ben.getBenefitName().getName().equals("INDIVIDUAL_DEDUCTIBLE")) {
                if (ben.getInOutNetwork().equals("IN")) {
                    assertThat(ben.getValue()).isEqualTo("10");
                    assertThat(ben.getFormat()).isEqualTo("DOLLAR");
                } else {
                    assertThat(ben.getValue()).isEqualTo("20");
                    assertThat(ben.getFormat()).isEqualTo("DOLLAR");
                }
            } else if (ben.getBenefitName().getName().equals("CO_INSURANCE")) {
                if (ben.getInOutNetwork().equals("IN")) {
                    assertThat(ben.getValue()).isEqualTo("50");
                    assertThat(ben.getFormat()).isEqualTo("PERCENT");
                } else {
                    assertThat(ben.getValue()).isEqualTo("80");
                    assertThat(ben.getFormat()).isEqualTo("PERCENT");
                }
            } else if (ben.getBenefitName().getName().equals("INPATIENT_HOSPITAL")) {
                if (ben.getInOutNetwork().equals("IN")) {
                    assertThat(ben.getValue()).isEqualTo("3");
                    assertThat(ben.getFormat()).isEqualTo("MULTIPLE");
                } else {
                    assertThat(ben.getValue()).isEqualTo("5");
                    assertThat(ben.getFormat()).isEqualTo("MULTIPLE");
                }
            } else if (ben.getBenefitName().getName().equals("ORTHO_ELIGIBILITY")) {
                assertThat(ben.getValue()).isEqualTo("Child");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("INDIVIDUAL_OOP_LIMIT")) {
                if (ben.getInOutNetwork().equals("IN")) {
                    assertThat(ben.getValue()).isEqualTo("45");
                    assertThat(ben.getFormat()).isEqualTo("NUMBER");
                } else {
                    assertThat(ben.getValue()).isEqualTo("55");
                    assertThat(ben.getFormat()).isEqualTo("NUMBER");
                }
            } else {
                fail("Unknown benefit: " + ben.getBenefitName().getName());
            }
        }

        
    }

	@Test
	public void archiveClient() throws Exception {
		Client client = testEntityHelper.createTestClient();
		token = createToken(client.getBroker().getBrokerToken());

		mockMvc.perform(MockMvcRequestBuilders.post("/v1/clients/{clientId}/archive", client.getClientId())
				.header("Authorization", "Bearer " + token))
				.andExpect(status().isCreated())
				.andReturn();

		Client archivedClient = clientRepository.findOne(client.getClientId());
		assertNotNull(archivedClient);
		assertEquals(archivedClient.isArchived(), true);
	}
	
	@Test
    public void getClientByIdWithAttribute() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        clientService.setAttribute(client, AttributeName.DIRECT_TO_PRESENTATION);
        
        flushAndClear();
        
        MvcResult result = performGetAndAssertResult(null, "/v1/clients/{id}", client.getClientId());
        
        ClientDto clientDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto.class);
        assertThat(clientDto.getAttributes()).hasSize(1);
        assertThat(clientDto.getAttributes().get(0)).isEqualTo(AttributeName.DIRECT_TO_PRESENTATION);
        
    }
	
	@Test
    public void getClientsByExtBrokerId() throws Exception {
        
	    Broker broker = testEntityHelper.createTestBroker();
        Client client1 = testEntityHelper.createTestClient("client1ForBroker", broker);
        Client client2 = testEntityHelper.createTestClient("client2ForBroker", broker);
        
        Broker generalAgent = testEntityHelper.createTestGeneralAgent();

        token = createToken(generalAgent.getBrokerToken());
        
        extClientAccessRepository.save(new ExtClientAccess(generalAgent, client1));
        // add logged in user to client team
        testEntityHelper.createClientTeam(generalAgent, client1, testAuthId);
        
        flushAndClear();
        
        MvcResult result = performGetAndAssertResult(null, "/v1/clients");
        
        ClientDto[] clientDtos = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto[].class);
        
        assertThat(clientDtos).hasSize(1);
        assertThat(clientDtos[0].getClientName()).isEqualTo(client1.getClientName());
        
    }
	
	@Test
    public void createClientByExtBrokerNotAuth() throws Exception {
	    
	    Broker broker = testEntityHelper.createTestBroker();
        Broker generalAgent = testEntityHelper.createTestGeneralAgent();
        token = createToken(generalAgent.getBrokerToken());
        
        Client client = testEntityHelper.buildTestClient("Client1", broker);
        ClientDto dto = ClientMapper.clientToDTO(client);

        mockMvc.perform(MockMvcRequestBuilders.post("/v1/clients")
                .header(HttpHeaders.AUTHORIZATION, AbstractControllerTest.AUTHORIZATION_HEADER_BEARER + " " + token)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(jsonUtils.toJson(dto))
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isUnauthorized())
                .andReturn(); 
    }

	@Test
    public void createClientByExtBroker() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Broker generalAgent = testEntityHelper.createTestGeneralAgent();
        token = createToken(generalAgent.getBrokerToken());
        
        Client client = testEntityHelper.buildTestClient("Client1", broker);
        ClientDto dto = ClientMapper.clientToDTO(client);
        
        extBrokerageAccessRepository.save(new ExtBrokerageAccess(generalAgent, broker));
        
        flushAndClear();

        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(dto), null, "/v1/clients");
        
        ClientDto clientDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientDto.class);
        
        assertThat(clientDto.getClientName()).isEqualTo(client.getClientName());
        assertThat(clientDto.getBrokerId()).isEqualTo(broker.getBrokerId());
        
        List<Client> clients = extClientAccessRepository.findClientsByBrokerId(generalAgent.getBrokerId());
        
        assertThat(clients).hasSize(1);
        assertThat(clients.get(0).getClientName()).isEqualTo(client.getClientName());
        
    }

    @Test
    public void exportImportClientByAgent() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
        Broker generalAgent = testEntityHelper.createTestGeneralAgent();
        
        token = createToken(generalAgent.getBrokerToken());

        Client client = testEntityHelper.createTestClient("Client1", broker);
        
        extBrokerageAccessRepository.save(new ExtBrokerageAccess(generalAgent, broker));
        extClientAccessRepository.save(new ExtClientAccess(generalAgent, client));
        // add logged-in user to client team
        testEntityHelper.createClientTeam(generalAgent, client, testAuthId);

        RFP rfp = testEntityHelper.createTestRFPWithOptionsAndCarrierHistory(client);
        PlanNameByNetwork pnn = testEntityHelper.createTestPlanNameByNetwork("Test HMO", Constants.UHC_CARRIER, "HMO");
        testEntityHelper.createTestRfpToPNN(rfp, pnn);        

        flushAndClear();
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{clientId}/file", client.getClientId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(Constants.HTTP_HEADER_CONTENT_TYPE_XML))
                .andReturn();
        
        byte[] bytes = result.getResponse().getContentAsByteArray();
        ByteArrayInputStream inputStream = new ByteArrayInputStream(bytes);
        
        MockMultipartFile mockFile = new MockMultipartFile("file", "client.xml", "application/xml", inputStream);

        // test if file exists
        mockMvc.perform(MockMvcRequestBuilders.fileUpload("/v1/clients/upload")
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .param("brokerId", broker.getBrokerId().toString())
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andReturn();

        // set override flag
        mockMvc.perform(MockMvcRequestBuilders.fileUpload("/v1/clients/upload")
                .file(mockFile)
                .param("override", "true")
                .param("brokerId", broker.getBrokerId().toString())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isCreated())
                .andReturn();

        // set new file name
        mockMvc.perform(MockMvcRequestBuilders.fileUpload("/v1/clients/upload")
                .file(mockFile)
                .param("clientName", client.getClientName() + " NEW")
                .param("brokerId", broker.getBrokerId().toString())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isCreated())
                .andReturn();
        
    }

    @Test
    public void setClientAttributes() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        List<AttributeDto> attributes = Arrays.asList(new AttributeDto(AttributeName.TOP_CLIENT, "topValue"),
            new AttributeDto(AttributeName.CLSA_AVG_AGE, "32"));
        

        performPostAndAssertResult(jsonUtils.toJson(attributes), null,
                "/v1/clients/{clientId}/saveAttributes", client.getClientId());
        
        ClientAttribute topClientAttribute = attributeRepository.findClientAttributeByClientIdAndName(
                client.getClientId(), AttributeName.TOP_CLIENT);

        ClientAttribute clsaAttribute = attributeRepository.findClientAttributeByClientIdAndName(
            client.getClientId(), AttributeName.CLSA_AVG_AGE);

        assertThat(topClientAttribute).isNotNull();
        assertThat(topClientAttribute.getValue()).isEqualTo("topValue");
        assertThat(clsaAttribute).isNotNull();
        assertThat(clsaAttribute.getValue()).isEqualTo("32");

        // remove TOP_CLIENT attribute. This is the only attribute FE can remove
        attributes = Arrays.asList(new AttributeDto(AttributeName.TOP_CLIENT, "topValue"));
        performPostAndAssertResult(jsonUtils.toJson(attributes), null,
            "/v1/clients/{clientId}/removeAttributes", client.getClientId());

        topClientAttribute = attributeRepository.findClientAttributeByClientIdAndName(
            client.getClientId(), AttributeName.TOP_CLIENT);
        assertThat(topClientAttribute).isNull();
    }

    
    @Test
    public void removeClientAttributes() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        testEntityHelper.createTestClientAttribute(client, AttributeName.TOP_CLIENT);

        List<AttributeDto> attributes = Arrays.asList(new AttributeDto(AttributeName.TOP_CLIENT, null));
        

        performPostAndAssertResult(jsonUtils.toJson(attributes), null, 
                "/v1/clients/{clientId}/removeAttributes", client.getClientId());
        
        ClientAttribute attribute = attributeRepository.findClientAttributeByClientIdAndName(
                client.getClientId(), AttributeName.TOP_CLIENT);

        assertThat(attribute).isNull();
        
    }

}
