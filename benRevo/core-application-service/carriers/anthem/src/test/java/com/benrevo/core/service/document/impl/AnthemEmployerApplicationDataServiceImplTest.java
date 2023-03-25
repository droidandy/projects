package com.benrevo.core.service.document.impl;

import static com.benrevo.common.util.MapBuilder.entry;
import static com.benrevo.common.util.MathUtils.round;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;
import com.benrevo.be.modules.onboarding.service.email.report.Document;
import com.benrevo.be.modules.onboarding.service.email.report.PdfProcessor;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.UseTestProperties;
import com.benrevo.common.dto.QuoteOptionContributionsDto;
import com.benrevo.common.dto.QuoteOptionFinalSelectionDto;
import com.benrevo.common.util.DateHelper;
import com.benrevo.common.util.MapBuilder;
import com.benrevo.core.AnthemCoreServiceApplication;
import com.benrevo.core.service.AnthemEmployerApplicationDataServiceImpl;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.repository.AnswerRepository;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.boot.test.context.SpringBootTest;


@RunWith(MockitoJUnitRunner.class)
@SpringBootTest(classes = AnthemCoreServiceApplication.class)
@UseTestProperties
public class AnthemEmployerApplicationDataServiceImplTest {

    private static final String TEMPLATE_EMPLOYER_APPLICATION = "/templates/anthem_blue_cross/postsales/anthem-employer-application.pdf";
    
    private static final long MEDICAL_QUOTE_OPTION_ID = 1L;
    private static final long MEDICAL_RFP_QUOTE_OPTION_NETWORK_ID_1 = 2L;
    private static final long MEDICAL_RFP_QUOTE_OPTION_NETWORK_ID_2 = 3L;
    private static final long MEDICAL_RFP_QUOTE_OPTION_NETWORK_ID_3 = 4L;

    private static final long DENTAL_QUOTE_OPTION_ID = 20L;
    private static final long DENTAL_RFP_QUOTE_OPTION_NETWORK_ID_1 = 21L;
    private static final long DENTAL_RFP_QUOTE_OPTION_NETWORK_ID_2 = 22L;
    private static final long DENTAL_RFP_QUOTE_OPTION_NETWORK_ID_3 = 23L;
    private static final long DENTAL_RFP_QUOTE_OPTION_NETWORK_ID_4 = 24L;
    
    private static final long VISION_QUOTE_OPTION_ID = 40L;
    private static final long VISION_RFP_QUOTE_OPTION_NETWORK_ID_1 = 41L;
    
    private static final String BILLING_CONTACT_NAME = "TestGroup";
    private static final String BILLING_CONTACT_EMAIL = "TestGroup@domain.com";
    private static final String BILLING_CONTACT_PHONE = "1234567890";
    
    @InjectMocks
    private AnthemEmployerApplicationDataServiceImpl dataService;
    
    @Mock
    private AnswerRepository answerRepository;

    @Mock
    private SharedRfpQuoteService rfpQuoteService;

    @Mock
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;
    
    @Mock
    private RfpRepository rfpRepository;
    
    @Mock
    private AttributeRepository attributeRepository;

    private Client client;
    RFP medicalRfp;
    RFP dentalRfp;
    RFP visionRfp;
    Map<String, String> answers;
    Map<String, String> multiselectableAnswers;
    
    @Before
    public void setup() throws Exception {
        
        client = new Client();
        client.setClientId(0L);
        client.setClientName("Test clientName");
        client.setZip("123");
        client.setEmployeeCount(99L);
        client.setEligibleEmployees(45L);
        client.setEffectiveDate(new Date());
        client.setAddress("Test Address");
        client.setCity("Test city");
        client.setState("California");

        medicalRfp = createRfp("MEDICAL",4,"%","5");
        medicalRfp.setWaitingPeriod("11 days after hire");
        when(rfpRepository.findByClientClientIdAndProduct(anyLong(), eq(Constants.MEDICAL))).thenReturn(medicalRfp);
        dentalRfp = createRfp("DENTAL",3,"%","6");
        when(rfpRepository.findByClientClientIdAndProduct(anyLong(), eq(Constants.DENTAL))).thenReturn(dentalRfp);
        visionRfp = createRfp("VISION",2,"%","7");
        when(rfpRepository.findByClientClientIdAndProduct(anyLong(), eq(Constants.VISION))).thenReturn(visionRfp);
        
        answers = MapBuilder.build(
                entry("type_of_business", "Business Type"),
                entry("company_federal_tax_id", "13579"),
                entry("organization_type", "Corporation"),
                entry("enrolling_under_another_groups", "30"),
                entry("contact_counter", "1"),
                entry("contact_name_1", BILLING_CONTACT_NAME),
                entry("contact_phone_1", BILLING_CONTACT_PHONE),
                entry("contact_email_1", BILLING_CONTACT_EMAIL),
                entry("hours_per_week_for_full_time", "30"),
                entry("total_number_of_eligible_employees", "25"),
                entry("waiting_period_waived", "No"),
                entry("domestic_partnership_coverage", "Anthem Standard (STD)"),
                entry("medical_waiting_period_for", "ALL products sold (medical and specialty)"),
                entry("speciality_waiting_period_for", "Speciality products ONLY"),
                entry("speciality_waiting_period_begin_date", "1st of the month following 30 days from date of hire"),
                entry("defined_under_applicable_law", "No"));
        when(answerRepository.getAnswers(anyString(), anyLong())).thenReturn(answers);
        
        multiselectableAnswers = MapBuilder.build(
                entry("type_of_elligible_employees_full_time", "Active full-time"),
                entry("group_elects_to_opt_out_of_authorizing", "Yes"),
                entry("contact_role_1_2", "Billing Contact"));
        when(answerRepository.getMultiselectableAnswers(anyString(), anyLong())).thenReturn(multiselectableAnswers);
        
    }


    @After
    public void cleanUp() {
    }

    @Test
    public void buildEmployerApplicationFull() throws Exception {

        // prepare
        QuoteOptionFinalSelectionDto finalSelection = new QuoteOptionFinalSelectionDto();
        finalSelection.setMedicalQuoteOptionId(MEDICAL_QUOTE_OPTION_ID);
        finalSelection.setDentalQuoteOptionId(DENTAL_QUOTE_OPTION_ID);
        finalSelection.setVisionQuoteOptionId(VISION_QUOTE_OPTION_ID);
        when(rfpQuoteService.getSelectedQuoteOptions(anyLong())).thenReturn(finalSelection);
        
        List<QuoteOptionContributionsDto> medicalContributions = new ArrayList<>();
        medicalContributions.add(setupPlan(
                MEDICAL_RFP_QUOTE_OPTION_NETWORK_ID_1,
                "Test Medical PlanNameByNetwork 1", "HMO", false,
                1F, 2F, 3F, 4F,
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT,
                1.1F, 1.2F, 1.3F, 1.4F
                ));
        medicalContributions.add(setupPlan(
                MEDICAL_RFP_QUOTE_OPTION_NETWORK_ID_2,
                "Test Medical PlanNameByNetwork 2", "HMO", false,
                21F, 22F, 23F, 24F,
                Constants.ER_CONTRIBUTION_FORMAT_DOLLAR,
                2.1F, 2.2F, 2.3F, 1.2F
                ));
        medicalContributions.add(setupPlan(
                MEDICAL_RFP_QUOTE_OPTION_NETWORK_ID_3,
                "Test Medical PlanNameByNetwork 3", "HMO", false,
                3F, 4F, 5F, 6F,
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT,
                3.1F, 3.2F, 3.3F, 3.4F
                ));
        
        QuoteOptionContributionsDto kaiserPlan1 = setupPlan(
            -1L,
            "Test Kaiser PlanNameByNetwork 4", "HMO", false,
            3F, 4F, 5F, 6F,
            Constants.ER_CONTRIBUTION_FORMAT_PERCENT,
            3.1F, 3.2F, 3.3F, 3.4F);
        kaiserPlan1.setKaiserNetwork(true);
        medicalContributions.add(kaiserPlan1);
        
        QuoteOptionContributionsDto kaiserPlan2 = setupPlan(
            -2L,
            "Test Kaiser PlanNameByNetwork 5", "HMO", false,
            3F, 4F, 5F, 6F,
            Constants.ER_CONTRIBUTION_FORMAT_PERCENT,
            3.1F, 3.2F, 3.3F, 3.4F);
        kaiserPlan2.setCarrier("Kaiser");
        medicalContributions.add(kaiserPlan2);
        
        QuoteOptionContributionsDto notSelectedPlan = new QuoteOptionContributionsDto();
        notSelectedPlan.setPlanNameByNetwork("Test Not selected plan");
        notSelectedPlan.setRfpQuoteOptionNetworkId(-3L);
        
        RfpQuoteOptionNetwork optNetwork = new RfpQuoteOptionNetwork();
        optNetwork.setSelectedRfpQuoteNetworkPlan(null);
        optNetwork.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        optNetwork.setTier1ErContribution(5F);
        optNetwork.setTier2ErContribution(5F);
        optNetwork.setTier3ErContribution(5F);
        optNetwork.setTier4ErContribution(5F);
        
        when(rfpQuoteOptionNetworkRepository.findOne(-3L)).thenReturn(optNetwork);
        medicalContributions.add(notSelectedPlan);
        
        when(rfpQuoteService.getQuoteOptionNetworkContributions(MEDICAL_QUOTE_OPTION_ID))
                .thenReturn(medicalContributions);
        
        List<QuoteOptionContributionsDto> dentalContributions = new ArrayList<>();
        dentalContributions.add(setupPlan(
                DENTAL_RFP_QUOTE_OPTION_NETWORK_ID_1,
                "Test Dental PlanNameByNetwork 1", "DHMO", false,
                7F, 8F, 9F, 0F,
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT,
                7.1F, 7.2F, 7.3F, 0F
                ));
        dentalContributions.add(setupPlan(
                DENTAL_RFP_QUOTE_OPTION_NETWORK_ID_2,
                "Test Dental Voluntary PlanNameByNetwork 2", "DHMO", true,
                8F, 9F, 10F, 0F,
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT,
                8.1F, 8.2F, 8.3F, 0F
                ));
        dentalContributions.add(setupPlan(
                DENTAL_RFP_QUOTE_OPTION_NETWORK_ID_3,
                "Test Dental PlanNameByNetwork 3", "DPPO", false,
                7F, 8F, 9F, 0F,
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT,
                7.1F, 7.2F, 7.3F, 0F
                ));
        dentalContributions.add(setupPlan(
                DENTAL_RFP_QUOTE_OPTION_NETWORK_ID_4,
                "Test Dental Voluntary PlanNameByNetwork 4", "DPPO", true,
                8F, 9F, 10F, 0F,
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT,
                8.1F, 8.2F, 8.3F, 0F
                ));
        when(rfpQuoteService.getQuoteOptionNetworkContributions(DENTAL_QUOTE_OPTION_ID))
                .thenReturn(dentalContributions);

        List<QuoteOptionContributionsDto> visionContributions = new ArrayList<>();
        visionContributions.add(setupPlan(
                VISION_RFP_QUOTE_OPTION_NETWORK_ID_1,
                "Test Vision PlanNameByNetwork 1", "VISION", false,
                11F, 12F, 0F, 0F,
                Constants.ER_CONTRIBUTION_FORMAT_PERCENT,
                9.1F, 9.2F, 0F, 0F
                ));
        when(rfpQuoteService.getQuoteOptionNetworkContributions(VISION_QUOTE_OPTION_ID))
            .thenReturn(visionContributions);
        
        when(attributeRepository.findQuotePlanAttributeByRqnpId(anyLong())).thenReturn(Collections.emptyList());

        // process
        Map<String, String> data = dataService.getData(client);
        
        // test
        assertThat(data.get("total_employees")).isEqualTo(client.getEmployeeCount().toString());
        assertThat(data.get("groups_legal_name")).isEqualTo(client.getClientName());
        assertThat(data.get("medical_waiting_period_begin_date")).isEqualTo(medicalRfp.getWaitingPeriod());
        assertThat(data.get("speciality_waiting_period_for")).isNull();
        assertThat(data.get("speciality_waiting_period_begin_date")).isNull();
        assertThat(data.get("medical_commission")).isEqualTo(medicalRfp.getCommission().toString());
        assertThat(data.get("dental_commission")).isEqualTo(dentalRfp.getCommission().toString());
        assertThat(data.get("vision_commission")).isEqualTo(visionRfp.getCommission().toString());
        assertThat(data.get("effective_date")).isEqualTo(DateHelper.fromDateToString(client.getEffectiveDate(), Constants.ANTHEM_TEMPLATE_DATE_FORMAT));
        assertThat(data.get("total_anthem_eligible_employees")).isEqualTo(client.getEligibleEmployees().toString());

        assertPlans(data, "medical", medicalContributions, 4);
        assertPlans(data, "dental", dentalContributions, 3);
        assertPlans(data, "vision", visionContributions, 2);
        
        assertThat(data.get("Billing Contact_name")).isEqualTo(BILLING_CONTACT_NAME);
        assertThat(data.get("Billing Contact_email")).isEqualTo(BILLING_CONTACT_EMAIL);
        assertThat(data.get("Billing Contact_phone")).isEqualTo(BILLING_CONTACT_PHONE);
        assertThat(data.get("general_information_state")).isEqualTo("CA");
        
        // Uncomment for manual check
        //Document<PDDocument> result = new PdfProcessor().build(TEMPLATE_EMPLOYER_APPLICATION, data);
        //FileOutputStream fos = new FileOutputStream("test-anthem-employer-application.pdf");
        //result.getDocument().save(fos);
        //result.getDocument().close();
        //fos.close();
        
    }

    private RFP createRfp(String product, Integer ratingTiers, String paymentMethod, String commission) {
        RFP rfp = new RFP();
        rfp.setProduct(product);
        rfp.setRatingTiers(ratingTiers);
        rfp.setPaymentMethod(paymentMethod);
        rfp.setCommission(commission);
        return rfp;
    }
    
    private QuoteOptionContributionsDto setupPlan(long rfpQuoteOptionNetworkId, String planName, String planType, boolean voluntary,
            float tier1Rate, float tier2Rate, float tier3Rate, float tier4Rate, String erContributionFormat, 
            float tier1ErContribution, float tier2ErContribution, float tier3ErContribution, float tier4ErContribution) {
        
        QuoteOptionContributionsDto contribution = new QuoteOptionContributionsDto();
        contribution.setPlanNameByNetwork(planName);
        contribution.setRfpQuoteOptionNetworkId(rfpQuoteOptionNetworkId);
        
        Plan testPlan = new Plan(null, planName, planType);
        PlanNameByNetwork pnn = new PlanNameByNetwork(testPlan, null, planName, testPlan.getPlanType());

        
        RfpQuoteNetworkPlan rqnp = new RfpQuoteNetworkPlan();
        rqnp.setTier1Rate(tier1Rate);
        rqnp.setTier2Rate(tier2Rate);
        rqnp.setTier3Rate(tier3Rate);
        rqnp.setTier4Rate(tier4Rate);
        rqnp.setPnn(pnn);
        rqnp.setVoluntary(voluntary);
        
        RfpQuoteOptionNetwork optNetwork = new RfpQuoteOptionNetwork();
        optNetwork.setSelectedRfpQuoteNetworkPlan(rqnp);
        optNetwork.setErContributionFormat(erContributionFormat);
        optNetwork.setTier1ErContribution(tier1ErContribution);
        optNetwork.setTier2ErContribution(tier2ErContribution);
        optNetwork.setTier3ErContribution(tier3ErContribution);
        optNetwork.setTier4ErContribution(tier4ErContribution);
        
        when(rfpQuoteOptionNetworkRepository.findOne(rfpQuoteOptionNetworkId)).thenReturn(optNetwork);
        
        return contribution;
        
    }

    private void assertPlans(Map<String, String> data, String prefix, List<QuoteOptionContributionsDto> contributions, int tierRates) {

        for (int i=1; i<= contributions.size(); i++) {
            QuoteOptionContributionsDto contribution = contributions.get(i-1);
            
            if (contribution.getPlanNameByNetwork().contains("Kaiser")
                    || contribution.getPlanNameByNetwork().contains("Not selected plan")) {
              // Test Kaiser PlanNameByNetwork 4 and 5, and Not selected plan 6 should be ignored
              assertThat(data.get(prefix + "_coverage_plan_name_" + i)).isNull();
              assertThat(data.get(prefix + "_employee_non_ca_contribution_" + i)).isNull();
              assertThat(data.get(prefix + "_dependent_non_ca_contribution_" + i)).isNull();
              assertThat(data.get(prefix + "_employee_ca_contribution_" + i)).isNull();
              assertThat(data.get(prefix + "_dependent_ca_contribution_" + i)).isNull();
              continue;
            }

            RfpQuoteOptionNetwork optNetwork = rfpQuoteOptionNetworkRepository.findOne(contribution.getRfpQuoteOptionNetworkId());
            RfpQuoteNetworkPlan plan = optNetwork.getSelectedRfpQuoteNetworkPlan();

            if ("DHMO".equals(plan.getPnn().getPlanType()) && !plan.isVoluntary()) {
                assertThat(data.get(prefix + "_coverage_plan_name_" + i)).isEqualTo("Dental Net");
            } else if ("DHMO".equals(plan.getPnn().getPlanType()) && plan.isVoluntary()) {
                assertThat(data.get(prefix + "_coverage_plan_name_" + i)).isEqualTo("Voluntary Dental Net");
            } else if ("DPPO".equals(plan.getPnn().getPlanType()) && !plan.isVoluntary()) {
                assertThat(data.get(prefix + "_coverage_plan_name_" + i)).isEqualTo("Dental Complete");
            } else if ("DPPO".equals(plan.getPnn().getPlanType()) && plan.isVoluntary()) {
                assertThat(data.get(prefix + "_coverage_plan_name_" + i)).isEqualTo("Dental Complete Voluntary");
            } else {
                assertThat(data.get(prefix + "_coverage_plan_name_" + i)).isEqualTo(contribution.getPlanNameByNetwork());
            }
            
            assertThat(data.get(prefix + "_employee_non_ca_contribution_" + i)).isEmpty();
            assertThat(data.get(prefix + "_dependent_non_ca_contribution_" + i)).isEmpty();
            
            
            String expectedEeContribution = null;
            String expectedDepContribution = null;
            if (optNetwork.getErContributionFormat().equals(Constants.ER_CONTRIBUTION_FORMAT_PERCENT)){
                expectedEeContribution = optNetwork.getTier1ErContribution().toString();
                // take the dependent contribution from the largest tier that is available
                if (tierRates == 2) {
                    expectedDepContribution = optNetwork.getTier2ErContribution().toString();
                } else if (tierRates == 3) {
                    expectedDepContribution = optNetwork.getTier3ErContribution().toString();
                } else if (tierRates == 4) {
                    expectedDepContribution = optNetwork.getTier4ErContribution().toString();
                }
            } else {
                expectedEeContribution = Float.toString(round(optNetwork.getTier1ErContribution() / plan.getTier1Rate() * 100f, 0));
                // take the dependent contribution from the largest tier that is available
                if (tierRates == 2) {
                    expectedDepContribution = Float.toString(round(optNetwork.getTier2ErContribution() / plan.getTier2Rate() * 100f, 0));
                } else if (tierRates == 3) {
                    expectedDepContribution = Float.toString(round(optNetwork.getTier3ErContribution() / plan.getTier3Rate() * 100f, 0));
                } else if (tierRates == 4) {
                    expectedDepContribution = Float.toString(round(optNetwork.getTier4ErContribution() / plan.getTier4Rate() * 100f, 0));
                }
            }
            assertThat(data.get(prefix + "_employee_ca_contribution_" + i)).isEqualTo(expectedEeContribution);
            assertThat(data.get(prefix + "_dependent_ca_contribution_" + i)).isEqualTo(expectedDepContribution);
        }
        
        
    }
}
