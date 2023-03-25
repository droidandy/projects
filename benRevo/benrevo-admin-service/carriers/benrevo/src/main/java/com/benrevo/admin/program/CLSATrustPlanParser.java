package com.benrevo.admin.program;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.common.Constants.RX_HMO;
import static com.benrevo.common.Constants.RX_PPO;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.StringHelper.getStandardAnthemPlanName;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.benrevo.be.modules.admin.util.helper.PlanHistoryHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.PlanRateType;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.PlanRate;
import com.benrevo.data.persistence.entities.ProgramToPnn;
import com.benrevo.data.persistence.entities.ancillary.AncillaryRate;
import com.benrevo.data.persistence.entities.ancillary.AncillaryRateAge;
import com.benrevo.data.persistence.entities.ancillary.BasicRate;
import com.benrevo.data.persistence.entities.ancillary.ProgramToAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.repository.PlanRateRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.ProgramToPnnRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryRateRepository;
import com.benrevo.data.persistence.repository.ancillary.ProgramToAncillaryPlanRepository;
import com.monitorjbl.xlsx.StreamingReader;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.util.CellReference;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
public class CLSATrustPlanParser extends BaseProgramParser {

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private PlanHistoryHelper planHistoryHelper;

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
    
    @Autowired
    private AncillaryRateRepository ancillaryRateRepository;
    
    private Iterator<Row> rowIterator;
    private Row row;
    private Iterator<Cell> cellIterator;
    private Cell cell;
    private String lastValue = "";
    private String lastCellValue = "";

    private final Pattern NOT_AVAILABLE = Pattern.compile("\\s*Not\\s+Available\\s*",Pattern.CASE_INSENSITIVE);
    private final String METLIFE_DHMO_ZERO_RATE_PLAN_NAME = "No CLSA Plan";

    public CLSATrustPlanParser() {}

    /**
     * NOTE: The rate files contain planYear but we use the planYear param passed in when saving all category PlanRates!
     * @param is
     * @param planYear
     * @throws Exception
     */
    public void parseFile(InputStream is, int planYear) throws Exception {

        Workbook myWorkBook = null;

        try {
            myWorkBook = StreamingReader.builder()
                .rowCacheSize(100)
                .bufferSize(4096)
                .open(is);

            // Walk through all the sheets
            for (int sheetIndex = 0; sheetIndex < myWorkBook.getNumberOfSheets(); sheetIndex++) {
                if (myWorkBook.isSheetHidden(sheetIndex)) {
                    continue; // skip hidden sheet 
                }
                Sheet mySheet = myWorkBook.getSheetAt(sheetIndex);
                String tabName = mySheet.getSheetName().trim().toUpperCase();
                switch(tabName) {
                    case MEDICAL:
                    case RX_HMO:
                    case RX_PPO:
                        parseMedical(mySheet, planYear);
                        break;
                    case DENTAL:
                        parseDentalAndVision(mySheet, planYear, true,false);
                        break;
                    case VISION:
                        parseDentalAndVision(mySheet, planYear, false, true);
                        break;
                    case "LD RATES":
                        parseLifeAndDisability(mySheet, planYear);
                        break;
                    case "CIGNA VOLUNTARY":
                        parseVoluntaryLife(mySheet, planYear);
                        break;
                }
            }
        } finally {
            if(myWorkBook != null) {
                myWorkBook.close();
            }
        }
    }
    
    private void parseVoluntaryLife(Sheet sheet, int planYear) {
        Map<String, ProgramToAncillaryPlan> planToProgramAncillaryPlan = buildPlanByYearToProgramAncillaryPlan(
            CarrierType.CIGNA.name(), Constants.CLSA_TRUST_PROGRAM, PlanCategory.VOL_LIFE);
    
        rowIterator = sheet.iterator();

        Map<Integer, VoluntaryRate> planCulumnIndexToRate = new HashMap<>();
        while(getNextRow()) {
            if (column(0).value().equalsIgnoreCase("Age")) {
                break;
            }
            cellIterator = row.cellIterator();
            while(getNextCell()) {
                String planName = column(cell).cellValue();
                if(isNotBlank(planName)) {
                    String key = planName + "_" + planYear;
                    ProgramToAncillaryPlan programToAncillaryPlan = planToProgramAncillaryPlan.get(key);
                    if(programToAncillaryPlan == null) {
                        throw new NotFoundException("ProgramToAncillaryPlan not found!").withFields(
                            field("plan_name", planName), field("plan_year", planYear)
                        );
                    }
                    VoluntaryRate planRate = (VoluntaryRate) programToAncillaryPlan.getAncillaryPlan().getRates();
                    if(isNull(planRate)) {
                        planRate = new VoluntaryRate(); 
                        planRate.setVolume(0f); // default value (entered by user in Current option edit)
                        planRate.setAncillaryPlan(programToAncillaryPlan.getAncillaryPlan());
                        planRate.setAges(new ArrayList<>());
                    }
                    planCulumnIndexToRate.put(cell.getColumnIndex(), planRate);
                } 
            } 
        }
        final int AGE_COLUMN = 0;
        while(getNextRow() || row.getRowNum() < 40) {
            cellIterator = row.cellIterator();
            while(getNextCell()) {
                VoluntaryRate planRate = planCulumnIndexToRate.get(cell.getColumnIndex());
                if(planRate == null) {
                    continue;
                }
                String age = column(AGE_COLUMN).value();
                if(isEmpty(age)) {
                	continue;
                }
                String rateValue = column(cell).cellValue();
                if (age.startsWith("EE & SP")) { // EE & SP \n AD&D
                	planRate.setEmployee(true);
                	planRate.setRateEmpADD(parseFloatOrDefault(rateValue));
                	planRate.setSpouse(true);
                	planRate.setRateSpouseADD(parseFloatOrDefault(rateValue));
                } else if (age.equalsIgnoreCase("CH Life")) {
                	planRate.setRateChildLife(parseFloatOrDefault(rateValue));
                } else if (age.equalsIgnoreCase("CH AD&D")) {
                	planRate.setRateChildADD(parseFloatOrDefault(rateValue));
                } else {
	                Integer from = 0, to = 100;
	                if(age.contains("less")) { // less than 25
	                    from = 0; 
	                    String[] parts = age.split(" ");
	                    to = Integer.parseUnsignedInt(parts[parts.length - 1]) - 1; // 0 - 24
	                } else if(age.contains("more")){ // more than 90
	                    to = 100;
	                    String[] parts = age.split(" ");
	                    from = Integer.parseUnsignedInt(parts[parts.length - 1]) + 1; // 91 - 100
	                } else { // 55-59 or 60-64
	                    String[] parts = age.split("-");
	                    from = Integer.parseUnsignedInt(parts[0]);
	                    to = Integer.parseUnsignedInt(parts[parts.length - 1]); 
	                }
	                AncillaryRateAge rateAge = new AncillaryRateAge();
	                rateAge.setAncillaryRate(planRate);
	                rateAge.setFrom(from);
	                rateAge.setTo(to);
	                rateAge.setCurrentEmp(parseFloatOrDefault(rateValue));
	                planRate.getAges().add(rateAge);
                }
                ancillaryRateRepository.save(planRate);      
            }
        }
    }
    
    private void parseLifeAndDisability(Sheet sheet, int planYear) {
        Map<String, ProgramToAncillaryPlan> planToProgramAncillaryPlan = buildPlanByYearToProgramAncillaryPlan(
                CarrierType.CIGNA.name(), Constants.CLSA_TRUST_PROGRAM, 
                PlanCategory.LIFE, PlanCategory.STD, PlanCategory.LTD);
        
        rowIterator = sheet.iterator();

        // skip headers
        while(getNextRow()) {
            if (containsIgnoreCase(column(0).value(), "Year")) {
                break;
            }
        }

        while(getNextRow()) {
            if (isBlank(column(0).value())) {
                break;
            }

            String rateYear = String.valueOf(planYear); //column(0).value();
            String planType = column(1).value();
            String planName = column(2).value();
            String rateValue = column(4).value();
            
            String key = planName + "_" + rateYear;
            ProgramToAncillaryPlan programToAncillaryPlan = planToProgramAncillaryPlan.get(key);
            if (programToAncillaryPlan == null) {
                throw new NotFoundException("ProgramToAncillaryPlan not found!").withFields(
                    field("plan_name", planName), field("plan_year", rateYear)
                );
            }
            BasicRate planRate = (BasicRate) programToAncillaryPlan.getAncillaryPlan().getRates();
            if(isNull(planRate)) {
                planRate = new BasicRate(); 
                planRate.setVolume(0f); // default value (entered by user in Current option edit)
                planRate.setAncillaryPlan(programToAncillaryPlan.getAncillaryPlan());
            }
            if(planType.equalsIgnoreCase("Basic Life")) {
                planRate.setCurrentLife(parseFloatOrDefault(rateValue));
            } else if(planType.equalsIgnoreCase("Basic AD&D")) {
                planRate.setCurrentADD(parseFloatOrDefault(rateValue));
            } else if(planType.equals("STD") || planType.equals("LTD")) {
                planRate.setCurrentSL(parseFloatOrDefault(rateValue));
            }

            ancillaryRateRepository.save(planRate);
        }
    }
    
    private void parseMedical(Sheet sheet, int planYear) {
        Map<String, ProgramToPnn> planToProgramPnn = buildPlanToProgramPnn(
                CarrierType.UHC.name(), Constants.CLSA_TRUST_PROGRAM,
                planYear, PlanCategory.MEDICAL);

        rowIterator = sheet.iterator();
        HashMap<String, HashMap<String, PlanRate>> data = new HashMap<>();
        HashMap<String, PlanRate> basePlanRateColumns = new HashMap<>();

        // skip headers
        while(getNextRow()) {
            if (containsIgnoreCase(column(0).value(), "Rate Year")) {
                boolean tierColumnFound = false;
                cellIterator = row.cellIterator();
                while(getNextCell()){
                    if(containsIgnoreCase(column(cell).cellValue(), "Tier")){
                        tierColumnFound = true;
                        getNextCell();
                    }

                    if(tierColumnFound){
                        String columnLetter = CellReference.convertNumToColString(cell.getColumnIndex());
                        String planName = column(cell).cellValue();

                        if(!isEmpty(planName)) {
                            ProgramToPnn programToPnn = planToProgramPnn.get(planName);
                            if (programToPnn == null) {
                                throw new NotFoundException("ProgramToPnn not found!").withFields(
                                    field("plan_name", planName)
                                );
                            }

                            PlanRate planRate = new PlanRate();
                            planRate.setProgramToPnnId(programToPnn.getProgramToPnnId());
                            planRate.setRatingTiers(4);
                            basePlanRateColumns.put(columnLetter, planRate);
                        }
                    }
                }
                break;
            }
        }

        String key = "";
        HashMap<String, PlanRate> planRateColumns = new HashMap<>();
        while(getNextRow()) {
            if (isBlank(column(0).value())) {
                break;
            }

            String rateYear = String.valueOf(planYear);
            String region = column(1).value();
            if(region.equals("NCAL")) {
                region = BrokerLocale.NORTH.name();
            } else if(region.equals("SCAL")) {
                region = BrokerLocale.SOUTH.name();
            } else {
                throw new IllegalArgumentException("Cannot parse Region: " + region);
            }
            String ageGroup = column(2).value();
            if(!ageGroup.matches("Group [ABCD]")) {
                throw new IllegalArgumentException("Cannot parse Group: " + ageGroup);
            }
            ageGroup = String.valueOf(ageGroup.charAt(6));
            
            String newKey = rateYear + "_" + region + "_" + ageGroup;
            if(!newKey.equals(key)){
                // copy the column plan rates

                key = newKey;
                HashMap<String, PlanRate> temp = new HashMap<>();
                basePlanRateColumns.keySet().forEach(k -> temp.put(k, basePlanRateColumns.get(k).copy()));
                planRateColumns = temp;
                data.put(newKey, planRateColumns);
            }

            cellIterator = row.cellIterator();
            while(getNextCell()){
                String columnLetter = CellReference.convertNumToColString(cell.getColumnIndex());
                if(planRateColumns.containsKey(columnLetter)){

                    PlanRate newPlanRate = planRateColumns.get(columnLetter);
                    PlanRate existingPlanRate = getExistingPlanRate(newPlanRate.getProgramToPnnId(),
                        4, null, PlanRateType.COUNTY, region,
                        PlanRateType.RATE_YEAR, rateYear, PlanRateType.AGE_GROUP, ageGroup);

                    if(!isNull(existingPlanRate)) { // do a merge and reset rates
                        existingPlanRate.setRatingTiers(newPlanRate.getRatingTiers());
                        if(isAllRateNotNull(existingPlanRate)) {
                            existingPlanRate.setTier1Rate(null);
                            existingPlanRate.setTier2Rate(null);
                            existingPlanRate.setTier3Rate(null);
                            existingPlanRate.setTier4Rate(null);
                        }
                        newPlanRate = existingPlanRate;
                        planRateColumns.put(columnLetter, newPlanRate);
                    }

                    setMedicalPlanRateDetails(planRateColumns.get(columnLetter),
                        column(cell).cellValue(), rateYear, region, ageGroup);
                }
            }
        }

        List<PlanRate> planRateList = data.values().stream().flatMap(x -> x.values().stream()).collect(Collectors.toList());
        planRateList.removeIf(p -> isAllRateNull(p) || isAllRateZero(p));
        planRateRepository.save(planRateList);
    }

    private boolean isAllRateZero(PlanRate p) {
        return p.getTier1Rate() == 0F && p.getTier2Rate() == 0F && p.getTier3Rate() == 0F && p.getTier4Rate() == 0F;
    }

    private boolean isAllRateNull(PlanRate p) {
        return p.getTier1Rate() == null && p.getTier2Rate() == null && p.getTier3Rate() == null && p.getTier4Rate() == null;
    }

    private boolean isAllRateNotNull(PlanRate p) {
        return p.getTier1Rate() != null && p.getTier2Rate() != null && p.getTier3Rate() != null && p.getTier4Rate() != null;
    }

    private void parseDentalAndVision(Sheet sheet, int planYear, boolean withDental, boolean withVision) {

        Map<String, ProgramToPnn> planToProgramPnn = null;
        if(withDental) {
            planToProgramPnn = buildPlanToProgramPnn(
                CarrierType.METLIFE.name(), Constants.CLSA_TRUST_PROGRAM,
                planYear, PlanCategory.DENTAL);
        } else if(withVision) {
            planToProgramPnn = buildPlanToProgramPnn(
                CarrierType.METLIFE.name(), Constants.CLSA_TRUST_PROGRAM,
                planYear, PlanCategory.VISION);
        }

        rowIterator = sheet.iterator();
        HashMap<String, HashMap<String, PlanRate>> data = new HashMap<>();
        HashMap<String, PlanRate> basePlanRateColumns = new HashMap<>();

        // skip headers
        while(getNextRow()) {
            if (containsIgnoreCase(column(0).value(), "Region")) {
                boolean tierColumnFound = false;
                cellIterator = row.cellIterator();
                while(getNextCell()){
                    if(containsIgnoreCase(column(cell).cellValue(), "Tier")){
                        tierColumnFound = true;
                        getNextCell();
                    }

                    if(tierColumnFound){
                        String columnLetter = CellReference.convertNumToColString(cell.getColumnIndex());
                        String planName = column(cell).cellValue();

                        if(!isEmpty(planName)) {
                            ProgramToPnn programToPnn = planToProgramPnn.get(planName);
                            if (programToPnn == null) {
                                throw new NotFoundException("ProgramToPnn not found!").withFields(
                                    field("plan_name", planName)
                                );
                            }

                            PlanRate planRate = new PlanRate();
                            planRate.setProgramToPnnId(programToPnn.getProgramToPnnId());
                            planRate.setRatingTiers(4);
                            basePlanRateColumns.put(columnLetter, planRate);
                        }
                    }
                }
                break;
            }
        }

        String key = "";
        HashMap<String, PlanRate> planRateColumns = new HashMap<>();
        while(getNextRow()) {
            if (isBlank(column(0).value())) {
                break;
            }

            String newKey = column(0).value() + "_" + column(1).value() + "_" + String.valueOf(planYear);
            if(!newKey.equals(key)){
                // copy the column plan rates

                key = newKey;
                HashMap<String, PlanRate> temp = new HashMap<>();
                basePlanRateColumns.keySet().forEach(k -> temp.put(k, basePlanRateColumns.get(k).copy()));
                planRateColumns = temp;
                data.put(newKey, planRateColumns);
            }

            cellIterator = row.cellIterator();
            while(getNextCell()){
                String columnLetter = CellReference.convertNumToColString(cell.getColumnIndex());
                if(planRateColumns.containsKey(columnLetter)){

                    PlanRate newPlanRate = planRateColumns.get(columnLetter);
                    PlanRate existingPlanRate = getExistingPlanRate(newPlanRate.getProgramToPnnId(),
                        4, null, PlanRateType.COUNTY, column(0).value(),
                        PlanRateType.GROUP_SIZE, column(1).value().trim(), PlanRateType.RATE_YEAR, String.valueOf(planYear));

                    if(!isNull(existingPlanRate)) { // do a merge and reset rates
                        existingPlanRate.setRatingTiers(newPlanRate.getRatingTiers());
                        if(isAllRateNotNull(existingPlanRate)) {
                            existingPlanRate.setTier1Rate(null);
                            existingPlanRate.setTier2Rate(null);
                            existingPlanRate.setTier3Rate(null);
                            existingPlanRate.setTier4Rate(null);
                        }
                        newPlanRate = existingPlanRate;
                        planRateColumns.put(columnLetter, newPlanRate);
                    }

                    setDentalAndVisionPlanRateDetails(planRateColumns.get(columnLetter),
                        column(cell).cellValue(), column(0).value(), column(1).value(), String.valueOf(planYear));
                }
            }
        }

        List<PlanRate> planRateList = data.values().stream().flatMap(x -> x.values().stream()).collect(Collectors.toList());
        planRateList.removeIf(p -> {
            ProgramToPnn programToPnn = programToPnnRepository.findOne(p.getProgramToPnnId());
            return isAllRateNull(p) || (isAllRateZero(p) && !programToPnn.getPnn().getName().equals(METLIFE_DHMO_ZERO_RATE_PLAN_NAME));
        });
        planRateRepository.save(planRateList);
    }
    
    private void setMedicalPlanRateDetails(PlanRate planRate, String rateVal, String rateYear, String region, String ageGroup) {
        setPlanRateDetails(planRate, rateVal, PlanRateType.COUNTY, region,
            PlanRateType.RATE_YEAR, rateYear, PlanRateType.AGE_GROUP, ageGroup);
    }
    
    private void setDentalAndVisionPlanRateDetails(PlanRate planRate, String rateVal, String region, String numEE, String rateYear){
        setPlanRateDetails(planRate, rateVal, PlanRateType.COUNTY, region,
            PlanRateType.GROUP_SIZE, numEE.trim(), PlanRateType.RATE_YEAR, rateYear);
        
    }
    
    private void setPlanRateDetails(PlanRate planRate, String rateVal, PlanRateType type, String typeValue, 
            PlanRateType type2, String typeValue2, PlanRateType type3, String typeValue3) {
        if(isEmpty(rateVal) || rateVal.equalsIgnoreCase("N/A")){
            rateVal = "";
        }

        if (isNull(planRate.getTier1Rate())) {
            planRate.setTier1Rate(parseFloatOrDefault(rateVal));
        } else if (isNull(planRate.getTier2Rate())) {
            planRate.setTier2Rate(parseFloatOrDefault(rateVal));
        } else if (isNull(planRate.getTier3Rate())) {
            planRate.setTier3Rate(parseFloatOrDefault(rateVal));
        } else if (isNull(planRate.getTier4Rate())) {
            planRate.setTier4Rate(parseFloatOrDefault(rateVal));
        }

        planRate.setType(type);
        planRate.setTypeValue(typeValue);

        planRate.setType2(type2);
        planRate.setTypeValue2(typeValue2);
        
        planRate.setType3(type3);
        planRate.setTypeValue3(typeValue3);
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

    private boolean getNextCell() {
        if (cellIterator.hasNext()) {
            cell = cellIterator.next();
            return true;
        }
        return false;
    }

    private CLSATrustPlanParser column(int index) {
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

    private CLSATrustPlanParser column(Cell cell) {
        if(cell == null) {
            lastCellValue = "";
        } else {
            lastCellValue = cell.getStringCellValue().replace("\"", "");
            if (NOT_AVAILABLE.matcher(lastCellValue).matches()) {
                lastCellValue = "N/A";
            };
        }
        return this;
    }

    private CLSATrustPlanParser column(int startIndex, int endIndex) {
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

    private String cellValue() {
        return lastCellValue;
    }
}
