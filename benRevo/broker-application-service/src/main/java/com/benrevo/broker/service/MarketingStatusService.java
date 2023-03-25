package com.benrevo.broker.service;

import static com.benrevo.common.util.MapBuilder.field;

import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.rfp.service.RfpCarrierService;
import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.dto.MarketingStatusDto;
import com.benrevo.common.enums.MarketingStatus;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.exception.ValidationException;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.MarketingList;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.mapper.MapperUtil;
import com.benrevo.data.persistence.repository.MarketingListRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MarketingStatusService {

    @Autowired
    private RfpCarrierService rfpCarrierService;
    
    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;
    
    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;
    
    @Autowired
    private SharedRfpService sharedRfpService;
    
    @Autowired
    private RfpQuoteService rfpQuoteService;
    
    @Autowired
    private MarketingListRepository marketingListRepository;
    
    public List<MarketingStatusDto> getMarketingStatusList(Long clientId) {
        List<MarketingStatusDto> result = new ArrayList<>();
        List<MarketingList> items = marketingListRepository.findByClientClientId(clientId);
        for(MarketingList marketingList : items) {
            result.add(toDto(marketingList));
        }
        return result;
    }
    
    private MarketingStatusDto toDto(MarketingList entity) {
        MarketingStatusDto dto = new MarketingStatusDto();
        dto.setMarketingStatusId(entity.getMarketingListId());
        dto.setClientId(entity.getClient().getClientId());
        dto.setProduct(entity.getRfpCarrier().getCategory());
        dto.setStatus(entity.getStatus());
        dto.setCarrierId(entity.getRfpCarrier().getCarrier().getCarrierId());
        dto.setCarrierName(entity.getRfpCarrier().getCarrier().getName());
        dto.setCarrierDisplayName(entity.getRfpCarrier().getCarrier().getDisplayName());
        dto.setCarrierLogoUrl(SharedCarrierService.getOriginalImageUrl(dto.getCarrierName()));
        return dto;
    }
    
    public List<MarketingStatusDto> createOrUpdateMarketingStatusList(Long clientId, List<MarketingStatusDto> statusList, boolean shouldDeleteOldItems) {
        List<MarketingStatusDto> result = new ArrayList<>();
        List<MarketingList> oldItems = marketingListRepository.findByClientClientId(clientId);

        if(statusList.isEmpty() && CollectionUtils.isEmpty(oldItems)) {
            return result;
        }

        for(MarketingStatusDto newItem : statusList) {
            if(newItem.getCarrierId() == null || newItem.getProduct() == null) {
                throw new ValidationException("Missing one of required params: carrierId and product");
            }
            MarketingList oldItem = null;
            for(Iterator<MarketingList> it = oldItems.iterator(); it.hasNext();) {
                MarketingList item = it.next();
                if(item.getRfpCarrier().getCategory().equals(newItem.getProduct())
                        && item.getRfpCarrier().getCarrier().getCarrierId().equals(newItem.getCarrierId())) {
                    oldItem = item;
                    it.remove();
                    break;
                }
            }
            if(oldItem == null) {
                result.add(createMarketingStatus(clientId, newItem.getCarrierId(), newItem.getProduct()));
            } else {
                result.add(toDto(oldItem));
            }
        }

        if(shouldDeleteOldItems) {
            for (MarketingList marketingList : oldItems) {
                marketingListRepository.delete(marketingList.getMarketingListId());
            }
        }
        return result;
    }
    
    public MarketingStatusDto createMarketingStatus(Long clientId, Long carrierId, String product) {
        Client client = MapperUtil.clientFromId(clientId);

        // create rfp_carrier if needed
        RfpCarrier rfpCarrier = (RfpCarrier) rfpCarrierRepository.findByCarrierCarrierIdAndCategory(carrierId, product);
        if(rfpCarrier == null) {
            throw new NotFoundException("No RFP Carrier found")
                .withFields(field("category", product), field("carrier_id", carrierId));
        } 

        MarketingList newItem = new MarketingList();
        newItem.setClient(client);
        newItem.setRfpCarrier(rfpCarrier);
        newItem.setStatus(MarketingStatus.RFP_SUBMITTED);
        newItem = marketingListRepository.save(newItem);
        
        return toDto(newItem);
    }
    
    public void changeMarketingStatus(Long marketingStatusId, MarketingStatus newStatus) {
        MarketingList item = marketingListRepository.findOne(marketingStatusId);
        if(item == null) {
            throw new NotFoundException("MarketingStatus item not found by id: " + marketingStatusId);
        }
        if(newStatus != (item.getStatus())) {
            item.setStatus(newStatus);
            marketingListRepository.save(item);
            
            /* We want to disable the feature for the moment
    		 * https://app.asana.com/0/770041684515888/765383791070411/f 
    		
            if(newStatus == MarketingStatus.QUOTED) {
            	if(PlanCategory.isAncillary(item.getRfpCarrier().getCategory())) {
            		rfpQuoteService.createAncillaryQuoteOption(
            				item.getClient().getClientId(),
    	                    item.getRfpCarrier().getRfpCarrierId(),
    	                    null, // no displayName by default, because we do not know "Option N" name
    	                    QuoteType.STANDARD, OptionType.OPTION);
            	} else {
	                rfpQuoteService.createQuoteOption(
	                    item.getClient().getClientId(),
	                    item.getRfpCarrier().getRfpCarrierId(),
	                    null, // no displayName by default, because we do not know "Option N" name
	                    QuoteType.STANDARD, OptionType.OPTION);
	               
            	}
            }
            */
        }
    }
}
