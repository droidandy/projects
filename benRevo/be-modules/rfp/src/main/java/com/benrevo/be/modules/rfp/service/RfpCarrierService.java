package com.benrevo.be.modules.rfp.service;

import com.benrevo.be.modules.shared.service.SharedBrokerService;
import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.common.dto.CarrierToEmails;
import com.benrevo.common.dto.NetworkDto;
import com.benrevo.common.dto.RfpCarrierDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.mapper.MapperUtil;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.RequestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.benrevo.common.enums.CarrierType.MULTIPLE_CARRIERS;
import static com.benrevo.common.enums.CarrierType.isCarrierNameAppCarrier;
import static com.benrevo.common.enums.CarrierType.isCarrierNameOnboardedAppCarrier;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.ObjectMapperUtils.*;
import static java.util.stream.Collectors.toList;

@Service
@Transactional
public class RfpCarrierService {

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;
    
    @Autowired
    private CarrierRepository carrierRepository;
    
    @Autowired
    private SharedCarrierService sharedCarrierService;
    
    @Autowired
    private SharedBrokerService sharedBrokerService;
    
    @Autowired
    private NetworkRepository networkRepository;

    public List<NetworkDto> getRfpCarrierNetworks(Long rfpCarrierId, String networkType) {
        RfpCarrier rfpCarrier = rfpCarrierRepository.findOne(rfpCarrierId);

        if(rfpCarrier == null) {
            throw new NotFoundException("RFP carrier not found")
                .withFields(
                    field("rfp_carrier_id", rfpCarrierId)
                );
        }

        List<Network> networks = networkRepository.findByTypeAndCarrier(networkType, rfpCarrier.getCarrier());

        if(networks == null) {
            throw new NotFoundException("No networks found")
                .withFields(
                    field("network_type", networkType),
                    field("rfp_carrier_id", rfpCarrierId)
                );
        }

        /* looks like the old code used when there was no networkType parameter
        networks = networks.stream()
            .filter(n -> !n.getType().startsWith("RX_"))
            .collect(toList());
         */
        return mapAll(networks, NetworkDto.class);
    }

    public List<RfpCarrierDto> getRfpCarriers(String category) {
        List<RfpCarrier> rfpCarriers = rfpCarrierRepository.findByCategoryOrderByCarrierDisplayNameAsc(category);
        
        // filter by approved list from broker config
        List<CarrierToEmails> approvedCarriers = sharedBrokerService.getBrokerCarriers(sharedBrokerService.getCurrentContextBroker().getBrokerId());
        if(!approvedCarriers.isEmpty()) {
            Set<Long> approved = approvedCarriers.stream()
                .filter(CarrierToEmails::isApproved)
                .map(CarrierToEmails::getCarrierId)
                .collect(Collectors.toSet());
            rfpCarriers.stream()
                .filter(c -> approved.contains(c.getCarrier()))
                .collect(Collectors.toList());
        }
        
        List<RfpCarrierDto> result = new ArrayList<>(rfpCarriers.size());
        for(RfpCarrier carrier : rfpCarriers) {
            if(carrier.getCarrier().getName().equals(MULTIPLE_CARRIERS.name())) {
                continue;
            }
            RfpCarrierDto dto = mapToDto(carrier);
            result.add(dto);
        }

        return result;
    }
    
    private RfpCarrierDto mapToDto(RfpCarrier rfpCarrier) {
        RfpCarrierDto dto = map(rfpCarrier, RfpCarrierDto.class);
        
        dto.getCarrier().setLogoUrl(sharedCarrierService.getLogoUrl(dto.getCarrier().getName()));
        dto.getCarrier().setLogoWKaiserUrl(sharedCarrierService.getLogoUrl(dto.getCarrier().getName() + "_KAISER"));
        dto.getCarrier().setOriginalImageUrl(sharedCarrierService.getOriginalImageUrl(dto.getCarrier().getName()));
        dto.getCarrier().setOriginalImageKaiserUrl(sharedCarrierService.getOriginalImageUrl(dto.getCarrier().getName() + "_KAISER"));
        
        return dto;
    }
    
    public RfpCarrierDto createRfpCarrier(String category, Long carrierId) {
        Carrier carrier = carrierRepository.findOne(carrierId);
        if(carrier == null) {
            throw new NotFoundException("Carrier found").withFields(field("carrier_id", carrierId));
        }
        RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(carrier.getName(), category);
        if(rfpCarrier != null) {
            throw new BaseException("RfpCarrier already exists")
            .withFields(field("carrier_id", carrierId), field("category", category));
        }
        rfpCarrier = new RfpCarrier();
        rfpCarrier.setCarrier(carrier);
        rfpCarrier.setCategory(category);
        
        rfpCarrier = rfpCarrierRepository.save(rfpCarrier);
        
        return mapToDto(rfpCarrier);
    }
    
    public void deleteRfpCarrier(String category, Long carrierId) {
        List<RfpCarrier> rfpCarriers = rfpCarrierRepository.findByCarrierCarrierId(carrierId);
        for(RfpCarrier rfpCarrier : rfpCarriers) {
            if(rfpCarrier.getCategory().equals(category)) {
                rfpCarrierRepository.delete(rfpCarrier.getRfpCarrierId());
            }
        }
    }
    
}