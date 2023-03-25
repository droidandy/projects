package com.benrevo.dashboard.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientSearchRepository;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.web.servlet.MvcResult;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientRenewalDto;
import com.benrevo.common.dto.DiscountDataDto;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.enums.ProbabilityOption;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.enums.RfpQuoteOptionAttributeName;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.PersonRelation;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionAttribute;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.PersonRelationRepository;


public class UHCDashboardClientControllerTest extends AbstractControllerTest {

    @Autowired
	private UHCDashboardClientRenewalController controller;
	
	@Autowired
    private AttributeRepository attributeRepository;

	@Autowired
    private PersonRelationRepository personRelationRepository;

	@Autowired
    private ClientRepository clientRepository;
	
    @Before
    @Override
    public void init() throws Auth0Exception {
        initController(controller);
    }
    
    @Test
    public void findClientRenewalAtRisk() throws Exception {
        
        final String CARR_MANAGER_EMAIL = "carrManagerEmail@test.com";
        
        token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, testAuthId, 
                ArrayUtils.toArray(AccountRole.CARRIER_MANAGER_RENEWAL.getValue()), appCarrier);

        User user = new User();
        user.setEmail(CARR_MANAGER_EMAIL);
        Mockito.when(mgmtAPI.users().get(Mockito.any(), Mockito.eq(null)).execute()).thenReturn(user);
        
        Person testManager = testEntityHelper.createTestPerson(PersonType.CARRIER_MANAGER_RENEWAL, 
                "testCarrManager", CARR_MANAGER_EMAIL, CarrierType.UHC.name());
        
        Broker broker1 = testEntityHelper.createTestBroker();
        for(Person sales1 : broker1.getSales()) {
            sales1.setType(PersonType.SALES_RENEWAL);

            PersonRelation pr1 = new PersonRelation(testManager, sales1);
            pr1 = personRelationRepository.save(pr1);
        }

        Broker broker2 = testEntityHelper.createTestBroker();
        for(Person sales2 : broker2.getSales()) {
            sales2.setType(PersonType.SALES_RENEWAL);
            sales2.setFullName("Sales2 name");
    
            PersonRelation pr2 = new PersonRelation(testManager, sales2);
            pr2 = personRelationRepository.save(pr2);
        }
        
        Broker broker3 = testEntityHelper.createTestBroker();

        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.UHC.name(), CarrierType.UHC.name());
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        
        createTestRenewalClient(broker1, "ClientName1", ProbabilityOption.MEDIUM, rfpCarrier);
        createTestRenewalClient(broker1, "ClientName2", ProbabilityOption.LOW, rfpCarrier);
        createTestRenewalClient(broker1, "ClientName3", ProbabilityOption.MEDIUM, rfpCarrier);
        createTestRenewalClient(broker2, "ClientName4", ProbabilityOption.HIGH, rfpCarrier);
        createTestRenewalClient(broker2, "ClientName5", null, rfpCarrier);
        createTestRenewalClient(broker2, "ClientName6", null, rfpCarrier);

        MvcResult result = performGetAndAssertResult((Object) null, "/dashboard/clients/{product}/atRisk", "MEDICAL");
        
        ClientRenewalDto[] dtos = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientRenewalDto[].class);

        assertThat(dtos)
            .hasSize(5)
            .extracting("probability")
            .containsExactly("LOW","MEDIUM","MEDIUM","HIGH", null);

    }

    @Test
    public void findClientRenewalUpcoming() throws Exception {
        
        final String CARR_MANAGER_EMAIL = "carrManagerEmail@test.com";
        
        token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, testAuthId, 
                ArrayUtils.toArray(AccountRole.CARRIER_MANAGER_RENEWAL.getValue()), appCarrier);

        User user = new User();
        user.setEmail(CARR_MANAGER_EMAIL);
        Mockito.when(mgmtAPI.users().get(Mockito.any(), Mockito.eq(null)).execute()).thenReturn(user);
        
        Person testManager = testEntityHelper.createTestPerson(PersonType.CARRIER_MANAGER_RENEWAL, 
                "testCarrManager", CARR_MANAGER_EMAIL, CarrierType.UHC.name());
        
        Broker broker1 = testEntityHelper.createTestBroker();
        for(Person sales1 : broker1.getSales()) {
            sales1.setType(PersonType.SALES_RENEWAL);

            PersonRelation pr1 = new PersonRelation(testManager, sales1);
            pr1 = personRelationRepository.save(pr1);
        }

        Broker broker2 = testEntityHelper.createTestBroker();
        for(Person sales2 : broker2.getSales()) {
            sales2.setType(PersonType.SALES_RENEWAL);
            sales2.setFullName("Sales2 name");
    
            PersonRelation pr2 = new PersonRelation(testManager, sales2);
            pr2 = personRelationRepository.save(pr2);
        }
        
        Broker broker3 = testEntityHelper.createTestBroker();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.UHC.name(), CarrierType.UHC.name());
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        
        Client client1 = createTestRenewalClient(broker1, "ClientName1", null, rfpCarrier);
        client1.setEffectiveDate(DateUtils.addDays(new Date(), 3));
        Client client2 = createTestRenewalClient(broker1, "ClientName2", null, rfpCarrier);
        client2.setEffectiveDate(DateUtils.addDays(new Date(), 7));
        Client client3 = createTestRenewalClient(broker1, "ClientName3", null, rfpCarrier);
        client3.setEffectiveDate(DateUtils.addDays(new Date(), 2));
        Client client4 = createTestRenewalClient(broker2, "ClientName4", null, rfpCarrier);
        client4.setEffectiveDate(DateUtils.addDays(new Date(), 4));
        Client client5 = createTestRenewalClient(broker3, "ClientName5", null, rfpCarrier);
        client5.setEffectiveDate(DateUtils.addDays(new Date(), 6));
        Client client6 = createTestRenewalClient(broker3, "ClientName6", null, rfpCarrier);
        client6.setEffectiveDate(DateUtils.addDays(new Date(), 1));

        MvcResult result = performGetAndAssertResult((Object) null, "/dashboard/clients/{product}/upcoming", "MEDICAL");

        ClientRenewalDto[] dtos = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientRenewalDto[].class);

        assertThat(dtos)
            .hasSize(4)
            .extracting("clientName")
            .contains("ClientName3", "ClientName1", "ClientName4", "ClientName2" );

    }

    @Test
    public void getDiscountDataRenewal() throws Exception {
        
        final String CARR_MANAGER_EMAIL = "carrManagerEmail@test.com";
        
        token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, testAuthId, 
                ArrayUtils.toArray(AccountRole.CARRIER_MANAGER_RENEWAL.getValue()), appCarrier);

        User user = new User();
        user.setEmail(CARR_MANAGER_EMAIL);
        Mockito.when(mgmtAPI.users().get(Mockito.any(), Mockito.eq(null)).execute()).thenReturn(user);
        
        Person testManager = testEntityHelper.createTestPerson(PersonType.CARRIER_MANAGER_RENEWAL, 
                "testCarrManager", CARR_MANAGER_EMAIL, CarrierType.UHC.name());
        
        Broker broker1 = testEntityHelper.createTestBroker();
        for(Person sales1 : broker1.getSales()) {
            sales1.setType(PersonType.SALES_RENEWAL);

            PersonRelation pr1 = new PersonRelation(testManager, sales1);
            pr1 = personRelationRepository.save(pr1);
        }

        Broker broker2 = testEntityHelper.createTestBroker();
        for(Person sales2 : broker2.getSales()) {
            sales2.setType(PersonType.SALES_RENEWAL);
            sales2.setFullName("Sales2 name");
    
            PersonRelation pr2 = new PersonRelation(testManager, sales2);
            pr2 = personRelationRepository.save(pr2);
        }
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.UHC.name(), CarrierType.UHC.name());
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.DENTAL);
        
        createTestClient("client1", ClientState.SOLD, broker1, rfpCarrier);
        createTestClient("client2", ClientState.PENDING_APPROVAL, broker1, rfpCarrier);
        
        Client client3 = createTestClient("client3", ClientState.CLOSED, broker2, rfpCarrier);
        client3.setParticipatingEmployees(1234L);

        flushAndClear();
        
        String result = performGet("/dashboard/clients/discountData", new Object[] {"quarterYear", "Q2 2018"}, (Object) null);
        DiscountDataDto dto = jsonUtils.fromJson(result, DiscountDataDto.class);

        assertThat(dto.getClosedGroupCount()).isEqualTo(1);
        assertThat(dto.getPendingGroupCount()).isEqualTo(2);
        assertThat(dto.getTotalGroupCount()).isEqualTo(3);
        assertThat(dto.getSalesPersons()).hasSize(2);

    }

    private Client createTestClient(String clientName, ClientState clientState, Broker broker, RfpCarrier rfpCarrier) {
        Client client = testEntityHelper.createTestClient(clientName, broker);
        
        client.setClientState(clientState);
        client.setCarrierOwned(false);
        
        Calendar calendar = Calendar.getInstance();
        calendar.set(2018, 4, 29, 5, 6, 7); // Q2 2018
        client.setEffectiveDate(calendar.getTime());

        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);
        RfpQuote quote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);

        RfpQuoteNetwork hmo = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmo, 100f, 100f, 100f, 100f, true);
        RfpQuoteOption option = testEntityHelper.createTestRfpQuoteOption(quote, "Renewal 1");

        testEntityHelper.createTestRfpQuoteOptionNetwork(option,
                hmo, hmoPlan, null, 1L, 1L, 1L, 1L,
                Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        attributeRepository.save(new ClientAttribute(client, AttributeName.RENEWAL));
        attributeRepository.save(new RfpQuoteOptionAttribute(option, RfpQuoteOptionAttributeName.STARTING_TOTAL, "5000.0"));
        
        return client;
    }
    
    private Client createTestRenewalClient(Broker broker, String clientName, ProbabilityOption probability, RfpCarrier rfpCarrier) {
        Client client = testEntityHelper.createTestClient(clientName, broker);
        testEntityHelper.createTestClientAttribute(client, AttributeName.RENEWAL);
        client.setClientState(ClientState.QUOTED);
        client.setCarrierOwned(false);

        if (probability !=null) {
            testEntityHelper.createTestActivity( client, null, null,
                    ActivityType.PROBABILITY, null, probability.name());
        }

        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);
        RfpQuote quote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);

        RfpQuoteNetwork network = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            network, 600f, 900f, 700f, 1100f, true);
        testEntityHelper.createTestRfpQuoteOption(quote, "Renewal 1");
        return client;
    }

    @Test
    public void findTopClients() throws Exception {
        
        final String CARR_MANAGER_EMAIL = "carrManagerEmail@test.com";
        
        token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, testAuthId, 
                ArrayUtils.toArray(AccountRole.CARRIER_MANAGER_RENEWAL.getValue()), appCarrier);

        User user = new User();
        user.setEmail(CARR_MANAGER_EMAIL);
        Mockito.when(mgmtAPI.users().get(Mockito.any(), Mockito.eq(null)).execute()).thenReturn(user);
        
        Person testManager = testEntityHelper.createTestPerson(PersonType.CARRIER_MANAGER_RENEWAL, 
                "testCarrManager", CARR_MANAGER_EMAIL, CarrierType.UHC.name());
        
        Broker broker1 = testEntityHelper.createTestBroker();
        for(Person sales1 : broker1.getSales()) {
            sales1.setType(PersonType.SALES_RENEWAL);

            PersonRelation pr1 = new PersonRelation(testManager, sales1);
            pr1 = personRelationRepository.save(pr1);
        }

        Broker broker2 = testEntityHelper.createTestBroker();
        for(Person sales2 : broker2.getSales()) {
            sales2.setType(PersonType.SALES_RENEWAL);
            sales2.setFullName("Sales2 name");
    
            PersonRelation pr2 = new PersonRelation(testManager, sales2);
            pr2 = personRelationRepository.save(pr2);
        }
        
        Broker broker3 = testEntityHelper.createTestBroker();
        
        Client client1 = testEntityHelper.createTestClient("ClientName 1", broker1);
        testEntityHelper.createTestClientAttribute(client1, AttributeName.TOP_CLIENT);
        testEntityHelper.createTestClientAttribute(client1, AttributeName.RENEWAL);

        Client client2 = testEntityHelper.createTestClient("ClientName 2", broker1);
        testEntityHelper.createTestClientAttribute(client2, AttributeName.TOP_CLIENT);
        testEntityHelper.createTestClientAttribute(client2, AttributeName.RENEWAL);

        Client client3 = testEntityHelper.createTestClient("ClientName 3", broker1);
        testEntityHelper.createTestClientAttribute(client3, AttributeName.TOP_CLIENT);
        testEntityHelper.createTestClientAttribute(client3, AttributeName.RENEWAL);

        // Wrong broker
        Client client4 = testEntityHelper.createTestClient("ClientName 4", broker3);
        testEntityHelper.createTestClientAttribute(client4, AttributeName.TOP_CLIENT);
        testEntityHelper.createTestClientAttribute(client4, AttributeName.RENEWAL);

        // Without TOP_CLIENT attribute
        Client client5 = testEntityHelper.createTestClient("ClientName 5", broker2);
        
        Client client6 = testEntityHelper.createTestClient("ClientName 6", broker2);
        client6.setClientState(ClientState.COMPLETED);
        testEntityHelper.createTestClientAttribute(client6, AttributeName.TOP_CLIENT);
        testEntityHelper.createTestClientAttribute(client6, AttributeName.RENEWAL);

        ClientPlan hmoClientPlan = testEntityHelper.createTestClientPlan(client6, "test hmo client plan",null, "HMO",
                100F, 100F, 100F, 100F,
                1L, 1L, 1L, 1L,
                0F, 0F, 0F, 0F);
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.UHC.name(), CarrierType.UHC.name());
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client6, rfpCarrier);
        RfpQuote quote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetworkPlan hmoPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork, 110f, 110f, 110f, 110f, true);
        
        RfpQuoteOption renewal1 = testEntityHelper.createTestRfpQuoteOption(quote, "Renewal 1");
        
        testEntityHelper.createTestRfpQuoteOptionNetwork(renewal1,
                hmoNetwork, hmoPlan, hmoClientPlan, 1L, 1L, 1L, 1L,
                Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);

        flushAndClear();
        
        MvcResult result = performGetAndAssertResult((Object) null, "/dashboard/clients/topClients");
        
        ClientRenewalDto[] dtos = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientRenewalDto[].class);

        assertThat(dtos)
            .hasSize(4)
            .extracting("clientName")
            .contains("ClientName 1", "ClientName 2", "ClientName 3", "ClientName 6");

        ClientRenewalDto client6Dto = null;
        for (ClientRenewalDto dto : dtos) {
            if (client6.getClientId().equals(dto.getClientId())) {
                client6Dto = dto;
            }
        }
        assertThat(client6Dto).isNotNull();
        assertThat(client6Dto.getStatus()).isEqualTo("Closed at +10");
        
    }

	
}
