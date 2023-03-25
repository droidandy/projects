package com.benrevo.be.modules.admin.domain.quotes.parsers.anthem;

import static org.apache.commons.lang.StringUtils.isNumeric;
import static org.apache.commons.lang3.StringUtils.remove;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;

import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.common.dto.QuoteParserErrorDto;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.ValidationException;
import com.benrevo.data.persistence.entities.BenefitName;
import com.google.common.collect.ImmutableMap;
import com.monitorjbl.xlsx.StreamingReader;
import java.io.InputStream;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellReference;

/**
 * Created by akorchak on 8/18/17.
 */
public class AnthemDPPOParser implements IAnthemParser {

    private boolean DEBUG = false;
    private static final int MAX_VALUES_IN_CELL = 3;
    private static final String RATE_DESCRIPTION = "DPPO Rate Description";
    private static final String NETWORK_NAME = "DPPO Network";
    private static final String NETWORK_TYPE = "DPPO";
    
    List<BenefitName> benefitNames; 

    private LinkedHashMap<String, RateDescriptionDTO> planInformation = new LinkedHashMap<String, RateDescriptionDTO>();
    private NumberFormat numberFormat = NumberFormat.getCurrencyInstance(Locale.US);

    /**
     * Loops through the sheet
     * @param is
     * @throws Exception
     */
    @Override
    public void parseAnthemQuotes(InputStream is, Set<QuoteParserErrorDto> errorCollector) throws Exception {

        Workbook myWorkBook = null;

        try {
            myWorkBook = StreamingReader.builder()
                .rowCacheSize(100)
                .bufferSize(4096)
                .open(is);

            if(myWorkBook.getSheetIndex("Dental Proposal") != -1){
                doParse(myWorkBook.getSheet("Dental Proposal"));
            }else{
              throw new BaseException("DPPO quote is missing Dental Proposal sheet. Wrong sheet name?");
            }
            if(myWorkBook.getSheetIndex("Standard Alternatives") != -1){
                doParseAlternatives(myWorkBook.getSheet("Standard Alternatives"));
            }
            
        } finally {
            if(myWorkBook != null) {
                myWorkBook.close();
            }
        }

    }

    private Iterator<Row> rowIterator;
    private Row row;
    private String lastValue="";
    private final String[] NA_VALUES = new String[]{"N/A","N/A","N/A"};
    private int inIndividual = 0;
    private int outIndividual = 0;
    private int inNetworkIndex = -1;
    private int outNetworkIndex = -1;
    private int foundedIndex = -1;
    private int tierIndex = -1;
    private int ratesIndex = -1;
    private int tierRates =0;
    
    private final Pattern PLAN_NAME_PATTERN = Pattern.compile(".*Fully.+Insured.+Rate.+Quotation.+For.*",Pattern.CASE_INSENSITIVE);
    private final Pattern IN_NETWORK_PATTERN = Pattern.compile(".*In.Network.*",Pattern.CASE_INSENSITIVE);
    private final Pattern OUT_NETWORK_PATTERN = Pattern.compile(".*Out.+Network.*",Pattern.CASE_INSENSITIVE);
    private final Pattern TIER_PATTERN = Pattern.compile(".*Tier.*",Pattern.CASE_INSENSITIVE);
    private final Pattern RATES_PATTERN = Pattern.compile(".*Rates.+w.+ACA.+Fees.*",Pattern.CASE_INSENSITIVE);
    
    private final Pattern EXTRACT_MULTIPLIER_PATTERN = Pattern.compile("([\\d\\.]+)X\\s+Individual",Pattern.CASE_INSENSITIVE);
    private final Pattern EXTRACT_PERCENT_PATTERN = Pattern.compile("([\\d\\.]+%)",Pattern.CASE_INSENSITIVE);
    private final Pattern DENTAL_INDIVIDUAL = Pattern.compile("\\s*(?:Individual|Annual).+Deductible\\s*",Pattern.CASE_INSENSITIVE); 
    private final Pattern DENTAL_FAMILY =Pattern.compile("Family.+Deductible.+Multiple",Pattern.CASE_INSENSITIVE);
    private final Pattern WAIVED_FOR_PREVENTIVE =Pattern.compile(".*Deductible.+Waived.+Diag.Prev.*",Pattern.CASE_INSENSITIVE);
    private final Pattern CLASS_1_PREVENTIVE =Pattern.compile(".*Diagnostic.+Preventive.*",Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
    private final Pattern CLASS_2_BASIC =Pattern.compile("Basic.+Restorative.*",Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
    private final Pattern CLASS_3_MAJOR =Pattern.compile("Major.+Restorative.*",Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
    private final Pattern CLASS_4_ORTHODONTIA =Pattern.compile("Orthodontics",Pattern.CASE_INSENSITIVE);
    private final Pattern ORTHO_ELIGIBILITY =Pattern.compile("Orthodontic.+Covers",Pattern.CASE_INSENSITIVE);
    private final Pattern CALENDAR_YEAR_MAXIMUM =Pattern.compile("Annual Maximum",Pattern.CASE_INSENSITIVE);
    private final Pattern ORTHODONTIA_LIFETIME_MAX =Pattern.compile("Lifetime Orthodontic Maximum",Pattern.CASE_INSENSITIVE);
    private final Pattern FULLY_INSURED_RATES =Pattern.compile("FULLY.+INSURED.+RATES",Pattern.CASE_INSENSITIVE);
    private final Pattern EMPLOYEE =Pattern.compile("Employee",Pattern.CASE_INSENSITIVE);
    private final Pattern EMPLOYEE_ONE =Pattern.compile("Employee.+One",Pattern.CASE_INSENSITIVE);
    private final Pattern EMPLOYEE_SPOUSE =Pattern.compile("Employee.+Spouse",Pattern.CASE_INSENSITIVE);
    private final Pattern EMPLOYEE_CHILDREN =Pattern.compile("Employee.+Child.*",Pattern.CASE_INSENSITIVE);
    private final Pattern EMPLOYEE_FAMILY =Pattern.compile("Employee.+Family",Pattern.CASE_INSENSITIVE);
    private final Pattern REIMBURSEMENT_SCHEDULE =Pattern.compile("OON.+Reimbursement",Pattern.CASE_INSENSITIVE);
    private final Pattern IMPLANTS =Pattern.compile(".*Implants.*",Pattern.CASE_INSENSITIVE);
    private final Pattern TOTALS =Pattern.compile("Totals",Pattern.CASE_INSENSITIVE);
    
    private final Pattern ALTERNATIVES =Pattern.compile(".*Alternate.+Quote.+Options.*",Pattern.CASE_INSENSITIVE);
    private final Pattern DEDUCTIBLE = Pattern.compile(".*Deductible.+Single.+Family.*", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
    private final Pattern MAX_ANNUAL = Pattern.compile(".*Max.+Annual.*", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
    private final Pattern ORTHODONTIA =Pattern.compile(".*Orthodontic.+Coverage.+Lifetime.*",Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
    private final Pattern FAMILY =Pattern.compile(".*Family.*",Pattern.CASE_INSENSITIVE);
    private final Pattern NA_PATTERN = Pattern.compile("\\s*N/A\\s*",Pattern.CASE_INSENSITIVE);
    private final Pattern CONTRACT_LENGTH_PATTERN = Pattern.compile("\\s*Contract\\s+Length\\s*",Pattern.CASE_INSENSITIVE);
    private final Pattern PARTICIPATION_REQUIREMENT = Pattern.compile("\\s*Participation\\s+Requirement\\s*",Pattern.CASE_INSENSITIVE);
    private final Pattern PROGRAM = Pattern.compile("\\s*(?:Program|Product\\s+and\\s+Network)\\s*",Pattern.CASE_INSENSITIVE);
    private final Pattern NOT_AVAILABLE = Pattern.compile("\\s*Not\\s+Available\\s*",Pattern.CASE_INSENSITIVE);
    
    
    

    private Map<String, String> dppoBenefits = new ImmutableMap.Builder<String, String>()
        .put("DENTAL_INDIVIDUAL","IN_OUT")
        .put("DENTAL_FAMILY","IN_OUT")
        .put("WAIVED_FOR_PREVENTIVE","IN_OUT")
        .put("CALENDAR_YEAR_MAXIMUM","IN_OUT")
        .put("CLASS_1_PREVENTIVE","IN_OUT")
        .put("CLASS_2_BASIC","IN_OUT")
        .put("CLASS_3_MAJOR","IN_OUT")
        .put("CLASS_4_ORTHODONTIA","IN_OUT")
        .put("ORTHODONTIA_LIFETIME_MAX","IN_OUT")
        .put("ORTHO_ELIGIBILITY","IN_OUT")
        .put("IMPLANT_COVERAGE","IN")
        .put("REIMBURSEMENT_SCHEDULE","IN")
        .build();
    
    private void doParse(Sheet sheet) throws ParseException {
        
        AnthemPlanDetails planInfo = new AnthemPlanDetails();
        planInfo.setNetworkName(NETWORK_NAME);
        planInfo.setNetworkType(NETWORK_TYPE);
        
        RateDescriptionDTO rd = new RateDescriptionDTO();
        AnthemNetworkDetails detail = new AnthemNetworkDetails();
        detail.setNetworkName(NETWORK_NAME);
        detail.setNetworkType(NETWORK_TYPE);
        detail.getPlanDetails().add(planInfo);
        rd.getAnthemNetworks().put(planInfo.getNetworkName(), detail);
        planInformation.put(RATE_DESCRIPTION, rd);
        
        GenericPlanDetails planDetails = new GenericPlanDetails();
        planInfo.setGenericPlanDetails(planDetails);        
        
        rowIterator = sheet.iterator();
        
        // find plan name
        while(getNextRow()) {
            if (column(2,3).matches(PLAN_NAME_PATTERN)) {
                planInfo.setPlanName(column(4).value());
                planInfo.setPlanNameLocation(CellReference.convertNumToColString(4) + (row.getRowNum() + 1));
                print("  PlanName: ", value());
                break;
            }
        }
        
        while(getNextRow()) {

            // find indexes for InNetwork and OutNetwork columns
            if (findColumn(4,10,IN_NETWORK_PATTERN)) { inNetworkIndex = foundedIndex; };
            if (findColumn(4,10,OUT_NETWORK_PATTERN)) { outNetworkIndex = foundedIndex; };
            
            if (column(2).matches(DENTAL_INDIVIDUAL)) {
                
                String inValue = column(inNetworkIndex).value();
                String outValue = column(outNetworkIndex).value();
                
                inIndividual = Integer.valueOf(numberFormat.parse(inValue).intValue());
                outIndividual = Integer.valueOf(numberFormat.parse(outValue).intValue());
                
                planDetails.addBenefit(benefitNames, "DENTAL_INDIVIDUAL", "IN", inValue);
                planDetails.addBenefit(benefitNames, "DENTAL_INDIVIDUAL", "OUT", outValue);
                
                print("    DENTAL_INDIVIDUAL: in=", inValue, " out=", outValue);
            
            } else if (column(2).matches(DENTAL_FAMILY)) {

                String inValue = column(inNetworkIndex).value();
                if(!containsIgnoreCase(inValue, "No Limit")){
                    inValue = "$" + Integer.toString(
                        Integer.parseInt(column(inNetworkIndex).extract(EXTRACT_MULTIPLIER_PATTERN))
                            * inIndividual
                    );
                }

                String outValue = column(outNetworkIndex).value();
                if(!containsIgnoreCase(outValue, "No Limit")){
                    outValue = "$" + Integer.toString(
                        Integer.parseInt(column(outNetworkIndex).extract(EXTRACT_MULTIPLIER_PATTERN))
                            * outIndividual
                    );
                }

                planDetails.addBenefit(benefitNames, "DENTAL_FAMILY", "IN", inValue);
                planDetails.addBenefit(benefitNames, "DENTAL_FAMILY", "OUT", outValue);

                print("    DENTAL_FAMILY: in=", inValue, " out=", outValue);
                
            } else if (column(2).matches(WAIVED_FOR_PREVENTIVE)) {
                
                String inValue = column(inNetworkIndex).extractYesNo();
                String outValue = column(outNetworkIndex).extractYesNo();

                planDetails.addBenefit(benefitNames, "WAIVED_FOR_PREVENTIVE", "IN", inValue);
                planDetails.addBenefit(benefitNames, "WAIVED_FOR_PREVENTIVE", "OUT", outValue);

                print("    WAIVED_FOR_PREVENTIVE - Diag/Prev: in=", inValue, " out=", outValue);
            
            } else if (column(2).matches(CLASS_1_PREVENTIVE)) {

                String inValue = column(inNetworkIndex).extract(EXTRACT_PERCENT_PATTERN); 
                String outValue = column(outNetworkIndex).extract(EXTRACT_PERCENT_PATTERN);

                planDetails.addBenefit(benefitNames, "CLASS_1_PREVENTIVE", "IN", inValue);
                planDetails.addBenefit(benefitNames, "CLASS_1_PREVENTIVE", "OUT", outValue);
                
                print("    CLASS_1_PREVENTIVE Diagnostic & Preventive: in=", inValue, " out=", outValue);

            } else if (column(2).matches(CLASS_2_BASIC)) {

                String inValue = column(inNetworkIndex).extract(EXTRACT_PERCENT_PATTERN); 
                String outValue = column(outNetworkIndex).extract(EXTRACT_PERCENT_PATTERN);

                planDetails.addBenefit(benefitNames, "CLASS_2_BASIC", "IN", inValue);
                planDetails.addBenefit(benefitNames, "CLASS_2_BASIC", "OUT", outValue);

                print("    CLASS_2_BASIC: in=", inValue, " out=", outValue);

            } else if (column(2).matches(CLASS_3_MAJOR)) {

                String inValue = column(inNetworkIndex).extract(EXTRACT_PERCENT_PATTERN); 
                String outValue = column(outNetworkIndex).extract(EXTRACT_PERCENT_PATTERN);
                
                planDetails.addBenefit(benefitNames, "CLASS_3_MAJOR", "IN", inValue);
                planDetails.addBenefit(benefitNames, "CLASS_3_MAJOR", "OUT", outValue);

                print("    CLASS_3_MAJOR: in=", inValue, " out=", outValue);

            } else if (column(2).matches(CLASS_4_ORTHODONTIA)) {

                String inValue = column(inNetworkIndex).extract(EXTRACT_PERCENT_PATTERN); 
                String outValue = column(outNetworkIndex).extract(EXTRACT_PERCENT_PATTERN);

                planDetails.addBenefit(benefitNames, "CLASS_4_ORTHODONTIA", "IN", inValue);
                planDetails.addBenefit(benefitNames, "CLASS_4_ORTHODONTIA", "OUT", outValue);
                
                print("    CLASS_4_ORTHODONTIA: in=", inValue, " out=", outValue);

            } else if (column(2).matches(ORTHO_ELIGIBILITY)) {

                String inValue = column(inNetworkIndex-1,inNetworkIndex+1).value(); 
                String outValue = column(outNetworkIndex-1,outNetworkIndex+1).value();

                planDetails.addBenefit(benefitNames, "ORTHO_ELIGIBILITY", "IN", inValue);
                planDetails.addBenefit(benefitNames, "ORTHO_ELIGIBILITY", "OUT", outValue);
                
                print("    ORTHO_ELIGIBILITY: in=", inValue, " out=", outValue);

            } else if (column(2).matches(CALENDAR_YEAR_MAXIMUM)) {

                String inValue = column(inNetworkIndex).value(); 
                String outValue = column(outNetworkIndex).value();

                planDetails.addBenefit(benefitNames, "CALENDAR_YEAR_MAXIMUM", "IN", inValue);
                planDetails.addBenefit(benefitNames, "CALENDAR_YEAR_MAXIMUM", "OUT", outValue);

                print("    CALENDAR_YEAR_MAXIMUM: in=", inValue, " out=", outValue);
                
            } else if (column(2).matches(ORTHODONTIA_LIFETIME_MAX)) {

                String inValue = column(inNetworkIndex).value(); 
                String outValue = column(outNetworkIndex).value();

                planDetails.addBenefit(benefitNames, "ORTHODONTIA_LIFETIME_MAX", "IN", inValue);
                planDetails.addBenefit(benefitNames, "ORTHODONTIA_LIFETIME_MAX", "OUT", outValue);
                
                print("    ORTHODONTIA_LIFETIME_MAX: in=", inValue, " out=", outValue);
                
            } else if (column(2).matches(FULLY_INSURED_RATES)) {
                
                // find column indexes for tier and rates
                while (getNextRow()) {
                    if (findColumn(1,13,TIER_PATTERN)) { 
                        tierIndex = foundedIndex;
                    }
                    if (findColumn(1,13,RATES_PATTERN)) {
                        ratesIndex = foundedIndex;
                        break;
                    }
                };
                
                List<String> rates = new ArrayList<String>(5);
                while (getNextRow()) {
                    if (column(tierIndex).matches(EMPLOYEE_SPOUSE)) {
                        rates.add(removeDollarSignIfPresent(column(ratesIndex).value().toString()));
                        print("    Employee + Spouse: ", value());
                    } else if (column(tierIndex).matches(EMPLOYEE_CHILDREN)) {
                        rates.add(removeDollarSignIfPresent(column(ratesIndex).value().toString()));
                        print("    Employee + Child(ren): ", value());
                    } else if (column(tierIndex).matches(EMPLOYEE_FAMILY)) {
                        rates.add(removeDollarSignIfPresent(column(ratesIndex).value().toString()));
                        print("    Employee + Family: ", value());
                    } else if (column(tierIndex).matches(EMPLOYEE)) {
                        rates.add(removeDollarSignIfPresent(column(ratesIndex).value().toString()));
                        print("    Employee: ", value());
                    } else if (column(tierIndex).matches(EMPLOYEE_ONE)) {
                        rates.add(removeDollarSignIfPresent(column(ratesIndex).value().toString()));
                        print("    Employee + One: ", value());
                    } else if (column(tierIndex).matches(TOTALS)) {
                        print("    Totals ");
                        break;
                    }
                };
                
                tierRates = rates.size();
                planInfo.setTier1Rate((tierRates > 0)?rates.get(0):"0.0");
                planInfo.setTier2Rate((tierRates > 1)?rates.get(1):"0.0");
                planInfo.setTier3Rate((tierRates > 2)?rates.get(2):"0.0");
                planInfo.setTier4Rate((tierRates > 3)?rates.get(3):"0.0");

                break;
            }

            // check row again
            if (column(14).matches(REIMBURSEMENT_SCHEDULE)) {
                planDetails.addBenefit(benefitNames,"REIMBURSEMENT_SCHEDULE","IN",column(15,20).value());
                print("    REIMBURSEMENT_SCHEDULE: ", value());
            } else if (column(14).matches(IMPLANTS)) {
                planDetails.addBenefit(benefitNames,"IMPLANT_COVERAGE","IN",column(15,20).value());
                print("    IMPLANT_COVERAGE: ", value());
            } else if (column(14).matches(CONTRACT_LENGTH_PATTERN)) {
            	planInfo.addAttribute(QuotePlanAttributeName.CONTRACT_LENGTH,column(15,20).value());
                print("    CONTRACT_LENGTH: ", value());
            } else if (column(14).matches(PARTICIPATION_REQUIREMENT)) {
                if (containsIgnoreCase(column(15,20).value(),"voluntary")) {
                    planInfo.setVoluntary(true);
                }    
                print("    PARTICIPATION_REQUIREMENT: ", value());
            } else if (column(14).matches(PROGRAM)) {
                column(15,20); // get new value
                if (containsIgnoreCase(value(),"complete")) {
                    planInfo.addAttribute(QuotePlanAttributeName.PROGRAM,"Complete");
                } else if (containsIgnoreCase(value(),"prime")) {
                    planInfo.addAttribute(QuotePlanAttributeName.PROGRAM,"Prime");
                }
                print("    PROGRAM: ", value());
            }
           
        }
        
        // if some benefits are missing, default to N/A
        defaultBenefitsNotFound(planDetails);
    }

    private String removeDollarSignIfPresent(String str){
        if(str.startsWith("$")){
            return str.substring(1);
        }else{
            return str;
        }
    }

    private void doParseAlternatives(Sheet sheet) throws ParseException {
        
        if (sheet == null) { return; }
        
        print("Parse Alterntives");
    
        AnthemNetworkDetails detail =  planInformation.get(RATE_DESCRIPTION).getAnthemNetworks().get(NETWORK_NAME);
    
        String commonPlanName = "";
        String implants = "N/A";
        String reimbursement = "N/A";
        String contractLength = null;
        String program = null;
        boolean voluntary = false;
        
        rowIterator = sheet.iterator();

        // find plan name
        while(getNextRow()) {
            if (column(0).matches(PLAN_NAME_PATTERN)) {
                commonPlanName = column(2).value() + " - ";
                print("  CommonPlanName: ", commonPlanName);
                break;
            }
        }
        
        // find until alternatives
        while(getNextRow()) {
            if (column(0).matches(IMPLANTS)) {
                implants = column(2,7).value();
            } else if (column(0).matches(REIMBURSEMENT_SCHEDULE)) {
                reimbursement = column(2,7).value();
            } else if (column(0).matches(CONTRACT_LENGTH_PATTERN)) {
            	contractLength = column(2,7).value();
            } else if (column(0).matches(PARTICIPATION_REQUIREMENT)) {
                if (containsIgnoreCase(column(2,7).value(), "voluntary")) {
                    voluntary = true;
                }
            } else if (column(0).matches(PROGRAM)) {
                program = column(2,7).value();
            } else if (column(0).matches(ALTERNATIVES)) {
                print("  Found alternatives: row=", Integer.toString(row.getRowNum()));
                break;
            }
        }

        getNextRow();
        int deductibleIndex = findColumnIndex(1,15,DEDUCTIBLE);
        int class1PreventiveIndex = findColumnIndex(1,15,CLASS_1_PREVENTIVE);
        int class2BasicIndex = findColumnIndex(1,15,CLASS_2_BASIC);
        int class3MajorIndex = findColumnIndex(1,15,CLASS_3_MAJOR);
        int orthodontiaIndex = findColumnIndex(1,15,ORTHODONTIA);
        int maxAnnualIndex = findColumnIndex(1,15,MAX_ANNUAL);
        int employeeIndex = findColumnIndex(1,15,EMPLOYEE);
        int employeeSpouseIndex = findColumnIndex(1,15,EMPLOYEE_SPOUSE);
        int employeeChildrenIndex = findColumnIndex(1,15,EMPLOYEE_CHILDREN);
        int employeeFamilyIndex = findColumnIndex(1,15,FAMILY);
        int employeeOneIndex = findColumnIndex(1,15,EMPLOYEE_ONE);
        
        while(getNextRow() && isNumeric(column(0).value())) {

            String planName = commonPlanName + value();
            print("  PlanName: ", planName);

            AnthemPlanDetails planInfo = new AnthemPlanDetails();
            planInfo.setNetworkName(detail.getNetworkName());
            planInfo.setNetworkType(detail.getNetworkType());
            detail.getPlanDetails().add(planInfo);
            GenericPlanDetails planDetails = new GenericPlanDetails();
            planInfo.setGenericPlanDetails(planDetails);        
            planInfo.setPlanName(planName);
            planInfo.setPlanNameLocation(CellReference.convertNumToColString(0) + (row.getRowNum() + 1));
            if (contractLength != null) {
            	planInfo.addAttribute(QuotePlanAttributeName.CONTRACT_LENGTH, contractLength);
            	print("    CONTRACT_LENGTH: ", contractLength);
            }
            if (voluntary) {
                planInfo.setVoluntary(true);
                print("    VOLUNTARY");
            }
            if (program != null) {
                planInfo.addAttribute(QuotePlanAttributeName.PROGRAM, program);
                print("    PROGRAM: ", program);
            }
            
            String[] values = column(deductibleIndex).values(2);
            planDetails.addBenefit(benefitNames, "DENTAL_INDIVIDUAL", "IN", values[0]);
            planDetails.addBenefit(benefitNames, "DENTAL_INDIVIDUAL", "OUT", values[0]);
            print("    DENTAL_INDIVIDUAL: in=", values[0]);

            planDetails.addBenefit(benefitNames, "DENTAL_FAMILY", "IN", values[1]);
            planDetails.addBenefit(benefitNames, "DENTAL_FAMILY", "OUT", values[1]);
            print("    DENTAL_FAMILY: in=", values[1]);
            
            String value = column(maxAnnualIndex).value();
            planDetails.addBenefit(benefitNames, "CALENDAR_YEAR_MAXIMUM", "IN", value);
            planDetails.addBenefit(benefitNames, "CALENDAR_YEAR_MAXIMUM", "OUT", value);
            
            print("    CALENDAR_YEAR_MAXIMUM: in=", value, " out=", value);
            
            values = column(class1PreventiveIndex).values(2);
            planDetails.addBenefit(benefitNames, "CLASS_1_PREVENTIVE", "IN", values[0]);
            planDetails.addBenefit(benefitNames, "CLASS_1_PREVENTIVE", "OUT", values[1]);
            print("    CLASS_1_PREVENTIVE: in=", values[0], " out=", values[1]);

            values = column(class2BasicIndex).values(2);
            planDetails.addBenefit(benefitNames, "CLASS_2_BASIC", "IN", values[0]);
            planDetails.addBenefit(benefitNames, "CLASS_2_BASIC", "OUT", values[1]);
            print("    CLASS_2_BASIC: in=", values[0], " out=", values[1]);

            values = column(class3MajorIndex).values(2);
            planDetails.addBenefit(benefitNames, "CLASS_3_MAJOR", "IN", values[0]);
            planDetails.addBenefit(benefitNames, "CLASS_3_MAJOR", "OUT", values[1]);
            print("    CLASS_3_MAJOR: in=", values[0], " out=", values[1]);

            values = column(orthodontiaIndex).values(3);
            planDetails.addBenefit(benefitNames, "CLASS_4_ORTHODONTIA", "IN", values[0]);
            planDetails.addBenefit(benefitNames, "CLASS_4_ORTHODONTIA", "OUT", values[0]);
            print("    CLASS_4_ORTHODONTIA: in=", values[0], " out=", values[0]);

            planDetails.addBenefit(benefitNames, "ORTHO_ELIGIBILITY", "IN", values[1]);
            planDetails.addBenefit(benefitNames, "ORTHO_ELIGIBILITY", "OUT", values[1]);
            print("    ORTHO_ELIGIBILITY: in=", values[1], " out=", values[1]);

            planDetails.addBenefit(benefitNames, "ORTHODONTIA_LIFETIME_MAX", "IN", values[2]);
            planDetails.addBenefit(benefitNames, "ORTHODONTIA_LIFETIME_MAX", "OUT", values[2]);
            print("    ORTHODONTIA_LIFETIME_MAX: in=", values[2], " out=", values[2]);

            planDetails.addBenefit(benefitNames,"REIMBURSEMENT_SCHEDULE","IN",reimbursement);
            print("    REIMBURSEMENT_SCHEDULE: ", reimbursement);
            
            planDetails.addBenefit(benefitNames,"IMPLANT_COVERAGE","IN", implants);
            print("    IMPLANT_COVERAGE: ", implants);
            
            List<String> rates = new ArrayList<String>(5);
            if ( employeeIndex > -1 ) {
                rates.add(removeDollarSignIfPresent(column(employeeIndex).value().toString()));
                print("    Employee: ", lastValue);
            } 
            if ( employeeSpouseIndex > -1 ) {
                rates.add(removeDollarSignIfPresent(column(employeeSpouseIndex).value().toString()));
                print("    Employee + Spouse: ", lastValue);
            } 
            if ( employeeOneIndex > -1 ) {
                rates.add(removeDollarSignIfPresent(column(employeeOneIndex).value().toString()));
                print("    Employee + One: ", value());
            } 
            if ( employeeChildrenIndex > -1 ) {
                rates.add(removeDollarSignIfPresent(column(employeeChildrenIndex).value().toString()));
                print("    Employee + Child(ren): ", lastValue);
            } 
            if ( employeeFamilyIndex > -1 ) {
                rates.add(removeDollarSignIfPresent(column(employeeFamilyIndex).value().toString()));
                print("    Employee + Family: ", lastValue);
            } 
            
            if (tierRates != rates.size()) {
                throw new ValidationException("Alternatives tierRates are different from primaryPlan tierRates");
            };
            planInfo.setTier1Rate((tierRates > 0)?rates.get(0):"0.0");
            planInfo.setTier2Rate((tierRates > 1)?rates.get(1):"0.0");
            planInfo.setTier3Rate((tierRates > 2)?rates.get(2):"0.0");
            planInfo.setTier4Rate((tierRates > 3)?rates.get(3):"0.0");

            // if some benefits are missing, default to N/A
            defaultBenefitsNotFound(planDetails);
            //break;
        }    
 
    }

    
    private void defaultBenefitsNotFound(GenericPlanDetails planDetails){
        for(String benefitName : dppoBenefits.keySet()){
            if(!planDetails.getBenefitKeysAdded().containsKey(benefitName)){
                print("    Missing benefit: ", benefitName);
                String[] inputTypes = dppoBenefits.get(benefitName).split("_");
                for(String inputType : inputTypes){
                    planDetails
                        .addBenefit(benefitNames,
                            benefitName,
                            inputType,
                            "N/A"
                        );
                }
            }
        }
    }
    
    private boolean getNextRow() {
        if (rowIterator.hasNext()) {
            row = rowIterator.next();
            return true;
        }
        return false;
    }
    
    private AnthemDPPOParser column(int index) {
        if (index < 0) {
            lastValue = "N/A";
        } else {
            Cell cell = row.getCell(index);
            if(cell == null) { 
                lastValue = "";
            } else {
                lastValue = cell.getStringCellValue().replace("\"", "");
                if (NOT_AVAILABLE.matcher(lastValue).matches()) {
                    lastValue = "N/A";
                };
            }
        }
        return this;
    }
    
    private AnthemDPPOParser column(int startIndex, int endIndex) {
        StringBuilder sb = new StringBuilder();
        for (int index=startIndex;index<=endIndex;index++) {
            Cell cell = row.getCell(index);
            if(cell != null) { 
                sb.append(cell.getStringCellValue().replace("\"", ""));
            }
        }
        lastValue = sb.toString();
        return this;
    }
    
    private boolean matches(Pattern pattern) {
        return pattern.matcher(lastValue).matches();
    } 

    private String value() {
        return lastValue;
    }
    
    private String[] values(int expectedNumber) {
        
        if (expectedNumber > MAX_VALUES_IN_CELL) {
            throw new ValidationException("Too many values in a cell");
        }
        
        if (NA_PATTERN.matcher(lastValue).matches()) {
            return NA_VALUES;
         }
          
        String[] split = lastValue.split("/");
        
        if ( split.length != expectedNumber ) {
            throw new ValidationException("Number values in a cell doesn't match");
        }
        
        return split;
    }
    
    private boolean findColumn(int startIndex, int endIndex, Pattern name) {
        for (int ind=startIndex;ind<=endIndex;ind++) {
            if (column(ind).matches(name)) {
                foundedIndex = ind;
                return true;
            }
        }
        return false;
    }
    
    private int findColumnIndex(int startIndex, int endIndex, Pattern name) {
        for (int ind=startIndex;ind<=endIndex;ind++) {
            //print(column(ind).value());
            if (column(ind).matches(name)) {
                return ind;
            }
        }
        return -1;
    }
    
    private String extract(Pattern pattern) {
        Matcher m = pattern.matcher(lastValue);
        if (m.find()) {
            return m.group(1); 
        }
        return lastValue;
    }
    
    private String extractYesNo() {
        String tmpValue = lastValue.toUpperCase();
        if (tmpValue.contains("YES")) {
            return "Yes";
        } 
        if (tmpValue.contains("NO")) {
            return "No";
        } 
        return lastValue;
    }
    
    @Override
    public String deriveNetworkName(String category, String plan, String network) {
        return NETWORK_NAME;
    }

    @Override
    public LinkedHashMap<String, RateDescriptionDTO> getAllMedicalParsedPlanInformation() {
        return null;        
    }

    @Override
    public LinkedHashMap<String, RateDescriptionDTO> getAllVisionParsedPlanInformation() {
        return null;
    }

    @Override
    public LinkedHashMap<String, RateDescriptionDTO> getAllDentalParsedPlanInformation() {
        return planInformation;
    }

    @Override
    public void setAllDentalParsedPlanInformation(LinkedHashMap<String, RateDescriptionDTO> allDentalParsedPlanInformation) {
        this.planInformation = allDentalParsedPlanInformation;
    }

    @Override
    public int getTiers() {
        return tierRates;
    }

    @Override
    public void setBenefitNames(List<BenefitName> benefitNames) {
        this.benefitNames = benefitNames;
    }

    /** Utility methods start below **/
    private void print(String...strs) {
        if(DEBUG){
            for (String str:strs) {
                System.out.print(str);
            }
            System.out.println();
        }
    }
    
}
