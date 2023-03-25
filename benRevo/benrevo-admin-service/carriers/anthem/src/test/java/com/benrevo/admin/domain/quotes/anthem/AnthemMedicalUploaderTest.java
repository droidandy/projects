package com.benrevo.admin.domain.quotes.anthem;

import static com.benrevo.common.Constants.ANTHEM_DISCLAIMER;
import static org.springframework.web.util.HtmlUtils.htmlEscape;
import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.quotes.TestValidator;
import com.benrevo.be.modules.admin.domain.quotes.UploaderTestCase;
import com.benrevo.be.modules.admin.domain.quotes.parsers.anthem.AnthemQuoteUploader;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpSubmission;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;

/**
 * Created by lemdy on 6/8/17.
 */
public class AnthemMedicalUploaderTest extends AdminAbstractControllerTest {

    private static final Logger logger = LoggerFactory.getLogger(AnthemMedicalUploaderTest.class);
    private final Long BROKERAGE_ID = 1L;
    private final Long CARRIER_ANTHEM_ID = 3L;

    private String currDir;

    @Autowired
    private AnthemQuoteUploader loader;

    @Autowired
    private TestValidator validator;

    @Before
    public void setup() {
        logger.info("setup()");
        currDir = Paths.get("").toAbsolutePath().toString();

        validator.setBrokerId(BROKERAGE_ID);
        validator.setCarrierId(CARRIER_ANTHEM_ID);
        validator.setLoader(loader);
    }

    @Test
    public void testAllTierRates() throws Exception {
        String[] files = new String[]{
            "Pool Rating Project (Proposed State) - Manuals_Rev6_Excel Version_2Tier.xls",
            "Pool Rating Project (Proposed State) - Manuals_Rev6_Excel Version_4Tier.xls",
            "Pool Rating Project (Proposed State) - Manuals_Rev6_Excel Version_3Tier.xls"
        };

        for(String file  : files){
            int tier = 4;
            if(file.contains("4")) tier = 4;
            else if(file.contains("3")) tier = 3;
            else if(file.contains("2")) tier = 2;
            else if(file.contains("CompositeRate")) tier = 1;

            UploaderTestCase testCase = new UploaderTestCase();
            testCase.setCategory(Constants.MEDICAL);
            testCase.setTier(tier);
            testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/" + file);

            validator.uploadAndValidateTier(testCase) ;
        }
    }

    // Commented out due to duplicate networks in different rate descriptions
    @Test
    public void testAnthemNetworkCombinations() throws Exception {

        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.MEDICAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/Pool Rating Project (Proposed State) - Manuals_Rev6_Excel Version_4Tier.xls");
        RfpQuote quote = validator.uploadAndGetQuote(testCase);

        Map<String, List<RfpQuoteNetwork>> map = quote.getRfpQuoteNetworks().stream()
        		.filter(n -> n.getRfpQuoteNetworkCombination() != null)
        		.collect(Collectors.groupingBy(n -> n.getRfpQuoteNetworkCombination().getName()));

        Assert.assertEquals(map.size(), 11);
        Assert.assertEquals(map.get("Dual (Priority Select / Traditional)").size(), 2);
        Assert.assertEquals(map.get("Dual (Select / Traditional)").size(), 2);
        Assert.assertEquals(map.get("Dual (Select / Vivity)").size(), 2);
        Assert.assertEquals(map.get("Dual (Traditional / Vivity)").get(0).getRfpQuoteNetworkCombination().getNetworkCount(), 2);
        Assert.assertEquals(map.get("Single (Priority Select, Select, Traditional, Vivity)").size(), 4);
        Assert.assertEquals(map.get("Single (Priority Select, Select, Traditional, Vivity)").get(0).getRfpQuoteNetworkCombination().getNetworkCount(), 1);
        Assert.assertEquals(map.get("Dual (Priority Select / Vivity)").size(), 2);
        Assert.assertEquals(map.get("Dual (Priority Select / Select)").size(), 2);
        
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/Majestic Vacations.xls");
        quote = validator.uploadAndGetQuote(testCase);

        Assert.assertEquals(quote.getDisclaimer(), htmlEscape(ANTHEM_DISCLAIMER));
        
        map = quote.getRfpQuoteNetworks().stream()
        		.filter(n -> n.getRfpQuoteNetworkCombination() != null)
        		.collect(Collectors.groupingBy(n -> n.getRfpQuoteNetworkCombination().getName()));
        
        Assert.assertEquals(map.size(), 11);
        Assert.assertEquals(map.get("Dual (Priority Select / Traditional)").size(), 2);
        Assert.assertEquals(map.get("Dual (Select / Traditional)").size(), 2);
        Assert.assertEquals(map.get("Dual (Select / Vivity)").size(), 2);
        Assert.assertEquals(map.get("Dual (Traditional / Vivity)").size(), 2);
        Assert.assertEquals(map.get("Single (Priority Select, Select, Traditional, Vivity)").size(), 4);
        Assert.assertEquals(map.get("Dual (Priority Select / Vivity)").size(), 2);
        Assert.assertEquals(map.get("Dual (Priority Select / Select)").size(), 2);
        Assert.assertEquals(map.get("HIGH-LOW HMO (Traditional / Traditional)").size(), 1);
    }
    
    @Test
    public void testAnthemPremierNonPremierNetworkCombinations() throws Exception {
        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.MEDICAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/Lytton Rancheria (San Diego).xls");
        RfpQuote quote = validator.uploadAndGetQuote(testCase);

        RfpQuoteNetwork highLowPpoNonPremierNetwork = getRfpQuoteNetworkUsingQuoteOptionName(quote, "HIGH-LOW PPO (non-Premier)");
        RfpQuoteNetwork highLowPpoPremierNetwork = getRfpQuoteNetworkUsingQuoteOptionName(quote, "HIGH-LOW PPO (Premier)");

        Assert.assertNotNull(highLowPpoNonPremierNetwork);
        Assert.assertEquals(highLowPpoNonPremierNetwork.getNetwork().getName(), "PPO");
        Assert.assertEquals(highLowPpoNonPremierNetwork.getRfpQuoteNetworkCombination().getNetworkCount(), 2);

        Assert.assertNotNull(highLowPpoPremierNetwork);
        Assert.assertEquals(highLowPpoPremierNetwork.getNetwork().getName(), "PPO");
        Assert.assertEquals(highLowPpoPremierNetwork.getRfpQuoteNetworkCombination().getNetworkCount(), 2);
    }

    private void assertRatesAreNotZero(RfpQuote quote){
        boolean isZero = true;
        for(RfpQuoteNetwork network : quote.getRfpQuoteNetworks()){
            for(RfpQuoteNetworkPlan plan : network.getRfpQuoteNetworkPlans()){
                if(plan.getTier1Rate() != 0 || plan.getTier2Rate() != 0 || plan.getTier3Rate() != 0 || plan.getTier4Rate() != 0){
                    isZero = false;
                }
            }
        }
        Assert.assertFalse(isZero);
    }

    @Test
    public void testAnthemVisionTierRates() throws Exception {
        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.VISION);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/Vision/Pool Rating Project (Proposed State) - Manuals_Rev6_Excel Version_2Tier.xls");
        RfpQuote quote = validator.uploadAndGetQuote(testCase);
        Assert.assertEquals(quote.getRatingTiers().intValue(), 2);
        assertRatesAreNotZero(quote);

        testCase = new UploaderTestCase();
        testCase.setCategory(Constants.VISION);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/Vision/Pool Rating Project (Proposed State) - Manuals_Rev6_Excel Version_3Tier.xls");
        quote = validator.uploadAndGetQuote(testCase);
        Assert.assertEquals(quote.getRatingTiers().intValue(), 3);
        assertRatesAreNotZero(quote);

        testCase = new UploaderTestCase();
        testCase.setCategory(Constants.VISION);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/Vision/Kayne Anderson Capital Advisors, LP_P_0118_Vision.xls");
        quote = validator.uploadAndGetQuote(testCase);
        Assert.assertEquals(quote.getRatingTiers().intValue(), 4);
        assertRatesAreNotZero(quote);

        testCase = new UploaderTestCase();
        testCase.setCategory(Constants.VISION);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/Vision/Kayne Anderson Capital Advisors, LP_P_0118_Vision.xls");
        quote = validator.uploadAndGetQuote(testCase);
        Assert.assertEquals(quote.getRatingTiers().intValue(), 4);
        assertRatesAreNotZero(quote);
    }

    @Test
    public void testAnthem_Single_Networks_VivityEligible() throws Exception {
        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.MEDICAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/El Clasificado_single_netwokr_vivity_all_eligible.xls");
        RfpQuote quote = validator.uploadAndGetQuote(testCase);
        Assert.assertEquals(quote.getRfpQuoteNetworks().size(), 23);

        for(RfpQuoteNetwork network : quote.getRfpQuoteNetworks()){
            if(network.getRfpQuoteOptionName().equalsIgnoreCase("Dual_Vivity Network_Priority Select Network")){
                RfpQuoteNetworkPlan plan1 = network.getRfpQuoteNetworkPlans().get(0);

                Assert.assertEquals(plan1.getTier1Rate(), 437.39f);
                Assert.assertEquals(plan1.getTier2Rate(), 962.26f);
                Assert.assertEquals(plan1.getTier3Rate(), 787.31f);
                Assert.assertEquals(plan1.getTier4Rate(), 1355.92f);
            }

            if(network.getRfpQuoteOptionName().equalsIgnoreCase("Dual_Priority Select Network_Vivity Network")){
                RfpQuoteNetworkPlan plan1 = network.getRfpQuoteNetworkPlans().get(0);

                Assert.assertEquals(plan1.getTier1Rate(), 400.12f);
                Assert.assertEquals(plan1.getTier2Rate(), 880.27f);
                Assert.assertEquals(plan1.getTier3Rate(), 720.22f);
                Assert.assertEquals(plan1.getTier4Rate(), 1240.37f);
            }
        }
    }

    @Test
    public void testAnthemTraditionalAllEligibleAndVivityEligible() throws Exception {
        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.MEDICAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/Majestic Vacations.xls");
        RfpQuote quote = validator.uploadAndGetQuote(testCase);
        Assert.assertNotEquals(quote.getRfpQuoteNetworks().size(), 26);
        Assert.assertEquals(quote.getRfpQuoteNetworks().size(), 23);

        for(RfpQuoteNetwork network : quote.getRfpQuoteNetworks()){
            if(network.getRfpQuoteOptionName().equalsIgnoreCase("Dual_Vivity Network_Priority Select Network")){
                RfpQuoteNetworkPlan plan1 = network.getRfpQuoteNetworkPlans().get(0);

                Assert.assertEquals(plan1.getTier1Rate(), 730.58f);
                Assert.assertEquals(plan1.getTier2Rate(), 1607.27f);
                Assert.assertEquals(plan1.getTier3Rate(), 1315.04f);
                Assert.assertEquals(plan1.getTier4Rate(), 2264.79f);
            }

            if(network.getRfpQuoteOptionName().equalsIgnoreCase("Dual_Priority Select Network_Vivity Network")){
                RfpQuoteNetworkPlan plan1 = network.getRfpQuoteNetworkPlans().get(0);

                Assert.assertEquals(plan1.getTier1Rate(), 780.03f);
                Assert.assertEquals(plan1.getTier2Rate(), 1716.07f);
                Assert.assertEquals(plan1.getTier3Rate(), 1404.05f);
                Assert.assertEquals(plan1.getTier4Rate(), 2418.09f);
            }
        }
    }

    /**
     * Test to fix the vivity casing issue. Sample quote file has highlights
     * @throws Exception
     */
    @Test
    public void testAnthemTraditionalAllEligibleAndVivityEligible_CasingIssue() throws Exception {
        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.MEDICAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/LBA Realty LLC_P_06-18_BenRevo_RB_VivityUpperCaseIssue.xls");
        RfpQuote quote = validator.uploadAndGetQuote(testCase);
        Assert.assertEquals(quote.getRfpQuoteNetworks().size(), 25);
    }

    private RfpQuoteNetwork getRfpQuoteNetworkUsingQuoteOptionName(RfpQuote quote, String quoteOptionName){
        RfpQuoteNetwork result = null;
        for(RfpQuoteNetwork network : quote.getRfpQuoteNetworks()){
            if(network.getRfpQuoteOptionName().equalsIgnoreCase(quoteOptionName)){
                result = network;
                break;
            }
        }
        return result;
    }

    @Test
    public void testAnthemSingleHiLowHMO() throws Exception {
        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.MEDICAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/PROPERTY WEST_P_1217_RepKaiser_RB_BenRevo.xls");
        RfpQuote quote = validator.uploadAndGetQuote(testCase);

        RfpQuoteNetwork hiLowSingleNetwork = getRfpQuoteNetworkUsingQuoteOptionName(quote, "HIGH-LOW SINGLE HMO NETWORK (Select)");
        Assert.assertNotNull(hiLowSingleNetwork);
        Assert.assertEquals(hiLowSingleNetwork.getRfpQuoteNetworkCombination().getNetworkCount(), 2);

        RfpQuoteNetwork hiLowPriorityNetwork = getRfpQuoteNetworkUsingQuoteOptionName(quote, "HIGH-LOW SINGLE HMO NETWORK (Priority)");
        Assert.assertNotNull(hiLowPriorityNetwork);
        Assert.assertEquals(hiLowPriorityNetwork.getRfpQuoteNetworkCombination().getNetworkCount(), 2);

        testCase = new UploaderTestCase();
        testCase.setCategory(Constants.MEDICAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/Majestic Vacations.xls");
        quote = validator.uploadAndGetQuote(testCase);

        RfpQuoteNetwork hiLowTraditionalNetwork = getRfpQuoteNetworkUsingQuoteOptionName(quote, "HIGH-LOW SINGLE HMO NETWORK (Traditional)");
        Assert.assertNotNull(hiLowTraditionalNetwork);
        Assert.assertEquals(hiLowTraditionalNetwork.getRfpQuoteNetworkCombination().getNetworkCount(), 2);
    }

    @Test
    public void testAnthemWithKaiser() throws Exception {

        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(
                Constants.ANTHEM_CARRIER,
                Constants.ANTHEM_CARRIER
        );
        RfpCarrier rfpMedicalCarrier = testEntityHelper.createTestRfpCarrier(
            carrier,
            Constants.MEDICAL
        );
        RfpSubmission rfpMedicalSubmission = testEntityHelper.createTestRfpSubmission(
            client,
            rfpMedicalCarrier
        );
        testEntityHelper.buildTestRfpQuoteVersion(rfpMedicalSubmission);


        testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");

        testEntityHelper.createTestClientPlan("hmo1 kaiser client plan", client, "KAISER", "HMO", "Kaiser HMO");
        testEntityHelper.createTestClientPlan("hmo2 kaiser client plan", client, "KAISER", "HMO", "Kaiser HMO");
        testEntityHelper.createTestClientPlan("hmo3 kaiser client plan", client, "KAISER", "HMO", "Kaiser HMO");

        testEntityHelper.createTestClientPlan("ppo1 kaiser client plan", client, "KAISER", "PPO", "Kaiser PPO");
        testEntityHelper.createTestClientPlan("ppo2 kaiser client plan", client, "KAISER", "PPO", "Kaiser PPO");

        testEntityHelper.createTestClientPlan("hsa1 kaiser client plan", client, "KAISER", "HSA", "Kaiser HSA");

        Long brokerId = client.getBroker().getBrokerId();
        
        FileInputStream fis = new FileInputStream(new File(currDir + 
                "/data/quotes/Anthem/2018SampleQuotes/PROPERTY WEST_P_1217_RepKaiser_RB_BenRevo.xls"));
        loader.resetPlanStatistics();
        RfpQuote quote = loader.run(fis, Collections.emptyList(), client.getClientId(), 
                brokerId, QuoteType.KAISER, Constants.MEDICAL, false, true);
        
        Assert.assertNotNull(quote);
        Assert.assertTrue(null != quote.getRfpQuoteId() && quote.getRfpQuoteId() > 0);

        List<RfpQuoteNetwork> hmos = new ArrayList<>();
        List<RfpQuoteNetwork> hsas = new ArrayList<>();
        List<RfpQuoteNetwork> ppos = new ArrayList<>();
        for(RfpQuoteNetwork network : quote.getRfpQuoteNetworks()){
            if("Kaiser HMO".equals(network.getRfpQuoteOptionName())){
                hmos.add(network);
            } else if("Kaiser HSA".equals(network.getRfpQuoteOptionName())){
                hsas.add(network);
            } else if("Kaiser PPO".equals(network.getRfpQuoteOptionName())){
                ppos.add(network);
            }
        }

        assertThat(hmos).hasSize(1);
        assertThat(hsas).hasSize(1);
        assertThat(ppos).hasSize(1);

        assertThat(hmos.get(0).getRfpQuoteNetworkPlans()).hasSize(3);
        assertThat(ppos.get(0).getRfpQuoteNetworkPlans()).hasSize(2);
        assertThat(hsas.get(0).getRfpQuoteNetworkPlans()).hasSize(1);
        
    }

    
    @Test
    public void testAnthemHiLowCreationFromSingles() throws Exception {
        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.MEDICAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/Majestic Vacations.xls");
        RfpQuote quote = validator.uploadAndGetQuote(testCase);

        RfpQuoteNetwork hiLowSingleNetwork = getRfpQuoteNetworkUsingQuoteOptionName(quote, "HIGH-LOW SINGLE HMO NETWORK (Select)");
        Assert.assertNotNull(hiLowSingleNetwork);
        Assert.assertEquals(hiLowSingleNetwork.getRfpQuoteNetworkCombination().getNetworkCount(), 2);

        RfpQuoteNetwork hiLowPriorityNetwork = getRfpQuoteNetworkUsingQuoteOptionName(quote, "HIGH-LOW SINGLE HMO NETWORK (Priority Select)");
        Assert.assertNotNull(hiLowPriorityNetwork);
        Assert.assertEquals(hiLowPriorityNetwork.getRfpQuoteNetworkCombination().getNetworkCount(), 2);

        RfpQuoteNetwork hiLowVivityNetwork = getRfpQuoteNetworkUsingQuoteOptionName(quote, "HIGH-LOW SINGLE HMO NETWORK (Vivity)");
        Assert.assertNotNull(hiLowVivityNetwork);
        Assert.assertEquals(hiLowVivityNetwork.getRfpQuoteNetworkCombination().getNetworkCount(), 2);

        RfpQuoteNetwork hiLowTraditionalNetwork = getRfpQuoteNetworkUsingQuoteOptionName(quote, "HIGH-LOW SINGLE HMO NETWORK (Traditional)");
        Assert.assertNotNull(hiLowTraditionalNetwork);
        Assert.assertEquals(hiLowTraditionalNetwork.getRfpQuoteNetworkCombination().getNetworkCount(), 2);
    }

    @Test
    @Ignore
    public void testFindMissingAnthemPlans() throws Exception {

        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.MEDICAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/Pool Rating Project (Proposed State) - Manuals_Rev6_Excel Version.xls");
        //testCase.setRfpQuoteOptions(Arrays.asList("Premier HMO - Traditional Network"));
        testCase.addNumPlansPerOption("SINGLE HMO NETWORK (Traditional, Select, Vivity, Priority Select)", 4);

        // Sampling of plans to be spot-checked
        testCase.addPlanInfo("Premier HMO - Traditional Network", "T-Premier HMO 10/100%", true, 775.82f, 1629.22f, 2327.46f, 0f);
        //testCase.addPlanInfo("Select Plus__Rx:0B", "AOPQ", false, 373.79f, 822.34f, 672.82f, 1158.72f);
        //testCase.addPlanInfo("Select Plus__Rx:0B", "AOPR", false, 368.65f, 811.03f, 663.57f, 1142.79f);

        validator.findMissingPlans(testCase) ;
    }

    @Test(expected = BaseException.class)
    public void testMedical_TierRateValidation_PostProcessing() throws Exception {
        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.MEDICAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/Desert Aids Project_4Tier_PlanMissingTier4Rate.XLS");

        RfpQuote quote = validator.uploadAndGetQuote(testCase);
    }
}
