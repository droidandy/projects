/**
 * 
 */
package com.benrevo.data.persistence.repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import com.benrevo.common.dto.ClientRenewalDto;
import com.benrevo.common.dto.OnBoardingClientDto;
import com.benrevo.common.enums.ClientState;
import com.benrevo.data.persistence.entities.Client;

public interface ClientRepository extends CrudRepository<Client, Long> {

    Client findByClientTokenAndClientIdNot(String clientToken, Long clientId);

	List<Client> findByBrokerBrokerIdAndCarrierOwnedIsFalse(Long brokerId);

	List<Client> findByClientNameAndBrokerBrokerIdAndCarrierOwned(String name, Long brokerId, boolean carrierOwned);

	List<Client> findByClientIdAndBrokerBrokerId(Long clientId, Long brokerId);

	List<Client> findByClientNameIgnoreCaseContainingAndCarrierOwnedIsFalse(String clientName);
	
	@Query(value = "select new com.benrevo.common.dto.OnBoardingClientDto("
            + "c.clientId, c.clientName, c.clientState, c.effectiveDate, "
            + "coalesce(cpr.person.fullName, bpr.person.fullName), "
            + "cast(round(100.0 * sum(t.completed)/count(*)) as java.lang.Integer), "            
            + "max(t.completedTime), "
            + "(count(ca.name) > 0)) "
            + "from Client c "
            + "inner join c.broker b "
            + "left join Timeline t on c.clientId = t.clientId "
            + "left join b.persons bpr on bpr.person.type = 'SALES' " 
            + "left join c.persons cpr on cpr.person.type = 'SALES' " 
            + "left join c.attributes ca "
            + "where c.clientState in (:states) "
            + "and c.carrierOwned = false "
            + "and (t.carrierId = :carrierId or t.carrierId is null) "
            + "and (ca.name = 'TIMELINE_IS_ENABLED' or ca.name is null) "
            + "group by c.clientId, c.clientName, c.clientState, c.effectiveDate, cpr.person.fullName, bpr.person.fullName")
	List<OnBoardingClientDto> findOnBoardingClients(@Param("carrierId") Long carrierId, @Param("states") List<ClientState> clientStates);
	
	@Modifying
	@Query(value = "update client c set c.client_state = 'CLOSED' "
    	    + "where c.client_state <> 'CLOSED' "
            + "and c.client_state <> 'SOLD' "
            + "and c.client_state <> 'ON_BOARDING' "
            + "and c.client_state <> 'PENDING_APPROVAL' "
    	    + "and c.effective_date is not null "
    	    + "and c.effective_date < NOW()", nativeQuery = true)
	void updateClientStateToClosed();
	
	List<Client> findByCarrierOwnedAndClientStateIn(boolean carrierOwned, Collection<ClientState> list);

	@Query("select new com.benrevo.common.dto.ClientRenewalDto(c.clientId, c.clientName, c.effectiveDate, c.clientState) " 
            + "from Client c "
            + "inner join ClientAttribute ca1 on ca1.client.clientId = c.clientId and ca1.name = 'TOP_CLIENT' "
            +     "and TYPE(ca1) = 'CLIENT' " 
            + "inner join ClientAttribute ca2 on ca2.client.clientId = c.clientId and ca2.name = 'RENEWAL' "
            +     "and TYPE(ca2) = 'CLIENT' " 
            + "where c.carrierOwned = false ")
	List<ClientRenewalDto> findTopClientsAllBroker(Pageable page);

    @Query("select new com.benrevo.common.dto.ClientRenewalDto(c.clientId, c.clientName, c.effectiveDate, c.clientState) " 
            + "from Client c "
            + "inner join ClientAttribute ca1 on ca1.client.clientId = c.clientId and ca1.name = 'TOP_CLIENT' "
            +     "and TYPE(ca1) = 'CLIENT' " 
            + "inner join ClientAttribute ca2 on ca2.client.clientId = c.clientId and ca2.name = 'RENEWAL' "
            +     "and TYPE(ca2) = 'CLIENT' " 
            + "where c.carrierOwned = false "
            + "and c.broker.brokerId in (:brokerIds) ")
    List<ClientRenewalDto> findTopClients(@Param("brokerIds") Set<Long> brokerIds, Pageable page);

	@Query("select distinct new com.benrevo.common.dto.ClientRenewalDto(c.clientId, c.clientName, c.effectiveDate, a.value) " + 
	        "from Client c " +
            "inner join ClientAttribute ca on ca.client.clientId = c.clientId and ca.name = 'RENEWAL' and TYPE(ca) = 'CLIENT' " +
            "inner join RfpSubmission sub on sub.client.clientId = c.clientId " + 
            "inner join RfpCarrier rc on rc.rfpCarrierId = sub.rfpCarrier.rfpCarrierId and rc.category = :product " + 
	        "left join Activity a on a.clientId = c.clientId and a.latest = 1 and a.type = 'PROBABILITY' " + 
	        "where c.effectiveDate is not null " + 
	        "and c.clientState in (:clientStates) " + 
	        "order by case a.value " + 
	            "when 'LOW' then 1 " + 
	            "when 'MEDIUM' then 2 " + 
	            "when 'HIGH' then 3 " + 
	            "else 4 " + 
	        "end " )
	List<ClientRenewalDto> findClientsRenewalAtRiskAllBroker(
            @Param("product") String product, 
            @Param("clientStates") List<ClientState> clientStates,
            Pageable limit);

   @Query("select distinct new com.benrevo.common.dto.ClientRenewalDto(c.clientId, c.clientName, c.effectiveDate, a.value) " + 
            "from Client c " +
            "inner join ClientAttribute ca on ca.client.clientId = c.clientId and ca.name = 'RENEWAL' and TYPE(ca) = 'CLIENT' " +
            "inner join RfpSubmission sub on sub.client.clientId = c.clientId " + 
            "inner join RfpCarrier rc on rc.rfpCarrierId = sub.rfpCarrier.rfpCarrierId and rc.category = :product " + 
            "left join Activity a on a.clientId = c.clientId and a.latest = 1 and a.type = 'PROBABILITY' " + 
            "where c.effectiveDate is not null " + 
            "and c.clientState in (:clientStates) " + 
            "and c.broker.brokerId in (:brokerIds) " +
            "order by case a.value " + 
                "when 'LOW' then 1 " + 
                "when 'MEDIUM' then 2 " + 
                "when 'HIGH' then 3 " + 
                "else 4 " + 
            "end " )
    List<ClientRenewalDto> findClientsRenewalAtRisk(
            @Param("product") String product, 
            @Param("clientStates") List<ClientState> clientStates,
            @Param("brokerIds") Set<Long> brokerIds,
            Pageable limit);

	@Query("select distinct new com.benrevo.common.dto.ClientRenewalDto(c.clientId, c.clientName, c.effectiveDate) " + 
            "from Client c " +
            "inner join ClientAttribute ca on ca.client.clientId = c.clientId and ca.name = 'RENEWAL' and TYPE(ca) = 'CLIENT' " +
            "inner join RfpSubmission sub on sub.client.clientId = c.clientId " + 
            "inner join RfpCarrier rc on rc.rfpCarrierId = sub.rfpCarrier.rfpCarrierId and rc.category = :product " + 
            "inner join RfpQuote q  on q.rfpSubmission.rfpSubmissionId = sub.rfpSubmissionId and q.latest = 1 " + 
            "inner join RfpQuoteOption rqo on rqo.rfpQuote.rfpQuoteId = q.rfpQuoteId and rqo.rfpQuoteOptionName like 'Renewal%' " + 
            "where c.effectiveDate is not null " + 
            "and c.clientState in (:clientStates) " +
            "and c.broker.brokerId in (:brokerIds) " +
            "order by c.effectiveDate")
	List<ClientRenewalDto> findUpcomingRenewalClients(
            @Param("product") String product, 
            @Param("clientStates") List<ClientState> clientStates,
            @Param("brokerIds") Set<Long> brokerIds,
            Pageable limit);

   @Query("select distinct new com.benrevo.common.dto.ClientRenewalDto(c.clientId, c.clientName, c.effectiveDate) " + 
            "from Client c " +
            "inner join ClientAttribute ca on ca.client.clientId = c.clientId and ca.name = 'RENEWAL' and TYPE(ca) = 'CLIENT' " +
            "inner join RfpSubmission sub on sub.client.clientId = c.clientId " + 
            "inner join RfpCarrier rc on rc.rfpCarrierId = sub.rfpCarrier.rfpCarrierId and rc.category = :product " + 
            "inner join RfpQuote q  on q.rfpSubmission.rfpSubmissionId = sub.rfpSubmissionId and q.latest = 1 " + 
            "inner join RfpQuoteOption rqo on rqo.rfpQuote.rfpQuoteId = q.rfpQuoteId and rqo.rfpQuoteOptionName like 'Renewal%' " + 
            "where c.effectiveDate is not null " + 
            "and c.clientState in (:clientStates) " +
            "order by c.effectiveDate")
    List<ClientRenewalDto> findUpcomingRenewalClientsAllBroker(
            @Param("product") String product, 
            @Param("clientStates") List<ClientState> clientStates,
            Pageable limit);

}
