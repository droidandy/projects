package com.benrevo.dashboard.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import java.util.List;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.be.modules.rfp.service.RfpPlanService;
import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.repository.CarrierRepository;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemDashboardPlanService extends RfpPlanService {


    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private SharedPlanService sharedPlanService;
    
    @Override
    protected Network findNetworkUsingCarrierSpecifically(Long carrierId, String planType) {

        if(!ObjectUtils.allNotNull(carrierId , planType)){
            throw new BaseException(String.format("Parameters can't be null carrierId=%s planType=%s", carrierId, planType));
        }
        Carrier carrier = carrierRepository.findOne(carrierId);
        if(carrier == null){
            throw new BaseException(String.format("No carrier found carrierId=%s", carrierId));
        }

        String networkType = planType;
        String networkName = null;
        if(planType.equals("THMO")) {
            networkName = "Traditional Network";
            networkType = "HMO";
        } else if(planType.equals("SHMO")) {
            networkName = "Select Network";
            networkType = "HMO";
        } else if(planType.equals("PSHMO")) {
            networkName = "Priority Select Network";
            networkType = "HMO";
        } else if(planType.equals("VIVITY")) {
            networkName = "Vivity Network";
            networkType = "HMO";
        } else if(planType.equals("KAISER")) {
            carrier = carrierRepository.findByName(CarrierType.KAISER.name());
            networkName = "Kaiser HMO";
            networkType = "HMO";
        } else if(planType.equals("PPO")) {
            networkName = "PPO";
            networkType = "PPO";
        } else if(planType.equals("CDHP")) {
            networkType = "HSA";
        } else if(planType.equals("SOL")) {
            networkName = "PPO - Solution";
            networkType = "PPO";
        }

        if (networkName != null) {
            return networkRepository.findByNameAndTypeAndCarrier(networkName, networkType, carrier);
        } else {
            List<Network> networks = networkRepository.findByTypeAndCarrier(networkType, carrier);
            return (CollectionUtils.isEmpty(networks))? null : networks.get(0);
        }
    }

    @Override
    protected String convertToCarrierSpecificPlanType(String networkName, String planType) {

        switch(planType) {
            case "HMO":
                if (networkName.toUpperCase().contains("PRIORITY")) {
                    return "PSHMO";
                } else if (networkName.toUpperCase().contains("SELECT")) {
                    return "SHMO";
                } else if (networkName.toUpperCase().contains("VIVITY")) {
                    return "VIVITY";
                } else if (networkName.toUpperCase().contains("KAISER")) {
                    return "KAISER";
                } else {
                    return "THMO";
                }
            case "PPO":
                if (networkName.toUpperCase().contains("SOLUTION")) {
                    return "SOL";
                } else {
                    return "PPO";
                }
            case "HSA":
                return "CDHP";
        }

        return planType;
    }

    @Override
    protected void deleteBenefits(PlanNameByNetwork pnn) {
        // do not delete
    }

    @Override
    protected void createAndSaveBenefits(CreatePlanDto planParams, List<BenefitName> benefitNames, Network network,
            PlanNameByNetwork pnn) {
        validateBenefits(planParams.getBenefits(), pnn.getPlanType());
        sharedPlanService.updateBenefits(planParams, pnn);
    }

    private void validateBenefits(List<Benefit> benefits, String planType) {
        if ("DPPO".equals(planType)) {
            for (Benefit benefit : benefits) {
                if (benefit.restriction != null && !StringUtils.equalsAny(benefit.restriction, 
                            "Basic Service",
                            "Major Service")) {
                    throw new BadRequestException(
                            String.format("Illegal benefit restriction='%s' for planType=%s", benefit.restriction, planType));
                }
            }
        }
    }

}
