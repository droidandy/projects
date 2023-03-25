package com.benrevo.be.modules.presentation.controller;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.access.BrokerageRole;
import com.benrevo.be.modules.shared.controller.BaseControllerTest;
import com.benrevo.be.modules.shared.service.S3FileManager;
import com.benrevo.be.modules.shared.util.PlanCalcHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.*;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Attribute;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Cost;
import com.benrevo.common.dto.QuoteOptionPlanComparisonDto.PlanByNetwork;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryOptionDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryPlanDto;
import com.benrevo.common.dto.ancillary.SelectRfpQuoteAnsillaryPlanDto;
import com.benrevo.common.enums.*;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.repository.*;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryPlanRepository;
import com.google.common.collect.Sets;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.*;
import java.util.stream.Collectors;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static com.benrevo.be.modules.shared.service.SharedRfpQuoteService.DENTAL_BUNDLE_DISCOUNT_PERCENT;
import static com.benrevo.be.modules.shared.service.SharedRfpQuoteService.MONTHS_IN_YEAR;
import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static com.benrevo.common.util.MathUtils.getDiscountFactor;
import static com.benrevo.common.util.StreamUtils.mapToList;
import static java.nio.file.Files.probeContentType;
import static org.apache.commons.lang3.ArrayUtils.toArray;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.data.Offset.offset;
import static org.junit.Assert.assertNull;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class RfpQuoteControllerTest extends BaseControllerTest {

    @Autowired
    private RfpQuoteController controller;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private RiderRepository riderRepository;

    @Autowired
    private RiderMetaRepository riderMetaRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private RfpQuoteNetworkCombinationRepository rfpQuoteNetworkCombinationRepository;

    @Autowired
    private S3FileManager s3FileManager;

    @Autowired
    private PlanNameByNetworkRepository pnnRepository;

    @Autowired
    private AttributeRepository attributeRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PlanRepository planRepository;

	@Autowired
	private ActivityRepository activityRepository;
	
	@Autowired
    private CarrierRepository carrierRepository;
	
	@Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;
	
	@Autowired
    private RfpQuoteAncillaryPlanRepository rfpQuoteAncillaryPlanRepository;
	
	@Autowired
    private PresentationOptionRepository presentationOptionRepository;

	@Override
	protected Object getController() {
		return controller;
	}
	
	@Before
	public void init() throws Auth0Exception {
		User user = new User("test");
		user.setEmail("test@domain.test");
		user.setUserMetadata( build( entry("first_name", "FirstName"), entry("last_name", "LastName") ) );

		when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);
	}

    @Test
    public void select_unselectRfpQuoteOption() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote medicalQuote1 = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuote medicalQuote2 = testEntityHelper
            .createTestRfpQuote(client, "UHC", Constants.MEDICAL);

        RfpQuoteOption medicalOption1 = testEntityHelper
            .createTestRfpQuoteOption(medicalQuote1, "medical option 1");
        RfpQuoteOption medicalOption2 = testEntityHelper
            .createTestRfpQuoteOption(medicalQuote2, "medical option 2");

        medicalOption1.setFinalSelection(false);
        rfpQuoteOptionRepository.save(medicalOption1);
        medicalOption2.setFinalSelection(false);
        rfpQuoteOptionRepository.save(medicalOption2);

        flushAndClear();

        assertThat(rfpQuoteOptionRepository.findOne(medicalOption1.getRfpQuoteOptionId())
            .isFinalSelection()).isFalse();
        assertThat(rfpQuoteOptionRepository.findOne(medicalOption2.getRfpQuoteOptionId())
            .isFinalSelection()).isFalse();

        // select Option 1
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
            .put("/v1/quotes/options/{id}/select", medicalOption1.getRfpQuoteOptionId())
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andReturn();

        flushAndClear();
        // check for Option 1 is selected and Option 2 is NOT selected
        assertThat(rfpQuoteOptionRepository.findOne(medicalOption1.getRfpQuoteOptionId())
            .isFinalSelection()).isTrue();
        assertThat(rfpQuoteOptionRepository.findOne(medicalOption2.getRfpQuoteOptionId())
            .isFinalSelection()).isFalse();

        // select Option 2
        result = mockMvc.perform(MockMvcRequestBuilders
            .put("/v1/quotes/options/{id}/select", medicalOption2.getRfpQuoteOptionId())
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andReturn();

        flushAndClear();
        // check for Option 2 is selected and Option 1 is NOT selected
        assertThat(rfpQuoteOptionRepository.findOne(medicalOption1.getRfpQuoteOptionId())
            .isFinalSelection()).isFalse();
        assertThat(rfpQuoteOptionRepository.findOne(medicalOption2.getRfpQuoteOptionId())
            .isFinalSelection()).isTrue();

        // unselect Option 2
        result = mockMvc.perform(MockMvcRequestBuilders
            .put("/v1/quotes/options/{id}/unselect", medicalOption2.getRfpQuoteOptionId())
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andReturn();

        RestMessageDto dto = gson
            .fromJson(result.getResponse().getContentAsString(), RestMessageDto.class);
        assertThat(dto.isSuccess()).isTrue();

        flushAndClear();
        // check for all options is NOT selected
        assertThat(rfpQuoteOptionRepository.findOne(medicalOption1.getRfpQuoteOptionId())
            .isFinalSelection()).isFalse();
        assertThat(rfpQuoteOptionRepository.findOne(medicalOption2.getRfpQuoteOptionId())
            .isFinalSelection()).isFalse();
    }

    @Test
    public void getRfpQuoteOptions_TrustQuote_NoBundleDiscount() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
 
        RfpQuote rfpQuoteMedical = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL, 
            QuoteType.STANDARD);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuoteMedical, "HMO");
        RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuoteMedical, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, null, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
             
        flushAndClear();
        
        String result =  performGet("/v1/quotes/options", new Object[] {"category", Constants.MEDICAL, "clientId", client.getClientId()});
        QuoteOptionListDto quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
        assertThat(quoteOptionListDto.getOptions()).hasSize(1);
        Float medicalTotalAnnualPremium = quoteOptionListDto.getOptions().get(0).getTotalAnnualPremium();
        assertThat(medicalTotalAnnualPremium).isGreaterThan(0f);
        
        // add and select Dental to get Bundle Discount
        RfpQuote rfpQuoteDental = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.DENTAL, 
            QuoteType.STANDARD);
        RfpQuoteNetwork rqnDental = testEntityHelper.createTestQuoteNetwork(rfpQuoteDental, "HMO");
        RfpQuoteNetworkPlan rqnpDental = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan Dental", rqnDental, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqoDental = testEntityHelper.createTestRfpQuoteOption(rfpQuoteDental, "optionName Dental");
        RfpQuoteOptionNetwork rqonDental = testEntityHelper.createTestRfpQuoteOptionNetwork(rqoDental, rqnDental, rqnpDental, null, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
  
        flushAndClear();
        
        result =  performGet("/v1/quotes/options", new Object[] {"category", Constants.MEDICAL, "clientId", client.getClientId()});
        quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
        assertThat(quoteOptionListDto.getOptions()).hasSize(1);
        Float dicountedMedicalTotalAnnualPremium = quoteOptionListDto.getOptions().get(0).getTotalAnnualPremium();
        // check for Bundle Discount = 1%
        assertThat(dicountedMedicalTotalAnnualPremium).isEqualTo(
                medicalTotalAnnualPremium * getDiscountFactor(DENTAL_BUNDLE_DISCOUNT_PERCENT));
        
        // change MEDICAL quoteType and check for bundle discount not applied
        rfpQuoteMedical.setQuoteType(QuoteType.BEYOND_BENEFIT_TRUST_PROGRAM);
        rfpQuoteRepository.save(rfpQuoteMedical);
        
        flushAndClear();
        
        result =  performGet("/v1/quotes/options", new Object[] {"category", Constants.MEDICAL, "clientId", client.getClientId()});
        quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
        assertThat(quoteOptionListDto.getOptions()).hasSize(1);
        Float trustMedicalQuoteMedicalTotalAnnualPremium = quoteOptionListDto.getOptions().get(0).getTotalAnnualPremium();
        assertThat(trustMedicalQuoteMedicalTotalAnnualPremium).isEqualTo(medicalTotalAnnualPremium); 
     
        // change DENTAL quoteType and check for bundle discount not applied
        rfpQuoteMedical.setQuoteType(QuoteType.STANDARD);
        rfpQuoteRepository.save(rfpQuoteMedical);
        rfpQuoteDental.setQuoteType(QuoteType.BEYOND_BENEFIT_TRUST_PROGRAM);
        rfpQuoteRepository.save(rfpQuoteDental);
        
        flushAndClear();
        
        result =  performGet("/v1/quotes/options", new Object[] {"category", Constants.MEDICAL, "clientId", client.getClientId()});
        quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
        assertThat(quoteOptionListDto.getOptions()).hasSize(1);
        Float trustDentalQuoteMedicalTotalAnnualPremium = quoteOptionListDto.getOptions().get(0).getTotalAnnualPremium();
        assertThat(trustDentalQuoteMedicalTotalAnnualPremium).isEqualTo(medicalTotalAnnualPremium); 
    }
    
    @Test
    public void getSelectedRfpQuoteOptions_MedicalNotAppCarrier_DentalAndVisionSelectedNoDiscountNoSavingMsg()
        throws Exception {
        Client client = testEntityHelper.createTestClient();

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

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options/selected")
            .param("clientId", client.getClientId().toString())
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        QuoteOptionFinalSelectionDto finalSelectionDto = gson
            .fromJson(result.getResponse().getContentAsString(),
                QuoteOptionFinalSelectionDto.class);
        assertThat(finalSelectionDto.getMedicalPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getDentalPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getVisionPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getTotal()).isEqualTo(finalSelectionDto.getMedicalTotal()
            + finalSelectionDto.getDentalTotal() + finalSelectionDto.getVisionTotal());
        assertNull(finalSelectionDto.getDentalBundleDiscountPercent());
        assertNull(finalSelectionDto.getDentalBundleDiscount());
        assertNull(finalSelectionDto.getVisionBundleDiscountPercent());
        assertNull(finalSelectionDto.getVisionBundleDiscount());
        assertNull(finalSelectionDto.getSummaryBundleDiscount());
    }

    @Test
    public void getSelectedRfpQuoteOptions_MedicalNotAppCarrier_NoDiscountNoSavingMsg()
        throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

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

        RfpQuote visionQuote = testEntityHelper
            .createTestRfpQuote(client, CarrierType.BLUE_SHIELD.name(), Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper
            .createTestQuoteNetwork(visionQuote, "VISION");

        flushAndClear();

        String result = performGet("/v1/quotes/options/selected",
            new Object[]{"clientId", client.getClientId()});

        // 1. Medical with carrier Ameritas, no dental or vision options selected-> No dental or vision savings message

        QuoteOptionFinalSelectionDto finalSelectionDto = gson
            .fromJson(result, QuoteOptionFinalSelectionDto.class);

        assertThat(finalSelectionDto.getMedicalPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getDentalPlans()).isEmpty();
        assertThat(finalSelectionDto.getVisionPlans()).isEmpty();

        assertThat(finalSelectionDto.getTotal()).isEqualTo(finalSelectionDto.getMedicalTotal());
        assertNull(finalSelectionDto.getDentalBundleDiscountPercent());
        assertNull(finalSelectionDto.getDentalBundleDiscount());
        assertNull(finalSelectionDto.getVisionBundleDiscountPercent());
        assertNull(finalSelectionDto.getVisionBundleDiscount());
        assertNull(finalSelectionDto.getSummaryBundleDiscount());
    }


    @Test
    public void getSelectedRfpQuoteOptionsNotEligibleForDiscount_ByVoluntary() throws Exception {
        Client client = testEntityHelper.createTestClient();

        RfpQuote medicalQuote = testEntityHelper
            .createTestRfpQuote(client, "UHC", Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper
            .createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper
            .createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan,
                null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper
            .createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        dentalNetworkPlan.setVoluntary(true);
        dentalNetworkPlan = rfpQuoteNetworkPlanRepository.save(dentalNetworkPlan);
        RfpQuoteOption dentalOption = testEntityHelper
            .createTestRfpQuoteOption(dentalQuote, "dental option");
        RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null,
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper
            .createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
        visionNetworkPlan.setVoluntary(true);
        visionNetworkPlan = rfpQuoteNetworkPlanRepository.save(visionNetworkPlan);
        RfpQuoteOption visionOption = testEntityHelper
            .createTestRfpQuoteOption(visionQuote, "vision option");
        RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null,
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options/selected")
            .param("clientId", client.getClientId().toString())
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        QuoteOptionFinalSelectionDto finalSelectionDto = gson
            .fromJson(result.getResponse().getContentAsString(),
                QuoteOptionFinalSelectionDto.class);
        assertThat(finalSelectionDto.getMedicalPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getDentalPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getVisionPlans()).isNotEmpty();
        assertThat(finalSelectionDto.getMedicalTotal())
            .isLessThan(finalSelectionDto.getDentalTotal());
        assertThat(finalSelectionDto.getDentalTotal())
            .isLessThan(finalSelectionDto.getVisionTotal());
        assertThat(finalSelectionDto.getTotal()).isEqualTo(finalSelectionDto.getMedicalTotal()
            + finalSelectionDto.getDentalTotal() + finalSelectionDto.getVisionTotal());
        assertThat(finalSelectionDto.getDentalBundleDiscount()).isNull();
        assertThat(finalSelectionDto.getVisionBundleDiscount()).isNull();
        assertThat(finalSelectionDto.getSummaryBundleDiscount()).isNull();
    }

    @Test
    public void getSelectedRfpQuoteOptionsNotEligibleForDiscount_ByRenewal() throws Exception {
        Client client = testEntityHelper.createTestClient();

        RfpQuote medicalQuote = testEntityHelper
            .createTestRfpQuote(client, "UHC", Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper
            .createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper
            .createTestRfpQuoteOption(medicalQuote, "Renewal");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan,
                null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper
            .createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        RfpQuoteOption dentalOption = testEntityHelper
            .createTestRfpQuoteOption(dentalQuote, "Renewal");
        RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null,
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, "UHC", Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper
            .createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
        RfpQuoteOption visionOption = testEntityHelper
            .createTestRfpQuoteOption(visionQuote, "Renewal");
        RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null,
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options/selected")
            .param("clientId", client.getClientId().toString())
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        QuoteOptionFinalSelectionDto finalSelectionDto = gson
            .fromJson(result.getResponse().getContentAsString(),
                QuoteOptionFinalSelectionDto.class);

        assertThat(finalSelectionDto.getDentalBundleDiscount()).isNull();
        assertThat(finalSelectionDto.getVisionBundleDiscount()).isNull();
        assertThat(finalSelectionDto.getSummaryBundleDiscount()).isNull();
    }

    @Test
    public void getSelectedRfpQuoteOptionsEligibleForDiscount_ByMedicalNewBusiness() throws Exception {
        Client client = testEntityHelper.createTestClient();

        RfpQuote medicalQuote = testEntityHelper
            .createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper
            .createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper
            .createTestRfpQuoteOption(medicalQuote, "Option");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan,
                null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper
            .createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        RfpQuoteOption dentalOption = testEntityHelper
            .createTestRfpQuoteOption(dentalQuote, "Renewal");
        RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null,
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper
            .createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
        RfpQuoteOption visionOption = testEntityHelper
            .createTestRfpQuoteOption(visionQuote, "Renewal");
        RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null,
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options/selected")
            .param("clientId", client.getClientId().toString())
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        QuoteOptionFinalSelectionDto finalSelectionDto = gson
            .fromJson(result.getResponse().getContentAsString(),
                QuoteOptionFinalSelectionDto.class);

        assertThat(finalSelectionDto.getDentalBundleDiscount()).isNotNull();
        assertThat(finalSelectionDto.getVisionBundleDiscount()).isNotNull();
        assertThat(finalSelectionDto.getSummaryBundleDiscount()).isNotNull();
    }

    @Test
    public void getSelectedRfpQuoteOptionsEligibleForDiscount_ByDentalNewBusiness() throws Exception {
        Client client = testEntityHelper.createTestClient();

        RfpQuote medicalQuote = testEntityHelper
            .createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper
            .createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan medicalNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption medicalOption = testEntityHelper
            .createTestRfpQuoteOption(medicalQuote, "Renewal");
        RfpQuoteOptionNetwork medicalOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(medicalOption, medicalNetwork, medicalNetworkPlan,
                null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper
            .createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        RfpQuoteOption dentalOption = testEntityHelper
            .createTestRfpQuoteOption(dentalQuote, "Option");
        RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null,
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper
            .createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
        RfpQuoteOption visionOption = testEntityHelper
            .createTestRfpQuoteOption(visionQuote, "Renewal");
        RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper
            .createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null,
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/quotes/options/selected")
            .param("clientId", client.getClientId().toString())
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        QuoteOptionFinalSelectionDto finalSelectionDto = gson
            .fromJson(result.getResponse().getContentAsString(),
                QuoteOptionFinalSelectionDto.class);

        assertThat(finalSelectionDto.getDentalBundleDiscount()).isNotNull();
        assertThat(finalSelectionDto.getVisionBundleDiscount()).isNull();
        assertThat(finalSelectionDto.getSummaryBundleDiscount()).isNotNull();
    }

    @Test
    public void getRfpQuoteOptions_MultipleCarriers() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        ClientPlan clientPlanCarrier1 = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        ClientPlan clientPlanCarrier2 = testEntityHelper
            .createTestClientPlan("ppo client plan", client, Constants.UHC_CARRIER, "PPO");

        flushAndClear();

        String result = performGet("/v1/quotes/options",
            new Object[]{"category", Constants.MEDICAL, "clientId", client.getClientId()});
        QuoteOptionListDto quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
        assertThat(quoteOptionListDto.getCurrentOption().getName()).isEqualTo("Current");
        assertThat(quoteOptionListDto.getCurrentOption().getCarrier())
            .isEqualTo(Constants.MULTIPLE_CARRIER_DISPLAY_NAME);
        assertThat(quoteOptionListDto.getCurrentOption().getPlanTypes()).contains("HMO", "PPO");
        assertThat(quoteOptionListDto.getOptions()).hasSize(0);
    }

    @Test
    public void testClientDetails_FilterOptionsByRole() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote appCarrierQuote = testEntityHelper
            .createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL);
        RfpQuoteOption appCarrierOption = testEntityHelper
            .createTestRfpQuoteOption(appCarrierQuote, "Option 1");

        RfpQuote anyOtherCarrierQuote = testEntityHelper
            .createTestRfpQuote(client, CarrierType.CIGNA.name(), Constants.MEDICAL);
        RfpQuoteOption anyOtherCarrierOption = testEntityHelper
            .createTestRfpQuoteOption(anyOtherCarrierQuote, "Option 1");

        RfpQuoteOption anyOtherCarrierRenewalOption = testEntityHelper
            .createTestRfpQuoteOption(anyOtherCarrierQuote, "Renewal");

        flushAndClear();

        String result = performGet("/v1/quotes/options",
            new Object[]{"category", Constants.MEDICAL, "clientId", client.getClientId()});

        ClientDetailsDto details = gson.fromJson(result, ClientDetailsDto.class);
        // returned two Option 1 and Renewal for default role
        assertThat(details.getOptions()).hasSize(3);

        token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, TEST_AUTHID,
            toArray(AccountRole.CARRIER_SALES.getValue()), appCarrier);

        result = performGet(null, "/v1/quotes/options",
            new Object[]{"category", Constants.MEDICAL, "clientId", client.getClientId()});
        details = gson.fromJson(result, ClientDetailsDto.class);
        // returned only one Option 1 and Renewal for carrier_sales role
        assertThat(details.getOptions()).hasSize(2);
        assertThat(details.getOptions()).extracting(QuoteOptionBriefDto::getName)
            .containsExactlyInAnyOrder("Option 1", "Renewal");
    }


    private int numOfQuoteViewedActivities(Client client){
		List<Activity> activityList = activityRepository.findByClientId(client.getClientId());
		int numOfQuoteViewedActivities = 0;
		for(Activity activity : activityList){
			if(activity.getType() == ActivityType.QUOTE_VIEWED){
                numOfQuoteViewedActivities++;
			}
		}
		return numOfQuoteViewedActivities;
	}

    @Test
	public void testQuoteViewedCreatesDashboardActivity() throws Exception {
		Client client = testEntityHelper.createTestClient();

		//number of quote viewed activities should be 0
		assertThat(numOfQuoteViewedActivities(client) == 0);

		testQuoteOptionHelper(client);

		//number of quote viewed activities should be 1
		assertThat(numOfQuoteViewedActivities(client) == 1);

        ClientPlan clientPlan = testEntityHelper.createTestClientPlan("ppo client plan", client, Constants.KAISER_CARRIER, "PPO");

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
		RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
		RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
		RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
		RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, clientPlan, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

		flushAndClear();

		String result =  performGet("/v1/quotes/options", new Object[] {"category", Constants.MEDICAL, "clientId", client.getClientId()});
		QuoteOptionListDto quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);

		//number of quote viewed activities should be 2
		assertThat(numOfQuoteViewedActivities(client) == 2);
	}

    @Test
    public void getAncillaryRfpQuoteOptions() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        Carrier carrier1 = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.displayName);
        
        AncillaryPlan ancillaryPlan1 = testEntityHelper.createTestAncillaryPlan("Basic Life",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier1);
        
        AncillaryPlan ancillaryPlan2 = testEntityHelper.createTestAncillaryPlan("Voluntary Life",
            PlanCategory.VOL_LIFE, AncillaryPlanType.VOLUNTARY, carrier1);
        
        ClientPlan clientPlan1 = testEntityHelper.createTestAncillaryClientPlan(client, ancillaryPlan1, 
            PlanCategory.LIFE);
        ClientPlan clientPlan2 = testEntityHelper.createTestAncillaryClientPlan(client, ancillaryPlan2, 
            PlanCategory.VOL_LIFE);

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), 
            Constants.LIFE);
        
        Carrier carrier2 = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();
        
        AncillaryPlan ancillaryPlan3 = testEntityHelper.createTestAncillaryPlan("Basic Life 2",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier2);
        
        RfpQuoteAncillaryPlan plan = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan2);
        
        RfpQuoteAncillaryOption option = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", plan);
        
        flushAndClear();
        
        // check for Current and Option 1
        
        String result = performGet("/v1/quotes/ancillaryOptions", new Object[] {
            "category", Constants.LIFE, "clientId", client.getClientId()});
        QuoteOptionListDto quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
        assertThat(quoteOptionListDto.getCategory()).isEqualTo(PlanCategory.LIFE.name());
        assertThat(quoteOptionListDto.getCurrentOption()).isNotNull();
        assertThat(quoteOptionListDto.getCurrentOption().getName()).isEqualTo("Current");
        assertThat(quoteOptionListDto.getCurrentOption().getCarrier()).isEqualTo(carrier1.getDisplayName());
        assertThat(quoteOptionListDto.getCurrentOption().getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(quoteOptionListDto.getCurrentOption().getPlanTypes()).contains("LIFE");
        assertThat(quoteOptionListDto.getOptions()).hasSize(1);
        
        // missing option for VOLUNTARY, only Current
        
        result = performGet("/v1/quotes/ancillaryOptions", new Object[] {
            "category", PlanCategory.VOL_LIFE, "clientId", client.getClientId()});
        quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
        assertThat(quoteOptionListDto.getCategory()).isEqualTo(PlanCategory.VOL_LIFE.name());
        assertThat(quoteOptionListDto.getCurrentOption()).isNotNull();
        assertThat(quoteOptionListDto.getCurrentOption().getName()).isEqualTo("Current");
        assertThat(quoteOptionListDto.getCurrentOption().getCarrier()).isEqualTo(carrier1.getDisplayName());
        assertThat(quoteOptionListDto.getCurrentOption().getQuoteType()).isEqualTo(QuoteType.STANDARD);
        assertThat(quoteOptionListDto.getCurrentOption().getPlanTypes()).contains("VOL_LIFE");
        assertThat(quoteOptionListDto.getOptions()).isEmpty();
    }
    
	@Test
	public void getRfpQuoteOptions() throws Exception {
		Client client = testEntityHelper.createTestClient();
		testQuoteOptionHelper(client);
	}

	private void testQuoteOptionHelper(Client client) throws Exception {
		testEntityHelper.createTestRFPs(client);

		ClientPlan clientPlan1 = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
		ClientPlan clientPlan2 = testEntityHelper.createTestClientPlan("ppo client plan", client, Constants.KAISER_CARRIER, "PPO");

		RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
		RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
		RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
		RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
		RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, clientPlan1, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

		flushAndClear();

		token = createToken(client.getBroker().getBrokerToken());
		String result =  performGet("/v1/quotes/options", new Object[] {"category", Constants.MEDICAL, "clientId", client.getClientId()});
		QuoteOptionListDto quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
		assertThat(quoteOptionListDto.getCategory()).isEqualTo(Constants.MEDICAL);
		assertThat(quoteOptionListDto.getCurrentOption()).isNotNull();
		assertThat(quoteOptionListDto.getCurrentOption().getName()).isEqualTo("Current");
		assertThat(quoteOptionListDto.getCurrentOption().getCarrier()).isEqualTo(clientPlan1.getPnn().getPlan().getCarrier().getDisplayName());
		assertThat(quoteOptionListDto.getCurrentOption().getQuoteType()).isEqualTo(QuoteType.KAISER);
		assertThat(quoteOptionListDto.getCurrentOption().getPlanTypes()).contains("HMO", "PPO");
		assertThat(quoteOptionListDto.getOptions()).hasSize(1);

		// case when current option is missing
		result =  performGet("/v1/quotes/options", new Object[] {"category", Constants.DENTAL, "clientId", client.getClientId()});
		quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
		assertThat(quoteOptionListDto.getCategory()).isEqualTo(Constants.DENTAL);
		assertThat(quoteOptionListDto.getCurrentOption()).isNotNull();
		assertThat(quoteOptionListDto.getCurrentOption().getName()).isEqualTo("Current");
		assertThat(quoteOptionListDto.getCurrentOption().getCarrier()).isEqualTo(StringUtils.EMPTY);
		assertThat(quoteOptionListDto.getCurrentOption().getQuoteType()).isEqualTo(QuoteType.STANDARD);
		assertThat(quoteOptionListDto.getCurrentOption().getPlanTypes()).isEmpty();;
		assertThat(quoteOptionListDto.getOptions()).hasSize(0);
	}

	@Test
	public void getRfpQuoteOptions_DeclinedQuote() throws Exception {
	    
		Client client = testEntityHelper.createTestClient();
        
		RfpQuote declinedQuote = testEntityHelper.createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL, QuoteType.DECLINED);

		testEntityHelper.createTestRFPs(client);

		ClientPlan clientPlan1 = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
		ClientPlan clientPlan2 = testEntityHelper.createTestClientPlan("ppo client plan", client, Constants.KAISER_CARRIER, "PPO");

		RfpQuote clearValueQuote = testEntityHelper.createTestRfpQuote(client, "ANTHEM_CLEAR_VALUE", Constants.MEDICAL, QuoteType.CLEAR_VALUE);
		RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(clearValueQuote, "HMO");
		RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
		RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(clearValueQuote, "optionName");
		RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, clientPlan1, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
                
		flushAndClear();

		token = createToken(client.getBroker().getBrokerToken());
		
		String result =  performGet("/v1/quotes/options", new Object[] {"category", Constants.MEDICAL, "clientId", client.getClientId()});
		
		QuoteOptionListDto quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
		assertThat(quoteOptionListDto.getCategory()).isEqualTo(Constants.MEDICAL);
		assertThat(quoteOptionListDto.getCurrentOption()).isNotNull();
		assertThat(quoteOptionListDto.getCurrentOption().getName()).isEqualTo("Current");
		assertThat(quoteOptionListDto.getCurrentOption().getCarrier()).isEqualTo(clientPlan1.getPnn().getPlan().getCarrier().getDisplayName());
		assertThat(quoteOptionListDto.getCurrentOption().getQuoteType()).isEqualTo(QuoteType.KAISER);
		assertThat(quoteOptionListDto.getCurrentOption().getPlanTypes()).isNotNull();
		assertThat(quoteOptionListDto.getOptions()).hasSize(1);
		assertThat(quoteOptionListDto.getOptions().get(0).getQuoteType()).isEqualTo(QuoteType.CLEAR_VALUE);

	}

	@Test
	public void getRfpQuoteOptionById_FinalSelectedEmptyOption() throws Exception {
		Client client = testEntityHelper.createTestClient();
		token = createToken(client.getBroker().getBrokerToken());
		Carrier carrier = testEntityHelper.createTestCarrier("OTHER", "Other");
		RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
		
		CreateRfpQuoteOptionDto params = new CreateRfpQuoteOptionDto();
		params.setClientId(client.getClientId());
		params.setRfpCarrierId(rfpCarrier.getRfpCarrierId());
		params.setQuoteType(QuoteType.STANDARD);

		String result = performPost("/v1/quotes/options/create", params);
		QuoteOptionDetailsDto quoteOptionDto = gson.fromJson(result, QuoteOptionDetailsDto.class);
		
		// select created option
		result = performPut("/v1/quotes/options/{id}/select", EMPTY, quoteOptionDto.getId());
						
		flushAndClear();

		quoteOptionDto = gson.fromJson(performGet("/v1/quotes/options/{id}", EMPTY, quoteOptionDto.getId()), QuoteOptionDetailsDto.class);
	}

	@Test
    public void testGetKaiserOption() throws Exception {
        //1 create client
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        //2 create create client plan and rfp
        ClientPlan clientPlan = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");

        // 3 create rfp carrier and rfp submission which are the same for both quotes
        RfpCarrier rfpCarrier = testEntityHelper
            .createTestRfpCarrier(clientPlan.getPnn().getNetwork().getCarrier(), Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        //3 create rfp quotes
        RfpQuote replaceKaiser = testEntityHelper
            .createTestRfpQuote(client, rfpSubmission, Constants.UHC_CARRIER, Constants.MEDICAL,
                QuoteType.STANDARD);
        RfpQuote withKaiser = testEntityHelper
            .createTestRfpQuote(client, rfpSubmission, Constants.UHC_CARRIER, Constants.MEDICAL,
                QuoteType.KAISER);

        //4 rfp quote networks
        RfpQuoteNetwork replaceKaiserNetwork = testEntityHelper
            .createTestQuoteNetwork(replaceKaiser, "HMO");
        RfpQuoteNetwork withKaiserNetwork = testEntityHelper
            .createTestQuoteNetwork(withKaiser, "HMO");

        //5 rfp quote network plans
        RfpQuoteNetworkPlan replaceKaiserRqnp = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan", replaceKaiserNetwork, 100f, 120f,
                140f, 160f);
        RfpQuoteNetworkPlan withKaiserRqnp = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan", withKaiserNetwork, 100f, 120f, 140f,
                160f);

        //6 rfp quote options
        RfpQuoteOption replaceKaiserRqo = testEntityHelper
            .createTestRfpQuoteOption(replaceKaiser, "Option 1");
        RfpQuoteOption withKaiserRqo = testEntityHelper
            .createTestRfpQuoteOption(withKaiser, "Option 1");

        //7 rfp quote option networks
        RfpQuoteOptionNetwork replaceKaiserRqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(replaceKaiserRqo, replaceKaiserNetwork,
                replaceKaiserRqnp, clientPlan, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork withKaiserRqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(withKaiserRqo, withKaiserNetwork,
                withKaiserRqnp, clientPlan, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        mockMvc.perform(MockMvcRequestBuilders
            .get("/v1/quotes/options/{id}", withKaiserRqo.getRfpQuoteOptionId())
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.quoteType").value(QuoteType.KAISER.name()))
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8));

    }

    @Test
    public void getRfpQuoteOptionById_AlongsideKaiser() throws Exception {
        Client client = testEntityHelper.createTestClient();

        ClientPlan kaiserClientPlan = testEntityHelper.createTestClientPlan("hmo kaiser plan", client, CarrierType.KAISER.name(), "HMO");
        ClientPlan aetnaClientPlan = testEntityHelper.createTestClientPlan("hmo aetna plan", client, CarrierType.AETNA.name(), "HMO");

        Carrier carrier = carrierRepository.findByName(appCarrier[0]);
        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, carrier.getName(), Constants.MEDICAL);
        RfpQuote kaiserQuote = testEntityHelper.createTestRfpQuote(client, carrier.getName(), Constants.MEDICAL, QuoteType.KAISER);

        RfpQuoteNetwork medicalQNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        Network kaiserNetwork = testEntityHelper.createTestNetwork("Kaiser HMO Network", "HMO", carrierRepository.findByName(CarrierType.KAISER.name()));
        RfpQuoteNetwork kaiserQNetwork = testEntityHelper.createTestQuoteNetwork(kaiserQuote, kaiserNetwork);

        RfpQuoteNetworkPlan medicalNetworkPlan1 = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan 1", medicalQNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteNetworkPlan medicalNetworkPlan2 = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan 2", medicalQNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteNetworkPlan kaiserNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test kaiser plan", kaiserQNetwork, 10f, 11f, 12f, 13f);

        RfpQuoteOption alongsideKaiserOption = testEntityHelper.createTestRfpQuoteOption(kaiserQuote, "medical kaiser option");
        RfpQuoteOptionNetwork medicalOptNetwork =
            testEntityHelper.createTestRfpQuoteOptionNetwork(alongsideKaiserOption, medicalQNetwork, medicalNetworkPlan1, aetnaClientPlan, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork kaiserMedicalOptNetwork =
            testEntityHelper.createTestRfpQuoteOptionNetwork(alongsideKaiserOption, kaiserQNetwork, kaiserNetworkPlan, kaiserClientPlan, 1L, 1L, 2L, 2L, "DOLLAR", 90f, 90f, 90f, 90f);

        flushAndClear();

        QuoteOptionDetailsDto quoteOptionDto = gson.fromJson(performGet("/v1/quotes/options/{id}", EMPTY, alongsideKaiserOption.getRfpQuoteOptionId()), QuoteOptionDetailsDto.class);

        assertThat(quoteOptionDto.getDetailedPlans()).hasSize(2);

        for(QuoteOptionPlanDetailsDto detail : quoteOptionDto.getDetailedPlans()) {
            if(detail.getRfpQuoteOptionNetworkId().equals(medicalOptNetwork.getRfpQuoteOptionNetworkId())) {
                assertThat(detail.isKaiserNetwork()).isFalse();
                assertThat(detail.getCarrier()).isEqualTo(carrier.getDisplayName());
            } else {
                assertThat(detail.isKaiserNetwork()).isTrue();
                assertThat(detail.getCarrier()).isEqualTo(CarrierType.KAISER.displayName);
            }
        }

        RfpQuoteOption fullTakeoverOption = testEntityHelper.createTestRfpQuoteOption(kaiserQuote, "full takeover option");

        RfpQuoteOptionNetwork medicalOptNetwork2 =testEntityHelper.createTestRfpQuoteOptionNetwork(
            fullTakeoverOption, medicalQNetwork, medicalNetworkPlan1, aetnaClientPlan, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        // Kaiser was replaced by Anthem/UHC/...
        RfpQuoteOptionNetwork kaiserReplacedOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(
                fullTakeoverOption, medicalQNetwork, medicalNetworkPlan2, /* client plan from Kaiser! */ kaiserClientPlan, 1L, 1L, 2L, 2L, "DOLLAR", 90f, 90f, 90f, 90f);

        flushAndClear();
        
        quoteOptionDto = gson.fromJson(performGet("/v1/quotes/options/{id}", EMPTY, fullTakeoverOption.getRfpQuoteOptionId()), QuoteOptionDetailsDto.class);

        assertThat(quoteOptionDto.getDetailedPlans()).hasSize(2);

        for(QuoteOptionPlanDetailsDto detail : quoteOptionDto.getDetailedPlans()) {
            assertThat(detail.getCarrier()).isEqualTo(carrier.getDisplayName());
            assertThat(detail.isKaiserNetwork()).isFalse();
        }
    }
    
    @Test
    public void getAncillaryQuoteOptionById() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        Carrier currentCarrier = testEntityHelper.createTestCarrier(CarrierType.SUN_LIFE.name(), CarrierType.SUN_LIFE.displayName);
        AncillaryPlan currentAncillaryPlan = testEntityHelper.createTestAncillaryPlan("Current Basic Life",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, currentCarrier);
        ClientPlan currentPlan = testEntityHelper.createTestAncillaryClientPlan(client, currentAncillaryPlan, PlanCategory.LIFE);
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.VOYA.name(), CarrierType.VOYA.displayName);
        
        AncillaryPlan ancillaryPlan1 = testEntityHelper.createTestAncillaryPlan("Basic Life Match",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);
        
        AncillaryPlan ancillaryPlan2 = testEntityHelper.createTestAncillaryPlan("Basic Life Alt",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);
        
        AncillaryPlan ancillaryPlan3 = testEntityHelper.createTestAncillaryPlan("Basic Life Second",
                PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), 
            Constants.LIFE);
        
        RfpQuoteAncillaryPlan selected = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan1);
        RfpQuoteAncillaryPlan alternative = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan2);
        RfpQuoteAncillaryPlan secondSelected = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan3);
        
        RfpQuoteAncillaryOption option = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", selected);
        option.setSecondRfpQuoteAncillaryPlan(secondSelected);
        rfpQuoteAncillaryOptionRepository.save(option);    
        
        flushAndClear();
        
        String result = performGet("/v1/quotes/options/ancillary/{id}", EMPTY, option.getRfpQuoteAncillaryOptionId());
        
        RfpQuoteAncillaryOptionDto quoteOptionDto = gson.fromJson(result, RfpQuoteAncillaryOptionDto.class);
        
        assertThat(quoteOptionDto).hasNoNullFieldsOrProperties();
        assertThat(quoteOptionDto.getPlans()).hasSize(4);
        // check sorting
        assertThat(quoteOptionDto.getPlans()).extracting(RfpQuoteAncillaryPlanDto::getPlanName).containsExactly(
        		currentAncillaryPlan.getPlanName(),
        		selected.getAncillaryPlan().getPlanName(),
        		secondSelected.getAncillaryPlan().getPlanName(),
        		alternative.getAncillaryPlan().getPlanName());
        for(RfpQuoteAncillaryPlanDto plan : quoteOptionDto.getPlans()) {
        	assertThat(plan.getRates().getMonthlyCost()).isEqualTo(quoteOptionDto.getTotalAnnualPremium() / 12.0, offset(0.001));
            if(plan.getRfpQuoteAncillaryPlanId() == null) {
            	assertThat(plan.getCarrierName()).isEqualTo(currentCarrier.getName());
            	assertThat(plan.getCarrierDisplayName()).isEqualTo(currentCarrier.getDisplayName());
                assertThat(plan.getType()).isEqualTo(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT);
            } else if(plan.getRfpQuoteAncillaryPlanId().equals(selected.getRfpQuoteAncillaryPlanId())) {
                assertThat(plan.getSelected()).isTrue();
                assertThat(plan.getSelectedSecond()).isFalse();
                assertThat(plan.getType()).isEqualTo(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE);
            } else if(plan.getRfpQuoteAncillaryPlanId().equals(secondSelected.getRfpQuoteAncillaryPlanId())) {
                assertThat(plan.getSelected()).isFalse();
                assertThat(plan.getSelectedSecond()).isTrue();
                assertThat(plan.getType()).isEqualTo(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE);
            } else {
                assertThat(plan.getSelected()).isFalse();
                assertThat(plan.getSelectedSecond()).isFalse();
                assertThat(plan.getType()).isEqualTo(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE);
            }
        }
    }
    
    @Test
    public void getAncillaryQuoteOptionById_NoCurrentOption() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.VOYA.name(), CarrierType.VOYA.displayName);
        
        AncillaryPlan ancillaryMatch = testEntityHelper.createTestAncillaryPlan("Basic Life Match",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), 
            Constants.LIFE);

        RfpQuoteAncillaryOption option = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", rfpQuote);

        String result = performGet("/v1/quotes/options/ancillary/{id}", EMPTY, option.getRfpQuoteAncillaryOptionId());
        
        RfpQuoteAncillaryOptionDto quoteOptionDto = gson.fromJson(result, RfpQuoteAncillaryOptionDto.class);

        assertThat(quoteOptionDto.getPlans()).hasSize(0);
        assertThat(quoteOptionDto.getPercentDifference()).isNull();
        assertThat(quoteOptionDto.getDollarDifference()).isNull();
        // no selected plan - no total
        assertThat(quoteOptionDto.getTotalAnnualPremium()).isNull();
        
        // select option plan for total calculation
        RfpQuoteAncillaryPlan selected = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryMatch);
        option.setRfpQuoteAncillaryPlan(selected);
        rfpQuoteAncillaryOptionRepository.save(option);
        
        flushAndClear();
        
        result = performGet("/v1/quotes/options/ancillary/{id}", EMPTY, option.getRfpQuoteAncillaryOptionId());
        
        quoteOptionDto = gson.fromJson(result, RfpQuoteAncillaryOptionDto.class);

        assertThat(quoteOptionDto.getPlans()).hasSize(1);
        RfpQuoteAncillaryPlanDto selectedDto = quoteOptionDto.getPlans().get(0);
        assertThat(selectedDto.getPercentDifference()).isEqualTo(100f, offset(0.01f));
        assertThat(quoteOptionDto.getPercentDifference()).isEqualTo(100f, offset(0.001f));
        assertThat(quoteOptionDto.getDollarDifference()).isEqualTo(quoteOptionDto.getTotalAnnualPremium());
        // total calculated by selected plan
        assertThat(quoteOptionDto.getTotalAnnualPremium()).isNotZero();
    }
    
    @Test
    public void getAncillaryQuoteOptionById_SelectedPlanIsMatch() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.VOYA.name(), CarrierType.VOYA.displayName);
        
        AncillaryPlan ancillaryMatch = testEntityHelper.createTestAncillaryPlan("Basic Life Match",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);

        AncillaryPlan ancillarySecond = testEntityHelper.createTestAncillaryPlan("Basic Life Second",
                PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), 
            Constants.LIFE);
        
        RfpQuoteAncillaryPlan selected = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryMatch);
        RfpQuoteAncillaryPlan secondSelected = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillarySecond);
        selected.setMatchPlan(true);
        rfpQuoteAncillaryPlanRepository.save(selected);
        
        RfpQuoteAncillaryOption option = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", selected);
        option.setSecondRfpQuoteAncillaryPlan(secondSelected);
        rfpQuoteAncillaryOptionRepository.save(option);    
        
        flushAndClear();
        
        String result = performGet("/v1/quotes/options/ancillary/{id}", EMPTY, option.getRfpQuoteAncillaryOptionId());
        
        RfpQuoteAncillaryOptionDto quoteOptionDto = gson.fromJson(result, RfpQuoteAncillaryOptionDto.class);
        
        // Selected + SecondSelected 
        assertThat(quoteOptionDto.getPlans()).hasSize(2);
        // check sorting
        assertThat(quoteOptionDto.getPlans()).extracting(RfpQuoteAncillaryPlanDto::getPlanName).containsExactly(
        		ancillaryMatch.getPlanName(),
        		ancillarySecond.getPlanName());
        RfpQuoteAncillaryPlanDto selectedDto = quoteOptionDto.getPlans().get(0);
        // check for selected and match plans the same
        assertThat(selectedDto.getSelected()).isTrue();
        assertThat(selectedDto.isMatchPlan()).isTrue();
        assertThat(selectedDto.getType()).isEqualTo(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_MATCH_PLAN);
    }
    
    @Test
    public void select_unselectRfpQuoteAncillaryPlan() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.VOYA.name(), CarrierType.VOYA.displayName);
        
        AncillaryPlan ancillaryPlan1 = testEntityHelper.createTestAncillaryPlan("Basic Life",
            PlanCategory.LIFE, AncillaryPlanType.BASIC, carrier);
        
        AncillaryPlan ancillaryPlan2 = testEntityHelper.createTestAncillaryPlan("Voluntary Life",
            PlanCategory.VOL_LIFE, AncillaryPlanType.VOLUNTARY, carrier);
        
        AncillaryPlan ancillaryPlan3 = testEntityHelper.createTestAncillaryPlan("Second Voluntary Life",
                PlanCategory.VOL_LIFE, AncillaryPlanType.VOLUNTARY, carrier);

        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), 
            Constants.LIFE);
        
        RfpQuoteAncillaryPlan selected = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan1);

        RfpQuoteAncillaryOption option = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", selected);
        
        RfpQuoteAncillaryPlan newSelected = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan2);
        
        RfpQuoteAncillaryPlan secondSelected = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan3);
        
        // select first and second plan
        SelectRfpQuoteAnsillaryPlanDto params = new SelectRfpQuoteAnsillaryPlanDto();
        params.setRfpQuoteAncillaryOptionId(option.getRfpQuoteAncillaryOptionId());
        params.setRfpQuoteAncillaryPlanId(newSelected.getRfpQuoteAncillaryPlanId());
        params.setSecondRfpQuoteAncillaryPlanId(secondSelected.getRfpQuoteAncillaryPlanId());
        
        performPut("/v1/quotes/options/selectAncillaryPlan", params);
        
        flushAndClear();
        
        option = rfpQuoteAncillaryOptionRepository.findOne(option.getRfpQuoteAncillaryOptionId());
        assertThat(option.getRfpQuoteAncillaryPlan().getRfpQuoteAncillaryPlanId())
            .isEqualTo(newSelected.getRfpQuoteAncillaryPlanId());
        assertThat(option.getSecondRfpQuoteAncillaryPlan().getRfpQuoteAncillaryPlanId())
        	.isEqualTo(secondSelected.getRfpQuoteAncillaryPlanId());
        
        // unselect first plan
        params = new SelectRfpQuoteAnsillaryPlanDto();
        params.setRfpQuoteAncillaryOptionId(option.getRfpQuoteAncillaryOptionId());
        params.setRfpQuoteAncillaryPlanId(newSelected.getRfpQuoteAncillaryPlanId());

        performPut("/v1/quotes/options/unselectAncillaryPlan", params);
        
        flushAndClear();
        
        option = rfpQuoteAncillaryOptionRepository.findOne(option.getRfpQuoteAncillaryOptionId());
        assertThat(option.getRfpQuoteAncillaryPlan()).isNull();
        assertThat(option.getSecondRfpQuoteAncillaryPlan().getRfpQuoteAncillaryPlanId())
        	.isEqualTo(secondSelected.getRfpQuoteAncillaryPlanId());
        
        // unselect second plan
        params = new SelectRfpQuoteAnsillaryPlanDto();
        params.setRfpQuoteAncillaryOptionId(option.getRfpQuoteAncillaryOptionId());
        params.setSecondRfpQuoteAncillaryPlanId(secondSelected.getRfpQuoteAncillaryPlanId());

        performPut("/v1/quotes/options/unselectAncillaryPlan", params);
        
        flushAndClear();
        
        option = rfpQuoteAncillaryOptionRepository.findOne(option.getRfpQuoteAncillaryOptionId());
        assertThat(option.getRfpQuoteAncillaryPlan()).isNull();
        assertThat(option.getSecondRfpQuoteAncillaryPlan()).isNull();
    }

    
    @Test
    public void createAncillaryQuoteOption() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(CarrierType.VOYA.name(), PlanCategory.LIFE.name());

        AncillaryPlan ancillaryPlan = testEntityHelper.createTestAncillaryPlan("Voluntary Life",
            PlanCategory.VOL_LIFE, AncillaryPlanType.VOLUNTARY, rfpCarrier.getCarrier());
        ClientPlan currentPlan = testEntityHelper.createTestAncillaryClientPlan(client, ancillaryPlan, PlanCategory.LIFE);
        
        CreateRfpQuoteOptionDto params = new CreateRfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setRfpCarrierId(rfpCarrier.getRfpCarrierId());
        params.setQuoteType(QuoteType.STANDARD);
        params.setOptionType(OptionType.OPTION);
        params.setDisplayName("Test option display name");

        String result = performPost("/v1/quotes/options/createAncillary", params);
        RfpQuoteAncillaryOptionDto optionDto = gson.fromJson(result, RfpQuoteAncillaryOptionDto.class);
        assertThat(optionDto).hasNoNullFieldsOrPropertiesExcept(
            "totalAnnualPremium", "percentDifference", "dollarDifference");
        assertThat(optionDto.getPlans()).hasSize(1);
        assertThat(optionDto.getPlans().get(0).getType()).isEqualTo(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT);
    }

    @Test
    public void getRfpQuoteOptionByIdWithClientPlanRxPnn() throws Exception {
        Client client = testEntityHelper.createTestClient();
        ClientPlan cpHmo = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        PlanNameByNetwork rxPnn = testEntityHelper.createTestRxPlanNameByNetwork("RX1", cpHmo.getPnn().getNetwork());
        testEntityHelper.createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", rxPnn.getPlan(), "$100", null);
        testEntityHelper.createTestBenefit("MAIL_ORDER", rxPnn.getPlan(), "2x 1/2/3/4", null);
        cpHmo.setRxPnn(rxPnn);
        clientPlanRepository.save(cpHmo);

        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "UHC", Constants.MEDICAL);
        RfpQuoteNetwork rqnhmo = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan rqnphmo = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hmo", rqnhmo,
                cpHmo.getTier1Rate() * 0.79f,
                cpHmo.getTier2Rate() * 0.78f,
                cpHmo.getTier3Rate() * 0.77f,
                cpHmo.getTier4Rate() * 0.76f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqonhmo = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqnhmo, rqnphmo, cpHmo, 10L, 15L, 20L, 25L,
                "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(
            MockMvcRequestBuilders.get("/v1/quotes/options/{id}", rqo.getRfpQuoteOptionId())
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        QuoteOptionDetailsDto dto = gson
            .fromJson(result.getResponse().getContentAsString(), QuoteOptionDetailsDto.class);

        for(QuoteOptionPlanDetailsDto detailsDto : dto.getDetailedPlans()){
            QuoteOptionPlanBriefDto currentPlan = detailsDto.getCurrentPlan();
            assertThat(currentPlan.getRx()).hasSize(2);
        }
    }

    @Test
    public void getRfpQuoteOptionById() throws Exception {
        Client client = testEntityHelper.createTestClient();
        ClientPlan cpHmo = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        ClientPlan cpHsa = testEntityHelper
            .createTestClientPlan("hsa client plan", client, "KAISER", "HSA");
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqnhmo = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork rqnhsa = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");
        RfpQuoteNetworkPlan rqnphmo = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hmo", rqnhmo,
                cpHmo.getTier1Rate() * 0.79f,
                cpHmo.getTier2Rate() * 0.78f,
                cpHmo.getTier3Rate() * 0.77f,
                cpHmo.getTier4Rate() * 0.76f);
        RfpQuoteNetworkPlan rqnphsa = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan hsa", rqnhsa,
                cpHsa.getTier1Rate() * 1.21f,
                cpHsa.getTier2Rate() * 1.22f,
                cpHsa.getTier3Rate() * 1.23f,
                cpHsa.getTier4Rate() * 1.24f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqonhmo = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqnhmo, rqnphmo, cpHmo, 10L, 15L, 20L, 25L,
                "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqonhsa = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqnhsa, rqnphsa, cpHsa, 10L, 15L, 20L, 25L,
                "PERCENT", 90f, 90f, 90f, 90f);
        rqonhsa.setTier1EeFund(1f);
        rqonhsa.setTier1EeFund(2f);
        rqonhsa.setTier1EeFund(3f);
        rqonhsa.setTier1EeFund(4f);
        rqonhsa = rfpQuoteOptionNetworkRepository.save(rqonhsa);

        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(
            MockMvcRequestBuilders.get("/v1/quotes/options/{id}", rqo.getRfpQuoteOptionId())
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        QuoteOptionDetailsDto dto = gson
            .fromJson(result.getResponse().getContentAsString(), QuoteOptionDetailsDto.class);

        assertThat(dto.getOverviewPlans()).hasSize(2);
        for (QuoteOptionPlanBriefDto plan : dto.getOverviewPlans()) {
            assertThat(plan.getEmployer() + plan.getEmployee()).isEqualTo(plan.getTotal());
            if (StringUtils.isBlank(plan.getLabel())) {
                // new plan, not "current plan"
                assertThat(plan.getTotal() * MONTHS_IN_YEAR).isEqualTo(dto.getTotalAnnualPremium());
            } else {
                // current
                assertThat(plan.getCarrier()).isEqualTo("Blue Shield");
                assertThat(plan.getQuoteType()).isEqualTo(QuoteType.KAISER);
            }
        }
        assertThat(dto.getDetailedPlans()).hasSize(2);
        float newPlanTotalSum = 0f;
        float newPlanEmployeeTotalSum = 0f;
        float currentPlanTotalSum = 0f;
        float currentPlanEmployeeTotalSum = 0f;
        float employerFund = 0f;
        float administrativeFee = 0f;
        for (QuoteOptionPlanDetailsDto plan : dto.getDetailedPlans()) {
            assertThat(plan.getRfpCarrierId()).isNotNull();
            assertThat(plan.getNewPlan().getPlanId()).isNotNull();
            assertThat(plan.getCurrentPlan().getPlanId()).isNotNull();
            newPlanTotalSum += plan.getNewPlan().getTotal();
            newPlanEmployeeTotalSum += plan.getNewPlan().getEmployee();
            currentPlanTotalSum += plan.getCurrentPlan().getTotal();
            currentPlanEmployeeTotalSum += plan.getCurrentPlan().getEmployee();
            employerFund += plan.getEmployerFund();
            administrativeFee += plan.getAdministrativeFee();
            if (plan.getType().equals("HMO")) {
                assertThat(plan.getNetworkName()).isEqualTo(rqnhmo.getNetwork().getName());
                assertThat(plan.getPercentDifference()).isLessThan(0f);
            } else {
                assertThat(plan.getNetworkName()).isEqualTo(rqnhsa.getNetwork().getName());
                assertThat(plan.getPercentDifference()).isGreaterThan(0f);
                assertThat(plan.getEmployerFund()).isGreaterThan(0f);
            }
        }
        // new plan overview head row
        float newEmployee = dto.getOverviewPlans().get(0).getEmployee();
        float newEmployer = dto.getOverviewPlans().get(0).getEmployer();
        float newTotal = dto.getOverviewPlans().get(0).getTotal();
        assertThat(newEmployer + newEmployee).isEqualTo(newTotal);

        assertThat((newPlanTotalSum + employerFund + administrativeFee) * MONTHS_IN_YEAR)
            .isEqualTo(dto.getTotalAnnualPremium(), offset(0.001f));
        assertThat(newPlanTotalSum + employerFund + administrativeFee)
            .isEqualTo(newTotal, offset(0.001f));
        assertThat(newPlanEmployeeTotalSum).isEqualTo(newEmployee);
        assertThat(newPlanTotalSum * MONTHS_IN_YEAR).isEqualTo(dto.getNewPlanAnnual());

        // current plan overview head row
        float curEmployee = dto.getOverviewPlans().get(1).getEmployee();
        float curEmployer = dto.getOverviewPlans().get(1).getEmployer();
        float curTotal = dto.getOverviewPlans().get(1).getTotal();
        assertThat(curEmployer + curEmployee).isEqualTo(curTotal);

        assertThat(currentPlanTotalSum + employerFund + administrativeFee)
            .isEqualTo(curTotal, offset(0.001f));
        assertThat(currentPlanEmployeeTotalSum).isEqualTo(curEmployee);
        assertThat(currentPlanTotalSum * MONTHS_IN_YEAR).isEqualTo(dto.getCurrentPlanAnnual());
    }

    @Test
    public void getRfpQuoteOptionAlternatives_Attributes() throws Exception {

        Client client = testEntityHelper.createTestClient();
        client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        token = createToken(client.getBroker().getBrokerToken());

        ClientPlan clientPlan = testEntityHelper.createTestClientPlan("hmo client plan", client,
            "BLUE_SHIELD", "HMO");

        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(
            clientPlan.getPnn().getNetwork().getCarrier(), Constants.DENTAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote replaceKaiser = testEntityHelper.createTestRfpQuote(client, rfpSubmission,
            Constants.UHC_CARRIER, Constants.DENTAL, QuoteType.STANDARD);

        RfpQuoteNetwork replaceKaiserNetwork =
            testEntityHelper.createTestQuoteNetwork(replaceKaiser, "HMO");

        RfpQuoteNetworkPlan replaceKaiserRqnp = testEntityHelper.createTestRfpQuoteNetworkPlan(
            "test quote plan", replaceKaiserNetwork, 100f, 120f, 140f, 160f);

        RfpQuoteOption replaceKaiserRqo =
            testEntityHelper.createTestRfpQuoteOption(replaceKaiser, "Option 1");

        RfpQuoteOptionNetwork replaceKaiserRqon = testEntityHelper.createTestRfpQuoteOptionNetwork(
            replaceKaiserRqo, replaceKaiserNetwork, replaceKaiserRqnp, clientPlan, 10L, 15L,
            20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        attributeRepository.save(
            new QuotePlanAttribute(replaceKaiserRqnp, QuotePlanAttributeName.CONTRACT_LENGTH,
                "4 Months"));

        flushAndClear();

        String responseContent = performGet("/v1/quotes/options/alternatives",
            new Object[]{"rfpQuoteOptionNetworkId",
                replaceKaiserRqon.getRfpQuoteOptionNetworkId()});

        QuoteOptionPlanAlternativesDto responseDto =
            gson.fromJson(responseContent, QuoteOptionPlanAlternativesDto.class);

        assertThat(responseDto).isNotNull();

        assertThat(responseDto.getPlans()).hasSize(2);
        QuoteOptionAltPlanDto current = responseDto.getPlans().get(0);
        assertThat(current.getType())
            .isEqualTo(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT);
        assertThat(current.getName()).isEqualTo("hmo client plan on Client plan network");
        assertThat(current.getAttributes()).hasSize(0);

        QuoteOptionAltPlanDto alt = responseDto.getPlans().get(1);

        assertThat(alt.getName()).isEqualTo("test quote plan on Test network");
        assertThat(alt.getAttributes()).hasSize(1);
        Attribute attribute = alt.getAttributes().get(0);
        assertThat(attribute.sysName).isEqualTo(QuotePlanAttributeName.CONTRACT_LENGTH.name());

    }

    @Test
    public void getRfpQuoteOptionAlternatives_EffectiveYear() throws Exception {
        Client client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan alterPlan1 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test selected plan 1", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteNetworkPlan rxPlan1 = testEntityHelper
            .createTestRfpQuoteNetworkRxPlan("rx plan 1", rqn, 0.9f, 0.9f, 0.9f, 0.9f);

        RfpQuoteNetworkPlan alterPlan2 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test alter plan 2", rqn, 100f, 120f, 140f, 160f);
        alterPlan2.getPnn().getPlan().setPlanYear(client.getEffectiveYear() + 3);
        planRepository.save(alterPlan2.getPnn().getPlan());

        RfpQuoteNetworkPlan rxPlan2 = testEntityHelper
            .createTestRfpQuoteNetworkRxPlan("rx plan 2", rqn, 0.9f, 0.9f, 0.9f, 0.9f);
        rxPlan2.getPnn().getPlan().setPlanYear(client.getEffectiveYear() + 3);
        planRepository.save(rxPlan2.getPnn().getPlan());

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, alterPlan1, null, 10L, 15L, 20L, 25L,
                "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        String result = performGet("/v1/quotes/options/alternatives",
            new Object[]{"rfpQuoteOptionNetworkId", rqon.getRfpQuoteOptionNetworkId()});

        QuoteOptionPlanAlternativesDto dto = gson
            .fromJson(result, QuoteOptionPlanAlternativesDto.class);

        // selected only alterPlan1 and rxPlan1
        assertThat(dto.getPlans()).hasSize(1);
        assertThat(dto.getRx()).hasSize(1);
        assertThat(dto.getPlans().get(0).getName()).isEqualTo(alterPlan1.getPnn().getName());
        assertThat(dto.getRx().get(0).getName()).isEqualTo(rxPlan1.getPnn().getName());

        // change client effectiveDate to 3 year forward
        client.setEffectiveDate(DateUtils.addYears(new Date(), 3));
        client = clientRepository.save(client);

        result = performGet("/v1/quotes/options/alternatives",
            new Object[]{"rfpQuoteOptionNetworkId", rqon.getRfpQuoteOptionNetworkId()});

        dto = gson.fromJson(result, QuoteOptionPlanAlternativesDto.class);

        // selected only alterPlan2 and rxPlan2 (see plan ReleaseYear set up)
        assertThat(dto.getPlans()).hasSize(1);
        assertThat(dto.getRx()).hasSize(1);
        assertThat(dto.getPlans().get(0).getName()).isEqualTo(alterPlan2.getPnn().getName());
        assertThat(dto.getRx().get(0).getName()).isEqualTo(rxPlan2.getPnn().getName());
    }


    private QuoteOptionPlanAlternativesDto testRfpQuoteOptionAlternativesAndReturnPayload(
        Object[] filteringParams) throws Exception {
        Client client = testEntityHelper.createTestClient();
        client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        ClientPlan clientPlan = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        Benefit clientPlanBenefit = testEntityHelper
            .createTestBenefit("ADVANCED_RADIOLOGY", clientPlan.getPnn().getPlan(), false);
        Benefit clientPlanRxBenefit = testEntityHelper
            .createTestBenefit("RX_INDIVIDUAL_DEDUCTIBLE", clientPlan.getPnn().getPlan(), false);
        PlanNameByNetwork rxClientPnn = testEntityHelper
            .createTestRxPlanNameByNetwork("rx client plan", clientPlan.getPnn().getNetwork());
        clientPlan.setRxPnn(rxClientPnn);
        clientPlan = clientPlanRepository.save(clientPlan);
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan selectedPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test selected plan", rqn, 100f, 120f, 140f, 160f);
        Benefit selectedPlanBenefit = testEntityHelper
            .createTestBenefit("PCP", selectedPlan.getPnn().getPlan(), true);
        Benefit selectedPlanRxBenefit = testEntityHelper
            .createTestBenefit("RX_FAMILY_DEDUCTIBLE", selectedPlan.getPnn().getPlan(), false);
        RfpQuoteNetworkPlan rxPlan = testEntityHelper
            .createTestRfpQuoteNetworkRxPlan("rx plan", rqn, 0.9f, 0.9f, 0.9f, 0.9f);

        Document summaryFileDoc = testEntityHelper
            .createTestDocument(rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier(),
                "T-Anthem PPO Lemdy Was Here HSA 4500_20 Rx_Essential $5_$15_$40_$60_30%");

        RfpQuoteNetworkPlan alterPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test alter plan", rqn, 100f, 120f, 140f, 160f);
        PlanNameByNetwork pnn = alterPlan.getPnn();
        // plan name is NOT equal: expected name normalization before file search
        pnn.setName("T-Anthem PPO Lemdy Was Here HSA 4500/20  Rx:Essential $5/$15/$40/$60/30%");
        pnn = pnnRepository.save(pnn);

        alterPlan.setPnn(pnn);
        alterPlan.setMatchPlan(true);
        rfpQuoteNetworkPlanRepository.save(alterPlan);

        Benefit alterPlanBenefit = testEntityHelper
            .createTestBenefit("SPECIALIST", alterPlan.getPnn().getPlan(), true);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, selectedPlan, clientPlan, 10L, 15L, 20L, 25L,
                "PERCENT", 90f, 90f, 90f, 90f);
        rqon.setSelectedRfpQuoteNetworkRxPlan(rxPlan);
        rfpQuoteOptionNetworkRepository.save(rqon);

        flushAndClear();

        if (filteringParams == null) {
            filteringParams = new Object[]{};
        }

        Object[] finalParams = ArrayUtils
            .addAll(new Object[]{"rfpQuoteOptionNetworkId", rqon.getRfpQuoteOptionNetworkId()},
                filteringParams);
        String result = performGet("/v1/quotes/options/alternatives", finalParams);

        QuoteOptionPlanAlternativesDto dto = gson
            .fromJson(result, QuoteOptionPlanAlternativesDto.class);
        assertThat(dto.getOptionName()).isEqualTo(rqo.getRfpQuoteOptionName());
        assertThat(dto.getPlans()).hasSize(3);
        assertThat(dto.getRx()).hasSize(2);
        // current always first
        assertThat(dto.getRx().get(0)).hasNoNullFieldsOrPropertiesExcept("rfpQuoteNetworkPlanId");
        assertThat(dto.getRx().get(0).getName()).isEqualTo(rxClientPnn.getName());
        assertThat(dto.getRx().get(0).getType())
            .isEqualTo(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT);
        // selected always second
        assertThat(dto.getRx().get(1).isSelected()).isTrue();
        assertThat(dto.getRx().get(1)).hasNoNullFieldsOrPropertiesExcept("clientPlanId");
        assertThat(dto.getRx().get(1).getRfpQuoteNetworkPlanId())
            .isEqualTo(rxPlan.getRfpQuoteNetworkPlanId());
        assertThat(dto.getRx().get(1).getName()).isEqualTo(rxPlan.getPnn().getName());
        assertThat(dto.getRx().get(1).getType())
            .isEqualTo(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE);

        for (int i = 0; i < dto.getPlans().size(); i++) {
            QuoteOptionAltPlanDto plan = dto.getPlans().get(i);
            assertThat(plan.getCost()).hasSize(6);
            switch (plan.getType()) {
                case QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT:
                    assertThat(plan.getClientPlanId()).isEqualTo(clientPlan.getClientPlanId());
                    assertThat(plan.getName()).isEqualTo(clientPlan.getPnn().getName());
                    assertThat(i).isEqualTo(0); // always first in list
                    assertThat(plan.getRx()).hasSize(1);
                    assertThat(plan.getNetworkName())
                        .isEqualTo(clientPlan.getPnn().getNetwork().getName());

                    assertThat(plan.getCost().get(2).value)
                        .isEqualTo(clientPlan.getTier1Rate().toString());
                    assertThat(plan.getCost().get(3).value)
                        .isEqualTo(clientPlan.getTier2Rate().toString());
                    assertThat(plan.getCost().get(4).value)
                        .isEqualTo(clientPlan.getTier3Rate().toString());
                    assertThat(plan.getCost().get(5).value)
                        .isEqualTo(clientPlan.getTier4Rate().toString());
                    break;
                case QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE:
                    assertThat(plan.getName()).isEqualTo(selectedPlan.getPnn().getName());
                    assertThat(i).isEqualTo(1); // always second in list
                    assertThat(plan.isSelected());
                    assertThat(plan.getRx()).hasSize(1);
                    assertThat(plan.getNetworkName())
                        .isEqualTo(selectedPlan.getPnn().getNetwork().getName());

                    assertThat(plan.getCost().get(2).value).isEqualTo(
                        String.valueOf(selectedPlan.getTier1Rate() * rxPlan.getTier1Rate()));
                    assertThat(plan.getCost().get(3).value).isEqualTo(
                        String.valueOf(selectedPlan.getTier2Rate() * rxPlan.getTier2Rate()));
                    assertThat(plan.getCost().get(4).value).isEqualTo(
                        String.valueOf(selectedPlan.getTier3Rate() * rxPlan.getTier3Rate()));
                    assertThat(plan.getCost().get(5).value).isEqualTo(
                        String.valueOf(selectedPlan.getTier4Rate() * rxPlan.getTier4Rate()));
                    break;
                case QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_MATCH_PLAN:
                    assertThat(plan.getName()).isEqualTo(alterPlan.getPnn().getName());
                    assertThat(i)
                        .isEqualTo(2); // always third (2 in zero-indexed array) position in list
                    assertThat(plan.getNetworkName())
                        .isEqualTo(alterPlan.getPnn().getNetwork().getName());
                    assertThat(plan.getSummaryFileLink()).isNotNull();
                    assertThat(plan.getSummaryFileLink())
                        .endsWith("documents/" + summaryFileDoc.getDocumentId() + "/download");

                    assertThat(plan.getCost().get(2).value).isEqualTo(
                        String.valueOf(alterPlan.getTier1Rate() * rxPlan.getTier1Rate()));
                    assertThat(plan.getCost().get(3).value).isEqualTo(
                        String.valueOf(alterPlan.getTier2Rate() * rxPlan.getTier2Rate()));
                    assertThat(plan.getCost().get(4).value).isEqualTo(
                        String.valueOf(alterPlan.getTier3Rate() * rxPlan.getTier3Rate()));
                    assertThat(plan.getCost().get(5).value).isEqualTo(
                        String.valueOf(alterPlan.getTier4Rate() * rxPlan.getTier4Rate()));
                    break;
                default:
                    Assert.fail("Unknown plan type");
            }
            assertThat(plan.getBenefits()).hasSize(1);
            QuoteOptionAltPlanDto.Benefit ben = plan.getBenefits().get(0);
            if (plan.getName().equals(clientPlan.getPnn().getName())) {
                // only one column benefit value
                assertThat(ben.type).isEqualTo("NUMBER");
                assertThat(ben.typeIn).isNull();
                assertThat(ben.typeOut).isNull();
                assertThat(ben.value).isEqualTo("1");
                assertThat(ben.valueIn).isNull();
                assertThat(ben.valueOut).isNull();
            } else {
                // IN and OUT-NETWORK values
                assertThat(ben.typeIn).isEqualTo("NUMBER");
                assertThat(ben.typeOut).isEqualTo("NUMBER");
                assertThat(ben.type).isNull();
                assertThat(ben.valueIn).isEqualTo("1");
                assertThat(ben.valueOut).isEqualTo("2");
                assertThat(ben.value).isNull();
            }
        }

        return dto;
    }

    @Test
    public void getRfpQuoteOptionAlternatives() throws Exception {
        testRfpQuoteOptionAlternativesAndReturnPayload(null);
    }


    private Float getBenefitValue(QuoteOptionAltPlanDto plan, String name) {
        Float benefitValue = null;
        for (QuoteOptionAltPlanDto.Benefit benefit : plan.getBenefits()) {
            if (benefit.sysName.equalsIgnoreCase(name)) {
                Float benefitVal = null;
                if (benefit.valueIn.contains("x")) {
                    String[] split = benefit.valueIn.split("x");
                    if (split.length == 2) {
                        String val = split[0].replace("$", "");
                        val = val.replace(",", "");
                        benefitValue = Float.parseFloat(val);
                        break;
                    }
                } else {
                    String val = benefit.valueIn.replace(",", "");
                    val = val.replace("$", "");
                    benefitValue = Float.parseFloat(val);
                    break;
                }
            }
        }

        return benefitValue;
    }

    private Float getCostValue(QuoteOptionAltPlanDto plan, String name) {
        Float costValue = null;
        for (Cost cost : plan.getCost()) {
            if (cost.name.equalsIgnoreCase(name)) {
                costValue = Float.parseFloat(cost.value);
                break;
            }
        }
        return costValue;
    }

    @Test
    public void getRfpQuoteOptionAlternativesPercentDiffFiltering() throws Exception {
        Object[] filteringParams = new Object[]{"diffPercentFrom", "-100", "diffPercentTo", "100"};
        QuoteOptionPlanAlternativesDto dto = testRfpQuoteOptionAlternativesAndReturnPayload(
            filteringParams);

        for (int i = 0; i < dto.getPlans().size(); i++) {
            QuoteOptionAltPlanDto plan = dto.getPlans().get(i);
            assertThat(plan.getCost()).hasSize(6);
            switch (plan.getType()) {
                case QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE:
                    Float val = getCostValue(plan, Constants.PERCENT_CHANGE_FROM_CURRENT);
                    Assert.assertTrue(val == -79.5F);
                    break;
                case QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_MATCH_PLAN:
                    Float val2 = getCostValue(plan, Constants.PERCENT_CHANGE_FROM_CURRENT);
                    Assert.assertTrue(val2 == -79.5F);
                    break;
                case QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT:
                    break;
                default:
                    Assert.fail("Unknown plan type");
            }
        }
    }

    @Test
    public void getRfpQuoteOptionAlternativesWithHighlight() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client = testEntityHelper.buildTestClient();
        client.setEffectiveDate(new Date());
        client = clientRepository.save(client);

        ClientPlan clientPlan = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        Benefit clientPlanBenefit = testEntityHelper
            .createTestBenefit("PCP", clientPlan.getPnn().getPlan(), "10", "11");
        Benefit clientPlanBenefit2 = testEntityHelper
            .createTestBenefit("CALENDAR_YEAR_MAXIMUM", clientPlan.getPnn().getPlan(), "$10.5",
                null);

        clientPlan = clientPlanRepository.save(clientPlan);

        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan selectedPlan1 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test selected plan", rqn, 100f, 120f, 140f, 160f);
        Benefit selectedPlanBenefit = testEntityHelper
            .createTestBenefit("PCP", selectedPlan1.getPnn().getPlan(), "9", "12");
        Benefit selectedPlanBenefit2 = testEntityHelper
            .createTestBenefit("CALENDAR_YEAR_MAXIMUM", selectedPlan1.getPnn().getPlan(), "$9.9",
                null);

        RfpQuoteNetworkPlan alterPlan1 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test alter plan", rqn, 100f, 120f, 140f, 160f);
        Benefit alterPlanBenefit = testEntityHelper
            .createTestBenefit("PCP", alterPlan1.getPnn().getPlan(), "11", "10");
        Benefit alterPlanBenefit2 = testEntityHelper
            .createTestBenefit("CALENDAR_YEAR_MAXIMUM", alterPlan1.getPnn().getPlan(), "$10.9",
                null);

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, selectedPlan1, clientPlan, 10L, 15L, 20L,
                25L, "PERCENT", 90f, 90f, 90f, 90f);
        rfpQuoteOptionNetworkRepository.save(rqon);

        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        String result = performGet("/v1/quotes/options/alternatives",
            new Object[]{"rfpQuoteOptionNetworkId", rqon.getRfpQuoteOptionNetworkId()});

        QuoteOptionPlanAlternativesDto dto = gson
            .fromJson(result, QuoteOptionPlanAlternativesDto.class);

        assertThat(dto.getPlans()).hasSize(3);
        // current always first
        QuoteOptionAltPlanDto currentPlan = dto.getPlans().get(0);
        assertThat(currentPlan.getType())
            .isEqualTo(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_CURRENT);
        for (QuoteOptionAltPlanDto.Benefit benefit : currentPlan.getBenefits()) {
            assertThat(benefit.highlight).isNull();
            assertThat(benefit.highlightIn).isNull();
            assertThat(benefit.highlightOut).isNull();
        }

        // selected always second
        QuoteOptionAltPlanDto selectedPlan = dto.getPlans().get(1);
        assertThat(selectedPlan.isSelected()).isTrue();
        assertThat(selectedPlan.getType())
            .isEqualTo(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE);
        for (QuoteOptionAltPlanDto.Benefit benefit : selectedPlan.getBenefits()) {
            switch (benefit.sysName) {
                case "PCP":
                    assertThat(benefit.highlightIn).isEqualTo("POS");
                    assertThat(benefit.highlightOut).isEqualTo("NEG");
                    assertThat(benefit.highlight).isNull();
                    break;
                case "CALENDAR_YEAR_MAXIMUM":
                    assertThat(benefit.highlightIn).isNull();
                    assertThat(benefit.highlightOut).isNull();
                    assertThat(benefit.highlight).isEqualTo("NEG");
                    break;
            }
        }

        // alternative
        QuoteOptionAltPlanDto altPlan = dto.getPlans().get(2);
        assertThat(altPlan.isSelected()).isFalse();
        assertThat(altPlan.getType())
            .isEqualTo(QuoteOptionAltPlanDto.ALTERNATIVE_PLAN_TYPE_ALTERNATIVE);
        for (QuoteOptionAltPlanDto.Benefit benefit : altPlan.getBenefits()) {
            switch (benefit.sysName) {
                case "PCP":
                    assertThat(benefit.highlightIn).isEqualTo("NEG");
                    assertThat(benefit.highlightOut).isEqualTo("POS");
                    assertThat(benefit.highlight).isNull();
                    break;
                case "CALENDAR_YEAR_MAXIMUM":
                    assertThat(benefit.highlightIn).isNull();
                    assertThat(benefit.highlightOut).isNull();
                    assertThat(benefit.highlight).isEqualTo("POS");
                    break;
            }
        }


    }

    @Test
    public void compareRfpQuoteOptions() throws Exception {
        final String[] testBenefits = new String[]{"FAMILY_DEDUCTIBLE", "CO_INSURANCE",
            "INPATIENT_HOSPITAL"};
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqnHmo = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, "quote network 1", "HMO");
        RfpQuoteNetwork rqnPpo = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, "quote network 2", "PPO");
        RfpQuoteNetwork rqnHsa1 = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, "quote network 3", "HSA");
        RfpQuoteNetwork rqnHsa2 = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, "quote network 4", "HSA");
        RfpQuoteNetworkPlan planHmo1 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test hmo plan 1", rqnHmo, 100.1f, 120.2f, 140.3f,
                160.4f);
        testEntityHelper.createTestBenefits(planHmo1.getPnn().getPlan(), testBenefits);
        // RX benefits
        testEntityHelper.createTestBenefits(planHmo1.getPnn().getPlan(),
            new String[]{"RX_INDIVIDUAL_DEDUCTIBLE", "MAIL_ORDER"});
        RfpQuoteNetworkPlan planHmo2 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test hmo plan 2", rqnHmo, 100.50f, 120.50f, 140.50f,
                160.50f);
        testEntityHelper.createTestBenefits(planHmo2.getPnn().getPlan(), testBenefits);
        // Ext RX benefits
        RfpQuoteNetworkPlan planHmo2Rx = testEntityHelper
            .createTestRfpQuoteNetworkRxPlan("rx hmo plan 1", rqnHmo, 0.9f, 0.9f, 0.9f, 0.9f);
        testEntityHelper.createTestBenefits(planHmo2Rx.getPnn().getPlan(),
            new String[]{"RX_INDIVIDUAL_DEDUCTIBLE", "MAIL_ORDER"});

        RfpQuoteNetworkPlan planPpo = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test ppo plan", rqnPpo, 200.99f, 220.99f, 240.99f,
                260.99f);
        testEntityHelper.createTestBenefits(planPpo.getPnn().getPlan(), testBenefits);
        RfpQuoteNetworkPlan planHsa1 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test hsa plan 1", rqnHsa1, 200.11f, 220.11f, 240.11f,
                260.11f);
        testEntityHelper.createTestBenefits(planHsa1.getPnn().getPlan(), testBenefits);
        RfpQuoteNetworkPlan planHsa2 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test hsa plan 2", rqnHsa2, 200.76f, 220.76f, 240.76f,
                260.76f);
        testEntityHelper.createTestBenefits(planHsa2.getPnn().getPlan(), testBenefits);
        RfpQuoteNetworkPlan planHsa3 = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test hsa plan 3", rqnHsa2, 200.54f, 220.54f, 240.54f,
                260.54f);
        testEntityHelper.createTestBenefits(planHsa3.getPnn().getPlan(), testBenefits);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "option 1");
        ClientPlan clientPlanHmo1 = testEntityHelper
            .createTestClientPlan("clientPlan HMO 1", client, "UHC", "HMO");
        testEntityHelper.createTestBenefits(clientPlanHmo1.getPnn().getPlan(), testBenefits);
        // RX benefits
        testEntityHelper.createTestBenefits(clientPlanHmo1.getPnn().getPlan(),
            new String[]{"RX_INDIVIDUAL_DEDUCTIBLE", "MAIL_ORDER"});
        ClientPlan clientPlanHmo2 = testEntityHelper
            .createTestClientPlan("clientPlan HMO 2", client, "UHC", "HMO");
        testEntityHelper.createTestBenefits(clientPlanHmo2.getPnn().getPlan(), testBenefits);
        // Ext RX benefits
        PlanNameByNetwork rxClientPnn = testEntityHelper
            .createTestRxPlanNameByNetwork("rx client plan", clientPlanHmo2.getPnn().getNetwork());
        clientPlanHmo2.setRxPnn(rxClientPnn);
        clientPlanHmo2 = clientPlanRepository.save(clientPlanHmo2);
        testEntityHelper.createTestBenefits(rxClientPnn.getPlan(),
            new String[]{"RX_INDIVIDUAL_DEDUCTIBLE", "MAIL_ORDER"});

        ClientPlan clientPlanPpo = testEntityHelper
            .createTestClientPlan("clientPlan PPO", client, "CIGNA", "PPO");
        testEntityHelper.createTestBenefits(clientPlanPpo.getPnn().getPlan(), testBenefits);
        ClientPlan clientPlanHsa = testEntityHelper
            .createTestClientPlan("clientPlan HSA", client, "CIGNA", "HSA");
        testEntityHelper.createTestBenefits(clientPlanHsa.getPnn().getPlan(), testBenefits);
        RfpQuoteOptionNetwork rqonHmo = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqnHmo, planHmo1, clientPlanHmo1, 10L, 15L, 20L,
                25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqonHmo2 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqnHmo, planHmo2, clientPlanHmo2, 10L, 15L, 20L,
                25L, "PERCENT", 90f, 90f, 90f, 90f);
        // set RX plan
        rqonHmo2.setSelectedRfpQuoteNetworkRxPlan(planHmo2Rx);
        rqonHmo2 = rfpQuoteOptionNetworkRepository.save(rqonHmo2);
        RfpQuoteOptionNetwork rqonPpo = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqnPpo, planPpo, clientPlanPpo, 10L, 20L, 30L,
                40L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqonHsa3 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqnHsa2, planHsa3, null, 10L, 20L, 30L, 40L,
                "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOption rqo2 = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "option 2");
        RfpQuoteOptionNetwork rqonPpo2 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo2, rqnPpo, planPpo, clientPlanPpo, 10L, 15L, 20L,
                25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqonHsa = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo2, rqnHsa1, planHsa1, clientPlanHsa, 10L, 15L, 20L,
                25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqonHsa2 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo2, rqnHsa2, planHsa2, null, 10L, 15L, 20L, 25L,
                "PERCENT", 90f, 90f, 90f, 90f);

        testEntityHelper.createTestRfpQuoteSummary(client);
        
        flushAndClear();

        Object[] params = new Object[]{"ids",
            (rqo.getRfpQuoteOptionId().toString() + "," + rqo2.getRfpQuoteOptionId()),
            "currentOptionCompare", true};
        String response = performGet("/v1/quotes/options/compare", params);
        QuoteOptionPlanComparisonDto[] resultList = gson
            .fromJson(response, QuoteOptionPlanComparisonDto[].class);

        assertThat(resultList).hasSize(3);

        for (QuoteOptionPlanComparisonDto comp : resultList) {
            assertThat(comp.getPlans())
                .hasSize(5); // 4 client plans + 1 row for comparing planHsa3 and planHsa2

            // check for HSA fund and Adm fees present
            Set<String> hsaPlans = Sets.newHashSet(
                planHsa1.getPnn().getName(),
                planHsa2.getPnn().getName(),
                planHsa3.getPnn().getName());
            if (!comp.getName().equals(Constants.CURRENT_NAME)) {
                for (PlanByNetwork pbn : comp.getPlans()) {
                    if (pbn.networkPlan == null) {
                        continue;
                    }
                    if (hsaPlans.contains(pbn.networkPlan.getName())) {
                        assertThat(pbn.networkPlan.getAdministrativeFee()).isNotNull();
                        assertThat(pbn.networkPlan.getEmployerFund()).isNotNull();
                    } else {
                        assertThat(pbn.networkPlan.getAdministrativeFee()).isNull();
                        assertThat(pbn.networkPlan.getEmployerFund()).isNull();
                    }
                }
            }

            if (comp.getName().equals(Constants.CURRENT_NAME)) {
                // current option has no rfpQuoteOptionId
                assertThat(comp.getRfpQuoteOptionId()).isNull();
                assertThat(comp.getCarrier()).isEqualTo(Constants.MULTIPLE_CARRIER_DISPLAY_NAME);
                // has 1 empty plan for planHsa3 and planHsa2 (no client plans linked to these plans)
                assertThat(comp.getPlans().get(4).networkName).isNull();
                assertThat(comp.getPlans().get(4).networkPlan).isNull();
                // has four not empty plan for clientPlanHmo1, clientPlanHmo2, clientPlanHsa and clientPlanPpo
                assertThat(comp.getPlans().get(0).networkName)
                    .isEqualTo(clientPlanHmo1.getPnn().getName());
                assertThat(comp.getPlans().get(0).networkPlan.getName())
                    .isEqualTo(clientPlanHmo1.getPnn().getName());
                assertThat(comp.getPlans().get(0).networkPlan.getRx()).isNotEmpty();
                assertThat(comp.getPlans().get(1).networkName)
                    .isEqualTo(clientPlanHmo2.getPnn().getName());
                assertThat(comp.getPlans().get(1).networkPlan.getName())
                    .isEqualTo(clientPlanHmo2.getPnn().getName());
                assertThat(comp.getPlans().get(1).networkPlan.getRx()).isNotEmpty();
                assertThat(comp.getPlans().get(2).networkName)
                    .isEqualTo(clientPlanHsa.getPnn().getName());
                assertThat(comp.getPlans().get(2).networkPlan.getName())
                    .isEqualTo(clientPlanHsa.getPnn().getName());
                assertThat(comp.getPlans().get(3).networkName)
                    .isEqualTo(clientPlanPpo.getPnn().getName());
                assertThat(comp.getPlans().get(3).networkPlan.getName())
                    .isEqualTo(clientPlanPpo.getPnn().getName());
            } else {
                assertThat(comp.getRfpQuoteOptionId()).isNotNull();
                if (comp.getName().equals(rqo.getRfpQuoteOptionName())) {
                    // has three not empty plan for clientPlanHmo1, clientPlanHmo2 and clientPlanPpo
                    assertThat(comp.getPlans().get(0).networkName)
                        .isEqualTo(clientPlanHmo1.getPnn().getName());
                    assertThat(comp.getPlans().get(0).networkPlan.getName())
                        .isEqualTo(planHmo1.getPnn().getName());
                    assertThat(comp.getPlans().get(0).networkPlan.getRx()).isNotEmpty();
                    assertThat(comp.getPlans().get(1).networkName)
                        .isEqualTo(clientPlanHmo2.getPnn().getName());
                    assertThat(comp.getPlans().get(1).networkPlan.getName())
                        .isEqualTo(planHmo2.getPnn().getName());
                    assertThat(comp.getPlans().get(1).networkPlan.getRx()).isNotEmpty();
                    assertThat(comp.getPlans().get(3).networkName)
                        .isEqualTo(clientPlanPpo.getPnn().getName());
                    assertThat(comp.getPlans().get(3).networkPlan.getName())
                        .isEqualTo(planPpo.getPnn().getName());
                    // not empty planHsa3 compared with empty client plan
                    assertThat(comp.getPlans().get(4).networkName)
                        .isEqualTo(planHsa3.getRfpQuoteNetwork().getNetwork().getName());
                    assertThat(comp.getPlans().get(4).networkPlan.getName())
                        .isEqualTo(planHsa3.getPnn().getName());
                    // empty clientPlanHsa
                    assertThat(comp.getPlans().get(2).networkName).isNull();
                    assertThat(comp.getPlans().get(2).networkPlan).isNull();
                } else if (comp.getName().equals(rqo2.getRfpQuoteOptionName())) {
                    // has two not empty plan for clientPlanHsa and clientPlanPpo
                    assertThat(comp.getPlans().get(2).networkName)
                        .isEqualTo(clientPlanHsa.getPnn().getName());
                    assertThat(comp.getPlans().get(2).networkPlan.getName())
                        .isEqualTo(planHsa1.getPnn().getName());
                    assertThat(comp.getPlans().get(3).networkName)
                        .isEqualTo(clientPlanPpo.getPnn().getName());
                    assertThat(comp.getPlans().get(3).networkPlan.getName())
                        .isEqualTo(planPpo.getPnn().getName());
                    // not empty planHsa2 compared with empty client plan
                    assertThat(comp.getPlans().get(4).networkName)
                        .isEqualTo(planHsa2.getRfpQuoteNetwork().getNetwork().getName());
                    assertThat(comp.getPlans().get(4).networkPlan.getName())
                        .isEqualTo(planHsa2.getPnn().getName());
                    // empty clientPlanHmo1 and clientPlanHmo2
                    assertThat(comp.getPlans().get(0).networkName).isNull();
                    assertThat(comp.getPlans().get(0).networkPlan).isNull();
                    assertThat(comp.getPlans().get(1).networkName).isNull();
                    assertThat(comp.getPlans().get(1).networkPlan).isNull();
                }
            }
        }

        // compare Option 1 and Option 2 only
        params = new Object[]{"ids",
            (rqo.getRfpQuoteOptionId().toString() + "," + rqo2.getRfpQuoteOptionId())};
        // currentOptionCompare = false by default
        response = performGet("/v1/quotes/options/compare", params);
        resultList = gson.fromJson(response, QuoteOptionPlanComparisonDto[].class);

        assertThat(resultList).hasSize(2);

        for (QuoteOptionPlanComparisonDto comp : resultList) {
            assertThat(comp.getPlans()).hasSize(5);
        }

//		byte[] bytes = performGetAsBytes("/v1/quotes/options/compare/file", params);
//		File xlsx = new File("compareOptions.xlsx");
//		org.apache.commons.io.FileUtils.writeByteArrayToFile(xlsx, bytes);
    }

    @Test
    public void compareRfpQuoteOptionsWithKaiser() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        ClientPlan clientPlan = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");

        RfpCarrier rfpCarrier = testEntityHelper
            .createTestRfpCarrier(clientPlan.getPnn().getNetwork().getCarrier(), Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote replaceKaiser = testEntityHelper
            .createTestRfpQuote(client, rfpSubmission, Constants.UHC_CARRIER, Constants.MEDICAL,
                QuoteType.STANDARD);
        RfpQuote withKaiser = testEntityHelper
            .createTestRfpQuote(client, rfpSubmission, Constants.UHC_CARRIER, Constants.MEDICAL,
                QuoteType.KAISER);

        RfpQuoteNetwork replaceKaiserNetwork = testEntityHelper
            .createTestQuoteNetwork(replaceKaiser, "HMO");
        RfpQuoteNetwork withKaiserNetwork = testEntityHelper
            .createTestQuoteNetwork(withKaiser, "HMO");

        RfpQuoteNetworkPlan replaceKaiserRqnp = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan", replaceKaiserNetwork, 100f, 120f,
                140f, 160f);
        RfpQuoteNetworkPlan withKaiserRqnp = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan", withKaiserNetwork, 100f, 120f, 140f,
                160f);

        RfpQuoteOption replaceKaiserRqo = testEntityHelper
            .createTestRfpQuoteOption(replaceKaiser, "Option 1");
        RfpQuoteOption withKaiserRqo = testEntityHelper
            .createTestRfpQuoteOption(withKaiser, "Option 2");

        RfpQuoteOptionNetwork replaceKaiserRqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(replaceKaiserRqo, replaceKaiserNetwork,
                replaceKaiserRqnp, clientPlan, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork withKaiserRqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(withKaiserRqo, withKaiserNetwork,
                withKaiserRqnp, clientPlan, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        Collection<String> options = mapToList(Arrays.asList(replaceKaiserRqo, withKaiserRqo),
            x -> x.getRfpQuoteOptionId().toString());
        String optionParamString = String.join(",", options);

        // compare two options
        Object[] params = new Object[]{"ids", optionParamString};
        String response = performGet("/v1/quotes/options/compare", params);
        List<QuoteOptionPlanComparisonDto> resultList = Arrays
            .asList(gson.fromJson(response, QuoteOptionPlanComparisonDto[].class));

        assertThat(resultList).hasSize(2);

        assertThat(resultList.stream().filter(
            x -> x.getQuoteType() != QuoteType.KAISER && x.getRfpQuoteOptionId()
                .equals(replaceKaiserRqo.getRfpQuoteOptionId())).count() == 1);
        assertThat(resultList.stream().filter(
            x -> x.getQuoteType() == QuoteType.KAISER && x.getRfpQuoteOptionId()
                .equals(withKaiserRqo.getRfpQuoteOptionId())).count() == 1);
    }

    @Test
    public void compareRfpQuoteOptionsWithSameNamePlans() throws Exception {
        
        String SAME_NAME_PLAN = "Same name plan";
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        ClientPlan clientPlanHmo = testEntityHelper
            .createTestClientPlan(SAME_NAME_PLAN, client, "BLUE_SHIELD", "HMO");
        
        ClientPlan clientPlanHmo2 = testEntityHelper
            .createTestClientPlan(SAME_NAME_PLAN, client, "BLUE_SHIELD", "HMO");

        ClientPlan clientPlanPpo = testEntityHelper
                .createTestClientPlan(SAME_NAME_PLAN, client, "BLUE_SHIELD", "PPO");

        RfpCarrier rfpCarrier = testEntityHelper
            .createTestRfpCarrier(clientPlanHmo.getPnn().getNetwork().getCarrier(), Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, rfpSubmission, Constants.UHC_CARRIER, Constants.MEDICAL,
                QuoteType.STANDARD);

        RfpQuoteNetwork hmoNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, "HMO");

        RfpQuoteNetwork ppoNetwork = testEntityHelper
                .createTestQuoteNetwork(rfpQuote, "PPO");

        RfpQuoteNetworkPlan hmoRqnp = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan", hmoNetwork, 100f, 120f,
                140f, 160f);
        RfpQuoteNetworkPlan ppoRqnp = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan", ppoNetwork, 100f, 120f, 140f,
                160f);

        RfpQuoteOption rqo = testEntityHelper
            .createTestRfpQuoteOption(rfpQuote, "Option 1");

        RfpQuoteOptionNetwork hmoRqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, hmoNetwork,
                hmoRqnp, clientPlanHmo, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork hmoRqon2 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, hmoNetwork,
                hmoRqnp, clientPlanHmo2, 14L, 19L, 24L, 29L, "PERCENT", 95f, 95f, 95f, 95f);
        RfpQuoteOptionNetwork ppoRqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, ppoNetwork,
                ppoRqnp, clientPlanPpo, 12L, 17L, 22L, 27L, "PERCENT", 92f, 92f, 92f, 92f);

        flushAndClear();

        // compare current and option1
        Object[] params = new Object[]{
                "ids", rqo.getRfpQuoteOptionId(),
                "currentOptionCompare", true};
        
        String response = performGet("/v1/quotes/options/compare", params);
        
        List<QuoteOptionPlanComparisonDto> resultList = Arrays
            .asList(gson.fromJson(response, QuoteOptionPlanComparisonDto[].class));

        assertThat(resultList).hasSize(2);

        for (QuoteOptionPlanComparisonDto comp : resultList) {
            assertThat(comp.getPlans()).hasSize(3); 
            assertThat(comp.getPlans()).extracting("networkName").containsExactlyInAnyOrder(
                    "(1) " + clientPlanHmo.getPnn().getName(),
                    "(2) " + clientPlanHmo.getPnn().getName(),
                    clientPlanPpo.getPnn().getName());
            assertThat(comp.getPlans()).extracting("networkType").containsExactlyInAnyOrder("PPO","HMO","HMO");

            if (comp.getName().equals(Constants.CURRENT_NAME)) {
                // current option has no rfpQuoteOptionId
                assertThat(comp.getRfpQuoteOptionId()).isNull();
            } else {
                assertThat(comp.getRfpQuoteOptionId()).isNotNull();
            }
        }
    }

    @Test
    public void compareRfpQuoteOptionsWithSameNetworks() throws Exception {
        
        final String SAME_NAME_PLAN = "Same name plan";
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        Carrier carrier = carrierRepository.findByName("BLUE_SHIELD");
        
        RfpCarrier rfpCarrier = testEntityHelper
            .createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, rfpSubmission, Constants.UHC_CARRIER, Constants.MEDICAL,
                QuoteType.STANDARD);

        RfpQuoteNetwork hmoNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, "HMO network", "HMO");

        RfpQuoteNetwork ppoNetwork = testEntityHelper
                .createTestQuoteNetwork(rfpQuote, "PPO network", "PPO");

        
        RfpQuoteOption rqo1 = testEntityHelper
            .createTestRfpQuoteOption(rfpQuote, "Option 1");

        RfpQuoteNetworkPlan hmoRqnp1_1 = testEntityHelper
                .createTestRfpQuoteNetworkPlan("test quote plan 1 1", hmoNetwork, 100f, 120f,
                    140f, 160f);

        RfpQuoteNetworkPlan hmoRqnp1_2 = testEntityHelper
                .createTestRfpQuoteNetworkPlan("test quote plan 1 2", hmoNetwork, 100f, 120f,
                    140f, 160f);

        RfpQuoteNetworkPlan ppoRqnp1 = testEntityHelper
                .createTestRfpQuoteNetworkPlan("test quote plan 1", ppoNetwork, 100f, 120f,
                    140f, 160f);

        RfpQuoteOptionNetwork hmoRqon1_1 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo1, hmoNetwork,
                hmoRqnp1_1, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork hmoRqon1_2 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo1, hmoNetwork,
                hmoRqnp1_2, null, 14L, 19L, 24L, 29L, "PERCENT", 95f, 95f, 95f, 95f);
        RfpQuoteOptionNetwork ppoRqon1 = testEntityHelper
                .createTestRfpQuoteOptionNetwork(rqo1, ppoNetwork,
                    ppoRqnp1, null, 14L, 19L, 24L, 29L, "PERCENT", 95f, 95f, 95f, 95f);
        
        RfpQuoteOption rqo2 = testEntityHelper
                .createTestRfpQuoteOption(rfpQuote, "Option 2");

        RfpQuoteNetworkPlan hmoRqnp2_1 = testEntityHelper
                .createTestRfpQuoteNetworkPlan("test quote plan 2 1", hmoNetwork, 100f, 120f,
                    140f, 160f);

        RfpQuoteNetworkPlan hmoRqnp2_2 = testEntityHelper
                .createTestRfpQuoteNetworkPlan("test quote plan 2 2", hmoNetwork, 100f, 120f,
                    140f, 160f);

        RfpQuoteNetworkPlan ppoRqnp2 = testEntityHelper
                .createTestRfpQuoteNetworkPlan("test quote plan 2", ppoNetwork, 100f, 120f,
                    140f, 160f);

        RfpQuoteOptionNetwork hmoRqon2_1 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo2, hmoNetwork,
                hmoRqnp2_1, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork hmoRqon2_2 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo2, hmoNetwork,
                hmoRqnp2_2, null, 14L, 19L, 24L, 29L, "PERCENT", 95f, 95f, 95f, 95f);
        RfpQuoteOptionNetwork ppoRqon2 = testEntityHelper
                .createTestRfpQuoteOptionNetwork(rqo2, ppoNetwork,
                    ppoRqnp2, null, 14L, 19L, 24L, 29L, "PERCENT", 95f, 95f, 95f, 95f);

        flushAndClear();

        // compare option1 and option2
        Object[] params = new Object[]{
                "ids", rqo1.getRfpQuoteOptionId() + "," + rqo2.getRfpQuoteOptionId(),
                "currentOptionCompare", false};
        
        String response = performGet("/v1/quotes/options/compare", params);
        
        QuoteOptionPlanComparisonDto[] result = gson.fromJson(response, QuoteOptionPlanComparisonDto[].class);

            assertThat(result).hasSize(2);

            for (QuoteOptionPlanComparisonDto comp : result) {
                assertThat(comp.getPlans()).hasSize(3); 
                assertThat(comp.getPlans()).extracting("networkName").containsExactlyInAnyOrder(
                        "(1) " + hmoNetwork.getNetwork().getName(),
                        "(2) " + hmoNetwork.getNetwork().getName(),
                        ppoNetwork.getNetwork().getName());
                assertThat(comp.getPlans()).extracting("networkType").containsExactlyInAnyOrder("HMO","HMO","PPO");
            }

    }

    
    @Test
    public void getRfpQuoteOptionContributions() throws Exception {
        Client client = testEntityHelper.createTestClient();
        ClientPlan clientPlan = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan selectedPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test selected plan", rqn, 100f, 120f, 140f, 160f);
        selectedPlan.getPnn().getNetwork().setType("HSA");
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqonFull = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, selectedPlan, clientPlan, 10L, 15L, 20L, 25L,
                "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqonClientPlanOnly = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, null, clientPlan, 10L, 15L, 20L, 25L,
                "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqonSelectedPlanOnly = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, selectedPlan, null, 10L, 15L, 20L, 25L,
                "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqonEmpty = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, null, null, 10L, 15L, 20L, 25L, "PERCENT",
                90f, 90f, 90f, 90f);

        flushAndClear();
        token = createToken(client.getBroker().getBrokerToken());
        String resp = performGet("/v1/quotes/options/contributions",
            new Object[]{"rfpQuoteOptionId", rqo.getRfpQuoteOptionId()});

        QuoteOptionContributionsDto[] resultList = gson
            .fromJson(resp, QuoteOptionContributionsDto[].class);
        assertThat(resultList).hasSize(4);
        for (QuoteOptionContributionsDto contr : resultList) {
            assertThat(contr.getContributions()).hasSize(4);
            if (contr.getRfpQuoteOptionNetworkId().equals(rqonFull.getRfpQuoteOptionNetworkId())) {
                assertThat(contr).hasNoNullFieldsOrPropertiesExcept("discountType");
            } else if (contr.getRfpQuoteOptionNetworkId()
                .equals(rqonClientPlanOnly.getRfpQuoteOptionNetworkId())) {
                assertThat(contr)
                    .hasNoNullFieldsOrPropertiesExcept("proposedERTotal", "proposedEETotal",
                        "fundEETotal", "proposedERTotalCost", "changeProposedERCost",
                        "changeProposedEECost", "discountType");
            } else if (contr.getRfpQuoteOptionNetworkId()
                .equals(rqonSelectedPlanOnly.getRfpQuoteOptionNetworkId())) {
                assertThat(contr)
                    .hasNoNullFieldsOrPropertiesExcept("currentContrFormat", "currentERTotal",
                        "currentERTotalCost", "changeProposedERCost", "changeProposedEECost",
                        "currentPlan", "currentEnrollmentTotal", "discountType");
            } else if (contr.getRfpQuoteOptionNetworkId()
                .equals(rqonEmpty.getRfpQuoteOptionNetworkId())) {
                assertThat(contr.getProposedContrFormat()).isNotBlank();
                assertThat(contr.getRfpQuoteOptionNetworkId()).isNotNull();
            }
        }

        // change format to DOLLAR and recalculate from PERCENT to DOLLAR
        clientPlan.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        clientPlan.setTier1ErContribution(
            clientPlan.getTier1ErContribution() * clientPlan.getTier1Rate() / 100f);
        clientPlan.setTier2ErContribution(
            clientPlan.getTier2ErContribution() * clientPlan.getTier2Rate() / 100f);
        clientPlan.setTier3ErContribution(
            clientPlan.getTier3ErContribution() * clientPlan.getTier3Rate() / 100f);
        clientPlan.setTier4ErContribution(
            clientPlan.getTier4ErContribution() * clientPlan.getTier4Rate() / 100f);
        clientPlanRepository.save(clientPlan);

        // request with new data
        String resp2 = performGet("/v1/quotes/options/contributions",
            new Object[]{"rfpQuoteOptionId", rqo.getRfpQuoteOptionId()});

        QuoteOptionContributionsDto[] resultList2 = gson
            .fromJson(resp2, QuoteOptionContributionsDto[].class);
        assertThat(resultList2).hasSize(4);

        // check if contributions in both requests are equal
        assertThat(resultList[0].getContributions().get(0).getCurrentER())
            .isEqualTo(resultList2[0].getContributions().get(0).getCurrentER());
        assertThat(resultList[0].getContributions().get(1).getCurrentER())
            .isEqualTo(resultList2[0].getContributions().get(1).getCurrentER());
        assertThat(resultList[0].getContributions().get(2).getCurrentER())
            .isEqualTo(resultList2[0].getContributions().get(2).getCurrentER());
        assertThat(resultList[0].getContributions().get(3).getCurrentER())
            .isEqualTo(resultList2[0].getContributions().get(3).getCurrentER());

    }

    @Test
    public void updateRfpQuoteOptionContributions() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        ClientPlan clientPlan = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan selectedPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test selected plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, selectedPlan, clientPlan, 10L, 15L, 20L, 25L,
                "DOLLAR", 90f, 108f, 126f, 144f);

        flushAndClear();

        UpdateContributionsDto contr = new UpdateContributionsDto();
        contr.setRfpQuoteOptionNetworkId(rqon.getRfpQuoteOptionNetworkId());
        contr.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_PERCENT);
        List<UpdateContributionsDto> params = Collections.singletonList(contr);

        // check contribution format change
        String result = performPut("/v1/quotes/options/contributions", params);

        flushAndClear();

        RfpQuoteOptionNetwork updated = rfpQuoteOptionNetworkRepository
            .findOne(rqon.getRfpQuoteOptionNetworkId());
        assertThat(updated.getErContributionFormat())
            .isEqualTo(Constants.ER_CONTRIBUTION_FORMAT_PERCENT);
        assertThat(updated.getTier1ErContribution()).isEqualTo(90f);
        assertThat(updated.getTier2ErContribution()).isEqualTo(90f);
        assertThat(updated.getTier3ErContribution()).isEqualTo(90f);
        assertThat(updated.getTier4ErContribution()).isEqualTo(90f);

        // back to DOLLAR
        contr.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        result = performPut("/v1/quotes/options/contributions", params);

        flushAndClear();

        updated = rfpQuoteOptionNetworkRepository.findOne(rqon.getRfpQuoteOptionNetworkId());
        assertThat(updated.getErContributionFormat())
            .isEqualTo(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        assertThat(updated.getTier1ErContribution()).isEqualTo(selectedPlan.getTier1Rate() * 0.9f);
        assertThat(updated.getTier2ErContribution()).isEqualTo(selectedPlan.getTier2Rate() * 0.9f);
        assertThat(updated.getTier3ErContribution()).isEqualTo(selectedPlan.getTier3Rate() * 0.9f);
        assertThat(updated.getTier4ErContribution()).isEqualTo(selectedPlan.getTier4Rate() * 0.9f);

        // change other valuest
        contr.setTier1Enrollment(1L);
        contr.setTier2Enrollment(2L);
        contr.setTier3Enrollment(3L);
        contr.setTier1ErContribution(5f);
        contr.setTier2ErContribution(6f);
        contr.setTier3ErContribution(7f);
        contr.setTier1EeFund(9f);
        contr.setTier2EeFund(10f);
        contr.setTier3EeFund(11f);
        // tier4 values will should have default values: 0.0f

        result = performPut("/v1/quotes/options/contributions", params);

        flushAndClear();

        updated = rfpQuoteOptionNetworkRepository.findOne(rqon.getRfpQuoteOptionNetworkId());
        assertThat(updated.getErContributionFormat()).isEqualTo(contr.getErContributionFormat());
        assertThat(updated.getTier1Census()).isEqualTo(contr.getTier1Enrollment());
        assertThat(updated.getTier1ErContribution()).isEqualTo(contr.getTier1ErContribution());
        assertThat(updated.getTier1EeFund()).isEqualTo(contr.getTier1EeFund());
        assertThat(updated.getTier4Census()).isEqualTo(0L);
        assertThat(updated.getTier4ErContribution()).isEqualTo(0f);
        assertThat(updated.getTier4EeFund()).isEqualTo(0f);
    }
    
    @Test
    public void createRfpQuoteOption_Renewal_N() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
        RfpQuoteOption option = testEntityHelper
            .createTestRfpQuoteOption(rfpQuote, "Renewal 1");
        
        CreateRfpQuoteOptionDto params = new CreateRfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setRfpCarrierId(rfpQuote.getRfpSubmission().getRfpCarrier().getRfpCarrierId());
        params.setOptionType(OptionType.RENEWAL);

        String result = performPost("/v1/quotes/options/create", params);

        QuoteOptionDetailsDto quoteOption2Dto = gson.fromJson(result, QuoteOptionDetailsDto.class);
        assertThat(quoteOption2Dto.getName()).isEqualTo("Renewal 2");
    }
    
    @Test
    public void createRfpQuoteOption_RenewalCopyFromTemplare() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        testEntityHelper.createTestClientAttribute(client, AttributeName.RENEWAL);
        
        ClientPlan cpHmo1 = testEntityHelper
            .createTestClientPlan("hmo 1 client plan", client, appCarrier[0], "HMO");
        ClientPlan cpHmo2 = testEntityHelper
            .createTestClientPlan("hmo 2 client plan", client, appCarrier[0], "HMO");
        ClientPlan cpPpo = testEntityHelper
            .createTestClientPlan("ppo client plan", client, appCarrier[0], "PPO");
        
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL);
        
        RfpQuoteOption option = testEntityHelper
            .createTestRfpQuoteOption(rfpQuote, "Renewal 1");
        
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();
        
        Network hmoNetw1 = testEntityHelper.createTestNetwork(carrier, "HMO", "HMO 1");
        RfpQuoteNetwork rqnhmo1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, hmoNetw1);
        Network hmoNetw2 = testEntityHelper.createTestNetwork(carrier, "HMO", "HMO 2");
        RfpQuoteNetwork rqnhmo2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, hmoNetw2);
        Network ppoNetw = testEntityHelper.createTestNetwork(carrier, "PPO", "PPO 1");
        RfpQuoteNetwork rqnppo1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, ppoNetw);
        
        RfpQuoteNetworkPlan planhmo1 = testEntityHelper.createTestRfpQuoteNetworkPlan(
            "test hmo 1 plan", rqnhmo1, 100f, 120f, 140f, 160f);
        RfpQuoteNetworkPlan planhmo2 = testEntityHelper.createTestRfpQuoteNetworkPlan(
            "test hmo 2 plan", rqnhmo2, 100f, 120f, 140f, 160f);
        RfpQuoteNetworkPlan planppo1 = testEntityHelper.createTestRfpQuoteNetworkPlan(
            "test ppo 1 plan", rqnppo1, 100f, 120f, 140f, 160f);
        
        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(option, rqnhmo1,
            planhmo1, cpHmo1, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(option, rqnhmo2,
            planhmo2, cpHmo2, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        RfpQuoteOptionNetwork rqon3 = testEntityHelper.createTestRfpQuoteOptionNetwork(option, rqnppo1,
            planppo1, cpPpo, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        CreateRfpQuoteOptionDto params = new CreateRfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setRfpCarrierId(rfpQuote.getRfpSubmission().getRfpCarrier().getRfpCarrierId());
        params.setOptionType(OptionType.RENEWAL);

        flushAndClear();
        
        String result = performPost("/v1/quotes/options/create", params);

        QuoteOptionDetailsDto quoteOption2Dto = gson.fromJson(result, QuoteOptionDetailsDto.class);
        assertThat(quoteOption2Dto.getName()).isEqualTo("Renewal 2");
        
        RfpQuoteOption optionCopy = rfpQuoteOptionRepository.findOne(quoteOption2Dto.getId());
        assertThat(optionCopy).isNotNull();
        // the same Quote Networks
        assertThat(optionCopy.getRfpQuoteOptionNetworks())
            .extracting(rqon -> rqon.getRfpQuoteNetwork().getRfpQuoteNetworkId())
            .containsExactlyInAnyOrder(rqnhmo1.getRfpQuoteNetworkId(), rqnhmo2.getRfpQuoteNetworkId(), rqnppo1.getRfpQuoteNetworkId());
        // the same client plans 
        assertThat(optionCopy.getRfpQuoteOptionNetworks())
            .extracting(rqon -> rqon.getClientPlan().getClientPlanId())
            .containsExactlyInAnyOrder(cpHmo1.getClientPlanId(), cpHmo2.getClientPlanId(), cpPpo.getClientPlanId());
        // the same client plans 
        assertThat(optionCopy.getRfpQuoteOptionNetworks())
            .extracting(p -> p.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId())
            .containsExactlyInAnyOrder(planhmo1.getRfpQuoteNetworkPlanId(), planhmo2.getRfpQuoteNetworkPlanId(), planppo1.getRfpQuoteNetworkPlanId());
    }
    
    @Test
    public void createRfpQuoteOptionRenewal() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, CarrierType.UHC.name(), Constants.MEDICAL);

        flushAndClear();

        CreateRfpQuoteOptionDto params = new CreateRfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setRfpCarrierId(rfpQuote.getRfpSubmission().getRfpCarrier().getRfpCarrierId());
        params.setOptionType(OptionType.RENEWAL);

        String result = performPost("/v1/quotes/options/create", params);

        QuoteOptionDetailsDto quoteOption2Dto = gson.fromJson(result, QuoteOptionDetailsDto.class);
        assertThat(quoteOption2Dto.getName()).isEqualTo("Renewal");

        // check for related Activity creaed
        Activity renewalActivity = activityRepository
            .findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(
                client.getClientId(), ActivityType.RENEWAL_ADDED, null, Constants.MEDICAL, null);
        assertThat(renewalActivity).isNotNull();
        assertThat(renewalActivity.getValue()).isNull();
        assertThat(renewalActivity.getNotes()).isEqualTo("Renewal rates have been entered by FirstName LastName");

        // check for Activity value updated after recalculation in getOptions
        result =  performGet("/v1/quotes/options", 
            new Object[] {"category", Constants.MEDICAL, "clientId", client.getClientId()});
        QuoteOptionListDto quoteOptionListDto = gson.fromJson(result, QuoteOptionListDto.class);
        QuoteOptionBriefDto renewalOption = quoteOptionListDto.getOptions().stream()
            .filter(o -> o.getName().equals("Renewal")).findFirst().orElse(null);
        assertThat(renewalOption).isNotNull();
        assertThat(renewalOption.getPercentDifference()).isNotNull();
        
        renewalActivity = activityRepository.findOne(renewalActivity.getActivityId());
        assertThat(renewalActivity.getValue()).isEqualTo(Float.toString(renewalOption.getPercentDifference()));   
    }

    @Test
    public void testCreateKaiserOptionWhenKaiserQuoteDoesNotExist() throws Exception {
        //1 create client
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        //2 create create client plan and rfp
        ClientPlan clientPlan = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");

        // 3 create rfp carrier and rfp submission which are the same for both quotes
        RfpCarrier rfpCarrier = testEntityHelper
            .createTestRfpCarrier(clientPlan.getPnn().getNetwork().getCarrier(), Constants.MEDICAL);

        //3 create rfp quotes
        RfpQuote replaceKaiser = testEntityHelper
            .createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL);

        //4 rfp quote networks
        RfpQuoteNetwork replaceKaiserNetwork = testEntityHelper
            .createTestQuoteNetwork(replaceKaiser, "HMO");

        //5 rfp quote network plans
        RfpQuoteNetworkPlan replaceKaiserRqnp = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan", replaceKaiserNetwork, 100f, 120f,
                140f, 160f);

        //6 rfp quote options
        RfpQuoteOption replaceKaiserRqo = testEntityHelper
            .createTestRfpQuoteOption(replaceKaiser, "Option 1");

        //7 rfp quote option networks
        RfpQuoteOptionNetwork replaceKaiserRqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(replaceKaiserRqo, replaceKaiserNetwork,
                replaceKaiserRqnp, clientPlan, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        CreateRfpQuoteOptionDto params = new CreateRfpQuoteOptionDto();
        params.setClientId(client.getClientId());
        params.setRfpCarrierId(rfpCarrier.getRfpCarrierId());
        params.setQuoteType(QuoteType.KAISER);

        String result = performPost(HttpStatus.INTERNAL_SERVER_ERROR, "/v1/quotes/options/create",
            params);
        RestMessageDto resp = gson.fromJson(result, RestMessageDto.class);
        assertThat(resp.isClientMessage()).isTrue();
        assertThat(resp.getMessage()).isEqualTo("No quote found for carrier/client");
    }

    @Test
    public void updateRfpQuoteOptionDisplayName() throws Exception {
        Client client = testEntityHelper.createTestClient();
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 1");

        flushAndClear();

        QuoteOptionDto params = new QuoteOptionDto();
        params.setDisplayName("Sample Benrevo Option");
        params.setRfpQuoteOptionId(rqo.getRfpQuoteOptionId());

        token = createToken(client.getBroker().getBrokerToken());
        String result = performPut("/v1/quotes/options/update", params);

        RestMessageDto dto = gson.fromJson(result, RestMessageDto.class);
        assertThat(dto.isSuccess()).isTrue();

        flushAndClear();
        assertThat(rfpQuoteOptionRepository.findOne(rqo.getRfpQuoteOptionId()).getDisplayName()).isEqualToIgnoringCase(params.getDisplayName());
    }
    
    @Test
    public void updateRfpQuoteAncillaryOptionDisplayName() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), 
            Constants.STD);
        RfpQuoteAncillaryOption option = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", rfpQuote);
        
        QuoteOptionDto params = new QuoteOptionDto();
        params.setDisplayName("Sample Benrevo Option");
        params.setRfpQuoteAncillaryOptionId(option.getRfpQuoteAncillaryOptionId());

        String result = performPut("/v1/quotes/options/update", params);

        flushAndClear();
        
        RfpQuoteAncillaryOption updatedOption = rfpQuoteAncillaryOptionRepository.findOne(option.getRfpQuoteAncillaryOptionId());
        assertThat(updatedOption.getDisplayName()).isEqualTo(params.getDisplayName());
    }

    @Test
    public void deleteRfpQuoteOption() throws Exception {
        Client client = testEntityHelper.createTestClient();
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 1");

        flushAndClear();

        DeleteRfpQuoteOptionDto params = new DeleteRfpQuoteOptionDto(rqo.getRfpQuoteOptionId());

        token = createToken(client.getBroker().getBrokerToken());
        String result = performDelete("/v1/quotes/options/delete", params);

        RestMessageDto dto = gson.fromJson(result, RestMessageDto.class);
        assertThat(dto.isSuccess()).isTrue();

        flushAndClear();
        // check for option was removed from db
        assertThat(rfpQuoteOptionRepository.findOne(rqo.getRfpQuoteOptionId())).isNull();
    }
    
    @Test
    public void deleteAncillaryRfpQuoteOption() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.VOYA.name(), CarrierType.VOYA.displayName);
        AncillaryPlan ancillaryPlan1 = testEntityHelper.createTestAncillaryPlan("STD Plan",
            PlanCategory.STD, AncillaryPlanType.BASIC, carrier);
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.VOYA.name(), 
            Constants.STD);
        RfpQuoteAncillaryPlan selected = testEntityHelper.createTestRfpQuoteAncillaryPlan(rfpQuote, ancillaryPlan1);
        RfpQuoteAncillaryOption option = testEntityHelper.createTestRfpQuoteAncillaryOption("Option 1", selected);
        
        
        PresentationOption presentOption = new PresentationOption();
        presentOption.setClient(client);
        presentOption.setName("name");
        presentOption.setStdRfpQuoteAncillaryOption(option);
        
        presentOption = presentationOptionRepository.save(presentOption);

        flushAndClear();
        
        DeleteRfpQuoteAncillaryOptionDto params = new DeleteRfpQuoteAncillaryOptionDto(option.getRfpQuoteAncillaryOptionId());

        String result = performDelete(HttpStatus.INTERNAL_SERVER_ERROR, "/v1/quotes/options/ancillary/delete", params);

        RestMessageDto dto = gson.fromJson(result, RestMessageDto.class);

        assertThat(dto.getMessage()).isEqualTo("Option you want to delete is being used in the set up presentation page. Please remove it there first");
        assertThat(dto.isClientMessage()).isTrue();
        assertThat(dto.isSuccess()).isFalse();
        
        presentationOptionRepository.delete(presentOption);

        flushAndClear();
        
        result = performDelete("/v1/quotes/options/ancillary/delete", params);
        dto = gson.fromJson(result, RestMessageDto.class);
        
        assertThat(dto.isSuccess()).isTrue();

//        flushAndClear();
        
        // check for option was removed from db
        assertThat(rfpQuoteAncillaryOptionRepository.exists(option.getRfpQuoteAncillaryOptionId())).isFalse();
    }

    @Test
    public void updateQuoteOptionNetwork_CreateByNetworkId() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
      
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();
        
        Network hmoNetwork = testEntityHelper.createTestNetwork(carrier, "HMO");
        RfpQuoteNetwork hmoQuoteNetwork = testEntityHelper.createTestQuoteNetwork(rfpQuote, hmoNetwork);

        Network ppoNetwork = testEntityHelper.createTestNetwork(carrier, "PPO");
        RfpQuoteNetwork ppoQuoteNetwork = testEntityHelper.createTestQuoteNetwork(rfpQuote, ppoNetwork);
        
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, hmoQuoteNetwork, null, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        flushAndClear();

        // change quote network: lookup from existing quote networks

        UpdateRfpQuoteOptionNetworkDto params = new UpdateRfpQuoteOptionNetworkDto();
        params.setRfpQuoteOptionNetworkId(rqon.getRfpQuoteOptionNetworkId());
        params.setNetworkId(ppoNetwork.getNetworkId());
        performPut("/v1/quotes/options/{id}/changeNetwork", params, rqo.getRfpQuoteOptionId());

        flushAndClear();

        RfpQuoteOptionNetwork optionNetwork = rfpQuoteOptionNetworkRepository.findOne(rqon.getRfpQuoteOptionNetworkId());
        
        assertThat(optionNetwork).isNotNull();
        assertThat(optionNetwork.getRfpQuoteNetwork()).isNotNull();
        assertThat(optionNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId())
            .isEqualTo(ppoQuoteNetwork.getRfpQuoteNetworkId());
        assertThat(optionNetwork.getRfpQuoteNetwork().getRfpQuote().getRfpQuoteNetworks()).hasSize(2);

        // change quote network: create new quote network
        
        Network hsaNetwork = testEntityHelper.createTestNetwork(carrier, "HSA");
        params.setNetworkId(hsaNetwork.getNetworkId());
        
        performPut("/v1/quotes/options/{id}/changeNetwork", params, rqo.getRfpQuoteOptionId());

        flushAndClear();

        optionNetwork = rfpQuoteOptionNetworkRepository.findOne(rqon.getRfpQuoteOptionNetworkId());
        
        assertThat(optionNetwork).isNotNull();
        assertThat(optionNetwork.getRfpQuoteNetwork()).isNotNull();
        assertThat(optionNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId())
            .isNotEqualTo(ppoQuoteNetwork.getRfpQuoteNetworkId());
        assertThat(optionNetwork.getRfpQuoteNetwork().getRfpQuote().getRfpQuoteNetworks()).hasSize(3);
        
    }
    
    @Test
    public void updateQuoteOptionNetwork() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        ClientPlan cp1 = testEntityHelper
            .createTestClientPlan("hmo client plan 1", client, "BLUE_SHIELD", "HMO");
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");

        RfpQuoteNetworkPlan selectedPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteNetworkPlan selectedRxPlan = testEntityHelper
            .createTestRfpQuoteNetworkRxPlan("test rx quote plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, selectedPlan, cp1, 10L, 15L, 20L, 25L,
                "PERCENT", 90f, 90f, 90f, 90f);
        rqon.setSelectedRfpQuoteNetworkRxPlan(selectedRxPlan);
        rqon = rfpQuoteOptionNetworkRepository.save(rqon);

        flushAndClear();

        // set new quote network
        RfpQuoteNetwork rqnNew = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");
        UpdateRfpQuoteOptionNetworkDto params = new UpdateRfpQuoteOptionNetworkDto(
            rqon.getRfpQuoteOptionNetworkId(), rqnNew.getRfpQuoteNetworkId());
        String result = performPut("/v1/quotes/options/{id}/changeNetwork", params,
            rqo.getRfpQuoteOptionId());

        flushAndClear();

        assertThat(result).isNotEmpty();
        Long quoteOptionNetworkId1 = Long.parseLong(result);
        RfpQuoteOptionNetwork optionNetwork = rfpQuoteOptionNetworkRepository
            .findOne(quoteOptionNetworkId1);
        assertThat(optionNetwork).isNotNull();
        assertThat(optionNetwork.getClientPlan()).isNotNull();
        assertThat(optionNetwork.getRfpQuoteNetwork()).isNotNull();
        assertThat(optionNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId())
            .isEqualTo(rqnNew.getRfpQuoteNetworkId());
    }

    @Test
    public void updateQuoteOptionNetwork_Group() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        ClientPlan cp1 = testEntityHelper
            .createTestClientPlan("hmo client plan 1", client, "BLUE_SHIELD", "HMO");
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon1 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, null, cp1, 10L, 15L, 20L, 25L, "PERCENT",
                90f, 90f, 90f, 90f);
        rqon1.setNetworkGroup("Group1");
        rqon1 = rfpQuoteOptionNetworkRepository.save(rqon1);
        RfpQuoteOptionNetwork rqon2 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, null, cp1, 10L, 15L, 20L, 25L, "PERCENT",
                90f, 90f, 90f, 90f);
        rqon2.setNetworkGroup("Group1");
        rqon2 = rfpQuoteOptionNetworkRepository.save(rqon2);

        flushAndClear();

        // set new quote network
        RfpQuoteNetwork rqnNew = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");
        UpdateRfpQuoteOptionNetworkDto params = new UpdateRfpQuoteOptionNetworkDto(
            rqon1.getRfpQuoteOptionNetworkId(), rqnNew.getRfpQuoteNetworkId());
        String result = performPut("/v1/quotes/options/{id}/changeNetwork", params,
            rqo.getRfpQuoteOptionId());

        flushAndClear();

        for (RfpQuoteOptionNetwork rqon : Arrays.asList(rqon1, rqon2)) {
            RfpQuoteOptionNetwork updatedRqon = rfpQuoteOptionNetworkRepository
                .findOne(rqon.getRfpQuoteOptionNetworkId());
            assertThat(updatedRqon.getClientPlan()).isNotNull();
            assertThat(updatedRqon.getRfpQuoteNetwork()).isNotNull();
            assertThat(updatedRqon.getRfpQuoteNetwork().getRfpQuoteNetworkId())
                .isEqualTo(rqnNew.getRfpQuoteNetworkId());
        }
    }

    @Test
    public void createRfpQuoteOptionNetwork_NoClientPlan() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        ClientPlan cp1 = testEntityHelper
            .createTestClientPlan("hmo client plan 1", client, "BLUE_SHIELD", "HMO");
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);

        Network network = testEntityHelper
            .createTestNetwork("Network 1", "HMO", testEntityHelper.createTestCarrier(
                CarrierType.SHARP_HEALTH_PLANS.name(), CarrierType.SHARP_HEALTH_PLANS.name()));

        final RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");

        flushAndClear();

        // create new option network based with default values but quote carrier != network carrier => exception
        CreateRfpQuoteOptionNetworkDto params = new CreateRfpQuoteOptionNetworkDto();
        params.setNetworkId(network.getNetworkId());
        performPost(HttpStatus.INTERNAL_SERVER_ERROR, "/v1/quotes/options/{id}/createEmptyNetwork", params,
            rqo.getRfpQuoteOptionId());

        // clean up
        rfpQuoteOptionRepository.delete(rqo.getOptionId());
        rfpQuoteNetworkRepository.delete(rfpQuoteNetworkRepository.findByRfpQuote(rfpQuote));
        rfpQuoteRepository.delete(rfpQuote.getRfpQuoteId());
        flushAndClear();

        // create the right quote now
        rfpQuote = testEntityHelper
            .createTestRfpQuote(client, CarrierType.SHARP_HEALTH_PLANS.name(), Constants.MEDICAL);
        RfpQuoteOption rqo2 = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        String result = performPost("/v1/quotes/options/{id}/createEmptyNetwork", params,
            rqo2.getRfpQuoteOptionId());

        assertThat(result).isNotEmpty();
        Long quoteOptionNetworkId1 = Long.parseLong(result);
        RfpQuoteOptionNetwork optionNetwork = rfpQuoteOptionNetworkRepository
            .findOne(quoteOptionNetworkId1);
        assertThat(optionNetwork).isNotNull();
        assertThat(optionNetwork.getRfpQuoteNetwork()).isNotNull();

    }
    @Test
    public void createRfpQuoteOptionNetwork() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        ClientPlan cp1 = testEntityHelper
            .createTestClientPlan("hmo client plan 1", client, "BLUE_SHIELD", "HMO");
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");

        RfpQuoteNetworkPlan selectedPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqonhmo = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, selectedPlan, cp1, 10L, 15L, 20L, 25L,
                "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        // create new option network based with default values
        RfpQuoteNetwork rqnNew = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");
        CreateRfpQuoteOptionNetworkDto params = new CreateRfpQuoteOptionNetworkDto(
            rqnNew.getRfpQuoteNetworkId());
        String result = performPost("/v1/quotes/options/{id}/addNetwork", params,
            rqo.getRfpQuoteOptionId());

        flushAndClear();

        assertThat(result).isNotEmpty();
        Long quoteOptionNetworkId1 = Long.parseLong(result);
        RfpQuoteOptionNetwork optionNetwork = rfpQuoteOptionNetworkRepository
            .findOne(quoteOptionNetworkId1);
        assertThat(optionNetwork).isNotNull();
        assertThat(optionNetwork.getRfpQuoteNetwork()).isNotNull();
        assertThat(optionNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId())
            .isEqualTo(rqnNew.getRfpQuoteNetworkId());

        // updates for correct HSA Employer Fund calculation
        optionNetwork.setTier1EeFund(24f);
        optionNetwork.setTier1Census(10L);
        final float expextedFund =
            optionNetwork.getTier1Census() * optionNetwork.getTier1EeFund() / 12.f;

        RfpQuoteNetwork rqnHsa = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HSA");
        RfpQuoteNetworkPlan selectedHsaPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan 2", rqnHsa, 100f, 120f, 140f, 160f);
        optionNetwork.setSelectedRfpQuoteNetworkPlan(selectedHsaPlan);
        optionNetwork = rfpQuoteOptionNetworkRepository.save(optionNetwork);

        // create new option network based on client plan
        Network network1 = testEntityHelper
            .createTestNetwork("Network 1", "HMO", rqn.getNetwork().getCarrier());
        Network network2 = testEntityHelper
            .createTestNetwork("Network 2", "HMO", rqn.getNetwork().getCarrier());
        ClientPlan cp2 = testEntityHelper
            .createTestClientPlan("hmo client plan 2", client, "BLUE_SHIELD", "HMO");
        params.setRfpQuoteNetworkId(null);
        params.setClientPlanId(cp2.getClientPlanId());
        params.setNetworkId(network1.getNetworkId());
        result = performPost("/v1/quotes/options/{id}/addNetwork", params,
            rqo.getRfpQuoteOptionId());

        flushAndClear();

        Long quoteOptionNetworkId2 = Long.parseLong(result);
        optionNetwork = rfpQuoteOptionNetworkRepository.findOne(quoteOptionNetworkId2);
        assertThat(optionNetwork).isNotNull();
        assertThat(optionNetwork.getRfpQuoteNetwork().getNetwork().getNetworkId())
            .isEqualTo(network1.getNetworkId());
        assertThat(optionNetwork.getClientPlan().getClientPlanId())
            .isEqualTo(cp2.getClientPlanId());
        assertThat(optionNetwork.getTier1Census()).isEqualTo(cp2.getTier1Census());

        // change network and update existing

        params.setNetworkId(network2.getNetworkId());
        result = performPost("/v1/quotes/options/{id}/addNetwork", params,
            rqo.getRfpQuoteOptionId());

        flushAndClear();

        Long quoteOptionNetworkId3 = Long.parseLong(result);
        assertThat(quoteOptionNetworkId3).isEqualTo(quoteOptionNetworkId2);

        optionNetwork = rfpQuoteOptionNetworkRepository.findOne(quoteOptionNetworkId3);
        assertThat(optionNetwork).isNotNull();
        assertThat(optionNetwork.getRfpQuoteNetwork().getNetwork().getNetworkId())
            .isEqualTo(network2.getNetworkId());

        // read option with added networks

        result = performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId());

        QuoteOptionDetailsDto dto = gson.fromJson(result, QuoteOptionDetailsDto.class);

        assertThat(dto.getDetailedPlans()).hasSize(3);

        for (QuoteOptionPlanDetailsDto detail : dto.getDetailedPlans()) {
            if (detail.getRfpQuoteOptionNetworkId().equals(rqonhmo.getRfpQuoteOptionNetworkId())) {
                // initial current and test plans
                assertThat(detail.getCurrentPlan().getType()).isEqualTo("HMO");
                assertThat(detail.getNewPlan().getType()).isEqualTo("HMO");
            } else if (detail.getRfpQuoteOptionNetworkId().equals(quoteOptionNetworkId1)) {
                // added network but not selected plan
                assertThat(detail.getCurrentPlan()).isNull();
                assertThat(detail.getNewPlan()).isNotNull();
                assertThat(detail.getEmployerFund()).isEqualTo(expextedFund);
            } else {
                // added network for current plan but not selected plan
                assertThat(detail.getCurrentPlan()).isNotNull();
                assertThat(detail.getNewPlan()).isNull();
            }
        }
    }

    @Test
    public void deleteRfpQuoteOptionNetwork() throws Exception {
        Client client = testEntityHelper.createTestClient();
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, null, null, 10L, 15L, 20L, 25L, "PERCENT",
                90f, 90f, 90f, 90f);

        flushAndClear();

        DeleteRfpQuoteOptionNetworkDto params = new DeleteRfpQuoteOptionNetworkDto(
            rqon.getRfpQuoteOptionNetworkId());

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc
            .perform(MockMvcRequestBuilders.delete("/v1/quotes/options/deleteNetwork")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(gson.toJson(params)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        RestMessageDto dto = gson
            .fromJson(result.getResponse().getContentAsString(), RestMessageDto.class);
        assertThat(dto.isSuccess()).isTrue();

        flushAndClear();
        // check for option was removed from db
        assertThat(rfpQuoteOptionNetworkRepository.findOne(rqon.getRfpQuoteOptionNetworkId()))
            .isNull();
    }

    @Test
    public void getQuoteOptionNetworksToAdd() throws Exception {
        Client client = testEntityHelper.createTestClient();
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL);
        Carrier kaiserCarrier = testEntityHelper
            .createTestCarrier(Constants.KAISER_CARRIER, "Kaiser");
        Network kaiserNetwork = testEntityHelper
            .createTestNetwork("Kiser network", "HMO", kaiserCarrier);
        RfpQuoteNetwork rqn1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetwork rqn2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "PPO");
        RfpQuoteNetwork rqn3 = testEntityHelper.createTestQuoteNetwork(rfpQuote, kaiserNetwork);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");

        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
            .get("/v1/quotes/options/{id}/networks", rqo.getRfpQuoteOptionId())
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
        QuoteOptionNetworkBriefDto[] dtos = gson.fromJson(result.getResponse().getContentAsString(),
            QuoteOptionNetworkBriefDto[].class);
        assertThat(dtos.length).isEqualTo(2);
        for (QuoteOptionNetworkBriefDto opt : dtos) {
            assertThat(opt).hasNoNullFieldsOrProperties();
        }
    }
    
    @Test
    public void getQuoteOptionNetworks() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
       
        RfpQuoteNetwork rqn1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "rqn1", "HMO");
        RfpQuoteNetwork rqn2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "rqn2", "PPO");
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");

        String result = performGet("/v1/quotes/options/{id}/networks/all", EMPTY, rqo.getRfpQuoteOptionId());
          
        NetworkDto[] dtos = gson.fromJson(result,NetworkDto[].class);
        assertThat(dtos).extracting(NetworkDto::getName)
            .containsExactlyInAnyOrder(rqn1.getRfpQuoteOptionName(), rqn2.getRfpQuoteOptionName());
        
    }

    @Test
    public void getQuoteOptionNetworksToChange_Group() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.ANTHEM_CARRIER, Constants.MEDICAL);
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();

        RfpQuoteNetworkCombination dualCombination1 = new RfpQuoteNetworkCombination(carrier,
            "Dual Traditional/Select", 2);
        dualCombination1 = rfpQuoteNetworkCombinationRepository.save(dualCombination1);

        RfpQuoteNetworkCombination dualCombination2 = new RfpQuoteNetworkCombination(carrier,
            "Dual Traditional/Vivity", 2);
        dualCombination2 = rfpQuoteNetworkCombinationRepository.save(dualCombination2);

        Network traditionalNetwork = testEntityHelper
            .createTestNetwork("Traditional Network", "HMO", carrier);
        Network selectNetwork = testEntityHelper
            .createTestNetwork("Select Network", "HMO", carrier);
        Network vivityHmoNetwork = testEntityHelper
            .createTestNetwork("Vivity HMO Network", "HMO", carrier);

        RfpQuoteNetwork traditionalDualQuoteNetwork1 = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, traditionalNetwork, dualCombination1);
        RfpQuoteNetwork selectDualQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, selectNetwork, dualCombination1);

        RfpQuoteNetwork traditionalDualQuoteNetwork2 = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, traditionalNetwork, dualCombination2);
        RfpQuoteNetwork vivityHmoDualQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, vivityHmoNetwork, dualCombination2);

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon2_1 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, traditionalDualQuoteNetwork1, null, null, 1L, 1L,
                1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f);
        rqon2_1.setNetworkGroup("Group1");
        rqon2_1 = rfpQuoteOptionNetworkRepository.save(rqon2_1);
        RfpQuoteOptionNetwork rqon2_2 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, traditionalDualQuoteNetwork1, null, null, 12L,
                12L, 12L, 12L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f);
        rqon2_2.setNetworkGroup("Group1");
        rqon2_2 = rfpQuoteOptionNetworkRepository.save(rqon2_2);
        RfpQuoteOptionNetwork rqon3 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, selectDualQuoteNetwork, null, null, 1L, 1L, 1L,
                1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f);

        flushAndClear();

        // Select Network can be switched to itself and Vivity Network
        Object[] params = new Object[]{"rfpQuoteNetworkId",
            selectDualQuoteNetwork.getRfpQuoteNetworkId()};
        String result = performGet("/v1/quotes/options/{id}/avaliableNetworks", params,
            rqo.getRfpQuoteOptionId());

        QuoteOptionNetworkBriefDto[] dtos = gson
            .fromJson(result, QuoteOptionNetworkBriefDto[].class);
        // 2 from dual combination (vivityHmoDualQuoteNetwork, selectDualQuoteNetwork)
        assertThat(dtos.length).isEqualTo(2);

        Set<Long> networks = Arrays.stream(dtos).map(n -> n.getId()).collect(Collectors.toSet());
        assertThat(networks).containsExactlyInAnyOrder(
            selectDualQuoteNetwork.getRfpQuoteNetworkId(),
            vivityHmoDualQuoteNetwork.getRfpQuoteNetworkId());
    }

    @Test
    public void getQuoteOptionNetworksToChange_ChangeDuplicate() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.ANTHEM_CARRIER, Constants.MEDICAL);
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();

        RfpQuoteNetworkCombination singleCombination = new RfpQuoteNetworkCombination(carrier,
            "Single (Traditional, Select)", 1);
        singleCombination = rfpQuoteNetworkCombinationRepository.save(singleCombination);

        RfpQuoteNetworkCombination dualCombination = new RfpQuoteNetworkCombination(carrier,
            "Dual Traditional/Select", 2);
        dualCombination = rfpQuoteNetworkCombinationRepository.save(dualCombination);

        Network traditionalNetwork = testEntityHelper
            .createTestNetwork("Traditional Network", "HMO", carrier);
        Network selectNetwork = testEntityHelper
            .createTestNetwork("Select Network", "HMO", carrier);
        Network aLaCarteNetwork = testEntityHelper
            .createTestNetwork("aLaCarte network", "HMO", carrier);

        RfpQuoteNetwork traditionalSingleQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, traditionalNetwork, singleCombination);
        RfpQuoteNetwork selectSingleQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, selectNetwork, singleCombination);
        RfpQuoteNetwork traditionalDualQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, traditionalNetwork, dualCombination);
        RfpQuoteNetwork selectDualQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, selectNetwork, dualCombination);
        RfpQuoteNetwork aLaCarteQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, aLaCarteNetwork);

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon1 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, aLaCarteQuoteNetwork, null, null, 1L, 1L, 1L, 1L,
                Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f);
        // duplicates
        RfpQuoteOptionNetwork rqon2 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, traditionalSingleQuoteNetwork, null, null, 1L, 1L,
                1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f);
        RfpQuoteOptionNetwork rqon3 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, traditionalSingleQuoteNetwork, null, null, 1L, 1L,
                1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f);

        flushAndClear();

        // Traditional Network can be switched to Select Network
        Object[] params = new Object[]{"rfpQuoteNetworkId",
            traditionalSingleQuoteNetwork.getRfpQuoteNetworkId()};
        String result = performGet("/v1/quotes/options/{id}/avaliableNetworks", params,
            rqo.getRfpQuoteOptionId());

        QuoteOptionNetworkBriefDto[] dtos = gson
            .fromJson(result, QuoteOptionNetworkBriefDto[].class);
        // 1 aLaCarte + 1 from dual combination (selectDualQuoteNetwork)
        assertThat(dtos.length).isEqualTo(2);

        Set<Long> networks = Arrays.stream(dtos).map(n -> n.getId()).collect(Collectors.toSet());
        assertThat(networks).containsExactlyInAnyOrder(
            aLaCarteQuoteNetwork.getRfpQuoteNetworkId(),
            selectDualQuoteNetwork.getRfpQuoteNetworkId());
    }

    @Test
    public void getQuoteOptionNetworksToChange() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.ANTHEM_CARRIER, Constants.MEDICAL);
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();

        RfpQuoteNetworkCombination dualCombination1 = new RfpQuoteNetworkCombination(carrier,
            "Dual Traditional/Select", 2);
        dualCombination1 = rfpQuoteNetworkCombinationRepository.save(dualCombination1);

        RfpQuoteNetworkCombination dualCombination2 = new RfpQuoteNetworkCombination(carrier,
            "Dual Traditional/Vivity", 2);
        dualCombination2 = rfpQuoteNetworkCombinationRepository.save(dualCombination2);

        Network traditionalNetwork = testEntityHelper
            .createTestNetwork("Traditional Network", "HMO", carrier);
        Network selectNetwork = testEntityHelper
            .createTestNetwork("Select Network", "HMO", carrier);
        Network vivityHmoNetwork = testEntityHelper
            .createTestNetwork("Vivity HMO Network", "HMO", carrier);
        Network vivityHsaNetwork = testEntityHelper
            .createTestNetwork("Vivity HSA Network", "HSA", carrier);
        Network aLaCarteNetwork = testEntityHelper
            .createTestNetwork("aLaCarte network", "HMO", carrier);

        RfpQuoteNetwork traditionalDualQuoteNetwork1 = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, traditionalNetwork, dualCombination1);
        RfpQuoteNetwork selectDualQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, selectNetwork, dualCombination1);

        RfpQuoteNetwork traditionalDualQuoteNetwork2 = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, traditionalNetwork, dualCombination2);
        RfpQuoteNetwork vivityHmoDualQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, vivityHmoNetwork, dualCombination2);
        RfpQuoteNetwork vivityHsaDualQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, vivityHsaNetwork, dualCombination2);

        RfpQuoteNetwork aLaCarteQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, aLaCarteNetwork);

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon1 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, aLaCarteQuoteNetwork, null, null, 1L, 1L, 1L, 1L,
                Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f);
        RfpQuoteOptionNetwork rqon2 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, traditionalDualQuoteNetwork1, null, null, 1L, 1L,
                1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f);
        RfpQuoteOptionNetwork rqon3 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, selectDualQuoteNetwork, null, null, 1L, 1L, 1L,
                1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f);

        flushAndClear();

        // Select Network can be switched to itself and Vivity Network
        Object[] params = new Object[]{"rfpQuoteNetworkId",
            selectDualQuoteNetwork.getRfpQuoteNetworkId()};
        String result = performGet("/v1/quotes/options/{id}/avaliableNetworks", params,
            rqo.getRfpQuoteOptionId());

        QuoteOptionNetworkBriefDto[] dtos = gson
            .fromJson(result, QuoteOptionNetworkBriefDto[].class);
        // 1 aLaCarte + 2 from dual combination (vivityHmoDualQuoteNetwork, selectDualQuoteNetwork)
        assertThat(dtos.length).isEqualTo(3);

        Set<Long> networks = Arrays.stream(dtos).map(n -> n.getId()).collect(Collectors.toSet());
        assertThat(networks).containsExactlyInAnyOrder(
            aLaCarteQuoteNetwork.getRfpQuoteNetworkId(),
            selectDualQuoteNetwork.getRfpQuoteNetworkId(),
            vivityHmoDualQuoteNetwork.getRfpQuoteNetworkId());
    }

    @Test
    public void changeRfpQuoteOptionNetwork_UpdateRates() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.ANTHEM_CARRIER, Constants.MEDICAL);
        Carrier carrier = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();

        RfpQuoteNetworkCombination dualCombination1 = new RfpQuoteNetworkCombination(carrier,
            "Dual Traditional/Select", 2);
        dualCombination1 = rfpQuoteNetworkCombinationRepository.save(dualCombination1);

        RfpQuoteNetworkCombination dualCombination2 = new RfpQuoteNetworkCombination(carrier,
            "Dual Traditional/Vivity", 2);
        dualCombination2 = rfpQuoteNetworkCombinationRepository.save(dualCombination2);

        Network traditionalNetwork = testEntityHelper
            .createTestNetwork("Traditional Network", "HMO", carrier);
        Network selectNetwork = testEntityHelper
            .createTestNetwork("Select Network", "HMO", carrier);
        Network vivityNetwork = testEntityHelper
            .createTestNetwork("Vivity Network", "HMO", carrier);

        RfpQuoteNetwork traditionalDualQuoteNetwork1 = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, traditionalNetwork, dualCombination1);
        RfpQuoteNetwork selectDualQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, selectNetwork, dualCombination1);

        RfpQuoteNetwork traditionalDualQuoteNetwork2 = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, traditionalNetwork, dualCombination2);
        RfpQuoteNetwork vivityDualQuoteNetwork = testEntityHelper
            .createTestQuoteNetwork(rfpQuote, vivityNetwork, dualCombination2);

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");

        Plan testPlan = testEntityHelper
            .createTestPlan(rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier());
        Plan testRxPlan = testEntityHelper
            .createTestPlan(rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier());
        PlanNameByNetwork selectedPnn = testEntityHelper
            .createTestPlanNameByNetwork(testPlan, traditionalNetwork);
        PlanNameByNetwork selectedRxPnn = testEntityHelper
            .createTestPlanNameByNetwork(testRxPlan, traditionalNetwork);

        RfpQuoteNetworkPlan selectedPlan1 = testEntityHelper
            .createTestRfpQuoteNetworkPlan(selectedPnn, traditionalDualQuoteNetwork1, 100f, 120f,
                140f, 160f);
        RfpQuoteNetworkPlan selectedRxPlan1 = testEntityHelper
            .createTestRfpQuoteNetworkPlan(selectedRxPnn, traditionalDualQuoteNetwork1, 100f, 120f,
                140f, 160f);
        RfpQuoteNetworkPlan selectedPlan2 = testEntityHelper
            .createTestRfpQuoteNetworkPlan(selectedPnn, traditionalDualQuoteNetwork2, 100f, 120f,
                140f, 160f);
        RfpQuoteNetworkPlan selectedRxPlan2 = testEntityHelper
            .createTestRfpQuoteNetworkPlan(selectedRxPnn, traditionalDualQuoteNetwork2, 100f, 120f,
                140f, 160f);

        RfpQuoteOptionNetwork rqon1 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, traditionalDualQuoteNetwork1, selectedPlan1, null,
                1L, 1L, 1L, 1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f);
        rqon1.setSelectedRfpQuoteNetworkRxPlan(selectedRxPlan1);
        rqon1 = rfpQuoteOptionNetworkRepository.save(rqon1);

        RfpQuoteOptionNetwork rqon2 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, selectDualQuoteNetwork, null, null, 1L, 1L, 1L,
                1L, Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, 10f, 20f, 30f, 40f);

        flushAndClear();

        // set new quote network
        UpdateRfpQuoteOptionNetworkDto params = new UpdateRfpQuoteOptionNetworkDto(
            rqon2.getRfpQuoteOptionNetworkId(), vivityDualQuoteNetwork.getRfpQuoteNetworkId());
        String result = performPut("/v1/quotes/options/{id}/changeNetwork", params,
            rqo.getRfpQuoteOptionId());

        flushAndClear();

        RfpQuoteOptionNetwork updatedRqon1 = rfpQuoteOptionNetworkRepository
            .findOne(rqon1.getRfpQuoteOptionNetworkId());
        RfpQuoteOptionNetwork updatedRqon2 = rfpQuoteOptionNetworkRepository
            .findOne(rqon2.getRfpQuoteOptionNetworkId());

        assertThat(updatedRqon1.getRfpQuoteNetwork()).isNotNull();
        assertThat(updatedRqon1.getRfpQuoteNetwork().getRfpQuoteNetworkId())
            .isEqualTo(traditionalDualQuoteNetwork2.getRfpQuoteNetworkId());
        assertThat(updatedRqon1.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId())
            .isEqualTo(selectedPlan2.getRfpQuoteNetworkPlanId());
        assertThat(updatedRqon1.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())
            .isEqualTo(selectedRxPlan2.getRfpQuoteNetworkPlanId());

        assertThat(updatedRqon2.getRfpQuoteNetwork()).isNotNull();
        assertThat(updatedRqon2.getRfpQuoteNetwork().getRfpQuoteNetworkId())
            .isEqualTo(vivityDualQuoteNetwork.getRfpQuoteNetworkId());
    }

    @Test
    public void select_unselectRfpQuoteOptionNetworkAdmFee() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, null, null, 10L, 15L, 20L, 25L, "PERCENT",
                90f, 90f, 90f, 90f);

        flushAndClear();

        Carrier uhc = rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier();
        AdministrativeFee fee = testEntityHelper.createTestAdministrativeFee(uhc, "fee", 1.0f);

        SelectRfpQuoteOptionNetworkAdmFeeDto params = new SelectRfpQuoteOptionNetworkAdmFeeDto();
        params.setAdministrativeFeeId(fee.getAdministrativeFeeId());
        params.setRfpQuoteOptionNetworkId(rqon.getRfpQuoteOptionNetworkId());

        String result = performPut("/v1/quotes/options/selectAdministrativeFee", params);

        flushAndClear();

        RfpQuoteOptionNetwork storedRqon = rfpQuoteOptionNetworkRepository
            .findOne(rqon.getRfpQuoteOptionNetworkId());
        assertThat(storedRqon.getAdministrativeFee()).isNotNull();
        assertThat(storedRqon.getAdministrativeFee().getAdministrativeFeeId())
            .isEqualTo(fee.getAdministrativeFeeId());

        params.setAdministrativeFeeId(null);
        result = performPut("/v1/quotes/options/selectAdministrativeFee", params);

        flushAndClear();

        storedRqon = rfpQuoteOptionNetworkRepository.findOne(rqon.getRfpQuoteOptionNetworkId());
        assertThat(storedRqon.getAdministrativeFee()).isNull();
    }

    @Test
    public void select_unselectRfpQuoteOptionNetworkPlan_Groups() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan selectedPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteNetworkPlan selectedRxPlan = testEntityHelper
            .createTestRfpQuoteNetworkRxPlan("rx plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");

        RfpQuoteOptionNetwork rqon1 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, null, null, 10L, 15L, 20L, 25L, "PERCENT",
                90f, 90f, 90f, 90f);
        rqon1.setNetworkGroup("Group1");
        rqon1 = rfpQuoteOptionNetworkRepository.save(rqon1);
        RfpQuoteOptionNetwork rqon2 = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, null, null, 10L, 15L, 20L, 25L, "PERCENT",
                90f, 90f, 90f, 90f);
        rqon2.setNetworkGroup("Group1");
        rqon2 = rfpQuoteOptionNetworkRepository.save(rqon2);

        flushAndClear();

        // check for plan not selected before API call
        assertThat(rqon1.getSelectedRfpQuoteNetworkPlan()).isNull();
        assertThat(rqon1.getSelectedRfpQuoteNetworkRxPlan()).isNull();
        assertThat(rqon2.getSelectedRfpQuoteNetworkPlan()).isNull();
        assertThat(rqon2.getSelectedRfpQuoteNetworkRxPlan()).isNull();

        SelectRfpQuoteOptionNetworkPlanDto params = new SelectRfpQuoteOptionNetworkPlanDto();
        params.setRfpQuoteNetworkPlanId(selectedPlan.getRfpQuoteNetworkPlanId());
        params.setRfpQuoteOptionNetworkId(rqon1.getRfpQuoteOptionNetworkId());

        String result = performPut("/v1/quotes/options/selectNetworkPlan", params);

        // select RX
        params.setRfpQuoteNetworkPlanId(selectedRxPlan.getRfpQuoteNetworkPlanId());
        result = performPut("/v1/quotes/options/selectNetworkPlan", params);

        flushAndClear();

        RfpQuoteOptionNetwork storedRqon1 = rfpQuoteOptionNetworkRepository
            .findOne(rqon1.getRfpQuoteOptionNetworkId());
        assertThat(storedRqon1.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId())
            .isEqualTo(selectedPlan.getRfpQuoteNetworkPlanId());
        assertThat(storedRqon1.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())
            .isEqualTo(selectedRxPlan.getRfpQuoteNetworkPlanId());

        // check for second RfpQuoteOptionNetwork has selected plan too
        RfpQuoteOptionNetwork storedRqon2 = rfpQuoteOptionNetworkRepository
            .findOne(rqon2.getRfpQuoteOptionNetworkId());
        assertThat(storedRqon2.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId())
            .isEqualTo(selectedPlan.getRfpQuoteNetworkPlanId());
        assertThat(storedRqon2.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())
            .isEqualTo(selectedRxPlan.getRfpQuoteNetworkPlanId());

        // unselect plan for second RfpQuoteOptionNetwork
        params.setRfpQuoteNetworkPlanId(selectedPlan.getRfpQuoteNetworkPlanId());
        params.setRfpQuoteOptionNetworkId(rqon2.getRfpQuoteOptionNetworkId());
        result = performPut("/v1/quotes/options/unselectNetworkPlan", params);

        // unselect RX
        params.setRfpQuoteNetworkPlanId(selectedRxPlan.getRfpQuoteNetworkPlanId());
        result = performPut("/v1/quotes/options/unselectNetworkPlan", params);

        RestMessageDto dto = gson.fromJson(result, RestMessageDto.class);
        assertThat(dto.isSuccess()).isTrue();

        flushAndClear();

        storedRqon1 = rfpQuoteOptionNetworkRepository.findOne(rqon1.getRfpQuoteOptionNetworkId());
        assertThat(storedRqon1.getSelectedRfpQuoteNetworkPlan()).isNull();
        assertThat(storedRqon1.getSelectedRfpQuoteNetworkRxPlan()).isNull();

        storedRqon2 = rfpQuoteOptionNetworkRepository.findOne(rqon2.getRfpQuoteOptionNetworkId());
        assertThat(storedRqon2.getSelectedRfpQuoteNetworkPlan()).isNull();
        assertThat(storedRqon2.getSelectedRfpQuoteNetworkRxPlan()).isNull();
    }

    @Test
    public void select_unselectRfpQuoteOptionNetworkPlan() throws Exception {
        select_unselectRfpQuoteOptionNetworkPlanHelper("SELECTED_PLAN",
            "/v1/quotes/options/selectNetworkPlan", "/v1/quotes/options/unselectNetworkPlan");
    }

    @Test
    public void select_unselectSecondRfpQuoteOptionNetworkPlan() throws Exception {
        select_unselectRfpQuoteOptionNetworkPlanHelper("SECOND_SELECTED_PLAN",
            "/v1/quotes/options/selectSecondNetworkPlan", "/v1/quotes/options/unselectSecondNetworkPlan");
    }

    public void select_unselectRfpQuoteOptionNetworkPlanHelper(String typeOfPlan, String selectUrl, String unselectUrl) throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan selectedPlan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test quote plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteNetworkPlan selectedRxPlan = testEntityHelper
            .createTestRfpQuoteNetworkRxPlan("rx plan", rqn, 100f, 120f, 140f, 160f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        RfpQuoteOptionNetwork rqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, null, null, 10L, 15L, 20L, 25L, "PERCENT",
                90f, 90f, 90f, 90f);

        flushAndClear();

        // check for plan not selected before API call
        RfpQuoteOptionNetwork storedRqon = rfpQuoteOptionNetworkRepository
            .findOne(rqon.getRfpQuoteOptionNetworkId());
        if(typeOfPlan.equals("SELECTED_PLAN")) {
            assertThat(storedRqon.getSelectedRfpQuoteNetworkPlan()).isNull();
            assertThat(storedRqon.getSelectedRfpQuoteNetworkRxPlan()).isNull();
        }else if(typeOfPlan.equals("SECOND_SELECTED_PLAN")){
            assertThat(storedRqon.getSelectedSecondRfpQuoteNetworkPlan()).isNull();
            assertThat(storedRqon.getSelectedSecondRfpQuoteNetworkRxPlan()).isNull();
        }

        SelectRfpQuoteOptionNetworkPlanDto params = new SelectRfpQuoteOptionNetworkPlanDto();
        params.setRfpQuoteNetworkPlanId(selectedPlan.getRfpQuoteNetworkPlanId());
        params.setRfpQuoteOptionNetworkId(rqon.getRfpQuoteOptionNetworkId());

        String result = performPut(selectUrl, params);

        params.setRfpQuoteNetworkPlanId(selectedRxPlan.getRfpQuoteNetworkPlanId());
        result = performPut(selectUrl, params);

        flushAndClear();

        storedRqon = rfpQuoteOptionNetworkRepository.findOne(rqon.getRfpQuoteOptionNetworkId());
        if(typeOfPlan.equals("SELECTED_PLAN")) {
            assertThat(storedRqon.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId())
                .isEqualTo(selectedPlan.getRfpQuoteNetworkPlanId());
            assertThat(storedRqon.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())
                .isEqualTo(selectedRxPlan.getRfpQuoteNetworkPlanId());
        }else if(typeOfPlan.equals("SECOND_SELECTED_PLAN")){
            assertThat(storedRqon.getSelectedSecondRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId())
                .isEqualTo(selectedPlan.getRfpQuoteNetworkPlanId());
            assertThat(storedRqon.getSelectedSecondRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId())
                .isEqualTo(selectedRxPlan.getRfpQuoteNetworkPlanId());
        }

        result = performPut(unselectUrl, params);
        params.setRfpQuoteNetworkPlanId(selectedPlan.getRfpQuoteNetworkPlanId());
        result = performPut(unselectUrl, params);

        RestMessageDto dto = gson.fromJson(result, RestMessageDto.class);
        assertThat(dto.isSuccess()).isTrue();

        flushAndClear();

        storedRqon = rfpQuoteOptionNetworkRepository.findOne(rqon.getRfpQuoteOptionNetworkId());
        if(typeOfPlan.equals("SELECTED_PLAN")) {
            assertThat(storedRqon.getSelectedRfpQuoteNetworkPlan()).isNull();
            assertThat(storedRqon.getSelectedRfpQuoteNetworkRxPlan()).isNull();
        }else if(typeOfPlan.equals("SECOND_SELECTED_PLAN")){
            assertThat(storedRqon.getSelectedSecondRfpQuoteNetworkPlan()).isNull();
            assertThat(storedRqon.getSelectedSecondRfpQuoteNetworkRxPlan()).isNull();
        }

    }

    @Test
    public void getQuoteOptionNetworkRiders_PlanRiders() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        Rider selectableRider = testEntityHelper.createTestRider("selectable Rider", 1f, 2f, 3f, 4f);
        
        Rider notSelectableRider = testEntityHelper.createTestRider("not selectable Rider", 1f, 2f, 3f, 4f);
        notSelectableRider.getRiderMeta().setSelectable(false);
        
        riderMetaRepository.save(notSelectableRider.getRiderMeta());
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, appCarrier[0], Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", rqn, 10f, 11f, 12f, 13f);
        
        rqnp.getRiders().add(notSelectableRider);
        rqnp.getRiders().add(selectableRider);
        rfpQuoteNetworkPlanRepository.save(rqnp);
        
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 1");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();
        
        String result = performGet("/v1/quotes/options/{id}/riders", EMPTY, rqo.getRfpQuoteOptionId());
           
        QuoteOptionRidersDto dto = gson.fromJson(result, QuoteOptionRidersDto.class);
        assertThat(dto.getNetworkRidersDtos()).hasSize(1);
        assertThat(dto.getNetworkRidersDtos().get(0).getRiders()).extracting(RiderDto::getRiderCode)
            .containsExactlyInAnyOrder(selectableRider.getRiderMeta().getCode(), 
                notSelectableRider.getRiderMeta().getCode());
    }
    
    @Test
    public void testRiderListReceivedByOptionIdIsNotEmpty() throws Exception {
        Client client = testEntityHelper.createTestClient();

        Rider rider = testEntityHelper.createTestRider("test rider code", 1f, 2f, 3f, 4f);
        
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        rfpQuote.getRiders().add(rider);
        rfpQuote = rfpQuoteRepository.save(rfpQuote);
        
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        rqn.getRiders().add(rider);
        rqn = rfpQuoteNetworkRepository.save(rqn);
        
        RfpQuoteNetworkPlan rqnp = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test medical plan", rqn, 10f, 11f, 12f, 13f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 1");
        RfpQuoteOptionNetwork rqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, null, 10L, 15L, 20L, 25L, "PERCENT",
                90f, 90f, 90f, 90f);
        AdministrativeFee fee = testEntityHelper
            .createTestAdministrativeFee(rfpQuote.getRfpSubmission().getRfpCarrier().getCarrier(),
                "fee", 1.0f);
        rqon.setAdministrativeFee(fee);
        rqon = rfpQuoteOptionNetworkRepository.save(rqon);

        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        String result = performGet("/v1/quotes/options/{id}/riders", EMPTY, rqo.getRfpQuoteOptionId());
           
        QuoteOptionRidersDto dto = gson.fromJson(result, QuoteOptionRidersDto.class);
        assertThat(dto.getRiders()).isNotEmpty();
        assertThat(dto.getNetworkRidersDtos()).isNotEmpty();
        for (QuoteOptionNetworkRidersDto netwRider : dto.getNetworkRidersDtos()) {
            assertThat(netwRider).hasNoNullFieldsOrProperties();
            if (netwRider.getRfpQuoteOptionNetworkId().equals(rqon.getRfpQuoteOptionNetworkId())) {
                assertThat(netwRider.getAdministrativeFeeId()).isNotNull();
            }
        }
    }
    
    @Test
    @Ignore // Broken - unselected riders are not included to plan cost by default
    public void testUnselectABLERiderImpactToPlanCost() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan plan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, medicalNetwork, plan, null, 10L, 15L, 20L, 25L,"DOLLAR", 90f, 90f, 90f, 90f);

        flushAndClear();

        QuoteOptionDetailsDto quoteOption1Dto = gson.fromJson(
            performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId()), QuoteOptionDetailsDto.class);

        assertThat(quoteOption1Dto.getDetailedPlans()).hasSize(1);
        QuoteOptionPlanDetailsDto planDetails = quoteOption1Dto.getDetailedPlans().get(0);
        Float expectedTotalWithoutRiders = rqon.getTier1Census() * plan.getTier1Rate()
            + rqon.getTier2Census() * plan.getTier2Rate()
            + rqon.getTier3Census() * plan.getTier3Rate()
            + rqon.getTier4Census() * plan.getTier4Rate();
        assertThat(planDetails.getNewPlan().getTotal()).isEqualTo(expectedTotalWithoutRiders, offset(0.001f));

        // rider with selecteble = false
        RiderMeta riderMeta = testEntityHelper.createTestRiderMeta("test rider 1", null, null, false);
        Rider rider1 = testEntityHelper.createTestRider(riderMeta, 11f, 12f, 13f, 14f);

        assertThat(medicalNetwork.getRiders()).isEmpty();
        
        // add rider to network, NOT select
        medicalNetwork.getRiders().add(rider1);
        
        rfpQuoteNetworkRepository.save(medicalNetwork);
        
        flushAndClear();

        assertThat(medicalNetwork.getRiders()).contains(rider1);
        
        // added network rider should be added to plan cost
        
        quoteOption1Dto = gson.fromJson(
            performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId()), QuoteOptionDetailsDto.class);
        planDetails = quoteOption1Dto.getDetailedPlans().get(0);
        Float expectedTotalWithRiders = (rqon.getTier1Census() * (plan.getTier1Rate() + rider1.getTier1Rate()))
                + (rqon.getTier2Census() * (plan.getTier2Rate() + rider1.getTier2Rate()))
                + (rqon.getTier3Census() * (plan.getTier3Rate() + rider1.getTier3Rate()))
                + (rqon.getTier4Census() * (plan.getTier4Rate() + rider1.getTier4Rate()));
        assertThat(planDetails.getNewPlan().getTotal()).isEqualTo(expectedTotalWithRiders, offset(0.001f));
    }
    
    @Test
    public void testSelectedRiderImpactToPlanCost() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote medicalQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.ANTHEM_CARRIER, Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper
            .createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan plan = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption rqo = testEntityHelper
            .createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork rqon = testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, medicalNetwork, plan, null, 10L, 15L, 20L, 25L,
                "DOLLAR", 90f, 90f, 90f, 90f);

        flushAndClear();

        QuoteOptionDetailsDto quoteOption1Dto = gson
            .fromJson(performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId()),
                QuoteOptionDetailsDto.class);

        assertThat(quoteOption1Dto.getDetailedPlans()).hasSize(1);
        QuoteOptionPlanDetailsDto planDetails = quoteOption1Dto.getDetailedPlans().get(0);
        Float expectedTotalWithoutRiders = rqon.getTier1Census() * plan.getTier1Rate()
            + rqon.getTier2Census() * plan.getTier2Rate()
            + rqon.getTier3Census() * plan.getTier3Rate()
            + rqon.getTier4Census() * plan.getTier4Rate();
        assertThat(planDetails.getNewPlan().getTotal())
            .isEqualTo(expectedTotalWithoutRiders, offset(0.001f));

        Rider rider1 = testEntityHelper.createTestRider("test rider 1", 1f, 2f, 3f, 4f);
        Rider rider2 = testEntityHelper.createTestRider("test rider 2", 1.1f, 1.2f, 1.3f, 1.4f);

        flushAndClear();

        // select rider 1 and rider 2 and check updated calculations

        performPost("/v1/quotes/options/networks/{networkId}/riders/{riderId}/select", EMPTY,
            rqon.getRfpQuoteOptionNetworkId(), rider1.getRiderId());
        performPost("/v1/quotes/options/networks/{networkId}/riders/{riderId}/select", EMPTY,
            rqon.getRfpQuoteOptionNetworkId(), rider2.getRiderId());

        quoteOption1Dto = gson
            .fromJson(performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId()),
                QuoteOptionDetailsDto.class);

        assertThat(quoteOption1Dto.getDetailedPlans()).hasSize(1);
        planDetails = quoteOption1Dto.getDetailedPlans().get(0);
        Float expectedTotalWithRiders =
            (rqon.getTier1Census() * (plan.getTier1Rate() + rider1.getTier1Rate() + rider2
                .getTier1Rate()))
                + (rqon.getTier2Census() * (plan.getTier2Rate() + rider1.getTier2Rate() + rider2
                .getTier2Rate()))
                + (rqon.getTier3Census() * (plan.getTier3Rate() + rider1.getTier3Rate() + rider2
                .getTier3Rate()))
                + (rqon.getTier4Census() * (plan.getTier4Rate() + rider1.getTier4Rate() + rider2
                .getTier4Rate()));
        assertThat(planDetails.getNewPlan().getTotal())
            .isEqualTo(expectedTotalWithRiders, offset(0.001f));

        // unselect rider 2 and check calculations

        performPost("/v1/quotes/options/networks/{networkId}/riders/{riderId}/unselect", EMPTY,
            rqon.getRfpQuoteOptionNetworkId(), rider2.getRiderId());

        quoteOption1Dto = gson
            .fromJson(performGet("/v1/quotes/options/{id}", EMPTY, rqo.getRfpQuoteOptionId()),
                QuoteOptionDetailsDto.class);
        planDetails = quoteOption1Dto.getDetailedPlans().get(0);
        expectedTotalWithRiders =
            (rqon.getTier1Census() * (plan.getTier1Rate() + rider1.getTier1Rate()))
                + (rqon.getTier2Census() * (plan.getTier2Rate() + rider1.getTier2Rate()))
                + (rqon.getTier3Census() * (plan.getTier3Rate() + rider1.getTier3Rate()))
                + (rqon.getTier4Census() * (plan.getTier4Rate() + rider1.getTier4Rate()));
        assertThat(planDetails.getNewPlan().getTotal())
            .isEqualTo(expectedTotalWithRiders, offset(0.001f));
    }

    @Test
    public void testSelectUnselectRiderByOptionId() throws Exception {
        Client client = testEntityHelper.createTestClient();
        List<RiderMeta> metas = riderMetaRepository
            .findByCode(Arrays.asList("test rider code selectable"));
        RiderMeta riderMeta = null;
        if (CollectionUtils.isEmpty(metas)) {
            RiderMeta newMeta = new RiderMeta();
            newMeta.setCode("test rider code selectable");
            newMeta.setSelectable(true);
            riderMeta = riderMetaRepository.save(newMeta);
        } else {
            riderMeta = metas.get(0);
        }
        Rider rider = new Rider();
        rider.setRiderMeta(riderMeta);
        rider = riderRepository.save(rider);
        Set<Rider> riders = new HashSet<>();
        riders.add(rider);
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);
        rfpQuote.setRiders(riders);
        rfpQuote = rfpQuoteRepository.save(rfpQuote);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan rqnp = testEntityHelper
            .createTestRfpQuoteNetworkPlan("test medical plan", rqn, 10f, 11f, 12f, 13f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 1");
        testEntityHelper
            .createTestRfpQuoteOptionNetwork(rqo, rqn, rqnp, null, 10L, 15L, 20L, 25L, "PERCENT",
                90f, 90f, 90f, 90f);
        flushAndClear();

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(
            MockMvcRequestBuilders.get("/v1/quotes/options/{id}/riders", rqo.getRfpQuoteOptionId())
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
        QuoteOptionRidersDto dto = gson
            .fromJson(result.getResponse().getContentAsString(), QuoteOptionRidersDto.class);
        assertThat(dto.getRiders().get(0).isSelected()).isFalse();

        performPost(String
            .format("/v1/quotes/options/%s/riders/%s/select", rqo.getRfpQuoteOptionId(),
                rider.getRiderId()), null);

        result = mockMvc.perform(
            MockMvcRequestBuilders.get("/v1/quotes/options/{id}/riders", rqo.getRfpQuoteOptionId())
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
        dto = gson.fromJson(result.getResponse().getContentAsString(), QuoteOptionRidersDto.class);
        assertThat(dto.getRiders().get(0).isSelected()).isTrue();

        performPost(String
            .format("/v1/quotes/options/%s/riders/%s/unselect", rqo.getRfpQuoteOptionId(),
                rider.getRiderId()), null);

        result = mockMvc.perform(
            MockMvcRequestBuilders.get("/v1/quotes/options/{id}/riders", rqo.getRfpQuoteOptionId())
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();
        dto = gson.fromJson(result.getResponse().getContentAsString(), QuoteOptionRidersDto.class);
        assertThat(dto.getRiders().get(0).isSelected()).isFalse();
    }


    @Test
    @Ignore
    public void downloadQuoteFile() throws Exception {
        Client client = testEntityHelper.createTestClient();
        RfpQuote rfpQuote = testEntityHelper
            .createTestRfpQuote(client, "ANTHEM_BLUE_CROSS", Constants.MEDICAL);

        String filename = "test.txt";
        String contents = "This is my test file for " + (new Date());
        FileOutputStream out = new FileOutputStream(filename);
        out.write(contents.getBytes());
        out.close();

        token = createToken(client.getBroker().getBrokerToken());
        File f = new File(filename);

        String key = s3FileManager.uploadQuote(
            f.getName(),
            new FileInputStream(f),
            probeContentType(f.toPath()),
            f.length()
        );

        try {
            rfpQuote.setS3Key(key);
            mockMvc.perform(
                MockMvcRequestBuilders.get("/v1/quotes/{rfpQuoteId}/file", rfpQuote.getRfpQuoteId())
                    .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition",
                    "attachment; filename=\"" + filename + "\""))
                .andExpect(content().string(contents))
                .andReturn();
        } finally {
            s3FileManager.delete(key);
        }

    }

    @Test
    public void getRfpQuoteOptions_SetViewed() throws Exception {
        testQuoteViewed(BrokerageRole.USER, true, 1);
    }

    @Test
    public void getRfpQuoteOptions_SetViewed_SuperAdmin() throws Exception {
        testQuoteViewed(BrokerageRole.SUPERADMIN, false, 0);
        testQuoteViewed(BrokerageRole.ADMIN, false, 0);
        testQuoteViewed(BrokerageRole.FULL_CLIENT_ACCESS, false, 0);
        testQuoteViewed(BrokerageRole.CLIENT, false, 0);
    }

    private void testQuoteViewed(BrokerageRole brokerageRole, boolean expectedIsViewedValue,
        int expectedSmtpInvocationCount) throws Exception {

        Client client = testEntityHelper.createTestClient();
        token = authenticationService.createTokenForBroker(
            client.getBroker().getBrokerToken(),
            TEST_AUTHID,
            brokerageRole.getValue(),
            toArray(AccountRole.BROKER.getValue()),
            appCarrier);

        RfpQuote standartQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL,
                QuoteType.STANDARD);
        RfpQuote kaiserQuote = testEntityHelper
            .createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL, QuoteType.KAISER);

        flushAndClear();

        assertThat(standartQuote.isViewed()).isFalse();
        assertThat(kaiserQuote.isViewed()).isFalse();

        // action
        Object[] params = new Object[]{"category", Constants.MEDICAL, "clientId",
            client.getClientId()};
        performGet("/v1/quotes/options", params);

        // test send was called
        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        Mockito.verify(smtpMailer, Mockito.times(expectedSmtpInvocationCount))
            .send(mailCaptor.capture());

        if(expectedSmtpInvocationCount > 0) {
            MailDto mailDto = mailCaptor.getValue();
        }

        // uncomment for manual testing
        //File html = new File("testQuoteViewed.html");
        //FileUtils.writeByteArrayToFile(html, mailDto.getContent().getBytes());

        // test VIEWED was set
        List<RfpQuote> quotes = rfpQuoteRepository
            .findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);
        for (RfpQuote quote : quotes) {
            assertThat(quote.isViewed()).isEqualTo(expectedIsViewedValue);
        }

        // reset invocation counter
        Mockito.reset(smtpMailer);

        //action
        performGet("/v1/quotes/options", params);

        // test send was not called second time
        Mockito.verify(smtpMailer, Mockito.never()).send(Mockito.any(MailDto.class));
    }

    @Test
    public void getDeclinedRfpQuotesByClientIdAndRfpCarrierId() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        ClientPlan clientPlan = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");

        RfpCarrier rfpCarrier = testEntityHelper
            .createTestRfpCarrier(clientPlan.getPnn().getNetwork().getCarrier(), Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);

        RfpQuote declinedQuote = testEntityHelper
            .createTestRfpQuote(client, rfpSubmission, Constants.UHC_CARRIER, Constants.MEDICAL,
                QuoteType.DECLINED);
        RfpQuote clearValueQuote = testEntityHelper
            .createTestRfpQuote(client, rfpSubmission, Constants.UHC_CARRIER, Constants.MEDICAL,
                QuoteType.CLEAR_VALUE);

        flushAndClear();

        RfpQuoteDto declinedDto = new RfpQuoteDto(declinedQuote.getRfpQuoteId(),
            rfpCarrier.getRfpCarrierId(), declinedQuote.getQuoteType(), 4);
        RfpQuoteDto clearValueDto = new RfpQuoteDto(clearValueQuote.getRfpQuoteId(),
            rfpCarrier.getRfpCarrierId(), clearValueQuote.getQuoteType(), 4);
//        RfpQuoteDto[] expected = new RfpQuoteDto[] {declinedDto, clearValueDto};

        String result = performGet("/v1/clients/{clientId}/quotes",
            new Object[]{"rfpCarrierId", rfpCarrier.getRfpCarrierId(),
                "category", rfpCarrier.getCategory()}, client.getClientId());
        RfpQuoteDto[] response = gson.fromJson(result, RfpQuoteDto[].class);
        assertThat(response).hasSize(2);
        assertThat(response[0]).isEqualToComparingFieldByFieldRecursively(declinedDto);
        assertThat(response[1]).isEqualToComparingFieldByFieldRecursively(clearValueDto);
    }

    @Test
    public void getRfpQuoteOption_Select_Second_RX_Plan() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        ClientPlan clientPlan = testEntityHelper
            .createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");

        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan selectedPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(
            rqo, medicalNetwork, selectedPlan, clientPlan, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);

        flushAndClear();

        RfpQuoteNetworkPlan selectedSecondPlan = testEntityHelper.createTestRfpQuoteNetworkPlan(
            "second medical plan", medicalNetwork, 10f, 11f, 12f, 13f);
        final float RX_FACTOR = 1.5f;
        RfpQuoteNetworkPlan selectedSecondRxPlan = testEntityHelper.createTestRfpQuoteNetworkRxPlan(
            "rx plan 1", medicalNetwork, RX_FACTOR, RX_FACTOR, RX_FACTOR, RX_FACTOR);

        // select second plan

        SelectRfpQuoteOptionNetworkPlanDto params = new SelectRfpQuoteOptionNetworkPlanDto();
        params.setRfpQuoteNetworkPlanId(selectedSecondPlan.getRfpQuoteNetworkPlanId());
        params.setRfpQuoteOptionNetworkId(rqon.getRfpQuoteOptionNetworkId());
        String result = performPut("/v1/quotes/options/selectSecondNetworkPlan", params);

        // select second RX
        params.setRfpQuoteNetworkPlanId(selectedSecondRxPlan.getRfpQuoteNetworkPlanId());
        result = performPut("/v1/quotes/options/selectSecondNetworkPlan", params);

        flushAndClear();

        QuoteOptionDetailsDto quoteOption1Dto = gson.fromJson(performGet("/v1/quotes/options/{id}", EMPTY,
            rqo.getRfpQuoteOptionId()), QuoteOptionDetailsDto.class);

        assertThat(quoteOption1Dto.getDetailedPlans()).hasSize(1);
        QuoteOptionPlanDetailsDto planDetails = quoteOption1Dto.getDetailedPlans().get(0);

        assertThat(planDetails.getSecondNewPlan()).isNotNull();
        Float expectedTotal = PlanCalcHelper
            .calcAlterPlanTotal(rqon, selectedSecondPlan, selectedSecondRxPlan,0f);
        assertThat(planDetails.getSecondNewPlan().getTotal()).isEqualTo(expectedTotal);
        for (Cost cost : planDetails.getSecondNewPlan().getCost()) {
            if (cost.name.equals(Constants.TIER1_PLAN_NAME)) {
                assertThat(cost.value).isEqualTo(String.valueOf(selectedSecondPlan.getTier1Rate() * selectedSecondRxPlan.getTier1Rate()));
            } else if (cost.name.equals(Constants.TIER2_PLAN_NAME)) {
                assertThat(cost.value).isEqualTo(String.valueOf(selectedSecondPlan.getTier2Rate() * selectedSecondRxPlan.getTier2Rate()));
            } else if (cost.name.equals(Constants.TIER3_PLAN_NAME)) {
                assertThat(cost.value).isEqualTo(String.valueOf(selectedSecondPlan.getTier3Rate() * selectedSecondRxPlan.getTier3Rate()));
            } else if (cost.name.equals(Constants.TIER4_PLAN_NAME)) {
                assertThat(cost.value).isEqualTo(String.valueOf(selectedSecondPlan.getTier4Rate() * selectedSecondRxPlan.getTier4Rate()));
            }
        }
    }

    @Test
    public void getRfpQuoteOption_Disclaimers() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(client, Constants.UHC_CARRIER, Constants.MEDICAL);
        medicalQuote.addDisclaimer("HMO", "HMO-Disclaimer");
        medicalQuote.addDisclaimer("PPO", "PPO-Disclaimer");
        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(medicalQuote, "medical option");

        flushAndClear();

        QuoteOptionDisclaimerDto[] quoteOptionDisclaimerDto = gson.fromJson(performGet("/v1/quotes/options/{id}/disclaimers", EMPTY,
            rqo.getRfpQuoteOptionId()), QuoteOptionDisclaimerDto[].class);

        assertThat(quoteOptionDisclaimerDto).hasSize(2);
        assertThat(quoteOptionDisclaimerDto).extracting("type").containsExactlyInAnyOrder("HMO", "PPO");
        assertThat(quoteOptionDisclaimerDto).extracting("disclaimer").containsExactlyInAnyOrder("HMO-Disclaimer", "PPO-Disclaimer");
    }

}
