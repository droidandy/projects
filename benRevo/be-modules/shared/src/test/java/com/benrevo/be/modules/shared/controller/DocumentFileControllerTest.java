package com.benrevo.be.modules.shared.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.benrevo.common.dto.DocumentDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.enums.DocumentAttributeName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Document;
import com.benrevo.data.persistence.entities.DocumentAttribute;
import com.benrevo.data.persistence.repository.AttributeRepository;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class DocumentFileControllerTest extends AbstractControllerTest {

  @Value("${app.carrier}")
  private String[] appCarrier;

  @Autowired
  private DocumentFileController documentFileController;
  
  @Autowired
  private AttributeRepository attributeRepository;

  @Before
  @Override
  public void init() {
    initController(documentFileController);
  }

  @Test
  public void downloadByName() throws Exception {

    MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/documents/download")
        .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
        .param("fileName", "Domestic Partner Comparison Chart")
        .accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk())
        .andReturn();

    byte[] fileContent = result.getResponse().getContentAsByteArray();

    assertThat(fileContent).isNotEmpty();
  }
  
  @Test
  public void download() throws Exception {

    FileDto testFile = new FileDto();
    testFile.setContent(new byte[1024]);
    testFile.setSize(1024L);
    testFile.setName("test");
    testFile.setType(MediaType.APPLICATION_PDF_VALUE);
    
    when(s3FileManager.download(anyString())).thenReturn(testFile);
    
    Carrier carrier = testEntityHelper.createTestCarrier(appCarrier[0], appCarrier[0]);
    Document doc = testEntityHelper.createTestDocument(carrier, "testDoc");
    
    MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/documents/{id}/download", doc.getDocumentId())
        .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
        .accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isOk())
        .andReturn();

    byte[] fileContent = result.getResponse().getContentAsByteArray();

    assertThat(fileContent).isNotEmpty();

  }
  
  @Test
  public void getDocumentsByTags() throws Exception {
      Carrier carrier =
          testEntityHelper.createTestCarrier(appCarrier[0], appCarrier[0]);

      int initialSize = getDocumentHubSize();
      Document doc1 = testEntityHelper.createTestDocument(carrier, "searchdoc1ument");
      Document doc2 = testEntityHelper.createTestDocument(carrier, "searchdoc2ument");
      attributeRepository.save(new DocumentAttribute(doc1,DocumentAttributeName.DOCUMENT_HUB));

      int newSize = getDocumentHubSize();
      Assert.assertEquals(newSize, initialSize + 1);
      //assertThat(response[0].getDocumentId()).isEqualTo(doc1.getDocumentId());
  }

  private int getDocumentHubSize() throws Exception {

      MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/documents/search")
          .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
          .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
          .param("tag", DocumentAttributeName.DOCUMENT_HUB.getDisplayName())
          .accept(MediaType.APPLICATION_JSON_UTF8))
          .andExpect(status().isOk())
          .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
          .andReturn();

      DocumentDto[] response = jsonUtils.fromJson(result.getResponse().getContentAsString(), DocumentDto[].class);

      return response.length;
  }
  
}
