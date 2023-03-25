package com.benrevo.be.modules.admin.domain.quotes.parsers.uhc;

import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.data.persistence.entities.BenefitName;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import com.monitorjbl.xlsx.StreamingReader;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.util.StringUtils;

import java.io.InputStream;
import java.util.*;

import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.springframework.web.util.HtmlUtils.htmlEscape;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;


/**
 * Created by awelemdyorakwue on 5/2/17.
 */
public class UHCDentalQuoteParser extends UHCBaseParser {

    private static final Logger LOGGER = LogManager.getLogger(UHCDentalQuoteParser.class);
    private boolean DEBUG = true;

    private int tier;
    private String DENTAL_SERVICES_CATEGORY = "Dental Services";
    private String LEGAL_ENTITY_CATEGORY = "Legal Entity";
    private String DIAGNOSTIC_CATEGORY = "Diagnostic Service";
    private String PREVENTIVE_CATEGORY = "Preventive Services";
    private String BASIC_CATEGORY = "Basic Services";
    private String MAJOR_CATEGORY = "Major Services";
    private String ORTHODONTIC_CATEGORY = "Orthodontic Services";
    private String ENROLLMENT_CATEGORY = "Assumed Enrollment and Rates";
    private String MONTHLY_COST_CATEGORY = "Monthly Premium";
    private String ANNUAL_COST_CATEGORY = "Annual Premium";
    private String DISCLAIMERS_ROW = "Disclaimers";
    private String RATE_GUARANTEE_CATEGORY = "Rate Guarantee";
    private String EMPLOYER_CONTRIBUTION = "Employer Contribution";

    private Map<String, String> dppoDentalBenefits = new ImmutableMap.Builder<String, String>()
        .put("DENTAL_INDIVIDUAL","IN_OUT")
        .put("DENTAL_FAMILY","IN_OUT")
        .put("WAIVED_FOR_PREVENTIVE","IN")
        .put("CALENDAR_YEAR_MAXIMUM","IN_OUT")
        .put("CLASS_1_PREVENTIVE","IN_OUT")
        .put("CLASS_2_BASIC","IN_OUT")
        .put("CLASS_3_MAJOR","IN_OUT")
        .put("CLASS_4_ORTHODONTIA","IN_OUT")
        .put("ORTHODONTIA_LIFETIME_MAX","IN_OUT")
        .put("ORTHO_ELIGIBILITY","IN_OUT")
        .put("IMPLANT_COVERAGE","IN_OUT")
        .put("REIMBURSEMENT_SCHEDULE","IN")
        .build();

    private List<BenefitName> benefitNames = null;

    public ArrayList<UHCNetworkDetails> parseQuotes(InputStream fis, List<BenefitName> benefitNames)
        throws Exception {
        this.benefitNames = benefitNames;
        ArrayList<UHCNetworkDetails> options = null;
        Workbook myWorkBook = null;

        try {
            myWorkBook = StreamingReader.builder()
                .rowCacheSize(100)
                .bufferSize(4096)
                .open(fis);

            options = parseDentalQuote(myWorkBook.getSheet("Dental_Coverage"));
            if(myWorkBook.getSheetIndex("Disclaimers") != -1) {
                disclaimer = parseDentalDisclaimer(myWorkBook.getSheet("Disclaimers"));
            }
            if(myWorkBook.getSheetIndex("Dental_Assumptions") != -1) {
            	String assumptions = parseDentalAssumptions(myWorkBook.getSheet("Dental_Assumptions"));
                disclaimer = ObjectUtils.firstNonNull(disclaimer, "") + assumptions;
            }
        } finally {
            if(myWorkBook != null) {
                myWorkBook.close();
            }
        }

        return options;
    }

    private String parseDentalDisclaimer(Sheet sheet) {
        StringBuilder result = new StringBuilder();

        if(sheet != null) {
            sheet.forEach(
                r -> {
                    String data = getColumnAsString(r, 0, false);
                    boolean disclaimersRow = getColumnAsString(r, 4, false)
                        .contains(DISCLAIMERS_ROW);

                    if(isNotBlank(data) && !disclaimersRow) {
                        if(data.startsWith("This proposal")) {
                            data = "<div>" + data + "</div><div>&nbsp;</div>";

                            result.append(data);
                        } else {
                            String[] ps = data.split("\\r?\\n");

                            for(String s : ps) {
                                result.append("<div>")
                                    .append(s.isEmpty() ? "&nbsp;" : s)
                                    .append("</div>");
                            }
                        }
                    }
                }
            );
        }
        return htmlEscape(result.toString());
    }
    
    private String parseDentalAssumptions(Sheet sheet) {
        StringBuilder result = new StringBuilder();

        boolean generalAssumptions = false;
        boolean dentalAssumptions = false;
        
        if(sheet != null) {
        	Iterator<Row> it = sheet.rowIterator();
        	while (it.hasNext()) {
				Row row = (Row) it.next();
                String data = getColumnAsString(row, 0, false);
                data = data.trim();
                if(data.contains("General Assumptions")) {
            		generalAssumptions = true;
            		data = buildAssumptionRow(row, data);
            	} else if(data.contains("Dental Assumptions")) {
            		dentalAssumptions = true;
            		data = buildAssumptionRow(row, data);
            	} else if(data.contains("Please note that the summary of benefits")) {
            		data = "<b>" + data + "</b>";
            	}
                if(!generalAssumptions && !dentalAssumptions) {
                	continue;
                }

                if(!data.isEmpty()) {
                	result.append("<div>&nbsp;</div>");
                	result.append("<div>" + data + "</div>");
                }
            }
        }
        return htmlEscape(result.toString());
    }
    
    private String buildAssumptionRow(Row row, String rowValue) {
    	String subGroup = getColumnAsString(row, 3, false) + getColumnAsString(row, 4, false);
		subGroup = subGroup.trim();
		if (isNotBlank(subGroup)) {
			subGroup = " (" + subGroup + ")";
		} 
		return "<b>" + rowValue + subGroup + "</b>";
    }
    
    private ArrayList<UHCNetworkDetails> parseDentalQuote(Sheet sheet) {
        Iterator<Row> rowIterator = sheet.iterator();

        ArrayList<UHCRelatedOptions> allOptions = new ArrayList<UHCRelatedOptions>();
        LinkedHashMap<String, String> keys = new LinkedHashMap<String, String>();
        LinkedHashMap<String, UHCNetworkDetails> e = null;
        String category = "";
        while(rowIterator.hasNext()) {
            Row row = rowIterator.next();

            if(isCategory(row, DENTAL_SERVICES_CATEGORY)) {
                category = DENTAL_SERVICES_CATEGORY;
                keys = generateKeys(row);
                e = new LinkedHashMap<String, UHCNetworkDetails>();
                for(String str : keys.keySet()) {
                    UHCNetworkDetails net = new UHCNetworkDetails();
                    setNetworkDetail(net, row, str, keys.get(str), category);
                    e.put(str, net);
                }
            } else if(isCategory(row, LEGAL_ENTITY_CATEGORY)) {
                category = LEGAL_ENTITY_CATEGORY;

                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()) {
                    UHCNetworkDetails net = e.get(str);
                    setNetworkDetail(net, row, str, keys.get(str), category);
                    e.put(str, net);
                }
            } else if(isCategory(row, DIAGNOSTIC_CATEGORY)) {
                category = DIAGNOSTIC_CATEGORY;
            } else if(isCategory(row, PREVENTIVE_CATEGORY)) {
                category = PREVENTIVE_CATEGORY;
            } else if(isCategory(row, BASIC_CATEGORY)) {
                category = BASIC_CATEGORY;
            } else if(isCategory(row, MAJOR_CATEGORY)) {
                category = MAJOR_CATEGORY;
            } else if(isCategory(row, ORTHODONTIC_CATEGORY)) {
                category = ORTHODONTIC_CATEGORY;
            } else if(isCategory(row, ENROLLMENT_CATEGORY)) {
                category = ENROLLMENT_CATEGORY;

                // check if renewal option
                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()) {
                    UHCNetworkDetails net = e.get(str);
                    if(keys.get(str).equalsIgnoreCase("CurrentRenewal")){
                        net.setRenewalRateAvailable(true);
                    }
                    e.put(str, net);
                }
            } else if(isCategory(row, MONTHLY_COST_CATEGORY)) {
                category = MONTHLY_COST_CATEGORY;
                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()) {
                    UHCNetworkDetails net = e.get(str);
                    net.setMonthlyCost(keys.get(str));
                    e.put(str, net);
                }
            } else if(isCategory(row, ANNUAL_COST_CATEGORY)) {
                category = ANNUAL_COST_CATEGORY;

                UHCRelatedOptions relatedOptions = new UHCRelatedOptions();
                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()) {
                    UHCNetworkDetails net = e.get(str);
                    net.setAnnualCost(keys.get(str));
                    e.put(str, net);

                    if(!net.getFullPlanName().trim().isEmpty()) {
                        // simple check for validity of the option
                        net.setFullPlanName(net.getFullPlanName().trim());
                        net.setLegalEntityName(net.getLegalEntityName().trim());
                        net = defaultBenefitsNotFound(net, dppoDentalBenefits, benefitNames);
                        relatedOptions.getNetworkDetails().add(net);
                    }
                }

                // set all options
                if(relatedOptions.getNetworkDetails().size() != 0) {
                    allOptions.add(relatedOptions);
                }
                category = "";
            } else if(category.equals(DENTAL_SERVICES_CATEGORY) ||
                      category.equals(LEGAL_ENTITY_CATEGORY) ||
                      category.equals(ENROLLMENT_CATEGORY) ||
                      category.equals(ORTHODONTIC_CATEGORY) ||
                      category.equals(MAJOR_CATEGORY) ||
                      category.equals(DIAGNOSTIC_CATEGORY) ||
                      category.equals(PREVENTIVE_CATEGORY) ||
                      category.equals(BASIC_CATEGORY)) {

                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()) {
                    UHCNetworkDetails net = e.get(str);
                    setNetworkDetail(net, row, str, keys.get(str), category);
                    e.put(str, net);
                }
            } else if(isCategory(row, RATE_GUARANTEE_CATEGORY)){
            	keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = e.get(str);
                    net.addAttribute(QuotePlanAttributeName.CONTRACT_LENGTH,keys.get(str));
                }
            } else if(isCategory(row, EMPLOYER_CONTRIBUTION)){
                // merged cells with different values, so take only first columns
                updateKeySetWithFirstValues(keys, row);
                for(String str : keys.keySet()){
                    if (containsIgnoreCase(keys.get(str), "voluntary")) {
                        UHCNetworkDetails net = e.get(str);
                        net.setVoluntary(true);
                    }
                }
            }
            
            
        }

        ArrayList<UHCNetworkDetails> networks = associateAlternativesToNetworks(allOptions);
        return networks;
    }

    private LinkedHashMap<String, String> generateKeys(Row row) {
        int i = 2;
        boolean generateKey = true;

        LinkedHashMap<String, String> allKeys = new LinkedHashMap<String, String>();
        while(generateKey) {
            String key = i + " " + (i + 1) + " " + (i + 2) + " " + (i + 3);

            String columnValue = getColumnValues(row, i, i + 3);

            if(columnValue == null || columnValue.isEmpty()) {
                generateKey = false;
            } else {
                i = (i + 4);
                allKeys.put(key, columnValue);
            }
        }

        return allKeys;
    }

    private void setNetworkDetail(
        UHCNetworkDetails net,
        Row row,
        String key,
        String value,
        String category
    ) {
        String firstColumn = getColumn(row, 0);

        String[] keySplit = key.split(" ");
        if(category.equals(DENTAL_SERVICES_CATEGORY)) {
            if(StringUtils.isEmpty(firstColumn) && !StringUtils.isEmpty(value)) {
                String tempFN = net.getFullPlanName() != null ? net.getFullPlanName() : "";
                net.setFullPlanName(tempFN.trim() + " " + value);
            } else if(!StringUtils.isEmpty(firstColumn) && !StringUtils.isEmpty(value)) {
                // This is where the DHMO network name is indicated too, if so then set
                // networkName and don't add to plan name
                if(value.equals("DMO")) {
                    net.setNetworkName("Full Network");
                    net.setNetworkType("DHMO");
                }
                // They also put some sort of PPO network name at times... which should be ignored
                else if(value.trim().endsWith(" PPO")) {
                    // skip it
                } else {
                    net.setFullPlanName(value);
                }
            }
        } else if(category.equals(ENROLLMENT_CATEGORY) || category.equals(ORTHODONTIC_CATEGORY) ||
                  category.equals(MAJOR_CATEGORY) ||
                  category.equals(DIAGNOSTIC_CATEGORY) || category.equals(PREVENTIVE_CATEGORY) ||
                  category.equals(BASIC_CATEGORY)) {
            switch(firstColumn) {
                case "PPO Network":
                    net.setNetworkName(value);
                    break;
                case "Employee":
                case "Employee + 1":
                case "Employee + One":
                case "Employee + Child":
                case "Employee + Spouse":
                case "Employee + Child(ren)":
                case "Employee + Family":
                    String censusValue = "";
                    String tierRateValue = "";
                    String tierRateCurrentValue = "";
                    if(net.isRenewalRateAvailable()) {
                        censusValue = getColumn(row, Integer.parseInt(keySplit[0]));
                        tierRateCurrentValue = getColumn(row, Integer.parseInt(keySplit[1]));
                        tierRateValue = getColumn(row, Integer.parseInt(keySplit[2]));
                        tierRateCurrentValue = tierRateCurrentValue.isEmpty() ? "0.0" : tierRateCurrentValue.substring(1);
                    }else{
                        censusValue = getColumn(row, Integer.parseInt(keySplit[1]));
                        tierRateValue = getColumn(row, Integer.parseInt(keySplit[2]));
                    }
                    censusValue = censusValue.isEmpty() ? "0" : censusValue;
                    tierRateValue = tierRateValue.isEmpty() ? "0.0" : tierRateValue.substring(1);

                    if(isEmpty(net.getTier1Rate())){
                        tier = 1;
                        net.setTier1Rate(tierRateValue);
                        net.setTier1CurrentRate(tierRateCurrentValue);
                    }else if(!isEmpty(net.getTier1Rate()) && isEmpty(net.getTier2Rate())){
                        tier = 2;
                        net.setTier2Rate(tierRateValue);
                        net.setTier2CurrentRate(tierRateCurrentValue);
                    }else if(!isEmpty(net.getTier1Rate()) && !isEmpty(net.getTier2Rate()) && isEmpty(net.getTier3Rate())){
                        tier = 3;
                        net.setTier3Rate(tierRateValue);
                        net.setTier3CurrentRate(tierRateCurrentValue);
                    }else if(!isEmpty(net.getTier1Rate()) && !isEmpty(net.getTier2Rate()) && !isEmpty(net.getTier3Rate()) && isEmpty(net.getTier4Rate())){
                        tier = 4;
                        net.setTier4Rate(tierRateValue);
                        net.setTier4CurrentRate(tierRateCurrentValue);
                    }

                    if(isEmpty(net.getTier1Census())){
                        net.setTier1Census(censusValue);
                    }else if(!isEmpty(net.getTier1Census()) && isEmpty(net.getTier2Census())){
                        net.setTier2Census(censusValue);
                    }else if(!isEmpty(net.getTier1Census()) && !isEmpty(net.getTier2Census()) && isEmpty(net.getTier3Census())){
                        net.setTier3Census(censusValue);
                    }else if(!isEmpty(net.getTier1Census()) && !isEmpty(net.getTier2Census()) && !isEmpty(net.getTier3Census()) && isEmpty(net.getTier4Census())){
                        net.setTier4Census(censusValue);
                    }
                    break;
                case "Deductible":
                    // Does not apply to DHMO
                    if(!"DHMO".equals(net.getNetworkType())) {
                        String deductibleIn = getColumn(row, Integer.parseInt(keySplit[0]));
                        if (!StringUtils.isEmpty(deductibleIn)) {
                            String[] in = (deductibleIn.contains("N/A")) ? 
                                    new String[]{"N/A","N/A"} :
                                    deductibleIn.split("/");
                            net.getGenericPlanDetails()
                               .addBenefit(benefitNames, "DENTAL_INDIVIDUAL", "IN", in[0]);
                            net.getGenericPlanDetails()
                               .addBenefit(benefitNames, "DENTAL_FAMILY", "IN", in[1]);
                        }
                        String deductibleOut = getColumn(row, Integer.parseInt(keySplit[2]));
                        if (!StringUtils.isEmpty(deductibleOut)) {
                            String[] out = (deductibleOut.contains("N/A")) ?
                                    new String[]{"N/A","N/A"} :
                                    deductibleOut.split("/");
                            net.getGenericPlanDetails()
                               .addBenefit(benefitNames, "DENTAL_INDIVIDUAL", "OUT", out[0]);
                            net.getGenericPlanDetails()
                               .addBenefit(benefitNames, "DENTAL_FAMILY", "OUT", out[1]);
                        }
                    }
                    break;
                case "Deductible applies to Prev. & Diag.":
                    // Does not apply to DHMO
                    if(!"DHMO".equals(net.getNetworkType())) {
                        String deductibleApplies = getColumnAsString(
                            row,
                            Integer.parseInt(keySplit[0])
                        );
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "WAIVED_FOR_PREVENTIVE",
                                       "IN",
                                       "No".equalsIgnoreCase(deductibleApplies) ? "No" : "Yes"
                           );
                    }
                    break;
                case "Annual Max":
                    // Does not apply to DHMO
                    if(!"DHMO".equals(net.getNetworkType())) {
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "CALENDAR_YEAR_MAXIMUM",
                                       "IN",
                                       getColumnAsString(row, Integer.parseInt(keySplit[0]))
                           );
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "CALENDAR_YEAR_MAXIMUM",
                                       "OUT",
                                       getColumnAsString(row, Integer.parseInt(keySplit[2]))
                           );
                    }
                    break;
                case "Dental Prophylaxis (Cleaning)":
                    // Does not apply to DHMO
                    if(!"DHMO".equals(net.getNetworkType())) {
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "CLASS_1_PREVENTIVE",
                                       "IN",
                                       getColumnAsString(row, Integer.parseInt(keySplit[0]))
                           );
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "CLASS_1_PREVENTIVE",
                                       "OUT",
                                       getColumnAsString(row, Integer.parseInt(keySplit[2]))
                           );
                    }
                    break;
                case "Restorations (Amalgams or Composite)*":
                    // Does not apply to DHMO
                    if(!"DHMO".equals(net.getNetworkType())) {
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "CLASS_2_BASIC",
                                       "IN",
                                       getColumnAsString(row, Integer.parseInt(keySplit[0]))
                           );
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "CLASS_2_BASIC",
                                       "OUT",
                                       getColumnAsString(row, Integer.parseInt(keySplit[2]))
                           );
                    }
                    break;
                case "Inlays/Onlays/Crowns":
                    // Does not apply to DHMO
                    if(!"DHMO".equals(net.getNetworkType())) {
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "CLASS_3_MAJOR",
                                       "IN",
                                       getColumnAsString(row, Integer.parseInt(keySplit[0]))
                           );
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "CLASS_3_MAJOR",
                                       "OUT",
                                       getColumnAsString(row, Integer.parseInt(keySplit[2]))
                           );
                    }
                    break;
                case "Orthodontia":
                    // Does not apply to DHMO
                    if(!"DHMO".equals(net.getNetworkType())) {
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "CLASS_4_ORTHODONTIA",
                                       "IN",
                                       getColumnAsString(row, Integer.parseInt(keySplit[0]))
                           );
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "CLASS_4_ORTHODONTIA",
                                       "OUT",
                                       getColumnAsString(row, Integer.parseInt(keySplit[2]))
                           );
                    }
                    break;
                case "Lifetime Ortho Max":
                    // Does not apply to DHMO
                    if(!"DHMO".equals(net.getNetworkType())) {
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "ORTHODONTIA_LIFETIME_MAX",
                                       "IN",
                                       getColumnAsString(row, Integer.parseInt(keySplit[0]))
                           );
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "ORTHODONTIA_LIFETIME_MAX",
                                       "OUT",
                                       getColumnAsString(row, Integer.parseInt(keySplit[2]))
                           );
                    }
                    break;
                case "Orthodontia Eligibility":
                    // Does not apply to DHMO
                    if(!"DHMO".equals(net.getNetworkType())) {
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "ORTHO_ELIGIBILITY",
                                       "IN",
                                       getColumnAsString(row, Integer.parseInt(keySplit[0]))
                           );
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "ORTHO_ELIGIBILITY",
                                       "OUT",
                                       getColumnAsString(row, Integer.parseInt(keySplit[0]))
                           );
                    }
                    break;
                case "Implants":
                    // Does not apply to DHMO
                    if(!"DHMO".equals(net.getNetworkType())) {
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "IMPLANT_COVERAGE",
                                       "IN",
                                       getColumnAsString(row, Integer.parseInt(keySplit[0]))
                           );
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "IMPLANT_COVERAGE",
                                       "OUT",
                                       getColumnAsString(row, Integer.parseInt(keySplit[2]))
                           );
                    }
                    break;
                case "Out of Network Basis":
                    // Does not apply to DHMO
                    if(!"DHMO".equals(net.getNetworkType())) {
                        net.getGenericPlanDetails()
                           .addBenefit(benefitNames,
                                       "REIMBURSEMENT_SCHEDULE",
                                       "IN",
                                       getColumnAsString(row, Integer.parseInt(keySplit[0]))
                           );
                    }
                    break;
            }
        } else if(category.equals(LEGAL_ENTITY_CATEGORY)) {
            if(StringUtils.isEmpty(firstColumn) && !StringUtils.isEmpty(value) &&
               !value.equals("In NetworkOut of Network")) {
                String tempLEN = net.getLegalEntityName() != null ? net.getLegalEntityName() : "";
                net.setLegalEntityName(tempLEN.trim() + " " + value);
            } else if(!StringUtils.isEmpty(firstColumn) && !StringUtils.isEmpty(value)) {
                net.setLegalEntityName(value);
            }
        }
    }

    private LinkedHashMap<String, String> replaceKeySetValues(
        LinkedHashMap<String, String> keys,
        Row row
    ) {
        LinkedHashMap<String, String> result = new LinkedHashMap<String, String>();
        for(String str : keys.keySet()) {
            String[] split = str.split(" ");

            String columnValue = getColumnValues(
                row,
                Integer.parseInt(split[0]),
                Integer.parseInt(split[split.length - 1])
            );
            result.put(str, columnValue);
        }
        return result;
    }

    private void updateKeySetWithFirstValues( LinkedHashMap<String, String> keys, Row row ) {
            for(String str : keys.keySet()) {
                String[] split = str.split(" ");
                String columnValue = getColumn(row, Integer.parseInt(split[0]));
                keys.put(str, columnValue);
            }
    }

    
    /**
     * Returns network name to plans
     * e.g Options DPPO 20 -> Incentive PPO(main) which has plan alternatives
     *
     * @param options
     *
     * @return
     */
    private ArrayList<UHCNetworkDetails> associateAlternativesToNetworks
    (ArrayList<UHCRelatedOptions> options) {
        ArrayList<UHCNetworkDetails> result = new ArrayList<UHCNetworkDetails>();
        for(UHCRelatedOptions option : options) {
            for(UHCNetworkDetails det : option.getNetworkDetails()) {

                if(det.isLinkedWithAlternativePlanAlready()) {
                    continue;
                }

                UHCNetworkDetails alternative = findAlternative(options, det);
                if(alternative != null) {
                    det.getAlternatives().add(alternative);
                }
                result.add(det);
            }
        }
        return result;
    }

    private UHCNetworkDetails findAlternative(
        ArrayList<UHCRelatedOptions> options,
        UHCNetworkDetails det
    ) {
        UHCNetworkDetails result = null;
        for(UHCRelatedOptions option : options) {
            for(UHCNetworkDetails networkDetails : option.getNetworkDetails()) {
                String networkName = networkDetails.getNetworkName();
                if(networkName != null && networkName.equals(det.getNetworkName())
                    && getValueOrDefault(networkDetails.getTier1Census(), "0").equals(getValueOrDefault(det.getTier1Census(), "0"))
                    && getValueOrDefault(networkDetails.getTier2Census(), "0").equals(getValueOrDefault(det.getTier2Census(), "0"))
                    && getValueOrDefault(networkDetails.getTier3Census(), "0").equals(getValueOrDefault(det.getTier3Census(), "0"))
                    && getValueOrDefault(networkDetails.getTier4Census(), "0").equals(getValueOrDefault(det.getTier4Census(), "0"))
                   && networkDetails.getLegalEntityName().contains("Alternate")) {
                    result = networkDetails;
                    result.setLinkedWithAlternativePlanAlready(true);
                    break;
                }
            }
            if(result != null) {
                break;
            }
        }
        return result;
    }

    public int getTier() {
        return tier;
    }
}
