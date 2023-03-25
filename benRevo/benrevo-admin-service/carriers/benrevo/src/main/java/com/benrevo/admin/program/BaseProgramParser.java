package com.benrevo.admin.program;

import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.StringHelper.getStandardAnthemPlanName;
import static org.apache.commons.lang3.StringUtils.isBlank;

import com.benrevo.be.modules.admin.util.PlanUtil;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.PlanRateType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.PlanRate;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.ProgramToPnn;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.ancillary.AncillaryClass;
import com.benrevo.data.persistence.entities.ancillary.LifeClass;
import com.benrevo.data.persistence.entities.ancillary.ProgramToAncillaryPlan;
import com.benrevo.data.persistence.repository.PlanRateRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.ProgramToPnnRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.ancillary.ProgramToAncillaryPlanRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.collections.CollectionUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
public class BaseProgramParser {

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private PlanRateRepository planRateRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private ProgramToPnnRepository programToPnnRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;
    
    @Autowired
    private ProgramToAncillaryPlanRepository programToAncillaryPlanRepository;

    private Iterator<Row> rowIterator;
    private Row row;
    private String lastValue = "";

    private final Pattern NOT_AVAILABLE = Pattern.compile("\\s*Not\\s+Available\\s*",Pattern.CASE_INSENSITIVE);

    public BaseProgramParser() {}


    public PlanRate getExistingPlanRate(Long programToPnnId, Integer ratingTiers,
        Float ratingBand, PlanRateType type, String typeValue, PlanRateType type2,
        String typeValue2, PlanRateType type3, String typeValue3){

        return planRateRepository.
            findByProgramToPnnIdAndRatingTiersAndRatingBandAndTypeAndTypeValueAndType2AndTypeValue2AndType3AndTypeValue3(
                programToPnnId, ratingTiers, ratingBand, type, typeValue, type2, typeValue2, type3, typeValue3);
    }
    
    @Deprecated // planYear not supported
    public Map<String,ProgramToPnn> buildPlanToProgramPnn(String carrierName, String programName, PlanCategory... products) {
        return buildPlanToProgramPnn(carrierName, programName, null, products);
    }
    
    public Map<String, ProgramToPnn> buildPlanToProgramPnn(String carrierName, String programName, Integer planYear,
        PlanCategory... products) {

        Map<String, ProgramToPnn> planToProgramPnn = new HashMap<>();
        List<ProgramToPnn> programToPnns = new ArrayList<>();

        for(PlanCategory product : products) {
            RfpCarrier rfpCarrier1 = getRfpCarrier(carrierName, product.name());
            Program program = getProgram(programName, rfpCarrier1);
            programToPnns.addAll(programToPnnRepository.findByProgramId(program.getProgramId()));
        }
        for(ProgramToPnn programToPnn : programToPnns){
        	if (planYear == null || planYear.equals(programToPnn.getPnn().getPlan().getPlanYear())) {
        		planToProgramPnn.put(programToPnn.getPnn().getName(), programToPnn);
        	}
        }
        return planToProgramPnn;
    }
    
    public Map<String, ProgramToAncillaryPlan> buildPlanByYearToProgramAncillaryPlan(
        String carrierName, String programName, PlanCategory... products) {

        Map<String, ProgramToAncillaryPlan> planProgramAncillaryPlan = new HashMap<>();

        for(PlanCategory product : products) {
            RfpCarrier rfpCarrier1 = getRfpCarrier(carrierName, product.name());
            Program program = getProgram(programName, rfpCarrier1);
            List<ProgramToAncillaryPlan> programAncillaryPlans = programToAncillaryPlanRepository.findByProgramId(program.getProgramId());
            for(ProgramToAncillaryPlan programToAncillaryPlan : programAncillaryPlans) {
                String key = programToAncillaryPlan.getAncillaryPlan().getPlanName() 
                    + "_" + programToAncillaryPlan.getAncillaryPlan().getPlanYear();
                planProgramAncillaryPlan.put(key, programToAncillaryPlan);
            }
        }
        return planProgramAncillaryPlan;
    }

    public Program getProgram(String programName, RfpCarrier rfpCarrier) {
        Program program = programRepository.findByRfpCarrierAndName(rfpCarrier, programName);
        if(program == null) {
            throw new BaseException("No Program found!").withFields(
                field("rfpCarrier_id", rfpCarrier.getRfpCarrierId()),
                field("program_name", programName)
            );
        }
        return program;
    }

    public RfpCarrier getRfpCarrier(String carrierName, String category) {
        RfpCarrier rfpCarrier = rfpCarrierRepository
            .findByCarrierNameAndCategory(carrierName, category);
        if(rfpCarrier == null) {
            throw new BaseException("No rfPCarrier found!").withFields(
                field("carrier_name", carrierName),
                field("category", category)
                );
        }
        return rfpCarrier;
    }

    public String getCalculatedName(String planName) {
        return getStandardAnthemPlanName(planName) + "|";
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

    private BaseProgramParser column(int index) {
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

    private BaseProgramParser column(int startIndex, int endIndex) {
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
