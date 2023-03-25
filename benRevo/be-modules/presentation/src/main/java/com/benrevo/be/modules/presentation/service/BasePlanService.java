package com.benrevo.be.modules.presentation.service;

import com.benrevo.be.modules.shared.service.DocumentFileService;
import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.*;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Cost;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.dto.ancillary.AncillaryClassDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryPlanDto;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.exception.ValidationException;
import com.benrevo.common.util.StringHelper;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.ancillary.AncillaryClass;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.helper.PlanBenefitsHelper;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.*;
import com.benrevo.data.persistence.repository.ancillary.AncillaryClassRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryPlanRepository;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import javax.xml.bind.annotation.XmlTransient;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.util.MapBuilder.field;
import static java.lang.String.format;
import static java.util.Objects.isNull;
import static java.util.stream.Collectors.toSet;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.equalsAny;
import static org.apache.commons.lang3.StringUtils.isEmpty;

/**
 * TODO: There are probably tons of NPEs we need to check for in here...
 */
@Service
@Transactional
public class BasePlanService {

    private final Set<String> rxBenefitSysNames;
    
    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private RfpQuoteService rfpQuoteService;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;
    
    @Autowired
    private DocumentFileService documentService;
    
    @Autowired
    private SharedPlanService sharedPlanService;
    
    @Autowired
    private RfpQuoteAncillaryPlanRepository rfpQuoteAncillaryPlanRepository;
    
    @Autowired
    private AncillaryPlanRepository ancillaryPlanRepository;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Value("${app.carrier}")
    String[] appCarrier;

    public BasePlanService() {
        rxBenefitSysNames = Constants.RX.stream()
            .map(r -> r.sysName)
            .collect(toSet());
    }
    
    
    public RfpQuoteAncillaryPlanDto createRfpQuoteAncillaryPlan(RfpQuoteAncillaryPlanDto planParams) {
        if(planParams.getRfpQuoteAncillaryPlanId() != null) {
            throw new ValidationException("Plan already exists");
        }
        if(planParams.getRfpQuoteId() == null) {
            throw new ValidationException("Missing required param: rfpQuoteId");
        }
        // set required param carrierId from Quote
        RfpQuote rfpQuote = rfpQuoteRepository.findOne(planParams.getRfpQuoteId());
        if (rfpQuote == null) {
            throw new NotFoundException("RfpQuote not found").withFields(field("rfp_quote_id", planParams.getRfpQuoteId()));
        }
        planParams.setCarrierId(rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier().getCarrierId());
        
        AncillaryPlanDto ancPlanDto = sharedPlanService.createAncillaryPlan(rfpQuote.getRfpSubmission().getClient().getClientId(), planParams);
        planParams.setAncillaryPlanId(ancPlanDto.getAncillaryPlanId());

        RfpQuoteAncillaryPlan quotePlan = RfpMapper.ancQuotePlanDtoToAncQuotePlan(planParams);
        rfpQuoteAncillaryPlanRepository.save(quotePlan);
        
        RfpQuoteAncillaryPlanDto result = getRfpQuoteAncillaryPlan(quotePlan.getRfpQuoteAncillaryPlanId());
       
        /* UI requirement: need to select plan on creation */
        if (planParams.getRfpQuoteAncillaryOptionId() != null) {
           rfpQuoteService.selectRfpQuoteAncillaryPlan(planParams.getRfpQuoteAncillaryOptionId(), 
        		   quotePlan.getRfpQuoteAncillaryPlanId(), null, true);
           result.setSelected(true);
           result.setRfpQuoteAncillaryOptionId(planParams.getRfpQuoteAncillaryOptionId());
        }
        return result;
    }
    
    public RfpQuoteAncillaryPlanDto updateRfpQuoteAncillaryPlan(RfpQuoteAncillaryPlanDto planParams) {
        if(planParams.getRfpQuoteAncillaryPlanId() == null || !rfpQuoteAncillaryPlanRepository.exists(planParams.getRfpQuoteAncillaryPlanId())) {
            throw new ValidationException("Cannot find quote plan by id: " + planParams.getRfpQuoteAncillaryPlanId());
        }
        if(planParams.getAncillaryPlanId() == null || !ancillaryPlanRepository.exists(planParams.getAncillaryPlanId())) {
            throw new ValidationException("Cannot find plan by id: " + planParams.getRfpQuoteAncillaryPlanId());
        }
        if(planParams.getRfpQuoteId() == null) {
            throw new ValidationException("Missing required param: rfpQuoteId");
        }
        RfpQuote rfpQuote = rfpQuoteRepository.findOne(planParams.getRfpQuoteId());
        if(rfpQuote == null){
            throw new BaseException("RfpQuote not found").withFields(field("rfp_quote_id", planParams.getRfpQuoteId()));
        }
        sharedPlanService.updateAncillaryPlan(rfpQuote.getRfpSubmission().getClient().getClientId(), planParams);
        
        RfpQuoteAncillaryPlan quotePlan = RfpMapper.ancQuotePlanDtoToAncQuotePlan(planParams);
        rfpQuoteAncillaryPlanRepository.save(quotePlan);

        return getRfpQuoteAncillaryPlan(quotePlan.getRfpQuoteAncillaryPlanId());
    }
    
    public RfpQuoteAncillaryPlanDto getRfpQuoteAncillaryPlan(Long rfpQuoteAncillaryPlanId) {

        RfpQuoteAncillaryPlan quotePlan = rfpQuoteAncillaryPlanRepository.findOne(rfpQuoteAncillaryPlanId);
        
        if(quotePlan == null) {
            throw new NotFoundException("RfpQuoteAncillaryPlan not found by id: " + rfpQuoteAncillaryPlanId);
        }
        RfpQuoteAncillaryPlanDto result = RfpMapper.ancQuotePlanToAncQuotePlanDto(quotePlan);
        return result;
    }
    
    public Long create(CreatePlanDto planParams) {
        if(planParams == null) {
            throw new ValidationException("Cannot create plan from null object");
        }

        RfpQuoteNetwork rfpQuoteNetwork = rfpQuoteNetworkRepository.findOne(planParams.getRfpQuoteNetworkId());

        if(rfpQuoteNetwork == null) {
            throw new NotFoundException("Quote network not found")
                .withFields(
                    field("rfp_quote_network_id", planParams.getRfpQuoteNetworkId())
                );
        }

        sharedPlanService.defaultMissingBenefits(planParams, rfpQuoteNetwork.getNetwork());

        Long clientId = rfpQuoteNetwork.getRfpQuote().getRfpSubmission().getClient().getClientId();
        PlanNameByNetwork pnn = sharedPlanService.createAndSavePlanNameByNetwork(
            rfpQuoteNetwork.getNetwork().getCarrier(),
            rfpQuoteNetwork.getNetwork(), planParams.getNameByNetwork(),
            rfpQuoteNetwork.getNetwork().getType(),
            clientId,
            false,
            planParams.getRx()
        );

        sharedPlanService.createAndSaveBenefits(planParams.getBenefits(), pnn.getPlan());

        QuoteOptionAltRxDto extRx = planParams.getExtRx();
        RfpQuoteNetworkPlan rxNetworkPlan = null;
        if(extRx != null) {
            String rxNetworkType = "RX_" + rfpQuoteNetwork.getNetwork().getType();

            String rxPlanName = StringUtils.isNotBlank(extRx.getName()) ? extRx.getName() : planParams.getNameByNetwork();
            PlanNameByNetwork rxPnn = sharedPlanService.createAndSavePlanNameByNetwork(
                    rfpQuoteNetwork.getNetwork().getCarrier(),
                    rfpQuoteNetwork.getNetwork(), rxPlanName,
                    rxNetworkType, clientId, false, extRx.getRx()
            );

            rxNetworkPlan = new RfpQuoteNetworkPlan();

            rxNetworkPlan.setPnn(rxPnn);
            rxNetworkPlan.setRfpQuoteNetwork(rfpQuoteNetwork);
            rxNetworkPlan.setRfpQuoteVersion(rfpQuoteNetwork.getRfpQuoteVersion());

            fillTierRatesFromRx(rxNetworkPlan, extRx.getRx());

            rxNetworkPlan = rfpQuoteNetworkPlanRepository.save(rxNetworkPlan);
        }

        RfpQuoteNetworkPlan networkPlan = new RfpQuoteNetworkPlan();
        networkPlan.setPnn(pnn);
        networkPlan.setRfpQuoteNetwork(rfpQuoteNetwork);
        networkPlan.setRfpQuoteVersion(rfpQuoteNetwork.getRfpQuoteVersion());

        fillTierRatesFromCost(networkPlan, planParams.getCost());

        networkPlan = rfpQuoteNetworkPlanRepository.save(networkPlan);
        
        /* UI requirement: need to select plan on creation */
        if(planParams.getRfpQuoteOptionNetworkId() != null) {
           rfpQuoteService.selectQuoteOptionNetworkPlan(planParams.getRfpQuoteOptionNetworkId(), networkPlan.getRfpQuoteNetworkPlanId());
           
           if(rxNetworkPlan != null) {
               rfpQuoteService.selectQuoteOptionNetworkPlan(planParams.getRfpQuoteOptionNetworkId(), rxNetworkPlan.getRfpQuoteNetworkPlanId());
           }
        }

        return networkPlan.getRfpQuoteNetworkPlanId();
    }
    
    public PlanNameByNetworkDetailsDto getPlanNameByNetworkById(Long pnnId) {
        PlanNameByNetwork pnn = planNameByNetworkRepository.findOne(pnnId);
        if(pnn == null) {
            throw new NotFoundException(format("PlanNameByNetwork not found; pnnId=%s", pnnId));
        }
        PlanNameByNetworkDetailsDto result = new PlanNameByNetworkDetailsDto();
        result.setPnnId(pnn.getPnnId());
        result.setName(pnn.getName());
        result.setPlanType(pnn.getPlanType());
        result.setNetworkId(pnn.getNetwork().getNetworkId());
        result.setNetworkName(pnn.getNetwork().getName());

        List<Rx> rx = new ArrayList<>();
        List<QuoteOptionAltPlanDto.Benefit> benefits = sharedPlanService.findBenefits(pnn.getPlan().getPlanId(), rx);

        result.setBenefits(benefits);
        result.setRx(rx);
        
        return result;
    }
    
    private Long saveTier4RatePlan(Tier4RatePlan plan) {
    	if(plan instanceof RfpQuoteNetworkPlan) {
    		RfpQuoteNetworkPlan saved = rfpQuoteNetworkPlanRepository.save((RfpQuoteNetworkPlan) plan);
    		return saved.getRfpQuoteNetworkPlanId();
		} else if(plan instanceof ClientPlan) {
			ClientPlan saved = clientPlanRepository.save((ClientPlan) plan);
			return saved.getClientPlanId();
		} else {
			throw new RuntimeException("Unsupported Tier4RatePlan implementation");
		}
    }

	private void fillTierRatesFromCost(Tier4RatePlan plan, List<Cost> costs) {
    	RfpQuote rfpQuote = null;
    
    	if(plan instanceof RfpQuoteNetworkPlan) {
    		rfpQuote = ((RfpQuoteNetworkPlan) plan).getRfpQuoteNetwork().getRfpQuote();
    	} else if(plan instanceof ClientPlan) {
    		ClientPlan cp = (ClientPlan) plan;
    		rfpQuote = new RfpQuote();
    		if(cp.getTier4Rate().intValue() == 0 && cp.getTier3Rate().intValue() == 0) {
    			rfpQuote.setRatingTiers(2);
    		} else {
    			rfpQuote.setRatingTiers(4);
    		}
    	} else {
    		throw new RuntimeException("Unsupported Tier4RatePlan implementation");
    	}
    	for(Cost cost : costs) {
            switch(cost.name) {
                case Constants.TIER1_PLAN_NAME:
                    plan.setTier1Rate(floatValueNullSafe(cost.value));
                    break;
                case Constants.TIER2_PLAN_NAME: case Constants.TIER2_PLAN_NAME_SPECIAL:
                    plan.setTier2Rate(floatValueNullSafe(cost.value));
                    break;
                case Constants.TIER3_PLAN_NAME: case Constants.TIER3_PLAN_NAME_SPECIAL:
                    plan.setTier3Rate(floatValueNullSafe(cost.value));
                    break;
                case Constants.TIER4_PLAN_NAME:
                	 if (rfpQuote.getRatingTiers() == 2) {
                		 plan.setTier2Rate(floatValueNullSafe(cost.value));
                     } else {
                    	 plan.setTier4Rate(floatValueNullSafe(cost.value));
                     }
                    break;
                default:
                    break;
            }
        }
    }

    private static Float floatValueNullSafe(String s) {
        return isEmpty(s) ? 0f : Float.valueOf(s);
    }

    private void fillTierRatesFromRx(RfpQuoteNetworkPlan plan, List<Rx> rxs) {
        for(Rx rx : rxs) {
            if(!rxBenefitSysNames.contains(rx.sysName)) {
                continue;
            }
            switch(rx.sysName) {
                case Constants.TIER1_RX_SYSNAME:
                    plan.setTier1Rate(floatValueNullSafe(rx.value));
                    break;
                case Constants.TIER2_RX_SYSNAME:
                    plan.setTier2Rate(floatValueNullSafe(rx.value));
                    break;
                case Constants.TIER3_RX_SYSNAME:
                    plan.setTier3Rate(floatValueNullSafe(rx.value));
                    break;
                case Constants.TIER4_RX_SYSNAME:
                    plan.setTier4Rate(floatValueNullSafe(rx.value));
                    break;
                default:
                    break;
            }
        }
    }

    
    public void updateClientPlan(CreatePlanDto updateParams, Long clientPlanId) {
    	ClientPlan clientPlan = clientPlanRepository.findOne(clientPlanId);
	    if (clientPlan == null) {
	    	throw new NotFoundException("ClientPlan not found").withFields(field("clientPlanId", clientPlanId));
	    }
        updateParams.setClientId(clientPlan.getClient().getClientId());
	    updatePlan(updateParams, clientPlan);
	    updateClientRxPlan(updateParams.getExtRx(), clientPlanId);
    }
    
    public void update(CreatePlanDto createPlanDto) {
		 RfpQuoteNetworkPlan rqnp = rfpQuoteNetworkPlanRepository.findOne(createPlanDto.getRfpQuoteNetworkPlanId());
	     if(rqnp == null) { 
	    	 throw new NotFoundException("RfpQuoteNetworkPlan not found").withFields(field("rfpQuoteNetworkPlanId", createPlanDto.getRfpQuoteNetworkPlanId()));
	     }
	     createPlanDto.setClientId(rqnp.getRfpQuoteNetwork().getRfpQuote().getRfpSubmission().getClient().getClientId());
	     updatePlan(createPlanDto, rqnp);
	     updateRxPlan(createPlanDto.getExtRx());
    }

    private void updatePlan(CreatePlanDto createPlanDto, Tier4RatePlan plan) {
    	PlanNameByNetwork pnn = plan.getPnn();
        if (!StringUtils.equals(pnn.getName(), createPlanDto.getNameByNetwork())) {

            pnn.setName(createPlanDto.getNameByNetwork());
            planNameByNetworkRepository.save(pnn);
        }
        sharedPlanService.updateBenefits(createPlanDto, pnn);
        fillTierRatesFromCost(plan, createPlanDto.getCost());
        saveTier4RatePlan(plan);
    }

    private void updateRxPnnAndBenefits(QuoteOptionAltRxDto extRx, PlanNameByNetwork rxPnn) {
    	 if (!StringUtils.equals(rxPnn.getName(), extRx.getName())) {
    		 rxPnn.setName(extRx.getName());
             planNameByNetworkRepository.save(rxPnn);
         }
         List<Benefit> benefits = benefitRepository.findByPlanId(rxPnn.getPlan().getPlanId());
         Map<Pair<String, String>, Benefit> benefitMap = benefits.stream().collect(Collectors.toMap(
                 benefit -> Pair.of(benefit.getBenefitName().getName(), benefit.getInOutNetwork()),
                 benefit -> benefit
         ));
         sharedPlanService.updateRx(extRx.getRx(), benefitMap, rxPnn.getPlan());
    }
    
    public void updateRxPlan(QuoteOptionAltRxDto extRx) {
        if (extRx == null) {
            return;
        }
        if (extRx.getRfpQuoteNetworkPlanId() == null) {
            throw new BadRequestException("extRx.rfpQuoteNetworkPlanId must not be null");
        }
        RfpQuoteNetworkPlan rqnRxPlan = rfpQuoteNetworkPlanRepository.findOne(extRx.getRfpQuoteNetworkPlanId());
        if (rqnRxPlan == null) {
            throw new NotFoundException("RfpQuoteNetworkPlan not found").withFields(field("extRx.rfpQuoteNetworkPlanId", extRx.getRfpQuoteNetworkPlanId()));
        }
        updateRxPnnAndBenefits(extRx, rqnRxPlan.getPnn());
	    fillTierRatesFromRx(rqnRxPlan, extRx.getRx());
	    rfpQuoteNetworkPlanRepository.save(rqnRxPlan);
    }
    
    public void updateClientRxPlan(QuoteOptionAltRxDto extRx, Long clientPlanId) {
    	if (extRx == null) {
            return;
        }
    	ClientPlan clientPlan = clientPlanRepository.findOne(clientPlanId);
	    if (clientPlan == null) {
	    	throw new NotFoundException("ClientPlan not found").withFields(field("clientPlanId", clientPlanId));
	    }
        updateRxPnnAndBenefits(extRx, clientPlan.getRxPnn());
    }

    public void delete(DeletePlanDto deletePlanDto) {
        if (CollectionUtils.isEmpty(deletePlanDto.getRfpQuoteNetworkPlanIds())) {
            throw new BadRequestException("rfpQuoteNetworkPlanId list must not be empty");
        }
        deletePlanDto.getRfpQuoteNetworkPlanIds().forEach(this::deletePlan);
    }

    public void deletePlan(Long rfpQuoteNetworkPlanId) {
        if (rfpQuoteNetworkPlanId == null) {
            throw new BadRequestException("rfpQuoteNetworkPlanId must not be null");
        }
        RfpQuoteNetworkPlan plan = rfpQuoteNetworkPlanRepository.findOne(rfpQuoteNetworkPlanId);
        if (plan == null) {
            throw new NotFoundException("RfpQuoteNetworkPlan not found").withFields(field("rfpQuoteNetworkPlanId", rfpQuoteNetworkPlanId));
        }
        Long pnnId = plan.getPnn().getPnnId();
        Long planId = plan.getPnn().getPlan().getPlanId();
        List<Benefit> benefits = benefitRepository.findByPlanId(planId);
        benefitRepository.delete(benefits);
        rfpQuoteOptionNetworkRepository.unselectPlan(plan);
        rfpQuoteOptionNetworkRepository.unselectRxPlan(plan);
        rfpQuoteOptionNetworkRepository.unselectSecondPlan(plan);
        rfpQuoteOptionNetworkRepository.unselectSecondRxPlan(plan);
        rfpQuoteNetworkPlanRepository.delete(rfpQuoteNetworkPlanId);
        planNameByNetworkRepository.delete(pnnId);
        planRepository.delete(planId);
    }
    
    public FileDto downloadBenefitSummaryFile(Long rfpQuoteNetworkPlanId) {
        
    	RfpQuoteNetworkPlan plan = rfpQuoteNetworkPlanRepository.findOne(rfpQuoteNetworkPlanId); 
        
        if(plan == null) {
            throw new NotFoundException("RfpQuoteNetworkPlan not found")
                .withFields(
                    field("rfp_quote_network_plan_id", rfpQuoteNetworkPlanId)
                );
        }
        FileDto fileDto = documentService.findDocumentFileByNameAndCarrier(
        		StringHelper.normalizeFileName(plan.getPnn().getName()), 
        		plan.getPnn().getNetwork().getCarrier().getCarrierId());
        return fileDto;
    }

}
