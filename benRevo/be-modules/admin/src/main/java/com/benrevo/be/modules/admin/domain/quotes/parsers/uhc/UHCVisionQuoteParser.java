package com.benrevo.be.modules.admin.domain.quotes.parsers.uhc;

import com.benrevo.common.enums.QuotePlanAttributeName;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import com.monitorjbl.xlsx.StreamingReader;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.util.StringUtils;

import com.benrevo.data.persistence.entities.BenefitName;

import java.io.InputStream;
import java.util.*;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.springframework.web.util.HtmlUtils.htmlEscape;

/**
 * Created by awelemdyorakwue on 5/2/17.
 */
public class UHCVisionQuoteParser extends UHCBaseParser {

    private static final Logger LOGGER = LogManager.getLogger(UHCVisionQuoteParser.class);
    private boolean DEBUG = false;
    private int tier;

    private String VISION_SERVICES_CATEGORY = "Vision Services";
    private String LEGAL_ENTITY_CATEGORY = "Legal Entity";
    private String PLAN_OPTIONS_CATEGORY = "Plan Options";
    private String SERVICE_FREQUENCY_CATEGORY = "Service Frequency";
    private String EYE_EXAMINATION_CATEGORY = "Eye Examination";
    private String LENSES_CATEGORY = "Lenses";
    private String FRAMES_CATEGORY = "Frames";
    private String ELECTIVE_CONTACT_CATEGORY = "Elective Contact Lenses";
    private String LENSE_OPTIONS_CATEGORY = "Lens Options";
    private String VALUE_SERVICES_CATEGORY = "Value Services";
    private String ENROLLMENT_CATEGORY = "Assumed Enrollment and Rates";
    private String MONTHLY_COST_CATEGORY = "Monthly Premium";
    private String ANNUAL_COST_CATEGORY = "Annual Premium";
    private String DISCLAIMERS_ROW = "Disclaimers";
    private String RATE_GUARANTEE_CATEGORY = "Rate Guarantee";
    
    private List<BenefitName> benefitNames = null;

    private Map<String, String> visionBenefits = new ImmutableMap.Builder<String, String>()
        .put("EXAM_COPAY","IN")
        .put("MATERIALS_COPAY","IN")
        .put("EXAMS_FREQUENCY","IN")
        .put("LENSES_FREQUENCY","IN")
        .put("FRAMES_FREQUENCY","IN")
        .put("CONTACTS_FREQUENCY","IN")
        .put("FRAME_ALLOWANCE","IN")
        .put("CONTACTS_ALLOWANCE","IN")
        .build();


    public ArrayList<UHCNetworkDetails> parseVisionQuotes(InputStream fis, List<BenefitName> benefitNames) throws Exception{
    	this.benefitNames = benefitNames;
    	
        ArrayList<UHCNetworkDetails> options = null;
        Workbook myWorkBook = null;

        try {
            myWorkBook = StreamingReader.builder()
                .rowCacheSize(100)
                .bufferSize(4096)
                .open(fis);

            options = parseVisionQuote(myWorkBook.getSheet("Vision_Coverage"));
            if(myWorkBook.getSheetIndex("Disclaimers") != -1) {
                disclaimer = parseVisionDisclaimer(myWorkBook.getSheet("Disclaimers"));
            }
            if(myWorkBook.getSheetIndex("Vision_Assumptions") != -1) {
            	String assumptions = parseVisionAssumptions(myWorkBook.getSheet("Vision_Assumptions"));
                disclaimer = ObjectUtils.firstNonNull(disclaimer, "") + assumptions;
            }
        } finally {
            if(myWorkBook != null) {
                myWorkBook.close();
            }
        }

        return options;
    }

    private String parseVisionDisclaimer(Sheet sheet) {
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
    
    private String parseVisionAssumptions(Sheet sheet) {
        StringBuilder result = new StringBuilder();

        boolean generalAssumptions = false;
        boolean visionAssumptions = false;
        
        if(sheet != null) {
        	Iterator<Row> it = sheet.rowIterator();
        	while (it.hasNext()) {
				Row row = (Row) it.next();
                String data = getColumnAsString(row, 0, false);
                data = data.trim();
                if(data.contains("General Assumptions")) {
            		generalAssumptions = true;
            		data = buildAssumptionRow(row, data);
            	} else if(data.contains("Vision Assumptions")) {
            		visionAssumptions = true;
            		data = buildAssumptionRow(row, data);
            	} else if(data.contains("Please note that the summary of benefits")) {
            		data = "<b>" + data + "</b>";
            	}
                if(!generalAssumptions && !visionAssumptions) {
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

    private ArrayList<UHCNetworkDetails> parseVisionQuote(Sheet sheet){
        Iterator<Row> rowIterator = sheet.iterator();

        ArrayList<UHCRelatedOptions> allOptions = new ArrayList<UHCRelatedOptions>();
        LinkedHashMap<String, String> keys = new LinkedHashMap<String, String>();
        LinkedHashMap<String, UHCNetworkDetails> e = null;
        String category = "";
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();

            if(isCategory(row, VISION_SERVICES_CATEGORY)){
                category = VISION_SERVICES_CATEGORY;
                keys = generateKeys(row);
                e = new LinkedHashMap<String, UHCNetworkDetails>();
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = new UHCNetworkDetails();
                    setNetworkDetail(net, row, str, keys.get(str), VISION_SERVICES_CATEGORY);
                    e.put(str, net);
                }
            }else if(isCategory(row, LEGAL_ENTITY_CATEGORY)){
                category = LEGAL_ENTITY_CATEGORY;
                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = e.get(str);
                    setNetworkDetail(net, row, str, keys.get(str), category);
                    e.put(str, net);
                }

            }else if(isCategory(row, PLAN_OPTIONS_CATEGORY)){
                category = PLAN_OPTIONS_CATEGORY;
            }else if(isCategory(row, SERVICE_FREQUENCY_CATEGORY)){
                category = SERVICE_FREQUENCY_CATEGORY;
            }else if(isCategory(row, EYE_EXAMINATION_CATEGORY)){
                category = EYE_EXAMINATION_CATEGORY;
            }else if(isCategory(row, LENSES_CATEGORY)){
                category = LENSES_CATEGORY;
            }else if(isCategory(row, FRAMES_CATEGORY)){
                category = FRAMES_CATEGORY;
            }else if(isCategory(row, ELECTIVE_CONTACT_CATEGORY)){
                category = ELECTIVE_CONTACT_CATEGORY;
            }else if(isCategory(row, LENSE_OPTIONS_CATEGORY)){
                category = LENSE_OPTIONS_CATEGORY;
            }else if(isCategory(row, VALUE_SERVICES_CATEGORY)){
                category = VALUE_SERVICES_CATEGORY;
            }else if(isCategory(row, ENROLLMENT_CATEGORY)){
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
            }else if(isCategory(row, MONTHLY_COST_CATEGORY)){
                category = MONTHLY_COST_CATEGORY;
                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = e.get(str);
                    net.setMonthlyCost(keys.get(str));
                    e.put(str, net);
                }
            }else if(isCategory(row, ANNUAL_COST_CATEGORY)){
                category = ANNUAL_COST_CATEGORY;

                UHCRelatedOptions relatedOptions = new UHCRelatedOptions();
                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = e.get(str);
                    net.setAnnualCost(keys.get(str));
                    e.put(str, net);

                    if(!net.getFullPlanName().trim().isEmpty()) {
                        // simple check for validity of the option
                        net.setFullPlanName(net.getFullPlanName().trim());
                        net.setLegalEntityName(net.getLegalEntityName().trim());
                        net = defaultBenefitsNotFound(net, visionBenefits, benefitNames);
                        relatedOptions.getNetworkDetails().add(net);
                    }
                }

                // set all options
                if(relatedOptions.getNetworkDetails().size() != 0){
                    allOptions.add(relatedOptions);
                }
                category = "";

            }else if(category.equals(VISION_SERVICES_CATEGORY) || category.equals(LEGAL_ENTITY_CATEGORY) ||
                    category.equals(PLAN_OPTIONS_CATEGORY) || category.equals(SERVICE_FREQUENCY_CATEGORY) ||
                    category.equals(EYE_EXAMINATION_CATEGORY) || category.equals(LENSES_CATEGORY) ||
                    category.equals(FRAMES_CATEGORY) || category.equals(ELECTIVE_CONTACT_CATEGORY) ||
                    category.equals(LENSE_OPTIONS_CATEGORY) || category.equals(VALUE_SERVICES_CATEGORY) ||
                    category.equals(ENROLLMENT_CATEGORY)){
                    keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = e.get(str);
                    setNetworkDetail(net, row, str, keys.get(str), category);
                    e.put(str, net);
                }
            }else if(isCategory(row, RATE_GUARANTEE_CATEGORY)){
            	keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = e.get(str);
                    net.addAttribute(QuotePlanAttributeName.CONTRACT_LENGTH,keys.get(str));
                }
            }
        }

        ArrayList<UHCNetworkDetails> networks = associateAlternativesToNetworks(allOptions);
        return networks;
    }

    /**
     * Returns network name to plans
     * e.g Options DPPO 20 -> Incentive PPO(main) which has plan alternatives
     * @param options
     * @return
     */
    private ArrayList<UHCNetworkDetails> associateAlternativesToNetworks(ArrayList<UHCRelatedOptions> options){
        ArrayList<UHCNetworkDetails> result = new  ArrayList<UHCNetworkDetails>();
        for(UHCRelatedOptions option : options){
            for(UHCNetworkDetails det : option.getNetworkDetails()){

                if(det.isLinkedWithAlternativePlanAlready()){
                    continue;
                }

                UHCNetworkDetails alternative = findAlternative(options, det);
                if(alternative != null){
                    det.getAlternatives().add(alternative);
                }
                result.add(det);
            }
        }
        return result;
    }

    private UHCNetworkDetails findAlternative(ArrayList<UHCRelatedOptions> options, UHCNetworkDetails det){
        UHCNetworkDetails result = null;
        for(UHCRelatedOptions option : options) {
            for (UHCNetworkDetails networkDetails : option.getNetworkDetails()) {
                String networkName = networkDetails.getNetworkName();
                if(networkName.equals(det.getNetworkName())
                        && getValueOrDefault(networkDetails.getTier1Census(), "0").equals(getValueOrDefault(det.getTier1Census(), "0"))
                        && getValueOrDefault(networkDetails.getTier2Census(), "0").equals(getValueOrDefault(det.getTier2Census(), "0"))
                        && getValueOrDefault(networkDetails.getTier3Census(), "0").equals(getValueOrDefault(det.getTier3Census(), "0"))
                        && getValueOrDefault(networkDetails.getTier4Census(), "0").equals(getValueOrDefault(det.getTier4Census(), "0"))
                        && networkDetails.getLegalEntityName().contains("Alternate")){
                    result = networkDetails;
                    result.setLinkedWithAlternativePlanAlready(true);
                    break;
                }
            }
            if (result != null) {
                break;
            }
        }
        return result;
    }

    private void setNetworkDetail(UHCNetworkDetails net, Row row, String key, String value, String category) {
        String firstColumn = getColumn(row, 0);
        String[] keySplit = key.split(" ");
        if(category.equals(VISION_SERVICES_CATEGORY)){
            if(StringUtils.isEmpty(firstColumn) && !StringUtils.isEmpty(value) ){
                String tempFN = net.getFullPlanName() != null ? net.getFullPlanName() : "";
                net.setFullPlanName(tempFN.trim() + " " + value);
            }else if(!StringUtils.isEmpty(firstColumn) && !StringUtils.isEmpty(value)){
                net.setFullPlanName(value);
            }
        }else if (category.equals(VISION_SERVICES_CATEGORY) ||
                category.equals(PLAN_OPTIONS_CATEGORY)      ||
                category.equals(SERVICE_FREQUENCY_CATEGORY) ||
                category.equals(ENROLLMENT_CATEGORY)        ||
                category.equals(FRAMES_CATEGORY)            ||
                category.equals(ELECTIVE_CONTACT_CATEGORY)) {

            switch (firstColumn) {
                case "Contribution":
                    // get first column, may be merged columns
                    String str = getColumn(row, Integer.parseInt(keySplit[0]));
                    if (containsIgnoreCase(str, "voluntary")) {
                        net.setVoluntary(true);
                    }
                    net.setPlanOptionContribution(value);
                    break;
                case "Product Type":
                    net.setPlanOptionProductType(value);
                    break;
                case "Network Type":
                    net.setNetworkName(value);
                    break;
                case "Exam Co-pay":
                    net.setPlanOptionExamCopayInNetwork(getColumnValues(row, 2, 3));
                    net.setPlanOptionExamCopayOutNetwork(getColumnValues(row, 4, 5));
                    net.getGenericPlanDetails().addBenefit(benefitNames, "EXAM_COPAY", "IN", getColumnAsString(row, Integer.parseInt(keySplit[0])));
                    break;
                case "Material Co-pay (Frames/Spectacle Lenses or Contact Lenses)":
                    net.setPlanOptionMaterialCopayInNetwork(getColumnValues(row, 2, 3));
                    net.setPlanOptionMaterialCopayOutNetwork(getColumnValues(row, 4, 5));
                    net.getGenericPlanDetails().addBenefit(benefitNames, "MATERIALS_COPAY", "IN", getColumnAsString(row, Integer.parseInt(keySplit[0])));
                    break;
                case "Exams/ Lenses/ Frames/Contacts":
                    net.setServiceFrequenceyExams(value);
                    String[] valueSplit = getColumnAsString(row, Integer.parseInt(keySplit[0])).split("/");
                    net.getGenericPlanDetails().addBenefit(benefitNames, "EXAMS_FREQUENCY", "IN", valueSplit[0]);
                    net.getGenericPlanDetails().addBenefit(benefitNames, "LENSES_FREQUENCY", "IN", valueSplit[1]);
                    net.getGenericPlanDetails().addBenefit(benefitNames, "FRAMES_FREQUENCY", "IN", valueSplit[2]);
                    net.getGenericPlanDetails().addBenefit(benefitNames, "CONTACTS_FREQUENCY", "IN", valueSplit[3]);
                    break;
                case "Retail Frame Allowance":
                	String s = getColumnAsString(row, Integer.parseInt(keySplit[0]));
                    net.getGenericPlanDetails().addBenefit(benefitNames, "FRAME_ALLOWANCE", "IN", s.replaceAll("Up to ", ""));
                	break;
                case "Non-Selection Contacts":
                	String s2 = getColumnAsString(row, Integer.parseInt(keySplit[0]));
                    net.getGenericPlanDetails().addBenefit(benefitNames, "CONTACTS_ALLOWANCE", "IN", s2.replaceAll("Up to ", ""));
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
            }
        }else if(category.equals(LEGAL_ENTITY_CATEGORY)){
            if(StringUtils.isEmpty(firstColumn) && !StringUtils.isEmpty(value) && !value.equals("In NetworkOut of Network")){
                String tempLEN = net.getLegalEntityName() != null ? net.getLegalEntityName() : "";
                net.setLegalEntityName(tempLEN.trim() + " " + value);
            }else if(!StringUtils.isEmpty(firstColumn) && !StringUtils.isEmpty(value)){
                net.setLegalEntityName(value);
            }
        }
    }

    private LinkedHashMap<String, String> replaceKeySetValues(LinkedHashMap<String, String> keys, Row row){
        LinkedHashMap<String, String> result = new LinkedHashMap<String, String>();
        for(String str : keys.keySet()){
            String[] split = str.split(" ");

            String columnValue = getColumnValues(row, Integer.parseInt(split[0]), Integer.parseInt(split[split.length-1]));
            result.put(str, columnValue);
        }
        return result;
    }

    private LinkedHashMap<String, String> generateKeys(Row row){
        int i = 2;
        boolean generateKey = true;

        LinkedHashMap<String, String> allKeys = new LinkedHashMap<String, String>();
        while(generateKey){
            String key = i + " " + (i+1) + " " + (i+2) + " " + (i+3);

            String columnValue = getColumnValues(row, i, i+3);

            if(columnValue == null || columnValue.isEmpty()){
                generateKey = false;
            }else{
                i = (i+4);
                allKeys.put(key, columnValue);
            }
        }
        return allKeys;
    }

    public int getTier() {
        return tier;
    }
}
