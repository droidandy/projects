package com.benrevo.dashboard.service;

import static com.benrevo.be.modules.shared.access.AccountRole.CARRIER_MANAGER;
import static com.benrevo.be.modules.shared.access.AccountRole.CARRIER_MANAGER_RENEWAL;
import static com.benrevo.be.modules.shared.access.AccountRole.CARRIER_SALES_RENEWAL;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcClientPlanTotal;
import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.util.MapBuilder.field;

import java.util.Date;
import static java.util.Optional.ofNullable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.access.CheckAccess;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.service.cache.CacheKeyType;
import com.benrevo.be.modules.shared.service.cache.CacheService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.ClientRenewalDto;
import com.benrevo.common.dto.ClientSearchParams;
import com.benrevo.common.dto.ClientSearchResult;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.dto.DiscountDataDto;
import com.benrevo.common.dto.DiscountDataDto.SalesPersonDto;
import com.benrevo.common.dto.QuoteOptionCachedParams;
import com.benrevo.common.dto.RfpQuoteOptionAttributeDto;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotAuthorizedException;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.MathUtils;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.repository.ActivityRepository;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientSearchRepository;
import com.benrevo.data.persistence.repository.PersonRelationRepository;
import com.benrevo.data.persistence.repository.PersonRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;

@Service
@AppCarrier(UHC)
@Transactional
public class UHCDashboardClientService extends DashboardClientService {

    private static final int MAX_RETURN_CLIENTS = 5;

    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private SharedCarrierService sharedCarrierService;
    
    @Autowired
    private Auth0Service auth0Service;
    
    @Autowired
    private PersonRepository personRepository;
    
    @Autowired
    private AttributeRepository attributeRepository;
    
    @Autowired
    private PersonRelationRepository personRelationRepository;
    
    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;
    
    @Autowired
    private  RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private  ActivityRepository activityRepository;
    
    @Lazy
    @Autowired
    private CacheService cacheService;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;
    
    @Autowired
    private CheckAccess checkAccess;
    
    public List<ClientRenewalDto> getAtRiskRenewalClients(String product) {
        
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
            return clientRepository.findClientsRenewalAtRisk(
                    product, 
                    ClientSearchRepository.ACTIVE_GROUPS_SEARCH_FILTER_STATES, 
                    brokersRestrictedByRole, 
                    new PageRequest(0, MAX_RETURN_CLIENTS));

        } else {
            return clientRepository.findClientsRenewalAtRiskAllBroker(
                    product, 
                    ClientSearchRepository.ACTIVE_GROUPS_SEARCH_FILTER_STATES, 
                    new PageRequest(0, MAX_RETURN_CLIENTS));

        }
        
    }

    public List<ClientRenewalDto> getUpcomingRenewalClients(String product) {
        
        if(checkAccess.isBrokerageRestrictedByRole()) {
            Set<Long> brokersRestrictedByRole = ofNullable(checkAccess.findAvailableBrokers())
                .orElse(Collections.emptyList())
                .stream()
                .map(Broker::getBrokerId)
                .collect(Collectors.toSet());
            if(brokersRestrictedByRole.isEmpty()) {
                // no any available broker found, returning
                return Collections.emptyList();
            }
            return clientRepository.findUpcomingRenewalClients(
                    product, 
                    ClientSearchRepository.ACTIVE_GROUPS_SEARCH_FILTER_STATES,
                    brokersRestrictedByRole,
                    new PageRequest(0, MAX_RETURN_CLIENTS));
        } else {
            return clientRepository.findUpcomingRenewalClientsAllBroker(
                    product, 
                    ClientSearchRepository.ACTIVE_GROUPS_SEARCH_FILTER_STATES, 
                    new PageRequest(0, MAX_RETURN_CLIENTS));
        }
        
    }

    public DiscountDataDto getSalesTotalDiscount(String quarterYear) {

        // parse quarterYear "Q2 2018"
        Calendar calendar = Calendar.getInstance();
        int quarter = 0;
        int year = 0;
        if (quarterYear != null) {
            String[] tmp = quarterYear.substring(1).split(" ");
            if (tmp.length > 1 ) {
                quarter = NumberUtils.toInt(tmp[0]);
                year = NumberUtils.toInt(tmp[1]);
            }
        }
        if (quarter == 0 || year == 0) {
            // parse error
            // use current
            year = calendar.get(Calendar.YEAR);
            quarter = calendar.get(Calendar.MONTH) / 3 + 1;
        }
        calendar.clear();
        int month = (quarter - 1) * 3;
        calendar.set(year, month, 1, 0, 0, 0);
        Date effectiveDateFrom = calendar.getTime(); 
        calendar.add(Calendar.MONTH, 3);
        Date effectiveDateTo = calendar.getTime();
        
        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        if(!currentUser.getRoles().contains(AccountRole.CARRIER_MANAGER_RENEWAL.getValue())) {
            throw new NotAuthorizedException("Only available for CARRIER_MANAGER_RENEWAL");
        }    
        String userEmail = auth0Service.getUserEmail(currentUser.getName());
        
        Carrier carrier = sharedCarrierService.findByName(UHC);
        Person carrierManager = personRepository.findByCarrierIdAndTypeAndEmail(
                carrier.getCarrierId(), PersonType.CARRIER_MANAGER_RENEWAL, userEmail);

        if(carrierManager == null) {
            throw new BaseException("Cannot find carrier manager renewal person")
                .withFields(field( "email", userEmail ));
        }

        List<Person> salesPersons = personRelationRepository.findChildren(carrierManager.getPersonId())
                .stream()
                .filter(p -> p.getType() == PersonType.SALES_RENEWAL)
                .collect(Collectors.toList());

        DiscountDataDto result = new DiscountDataDto();
        float closedGroupDiscounts = 0f;
        float pendingGroupDiscounts = 0f;
        long closedGroupEmployeeCount = 0;
        long pendingGroupEmployeeCount = 0;
        Set<Long> closedGroup = new HashSet<>();
        Set<Long> pendingGroup = new HashSet<>();
        
        for (Person salesPerson : salesPersons) {

            float totalPerSalesPerson = 0f;
            List<RfpQuoteOptionAttributeDto> optionAttributes = attributeRepository.findStartingRenewalAttributeBySalesPersonId(
                    salesPerson.getPersonId(), effectiveDateFrom, effectiveDateTo);
            for (RfpQuoteOptionAttributeDto optionAttribute : optionAttributes) {
                float startingRenewal = SharedRfpQuoteService.MONTHS_IN_YEAR * Float.parseFloat(optionAttribute.getValue());
                QuoteOptionCachedParams cached = getCachedOption(optionAttribute.getOptionId());
                if(cached == null) {
                    cached = cacheOption(optionAttribute.getOptionId());
                }
                float discountIncrease = startingRenewal - cached.getOptionTotal();
                if (discountIncrease > 0.01f) {
                    totalPerSalesPerson += discountIncrease;
                    switch (optionAttribute.getClientState()) {
                        case SOLD:
                            closedGroupDiscounts += discountIncrease;
                            // remove duplication
                            if (closedGroup.add(optionAttribute.getClientId())) {
                                // new group
                                closedGroupEmployeeCount += optionAttribute.getEmployeeCount();
                            };
                            break;
                        default:
                            pendingGroupDiscounts += discountIncrease;
                            // remove duplication
                            if (pendingGroup.add(optionAttribute.getClientId())) {
                                // new group
                                pendingGroupEmployeeCount += optionAttribute.getEmployeeCount();
                            };
                            break;
                    }
                }
            }
            result.getSalesPersons().add(new SalesPersonDto(salesPerson.getFullName(), totalPerSalesPerson));

        }

        result.setClosedGroupCount(closedGroup.size());
        result.setClosedGroupEmployeeCount(closedGroupEmployeeCount);
        result.setClosedGroupDiscounts(closedGroupDiscounts);
        result.setPendingGroupCount(pendingGroup.size());
        result.setPendingGroupEmployeeCount(pendingGroupEmployeeCount);
        result.setPendingGroupDiscounts(pendingGroupDiscounts);
        result.setTotalGroupCount(closedGroup.size() + pendingGroup.size());
        result.setTotalGroupEmployeeCount(closedGroupEmployeeCount + pendingGroupEmployeeCount);
        result.setTotalGroupDiscounts(closedGroupDiscounts + pendingGroupDiscounts);

        // set percents
        for (SalesPersonDto salesPerson : result.getSalesPersons()) {
            salesPerson.setDiscountsPercent((int)(salesPerson.getDiscounts() * 100 / result.getTotalGroupDiscounts()));
        }
        return result;
    }

    public List<ClientRenewalDto> getTopClients(String product) {
        
        List<ClientRenewalDto> clients;
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
            clients = clientRepository.findTopClients(brokersRestrictedByRole, new PageRequest(0, MAX_RETURN_CLIENTS));
        } else {
            clients = clientRepository.findTopClientsAllBroker(new PageRequest(0, MAX_RETURN_CLIENTS));    
        }

        // set status
        for (ClientRenewalDto client : clients) {
            if (ClientState.CLOSED.equals(client.getClientState()) 
                    && new Date().compareTo(client.getEffectiveDate()) > 0) {
                client.setStatus("Lost");
            } else if (ClientState.COMPLETED.equals(client.getClientState())) {

                client.setStatus("Closed");

                // calculate the final difference between the renewal card and the current card. 
                rfpQuoteOptionRepository.
                        findByClientIdAndCategoryAndQuoteType(client.getClientId(), product, QuoteType.STANDARD)
                        .stream()
                        .filter(o -> o.getRfpQuoteOptionName().equalsIgnoreCase("Renewal 1"))
                        .findFirst()
                        .ifPresent(renewal -> {
                            
                            QuoteOptionCachedParams cached = getCachedOption(renewal.getOptionId());
                            if(cached == null) {
                                cached = cacheOption(renewal.getOptionId());
                            }

                            int dif = cached.getDiffPercent().intValue();
                            client.setStatus(String.format("Closed at %s", dif > 0 ? "+" + dif : dif));
                            
                        });
            }
        }
        return clients;
    }

    @Override
    public List<ClientSearchResult> searchClientsByParams(ClientSearchParams params) {
    	AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();

        if(currentUser.getRoles().contains(CARRIER_MANAGER_RENEWAL.getValue()) 
        		|| currentUser.getRoles().contains(CARRIER_SALES_RENEWAL.getValue())) {
        	// search only RENEWAL
        	params.setClientAttributes(Arrays.asList(AttributeName.RENEWAL));
        } else {
        	// search all except RENEWAL
        	params.setExcludeClientAttributes(Arrays.asList(AttributeName.RENEWAL));
        }
       
        return super.searchClientsByParams(params);
    }
    
    @Override
    protected void setAdditionalInfo(ClientSearchResult result, String product) {

        Client client = clientRepository.findOne(result.getClientId()); // client can't be null
        
        // set attributes
        result.setClientAttributes(client.getAttributes()
            .stream()
            .map(ClientAttribute::getName)
            .collect(Collectors.toList()));
        
        // override brokerage sales/presales by client values
        if(CollectionUtils.isNotEmpty(client.getSales())) {
            Person sale = client.getSales().get(0);
            result.setSalesId(sale.getPersonId());
            result.setSalesName(sale.getFullName());
        }
        if(CollectionUtils.isNotEmpty(client.getPresales())) {
            Person presale = client.getPresales().get(0);
            result.setPresalesId(presale.getPersonId());
            result.setPresalesName(presale.getFullName());
        }
        ofNullable(activityRepository
                .findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(
                        result.getClientId(), ActivityType.INITIAL_RENEWAL, null, product, null))
                .ifPresent(a -> {
                    result.setStartingRenewalIncrease(a.getValue());
                });

        if (result.getStartingRenewalIncrease() != null) {
            ofNullable(activityRepository
                .findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(
                        result.getClientId(), ActivityType.RENEWAL_ADDED, null, product, null))
                .ifPresent(a -> {
                    // do not set current renewal increase if it equals to starting one
                    if (!result.getStartingRenewalIncrease().equals(a.getValue())) {
                        result.setCurrentRenewalIncrease(a.getValue());
                    }
                });
        }

    }

}
