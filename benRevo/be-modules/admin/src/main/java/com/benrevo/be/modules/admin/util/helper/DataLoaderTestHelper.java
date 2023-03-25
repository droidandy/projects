package com.benrevo.be.modules.admin.util.helper;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.benrevo.common.Constants;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.benrevo.data.persistence.entities.RfpQuoteVersion;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.PersonRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpQuoteSummaryRepository;
import com.benrevo.data.persistence.repository.RfpQuoteVersionRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;

@Component
public class DataLoaderTestHelper {

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private RfpQuoteSummaryRepository rfpQuoteSummaryRepository;
    
    @Autowired
    private PlanRepository planRepository;
    
    @Autowired
    private NetworkRepository networkRepository;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteVersionRepository rfpQuoteVersionRepository;
    
    @Autowired
    private PersonRepository personRepository;
    
    @Autowired
    private CarrierRepository carrierRepository;
    
    @Value("${app.carrier}")
    protected String[] appCarrier;

    public RfpQuoteNetwork findByRfpQuoteAndRfpQuoteOptionName (RfpQuote quote, String optionName) {
        return rfpQuoteNetworkRepository.findByRfpQuoteAndRfpQuoteOptionName(quote, optionName);
    }

    public RfpQuoteOptionNetwork createTestRfpQuoteOptionNetwork(RfpQuoteOption quote, String quoteOptionName, ClientPlan clientPlan, String category) {
        return rfpQuoteOptionNetworkRepository.save(buildTestRfpQuoteOptionNetwork(quote, quoteOptionName, clientPlan, category));
    }

    public Plan createTestPlan(Carrier carrier) {
        Plan plan = new Plan();
        plan.setCarrier(carrier);
        plan.setCreated(new Date());
        plan.setUpdated(new Date());
        plan.setName("testName");
        plan.setPlanType("testPlanType");
        return planRepository.save(plan);
    }

    public PlanNameByNetwork createTestPlanNameByNetwork(Plan plan, String name, Network network) {
        PlanNameByNetwork planName = new PlanNameByNetwork();
        planName.setPlan(plan);
        planName.setCost(1l);
        planName.setCreated(new Date());
        planName.setNetwork(network);
        planName.setName(name);
        planName.setPlanType(network.getType());
        planName.setUpdated(new Date());
        return planNameByNetworkRepository.save(planName);
    }
    
    public Network createTestNetwork(Carrier carrier, String name, String type) {
        Network network = new Network();
        network.setCarrier(carrier);
        network.setCreated(new Date());
        network.setName(name);
        network.setTier("testTier");
        network.setType(type);
        network.setUpdated(new Date());
        return networkRepository.save(network);
    }

    private RfpQuoteOptionNetwork buildTestRfpQuoteOptionNetwork(RfpQuoteOption option, String quoteOptionName, ClientPlan clientPlan, String category) {

        //create new rfp option network
        RfpQuoteOptionNetwork rqon = new RfpQuoteOptionNetwork();
        rqon.setRfpQuoteVersion(option.getRfpQuoteVersion());
        rqon.setRfpQuoteOption(option);

        //pick a rfp quote network from the quote we are adding to this option
        RfpQuoteNetwork quoteNetwork = rfpQuoteNetworkRepository.findByRfpQuoteAndRfpQuoteOptionName(option.getRfpQuote(), quoteOptionName);
        if(null == quoteNetwork) {
            throw new IllegalArgumentException("Could not find network '"+ quoteOptionName +"' in quote id: " + option.getRfpQuoteOptionId());
        }
        rqon.setRfpQuoteNetwork(quoteNetwork);

        //pick a (the first) plan from that network
        List<RfpQuoteNetworkPlan> matchingPlans = rfpQuoteNetworkPlanRepository.findByRfpQuoteNetworkAndMatchPlanTrue(quoteNetwork);
        if(null == quoteNetwork ) { //one plan and one Rx
            throw new IllegalArgumentException("No matching' plan found for " + quoteOptionName + ", should have minimum of one depending on product");
        }

        if(category.equals(Constants.MEDICAL) && 2 != matchingPlans.size()){
            throw new IllegalArgumentException("Incorrect number of 'matching' plan found for " + quoteOptionName + ", should have one plan and one Rx");
        } else if (!category.equals(Constants.MEDICAL) && 1 != matchingPlans.size()) {
            throw new IllegalArgumentException("Incorrect number of 'matching' plan found for " + quoteOptionName + ", should have one.");
        }

        //set the matching plans
        if(category.equals(Constants.MEDICAL)) {
            if(matchingPlans.get(0).getPnn().getPlanType().startsWith("RX_")) {
                rqon.setSelectedRfpQuoteNetworkRxPlan(matchingPlans.get(0));
                rqon.setSelectedRfpQuoteNetworkPlan(matchingPlans.get(1));
            } else {
                rqon.setSelectedRfpQuoteNetworkPlan(matchingPlans.get(0));
                rqon.setSelectedRfpQuoteNetworkRxPlan(matchingPlans.get(1));
            }
        } else {
            rqon.setSelectedRfpQuoteNetworkPlan(matchingPlans.get(0));
        }

        // set the client plan this network is going to replace
        rqon.setClientPlan(clientPlan);

        // start the new matching plans at the same census and contribuiton.
        //set contribution
        rqon.setErContributionFormat(clientPlan.getErContributionFormat());
        rqon.setTier1ErContribution(clientPlan.getTier1ErContribution());
        rqon.setTier2ErContribution(clientPlan.getTier2ErContribution());
        rqon.setTier3ErContribution(clientPlan.getTier3ErContribution());
        rqon.setTier4ErContribution(clientPlan.getTier4ErContribution());

        //set census
        rqon.setTier1Census(clientPlan.getTier1Census());
        rqon.setTier2Census(clientPlan.getTier2Census());
        rqon.setTier3Census(clientPlan.getTier3Census());
        rqon.setTier4Census(clientPlan.getTier4Census());

        return rqon;
    }

    public RfpQuoteOption createTestRfpQuoteOption(RfpQuote quote) {
        return rfpQuoteOptionRepository.save(buildTestRfpQuoteOption(quote));
    }

    private RfpQuoteOption buildTestRfpQuoteOption(RfpQuote quote) {
        RfpQuoteOption option = new RfpQuoteOption();
        option.setRfpQuote(quote);
        option.setRfpQuoteOptionName("Option 1");
        option.setRfpQuoteVersion(quote.getRfpQuoteVersion());
        return option;
    }


    public Iterable<RfpSubmission> createTestAllRfpSubmissions(Long carrierId, Client client) {
        return rfpSubmissionRepository.save(buildTestAllRfpSubmissions(carrierId, client));
    }

    private List<RfpSubmission> buildTestAllRfpSubmissions(Long carrierId, Client client) {
        List<RfpSubmission> submissionList = new ArrayList<>();

        List<RfpCarrier> rfpCarriers = rfpCarrierRepository.findByCarrierCarrierId(carrierId);

        for(RfpCarrier rc : rfpCarriers) {
            RfpSubmission submission = new RfpSubmission();
            submission.setClient(client);
            submission.setRfpCarrier(rc);
            submissionList.add(submission);
        }
        return submissionList;
    }

    public RfpQuoteSummary createTestQuoteSummary(Client client, String medical, String dental, String vision) {
        return rfpQuoteSummaryRepository.save(buildQuoteSummary(client, medical, dental, vision));
    }
    private RfpQuoteSummary buildQuoteSummary(Client client, String medical, String dental, String vision) {
        RfpQuoteSummary summary = new RfpQuoteSummary();
        summary.setMedicalNotes(medical);
        summary.setDentalNotes(dental);
        summary.setVisionNotes(vision);
        summary.setClient(client);
        summary.setUpdated(new Date());
        return summary;
    }

    public RfpQuoteSummary findByClientClientId(Long clientId) {
        return rfpQuoteSummaryRepository.findByClientClientId(clientId);
    }

    public void saveRfpQuoteSummary(RfpQuoteSummary rfpQuoteSummary) {
        rfpQuoteSummaryRepository.save(rfpQuoteSummary);
    }

    public ClientPlan createTestClientPlan (Client client, String planType, String planName) {
        return clientPlanRepository.save(buildTestDefaultClientPlan(client, planType, planName));
    }

    public ClientPlan createTestClientPlan(Client client, String planType, String planName,
                                           Float [] rates, Float[] contri, Long [] enroll, Long rxPnnId) {
        return clientPlanRepository.save(buildTestClientPlan(client, planType, planName, rates, contri, enroll, rxPnnId));
    }

    private ClientPlan buildTestClientPlan(Client client, String planType, String planName,
                                           Float [] rates, Float[] contri, Long [] enroll, Long rxPnnId) {
        ClientPlan cp = new ClientPlan();
        cp.setClient(client);
        cp.setPnn(getPnnByNameAndType(planName, planType).get(0));
        if(null != rxPnnId) {
            cp.setRxPnn(planNameByNetworkRepository.findOne(rxPnnId));
        }
        cp.setErContributionFormat("DOLLAR");

        cp.setTier1ErContribution(contri[0]);
        cp.setTier2ErContribution(contri[1]);
        cp.setTier3ErContribution(contri[2]);
        cp.setTier4ErContribution(contri[3]);
        cp.setTier1Rate(rates[0]);
        cp.setTier2Rate(rates[1]);
        cp.setTier3Rate(rates[2]);
        cp.setTier4Rate(rates[3]);
        cp.setTier1Census(enroll[0]);
        cp.setTier2Census(enroll[1]);
        cp.setTier3Census(enroll[2]);
        cp.setTier4Census(enroll[3]);
        cp.setPlanType(planType);

        return cp;
    }
    private ClientPlan buildTestDefaultClientPlan(Client client, String planType, String planName) {

        ClientPlan cp = new ClientPlan();
        cp.setClient(client);
        cp.setPnn(getPnnByNameAndType(planName, planType).get(0));
        cp.setErContributionFormat("DOLLAR");

        if(planType.equals("HMO") || planType.equals("PPO")) {
            cp.setTier1ErContribution(380F);
            cp.setTier2ErContribution(580F);
            cp.setTier3ErContribution(780F);
            cp.setTier4ErContribution(980F);
            cp.setTier1Rate(400F);
            cp.setTier2Rate(600F);
            cp.setTier3Rate(800F);
            cp.setTier4Rate(1000F);
        } else if(planType.equals("DHMO") || planType.equals("DPPO")) {
            cp.setTier1ErContribution(40F);
            cp.setTier2ErContribution(70F);
            cp.setTier3ErContribution(90F);
            cp.setTier4ErContribution(140F);
            cp.setTier1Rate(50F);
            cp.setTier2Rate(85F);
            cp.setTier3Rate(110F);
            cp.setTier4Rate(170F);
        } else if(planType.equals("VISION")) {
            cp.setTier1ErContribution(5F);
            cp.setTier2ErContribution(10F);
            cp.setTier3ErContribution(15F);
            cp.setTier4ErContribution(20F);
            cp.setTier1Rate(8F);
            cp.setTier2Rate(11F);
            cp.setTier3Rate(20F);
            cp.setTier4Rate(25F);

        }
        cp.setTier1Census(50L);
        cp.setTier2Census(50L);
        cp.setTier3Census(50L);
        cp.setTier4Census(50L);
        cp.setPlanType(planType);

        return cp;
    }

    public Client createTestClientInBrokerage(Long brokerId, String clientName) {
        Broker broker = getBroker(brokerId);
        Client client = createTestClientInBrokerage(broker, clientName);
        clientRepository.save(client);
        return client;
    }

    public Client createTestClientInBrokerage(String clientName) {
        return clientRepository.save(buildTestClient(clientName));
    }

    public Client createTestClientInBrokerage() {
        return createTestClientInBrokerage( "TestClient_" + DateHelper.getFormatedTimestampForDB());
    }

    public Broker buildTestBroker() {
        return buildTestBroker("testBrokerName");
    }

    private Broker buildTestBroker(String brokerName) {
        Broker broker = new Broker();
        broker.setBrokerToken(UUID.randomUUID().toString().toLowerCase());
        Carrier carrier = carrierRepository.findByName(appCarrier[0]);
        Person devSales = personRepository.findByCarrierIdAndTypeAndEmail(
            carrier.getCarrierId(), PersonType.SALES, Constants.BENREVO_DEVSALE_EMAIL);
        if(devSales == null) {
            throw new BaseException("Cannot find DEV Sales person by email: " + Constants.BENREVO_DEVSALE_EMAIL);
        }
        broker.setSales(devSales);
        Person devPresales = personRepository.findByCarrierIdAndTypeAndEmail(
            carrier.getCarrierId(), PersonType.PRESALES, Constants.BENREVO_DEVPRESALE_EMAIL);
        if(devPresales == null) {
            throw new BaseException("Cannot find DEV PreSales person by email: " + Constants.BENREVO_DEVPRESALE_EMAIL);
        }
        broker.setPresales(devPresales);
        broker.setName(brokerName);
        return broker;
    }

    public Broker createTestBroker() {
        return brokerRepository.save(buildTestBroker());
    }

    private Client createTestClientInBrokerage(Broker broker, String name) {
        Client client = new Client();
        client.setBroker(broker);
        client.setClientName(name);
        client.setClientState(ClientState.QUOTED);
        return client;
    }

    public Client buildTestClient(String name) {
        Broker broker = createTestBroker();

        Client client = new Client();
        client.setBroker(broker);
        client.setClientName(name);
        client.setClientState(ClientState.QUOTED);
        return client;
    }

    public RfpQuote createTestRfpQuote(RfpSubmission rfpSubmission, QuoteType quoteType) {
        return buildTestRfpQuote(rfpSubmission, buildTestRfpQuoteVersion(rfpSubmission), quoteType);
    }
    
    public RfpQuote buildTestRfpQuote(RfpSubmission rfpSubmission, RfpQuoteVersion rfpQuoteVersion, QuoteType quoteType) {
        RfpQuote rfpQuote = new RfpQuote();
        rfpQuote.setRfpQuoteVersion(rfpQuoteVersion);
        rfpQuote.setRfpSubmission(rfpSubmission);
        rfpQuote.setQuoteType(quoteType);
        rfpQuote.setLatest(true);
        rfpQuote.setUpdated(new Date());
        rfpQuote.setRatingTiers(4);
        return rfpQuoteRepository.save(rfpQuote);
    }

    public RfpQuoteVersion buildTestRfpQuoteVersion(RfpSubmission rfpSubmission) {
        RfpQuoteVersion rfpQuoteVersion = new RfpQuoteVersion();
        rfpQuoteVersion.setRfpSubmissionId(rfpSubmission.getRfpSubmissionId());
        return rfpQuoteVersionRepository.save(rfpQuoteVersion);
    }

    public Broker getBroker(Long brokerId) {
        return brokerRepository.findOne(brokerId);
    }

    public Client getClient(Long clientId) {
        return clientRepository.findOne(clientId);
    }

    private List<PlanNameByNetwork> getPnnByNameAndType(String name, String type) {
        List<PlanNameByNetwork> pnnList = planNameByNetworkRepository.findByNameAndPlanType(name, type);
        if(0 == pnnList.size()) {
            throw new IllegalArgumentException("No plan name '"+ name +"' was found for network type " + type);
        }
        return pnnList;
    }

    public List<RfpQuoteNetwork> getRfpQuoteNetworks(RfpQuote quote) {
        return rfpQuoteNetworkRepository.findByRfpQuote(quote);
    }

    public List<RfpQuoteNetworkPlan> getRfpQuoteNetworkPlans(RfpQuoteNetwork quoteNetwork) {
        return rfpQuoteNetworkPlanRepository.findByRfpQuoteNetwork(quoteNetwork);
    }

    public RfpQuoteNetworkPlan findByRfpQuoteNetworkAndPnnName(RfpQuoteNetwork network, String planName) {
        return rfpQuoteNetworkPlanRepository.findByRfpQuoteNetworkAndPnnName(network, planName);
    }

    public List<Benefit> findBenefitsByPlanId(Long planId) {
    	return benefitRepository.findByPlanId(planId);
    }
    
    public Network findNetworkByNameAndTypeAndCarrier(String name, String type, Carrier carrier) {
    	return networkRepository.findByNameAndTypeAndCarrier(name, type, carrier);
    }
}
