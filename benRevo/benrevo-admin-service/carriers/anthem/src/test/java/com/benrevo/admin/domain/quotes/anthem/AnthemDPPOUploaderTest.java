package com.benrevo.admin.domain.quotes.anthem;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.quotes.TestValidator;
import com.benrevo.be.modules.admin.domain.quotes.UploaderTestCase;
import com.benrevo.be.modules.admin.domain.quotes.parsers.anthem.AnthemQuoteUploader;
import com.benrevo.common.Constants;
import com.benrevo.common.exception.ValidationException;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.BenefitRepository;

import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.testng.Assert;

import static com.benrevo.common.Constants.ANTHEM_DISCLAIMER;
import static com.benrevo.common.Constants.ANTHEM_WITH_DPPO_DISCLAIMER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.fail;
import static org.springframework.web.util.HtmlUtils.htmlEscape;

/**
 * Created by akorchak on 8/18/17.
 */
public class AnthemDPPOUploaderTest extends AdminAbstractControllerTest {

    private static final Logger logger = LoggerFactory.getLogger(AnthemDPPOUploaderTest.class);
    private final Long BROKERAGE_ID = 1L;
    private final Long CARRIER_ANTHEM_ID = 3L;

    private String currDir;

    @Autowired
    @Lazy
    private AnthemQuoteUploader loader;

    @Autowired
    private TestValidator validator;
    
    @Autowired
    private BenefitRepository benefitRepository;
    
    @Autowired
    private AttributeRepository attributeRepository;

    @Before
    public void setup() {
        logger.info("setup()");
        currDir = Paths.get("").toAbsolutePath().toString();

        validator.setBrokerId(BROKERAGE_ID);
        validator.setCarrierId(CARRIER_ANTHEM_ID);
        validator.setLoader(loader);
    }

    @Test
    public void test_addSupportForNoLimitFamilyDeductible() throws Exception {

        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.DENTAL);
        testCase.setQuoteFilename2List(
            Arrays.asList(currDir + "/data/quotes/Anthem/Dental/Add_support_for_no_limit_family_deductible.xlsx"));

        RfpQuote quote = validator.uploadAndGetQuote(testCase);

        Assert.assertEquals(quote.getDisclaimer(), htmlEscape(ANTHEM_WITH_DPPO_DISCLAIMER));
        Assert.assertEquals(quote.getRfpQuoteNetworks().size(), 1);
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName(),
            "DPPO Network");
        Assert
            .assertEquals(quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().size(), 11);

        RfpQuoteNetworkPlan netwrokPlan = quote.getRfpQuoteNetworks().get(0)
            .getRfpQuoteNetworkPlans().get(0);
        Assert.assertEquals(netwrokPlan.getPnn().getName(), "BenRevo Test Case");
        assertThat(netwrokPlan.getTier1Rate()).isEqualTo(43.05f);
        assertThat(netwrokPlan.getTier2Rate()).isEqualTo(87.82f);
        assertThat(netwrokPlan.getTier3Rate()).isEqualTo(108.95f);
        assertThat(netwrokPlan.getTier4Rate()).isEqualTo(162.19f);
        assertThat(netwrokPlan.isVoluntary()).isTrue();

        List<Benefit> benefits = benefitRepository
            .findByPlanId(netwrokPlan.getPnn().getPlan().getPlanId());
        assertThat(benefits).hasSize(22);
        for (Benefit ben : benefits) {
            if (ben.getBenefitName().getName().equals("DENTAL_FAMILY")) {
                assertThat(ben.getValue()).isEqualTo("No Limit");
                assertThat(ben.getFormat()).isEqualTo("STRING");
                break;
            }
        }
    }

    @Test
    public void testDPPOOnly() throws Exception {

        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.DENTAL);
        testCase.setQuoteFilename2List(Arrays.asList(currDir + "/data/quotes/Anthem/Dental/BenRevo Test Case_4 Tier.xlsx"));

        Broker broker = testEntityHelper.createTestBroker();
        Client client = testEntityHelper.createTestClient("Test DPPOOnly", broker);
        
        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        c.add(Calendar.YEAR, -2);
        client.setEffectiveDate(c.getTime());

        RfpQuote quote = validator.uploadAndGetQuote(testCase, client);

        Assert.assertEquals(quote.getDisclaimer(), htmlEscape(ANTHEM_WITH_DPPO_DISCLAIMER));
        Assert.assertEquals(quote.getRfpQuoteNetworks().size(), 1);
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName(), "DPPO Network");
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().size(), 11);
        
        RfpQuoteNetworkPlan netwrokPlan = quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().get(0);
        Assert.assertEquals(netwrokPlan.getPnn().getName(), "BenRevo Test Case");
        assertThat(netwrokPlan.getTier1Rate()).isEqualTo(43.05f);
        assertThat(netwrokPlan.getTier2Rate()).isEqualTo(87.82f);
        assertThat(netwrokPlan.getTier3Rate()).isEqualTo(108.95f);
        assertThat(netwrokPlan.getTier4Rate()).isEqualTo(162.19f);
        assertThat(netwrokPlan.isVoluntary()).isTrue();
        
        assertThat(netwrokPlan.getPnn().getPlan().getPlanYear()).isEqualTo(Integer.valueOf(client.getEffectiveYear()));
        
        List<Benefit> benefits = benefitRepository.findByPlanId(netwrokPlan.getPnn().getPlan().getPlanId());
        assertThat(benefits).hasSize(22);
        for (Benefit ben : benefits) {
            if (ben.getBenefitName().getName().equals("DENTAL_INDIVIDUAL")) {
                // both IN and OUT
                assertThat(ben.getValue()).isEqualTo("50");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("DENTAL_FAMILY")) {
                assertThat(ben.getValue()).isEqualTo("150");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("WAIVED_FOR_PREVENTIVE")) {
                assertThat(ben.getValue()).isEqualTo("Yes");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("CALENDAR_YEAR_MAXIMUM")) {
                assertThat(ben.getValue()).isEqualTo("1500");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("CLASS_1_PREVENTIVE")) {
                assertThat(ben.getValue()).isEqualTo("100");
                assertThat(ben.getFormat()).isEqualTo("PERCENT");
            } else if (ben.getBenefitName().getName().equals("CLASS_2_BASIC")) {
                assertThat(ben.getValue()).isEqualTo("80");
                assertThat(ben.getFormat()).isEqualTo("PERCENT");
            } else if (ben.getBenefitName().getName().equals("CLASS_3_MAJOR")) {
                assertThat(ben.getValue()).isEqualTo("50");
                assertThat(ben.getFormat()).isEqualTo("PERCENT");
            } else if (ben.getBenefitName().getName().equals("CLASS_4_ORTHODONTIA")) {
                assertThat(ben.getValue()).isEqualTo("50");
                assertThat(ben.getFormat()).isEqualTo("PERCENT");
            } else if (ben.getBenefitName().getName().equals("ORTHODONTIA_LIFETIME_MAX")) {
                assertThat(ben.getValue()).isEqualTo("1500");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("ORTHO_ELIGIBILITY")) {
                assertThat(ben.getValue()).isEqualTo("Dependent Children Only");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("IMPLANT_COVERAGE")) {
                assertThat(ben.getValue()).isEqualTo("Not Covered");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("REIMBURSEMENT_SCHEDULE")) {
                assertThat(ben.getValue()).isEqualTo("90th percentile");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else {
                fail("Unknown benefit: " + ben.getBenefitName().getName());
            }
        }

    
        netwrokPlan = quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().get(4);
        Assert.assertEquals(netwrokPlan.getPnn().getName(), "BenRevo Test Case - 4");
        assertThat(netwrokPlan.getTier1Rate()).isEqualTo(34.30f);
        assertThat(netwrokPlan.getTier2Rate()).isEqualTo(69.98f);
        assertThat(netwrokPlan.getTier3Rate()).isEqualTo(86.81f);
        assertThat(netwrokPlan.getTier4Rate()).isEqualTo(129.24f);
        assertThat(netwrokPlan.isVoluntary()).isTrue();
        
        benefits = benefitRepository.findByPlanId(netwrokPlan.getPnn().getPlan().getPlanId());
        assertThat(benefits).hasSize(22);
        for (Benefit ben : benefits) {
            if (ben.getBenefitName().getName().equals("DENTAL_INDIVIDUAL")) {
                // both IN and OUT
                assertThat(ben.getValue()).isEqualTo("50");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("DENTAL_FAMILY")) {
                assertThat(ben.getValue()).isEqualTo("150");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("WAIVED_FOR_PREVENTIVE")) {
                assertThat(ben.getValue()).isEqualTo("N/A");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("CALENDAR_YEAR_MAXIMUM")) {
                assertThat(ben.getValue()).isEqualTo("1000");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("CLASS_1_PREVENTIVE")) {
                if (ben.getInOutNetwork().equals("IN")) {
                    assertThat(ben.getValue()).isEqualTo("100");
                    assertThat(ben.getFormat()).isEqualTo("PERCENT");
                } else {
                    assertThat(ben.getValue()).isEqualTo("80");
                    assertThat(ben.getFormat()).isEqualTo("PERCENT");
                }
            } else if (ben.getBenefitName().getName().equals("CLASS_2_BASIC")) {
                if (ben.getInOutNetwork().equals("IN")) {
                    assertThat(ben.getValue()).isEqualTo("80");
                    assertThat(ben.getFormat()).isEqualTo("PERCENT");
                } else {
                    assertThat(ben.getValue()).isEqualTo("60");
                    assertThat(ben.getFormat()).isEqualTo("PERCENT");
                }
            } else if (ben.getBenefitName().getName().equals("CLASS_3_MAJOR")) {
                assertThat(ben.getValue()).isEqualTo("50");
                assertThat(ben.getFormat()).isEqualTo("PERCENT");
            } else if (ben.getBenefitName().getName().equals("CLASS_4_ORTHODONTIA")) {
                assertThat(ben.getValue()).isEqualTo("50");
                assertThat(ben.getFormat()).isEqualTo("PERCENT");
            } else if (ben.getBenefitName().getName().equals("ORTHODONTIA_LIFETIME_MAX")) {
                assertThat(ben.getValue()).isEqualTo("1000");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("ORTHO_ELIGIBILITY")) {
                assertThat(ben.getValue()).isEqualTo("Child");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("IMPLANT_COVERAGE")) {
                assertThat(ben.getValue()).isEqualTo("Not Covered");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("REIMBURSEMENT_SCHEDULE")) {
                assertThat(ben.getValue()).isEqualTo("90th percentile");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else {
                fail("Unknown benefit: " + ben.getBenefitName().getName());
            }
        }
        
        List<QuotePlanAttribute> attrs = attributeRepository.findQuotePlanAttributeByRqnpId(netwrokPlan.getRfpQuoteNetworkPlanId());
        assertThat(attrs).hasSize(2);
        for (QuotePlanAttribute attr : attrs) {
            switch(attr.getName()) {
                case CONTRACT_LENGTH:
                    assertThat(attr.getValue()).isEqualTo("12 Months");
                    break;
                case PROGRAM:
                    assertThat(attr.getValue()).isEqualTo("Complete");
                    break;
                default:
                    fail("Unexpected QuotePlanAttribute: " + attr.getName());
                    break;
            }
        }
    }

    @Test
    public void testDHMOOnly() throws Exception {

        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.DENTAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/Pool Rating Project (Proposed State) - Manuals_Rev6_Excel Version_4Tier.xls");

        RfpQuote quote = validator.uploadAndGetQuote(testCase);

        Assert.assertEquals(quote.getDisclaimer(), htmlEscape(ANTHEM_DISCLAIMER));
        Assert.assertEquals(quote.getRfpQuoteNetworks().size(), 1);
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName(), "DHMO Network");

    }

    @Test
    public void testDHMOAndDPPO() throws Exception {

        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.DENTAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/Pool Rating Project (Proposed State) - Manuals_Rev6_Excel Version_4Tier.xls");
        testCase.setQuoteFilename2List(Arrays.asList(currDir + "/data/quotes/Anthem/Dental/BenRevo Test Case_4 Tier.xlsx"));

        RfpQuote quote = validator.uploadAndGetQuote(testCase);
        
        Assert.assertEquals(quote.getDisclaimer(), htmlEscape(ANTHEM_WITH_DPPO_DISCLAIMER));
        Assert.assertEquals(quote.getRfpQuoteNetworks().size(), 2);
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName(), "DHMO Network");
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(1).getRfpQuoteOptionName(), "DPPO Network");
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(1).getRfpQuoteNetworkPlans().size(), 11);
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(1).getRfpQuoteNetworkPlans().get(0).getPnn().getName(), "BenRevo Test Case");

    }
    
    @Test(expected = ValidationException.class)
    public void testDHMOAndDPPOWrongTiers() throws Exception {

        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.DENTAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/Pool Rating Project (Proposed State) - Manuals_Rev6_Excel Version_3Tier.xls");
        testCase.setQuoteFilename2List(Arrays.asList(currDir + "/data/quotes/Anthem/Dental/BenRevo Test Case_4 Tier.xlsx"));

        validator.uploadAndGetQuote(testCase);
    }
    
    @Test
    public void test2DPPOs() throws Exception {

        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.DENTAL);
        testCase.setQuoteFilename2List(
                Arrays.asList(
                        currDir + "/data/quotes/Anthem/Dental/BenRevo Test Case_4 Tier.xlsx",
                        currDir + "/data/quotes/Anthem/Dental/BenRevo Test Case2 3_8.8.17.xlsx" ));

        RfpQuote quote = validator.uploadAndGetQuote(testCase);

        Assert.assertEquals(quote.getDisclaimer(), htmlEscape(ANTHEM_WITH_DPPO_DISCLAIMER));
        Assert.assertEquals(quote.getRfpQuoteNetworks().size(), 1);
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName(), "DPPO Network");
        
        List<RfpQuoteNetworkPlan> plans = quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans(); 
        Assert.assertEquals(plans.size(), 22);
        
        RfpQuoteNetworkPlan netwrokPlan = plans.get(0);
        Assert.assertEquals(netwrokPlan.getPnn().getName(), "BenRevo Test Case2");

        netwrokPlan = plans.get(11);
        Assert.assertEquals(netwrokPlan.getPnn().getName(), "BenRevo Test Case");

       }
    
    @Test
    public void testDHMOAnd2DPPOs() throws Exception {

        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.DENTAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/2018SampleQuotes/Pool Rating Project (Proposed State) - Manuals_Rev6_Excel Version_4Tier.xls");
        testCase.setQuoteFilename2List(
                Arrays.asList(
                        currDir + "/data/quotes/Anthem/Dental/BenRevo Test Case_4 Tier.xlsx",
                        currDir + "/data/quotes/Anthem/Dental/BenRevo Test Case2 3_8.8.17.xlsx" ));
        
        RfpQuote quote = validator.uploadAndGetQuote(testCase);
        
        Assert.assertEquals(quote.getDisclaimer(), htmlEscape(ANTHEM_WITH_DPPO_DISCLAIMER));
        Assert.assertEquals(quote.getRfpQuoteNetworks().size(), 2);
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName(), "DHMO Network");
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(1).getRfpQuoteOptionName(), "DPPO Network");
        
        List<RfpQuoteNetworkPlan> plans = quote.getRfpQuoteNetworks().get(1).getRfpQuoteNetworkPlans();
        Assert.assertEquals(plans.size(), 22);

        RfpQuoteNetworkPlan netwrokPlan = plans.get(0);
        Assert.assertEquals(netwrokPlan.getPnn().getName(), "BenRevo Test Case2");

        netwrokPlan = plans.get(11);
        Assert.assertEquals(netwrokPlan.getPnn().getName(), "BenRevo Test Case");
    }

     

    @Test
    public void testNewDPPOOnly() throws Exception {

        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.DENTAL);
        testCase.setQuoteFilename2List(Arrays.asList(currDir + "/data/quotes/Anthem/Dental/BenRevo test_Consumer Choice_2.16.18.xlsx"));

        RfpQuote quote = validator.uploadAndGetQuote(testCase);

        Assert.assertEquals(quote.getDisclaimer(), htmlEscape(ANTHEM_WITH_DPPO_DISCLAIMER));
        Assert.assertEquals(quote.getRfpQuoteNetworks().size(), 1);
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName(), "DPPO Network");
        Assert.assertEquals(quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().size(), 11);
        
        RfpQuoteNetworkPlan netwrokPlan = quote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().get(0);
        Assert.assertEquals(netwrokPlan.getPnn().getName(), "BenRevo Test Case");
        assertThat(netwrokPlan.getTier1Rate()).isEqualTo(19.77f);
        assertThat(netwrokPlan.getTier2Rate()).isEqualTo(40.32f);
        assertThat(netwrokPlan.getTier3Rate()).isEqualTo(32.33f);
        assertThat(netwrokPlan.getTier4Rate()).isEqualTo(49.14f);
        assertThat(netwrokPlan.isVoluntary()).isFalse();
        
        List<Benefit> benefits = benefitRepository.findByPlanId(netwrokPlan.getPnn().getPlan().getPlanId());
        assertThat(benefits).hasSize(22);
        for (Benefit ben : benefits) {
            if (ben.getBenefitName().getName().equals("DENTAL_INDIVIDUAL")) {
                // both IN and OUT
                assertThat(ben.getValue()).isEqualTo("200");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("DENTAL_FAMILY")) {
                assertThat(ben.getValue()).isEqualTo("600");
                assertThat(ben.getFormat()).isEqualTo("DOLLAR");
            } else if (ben.getBenefitName().getName().equals("WAIVED_FOR_PREVENTIVE")) {
                assertThat(ben.getValue()).isEqualTo("Yes");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("CALENDAR_YEAR_MAXIMUM")) {
                assertThat(ben.getValue()).isEqualTo("N/A");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("CLASS_1_PREVENTIVE")) {
                assertThat(ben.getValue()).isEqualTo("100");
                assertThat(ben.getFormat()).isEqualTo("PERCENT");
            } else if (ben.getBenefitName().getName().equals("CLASS_2_BASIC")) {
                assertThat(ben.getValue()).isEqualTo("80");
                assertThat(ben.getFormat()).isEqualTo("PERCENT");
            } else if (ben.getBenefitName().getName().equals("CLASS_3_MAJOR")) {
                assertThat(ben.getValue()).isEqualTo("50");
                assertThat(ben.getFormat()).isEqualTo("PERCENT");
            } else if (ben.getBenefitName().getName().equals("CLASS_4_ORTHODONTIA")) {
                assertThat(ben.getValue()).isEqualTo("Not Covered");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("ORTHODONTIA_LIFETIME_MAX")) {
                assertThat(ben.getValue()).isEqualTo("N/A");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("ORTHO_ELIGIBILITY")) {
                assertThat(ben.getValue()).isEqualTo("None");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("IMPLANT_COVERAGE")) {
                assertThat(ben.getValue()).isEqualTo("Covered, 1 per tooth per 60 months");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else if (ben.getBenefitName().getName().equals("REIMBURSEMENT_SCHEDULE")) {
                assertThat(ben.getValue()).isEqualTo("80th percentile");
                assertThat(ben.getFormat()).isEqualTo("STRING");
            } else {
                fail("Unknown benefit: " + ben.getBenefitName().getName());
            }
        }

        List<QuotePlanAttribute> attrs = attributeRepository.findQuotePlanAttributeByRqnpId(netwrokPlan.getRfpQuoteNetworkPlanId());
        assertThat(attrs).hasSize(2);
        for (QuotePlanAttribute attr : attrs) {
            switch(attr.getName()) {
                case CONTRACT_LENGTH:
                    assertThat(attr.getValue()).isEqualTo("24 Months");
                    break;
                case PROGRAM:
                    assertThat(attr.getValue()).isEqualTo("Prime");
                    break;
                default:
                    fail("Unexpected QuotePlanAttribute: " + attr.getName());
                    break;
            }
        }
    }

}
