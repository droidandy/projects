package com.benrevo.be.modules.admin.domain.quotes.parsers.anthem;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.QuoteParserErrorDto;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.common.exception.BaseException;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import java.io.InputStream;
import java.util.*;
import org.apache.poi.ss.util.CellReference;

import static java.lang.String.format;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang.StringUtils.isEmpty;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * Created by awelemdyorakwue on 5/26/17.
 */
public class AnthemParser implements IAnthemParser {

    private String rateDescriptionLocation = "";
    private String rateDescription = "";
    private String network = "";
    private String plan = "";
    private String planDetails = "";

    private String TIER_1_CENSUS = "tier1Census_";
    private String TIER_2_CENSUS = "tier2Census_";
    private String TIER_3_CENSUS = "tier3Census_";

    private int TIER_RATE_SYSTEM;
    private String TIER_1_RATE = "tier1Rate";
    private String TIER_2_RATE = "tier2Rate";
    private String TIER_3_RATE = "tier3Rate";
    private String TIER_4_RATE = "tier4Rate";

    private String HSA_ADMIN_FEE_STRING = "HSA Administrative fee";
    private String VISION_QUOTE_IDENTIFIER = "VISION";
    private String DENTAL_QUOTE_IDENTIFIER = "DENTAL";
    private String CHIRO_RIDER_IDENTIFIER = "Chiro Riders";

    private String ALL_ELIGIBLE = "All Eligible";
    private String SINGLE_HMOS = "SINGLE HMO";

    private String[] networkTypes = {"DPPO", "DHMO","HMO", "HSA", "PPO"};

    private boolean DEBUG = false;

    private HashSet<String> distinctRateDescriptions = new HashSet<String>();
    private HashSet<String> distinctNetworks = new HashSet<String>();
    private HashSet<String> distinctPlans = new HashSet<String>();

    private LinkedHashMap<String, RateDescriptionDTO> allMedicalParsedPlanInformation = new LinkedHashMap<String, RateDescriptionDTO>();
    private LinkedHashMap<String, RateDescriptionDTO> allVisionParsedPlanInformation = new LinkedHashMap<String, RateDescriptionDTO>();
    private LinkedHashMap<String, RateDescriptionDTO> allDentalParsedPlanInformation = new LinkedHashMap<String, RateDescriptionDTO>();

    private HashMap<String, String> tiersRateColumns = new HashMap<String, String>();

    private final String VIVITY_RATE_DESCRIPTION_ERROR = "The Medical quote appears to be missing the following rate description(s). Please check the file, and re-upload the quote.";
    private final String VIVITY_RATE_DESCRIPTION_ERROR_SUB = "%s, row %s";

    private final String VIVITY_RATE_DESCRIPTION_MISSING_VIVITY_NETWORK_ERROR = "The Medical quote appears to be missing the following rate description's Vivity Network. Please check the file, and re-upload the quote.";
    private final String VIVITY_RATE_DESCRIPTION_MISSING_VIVITY_NETWORK_ERROR_SUB = "Rate Description: %s, Missing Network: %s";

    /**
     * Loops through the sheet and calls the respective category parser when the rate description is encountered.
     * @param fis
     * @throws Exception
     */
    @Override
    public void parseAnthemQuotes(InputStream fis, Set<QuoteParserErrorDto> errorCollector) throws Exception{

        HSSFWorkbook myWorkBook = null;
        try{
            myWorkBook = new HSSFWorkbook(fis);
            HSSFSheet mySheet = myWorkBook.getSheetAt(0);
            Iterator<Row> rowIterator = mySheet.iterator();
            while(rowIterator.hasNext()){
                Row row = rowIterator.next();
                if(isRateDescription(row) && isDistinctRateDescription(mySheet, row)){
                    setRateDescription(mySheet, row);
                }

                if(!rateDescription.isEmpty()){
                    if(containsIgnoreCase(rateDescription, VISION_QUOTE_IDENTIFIER)){
                        parseVision(mySheet, rowIterator);
                    }else if(containsIgnoreCase(rateDescription, DENTAL_QUOTE_IDENTIFIER)){
                        parseDental(mySheet, rowIterator);
                    }else {
                        parseMedical(mySheet, rowIterator);
                    }
                }
            }
            if(!isEmpty(allMedicalParsedPlanInformation)) {
                medicalPostProcess(errorCollector);
            }
        } finally {
            if (myWorkBook != null) {
                myWorkBook.close();
            }
        }
    }

    private void medicalPostProcess(Set<QuoteParserErrorDto> errorCollector){
        processAllEligible(errorCollector);
        processHiLowNetworks();
    }

    private void processHiLowNetworks() {
        // convert singles to hi-low since anthem does not support it anymore in quote files
        LinkedHashMap<String, RateDescriptionDTO> temp = new LinkedHashMap<String, RateDescriptionDTO>();
        for(String key : allMedicalParsedPlanInformation.keySet()) {
            if (key.contains(SINGLE_HMOS)) {
                RateDescriptionDTO rd = allMedicalParsedPlanInformation.get(key);
                for(String networkName : rd.getAnthemNetworks().keySet()){
                    AnthemNetworkDetails network = rd.getAnthemNetworks().get(networkName);
                    RateDescriptionDTO newRd = new RateDescriptionDTO();
                    newRd.getAnthemNetworks().put(networkName, network);
                    newRd.setChiroRiders(rd.getChiroRiders());
                    String ntwk = networkName.replace("Network","");
                    temp.put("HIGH-LOW SINGLE HMO NETWORK (" +  ntwk.trim() + ")", newRd);
                }
            }
        }
        allMedicalParsedPlanInformation.putAll(temp);
    }

    private void processAllEligible(Set<QuoteParserErrorDto> errorCollector) {
        // Join Traditional All Eligible and Vivity Eligible Only
        LinkedHashMap<String, RateDescriptionDTO> temp = new LinkedHashMap<String, RateDescriptionDTO>();
        ArrayList<String> rdToRemove = new ArrayList<>();
        for(String key : allMedicalParsedPlanInformation.keySet()){
            if(key.contains(ALL_ELIGIBLE)){
                RateDescriptionDTO rd = allMedicalParsedPlanInformation.get(key);

                AnthemNetworkDetails networkNotVivity = null;
                for(String networkName : rd.getAnthemNetworks().keySet()){
                    if(!equalsIgnoreCase(networkName, "Vivity Network")){
                        networkNotVivity = rd.getAnthemNetworks().get(networkName);
                        break;
                    }
                }

                // Time to find Vivity network from the other rate description
                int endingParenthesisIndex = key.indexOf(")");
                if(endingParenthesisIndex != -1){
                    String originalRd = key.substring(0,
                        endingParenthesisIndex + 1);
                    originalRd = originalRd.trim();
                    String vivityNetworkRdKey = getVivityRateDescriptionCaseInsensitively(originalRd + " - Vivity Eligible Only");
                    if(isBlank(vivityNetworkRdKey)){
                        if(errorCollector == null) {
                            throw new BaseException(
                                "Anthem parser cannot find Vivity rate description pair;"
                                    + "Base rate description=" + key);
                        }else{
                            errorCollector.add(new QuoteParserErrorDto(VIVITY_RATE_DESCRIPTION_ERROR,
                                format(VIVITY_RATE_DESCRIPTION_ERROR_SUB, vivityNetworkRdKey, rd.getRateDescriptionCellLocation())));
                        }
                    }

                    AnthemNetworkDetails vivityNetwork = null;
                    RateDescriptionDTO vivityNetworkRd = allMedicalParsedPlanInformation.get(vivityNetworkRdKey);
                    for(String networkName : vivityNetworkRd.getAnthemNetworks().keySet()) {
                        if(equalsIgnoreCase(networkName, "Vivity Network")) {
                            vivityNetwork = vivityNetworkRd.getAnthemNetworks().get(networkName);
                            break;
                        }
                    }

                    if(isNull(vivityNetwork)){
                        if(errorCollector == null) {
                            throw new BaseException(
                                "Anthem parser cannot find 'Vivity network' in Vivity rate description pair;"
                                    + "Base rate description=" + key);
                        } else{
                            errorCollector.add(new QuoteParserErrorDto(VIVITY_RATE_DESCRIPTION_MISSING_VIVITY_NETWORK_ERROR,
                                format(VIVITY_RATE_DESCRIPTION_MISSING_VIVITY_NETWORK_ERROR_SUB,
                                    vivityNetworkRdKey, "Vivity Network")));
                        }
                    }

                    RateDescriptionDTO newRd = new RateDescriptionDTO();
                    newRd.getAnthemNetworks().put(vivityNetwork.getNetworkName(), vivityNetwork);
                    newRd.getAnthemNetworks().put(networkNotVivity.getNetworkName(), networkNotVivity);
                    newRd.setChiroRiders(rd.getChiroRiders());
                    newRd.setCensusInformation(rd.getCensusInformation());
                    temp.put(originalRd, newRd);
                    rdToRemove.add(key);
                    rdToRemove.add(vivityNetworkRdKey);
                }
            }
        }

        for(String keyToRemove : rdToRemove){
            allMedicalParsedPlanInformation.remove(keyToRemove);
        }
        allMedicalParsedPlanInformation.putAll(temp);
    }

    private String getVivityRateDescriptionCaseInsensitively(String key){
        return allMedicalParsedPlanInformation.keySet()
            .stream()
            .filter(s -> s.equalsIgnoreCase(key))
            .findFirst()
            .orElse(null);
    }

    private void setTierRates(AnthemPlanDetails planInfo, String tier1Location, String tier2Location,
        String tier3Location, String tier4Location, String ...tierRates){

        for(String rate : tierRates){
            final String originalRate = rate;
            rate = isEmpty(rate) ? "0.0" : rate;
            if(isEmpty(planInfo.getTier1Rate())){
                if(!isEmpty(originalRate)) {
                    TIER_RATE_SYSTEM = 1;
                }
                planInfo.setTier1Rate(rate);
                planInfo.setTier1RateLocation(tier1Location);
            }else if(!isEmpty(planInfo.getTier1Rate()) && isEmpty(planInfo.getTier2Rate())){
                if(!isEmpty(originalRate)) {
                    TIER_RATE_SYSTEM = 2;
                }
                planInfo.setTier2Rate(rate);
                planInfo.setTier2RateLocation(tier2Location);
            }else if(!isEmpty(planInfo.getTier1Rate()) && !isEmpty(planInfo.getTier2Rate()) && isEmpty(planInfo.getTier3Rate())){
                if(!isEmpty(originalRate)) {
                    TIER_RATE_SYSTEM = 3;
                }
                planInfo.setTier3Rate(rate);
                planInfo.setTier3RateLocation(tier3Location);
            }else if(!isEmpty(planInfo.getTier1Rate()) && !isEmpty(planInfo.getTier2Rate()) && !isEmpty(planInfo.getTier3Rate()) && isEmpty(planInfo.getTier4Rate())){
                if(!isEmpty(originalRate)) {
                    TIER_RATE_SYSTEM = 4;
                }
                planInfo.setTier4Rate(rate);
                planInfo.setTier4RateLocation(tier4Location);
            }
        }
    }

    private AnthemPlanDetails addCostInformation(LinkedHashMap<String, RateDescriptionDTO> obj,
        String category, String copay, String tier1, String tier2, String tier3, String tier4,
        String planNameLocation, String tier1Location, String tier2Location, String tier3Location,
        String tier4Location){

        AnthemPlanDetails planInfo = new AnthemPlanDetails();

        String networkName = deriveNetworkName(category, plan, network);
        String networkType = deriveNetworkType(networkName);
        planInfo.setNetworkName(networkName);
        planInfo.setNetworkType(networkType);

        // for createRfpQuoteNetwork object, name is
        planInfo.setRfpQuoteOptionName(rateDescription);

        //clean up plan name, remove all duplicate and extra space
        planDetails = planDetails.replaceAll("\\s{2,}", " ").trim();

        // for use during RfpQuoteNetworkPlan
        planInfo.setPlanName(planDetails);
        planInfo.setPlanNameLocation(planNameLocation);
        
        // see planDetails building for Voluntary details
        if((category.equals(Constants.DENTAL) || category.equals(Constants.VISION)) 
                && planDetails.contains("Voluntary")) {
            planInfo.setVoluntary(true);
        }

        planInfo.setPlanCopay(copay);
        setTierRates(planInfo, tier1Location, tier2Location, tier3Location, tier4Location, tier1, tier2, tier3, tier4);

        if(obj.containsKey(rateDescription)){
            LinkedHashMap<String, AnthemNetworkDetails> networks = obj.get(rateDescription).getAnthemNetworks();

            if(networks.containsKey(networkName)){
                networks.get(networkName).setNetworkType(networkType);
                networks.get(networkName).getPlanDetails().add(planInfo);
            }else{
                AnthemNetworkDetails detail = new AnthemNetworkDetails();
                detail.setNetworkName(networkName);
                detail.setNetworkType(networkType);
                detail.getPlanDetails().add(planInfo);
                networks.put(networkName, detail);
            }
        }else{
            RateDescriptionDTO f = new RateDescriptionDTO();
            AnthemNetworkDetails detail = new AnthemNetworkDetails();
            detail.setNetworkType(networkType);
            detail.setNetworkName(networkName);
            detail.getPlanDetails().add(planInfo);
            f.getAnthemNetworks().put(networkName, detail);
            f.setRateDescriptionCellLocation(rateDescriptionLocation);
            obj.put(rateDescription, f);
        }
        return planInfo;
    }

    private String findContractLength(String text) {
    	
    	String upperText = text.toUpperCase();
		int ratesIndex = upperText.lastIndexOf("RATES");
		if (ratesIndex < 0) {
			// not found
			return null;
		}	
		int hyphenIndex = upperText.lastIndexOf('-', ratesIndex);
		if (hyphenIndex > -1) {
			// take everything between
			return text.substring(hyphenIndex+1,ratesIndex).trim();
		} 
		int bracketIndex = upperText.lastIndexOf(')', ratesIndex);
		if (bracketIndex > -1) {
			// take everything between
			return text.substring(hyphenIndex+1,ratesIndex).trim();
		}
		int netIndex = upperText.lastIndexOf("NET", ratesIndex);
		if (netIndex > -1) {
			// take everything between
			return text.substring(netIndex+3,ratesIndex).trim();
		}
		int dentalIndex = upperText.lastIndexOf("DENTAL", ratesIndex);
		if (dentalIndex > -1) {
			// take everything between
			return text.substring(dentalIndex+6,ratesIndex).trim();
		}
		return null;
    }

    private void parseMedical(HSSFSheet  mySheet, Iterator<Row> rowIterator) {
        while(rowIterator.hasNext()){

            Row row = rowIterator.next();
            if(isRateDescription(row) && isDistinctRateDescription(mySheet, row)){
                setRateDescription(mySheet, row);
                if(containsIgnoreCase(rateDescription, VISION_QUOTE_IDENTIFIER) || containsIgnoreCase(rateDescription, DENTAL_QUOTE_IDENTIFIER)){
                    break;
                }
            }else if(!rateDescription.equals("") && isNetwork(row) && isDistinctNetwork(row)){
                setNetwork(row);
                skipNetworkDescription(mySheet, rowIterator);
                if(network.contains(CHIRO_RIDER_IDENTIFIER)){
                    parseChiroNetwork(mySheet, rowIterator, allMedicalParsedPlanInformation);
                }
            }else if(!rateDescription.equals("") && !network.equals("") && isPlan(row) && isDistinctPlan(row)){
                setPlan(row);
            }else if(!rateDescription.equals("") && !network.equals("") && isAssumedEnrollement(row)){
                parseAssumedEnrollment(allMedicalParsedPlanInformation, mySheet, rowIterator);
            } else if(!rateDescription.equals("") && !network.equals("") && isPlanDetails(row)){
                planDetails = getPlanDetails(row);
                String planNameLocation = getPlanLocation(row);
                row = rowIterator.next();
                String copay = getColumnValues(row, 4, 6);
                String tier1, tier2, tier3, tier4, tier1Location, tier2Location, tier3Location, tier4Location;

                tier1 = getTier(row, TIER_1_RATE); // Employee only
                tier1Location = getTierLocation(row, TIER_1_RATE);
                tier2 = getTier(row, TIER_2_RATE); // Employee + One
                tier2Location = getTierLocation(row, TIER_2_RATE);
                tier3 = getTier(row, TIER_3_RATE); // Employee + Spouse + Child(ren)
                tier3Location = getTierLocation(row, TIER_3_RATE);
                tier4 = getTier(row, TIER_4_RATE); // Employee + Spouse + village(maybe)
                tier4Location = getTierLocation(row, TIER_4_RATE);

                print("   Plan Details: " + planDetails.split("Rx")[0] + " => copay = " + copay + " tier1 = " + tier1 +
                        " tier2 = " + tier2 + " tier3 = " + tier3 + " tier4 = " + tier4);

                // store the plan detail in the arrayList of hashmap for later use when census information is retrieved.
                addCostInformation(allMedicalParsedPlanInformation, Constants.MEDICAL, copay,
                    tier1, tier2, tier3, tier4, planNameLocation, tier1Location, tier2Location, tier3Location, tier4Location);
            }
        }
    }

    private void parseDental(HSSFSheet  mySheet, Iterator<Row> rowIterator) {
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            if(isRateDescription(row) && isDistinctRateDescription(mySheet, row)){
                setRateDescription(mySheet, row);
                if(!rateDescription.contains(DENTAL_QUOTE_IDENTIFIER)){
                    break;
                }
            }else if(!rateDescription.equals("") && isNetwork(row) && isDistinctNetwork(row)) {
                setNetwork(row);
            }else if(isPlanColumnHeaders(row)){
                determineTiersRateColumns(row);
            }else if(!rateDescription.equals("") && !network.equals("") && isValidDentalPlanDetails(row)){
                planDetails = getColumnValues(row, 0, 2);
                String planNameLocation = getColumnLocationDetail(row, 0, 2);
                String tier1, tier2, tier3, tier4, tier1Location, tier2Location, tier3Location, tier4Location;
                tier1 = getTier(row, TIER_1_RATE); // Employee only
                tier1Location = getTierLocation(row, TIER_1_RATE);
                tier2 = getTier(row, TIER_2_RATE); // Employee + One
                tier2Location = getTierLocation(row, TIER_2_RATE);
                tier3 = getTier(row, TIER_3_RATE); // Employee + Spouse + Child(ren)
                tier3Location = getTierLocation(row, TIER_3_RATE);
                tier4 = getTier(row, TIER_4_RATE); // Employee + Spouse + village(maybe)
                tier4Location = getTierLocation(row, TIER_4_RATE);

                print("   Plan Details: " + planDetails + "  tier1 = " + tier1 +
                        " tier2 = " + tier2 + " tier3 = " + tier3 + " tier4 = " + tier4);

                AnthemPlanDetails planInfo = addCostInformation(allDentalParsedPlanInformation,
                    Constants.DENTAL,"N/A", tier1, tier2, tier3, tier4, planNameLocation,
                    tier1Location, tier2Location, tier3Location, tier4Location);
                
                // parse addition attributes
                String contractLength = findContractLength(rateDescription);
                if (contractLength != null) {
                	planInfo.addAttribute(QuotePlanAttributeName.CONTRACT_LENGTH, contractLength);
        	        print("    contractLength: " + contractLength);
                }

            }else if(isAssumedEnrollement(row)){
                parseAssumedEnrollment(allDentalParsedPlanInformation, mySheet, rowIterator);
            }
        }
    }

    private void parseVision(HSSFSheet mySheet, Iterator<Row> rowIterator){
        while(rowIterator.hasNext()) {
            Row row = rowIterator.next();
            if(isRateDescription(row) && isDistinctRateDescription(mySheet, row)){
                setRateDescription(mySheet, row);
                if(!rateDescription.contains(VISION_QUOTE_IDENTIFIER)){
                    break;
                }
            }else if(!rateDescription.equals("") && isNetwork(row) && isDistinctNetwork(row)){
                setNetwork(row);
            }else if(isVisionPlanColumnHeaders(row)){
                determineVisionTiersRateColumns(row);
            }else if(!rateDescription.equals("") && !network.equals("") && isPlan(row) && isDistinctPlan(row)){
                setPlan(row);
            }else if(isValidVisionEAPPlanDetails(row) && !isRateDescription(row)){
                planDetails = getColumnValues(row, 0, 3);
                String planNameLocation = getColumnLocationDetail(row, 0, 3);
                if(containsIgnoreCase(network, "Employer Paid")){
                    planDetails = planDetails.trim() + " - Employer Paid";
                }else if(containsIgnoreCase(network, "Voluntary")){
                    planDetails = planDetails.trim() + " - Voluntary";
                }

                String eyeExamMonths = getColumnValues(row, 4, 6);
                String tier1, tier2, tier3, tier4, tier1Location, tier2Location, tier3Location, tier4Location;
                tier1 = getTier(row, TIER_1_RATE); // Employee only
                tier1Location = getTierLocation(row, TIER_1_RATE);;
                tier2 = getTier(row, TIER_2_RATE); // Employee + One
                tier2Location = getTierLocation(row, TIER_2_RATE);
                tier3 = getTier(row, TIER_3_RATE); // Employee + Spouse + Child(ren)
                tier3Location = getTierLocation(row, TIER_3_RATE);
                tier4 = getTier(row, TIER_4_RATE); // Employee + Spouse + village(maybe)
                tier4Location = getTierLocation(row, TIER_4_RATE);
                print("   Plan Details: " + planDetails + " Eye Exam Months = " + eyeExamMonths + " tier1 = " + tier1 +
                        " tier2 = " + tier2 + " tier3 = " + tier3 + " tier4 = " + tier4);

                addCostInformation(allVisionParsedPlanInformation, Constants.VISION,"N/A",
                    tier1, tier2, tier3, tier4, planNameLocation, tier1Location, tier2Location, tier3Location, tier4Location);
            }else if(isAssumedEnrollement(row)){
                row = rowIterator.next();
                String assumedEnrollmentDetails = getColumnValues(row, 3, 6);

                String allTierCensus = getColumnValues(row, 7, 12);
                LinkedHashMap<String, String> censusData = allVisionParsedPlanInformation.get(rateDescription).getCensusInformation();
                censusData.put("Vision" + "_key", "Vision");
                censusData.put(TIER_1_CENSUS + "Vision" , allTierCensus);
                censusData.put(TIER_2_CENSUS + "Vision", allTierCensus);
                censusData.put(TIER_3_CENSUS + "Vision", allTierCensus);
                allVisionParsedPlanInformation.get(rateDescription).setCensusInformation(censusData);

                if(assumedEnrollmentDetails.contains("Total")){
                    // assumed enrollment section is done
                    break;
                }
            }
        }
    }

    private String getTier(Row row, String tierIdentifier){
        String tierIndices = tiersRateColumns.containsKey(tierIdentifier) ? tiersRateColumns.get(tierIdentifier) : "";
        String[] tierSplit = tierIndices.split(",");

        if(!tierIndices.isEmpty() && tierSplit.length != 0){
            return getColumnValues(row, Integer.parseInt(tierSplit[0]),  Integer.parseInt(tierSplit[tierSplit.length-1]));
        }else if(!tierIndices.isEmpty() && tierSplit.length == 0){
            return getColumn(row, Integer.parseInt(tierIndices));
        }else{
            return tierIndices;
        }
    }

    private String getTierLocation(Row row, String tierIdentifier){
        String tierIndices = tiersRateColumns.containsKey(tierIdentifier) ? tiersRateColumns.get(tierIdentifier) : "";
        String[] tierSplit = tierIndices.split(",");

        if(!tierIndices.isEmpty() && tierSplit.length != 0){
            return getColumnLocationDetail(row, Integer.parseInt(tierSplit[0]),  Integer.parseInt(tierSplit[tierSplit.length-1]));
        }else if(!tierIndices.isEmpty() && tierSplit.length == 0){
            return getColumnLocationDetail(row, Integer.parseInt(tierIndices), Integer.parseInt(tierIndices));
        }else{
            return tierIndices;
        }
    }

    private void parseChiroNetwork(HSSFSheet mySheet, Iterator<Row> rowIterator, LinkedHashMap<String, RateDescriptionDTO> map){
        String initialRateDescription = rateDescription;
        String initialNetwork = network;
        while(rowIterator.hasNext()) {

            Row row = rowIterator.next();
            String repeatingChiroNetwork = getNetwork(row);
            if(isValidChiroRidersPlanDetails(row) && !isRateDescription(row) && (!repeatingChiroNetwork.isEmpty() && !repeatingChiroNetwork.equals(initialNetwork)) ){

                setChiroTiersRateColumns();
                String chiroPlanDetails = getColumnValues(row, 0, 6);
                String tier1, tier2, tier3, tier4;
                ChiroRider rider = new ChiroRider();
                rider.setName(chiroPlanDetails);
                rider.setLocation(getColumnLocationDetail(row, 0, 6));

                tier1 = getTier(row, TIER_1_RATE); // Employee only
                rider.setTier1RateLocation(getTier(row, TIER_1_RATE));
                tier2 = getTier(row, TIER_2_RATE); // Employee + One
                rider.setTier2RateLocation(getTier(row, TIER_2_RATE));
                tier3 = getTier(row, TIER_3_RATE); // Employee + Spouse + Child(ren)
                rider.setTier3RateLocation(getTier(row, TIER_3_RATE));
                tier4 = getTier(row, TIER_4_RATE); // Employee + Spouse + village(maybe)
                rider.setTier4RateLocation(getTier(row, TIER_4_RATE));

                print("   Plan Details: " + chiroPlanDetails + " tier1 = " + tier1 +
                        " tier2 = " + tier2 + " tier3 = " + tier3 + " tier4 = " + tier4);

                rider.setTier1Rate(isEmpty(tier1) ? "0.0" : tier1);
                rider.setTier2Rate(isEmpty(tier2) ? "0.0" : tier2);
                rider.setTier3Rate(isEmpty(tier3) ? "0.0" : tier3);
                rider.setTier4Rate(isEmpty(tier4) ? "0.0" : tier4);
                map.get(rateDescription).getChiroRiders().add(rider);

                if(isChiroNetworkComplete(mySheet, row.getRowNum(), initialRateDescription)){
                    break;
                }
            }
        }
    }

    private boolean isChiroNetworkComplete(HSSFSheet mySheet, int rowNumber, String initialRateDescription){
        int end = mySheet.getLastRowNum();
        boolean isTheEndOfChiroNetwork = false;
        for(int i = rowNumber + 1; i < end; i++){
            Row row = mySheet.getRow(i);
            if((isRateDescription(row) && !getRateDescriptionValue(mySheet, row).equals(initialRateDescription))
                    || isAssumedEnrollement(row)){
                isTheEndOfChiroNetwork = true;
                break;
            }else if(isValidChiroRidersPlanDetails(row) && !isRateDescription(row) && !isAssumedEnrollement(row)){
                isTheEndOfChiroNetwork = false;
                break;
            }
        }
        return isTheEndOfChiroNetwork;
    }

    private void parseAssumedEnrollment(LinkedHashMap<String, RateDescriptionDTO> map, HSSFSheet mySheet, Iterator<Row> rowIterator){
        print(" Assumed Enrollment");
        while(rowIterator.hasNext()) {

            Row row = rowIterator.next();
            if(isAssumedEnrollmentType(row)){
                String assummedEnrollmentType = getColumnValues(row, 3, 6);
                print("\tAssumed Enrollment Type = " + assummedEnrollmentType);
            }else if(isAssumedEnrollmentDetails(row)) {
                String assumedEnrollmentDetails = getColumnValues(row, 2, 4);

                String singleDetail = getColumnValues(row, 5, 6);
                String twoParty = getColumnValues(row, 7, 11);
                String family = getColumnValues(row, 12, 14);

                print("\tAssumed Enrollment Details = " + assumedEnrollmentDetails + " single = " + singleDetail
                        + " two party = " + twoParty + " family = " + family);

                LinkedHashMap<String, String> censusData = map.get(rateDescription).getCensusInformation();
                censusData.put(assumedEnrollmentDetails + "_key", assumedEnrollmentDetails);
                censusData.put(TIER_1_CENSUS + assumedEnrollmentDetails , singleDetail);
                censusData.put(TIER_2_CENSUS + assumedEnrollmentDetails, twoParty);
                censusData.put(TIER_3_CENSUS + assumedEnrollmentDetails, family);
                map.get(rateDescription).setCensusInformation(censusData);

                if(assumedEnrollmentDetails.equals("Total")){
                    // assumed enrollment section is done
                    break;
                }
            }
        }
    }

    /**
     * Skips the network description that appears below some networks in Anthem Medical quotes
     */
    private void skipNetworkDescription(HSSFSheet mySheet, Iterator<Row> rowIterator){
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            String potentialNetworkDescription = getNetwork(row);
            String potential_networkDescription_columns_from_L_to_S = getColumnValues(row, 11, 18);

            if(!potentialNetworkDescription.isEmpty()
                    && !potential_networkDescription_columns_from_L_to_S.contains("Emp")
                    && potential_networkDescription_columns_from_L_to_S.isEmpty()){

                print("Network Description found");
                String key = rateDescription + "_" + potentialNetworkDescription;
                distinctNetworks.add(key);
            }else if(!potential_networkDescription_columns_from_L_to_S.isEmpty() &&
                isPlanColumnHeaders(row)){

                determineTiersRateColumns(row);
                break;
            }
        }
    }

    /**
     * tier2Value - used to differentiate btw emp + spouse+ child(ren) that
     *              appears in tier 3 for 3 tier system vs 4 on 4 tier system
     * @param row
     */
    private void determineTiersRateColumns(Row row){
        tiersRateColumns.clear();
        String tier2Value = "";

        for(int i = 0; i < row.getLastCellNum(); i++){
            String cellValue = getColumn(row, i).trim().toLowerCase();

            if(!cellValue.isEmpty() && (cellValue.equalsIgnoreCase("emponly")  || cellValue.equalsIgnoreCase("employee"))){
                tiersRateColumns.put(TIER_1_RATE, i + "," + getLastIndex(i, row));
            }else if(!cellValue.isEmpty() && (cellValue.equalsIgnoreCase("emp +one")
                || cellValue.equalsIgnoreCase("family")
                || cellValue.equalsIgnoreCase("emp +spouse")) ){

                tier2Value = cellValue;
                tiersRateColumns.put(TIER_2_RATE, i + "," + getLastIndex(i, row));
            }else if(!cellValue.isEmpty() && ( (cellValue.equalsIgnoreCase("emp + spouse+ child(ren)") && tier2Value.equalsIgnoreCase("emp +one"))
                || cellValue.equalsIgnoreCase("emp +child(ren)"))){

                tiersRateColumns.put(TIER_3_RATE, i + "," + getLastIndex(i, row));
            }else if(!cellValue.isEmpty() && ( cellValue.equalsIgnoreCase("emp + spouse+ child(ren)") && tier2Value.equalsIgnoreCase("emp +spouse") )){
                tiersRateColumns.put(TIER_4_RATE, i + "," + getLastIndex(i, row));
            }
        }
    }

    private int getLastIndex(int currentIndex, Row row){
        int lastIndex = currentIndex;
        for(int i = (currentIndex + 1); i < row.getLastCellNum(); i++){
            String cellValue = getColumn(row, i).trim().toLowerCase();
            if(cellValue.isEmpty()){
                lastIndex = i;
            }else{
                break;
            }
        }
        return lastIndex;
    }

    private void determineVisionTiersRateColumns(Row row){
        tiersRateColumns.clear();
        String tier2Value = "";
        String tier3Value = "";

        for(int i = 0; i < row.getLastCellNum(); i++){
            String cellValue = getColumn(row, i).trim().toLowerCase();

            if(!cellValue.isEmpty() && (cellValue.equalsIgnoreCase("emp")
                || cellValue.equalsIgnoreCase("emponly")
                || cellValue.equalsIgnoreCase("employee"))) {

                tiersRateColumns.put(TIER_1_RATE, i + "," + getLastIndex(i, row));
            }else if(!cellValue.isEmpty() && ((cellValue.equalsIgnoreCase("emp +") && tier2Value.isEmpty())
                || cellValue.equalsIgnoreCase("family"))){

                tier2Value = cellValue;
                tiersRateColumns.put(TIER_2_RATE, i + "," + getLastIndex(i, row));
            }else if(!cellValue.isEmpty() && ( (tier3Value.isEmpty() && cellValue.equalsIgnoreCase("emp + spouse") && tier2Value.equalsIgnoreCase("emp +"))
                || (cellValue.equalsIgnoreCase("emp +") && tier2Value.equalsIgnoreCase("emp +")) )){

                tier3Value = cellValue;
                tiersRateColumns.put(TIER_3_RATE, i + "," + getLastIndex(i, row));
            }else if(!cellValue.isEmpty() && ( cellValue.equalsIgnoreCase("emp + spouse") && tier2Value.equalsIgnoreCase("emp +") )){
                tiersRateColumns.put(TIER_4_RATE, i + "," + getLastIndex(i, row));
            }
        }
    }

    private void setChiroTiersRateColumns(){
        tiersRateColumns.clear();

        if(TIER_RATE_SYSTEM == 1){
            tiersRateColumns.put(TIER_1_RATE, "7");
        }else if(TIER_RATE_SYSTEM == 2){
            tiersRateColumns.put(TIER_1_RATE, "7");
            tiersRateColumns.put(TIER_2_RATE, "11");
        }else if(TIER_RATE_SYSTEM == 3){
            tiersRateColumns.put(TIER_1_RATE, "7");
            tiersRateColumns.put(TIER_2_RATE, "10");
            tiersRateColumns.put(TIER_3_RATE, "13");
        }else if(TIER_RATE_SYSTEM == 4){
            tiersRateColumns.put(TIER_1_RATE, "7");
            tiersRateColumns.put(TIER_2_RATE, "10");
            tiersRateColumns.put(TIER_3_RATE, "13");
            tiersRateColumns.put(TIER_4_RATE, "15");
        }
    }

    private boolean isPlanColumnHeaders(Row row){
        String allColumns = getColumnValues(row, 0, 24).trim().toLowerCase();

        return !isEmpty(allColumns) && ((
            (allColumns.contains("emp")) && allColumns.contains("spouse")
            && allColumns.contains("child(ren)") ) || (allColumns.contains("employee") && allColumns.contains("family")));
    }

    private boolean isVisionPlanColumnHeaders(Row row){
        String allColumns = getColumnValues(row, 0, 24).toLowerCase();

        return !isEmpty(allColumns) && (allColumns.contains("emp") || allColumns.contains("employee"));
    }

    private String removeNtwk(String str){
        if(str != null && str.contains("ntwk")){
            str = str.replace("ntwk", "Network");
        }else if(str != null && str.contains("Ntwk")){
            str = str.replace("Ntwk", "Network");
        }
        return str;
    }

    @Override
    public String deriveNetworkName(String category, String plan, String network){

        String tempPlan = removeNtwk(plan);
        String tempNetwork = removeNtwk(network);
        String derivedNetworkName = tempNetwork;

        // Medical
        if(category.equalsIgnoreCase(Constants.MEDICAL)){

            if((containsIgnoreCase(tempPlan,"Anthem PPO HSA") && containsIgnoreCase(tempPlan, "Traditional"))
                || (containsIgnoreCase(tempNetwork, "Anthem PPO HSA") && containsIgnoreCase(tempNetwork, "Traditional"))){

                return "Lumenos HSA";
            }

            if(containsIgnoreCase(tempPlan,"EPO - Prudent Buyer Exclusive") || containsIgnoreCase(tempNetwork, "EPO - Prudent Buyer Exclusive")) {
                return "PPO";
            }

            if(containsIgnoreCase(tempPlan,"Traditional") || containsIgnoreCase(tempNetwork, "Traditional")
                || containsIgnoreCase(tempPlan,"Trad") || containsIgnoreCase(tempNetwork, "Trad")) {
                return "Traditional Network";
            }

            if(containsIgnoreCase(tempPlan,"Anthem HSA") || containsIgnoreCase(tempNetwork, "Anthem HSA")) {
                return "Lumenos HSA";
            }

            if(containsIgnoreCase(tempPlan,"PPO - Solution") || containsIgnoreCase(tempNetwork, "PPO - Solution")) {
                return "PPO";
            }

            if(containsIgnoreCase(tempPlan, "HSA Select PPO Network(CA Only)") || containsIgnoreCase(tempNetwork, "HSA Select PPO Network(CA Only)")){
                return "HSA Select PPO Network (CA Only)";
            }

            if(containsIgnoreCase(tempPlan,  "PPO - Select PPO Network (CA Only)") || containsIgnoreCase(tempNetwork,  "PPO - Select PPO Network (CA Only)")){
                return "PPO - Select (CA Only)";
            }

            if(!tempPlan.isEmpty() && tempPlan.contains("-")){
                String[] split = tempPlan.split("-");
                if(split.length == 2){
                    derivedNetworkName = split[1].trim();
                }
            }


        }

        // Dental network name
        if(category.equalsIgnoreCase(Constants.DENTAL)){
            if(network.contains("DHMO")) {
                derivedNetworkName = "DHMO Network";
            }

            if(network.contains("DPPO")) {
                derivedNetworkName = "DPPO Network";
            }
        }

        // Vision network name
        if(category.equalsIgnoreCase(Constants.VISION)){
            derivedNetworkName = "VPPO Network";
        }

        return derivedNetworkName;
    }

    private String deriveNetworkType(String networkName){
        String networkType = "";

        if(containsIgnoreCase(networkName, "Traditional")){
            return "HMO";
        }

        for(String s : networkTypes){
            if(containsIgnoreCase(networkName, "EPO")){
                networkType = "PPO";
                break;
            }

            if(containsIgnoreCase(networkName, "VPPO")){
                networkType = "VISION";
                break;
            }

            if(networkName.contains(s) || plan.contains(s) || planDetails.contains(s)) {
                networkType = s;
                break;
            }
        }
        return networkType;
    }

    private void setRateDescription(HSSFSheet mySheet, Row row){
        // clear all temporary variables
        rateDescription = "";
        network = "";
        plan = "";
        planDetails = "";

        rateDescription = getRateDescriptionValue(mySheet, row);
        rateDescriptionLocation = getRateDescriptionLocation(row);
        print("\nRate Description: " + rateDescription);
    }

    private void setNetwork(Row row){
        plan = "";
        network = getNetwork(row);
        print(" Network: " + network);
    }

    private void setPlan(Row row){
        plan = getPlanName(row);
        print("  Plan: " + plan);
    }

    private boolean isAssumedEnrollmentType(Row row){
        String firstThreeColumns = getColumnValues(row, 0, 2);
        String allColumn = getColumnValues(row, 3, 6);

        return firstThreeColumns != null && firstThreeColumns.isEmpty() && !allColumn.isEmpty();
    }

    private boolean isAssumedEnrollmentDetails(Row row){
        String firstThreeColumns = getColumnValues(row, 0, 1);
        String allColumn = getColumnValues(row, 2, 4);

        return firstThreeColumns != null && firstThreeColumns.isEmpty() && !allColumn.isEmpty();
    }

    private boolean isValidChiroRidersPlanDetails(Row row){
        String details = getColumnValues(row, 0, 6);
        String firstColumn = getColumn(row, 0);

        return firstColumn != null && !firstColumn.isEmpty() &&
                details != null && !details.isEmpty() && !details.contains("Plan");
    }

    private boolean isValidDentalPlanDetails(Row row){
        String details = getColumnValues(row, 0, 3);
        String firstColumn = getColumn(row, 0);
        String randomValues = getColumnValues(row, 0, 20);

        return firstColumn != null && !firstColumn.isEmpty()
                && details != null && !details.isEmpty()
                && !randomValues.contains("Plan") && !randomValues.contains("Emp Only");
    }

    private boolean isValidVisionEAPPlanDetails(Row row){
        String details = getColumnValues(row, 0, 3);
        String firstColumn = getColumn(row, 0);
        String eyeExamMonths = getColumnValues(row, 4, 6);

        return firstColumn != null && !firstColumn.isEmpty()
                && details != null && !details.isEmpty()
                && !details.contains("Plan") && !eyeExamMonths.isEmpty();
    }

    private String convertColumnNumberToString(int columnIndex){
        return CellReference.convertNumToColString(columnIndex);
    }

    private String getColumnValues(Row row, int startColumn, int endColumn){
        String value = "";
        if(row != null){
            for(int column = startColumn; column <= endColumn; column++){
                value += getColumn(row, column);
            }
        }

        value = replaceAllSpecialCharacters(value);
        return value;
    }

    private String getColumn(Row row, int columnIndex){
        String value = "";
        if(row != null){
            Cell cell = row.getCell(columnIndex);
            if(cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK){
                value += cell.toString();
            }
        }
        value = replaceAllSpecialCharacters(value);
        return value;
    }

    private String getColumnLocationDetail(Row row, int startColumn, int endColumn) {
        ArrayList<String> cellLocations = new ArrayList<>();
        if(row != null) {
            for(int column = startColumn; column <= endColumn; column++) {
                Cell cell = row.getCell(column);
                if(cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK){
                    String cellValue = cell.toString();
                    String loc = convertColumnNumberToString(column) + (row.getRowNum() + 1);
                    if(!isBlank(cellValue) && !cellLocations.contains(loc)){
                        cellLocations.add(loc);
                    }
                }
            }
        }

        if(isEmpty(cellLocations)){
            return "";
        }

        String firstElement = cellLocations.get(0);
        String lastElement = cellLocations.get(cellLocations.size() - 1);
        if(!lastElement.equals(firstElement)){
            return firstElement + " to " + lastElement;
        }else {
            return firstElement;
        }
    }

    /**
     * Helper method to figure out if a row is a rate description
     * @param row
     * @return true if rate description and false otherwise
     */
    private boolean isRateDescription(Row row){
        String value = getColumnValues(row, 0, 3);
        return value != null && !value.isEmpty() && value.contains("Rate Description");
    }

    private boolean isDistinctRateDescription(HSSFSheet sheet, Row row){
        String rateDescription = getRateDescriptionValue(sheet, row);
        if(!distinctRateDescriptions.contains(rateDescription)){
            distinctRateDescriptions.add(rateDescription);
            return true;
        }else{
            return false;
        }
    }

    private boolean isDistinctNetwork(Row row){
        String network = getNetwork(row);
        String key = rateDescription + "_" + network;
        if(!distinctNetworks.contains(key)){
            distinctNetworks.add(key);
            return true;
        }else{
            return false;
        }
    }

    private boolean isDistinctPlan(Row row){
        String plan = getPlanName(row);

        String key = rateDescription + "_" + network + "_" + plan;
        if(!distinctPlans.contains(key)){
            distinctPlans.add(key);
            return true;
        }else{
            return false;
        }
    }

    /**
     * Row Description spans three rows(currentRow, currentRow+1, currentRow+2)
     * then columns E, F and G.
     */
    private String getRateDescriptionValue(HSSFSheet sheet, Row row){
        int rowNumber = row.getRowNum();
        String currentRowValue = getColumnValues(row, 4, 6);
        String currentRowValue2 = getColumnValues(sheet.getRow(rowNumber+1), 4, 6);
        String currentRowValue3 = getColumnValues(sheet.getRow(rowNumber+2), 4, 6);

        return (currentRowValue + currentRowValue2 + currentRowValue3);
    }

    private String getRateDescriptionLocation(Row row){
        return getColumnLocationDetail(row, 4, 6);
    }

    private boolean isNetwork(Row row){
        String firstColumn = getColumn(row, 0);
        String fourthColumn = getColumn(row, 4); // tells the difference for vision plans
        String firstTwoColumnValue = getColumnValues(row, 0, 1);
        String allColumnValues = getColumnValues(row, 7, 12);

        return !firstColumn.isEmpty() && !firstTwoColumnValue.isEmpty() && fourthColumn.isEmpty() && allColumnValues != null &&
                allColumnValues.isEmpty() && firstColumn.indexOf(HSA_ADMIN_FEE_STRING) == -1;
    }

    private boolean isPlan(Row row){
        String firstColumn = getColumn(row, 0);
        String secondColumn = getColumn(row, 1);
        String allColumnValues = getColumnValues(row, 1, 10);

        return firstColumn != null && firstColumn.equals("") && !secondColumn.isEmpty() && !allColumnValues.isEmpty();
    }

    private boolean isPlanDetails(Row row){
        String firstTwoColumns = getColumnValues(row, 0, 1);
        String thirdColumn = getColumn(row, 2);
        String allColumnValues = getColumnValues(row, 2, 12);

        String fifthColumn = getColumn(row, 5); // should not contain 'single' keyword

        return firstTwoColumns != null && firstTwoColumns.equals("") && !thirdColumn.isEmpty()
                && allColumnValues != null && !allColumnValues.isEmpty()
                && !fifthColumn.contains("Single");
    }

    private boolean isAssumedEnrollement(Row row){

        String firstTwoColumns = getColumnValues(row, 0, 1);
        String thirdColumn = getColumn(row, 2);
        String allColumnValues = getColumnValues(row, 2, 4);

        return firstTwoColumns != null && firstTwoColumns.equals("") && !thirdColumn.isEmpty()
                && allColumnValues != null && !allColumnValues.isEmpty() && containsIgnoreCase(allColumnValues, "Assumed Enrollment");
    }

    private String getNetwork(Row row){
        String networkName = getColumnValues(row, 0, 11);

        if(rateDescription.contains(DENTAL_QUOTE_IDENTIFIER) && networkName.toUpperCase().contains("DHMO")){
            networkName = "DHMO"; // per Ojas, change dental network name in quote to DHMO
        }

        return networkName;
    }

    private String getPlanName(Row row){
        return getColumnValues(row, 1, 10);
    }

    private String getPlanDetails(Row row){
        return getColumnValues(row, 2, 12);
    }

    private String getPlanLocation(Row row){
        return getColumnLocationDetail(row, 2, 12);
    }

    private String replaceAllSpecialCharacters(String string){
        String result = "";
        if(string != null && !string.isEmpty()) {
            result = string.replaceAll("\\n", "");
            result = result.replaceAll("\\t", "");
        }
        return result;
    }

    @Override
    public LinkedHashMap<String, RateDescriptionDTO> getAllMedicalParsedPlanInformation() {
        return allMedicalParsedPlanInformation;
    }

    public void setAllMedicalParsedPlanInformation(LinkedHashMap<String, RateDescriptionDTO> allMedicalParsedPlanInformation) {
        this.allMedicalParsedPlanInformation = allMedicalParsedPlanInformation;
    }

    @Override
    public LinkedHashMap<String, RateDescriptionDTO> getAllVisionParsedPlanInformation() {
        return allVisionParsedPlanInformation;
    }

    public void setAllVisionParsedPlanInformation(LinkedHashMap<String, RateDescriptionDTO> allVisionParsedPlanInformation) {
        this.allVisionParsedPlanInformation = allVisionParsedPlanInformation;
    }

    @Override
    public LinkedHashMap<String, RateDescriptionDTO> getAllDentalParsedPlanInformation() {
        return allDentalParsedPlanInformation;
    }

    public void setAllDentalParsedPlanInformation(LinkedHashMap<String, RateDescriptionDTO> allDentalParsedPlanInformation) {
        this.allDentalParsedPlanInformation = allDentalParsedPlanInformation;
    }

    @Override
    public int getTiers() {
        return TIER_RATE_SYSTEM;
    }

    /** Utility methods start below **/
    private void print(String str){
        if(DEBUG){
            System.out.println(str);
        }
    }
}
