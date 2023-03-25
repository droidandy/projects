package com.benrevo.core.service.pptx;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.pptx.BasePptxPresentationService;
import com.benrevo.be.modules.shared.service.pptx.Data;
import com.benrevo.be.modules.shared.service.pptx.PptxGenerator;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.MarketingStatus;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.core.UHCCoreServiceApplication;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.MarketingList;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.BasicRate;
import com.benrevo.data.persistence.entities.ancillary.LifeClass;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import java.util.HashMap;
import java.util.Map;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest(classes = UHCCoreServiceApplication.class)
public class UHCPptxDataPreparationServiceTest  extends AbstractControllerTest {
    @Autowired
    private BasePptxPresentationService service;

    @Override
    public void init() throws Exception {
    }

    @Test
    public void getPresentationByClientId() throws Exception {

        //Future<byte[]> logoFutureData = service.getBrokerLogo("https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/brokerage/mma/mma.png");

        Client client = testEntityHelper.createTestClient();
        client.getAttributes().add(new ClientAttribute(client, AttributeName.RENEWAL));

        // MEDICAL

        // CURRENT
        // HMO
        ClientPlan cpHmo = testEntityHelper
            .createTestClientPlan("hmo client plan", client, CarrierType.UHC.name(), "HMO");
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "$11", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "$33", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", cpHmo.getPnn().getPlan(), "N/A", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "N/A", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "N/A", null);
        // HSA
        ClientPlan cpHsa = testEntityHelper
            .createTestClientPlan("hsa client plan", client, CarrierType.UHC.name(), "HSA");
        cpHsa.setTier1Census(11L);
        cpHsa.setTier2Census(12L);
        cpHsa.setTier3Census(13L);
        cpHsa.setTier4Census(14L);
        cpHsa.setTier1Rate(300F);
        cpHsa.setTier2Rate(710F);
        cpHsa.setTier3Rate(590F);
        cpHsa.setTier4Rate(990F);
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", cpHsa.getPnn().getPlan(), "$10", "$20");
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", cpHsa.getPnn().getPlan(), "$30", "$60");
        testEntityHelper.createTestBenefit("CO_INSURANCE", cpHsa.getPnn().getPlan(), "20%", "40%");
        testEntityHelper.createTestBenefit("PCP", cpHsa.getPnn().getPlan(), "$12", "40%");

        ClientPlan cpHmo2 = testEntityHelper
            .createTestClientPlan("hmo2 client plan", client, CarrierType.UHC.name(), "HMO");

        ClientPlan cpHmo3 = testEntityHelper
            .createTestClientPlan("hmo3 client plan", client, CarrierType.UHC.name(), "HMO");

        ClientPlan cpPpo = testEntityHelper
            .createTestClientPlan("ppo client plan", client, CarrierType.UHC.name(), "PPO");

        // RENEWAL
        RfpQuote rfpQuoteMedical = testEntityHelper
            .createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL, QuoteType.STANDARD);
        RfpQuoteOption
            rqoRenewalMedical = testEntityHelper.createTestRfpQuoteOption(rfpQuoteMedical, "Renewal");
        // HMO
        RfpQuoteNetwork
            rqnHmoRenewal = testEntityHelper.createTestQuoteNetwork(rfpQuoteMedical, "HMO");
        RfpQuoteNetworkPlan rqnpHmoRenewal = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hmo", rqnHmoRenewal,
                cpHmo.getTier1Rate() * 1.2f,
                cpHmo.getTier2Rate() * 1.2f,
                cpHmo.getTier3Rate() * 1.2f,
                cpHmo.getTier4Rate() * 1.2f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqoRenewalMedical, rqnHmoRenewal, rqnpHmoRenewal, cpHmo,
                cpHmo.getTier1Census(), cpHmo.getTier2Census(),
                cpHmo.getTier3Census(), cpHmo.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);
        // HSA
        RfpQuoteNetwork rqnHsaRenewal = testEntityHelper.createTestQuoteNetwork(rfpQuoteMedical, "HSA");
        RfpQuoteNetworkPlan rqnpHsaRenewal = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hsa", rqnHsaRenewal,
                cpHsa.getTier1Rate() * 1.2f,
                cpHsa.getTier2Rate() * 1.2f,
                cpHsa.getTier3Rate() * 1.2f,
                cpHsa.getTier4Rate() * 1.2f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqoRenewalMedical, rqnHsaRenewal, rqnpHsaRenewal, cpHsa,
                cpHsa.getTier1Census(), cpHsa.getTier2Census(),
                cpHsa.getTier3Census(), cpHsa.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);

        //DENTAL
        // Current
        // DPPO
        ClientPlan cpDppo = testEntityHelper
            .createTestClientPlan("Dppo client plan", client, CarrierType.BLUE_SHIELD.name(), "DPPO");
        testEntityHelper.createTestBenefit("CALENDAR_YEAR_MAXIMUM", cpDppo.getPnn().getPlan(), "$1111", null);
        testEntityHelper.createTestBenefit("IMPLANT_COVERAGE", cpDppo.getPnn().getPlan(), "Covered", null);
        ClientPlan cpDppo2 = testEntityHelper
            .createTestClientPlan("Dppo2 client plan", client, CarrierType.BLUE_SHIELD.name(), "DPPO");
        testEntityHelper.createTestBenefit("CALENDAR_YEAR_MAXIMUM", cpDppo2.getPnn().getPlan(), "$1221", null);
        testEntityHelper.createTestBenefit("IMPLANT_COVERAGE", cpDppo2.getPnn().getPlan(), "Not covered", null);

        // DHMO
        ClientPlan cpDhmo = testEntityHelper
            .createTestClientPlan("Dhmo client plan", client, CarrierType.BLUE_SHIELD.name(), "DHMO");
        testEntityHelper.createTestBenefit("ADULT_PROPHY", cpDhmo.getPnn().getPlan(), "$11", null);
        testEntityHelper.createTestBenefit("CHILD_PROPHY", cpDhmo.getPnn().getPlan(), "$33", "$40");

        // RENEWAL
        RfpQuote rfpQuoteDental = testEntityHelper
            .createTestRfpQuote(client, CarrierType.BLUE_SHIELD.name(), Constants.DENTAL);
        RfpQuoteOption rqoRenewalDental = testEntityHelper.createTestRfpQuoteOption(rfpQuoteDental, "Option 1");
        // DHMO
        RfpQuoteNetwork rqnDhmoRenewal = testEntityHelper.createTestQuoteNetwork(rfpQuoteDental, "DHMO");
        RfpQuoteNetworkPlan rqnpDhmoRenewal = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan dhmo", rqnDhmoRenewal,
                cpDhmo.getTier1Rate() * 1.2f,
                cpDhmo.getTier2Rate() * 1.2f,
                cpDhmo.getTier3Rate() * 1.2f,
                cpDhmo.getTier4Rate() * 1.2f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqoRenewalDental, rqnDhmoRenewal, rqnpDhmoRenewal, cpDhmo,
                cpDhmo.getTier1Census(), cpDhmo.getTier2Census(),
                cpDhmo.getTier3Census(), cpDhmo.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);
        // DPPO
        RfpQuoteNetwork rqnDppo2Renewal = testEntityHelper.createTestQuoteNetwork(rfpQuoteDental, "DPPO");
        RfpQuoteNetworkPlan rqnpDppo2Renewal = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan dppo2", rqnDppo2Renewal,
                cpDppo2.getTier1Rate() * 1.15f,
                cpDppo2.getTier2Rate() * 1.15f,
                cpDppo2.getTier3Rate() * 1.15f,
                cpDppo2.getTier4Rate() * 1.15f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqoRenewalDental, rqnDppo2Renewal, rqnpDppo2Renewal, cpDppo2,
                cpDppo2.getTier1Census(), cpDppo2.getTier2Census(),
                cpDppo2.getTier3Census(), cpDppo2.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);

        // VISION
        // Current
        ClientPlan cpVision = testEntityHelper
            .createTestClientPlan("vision client plan", client, CarrierType.CIGNA.name(), Constants.VISION);
        // RENEWAL
        RfpQuote rfpQuoteVision = testEntityHelper
            .createTestRfpQuote(client, CarrierType.CIGNA.name(), Constants.VISION);
        RfpQuoteOption rqoRenewalVision = testEntityHelper.createTestRfpQuoteOption(rfpQuoteVision, "Option 1");
        RfpQuoteNetwork rqnVisionRenewal = testEntityHelper.createTestQuoteNetwork(rfpQuoteVision, Constants.VISION);
        RfpQuoteNetworkPlan rqnpVisionRenewal = testEntityHelper
            .createTestRfpQuoteNetworkPlan("vision", rqnVisionRenewal,
                cpVision.getTier1Rate() * 1.2f,
                cpVision.getTier2Rate() * 1.2f,
                cpVision.getTier3Rate() * 1.2f,
                cpVision.getTier4Rate() * 1.2f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqoRenewalVision, rqnVisionRenewal, rqnpVisionRenewal, cpVision,
                cpVision.getTier1Census(), cpVision.getTier2Census(),
                cpVision.getTier3Census(), cpVision.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);

        // Alternatives
        RfpQuote medicalQuote1 = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption1 = testEntityHelper.createTestRfpQuoteOption(medicalQuote1, "Renewal 2");
        // HMO
        RfpQuoteNetwork hmoNetwork1 = testEntityHelper.createTestQuoteNetwork(medicalQuote1, "HMO option1", "HMO");
        RfpQuoteNetworkPlan hmoPlan1 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork1, 100.91f, 200.90f, 290.00f, 450.19f, true);
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption1,
            hmoNetwork1, hmoPlan1, cpHmo, 80L, 10L, 80L, 5L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", hmoPlan1.getPnn().getPlan(), "$12", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", hmoPlan1.getPnn().getPlan(), "$36", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", hmoPlan1.getPnn().getPlan(), "$40", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", hmoPlan1.getPnn().getPlan(), "$10", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", hmoPlan1.getPnn().getPlan(), "$30", null);
        // HSA
        RfpQuoteNetwork hsaNetwork1 = testEntityHelper.createTestQuoteNetwork(medicalQuote1, "HSA option1", "HSA");
        RfpQuoteNetworkPlan hsaPlan1 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hsa", hsaNetwork1,
                cpHsa.getTier1Rate() * 0.9f,
                cpHsa.getTier2Rate() * 0.9f,
                cpHsa.getTier3Rate() * 0.9f,
                cpHsa.getTier4Rate() * 0.9f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption1, hsaNetwork1, hsaPlan1, null,
                cpHsa.getTier1Census(), cpHsa.getTier2Census(), cpHsa.getTier3Census(), cpHsa.getTier4Census(),
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT, 90f, 90f, 90f, 90f);

        // Dental
        RfpQuote dentalQuote1 = testEntityHelper
            .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.DENTAL);
        RfpQuoteOption dentalOption1 = testEntityHelper.createTestRfpQuoteOption(dentalQuote1, "Option 2");
        RfpQuoteNetwork rqnDhmo1 = testEntityHelper.createTestQuoteNetwork(dentalQuote1, "DHMO");
        RfpQuoteNetworkPlan rqnpDhmo1 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hmo", rqnDhmo1,
                cpDhmo.getTier1Rate() * 1.2f,
                cpDhmo.getTier2Rate() * 1.2f,
                cpDhmo.getTier3Rate() * 1.2f,
                cpDhmo.getTier4Rate() * 1.2f);
        testEntityHelper.createTestBenefit("ADULT_PROPHY", rqnpDhmo1.getPnn().getPlan(), "$12", null);
        testEntityHelper.createTestBenefit("CHILD_PROPHY", rqnpDhmo1.getPnn().getPlan(), "$34", "$41");

        testEntityHelper
            .createTestRfpQuoteOptionNetwork(dentalOption1, rqnDhmo1, rqnpDhmo1, cpDhmo,
                cpDhmo.getTier1Census(), cpDhmo.getTier2Census(),
                cpDhmo.getTier3Census(), cpDhmo.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);

        // Vision
        RfpQuote visionQuote1 = testEntityHelper
            .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.VISION);
        RfpQuoteOption visionOption1 = testEntityHelper.createTestRfpQuoteOption(visionQuote1, "Option 2");
        RfpQuoteNetwork rqnVision1 = testEntityHelper.createTestQuoteNetwork(visionQuote1, Constants.VISION);
        RfpQuoteNetworkPlan rqnpVision1 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("vision", rqnVision1,
                cpVision.getTier1Rate() * 1.2f,
                cpVision.getTier2Rate() * 1.2f,
                cpVision.getTier3Rate() * 1.2f,
                cpVision.getTier4Rate() * 1.2f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(visionOption1, rqnVision1, rqnpVision1, cpVision,
                cpVision.getTier1Census(), cpVision.getTier2Census(),
                cpVision.getTier3Census(), cpVision.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);

        //LIFE

        Carrier carrier1 = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.displayName);

        AncillaryPlan basicLife = testEntityHelper.createTestAncillaryPlan("Basic Life",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier1);
        BasicRate basicRate = (BasicRate) basicLife.getRates();
        LifeClass basicClass = (LifeClass) basicLife.getClasses().get(0);

        basicClass.setEmployeeBenefitAmount("9.0");
        basicClass.setAge65reduction("10");
        basicClass.setAge70reduction("11");
        basicClass.setAge75reduction("12");
        basicClass.setAge80reduction("13");

        AncillaryPlan voluntaryLife = testEntityHelper.createTestAncillaryPlan("Voluntary Life",
            PlanCategory.VOL_LIFE, AncillaryPlanType.VOLUNTARY, carrier1);
        VoluntaryRate voluntaryRate = (VoluntaryRate) voluntaryLife.getRates();
        LifeClass voluntaryClass = (LifeClass) voluntaryLife.getClasses().get(0);

        voluntaryRate.setRateGuarantee("rate guarantee");
        voluntaryRate.setMonthlyCost(100f);
        voluntaryClass.setAge65reduction("20");
        voluntaryClass.setAge70reduction("21");
        voluntaryClass.setAge75reduction("22");
        voluntaryClass.setAge80reduction("23");

        AncillaryPlan basicLtd = testEntityHelper.createTestAncillaryPlan("Basic Ltd",
            PlanCategory.LTD, AncillaryPlanType.BASIC, carrier1);

        AncillaryPlan basicStd = testEntityHelper.createTestAncillaryPlan("Basic Std",
            PlanCategory.STD, AncillaryPlanType.BASIC, carrier1);

        // current
        ClientPlan clientPlan1 = testEntityHelper.createTestAncillaryClientPlan(client, basicLife, PlanCategory.LIFE);
        ClientPlan clientPlan2 = testEntityHelper.createTestAncillaryClientPlan(client, voluntaryLife, PlanCategory.VOL_LIFE);
        ClientPlan clientPlan3 = testEntityHelper.createTestAncillaryClientPlan(client, basicLtd, PlanCategory.LTD);
        ClientPlan clientPlan4 = testEntityHelper.createTestAncillaryClientPlan(client, basicStd, PlanCategory.STD);

        // RENEWAL
        RfpQuote rfpQuoteLife = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.LIFE);
        RfpQuoteAncillaryPlan
            basicLifePlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteLife, basicLife);
        RfpQuoteAncillaryOption basicRenewal = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", basicLifePlan);

        RfpQuote rfpQuoteVoluntaryLife = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), PlanCategory.VOL_LIFE.name());
        RfpQuoteAncillaryPlan voluntaryLifePlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteVoluntaryLife, voluntaryLife);
        RfpQuoteAncillaryOption voluntaryRenewal = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", voluntaryLifePlan);

        RfpQuote rfpQuoteStd = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.STD);
        RfpQuoteAncillaryPlan stdPlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteStd, basicStd);
        RfpQuoteAncillaryOption stdRenewal = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", stdPlan);

        RfpQuote rfpQuoteLtd = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.LTD);
        RfpQuoteAncillaryPlan ltdPlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteLtd, basicLtd);
        RfpQuoteAncillaryOption ltdRenewal = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", ltdPlan);

        //ANCILLARY ALTERNATIVE
        //LIFE
        RfpQuote rfpQuoteLife1 = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.LIFE);
        RfpQuoteAncillaryPlan lifePlan1 =
            testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 1 Life Plan", PlanCategory.LIFE,
                AncillaryPlanType.BASIC, rfpQuoteLife1
            );
        LifeClass lifeClass1 = (LifeClass) lifePlan1.getAncillaryPlan().getClasses().get(0);
        lifeClass1.setConversion("true");
        lifeClass1.setPortability("false");

        RfpQuoteAncillaryOption lifeOption1 = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 2", lifePlan1);

        //STD
        RfpQuote rfpQuoteStd1 = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.STD);
        RfpQuoteAncillaryPlan stdPlan1 = testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 1 STD Plan",
            PlanCategory.STD, AncillaryPlanType.BASIC, rfpQuoteStd1);
        RfpQuoteAncillaryOption stdOption1 = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 2", stdPlan1);
        //LTD
        RfpQuote rfpQuoteLtd1 = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.LTD);
        RfpQuoteAncillaryPlan ltdPlan1 = testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 1 LTD Plan",
            PlanCategory.LTD, AncillaryPlanType.BASIC, rfpQuoteLtd1);
        ltdPlan1.getAncillaryPlan().getRates().setVolume(80000.0);
        RfpQuoteAncillaryOption ltdOption1 = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 2", ltdPlan1);

        MarketingList medicalStatus1 = testEntityHelper.createTestMarketingList(client,
            CarrierType.GUARDIAN.name(), Constants.MEDICAL, MarketingStatus.RFP_SUBMITTED);
        MarketingList medicalStatus2 = testEntityHelper.createTestMarketingList(client,
            CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.MEDICAL, MarketingStatus.QUOTED);

        flushAndClear();

        Map<String, Object> viewData = new HashMap<>();
        Data data = service.fillData(viewData, client, true);

        assertThat(viewData.get("client_name")).isEqualTo(client.getClientName());

        assertThat(viewData.get("mbdohide")).isNull();
        assertThat(viewData.get("idc")).isEqualTo("Integration discount");
        assertThat(viewData.get("idct")).isEqualTo("Integration discounts");

        byte[] logoData = null;
        //logoData = logoFutureData.get(5, TimeUnit.SECONDS);

        byte[] bytes = PptxGenerator.generate("/templates/presentation.pptx", data, viewData, logoData);

        assertThat(bytes).isNotNull();

        //java.io.File pptx = new java.io.File("test-presentation-uhc1.pptx");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(pptx, bytes);

    }
}