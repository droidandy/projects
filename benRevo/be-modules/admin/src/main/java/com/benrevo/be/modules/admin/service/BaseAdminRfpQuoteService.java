package com.benrevo.be.modules.admin.service;

import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.enums.StageType;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.be.modules.shared.service.S3FileManager;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService.BundleDiscounts;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.*;
import com.benrevo.common.dto.PlanDifferenceDto.DifferenceItem;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.MathUtils;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.*;
import io.vavr.control.Try;

import java.util.*;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.salesforce.enums.OpportunityType.NewBusiness;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcAlterPlanTotal;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcClientPlanTotal;
import static com.benrevo.common.enums.QuoteType.CLEAR_VALUE;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.ValidationHelper.isNotNull;
import static java.lang.String.format;
import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.equalsAny;
import static org.apache.commons.lang3.StringUtils.equalsAnyIgnoreCase;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;

@Service
@Transactional
public class BaseAdminRfpQuoteService {

    @Autowired
    private CustomLogger logger;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpQuoteVersionRepository rfpQuoteVersionRepository;
    
    @Autowired
    private RiderRepository riderRepository;
    
    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;
    
    @Autowired
    private PlanRepository planRepository;
    
    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private AttributeRepository attributeRepository;
    
    @Autowired
    private S3FileManager s3FileManager;
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;
    
    @Value("${app.carrier}")
    private String[] appCarrier;

    @Value("${app.env}")
    private String appEnv;

    private static final String OPTION_1 = "Option 1";
    private static final String RENEWAL_1 = "Renewal 1";
    private static final String RENEWAL_OPTION_NAME = "Renewal";
    
    private class DiffPlan {
        private ClientPlan cp;
        private RfpQuoteOptionNetwork rqon;
        
        public DiffPlan cp(ClientPlan cp) {
            this.cp = cp;
            return this;
        }
        
        public DiffPlan rqon(RfpQuoteOptionNetwork rqon) {
            this.rqon = rqon;
            return this;
        }
        
        public ClientPlan cp() {
            return cp;
        }
        
        public RfpQuoteOptionNetwork rqon() {
            return rqon;
        }
    }

    public List<QuoteNetworkDto> getRfpQuoteNetworkList(Long rfpQuoteId) {
        RfpQuote rfpQuote = rfpQuoteRepository.getOne(rfpQuoteId);

        if(rfpQuote == null) {
            throw new NotFoundException(String.format("Quote with id %s not found!", rfpQuoteId));
        }

        List<QuoteNetworkDto> result = new ArrayList<>();
        if(rfpQuote.getRfpQuoteNetworks() != null) {
            rfpQuote.getRfpQuoteNetworks().forEach(rfpQuoteNetwork -> {
                QuoteNetworkDto quoteNetworkDto = new QuoteNetworkDto();
                quoteNetworkDto.setRfpQuoteNetwork(rfpQuoteNetwork.getRfpQuoteOptionName());
                quoteNetworkDto.setQuoteNetworkPlans(new ArrayList<>());

                if(rfpQuoteNetwork.getRfpQuoteNetworkPlans() != null) {
                    rfpQuoteNetwork.getRfpQuoteNetworkPlans().forEach(plan -> {
                        QuoteNetworkPlanDto pnnDto =
                            new QuoteNetworkPlanDto(plan.getPnn().getName(),
                                plan.getPnn().getPlanType(), plan.isMatchPlan(),
                                plan.getTier1Rate(), plan.getTier2Rate(), plan.getTier3Rate(),
                                plan.getTier4Rate()
                            );

                        pnnDto.setPnnId(plan.getPnn().getPnnId());
                        quoteNetworkDto.getQuoteNetworkPlans().add(pnnDto);
                    });

                    result.add(quoteNetworkDto);
                }
            });
        }

        return result;
    }

    /**
     * Used to look up the current networks being used for Option 1
     */
    public List<GetOption1Dto> getOption1(String category, Long clientId, OptionType optionType) {
        List<GetOption1Dto> options = new ArrayList<>();

        // all quotes by type
        List<RfpQuote> quotes =
            rfpQuoteRepository.findByClientIdAndCategory(clientId, category.toUpperCase());

        // filter quote by current app_carrier
        quotes = filterQuotesByAppCarrier(quotes);

        for(RfpQuote quote : quotes) {

            //get all the options for that quote, we want Option 1
            List<RfpQuoteOption> quoteOptions =
                rfpQuoteOptionRepository.findByRfpQuoteRfpQuoteId(quote.getRfpQuoteId());
            RfpQuoteOption option1 = quoteOptions.stream()
                .filter(
                    option ->{
                        if(optionType.equals(OptionType.OPTION)){
                            return OPTION_1.equalsIgnoreCase(option.getRfpQuoteOptionName());
                        } else if(optionType.equals(OptionType.RENEWAL)){
                            return equalsAnyIgnoreCase(option.getRfpQuoteOptionName(), RENEWAL_1, RENEWAL_OPTION_NAME);
                        }
                        return false;
                    }
                )
                .findFirst()
                .orElse(null);

            if(option1 != null) {

                // get all the client plans
                List<ClientPlan> clientPlanList =
                    clientPlanRepository.findByClientClientId(clientId);
                for(ClientPlan cp : clientPlanList) {
                    if(null == cp.getPnn()) {
                        continue;
                    }

                    //find the network with a given client_plan
                    RfpQuoteOptionNetwork rqon =
                        rfpQuoteOptionNetworkRepository.findByRfpQuoteOptionAndClientPlan(option1,
                            cp
                        );

                    if(rqon != null) {

                        //find the actual rfp quote network
                        for(RfpQuoteNetwork rqn : rfpQuoteNetworkRepository.findByRfpQuote(quote)) {

                            // real network equal our option network
                            if(rqn.getRfpQuoteNetworkId()
                                .equals(rqon.getRfpQuoteNetwork().getRfpQuoteNetworkId())) {

                                List<RfpQuoteNetworkPlan> matchingPlans =
                                    rfpQuoteNetworkPlanRepository.findByRfpQuoteNetworkAndMatchPlanTrue(
                                        rqn);
                                PlanNameByNetwork pnn = null;
                                if(matchingPlans != null && matchingPlans.size() != 0) {
                                    pnn = matchingPlans.get(0).getPnn();
                                }

                                GetOption1Dto getOption1Dto = new GetOption1Dto();
                                getOption1Dto.setPnnId(pnn.getPnnId());
                                getOption1Dto.setPlanType(pnn.getPlan().getPlanType());
                                getOption1Dto.setPlanId(pnn.getPlan().getPlanId());
                                getOption1Dto.setClientPlanId(cp.getClientPlanId());
                                getOption1Dto.setRfpQuoteNetwork(rqn.getRfpQuoteOptionName());
                                getOption1Dto.setQuoteType(quote.getQuoteType());
                                getOption1Dto.setKaiser(rqn.getNetwork()
                                                            .getCarrier()
                                                            .getName()
                                                            .equals(Constants.KAISER_CARRIER));
                                getOption1Dto.setNetworkGroup(rqon.getNetworkGroup());
                                options.add(getOption1Dto);
                            }
                        }
                    }
                }
            }
        }
        return options;
    }

    private List<RfpQuote> filterQuotesByAppCarrier(List<RfpQuote> quotes) {
        if(quotes != null) {
            quotes = quotes.stream()
                .filter(q -> equalsAny(q.getRfpSubmission().getRfpCarrier().getCarrier().getName(),
                    appCarrier
                ))
                .collect(toList());
        }
        return quotes;
    }


    public List<RfpQuoteDto> getRfpQuoteListWithCurrentPlansAndRfpQuoteNetworks(
        Long clientId, String carrierName, OptionType optionType) {

        // find rfpQuote by client_id and carrier_name
        List<RfpQuoteDto> rfpQuoteList =
            rfpQuoteRepository.getQuotesByClientIdAndCarrierName(clientId, carrierName);
        for(RfpQuoteDto rfpQuoteDto : rfpQuoteList) {

            List<RfpQuoteOption> quoteOptionList =
                rfpQuoteOptionRepository.findByRfpQuoteRfpQuoteId(rfpQuoteDto.getRfpQuoteId());

            // find options with name "Option 1" and get RfpQuoteOptionNetworks for that option
            List<RfpQuoteOptionNetwork> rqons = null;
            for(RfpQuoteOption option : quoteOptionList) {
                if(optionType.equals(OptionType.OPTION) && OPTION_1.equalsIgnoreCase(option.getRfpQuoteOptionName())) {
                    rqons = option.getRfpQuoteOptionNetworks();
                    break;
                } else if(optionType.equals(OptionType.RENEWAL) && equalsAnyIgnoreCase(option.getRfpQuoteOptionName(), RENEWAL_1, RENEWAL_OPTION_NAME)) {
                    rqons = option.getRfpQuoteOptionNetworks();
                    break;
                }
            }

            rfpQuoteDto.setCurrentPlans(new ArrayList<>());
            rfpQuoteDto.setRfpQuoteNetworks(new ArrayList<>());

            //find the network with a given RfpQuoteId
            List<RfpQuoteNetwork> rqns =
                rfpQuoteNetworkRepository.findByRfpQuoteRfpQuoteId(rfpQuoteDto.getRfpQuoteId());
            for(RfpQuoteNetwork rqn : rqns) {
                // find current plans
                if(rqons != null) {
                    for(RfpQuoteOptionNetwork rqon : rqons) {
                        // real network equal our option network
                        if(rqn.getRfpQuoteNetworkId()
                            .equals(rqon.getRfpQuoteNetwork().getRfpQuoteNetworkId())) {
                            List<RfpQuoteNetworkPlan> matchingPlans =
                                rfpQuoteNetworkPlanRepository.findByRfpQuoteNetworkAndMatchPlanTrue(
                                    rqn);
                            PlanNameByNetwork pnn = null;

                            if(matchingPlans != null && matchingPlans.size() != 0) {
                                pnn = matchingPlans.get(0).getPnn();
                            }

                            ClientPlan cp = rqon.getClientPlan();

                            if(cp == null) {
                                continue;
                            }

                            if(pnn == null) {
                                continue;
                            }

                            Plan plan = pnn.getPlan();

                            GetOption1Dto getOption1Dto = new GetOption1Dto();
                            getOption1Dto.setPnnId(pnn.getPnnId());
                            getOption1Dto.setPlanType(plan.getPlanType());
                            getOption1Dto.setPlanId(plan.getPlanId());
                            getOption1Dto.setClientPlanId(cp.getClientPlanId());
                            getOption1Dto.setRfpQuoteNetwork(rqn.getRfpQuoteOptionName());
                            getOption1Dto.setKaiser(rqn.getNetwork()
                                .getCarrier()
                                .getName()
                                .equals(Constants.KAISER_CARRIER));
                            getOption1Dto.setNetworkGroup(rqon.getNetworkGroup());
                            rfpQuoteDto.getCurrentPlans().add(getOption1Dto);
                        }
                    }
                }

                QuoteNetworkDto quoteNetworkDto = new QuoteNetworkDto();
                quoteNetworkDto.setRfpQuoteNetwork(rqn.getRfpQuoteOptionName());

                List<QuoteNetworkPlanDto> networkPlans = new ArrayList<>();
                List<RfpQuoteNetworkPlan> rfpQuoteNetworkPlans = getRfpQuoteMatchingNetworkPlans(rqn);
                quoteNetworkDto.setMatchQuoteNetworkPlans(networkPlans);

                for(RfpQuoteNetworkPlan plan : rfpQuoteNetworkPlans) {
                    QuoteNetworkPlanDto quoteNetworkPlanDto = new QuoteNetworkPlanDto();
                    PlanNameByNetwork pnn = plan.getPnn();

                    if(pnn == null) {
                        continue;
                    }

                    quoteNetworkPlanDto.setPlanName(pnn.getName());
                    quoteNetworkPlanDto.setPlanType(pnn.getPlanType());
                    quoteNetworkPlanDto.setPnnId(pnn.getPnnId());
                    quoteNetworkPlanDto.setMatchPlan(plan.isMatchPlan());
                    networkPlans.add(quoteNetworkPlanDto);
                }

                rfpQuoteDto.getRfpQuoteNetworks().add(quoteNetworkDto);
            }
        }
        return rfpQuoteList;
    }

    public List<PlanDifferenceDto> getOption1PlanDifferences(Long clientId, OptionType optionType) {
        List<PlanDifferenceDto> result = new ArrayList<>();
        List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientId(clientId);

        for (RfpQuoteOption option : options) {
            if (
                (optionType.equals(OptionType.OPTION) && !OPTION_1.equalsIgnoreCase(option.getRfpQuoteOptionName()))
                || (optionType.equals(OptionType.RENEWAL) && !equalsAnyIgnoreCase(option.getRfpQuoteOptionName(), RENEWAL_1, RENEWAL_OPTION_NAME))) {
                continue;
            }

            String product = option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory();
            QuoteType quoteType = option.getRfpQuote().getQuoteType();
            PlanDifferenceDto diffDto = new PlanDifferenceDto();
            diffDto.setProduct(product);
            diffDto.setQuoteType(quoteType);

            BundleDiscounts discounts = sharedRfpQuoteService.calcBundleDiscount(option);

            float selectedPlanTotal = 0f;
            float currentPlanTotal = 0f;
            
            // get all clientPlans 
            List<DiffPlan> plans = clientPlanRepository
                    .findByClientClientIdAndPnnPlanTypeIn(clientId, PlanCategory.valueOf(product).getPlanTypes())
                    .stream()
                    .map(cp -> new DiffPlan().cp(cp))
                    .collect(Collectors.toList());

            // bind clientPlans and RfpQuoteOptionNetwork
            for (RfpQuoteOptionNetwork rqon : option.getRfpQuoteOptionNetworks()) {
                if (rqon.getSelectedRfpQuoteNetworkPlan() == null) {
                    continue;
                }

                if (rqon.getClientPlan() == null) {
                    // add new row
                    plans.add(new DiffPlan().rqon(rqon));
                } else {
                    // add to existing row
                    plans
                        .stream()
                        .filter(p -> p.cp().getClientPlanId().equals(rqon.getClientPlan().getClientPlanId()) )
                        .findFirst()
                        .ifPresent(p -> p.rqon(rqon));
                }
            }    

            for (DiffPlan diffPlan : plans) {
                
                DifferenceItem diffItem = new DifferenceItem();
                diffDto.getPlans().add(diffItem);

                float currentPlanCost = 0F;
                if (diffPlan.cp() != null) {
                    currentPlanCost = calcClientPlanTotal(diffPlan.cp());
                    currentPlanTotal += currentPlanCost;
                    diffItem.setCurrentPlanName(diffPlan.cp().getPnn().getName());
                }

                float selectedPlanCost = 0F;
                if (diffPlan.rqon() != null) {
                    RfpQuoteNetworkPlan selectedPlan = diffPlan.rqon().getSelectedRfpQuoteNetworkPlan();
                    diffItem.setMatchPlanName(selectedPlan.getPnn().getName());
                    selectedPlanCost = calcAlterPlanTotal(diffPlan.rqon(), selectedPlan, discounts.summaryBundleDiscountPercent);
                    selectedPlanTotal += selectedPlanCost;
                }
                
                diffItem.setDollarDifference(selectedPlanCost - currentPlanCost);
                diffItem.setPercentDifference(
                        currentPlanCost == 0F ? 
                        100.0F : 
                        MathUtils.diffPecent(selectedPlanCost, currentPlanCost, 1));

            }

            diffDto.setTotalDollarDifference((selectedPlanTotal - currentPlanTotal) * 12); // annual difference
            diffDto.setTotalPercentDifference(MathUtils.diffPecent(selectedPlanTotal, currentPlanTotal, 1));
            result.add(diffDto);
        }

        return result;
    }

    public Long createOrUpdateOption1(CreateOption1Dto createOption1Dto) {
        validateQuoteOptionNetworkGroups(createOption1Dto.getClientPlanToNetwork().values());

        RfpQuote rfpQuote = rfpQuoteRepository.getOne(createOption1Dto.getRfpQuoteId());
        if(rfpQuote == null) {
            throw new NotFoundException(
                String.format("Quote with id %s not found!", createOption1Dto.getRfpQuoteId()));
        }

        resetMatchPlans(rfpQuote);

        List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByRfpQuoteRfpQuoteId(rfpQuote.getRfpQuoteId());
        RfpQuoteOption existing = options
            .stream()
            .filter(option ->{
                if(createOption1Dto.getOptionType().equals(OptionType.OPTION)){
                    return OPTION_1.equalsIgnoreCase(option.getRfpQuoteOptionName());
                } else if(createOption1Dto.getOptionType().equals(OptionType.RENEWAL)){
                    return equalsAnyIgnoreCase(option.getRfpQuoteOptionName(), RENEWAL_OPTION_NAME, RENEWAL_1);
                }
                return false;
            })
            .findFirst()
            .orElse(null);

        if(equalsIgnoreCase(createOption1Dto.getCategory(), "medical")) {
            updateSalesforce(
                rfpQuote.getRfpSubmission().getClient().getClientId(),
                rfpQuote.getRfpSubmission().getClient().getClientState()
            );
        }

        return existing == null
               ? createOption1(createOption1Dto, rfpQuote)
               : updateOption1(createOption1Dto, existing);
    }

    // TODO: Refactor this
    public void updateSalesforce(Long clientId, ClientState clientState) {
        // Retrieve client
        Client client = clientRepository.findOne(clientId);

        // Get plan differences
        List<PlanDifferenceDto> diffs = getOption1PlanDifferences(client.getClientId(), OptionType.OPTION);

        // Get GA external access list
        List<ExtClientAccess> gaAccessList = extClientAccessRepository.findByClient(client);

        // Get products quoted
        final String productsQuoted = Try.of(
            () -> diffs.stream()
                .map(PlanDifferenceDto::getProduct)
                .distinct()
                .collect(joining(";"))
        ).getOrNull();

        // Calculate standard vs current difference percentage
        final Double standardVsCurrent = Try.of(
            () -> diffs.stream()
                .filter(r -> r.getQuoteType() != CLEAR_VALUE && r.getProduct().equalsIgnoreCase("medical"))
                .findFirst()
                .map(PlanDifferenceDto::getTotalPercentDifference)
                .map(Float::doubleValue)
                .orElse(null)
        ).getOrNull();

        // Calculate clear value vs current difference percentage
        final Double cvVsCurrent = Try.of(
            () -> diffs.stream()
                .filter(r -> r.getQuoteType() == CLEAR_VALUE && r.getProduct().equalsIgnoreCase("medical"))
                .findFirst()
                .map(PlanDifferenceDto::getTotalPercentDifference)
                .map(Float::doubleValue)
                .orElse(null)
        ).getOrNull();

        // Salesforce
        Try.run(() -> publisher.publishEvent(
            new SalesforceEvent.Builder()
                .withObject(
                    new SFOpportunity.Builder()
                        .withBrokerageFirm(client.getBroker().getName())
                        .withName(client.getClientName())
                        .withCloseDate(client.getDueDate())
                        .withClearValueQuoteIssued(cvVsCurrent != null)
                        .withStageName(StageType.fromClientState(clientState))
                        .withStandardVsCurrent(standardVsCurrent)
                        .withCvVsCurrentIssued(cvVsCurrent)
                        .withProductsQuoted(productsQuoted)
                        .withType(NewBusiness)
                        .withGeneralAgent(
                            gaAccessList != null && gaAccessList.size() > 0
                                ? gaAccessList.get(0).getExtBroker().getName()
                                : null
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
            )
        ).onFailure(t -> logger.error(t.getMessage(), t));
    }

    private Long createOption1(CreateOption1Dto createOption1Dto, RfpQuote rfpQuote) {
        RfpQuoteOption option = new RfpQuoteOption();
        option.setRfpQuote(rfpQuote);
        option.setRfpQuoteOptionName(
            createOption1Dto.getOptionType().equals(OptionType.RENEWAL) ? RENEWAL_1 : OPTION_1
        );
        option.setRfpQuoteVersion(rfpQuote.getRfpQuoteVersion());
        option = rfpQuoteOptionRepository.save(option);
        final RfpQuoteOption finalOption = option;

        createOption1Dto.getClientPlanToNetwork().forEach((key, value) -> {
            ClientPlan clientPlan = clientPlanRepository.findClientPlan(key);

            if(clientPlan == null) {
                throw new NotFoundException(
                    String.format("Client plan with id %s not found!", key));
            }

            RfpQuoteOptionNetwork rqon = new RfpQuoteOptionNetwork();
            rqon.setRfpQuoteVersion(finalOption.getRfpQuoteVersion());
            rqon.setRfpQuoteOption(finalOption);
            rfpQuoteOptionNetworkRepository.save(
                buildRfpQuoteOptionNetwork(rqon, rfpQuote, value, clientPlan, createOption1Dto.getCategory())
            );
        });

        return option.getRfpQuoteOptionId();
    }
    
    private void validateQuoteOptionNetworkGroups(Collection<QuoteOptionNameToMatchingPlan> quoteOptionNetworkParams) {
        Map<String, String> groupsByNetworkName = new HashMap<>();
        Map<String, Long> matchPlanIdByNetworkName = new HashMap<>();

        for (QuoteOptionNameToMatchingPlan param : quoteOptionNetworkParams) {
            if (param.getNetworkGroup() == null) {
                continue;
            }

            String groupKey = param.getQuoteOptionName() + "_" + param.getNetworkGroup();
            String group = groupsByNetworkName.get(groupKey);

            if (group != null && !group.equals(param.getNetworkGroup())) {
                throw new BaseException(String
                    .format("Option Network %s is included in more than one Group",
                        param.getQuoteOptionName()))
                    .withFields(field("quoteOptionName", param.getQuoteOptionName()));
            } else {
                groupsByNetworkName.put(groupKey, param.getNetworkGroup());
            }

            Long matchPlanId = matchPlanIdByNetworkName.get(groupKey);

            if (matchPlanId != null && !matchPlanId.equals(param.getPnnId())) {
                throw new BaseException(String
                    .format("Option Network %s should have the same Match Plan",
                        param.getQuoteOptionName()))
                    .withFields(field("pnnId", param.getPnnId()));
            } else {
                matchPlanIdByNetworkName.put(groupKey, param.getPnnId());
            }
        }
    }


    private RfpQuoteOptionNetwork buildRfpQuoteOptionNetwork(
        RfpQuoteOptionNetwork rqon, RfpQuote rfpQuote,
        QuoteOptionNameToMatchingPlan quoteOptionInfo, ClientPlan clientPlan, String category
    ) {
        RfpQuoteNetwork quoteNetwork =
            getRfpQuoteNetwork(rfpQuote, quoteOptionInfo.getQuoteOptionName());

        rqon.setRfpQuoteNetwork(quoteNetwork);
        rqon.setClientPlan(clientPlan);
        setSelectedRfpQuoteNetworkPlan(rqon, quoteOptionInfo, category, quoteNetwork);

        rqon.setErContributionFormat(clientPlan.getErContributionFormat());
        rqon.setTier1ErContribution(floatValue(clientPlan.getTier1ErContribution()));
        rqon.setTier2ErContribution(floatValue(clientPlan.getTier2ErContribution()));
        rqon.setTier3ErContribution(floatValue(clientPlan.getTier3ErContribution()));
        rqon.setTier4ErContribution(floatValue(clientPlan.getTier4ErContribution()));

        rqon.setTier1Census(longValue(clientPlan.getTier1Census()));
        rqon.setTier2Census(longValue(clientPlan.getTier2Census()));
        rqon.setTier3Census(longValue(clientPlan.getTier3Census()));
        rqon.setTier4Census(longValue(clientPlan.getTier4Census()));
        rqon.setOutOfState(clientPlan.isOutOfState());

        if(rqon.getAdministrativeFee() == null && "HSA".equals(
            quoteNetwork.getNetwork().getType())) {
            rqon.setAdministrativeFee(getDefaultAdministrativeFee(
                rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier()));
        }

        if(StringUtils.isNoneBlank(quoteOptionInfo.getNetworkGroup())) {
            rqon.setNetworkGroup(quoteOptionInfo.getNetworkGroup());
        }

        return rqon;
    }

    private RfpQuoteNetwork getRfpQuoteNetwork(RfpQuote rfpQuote, String quoteOptionName) {
        return rfpQuote.getRfpQuoteNetworks()
            .stream()
            .filter(
                rfpQuoteNetwork -> quoteOptionName.equals(rfpQuoteNetwork.getRfpQuoteOptionName()))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException(
                String.format("Could not find network '%s' in quote %s", quoteOptionName,
                    rfpQuote.getRfpQuoteId()
                )));
    }

    private Long updateOption1(CreateOption1Dto createOption1Dto, RfpQuoteOption option) {

        isNotNull(option, format("No existing option with type=%s found to update", createOption1Dto.getOptionType()));

        Set<Long> clientPlanIds = createOption1Dto.getClientPlanToNetwork().keySet();

        List<RfpQuoteOptionNetwork> listToDelete = option.getRfpQuoteOptionNetworks()
            .stream()
            .filter(rfpQuoteOptionNetwork -> rfpQuoteOptionNetwork.getClientPlan() != null && !clientPlanIds.contains(
                rfpQuoteOptionNetwork.getClientPlan().getClientPlanId()))
            .collect(toList());

        if(listToDelete != null && !listToDelete.isEmpty()) {
            rfpQuoteOptionNetworkRepository.delete(listToDelete);
        }

        createOption1Dto.getClientPlanToNetwork().forEach((key, value) -> {
            RfpQuoteOptionNetwork optionNetwork = option.getRfpQuoteOptionNetworks()
                .stream()
                .filter(rfpQuoteOptionNetwork -> rfpQuoteOptionNetwork.getClientPlan()
                    .getClientPlanId()
                    .equals(key))
                .findFirst()
                .orElseGet(() -> {
                    RfpQuoteOptionNetwork rqon = new RfpQuoteOptionNetwork();
                    rqon.setRfpQuoteVersion(option.getRfpQuoteVersion());
                    rqon.setRfpQuoteOption(option);
                    return rqon;
                });
            ClientPlan clientPlan = clientPlanRepository.findOne(key);

            if(clientPlan == null) {
                throw new NotFoundException(
                    String.format("Client plan with id %s not found!", key));
            }

            optionNetwork =
                buildRfpQuoteOptionNetwork(optionNetwork, option.getRfpQuote(), value, clientPlan, createOption1Dto.getCategory());

            rfpQuoteOptionNetworkRepository.save(optionNetwork);
        });

        updateOption2(option.getRfpQuote(), createOption1Dto.getOptionType());
        
        return option.getRfpQuoteOptionId();
    }

    protected void updateOption2(RfpQuote rfpQuote, OptionType optionType) {
        // default, do nothing
    }

    protected void createQuotedClientCopyForSales(Long clientId) {
        throw new UnsupportedOperationException("Not implemented");
    }

    private static Long longValue(Long value) {
        return value == null ? 0L : value.longValue();
    }

    protected static Float floatValue(Float value) {
        return value == null ? 0F : value.floatValue();
    }

    /**
     * Returns the Matching Plans
     * @param rqn
     * @carrierSpecific - carrier specific logic
     * @return
     */
    protected List<RfpQuoteNetworkPlan> getRfpQuoteMatchingNetworkPlans(RfpQuoteNetwork rqn) {
        throw new UnsupportedOperationException("Not implemented");
    }

    protected void resetMatchPlans(RfpQuote rfpQuote) {
        throw new UnsupportedOperationException("Not implemented");
    }

    protected void setSelectedRfpQuoteNetworkPlan(RfpQuoteOptionNetwork rqon,
        QuoteOptionNameToMatchingPlan quoteOptionInfo, String category,
        RfpQuoteNetwork quoteNetwork) {

        throw new UnsupportedOperationException("Not implemented");
    }

    protected AdministrativeFee getDefaultAdministrativeFee(Carrier carrier) {
        throw new UnsupportedOperationException("Not implemented");
    }
    
    public void deleteRfpQuote(Long clientId, String category, QuoteType quoteType) {
        
        Client client = clientRepository.findOne(clientId);
        if (client == null) {
            throw new NotFoundException(
                    String.format("No client found for clientId=%s", clientId));
        }
        
        if (ClientState.PENDING_APPROVAL.equals(client.getClientState())
                || ClientState.ON_BOARDING.equals(client.getClientState())
                || ClientState.COMPLETED.equals(client.getClientState())
                || ClientState.CLOSED.equals(client.getClientState())) {
            throw new BaseException(
                    String.format("Can't delete quote for clientId=%s with clientState=%s", 
                            clientId, 
                            client.getClientState()));
        }
        
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(clientId, category);
        if (rfpQuotes == null || rfpQuotes.isEmpty()) {
            throw new NotFoundException(
                    String.format("No quote found for clientId=%s and category=%s", clientId, category));
        }
        
        for (RfpQuote rfpQuote : rfpQuotes) {
            
            if (quoteType == null) {
                if (!QuoteType.STANDARD.equals(rfpQuote.getQuoteType())
                        && !QuoteType.KAISER.equals(rfpQuote.getQuoteType())) {
                    // skip, delete only STANDARD and KAISER
                    continue;
                }
            } else {
                if (!quoteType.equals(rfpQuote.getQuoteType())) {
                    // skip, delete only the specified quoteType 
                    continue;
                }
            }
            
            for (RfpQuoteOption option : rfpQuote.getRfpQuoteOptions()) {
                rfpQuoteOptionNetworkRepository.delete(option.getRfpQuoteOptionNetworks());
                rfpQuoteOptionRepository.delete(option);
            }
            
            for (RfpQuoteNetwork quoteNetwork : rfpQuote.getRfpQuoteNetworks()) {
                
                for (RfpQuoteNetworkPlan quoteNetworkPlan : quoteNetwork.getRfpQuoteNetworkPlans()) {
                    
                    List<QuotePlanAttribute> attrs = attributeRepository.findQuotePlanAttributeByRqnpId(
                            quoteNetworkPlan.getRfpQuoteNetworkPlanId());
                    attributeRepository.delete(attrs);
                    
                    rfpQuoteNetworkPlanRepository.delete(quoteNetworkPlan);
                };
                
                riderRepository.delete(quoteNetwork.getRiders());
                rfpQuoteNetworkRepository.delete(quoteNetwork);
            }
            
            rfpQuoteRepository.delete(rfpQuote);
            rfpQuoteVersionRepository.delete(rfpQuote.getRfpQuoteVersion());
            
            // delete s3 file
            if (rfpQuote.getS3Key() != null) {
                s3FileManager.delete(rfpQuote.getS3Key(), CarrierType.fromStrings(appCarrier));
            }

        }
        
        ofNullable(activityRepository.findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(
                clientId, ActivityType.OPTION1_RELEASED, null, category, null))
            .ifPresent(activity -> {
                activityRepository.delete(activity);    
            });;
        
    }    
    
}
