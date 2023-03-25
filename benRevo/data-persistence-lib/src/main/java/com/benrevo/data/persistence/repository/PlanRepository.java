/**
 * 
 */
package com.benrevo.data.persistence.repository;

import org.springframework.data.repository.CrudRepository;

import com.benrevo.data.persistence.entities.Plan;

import java.util.List;

public interface PlanRepository extends CrudRepository<Plan, Long> {
	
    Plan findByCarrierCarrierIdAndPlanTypeAndNameAndPlanYear(Long carrierId, String planType, String name, Integer planYear);

    List<Plan> findByPlanTypeAndName(String planType, String name);
}
