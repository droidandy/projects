package com.benrevo.test.utils.rfp;

import com.benrevo.common.dto.CarrierHistoryDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.test.utils.CommonUtils;

import java.util.ArrayList;
import java.util.Random;

public class CarrierHistoryUtils {

	private static final Random RANDOM = new Random();
	
	public static CarrierHistoryDto getRandomCarrierHistory(RfpDto rfpDto) {
		CarrierHistoryDto carrierHistoryDto = new CarrierHistoryDto();
		carrierHistoryDto.setName(generateName());
		carrierHistoryDto.setYears(getRandomNumberOfYears());
		carrierHistoryDto.setCurrent(CommonUtils.getRandomBooleanValue());
		carrierHistoryDto.setRfpId(rfpDto.getId());
		
		return carrierHistoryDto;
	}
	
	public static ArrayList<CarrierHistoryDto> randomizeCarrierHistories(ArrayList<CarrierHistoryDto> carrierHistoryList, RfpDto rfpDto) {
		ArrayList<CarrierHistoryDto> newCarrierHistories = new ArrayList<CarrierHistoryDto>();
		for (int i = 0; i<carrierHistoryList.size(); i++) {
			CarrierHistoryDto carrierHistoryDto = getRandomCarrierHistory(rfpDto);
			carrierHistoryDto.setId(carrierHistoryList.get(i).getId());
			carrierHistoryDto.setRfpId(carrierHistoryList.get(i).getRfpId());
			newCarrierHistories.add(carrierHistoryDto);
		}
		return newCarrierHistories;
	}
	
	private static String generateName() {
		String[] carriers = {"Aetna", "Anthem Blue Cross", "Blue Shield", "Cigna", 
				"Healthnet","Kaiser","Sharp Health Plans","United Healthcare","Other"};
		int index = RANDOM.nextInt(carriers.length);
		return carriers[index];
	}
	
	private static int getRandomNumberOfYears() {
		return RANDOM.nextInt(25)+1;
	}
}


