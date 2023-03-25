package com.benrevo.be.modules.admin.controller;


import static com.benrevo.common.util.ObjectMapperUtils.map;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.io.ByteArrayInputStream;
import com.benrevo.common.dto.RfpQuoteSummaryDto;
import com.benrevo.common.dto.RfpQuoteSummaryShortDto;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.benrevo.data.persistence.repository.RfpQuoteSummaryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class AdminRfpQuoteSummaryControllerTest extends AdminAbstractControllerTest {
    private static final String RFP_QUOTE_SUMMARY_ENDPOINT_URI = "/admin/clients/{id}/quotes/summary";

    @Autowired
    private RfpQuoteSummaryRepository rfpQuoteSummaryRepository;

    @Test
    public void testGetRfpQuoteSummaryByQuoteId() throws Exception {
        Client client = testEntityHelper.createTestClient("unitTestClient", broker);
        RfpQuoteSummary rfpQuoteSummary = testEntityHelper.createTestRfpQuoteSummary(client);
        performGetAndAssertResult(map(rfpQuoteSummary, RfpQuoteSummaryShortDto.class), RFP_QUOTE_SUMMARY_ENDPOINT_URI, client.getClientId());
    }

    @Test
    public void testCreateRfpQuoteSummary() throws Exception {
        Client client = testEntityHelper.createTestClient("unitTestClient", broker);

        RfpQuoteSummaryShortDto dto = new RfpQuoteSummaryShortDto();
        dto.setDentalNotes("dentalNotes");
        dto.setMedicalNotes("medicalNotes");
        dto.setMedicalWithKaiserNotes("medicalWithKaiserNotes");
        dto.setVisionNotes("visionNotes");
        dto.setLifeNotes("lifeNotes");

        ObjectMapper mapper = new ObjectMapper();

        String requestContent = mapper.writeValueAsString(dto);

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

        RfpQuoteSummaryDto responseDto = mapper.readValue(responseContent, RfpQuoteSummaryDto.class);

        assertNotNull(responseDto);
        assertNotNull(responseDto.getId());
        assertNotNull(responseDto.getMedicalNotes());
        assertNotNull(responseDto.getDentalNotes());
        assertNotNull(responseDto.getMedicalWithKaiserNotes());
        assertNotNull(responseDto.getVisionNotes());
        assertNotNull(responseDto.getLifeNotes());

        RfpQuoteSummary rfpQuoteSummary = rfpQuoteSummaryRepository.findOne(responseDto.getId());
        assertNotNull(rfpQuoteSummary);
        assertEquals(responseDto.getId(), rfpQuoteSummary.getId());
        assertEquals(responseDto.getMedicalNotes(), rfpQuoteSummary.getMedicalNotes());
        assertEquals(responseDto.getMedicalWithKaiserNotes(), rfpQuoteSummary.getMedicalWithKaiserNotes());
        assertEquals(responseDto.getDentalNotes(), rfpQuoteSummary.getDentalNotes());
        assertEquals(responseDto.getVisionNotes(), rfpQuoteSummary.getVisionNotes());
        assertEquals(responseDto.getLifeNotes(), rfpQuoteSummary.getLifeNotes());
    }

    @Test
    public void testUpdateRfpQuoteSummary() throws Exception {
        RfpQuoteSummary rfpQuoteSummary = testEntityHelper.createTestRfpQuoteSummary();

        ObjectMapper mapper = new ObjectMapper();

        RfpQuoteSummaryDto updateDto = map(rfpQuoteSummary, RfpQuoteSummaryDto.class);
        updateDto.setMedicalNotes("newMedicalNotes");
        updateDto.setDentalNotes("newDentalNotes");
        updateDto.setMedicalWithKaiserNotes("newMedicalWithKaiserNotes");
        updateDto.setVisionNotes("newVisionNotes");

        String content = mapper.writeValueAsString(updateDto);
        performPutAndAssertResult(content, updateDto, RFP_QUOTE_SUMMARY_ENDPOINT_URI, rfpQuoteSummary.getClient().getClientId());
    }

    @Test
    public void testDeleteRfpQuoteSummary() throws Exception {
        RfpQuoteSummary rfpQuoteSummary = testEntityHelper.createTestRfpQuoteSummary();

        long rfpQuoteSummaryId = rfpQuoteSummary.getId();

        assertNotNull(rfpQuoteSummaryRepository.findOne(rfpQuoteSummaryId));
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
    public void testRfpQuoteSummaryUpload() throws Exception {
        
        RfpQuoteSummary rfpQuoteSummary = testEntityHelper.createTestRfpQuoteSummary();

        byte[] bytes = "test".getBytes();
        ByteArrayInputStream is = new ByteArrayInputStream(bytes);
        MockMultipartFile mockFile = new MockMultipartFile("file", "fileName", "text/plain", is);

        MvcResult result = mockMvc.perform(
            MockMvcRequestBuilders.fileUpload("/admin/clients/{id}/quotes/summary/upload",
                    rfpQuoteSummary.getClient().getClientId())
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        RfpQuoteSummaryDto responseDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteSummaryDto.class);
        assertNotNull(responseDto.getFileUpdated());
    }

    @Test
    public void testRfpQuoteSummaryUploadFileExisted() throws Exception {
        
        RfpQuoteSummary rfpQuoteSummary = testEntityHelper.createTestRfpQuoteSummary();
        rfpQuoteSummary.setS3Key("s3Key");
        
        byte[] bytes = "test".getBytes();
        ByteArrayInputStream is = new ByteArrayInputStream(bytes);
        MockMultipartFile mockFile = new MockMultipartFile("file", "fileName", "text/plain", is);

        MvcResult result = mockMvc.perform(
            MockMvcRequestBuilders.fileUpload("/admin/clients/{id}/quotes/summary/upload",
                    rfpQuoteSummary.getClient().getClientId())
                .file(mockFile)
                .param("override", "true")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        RfpQuoteSummaryDto responseDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpQuoteSummaryDto.class);
        assertNotNull(responseDto.getFileUpdated());
    }


}
