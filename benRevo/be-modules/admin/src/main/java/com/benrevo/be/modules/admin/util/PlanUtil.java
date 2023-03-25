package com.benrevo.be.modules.admin.util;

import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.be.modules.admin.util.helper.PlanHistoryHelper;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.util.JsonUtils;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;


@Component
@Transactional
public class PlanUtil {

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private PlanRepository planRepository;
    
    @Autowired
    PlanHistoryHelper planHistoryHelper;
    
    @Autowired
    private JsonUtils jsonUtils;

    public PlanUtil() {}

    public List<PlanNameByNetwork> createPlans(Long clientId, boolean customPlan, Carrier carrier,
        String planType, GenericPlanDetails detail, Integer planYear, boolean persist) {

        List<PlanNameByNetwork> newPnnList = new ArrayList<>();
        PlanNameByNetwork pnn = null;

        for (String planName : detail.getPlanNames()) {
            pnn = createPlan(clientId, customPlan, carrier, planType, planName, detail, planYear, persist);
            newPnnList.add(pnn);
        }
        return newPnnList;
    }

    public PlanNameByNetwork createPlan(Long clientId, boolean customPlan, Carrier carrier,
        String planType, String planName, GenericPlanDetails detail, Integer planYear, boolean persist) {

        Network network = detail.getNetworkForPlanName(planName);
        if(null == network) {
            return null; //can't create pnn, no need to continue.
        }

        //create the plan
        Plan plan = createPlanFromDetails(carrier, planType, planName);
        if (planYear != null) {
            plan.setPlanYear(planYear);
        }
        if(persist) {
            plan = planRepository.save(plan);
        }

        //add the benefits
        for (Benefit b : detail.getBenefits()) {
            b.setPlan(plan);

            if(persist) {
                benefitRepository.save(b);
            }
        }

        //create plan name by network
        PlanNameByNetwork pnn = createPnn(clientId, customPlan, network, plan);
        if(persist) {
            planNameByNetworkRepository.save(pnn);
        }
        return pnn;
    }

    public void updatePlan(Plan existingPlan, GenericPlanDetails detail, Long batchNumber, boolean persist) {
        if (batchNumber == null) {
            batchNumber = planHistoryHelper.getNextBatchNumber();
        }
        List<Benefit> oldBenefits = benefitRepository.findByPlanId(existingPlan.getPlanId());
        for (Benefit parsedBenefit : detail.getBenefits()) {
            Benefit potentiallyChangedBenefit = null;
            for (Benefit oldBenefit : oldBenefits) {
                if(parsedBenefit.getBenefitName().getName().equalsIgnoreCase(oldBenefit.getBenefitName().getName())
                    && parsedBenefit.getInOutNetwork().equalsIgnoreCase(oldBenefit.getInOutNetwork())){

                    potentiallyChangedBenefit = oldBenefit;
                    break;
                }
            }
            if(potentiallyChangedBenefit == null) {
                // this is a new benefit being added to this plan
                Benefit newBenefit = parsedBenefit.copy();
                newBenefit.setPlan(existingPlan);

                if(persist) {
                    benefitRepository.save(newBenefit);
                    saveChangedBenefit(null, jsonUtils.toJson(parsedBenefit), batchNumber, existingPlan, detail);
                }
                LOGGER.info("    New benefit: " + newBenefit.getBenefitName().getName() + "=" + newBenefit.getValue() + "(" + newBenefit.getFormat() +")");

            } else if(didBenefitChange(parsedBenefit, potentiallyChangedBenefit)) {
                // benefit already exists and the value/format changed
                String oldBenefitString = jsonUtils.toJson(potentiallyChangedBenefit);
                potentiallyChangedBenefit.setValue(parsedBenefit.getValue());
                potentiallyChangedBenefit.setFormat(parsedBenefit.getFormat());

                if(persist) {
                    benefitRepository.save(potentiallyChangedBenefit);
                    saveChangedBenefit(oldBenefitString, jsonUtils.toJson(potentiallyChangedBenefit), batchNumber, existingPlan, detail);
                }
                LOGGER.info("    Updated benefit: " + potentiallyChangedBenefit.getBenefitName().getName() + "=" + potentiallyChangedBenefit.getValue() + "(" + potentiallyChangedBenefit.getFormat() +")");
            }
        }
    }

    private void saveChangedBenefit(String oldBenefit, String newBenefit, Long batchNumber, Plan plan, GenericPlanDetails detail){

        Map<String, Network> networkList = detail.getPlanNamesByNetwork();
        for (String pnnName : networkList.keySet()) {
            Network network = networkList.get(pnnName);
            List<PlanNameByNetwork> pnns = planNameByNetworkRepository.findByNetworkAndNameAndPlanType(network, pnnName, plan.getPlanType());

            for(PlanNameByNetwork pnn : pnns){
                planHistoryHelper.addHistory(batchNumber, plan, pnn, oldBenefit, newBenefit);
            }
        }
    }
    
    private boolean didBenefitChange(Benefit newBenefit, Benefit oldBenefit){
        return !(newBenefit.getFormat().equalsIgnoreCase(oldBenefit.getFormat()) && newBenefit.getValue().equalsIgnoreCase(oldBenefit.getValue()));
    }

    private Plan createPlanFromDetails(Carrier carrier, String planType, String planName) {
    	Plan plan = new Plan(carrier, planName, planType);
    	return plan;
    }
    
    private List<PlanNameByNetwork> createPnnFromDetails(Long clientId, boolean custom, Plan plan, GenericPlanDetails planDetails) {
    	List<PlanNameByNetwork> result = new ArrayList<>();
        Map<String, Network> networkList = planDetails.getPlanNamesByNetwork();
        // Create PlanNameByNetwork
        for (String pnnName : networkList.keySet()) {
            Network network = networkList.get(pnnName);
            PlanNameByNetwork pnn = new PlanNameByNetwork(plan, network, pnnName, plan.getPlanType());
            pnn.setClientId(clientId);
            pnn.setCustomPlan(custom);
            result.add(pnn);
        }
        return result;
    }

    private PlanNameByNetwork createPnn (Long clientId, boolean custom, Network network, Plan plan) {
        PlanNameByNetwork pnn = new PlanNameByNetwork(plan, network, plan.getName(), plan.getPlanType());
        pnn.setClientId(clientId);
        pnn.setCustomPlan(custom);
        return pnn;
    }
}
