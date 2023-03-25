package com.benrevo.common.anthem;

import org.apache.poi.ss.usermodel.Row;

import java.util.Iterator;
import static org.apache.commons.lang3.StringUtils.isEmpty;

public class AnthemOptimizerVisionSheetParser extends AnthemOptimizerParser{

    public AnthemOptimizerVisionSheetParser(AnthemOptimizerParserData data) {
        super(data);
    }

    public void processVisionSheet(Iterator<Row> rowIterator ) {

        // Traversing over each row
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();

            if (getStringOrEmpty(row,'l').contains("VISION COMPARISON")) {
                logger.info("Found: VISION COMPARISON");
                parseVision(rowIterator, 'n', 'm', 'n');
                break;
            } else if (getStringOrEmpty(row,'b').contains("VISION COMPARISON")) {
                logger.info("Found: VISION COMPARISON at column 'b'");
                parseVision(rowIterator, 'd', 'c', 'd');
                break;
            }
            if (row.getRowNum() > 98) {
                // stop
                break;
            };
        }
    }
    
    private void parseVision(Iterator<Row> rowIterator, char carrierCol, char censusCol, char rateCol) {
        AnthemOptimizerPlanDetails plan = new AnthemOptimizerPlanDetails();
        data.getVisionPlans().add(plan);
        plan.setPlanName("VISION");
        plan.setPlanType("VISION");

        Row row = getNextRow(rowIterator);
        plan.setCarrierName(getString(row, carrierCol, "Vision Carrier Name", ANCILLARY_EXHIBIT_SHEET));

        // tier1
        row = skipAndGetRow(rowIterator,3);

        plan.setTier1Rate(getFloat(row, rateCol, "Vision Plan Tier 1 Rate", ANCILLARY_EXHIBIT_SHEET));
        plan.setTier1Census(getLong(row, censusCol, "Vision Plan Tier 1 Enrollment", ANCILLARY_EXHIBIT_SHEET));
        plan.setTier1ErContribution(data.getVisionDepContribution());
        data.setVisionTierRates(1);

        // tier2
        row = getNextRow(rowIterator);
        String tier2Rate = getStringOrEmpty(row,rateCol);
        if(!isEmpty(tier2Rate)) {
            plan.setTier2Rate(parseFloat(row, rateCol, "Vision Plan Tier 2 Rate", ANCILLARY_EXHIBIT_SHEET, tier2Rate));
            plan.setTier2Census(getLong(row, censusCol, "Vision Plan Tier 2 Enrollment", ANCILLARY_EXHIBIT_SHEET));
            plan.setTier2ErContribution(data.getVisionDepContribution());
            data.setVisionTierRates(2);
        }

        // tier3
        row = getNextRow(rowIterator);
        String tier3Rate = getStringOrEmpty(row,rateCol);
        if(!isEmpty(tier3Rate)) {
            plan.setTier3Rate(parseFloat(row, rateCol, "Vision Plan Tier 3 Rate", ANCILLARY_EXHIBIT_SHEET, tier3Rate));
            plan.setTier3Census(getLong(row, censusCol, "Vision Plan Tier 3 Enrollment", ANCILLARY_EXHIBIT_SHEET));
            plan.setTier3ErContribution(data.getVisionDepContribution());
            data.setVisionTierRates(3);
        }
        // tier4
        row = getNextRow(rowIterator);
        String tier4Rate = getStringOrEmpty(row,rateCol);
        if(!isEmpty(tier4Rate)) {
            plan.setTier4Rate(parseFloat(row, rateCol, "Vision Plan Tier 4 Rate", ANCILLARY_EXHIBIT_SHEET, tier4Rate));
            plan.setTier4Census(getLong(row, censusCol, "Vision Plan Tier 4 Enrollment", ANCILLARY_EXHIBIT_SHEET));
            plan.setTier4ErContribution(data.getVisionDepContribution());
            data.setVisionTierRates(4);
        }
        logger.info("\t{}", plan);

    }
}
