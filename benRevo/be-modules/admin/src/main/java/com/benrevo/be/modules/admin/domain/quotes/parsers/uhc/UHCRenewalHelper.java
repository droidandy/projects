package com.benrevo.be.modules.admin.domain.quotes.parsers.uhc;

import static com.benrevo.common.Constants.DATETIME_FORMAT;
import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.enums.CarrierType.BENREVO;
import static com.benrevo.common.enums.CarrierType.carrierMatches;
import static com.benrevo.common.util.DateHelper.fromDateToString;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Objects.isNull;
import static org.apache.commons.collections4.CollectionUtils.isEmpty;
import static org.apache.commons.collections4.CollectionUtils.isNotEmpty;
import static org.apache.commons.lang.math.NumberUtils.toFloat;
import static org.apache.commons.lang.math.NumberUtils.toLong;
import static org.apache.commons.lang3.StringUtils.remove;

import com.benrevo.be.modules.shared.service.SharedClientService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.helper.PlanBenefitsHelper;
import com.benrevo.data.persistence.repository.BenefitNameRepository;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@AppCarrier({UHC, BENREVO})
@Transactional(rollbackFor = Exception.class)
public class UHCRenewalHelper{

    private static final Logger LOGGER = LogManager.getLogger(UHCRenewalHelper.class);
    private final String RX_NETWORK_NAME = "Full Network";

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private PlanBenefitsHelper planBenefitsHelper;

    @Autowired
    private BenefitNameRepository benefitNameRepository;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private SharedClientService sharedClientService;

    @Autowired
    private NetworkRepository networkRepository;

    public void createRfpSubmissionIfNotFound(Long clientId, String product, List<LinkedHashMap<String, UHCNetwork>> options, boolean persist){

        // check for rfp and if it does not exist, create it.
        Client client = clientRepository.findOne(clientId);
        RFP rfp = rfpRepository.findByClientClientIdAndProduct(clientId, product);
        if(isNull(rfp)){
            rfp = new RFP();
            rfp.setProduct(product);

            rfp.setClient(client);
            rfp.setLastUpdated(new Date());
            
            String commission = getCommission(options);
            if (commission != null) {
                rfp.setCommission(commission);
                rfp.setContributionType("%");
                rfp.setPaymentMethod("%");
            }
            if(persist) {
                rfpRepository.save(rfp);
            }
        }

        // check for rfp submission, if it does not exist, create it
        RfpCarrier rc = rfpCarrierRepository.findByCarrierNameAndCategory(Constants.UHC_CARRIER, product);
        if(rc == null) {
            throw new NotFoundException("No RFP Carrier found").withFields(
                field("category", rfp.getProduct()),
                field("carrier", CarrierType.UHC.name())
            );
        }

        if(persist) {
            RfpSubmission rs = rfpSubmissionRepository.findByRfpCarrierAndClient(rc, client);
            if(rs == null) {
                rs = new RfpSubmission();
                rs.setClient(client);
                rs.setRfpCarrier(rc);
                rs.setCreated(fromDateToString(new Date(), DATETIME_FORMAT));
                rs.setDisqualificationReason(null);
                rs.setSubmittedBy("UHCRenewalQuoteUploader");
                rs.setSubmittedDate(new Date());
                if(persist) {
                    rfpSubmissionRepository.save(rs);
                }
            }
        }
    }

    private String getCommission(List<LinkedHashMap<String, UHCNetwork>> options) {

        if (options == null) {
            return null;
        }
        List<String> commissions = options.stream()
                .flatMap(o -> o.values().stream())
                .map(n -> n.getOption().getCommission())
                .filter(c -> c != null)
                .distinct()
                .collect(Collectors.toList());
        
        if (commissions.isEmpty()) {
            return null;
        }
        if (commissions.size() > 1) {
            // What commission put in RFP ?
            throw new BaseException("Commission in options are not equal: " + StringUtils.join(commissions, ", "));
        }
        return commissions.get(0);
    }

    public void createClientPlansIfNotFound(Long clientId, Network network, RfpCarrier rfpCarrier,
        UHCNetworkDetails UHCParsedPlan, List<Benefit> benefits, int tiers,  List<BenefitName> benefitNames, boolean persist){

        // check for client plans. if it does not exist, create it.
        ClientPlan clientPlan = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(clientId,
            Arrays.asList(network.getType()))
            .stream()
            .filter(cp -> !isNull(cp.getPnn()) && cp.getPnn().getName().equalsIgnoreCase(UHCParsedPlan.getFullPlanName())
                && cp.getPnn().getNetwork().getNetworkId().equals(network.getNetworkId()))
            .findFirst()
            .orElse(null);

        if(!isNull(clientPlan)){
            return; // do not create client plans again
        }

        createOrGetClientPlan(clientId, network, rfpCarrier, UHCParsedPlan, tiers, persist, benefitNames, benefits, null);
    }

    public ClientPlan createOrGetClientPlan(Long clientId, Network network, RfpCarrier rfpCarrier,
            UHCNetworkDetails UHCParsedPlan, int tiers, boolean persist, 
            List<BenefitName> benefitNames, List<Benefit> benefits, List<Benefit> rxBenefits) {
        
        float tier1CurrentRate = toFloat(UHCParsedPlan.getTier1CurrentRate(), 0F);
        if (tier1CurrentRate == 0f) {
            // empty plan
            return null;
        }

        String currentPlanName = UHCParsedPlan.getCurrentPlanName() != null ? 
                UHCParsedPlan.getCurrentPlanName() : 
                UHCParsedPlan.getFullPlanName();
                
        List<ClientPlan> existingClientPlans = clientPlanRepository.findByClientClientId(clientId);
        if(isNotEmpty(existingClientPlans)){
            ClientPlan existingClientPlan = existingClientPlans.stream()
                .filter(cp -> cp.getPlanType().equals(network.getType())
                    && !isNull(cp.getPnn()) && cp.getPnn().getName().equalsIgnoreCase(currentPlanName)
                    && cp.getPnn().getNetwork().getNetworkId().equals(network.getNetworkId())
                ).findFirst()
                .orElse(null);

            if(!isNull(existingClientPlan)) {
                return existingClientPlan;
            }
        }

        // create client plan
        Plan plan = new Plan();
        plan.setPlanType(network.getType());
        plan.setName(currentPlanName);
        plan.setCarrier(rfpCarrier.getCarrier());
        if(persist) {
            plan = planRepository.save(plan);
            if (isEmpty(benefits)) {
                //add empty benefits for given plan type
                planBenefitsHelper.addPlaceHolderBenefitsToPlan(benefitNames, rfpCarrier.getCarrier(), plan);
            } else {
                // save real benefits
                for (Benefit benefit : benefits) {
                    benefit.setPlan(plan);
                    benefitRepository.save(benefit);
                }
            }
        }

        PlanNameByNetwork pnn = new PlanNameByNetwork();
        pnn.setPlan(plan);
        pnn.setNetwork(network);
        pnn.setName(currentPlanName);
        pnn.setPlanType(network.getType());
        pnn.setCustomPlan(true);
        if(persist) {
            pnn = planNameByNetworkRepository.save(pnn);
        }

        PlanNameByNetwork rxPnn = createExternalRxPlan(network, persist,
            UHCParsedPlan.getCurrentRxPlanName(), benefitNames, rxBenefits);

        ClientPlan clientPlan = new ClientPlan();

        clientPlan.setClient(clientRepository.findOne(clientId));
        clientPlan.setPnn(pnn);
        clientPlan.setRxPnn(rxPnn);
        clientPlan.setPlanType(network.getType());

        if(tiers >= 1) {
            clientPlan.setTier1Rate(tier1CurrentRate);
            clientPlan.setTier1Census(toLong(UHCParsedPlan.getTier1Census(), 0L));
        } else {
            clientPlan.setTier1Rate(0F);
            clientPlan.setTier1Census(0L); 
        }
        if(tiers >= 2){
            clientPlan.setTier2Rate(toFloat(UHCParsedPlan.getTier2CurrentRate(), 0F));
            clientPlan.setTier2Census(toLong(UHCParsedPlan.getTier2Census(), 0L));
        } else {
            clientPlan.setTier2Rate(0F);
            clientPlan.setTier2Census(0L); 
        }
        if(tiers >= 3){
            clientPlan.setTier3Rate(toFloat(UHCParsedPlan.getTier3CurrentRate(), 0F));
            clientPlan.setTier3Census(toLong(UHCParsedPlan.getTier3Census(), 0L));
        } else {
            clientPlan.setTier3Rate(0F);
            clientPlan.setTier3Census(0L); 
        }
        if(tiers >= 4){
            clientPlan.setTier4Rate(toFloat(UHCParsedPlan.getTier4CurrentRate(), 0F));
            clientPlan.setTier4Census(toLong(UHCParsedPlan.getTier4Census(), 0L));
        } else {
            clientPlan.setTier4Rate(0F);
            clientPlan.setTier4Census(0L); 
        }

        // to prevent NPE setting up default values before admin enters actual ones
        clientPlan.setTier1ErContribution(0F);
        clientPlan.setTier2ErContribution(0F);
        clientPlan.setTier3ErContribution(0F);
        clientPlan.setTier4ErContribution(0F);
        clientPlan.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_PERCENT);
        
        if(persist) {
            clientPlan = clientPlanRepository.save(clientPlan);
            sharedClientService.addClientRfpProductIfNotExist(clientId, rfpCarrier.getCategory(), false);
        }
        return clientPlan;
    }

    public PlanNameByNetwork createExternalRxPlan(Network network, boolean persist, String planName, 
            List<BenefitName> benefitNames){
        return createExternalRxPlan(network, persist, planName, benefitNames, null);
    }
    
    public PlanNameByNetwork createExternalRxPlan(Network network, boolean persist, String planName, 
            List<BenefitName> benefitNames, List<Benefit> rxBenefits){
        if(network == null || !PlanCategory.MEDICAL.getPlanTypes().contains(network.getType())) {
            // RX does not apply to Dental or Vision
            return null;
        }

        //find the Rx network
        Network rxNetwork = null;
        String rxNetworkType = "HMO".equals(network.getType()) ? "RX_HMO" : "RX_PPO";
        List<Network> rxNetworks = networkRepository.findByTypeAndCarrier(rxNetworkType, network.getCarrier());

        if(isEmpty(rxNetworks)){ // some carriers do not have RX_HMO network but have HMO network
            rxNetworkType = network.getType();
            rxNetworks = networkRepository.findByTypeAndCarrier(rxNetworkType, network.getCarrier());
        }

        if(rxNetworks.size() == 1) { 
            rxNetwork = rxNetworks.get(0);
        } else {
            // only UHC requires for correct preloaded rx networks
            if(carrierMatches(network.getCarrier().getName(), CarrierType.UHC)) {
                String errorMessage;
                if(rxNetworks.size() == 0) {
                    errorMessage = "No network found in DB for networkType=" + rxNetworkType + ", carrier=" + network.getCarrier().getName();
                } else { // many networks found
                    errorMessage = "To many networks found in DB for networkType=" + rxNetworkType + ", carrier=" + network.getCarrier().getName();
                }
                throw new BaseException(errorMessage);
            } else {
                LOGGER.warn("No RX network found in DB for networkType=" + rxNetworkType 
                    + ", carrier=" + network.getCarrier().getName() + ". Ext RX plan not created");
                return null;
            }
        }

        rxNetworkType = "HMO".equals(network.getType()) ? "RX_HMO" : "RX_PPO";
        Plan plan = new Plan();
        plan.setPlanType(rxNetworkType);
        plan.setName(planName);
        plan.setCarrier(network.getCarrier());
        if(persist) {
            plan = planRepository.save(plan);
            if (rxBenefits == null || rxBenefits.isEmpty()) {
                //add empty benefits for given plan type
                planBenefitsHelper.addPlaceHolderBenefitsToPlan(benefitNames, network.getCarrier(), plan);
            } else {
                // save real benefits
                for (Benefit benefit : rxBenefits) {
                    benefit.setPlan(plan);
                    benefitRepository.save(benefit);
                }
            }
        }

        PlanNameByNetwork pnn = new PlanNameByNetwork();
        pnn.setPlan(plan);
        pnn.setNetwork(rxNetwork);
        pnn.setName(planName);
        pnn.setPlanType(rxNetworkType);
        pnn.setCustomPlan(true);
        if(persist) {
            pnn = planNameByNetworkRepository.save(pnn);
        }

        return pnn;
    }
}
