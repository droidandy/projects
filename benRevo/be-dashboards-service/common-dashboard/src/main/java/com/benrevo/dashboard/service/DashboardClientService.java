package com.benrevo.dashboard.service;

import static java.util.Optional.ofNullable;
import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.field;

import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.shared.access.CheckAccess;
import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.service.cache.CacheKeyType;
import com.benrevo.be.modules.shared.service.cache.CacheService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientPreQuotedDto;
import com.benrevo.common.dto.ClientSearchFilterParams;
import com.benrevo.common.dto.ClientSearchParams;
import com.benrevo.common.dto.ClientSearchResult;
import com.benrevo.common.dto.QuoteOptionBriefDto;
import com.benrevo.common.dto.QuoteOptionCachedParams;
import com.benrevo.common.enums.*;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.MathUtils;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.repository.ActivityRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientSearchRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.google.common.collect.Lists;

import java.util.*;
import java.util.stream.Collectors;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DashboardClientService implements InitializingBean {

    @Autowired
    private ClientSearchRepository clientSearchRepository;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;
    
    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;
    
    @Autowired
    private SharedCarrierService sharedCarrierService;
    
    @Lazy
    @Autowired
    private CacheService cacheService;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private CheckAccess checkAccess;
    
    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private CarrierRepository carrierRepository;
    
    @Override
    public void afterPropertiesSet() throws Exception {
        // TODO initialize cache here?
    }
    
    public Integer refreshCachedOptions(Long clientId, Long brokerId) {
        List<Client> clientsToUpdateCache = new ArrayList<>();
        if(clientId != null && brokerId != null) {
            clientsToUpdateCache = clientRepository.findByClientIdAndBrokerBrokerId(clientId, brokerId);
        } else if(clientId != null) {
            Client client = clientRepository.findOne(clientId);
            clientsToUpdateCache.add(client);
        } else if(brokerId != null) {
            clientsToUpdateCache = clientRepository.findByBrokerBrokerIdAndCarrierOwnedIsFalse(brokerId);
        } else {
            clientsToUpdateCache = Lists.newArrayList(clientRepository.findAll());
        }
        int cachedOptionsCounter = 0;
        for(Client client : clientsToUpdateCache) {
            List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientId(client.getClientId());
            for(RfpQuoteOption opt : options) {
                if(StringUtils.equalsAny(opt.getRfpQuoteOptionName(), 
                        RfpQuoteService.OPTION_1_NAME, RfpQuoteService.RENEWAL_1_NAME)) {
                    cacheOption(opt.getRfpQuoteOptionId());
                    cachedOptionsCounter++;
                }
            }
        }
        return cachedOptionsCounter;
    }
    
    protected QuoteOptionCachedParams getCachedOption(Long optionId) {
        return cacheService.hGet(CacheKeyType.RFP_QUOTE_OPTION.getKeyPrefix(), 
            optionId.toString(), QuoteOptionCachedParams.class);
    } 

    protected QuoteOptionCachedParams cacheOption(Long optionId) {
        RfpQuoteOption option = rfpQuoteOptionRepository.findOne(optionId);
        float optionTotal = SharedRfpQuoteService.MONTHS_IN_YEAR * sharedRfpQuoteService.calcOptionTotal(option);
        
        String product = option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory();
        PlanCategory planCategory = PlanCategory.valueOf(product);
        Client client = option.getRfpQuote().getRfpSubmission().getClient();
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(client.getClientId(), planCategory.getPlanTypes());
        QuoteOptionBriefDto currentOptionDto = sharedRfpQuoteService.findCurrentClientOption(clientPlans);
        float currentTotal = currentOptionDto.getTotalAnnualPremium();
        
        float diffDollar = optionTotal - currentTotal;
        float diffPercent = MathUtils.diffPecent(optionTotal, currentTotal, 2);
        
        RfpQuoteOption currentOption = sharedRfpQuoteService.prepareCurrentOption(clientPlans);
        Carrier carrier = currentOption.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();

        QuoteOptionCachedParams cached = new QuoteOptionCachedParams();
        cached.setDiffPercent(diffPercent);
        cached.setDiffDollar(diffDollar);
        cached.setCarrierId(carrier.getCarrierId());
        cached.setCarrierName(carrier.getName());
        cached.setCarrierDisplayName(carrier.getDisplayName());
        cached.setOptionTotal(optionTotal);
        
        cacheService.hSet(CacheKeyType.RFP_QUOTE_OPTION.getKeyPrefix(), optionId.toString(), cached);
        
        updateOption1ReleaseActivity(client.getClientId(), product, diffPercent);
        
        return cached;
    }
    
    private void updateOption1ReleaseActivity(Long clientId, String product, Float diffPercent) {
        
        ofNullable(activityRepository
            .findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(clientId, ActivityType.OPTION1_RELEASED, null, product, null))
            .ifPresent(activity -> {
                activity.setValue(Float.toString(diffPercent));
                activity.setUpdated(new Date());
                activityRepository.save(activity);
            });
    }
    
    public ClientSearchFilterParams getClientFilterParams(String product) {
        ClientSearchParams params = new ClientSearchParams();
        params.setProduct(product);
        List<ClientState> clientStates = new ArrayList<>();
        clientStates.addAll(ClientSearchRepository.ACTIVE_GROUPS_SEARCH_FILTER_STATES);
        clientStates.add(ClientState.SOLD);
        clientStates.add(ClientState.ON_BOARDING);
        clientStates.add(ClientState.CLOSED);
        params.setClientStates(clientStates);
        List<ClientSearchResult> clients = searchClientsByParams(params);
        
        ClientSearchFilterParams result = new ClientSearchFilterParams();
        result.setProduct(product);
        result.setDiffPercentFrom(0f);
        result.setDiffPercentTo(0f);
        result.setClientsTotalCount(clients.size());
        for(ClientSearchResult client : clients) {
            result.getBrokerages().add(build(field("id", client.getBrokerId()), field("name", client.getBrokerName())));
            if(client.getSalesName() != null && !client.getSalesName().isEmpty()) {
                result.getSales().add(build(field("id", client.getSalesId()), field("name", client.getSalesName())));
            }
            if(client.getPresalesName() != null && !client.getPresalesName().isEmpty()) {
                result.getPresales().add(build(field("id", client.getPresalesId()), field("name", client.getPresalesName())));
            }
            if(client.getCarrierDisplayName() != null && !client.getCarrierDisplayName().isEmpty()) {
                result.getIncumbentCarriers().add(build(field("id", client.getCarrierId()), field("name", client.getCarrierDisplayName())));
            }
            if(client.getDiffPercent() != null) {
                if(client.getDiffPercent() > result.getDiffPercentTo()) {
                    result.setDiffPercentTo(client.getDiffPercent());
                } 
                if(client.getDiffPercent() < result.getDiffPercentFrom()) {
                    result.setDiffPercentFrom(client.getDiffPercent());
                }
            }
        }
        return result;
    }
    
    public List<ClientSearchResult> searchClientsByParams(ClientSearchParams params) {
        
        Set<Long> brokersRestrictedByRole = Collections.emptySet();
        if(checkAccess.isBrokerageRestrictedByRole()) {
            brokersRestrictedByRole = ofNullable(checkAccess.findAvailableBrokers())
                .orElse(Collections.emptyList())
                .stream()
                .map(Broker::getBrokerId)
                .collect(Collectors.toSet());
            if(brokersRestrictedByRole.isEmpty()) {
                // no any available broker found, returning
                return Collections.emptyList();
            }
            // calc minimal intersection of brokers from filter params and available
            if(params.getBrokerIds() != null && !params.getBrokerIds().isEmpty()) {
                params.getBrokerIds().retainAll(brokersRestrictedByRole);
            } else {
                params.setBrokerIds(new ArrayList<>(brokersRestrictedByRole));
            }
        }
        if(params.getClientStates() == null || params.getClientStates().isEmpty()) {
            // add default filter states
            params.setClientStates(new ArrayList<>(ClientSearchRepository.ACTIVE_GROUPS_SEARCH_FILTER_STATES));
        } 
        
        List<ClientSearchResult> resultList = clientSearchRepository.findClientsByParams(params); 

        for(ClientSearchResult result : resultList) {
            Long optionId = ObjectUtils.firstNonNull(result.getOption1Id(), result.getRenewal1Id());
            
            if(optionId != null) {
                QuoteOptionCachedParams cached = getCachedOption(optionId);
                if(cached == null) {
                    cached = cacheOption(optionId);
                }
                result.setDiffPercent(cached.getDiffPercent());
                result.setDiffDollar(cached.getDiffDollar());
                result.setCompetitiveVsCurrent(cached.getDiffPercent());
                result.setCarrierId(cached.getCarrierId());
                result.setCarrierName(cached.getCarrierName());
                result.setCarrierDisplayName(cached.getCarrierDisplayName());
            }else{
                setSearchResultCarrier(result); 
            }
            result.setCarrierLogoUrl(getCarrierLogoUrl(result));
            
            setAdditionalInfo(result, params.getProduct());
        }
        resultList = filterByDiff(resultList, params);
        resultList = postFilter(resultList);
        return resultList;
    }

    protected void setAdditionalInfo(ClientSearchResult result, String product) {
        // do nothing
    }
    
    protected List<ClientSearchResult> postFilter(List<ClientSearchResult> resultList) {
        // no filtering by default
    	return resultList;
    }

    private void setSearchResultCarrier(ClientSearchResult result){
        if(StringUtils.isNotEmpty(result.getCarrierName()) && !result.getCarrierName().equals(Constants.MULTIPLE_CARRIER)) {
            Carrier carrier = carrierRepository.findByName(result.getCarrierName());
            if(carrier == null) {
                throw new BaseException("Cannot find carrier by name: " + result.getCarrierName());
            }
            result.setCarrierId(carrier.getCarrierId());
            result.setCarrierName(carrier.getName());
            result.setCarrierDisplayName(carrier.getDisplayName());
        }
    }
    
    private String getCarrierLogoUrl(ClientSearchResult result) {
        if(QuoteType.KAISER.name().equals(result.getQuoteType()) 
                && !Constants.KAISER_CARRIER.equals(result.getCarrierName())
                && !Constants.MULTIPLE_CARRIER.equals(result.getCarrierName())) {
            return sharedCarrierService.getOriginalImageUrl(result.getCarrierName() + "_KAISER");
        } else {
            return sharedCarrierService.getOriginalImageUrl(result.getCarrierName());
        }
    }
    
    private List<ClientSearchResult> filterByDiff(List<ClientSearchResult> resultList, ClientSearchParams params) {
        if(params.getDiffDollarFrom() == null && params.getDiffDollarTo() == null 
            && params.getDiffPercentFrom() == null && params.getDiffPercentTo() == null) {
            return resultList;
        }
        return resultList.stream().filter(sr -> {
            if(sr.getDiffDollar() == null) {
                // no Option 1 -> no DiffDollar/DiffPercent
                return true;
            }
            if(params.getDiffDollarFrom() != null && sr.getDiffDollar() < params.getDiffDollarFrom()) {
                return false;
            }
            if(params.getDiffDollarTo() != null && sr.getDiffDollar() > params.getDiffDollarTo()) {
                return false;
            }
            if(params.getDiffPercentFrom() != null && sr.getDiffPercent() < params.getDiffPercentFrom()) {
                return false;
            }
            if(params.getDiffPercentTo() != null && sr.getDiffPercent() > params.getDiffPercentTo()) {
                return false;
            }
            return true;
        }).collect(Collectors.toList());
    }

    public Map<String, Pair<Integer, Integer>> countClientsByState(String product) {
        ClientSearchParams params = new ClientSearchParams();
        params.setProduct(product);
        params.setClientStates(Arrays.asList(ClientState.values()));
        List<ClientSearchResult> searchResults = searchClientsByParams(params);

        Map<String, Pair<Integer, Integer>> result = new HashMap<>();
        List<ClientSearchResult> quoted = searchResults.stream()
                .filter(res -> res.getClientState() == ClientState.QUOTED)
                .collect(Collectors.toList());
        List<ClientSearchResult> competitive = searchResults.stream()
                .filter(res -> res.getClientState() == ClientState.QUOTED && res.getDiffDollar() != null && res.getDiffDollar() < 0)
                .collect(Collectors.toList());
        List<ClientSearchResult> sold = searchResults.stream()
                .filter(res -> res.getClientState() == ClientState.SOLD)
                .collect(Collectors.toList());

        result.put("TOTAL", sumClientAndEmployeeCount(searchResults));
        result.put("QUOTED", sumClientAndEmployeeCount(quoted));
        result.put("COMPETITIVE", sumClientAndEmployeeCount(competitive));
        result.put("SOLD", sumClientAndEmployeeCount(sold));
        return result;
    }

    private Pair<Integer, Integer> sumClientAndEmployeeCount(List<ClientSearchResult> list) {
        return Pair.of(list.size(), list.stream().mapToInt(res -> res.getEmployeeCount() == null ? 0 : res.getEmployeeCount()).sum());
    }

    public Map<String, Pair<Integer, Integer>> countClientsByProbability(String product) {
        ClientSearchParams params = new ClientSearchParams();
        params.setProduct(product);
        params.setClientStates(ClientSearchRepository.ACTIVE_GROUPS_SEARCH_FILTER_STATES);
        List<ClientSearchResult> searchResults = searchClientsByParams(params);

        Map<String, Pair<Integer, Integer>> result = new HashMap<>();
        List<ClientSearchResult> highProbability = searchResults.stream()
                .filter(res -> ProbabilityOption.HIGH.name().equals(res.getProbability()))
                .collect(Collectors.toList());
        List<ClientSearchResult> mediumProbability = searchResults.stream()
                .filter(res -> ProbabilityOption.MEDIUM.name().equals(res.getProbability()))
                .collect(Collectors.toList());
        List<ClientSearchResult> lowProbability = searchResults.stream()
                .filter(res -> ProbabilityOption.LOW.name().equals(res.getProbability()))
                .collect(Collectors.toList());
        List<ClientSearchResult> notReportedProbability = searchResults.stream()
                .filter(res -> StringUtils.isEmpty(res.getProbability()))
                .collect(Collectors.toList());

        result.put("NOT REPORTED", sumClientAndEmployeeCount(notReportedProbability));
        result.put(ProbabilityOption.HIGH.name(), sumClientAndEmployeeCount(highProbability));
        result.put(ProbabilityOption.MEDIUM.name(), sumClientAndEmployeeCount(mediumProbability));
        result.put(ProbabilityOption.LOW.name(), sumClientAndEmployeeCount(lowProbability));
        return result;
    }

    public Map<String , List<ClientPreQuotedDto>> getPreQuotedClients() {
        
        return clientRepository.findByCarrierOwnedAndClientStateIn(true, Arrays.asList( 
                ClientState.RFP_SUBMITTED,
                ClientState.OPPORTUNITY_IN_PROGRESS,
                ClientState.RATES_ISSUED,
                ClientState.SENT_TO_RATER))
            .stream()
            .sorted(Comparator.comparing(Client::getEffectiveDate, Comparator.nullsLast(Comparator.naturalOrder())))
            .map(client -> {
                ClientPreQuotedDto dto = new ClientPreQuotedDto();
                dto.setClientId(client.getClientId());
                dto.setClientName(client.getClientName());
                dto.setBrokerName(client.getBroker().getName());
                if(client.getBroker().getPresales() != null) {
                    dto.setPresalesName(client.getPresalesFullName());
                }
                dto.setEffectiveDate(client.getEffectiveDate());
                dto.setClientState(client.getClientState());
                client.getAttributes()
                    .stream()
                    .filter(a -> a.getName() == AttributeName.NOT_VIEWED_IN_DASHBOARD)
                    .findFirst()
                    .ifPresent(a -> dto.setNew(true));
                return dto;
            })
            .collect(Collectors.groupingBy(dto -> dto.isNew() ? "NewRfps" : "InProgress", Collectors.toList()));
    }

}
