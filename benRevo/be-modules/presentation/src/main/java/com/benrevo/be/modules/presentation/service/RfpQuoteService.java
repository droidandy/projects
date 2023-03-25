package com.benrevo.be.modules.presentation.service;


import static com.benrevo.be.modules.salesforce.enums.OpportunityType.NewBusiness;
import static com.benrevo.common.Constants.ER_CONTRIBUTION_FORMAT_PERCENT;
import static com.benrevo.common.Constants.PERCENT_CHANGE_FROM_CURRENT;
import static com.benrevo.common.Constants.TIER1_PLAN_NAME;
import static com.benrevo.common.Constants.TIER2_PLAN_NAME;
import static com.benrevo.common.Constants.TIER2_PLAN_NAME_SPECIAL;
import static com.benrevo.common.Constants.TIER3_PLAN_NAME;
import static com.benrevo.common.Constants.TIER3_PLAN_NAME_SPECIAL;
import static com.benrevo.common.Constants.TIER4_PLAN_NAME;
import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.enums.CarrierType.carrierMatches;
import static com.benrevo.common.enums.CarrierType.fromStrings;
import static com.benrevo.common.enums.CarrierType.isCarrierNameAppCarrier;
import static com.benrevo.common.enums.QuoteType.CLEAR_VALUE;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.MathUtils.getDiscountFactor;
import static com.benrevo.common.util.MathUtils.round;
import static com.benrevo.common.util.StreamUtils.mapToList;
import static com.benrevo.common.util.ValidationHelper.isNotNull;
import static io.vavr.collection.List.*;
import static java.lang.Integer.parseUnsignedInt;
import static java.lang.String.format;
import static java.util.Objects.isNull;
import static java.util.Optional.ofNullable;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.*;

import com.benrevo.be.modules.presentation.email.PresentationEmailService;
import com.benrevo.be.modules.presentation.util.PoiUtil;
import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.access.BrokerageRole;
import com.benrevo.be.modules.shared.service.*;
import com.benrevo.be.modules.shared.service.cache.CacheKeyType;
import com.benrevo.be.modules.shared.service.cache.CacheService;
import com.benrevo.be.modules.shared.util.BenefitUtil;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.*;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Census;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Cost;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.dto.QuoteOptionBriefDto.PlanBriefDto;
import com.benrevo.common.dto.QuoteOptionPlanComparisonDto.PlanByNetwork;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryOptionDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryPlanComparisonDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryPlanDto;
import com.benrevo.common.enums.*;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.common.exception.*;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.DateHelper;
import com.benrevo.common.util.MathUtils;
import com.benrevo.common.util.StringHelper;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.*;
import com.benrevo.data.persistence.repository.ancillary.ProgramToAncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryPlanRepository;
import io.vavr.control.Option;
import io.vavr.control.Try;

import java.io.IOException;
import java.util.*;
import java.util.Map.Entry;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.commons.lang3.tuple.Triple;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.salesforce.enums.StageType.SubmittedForApproval;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.*;
import static org.apache.commons.lang3.ObjectUtils.defaultIfNull;
import static org.apache.commons.lang3.StringUtils.*;

@Service
@Transactional
public class RfpQuoteService extends SharedRfpQuoteService {
	
	public static final String OPTION_1_NAME = "Option 1";
	public static final String RENEWAL_1_NAME = "Renewal 1";
	public static final String RENEWAL_OPTION_NAME = "Renewal";
	public static final String NEGOTIATED_OPTION_NAME = "Negotiated";
    public static final String UHC_RESTRICTION_FOR_STANDARD_QUOTE_TYPE = "Reached maximum number allowed plans for STANDARD";
    public static final String UHC_RESTRICTION_FOR_EASY_QUOTE_TYPE = "Reached maximum number allowed plans for EASY";
	public static final String ANTHEM_CLEAR_VALUE_NETWORKS_RESTRICTION_COUNT = "Reached maximum number allowed plans for Clear Value Quotes";
	public static final String ANTHEM_RESTRICTION_FOR_STANDARD_QUOTE_TYPE = "Reached maximum number allowed plans for STANDARD";
	public static final String ANTHEM_RESTRICTION_BY_TYPE_AND_NAME = "Reached maximum number allowed plans for type %s and name %s";
	public static final String ANTHEM_CLEAR_VALUE_SUBMISSION_RULES_RESTRICTION_COUNT = "Clear value medical must be sold with at least one specialty product (dental or vision) or any other product(s) that has a minimum of a 1% discount total";
	public static final String ANTHEM_CLEAR_VALUE_SUBMISSION_RULES_RESTRICTION_TYPE = "Clear value %s must have quote with type CLEAR_VALUE or STANDARD";

    @Autowired
    private CustomLogger logger;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private RfpQuoteVersionRepository rfpQuoteVersionRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;
    
    @Autowired
    private RfpQuoteNetworkCombinationRepository rfpQuoteNetworkCombinationRepository;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private RiderRepository riderRepository;

    @Autowired 
    private PresentationEmailService emailService;
    
    @Autowired
    private S3FileManager s3FileManager;

    @Autowired 
    private DocumentFileService documentService;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;
    
    @Autowired
    protected AttributeRepository attributeRepository;
    
    @Autowired
    private BenefitUtil benefitUtil;

    @Autowired
    private SharedActivityService sharedActivityService;

    @Autowired
    protected Auth0Service auth0Service;

    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private SharedCarrierService sharedCarrierService;
    
    @Autowired
    protected ActivityRepository activityRepository;
    
    @Autowired
    private RfpQuoteSummaryRepository rfpQuoteSummaryRepository;
    
    @Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;
    
    @Autowired
    private RfpQuoteAncillaryPlanRepository rfpQuoteAncillaryPlanRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private OptionRepository optionRepository;
    
    @Autowired
    private PresentationOptionRepository presentationOptionRepository;

    @Autowired
    private ProgramToPnnRepository programToPnnRepository;

    @Autowired
    private ProgramToAncillaryPlanRepository programToAncillaryPlanRepository;
    
    @Lazy
    @Autowired
    private CacheService cacheService;

    @Value("${app.carrier}")
    String[] appCarrier;

    @Value("${app.env}")
    String appEnv;

    private static Float recalcContributionFormat(String newFormat, Float erContribution, Float rate, float rxRate) {
        if(erContribution != null && rate != null && rate > 0.0f) {
            if(ER_CONTRIBUTION_FORMAT_PERCENT.equals(newFormat)) {
                return erContribution * 100f / ( rate * rxRate );
            } else {  // newFormat == "DOLLAR"
                return erContribution * rate * rxRate / 100f;
            }
        }

        return 0.0f; 
    }

    public List<RfpQuoteDto> getQuotes(Long clientId, Long rfpCarrierId, String category) {
        return rfpQuoteRepository.getQuotes(clientId, rfpCarrierId, category);
    }

    
    
    public List<QuoteStatusDto> getQuoteStatus(Long clientId, String category) {
        Client client = getClientById(clientId);

        List<QuoteStatusDto> statusDtos = new ArrayList<>();
        List<RfpSubmission> rfpSubmissions = rfpSubmissionRepository.findByClient(client);
        rfpSubmissions = rfpSubmissions.stream()
            .filter(p -> p.getRfpCarrier().getCategory().equalsIgnoreCase(category))
            .collect(Collectors.toList());

        final List<RfpQuote> quotes = rfpQuoteRepository.findByClientIdAndCategory(clientId, category);
        for(RfpSubmission sub : rfpSubmissions){
            QuoteStatusDto quoteStatus = new QuoteStatusDto();

            RfpQuote quote = quotes.stream()
                .filter(q -> q.getRfpSubmission().getRfpSubmissionId().equals(sub.getRfpSubmissionId()))
                .findFirst()
                .orElse(null);

            quoteStatus.setCarrierName(sub.getRfpCarrier().getCarrier().getName());
            quoteStatus.setCarrierDisplayName(sub.getRfpCarrier().getCarrier().getDisplayName());
            if(quote == null){
                quoteStatus.setStatus(QuoteState.NOT_AVAILABLE);
            }else{
                // this may have to account for decline quotes
                quoteStatus.setStatus(QuoteState.AVAILABLE);
                quoteStatus.setType(quote.getQuoteType());
            }

            statusDtos.add(quoteStatus);
        }
        return statusDtos;
    }
    
    private <T> List<T> sortOptionsByType(List<T> options, 
    		Function<T, String> nameExtractor, Function<T, Long> idExtractor,
    		OptionType... sortOrder) {
    	List<T> sortedOptions = new ArrayList<>();
    	Map<OptionType, List<T>> optionTypes = options.stream()
    			.collect(Collectors.groupingBy(o -> getOptionType(nameExtractor.apply(o))));

    	for (OptionType optionType : sortOrder) {
    		sortOptionsByType(sortedOptions, nameExtractor, idExtractor, optionTypes, optionType);
		}

	    return sortedOptions;
    }

    private <T> void sortOptionsByType(List<T> sortedOptions, 
    		Function<T, String> nameExtractor, Function<T, Long> idExtractor,
    		Map<OptionType, List<T>> optionTypes, OptionType optionType) {
    	if(optionTypes.get(optionType) != null) {
    		final Comparator<T> comparator = Comparator.comparing(idExtractor);
            if(optionType.equals(OptionType.OPTION)){
                // get all option 1 and sort by Id and then sort the remaining options by id
                List<T> options = optionTypes.get(optionType);
                List<T> option1s = new ArrayList<>();
                for (Iterator<T> iter = options.listIterator(); iter.hasNext(); ) {
                    T option = iter.next();
                    if (containsIgnoreCase(nameExtractor.apply(option), OPTION_1_NAME)) {
                        option1s.add(option);
                        iter.remove();
                    }
                }
                
                option1s.sort(comparator);
                options.sort(comparator);
                sortedOptions.addAll(option1s);
                sortedOptions.addAll(options);

            } else {
                optionTypes.get(optionType).sort(comparator);
                sortedOptions.addAll(optionTypes.get(optionType));
            }
        }
    }

    public List<QuoteOptionBriefDto> getQuoteOptions(Long rfpQuoteId, float currentTotalAnnualPremium) {
        List<RfpQuoteOption> quoteOptions = rfpQuoteOptionRepository.findByRfpQuoteRfpQuoteId(rfpQuoteId);
        quoteOptions = filterQuoteOptionByRole(quoteOptions);
        List<QuoteOptionBriefDto> result = new ArrayList<>();
        for(RfpQuoteOption option : quoteOptions) {
            QuoteOptionBriefDto optionDto = buildQuoteOptionBrief(option);
            optionDto.setPercentDifference(MathUtils.diffPecent(optionDto.getTotalAnnualPremium(), currentTotalAnnualPremium, 1));
            result.add(optionDto);
        }
        return result;
    }
    
    private <T> List<T> filterQuoteOptionByRole(List<? extends QuoteOption> options) {
        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        boolean isCarrierXRole = currentUser.getRoles().contains(AccountRole.CARRIER_MANAGER.getValue())
            || currentUser.getRoles().contains(AccountRole.CARRIER_SALES.getValue()) 
            || currentUser.getRoles().contains((AccountRole.CARRIER_PRESALE.getValue()));
        
        return options.stream()
            .filter(o -> {
                Carrier carrier = o.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
                /* Any Option being returned to user with role carrier_sales or carrier_presales or carrier_manager
                 * should be appCarrier options. No multi-carrier options 
                 * NOTE: exclusion for Renewal option */
                return !isCarrierXRole 
                    || (isCarrierXRole && CarrierType.isCarrierNameAppCarrier(carrier.getName(), appCarrier)) 
                    || getOptionType(o.getName()).equals(OptionType.RENEWAL);
            })
            .map(o -> (T) o)
            .collect(Collectors.toList());
    }
    
    
    public QuoteOptionListDto getAncillaryQuoteOptions(Long clientId, String product) {
        
        List<RfpQuote> quotes = rfpQuoteRepository.findByClientIdAndCategory(
            clientId, product);
        
        List<RfpQuoteAncillaryOption> allOptions = new ArrayList<>();
        for(RfpQuote rfpQuote : quotes) {
            allOptions.addAll(rfpQuoteAncillaryOptionRepository.findByRfpQuote(rfpQuote));
        }
        allOptions = filterQuoteOptionByRole(allOptions);
        
        List<QuoteOptionBriefDto> options = new ArrayList<>();
        
        for(RfpQuoteAncillaryOption option : allOptions) {
            QuoteOptionBriefDto optionDto = buildAncillaryQuoteOptionBriefDto(option);
            options.add(optionDto);
        }

        List<QuoteOptionBriefDto> sortedOptions = sortOptionsByType(options, 
        		QuoteOptionBriefDto::getName, QuoteOptionBriefDto::getId,
        		OptionType.RENEWAL, OptionType.NEGOTIATED, OptionType.OPTION);

        QuoteOptionBriefDto currentOptionDto = findCurrentAncillaryOption(clientId, product);

        // calculate PercentDifference based on found current option
        for(QuoteOptionBriefDto optionDto : options) {
            optionDto.setPercentDifference(MathUtils.diffPecent(optionDto.getTotalAnnualPremium(), currentOptionDto.getTotalAnnualPremium(), 1));
        }

        QuoteOptionListDto result = new QuoteOptionListDto();
        result.setCurrentOption(currentOptionDto);
        result.setCategory(product);
        result.setOptions(sortedOptions);
        
        return result;
    }

    public  QuoteOptionBriefDto buildAncillaryQuoteOptionBriefDto(RfpQuoteAncillaryOption option) {
        QuoteOptionBriefDto optionDto = new QuoteOptionBriefDto();
        optionDto.setId(option.getRfpQuoteAncillaryOptionId());
        optionDto.setOptionType(getOptionType(option.getName()));
        RfpCarrier rfpCarrier = option.getRfpQuote().getRfpSubmission().getRfpCarrier();
        optionDto.setCarrier(rfpCarrier.getCarrier().getDisplayName());
        optionDto.setName(option.getName());
        optionDto.setDisplayName(option.getDisplayName());
        optionDto.setPlans(new ArrayList<>());
        if(option.getRfpQuoteAncillaryPlan() != null) {
            double optionTotal = calcAncillaryOptionTotal(option) * MONTHS_IN_YEAR;
            // FIXME use Double
            optionDto.setTotalAnnualPremium((float) round(optionTotal, 2));
        } else {
            // if option plan not selected
            optionDto.setTotalAnnualPremium(0f);
        }
        optionDto.setSelected(false);
        optionDto.setQuoteType(option.getRfpQuote().getQuoteType());
        // FIXME how to check Complete flag for Ancillary option ?
        optionDto.setComplete(true);
        return optionDto;
    }

    public QuoteOptionListDto getQuoteOptions(Long clientId, String category) {
        Client client = getClientById(clientId);

        List<QuoteOptionBriefDto> options = new ArrayList<>();

        List<RfpQuoteOption> allOptions = findAllCarrierQuoteOptions(clientId, category);
        allOptions = filterQuoteOptionByRole(allOptions);
        
        for(RfpQuoteOption option : allOptions) {
            QuoteOptionBriefDto optionDto = buildQuoteOptionBrief(option);
            options.add(optionDto);
        }

        List<QuoteOptionBriefDto> sortedOptions = sortOptionsByType(options, 
        		QuoteOptionBriefDto::getName, QuoteOptionBriefDto::getId,
        		OptionType.RENEWAL, OptionType.NEGOTIATED, OptionType.OPTION);

        // get all the current client plans in this category
        PlanCategory planCategory = PlanCategory.valueOf(category);
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(clientId, planCategory.getPlanTypes());
        QuoteOptionBriefDto currentOptionDto = findCurrentClientOption(clientPlans);

        // calculate PercentDifference based on found current option
        for(QuoteOptionBriefDto optionDto : options) {
            optionDto.setPercentDifference(MathUtils.diffPecent(optionDto.getTotalAnnualPremium(), currentOptionDto.getTotalAnnualPremium(), 1));
        }

        QuoteOptionListDto result = new QuoteOptionListDto();
        result.setCurrentOption(currentOptionDto);
        result.setCategory(category);
        result.setOptions(sortedOptions);
        
        // send quote viewed email notification if necessary
        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        if (Constants.MEDICAL.equals(category) 
                && equalsIgnoreCase(currentUser.getBrokerRole(), BrokerageRole.USER.getValue()) 
                && !isCurrentContextBrokerABenrevoGA()
                && isValidBrokerUser(currentUser)
                && !carrierMatches(CarrierType.BENREVO.name(), appCarrier)) { // suppress quote viewed for Benrevo carrier temporarily
            boolean hasNewQuote = false;
            List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(clientId, category);
            for (RfpQuote rfpQuote : rfpQuotes) {
                switch(rfpQuote.getQuoteType()) {
                    case EASY:
                    case KAISER:
                    case KAISER_EASY:
                    case STANDARD:
                        if (!rfpQuote.isViewed()) {
                            hasNewQuote = true;
                            rfpQuote.setViewed(true);
                            rfpQuoteRepository.save(rfpQuote);
                        }
                        break;
                }
            }
            if (hasNewQuote) {
                // send quote viewed notification
                emailService.sendQuoteViewedNotification(clientId);

                saveQuoteViewedDashboardActivity(clientId, category);

                Try.run(() -> publisher.publishEvent(
                    new SalesforceEvent.Builder()
                        .withObject(
                            new SFOpportunity.Builder()
                                .withId(client.getClientName())
                                .withAccountId(client.getClientName())
                                .withName(client.getClientName())
                                .withCarrier(fromStrings(appCarrier))
                                .withTest(!equalsIgnoreCase(appEnv, "prod"))
                                .withCloseDate(client.getDueDate())
                                .withType(NewBusiness)
                                .withViewedByBroker(true)
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
                    )
                ).onFailure(t -> logger.error(t.getMessage(), t));
            }
        }
        // update cached Option 1 or Renewal 1 values
        for(QuoteOptionBriefDto opt : result.getOptions()) {
            if(opt.getId() != null && StringUtils.equalsAny(opt.getName(), OPTION_1_NAME, RENEWAL_1_NAME) ) {
                float optionTotal = opt.getTotalAnnualPremium();
                float currentTotal = currentOptionDto.getTotalAnnualPremium();
                float diffDollar = optionTotal - currentTotal;
                float diffPercent = MathUtils.diffPecent(optionTotal, currentTotal, 2);
                
                RfpQuoteOption currentOption = prepareCurrentOption(clientPlans);
                Carrier carrier = currentOption.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
  
                QuoteOptionCachedParams cached = new QuoteOptionCachedParams();
                cached.setDiffPercent(diffPercent);
                cached.setDiffDollar(diffDollar);
                cached.setOptionTotal(optionTotal);
                cached.setCarrierId(carrier.getCarrierId());
                cached.setCarrierName(carrier.getName());
                cached.setCarrierDisplayName(carrier.getDisplayName());
                
                cacheService.hSet(CacheKeyType.RFP_QUOTE_OPTION.getKeyPrefix(), 
                    opt.getId().toString(), cached);
                
                if (RENEWAL_1_NAME.equals(opt.getName())) {
                    updateOrCreateRenewalAddedActivity(clientId, category, opt.getPercentDifference());    
                }
            } else if(opt.getName().equals(RENEWAL_OPTION_NAME)) {
                updateRenewalAddedActivity(clientId, category, opt.getPercentDifference());
            }
        }
        return result;
    }
    
    private void updateRenewalAddedActivity(Long clientId, String product, Float diffPercent) {
        ofNullable(activityRepository
            .findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(clientId, ActivityType.RENEWAL_ADDED, null, product, null))
            .ifPresent(activity -> {
                activity.setValue(diffPercent != null ? Float.toString(diffPercent) : null);
                activity.setUpdated(new Date());
                activityRepository.save(activity);
            });
    }

    private void updateOrCreateRenewalAddedActivity(Long clientId, String product, Float diffPercent) {
        
        if (diffPercent == null) { 
            return; 
        }

        String strDiffPercent = Float.toString(diffPercent);
        Activity activity = activityRepository.findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(
                clientId, ActivityType.RENEWAL_ADDED, null, product, null);

        if (activity != null) {
            // update
            activity.setValue(strDiffPercent);
            activity.setUpdated(new Date());
            return;
        }

        Activity initialActivity = activityRepository.findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(
                clientId, ActivityType.INITIAL_RENEWAL, null, product, null);

        if (initialActivity == null) {
            return;
        }
        
        if (strDiffPercent.equals(initialActivity.getValue())) {
            // no change
            return;
        }

        // new
        activity = new Activity(clientId, ActivityType.RENEWAL_ADDED, strDiffPercent, "").product(product);
        activityRepository.save(activity);
    }

    private boolean isValidBrokerUser(AuthenticatedUser currentUser){
        List<String> roles = currentUser.getRoles();
        return roles != null && roles.size() == 1 && roles.contains(AccountRole.BROKER.getValue());
    }

    private void saveQuoteViewedDashboardActivity(Long clientId, String category) {
        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder.getContext()
                .getAuthentication();

        String brokerNameEmail = auth0Service.getUserEmail(authentication.getName());

        if(brokerNameEmail == null){
            brokerNameEmail = authentication.getName();
        }

        //update activity table that quote has been viewed
        sharedActivityService.save(
                new Activity(
                    clientId,
                    ActivityType.QUOTE_VIEWED,
                    "Proposal Viewed",
                    "Proposal viewed by online broker: " + brokerNameEmail)
                .product(category.toUpperCase()));
    }

    private QuoteOptionPlanBriefDto buildCurrentQuoteOptionPlanBrief(ClientPlan clientPlan) {
        Float employer = calcEmployerCost(clientPlan);
        Float total = calcClientPlanTotal(clientPlan);

        QuoteOptionPlanBriefDto currentPlan = new QuoteOptionPlanBriefDto();
        currentPlan.setPlanId(clientPlan.getClientPlanId());
        currentPlan.setType(clientPlan.getPnn().getNetwork().getType());
        currentPlan.setName(clientPlan.getPnn().getName());
        currentPlan.setEmployer(employer);
        currentPlan.setEmployee(total - employer);
        currentPlan.setTotal(total);
        Carrier carrier = extractClientPlanCarrier(clientPlan);
        if(carrier != null) {
	        currentPlan.setCarrier(carrier.getDisplayName());
	        currentPlan.setCarrierId(carrier.getCarrierId());
        }
        currentPlan.setRfpCarrierId(
            rfpCarrierRepository.findByCarrierCarrierIdAndCategory(
            	carrier.getCarrierId(),
                PlanCategory.findByPlanType(
                    clientPlan.getPnn().getNetwork().getType()
                ).name()
            ).getRfpCarrierId()
        );

        // add benefits for broker-app
        List<Rx> rx = new ArrayList<>();
        List<QuoteOptionAltPlanDto.Benefit> benefits = findBenefits(clientPlan.getPnn().getPlan().getPlanId(), rx);
        if(CollectionUtils.isEmpty(rx) && clientPlan.getRxPnn() != null){
            findBenefits(clientPlan.getRxPnn().getPlan().getPlanId(), rx);
        }
        currentPlan.setBenefits(benefits);
        currentPlan.setRx(rx);
        return currentPlan;
    }

    public QuoteOptionBriefDto buildQuoteOptionBrief(RfpQuoteOption option) {
        Float optionTotal = calcOptionTotal(option) * MONTHS_IN_YEAR;

        boolean isOptionComplete = true;
        List<PlanBriefDto> optionPlans = new ArrayList<>();
        for(RfpQuoteOptionNetwork optNetwork : option.getRfpQuoteOptionNetworks()) {

            if(!isCompleteRfpQuoteOptionNetwork(optNetwork)){
                isOptionComplete = false;
            }

            if(optNetwork.getSelectedRfpQuoteNetworkPlan() != null) {
                String planType = optNetwork.getSelectedRfpQuoteNetworkPlan().getPnn().getNetwork().getType();
                String planName = optNetwork.getSelectedRfpQuoteNetworkPlan().getPnn().getName();
                optionPlans.add(new PlanBriefDto(planName, planType));
            } else if (optNetwork.getClientPlan() != null) {
                String planType = optNetwork.getClientPlan().getPnn().getNetwork().getType();
                String planName = optNetwork.getClientPlan().getPnn().getName();
                optionPlans.add(new PlanBriefDto(planName, planType));
            }
        }
 
        QuoteOptionBriefDto optionDto = new QuoteOptionBriefDto();
        optionDto.setId(option.getRfpQuoteOptionId());
        optionDto.setOptionType(getOptionType(option.getRfpQuoteOptionName()));
        RfpCarrier rfpCarrier = option.getRfpQuote().getRfpSubmission().getRfpCarrier();
        optionDto.setCarrier(rfpCarrier.getCarrier().getDisplayName());
        optionDto.setName(option.getRfpQuoteOptionName());
        optionDto.setDisplayName(option.getDisplayName());
        optionDto.setPlans(optionPlans);
        optionDto.setTotalAnnualPremium(round(optionTotal, 2));
        optionDto.setSelected(option.isFinalSelection());
        optionDto.setQuoteType(option.getRfpQuote().getQuoteType());
        optionDto.setComplete(isOptionComplete);

        return optionDto;
    }
    
    private void invalidateCachedRfpQuoteOption(RfpQuoteOption rfpQuoteOption) {
        if(StringUtils.equalsAny(rfpQuoteOption.getRfpQuoteOptionName(), OPTION_1_NAME, RENEWAL_1_NAME) ) {
            cacheService.hdel(CacheKeyType.RFP_QUOTE_OPTION.getKeyPrefix(), rfpQuoteOption.getRfpQuoteOptionId().toString());
        } 
    }

    public void selectQuoteOption(Long rfpQuoteOptionId) {
        RfpQuoteOption opt = getRfpQuoteOptionById(rfpQuoteOptionId);
        String currentCategory = opt.getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory();
        Long clientId = opt.getRfpQuote().getRfpSubmission().getClient().getClientId();
        List<RfpQuoteOption> options = findAllCarrierQuoteOptions(clientId, currentCategory);

        for(RfpQuoteOption option : options) {
            option.setFinalSelection(false);
            rfpQuoteOptionRepository.save(option);
        }

        opt.setFinalSelection(true);

        rfpQuoteOptionRepository.save(opt);
        
        invalidateCachedRfpQuoteOption(opt);
    }

    private RfpQuoteOption getRfpQuoteOptionById(Long rfpQuoteOptionId) {
        RfpQuoteOption opt = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);
        if(opt == null) {
            throw new NotFoundException("Quote option not found")
                .withFields(
                    field("rfp_quote_option_id", rfpQuoteOptionId)
                );
        }
        return opt;
    }

    public void unselectQuoteOption(Long rfpQuoteOptionId) {
        RfpQuoteOption opt = getRfpQuoteOptionById(rfpQuoteOptionId);

        opt.setFinalSelection(false);

        rfpQuoteOptionRepository.save(opt);

        invalidateCachedRfpQuoteOption(opt);
    }

    public QuoteOptionSubmissionDto submitQuoteOptions(QuoteOptionSubmissionDto quoteOptionSubmission) {

        quoteOptionSubmission.setSubmissionSuccessful(true);
        if(carrierMatches(Constants.ANTHEM_CARRIER, appCarrier)) {
            checkClearValueRules(quoteOptionSubmission);
            if(!quoteOptionSubmission.isSubmissionSuccessful()) {
            	return quoteOptionSubmission;
            }
        }

        // Send email to broker, uhc sales reps
        emailService.sendNewSaleNotification(quoteOptionSubmission.getClientId());

        Client client = getClientById(quoteOptionSubmission.getClientId());
        client.setClientState(ClientState.PENDING_APPROVAL);
        client.setDateQuoteOptionSubmitted(new Date());

        // Used for SalesForce
        List<ExtClientAccess> gaAccessList = extClientAccessRepository.findByClient(client);
        QuoteOptionFinalSelectionDto finalSelectionDto = getSelectedQuoteOptions(client.getClientId());

        // Salesforce
        Try.run(
            () -> {
                QuoteOptionDetailsDto medOption = null;

                if(finalSelectionDto != null && finalSelectionDto.getMedicalQuoteOptionId() != null) {
                    medOption = getQuoteOptionById(finalSelectionDto.getMedicalQuoteOptionId());
                }

                publisher.publishEvent(
                    new SalesforceEvent.Builder()
                        .withObject(
                            new SFOpportunity.Builder()
                                .withBrokerageFirm(client.getBroker().getName())
                                .withName(client.getClientName())
                                .withCarrier(fromStrings(appCarrier))
                                .withTest(!equalsIgnoreCase(appEnv, "prod"))
                                .withEffectiveDate(client.getEffectiveDate())
                                .withCloseDate(client.getDueDate())
                                .withStageName(SubmittedForApproval)
                                .withCvVsCurrentIssued(
                                    medOption != null && medOption.getQuoteType().equals(CLEAR_VALUE)
                                        ? Double.valueOf(medOption.getPercentDifference())
                                        : null
                                )
                                .withStandardVsCurrent(
                                    medOption != null && !medOption.getQuoteType().equals(CLEAR_VALUE)
                                        ? Double.valueOf(medOption.getPercentDifference())
                                        : null
                                )
                                .withAmount(
                                    gaAccessList != null && gaAccessList.size() > 0
                                        ? 0.005 * (finalSelectionDto != null ? finalSelectionDto.getTotal() : 0)
                                        : 0.01 * (finalSelectionDto != null ? finalSelectionDto.getTotal() : 0)
                                )
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
                );
            }
        ).onFailure(t -> logger.error(t.getMessage(), t));

        return quoteOptionSubmission;
    }
    
    /* Rule:
     * - During the submission, if you have selected a "Clear Value Medical" network, you are required to 
     * add ANY (1) Dental or Vision Option.
     * - The Dental or Vision could be quoteType.STANDARD or quoteType.CLEAR_VALUE.
     * - Total discount of any other external product(s) should be 1% or more 
     */
    private void checkClearValueRules(QuoteOptionSubmissionDto quoteOptionSubmission) {
    	if(quoteOptionSubmission.getMedicalQuoteOptionId() != null && quoteOptionSubmission.getMedicalQuoteOptionId() > 0) {
    		List<ClientExtProduct> externalProducts = clientExtProductRepository.findByClientId(quoteOptionSubmission.getClientId());
    		float totalDiscount = 0f;
    		RfpQuoteOption medicalOption = rfpQuoteOptionRepository.findOne(quoteOptionSubmission.getMedicalQuoteOptionId());
    		if(medicalOption.getRfpQuote().getQuoteType() == CLEAR_VALUE) {
    			if((quoteOptionSubmission.getDentalQuoteOptionId() == null || quoteOptionSubmission.getDentalQuoteOptionId() <= 0) &&
                   (quoteOptionSubmission.getVisionQuoteOptionId() == null || quoteOptionSubmission.getVisionQuoteOptionId() <= 0) &&
                   externalProducts.isEmpty()) {
    				quoteOptionSubmission.setErrorMessage(ANTHEM_CLEAR_VALUE_SUBMISSION_RULES_RESTRICTION_COUNT);
    				quoteOptionSubmission.setSubmissionSuccessful(false);
    				return;
    			}
    			if(quoteOptionSubmission.getDentalQuoteOptionId() != null && quoteOptionSubmission.getDentalQuoteOptionId() > 0) {
    				RfpQuoteOption dentalOption = rfpQuoteOptionRepository.findOne(quoteOptionSubmission.getDentalQuoteOptionId());
    				if(dentalOption.getRfpQuote().getQuoteType() != CLEAR_VALUE && dentalOption.getRfpQuote().getQuoteType() != QuoteType.STANDARD) {
    					quoteOptionSubmission.setErrorMessage(format(ANTHEM_CLEAR_VALUE_SUBMISSION_RULES_RESTRICTION_TYPE, dentalOption.getRfpQuote().getQuoteType()));
        				quoteOptionSubmission.setSubmissionSuccessful(false);
        				return;
    				}
    				Float discount = checkAndReturnCarrierBundlingDiscount(dentalOption, DENTAL_BUNDLE_DISCOUNT_PERCENT, false);
    				totalDiscount += isNull(discount) ? 0f : discount;
    			} 
    			if(quoteOptionSubmission.getVisionQuoteOptionId() != null && quoteOptionSubmission.getVisionQuoteOptionId() > 0) {
    				RfpQuoteOption visionOption = rfpQuoteOptionRepository.findOne(quoteOptionSubmission.getVisionQuoteOptionId());
    				if(visionOption.getRfpQuote().getQuoteType() != CLEAR_VALUE && visionOption.getRfpQuote().getQuoteType() != QuoteType.STANDARD) {
    					quoteOptionSubmission.setErrorMessage(format(ANTHEM_CLEAR_VALUE_SUBMISSION_RULES_RESTRICTION_TYPE, visionOption.getRfpQuote().getQuoteType()));
        				quoteOptionSubmission.setSubmissionSuccessful(false);
        				return;
    				}
                    Float discount = checkAndReturnCarrierBundlingDiscount(visionOption, VISION_BUNDLE_DISCOUNT_PERCENT, false);
                    totalDiscount += isNull(discount) ? 0f : discount;
    			}
    			for(ClientExtProduct extProduct : externalProducts) {
    				totalDiscount += CV_PRODUCT_DISCOUNT_PERCENT.get(extProduct.getExtProduct().getName());
				}
    			if(totalDiscount < 1.0f) {
    				quoteOptionSubmission.setErrorMessage(ANTHEM_CLEAR_VALUE_SUBMISSION_RULES_RESTRICTION_COUNT);
    				quoteOptionSubmission.setSubmissionSuccessful(false);
    				return;
    			}
    		}
    	}
    }
    
    public QuoteOptionRidersDto getQuoteOptionRiders(Long rfpQuoteOptionId) {
        return getQuoteOptionRiders(getRfpQuoteOptionById(rfpQuoteOptionId));
    }
    
    public QuoteOptionRidersDto getQuoteOptionRiders(RfpQuoteOption option) {
        Carrier carrier = option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
        List<QuoteOptionNetworkRidersDto> networkRidersList = new ArrayList<>();

        Set<Rider> specialRiders = getSpecialRiders(option);
        option.getRfpQuoteOptionNetworks().forEach(optionNetwork -> {
            QuoteOptionNetworkRidersDto dto = new QuoteOptionNetworkRidersDto();
            dto.setRfpQuoteOptionNetworkId(optionNetwork.getRfpQuoteOptionNetworkId());
            dto.setCarrier(carrier.getDisplayName());
            dto.setCarrierId(carrier.getCarrierId());
            dto.setNetworkType(optionNetwork.getRfpQuoteNetwork().getNetwork().getType());
            if (optionNetwork.getSelectedRfpQuoteNetworkPlan() != null) {
                dto.setPlanNameByNetwork(optionNetwork.getSelectedRfpQuoteNetworkPlan().getPnn().getName());
            }
            if(optionNetwork.getAdministrativeFee() != null) {
            	dto.setAdministrativeFeeId(optionNetwork.getAdministrativeFee().getAdministrativeFeeId());
            }
            Set<Rider> networkRiders = new HashSet<>();
            networkRiders.addAll(optionNetwork.getRfpQuoteNetwork().getRiders());
            if(!specialRiders.isEmpty() && dto.getNetworkType().equals(NETWORK_TYPE_HMO) 
                  || dto.getNetworkType().equals(NETWORK_TYPE_PPO) 
                  || dto.getNetworkType().equals(NETWORK_TYPE_HSA)) {
                // special riders are not linked to every quote network on creation
                networkRiders.addAll(specialRiders);
            } 
            if(optionNetwork.getSelectedRfpQuoteNetworkPlan() != null && optionNetwork.getSelectedRfpQuoteNetworkPlan().getRiders() != null) {
              /* static plan riders returned in network rides list, just for information 
               * and not needed to show them separately */
              networkRiders.addAll(optionNetwork.getSelectedRfpQuoteNetworkPlan().getRiders());
            } 
            dto.setRiders(createRiderDtoList(networkRiders, optionNetwork.getSelectedRiders()));        
            networkRidersList.add(dto);
        });

        QuoteOptionRidersDto optionRidersDto = new QuoteOptionRidersDto();
        optionRidersDto.setRfpQuoteOptionId(option.getRfpQuoteOptionId());
        optionRidersDto.setCarrier(option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier().getDisplayName());
        optionRidersDto.setNetworkRidersDtos(networkRidersList);
        // actually not used now, rider_rfp_quote_option table is empty
        optionRidersDto.setRiders(createRiderDtoList(option.getRfpQuote().getRiders(), option.getSelectedRiders()));

        return optionRidersDto;
    }
    
    protected Set<Rider> getSpecialRiders(RfpQuoteOption rfpQuoteOption) {
        // default implementation
        return Collections.emptySet();
    }

    public void selectRiderByOptionNetworkId(Long networkId, Long riderId, boolean selected) {
        Rider rider = riderRepository.findOne(riderId);

        boolean isSelectable = rider.getSelectable() != null 
                ? rider.getSelectable() 
                : rider.getRiderMeta().isSelectable();  
        if(!isSelectable) {
            throw new BadRequestException("Rider is not selectable")
                .withFields(
                    field("rider_id", riderId)
                );
        }

        RfpQuoteOptionNetwork network = rfpQuoteOptionNetworkRepository.findOne(networkId);

        if(selected) {
            network.getSelectedRiders().add(rider);
        } else {
            network.getSelectedRiders().remove(rider);
        }
        
        rfpQuoteOptionNetworkRepository.save(network);

        invalidateCachedRfpQuoteOption(network.getRfpQuoteOption());
    }

    public void selectRiderByOptionId(Long optionId, Long riderId, boolean selected) {
        Rider rider = riderRepository.findOne(riderId);

        boolean isSelectable = rider.getSelectable() != null 
                ? rider.getSelectable() 
                : rider.getRiderMeta().isSelectable();  
        if(!isSelectable) {
            throw new BadRequestException("Rider is not selectable")
                .withFields(
                    field("rider_id", riderId)
                );
        }

        RfpQuoteOption option = getRfpQuoteOptionById(optionId);

        if(selected) {
            option.getSelectedRiders().add(rider);
        } else {
            option.getSelectedRiders().remove(rider);
        }

        rfpQuoteOptionRepository.save(option);

        invalidateCachedRfpQuoteOption(option); 
    }

    private List<RiderDto> createRiderDtoList(Collection<Rider> allRiders, Collection<Rider> selectedRider) {
        List<RiderDto> riderDtos = new ArrayList<>();

        allRiders.forEach(
            rider -> {
                boolean isSelectable = rider.getSelectable() != null
                        ? rider.getSelectable()
                        : rider.getRiderMeta().isSelectable();
                RiderDto riderDto = new RiderDto();
                riderDto.setRiderId(rider.getRiderId());
                riderDto.setRiderCode(rider.getRiderMeta().getCode());
                riderDto.setRiderDescription(rider.getRiderMeta().getDescription());
                riderDto.setSelectable(isSelectable);
                riderDto.setTier1Rate(rider.getTier1Rate());
                riderDto.setTier2Rate(rider.getTier2Rate());
                riderDto.setTier3Rate(rider.getTier3Rate());
                riderDto.setTier4Rate(rider.getTier4Rate());
                boolean selected = isSelectable && CollectionUtils.isNotEmpty(selectedRider)
                    && selectedRider.contains(rider);
                riderDto.setSelected(selected);
                riderDtos.add(riderDto);
            }
        );

        return riderDtos;
    }
    
    public RfpQuoteAncillaryOptionDto getQuoteAncellaryOptionById(Long rfpQuoteAncillaryOptionId) {
        RfpQuoteAncillaryOptionDto result = new RfpQuoteAncillaryOptionDto();
        
        RfpQuoteAncillaryOption option = rfpQuoteAncillaryOptionRepository.findOne(rfpQuoteAncillaryOptionId);
        
        List<RfpQuoteAncillaryPlan> alternatives = rfpQuoteAncillaryPlanRepository.findByRfpQuote(option.getRfpQuote());
        
        // find Current plans
        
        Client client = option.getRfpQuote().getRfpSubmission().getClient();
        String product = option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory();
        PlanCategory category = PlanCategory.valueOf(product);
        
        Collection<String> planTypes = category.getPlanTypes();
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(client.getClientId(), planTypes);
        
        RfpQuoteAncillaryPlanDto currentPlan = null, first = null, second = null, match = null;
        double currentPlanTotal = 0.0;
        for(ClientPlan clientPlan : clientPlans) {
            if(clientPlan.getAncillaryPlan() != null) {
            	currentPlan = new RfpQuoteAncillaryPlanDto();
                RfpMapper.rfpPlanToRfpPlanDto(clientPlan.getAncillaryPlan(), currentPlan);
                currentPlan.setType(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT);
                float monthlyPlanCost = calcClientPlanTotal(clientPlan);
                currentPlanTotal += monthlyPlanCost;
                if(currentPlan.getPlanType() != AncillaryPlanType.VOLUNTARY) {
                	// calculate MonthlyCost for BASIC plans
                	currentPlan.getRates().setMonthlyCost(monthlyPlanCost);
                }
            }
        }
        currentPlanTotal = currentPlanTotal * MONTHS_IN_YEAR;

        result.setRfpQuoteAncillaryOptionId(rfpQuoteAncillaryOptionId);
        result.setName(option.getName());
        result.setDisplayName(option.getDisplayName());
        result.setRfpQuoteId(option.getRfpQuote().getRfpQuoteId());

        for(RfpQuoteAncillaryPlan plan : alternatives) {
            RfpQuoteAncillaryPlanDto dto = RfpMapper.ancQuotePlanToAncQuotePlanDto(plan);
            double monthlyPlanCost = calcAncillaryPlanTotal(plan.getAncillaryPlan(), category);
            if(dto.getPlanType() != AncillaryPlanType.VOLUNTARY) {
            	// calculate MonthlyCost for BASIC plans
            	dto.getRates().setMonthlyCost(monthlyPlanCost);
            }
           
            dto.setSelected(plan.equals(option.getRfpQuoteAncillaryPlan()));
            if(dto.getSelected()) {
            	dto.setRfpQuoteAncillaryOptionId(option.getOptionId());
            	first = dto;
            }
            dto.setSelectedSecond(plan.equals(option.getSecondRfpQuoteAncillaryPlan()));
            if(dto.getSelectedSecond()) {
            	second = dto;
            }

            double altPlanTotal = monthlyPlanCost * MONTHS_IN_YEAR;
            dto.setPercentDifference((float) MathUtils.diffPecent(altPlanTotal, currentPlanTotal, 2));
            if(dto.getSelected()) {
                result.setDollarDifference(altPlanTotal - currentPlanTotal);
                result.setPercentDifference(dto.getPercentDifference());
                result.setTotalAnnualPremium(altPlanTotal);
            }
         
            if(dto.isMatchPlan()) {
            	dto.setType(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_MATCH_PLAN);
            	if (!dto.getSelected() && !dto.getSelectedSecond()) {
            		match = dto;
            	}
            	
            } else {
            	dto.setType(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE);
            	if (dto != first && dto != second) {
            		// first and second will be added below, see // sort: comment
            		result.getPlans().add(dto);
            	}
            }
        }
        // sort: current, selected, selectedSecond matchPlan, alternatives
    	if(match != null) {
    		result.getPlans().add(0, match);
        } 
    	if(second != null) {
        	result.getPlans().add(0, second);
        } 
    	if(first != null) {
        	result.getPlans().add(0, first);
        }
        if(currentPlan != null) {
        	result.getPlans().add(0, currentPlan);
        }
        return result;
    }

    public QuoteOptionDetailsDto getQuoteOptionById(Long rfpQuoteOptionId) {
        RfpQuoteOption quoteOption = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);
        Map<Long, RfpQuoteOptionNetwork> optionNetworkIndex = quoteOption.getRfpQuoteOptionNetworks().stream()
            .filter(on -> on.getClientPlan() != null)
            .collect(
                toMap(
                    on -> {return on.getClientPlan().getClientPlanId();},
                    identity()
                )
            );

        // proposed carrier
        RfpCarrier rfpCarrier = quoteOption.getRfpQuote().getRfpSubmission().getRfpCarrier();

        PlanCategory planCategory = PlanCategory.valueOf(rfpCarrier.getCategory());
        Long clientId = quoteOption.getRfpQuote().getRfpSubmission().getClient().getClientId();
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(clientId, planCategory.getPlanTypes());

        // calculate bundle discount
        BundleDiscounts discounts = calcBundleDiscount(clientId);
        
        boolean isOptionAlongsideKaiser = isAlongsideKaiser(quoteOption);
        
        // plans cards layout
        List<QuoteOptionPlanDetailsDto> detailedPlans = new ArrayList<>();

        // 1) starting from all client plans
        Set<Long> layoutQuoteOptionNetworks = new HashSet<>();

        for(ClientPlan clientPlan : clientPlans) {
            QuoteOptionPlanDetailsDto detailedPlan = new QuoteOptionPlanDetailsDto();
            detailedPlan.setType(clientPlan.getPnn().getNetwork().getType());
            QuoteOptionPlanBriefDto currentPlan = buildCurrentQuoteOptionPlanBrief(clientPlan);

            // set current plan cost
            currentPlan.setCost(findCosts(null, null, clientPlan,
                currentPlan.getTotal(), discounts, quoteOption.getRfpQuote().getRatingTiers()));
            detailedPlan.setCurrentPlan(currentPlan);
            detailedPlan.setOutOfState(clientPlan.isOutOfState());

            // if option (rfp_quote_option_network) already has item for current plan (client_plan_id = current)
            RfpQuoteOptionNetwork optNetwork = optionNetworkIndex.get(clientPlan.getClientPlanId());
            QuoteOptionPlanBriefDto newPlan = null;
            QuoteOptionPlanBriefDto secondNewPlan = null;

            if(optNetwork != null) {

                detailedPlan.setRfpQuoteOptionNetworkId(optNetwork.getRfpQuoteOptionNetworkId());
                detailedPlan.setRfpQuoteNetworkId(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId());
                detailedPlan.setEmployerFund(calcEmployerFund(optNetwork, detailedPlan.getType()));
                detailedPlan.setAdministrativeFee(administrativeFeeService.calcAdministrativeFee(optNetwork, detailedPlan.getType()));
                detailedPlan.setNetworkName(optNetwork.getRfpQuoteNetwork().getNetwork().getName());
                detailedPlan.setNetworkId(optNetwork.getRfpQuoteNetwork().getNetwork().getNetworkId());
                // isKaiserNetwork should be "false" for Full takeover case
                detailedPlan.setKaiserNetwork(isKaiserNetwork(optNetwork) && isOptionAlongsideKaiser);

                if(optNetwork.getSelectedRfpQuoteNetworkPlan() != null) {
                    newPlan = buildNewQuoteOptionPlanBrief(optNetwork, optNetwork.getSelectedRfpQuoteNetworkPlan(), discounts);
                    detailedPlan.setRfpQuoteNetworkPlanId(optNetwork.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId());
                    newPlan.setSelected(true);
                    setSelectedPlanBenefitsAndCost(optNetwork, optNetwork.getSelectedRfpQuoteNetworkPlan(),
                        optNetwork.getSelectedRfpQuoteNetworkRxPlan(), newPlan,
                        discounts, quoteOption.getRfpQuote().getRatingTiers());
                    if(optNetwork.getSelectedRfpQuoteNetworkRxPlan() != null){
                        detailedPlan.setRfpQuoteNetworkRxPlanId(optNetwork.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId());
                    }
                }

                if(optNetwork.getSelectedSecondRfpQuoteNetworkPlan() != null) {
                    secondNewPlan = buildNewQuoteOptionPlanBrief(optNetwork, optNetwork.getSelectedSecondRfpQuoteNetworkPlan(),
                        optNetwork.getSelectedSecondRfpQuoteNetworkRxPlan(), discounts);
                    detailedPlan.setSecondRfpQuoteNetworkPlanId(optNetwork.getSelectedSecondRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId());
                    setSelectedPlanBenefitsAndCost(optNetwork, optNetwork.getSelectedSecondRfpQuoteNetworkPlan(),
                        optNetwork.getSelectedSecondRfpQuoteNetworkRxPlan(), secondNewPlan,
                        discounts, quoteOption.getRfpQuote().getRatingTiers());

                    if(optNetwork.getSelectedSecondRfpQuoteNetworkRxPlan() != null){
                        detailedPlan.setSecondRfpQuoteNetworkRxPlanId(optNetwork.getSelectedSecondRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId());
                    }
                }
                layoutQuoteOptionNetworks.add(optNetwork.getRfpQuoteOptionNetworkId());
                setQuoteDiscount(detailedPlan, optNetwork);
            }

            if(detailedPlan.isKaiserNetwork()) {
            	Carrier carrier = extractClientPlanCarrier(clientPlan);
            	if(carrier != null) {
            		detailedPlan.setCarrier(carrier.getDisplayName());
            		detailedPlan.setCarrierId(carrier.getCarrierId());
            	}
            } else {
                detailedPlan.setCarrier(rfpCarrier.getCarrier().getDisplayName());
                detailedPlan.setCarrierId(rfpCarrier.getCarrier().getCarrierId());
            }

            detailedPlan.setRfpCarrierId(rfpCarrier.getRfpCarrierId());
            detailedPlan.setNewPlan(newPlan);
            detailedPlan.setSecondNewPlan(secondNewPlan);

            if(newPlan != null) {
                detailedPlan.setDollarDifference(newPlan.getTotal() - currentPlan.getTotal());
                detailedPlan.setPercentDifference(MathUtils.diffPecent(newPlan.getTotal(), currentPlan.getTotal(), 1));
            }

            detailedPlans.add(detailedPlan);
        }


        // 2) if option includes proposed plan of type that client not have, add it to layout
        for(RfpQuoteOptionNetwork optNetwork : quoteOption.getRfpQuoteOptionNetworks()) {
            if(layoutQuoteOptionNetworks.contains(optNetwork.getRfpQuoteOptionNetworkId())) {
                continue;
            }
            // item of plans layout by network
            QuoteOptionPlanDetailsDto detailedPlan = new QuoteOptionPlanDetailsDto();
            detailedPlan.setRfpQuoteOptionNetworkId(optNetwork.getRfpQuoteOptionNetworkId());
            detailedPlan.setRfpQuoteNetworkId(optNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId());
            detailedPlan.setType(optNetwork.getRfpQuoteNetwork().getNetwork().getType());
            detailedPlan.setNetworkName(optNetwork.getRfpQuoteNetwork().getNetwork().getName());
            detailedPlan.setNetworkId(optNetwork.getRfpQuoteNetwork().getNetwork().getNetworkId());
            detailedPlan.setCarrier(rfpCarrier.getCarrier().getDisplayName());
            detailedPlan.setCarrierId(rfpCarrier.getCarrier().getCarrierId());
            detailedPlan.setRfpCarrierId(rfpCarrier.getRfpCarrierId());
            // isKaiserNetwork should be "false" for Full takeover case
            detailedPlan.setKaiserNetwork(isKaiserNetwork(optNetwork) && isOptionAlongsideKaiser);
            detailedPlan.setOutOfState(optNetwork.isOutOfState());

            if(optNetwork.getSelectedRfpQuoteNetworkPlan() != null) {
            	QuoteOptionPlanBriefDto newPlan = buildNewQuoteOptionPlanBrief(
            	        optNetwork, optNetwork.getSelectedRfpQuoteNetworkPlan(), discounts);
                detailedPlan.setEmployerFund(calcEmployerFund(optNetwork, detailedPlan.getType()));
                detailedPlan.setAdministrativeFee(administrativeFeeService.calcAdministrativeFee(optNetwork, detailedPlan.getType()));
                detailedPlan.setNewPlan(newPlan);
                detailedPlan.setRfpQuoteNetworkPlanId(optNetwork.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId());
                newPlan.setSelected(true);
                setSelectedPlanBenefitsAndCost(optNetwork, optNetwork.getSelectedRfpQuoteNetworkPlan(),
                    optNetwork.getSelectedRfpQuoteNetworkRxPlan(), newPlan,
                    discounts, quoteOption.getRfpQuote().getRatingTiers());

                if(optNetwork.getSelectedRfpQuoteNetworkRxPlan() != null){
                    detailedPlan.setRfpQuoteNetworkRxPlanId(optNetwork.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId());
                }
            }

            if(optNetwork.getSelectedSecondRfpQuoteNetworkPlan() != null) {
                QuoteOptionPlanBriefDto secondNewPlan = buildNewQuoteOptionPlanBrief(optNetwork, optNetwork.getSelectedSecondRfpQuoteNetworkPlan(), discounts);
                detailedPlan.setSecondNewPlan(secondNewPlan);
                detailedPlan.setSecondRfpQuoteNetworkPlanId(optNetwork.getSelectedSecondRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId());
                setSelectedPlanBenefitsAndCost(optNetwork, optNetwork.getSelectedSecondRfpQuoteNetworkPlan(),
                    optNetwork.getSelectedSecondRfpQuoteNetworkRxPlan(), secondNewPlan,
                    discounts, quoteOption.getRfpQuote().getRatingTiers());

                if(optNetwork.getSelectedSecondRfpQuoteNetworkRxPlan() != null){
                    detailedPlan.setSecondRfpQuoteNetworkRxPlanId(optNetwork.getSelectedSecondRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId());
                }
            }
            setQuoteDiscount(detailedPlan, optNetwork);
            
            
            detailedPlans.add(detailedPlan);
        }

        // store all calculated items to result DTO
        QuoteOptionDetailsDto result = new QuoteOptionDetailsDto();
        result.setId(rfpQuoteOptionId);
        result.setDisplayName(quoteOption.getDisplayName());
        result.setName(quoteOption.getRfpQuoteOptionName());
        result.setQuoteType(quoteOption.getRfpQuote().getQuoteType());
        result.setQuoteId(quoteOption.getRfpQuote().getRfpQuoteId());
        result.setDetailedPlans(detailedPlans);
        QuoteOptionPlanBriefDto newOverviewPlan = new QuoteOptionPlanBriefDto();
        result.getOverviewPlans().add(newOverviewPlan);
        QuoteOptionPlanBriefDto currentOverviewPlan = new QuoteOptionPlanBriefDto();
        result.getOverviewPlans().add(currentOverviewPlan);

        float employerFundTotal = (float) detailedPlans.stream()
        		.mapToDouble(p -> p.getEmployerFund() !=null ? p.getEmployerFund() : 0.0)
        		.sum();
        float administrativeFee = (float) detailedPlans.stream()
        		.mapToDouble(p -> p.getAdministrativeFee() != null ? p.getAdministrativeFee() : 0.0)
        		.sum();
        
        // walk through detailed plans and calc its math for new carrier (table on top of the page)
        List<QuoteOptionPlanBriefDto> newOverviewPlans = detailedPlans.stream()
            .map(QuoteOptionPlanDetailsDto::getNewPlan)
            .filter(Objects::nonNull)
            .collect(toList());

        if(!newOverviewPlans.isEmpty()) {
            newOverviewPlan.setCarrier(rfpCarrier.getCarrier().getDisplayName());
            newOverviewPlan.setEmployer(0f);
            newOverviewPlan.setTotal(0f);

            for(QuoteOptionPlanBriefDto newPlan : newOverviewPlans) {
                newOverviewPlan.setEmployer(newOverviewPlan.getEmployer() + newPlan.getEmployer());
                newOverviewPlan.setTotal(newOverviewPlan.getTotal() + newPlan.getTotal());
            }
            newOverviewPlan.setTotal(newOverviewPlan.getTotal() + employerFundTotal + administrativeFee);
            newOverviewPlan.setEmployer(newOverviewPlan.getEmployer() + employerFundTotal + administrativeFee);   
            newOverviewPlan.setEmployee(newOverviewPlan.getTotal() - newOverviewPlan.getEmployer());
            result.setTotalAnnualPremium(newOverviewPlan.getTotal() * MONTHS_IN_YEAR);
            result.setNewPlanAnnual(round((newOverviewPlan.getTotal() - employerFundTotal - administrativeFee) * MONTHS_IN_YEAR, 2));
        }

        // if any client plan found
        RfpQuote currentRfpQuote = null;
        if(clientPlans.size() > 0) {
            currentRfpQuote = prepareCurrentQuote(clientPlans);
            currentOverviewPlan.setCarrier(currentRfpQuote.getRfpSubmission().getRfpCarrier().getCarrier().getDisplayName());            
            currentOverviewPlan.setQuoteType(currentRfpQuote.getQuoteType());            
            currentOverviewPlan.setLabel("(current plan)");
            currentOverviewPlan.setEmployer(0f);
            currentOverviewPlan.setTotal(0f);
            
            // walk through detailed plans and calc its math for current carrier (table on top of the page)
            for(QuoteOptionPlanDetailsDto detailedPlan : detailedPlans) {
                if(detailedPlan.getCurrentPlan() == null) {
                    continue;
                }
                currentOverviewPlan.setEmployer(currentOverviewPlan.getEmployer() + detailedPlan.getCurrentPlan().getEmployer());
                currentOverviewPlan.setTotal(currentOverviewPlan.getTotal() + detailedPlan.getCurrentPlan().getTotal());
            }
            currentOverviewPlan.setTotal(currentOverviewPlan.getTotal() + employerFundTotal + administrativeFee);
            currentOverviewPlan.setEmployer(currentOverviewPlan.getEmployer() + employerFundTotal + administrativeFee);
            currentOverviewPlan.setEmployee(currentOverviewPlan.getTotal() - currentOverviewPlan.getEmployer());
            result.setCurrentPlanAnnual(round((currentOverviewPlan.getTotal() - employerFundTotal - administrativeFee) * MONTHS_IN_YEAR, 2));
            
            // next fields actual only if current client plan and new plan are exist
            if(newOverviewPlan.getTotal() != null) {
                Float currentTotalAnnualPremium = currentOverviewPlan.getTotal() * MONTHS_IN_YEAR;
                result.setDollarDifference(result.getTotalAnnualPremium() - currentTotalAnnualPremium);
                result.setPercentDifference(MathUtils.diffPecent(result.getTotalAnnualPremium(), currentTotalAnnualPremium, 1));
            }
        }
        // possible bundle discount
        result.setMaxBundleDiscount(calcMaxBundleDiscount(result.getTotalAnnualPremium(), discounts));
        
        // update cached Option 1 or Renewal 1 values and related Activities
        if(StringUtils.equalsAny(result.getName(), OPTION_1_NAME, RENEWAL_1_NAME)) {
            QuoteOptionCachedParams cached = new QuoteOptionCachedParams();
            cached.setDiffPercent(result.getPercentDifference());
            cached.setDiffDollar(result.getDollarDifference());
            cached.setOptionTotal(result.getTotalAnnualPremium());
            if(currentRfpQuote != null) {
                Carrier carrier = currentRfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();
                cached.setCarrierId(carrier.getCarrierId());
                cached.setCarrierName(carrier.getName());
                cached.setCarrierDisplayName(carrier.getDisplayName());
            }
            cacheService.hSet(CacheKeyType.RFP_QUOTE_OPTION.getKeyPrefix(), 
                result.getId().toString(), cached);
            if(RENEWAL_1_NAME.equals(result.getName())) {
                updateOrCreateRenewalAddedActivity(clientId, rfpCarrier.getCategory(), result.getPercentDifference());
            }  
        } else if(result.getName().equals(RENEWAL_OPTION_NAME)) {
            updateRenewalAddedActivity(clientId, rfpCarrier.getCategory(), result.getPercentDifference());
        } 
        // sort: current, selected, selectedSecond matchPlan, alternatives
        RfpQuoteAncillaryPlanDto currentPlan = null, first = null, second = null, match = null;
//        for (QuoteOptionPlanDetailsDto plan : result.getDetailedPlans()) {
//        	if (plan.getType())
//			
//		}
      
        return result;
    }

    private void setSelectedPlanBenefitsAndCost(RfpQuoteOptionNetwork rqon,
        RfpQuoteNetworkPlan networkPlan, RfpQuoteNetworkPlan networkRxPlan,
        QuoteOptionPlanBriefDto quoteOptionPlanBriefDto,
        BundleDiscounts discounts, int quoteRatingTier){

        // add benefits for broker-app
        List<Rx> rx = new ArrayList<>();
        List<QuoteOptionAltPlanDto.Benefit> benefits = findBenefits(networkPlan.getPnn().getPlan().getPlanId(), rx);
        quoteOptionPlanBriefDto.setBenefits(benefits);

        if(CollectionUtils.isEmpty(rx) && networkRxPlan != null
            && networkRxPlan.getPnn().getNetwork().getCarrier().getName().equals(UHC.name())){
            findBenefits(networkRxPlan.getPnn().getPlan().getPlanId(), rx);
        }
        quoteOptionPlanBriefDto.setRx(rx);
        quoteOptionPlanBriefDto.setCost(
            findCosts(rqon, networkPlan, networkRxPlan, null,
                rqon.getClientPlan() != null ? calcClientPlanTotal(rqon.getClientPlan()) : null,
                discounts, quoteRatingTier));

    }

    // carrier specific
    protected void setQuoteDiscount(QuoteOptionPlanDetailsDto detailedPlan, RfpQuoteOptionNetwork optNetwork) {
        // default, do nothing
    } 

    public List<QuoteOptionPlanComparisonDto> compareQuoteOptions(List<Long> rfpQuoteOptionIds, Boolean currentOptionCompare) {
        return compareQuoteOptions(rfpQuoteOptionIds, currentOptionCompare, null, null);
    }
    
    public byte[] compareAncillaryPlansFile(String product, Long clientId, List<Long> carrierIds) {
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(clientId, product);
        List<RFP> rfps = rfpRepository.findByClientClientId(clientId);
        RfpQuoteSummary rqs = rfpQuoteSummaryRepository.findByClientClientId(clientId);
        Client client = clientRepository.findOne(clientId);
        PlanCategory category = PlanCategory.valueOf(product);
        
        List<RfpQuoteAncillaryPlanComparisonDto> compareResult = compareAncillaryPlans(product, clientId, carrierIds);
        
        PoiUtil poiUtil = new PoiUtil();
        return poiUtil.convertAncillaryPlanComparisonDtoToExcel(client, category, compareResult, rfpQuotes, rfps, rqs);
    }
    
    public List<RfpQuoteAncillaryPlanComparisonDto> compareAncillaryPlans(String product, Long clientId, List<Long> carrierIds) {
        
        List<RfpQuoteAncillaryPlanComparisonDto> result = new ArrayList<>();
        
        double currentPlanTotal = 0f;
        PlanCategory category = PlanCategory.valueOf(product);
        Collection<String> planTypes = category.getPlanTypes();
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(clientId, planTypes);
        for(ClientPlan clientPlan : clientPlans) {
            if(clientPlan.getAncillaryPlan() != null ) {
                RfpQuoteAncillaryPlanComparisonDto currentPlan = new RfpQuoteAncillaryPlanComparisonDto();
                RfpMapper.rfpPlanToRfpPlanDto(clientPlan.getAncillaryPlan(), currentPlan);
                currentPlan.setType(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT);
                currentPlan.setOptionName(Constants.CURRENT_NAME);

                float monthlyPlanCost = calcClientPlanTotal(clientPlan);
                currentPlanTotal += monthlyPlanCost;
                if(currentPlan.getPlanType() != AncillaryPlanType.VOLUNTARY) {
                    // calculate MonthlyCost for BASIC plans
                    currentPlan.getRates().setMonthlyCost(monthlyPlanCost);
                }
                result.add(currentPlan);
            }
        }
        
        List<RfpQuote> quotes = rfpQuoteRepository.findByClientIdAndCategoryAndQuoteType(
            clientId, product, QuoteType.STANDARD);
        
        List<RfpQuoteAncillaryOption> allOptions = new ArrayList<>();
        for(RfpQuote rfpQuote : quotes) {
            allOptions.addAll(rfpQuoteAncillaryOptionRepository.findByRfpQuote(rfpQuote));
        }
        
        List<RfpQuoteAncillaryOption> sortedOptions = sortOptionsByType(allOptions, 
        		RfpQuoteAncillaryOption::getName, RfpQuoteAncillaryOption::getRfpQuoteAncillaryOptionId,
        		OptionType.RENEWAL, OptionType.NEGOTIATED, OptionType.OPTION);

        Map<RfpQuoteAncillaryPlan, String> optionsByPlan = sortedOptions.stream()
            .filter(o -> o.getRfpQuoteAncillaryPlan() != null)
            .collect(Collectors.groupingBy(
                o -> o.getRfpQuoteAncillaryPlan(), 
                LinkedHashMap::new, // keep the order
                Collectors.mapping(RfpQuoteAncillaryOption::getName, Collectors.joining(", "))));
        
        for (Entry<RfpQuoteAncillaryPlan, String> entry : optionsByPlan.entrySet()) {
        	RfpQuoteAncillaryPlan plan = entry.getKey();
        	// filter by carrier
            Carrier carrier = plan.getAncillaryPlan().getCarrier();
            if(CollectionUtils.isNotEmpty(carrierIds) && !carrierIds.contains(carrier.getCarrierId())) {
                continue;
            }

            String options = entry.getValue();
            RfpQuoteAncillaryPlanComparisonDto dto = new RfpQuoteAncillaryPlanComparisonDto();
            if(options != null) {
                dto.setSelected(true);
                dto.setOptionName(options);
            }

            RfpMapper.ancQuotePlanToAncQuotePlanDto(plan, dto);
            double altPlanTotal = calcAncillaryPlanTotal(plan.getAncillaryPlan(), category);
            if(currentPlanTotal > 0.0) {
                dto.setPercentDifference((float) MathUtils.diffPecent(altPlanTotal, currentPlanTotal, 2));
            }

            if(dto.getPlanType() != AncillaryPlanType.VOLUNTARY) {
                // calculate MonthlyCost for BASIC plans
                dto.getRates().setMonthlyCost(altPlanTotal);
            }

//            dto.setType(dto.isMatchPlan() ? QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_MATCH_PLAN 
//                : QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE);

            result.add(dto);
        }
        return result;
    }
 
    public List<QuoteOptionPlanComparisonDto> compareQuoteOptions(List<Long> rfpQuoteOptionIds, 
            Boolean currentOptionCompare, Long clientPlanId, List<Long> carrierIds) {
        List<QuoteOptionPlanComparisonDto> result = new ArrayList<>();

        if(rfpQuoteOptionIds.isEmpty()) {
            return result;
        }

        List<RfpQuoteOption> options = new ArrayList<>();
        Map<String, QuoteOptionAltPlanDto> planIndex = new HashMap<>();

        List<ClientPlan> clientPlans = new ArrayList<>();
        Set<Triple<String, Long, String>> clientPlanNames = new TreeSet<>();
        Map<Pair<String, String>, Long> samePlanMap = new HashMap<>();
        for(Long rfpQuoteOptionId : rfpQuoteOptionIds) {
            RfpQuoteOption opt = getRfpQuoteOptionById(rfpQuoteOptionId);

            options.add(opt);
            
            QuoteOptionRidersDto optionRiders = getQuoteOptionRiders(opt);
            
            BundleDiscounts discounts = calcBundleDiscount(opt);
            samePlanMap.clear();
            for(RfpQuoteOptionNetwork rqon : opt.getRfpQuoteOptionNetworks()) {
                if(rqon.getSelectedRfpQuoteNetworkPlan() == null) {
                    continue;
                }
                // filter by carrier
                Carrier carrier = rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getNetwork().getCarrier();
                if(CollectionUtils.isNotEmpty(carrierIds) && !carrierIds.contains(carrier.getCarrierId())) {
                    continue;
                }
                
                if(clientPlanId != null && (rqon.getClientPlan() == null 
                        || !rqon.getClientPlan().getClientPlanId().equals(clientPlanId))) {
                    continue;
                }
                Triple<String, Long, String> clientPlanName;
                if(rqon.getClientPlan() == null) {
                    // If the Options have several plans with the same name and type, 
                    // there is no way to tell which plans to bind together, 
                    // so we bind them in the order of appearance.
                    Pair<String, String> samePlanPair = Pair.of(
                            rqon.getRfpQuoteNetwork().getNetwork().getName(), 
                            rqon.getRfpQuoteNetwork().getNetwork().getType());
                    Long samePlanIndex = samePlanMap.get(samePlanPair);
                    samePlanIndex = (samePlanIndex == null)? Long.valueOf(1L): samePlanIndex + 1;               
                    samePlanMap.put(samePlanPair, samePlanIndex);
                    
                	// using network name to group plans which not have linked client plan
                	clientPlanName = Triple.of(
                	        rqon.getRfpQuoteNetwork().getNetwork().getName(),
                	        samePlanIndex, // Network is reused so networkId will be the same
                	        rqon.getRfpQuoteNetwork().getNetwork().getType());
                } else {
                	ClientPlan clientPlan = rqon.getClientPlan();
                    clientPlans.add(clientPlan);
                	clientPlanName = Triple.of(
                	        clientPlan.getPnn().getName(),
                	        clientPlan.getClientPlanId(), // Pnn is reused, so pnnId will be the same 
                	        clientPlan.getPnn().getNetwork().getType());
                } 
                Float currentPlanTotal = rqon.getClientPlan() != null ? calcClientPlanTotal(rqon.getClientPlan()) : null;
                clientPlanNames.add(clientPlanName);
                QuoteOptionAltPlanDto plan = buildAltPlan(rqon, rqon.getSelectedRfpQuoteNetworkPlan(), currentPlanTotal, discounts);
             
                Float currentCost = rqon.getClientPlan() != null ? calcClientPlanTotal(rqon.getClientPlan()) : null;
                plan.setCost(findCosts(rqon, rqon.getSelectedRfpQuoteNetworkPlan(), null,
                    currentCost, discounts, rqon.getRfpQuoteOption().getRfpQuote().getRatingTiers()));
                
                // find available riders for this rqon
                optionRiders.getNetworkRidersDtos().stream()
                    .filter(r -> r.getRfpQuoteOptionNetworkId().equals(rqon.getRfpQuoteOptionNetworkId()))
                    .findFirst().ifPresent(r -> {
                        plan.setRiders(r.getRiders());
                    });

                if(plan.getRx().isEmpty() && rqon.getSelectedRfpQuoteNetworkRxPlan() != null) {
                    findBenefits(rqon.getSelectedRfpQuoteNetworkRxPlan().getPnn().getPlan().getPlanId(), plan.getRx());
                }
                
                String indexKey = buildOptionsCompareIndexKey(opt, clientPlanName);
                planIndex.put(indexKey, plan);

                if(currentOptionCompare && rqon.getClientPlan() != null) {
                	indexKey = buildOptionsCompareIndexKey(null, clientPlanName);
                    
                    if(planIndex.get(indexKey) == null) {
                        QuoteOptionAltPlanDto currentPlan = new QuoteOptionAltPlanDto();
                        currentPlan.setType(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT);
                        currentPlan.setName(clientPlanName.getLeft());
                        List<Rx> rx = new ArrayList<>();
                        currentPlan.setBenefits(findBenefits(rqon.getClientPlan().getPnn().getPlan().getPlanId(), rx));
                        if(rx.isEmpty() && rqon.getClientPlan().getRxPnn() != null) {
                            findBenefits(rqon.getClientPlan().getRxPnn().getPlan().getPlanId(), rx);
                        }
                        currentPlan.setRx(rx);
                        currentPlan.setSelected(true);
                        currentPlan.setCost(findCosts(rqon, null, rqon.getClientPlan(),
                            null, null, rqon.getRfpQuoteOption().getRfpQuote().getRatingTiers()));
                        currentPlan.setCarrier(rqon.getClientPlan().getPnn().getNetwork().getCarrier().getDisplayName());
                        currentPlan.setNetworkName(rqon.getClientPlan().getPnn().getNetwork().getName());
                        planIndex.put(indexKey, currentPlan);
                    }
                }
            }
        }
        
        if(options.isEmpty()) { // filtered by clientPlanId and carrierIds
            return result;
        }
        // options not empty at this code (see input params checking)
        int ratingTiers = options.get(0).getRfpQuote().getRatingTiers();
        for(RfpQuoteOption option : options) {
			if(option.getRfpQuote().getRatingTiers() != ratingTiers) {
				// options cannot be compared correctly
				throw new ClientException("Compared options have different number of tiers");
			}
		}
        
        if(currentOptionCompare) {
            Client client = null;
            if(clientPlanId != null) {
                ClientPlan cp = clientPlanRepository.findOne(clientPlanId);
                clientPlans.add(cp);
            } else if(!clientPlans.isEmpty()) {
                client = clientPlans.stream().findFirst().orElseThrow(() -> new NotFoundException("No client plans were found")).getClient();
                List<String> planTypes = mapToList(clientPlans, cp -> cp.getPnn().getPlanType()).stream().filter(x -> x != null).collect(toList());
                String planType = planTypes.stream().findFirst().orElseThrow(() -> new ValidationException("No valid client plans are available"));
                PlanCategory planCategory = PlanCategory.findByPlanType(planType);
                List<ClientPlan> clPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(client.getClientId(), planCategory.getPlanTypes());
                clientPlans.addAll(clPlans);
            }
            RfpQuoteOption currentOption = prepareCurrentOption(clientPlans);
	        options.add(0, currentOption);
        }

        // group by not-unique pairs to get duplicates (group has size > 1) and add number prefix
        TreeMap<Pair<String, String>, List<Triple<String, Long, String>>> clientPlanNamesGroups = 
            clientPlanNames.stream()
            .collect(Collectors.groupingBy(t -> Pair.of(t.getLeft(), t.getRight()), TreeMap::new, toList()));
        
        for(RfpQuoteOption option : options) {
            QuoteOptionPlanComparisonDto item = new QuoteOptionPlanComparisonDto();
            item.setRfpQuoteOptionId(option.getRfpQuoteOptionId());
            item.setName(option.getRfpQuoteOptionName());
            RfpCarrier rfpCarrier = option.getRfpQuote().getRfpSubmission().getRfpCarrier();
            item.setCarrier(rfpCarrier.getCarrier().getDisplayName());
            item.setSelected(option.isFinalSelection());
            List<PlanByNetwork> plans = new ArrayList<>();

            for(Pair<String, String> clientPlanName : clientPlanNamesGroups.keySet()) {	
        		List<Triple<String, Long, String>> duplicates =  clientPlanNamesGroups.get(clientPlanName);
        		// generate unique name for each duplicate
        		for(int i = 0; i < duplicates.size(); i++) {
        		    PlanByNetwork pnn = new PlanByNetwork();
        		    Triple<String, Long, String> duplicate = duplicates.get(i);
        		    String indexKey = buildOptionsCompareIndexKey(option, duplicate);
                    QuoteOptionAltPlanDto plan = planIndex.get(indexKey);
                    if(plan != null) { 
                        if(duplicates.size() > 1) {
                            // Example: (1) NetworkName HMO, (2) NetworkName HMO
                            pnn.networkName = "(" + (i + 1) + ") " + clientPlanName.getLeft();
                        } else {
                            pnn.networkName = clientPlanName.getLeft();
                        }
                        pnn.networkPlan = plan;
                        pnn.networkType = clientPlanName.getRight();
                    }
                    plans.add(pnn);
                } 
            }
            item.setPlans(plans);

            item.setQuoteType(option.getRfpQuote().getQuoteType());

            result.add(item);
        }
        return result;
    }


    private String buildOptionsCompareIndexKey(RfpQuoteOption option, Triple<String, Long, String> clientPlanName) {
    	StringBuilder sb = new StringBuilder();
    	sb.append(option != null ? option.getRfpQuoteOptionId() : null);
    	sb.append('_').append(clientPlanName.getLeft());
    	sb.append('_').append(clientPlanName.getMiddle());
    	sb.append('_').append(clientPlanName.getRight());
    	return sb.toString();
    }
    
    public byte[] compareQuoteOptionsFile(List<Long> rfpQuoteOptionIds) {
        List<QuoteOptionPlanComparisonDto> compareResult = compareQuoteOptions(rfpQuoteOptionIds, true, null, null);
        RfpQuoteOption option = null;
        if (!rfpQuoteOptionIds.isEmpty()) {
            option = rfpQuoteOptionRepository.findOne(rfpQuoteOptionIds.get(0));
            if(option == null) {
                throw new BaseException("RfpQuoteOption not found by id: " + rfpQuoteOptionIds.get(0));
            }
        } else {
            throw new BadRequestException("Parameter rfpQuoteOptionIds cannot be empty");
        }
        Long clientId = option.getRfpQuote().getRfpSubmission().getClient().getClientId();
        String product = option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory(); 
        return compareQuoteOptionsFile(clientId, product, compareResult);
    }
    
    public byte[] compareQuoteOptionsFile(Long clientId, String product, List<QuoteOptionPlanComparisonDto> comparisonDtos) {
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(clientId, product);
        List<RFP> rfps = rfpRepository.findByClientClientId(clientId);
        RfpQuoteSummary rqs = rfpQuoteSummaryRepository.findByClientClientId(clientId);
        Client client = clientRepository.findOne(clientId);
        
        PoiUtil poiUtil = new PoiUtil();
        return poiUtil.convertQuoteOptionPlanComparisonDtoToExcel_2(client, rfpQuotes, rfps, comparisonDtos, rqs);
    }

    private QuoteOptionAltRxDto buildAltRx(RfpQuoteOptionNetwork rqon, RfpQuoteNetworkPlan rxPlan, ClientPlan clientPlan) {
        PlanNameByNetwork rxPnn;
        QuoteOptionAltRxDto rx = new QuoteOptionAltRxDto();

        if(clientPlan != null) {
            rxPnn = clientPlan.getRxPnn();

            if(rxPnn == null) {
                return null;
            }
            rx.setType(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT);
        } else {
            rxPnn = rxPlan.getPnn();
            rx.setRfpQuoteNetworkPlanId(rxPlan.getRfpQuoteNetworkPlanId());

            if(rqon.getSelectedRfpQuoteNetworkRxPlan() != null &&
                rxPlan.getRfpQuoteNetworkPlanId().equals(rqon.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())) {
                rx.setSelected(true);
            }

            if(rqon.getSelectedSecondRfpQuoteNetworkRxPlan() != null &&
                rxPlan.getRfpQuoteNetworkPlanId().equals(rqon.getSelectedSecondRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())) {
                rx.setSecondSelected(true);
            }

            if(rxPlan.isMatchPlan()) {
                rx.setType(getPlanType(rxPlan));
            } else {
                rx.setType(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE);
            }
        }

        rx.setCarrier(rxPnn.getNetwork().getCarrier().getDisplayName());
        rx.setName(rxPnn.getName());
        List<Rx> rxBenefits = new ArrayList<>();
        rx.setRx(rxBenefits);

        findBenefits(rxPnn.getPlan().getPlanId(), rxBenefits);

        return rx;
    }
    
    private String getPlanType(RfpQuoteNetworkPlan networkPlan) {
    	Carrier carrier = networkPlan.getPnn().getNetwork().getCarrier();
    	if (carrier.getName().equals(Constants.ANTHEM_CLEAR_VALUE_CARRIER)) {
    		return QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_PRIMARY_PLAN;
    	} else {
    		return QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_MATCH_PLAN;
    	}
    }

    private QuoteOptionAltPlanDto buildAltPlan(RfpQuoteOptionNetwork rqon, RfpQuoteNetworkPlan networkPlan, Float currentPlanTotal, 
            BundleDiscounts discounts) {
        // calc plan benefits and rx (extra benefits)
        List<Rx> rx = new ArrayList<>();

        List<QuoteOptionAltPlanDto.Benefit> benefits = findBenefits(networkPlan.getPnn().getPlan().getPlanId(), rx);

        // prepare result
        QuoteOptionAltPlanDto altPlan = getQuoteOptionAltPlanDto(rqon, networkPlan);

        altPlan.setBenefits(benefits);
        altPlan.setRx(rx);
        altPlan.setCensus(getCensus(rqon));
        altPlan.setTotal(calcAlterPlanTotal(rqon, networkPlan, discounts.summaryBundleDiscountPercent));

        Date effectiveDate = networkPlan.getRfpQuoteNetwork().getRfpQuote().getRfpSubmission().getClient().getEffectiveDate();
        Long networkPlanCarrierId = networkPlan.getPnn().getNetwork().getCarrier().getCarrierId();
        DocumentDto summaryFile = documentService.findDocumentByNameAndCarrier(
            StringHelper.normalizeFileName(
                    getEffectiveDateBasedFileName(networkPlan.getPnn().getName(),
                        effectiveDate,
                        networkPlan.getPnn().getNetwork().getCarrier().getName())
                ),
            networkPlanCarrierId);

        if(summaryFile != null) {
            altPlan.setSummaryFileLink(DocumentFileService.getDocumentFileLink(summaryFile.getDocumentId()));
        }else if(isCarrierNameAppCarrier(networkPlan.getPnn().getNetwork().getCarrier().getName(), appCarrier)){
            logger.warn("Benefit summary for plan missing. Carrier="
                + networkPlan.getPnn().getNetwork().getCarrier().getName()
                + " PlanName=" + networkPlan.getPnn().getName()
                + " EffectiveDate=" + DateHelper.fromDateToString(effectiveDate));
        }
        if(currentPlanTotal != null) {
            altPlan.setPercentDifference(MathUtils.diffPecent(altPlan.getTotal(), currentPlanTotal, 1));
        }
        String networkType = networkPlan.getPnn().getNetwork().getType();
        if(NETWORK_TYPE_HSA.equals(networkType)) {
	        altPlan.setEmployerFund(calcEmployerFund(rqon, networkType));
	        altPlan.setAdministrativeFee(administrativeFeeService.calcAdministrativeFee(rqon, networkType));
        }
        // add attributes
        for (QuotePlanAttribute attribute 
            : attributeRepository.findQuotePlanAttributeByRqnpId(networkPlan.getRfpQuoteNetworkPlanId())) {
        altPlan.getAttributes().add(
                new QuoteOptionAltPlanDto.Attribute(
                        attribute.getName().name(), 
                        attribute.getName().getDisplayName(), 
                        attribute.getValue()));
        }
        return altPlan;
    }

    private QuoteOptionAltPlanDto getQuoteOptionAltPlanDto(RfpQuoteOptionNetwork rqon,
        RfpQuoteNetworkPlan networkPlan) {

        QuoteOptionAltPlanDto altPlan = new QuoteOptionAltPlanDto();
        altPlan.setFavorite(networkPlan.isFavorite());
        altPlan.setRfpQuoteNetworkPlanId(networkPlan.getRfpQuoteNetworkPlanId());
        altPlan.setName(networkPlan.getPnn().getName());
        altPlan.setCarrier(networkPlan.getPnn().getNetwork().getCarrier().getDisplayName());
        altPlan.setNetworkName(networkPlan.getPnn().getNetwork().getName());

        if(rqon.getRfpQuoteOption().getRfpQuote().getQuoteType().equals(CLEAR_VALUE)) {
            altPlan.setNetworkName(deriveClearValueNetworkName(networkPlan.getPnn().getName()));
        }

        if(rqon.getSelectedRfpQuoteNetworkPlan() != null &&
            networkPlan.getRfpQuoteNetworkPlanId().equals(rqon.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId())) {
            altPlan.setSelected(true);
        }

        if(rqon.getSelectedSecondRfpQuoteNetworkPlan() != null &&
            networkPlan.getRfpQuoteNetworkPlanId().equals(rqon.getSelectedSecondRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId())) {
            altPlan.setSelectedSecond(true);
        }

        if(networkPlan.isMatchPlan()) {
            altPlan.setType(getPlanType(networkPlan));
        } else {
            altPlan.setType(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE);
        }
        return altPlan;
    }

    protected String getEffectiveDateBasedFileName(String name, Date effectiveDate, String carrierName) {
        return name;
    }

    private List<Census> getCensus(RfpQuoteOptionNetwork rqon) {
        List<Census> result = new ArrayList<>();

        result.add(new Census(TIER1_PLAN_NAME, rqon.getTier1Census()));

        RfpQuote rfpQuote = rqon.getRfpQuoteOption().getRfpQuote();
        if(rfpQuote.getRatingTiers() >= 2) {
        	Census census = new Census(TIER2_PLAN_NAME, rqon.getTier2Census());
        	result.add(census);
	        if(rfpQuote.getRatingTiers() == 2) {
	        	census.name = TIER4_PLAN_NAME;
	        } else if(rfpQuote.getRatingTiers() == 3) {
	        	census.name = TIER2_PLAN_NAME_SPECIAL;
	        } 
    	}
        if(rfpQuote.getRatingTiers() >= 3) {
	        Census census = new Census(TIER3_PLAN_NAME, rqon.getTier3Census());
	        result.add(census);
	        if(rfpQuote.getRatingTiers() == 3) {
	        	census.name = TIER3_PLAN_NAME_SPECIAL;
	        }
        }
        if(rfpQuote.getRatingTiers() >= 4) {
	        Census census = new Census(TIER4_PLAN_NAME, rqon.getTier4Census());
	        result.add(census);
        }

        return result;
    }
    public List<QuoteOptionPlanAlternativesDto> getQuoteNetworkAlternativesPlanNames(
        List<Long> rfpQuoteNetworkIds){

        List<QuoteOptionPlanAlternativesDto> result = new ArrayList<>();
        for(Long rfpQuoteNetworkId : rfpQuoteNetworkIds) {
            RfpQuoteNetwork rfpQuoteNetwork = rfpQuoteNetworkRepository.findOne(rfpQuoteNetworkId);
            if(rfpQuoteNetwork == null){
                throw new BaseException(format("RfpQuoteNetworkId %s not found", rfpQuoteNetwork));
            }

            QuoteOptionPlanAlternativesDto rfpQuoteNetworkPlans = new QuoteOptionPlanAlternativesDto();

            // list of alternatives should be based on the clients effective date (year)
            Client client = rfpQuoteNetwork.getRfpQuote().getRfpSubmission().getClient();
            int planYear = client.getEffectiveYear();

            List<RfpQuoteNetworkPlan> networkPlans = rfpQuoteNetwork
                .getRfpQuoteNetworkPlans()
                .stream()
                .filter(pl -> !pl.getPnn().getPlanType().startsWith("RX_")
                    && pl.getPnn().getPlan().getPlanYear() == planYear)
                .collect(toList());

            rfpQuoteNetworkPlans.setRfpQuoteNetworkId(rfpQuoteNetworkId);
            for(RfpQuoteNetworkPlan networkPlan : networkPlans) {
                QuoteOptionAltPlanDto altPlan = new QuoteOptionAltPlanDto();
                altPlan.setFavorite(networkPlan.isFavorite());
                altPlan.setRfpQuoteNetworkPlanId(networkPlan.getRfpQuoteNetworkPlanId());
                altPlan.setName(networkPlan.getPnn().getName());
                altPlan.setCarrier(networkPlan.getPnn().getNetwork().getCarrier().getDisplayName());
                altPlan.setNetworkName(networkPlan.getPnn().getNetwork().getName());

                if(networkPlan.isMatchPlan()) {
                    altPlan.setType(getPlanType(networkPlan));
                } else {
                    altPlan.setType(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE);
                }

                rfpQuoteNetworkPlans.getPlans().add(altPlan);
            }
            result.add(rfpQuoteNetworkPlans);
        }
        return result;
    }

    public QuoteOptionPlanAlternativesDto getQuoteOptionNetworkAlternatives(Long rfpQuoteOptionNetworkId,
        AlternativeSearchParams params) {

        RfpQuoteOptionNetwork rqon = rfpQuoteOptionNetworkRepository.findOne(rfpQuoteOptionNetworkId);
        List<QuoteOptionAltPlanDto> plans = new LinkedList<>();

        BundleDiscounts discounts = calcBundleDiscount(rqon.getRfpQuoteOption());
        
        // find current plan
        QuoteOptionAltPlanDto currentPlan = convertClientPlan(rqon, discounts);

        // find alternatives
        QuoteOptionAltPlanDto matchPlan = null, selectedPlan = null, selectedSecondPlan = null;

        // list of alternatives should be based on the clients effective date (year)
        Client client = rqon.getRfpQuoteOption().getRfpQuote().getRfpSubmission().getClient();
        int planYear = client.getEffectiveYear();
        
        List<RfpQuoteNetworkPlan> networkPlans = rqon.getRfpQuoteNetwork().getRfpQuoteNetworkPlans()
            .stream()
            .filter(pl -> !pl.getPnn().getPlanType().startsWith("RX_")
                && pl.getPnn().getPlan().getPlanYear() == planYear)
            .collect(toList());

        Float currentCost = (currentPlan != null ? currentPlan.getTotal() : null);
        
        for(RfpQuoteNetworkPlan networkPlan : networkPlans) {
            QuoteOptionAltPlanDto altPlan = buildAltPlan(rqon, networkPlan, currentCost, discounts);
            
            List<Cost> cost = findCosts(rqon, networkPlan, null,
                currentCost, discounts, rqon.getRfpQuoteOption().getRfpQuote().getRatingTiers());
            altPlan.setCost(cost);

            if(altPlan.isSelected()) {
                selectedPlan = altPlan;
            } else if(altPlan.isSelectedSecond()) {
                selectedSecondPlan = altPlan;
            } else if(altPlan.getType().equals(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_MATCH_PLAN)
            		|| altPlan.getType().equals(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_PRIMARY_PLAN)) {
                matchPlan = altPlan;
            } else {
                plans.add(altPlan);
            }
        }

        QuoteOptionPlanAlternativesDto result = new QuoteOptionPlanAlternativesDto();

        // sort: current, selected = true, matchPlan, alternatives
        if(matchPlan != null) {
            plans.add(0, matchPlan);
        }

        if(selectedSecondPlan != null) {
            plans.add(0, selectedSecondPlan);
        }

        if(selectedPlan != null) {
            plans.add(0, selectedPlan);
        }

        if(currentPlan != null) {
            plans.add(0, currentPlan);
        }

        result.setPlans(plans);

        // prepare external RX plans
        List<RfpQuoteNetworkPlan> rxPlans = rqon.getRfpQuoteNetwork()
            .getRfpQuoteNetworkPlans()
            .stream()
            .filter(
                pl -> pl.getPnn().getPlanType().startsWith("RX_") &&
                      pl.getPnn().getPlan().getPlanYear() == planYear
            )
            .collect(toList());

        // gather RX plans (and add rx plan from client plan if available)
        List<QuoteOptionAltRxDto> rxs = rxPlans
            .stream()
            .map(rx -> buildAltRx(rqon, rx, null))
            .collect(
                collectingAndThen(
                    toList(),
                    r -> Option.of(rqon.getClientPlan())
                        .map(cp -> ofAll(r).insert(0, buildAltRx(rqon, null, cp)).toJavaList())
                        .getOrElse(r)
                )
            ).stream()
            .filter(rx -> rx != null)
            .collect(toList());

        result.setRx(rxs);
        result.setOptionName(rqon.getRfpQuoteOption().getRfpQuoteOptionName());
        result.setRfpQuoteOptionId(rqon.getRfpQuoteOption().getRfpQuoteOptionId());

        filterAlternatives(result, params);

        benefitUtil.highlight(result, currentPlan);
        
        // carrier specific
        benefitUtil.applyDiscount(result, rqon.getRfpQuoteNetwork());

        return result;
    }

    private void filterAlternatives(QuoteOptionPlanAlternativesDto result, AlternativeSearchParams params){

        if(params.getDeductibleFrom() != null && params.getDeductibleTo() != null){
            result.setPlans(filterPlansByValues(result.getPlans(), "benefit", "INDIVIDUAL_DEDUCTIBLE",
                params.getDeductibleFrom(), params.getDeductibleTo()));
        }
        if(params.getCoinsuranceFrom() != null && params.getCoinsuranceTo() != null){
            result.setPlans(filterPlansByValues(result.getPlans(), "benefit", "CO_INSURANCE",
                params.getCoinsuranceFrom(), params.getCoinsuranceTo()));
        }
        if(params.getCopayFrom() != null && params.getCopayTo() != null){
            result.setPlans(filterPlansByValues(result.getPlans(), "benefit", "PCP",
                params.getCopayFrom(), params.getCopayTo()));
        }
        if(params.getDiffPercentFrom() != null && params.getDiffPercentTo() != null){
            result.setPlans(filterPlansByValues(result.getPlans(), "cost", Constants.PERCENT_CHANGE_FROM_CURRENT,
                params.getDiffPercentFrom(), params.getDiffPercentTo()));
        }

        if(params.getFavorite() != null){
            result.setPlans(
                result.getPlans()
                    .stream()
                    .filter(p -> p.getFavorite() == params.getFavorite()
                        || p.getType().equalsIgnoreCase("current")
                    )
                .collect(toList())
            );
        }
    }

    private List<QuoteOptionAltPlanDto> filterPlansByValues(List<QuoteOptionAltPlanDto> plans,
        String type, String name, Float from, Float to){

        List<QuoteOptionAltPlanDto> result = new ArrayList<>();

        for(QuoteOptionAltPlanDto plan : plans) {
            if (plan.getType().equalsIgnoreCase("current")) {
                result.add(plan);
                continue;
            }

            if(type.equalsIgnoreCase("benefit") && plan.getBenefits() != null){
                for(QuoteOptionAltPlanDto.Benefit benefit : plan.getBenefits()){
                    if(benefit.sysName.equalsIgnoreCase(name)){
                        Float benefitVal = null;

                        String value = null;
                        if(!isEmpty(benefit.valueIn)){
                            value = benefit.valueIn;
                        } else if(!isEmpty(benefit.value)){
                            value = benefit.value;
                        }

                        if(value.contains("x")) {
                            String[] split = value.split("x");
                            if (split.length == 2) {
                                String val = split[0].replace("$", "");
                                val = val.replace(",", "");
                                benefitVal = alternativesFilteringFloatParser(val);
                            }
                        } else{
                            String val = value.replace(",", "");
                            val = val.replace("$", "");
                            benefitVal = alternativesFilteringFloatParser(val);
                        }

                        if(benefitVal == null || (benefitVal >= from && benefitVal <= to)){
                            result.add(plan);
                        }
                    }
                }
            } else if(type.equalsIgnoreCase("cost") && plan.getCost() != null){
                for(Cost cost : plan.getCost()){
                    if(cost.name.equalsIgnoreCase(name) && !isEmpty(cost.value)){
                        Float monthlyCost = alternativesFilteringFloatParser(cost.value);
                        if (monthlyCost == null || (monthlyCost >= from && monthlyCost <= to)) {
                            result.add(plan);
                        }
                    }
                }
            }
        }

        return result;
    }
    private Float alternativesFilteringFloatParser(String value){
        try {
            return Float.parseFloat(value);
        } catch (NumberFormatException e){
            // TODO: I am splunk these resuls because I will be aggregating from
            // Splunk to improve benefit parser
            logger.warn(e.getMessage(), e);
        }
        return null;
    }

    private String deriveClearValueNetworkName(String planName){
        String networkName = planName;
        if(startsWithIgnoreCase(planName, "T-")){
            networkName = "Traditional Network";
        }else if(startsWithIgnoreCase(planName, "S-")){
            networkName = "Select Network";
        }else if(startsWithIgnoreCase(planName, "PS-")){
            networkName = "Priority Select Network";
        }
        return networkName;
    }

    private QuoteOptionAltPlanDto convertClientPlan(RfpQuoteOptionNetwork rqon, BundleDiscounts discounts) {
        QuoteOptionAltPlanDto currentPlan = null;

        if(rqon.getClientPlan() != null) {
            currentPlan = new QuoteOptionAltPlanDto();
            currentPlan.setClientPlanId(rqon.getClientPlan().getClientPlanId());
            currentPlan.setType(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT);
            currentPlan.setName(rqon.getClientPlan().getPnn().getName());
            currentPlan.setCarrier(rqon.getClientPlan().getPnn().getNetwork().getCarrier().getDisplayName());
            currentPlan.setNetworkName(rqon.getClientPlan().getPnn().getNetwork().getName());

            if(rqon.getRfpQuoteOption().getRfpQuote().getQuoteType().equals(CLEAR_VALUE)) {
                currentPlan.setNetworkName(deriveClearValueNetworkName(rqon.getClientPlan().getPnn().getName()));
            }
            
            List<Rx> rx = new ArrayList<>();
            List<QuoteOptionAltPlanDto.Benefit> benefits = findBenefits(rqon.getClientPlan().getPnn().getPlan().getPlanId(), rx);
            currentPlan.setBenefits(benefits);
            currentPlan.setRx(rx);
            currentPlan.setTotal(calcClientPlanTotal(rqon.getClientPlan()));
            currentPlan.setCost(findCosts(rqon, null, rqon.getClientPlan(),
                currentPlan.getTotal(), discounts, rqon.getRfpQuoteOption().getRfpQuote().getRatingTiers()));
            currentPlan.setPercentDifference(0f);
            DocumentDto summaryFile = documentService.findDocumentByNameAndCarrier(
            		rqon.getClientPlan().getPnn().getName(), 
            		rqon.getClientPlan().getPnn().getNetwork().getCarrier().getCarrierId());
            if (summaryFile != null) {
              currentPlan.setSummaryFileLink(DocumentFileService.getDocumentFileLink(summaryFile.getDocumentId()));
            }
        }

        return currentPlan;
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
                    if(v.size() > 1) {
                        b.valueIn = planBenefit.getValue();
                        b.valueOut = v.get(1).getValue();
                        b.typeIn = planBenefit.getFormat();
                        b.typeOut = v.get(1).getFormat();
                    } else {
                        b.type = planBenefit.getFormat();
                        b.value = planBenefit.getValue();
                    }
                    b.highlightType = planBenefit.getBenefitName().getHighlightType();
                    benefits.add(b);
                }
            }
        );

        return benefits;
    }

    private List<Cost> findCosts(RfpQuoteOptionNetwork rqon, RfpQuoteNetworkPlan networkPlan, RfpQuoteNetworkPlan rxNetworkPlan, ClientPlan clientPlan,
        Float currentCost, BundleDiscounts discounts, int quoteRatingTier) {
        QuoteOptionPlanBriefDto costParams;
        float[] rates;

        if(clientPlan != null) {
            if(networkPlan != null) {
                throw new BadRequestException("Incorrect client plan cost calculation method call");
            }

            costParams = buildCurrentQuoteOptionPlanBrief(clientPlan);
            rates = new float[]{
                clientPlan.getTier1Rate(),
                clientPlan.getTier2Rate(),
                clientPlan.getTier3Rate(),
                clientPlan.getTier4Rate()
            };
        } else {
            costParams = buildNewQuoteOptionPlanBrief(rqon, networkPlan, rxNetworkPlan, discounts);
            rates = calcPlanTierRates(rqon, networkPlan, rxNetworkPlan, discounts, costParams);
        }

        List<Cost> costs = new ArrayList<>();
        Cost cost = new Cost("Monthly cost", String.valueOf(costParams.getTotal()), Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        costs.add(cost);

        if(currentCost != null) {
            cost = new Cost(PERCENT_CHANGE_FROM_CURRENT, String.valueOf(MathUtils
                .diffPecent(costParams.getTotal(), currentCost, 1)), Constants.ER_CONTRIBUTION_FORMAT_PERCENT);
            costs.add(cost);
        }

        cost = new Cost(TIER1_PLAN_NAME, String.valueOf(rates[0]), Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        costs.add(cost);
        if(quoteRatingTier >= 2) {
            cost = new Cost(TIER2_PLAN_NAME, String.valueOf(rates[1]), Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
            costs.add(cost);
            if(quoteRatingTier == 2) {
                cost.name = TIER4_PLAN_NAME;
            } else if(quoteRatingTier == 3) {
                cost.name = TIER2_PLAN_NAME_SPECIAL;
            }
        }
        if(quoteRatingTier >= 3) {
            cost = new Cost(TIER3_PLAN_NAME, String.valueOf(rates[2]), Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
            costs.add(cost);
            if(quoteRatingTier == 3) {
                cost.name = TIER3_PLAN_NAME_SPECIAL;
            }
        }
        if(quoteRatingTier >= 4) {
            cost = new Cost(TIER4_PLAN_NAME, String.valueOf(rates[3]), Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
            costs.add(cost);
        }
        return costs;
    }

    public float[] calcPlanTierRates(RfpQuoteOptionNetwork rqon, RfpQuoteNetworkPlan networkPlan,
        RfpQuoteNetworkPlan rxNetworkPlan, BundleDiscounts discounts,
        QuoteOptionPlanBriefDto costParams) {
        float[] rates;
        float[] rxRates = getRXRates(rxNetworkPlan);
        float[] dollarRxRates = getDollarRXRates(rxNetworkPlan);
        // FIXME should riderRates and specialRiderRates be applied to SecondPlan cost calculation?
        float[] riderRates = getRiderCosts(rqon);
        float[] specialRiderRates = getSpecialRiderCosts(rqon);
        if(isDiscountApplicable(rqon, networkPlan)) {
            specialRiderRates[0] = specialRiderRates[0] * getDiscountFactor(discounts.summaryBundleDiscountPercent);
            specialRiderRates[1] = specialRiderRates[1] * getDiscountFactor(discounts.summaryBundleDiscountPercent);
            specialRiderRates[2] = specialRiderRates[2] * getDiscountFactor(discounts.summaryBundleDiscountPercent);
            specialRiderRates[3] = specialRiderRates[3] * getDiscountFactor(discounts.summaryBundleDiscountPercent);
        }
        // costParams.getTierNRate() has rates with applied discounts
        rates = new float[]{
            rxRates[0] * defaultIfNull(costParams.getTier1Rate(), 0F) + dollarRxRates[0] + specialRiderRates[0] + riderRates[0],
            rxRates[1] * defaultIfNull(costParams.getTier2Rate(), 0F) + dollarRxRates[1] + specialRiderRates[1] + riderRates[1],
            rxRates[2] * defaultIfNull(costParams.getTier3Rate(), 0F) + dollarRxRates[2] + specialRiderRates[2] + riderRates[2],
            rxRates[3] * defaultIfNull(costParams.getTier4Rate(), 0F) + dollarRxRates[3] + specialRiderRates[3] + riderRates[3]
        };
        return rates;
    }

    private List<Cost> findCosts(RfpQuoteOptionNetwork rqon, RfpQuoteNetworkPlan networkPlan, ClientPlan clientPlan, 
            Float currentCost, BundleDiscounts discounts, int quoteRatingTier) {
        return findCosts(rqon, networkPlan, !isNull(rqon) ? rqon.getSelectedRfpQuoteNetworkRxPlan() : null, clientPlan, currentCost, discounts, quoteRatingTier);
    }

    public void updateOptionDisplayName(Long rfpQuoteOptionId, String displayName){
        RfpQuoteOption quoteOption = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);
        if(quoteOption == null){
            throw new BaseException("Quote option not found")
                .withFields(
                    field("rfpQuoteOptionId", rfpQuoteOptionId)
                );
        }

        quoteOption.setDisplayName(displayName);
        rfpQuoteOptionRepository.save(quoteOption);
    }
    
    public void updateAncillaryOptionDisplayName(Long rfpQuoteAncillaryOptionId, String displayName){
        RfpQuoteAncillaryOption quoteOption = rfpQuoteAncillaryOptionRepository.findOne(rfpQuoteAncillaryOptionId);
        if(quoteOption == null){
            throw new BaseException("RfpQuoteAncillaryOption not found")
                .withFields(field("rfp_quote_ancillary_option_id", rfpQuoteAncillaryOptionId));
        }
        quoteOption.setDisplayName(displayName);
        rfpQuoteAncillaryOptionRepository.save(quoteOption);
    }

    public Long createAncillaryQuoteOption(Long clientId, Long rfpCarrierId, String displayName, QuoteType quoteType, OptionType optionType) {
        if(quoteType == null || quoteType != QuoteType.STANDARD) {
            throw new BaseException("Unsupported QuoteType for ancillary option: " + quoteType);
        }
        
        RfpCarrier rfpCarrier = rfpCarrierRepository.findOne(rfpCarrierId);
        if(rfpCarrier == null) {
            throw new NotFoundException("RFP carrier not found").withFields(field("rfp_carrier_id", rfpCarrierId));
        }
        
        RfpQuote rfpQuote = rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rfpCarrierId, clientId, true, quoteType);
        
        int lastOptionNumber = 0;
        List<RfpQuoteAncillaryOption> quoteOptions = new ArrayList<>();
        if(rfpQuote != null) {
            quoteOptions = rfpQuoteAncillaryOptionRepository.findByRfpQuote(rfpQuote)
                .stream()
                .filter(option -> containsIgnoreCase(option.getName(), optionType.name()))
                .collect(toList());
            lastOptionNumber = findLastOptionNumber(quoteOptions, optionType);
        }
        String optionName = null;
        if(optionType == OptionType.RENEWAL) {
            if(lastOptionNumber == 0) {
                optionName = getQuoteOptionName(quoteOptions.size(), lastOptionNumber);
            } else {
                optionName = RENEWAL_OPTION_NAME + " " + (lastOptionNumber + 1);
            }
        } else if(optionType == OptionType.OPTION) {
            optionName = "Option " + (lastOptionNumber + 1);
        } else {
            throw new BaseException("Unsupported quoteType argument value: " + quoteType);
        }
        
        if(rfpQuote == null) {
        	// we can create any quoted in BENREVO appCarrier mode
            if(!carrierMatches(CarrierType.BENREVO.name(), appCarrier) 
            		&& carrierMatches(rfpCarrier.getCarrier().getName(), appCarrier)) {
                throw new ClientException("No quote found for carrier/client")
                    .withFields(
                        field("carrier", rfpCarrier.getCarrier().getDisplayName()),
                        field("app_carrier", appCarrier[0]),
                        field("client_id", clientId),
                        field("quote_type", quoteType)
                    );
            } else {
                rfpQuote = createNewRfpCarrierQuote(clientId, rfpCarrier, quoteType);
            }
        }       
        RfpQuoteAncillaryOption option = new RfpQuoteAncillaryOption();
        option.setName(optionName);
        option.setDisplayName(displayName);
        option.setRfpQuote(rfpQuote);
        option.setRfpQuoteAncillaryPlan(null); // no selected plan yet
        
        if(optionType.equals(OptionType.OPTION)) {
            // TODO: is the copy Option 1 needed? (see the createQuoteOption() below)
        } else if(RENEWAL_OPTION_NAME.equals(optionName)) {
            createRenewalAddedActivity(clientId, rfpCarrier.getCategory());
        }
        option = rfpQuoteAncillaryOptionRepository.save(option);   
        return option.getRfpQuoteAncillaryOptionId();
    }

    public String getQuoteOptionName(int existingOptionSize, int lastOptionNumber){
        return RENEWAL_OPTION_NAME;
    }

    @Transactional
    public Long createQuoteOption(Long clientId, Long rfpCarrierId, String displayName, QuoteType quoteType, OptionType optionType) {
        RfpCarrier rfpCarrier = rfpCarrierRepository.findOne(rfpCarrierId);

        isNotNull(rfpCarrier, format(Constants.VALIDATION_MESSAGE_ENTITY_NOT_FOUND_EXTENDED, RfpCarrier.class.getSimpleName(), rfpCarrierId));

        // different API for Life/STD/LTD
        PlanCategory planCategory = PlanCategory.valueOf(rfpCarrier.getCategory());
        if(planCategory == PlanCategory.LIFE || planCategory == PlanCategory.STD || planCategory == PlanCategory.LTD) {
            throw new BadRequestException("API does not support LIFE/STD/LTD product types. Use createAncillaryQuoteOption() API call");
        }
        
        RfpQuote rfpQuote = rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rfpCarrierId, clientId, true, quoteType);
        
        String optionName = null;
        switch(optionType){
            case NEGOTIATED:
                optionName = NEGOTIATED_OPTION_NAME;
                break;
            case RENEWAL:
                List<RfpQuoteOption> renewalOptions = findAllCarrierQuoteOptions(clientId, rfpCarrier.getCategory())
                    .stream()
                    .filter(option -> containsIgnoreCase(option.getName(), optionType.name()))
                    .collect(toList());
                int lastOptionNumber = findLastOptionNumber(renewalOptions, optionType);
                if(lastOptionNumber == 0){
                    optionName = getQuoteOptionName(renewalOptions.size(), lastOptionNumber);
                } else {
                    optionName = RENEWAL_OPTION_NAME + " " + (lastOptionNumber + 1);
                }
                break;
            case OPTION:
                List<RfpQuoteOption> rfpQuoteOptions = findAllCarrierQuoteOptions(clientId, rfpCarrier.getCategory());
                optionName = "Option " + (findLastOptionNumber(rfpQuoteOptions, optionType) + 1);
                break;
            default: 
                throw new BadRequestException("Unsupported optionType param value: " + optionType);
        }   

        boolean isNewCarrierQuote = false;
        if(rfpQuote == null) {
        	// we can create any quoted in BENREVO appCarrier mode
            if(!carrierMatches(CarrierType.BENREVO.name(), appCarrier) 
            		&& (carrierMatches(rfpCarrier.getCarrier().getName(), appCarrier) || quoteType == QuoteType.KAISER)) {
                throw new ClientException("No quote found for carrier/client")
                    .withFields(
                        field("carrier", rfpCarrier.getCarrier().getDisplayName()),
                        field("app_carrier", appCarrier[0]),
                        field("client_id", clientId),
                        field("quote_type", quoteType)
                    );
            } else {
                rfpQuote = createNewRfpCarrierQuote(clientId, rfpCarrier, quoteType);
                isNewCarrierQuote = true;
            }
        }

        RfpQuoteOption option = new RfpQuoteOption();
        option.setMatchesOrigRfpOption(false);
        option.setRfpQuoteVersion(rfpQuote.getRfpQuoteVersion());
        option.setRfpQuoteOptionName(optionName);
        option.setDisplayName(isEmpty(displayName) ? optionName : displayName);
        option.setRfpQuote(rfpQuote);
        option.setSelectedRiders(new HashSet<>(rfpQuote.getRiders()));

        if(optionType.equals(OptionType.OPTION)) {
            // TODO: We should only copy the option 1 over for current carrier. However, with Anthem, we have Anthem and Anthem Clear Value hence this hack below
            if(carrierMatches(rfpCarrier.getCarrier().getName(), appCarrier) ||
                (carrierMatches(Constants.ANTHEM_CARRIER, appCarrier) && carrierMatches(rfpCarrier.getCarrier().getName(), Constants.ANTHEM_CLEAR_VALUE_CARRIER))
                ) {
                
                option = copyOverOption(rfpQuote, option, isNewCarrierQuote, false);
            } else {
            	// multi-carrier
                if (quoteType.equals(QuoteType.STANDARD) && rfpCarrier.getCategory().equals(Constants.MEDICAL)) {
	            	List<RfpQuote> rfpKaiserQuotes = rfpQuoteRepository.findByRfpSubmissionClientClientIdAndLatestAndQuoteType(clientId, true, QuoteType.KAISER);
	            	if (rfpKaiserQuotes.size() > 0) {
	            	    // Copy options from KAISER quote
 	            	    option = copyOverOption(rfpKaiserQuotes.get(0), option, false, true);
	            	}
	            }
            	
            }
        } else if(optionType.equals(OptionType.RENEWAL)) {
            if(RENEWAL_OPTION_NAME.equals(optionName)) {
                createRenewalAddedActivity(clientId, rfpCarrier.getCategory());
            } else if(carrierMatches(rfpCarrier.getCarrier().getName(), appCarrier)) { 
                // If Renewal 2, 3  than copy from Renewal 1
                option = copyOverOption(rfpQuote, option, isNewCarrierQuote, false);
            }
            
        }

        option = rfpQuoteOptionRepository.save(option);
        return option.getRfpQuoteOptionId();
    }
    
    private void createRenewalAddedActivity(Long clientId, String product) {
        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        String userName = auth0Service.getUserName(authentication.getName());
        
        Activity activity = new Activity(clientId, ActivityType.RENEWAL_ADDED,
                StringUtils.EMPTY, // will be updated after diffPercent calculation
                "Renewal rates have been entered by " + userName)
            .created(new Date())
            .product(product);
        sharedActivityService.save(activity);
    }

	protected RfpQuoteOption copyOverOption(RfpQuote rfpQuote, RfpQuoteOption option, boolean isNewCarrierQuote, boolean copyOnlyKaiser) {

		RfpQuoteOption template = null;
		Client client = rfpQuote.getRfpSubmission().getClient();
		for(RfpQuoteOption opt : rfpQuote.getRfpQuoteOptions()) {
		    // "hardcoded" system option name by agreement
		    if(opt.getRfpQuoteOptionName().equalsIgnoreCase(OPTION_1_NAME)
                || (client.getAttributes().stream().anyMatch(p -> p.getName().equals(AttributeName.RENEWAL)) &&
                opt.getRfpQuoteOptionName().equalsIgnoreCase(RENEWAL_1_NAME))) {
		        template = opt;
		        break;
		    }
		}

		if(template == null) {
		    throw new ClientException("Cannot find option or renewal 1 for copying")
		        .withFields(
		            field("option", OPTION_1_NAME),
                    field("renewal", RENEWAL_1_NAME)
		        );
		}

		if(isNewCarrierQuote) {
			// copy rating tiers from "current" plan option
			rfpQuote.setRatingTiers(template.getRfpQuote().getRatingTiers());
			rfpQuote = rfpQuoteRepository.save(rfpQuote);
			option.setRfpQuote(rfpQuote);
		}
		// save option after all the quote updates completed
		option = rfpQuoteOptionRepository.save(option);
		 
		// copy plans from template
		for(RfpQuoteOptionNetwork optNetwork : template.getRfpQuoteOptionNetworks()) {
		    if ( ! copyOnlyKaiser || isKaiserNetwork(optNetwork)) {
    		        RfpQuoteOptionNetwork copy = optNetwork.copy();
    		        copy.setRfpQuoteOption(option);
    		        copy = rfpQuoteOptionNetworkRepository.save(copy);
    		        option.getRfpQuoteOptionNetworks().add(copy);
    		    }
		}
		return option;
	}

    private RfpQuote createNewRfpCarrierQuote(Long clientId, RfpCarrier rfpCarrier, QuoteType quoteType) {
        Client client = getClientById(clientId);

        RfpSubmission rfpSubmission = rfpSubmissionRepository.findByRfpCarrierAndClient(rfpCarrier, client);		
        if(rfpSubmission == null) {
        	rfpSubmission = new RfpSubmission();
        	rfpSubmission.setClient(client);
            rfpSubmission.setRfpCarrier(rfpCarrier);
            rfpSubmission.setCreated(DateHelper.fromDateToString(new Date(), Constants.DATETIME_FORMAT));
            rfpSubmission.setUpdated(rfpSubmission.getCreated());
            rfpSubmission = rfpSubmissionRepository.save(rfpSubmission);
        }
        RfpQuoteVersion rfpQuoteVersion = new RfpQuoteVersion();
        rfpQuoteVersion.setRfpSubmissionId(rfpSubmission.getRfpSubmissionId());
        rfpQuoteVersion = rfpQuoteVersionRepository.save(rfpQuoteVersion);

        PlanCategory category = PlanCategory.valueOf(rfpCarrier.getCategory());
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(
            clientId, category.getPlanTypes());

        RfpQuote rfpQuote = new RfpQuote();
        rfpQuote.setLatest(true);
        rfpQuote.setUpdated(new Date());
        rfpQuote.setQuoteType(quoteType);
        rfpQuote.setRfpSubmission(rfpSubmission);
        rfpQuote.setRatingTiers(findRatingTiers(clientPlans));
        rfpQuote.setRfpQuoteVersion(rfpQuoteVersion);
        rfpQuote.setViewed(true);
        
        rfpQuote = rfpQuoteRepository.save(rfpQuote);

        return rfpQuote;
    }

    public void deleteQuoteOption(Long rfpQuoteOptionId) {

        if(!presentationOptionRepository.findByRfpQuoteOptionId(rfpQuoteOptionId).isEmpty()) {
            throw new ClientException("Option you want to delete is being used in the set up presentation page. "
                + "Please remove it there first");
        }
        
        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);
        if(option == null) {
            throw new NotFoundException("Quote option not found")
                .withFields(
                    field("rfp_quote_option_id", rfpQuoteOptionId)
                );
        }

        rfpQuoteOptionNetworkRepository.delete(option.getRfpQuoteOptionNetworks());
        rfpQuoteOptionRepository.delete(rfpQuoteOptionId);
    }
    
    public void deleteAncillaryQuoteOption(Long rfpQuoteAncillaryOptionId) {
        

        if(!presentationOptionRepository.findByRfpQuoteAncillaryOptionId(rfpQuoteAncillaryOptionId).isEmpty()) {
            throw new ClientException("Option you want to delete is being used in the set up presentation page. "
                + "Please remove it there first");
        }
        
        if(!rfpQuoteAncillaryOptionRepository.exists(rfpQuoteAncillaryOptionId)) {
            throw new NotFoundException("Ancillary quote option not found")
                .withFields(field("rfp_quote_ancillary_option_id", rfpQuoteAncillaryOptionId));
        }

        rfpQuoteAncillaryOptionRepository.delete(rfpQuoteAncillaryOptionId);
    }
    
    
    public void selectAdministrativeFee(Long rfpQuoteOptionNetworkId, Long administrativeFeeId) {
    	RfpQuoteOptionNetwork rqon = rfpQuoteOptionNetworkRepository.findOne(rfpQuoteOptionNetworkId);
    	if(rqon == null) {
            throw new NotFoundException("RfpQuoteOptionNetwork not found")
                .withFields(field("rfp_quote_option_network_id", rfpQuoteOptionNetworkId));
        }
    	if(administrativeFeeId != null) {
    		AdministrativeFee fee = administrativeFeeService.findById(administrativeFeeId);
        	rqon.setAdministrativeFee(fee);
    	} else {
    		rqon.setAdministrativeFee(null);
    	}
    	rqon = rfpQuoteOptionNetworkRepository.save(rqon);

    	invalidateCachedRfpQuoteOption(rqon.getRfpQuoteOption());
    }

    public void favoriteQuoteOptionNetworkPlan(Long rfpQuoteNetworkId, Long rfpQuoteNetworkPlanId) {
        setFavoriteQuoteNetworkPlan(rfpQuoteNetworkId, rfpQuoteNetworkPlanId, true);
    }

    public void unfavoriteQuoteOptionNetworkPlan(Long rfpQuoteNetworkId, Long rfpQuoteNetworkPlanId) {
        setFavoriteQuoteNetworkPlan(rfpQuoteNetworkId, rfpQuoteNetworkPlanId, false);
    }

    private void setFavoriteQuoteNetworkPlan(Long rfpQuoteNetworkId, Long rfpQuoteNetworkPlanId, boolean isFavorite) {
        RfpQuoteNetworkPlan plan = rfpQuoteNetworkPlanRepository.findOne(rfpQuoteNetworkPlanId);
        if(plan == null) {
            throw new NotFoundException("Quote network plan not found")
                .withFields(
                    field("rfp_quote_network_plan_id", rfpQuoteNetworkPlanId)
                );
        }

        RfpQuoteNetwork rqn = rfpQuoteNetworkRepository.findOne(rfpQuoteNetworkId);
        if(rqn == null) {
            throw new NotFoundException("Quote network not found")
                .withFields(
                    field("rfp_quote_network_id", rfpQuoteNetworkId)
                );
        }

        if(!plan.getRfpQuoteNetwork().getRfpQuoteNetworkId().equals(rqn.getRfpQuoteNetworkId())){
            throw new NotFoundException("Quote network ID does not match plan's Quote Network Id")
                .withFields(
                    field("rfp_quote_network_id", rfpQuoteNetworkId),
                    field("rfp_quote_network_plan_id", rfpQuoteNetworkPlanId)
                );
        }

        plan.setFavorite(isFavorite);
        rfpQuoteNetworkPlanRepository.save(plan);
    }
    
    public void selectRfpQuoteAncillaryPlan(Long rfpQuoteAncillaryOptionId, 
    		Long rfpQuoteAncillaryPlanId, Long secondRfpQuoteAncillaryPlanId, boolean isSelected) {
    	if(rfpQuoteAncillaryPlanId == null && secondRfpQuoteAncillaryPlanId == null) {
        	throw new BadRequestException("Missing one of required parameter: rfpQuoteAncillaryPlanId or secondRfpQuoteAncillaryPlanId");
        }
    	RfpQuoteAncillaryOption option = rfpQuoteAncillaryOptionRepository.findOne(rfpQuoteAncillaryOptionId);
        if(option == null) {
            throw new NotFoundException("Ancillary quote option not found")
                .withFields(field("rfp_quote_ancillary_option_id", rfpQuoteAncillaryOptionId));
        }
        if(rfpQuoteAncillaryPlanId != null) {
	        RfpQuoteAncillaryPlan plan = rfpQuoteAncillaryPlanRepository.findOne(rfpQuoteAncillaryPlanId);
	        if(plan == null) {
	            throw new NotFoundException("Ancillary quote plan not found")
	                .withFields(field("rfp_quote_ancillary_plan_id", rfpQuoteAncillaryPlanId));
	        } 
	        rfpQuoteAncillaryOptionRepository.setSelectedPlan(isSelected ? plan : null, rfpQuoteAncillaryOptionId);
        } 
        if(secondRfpQuoteAncillaryPlanId != null) {
	        RfpQuoteAncillaryPlan secondPlan = rfpQuoteAncillaryPlanRepository.findOne(secondRfpQuoteAncillaryPlanId);
	        if(secondPlan == null) {
	            throw new NotFoundException("Ancillary quote plan not found")
	                .withFields(field("rfp_quote_ancillary_plan_id", secondRfpQuoteAncillaryPlanId));
	        }
	        rfpQuoteAncillaryOptionRepository.setSelectedSecondPlan(isSelected ? secondPlan : null, rfpQuoteAncillaryOptionId);
        }       
    }

    public void selectSecondQuoteOptionNetworkPlan(Long rfpQuoteOptionNetworkId, Long rfpQuoteNetworkPlanId) {
        setSelectedSecondQuoteOptionNetworkPlan(rfpQuoteOptionNetworkId, rfpQuoteNetworkPlanId, true);
    }

    public void unselectSecondQuoteOptionNetworkPlan(Long rfpQuoteOptionNetworkId, Long rfpQuoteNetworkPlanId) {
        setSelectedSecondQuoteOptionNetworkPlan(rfpQuoteOptionNetworkId, rfpQuoteNetworkPlanId, false);
    }

    private void setSelectedSecondQuoteOptionNetworkPlan(Long rfpQuoteOptionNetworkId, Long rfpQuoteNetworkPlanId, boolean isSelected){
        RfpQuoteNetworkPlan plan = rfpQuoteNetworkPlanRepository.findOne(rfpQuoteNetworkPlanId);

        if(plan == null) {
            throw new NotFoundException("Quote network plan not found")
                .withFields(
                    field("rfp_quote_network_plan_id", rfpQuoteNetworkPlanId)
                );
        }

        RfpQuoteOptionNetwork rfpQuoteOptionNetwork = rfpQuoteOptionNetworkRepository.findOne(rfpQuoteOptionNetworkId);
        if (plan.getPnn().getPlanType().startsWith("RX_")) {
            rfpQuoteOptionNetworkRepository.setSelectedSecondRx(isSelected ? plan : null, rfpQuoteOptionNetwork.getRfpQuoteOptionNetworkId());
        } else {
            rfpQuoteOptionNetworkRepository.setSelectedSecondPlan(isSelected ? plan : null, rfpQuoteOptionNetwork.getRfpQuoteOptionNetworkId());
        }
    }


    public void selectQuoteOptionNetworkPlan(Long rfpQuoteOptionNetworkId, Long rfpQuoteNetworkPlanId) {
        setSelectedQuoteOptionNetworkPlan(rfpQuoteOptionNetworkId, rfpQuoteNetworkPlanId, true);
    }

    public void unselectQuoteOptionNetworkPlan(Long rfpQuoteOptionNetworkId, Long rfpQuoteNetworkPlanId) {
        setSelectedQuoteOptionNetworkPlan(rfpQuoteOptionNetworkId, rfpQuoteNetworkPlanId, false);
    }

    private void setSelectedQuoteOptionNetworkPlan(Long rfpQuoteOptionNetworkId, Long rfpQuoteNetworkPlanId, boolean isSelected) {
        RfpQuoteNetworkPlan plan = rfpQuoteNetworkPlanRepository.findOne(rfpQuoteNetworkPlanId);

        if(plan == null) {
            throw new NotFoundException("Quote network plan not found")
                .withFields(
                    field("rfp_quote_network_plan_id", rfpQuoteNetworkPlanId)
                );
        }

        RfpQuoteOptionNetwork rfpQuoteOptionNetwork = rfpQuoteOptionNetworkRepository.findOne(rfpQuoteOptionNetworkId);
        Set<Long> rfpQuoteOptionNetworkIdsToUpdatePlan = new HashSet<>();
        rfpQuoteOptionNetworkIdsToUpdatePlan.add(rfpQuoteOptionNetworkId);
        
        Set<RfpQuoteOption> rfpQuoteOptionsToInvalidateCache = new HashSet<>();
        rfpQuoteOptionsToInvalidateCache.add(rfpQuoteOptionNetwork.getRfpQuoteOption());
        
        if (rfpQuoteOptionNetwork.getNetworkGroup() != null) {
          List<RfpQuoteOptionNetwork> sameGroupNetworks = rfpQuoteOptionNetworkRepository
              .findByRfpQuoteOptionAndNetworkGroup(rfpQuoteOptionNetwork.getRfpQuoteOption(), rfpQuoteOptionNetwork.getNetworkGroup());
            for (RfpQuoteOptionNetwork rqon : sameGroupNetworks) {
              rfpQuoteOptionNetworkIdsToUpdatePlan.add(rqon.getRfpQuoteOptionNetworkId());
              rfpQuoteOptionsToInvalidateCache.add(rqon.getRfpQuoteOption());
            }
        } else if(rfpQuoteOptionNetwork.getRfpQuoteOption().getRfpQuote().getQuoteType().equals(
            CLEAR_VALUE)) {
          /**
           *  If the is a CLEAR VALUE quote, there can only be one plan selected for each network type (HMO, PPO, HSA, DHMO, DPPO, VISION).
           *  The user can have multiple HMOs (current plans) coming into Clear Value, we want them to see the difference from each of their
           *  current plan and the one Clear Value plan they will be moving to. Thus, all similar network of the same type must be
           *  updated to the same Clear Value plan if it is changed in any.
           */
          List<RfpQuoteOptionNetwork> rfpQuoteNetworks = rfpQuoteOptionNetworkRepository
              .findByRfpQuoteOptionAndRfpQuoteNetwork(rfpQuoteOptionNetwork.getRfpQuoteOption(), rfpQuoteOptionNetwork.getRfpQuoteNetwork());
          if(rfpQuoteNetworks.size() > 1) {
            for (RfpQuoteOptionNetwork rqon : rfpQuoteNetworks) {
              rfpQuoteOptionNetworkIdsToUpdatePlan.add(rqon.getRfpQuoteOptionNetworkId());
              rfpQuoteOptionsToInvalidateCache.add(rqon.getRfpQuoteOption());
            }
          }
        }
        for (Long rqonId : rfpQuoteOptionNetworkIdsToUpdatePlan) {
          if (plan.getPnn().getPlanType().startsWith("RX_")) {
            rfpQuoteOptionNetworkRepository.setSelectedRx(isSelected ? plan : null, rqonId);
          } else {
            rfpQuoteOptionNetworkRepository.setSelectedPlan(isSelected ? plan : null, rqonId);
          }
        }
        rfpQuoteOptionsToInvalidateCache.forEach(this::invalidateCachedRfpQuoteOption);
    }
    
    public List<NetworkDto> getQuoteOptionNetworks(Long rfpQuoteOptionId) {
        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);
        if(option == null) {
            throw new NotFoundException("RfpQuoteOption not found").withFields(field("rfp_quote_option_id", rfpQuoteOptionId));
        }
        return option.getRfpQuote().getRfpQuoteNetworks().stream()
            .map(n -> {
                NetworkDto dto = new NetworkDto();
                dto.setNetworkId(n.getNetwork().getNetworkId());
                dto.setName(n.getNetwork().getName());
                dto.setType(n.getNetwork().getType());
                return dto;
            })
            .distinct()
            .collect(toList());
    }
    
    public List<QuoteOptionNetworkBriefDto> getQuoteOptionNetworksToAdd(Long rfpQuoteOptionId) {
        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);

        if(option.getRfpQuote().getRfpQuoteNetworks().isEmpty()) {
            return Collections.emptyList();
        }
    	List<RfpQuoteNetwork> combinationNetworksInOption = findCombinationNetworksInOption(option);
    	
    	List<RfpQuoteNetwork> allRfpQuoteNetworks = rfpQuoteNetworkRepository.findByRfpQuote(option.getRfpQuote());
    	
    	List<RfpQuoteNetwork> result = findAvailableNetworksFromCombinations(allRfpQuoteNetworks, combinationNetworksInOption);

     	Carrier optionCarrier = option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();

     	// add all networks with aLaCarte = true flag
     	result.addAll(findCarrierALaCarteNetworks(allRfpQuoteNetworks, optionCarrier));
     	
     	if(option.getRfpQuote().getQuoteType() == CLEAR_VALUE) {
     		result = filterByClearValueOptionNetworkRestrictions(option, result);
     	}
		return mapToNetworkBriefDto(result);
    }
 
	public List<QuoteOptionNetworkBriefDto> getQuoteOptionNetworksToChange(Long rfpQuoteOptionId, Long rfpQuoteNetworkId) {
		RfpQuoteOption option = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);

		if (option.getRfpQuote().getRfpQuoteNetworks().isEmpty()) {
			return Collections.emptyList();
		}
		List<RfpQuoteNetwork> combinationNetworksInOption = findCombinationNetworksInOption(option);
		/* remove only first by condition 
		 * NOTE: remove all by condition causes the error: we cannot change duplicate network in the card, 
		 * because both duplicates filtered by condition. 
		 * In other cases (no duplicates present) code works correct as well
		 */
		for (Iterator<RfpQuoteNetwork> iterator = combinationNetworksInOption.iterator(); iterator.hasNext();) {
            RfpQuoteNetwork n = iterator.next();
            if (n.getRfpQuoteNetworkId().equals(rfpQuoteNetworkId)) {
                iterator.remove();
                break;
            }
        }
		List<RfpQuoteNetwork> allRfpQuoteNetworks = rfpQuoteNetworkRepository.findByRfpQuote(option.getRfpQuote());
		
		List<RfpQuoteNetwork> result = findAvailableNetworksFromCombinations(allRfpQuoteNetworks, combinationNetworksInOption);
		
		Carrier optionCarrier = option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();

		// add all networks with aLaCarte = true flag
		result.addAll(findCarrierALaCarteNetworks(allRfpQuoteNetworks, optionCarrier));
		
		RfpQuoteNetwork currentSelected = rfpQuoteNetworkRepository.findOne(rfpQuoteNetworkId);
		// filter by current select network type
		result = result.stream()
				.filter(n -> n.getNetwork().getType().equals(currentSelected.getNetwork().getType()))
				.collect(toList());

		return mapToNetworkBriefDto(result);
	}

    private List<RfpQuoteNetwork> findAvailableNetworksFromCombinations(List<RfpQuoteNetwork> allQuoteNetworks, List<RfpQuoteNetwork> combinationNetworksInOption) {
        final int combinationNetworksCount = combinationNetworksInOption.size() + 1;
        List<Long> selectedNetworks = combinationNetworksInOption.stream().map(n -> n.getNetwork().getNetworkId()).collect(toList());
        Map<Long, Set<Long>> networksByCombination = allQuoteNetworks.stream()
                .filter(n -> n.getRfpQuoteNetworkCombination() != null
                        && n.getRfpQuoteNetworkCombination().getNetworkCount() == combinationNetworksCount)
                .collect(Collectors.groupingBy(n -> n.getRfpQuoteNetworkCombination().getRfpQuoteNetworkCombinationId(),
                        Collectors.mapping(n -> n.getNetwork().getNetworkId(), Collectors.toSet())));

        List<RfpQuoteNetwork> avaliableNetworks = new ArrayList<>();
        for(RfpQuoteNetwork n : allQuoteNetworks) {
            if(n.getRfpQuoteNetworkCombination() != null
                    && n.getRfpQuoteNetworkCombination().getNetworkCount() == combinationNetworksCount) {
                Set<Long> networks = networksByCombination.get(n.getRfpQuoteNetworkCombination().getRfpQuoteNetworkCombinationId());
                // for non-standard combinations including single network pairs: PPO/PPO or Traditional/Traditional
                boolean allowDuplicates = networks.size() < combinationNetworksCount;
                if(networks.containsAll(selectedNetworks) 
                		&& (allowDuplicates || !selectedNetworks.contains(n.getNetwork().getNetworkId()))) {
                    avaliableNetworks.add(n);
                }
            }
        }
        return avaliableNetworks;
    }

    private List<RfpQuoteNetwork> findCombinationNetworksInOption(RfpQuoteOption option) {	
      /* NOTE assume that same group must have same networks => do not return duplicates, but 
       * take only the first network from the group */
      Map<String, RfpQuoteNetwork> networksByGroup = new HashMap<>();
      List<RfpQuoteNetwork> filtered = new ArrayList<>();
      for (RfpQuoteOptionNetwork rqon : option.getRfpQuoteOptionNetworks()) {
        RfpQuoteNetwork netw = rqon.getRfpQuoteNetwork();
        if (rqon.getNetworkGroup() != null) {
          RfpQuoteNetwork prevNetwInGroup = networksByGroup.get(rqon.getNetworkGroup());
          // checking assume from note above
          if (prevNetwInGroup != null) {
            if (!prevNetwInGroup.getRfpQuoteNetworkId().equals(netw.getRfpQuoteNetworkId())) {
              throw new ValidationException(
                  format("Network Group %s has different quote networks", rqon.getNetworkGroup()))
                  .withFields(field("networkGroup", rqon.getNetworkGroup()));
            }
            continue; // first network from group already in filtered list
          } else {
            networksByGroup.put(rqon.getNetworkGroup(), netw);
          }
        }
        if (!netw.isaLaCarte() && netw.getRfpQuoteNetworkCombination() != null) {
          filtered.add(netw);
        }
      }
      return filtered;
    }
    
    private List<RfpQuoteNetwork> findCarrierALaCarteNetworks(List<RfpQuoteNetwork> rfpQuoteNetworks, Carrier carrier) {
    	return rfpQuoteNetworks.stream()
    			.filter(n -> {
					Carrier networkCarrier = n.getNetwork().getCarrier();
					return n.isaLaCarte() && carrier.getCarrierId().equals(networkCarrier.getCarrierId());
				}).collect(toList());
    }

    private String derivePPOCombinationNetworkName(String type, String name, String optionName){
        if(type.equalsIgnoreCase("PPO") && name.equalsIgnoreCase("PPO")){
            String[] split = optionName.split("_");
            if(split.length == 3){
                name = split[1];
            }else {
                name = optionName;
            }
        }
        return name;
    }
    
    private List<QuoteOptionNetworkBriefDto> mapToNetworkBriefDto(List<RfpQuoteNetwork> rfpQuoteNetworks) {
    	return rfpQuoteNetworks.stream().map(n -> {
		    		QuoteOptionNetworkBriefDto dto = new QuoteOptionNetworkBriefDto();
		            dto.setId(n.getRfpQuoteNetworkId());
		            dto.setName(derivePPOCombinationNetworkName(n.getNetwork().getType(), n.getNetwork().getName(), n.getRfpQuoteOptionName()));
		            dto.setType(n.getNetwork().getType());
		            return dto;
		        }).collect(toList());
    }

    public Long createQuoteOptionNetwork(Long rfpQuoteOptionId, Long rfpQuoteNetworkId) {
        RfpQuoteNetwork network = rfpQuoteNetworkRepository.findOne(rfpQuoteNetworkId);
        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);
        Carrier carrier = option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
        
        if (option.getRfpQuote().getQuoteType() == CLEAR_VALUE) {
    		checkClearValueOptionNetworkRestrictions(option, network);
    	}
        
        if (network.isaLaCarte()) {
            List<RfpQuoteOptionNetwork> currentRqons = option.getRfpQuoteOptionNetworks();
            QuoteType quoteType = network.getRfpQuote().getQuoteType();
            if (carrier.getName().equals(Constants.UHC_CARRIER)) {
                // UHC
                if (quoteType.equals(QuoteType.STANDARD)) {
                    if (currentRqons.size() == 6) {
                        throw new ClientException(UHC_RESTRICTION_FOR_STANDARD_QUOTE_TYPE);
                    }
                } else if (quoteType.equals(QuoteType.EASY)) {
                    if (currentRqons.size() == 4) {
                        throw new ClientException(UHC_RESTRICTION_FOR_EASY_QUOTE_TYPE);
                    }
                }
            } else {
                // ANTHEM
                if (quoteType.equals(QuoteType.STANDARD)) {
                    if (currentRqons.size() == 6) {
                        throw new ClientException(ANTHEM_RESTRICTION_FOR_STANDARD_QUOTE_TYPE);
                    }
    
                    String networkName = network.getNetwork().getName();
                    String networkType = network.getNetwork().getType();
                    String includeName = "";
                    String excludeName = "";
                    int numberAllowed = -1; // no limit
                    switch(networkType) {
	                    case NETWORK_TYPE_HMO:
	                        numberAllowed = 2;
	                        break; 
                        case NETWORK_TYPE_HSA:
                            numberAllowed = 1;
                            break; 
                        case NETWORK_TYPE_PPO:
                            if (networkName.contains("Solution")) {
                                includeName = "Solution";
                                numberAllowed = 1;
                            } else {
                                excludeName = "Solution";
                                numberAllowed = 2;
                            }
                            break;
                    }            
                    
                    if (numberAllowed >= 0) {
                        for (RfpQuoteOptionNetwork currentRqon : currentRqons) {
                            if (!currentRqon.getRfpQuoteNetwork().getNetwork().getType().equals(networkType)) {
                                continue;
                            }
                            if (includeName.length() != 0 && !currentRqon.getRfpQuoteNetwork().getNetwork().getName().contains(includeName)) {
                                continue;
                            }
                            if (excludeName.length() != 0  && currentRqon.getRfpQuoteNetwork().getNetwork().getName().contains(excludeName)) {
                                continue;
                            }
                            numberAllowed--;
                            if (numberAllowed == 0) {
                                throw new ClientException(
                                    format(ANTHEM_RESTRICTION_BY_TYPE_AND_NAME, networkType, networkName));
                            }
                        }
                    }
                }
        
            }
        } else {
        	updateOptionNetworksCombination(option, network.getRfpQuoteNetworkCombination());
        }
        RfpQuoteOptionNetwork rqon = new RfpQuoteOptionNetwork();
        rqon.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        rqon.setTier1Census(0L);
        rqon.setTier2Census(0L);
        rqon.setTier3Census(0L);
        rqon.setTier4Census(0L);
        rqon.setTier1ErContribution(0f);
        rqon.setTier2ErContribution(0f);
        rqon.setTier3ErContribution(0f);
        rqon.setTier4ErContribution(0f);
        rqon.setRfpQuoteOption(option);
        rqon.setRfpQuoteVersion(network.getRfpQuoteVersion());
        rqon.setRfpQuoteNetwork(network);
        //rqon.setSelectedRiders(new HashSet<>(network.getRiders()));
        if(NETWORK_TYPE_HSA.equals(network.getNetwork().getType())) {
        	rqon.setAdministrativeFee(administrativeFeeService.getDefault(carrier.getCarrierId()));
        }
        rqon = rfpQuoteOptionNetworkRepository.save(rqon);

        autoSelectPlan(rqon);
        
        invalidateCachedRfpQuoteOption(rqon.getRfpQuoteOption());
 
        return rqon.getRfpQuoteOptionNetworkId();
    }

    // carrier specific
    protected void autoSelectPlan(RfpQuoteOptionNetwork rqon) {
        // default, do nothing
    }

    private List<RfpQuoteNetwork> filterByClearValueOptionNetworkRestrictions(RfpQuoteOption option, List<RfpQuoteNetwork> networks) {
    	if (option.getRfpQuote().getQuoteType() != CLEAR_VALUE) {
    		return networks;
    	}
		List<RfpQuoteNetwork> currentQuoteNetworks = option.getRfpQuoteOptionNetworks().stream()
				.map(o -> o.getRfpQuoteNetwork())
				.collect(toList());
    	Map<String, Integer> networksByType = getNetworksCountByType(currentQuoteNetworks);
    	Set<String> networTypesToFiletr = new HashSet<>();
    	if (networksByType.getOrDefault(NETWORK_TYPE_HMO, 0) > 0) {
    		networTypesToFiletr.add(NETWORK_TYPE_HMO);
    	}
    	if (networksByType.getOrDefault(NETWORK_TYPE_PPO, 0) > 0) {
    		networTypesToFiletr.add(NETWORK_TYPE_PPO);
    	}
    	if (networksByType.getOrDefault(NETWORK_TYPE_HSA, 0) > 0) {
    		networTypesToFiletr.add(NETWORK_TYPE_HSA);
    	}
    	if (!networTypesToFiletr.isEmpty()) {
    		return networks.stream()
    				.filter(n -> !networTypesToFiletr.contains(n.getNetwork().getType()))
    				.collect(toList());
    	}
    	return networks;
    }
    
    private void checkClearValueOptionNetworkRestrictions(RfpQuoteOption option, RfpQuoteNetwork networkToAdd) {
        List<RfpQuoteNetwork> allowableNetworks = filterByClearValueOptionNetworkRestrictions(option, option.getRfpQuote().getRfpQuoteNetworks());

        boolean isAllowed = allowableNetworks.stream()
                .anyMatch(network -> network.getNetwork().getNetworkId().equals(networkToAdd.getNetwork().getNetworkId()));
        if(!isAllowed){
            throw new ClientException(ANTHEM_CLEAR_VALUE_NETWORKS_RESTRICTION_COUNT);
        }
    }
    
    private Map<String, Integer> getNetworksCountByType(List<RfpQuoteNetwork> networks) {
    	Map<String, Integer> result = new HashMap<>();
    	for (RfpQuoteNetwork n : networks) {
			Integer count = result.getOrDefault(n.getNetwork().getType(), 0);
			count++;
			result.put(n.getNetwork().getType(), count);
		}
    	return result;
    }
    
    private void updateOptionNetworksCombination(RfpQuoteOption option, RfpQuoteNetworkCombination newCombination) {
    	if(newCombination == null) {
    		return;
    	}
    	List<RfpQuoteNetwork> combinationNetworksInOption = findCombinationNetworksInOption(option);
    	for(RfpQuoteNetwork combinationNetwork : combinationNetworksInOption) {
        	if(combinationNetwork.getRfpQuoteNetworkCombination().getRfpQuoteNetworkCombinationId().equals(newCombination.getRfpQuoteNetworkCombinationId())) {
        		// already combined network rates
        		continue;
        	}
        	if(combinationNetworksInOption.size() == 0 && newCombination.getNetworkCount() == 1) {
        		// first network added, no update required
        		continue;
            }
        	
        	List<RfpQuoteNetwork> networksFromNewCombination = rfpQuoteNetworkRepository
        			.findByRfpQuoteAndRfpQuoteNetworkCombination(option.getRfpQuote(), newCombination);
        	RfpQuoteNetwork combinedNetworkReplacement = null;
        	for(RfpQuoteNetwork replNetwork : networksFromNewCombination) {
				if(replNetwork.getNetwork().getNetworkId().equals(combinationNetwork.getNetwork().getNetworkId())) {
					combinedNetworkReplacement = replNetwork;
					break;
				}
			}
 
        	if(combinedNetworkReplacement == null) {
        		throw new ClientException("Cannot find network for new combination");
        	}
        	// find replaceable quoteNetwork and update it (including selected plan, rx)
        	for(RfpQuoteOptionNetwork rqon : option.getRfpQuoteOptionNetworks()) {
				if(rqon.getRfpQuoteNetwork() == combinationNetwork) { // link comparing is correct in this code
					if (rqon.getSelectedRfpQuoteNetworkPlan() != null) {
						RfpQuoteNetworkPlan newSelectedPlan = combinedNetworkReplacement.getRfpQuoteNetworkPlans().stream()
			        		    .filter(plan -> plan.getPnn().getPnnId().equals(rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getPnnId()))
			        		    .findFirst()
			        		    .orElseThrow(() -> new ClientException("Could not find selected plan for new network combination"));
						rqon.setSelectedRfpQuoteNetworkPlan(newSelectedPlan);
					}
					if (rqon.getSelectedRfpQuoteNetworkRxPlan() != null) {
						RfpQuoteNetworkPlan newSelectedRxPlan = combinedNetworkReplacement.getRfpQuoteNetworkPlans().stream()
			        		    .filter(plan -> plan.getPnn().getPnnId().equals(rqon.getSelectedRfpQuoteNetworkRxPlan().getPnn().getPnnId()))
			        		    .findFirst()
			        		    .orElseThrow(() -> new ClientException("Could not find selected RX plan for new network combination"));
						rqon.setSelectedRfpQuoteNetworkRxPlan(newSelectedRxPlan);
					}
					rqon.setRfpQuoteNetwork(combinedNetworkReplacement);
					rfpQuoteOptionNetworkRepository.save(rqon);
				}
			}
		}
    }

    public Long updateQuoteOptionNetwork(Long rfpQuoteOptionNetworkId, Long rfpQuoteNetworkId, Long networkId) {
    	RfpQuoteOptionNetwork rqon = rfpQuoteOptionNetworkRepository.findOne(rfpQuoteOptionNetworkId);
    	if(rqon == null) {
            throw new NotFoundException("RfpQuoteOptionNetwork not found")
                .withFields(field("rfp_quote_option_network_id", rfpQuoteOptionNetworkId));
        }
    	// if new network equals current
    	if(rqon.getRfpQuoteNetwork().getRfpQuoteNetworkId().equals(rfpQuoteNetworkId)) {
    		return rqon.getRfpQuoteOptionNetworkId();
    	}
    	RfpQuoteNetwork rfpQuoteNetwork;
    	if(rfpQuoteNetworkId != null) {
    	    rfpQuoteNetwork= rfpQuoteNetworkRepository.findOne(rfpQuoteNetworkId);
            if(rfpQuoteNetwork == null) {
                throw new NotFoundException("RfpQuoteNetwork not found")
                    .withFields(field("rfp_quote_network_id", rfpQuoteNetworkId));
            }
    	} else if(networkId != null) {
    	    Network network = networkRepository.findOne(networkId);
    	    if(network == null) {
                throw new NotFoundException("Network not found")
                    .withFields(field("network_id", networkId));
    	    }
    	    RfpQuote rfpQuote = rqon.getRfpQuoteOption().getRfpQuote();
    	    // FIXME is this check required?
    	    if(!network.getCarrier().getName().equals(rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier().getName())
    	    		// user should be able to create Alongside Kaiser option with Kaiser network
            		&& !carrierMatches(network.getCarrier().getName(), CarrierType.KAISER)) {
    	        throw new BaseException("Network carrier and quote option carrier are not match");
    	    }
    	    rfpQuoteNetwork = findOrCreateRfpQuoteNetwork(rqon.getRfpQuoteOption(), network);
    	} else {
    	    throw new BadRequestException("Missing one of required params: rfpQuoteNetworkId or networkId");
    	}
    	
    	if(rqon.getRfpQuoteOption().getRfpQuote().getQuoteType() == CLEAR_VALUE) {
    		checkClearValueOptionNetworkRestrictions(rqon.getRfpQuoteOption(), rfpQuoteNetwork);
    	}

        List<RfpQuoteNetworkPlan> matchingPlans = rfpQuoteNetworkPlanRepository.findByRfpQuoteNetworkAndMatchPlanTrue(rfpQuoteNetwork);
        RfpQuoteNetworkPlan matchPlan = matchingPlans
            .stream()
            .filter(plan -> plan.getRfpQuoteNetwork().getNetwork().getType().equalsIgnoreCase(rfpQuoteNetwork.getNetwork().getType()))
            .findFirst()
            .orElse(null);

        RfpQuoteNetworkPlan rxMatchPlan = matchingPlans
            .stream()
            .filter(plan -> plan.getPnn().getPlanType().equalsIgnoreCase("RX_" + rfpQuoteNetwork.getNetwork().getType()))
            .findFirst()
            .orElse(null);
        
        List<RfpQuoteOptionNetwork> sameGroupOptNetworks;
        if (rqon.getNetworkGroup() != null) {
          sameGroupOptNetworks = rfpQuoteOptionNetworkRepository
              .findByRfpQuoteOptionAndNetworkGroup(rqon.getRfpQuoteOption(), rqon.getNetworkGroup());
        } else {
          sameGroupOptNetworks = Collections.singletonList(rqon);
        }
        for (RfpQuoteOptionNetwork rfpQuoteOptionNetwork : sameGroupOptNetworks) {
          rfpQuoteOptionNetwork.setSelectedRfpQuoteNetworkPlan(matchPlan);
          rfpQuoteOptionNetwork.setSelectedRfpQuoteNetworkRxPlan(rxMatchPlan);
          // second plan - is not match plan -> set it to null
          rfpQuoteOptionNetwork.setSelectedSecondRfpQuoteNetworkPlan(null);
          rfpQuoteOptionNetwork.setSelectedSecondRfpQuoteNetworkRxPlan(null);
          rfpQuoteOptionNetwork.setRfpQuoteNetwork(rfpQuoteNetwork);

          if(rfpQuoteOptionNetwork.getSelectedRiders() != null && !rfpQuoteOptionNetwork.getSelectedRiders().isEmpty()){
              rfpQuoteOptionNetwork.getSelectedRiders().clear();
              // Auto select renewal client riders for UHC and make global per Jimson
              // https://app.asana.com/0/686594193971925/762283120612930
              autoAddRenewalClientsRqonRiders(rfpQuoteOptionNetwork, rfpQuoteNetwork);
          }
          rfpQuoteOptionNetwork = rfpQuoteOptionNetworkRepository.save(rfpQuoteOptionNetwork);
        }

    	updateOptionNetworksCombination(rqon.getRfpQuoteOption(), rfpQuoteNetwork.getRfpQuoteNetworkCombination());
    	
    	invalidateCachedRfpQuoteOption(rqon.getRfpQuoteOption());

    	return rqon.getRfpQuoteOptionNetworkId();
    }

    protected void autoAddRenewalClientsRqonRiders(RfpQuoteOptionNetwork rqon, RfpQuoteNetwork rqn) {
        Client client = rqon.getRfpQuoteOption().getRfpQuote().getRfpSubmission().getClient();
        Carrier carrier = rqon.getRfpQuoteOption().getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
        ClientAttribute renewalAttribute = attributeRepository.findClientAttributeByClientIdAndName(
            client.getClientId(), AttributeName.RENEWAL);
        if(renewalAttribute != null && carrier.getName().equals(UHC.name())) {
            for(Rider rider : rqn.getRiders()) {
                if (rider.isMatch()) {
                    rqon.getSelectedRiders().add(rider);
                }
            }
        }
    }
    
    public Long createOrUpdateQuoteOptionNetwork(Long rfpQuoteOptionId, Long clientPlanId, Long networkId) {
        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);
        Network network = networkRepository.findOne(networkId);

        RfpQuoteNetwork rfpQuoteNetwork = findOrCreateRfpQuoteNetwork(option, network);
        RfpQuoteOptionNetwork rqon = null;

        if(clientPlanId != null){
            ClientPlan clientPlan = clientPlanRepository.findOne(clientPlanId);
            rqon = rfpQuoteOptionNetworkRepository.findByRfpQuoteOptionAndClientPlan(option, clientPlan);
            if(rqon != null) {
                if(!rqon.getRfpQuoteNetwork().getRfpQuoteNetworkId().equals(rfpQuoteNetwork.getRfpQuoteNetworkId())) {
                    rqon.setRfpQuoteNetwork(rfpQuoteNetwork);

                    rqon = rfpQuoteOptionNetworkRepository.save(rqon);
                }
            } else {
                rqon = new RfpQuoteOptionNetwork();
                rqon.setErContributionFormat(clientPlan.getErContributionFormat());
                rqon.setTier1Census(clientPlan.getTier1Census());
                rqon.setTier2Census(clientPlan.getTier2Census());
                rqon.setTier3Census(clientPlan.getTier3Census());
                rqon.setTier4Census(clientPlan.getTier4Census());
                rqon.setTier1ErContribution(clientPlan.getTier1ErContribution());
                rqon.setTier2ErContribution(clientPlan.getTier2ErContribution());
                rqon.setTier3ErContribution(clientPlan.getTier3ErContribution());
                rqon.setTier4ErContribution(clientPlan.getTier4ErContribution());
                rqon.setClientPlan(clientPlan);

            }
        }else{
            rqon = new RfpQuoteOptionNetwork();
            rqon.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
            rqon.setTier1Census(0L);
            rqon.setTier2Census(0L);
            rqon.setTier3Census(0L);
            rqon.setTier4Census(0L);
            rqon.setTier1ErContribution(0f);
            rqon.setTier2ErContribution(0f);
            rqon.setTier3ErContribution(0f);
            rqon.setTier4ErContribution(0f);
        }

        rqon.setRfpQuoteOption(option);
        rqon.setRfpQuoteVersion(option.getRfpQuoteVersion());
        rqon.setRfpQuoteNetwork(rfpQuoteNetwork);
        if(NETWORK_TYPE_HSA.equals(rfpQuoteNetwork.getNetwork().getType())) {
            Carrier carrier = option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
            rqon.setAdministrativeFee(administrativeFeeService.getDefault(carrier.getCarrierId()));
        }
        rqon = rfpQuoteOptionNetworkRepository.save(rqon);
   
        invalidateCachedRfpQuoteOption(rqon.getRfpQuoteOption());

        return rqon.getRfpQuoteOptionNetworkId();
    }
    
    private RfpQuoteNetwork findOrCreateRfpQuoteNetwork(RfpQuoteOption rfpQuoteOption, Network network) {
        
        RfpQuote rfpQuote = rfpQuoteOption.getRfpQuote();
        List<RfpQuoteNetwork> allQuoteNetworks = rfpQuoteNetworkRepository.findByRfpQuote(rfpQuote);
        
        // simple check for network combinations
        List<RfpQuoteNetwork> combinationNetworksInOption = findCombinationNetworksInOption(rfpQuoteOption);
        
        List<RfpQuoteNetwork> available = findAvailableNetworksFromCombinations(allQuoteNetworks, combinationNetworksInOption);
        
        RfpQuoteNetwork rfpQuoteNetwork = null;
        
        // try to find with combinations 
        for(RfpQuoteNetwork rqn : available) {
            if(rqn.getNetwork().getNetworkId().equals(network.getNetworkId())) {
                rfpQuoteNetwork = rqn;
                break;
            }
        }
        // try to find with aLaCarte = true or combination = null
        if(rfpQuoteNetwork == null) {
            for(RfpQuoteNetwork rqn : allQuoteNetworks) {
                if(rqn.getRfpQuoteNetworkCombination() == null 
                        && rqn.getNetwork().getNetworkId().equals(network.getNetworkId())) {
                    rfpQuoteNetwork = rqn;
                    break;
                }
            }
        }

        if(rfpQuoteNetwork == null) {
            rfpQuoteNetwork = new RfpQuoteNetwork();
            rfpQuoteNetwork.setaLaCarte(false); // ???
            rfpQuoteNetwork.setRfpQuoteNetworkCombination(null);
            rfpQuoteNetwork.setNetwork(network);
            rfpQuoteNetwork.setRfpQuote(rfpQuote);
            rfpQuoteNetwork.setRfpQuoteVersion(rfpQuote.getRfpQuoteVersion());

            rfpQuoteNetwork = rfpQuoteNetworkRepository.save(rfpQuoteNetwork);
        }

        // Adding this check as a gate-keeper
        if(!network.getCarrier().getName().equals(rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier().getName()) 
        		// user should be able to create Alongside Kaiser option with Kaiser network
        		&& !carrierMatches(network.getCarrier().getName(), CarrierType.KAISER)) {
            throw new BaseException("Network carrier and quote option carrier are not match");
        }
        return rfpQuoteNetwork;
    }
    
    public void deleteQuoteOptionNetwork(Long rfpQuoteOptionNetworkId) {
        RfpQuoteOptionNetwork rqon = rfpQuoteOptionNetworkRepository.findOne(rfpQuoteOptionNetworkId);

        if(rqon == null) {
            return;
        }

        if(rqon.getClientPlan() != null) {
            throw new ClientException("Quote option network has related client plan and cannot be deleted")
                .withFields(
                    field("rfp_quote_option_network_id", rqon.getRfpQuoteOptionNetworkId()),
                    field("client_plan_id", rqon.getClientPlan().getClientPlanId())
                );
        }

        RfpQuoteOption currentOption = rqon.getRfpQuoteOption();
        
        rfpQuoteOptionNetworkRepository.delete(rfpQuoteOptionNetworkId);
        
        if(!rqon.getRfpQuoteNetwork().isaLaCarte()) {
	        currentOption.getRfpQuoteOptionNetworks().remove(rqon);
	        
	        List<RfpQuoteNetwork> allQuoteNetworks = rfpQuoteNetworkRepository.findByRfpQuote(currentOption.getRfpQuote());
	        List<RfpQuoteNetwork> combinationNetworksInOption = findCombinationNetworksInOption(currentOption);
	        RfpQuoteNetworkCombination currentCombination = findCurrentActualNetworkConbination(allQuoteNetworks, combinationNetworksInOption);
	        updateOptionNetworksCombination(currentOption, currentCombination);
        }

        invalidateCachedRfpQuoteOption(rqon.getRfpQuoteOption());
    }
    
    private RfpQuoteNetworkCombination findCurrentActualNetworkConbination(List<RfpQuoteNetwork> allQuoteNetworks, List<RfpQuoteNetwork> combinationNetworksInOption) {
    	RfpQuoteNetworkCombination newCombination = null;
    	if(combinationNetworksInOption.size() >= 1) {
    		final int combinationNetworksCount = combinationNetworksInOption.size();
        	List<Long> selectedNetworkIds = combinationNetworksInOption.stream().map(n -> n.getNetwork().getNetworkId()).collect(toList());
    		Map<Long, List<Long>> networksByCombination = allQuoteNetworks.stream()
    				.filter(n -> n.getRfpQuoteNetworkCombination() != null 
        					&& n.getRfpQuoteNetworkCombination().getNetworkCount() == combinationNetworksCount)
    				.collect(Collectors.groupingBy(n -> n.getRfpQuoteNetworkCombination().getRfpQuoteNetworkCombinationId(), 
    						Collectors.mapping(n -> n.getNetwork().getNetworkId(), Collectors.toList())));
			Long newCombinationId = networksByCombination.entrySet().stream()
				.filter(map -> map.getValue().containsAll(selectedNetworkIds))
				.map(Entry::getKey)
				.findFirst().orElse(null);
	    	
			if(newCombinationId != null) {
	    		newCombination = rfpQuoteNetworkCombinationRepository.findOne(newCombinationId);
	    	}
    	}
    	return newCombination;
    }

    public Long updateQuoteOptionNetworkContributions(List<UpdateContributionsDto> contributions) {
        Long rfpQuoteOptionId = null;

        for(UpdateContributionsDto updateContributionsDto : contributions) {
            RfpQuoteOptionNetwork optNetwork = rfpQuoteOptionNetworkRepository.findOne(updateContributionsDto.getRfpQuoteOptionNetworkId());

            if(optNetwork == null) {
                throw new NotFoundException("Quote option network not found")
                    .withFields(
                        field(
                            "rfp_quote_option_network_id",
                            updateContributionsDto.getRfpQuoteOptionNetworkId()
                        )
                    );
            }

            if(rfpQuoteOptionId == null) {
                rfpQuoteOptionId = optNetwork.getRfpQuoteOption().getRfpQuoteOptionId();
            } else {
                if(!rfpQuoteOptionId.equals(optNetwork.getRfpQuoteOption().getRfpQuoteOptionId())) {
                    throw new BadRequestException("Passed contributions has different quote option ids");
                }
            }

            if(!optNetwork.getErContributionFormat().equals(updateContributionsDto.getErContributionFormat())) {
                optNetwork.setErContributionFormat(updateContributionsDto.getErContributionFormat());
                RfpQuoteNetworkPlan plan = optNetwork.getSelectedRfpQuoteNetworkPlan();

                if(plan != null) {
                    float[] rxRates = getRXRates(optNetwork.getSelectedRfpQuoteNetworkRxPlan());
                    float[] dollarRxRates = getDollarRXRates(optNetwork.getSelectedRfpQuoteNetworkRxPlan());
                    float[] riders = getRiderCosts(optNetwork);
                    float[] specialRiders = getSpecialRiderCosts(optNetwork);
                    optNetwork.setTier1ErContribution(recalcContributionFormat(updateContributionsDto.getErContributionFormat(), optNetwork.getTier1ErContribution(), riders[0] + specialRiders[0] + dollarRxRates[0] + defaultIfNull(plan.getTier1Rate(), 0F), rxRates[0]));
                    optNetwork.setTier2ErContribution(recalcContributionFormat(updateContributionsDto.getErContributionFormat(), optNetwork.getTier2ErContribution(), riders[1] + specialRiders[1] + dollarRxRates[1] + defaultIfNull(plan.getTier2Rate(), 0F), rxRates[1]));
                    optNetwork.setTier3ErContribution(recalcContributionFormat(updateContributionsDto.getErContributionFormat(), optNetwork.getTier3ErContribution(), riders[2] + specialRiders[2] + dollarRxRates[2] + defaultIfNull(plan.getTier3Rate(), 0F), rxRates[2]));
                    optNetwork.setTier4ErContribution(recalcContributionFormat(updateContributionsDto.getErContributionFormat(), optNetwork.getTier4ErContribution(), riders[3] + specialRiders[3] + dollarRxRates[3] + defaultIfNull(plan.getTier4Rate(), 0F), rxRates[3]));
                }

                continue;
            }

            optNetwork.setErContributionFormat(updateContributionsDto.getErContributionFormat());
            optNetwork.setTier1ErContribution(updateContributionsDto.getTier1ErContribution());
            optNetwork.setTier2ErContribution(updateContributionsDto.getTier2ErContribution());
            optNetwork.setTier3ErContribution(updateContributionsDto.getTier3ErContribution());
            optNetwork.setTier4ErContribution(updateContributionsDto.getTier4ErContribution());
            optNetwork.setTier1Census(updateContributionsDto.getTier1Enrollment());
            optNetwork.setTier2Census(updateContributionsDto.getTier2Enrollment());
            optNetwork.setTier3Census(updateContributionsDto.getTier3Enrollment());
            optNetwork.setTier4Census(updateContributionsDto.getTier4Enrollment());
            optNetwork.setTier1EeFund(updateContributionsDto.getTier1EeFund());
            optNetwork.setTier2EeFund(updateContributionsDto.getTier2EeFund());
            optNetwork.setTier3EeFund(updateContributionsDto.getTier3EeFund());
            optNetwork.setTier4EeFund(updateContributionsDto.getTier4EeFund());

            rfpQuoteOptionNetworkRepository.save(optNetwork);
            
            invalidateCachedRfpQuoteOption(optNetwork.getRfpQuoteOption());
        }

        return rfpQuoteOptionId;
    }
    
    public Broker getCurrentContextBroker() {
        final Long id = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();
        Optional<Broker> broker = Optional.ofNullable(brokerRepository.findOne(id));
        return broker.orElseThrow(() -> new NotFoundException("Broker not found").withFields(field("broker_id", id)));
    }

    public boolean isCurrentContextBrokerABenrevoGA() {
        Broker currentContextBroker = getCurrentContextBroker();
        return containsIgnoreCase(currentContextBroker.getName(), "Benrevo GA");
    }

    public QuoteOptionDisclaimerDto getQuoteOptionDisclaimer(Long rfpQuoteOptionId) {
        QuoteOptionDisclaimerDto d = new QuoteOptionDisclaimerDto();

        RfpQuoteOption qo = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);

        if(qo != null && qo.getRfpQuote() != null) {
            RfpQuote q = qo.getRfpQuote();

            d.setRfpQuoteOptionId(qo.getRfpQuoteOptionId());
            d.setDisclaimer(q.getDisclaimer());
        }

        return d;
    }

    public List<QuoteOptionDisclaimerDto> getQuoteOptionDisclaimers(Long rfpQuoteOptionId) {
        List<QuoteOptionDisclaimerDto> result = new ArrayList<>();

        RfpQuoteOption qo = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);
        if(qo != null && qo.getRfpQuote() != null) {
            for (RfpQuoteDisclaimer d : qo.getRfpQuote().getDisclaimers()) {
                QuoteOptionDisclaimerDto dto = new QuoteOptionDisclaimerDto();
                dto.setRfpQuoteOptionId(qo.getRfpQuoteOptionId());
                dto.setDisclaimer(d.getText());
                dto.setType(d.getType());
                result.add(dto);
            }
        }

        return result;
    }

    public FileDto downloadFile(Long rfpQuoteId) {
        
        RfpQuote rfpQuote = rfpQuoteRepository.findOne(rfpQuoteId); 
        
        if(rfpQuote == null) {
            throw new NotFoundException("RfpQuote not found")
                .withFields(
                    field("rfp_quote_id", rfpQuoteId)
                );
        }

        if(rfpQuote.getS3Key() == null) {
            throw new NotFoundException("There is no file")
                .withFields(
                    field("rfp_quote_id", rfpQuoteId)
                );
        }
        
        try {
            FileDto fileDto = s3FileManager.download(rfpQuote.getS3Key());
            return fileDto;            
        } catch(IOException e) {
            throw new BaseException("Could not download file",e)
                .withFields(
                    field("rfp_quote_id", rfpQuoteId),
                    field("S3 key", rfpQuote.getS3Key())
                    
                );
        }
    }
}
