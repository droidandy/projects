package com.benrevo.be.modules.rfp.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.BaseControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AdministrativeFeeDto;
import com.benrevo.common.dto.CarrierByProductDto;
import com.benrevo.common.dto.CarrierDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.data.persistence.entities.Carrier;
import com.google.common.collect.Sets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class CarrierControllerTest extends BaseControllerTest {

	@Autowired
	private CarrierController carrierController;   
	
	@Override
	protected Object getController() {
		return carrierController;
	}
	
	private Set<String> TEST_CARRIERS = Sets.newHashSet("ANTHEM_BLUE_CROSS", "UHC", "AETNA", "KAISER", "BLUE_SHIELD");
	
	@Test
	public void getAllCarriersByCategory() throws Exception {	
				
		for (String carrierName : TEST_CARRIERS) {
			testEntityHelper.createTestRfpCarrier(carrierName, Constants.MEDICAL);
			testEntityHelper.createTestRfpCarrier(carrierName, Constants.DENTAL);
			testEntityHelper.createTestRfpCarrier(carrierName, Constants.VISION);
            testEntityHelper.createTestRfpCarrier(carrierName, Constants.LIFE);
            testEntityHelper.createTestRfpCarrier(carrierName, Constants.STD);
            testEntityHelper.createTestRfpCarrier(carrierName, Constants.LTD);
		}

		String response = performGet("/v1/carriers/product/all", EMPTY);
		CarrierByProductDto result = gson.fromJson(response, CarrierByProductDto.class);

		assertThat(result.getMedical()).isNotEmpty();
		checkSortedAlphabetical(result.getMedical());
		assertThat(result.getDental()).isNotEmpty();
		checkSortedAlphabetical(result.getDental());
		assertThat(result.getVision()).isNotEmpty();
		checkSortedAlphabetical(result.getVision());

        assertThat(result.getLife()).isNotEmpty();
        assertThat(result.getStd()).isNotEmpty();
        assertThat(result.getLife()).isNotEmpty();
	}
	
	@Test
    public void getCarriersNetworks() throws Exception {   

        String response = performGet("/v1/carriers/networks", EMPTY);
        CarrierDto[] result = gson.fromJson(response, CarrierDto[].class);

        result = Arrays.stream(result)
            .filter(c -> c.getName().equals(CarrierType.UHC.name()) 
                 || c.getName().equals(CarrierType.ANTHEM_BLUE_CROSS.name()))
            .toArray(CarrierDto[]::new);
        
        assertThat(result).isNotEmpty();
        for(CarrierDto c : result) {
            assertThat(c.getNetworks()).isNotEmpty();
        }
    }
	
	
	@Test
	public void getCarriersAdministrativeFees() throws Exception {	
				
		Carrier uhc = testEntityHelper.createTestCarrier(Constants.UHC_CARRIER, Constants.UHC_CARRIER);
		Carrier anthem = testEntityHelper.createTestCarrier(Constants.ANTHEM_CARRIER, Constants.ANTHEM_CARRIER);
		
//		AdministrativeFee fee2 = testEntityHelper.createTestAdministrativeFee(uhc, "fee2", 2.0f);
//		AdministrativeFee fee1 = testEntityHelper.createTestAdministrativeFee(uhc, "fee1", 1.0f);
//		AdministrativeFee fee3 = testEntityHelper.createTestAdministrativeFee(anthem, "fee3", 3.0f);

		String response = performGet("/v1/carriers/{id}/fees", EMPTY, uhc.getCarrierId());
		AdministrativeFeeDto[] result = gson.fromJson(response, AdministrativeFeeDto[].class);

		assertThat(result).hasSize(2);
		for (AdministrativeFeeDto fee : result) {
			assertThat(fee).hasNoNullFieldsOrProperties();
		}
		// check ordered by name
//		assertThat(result[0].getName()).isEqualTo(fee1.getName());
//		assertThat(result[1].getName()).isEqualTo(fee2.getName());
	}
	
	
	private void checkSortedAlphabetical(List<CarrierDto> carrierList) {
		List<CarrierDto> sorted = new ArrayList<CarrierDto>(carrierList);
		sorted.sort((c1, c2) -> c1.getDisplayName().compareTo(c2.getDisplayName()));
		for (int i = 0; i < carrierList.size(); i += 2) {
			if (TEST_CARRIERS.contains(carrierList.get(i).getName())) {
				assertThat(carrierList.get(i).getDisplayName()).isEqualTo(sorted.get(i).getDisplayName());
			}
		}
	}
}
