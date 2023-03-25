package com.benrevo.admin.program;

import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.StringHelper.getStandardAnthemPlanName;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static com.benrevo.common.enums.PlanCategory.*;

import com.benrevo.be.modules.admin.util.PlanUtil;
import com.benrevo.be.modules.admin.util.helper.PlanHistoryHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.PlanRateType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.PlanRate;
import com.benrevo.data.persistence.entities.ProgramToPnn;
import com.benrevo.data.persistence.repository.PlanRateRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.monitorjbl.xlsx.StreamingReader;
import java.io.InputStream;
import java.util.Iterator;
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

@Component
@Transactional
public class VSPBeyondBenefitPlanParser extends BaseProgramParser {

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private PlanHistoryHelper planHistoryHelper;

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

    public VSPBeyondBenefitPlanParser() {}

    public void parseFile(InputStream is) throws Exception {

        Workbook myWorkBook = null;
        Map<String, ProgramToPnn> planToProgramPnn = buildPlanToProgramPnn(
            CarrierType.VSP.name(), Constants.BEYOND_BENEFITS_TRUST_PROGRAM,
            VISION);

        try {
            myWorkBook = StreamingReader.builder()
                .rowCacheSize(100)
                .bufferSize(4096)
                .open(is);


            if(myWorkBook.getSheetIndex("Vision Rates") != -1){
                parseVision(myWorkBook.getSheet("Vision Rates"), planToProgramPnn);
            }else{
                throw new BaseException("Plan Design is missing Vision Rates sheet. Wrong sheet name?");
            }
        } finally {
            if(myWorkBook != null) {
                myWorkBook.close();
            }
        }
    }

    private void parseVision(Sheet sheet, Map<String, ProgramToPnn> planToProgramPnn) {
        rowIterator = sheet.iterator();

        // skip headers
        while(getNextRow()) {
            if (containsIgnoreCase(column(1).value(), "Product and Band")) {
                break;
            }
        }

        while(getNextRow()) {
            if(isBlank(column(0).value())) {
                break;
            }

            String planName = getCalculatedName(column(0).value());

            String tier1Rate = column(1).value();
            String tier2Rate = column(2).value();
            String tier3Rate = column(3).value();
            String tier4Rate = column(4).value();

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
            planRate.setTier1Rate(parseFloatOrDefault(tier1Rate));
            planRate.setTier2Rate(parseFloatOrDefault(tier2Rate));
            planRate.setTier3Rate(parseFloatOrDefault(tier3Rate));
            planRate.setTier4Rate(parseFloatOrDefault(tier4Rate));
            planRate.setRatingTiers(4);

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

    private VSPBeyondBenefitPlanParser column(int index) {
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

    private VSPBeyondBenefitPlanParser column(int startIndex, int endIndex) {
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
