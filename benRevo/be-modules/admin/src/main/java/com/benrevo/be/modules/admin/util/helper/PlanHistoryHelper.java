package com.benrevo.be.modules.admin.util.helper;

import com.benrevo.common.util.JsonUtils;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanHistory;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.repository.PlanHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by lemdy on 7/11/17.
 */
@Component
public class PlanHistoryHelper {

    @Autowired
    public JsonUtils gson;
    
    @Autowired
    PlanHistoryRepository planHistoryRepository;

    public Long getNextBatchNumber(){
        List<Long> batchNumbers = planHistoryRepository.findMaxBatchNumber();
        if(batchNumbers == null || batchNumbers.size() == 0){
            return 1L;
        }else {
            return batchNumbers.get(0) + 1; // sorted in descending order
        }
    }

    public void addHistory(Long batchNumber, Plan plan, PlanNameByNetwork pnn, String oldBenefits, String newBenefits) {
        PlanHistory planHistory = new PlanHistory(pnn.getPnnId(), plan.getName(),
            oldBenefits, newBenefits, batchNumber);

        planHistoryRepository.save(planHistory);
    }

    public void addRiderHistory(Long batchNumber, RiderMeta rider, String oldBenefits, String newBenefits) {
        PlanHistory planHistory = new PlanHistory(rider.getRiderMetaId(), rider.getCode(),
            oldBenefits, newBenefits, batchNumber);

        planHistoryRepository.save(planHistory);
    }
}
