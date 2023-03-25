package com.benrevo.data.persistence.repository;

import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.common.enums.RfpQuoteAttributeName;
import com.benrevo.common.enums.RfpQuoteOptionAttributeName;
import com.benrevo.data.persistence.entities.RfpQuoteAttribute;
import com.benrevo.data.persistence.entities.RfpQuoteOptionAttribute;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import com.benrevo.common.dto.RfpQuoteOptionAttributeDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.DocumentAttributeName;
import com.benrevo.data.persistence.entities.Attribute;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.DocumentAttribute;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;

public interface AttributeRepository extends CrudRepository<Attribute, Long> {

    @Query("select ca from ClientAttribute ca where ref = :clientId and name = :name")
    ClientAttribute findClientAttributeByClientIdAndName(@Param("clientId") Long clientId, @Param("name") AttributeName name);
    
    @Query("select da from DocumentAttribute da where ref = :documentId and name = :name")
    DocumentAttribute findDocumentAttributeByDocumentIdAndName(@Param("documentId") Long documentId, @Param("name") DocumentAttributeName name);

    @Query("select qa from RfpQuoteAttribute qa where ref = :rfpQuoteId and name = :name")
    RfpQuoteAttribute findRfpQuoteAttributeByRfpQuoteIdIdAndName(@Param("rfpQuoteId") Long rfpQuoteId, @Param("name") RfpQuoteAttributeName name);

    @Query("select qa from RfpQuoteOptionAttribute qa where ref = :rfpQuoteOptionId and name = :name")
    RfpQuoteOptionAttribute findRfpQuoteOptionAttributeByRfpQuoteOptionIdAndName(@Param("rfpQuoteOptionId") Long rfpQuoteOptionId, @Param("name") RfpQuoteOptionAttributeName name);

    @Query("select qpa from QuotePlanAttribute qpa where ref = :rqnpId")
    List<QuotePlanAttribute> findQuotePlanAttributeByRqnpId(@Param("rqnpId") Long rqonId);

    @Query("select qpa from QuotePlanAttribute qpa where ref = :rqnpId and name = :name")
    QuotePlanAttribute findQuotePlanAttributeByRqnpIdAndName(@Param("rqnpId") Long rqonId, @Param("name") QuotePlanAttributeName name);

    @Query("select new com.benrevo.common.dto.RfpQuoteOptionAttributeDto(c.clientId, c.clientState, c.participatingEmployees, a.rfpQuoteOption.rfpQuoteOptionId, a.value) " +
            "from RfpQuoteOptionAttribute a " + 
            "inner join RfpQuoteOption rqo on a.rfpQuoteOption.rfpQuoteOptionId = rqo.rfpQuoteOptionId " +
                "and rqo.rfpQuoteOptionName = 'Renewal 1' " +
            "inner join RfpQuote q  on rqo.rfpQuote.rfpQuoteId = q.rfpQuoteId and q.latest = 1 " + 
            "inner join RfpSubmission sub on q.rfpSubmission.rfpSubmissionId = sub.rfpSubmissionId " +
            "inner join Client c on sub.client.clientId = c.clientId " +
                "and c.effectiveDate >= :effectiveDateFrom " +
                "and c.effectiveDate < :effectiveDateTo " +
                "and c.clientState in ('QUOTED','PENDING_APPROVAL','SOLD','ON_BOARDING','CLOSED') " +
            "inner join ClientAttribute ca on ca.client.clientId = c.clientId and ca.name = 'RENEWAL' and TYPE(ca) = 'CLIENT' " +
            "left join BrokerPersonRelation bpr on bpr.broker.brokerId = c.broker.brokerId and bpr.person.personId = :personId " +
            "left join ClientPersonRelation cpr on cpr.client.clientId = c.clientId and cpr.person.personId = :personId " +
                "where a.name = 'STARTING_TOTAL' and (cpr.id is not null or bpr.id is not null) ")
    List<RfpQuoteOptionAttributeDto> findStartingRenewalAttributeBySalesPersonId(
            @Param("personId") Long personId, 
            @Param("effectiveDateFrom") Date effectiveDateFrom,
            @Param("effectiveDateTo") Date effectiveDateTo );

    
}
