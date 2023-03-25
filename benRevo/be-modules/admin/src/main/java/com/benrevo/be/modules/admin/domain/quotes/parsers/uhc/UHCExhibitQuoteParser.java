package com.benrevo.be.modules.admin.domain.quotes.parsers.uhc;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import com.benrevo.common.exception.BaseException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.springframework.web.util.HtmlUtils.htmlEscape;

/**
 * Created by ojas.sitapara on 5/18/17.
 */
public class UHCExhibitQuoteParser extends UHCBaseParser {

    private static final int MAX_OPTIONS_IN_A_ROW = 4;
    private static final int FORMAT1 = 1;
    private static final int FORMAT2 = 2;

    private static final Logger LOGGER = LogManager.getLogger(UHCExhibitQuoteParser.class);

    private static final String PLAN_NAME_CATEGORY = "Plan Name";
    private static final String OPTION_CATEGORY = "Product";
    private static final String PLAN_CATEGORY = "Plan";
    private static final String BENEFITS_IN_NETWORK_CATEGORY = "Benefits*";
    private static final String BENEFITS_CATEGORY = "Benefits";
    private static final String BENEFITS_OUT_NETWORK_CATEGORY = "Benefits*_Out_Of_Network";
    private static final String ENROLLMENT_CATEGORY = "Enrollment";
    private static final String RATES_CATEGORY = "Rates";
    private static final String RATES_HEADER_CATEGORY = "Rates Header";
    private static final String MONTHLY_COST_CATEGORY = "Monthly Cost";
    private static final String ANNUAL_COST_CATEGORY = "Annual Cost";
    private static final String INITIAL_DISCLAIMER_IDENTIFIER = "- Rates are guaranteed";
    private int tier;

    private LinkedHashMap<String, String> networkToRXPlanName = new LinkedHashMap<>();
    protected String ppoDisclaimer = null;
    private StringBuilder disclaimer = new StringBuilder(); 
    private boolean inDisclaimer = false;
    private boolean lastDisRowWasEmpty = false;

    public ArrayList<UHCRelatedOptions> parseExhibitSheet(Sheet mySheet, boolean isRenewal) {
        Iterator<Row> rowIterator = mySheet.iterator();

        ArrayList<UHCRelatedOptions> allOptions = new ArrayList<UHCRelatedOptions>();

        LinkedHashMap<String, UHCNetworkDetails> e = null;
        LinkedHashMap<String, String> keys = new LinkedHashMap<String, String>();
        String category = "";
        int format = 0;
        Row row = null;

        while (rowIterator.hasNext()) {
            Row prevRow = row;
            row = rowIterator.next();

            if (row.getZeroHeight()) {
                // skip hidden row
                continue;
            }

            String firstColumn = getColumn(row, 0);
            String columns = getColumnValues(row, 2, 4);

            if(isCategory(row, PLAN_NAME_CATEGORY)){
                // old format
                format = FORMAT1;
                category = PLAN_NAME_CATEGORY;
                keys = generateKeys(row);
                e = new LinkedHashMap<String, UHCNetworkDetails>();
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = new UHCNetworkDetails();
                    setNetworkDetail(net, row, str, keys.get(str), PLAN_NAME_CATEGORY, format);
                    e.put(str, net);
                    setNetworkToRXPlan(keys.get(str));
                }
            }else if(isCategory(row, OPTION_CATEGORY, FORMAT2)){
                // new file format
                format = FORMAT2;
                category = OPTION_CATEGORY;
                // Option names are in the previous row
                keys = generateKeys2(prevRow);
                e = new LinkedHashMap<String, UHCNetworkDetails>();
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = new UHCNetworkDetails();
                    setNetworkDetail(net, prevRow, str, keys.get(str), OPTION_CATEGORY, format);
                    e.put(str, net);
                    setNetworkToRXPlan(keys.get(str));
                }
                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = e.get(str);
                    setNetworkDetail(net, row, str, keys.get(str), PLAN_CATEGORY, format);
                    e.put(str, net);
                }

            }else if(format == FORMAT2 && isCategory(row, PLAN_CATEGORY, format)){
                category = PLAN_CATEGORY;
                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = e.get(str);
                    setNetworkDetail(net, row, str, keys.get(str), category, format);
                    e.put(str, net);
                }
            }else if(isCategory(row, BENEFITS_IN_NETWORK_CATEGORY, format)){
                category = BENEFITS_IN_NETWORK_CATEGORY;
            }else if(isCategory(row, BENEFITS_CATEGORY, format)){
                category = BENEFITS_IN_NETWORK_CATEGORY;
            }else if(isCategory(row, ENROLLMENT_CATEGORY, format)){
                category = ENROLLMENT_CATEGORY;
            }else if(isCategory(row, RATES_CATEGORY, format)){
                category = RATES_CATEGORY;
                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = e.get(str);
                    if(format == FORMAT1 && keys.get(str).equalsIgnoreCase("CurrentProposed")){
                        net.setRenewalRateAvailable(true);
                    }
                    if (format == FORMAT2) {
                        setNetworkDetail(net, row, str, keys.get(str), category, format);
                    }
                    e.put(str, net);
                }

                if (format == FORMAT2) {
                    category = RATES_HEADER_CATEGORY;
                }
            }else if (category.equals(RATES_HEADER_CATEGORY)) { 
                category = RATES_CATEGORY;
                // check if renewal option
                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()) {
                    UHCNetworkDetails net = e.get(str);
                    if(keys.get(str).equalsIgnoreCase("CurrentProposed")){
                        net.setRenewalRateAvailable(true);
                    }
                    e.put(str, net);
                }
            }else if(isCategory(row, MONTHLY_COST_CATEGORY, format)){
                category = MONTHLY_COST_CATEGORY;
                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = e.get(str);
                    net.setMonthlyCost(keys.get(str));
                    e.put(str, net);
                }
            }else if(isCategory(row, ANNUAL_COST_CATEGORY, format)){

                category = ANNUAL_COST_CATEGORY;
                UHCRelatedOptions relatedOptions = new UHCRelatedOptions();
                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = e.get(str);
                    net.setAnnualCost(keys.get(str));
                    e.put(str, net);

                    if(!net.getFullPlanName().trim().isEmpty()) {
                        // simple check for validity of the option
                        relatedOptions.getNetworkDetails().add(net);
                    }
                    if (format == FORMAT2) {
                        // check tier info
                        int tierInfo = NumberUtils.toInt(StringUtils.substringBefore(net.getTierInfo().trim()," "),0);
                        if (tierInfo != tier) {
                            throw new BaseException(String.format("Number of tiers %s differ from tier info: %s", tier, net.getTierInfo()));
                        }
                    }
                }

                // set all options
                if(relatedOptions.getNetworkDetails().size() != 0){
                    allOptions.add(relatedOptions);
                }
                category = "";

            }else if(category.equals(PLAN_NAME_CATEGORY) 
                    || category.equals(BENEFITS_IN_NETWORK_CATEGORY) 
                    || category.equals(BENEFITS_OUT_NETWORK_CATEGORY) 
                    || category.equals(ENROLLMENT_CATEGORY) 
                    || category.equals(RATES_CATEGORY)){

                if(category.equals(BENEFITS_IN_NETWORK_CATEGORY) && firstColumn.isEmpty() && columns.equals("Out of Network Single/Family")){
                    category = BENEFITS_OUT_NETWORK_CATEGORY;
                    continue;
                }

                keys = replaceKeySetValues(keys, row);
                for(String str : keys.keySet()){
                    UHCNetworkDetails net = e.get(str);
                    setNetworkDetail(net, row, str, keys.get(str), category, format);
                    e.put(str, net);
                }
            }else if(isRenewal && isDisclaimer(row)){
                inDisclaimer  = true;
            }
            
            if(inDisclaimer) {
                String disRow = getColumnAsString(row, 0).trim();
                if(!disRow.isEmpty() || !lastDisRowWasEmpty) {
                    if (disRow.isEmpty()) {
                        lastDisRowWasEmpty = true;
                        disRow = "<div> &nbsp; </div>";
                    } else {
                        lastDisRowWasEmpty = false;
                        disRow = parseDualColumns(disRow);
                        if(disRow.startsWith("-")) {
                            disRow = "<div>" + disRow;
                        } else if(disRow.startsWith("HRA/HSA Assumptions (If Applicable)")) {
                            disRow = "<div> &nbsp; </div><div><b>" + disRow + "</b></div><div> &nbsp; </div>";
                        }
                    }
                    if(disRow.startsWith("<div>") 
                            && disclaimer.length() > 0 
                            && disclaimer.charAt(disclaimer.length() - 1) != '>') {
                        disclaimer.append("</div>");
                    }
                    disclaimer.append(disRow);
                }
            }
        }

        if(isNotBlank(disclaimer)) {
            this.ppoDisclaimer = htmlEscape(disclaimer.toString());
        }
        return allOptions;
    }

    public LinkedHashMap<String, String> getNetworkToRXPlanName() {
        return networkToRXPlanName;
    }

    private void setNetworkToRXPlan(String value){

        // parse out network and default RX plan
        Matcher m = Pattern.compile("\\((.*?)\\)").matcher(value);
        String networkName = "";
        while(m.find()) {
            networkName = m.group(1);
        }

        String[] planSplit = value.split("Rx Plan:");
        String RXPlanName = "";

        if(planSplit.length == 2){
            RXPlanName = ((planSplit[1] != null) ? planSplit[1] : "").trim();
        }

        if(!RXPlanName.isEmpty() && !networkName.isEmpty()){
            networkToRXPlanName.put(networkName, RXPlanName);
        }else{
            LOGGER.warn("Exhibit Sheet Parser: Default RX Plan not found. Value=" + value);
        }

    }


    private void setNetworkDetail(UHCNetworkDetails net, Row row, String key, String value, String category, int format){
        int columnIndex = format == 1 ? 0 : 1;
        String firstColumn = getColumn(row, columnIndex).trim();

        String[] keySplit = key.split(" ");
        if(category.equals(PLAN_NAME_CATEGORY) || category.equals(BENEFITS_IN_NETWORK_CATEGORY) || category.equals(ENROLLMENT_CATEGORY) || category.equals(PLAN_CATEGORY) ){
            switch(firstColumn){
                case "Plan Name":
                    net.setFullPlanName(StringUtils.substringBefore(value, " "));
                    net.setShortPlanName(StringUtils.substringAfterLast(value, " "));
                    net.setCurrentRxPlanName(net.getShortPlanName());
                    break;
                case "Plan":
                    net.setFullPlanName(deriveCurrentPlanName(value));
                    net.setShortPlanName(StringUtils.substringAfterLast(value, " "));
                    net.setCurrentPlanName(net.getFullPlanName());
                    net.setCurrentRxPlanName(net.getShortPlanName());
                    break;
                case "Product":
                    net.setProduct(value);
                    if (format == 2) {
                        if(value.contains("-")) {
                            net.setNetworkName(StringUtils.substringAfterLast(value, "-"));
                        } else {
                            net.setNetworkName(deriveNetworkName(value));
                        }
                    }
                    break;
                case "Option":
                    net.setOption(value);
                    // Option can contain rxPlanName, see "Sample 4 tier PPO Renewal.xlsm"
                    int index = value.lastIndexOf(net.getCurrentRxPlanName());
                    if (index > 0 && value.charAt(index - 1) == ' ') {
                        net.setCurrentPlanName(value.substring(0, index - 1).trim());
                    } else {
                        net.setCurrentPlanName(value);
                    }
                    break;
                case "Plan Offering":
                    net.setPlanOffering(value);
                    break;
                case "Multiple Option with:":
                    net.setMultipleOptionWith(value);
                    break;
                case "HRA or HSA":
                    net.setNetworkType(value.contains("No") ?  "HRA" : "HSA");
                    break;
                case "Office Copay (PCP/SPC)":
                case "PCP/SPC Office Copay": 
                    net.setOfficeCopay(value);
                    break;
                case "Hospital Copays":
                case "OP/IP Copay":
                    net.setHospitalCopay(value);
                    break;
                case "UC/ER/Major Diag Copay":
                    net.setMajorDiagnosisCopay(value);
                    break;
                case "Other":
                case "Other Supplemental":
                //case "Mental Health":
                    net.setOtherBenefits(value);
                    break;
                case "Deductible":
                    net.setBenefitsDeductible(value);
                    break;
                case "Coinsurance":
                    net.setBenefitsCoInsurance(value);
                    break;
                case "Out-of-Pocket":
                    net.setBenefitsOutOfPocket(value);
                    break;
                case "Pharmacy":
                    net.setPharmacy(value);
                    break;
                case "Employee":
                case "Employee + 1":
                case "Employee + Sp / + 1":
                case "Employee + One":
                case "Employee + Child":
                case "Employee + Spouse":
                case "Employee + Child(ren)":
                case "Employee + Family":
                    value = value.isEmpty() ? "0" : value;
                    if(isEmpty(net.getTier1Census())){
                        net.setTier1Census(value);
                    }else if(!isEmpty(net.getTier1Census()) && isEmpty(net.getTier2Census())){
                        net.setTier2Census(value);
                    }else if(!isEmpty(net.getTier1Census()) && !isEmpty(net.getTier2Census()) && isEmpty(net.getTier3Census())){
                        net.setTier3Census(value);
                    }else if(!isEmpty(net.getTier1Census()) && !isEmpty(net.getTier2Census()) && !isEmpty(net.getTier3Census()) && isEmpty(net.getTier4Census())){
                        net.setTier4Census(value);
                    }
                    break;
                case "Total":
                    net.setCensusTotal(value);
                    break;
            }
        }else if(category.equals(BENEFITS_OUT_NETWORK_CATEGORY)){
            switch(firstColumn){
                case "Deductible":
                    net.setBenefitOutOfNetworkDeductible(value);
                    break;
                case "Coinsurance":
                    net.setBenefitOutOfNetworkCoInsurance(value);
                    break;
                case "Out of Pocket":
                    net.setBenefitOutOfNetworkOutOfPocket(value);
                    break;
            }
        }else if(category.equals(RATES_CATEGORY)){
            switch(firstColumn) {
                case "Rates":
                    net.setTierInfo(value);
                    break;
                case "Composite Rate":
                    tier = 1;
                    net.setTier1Rate(value);
                    break;
                case "Employee":
                case "Employee + 1":
                case "Employee + Sp / + 1":
                case "Employee + One":
                case "Employee + Child":
                case "Employee + Spouse":
                case "Employee + Child(ren)":
                case "Employee + Family":
                    String tierRateCurrentValue = null;
                    if(net.isRenewalRateAvailable()) {
                        tierRateCurrentValue = getColumn(row, Integer.parseInt(keySplit[0]));
                        tierRateCurrentValue = tierRateCurrentValue.isEmpty() ? "0" : tierRateCurrentValue.substring(1);
                        value = getColumn(row, Integer.parseInt(format == FORMAT1 ? keySplit[1] : keySplit[2]));
                    }                    
                    
                    if(!value.equalsIgnoreCase("-")) {
                        value = value.isEmpty() ? "0.0" : value.substring(1);
                        if(isEmpty(net.getTier1Rate())) {
                            tier = 1;
                            net.setTier1Rate(value);
                            net.setTier1CurrentRate(tierRateCurrentValue);

                        } else if(!isEmpty(net.getTier1Rate()) && isEmpty(net.getTier2Rate())) {
                            tier = 2;
                            net.setTier2Rate(value);
                            net.setTier2CurrentRate(tierRateCurrentValue);

                        } else if(!isEmpty(net.getTier1Rate()) && !isEmpty(net.getTier2Rate()) && isEmpty(net.getTier3Rate())) {
                            tier = 3;
                            net.setTier3Rate(value);
                            net.setTier3CurrentRate(tierRateCurrentValue);

                        } else if(!isEmpty(net.getTier1Rate()) && !isEmpty(net.getTier2Rate()) && !isEmpty(net.getTier3Rate()) && isEmpty(net.getTier4Rate())) {
                            tier = 4;
                            net.setTier4Rate(value);
                            net.setTier4CurrentRate(tierRateCurrentValue);

                        }
                    }
                    break;
            } 
        } else if(category.equals(OPTION_CATEGORY)){
            net.setOption(value);
        }
    }

    private String deriveNetworkName(String networkName) {
        if (StringUtils.containsIgnoreCase(networkName, "Focus")) {
            networkName = "Focus";
        } else if (StringUtils.containsIgnoreCase(networkName, "Advantage")) {
            networkName = "Advantage";
        } else if (StringUtils.containsIgnoreCase(networkName, "Alliance")) {
            networkName = "Alliance";
        } else if (StringUtils.containsIgnoreCase(networkName, "Signature")) {
            networkName = "Signature";
        }
        return networkName;
    }

    private String deriveCurrentPlanName(String fullPlanName) {
        
        final String START = "Med:";
        int beginIndex = fullPlanName.indexOf(START);
        if (beginIndex >= 0) {
            beginIndex += START.length();
            int endIndex = fullPlanName.indexOf(';', beginIndex);
            if (endIndex > 0) {
                return fullPlanName.substring(beginIndex, endIndex).trim();
            }
        }
        throw new BaseException(String.format("Can't get current plan name from: %s", fullPlanName));
    }

    private LinkedHashMap<String, String> generateKeys(Row row){
        int i = 2;
        boolean generateKey = true;

        LinkedHashMap<String, String> allKeys = new LinkedHashMap<String, String>();
        while(generateKey){
            String key = i + " " + (i+1) + " " + (i+2);

            String columnValue = getColumnValues(row, i, i+2).trim();

            if(columnValue == null || columnValue.isEmpty()){
                generateKey = false;
            }else{
                i = (i+3);
                allKeys.put(key, columnValue);
            }
        }
        return allKeys;
    }

    private LinkedHashMap<String, String> generateKeys2(Row row){
        int i = 2;
        LinkedHashMap<String, String> allKeys = new LinkedHashMap<String, String>();
        for (int j=0 ; j < MAX_OPTIONS_IN_A_ROW; j++) {
            String key = i + " " + (i+1) + " " + (i+2) + " " + (i+3);
            String columnValue = getColumnValues(row, i, i+3).trim();
            if(columnValue == null || columnValue.isEmpty()){
                break;
            }
            i = (i+4);
            allKeys.put(key, columnValue);
        }
        return allKeys;
    }

    private LinkedHashMap<String, String> replaceKeySetValues(LinkedHashMap<String, String> keys, Row row){
        LinkedHashMap<String, String> result = new LinkedHashMap<String, String>();
        for(String str : keys.keySet()){
            String[] split = str.split(" ");

            String columnValue = getColumnValues(row, Integer.parseInt(split[0]), Integer.parseInt(split[split.length-1]));
            result.put(str, columnValue.trim());
        }
        return result;
    }

    private boolean isDisclaimer(Row row) {
        String firstColumn = getColumn(row, 0);
        return firstColumn.contains(INITIAL_DISCLAIMER_IDENTIFIER);
    }

    public int getTier() {
        return tier;
    }
}
