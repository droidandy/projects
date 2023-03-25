package com.benrevo.data.persistence.repository;

import com.benrevo.common.dto.ClientRenewalDto;
import com.benrevo.common.dto.ClientSearchParams;
import com.benrevo.common.dto.ClientSearchResult;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.helper.JpaUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.math.BigInteger;
import java.util.*;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.transform.ResultTransformer;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.Repository;

import static com.benrevo.common.Constants.MULTIPLE_CARRIER;
import static com.benrevo.common.Constants.MULTIPLE_CARRIER_DISPLAY_NAME;
import static com.benrevo.common.enums.ClientState.*;

@org.springframework.stereotype.Repository
public class ClientSearchRepository implements Repository<Client, Long> {

    public static List<ClientState> COMPETITIVE_INFO_SEARCH_FILTER_STATES = Arrays.asList(
        QUOTED, PENDING_APPROVAL, ON_BOARDING, SOLD, CLOSED);
    
    public static List<ClientState> ACTIVE_GROUPS_SEARCH_FILTER_STATES = Arrays.asList(
        QUOTED, PENDING_APPROVAL);
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Value("${app.env:local}")
    private String appEnv;

    private Query buildCompetitiveInfoDifferencesQuery(Collection<Long> clientIds, String product) {
        if(StringUtils.isBlank(product)) {
            throw new BaseException("Missing required search param: product");
        }
        if(clientIds == null || clientIds.isEmpty()) {
            throw new BaseException("Missing required search param: clientIds");
        }
        String queryString = "select "
            +   "c.carrier_id as carrierId, "
            +   "c.name as carrierName, "
            +   "c.display_name as carrierDisplayName, "
            +   "a.client_id as clientId, " 
            +   "cast(a.value as DECIMAL) as diffPercent "
            + "from activity a " 
            + "inner join carrier c on c.carrier_id = a.carrier_id " 
            + "where a.product = :product " 
            +   "and a.type = 'COMPETITIVE_INFO' " 
            +   "and a.option = 'DIFFERENCE' " 
            +   "and a.latest = 1 "
            +   "and a.client_id in (:clientIds) ";

        Map<String, Object> queryParams = new HashMap<>();
        queryParams.put("clientIds", clientIds);
        queryParams.put("product", product);

        Query query = entityManager.createNativeQuery(queryString);
        JpaUtils.setQueryParameters(query, queryParams);
        
        return query;
    }

    // Note: only raw sql, only hardcore! :) 
    // But only one query to get all params and filters
    private String CLIENT_SEARCH_QUERY = 
        "select distinct "
        +   "c.client_id as clientId, " 
        +   "c.client_name as clientName, "
        +   "c.client_state as clientState, "
        // subquery to get all products as joined string in single query
        // for details see https://dev.mysql.com/doc/refman/5.7/en/group-by-functions.html#function_group-concat
        +   "(select group_concat(distinct rc1.category separator ',') " 
        +        "from rfp_submission rsub1 " 
        +        "inner join rfp_quote rq1 on rq1.rfp_submission_id = rsub1.rfp_submission_id " 
        +        "inner join rfp_carrier rc1 on rc1.rfp_carrier_id = rsub1.rfp_carrier_id "
        +        "where rsub1.client_id = c.client_id and rq1.latest = 1 "
        +        "and rq1.quote_type in ('KAISER','STANDARD') ) as quotedProducts, "
        +   "c.participating_employees as employeeCount, "
        +   "prob.value as probability, " 
        +   "c.effective_date as effectiveDate, " 
        +   "sales.full_name as salesName, " 
        +   "sales.person_id as salesId, " 
        +   "presales.full_name as presalesName, " 
        +   "presales.person_id as presalesId, " 
        +   "b.name as brokerName, "
        +   "b.broker_id as brokerId, "
        +   "q.quote_type as quoteType, "
        +   "rqo.rfp_quote_option_id as option1Id, "
        +   "rqo2.rfp_quote_option_id as renewal1Id, " 
        +   "currentCarriers.names as currentCarrierNames "
        + "from client c "
        +   "inner join broker b on b.broker_id = c.broker_id "
        +   "inner join rfp_submission sub on sub.client_id = c.client_id "
        +   "inner join rfp_quote q on q.rfp_submission_id = sub.rfp_submission_id and q.latest = 1 "
        +   "inner join rfp_carrier rfpc on rfpc.rfp_carrier_id = sub.rfp_carrier_id "
            /* NOTE: client sales/presales not supported yet, return only broker sales/presales
             * See UHCDashboardClientService.setAdditionalInfo() for details
             * Add join to client person relation (parent_type = 'CLIENT') if required */
        +   "left join (select bpr.parent_id as broker_id, presales.person_id, presales.full_name " 
        +               "from person_relation bpr "
        +               "inner join person presales on presales.person_id = bpr.person_id " 
        +               "where bpr.parent_type = 'BROKERAGE' and presales.type = 'PRESALES' "
        +               "group by bpr.parent_id) presales " // return only one/first person from SALES/SALES_RENEWAL
        +       "on presales.broker_id = b.broker_id "
            // FIXME use any_value(sales.person_id), any_value(sales.full_name) in MySQL version >= 5.7
        +   "left join (select bpr.parent_id as broker_id, sales.person_id, sales.full_name " 
        +               "from person_relation bpr "
        +               "inner join person sales on sales.person_id = bpr.person_id " 
        +               "where bpr.parent_type = 'BROKERAGE' and sales.type in ('SALES', 'SALES_RENEWAL') "                     
        +               "group by bpr.parent_id) sales " // return only one/first person from SALES/SALES_RENEWAL
        +       "on sales.broker_id = b.broker_id "
        +   "left join rfp_quote_option rqo on rqo.rfp_quote_id = q.rfp_quote_id "
        +                                  "and rqo.rfp_quote_option_name = 'Option 1' "
        +   "left join rfp_quote_option rqo2 on rqo2.rfp_quote_id = q.rfp_quote_id "
        +                                  "and rqo2.rfp_quote_option_name = 'Renewal 1' "
        +   "left join activity prob on prob.client_id = c.client_id and prob.latest = 1 "
        +                                  "and prob.type = 'PROBABILITY' "
        // for details see https://dev.mysql.com/doc/refman/5.7/en/group-by-functions.html#function_group-concat
        +   "left join (select cp.client_id, group_concat(distinct car.name separator ',') as names " 
        +                "from client_plan cp " 
        +               "inner join plan_name_by_network pnn on pnn.pnn_id = cp.pnn_id "
        +               "inner join plan p on p.plan_id = pnn.plan_id "
        +               "inner join carrier car on car.carrier_id = p.carrier_id "
        +               "where pnn.plan_type in (:planTypes) "
        +               "group by cp.client_id) currentCarriers "
        +       "on currentCarriers.client_id = c.client_id "
        + "where c.archived = 0 "
        + "and c.carrier_owned = 0 "
        + "and q.quote_type in (case " // determinate type of joined quote (KAISER/STANDARD) by current client carrier
        +                          "when (rfpc.category = 'MEDICAL' and currentCarriers.names like '%KAISER%' and exists(" 
                                            // check for Kaiser quote exists
        +                                   "select 1 from rfp_submission sub "
        +                                    "inner join rfp_quote kaiserQuote "
        +                                       "on kaiserQuote.rfp_submission_id = sub.rfp_submission_id "
        +                                      "and kaiserQuote.quote_type = 'KAISER' "
        +                                      "and kaiserQuote.latest = 1 "
        +                                    "where sub.client_id = c.client_id)) " 
        +                          "then 'KAISER' " 
        +                          "else 'STANDARD' " 
        +                       "end, 'DECLINED') " 
        + "and (rqo.rfp_quote_option_id is not null or rqo2.rfp_quote_option_id is not null or q.quote_type = 'DECLINED') "; // DECLINED quote doesn't have Option1

    public List<ClientSearchResult> findCompetitiveInfoDifferences(Collection<Long> clientIds, String product) {
        Query query = buildCompetitiveInfoDifferencesQuery(clientIds, product);
        List<Object[]> result = query.getResultList();
        List<ClientSearchResult> dtoResult = new ArrayList<>(result.size());
        for(Object[] res : result) {
            // reuse ClientSearchResult object to store and return intermediate result
            ClientSearchResult dto = new ClientSearchResult();
            dto.setCarrierId(((Number) res[0]).longValue());
            dto.setCarrierName((String) res[1]);
            dto.setCarrierDisplayName((String) res[2]);
            dto.setClientId(((Number) res[3]).longValue());
            dto.setCompetitiveVsCurrent(((Number) res[4]).floatValue());
            dtoResult.add(dto);
        }
        return dtoResult;
    }
    
    public List<ClientSearchResult> findClientsByParams(ClientSearchParams params) {
        // main client parameters
        Query query = buildClientSearchMainQuery(params);

        List<Map<String, Object>> result = query.getResultList();
        
        for(Map<String, Object> resultParams : result) {
            String quotedProducts = (String) resultParams.get("quotedProducts");
            if (quotedProducts != null) {
                String[] products = StringUtils.split(quotedProducts, ',');
                resultParams.put("quotedProducts", Arrays.asList(products));
            }
            String currentCarrierNames = (String) resultParams.get("currentCarrierNames");
            if(currentCarrierNames != null) {
                List<String> carriers = Arrays.asList(StringUtils.split(currentCarrierNames, ','));
                int kaiserIndex = carriers.indexOf(CarrierType.KAISER.name());
                if(carriers.size() == 1) {
                    resultParams.put("carrierName", carriers.get(0));
                } else if(carriers.size() == 2 && kaiserIndex > -1) {
                    // if Kaiser + Any return Any name
                    resultParams.put("carrierName", carriers.get(kaiserIndex == 0 ? 1 : 0));
                    resultParams.put("quoteType", QuoteType.KAISER.name());
                } else {
                    resultParams.put("carrierName", MULTIPLE_CARRIER);
                    resultParams.put("carrierDisplayName", MULTIPLE_CARRIER_DISPLAY_NAME);
                }
            }
            // TODO
            resultParams.put("rateBankAmount", 0f);
        }
        return ObjectMapperUtils.mapAll(result, ClientSearchResult.class);
    }

    private String formatDate(Calendar cal){
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        int day = cal.get(Calendar.DAY_OF_MONTH);
        return year + "/" + month + "/" + day;
    }
    
    private <E extends Enum<E>> List<String> toStrings(List<E> enums){
        return enums.stream().map(e -> e.name()).collect(Collectors.toList());
    }
    
    private Query buildClientSearchMainQuery(ClientSearchParams params) {
        StringBuilder queryBuilder = new StringBuilder(CLIENT_SEARCH_QUERY);

        Map<String, Object> queryParams = new HashMap<>();
        if(StringUtils.isBlank(params.getProduct())) {
            throw new BadRequestException("Missing required search param: product");
        }
        queryBuilder.append("and rfpc.category = :product ");
        queryParams.put("product", params.getProduct());
        
        // used in the main CLIENT_SEARCH_QUERY
        PlanCategory planCategory = PlanCategory.valueOf(params.getProduct());
        queryParams.put("planTypes", planCategory.getPlanTypes());
        
        if(params.getBrokerIds() != null && !params.getBrokerIds().isEmpty()) {
            queryBuilder.append("and b.broker_id in (:brokerIds) ");
            queryParams.put("brokerIds", params.getBrokerIds());
        }
        if(params.getClientStates() != null && !params.getClientStates().isEmpty()) {
            queryBuilder.append("and c.client_state in (:clientStates) ");
            queryParams.put("clientStates", toStrings(params.getClientStates()));
        }
        if(!StringUtils.isBlank(params.getClientName())) {
            queryBuilder.append("and c.client_name like :clientName ");
            queryParams.put("clientName", "%" + params.getClientName() + "%");
        }
        if(params.getEmployeeCountFrom() != null) {
            queryBuilder.append("and c.participating_employees >= (:employeeCountFrom) ");
            queryParams.put("employeeCountFrom", params.getEmployeeCountFrom());
        }
        if(params.getEmployeeCountTo() != null) {
            queryBuilder.append("and c.participating_employees <= (:employeeCountTo) ");
            queryParams.put("employeeCountTo", params.getEmployeeCountTo());
        }
        if(params.getPresaleIds() != null && !params.getPresaleIds().isEmpty()) {
            queryBuilder.append("and presales.person_id in (:presaleIds) ");
            queryParams.put("presaleIds", params.getPresaleIds());
        }
        if(params.getSaleIds() != null && !params.getSaleIds().isEmpty()) {
            queryBuilder.append("and sales.person_id in (:saleIds) ");
            queryParams.put("saleIds", params.getSaleIds());
        }
        if(params.getEffectiveDateFrom() != null && !params.getEffectiveDateFrom().isEmpty()) {
            queryBuilder.append("and DATE(c.effective_date) >= (:effectiveDateFrom) ");
            Calendar effectiveDateFrom = Calendar.getInstance();
            effectiveDateFrom.setTime(new Date(params.getEffectiveDateFrom()));
            queryParams.put("effectiveDateFrom", formatDate(effectiveDateFrom));
        }

        if(params.getEffectiveDateTo() != null && !params.getEffectiveDateTo().isEmpty()) {
            queryBuilder.append("and DATE(c.effective_date) <= (:effectiveDateTo) ");
            Calendar effectiveDateTo = Calendar.getInstance();
            effectiveDateTo.setTime(new Date(params.getEffectiveDateTo()));
            queryParams.put("effectiveDateTo", effectiveDateTo);

        }
        if(params.getProbability() != null) {
            queryBuilder.append("and prob.value = :probability ");
            queryParams.put("probability", params.getProbability());
        }
        if(params.getRateBankAmount() != null) {
            // TODO
        }
        if(params.getCarrierIds() != null && !params.getCarrierIds().isEmpty()) {
            // MySQL INSTR(str,substr) function: check if 'str' contains 'substr'
            queryBuilder.append("and INSTR(currentCarriers.names, ',') = 0 " // 1-based position
                + "and currentCarriers.names in (select car.name from carrier car where car.carrier_id in (:carrierIds)) ");
            queryParams.put("carrierIds", params.getCarrierIds());    
        } else if(params.getMultipleCarriers() != null) {
            // currentCarriers.names contains carrier names, separated by ','  
            if(params.getMultipleCarriers() == true) { 
                // two or more carriers
                queryBuilder.append("and INSTR(currentCarriers.names, ',') > 0 and INSTR(currentCarriers.names, 'KAISER') = 0 ");
            } else {
                // only one carrier
                queryBuilder.append("and INSTR(currentCarriers.names, ',') = 0 ");
            }
        }
        
        if(params.getCompetitiveInfoCarrier() != null) {
            if(params.getCompetitiveInfoCarrier().equals("ALL")) {
                queryBuilder.append("and c.client_id in ("
                    + "select distinct a.client_id from activity a " 
                    + "where a.type = 'COMPETITIVE_INFO' " 
                    + "and a.option = 'DIFFERENCE' " 
                    + "and a.carrier_id is not null "
                    + ") ");
            } else {
                // "find" the clients that have had an "competitive info" entry for the given carrier. 
                queryBuilder.append("and c.client_id in ("
                    + "select distinct a.client_id from activity a " 
                    + "inner join carrier c on c.carrier_id = a.carrier_id " 
                    + "where a.type = 'COMPETITIVE_INFO' " 
                    + "and a.option = 'DIFFERENCE' " 
                    + "and c.name = :competitiveInfoCarrier "
                    + ") ");
                queryParams.put("competitiveInfoCarrier", params.getCompetitiveInfoCarrier());
            }
        }

        if(params.getClientAttributes() != null && !params.getClientAttributes().isEmpty()) {
            queryBuilder.append("and exists (select 1 from attribute ca where ca.ref = c.client_id and ca.type = 'CLIENT' and ca.name in (:clientAttributes)) ");
            queryParams.put("clientAttributes", toStrings(params.getClientAttributes()));
        }
        if(params.getExcludeClientAttributes() != null && !params.getExcludeClientAttributes().isEmpty()) {
            queryBuilder.append("and not exists (select 1 from attribute ca where ca.ref = c.client_id and ca.type = 'CLIENT' and ca.name in (:excludeAttributes)) ");
            queryParams.put("excludeAttributes", toStrings(params.getExcludeClientAttributes()));
        }

        Query query = entityManager.createNativeQuery(queryBuilder.toString());
        if(!queryParams.isEmpty()) {
            JpaUtils.setQueryParameters(query, queryParams);
        }
        return query.unwrap(org.hibernate.query.Query.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
    }


}
