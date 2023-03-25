package com.benrevo.be.modules.shared.service;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.AdministrativeFeeDto;
import com.benrevo.common.dto.CarrierByProductDto;
import com.benrevo.common.dto.CarrierDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.common.util.RequestUtils;
import com.benrevo.data.persistence.entities.AdministrativeFee;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.CarrierHistory;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.mapper.NetworkMapper;
import com.benrevo.data.persistence.repository.*;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static com.benrevo.common.enums.CarrierType.MULTIPLE_CARRIERS;
import static com.benrevo.common.enums.CarrierType.isCarrierNameAppCarrier;
import static com.benrevo.common.enums.CarrierType.isCarrierNameOnboardedAppCarrier;
import static com.benrevo.common.util.MapBuilder.field;
import static org.apache.commons.lang3.StringUtils.equalsAnyIgnoreCase;

@Service
@Transactional
public class SharedCarrierService {

    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private CarrierHistoryRepository carrierHistoryRepository;
    
    @Autowired
    private AdministrativeFeeRepository administrativeFeeRepository;
    
    @Autowired
    private NetworkRepository networkRepository;

	@Value("${app.carrier}")
	String[] appCarrier;

    public List<AdministrativeFeeDto> getCarriersAdministrativeFees(Long carrierId) {
    	List<AdministrativeFee> fees = administrativeFeeRepository.findByCarrierCarrierId(carrierId);
    	List<AdministrativeFeeDto> result = new ArrayList<>(fees.size());
    	for (AdministrativeFee fee : fees) {
    		AdministrativeFeeDto dto = ObjectMapperUtils.map(fee, AdministrativeFeeDto.class);
    		dto.setCarrierId(fee.getCarrier().getCarrierId());
    		result.add(dto);
		}
    	return result;
    }
  
    public CarrierByProductDto getAllCarriersByCategory() {
        CarrierByProductDto result = new CarrierByProductDto();

        result.getMedical().addAll(convertRfpCarrierToCarrierDto(rfpCarrierRepository.findByCategoryOrderByCarrierDisplayNameAsc(Constants.MEDICAL)));
        result.getDental().addAll(convertRfpCarrierToCarrierDto(rfpCarrierRepository.findByCategoryOrderByCarrierDisplayNameAsc(Constants.DENTAL)));
        result.getVision().addAll(convertRfpCarrierToCarrierDto(rfpCarrierRepository.findByCategoryOrderByCarrierDisplayNameAsc(Constants.VISION)));

        result.getLife().addAll(convertRfpCarrierToCarrierDto(rfpCarrierRepository.findByCategoryOrderByCarrierDisplayNameAsc(Constants.LIFE)));
        result.getLife().addAll(convertRfpCarrierToCarrierDto(rfpCarrierRepository.findByCategoryOrderByCarrierDisplayNameAsc("VOL_" + Constants.LIFE)));
        result.getStd().addAll(convertRfpCarrierToCarrierDto(rfpCarrierRepository.findByCategoryOrderByCarrierDisplayNameAsc(Constants.STD)));
        result.getStd().addAll(convertRfpCarrierToCarrierDto(rfpCarrierRepository.findByCategoryOrderByCarrierDisplayNameAsc("VOL_" + Constants.STD)));
        result.getLtd().addAll(convertRfpCarrierToCarrierDto(rfpCarrierRepository.findByCategoryOrderByCarrierDisplayNameAsc(Constants.LTD)));
        result.getLtd().addAll(convertRfpCarrierToCarrierDto(rfpCarrierRepository.findByCategoryOrderByCarrierDisplayNameAsc("VOL_" + Constants.LTD)));

        // now remove duplicates in life/std/ltd
        result.setLife(removeDuplicateCarrier(result.getLife()));
        result.setStd(removeDuplicateCarrier(result.getStd()));
        result.setLtd(removeDuplicateCarrier(result.getLtd()));

        return result;
    }

    private List<CarrierDto> removeDuplicateCarrier(List<CarrierDto> carrierDtos){
        Set<String> carrierNameSet = new HashSet<>();
        List<CarrierDto> result = carrierDtos.stream()
            .filter(c -> carrierNameSet.add(c.getName()))
            .collect(Collectors.toList());
        return result;
    }

    private List<CarrierDto> convertRfpCarrierToCarrierDto(List<RfpCarrier> rfpCarriers){
        List<CarrierDto> dtos = new ArrayList<>();

        if(rfpCarriers == null){
            return dtos;
        }

        rfpCarriers.forEach(rfpCarrier -> {
            if(rfpCarrier.getCarrier().getName().equals(MULTIPLE_CARRIERS.name())) {
                return;
            }

            Carrier carrier = rfpCarrier.getCarrier();
            CarrierDto carrierDto = ObjectMapperUtils.map(carrier, CarrierDto.class);
            dtos.add(carrierDto);
        });

        return dtos;
    }
    
    // default version of API: skip networks loading to improve performance 
    public List<CarrierDto> getAllCarriers() {
        return getAllCarriers(false);
    }
    
    public List<CarrierDto> getAllCarriers(boolean returnNetworks) {
        List<CarrierDto> result = new ArrayList<>();
        List<Carrier> allCarrier = (List<Carrier>)carrierRepository.findAll();
        allCarrier.forEach(carrier -> {
            if(carrier.getName().equals(MULTIPLE_CARRIERS.name())) {
                return;
            }

            CarrierDto x = ObjectMapperUtils.map(carrier, CarrierDto.class);
            x.setLogoUrl(getLogoUrl(x.getName()));
            x.setLogoWKaiserUrl(getLogoUrl(x.getName() + "_KAISER"));
            x.setOriginalImageUrl(getOriginalImageUrl(x.getName()));
            x.setOriginalImageKaiserUrl(getOriginalImageUrl(x.getName() + "_KAISER"));
            if(returnNetworks) {
                List<Network> networks = networkRepository.findByCarrierCarrierId(carrier.getCarrierId());
                x.setNetworks(NetworkMapper.toDto(networks));
            }
            result.add(x);
        });
        return result;
    }

    public List<CarrierDto> getCarriersFromRfpCarrierHistory(Long clientId, String category) {

        if(!clientRepository.exists(clientId)) {
            throw new NotFoundException("No client found").withFields(field("client_id", clientId));
        }

        RFP rfp = rfpRepository.findByClientClientIdAndProduct(clientId, category);

        if(rfp == null){
            throw new NotFoundException("No RFP found").withFields(field("client_id", clientId), field("product", category));
        }

        List<CarrierHistory> carrierHistories = carrierHistoryRepository.findByRfpRfpIdAndCurrent(rfp.getRfpId(), true);
        List<CarrierDto> allCarriers = getAllCarriers();
        List<CarrierDto> result = new ArrayList<>();

        if(carrierHistories != null){
            carrierHistories.forEach(carrierHist -> {
                for(CarrierDto carrier : allCarriers){
                    if(equalsAnyIgnoreCase(carrierHist.getName(), carrier.getName(), carrier.getDisplayName())) {
                        result.add(carrier);
                        break;
                    }
                }
            });
        }

        return result;
    }
   
    public String getLogoUrl(String carrierName) {
        if(StringUtils.isBlank(carrierName)) {
            return null;
        }
        String servicePath = RequestUtils.getServiceBaseURL();
        String logoUrlFormat = servicePath + "/images/" + "%s.png";

        String suffix = "";
        if(carrierName.endsWith("_KAISER")) {
            // remove "_KAISER" suffix for correct method isCarrierNameAppCarrier() work
            carrierName = carrierName.substring(0, carrierName.indexOf("_KAISER"));
            suffix = "_KAISER";
        }
        if(isCarrierNameAppCarrier(carrierName, appCarrier)){
            return String.format(logoUrlFormat, carrierName + "_APP_CARRIER" + suffix);
        }else{
            return String.format(logoUrlFormat, carrierName + suffix);
        }
    }

    public static String getOriginalImageUrl(String carrierName) {
        if(StringUtils.isBlank(carrierName)) {
            return null;
        }
        String servicePath = RequestUtils.getServiceBaseURL();
        String logoUrlFormat = servicePath + "/images/original/" + "%s.png";
        return String.format(logoUrlFormat, carrierName);
    }
    
    public Carrier getCurrentEnvCarrier() {
	    return carrierRepository.findByName(appCarrier[0]);
    }
    
    public Carrier findById(Long carrierId) {
    	Carrier carrier = carrierRepository.findOne(carrierId);
        if(carrier == null) {
            throw new NotFoundException("Carrier not found")
                .withFields(
                    field("carrier_id", carrierId)
                );
        }
        return carrier;
    }
    
    public Carrier findByName(CarrierType carrierType) {
        Carrier carrier = carrierRepository.findByName(carrierType.name());
        if(carrier == null) {
            throw new NotFoundException("Carrier not found")
                .withFields(
                    field("carrier_name", carrierType.name())
                );
        }
        return carrier;
    }
}
