package com.benrevo.be.modules.admin.controller;

import static com.benrevo.common.enums.CarrierType.fromStrings;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.DocumentDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.DocumentAttributeName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Document;
import com.benrevo.data.persistence.entities.DocumentAttribute;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.DocumentRepository;
import java.io.File;
import java.io.FileInputStream;
import java.util.Arrays;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.junit.Test;
import org.mockito.stubbing.OngoingStubbing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;


public class AdminDocumentFileControllerTest extends AdminAbstractControllerTest {

    @Autowired
    private AttributeRepository attributeRepository;
    
    @Autowired
    private DocumentRepository documentRepository;

    @Test
    public void getDocuments() throws Exception {
        Carrier carrier =
            testEntityHelper.createTestCarrier(Constants.UHC_CARRIER, Constants.UHC_CARRIER);
        Carrier kaiser =
            testEntityHelper.createTestCarrier(Constants.KAISER_CARRIER, Constants.KAISER_CARRIER);

        Document doc1 = testEntityHelper.createTestDocument(carrier, "testDocument1");
        Document doc2 = testEntityHelper.createTestDocument(kaiser, "testDocument2");

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/documents")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .param("carrierId", String.valueOf(carrier.getCarrierId()))
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        DocumentDto[] response =
            jsonUtils.fromJson(result.getResponse().getContentAsString(), DocumentDto[].class);

        assertThat(response).isNotEmpty();
        assertThat(response).contains(doc1.toDocumentDto(false));
        assertThat(response).doesNotContain(doc2.toDocumentDto(false));

        for(DocumentDto documentDto : response) {
            assertThat(documentDto).hasNoNullFieldsOrPropertiesExcept("tags");
        }
    }

    @Test
    public void searchDocumentsByName() throws Exception {
        Carrier carrier =
            testEntityHelper.createTestCarrier(Constants.UHC_CARRIER, Constants.UHC_CARRIER);

        Document doc1 = testEntityHelper.createTestDocument(carrier, "searchdoc1ument");
        Document doc2 = testEntityHelper.createTestDocument(carrier, "searchdoc2ument");

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/documents/search")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .param("carrierId", String.valueOf(carrier.getCarrierId()))
            .param("fileName", "searchdoc1")
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        DocumentDto[] response =
            jsonUtils.fromJson(result.getResponse().getContentAsString(), DocumentDto[].class);

        assertThat(response).hasSize(1);
        assertThat(response[0].getDocumentId()).isEqualTo(doc1.getDocumentId());
    }

    @Test
    public void getDocumentsByTags() throws Exception {
        Carrier carrier =
            testEntityHelper.createTestCarrier(Constants.UHC_CARRIER, Constants.UHC_CARRIER);

        Document doc1 = testEntityHelper.createTestDocument(carrier, "searchdoc1ument");
        Document doc2 = testEntityHelper.createTestDocument(carrier, "searchdoc2ument");

        attributeRepository.save(new DocumentAttribute(doc1,DocumentAttributeName.DOCUMENT_HUB));
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/documents/search")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .param("carrierId", String.valueOf(carrier.getCarrierId()))
            .param("tag", DocumentAttributeName.DOCUMENT_HUB.getDisplayName())
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        DocumentDto[] response =
            jsonUtils.fromJson(result.getResponse().getContentAsString(), DocumentDto[].class);

        assertThat(response).hasSize(1);
        assertThat(response[0].getDocumentId()).isEqualTo(doc1.getDocumentId());
    }

    @Test
    public void getDocumentsByNameAndTags() throws Exception {
        Carrier carrier =
            testEntityHelper.createTestCarrier(Constants.UHC_CARRIER, Constants.UHC_CARRIER);

        Document doc1 = testEntityHelper.createTestDocument(carrier, "searchdoc1ument1");
        Document doc2 = testEntityHelper.createTestDocument(carrier, "searchdoc2ument2");
        Document doc3 = testEntityHelper.createTestDocument(carrier, "searchdoc1ument3");

        attributeRepository.save(new DocumentAttribute(doc1,DocumentAttributeName.DOCUMENT_HUB));
        attributeRepository.save(new DocumentAttribute(doc2,DocumentAttributeName.DOCUMENT_HUB));
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/documents/search")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .param("carrierId", String.valueOf(carrier.getCarrierId()))
            .param("fileName", "searchdoc1")
            .param("tag", DocumentAttributeName.DOCUMENT_HUB.getDisplayName())
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        DocumentDto[] response =
            jsonUtils.fromJson(result.getResponse().getContentAsString(), DocumentDto[].class);

        assertThat(response).hasSize(1);
        assertThat(response[0].getDocumentId()).isEqualTo(doc1.getDocumentId());
    }

    
    @Test
    public void getAllTagsTest() throws Exception {
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/documents/tags")
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        String[] response =
            jsonUtils.fromJson(result.getResponse().getContentAsString(), String[].class);
        
        assertThat(response).containsAll(Arrays
                .stream(DocumentAttributeName.values())
                .map(DocumentAttributeName::getDisplayName)
                .collect(Collectors.toList()));
        
    }

    @Test
    public void createTagTest() throws Exception {
        
        Carrier carrier = testEntityHelper.createTestCarrier(Constants.UHC_CARRIER, Constants.UHC_CARRIER);
        Document doc = testEntityHelper.createTestDocument(carrier, "searchdoc1ument");
        
        mockMvc.perform(MockMvcRequestBuilders.post("/admin/documents/tags/create")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .param("documentId", String.valueOf(doc.getDocumentId()))
                .param("tags", DocumentAttributeName.DOCUMENT_HUB.getDisplayName())
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();
        
        DocumentAttribute attribute = attributeRepository.findDocumentAttributeByDocumentIdAndName(
                        doc.getDocumentId(), 
                        DocumentAttributeName.DOCUMENT_HUB);
        assertThat(attribute).isNotNull();
    }
    
    @Test
    public void tagDeleteTest() throws Exception {
        
        Carrier carrier =
                testEntityHelper.createTestCarrier(Constants.UHC_CARRIER, Constants.UHC_CARRIER);
        Document doc = testEntityHelper.createTestDocument(carrier, "searchdoc1ument");
        attributeRepository.save(new DocumentAttribute(doc,DocumentAttributeName.BENEFIT_SUMMARY));
        
        mockMvc.perform(MockMvcRequestBuilders.delete("/admin/documents/tags/delete")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .param("documentId", String.valueOf(doc.getDocumentId()))
                .param("tags", DocumentAttributeName.BENEFIT_SUMMARY.getDisplayName())
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        DocumentAttribute attribute = attributeRepository.findDocumentAttributeByDocumentIdAndName(
                doc.getDocumentId(), 
                DocumentAttributeName.BENEFIT_SUMMARY);
        
        assertThat(attribute).isNull();
        
    }
    
    @Test
    public void upload_download_delete() throws Exception {
        Carrier carrier = testEntityHelper.createTestCarrier(
            fromStrings(appCarrier).name(),
            fromStrings(appCarrier).name()
        );

        String workingDir = System.getProperty("user.dir");
        String filePath = workingDir + "/src/test/resources/testUploadFile.txt";
        File file = new File(filePath);
        FileInputStream fis = new FileInputStream(file);

        MockMultipartFile mockFile =
            new MockMultipartFile("file", file.getName(), "text/plain", fis);

        when(s3FileManager.uploadCommonFile(anyString(), any(), anyString(), anyLong(), any(CarrierType.class)))
            .thenReturn("testS3Key", "test2S3Key");
        
        MvcResult result = mockMvc.perform(
            MockMvcRequestBuilders.fileUpload("/admin/documents/upload/{carrierId}",
                carrier.getCarrierId()
            )
                .file(mockFile)
                .param("tag", DocumentAttributeName.DOCUMENT_HUB.getDisplayName())
                .param("tag", DocumentAttributeName.BENEFIT_SUMMARY.getDisplayName())
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        DocumentDto createdDocument =
            jsonUtils.fromJson(result.getResponse().getContentAsString(), DocumentDto.class);
        assertThat(createdDocument).isNotNull();
        assertThat(createdDocument).hasNoNullFieldsOrProperties();
        assertThat(createdDocument.getCarrierId()).isEqualTo(carrier.getCarrierId());
        assertThat(createdDocument.getFileName()).isEqualTo("testUploadFile");
        assertThat(createdDocument.getFileExtension()).isEqualTo("txt");
        assertThat(createdDocument.getMimeType()).isEqualTo("text/plain");

        assertThat(createdDocument.getTags()).hasSize(2);
        assertThat(createdDocument.getTags()).containsExactlyInAnyOrder(
                DocumentAttributeName.DOCUMENT_HUB.getDisplayName(),
                DocumentAttributeName.BENEFIT_SUMMARY.getDisplayName());
        
        Document oldDoc = documentRepository.findOne(createdDocument.getDocumentId());
        assertThat(oldDoc).isNotNull();

        // upload duplicate
        result = mockMvc.perform(
            MockMvcRequestBuilders.fileUpload("/admin/documents/upload/{carrierId}",
                carrier.getCarrierId()
            )
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is5xxServerError())
            .andExpect(jsonPath("$.message").value("File with name=testUploadFile exists"))
            .andReturn();

        // override duplicate
        result = mockMvc.perform(
            MockMvcRequestBuilders.fileUpload("/admin/documents/upload/{carrierId}",
                carrier.getCarrierId()
            )
                .file(mockFile)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .param("override", "true")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        createdDocument =
            jsonUtils.fromJson(result.getResponse().getContentAsString(), DocumentDto.class);
        Document doc = documentRepository.findOne(createdDocument.getDocumentId());
        assertThat(doc).isNotNull();

        // check for override in DB and in S3

        createdDocument =
            jsonUtils.fromJson(result.getResponse().getContentAsString(), DocumentDto.class);
        assertThat(createdDocument).isNotNull();
        assertThat(oldDoc.getDocumentId()).isNotEqualTo(doc.getDocumentId());
        assertThat(oldDoc.getS3Key()).isNotEqualTo(doc.getS3Key());

        
        FileDto resp = new FileDto();
        resp.setContent(new byte[1]);
        resp.setSize(1L);
        resp.setType("text/plain");
        when(s3FileManager.download("test2S3Key")).thenReturn(resp);
        
        testDocumentFileDownload(doc.getDocumentId());

        testDocumentDelete(doc.getDocumentId(), doc.getS3Key(), fromStrings(appCarrier).name());

        s3FileManager.delete(doc.getS3Key(), fromStrings(carrier.getName()));
    }

    private void testDocumentFileDownload(Long documentId) throws Exception {
        MvcResult result = mockMvc.perform(
            MockMvcRequestBuilders.get("/admin/documents/{id}/download", documentId)
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().isOk()).andReturn();

        byte[] fileContent = result.getResponse().getContentAsByteArray();

        assertThat(fileContent).isNotEmpty();
    }

    private void testDocumentDelete(Long documentId, String s3key, String carrierName)
        throws Exception {
        MvcResult result =
            performDeleteAndAssertResult(StringUtils.EMPTY, "/admin/documents/{id}", documentId);

        // for real S3 test only
//        assertThatThrownBy(() -> s3FileManager.download(s3key, carrierName)).hasCauseInstanceOf(
//            AmazonS3Exception.class);

        Document doc = documentRepository.findOne(documentId);
        assertThat(doc).isNull();
    }
}
