package com.benrevo.common.anthem;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.AnthemCVDentalRates;
import com.benrevo.common.dto.AnthemCVPlan;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.util.DateHelper;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Calendar.MONTH;
import static org.apache.commons.lang3.tuple.Pair.of;

@Component
public class AnthemClearValueCalculator implements InitializingBean {
    
    @Autowired
    private CustomLogger logger;

    private String medicalPlansRes = "anthem/medical/anthem_plans";
    private String medicalAreaRes = "anthem/medical/area_network_factor";
    private String medicalDemoRes = "anthem/medical/demo_factor";
    private String medicalSicRes = "anthem/medical/sic_factor";
    
    // pre 6/1/2018
    private String dentalRatesRes2Pre612018 = "anthem/dental/effective_date_pre_6_1_2018/base_rates_2tiers";
    private String dentalRatesRes3Pre612018 = "anthem/dental/effective_date_pre_6_1_2018/base_rates_3tiers";
    private String dentalRatesRes4Pre612018 = "anthem/dental/effective_date_pre_6_1_2018/base_rates_4tiers";
    private String dentalAreaResPre612018 = "anthem/dental/effective_date_pre_6_1_2018/area_network_factor";
    private String dentalDemoResPre612018 = "anthem/dental/effective_date_pre_6_1_2018/demo_factor";
    private String dentalSicResPre612018 = "anthem/dental/effective_date_pre_6_1_2018/sic_factor";

    // post 6/1/2018
    private String dentalRatesRes2 = "anthem/dental/base_rates_2tiers";
    private String dentalRatesRes3 = "anthem/dental/base_rates_3tiers";
    private String dentalRatesRes4 = "anthem/dental/base_rates_4tiers";
    private String dentalAreaRes = "anthem/dental/area_network_factor";
    private String dentalDemoRes = "anthem/dental/demo_factor";
    private String dentalSicRes = "anthem/dental/sic_factor";

    private String visionRatesRes2 = "anthem/vision/base_rates_2tiers";
    private String visionRatesRes3 = "anthem/vision/base_rates_3tiers";
    private String visionRatesRes4 = "anthem/vision/base_rates_4tiers";

    private ClassLoader classLoader = getClass().getClassLoader();

    private Map<Pair<String, String>, List<AnthemCVPlan>> medicalPlanMap;
    private Map<String, Map<String, Float>> medicalAreaFactors;
    private Map<Float, Float> medicalDemoFactors;
    private Map<String, Float> medicalSicFactors;

    private Map<Integer, Float> dentalDemoFactors;
    private Map<String, Float> dentalSicFactors;
    private Map<String, Pair<Float, String>> dentalAreaFactors;
    private Map<Integer, Map<String, Float[]>> dentalPlanMap;

    // remove after 6/1/2018
    private Map<Integer, Float> dentalDemoFactorsPre612018;
    private Map<String, Float> dentalSicFactorsPre612018;
    private Map<String, Pair<Float, String>> dentalAreaFactorsPre612018;
    private Map<Integer, Map<String, Float[]>> dentalPlanMapPre612018;

    private Map<Integer, Map<String, Float[]>> visionPlanMap;

    private static final Float TREND = 0.09839f;
    private static final Float G6 = 254.931124f;
    private static final String DELIMITER = "|";

    private boolean shouldAddMedicalOnePercent;

    public static final Date ANTHEM_CV_DENTAL_START_EFFECTIVE_DATE = DateHelper.fromStringToDate("06/01/2018");

    public AnthemClearValueCalculator() {
        this(true);
    }

    private AnthemClearValueCalculator(boolean shouldAddMedicalOnePercent){
        this.shouldAddMedicalOnePercent = shouldAddMedicalOnePercent;
    }
    
    @Override
    public void afterPropertiesSet() throws Exception {
        try {
            readInFiles();
        } catch(Exception e) {
            logger.error("Cannot read constants from static resurces", e);
            throw e;
        }
    }

    public void readInFiles() {
        parseMedical();
        parseDental();
        parseVision();
    }

    public Float[] getMedicalPlanRates(Integer ratingTiers, String predominantCounty, Date effectiveDate, Float averageAge,
                                        String sicCode, String paymentMethod, String commission, AnthemCVPlan anthemPlan) {

        Float combinedFactor = getMedicalCombinedFactor(predominantCounty.toUpperCase(), anthemPlan, anthemPlan.getNetworkSubtype(), anthemPlan.getNetworkType(),
            effectiveDate, averageAge, sicCode);

        Float tier1Rate = G6 * combinedFactor * anthemPlan.getPlanRel();
        anthemPlan.setCombinedFactor(combinedFactor);
        anthemPlan.setG6(G6);
        anthemPlan.setRatingTiers(ratingTiers);
        anthemPlan.setPredominantCounty(predominantCounty);
        anthemPlan.setEffectiveDate(effectiveDate);
        anthemPlan.setAverageAge(averageAge);
        anthemPlan.setSicCode(sicCode);
        anthemPlan.setPaymentMethod(paymentMethod);
        anthemPlan.setCommission(commission);

        Float[] ratesWithoutCommission;
        switch (ratingTiers) {
            case 2:
                ratesWithoutCommission = new Float[]{tier1Rate, 2.7f * tier1Rate};
                break;
            case 3:
                ratesWithoutCommission = new Float[]{tier1Rate, 2.1f * tier1Rate, 3f * tier1Rate};
                break;
            case 4:
                ratesWithoutCommission = new Float[]{tier1Rate, 2.2f * tier1Rate, 1.8f * tier1Rate, 3.1f * tier1Rate};
                break;
            default:
                throw new IllegalArgumentException(String.format("Unacceptable tiers amount %s", ratingTiers));
        }

        Float[] ratesWithCommission = addCommission(ratesWithoutCommission, paymentMethod, commission);

        if(shouldAddMedicalOnePercent) {
            return addOnePercentToMedicalRates(ratesWithCommission);
        }

        return ratesWithCommission;
    }


    private Float[] addOnePercentToMedicalRates(Float[] rates){
        Float[] result = new Float[rates.length];
        for(int i = 0; i < rates.length; i++){
            result[i] = rates[i] + (rates[i] * 0.01f);
        }
        return result;
    }


    public Float[] addCommission(Float[] ratesWithoutCommission, String paymentMethod, String commission) {
        if (StringUtils.isAnyEmpty(paymentMethod, commission)) {
            return ratesWithoutCommission;
        } else {
            if ("%".equals(paymentMethod)) {
                return Arrays
                    .stream(ratesWithoutCommission)
                    .map(rate -> rate * (1 + Float.parseFloat(commission)/100f))
                    .toArray(Float[]::new);
            } else if ("PEPM".equals(paymentMethod)) {
                return Arrays
                    .stream(ratesWithoutCommission)
                    .map(rate -> rate + Float.parseFloat(commission))
                    .toArray(Float[]::new);
            } else {
                return ratesWithoutCommission;
            }
        }
    }

    private Float getMedicalCombinedFactor(String county, AnthemCVPlan anthemPlan, String networkSubtype, String networkType, Date effectiveDate, float averageAge, String sicCode) {
        Float trend = getTrend(effectiveDate);
        if (!medicalAreaFactors.containsKey(county)) {
            throw new NotFoundException(String.format("Predominant County %s not found", county));
        }
        Float areaFactor = medicalAreaFactors.get(county).get(String.format("%s %s", networkSubtype, networkType));
        Float demoFactor = getNearestDemoFactor(averageAge);
        Float sicFactor = medicalSicFactors.get(sicCode);
        if (sicFactor == null) {
            sicFactor = 1.0f;
            logger.warn(String.format("Medical sicFactor for sicCode=%s not found", sicCode));
        }
        anthemPlan.setTrend(trend);
        anthemPlan.setAreaFactor(areaFactor);
        anthemPlan.setDemoFactor(demoFactor);
        anthemPlan.setSicFactor(sicFactor);
        return trend * areaFactor * demoFactor * sicFactor;
    }

    public Map<String, Float[]> getVisionRates(Integer ratingTiers) {
        Map<String, Float[]> plans = visionPlanMap.get(ratingTiers);
        if (plans == null) {
            throw new NotFoundException(String.format("Vision plans with %s tiers not found", ratingTiers));
        }
        return plans;
    }


    public AnthemCVDentalRates getDentalPlanRates(Integer ratingTiers, String predominantCounty, Float averageAge,
                                                  String sicCode, Date effectiveDate, List<AnthemCVPlan> dppoPlans, String paymentMethod, String commission){

        Map<String, Float[]> plans = getDentalPlanMap(effectiveDate).get(ratingTiers);
        if (plans == null) {
            throw new NotFoundException(String.format("Dental plans with %s tiers not found", ratingTiers));
        }

        Float combinedFactor = getDentalCombinedFactor(predominantCounty.toUpperCase(), effectiveDate, averageAge, sicCode, dppoPlans);
        for(AnthemCVPlan plan : dppoPlans){
            plan.setRatingTiers(ratingTiers);
            plan.setPredominantCounty(predominantCounty);
            plan.setAverageAge(averageAge);
            plan.setSicCode(sicCode);
        }

        Float[] highRates = Arrays.stream(plans.get(Constants.ANTHEM_CV_DENTAL_HIGH_PLAN))
            .map(rate -> rate * combinedFactor)
            .toArray(Float[]::new);

        Float[] mediumRates = Arrays.stream(plans.get(Constants.ANTHEM_CV_DENTAL_MEDIUM_PLAN))
            .map(rate -> rate * combinedFactor)
            .toArray(Float[]::new);

        boolean isNorthern = "Northern".equals(dentalAreaFactors.get(predominantCounty).getValue());
        Float[] lowRates;
        if (isNorthern) {
            lowRates = Arrays.stream(plans.get(Constants.ANTHEM_CV_DENTAL_LOW_PLAN))
                .map(rate -> rate * combinedFactor)
                .toArray(Float[]::new);
        } else {
            lowRates = plans.get(Constants.ANTHEM_CV_DENTAL_DHMO_2000A);
        }

        // add commission to high, medium and low plans
        Float[] highRatesWithCommission = addCommission(highRates, paymentMethod, commission);
        Float[] mediumRatesWithCommission = addCommission(mediumRates, paymentMethod, commission);
        Float[] lowRatesWithCommission = addCommission(lowRates, paymentMethod, commission);

        AnthemCVDentalRates rates = new AnthemCVDentalRates();
        rates.setHighRates(highRatesWithCommission);
        rates.setMediumRates(mediumRatesWithCommission);
        rates.setLowRates(lowRatesWithCommission);

        return rates;
    }

    private Float getDentalCombinedFactor(String county, Date effectiveDate, float averageAge, String sicCode, List<AnthemCVPlan> dppoPlans) {
        Float sicFactor = getDentalSicFactors(effectiveDate).get(sicCode);
        if (sicFactor == null) {
            sicFactor = 1.0f;
            logger.warn(String.format("Dental sicFactor for sicCode=%s not found", sicCode));
        }
        Float demoFactor = getDentalDemoFactors(effectiveDate).get((int) averageAge);
        if (demoFactor == null) {
            throw new NotFoundException(String.format("Average age %s is out of bounds [0,69]", averageAge));
        }
        Float areaFactor = getDentalAreaFactors(effectiveDate).get(county).getKey();
        if (areaFactor == null) {
            throw new NotFoundException(String.format("Predominant County %s not found", county));
        }
        for(AnthemCVPlan plan : dppoPlans){
            plan.setSicFactor(sicFactor);
            plan.setDemoFactor(demoFactor);
            plan.setAreaFactor(areaFactor);
            plan.setCombinedFactor(sicFactor * demoFactor * areaFactor);
        }
        return sicFactor * demoFactor * areaFactor;
    }

    private Float getTrend(Date effectiveDate) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(effectiveDate);
        return ((calendar.get(MONTH) + 6)/(float)12) * TREND + 1;
    }

    private Float getNearestDemoFactor(float age) {
        Float result = 0f;
        for (Map.Entry<Float, Float> entry : medicalDemoFactors.entrySet()) {
            if (age >= entry.getKey() && entry.getValue() > result) {
                result = entry.getValue();
            }
        }
        return result;
    }

    private void parseMedical() {
        parseMedicalAnthemPlanList();
        parseMedicalAreaFactors();
        parseMedicalDemoFactors();
        parseMedicalSicFactors();
    }

    private void parseVision() {
        List<String> lines = readLinesFromInputStream(visionRatesRes2);

        visionPlanMap = new HashMap<>();
        HashMap<String, Float[]> rates_2tiers = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            rates_2tiers.put(values[0], new Float[]{new Float(values[1]), new Float(values[2])});
        });
        visionPlanMap.put(2, rates_2tiers);

        lines = readLinesFromInputStream(visionRatesRes3);

        HashMap<String, Float[]> rates_3tiers = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            rates_3tiers.put(values[0], new Float[]{new Float(values[1]), new Float(values[2]), new Float(values[3])});
        });
        visionPlanMap.put(3, rates_3tiers);

        lines = readLinesFromInputStream(visionRatesRes4);
        HashMap<String, Float[]> rates_4tiers = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            rates_4tiers.put(values[0], new Float[]{new Float(values[1]), new Float(values[2]), new Float(values[3]), new Float(values[4])});
        });
        visionPlanMap.put(4, rates_4tiers);
    }

    private void parseMedicalAnthemPlanList() {
        List<String> lines = readLinesFromInputStream(medicalPlansRes);

        List<AnthemCVPlan> planList = lines.stream().map(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            return new AnthemCVPlan(values[4], values[5], new Float(values[0]), values[2], values[3], values[1]);
        }).collect(Collectors.toList());

        medicalPlanMap = planList.stream().collect(Collectors.groupingBy(
            plan -> of(plan.getNetworkName(), plan.getNetworkType()),
            HashMap::new,
            Collectors.toList()
        ));
    }

    private void parseMedicalAreaFactors() {
        List<String> lines = readLinesFromInputStream(medicalAreaRes);

        String[] columns = StringUtils.split(lines.get(0), DELIMITER);
        lines.remove(0);
        medicalAreaFactors = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            Map<String, Float> factors = new HashMap<String, Float>();
            for (int i = 1; i < values.length; i++) {
                factors.put(columns[i], new Float(values[i]));
            }
            medicalAreaFactors.put(values[0], factors);
        });
    }

    private void parseMedicalDemoFactors() {
        List<String> lines = readLinesFromInputStream(medicalDemoRes);
        medicalDemoFactors = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            medicalDemoFactors.put(new Float(values[0]), new Float(values[1]));
        });
    }

    private void parseMedicalSicFactors() {
        List<String> lines = readLinesFromInputStream(medicalSicRes);
        medicalSicFactors = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            medicalSicFactors.put(values[0], new Float(values[1]));
        });
    }

    private void parseDental() {
        /** Remove after 6/1/2018
         */
        parseDentalAnthemPlanList_pre_6_1_2018();
        parseDentalAreaFactors_pre_6_1_2018();
        parseDentalDemoFactors_pre_6_1_2018();
        parseDentalSicFactors_pre_6_1_2018();
        /** End of Remove after 6/1/2018
         */

        parseDentalAnthemPlanList();
        parseDentalAreaFactors();
        parseDentalDemoFactors();
        parseDentalSicFactors();
    }

    // New dental rates to be used after 6/1/2018
    private void parseDentalAnthemPlanList() {
        List<String> lines = readLinesFromInputStream(dentalRatesRes2);
        dentalPlanMap = new HashMap<>();
        HashMap<String, Float[]> rates_2tiers = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            rates_2tiers.put(values[0], new Float[]{new Float(values[1]), new Float(values[2])});
        });
        dentalPlanMap.put(2, rates_2tiers);

        lines = readLinesFromInputStream(dentalRatesRes3);
        HashMap<String, Float[]> rates_3tiers = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            rates_3tiers.put(values[0], new Float[]{new Float(values[1]), new Float(values[2]), new Float(values[3])});
        });
        dentalPlanMap.put(3, rates_3tiers);

        lines = readLinesFromInputStream(dentalRatesRes4);
        HashMap<String, Float[]> rates_4tiers = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            rates_4tiers.put(values[0], new Float[]{new Float(values[1]), new Float(values[2]), new Float(values[3]), new Float(values[4])});
        });
        dentalPlanMap.put(4, rates_4tiers);
    }

    private void parseDentalAreaFactors() {
        List<String> lines = readLinesFromInputStream(dentalAreaRes);
        dentalAreaFactors = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            dentalAreaFactors.put(values[0], of(new Float(values[1]), values[2]));
        });

    }

    private void parseDentalDemoFactors() {
        List<String> lines = readLinesFromInputStream(dentalDemoRes);
        dentalDemoFactors = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            dentalDemoFactors.put(new Integer(values[0]), new Float(values[1]));
        });
    }

    private void parseDentalSicFactors() {
        List<String> lines = readLinesFromInputStream(dentalSicRes);
        dentalSicFactors = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            dentalSicFactors.put(values[0], new Float(values[1]));
        });
    }

    // -- Remove after 6/1/2018

    private void parseDentalAnthemPlanList_pre_6_1_2018() {
        List<String> lines = readLinesFromInputStream(dentalRatesRes2Pre612018);
        dentalPlanMapPre612018 = new HashMap<>();
        HashMap<String, Float[]> rates_2tiers = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            rates_2tiers.put(values[0], new Float[]{new Float(values[1]), new Float(values[2])});
        });
        dentalPlanMapPre612018.put(2, rates_2tiers);

        lines = readLinesFromInputStream(dentalRatesRes3Pre612018);
        HashMap<String, Float[]> rates_3tiers = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            rates_3tiers.put(values[0], new Float[]{new Float(values[1]), new Float(values[2]), new Float(values[3])});
        });
        dentalPlanMapPre612018.put(3, rates_3tiers);

        lines = readLinesFromInputStream(dentalRatesRes4Pre612018);
        HashMap<String, Float[]> rates_4tiers = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            rates_4tiers.put(values[0], new Float[]{new Float(values[1]), new Float(values[2]), new Float(values[3]), new Float(values[4])});
        });
        dentalPlanMapPre612018.put(4, rates_4tiers);
    }

    private void parseDentalAreaFactors_pre_6_1_2018() {
        List<String> lines = readLinesFromInputStream(dentalAreaResPre612018);
        dentalAreaFactorsPre612018 = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            dentalAreaFactorsPre612018.put(values[0], of(new Float(values[1]), values[2]));
        });

    }

    private void parseDentalDemoFactors_pre_6_1_2018() {
        List<String> lines = readLinesFromInputStream(dentalDemoResPre612018);
        dentalDemoFactorsPre612018 = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            dentalDemoFactorsPre612018.put(new Integer(values[0]), new Float(values[1]));
        });
    }

    private void parseDentalSicFactors_pre_6_1_2018() {
        List<String> lines = readLinesFromInputStream(dentalSicResPre612018);
        dentalSicFactorsPre612018 = new HashMap<>((int) (lines.size() / 0.75) + 1);
        lines.forEach(line -> {
            String[] values = StringUtils.split(line, DELIMITER);
            dentalSicFactorsPre612018.put(values[0], new Float(values[1]));
        });
    }

    // -- End of Remove after 6/1/2018
    
    /** 
     * @throws UncheckedIOException  
     */
    private List<String> readLinesFromInputStream(String path) {
        InputStream inputStream = classLoader.getResourceAsStream(path);
        return new BufferedReader(new InputStreamReader(inputStream,
            StandardCharsets.UTF_8)).lines().collect(Collectors.toList());
    }

    public Map<Pair<String, String>, List<AnthemCVPlan>> getMedicalPlanMap() {
        return medicalPlanMap;
    }

    public Map<Integer, Map<String, Float[]>> getDentalPlanMap(Date effectiveDate) {
        if(isBefore06012018(effectiveDate)){
            return dentalPlanMapPre612018;
        }
        return dentalPlanMap;
    }

    public Map<String, Map<String, Float>> getMedicalAreaFactors() {
        return medicalAreaFactors;
    }


    public Map<Integer, Float> getDentalDemoFactors(Date effectiveDate) {
        if(isBefore06012018(effectiveDate)){
            return dentalDemoFactorsPre612018;
        }

        return dentalDemoFactors;
    }

    public Map<String, Float> getDentalSicFactors(Date effectiveDate) {
        if(isBefore06012018(effectiveDate)){
            return dentalSicFactorsPre612018;
        }
        return dentalSicFactors;
    }

    public Map<String, Pair<Float, String>> getDentalAreaFactors(Date effectiveDate) {
        if(isBefore06012018(effectiveDate)){
            return dentalAreaFactorsPre612018;
        }
        return dentalAreaFactors;
    }

    public void setShouldAddMedicalOnePercent(boolean shouldAddMedicalOnePercent) {
        this.shouldAddMedicalOnePercent = shouldAddMedicalOnePercent;
    }
    
    public String getDentalLocale(String predominantCounty, Date effectiveDate) {
        if (predominantCounty == null) { return null; }
        Pair<Float, String> dentalAreaFactor = dentalAreaFactors.get(predominantCounty.toUpperCase());

        if(isBefore06012018(effectiveDate)){
            dentalAreaFactor = dentalAreaFactorsPre612018.get(predominantCounty.toUpperCase());
        }
        if (dentalAreaFactor == null) { return null; }
        return dentalAreaFactor.getValue();
    }

    private boolean isBefore06012018(Date date){
        return date.before(ANTHEM_CV_DENTAL_START_EFFECTIVE_DATE);
    }
}
