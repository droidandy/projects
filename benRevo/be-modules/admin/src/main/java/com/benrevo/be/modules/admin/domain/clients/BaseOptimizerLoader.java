package com.benrevo.be.modules.admin.domain.clients;

import com.benrevo.be.modules.client.service.ClientService;
import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.PersonService;
import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.be.modules.shared.service.SharedClientService;
import com.benrevo.common.Constants;
import com.benrevo.common.anthem.AnthemOptimizerParser;
import com.benrevo.common.anthem.AnthemOptimizerParserData;
import com.benrevo.common.anthem.AnthemOptimizerPlanDetails;
import com.benrevo.common.dto.OptimizerDto;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.helper.PlanBenefitsHelper;
import com.benrevo.data.persistence.repository.*;
import io.vavr.control.Try;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.salesforce.enums.OpportunityType.NewBusiness;
import static com.benrevo.be.modules.salesforce.enums.StageType.RfpSubmitted;
import static com.benrevo.common.Constants.*;
import static com.benrevo.common.enums.CarrierType.fromStrings;
import static com.benrevo.common.util.DateHelper.fromDateToString;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.stream.Collectors.joining;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;


/**
 * Created by ojas.sitapara on 8/16/17.
 */
@Component
@Transactional(rollbackFor = Exception.class)
public class BaseOptimizerLoader {

    protected static final Logger logger = LoggerFactory.getLogger(BaseOptimizerLoader.class);
    protected static DateFormat dateFormatter = new SimpleDateFormat("MM/dd/yy");

    protected static final String EXHIBIT_SHEET = "EXHIBIT";
    protected static final String INTAKE_SHEET = "INTAKE";
    protected static final String DENTAL_INTAKE_SHEET = "DENTAL INTAKE";
    protected static final String ANCILLARY_EXHIBIT_SHEET = "ANCILLARY EXHIBIT";

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private RfpSubmissionRepository submissionRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private AttributeRepository attributeRepository;

    @Autowired
    private Auth0Service auth0Service;

    @Autowired
    private ClientService clientService;

    @Autowired
    private ClientTeamRepository clientTeamRepository;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private BenefitNameRepository benefitNameRepository;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;

    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

    @Autowired
    private PlanBenefitsHelper planBenefitsHelper;

    @Autowired
    private PersonRepository personRepository;
    
    @Autowired
    private PersonService personService;

    @Autowired
    private SharedClientService sharedClientService;
    
    @Autowired
    private SharedCarrierService sharedCarrierService;

    @Value("${app.env:local}")
    String appEnv;

    @Value("${app.carrier}")
    String[] appCarrier;

    private List<BenefitName> benefitNames;
    private boolean debug = false;

    public OptimizerDto validate(InputStream fileInputStream, OptimizerDto params) throws IOException {

        // run the optimizer
        AnthemOptimizerParserData data =
            new AnthemOptimizerParser().parseAll(fileInputStream, true, params);

        return saveParsedOptimizerData(null, data, false);
    }

    public OptimizerDto run(InputStream fileInputStream, OptimizerDto dto) throws IOException {
        benefitNames = benefitNameRepository.findAll();

        AnthemOptimizerParserData data =
            new AnthemOptimizerParser().parseAll(fileInputStream, false, dto);

        return saveParsedOptimizerData(dto, data, true);
    }

    private OptimizerDto saveParsedOptimizerData(OptimizerDto dto, AnthemOptimizerParserData data,
        boolean persist) {

        // save all
        if(isDebug()) {
            System.out.println(
                String.format("brokerName=%s, clientName=%s, tierRates=%s", data.getBrokerName(),
                    data.getClientName(), data.getMedicalTierRates()
                ));
        }

        Broker agent = null;
        if(data.getAgentName() != null) {
            if(dto != null && dto.getGaBrokerage() != null && dto.getGaBrokerage().getId() != null) {
                // use existing GA brokerage
                agent = brokerRepository.findOne(dto.getGaBrokerage().getId());
            } else {
                // General Agent
                agent = brokerRepository.findByNameIgnoreCase(data.getAgentName());
                if(agent == null) {
                    agent = new Broker();
                    agent.setBrokerToken(UUID.randomUUID().toString().toLowerCase());
                    agent.setName(data.getAgentName());
                    agent.setGeneralAgent(true);
                    if(persist) {
                        agent = brokerRepository.save(agent);
                    }
                }
            }
        }

        Broker broker;
        boolean isNewBroker = false;
        if(dto != null && dto.getBrokerage() != null && dto.getBrokerage().getId() != null) {
            broker = brokerRepository.findOne(dto.getBrokerage().getId()); // get existing brokerage by ID
            if(broker == null){
                throw new NotFoundException("Broker not found")
                        .withFields( field("broker_id", dto.getBrokerage().getId()));
            }
        } else {
            broker = brokerRepository.findByNameIgnoreCase(data.getBrokerName()); // get existing broker by name
            if(broker == null) { // broker not found by ID or name, so create new one
                broker = new Broker();
                broker.setBrokerToken(UUID.randomUUID().toString().toLowerCase());
                broker.setName(data.getBrokerName());

                String presalesFullName;
                String salesFullName;
                String specialtyEmail = null;
                if(!"Prod".equalsIgnoreCase(appEnv)) {
                    presalesFullName = BENREVO_DEVPRESALE_NAME;
                    salesFullName = BENREVO_DEVSALE_NAME;
                    broker.setBcc(null);
                    specialtyEmail = BENREVO_DEVSPECIALTY_EMAIL;
                } else {
                    presalesFullName = data.getPreSalesPerson();
                    salesFullName = data.getSalesPerson();
                    if(dto != null && dto.getBrokerage() != null){
                        broker.setBcc(dto.getBrokerage().getBcc());
                        if(!StringUtils.isBlank(dto.getBrokerage().getSpecialtyBrokerEmail())) {
                            specialtyEmail = dto.getBrokerage().getSpecialtyBrokerEmail();
                        }
                        
                    }
                    verifyBcc(broker); // verify bcc field if creating a new broker in prod
                }
                // set prod anthem email
                Person salesPerson = getSale(salesFullName);
                if(salesPerson != null) {
                    broker.setSales(salesPerson);
                } else {
                    String errorMsg = "Can't find salesPerson: " + salesFullName + " in Sales list";
                    if(data.getErrors() != null) {
                        data.getErrors().add(errorMsg);
                    } else {
                        throw new BaseException(errorMsg);
                    }
                }
                Person presalesPerson = getPresale(presalesFullName);
                if(presalesPerson != null) {
                    broker.setPresales(presalesPerson);
                } else {
                    String errorMsg = "Can't find preSalesPerson: " + presalesFullName + " in Pre-Sales list";
                    if(data.getErrors() != null) {
                        data.getErrors().add(errorMsg);
                    } else {
                        throw new BaseException(errorMsg);
                    }
                }
                Person specialtyPerson = findPerson(CarrierType.fromStrings(appCarrier), 
                    PersonType.SPECIALTY, null, specialtyEmail);
                if(specialtyPerson != null) {
                    broker.addSpecialtyPerson(specialtyPerson);
                } else if (specialtyEmail != null) { // error only if specialtyEmail != null (was parsed from file)
                    String errorMsg = "Can't find specialtyPerson: " + specialtyEmail + " in Specialty list";
                    if(data.getErrors() != null) {
                        data.getErrors().add(errorMsg);
                    } else {
                        throw new BaseException(errorMsg);
                    }
                }
                if(persist) {
                    broker = brokerRepository.save(broker);
                }
                isNewBroker = true;
            }
        }

        if(persist && agent != null) {
            if(isNewBroker) {
                // add access to new brokerage
                    extBrokerageAccessRepository.save(new ExtBrokerageAccess(agent, broker));
            } else {
                // check access to existed broker
                ExtBrokerageAccess brokerAccess =
                    extBrokerageAccessRepository.findByExtBrokerIdAndBrokerId(agent.getBrokerId(),
                        broker.getBrokerId() );
                if(brokerAccess == null) {
                        extBrokerageAccessRepository.save(new ExtBrokerageAccess(agent, broker));
                    }
                }
            }

        Client client = null;
        if(dto != null && dto.getClient() != null && dto.getClient().getId() != null) {
            // use existing client
            client = clientRepository.findOne(dto.getClient().getId());

        } else {
            String clientName = (dto != null && dto.getNewClientName() != null) ?
                    dto.getNewClientName() :
                    data.getClientName();
    
            if (!isNewBroker) {
                // if broker existed
                List<Client> clients = clientRepository.findByClientNameAndBrokerBrokerIdAndCarrierOwned(
                    clientName, broker.getBrokerId(), false);
                if (!clients.isEmpty()) {
                    if(persist) {
                        throw new BaseException(String.format("Client with name=%s already exists", clientName));
                    }
                    client = clients.get(0);
                }
            }
            if (client == null) {
                client = new Client();
                client.setClientName(clientName);
            client.setBroker(broker);
            client.setClientState(ClientState.RFP_SUBMITTED);
            client.setEffectiveDate(data.getEffectiveDate());
            client.setDueDate(data.getDueDate());
            client.setEligibleEmployees(data.getEligibleEmployees());
            client.setParticipatingEmployees(data.getParticipatingEmployees());
            client.setSicCode(data.getSicCode());
        
            if(persist) {
                client = clientRepository.save(client);
                attributeRepository.save(
                    new ClientAttribute(client, AttributeName.DIRECT_TO_PRESENTATION));
    
                if(agent != null) {
                    // add access to new client
                    extClientAccessRepository.save(new ExtClientAccess(agent, client));
                    }
                }
            }
        }
        
        // save RFPs and plans
        boolean medicalRfpExist = rfpRepository.findByClientClientIdAndProduct(client.getClientId(), Constants.MEDICAL) != null;
        if (data.isHasMedical()) {
            saveRfp(Constants.MEDICAL, client, data.getMedicalCommission(), data.getMedicalContributionType(),
                data.getMedicalTierRates(), medicalRfpExist, persist);
            createClientPlans(client, data.getMedicalPlans(), data, persist);
        }   
        boolean dentalRfpExist = rfpRepository.findByClientClientIdAndProduct(client.getClientId(), Constants.DENTAL) != null;
        if(data.isHasDental()) {
            saveRfp(Constants.DENTAL, client, data.getDentalCommission(), data.getDentalContributionType(),
                data.getDentalTierRates(), dentalRfpExist, persist);
            createClientPlans(client, data.getDentalPlans(), data, persist);
        }
        boolean visionRfpExist = rfpRepository.findByClientClientIdAndProduct(client.getClientId(), Constants.VISION) != null;
        if(data.isHasVision()) {
            saveRfp(Constants.VISION, client, data.getVisionCommission(), data.getVisionContributionType(),
                data.getVisionTierRates(), visionRfpExist, persist);
            createClientPlans(client, data.getVisionPlans(), data, persist);
        }

        if(persist) {
            final Client finalClient = client;
            final Broker finalBroker = broker;
            final Broker finalAgent = agent;

            // Salesforce
            Try.run(() -> publisher.publishEvent(
                new SalesforceEvent.Builder()
                    .withObject(
                        new SFOpportunity.Builder()
                            .withBrokerageFirm(finalBroker.getName())
                            .withName(finalClient.getClientName())
                            .withCarrier(fromStrings(appCarrier))
                            .withTest(!equalsIgnoreCase(appEnv, "prod"))
                            .withCarrierContact(finalClient.getSalesEmail())
                            .withEligibleEmployees(finalClient.getEligibleEmployees())
                            .withParticipatingEmployees(finalClient.getParticipatingEmployees())
                            .withGeneralAgent(
                                finalAgent != null
                                    ? finalAgent.getName()
                                    : null
                            )
                            .withIncumbentMedicalCarrier(
                                data.getMedicalPlans().stream()
                                    .map(vs -> CarrierType.fromDisplayNameString(vs.getCarrierName()).name())
                                    .distinct()
                                    .collect(joining(";"))
                            )
                            .withIncumbentDentalCarrier(
                                data.getDentalPlans().stream()
                                    .map(vs -> CarrierType.fromDisplayNameString(vs.getCarrierName()).name())
                                    .distinct()
                                    .collect(joining(";"))
                            )
                            .withIncumbentVisionCarrier(
                                data.getVisionPlans().stream()
                                    .map(vs -> CarrierType.fromDisplayNameString(vs.getCarrierName()).name())
                                    .distinct()
                                    .collect(joining(";"))
                            )
                            .withStageName(RfpSubmitted)
                            .withType(NewBusiness)
                            .withEffectiveDate(finalClient.getEffectiveDate())
                            .withCloseDate(finalClient.getDueDate())
                            .withRfpSubmitted(new Date())
                            .build()
                    )
                    .withEmail(
                        Try.of(
                            () -> ((AuthenticatedUser) SecurityContextHolder
                                .getContext()
                                .getAuthentication())
                                .getEmail()
                        ).getOrNull()
                    )
                    .build()
            )).onFailure(t -> logger.error(t.getMessage(), t));
        }

        OptimizerDto result = new OptimizerDto();

        result.setClient(new ClientDto());
        result.setErrors(data.getErrors());
        
        if (medicalRfpExist) { result.getProducts().add(
            new OptimizerDto.OptimizerProduct(Constants.MEDICAL));
        }
        if (dentalRfpExist) {
            result.getProducts().add(new OptimizerDto.OptimizerProduct(DENTAL));
        }
        if (visionRfpExist) {
            result.getProducts().add(new OptimizerDto.OptimizerProduct(VISION));
        }

        if(broker.getBrokerId() != null) {
            // existing broker
            result.setBrokerage(broker.toBrokerDto());
            result.getBrokerage().setBrokerToken(null);
        } else {
            result.setBrokerage(new BrokerDto());
            result.getBrokerage().setName(data.getBrokerName());
        }

        // GA brokerage check
        if(data.getAgentName() != null) {
            // General Agent
            if(agent.getBrokerId() != null) {
                // existing agent
            result.setGaBrokerage(agent.toBrokerDto());
                result.getGaBrokerage().setBrokerToken(null);
        } else {
            result.setGaBrokerage(new BrokerDto());
                result.getGaBrokerage().setName(data.getAgentName());
        }
    }

        if (client.getClientId() != null) {
            // client already exist or was created so let the UI know
            result.getClient().setId(client.getClientId());
            result.getClient().setClientName(client.getClientName());
            result.getClient().setSicCode(client.getSicCode());
            result.getClient().setEligibleEmployees(client.getEligibleEmployees());
            result.getClient().setEffectiveDate(DateHelper.fromDateToString(client.getEffectiveDate()));
        } else {
            // set parse client information
            result.getClient().setClientName(data.getClientName());
            result.getClient().setSicCode(data.getSicCode());
            result.getClient().setEligibleEmployees(data.getEligibleEmployees());
            result.getClient().setEffectiveDate(DateHelper.fromDateToString(data.getEffectiveDate()));
        }

        return result;
    }

    private void createClientPlans(
        Client client, List<AnthemOptimizerPlanDetails> plans, AnthemOptimizerParserData data,
        boolean persist
    ) {

        for(AnthemOptimizerPlanDetails planDetails : plans) {

            // find carrier
            Carrier carrier =
                carrierRepository.findByNameOrDisplayNameIgnoreCase(planDetails.getCarrierName(),
                    planDetails.getCarrierName()
                );
            if(carrier == null && data.getErrors() == null) {
                throw new BaseException(
                    "No carrier found carrierName=" + planDetails.getCarrierName());
            } else if(carrier == null && data.getErrors() != null) {
                data.getErrors()
                    .add("No carrier found carrierName=" + planDetails.getCarrierName()
                        + ". Carrier name is case insensitive");
            }

            String planType = planDetails.getPlanType().toUpperCase();
            String networkType = planType;
            if(planType.contains("DHMO")) {
                networkType = "DHMO";
            } else if(planType.contains("DPPO")) {
                networkType = "DPPO";
            } else if(planType.contains("VISION")) {
                networkType = "VISION";
            } else if(planType.contains("HMO")) {
                networkType = "HMO";
            } else if(planType.contains("HSA")) {
                networkType = "HSA";
            } else if(planType.contains("PPO")) {
                networkType = "PPO";
            } else if(planType.contains("CDHP")) {
                networkType = "HSA";
            } else if(planType.contains("KAISER")) {
                networkType = "HMO";
            } else if(planType.contains("VIVITY")) {
                networkType = "HMO";
            } else if(planType.contains("SOL")) {
                networkType = "PPO";
            }

            // find any network with type
            List<Network> networks = networkRepository.findByTypeAndCarrier(networkType, carrier);
            Network network = null;

            if(networks.isEmpty()){
                if(data.getErrors() == null && carrier != null) {
                    throw new NotFoundException(
                        "No network found in DB for networkType=" + networkType + " carrierName="
                            + carrier.getName());
                }else if(data.getErrors() != null && carrier != null) {
                    data.getErrors()
                        .add("No network found in DB for networkType=" + networkType + " carrierName="
                            + carrier.getName());
                }
            }else{
                network = networks.get(0);
            }

            Plan plan = new Plan();
            plan.setPlanType(networkType);
            plan.setName(planDetails.getPlanName());
            plan.setCarrier(carrier);
            if(persist) {
                plan = planRepository.save(plan);

                //add empty benefits for given plan type
                planBenefitsHelper.addPlaceHolderBenefitsToPlan(benefitNames, carrier, plan);
            }

            PlanNameByNetwork pnn = new PlanNameByNetwork();
            pnn.setPlan(plan);
            pnn.setNetwork(network);
            pnn.setName(planDetails.getPlanName());
            pnn.setPlanType(networkType);
            pnn.setCustomPlan(true);
            if(persist) {
                pnn = planNameByNetworkRepository.save(pnn);
            }

            PlanNameByNetwork rxPnn = createExternalRxPlan(network, persist,
                planDetails.getPlanName(), benefitNames);

            ClientPlan clientPlan = new ClientPlan();

            clientPlan.setClient(client);
            clientPlan.setPnn(pnn);
            clientPlan.setRxPnn(rxPnn);
            clientPlan.setPlanType(networkType);

            clientPlan.setTier1Rate(planDetails.getTier1Rate());
            clientPlan.setTier2Rate(planDetails.getTier2Rate());
            clientPlan.setTier3Rate(planDetails.getTier3Rate());
            clientPlan.setTier4Rate(planDetails.getTier4Rate());

            clientPlan.setTier1Census(planDetails.getTier1Census());
            clientPlan.setTier2Census(planDetails.getTier2Census());
            clientPlan.setTier3Census(planDetails.getTier3Census());
            clientPlan.setTier4Census(planDetails.getTier4Census());

            clientPlan.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_PERCENT);
            clientPlan.setTier1ErContribution(planDetails.getTier1ErContribution());
            clientPlan.setTier2ErContribution(planDetails.getTier2ErContribution());
            clientPlan.setTier3ErContribution(planDetails.getTier3ErContribution());
            clientPlan.setTier4ErContribution(planDetails.getTier4ErContribution());

            if(isDebug()) {
                System.out.println(String.format(
                    "[ PlanName=%s, PlanType=%s, NetworkType=%s, Tier1Census=%s, Tier2Census=%s, "
                        + "Tier3Census=%s, Tier4Census=%s, Tier1Rate=%s, Tier2Rate=%s, Tier3Rate=%s, Tier4Rate=%s, "
                        + "Tier1ErContribution=%s, Tier2ErContribution=%s, Tier3ErContribution=%s, Tier4ErContribution=%s ]",
                    planDetails.getPlanName(), planDetails.getPlanType(), clientPlan.getPlanType(),
                    clientPlan.getTier1Census(), clientPlan.getTier2Census(),
                    clientPlan.getTier3Census(), clientPlan.getTier4Census(),
                    clientPlan.getTier1Rate(), clientPlan.getTier2Rate(), clientPlan.getTier3Rate(),
                    clientPlan.getTier4Rate(), clientPlan.getTier1ErContribution(),
                    clientPlan.getTier2ErContribution(), clientPlan.getTier3ErContribution(),
                    clientPlan.getTier4ErContribution()
                ));
            }

            if(persist) {
                clientPlanRepository.save(clientPlan);
            }
        }
    }

    protected PlanNameByNetwork createExternalRxPlan(Network network, boolean persist, String planName, List<BenefitName> benefitNames){
        return null;
    }

    private void saveRfp(
        String product, Client client, String commission, String contributionType, int tierRates,
        boolean rfpExist, boolean persist
    ) {

        if (rfpExist && persist) {
            throw new BaseException(String.format("RFP exists for clientId=%s and category=%s",client.getClientId(), product));
        }
        
        RFP rfp = new RFP();
        rfp.setProduct(product);
        rfp.setContributionType(contributionType);

        setCommissionInRfp(rfp, commission);

        rfp.setClient(client);
        rfp.setRatingTiers(tierRates);
        rfp.setLastUpdated(new Date());
        if(persist) {
            rfp = rfpRepository.save(rfp);
        }
        RfpCarrier rc = getRfpCarrier(rfp.getProduct());
        if(rc == null) {
            throw new NotFoundException("No RFP Carrier found").withFields(
                field("category", rfp.getProduct()),
                field("carrier", CarrierType.ANTHEM_BLUE_CROSS.name())
            );
        }

        if(persist) {
            RfpSubmission rs = submissionRepository.findByRfpCarrierAndClient(rc, client);

            if(rs == null) {
                rs = new RfpSubmission();
                rs.setClient(client);
                rs.setRfpCarrier(rc);
                rs.setCreated(fromDateToString(new Date(), DATETIME_FORMAT));
                rs.setDisqualificationReason(null);
                rs.setSubmittedBy("BaseOptimizerLoader");
                rs.setSubmittedDate(new Date());
                if(persist) {
                    submissionRepository.save(rs);
                }
            }

            sharedClientService.addClientRfpProductIfNotExist(client.getClientId(), product, false);
        }

    }

    /***********************************
     * Helper Methods
     ***********************************/

    protected void setCommissionInRfp(RFP rfp, String commissionStr) {
        Double commission;

        if((rfp.getProduct().equalsIgnoreCase(Constants.DENTAL) || rfp.getProduct()
            .equalsIgnoreCase(Constants.VISION)) && commissionStr != null && commissionStr.equalsIgnoreCase("std")) {
            rfp.setCommission("10");
            rfp.setPaymentMethod("%");
        } else if((rfp.getProduct().equalsIgnoreCase(Constants.DENTAL) || rfp.getProduct()
            .equalsIgnoreCase(Constants.VISION)) && commissionStr != null && commissionStr.equalsIgnoreCase("net")) {
            rfp.setCommission("0");
            rfp.setPaymentMethod("%");
        } else if(commissionStr != null && commissionStr.contains("%")) {
            commission = Double.parseDouble(commissionStr.replace("%", ""));
            rfp.setCommission(commission.toString());
            rfp.setPaymentMethod("%");
        } else if(commissionStr != null && commissionStr.contains("$")) { //TODO: need an example of PEPM
            commission = Double.parseDouble(commissionStr.replace("$", "").replace(",", ""));
            rfp.setCommission(commission.toString());
            rfp.setPaymentMethod("PEPM");
        } else if(commissionStr != null && commissionStr.contains(
            "Commissions")) {//TODO: need an example of Net of Comissions
            rfp.setPaymentMethod("COMMISSION");
        }
    }

    protected boolean isDebug() {
        return debug;
    }

    public void setDebug(boolean debug) {
        this.debug = debug;
    }

    protected Person getPresale(String presaleName){
        throw new UnsupportedOperationException("Not implemented");
    }

    protected Person getSale(String saleName){
        throw new UnsupportedOperationException("Not implemented");
    }
    
    protected Person findPerson(CarrierType carrierType, PersonType personType, String name, String email) {
        if(name == null && email == null) {
            return null;
        }
        return personService.getByTypeAndCarrier(personType, sharedCarrierService
                .findByName(carrierType).getCarrierId())
                .stream()
                .filter(p -> {
                    if(name != null) {
                        return name.equalsIgnoreCase(p.getFullName());
                    } else {
                        return email.equalsIgnoreCase(p.getEmail());
                    }
                })
                .findFirst()
                .map(p -> personRepository.findOne(p.getPersonId()))
                .orElse(null);
    }

    protected RfpCarrier getRfpCarrier(String product) {
        throw new UnsupportedOperationException("Not implemented");
    }

    protected void verifyBcc(Broker broker){ throw new UnsupportedOperationException("Not implemented"); }

}
