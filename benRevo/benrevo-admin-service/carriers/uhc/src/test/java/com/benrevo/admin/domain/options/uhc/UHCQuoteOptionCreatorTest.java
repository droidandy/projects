package com.benrevo.admin.domain.options.uhc;

import com.benrevo.admin.UHCAdminServiceApplication;
import com.benrevo.be.modules.admin.domain.quotes.parsers.uhc.UHCQuoteUploader;
import com.benrevo.be.modules.admin.util.helper.DataLoaderTestHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.UseTestProperties;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

@Ignore
@RunWith(SpringRunner.class)
@SpringBootTest(classes = UHCAdminServiceApplication.class)
@Transactional(rollbackFor = Exception.class) //comment out to create client with quotes uploaded in broker account.
@UseTestProperties
public class UHCQuoteOptionCreatorTest {

    private static final Logger logger = LoggerFactory.getLogger(UHCQuoteOptionCreatorTest.class);
    private final Long CARRIER_UHC_ID = 22L;

    private final Long RX_HMO_PNNID = null; //4806L; //DEV Rx
    private final Long RX_PPO_PNNID = null; //4805L; //DEV Rx

    private String currDir;

    @Autowired
    private DataLoaderTestHelper testEntityHelper;

    @Autowired
    private UHCQuoteUploader loader;

    private Long brokerId;

    @Before
    public void setup() {
        logger.info("setup()");
        currDir = Paths.get("").toAbsolutePath().toString();
    }

    @Test
    public void loadAccounts() throws Exception{
        //Client client = testEntityHelper.createTestClientInBrokerage();
        //brokerId = client.getBroker().getBrokerId();
        brokerId = 4988L;

        List<Long> brokerIdList = new ArrayList<>(Arrays.asList(brokerId));  //Update list to pick which broker to create the three clients in.
        for (Long id : brokerIdList) {
            testProspectSierra(id);
            testSkyHigh(id);
            testG2(id);
        }
        //add "Kaiser" quote, just uploading same quote but as Kaiser.
        //testProspectSierra_Kaiser(1L, 1L);
    }

    public void testProspectSierra_Kaiser(Long brokerId, Long clientId) throws Exception{
        String filePath= currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/2017 Prospect Sierra School - No Cal Quote Exhibit.xlsx";

        Client client = testEntityHelper.getClient(clientId);
        RfpQuoteSummary rfpQuoteSummary = testEntityHelper.findByClientClientId(client.getClientId());
        rfpQuoteSummary.setMedicalWithKaiserNotes("This is a Kaiser Quote Summary");
        testEntityHelper.saveRfpQuoteSummary(rfpQuoteSummary);

        RfpQuote quote = uploadQuote(filePath, brokerId, client, Constants.MEDICAL, QuoteType.KAISER);

        QuoteOptionSetupTestCase setupQuoteOption = new QuoteOptionSetupTestCase();
        setupQuoteOption.setCategory(Constants.MEDICAL);
        QuoteOptionSetupTestCase.ClientPlanInfo cp1 = new QuoteOptionSetupTestCase.ClientPlanInfo("DG2", "HMO", RX_HMO_PNNID,
                 /*       720,648f,47,
                1655,1324f,2,
                1220,976f,10,
                2086,1668.8f,7);
        */
                775.53F,697.977F,47,
                1789.69F,1431.752F,2,
                1318.39F,1054.712F,10,
                2249.02F,1799.216F,7);

        QuoteOptionSetupTestCase.ClientPlanInfo cp2 = new QuoteOptionSetupTestCase.ClientPlanInfo("Plan D", "PPO", RX_PPO_PNNID,
                /*        778,583.5f,8,
                1792,1075.2f,1,
                1324,794.4f,1,
                2258,1354.8f,0);
        */
                839.5F,629.625F,8,
                1930.8F,1158.48F,1,
                1427.11F,856.266F,1,
                2434.52F,1460.712F,0);

        cp1.setMatchingUHCNetwork("Signature__Rx:42F");
        cp2.setMatchingUHCNetwork("Select Plus__Rx:246");

        setupQuoteOption.addClientPlan(cp1);
        setupQuoteOption.addClientPlan(cp2);

        createQuoteOption(quote, client, setupQuoteOption);
    }


    //@Test
    public void testProspectSierra(Long brokerId) throws Exception {
        String filePath= currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/2017 Prospect Sierra School - No Cal Quote Exhibit.xlsx";

        // create new
        Client client = testEntityHelper.createTestClientInBrokerage(brokerId,"Prospect Sierra School");
        testEntityHelper.createTestAllRfpSubmissions(CARRIER_UHC_ID, client);
        // or add to existing client
        //Client client = testEntityHelper.getClient(5193L);

        addProspectSierraQuoteSummary(client);

        RfpQuote quote = uploadQuote(filePath, brokerId, client, Constants.MEDICAL, QuoteType.STANDARD);

        QuoteOptionSetupTestCase setupQuoteOption = new QuoteOptionSetupTestCase();
        setupQuoteOption.setCategory(Constants.MEDICAL);
        QuoteOptionSetupTestCase.ClientPlanInfo cp1 = new QuoteOptionSetupTestCase.ClientPlanInfo("DG2", "HMO", RX_HMO_PNNID,
         /*       720,648f,47,
                1655,1324f,2,
                1220,976f,10,
                2086,1668.8f,7);
        */
                775.53F,697.977F,47,
                1789.69F,1431.752F,2,
                1318.39F,1054.712F,10,
                2249.02F,1799.216F,7);


        QuoteOptionSetupTestCase.ClientPlanInfo cp2 = new QuoteOptionSetupTestCase.ClientPlanInfo("Plan D", "PPO", RX_PPO_PNNID,
        /*        778,583.5f,8,
                1792,1075.2f,1,
                1324,794.4f,1,
                2258,1354.8f,0);
        */
                839.5F,629.625F,8,
                1930.8F,1158.48F,1,
                1427.11F,856.266F,1,
                2434.52F,1460.712F,0);

        cp1.setMatchingUHCNetwork("Signature__Rx:42F");
        cp2.setMatchingUHCNetwork("Select Plus__Rx:246");

        setupQuoteOption.addClientPlan(cp1);
        setupQuoteOption.addClientPlan(cp2);

        createQuoteOption(quote, client, setupQuoteOption);

        setupDentalQuoteOption(brokerId, client);
        setupVisionQuoteOption(brokerId, client);
    }

    private void addProspectSierraQuoteSummary(Client client) {
        String medical = "We quoted a dual option HMO/PPO EASY quote to match your current benefits and we are are coming in roughly 3.1% over current based on the closest matching plans. In addition we are offering a 2nd year rate guarantee of 9.9%";
        String dental = "We quoted a dual option DPPO/DHMO for this group. The closest matching plans are 2% over current and the rates are guaranteed for 24 months. ";
        String vision = "Single option vision quote offered.\n\nRates are guaranteed 36 months";
        testEntityHelper.createTestQuoteSummary(client, medical, dental, vision);
    }
    private void addSkyHighQuoteSummary(Client client) {
        String medical = "We quoted a dual option PPO/H.S.A to match your current benefits and we are are coming in roughly 1.5% over current based on the closest matching plans. In addition we are offering a multi option quote for skyhigh networks where they have the option to choose up to 3 additional PPO or H.S.A plans from our portfolio to offer to their employees. ";
        String dental = "We quoted a dual option DPPO/DHMO for this group. The closest matching plans are 2% over current and the rates are guaranteed for 24 months. ";
        String vision = "Single option vision quote offered.\n\nRates are guaranteed 36 months";
        testEntityHelper.createTestQuoteSummary(client, medical, dental, vision);
    }
    private void addG2QuoteSummary(Client client) {
        String medical = "We quoted a triple option HMO/PPO/PPO to match your current benefits and we are are coming in roughly 2.7% under current based on the closest matching plans. In addition we are offering a multi option quote for G2 Software where they have the option to choose up to 3 additional HMO plans from our portfolio to offer to their employees. ";
        String dental = "We quoted a dual option DPPO/DHMO for this group. The closest matching plans are 2% over current and the rates are guaranteed for 24 months. ";
        String vision = "Single option vision quote offered.\n\nRates are guaranteed 36 months";
        testEntityHelper.createTestQuoteSummary(client, medical, dental, vision);
    }

    //@Test
    public void testSkyHigh(Long brokerId) throws Exception {
        String filePath = currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/2017 SkyHigh Networks, Inc. No Cal GRx Multi-Option  Quote Exhibits.xlsm";

        Client client = testEntityHelper.createTestClientInBrokerage(brokerId,"SkyHigh Networks, Inc.");
        testEntityHelper.createTestAllRfpSubmissions(CARRIER_UHC_ID, client);
        addSkyHighQuoteSummary(client);

        RfpQuote quote = uploadQuote(filePath, brokerId, client, Constants.MEDICAL, QuoteType.STANDARD);

        QuoteOptionSetupTestCase setupQuoteOption = new QuoteOptionSetupTestCase();
        setupQuoteOption.setCategory(Constants.MEDICAL);
        QuoteOptionSetupTestCase.ClientPlanInfo cp1 = new QuoteOptionSetupTestCase.ClientPlanInfo("CPN4", "PPO", RX_PPO_PNNID,
                /*515,463.5f,21,
                1134,1020.6f,9,
                928,835.2f,5,
                1598,1438.2f,40);
                */
                638.2431F,574.41879F,21,
                1404.1467F,1263.73203F,9,
                1148.8455F,1033.96095F,5,
                1978.5843F,1780.72587F,40);

        QuoteOptionSetupTestCase.ClientPlanInfo cp2 = new QuoteOptionSetupTestCase.ClientPlanInfo("CAG", "HSA", RX_PPO_PNNID,
                /*400,360f,9,
                881,792.9f,3,
                720,648f,2,
                1241,1116.9f,16);
                */
                485.582F,437.0238F,9,
                1068.2901F,961.46109F,3,
                874.0573F,786.65157F,2,
                1505.3236F,1354.79124F,16);

        cp1.setMatchingUHCNetwork("Select Plus__Rx:H9");
        cp2.setMatchingUHCNetwork("Select Plus HSA__Rx:H9-HSA");

        setupQuoteOption.addClientPlan(cp1);
        setupQuoteOption.addClientPlan(cp2);

        createQuoteOption(quote, client, setupQuoteOption);

        setupDentalQuoteOption(brokerId, client);
        setupVisionQuoteOption(brokerId, client);
    }


    //@Test
    public void testG2(Long brokerId) throws Exception {
        String filePath = currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/G2 Software Systems So Cal GRx Multi-Option Proposal Exhibit 9-17   Test.xlsm";

        Client client = testEntityHelper.createTestClientInBrokerage(brokerId,"G2 Software Systems");
        testEntityHelper.createTestAllRfpSubmissions(CARRIER_UHC_ID, client);
        addG2QuoteSummary(client);

        RfpQuote quote = uploadQuote(filePath, brokerId, client, Constants.MEDICAL, QuoteType.STANDARD);

        QuoteOptionSetupTestCase setupQuoteOption = new QuoteOptionSetupTestCase();
        setupQuoteOption.setCategory(Constants.MEDICAL);
        QuoteOptionSetupTestCase.ClientPlanInfo cp1 = new QuoteOptionSetupTestCase.ClientPlanInfo("CH4", "HMO", RX_HMO_PNNID,
                /*688,550.4f,29,
                1377,1032.75f,6,
                1246,934.5f,8,
                2174,1630.5f,9);
                */
                703.0657F,562.45256F,29,
                1406.1314F,1054.59855F,6,
                1272.5527F,954.414525F,8,
                3053.2302F,2289.92265F,9);

        QuoteOptionSetupTestCase.ClientPlanInfo cp2 = new QuoteOptionSetupTestCase.ClientPlanInfo( "Plan A", "PPO", RX_PPO_PNNID,
                /*996,697.2f,3,
                1993,1395.1f,4,
                1804,1262.8f,5,
                2990,2093f,6);
                */
                1017.7434F,712.42038F,3,
                2035.4868F,1424.84076F,4,
                1842.1173F,1289.48211F,5,
                3053.2302F,2137.26114F,6);

        QuoteOptionSetupTestCase.ClientPlanInfo cp3 = new QuoteOptionSetupTestCase.ClientPlanInfo("Plan B", "PPO", RX_PPO_PNNID,
                /*921,644.7f,6,
                1842,1289.4f,8,
                1667,1166.9f,0,
                2764,1934.8f,9);
                */
                940.8127F,658.56889F,6,
                1881.6254F,1317.13778F,8,
                1702.8738F,1192.01166F,0,
                2822.4381F,1975.70667F,9);


        cp1.setMatchingUHCNetwork("Signature__Rx:3JF");
        cp2.setMatchingUHCNetwork("Choice Plus__Rx:245-X");
        cp3.setMatchingUHCNetwork("Select Plus__Rx:245-X");

        setupQuoteOption.addClientPlan(cp1);
        setupQuoteOption.addClientPlan(cp2);
        setupQuoteOption.addClientPlan(cp3);

        createQuoteOption(quote, client, setupQuoteOption);

        setupDentalQuoteOption(brokerId, client);
        setupVisionQuoteOption(brokerId, client);
    }


    private void setupDentalQuoteOption(Long brokerId, Client client) throws Exception{
        //Dental
        String filePath = currDir + "/data/quotes/UHC/Dental/D_DualOptionDPPO-DPPO-AlternativePPO.xlsm";
        RfpQuote quote = uploadQuote(filePath, brokerId, client, Constants.DENTAL, QuoteType.STANDARD);
        QuoteOptionSetupTestCase setupQuoteOption = new QuoteOptionSetupTestCase();
        setupQuoteOption.setCategory(Constants.DENTAL);
        QuoteOptionSetupTestCase.ClientPlanInfo cp1 = new QuoteOptionSetupTestCase.ClientPlanInfo("CDP5", "DPPO", null,
                23.50f, 	21.15f, 	38,
                51.85f, 	46.67f, 	12,
                91.50f, 	82.35f, 	25,
                89.55f, 	80.60f, 	15);

        QuoteOptionSetupTestCase.ClientPlanInfo cp2 = new QuoteOptionSetupTestCase.ClientPlanInfo("CDP9", "DPPO", null,
                32.56f, 	29.30f, 	25,
                69.86f, 	62.87f, 	14,
                75.87f, 	68.28f, 	14,
                115.85f, 104.27f, 29);

        cp1.setMatchingUHCNetwork("Options PPO 20__Plan:2P351");
        cp2.setMatchingUHCNetwork("Options PPO 20__Plan:P9332");

        setupQuoteOption.addClientPlan(cp1);
        setupQuoteOption.addClientPlan(cp2);
        createQuoteOption(quote, client, setupQuoteOption);
    }

    private void setupVisionQuoteOption(Long brokerId, Client client) throws Exception{
        //Dental
        String filePath = currDir + "/data/quotes/UHC/Vision/V_SingleOption-OneAlternative.xlsm";
        RfpQuote quote = uploadQuote(filePath, brokerId, client, Constants.VISION, QuoteType.STANDARD);
        QuoteOptionSetupTestCase setupQuoteOption = new QuoteOptionSetupTestCase();
        setupQuoteOption.setCategory(Constants.VISION);
        QuoteOptionSetupTestCase.ClientPlanInfo cp1 = new QuoteOptionSetupTestCase.ClientPlanInfo("CVIN", "VISION", null,
                6.31f, 5.68f, 30,
                12.56f, 11.30f, 16,
                19.99f, 17.99f, 18,
                31.54f, 28.39f, 25);

        cp1.setMatchingUHCNetwork("Full Network__Plan:VL049");
        setupQuoteOption.addClientPlan(cp1);
        createQuoteOption(quote, client, setupQuoteOption);
    }

    private RfpQuote uploadQuote(String filePath, Long brokerId, Client client, String category, QuoteType quoteType) throws Exception {

        logger.info("Starting quote upload for test for client " + client.getClientName());

        FileInputStream fis = new FileInputStream(new File(filePath));
        loader.resetPlanStatistics();
        RfpQuote quote = loader.run(fis, null, client.getClientId(), brokerId, quoteType, category,  false, true);
        Assert.assertNotNull(quote);
        Assert.assertTrue(null != quote.getRfpQuoteId() && quote.getRfpQuoteId() > 0);

        return quote;
    }

    private void createQuoteOption(RfpQuote quote, Client client, QuoteOptionSetupTestCase setupQuoteOption) {

        //create option
        RfpQuoteOption option  = testEntityHelper.createTestRfpQuoteOption(quote);

        //create client plan for all
        for (QuoteOptionSetupTestCase.ClientPlanInfo cp : setupQuoteOption.getClientPlans()) {

            ClientPlan clientPlan = testEntityHelper.createTestClientPlan(client, cp.getPlanType(), cp.getProduct(),
                    cp.getRates(), cp.getContri(), cp.getEnroll(), cp.getRxPnnId());

            //create option network
            testEntityHelper.createTestRfpQuoteOptionNetwork(option, cp.getMatchingUHCNetwork(), clientPlan, setupQuoteOption.getCategory());
        }
    }
}
