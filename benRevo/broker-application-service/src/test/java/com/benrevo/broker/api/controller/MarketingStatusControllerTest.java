package com.benrevo.broker.api.controller;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.MarketingStatusDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.MarketingStatus;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.MarketingList;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.repository.MarketingListRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import java.util.ArrayList;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

public class MarketingStatusControllerTest extends AbstractControllerTest {

    @Autowired
    private MarketingStatusController marketingStatusController;
    
    @Autowired
    private MarketingListRepository marketingListRepository;
    
    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Before
    @Override
    public void init() {
        initController(marketingStatusController);
    }

    @Test
    public void getMarketingStatusList() throws Exception {
        Client client = testEntityHelper.createTestClient();
        MarketingList medicalStatus = testEntityHelper.createTestMarketingList(client, 
            CarrierType.OTHER.name(), Constants.MEDICAL, MarketingStatus.RFP_SUBMITTED);
        MarketingList dentalStatus = testEntityHelper.createTestMarketingList(client, 
            CarrierType.OTHER.name(), Constants.DENTAL, MarketingStatus.RFP_SUBMITTED);
        
        MvcResult result = performGetAndAssertResult(null, "/broker/clients/{clientId}/marketingStatusList", client.getClientId());
        MarketingStatusDto[] statuses = jsonUtils.fromJson(result.getResponse().getContentAsString(), MarketingStatusDto[].class);
        
        assertThat(statuses).hasSize(2);
        for(MarketingStatusDto status : statuses) {
            assertThat(status).hasNoNullFieldsOrProperties();
        }
    }
    
    @Test
    public void updateMarketingStatusList() throws Exception {
        Client client = testEntityHelper.createTestClient();
        
        MarketingList medicalStatus = testEntityHelper.createTestMarketingList(client, 
            CarrierType.OTHER.name(), Constants.MEDICAL, MarketingStatus.RFP_SUBMITTED);
        MarketingList dentalStatus = testEntityHelper.createTestMarketingList(client, 
            CarrierType.OTHER.name(), Constants.DENTAL, MarketingStatus.RFP_SUBMITTED);
        
        Carrier other = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.displayName);
        Carrier aetna = testEntityHelper.createTestCarrier(CarrierType.AETNA.name(), CarrierType.AETNA.displayName);
        
        // update OTHER.MEDICAL, OTHER.DENTAL -> OTHER.DENTAL, AETNA.VISION
        // expected: remove OTHER.MEDICAL, no changes on OTHER.DENTAL, add AETNA.VISION
        
        
        List<MarketingStatusDto> params = new ArrayList<>();
        MarketingStatusDto upd1 = new MarketingStatusDto();
        upd1.setCarrierId(other.getCarrierId());
        upd1.setProduct(Constants.DENTAL);
        params.add(upd1);
        MarketingStatusDto upd2 = new MarketingStatusDto();
        upd2.setCarrierId(aetna.getCarrierId());
        upd2.setProduct(Constants.VISION);
        params.add(upd2);
        
        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(params), null, 
            "/broker/clients/{clientId}/marketingStatusList", client.getClientId());
        
        MarketingStatusDto[] statuses = jsonUtils.fromJson(result.getResponse().getContentAsString(), MarketingStatusDto[].class);
        
        assertThat(statuses).hasSize(2);
        for(MarketingStatusDto status : statuses) {
            assertThat(status).hasNoNullFieldsOrProperties();
        }
        
        assertThat(statuses).extracting(MarketingStatusDto::getProduct)
            .containsExactlyInAnyOrder(Constants.DENTAL,  Constants.VISION);
        
        assertThat(statuses).extracting(MarketingStatusDto::getCarrierName)
            .containsExactlyInAnyOrder(CarrierType.OTHER.name(), CarrierType.AETNA.name());

    }


    @Test
    public void updateMarketingStatusList_remove_last_one() throws Exception {
        Client client = testEntityHelper.createTestClient();

        MarketingList medicalStatus = testEntityHelper.createTestMarketingList(client,
            CarrierType.OTHER.name(), Constants.MEDICAL, MarketingStatus.RFP_SUBMITTED);

        List<MarketingStatusDto> params = new ArrayList<>();

        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(params), null,
            "/broker/clients/{clientId}/marketingStatusList", client.getClientId());

        MarketingStatusDto[] statuses = jsonUtils.fromJson(result.getResponse().getContentAsString(), MarketingStatusDto[].class);

        assertThat(statuses).hasSize(0);

        List<MarketingList> dbMarketingStatuses = marketingListRepository.findByClientClientId(client.getClientId());
        assertThat(dbMarketingStatuses).hasSize(0);
    }
    
    @Test
    public void changeMarketingStatus() throws Exception {
        Client client = testEntityHelper.createTestClient();
        
        MarketingList medicalStatus = testEntityHelper.createTestMarketingList(client, 
            CarrierType.OTHER.name(), Constants.MEDICAL, MarketingStatus.RFP_SUBMITTED);

        MarketingStatusDto params = new MarketingStatusDto();
        params.setStatus(MarketingStatus.QUOTED);
        
        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(params), null, 
            "/broker/clients/marketingStatusList/{id}/changeStatus", medicalStatus.getMarketingListId());
        
        flushAndClear();
        
        medicalStatus = marketingListRepository.findOne(medicalStatus.getMarketingListId());
        assertThat(medicalStatus.getStatus()).isEqualTo(MarketingStatus.QUOTED);
        
        // check for created Option
        /* FIXME feature disabled now. See comment in the API implementation: 
         * MarketingStatusService.changeMarketingStatus
         * 
        List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);
        assertThat(options).hasSize(1);
        assertThat(options.get(0).getRfpQuoteOptionName()).isEqualTo("Option 1");  

        // create Ancillary product option 
        
        MarketingList lifeStatus = testEntityHelper.createTestMarketingList(client, 
                CarrierType.VOYA.name(), Constants.LIFE, MarketingStatus.RFP_SUBMITTED);
        
        result = performPutAndAssertResult(jsonUtils.toJson(params), null, 
                "/broker/clients/marketingStatusList/{id}/changeStatus", lifeStatus.getMarketingListId());
            
        flushAndClear();
        
        medicalStatus = marketingListRepository.findOne(lifeStatus.getMarketingListId());
        assertThat(lifeStatus.getStatus()).isEqualTo(MarketingStatus.QUOTED);
        
        // check for created Option
        
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), Constants.LIFE);
        assertThat(rfpQuotes).hasSize(1);
        List<RfpQuoteAncillaryOption> ancOptions = rfpQuoteAncillaryOptionRepository.findByRfpQuote(rfpQuotes.get(0));
        assertThat(ancOptions).hasSize(1);
        assertThat(ancOptions.get(0).getName()).isEqualTo("Option 1");  
        
        */
    }
}
