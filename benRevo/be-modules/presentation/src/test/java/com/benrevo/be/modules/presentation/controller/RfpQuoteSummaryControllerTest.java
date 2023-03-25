package com.benrevo.be.modules.presentation.controller;


import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Attribute;
import com.benrevo.common.dto.QuoteOptionPlanAlternativesDto;
import com.benrevo.common.dto.RfpQuoteDto;
import com.benrevo.common.dto.RfpQuoteSummaryDto;
import com.benrevo.common.dto.RfpQuoteSummaryShortDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.RfpQuoteSummaryRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static com.benrevo.common.util.ObjectMapperUtils.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class RfpQuoteSummaryControllerTest extends AbstractControllerTest {
    
    private static final String RFP_QUOTE_SUMMARY_ENDPOINT_URI = "/v1/clients/{id}/quotes/summary";

    @Autowired
    private RfpQuoteSummaryController rfpQuoteSummaryController;

    @Autowired
    private RfpQuoteSummaryRepository rfpQuoteSummaryRepository;

    @Before
    @Override
    public void init() {
        initController(rfpQuoteSummaryController);
    }

    @Test
    public void testGetRfpQuoteSummaryByQuoteId() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuoteSummary rfpQuoteSummary = testEntityHelper.createTestRfpQuoteSummary(client);
        
        RfpQuoteSummaryShortDto expected = map(rfpQuoteSummary, RfpQuoteSummaryShortDto.class);
        assertNull(expected.getDentalBundleDiscountPercent());
        assertNull(expected.getVisionBundleDiscountPercent());
        performGetAndAssertResult(expected, RFP_QUOTE_SUMMARY_ENDPOINT_URI, client.getClientId());
    }
    
    @Test
    public void testGetRfpQuoteSummary_BundleDiscount() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuoteSummary rfpQuoteSummary = testEntityHelper.createTestRfpQuoteSummary(client);
       
        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.DENTAL);
        RfpQuoteNetwork dentalNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DPPO");
        RfpQuoteNetworkPlan dentalNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test dental plan", dentalNetwork, 14f, 15f, 16f, 17f);
        RfpQuoteOption dentalOption = testEntityHelper.createTestRfpQuoteOption(dentalQuote, "dental option");
        RfpQuoteOptionNetwork dentalOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(dentalOption, dentalNetwork, dentalNetworkPlan, null, 10L, 15L, 20L, 25L, "DOLLAR", 90f, 90f, 90f, 90f);
        
        assertTrue(dentalOption.isFinalSelection());
        
        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.VISION);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VISION");
        RfpQuoteNetworkPlan visionNetworkPlan = testEntityHelper.createTestRfpQuoteNetworkPlan("test vision plan", visionNetwork, 18f, 19f, 20f, 21f);
        RfpQuoteOption visionOption = testEntityHelper.createTestRfpQuoteOption(visionQuote, "vision option");
        RfpQuoteOptionNetwork visionOptNetwork = testEntityHelper.createTestRfpQuoteOptionNetwork(visionOption, visionNetwork, visionNetworkPlan, null, 10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        assertTrue(visionOption.isFinalSelection());
        
        RfpQuoteSummaryShortDto expected = map(rfpQuoteSummary, RfpQuoteSummaryShortDto.class);
        expected.setDentalBundleDiscountPercent(RfpQuoteService.DENTAL_BUNDLE_DISCOUNT_PERCENT);
        expected.setVisionBundleDiscountPercent(RfpQuoteService.VISION_BUNDLE_DISCOUNT_PERCENT);
        
        flushAndClear();
        
        MvcResult result = performGetAndAssertResult(null, RFP_QUOTE_SUMMARY_ENDPOINT_URI, client.getClientId());

        RfpQuoteSummaryShortDto response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteSummaryShortDto.class);
        assertThat(response).isEqualToComparingFieldByField(expected);
    }
    
    @Test
    public void testGetRfpQuoteSummaryByQuoteIdReturn404() throws Exception {
    	Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        mockMvc.perform(MockMvcRequestBuilders.get(RFP_QUOTE_SUMMARY_ENDPOINT_URI, client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isNotFound())
                .andReturn();           
    }

    @Test
    public void testCreateRfpQuoteSummary() throws Exception {
        Client client = testEntityHelper.createTestClient();

        RfpQuoteSummaryShortDto dto = new RfpQuoteSummaryShortDto();
        dto.setDentalNotes("dentalNotes");
        dto.setMedicalNotes("medicalNotes");
        dto.setVisionNotes("visionNotes");
        dto.setLifeNotes("lifeNotes");

        String requestContent = jsonUtils.toJson(dto);

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.post(RFP_QUOTE_SUMMARY_ENDPOINT_URI, client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(requestContent)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        MockHttpServletResponse response = mvcResult.getResponse();
        String responseContent = response.getContentAsString();

        RfpQuoteSummaryDto responseDto = jsonUtils.fromJson(responseContent, RfpQuoteSummaryDto.class);

        assertNotNull(responseDto);
        assertNotNull(responseDto.getId());
        assertNotNull(responseDto.getMedicalNotes());
        assertNotNull(responseDto.getDentalNotes());
        assertNotNull(responseDto.getVisionNotes());
        assertNotNull(responseDto.getLifeNotes());

        RfpQuoteSummary rfpQuoteSummary = rfpQuoteSummaryRepository.findOne(responseDto.getId());
        assertNotNull(rfpQuoteSummary);
        assertEquals(responseDto.getId(), rfpQuoteSummary.getId());
        assertEquals(responseDto.getMedicalNotes(), rfpQuoteSummary.getMedicalNotes());
        assertEquals(responseDto.getDentalNotes(), rfpQuoteSummary.getDentalNotes());
        assertEquals(responseDto.getVisionNotes(), rfpQuoteSummary.getVisionNotes());
        assertEquals(responseDto.getLifeNotes(), rfpQuoteSummary.getLifeNotes());
    }

    @Test
    public void testUpdateRfpQuoteSummary() throws Exception {
        RfpQuoteSummary rfpQuoteSummary = testEntityHelper.createTestRfpQuoteSummary();

        RfpQuoteSummaryDto updateDto = map(rfpQuoteSummary, RfpQuoteSummaryDto.class);
        updateDto.setMedicalNotes("newMedicalNotes");
        updateDto.setDentalNotes("newDentalNotes");
        updateDto.setVisionNotes("newVisionNotes");

        String content = jsonUtils.toJson(updateDto);
        token = createToken(rfpQuoteSummary.getClient().getBroker().getBrokerToken());
        performPutAndAssertResult(content, updateDto, RFP_QUOTE_SUMMARY_ENDPOINT_URI, rfpQuoteSummary.getClient().getClientId());
    }

    @Test
    public void testDeleteRfpQuoteSummary() throws Exception {
        RfpQuoteSummary rfpQuoteSummary = testEntityHelper.createTestRfpQuoteSummary();

        long rfpQuoteSummaryId = rfpQuoteSummary.getId();

        assertNotNull(rfpQuoteSummaryRepository.findOne(rfpQuoteSummaryId));
        token = createToken(rfpQuoteSummary.getClient().getBroker().getBrokerToken());
        mockMvc.perform(MockMvcRequestBuilders.delete(RFP_QUOTE_SUMMARY_ENDPOINT_URI, rfpQuoteSummary.getClient().getClientId())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        assertNull(rfpQuoteSummaryRepository.findOne(rfpQuoteSummaryId));
    }

    @Test
    public void testDownloadRfpQuoteSummary() throws Exception {
        
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        RfpQuoteSummary rfpQuoteSummary = testEntityHelper.createTestRfpQuoteSummary(client);
        rfpQuoteSummary.setS3Key("s3key");
  
        byte[] expected = "test".getBytes();
        
        FileDto testFile = new FileDto();
        testFile.setContent(expected);
        testFile.setSize((long)expected.length);
        testFile.setName("test");
        testFile.setType(MediaType.APPLICATION_PDF_VALUE);
        
        Mockito.when(s3FileManager.download(Mockito.anyString())).thenReturn(testFile);
        Mockito.when(s3FileManager.getNameFromKey(Mockito.anyString())).thenReturn("testFileName");

        MvcResult result = mockMvc.perform(
                MockMvcRequestBuilders.get("/v1/clients/{id}/quotes/summary/file", client.getClientId())
                    .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isOk()).andReturn();

        byte[] fileContent = result.getResponse().getContentAsByteArray();
        
        assertThat(fileContent).isEqualTo(expected);
        
    }

}
