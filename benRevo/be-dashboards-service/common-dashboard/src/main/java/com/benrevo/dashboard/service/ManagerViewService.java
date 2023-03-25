package com.benrevo.dashboard.service;

import static java.util.stream.Collectors.averagingDouble;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toMap;

import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.common.dto.BrokerVolumeDto;
import com.benrevo.common.dto.BrokerVolumeDto.BrokerVolumeItem;
import com.benrevo.common.dto.BrokerVolumeDto.BrokerVolumeItem.CarrierInfo;
import com.benrevo.common.dto.ClientSearchParams;
import com.benrevo.common.dto.ClientSearchResult;
import com.benrevo.common.dto.RelativeMarketPosition;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.util.MathUtils;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.repository.ClientSearchRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.stream.Collectors;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.math3.stat.StatUtils;
import org.apache.commons.math3.stat.descriptive.rank.Median;
import org.apache.commons.math3.stat.descriptive.rank.Percentile;
import org.apache.commons.math3.util.MathArrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ManagerViewService {

    @Autowired
    private ClientSearchRepository clientSearchRepository;
    
    @Autowired
    private DashboardClientService dashboardClientService;
    
    @Autowired
    private SharedCarrierService sharedCarrierService;
    
    public BrokerVolumeDto getBrokerVolume(List<ClientState> clientStates, String product) {
        ClientSearchParams params = new ClientSearchParams();
        params.setProduct(product);
        params.setClientStates(clientStates);
        List<ClientSearchResult> clients = dashboardClientService.searchClientsByParams(params);
        
        if(clients.isEmpty()) {
            BrokerVolumeDto result = new BrokerVolumeDto();
            result.setGroupsTotal(0);
            result.setMembersTotal(0);
            return result;
        }
        // group found clients by Broker and Sales
        Map<BrokerVolumeItem, List<ClientSearchResult>> clientsByBrokerAndSales = clients.stream()
            .collect(groupingBy(c -> new BrokerVolumeItem(
                c.getBrokerId(), c.getBrokerName(), c.getSalesId(), c.getSalesName(), 0, 0)));
        
        BrokerVolumeDto result = new BrokerVolumeDto();

        int groupsTotal = 0;
        int membersTotal = 0;
        // calculate count on Groups and Employees by Broker & Sales and totals
        for(Entry<BrokerVolumeItem, List<ClientSearchResult>> entry : clientsByBrokerAndSales.entrySet()) {
            BrokerVolumeItem item = entry.getKey();
            List<ClientSearchResult> groupedClients = entry.getValue();
            item.setGroups(groupedClients.size());
            item.setMembers((int) groupedClients.stream()
                .mapToLong(c -> c.getEmployeeCount() != null ? c.getEmployeeCount() : 0L)
                .sum());
            groupsTotal += item.getGroups(); 
            membersTotal += item.getMembers(); 
            
            // find count of incumbent carriers for Broker (row in API result) clients
            // select count() ... group by carrier
            Map<BrokerVolumeItem.CarrierInfo, Long> carriersInfo = groupedClients.stream()
                .collect(groupingBy(c -> new CarrierInfo(c.getCarrierId(), c.getCarrierLogoUrl()), Collectors.counting()));
            List<CarrierInfo> carriers = new ArrayList<>();
            carriersInfo.forEach((car, count) -> {
                car.count = count.intValue();
                carriers.add(car);
            });
            item.setCarriers(carriers);
        }
        List<BrokerVolumeItem> items = new ArrayList<>(clientsByBrokerAndSales.keySet());
        items.sort(// order by groupsTotal desc, membersTotal desc
            Comparator.comparing(BrokerVolumeItem::getGroups, (i1, i2) -> i2.compareTo(i1))
            .thenComparing(BrokerVolumeItem::getMembers, (i1, i2) -> i2.compareTo(i1)));
        
        result.setItems(items);
        result.setGroupsTotal(groupsTotal);
        result.setMembersTotal(membersTotal);
        return result;
    }
   
    public List<RelativeMarketPosition> getAverageQuoteDifferences(String product) {
        ClientSearchParams params = new ClientSearchParams();
        params.setProduct(product);
        // if we want remove MultipleCarriers from result table, we can use this filter
        //params.setMultipleCarriers(false);
        params.setClientStates(new ArrayList<>(ClientSearchRepository.COMPETITIVE_INFO_SEARCH_FILTER_STATES));
        List<ClientSearchResult> clients = dashboardClientService.searchClientsByParams(params);
        
        // filter out kaiser quote types
        clients = clients
            .stream()
            .filter(c -> c.getQuoteType() != null && !c.getQuoteType().equals(QuoteType.KAISER.name()))
            .collect(Collectors.toList());
        
        if(clients.isEmpty()) {
            return Collections.emptyList();
        }
   
        Map<String, List<ClientSearchResult>> clientsByCarrierName = clients.stream()
            .filter(cl -> Objects.nonNull(cl.getDiffPercent()))
            .collect(groupingBy(ClientSearchResult::getCarrierName));
        
        Carrier current = sharedCarrierService.getCurrentEnvCarrier();
        
        return clientsByCarrierName.entrySet().stream()
            .filter(entry -> !entry.getKey().equals(current.getName()))
            .map(entry -> {
                final String carrierName = entry.getKey();
                final List<ClientSearchResult> carrierClients = entry.getValue();
                double[] diffPercents = carrierClients.stream()
                    .mapToDouble(ClientSearchResult::getDiffPercent)
                    .toArray();    
                Double avgDiffPercent = Arrays.stream(diffPercents).average().orElse(0);
                RelativeMarketPosition pos = new RelativeMarketPosition();
                pos.setCarrierName(carrierName);
                pos.setCarrierId(carrierClients.get(0).getCarrierId());
                pos.setCarrierDisplayName(carrierClients.get(0).getCarrierDisplayName());
                pos.setLogoUrl(sharedCarrierService.getOriginalImageUrl(carrierName));
                pos.setAvgDiffPercent(MathUtils.round(avgDiffPercent.floatValue(), 2));
                pos.setMedianDiffPercent(MathUtils.round(MathUtils.median(diffPercents), 2));
                pos.setGroups(carrierClients.size());
                return pos;
            })
            .sorted((p1, p2) -> p1.getAvgDiffPercent().compareTo(p2.getAvgDiffPercent()))
            .collect(Collectors.toList());
    }

    public List<RelativeMarketPosition> getRelativeMarketPosition(String product) {

        ClientSearchParams params = new ClientSearchParams();
        params.setProduct(product);
        params.setCompetitiveInfoCarrier("ALL");
        params.setClientStates(new ArrayList<>(ClientSearchRepository.COMPETITIVE_INFO_SEARCH_FILTER_STATES));
        List<ClientSearchResult> clients = dashboardClientService.searchClientsByParams(params);
        
        if(clients.isEmpty()) {
            return Collections.emptyList();
        }
        
        Map<Long, Float> option1DiffPercentByClientId = clients.stream()
            // exclude clients without Option 1 and diffPercent
            .filter(cl -> Objects.nonNull(cl.getDiffPercent()))
            .collect(toMap(ClientSearchResult::getClientId, ClientSearchResult::getDiffPercent, 
                (client1, client2) -> {
                    // unexpected duplicate, using first found
                    return client1;
                }));

        if (option1DiffPercentByClientId.isEmpty()) {
            return Collections.emptyList();
        }
        
        Carrier current = sharedCarrierService.getCurrentEnvCarrier();
        List<ClientSearchResult> positions = clientSearchRepository.findCompetitiveInfoDifferences(
            option1DiffPercentByClientId.keySet(), product);
        
        Map<String, List<ClientSearchResult>> avgDiffPercentByCarrierName = positions.stream()
            .peek(cl -> {
                // calc diff current carrier from competitive information entered for that client
                Float option1DiffPercent = option1DiffPercentByClientId.get(cl.getClientId());
                cl.setDiffPercent(option1DiffPercent - cl.getCompetitiveVsCurrent());
            })
            .collect(groupingBy(ClientSearchResult::getCarrierName));
        // remove current
        // sort by AvgDiff
        return avgDiffPercentByCarrierName.entrySet().stream()
            .filter(entry -> !entry.getKey().equals(current.getName()))
            .map(entry -> {
                final String carrierName = entry.getKey();
                final List<ClientSearchResult> carrierClients = entry.getValue();
                double[] diffPercents = carrierClients.stream()
                    .mapToDouble(ClientSearchResult::getDiffPercent)
                    .toArray();    
                Double avgDiffPercent = Arrays.stream(diffPercents).average().orElse(0);
                RelativeMarketPosition pos = new RelativeMarketPosition();
                pos.setCarrierName(carrierName);
                pos.setCarrierId(carrierClients.get(0).getCarrierId());
                pos.setCarrierDisplayName(carrierClients.get(0).getCarrierDisplayName());
                pos.setLogoUrl(sharedCarrierService.getOriginalImageUrl(entry.getKey()));
                pos.setAvgDiffPercent(MathUtils.round(avgDiffPercent.floatValue(), 2));
                pos.setMedianDiffPercent(MathUtils.round(MathUtils.median(diffPercents), 2));
                pos.setGroups(carrierClients.size());
                return pos;
            })
            .sorted((p1, p2) -> p1.getAvgDiffPercent().compareTo(p2.getAvgDiffPercent()))
            .collect(Collectors.toList());
    }
}
