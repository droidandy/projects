package com.benrevo.be.modules.shared.test;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.CarrierDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.enums.*;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.DateHelper;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.ancillary.*;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.*;
import com.benrevo.data.persistence.repository.ancillary.AncillaryClassRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryRateRepository;
import com.benrevo.data.persistence.repository.ancillary.ProgramToAncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpToAncillaryPlanRepository;
import io.github.benas.randombeans.EnhancedRandomBuilder;
import io.github.benas.randombeans.FieldDefinition;
import io.github.benas.randombeans.FieldDefinitionBuilder;
import io.github.benas.randombeans.api.EnhancedRandom;
import static io.github.benas.randombeans.api.EnhancedRandom.random;
import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import javax.mail.Message.RecipientType;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.text.SimpleDateFormat;
import java.time.Year;
import java.util.*;

import static com.benrevo.common.util.StreamUtils.mapToList;

@Primary
@Component
public class TestEntityHelper {

    @Autowired
    private AdministrativeFeeRepository administrativeFeeRepository;

    @Autowired
    private RiderRepository riderRepository;

    @Autowired
    private RiderMetaRepository riderMetaRepository;

    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private BrokerConfigRepository brokerConfigRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientTeamRepository clientTeamRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private VariantRepository variantRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private ClientFileRepository fileRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpToPnnRepository rfpToPnnRepository;

    @Autowired
    private RfpQuoteSummaryRepository rfpQuoteSummaryRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteVersionRepository rfpQuoteVersionRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private AccountRequestRepository accountRequestRepository;

    @Autowired
    private TimelineRepository timelineRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private CarrierHistoryRepository historyRepository;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private AttributeRepository attributeRepository;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private BenefitNameRepository benefitNameRepository;
    
    @Autowired
    private ClientExtProductRepository clientExtProductRepository; 
    
    @Autowired
    private ExtProductRepository extProductRepository; 
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private RewardRepository rewardRepository;
    
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;
    
    @Autowired
    private RecipientRepository recipientRepository;

    @Autowired
    private ClientRfpProductRepository clientRfpProductRepository;
    
    @Autowired
    private MarketingListRepository marketingListRepository;
    
    @Autowired
    private ProgramRepository programRepository;
    
    @Autowired
    private ProgramToPnnRepository programToPnnRepository;
    
    @Autowired
    private BrokerProgramAccessRepository brokerProgramAccessRepository;
    
    @Autowired
    private PlanRateRepository planRateRepository;
    
    @Autowired
    private AncillaryClassRepository ancillaryClassRepository;
    
    @Autowired
    private AncillaryPlanRepository ancillaryPlanRepository;
    
    @Autowired
    private AncillaryRateRepository ancillaryRateRepository;
    
    @Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;
    
    @Autowired
    private RfpQuoteAncillaryPlanRepository rfpQuoteAncillaryPlanRepository;
    
    @Autowired
    private RfpToAncillaryPlanRepository rfpToAncillaryPlanRepository;
    
    @Autowired
    private PresentationOptionRepository presentationOptionRepository;
    
    @Autowired
    private BrokerPersonRelationRepository brokerPersonRelationRepository;
    
    @Autowired
    private ProgramToAncillaryPlanRepository programToAncillaryPlanRepository;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Value("${app.carrier}")
    protected String[] appCarrier;

    public void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }

    private SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");

    public Activity createTestActivity(Client client, String carrierName, String product, 
        ActivityType type, String option, String value, Long... clientTeamIds) {
        Activity activity = new Activity(client.getClientId(), type, value, "notes");
        if(carrierName != null) {
            Carrier car = carrierRepository.findByName(carrierName);
            if(car == null) {
                throw new IllegalArgumentException("Carrier not found: " + carrierName);
            }
            activity.setCarrierId(car.getCarrierId());
        }    
        activity.setProduct(product);
        activity.setOption(option);
        activity = activityRepository.save(activity);
        
        for(Long id : clientTeamIds) {
            rewardRepository.save(new Reward(activity.getActivityId(), id));
        }
        return activity;
    }
    
    public MarketingList createTestMarketingList(Client client, String carrierName, String product, 
        MarketingStatus status) {
        MarketingList item = new MarketingList();
        item.setRfpCarrier(createTestRfpCarrier(carrierName, product));
        item.setClient(client);
        item.setStatus(status);
        return marketingListRepository.save(item);
        
    }
    private Carrier buildTestCarrier() {
        return buildTestCarrier("testCarrierName" + DateHelper.getFormatedTimestampForDB(), "testDisplayCarrierName");
    }

    private Carrier buildTestCarrier(String name, String displayName) {
        Carrier carrier = new Carrier();
        carrier.setName(name);
        carrier.setDisplayName(displayName);
        carrier.setAmBestRating("A+");
        return carrier;
    }

    public List<CarrierDto> createTestCarriers() {
        List<CarrierDto> result = new ArrayList<>();
        result.add(ObjectMapperUtils.map(carrierRepository.save(buildTestCarrier()), CarrierDto.class));
        result.add(ObjectMapperUtils.map(carrierRepository.save(buildTestCarrier()), CarrierDto.class));
        return  result;
    }

    public Carrier createTestCarrier() {
        return carrierRepository.save(buildTestCarrier());
    }

    public Carrier createTestCarrier(String name, String displayName) {
        Carrier carrier = carrierRepository.findByName(name);
        if(carrier != null) {
            return carrier;
        }
        return carrierRepository.save(buildTestCarrier(name, displayName));
    }

    public BrokerConfig createTestBrokerConfig(Broker broker, BrokerConfigType type, String data) {

        BrokerConfig brokerConfig = new BrokerConfig();
        brokerConfig.setBroker(broker);
        brokerConfig.setType(type);
        brokerConfig.setData(data);
        brokerConfig.setModifyBy("Test user");
        brokerConfig.setModifyDate(new Date());
        return brokerConfigRepository.save(brokerConfig);

    }

    public Recipient createTestRecipient(String email, EmailType emailType, RecipientType recipientType, String carrier) {
        Recipient recipient = new Recipient();
        recipient.setActive(true);
        recipient.setCarrierId(carrierRepository.findByName(carrier).getCarrierId());
        recipient.setEmail(email);
        recipient.setEmailType(emailType);
        recipient.setRecipientType(recipientType.toString());
        return recipientRepository.save(recipient);
    }
    
    public Broker buildTestBroker(String brokerName, BrokerLocale locale) {
        Broker broker = new Broker();
        broker.setBrokerToken(UUID.randomUUID().toString().toLowerCase());
        broker.setName(brokerName);
        broker.setLocale(locale);
        broker.setAddress("address");
        broker.setState("state");
        broker.setCity("city");
        broker.setZip("zip");
        return broker;
    }

    public Broker createTestBroker(String name, BrokerLocale locale) {
        return brokerRepository.save(buildTestBroker(name, locale));
    }

    public Broker createTestGABroker(String name) {
        Broker b = buildTestBroker(name, null);
        b.setGeneralAgent(true);
        return brokerRepository.save(b);
    }

    public Broker buildTestBroker() {
        return buildTestBroker("testBrokerName");
    }

    public Broker buildTestBroker(String brokerName) {
        return buildTestBroker(brokerName, null);
    }

    public Broker createTestBroker() {
        return createTestBroker("testBrokerName");
    }

    public Broker createTestBroker(String name) {
        Broker broker = buildTestBroker(name);
        broker = brokerRepository.save(broker);
        
        Person testSales = createTestPerson(PersonType.SALES, 
            "salesFirstName", "salesLastName", "testSales@benrevo.com", appCarrier[0]);
        broker.addSalePerson(testSales);
        
        Person testPresales = createTestPerson(PersonType.PRESALES, 
            "presalesFirstName", "presalesLastName", "testPresales@benrevo.com", appCarrier[0]);
        broker.addPresalePerson(testPresales);
        
        return broker;
    }
    
    public BrokerPersonRelation createTestBrokerPersonRelation(Broker broker, Person person) {
        BrokerPersonRelation bpr = new BrokerPersonRelation(broker, person);
        bpr = brokerPersonRelationRepository.save(bpr);
        return bpr;
    }

    public Client buildTestClient() {
        return buildTestClient("testClientName", createTestBroker());
    }

    public Client buildTestClient(String clientName, Broker broker) {
        Client client = new Client();
        client.setClientName(clientName);
        client.setBroker(broker);
        client.setParticipatingEmployees(140l);
        client.setEmployeeCount(1L);
        client.setClientState(ClientState.RFP_STARTED);
        client.setState("testState");
        client.setCobraCount(1);

        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.YEAR, 2);
        client.setEffectiveDate(c.getTime());

        client.setAverageAge(32f);
        client.setPredominantCounty("Alameda");
        client.setSicCode("213");
        client.setEligibleEmployees(150L);
        return client;
    }

    public List<RFP> createTestRFPs(Client client){
        List<RFP> rfps = new ArrayList<>();
        RFP rfp1 = buildTestRFP(client);
        rfp1.setProduct(Constants.MEDICAL);

        RFP rfp2 = buildTestRFP(client);
        rfp2.setProduct(Constants.VISION);

        RFP rfp3 = buildTestRFP(client);
        rfp3.setProduct(Constants.DENTAL);

        rfps.add(rfp1);
        rfps.add(rfp2);
        rfps.add(rfp3);
        rfpRepository.save(rfps);
        return rfps;
    }

    public RFP buildTestRFP(Client client) {
        return buildTestRFP(client, Constants.MEDICAL);
    }
    
    public PlanNameByNetwork createTestPlanNameByNetwork(String name, String carrierName, String type) {
        return createTestPlanNameByNetwork(name, carrierName, type, "Test plan network");
    }
    
    public PlanNameByNetwork createTestPlanNameByNetwork(String name, String carrierName, String type, String networkName) {
        Carrier carrier = carrierRepository.findByName(carrierName);
        Network network = createTestNetwork(carrier, type, networkName);
        Plan plan = new Plan(carrier, name, type);
        plan = planRepository.save(plan);
        PlanNameByNetwork pnn = new PlanNameByNetwork(plan, network, name + " on " + network.getName(), type);
        return planNameByNetworkRepository.save(pnn);
    }

    @Deprecated // plan with pnn = null not correct for many cases
    public ClientPlan createTestClientPlan(Client client, String planType) {
        return createTestClientPlan(client, planType, (PlanNameByNetwork) null);
    }

    public ClientPlan createTestClientPlan(Client client, String planName, CarrierType carrierType, String planType,
        Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate,
        Long tier1Census, Long tier2Census, Long tier3Census, Long tier4Census,
        Float tier1Renewal, Float tier2Renewal, Float tier3Renewal, Float tier4Renewal) {

        PlanNameByNetwork pnn = createTestPlanNameByNetwork(planName, carrierType == null ? CarrierType.AETNA.name() : carrierType.name(), planType);
        return createTestClientPlan(client, planType, pnn, tier1Rate, tier2Rate, tier3Rate, tier4Rate,
            tier1Census, tier2Census, tier3Census, tier4Census, tier1Renewal, tier2Renewal, tier3Renewal, tier4Renewal);
    }

    public ClientPlan createTestClientPlan(Client client, String planType, PlanNameByNetwork pnn,
        Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate,
        Long tier1Census, Long tier2Census, Long tier3Census, Long tier4Census,
        Float tier1Renewal, Float tier2Renewal, Float tier3Renewal, Float tier4Renewal) {

        ClientPlan clientPlan = new ClientPlan();
        clientPlan.setClient(client);
        clientPlan.setPnn(pnn);
        clientPlan.setRxPnn(null);
        clientPlan.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        clientPlan.setTier1Census(tier1Census);
        clientPlan.setTier1ErContribution(1f);
        clientPlan.setTier1Renewal(tier1Renewal);
        clientPlan.setTier1Rate(tier1Rate);
        clientPlan.setTier2Census(tier2Census);
        clientPlan.setTier2ErContribution(2f);
        clientPlan.setTier2Renewal(tier2Renewal);
        clientPlan.setTier2Rate(tier2Rate);
        clientPlan.setTier3Census(tier3Census);
        clientPlan.setTier3ErContribution(3f);
        clientPlan.setTier3Renewal(tier3Renewal);
        clientPlan.setTier3Rate(tier3Rate);
        clientPlan.setTier4Census(tier4Census);
        clientPlan.setTier4ErContribution(4f);
        clientPlan.setTier4Renewal(tier4Renewal);
        clientPlan.setTier4Rate(tier4Rate);
        clientPlan.setPlanType(planType);
        return clientPlanRepository.save(clientPlan);

    }

    public ClientPlan createTestClientPlan(Client client, String planType, PlanNameByNetwork pnn) {
        ClientPlan clientPlan = new ClientPlan();
        clientPlan.setClient(client);
        clientPlan.setPnn(pnn);
        clientPlan.setRxPnn(null);
        clientPlan.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        clientPlan.setTier1Census(1L);
        clientPlan.setTier1ErContribution(1f);
        clientPlan.setTier1Rate(1f);
        clientPlan.setTier2Census(2L);
        clientPlan.setTier2ErContribution(2f);
        clientPlan.setTier2Rate(2f);
        clientPlan.setTier3Census(3L);
        clientPlan.setTier3ErContribution(3f);
        clientPlan.setTier3Rate(3f);
        clientPlan.setTier4Census(4L);
        clientPlan.setTier4ErContribution(4f);
        clientPlan.setTier4Rate(4f);
        clientPlan.setPlanType(planType);
        return clientPlanRepository.save(clientPlan);
    }

    public ClientPlan createTestClientPlan(String name, Client client, String carrierName, String type) {
        return createTestClientPlan(name, client, carrierName, type, "Client plan network");
    }
    
    public ClientPlan createTestAncillaryClientPlan(Client client, AncillaryPlan ancPlan, PlanCategory category) {
        ClientPlan clientPlan = new ClientPlan();
        clientPlan.setClient(client);
        String planType = category.name();
        if(!category.getPlanTypes().contains(planType)) {
            throw new BaseException("Unable to create client plan with type: " + planType);
        }
        clientPlan.setPlanType(planType);
        clientPlan.setAncillaryPlan(ancPlan);
        
        PlanNameByNetwork pnn = createTestPlanNameByNetwork(
            ancPlan.getPlanName(), ancPlan.getCarrier().getName(), planType);
        // fix name, createTestPlanNameByNetwork returns different pnn.name (see implementation)
        pnn.setName(ancPlan.getPlanName());
        pnn = planNameByNetworkRepository.save(pnn);
        clientPlan.setPnn(pnn);
        
        return clientPlanRepository.save(clientPlan);
    }
    
    public ClientPlan createTestClientPlan(String name, Client client, String carrierName, String type, String networkName) {
        Carrier carrier = carrierRepository.findByName(carrierName);
        Network ntw = createTestNetwork(carrier, type, networkName);
        Plan plan = new Plan(carrier, name, type);
        plan = planRepository.save(plan);
        PlanNameByNetwork pnn = new PlanNameByNetwork(plan, ntw, name + " on " + ntw.getName(), type);
        pnn.setClientId(client.getClientId());
        pnn = planNameByNetworkRepository.save(pnn);

        ClientPlan clientPlan = new ClientPlan(client, createTestOption(), false, pnn, 10L, 10L, 20L, 20L, 320F, 700F, 600F, 1000F, 360F, 770F, 660F, 1100F, "PERCENT", 90F, 90F, 90F, 90F);
        return clientPlanRepository.save(clientPlan);
    }

    public Option createTestOption(){
        RFP rfp = createTestRFP();
        Option option = new Option();
        option.setRfp(rfp);
        return optionRepository.save(option);
    }

    public ClientPlan createTestClientPlan(Client client, String planName, String planType) {
        PlanNameByNetwork pnn = createTestPlanNameByNetwork(planName, CarrierType.AETNA.name(), planType);
        return createTestClientPlan(client, planType, pnn);
    }

    public ClientAttribute createTestClientAttribute(Client client, AttributeName attrName) {
        return createTestClientAttribute(client, attrName, null);
    }

    public ClientAttribute createTestClientAttribute(Client client, AttributeName attrName, String value) {
        ClientAttribute attribute = new ClientAttribute();
        attribute.setClient(client);
        attribute.setName(attrName);
        attribute.setValue(value);
        return attributeRepository.save(attribute);
    }

    public QuotePlanAttribute createTestQuotePlanAttribute(RfpQuoteNetworkPlan rfpQuoteNetworkPlan,
        QuotePlanAttributeName attrName, String value) {

        QuotePlanAttribute attribute = new QuotePlanAttribute();
        attribute.setPlan(rfpQuoteNetworkPlan);
        attribute.setName(attrName);
        attribute.setValue(value);
        return attributeRepository.save(attribute);
    }

    public RFPAttribute createTestRfpAttribute(RFP rfp, RFPAttributeName attrName, String value) {
        RFPAttribute attr = attributeRepository.save(new RFPAttribute(rfp, attrName, value));
        rfp.getAttributes().add(attr);
        return attr;
    }
    
    public Benefit createTestBenefit(String sysName, Plan plan, String inValue, String outValue) {
        BenefitName bn = benefitNameRepository.findByName(sysName);

        Benefit b = new Benefit();
        b.setBenefitName(bn);
        b.setInOutNetwork("IN");
        b.setPlan(plan);
        b.setValue(inValue);
        b = benefitRepository.save(b);
        if (outValue != null) {
            Benefit out = new Benefit();
            out.setBenefitName(bn);
            out.setInOutNetwork("OUT");
            out.setPlan(plan);
            out.setValue(outValue);
            benefitRepository.save(out);
        }
        return b;
    }

    public QuoteOptionAltPlanDto.Benefit createTestBenefit(String sysName, String name,
        String value, String valueIn, String valueOut){

        if(value != null){
            return new QuoteOptionAltPlanDto.Benefit(sysName, name, value, "");
        }else {
            return new QuoteOptionAltPlanDto.Benefit(
                sysName, name, valueIn, valueOut, "", ""
            );
        }
    }

    public Benefit[] createTestBenefits(Plan plan, String... sysNames) {
        Benefit[] result = new Benefit[sysNames.length];
        boolean isInOut = plan.getPlanType().equals("PPO") || plan.getPlanType().equals("HSA");
        for (int i = 0; i < sysNames.length; i++) {
            String sysName = sysNames[i];
            result[i] = createTestBenefit(sysName, plan, isInOut);
        }
        return result;
    }

    public Benefit createTestBenefit(String sysName, Plan plan, boolean isInOut) {
        return createTestBenefit(sysName, plan, "1", isInOut ? "2" : null);
    }

    public PlanNameByNetwork createTestRxPlanNameByNetwork(String name, Network network, Long clientId) {

        PlanNameByNetwork pnn = createTestRxPlanNameByNetwork(name, network);
        pnn.setClientId(clientId);
        return planNameByNetworkRepository.save(pnn);
    }

    public PlanNameByNetwork createTestRxPlanNameByNetwork(String name, Network network) {

        Plan testPlan = new Plan(network.getCarrier(), null, "RX_" + network.getType());
        testPlan = planRepository.save(testPlan);

        PlanNameByNetwork pnn = new PlanNameByNetwork(testPlan, network, name + " on " + network.getName(), testPlan.getPlanType());

        return planNameByNetworkRepository.save(pnn);
    }

    public RfpQuoteNetworkPlan createTestRfpQuoteNetworkRxPlan(String name, RfpQuoteNetwork rfpQuoteNetwork,
                                                               Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate) {

        Plan testPlan = new Plan(rfpQuoteNetwork.getNetwork().getCarrier(), name, "RX_" + rfpQuoteNetwork.getNetwork().getType());
        testPlan = planRepository.save(testPlan);

        PlanNameByNetwork pnn = new PlanNameByNetwork(testPlan, rfpQuoteNetwork.getNetwork(), name + " on " + rfpQuoteNetwork.getNetwork().getName(), testPlan.getPlanType());
        pnn = planNameByNetworkRepository.save(pnn);

        RfpQuoteNetworkPlan rqnp = new RfpQuoteNetworkPlan(rfpQuoteNetwork, pnn, tier1Rate, tier2Rate, tier3Rate, tier4Rate);

        return rfpQuoteNetworkPlanRepository.save(rqnp);
    }

    /**
     * @deprecated use {@link #createTestNetwork(Carrier, String, String)}
     */
    @Deprecated 
    public Network createTestNetwork(String name, String type, Carrier carrier) {
        return createTestNetwork(carrier, type, name);
    }

    public AdministrativeFee createTestAdministrativeFee(Carrier carrier, String name, Float value) {
        AdministrativeFee fee = new AdministrativeFee();
        fee.setCarrier(carrier);
        fee.setName(name);
        fee.setValue(value);
        fee = administrativeFeeRepository.save(fee);
        return fee;
    }

    public Rider createTestRider(RiderMeta riderMeta, Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate) {
        Rider rider = new Rider();
        rider.setRiderMeta(riderMeta);
        rider.setTier1Rate(tier1Rate);
        rider.setTier2Rate(tier2Rate);
        rider.setTier3Rate(tier3Rate);
        rider.setTier4Rate(tier4Rate);
        rider = riderRepository.save(rider);
        return rider;
    }
    
    public Rider createTestRider(String code, Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate) {
        RiderMeta riderMeta = createTestRiderMeta(code, null, null, true);
        return createTestRider(riderMeta, tier1Rate, tier2Rate, tier3Rate, tier4Rate);
    }
    
    public RiderMeta createTestRiderMeta(String code, String category, String planType, boolean selectable) {
        return createTestRiderMeta(code, category, planType, selectable, null, null, null, null);
    }
    
    public RiderMeta createTestRiderMeta(String code, String category, String planType, boolean selectable,
            String type, String typeValue, String type2, String typeValue2) {
        List<RiderMeta> metas = riderMetaRepository.findByCode(Arrays.asList(code));
        RiderMeta riderMeta = null;
        if(metas.isEmpty()) {
            RiderMeta newMeta = new RiderMeta();
            newMeta.setCode(code);
            newMeta.setCategory(category);
            newMeta.setPlanType(planType);
            newMeta.setType(type);
            newMeta.setTypeValue(typeValue);
            newMeta.setType2(type2);
            newMeta.setTypeValue2(typeValue2);
            newMeta.setSelectable(selectable);
            riderMeta = riderMetaRepository.save(newMeta);
        } else {
            riderMeta = metas.get(0);
        }
        return riderMeta;
    }
    
    public RfpToAncillaryPlan createTestRfpToAncillaryPlan(RFP rfp, AncillaryPlan ancillaryPlan) {
        RfpToAncillaryPlan rap = new RfpToAncillaryPlan();
        rap.setAncillaryPlan(ancillaryPlan);
        rap.setRfp(rfp);
        return rfpToAncillaryPlanRepository.save(rap);
    }
    
    public RfpQuoteAncillaryPlan buildTestRfpQuoteAncillaryPlan(String name, PlanCategory category, 
        AncillaryPlanType type, RfpQuote rfpQuote) {
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();
        AncillaryPlan ancPlan = createTestAncillaryPlan(name, category, type, carrier);
        
        RfpQuoteAncillaryPlan quotePlan = new RfpQuoteAncillaryPlan();
        quotePlan.setAncillaryPlan(ancPlan);
        quotePlan.setMatchPlan(false);
        quotePlan.setRfpQuote(rfpQuote);
        
        return quotePlan;  
    }
    
    public RfpQuoteAncillaryPlan createTestRfpQuoteAncillaryPlan(String name, PlanCategory category, 
        AncillaryPlanType type, RfpQuote rfpQuote) {
        RfpQuoteAncillaryPlan plan = buildTestRfpQuoteAncillaryPlan(name, category, type, rfpQuote);
        return rfpQuoteAncillaryPlanRepository.save(plan);  
    }

    public AncillaryPlan createTestAncillaryPlan(String name, PlanCategory category, AncillaryPlanType type, Carrier carrier) {
        return ancillaryPlanRepository.save(buildTestAncillaryPlan(name, category, type, carrier));
    }

    public AncillaryPlan buildTestAncillaryPlan(String name, PlanCategory category, AncillaryPlanType type, Carrier carrier) {

        AncillaryPlan plan = new AncillaryPlan();
        plan.setPlanYear(Year.now().getValue());
        plan.setPlanType(type);
        plan.setPlanName(name);
        plan.setCarrier(carrier);

        if(type == AncillaryPlanType.VOLUNTARY && !category.name().startsWith("VOL_")) {
            throw new IllegalArgumentException("Cannot cteate Voluntary plan with BASIC product");
        }

        List<AncillaryClass> classes = new ArrayList<>();
        for(int i = 1; i < 3; i++) {
            AncillaryClass cl = null;
            if(category == PlanCategory.LIFE || category == PlanCategory.VOL_LIFE) {
                LifeClass lifeClass = new LifeClass();
                lifeClass.setEmployeeBenefitAmount("Flat $50000");
                lifeClass.setEmployeeMaxBenefit("$50000");
                lifeClass.setEmployeeGuaranteeIssue("$150000");
                lifeClass.setWaiverOfPremium("Included to age 65");
                lifeClass.setDeathBenefit("50% up to $250000");
                lifeClass.setAge65reduction("35%");
                lifeClass.setAge70reduction("50%");
                lifeClass.setAge75reduction("75%");
                lifeClass.setAge80reduction("80%");
                cl = lifeClass;
            } else if(category == PlanCategory.STD || category == PlanCategory.VOL_STD) {
                StdClass stdClass = new StdClass();
                stdClass.setWeeklyBenefit("60%");
                stdClass.setMaxWeeklyBenefit("$2500");
                stdClass.setMaxBenefitDuration("13 weeks");
                stdClass.setWaitingPeriodAccident("7 days");
                stdClass.setWaitingPeriodSickness("7 days");
                cl = stdClass;
            } else if(category == PlanCategory.LTD || category == PlanCategory.VOL_LTD) {
                LtdClass ltdClass = new LtdClass();
                ltdClass.setMonthlyBenefit("70");
                ltdClass.setMaxBenefit("15000");
                ltdClass.setMaxBenefitDuration("26");
                ltdClass.setEliminationPeriod("90");
                ltdClass.setOccupationDefinition("SSNRA");
                ltdClass.setConditionExclusion("None");
                ltdClass.setAbuseLimitation("None");
                ltdClass.setPremiumsPaid("Pre-tax");
                cl = ltdClass;
            }
            cl.setName("ClassName " + i);
            cl.setAncillaryPlan(plan);
            classes.add(cl);
        }
        plan.setClasses(classes);

        AncillaryRate rate = null;
        if(type == AncillaryPlanType.BASIC) {
            BasicRate br = new BasicRate();
            if(category == PlanCategory.LIFE) {
                br.setCurrentLife(0.05f);
                br.setCurrentADD(0.02f);
                br.setRenewalLife(0.06f);
                br.setRenewalADD(0.03f);
            } else { //STD/LTD
                br.setCurrentSL(0.10f);
                br.setRenewalSL(0.11f);
            }
            rate = br;
        } else if(type == AncillaryPlanType.VOLUNTARY) {
            VoluntaryRate vr = new VoluntaryRate();
            vr.setMonthlyCost(5000f);
            List<AncillaryRateAge> ages = new ArrayList<>();
			AncillaryRateAge rateAge = new AncillaryRateAge();
			rateAge.setAncillaryRate(vr);
			rateAge.setFrom(25);
			rateAge.setTo(29);
			rateAge.setCurrentEmp(0.05f);
			rateAge.setRenewalEmp(0.04f);
			ages.add(rateAge);
			rateAge = new AncillaryRateAge();
			rateAge.setAncillaryRate(vr);
			rateAge.setFrom(35);
			rateAge.setTo(39);
			rateAge.setCurrentEmp(0.07f);
			rateAge.setRenewalEmp(0.06f);
			ages.add(rateAge);		
            vr.setAges(ages);
            rate = vr;
        }
        rate.setAncillaryPlan(plan);
        rate.setVolume(85004.0);
        rate.setRateGuarantee("To 1/1/2020");
        plan.setRates(rate);
        return plan;
    }
    
    public Person createTestPerson(PersonType type, String fullName, String email, String carrierName) {
        String[] names = fullName.split(" ");
        String firstName = names[0];
        String lastName = names.length > 1 ? names[1] : null;
        return createTestPerson(type, firstName, lastName, email, carrierName);
    }
    
    public Person createTestPerson(PersonType type, String firstName, String lastName, String email, String carrierName) {
        Person person = new Person();
        Carrier carrier = carrierRepository.findByName(carrierName);
        person.setCarrierId(carrier.getCarrierId());
        person.setEmail(email);
        if(lastName == null) {
            lastName = "";
            person.setFullName(firstName);
        } else {
            person.setFullName(firstName + " " + lastName);
        }
        person.setFirstName(firstName);
        person.setLastName(lastName);
        person.setType(type);
        return personRepository.save(person);
    }

    public Client createTestClient() {
        return clientRepository.save(buildTestClient());
    }

    public Program createTestProgram(String name, RfpCarrier rfpCarrier) {
        Program program = programRepository.findByRfpCarrierAndName(rfpCarrier, name);

        if(program != null){
            return program;
        }

        program = new Program();
        program.setName(name);
        program.setDescription("description");
        program.setRfpCarrier(rfpCarrier);
        return programRepository.save(program);
    }

    public Program createTestProgram(String name, RfpCarrier rfpCarrier, Broker broker, PlanNameByNetwork... plans) {
        Program program = new Program();
        program.setName(name);
        program.setDescription("description");
        program.setRfpCarrier(rfpCarrier);
        program = programRepository.save(program);

        for(PlanNameByNetwork pnn : plans) {
            ProgramToPnn prog2Pnn = new ProgramToPnn();
            prog2Pnn.setPnn(pnn);
            prog2Pnn.setProgramId(program.getProgramId());
            prog2Pnn = programToPnnRepository.save(prog2Pnn);
        }
        brokerProgramAccessRepository.save(new BrokerProgramAccess(broker, program));
        return program;
    }
    
    public ProgramToAncillaryPlan createTestProgramToAncillaryPlan(Program program, AncillaryPlan plan) {     
		ProgramToAncillaryPlan p2ap = new ProgramToAncillaryPlan();
		p2ap.setProgramId(program.getProgramId());
		p2ap.setAncillaryPlan(plan);
		return programToAncillaryPlanRepository.save(p2ap);
    }
    
    public PlanRate createTestPlanRate(ProgramToPnn pr2Pnn, Float ratingBand,
            Integer ratingTiers, Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate,
            PlanRateType type, String typeValue, Object... typeValueNPairs) {
        PlanRate pr = new PlanRate();
        pr.setProgramToPnnId(pr2Pnn.getProgramToPnnId());
        pr.setRatingBand(ratingBand);
        pr.setRatingTiers(ratingTiers);
        pr.setTier1Rate(tier1Rate);
        pr.setTier2Rate(tier2Rate);
        pr.setTier3Rate(tier3Rate);
        pr.setTier4Rate(tier4Rate);
        pr.setType(type);
        pr.setTypeValue(typeValue);
        if(typeValueNPairs.length > 0) {
            pr.setType2((PlanRateType) typeValueNPairs[0]);
            pr.setTypeValue2((String) typeValueNPairs[1]);
        }
        if(typeValueNPairs.length > 2) {
            pr.setType3((PlanRateType) typeValueNPairs[2]);
            pr.setTypeValue3((String) typeValueNPairs[3]);
        }
        return planRateRepository.save(pr);
    }
    
    public Client createTestClient(String name, Broker broker) {
        return clientRepository.save(buildTestClient(name, broker));
    }

    public RfpQuote buildTestRfpQuote(RfpSubmission rfpSubmission, RfpQuoteVersion rfpQuoteVersion, QuoteType quoteType) {
        RfpQuote rfpQuote = new RfpQuote();
        rfpQuote.setRfpQuoteVersion(rfpQuoteVersion);
        rfpQuote.setRfpSubmission(rfpSubmission);
        rfpQuote.setQuoteType(quoteType);
        rfpQuote.setLatest(true);
        rfpQuote.setRatingTiers(4);
        rfpQuote.setUpdated(addDays(new Date(), new Integer(new Random().nextInt(4)+1)));
        return rfpQuote;
    }

    public Timeline buildTestTimeline(Client client, Carrier carrier, Long refNum) {
        Timeline timeline = new Timeline();
        timeline.setClientId(client.getClientId());
        timeline.setCarrierId(carrier.getCarrierId());
        timeline.setAssignee("testAssignee");
        timeline.setCompleted(false);
        timeline.setCreateTime(new Date());
        timeline.setMilestone("tewstMilestone");
        timeline.setRefNum(refNum);
        timeline.setProjectedTime(timeline.getCreateTime());
        return timeline;
    }

    public Timeline createTestTimeline(Client client, Carrier carrier, Long refNum) {
        return timelineRepository.save(buildTestTimeline(client, carrier, refNum));
    }

    public RfpQuoteNetwork createTestQuoteNetwork(RfpQuote rfpQuote, String name, String type) {
        Network network = createTestNetwork(name, type, rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier());
        return createTestQuoteNetwork(rfpQuote, network);
    }

    public RfpQuoteNetwork createTestQuoteNetwork(RfpQuote rfpQuote, String type) {
        return createTestQuoteNetwork(rfpQuote, "Test network", type);
    }

    public RfpQuoteNetwork createTestQuoteNetwork(RfpQuote rfpQuote, Network network, RfpQuoteNetworkCombination combination) {
        RfpQuoteNetwork rqn = new RfpQuoteNetwork(rfpQuote, network, network.getName());
        rqn.setaLaCarte(combination == null);
        rqn.setRfpQuoteNetworkCombination(combination);
        rfpQuote.getRfpQuoteNetworks().add(rqn);
        return rfpQuoteNetworkRepository.save(rqn);
    }

    public RfpQuoteNetwork createTestQuoteNetwork(RfpQuote rfpQuote, Network network) {
        return createTestQuoteNetwork(rfpQuote, network, null);
    }

    public RfpQuoteOption createTestRfpQuoteOption(RfpQuote rfpQuote, String name) {
        RfpQuoteOption rqo = new RfpQuoteOption(rfpQuote, name, name, false);
        rqo.setFinalSelection(true);
        return rfpQuoteOptionRepository.save(rqo);
    }
    
    public RfpQuoteAncillaryOption createTestRfpQuoteAncillaryOption(String name, RfpQuote rfpQuote) {
        RfpQuoteAncillaryOption option = new RfpQuoteAncillaryOption();
        option.setName(name);
        option.setDisplayName(name);
        option.setRfpQuote(rfpQuote);
        return rfpQuoteAncillaryOptionRepository.save(option);
    }
    
    public RfpQuoteAncillaryOption createTestRfpQuoteAncillaryOption(String name, RfpQuoteAncillaryPlan plan) {
        RfpQuoteAncillaryOption option = new RfpQuoteAncillaryOption();
        option.setName(name);
        option.setDisplayName(name);
        option.setRfpQuoteAncillaryPlan(plan);
        option.setRfpQuote(plan.getRfpQuote());
        return rfpQuoteAncillaryOptionRepository.save(option);
    }

    public RfpQuote createTestRfpQuote(Client client, String carrierName, String category) {
        return createTestRfpQuote(client, carrierName, category, QuoteType.STANDARD);
    }

    public RfpQuote createTestRfpQuote(Client client, String carrierName, String category, QuoteType quoteType) {
        RfpCarrier rfpCarrier = createTestRfpCarrier(carrierName, category);

        RfpSubmission rfpSubmission = createTestRfpSubmission(client, rfpCarrier);
       
        return createTestRfpQuote(client, rfpSubmission, carrierName, category, quoteType);
    }

    public RfpQuote createTestRfpQuote(Client client, RfpSubmission rfpSubmission, String carrierName, String category, QuoteType quoteType) {
        RfpQuoteVersion rfpQuoteVersion = new RfpQuoteVersion();
        rfpQuoteVersion.setRfpSubmissionId(rfpSubmission.getRfpSubmissionId());
        rfpQuoteVersion = rfpQuoteVersionRepository.save(rfpQuoteVersion);

        RfpQuote rfpQuote = new RfpQuote();
        rfpQuote.setLatest(true);
        rfpQuote.setRfpSubmission(rfpSubmission);
        rfpQuote.setRfpQuoteVersion(rfpQuoteVersion);
        rfpQuote.setQuoteType(quoteType);
        rfpQuote.setUpdated(new Date());
        rfpQuote.setRatingTiers(4);
        rfpQuote = rfpQuoteRepository.save(rfpQuote);

        return rfpQuote;
    }

    public RfpQuoteOptionNetwork createTestRfpQuoteOptionNetwork(RfpQuoteOption rfpQuoteOption,
                                                                 RfpQuoteNetwork rfpQuoteNetwork, RfpQuoteNetworkPlan selectedPlan, ClientPlan clientPlan, Long tier1Census,
                                                                 Long tier2Census, Long tier3Census, Long tier4Census, String erContributionFormat, Float t1ErContr,
                                                                 Float t2ErContr, Float t3ErContr, Float t4ErContr) {

        RfpQuoteOptionNetwork rqon = new RfpQuoteOptionNetwork(rfpQuoteOption, rfpQuoteNetwork, selectedPlan, clientPlan, tier1Census, tier2Census,
                                                               tier3Census, tier4Census, erContributionFormat, t1ErContr, t2ErContr, t3ErContr, t4ErContr);
        rqon.setTier1EeFund(12f);
        rqon.setTier2EeFund(13f);
        rqon.setTier3EeFund(14f);
        rqon.setTier4EeFund(15f);

        return rfpQuoteOptionNetworkRepository.save(rqon);
    }
    
    public RfpQuoteAncillaryPlan createTestRfpQuoteAncillaryPlan(RfpQuote rfpQuote, AncillaryPlan ancillaryPlan) {
        RfpQuoteAncillaryPlan plan = buildTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan);
        return rfpQuoteAncillaryPlanRepository.save(plan);
    }
    
    public RfpQuoteAncillaryPlan buildTestRfpQuoteAncillaryPlan(RfpQuote rfpQuote, AncillaryPlan ancillaryPlan) {
        RfpQuoteAncillaryPlan plan = new RfpQuoteAncillaryPlan();
        plan.setAncillaryPlan(ancillaryPlan);
        plan.setRfpQuote(rfpQuote);
        plan.setMatchPlan(false);
        return plan;
    }

    public RfpQuoteNetworkPlan createTestRfpQuoteNetworkPlan(String name, RfpQuoteNetwork rfpQuoteNetwork,
                                                             Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate) {

        Plan testPlan = new Plan(rfpQuoteNetwork.getNetwork().getCarrier(), name, rfpQuoteNetwork.getNetwork().getType());
        testPlan = planRepository.save(testPlan);

        PlanNameByNetwork pnn = new PlanNameByNetwork(testPlan, rfpQuoteNetwork.getNetwork(), name + " on " + rfpQuoteNetwork.getNetwork().getName(), testPlan.getPlanType());
        pnn = planNameByNetworkRepository.save(pnn);

        return createTestRfpQuoteNetworkPlan(pnn, rfpQuoteNetwork, tier1Rate, tier2Rate, tier3Rate, tier4Rate);
    }

    public RfpQuoteNetworkPlan createTestRfpQuoteNetworkPlan(PlanNameByNetwork pnn, RfpQuoteNetwork rfpQuoteNetwork,
                                                             Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate) {

        RfpQuoteNetworkPlan rqnp = new RfpQuoteNetworkPlan(rfpQuoteNetwork, pnn, tier1Rate, tier2Rate, tier3Rate, tier4Rate);

        return rfpQuoteNetworkPlanRepository.save(rqnp);
    }

    public RfpQuoteNetworkPlan createTestRfpQuoteNetworkPlan(String name, RfpQuoteNetwork rfpQuoteNetwork,
                                                             Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate, boolean match) {

        Plan testPlan = new Plan(rfpQuoteNetwork.getNetwork().getCarrier(), name, rfpQuoteNetwork.getNetwork().getType());
        testPlan = planRepository.save(testPlan);

        PlanNameByNetwork pnn = new PlanNameByNetwork(testPlan, rfpQuoteNetwork.getNetwork(), name + " on " + rfpQuoteNetwork.getNetwork().getName(), testPlan.getPlanType());
        pnn = planNameByNetworkRepository.save(pnn);

        RfpQuoteNetworkPlan rqnp = new RfpQuoteNetworkPlan(rfpQuoteNetwork, pnn, tier1Rate, tier2Rate, tier3Rate, tier4Rate);
        rqnp.setMatchPlan(match);

        rqnp = rfpQuoteNetworkPlanRepository.save(rqnp);
        rfpQuoteNetwork.getRfpQuoteNetworkPlans().add(rqnp);
        return rqnp;
    }

    public RfpQuoteNetworkPlan createTestRfpQuoteNetworkRxPlan(String name, RfpQuoteNetwork rfpQuoteNetwork,
                                                               Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate, boolean match) {

        Plan testPlan = new Plan(rfpQuoteNetwork.getNetwork().getCarrier(), name, "RX_" + rfpQuoteNetwork.getNetwork().getType());
        testPlan = planRepository.save(testPlan);

        PlanNameByNetwork pnn = new PlanNameByNetwork(testPlan, rfpQuoteNetwork.getNetwork(), name + " on " + rfpQuoteNetwork.getNetwork().getName(), testPlan.getPlanType());
        pnn = planNameByNetworkRepository.save(pnn);

        RfpQuoteNetworkPlan rqnp = new RfpQuoteNetworkPlan(rfpQuoteNetwork, pnn, tier1Rate, tier2Rate, tier3Rate, tier4Rate);
        rqnp.setMatchPlan(match);

        return rfpQuoteNetworkPlanRepository.save(rqnp);
    }

    public RfpQuoteSummary buildTestRfpQuoteSummary() {
        return buildTestRfpQuoteSummary(createTestClient());
    }

    public RfpQuoteSummary buildTestRfpQuoteSummary(Client client) {
        RfpQuoteSummary rfpQuoteSummary = new RfpQuoteSummary();
        rfpQuoteSummary.setDentalNotes("testDental");
        rfpQuoteSummary.setMedicalNotes("testMedical");
        rfpQuoteSummary.setMedicalWithKaiserNotes("testMedicalWithKaiser");
        rfpQuoteSummary.setVisionNotes("testVisionNotes");
        rfpQuoteSummary.setLifeNotes("testlifeNotes");
        rfpQuoteSummary.setClient(client);
        rfpQuoteSummary.setUpdated(addDays(new Date(), new Integer(new Random().nextInt(4)+1)));
        return rfpQuoteSummary;
    }

    public RfpQuoteSummary createTestRfpQuoteSummary(Client client) {
        return rfpQuoteSummaryRepository.save(buildTestRfpQuoteSummary(client));
    }

    public RfpQuoteSummary createTestRfpQuoteSummary() {
        return rfpQuoteSummaryRepository.save(buildTestRfpQuoteSummary());
    }

    private RfpCarrier buildTestRfpCarrier() {
        return buildTestRfpCarrier(createTestCarrier(), Constants.MEDICAL);
    }

    private RfpCarrier buildTestRfpCarrier(Carrier carrier, String category) {
        RfpCarrier rfpCarrier = new RfpCarrier();
        rfpCarrier.setCarrier(carrier);
        rfpCarrier.setEndpoint("testEndpoint");
        rfpCarrier.setCategory(category);
        return rfpCarrier;
    }

    public RfpCarrier createTestRfpCarrier() {
        return rfpCarrierRepository.save(buildTestRfpCarrier());
    }

    public RfpCarrier createTestRfpCarrier(Carrier carrier, String category) {
        return createTestRfpCarrier(carrier.getName(), category);
    }

    public RfpCarrier createTestRfpCarrier(String carrierName, String category) {
        RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(carrierName, category);
        if(rfpCarrier != null) {
            return rfpCarrier;
        }
        Carrier carrier = createTestCarrier(carrierName, carrierName);
        return rfpCarrierRepository.save(buildTestRfpCarrier(carrier, category));
    }

    public Client updateTestClientPlan(Client client, List<ClientPlan> clientPlans) {
        client.setClientPlans(clientPlans);
        return clientRepository.save(client);
    }

    public Plan createTestPlan(Carrier carrier) {
        return createTestPlan(carrier, "testName", "testPlanType");
    }

    public Plan createTestPlan(Carrier carrier, String name, String type) {
        Plan plan = new Plan();
        plan.setCarrier(carrier);
        plan.setCreated(new Date());
        plan.setUpdated(new Date());
        plan.setName(name);
        plan.setPlanType(type);
        return planRepository.save(plan);
    }

    public RfpQuoteNetwork createTestRfpQuoteNetwork(RfpQuote rfpQuote, String type) {
        Network network = createTestNetwork(rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier(), type);
        RfpQuoteNetwork rqn = new RfpQuoteNetwork();
        rqn.setRfpQuote(rfpQuote);
        rqn.setNetwork(network);
        rqn.setRfpQuoteVersion(rfpQuote.getRfpQuoteVersion());
        return rfpQuoteNetworkRepository.save(rqn);
    }

    public PlanNameByNetwork createTestPlanNameByNetwork(Plan plan, Network network) {
        PlanNameByNetwork planName = new PlanNameByNetwork();
        planName.setPlan(plan);
        planName.setCost(1l);
        planName.setCreated(new Date());
        planName.setNetwork(network);
        planName.setName("testPlanNameByNetwork " + network.getType());
        planName.setPlanType(network.getType());
        planName.setUpdated(new Date());
        return planNameByNetworkRepository.save(planName);
    }

    public Network createTestNetwork(Carrier carrier, String type, String name) {
        Network bsHmo = new Network();
        bsHmo.setName(name);
        bsHmo.setTier("tier");
        bsHmo.setType(type);
        bsHmo.setCarrier(carrier);
        Network network = networkRepository.findByNameAndTypeAndCarrier(bsHmo.getName(), bsHmo.getType(), carrier);
        return network != null ? network : networkRepository.save(bsHmo);
    }

    public ClientPlan createTestClientPlan(Client client, PlanNameByNetwork pnn) {
        ClientPlan clientPlan = new ClientPlan();
        clientPlan.setClient(client);
        clientPlan.setPnn(pnn);
        clientPlan.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        clientPlan.setTier1Census(1L);
        clientPlan.setTier1ErContribution(1f);
        clientPlan.setTier1Rate(1f);
        clientPlan.setTier2Census(2L);
        clientPlan.setTier2ErContribution(2f);
        clientPlan.setTier2Rate(2f);
        clientPlan.setTier3Census(3L);
        clientPlan.setTier3ErContribution(3f);
        clientPlan.setTier3Rate(3f);
        clientPlan.setTier4Census(4L);
        clientPlan.setTier4ErContribution(4f);
        clientPlan.setTier4Rate(4f);
        clientPlan.setPlanType(pnn.getPlanType());

        return clientPlanRepository.save(clientPlan);
    }

    public ClientFileUpload buildTestRfpFile(RFP rfp) {
        ClientFileUpload fileUpload = new ClientFileUpload();

        fileUpload.setRfpId(rfp.getRfpId());
        fileUpload.setSection("Test");
        fileUpload.setDeleted(false);
        fileUpload.setS3Key("test/43kh139ou2u0aqgipleespdjdo_12.png");
        fileUpload.setType("image/png");
        fileUpload.setCreated(dateFormatter.format(new Date()));

        return fileUpload;
    }

    public ClientFileUpload buildTestRfpFile(RFP rfp, String key) {
        ClientFileUpload fileUpload = new ClientFileUpload();

        fileUpload.setRfpId(rfp.getRfpId());
        fileUpload.setSection("Test");
        fileUpload.setDeleted(false);
        fileUpload.setS3Key(key);
        fileUpload.setType("image/png");
        fileUpload.setCreated(dateFormatter.format(new Date()));

        return fileUpload;
    }

    public ClientFileUpload createTestRFPFile(RFP rfp){
        return fileRepository.save(buildTestRfpFile(rfp));
    }

    public RFP createTestRFP() {
        return rfpRepository.save(buildTestRFP());
    }

    public RFP createTestRFP(Client client, String product) {
        return rfpRepository.save(buildTestRFP(client, product));
    }

    public RFP createTestRFP(Client client) {
        return createTestRFP(client, Constants.MEDICAL);
    }

    public RFP createTestRFPWithOptionsAndCarrierHistory(Client client, String product) {
        RFP rfp = rfpRepository.save(buildTestRFP(client, product));


        rfp.setOptions(createTestRfpOptions(rfp));
        rfp.setCarrierHistories(createTestRfpCarrierHistory(rfp));

        return rfpRepository.save(rfp);
    }

    public RFP createTestRFPWithOptionsAndCarrierHistory(Client client) {
        RFP rfp = rfpRepository.save(buildTestRFP(client));

        rfp.setOptions(createTestRfpOptions(rfp));
        rfp.setCarrierHistories(createTestRfpCarrierHistory(rfp));

        return rfpRepository.save(rfp);
    }

    public List<CarrierHistory> createTestRfpCarrierHistory(RFP rfp) {
        List<CarrierHistory> histories = new ArrayList<>();
        CarrierHistory history = historyRepository.save(buildTestRfpCarrierHistory(rfp));
        histories.add(history);
        return histories;
    }

    public CarrierHistory buildTestRfpCarrierHistory(RFP rfp) {
        CarrierHistory history = new CarrierHistory();

        history.setRfp(rfp);
        history.setName("Anthem");
        history.setCurrent(true);
        history.setYears(3);

        return history;
    }

    public Option buildTestRfpOption(RFP rfp) {
        Option option = new Option();

        option.setMatchCurrent(true);
        option.setQuoteAlt(true);
        option.setRfp(rfp);
        option.setAltRequest("Please send us alternate plans found in Network X that have Y attributes");
        option.setLabel("Label");
        option.setPlanType("Plan");
        option.setContributionTier1(1.1);
        option.setContributionTier2(1.2);
        option.setContributionTier3(1.3);
        option.setContributionTier4(1.4);
        option.setOutOfStateContribution(true);
        option.setOosContributionTier1(2.1);
        option.setOosContributionTier2(2.2);
        option.setOosContributionTier3(2.3);
        option.setOosContributionTier4(2.4);
        option.setRateTier1(3.1);
        option.setRateTier2(3.2);
        option.setRateTier3(3.3);
        option.setRateTier4(3.4);
        option.setOutOfStateRate(true);
        option.setOosRateTier1(4.1);
        option.setOosRateTier2(4.2);
        option.setOosRateTier3(4.3);
        option.setOosRateTier4(4.4);
        option.setRenewalTier1(5.1);
        option.setRenewalTier2(5.2);
        option.setRenewalTier3(5.3);
        option.setRenewalTier4(5.4);
        option.setOutOfStateRenewal(true);
        option.setOosRenewalTier1(6.1);
        option.setOosRenewalTier2(6.2);
        option.setOosRenewalTier3(6.3);
        option.setOosRenewalTier4(6.4);
        option.setCensusTier1(6.5);
        option.setCensusTier2(6.6);
        option.setCensusTier3(6.7);
        option.setCensusTier4(6.8);

        return option;
    }

    public List<Option> createTestRfpOptions(RFP rfp) {
        List<Option> options = new ArrayList<>();

        int i = 0;
        while (i < 3) {
            Option option = optionRepository.save(buildTestRfpOption(rfp));
            options.add(option);
            i++;
        }

        return options;
    }

    public RFP buildTestRFP() {
        return buildTestRFP(createTestClient(), Constants.MEDICAL);
    }

    public RFP buildTestRFP(Client client, String product) {
        RFP rfp = new RFP();
        rfp.setClient(client);
        rfp.setPaymentMethod("testPaymentMethod");
        rfp.setAlongside(true);
        rfp.setBuyUp(true);
        rfp.setComments("testComment");
        rfp.setOptionCount(4);
        rfp.setPaymentMethod("testPaymentMethod");
        rfp.setCommission("testCommission");
        rfp.setPriorCarrier(true);
        rfp.setProduct(product);
        rfp.setQuoteAlteTiers(3);
        rfp.setRatingTiers(3);
        rfp.setSelfFunding(true);
        rfp.setTakeOver(true);
        rfp.setOptions(Collections.emptyList());
        rfp.setLastUpdated(new Date());
        rfp.setContributionType("%");
        return rfp;
    }

    public Notification createNotification(Long clientId, String name, String channel){
        Notification notification = new Notification();
        notification.setName(name);
        notification.setClientId(clientId);
        notification.setChannel(channel);
        notification.setDate(addDays(new Date(), new Integer(new Random().nextInt(4)+1)));

        return notificationRepository.save(notification);
    }

    public Date addDays(Date date, int days) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, days); //minus number would decrement the days
        return cal.getTime();
    }

    public RfpQuote buildTestRfpQuote(RfpSubmission rfpSubmission, QuoteType quoteType) {
        return buildTestRfpQuote(rfpSubmission, createTestRfpQuoteVersion(rfpSubmission), quoteType);
    }


    public RfpQuoteVersion createTestRfpQuoteVersion(RfpSubmission rfpSubmission) {
        return rfpQuoteVersionRepository.save(buildTestRfpQuoteVersion(rfpSubmission));
    }

    public RfpQuote createTestRfpQuote() {
        return rfpQuoteRepository.save(buildTestRfpQuote(createTestRfpSubmission(), QuoteType.STANDARD));
    }

    public RfpQuote createTestRfpQuote(RfpSubmission rfpSubmission, QuoteType quoteType) {
        return createTestRfpQuote(rfpSubmission, createTestRfpQuoteVersion(rfpSubmission), quoteType);
    }

    public Network createTestNetwork(Carrier carrier, String type) {
        Network network = new Network();
        network.setCarrier(carrier);
        network.setCreated(new Date());
        network.setName("testName " + type);
        network.setTier("testTier");
        network.setType(type);
        network.setUpdated(new Date());
        return networkRepository.save(network);
    }

    public Question buildTestQuestion() {
        return buildTestQuestion("testCode", "testQuestion", false);
    }

    public Question buildTestQuestion(String code, String title, boolean multiselectable) {
        return buildTestQuestion(code, title, multiselectable, null);
    }

    public Question buildTestQuestion(String code, String title, boolean multiselectable, List<String> variants) {
        Question question = new Question();
        question.setCode(code);
        question.setTitle(title);
        question.setMultiselectable(multiselectable);
        if (variants != null) {
            List<Variant> variantList = mapToList(variants, item -> {
                Variant variant = new Variant();
                variant.setNumber(variants.indexOf(item) + 1);
                variant.setQuestion(question);
                variant.setOption(item);
                return variant;
            });

            question.setVariants(variantList);
        }

        return question;
    }

    public Question createTestQuestion() {
        return questionRepository.save(buildTestQuestion());
    }

    public Question createTestQuestion(String code, String title, boolean multiselectable) {
        return questionRepository.save(buildTestQuestion(title, code, multiselectable));
    }

    public Question createTestQuestion(String code, String title, boolean multiselectable, List<String> variants) {
        return questionRepository.save(buildTestQuestion(title, code, multiselectable, variants));
    }

    public Variant buildTestVariant(Integer number, String option, Question question) {
        Variant variant = new Variant();
        variant.setNumber(number);
        variant.setOption(option);
        variant.setQuestion(question);
        return variant;
    }

    public Variant createTestVariant(Integer number, String option, Question question) {
        return variantRepository.save(buildTestVariant(number, option, question));
    }

    public Answer buildTestAnswer() {
        return buildTestAnswer(createTestClient(), createTestQuestion(), "testValue");
    }

    public Answer buildTestAnswer(Client client, Question question, String value) {
        Answer answer = new Answer();
        answer.setClient(client);
        answer.setQuestion(question);
        answer.setValue(value);
        return answer;
    }

    public Answer createTestAnswer() {
        return answerRepository.save(buildTestAnswer());
    }

    public Answer createTestAnswer(Client client, Question question, String value) {
        return answerRepository.save(buildTestAnswer(client, question, value));
    }

    public AccountRequest createTestAccountRequest() {

        return accountRequestRepository.save(buildTestAccountRequest());
    }

    public AccountRequest buildTestAccountRequest() {
        AccountRequest req = new AccountRequest();
        req.setBrokerId(null);
        req.setBrokerName("accountRequestBrokerName");
        req.setBrokerPresaleName(Constants.BENREVO_DEVPRESALE_NAME);
        req.setBrokerSalesName(Constants.BENREVO_DEVSALE_NAME); 
        req.setBrokerAddress("brokerAddress");
        req.setBrokerCity("brokerCity");
        req.setBrokerEmail("brokerEmail");
        req.setBrokerState("brokerState");
        req.setBrokerZip("brokerZip");
        req.setGaId(null);
        req.setGaName("accountRequestGaName");
        req.setGaAddress("gaAddress");
        req.setGaCity("gaCity");
        req.setGaState("gaState");
        req.setGaZip("gaZip");
        req.setAgentName("agentName");
        req.setAgentEmail("agentEmail");
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        req.setCreated(cal.getTime());
        req.setBrokerRegion("brokerRegion");
        return req;
    }

    public RfpQuote createTestRfpQuote(RfpSubmission rfpSubmission, RfpQuoteVersion rfpQuoteVersion, QuoteType quoteType) {
        return rfpQuoteRepository.save(buildTestRfpQuote(rfpSubmission, quoteType));
    }

    public RfpSubmission createTestRfpSubmission() {
        return rfpSubmissionRepository.save(buildTestRfpSubmission());
    }

    public RfpSubmission createTestRfpSubmission(Client client) {
        return rfpSubmissionRepository.save(buildTestRfpSubmission(client));
    }

    public RfpSubmission createTestRfpSubmission(Client client, RfpCarrier rfpCarrier) {
        RfpSubmission rfpSubmission = rfpSubmissionRepository.findByRfpCarrierAndClient(rfpCarrier, client);
        if(rfpSubmission != null) {
            return rfpSubmission;
        }
        return rfpSubmissionRepository.save(buildTestRfpSubmission(client, rfpCarrier));
    }

    public RfpSubmission buildTestRfpSubmission() {
        return buildTestRfpSubmission(createTestClient(), createTestRfpCarrier());
    }

    public RfpSubmission buildTestRfpSubmission(Client c) {
        return buildTestRfpSubmission(c, createTestRfpCarrier());
    }

    public RfpSubmission buildTestRfpSubmission(Client client, RfpCarrier rfpCarrier) {
        RfpSubmission rfpSubmission = new RfpSubmission();
        rfpSubmission.setClient(client);
        rfpSubmission.setRfpCarrier(rfpCarrier);
        return rfpSubmission;
    }
    
    public RfpSubmission createTestRfpSubmission(Client client, Program program) {
        RfpSubmission rfpSubmission = new RfpSubmission();
        rfpSubmission.setClient(client);
        rfpSubmission.setProgram(program);
        rfpSubmission.setRfpCarrier(program.getRfpCarrier());
        return rfpSubmissionRepository.save(rfpSubmission);
    }

    public RfpQuoteVersion buildTestRfpQuoteVersion(RfpSubmission rfpSubmission) {
        RfpQuoteVersion rfpQuoteVersion = new RfpQuoteVersion();
        rfpQuoteVersion.setRfpSubmissionId(rfpSubmission.getRfpSubmissionId());
        return rfpQuoteVersion;
    }

    public ClientTeam buildClientTeam(Broker broker, Client client) {
        ClientTeam clientTeam = new ClientTeam();
        clientTeam.setAuthId("auth0|" + UUID.randomUUID().toString());
        clientTeam.setName("testName");
        clientTeam.setBroker(broker);
        clientTeam.setClient(client);
        clientTeam.setEmail("testClientTeam@domain.com");
        return clientTeam;
    }

    public ClientTeam createClientTeam(Broker broker, Client client) {
        return clientTeamRepository.save(buildClientTeam(broker, client));
    }

    public Document createTestDocument(Carrier carrier, String name) {
        Document doc = new Document();
        doc.setCarrier(carrier);
        doc.setFileName(name);
        doc.setFileExtension("txt");
        doc.setMimeType("text/plain");
        doc.setS3Key(UUID.randomUUID().toString() + "_" + name);
        doc.setLastUpdated(new Date());
        doc = documentRepository.save(doc);

        return doc;
    }

    public Form buildTestForm() {
        Question firstQuestion = createTestQuestion("testCode1", "testQuestion1", false);
        Question secondQuestion = createTestQuestion("testCode2", "testQuestion2", true);
        return buildTestForm("testForm", Arrays.asList(firstQuestion, secondQuestion));
    }

    public Form buildTestForm(String name, List<Question> questions) {
        Form form = new Form();
        form.setCarrier(createTestCarrier());
        form.setFormQuestions(new ArrayList<>());
        form.setName(name);

        questions.forEach(x -> {
            FormQuestion formQuestion = new FormQuestion();
            formQuestion.setRequired(true);
            formQuestion.setForm(form);
            formQuestion.setQuestion(x);
            form.getFormQuestions().add(formQuestion);
        });

        return form;
    }

    public Form createTestForm() {
        return formRepository.save(buildTestForm());
    }

    public Form createTestForm(String name, List<Question> questions) {
        return formRepository.save(buildTestForm(name, questions));
    }

    public Broker createTestGeneralAgent() {

        Broker generalAgent = buildTestBroker();
        generalAgent.setName("General Agent");
        generalAgent.setGeneralAgent(true);

        return brokerRepository.save(generalAgent);
    }

    public ClientTeam buildClientTeam() {
        return buildClientTeam(createTestBroker(), createTestClient(), "auth0|" + UUID.randomUUID().toString(), "testName");
    }

    public ClientTeam buildClientTeam(Broker broker, Client client, String authId, String name) {
        ClientTeam clientTeam = new ClientTeam();
        clientTeam.setAuthId(authId);
        clientTeam.setName(name);
        clientTeam.setEmail("test@domain.com");
        clientTeam.setBroker(broker);
        clientTeam.setClient(client);
        return clientTeam;
    }

    public ClientTeam createClientTeam() {
        return clientTeamRepository.save(buildClientTeam());
    }

    public ClientTeam createClientTeam(Broker broker, Client client, String authId, String name) {
        return clientTeamRepository.save(buildClientTeam(broker, client, authId, name));
    }
    
    public ClientTeam createClientTeam(Broker broker, Client client, String authId) {
        return clientTeamRepository.save(buildClientTeam(broker, client, authId, "testName"));
    }

    public RfpToPnn createTestRfpToPNN(RFP rfp, PlanNameByNetwork pnn) {
        return createTestRfpToPNN(rfp, pnn, rfp.getOptions().get(0));
    }

    public RfpToPnn createTestRfpToPNN(RFP rfp, PlanNameByNetwork pnn, Option option) {
        RfpToPnn rfpToPnn = new RfpToPnn();
        rfpToPnn.setOptionId(option.getId());
        rfpToPnn.setPlanType(option.getPlanType());
        rfpToPnn.setPnn(pnn);
        rfpToPnn.setRfp(rfp);
        return rfpToPnnRepository.save(rfpToPnn);
    }
    
    public ClientExtProduct createTestClientExtProduct(Client client, String productName) {
        ExtProduct product = extProductRepository.findByName(productName);
        ClientExtProduct clExtProduct = new ClientExtProduct(client.getClientId(), product);
        return clientExtProductRepository.save(clExtProduct);
    }

    public ClientRfpProduct createTestClientRfpProduct(Client client, String productName) {
        ExtProduct product = extProductRepository.findByName(productName);

        ClientRfpProduct clientRfpProduct = new ClientRfpProduct(client.getClientId(), product,
            false);
        return clientRfpProductRepository.save(clientRfpProduct);
    }

    public ExtBrokerageAccess createExtBrokerageAccess(Broker gaBroker, Broker normalBroker){
        return extBrokerageAccessRepository.save(new ExtBrokerageAccess(gaBroker, normalBroker));
    }

    public ExtClientAccess createExtClientAccess(Broker gaBroker, Client client){
        return extClientAccessRepository.save(new ExtClientAccess(gaBroker, client));
    }
    
    public PresentationOption createTestPresentationOption(Client client, String name) {
        PresentationOption option = new PresentationOption();
        option.setClient(client);
        option.setName(name);
        return presentationOptionRepository.save(option);
    }

}
