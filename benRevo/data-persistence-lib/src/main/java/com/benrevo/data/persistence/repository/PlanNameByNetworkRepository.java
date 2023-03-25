/**
 * 
 */
package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;

import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface PlanNameByNetworkRepository extends PagingAndSortingRepository<PlanNameByNetwork, Long> {

    List<PlanNameByNetwork> findByNameAndPlanType(String name, String type);

    List<PlanNameByNetwork> findByNetworkAndNameAndPlanType(Network network, String name, String type);

    List<PlanNameByNetwork> findByNetworkAndNameAndPlanTypeAndPlanPlanYear(Network network, String name, String type, int planYear);

    List<PlanNameByNetwork> findByNetworkAndNameAndPlanTypeAndPlanPlanYearAndClientIdAndCustomPlan(
        Network network, String name, String type, int planYear, Long clientId, boolean customPlan);
    
    List<PlanNameByNetwork> findByPlanCarrierAndPlanTypeAndPlanPlanYear(Carrier carrier, String type, int planYear);

    List<PlanNameByNetwork> findByPlanPlanId(Long planId);
    
    List<PlanNameByNetwork> findByNetworkNetworkId(Long networkId);

    @Query(
        value = "select distinct pnn from PlanNameByNetwork pnn " +
                "where pnn.plan.carrier = :carrier and " +
                "pnn.plan.planYear = :planYear and " +
                "pnn.customPlan = false " +
                "group by pnn.plan.planId, pnn.pnnId, pnn.plan.name " +
                "order by pnn.plan.planId desc"
    )
    Page<PlanNameByNetwork> findAllByCarrierAndPlanYearNonCustom(@Param("carrier") Carrier carrier, @Param("planYear") Integer planYear, Pageable pageable);

    @Query(
        value = "select distinct pnn from PlanNameByNetwork pnn " +
                "where pnn.plan.carrier = :carrier and " +
                "pnn.plan.planYear = :planYear and " +
                "pnn.planType = :planType and " +
                "pnn.customPlan = false " +
                "order by pnn.plan.planId desc"
    )
    Page<PlanNameByNetwork> findAllByCarrierAndPlanYearAndPlanTypeNonCustom(@Param("carrier") Carrier carrier, @Param("planYear") Integer planYear, @Param("planType") String planType, Pageable pageable);

    @Query(
        value = "select distinct pnn.planType from PlanNameByNetwork pnn " +
                "where pnn.plan.carrier = :carrier"
    )
    Set<String> findAllPlanTypesByCarrier(@Param("carrier") Carrier carrier);
}
