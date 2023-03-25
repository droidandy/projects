package com.benrevo.common.anthem;

import com.benrevo.common.exception.BaseException;
import java.util.Iterator;
import org.apache.poi.ss.usermodel.Row;

public class AnthemOptimizerIntakeSheetParser extends AnthemOptimizerParser{

    public AnthemOptimizerIntakeSheetParser(AnthemOptimizerParserData data) {
        super(data);
    }

    public void processIntakeSheet(Iterator<Row> rowIterator) throws Exception {

        String[] values = new String[1];
        // Traversing over each row of XLSX file
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();

            String header = getStringOrEmpty(row,'b');
            if(contains(header, SECTION_PATTERN , values)) {
                logger.info("Found: " + header);

                switch (values[0]) {
                    case "1":
                        parseSection1(rowIterator);
                        break;
                    case "4":
                        if (data.isParseAll() || data.isParseMedical()) {
                            parseSection4(rowIterator);
                        }
                        break;
                    case "5" :
                        parseSection5(rowIterator);
                        break;
                    case "7":
                        parseSection7(rowIterator);
                        break;
                    default:
                        //ignore, we don't want any information from there
                }
            }

            if (row.getRowNum() > 98) {
                // stop
                break;
            };
        }
    }

    private void parseSection1(Iterator<Row> rowIterator) {

        Row row = getNextRow(rowIterator);
        data.setClientName(getString(row, 'e', "Client Name", INTAKE_SHEET).trim());
        data.setSicCode(getString(row, 'j', "SIC Code", INTAKE_SHEET));
        data.setEligibleEmployees(Long.valueOf(getString(row, 'n', "Total Eligible Employees", INTAKE_SHEET).replace(",","")));
        parseDueDate(row);
        row = getNextRow(rowIterator);

        data.setParticipatingEmployees(Long.valueOf(getString(row, 'n', "Total Participating Employees", INTAKE_SHEET).replace(",","")));

        row = skipAndGetRow(rowIterator, 1);

        data.setEffectiveDate(getDate(row, 'e', "Effective Date", INTAKE_SHEET, "MM/dd/yy", false));
        row = getNextRow(rowIterator);
        data.setSalesPerson(getString(row, 'e', "Sales Executive", INTAKE_SHEET).trim());
        String agentName = getStringOrEmpty(row, 'i').trim();
        if (!agentName.isEmpty() 
                && !"No GA".equalsIgnoreCase(agentName) 
                && !"Select One".equalsIgnoreCase(agentName)) {
            data.setAgentName(agentName);
        }
        row = getNextRow(rowIterator);
        data.setPreSalesPerson(getString(row, 'e', "Pre-Sales person", INTAKE_SHEET).trim());
        if (data.getAgentName() != null ) {
            data.setAgentEmail(getString(row, 'i', "GA broker email", INTAKE_SHEET).trim());
            if ( "Enter GA Email".equals(data.getAgentEmail()) ) {
                
                if(data.getErrors() != null){
                    data.getErrors().add("GA broker email should be set. Sheet="
                        + INTAKE_SHEET 
                        + ", Row=" + (row.getRowNum() + 1) + ", Col=i");
                } else {
                    throw new BaseException("GA broker email should be set. Sheet="
                        + INTAKE_SHEET
                        + ", Row=" + (row.getRowNum() + 1) + ", Col=i");
                }
            }
        }
        row = skipAndGetRow(rowIterator, 2);
        data.setBrokerName(getString(row, 'e', "Brokerage Name", INTAKE_SHEET).trim());

        logger.info("\tClientName={}, Sic={}, BrokerName={}", data.getClientName(), data.getSicCode(), data.getBrokerName());
    }

    private void parseSection4(Iterator<Row> rowIterator) {

        AnthemOptimizerPlanDetails plan = null;

        Row row = getNextRow(rowIterator);
        int numberOfPlans = Integer.parseInt(getString(row, 'd', "Number of Plans", INTAKE_SHEET));
        data.setMedicalTierRates(Integer.parseInt(getString(row, 'l', "Number of Tiers", INTAKE_SHEET)));

        logger.info("\t\tnumberOfPlans={}, tierRates={}", numberOfPlans, data.getMedicalTierRates());

        skipRow(rowIterator, 1);

        AnthemOptimizerPlanDetails topLevelClientPlan = null;
        for(int index = 0; index < numberOfPlans; index++) {
            
            row = getNextRow(rowIterator);
          
            plan = new AnthemOptimizerPlanDetails();
            if (index == 0) {
                topLevelClientPlan = plan;
            }
            data.getMedicalPlans().add(plan);
            plan.setCarrierName(getString(row, 'b', "Carrier Name", INTAKE_SHEET));
            plan.setPlanType( getString(row, 'c', "Plan Type", INTAKE_SHEET));
            plan.setPlanName(getString(row, 'd', "Plan Name", INTAKE_SHEET));

            plan.setTier1Rate(getFloat(row, 'i', "Tier 1 Rate", INTAKE_SHEET));
            
            String contribution = getString(row, 'f', "Tier 1 Contribution", INTAKE_SHEET);
            if (contribution.toUpperCase().contains("BUY")) {
                // calculate BUY-UP
                plan.setTier1ErContribution(
                        topLevelClientPlan.getTier1ErContribution() *
                        topLevelClientPlan.getTier1Rate() /
                        plan.getTier1Rate()
                        );
            } else {
                plan.setTier1ErContribution(parseFloat(row, 'f', "Tier 1 Contribution", INTAKE_SHEET, contribution));
            }
            
            plan.setTier2Rate(getFloat(row, 'j', "Tier 2 Rate", INTAKE_SHEET));

            contribution = getString(row, 'g', "Tier 2 Contribution", INTAKE_SHEET);
            if (contribution.toUpperCase().contains("BUY")) {
                // calculate BUY-UP
                plan.setTier2ErContribution(
                        topLevelClientPlan.getTier2ErContribution() *
                        topLevelClientPlan.getTier2Rate() /
                        plan.getTier2Rate()
                        );
            } else {
                plan.setTier2ErContribution(parseFloat(row, 'g', "Tier 2 Contribution", INTAKE_SHEET, contribution));
            }
            
            if (data.getMedicalTierRates() > 2) {
                plan.setTier3Rate(getFloat(row, 'k', "Tier 3 Rate", INTAKE_SHEET));
                plan.setTier3ErContribution(plan.getTier2ErContribution());
            }
            if (data.getMedicalTierRates() > 3) {
                plan.setTier4Rate( getFloat(row, 'l', "Tier 4 Rate", INTAKE_SHEET));
                plan.setTier4ErContribution(plan.getTier2ErContribution());
            }
            
            row = getNextRow(rowIterator);
            
            plan.setTier1Census( getLong(row, 'i', "Tier 1 Enrollment", INTAKE_SHEET));
            plan.setTier2Census( getLong(row, 'j', "Tier 2 Enrollment", INTAKE_SHEET));
            if (data.getMedicalTierRates() > 2) {
                plan.setTier3Census(getLong(row, 'k', "Tier 3 Enrollment", INTAKE_SHEET));
            }
            if (data.getMedicalTierRates() > 3) {
                plan.setTier4Census( getLong(row, 'l', "Tier 4 Enrollment", INTAKE_SHEET));
            }

            logger.info("\t{}", plan);
        }
    }

    private void parseSection5(Iterator<Row> rowIterator) {

        Row row = getNextRow(rowIterator);
        if (data.isParseAll() || data.isParseMedical()) {
            data.setMedicalCommission(getString(row, 'e', "Medical Commission", INTAKE_SHEET));
            data.setHasMedical(true);
        }

        row = skipAndGetRow(rowIterator,2);
        //TODO: what are we suppose to do with the information here?
        String kaiser = getString(row, 'e', "Kaiser Type", INTAKE_SHEET);

        row = getNextRow(rowIterator);
        if (data.getAgentName() == null ) {
            data.setBrokerEmail(getString(row, 'i', "Broker Email Address", INTAKE_SHEET));
        }

        logger.info("\t\tcommissionStr={}, kaiser={}, brokerEmailAddress={}", data.getMedicalCommission(), kaiser, data.getBrokerEmail());

    }

    private void parseSection7(Iterator<Row> rowIterator) {

        skipRow(rowIterator, 2); //2 header rows in section 7

        for(int index = 0; index < 2; index++) {
            Row row = rowIterator.next();
            String plan = getStringOrEmpty(row, 'b').trim();
            String selection = getStringOrEmpty(row, 'c').trim();

            if ((data.isParseAll() || data.isParseDental()) 
                    && "Dental".equalsIgnoreCase(plan) 
                    && !selection.isEmpty() 
                    && !"N/A".equalsIgnoreCase(selection)) {
 
                data.setHasDental(true);
                data.setDentalCommission(getString(row, 'h', "Dental Commission", INTAKE_SHEET));
                data.setDentalEeContribution(getFloat(row, 'f', "Dental EE Contribution", INTAKE_SHEET));
                data.setDentalDepContribution(getFloat(row, 'g', "Dental DEP Contribution", INTAKE_SHEET));

                data.setDentalContributionType("%");

                if(data.getDentalDepContribution() != null
                    && (data.getDentalDepContribution().equals("0%")
                    || data.getDentalDepContribution().equals("0"))
                    ){

                    data.setDentalContributionType("VOLUNTARY");
                }

                logger.info("\t\t{} commission={}, dentalEeContribution={}, dentalDepContribution={}",
                    selection, data.getDentalCommission(), data.getDentalEeContribution(), data.getDentalDepContribution());
            }    

            if ((data.isParseAll() || data.isParseVision())
                    && "Vision".equalsIgnoreCase(plan) 
                    && !selection.isEmpty() 
                    && !"N/A".equalsIgnoreCase(selection)) { 

                data.setHasVision(true);
                data.setVisionCommission(getString(row, 'h', "Vision Commission", INTAKE_SHEET));
                data.setVisionEeContribution(getFloat(row, 'f', "Vision EE Contribution", INTAKE_SHEET));
                data.setVisionDepContribution(getFloat(row, 'g', "Vision Dep Contribution", INTAKE_SHEET));

                data.setVisionContributionType("%");
                if(data.getVisionEeContribution() != null
                    && (data.getVisionEeContribution().equals("0%")
                    || data.getVisionEeContribution().equals("0"))
                    ){
                    data.setVisionContributionType("VOLUNTARY");
                }

                logger.info("\t\t{} commission={}, visionEeContribution={}, visionDepContribution={}",
                    selection, data.getVisionCommission(), data.getVisionEeContribution(), data.getVisionDepContribution());
            }
        }
    }

    private void parseDueDate(Row row) {
        try {
            data.setDueDate(getDate(row, 'r', "Due Date", INTAKE_SHEET, "MM/dd/yy", true));
        } catch(Exception e) {
            logger.warn("Could not parse due date in optimizer");
        }
    }
}
    
