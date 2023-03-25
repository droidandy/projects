package com.benrevo.be.modules.shared.service;

import static com.benrevo.common.util.MapBuilder.field;
import static java.lang.String.format;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import static org.apache.commons.collections4.CollectionUtils.isNotEmpty;
import static org.apache.commons.lang.StringUtils.isNotBlank;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.benrevo.be.modules.shared.service.cache.CacheKeyType;
import com.benrevo.be.modules.shared.service.cache.CacheService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.BenefitDto;
import com.benrevo.common.dto.ClientPlanDto;
import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.common.dto.NetworkDto;
import com.benrevo.common.dto.PlanInfoDto;
import com.benrevo.common.dto.PlanInfoPageContainerDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.dto.QuoteOptionAltRxDto;
import com.benrevo.common.dto.ancillary.AncillaryClassDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.dto.ancillary.VoluntaryRateDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.exception.ValidationException;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import com.benrevo.data.persistence.helper.PlanBenefitsHelper;
import com.benrevo.data.persistence.mapper.BenefitMapper;
import com.benrevo.data.persistence.mapper.ClientPlanMapper;
import com.benrevo.data.persistence.mapper.NetworkMapper;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.BenefitNameRepository;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpToAncillaryPlanRepository;
import com.google.common.base.MoreObjects;
import java.time.Year;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SharedPlanService {

    private final Set<String> rxBenefitSysNames;

    @Autowired
    private RfpToPnnRepository rfpToPnnRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    protected PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private BenefitNameRepository benefitNameRepository;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private AncillaryPlanRepository ancillaryPlanRepository;
    
    @Autowired
    private RfpToAncillaryPlanRepository rfpToAncillaryPlanRepository;

    @Autowired
    private PlanBenefitsHelper planBenefitsHelper;

    @Autowired
    private ClientRepository clientRepository;
    
    @Lazy
    @Autowired
    private CacheService cacheService;

    public static final String OPTION_1_NAME = "Option 1";
    public static final String RENEWAL_1_NAME = "Renewal 1";
    private static final String BENEFIT_DEFAULT_IN_OUT_NETWORK = "IN";

    public SharedPlanService() {
        rxBenefitSysNames = Constants.RX.stream()
            .map(r -> r.sysName)
            .collect(toSet());
    }

    public List<CreatePlanDto> getByRfpId(Long rfpId) {
        List<RfpToPnn> rfpToPnns = rfpToPnnRepository.findByRfpRfpId(rfpId);
        List<CreatePlanDto> plans = new ArrayList<>();
        rfpToPnns.forEach(rfpToPnn -> {
            CreatePlanDto dto = new CreatePlanDto();
            List<Rx> rx = new ArrayList<>();
            List<QuoteOptionAltPlanDto.Benefit> benefits = findBenefits(rfpToPnn.getPnn().getPlan().getPlanId(), rx);
            if(rfpToPnn.getPlanType().startsWith("RX_")){
                QuoteOptionAltRxDto extRx = new QuoteOptionAltRxDto();
                extRx.setName(rfpToPnn.getPnn().getName());
                // no clientPlan or RfpQuoteNetworkPlan in current place
                extRx.setRfpQuoteNetworkPlanId(null/*clientPlan.getClientPlanId()*/);
                extRx.setRx(rx);

                dto.setExtRx(extRx);
            } else {
                dto.setRx(rx);
            }
            dto.setRfpQuoteNetworkId(rfpToPnn.getPnn().getNetwork().getNetworkId());
            dto.setNameByNetwork(rfpToPnn.getPnn().getName());
            dto.setBenefits(benefits);
            dto.setCarrierId(rfpToPnn.getPnn().getNetwork().getCarrier().getCarrierId());

            String planType = rfpToPnn.getPnn().getPlanType();
            dto.setPlanType(convertToCarrierSpecificPlanType(rfpToPnn.getPnn().getNetwork().getName(), planType));
            dto.setOptionId(rfpToPnn.getOptionId());

            plans.add(dto);
        });

        return plans;
    }

    protected String convertToCarrierSpecificPlanType(String networkName, String planType){
        return planType;
    }

    public void exportInRfp(List<CreatePlanDto> dtos, Long rfpId) {
        RFP rfp = rfpRepository.findOne(rfpId);
        if (rfp == null) {
            throw new NotFoundException(String.format("RFP with id %s not found", rfpId));
        }
        for (CreatePlanDto dto : dtos) {
            Carrier carrier = carrierRepository.findByName(dto.getCarrierName());
            if (carrier == null) {
                throw new NotFoundException(String.format("Carrier with name %s not found", dto.getCarrierName()));
            }
            Network network = networkRepository.findByNameAndTypeAndCarrier(dto.getNetworkName(), dto.getNetworkType(), carrier);
            if (network == null) {
                throw new NotFoundException(String.format("Network with name %s, type %s and carrier %s not found", dto.getNetworkName(), dto.getNetworkType(), dto.getCarrierName()));
            }
            dto.setRfpQuoteNetworkId(network.getNetworkId());

            if(dto.getPlanType().startsWith("RX_") && dto.getExtRx() != null
                && isNotEmpty(dto.getExtRx().getRx())){
                dto.getRx().addAll(dto.getExtRx().getRx());
            }

            PlanNameByNetwork pnn = createAndSavePlanNameByNetwork(network.getCarrier(),
                network, dto.getNameByNetwork(), dto.getPlanType(),
                rfp.getClient().getClientId(), false, dto.getRx());

            createAndSaveBenefits(dto.getBenefits(), pnn.getPlan());

            RfpToPnn rfpToPnn = new RfpToPnn();
            rfpToPnn.setPlanType(dto.getPlanType());
            rfpToPnn.setRfp(rfp);
            rfpToPnn.setPnn(pnn);
            rfpToPnn.setOptionId(dto.getOptionId());
            rfpToPnnRepository.save(rfpToPnn);
        }
    }
    
    public void exportAncillaryInRfp(List<AncillaryPlanDto> dtos, Long rfpId) {
        RFP rfp = rfpRepository.findOne(rfpId);
        if (rfp == null) {
            throw new NotFoundException(String.format("RFP with id %s not found", rfpId));
        }
        final int currentYear = rfp.getClient().getEffectiveYear();
        
        for(AncillaryPlanDto ancPlanDto : dtos) {
            AncillaryPlan ancPlan = RfpMapper.rfpPlanDtoToRfpPlan(ancPlanDto);
            
            Carrier carrier = ancPlan.getCarrier();
            if(carrier == null) {
                carrier = carrierRepository.findByName(ancPlanDto.getCarrierName());
                if(carrier == null) {
                    throw new NotFoundException(String.format("Carrier with name %s not found", ancPlanDto.getCarrierName()));
                }
                ancPlan.setCarrier(carrier);
            }
            ancPlan = ancillaryPlanRepository.save(ancPlan);    
            
            RfpToAncillaryPlan rfpToAncillaryPlan = new RfpToAncillaryPlan();
            rfpToAncillaryPlan.setAncillaryPlan(ancPlan);
            rfpToAncillaryPlan.setRfp(rfp);
            rfpToAncillaryPlanRepository.save(rfpToAncillaryPlan);

            // FIXME 1:1 product:planType mapping. See the com.benrevo.common.enums.PlanCategory
            String planType = rfp.getProduct();
            if(!PlanCategory.valueOf(rfp.getProduct()).getPlanTypes().contains(planType)) {
                throw new BaseException("Unable to create ancillary plan with product type: " + rfp.getProduct());
            }
            List<Network> networks = networkRepository.findByTypeAndCarrier(planType, carrier);
            if(networks.isEmpty() || networks.size() != 1) {
                throw new BaseException(String.format("Unique network with type %s and carrier %s not found", 
                    planType, carrier.getDisplayName()));
            }
            // not need search by customFlag: pnn for ancillary - is a fake (contains only plan name)
            int planYear = MoreObjects.firstNonNull(ancPlanDto.getPlanYear(), currentYear);
            List<PlanNameByNetwork> pnns = planNameByNetworkRepository.findByNetworkAndNameAndPlanTypeAndPlanPlanYear(
                networks.get(0), ancPlan.getPlanName(), planType, planYear);
            if(pnns.isEmpty()) {
                createAndSavePlanNameByNetwork(carrier, networks.get(0), ancPlan.getPlanName(), planType, 
                    // fake pnn, so set clientId = null
                    null, false, Collections.emptyList());
                // cannot save pnn to rfpTopnn table (missing optionId)
            }
        }
    }
    public PlanNameByNetwork createAndSavePlanNameByNetwork(Carrier carrier, Network network,
            String planName, String planType, Long clientId, boolean custom, List<Rx> rxs) {

        Integer planYear = Year.now().getValue();
        if(clientId != null){
            Client client = clientRepository.findOne(clientId);
            if(client == null){
                throw new BaseException("Client not found").withFields(field("client_id", clientId));
            }
            planYear = client.getEffectiveYear();
        }

    	return createAndSavePlanNameByNetwork(carrier, network, planName, planType, planYear, clientId, custom, rxs);
    }
    
    public PlanNameByNetwork createAndSavePlanNameByNetwork(Carrier carrier, Network network,
        String planName, String planType, int planYear, Long clientId, boolean custom, List<Rx> rxs) {
        Plan plan = new Plan();
        plan.setPlanType(planType);
        plan.setCarrier(carrier);
        plan.setName(planName);
        plan.setPlanYear(planYear);
        plan = planRepository.save(plan);

        PlanNameByNetwork pnn = new PlanNameByNetwork();
        pnn.setPlan(plan);
        pnn.setNetwork(network);
        pnn.setName(planName);
        pnn.setPlanType(planType);
        pnn.setCustomPlan(custom);
        pnn.setClientId(clientId);
        pnn = planNameByNetworkRepository.save(pnn);

        createAndSaveRx(rxs, pnn.getPlan());

        return pnn;
    }

    public void createAndSaveBenefits(List<QuoteOptionAltPlanDto.Benefit> benefits, Plan plan) {
        for(QuoteOptionAltPlanDto.Benefit ben : benefits) {
            BenefitName benefitName = benefitNameRepository.findByName(ben.sysName);

            if(benefitName == null) {
                throw new NotFoundException("Benefit name not found")
                    .withFields(
                        field("sys_name", ben.sysName)
                    );
            }

            Benefit benefit = createBenefit(plan, benefitName, "IN", ben.restriction);
            if(ben.value != null) {
                benefit.setValue(ben.value);
                benefitRepository.save(benefit);
            } else if(ben.valueIn != null) {
                benefit.setValue(ben.valueIn);
                benefitRepository.save(benefit);

                if(ben.valueOut == null){
                    Benefit outBenefit = createBenefit(plan, benefitName, "OUT", ben.restriction);
                    outBenefit.setValue("");
                    benefitRepository.save(outBenefit);
                }
            }

            if(ben.valueOut != null) {
                Benefit outBenefit = createBenefit(plan, benefitName, "OUT", ben.restriction);
                outBenefit.setValue(ben.valueOut);
                if(ben.value == null && ben.valueIn == null) {
                    benefit.setValue("");
                    benefitRepository.save(benefit);
                }

                benefitRepository.save(outBenefit);
            }
        }
    }

    public Benefit createAndSaveBenefit(String sysName, String format, String value, String restriction, String inOut, Plan plan) {
        BenefitName rxBenefitName = benefitNameRepository.findByName(sysName);

        if(rxBenefitName == null) {
            throw new BadRequestException("Could not find benefit name")
                .withFields(
                    field("sys_name", sysName)
                );
        }
        Benefit rxBenefit = new Benefit();
        rxBenefit.setPlan(plan);
        rxBenefit.setValue(value);
        rxBenefit.setRestriction(restriction);
        rxBenefit.setInOutNetwork(inOut);
        rxBenefit.setBenefitName(rxBenefitName);
        return benefitRepository.save(rxBenefit);
    }

    private void createAndSaveRx(List<Rx> rxs, Plan plan) {
        for(Rx rx : rxs) {
            if(!rxBenefitSysNames.contains(rx.sysName)) {
                continue;
            }
            createAndSaveBenefit(rx.sysName, rx.type, rx.value, null, BENEFIT_DEFAULT_IN_OUT_NETWORK, plan);
        }
    }
    
    public List<QuoteOptionAltPlanDto.Benefit> findBenefits(Long planId, List<Rx> rx) {
        Set<String> rxBenefits = Constants.RX.stream()
            .map(r -> r.sysName)
            .collect(toSet());

        List<QuoteOptionAltPlanDto.Benefit> benefits = new ArrayList<>();
        List<Benefit> planBenefits = benefitRepository.findByPlanId(planId);

        // ordered map and ordered List value
        TreeMap<Integer, List<Benefit>> nameIdIndex = planBenefits.stream()
            .sequential()
            .collect(
                groupingBy(
                    b -> b.getBenefitName().getOrdinal(),
                    TreeMap::new,
                    toList()
                )
            );

        nameIdIndex.forEach(
            (k, v) -> {
                QuoteOptionAltPlanDto.Benefit b = new QuoteOptionAltPlanDto.Benefit();
                Benefit planBenefit = v.get(0);

                if(rxBenefits.contains(planBenefit.getBenefitName().getName())) {
                    Rx rxBenefit = new Rx(
                        planBenefit.getBenefitName().getName(),
                        planBenefit.getBenefitName().getDisplayName(),
                        planBenefit.getValue(),
                        planBenefit.getFormat());

                    rx.add(rxBenefit);
                } else {
                    b.name = planBenefit.getBenefitName().getDisplayName();
                    b.sysName = planBenefit.getBenefitName().getName();
                    b.ordinal = planBenefit.getBenefitName().getOrdinal();
                    b.restriction = planBenefit.getRestriction();
                    if(v.size() > 1) {
                        b.valueIn = planBenefit.getValue();
                        b.valueOut = v.get(1).getValue();
                        b.typeIn = planBenefit.getFormat();
                        b.typeOut = v.get(1).getFormat();
                    } else {
                        b.type = planBenefit.getFormat();
                        b.value = planBenefit.getValue();
                    }

                    benefits.add(b);
                }
            }
        );

        return benefits;
    }

    /* TODO: to prevent "foreign key constraint fails" error:
       * 1) delete rfp_quote_option_network linked to client plan
       * 2) delete client plans:
       * List<ClientPlan> clientPlanList = clientPlanRepository.findByClientClientId(client.getClientId());
       * and after that we can ...
   */
    public void deleteByRfpId(Client client, Long rfpId) {

        if ((client.getClientState() != null) && (!ClientState.RFP_STARTED.equals(client.getClientState()))) {
            throw new BaseException("Client has passed RFP_STARTED state="+client.getClientState());
        }
        List<RfpToPnn> list = rfpToPnnRepository.findByRfpRfpId(rfpId);
        list.forEach(rfpToPnn -> {
            Long pnnId = rfpToPnn.getPnn().getPnnId();
            Long planId = rfpToPnn.getPnn().getPlan().getPlanId();
            List<Benefit> benefits = benefitRepository.findByPlanId(planId);

            benefitRepository.delete(benefits);
            rfpToPnnRepository.delete(rfpToPnn.getId());
            planNameByNetworkRepository.delete(pnnId);
            planRepository.delete(planId);
        });
    }

    public ClientPlan updateClientPlan(ClientPlan old){
        ClientPlan current = clientPlanRepository.findClientPlan(old.getClientPlanId());

        if(current == null) {
            throw new NotFoundException("Client plan not found")
                    .withFields(
                            field("client_plan_id", old.getClientPlanId())
                    );
        }

        if(old.getPnn() != null){
            current.setPnn(old.getPnn());
        }
        if(old.getPlanType() != null){
            current.setPlanType(old.getPlanType());
        }

        /* Update Tier Census */

        if(old.getTier1Census() != null){
            current.setTier1Census(old.getTier1Census());
        }
        if(old.getTier2Census() != null){
            current.setTier2Census(old.getTier2Census());
        }
        if(old.getTier3Census() != null){
            current.setTier3Census(old.getTier3Census());
        }
        if(old.getTier4Census() != null){
            current.setTier4Census(old.getTier4Census());
        }

        /* Update Tier Rate */

        if(old.getTier1Rate() != null){
            current.setTier1Rate((old.getTier1Rate()));
        }
        if(old.getTier2Rate() != null){
            current.setTier2Rate((old.getTier2Rate()));
        }
        if(old.getTier3Rate() != null){
            current.setTier3Rate((old.getTier3Rate()));
        }
        if(old.getTier4Rate() != null){
            current.setTier4Rate((old.getTier4Rate()));
        }

        /* Update Tier Renewal */

        if(old.getTier1Renewal() != null){
            current.setTier1Renewal(old.getTier1Renewal());
        }
        if(old.getTier2Renewal() != null){
            current.setTier2Renewal(old.getTier2Renewal());
        }
        if(old.getTier3Renewal() != null){
            current.setTier3Renewal(old.getTier3Renewal());
        }
        if(old.getTier4Renewal() != null){
            current.setTier4Renewal(old.getTier4Renewal());
        }

        /* Update Tier Contribution */

        if(old.getErContributionFormat() != null){
            current.setErContributionFormat(old.getErContributionFormat());
        }
        if(old.getTier1ErContribution() != null){
            current.setTier1ErContribution(old.getTier1ErContribution());
        }
        if(old.getTier2ErContribution() != null){
            current.setTier2ErContribution(old.getTier2ErContribution());
        }
        if(old.getTier3ErContribution() != null){
            current.setTier3ErContribution(old.getTier3ErContribution());
        }
        if(old.getTier4ErContribution() != null){
            current.setTier4ErContribution(old.getTier4ErContribution());
        }

        current.setOutOfState(old.isOutOfState());
        clientPlanRepository.save(current);
        return current;
    }
    
    public List<ClientPlanDto> createOrUpdatePlanReferences(List<Long> clientPlanIds, CreatePlanDto planParams) {
        List<ClientPlanDto> result = new ArrayList<>();

        clientPlanIds.forEach(id -> {
            result.add(createOrUpdatePlanReferences(id, planParams));
        });

        return result;
    }

    public ClientPlanDto createOrUpdatePlanReferences(Long clientPlanId, CreatePlanDto planParams) {
        ClientPlan clientPlan = clientPlanRepository.findClientPlan(clientPlanId);
        if(clientPlan == null) {
            throw new NotFoundException(format("ClientPlan not found; client_plan_id=%s", clientPlanId));
        }

        defaultMissingBenefits(planParams, networkRepository.findOne(planParams.getRfpQuoteNetworkId()));

        PlanNameByNetwork pnn;
        planParams.setClientId(clientPlan.getClient().getClientId());
        if(clientPlan.getPnn() == null) {
            pnn = createPnn(planParams, false);
        } else {
            pnn = updatePnn(planParams, clientPlan.getPnn());
        }
        clientPlan.setPnn(pnn);
        
        // only main plan has name, it will be returned 
        String planName = clientPlan.getPnn().getName();

        // if(!equalsAny(ANTHEM_BLUE_CROSS.name(), appCarrier)){
        if(planParams.getExtRx() != null) {
            PlanNameByNetwork rxPnn;
            if(clientPlan.getRxPnn() == null) {
                rxPnn = createRxPnn(planParams, false);
            } else {
                rxPnn = updateRxPnn(planParams, clientPlan.getRxPnn());
            }
            clientPlan.setRxPnn(rxPnn);
        }
        
        clientPlan = clientPlanRepository.save(clientPlan);
        ClientPlanDto clientPlanDto = ClientPlanMapper.toDto(clientPlan);
        clientPlanDto.setPlanName(planName);

        return clientPlanDto;
    }
    
    public PlanNameByNetwork updatePnn(CreatePlanDto createPlanDto, PlanNameByNetwork pnn) {
        // NOTE! planParams.rfpQuoteNetworkId contains !networkId!
        Network network = networkRepository.findOne(createPlanDto.getRfpQuoteNetworkId());
        if(network == null) {
            throw new NotFoundException(format("Network not found; networkId=%s", createPlanDto.getRfpQuoteNetworkId()));
        }

        if(!StringUtils.equals(pnn.getName(), createPlanDto.getNameByNetwork())) {
            pnn.setName(createPlanDto.getNameByNetwork());
            pnn = planNameByNetworkRepository.save(pnn);
        }

        if(!pnn.getNetwork().getNetworkId().equals(network.getNetworkId()) ){
            pnn.setNetwork(network);
            pnn = planNameByNetworkRepository.save(pnn);
        }

        updateBenefits(createPlanDto, pnn);
        return pnn;
    }

    public void updateBenefits(CreatePlanDto createPlanDto, PlanNameByNetwork pnn) {

        List<Benefit> benefits = benefitRepository.findByPlanId(pnn.getPlan().getPlanId());
        Map<Pair<String, String>, Benefit> benefitMap = benefits.stream().collect(Collectors.toMap(
                benefit -> Pair.of(benefit.getBenefitName().getName(), benefit.getInOutNetwork()),
                benefit -> benefit
        ));
        
        updateRx(createPlanDto.getRx(), benefitMap, pnn.getPlan());
        
        for (QuoteOptionAltPlanDto.Benefit benefit : createPlanDto.getBenefits()) {
            String inOut = null;
            String value = null;
            String format = null;
            String restriction = benefit.restriction;
            if(benefit.value != null) {
                inOut = "IN";
                value = benefit.value;
                format = benefit.type;
            } else if(benefit.valueIn != null) {
                inOut = "IN";
                value = benefit.valueIn;
                format = benefit.typeIn;
            }
            if(inOut != null) {
                updateBenefit(benefitMap, benefit.sysName, inOut, format, value, restriction, pnn.getPlan());
            }

            if(benefit.valueOut != null) {
                inOut = "OUT";
                value = benefit.valueOut;
                format = benefit.typeOut;
                updateBenefit(benefitMap, benefit.sysName, inOut, format, value, restriction, pnn.getPlan());
            }
        }
    }
    
    public PlanNameByNetwork updateRxPnn(CreatePlanDto createPlanDto, PlanNameByNetwork rxPnn) {
        QuoteOptionAltRxDto extRx = createPlanDto.getExtRx();
        if(extRx == null) {
            throw new ValidationException("Cannot create rx plan from null object");
        }
        // NOTE! planParams.rfpQuoteNetworkId contains !networkId!
        Network network = networkRepository.findOne(createPlanDto.getRfpQuoteNetworkId());
        if(network == null) {
            throw new NotFoundException(format("Network not found; networkId=%s", createPlanDto.getRfpQuoteNetworkId()));
        }
        
        String rxPlanName = isNotBlank(extRx.getName()) ? extRx.getName() : createPlanDto.getNameByNetwork();
        if (!StringUtils.equals(rxPnn.getName(), rxPlanName)) {
            rxPnn.setName(extRx.getName());
            rxPnn = planNameByNetworkRepository.save(rxPnn);
            // TODO need to update pnn.network?
        }

        if(!rxPnn.getNetwork().getNetworkId().equals(network.getNetworkId()) ){
            rxPnn.setNetwork(network);
            rxPnn = planNameByNetworkRepository.save(rxPnn);
        }

        List<Benefit> benefits = benefitRepository.findByPlanId(rxPnn.getPlan().getPlanId());
        Map<Pair<String, String>, Benefit> benefitMap = benefits.stream().collect(Collectors.toMap(
                benefit -> Pair.of(benefit.getBenefitName().getName(), benefit.getInOutNetwork()),
                benefit -> benefit
        ));
        updateRx(extRx.getRx(), benefitMap, rxPnn.getPlan());
        return rxPnn;
    }

    public void updateRx(List<Rx> rxs, Map<Pair<String, String>, Benefit> benefitMap, Plan plan) {
        if (rxs != null) {
            rxs.forEach(rx -> {
                if(rxBenefitSysNames.contains(rx.sysName)) {
                    updateBenefit(benefitMap, rx.sysName, BENEFIT_DEFAULT_IN_OUT_NETWORK, rx.type, rx.value, null, plan);
                }
            });
        }
    }


    public void updateBenefit(Map<Pair<String, String>, Benefit> benefitMap, String sysName, String inOut, String format, String value, String restriction, Plan plan) {
        if (benefitMap.containsKey(Pair.of(sysName, inOut))) {
            Benefit ben = benefitMap.get(Pair.of(sysName, inOut));
            if (!Objects.equals(ben.getFormat(), format) ||
                    !Objects.equals(ben.getValue(), value) ||
                    !Objects.equals(ben.getRestriction(), restriction)) {
                ben.setValue(value);
                ben.setRestriction(restriction);
                benefitRepository.save(ben);
            }
        } else {
            createAndSaveBenefit(sysName, format, value, restriction, inOut, plan);
        }
    }

    
    public PlanNameByNetwork createPnn(CreatePlanDto planParams, boolean customPlan) {
        if(planParams == null) {
            throw new ValidationException("Cannot create plan from null object");
        }
        // NOTE! planParams.rfpQuoteNetworkId contains !networkId!
        Network network = networkRepository.findOne(planParams.getRfpQuoteNetworkId());
        
        if(network == null) {
            throw new NotFoundException(
                format("Network not found; networkId=%s", planParams.getRfpQuoteNetworkId())
            );
        }
        
        PlanNameByNetwork pnn = createPlanNameByNetwork(network, planParams.getNameByNetwork(), 
                network.getType(), planParams.getClientId(), customPlan, planParams.getRx());

        for(QuoteOptionAltPlanDto.Benefit ben : planParams.getBenefits()) {
            createAndSaveBenefit(ben, pnn);
        }

        return pnn;
    }

    public void defaultMissingBenefits(CreatePlanDto planParams, Network network){

        // NOTE! planParams.rfpQuoteNetworkId contains !networkId!
        if(network == null) {
            throw new NotFoundException(
                format("Network not found; networkId=%s", planParams.getRfpQuoteNetworkId())
            );
        }

        String networkType = network.getType();
        String rxNetworkType = "RX_" + networkType;

        Map<String, List<QuoteOptionAltPlanDto.Benefit>> benefitsByPlanType = planBenefitsHelper.getDefaultBenefitNames(true);
        List<QuoteOptionAltPlanDto.Benefit> defaultBenefits = benefitsByPlanType.get(networkType);
        if(benefitsByPlanType.containsKey(rxNetworkType)) {
            defaultBenefits.addAll(benefitsByPlanType.get(rxNetworkType));
        }
        HashMap<String, QuoteOptionAltPlanDto.Benefit> benefitHashMap = new HashMap<>();
        for(QuoteOptionAltPlanDto.Benefit b : defaultBenefits){
            benefitHashMap.put(b.sysName, b);
        }

        if(!CollectionUtils.isEmpty(planParams.getBenefits())) {
            List<QuoteOptionAltPlanDto.Benefit> newBenefits = new ArrayList<>();
            for (QuoteOptionAltPlanDto.Benefit ben : planParams.getBenefits()) {
                if (Stream.of(ben.value, ben.valueIn, ben.valueOut).allMatch(x -> x == null)
                    && benefitHashMap.containsKey(ben.sysName)) {
                    newBenefits.add(benefitHashMap.get(ben.sysName));
                } else {
                    newBenefits.add(ben);
                }
            }
            planParams.setBenefits(newBenefits);
        }

        if(!CollectionUtils.isEmpty(planParams.getRx())) {
            List<Rx> newRx = new ArrayList<>();
            for (Rx rx : planParams.getRx()) {
                if (rx.value == null && benefitHashMap.containsKey(rx.sysName)) {
                    QuoteOptionAltPlanDto.Benefit b2 = benefitHashMap.get(rx.sysName);
                    newRx.add(new Rx(b2.sysName, b2.name, b2.value, b2.type));
                } else {
                    newRx.add(rx);
                }
            }
            planParams.setRx(newRx);
        }

        if(planParams.getExtRx() != null && planParams.getExtRx().getRx() != null) {
            List<Rx> newExtRx = new ArrayList<>();
            for (Rx rx : planParams.getExtRx().getRx()) {
                if (rx.value == null && benefitHashMap.containsKey(rx.sysName)) {
                    QuoteOptionAltPlanDto.Benefit b2 = benefitHashMap.get(rx.sysName);
                    newExtRx.add(new Rx(b2.sysName, b2.name, b2.value, b2.type));
                } else {
                    newExtRx.add(rx);
                }
            }
            planParams.getExtRx().setRx(newExtRx);
        }
    }
    
    @Deprecated // use createAndSavePlanNameByNetwork()
    public PlanNameByNetwork createPlanNameByNetwork(Network network, String planName,
        String planType, Long clientId, boolean customPlan, List<Rx> rxs) {
    	return createAndSavePlanNameByNetwork(network.getCarrier(), network, planName, planType, clientId, customPlan, rxs);
    }
    
    public void createAndSaveBenefit(QuoteOptionAltPlanDto.Benefit ben, PlanNameByNetwork pnn) {
        BenefitName benefitName = benefitNameRepository.findByName(ben.sysName);

        if(benefitName == null) {
            throw new NotFoundException("Benefit name not found")
                    .withFields(
                            field("sys_name", ben.sysName)
                    );
        }

        Benefit benefit = createBenefit(pnn.getPlan(), benefitName, "IN", ben.restriction);
        if(ben.value != null) {
            benefit.setValue(ben.value);
            benefitRepository.save(benefit);
        } else if(ben.valueIn != null) {
            benefit.setValue(ben.valueIn);
            benefitRepository.save(benefit);

            if(ben.valueOut == null){
                Benefit outBenefit = createBenefit(pnn.getPlan(), benefitName, "OUT", ben.restriction);
                outBenefit.setValue("");
                benefitRepository.save(outBenefit);
            }
        }

        if(ben.valueOut != null) {
            Benefit outBenefit = createBenefit(pnn.getPlan(), benefitName, "OUT", ben.restriction);
            outBenefit.setValue(ben.valueOut);
            if(ben.value == null && ben.valueIn == null) {
                benefit.setValue("");
                benefitRepository.save(benefit);
            }

            benefitRepository.save(outBenefit);
        }
    }

    private Benefit createBenefit(Plan plan, BenefitName benefitName, String inOut, String restriction){
        Benefit benefit = new Benefit();
        benefit.setPlan(plan);
        benefit.setBenefitName(benefitName);
        benefit.setInOutNetwork(inOut);
        benefit.setRestriction(restriction);
        return benefit;
    }
    
    public PlanNameByNetwork createRxPnn(CreatePlanDto planParams, boolean customPlan) {
        if(planParams == null) {
            throw new ValidationException("Cannot create plan from null object");
        }
        QuoteOptionAltRxDto extRx = planParams.getExtRx();
        if(extRx == null) {
            throw new ValidationException("Cannot create rx plan from null object");
        }
        // NOTE! planParams.rfpQuoteNetworkId contains !networkId!
        Network network = networkRepository.findOne(planParams.getRfpQuoteNetworkId());
        
        if(network == null) {
            throw new NotFoundException(
                format("Network not found; networkId=%s", planParams.getRfpQuoteNetworkId())
            );
        }
        String rxNetworkType = "RX_" + network.getType();
        String rxPlanName = isNotBlank(extRx.getName()) ? extRx.getName() : planParams.getNameByNetwork();
        PlanNameByNetwork rxPnn = createPlanNameByNetwork(network, rxPlanName, rxNetworkType,
            planParams.getClientId(),customPlan, extRx.getRx());
        
        return rxPnn;
    }
    
    public List<ClientPlanDto> getPlansByClientId(Long clientId, String product) {
        List<ClientPlan> clientPlanList;
        if(product != null) {
            PlanCategory category = PlanCategory.valueOf(product);
            clientPlanList = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(clientId, category.getPlanTypes());
        } else {
            clientPlanList = clientPlanRepository.findByClientClientId(clientId); 
        }
        List<ClientPlanDto> result = new ArrayList<ClientPlanDto>();
        if(clientPlanList == null) {
            return result;
        }

        clientPlanList.forEach(clientPlan -> {
            ClientPlanDto x = mapToDto(clientPlan);
            result.add(x);
        });

        return result;
    }

    public ClientPlanDto mapToDto(ClientPlan clientPlan) {
        ClientPlanDto x = ClientPlanMapper.toDto(clientPlan);
        if(clientPlan.getPnn() != null){
            x.setPlanName(clientPlan.getPnn().getName());
            x.setPlanType(x.getPlanType() == null ? clientPlan.getPnn().getPlanType() : x.getPlanType());
            x.setIsKaiser((clientPlan.getPnn().getNetwork().getCarrier().getName().equals(Constants.KAISER_CARRIER)) ? true : false);
            x.setCarrierName(clientPlan.getPnn().getPlan().getCarrier().getName());
        }else if(clientPlan.getRxPnn() != null){
            x.setPlanName(clientPlan.getRxPnn().getName());
            x.setPlanType(x.getPlanType() == null ? clientPlan.getRxPnn().getPlanType() : x.getPlanType());
            x.setCarrierName(clientPlan.getRxPnn().getPlan().getCarrier().getName());
        }
        return x;
    }

    public CreatePlanDto getPlans(Long clientPlanId){
        ClientPlan clientPlan = clientPlanRepository.findClientPlan(clientPlanId);
        if(clientPlan == null) {
            throw new NotFoundException(format("ClientPlan not found; client_plan_id=%s", clientPlanId));
        }

        if(clientPlan.getPnn() == null && clientPlan.getRxPnn() == null){
            return null;
        }
        CreatePlanDto createPlanDto = new CreatePlanDto();

        if(clientPlan.getPnn() != null){
            PlanNameByNetwork pnn = planNameByNetworkRepository.findOne(clientPlan.getPnn().getPnnId());

            createPlanDto.setRfpQuoteNetworkId(pnn.getNetwork().getNetworkId());
            createPlanDto.setCarrierId(pnn.getNetwork().getCarrier().getCarrierId());
            createPlanDto.setCarrierName(pnn.getNetwork().getCarrier().getName());
            createPlanDto.setCarrierDisplayName(pnn.getNetwork().getCarrier().getDisplayName());
            createPlanDto.setRfpQuoteNetworkPlanId(clientPlan.getClientPlanId());
            createPlanDto.setNameByNetwork(pnn.getName());

            List<Rx> rx = new ArrayList<>();
            List<QuoteOptionAltPlanDto.Benefit> benefits = findBenefits(pnn.getPlan().getPlanId(), rx);

            createPlanDto.setBenefits(benefits);

            // TODO: Move to carrier specific class
            // if(equalsAny(ANTHEM_BLUE_CROSS.name(), appCarrier)){
                // createPlanDto.setRx(rx);
            //}
            // fixed: if plan has rx benefits, they should be returned without appCarrier check
            createPlanDto.setRx(rx);
        }

        if(clientPlan.getRxPnn() != null){
            PlanNameByNetwork rxPnn = planNameByNetworkRepository.findOne(clientPlan.getRxPnn().getPnnId());
            List<Rx> rx = new ArrayList<>();
            List<QuoteOptionAltPlanDto.Benefit> benefits = findBenefits(rxPnn.getPlan().getPlanId(), rx);

            QuoteOptionAltRxDto extRx = new QuoteOptionAltRxDto();
            extRx.setName(rxPnn.getName());
            extRx.setRfpQuoteNetworkPlanId(clientPlan.getClientPlanId());
            extRx.setRx(rx);

            createPlanDto.setExtRx(extRx);
        }
        return createPlanDto;
    }

    /**
     * Provides a listing of <i>all</i> available plans for a given {@link CarrierType}
     *
     * @param carrier
     *     {@link CarrierType} or carrier used to lookup all plans
     * @param pr
     *     {@link PageRequest} which defines the page to fetch and size of the page
     * @param py
     *     plan year to filter on (optional)
     * @param pt
     *     plan type (hmo, ppo, etc)
     * @return
     *     List of plans for given carrier
     */
    public PlanInfoPageContainerDto getAllPlans(CarrierType carrier, Integer py, String pt, PageRequest pr) {
        PlanInfoPageContainerDto result = new PlanInfoPageContainerDto();

        if(carrier != null) {
            Carrier c = carrierRepository.findByNameIgnoreCase(carrier.name());
            Page<PlanNameByNetwork> ps;

            if(isNotBlank(pt) && PlanCategory.findByPlanType(pt) != null) {
                ps = planNameByNetworkRepository.findAllByCarrierAndPlanYearAndPlanTypeNonCustom(c, py, pt, pr);
            } else {
                ps = planNameByNetworkRepository.findAllByCarrierAndPlanYearNonCustom(c, py, pr);
            }

            if(ps != null) {
                result.setTotalElements(ps.getTotalElements());
                result.setTotalPages(ps.getTotalPages());
                result.setCurrentElements(ps.getNumberOfElements());

                if(ps.getContent() != null) {
                    ps.getContent().forEach(pi -> {
                        if(pi.getPlan() != null && pi.getNetwork() != null) {
                            Plan p = pi.getPlan();
                            NetworkDto network = NetworkMapper.toDto(pi.getNetwork());
                            List<BenefitDto> benefits = BenefitMapper.toDto(benefitRepository.findByPlanId(pi.getPlan().getPlanId()));

                            result.getPlans().add(
                                new PlanInfoDto.Builder()
                                    .withPlanId(p.getPlanId())
                                    .withPlanName(p.getName())
                                    .withPlanNetwork(network)
                                    .withPlanYear(p.getPlanYear())
                                    .withPlanBenefits(benefits)
                                    .withPlanType(p.getPlanType())
                                    .withPlanCreated(p.getCreated())
                                    .withPlanUpdated(p.getUpdated())
                                    .build()
                            );
                        }
                    });
                }
            }
        }

        return result;
    }

    /**
     * Get all plan types by carrier
     *
     * @param carrier
     * @return
     *     Set of plan types (String)
     */
    public Set<String> getAllPlanTypes(CarrierType carrier) {
        Set<String> result = new HashSet<>();

        if(carrier != null) {
            Carrier c = carrierRepository.findByNameIgnoreCase(carrier.name());
            Set<String> ps = planNameByNetworkRepository.findAllPlanTypesByCarrier(c);

            if(ps != null) {
                result.addAll(ps);
            }
        }

        return result;
    }

    public List<ClientPlanDto> updateClientPlans(List<ClientPlanDto> clientPlanDtos){
        List<ClientPlanDto> resultPlans = new ArrayList<>();
        List<ClientPlan> clientPlansToInvalidateCache = new ArrayList<>();

        if(clientPlanDtos == null){
            return resultPlans;
        }

        for(ClientPlanDto clientPlanDto : clientPlanDtos){
            if(clientPlanDto.getErContributionFormat() == null || clientPlanDto.getErContributionFormat().isEmpty()){
                ClientPlan current = clientPlanRepository.findClientPlan(clientPlanDto.getClientPlanId());
                if(current == null) {
                    throw new NotFoundException("Client plan not found")
                            .withFields(
                                    field("client_plan_id", clientPlanDto.getClientPlanId())
                            );
                }
                clientPlanDto.setErContributionFormat(current.getErContributionFormat());
            }
            ClientPlan clientPlan = updateClientPlan(ClientPlanMapper.toEntity(clientPlanDto));
            resultPlans.add(ClientPlanMapper.toDto(clientPlan));
            clientPlansToInvalidateCache.add(clientPlan);

        }

        invalidateCachedRfpQuoteOption(clientPlansToInvalidateCache);
        return resultPlans;
    }

    public void invalidateCachedRfpQuoteOption(ClientPlan clientPlan) {
        invalidateCachedRfpQuoteOption(Collections.singletonList(clientPlan));
    }

    public void invalidateCachedRfpQuoteOption(Collection<ClientPlan> clientPlans) {
        Set<Long> clientIds = clientPlans.stream().map(cp -> cp.getClient().getClientId())
                .collect(Collectors.toSet());
        for(Long clientId : clientIds) {
            List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientId(clientId);
            for(RfpQuoteOption opt : options) {
                if(StringUtils.equalsAny(opt.getRfpQuoteOptionName(), OPTION_1_NAME, RENEWAL_1_NAME)) {
                    cacheService.hdel(CacheKeyType.RFP_QUOTE_OPTION.getKeyPrefix(), opt.getRfpQuoteOptionId().toString());
                } 
            }
        }
    }

    protected Network findNetworkUsingCarrierSpecifically(Long carrierId, String planType) {
        return null;
    }
    
    public AncillaryPlanDto createAncillaryPlan(Long clientId, AncillaryPlanDto planParams) {
        
    	validateAncillaryPlan(planParams);
    	
        if(planParams.getAncillaryPlanId() != null) {
            throw new ValidationException("Plan already exists");
        }
    	for (AncillaryClassDto cl : planParams.getClasses()) {
    		if(cl.getAncillaryClassId() != null) {
                throw new ValidationException("Class already exists: " + cl.getAncillaryClassId());
            }	
		}
        if(planParams.getRates().getAncillaryRateId() != null) {
            throw new ValidationException("Rate already exists: " + planParams.getRates().getAncillaryRateId());
        }

        if(clientId != null){
            Client client = clientRepository.findOne(clientId);
            if (client == null) {
                throw new NotFoundException("Client not found").withFields(field("client_id", clientId));
            }

            if (planParams.getPlanYear() == null || planParams.getPlanYear() == 0) {
                planParams.setPlanYear(client.getEffectiveYear());
            }
        }

        AncillaryPlan ancPlan = RfpMapper.rfpPlanDtoToRfpPlan(planParams);
        ancillaryPlanRepository.save(ancPlan);

        return getAncillaryPlan(ancPlan.getAncillaryPlanId());
    }
    
    public AncillaryPlanDto updateAncillaryPlan(Long clientId, AncillaryPlanDto planParams) {
        
    	validateAncillaryPlan(planParams);
    		 
    	if(planParams.getAncillaryPlanId() == null || !ancillaryPlanRepository.exists(planParams.getAncillaryPlanId())) {
            throw new ValidationException("Cannot find plan by id: " + planParams.getAncillaryPlanId());
        }

        if(clientRepository.findOne(clientId) == null){
            throw new BaseException("Client not found").withFields(field("client_id", clientId));
        }

        AncillaryPlan ancPlan = RfpMapper.rfpPlanDtoToRfpPlan(planParams);
        ancillaryPlanRepository.save(ancPlan);

        return getAncillaryPlan(ancPlan.getAncillaryPlanId());
    }

    public AncillaryPlanDto getAncillaryPlan(Long ancillaryPlanId) {

        AncillaryPlan ancPlan = ancillaryPlanRepository.findOne(ancillaryPlanId);
        
        if(ancPlan == null) {
            throw new NotFoundException("AncillaryPlan not found by id: " + ancillaryPlanId);
        }
        AncillaryPlanDto result = RfpMapper.rfpPlanToRfpPlanDto(ancPlan);
        return result;
    }
    
	private void validateAncillaryPlan(AncillaryPlanDto planParams) {
		if (planParams.getCarrierId() == null) {
			throw new ValidationException("Missing required param: carrierId");
		}
		if (isEmpty(planParams.getPlanName())) {
			throw new ValidationException("Missing required param: planName");
		}
		if (planParams.getPlanType() == null) {
			throw new ValidationException("Missing required param: planType");
		}
		if (CollectionUtils.isEmpty(planParams.getClasses())) {
			throw new ValidationException("Missing required param: classes");
		}
		if (planParams.getRates() == null) {
			throw new ValidationException("Missing required param: rates");
		} else if (planParams.getRates() instanceof VoluntaryRateDto) {
			VoluntaryRateDto vr = (VoluntaryRateDto) planParams.getRates();
			if (CollectionUtils.isEmpty(vr.getAges())) {
				throw new ValidationException("Missing required param: rates.ages");
			}
		}	
	}
}
