package com.benrevo.be.modules.rfp.controller;

import static com.benrevo.common.enums.CarrierType.isCarrierNameAppCarrier;
import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.rfp.controller.RfpCarrierController;
import com.benrevo.be.modules.shared.controller.BaseControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.NetworkDto;
import com.benrevo.common.dto.RfpCarrierDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.util.RequestUtils;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.RfpCarrier;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class RfpCarrierControllerTest extends BaseControllerTest {

	@Autowired
	private RfpCarrierController rfpCarrierController;   
	
	@Override
	protected Object getController() {
		return rfpCarrierController;
	}
	
	@Test
	public void getRfpCarriers() throws Exception {
		CarrierType ct = CarrierType.fromStrings(appCarrier);

		Carrier anthemCarrier = testEntityHelper.createTestCarrier(ct.name(), ct.displayName);
		testEntityHelper.createTestRfpCarrier(anthemCarrier, Constants.MEDICAL);

		String result = performGet("/v1/rfpcarriers", new Object[] {"category", Constants.MEDICAL});
		RfpCarrierDto[] resultList = gson.fromJson(result, RfpCarrierDto[].class);

		assertThat(resultList).isNotEmpty();
		final String serviceBaseUrl = RequestUtils.getServiceBaseURL();
		for (RfpCarrierDto rfpCarrierDto : resultList) {
			assertThat(rfpCarrierDto.getCategory()).isEqualTo(Constants.MEDICAL);
			assertThat(rfpCarrierDto).hasNoNullFieldsOrPropertiesExcept("endpoint");
            assertThat(rfpCarrierDto.getCarrier()).hasNoNullFieldsOrPropertiesExcept("networks");
            if(isCarrierNameAppCarrier(rfpCarrierDto.getCarrier().getName(), appCarrier)){
                assertThat(rfpCarrierDto.getCarrier().getLogoUrl()).isEqualTo(serviceBaseUrl + "/images/"  + rfpCarrierDto.getCarrier().getName() + "_APP_CARRIER.png");
                assertThat(rfpCarrierDto.getCarrier().getLogoWKaiserUrl()).isEqualTo(serviceBaseUrl + "/images/" + rfpCarrierDto.getCarrier().getName() + "_APP_CARRIER_KAISER.png");
            }else{
                assertThat(rfpCarrierDto.getCarrier().getLogoUrl()).isEqualTo(serviceBaseUrl + "/images/"  + rfpCarrierDto.getCarrier().getName() + ".png");
                assertThat(rfpCarrierDto.getCarrier().getLogoWKaiserUrl()).isEqualTo(serviceBaseUrl + "/images/" + rfpCarrierDto.getCarrier().getName() + "_KAISER.png");
            }
		}
	}
	
	@Test
	public void getRfpCarrierNetworks() throws Exception {
		Carrier carrier = testEntityHelper.createTestCarrier();
		RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);

		Network hmo = testEntityHelper.createTestNetwork(carrier, "HMO");
		Network ppo = testEntityHelper.createTestNetwork(carrier, "PPO");
		
		Network rxppo = testEntityHelper.createTestNetwork(carrier, "RX_PPO");
		
		String result = performGet("/v1/rfpcarriers/{id}/networks", new Object[] {"networkType", "HMO"}, rfpCarrier.getRfpCarrierId());
		NetworkDto[] resultList = gson.fromJson(result, NetworkDto[].class);
		assertThat(resultList).hasSize(1);
		assertThat(resultList[0]).hasNoNullFieldsOrProperties();
		assertThat(resultList[0].getNetworkId()).isEqualTo(hmo.getNetworkId());
		
		result = performGet("/v1/rfpcarriers/{id}/networks", new Object[] {"networkType", "RX_PPO"}, rfpCarrier.getRfpCarrierId());
        resultList = gson.fromJson(result, NetworkDto[].class);
        assertThat(resultList).hasSize(1);
        assertThat(resultList[0].getNetworkId()).isEqualTo(rxppo.getNetworkId());
	}
}
