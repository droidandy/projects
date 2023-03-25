package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import org.springframework.data.repository.CrudRepository;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;

import java.util.List;

public interface RfpQuoteNetworkPlanRepository extends CrudRepository<RfpQuoteNetworkPlan, Long> {

    List<RfpQuoteNetworkPlan> findByRfpQuoteNetwork(RfpQuoteNetwork rqn);

    List<RfpQuoteNetworkPlan> findByRfpQuoteNetworkAndMatchPlanTrue(RfpQuoteNetwork rqn);

    RfpQuoteNetworkPlan findByRfpQuoteNetworkAndPnnName(RfpQuoteNetwork rqn, String name);

    List<RfpQuoteNetworkPlan> findByPnn(PlanNameByNetwork pnn);
}
