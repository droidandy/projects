package com.benrevo.admin.api.controller.uhc;

import static com.benrevo.common.Constants.MEDICAL;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.benrevo.admin.UHCAdminServiceApplication;
import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.OptimizerDto;
import com.benrevo.common.dto.OptimizerDto.OptimizerProduct;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.enums.RfpQuoteOptionAttributeName;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionAttribute;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.repository.ActivityRepository;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import net.bytebuddy.asm.Advice.Unused;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class UHCQuotesUploaderControllerTest extends AdminAbstractControllerTest {

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private AttributeRepository attributeRepository;
    
    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Test
    public void testLoadUhcDeclinedQuote() throws Exception {

        Client client = testEntityHelper.createTestClient();
        Carrier carrier = testEntityHelper.createTestCarrier(
            Constants.UHC_CARRIER,
            Constants.UHC_CARRIER
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

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(
            rfpMedicalSubmission,
            QuoteType.STANDARD
        );

        assertThat(rfpQuote.isLatest()).isTrue();

        flushAndClear();

        sendFilesAndAssertResult(
            null,
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.MEDICAL,
            QuoteType.DECLINED,
            false
        );

        RfpQuote previousRfpQuote = rfpQuoteRepository.findOne(rfpQuote.getRfpQuoteId());
        List<RfpQuote> currentRfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(
            client.getClientId(),
            Constants.MEDICAL
        );

        assertThat(previousRfpQuote.getRfpQuoteId()).isEqualTo(rfpQuote.getRfpQuoteId());
        assertThat(previousRfpQuote.isLatest()).isTrue();
        assertThat(previousRfpQuote.getQuoteType()).isEqualTo(QuoteType.DECLINED);
        // declined quote filtered by findByClientIdAndCategory query
        assertThat(currentRfpQuotes).hasSize(0);
    }

    @Test
    public void testLoadUhcStandardQuoteAfterDeclined() throws Exception {

        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);
        
        Carrier carrier = testEntityHelper.createTestCarrier(
            Constants.UHC_CARRIER,
            Constants.UHC_CARRIER
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

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(
            rfpMedicalSubmission,
            QuoteType.DECLINED
        );

        assertThat(rfpQuote.isLatest()).isTrue();

        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
                             "/data/quotes/UHC/Medical/2017SampleQuotes/Smith Emery Companies 3 " +
                             "Tier EASY So Cal.xlsm");
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.MEDICAL,
            QuoteType.STANDARD,
            false
        );

        RfpQuote previousRfpQuote = rfpQuoteRepository.findOne(rfpQuote.getRfpQuoteId());
        List<RfpQuote> currentRfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(
            client.getClientId(),
            Constants.MEDICAL
        );

        assertThat(previousRfpQuote.isLatest()).isFalse();
        assertThat(currentRfpQuotes).hasSize(1);
        assertThat(currentRfpQuotes.get(0).isLatest()).isTrue();
        assertThat(currentRfpQuotes.get(0).getQuoteType()).isEqualTo(QuoteType.STANDARD);
    }

    @Test
    public void testLoadUhcVisionQuote() throws Exception {

        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);
        
        Carrier carrier = testEntityHelper.createTestCarrier(
            Constants.UHC_CARRIER,
            Constants.UHC_CARRIER
        );
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(
            carrier,
            Constants.VISION
        );
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(
            client,
            rfpCarrier
        );
        testEntityHelper.buildTestRfpQuoteVersion(rfpSubmission);

        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
                             "/data/quotes/UHC/Vision/Brehm Communications Inc UHC VI Proposal BR  4-18    1-5-18.xlsm");
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.VISION,
            QuoteType.STANDARD,
            false
        );

        List<RfpQuote> currentRfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(
            client.getClientId(),
            Constants.VISION
        );

        assertThat(currentRfpQuotes).hasSize(1);
        assertThat(currentRfpQuotes.get(0).isLatest()).isTrue();
        assertThat(currentRfpQuotes.get(0).getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks()).hasSize(3);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getName())
            .containsExactlyInAnyOrder("Standard Network", "Flex Network", "Flex Network");
    }

    @Test
    public void testLoadRenewalUhcVisionQuote() throws Exception {

        // shell client
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
            "/data/renewal_quotes/Vision/Company ABC Vision Contributory Renewal Output  4-tier.xlsm");
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.VISION,
            QuoteType.STANDARD,
            true
        );

        List<RfpQuote> currentRfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(
            client.getClientId(),
            Constants.VISION
        );

        assertThat(currentRfpQuotes).hasSize(1);
        assertThat(currentRfpQuotes.get(0).isLatest()).isTrue();
        assertThat(currentRfpQuotes.get(0).getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks()).hasSize(1);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getName())
            .containsExactlyInAnyOrder("Standard Network");

        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(clientPlans).hasSize(1);
        ClientPlan cp = clientPlans.get(0);
        assertThat(cp.getTier1Census()).isEqualTo(80L);
        assertThat(cp.getTier2Census()).isEqualTo(36L);
        assertThat(cp.getTier3Census()).isEqualTo(24L);
        assertThat(cp.getTier4Census()).isEqualTo(32L);

        assertThat(cp.getTier1Rate()).isEqualTo(4.22F);
        assertThat(cp.getTier2Rate()).isEqualTo(7.99F);
        assertThat(cp.getTier3Rate()).isEqualTo(9.38F);
        assertThat(cp.getTier4Rate()).isEqualTo(13.19F);

        Plan plan = cp.getPnn().getPlan();
        assertThat(plan).isNotNull();
        List<Benefit> benefits = benefitRepository.findByPlanId(plan.getPlanId());
        for(Benefit b : benefits){
            if(b.getBenefitName().getName().equals("EXAMS_FREQUENCY")){
                assertThat(b.getValue()).isEqualTo("12");
                assertThat(b.getFormat()).isEqualTo("NUMBER");
            } else if(b.getBenefitName().getName().equals("LENSES_FREQUENCY")){
                assertThat(b.getValue()).isEqualTo("12");
                assertThat(b.getFormat()).isEqualTo("NUMBER");
            } else if(b.getBenefitName().getName().equals("FRAMES_FREQUENCY")){
                assertThat(b.getValue()).isEqualTo("24");
                assertThat(b.getFormat()).isEqualTo("NUMBER");
            } else if(b.getBenefitName().getName().equals("CONTACTS_FREQUENCY")){
                assertThat(b.getValue()).isEqualTo("12");
                assertThat(b.getFormat()).isEqualTo("NUMBER");
            } else if(b.getBenefitName().getName().equals("EXAM_COPAY")){
                assertThat(b.getValue()).isEqualTo("20");
                assertThat(b.getFormat()).isEqualTo("DOLLAR");
            } else if(b.getBenefitName().getName().equals("MATERIALS_COPAY")){
                assertThat(b.getValue()).isEqualTo("20");
                assertThat(b.getFormat()).isEqualTo("DOLLAR");
            } else if(b.getBenefitName().getName().equals("CONTACTS_ALLOWANCE")){
                assertThat(b.getValue()).isEqualTo("105");
                assertThat(b.getFormat()).isEqualTo("DOLLAR");
            } else if(b.getBenefitName().getName().equals("FRAME_ALLOWANCE")){
                assertThat(b.getValue()).isEqualTo("130");
                assertThat(b.getFormat()).isEqualTo("DOLLAR");
            }
        }
    }

    @Test
    public void testLoadRenewalUhcMedical_OptionUpdateQuote() throws Exception {

        // shell client
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
            "//data/renewal_quotes/Medical/Sample 4 tier PPO Renewal.xlsm");
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        // upload first time and assert renewal 1 and 2 creation
        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.MEDICAL,
            QuoteType.STANDARD,
            true
        );

        assertRenewalOptions(client, 1);
        flushAndClear();

        // upload second time and assert renewal 1 and 2 creation
        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.MEDICAL,
            QuoteType.STANDARD,
            true
        );

        // assert that there is only two renewal options not 4
        assertRenewalOptions(client, 1);
    }

    @Test
    @Ignore // broken - empty current client plan name
    public void testLoadRenewalUhcMedical_OptionUpdateQuote_Deleted_Option_Network() throws Exception {

        // shell client
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
            "//data/renewal_quotes/Medical/Sample 4 tier PPO Renewal With Dual Incumbent Plans.xlsm");
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        // upload first time and assert renewal 1 and 2 creation
        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.MEDICAL,
            QuoteType.STANDARD,
            true
        );

        assertRenewalOptions(client, 2);
        flushAndClear();

        file = new File(currDir +
            "//data/renewal_quotes/Medical/Sample 4 tier PPO Renewal.xlsm");
        fis = new FileInputStream(file);
        mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        // upload second time and assert renewal 1 and 2 creation
        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.MEDICAL,
            QuoteType.STANDARD,
            true
        );
        flushAndClear();

        // assert that there is only two renewal options not 4
        assertRenewalOptions(client, 1);
    }

    private void assertRenewalOptions(Client client, int size) {
        List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);

        assertThat(options.size()).isEqualTo(2);
        assertThat(options).extracting(opt -> opt.getRfpQuoteOptionName())
            .containsExactlyInAnyOrder("Renewal 1", "Renewal 2");
        for(RfpQuoteOption opt : options){
            assertThat(opt.getRfpQuoteOptionNetworks()).hasSize(size);
        }
    }

    @Test
    public void testLoadRenewalUhcMedical_HMO_DollarRx_Plans() throws Exception {

        // shell client
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
            "//data/renewal_quotes/Medical/American Integrated Services_HMO Exhibits_Removed_Missing_Plans_To_Test_Dollar_RxRates.xlsx");
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        // upload first time and assert renewal 1 and 2 creation
        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.MEDICAL,
            QuoteType.STANDARD,
            true
        );

        flushAndClear();

        List<RfpQuote> currentRfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(
            client.getClientId(),
            Constants.MEDICAL
        );

        Long numberOfRxPlansWithDollarRxAttribute = currentRfpQuotes.stream()
            .flatMap(quote -> quote.getRfpQuoteNetworks().stream())
            .flatMap(rqn -> rqn.getRfpQuoteNetworkPlans().stream())
            .filter(rqnp -> {
                QuotePlanAttribute attr = attributeRepository.
                    findQuotePlanAttributeByRqnpIdAndName(rqnp.getRfpQuoteNetworkPlanId(),
                        QuotePlanAttributeName.DOLLAR_RX_RATE);

                return attr != null;
            }).count();

        assertThat(numberOfRxPlansWithDollarRxAttribute).isEqualTo(5);
    }

    @Test
    public void testLoadRenewalUhcKybribaPpoQuote() throws Exception {

        final String NOT_EXISTED_RX_PPO_PLAN = "NotExistedRxPPO20180622";
        final String NOT_EXISTED_RX_HSA_PLAN = "NotExistedRxHSA20180622";

        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
            "/data/renewal_quotes/Medical/Kybriba Corporation  PPO-test.XLSM");
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.MEDICAL,
            QuoteType.STANDARD,
            true
        );

        List<RfpQuote> currentRfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(
            client.getClientId(),
            Constants.MEDICAL
        );

        assertThat(currentRfpQuotes).hasSize(1);
        assertThat(currentRfpQuotes.get(0).isLatest()).isTrue();
        assertThat(currentRfpQuotes.get(0).getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks()).hasSize(3);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getName())
            .containsExactlyInAnyOrder("Select Plus", "Choice Plus", "Select Plus HSA");
        
        // check client plan names
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(clientPlans).hasSize(3);
        assertThat(clientPlans).extracting("pnn").extracting("name").containsExactlyInAnyOrder("PQ1", "AJ3E", "479");


        // check that NotExisted plans were created and Existed ones were not created
        PlanNameByNetwork notExistedRxPpoPlan = null;
        PlanNameByNetwork notExistedRxHsaPlan = null;
        for (RfpQuote q : currentRfpQuotes) {
            for (RfpQuoteNetwork n : q.getRfpQuoteNetworks()) {
                for (RfpQuoteNetworkPlan p : n.getRfpQuoteNetworkPlans()) {
                    PlanNameByNetwork pnn = p.getPnn();
                    if (NOT_EXISTED_RX_PPO_PLAN.equals(pnn.getName())) notExistedRxPpoPlan = pnn;
                    if (NOT_EXISTED_RX_HSA_PLAN.equals(pnn.getName())) notExistedRxHsaPlan = pnn;
                }
            }
        }

        // check that plans were created
        assertThat(notExistedRxPpoPlan).isNotNull();
        assertThat(notExistedRxHsaPlan).isNotNull();
        
        // check benefits from parsed rxPpoPlan
        for (Benefit benefit : notExistedRxPpoPlan.getPlan().getBenefits()) {
            if ("MEMBER_COPAY_TIER_1".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("DOLLAR");
                assertThat(benefit.getValue()).isEqualTo("10");
            } else if ("MEMBER_COPAY_TIER_2".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("DOLLAR");
                assertThat(benefit.getValue()).isEqualTo("25");
            } else if ("MEMBER_COPAY_TIER_3".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("DOLLAR");
                assertThat(benefit.getValue()).isEqualTo("45");
            } else if ("MEMBER_COPAY_TIER_4".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("STRING");
                assertThat(benefit.getValue()).isEqualTo("N/A");
            } else if ("MAIL_ORDER".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("MULTIPLE");
                assertThat(benefit.getValue()).isEqualTo("2.5");
            } else if ("RX_INDIVIDUAL_DEDUCTIBLE".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("STRING");
                assertThat(benefit.getValue()).isEqualTo("N/A");
            } else if ("RX_FAMILY_DEDUCTIBLE".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("STRING");
                assertThat(benefit.getValue()).isEqualTo("N/A");
            }; 
        }

        // check benefits from parsed rxHsaPlan
        for (Benefit benefit : notExistedRxHsaPlan.getPlan().getBenefits()) {
            if ("MEMBER_COPAY_TIER_1".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("DOLLAR");
                assertThat(benefit.getValue()).isEqualTo("10");
            } else if ("MEMBER_COPAY_TIER_2".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("DOLLAR");
                assertThat(benefit.getValue()).isEqualTo("30");
            } else if ("MEMBER_COPAY_TIER_3".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("DOLLAR");
                assertThat(benefit.getValue()).isEqualTo("50");
            } else if ("MEMBER_COPAY_TIER_4".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("STRING");
                assertThat(benefit.getValue()).isEqualTo("N/A");
            } else if ("MAIL_ORDER".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("MULTIPLE");
                assertThat(benefit.getValue()).isEqualTo("2.5");
            } else if ("RX_INDIVIDUAL_DEDUCTIBLE".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("STRING");
                assertThat(benefit.getValue()).isEqualTo("N/A");
            } else if ("RX_FAMILY_DEDUCTIBLE".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("STRING");
                assertThat(benefit.getValue()).isEqualTo("N/A");
            }; 
        }

        
    }

    @Test
    public void testLoadRenewalUhcKybribaHmoQuote() throws Exception {
        
        final String EXISTED_PLAN = "testExisted20180607";
        final String NOT_EXISTED_PLAN = "testNotExisted20180607";
        final String EXISTED_RX_PLAN = "testRxExisted20180607";
        final String NOT_EXISTED_RX_PLAN = "testRxNotExisted20180607";

        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        // make sure that plans are existed
        PlanNameByNetwork pnn1 = testEntityHelper.createTestPlanNameByNetwork(EXISTED_PLAN, "UHC", "HMO", "Signature");
        pnn1.setName(EXISTED_PLAN); 
        testEntityHelper.createTestBenefit("PCP", pnn1.getPlan(), "test678", null);
        
        PlanNameByNetwork pnnRx1 = testEntityHelper.createTestPlanNameByNetwork(EXISTED_RX_PLAN, "UHC", "RX_HMO", "Full network");
        pnnRx1.setName(EXISTED_RX_PLAN); 
        testEntityHelper.createTestBenefit("MAIL_ORDER", pnnRx1.getPlan(), "test345", null);

        flushAndClear();

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
            "/data/renewal_quotes/Medical/Kyriba Corporation HMO-test.xlsx"); 
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.MEDICAL,
            QuoteType.STANDARD,
            true
        );

        flushAndClear();

        List<RfpQuote> currentRfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(
            client.getClientId(),
            Constants.MEDICAL
        );

        // check network names
        assertThat(currentRfpQuotes).hasSize(1);
        assertThat(currentRfpQuotes.get(0).isLatest()).isTrue();
        assertThat(currentRfpQuotes.get(0).getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks()).hasSize(2);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getName())
            .containsExactlyInAnyOrder("Signature", "Advantage");

        // check that RFP was created with commission
        RFP rfp = rfpRepository.findByClientClientIdAndProduct(client.getClientId(), Constants.MEDICAL);
        assertThat(rfp).isNotNull();
        assertThat(rfp.getCommission()).isEqualTo("5");
        assertThat(rfp.getContributionType()).isEqualTo("%");
        assertThat(rfp.getPaymentMethod()).isEqualTo("%");
        
        // check client plan names
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(client.getClientId());
        assertThat(clientPlans).hasSize(1);
        assertThat(clientPlans).extracting("pnn").extracting("name").containsExactlyInAnyOrder("U8M");

        // check that NotExisted plans were created and Existed ones were not created
        PlanNameByNetwork existedPlan = null;
        PlanNameByNetwork notExistedPlan = null;
        PlanNameByNetwork existedRxPlan = null;
        PlanNameByNetwork notExistedRxPlan = null;
        for (RfpQuote q : currentRfpQuotes) {
            for (RfpQuoteNetwork n : q.getRfpQuoteNetworks()) {
                for (RfpQuoteNetworkPlan p : n.getRfpQuoteNetworkPlans()) {
                    PlanNameByNetwork pnn = p.getPnn();
                    if (EXISTED_PLAN.equals(pnn.getName())) existedPlan = pnn;
                    if (NOT_EXISTED_PLAN.equals(pnn.getName())) notExistedPlan = pnn;
                    if (EXISTED_RX_PLAN.equals(pnn.getName())) existedRxPlan = pnn;
                    if (NOT_EXISTED_RX_PLAN.equals(pnn.getName())) notExistedRxPlan = pnn;
                }
            }
        }

        // check riders
        RfpQuoteNetwork network1 = currentRfpQuotes.get(0).getRfpQuoteNetworks().get(0);
        assertThat(network1.getRiders()).hasSize(1);
        for (Rider rider : network1.getRiders()) {
            assertThat(rider.getRiderMeta().getCode()).isEqualTo("CE8");
            assertThat(rider.getTier1Rate()).isEqualTo(6.10f);
            assertThat(rider.getTier2Rate()).isEqualTo(12.81f);
            assertThat(rider.getTier3Rate()).isEqualTo(11.59f);
            assertThat(rider.getTier4Rate()).isEqualTo(18.29f);
        }
        
        assertThat(existedPlan).isNotNull();
        assertThat(notExistedPlan).isNotNull();
        assertThat(existedRxPlan).isNotNull();
        assertThat(notExistedRxPlan).isNotNull();

        // check that plans were not created
        assertThat(existedPlan.getClientId()).isNull();
        assertThat(existedRxPlan.getClientId()).isNull();
        
        // check that plans were created 
        assertThat(notExistedPlan.getClientId()).isEqualTo(client.getClientId());
        assertThat(notExistedRxPlan.getClientId()).isEqualTo(client.getClientId());

        // use existed plans 
        assertThat(existedPlan.getPnnId()).isEqualTo(pnn1.getPnnId());
        assertThat(existedRxPlan.getPnnId()).isEqualTo(pnnRx1.getPnnId());

        // use benefits from parsed plan
        assertThat(notExistedPlan.getPlan().getBenefits()).isNotEmpty().extracting("value").doesNotContain("-");

        // use benefits from parsed rxPlan
        for (Benefit benefit : notExistedRxPlan.getPlan().getBenefits()) {
            if ("MEMBER_COPAY_TIER_1".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("DOLLAR");
                assertThat(benefit.getValue()).isEqualTo("10");
            } else if ("MEMBER_COPAY_TIER_2".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("DOLLAR");
                assertThat(benefit.getValue()).isEqualTo("25");
            } else if ("MEMBER_COPAY_TIER_3".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("DOLLAR");
                assertThat(benefit.getValue()).isEqualTo("50");
            } else if ("MEMBER_COPAY_TIER_4".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("STRING");
                assertThat(benefit.getValue()).isEqualTo("N/A");
            } else if ("MAIL_ORDER".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("MULTIPLE");
                assertThat(benefit.getValue()).isEqualTo("2");
            } else if ("RX_INDIVIDUAL_DEDUCTIBLE".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("STRING");
                assertThat(benefit.getValue()).isEqualTo("N/A");
            } else if ("RX_FAMILY_DEDUCTIBLE".equals(benefit.getBenefitName().getName())) {
                assertThat(benefit.getFormat()).isEqualTo("STRING");
                assertThat(benefit.getValue()).isEqualTo("N/A");
            }; 
        }
        
        RfpQuoteOption renewal1 = currentRfpQuotes.get(0).getRfpQuoteOptions()
                .stream()
                .filter(o -> o.getName().equals("Renewal 1"))
                .findFirst()
                .orElse(null);

        assertThat(renewal1).isNotNull();
        
        RfpQuoteOptionNetwork rqon = renewal1.getRfpQuoteOptionNetworks().get(0);
        assertThat(rqon.getSelectedRiders()).hasSize(1);
        assertThat(rqon.getSelectedRiders().iterator().next().getRiderMeta().getCode()).isEqualTo("CE8");

        ClientAttribute attribute = attributeRepository.findClientAttributeByClientIdAndName(
                client.getClientId(), AttributeName.RENEWAL);
        assertThat(attribute).isNotNull();

    }

    @Test
    public void testLoadRenewalUhcNautilusHmoQuote() throws Exception {
        
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
            "/data/renewal_quotes/Medical/Nautilus Internation Holding Exhbits.xlsm"); 
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.MEDICAL,
            QuoteType.STANDARD,
            true
        );

        flushAndClear();

        List<RfpQuote> currentRfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(
            client.getClientId(),
            Constants.MEDICAL
        );

        // check network names
        assertThat(currentRfpQuotes).hasSize(1);
        assertThat(currentRfpQuotes.get(0).isLatest()).isTrue();
        assertThat(currentRfpQuotes.get(0).getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks()).hasSize(6);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getName())
            .containsExactlyInAnyOrder(
                    "Signature",
                    "Advantage",
                    "Focus",
                    "Select Plus",
                    "Navigate",
                    "Choice Plus HSA");


        // check riders
        Set<String> riderCodes = new HashSet<>();
        for(RfpQuoteNetwork rqn : currentRfpQuotes.get(0).getRfpQuoteNetworks()){
            for(Rider r : rqn.getRiders()){
                riderCodes.add(r.getRiderMeta().getCode());
            }
        }
        assertThat(riderCodes).hasSize(5);
        assertThat(riderCodes).contains("Infertility (Per Life, $2,000 Med, $2,000 Rx)", "Bariatric & Obesity Surgery");
    }

    @Test
    public void testLoadRenewalUhcVQQuote() throws Exception {
        
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir +
                "/data/quotes/UHC/Medical/2018SampleQuotes/VQ OrthoCare UHC Medical v2.xlsx");

        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            client.getBroker().getBrokerId(),
            client.getClientId(),
            Constants.UHC_CARRIER,
            Constants.MEDICAL,
            QuoteType.STANDARD,
            true
        );

        flushAndClear();

        List<RfpQuote> currentRfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(
            client.getClientId(),
            Constants.MEDICAL
        );

        // check network names
        assertThat(currentRfpQuotes).hasSize(1);
        assertThat(currentRfpQuotes.get(0).isLatest()).isTrue();
        assertThat(currentRfpQuotes.get(0).getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(currentRfpQuotes.get(0).getRfpQuoteNetworks())
            .extracting(rqn -> rqn.getNetwork().getName())
            .containsExactlyInAnyOrder(
                    "Signature",
                    "Advantage",
                    "Alliance",
                    "Focus",
                    "Select Plus",
                    "Core",
                    "Select Plus HSA",
                    "Core HSA");


        // check riders
        Set<String> riderCodes = new HashSet<>();
        for(RfpQuoteNetwork rqn : currentRfpQuotes.get(0).getRfpQuoteNetworks()){
            for(Rider r : rqn.getRiders()){
                riderCodes.add(r.getRiderMeta().getCode());
            }
        }
        assertThat(riderCodes).hasSize(4);
        assertThat(riderCodes).contains("BDX", "Infertility (Per Life, $2,000 Med, $2,000 Rx)", "IBD", "CEO");
    }
    
    @Test
    public void uhcExternalRxAndKaiserOptimizer() throws Exception {

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/UHC/2018/Optimizers/UHC 4-Tier Optimizer.xlsm");
        FileInputStream fis = new FileInputStream(file);

        // create kaiser RX_HMO and RX_PPO to ensure test pass
        Carrier kaiserCarrier = testEntityHelper.createTestCarrier(CarrierType.KAISER.name(), CarrierType.KAISER.name());
        testEntityHelper.createTestNetwork(kaiserCarrier,  "RX_HMO", "Full Network");
        testEntityHelper.createTestNetwork(kaiserCarrier, "RX_PPO", "Full Network");

        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(),
            Constants.EXTENSION_XLS, fis);

        OptimizerDto override = new OptimizerDto();
        BrokerDto brokerDto = new BrokerDto();
        brokerDto.setId(broker.getBrokerId());
        brokerDto.setBcc("testBcc");
        override.setBrokerage(brokerDto);
        override.setNewClientName("newClientName");
        override.setOverrideClient(false);
        override.getProducts().add(new OptimizerProduct(MEDICAL, false));

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
            .file(mockFile)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .param("dto", jsonUtils.toJson(override))
            .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isOk())
            .andReturn();

        flushAndClear();

        OptimizerDto uploaded = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);

        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(uploaded.getClient().getId())
            .stream()
            .filter(cp -> cp.getRxPnn() != null)
            .collect(Collectors.toList());

        assertThat(clientPlans).hasSize(5); // all plans should have rx pnn
        assertThat(clientPlans.get(0).getPlanType()).isEqualTo("HMO");
        assertThat(clientPlans.get(0).getPnn().getPlanType()).isEqualTo("HMO");
        assertThat(clientPlans.get(0).getRxPnn().getPlanType()).isEqualTo("RX_HMO");

        // load UHC quote and assert success in find kaiser. Note: DB needs to have updated UHC, Kaiser etc plan designs ran

        String quoteFile = Paths.get("").toAbsolutePath().toString()
            + "/data/quotes/UHC/Medical/2018SampleQuotes/MM Enterprises USA, LLC_Proposal.xlsm";
        file = new File(quoteFile);
        fis = new FileInputStream(file);
        mockFile = new MockMultipartFile(
            "file",
            file.getName(),
            "multipart/form-data",
            fis
        );

        sendFilesAndAssertResult(
            Arrays.asList(mockFile),
            null,
            "/admin/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}",
            uploaded.getBrokerage().getId(),
            uploaded.getClient().getId(),
            Constants.UHC_CARRIER,
            Constants.MEDICAL,
            QuoteType.KAISER,
            false
        );

        List<RfpQuote> currentRfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(
            uploaded.getClient().getId(),
            Constants.MEDICAL
        );

        assertThat(currentRfpQuotes).hasSize(1);
        RfpQuote rfpQuote = currentRfpQuotes.get(0);
        RfpQuoteNetwork rfpQuoteNetwork = rfpQuoteNetworkRepository.findByRfpQuoteAndRfpQuoteOptionName(rfpQuote, "Kaiser HMO");
        assertThat(rfpQuoteNetwork).isNotNull();
        assertThat(rfpQuoteNetwork.getRfpQuoteNetworkPlans()).hasSize(2);

        for(RfpQuoteNetworkPlan rfpQuoteNetworkPlan : rfpQuoteNetwork.getRfpQuoteNetworkPlans()){
            if(rfpQuoteNetworkPlan.getPnn().getPlanType().equals("RX_HMO")){
                assertThat(rfpQuoteNetworkPlan.getTier1Rate()).isEqualTo(1F);
                assertThat(rfpQuoteNetworkPlan.getTier2Rate()).isEqualTo(1F);
                assertThat(rfpQuoteNetworkPlan.getTier3Rate()).isEqualTo(1F);
                assertThat(rfpQuoteNetworkPlan.getTier4Rate()).isEqualTo(1F);
            } else{
                assertThat(rfpQuoteNetworkPlan.getTier1Rate()).isEqualTo(473.38F);
                assertThat(rfpQuoteNetworkPlan.getTier2Rate()).isEqualTo(1041.44F);
                assertThat(rfpQuoteNetworkPlan.getTier3Rate()).isEqualTo(946.76F);
                assertThat(rfpQuoteNetworkPlan.getTier4Rate()).isEqualTo(1420.14F);
            }
        }
    }
}
