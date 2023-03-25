package com.benrevo.be.modules.shared.service;

import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.MathUtils.round;

import static com.benrevo.common.Constants.DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_BLUE_CROSS;
import static com.benrevo.common.Constants.DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_CLEAR_VALUE;
import static com.benrevo.common.Constants.DEFAULT_ADMINISTRATIVE_FEE_UHC;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.benrevo.common.Constants;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.AdministrativeFee;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.repository.AdministrativeFeeRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;

@Service
@Transactional
public class AdministrativeFeeService {
	
    @Autowired
    private AdministrativeFeeRepository administrativeFeeRepository;

    @Autowired
    private CarrierRepository carrierRepository;

    public Float calcAdministrativeFee(RfpQuoteOptionNetwork optNetwork, String planType) {
    	Float administrativeFee = 0f;
        if("HSA".equalsIgnoreCase(planType)) {
        	AdministrativeFee fee = optNetwork.getAdministrativeFee();
        	if(fee != null) {
        		administrativeFee = fee.getValue() * (optNetwork.getTier1Census() 
            			+ optNetwork.getTier2Census() + optNetwork.getTier3Census() + optNetwork.getTier4Census());
        	}
        }
        return round(administrativeFee, 2);
    }
    
    public AdministrativeFee findById(Long administrativeFeeId) {
    	AdministrativeFee fee = administrativeFeeRepository.findOne(administrativeFeeId);
    	if(fee == null) {
            throw new NotFoundException("AdministrativeFee not found")
                .withFields(field("administrative_fee_id", administrativeFeeId));
        }
    	return fee;
    }
    
    public AdministrativeFee getDefault(Long carrierId) {
    	AdministrativeFee defaultFee = null;
    	Carrier carrier = carrierRepository.findOne(carrierId);
    	switch (carrier.getName()) {
		case Constants.UHC_CARRIER:
			defaultFee = administrativeFeeRepository.findByCarrierCarrierIdAndName(carrierId, DEFAULT_ADMINISTRATIVE_FEE_UHC);
			break;
		case Constants.ANTHEM_CARRIER:
			defaultFee = administrativeFeeRepository.findByCarrierCarrierIdAndName(carrierId, DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_BLUE_CROSS);
			break;
		case Constants.ANTHEM_CLEAR_VALUE_CARRIER:
			defaultFee = administrativeFeeRepository.findByCarrierCarrierIdAndName(carrierId, DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_CLEAR_VALUE);
			break;
		}
    	return defaultFee;
    }
}
