/**
 * 
 */
package com.benrevo.data.persistence.repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import com.benrevo.data.persistence.entities.Broker;

/**
 * @author Santosh
 *
 */

public interface BrokerRepository extends CrudRepository<Broker, Long> {
	Broker findByBrokerToken(String brokerToken);

	Broker findByName(String name);

	Broker findByNameIgnoreCase(String name);
	
	List<Broker> findByGeneralAgent(boolean isGeneralAgent);
	
	@Query("select bpr.broker from BrokerPersonRelation bpr where bpr.person.personId = :presonId")
	List<Broker> findByPerson(@Param("presonId") Long presonId);
	
	// underscore specify the email property of Sales/Presales
	
	@Query("select bpr.broker from BrokerPersonRelation bpr "
        + "where lower(bpr.person.email) = lower(:salesEmail) and bpr.person.type in ('SALES','SALES_RENEWAL')")
    List<Broker> findBySales_EmailIgnoreCase(@Param("salesEmail") String salesEmail);
	
	@Query("select bpr.broker from BrokerPersonRelation bpr "
        + "where lower(bpr.person.email) = lower(:presalesEmail) and bpr.person.type = 'PRESALES'")
    List<Broker> findByPresales_EmailIgnoreCase(@Param("presalesEmail") String presalesEmail);
	
	@Query("select bpr.broker from BrokerPersonRelation bpr "
        + "where (lower(bpr.person.email) = lower(:presalesEmail) and bpr.person.type = 'PRESALES') "
        + "or (lower(bpr.person.email) = lower(:salesEmail) and bpr.person.type = 'SALES')")
    List<Broker> findByPresales_EmailOrSales_EmailAllIgnoreCase(
        @Param("presalesEmail") String presalesEmail, @Param("salesEmail") String salesEmail);
}
