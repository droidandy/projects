/**
 * 
 */
package com.benrevo.data.persistence.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.benrevo.data.persistence.entities.Timeline;

public interface TimelineRepository extends CrudRepository<Timeline, Long> {

	List<Timeline> findByClientIdAndCarrierIdOrderByRefNumAsc(Long clientId, Long carrierId);
	
	@Query("select t from Timeline t"
            + " where t.carrierId = :carrierId" 
            + " and t.projectedTime <= :projectedTime"
            + " and t.overdueNotificationTime is null"
            + " and (t.completed is null or t.completed = FALSE)")
	List<Timeline> findOverduesByCarrierIdAndProjectedTime(@Param("carrierId") Long carrierId, @Param("projectedTime") Date projectedTime);
}
