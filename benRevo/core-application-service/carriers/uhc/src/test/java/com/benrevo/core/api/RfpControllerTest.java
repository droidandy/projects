package com.benrevo.core.api;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.rfp.controller.RfpController;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.*;
import com.benrevo.common.dto.ancillary.*;
import com.benrevo.common.enums.BrokerConfigType;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.enums.ClientFileType;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.core.UHCCoreServiceApplication;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.mapper.CarrierHistoryMapper;
import com.benrevo.data.persistence.mapper.OptionMapper;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.google.common.collect.Lists;
import org.docx4j.convert.in.xhtml.XHTMLImporterImpl;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;
import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;

import java.util.*;
import java.util.stream.Collectors;

import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.data.Offset.offset;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// TODO: Account for other carriers in this test!
@SpringBootTest(classes = UHCCoreServiceApplication.class)
public class RfpControllerTest extends AbstractControllerTest {
    
    static {
        // suppress "No mapping for" warning
        XHTMLImporterImpl.addFontMapping("OpenSansBold", "");
        XHTMLImporterImpl.addFontMapping("OpenSansRegular_0", "");
    }

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private TestEntityHelper testEntityHelper;

    @Autowired
    private RfpSubmissionRepository submissionRepository;
    
    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;
    
    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private RfpController controller;
       
    @Before
    public void init() throws Auth0Exception {
        initController(controller);
        
        User user = new User("test");
        user.setEmail("test@domain.test");
        user.setUserMetadata( build( entry("first_name", "FirstName"), entry("last_name", "LastName") ) );

        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);

    }

    @Test
    public void getRfpById() throws Exception {
        RFP rfp = testEntityHelper.createTestRFP();
        token = createToken(rfp.getClient().getBroker().getBrokerToken());
        performGetAndAssertResult(RfpMapper.rfpToDTO(rfp), "/v1/rfps/{id}", rfp.getRfpId());
    }

    @Test
    public void getRfpById_Life_STD_LTD() throws Exception {
    	Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        
        for (String product : Arrays.asList(Constants.LIFE, Constants.STD, Constants.LTD)) {
        	
        	RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(Constants.UHC_CARRIER, product);
            if(rfpCarrier == null){
                Carrier carrier = carrierRepository.findByName(Constants.UHC_CARRIER);
                rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, product);
            }
            
        	RFP createdRfp = testEntityHelper.createTestRFP(client, product);
        	createdRfp = rfpRepository.save(createdRfp);

            MvcResult result = performGetAndAssertResult(null, "/v1/rfps/{id}", createdRfp.getRfpId());
            RfpDto response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpDto.class);
            RfpDto expectedDto = RfpMapper.rfpToDTO(createdRfp);
            
            assertThat(response).isEqualToComparingFieldByFieldRecursively(expectedDto);
		}   
    }
    
    @Test
    public void createRFP() throws Exception {

        Client client = testEntityHelper.createTestClient();
        RFP created = testEntityHelper.createTestRFPWithOptionsAndCarrierHistory(client);
        RfpDto rfpDto = RfpMapper.rfpToDTO(created);

        rfpDto.setId(null);
        rfpDto.getCarrierHistories().forEach(carrierHistoryDto -> carrierHistoryDto.setId(null));
        rfpDto.getOptions().forEach(optionDto -> optionDto.setId(null));
        rfpDto.setProduct("DENTAL");
        
        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(Arrays.asList(rfpDto)), 
        		null, "/v1/clients/{id}/rfps", client.getClientId());

        String body = result.getResponse().getContentAsString();
        RfpDto[] rfps = jsonUtils.fromJson(body, RfpDto[].class);
        assertThat(rfps).hasSize(1);
        assertThat(rfps[0]).isEqualToIgnoringGivenFields(rfpDto, "id", "lastUpdated", "options", "carrierHistories", "submissionStatuses");
        assertThat(rfps[0].getLastUpdated()).isNotNull();
        assertThat(rfps[0].getOptions()).usingElementComparatorIgnoringFields("id", "rfpId")
    		.isEqualTo(rfpDto.getOptions());
        assertThat(rfps[0].getCarrierHistories()).usingElementComparatorIgnoringFields("id", "rfpId")
			.isEqualTo(rfpDto.getCarrierHistories());
    }

    @Test
    public void updateRFP() throws Exception {

        Client client = testEntityHelper.createTestClient();
        RFP rfp = testEntityHelper.createTestRFPWithOptionsAndCarrierHistory(client);
        List<Option> options = rfp.getOptions();

        Option updatedOption = options.get(0);
        updatedOption.setAltRequest("Updated");

        Option newOption = testEntityHelper.buildTestRfpOption(rfp);

        OptionDto newOptionDto = OptionMapper.optionToDTO(newOption);
        newOptionDto.setId(null);

        List<OptionDto> optionDtos = OptionMapper.optionsToDTOs(options);
        optionDtos.add(newOptionDto);

        List<CarrierHistory> histories = rfp.getCarrierHistories();
        CarrierHistory updatedHistory = histories.get(0);
        updatedHistory.setName("Updated");

        CarrierHistory newHistory = testEntityHelper.buildTestRfpCarrierHistory(rfp);

        CarrierHistoryDto newHistoryDto = CarrierHistoryMapper.toDto(newHistory);
        newHistoryDto.setId(null);

        List<CarrierHistoryDto> historyDtos = CarrierHistoryMapper.toDTOs(histories);
        historyDtos.add(newHistoryDto);

        RfpDto rfpDto = RfpMapper.rfpToDTO(rfp);
        rfpDto.setComments("UPDATED1");
        rfpDto.setOptions(optionDtos);

        rfpDto.setCarrierHistories(historyDtos);

        RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(Constants.UHC_CARRIER, Constants.MEDICAL);
        if(rfpCarrier == null){
            Carrier carrier = carrierRepository.findByName(Constants.UHC_CARRIER);
            rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        }
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);
        
        RfpSubmissionStatusDto expectedStatus = new RfpSubmissionStatusDto(false,
                rfpSubmission.getSubmittedDate(),
                rfpSubmission.getRfpCarrier().getCarrier().getCarrierId(),
                rfpSubmission.getRfpCarrier().getCarrier().getName(),
                rfpSubmission.getRfpCarrier().getCategory());
        expectedStatus.setType("STANDARD"); 
            
        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(Arrays.asList(rfpDto)), null, 
        		"/v1/clients/{id}/rfps", client.getClientId());

        String body = result.getResponse().getContentAsString();

        RfpDto[] response = jsonUtils.fromJson(body, RfpDto[].class);
        assertThat(response).hasSize(1);
        assertThat(response[0]).isEqualToIgnoringGivenFields(rfpDto, 
        		"id", "lastUpdated", "options", "carrierHistories", "submissionStatuses");
        assertThat(response[0].getLastUpdated()).isNotNull();
        assertThat(response[0].getOptions()).usingElementComparatorIgnoringFields("id")
        	.isEqualTo(optionDtos);
        assertThat(response[0].getCarrierHistories()).usingElementComparatorIgnoringFields("id")
    		.isEqualTo(historyDtos);
        assertThat(response[0].getSubmissionStatuses()).usingFieldByFieldElementComparator()
        	.isEqualTo(Arrays.asList(expectedStatus));
    }

    @Test
    public void getRfpByType() throws Exception {
        Client client = testEntityHelper.createTestClient();
        RFP newRfp = testEntityHelper.createTestRFP(client);
        RFP rfp = rfpRepository.findByClientClientIdAndProduct(newRfp.getClient().getClientId(), newRfp.getProduct());
        token = createToken(client.getBroker().getBrokerToken());
        performGetAndAssertResult(RfpMapper.rfpToDTO(rfp), "/v1/clients/{id}/rfps/{type}", newRfp.getClient().getClientId(), newRfp.getProduct());
    }

    @Test
    public void getRfpByClient() throws Exception {
        Client client = testEntityHelper.createTestClient();
        RFP rfp = testEntityHelper.createTestRFP(client);
        RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(Constants.UHC_CARRIER, Constants.MEDICAL);
        if(rfpCarrier == null){
            Carrier carrier = carrierRepository.findByName(Constants.UHC_CARRIER);
            rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        }
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);
        token = createToken(client.getBroker().getBrokerToken());
        
        MvcResult result = performGetAndAssertResult(null, "/v1/clients/{id}/rfps", client.getClientId());
        
        RfpDto[] rfpDtos = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpDto[].class);

        assertThat(rfpDtos[0].getSubmissionStatuses()).isNotNull();
        
    }

    @Test
    public void submitRfps() throws Exception {
        Client client = testEntityHelper.createTestClient();
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        testEntityHelper.createTestBrokerConfig(
                client.getBroker(),
                BrokerConfigType.LANGUAGE,
                "<table><tr><td>test <br/><strong>Language</strong></td></tr></table>");
        
        token = createToken(client.getBroker().getBrokerToken());
        mockMvc.perform(MockMvcRequestBuilders.post("/v1/clients/{id}/rfps/submit", client.getClientId())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .param("rfpIds", getCommaSeparatedRFPIds(rfps))
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andReturn();

        List<RfpSubmission> rfpSubmissions = submissionRepository.findByClient(client);
        Assert.assertEquals(rfpSubmissions.size(), rfps.size());
    
        for ( RfpSubmission rfpSubmission : rfpSubmissions) {
            Assert.assertEquals("test@domain.test",rfpSubmission.getSubmittedBy());
        }

        ArgumentCaptor<List<AttachmentDto>> listAttachmentCaptor  = ArgumentCaptor.forClass((Class) List.class);
        verify(smtpMailer, times(1)).send(anyObject(), listAttachmentCaptor.capture());
        
        List<List<AttachmentDto>> values = listAttachmentCaptor.getAllValues();
        Assert.assertEquals(values.size(), 1);
        
        List<AttachmentDto> attachs = values.get(0);
        
        Assert.assertEquals(attachs.size(), 1);
        AttachmentDto attach = attachs.get(0);
        Assert.assertEquals(attach.getFileName(),"RFP.pdf");
        
        // uncomment for manual testing
        //File pdf = new File("testSubmitRfps-RFP.pdf");
        //FileUtils.writeByteArrayToFile(pdf, attach.getContent());
        
        mockMvc.perform(MockMvcRequestBuilders.post("/v1/clients/{id}/rfps/submit", client.getClientId())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .param("rfpIds", "")
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isBadRequest())
            .andReturn();
    }

    @Test
    public void submitRfpsWithClientTeamTest() throws Exception {
        Client client = testEntityHelper.createTestClient();
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        testEntityHelper.createClientTeam(client.getBroker(), client);
        token = createToken(client.getBroker().getBrokerToken());
        
        List<MailDto> mailDtos = new ArrayList<>();
        List<List<AttachmentDto>> attachsList = new ArrayList<>();
        doAnswer(invocation -> {
                final MailDto mailDto = invocation.getArgumentAt(0, MailDto.class);
                List<AttachmentDto> attachs = invocation.getArgumentAt(1, List.class);
                // make deep copy, because Mockito captures only references
                MailDto copyMailDto = new MailDto();
                copyMailDto.setSubject(mailDto.getSubject());
                copyMailDto.setContent(mailDto.getContent());
                mailDtos.add(copyMailDto);
                attachsList.add(attachs);
                return null;
        }).when(smtpMailer).send(anyObject(), anyObject());
        
        performPostWithParamsAndAssertResult(
                null, 
                null, 
                "/v1/clients/{id}/rfps/submit", 
                new Object[] {"rfpIds", getCommaSeparatedRFPIds(rfps)}, 
                client.getClientId());
        
        assertThat(attachsList.size()).isEqualTo(2);
        assertThat(mailDtos.size()).isEqualTo(2);
        
        MailDto mailToCarrierDto = mailDtos.get(0);
        assertThat(mailToCarrierDto.getSubject()).contains(client.getClientName());
        // uncomment for manual testing
        //FileUtils.writeByteArrayToFile(new File("submitRfpsWithClientTeamTest-MailToCarrier.html" ), 
        //        mailToCarrierDto.getContent().getBytes());

        MailDto mailToTeamDto = mailDtos.get(1);
        assertThat(mailToTeamDto.getSubject()).contains(client.getClientName());
        // uncomment for manual testing
        //FileUtils.writeByteArrayToFile(new File("submitRfpsWithClientTeamTest-MailToTeam.html" ), 
        //        mailToTeamDto.getContent().getBytes());

    }
    
    private String getCommaSeparatedRFPIds(List<RFP> rfps){
        StringJoiner joiner = new StringJoiner(",");
        for(RFP rfp : rfps){
            joiner.add(String.valueOf(rfp.getRfpId()));
        }
        return joiner.toString();
    }
    
    @Test
    public void generateRFPDOCXPreview() throws Exception {
    	Client client = testEntityHelper.createTestClient();
        ClientTeam clientTeam1 = testEntityHelper.createClientTeam(client.getBroker(), client);
        ClientTeam clientTeam2 = testEntityHelper.createClientTeam(client.getBroker(), client);
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        String rfpIdsParam = rfps.stream().map(r -> r.getRfpId().toString()).collect(Collectors.joining(","));
        token = createToken(client.getBroker().getBrokerToken());
        
        testEntityHelper.createTestBrokerConfig(
                client.getBroker(),
                BrokerConfigType.LANGUAGE,
                "<table><tr><td>test <br/><strong>Language</strong></td></tr></table>");
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{id}/rfps/all/docx/", client.getClientId())
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .param("rfpIds", rfpIdsParam)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .accept(RfpController.APPLICATION_DOCX_VALUE))
                .andExpect(status().is2xxSuccessful())
                .andReturn();
        byte[] response = result.getResponse().getContentAsByteArray();
        
        assertThat(response).isNotEmpty();
        
        // uncomment for manual testing
        //File docx = new File("testGenerateRFPPDFPreview-RFP.docx");
        //FileUtils.writeByteArrayToFile(docx, result.getResponse().getContentAsByteArray() );
        
    }

    @Test
    public void generateRFPPDFPreview() throws Exception {
        Client client = testEntityHelper.createTestClient();
        ClientTeam clientTeam1 = testEntityHelper.createClientTeam(client.getBroker(), client);
        ClientTeam clientTeam2 = testEntityHelper.createClientTeam(client.getBroker(), client);
        List<RFP> rfps = testEntityHelper.createTestRFPs(client);
        token = createToken(client.getBroker().getBrokerToken());
        
        testEntityHelper.createTestBrokerConfig(
                client.getBroker(),
                BrokerConfigType.LANGUAGE,
                "<table><tr><td>test <br/><strong>Language</strong></td></tr></table>");
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{id}/rfps/all/pdf/", client.getClientId())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .param("rfpIds", getCommaSeparatedRFPIds(rfps))
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_PDF))
            .andExpect(status().is2xxSuccessful())
            .andReturn();
        
        // uncomment for manual testing
        //File pdf = new File("testGenerateRFPPDFPreview-RFP.pdf");
        //FileUtils.writeByteArrayToFile(pdf, result.getResponse().getContentAsByteArray() );

        mockMvc.perform(MockMvcRequestBuilders.get("/v1/clients/{id}/rfps/all/pdf/", client.getClientId())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .param("rfpIds", "")
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_PDF))
            .andExpect(status().isBadRequest())
            .andReturn();
    }

    @Test
    public void  testGetCensusUHCNorthBrokerMemberLevel() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("testBrokerName", BrokerLocale.NORTH);
        Client client = testEntityHelper.createTestClient("testClientName", broker);
        token = createToken(broker.getBrokerToken());

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/rfps/census")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8)
                .param("clientId", client.getClientId().toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        CensusInfoDto censusInfoDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), CensusInfoDto.class);
        assertNotNull(censusInfoDto);
        assertEquals(ClientFileType.MEMBER, censusInfoDto.getType());
    }
}
