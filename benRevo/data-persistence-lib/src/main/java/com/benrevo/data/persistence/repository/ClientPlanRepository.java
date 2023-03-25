package com.benrevo.data.persistence.repository;

import java.util.Collection;
import java.util.List;

import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import org.springframework.data.repository.query.Param;

public interface ClientPlanRepository extends CrudRepository<ClientPlan, Long> {

	List<ClientPlan> findByClientClientId(Long clientId);

    ClientPlan findByClientClientIdAndOptionIdAndOutOfState(Long clientId, Long optionId, boolean outOfState);
    
    ClientPlan findByClientAndPnnPlanTypeAndAncillaryPlan(Client client, String planType, AncillaryPlan ancillaryPlan);
    
    List<ClientPlan> findByClientClientIdAndPnnPlanTypeIn(Long clientId, Collection<String> planTypes);

    @Query(value = "SELECT * FROM client_plan cp where cp.client_plan_id = :clientPlanId", nativeQuery = true)
    ClientPlan findClientPlan(@Param("clientPlanId") Long clientPlanId);

    List<ClientPlan> findByPnn (PlanNameByNetwork pnn);

    List<ClientPlan> findByRxPnn (PlanNameByNetwork pnn);
}
