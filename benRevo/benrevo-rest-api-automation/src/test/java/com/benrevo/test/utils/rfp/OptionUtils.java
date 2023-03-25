package com.benrevo.test.utils.rfp;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.test.utils.CommonUtils;

import java.util.ArrayList;
import java.util.Random;

public class OptionUtils {

	private static final Random RANDOM = new Random();
	private static final String[] PLAN = {"HMO", "PPO", "HSA"};
	private static final String[] D_PLAN = {"DHMO", "DPPO"};
	
	/**
	 * Generate an option with sudo random values.
	 * @param rfpDto
	 * @return
	 */
	public static OptionDto getRandomOptionDto(RfpDto rfpDto) {
		OptionDto optionDto = new OptionDto();
		optionDto.setRfpId(rfpDto.getId());
		optionDto.setPlanType(getRandomPlanTypeAccordingToProduct(rfpDto));
		optionDto.setLabel(getRandomPlanLabel());
		optionDto.setOutOfStateContribution(CommonUtils.getRandomBooleanValue());
		optionDto.setOutOfStateRate(CommonUtils.getRandomBooleanValue());
		optionDto.setOutOfStateRenewal(CommonUtils.getRandomBooleanValue());
		setTierContributions(rfpDto, optionDto);
		setTierRates(rfpDto, optionDto);
		setTierRenewalRates(rfpDto, optionDto);
		setCensusNumbers(rfpDto, optionDto);
		optionDto.setMatchCurrent(CommonUtils.getRandomBooleanValue());
		optionDto.setMatchCurrent(CommonUtils.getRandomBooleanValue());
		optionDto.setAltRequest(getAltRequest());
		
		return optionDto;
	}
	
	public static ArrayList<OptionDto> randomizeOptions(ArrayList<OptionDto> optionList, RfpDto rfpDto) {
		ArrayList<OptionDto> newOptions = new ArrayList<OptionDto>();
		for (int i = 0; i<optionList.size(); i++) {
			OptionDto optionDto = getRandomOptionDto(rfpDto);
			optionDto.setId(optionList.get(i).getId());
			optionDto.setRfpId(optionList.get(i).getRfpId());
			newOptions.add(optionDto);
		}
		return newOptions;
	}

	public static String getRandomPlanTypeAccordingToProduct(RfpDto rfpDto) {
		if (rfpDto != null && rfpDto.getProduct() != null) {

			if (rfpDto.getProduct().equals(Constants.MEDICAL)) {
				
				int index = RANDOM.nextInt(3);
				return PLAN[index];
			} else if (rfpDto.getProduct().equals(Constants.DENTAL)) {
				
				int index = RANDOM.nextInt(2);
				return D_PLAN[index];
			} else if (rfpDto.getProduct().equals(Constants.VISION)) {
				return "VISION";
			}
		}
		return null;
	}

	private static String getRandomPlanLabel() {
		StringBuilder builder = new StringBuilder();
		builder.append("label ");
		builder.append(RANDOM.nextInt(9999)+11);
		return builder.toString();
	}
	
	private static Double getRandomTierContribution() {
		Double d = RANDOM.nextDouble();
		return new Double(RANDOM.nextInt(200)+50+d);
	}

	/**
	 * Randomly sets the employer contribution for all tier configurations
	 * @param rfpDto
	 * @param optionDto
	 */
	private static void setTierContributions(RfpDto rfpDto, OptionDto optionDto) {
		if (rfpDto != null) {
			if (rfpDto.getRatingTiers() != null) {
				switch (rfpDto.getRatingTiers()) {
				case 1:
					optionDto.setTier1Contribution(getRandomTierContribution());
					break;
				case 2:
					optionDto.setTier1Contribution(getRandomTierContribution());
					optionDto.setTier2Contribution(getRandomTierContribution());
					break;
				case 3:
					optionDto.setTier1Contribution(getRandomTierContribution());
					optionDto.setTier2Contribution(getRandomTierContribution());
					optionDto.setTier3Contribution(getRandomTierContribution());
					break;
				case 4:
					optionDto.setTier1Contribution(getRandomTierContribution());
					optionDto.setTier2Contribution(getRandomTierContribution());
					optionDto.setTier3Contribution(getRandomTierContribution());
					optionDto.setTier4Contribution(getRandomTierContribution());
					break;
				}
				if (optionDto.isOutOfStateContribution()) {
					switch (rfpDto.getRatingTiers()) {
					case 1:
						optionDto.setTier1OosContribution(getRandomTierContribution());
						break;
					case 2:
						optionDto.setTier1OosContribution(getRandomTierContribution());
						optionDto.setTier2OosContribution(getRandomTierContribution());
						break;
					case 3:
						optionDto.setTier1OosContribution(getRandomTierContribution());
						optionDto.setTier2OosContribution(getRandomTierContribution());
						optionDto.setTier3OosContribution(getRandomTierContribution());
						break;
					case 4:
						optionDto.setTier1OosContribution(getRandomTierContribution());
						optionDto.setTier2OosContribution(getRandomTierContribution());
						optionDto.setTier3OosContribution(getRandomTierContribution());
						optionDto.setTier4OosContribution(getRandomTierContribution());
						break;
					}
				}
			}
		}
	}

	/**
	 * Get a rate that is greater than or equal to contribution
	 * @param contribution
	 * @return
	 */
	private static Double getTierRate(Double contribution) {
		return new Double(RANDOM.nextInt(15)+contribution);
	}

	/**
	 * Randomly sets the current rates for all tier configurations based on employer contribution
	 * @param rfpDto
	 * @param optionDto
	 */
	private static void setTierRates(RfpDto rfpDto, OptionDto optionDto) {
		if (rfpDto != null) {
			if (rfpDto.getRatingTiers() != null) {
				switch (rfpDto.getRatingTiers()) {
				case 1:
					optionDto.setTier1Rate(getTierRate(optionDto.getTier1Contribution()));
					break;
				case 2:
					optionDto.setTier1Rate(getTierRate(optionDto.getTier1Contribution()));
					optionDto.setTier2Rate(getTierRate(optionDto.getTier2Contribution()));
					break;
				case 3:
					optionDto.setTier1Rate(getTierRate(optionDto.getTier1Contribution()));
					optionDto.setTier2Rate(getTierRate(optionDto.getTier2Contribution()));
					optionDto.setTier3Rate(getTierRate(optionDto.getTier3Contribution()));
					break;
				case 4:
					optionDto.setTier1Rate(getTierRate(optionDto.getTier1Contribution()));
					optionDto.setTier2Rate(getTierRate(optionDto.getTier2Contribution()));
					optionDto.setTier3Rate(getTierRate(optionDto.getTier3Contribution()));
					optionDto.setTier4Rate(getTierRate(optionDto.getTier4Contribution()));
					break;
				}
				if (optionDto.isOutOfStateRate() && optionDto.isOutOfStateContribution()) {
					switch (rfpDto.getRatingTiers()) {
					case 1:
						optionDto.setTier1OosRate(getTierRate(optionDto.getTier1OosContribution()));
						break;
					case 2:
						optionDto.setTier1OosRate(getTierRate(optionDto.getTier1OosContribution()));
						optionDto.setTier2OosRate(getTierRate(optionDto.getTier2OosContribution()));
						break;
					case 3:
						optionDto.setTier1OosRate(getTierRate(optionDto.getTier1OosContribution()));
						optionDto.setTier2OosRate(getTierRate(optionDto.getTier2OosContribution()));
						optionDto.setTier3OosRate(getTierRate(optionDto.getTier3OosContribution()));
						break;
					case 4:
						optionDto.setTier1OosRate(getTierRate(optionDto.getTier1OosContribution()));
						optionDto.setTier2OosRate(getTierRate(optionDto.getTier2OosContribution()));
						optionDto.setTier3OosRate(getTierRate(optionDto.getTier3OosContribution()));
						optionDto.setTier4OosRate(getTierRate(optionDto.getTier4OosContribution()));
						break;
					}
				}
			}
		}
	}

	private static Double getTierRenewalRate(Double currentRate) {
		int percent = RANDOM.nextInt(10)+1;
		Double additionalAmount = new Double((currentRate*percent)/100.0);
		return new Double(currentRate+additionalAmount);
	}

	/**
	 * Randomly sets the renewal rates for all tier configurations based on current rates
	 * @param rfpDto
	 * @param optionDto
	 */
	private static void setTierRenewalRates(RfpDto rfpDto, OptionDto optionDto) {
		if (rfpDto != null) {
			if (rfpDto.getRatingTiers() != null) {
				switch (rfpDto.getRatingTiers()) {
				case 1:
					optionDto.setTier1Renewal(getTierRenewalRate(optionDto.getTier1Rate()));
					break;
				case 2:
					optionDto.setTier1Renewal(getTierRenewalRate(optionDto.getTier1Rate()));
					optionDto.setTier2Renewal(getTierRenewalRate(optionDto.getTier2Rate()));
					break;
				case 3:
					optionDto.setTier1Renewal(getTierRenewalRate(optionDto.getTier1Rate()));
					optionDto.setTier2Renewal(getTierRenewalRate(optionDto.getTier2Rate()));
					optionDto.setTier3Renewal(getTierRenewalRate(optionDto.getTier3Rate()));
					break;
				case 4:
					optionDto.setTier1Renewal(getTierRenewalRate(optionDto.getTier1Rate()));
					optionDto.setTier2Renewal(getTierRenewalRate(optionDto.getTier2Rate()));
					optionDto.setTier3Renewal(getTierRenewalRate(optionDto.getTier3Rate()));
					optionDto.setTier4Renewal(getTierRenewalRate(optionDto.getTier4Rate()));
					break;
				}
				if (optionDto.isOutOfStateRenewal() && optionDto.isOutOfStateRate() && optionDto.isOutOfStateContribution()) {
					switch (rfpDto.getRatingTiers()) {
					case 1:
						optionDto.setTier1OosRenewal(getTierRenewalRate(optionDto.getTier1OosRate()));
						break;
					case 2:
						optionDto.setTier1OosRenewal(getTierRenewalRate(optionDto.getTier1OosRate()));
						optionDto.setTier2OosRenewal(getTierRenewalRate(optionDto.getTier2OosRate()));
						break;
					case 3:
						optionDto.setTier1OosRenewal(getTierRenewalRate(optionDto.getTier1OosRate()));
						optionDto.setTier2OosRenewal(getTierRenewalRate(optionDto.getTier2OosRate()));
						optionDto.setTier3OosRenewal(getTierRenewalRate(optionDto.getTier3OosRate()));
						break;
					case 4:
						optionDto.setTier1OosRenewal(getTierRenewalRate(optionDto.getTier1OosRate()));
						optionDto.setTier2OosRenewal(getTierRenewalRate(optionDto.getTier2OosRate()));
						optionDto.setTier3OosRenewal(getTierRenewalRate(optionDto.getTier3OosRate()));
						optionDto.setTier4OosRenewal(getTierRenewalRate(optionDto.getTier4OosRate()));
						break;
					}
				}
			}
		}
	}

	private static Double generateRandomCensusDouble() {
		Double d = new Double(RANDOM.nextDouble());
		int x = RANDOM.nextInt(25) +1;
		return new Double(x+d);
	}
	
	/**
	 * Set the enrollment numbers
	 * @param rfpDto
	 * @param optionDto
	 */
	private static void setCensusNumbers(RfpDto rfpDto, OptionDto optionDto) {
		if (rfpDto != null) {
			if (rfpDto.getRatingTiers() != null) {
				switch (rfpDto.getRatingTiers()) {
				case 1:
					optionDto.setTier1Census(generateRandomCensusDouble());
					break;
				case 2:
					optionDto.setTier1Census(generateRandomCensusDouble());
					optionDto.setTier2Census(generateRandomCensusDouble());
					break;
				case 3:
					optionDto.setTier1Census(generateRandomCensusDouble());
					optionDto.setTier2Census(generateRandomCensusDouble());
					optionDto.setTier3Census(generateRandomCensusDouble());
					break;
				case 4:
					optionDto.setTier1Census(generateRandomCensusDouble());
					optionDto.setTier2Census(generateRandomCensusDouble());
					optionDto.setTier3Census(generateRandomCensusDouble());
					optionDto.setTier4Census(generateRandomCensusDouble());
					break;
				}
			}
		}
	}
	
	/**
	 * generate an alt request comment with random number appended.
	 * @return
	 */
	private static String getAltRequest() {
		StringBuilder builder = new StringBuilder();
		builder.append("This is Alternate request number ");
		builder.append(RANDOM.nextInt(999));
		return builder.toString();
	}
}
