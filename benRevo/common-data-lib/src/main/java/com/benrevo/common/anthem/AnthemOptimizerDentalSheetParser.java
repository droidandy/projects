package com.benrevo.common.anthem;

import org.apache.poi.ss.usermodel.Row;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Pattern;

import static org.apache.commons.lang3.StringUtils.isEmpty;

public class AnthemOptimizerDentalSheetParser extends AnthemOptimizerParser{

    private static final Pattern DENTAL_SECTION_PATTERN_TYPE1 = Pattern.compile("\\s*SECTION\\s+(\\d+):\\s+((\\S+).*)",Pattern.CASE_INSENSITIVE);
    private static final Pattern DENTAL_SECTION_PATTERN_TYPE2 = Pattern.compile("\\s*SECTION\\s+3:\\s+CURRENT\\s+DENTAL\\s+PLANS.*",Pattern.CASE_INSENSITIVE);
    private static final Pattern DENTAL_SECTION_PATTERN_TYPE4 = Pattern.compile("\\s*SECTION\\s+2:\\s+CURRENT\\s+DENTAL\\s+PLANS.*",Pattern.CASE_INSENSITIVE);
    private static final Pattern DENTAL_CARRIER_PATTERN = Pattern.compile("\\s*Current Carrier.*",Pattern.CASE_INSENSITIVE);
    private static final Pattern VISION_SECTION_PATTERN = Pattern.compile("\\s*SECTION\\s+5:\\s+CURRENT\\s+VISION\\s+PLANS.*",Pattern.CASE_INSENSITIVE);
    private static final Pattern VISION_SECTION_PATTERN_TYPE2 = Pattern.compile("\\s*SECTION\\s+3:\\s+CURRENT\\s+VISION\\s+PLANS.*",Pattern.CASE_INSENSITIVE);
    
    public AnthemOptimizerDentalSheetParser(AnthemOptimizerParserData data) {
        super(data);
    }

    public void processDentalSheet(Iterator<Row> rowIterator) {

        String[] values = new String[4];
        int indexSectionRow = 0;
        String planName = null;
        String planType = null;
        String value = null;
        AnthemOptimizerPlanDetails plan = null;
        int fileType = 0;
        int type4Section2Row = 0;

        // Traversing over each row
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();

            if (data.isHasDental() && contains(getStringOrEmpty(row,'b'), DENTAL_CARRIER_PATTERN , null)) {

                data.setDentalCarrier(getString(row, (fileType == 4) ? 'd' : 'c', "Dental Carrier", DENTAL_INTAKE_SHEET));
                logger.info("\t\tDental carrier={}", data.getDentalCarrier());
            }

            // dental type 4
            value = getStringOrEmpty(row,'g');
            if (data.isHasDental() && contains(value, DENTAL_SECTION_PATTERN_TYPE4 , null)) {
                type4Section2Row = row.getRowNum();
                fileType = 4;
            } else if (type4Section2Row != 0) {
                int index = row.getRowNum() - type4Section2Row; // index row since section header
                if (index >=2) {
                    int planSectionIndex = (index - 2) % 4; // index row within plan section
                    if (planSectionIndex == 0) { // rates 

                        String tier1Rate = getStringOrEmpty(row,'i');
                        if ( tier1Rate.isEmpty() ) {
                            // skip empty plan
                            plan = null;
                            continue;
                        }
                        
                        plan = new AnthemOptimizerPlanDetails();
                        data.getDentalPlans().add(plan);

                        plan.setPlanName(getString(row, 'g', "Dental Plan Name", DENTAL_SHEET));
                        plan.setPlanType(plan.getPlanName().split(" ")[0]);
                        
                        plan.setTier1Rate(parseFloat(row, 'i', "Dental Plan Tier 1 Rate", DENTAL_SHEET, tier1Rate));
                        plan.setTier1ErContribution(data.getDentalEeContribution());
                        data.setDentalTierRates(1);

                        String tier2Rate = getStringOrEmpty(row,'j');
                        if(!isEmpty(tier2Rate)){
                            plan.setTier2Rate(parseFloat(row,'j', "Dental Plan Tier 2 Rate", DENTAL_SHEET, tier2Rate));
                            plan.setTier2ErContribution( data.getDentalDepContribution());
                            data.setDentalTierRates(2);
                        }

                        String tier3Rate = getStringOrEmpty(row,'k');
                        if(!isEmpty(tier3Rate)){
                            plan.setTier3Rate(parseFloat(row,'k', "Dental Plan Tier 3 Rate", DENTAL_SHEET, tier3Rate));
                            plan.setTier3ErContribution( data.getDentalDepContribution());
                            data.setDentalTierRates(3);
                        }
                        
                        String tier4Rate = getStringOrEmpty(row,'l');
                        if(!isEmpty(tier4Rate)){
                            plan.setTier4Rate(parseFloat(row,'l', "Dental Plan Tier 4 Rate", DENTAL_SHEET, tier4Rate));
                            plan.setTier4ErContribution( data.getDentalDepContribution());
                            data.setDentalTierRates(4);
                        }
                        
                    } else if (plan != null && planSectionIndex == 1) { // enrollment
                        
                        plan.setTier1Census(getLong(row,'i', "Dental Plan Tier 1 Enrollment", DENTAL_INTAKE_SHEET));
                        if(data.getDentalTierRates() > 1){
                            plan.setTier2Census(getLong(row,'j', "Dental Plan Tier 2 Enrollment", DENTAL_INTAKE_SHEET));
                        }
                        if(data.getDentalTierRates() > 2){
                            plan.setTier3Census(getLong(row,'k', "Dental Plan Tier 3 Enrollment", DENTAL_INTAKE_SHEET));
                        }
                        if(data.getDentalTierRates() > 3){
                            plan.setTier4Census(getLong(row,'l', "Dental Plan Tier 4 Enrollment", DENTAL_INTAKE_SHEET));
                        }

                    } 
                    if (index == 13) { // end section
                        type4Section2Row = 0;
                    }    
                }
            }    

            // vision type 4
            if (data.isHasVision() && contains(value, VISION_SECTION_PATTERN_TYPE2 , null)) {
                
                data.setFoundVision(true);
                
                plan = new AnthemOptimizerPlanDetails();
                plan.setPlanName("VISION");
                plan.setPlanType("VISION");
                
                row = getNextRow(rowIterator);
                plan.setCarrierName(getString(row, 'i', "Vision Carrier Name", DENTAL_SHEET));

                data.setVisionTierRates(getLong(row, 'm', "Vision Tiers", DENTAL_SHEET).intValue());
                row = skipAndGetRow(rowIterator,2);

                String tier1Rate = getStringOrEmpty(row,'i');
                if ( tier1Rate.isEmpty() ) {
                    // skip empty plan
                    plan = null;
                    continue;
                }

                data.getVisionPlans().add(plan);
                plan.setTier1Rate(parseFloat(row, 'i', "Vision Plan Tier 1 Rate", DENTAL_SHEET, tier1Rate));
                
                plan.setTier1ErContribution(data.getVisionEeContribution());
                if(data.getVisionTierRates() > 1){
                    plan.setTier2Rate(getFloat(row,'j', "Vision Plan Tier 2 Rate", DENTAL_SHEET));
                    plan.setTier2ErContribution(data.getVisionDepContribution());
                }
                if(data.getVisionTierRates() > 2){
                    plan.setTier3Rate(getFloat(row,'k', "Vision Plan Tier 3 Rate", DENTAL_SHEET));
                    plan.setTier3ErContribution(data.getVisionDepContribution());
                }
                if(data.getVisionTierRates() > 3){
                    plan.setTier4Rate(getFloat(row,'l', "Vision Plan Tier 4 Rate", DENTAL_SHEET));
                    plan.setTier4ErContribution(data.getVisionDepContribution());
                }

                row = getNextRow(rowIterator);

                plan.setTier1Census(getLong(row,'i', "Vision Plan Tier 1 Enrollment", DENTAL_INTAKE_SHEET));
                if(data.getVisionTierRates() > 1){
                    plan.setTier2Census(getLong(row,'j', "Vision Plan Tier 2 Enrollment", DENTAL_INTAKE_SHEET));
                }
                if(data.getVisionTierRates() > 2){
                    plan.setTier3Census(getLong(row,'k', "Vision Plan Tier 3 Enrollment", DENTAL_INTAKE_SHEET));
                }
                if(data.getVisionTierRates() > 3){
                    plan.setTier4Census(getLong(row,'l', "Vision Plan Tier 4 Enrollment", DENTAL_INTAKE_SHEET));
                }

                logger.info("\t{}", plan);
            }

            
            // dental type 2
            value = getStringOrEmpty(row,'f');
            if (data.isHasDental() && contains(value, DENTAL_SECTION_PATTERN_TYPE2 , null)) {
                fileType = 2;
                skipRow(rowIterator, 1); 
                for (int i=0; i<3; i++) {
                    row = getNextRow(rowIterator);
                    
                    String columnName = getStringOrEmpty(row,'g');
                    if (columnName.toUpperCase().contains("ANTHEM")) {
                        // type 3 file: skip that row
                        row = getNextRow(rowIterator);
                    }
                    
                    String tier1Rate = getStringOrEmpty(row,'h');
                    if ( tier1Rate.isEmpty() ) {
                        // skip empty plan
                        skipRow(rowIterator,1);
                        continue;
                    }
                    
                    plan = new AnthemOptimizerPlanDetails();
                    data.getDentalPlans().add(plan);

                    plan.setPlanName(getString(row, 'f', "Dental Plan Name", DENTAL_INTAKE_SHEET));
                    plan.setPlanType(plan.getPlanName().split(" ")[0]);
                    
                    plan.setTier1Rate(parseFloat(row, 'h', "Dental Plan Tier 1 Rate", DENTAL_INTAKE_SHEET, tier1Rate));
                    plan.setTier1ErContribution(data.getDentalEeContribution());
                    data.setDentalTierRates(1);

                    String tier2Rate = getStringOrEmpty(row,'i');
                    if(!isEmpty(tier2Rate)){
                        plan.setTier2Rate(parseFloat(row,'i', "Dental Plan Tier 2 Rate", DENTAL_INTAKE_SHEET, tier2Rate));
                        plan.setTier2ErContribution( data.getDentalDepContribution());
                        data.setDentalTierRates(2);
                    }

                    String tier3Rate = getStringOrEmpty(row,'j');
                    if(!isEmpty(tier3Rate)){
                        plan.setTier3Rate(parseFloat(row,'j', "Dental Plan Tier 3 Rate", DENTAL_INTAKE_SHEET, tier3Rate));
                        plan.setTier3ErContribution( data.getDentalDepContribution());
                        data.setDentalTierRates(3);
                    }
                    
                    String tier4Rate = getStringOrEmpty(row,'k');
                    if(!isEmpty(tier4Rate)){
                        plan.setTier4Rate(parseFloat(row,'k', "Dental Plan Tier 4 Rate", DENTAL_INTAKE_SHEET, tier4Rate));
                        plan.setTier4ErContribution( data.getDentalDepContribution());
                        data.setDentalTierRates(4);
                    }
                    
                    row = getNextRow(rowIterator);
                    
                    plan.setTier1Census(getLong(row,'h', "Dental Plan Tier 1 Enrollment", DENTAL_INTAKE_SHEET));
                    if(data.getDentalTierRates() > 1){
                        plan.setTier2Census(getLong(row,'i', "Dental Plan Tier 2 Enrollment", DENTAL_INTAKE_SHEET));
                    }
                    if(data.getDentalTierRates() > 2){
                        plan.setTier3Census(getLong(row,'j', "Dental Plan Tier 3 Enrollment", DENTAL_INTAKE_SHEET));
                    }
                    if(data.getDentalTierRates() > 3){
                        plan.setTier4Census(getLong(row,'k', "Dental Plan Tier 4 Enrollment", DENTAL_INTAKE_SHEET));
                    }

                }
            } 

            // vision type 2
            if (data.isHasVision() && contains(value, VISION_SECTION_PATTERN , null)) {
                
                data.setFoundVision(true);
                
                plan = new AnthemOptimizerPlanDetails();
                data.getVisionPlans().add(plan);
                plan.setPlanName("VISION");
                plan.setPlanType("VISION");
                
                row = getNextRow(rowIterator);
                plan.setCarrierName(getString(row, 'h', "Vision Carrier Name", DENTAL_INTAKE_SHEET));

                // tiers
                row = skipAndGetRow(rowIterator,2);

                plan.setTier1Rate(getFloat(row,'h', "Vision Plan Tier 1 Rate", DENTAL_INTAKE_SHEET));
                plan.setTier1ErContribution(data.getVisionEeContribution());
                data.setVisionTierRates(1);

                String tier2Rate = getStringOrEmpty(row,'i');
                if(!isEmpty(tier2Rate)){
                    plan.setTier2Rate(parseFloat(row,'i', "Vision Plan Tier 2 Rate", DENTAL_INTAKE_SHEET, tier2Rate));
                    plan.setTier2ErContribution( data.getVisionDepContribution());
                    data.setVisionTierRates(2);
                }

                String tier3Rate = getStringOrEmpty(row,'j');
                if(!isEmpty(tier3Rate)){
                    plan.setTier3Rate(parseFloat(row,'j', "Vision Plan Tier 3 Rate", DENTAL_INTAKE_SHEET, tier3Rate));
                    plan.setTier3ErContribution( data.getVisionDepContribution());
                    data.setVisionTierRates(3);
                }

                String tier4Rate = getStringOrEmpty(row,'k');
                if(!isEmpty(tier4Rate)){
                    plan.setTier4Rate(parseFloat(row,'k', "Vision Plan Tier 4 Rate", DENTAL_INTAKE_SHEET, tier4Rate));
                    plan.setTier4ErContribution( data.getVisionDepContribution());
                    data.setVisionTierRates(4);
                }
                
                row = getNextRow(rowIterator);

                plan.setTier1Census(getLong(row,'h', "Vision Plan Tier 1 Enrollment", DENTAL_INTAKE_SHEET));
                if(data.getVisionTierRates() > 1){
                    plan.setTier2Census(getLong(row,'i', "Vision Plan Tier 2 Enrollment", DENTAL_INTAKE_SHEET));
                }
                if(data.getVisionTierRates() > 2){
                    plan.setTier3Census(getLong(row,'j', "Vision Plan Tier 3 Enrollment", DENTAL_INTAKE_SHEET));
                }
                if(data.getVisionTierRates() > 3){
                    plan.setTier4Census(getLong(row,'k', "Vision Plan Tier 4 Enrollment", DENTAL_INTAKE_SHEET));
                }

                logger.info("\t{}", plan);
            }
            
            // dental type 1
            if (data.isHasDental()) {
                value = getStringOrEmpty(row,'e');
                if (contains(value, DENTAL_SECTION_PATTERN_TYPE1 , values)) {

                    fileType = 1;
                    logger.info("Found: {}", value);
    
                    indexSectionRow = row.getRowNum();
                    planName = values[1];
                    planType = values[2];
                    
                } else if (indexSectionRow > 0) {    
                    switch (row.getRowNum() - indexSectionRow) { // index row since section header
                        case 2:
                            // tier1
                            String tier1Rate = getStringOrEmpty(row,'f');
                            if ( tier1Rate.isEmpty() ) {
                                // skip empty plan
                                indexSectionRow = 0;
                                continue;
                            }
                            plan = new AnthemOptimizerPlanDetails();
                            data.getDentalPlans().add(plan);
                            plan.setPlanName(planName);
                            plan.setPlanType(planType);
                            plan.setTier1Rate(parseFloat(row,'f', "Dental Plan Tier 1 Rate", DENTAL_INTAKE_SHEET, tier1Rate));
                            plan.setTier1Census(getLong(row,'e', "Dental Plan Tier 1 Enrollment", DENTAL_INTAKE_SHEET));
                            plan.setTier1ErContribution(data.getDentalEeContribution());
                            data.setDentalTierRates(1);
                            break;
    
                        case 3:
                            // tier2
                            String tier2Rate = getStringOrEmpty(row,'f');
                            if(!isEmpty(tier2Rate)) {
                                plan.setTier2Rate(parseFloat(row,'f', "Dental Plan Tier 2 Rate", DENTAL_INTAKE_SHEET, tier2Rate));
                                plan.setTier2Census(getLong(row,'e', "Dental Plan Tier 2 Enrollment", DENTAL_INTAKE_SHEET));
                                plan.setTier2ErContribution(data.getDentalDepContribution());
                                data.setDentalTierRates(2);
                            }
                            break;
    
                        case 4:
                            // tier3
                            String tier3Rate = getStringOrEmpty(row,'f');
                            if(!isEmpty(tier3Rate)) {
                                plan.setTier3Rate(parseFloat(row,'f', "Dental Plan Tier 3 Rate", DENTAL_INTAKE_SHEET, tier3Rate));
                                plan.setTier3Census(getLong(row,'e', "Dental Plan Tier 3 Enrollment", DENTAL_INTAKE_SHEET));
                                plan.setTier3ErContribution(data.getDentalDepContribution());
                                data.setDentalTierRates(3);
                            }
                            break;
    
                        case 5:
                            // tier4
                            String tier4Rate = getStringOrEmpty(row,'f');
                            if(!isEmpty(tier4Rate)) {
                                plan.setTier4Rate(parseFloat(row,'f', "Dental Plan Tier 4 Rate", DENTAL_INTAKE_SHEET, tier4Rate));
                                plan.setTier4Census(getLong(row,'e', "Dental Plan Tier 4 Enrollment", DENTAL_INTAKE_SHEET));
                                plan.setTier4ErContribution(data.getDentalDepContribution());
                                data.setDentalTierRates(4);
                            }
                            indexSectionRow = 0;
                            break;
                    }
                }
            }
            if (row.getRowNum() > 98) {
                // stop
                break;
            };
        }

        // add carrier info
        for (AnthemOptimizerPlanDetails planDetails : data.getDentalPlans()) {
            planDetails.setCarrierName(data.getDentalCarrier());
            logger.info("\t{}", planDetails);
        }
    }


}
