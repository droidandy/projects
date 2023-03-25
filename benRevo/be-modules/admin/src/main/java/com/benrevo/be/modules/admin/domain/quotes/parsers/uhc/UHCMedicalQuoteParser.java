package com.benrevo.be.modules.admin.domain.quotes.parsers.uhc;

import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import com.monitorjbl.xlsx.StreamingReader;
import org.apache.poi.openxml4j.util.ZipSecureFile;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

import java.io.InputStream;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.springframework.web.util.HtmlUtils.htmlEscape;

/**
 * Created by ojas.sitapara on 5/18/17.
 */
public class UHCMedicalQuoteParser extends UHCBaseParser {

    private static final int FORMAT1 = 1; // PPO file
    private static final int FORMAT2 = 2; // HMO file
    private static final Logger LOGGER = LogManager.getLogger(UHCMedicalQuoteParser.class);
    public static String NETWORK_WITH_PLAN_DELIM = "__Plan:";
    public static String NETWORK_WITH_RX_PLAN_DELIM = "__Rx:";
    ArrayList<UHCRelatedOptions> parseExhibitSheet = null;
    private boolean DEBUG = false;
    private String INCLUDED_PHARMACY_BENEFITS_IDENTIFIER = "All benefits include the following " +
                                                           "pharmacy plan:";
    private String ADDITIONAL_PHARMACY_BENEFITS_IDENTIFIER = "To include pharmacy plan:";
    private Pattern TITLE_WITH_RX_PLAN = Pattern.compile(".*Plan Alternates for .*, (.+) Rx");
    private String INITIAL_DISCLAIMER_IDENTIFIER = "If the initial";
    private String COMMISSION_IDENTIFIER = "The above rates include a commission rate of";

    private UHCExhibitQuoteParser exhibitParser = new UHCExhibitQuoteParser();
    private List<BenefitName> benefitNames = null;
    
    private String disclaimerType = null;

    private static final String HEADER_CATEGORY = "UnitedHealthcare"; 
    private static final String MEDICAL_CATEGORY = "Medical Plans"; 
    private static final String RX_CATEGORY = "Pharmacy Plans";
    private static final String RIDER_CATEGORY = "Supplemental Plans";
    
    private static Pattern IP_BENEFIT_PATTERN = 
            Pattern.compile("^([$\\d',\\s]++)([PpAaDdOo]*+)((?:\\s*+(?>x|X)\\d++\\s*+)?)$"); // $500PA $250PDx3 90% $300POD
    
    private static Pattern DEDUCTIBLE_BENEFIT_PATTERN = 
            Pattern.compile("^\\s*+((?>[N|n]\\/[A|a])*+[^\\/\\(\\)]*+)\\s*+\\/?+\\s*+([^\\(\\)]*+)\\(?+([^\\)]*+)\\)?+$"); // "$0 / $0 (Emb)";  $0/$0; $0(emb); N/a (emb) 
    
    private static Pattern RX_BENEFITS_PATTERN = 
            Pattern.compile("^\\s*+"
                    + "(?<tier1>[^\\s\\/]++)" // tier1 "$10"
                    + "(?>\\/(?<tier2>[^\\s\\/]++))" // tier2 "/$30"
                    + "(?>" // tier3 first match
                    +     "(?>\\/(?<tier3p1>[^\\s\\/\\(\\)\\%]++%\\s*+(?>\\([^\\)]*+\\))))" // "/30% (max $250)"
                    +     "|(?>[\\/\\s](?<tier3p2>[^\\s\\/]++)\\s++UP\\s++TO\\s++(?<tier3p3>[\\$\\d]++)[SI]++)" // " 30% UP TO $250SI"
                    +     "|(?>\\/(?<tier3p4>[^\\s\\/\\(\\)]++))"
                    + ")?+" // end of tier3
                    + "(?>" // tier4 first match
                    +     "(?>\\/(?<tier4p1>[^\\s\\/\\(\\)\\%]++%\\s*+(?>\\([^\\)]*+\\))))" // "/30% (max $250)"
                    +     "|(?>[\\/\\s](?<tier4p2>[^\\s\\/]++)\\s++UP\\s++TO\\s++(?<tier4p3>[\\$\\d]++)[SI]++)" // " 30% UP TO $250SI"
                    +     "|(?>\\/(?<tier4p4>[^\\s\\/\\(\\)]++))"
                    + ")?+" // end of tier4
                    + "\\s*+"
                    + "(?<inject>[^\\sIiLl]++[IiLl])?+" // injection "$150I"
                    + "\\s*+"
                    + "(?>" // Mail Order first match
                    +     "(?<mo1>[^\\sMOx]++x)?+" // "2.5x"
                    +     "\\s*+"
                    +     "MO" // MO
                    +     "\\s*+"
                    +     "(?>=\\s*+(?<mo2>\\S++))?+" // "= $10/$20/$30"
                    + ")?+" // end of Mail Order
                    + "\\s*+"
                    + "(?>" // deductible
                    +     "(?<ded1>[^\\s\\/]++)" // $100
                    +     "(?>\\s*+\\/\\s*+(?<ded2>[^\\s]++))?+" // "/$200"
                    +     "\\s++Ded" // Ded
                    + ")?+" // end of deductible
                    , Pattern.CASE_INSENSITIVE); 
    
    public int getTier() {
        return exhibitParser.getTier();
    }

    public List<LinkedHashMap<String, UHCNetwork>> parseMedicalQuotes(InputStream fis, List<BenefitName> benefitNames, boolean isRenewal)
        throws Exception {

        this.benefitNames  = benefitNames;

        List<LinkedHashMap<String, UHCNetwork>> list = new ArrayList<>();
        Workbook myWorkBook = null;
        try {
            // default is 0.01
            // file "American Integrated Services_HMO Exhibits.xlsm" has 0.0099
            ZipSecureFile.setMinInflateRatio(0.009d);
            
            myWorkBook = StreamingReader.builder()
                .rowCacheSize(100)
                .bufferSize(4096)
                .open(fis);

            // Parse Exhibit sheet first
            int exhibitSheetIndex = myWorkBook.getSheetIndex("Exhibit");
            if(exhibitSheetIndex == -1) {
                exhibitSheetIndex = myWorkBook.getSheetIndex("ExhibitPage");
            }
            
            if(exhibitSheetIndex != -1) {
                parseExhibitSheet = exhibitParser.parseExhibitSheet(myWorkBook.getSheetAt(exhibitSheetIndex), isRenewal);
            } else {
                throw new NotFoundException("No Exhibit sheet found for Medical quote");
            }

            for(int index = 0; index < myWorkBook.getNumberOfSheets(); index++) {
                Sheet mySheet = myWorkBook.getSheetAt(index);
                LOGGER.debug("Reading sheet " + mySheet.getSheetName());

                if (mySheet.getSheetName().contains("MPE")) {    
                    // parse the other sheets
                    LinkedHashMap<String, UHCNetwork> sheetNetworks = parseMPESheets(mySheet, isRenewal);
                    if(0 != sheetNetworks.size()) {
                        list.add(sheetNetworks);
                    }
                } else if (isRenewal && mySheet.getSheetName().contains("Stipulation")) {
                    disclaimer = parseStipulationSheet(mySheet, isRenewal);
                    disclaimerType = "HMO";
                }
            }
            
            if (isRenewal && exhibitParser.ppoDisclaimer != null) {
                disclaimer = exhibitParser.ppoDisclaimer;
                disclaimerType = "PPO";
            }
            
            // check that plans for all Options were found
            parseExhibitSheet
                    .stream()
                    .flatMap(r -> r.getNetworkDetails().stream())
                    .filter(n -> !n.isProcessed())
                    .forEach(n -> { LOGGER.error("Plans not found for option: " + n.getOption()); });
            
        } finally {
            if(myWorkBook != null) {
                myWorkBook.close();
            }
        }
        return list;
    }

    private String parseStipulationSheet(Sheet sheet, boolean isRenewal) {
        
        if(sheet == null) {
            return null;
        }
        
        boolean inDisclaimer = false;
        
        StringBuilder result = new StringBuilder();
        
        for (Row row : sheet) {
        
            if (row.getZeroHeight()) {
                // skip hidden row
                continue;
            }

            String firstColumn = getColumnAsString(row, 0, false);
            if (!firstColumn.isEmpty() && Character.isDigit(firstColumn.charAt(0))) {
                inDisclaimer = true;
                if (result.length() != 0) {
                    result.append("</div>");
                }
                result.append("<div><b>");
                result.append(firstColumn);
                result.append("</b> &nbsp; ");
            }

            if (inDisclaimer) {
                String secondColumn = getColumnAsString(row, 1, false);
                if (secondColumn.isEmpty()) {
                    result.append("</div>");
                    // stop
                    break;
                }
                result.append(secondColumn);
            }
        }

        return htmlEscape(result.toString());
    }

    private LinkedHashMap<String, UHCNetwork> parseMPESheets(Sheet mySheet, boolean isRenewal) {
        Iterator<Row> rowIterator = mySheet.iterator();

        //TODO: validation
        //List<String> uhcNetworkNameList = getUhcNewtworkNames();

        LinkedHashMap<String, UHCNetwork> allNetworksWithRx = new LinkedHashMap<>();

        String title = "";
        String optionName = "";
        String rxPlan = "";
        UHCNetworkDetails option = null;

        StringBuilder disclaimer = new StringBuilder();
        boolean parsedDisclaimer = false;
        boolean inDisclaimer = false;
        int format = FORMAT1;
        String category = "";
        
        while(rowIterator.hasNext()) {
            Row row = rowIterator.next();

            if (row.getZeroHeight()) {
                // skip hidden row
                continue;
            }
            
            boolean isTitle = isTitle(row);
            if (isCategory(row, HEADER_CATEGORY, FORMAT2)) {
                category = HEADER_CATEGORY;
            } else if(isTitle || HEADER_CATEGORY.equals(category)) {
                if (isTitle) {
                    format = FORMAT1;
                } else if (HEADER_CATEGORY.equals(category)) {
                    format = FORMAT2;
                } else {
                    throw new BaseException("Unexpected file format");
                }
                
                category = "";
                title = getColumn(row, 1);
                optionName = "";
                option = null;

                if (format == FORMAT1) {
                    rxPlan = getRxPlan(title);
                    if (rxPlan.isEmpty()) {
                        // stop
                        break;
                    }
                }

                final String finalRxPlan = rxPlan;
                final String finalTitle = title;
                final int finalFormat = format;
                // plans may have the same name but different options
                // if there are plans with the same name 
                // process them in the order
                option = parseExhibitSheet
                        .stream()
                        .flatMap(r -> r.getNetworkDetails().stream())
                        .filter(n -> !n.isProcessed() && 
                                ( ((finalFormat == FORMAT1) && finalRxPlan.equals(n.getShortPlanName())) ||
                                  ((finalFormat == FORMAT2) && finalTitle.contains("(" + n.getOption() + ")")) ))
                        .findFirst()
                        .orElseThrow(() -> new BaseException(String.format("Option to bind plans with not found: format=%s, rxPlan=%s, title=%s", finalFormat, finalRxPlan, finalTitle)));
                option.setProcessed(true);
            } else if(format == FORMAT2 && isCategory(row, MEDICAL_CATEGORY, FORMAT2)) {
                category = MEDICAL_CATEGORY;
            } else if(format == FORMAT2 && isCategory(row, RX_CATEGORY, FORMAT2)) {
                category = RX_CATEGORY;
            } else if(format == FORMAT2 && isCategory(row, RIDER_CATEGORY, FORMAT2)) {
                category = RIDER_CATEGORY;
            } else if(format == FORMAT2 && (
                    MEDICAL_CATEGORY.equals(category) 
                    || RX_CATEGORY.equals(category) 
                    || RIDER_CATEGORY.equals(category))) {
                if (!addPlan(allNetworksWithRx, option, row, category, format)) {
                    // end of category
                    category = "";
                };
            } else if(format == FORMAT1 && isValidPlanInformation(row)) {
                String planName = getColumnAsString(row, 1);
                String networkName = getColumnAsString(row, 2);
                optionName = networkName + NETWORK_WITH_RX_PLAN_DELIM + rxPlan;

                if (StringUtils.containsIgnoreCase(option.getMultipleOptionWith(), "motion")) {
                    optionName = optionName + " - Motion";
                }

                //TODO: validation
                //if(!uhcNetworkNameList.contains(networkName)) {
                //    throw new IllegalArgumentException("Found network '" + networkName +"' in
                // quote, this is not a vaild UHC Network");
                //}

                String employeePricing = getColumn(row, 17);
                String employeeSpousePricing = getColumn(row, 18);
                String employeeChildrenPricing = getColumn(row, 19);
                String employeeFamilyPricing = getColumn(row, 20);

                //get existing network container or create new
                ArrayList<UHCNetworkDetails> plans = null;
                boolean isMatch = false; // the first plan for each network
                if(!allNetworksWithRx.containsKey(optionName)) {
                    
                    UHCNetwork uhcNetwork = new UHCNetwork();
                    plans = uhcNetwork.getNetworksDetails();
                    uhcNetwork.setOption(option);
                    allNetworksWithRx.put(optionName, uhcNetwork);
                    isMatch = true;

                    // Add rxPlan
                    UHCNetworkDetails rxNetDetails = new UHCNetworkDetails();
                    rxNetDetails.setShortPlanName(rxPlan);
                    rxNetDetails.setMatch(true);
                    rxNetDetails.setTier1Rate("1.0");
                    rxNetDetails.setTier2Rate("1.0");
                    rxNetDetails.setTier3Rate("1.0");
                    rxNetDetails.setTier4Rate("1.0");
                    uhcNetwork.getNetworksDetailsRx().add(rxNetDetails);
                } else {
                    plans = allNetworksWithRx.get(optionName).getNetworksDetails();
                }

                //create network with details
                UHCNetworkDetails netDetail = new UHCNetworkDetails();
                netDetail.setShortPlanName(planName);
                netDetail.setMatch(isMatch);
                if(isCompositeRate(employeePricing, employeeSpousePricing, employeeChildrenPricing, employeeFamilyPricing)){
                    netDetail.setTier1Rate(employeePricing.isEmpty() ? "0.0" : employeePricing.substring(1));
                    netDetail.setTier2Rate("0.0");
                    netDetail.setTier3Rate("0.0");
                    netDetail.setTier4Rate("0.0");
                }else{
                    setTiers(netDetail, employeePricing, employeeSpousePricing, employeeChildrenPricing, employeeFamilyPricing);
                    //netDetail.setTier1Rate(employeePricing.isEmpty() ? "0.0" : employeePricing.substring(1));
                    //netDetail.setTier2Rate(employeeSpousePricing.isEmpty() ? "0.0" : employeeSpousePricing.substring(1));
                    //netDetail.setTier3Rate(employeeChildrenPricing.isEmpty() ? "0.0" : employeeChildrenPricing.substring(1));
                    //netDetail.setTier4Rate(employeeFamilyPricing.isEmpty() ? "0.0" : employeeFamilyPricing.substring(1));
                }
                netDetail.setNetworkType(deriveNetworkTypeFromTitle(title));
                plans.add(netDetail);

                print("Plan Name: " + planName + " networkWithRx: " + optionName + " employee: " +
                      employeePricing
                      + " employeeSpouse: " + employeeSpousePricing + " employeeChildren: " +
                      employeeChildrenPricing
                      + " employeeFamily: " + employeeFamilyPricing);
                
                if (isRenewal) {
                    parseBenefits(row, netDetail, netDetail.getNetworkType(), format);
                }
                
            } else if(format == FORMAT1 && isIncludedPharmacyBenefitsRow(row)) {

                String[] s = getColumn(row, 1).split(INCLUDED_PHARMACY_BENEFITS_IDENTIFIER);

                String includedPharmacyBenefits = "";
                if(s.length == 2) {
                    includedPharmacyBenefits = s[1];
                }
                
                if (isRenewal) {
                    // add included Rx benefits to all RxPlans
                    ArrayList<UHCNetworkDetails> rxPlans = allNetworksWithRx.get(optionName).getNetworksDetailsRx();
                    if (!rxPlans.isEmpty()) {
                        UHCNetworkDetails rxPlan0 = rxPlans.get(0); 
                        parseRxBenefitsFromString(rxPlan0, includedPharmacyBenefits);
                        for (int i=1; i<rxPlans.size(); i++) {
                            // copy benefits from plan0
                            UHCNetworkDetails finalRxPlan = rxPlans.get(i);
                            rxPlan0.getGenericPlanDetails().getBenefits().forEach(b -> {
                                finalRxPlan.getGenericPlanDetails().getBenefits().add(b.copy());    
                            });
                        }
                    }
                }
                
                print("Included Pharmacy Benefits: " + includedPharmacyBenefits);
            } else if(format == FORMAT1 && isAdditionalPharmacyBenefits(row)) {
                String[] s = getColumn(row, 1).split(ADDITIONAL_PHARMACY_BENEFITS_IDENTIFIER);

                String additionalPharmacyBenefits = "";
                String RXPlanName = "";
                String additionalPharmacyBenefitsMultiplier = "0.00";
                if(s.length == 2) {
                    String[] planDetails = ((s[1] != null) ? s[1] : "").trim().split(" ");
                    RXPlanName = planDetails[0];
                    String[] s1 = s[1].split(",");

                    if(s1.length == 2) {
                        additionalPharmacyBenefits = s1[0];
                        String[] s2 = s[1].split(",");

                        if(s2.length == 2) {
                            additionalPharmacyBenefitsMultiplier = (
                                s2[1].replaceAll("[\\s+a-zA-Z :]",
                                                 ""));
                        }
                    }
                }

                ArrayList<UHCNetworkDetails> plans = null;
                if(!allNetworksWithRx.containsKey(optionName)) {
                    plans = new ArrayList<UHCNetworkDetails>();
                } else {
                    plans = allNetworksWithRx.get(optionName).getAdditionalPharmacyBenefits();
                }

                UHCNetworkDetails netDetail = new UHCNetworkDetails();
                netDetail.setShortPlanName(RXPlanName);
                netDetail.setMatch(false);
                netDetail.setTier1Rate(additionalPharmacyBenefitsMultiplier);
                netDetail.setTier2Rate(additionalPharmacyBenefitsMultiplier);
                netDetail.setTier3Rate(additionalPharmacyBenefitsMultiplier);
                netDetail.setTier4Rate(additionalPharmacyBenefitsMultiplier);
                netDetail.setNetworkType(deriveNetworkTypeFromTitleForRX(title));
                plans.add(netDetail);
                allNetworksWithRx.get(optionName).setAdditionalPharmacyBenefits(plans);

                print("Additional Pharmacy Benefit: " + additionalPharmacyBenefits
                      + " Multiplier: " + additionalPharmacyBenefitsMultiplier);
            } else if(isCommissionRow(row)) {
            
                String value = getColumn(row, 1);
                int beginIndex = value.indexOf(COMMISSION_IDENTIFIER);
                beginIndex += COMMISSION_IDENTIFIER.length();
                int endIndex = value.indexOf("%", beginIndex + 1);
                if (endIndex == -1) {
                    throw new BaseException(String.format("Can't parse commission: %s", value));
                }
                String commission = value.substring(beginIndex, endIndex).trim();
                
                option.setCommission(commission);
                print("Commission: " + commission);
                
            } else if(!isRenewal && !parsedDisclaimer && isDisclaimer(row)) {// parse disclaimer only for New Business
                inDisclaimer = true;
                parsedDisclaimer = true;
            }

            if(inDisclaimer) {
                String disRow = getColumnAsString(row, 1);
                disRow = disRow.trim();
                disRow = parseDualColumns(disRow);

                if(disRow.isEmpty()) {
                	disRow = "<div>&nbsp;</div>";
                } else if(containsIgnoreCase(disRow, "*High")) {
                    inDisclaimer = false;

                    disRow = "<div>&nbsp;</div><div>" + disRow + "</div>";
                } else if(disRow.startsWith("-")) {
                	disRow = "<div>" + disRow;
                } else if(disRow.equals("Quote Assumptions:")) {
                    disRow = "<div><b>" + disRow + "</b><br/>";
                }
                if(disRow.startsWith("<div>") && disclaimer.length() > 0 
                    && disclaimer.charAt(disclaimer.length() - 1) != '>') {
                    disclaimer.append("</div>");
                }
                disclaimer.append(disRow);
            }
        }

        if(isNotBlank(disclaimer)) {
            this.disclaimer = htmlEscape(disclaimer.toString());
        }

        return allNetworksWithRx;
    }

    private void setTiers(UHCNetworkDetails net, String ...rates) {
        net.setTier1Rate("0");
        net.setTier2Rate("0");
        net.setTier3Rate("0");
        net.setTier4Rate("0");
        for (String value : rates) {
            if (value != null && !value.isEmpty() && !value.equals("$0") && !value.contains("#VALUE")) {
                value = value.substring(1);
                if("0".equals(net.getTier1Rate())) {
                    net.setTier1Rate(value);
                } else if("0".equals(net.getTier2Rate())) {
                    net.setTier2Rate(value);
                } else if("0".equals(net.getTier3Rate())) {
                    net.setTier3Rate(value);
                } else if("0".equals(net.getTier4Rate())) {
                    net.setTier4Rate(value);
                }
            }
        }
        
    }

    private boolean addPlan(LinkedHashMap<String, UHCNetwork> allNetworksWithRx, UHCNetworkDetails option, Row row, String category, int format) {
        String planName = getColumnAsString(row, 1);
        if (planName.isEmpty()) {
            // stop
            return false;
        }
        
        String optionName = option.getNetworkName() + NETWORK_WITH_PLAN_DELIM + option.getCurrentPlanName() + NETWORK_WITH_RX_PLAN_DELIM + option.getShortPlanName();
        if (StringUtils.containsIgnoreCase(option.getMultipleOptionWith(), "motion")) {
            optionName = optionName + " - Motion";
        }

        String employeePricing = getColumn(row, 12);
        String employeeSpousePricing = getColumn(row, 13);
        String employeeChildrenPricing = getColumn(row, 14);
        String employeeFamilyPricing = getColumn(row, 15);

        //get existing network container or create new
        ArrayList<UHCNetworkDetails> plans = null;
        boolean isMatch = false; // the first plan for each network
        UHCNetwork uhcNetwork = allNetworksWithRx.get(optionName);
        if (uhcNetwork == null) {
            uhcNetwork = new UHCNetwork();
            uhcNetwork.setOption(option);
            allNetworksWithRx.put(optionName, uhcNetwork);
            isMatch = true;
        }
        //create network with details
        UHCNetworkDetails plan = new UHCNetworkDetails();
        plan.setShortPlanName(planName);
        plan.setMatch(isMatch);

        if (RX_CATEGORY.equals(category)) {
            plans = uhcNetwork.getNetworksDetailsRx();
            if(plans.size() == 0){
                plan.setMatch(true);
            }
            plan.getAttributes().add(new QuotePlanAttribute(QuotePlanAttributeName.DOLLAR_RX_RATE, null));
        } else if (RIDER_CATEGORY.equals(category)) { 
            plans = uhcNetwork.getNetworksDetailsRider();
        } else { // MEDICAL
            plans = uhcNetwork.getNetworksDetails();
        }

        if(isCompositeRate(employeePricing, employeeSpousePricing, employeeChildrenPricing, employeeFamilyPricing)){
            plan.setTier1Rate(employeePricing.isEmpty() ? "0.0" : employeePricing.substring(1));
            plan.setTier2Rate("0.0");
            plan.setTier3Rate("0.0");
            plan.setTier4Rate("0.0");
        }else{
            plan.setTier1Rate(employeePricing.isEmpty() ? "0.0" : employeePricing.substring(1));
            plan.setTier2Rate(employeeSpousePricing.isEmpty() ? "0.0" : employeeSpousePricing.substring(1));
            plan.setTier3Rate(employeeChildrenPricing.isEmpty() ? "0.0" : employeeChildrenPricing.substring(1));
            plan.setTier4Rate(employeeFamilyPricing.isEmpty() ? "0.0" : employeeFamilyPricing.substring(1));
        }


        String networkType = deriveNetworkTypeFromTitle(option.getProduct());
        plan.setNetworkType(networkType);
        plan.setOtherBenefits(option.getOtherBenefits());
        plan.setMultipleOptionWith(option.getMultipleOptionWith());
        plans.add(plan);

        print(category + " Plan Name: " + planName + " networkWithRx: " + optionName + " employee: " +
              employeePricing
              + " employeeSpouse: " + employeeSpousePricing + " employeeChildren: " +
              employeeChildrenPricing
              + " employeeFamily: " + employeeFamilyPricing);
        
        // parse benefits only for medical plans
        if (MEDICAL_CATEGORY.equals(category)) {
            parseBenefits(row, plan, networkType, format);
        }
        if (RX_CATEGORY.equals(category)) {
            parseRxBenefits(row, plan, networkType, format);
        }

        
        return true;
    }

    private void parseRxBenefits(Row row, UHCNetworkDetails rxPlan, String networkType, int format) {
        
        if (format ==2 && "HMO".equals(networkType)) {

            String value = getColumnAsString(row, 2);
            
            parseRxBenefitsFromString(rxPlan, value);                    
            
        }        
    }

    private void parseRxBenefitsFromString(UHCNetworkDetails rxPlan, String value) {
        print("Benefits Source: %s", value);
        
        Matcher m = RX_BENEFITS_PATTERN.matcher(value);
        if (!m.find()) {
            throw new BaseException(String.format("Can't parse RX benefits: %s", value));
        }
        
        value = m.group("tier1");
        rxPlan.getGenericPlanDetails().addBenefit(benefitNames, "MEMBER_COPAY_TIER_1", "IN", value);
        print("Benefits MEMBER_COPAY_TIER_1: %s", value);

        value = m.group("tier2");
        rxPlan.getGenericPlanDetails().addBenefit(benefitNames, "MEMBER_COPAY_TIER_2", "IN", value);
        print("Benefits MEMBER_COPAY_TIER_2: %s", value);

        String tier3p2 = m.group("tier3p2");
        String tier3p3 = m.group("tier3p3");
        if (tier3p2 != null && tier3p3 != null) {
            value = String.format("%s (max %s)", tier3p2, tier3p3); 
        } else {
            value = (String)ObjectUtils.firstNonNull(m.group("tier3p1"), m.group("tier3p4"), "N/A");    
        }
        rxPlan.getGenericPlanDetails().addBenefit(benefitNames, "MEMBER_COPAY_TIER_3", "IN", value);
        print("Benefits MEMBER_COPAY_TIER_3: %s", value);

        String tier4p2 = m.group("tier4p2");
        String tier4p3 = m.group("tier4p3");
        if (tier4p2 != null && tier4p3 != null) {
            value = String.format("%s (max %s)", tier4p2, tier4p3); 
        } else {
            value = (String)ObjectUtils.firstNonNull(m.group("tier4p1"), m.group("tier4p4"), "N/A");    
        }
        rxPlan.getGenericPlanDetails().addBenefit(benefitNames, "MEMBER_COPAY_TIER_4", "IN", value);
        print("Benefits MEMBER_COPAY_TIER_4: %s", value);

        value = (String)ObjectUtils.firstNonNull(m.group("mo1"), m.group("mo2"), "N/A");
        rxPlan.getGenericPlanDetails().addBenefit(benefitNames, "MAIL_ORDER", "IN", value);
        print("Benefits MAIL_ORDER: %s", value);
        
        value = (String)ObjectUtils.defaultIfNull(m.group("ded1"),"N/A");
        rxPlan.getGenericPlanDetails().addBenefit(benefitNames, "RX_INDIVIDUAL_DEDUCTIBLE", "IN", value);
        print("Benefits RX_INDIVIDUAL_DEDUCTIBLE: %s", value);
        
        value = (String)ObjectUtils.defaultIfNull(m.group("ded2"),"N/A");
        rxPlan.getGenericPlanDetails().addBenefit(benefitNames, "RX_FAMILY_DEDUCTIBLE", "IN", value); 
        print("Benefits RX_FAMILY_DEDUCTIBLE: %s", value);
    }

    private void parseBenefits(Row row, UHCNetworkDetails plan, String networkType, int format) {

        String value;
        List<String> values = new ArrayList<>(3);
        StringBuilder log = new StringBuilder(); 
        if (format ==2 && "HMO".equals(networkType)) {
            
            value = getColumnAsString(row, 2);
            plan.getGenericPlanDetails().addBenefit(benefitNames, "PCP", "IN", value);
            log.append("Benefits PCP:").append(value);
            
            value = getColumnAsString(row, 3);
            plan.getGenericPlanDetails().addBenefit(benefitNames, "SPECIALIST", "IN", value);
            log.append(" SPECIALIST:").append(value);
            
            value = getColumnAsString(row, 4);
            plan.getGenericPlanDetails().addBenefit(benefitNames, "OUTPATIENT_SURGERY", "IN", value);
            log.append(" OUTPATIENT_SURGERY:").append(value);
            
            value = getColumnAsRawString(row, 5);
            if (!contains(value, IP_BENEFIT_PATTERN, values)) {
                // if not parsed put everything in first benefit
                values.clear(); values.add(value); values.add(""); values.add("");
            }
            plan.getGenericPlanDetails().addBenefit(benefitNames, "INPATIENT_HOSPITAL", "IN", values.get(0));
            log.append(" INPATIENT_HOSPITAL:").append(values.get(0));
            
            // calc copay type
            value = values.get(1);
            value = value.equalsIgnoreCase("PA") ? "Admit" : value.equalsIgnoreCase("PD") ? "Day" : value;
            plan.getGenericPlanDetails().addBenefit(benefitNames, "IP_COPAY_TYPE", "IN", value);
            log.append(" IP_COPAY_TYPE:").append(value);
            
            // calc max copay
            value = values.get(2);
            if (value.startsWith("x") || value.startsWith("X")) {
                float ip = NumberUtils.toFloat(values.get(0).replace("$", "").replace(",", ""), 0f);
                int multiple = NumberUtils.toInt(value.substring(1), 0);
                if (ip > 0 && multiple > 0) {
                    value = "$" + Integer.toString(Math.round(ip * multiple));
                }
            }
            plan.getGenericPlanDetails().addBenefit(benefitNames, "IP_COPAY_MAX", "IN", value);
            log.append(" IP_COPAY_MAX:").append(value);

            value = getColumnAsString(row, 6);
            plan.getGenericPlanDetails().addBenefit(benefitNames, "URGENT_CARE", "IN", value);
            log.append(" URGENT_CARE:").append(value);
            
            value = getColumnAsString(row, 7);
            plan.getGenericPlanDetails().addBenefit(benefitNames, "EMERGENCY_ROOM", "IN", value);
            log.append(" EMERGENCY_ROOM:").append(value);
            
            value = getColumnAsString(row, 9);
            if (!contains(value, DEDUCTIBLE_BENEFIT_PATTERN, values)) {
                // if not parsed put everything in first benefit
                values.clear(); values.add(value); values.add(""); values.add("");
            } else if (values.get(0).trim().equalsIgnoreCase("N/A") && values.get(1).isEmpty()) {
                values.set(1, "N/A");
            }
            plan.getGenericPlanDetails().addBenefit(benefitNames, "INDIVIDUAL_DEDUCTIBLE", "IN", values.get(0));
            log.append(" INDIVIDUAL_DEDUCTIBLE:").append(values.get(0));
            plan.getGenericPlanDetails().addBenefit(benefitNames, "FAMILY_DEDUCTIBLE", "IN", values.get(1));
            log.append(" FAMILY_DEDUCTIBLE:").append(values.get(1));
            plan.getGenericPlanDetails().addBenefit(benefitNames, "DEDUCTIBLE_TYPE", "IN", values.get(2));
            log.append(" DEDUCTIBLE_TYPE:").append(values.get(2));
            
            value = getColumnAsString(row, 11);
            if (!contains(value, DEDUCTIBLE_BENEFIT_PATTERN, values)) {
                // if not parsed put everything in first benefit
                values.clear(); values.add(value); values.add(""); values.add("");
            } else if (values.get(0).trim().equalsIgnoreCase("N/A") && values.get(1).isEmpty()) {
                values.set(1, "N/A");
            }
            plan.getGenericPlanDetails().addBenefit(benefitNames, "INDIVIDUAL_OOP_LIMIT", "IN", values.get(0));
            log.append(" INDIVIDUAL_OOP_LIMIT:").append(values.get(0));
            plan.getGenericPlanDetails().addBenefit(benefitNames, "FAMILY_OOP_LIMIT", "IN", values.get(1));
            log.append(" FAMILY_OOP_LIMIT:").append(values.get(1));
            print(log.toString());
        
        } else if (format ==1 && StringUtils.equalsAnyIgnoreCase(networkType, "PPO", "HRA", "HSA")) {
            
            value = getColumnAsString(row, 3);
            plan.getGenericPlanDetails().addBenefit(benefitNames, "PCP", "IN", value);
            log.append("Benefits PCP:").append(value);
            
            value = getColumnAsString(row, 4);
            plan.getGenericPlanDetails().addBenefit(benefitNames, "SPECIALIST", "IN", value);
            log.append(" SPECIALIST:").append(value);
            
            value = getColumnAsString(row, 5);
            plan.getGenericPlanDetails().addBenefit(benefitNames, "OUTPATIENT_SURGERY", "IN", value);
            log.append(" OUTPATIENT_SURGERY:").append(value);
            
            value = getColumnAsRawString(row, 6);
            if (!contains(value, IP_BENEFIT_PATTERN, values)) {
                // if not parsed put everything in first benefit
                values.clear(); values.add(value); values.add(""); values.add("");
            }

            plan.getGenericPlanDetails().addBenefit(benefitNames, "IP_PER_OCCURENCE_DEDUCTIBLE", "IN", values.get(0));
            log.append(" IP_PER_OCCURENCE_DEDUCTIBLE:").append(values.get(0));

            value = getColumnAsString(row, 7);
            plan.getGenericPlanDetails().addBenefit(benefitNames, "URGENT_CARE", "IN", value);
            log.append(" URGENT_CARE:").append(value);
            
            value = getColumnAsString(row, 8);
            plan.getGenericPlanDetails().addBenefit(benefitNames, "EMERGENCY_ROOM", "IN", value);
            log.append(" EMERGENCY_ROOM:").append(value);
            
            value = getColumnAsString(row, 10);
            if (!contains(value, DEDUCTIBLE_BENEFIT_PATTERN, values)) {
                // if not parsed put everything in first benefit
                values.clear(); values.add(value); values.add(""); values.add("");
            } else if (values.get(0).trim().equalsIgnoreCase("N/A") && values.get(1).isEmpty()) {
                values.set(1, "N/A");
            }
            plan.getGenericPlanDetails().addBenefit(benefitNames, "INDIVIDUAL_DEDUCTIBLE", "IN", values.get(0));
            log.append(" INDIVIDUAL_DEDUCTIBLE:").append(values.get(0));
            plan.getGenericPlanDetails().addBenefit(benefitNames, "FAMILY_DEDUCTIBLE", "IN", values.get(1));
            log.append(" FAMILY_DEDUCTIBLE:").append(values.get(1));
            plan.getGenericPlanDetails().addBenefit(benefitNames, "DEDUCTIBLE_TYPE", "IN", values.get(2));
            log.append(" DEDUCTIBLE_TYPE:").append(values.get(2));

            value = getColumnAsString(row, 11);
            plan.getGenericPlanDetails().addBenefit(benefitNames, "CO_INSURANCE", "IN", value);
            log.append(" CO_INSURANCE:").append(value);

            plan.getGenericPlanDetails().addBenefit(benefitNames, "INPATIENT_HOSPITAL", "IN", value + " after deductible");
            log.append(" INPATIENT_HOSPITAL:").append(value + " after deductible");
            
            value = getColumnAsString(row, 12);
            if (!contains(value, DEDUCTIBLE_BENEFIT_PATTERN, values)) {
                // if not parsed put everything in first benefit
                values.clear(); values.add(value); values.add(""); values.add("");
            } else if (values.get(0).trim().equalsIgnoreCase("N/A") && values.get(1).isEmpty()) {
                values.set(1, "N/A");
            }
            plan.getGenericPlanDetails().addBenefit(benefitNames, "INDIVIDUAL_OOP_LIMIT", "IN", values.get(0));
            log.append(" INDIVIDUAL_OOP_LIMIT:").append(values.get(0));
            plan.getGenericPlanDetails().addBenefit(benefitNames, "FAMILY_OOP_LIMIT", "IN", values.get(1));
            log.append(" FAMILY_OOP_LIMIT:").append(values.get(1));
            
            value = getColumnAsString(row, 13);
            if (!contains(value, DEDUCTIBLE_BENEFIT_PATTERN, values)) {
                // if not parsed put everything in first benefit
                values.clear(); values.add(value); values.add(""); values.add("");
            } else if (values.get(0).trim().equalsIgnoreCase("N/A") && values.get(1).isEmpty()) {
                values.set(1, "N/A");
            }
            plan.getGenericPlanDetails().addBenefit(benefitNames, "INDIVIDUAL_DEDUCTIBLE", "OUT", values.get(0));
            log.append(" INDIVIDUAL_DEDUCTIBLE:").append(values.get(0));
            plan.getGenericPlanDetails().addBenefit(benefitNames, "FAMILY_DEDUCTIBLE", "OUT", values.get(1));
            log.append(" FAMILY_DEDUCTIBLE:").append(values.get(1));
            
            value = getColumnAsString(row, 14);
            plan.getGenericPlanDetails().addBenefit(benefitNames, "CO_INSURANCE", "OUT", value);
            log.append(" CO_INSURANCE:").append(value);
            
            value = getColumnAsString(row, 15);
            if (!contains(value, DEDUCTIBLE_BENEFIT_PATTERN, values)) {
                // if not parsed put everything in first benefit
                values.clear(); values.add(value); values.add(""); values.add("");
            } else if (values.get(0).trim().equalsIgnoreCase("N/A") && values.get(1).isEmpty()) {
                values.set(1, "N/A");
            }
            plan.getGenericPlanDetails().addBenefit(benefitNames, "INDIVIDUAL_OOP_LIMIT", "OUT", values.get(0));
            log.append(" INDIVIDUAL_OOP_LIMIT:").append(values.get(0));
            plan.getGenericPlanDetails().addBenefit(benefitNames, "FAMILY_OOP_LIMIT", "OUT", values.get(1));
            log.append(" FAMILY_OOP_LIMIT:").append(values.get(1));
            print(log.toString());

        }

        
    }

    private boolean isCompositeRate(String ... rates){
        return Arrays.stream(rates).distinct().count() == 1;
    }

    private boolean isTitle(Row row) {
        String firstColumn = getColumn(row, 0);
        String secondColumn = getColumn(row, 1);

        if(firstColumn.isEmpty() && !secondColumn.isEmpty() &&
           secondColumn.contains("Plan Alternates for")) {
            return true;
        } else {
            return false;
        }
    }

    private String getRxPlan(String title) {
        if(title != null) {
            Matcher m = TITLE_WITH_RX_PLAN.matcher(title);
            if(m.matches()) {
                return m.group(1);
            }
        }
        return "";
    }

    public String getDisclaimerType() {
        return disclaimerType;
    }

    /******************************************
     *  Helpers
     *****************************************/

    private boolean isValidPlanInformation(Row row) {
        String firstColumn = getColumn(row, 0);
        String secondColumn = getColumn(row, 1);
        String networkColumn = getColumn(row, 2);
        String employeePricing = getColumn(row, 17);
        String employeeSpousePricing = getColumn(row, 18);
        String employeeChildrenPricing = getColumn(row, 19);
        String employeeFamilyPricing = getColumn(row, 20);

        if(firstColumn.isEmpty() && !secondColumn.isEmpty() && !networkColumn.isEmpty()
           && !employeePricing.isEmpty() && !secondColumn.equals("ERROR:  #REF!")
           && !employeePricing.equals("#VALUE!") && !employeeSpousePricing.equals("#VALUE!")
           && !employeeChildrenPricing.equals("#VALUE!") &&
           !employeeFamilyPricing.equals("#VALUE!")) {
            return true;
        } else {
            return false;
        }
    }

    /******************************************
     *  Helpers
     *****************************************/

    private String deriveNetworkTypeFromTitle(String title) {
        if(title.contains("HSA")) {
            return "HSA";
        } else if(title.contains("HMO")) {
            return "HMO";
        } else {
            return "PPO";
        }
    }

    private void print(String str) {
        if(DEBUG) {
            System.out.println(str);
        }
    }

    private void print(String format, Object... values) {
        if(DEBUG) {
            System.out.println(String.format(format, values));
        }
    }

    private boolean isIncludedPharmacyBenefitsRow(Row row) {
        String firstColumn = getColumn(row, 0);
        String secondColumn = getColumn(row, 1);

        if(firstColumn.isEmpty() && secondColumn.contains(INCLUDED_PHARMACY_BENEFITS_IDENTIFIER)) {
            return true;
        } else {
            return false;
        }
    }

    private boolean isAdditionalPharmacyBenefits(Row row) {
        String firstColumn = getColumn(row, 0);
        String secondColumn = getColumn(row, 1);

        return firstColumn.isEmpty() &&
               secondColumn.contains(ADDITIONAL_PHARMACY_BENEFITS_IDENTIFIER);
    }

    private boolean isCommissionRow(Row row) {
        String firstColumn = getColumn(row, 0);
        String secondColumn = getColumn(row, 1);

        return firstColumn.isEmpty() && secondColumn.contains(COMMISSION_IDENTIFIER);
    }

    
    /**
     * HSA is a special type of PPO networks so HSA is mapped to PPO
     *
     * @param title
     *
     * @return
     */
    private String deriveNetworkTypeFromTitleForRX(String title) {
        if(title.contains("HMO")) {
            return "HMO";
        } else {
            return "PPO";
        }
    }

    private boolean isDisclaimer(Row row) {
        String firstColumn = getColumn(row, 0);
        String secondColumn = getColumn(row, 1);

        return firstColumn.isEmpty() && secondColumn.contains(INITIAL_DISCLAIMER_IDENTIFIER);
    }

}
