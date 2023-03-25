package com.benrevo.dashboard.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.data.Offset.offset;
import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.util.Arrays;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import com.benrevo.be.modules.rfp.controller.RfpController;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CarrierHistoryDto;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.enums.RFPAttributeName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.CarrierHistory;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RFPAttribute;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.mapper.CarrierHistoryMapper;
import com.benrevo.data.persistence.mapper.OptionMapper;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;

public class AnthemDashboardRfpControllerTest extends AbstractControllerTest {
    
    @Autowired
    private TestEntityHelper testEntityHelper;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;
    
    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private RfpController controller;
    
    @Before
    public void init() {
        initController(controller);
    }

    @Test
    public void createRFP_Life_STD_LTD_with_Attribute() throws Exception {	
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        RfpDto lifeRfpDto = new RfpDto();
        lifeRfpDto.setClientId(client.getClientId());
        lifeRfpDto.setProduct(Constants.LIFE);
        lifeRfpDto.setCommission("10%");
        lifeRfpDto.setContributionType("VOLUNTARY");
        lifeRfpDto.getAttributes().put(RFPAttributeName.CENSUS_PASSWORD, "TEST CENSUS PASSWORD");
        
        RfpDto ltdRfpDto = new RfpDto();
        ltdRfpDto.setClientId(client.getClientId());
        ltdRfpDto.setProduct(Constants.LTD);
        ltdRfpDto.setCommission("15%");
        ltdRfpDto.setContributionType("%");
        ltdRfpDto.getAttributes().put(RFPAttributeName.CENSUS_PASSWORD, "TEST CENSUS PASSWORD2");
        
        List<RfpDto> createParams = Arrays.asList(lifeRfpDto, ltdRfpDto);
        
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(createParams), null, "/v1/clients/{id}/rfps", client.getClientId());
        RfpDto[] response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RfpDto[].class);
        assertThat(response).hasSize(2);
        for (RfpDto rfp : response) {
        	if(rfp.getProduct().equals(Constants.LIFE)) {
        		assertThat(rfp.getCommission()).isEqualTo(lifeRfpDto.getCommission());
        	} else if(rfp.getProduct().equals(Constants.LTD)) {
        	    assertThat(rfp.getCommission()).isEqualTo(ltdRfpDto.getCommission());
        	} else {
        	}
		}  
    }
    
    @Test
    public void createRFPWithArttributes() throws Exception {

        Client client = testEntityHelper.createTestClient();
        RFP created = testEntityHelper.createTestRFPWithOptionsAndCarrierHistory(client);
        created.getAttributes().add(new RFPAttribute(created, RFPAttributeName.TYPE_OF_PLAN, "Calendar Year"));
        created.getAttributes().add(new RFPAttribute(created, RFPAttributeName.CONTRACT_LENGTH_12_MONTHS, "true"));

        RfpDto expectedRfpDto = RfpMapper.rfpToDTO(created);
        RfpDto rfpDto = RfpMapper.rfpToDTO(created);

        rfpDto.setId(null);
        rfpDto.getCarrierHistories().forEach(carrierHistoryDto -> carrierHistoryDto.setId(null));
        rfpDto.getOptions().forEach(optionDto -> optionDto.setId(null));
        rfpDto.setProduct("DENTAL");
        
        expectedRfpDto.setId(expectedRfpDto.getId() + 1L);
        expectedRfpDto.getCarrierHistories().forEach(carrierHistoryDto -> {
            carrierHistoryDto.setId(carrierHistoryDto.getId() + expectedRfpDto.getCarrierHistories().size());
            carrierHistoryDto.setRfpId(carrierHistoryDto.getRfpId() + 1);
        });
        expectedRfpDto.getOptions().forEach(optionDto -> {
            optionDto.setId(optionDto.getId() + expectedRfpDto.getOptions().size());
            optionDto.setRfpId(optionDto.getRfpId() + 1);
        });
        expectedRfpDto.setProduct("DENTAL");

        String content = "[" + jsonUtils.toJson(rfpDto) + "]";
        
        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/v1/clients/{id}/rfps", client.getClientId())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(content)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        String body = result.getResponse().getContentAsString();

        RfpDto[] rfps = jsonUtils.fromJson(body, RfpDto[].class);
        assertThat(rfps).hasSize(1);

        assertThat(rfps[0].getOptions().get(0).getTier1Census())
                .isEqualTo(rfpDto.getOptions().get(0).getTier1Census(), offset(0.01));
        
        String date = rfps[0].getLastUpdated();
        expectedRfpDto.setLastUpdated(date);
        assertEquals("[" + jsonUtils.toJson(expectedRfpDto) + "]", body);
    }

    @Test
    public void getRFPWithArttributes() throws Exception {

        Client client = testEntityHelper.createTestClient();
        RFP created = testEntityHelper.createTestRFPWithOptionsAndCarrierHistory(client);
        created.getAttributes().add(new RFPAttribute(created, RFPAttributeName.INVALID_WAIVERS, "40"));
        created.getAttributes().add(new RFPAttribute(created, RFPAttributeName.VALID_WAIVERS, "0"));

        
        token = createToken(client.getBroker().getBrokerToken());
        
        MvcResult result = performGetAndAssertResult(null, "/v1/clients/{id}/rfps", client.getClientId());
            
        String body = result.getResponse().getContentAsString();

        RfpDto[] rfps = jsonUtils.fromJson(body, RfpDto[].class);

        assertThat(rfps).hasSize(1);

        assertThat(rfps[0].getAttributes()).containsKey(RFPAttributeName.FACTOR_LOAD_ALONGSIDE_HMO);
        assertThat(rfps[0].getAttributes()).containsKey(RFPAttributeName.FACTOR_LOAD_ALONGSIDE_PPO);
        assertThat(rfps[0].getAttributes()).containsKey(RFPAttributeName.FACTOR_LOAD_TAKEOVER_HMO);
        assertThat(rfps[0].getAttributes()).containsKey(RFPAttributeName.FACTOR_LOAD_TAKEOVER_PPO);
    }

    
    @Test
    public void createRFPWithWrongArttributes() throws Exception {

        Client client = testEntityHelper.createTestClient();
        RFP created = testEntityHelper.createTestRFPWithOptionsAndCarrierHistory(client);
        created.getAttributes().add(new RFPAttribute(created, RFPAttributeName.INVALID_WAIVERS, "Calendar Year"));

        RfpDto rfpDto = RfpMapper.rfpToDTO(created);

        rfpDto.setId(null);
        rfpDto.getCarrierHistories().forEach(carrierHistoryDto -> carrierHistoryDto.setId(null));
        rfpDto.getOptions().forEach(optionDto -> optionDto.setId(null));
        rfpDto.setProduct("DENTAL");
        
        String content = "[" + jsonUtils.toJson(rfpDto) + "]";
        
        token = createToken(client.getBroker().getBrokerToken());
        mockMvc.perform(MockMvcRequestBuilders.post("/v1/clients/{id}/rfps", client.getClientId())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(content)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is4xxClientError());


    }

    @Test
    public void updateRFPWithAttributes() throws Exception {

        Client client = testEntityHelper.createTestClient();
        RFP rfp = testEntityHelper.createTestRFPWithOptionsAndCarrierHistory(client);
        testEntityHelper.createTestRfpAttribute(rfp, RFPAttributeName.TEXT_UW_COMMENTS, "test comments");
        testEntityHelper.createTestRfpAttribute(rfp, RFPAttributeName.FIXED_UW_COMMENTS, "Other");

        List<Option> options = rfp.getOptions();

        Option updatedOption = options.get(0);
        updatedOption.setAltRequest("Updated");

        Option newOption = testEntityHelper.buildTestRfpOption(rfp);

        OptionDto newOptionDto = OptionMapper.optionToDTO(newOption);
        newOptionDto.setId(null);

        OptionDto newOptionDtoExpected = OptionMapper.optionToDTO(newOption);
        List<OptionDto> optionDtos = OptionMapper.optionsToDTOs(options);
        optionDtos.add(newOptionDto);

        List<OptionDto> optionDtosExpected = OptionMapper.optionsToDTOs(options);
        newOptionDtoExpected.setId(updatedOption.getId() + 3);
        optionDtosExpected.add(newOptionDtoExpected);

        List<CarrierHistory> histories = rfp.getCarrierHistories();
        CarrierHistory updatedHistory = histories.get(0);
        updatedHistory.setName("Updated");

        CarrierHistory newHistory = testEntityHelper.buildTestRfpCarrierHistory(rfp);

        CarrierHistoryDto newHistoryDto = CarrierHistoryMapper.toDto(newHistory);
        newHistoryDto.setId(null);

        CarrierHistoryDto newHistoryDtoExpected = CarrierHistoryMapper.toDto(newHistory);
        List<CarrierHistoryDto> historyDtos = CarrierHistoryMapper.toDTOs(histories);
        historyDtos.add(newHistoryDto);

        List<CarrierHistoryDto> historyDtosExpected = CarrierHistoryMapper.toDTOs(histories);
        newHistoryDtoExpected.setId(updatedHistory.getId() + 1l);
        historyDtosExpected.add(newHistoryDtoExpected);

        RfpDto rfpDto = RfpMapper.rfpToDTO(rfp);
        RfpDto rfpDtoExpected = RfpMapper.rfpToDTO(rfp);
        rfpDto.setComments("UPDATED1");
        rfpDtoExpected.setComments("UPDATED1");
        rfpDto.setOptions(optionDtos);
        rfpDtoExpected.setOptions(optionDtosExpected);
        rfpDto.getAttributes().remove(RFPAttributeName.FIXED_UW_COMMENTS);
        rfpDtoExpected.getAttributes().remove(RFPAttributeName.FIXED_UW_COMMENTS);
        rfpDto.getAttributes().put(RFPAttributeName.KAISER_OR_SIMNSA, "N/A");
        rfpDtoExpected.getAttributes().put(RFPAttributeName.KAISER_OR_SIMNSA, "N/A");
        rfpDto.getAttributes().put(RFPAttributeName.TEXT_UW_COMMENTS, "updated comments");
        rfpDtoExpected.getAttributes().put(RFPAttributeName.TEXT_UW_COMMENTS, "updated comments");

        rfpDto.setCarrierHistories(historyDtos);

        RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(Constants.UHC_CARRIER, Constants.MEDICAL);
        if(rfpCarrier == null){
            Carrier carrier = carrierRepository.findByName(Constants.UHC_CARRIER);
            rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        }
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);
        
        String content = "[" + jsonUtils.toJson(rfpDto) + "]";
        
        flushAndClear();
        
        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.put("/v1/clients/{id}/rfps", client.getClientId())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .content(content)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
            .andReturn();

        flushAndClear();

        String body = result.getResponse().getContentAsString();

        RfpDto[] rfps = jsonUtils.fromJson(body, RfpDto[].class);
        
        assertThat(rfps).hasSize(1);
        String date = rfps[0].getLastUpdated();

        for(CarrierHistoryDto dto : historyDtosExpected) {
            dto.setId(dto.getId());
        }

        rfpDtoExpected.setCarrierHistories(historyDtosExpected);
        rfpDtoExpected.setLastUpdated(date);
        RfpSubmissionStatusDto rfpSubmissionStatusDto = new RfpSubmissionStatusDto(false,
            rfpSubmission.getSubmittedDate(),
            rfpSubmission.getRfpCarrier().getCarrier().getCarrierId(),
            rfpSubmission.getRfpCarrier().getCarrier().getName(),
            rfpSubmission.getRfpCarrier().getCategory());
        rfpSubmissionStatusDto.setType("STANDARD");
        rfpDtoExpected.getSubmissionStatuses().add(rfpSubmissionStatusDto);
        
        assertEquals("[" + jsonUtils.toJson(rfpDtoExpected) + "]", body);
        
        RfpDto[] response = jsonUtils.fromJson(body, RfpDto[].class);
        assertThat(response).hasSize(1);
        assertThat(response[0].getSubmissionStatuses()).isNotNull();
        assertThat(response[0].getSubmissionStatuses()).isNotEmpty();
    }

}
