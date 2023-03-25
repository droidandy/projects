package com.benrevo.be.modules.rfp.service;

import static com.benrevo.common.enums.CarrierType.UHC;
import static java.util.Arrays.asList;
import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.eq;
import static org.mockito.Matchers.isA;
import static org.mockito.Matchers.isNull;
import static org.mockito.Mockito.when;

import com.benrevo.be.modules.rfp.service.BaseRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CensusInfoDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientFileType;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.be.modules.rfp.service.RfpSubmitter;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.CarrierHistory;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ExtClientAccessRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.benrevo.data.persistence.repository.ancillary.RfpToAncillaryPlanRepository;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.context.ApplicationEventPublisher;


@RunWith(MockitoJUnitRunner.class)
//FIXME use @SpringBootTest and @MockBean
public class BaseRfpServiceUnitTest {

    @InjectMocks
    private BaseRfpService baseRfpService = new BaseRfpService();

    @Mock
    private ApplicationEventPublisher publisher;

    @Mock
    private RfpSubmitter rfpSubmitter;

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private RfpRepository rfpRepository;

    @Mock
    private ClientPlanRepository clientPlanRepository;

    @Mock
    private RfpEmailService emailService;

    @Mock
    private RfpCarrierRepository rfpCarrierRepository;
    
    @Mock
    private CarrierRepository carrierRepository;
    
    @Mock
    private RfpSubmissionRepository submissionRepository;
    @Mock
    private ExtClientAccessRepository extClientAccessRepository;

    @Mock
    private RfpToPnnRepository rfpToPnnRepository;

    @Mock
    private RfpToAncillaryPlanRepository rfp2apRepository;

    @Mock
    private CustomLogger logger;

    @Before
    public void setup() {
        baseRfpService.appCarrier = new String[] {UHC.name()};
    }

    @Test
    public void getCensusInfoByClientCalculations() throws Exception {
        String preSaleEmail = "test@test.com";
        Broker broker = new Broker();
        Person preSale = new Person();
        preSale.setType(PersonType.PRESALES);
        preSale.setEmail(preSaleEmail);
        broker.setPresales(preSale);

        Client client = new Client();
        client.setClientId(235L);
        client.setBroker(broker);
        client.setPredominantCounty("Alameda");
        client.setParticipatingEmployees(50L);          // 50%, 0 points
        client.setEmployeeCount(100L);
        client.setCobraCount(9);                        // 9%, 2 points, total 2 points
        RFP rfp = new RFP();
        Option option = new Option();
        option.setCensusTier1(9999d);
        option.setCensusTier2(9999d);
        option.setCensusTier3(9999d);
        option.setCensusTier4(9999d);
        option.setContributionTier1(25d);               //25%, -1 point, total 1
        option.setRateTier1(100d);
        option.setContributionTier2(25d);               //25%, 2 points, total 3
        option.setRateTier2(100d);
        Option option1 = new Option();
        option1.setCensusTier1(5d);
        option1.setCensusTier2(5d);
        option1.setCensusTier3(5d);
        option1.setCensusTier4(5d);
        rfp.setOptions(asList(option, option1));
        CarrierHistory carrierHistory = new CarrierHistory();
        carrierHistory.setCurrent(true);
        carrierHistory.setYears(3);                     // 3 points, total 6
        rfp.setCarrierHistories(asList(carrierHistory));

        when(clientRepository.findOne(eq(client.getClientId()))).thenReturn(client);
        when(rfpRepository.findByClientClientIdAndProduct(eq(client.getClientId()),
            eq(Constants.MEDICAL)
        )).thenReturn(rfp);

        CensusInfoDto result = baseRfpService.getCensusInfoByClientCalculations(client.getClientId());
        assertEquals(ClientFileType.MEMBER, result.getType());
        assertEquals(6, (int) result.getCensusLevel());
        assertEquals(preSaleEmail, result.getEmail());
        assertNotNull(result.getSampleUrl());

        client.setParticipatingEmployees(95L);          // 4 points, total 10
        result = baseRfpService.getCensusInfoByClientCalculations(client.getClientId());
        assertEquals(ClientFileType.MEMBER, result.getType());
        assertEquals(10, (int) result.getCensusLevel());
        assertEquals(preSaleEmail, result.getEmail());
        assertNotNull(result.getSampleUrl());

        client.setCobraCount(15);                       // 0 points, total 8
        result = baseRfpService.getCensusInfoByClientCalculations(client.getClientId());
        assertEquals(ClientFileType.MEMBER, result.getType());
        assertEquals(8, (int) result.getCensusLevel());
        assertEquals(preSaleEmail, result.getEmail());
        assertNotNull(result.getSampleUrl());

        option.setContributionTier1(58d);               // 1 point, total 10
        result = baseRfpService.getCensusInfoByClientCalculations(client.getClientId());
        assertEquals(ClientFileType.MEMBER, result.getType());
        assertEquals(10, (int) result.getCensusLevel());
        assertEquals(preSaleEmail, result.getEmail());
        assertNotNull(result.getSampleUrl());

        option.setContributionTier2(19d);               // 1 point, total 9
        result = baseRfpService.getCensusInfoByClientCalculations(client.getClientId());
        assertEquals(ClientFileType.MEMBER, result.getType());
        assertEquals(9, (int) result.getCensusLevel());
        assertEquals(preSaleEmail, result.getEmail());
        assertNotNull(result.getSampleUrl());

        carrierHistory.setYears(2);                     // 1 point, total 7
        option.setContributionTier2(89d);               // 5 points, total 11
        result = baseRfpService.getCensusInfoByClientCalculations(client.getClientId());
        assertEquals(ClientFileType.MEMBER, result.getType());
        assertEquals(11, (int) result.getCensusLevel());
        assertEquals(preSaleEmail, result.getEmail());
        assertNotNull(result.getSampleUrl());
    }

    @Test(expected = BaseException.class)
    public void getFileTypeByClientCalculationsWrongClientId() {
        baseRfpService.getCensusInfoByClientCalculations(Long.MAX_VALUE);
    }

    @Ignore // see RfpSubmitter.createRfpSubmissions: if(rc == null) { ...
    @Test(expected = NotFoundException.class)
    public void createRfpSubmission() {
        String preSaleEmail = "test@test.com";
        Broker broker = new Broker();
        Person preSale = new Person();
        preSale.setType(PersonType.PRESALES);
        preSale.setEmail(preSaleEmail);
        broker.setPresales(preSale);
        Client client = new Client();
        client.setClientId(22L);
        client.setBroker(broker);

        ArrayList<Long> rfpIds = new ArrayList<Long>();
        rfpIds.add(new Long("22"));

        when(clientRepository.findOne(eq(client.getClientId()))).thenReturn(client);
        when(rfpRepository.findByClientClientIdAndProduct(eq(client.getClientId()),
            eq(Constants.MEDICAL)
        )).thenReturn(null);

        baseRfpService.rfpSubmission(22L, rfpIds);
    }

    @Test
    public void testCreatePlansOnRfpSubmission() {
        Broker broker = new Broker();
        Client client = new Client();
        client.setClientId(22L);
        client.setBroker(broker);

        RFP rfp = new RFP();
        rfp.setContributionType("%");
        rfp.setRfpId(42L);
        Option option1 = new Option();
        option1.setId(1L);
        option1.setPlanType("HMO");
        option1.setCensusTier1(1d);
        option1.setRateTier1(2d);
        option1.setRenewalTier1(3d);
        option1.setContributionTier1(4d);
        rfp.setOptions(asList(option1));
        ArrayList<Long> rfpIds = new ArrayList<>();
        rfpIds.add(42L);

        PlanNameByNetwork pnn = new PlanNameByNetwork();
        pnn.setPnnId(1L);
        RfpToPnn rfpToPnn = new RfpToPnn();
        rfpToPnn.setPlanType("HMO");
        rfpToPnn.setOptionId(1L);
        rfpToPnn.setPnn(pnn);

        when(rfpToPnnRepository
            .findByRfpRfpIdAndOptionIdAndPlanType(rfp.getRfpId(), option1.getId(),
                option1.getPlanType())).thenReturn(rfpToPnn);

        when(clientRepository.findOne(eq(client.getClientId()))).thenReturn(client);
        
        Carrier carrier = new Carrier();
        carrier.setCarrierId(123L);
        carrier.setName(Constants.UHC_CARRIER);  
        when(carrierRepository.findByName(eq(carrier.getName()))).thenReturn(carrier);
        
        RfpCarrier rfpCarrier = new RfpCarrier();
        rfpCarrier.setCarrier(carrier);
        rfpCarrier.setCategory(Constants.MEDICAL);
        
        when(rfpRepository.findByClientClientIdAndRfpId(eq(client.getClientId()),
            eq(rfp.getRfpId())
        )).thenReturn(rfp);
        when(rfpCarrierRepository.findByCarrierNameAndCategory(eq(Constants.UHC_CARRIER),
            isNull(String.class)
        )).thenReturn(rfpCarrier);
        Map<Long, List<ClientPlan>> storage = new HashMap<>();
        when(clientPlanRepository.save(isA(ClientPlan.class))).then(invocation -> {
            ClientPlan plan = invocation.getArgumentAt(0, ClientPlan.class);
            List<ClientPlan> clientPlans =
                storage.getOrDefault(plan.getClient().getClientId(), new ArrayList<>());
            clientPlans.add(plan);
            storage.put(plan.getClient().getClientId(), clientPlans);
            return plan;
        });
        when(rfp2apRepository.findByRfp_RfpId(isA(Long.class))).thenReturn(new ArrayList<>());
        when(clientPlanRepository.findByClientClientId(isA(Long.class))).then(
            invocation -> storage.getOrDefault(invocation.getArgumentAt(0, Long.class),
                new ArrayList<>()
            ));

        baseRfpService.rfpSubmission(client.getClientId(), rfpIds);
        List<ClientPlan> list = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(list).isNotEmpty();
        ClientPlan plan = list.get(0);
        assertThat(plan.getTier1Census()).isEqualTo(option1.getCensusTier1().longValue());
        assertThat(option1.getCensusTier2()).isNull();
        assertThat(plan.getTier1ErContribution()).isEqualTo(
            option1.getContributionTier1().floatValue());
        assertThat(plan.getTier1Rate()).isEqualTo(option1.getRateTier1().floatValue());
        assertThat(plan.getTier1Renewal()).isEqualTo(option1.getRenewalTier1().floatValue());
        assertThat(plan.getErContributionFormat()).isEqualTo(
            Constants.ER_CONTRIBUTION_FORMAT_PERCENT);
    }
}
