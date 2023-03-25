package com.benrevo.admin.domain.quotes.uhc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.fail;
import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.quotes.parsers.uhc.UHCMedicalQuoteParser;
import com.benrevo.be.modules.admin.domain.quotes.parsers.uhc.UHCNetwork;
import com.benrevo.be.modules.admin.domain.quotes.parsers.uhc.UHCNetworkDetails;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.repository.BenefitNameRepository;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created by ojas.sitapara on 5/18/17.
 */
public class UHCMedicalQuoteParserTest extends AdminAbstractControllerTest {
    
    @Autowired
    private BenefitNameRepository benefitNameRepository;


    @Test
    public void testRidersParsingInMedicalQuote() throws Exception {
        UHCMedicalQuoteParser parser = new UHCMedicalQuoteParser();
        String quoteFile = Paths.get("").toAbsolutePath().toString()
                + "/data/quotes/UHC/Medical/2017SampleQuotes/2017 Astreya Partners, Inc. - No Cal Alongside Kaiser No GRx Quote Exhibits.xlsx";
        List<LinkedHashMap<String, UHCNetwork>> parseResult = parser.parseMedicalQuotes(new FileInputStream(quoteFile), benefitNameRepository.findAll(), false);
        Assert.assertEquals("Acupuncture 20, Bariatric & Obesity Surgery", parseResult.get(0).get("Choice__Rx:246").getOption().getOtherBenefits());;
    }
    
    
    @Test
    public void testMotionParsingInMedicalQuote() throws Exception {
        
        UHCMedicalQuoteParser parser = new UHCMedicalQuoteParser();
        String quoteFile = Paths.get("").toAbsolutePath().toString()
                + "/data/quotes/UHC/Medical/2018SampleQuotes/Remark Media EX Motion_Jimson.xlsm";
        List<LinkedHashMap<String, UHCNetwork>> parseResult = parser.parseMedicalQuotes(new FileInputStream(quoteFile), benefitNameRepository.findAll(), false);

        assertThat(parseResult).hasSize(2);
        
        LinkedHashMap<String, UHCNetwork> mpeSheet = parseResult.get(0);
        LinkedHashMap<String, UHCNetwork> hsaMpeSheet = parseResult.get(1);
        
        assertThat(mpeSheet.entrySet()).hasSize(7);
        assertThat(mpeSheet.keySet()).contains("Traditional with Deductible__Rx:2VX - Motion");
        
        assertThat(hsaMpeSheet.entrySet()).hasSize(2);
        assertThat(hsaMpeSheet.keySet()).containsExactly("HSA__Rx:2VX-HSA","HSA__Rx:2VX-HSA - Motion");

    }

    @Test
    public void testParsingMissingHiddenData() throws Exception {
        
        UHCMedicalQuoteParser parser = new UHCMedicalQuoteParser();
        String quoteFile = Paths.get("").toAbsolutePath().toString()
                + "/data/quotes/UHC/Medical/2018SampleQuotes/AmeriCare UHC Medical Proposal.xlsm";
        List<LinkedHashMap<String, UHCNetwork>> parseResult = parser.parseMedicalQuotes(new FileInputStream(quoteFile), benefitNameRepository.findAll(), false);

        assertThat(parseResult).hasSize(2);
        
        LinkedHashMap<String, UHCNetwork> mpeSheet = parseResult.get(0);
        LinkedHashMap<String, UHCNetwork> hsaMpeSheet = parseResult.get(1);
        
        assertThat(mpeSheet.entrySet()).hasSize(5);
        assertThat(mpeSheet.keySet()).containsExactlyInAnyOrder(
                "Advantage__Rx:42F","Focus__Rx:42F","Alliance__Rx:42F","Select Plus__Rx:463","Core__Rx:463");

        assertThat(mpeSheet.get("Advantage__Rx:42F").getNetworksDetails()).hasSize(27);
        assertThat(mpeSheet.get("Focus__Rx:42F").getNetworksDetails()).hasSize(27);
        assertThat(mpeSheet.get("Alliance__Rx:42F").getNetworksDetails()).hasSize(27);
        assertThat(mpeSheet.get("Select Plus__Rx:463").getNetworksDetails()).hasSize(22);
        assertThat(mpeSheet.get("Core__Rx:463").getNetworksDetails()).hasSize(22);
        
        assertThat(hsaMpeSheet.entrySet()).hasSize(2);
        assertThat(hsaMpeSheet.keySet()).containsExactlyInAnyOrder(
                "Select Plus HSA__Rx:C2-HSA", "Core HSA__Rx:C2-HSA");

        assertThat(hsaMpeSheet.get("Select Plus HSA__Rx:C2-HSA").getNetworksDetails()).hasSize(20);
        assertThat(hsaMpeSheet.get("Core HSA__Rx:C2-HSA").getNetworksDetails()).hasSize(16);

    }

    @Test
    public void testParsingRenewalHMO() throws Exception {
        
        UHCMedicalQuoteParser parser = new UHCMedicalQuoteParser();
        String quoteFile = Paths.get("").toAbsolutePath().toString()
                + "/data/renewal_quotes/Medical/American Integrated Services_HMO Exhibits.xlsm";
        List<LinkedHashMap<String, UHCNetwork>> parseResult = parser.parseMedicalQuotes(new FileInputStream(quoteFile), benefitNameRepository.findAll(), true);

        assertThat(parseResult).hasSize(1);
        
        LinkedHashMap<String, UHCNetwork> mpeSheet = parseResult.get(0);
        
        assertThat(mpeSheet.keySet())
            .hasSize(3)
            .containsExactly(
                    "Signature__Plan:U9F__Rx:3KF",
                    "Signature__Plan:U7W__Rx:30I",
                    "Advantage__Plan:UN3__Rx:3KF");

        UHCNetwork option1 = mpeSheet.get("Signature__Plan:U9F__Rx:3KF");
        assertThat(option1.getNetworksDetails()).hasSize(20);
        assertThat(option1.getNetworksDetailsRx()).hasSize(5);
        assertThat(option1.getNetworksDetailsRider()).hasSize(1);
        assertThat(option1.getOption().getCurrentPlanName()).isEqualTo("U9F");
        
        UHCNetworkDetails currentPlan = option1.getNetworksDetails().stream()
                .filter(p -> p.getShortPlanName().equals(option1.getOption().getCurrentPlanName()))
                .findFirst()
                .orElse(null);
        
        assertThat(currentPlan).isNotNull();        
        assertThat(currentPlan.getGenericPlanDetails().getBenefits()).isNotEmpty();
        
        for (Benefit ben : currentPlan.getGenericPlanDetails().getBenefits()) {
            assertThat(ben.getInOutNetwork()).isEqualTo("IN");

            if (ben.getBenefitName().getName().equals("INDIVIDUAL_DEDUCTIBLE")) {
                assertThat(ben.getValue()).isEqualTo("0");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("FAMILY_DEDUCTIBLE")) {
                assertThat(ben.getValue()).isEqualTo("0");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("DEDUCTIBLE_TYPE")) {
                assertThat(ben.getValue()).isEqualTo("Emb");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("PCP")) {
                assertThat(ben.getValue()).isEqualTo("25");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("SPECIALIST")) {
                assertThat(ben.getValue()).isEqualTo("25");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("OUTPATIENT_SURGERY")) {
                assertThat(ben.getValue()).isEqualTo("400");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("INPATIENT_HOSPITAL")) {
                assertThat(ben.getValue()).isEqualTo("500");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("IP_COPAY_TYPE")) {
                assertThat(ben.getValue()).isEqualTo("Admit");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("IP_COPAY_MAX")) {
                assertThat(ben.getValue()).isEqualTo("");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("URGENT_CARE")) {
                assertThat(ben.getValue()).isEqualTo("75");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("EMERGENCY_ROOM")) {
                assertThat(ben.getValue()).isEqualTo("150");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("INDIVIDUAL_OOP_LIMIT")) {
                assertThat(ben.getValue()).isEqualTo("1500");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("FAMILY_OOP_LIMIT")) {
                assertThat(ben.getValue()).isEqualTo("3000");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else {
                fail("Unknown benefit: " + ben.getBenefitName().getName());
            }

        }
        
        UHCNetwork option2 = mpeSheet.get("Signature__Plan:U7W__Rx:30I");
        assertThat(option2.getNetworksDetails()).hasSize(20);
        assertThat(option2.getNetworksDetailsRx()).hasSize(10);
        assertThat(option2.getNetworksDetailsRider()).hasSize(1);
        
        UHCNetwork option3 = mpeSheet.get("Advantage__Plan:UN3__Rx:3KF");
        assertThat(option3.getNetworksDetails()).hasSize(20);
        assertThat(option3.getNetworksDetailsRx()).hasSize(5);
        assertThat(option3.getNetworksDetailsRider()).hasSize(1);

        UHCNetworkDetails plan = option3.getNetworksDetailsRx().get(4);
        assertThat(plan.getShortPlanName()).isEqualTo("3HV");

        for (Benefit benefit : plan.getGenericPlanDetails().getBenefits()) {
            assertThat(benefit.getInOutNetwork()).isEqualTo("IN");
            if ("MEMBER_COPAY_TIER_1".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("DOLLAR");
                assertThat(benefit.getValue()).isEqualTo("15");
            } else if ("MEMBER_COPAY_TIER_2".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("DOLLAR");
                assertThat(benefit.getValue()).isEqualTo("35");
            } else if ("MEMBER_COPAY_TIER_3".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("STRING");
                assertThat(benefit.getValue()).isEqualTo("30% (max $100)");
            } else if ("MEMBER_COPAY_TIER_4".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("STRING");
                assertThat(benefit.getValue()).isEqualTo("N/A");
            } else if ("MAIL_ORDER".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("MULTIPLE");
                assertThat(benefit.getValue()).isEqualTo("2");
            } else if ("RX_INDIVIDUAL_DEDUCTIBLE".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("DOLLAR");
                assertThat(benefit.getValue()).isEqualTo("200");
            } else if ("RX_FAMILY_DEDUCTIBLE".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("STRING");
                assertThat(benefit.getValue()).isEqualTo("N/A");
            }
        }
    }

    @Test
    public void testParsingRenewalHMO3Tier() throws Exception {
        
        UHCMedicalQuoteParser parser = new UHCMedicalQuoteParser();
        String quoteFile = Paths.get("").toAbsolutePath().toString()
                + "/data/renewal_quotes/Medical/HMO 3 tier renewal example 2.xlsx" ;
        List<LinkedHashMap<String, UHCNetwork>> parseResult = parser.parseMedicalQuotes(new FileInputStream(quoteFile), benefitNameRepository.findAll(), true);

        assertThat(parseResult).hasSize(1);
        
        LinkedHashMap<String, UHCNetwork> mpeSheet = parseResult.get(0);
        
        assertThat(mpeSheet.keySet())
            .hasSize(5)
            .containsExactly(
                    "Signature__Plan:Y6R__Rx:31M",
                    "Signature__Plan:UJ7__Rx:45Y",
                    "Advantage__Plan:YC1__Rx:31M",
                    "Alliance__Plan:YL1__Rx:31M",
                    "Focus__Plan:U5C__Rx:31M");
        
        assertThat(parser.getTier()).isEqualTo(3);

        UHCNetwork option1 = mpeSheet.get("Signature__Plan:Y6R__Rx:31M");
        assertThat(option1.getNetworksDetails()).hasSize(19);
        assertThat(option1.getNetworksDetailsRx()).hasSize(10);
        assertThat(option1.getNetworksDetailsRider()).hasSize(0);
        assertThat(option1.getOption().getCurrentPlanName()).isEqualTo("Y6R");
        
        assertThat(option1.getOption().getTier1CurrentRate()).isEqualTo("490.42");
        assertThat(option1.getOption().getTier2CurrentRate()).isEqualTo("1034.79");
        assertThat(option1.getOption().getTier3CurrentRate()).isEqualTo("1481.07");
        assertThat(option1.getOption().getTier4CurrentRate()).isNull();
    }    

    
    @Test
    @Ignore // broken - current plan name "PPO" is not in MPE tab
    public void testParsingRenewalPPOTier3() throws Exception {
        
        UHCMedicalQuoteParser parser = new UHCMedicalQuoteParser();
        String quoteFile = Paths.get("").toAbsolutePath().toString()
                + "/data/renewal_quotes/Medical/PPO Tier 3 example 2.xlsm";
        List<LinkedHashMap<String, UHCNetwork>> parseResult = parser.parseMedicalQuotes(new FileInputStream(quoteFile), benefitNameRepository.findAll(), true);

        assertThat(parseResult).hasSize(1);
        
        LinkedHashMap<String, UHCNetwork> mpeSheet = parseResult.get(0);
               
        UHCNetwork option1 = mpeSheet.get("Select Plus__Rx:C2-E");
        
        assertThat(option1).isNotNull();
        assertThat(option1.getNetworksDetails()).hasSize(35);
        assertThat(option1.getNetworksDetailsRx()).hasSize(1);
        assertThat(option1.getOption().getCurrentPlanName()).isEqualTo("PPO");
        
        UHCNetworkDetails currentPlan = option1.getNetworksDetails().stream()
                .filter(p -> p.getShortPlanName().equals(option1.getOption().getCurrentPlanName()))
                .findFirst()
                .orElse(null);
        
        assertThat(currentPlan).isNotNull();        
        assertThat(currentPlan.getGenericPlanDetails().getBenefits()).isNotEmpty();
        
        assertThat(option1.getOption().getTier1Census()).isEqualTo("13");
        assertThat(option1.getOption().getTier2Census()).isEqualTo("4");
        assertThat(option1.getOption().getTier3Census()).isEqualTo("3");
        assertThat(option1.getOption().getTier4Census()).isNull();

        assertThat(option1.getOption().getTier1CurrentRate()).isEqualTo("582.27");
        assertThat(option1.getOption().getTier2CurrentRate()).isEqualTo("1288.59");
        assertThat(option1.getOption().getTier3CurrentRate()).isEqualTo("1758.46");
        assertThat(option1.getOption().getTier4CurrentRate()).isNull();

        assertThat(currentPlan.getTier1Rate()).isEqualTo("639.91");
        assertThat(currentPlan.getTier2Rate()).isEqualTo("1416.15");
        assertThat(currentPlan.getTier3Rate()).isEqualTo("1932.53");
        assertThat(currentPlan.getTier4Rate()).isEqualTo("0");

    }

    @Test
    public void testParsingRenewalHSATier4() throws Exception {
        
        UHCMedicalQuoteParser parser = new UHCMedicalQuoteParser();
        String quoteFile = Paths.get("").toAbsolutePath().toString()
                + "/data/renewal_quotes/Medical/PPO  HSA Tier 4  Example.xlsm";
        List<LinkedHashMap<String, UHCNetwork>> parseResult = parser.parseMedicalQuotes(new FileInputStream(quoteFile), benefitNameRepository.findAll(), true);

        assertThat(parseResult).hasSize(2);
        
        LinkedHashMap<String, UHCNetwork> mpeSheet = parseResult.get(0);
        
        assertThat(mpeSheet.keySet())
            .hasSize(2)
            .containsExactly("Select Plus__Rx:241-X", "Select__Rx:245-X");

        LinkedHashMap<String, UHCNetwork> mpeHsaSheet = parseResult.get(1);
        
        assertThat(mpeHsaSheet.keySet())
            .hasSize(1)
            .containsExactly("Select Plus HSA__Rx:C2-HSA-X");

        
        UHCNetwork option1 = mpeSheet.get("Select Plus__Rx:241-X");
        assertThat(option1.getNetworksDetails()).hasSize(35);
        assertThat(option1.getNetworksDetailsRx()).hasSize(1);
        assertThat(option1.getOption().getCurrentPlanName()).isEqualTo("AKLV");
        
        UHCNetworkDetails currentPlan = option1.getNetworksDetails().stream()
                .filter(p -> p.getShortPlanName().equals(option1.getOption().getCurrentPlanName()))
                .findFirst()
                .orElse(null);
        
        assertThat(currentPlan).isNotNull();        
        assertThat(currentPlan.getGenericPlanDetails().getBenefits()).isNotEmpty();
        
        for (Benefit ben : currentPlan.getGenericPlanDetails().getBenefits()) {
            if (ben.getBenefitName().getName().equals("PCP")) {
                assertThat(ben.getValue()).isEqualTo("20");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("SPECIALIST")) {
                assertThat(ben.getValue()).isEqualTo("20");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("OUTPATIENT_SURGERY")) {
                assertThat(ben.getValue()).isEqualTo("N/A");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("IP_PER_OCCURENCE_DEDUCTIBLE")) {
                assertThat(ben.getValue()).isEqualTo("100");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("INPATIENT_HOSPITAL")) {
                assertThat(ben.getValue()).isEqualTo("80% after deductible");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("URGENT_CARE")) {
                assertThat(ben.getValue()).isEqualTo("20");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("EMERGENCY_ROOM")) {
                assertThat(ben.getValue()).isEqualTo("100");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("INDIVIDUAL_DEDUCTIBLE") && "IN".equals(ben.getInOutNetwork())) {
                assertThat(ben.getValue()).isEqualTo("500");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("FAMILY_DEDUCTIBLE") && "IN".equals(ben.getInOutNetwork())) {
                assertThat(ben.getValue()).isEqualTo("1000");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("DEDUCTIBLE_TYPE")) {
                assertThat(ben.getValue()).isEqualTo("Emb");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("CO_INSURANCE") && "IN".equals(ben.getInOutNetwork())) {
                assertThat(ben.getValue()).isEqualTo("80");
                assertThat(ben.getFormat()).isEqualTo("PERCENT");
            } else if (ben.getBenefitName().getName().equals("INDIVIDUAL_OOP_LIMIT") && "IN".equals(ben.getInOutNetwork())) {
                assertThat(ben.getValue()).isEqualTo("2500");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("FAMILY_OOP_LIMIT") && "IN".equals(ben.getInOutNetwork())) {
                assertThat(ben.getValue()).isEqualTo("5000");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("INDIVIDUAL_DEDUCTIBLE") && "OUT".equals(ben.getInOutNetwork())) {
                assertThat(ben.getValue()).isEqualTo("1000");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("FAMILY_DEDUCTIBLE") && "OUT".equals(ben.getInOutNetwork())) {
                assertThat(ben.getValue()).isEqualTo("2000");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("CO_INSURANCE") && "OUT".equals(ben.getInOutNetwork())) {
                assertThat(ben.getValue()).isEqualTo("60");
                assertThat(ben.getFormat()).isEqualTo("PERCENT");
            } else if (ben.getBenefitName().getName().equals("INDIVIDUAL_OOP_LIMIT") && "OUT".equals(ben.getInOutNetwork())) {
                assertThat(ben.getValue()).isEqualTo("5000");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("FAMILY_OOP_LIMIT") && "OUT".equals(ben.getInOutNetwork())) {
                assertThat(ben.getValue()).isEqualTo("10000");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else {
                fail("Unknown benefit: " + ben.getBenefitName().getName());
            }

        }
        
        UHCNetwork option2 = mpeSheet.get("Select__Rx:245-X");
        assertThat(option2.getNetworksDetails()).hasSize(35);
        assertThat(option2.getNetworksDetailsRx()).hasSize(1);
        assertThat(option2.getOption().getCurrentPlanName()).isEqualTo("PVK");

        
        UHCNetwork option3 = mpeHsaSheet.get("Select Plus HSA__Rx:C2-HSA-X");
        assertThat(option3.getNetworksDetails()).hasSize(20);
        assertThat(option3.getNetworksDetailsRx()).hasSize(1);
        assertThat(option3.getOption().getCurrentPlanName()).isEqualTo("AOO8");


    }
    

     

}
