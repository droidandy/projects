package com.benrevo.data.persistence.repository;

import com.benrevo.common.dto.QuoteOptionDisclaimerDto;
import com.benrevo.common.dto.RfpQuoteDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.helper.JpaUtils;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import org.apache.commons.collections4.CollectionUtils;
import org.hibernate.transform.Transformers;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RfpQuoteRepositoryImpl extends AbstractCustomRepository implements RfpQuoteRepositoryCustom {
    private static final String QUERY_RFP_QUOTES = "SELECT NEW com.benrevo.common.dto.RfpQuoteDto(rq.rfpQuoteId, rc.rfpCarrierId, rq.quoteType, rq.ratingTiers) " +
            "FROM RfpSubmission sub, RfpCarrier rc, RfpQuote rq " +
            "WHERE rc.rfpCarrierId = sub.rfpCarrier.rfpCarrierId " +
            "AND rq.rfpSubmission.rfpSubmissionId = sub.rfpSubmissionId " +
            // no DECLINED fileter: see the RfpQuoteControllerTest.getDeclinedRfpQuotesByClientIdAndRfpCarrierId
            "AND rq.latest = 1 ";

    private static final String QUERY_RFP_QUOTES_BY_CLIENT_ID_AND_NAME = "SELECT NEW com.benrevo.common.dto.RfpQuoteDto(rq.rfpQuoteId, rc.category, rq.quoteType, rq.ratingTiers) " +
            "FROM RfpSubmission sub, RfpCarrier rc, RfpQuote rq, Carrier c " +
            "WHERE rc.rfpCarrierId = sub.rfpCarrier.rfpCarrierId " +
            "AND rq.rfpSubmission.rfpSubmissionId = sub.rfpSubmissionId " +
            "AND rc.carrier.carrierId = c.carrierId " +
            "AND sub.client.clientId = :clientId " +
            "AND c.name = :carrierName " +
            /* used in API getLatestQuotes/{clientId}/{carrierName} and possible needs to return 
             * DECLINED quoted as well
            "AND rq.quoteType <> 'DECLINED' " +*/
            "AND rq.latest = 1 ";

    private static final String RFP_CARRIER_CLIENT_ID_CLAUSE = " AND rq.rfpSubmission.client.clientId = :clientId ";
    private static final String RFP_CARRIER_ID_CLAUSE = " AND rc.rfpCarrierId = :rfpCarrierId ";
    private static final String RFP_CARRIER_CATEGORY_CLAUSE = " AND rc.category = :category ";

    @Override
    public List<RfpQuoteDto> getQuotes(Long clientId, Long rfpCarrierId, String category) {
        String queryString = buildQuoteQuery(clientId, category, rfpCarrierId);
        TypedQuery<RfpQuoteDto> query = getEntityManager().createQuery(queryString, RfpQuoteDto.class);
        if (clientId != null) {
            query.setParameter("clientId", clientId);
        }

        if (rfpCarrierId != null) {
            query.setParameter("rfpCarrierId", rfpCarrierId);
        }

        if (category != null) {
            query.setParameter("category", category);
        }
        return query.getResultList();
    }

    private String buildQuoteQuery(Long clientId, String category, Long rfpCarrierId) {
        StringBuilder queryBuilder = new StringBuilder(QUERY_RFP_QUOTES);
        if (clientId != null) {
            queryBuilder.append(RFP_CARRIER_CLIENT_ID_CLAUSE);
        }

        if (rfpCarrierId != null) {
            queryBuilder.append(RFP_CARRIER_ID_CLAUSE);
        }

        if (category != null) {
            queryBuilder.append(RFP_CARRIER_CATEGORY_CLAUSE);
        }

        return queryBuilder.toString();
    }

    @Override
    public List<RfpQuoteDto> getQuotesByClientIdAndCarrierName(Long clientId, String carrierName) {

        TypedQuery<RfpQuoteDto> query = getEntityManager().createQuery(QUERY_RFP_QUOTES_BY_CLIENT_ID_AND_NAME, RfpQuoteDto.class);
        query.setParameter("clientId", clientId);
        query.setParameter("carrierName", carrierName);
        
        return query.getResultList();
    }
    
    
    @Override
    public List<QuoteOptionDisclaimerDto> findDisclaimersByProductAndCarrier(String product, 
    		Long clientId, List<String> carrierNames) {
        StringBuilder queryBuilder = new StringBuilder(
            "select " +
                "d.rfp_quote_id as rfpQuoteId, " +
                "d.text as disclaimer, " + 
                "c.carrier_id as carrierId, " + 
                "c.name as carrierName, " + 
                ":product as product " + 
            "from (select c.carrier_id, max(q.rfp_quote_id) as rfp_quote_id from rfp_quote q " + 
                        "inner join rfp_submission sub on sub.rfp_submission_id = q.rfp_submission_id " + 
                        "inner join rfp_carrier rc on rc.rfp_carrier_id = sub.rfp_carrier_id " + 
                        "inner join carrier c on c.carrier_id = rc.carrier_id " +
                        "inner join rfp_quote_disclaimer d on d.rfp_quote_id = q.rfp_quote_id " +
                   "where rc.category = :product " +
                        "and sub.client_id = :clientId " +
                        (CollectionUtils.isNotEmpty(carrierNames) ? "and c.name in (:carrierNames) " : "") +
                    "group by c.carrier_id) lastQuote " + 
            "inner join rfp_quote_disclaimer d on d.rfp_quote_id = lastQuote.rfp_quote_id " +
            "inner join carrier c on c.carrier_id = lastQuote.carrier_id");

        Map<String, Object> queryParams = new HashMap<>();
        queryParams.put("product", product);
        queryParams.put("clientId", clientId);
        if (CollectionUtils.isNotEmpty(carrierNames) ) {
            queryParams.put("carrierNames", carrierNames);
        }

        Query query = getEntityManager().createNativeQuery(queryBuilder.toString());
        JpaUtils.setQueryParameters(query, queryParams);
     
        query = query.unwrap(org.hibernate.query.Query.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
        List<QuoteOptionDisclaimerDto> result = ObjectMapperUtils.mapAll(query.getResultList(), QuoteOptionDisclaimerDto.class);

        return result;
    }
}
