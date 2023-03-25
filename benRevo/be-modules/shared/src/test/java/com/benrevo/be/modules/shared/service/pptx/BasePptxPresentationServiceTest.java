package com.benrevo.be.modules.shared.service.pptx;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang3.tuple.Pair;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.CompetitiveInfoOption;
import com.benrevo.common.enums.MarketingStatus;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.MarketingList;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.PresentationOption;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.BasicRate;
import com.benrevo.data.persistence.entities.ancillary.LifeClass;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;

public class BasePptxPresentationServiceTest extends AbstractControllerTest {
    
    @Autowired
    private BasePptxPresentationService service;

    @Override
    public void init() throws Exception {
    }

    @Test
    public void getPresentationByClientId() throws Exception {
        
        Client client = testEntityHelper.createTestClient();
        
        // MEDICAL
        
        // CURRENT
        // HMO
        ClientPlan cpHmo = testEntityHelper
            .createTestClientPlan("hmo client plan", client, CarrierType.KAISER.name(), "HMO");
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "$11", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "$33", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", cpHmo.getPnn().getPlan(), "N/A", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "N/A", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "N/A", null);
        // HSA
        ClientPlan cpHsa = testEntityHelper
                .createTestClientPlan("hsa client plan", client, CarrierType.HEALTHNET.name(), "HSA");
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
                .createTestClientPlan("hmo2 client plan", client, CarrierType.HEALTHNET.name(), "HMO");

        ClientPlan cpHmo3 = testEntityHelper
                .createTestClientPlan("hmo3 client plan", client, CarrierType.HEALTHNET.name(), "HMO");

        ClientPlan cpPpo = testEntityHelper
                .createTestClientPlan("ppo client plan", client, CarrierType.HEALTHNET.name(), "PPO");

        // RENEWAL
        RfpQuote rfpQuoteMedical = testEntityHelper
                .createTestRfpQuote(client, CarrierType.HEALTHNET.name(), Constants.MEDICAL, QuoteType.KAISER);
        RfpQuoteOption rqoRenewalMedical = testEntityHelper.createTestRfpQuoteOption(rfpQuoteMedical, "Renewal");
        // HMO
        RfpQuoteNetwork rqnHmoRenewal = testEntityHelper.createTestQuoteNetwork(rfpQuoteMedical, "HMO");
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
            .createTestClientPlan("Dhmo client plan", client, CarrierType.AETNA.name(), "DHMO");
        testEntityHelper.createTestBenefit("ADULT_PROPHY", cpDhmo.getPnn().getPlan(), "$11", null);
        testEntityHelper.createTestBenefit("CHILD_PROPHY", cpDhmo.getPnn().getPlan(), "$33", "$40");

        // RENEWAL
        RfpQuote rfpQuoteDental = testEntityHelper
                .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.DENTAL);
        RfpQuoteOption rqoRenewalDental = testEntityHelper.createTestRfpQuoteOption(rfpQuoteDental, "Renewal");
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
                .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.VISION);
        RfpQuoteOption rqoRenewalVision = testEntityHelper.createTestRfpQuoteOption(rfpQuoteVision, "Renewal");
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


        // Alternative 1
        PresentationOption presentationOption1 = testEntityHelper.createTestPresentationOption(client, "Alternative 1");
        RfpQuote medicalQuote1 = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption1 = testEntityHelper.createTestRfpQuoteOption(medicalQuote1, "Option 1");
        presentationOption1.setMedicalRfpQuoteOption(medicalOption1);
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
        RfpQuoteOption dentalOption1 = testEntityHelper.createTestRfpQuoteOption(dentalQuote1, "Renewal");
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
        presentationOption1.setDentalRfpQuoteOption(dentalOption1);
        // Vision
        RfpQuote visionQuote1 = testEntityHelper
                .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.VISION);
        RfpQuoteOption visionOption1 = testEntityHelper.createTestRfpQuoteOption(visionQuote1, "Renewal");
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
        presentationOption1.setVisionRfpQuoteOption(visionOption1);
        presentationOption1.setDentalDiscountPercent(1F);
        presentationOption1.setVisionDiscountPercent(0.5F);
        
        // Alternative 2
        PresentationOption presentationOption2 = testEntityHelper.createTestPresentationOption(client, "Alternative 2");
        RfpQuote medicalQuote2 = testEntityHelper.createTestRfpQuote(client, CarrierType.BLUE_SHIELD.name(), 
                Constants.MEDICAL, QuoteType.KAISER);
        RfpQuoteOption medicalOption2 = testEntityHelper.createTestRfpQuoteOption(medicalQuote2, "Option 1");
        presentationOption2.setMedicalRfpQuoteOption(medicalOption2);
        // HMO
        Carrier kaiserCarrier = testEntityHelper.createTestCarrier(CarrierType.KAISER.name(), "Kaiser");
        Network kaiserNetwork = testEntityHelper.createTestNetwork(kaiserCarrier, "Kaiser HMO Option2", "HMO");
        RfpQuoteNetwork hmoNetwork2 = testEntityHelper.createTestQuoteNetwork(medicalQuote2, kaiserNetwork);
        RfpQuoteNetworkPlan hmoPlan2 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork2, 100.91f, 200.90f, 290.00f, 450.19f, true);
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption2,
            hmoNetwork2, hmoPlan2, cpHmo, 80L, 10L, 80L, 5L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", hmoPlan2.getPnn().getPlan(), "$13", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", hmoPlan2.getPnn().getPlan(), "$39", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", hmoPlan2.getPnn().getPlan(), "$45", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", hmoPlan2.getPnn().getPlan(), "$9", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", hmoPlan2.getPnn().getPlan(), "$27", null);
        // HSA
        RfpQuoteNetwork hsaNetwork2 = testEntityHelper.createTestQuoteNetwork(medicalQuote2, "HSA option2", "HSA");
        RfpQuoteNetworkPlan hsaPlan2 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hsa", hsaNetwork2,
                cpHsa.getTier1Rate() * 0.9f,
                cpHsa.getTier2Rate() * 0.9f,
                cpHsa.getTier3Rate() * 0.9f,
                cpHsa.getTier4Rate() * 0.9f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption2, hsaNetwork2, hsaPlan2, cpHsa, 
                cpHsa.getTier1Census(), cpHsa.getTier2Census(), cpHsa.getTier3Census(), cpHsa.getTier4Census(),
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT, 90f, 90f, 90f, 90f);
        // Vision
        RfpQuote visionQuote2 = testEntityHelper
                .createTestRfpQuote(client, CarrierType.EYEMED.name(), Constants.VISION);
        RfpQuoteOption visionOption2 = testEntityHelper.createTestRfpQuoteOption(visionQuote2, "Renewal");
        RfpQuoteNetwork rqnVision2 = testEntityHelper.createTestQuoteNetwork(visionQuote2, Constants.VISION);
        RfpQuoteNetworkPlan rqnpVision2 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("vision", rqnVision2,
                cpVision.getTier1Rate() * 1.2f,
                cpVision.getTier2Rate() * 1.2f,
                cpVision.getTier3Rate() * 1.2f,
                cpVision.getTier4Rate() * 1.2f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(visionOption2, rqnVision2, rqnpVision2, cpVision, 
                cpVision.getTier1Census(), cpVision.getTier2Census(), 
                cpVision.getTier3Census(), cpVision.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);
        presentationOption2.setVisionRfpQuoteOption(visionOption2);
        presentationOption2.setVisionDiscountPercent(0.5F);
        
        // Alternative 3
        PresentationOption presentationOption3 = testEntityHelper.createTestPresentationOption(client, "Alternative 3");
        RfpQuote medicalQuote3 = testEntityHelper.createTestRfpQuote(client, CarrierType.AETNA.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption3 = testEntityHelper.createTestRfpQuoteOption(medicalQuote3, "Option 1");
        presentationOption3.setMedicalRfpQuoteOption(medicalOption3);
        // HMO
        RfpQuoteNetwork hmoNetwork3 = testEntityHelper.createTestQuoteNetwork(medicalQuote3, "HMO option3", "HMO");
        RfpQuoteNetworkPlan hmoPlan3 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork3, 100.91f, 200.90f, 290.00f, 450.19f, true);
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption3,
            hmoNetwork3, hmoPlan3, cpHmo, 80L, 10L, 80L, 5L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", hmoPlan3.getPnn().getPlan(), "$13", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", hmoPlan3.getPnn().getPlan(), "$39", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", hmoPlan3.getPnn().getPlan(), "$45", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", hmoPlan3.getPnn().getPlan(), "$9", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", hmoPlan3.getPnn().getPlan(), "$27", null);
        // HSA
        RfpQuoteNetwork hsaNetwork3 = testEntityHelper.createTestQuoteNetwork(medicalQuote3, "HSA option3", "HSA");
        RfpQuoteNetworkPlan hsaPlan3 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hsa", hsaNetwork3,
                cpHsa.getTier1Rate() * 0.9f,
                cpHsa.getTier2Rate() * 0.9f,
                cpHsa.getTier3Rate() * 0.9f,
                cpHsa.getTier4Rate() * 0.9f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption3, hsaNetwork3, hsaPlan3, cpHsa, 
                cpHsa.getTier1Census(), cpHsa.getTier2Census(), cpHsa.getTier3Census(), cpHsa.getTier4Census(),
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT, 90f, 90f, 90f, 90f);

        // Alternative 4
        PresentationOption presentationOption4 = testEntityHelper.createTestPresentationOption(client, "Alternative 4");
        RfpQuote medicalQuote4 = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption4 = testEntityHelper.createTestRfpQuoteOption(medicalQuote4, "Option 1");
        presentationOption4.setMedicalRfpQuoteOption(medicalOption4);
        // HMO
        RfpQuoteNetwork hmoNetwork4 = testEntityHelper.createTestQuoteNetwork(medicalQuote4, "HMO option4", "HMO");
        RfpQuoteNetworkPlan hmoPlan4 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork4, 100.91f, 200.90f, 290.00f, 450.19f, true);
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption4,
            hmoNetwork4, hmoPlan4, cpHmo, 80L, 10L, 80L, 5L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", hmoPlan4.getPnn().getPlan(), "$13", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", hmoPlan4.getPnn().getPlan(), "$39", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", hmoPlan4.getPnn().getPlan(), "$45", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", hmoPlan4.getPnn().getPlan(), "$9", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", hmoPlan4.getPnn().getPlan(), "$27", null);
        // HSA
        RfpQuoteNetwork hsaNetwork4 = testEntityHelper.createTestQuoteNetwork(medicalQuote4, "HSA option4", "HSA");
        RfpQuoteNetworkPlan hsaPlan4 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hsa", hsaNetwork4,
                cpHsa.getTier1Rate() * 0.9f,
                cpHsa.getTier2Rate() * 0.9f,
                cpHsa.getTier3Rate() * 0.9f,
                cpHsa.getTier4Rate() * 0.9f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption4, hsaNetwork4, hsaPlan4, cpHsa, 
                cpHsa.getTier1Census(), cpHsa.getTier2Census(), cpHsa.getTier3Census(), cpHsa.getTier4Census(),
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT, 90f, 90f, 90f, 90f);

        // Alternative 5
        PresentationOption presentationOption5 = testEntityHelper.createTestPresentationOption(client, "Alternative 5");
        // Dental
        RfpQuote dentalQuote5 = testEntityHelper
                .createTestRfpQuote(client, CarrierType.DELTA_DENTAL.name(), Constants.DENTAL);
        RfpQuoteOption dentalOption5 = testEntityHelper.createTestRfpQuoteOption(dentalQuote5, "Renewal 1");
        // Dhmo
        RfpQuoteNetwork rqnDhmo5 = testEntityHelper.createTestQuoteNetwork(dentalQuote5, "DHMO");
        RfpQuoteNetworkPlan rqnpDhmo5 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan Dhmo", rqnDhmo5,
                cpDhmo.getTier1Rate() * 1.2f,
                cpDhmo.getTier2Rate() * 1.2f,
                cpDhmo.getTier3Rate() * 1.2f,
                cpDhmo.getTier4Rate() * 1.2f);
        testEntityHelper.createTestBenefit("ADULT_PROPHY", rqnpDhmo5.getPnn().getPlan(), "$12", null);
        testEntityHelper.createTestBenefit("CHILD_PROPHY", rqnpDhmo5.getPnn().getPlan(), "$34", "$41");
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(dentalOption5, rqnDhmo5, rqnpDhmo5, cpDhmo, 
                cpDhmo.getTier1Census(), cpDhmo.getTier2Census(), 
                cpDhmo.getTier3Census(), cpDhmo.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);
        // Dppo
        RfpQuoteNetwork rqnDppo5 = testEntityHelper.createTestQuoteNetwork(dentalQuote5, "DPPO");
        RfpQuoteNetworkPlan rqnpDppo5 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan Dppo", rqnDppo5,
                cpDppo.getTier1Rate() * 1.2f,
                cpDppo.getTier2Rate() * 1.2f,
                cpDppo.getTier3Rate() * 1.2f,
                cpDppo.getTier4Rate() * 1.2f);
        testEntityHelper.createTestBenefit("CALENDAR_YEAR_MAXIMUM", rqnpDppo5.getPnn().getPlan(), "$1234", null);
        testEntityHelper.createTestBenefit("IMPLANT_COVERAGE", rqnpDppo5.getPnn().getPlan(), "Not covered", null);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(dentalOption5, rqnDppo5, rqnpDppo5, cpDppo, 
                cpDppo.getTier1Census(), cpDppo.getTier2Census(), 
                cpDppo.getTier3Census(), cpDppo.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);

        presentationOption5.setDentalRfpQuoteOption(dentalOption5);
        
        MarketingList medicalStatus1 = testEntityHelper.createTestMarketingList(client, 
                CarrierType.GUARDIAN.name(), Constants.MEDICAL, MarketingStatus.RFP_SUBMITTED);
        MarketingList medicalStatus2 = testEntityHelper.createTestMarketingList(client, 
                CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.MEDICAL, MarketingStatus.QUOTED);
        MarketingList medicalStatus3 = testEntityHelper.createTestMarketingList(client, 
                CarrierType.ASSURANT.name(), Constants.MEDICAL, MarketingStatus.DECLINED);
        MarketingList dentalStatus = testEntityHelper.createTestMarketingList(client, 
            CarrierType.DELTA_DENTAL.name(), Constants.DENTAL, MarketingStatus.QUOTED);
        MarketingList visionStatus1 = testEntityHelper.createTestMarketingList(client, 
                CarrierType.EYEMED.name(), Constants.VISION, MarketingStatus.QUOTED);
        MarketingList visionStatus2 = testEntityHelper.createTestMarketingList(client, 
                CarrierType.CIGNA.name(), Constants.VISION, MarketingStatus.QUOTED);

        flushAndClear();

        //Future<byte[]> logoFutureData = service.getBrokerLogo("https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/brokerage/mma/mma.png");

        Map<String, Object> viewData = new HashMap<>();
        Data data = service.fillData(viewData, client, false);
        
        assertThat(viewData.get("client_name")).isEqualTo(client.getClientName());
        
        // current carrier: cpHmo - Kaiser, cpHsa - Health Net 
        assertThat(viewData.get("mcc")).isEqualTo(
                cpHsa.getPnn().getPlan().getCarrier().getDisplayName() + " / " + CarrierType.KAISER.displayName);
        
        assertThat(viewData.get("m0c-0")).isEqualTo(cpHmo.getPnn().getPlan().getCarrier().getDisplayName());
        assertThat(viewData.get("m0n-0")).isEqualTo(cpHmo.getPnn().getName());
        assertThat(viewData.get("m1n-0")).isEqualTo(cpHsa.getPnn().getName());
        assertThat(viewData.get("m1c-0")).isEqualTo(cpHsa.getPnn().getPlan().getCarrier().getDisplayName());
        assertThat(viewData.get("m5c-0")).isNull();
        assertThat(viewData.get("m6c-0")).isNull();
        //assertThat(viewData.get("m0b0i-0")).isEqualTo("$11");
        assertThat(viewData.get("m0b0o-0")).isNull();
        //assertThat(viewData.get("p1b0i")).isEqualTo("$10");
        //assertThat(viewData.get("p1b0o")).isEqualTo("$20");

        // medical marketing analysis - first medical plan on first page alternative 2
        assertThat(viewData.get("m1c-ra-0-0")).isEqualTo("Kaiser");
        
        // first plan on first page
        assertThat((String)viewData.get("m_marketing_notes-0-0"))
            .contains("Alternative 1")
            .doesNotContain("Alternative 2");

        // second plan on first page
        assertThat((String)viewData.get("m_marketing_notes-ra-0-1"))
            .doesNotContain("Alternative 1")
            .contains("Alternative 2");

        // medical marketing status
        assertThat(viewData.get("mc1")).isEqualTo("Guardian");
        assertThat(viewData.get("mp1")).isEqualTo("-");
        assertThat(viewData.get("mresponse1")).isEqualTo("Not Illustrated");

        assertThat(viewData.get("mc2")).isEqualTo("Anthem Blue Cross");
        assertThat(viewData.get("mresponse2")).isEqualTo("Illustrated");

        assertThat(viewData.get("mc3")).isEqualTo("Assurant");
        assertThat(viewData.get("mp3")).isEqualTo("DTQ");
        assertThat(viewData.get("mresponse3")).isEqualTo("Not Illustrated");

        // medical renewal percent change
        //assertThat(viewData.get("mpn")).isEqualTo("20.1%");
        // dental renewal percent change
        //assertThat(viewData.get("dpn")).isEqualTo("20.0%");
        // vision renewal percent change
        assertThat(viewData.get("vpn")).isEqualTo("20.0%");

        // medical alternative 1 percent change
        //assertThat(viewData.get("mpt-0")).isEqualTo("-14.5%");
        // dental alternative 1 percent change
        //assertThat(viewData.get("dpt-0")).isEqualTo("20.0%");
        // vision alternative 1 percent change
        assertThat(viewData.get("vpt-0")).isEqualTo("20.0%");

        
        byte[] logoData = null;
        //logoData = logoFutureData.get(5, TimeUnit.SECONDS);

        byte[] bytes = PptxGenerator.generate("/templates/presentation.pptx", data, viewData, logoData);

        assertThat(bytes).isNotNull();
        
        //java.io.File pptx = new java.io.File("test-presentation1.pptx");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(pptx, bytes);
        
    }

    @Test
    public void getPresentationWithAncillaryByClientId() throws Exception {

        //Future<byte[]> logoFutureData = service.getBrokerLogo("https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/brokerage/mma/mma.png");

        Client client = testEntityHelper.createTestClient();
        
        // MEDICAL
        
        // CURRENT
        // HMO
        ClientPlan cpHmo = testEntityHelper
            .createTestClientPlan("hmo client plan", client, CarrierType.AETNA.name(), "HMO");
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "$11", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "$33", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", cpHmo.getPnn().getPlan(), "N/A", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "N/A", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "N/A", null);
        // HSA
        ClientPlan cpHsa = testEntityHelper
                .createTestClientPlan("hsa client plan", client, CarrierType.CIGNA.name(), "HSA");
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
       
        // RENEWAL
        RfpQuote rfpQuoteMedical = testEntityHelper
                .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.MEDICAL);
        RfpQuoteOption rqoRenewalMedical = testEntityHelper.createTestRfpQuoteOption(rfpQuoteMedical, "Renewal");
        // HMO
        RfpQuoteNetwork rqnHmoRenewal = testEntityHelper.createTestQuoteNetwork(rfpQuoteMedical, "HMO");
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

        // Alternative 1
        PresentationOption presentationOption1 = testEntityHelper.createTestPresentationOption(client, "Alternative 1");
        RfpQuote medicalQuote1 = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption1 = testEntityHelper.createTestRfpQuoteOption(medicalQuote1, "Option 1");
        presentationOption1.setMedicalRfpQuoteOption(medicalOption1);
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

        // Alternative 2
        PresentationOption presentationOption2 = testEntityHelper.createTestPresentationOption(client, "Alternative 2");
        RfpQuote medicalQuote2 = testEntityHelper.createTestRfpQuote(client, CarrierType.BLUE_SHIELD.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption2 = testEntityHelper.createTestRfpQuoteOption(medicalQuote2, "Option 1");
        presentationOption2.setMedicalRfpQuoteOption(medicalOption2);
        // HMO
        RfpQuoteNetwork hmoNetwork2 = testEntityHelper.createTestQuoteNetwork(medicalQuote2, "HMO option2", "HMO");
        RfpQuoteNetworkPlan hmoPlan2 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork2, 100.91f, 200.90f, 290.00f, 450.19f, true);
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption2,
            hmoNetwork2, hmoPlan2, cpHmo, 80L, 10L, 80L, 5L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", hmoPlan2.getPnn().getPlan(), "$13", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", hmoPlan2.getPnn().getPlan(), "$39", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", hmoPlan2.getPnn().getPlan(), "$45", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", hmoPlan2.getPnn().getPlan(), "$9", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", hmoPlan2.getPnn().getPlan(), "$27", null);
        // HSA
        RfpQuoteNetwork hsaNetwork2 = testEntityHelper.createTestQuoteNetwork(medicalQuote2, "HSA option2", "HSA");
        RfpQuoteNetworkPlan hsaPlan2 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hsa", hsaNetwork2,
                cpHsa.getTier1Rate() * 0.9f,
                cpHsa.getTier2Rate() * 0.9f,
                cpHsa.getTier3Rate() * 0.9f,
                cpHsa.getTier4Rate() * 0.9f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption2, hsaNetwork2, hsaPlan2, cpHsa, 
                cpHsa.getTier1Census(), cpHsa.getTier2Census(), cpHsa.getTier3Census(), cpHsa.getTier4Census(),
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT, 90f, 90f, 90f, 90f);

        // Alternative 3
        PresentationOption presentationOption3 = testEntityHelper.createTestPresentationOption(client, "Alternative 3");
        RfpQuote medicalQuote3 = testEntityHelper.createTestRfpQuote(client, CarrierType.AETNA.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption3 = testEntityHelper.createTestRfpQuoteOption(medicalQuote3, "Option 1");
        presentationOption3.setMedicalRfpQuoteOption(medicalOption3);
        // HMO
        RfpQuoteNetwork hmoNetwork3 = testEntityHelper.createTestQuoteNetwork(medicalQuote3, "HMO option3", "HMO");
        RfpQuoteNetworkPlan hmoPlan3 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork3, 100.91f, 200.90f, 290.00f, 450.19f, true);
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption3,
            hmoNetwork3, hmoPlan3, cpHmo, 80L, 10L, 80L, 5L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", hmoPlan3.getPnn().getPlan(), "$13", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", hmoPlan3.getPnn().getPlan(), "$39", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", hmoPlan3.getPnn().getPlan(), "$45", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", hmoPlan3.getPnn().getPlan(), "$9", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", hmoPlan3.getPnn().getPlan(), "$27", null);
        // HSA
        RfpQuoteNetwork hsaNetwork3 = testEntityHelper.createTestQuoteNetwork(medicalQuote3, "HSA option3", "HSA");
        RfpQuoteNetworkPlan hsaPlan3 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hsa", hsaNetwork3,
                cpHsa.getTier1Rate() * 0.9f,
                cpHsa.getTier2Rate() * 0.9f,
                cpHsa.getTier3Rate() * 0.9f,
                cpHsa.getTier4Rate() * 0.9f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption3, hsaNetwork3, hsaPlan3, cpHsa, 
                cpHsa.getTier1Census(), cpHsa.getTier2Census(), cpHsa.getTier3Census(), cpHsa.getTier4Census(),
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT, 90f, 90f, 90f, 90f);

        // Alternative 4
        PresentationOption presentationOption4 = testEntityHelper.createTestPresentationOption(client, "Alternative 4");
        RfpQuote medicalQuote4 = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption4 = testEntityHelper.createTestRfpQuoteOption(medicalQuote4, "Option 1");
        presentationOption4.setMedicalRfpQuoteOption(medicalOption4);
        // HMO
        RfpQuoteNetwork hmoNetwork4 = testEntityHelper.createTestQuoteNetwork(medicalQuote4, "HMO option4", "HMO");
        RfpQuoteNetworkPlan hmoPlan4 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork4, 100.91f, 200.90f, 290.00f, 450.19f, true);
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption4,
            hmoNetwork4, hmoPlan4, cpHmo, 80L, 10L, 80L, 5L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", hmoPlan4.getPnn().getPlan(), "$13", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", hmoPlan4.getPnn().getPlan(), "$39", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", hmoPlan4.getPnn().getPlan(), "$45", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", hmoPlan4.getPnn().getPlan(), "$9", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", hmoPlan4.getPnn().getPlan(), "$27", null);
        // HSA
        RfpQuoteNetwork hsaNetwork4 = testEntityHelper.createTestQuoteNetwork(medicalQuote4, "HSA option4", "HSA");
        RfpQuoteNetworkPlan hsaPlan4 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hsa", hsaNetwork4,
                cpHsa.getTier1Rate() * 0.9f,
                cpHsa.getTier2Rate() * 0.9f,
                cpHsa.getTier3Rate() * 0.9f,
                cpHsa.getTier4Rate() * 0.9f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption4, hsaNetwork4, hsaPlan4, cpHsa, 
                cpHsa.getTier1Census(), cpHsa.getTier2Census(), cpHsa.getTier3Census(), cpHsa.getTier4Census(),
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT, 90f, 90f, 90f, 90f);

        Activity competitiveInfo1 = testEntityHelper.createTestActivity(client, CarrierType.HEALTHNET.name(), 
                Constants.MEDICAL, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "14");

        Activity competitiveInfo2 = testEntityHelper.createTestActivity(client, CarrierType.BLUE_SHIELD.name(), 
                Constants.MEDICAL, ActivityType.COMPETITIVE_INFO, CompetitiveInfoOption.DIFFERENCE.name(), "12");

        //Alternative 5 - Renewal Alternative
        PresentationOption presentationOption5 = testEntityHelper.createTestPresentationOption(client, "Alternative 5");
        RfpQuote medicalQuote5 = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption5 = testEntityHelper.createTestRfpQuoteOption(medicalQuote5, "Renewal 2");
        presentationOption5.setMedicalRfpQuoteOption(medicalOption5);
        // HMO
        RfpQuoteNetwork hmoNetwork5 = testEntityHelper.createTestQuoteNetwork(medicalQuote5, "HMO option5", "HMO");
        RfpQuoteNetworkPlan hmoPlan5 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan 5",
            hmoNetwork5, 150.91f, 200.90f, 290.00f, 450.19f, true);
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption5,
            hmoNetwork5, hmoPlan5, cpHmo, 80L, 10L, 80L, 5L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", hmoPlan5.getPnn().getPlan(), "$12", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", hmoPlan5.getPnn().getPlan(), "$36", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", hmoPlan5.getPnn().getPlan(), "$40", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", hmoPlan5.getPnn().getPlan(), "$10", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", hmoPlan5.getPnn().getPlan(), "$30", null);
        // HSA
        RfpQuoteNetwork hsaNetwork5 = testEntityHelper.createTestQuoteNetwork(medicalQuote5, "HSA option5", "HSA");
        RfpQuoteNetworkPlan hsaPlan5 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hsa", hsaNetwork5,
                cpHsa.getTier1Rate() * 0.9f,
                cpHsa.getTier2Rate() * 0.9f,
                cpHsa.getTier3Rate() * 0.9f,
                cpHsa.getTier4Rate() * 0.9f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption5, hsaNetwork5, hsaPlan5, cpHmo,
                cpHsa.getTier1Census(), cpHsa.getTier2Census(), cpHsa.getTier3Census(), cpHsa.getTier4Census(),
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT, 90f, 90f, 90f, 90f);

        //DENTAL
        // Current
        // DHMO
        ClientPlan cpDhmo = testEntityHelper
            .createTestClientPlan("hmo client plan", client, CarrierType.AETNA.name(), "DHMO");
        // RENEWAL
        RfpQuote rfpQuoteDental = testEntityHelper
            .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.DENTAL);
        RfpQuoteOption rqoRenewalDental = testEntityHelper.createTestRfpQuoteOption(rfpQuoteDental, "Renewal");
        RfpQuoteNetwork rqnDhmoRenewal = testEntityHelper.createTestQuoteNetwork(rfpQuoteDental, "DHMO");
        RfpQuoteNetworkPlan rqnpDhmoRenewal = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hmo", rqnDhmoRenewal,
                cpDhmo.getTier1Rate() * 1.2f,
                cpDhmo.getTier2Rate() * 1.2f,
                cpDhmo.getTier3Rate() * 1.2f,
                cpDhmo.getTier4Rate() * 1.2f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqoRenewalDental, rqnDhmoRenewal, rqnpDhmoRenewal, cpDhmo,
                cpDhmo.getTier1Census(), cpDhmo.getTier2Census(),
                cpDhmo.getTier3Census(), cpDhmo.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);

        // VISION
        // Current
        ClientPlan cpVision = testEntityHelper
            .createTestClientPlan("vision client plan", client, CarrierType.CIGNA.name(), Constants.VISION);
        // RENEWAL
        RfpQuote rfpQuoteVision = testEntityHelper
            .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.VISION);
        RfpQuoteOption rqoRenewalVision = testEntityHelper.createTestRfpQuoteOption(rfpQuoteVision, "Renewal");
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
        RfpQuoteAncillaryPlan basicLifePlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteLife, basicLife);
        RfpQuoteAncillaryOption basicRenewal = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", basicLifePlan);

        RfpQuote rfpQuoteVoluntaryLife = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), PlanCategory.VOL_LIFE.name());
        RfpQuoteAncillaryPlan voluntaryLifePlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteVoluntaryLife, voluntaryLife);
        RfpQuoteAncillaryOption voluntaryRenewal = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", voluntaryLifePlan);

        RfpQuote rfpQuoteStd = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.STD);
        RfpQuoteAncillaryPlan stdPlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteStd, basicStd);
        RfpQuoteAncillaryOption stdRenewal = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", stdPlan);

        RfpQuote rfpQuoteLtd = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.LTD);
        RfpQuoteAncillaryPlan ltdPlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteLtd, basicLtd);
        RfpQuoteAncillaryOption ltdRenewal = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", ltdPlan);

        //ANCILLARY ALTERNATIVE
        //LIFE
        RfpQuote rfpQuoteLife1 = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.LIFE);
        RfpQuote rfpQuoteLife2 = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.LIFE);
        RfpQuote rfpQuoteLife3 = testEntityHelper.createTestRfpQuote(client, CarrierType.AETNA.name(), Constants.LIFE);
        RfpQuote rfpQuoteLife4 = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.LIFE);
        RfpQuote rfpQuoteLife5 = testEntityHelper.createTestRfpQuote(client, CarrierType.AMERITAS.name(), Constants.LIFE);
        RfpQuoteAncillaryPlan lifePlan1 =
            testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 1 Life Plan", PlanCategory.LIFE,
                AncillaryPlanType.BASIC, rfpQuoteLife1
            );
        LifeClass lifeClass1 = (LifeClass) lifePlan1.getAncillaryPlan().getClasses().get(0);
        lifeClass1.setConversion("true");
        lifeClass1.setPortability("false");
        
        RfpQuoteAncillaryPlan lifePlan2 =
            testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 2 Life Plan", PlanCategory.LIFE,
                AncillaryPlanType.BASIC, rfpQuoteLife2
            );
        RfpQuoteAncillaryPlan lifePlan3 =
            testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 3 Life Plan", PlanCategory.LIFE,
                AncillaryPlanType.BASIC, rfpQuoteLife3
            );
        RfpQuoteAncillaryPlan lifePlan4 =
            testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 4 Life Plan", PlanCategory.LIFE,
                AncillaryPlanType.BASIC, rfpQuoteLife4
            );
        RfpQuoteAncillaryPlan lifePlan5 =
            testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 5 Life Plan", PlanCategory.LIFE,
                AncillaryPlanType.BASIC, rfpQuoteLife5
            );

        RfpQuoteAncillaryOption lifeOption1 = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal 2", lifePlan1);
        RfpQuoteAncillaryOption lifeOption2 = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal 3", lifePlan2);
        RfpQuoteAncillaryOption lifeOption3 = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal 4", lifePlan3);
        RfpQuoteAncillaryOption lifeOption4 = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal 5", lifePlan4);
        RfpQuoteAncillaryOption lifeOption5 = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal 6", lifePlan5);

        presentationOption1.setLifeRfpQuoteAncillaryOption(lifeOption1);
        presentationOption2.setLifeRfpQuoteAncillaryOption(lifeOption2);
        presentationOption3.setLifeRfpQuoteAncillaryOption(lifeOption3);
        presentationOption4.setLifeRfpQuoteAncillaryOption(lifeOption4);
        presentationOption5.setLifeRfpQuoteAncillaryOption(lifeOption5);

        //STD
        RfpQuote rfpQuoteStd1 = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.STD);
        RfpQuoteAncillaryPlan stdPlan1 = testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 1 STD Plan",
            PlanCategory.STD, AncillaryPlanType.BASIC, rfpQuoteStd1);
        RfpQuoteAncillaryOption stdOption1 = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", stdPlan1);
        presentationOption1.setStdRfpQuoteAncillaryOption(stdOption1);
        //LTD
        RfpQuote rfpQuoteLtd1 = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.LTD);
        RfpQuoteAncillaryPlan ltdPlan1 = testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 1 LTD Plan",
            PlanCategory.LTD, AncillaryPlanType.BASIC, rfpQuoteLtd1);
        ltdPlan1.getAncillaryPlan().getRates().setVolume(80000.0);
        RfpQuoteAncillaryOption ltdOption1 = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", ltdPlan1);
        presentationOption1.setLtdRfpQuoteAncillaryOption(ltdOption1);

        flushAndClear();

        Map<String, Object> viewData = new HashMap<>();
        Data data = service.fillData(viewData, client, false);
        
        assertThat(viewData.get("client_name")).isEqualTo(client.getClientName());
        assertThat(viewData.get("m0c-0")).isEqualTo(cpHmo.getPnn().getPlan().getCarrier().getDisplayName());
        assertThat(viewData.get("m0n-0")).isEqualTo(cpHmo.getPnn().getName());
        assertThat(viewData.get("m1n-0")).isEqualTo(cpHsa.getPnn().getName());
        assertThat(viewData.get("m1c-0")).isEqualTo(cpHsa.getPnn().getPlan().getCarrier().getDisplayName());
        assertThat(viewData.get("m2c-0")).isNull();
        assertThat(viewData.get("m3c-0")).isNull();
        //assertThat(viewData.get("p0b0i")).isEqualTo("$11");
        assertThat(viewData.get("m0b0o")).isNull();
        //assertThat(viewData.get("p1b0i")).isEqualTo("$10");
        //assertThat(viewData.get("p1b0o")).isEqualTo("$20");

        // Alternative 1 class 1 Conversion and Portability
        assertThat(viewData.get("f1b5-0-0")).isEqualTo("Yes");
        assertThat(viewData.get("f1b6-0-0")).isEqualTo("No");
        
        byte[] logoData = null;
        //logoData = logoFutureData.get(5, TimeUnit.SECONDS);

        byte[] bytes = PptxGenerator.generate("/templates/presentation.pptx", data, viewData, logoData);

        assertThat(bytes).isNotNull();
        
        //java.io.File pptx = new java.io.File("test-presentation2.pptx");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(pptx, bytes);
        
    }

    @Test
    public void getPresentationAncillaryOnlyByClientId() throws Exception {
        //Future<byte[]> logoFutureData = service.getBrokerLogo("https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/brokerage/mma/mma.png");
        Client client = testEntityHelper.createTestClient();

        //basic life
        Carrier carrier1 = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.displayName);

        AncillaryPlan basicLife = testEntityHelper.createTestAncillaryPlan("Basic Life",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier1);
        LifeClass basicClass = (LifeClass) basicLife.getClasses().get(0);

        basicClass.setEmployeeBenefitAmount("9.0");
        basicClass.setAge65reduction("10");
        basicClass.setAge70reduction("11");
        basicClass.setAge75reduction("12");
        basicClass.setAge80reduction("13");

        //voluntary life
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

        //std
        AncillaryPlan basicStd = testEntityHelper.createTestAncillaryPlan("Basic Std",
            PlanCategory.STD, AncillaryPlanType.BASIC, carrier1);

        //ltd
        AncillaryPlan basicLtd = testEntityHelper.createTestAncillaryPlan("Basic Ltd",
            PlanCategory.LTD, AncillaryPlanType.BASIC, carrier1);

        // current
        testEntityHelper.createTestAncillaryClientPlan(client, basicLife, PlanCategory.LIFE);
        testEntityHelper.createTestAncillaryClientPlan(client, voluntaryLife, PlanCategory.VOL_LIFE);
        testEntityHelper.createTestAncillaryClientPlan(client, basicStd, PlanCategory.STD);
        testEntityHelper.createTestAncillaryClientPlan(client, basicLtd, PlanCategory.LTD);

        // RENEWAL
        RfpQuote rfpQuoteLife = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.LIFE);
        RfpQuoteAncillaryPlan basicLifePlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteLife, basicLife);
        testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", basicLifePlan);

        RfpQuote rfpQuoteVoluntaryLife = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), PlanCategory.VOL_LIFE.name());
        RfpQuoteAncillaryPlan voluntaryLifePlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteVoluntaryLife, voluntaryLife);
        testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", voluntaryLifePlan);

        RfpQuote rfpQuoteStd = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.STD);
        RfpQuoteAncillaryPlan stdPlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteStd, basicStd);
        testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", stdPlan);

        RfpQuote rfpQuoteLtd = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.LTD);
        RfpQuoteAncillaryPlan ltdPlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteLtd, basicLtd);
        testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", ltdPlan);

        flushAndClear();

        Map<String, Object> viewData = new HashMap<>();
        Data data = service.fillData(viewData, client, false);

        assertThat(viewData.get("client_name")).isEqualTo(client.getClientName());
        assertThat(viewData.get("mhide")).isEqualTo(Pair.of(null, 0));
        assertThat(viewData.get("dhide")).isEqualTo(Pair.of(null, 0));
        assertThat(viewData.get("vhide")).isEqualTo(Pair.of(null, 0));
        assertThat(viewData.get("fhide")).isNull();
        assertThat(viewData.get("hhide")).isNull();
        assertThat(viewData.get("shide")).isNull();
        assertThat(viewData.get("lhide")).isNull();
        assertThat(viewData.get("m2c")).isNull();
        assertThat(viewData.get("m3c")).isNull();
        assertThat(viewData.get("m0b0o")).isNull();

        byte[] logoData = null;
        //logoData = logoFutureData.get(5, TimeUnit.SECONDS);
        byte[] bytes = PptxGenerator.generate("/templates/presentation.pptx", data, viewData, logoData);

        assertThat(bytes).isNotNull();

        //java.io.File pptx = new java.io.File("test-presentation3.pptx");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(pptx, bytes);
    }

    @Test
    public void getPresentationVisionWithDentalAlternativeByClientId() throws Exception {
        Client client = testEntityHelper.createTestClient();

        // VISION
        // Current
        ClientPlan cpVision = testEntityHelper
            .createTestClientPlan("vision client plan", client, CarrierType.CIGNA.name(), Constants.VISION);
        // RENEWAL
        RfpQuote rfpQuoteVision = testEntityHelper
            .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.VISION);
        RfpQuoteOption rqoRenewalVision = testEntityHelper.createTestRfpQuoteOption(rfpQuoteVision, "Renewal");
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


        // Alternative 1
        PresentationOption presentationOption1 = testEntityHelper.createTestPresentationOption(client, "Alternative 1");
        //Dental
        RfpQuote dentalQuote1 = testEntityHelper
            .createTestRfpQuote(client, CarrierType.DELTA_DENTAL.name(), Constants.DENTAL);
        RfpQuoteOption dentalOption1 = testEntityHelper.createTestRfpQuoteOption(dentalQuote1, "Option 1");
        RfpQuoteNetwork rqnDhmo1 = testEntityHelper.createTestQuoteNetwork(dentalQuote1, "DHMO");
        RfpQuoteNetworkPlan rqnpDhmo1 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hmo", rqnDhmo1,
                20f,
                30f,
                40f,
                50f);
        testEntityHelper.createTestBenefit("ADULT_PROPHY", rqnpDhmo1.getPnn().getPlan(), "$12", null);
        testEntityHelper.createTestBenefit("CHILD_PROPHY", rqnpDhmo1.getPnn().getPlan(), "$34", "$41");

        testEntityHelper
            .createTestRfpQuoteOptionNetwork(dentalOption1, rqnDhmo1, rqnpDhmo1, null,
                60L, 70L,
                80L, 85L,
                "PERCENT", 90f, 90f, 90f, 90f);
        presentationOption1.setDentalRfpQuoteOption(dentalOption1);
        // Vision
        RfpQuote visionQuote1 = testEntityHelper
            .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.VISION);
        RfpQuoteOption visionOption1 = testEntityHelper.createTestRfpQuoteOption(visionQuote1, "Option 1");
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
        presentationOption1.setVisionRfpQuoteOption(visionOption1);
        presentationOption1.setDentalDiscountPercent(1F);
        presentationOption1.setVisionDiscountPercent(0.5F);

        // Alternative 2
        PresentationOption presentationOption2 = testEntityHelper.createTestPresentationOption(client, "Alternative 2");
        // Vision
        RfpQuote visionQuote2 = testEntityHelper
            .createTestRfpQuote(client, CarrierType.EYEMED.name(), Constants.VISION);
        RfpQuoteOption visionOption2 = testEntityHelper.createTestRfpQuoteOption(visionQuote2, "Option 2");
        RfpQuoteNetwork rqnVision2 = testEntityHelper.createTestQuoteNetwork(visionQuote2, Constants.VISION);
        RfpQuoteNetworkPlan rqnpVision2 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("vision", rqnVision2,
                cpVision.getTier1Rate() * 1.2f,
                cpVision.getTier2Rate() * 1.2f,
                cpVision.getTier3Rate() * 1.2f,
                cpVision.getTier4Rate() * 1.2f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(visionOption2, rqnVision2, rqnpVision2, cpVision,
                cpVision.getTier1Census(), cpVision.getTier2Census(),
                cpVision.getTier3Census(), cpVision.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);
        presentationOption2.setVisionRfpQuoteOption(visionOption2);
        presentationOption2.setVisionDiscountPercent(0.5F);

        MarketingList visionStatus1 = testEntityHelper.createTestMarketingList(client,
            CarrierType.EYEMED.name(), Constants.VISION, MarketingStatus.QUOTED);
        MarketingList visionStatus2 = testEntityHelper.createTestMarketingList(client,
            CarrierType.CIGNA.name(), Constants.VISION, MarketingStatus.QUOTED);
        MarketingList dentalStatus = testEntityHelper.createTestMarketingList(client,
            CarrierType.DELTA_DENTAL.name(), Constants.DENTAL, MarketingStatus.QUOTED);

        flushAndClear();

        Map<String, Object> viewData = new HashMap<>();
        Data data = service.fillData(viewData, client, false);

        assertThat(viewData.get("client_name")).isEqualTo(client.getClientName());
        assertThat(viewData.get("mhide")).isEqualTo(Pair.of(null, 0));
        assertThat(viewData.get("dhide")).isEqualTo(Pair.of(null, 0));
        assertThat(viewData.get("fhide")).isEqualTo(Pair.of(null, 0));
        assertThat(viewData.get("hhide")).isEqualTo(Pair.of(null, 0));
        assertThat(viewData.get("shide")).isEqualTo(Pair.of(null, 0));
        assertThat(viewData.get("lhide")).isEqualTo(Pair.of(null, 0));
        assertThat(viewData.get("vhide")).isNull();
        assertThat(viewData.get("m2c")).isNull();
        assertThat(viewData.get("m3c")).isNull();
        assertThat(viewData.get("m0b0o")).isNull();

        byte[] bytes = PptxGenerator.generate("/templates/presentation.pptx", data, viewData, null);

        assertThat(bytes).isNotNull();

        //java.io.File pptx = new java.io.File("test-presentation4.pptx");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(pptx, bytes);
    }

    @Test
    public void getPresentationWithAncillaryWithDuplicates() throws Exception {

        Client client = testEntityHelper.createTestClient();
        
        // MEDICAL
        
        // CURRENT
        // HMO
        ClientPlan cpHmo = testEntityHelper
            .createTestClientPlan("hmo client plan", client, CarrierType.AETNA.name(), "HMO");
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "$11", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "$33", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", cpHmo.getPnn().getPlan(), "N/A", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "N/A", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "N/A", null);
        // HSA
        ClientPlan cpHsa = testEntityHelper
                .createTestClientPlan("hsa client plan", client, CarrierType.CIGNA.name(), "HSA");
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
       
        // RENEWAL
        RfpQuote rfpQuoteMedical = testEntityHelper
                .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.MEDICAL);
        RfpQuoteOption rqoRenewalMedical = testEntityHelper.createTestRfpQuoteOption(rfpQuoteMedical, "Renewal");
        // HMO
        RfpQuoteNetwork rqnHmoRenewal = testEntityHelper.createTestQuoteNetwork(rfpQuoteMedical, "HMO");
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

        // Alternative 1
        PresentationOption presentationOption1 = testEntityHelper.createTestPresentationOption(client, "Alternative 1");
        RfpQuote medicalQuote1 = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption1 = testEntityHelper.createTestRfpQuoteOption(medicalQuote1, "Option 1");
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
        
        presentationOption1.setMedicalRfpQuoteOption(medicalOption1);
        presentationOption1.setDentalDiscountPercent(1f);
        presentationOption1.setVisionDiscountPercent(0.5f);

        // Alternative 2 - Renewal Alternative
        PresentationOption presentationOption2 = testEntityHelper.createTestPresentationOption(client, "Alternative 2");
        RfpQuote medicalQuote2 = testEntityHelper.createTestRfpQuote(client, CarrierType.AETNA.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption2 = testEntityHelper.createTestRfpQuoteOption(medicalQuote2, "Option 1");
        presentationOption2.setMedicalRfpQuoteOption(medicalOption2);
        // HMO
        RfpQuoteNetwork hmoNetwork2 = testEntityHelper.createTestQuoteNetwork(medicalQuote2, "HMO option2", "HMO");
        RfpQuoteNetworkPlan hmoPlan2 = testEntityHelper.createTestRfpQuoteNetworkPlan("test hmo plan",
            hmoNetwork2, 100.91f, 200.90f, 290.00f, 450.19f, true);
        testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption2,
            hmoNetwork2, hmoPlan2, cpHmo, 80L, 10L, 80L, 5L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", hmoPlan2.getPnn().getPlan(), "$13", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", hmoPlan2.getPnn().getPlan(), "$39", null);
        testEntityHelper.createTestBenefit("CO_INSURANCE", hmoPlan2.getPnn().getPlan(), "$45", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", hmoPlan2.getPnn().getPlan(), "$9", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", hmoPlan2.getPnn().getPlan(), "$27", null);
        // HSA
        RfpQuoteNetwork hsaNetwork2 = testEntityHelper.createTestQuoteNetwork(medicalQuote2, "HSA option2", "HSA");
        RfpQuoteNetworkPlan hsaPlan2 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hsa", hsaNetwork2,
                cpHsa.getTier1Rate() * 0.9f,
                cpHsa.getTier2Rate() * 0.9f,
                cpHsa.getTier3Rate() * 0.9f,
                cpHsa.getTier4Rate() * 0.9f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption2, hsaNetwork2, hsaPlan2, cpHsa, 
                cpHsa.getTier1Census(), cpHsa.getTier2Census(), cpHsa.getTier3Census(), cpHsa.getTier4Census(),
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT, 90f, 90f, 90f, 90f);

        // Alternative 3 
        // duplicate of Alternative 1 with same discounts
        PresentationOption presentationOption3 = testEntityHelper.createTestPresentationOption(client, "Alternative 3");
        presentationOption3.setMedicalRfpQuoteOption(medicalOption1);
        presentationOption3.setDentalDiscountPercent(1f);
        presentationOption3.setVisionDiscountPercent(0.5f);

        // Alternative 4  
        PresentationOption presentationOption4 = testEntityHelper.createTestPresentationOption(client, "Alternative 4");
        // duplicate of Alternative 2
        presentationOption4.setMedicalRfpQuoteOption(medicalOption2);

        //Alternative 5
        PresentationOption presentationOption5 = testEntityHelper.createTestPresentationOption(client, "Alternative 5");
        // duplicate of Alternative 1 but different set of discounts
        presentationOption5.setMedicalRfpQuoteOption(medicalOption1);
        presentationOption5.setDentalDiscountPercent(1f);
        presentationOption5.setLifeDiscountPercent(0.5f);

        //DENTAL
        // Current
        // DHMO
        ClientPlan cpDhmo = testEntityHelper
            .createTestClientPlan("hmo client plan", client, CarrierType.AETNA.name(), "DHMO");
        // RENEWAL
        RfpQuote rfpQuoteDental = testEntityHelper
            .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.DENTAL);
        RfpQuoteOption rqoRenewalDental = testEntityHelper.createTestRfpQuoteOption(rfpQuoteDental, "Renewal");
        RfpQuoteNetwork rqnDhmoRenewal = testEntityHelper.createTestQuoteNetwork(rfpQuoteDental, "DHMO");
        RfpQuoteNetworkPlan rqnpDhmoRenewal = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hmo", rqnDhmoRenewal,
                cpDhmo.getTier1Rate() * 1.2f,
                cpDhmo.getTier2Rate() * 1.2f,
                cpDhmo.getTier3Rate() * 1.2f,
                cpDhmo.getTier4Rate() * 1.2f);
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqoRenewalDental, rqnDhmoRenewal, rqnpDhmoRenewal, cpDhmo,
                cpDhmo.getTier1Census(), cpDhmo.getTier2Census(),
                cpDhmo.getTier3Census(), cpDhmo.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);
        
        
        // Dental
        RfpQuote dentalQuote1 = testEntityHelper
                .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.DENTAL);
        RfpQuoteOption dentalOption1 = testEntityHelper.createTestRfpQuoteOption(dentalQuote1, "Option 1");
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

        presentationOption1.setDentalRfpQuoteOption(dentalOption1);
        presentationOption4.setDentalRfpQuoteOption(dentalOption1);

        RfpQuote dentalQuote5 = testEntityHelper
                .createTestRfpQuote(client, CarrierType.UHC.name(), Constants.DENTAL);
        RfpQuoteOption dentalOption5 = testEntityHelper.createTestRfpQuoteOption(dentalQuote5, "Option 1");
        RfpQuoteNetwork rqnDhmo5 = testEntityHelper.createTestQuoteNetwork(dentalQuote5, "DHMO");
        RfpQuoteNetworkPlan rqnpDhmo5 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hmo", rqnDhmo5,
                cpDhmo.getTier1Rate() * 1.1f,
                cpDhmo.getTier2Rate() * 1.1f,
                cpDhmo.getTier3Rate() * 1.1f,
                cpDhmo.getTier4Rate() * 1.1f);
        testEntityHelper.createTestBenefit("ADULT_PROPHY", rqnpDhmo5.getPnn().getPlan(), "$12", null);
        testEntityHelper.createTestBenefit("CHILD_PROPHY", rqnpDhmo5.getPnn().getPlan(), "$34", "$41");

        testEntityHelper
            .createTestRfpQuoteOptionNetwork(dentalOption5, rqnDhmo5, rqnpDhmo5, cpDhmo, 
                cpDhmo.getTier1Census(), cpDhmo.getTier2Census(), 
                cpDhmo.getTier3Census(), cpDhmo.getTier4Census(),
                "PERCENT", 90f, 90f, 90f, 90f);

        presentationOption5.setDentalRfpQuoteOption(dentalOption5);

        
        // VISION
        // Current
        ClientPlan cpVision = testEntityHelper
            .createTestClientPlan("vision client plan", client, CarrierType.CIGNA.name(), Constants.VISION);
        // RENEWAL
        RfpQuote rfpQuoteVision = testEntityHelper
            .createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.VISION);
        RfpQuoteOption rqoRenewalVision = testEntityHelper.createTestRfpQuoteOption(rfpQuoteVision, "Renewal");
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
        RfpQuoteAncillaryPlan basicLifePlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteLife, basicLife);
        RfpQuoteAncillaryOption basicRenewal = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", basicLifePlan);

        RfpQuote rfpQuoteVoluntaryLife = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), PlanCategory.VOL_LIFE.name());
        RfpQuoteAncillaryPlan voluntaryLifePlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteVoluntaryLife, voluntaryLife);
        RfpQuoteAncillaryOption voluntaryRenewal = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", voluntaryLifePlan);

        RfpQuote rfpQuoteStd = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.STD);
        RfpQuoteAncillaryPlan stdPlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteStd, basicStd);
        RfpQuoteAncillaryOption stdRenewal = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", stdPlan);

        RfpQuote rfpQuoteLtd = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.LTD);
        RfpQuoteAncillaryPlan ltdPlan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuoteLtd, basicLtd);
        RfpQuoteAncillaryOption ltdRenewal = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal", ltdPlan);

        //ANCILLARY ALTERNATIVE
        //LIFE
        RfpQuote rfpQuoteLife1 = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), Constants.LIFE);
        RfpQuote rfpQuoteLife2 = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.LIFE);
        RfpQuote rfpQuoteLife3 = testEntityHelper.createTestRfpQuote(client, CarrierType.AETNA.name(), Constants.LIFE);
        RfpQuote rfpQuoteLife5 = testEntityHelper.createTestRfpQuote(client, CarrierType.AMERITAS.name(), Constants.LIFE);
        RfpQuoteAncillaryPlan lifePlan1 =
            testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 1 Life Plan", PlanCategory.LIFE,
                AncillaryPlanType.BASIC, rfpQuoteLife1
            );
        LifeClass lifeClass1 = (LifeClass) lifePlan1.getAncillaryPlan().getClasses().get(0);
        lifeClass1.setConversion("true");
        lifeClass1.setPortability("false");
        
        RfpQuoteAncillaryPlan lifePlan2 =
            testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 2 Life Plan", PlanCategory.LIFE,
                AncillaryPlanType.BASIC, rfpQuoteLife2
            );
        RfpQuoteAncillaryPlan lifePlan3 =
            testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 3 Life Plan", PlanCategory.LIFE,
                AncillaryPlanType.BASIC, rfpQuoteLife3
            );
        RfpQuoteAncillaryPlan lifePlan5 =
            testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 5 Life Plan", PlanCategory.LIFE,
                AncillaryPlanType.BASIC, rfpQuoteLife5
            );

        RfpQuoteAncillaryOption lifeOption1 = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal 2", lifePlan1);
        RfpQuoteAncillaryOption lifeOption2 = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal 3", lifePlan2);
        RfpQuoteAncillaryOption lifeOption3 = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal 4", lifePlan3);
        RfpQuoteAncillaryOption lifeOption5 = testEntityHelper.createTestRfpQuoteAncillaryOption("Renewal 6", lifePlan5);

        presentationOption1.setLifeRfpQuoteAncillaryOption(lifeOption1);
        presentationOption2.setLifeRfpQuoteAncillaryOption(lifeOption2);
        presentationOption3.setLifeRfpQuoteAncillaryOption(lifeOption3);
        presentationOption4.setLifeRfpQuoteAncillaryOption(lifeOption2);
        presentationOption5.setLifeRfpQuoteAncillaryOption(lifeOption5);

        //STD
        RfpQuote rfpQuoteStd1 = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.STD);
        RfpQuoteAncillaryPlan stdPlan1 = testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 1 STD Plan",
            PlanCategory.STD, AncillaryPlanType.BASIC, rfpQuoteStd1);
        RfpQuoteAncillaryOption stdOption1 = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", stdPlan1);
        presentationOption1.setStdRfpQuoteAncillaryOption(stdOption1);
        //LTD
        RfpQuote rfpQuoteLtd1 = testEntityHelper.createTestRfpQuote(client, CarrierType.ANTHEM_BLUE_CROSS.name(), Constants.LTD);
        RfpQuoteAncillaryPlan ltdPlan1 = testEntityHelper.createTestRfpQuoteAncillaryPlan("Alt 1 LTD Plan",
            PlanCategory.LTD, AncillaryPlanType.BASIC, rfpQuoteLtd1);
        ltdPlan1.getAncillaryPlan().getRates().setVolume(80000.0);
        RfpQuoteAncillaryOption ltdOption1 = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", ltdPlan1);
        presentationOption1.setLtdRfpQuoteAncillaryOption(ltdOption1);

        flushAndClear();

        Map<String, Object> viewData = new HashMap<>();
        Data data = service.fillData(viewData, client, false);
        
        assertThat(viewData.get("client_name")).isEqualTo(client.getClientName());
        
        // renewal plan1 page 1
        assertThat(viewData.get("m0name-ra-0-0")).isEqualTo("Current");
        assertThat(viewData.get("m1name-ra-0-0")).isEqualTo("Alternative 2, 4");
        assertThat(viewData.get("m2name-ra-0-0")).isNull();
        assertThat(viewData.get("m3name-ra-0-0")).isNull();
        
        // renewal plan2 page 1
        assertThat(viewData.get("m0name-ra-0-1")).isEqualTo("Current");
        assertThat(viewData.get("m1name-ra-0-1")).isEqualTo("Alternative 2, 4");
        assertThat(viewData.get("m2name-ra-0-1")).isNull();
        assertThat(viewData.get("m3name-ra-0-1")).isNull();
        
        // plan 1 page 1
        assertThat(viewData.get("m0name-0-0")).isEqualTo("Current");
        assertThat(viewData.get("m1name-0-0")).isEqualTo("Alternative 1, 3, 5");
        assertThat(viewData.get("m2name-0-0")).isNull();
        assertThat(viewData.get("m3name-0-0")).isNull();
        assertThat(viewData.get("m_marketing_notes-0-0")).isEqualTo(
                "Please Note: Medical Alternative 1, 3 includes 1.5% dental and vision bundling discount, "
                + "Medical Alternative 5 includes 1.5% dental and life bundling discount.");
        
        // plan 2 page 1
        assertThat(viewData.get("m0name-0-2")).isEqualTo("Current");
        assertThat(viewData.get("m1name-0-2")).isEqualTo("Alternative 1, 3, 5");
        assertThat(viewData.get("m2name-0-2")).isNull();
        assertThat(viewData.get("m3name-0-2")).isNull();
        assertThat(viewData.get("m_marketing_notes-0-2")).isEqualTo(
                "Please Note: Medical Alternative 1, 3 includes 1.5% dental and vision bundling discount, "
                + "Medical Alternative 5 includes 1.5% dental and life bundling discount.");
        
        // dhmo page 1
        assertThat(viewData.get("d0name-0-0")).isEqualTo("Current");
        assertThat(viewData.get("d1name-0-0")).isEqualTo("Alternative 1, 4");
        assertThat(viewData.get("d2name-0-0")).isEqualTo("Alternative 5");
        assertThat(viewData.get("d3name-0-0")).isNull();
        
        // class 1 page 1
        assertThat(viewData.get("f0name-0-0")).isEqualTo("Current");
        assertThat(viewData.get("f1name-0-0")).isEqualTo("Alternative 1");
        assertThat(viewData.get("f2name-0-0")).isEqualTo("Alternative 2, 4");
        assertThat(viewData.get("f3name-0-0")).isEqualTo("Alternative 3");

        // class 1 page 2
        assertThat(viewData.get("f0name-1-0")).isEqualTo("Current");
        assertThat(viewData.get("f1name-1-0")).isEqualTo("Alternative 5");
        assertThat(viewData.get("f2name-1-0")).isNull();
        assertThat(viewData.get("f3name-1-0")).isNull();

        // class 2 page 1
        assertThat(viewData.get("f0name-0-1")).isEqualTo("Current");
        assertThat(viewData.get("f1name-0-1")).isEqualTo("Alternative 1");
        assertThat(viewData.get("f2name-0-1")).isEqualTo("Alternative 2, 4");
        assertThat(viewData.get("f3name-0-1")).isEqualTo("Alternative 3");

        // class 2 page 2
        assertThat(viewData.get("f0name-1-1")).isEqualTo("Current");
        assertThat(viewData.get("f1name-1-1")).isEqualTo("Alternative 5");
        assertThat(viewData.get("f2name-1-1")).isNull();
        assertThat(viewData.get("f3name-1-1")).isNull();

        byte[] bytes = PptxGenerator.generate("/templates/presentation.pptx", data, viewData, null);

        assertThat(bytes).isNotNull();
        
        //java.io.File pptx = new java.io.File("test-presentation5.pptx");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(pptx, bytes);
        
    }

    @Test
    public void testRxPlans() throws Exception {
        
        Client client = testEntityHelper.createTestClient();
        
        // MEDICAL
        
        // CURRENT
        // HMO
        ClientPlan cpHmo = testEntityHelper
            .createTestClientPlan("hmo client plan", client, CarrierType.UHC.name(), "HMO");
        PlanNameByNetwork cpRxHmoPnn = testEntityHelper
                .createTestRxPlanNameByNetwork("rx client plan", cpHmo.getPnn().getNetwork(), client.getClientId());
        cpHmo.setRxPnn(cpRxHmoPnn);

        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "$11", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", cpHmo.getPnn().getPlan(), "$33", null);
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", cpRxHmoPnn.getPlan(), "$12", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", cpRxHmoPnn.getPlan(), "$34", null);

        // RENEWAL
        RfpQuote rfpQuoteMedical = testEntityHelper
                .createTestRfpQuote(client, CarrierType.HEALTHNET.name(), Constants.MEDICAL, QuoteType.KAISER);
        RfpQuoteOption rqoRenewalMedical = testEntityHelper.createTestRfpQuoteOption(rfpQuoteMedical, "Renewal");
        // HMO
        RfpQuoteNetwork rqnHmoRenewal = testEntityHelper.createTestQuoteNetwork(rfpQuoteMedical, "HMO");
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

        // Alternative 1
        PresentationOption presentationOption1 = testEntityHelper.createTestPresentationOption(client, "Alternative 1");
        RfpQuote medicalQuote1 = testEntityHelper.createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);
        RfpQuoteOption medicalOption1 = testEntityHelper.createTestRfpQuoteOption(medicalQuote1, "Option 1");
        presentationOption1.setMedicalRfpQuoteOption(medicalOption1);
        // HMO
        RfpQuoteNetwork hmoNetwork1 = testEntityHelper.createTestQuoteNetwork(medicalQuote1, "HMO option1", "HMO");
        RfpQuoteNetworkPlan hmoPlan1 = testEntityHelper.createTestRfpQuoteNetworkPlan("test HMO plan",
            hmoNetwork1, 100.91f, 200.90f, 290.00f, 450.19f, true);
        RfpQuoteNetworkPlan hmoRxPlan1 = testEntityHelper
                .createTestRfpQuoteNetworkRxPlan("test RX HMO plan", hmoNetwork1, 100f, 120f, 140f, 160f);
        RfpQuoteOptionNetwork hmoRqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(medicalOption1,
            hmoNetwork1, hmoPlan1, cpHmo, 80L, 10L, 80L, 5L,
            Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 0f, 0f, 0f, 0f);
        hmoRqon1.setSelectedRfpQuoteNetworkRxPlan(hmoRxPlan1);
        
        testEntityHelper.createTestBenefit("INDIVIDUAL_DEDUCTIBLE", hmoPlan1.getPnn().getPlan(), "$12", null);
        testEntityHelper.createTestBenefit("FAMILY_DEDUCTIBLE", hmoPlan1.getPnn().getPlan(), "$36", null);

        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", hmoRxPlan1.getPnn().getPlan(), "$10", null);
        testEntityHelper.createTestBenefit("RX_FAMILY_DEDUCTIBLE", hmoRxPlan1.getPnn().getPlan(), "$30", null);
        
        flushAndClear();

        Map<String, Object> viewData = new HashMap<>();
        Data data = service.fillData(viewData, client, false);
        
        assertThat(viewData.get("client_name")).isEqualTo(client.getClientName());
        
        byte[] bytes = PptxGenerator.generate("/templates/presentation.pptx", data, viewData, null);

        assertThat(bytes).isNotNull();

        // page 1 current analysis
        assertThat(viewData.get("m0b0i-0")).hasFieldOrPropertyWithValue("left", "$11.00");
        assertThat(viewData.get("m0b0o-0")).isNull();
        assertThat(viewData.get("m0b1i-0")).hasFieldOrPropertyWithValue("left", "$33.00");
        assertThat(viewData.get("m0b1o-0")).isNull();
        // rx
        assertThat(viewData.get("m0b11i-0")).hasFieldOrPropertyWithValue("left", "$12.00");
        assertThat(viewData.get("m0b11o-0")).isNull();
        assertThat(viewData.get("m0b12i-0")).hasFieldOrPropertyWithValue("left", "$34.00");
        assertThat(viewData.get("m0b12o-0")).isNull();

        // page 1 renewal analysis
        //  current 
        //   plan
        assertThat(viewData.get("m0b0i-ra-0-0")).hasFieldOrPropertyWithValue("left", "$11.00");
        assertThat(viewData.get("m0b0o-ra-0-0")).isNull();
        assertThat(viewData.get("m0b1i-ra-0-0")).hasFieldOrPropertyWithValue("left", "$33.00");
        assertThat(viewData.get("m0b1o-ra-0-0")).isNull();
        //   rxPlan
        assertThat(viewData.get("m0b11i-ra-0-0")).hasFieldOrPropertyWithValue("left", "$12.00");
        assertThat(viewData.get("m0b11o-ra-0-0")).isNull();
        assertThat(viewData.get("m0b12i-ra-0-0")).hasFieldOrPropertyWithValue("left", "$34.00");
        assertThat(viewData.get("m0b12o-ra-0-0")).isNull();
        
        //  alternative
        //   plan
        assertThat(viewData.get("m1b0i-ra-0-0")).hasFieldOrPropertyWithValue("left", "$12.00");
        assertThat(viewData.get("m1b0o-ra-0-0")).isNull();
        assertThat(viewData.get("m1b1i-ra-0-0")).hasFieldOrPropertyWithValue("left", "$36.00");
        assertThat(viewData.get("m1b1o-ra-0-0")).isNull();
        //   rxPlan
        assertThat(viewData.get("m1b11i-ra-0-0")).hasFieldOrPropertyWithValue("left", "$10.00");
        assertThat(viewData.get("m1b11o-ra-0-0")).isNull();
        assertThat(viewData.get("m1b12i-ra-0-0")).hasFieldOrPropertyWithValue("left", "$30.00");
        assertThat(viewData.get("m1b12o-ra-0-0")).isNull();
        
        //java.io.File pptx = new java.io.File("test-presentation-rxPlan.pptx");
        //org.apache.commons.io.FileUtils.writeByteArrayToFile(pptx, bytes);
        
    }

    

}
