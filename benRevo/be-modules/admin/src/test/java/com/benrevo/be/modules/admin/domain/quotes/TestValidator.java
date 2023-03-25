package com.benrevo.be.modules.admin.domain.quotes;

import com.benrevo.be.modules.admin.util.helper.DataLoaderTestHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.*;
import org.junit.Assert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by lemdy on 6/9/17.
 */
@Component
@Primary
public class TestValidator {

    private static final Logger logger = LoggerFactory.getLogger(TestValidator.class);

    protected BaseUploader loader;
    protected Long brokerId;
    protected Long carrierId;

    @Autowired
    protected DataLoaderTestHelper testEntityHelper;

    public void uploadAndValidateTier(UploaderTestCase testCase) throws Exception {
        Client client = testEntityHelper.createTestClientInBrokerage();
        brokerId = client.getBroker().getBrokerId();
        testEntityHelper.createTestAllRfpSubmissions(carrierId, client);

        FileInputStream fis = new FileInputStream(new File(testCase.getQuoteFilename()));
        loader.resetPlanStatistics();
        RfpQuote quote = loader.run(fis, Collections.emptyList(), client.getClientId(), brokerId, QuoteType.STANDARD, testCase.getCategory(), false, true);

        Assert.assertEquals(quote.getRatingTiers().intValue(), testCase.getTier());
    }

    public RfpQuote uploadAndGetQuote(UploaderTestCase testCase) throws Exception {
        Client client = testEntityHelper.createTestClientInBrokerage();
        return uploadAndGetQuote(testCase, client);
    }

    public RfpQuote uploadAndGetQuote(UploaderTestCase testCase, Client client) throws Exception {
        brokerId = client.getBroker().getBrokerId();
        Iterable<RfpSubmission> rfpSubmissions = testEntityHelper.createTestAllRfpSubmissions(carrierId, client);
        for (RfpSubmission rfpSubmission : rfpSubmissions) {
            if (rfpSubmission.getRfpCarrier().getCategory().equals(testCase.getCategory())) {
                testEntityHelper.createTestRfpQuote(rfpSubmission , QuoteType.STANDARD);
                break;
            }
        }
        
        logger.info("Starting test for " + testCase.getQuoteFilename());

        FileInputStream fis = (testCase.getQuoteFilename() == null )? null : new FileInputStream(new File(testCase.getQuoteFilename()));
        List<InputStream> fis2List = new ArrayList<>();
        for (String fileName : testCase.getQuoteFilename2List()) {
            fis2List.add(new FileInputStream(new File(fileName)));
        }
        loader.resetPlanStatistics();
        RfpQuote quote = loader.run(fis, fis2List, client.getClientId(), brokerId, QuoteType.STANDARD, testCase.getCategory(), false, true);
        
        
        Assert.assertNotNull(quote);
        Assert.assertTrue(null != quote.getRfpQuoteId() && quote.getRfpQuoteId() > 0);
        return quote;
    }


    public RfpQuote findMissingPlans(UploaderTestCase testCase) throws Exception {

        String[] files = new String[]{
            "Best Best & Krieger (Los Angeles).xls", "Callfire.xls", "Canadian Solar USA (Walnut Creek).xls",
            "Caravali Coffees (Walnut Creek).xls", "Childrens Hospital (San Diego).xls", "Hand & Nail Harmony (Los Angeles).xls",
            "Intercare Insurance Services (Fresno).xls", "Lytton Rancheria (San Diego).xls", "Majestic Vacations.xls", "Metaswitch Networks (San Francisco).xls",
            "Shimano American Corporation (Costa Mesa).xls",
            "SMA Solar Technology America (Sacramento).xls"
        };

        Client client = testEntityHelper.createTestClientInBrokerage();
        brokerId = client.getBroker().getBrokerId();
        testEntityHelper.createTestAllRfpSubmissions(carrierId, client);

        String currDir = Paths.get("").toAbsolutePath().toString();
        for(String file : files){
            FileInputStream fis = new FileInputStream(new File(currDir + "/data/quotes/Anthem/2018SampleQuotes/" + file));
            loader.resetPlanStatistics();
            RfpQuote quote = loader.run(fis, Collections.emptyList(), client.getClientId(), brokerId, QuoteType.STANDARD, Constants.MEDICAL, false, true);
        }

        System.out.format("%80s%32s%16s%12s", "Plan Name" , "Network", "Network Type", "Occurrence Frequency");
        for(String key : loader.getPlans().keySet()) {
            String[] split = key.split(",");
            System.out.println("");
            System.out.format("%80s%32s%16s%12s",split[2] , split[1], split[0], loader.getPlans().get(key));
        }
        System.out.println("");
        return null;
    }



    public BaseUploader getLoader() {
        return loader;
    }

    public void setLoader(BaseUploader loader) {
        this.loader = loader;
    }

    public Long getBrokerId() {
        return brokerId;
    }

    public void setBrokerId(Long brokerId) {
        this.brokerId = brokerId;
    }

    public Long getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }
}
