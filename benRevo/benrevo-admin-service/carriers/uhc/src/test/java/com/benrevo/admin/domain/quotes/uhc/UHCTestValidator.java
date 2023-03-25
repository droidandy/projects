package com.benrevo.admin.domain.quotes.uhc;

import com.benrevo.be.modules.admin.domain.quotes.TestValidator;
import com.benrevo.be.modules.admin.domain.quotes.UploaderTestCase;
import com.benrevo.be.modules.admin.domain.quotes.parsers.uhc.UHCQuoteUploader;
import com.benrevo.be.modules.admin.util.helper.DataLoaderTestHelper;
import com.benrevo.common.annotation.UseTestProperties;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import java.io.File;
import java.io.FileInputStream;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.Assert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by lemdy on 6/9/17.
 */
@Component
@UseTestProperties
public class UHCTestValidator extends TestValidator{

    private static final Logger logger = LoggerFactory.getLogger(
        UHCTestValidator.class);

    @Autowired
    private DataLoaderTestHelper testEntityHelper;

    public RfpQuote uploadAndValidate(UploaderTestCase testCase) throws Exception {
        Client client = testEntityHelper.createTestClientInBrokerage();
        brokerId = client.getBroker().getBrokerId();
        testEntityHelper.createTestAllRfpSubmissions(carrierId, client);
        return uploadAndValidate(testCase, client);
    }

    private RfpQuote uploadAndValidate(UploaderTestCase testCase, Client client) throws Exception {
        logger.info("Starting test for " + testCase.getQuoteFilename());

        FileInputStream fis = new FileInputStream(new File(testCase.getQuoteFilename()));
        loader.resetPlanStatistics();
        RfpQuote quote = loader.run(fis, Collections.emptyList(), client.getClientId(), brokerId, QuoteType.STANDARD, testCase.getCategory(),  true, false);
        Assert.assertNotNull(quote);
        Assert.assertTrue(null != quote.getRfpQuoteId() && quote.getRfpQuoteId() > 0);

        logger.info("Found " + loader.getFoundPlans() + " plans, missed " + loader.getMissingPlans() + " plans, missingList=" + loader.getMissingPlansList());
        Assert.assertTrue("Found plans in quote that aren't in db: " + loader.getMissingPlansList(), loader.getMissingPlans() == 0);

        List<String> expectedOptions = testCase.getRfpQuoteOptions();
        if (expectedOptions != null) {
            Assert.assertEquals("Wrong number of options found", expectedOptions.size(), testEntityHelper.getRfpQuoteNetworks(quote).size());
            for (String expectedOption : expectedOptions) {
                if (null ==  testEntityHelper.findByRfpQuoteAndRfpQuoteOptionName(quote, expectedOption)) {
                    Assert.assertTrue("Did not find expected rfpQuoteOption '" + expectedOption + "'", false);
                }
            }
        }

        for (String optionName : testCase.getNumPlansPerOption().keySet()) {
            RfpQuoteNetwork quoteNetwork = testEntityHelper.findByRfpQuoteAndRfpQuoteOptionName(quote, optionName);

            //get all the plans in this network, plans and rx
            List <RfpQuoteNetworkPlan> allPlans = testEntityHelper.getRfpQuoteNetworkPlans(quoteNetwork);
            //get non-Rx plans from the network
            int planCount = allPlans.stream().filter(pl -> !pl.getPnn().getPlanType().startsWith("RX_"))
                .collect(Collectors.toList()).size();
            //get Rx plan count
            int rxPlanCount = allPlans.size() - planCount;

            Assert.assertEquals("Wrong number of plans parsed for optionName '" + optionName + "'",
                testCase.getNumPlansPerOption().get(optionName).intValue(), planCount);

            if (testCase.getNumRxPlansPerOptions().get(optionName) != null) {
                Assert.assertEquals("Wrong number of RX plans parsed for optionName '" + optionName + "'",
                    testCase.getNumRxPlansPerOptions().get(optionName).intValue(), rxPlanCount);
            }
        }

        for (String optionName : testCase.getPlansPerOption().keySet()) {
            List<UploaderTestCase.PlanInfo> list = testCase.getPlansPerOption().get(optionName);
            for (UploaderTestCase.PlanInfo pi : list) {
                String logInfo = "Option=" + optionName + ", planName=" + pi.getPlanName();
                //RfpQuoteNetworkPlan rqnp = RfpHelper.getRfpQuoteNetworkPlan(quote, networkStr, pi.getPlanName());

                RfpQuoteNetwork quoteNetwork = testEntityHelper.findByRfpQuoteAndRfpQuoteOptionName(quote, optionName);
                RfpQuoteNetworkPlan rqnp = testEntityHelper.findByRfpQuoteNetworkAndPnnName(quoteNetwork, pi.getPlanName());

                if (rqnp == null) {
                    // Remember... sometimes plan name in UHC quotes are missing dashes!
                    String altPlanName = UHCQuoteUploader.createAltUHCPlanNameWithDash(pi.getPlanName());
                    if (altPlanName != null) {
                        rqnp = testEntityHelper.findByRfpQuoteNetworkAndPnnName(quoteNetwork, altPlanName);
                    }
                }

                Assert.assertNotNull("Null RfpQuoteNetworkPlan for " + logInfo, rqnp);
                Assert.assertEquals("Wrong matchPlan for " + logInfo, pi.isMatchingPlan(), rqnp.isMatchPlan());
                Assert.assertEquals("Wrong tier1 for " + logInfo, pi.getRates()[0], rqnp.getTier1Rate());
                Assert.assertEquals("Wrong tier2 for " + logInfo, pi.getRates()[1], rqnp.getTier2Rate());
                Assert.assertEquals("Wrong tier3 for " + logInfo, pi.getRates()[2], rqnp.getTier3Rate());
                Assert.assertEquals("Wrong tier4 for " + logInfo, pi.getRates()[3], rqnp.getTier4Rate());

                List<Benefit> planBenefitsInDb = testEntityHelper.findBenefitsByPlanId(rqnp.getPnn().getPlan().getPlanId());
                for (UploaderTestCase.BenefitInfo bi : pi.getBenefitInfos()) {
                    // Ensure benefit was saved to db properly
                    boolean found = false;
                    for (Benefit b : planBenefitsInDb) {
                        if (bi.matchesBenefit(b)) {
                            found = true;
                            break;
                        }
                    }

                    Assert.assertTrue("Did not persist benefit correctly: " + bi.toString(), found);
                }

                Assert.assertEquals("Incorrect custom_plan indicator for " + logInfo, pi.isCustomPlan(), rqnp.getPnn().isCustomPlan());
            }
        }
        return quote;
    }
}
