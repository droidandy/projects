package com.benrevo.broker.service;

import static com.benrevo.be.modules.shared.util.PlanCalcHelper.floatValue;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.longValue;
import static com.benrevo.common.Constants.MULTIPLE_CARRIER;
import static com.benrevo.common.enums.PlanCategory.DENTAL;
import static com.benrevo.common.enums.PlanCategory.LIFE;
import static com.benrevo.common.enums.PlanCategory.LTD;
import static com.benrevo.common.enums.PlanCategory.MEDICAL;
import static com.benrevo.common.enums.PlanCategory.STD;
import static com.benrevo.common.enums.PlanCategory.VISION;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.ValidationHelper.isNotNull;
import static com.google.common.base.MoreObjects.firstNonNull;
import static java.lang.Integer.parseUnsignedInt;
import static java.lang.Long.compare;
import static java.lang.String.format;
import static java.util.Objects.isNull;
import static java.util.stream.Collectors.toSet;
import static org.apache.commons.collections4.CollectionUtils.isEmpty;
import static org.apache.commons.collections4.CollectionUtils.isNotEmpty;
import static org.apache.commons.lang3.ObjectUtils.allNotNull;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isBlank;

import com.benrevo.be.modules.presentation.service.BasePlanService;
import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService.BundleDiscounts;
import com.benrevo.be.modules.shared.util.PlanCalcHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.OptionPlanDto;
import com.benrevo.common.dto.PresentationAlternativeDto;
import com.benrevo.common.dto.PresentationAlternativeDto.PresentationAlternativeBundlingDiscount;
import com.benrevo.common.dto.PresentationAlternativeDto.PresentationAlternativeOption;
import com.benrevo.common.dto.PresentationQuoteOptionListDto;
import com.benrevo.common.dto.PresentationUpdateDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.dto.QuoteOptionPlanBriefDto;
import com.benrevo.common.dto.QuoteOptionPlanComparisonDto;
import com.benrevo.common.dto.QuoteOptionBriefDto;
import com.benrevo.common.dto.QuoteOptionDisclaimerDto;
import com.benrevo.common.dto.QuoteOptionListDto;
import com.benrevo.common.dto.RfpQuoteOptionDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.enums.RateType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.MathUtils;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.PresentationOption;
import com.benrevo.data.persistence.entities.QuoteOption;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.ancillary.AncillaryClass;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.AncillaryRate;
import com.benrevo.data.persistence.entities.ancillary.AncillaryRateAge;
import com.benrevo.data.persistence.entities.ancillary.BasicRate;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientRfpProductRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.OptionRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.PresentationOptionRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryPlanRepository;
import java.time.Year;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Triple;
import org.hibernate.validator.constraints.URL;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PresentationService {

    @Autowired
    private RfpQuoteService rfpQuoteService;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private PlanNameByNetworkRepository pnnRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private SharedPlanService sharedPlanService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;

    @Autowired
    private ClientRfpProductRepository clientRfpProductRepository;

    @Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;
    
    @Autowired
    private RfpQuoteAncillaryPlanRepository rfpQuoteAncillaryPlanRepository;
    
    @Autowired
    private AncillaryPlanRepository ancillaryPlanRepository;
    
    @Autowired
    private PresentationOptionRepository presentationOptionRepository;

    @Autowired
    private PlanRepository planRepository;
    
    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    
    private static final int DEFAULT_RATING_TIERS = 4;
    private static final String CLSA_TRUST_DISCLAIMER_PREFIX = "CLSA_TRUST_";

    public void initOptions(RfpQuoteOptionDto params) {
        if (params.getClientId() == null || params.getProduct() == null) {
            throw new BaseException(
                "Missing required Options init params: clientId and product");
        }
        // do not create renewal option for virgin product
        boolean isNotVirginProduct = isNull(clientRfpProductRepository.
            findByClientIdAndExtProductNameAndVirginGroupIsTrue(params.getClientId(),
                params.getProduct()));
        
        if(PlanCategory.isAncillary(params.getProduct())) {
        	if(isNotVirginProduct) {
        		initOrUpdateAncillaryRenewalOption(params.getClientId(), params.getProduct());
        	}
        	return;
        }
        
        RfpQuoteOption renewalOption = findRenewalOption(params.getClientId(), params.getProduct());

        if (isNotVirginProduct && renewalOption == null) {
            PlanCategory category = PlanCategory.valueOf(params.getProduct());
            List<ClientPlan> clientPlans = clientPlanRepository
                .findByClientClientIdAndPnnPlanTypeIn(
                    params.getClientId(), category.getPlanTypes());

            RfpCarrier rfpCarrier = findCurrentOptionRfpCarrier(clientPlans, params.getProduct());
            if(rfpCarrier != null) {
                Long renewalOptionId = rfpQuoteService
                    .createQuoteOption(params.getClientId(), rfpCarrier.getRfpCarrierId(),
                        RfpQuoteService.RENEWAL_OPTION_NAME,
                        QuoteType.STANDARD, OptionType.RENEWAL);

                renewalOption = rfpQuoteOptionRepository.findOne(renewalOptionId);
                Client client = clientRepository.findOne(params.getClientId());
                isNotNull(client, format("Client not found. client_id=%s", params.getClientId()));

                if (isNotEmpty(clientPlans)) {
                    for (ClientPlan clientPlan : clientPlans) {
                        createRfpQuoteOptionNetworkByClientPlan(renewalOption, clientPlan);
                    }
                    // update renewal quote type if current has changes(need to account for kaiser);
                    setOrUpdateRenewalQuoteType(clientPlans, renewalOption);
                }
            }
        }
    }
    
    private void initOrUpdateAncillaryRenewalOption(Long clientId, String product) {
    	PlanCategory category = PlanCategory.valueOf(product);
    	List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(clientId, category.getPlanTypes());
    	if (clientPlans.isEmpty()) {
    		return;
    	}
    	RfpQuoteAncillaryOption renewalOpt = findAncillaryRenewalOption(clientId, product);
		if (renewalOpt == null) {
            RfpCarrier rfpCarrier = findCurrentOptionRfpCarrier(clientPlans, product);
            if (rfpCarrier != null) {
            	Long optionId = rfpQuoteService.createAncillaryQuoteOption(clientId, rfpCarrier.getRfpCarrierId(), 
        				RfpQuoteService.RENEWAL_OPTION_NAME, 
        				QuoteType.STANDARD, OptionType.RENEWAL);
            	renewalOpt = rfpQuoteAncillaryOptionRepository.findOne(optionId);
            }
		}
		if (renewalOpt != null) {
			updateAncillaryOptionWithClientPlans(renewalOpt, clientPlans);
		}
    }
    
    private RfpCarrier findCurrentOptionRfpCarrier(List<ClientPlan> clientPlans, String product) {
    	RfpQuote currentQuote = sharedRfpQuoteService.prepareCurrentQuote(clientPlans);
        Carrier carrier = currentQuote.getRfpSubmission().getRfpCarrier().getCarrier();
        RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(
        		carrier.getName(), product);
        if (rfpCarrier == null && carrier.getName().equals(MULTIPLE_CARRIER)){
        	rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(
                CarrierType.MULTIPLE_CARRIERS.name(), product);
        }
        return rfpCarrier;
    }

    public RfpQuoteOptionDto getOptionInfo(Long rfpQuoteOptionId) {
        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);
        if (option == null) {
            throw new NotFoundException("Option not found")
                .withFields(field("rfp_quote_option_id", rfpQuoteOptionId));
        }
        RfpQuoteOptionDto result = new RfpQuoteOptionDto();
        result.setRfpQuoteOptionId(rfpQuoteOptionId);
        result.setOptionName(option.getRfpQuoteOptionName());
        result.setClientId(option.getRfpQuote().getRfpSubmission().getClient().getClientId());
        result.setQuoteType(option.getRfpQuote().getQuoteType());
        RfpCarrier rfpCarrier = option.getRfpQuote().getRfpSubmission().getRfpCarrier();
        result.setCarrierDisplayName(rfpCarrier.getCarrier().getDisplayName());
        result.setCarrierId(rfpCarrier.getCarrier().getCarrierId());
        result.setProduct(rfpCarrier.getCategory());
        OptionType optionType = rfpQuoteService.getOptionType(option.getRfpQuoteOptionName());
        result.setOptionType(optionType);
        final int ratingTiers = firstNonNull(option.getRfpQuote().getRatingTiers(),
            DEFAULT_RATING_TIERS);
        result.setRatingTiers(ratingTiers);

        // calculate bundle discount
        BundleDiscounts discounts = rfpQuoteService.calcBundleDiscount(result.getClientId());

        List<RfpQuoteOptionNetwork> outOfStateNetworks = findOutOfStateRqons(
            option.getRfpQuoteOptionNetworks());
        for (RfpQuoteOptionNetwork rqon : option.getRfpQuoteOptionNetworks()) {
            if (rqon.isOutOfState()) {
                continue;
            }
            OptionPlanDto plan = new OptionPlanDto();
            result.getOptionPlans().add(plan);

            // these properties (ErContributionFormat, tier1-tier4 rates) will be overriden below if selected RfpQuoteNetworkPlan != null
            getAndSetOriginalClientPlanProperties(plan, rqon.getClientPlan(), optionType);
            
            RfpQuoteNetworkPlan netwPlan = rqon.getSelectedRfpQuoteNetworkPlan();
            RfpQuoteNetworkPlan netwRxPlan = rqon.getSelectedRfpQuoteNetworkRxPlan();
            RfpQuoteOptionNetwork oosRqon = lookupOutOfStateRqon(rqon, outOfStateNetworks);
            // to identify "plan" item if no selected plan
            plan.setPlanId(rqon.getRfpQuoteOptionNetworkId());
            if (netwPlan != null) {
                QuoteOptionPlanBriefDto costParams = rfpQuoteService.buildNewQuoteOptionPlanBrief(rqon, netwPlan,
                    netwRxPlan, discounts);
                float[] rates = rfpQuoteService.calcPlanTierRates(rqon, netwPlan, netwRxPlan, discounts, costParams);
                plan.setTier1Rate(rates[0]);
                plan.setTier2Rate(rates[1]);
                plan.setTier3Rate(rates[2]);
                plan.setTier4Rate(rates[3]);

                if (oosRqon != null && oosRqon.getSelectedRfpQuoteNetworkPlan() != null) {
                    RfpQuoteNetworkPlan oosPlan = oosRqon.getSelectedRfpQuoteNetworkPlan();
                    RfpQuoteNetworkPlan oosRxPlan = oosRqon.getSelectedRfpQuoteNetworkRxPlan();
                    costParams = rfpQuoteService.buildNewQuoteOptionPlanBrief(oosRqon, oosPlan,
                        oosRxPlan, discounts);
                    rates = rfpQuoteService.calcPlanTierRates(oosRqon, oosPlan, oosRxPlan, discounts, costParams);

                    plan.setTier1OosRate(rates[0]);
                    plan.setTier2OosRate(rates[1]);
                    plan.setTier3OosRate(rates[2]);
                    plan.setTier4OosRate(rates[3]);
                    plan.setOutOfStateRate(true);
                }
                if (netwPlan.getPnn() != null) {
                    plan.setReplacementNetworkId(netwPlan.getPnn().getNetwork().getNetworkId());
                    plan.setReplacementNetworkName(netwPlan.getPnn().getNetwork().getName());
                    plan.setReplacementPlanId(netwPlan.getPnn().getPnnId());
                    plan.setReplacementPlanName(netwPlan.getPnn().getName());
                }
            }
            if (rqon.getClientPlan() != null && rqon.getClientPlan().getPnn() != null) {
                plan.setIncumbentPlanId(rqon.getClientPlan().getClientPlanId());
                plan.setIncumbentPlanName(rqon.getClientPlan().getPnn().getName());
                plan.setIncumbentPlanType(rqon.getClientPlan().getPnn().getPlanType());
                plan.setIncumbentNetworkId(
                    rqon.getClientPlan().getPnn().getNetwork().getNetworkId());
                plan.setIncumbentNetworkName(rqon.getClientPlan().getPnn().getNetwork().getName());
                plan.setCarrierId(
                    rqon.getClientPlan().getPnn().getPlan().getCarrier().getCarrierId());
                plan.setCarrierDisplayName(
                    rqon.getClientPlan().getPnn().getPlan().getCarrier().getDisplayName());
            }
            plan.setTier1Contribution(rqon.getTier1ErContribution());
            plan.setTier2Contribution(rqon.getTier2ErContribution());
            plan.setTier3Contribution(rqon.getTier3ErContribution());
            plan.setTier4Contribution(rqon.getTier4ErContribution());
            plan.setErContributionFormat(rqon.getErContributionFormat());

            plan.setTier1Enrollment(rqon.getTier1Census());
            plan.setTier2Enrollment(rqon.getTier2Census());
            plan.setTier3Enrollment(rqon.getTier3Census());
            plan.setTier4Enrollment(rqon.getTier4Census());
            if (oosRqon != null) {
                plan.setTier1OosContribution(oosRqon.getTier1ErContribution());
                plan.setTier2OosContribution(oosRqon.getTier2ErContribution());
                plan.setTier3OosContribution(oosRqon.getTier3ErContribution());
                plan.setTier4OosContribution(oosRqon.getTier4ErContribution());
                plan.setOutOfStateContribution(true);

                plan.setTier1OosEnrollment(oosRqon.getTier1Census());
                plan.setTier2OosEnrollment(oosRqon.getTier2Census());
                plan.setTier3OosEnrollment(oosRqon.getTier3Census());
                plan.setTier4OosEnrollment(oosRqon.getTier4Census());
                plan.setOutOfStateEnrollment(true);
            }
        }
        return result;
    }

    private List<ClientPlan> findOutOfStateClientPlans(List<ClientPlan> clientPlans) {
        return clientPlans.stream()
            .filter(p -> p.isOutOfState() && p.getPnn() != null)
            .collect(Collectors.toList());
    }

    private List<RfpQuoteOptionNetwork> findOutOfStateRqons(List<RfpQuoteOptionNetwork> rqons) {
        return rqons.stream()
            .filter(rqon -> rqon.isOutOfState() && rqon.getClientPlan() != null
                && rqon.getClientPlan().getPnn() != null)
            .collect(Collectors.toList());
    }

    private RfpQuoteOptionNetwork lookupOutOfStateRqon(RfpQuoteOptionNetwork rqon,
        List<RfpQuoteOptionNetwork> outOfStateNetworks) {
        RfpQuoteOptionNetwork oosRqon = null;
        if (!outOfStateNetworks.isEmpty() && rqon.getClientPlan() != null
            && rqon.getClientPlan().getPnn() != null) {
            oosRqon = outOfStateNetworks.stream()
                .filter(n -> n.getRfpQuoteNetwork().getRfpQuoteNetworkId()
                    .equals(rqon.getRfpQuoteNetwork().getRfpQuoteNetworkId())
                    && n.getClientPlan().getPnn().getPnnId()
                    .equals(rqon.getClientPlan().getPnn().getPnnId()))
                .findFirst().orElse(null);
        }
        return oosRqon;
    }

    private ClientPlan lookupOutOfStateClientPlan(ClientPlan clientPlan,
        List<ClientPlan> oosClientPlans) {
        ClientPlan oosCp = null;
        if (!oosClientPlans.isEmpty() && clientPlan.getPnn() != null) {
            oosCp = oosClientPlans.stream()
                .filter(cp -> cp.getPnn().getPnnId().equals(clientPlan.getPnn().getPnnId()))
                .findFirst().orElse(null);
        }
        return oosCp;
    }

    public RfpQuoteOptionDto getCurrentOptionInfo(Long clientId, String product) {

        PlanCategory planCategory = PlanCategory.valueOf(product);
        List<ClientPlan> clientPlans = clientPlanRepository
            .findByClientClientIdAndPnnPlanTypeIn(clientId, planCategory.getPlanTypes());
        final int ratingTiers = rfpQuoteService.findRatingTiers(clientPlans);

        RfpQuoteOptionDto result = new RfpQuoteOptionDto();
        result.getOptionPlans().addAll(buildOptionPlanDtoList(clientPlans, OptionType.CURRENT));

        result.setOptionName(Constants.CURRENT_NAME);
        result.setClientId(clientId);
        result.setOptionType(OptionType.CURRENT);
        RfpQuoteOption opt = rfpQuoteService.prepareCurrentOption(clientPlans);
        result.setQuoteType(opt.getRfpQuote().getQuoteType());
        RfpCarrier rfpCarrier = opt.getRfpQuote().getRfpSubmission().getRfpCarrier();
        result.setCarrierDisplayName(rfpCarrier.getCarrier().getDisplayName());
        result.setCarrierId(rfpCarrier.getCarrier().getCarrierId());
        result.setProduct(product);
        result.setRatingTiers(ratingTiers);
        return result;
    }

    private List<OptionPlanDto> buildOptionPlanDtoList(List<ClientPlan> clientPlans, OptionType optionType) {
        List<OptionPlanDto> result = new ArrayList<>();
        List<ClientPlan> oosClientPlans = findOutOfStateClientPlans(clientPlans);
        for (ClientPlan clientPlan : clientPlans) {
            if (clientPlan.isOutOfState()) {
                continue;
            }
            ClientPlan oosClientPlan = lookupOutOfStateClientPlan(clientPlan, oosClientPlans);

            OptionPlanDto plan = new OptionPlanDto();
            result.add(plan);

            plan.setPlanId(clientPlan.getClientPlanId());
            if (clientPlan.getPnn() != null) {
                plan.setIncumbentPlanId(clientPlan.getPnn().getPnnId());
                plan.setIncumbentPlanName(clientPlan.getPnn().getName());
                plan.setIncumbentPlanType(clientPlan.getPnn().getPlanType());
                plan.setIncumbentNetworkId(clientPlan.getPnn().getNetwork().getNetworkId());
                plan.setIncumbentNetworkName(clientPlan.getPnn().getNetwork().getName());
                plan.setCarrierId(clientPlan.getPnn().getPlan().getCarrier().getCarrierId());
                plan.setCarrierDisplayName(
                    clientPlan.getPnn().getPlan().getCarrier().getDisplayName());
            }
            plan.setTier1Rate(clientPlan.getTier1Rate());
            plan.setTier2Rate(clientPlan.getTier2Rate());
            plan.setTier3Rate(clientPlan.getTier3Rate());
            plan.setTier4Rate(clientPlan.getTier4Rate());

            plan.setTier1Contribution(clientPlan.getTier1ErContribution());
            plan.setTier2Contribution(clientPlan.getTier2ErContribution());
            plan.setTier3Contribution(clientPlan.getTier3ErContribution());
            plan.setTier4Contribution(clientPlan.getTier4ErContribution());
            plan.setErContributionFormat(clientPlan.getErContributionFormat());

            plan.setTier1Enrollment(clientPlan.getTier1Census());
            plan.setTier2Enrollment(clientPlan.getTier2Census());
            plan.setTier3Enrollment(clientPlan.getTier3Census());
            plan.setTier4Enrollment(clientPlan.getTier4Census());
            
            getAndSetOriginalClientPlanProperties(plan, clientPlan, optionType);
            
            if (oosClientPlan != null) {
                plan.setTier1OosRate(oosClientPlan.getTier1Rate());
                plan.setTier2OosRate(oosClientPlan.getTier2Rate());
                plan.setTier3OosRate(oosClientPlan.getTier3Rate());
                plan.setTier4OosRate(oosClientPlan.getTier4Rate());
                plan.setOutOfStateRate(true);

                plan.setTier1OosContribution(oosClientPlan.getTier1ErContribution());
                plan.setTier2OosContribution(oosClientPlan.getTier2ErContribution());
                plan.setTier3OosContribution(oosClientPlan.getTier3ErContribution());
                plan.setTier4OosContribution(oosClientPlan.getTier4ErContribution());
                plan.setOutOfStateContribution(true);

                plan.setTier1OosEnrollment(oosClientPlan.getTier1Census());
                plan.setTier2OosEnrollment(oosClientPlan.getTier2Census());
                plan.setTier3OosEnrollment(oosClientPlan.getTier3Census());
                plan.setTier4OosEnrollment(oosClientPlan.getTier4Census());
                plan.setOutOfStateEnrollment(true);
            }
        }
        return result;
    }

    public RfpQuoteOptionDto updateOption(RfpQuoteOptionDto params) {
        RfpQuoteOptionDto updated = null;
        if (params.getRatingTiers() == null || params.getRatingTiers() == 0) {
            throw new BaseException("Missing required param: ratingTiers");
        }
        if (params.getRfpQuoteOptionId() != null) {
            updateQuoteOption(params.getRatingTiers(), params.getRfpQuoteOptionId(),
                params.getOptionPlans());
            updated = getOptionInfo(params.getRfpQuoteOptionId());
        } else if (params.getClientId() != null && params.getProduct() != null) {
            updateCurrentOption(params.getRatingTiers(), params.getClientId(), params.getProduct(),
                params.getOptionPlans());
            updated = getCurrentOptionInfo(params.getClientId(), params.getProduct());
        } else {
            throw new BaseException("Missing required Option update params");
        }
        return updated;
    }

    private void updateCurrentOption(int ratingTiers, Long clientId, String product,
        List<OptionPlanDto> optionPlans) {
        PlanCategory planCategory = PlanCategory.valueOf(product);
        List<ClientPlan> oldClientPlans = clientPlanRepository
            .findByClientClientIdAndPnnPlanTypeIn(clientId, planCategory.getPlanTypes());
        List<ClientPlan> oosClientPlans = findOutOfStateClientPlans(oldClientPlans);
        List<ClientPlan> newClientPlans = new ArrayList<>();
        Set<Long> oldClientPlansToRemove = oldClientPlans.stream().map(ClientPlan::getClientPlanId)
            .collect(toSet());

        Client client = clientRepository.findOne(clientId);

        for (OptionPlanDto plan : optionPlans) {
            PlanNameByNetwork pnn = null;
            ClientPlan clientPlan;
            if (plan.getPlanId() == null) { // add new plan
                clientPlan = new ClientPlan();
                clientPlan.setClient(client);
                pnn = getOrCreatePnn(client, plan);
            } else {
                clientPlan = clientPlanRepository.findOne(plan.getPlanId());
                if (clientPlan == null) {
                    throw new BaseException("ClientPlan not found by id: " + plan.getPlanId());
                }
                if (clientPlan.getPnn() == null) {
                    pnn = getOrCreatePnn(client, plan);
                } else {
                    pnn = updateOrCreatePnn(client, clientPlan.getPnn(), plan);
                }
            }
            clientPlan.setPnn(pnn);
            clientPlan.setPlanType(pnn.getPlanType());

            // required in getOrCreateClientPlanOption
            if (plan.getErContributionFormat() == null) {
                throw new BaseException("Missing required param: erContributionFormat");
            }
            Option option = getOrCreateClientPlanOption(clientPlan, ratingTiers, plan);

            // check and update input values by RatingTiers
            processRatingTiers(ratingTiers, plan);
            // calc rate values by premium
            processBandedRateType(plan, option, OptionType.CURRENT);

            clientPlan.setTier1Rate(floatValue(plan.getTier1Rate()));
            clientPlan.setTier2Rate(floatValue(plan.getTier2Rate()));
            clientPlan.setTier3Rate(floatValue(plan.getTier3Rate()));
            clientPlan.setTier4Rate(floatValue(plan.getTier4Rate()));

            if (Constants.ER_CONTRIBUTION_TYPE_VOLUNTARY.equals(plan.getErContributionFormat())) {
                // if voluntary, we use dollar as default and clear contribution amounts
                clientPlan.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
                clientPlan.setTier1ErContribution(0f);
                clientPlan.setTier2ErContribution(0f);
                clientPlan.setTier3ErContribution(0f);
                clientPlan.setTier4ErContribution(0f);
            } else {
                clientPlan.setErContributionFormat(plan.getErContributionFormat());
                clientPlan.setTier1ErContribution(floatValue(plan.getTier1Contribution()));
                clientPlan.setTier2ErContribution(floatValue(plan.getTier2Contribution()));
                clientPlan.setTier3ErContribution(floatValue(plan.getTier3Contribution()));
                clientPlan.setTier4ErContribution(floatValue(plan.getTier4Contribution()));
            }

            clientPlan.setTier1Census(longValue(plan.getTier1Enrollment()));
            clientPlan.setTier2Census(longValue(plan.getTier2Enrollment()));
            clientPlan.setTier3Census(longValue(plan.getTier3Enrollment()));
            clientPlan.setTier4Census(longValue(plan.getTier4Enrollment()));

            clientPlan.setOptionId(option.getId());

            clientPlanRepository.save(clientPlan);
            newClientPlans.add(clientPlan);
            oldClientPlansToRemove.remove(clientPlan.getClientPlanId());

            // create/update/remove out of state copy ClientPlan

            ClientPlan oosClientPlan = lookupOutOfStateClientPlan(clientPlan, oosClientPlans);

            if (plan.isOutOfStateRate() && plan.isOutOfStateEnrollment() && plan
                .isOutOfStateContribution()) {
                if (oosClientPlan == null) {
                    oosClientPlan = clientPlan.copy();
                    oosClientPlan.setOutOfState(true);
                }
                oosClientPlan.setTier1Rate(floatValue(plan.getTier1OosRate()));
                oosClientPlan.setTier2Rate(floatValue(plan.getTier2OosRate()));
                oosClientPlan.setTier3Rate(floatValue(plan.getTier3OosRate()));
                oosClientPlan.setTier4Rate(floatValue(plan.getTier4OosRate()));

                oosClientPlan.setTier1ErContribution(floatValue(plan.getTier1OosContribution()));
                oosClientPlan.setTier2ErContribution(floatValue(plan.getTier2OosContribution()));
                oosClientPlan.setTier3ErContribution(floatValue(plan.getTier3OosContribution()));
                oosClientPlan.setTier4ErContribution(floatValue(plan.getTier4OosContribution()));

                oosClientPlan.setTier1Census(longValue(plan.getTier1OosEnrollment()));
                oosClientPlan.setTier2Census(longValue(plan.getTier2OosEnrollment()));
                oosClientPlan.setTier3Census(longValue(plan.getTier3OosEnrollment()));
                oosClientPlan.setTier4Census(longValue(plan.getTier4OosEnrollment()));

                oosClientPlan.setErContributionFormat(plan.getErContributionFormat());
                oosClientPlan.setOptionId(option.getId());

                clientPlanRepository.save(oosClientPlan);
                newClientPlans.add(oosClientPlan);
                oldClientPlansToRemove.remove(oosClientPlan.getClientPlanId());
            } else if (oosClientPlan != null) {
                oldClientPlansToRemove.add(oosClientPlan.getClientPlanId());
            }
        }

        safeDeleteClientPlans(oldClientPlansToRemove, clientId, product);

        initOrUpdateRenewalOptionPlans(newClientPlans, clientId, product);
    }

    private PlanNameByNetwork updateOrCreatePnn(Client client, PlanNameByNetwork pnn,
        OptionPlanDto plan) {
        if (plan.getIncumbentNetworkId() == null || StringUtils
            .isBlank(plan.getIncumbentPlanName())) {
            throw new BaseException(
                "Missing required params: incumbentPlanId or incumbentNetworkId + incumbentPlanName");
        }
        Network network = networkRepository.findOne(plan.getIncumbentNetworkId());
        if (network == null) {
            throw new BaseException("Network not found by id: " + plan.getIncumbentNetworkId());
        }
        if (!pnn.getNetwork().getType().equals(network.getType())) {
            /* do not allow update network with different type:
             * Example: pnn.planType = HMO, pnn.plan.planType = HMO, pnn.plan has HMO benefits
             * If user change pnn.network to PPO we will get incorrect plan and potential errors
             * So, create new pnn for this ClientPlan */
            return getOrCreatePnn(client, plan);
        }
        if (!StringUtils.equals(pnn.getName(), plan.getIncumbentPlanName())) {
            pnn.setName(plan.getIncumbentPlanName());
            pnn.getPlan().setName(plan.getIncumbentPlanName());
        }
        if (!pnn.getNetwork().getNetworkId().equals(network.getNetworkId())) {
            pnn.setNetwork(network);
            pnn.getPlan().setCarrier(network.getCarrier());
        }

        planRepository.save(pnn.getPlan());
        return pnnRepository.save(pnn);
    }

    private PlanNameByNetwork getOrCreatePnn(Client client, OptionPlanDto plan) {
        if (plan.getIncumbentNetworkId() == null || StringUtils
            .isBlank(plan.getIncumbentPlanName())) {
            throw new BaseException(
                "Missing required params: incumbentPlanId or incumbentNetworkId + incumbentPlanName");
        }
        Network network = networkRepository.findOne(plan.getIncumbentNetworkId());
        if (network == null) {
            throw new BaseException("Network not found by id: " + plan.getIncumbentNetworkId());
        }
        int planYear = client.getEffectiveYear();
        List<PlanNameByNetwork> pnns = pnnRepository
            .findByNetworkAndNameAndPlanTypeAndPlanPlanYearAndClientIdAndCustomPlan(
                network, plan.getIncumbentPlanName(), network.getType(), planYear,
                client.getClientId(), false);

        if (!isEmpty(pnns)) {
            return pnns.get(0);
        }

        List<Rx> rxs = new ArrayList<>();
        return sharedPlanService.createPlanNameByNetwork(
            network, plan.getIncumbentPlanName(), network.getType(), client.getClientId(), false,
            rxs);
    }
    
    private void getAndSetOriginalClientPlanProperties(OptionPlanDto plan, ClientPlan clientPlan,
        OptionType optionType) {
        RateType rateType = RateType.COMPOSITE;
        if(clientPlan == null) {
            return;
        }
        Option option = null;
        if (clientPlan.getOptionId() != null) {
            option = optionRepository.findOne(clientPlan.getOptionId());
            if (option.getRateType() != null) {
                rateType = option.getRateType();
            }
            /* return original ErContributionFormat entered by user (VOLUNTARY replaced
             * by DOLLAR by default in updateCurrentOption() method) */
            if (option.getRfp() != null && Constants.ER_CONTRIBUTION_TYPE_VOLUNTARY.equals(
                    option.getRfp().getContributionType())) {
                plan.setErContributionFormat(Constants.ER_CONTRIBUTION_TYPE_VOLUNTARY);
            }
        }
        plan.setRateType(rateType);
        if (option != null && rateType == RateType.BANDED) {
            if(optionType.equals(OptionType.RENEWAL)){
                if (option.getMonthlyBandedPremiumRenewal() != null) {
                    plan.setMonthlyBandedPremium(option.getMonthlyBandedPremiumRenewal().floatValue());
                }
                if (option.getOufOfStateMonthlyBandedPremiumRenewal() != null) {
                    plan.setOutOfStateMonthlyBandedPremium(option.getOufOfStateMonthlyBandedPremiumRenewal().floatValue());
                }
            } else {
                if (option.getMonthlyBandedPremium() != null) {
                    plan.setMonthlyBandedPremium(option.getMonthlyBandedPremium().floatValue());
                }
                if (option.getOufOfStateMonthlyBandedPremium() != null) {
                    plan.setOutOfStateMonthlyBandedPremium(option.getOufOfStateMonthlyBandedPremium().floatValue());
                }
            }
        }  
    }
    
    private Option getOrCreateClientPlanOption(ClientPlan clientPlan, int ratingTiers,
        OptionPlanDto plan) {
        RFP rfp;
        Option opt;
        if (clientPlan.getOptionId() != null) {
            opt = optionRepository.findOne(clientPlan.getOptionId());
            rfp = opt.getRfp();
        } else {
            PlanCategory product = PlanCategory.findByPlanType(clientPlan.getPlanType());
            rfp = rfpRepository.findByClientClientIdAndProduct(clientPlan.getClient().getClientId(), product.name());
            if(rfp == null) {
                rfp = new RFP();
                if (product != null) {
                    rfp.setProduct(product.name());
                }
            }
            String contrType;
            switch (plan.getErContributionFormat()) {
                case Constants.ER_CONTRIBUTION_FORMAT_DOLLAR:
                    contrType = "$";
                    break;
                case Constants.ER_CONTRIBUTION_FORMAT_PERCENT:
                    contrType = "%";
                    break;
                default:
                    contrType = plan.getErContributionFormat();
                    break;
            }
            rfp.setContributionType(contrType);
            //rfp.setCommission();
            rfp.setClient(clientPlan.getClient());
            rfp.setLastUpdated(new Date());
            opt = new Option();
        }
        rfp.setRatingTiers(ratingTiers);
        rfp = rfpRepository.save(rfp);
        opt.setRfp(rfp);
        opt.setLabel(plan.getIncumbentPlanName());
        opt.setPlanType(plan.getIncumbentPlanType());
        opt.setRateType(plan.getRateType());
        opt = optionRepository.save(opt);
        clientPlan.setOptionId(opt.getId());
        return opt;
    }


    private void processRatingTiers(int ratingTiers, OptionPlanDto plan) {
        // invalidate irrelevant values (for example user entered 4-tiers rates and changed it to 3-tiers)
        if (ratingTiers < 4) {
            plan.setTier4Rate(null);
            plan.setTier4OosRate(null);
            plan.setTier4Contribution(null);
            plan.setTier4OosContribution(null);
            plan.setTier4Enrollment(null);
            plan.setTier4OosEnrollment(null);
        }
        if (ratingTiers < 3) {
            plan.setTier3Rate(null);
            plan.setTier3OosRate(null);
            plan.setTier3Contribution(null);
            plan.setTier3OosContribution(null);
            plan.setTier3Enrollment(null);
            plan.setTier3OosEnrollment(null);
        }
        if (ratingTiers < 2) {
            plan.setTier2Rate(null);
            plan.setTier2OosRate(null);
            plan.setTier2Contribution(null);
            plan.setTier2OosContribution(null);
            plan.setTier2Enrollment(null);
            plan.setTier2OosEnrollment(null);
        }
    }

    private void processBandedRateType(OptionPlanDto plan, Option option, OptionType optionType) {
        if (plan.getRateType() != null && plan.getRateType().equals(RateType.BANDED)) {
            int ratingTiers = option.getRfp().getRatingTiers();
            if (plan.getMonthlyBandedPremium() != null) {
                float costPerEmployee = PlanCalcHelper
                    .calcEmployeeCost(plan.getMonthlyBandedPremium(),
                        plan.getTier1Enrollment(), plan.getTier2Enrollment(),
                        plan.getTier3Enrollment(),
                        plan.getTier4Enrollment());

                plan.setTier1Rate(costPerEmployee);
                if (ratingTiers > 1) {
                    plan.setTier2Rate(costPerEmployee);
                }
                if (ratingTiers > 2) {
                    plan.setTier3Rate(costPerEmployee);
                }
                if (ratingTiers > 3) {
                    plan.setTier4Rate(costPerEmployee);
                }
                plan.setOutOfStateRate(false);

                if(OptionType.RENEWAL.equals(optionType)){
                    option.setMonthlyBandedPremiumRenewal(plan.getMonthlyBandedPremium().doubleValue());
                } else {
                    option.setMonthlyBandedPremium(plan.getMonthlyBandedPremium().doubleValue());
                }
            }
            if (plan.getOutOfStateMonthlyBandedPremium() != null) {
                float oosCostPerEmployee = PlanCalcHelper
                    .calcEmployeeCost(plan.getOutOfStateMonthlyBandedPremium(),
                        plan.getTier1Enrollment(), plan.getTier2Enrollment(),
                        plan.getTier3Enrollment(),
                        plan.getTier4Enrollment());

                plan.setTier1OosRate(oosCostPerEmployee);
                if (ratingTiers > 1) {
                    plan.setTier2OosRate(oosCostPerEmployee);
                }
                if (ratingTiers > 2) {
                    plan.setTier3OosRate(oosCostPerEmployee);
                }
                if (ratingTiers > 3) {
                    plan.setTier4OosRate(oosCostPerEmployee);
                }
                plan.setOutOfStateRate(true);

                if(OptionType.RENEWAL.equals(optionType)){
                    option.setOufOfStateMonthlyBandedPremiumRenewal(plan.getOutOfStateMonthlyBandedPremium().doubleValue());
                } else {
                    option.setOufOfStateMonthlyBandedPremium(plan.getOutOfStateMonthlyBandedPremium().doubleValue());
                }
            }
            optionRepository.save(option);
        }
    }

    private void safeDeleteClientPlans(Set<Long> clientPlanIds, Long clientId, String product) {
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(clientId, product);
        // find and delete all FK to client plans that will removed
        Set<Long> rfpQuoteNetworkPlansToDelete = new HashSet<>();
        Set<Long> rfpQuoteNetworkToDelete = new HashSet<>();
        for (RfpQuote rfpQuote : rfpQuotes) {
            for (RfpQuoteOption opt : rfpQuote.getRfpQuoteOptions()) {
                for (
                    Iterator<RfpQuoteOptionNetwork> it = opt.getRfpQuoteOptionNetworks().iterator();
                    it.hasNext(); ) {
                    RfpQuoteOptionNetwork rqon = it.next();
                    if (rqon.getClientPlan() != null
                        && clientPlanIds.contains(rqon.getClientPlan().getClientPlanId())) {

                        // delete the rfpQuoteNetwork and plans
                        RfpQuoteNetwork rfpQuoteNetwork = rqon.getRfpQuoteNetwork();
                        rfpQuoteNetworkPlansToDelete.addAll(
                            rfpQuoteNetwork.getRfpQuoteNetworkPlans()
                                .stream()
                                .map(RfpQuoteNetworkPlan::getRfpQuoteNetworkPlanId)
                                .collect(toSet()
                            )
                        );

                        rfpQuoteNetworkToDelete.add(rfpQuoteNetwork.getRfpQuoteNetworkId());
                        rfpQuoteOptionNetworkRepository.delete(rqon.getRfpQuoteOptionNetworkId());
                        it.remove();
                    }
                }
            }
        }
        for (Long clientPlanId : clientPlanIds) {
            clientPlanRepository.delete(clientPlanId);
        }

//        for(Long rfpQuoteNetworkPlanId : rfpQuoteNetworkPlansToDelete){
//            basePlanService.deletePlan(rfpQuoteNetworkPlanId);
//        }
//
//        for(Long rfpQuoteNetworkId : rfpQuoteNetworkToDelete){
//            rfpQuoteNetworkRepository.delete(rfpQuoteNetworkId);
//        }
    }

    // synchronize the networks and plans of Renewal with Current
    public void initOrUpdateRenewalOptionPlans(List<ClientPlan> clientPlans, Long clientId,
        String product) {

        PlanCategory category = PlanCategory.valueOf(product);
    	if (PlanCategory.isAncillary(product)) {
    		RfpQuoteAncillaryOption renewalOpt = findAncillaryRenewalOption(clientId, product);
            if (renewalOpt == null) {
                return;
            }
            setOrUpdateRenewalRfpCarrier(renewalOpt, clientId, category);
    		updateAncillaryOptionWithClientPlans(renewalOpt, clientPlans);
    	}
        /*
         * 1) cp1 -> cp1, cp2 : need to create renewal plan cp2
         * 2) cp1, cp2 -> cp1 : need to remove renewal plan cp2
         * 3) cp1, cp2 -> cp1, cp3 : need to remove renewal plan cp2 and create renewal plan cp3
         */
        RfpQuoteOption renewalOpt = findRenewalOption(clientId, product);
        if (renewalOpt == null) {
            return;
        }

        // validate client plans by product
        for (ClientPlan cp : clientPlans) {
            if (cp.getPnn() != null && !category.getPlanTypes()
                .contains(cp.getPnn().getPlanType())) {
                throw new BaseException(
                    String.format("Unavailable client plan type %s for product %s",
                        cp.getPnn().getPlanType(), product));
            }
        }

        // update renewal quote type and rfp carrier if current has changes(need to account for kaiser);
        setOrUpdateRenewalQuoteType(clientPlans, renewalOpt);
        setOrUpdateRenewalRfpCarrier(renewalOpt, clientId, category);

        Map<Long, ClientPlan> clientPlansById = clientPlans.stream()
            .collect(Collectors.toMap(ClientPlan::getClientPlanId, Function.identity()));
        for (RfpQuoteOptionNetwork rqon : renewalOpt.getRfpQuoteOptionNetworks()) {
            if (rqon.getClientPlan() != null) {
                ClientPlan matchCP = clientPlansById.remove(rqon.getClientPlan().getClientPlanId());
                if (matchCP != null) {
                    updateRqonWithClientPlan(renewalOpt, matchCP, rqon);
                }
            }
        }

        // create missing rqons for client plans
        for (ClientPlan clientPlan : clientPlansById.values()) {
            createRfpQuoteOptionNetworkByClientPlan(renewalOpt, clientPlan);
        }
    }

    private void setOrUpdateRenewalRfpCarrier(QuoteOption quoteOption,
        Long clientId,  PlanCategory category){

        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(clientId, category.getPlanTypes());
        RfpCarrier rfpCarrier = findCurrentOptionRfpCarrier(clientPlans, category.name());
        if(!quoteOption.getRfpQuote().getRfpSubmission().getRfpCarrier().getRfpCarrierId().equals(rfpCarrier.getRfpCarrierId())){

            quoteOption.getRfpQuote().getRfpSubmission().setRfpCarrier(rfpCarrier);
            rfpSubmissionRepository.save(quoteOption.getRfpQuote().getRfpSubmission());
        }
    }

    private void setOrUpdateRenewalQuoteType(List<ClientPlan> clientPlans,
        RfpQuoteOption renewalOpt) {

        RfpQuote currentQuote = sharedRfpQuoteService.prepareCurrentQuote(clientPlans);
        if (!renewalOpt.getRfpQuote().getQuoteType().equals(currentQuote.getQuoteType())) {
            renewalOpt.getRfpQuote().setQuoteType(currentQuote.getQuoteType());
            rfpQuoteOptionRepository.save(renewalOpt);
        }
    }

    public RfpQuoteOptionNetwork createRfpQuoteOptionNetworkByClientPlan(RfpQuoteOption option,
        ClientPlan clientPlan) {
        if (clientPlan.getPnn() == null) {
            return null;
        }
        RfpQuoteOptionNetwork rqon = new RfpQuoteOptionNetwork();
        rqon.setRfpQuoteVersion(option.getRfpQuoteVersion());
        rqon.setRfpQuoteOption(option);
        rqon.setClientPlan(clientPlan);

        rqon = updateRqonWithClientPlan(option, clientPlan, rqon);

        option.getRfpQuoteOptionNetworks().add(rqon);

        return rqon;
    }

    public void updateBrokerAppAncillaryRenewalCardFromCurrentPlan(Long clientId, AncillaryPlanDto dto){

        AncillaryPlan ancPlan = ancillaryPlanRepository.findOne(dto.getAncillaryPlanId());
        if(ancPlan == null) {
            throw new NotFoundException("AncillaryPlan not found by id: " + dto.getAncillaryPlanId());
        }

        Client client = clientRepository.findOne(clientId);
        if(client == null){
            throw new BaseException("Client not found").withFields(field("client_id", clientId));
        }

        PlanCategory product = ancPlan.getProduct();
        ClientPlan clientPlan = clientPlanRepository.findByClientAndPnnPlanTypeAndAncillaryPlan(
            client, product.name(), ancPlan);

        RfpQuoteAncillaryOption renewalOpt = findAncillaryRenewalOption(clientId, product.name());
        if(clientPlan == null || renewalOpt == null){
            return;
        }

        setOrUpdateRenewalRfpCarrier(renewalOpt, clientId, product);
        updateAncillaryOptionWithClientPlans(renewalOpt, Arrays.asList(clientPlan));
    }

    private void updateAncillaryOptionWithClientPlans(RfpQuoteAncillaryOption option, List<ClientPlan> clientPlans) {
    	if (clientPlans.size() > 1) {
			throw new IllegalArgumentException("To many client plans for product: " 
					+ option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory());
		}
    	ClientPlan clientPlan = clientPlans.get(0);
    	if (clientPlan.getAncillaryPlan() == null) {
    		return;
    	}
    	
    	RfpQuoteAncillaryPlan rfpQuoteAncillaryPlan = option.getRfpQuoteAncillaryPlan();
        if (rfpQuoteAncillaryPlan == null) {
        	rfpQuoteAncillaryPlan = new RfpQuoteAncillaryPlan();
        	rfpQuoteAncillaryPlan.setMatchPlan(false); // FIXME
        	rfpQuoteAncillaryPlan.setRfpQuote(option.getRfpQuote());
        	AncillaryPlan ancillaryPlan = clientPlan.getAncillaryPlan().copy();
        	ancillaryPlan.setPlanYear(Year.now().getValue()); 
        	rfpQuoteAncillaryPlan.setAncillaryPlan(ancillaryPlan);
        }

        AncillaryPlan ancPlan = rfpQuoteAncillaryPlan.getAncillaryPlan();
        AncillaryPlan clientPlanAncillaryPlan = clientPlan.getAncillaryPlan();
        // update main (and allowed to user edit) plan/class properties
        if (allNotNull(ancPlan, clientPlanAncillaryPlan, ancPlan.getAncillaryPlanId(), clientPlanAncillaryPlan.getAncillaryPlanId())) {
        	ancPlan.setPlanName(clientPlanAncillaryPlan.getPlanName());
        	// clientPlan.getPnn().setName(clientPlanAncillaryPlan.getPlanName());
        	ancPlan.getClasses().clear();
        	for (AncillaryClass clazz : clientPlanAncillaryPlan.getClasses()) {
        		AncillaryClass classCopy = clazz.copy();
                classCopy.setAncillaryPlan(ancPlan);
                ancPlan.getClasses().add(classCopy);
            }
        }

        final OptionType optType = RfpQuoteService.getOptionType(option.getName());
        
    	AncillaryRate current = clientPlan.getAncillaryPlan().getRates();
    	AncillaryRate renewal = rfpQuoteAncillaryPlan.getAncillaryPlan().getRates();
    	
    	renewal.setVolume(firstNotZero(renewal.getVolume(), current.getVolume()));
    	renewal.setRateGuarantee(!isBlank(renewal.getRateGuarantee()) ? renewal.getRateGuarantee() : current.getRateGuarantee());
    	if (renewal instanceof BasicRate) {
    		BasicRate br = (BasicRate) renewal;
    		BasicRate cbr = (BasicRate) current;
    		if (optType == OptionType.RENEWAL) {
    			// set renewal rates from current if new plan only
                if(renewal.getAncillaryRateId() == null){
                    br.setCurrentADD(firstNotZero(cbr.getRenewalADD(), br.getCurrentADD()));
                    br.setCurrentLife(firstNotZero(cbr.getRenewalLife(), br.getCurrentLife()));
                    br.setCurrentSL(firstNotZero(cbr.getRenewalSL(), br.getCurrentSL()));
                }
    		} else {
    			br.setCurrentADD(cbr.getCurrentADD());
        		br.setCurrentLife(cbr.getCurrentLife());
        		br.setCurrentSL(cbr.getCurrentSL());
    		}
    	} else if (renewal instanceof VoluntaryRate) {
    		VoluntaryRate vr = (VoluntaryRate) renewal;
    		VoluntaryRate cvr = (VoluntaryRate) current;
    		vr.setMonthlyCost(firstNotZero(vr.getMonthlyCost(), cvr.getMonthlyCost()));
    		vr.setEmployee(vr.getEmployee() != cvr.getEmployee() ? vr.getEmployee() : cvr.getEmployee());
    		vr.setEmployeeTobacco(vr.getEmployeeTobacco() != cvr.getEmployeeTobacco() ? vr.getEmployeeTobacco() : cvr.getEmployeeTobacco());
    		vr.setSpouse(vr.getSpouse() != cvr.getSpouse() ? vr.getSpouse() : cvr.getSpouse());
    		vr.setSpouseBased(!isBlank(vr.getSpouseBased()) ? vr.getSpouseBased() : cvr.getSpouseBased());
    		vr.setRateChildADD(firstNotZero(vr.getRateChildADD(), cvr.getRateChildADD()));
    		vr.setRateChildLife(firstNotZero(vr.getRateChildLife(), cvr.getRateChildLife()));
    		vr.setRateEmpADD(firstNotZero(vr.getRateEmpADD(), cvr.getRateEmpADD()));
    		vr.setRateSpouseADD(firstNotZero(vr.getRateSpouseADD(), cvr.getRateSpouseADD()));
    		if (isNotEmpty(cvr.getAges())) {
    			boolean isRenewalEntered = false;
    			for (AncillaryRateAge age : cvr.getAges()) {
					if (age.getRenewalEmp() > 0f || age.getRenewalEmpTobacco() > 0f 
							|| age.getRenewalSpouse() > 0f) {
						isRenewalEntered = true;
						break;
					}
				}
    			if (isEmpty(vr.getAges()) || isRenewalEntered) {
	    			vr.setAges(new ArrayList<>());
	    			for (AncillaryRateAge age : cvr.getAges()) {
	                    AncillaryRateAge ageCopy = age.copy();
	                    ageCopy.setAncillaryRate(vr);
	                    vr.getAges().add(ageCopy);
	                    if (optType == OptionType.RENEWAL) {
                            // set renewal rates from current if new plan only
                            if(renewal.getAncillaryRateId() == null){
                                ageCopy.setCurrentEmp(firstNotZero(age.getRenewalEmp(), age.getCurrentEmp()));
                                ageCopy.setCurrentEmpTobacco(firstNotZero(age.getRenewalEmpTobacco(), age.getCurrentEmpTobacco()));
                                ageCopy.setCurrentSpouse(firstNotZero(age.getRenewalSpouse(), age.getCurrentSpouse()));
                            }
	                    }
	                }
    			}
    		}
    	}	
    	ancillaryPlanRepository.save(rfpQuoteAncillaryPlan.getAncillaryPlan());
    	rfpQuoteAncillaryPlanRepository.save(rfpQuoteAncillaryPlan);
    	
    	option.setRfpQuoteAncillaryPlan(rfpQuoteAncillaryPlan);
    	rfpQuoteAncillaryOptionRepository.save(option);
	}

    private RfpQuoteOptionNetwork updateRqonWithClientPlan(RfpQuoteOption option,
        ClientPlan clientPlan, RfpQuoteOptionNetwork rqon) {

        rqon.setOutOfState(clientPlan.isOutOfState());

        rqon.setErContributionFormat(clientPlan.getErContributionFormat());
        rqon.setTier1ErContribution(clientPlan.getTier1ErContribution());
        rqon.setTier2ErContribution(clientPlan.getTier2ErContribution());
        rqon.setTier3ErContribution(clientPlan.getTier3ErContribution());
        rqon.setTier4ErContribution(clientPlan.getTier4ErContribution());

        rqon.setTier1Census(clientPlan.getTier1Census());
        rqon.setTier2Census(clientPlan.getTier2Census());
        rqon.setTier3Census(clientPlan.getTier3Census());
        rqon.setTier4Census(clientPlan.getTier4Census());

        RfpQuoteNetwork quoteNetwork = findOrCreateRfpQuoteNetwork(option.getRfpQuote(),
            clientPlan.getPnn().getNetwork());
        rqon.setRfpQuoteNetwork(quoteNetwork);

        RfpQuoteNetworkPlan quoteNetworkPlan = rqon.getSelectedRfpQuoteNetworkPlan();
        if (rfpQuoteService.getOptionType(option.getRfpQuoteOptionName())
            .equals(OptionType.RENEWAL)) {
            // update renewal if selected plan is null or (if selected plan is not null and client plans rates are not null).
            if (quoteNetworkPlan == null) {
                quoteNetworkPlan = createRfpQuoteNetworkPlan(quoteNetwork, clientPlan.getPnn(),
                    clientPlan.getTier1Renewal(), clientPlan.getTier2Renewal(),
                    clientPlan.getTier3Renewal(), clientPlan.getTier4Renewal());
            } /*else if (ObjectUtils
                .anyNotNull(clientPlan.getTier1Renewal(), clientPlan.getTier2Renewal(),
                    clientPlan.getTier3Renewal(), clientPlan.getTier4Renewal())) {
                updateRfpQuoteNetworkPlanRates(quoteNetworkPlan,
                    clientPlan.getTier1Renewal(), clientPlan.getTier2Renewal(),
                    clientPlan.getTier3Renewal(), clientPlan.getTier4Renewal());
            }*/
        } else {
            if (quoteNetworkPlan == null) {
                quoteNetworkPlan = createRfpQuoteNetworkPlan(quoteNetwork, clientPlan.getPnn(),
                    clientPlan.getTier1Rate(), clientPlan.getTier2Rate(), clientPlan.getTier3Rate(),
                    clientPlan.getTier4Rate());
            } else {
                updateRfpQuoteNetworkPlanRates(quoteNetworkPlan,
                    clientPlan.getTier1Rate(), clientPlan.getTier2Rate(), clientPlan.getTier3Rate(),
                    clientPlan.getTier4Rate());
            }
        }
        rqon.setSelectedRfpQuoteNetworkPlan(quoteNetworkPlan);
        return rfpQuoteOptionNetworkRepository.save(rqon);
    }

    private RfpQuoteNetwork findOrCreateRfpQuoteNetwork(RfpQuote rfpQuote, Network network) {
        List<RfpQuoteNetwork> networks = rfpQuoteNetworkRepository
            .findByRfpQuoteAndNetworkNetworkId(rfpQuote, network.getNetworkId());
        RfpQuoteNetwork quoteNetwork = networks.stream()
            .filter(n -> n.isaLaCarte() && n.getRfpQuoteNetworkCombination() == null)
            .findFirst().orElseGet(() -> {
                RfpQuoteNetwork rqn = new RfpQuoteNetwork(rfpQuote, network, network.getName());
                rqn.setaLaCarte(true);

                return rfpQuoteNetworkRepository.save(rqn);
            });
        return quoteNetwork;
    }

    private RfpQuoteNetworkPlan createRfpQuoteNetworkPlan(RfpQuoteNetwork rfpQuoteNetwork,
        PlanNameByNetwork pnn,
        Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate) {
        RfpQuoteNetworkPlan qnp = new RfpQuoteNetworkPlan();
        qnp.setPnn(pnn);
        qnp.setRfpQuoteNetwork(rfpQuoteNetwork);
        qnp.setRfpQuoteVersion(rfpQuoteNetwork.getRfpQuoteVersion());

        updateRfpQuoteNetworkPlanRates(qnp, tier1Rate, tier2Rate, tier3Rate, tier4Rate);

        rfpQuoteNetwork.getRfpQuoteNetworkPlans().add(qnp);
        return rfpQuoteNetworkPlanRepository.save(qnp);
    }

    private RfpQuoteNetworkPlan updateRfpQuoteNetworkPlanRates(RfpQuoteNetworkPlan qnp,
        Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate) {
        qnp.setTier1Rate(floatValue(tier1Rate));
        qnp.setTier2Rate(floatValue(tier2Rate));
        qnp.setTier3Rate(floatValue(tier3Rate));
        qnp.setTier4Rate(floatValue(tier4Rate));
        return qnp;
    }

    public void updateRenewalCardUponRfpSubmission(ClientPlan clientPlan) {

        // find renewal option if present
        PlanCategory product = PlanCategory.findByPlanType(clientPlan.getPlanType());
        initOrUpdateRenewalOptionPlans(Arrays.asList(clientPlan),
            clientPlan.getClient().getClientId(), product.name());
    }

    private void updateQuoteOption(int ratingTiers, Long rfpQuoteOptionId,
        List<OptionPlanDto> optionPlans) {
        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);
        if (option == null) {
            throw new NotFoundException("Option not found")
                .withFields(field("rfp_quote_option_id", rfpQuoteOptionId));
        }
        ratingTiers = firstNonNull(ratingTiers, option.getRfpQuote().getRatingTiers());
        option.getRfpQuote().setRatingTiers(ratingTiers);
        option = rfpQuoteOptionRepository.save(option);

        List<RfpQuoteOptionNetwork> outOfStateNetworks = findOutOfStateRqons(
            option.getRfpQuoteOptionNetworks());
        List<RfpQuoteOptionNetwork> oosNetworksToRemove = new ArrayList<>();
        Map<Long, RfpQuoteOptionNetwork> rqonById = option.getRfpQuoteOptionNetworks().stream()
            .filter(r -> !r.isOutOfState())
            .collect(Collectors
                .toMap(RfpQuoteOptionNetwork::getRfpQuoteOptionNetworkId, Function.identity()));

        for (OptionPlanDto plan : optionPlans) {
            if (plan.getIncumbentPlanId() == null) {
                throw new BaseException("Missing required Option update param: incumbentPlanId");
            }
            ClientPlan incumbentPlan = clientPlanRepository
                .findClientPlan(plan.getIncumbentPlanId());
            if (incumbentPlan == null) {
                throw new BaseException("ClientPlan not found by id: " + plan.getIncumbentPlanId());
            }
            if (incumbentPlan.getPnn() == null) {
                throw new BaseException(
                    "Cannot create replacement plan by incumbent plan: plan not set");
            }
            RfpQuoteOptionNetwork rqon = null;
            if (plan.getPlanId() == null) { // add new rqon
                rqon = createRfpQuoteOptionNetworkByClientPlan(option, incumbentPlan);
            } else {
                rqon = rqonById.get(plan.getPlanId());
                if (rqon == null) {
                    throw new BaseException(
                        "RfpQuoteOptionNetwork not found by id: " + plan.getPlanId());
                }
            }
            // find "old" oos plan copy before replacement
            RfpQuoteOptionNetwork oosRqon = lookupOutOfStateRqon(rqon, outOfStateNetworks);

            // update replacement plan
            if (plan.getReplacementPlanId() != null) {
                PlanNameByNetwork replacementPnn = pnnRepository
                    .findOne(plan.getReplacementPlanId());
                if (replacementPnn == null) {
                    throw new BaseException(
                        "Replacement plan not found by id: " + plan.getReplacementPlanId());
                }
                RfpQuoteNetwork replacementNetwork = findOrCreateRfpQuoteNetwork(
                    option.getRfpQuote(), replacementPnn.getNetwork());
                if (!replacementNetwork.getRfpQuoteNetworkId()
                    .equals(rqon.getRfpQuoteNetwork().getRfpQuoteNetworkId())) {
                    // change network and plan
                    rqon.setRfpQuoteNetwork(replacementNetwork);
                    RfpQuoteNetworkPlan replacementPlan = createRfpQuoteNetworkPlan(
                        replacementNetwork, replacementPnn,
                        plan.getTier1Rate(), plan.getTier2Rate(), plan.getTier3Rate(),
                        plan.getTier4Rate());
                    rqon.setSelectedRfpQuoteNetworkPlan(replacementPlan);
                    // update oos plan copy as well
                    if (oosRqon != null) {
                        oosRqon.setRfpQuoteNetwork(replacementNetwork);
                        oosRqon.setSelectedRfpQuoteNetworkPlan(replacementPlan);
                    }
                }
            }
            // required in getOrCreateClientPlanOption
            if (plan.getErContributionFormat() == null) {
                throw new BaseException("Missing required param: erContributionFormat");
            }
            Option cpOption = getOrCreateClientPlanOption(incumbentPlan, ratingTiers, plan);
            
            // check and update input values by RatingTiers
            processRatingTiers(ratingTiers, plan);
            // calc rate values by premium
            processBandedRateType(plan, cpOption, rfpQuoteService.getOptionType(option.getRfpQuoteOptionName()));
            
            // update rates
            RfpQuoteNetworkPlan replacementPlan = rqon.getSelectedRfpQuoteNetworkPlan();
            if (replacementPlan != null) {
                replacementPlan.setTier1Rate(floatValue(plan.getTier1Rate()));
                replacementPlan.setTier2Rate(floatValue(plan.getTier2Rate()));
                replacementPlan.setTier3Rate(floatValue(plan.getTier3Rate()));
                replacementPlan.setTier4Rate(floatValue(plan.getTier4Rate()));
                rfpQuoteNetworkPlanRepository.save(replacementPlan);
            } else {
                replacementPlan = createRfpQuoteNetworkPlan(rqon.getRfpQuoteNetwork(),
                    incumbentPlan.getPnn(),
                    plan.getTier1Rate(), plan.getTier2Rate(), plan.getTier3Rate(),
                    plan.getTier4Rate());
                rqon.setSelectedRfpQuoteNetworkPlan(replacementPlan);
            }

            // create/update OutOfState rates
            if (plan.isOutOfStateRate()) {
                if (oosRqon == null) {
                    oosRqon = createRfpQuoteOptionNetworkByClientPlan(option, incumbentPlan);
                    oosRqon.setOutOfState(true);
                    oosRqon.setRfpQuoteNetwork(rqon.getRfpQuoteNetwork());
                    rfpQuoteOptionNetworkRepository.save(oosRqon);
                }
                RfpQuoteNetworkPlan oosPlan = oosRqon.getSelectedRfpQuoteNetworkPlan();
                // selected plan is not null (set up above)
                oosPlan.setTier1Rate(floatValue(plan.getTier1OosRate()));
                oosPlan.setTier2Rate(floatValue(plan.getTier2OosRate()));
                oosPlan.setTier3Rate(floatValue(plan.getTier3OosRate()));
                oosPlan.setTier4Rate(floatValue(plan.getTier4OosRate()));

                rfpQuoteNetworkPlanRepository.save(oosPlan);
            } else if (oosRqon != null) {
                oosNetworksToRemove.add(oosRqon);
            }
            rfpQuoteOptionNetworkRepository.save(rqon);
        }

        rfpQuoteOptionNetworkRepository.delete(oosNetworksToRemove);
        option.getRfpQuoteOptionNetworks().removeAll(oosNetworksToRemove);
    }

    public List<QuoteOptionPlanComparisonDto> comparePlans(String product, Long clientPlanId,
        List<Long> carrierIds) {
        ClientPlan clientPlan = clientPlanRepository.findOne(clientPlanId);

        QuoteOptionListDto options = rfpQuoteService
            .getQuoteOptions(clientPlan.getClient().getClientId(), product);
        List<Long> rfpQuoteOptionIds = options.getOptions().stream()
            .map(QuoteOptionBriefDto::getId)
            .collect(Collectors.toList());
        return filterDuplicateAndMissingPlans(
            rfpQuoteService.compareQuoteOptions(rfpQuoteOptionIds, true, clientPlanId, carrierIds));
    }

    public byte[] comparePlansFile(String product, Long clientPlanId, List<Long> carrierIds) {
        ClientPlan clientPlan = clientPlanRepository.findOne(clientPlanId);
        List<QuoteOptionPlanComparisonDto> compareResult = comparePlans(product, clientPlanId,
            carrierIds);
        return rfpQuoteService
            .compareQuoteOptionsFile(clientPlan.getClient().getClientId(), product, compareResult);
    }

    private List<QuoteOptionPlanComparisonDto> filterDuplicateAndMissingPlans(
        List<QuoteOptionPlanComparisonDto> compareResult) {
        if (compareResult.isEmpty()) {
            return compareResult;
        }
        // remove duplicates: group by unique parameters and take first
        Map<Triple<String, String, Float>, List<QuoteOptionPlanComparisonDto>> optionsByUniqueTriple = compareResult
            .stream()
            // remove empty plans from result (not needed in broker-app compare plans page)
            .filter(o -> CollectionUtils.isNotEmpty(o.getPlans())
                && o.getPlans().get(0).networkPlan != null)
            .collect(Collectors.groupingBy(o -> Triple.of(
                o.getCarrier(),
                o.getPlans().get(0).networkPlan.getName(),
                o.getPlans().get(0).networkPlan.getPercentDifference()),
                LinkedHashMap::new,
                Collectors.toList()));

        List<QuoteOptionPlanComparisonDto> result = optionsByUniqueTriple.values().stream()
            .map(duplicates -> {
                // tale first plan
                QuoteOptionPlanComparisonDto joined = duplicates.get(0);
                if (duplicates.size() > 1) { // join duplicate options names
                    joined.setName(duplicates.stream()
                        .map(QuoteOptionPlanComparisonDto::getName)
                        .collect(Collectors.joining(", ")));
                }
                return joined;
            })
            .collect(Collectors.toList());

        return result;
    }

    public PresentationQuoteOptionListDto getPresentationAlternatives(Long clientId) {

        PresentationQuoteOptionListDto result = new PresentationQuoteOptionListDto();

        // find and set current and renewal options
        HashMap<String, Float> currentProductTotals = new HashMap<>();
        setPresentationCurrentAndRenewal(clientId, result, currentProductTotals);

        // add alternatives
        List<PresentationOption> presentationOptions = presentationOptionRepository
            .findByClientClientId(clientId);
        if (!isEmpty(presentationOptions)) {
            for (PresentationOption presentationOption : presentationOptions) {
                PresentationAlternativeDto dto = getPresentationAlternativeDto(presentationOption,
                    currentProductTotals, result.getCurrentTotal());

                result.getAlternatives().add(dto);
            }
        }

        return result;
    }

    private void setPresentationCurrentAndRenewal(Long clientId,
        PresentationQuoteOptionListDto result, HashMap<String, Float> currentProductTotals) {

        Float currentColumnTotal = 0F;
        Float renewalColumnTotal = 0F;
        for (PlanCategory planCategory : Arrays.asList(MEDICAL, DENTAL, VISION, LIFE, STD, LTD)) {
            switch (planCategory) {
                case MEDICAL:
                case DENTAL:
                case VISION:
                    QuoteOptionBriefDto currentOption = getCurrentOptions(clientId, planCategory);
                    if (currentOption != null) {
                        currentOption.setCategory(planCategory.name());
                        currentColumnTotal += currentOption.getTotalAnnualPremium();
                        result.getCurrents().add(currentOption);

                        if (!currentProductTotals.containsKey(planCategory.name())) {
                            currentProductTotals
                                .put(planCategory.name(), currentOption.getTotalAnnualPremium());
                        }
                    }

                    List<QuoteOptionBriefDto> renewalOptions = rfpQuoteOptionRepository
                        .findByClientIdAndCategory(clientId, planCategory.name()).stream()
                        .filter(opt -> StringUtils.containsIgnoreCase(opt.getName(), "Renewal 1") ||
                            StringUtils.equalsIgnoreCase(opt.getName(), "Renewal"))
                        .map(opt -> rfpQuoteService.buildQuoteOptionBrief(opt))
                        .collect(Collectors.toList());

                    if (!isEmpty(renewalOptions)) {
                        for(QuoteOptionBriefDto renewalOption : renewalOptions){
                            renewalOption.setCategory(planCategory.name());
                            renewalColumnTotal += renewalOption.getTotalAnnualPremium();
                            renewalOption.setPercentDifference(
                                MathUtils.diffPecent(renewalOption.getTotalAnnualPremium(),
                                    currentOption.getTotalAnnualPremium(), 1)
                            );
                            result.getRenewals().add(renewalOption);
                        }
                    }
                    break;
                case LIFE:
                case STD:
                case LTD:
                    QuoteOptionBriefDto ancillaryCurrentOption = rfpQuoteService
                        .findCurrentAncillaryOption(clientId, planCategory.name());
                    if (ancillaryCurrentOption != null) {
                        ancillaryCurrentOption.setCategory(planCategory.name());
                        currentColumnTotal += ancillaryCurrentOption.getTotalAnnualPremium();
                        result.getCurrents().add(ancillaryCurrentOption);

                        if (!currentProductTotals.containsKey(planCategory.name())) {
                            currentProductTotals.put(planCategory.name(),
                                ancillaryCurrentOption.getTotalAnnualPremium());
                        }
                    }

                    List<RfpQuote> quotes = rfpQuoteRepository
                        .findByClientIdAndCategoryAndQuoteType(
                            clientId, planCategory.name(), QuoteType.STANDARD);

                    List<RfpQuoteAncillaryOption> allOptions = new ArrayList<>();
                    for (RfpQuote rfpQuote : quotes) {
                        allOptions
                            .addAll(rfpQuoteAncillaryOptionRepository.findByRfpQuote(rfpQuote));
                    }

                    renewalOptions = allOptions.stream()
                        .filter(opt -> StringUtils.containsIgnoreCase(opt.getName(), "Renewal 1") ||
                            StringUtils.equalsIgnoreCase(opt.getName(), "Renewal"))

                        .map(opt -> rfpQuoteService.buildAncillaryQuoteOptionBriefDto(opt))
                        .collect(Collectors.toList());

                    if (!isEmpty(renewalOptions)) {
                        for(QuoteOptionBriefDto renewalOption : renewalOptions){
                            renewalOption.setCategory(planCategory.name());
                            renewalColumnTotal += renewalOption.getTotalAnnualPremium();
                            result.getRenewals().add(renewalOption);

                            renewalOption.setPercentDifference(
                                MathUtils.diffPecent(renewalOption.getTotalAnnualPremium(),
                                    ancillaryCurrentOption.getTotalAnnualPremium(), 1)
                            );
                        }
                    }
                    break;
            }
        }
        result.setCurrentTotal(currentColumnTotal);
        result.setRenewalTotal(renewalColumnTotal);
        result.setRenewalPercentage(
            MathUtils.diffPecent(result.getRenewalTotal(),
                result.getCurrentTotal(), 1)
        );
    }

    private PresentationAlternativeDto getPresentationAlternativeDto(
        PresentationOption presentationOption,
        HashMap<String, Float> currentProductTotals, Float currentTotal) {

        Float alternativeTotal = 0F;
        PresentationAlternativeDto dto = new PresentationAlternativeDto();
        dto.setName(presentationOption.getName());
        dto.setPresentationOptionId(presentationOption.getPresentationOptionId() != null ?
            presentationOption.getPresentationOptionId().toString() : null);

        if (presentationOption.getDentalRfpQuoteOption() != null) {
            PresentationAlternativeOption option = getPresentationAlternativeOption(
                presentationOption.getDentalRfpQuoteOption(), 0f);

            option.setPercentage(MathUtils.diffPecent(option.getTotal(),
                currentProductTotals.containsKey("DENTAL") ? currentProductTotals.get("DENTAL")
                    : 0F, 1));

            alternativeTotal += option.getTotal();
            dto.getProductsOptions().add(option);
        }

        if (presentationOption.getVisionRfpQuoteOption() != null) {
            PresentationAlternativeOption option = getPresentationAlternativeOption(
                presentationOption.getVisionRfpQuoteOption(), 0f);

            option.setPercentage(MathUtils.diffPecent(option.getTotal(),
                currentProductTotals.containsKey("VISION") ? currentProductTotals.get("VISION")
                    : 0F, 1));

            alternativeTotal += option.getTotal();
            dto.getProductsOptions().add(option);
        }

        if (presentationOption.getLifeRfpQuoteAncillaryOption() != null) {
            PresentationAlternativeOption option = getPresentationAncillaryAlternativeOption(
                presentationOption.getLifeRfpQuoteAncillaryOption());

            option.setPercentage(MathUtils.diffPecent(option.getTotal(),
                currentProductTotals.containsKey("LIFE") ? currentProductTotals.get("LIFE") : 0F,
                1));

            alternativeTotal += option.getTotal();
            dto.getProductsOptions().add(option);
        }

        if (presentationOption.getStdRfpQuoteAncillaryOption() != null) {
            PresentationAlternativeOption option = getPresentationAncillaryAlternativeOption(
                presentationOption.getStdRfpQuoteAncillaryOption());

            option.setPercentage(MathUtils.diffPecent(option.getTotal(),
                currentProductTotals.containsKey("STD") ? currentProductTotals.get("STD") : 0F, 1));

            alternativeTotal += option.getTotal();
            dto.getProductsOptions().add(option);
        }

        if (presentationOption.getLtdRfpQuoteAncillaryOption() != null) {
            PresentationAlternativeOption option = getPresentationAncillaryAlternativeOption(
                presentationOption.getLtdRfpQuoteAncillaryOption());

            option.setPercentage(MathUtils.diffPecent(option.getTotal(),
                currentProductTotals.containsKey("LTD") ? currentProductTotals.get("LTD") : 0F, 1));

            alternativeTotal += option.getTotal();
            dto.getProductsOptions().add(option);
        }

        if (presentationOption.getMedicalRfpQuoteOption() != null) {

            // apply discount to medical only
            float totalDiscount = 0F;
            if (presentationOption.getDentalDiscountPercent() != null) {
                totalDiscount += presentationOption.getDentalDiscountPercent();
                dto.getBundlingDiscounts().add(
                    new PresentationAlternativeBundlingDiscount(DENTAL.name(),
                        presentationOption.getDentalDiscountPercent()));
            }

            if (presentationOption.getVisionDiscountPercent() != null) {
                totalDiscount += presentationOption.getVisionDiscountPercent();
                dto.getBundlingDiscounts().add(
                    new PresentationAlternativeBundlingDiscount(VISION.name(),
                        presentationOption.getVisionDiscountPercent()));
            }

            if (presentationOption.getLifeDiscountPercent() != null) {
                totalDiscount += presentationOption.getLifeDiscountPercent();
                dto.getBundlingDiscounts().add(
                    new PresentationAlternativeBundlingDiscount(LIFE.name(),
                        presentationOption.getLifeDiscountPercent()));
            }

            if (presentationOption.getStdDiscountPercent() != null) {
                totalDiscount += presentationOption.getStdDiscountPercent();
                dto.getBundlingDiscounts().add(
                    new PresentationAlternativeBundlingDiscount(STD.name(),
                        presentationOption.getStdDiscountPercent()));
            }

            if (presentationOption.getLtdDiscountPercent() != null) {
                totalDiscount += presentationOption.getLtdDiscountPercent();
                dto.getBundlingDiscounts().add(
                    new PresentationAlternativeBundlingDiscount(LTD.name(),
                        presentationOption.getLtdDiscountPercent()));
            }

            PresentationAlternativeOption option = getPresentationAlternativeOption(
                    presentationOption.getMedicalRfpQuoteOption(), totalDiscount);

            option.setPercentage(MathUtils.diffPecent(option.getTotal(),
                currentProductTotals.containsKey("MEDICAL") ? currentProductTotals.get("MEDICAL")
                    : 0F, 1));
            alternativeTotal += option.getTotal();
            dto.getProductsOptions().add(0, option);
        }

        dto.setTotal(alternativeTotal);
        dto.setPercentage(MathUtils.diffPecent(dto.getTotal(), currentTotal, 1));
        return dto;
    }

    private PresentationAlternativeOption getPresentationAlternativeOption(
        RfpQuoteOption rfpQuoteOption, float totalDiscount) {

        PresentationAlternativeOption option = new PresentationAlternativeOption();
        float optionTotal = rfpQuoteService.calcOptionTotal(rfpQuoteOption, totalDiscount) * RfpQuoteService.MONTHS_IN_YEAR;
        option.setTotal(optionTotal);
        RfpCarrier rfpCarrier = rfpQuoteOption.getRfpQuote().getRfpSubmission().getRfpCarrier();
        option.setCarrierId(rfpCarrier.getCarrier().getCarrierId());
        option.setCarrierName(rfpCarrier.getCarrier().getDisplayName());
        option.setProduct(rfpCarrier.getCategory());
        option.setRfpQuoteOptionId(rfpQuoteOption.getRfpQuoteOptionId());
        option.setQuoteType(rfpQuoteOption.getRfpQuote().getQuoteType());
        return option;
    }

    private PresentationAlternativeOption getPresentationAncillaryAlternativeOption(
        RfpQuoteAncillaryOption rfpQuoteAncillaryOption) {

        PresentationAlternativeOption option = new PresentationAlternativeOption();
        QuoteOptionBriefDto optionBrief = rfpQuoteService
            .buildAncillaryQuoteOptionBriefDto(rfpQuoteAncillaryOption);
        option.setPercentage(optionBrief.getPercentDifference());
        option.setTotal(optionBrief.getTotalAnnualPremium());
        RfpCarrier rfpCarrier = rfpQuoteAncillaryOption.getRfpQuote().getRfpSubmission()
            .getRfpCarrier();
        option.setCarrierId(rfpCarrier.getCarrier().getCarrierId());
        option.setCarrierName(rfpCarrier.getCarrier().getDisplayName());
        option.setProduct(rfpCarrier.getCategory());
        option.setRfpQuoteOptionId(rfpQuoteAncillaryOption.getRfpQuoteAncillaryOptionId());
        return option;
    }

    private QuoteOptionBriefDto getCurrentOptions(Long clientId, PlanCategory planCategory) {
        List<ClientPlan> clientPlans = clientPlanRepository
            .findByClientClientIdAndPnnPlanTypeIn(clientId, planCategory.getPlanTypes());
        return rfpQuoteService.findCurrentClientOption(clientPlans);
    }

    private RfpQuoteOption getRfpQuoteOption(Long rfpQuoteOptionId) {

        if (rfpQuoteOptionId == null) {
            throw new NotFoundException("rfpQuoteOptionId can't be null");
        }

        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);

        if (option == null) {
            throw new BaseException("rfpQuoteOption not found").withFields(
                field("rfp_quote_option_id", rfpQuoteOptionId)
            );
        }

        return option;
    }

    private RfpQuoteAncillaryOption getRfpQuoteAncillaryOption(Long rfpQuoteAncillaryOptionId) {

        if (rfpQuoteAncillaryOptionId == null) {
            throw new NotFoundException("rfpQuoteAncillaryOptionId can't be null");
        }

        RfpQuoteAncillaryOption option = rfpQuoteAncillaryOptionRepository
            .findOne(rfpQuoteAncillaryOptionId);

        if (option == null) {
            throw new BaseException("rfpQuoteAncillaryOption not found").withFields(
                field("rfp_quote_ancillary_option_id", rfpQuoteAncillaryOptionId)
            );
        }

        return option;
    }


    public List<PresentationAlternativeDto> createPresentationAlternative(Long clientId,
        List<PresentationAlternativeDto> dtos) {
        Client client = clientRepository.findOne(clientId);

        if (client == null) {
            throw new BaseException("Client not found").withFields(
                field("client_id", clientId)
            );
        }

        List<PresentationAlternativeDto> result = new ArrayList<>();

        // find and set current and renewal options
        PresentationQuoteOptionListDto currentRenewalInfo = new PresentationQuoteOptionListDto();
        HashMap<String, Float> currentProductTotals = new HashMap<>();
        setPresentationCurrentAndRenewal(clientId, currentRenewalInfo, currentProductTotals);

        int lastAlternativeNumber =
            findLastAlternativeNumber(presentationOptionRepository.findByClientClientId(clientId))
                + 1;

        for (PresentationAlternativeDto dto : dtos) {
            if (dto.getPresentationOptionId() != null) {
                throw new BaseException("Presentation alternative is already created!").withFields(
                    field("presentation_option_id", dto.getPresentationOptionId()),
                    field("name", dto.getName())
                );
            }

            PresentationOption presentationOption = new PresentationOption();
            presentationOption.setName("Alternative " + lastAlternativeNumber);
            lastAlternativeNumber += 1;
            presentationOption.setClient(client);

            // set options and bundling discounts
            for (PresentationAlternativeOption productOption : dto.getProductsOptions()) {
                updateAlternative(productOption.getProduct(), presentationOption,
                    productOption.getRfpQuoteOptionId(), dto.getBundlingDiscounts());
            }

            presentationOption = presentationOptionRepository.save(presentationOption);
            result.add(getPresentationAlternativeDto(presentationOption, currentProductTotals,
                currentRenewalInfo.getCurrentTotal()));

        }

        return result;
    }

    private int findLastAlternativeNumber(List<PresentationOption> options) {
        PresentationOption lastAlternative = options.stream()
            .filter(option -> containsIgnoreCase(option.getName(), "Alternative"))
            .sorted(
                (o1, o2) -> {
                    // IMPORTANT: desc comparator!
                    return compare(
                        o2.getPresentationOptionId(),
                        o1.getPresentationOptionId()
                    );
                }
            )
            .findFirst()
            .orElse(null);

        if (lastAlternative != null) {
            String lastAlternativeName = lastAlternative.getName();

            if (!lastAlternativeName.matches("Alternative \\d{1,2}")) {
                throw new BadRequestException("Unexpected Alternative name")
                    .withFields(
                        field("last_alternative_name", lastAlternativeName)
                    );
            }

            String[] nameParts = lastAlternativeName.split(" ");

            return parseUnsignedInt(nameParts[1]);
        }

        return 0;
    }

    public PresentationOption updatePresentationOption(PresentationUpdateDto dto) {

        PresentationOption presentationOption = presentationOptionRepository
            .findOne(dto.getPresentationOptionId());
        if (presentationOption == null) {
            throw new NotFoundException("PresentationOption not found")
                .withFields(field("presentationOptionId", dto.getPresentationOptionId()));
        }

        Long optionId = dto.getRfpQuoteOptionId();
        updateAlternative(dto.getProduct(), presentationOption, optionId, dto.getBundlingDiscounts());
        return presentationOption;
    }

    private void updateAlternative(String product, PresentationOption presentationOption,
        Long optionId, List<PresentationAlternativeBundlingDiscount> bundlingDiscounts) {

        if(optionId != null) {
            switch (product) {
                case Constants.MEDICAL:
                    presentationOption.setMedicalRfpQuoteOption(getRfpQuoteOption(optionId));
                    break;
                case Constants.DENTAL:
                    presentationOption.setDentalRfpQuoteOption(getRfpQuoteOption(optionId));
                    break;
                case Constants.VISION:
                    presentationOption.setVisionRfpQuoteOption(getRfpQuoteOption(optionId));
                    break;
                case Constants.LIFE:
                    presentationOption
                        .setLifeRfpQuoteAncillaryOption(getRfpQuoteAncillaryOption(optionId));
                    break;
                case Constants.LTD:
                    presentationOption
                        .setLtdRfpQuoteAncillaryOption(getRfpQuoteAncillaryOption(optionId));
                    break;
                case Constants.STD:
                    presentationOption
                        .setStdRfpQuoteAncillaryOption(getRfpQuoteAncillaryOption(optionId));
                    break;
            }
        }

        // update bundling discount
        presentationOption.setDentalDiscountPercent(null);
        presentationOption.setVisionDiscountPercent(null);
        presentationOption.setLifeDiscountPercent(null);
        presentationOption.setLtdDiscountPercent(null);
        presentationOption.setStdDiscountPercent(null);
        for (PresentationAlternativeBundlingDiscount discount : bundlingDiscounts) {
            switch (discount.getProduct()) {
                case Constants.DENTAL:
                    presentationOption
                        .setDentalDiscountPercent(discount.getDiscount());
                    break;
                case Constants.VISION:
                    presentationOption
                        .setVisionDiscountPercent(discount.getDiscount());
                    break;
                case Constants.LIFE:
                    presentationOption
                        .setLifeDiscountPercent(discount.getDiscount());
                    break;
                case Constants.LTD:
                    presentationOption
                        .setLtdDiscountPercent(discount.getDiscount());
                    break;
                case Constants.STD:
                    presentationOption
                        .setStdDiscountPercent(discount.getDiscount());
                    break;
            }
        }
    }

    private RfpQuoteOption findRenewalOption(Long clientId, String product) {
    	List<RfpQuoteOption> optionList = rfpQuoteOptionRepository
                .findByClientIdAndCategory(clientId, product);
    	return optionList.stream()
    			.filter(o -> sharedRfpQuoteService.getOptionType(o.getName()).equals(OptionType.RENEWAL))
    			.findFirst()
    			.orElse(null);
    }
    
    private RfpQuoteAncillaryOption findAncillaryRenewalOption(Long clientId, String product) {
    	List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(clientId, product);
    	if (rfpQuotes.isEmpty()) {
    		return null;
    	}
    	RfpQuote rfpQuote = rfpQuotes.get(0);
    	List<RfpQuoteAncillaryOption> optionList = rfpQuoteAncillaryOptionRepository.findByRfpQuote(rfpQuote);
    	
    	return optionList.stream()
    			.filter(o -> sharedRfpQuoteService.getOptionType(o.getName()).equals(OptionType.RENEWAL))
    			.findFirst()
    			.orElse(null);
    }
    
    public Map<String, QuoteOptionDisclaimerDto> getQuoteDisclosures(
    		String product, Long clientId, List<String> carrierNames) {
    	
        List<QuoteOptionDisclaimerDto> result = rfpQuoteRepository.findDisclaimersByProductAndCarrier(product, clientId, carrierNames);
        Map<String, QuoteOptionDisclaimerDto> grouped = new HashMap<>();
        for(QuoteOptionDisclaimerDto dto : result) {
            String key = dto.getCarrierName();
            if(dto.getRfpQuoteId() != null) {
                RfpQuote rfpQuote = rfpQuoteRepository.findOne(dto.getRfpQuoteId());
                if(rfpQuote.getQuoteType().equals(QuoteType.CLSA_TRUST_PROGRAM)){
                   key = CLSA_TRUST_DISCLAIMER_PREFIX + dto.getCarrierName();
                }
            }
            grouped.compute(key, (k, v) -> {
                if (v == null) { return dto; }
                v.setDisclaimer(v.getDisclaimer() + " &lt;br/&gt; &lt;br/&gt; " + dto.getDisclaimer());
                return v;
            });
        }
        return grouped;
    }

    public void deletePresentationOptionById(Long id) {
        PresentationOption presentationOption = presentationOptionRepository.findOne(id);
        if (presentationOption == null) {
            throw new NotFoundException("PresentationOption not found")
                .withFields(field("presentationOptionId", id));
        }

        presentationOptionRepository.delete(presentationOption);
    }

    public PresentationOption deletePresentationOption(PresentationUpdateDto dto) {

        PresentationOption presentationOption = presentationOptionRepository
            .findOne(dto.getPresentationOptionId());
        if (presentationOption == null) {
            throw new NotFoundException("PresentationOption not found")
                .withFields(field("presentationOptionId", dto.getPresentationOptionId()));
        }

        switch (dto.getProduct()) {
            case Constants.MEDICAL:
                presentationOption.setMedicalRfpQuoteOption(null);
                break;
            case Constants.DENTAL:
                presentationOption.setDentalRfpQuoteOption(null);
                break;
            case Constants.VISION:
                presentationOption.setVisionRfpQuoteOption(null);
                break;
            case Constants.LIFE:
                presentationOption.setLifeRfpQuoteAncillaryOption(null);
                break;
            case Constants.LTD:
                presentationOption.setLtdRfpQuoteAncillaryOption(null);
                break;
            case Constants.STD:
                presentationOption.setStdRfpQuoteAncillaryOption(null);
                break;
        }
        return presentationOption;
    }
    
    private float firstNotZero(float... values) {
    	for (int i = 0; i < values.length; i++) {
			if (values[i] != 0f) {
				return values[i];
			}
		}
    	return 0;
    }

    private double firstNotZero(double... values) {
        for (int i = 0; i < values.length; i++) {
            if (values[i] != 0f) {
                return values[i];
            }
        }
        return 0;
    }

}
