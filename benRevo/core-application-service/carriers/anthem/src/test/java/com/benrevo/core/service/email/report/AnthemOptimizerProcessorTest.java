package com.benrevo.core.service.email.report;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.VISION;
import static org.mockito.Matchers.anyList;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import com.benrevo.be.modules.rfp.service.anthem.AnthemOptimizerProcessor;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.SharedClientMemberService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.UseTestProperties;
import com.benrevo.common.anthem.AnthemOptimizerParser;
import com.benrevo.common.anthem.AnthemOptimizerParserData;
import com.benrevo.common.anthem.AnthemOptimizerPlanDetails;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.OptimizerDto;
import com.benrevo.common.dto.OptimizerDto.OptimizerProduct;
import com.benrevo.common.enums.PersonType;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.CarrierHistory;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.ClientRfpProduct;
import com.benrevo.data.persistence.entities.ExtProduct;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientRfpProductRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;
import java.io.ByteArrayInputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.apache.commons.collections.ListUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.testng.Assert;


@RunWith(MockitoJUnitRunner.class)
@SpringBootTest(classes = AnthemCoreServiceApplication.class)
@UseTestProperties
public class AnthemOptimizerProcessorTest {

    private static final String ANTHEM_OPTIMIZER_TEMPLATE_XLSM = "/templates/anthem/email/2018 Optimizer v33_template.xlsm" ;

    private static final float DELTA = 0.0001F;
    
    @InjectMocks
    private AnthemOptimizerProcessor anthemOptimizerProcessor;
    
    @Mock
    private ClientRepository clientRepository;
    
    @Mock
    private BrokerRepository brokerRepository;

    @Mock
    private RfpRepository rfpRepository;

    @Mock
    private ClientPlanRepository clientPlanRepository;
    
    @Mock
    private Auth0Service auth0Service;
    
    @Mock
    private RfpToPnnRepository rfpToPnnRepository;
    
    @Mock
    private SharedClientMemberService sharedClientMemberService;
    
    @Mock
    private BenefitRepository benefitRepository;
    
    @Mock
    private ClientRfpProductRepository clientRfpProductRepository;
    
    private DateFormat dateFormatter = new SimpleDateFormat("MM/dd/yy");
    private Client client;
    private Broker agent;
    private RFP medicalRfp;
    private RFP dentalRfp;
    private RFP visionRfp;
    private PodamFactory podamFactory = new PodamFactoryImpl();
    
    @Before
    public void setup() throws Exception {

        Broker broker = new Broker();
        broker.setBrokerId(1L);
        Person presales = new Person();
        presales.setType(PersonType.PRESALES);
        presales.setEmail("testPresales@domain.test");
        presales.setFirstName("presalesFirstName");
        presales.setLastName("presalesLastName");
        presales.setFullName(presales.getFirstName() + " " + presales.getLastName());
        broker.setPresales(presales);
        Person sales = new Person();
        sales.setType(PersonType.SALES);
        sales.setEmail("testSales@domain.test");
        sales.setFirstName("salesFirstName");
        sales.setLastName("salesLastName");
        sales.setFullName(sales.getFirstName() + " " + sales.getLastName());
        broker.setSales(sales);
        broker.setName("testBroker");   
        
        client = new Client();
        client.setBroker(broker);
        client.setClientName("Test clientName");
        client.setZip("123");
        client.setSicCode("456");
        client.setEffectiveDate(new Date());
        client.setEligibleEmployees(5L);
        client.setDueDate(new Date());
        client.setCobraCount(17);
        
        when(clientRepository.findOne(anyLong())).thenReturn(client);
        
        when(brokerRepository.findOne(anyLong())).thenReturn(broker);

        agent = new Broker();
        agent.setBrokerId(2L);
        agent.setGeneralAgent(true);
        agent.setName("LISI");

        List<RFP> rfps = new ArrayList<>();
        
        medicalRfp = createRfp("MEDICAL",4,"%","5");
        medicalRfp.setOptions(new ArrayList<>());
        medicalRfp.setContributionType("%");
        rfps.add(medicalRfp);
        dentalRfp = createRfp("DENTAL",4,"PEPM","6");
        dentalRfp.setOptions(new ArrayList<>());
        dentalRfp.setContributionType("%");
        rfps.add(dentalRfp);
        visionRfp = createRfp("VISION",4,"%","7");
        visionRfp.setOptions(new ArrayList<>());
        visionRfp.setContributionType("%");
        rfps.add(visionRfp);

        List<CarrierHistory> carrierHistories = new ArrayList<>();
        carrierHistories.add(createCarrierHistory("UHC",2,true));
        carrierHistories.add(createCarrierHistory("SIGNA",1,false));
        carrierHistories.add(createCarrierHistory("ANTHEM",1,false));
        
        medicalRfp.setCarrierHistories(carrierHistories);
        
        when(rfpRepository.findByClientClientIdAndRfpIdIn(anyLong(), anyList())).thenReturn(rfps);
        when(rfpRepository.findByClientClientId(anyLong())).thenReturn(rfps);
        
        AuthenticatedUser authentication = mock(AuthenticatedUser.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        
        when(auth0Service.getUserEmail(anyString())).thenReturn("test@domain.test");
        
        List<Benefit> benefits = new ArrayList<>();
        benefits.addAll(createTestBenefit("INDIVIDUAL_DEDUCTIBLE", "$10", "$20"));
        benefits.addAll(createTestBenefit("PCP", "$15", null));
        benefits.addAll(createTestBenefit("SPECIALIST", "$16", null));
        benefits.addAll(createTestBenefit("INDIVIDUAL_OOP_LIMIT", "$11", "$12"));
        benefits.addAll(createTestBenefit("INPATIENT_HOSPITAL", "$13", "$14"));
        benefits.addAll(createTestBenefit("OUTPATIENT_SURGERY", "$14", "$15"));
        benefits.addAll(createTestBenefit("MEMBER_COPAY_TIER_1", "$16", null));
        benefits.addAll(createTestBenefit("MEMBER_COPAY_TIER_2", "$17", null));
        benefits.addAll(createTestBenefit("MEMBER_COPAY_TIER_3", "$18", null));
        benefits.addAll(createTestBenefit("MAIL_ORDER", "2X", null));
        when(benefitRepository.findByPlanId(anyLong())).thenReturn(benefits);
        
        // broker contacts
        List<ClientMemberDto> clientTeam = new ArrayList<>();
        ClientMemberDto ct1 = new ClientMemberDto();
        ct1.setEmail("ct1@@domain.test");
        ct1.setFirstName("first");
        ct1.setLastName("last");
        ct1.setFullName("first last");
        ct1.setBrokerageId(broker.getBrokerId());
        clientTeam.add(ct1);
        ClientMemberDto ct2 = new ClientMemberDto();
        ct2.setEmail("ct2@@domain.test");
        ct2.setFirstName("first");
        ct2.setLastName("last");
        ct2.setFullName("first last 2");
        ct2.setBrokerageId(agent.getBrokerId());
        clientTeam.add(ct2);
        when(sharedClientMemberService.getByClientId(anyLong())).thenReturn(clientTeam);

    }

    @After
    public void cleanUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void buildOptimizerFull() throws Exception {
        
        List<RfpToPnn> rfpToPnns = new ArrayList<>();
        
        // reverse ordered by total enrollment
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 10", "ANTHEM", "PPO", 1.9d, 2.9d, 3.9d, 4.9d, 42d, 43d, 44d, 45d, 41d, 42d, 43d, 44d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 9", "ANTHEM",  "PPO", 1.8d, 2.8d, 3.8d, 4.8d, 38d, 39d, 40d, 41d, 37d, 38d, 39d, 40d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 8", "ANTHEM",  "HMO", 1.7d, 2.7d, 3.7d, 4.7d, 34d, 35d, 36d, 37d, 33d, 34d, 35d, 36d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 7", "ANTHEM",  "EPO", 1.6d, 2.6d, 3.6d, 4.6d, 30d, 31d, 32d, 33d, 29d, 30d, 31d, 32d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 6", "ANTHEM",  "PPO", 1.5d, 2.5d, 3.5d, 4.5d, 26d, 27d, 28d, 29d, 25d, 26d, 27d, 28d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 5", "ANTHEM",  "HMO", 1.4d, 2.4d, 3.4d, 4.4d, 22d, 23d, 24d, 25d, 21d, 22d, 23d, 24d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 4", "UHC",     "PPO", 1.3d, 2.3d, 3.3d, 4.3d, 18d, 19d, 20d, 21d, 17d, 18d, 19d, 20d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 3", "SIGNA",   "PPO", 1.2d, 2.2d, 3.2d, 4.2d, 14d, 15d, 16d, 17d, 13d, 14d, 15d, 16d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 2", "ANTHEM",  "PPO", 1.1d, 2.1d, 3.1d, 4.1d, 10d, 11d, 12d, 13d, 9d, 10d, 11d, 12d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 1", "SIGNA",   "EPO", 1.0d, 2.0d, 3.0d, 4.0d,  6d,  7d,  8d,  9d, 5d, 6d, 7d, 8d);
        
        createTestOption(visionRfp, rfpToPnns, "", "ANTHEM", "VISION", 2.0d, 3.0d, 4.0d, 5.0d, 6d, 7d, 8d, 9d, 10d, 11d, 12d, 13d);
        
        // contributions and carrier are taken from plan with highest enrollment
        createTestOption(dentalRfp, rfpToPnns, "", "UHC", "DPPO", 2.2d, 2.3d, 2.4d, 2.5d, 9d, 10d, 11d, 12d, 3d, 4d, 5d, 6d);
        createTestOption(dentalRfp, rfpToPnns, "", "UHC", "DPPO", 2.1d, 2.2d, 2.3d, 2.4d, 5d, 6d, 7d, 8d, 3d, 4d, 5d, 6d);
        createTestOption(dentalRfp, rfpToPnns, "", "UHC", "DHMO", 2.6d, 2.7d, 2.8d, 2.9d, 13d, 14d, 15d, 16d, 3d, 4d, 5d, 6d);

        List<RfpToPnn> medicalRfpToPnns = rfpToPnns.subList(0, 10);
        List<RfpToPnn> visionRfpToPnns = rfpToPnns.subList(10, 11);
        List<RfpToPnn> dentalRfpToPnns = rfpToPnns.subList(11, 14);
        
        for (int i=0; i < rfpToPnns.size(); i++) {
            when(rfpToPnnRepository.findByRfpRfpIdAndOptionIdAndPlanType(Mockito.anyObject(), Mockito.eq((long)i), Mockito.anyObject())).thenReturn(rfpToPnns.get(i));
        }
        
        byte[] bytes = anthemOptimizerProcessor.build(ANTHEM_OPTIMIZER_TEMPLATE_XLSM, 0L, new ArrayList<>());
        
        // uncomment for manual testing
        //java.io.File xlsm = new java.io.File("test-Optimizer_template.xlsm ");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(xlsm, bytes);

        OptimizerDto dto = new OptimizerDto();
        dto.getProducts().add(new OptimizerProduct(MEDICAL, false));
        dto.getProducts().add(new OptimizerProduct(DENTAL, false));
        dto.getProducts().add(new OptimizerProduct(VISION, false));

        AnthemOptimizerParserData data = new AnthemOptimizerParser().parseAll(new ByteArrayInputStream(bytes), true, dto);

        Assert.assertEquals(data.getBrokerEmail(), "ct1@@domain.test");
        Assert.assertNull(data.getAgentName());
        Assert.assertNull(data.getAgentEmail());

        Assert.assertEquals(data.getBrokerName(), "testBroker");
        Assert.assertEquals(data.getClientName(), "Test clientName");
        Assert.assertEquals(data.getSicCode(), "0456");
        Assert.assertEquals(data.getEligibleEmployees().longValue(), 1020L);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), dateFormatter.format(client.getEffectiveDate()));
        Assert.assertEquals(data.getMedicalPlans().size(), 10);
        Assert.assertEquals(data.getDentalPlans().size(), 3);
        Assert.assertEquals(data.getVisionPlans().size(), 1);
        
        Assert.assertEquals(data.getMedicalTierRates(), 4);
        Assert.assertEquals(data.getDentalTierRates(), 4);
        Assert.assertEquals(data.getVisionTierRates(), 4);
        Assert.assertEquals(data.getDentalEeContribution(), 3F, DELTA);
        Assert.assertEquals(data.getDentalDepContribution(), 6F, DELTA);
        Assert.assertEquals(data.getSalesPerson(), "salesFirstName salesLastName");
        Assert.assertEquals(data.getPreSalesPerson(), "presalesFirstName presalesLastName");
        
        for (int i=0; i< data.getMedicalPlans().size(); i++) {
            assertPlans(data.getMedicalPlans().get(i), medicalRfpToPnns.get(i), medicalRfp.getOptions().get(i), 4 );
        }
        for (int i=0; i< data.getDentalPlans().size(); i++) {
            assertPlans(data.getDentalPlans().get(i), dentalRfpToPnns.get(i), dentalRfp.getOptions().get(i), 4 );
        }
        for (int i=0; i< data.getVisionPlans().size(); i++) {
            assertPlans(data.getVisionPlans().get(i), visionRfpToPnns.get(i), visionRfp.getOptions().get(i), 4 );
        }
    }

    @Test
    public void buildOptimizerMedical_VirginDental_VirginVision() throws Exception {
        
        List<RfpToPnn> rfpToPnns = new ArrayList<>();
        
        // reverse ordered by total enrollment
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 10", "ANTHEM", "PPO", 1.9d, 2.9d, 3.9d, 4.9d, 42d, 43d, 44d, 45d, 41d, 42d, 43d, 44d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 9", "ANTHEM",  "PPO", 1.8d, 2.8d, 3.8d, 4.8d, 38d, 39d, 40d, 41d, 37d, 38d, 39d, 40d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 8", "ANTHEM",  "HMO", 1.7d, 2.7d, 3.7d, 4.7d, 34d, 35d, 36d, 37d, 33d, 34d, 35d, 36d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 7", "ANTHEM",  "EPO", 1.6d, 2.6d, 3.6d, 4.6d, 30d, 31d, 32d, 33d, 29d, 30d, 31d, 32d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 6", "ANTHEM",  "PPO", 1.5d, 2.5d, 3.5d, 4.5d, 26d, 27d, 28d, 29d, 25d, 26d, 27d, 28d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 5", "ANTHEM",  "HMO", 1.4d, 2.4d, 3.4d, 4.4d, 22d, 23d, 24d, 25d, 21d, 22d, 23d, 24d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 4", "UHC",     "PPO", 1.3d, 2.3d, 3.3d, 4.3d, 18d, 19d, 20d, 21d, 17d, 18d, 19d, 20d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 3", "SIGNA",   "PPO", 1.2d, 2.2d, 3.2d, 4.2d, 14d, 15d, 16d, 17d, 13d, 14d, 15d, 16d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 2", "ANTHEM",  "PPO", 1.1d, 2.1d, 3.1d, 4.1d, 10d, 11d, 12d, 13d, 9d, 10d, 11d, 12d);
        createTestOption(medicalRfp, rfpToPnns, "Medical plan name 1", "SIGNA",   "EPO", 1.0d, 2.0d, 3.0d, 4.0d,  6d,  7d,  8d,  9d, 5d, 6d, 7d, 8d);
        
        ExtProduct visionProduct = podamFactory.manufacturePojo(ExtProduct.class);
        visionProduct.setName(Constants.VISION);
        ClientRfpProduct visionRfpProduct = new ClientRfpProduct(1L, visionProduct, true);

        ExtProduct dentalProduct = podamFactory.manufacturePojo(ExtProduct.class);
        dentalProduct.setName(Constants.DENTAL);
        ClientRfpProduct dentalRfpProduct = new ClientRfpProduct(1L, dentalProduct, true);

        List<ClientRfpProduct> rfpProducts = Arrays.asList(visionRfpProduct, dentalRfpProduct);
        when(clientRfpProductRepository.findByClientId(Mockito.anyLong())).thenReturn(rfpProducts);

        createTestOption(visionRfp, rfpToPnns, "", "ANTHEM", "VISION", 2.0d, 3.0d, 4.0d, 5.0d, 6d, 7d, 8d, 9d, 10d, 11d, 12d, 13d);
        
        // contributions and carrier are taken from plan with highest enrollment
        createTestOption(dentalRfp, rfpToPnns, "", "UHC", "DPPO", 2.2d, 2.3d, 2.4d, 2.5d, 9d, 10d, 11d, 12d, 3d, 4d, 5d, 6d);
        createTestOption(dentalRfp, rfpToPnns, "", "UHC", "DPPO", 2.1d, 2.2d, 2.3d, 2.4d, 5d, 6d, 7d, 8d, 3d, 4d, 5d, 6d);
        createTestOption(dentalRfp, rfpToPnns, "", "UHC", "DHMO", 2.6d, 2.7d, 2.8d, 2.9d, 13d, 14d, 15d, 16d, 3d, 4d, 5d, 6d);

        List<RfpToPnn> medicalRfpToPnns = rfpToPnns.subList(0, 10);
        
        for (int i=0; i < rfpToPnns.size(); i++) {
            when(rfpToPnnRepository.findByRfpRfpIdAndOptionIdAndPlanType(Mockito.anyObject(), Mockito.eq((long)i), Mockito.anyObject())).thenReturn(rfpToPnns.get(i));
        }
        
        byte[] bytes = anthemOptimizerProcessor.build(ANTHEM_OPTIMIZER_TEMPLATE_XLSM, 0L, new ArrayList<>());
        
        // uncomment for manual testing
        //java.io.File xlsm = new java.io.File("test-Optimizer_template_virgin.xlsm ");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(xlsm, bytes);

        OptimizerDto dto = new OptimizerDto();
        dto.getProducts().add(new OptimizerProduct(MEDICAL, false));
        dto.getProducts().add(new OptimizerProduct(DENTAL, false));
        dto.getProducts().add(new OptimizerProduct(VISION, false));

        AnthemOptimizerParserData data = new AnthemOptimizerParser().parseAll(new ByteArrayInputStream(bytes), true, dto);

        Assert.assertEquals(data.getBrokerEmail(), "ct1@@domain.test");
        Assert.assertNull(data.getAgentName());
        Assert.assertNull(data.getAgentEmail());

        Assert.assertEquals(data.getBrokerName(), "testBroker");
        Assert.assertEquals(data.getClientName(), "Test clientName");
        Assert.assertEquals(data.getSicCode(), "0456");
        Assert.assertEquals(data.getEligibleEmployees().longValue(), 1020L);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), dateFormatter.format(client.getEffectiveDate()));
        Assert.assertEquals(data.getMedicalPlans().size(), 10);
        Assert.assertEquals(data.getDentalPlans().size(), 0);
        Assert.assertEquals(data.getVisionPlans().size(), 0);
        
        Assert.assertEquals(data.getMedicalTierRates(), 4);
        Assert.assertEquals(data.getDentalEeContribution(), 3F, DELTA);
        Assert.assertEquals(data.getDentalDepContribution(), 6F, DELTA);
        Assert.assertEquals(data.getDentalCommission(), "$6 PEPM");
        
        Assert.assertEquals(data.getVisionEeContribution(), 10F, DELTA);
        Assert.assertEquals(data.getVisionDepContribution(), 13F, DELTA);
        Assert.assertEquals(data.getVisionCommission(), "7.0%");

        Assert.assertEquals(data.getSalesPerson(), "salesFirstName salesLastName");
        Assert.assertEquals(data.getPreSalesPerson(), "presalesFirstName presalesLastName");
        
        for (int i=0; i< data.getMedicalPlans().size(); i++) {
            assertPlans(data.getMedicalPlans().get(i), medicalRfpToPnns.get(i), medicalRfp.getOptions().get(i), 4 );
        }
    }

    @Test
    @Ignore // broken
    public void buildOptimizerOnlyMedical() throws Exception {
        
        List<ClientPlan> clientPlans = new ArrayList<>();
        
        // reverse ordered by total enrollment
        clientPlans.add(createTestClientPlan("Medical plan name 10", "ANTHEM", "PPO", 1.9f, 2.9f, 3.9f, 4.9f, 42l, 43l, 44l, 45l, 41f, 42f, 43f, 44f));
        clientPlans.add(createTestClientPlan("Medical plan name 9", "ANTHEM",  "PPO", 1.8f, 2.8f, 3.8f, 4.8f, 38l, 39l, 40l, 41l, 37f, 38f, 39f, 40f));
        clientPlans.add(createTestClientPlan("Medical plan name 8", "ANTHEM",  "HMO", 1.7f, 2.7f, 3.7f, 4.7f, 34l, 35l, 36l, 37l, 33f, 34f, 35f, 36f));
        clientPlans.add(createTestClientPlan("Medical plan name 7", "ANTHEM",  "EPO", 1.6f, 2.6f, 3.6f, 4.6f, 30l, 31l, 32l, 33l, 29f, 30f, 31f, 32f));
        clientPlans.add(createTestClientPlan("Medical plan name 6", "ANTHEM",  "PPO", 1.5f, 2.5f, 3.5f, 4.5f, 26l, 27l, 28l, 29l, 25f, 26f, 27f, 28f));
        clientPlans.add(createTestClientPlan("Medical plan name 5", "ANTHEM",  "HMO", 1.4f, 2.4f, 3.4f, 4.4f, 22l, 23l, 24l, 25l, 21f, 22f, 23f, 24f));
        clientPlans.add(createTestClientPlan("Medical plan name 4", "UHC",     "PPO", 1.3f, 2.3f, 3.3f, 4.3f, 18l, 19l, 20l, 21l, 17f, 18f, 19f, 20f));
        clientPlans.add(createTestClientPlan("Medical plan name 3", "SIGNA",   "PPO", 1.2f, 2.2f, 3.2f, 4.2f, 14l, 15l, 16l, 17l, 13f, 14f, 15f, 16f));
        clientPlans.add(createTestClientPlan("Medical plan name 2", "ANTHEM",  "PPO", 1.1f, 2.1f, 3.1f, 4.1f, 10l, 11l, 12l, 13l, 9f, 10f, 11f, 12f));
        clientPlans.add(createTestClientPlan("Medical plan name 1", "SIGNA",   "EPO", 1.0f, 2.0f, 3.0f, 4.0f,  6l,  7l,  8l,  9l, 5f, 6f, 7f, 8f));

        when(clientPlanRepository.findByClientClientId(anyLong())).thenReturn(clientPlans);

        byte[] bytes = anthemOptimizerProcessor.build(ANTHEM_OPTIMIZER_TEMPLATE_XLSM, 0L, new ArrayList<>());
        
        AnthemOptimizerParserData data = new AnthemOptimizerParser().parseAll(new ByteArrayInputStream(bytes), true, null);

        Assert.assertEquals(data.getBrokerName(), "testBroker");
        Assert.assertEquals(data.getClientName(), "Test clientName");
        Assert.assertEquals(data.getSicCode(), "456");
        Assert.assertEquals(data.getEligibleEmployees().longValue(), 5L);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), dateFormatter.format(client.getEffectiveDate()));
        Assert.assertEquals(data.getMedicalPlans().size(), 10);
        Assert.assertEquals(data.getMedicalTierRates(), 4);
        Assert.assertFalse(data.isHasDental());
        Assert.assertFalse(data.isHasVision());
             
        for (int i=0; i < clientPlans.size(); i++) {
            assertPlans(data.getMedicalPlans().get(i), clientPlans.get(i), 4 );
        }
    }

    @Test
    @Ignore // broken
    public void buildOptimizerMedicalAndDental() throws Exception {
        
        List<ClientPlan> medicalClientPlans = new ArrayList<>();
          
        // reverse ordered by total enrollment
        medicalClientPlans.add(createTestClientPlan("Medical plan name 10", "ANTHEM", "PPO", 1.9f, 2.9f, 3.9f, 4.9f, 42l, 43l, 44l, 45l, 41f, 42f, 43f, 44f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 9", "ANTHEM",  "PPO", 1.8f, 2.8f, 3.8f, 4.8f, 38l, 39l, 40l, 41l, 37f, 38f, 39f, 40f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 8", "ANTHEM",  "HMO", 1.7f, 2.7f, 3.7f, 4.7f, 34l, 35l, 36l, 37l, 33f, 34f, 35f, 36f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 7", "ANTHEM",  "EPO", 1.6f, 2.6f, 3.6f, 4.6f, 30l, 31l, 32l, 33l, 29f, 30f, 31f, 32f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 6", "ANTHEM",  "PPO", 1.5f, 2.5f, 3.5f, 4.5f, 26l, 27l, 28l, 29l, 25f, 26f, 27f, 28f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 5", "ANTHEM",  "HMO", 1.4f, 2.4f, 3.4f, 4.4f, 22l, 23l, 24l, 25l, 21f, 22f, 23f, 24f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 4", "UHC",     "PPO", 1.3f, 2.3f, 3.3f, 4.3f, 18l, 19l, 20l, 21l, 17f, 18f, 19f, 20f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 3", "SIGNA",   "PPO", 1.2f, 2.2f, 3.2f, 4.2f, 14l, 15l, 16l, 17l, 13f, 14f, 15f, 16f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 2", "ANTHEM",  "PPO", 1.1f, 2.1f, 3.1f, 4.1f, 10l, 11l, 12l, 13l, 9f, 10f, 11f, 12f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 1", "SIGNA",   "EPO", 1.0f, 2.0f, 3.0f, 4.0f,  6l,  7l,  8l,  9l, 5f, 6f, 7f, 8f));

        List<ClientPlan> dentalClientPlans = new ArrayList<>();
        // contributions and carrier are taken from plan with highest enrollment
        dentalClientPlans.add(createTestClientPlan("", "SIGNA", "DPPO", 2.2f, 2.3f, 2.4f, 2.5f, 9l, 10l, 11l, 12l, 3f, 4f, 5f, 6f));
        dentalClientPlans.add(createTestClientPlan("", "SIGNA", "DPPO", 2.1f, 2.2f, 2.3f, 2.4f, 5l, 6l, 7l, 8l, 3f, 4f, 5f, 6f));
        dentalClientPlans.add(createTestClientPlan("", "SIGNA", "DHMO", 2.6f, 2.7f, 2.8f, 2.9f, 13l, 14l, 15l, 16l, 3f, 4f, 5f, 6f));
        
        when(clientPlanRepository.findByClientClientId(anyLong())).thenReturn(ListUtils.union(medicalClientPlans, dentalClientPlans));

        byte[] bytes = anthemOptimizerProcessor.build(ANTHEM_OPTIMIZER_TEMPLATE_XLSM, 0L, new ArrayList<>());
        
        AnthemOptimizerParserData data = new AnthemOptimizerParser().parseAll(new ByteArrayInputStream(bytes), true, null);

        Assert.assertEquals(data.getBrokerName(), "testBroker");
        Assert.assertEquals(data.getClientName(), "Test clientName");
        Assert.assertEquals(data.getSicCode(), "456");
        Assert.assertEquals(data.getEligibleEmployees().longValue(), 5L);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), dateFormatter.format(client.getEffectiveDate()));
        Assert.assertEquals(data.getMedicalPlans().size(), 10);
        Assert.assertEquals(data.getDentalPlans().size(), 3);
        Assert.assertEquals(data.getMedicalTierRates(), 4);
        Assert.assertEquals(data.getDentalTierRates(), 4);
        Assert.assertFalse(data.isHasVision());
        Assert.assertEquals(data.getDentalEeContribution(), 3F, DELTA);
        Assert.assertEquals(data.getDentalDepContribution(), 6F, DELTA);
               
        for (int i=0; i< medicalClientPlans.size(); i++) {
            assertPlans(data.getMedicalPlans().get(i), medicalClientPlans.get(i), 4 );
        }
        for (int i=0; i< dentalClientPlans.size(); i++) {
            assertPlans(data.getDentalPlans().get(i), dentalClientPlans.get(i), 4 );
        }

    }

    
    @Test
    @Ignore // broken
    public void buildOptimizerMedicalAndVision() throws Exception {
        
        List<ClientPlan> medicalClientPlans = new ArrayList<>();
        
        // reverse ordered by total enrollment
        medicalClientPlans.add(createTestClientPlan("Medical plan name 10", "ANTHEM", "PPO", 1.9f, 2.9f, 3.9f, 4.9f, 42l, 43l, 44l, 45l, 41f, 42f, 43f, 44f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 9", "ANTHEM",  "PPO", 1.8f, 2.8f, 3.8f, 4.8f, 38l, 39l, 40l, 41l, 37f, 38f, 39f, 40f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 8", "ANTHEM",  "HMO", 1.7f, 2.7f, 3.7f, 4.7f, 34l, 35l, 36l, 37l, 33f, 34f, 35f, 36f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 7", "ANTHEM",  "EPO", 1.6f, 2.6f, 3.6f, 4.6f, 30l, 31l, 32l, 33l, 29f, 30f, 31f, 32f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 6", "ANTHEM",  "PPO", 1.5f, 2.5f, 3.5f, 4.5f, 26l, 27l, 28l, 29l, 25f, 26f, 27f, 28f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 5", "ANTHEM",  "HMO", 1.4f, 2.4f, 3.4f, 4.4f, 22l, 23l, 24l, 25l, 21f, 22f, 23f, 24f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 4", "UHC",     "PPO", 1.3f, 2.3f, 3.3f, 4.3f, 18l, 19l, 20l, 21l, 17f, 18f, 19f, 20f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 3", "SIGNA",   "PPO", 1.2f, 2.2f, 3.2f, 4.2f, 14l, 15l, 16l, 17l, 13f, 14f, 15f, 16f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 2", "ANTHEM",  "PPO", 1.1f, 2.1f, 3.1f, 4.1f, 10l, 11l, 12l, 13l, 9f, 10f, 11f, 12f));
        medicalClientPlans.add(createTestClientPlan("Medical plan name 1", "SIGNA",   "EPO", 1.0f, 2.0f, 3.0f, 4.0f,  6l,  7l,  8l,  9l, 5f, 6f, 7f, 8f));

        ClientPlan visionClientPlan = createTestClientPlan("", "UHC", "VISION", 2.0f, 3.0f, 4.0f, 5.0f, 6l, 7l, 8l, 9l, 10f, 11f, 12f, 13f);
        
        List<ClientPlan> allClientPlans = new ArrayList<>(medicalClientPlans);
        allClientPlans.add(visionClientPlan);
        
        when(clientPlanRepository.findByClientClientId(anyLong())).thenReturn(allClientPlans);
        
        byte[] bytes = anthemOptimizerProcessor.build(ANTHEM_OPTIMIZER_TEMPLATE_XLSM, 0L, new ArrayList<>());
        
        AnthemOptimizerParserData data = new AnthemOptimizerParser().parseAll(new ByteArrayInputStream(bytes), true, null);

        Assert.assertEquals(data.getBrokerName(), "testBroker");
        Assert.assertEquals(data.getClientName(), "Test clientName");
        Assert.assertEquals(data.getSicCode(), "456");
        Assert.assertEquals(data.getEligibleEmployees().longValue(), 5L);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), dateFormatter.format(client.getEffectiveDate()));
        Assert.assertEquals(data.getMedicalPlans().size(), 10);
        Assert.assertEquals(data.getVisionPlans().size(), 1);
        Assert.assertEquals(data.getMedicalTierRates(), 4);
        Assert.assertFalse(data.isHasDental());
        Assert.assertEquals(data.getVisionTierRates(), 4);
               
        for (int i=0; i< medicalClientPlans.size(); i++) {
            assertPlans(data.getMedicalPlans().get(i), medicalClientPlans.get(i), 4 );
        }
        assertPlans(data.getVisionPlans().get(0), visionClientPlan, 4 );
    }

    @Test
    @Ignore // broken
    public void buildOptimizerTier3() throws Exception {
        
        List<RFP> rfps = new ArrayList<>();
        rfps.add(createRfp("MEDICAL",3,"%","5"));
        rfps.add(createRfp("DENTAL",3,"%","6"));
        rfps.add(createRfp("VISION",3,"%","7"));

        when(rfpRepository.findByClientClientIdAndRfpIdIn(anyLong(), anyList())).thenReturn(rfps);
        
        ClientPlan medicalPlan = createTestClientPlan("Medical plan name 1", "UHC",     "PPO", 1.0f, 2.0f, 3.0f, 0.0f,  6l,  7l,  8l,  0l, 5f, 6f, 7f, 0f);
        ClientPlan visionPlan = createTestClientPlan("", "ANTHEM", "VISION", 2.0f, 3.0f, 4.0f, 0.0f, 6l, 7l, 8l, 0l, 10f, 11f, 12f, 0f);
        // contributions of all dental plans should be equal
        // because in optimizer file there is only one value for all
        ClientPlan dentalPlan = createTestClientPlan("", "UHC", "DPPO", 2.1f, 2.2f, 2.3f, 0.0f, 5l, 6l, 7l, 0l, 3f, 4f, 5f, 0f); 
        
        List<ClientPlan> clientPlans = new ArrayList<>();
        
        clientPlans.add(medicalPlan);
        clientPlans.add(visionPlan);
        clientPlans.add(dentalPlan);

        when(clientPlanRepository.findByClientClientId(anyLong())).thenReturn(clientPlans);

        
        byte[] bytes = anthemOptimizerProcessor.build(ANTHEM_OPTIMIZER_TEMPLATE_XLSM, 0L, new ArrayList<>());
        
        AnthemOptimizerParserData data = new AnthemOptimizerParser().parseAll(new ByteArrayInputStream(bytes), true, null);

        Assert.assertEquals(data.getBrokerName(), "testBroker");
        Assert.assertEquals(data.getClientName(), "Test clientName");
        Assert.assertEquals(data.getSicCode(), "456");
        Assert.assertEquals(data.getEligibleEmployees().longValue(), 5L);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), dateFormatter.format(client.getEffectiveDate()));
        Assert.assertEquals(data.getMedicalPlans().size(), 1);
        Assert.assertEquals(data.getDentalPlans().size(), 1);
        Assert.assertEquals(data.getVisionPlans().size(), 1);
        Assert.assertEquals(data.getMedicalTierRates(), 3);
        Assert.assertEquals(data.getDentalTierRates(), 3);
        Assert.assertEquals(data.getVisionTierRates(), 3);
        Assert.assertEquals(data.getDentalEeContribution(), 3F, DELTA);
        Assert.assertEquals(data.getDentalDepContribution(), 5F, DELTA);
               
        assertPlans(data.getMedicalPlans().get(0), medicalPlan, 3 );
        assertPlans(data.getVisionPlans().get(0), visionPlan, 3 );
        assertPlans(data.getDentalPlans().get(0), dentalPlan, 3 );

    }

    @Test
    @Ignore // broken
    public void buildOptimizerTier2() throws Exception {
        
        List<RFP> rfps = new ArrayList<>();
        rfps.add(createRfp("MEDICAL",2,"%","5"));
        rfps.add(createRfp("DENTAL",2,"%","6"));
        rfps.add(createRfp("VISION",2,"%","7"));

        when(rfpRepository.findByClientClientIdAndRfpIdIn(anyLong(), anyList())).thenReturn(rfps);
        
        ClientPlan medicalPlan = createTestClientPlan("Medical plan name 1", "UHC",     "PPO", 1.0f, 2.0f, 0.0f, 0.0f,  6l,  7l,  0l,  0l, 5f, 6f, 0f, 0f);
        ClientPlan visionPlan = createTestClientPlan("", "ANTHEM", "VISION", 2.0f, 3.0f, 0.0f, 0.0f, 6l, 7l, 0l, 0l, 10f, 11f, 0f, 0f);
        ClientPlan dentalPlan = createTestClientPlan("", "UHC", "DPPO", 2.1f, 2.2f, 0.0f, 0.0f, 5l, 6l, 0l, 0l, 3f, 4f, 0f, 0f);
        
        List<ClientPlan> clientPlans = new ArrayList<>();
        
        clientPlans.add(medicalPlan);
        clientPlans.add(visionPlan);
        clientPlans.add(dentalPlan);
        
        when(clientPlanRepository.findByClientClientId(anyLong())).thenReturn(clientPlans);
        
        byte[] bytes = anthemOptimizerProcessor.build(ANTHEM_OPTIMIZER_TEMPLATE_XLSM, 0L, new ArrayList<>());
        
        //java.io.File xlsm = new java.io.File("test-Optimizer_template-tier2.xlsm ");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(xlsm, bytes);
        
        AnthemOptimizerParserData data = new AnthemOptimizerParser().parseAll(new ByteArrayInputStream(bytes), true, null);

        Assert.assertEquals(data.getBrokerName(), "testBroker");
        Assert.assertEquals(data.getClientName(), "Test clientName");
        Assert.assertEquals(data.getSicCode(), "456");
        Assert.assertEquals(data.getEligibleEmployees().longValue(), 5L);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), dateFormatter.format(client.getEffectiveDate()));
        Assert.assertEquals(data.getMedicalPlans().size(), 1);
        Assert.assertEquals(data.getDentalPlans().size(), 1);
        Assert.assertEquals(data.getVisionPlans().size(), 1);
        Assert.assertEquals(data.getMedicalTierRates(), 2);
        Assert.assertEquals(data.getDentalTierRates(), 2);
        Assert.assertEquals(data.getVisionTierRates(), 2);
        Assert.assertEquals(data.getDentalEeContribution(), 3F, DELTA);
        Assert.assertEquals(data.getDentalDepContribution(), 4F, DELTA);
               
        assertPlans(data.getMedicalPlans().get(0), medicalPlan, 2 );
        assertPlans(data.getVisionPlans().get(0), visionPlan, 2 );
        assertPlans(data.getDentalPlans().get(0), dentalPlan, 2 );
    }
    

    @Test
    public void buildOptimizerWithGeneralAgent() throws Exception {
        
        List<ClientPlan> clientPlans = new ArrayList<>();
        
        clientPlans.add(createTestClientPlan("Medical plan name 1", "SIGNA",   "EPO", 1.0f, 2.0f, 3.0f, 4.0f,  6l,  7l,  8l,  9l, 5f, 6f, 7f, 8f));

        when(clientPlanRepository.findByClientClientId(anyLong())).thenReturn(clientPlans);
        
        when(brokerRepository.findOne(anyLong())).thenReturn(agent);

        byte[] bytes = anthemOptimizerProcessor.build(ANTHEM_OPTIMIZER_TEMPLATE_XLSM, 0L, new ArrayList<>());

        OptimizerDto dto = new OptimizerDto();
        dto.getProducts().add(new OptimizerProduct(MEDICAL, false));
        dto.getProducts().add(new OptimizerProduct(DENTAL, false));
        dto.getProducts().add(new OptimizerProduct(VISION, false));
        AnthemOptimizerParserData data = new AnthemOptimizerParser().parseAll(new ByteArrayInputStream(bytes), true, dto);

        Assert.assertEquals(data.getAgentName(), "LISI");
        Assert.assertEquals(data.getAgentEmail(), "ct2@@domain.test");
        Assert.assertEquals(data.getBrokerName(), "testBroker");
        Assert.assertNull(data.getBrokerEmail());
        Assert.assertEquals(data.getClientName(), "Test clientName");
        Assert.assertEquals(data.getSicCode(), "0456");
//        Assert.assertEquals(data.getEligibleEmployees().longValue(), 0L);
        Assert.assertEquals(dateFormatter.format(data.getEffectiveDate()), dateFormatter.format(client.getEffectiveDate()));
//        Assert.assertEquals(data.getMedicalPlans().size(), 1);
        Assert.assertEquals(data.getMedicalTierRates(), 4);
        Assert.assertFalse(data.isHasDental());
        Assert.assertFalse(data.isHasVision());
             
//        for (int i=0; i < clientPlans.size(); i++) {
//            assertPlans(data.getMedicalPlans().get(i), clientPlans.get(i), 4 );
//        }
        
    }

    private void assertPlans(AnthemOptimizerPlanDetails actualPlan, RfpToPnn expectedPlan, Option option, int tierRates) {

        Assert.assertEquals(actualPlan.getPlanType(), derivePlanType(expectedPlan.getPnn()));

        String expectedPlanName = expectedPlan.getPnn().getPlan().getName();
        if (! expectedPlanName.isEmpty()) {
            Assert.assertEquals(actualPlan.getPlanName(), expectedPlanName, "PlanName");
        }
        Assert.assertEquals(actualPlan.getCarrierName(), expectedPlan.getPnn().getPlan().getCarrier().getDisplayName(), actualPlan.getPlanName() + " Carrier");
        
        Assert.assertEquals(actualPlan.getTier1Census().doubleValue(), option.getCensusTier1(), actualPlan.getPlanName() + " Tier1Census");
        Assert.assertEquals(actualPlan.getTier2Census().doubleValue(), option.getCensusTier2(), actualPlan.getPlanName() + " Tier2Census");
        Assert.assertEquals(actualPlan.getTier3Census().doubleValue(), option.getCensusTier3(), actualPlan.getPlanName() + " Tier3Census");
        Assert.assertEquals(actualPlan.getTier4Census().doubleValue(), option.getCensusTier4(), actualPlan.getPlanName() + " Tier4Census");

        Assert.assertEquals(actualPlan.getTier1Rate().doubleValue(), option.getRateTier1(), DELTA, actualPlan.getPlanName() + " Tier1Rate");
        Assert.assertEquals(actualPlan.getTier2Rate().doubleValue(), option.getRateTier2(), DELTA, actualPlan.getPlanName() + " Tier2Rate");
        Assert.assertEquals(actualPlan.getTier3Rate().doubleValue(), option.getRateTier3(), DELTA, actualPlan.getPlanName() + " Tier3Rate");
        Assert.assertEquals(actualPlan.getTier4Rate().doubleValue(), option.getRateTier4(), DELTA, actualPlan.getPlanName() + " Tier4Rate");
        
        Assert.assertEquals(actualPlan.getTier1ErContribution(), option.getContributionTier1(), DELTA, actualPlan.getPlanName() + " Tier1ErContribution");

        // because contributions in optimizer file of tier2, tier3, tier4 are the same
        double expectedContribution = 0;
        if (tierRates == 2) {
            expectedContribution = option.getContributionTier2();
            Assert.assertEquals(actualPlan.getTier2ErContribution(), expectedContribution, DELTA, actualPlan.getPlanName() + " Tier2ErContribution");
        } else if (tierRates == 3) {
            expectedContribution = option.getContributionTier3();
            Assert.assertEquals(actualPlan.getTier2ErContribution(), expectedContribution, DELTA, actualPlan.getPlanName() + " Tier2ErContribution");
            Assert.assertEquals(actualPlan.getTier3ErContribution(), expectedContribution, DELTA, actualPlan.getPlanName() + " Tier3ErContribution");

        } else if (tierRates == 4) {
            expectedContribution = option.getContributionTier4();
            Assert.assertEquals(actualPlan.getTier2ErContribution(), expectedContribution, DELTA, actualPlan.getPlanName() + " Tier2ErContribution");
            Assert.assertEquals(actualPlan.getTier3ErContribution(), expectedContribution, DELTA, actualPlan.getPlanName() + " Tier3ErContribution");
            Assert.assertEquals(actualPlan.getTier4ErContribution(), expectedContribution, DELTA, actualPlan.getPlanName() + " Tier4ErContribution");
        }

    }

    private void assertPlans(AnthemOptimizerPlanDetails actualPlan, ClientPlan expectedPlan, int tierRates) {

        Assert.assertEquals(actualPlan.getPlanType(), derivePlanType(expectedPlan.getPnn()));

        String expectedPlanName = expectedPlan.getPnn().getPlan().getName();
        if (! expectedPlanName.isEmpty()) {
            Assert.assertEquals(actualPlan.getPlanName(), expectedPlanName, "PlanName");
        }
        Assert.assertEquals(actualPlan.getCarrierName(), expectedPlan.getPnn().getPlan().getCarrier().getDisplayName(), actualPlan.getPlanName() + " Carrier");
        
        Assert.assertEquals(actualPlan.getTier1Census(), expectedPlan.getTier1Census(), actualPlan.getPlanName() + " Tier1Census");
        Assert.assertEquals(actualPlan.getTier2Census(), expectedPlan.getTier2Census(), actualPlan.getPlanName() + " Tier2Census");
        Assert.assertEquals(actualPlan.getTier3Census(), expectedPlan.getTier3Census(), actualPlan.getPlanName() + " Tier3Census");
        Assert.assertEquals(actualPlan.getTier4Census(), expectedPlan.getTier4Census(), actualPlan.getPlanName() + " Tier4Census");

        Assert.assertEquals(actualPlan.getTier1Rate(), expectedPlan.getTier1Rate(), DELTA, actualPlan.getPlanName() + " Tier1Rate");
        Assert.assertEquals(actualPlan.getTier2Rate(), expectedPlan.getTier2Rate(), DELTA, actualPlan.getPlanName() + " Tier2Rate");
        Assert.assertEquals(actualPlan.getTier3Rate(), expectedPlan.getTier3Rate(), DELTA, actualPlan.getPlanName() + " Tier3Rate");
        Assert.assertEquals(actualPlan.getTier4Rate(), expectedPlan.getTier4Rate(), DELTA, actualPlan.getPlanName() + " Tier4Rate");
        
        Assert.assertEquals(actualPlan.getTier1ErContribution(), expectedPlan.getTier1ErContribution(), DELTA, actualPlan.getPlanName() + " Tier1ErContribution");

        // because contributions in optimizer file of tier2, tier3, tier4 are the same
        float expectedContribution = 0;
        if (tierRates == 2) {
            expectedContribution = expectedPlan.getTier2ErContribution();
            Assert.assertEquals(actualPlan.getTier2ErContribution(), expectedContribution, DELTA, actualPlan.getPlanName() + " Tier2ErContribution");
        } else if (tierRates == 3) {
            expectedContribution = expectedPlan.getTier3ErContribution();
            Assert.assertEquals(actualPlan.getTier2ErContribution(), expectedContribution, DELTA, actualPlan.getPlanName() + " Tier2ErContribution");
            Assert.assertEquals(actualPlan.getTier3ErContribution(), expectedContribution, DELTA, actualPlan.getPlanName() + " Tier3ErContribution");

        } else if (tierRates == 4) {
            expectedContribution = expectedPlan.getTier4ErContribution();
            Assert.assertEquals(actualPlan.getTier2ErContribution(), expectedContribution, DELTA, actualPlan.getPlanName() + " Tier2ErContribution");
            Assert.assertEquals(actualPlan.getTier3ErContribution(), expectedContribution, DELTA, actualPlan.getPlanName() + " Tier3ErContribution");
            Assert.assertEquals(actualPlan.getTier4ErContribution(), expectedContribution, DELTA, actualPlan.getPlanName() + " Tier4ErContribution");
        }

    }

    private RFP createRfp(String product, Integer ratingTiers, String paymentMethod, String commission) {
        RFP rfp = new RFP();
        rfp.setProduct(product);
        rfp.setRatingTiers(ratingTiers);
        rfp.setPaymentMethod(paymentMethod);
        rfp.setCommission(commission);
        return rfp;
    }
    
    private CarrierHistory createCarrierHistory(String name, int years, boolean current) {
        CarrierHistory carrierHistory = new CarrierHistory();
        carrierHistory.setName(name);
        carrierHistory.setYears(years);
        carrierHistory.setCurrent(current);
        return carrierHistory;
    }

    public void createTestOption(RFP rfp, List<RfpToPnn> rfpToPnns, String name, String carrierName, String type, Double rate1, Double rate2, Double rate3, Double rate4, Double census1, Double census2, Double census3, Double census4, Double contr1, Double contr2, Double contr3, Double contr4) throws Exception {
        Carrier carrier = new Carrier();
        carrier.setName(carrierName);
        carrier.setDisplayName(carrierName);
        Network network = new Network();
        network.setCarrier(carrier);
        network.setName("Test network");
        network.setType(type);
        
        Plan plan = new Plan(carrier, name, type);
        PlanNameByNetwork pnn = new PlanNameByNetwork(plan, network, name + " on " + network.getName(), type);

        Option option = new Option();
        option.setId((long)rfpToPnns.size());
        option.setPlanType(type);
        option.setCensusTier1(census1);
        option.setCensusTier2(census2);
        option.setCensusTier3(census3);
        option.setCensusTier4(census4);
        option.setRateTier1(rate1);
        option.setRateTier2(rate2);
        option.setRateTier3(rate3);
        option.setRateTier4(rate4);
        option.setContributionTier1(contr1);
        option.setContributionTier2(contr2);
        option.setContributionTier3(contr3);
        option.setContributionTier4(contr4);
        
        rfp.getOptions().add(option);
       
        RfpToPnn rfpToPnn = new RfpToPnn();
        rfpToPnn.setOptionId(option.getId());
        rfpToPnn.setPlanType(option.getPlanType());
        rfpToPnn.setPnn(pnn);
        rfpToPnn.setRfp(rfp);
        rfpToPnns.add(rfpToPnn);
        
    }

    
    public ClientPlan createTestClientPlan(String name, String carrierName, String type, Float rate1, Float rate2, Float rate3, Float rate4, Long census1, Long census2, Long census3, Long census4, Float contr1, Float contr2, Float contr3, Float contr4) throws Exception {
        Carrier carrier = new Carrier();
        carrier.setName(carrierName);
        carrier.setDisplayName(carrierName);
        Network network = new Network();
        network.setCarrier(carrier);
        network.setName("Test network");
        network.setType(type);
        
        Plan plan = new Plan(carrier, name, type);
        PlanNameByNetwork pnn = new PlanNameByNetwork(plan, network, name + " on " + network.getName(), type);

        Option option = new Option();
        option.setId(0l);
        
        ClientPlan clientPlan = new ClientPlan(null, option, false, pnn, census1, census2, census3, census4, rate1, rate2, rate3, rate4, 1F, 2F, 3F, 4F, "PERCENT", contr1, contr2, contr3, contr4);
        clientPlan.setPlanType(type);
        return clientPlan;
    }
    
    private String derivePlanType(PlanNameByNetwork pnn) {
        
        String networkName = pnn.getNetwork().getName();
        String planType = pnn.getPlanType();
        
        switch(planType) {
        case "HMO":
            if (networkName.toUpperCase().contains("PRIORITY")) {
                return "PSHMO";
            } else if (networkName.toUpperCase().contains("SELECT")) {
                return "SHMO";
            } else if (networkName.toUpperCase().contains("VIVITY")) {
                return "VIVITY";
            } else {
                return "THMO";
            }
        case "PPO":
            if (networkName.toUpperCase().contains("SOLUTION")) {
                return "SOL";
            } else {
                return "PPO";
            }
        case "HSA":
            return "CDHP";
        case "VISION":
            return "VISION";
        case "DPPO":
            return "DPPO";
        case "DHMO":
            return "DHMO";
        }
        
        return "THMO";
    }

    public List<Benefit> createTestBenefit(String sysName, String inValue, String outValue) {
        
        List<Benefit> result = new ArrayList<>(2);
        BenefitName bn = new BenefitName();
        bn.setName(sysName);

        Benefit in = new Benefit();
        in.setBenefitName(bn);
        in.setInOutNetwork("IN");
        in.setValue(inValue);
        result.add(in);
        if (outValue != null) {
            Benefit out = new Benefit();
            out.setBenefitName(bn);
            out.setInOutNetwork("OUT");
            out.setValue(outValue);
            result.add(out);
        } 
        return result;
    }

}
