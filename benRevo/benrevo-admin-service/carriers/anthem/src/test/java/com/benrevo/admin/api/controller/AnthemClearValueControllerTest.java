package com.benrevo.admin.api.controller;

import static com.benrevo.common.enums.CarrierType.ANTHEM_CLEAR_VALUE;
import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.testng.Assert.assertNull;
import static org.testng.Assert.assertTrue;

import com.benrevo.admin.service.AnthemClearValueService;
import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.UpdateStatusDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.Timeline;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.TimelineRepository;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.apache.tomcat.util.bcel.Const;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class AnthemClearValueControllerTest extends AdminAbstractControllerTest {

    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;


    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private SharedRfpService sharedRfpService;

    @Autowired
    private AnthemClearValueService anthemClearValueService;

    @Test
    public void testFullDisqualification_LargeClaims() throws Exception {

        Client client = testEntityHelper.createTestClient();
        client.setClientState(ClientState.QUOTED);
        clientRepository.save(client);

        RFP medicalRFP = testEntityHelper.createTestRFP(client, Constants.MEDICAL);
        RFP dentalRFP = testEntityHelper.createTestRFP(client, Constants.DENTAL);
        RFP visionRFP = testEntityHelper.createTestRFP(client, Constants.VISION);

        // create sample quotes
        RfpQuote medicalQuote = testEntityHelper
            .createTestRfpQuote(client, CarrierType.AMERITAS.name(), Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper
            .createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper
            .createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan,
                null, 11L, 14L, 21L, 24L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote dentalQuote = testEntityHelper
            .createTestRfpQuote(client, CarrierType.UHC.name(), Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper
            .createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        RfpQuoteOption dentalOption = testEntityHelper
            .createTestRfpQuoteOption(dentalQuote, "dental option");
        RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null,
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote visionQuote = testEntityHelper
            .createTestRfpQuote(client, CarrierType.BLUE_SHIELD.name(), Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper
            .createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
        RfpQuoteOption visionOption = testEntityHelper
            .createTestRfpQuoteOption(visionQuote, "vision option");
        RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null,
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        // now fully disqualify the user
        MvcResult result = performPostAndAssertResult(null, null,
            "/admin/anthem/quote/{disqualificationType}/disqualify/{reasonType}/{clientId}",
            "full", "largeClaims", client.getClientId());
        List<RFP> rfps = rfpRepository.findByClientClientId(client.getClientId());

        for(RFP rfp: rfps) {
            RfpCarrier rc_cv = sharedRfpService.getRfpCarrier(
                ANTHEM_CLEAR_VALUE.name(), rfp.getProduct()
            );

            RfpSubmission rfpSubmission = rfpSubmissionRepository.findByRfpCarrierAndClient(rc_cv, client);

            assertThat(rfpSubmission.getDisqualificationReason()).isNotNull();
            assertThat(rfpSubmission.getDisqualificationReason()).
                isEqualToIgnoringCase(anthemClearValueService.getAnthemCvLargeClaimsDisqualification());
        }

        List<RfpQuote> quotes = rfpQuoteRepository.
            findByRfpSubmissionClientClientIdAndLatestAndQuoteType(client.getClientId(),
                true, QuoteType.CLEAR_VALUE);

        // No quotes created
        assertThat(quotes.size()).isEqualTo(0);
    }


    @Test
    public void testFullDisqualification_LargeClaims_Anthem_CV_Already_Received() throws Exception {

        Client client = testEntityHelper.createTestClient();
        client.setClientState(ClientState.QUOTED);
        clientRepository.save(client);

        RFP medicalRFP = testEntityHelper.createTestRFP(client, Constants.MEDICAL);
        RFP dentalRFP = testEntityHelper.createTestRFP(client, Constants.DENTAL);
        RFP visionRFP = testEntityHelper.createTestRFP(client, Constants.VISION);

        // add an Anthem CV quote

        RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(
            Constants.ANTHEM_CLEAR_VALUE_CARRIER, Constants.MEDICAL);

        RfpSubmission rfpSubmission = new RfpSubmission();
        rfpSubmission.setClient(client);
        rfpSubmission.setRfpCarrier(rfpCarrier);

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, rfpSubmissionRepository.save(rfpSubmission),
            Constants.ANTHEM_CLEAR_VALUE_CARRIER, Constants.MEDICAL, QuoteType.CLEAR_VALUE);

        RfpQuoteNetwork rqn1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork rqn2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "PPO");
        RfpQuoteNetwork rqn3 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");

        RfpQuoteOptionNetwork rqon1 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn1, null, null, 10L, 15L, 20L,
                25L, "PERCENT", 90f, 90f, 90f, 90f
            );
        RfpQuoteOptionNetwork rqon2 =
            testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn2, null, null, 10L, 15L, 20L,
                25L, "PERCENT", 90f, 90f, 90f, 90f
            );
        flushAndClear();

        // now fully disqualify the user
        MvcResult result = performPostAndAssertResult(null, null,
            "/admin/anthem/quote/{disqualificationType}/disqualify/{reasonType}/{clientId}",
            "full", "largeClaims", client.getClientId());
        List<RFP> rfps = rfpRepository.findByClientClientId(client.getClientId());

        for(RFP rfp: rfps) {
            RfpCarrier rc_cv = sharedRfpService.getRfpCarrier(
                ANTHEM_CLEAR_VALUE.name(), rfp.getProduct()
            );

            RfpSubmission rfpSubmission2 = rfpSubmissionRepository.findByRfpCarrierAndClient(rc_cv, client);

            assertThat(rfpSubmission2.getDisqualificationReason()).isNotNull();
            assertThat(rfpSubmission2.getDisqualificationReason()).
                isEqualToIgnoringCase(anthemClearValueService.getAnthemCvLargeClaimsDisqualification());
        }

        List<RfpQuote> latestTrueQuotes = rfpQuoteRepository.
            findByRfpSubmissionClientClientIdAndLatestAndQuoteType(client.getClientId(),
                true, QuoteType.CLEAR_VALUE);

        List<RfpQuote> latestFalseQuotes = rfpQuoteRepository.
            findByRfpSubmissionClientClientIdAndLatestAndQuoteType(client.getClientId(),
                false, QuoteType.CLEAR_VALUE);

        assertThat(latestTrueQuotes.size()).isEqualTo(0);
        assertThat(latestFalseQuotes.size()).isEqualTo(1);
    }

    @Test
    public void testFullDisqualification_UnsupportedDisqualificationType() throws Exception {

        Client client = testEntityHelper.createTestClient();

        // now fully disqualify the user
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
            .post("/admin/anthem/quote/{disqualificationType}/disqualify/{reasonType}/{clientId}",
                "partial", "largeClaims", client.getClientId())
            .header("Authorization", "Bearer " + token))
            .andExpect(status().is5xxServerError())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

    }

    @Test
    public void testFullDisqualification_UnsupportedReasonType() throws Exception {

        Client client = testEntityHelper.createTestClient();

        // now fully disqualify the user
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
            .post("/admin/anthem/quote/{disqualificationType}/disqualify/{reasonType}/{clientId}",
                "full", "largeClaims1111", client.getClientId())
            .header("Authorization", "Bearer " + token))
            .andExpect(status().is5xxServerError())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

    }
}
