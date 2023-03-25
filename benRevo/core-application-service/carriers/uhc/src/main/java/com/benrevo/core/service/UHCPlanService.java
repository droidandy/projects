package com.benrevo.core.service;

import static com.benrevo.common.enums.CarrierType.UHC;

import com.benrevo.be.modules.rfp.service.RfpPlanService;
import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.helper.PlanBenefitsHelper;
import com.benrevo.data.persistence.repository.BenefitRepository;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(UHC)
@Transactional
public class UHCPlanService extends RfpPlanService {

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private PlanBenefitsHelper planBenefitsHelper;
    
    @Autowired
    private SharedPlanService sharedPlanService;

    @Override
    protected void addExternalRxPlan(Network network, RFP rfp, Long optionId, String planName,
        List<BenefitName> benefitNames, List<PlanNameByNetwork> oldPnns){
        if(!PlanCategory.MEDICAL.getPlanTypes().contains(network.getType())) {
            // RX does not apply to Dental or Vision
            return;
        }
        String rxNetworkType = "RX_" + network.getType();
        PlanNameByNetwork rxPnn = findPlanNameByNetwork(oldPnns, network, planName, rxNetworkType, rfp.getClient().getClientId());
        if(rxPnn == null) {
            rxPnn = sharedPlanService.createAndSavePlanNameByNetwork(network.getCarrier(), network,
                planName, rxNetworkType, rfp.getClient().getClientId(), false, Collections.emptyList());
        } else {
            List<Benefit> oldBenefits = benefitRepository.findByPlanId(rxPnn.getPlan().getPlanId());
            benefitRepository.delete(oldBenefits);
            benefitRepository.flush();
        }
        planBenefitsHelper.addPlaceHolderBenefitsToPlan(benefitNames, network.getCarrier(), rxPnn.getPlan());
        saveRfpToPnn(rxNetworkType, rfp, rxPnn, optionId);
    }

}
