package com.benrevo.admin.program;

import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static com.benrevo.common.enums.PlanCategory.*;

import com.benrevo.be.modules.admin.util.PlanUtil;
import com.benrevo.be.modules.admin.util.helper.PlanHistoryHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanRateType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.PlanRate;
import com.benrevo.data.persistence.entities.ProgramToPnn;
import com.benrevo.data.persistence.repository.BenefitNameRepository;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRateRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.RiderMetaRepository;
import com.monitorjbl.xlsx.StreamingReader;
import java.io.InputStream;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.util.StringHelper.getStandardAnthemPlanName;

@Component
@Transactional
public class AnthemTechnologyTrustPlanParser extends BaseProgramParser{

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private PlanRateRepository planRateRepository;

    private Iterator<Row> rowIterator;
    private Row row;
    private String lastValue = "";

    private final Pattern NOT_AVAILABLE = Pattern.compile("\\s*Not\\s+Available\\s*",Pattern.CASE_INSENSITIVE);

    public AnthemTechnologyTrustPlanParser() {}

    public void parseFile(BrokerLocale locale, InputStream is) throws Exception {

        Workbook myWorkBook = null;
        Map<String, ProgramToPnn> planToProgramPnn = buildPlanToProgramPnn(
            CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.TECH_TRUST_PROGRAM,
            MEDICAL, DENTAL, VISION);
        try {
            myWorkBook = StreamingReader.builder()
                .rowCacheSize(100)
                .bufferSize(4096)
                .open(is);

            if(myWorkBook.getSheetIndex("Medical Rates") != -1){
                parseMedical(locale, myWorkBook.getSheet("Medical Rates"), planToProgramPnn);
            }else{
                throw new BaseException("Plan Design is missing Medical Rates sheet. Wrong sheet name?");
            }

            if(myWorkBook.getSheetIndex("Dental Rates") != -1){
                parseDental(locale, myWorkBook.getSheet("Dental Rates"), planToProgramPnn);
            }else{
                throw new BaseException("Plan Design is missing Dental Rates sheet. Wrong sheet name?");
            }

            saveStaticVision(planToProgramPnn);
        } finally {
            if(myWorkBook != null) {
                myWorkBook.close();
            }
        }
    }

    private void saveStaticVision(Map<String, ProgramToPnn> planToProgramPnn) {

        saveStaticVisionHelper(planToProgramPnn, getCalculatedName("BV3A"), 8.28F, 14.08F, 14.90F, 22.36F);
        saveStaticVisionHelper(planToProgramPnn, getCalculatedName("BV6A"), 6.52F, 11.08F, 11.74F, 17.60F);
        saveStaticVisionHelper(planToProgramPnn, getCalculatedName("BV6B"), 5.74F, 9.76F, 10.33F, 15.50F);

    }

    private void saveStaticVisionHelper(Map<String, ProgramToPnn> planToProgramPnn, String planName,
        Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate) {

        ProgramToPnn programToPnn = planToProgramPnn.get(planName);
        if(programToPnn == null){
            throw new NotFoundException("ProgramToPnn not found!").withFields(
                field("plan_name", planName)
            );
        }

        PlanRate planRate = getExistingPlanRate(programToPnn.getProgramToPnnId(),
            4, null, null,
            null, null, null, null, null);
        if(isNull(planRate)) {
            planRate = new PlanRate();
        }

        planRate.setProgramToPnnId(programToPnn.getProgramToPnnId());
        planRate.setTier1Rate(tier1Rate);
        planRate.setTier2Rate(tier2Rate);
        planRate.setTier3Rate(tier3Rate);
        planRate.setTier4Rate(tier4Rate);
        planRate.setRatingTiers(4);
        // save

        planRateRepository.save(planRate);
    }

    private void parseDental(BrokerLocale locale, Sheet sheet, Map<String, ProgramToPnn> planToProgramPnn) {
        rowIterator = sheet.iterator();

        // skip headers
        while(getNextRow()) {
            if (containsIgnoreCase(column(1).value(), "Plan Designs")) {
                break;
            }
        }

        while(getNextRow()) {
            if(isBlank(column(0).value()) && isBlank(column(1).value())
                && !isBlank(column(2).value()) && !isBlank(column(3).value())){
                // plan information

                String planName = getCalculatedName(deriveDPPOPlanName(column(2).value(), column(3).value()));

                if(isNull(planName)){
                    throw new BaseException("Technology Trust DPPO plan name cannot be derived!");
                }

                Float ratingBand = Float.parseFloat(column(4).value());
                String tier1Rate = column(5).value();
                String tier2Rate = column(6).value();
                String tier3Rate = column(7).value();
                String tier4Rate = column(7).value();

                ProgramToPnn programToPnn = planToProgramPnn.get(planName);
                if(programToPnn == null){
                    throw new NotFoundException("ProgramToPnn not found!").withFields(
                        field("plan_name", planName)
                    );
                }

                PlanRate planRate = getExistingPlanRate(programToPnn.getProgramToPnnId(),
                    4, ratingBand, null,
                    null, null, null, null, null);
                if(isNull(planRate)) {
                    planRate = new PlanRate();
                }

                planRate.setProgramToPnnId(programToPnn.getProgramToPnnId());
                planRate.setTier1Rate(parseFloatOrDefault(tier1Rate));
                planRate.setTier2Rate(parseFloatOrDefault(tier2Rate));
                planRate.setTier3Rate(parseFloatOrDefault(tier3Rate));
                planRate.setTier4Rate(parseFloatOrDefault(tier4Rate));
                planRate.setRatingTiers(4);
                planRate.setRatingBand(ratingBand);

                //save
                planRateRepository.save(planRate);
            }
        }

        // finally add static DHMO plan
        saveStaticVisionHelper(planToProgramPnn, "2000B", 15.34F, 30.67F, 30.67F, 49.84F);
    }

    private String deriveDPPOPlanName(String withOrWithOrthoName, String planName){
        if(containsIgnoreCase(planName, "High")
            && containsIgnoreCase(withOrWithOrthoName, "No Ortho")){

            return "High Plan (No Ortho)";
        } else if(containsIgnoreCase(planName, "High")
            && containsIgnoreCase(withOrWithOrthoName, "With Ortho")){

            return "High Plan (Child Only Ortho)";
        } else if(containsIgnoreCase(planName, "Low")
            && containsIgnoreCase(withOrWithOrthoName, "No Ortho")){

            return "Low Plan (No Ortho)";
        } else if(containsIgnoreCase(planName, "Low")
            && containsIgnoreCase(withOrWithOrthoName, "With Ortho")){

            return "Low Plan (Child Only Ortho)";
        }

        return null;
    }

    private void parseMedical(BrokerLocale locale, Sheet sheet, Map<String, ProgramToPnn> planToProgramPnn) {
        rowIterator = sheet.iterator();

        // skip headers
        while(getNextRow()) {
            if (containsIgnoreCase(column(0).value(), "Plan Designs")) {
                break;
            }
        }

        String subSectionHeading = "";
        while(getNextRow()) {
            if(isBlank(column(0).value()) && !isBlank(column(1).value())) {
                // sub section heading
                subSectionHeading = column(1).value();
            } else if(isBlank(column(0).value()) && isBlank(column(1).value())
                && !isBlank(column(2).value()) && !isBlank(column(3).value())){
                // plan information

                String planName = getCalculatedName(column(2).value());
                Float ratingBand = Float.parseFloat(column(3).value());

                String tier1Rate = column(4).value();
                String tier2Rate = column(5).value();
                String tier3Rate = column(6).value();
                String tier4Rate = column(7).value();

                ProgramToPnn programToPnn = planToProgramPnn.get(planName);
                if(programToPnn == null){
                    throw new NotFoundException("ProgramToPnn not found!").withFields(
                        field("plan_name", planName)
                    );
                }

                // handle single or dual in Plan Rate Table
                String typeValue2 = null;
                PlanRate planRate = null;
                if(containsIgnoreCase(subSectionHeading, " without dual option")){
                    // single plan
                    typeValue2 = "SINGLE";
                }else if (containsIgnoreCase(subSectionHeading, " with dual option")){
                    // dual combination plan
                    typeValue2 = "DUAL";
                }

                if(typeValue2 == null){
                    planRate = getExistingPlanRate(programToPnn.getProgramToPnnId(),
                        4, ratingBand, null,
                        null, null, null, null, null);
                } else {
                    planRate = getExistingPlanRate(programToPnn.getProgramToPnnId(),
                        4, ratingBand, null,
                        null, PlanRateType.NETWORK_COMBINATION, typeValue2, null, null);
                }

                if(isNull(planRate)) {
                    planRate = new PlanRate();
                }

                planRate.setProgramToPnnId(programToPnn.getProgramToPnnId());
                planRate.setTier1Rate(parseFloatOrDefault(tier1Rate));
                planRate.setTier2Rate(parseFloatOrDefault(tier2Rate));
                planRate.setTier3Rate(parseFloatOrDefault(tier3Rate));
                planRate.setTier4Rate(parseFloatOrDefault(tier4Rate));
                planRate.setRatingTiers(4);
                planRate.setRatingBand(ratingBand);

                if(containsIgnoreCase(subSectionHeading, " without dual option")){
                    // single plan
                    planRate.setType2(PlanRateType.NETWORK_COMBINATION);
                    planRate.setTypeValue2("SINGLE");
                }else if (containsIgnoreCase(subSectionHeading, " with dual option")){
                    // dual combination plan
                    planRate.setType2(PlanRateType.NETWORK_COMBINATION);
                    planRate.setTypeValue2("DUAL");
                }

                //save
                planRateRepository.save(planRate);
            }
        }
    }

    public String getCalculatedName(String planName) {
        return getStandardAnthemPlanName(planName);
    }

    protected static Float parseFloatOrDefault(String value) {
        return
            isBlank(value) ? 0F :
                Float.parseFloat(
                    value.trim()
                    .replace("$", "")
                    .replace(",", "")
                );
    }

    private boolean getNextRow() {
        if (rowIterator.hasNext()) {
            row = rowIterator.next();
            return true;
        }
        return false;
    }

    private AnthemTechnologyTrustPlanParser column(int index) {
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

    private AnthemTechnologyTrustPlanParser column(int startIndex, int endIndex) {
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
}
