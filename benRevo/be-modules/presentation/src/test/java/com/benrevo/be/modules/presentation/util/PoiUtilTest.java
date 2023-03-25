package com.benrevo.be.modules.presentation.util;

import static com.benrevo.common.Constants.ER_CONTRIBUTION_FORMAT_DOLLAR;
import static com.benrevo.common.Constants.ER_CONTRIBUTION_FORMAT_PERCENT;
import static com.benrevo.common.Constants.TIER1_PLAN_NAME;
import static com.benrevo.common.Constants.TIER2_PLAN_NAME_SPECIAL;
import static com.benrevo.common.Constants.TIER3_PLAN_NAME_SPECIAL;
import static com.benrevo.common.Constants.TIER4_PLAN_NAME;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.common.enums.PlanCategory.*;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Census;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Cost;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.dto.QuoteOptionPlanComparisonDto;
import com.benrevo.common.dto.QuoteOptionPlanComparisonDto.PlanByNetwork;
import com.benrevo.common.dto.RiderDto;
import com.benrevo.common.dto.ancillary.AncillaryClassDto;
import com.benrevo.common.dto.ancillary.AncillaryRateAgeDto;
import com.benrevo.common.dto.ancillary.AncillaryRateDto;
import com.benrevo.common.dto.ancillary.BasicRateDto;
import com.benrevo.common.dto.ancillary.LifeClassDto;
import com.benrevo.common.dto.ancillary.LtdClassDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryPlanComparisonDto;
import com.benrevo.common.dto.ancillary.StdClassDto;
import com.benrevo.common.dto.ancillary.VoluntaryRateDto;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.benrevo.data.persistence.entities.RfpSubmission;
import io.github.benas.randombeans.EnhancedRandomBuilder;
import io.github.benas.randombeans.api.EnhancedRandom;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.poi.xssf.usermodel.XSSFFormulaEvaluator;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.Test;

public class PoiUtilTest {
    
    private EnhancedRandom random = EnhancedRandomBuilder.aNewEnhancedRandomBuilder()
        .collectionSizeRange(1, 4)
        .stringLengthRange(5, 15)
        .build();

	private static final String FILE2 = "poiUtilTest.xlsx";
	
	private PlanByNetwork createPlan(int number, int tiersCount, String planType) {        
        PlanByNetwork hmoPlan = new PlanByNetwork();
        hmoPlan.networkName = "tier" + tiersCount + " network";
        hmoPlan.networkType = planType;
        hmoPlan.networkPlan = new QuoteOptionAltPlanDto();
        hmoPlan.networkPlan.setRfpQuoteNetworkPlanId(1060L);
        hmoPlan.networkPlan.setName("Test plan " + planType + " " + number + " with long name Rx:Essential Formulary $5/$15/$30/$50/30%");
        hmoPlan.networkPlan.setType("alternative");
        hmoPlan.networkPlan.setSelected(true);
        hmoPlan.networkPlan.setCarrier("Anthem Blue Cross");
        
        if (planType.equals("HSA") && (number % 2) == 0) {
            hmoPlan.networkPlan.setAdministrativeFee(12345.67f);
            hmoPlan.networkPlan.setEmployerFund(9876.56f);
        }
        
        List<Benefit> nebefits = new ArrayList<>();
        for(int j = 0; j < 10; j++) {
            Benefit benefit = new Benefit();   
            benefit.ordinal = j % 2 == 0 ? j : 0;
            benefit.name = "benefit " + j + " (order " + benefit.ordinal + ")";
            if (planType.equals("HMO")) {
                if (j % 2 == 0) {
                    benefit.value = Integer.toString(j * number * 1000);
                    benefit.type = ER_CONTRIBUTION_FORMAT_DOLLAR;
                } else {
                    benefit.value = Integer.toString(j * 10);
                    benefit.type = ER_CONTRIBUTION_FORMAT_PERCENT;
                }    
            } else {
                if (j % 2 == 0) {
                    benefit.valueIn = Integer.toString(j * number * 1000);
                    benefit.valueOut = Integer.toString(j * number * 999);
                    benefit.typeIn = ER_CONTRIBUTION_FORMAT_DOLLAR;
                    benefit.typeOut = ER_CONTRIBUTION_FORMAT_DOLLAR;
                } else {
                    benefit.valueIn = Integer.toString(j * 10);
                    benefit.valueOut = Integer.toString(j * 10 - 5);
                    benefit.typeIn = ER_CONTRIBUTION_FORMAT_PERCENT;
                    benefit.typeOut = ER_CONTRIBUTION_FORMAT_PERCENT;
                }  
            }
            nebefits.add(benefit);
        }
        // to check for merging IN/OUT cilumns if no OUT value
        nebefits.get(0).typeIn = "STRING";
        nebefits.get(0).valueIn = "Merged IN/OUT value";
        nebefits.get(0).valueOut = null;
        
        hmoPlan.networkPlan.setBenefits(nebefits);
        String cost1 = Double.toString(1 * number + 0.96);
        String cost2 = Double.toString(2 * number + 0.97);
        String cost3 = Double.toString(3 * number + 0.98);
        String cost4 = Double.toString(4 * number + 0.99);
        switch(tiersCount) {
            case 1:
                hmoPlan.networkPlan.getCost().add(new Cost(TIER1_PLAN_NAME, cost1, ER_CONTRIBUTION_FORMAT_DOLLAR));
                hmoPlan.networkPlan.getCensus().add(new Census(TIER1_PLAN_NAME, 1L));
                break;
            case 2:
                hmoPlan.networkPlan.getCost().add(new Cost(TIER1_PLAN_NAME, cost1, ER_CONTRIBUTION_FORMAT_DOLLAR));
                hmoPlan.networkPlan.getCensus().add(new Census(TIER1_PLAN_NAME, 1L));
                hmoPlan.networkPlan.getCost().add(new Cost(TIER4_PLAN_NAME, cost2, ER_CONTRIBUTION_FORMAT_DOLLAR));
                hmoPlan.networkPlan.getCensus().add(new Census(TIER4_PLAN_NAME, 2L));
                break;
            case 3:
                hmoPlan.networkPlan.getCost().add(new Cost(TIER1_PLAN_NAME, cost1, ER_CONTRIBUTION_FORMAT_DOLLAR));
                hmoPlan.networkPlan.getCensus().add(new Census(TIER1_PLAN_NAME, 1L));
                hmoPlan.networkPlan.getCost().add(new Cost(TIER2_PLAN_NAME_SPECIAL, cost2, ER_CONTRIBUTION_FORMAT_DOLLAR));
                hmoPlan.networkPlan.getCensus().add(new Census(TIER2_PLAN_NAME_SPECIAL, 2L));
                hmoPlan.networkPlan.getCost().add(new Cost(TIER3_PLAN_NAME_SPECIAL, cost3, ER_CONTRIBUTION_FORMAT_DOLLAR));
                hmoPlan.networkPlan.getCensus().add(new Census(TIER3_PLAN_NAME_SPECIAL, 3L));
                break;
            case 4:
                Cost c1 = new Cost(Constants.TIER1_PLAN_NAME, cost1, ER_CONTRIBUTION_FORMAT_DOLLAR);
                Cost c2 = new Cost(Constants.TIER2_PLAN_NAME, cost2, ER_CONTRIBUTION_FORMAT_DOLLAR);
                Cost c3 = new Cost(Constants.TIER3_PLAN_NAME, cost3, ER_CONTRIBUTION_FORMAT_DOLLAR);
                Cost c4 = new Cost(Constants.TIER4_PLAN_NAME, cost4, ER_CONTRIBUTION_FORMAT_DOLLAR);
                hmoPlan.networkPlan.setCost(Arrays.asList(c1, c2, c3, c4));
                Census cen1 = new Census(Constants.TIER1_PLAN_NAME, 100L);
                Census cen2 = new Census(Constants.TIER2_PLAN_NAME, 200L);
                Census cen3 = new Census(Constants.TIER3_PLAN_NAME, 300L);
                Census cen4 = new Census(Constants.TIER4_PLAN_NAME, 400L);
                hmoPlan.networkPlan.setCensus(Arrays.asList(cen1, cen2, cen3, cen4));
                break;
        }
        List<Rx> rx = new ArrayList<>();
        rx.add(new Rx("sysName", "Individual Deductible", "N/A", "STRING"));
        rx.add(new Rx("sysName", "Family Deductible", "90", ER_CONTRIBUTION_FORMAT_PERCENT));
        rx.add(new Rx("sysName", "Tier 1 - Generic", "123", ER_CONTRIBUTION_FORMAT_DOLLAR));
        rx.add(new Rx("sysName", "Tier 2 - Brand / Formulary", "456", ER_CONTRIBUTION_FORMAT_DOLLAR));
        hmoPlan.networkPlan.setRx(rx);
        
        List<RiderDto> riders = new ArrayList<>();
        RiderDto r = new RiderDto();
        r.setRiderCode("riderCode1");
        r.setSelected(true);
        riders.add(r);
        r = new RiderDto();
        r.setRiderCode("riderCode2");
        r.setSelected(true);
        riders.add(r);
        r = new RiderDto();
        r.setRiderCode("riderCode3");
        riders.add(r);
        hmoPlan.networkPlan.setRiders(riders);
        
        return hmoPlan;
	}
	
	@Test
    public void prepareDisclaimerRows() throws Exception {
	    XSSFWorkbook workbook = new XSSFWorkbook();
	    PoiUtil poiUtil = new PoiUtil();
	    
	    for(String fileName : Arrays.asList("Anthem_disclaimer", "Anthem_DPPO_disclaimer", "UHC_disclaimer")) {
	        XSSFSheet sheet = workbook.createSheet(fileName);
	        InputStream is = this.getClass().getResourceAsStream("/disclaimers/" + fileName + ".html");
	        String disclaimer = IOUtils.toString(is, StandardCharsets.UTF_8);
	        poiUtil.fillDisclaimerSheet(disclaimer, sheet);
        }
	    XSSFFormulaEvaluator.evaluateAllFormulaCells(workbook);
	    
	    ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        IOUtils.closeQuietly(out, workbook);
        //File file = new File("testDisclaimers.xlsx");
        //FileUtils.writeByteArrayToFile(file, out.toByteArray());
	}
	
	@Test
    public void convertAncillaryPlanComparisonDtoToExcel_EmptyData() throws Exception {
		Client client = new Client();
        client.setClientName("Excel client");
        client.setEffectiveDate(DateHelper.fromStringToDate("01/02/2000"));
        Broker broker = new Broker();
        broker.setName("Excel broker");
        client.setBroker(broker);

        List<RfpQuote> rfpQuotes = new ArrayList<>(); 
        List<RFP> rfps = new ArrayList<>();
        RfpQuoteSummary rqs = new RfpQuoteSummary();
        //rqs.setMedicalNotes("Test MedicalNotes");
        //rqs.setMedicalWithKaiserNotes("Test MedicalWithKaiserNotes");
        List<RfpQuoteAncillaryPlanComparisonDto> comparisonDtos = new ArrayList<>();
        
        PoiUtil poiUtil = new PoiUtil();
        
        byte[] content = poiUtil.convertAncillaryPlanComparisonDtoToExcel(
                client, PlanCategory.LIFE, comparisonDtos, rfpQuotes, rfps, rqs);
            
        //File file = new File("Empty_" + FILE2);
        //FileUtils.writeByteArrayToFile(file, content);
	}
	
	@Test
    public void convertAncillaryPlanComparisonDtoToExcel() throws Exception {
	    Client client = new Client();
        client.setClientName("Excel client");
        client.setEffectiveDate(DateHelper.fromStringToDate("01/02/2000"));
        Broker broker = new Broker();
        broker.setName("Excel broker");
        client.setBroker(broker);
        
        
        List<RfpQuote> rfpQuotes = new ArrayList<>(); 
        List<RFP> rfps = new ArrayList<>();

        RfpQuoteSummary rqs = new RfpQuoteSummary();
        rqs.setLifeNotes("Life/Disability Notes");
        
        
        
        PoiUtil poiUtil = new PoiUtil();
        
        for(PlanCategory product : new PlanCategory[] {LIFE, VOL_LIFE, STD, VOL_STD, LTD, VOL_LTD}) {
            List<RfpQuoteAncillaryPlanComparisonDto> comparisonDtos = new ArrayList<>();
            for(int classNumber = 1; classNumber <= 4; classNumber++) {
                RfpQuoteAncillaryPlanComparisonDto dto = new RfpQuoteAncillaryPlanComparisonDto();
                dto.setOptionName("Option " + classNumber);
                dto.setPlanName(product + " Plan " + classNumber);
                List<? extends AncillaryClassDto> classes = null;
                AncillaryRateDto rates = null;
                if(product.name().startsWith("VOL_")) {
                    dto.setPlanType(AncillaryPlanType.VOLUNTARY);
                    VoluntaryRateDto vr = EnhancedRandom.random(VoluntaryRateDto.class);
                    vr.setAges(generateRateAges(9, 30));
                    rates = vr;
                } else {
                    dto.setPlanType(AncillaryPlanType.BASIC); 
                    rates = EnhancedRandom.random(BasicRateDto.class); 
                }
                rates.setVolume(1000000f);
                
                if(product.name().endsWith("LIFE")) {
                    classes = EnhancedRandom.randomListOf(4, LifeClassDto.class);
                } else if(product.name().endsWith("STD")) {
                    classes = EnhancedRandom.randomListOf(4, StdClassDto.class);
                } else if(product.name().endsWith("LTD")) {
                    classes = EnhancedRandom.randomListOf(4, LtdClassDto.class);
                }
                dto.setClasses((List<AncillaryClassDto>) classes);
                dto.setRates(rates);
                comparisonDtos.add(dto);
            }
            //create Class 1 and Class 2 only for one plan
            comparisonDtos.get(1).getClasses().remove(3);
            comparisonDtos.get(1).getClasses().remove(2);
            
            RFP rfp = new RFP();
            if (product == LIFE || product == VOL_LIFE) { 
                rfp.setPaymentMethod("%");
            } else if (product == STD || product == VOL_STD) {
                rfp.setPaymentMethod("PEPM");
            } else if(product == LTD || product == VOL_LTD) {
                rfp.setPaymentMethod("COMMISSION");
            }
            rfp.setCommission("5");
            rfp.setProduct(product.name());
            rfps.clear();
            rfps.add(rfp);
            
            byte[] content = poiUtil.convertAncillaryPlanComparisonDtoToExcel(
                client, product, comparisonDtos, rfpQuotes, rfps, rqs);
            
            //File file = new File(product.name() + "_" + FILE2);
            //FileUtils.writeByteArrayToFile(file, content);
        }
	}
	
	private List<AncillaryRateAgeDto> generateRateAges(int count, int from) {
	    List<AncillaryRateAgeDto> result = new ArrayList<>();
	    for(int i = 0; i < count; i++) {
	        AncillaryRateAgeDto ra = new AncillaryRateAgeDto();
	        ra.setCurrentEmp(random.nextFloat());
            ra.setCurrentEmpTobacco(random.nextFloat());
            ra.setCurrentSpouse(random.nextFloat());
            ra.setFrom(from);
            from += 5;
            ra.setTo(from);
            from += 1;
            result.add(ra);
        }
	    result.get(0).setCurrentEmp(0f);
	    result.get(1).setCurrentEmpTobacco(0f);
	    result.get(2).setCurrentSpouse(0f);
	    return result;
	}
	
	@Test
    public void convertQuoteOptionPlanComparisonDtoToExcel_NewFormat() throws Exception {
	    
	    List<QuoteOptionPlanComparisonDto> comparisonDtos = new ArrayList<QuoteOptionPlanComparisonDto>();
	    for(int i = 1; i <= PoiUtil.MAX_OPTION_NUMBER; i++) {
	        QuoteOptionPlanComparisonDto option = new QuoteOptionPlanComparisonDto();
	        option.setName("Option " + i);
	        if (i > 6) { // 7, 8
	            option.setCarrier(CarrierType.UHC.displayName);
	        } else if (i > 3) { // 4, 5, 6
	            option.setCarrier(CarrierType.ANTHEM_BLUE_CROSS.displayName);
	        } else { // 1, 2, 3
	            option.setCarrier(CarrierType.ANTHEM_CLEAR_VALUE.displayName);
	        }
	        option.setSelected(true);
	        option.getPlans().add(createPlan(i + 100 + 1, 4, "HMO"));
	        option.getPlans().add(createPlan(i + 100 + 2, 1, "HMO"));
	        option.getPlans().add(createPlan(i + 100 + 3, 3, "PPO"));
	        option.getPlans().add(createPlan(i + 100 + 4, 2, "HSA")); 
	        // test duplicate by name "tier4 network" (but different type)
	        option.getPlans().add(createPlan(i + 100 + 5, 4, "PPO"));
	        comparisonDtos.add(option);
	    }

        Client client = new Client();
        client.setClientName("Excel client");
        client.setEffectiveDate(DateHelper.fromStringToDate("01/02/2000"));
        Broker broker = new Broker();
        broker.setName("Excel broker");
        client.setBroker(broker);
        
        final String CATEGORY = MEDICAL; // set DENTAL for generated file verify
        
        List<RfpQuote> rfpQuotes = new ArrayList<>();
        RfpQuote rfpQuote1 = new RfpQuote();
        rfpQuote1.setDisclaimer("<div><div>ANTHEM_BLUE_CROSS Disclaimer</div></div>");
        RfpSubmission sub1 = new RfpSubmission();
        Carrier anthem = new Carrier();
        anthem.setDisplayName(CarrierType.ANTHEM_BLUE_CROSS.displayName);
        anthem.setName(CarrierType.ANTHEM_BLUE_CROSS.name());
        RfpCarrier rAnthem = new RfpCarrier();
        rAnthem.setCategory(CATEGORY);
        rAnthem.setCarrier(anthem);
        sub1.setClient(client);
        sub1.setRfpCarrier(rAnthem);
        rfpQuote1.setRfpSubmission(sub1);
        rfpQuotes.add(rfpQuote1);
        
        RfpQuote rfpQuote2 = new RfpQuote();
        RfpSubmission sub2 = new RfpSubmission();
        Carrier cv = new Carrier();
        cv.setDisplayName(CarrierType.ANTHEM_CLEAR_VALUE.displayName);
        cv.setName(CarrierType.ANTHEM_CLEAR_VALUE.name());
        RfpCarrier rCV = new RfpCarrier();
        rCV.setCategory(CATEGORY);
        rCV.setCarrier(cv);
        sub2.setClient(client);
        sub2.setRfpCarrier(rCV);
        rfpQuote2.setRfpSubmission(sub2);
        rfpQuotes.add(rfpQuote2);
        
        RfpQuote rfpQuote3 = new RfpQuote();
        rfpQuote3.setDisclaimer("<div><div>UHC Disclaimer</div></div>");
        RfpSubmission sub3 = new RfpSubmission();
        Carrier uhc = new Carrier();
        uhc.setDisplayName(CarrierType.UHC.displayName);
        uhc.setName(CarrierType.UHC.name());
        RfpCarrier rUHC = new RfpCarrier();
        rUHC.setCategory(CATEGORY);
        rUHC.setCarrier(uhc);
        sub3.setClient(client);
        sub3.setRfpCarrier(rUHC);
        rfpQuote3.setRfpSubmission(sub3);
        rfpQuotes.add(rfpQuote3);
        
        List<RFP> rfps = new ArrayList<>();
        RFP rfp1 = new RFP();
        rfp1.setCommission("5");
        rfp1.setPaymentMethod("%");
        rfp1.setProduct(MEDICAL);
        rfps.add(rfp1);
        
        RFP rfp2 = new RFP();
        rfp2.setPaymentMethod("PEPM");
        rfp2.setProduct(DENTAL);
        rfps.add(rfp2);

        RfpQuoteSummary rqs = new RfpQuoteSummary();
        rqs.setMedicalNotes("We quoted a High/Low HMO along with a PPO to match your current benefits " +
                "and we are coming in roughly 3.7% below current based on the closest matching plans.\n\n" +
                "-Traditional-Value HMO 30/40/500A/3D/20% \n" + 
                "-Traditional-Premier HMO 20/100%\n" + 
                "-Classic PPO 1000/35/20\n"
                + "Broker commission is 5%");
        rqs.setVisionNotes("Vision Notes");
        rqs.setDentalNotes("Dental Notes");
        
        PoiUtil poiUtil = new PoiUtil();
        byte[] content = poiUtil.convertQuoteOptionPlanComparisonDtoToExcel_2(client, rfpQuotes, rfps, comparisonDtos, rqs);
        
        //File file = new File(FILE2);
        //FileUtils.writeByteArrayToFile(file, content);
        
        // test No Dental and handling Net of Commission
        rfp2.setPaymentMethod("COMMISSION");
        rfp2.setProduct(VISION);

        content = poiUtil.convertQuoteOptionPlanComparisonDtoToExcel_2(client, rfpQuotes, rfps, comparisonDtos, rqs);
        //File file2 = new File(FILE2);
        //FileUtils.writeByteArrayToFile(file2, content);
        
	}
}
