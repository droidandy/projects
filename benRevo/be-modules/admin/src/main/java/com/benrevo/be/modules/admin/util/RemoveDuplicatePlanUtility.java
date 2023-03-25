package com.benrevo.be.modules.admin.util;

import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by ojas.sitapara on 7/18/17.
 */
@Component
public class RemoveDuplicatePlanUtility {

    private static final Logger logger = LoggerFactory.getLogger(RemoveDuplicatePlanUtility.class);

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    HashMap<String, Plan> planCountHashMap = new HashMap<String, Plan>();
    List<Plan> dupPlans = new ArrayList<Plan>();

    /**
     *
     * @return
     */
    public int run() {

        // get all the plans
        Iterable<Plan> allPlans = planRepository.findAll();

        //find all the duplicates
        for(Plan plan : allPlans) {

            String key = plan.getName() + plan.getPlanType();
            if(planCountHashMap.containsKey(key)){
                //we found a second, add the name to duplicate
                dupPlans.add(planCountHashMap.get(key)); //add the first plan found into the list
            }
            else {
                planCountHashMap.put(key, plan);
            }
        }

        int deleteCount = 0;
        boolean dontDelete;
        //update reference to point to one plan
        for(Plan firstDuplicate : dupPlans) {
            dontDelete = false;
            //networks associated with firstDuplicate
            List<PlanNameByNetwork> firstDuplicatePnn = planNameByNetworkRepository.findByPlanPlanId(firstDuplicate.getPlanId());

            if(0 == firstDuplicatePnn.size()) {
                dontDelete = true;
            }

            //let's do this!
            //find all plans with same name (include firstDuplicate)
            List<Plan> dbPlans = planRepository.findByPlanTypeAndName(firstDuplicate.getPlanType(), firstDuplicate.getName());

            for(Plan dbPlan : dbPlans) {
                if(firstDuplicate.getPlanId().equals(dbPlan.getPlanId())) {
                    continue;
                }

                if(null == dbPlan.getName() || dbPlan.getName().isEmpty()) {
                    continue;
                }

                //get all pnn that have this plan_id
                List<PlanNameByNetwork> pnns = planNameByNetworkRepository.findByPlanPlanId(dbPlan.getPlanId());

                //update all tables that point to this pnn
                for (PlanNameByNetwork pnn : pnns) {

                    if(null == firstDuplicatePnn || 0 == firstDuplicatePnn.size() || firstDuplicatePnn.get(0).equals(pnn.getPnnId())) {
                        dontDelete = true;
                        continue;
                    }

                    //client_plan
                    clientPlanRepository.findByPnn(pnn).stream()
                        .forEach(cp -> {
                            System.out.println("Updating PNN client_plan: " + cp.getPnn().getPlan().getName() + " to " + firstDuplicate.getName());
                            cp.setPnn(firstDuplicatePnn.get(0));
                            clientPlanRepository.save(cp);
                        });

                    clientPlanRepository.findByRxPnn(pnn).stream()
                            .forEach(cp -> {
                                System.out.println("Updating RX for client_plan");
                                cp.setRxPnn(firstDuplicatePnn.get(0));
                                clientPlanRepository.save(cp);
                            });

                    //rfp_quote_network_plan
                    rfpQuoteNetworkPlanRepository.findByPnn(pnn).stream()
                        .forEach(rqnp -> {
                            System.out.println("Updating PNN rfpQuoteNetworkPlan " + rqnp.getPnn().getPnnId() + "," + rqnp.getPnn().getPlan().getPlanId() + " to " + firstDuplicate.getPlanId());
                            rqnp.setPnn(firstDuplicatePnn.get(0));
                            rfpQuoteNetworkPlanRepository.save(rqnp);
                        });

                    planNameByNetworkRepository.delete(pnn);
                    System.out.println("Deleting pnn: " + pnn.getName());
                }

                if(!dontDelete) {
                    deletePlan(dbPlan);
                    System.out.println("Deleting plan: " + dbPlan.getName());
                    deleteCount++;
                }
            }
        }
        return deleteCount;
    }

    private void deletePlan(Plan dbPlan) {
        //delete benefits
        List<Benefit> benefits = benefitRepository.findByPlanId(dbPlan.getPlanId());
        benefitRepository.delete(benefits);

        //delete plan
        planRepository.delete(dbPlan);
    }
}
