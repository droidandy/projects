package com.benrevo.admin.domain.quotes.uhc;

import com.benrevo.be.modules.admin.domain.quotes.parsers.uhc.UHCNetworkDetails;
import com.benrevo.be.modules.admin.domain.quotes.parsers.uhc.UHCQuoteUploader;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.enums.RfpQuoteOptionAttributeName;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteDisclaimer;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionAttribute;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.BenefitNameRepository;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import static org.assertj.core.api.Assertions.assertThat;
import static org.testng.Assert.fail;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.QuoteUploaderDto;
import com.benrevo.be.modules.admin.domain.quotes.UploaderTestCase.BenefitInfo;
import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.quotes.UploaderTestCase;

//@Ignore // TODO/FIXME: Broken due to missing riders
//@SpringBootTest(classes = UHCAdminServiceApplication.class)
//@Transactional(rollbackFor = Exception.class) //comment out to create client with quotes uploaded in broker account.
public class UHCQuoteUploaderTest extends AdminAbstractControllerTest {

    private static final Logger logger = LoggerFactory.getLogger(UHCQuoteUploaderTest.class);
    private final Long CARRIER_UHC_ID = 22L;

    private String currDir;

    @Autowired
    private UHCQuoteUploader loader;

    @Autowired
	private UHCTestValidator validator;
    
    @Autowired
    private BenefitRepository benefitRepository;
    
    @Autowired
    private BenefitNameRepository benefitNameRepository;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;
    
    @Autowired
    private AttributeRepository attributeRepository;
    
    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
   
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;
   
    @Before
    public void setup() {
        logger.info("setup()");
        currDir = Paths.get("").toAbsolutePath().toString();
		
        validator.setCarrierId(CARRIER_UHC_ID);
        validator.setLoader(loader); 
    }

	@Test
	public void testAllTierRates() throws Exception {
    	String[] files = new String[]{
    		"CallFire CompositeRate Tier Rate.xlsm",
			"Smith Emery Companies 3 Tier EASY So Cal.xlsm"//,
			//"CallFire 2 Tier Rate.xlsm"
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
			testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/" + file);

			validator.uploadAndValidateTier(testCase) ;
		}
	}

    @Test
    public void testAstreya() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/2017 Astreya Partners, Inc. - No Cal Alongside Kaiser No GRx Quote Exhibits.xlsx");
    	testCase.setRfpQuoteOptions(Arrays.asList("Choice__Rx:246", "Choice Plus__Rx:C2", "Choice Plus__Rx:245", "Choice Plus HSA__Rx:C2-HSA"));
    	testCase.addNumPlansPerOption("Choice__Rx:246", 21);
    	testCase.addNumPlansPerOption("Choice Plus__Rx:C2", 23);
    	testCase.addNumPlansPerOption("Choice Plus__Rx:245", 2);
    	testCase.addNumPlansPerOption("Choice Plus HSA__Rx:C2-HSA", 4);
        //expected rx count
        testCase.addNumRxPlansPerOptions("Choice__Rx:246", 1);
        testCase.addNumRxPlansPerOptions("Choice Plus__Rx:C2", 1);
        testCase.addNumRxPlansPerOptions("Choice Plus__Rx:245", 1);
        testCase.addNumRxPlansPerOptions("Choice Plus HSA__Rx:C2-HSA", 1);
    	
    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Choice__Rx:246", "071", true, 570.84f, 1198.77f, 1084.61f, 1712.55f);
    	testCase.addPlanInfo("Choice__Rx:246", "1264A", false, 567.48f, 1191.72f, 1078.23f, 1702.47f);
    	testCase.addPlanInfo("Choice__Rx:246", "084", false, 488.71f, 1026.3f, 928.56f, 1466.16f);
    	testCase.addPlanInfo("Choice Plus__Rx:C2", "494", true, 525.51f, 1103.58f, 998.48f, 1576.56f);
    	testCase.addPlanInfo("Choice Plus__Rx:C2", "1317A", false, 503.52f, 1057.40f, 956.7f, 1510.59f);
    	testCase.addPlanInfo("Choice Plus__Rx:C2", "1327A", false, 450.24f, 945.51f, 855.47f, 1350.75f);
    	testCase.addPlanInfo("Choice Plus__Rx:245", "1327A", true, 457.18f, 960.08f, 868.65f, 1371.57f);
    	testCase.addPlanInfo("Choice Plus HSA__Rx:C2-HSA", "564", true, 362.16f, 760.54f, 688.11f, 1086.50f);
    	testCase.addPlanInfo("Choice Plus HSA__Rx:C2-HSA", "567", false, 357.83f, 751.45f, 679.89f, 1073.51f);

    	validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testCalWest() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/2017 Cal West Rain - No Cal EASY Quote Exhibit.xlsx");
    	testCase.setRfpQuoteOptions(Arrays.asList("Select Plus__Rx:0B"));
    	testCase.addNumPlansPerOption("Select Plus__Rx:0B", 3);
        //expected rx count
        testCase.addNumRxPlansPerOptions("Select Plus__Rx:0B", 1);
    	
    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Select Plus__Rx:0B", "AOPP", true, 383.57f, 843.85f, 690.43f, 1189.04f);
    	testCase.addPlanInfo("Select Plus__Rx:0B", "AOPQ", false, 373.79f, 822.34f, 672.82f, 1158.72f);
    	testCase.addPlanInfo("Select Plus__Rx:0B", "AOPR", false, 368.65f, 811.03f, 663.57f, 1142.79f);

    	validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testProspectSierra() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/2017 Prospect Sierra School - No Cal Quote Exhibit.xlsx");
    	testCase.setRfpQuoteOptions(Arrays.asList("Signature__Rx:42F", "Select Plus__Rx:246"));
    	testCase.addNumPlansPerOption("Signature__Rx:42F", 35);
        testCase.addNumRxPlansPerOptions("Signature__Rx:42F", 1);
    	testCase.addNumPlansPerOption("Select Plus__Rx:246", 33);
        testCase.addNumRxPlansPerOptions("Select Plus__Rx:246", 1);
    	
    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Signature__Rx:42F", "U8M", true, 799.52f, 1838.86f, 1359.16f, 2318.58f);
    	testCase.addPlanInfo("Signature__Rx:42F", "Y93", false, 764.61f, 1758.57f, 1299.81f, 2217.34f);
    	testCase.addPlanInfo("Signature__Rx:42F", "Y6R", false, 708.22f, 1628.88f, 1203.95f, 2053.81f);
    	testCase.addPlanInfo("Select Plus__Rx:246", "PRF", true, 865.46f, 1990.52f, 1471.25f, 2509.81f);
    	testCase.addPlanInfo("Select Plus__Rx:246", "AKKS", false, 803.86f, 1848.84f, 1366.53f, 2331.17f);
    	testCase.addPlanInfo("Select Plus__Rx:246", "AKLC", false, 643.59f, 1480.23f, 1094.08f, 1866.39f);

        validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testSkyHigh() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/2017 SkyHigh Networks, Inc. No Cal GRx Multi-Option  Quote Exhibits.xlsm");
    	testCase.setRfpQuoteOptions(Arrays.asList("Core__Rx:H9", "Select Plus__Rx:H9", "Select Plus HSA__Rx:H9-HSA", "Core HSA__Rx:H9-HSA"));
        //expected plan count
        testCase.addNumPlansPerOption("Core__Rx:H9", 35);
        testCase.addNumPlansPerOption("Select Plus__Rx:H9", 35);
        testCase.addNumPlansPerOption("Select Plus HSA__Rx:H9-HSA", 23);
        testCase.addNumPlansPerOption("Core HSA__Rx:H9-HSA", 20);
        //expected rx count
        testCase.addNumRxPlansPerOptions("Core__Rx:H9", 1);
        testCase.addNumRxPlansPerOptions("Select Plus__Rx:H9", 1);
        testCase.addNumRxPlansPerOptions("Select Plus HSA__Rx:H9-HSA", 1);
        testCase.addNumRxPlansPerOptions("Core HSA__Rx:H9-HSA", 1);

    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Select Plus__Rx:H9", "PR5", true, 644.69f, 1418.33f, 1160.45f, 1998.57f);
    	testCase.addPlanInfo("Select Plus__Rx:H9", "PS9", false, 608.47f, 1338.64f, 1095.26f, 1886.28f);
    	testCase.addPlanInfo("Select Plus__Rx:H9", "AB5N", false, 476.84f, 1049.06f, 858.32f, 1478.22f);
    	testCase.addPlanInfo("Core__Rx:H9", "AHV6", true, 545.15f, 1199.34f, 981.28f, 1689.99f);
    	testCase.addPlanInfo("Core__Rx:H9", "AHWJ", false, 514.68f, 1132.30f, 926.43f, 1595.53f);
    	testCase.addPlanInfo("Core__Rx:H9", "AHXR", false, 407.18f, 895.80f, 732.93f, 1262.28f);
    	testCase.addPlanInfo("Select Plus HSA__Rx:H9-HSA", "AOPC", true, 500.60f, 1101.33f, 901.09f, 1551.88f);
    	testCase.addPlanInfo("Select Plus HSA__Rx:H9-HSA", "AOPB", false, 485.60f, 1068.33f, 874.09f, 1505.38f);
    	testCase.addPlanInfo("Select Plus HSA__Rx:H9-HSA", "AOPA", false, 485.27f, 1067.60f, 873.49f, 1504.36f);
    	testCase.addPlanInfo("Select Plus HSA__Rx:H9-HSA", "ULJ", false, 521.19f, 1146.63f, 938.15f, 1615.71f);
    	testCase.addPlanInfo("Core HSA__Rx:H9-HSA", "AHW7", true, 438.31f, 964.29f, 788.97f, 1358.78f);
    	testCase.addPlanInfo("Core HSA__Rx:H9-HSA", "AHZV", false, 384.89f, 846.76f, 692.81f, 1193.18f);
    	testCase.addPlanInfo("Core HSA__Rx:H9-HSA", "AHZ7", false, 334.76f, 736.48f, 602.57f, 1037.77f);

        validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testAWI() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/AWI Management Corporation_2017 No Cal GRx  Multio-Option  Exhibit.xlsx");
    	testCase.setRfpQuoteOptions(Arrays.asList("Choice__Rx:5E", "Core Essential__Rx:5E", "Choice Plus__Rx:5E", "Core__Rx:5E"));
        //expected plan count
        testCase.addNumPlansPerOption("Choice__Rx:5E", 20);
        testCase.addNumPlansPerOption("Core Essential__Rx:5E", 12);
        testCase.addNumPlansPerOption("Choice Plus__Rx:5E", 30);
        testCase.addNumPlansPerOption("Core__Rx:5E", 46);
        //expected rx count
        testCase.addNumRxPlansPerOptions("Choice__Rx:5E", 1);
        testCase.addNumRxPlansPerOptions("Core Essential__Rx:5E", 1);
        testCase.addNumRxPlansPerOptions("Choice Plus__Rx:5E", 1);
        testCase.addNumRxPlansPerOptions("Core__Rx:5E", 1);

    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Choice__Rx:5E", "1264A", true, 954.10f, 2089.48f, 1812.79f, 2900.46f);
    	testCase.addPlanInfo("Choice__Rx:5E", "084", false, 822.64f, 1801.58f, 1563.02f, 2500.83f);
    	testCase.addPlanInfo("Choice__Rx:5E", "1284A", false, 717.35f, 1571.00f, 1362.97f, 2180.74f);
    	testCase.addPlanInfo("Core Essential__Rx:5E", "AKFK", true, 877.28f, 1921.24f, 1666.83f, 2666.93f);
    	testCase.addPlanInfo("Core Essential__Rx:5E", "AHUZ", false, 754.94f, 1653.32f, 1434.39f, 2295.02f);
    	testCase.addPlanInfo("Core Essential__Rx:5E", "AHU5", false, 703.72f, 1541.15f, 1337.07f, 2139.31f);
    	testCase.addPlanInfo("Choice Plus__Rx:5E", "1327A", true, 987.94f, 2163.59f, 1877.09f, 3003.34f);
    	testCase.addPlanInfo("Choice Plus__Rx:5E", "489", false, 1196.20f, 2619.68f, 2272.78f, 3636.45f);
    	testCase.addPlanInfo("Choice Plus__Rx:5E", "1323A", false, 1072.41f, 2348.58f, 2037.58f, 3260.13f);
    	testCase.addPlanInfo("Core__Rx:5E", "AKHD", true, 929.54f, 2035.69f, 1766.13f, 2825.80f);
    	testCase.addPlanInfo("Core__Rx:5E", "AKHO", false, 730.92f, 1600.71f, 1388.75f, 2222.00f);
    	testCase.addPlanInfo("Core__Rx:5E", "AHVY", false, 1124.86f, 2463.44f, 2137.23f, 3419.57f);
    	
        validator.uploadAndValidate(testCase) ;
    }

// Bakkovor and Envision tests commented out due to issue with duplicate networks for different options. Ojas is aware!
//    @Test
    public void testBakkovor() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/Bakkovor Foods So Cal EASY Test 8.1.2017 effective date.xlsm");
    	testCase.setRfpQuoteOptions(Arrays.asList("Advantage__Rx:43F", "Select Plus__Rx:5E"));
        //expected plan count
        testCase.addNumPlansPerOption("Advantage__Rx:43F", 20);
        testCase.addNumPlansPerOption("Select Plus__Rx:5E", 38);
        //expected rx count
        testCase.addNumRxPlansPerOptions("Advantage__Rx:43F", 1);
        testCase.addNumRxPlansPerOptions("Select Plus__Rx:5E", 1);

    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Advantage__Rx:43F", "YJK", true, 415.62f, 910.21f, 789.68f, 1263.48f);
    	testCase.addPlanInfo("Advantage__Rx:43F", "YK1", false, 369.67f, 809.58f, 702.37f, 1123.80f);
    	testCase.addPlanInfo("Advantage__Rx:43F", "YD9", false, 334.51f, 732.58f, 635.57f, 1016.91f);
    	testCase.addPlanInfo("Select Plus__Rx:5E", "AKKK", true, 602.22f, 1318.86f, 1144.22f, 1830.75f);
    	testCase.addPlanInfo("Select Plus__Rx:5E", "PT4", false, 573.77f, 1256.56f, 1090.16f, 1744.26f);
    	testCase.addPlanInfo("Select Plus__Rx:5E", "AKLE", false, 431.19f, 944.31f, 819.26f, 1310.82f);
    	
        validator.uploadAndValidate(testCase) ;
    }

 // Bakkovor and Envision tests commented out due to issue with duplicate networks for different options. Ojas is aware!
//  @Test
    public void testEnvision() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/Envision Peripherals, Inc - No Cal  EASY PROPOSAL PAGES.xlsx");
    	testCase.setRfpQuoteOptions(Arrays.asList("Select__Rx:246", "Select Plus__Rx:C2", "Select Plus__Rx:245"));
        //expected plan count
        testCase.addNumPlansPerOption("Select__Rx:246", 25);
        testCase.addNumPlansPerOption("Select Plus__Rx:C2", 66);
        testCase.addNumPlansPerOption("Select Plus__Rx:245", 35);
        //expected rx count
        testCase.addNumRxPlansPerOptions("Select__Rx:246", 1);
        testCase.addNumRxPlansPerOptions("Select Plus__Rx:C2", 1);
        testCase.addNumRxPlansPerOptions("Select Plus__Rx:245", 1);

    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Select__Rx:246", "AKJA", true, 599.84f, 1319.75f, 1079.71f, 1859.49f);
    	testCase.addPlanInfo("Select__Rx:246", "AKMV", false, 482.62f, 1061.85f, 868.71f, 1496.11f);
    	testCase.addPlanInfo("Select__Rx:246", "AKMC", false, 360.65f, 793.49f, 649.17f, 1118.01f);
    	testCase.addPlanInfo("Select Plus__Rx:C2", "PRF", true, 799.38f, 1758.78f, 1438.88f, 2478.07f);
    	testCase.addPlanInfo("Select Plus__Rx:C2", "AB6M", false, 716.24f, 1575.85f, 1289.23f, 2220.33f);
    	testCase.addPlanInfo("Select Plus__Rx:C2", "AKLE", false, 525.55f, 1156.30f, 945.99f, 1629.20f);
    	testCase.addPlanInfo("Select Plus__Rx:245", "PQU", true, 903.16f, 1987.11f, 1625.68f, 2799.78f);
    	testCase.addPlanInfo("Select Plus__Rx:245", "PS7", false, 756.70f, 1664.87f, 1362.06f, 2345.76f);
    	testCase.addPlanInfo("Select Plus__Rx:245", "AKLA", false, 636.21f, 1399.77f, 1145.18f, 1972.24f);
    	
        validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testG2() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/G2 Software Systems So Cal GRx Multi-Option Proposal Exhibit 9-17   Test.xlsm");
        testCase.setRfpQuoteOptions(Arrays.asList("Signature__Rx:3JF", "Advantage__Rx:3JF", "Focus__Rx:3JF", "Alliance__Rx:3JF", "Choice Plus__Rx:245-X", "Select Plus__Rx:245-X"));

        //expected plan count
        testCase.addNumPlansPerOption("Signature__Rx:3JF", 35);
        testCase.addNumPlansPerOption("Advantage__Rx:3JF", 35);
        testCase.addNumPlansPerOption("Focus__Rx:3JF", 35);
        testCase.addNumPlansPerOption("Alliance__Rx:3JF", 35);
        testCase.addNumPlansPerOption("Choice Plus__Rx:245-X", 35);
        testCase.addNumPlansPerOption("Select Plus__Rx:245-X", 35);
        //expected rx count
        testCase.addNumRxPlansPerOptions("Signature__Rx:3JF", 1);
        testCase.addNumRxPlansPerOptions("Advantage__Rx:3JF", 1);
        testCase.addNumRxPlansPerOptions("Focus__Rx:3JF", 1);
        testCase.addNumRxPlansPerOptions("Alliance__Rx:3JF", 1);
        testCase.addNumRxPlansPerOptions("Choice Plus__Rx:245-X", 1);
        testCase.addNumRxPlansPerOptions("Select Plus__Rx:245-X", 1);

    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Signature__Rx:3JF", "Y8S", true, 724.81f, 1449.62f, 1311.91f, 2174.43f);
    	testCase.addPlanInfo("Signature__Rx:3JF", "UF8", false, 682.05f, 1364.10f, 1234.51f, 2046.15f);
    	testCase.addPlanInfo("Advantage__Rx:3JF", "YH1", true, 660.99f, 1321.98f, 1196.39f, 1982.97f);
    	testCase.addPlanInfo("Advantage__Rx:3JF", "URV", false, 622.34f, 1244.68f, 1126.44f, 1867.02f);
    	testCase.addPlanInfo("Focus__Rx:3JF", "U76", true, 630.47f, 1260.94f, 1141.15f, 1891.41f);
    	testCase.addPlanInfo("Focus__Rx:3JF", "U2F", false, 593.83f, 1187.66f, 1074.83f, 1781.49f);
    	testCase.addPlanInfo("Alliance__Rx:3JF", "UN0", true, 682.84f, 1365.68f, 1235.94f, 2048.52f);
    	testCase.addPlanInfo("Alliance__Rx:3JF", "Y0J", false, 642.84f, 1285.68f, 1163.54f, 1928.52f);
    	testCase.addPlanInfo("Choice Plus__Rx:245-X", "474", true, 1049.22f, 2098.44f, 1899.09f, 3147.66f);
    	testCase.addPlanInfo("Choice Plus__Rx:245-X", "500", false, 860.72f, 1721.44f, 1557.90f, 2582.16f);
    	testCase.addPlanInfo("Select Plus__Rx:245-X", "PQ4", true, 969.91f, 1939.82f, 1755.54f, 2909.73f);
    	testCase.addPlanInfo("Select Plus__Rx:245-X", "PSZ", false, 843.26f, 1686.52f, 1526.30f, 2529.78f);

    	validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testHakes() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/Hakes Sash & Door, Inc. No Cal GRx  - Multi Option Exhibits.xlsm");
        testCase.setRfpQuoteOptions(Arrays.asList("Signature__Rx:337", "Advantage__Rx:337", "Alliance__Rx:337", "Focus__Rx:337", 
        		"Select Plus__Rx:467", "Core__Rx:467", "Navigate__Rx:467", 
        		"Select Plus HSA__Rx:0B-HSA", "Core HSA__Rx:0B-HSA", "Navigate HSA__Rx:0B-HSA"));

        //expected plan count
        testCase.addNumPlansPerOption("Signature__Rx:337", 33);
        testCase.addNumPlansPerOption("Advantage__Rx:337", 33);
        testCase.addNumPlansPerOption("Alliance__Rx:337", 33);
        testCase.addNumPlansPerOption("Focus__Rx:337", 33);
        testCase.addNumPlansPerOption("Select Plus__Rx:467", 12);
        testCase.addNumPlansPerOption("Core__Rx:467", 12);
        testCase.addNumPlansPerOption("Navigate__Rx:467", 12);
        testCase.addNumPlansPerOption("Select Plus HSA__Rx:0B-HSA", 18);
        testCase.addNumPlansPerOption("Core HSA__Rx:0B-HSA", 18);
        testCase.addNumPlansPerOption("Navigate HSA__Rx:0B-HSA", 17);
        //expected rx count
        testCase.addNumRxPlansPerOptions("Signature__Rx:337", 2);
        testCase.addNumRxPlansPerOptions("Advantage__Rx:337", 2);
        testCase.addNumRxPlansPerOptions("Alliance__Rx:337", 2);
        testCase.addNumRxPlansPerOptions("Focus__Rx:337", 2);
        testCase.addNumRxPlansPerOptions("Select Plus__Rx:467", 2);
        testCase.addNumRxPlansPerOptions("Core__Rx:467", 2);
        testCase.addNumRxPlansPerOptions("Navigate__Rx:467", 2);
        testCase.addNumRxPlansPerOptions("Select Plus HSA__Rx:0B-HSA", 2);
        testCase.addNumRxPlansPerOptions("Core HSA__Rx:0B-HSA", 2);
        testCase.addNumRxPlansPerOptions("Navigate HSA__Rx:0B-HSA", 2);

    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Signature__Rx:337", "Y9N", true, 398.55f, 872.82f, 757.25f, 1211.59f);
    	testCase.addPlanInfo("Signature__Rx:337", "UKG", false, 313.16f, 685.82f, 595.00f, 952.01f);
    	testCase.addPlanInfo("Signature__Rx:337", "45X", false, 1.026f, 1.026f, 1.026f, 1.026f);
    	testCase.addPlanInfo("Advantage__Rx:337", "YJ1", true, 368.11f, 806.16f, 699.41f, 1119.05f);
    	testCase.addPlanInfo("Advantage__Rx:337", "45X", false, 1.026f, 1.026f, 1.026f, 1.026f);
    	testCase.addPlanInfo("Alliance__Rx:337", "UMV", true, 383.21f, 839.23f, 728.10f, 1164.96f);
    	testCase.addPlanInfo("Alliance__Rx:337", "45X", false, 1.026f, 1.026f, 1.026f, 1.026f);
    	testCase.addPlanInfo("Focus__Rx:337", "U80", true, 350.57f, 767.75f, 666.08f, 1065.73f);
    	testCase.addPlanInfo("Focus__Rx:337", "45X", false, 1.026f, 1.026f, 1.026f, 1.026f);
    	testCase.addPlanInfo("Select Plus__Rx:467", "AKK2", true, 364.80f, 798.91f, 693.12f, 1108.99f);
    	testCase.addPlanInfo("Select Plus__Rx:467", "AQ", false, 1f, 1f, 1f, 1f);
    	testCase.addPlanInfo("Core__Rx:467", "AKHC", true, 351.58f, 769.96f, 668.00f, 1068.80f);
    	testCase.addPlanInfo("Core__Rx:467", "AQ", false, 1f, 1f, 1f, 1f);
    	testCase.addPlanInfo("Navigate__Rx:467", "ANAG", true, 330.96f, 724.80f, 628.82f, 1006.12f);
    	testCase.addPlanInfo("Navigate__Rx:467", "AQ", false, 1f, 1f, 1f, 1f);
    	testCase.addPlanInfo("Select Plus HSA__Rx:0B-HSA", "AJ3I", true, 287.91f, 630.52f, 547.03f, 875.25f);
    	testCase.addPlanInfo("Select Plus HSA__Rx:0B-HSA", "239-HSA", false, 1.017f, 1.017f, 1.017f, 1.017f);
    	testCase.addPlanInfo("Core HSA__Rx:0B-HSA", "AJ3T", true, 277.47f, 607.66f, 527.19f, 843.51f);
    	testCase.addPlanInfo("Core HSA__Rx:0B-HSA", "239-HSA", false, 1.017f, 1.017f, 1.017f, 1.017f);
    	testCase.addPlanInfo("Navigate HSA__Rx:0B-HSA", "ANCG", true, 257.33f, 563.55f, 488.93f, 782.28f);
    	testCase.addPlanInfo("Navigate HSA__Rx:0B-HSA", "239-HSA", false, 1.018f, 1.018f, 1.018f, 1.018f);
    	
        validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testHiTech() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/Hi Tech Honeycomb So Cal GRx Regular Exhibit 7.2017.xlsm");
//    	testCase.setRfpQuoteNetworks(Arrays.asList("Core", "Select Plus", "Select Plus HSA", "Core HSA"));
    	
        validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testIBoss() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/iboss Inc So Cal  EASY Quote Test 7.1.2017.xlsm");
//    	testCase.setRfpQuoteNetworks(Arrays.asList("Core", "Select Plus", "Select Plus HSA", "Core HSA"));
    	
        validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testMitu() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/MITU_2017 So Cal GRx  Alongside Kaiser Multi-Option Proposal.xlsm");
//    	testCase.setRfpQuoteNetworks(Arrays.asList("Core", "Select Plus", "Select Plus HSA", "Core HSA"));
    	
        validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testMitu2() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/Mitu_2017 So GRx Multi-Option Alongside Kaiser with RX alternates.xlsm");
//    	testCase.setRfpQuoteNetworks(Arrays.asList("Core", "Select Plus", "Select Plus HSA", "Core HSA"));
    	
        validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testProdege() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/Prodege So Cal EASY Test Quote.xlsm");
//    	testCase.setRfpQuoteNetworks(Arrays.asList("Core", "Select Plus", "Select Plus HSA", "Core HSA"));
    	
        validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testTapia() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.MEDICAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2017SampleQuotes/Tapia Brothers So Cal EASY Quote.xlsm");
//    	testCase.setRfpQuoteNetworks(Arrays.asList("Core", "Select Plus", "Select Plus HSA", "Core HSA"));
    	
        validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testDental_DualDPPODPPO_AltPPO() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.DENTAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Dental/D_DualOptionDPPO-DPPO-AlternativePPO_fast.xlsx");
    	testCase.setRfpQuoteOptions(Arrays.asList("Options PPO 20__Plan:2P351", "Options PPO 20__Plan:P9332"));
    	testCase.addNumPlansPerOption("Options PPO 20__Plan:2P351", 1);
    	testCase.addNumPlansPerOption("Options PPO 20__Plan:P9332", 2);
    	
    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Options PPO 20__Plan:2P351", "2P351", true, 24.50f, 52.97f, 63.50f, 91.44f);
    	testCase.addPlanInfo("Options PPO 20__Plan:P9332", "P9332", true, 34.75f, 72.73f, 80.83f, 119.27f);
    	testCase.addPlanInfo("Options PPO 20__Plan:P9332", "P2377", false, 38.91f, 81.44f, 90.51f, 133.55f);

    	validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testDental_DualDPPODHMO() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.DENTAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Dental/D_DualOptionDPPO-DHMO_fast.xlsx");
    	testCase.setRfpQuoteOptions(Arrays.asList("Options PPO 30__Plan:NEW_38831900207 CS0", "Full Network__Plan:D176H"));
    	testCase.addNumPlansPerOption("Options PPO 30__Plan:NEW_38831900207 CS0", 1);
    	testCase.addNumPlansPerOption("Full Network__Plan:D176H", 1);
    	
    	// Sampling of plans to be spot-checked
    	List<BenefitInfo> benefitInfos = new ArrayList<BenefitInfo>();
    	benefitInfos.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "IN", "50"));
    	benefitInfos.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "OUT", "50"));
    	benefitInfos.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "IN", "150"));
    	benefitInfos.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "OUT", "150"));
    	benefitInfos.add(new BenefitInfo("WAIVED_FOR_PREVENTIVE", "STRING", "IN", "No"));
    	benefitInfos.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "IN", "1000"));
    	benefitInfos.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "OUT", "1000"));
    	benefitInfos.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "IN", "100"));
    	benefitInfos.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "OUT", "100"));
    	benefitInfos.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "IN", "80"));
    	benefitInfos.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "OUT", "80"));
    	benefitInfos.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "IN", "50"));
    	benefitInfos.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "OUT", "50"));
    	benefitInfos.add(new BenefitInfo("REIMBURSEMENT_SCHEDULE", "STRING", "IN", "UCR 90th"));
    	testCase.addPlanInfo("Options PPO 30__Plan:NEW_38831900207 CS0", "NEW_38831900207 CS0", true, 32.86f, 66.89f, 71.96f, 113.24f, benefitInfos, true);
    	testCase.addPlanInfo("Full Network__Plan:D176H", "D176H", true, 12.49f, 23.73f, 24.99f, 35.6f);

    	validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testDental_SingleDPPO() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.DENTAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Dental/D_SingleOptionDPPO_fast.xlsx");
    	testCase.setRfpQuoteOptions(Arrays.asList("Options PPO 30__Plan:NEW_3860996_V1 CS0"));
    	testCase.addNumPlansPerOption("Options PPO 30__Plan:NEW_3860996_V1 CS0", 1);
    	
    	// Sampling of plans to be spot-checked
    	List<BenefitInfo> benefitInfos = new ArrayList<BenefitInfo>();
    	benefitInfos.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "IN", "50"));
    	benefitInfos.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "OUT", "50"));
    	benefitInfos.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "IN", "150"));
    	benefitInfos.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "OUT", "150"));
    	benefitInfos.add(new BenefitInfo("WAIVED_FOR_PREVENTIVE", "STRING", "IN", "No"));
    	benefitInfos.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "IN", "1500"));
    	benefitInfos.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "OUT", "1500"));
    	benefitInfos.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "IN", "100"));
    	benefitInfos.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "OUT", "100"));
    	benefitInfos.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "IN", "90"));
    	benefitInfos.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "OUT", "90"));
    	benefitInfos.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "IN", "60"));
    	benefitInfos.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "OUT", "60"));
    	benefitInfos.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "PERCENT", "IN", "50"));
    	benefitInfos.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "PERCENT", "OUT", "50"));
    	benefitInfos.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "IN", "1500"));
    	benefitInfos.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "OUT", "1500"));
    	benefitInfos.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "IN", "Adult & Child"));
    	benefitInfos.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "OUT", "Adult & Child"));
    	benefitInfos.add(new BenefitInfo("REIMBURSEMENT_SCHEDULE", "STRING", "IN", "UCR 90th"));
    	testCase.addPlanInfo("Options PPO 30__Plan:NEW_3860996_V1 CS0", "NEW_3860996_V1 CS0", true, 46.98f, 89.62f, 113.7f, 157.26f, benefitInfos, true);

    	validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testDental_DualDPPO() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.DENTAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Dental/D_DualOptionDPPO_fast.xlsx");
    	testCase.setRfpQuoteOptions(Arrays.asList("Options PPO 20__Plan:NEW_3940900127 CS1", "Options PPO 20__Plan:NEW_3942900318 CS1"));
    	testCase.addNumPlansPerOption("Options PPO 20__Plan:NEW_3940900127 CS1", 1);
    	testCase.addNumPlansPerOption("Options PPO 20__Plan:NEW_3942900318 CS1", 1);
    	
    	// Sampling of plans to be spot-checked
    	List<BenefitInfo> benefitInfos = new ArrayList<BenefitInfo>();
    	benefitInfos.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "IN", "50"));
    	benefitInfos.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "OUT", "50"));
    	benefitInfos.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "IN", "150"));
    	benefitInfos.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "OUT", "150"));
    	benefitInfos.add(new BenefitInfo("WAIVED_FOR_PREVENTIVE", "STRING", "IN", "No"));
    	benefitInfos.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "IN", "1000"));
    	benefitInfos.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "OUT", "1000"));
    	benefitInfos.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "IN", "100"));
    	benefitInfos.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "OUT", "100"));
    	benefitInfos.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "IN", "90"));
    	benefitInfos.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "OUT", "80"));
    	benefitInfos.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "IN", "50"));
    	benefitInfos.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "OUT", "25"));
    	benefitInfos.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "PERCENT", "IN", "50"));
    	benefitInfos.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "PERCENT", "OUT", "50"));
    	benefitInfos.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "IN", "1000"));
    	benefitInfos.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "OUT", "1000"));
    	benefitInfos.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "IN", "Child Only (Up to Age 19)"));
    	benefitInfos.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "OUT", "Child Only (Up to Age 19)"));
    	benefitInfos.add(new BenefitInfo("REIMBURSEMENT_SCHEDULE", "STRING", "IN", "MAC"));
    	testCase.addPlanInfo("Options PPO 20__Plan:NEW_3940900127 CS1", "NEW_3940900127 CS1", true, 28.23f, 61.03f, 73.16f, 105.36f, benefitInfos, true);

    	List<BenefitInfo> benefitInfos2 = new ArrayList<BenefitInfo>();
    	benefitInfos2.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "IN", "50"));
    	benefitInfos2.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "OUT", "50"));
    	benefitInfos2.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "IN", "150"));
    	benefitInfos2.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "OUT", "150"));
    	benefitInfos2.add(new BenefitInfo("WAIVED_FOR_PREVENTIVE", "STRING", "IN", "No"));
    	benefitInfos2.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "IN", "1500"));
    	benefitInfos2.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "OUT", "1500"));
    	benefitInfos2.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "IN", "100"));
    	benefitInfos2.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "OUT", "100"));
    	benefitInfos2.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "IN", "90"));
    	benefitInfos2.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "OUT", "80"));
    	benefitInfos2.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "IN", "60"));
    	benefitInfos2.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "OUT", "50"));
    	benefitInfos2.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "PERCENT", "IN", "50"));
    	benefitInfos2.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "PERCENT", "OUT", "50"));
    	benefitInfos2.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "IN", "1000"));
    	benefitInfos2.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "OUT", "1000"));
    	benefitInfos2.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "IN", "Child Only (Up to Age 19)"));
    	benefitInfos2.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "OUT", "Child Only (Up to Age 19)"));
    	benefitInfos2.add(new BenefitInfo("REIMBURSEMENT_SCHEDULE", "STRING", "IN", "MAC"));
    	testCase.addPlanInfo("Options PPO 20__Plan:NEW_3942900318 CS1", "NEW_3942900318 CS1", true, 40.05f, 83.82f, 93.16f, 137.46f, benefitInfos2, true);

    	validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testDental_SingleDPPO_AltPPO() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.DENTAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Dental/D_SingleOptionDPPO-AlternativePPO_fast.xlsx");
    	testCase.setRfpQuoteOptions(Arrays.asList("Options PPO 20__Plan:NEW_3940127_V1 CS1"));//, "Options PPO 20__Plan:NEW_3945539 CS1"));
    	testCase.addNumPlansPerOption("Options PPO 20__Plan:NEW_3940127_V1 CS1", 2);
//    	testCase.addNumPlansPerOption("Options PPO 20__Plan:NEW_3945539 CS1", 1);
    	
    	// Sampling of plans to be spot-checked
    	List<BenefitInfo> benefitInfos = new ArrayList<BenefitInfo>();
    	benefitInfos.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "IN", "50"));
    	benefitInfos.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "OUT", "50"));
    	benefitInfos.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "IN", "150"));
    	benefitInfos.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "OUT", "150"));
    	benefitInfos.add(new BenefitInfo("WAIVED_FOR_PREVENTIVE", "STRING", "IN", "No"));
    	benefitInfos.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "IN", "1000"));
    	benefitInfos.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "OUT", "1000"));
    	benefitInfos.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "IN", "100"));
    	benefitInfos.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "OUT", "100"));
    	benefitInfos.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "IN", "90"));
    	benefitInfos.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "OUT", "80"));
    	benefitInfos.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "IN", "50"));
    	benefitInfos.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "OUT", "25"));
    	benefitInfos.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "PERCENT", "IN", "50"));
    	benefitInfos.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "PERCENT", "OUT", "50"));
    	benefitInfos.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "IN", "1000"));
    	benefitInfos.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "OUT", "1000"));
    	benefitInfos.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "IN", "Child Only (Up to Age 19)"));
    	benefitInfos.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "OUT", "Child Only (Up to Age 19)"));
    	benefitInfos.add(new BenefitInfo("REIMBURSEMENT_SCHEDULE", "STRING", "IN", "MAC"));
    	testCase.addPlanInfo("Options PPO 20__Plan:NEW_3940127_V1 CS1", "NEW_3940127_V1 CS1", true, 24.5f, 52.97f, 63.5f, 91.44f, benefitInfos, true);

    	List<BenefitInfo> benefitInfos2 = new ArrayList<BenefitInfo>();
    	benefitInfos2.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "IN", "50"));
    	benefitInfos2.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "OUT", "50"));
    	benefitInfos2.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "IN", "150"));
    	benefitInfos2.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "OUT", "150"));
    	benefitInfos2.add(new BenefitInfo("WAIVED_FOR_PREVENTIVE", "STRING", "IN", "No"));
    	benefitInfos2.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "IN", "5000"));
    	benefitInfos2.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "OUT", "5000"));
    	benefitInfos2.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "IN", "100"));
    	benefitInfos2.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "OUT", "100"));
    	benefitInfos2.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "IN", "90"));
    	benefitInfos2.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "OUT", "80"));
    	benefitInfos2.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "IN", "60"));
    	benefitInfos2.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "OUT", "50"));
    	benefitInfos2.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "PERCENT", "IN", "50"));
    	benefitInfos2.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "PERCENT", "OUT", "50"));
    	benefitInfos2.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "IN", "1000"));
    	benefitInfos2.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "OUT", "1000"));
    	benefitInfos2.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "IN", "Child Only (Up to Age 19)"));
    	benefitInfos2.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "OUT", "Child Only (Up to Age 19)"));
    	benefitInfos2.add(new BenefitInfo("REIMBURSEMENT_SCHEDULE", "STRING", "IN", "MAC"));
    	testCase.addPlanInfo("Options PPO 20__Plan:NEW_3940127_V1 CS1", "NEW_3945539 CS1", false, 38.91f, 81.44f, 90.51f, 133.55f, benefitInfos2, true);
//    	testCase.addPlanInfo("Options PPO 20__Plan:NEW_3945539 CS1", "NEW_3945539 CS1", true, 38.91f, 81.44f, 90.51f, 133.55f, benefitInfos2);

    	validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testDental_TripleDPPODPPODHMO_AltHMO() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.DENTAL);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Dental/D_TrippleOption-DPPO-DPPO-DHMO-AlternativeDHMO_fast.xlsx");
    	testCase.setRfpQuoteOptions(Arrays.asList("Options PPO 30__Plan:NEW_3883207 CS0", "Options PPO 30__Plan:NEW_3883208 CS0", "Full Network__Plan:D176H"));
    	testCase.addNumPlansPerOption("Options PPO 30__Plan:NEW_3883207 CS0", 1);
    	testCase.addNumPlansPerOption("Options PPO 30__Plan:NEW_3883208 CS0", 1);
    	testCase.addNumPlansPerOption("Full Network__Plan:D176H", 2);
    	
    	// Sampling of plans to be spot-checked
    	List<BenefitInfo> benefitInfos = new ArrayList<BenefitInfo>();
    	benefitInfos.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "IN", "50"));
    	benefitInfos.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "OUT", "50"));
    	benefitInfos.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "IN", "150"));
    	benefitInfos.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "OUT", "150"));
    	benefitInfos.add(new BenefitInfo("WAIVED_FOR_PREVENTIVE", "STRING", "IN", "No"));
    	benefitInfos.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "IN", "1000"));
    	benefitInfos.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "OUT", "1000"));
    	benefitInfos.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "IN", "100"));
    	benefitInfos.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "OUT", "100"));
    	benefitInfos.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "IN", "80"));
    	benefitInfos.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "OUT", "80"));
    	benefitInfos.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "IN", "50"));
    	benefitInfos.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "OUT", "50"));
    	benefitInfos.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "STRING", "IN", "Not Covered"));
    	benefitInfos.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "STRING", "OUT", "Not Covered"));
    	benefitInfos.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "STRING", "IN", "Not Covered"));
    	benefitInfos.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "STRING", "OUT", "Not Covered"));
    	benefitInfos.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "IN", "Not Covered"));
    	benefitInfos.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "OUT", "Not Covered"));
    	benefitInfos.add(new BenefitInfo("REIMBURSEMENT_SCHEDULE", "STRING", "IN", "UCR 90th"));
    	//TODO: Revisit this next week testCase.addPlanInfo("Options PPO 30__Plan:NEW_3883207 CS0", "NEW_3883207 CS0", true, 32.86f, 66.89f, 71.96f, 113.24f, benefitInfos, true);

    	List<BenefitInfo> benefitInfos2 = new ArrayList<BenefitInfo>();
    	benefitInfos2.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "IN", "25"));
    	benefitInfos2.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "OUT", "50"));
    	benefitInfos2.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "IN", "50"));
    	benefitInfos2.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "OUT", "150"));
    	benefitInfos2.add(new BenefitInfo("WAIVED_FOR_PREVENTIVE", "STRING", "IN", "No"));
    	benefitInfos2.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "IN", "3000"));
    	benefitInfos2.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "OUT", "3000"));
    	benefitInfos2.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "IN", "100"));
    	benefitInfos2.add(new BenefitInfo("CLASS_1_PREVENTIVE", "PERCENT", "OUT", "100"));
    	benefitInfos2.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "IN", "90"));
    	benefitInfos2.add(new BenefitInfo("CLASS_2_BASIC", "PERCENT", "OUT", "80"));
    	benefitInfos2.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "IN", "60"));
    	benefitInfos2.add(new BenefitInfo("CLASS_3_MAJOR", "PERCENT", "OUT", "50"));
    	benefitInfos2.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "PERCENT", "IN", "50"));
    	benefitInfos2.add(new BenefitInfo("CLASS_4_ORTHODONTIA", "PERCENT", "OUT", "50"));
    	benefitInfos2.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "IN", "1500"));
    	benefitInfos2.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "OUT", "1500"));
    	benefitInfos2.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "IN", "Child Only (Up to Age 19)"));
    	benefitInfos2.add(new BenefitInfo("ORTHO_ELIGIBILITY", "STRING", "OUT", "Child Only (Up to Age 19)"));
    	benefitInfos2.add(new BenefitInfo("REIMBURSEMENT_SCHEDULE", "STRING", "IN", "UCR 90th"));
    	testCase.addPlanInfo("Options PPO 30__Plan:NEW_3883208 CS0", "NEW_3883208 CS0", true, 37.29f, 76.97f, 93.78f, 132.85f, benefitInfos2, true);

    	testCase.addPlanInfo("Full Network__Plan:D176H", "D176H", true, 12.49f, 23.73f, 24.99f, 35.6f);
    	testCase.addPlanInfo("Full Network__Plan:D176H", "D126H", false, 15.51f, 29.47f, 31.03f, 44.21f);

    	validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testVision_Single_OneAlternative() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.VISION);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Vision/V_SingleOption-OneAlternative.xlsm");
    	testCase.setRfpQuoteOptions(Arrays.asList("Full Network__Plan:VL049"));
    	testCase.addNumPlansPerOption("Full Network__Plan:VL049", 2);
    	
    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Full Network__Plan:VL049", "VL049", true, 7.31f, 13.89f, 20.39f, 0f);
    	testCase.addPlanInfo("Full Network__Plan:VL049", "VL031", false, 9.31f, 17.69f, 25.97f, 0f);

    	validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testVision_Single_OneAlternative2() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.VISION);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Vision/V_SingleOption-OneAlternative_2.xlsm");
    	testCase.setRfpQuoteOptions(Arrays.asList("Full Network__Plan:V1367"));
    	testCase.addNumPlansPerOption("Full Network__Plan:V1367", 2);
    	
    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Full Network__Plan:V1367", "V1367", true, 7.59f, 12.78f, 13.03f, 20.61f);
    	testCase.addPlanInfo("Full Network__Plan:V1367", "V1072", false, 7.09f, 13.45f, 15.78f, 22.19f);

    	validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testVision_Single() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.VISION);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Vision/V_SingleOption.xlsm");
    	testCase.setRfpQuoteOptions(Arrays.asList("Full Network__Plan:V1367"));
    	testCase.addNumPlansPerOption("Full Network__Plan:V1367", 1);
    	
    	// Sampling of plans to be spot-checked
    	testCase.addPlanInfo("Full Network__Plan:V1367", "V1367", true, 7.59f, 12.78f, 13.03f, 20.61f);

    	validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testVision_Dual() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.VISION);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Vision/V_DualOption.xlsm");
    	testCase.setRfpQuoteOptions(Arrays.asList("Full Network__Plan:V0013", "Full Network__Plan:V1008"));
    	testCase.addNumPlansPerOption("Full Network__Plan:V0013", 1);
    	testCase.addNumPlansPerOption("Full Network__Plan:V1008", 1);
    	
    	// Sampling of plans to be spot-checked
    	List<BenefitInfo> benefitInfos = new ArrayList<BenefitInfo>();
    	benefitInfos.add(new BenefitInfo("EXAMS_FREQUENCY", "NUMBER", "IN", "12"));
    	benefitInfos.add(new BenefitInfo("LENSES_FREQUENCY", "NUMBER", "IN", "0"));
    	benefitInfos.add(new BenefitInfo("FRAMES_FREQUENCY", "NUMBER", "IN", "0"));
    	benefitInfos.add(new BenefitInfo("CONTACTS_FREQUENCY", "NUMBER", "IN", "0"));
    	benefitInfos.add(new BenefitInfo("EXAM_COPAY", "DOLLAR", "IN", "10"));
    	benefitInfos.add(new BenefitInfo("MATERIALS_COPAY", "STRING", "IN", "N/A"));
    	benefitInfos.add(new BenefitInfo("FRAME_ALLOWANCE", "STRING", "IN", "N/A"));
    	benefitInfos.add(new BenefitInfo("CONTACTS_ALLOWANCE", "STRING", "IN", "N/A"));
    	testCase.addPlanInfo("Full Network__Plan:V0013", "V0013", true, 1.65f, 3.31f, 3.88f, 5.06f, benefitInfos, true);
    	testCase.addPlanInfo("Full Network__Plan:V1008", "V1008", true, 7.49f, 14.2f, 16.66f, 23.43f);

    	validator.uploadAndValidate(testCase) ;
    }
    
    @Test
    public void testVision_Single_NewNk() throws Exception {
    	UploaderTestCase testCase = new UploaderTestCase();
    	testCase.setCategory(Constants.VISION);
    	testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Vision/V_SingleOption_NewNK.xlsx");
    	testCase.setRfpQuoteOptions(Arrays.asList("Full Network__Plan:V1367_NK"));
    	testCase.addNumPlansPerOption("Full Network__Plan:V1367_NK", 1);
    	
    	// Sampling of plans to be spot-checked
    	List<BenefitInfo> benefitInfos = new ArrayList<BenefitInfo>();
    	benefitInfos.add(new BenefitInfo("EXAMS_FREQUENCY", "NUMBER", "IN", "12"));
    	benefitInfos.add(new BenefitInfo("LENSES_FREQUENCY", "NUMBER", "IN", "12"));
    	benefitInfos.add(new BenefitInfo("FRAMES_FREQUENCY", "NUMBER", "IN", "24"));
    	benefitInfos.add(new BenefitInfo("CONTACTS_FREQUENCY", "NUMBER", "IN", "12"));
    	benefitInfos.add(new BenefitInfo("EXAM_COPAY", "DOLLAR", "IN", "10"));
    	benefitInfos.add(new BenefitInfo("MATERIALS_COPAY", "DOLLAR", "IN", "25"));
    	benefitInfos.add(new BenefitInfo("FRAME_ALLOWANCE", "DOLLAR", "IN", "130"));
    	benefitInfos.add(new BenefitInfo("CONTACTS_ALLOWANCE", "DOLLAR", "IN", "125"));
    	testCase.addPlanInfo("Full Network__Plan:V1367_NK", "V1367_NK", true, 7.59f, 12.78f, 13.03f, 20.61f, benefitInfos, true);

    	validator.uploadAndValidate(testCase) ;
    }


    @Test(expected = BaseException.class)
    public void testMedical_TierRateValidation_PostProcessing() throws Exception {
        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.MEDICAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Medical/2018SampleQuotes/INDIAN RIDGE COUNTRY CLUB_Exhibit_3Tier_MissingTier3_BecauseOfHiddenRowsOnExhibitSheet.xlsm");

        validator.uploadAndValidate(testCase) ;
    }

    @Test
    public void testDental_eDriving() throws Exception {
        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.DENTAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/UHC/Dental/eDriving LLC - UHC Dental Quote - 0618 DS - test.xlsm");
        testCase.setRfpQuoteOptions(Arrays.asList(
                "Options PPO 30__Plan:2P211 CS0",
                "Options PPO 30__Plan:2P213 CS0",
                "Options PPO 20__Plan:P0204 CS0",
                "Full Network__Plan:D175H"));
        
        // Sampling of plans to be spot-checked
        List<BenefitInfo> benefitInfos1 = new ArrayList<BenefitInfo>();
        benefitInfos1.add(new BenefitInfo("DENTAL_INDIVIDUAL", "STRING", "IN", "N/A"));
        benefitInfos1.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "OUT", "25"));
        benefitInfos1.add(new BenefitInfo("DENTAL_FAMILY", "STRING", "IN", "N/A"));
        benefitInfos1.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "OUT", "75"));
        benefitInfos1.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "IN", "1250"));
        benefitInfos1.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "OUT", "1250"));
        benefitInfos1.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "IN", "1250"));
        benefitInfos1.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "OUT", "1250"));
        benefitInfos1.add(new BenefitInfo("REIMBURSEMENT_SCHEDULE", "STRING", "IN", "UCR 90th"));
        
        testCase.addPlanInfo("Options PPO 30__Plan:2P211 CS0", "2P211 CS0", true, 49.36f, 98.72f, 103.42f, 158.41f, benefitInfos1, true);

        List<BenefitInfo> benefitInfos2 = new ArrayList<BenefitInfo>();
        benefitInfos2.add(new BenefitInfo("DENTAL_INDIVIDUAL", "STRING", "IN", "N/A"));
        benefitInfos2.add(new BenefitInfo("DENTAL_INDIVIDUAL", "STRING", "OUT", "N/A"));
        benefitInfos2.add(new BenefitInfo("DENTAL_FAMILY", "STRING", "IN", "N/A"));
        benefitInfos2.add(new BenefitInfo("DENTAL_FAMILY", "STRING", "OUT", "N/A"));
        benefitInfos2.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "IN", "1250"));
        benefitInfos2.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "OUT", "1250"));
        benefitInfos2.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "IN", "1250"));
        benefitInfos2.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "OUT", "1250"));
        benefitInfos2.add(new BenefitInfo("REIMBURSEMENT_SCHEDULE", "STRING", "IN", "N/A"));

        testCase.addPlanInfo("Options PPO 30__Plan:2P213 CS0", "2P213 CS0", true, 49.36f, 98.72f, 103.42f, 158.41f, benefitInfos2, true);

        List<BenefitInfo> benefitInfos3 = new ArrayList<BenefitInfo>();
        benefitInfos3.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "IN", "50"));
        benefitInfos3.add(new BenefitInfo("DENTAL_INDIVIDUAL", "DOLLAR", "OUT", "50"));
        benefitInfos3.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "IN", "150"));
        benefitInfos3.add(new BenefitInfo("DENTAL_FAMILY", "DOLLAR", "OUT", "150"));
        benefitInfos3.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "STRING", "IN", "N/A"));
        benefitInfos3.add(new BenefitInfo("CALENDAR_YEAR_MAXIMUM", "DOLLAR", "OUT", "1000"));
        benefitInfos3.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "DOLLAR", "IN", "1000"));
        benefitInfos3.add(new BenefitInfo("ORTHODONTIA_LIFETIME_MAX", "STRING", "OUT", "N/A"));
        benefitInfos3.add(new BenefitInfo("REIMBURSEMENT_SCHEDULE", "STRING", "IN", "MAC"));

        testCase.addPlanInfo("Options PPO 20__Plan:P0204 CS0", "P0204 CS0", true, 35.28f, 70.56f, 73.91f, 113.21f, benefitInfos3, true);
        
        validator.uploadAndValidate(testCase) ;
    }

    
    public void testUpdateCustomPlan() throws Exception {

        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(Constants.UHC_CARRIER, Constants.UHC_CARRIER);
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.DENTAL);
        testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        List<BenefitName> benefitNames = benefitNameRepository.findAll();

        List<UHCNetworkDetails> data = new ArrayList<UHCNetworkDetails>();

        UHCNetworkDetails prevNetwork = new UHCNetworkDetails();
        prevNetwork.setNetworkName("Options PPO 30");
        prevNetwork.setNetworkType("DPPO");
        prevNetwork.setFullPlanName("Test Update Custom Plan");
        prevNetwork.setTier1Rate("1");
        prevNetwork.setTier2Rate("2");
        prevNetwork.setTier3Rate("3");
        prevNetwork.setTier4Rate("4");
        prevNetwork.getGenericPlanDetails().addBenefit(benefitNames, "DENTAL_INDIVIDUAL", "IN", "$11");
        prevNetwork.getGenericPlanDetails().addBenefit(benefitNames, "DENTAL_FAMILY", "IN", "$22");

        // save new custom plan
        data.add(prevNetwork);
        RfpQuote prevQuote = loader.saveDentalAndVisionQuotes(data, client.getClientId(),
                client.getBroker().getBrokerId(), QuoteType.STANDARD, Constants.DENTAL, "", 4, false);

        assertThat(prevQuote.getRfpQuoteNetworks()).hasSize(1);
        assertThat(prevQuote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName()).isEqualTo(
                "Options PPO 30__Plan:Test Update Custom Plan");
        assertThat(prevQuote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans()).hasSize(1);

        RfpQuoteNetworkPlan prevNetworkPlan =
                prevQuote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().get(0);

        PlanNameByNetwork prevPnn = prevNetworkPlan.getPnn();

        assertThat(prevPnn.getName()).isEqualTo("Test Update Custom Plan");
        assertThat(prevNetworkPlan.getTier1Rate()).isEqualTo(1f);
        assertThat(prevNetworkPlan.getTier2Rate()).isEqualTo(2f);
        assertThat(prevNetworkPlan.getTier3Rate()).isEqualTo(3f);
        assertThat(prevNetworkPlan.getTier4Rate()).isEqualTo(4f);

        List<Benefit> prevBenefits = benefitRepository.findByPlanId(prevPnn.getPlan().getPlanId());
        assertThat(prevBenefits).hasSize(2);
        for (Benefit prevBenefit : prevBenefits) {
            if (prevBenefit.getBenefitName().getName().equals("DENTAL_INDIVIDUAL")) {
                assertThat(prevBenefit.getValue()).isEqualTo("11");
                assertThat(prevBenefit.getFormat()).isEqualTo("DOLLAR");
            } else if (prevBenefit.getBenefitName().getName().equals("DENTAL_FAMILY")) {
                assertThat(prevBenefit.getValue()).isEqualTo("22");
                assertThat(prevBenefit.getFormat()).isEqualTo("DOLLAR");
            } else {
                fail("Unexpected benefit: " + prevBenefit.getBenefitName().getName());
            }
        }

        UHCNetworkDetails newNetwork = new UHCNetworkDetails();
        newNetwork.setNetworkName("Options PPO 30");
        newNetwork.setNetworkType("DPPO");
        newNetwork.setFullPlanName("Test Update Custom Plan");
        newNetwork.setTier1Rate("5");
        newNetwork.setTier2Rate("6");
        newNetwork.setTier3Rate("7");
        newNetwork.setTier4Rate("8");
        newNetwork.getGenericPlanDetails().addBenefit(benefitNames, "DENTAL_INDIVIDUAL", "IN", "$11");
        newNetwork.getGenericPlanDetails().addBenefit(benefitNames, "DENTAL_FAMILY", "IN", "$900");
        newNetwork.getGenericPlanDetails().addBenefit(benefitNames, "CALENDAR_YEAR_MAXIMUM", "IN", "1000");

        // save custom plan with existing name
        data.clear();
        data.add(newNetwork);
        RfpQuote newQuote = loader.saveDentalAndVisionQuotes(data, client.getClientId(),
                client.getBroker().getBrokerId(), QuoteType.STANDARD, Constants.DENTAL, "", 4, false);

        assertThat(prevQuote.getRfpQuoteNetworks()).hasSize(1);
        assertThat(prevQuote.getRfpQuoteNetworks().get(0).getRfpQuoteOptionName()).isEqualTo(
                "Options PPO 30__Plan:Test Update Custom Plan");
        assertThat(prevQuote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans()).hasSize(1);

        RfpQuoteNetworkPlan newNetworkPlan =
                newQuote.getRfpQuoteNetworks().get(0).getRfpQuoteNetworkPlans().get(0);

        PlanNameByNetwork newPnn = newNetworkPlan.getPnn();

        // check if prev and new pnn are the same
        assertThat(prevPnn.getPnnId()).isEqualTo(newPnn.getPnnId());

        assertThat(newPnn.getName()).isEqualTo("Test Update Custom Plan");
        assertThat(newNetworkPlan.getTier1Rate()).isEqualTo(5f);
        assertThat(newNetworkPlan.getTier2Rate()).isEqualTo(6f);
        assertThat(newNetworkPlan.getTier3Rate()).isEqualTo(7f);
        assertThat(newNetworkPlan.getTier4Rate()).isEqualTo(8f);

        List<Benefit> newBenefits = benefitRepository.findByPlanId(newPnn.getPlan().getPlanId());
        assertThat(newBenefits).hasSize(3);
        
        for (Benefit newBenefit : prevBenefits) {
            if (newBenefit.getBenefitName().getName().equals("DENTAL_INDIVIDUAL")) {
                assertThat(newBenefit.getValue()).isEqualTo("11");
                assertThat(newBenefit.getFormat()).isEqualTo("DOLLAR");
            } else if (newBenefit.getBenefitName().getName().equals("DENTAL_FAMILY")) {
                assertThat(newBenefit.getValue()).isEqualTo("900");
                assertThat(newBenefit.getFormat()).isEqualTo("DOLLAR");
            } else if (newBenefit.getBenefitName().getName().equals("CALENDAR_YEAR_MAXIMUM")) {
                assertThat(newBenefit.getValue()).isEqualTo("1000");
                assertThat(newBenefit.getFormat()).isEqualTo("NUMBER");
            } else {
                fail("Unexpected benefit: " + newBenefit.getBenefitName().getName());
            }
        }
        
    }

    @Test
    public void testRenewalOldPpoFormat() throws Exception {
        
        FileInputStream fis = new FileInputStream(new File(currDir
            + "/data/renewal_quotes/Medical/American Integrated Services_PPO Exhibits.xlsm"));

        Client client = testEntityHelper.createTestClient();
        Long brokerId = client.getBroker().getBrokerId();

        loader.resetPlanStatistics();
        RfpQuote quote = loader.run(fis, Collections.emptyList(), client.getClientId(), brokerId, QuoteType.STANDARD, "MEDICAL",  true, true);

        assertThat(quote).isNotNull();
        assertThat(quote.getRfpQuoteNetworks())
            .hasSize(2)
            .extracting("rfpQuoteOptionName")
            .containsExactly("Select Plus__Rx:246-E", "Core__Rx:246-E");

        assertThat(quote.getDisclaimers()).hasSize(1);
        RfpQuoteDisclaimer disclaimer = quote.getDisclaimers().get(0);
        assertThat(disclaimer.getType()).isEqualTo("PPO");
        assertThat(disclaimer.getText()).contains("- Rates are guaranteed");
    }

    @Test
    public void testRenewalNewHmoFormat() throws Exception {
        
        FileInputStream fis = new FileInputStream(new File(currDir
            + "/data/renewal_quotes/Medical/American Integrated Services_HMO Exhibits.xlsm"));

        Client client = testEntityHelper.createTestClient();
        Long brokerId = client.getBroker().getBrokerId();

        loader.resetPlanStatistics();
        RfpQuote quote = loader.run(fis, Collections.emptyList(), client.getClientId(), brokerId, QuoteType.STANDARD, "MEDICAL",  true, true);

        flushAndClear();
        
        assertThat(quote).isNotNull();
        assertThat(quote.getRfpQuoteNetworks())
            .hasSize(3)
            .extracting("rfpQuoteOptionName")
            .containsExactly(
                    "Signature__Plan:U9F__Rx:3KF",
                    "Signature__Plan:U7W__Rx:30I",
                    "Advantage__Plan:UN3__Rx:3KF");
        
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(clientPlans).hasSize(2);
        
        ClientPlan cp = clientPlans.get(0);
        assertThat(cp.getTier1Census()).isEqualTo(73L);
        assertThat(cp.getTier2Census()).isEqualTo(15L);
        assertThat(cp.getTier3Census()).isEqualTo(25L);
        assertThat(cp.getTier4Census()).isEqualTo(15L);

        assertThat(cp.getTier1Rate()).isEqualTo(453.53F);
        assertThat(cp.getTier2Rate()).isEqualTo(1088.47F);
        assertThat(cp.getTier3Rate()).isEqualTo(793.67F);
        assertThat(cp.getTier4Rate()).isEqualTo(1383.27F);
        
        assertThat(quote.getRfpQuoteOptions())
            .hasSize(2)
            .extracting("rfpQuoteOptionName")
            .containsExactlyInAnyOrder("Renewal 1", "Renewal 2");
 
        RfpQuoteOption renewal1 = quote.getRfpQuoteOptions()
                .stream()
                .filter(o -> o.getName().equals("Renewal 1"))
                .findFirst()
                .orElse(null);
        
        ClientAttribute clientAttribute = client.getAttributes()
                .stream()
                .filter(a -> a.getName() == AttributeName.RENEWAL)
                .findFirst()
                .orElse(null);
        assertThat(clientAttribute).isNotNull();
        
    }

    @Test
    public void testRenewalNewHmoV2Format() throws Exception {
        
        FileInputStream fis = new FileInputStream(new File(currDir
            + "/data/renewal_quotes/Medical/American Integrated Services HMO v2.xlsx"));

        Client client = testEntityHelper.createTestClient();
        Long brokerId = client.getBroker().getBrokerId();

        loader.resetPlanStatistics();
        RfpQuote quote = loader.run(fis, Collections.emptyList(), client.getClientId(), brokerId, QuoteType.STANDARD, "MEDICAL",  true, true);

        flushAndClear();
        
        assertThat(quote).isNotNull();
        assertThat(quote.getRfpQuoteNetworks())
            .hasSize(3)
            .extracting("rfpQuoteOptionName")
            .containsExactly(
                    "Signature__Plan:U9F__Rx:3KF",
                    "Signature__Plan:U7W__Rx:331",
                    "Advantage__Plan:UN3__Rx:3KF");
        
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(clientPlans)
            .extracting("pnn")
            .extracting("name")
            .containsExactlyInAnyOrder("U9F", "U7W");
        
        ClientPlan cp = clientPlans.get(0);
        assertThat(cp.getTier1Census()).isEqualTo(73L);
        assertThat(cp.getTier2Census()).isEqualTo(15L);
        assertThat(cp.getTier3Census()).isEqualTo(25L);
        assertThat(cp.getTier4Census()).isEqualTo(15L);

        assertThat(cp.getTier1Rate()).isEqualTo(453.53F);
        assertThat(cp.getTier2Rate()).isEqualTo(1088.47F);
        assertThat(cp.getTier3Rate()).isEqualTo(793.67F);
        assertThat(cp.getTier4Rate()).isEqualTo(1383.27F);
        
        assertThat(quote.getRfpQuoteOptions())
            .hasSize(2)
            .extracting("rfpQuoteOptionName")
            .containsExactlyInAnyOrder("Renewal 1", "Renewal 2");
 
        RfpQuoteOption renewal1 = quote.getRfpQuoteOptions()
                .stream()
                .filter(o -> o.getName().equals("Renewal 1"))
                .findFirst()
                .orElse(null);
        
        ClientAttribute clientAttribute = client.getAttributes()
                .stream()
                .filter(a -> a.getName() == AttributeName.RENEWAL)
                .findFirst()
                .orElse(null);
        assertThat(clientAttribute).isNotNull();
        
    }

    @Test
    public void testLoadRenewalMedicalHmoAndPpoUhcQuotesSimultaneously() throws Exception {

        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(new Date());
        
        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();

        File file1 = new File(currDir
                + "/data/renewal_quotes/Medical/American Integrated Services_HMO Exhibits.xlsm");
        FileInputStream fis1 = new FileInputStream(file1);
        MockMultipartFile mockFile1 = new MockMultipartFile("files",file1.getName(),"xlsm",fis1);

        File file2 = new File(currDir
                + "/data/renewal_quotes/Medical/American Integrated Services_PPO Exhibits.xlsm");
        FileInputStream fis2 = new FileInputStream(file2);
        MockMultipartFile mockFile2 = new MockMultipartFile("files",file2.getName(),"xlsm",fis2);
        
        QuoteUploaderDto dto = new QuoteUploaderDto();
        dto.setAddToExisted(false);// new quote
        dto.setQuoteType(QuoteType.STANDARD);
        dto.setCategory(Constants.MEDICAL);
        dto.setRenewal(true);
        
        List<RfpQuote> currentRfpQuotes = loader.run(
                Arrays.asList(mockFile1, mockFile2), 
                client.getClientId(), 
                client.getBroker().getBrokerId(), 
                dto, 
                true, 
                true);
        
        
        assertThat(currentRfpQuotes).hasSize(1);
        RfpQuote currentRfpQuote = currentRfpQuotes.get(0);
        assertThat(currentRfpQuote.isLatest()).isTrue();
        assertThat(currentRfpQuote.getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(currentRfpQuote.getRfpQuoteNetworks()).hasSize(5);
        assertThat(currentRfpQuote.getRfpQuoteNetworks())
        .extracting(rqn -> rqn.getNetwork().getType())
        .containsExactlyInAnyOrder("HMO", "HMO", "HMO", "PPO", "PPO");

        assertThat(currentRfpQuote.getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getName())
            .containsExactlyInAnyOrder("Signature", "Signature", "Advantage", "Select Plus", "Core");
        
        assertThat(currentRfpQuote.getDisclaimers()).hasSize(1);
        RfpQuoteDisclaimer disclaimer = currentRfpQuote.getDisclaimers().get(0);
        assertThat(disclaimer.getType()).isEqualTo("PPO");
        assertThat(disclaimer.getText()).contains("- Rates are guaranteed");

        
        flushAndClear();
        
        // check client plan
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(clientPlans).hasSize(3);
        
        //check options
        List<RfpQuoteOption> newOptions = rfpQuoteOptionRepository.findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);
        assertThat(newOptions.size()).isEqualTo(2);
        RfpQuoteOption renewal1 = null;
        RfpQuoteOption renewal2 = null;
        for (RfpQuoteOption option : newOptions) {
            if ("Renewal 1".equals(option.getRfpQuoteOptionName())) { renewal1 = option; }
            else if ("Renewal 2".equals(option.getRfpQuoteOptionName())) { renewal2 = option; }
        }

        assertThat(renewal1).isNotNull();
        assertThat(renewal1.getRfpQuoteOptionNetworks())
            .hasSize(3)
            .extracting(n -> n.getRfpQuoteNetwork().getNetwork().getType())
            .containsExactlyInAnyOrder("HMO", "HMO", "PPO"); // option is created with clientPlan != null

        assertThat(renewal2).isNotNull();
        assertThat(renewal2.getRfpQuoteOptionNetworks())
            .hasSize(3)
            .extracting(n -> n.getRfpQuoteNetwork().getNetwork().getType())
            .containsExactlyInAnyOrder("HMO", "HMO", "PPO");
        
        // check riders
        RfpQuoteNetwork network = currentRfpQuote.getRfpQuoteNetworks().get(0);
        assertThat(network.getRiders()).hasSize(1);
        for (Rider rider : network.getRiders()) {
            assertThat(rider.getRiderMeta().getCode()).isEqualTo("CG9");
            assertThat(rider.getTier1Rate()).isEqualTo(4.23f);
            assertThat(rider.getTier2Rate()).isEqualTo(10.15f);
            assertThat(rider.getTier3Rate()).isEqualTo(7.40f);
            assertThat(rider.getTier4Rate()).isEqualTo(12.90f);
        }
        
        RfpQuoteOptionNetwork rqon = renewal1.getRfpQuoteOptionNetworks().get(0);
        assertThat(rqon.getSelectedRiders()).hasSize(1);
        assertThat(rqon.getSelectedRiders().iterator().next().getRiderMeta().getCode()).isEqualTo("CG9");

        
    }

    @Test
    public void testLoadRenewalMedicalHmoAndPpoUhcQuotesSimultaneouslyWithDisclaimers() throws Exception {

        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(new Date());
        
        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();

        File file1 = new File(currDir
                + "/data/renewal_quotes/Medical/Kybriba Corporation  PPO.XLSM");
        FileInputStream fis1 = new FileInputStream(file1);
        MockMultipartFile mockFile1 = new MockMultipartFile("files",file1.getName(),"xlsm",fis1);

        File file2 = new File(currDir
                + "/data/renewal_quotes/Medical/Kyriba Corporation HMO.XLSX");
        FileInputStream fis2 = new FileInputStream(file2);
        MockMultipartFile mockFile2 = new MockMultipartFile("files",file2.getName(),"xlsm",fis2);
        
        QuoteUploaderDto dto = new QuoteUploaderDto();
        dto.setAddToExisted(false);// new quote
        dto.setQuoteType(QuoteType.STANDARD);
        dto.setCategory(Constants.MEDICAL);
        dto.setRenewal(true);
        
        List<RfpQuote> currentRfpQuotes = loader.run(
                Arrays.asList(mockFile1, mockFile2), 
                client.getClientId(), 
                client.getBroker().getBrokerId(), 
                dto, 
                true, 
                true);
        
        
        assertThat(currentRfpQuotes).hasSize(1);
        RfpQuote currentRfpQuote = currentRfpQuotes.get(0);
        assertThat(currentRfpQuote.isLatest()).isTrue();
        assertThat(currentRfpQuote.getQuoteType()).isEqualTo(QuoteType.STANDARD);

        assertThat(currentRfpQuote.getDisclaimers()).hasSize(2);
        RfpQuoteDisclaimer disclaimer1 = currentRfpQuote.getDisclaimers().get(0);
        assertThat(disclaimer1.getType()).isEqualTo("PPO");
        assertThat(disclaimer1.getText()).contains("- Rates are guaranteed");

        RfpQuoteDisclaimer disclaimer2 = currentRfpQuote.getDisclaimers().get(1);
        assertThat(disclaimer2.getType()).isEqualTo("HMO");
        assertThat(disclaimer2.getText()).contains("This quote assumes");
        
    }

    
    @Test
    public void testLoadRenewalMedicalHmoAndPpoUhcQuotesSeparately() throws Exception {

        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(new Date());
        
        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();

        File file1 = new File(currDir
                + "/data/renewal_quotes/Medical/American Integrated Services_HMO Exhibits.xlsm");
        FileInputStream fis1 = new FileInputStream(file1);
        MockMultipartFile mockFile1 = new MockMultipartFile("files",file1.getName(),"xlsm",fis1);

        QuoteUploaderDto dto = new QuoteUploaderDto();
        dto.setAddToExisted(false);// new quote
        dto.setQuoteType(QuoteType.STANDARD);
        dto.setCategory(Constants.MEDICAL);
        dto.setRenewal(true);
        
        List<RfpQuote> currentRfpQuotes = loader.run(
                Arrays.asList(mockFile1), 
                client.getClientId(), 
                client.getBroker().getBrokerId(), 
                dto, 
                true, 
                true);
        
        assertThat(currentRfpQuotes).hasSize(1);
        assertThat(currentRfpQuotes.get(0).isLatest()).isTrue();
        assertThat(currentRfpQuotes.get(0).getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks()).hasSize(3);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getType())
            .containsExactlyInAnyOrder("HMO", "HMO", "HMO");

        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getName())
            .containsExactlyInAnyOrder("Signature", "Signature", "Advantage");

        flushAndClear();

        // check client plan
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(clientPlans).hasSize(2);

        //check options
        List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);
        assertThat(options.size()).isEqualTo(2);
        RfpQuoteOption renewal1 = null;
        RfpQuoteOption renewal2 = null;
        for (RfpQuoteOption option : options) {
            if ("Renewal 1".equals(option.getRfpQuoteOptionName())) { renewal1 = option; }
            else if ("Renewal 2".equals(option.getRfpQuoteOptionName())) { renewal2 = option; }
        }

        assertThat(renewal1).isNotNull();
        assertThat(renewal1.getRfpQuoteOptionNetworks())
            .hasSize(2)
            .extracting(n -> n.getRfpQuoteNetwork().getNetwork().getType())
            .containsExactlyInAnyOrder("HMO", "HMO"); // option is created with clientPlan != null

        assertThat(renewal2).isNotNull();
        assertThat(renewal2.getRfpQuoteOptionNetworks())
            .hasSize(2)
            .extracting(n -> n.getRfpQuoteNetwork().getNetwork().getType())
            .containsExactlyInAnyOrder("HMO", "HMO");
        
        // check riders
        RfpQuoteNetwork network1 = currentRfpQuotes.get(0).getRfpQuoteNetworks().get(0);
        assertThat(network1.getRiders()).hasSize(1);
        for (Rider rider : network1.getRiders()) {
            assertThat(rider.getRiderMeta().getCode()).isEqualTo("CG9");
            assertThat(rider.getTier1Rate()).isEqualTo(4.23f);
            assertThat(rider.getTier2Rate()).isEqualTo(10.15f);
            assertThat(rider.getTier3Rate()).isEqualTo(7.40f);
            assertThat(rider.getTier4Rate()).isEqualTo(12.90f);
        }
        
        RfpQuoteOptionNetwork rqon = renewal1.getRfpQuoteOptionNetworks().get(0);
        assertThat(rqon.getSelectedRiders()).hasSize(1);
        assertThat(rqon.getSelectedRiders().iterator().next().getRiderMeta().getCode()).isEqualTo("CG9");

        flushAndClear();
        
        // add PPO
        File file2 = new File(currDir
                + "/data/renewal_quotes/Medical/American Integrated Services_PPO Exhibits.xlsm");
        FileInputStream fis2 = new FileInputStream(file2);
        MockMultipartFile mockFile2 = new MockMultipartFile("files",file2.getName(),"xlsm",fis2);
        
        QuoteUploaderDto dto2 = new QuoteUploaderDto();
        dto2.setAddToExisted(true);
        dto2.setQuoteType(QuoteType.STANDARD);
        dto2.setCategory(Constants.MEDICAL);
        dto2.setRenewal(true);
        
        List<RfpQuote> currentRfpQuotes2 = loader.run(
                Arrays.asList( mockFile2), 
                client.getClientId(), 
                client.getBroker().getBrokerId(), 
                dto2, 
                true, 
                true);
        
        // check that added to existed
        assertThat(currentRfpQuotes2.get(0).getRfpQuoteId()).isEqualTo(currentRfpQuotes.get(0).getRfpQuoteId());
        
        assertThat(currentRfpQuotes2).hasSize(1);
        assertThat(currentRfpQuotes2.get(0).isLatest()).isTrue();
        assertThat(currentRfpQuotes2.get(0).getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(currentRfpQuotes2.get(0).getRfpQuoteNetworks()).hasSize(5);
        assertThat(currentRfpQuotes2.get(0).getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getType())
            .containsExactlyInAnyOrder("HMO", "HMO", "HMO", "PPO", "PPO");

        assertThat(currentRfpQuotes2.get(0).getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getName())
            .containsExactlyInAnyOrder("Signature", "Signature", "Advantage", "Select Plus", "Core");

        // some data may be delete from DB, but not flushed
        flushAndClear();

        // check client plan
        List<ClientPlan> clientPlans2 = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(clientPlans2).hasSize(3);
        
        //check options
        List<RfpQuoteOption> newOptions = rfpQuoteOptionRepository.findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);
        assertThat(newOptions.size()).isEqualTo(2);
        RfpQuoteOption newRenewal1 = null;
        RfpQuoteOption newRenewal2 = null;
        for (RfpQuoteOption option : newOptions) {
            if ("Renewal 1".equals(option.getRfpQuoteOptionName())) { newRenewal1 = option; }
            else if ("Renewal 2".equals(option.getRfpQuoteOptionName())) { newRenewal2 = option; }
        }

        assertThat(newRenewal1).isNotNull();
        assertThat(newRenewal1.getOptionId()).isEqualTo(renewal1.getOptionId()); // option is reused
        assertThat(newRenewal1.getRfpQuoteOptionNetworks())
            .hasSize(3)
            .extracting(n -> n.getRfpQuoteNetwork().getNetwork().getType())
            .containsExactlyInAnyOrder("HMO", "HMO", "PPO"); // option is created with clientPlan != null

        assertThat(newRenewal2).isNotNull();
        assertThat(newRenewal2.getOptionId()).isEqualTo(renewal2.getOptionId()); // option is reused
        assertThat(newRenewal2.getRfpQuoteOptionNetworks())
            .hasSize(3)
            .extracting(n -> n.getRfpQuoteNetwork().getNetwork().getType())
            .containsExactlyInAnyOrder("HMO", "HMO", "PPO");

        List<RfpQuote> newQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);

        // check riders
        RfpQuoteNetwork network2 = newQuotes.get(0).getRfpQuoteNetworks().get(0);
        assertThat(network2.getRiders()).hasSize(1);
        for (Rider rider : network2.getRiders()) {
            assertThat(rider.getRiderMeta().getCode()).isEqualTo("CG9");
            assertThat(rider.getTier1Rate()).isEqualTo(4.23f);
            assertThat(rider.getTier2Rate()).isEqualTo(10.15f);
            assertThat(rider.getTier3Rate()).isEqualTo(7.40f);
            assertThat(rider.getTier4Rate()).isEqualTo(12.90f);
        }
        
        RfpQuoteOptionNetwork rqon2 = newRenewal1.getRfpQuoteOptionNetworks().get(0);
        assertThat(rqon2.getSelectedRiders()).hasSize(1);
        assertThat(rqon2.getSelectedRiders().iterator().next().getRiderMeta().getCode()).isEqualTo("CG9");

    }

    @Test
    public void testLoadRenewalMedicalHmoWith2Riders() throws Exception {

        Client client = testEntityHelper.createTestClient();
        client.setEffectiveDate(new Date());
        
        testEntityHelper.createTestRiderMeta("CG9", Constants.MEDICAL, "HMO", false);
        testEntityHelper.createTestRiderMeta("CEO", Constants.MEDICAL, "HMO", false);
        
        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();

        File file1 = new File(currDir
                + "/data/renewal_quotes/Medical/Sample 4 tier HMO Renewal.xlsx");
        FileInputStream fis1 = new FileInputStream(file1);
        MockMultipartFile mockFile1 = new MockMultipartFile("files",file1.getName(),"xlsx",fis1);

        QuoteUploaderDto dto = new QuoteUploaderDto();
        dto.setAddToExisted(false);// new quote
        dto.setQuoteType(QuoteType.STANDARD);
        dto.setCategory(Constants.MEDICAL);
        dto.setRenewal(true);
        
        List<RfpQuote> currentRfpQuotes = loader.run(
                Arrays.asList(mockFile1), 
                client.getClientId(), 
                client.getBroker().getBrokerId(), 
                dto, 
                true, 
                true);
        
        assertThat(currentRfpQuotes).hasSize(1);
        assertThat(currentRfpQuotes.get(0).isLatest()).isTrue();
        assertThat(currentRfpQuotes.get(0).getQuoteType()).isEqualTo(QuoteType.STANDARD);
        
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks()).hasSize(3);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getType())
            .containsExactlyInAnyOrder("HMO", "HMO", "HMO");

        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getName())
            .containsExactlyInAnyOrder("Signature", "Signature", "Focus");

        flushAndClear();

        // check client plan
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(clientPlans).hasSize(3);

        //check options
        List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);
        assertThat(options.size()).isEqualTo(2);
        RfpQuoteOption renewal1 = null;
        RfpQuoteOption renewal2 = null;
        for (RfpQuoteOption option : options) {
            if ("Renewal 1".equals(option.getRfpQuoteOptionName())) { renewal1 = option; }
            else if ("Renewal 2".equals(option.getRfpQuoteOptionName())) { renewal2 = option; }
        }

        assertThat(renewal1).isNotNull();
        assertThat(renewal1.getRfpQuoteOptionNetworks())
            .hasSize(3)
            .extracting(n -> n.getRfpQuoteNetwork().getNetwork().getType())
            .containsExactlyInAnyOrder("HMO", "HMO", "HMO"); 

        assertThat(renewal2).isNotNull();
        assertThat(renewal2.getRfpQuoteOptionNetworks())
            .hasSize(3)
            .extracting(n -> n.getRfpQuoteNetwork().getNetwork().getType())
            .containsExactlyInAnyOrder("HMO", "HMO", "HMO");
        
        // check - network has 2 riders
        RfpQuoteNetwork network1 = currentRfpQuotes.get(0).getRfpQuoteNetworks().get(0);
        assertThat(network1.getRiders())
            .hasSize(2)
            .extracting(r -> r.getRiderMeta().getCode())
            .containsExactlyInAnyOrder("CG9", "CEO");

        // check - only current was selected
        RfpQuoteOptionNetwork rqon = renewal1.getRfpQuoteOptionNetworks().get(0);
        assertThat(rqon.getSelectedRiders())
            .hasSize(1)
            .extracting(r -> r.getRiderMeta().getCode())
            .containsExactly("CG9");

    }

    @Test
    public void testRenewalMod2PlanName() throws Exception {
        
        FileInputStream fis = new FileInputStream(new File(currDir
            + "/data/renewal_quotes/Medical/Systems Application and Technology PPO Renewal 8.2018.xlsm"));

        Client client = testEntityHelper.createTestClient();
        Long brokerId = client.getBroker().getBrokerId();

        loader.resetPlanStatistics();
        RfpQuote quote = loader.run(fis, Collections.emptyList(), client.getClientId(), brokerId, QuoteType.STANDARD, "MEDICAL",  true, true);

        flushAndClear();
        
        assertThat(quote).isNotNull();
        assertThat(quote.getRfpQuoteNetworks())
            .hasSize(5)
            .extracting("rfpQuoteOptionName")
            .containsExactlyInAnyOrder(
                    "Select Plus__Rx:0I",
                    "Choice Plus__Rx:0I",
                    "Choice Plus HSA__Rx:H9-HSA",
                    "Core__Rx:0I",
                    "Core HSA__Rx:H9-HSA");
        
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(clientPlans)
            .hasSize(3)
            .extracting("pnn")
            .extracting("name")
            .containsExactlyInAnyOrder("Mod2 PSZ", "Mod2 500", "564");
        
        assertThat(quote.getRfpQuoteOptions())
            .hasSize(2)
            .extracting("rfpQuoteOptionName")
            .containsExactlyInAnyOrder("Renewal 1", "Renewal 2");
 
        RfpQuoteOption renewal1 = quote.getRfpQuoteOptions()
                .stream()
                .filter(o -> o.getName().equals("Renewal 1"))
                .findFirst()
                .orElse(null);
        
        ClientAttribute clientAttribute = client.getAttributes()
                .stream()
                .filter(a -> a.getName() == AttributeName.RENEWAL)
                .findFirst()
                .orElse(null);
        assertThat(clientAttribute).isNotNull();
        
    }

}
