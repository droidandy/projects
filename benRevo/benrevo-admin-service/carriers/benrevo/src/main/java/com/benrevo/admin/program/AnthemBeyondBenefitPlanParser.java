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
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RiderMetaRepository;
import com.monitorjbl.xlsx.StreamingReader;
import java.io.InputStream;
import java.util.HashMap;
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
public class AnthemBeyondBenefitPlanParser extends BaseProgramParser{

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private PlanRateRepository planRateRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    private Iterator<Row> rowIterator;
    private Row row;
    private String lastValue = "";

    private final Pattern NOT_AVAILABLE = Pattern.compile("\\s*Not\\s+Available\\s*",Pattern.CASE_INSENSITIVE);

    public AnthemBeyondBenefitPlanParser() {}

    public void parseFile(BrokerLocale locale, InputStream is) throws Exception {

        Workbook myWorkBook = null;
        Map<String, ProgramToPnn> planToProgramPnn = buildPlanToProgramPnn(
            CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.BEYOND_BENEFITS_TRUST_PROGRAM,
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

            if(myWorkBook.getSheetIndex("Vision Rates") != -1){
                parseVision(locale, myWorkBook.getSheet("Vision Rates"), planToProgramPnn);
            }else{
                throw new BaseException("Plan Design is missing Vision Rates sheet. Wrong sheet name?");
            }
        } finally {
            if(myWorkBook != null) {
                myWorkBook.close();
            }
        }
    }

    private void parseVision(BrokerLocale locale, Sheet sheet, Map<String, ProgramToPnn> planToProgramPnn) {
        rowIterator = sheet.iterator();

        // group size 51-249
        HashMap<String, PlanRate> planRateHashMap = new HashMap<>();
        String highKey = "";
        String medKey = "";
        String lowKey = "";

        // group size 250-499
        HashMap<String, PlanRate> planRateHashMap2 = new HashMap<>();
        String highKey2 = "";
        String medKey2 = "";
        String lowKey2 = "";

        while (getNextRow()) {
            if(containsIgnoreCase(column(0).value(), "-TIER")){
                // create 2 PlanRates
                String tierDash = column(0).value().split("TIER")[0];

                highKey = tierDash + column(1).value();
                medKey = tierDash + column(2).value();
                lowKey = tierDash + column(3).value();

                highKey2 = tierDash + column(6).value();
                medKey2 = tierDash + column(7).value();
                lowKey2 = tierDash + column(8).value();

                for(String key : new String[] {highKey, medKey, lowKey}) {
                    String planName = key.split("-")[1];
                    int ratingTiers = Integer.parseInt(key.split("-")[0]);
                    ProgramToPnn programToPnn = planToProgramPnn.get(getCalculatedName(planName));
                    if(programToPnn == null){
                        throw new NotFoundException("ProgramToPnn not found!").withFields(
                            field("plan_name", planName)
                        );
                    }

                    PlanRate pr = getExistingPlanRate(programToPnn.getProgramToPnnId(),
                        ratingTiers, null, PlanRateType.GROUP_SIZE, "51-249",
                        PlanRateType.COUNTY, locale.name(),  null, null);
                    if(isNull(pr)) {
                        pr = new PlanRate();
                    }
                    pr.setType2(PlanRateType.COUNTY);
                    pr.setTypeValue2(locale.name());
                    planRateHashMap.put(key, pr);
                }
                for(String key : new String[] {highKey2, medKey2, lowKey2}) {
                    String planName = key.split("-")[1];
                    int ratingTiers = Integer.parseInt(key.split("-")[0]);
                    ProgramToPnn programToPnn = planToProgramPnn.get(getCalculatedName(planName));
                    if(programToPnn == null){
                        throw new NotFoundException("ProgramToPnn not found!").withFields(
                            field("plan_name", planName)
                        );
                    }

                    PlanRate pr = getExistingPlanRate(programToPnn.getProgramToPnnId(),
                        ratingTiers, null, PlanRateType.GROUP_SIZE, "250-499",
                        PlanRateType.COUNTY, locale.name(),  null, null);
                    if(isNull(pr)) {
                        pr = new PlanRate();
                    }

                    pr.setType2(PlanRateType.COUNTY);
                    pr.setTypeValue2(locale.name());
                    planRateHashMap2.put(key, pr);
                }
            } else if(containsIgnoreCase(column(0).value(), "employee") && !isBlank(column(1).value())){
                setVisionRates(planToProgramPnn,"51-249", planRateHashMap, highKey, medKey, lowKey, 1, 2, 3);

                setVisionRates(planToProgramPnn,"250-499", planRateHashMap2, highKey2, medKey2, lowKey2, 6, 7, 8);
            }
        }
    }

    private void setVisionRates(Map<String, ProgramToPnn> planToProgramPnn, String typeValue,
        HashMap<String, PlanRate> planRateHashMap, String highKey,
        String medKey, String lowKey, int index1, int index2, int index3) {

        // input rates
        String highRate = column(index1).value();
        String medRate = column(index2).value();
        String lowRate = column(index3).value();

        String highPlanName = highKey.split("-")[1];
        ProgramToPnn programToPnn = planToProgramPnn.get(getCalculatedName(highPlanName));
        if(programToPnn == null){
            throw new NotFoundException("ProgramToPnn not found!").withFields(
                field("plan_name", highPlanName)
            );
        }

        PlanRate r1 = planRateHashMap.get(highKey);
        r1.setType(PlanRateType.GROUP_SIZE);
        r1.setTypeValue(typeValue);
        setRate(r1, parseFloatOrDefault(highRate));

        r1.setProgramToPnnId(programToPnn.getProgramToPnnId());
        planRateRepository.save(r1);

        PlanRate r2 = planRateHashMap.get(medKey);
        r2.setType(PlanRateType.GROUP_SIZE);
        r2.setTypeValue(typeValue);
        setRate(r2, parseFloatOrDefault(medRate));

        String medPlanName = medKey.split("-")[1];
        programToPnn = planToProgramPnn.get(getCalculatedName(medPlanName));
        if(programToPnn == null){
            throw new NotFoundException("ProgramToPnn not found!").withFields(
                field("plan_name", medPlanName)
            );
        }
        r2.setProgramToPnnId(programToPnn.getProgramToPnnId());
        planRateRepository.save(r2);

        PlanRate r3 = planRateHashMap.get(lowKey);
        r3.setType(PlanRateType.GROUP_SIZE);
        r3.setTypeValue(typeValue);
        setRate(r3, parseFloatOrDefault(lowRate));

        String lowPlanName = lowKey.split("-")[1];
        programToPnn = planToProgramPnn.get(getCalculatedName(lowPlanName));
        if(programToPnn == null){
            throw new NotFoundException("ProgramToPnn not found!").withFields(
                field("plan_name", highPlanName)
            );
        }
        r3.setProgramToPnnId(programToPnn.getProgramToPnnId());
        planRateRepository.save(r3);
    }

    private void setRate(PlanRate planRate, Float rate){
        if(planRate.getTier1Rate() == null){
            planRate.setRatingTiers(1);
            planRate.setTier1Rate(rate);
        } else if(planRate.getTier2Rate() == null){
            planRate.setRatingTiers(2);
            planRate.setTier2Rate(rate);
        } else if(planRate.getTier3Rate() == null){
            planRate.setRatingTiers(3);
            planRate.setTier3Rate(rate);
        } else if(planRate.getTier4Rate() == null){
            planRate.setRatingTiers(3);
            planRate.setTier4Rate(rate);
        }
    }

    private void parseDental(BrokerLocale locale, Sheet sheet, Map<String, ProgramToPnn> planToProgramPnn) {
        rowIterator = sheet.iterator();

        // skip headers
        while(getNextRow()) {
            if (containsIgnoreCase(column(0).value(), "Rate Band")) {
                break;
            }
        }

        String ratingBand1 = "";
        String ratingBand2 = "";
        while(getNextRow()) {
            if (isBlank(column(0).value()) && isBlank(column(1).value())) {
                break;
            }

            // no orthondia coverage
            String planName = getCalculatedName(column(1).value());
            String ratingBand1Str = column(0).value();

            if(!isBlank(ratingBand1Str)){
                ratingBand1 = ratingBand1Str;
            }

            Float ratingBand = Float.parseFloat(ratingBand1);

            String tier1Rate = column(2).value();
            String tier2Rate = column(3).value();
            String tier3Rate = column(4).value();
            String tier4Rate = column(5).value();

            ProgramToPnn programToPnn = planToProgramPnn.get(planName);
            if(programToPnn == null){
                throw new NotFoundException("ProgramToPnn not found!").withFields(
                    field("plan_name", planName)
                );
            }

            PlanRate planRate = getExistingPlanRate(programToPnn.getProgramToPnnId(),
                4, ratingBand, PlanRateType.COUNTY,
                locale.name(), null, null, null, null);
            if(isNull(planRate)) {
                planRate = new PlanRate();
            }

            planRate.setProgramToPnnId(programToPnn.getProgramToPnnId());
            planRate.setTier1Rate(parseFloatOrDefault(tier1Rate));
            planRate.setTier2Rate(parseFloatOrDefault(tier2Rate));
            planRate.setTier3Rate(parseFloatOrDefault(tier3Rate));
            planRate.setTier4Rate(parseFloatOrDefault(tier4Rate));
            planRate.setType(PlanRateType.COUNTY);
            planRate.setTypeValue(locale.name());
            planRate.setRatingBand(ratingBand);
            planRate.setRatingTiers(4);
            planRateRepository.save(planRate);

            // no orthondia coverage
            String planNameWithOrtho = getCalculatedName(column(8).value());
            String ratingBand2Str = column(7).value();
            if(!isBlank(ratingBand2Str)){
                ratingBand2 = ratingBand2Str;
            }
            Float ratingBand2Float = Float.parseFloat(ratingBand2);

            String tier1Rate2 = column(9).value();
            String tier2Rate2 = column(10).value();
            String tier3Rate2 = column(11).value();
            String tier4Rate2 = column(12).value();

            programToPnn = planToProgramPnn.get(planNameWithOrtho);
            if(programToPnn == null){
                throw new NotFoundException("ProgramToPnn not found!").withFields(
                    field("plan_name", planNameWithOrtho)
                );
            }

            PlanRate planRateWithOrtho = getExistingPlanRate(programToPnn.getProgramToPnnId(),
                4, ratingBand2Float, PlanRateType.COUNTY,
                locale.name(), null, null, null, null);

            if(isNull(planRateWithOrtho)) {
                planRateWithOrtho = new PlanRate();
            }

            planRateWithOrtho.setProgramToPnnId(programToPnn.getProgramToPnnId());
            planRateWithOrtho.setTier1Rate(parseFloatOrDefault(tier1Rate2));
            planRateWithOrtho.setTier2Rate(parseFloatOrDefault(tier2Rate2));
            planRateWithOrtho.setTier3Rate(parseFloatOrDefault(tier3Rate2));
            planRateWithOrtho.setTier4Rate(parseFloatOrDefault(tier4Rate2));
            planRateWithOrtho.setType(PlanRateType.COUNTY);
            planRateWithOrtho.setTypeValue(locale.name());
            planRateWithOrtho.setRatingTiers(4);
            planRateWithOrtho.setRatingBand(ratingBand2Float);
            planRateRepository.save(planRateWithOrtho);

        }
    }

    private void parseMedical(BrokerLocale locale, Sheet sheet, Map<String, ProgramToPnn> planToProgramPnn) {
        rowIterator = sheet.iterator();

        // skip headers
        while(getNextRow()) {
            if (containsIgnoreCase(column(1).value(), "Rating Band")) {
                break;
            }
        }

        while(getNextRow()) {
            if(isBlank(column(0).value())) {
                break;
            }

            String planName = getCalculatedName(column(0).value());
            Float ratingBand = Float.parseFloat(column(1).value());

            String tier1Rate = column(2).value();
            String tier2Rate = column(3).value();
            String tier3Rate = column(4).value();
            String tier4Rate = column(5).value();

            ProgramToPnn programToPnn = planToProgramPnn.get(planName);
            if(programToPnn == null){
                throw new NotFoundException("ProgramToPnn not found!").withFields(
                    field("plan_name", planName)
                );
            }

            PlanRate planRate = getExistingPlanRate(programToPnn.getProgramToPnnId(),
                4, ratingBand, PlanRateType.COUNTY,
                locale.name(), null, null, null, null);
            if(isNull(planRate)) {
                planRate = new PlanRate();
            }
            planRate.setProgramToPnnId(programToPnn.getProgramToPnnId());
            planRate.setTier1Rate(parseFloatOrDefault(tier1Rate));
            planRate.setTier2Rate(parseFloatOrDefault(tier2Rate));
            planRate.setTier3Rate(parseFloatOrDefault(tier3Rate));
            planRate.setTier4Rate(parseFloatOrDefault(tier4Rate));
            planRate.setType(PlanRateType.COUNTY);
            planRate.setTypeValue(locale.name());
            planRate.setRatingTiers(4);
            planRate.setRatingBand(ratingBand);

            //save
            planRateRepository.save(planRate);
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

    private AnthemBeyondBenefitPlanParser column(int index) {
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

    private AnthemBeyondBenefitPlanParser column(int startIndex, int endIndex) {
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
