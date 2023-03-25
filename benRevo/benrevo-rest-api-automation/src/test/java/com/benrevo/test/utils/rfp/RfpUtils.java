package com.benrevo.test.utils.rfp;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.CarrierHistoryDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.enums.ClientFileType;
import com.benrevo.test.api.BaseTest;
import com.benrevo.test.utils.CommonUtils;

import java.util.ArrayList;
import java.util.Random;

public class RfpUtils extends BaseTest {

	private static Random RANDOM = new Random();

	/**
	 * 
	 * @param clientId
	 * @param product
	 * @return RfpDto with random values
	 */
	public static RfpDto getRandomRFP(Long clientId, String product) {
		RfpDto rfpDto = new RfpDto();

		rfpDto.setId(null);
		rfpDto.setClientId(clientId);
		rfpDto.setProduct(product);
		rfpDto.setWaitingPeriod(getRandomWaitingPeriod());
		rfpDto.setPaymentMethod(getRandomPaymentMethod());
		rfpDto.setCommission(getRandomCommissionAmount());
		rfpDto.setContributionType(getRandomContributionType(rfpDto));
		rfpDto.setPriorCarrier(CommonUtils.getRandomBooleanValue());
		rfpDto.setRatingTiers(getRandomRatingTiers());
		rfpDto.setOptionCount(getRandomOptionCount());
		ArrayList<OptionDto> options = new ArrayList<OptionDto>();
		for(int i = 0; i<rfpDto.getOptionCount(); i++) {
			options.add(OptionUtils.getRandomOptionDto(rfpDto));
		}
		rfpDto.setOptions(options);

		ArrayList<CarrierHistoryDto> carriers = new ArrayList<CarrierHistoryDto>();
		carriers.add(CarrierHistoryUtils.getRandomCarrierHistory(rfpDto));
		rfpDto.setCarrierHistories(carriers);

		rfpDto.setBuyUp(CommonUtils.getRandomBooleanValue());
		rfpDto.setSelfFunding(CommonUtils.getRandomBooleanValue());
		rfpDto.setAlongside(CommonUtils.getRandomBooleanValue());
		rfpDto.setTakeOver(CommonUtils.getRandomBooleanValue());
		rfpDto.setQuoteAlteTiers(getRandomNumberOfTiers());
		rfpDto.setComments(getRandomComment());
		rfpDto.setLastUpdated(CommonUtils.getLastUpdatedTimeStamp(Constants.DATETIME_FORMAT));
		rfpDto.setLargeClaims(getLargeClaimComment());

		return rfpDto;
	}
	
	public static RfpDto modifyRfpFields(RfpDto rfpDto) {
		RfpDto newRfpDto = getRandomRFP(rfpDto.getClientId(), rfpDto.getProduct());
		newRfpDto.setId(rfpDto.getId());
		newRfpDto.setOptionCount(rfpDto.getOptionCount());
		newRfpDto.setOptions(OptionUtils.randomizeOptions((ArrayList<OptionDto>)rfpDto.getOptions(), rfpDto));
		newRfpDto.setCarrierHistories(CarrierHistoryUtils.randomizeCarrierHistories((ArrayList<CarrierHistoryDto>) rfpDto.getCarrierHistories(), rfpDto));
		return newRfpDto;
	}
	
	/**
	 * Calculate census type expected
	 * @param clientDto
	 * @param rfpDto
	 * @return
	 */
	public static ClientFileType calculateClientFileType(ClientDto clientDto, RfpDto rfpDto) {
        int totalPoints = 0;
        
        totalPoints += calculatePointsByParticipationPercentage(clientDto);
        totalPoints += calculatePointsByEmployerContribution(rfpDto);
        totalPoints += calculatePointsByCarrierHistory(rfpDto);
        totalPoints += calculatePointsByCobraEmployees(clientDto);

        return totalPoints < 10 ? ClientFileType.MEMBER : ClientFileType.SUBSCRIBER;
    }
	
	private static int calculatePointsByParticipationPercentage(ClientDto client) {
        Double participationPercentage = (double) client.getParticipatingEmployees() / client.getEmployeeCount() * 100;

        if(participationPercentage == 100) {
            return 4;
        }

        Double basePoints = -5d;
        Double result = Math.floor(participationPercentage / 10) + basePoints;

        return result.intValue();
    }
	
	private static int calculatePointsByEmployerContribution(RfpDto rfp) {
        OptionDto maxCensusOption = rfp.getOptions().stream()
            .max(
                (o1, o2) -> {
                	
                    Double result = new Double(0);
                    if (o1.getTier1Census() != null) {
                    	result = result + o1.getTier1Census();
					}
                    if (o1.getTier2Census() != null) {
                    	result = result + o1.getTier2Census();
					}
                    if (o1.getTier3Census() != null) {
                    	result = result + o1.getTier3Census();
					}
                    if (o1.getTier4Census() != null) {
                    	result = result + o1.getTier4Census();
					}
                    if (o2.getTier1Census() != null) {
                    	result = result - o2.getTier1Census();
					}
                    if (o2.getTier2Census() != null) {
                    	result = result - o2.getTier2Census();
					}
                    if (o2.getTier3Census() != null) {
                    	result = result - o2.getTier3Census();
					}
                    if (o2.getTier4Census() != null) {
                    	result = result - o2.getTier4Census();
					}

                    return result.intValue();
                }
            )
            .orElse(null);

        Double contributionRateTier1 = maxCensusOption.getTier1Contribution() / maxCensusOption.getTier1Rate() * 100;

        int resultPoints = 0;

        resultPoints += contributionRateTier1 < 20 ? -2 : 0;
        resultPoints += contributionRateTier1 >= 20 && contributionRateTier1 < 40 ? -1 : 0;
        resultPoints += contributionRateTier1 >= 50 && contributionRateTier1 < 60 ? 1 : 0;
        resultPoints += contributionRateTier1 >= 60 && contributionRateTier1 < 70 ? 2 : 0;
        resultPoints += contributionRateTier1 >= 80 && contributionRateTier1 < 100 ? 4 : 0;
        resultPoints += contributionRateTier1 >= 100 ? 5 : 0;

        if (maxCensusOption.getTier2Contribution() != null && maxCensusOption.getTier2Rate() != null) {
        	
	        Double contributionRateTier2 = maxCensusOption.getTier2Contribution() / maxCensusOption.getTier2Rate() * 100;
	        resultPoints += contributionRateTier2 >= 10 && contributionRateTier2 < 20 ? 1 : 0;
	        resultPoints += contributionRateTier2 >= 20 && contributionRateTier2 < 30 ? 2 : 0;
	        resultPoints += contributionRateTier2 >= 30 && contributionRateTier2 < 50 ? 3 : 0;
	        resultPoints += contributionRateTier2 >= 50 && contributionRateTier2 < 70 ? 4 : 0;
	        resultPoints += contributionRateTier2 >= 70 && contributionRateTier2 < 90 ? 5 : 0;
	        resultPoints += contributionRateTier2 >= 90 ? 6 : 0;
        }

        return resultPoints;
    }
	private static int calculatePointsByCarrierHistory(RfpDto rfp) {
        int totalPoints = 0;

        CarrierHistoryDto currentCarrierHistory = null;

        for(CarrierHistoryDto carrierHistory : rfp.getCarrierHistories()) {
            if(carrierHistory.isCurrent()) {
                currentCarrierHistory = carrierHistory;
                break;
            }
        }

        if(currentCarrierHistory == null) {
            return 0;
        }

        totalPoints = currentCarrierHistory.getYears() >= 3 ? 3 : totalPoints;
        totalPoints = currentCarrierHistory.getYears() == 2 ? 1 : totalPoints;

        return totalPoints;
    }

    private static int calculatePointsByCobraEmployees(ClientDto client) {
        double cobraEmployeesPercent = (double) client.getCobraCount() / client.getEmployeeCount() * 100;

        return cobraEmployeesPercent < 10 ? 2 : 0;
    }
	
	private enum PRODUCT {
		MEDICAL,
		DENTAL,
		VISION
	}

	private static String getLargeClaimComment() {
		boolean yes = CommonUtils.getRandomBooleanValue();
		if (yes) {
			StringBuilder builder = new StringBuilder();
			builder.append("This is a random reason that we had a large claim ");
			builder.append(RANDOM.nextInt(99999));
			return builder.toString();
		} else {
			return "";
		}
	}

	private static String getRandomComment() {
		StringBuilder builder = new StringBuilder();
		builder.append("This is test comment number ");
		builder.append(RANDOM.nextInt(99999));
		return builder.toString();
	}

	private static Integer getRandomNumberOfTiers() {
		int x = RANDOM.nextInt(5);
		return new Integer(x);
	}

	private static Integer getRandomOptionCount() {
		return new Integer(RANDOM.nextInt(6)+1);
	}

	private static Integer getRandomRatingTiers() {
		return new Integer(RANDOM.nextInt(4)+1);
	}
	private static String getRandomContributionType(RfpDto rfp) {
		if (rfp != null) {
			String[] paymentMethod = {"VOLUNTARY", "$", "%"};
			int index = 2;
			if (rfp.getProduct() != null) {

				if (rfp.getProduct().equals(PRODUCT.MEDICAL.toString())) {
					index = RANDOM.nextInt(2) + 1;
				} else {
					index = RANDOM.nextInt(3);
				}
			}
			return paymentMethod[index];

		} else {
			return "";
		}
	}
	private static String changeProduct(String product) {
		if (product.equals("MEDICAL")) {
			return "VISION";
		} else if (product.equals("DENTAL")) {
			return "MEDICAL";
		} else {
			return "DENTAL";
		}
	}
	private static String getRandomCommissionAmount() {
		return Integer.toString(RANDOM.nextInt(6)+1);
	}
	private static String getRandomPaymentMethod() {
		String[] paymentMethod = {"COMMISSION", "PEPM", "%"};
		int index = RANDOM.nextInt(3);
		return paymentMethod[index];
	}
	private static String getRandomWaitingPeriod() {
		StringBuilder builder = new StringBuilder();
		builder.append(RANDOM.nextInt(30) + 1);
		builder.append(" DaysAfter");

		return builder.toString();
	}
}
