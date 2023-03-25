package com.benrevo.be.modules.presentation.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.AdministrativeFeeService;
import com.benrevo.common.Constants;
import com.benrevo.data.persistence.entities.AdministrativeFee;
import com.benrevo.data.persistence.entities.Carrier;

// TODO create base test class: AbstractServiceTest
public class AdministrativeFeeServiceTest extends AbstractControllerTest {

    @Autowired
    private AdministrativeFeeService administrativeFeeService;

    @Override
	public void init() {
    	
	}
 
    @Test
    public void getDefaultAdministrativeFee() throws Exception {
        Carrier uhc = testEntityHelper.createTestCarrier(Constants.UHC_CARRIER, Constants.UHC_CARRIER);
        AdministrativeFee fee = administrativeFeeService.getDefault(uhc.getCarrierId());
        assertThat(fee).isNotNull();
        assertThat(fee.getName()).isEqualTo(Constants.DEFAULT_ADMINISTRATIVE_FEE_UHC);
        
        Carrier anthem = testEntityHelper.createTestCarrier(Constants.ANTHEM_CARRIER, Constants.ANTHEM_CARRIER);
        fee = administrativeFeeService.getDefault(anthem.getCarrierId());
        assertThat(fee).isNotNull();
        assertThat(fee.getName()).isEqualTo(Constants.DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_BLUE_CROSS);
        
        Carrier cValue = testEntityHelper.createTestCarrier(Constants.ANTHEM_CLEAR_VALUE_CARRIER, Constants.ANTHEM_CLEAR_VALUE_CARRIER);
        fee = administrativeFeeService.getDefault(cValue.getCarrierId());
        assertThat(fee).isNotNull();
        assertThat(fee.getName()).isEqualTo(Constants.DEFAULT_ADMINISTRATIVE_FEE_ANTHEM_CLEAR_VALUE);
    }
}
