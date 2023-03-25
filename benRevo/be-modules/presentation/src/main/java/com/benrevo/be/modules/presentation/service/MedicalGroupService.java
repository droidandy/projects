package com.benrevo.be.modules.presentation.service;

import com.benrevo.common.dto.MedicalGroupDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.MedicalGroup;
import com.benrevo.data.persistence.mapper.MedicalGroupToMedicalGroupDtoMapper;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.MedicalGroupRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import javax.naming.ldap.HasControls;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.ObjectMapperUtils.addMapping;
import static com.benrevo.common.util.ObjectMapperUtils.mapAll;
import static java.util.Arrays.copyOf;
import static java.util.stream.Collectors.toMap;
import static org.apache.commons.lang3.StringUtils.equalsAny;

@Service
@Transactional
public class MedicalGroupService {

    @Autowired
    private MedicalGroupRepository medicalGroupRepository;

    @Autowired
    private CarrierRepository carrierRepository;

    @Value("${app.carrier}")
    String[] appCarrier;
    
    static {
        addMapping(new MedicalGroupToMedicalGroupDtoMapper());
    }

    public List<MedicalGroupDto> getAll() {
        return mapAll(medicalGroupRepository.findAll(), MedicalGroupDto.class);
    }

    public List<MedicalGroupDto> getByCurrentCarrier() {
    	CarrierType ct = CarrierType.fromStrings(appCarrier);
        return getByCarrierName(ct.name());
    }

    public Map<String, List<MedicalGroupDto>> groupByIncumbentCarrier() {
        Map<String, List<MedicalGroupDto>> result = Arrays
            .stream(
                copyOf(CarrierType.values(), CarrierType.values().length)
            )
            .filter(c -> !equalsAny(c.name(), CarrierType.BENREVO.name(), CarrierType.MULTIPLE_CARRIERS.name()))
            .collect(
                toMap(CarrierType::name, ct -> getByCarrierName(ct.name()))
            );

        result.values().removeIf(List::isEmpty);
        return result;
    }

    public List<MedicalGroupDto> getByCarrierName(String name) {
        Optional<Carrier> carrierOptional = Optional.ofNullable(carrierRepository.findByName(name));
        Carrier carrier = carrierOptional.orElseThrow(() -> new NotFoundException("Carrier is not found").withFields(field("carrier", name)));
        return mapAll(medicalGroupRepository.findMedicalGroupsByCarrierId(carrier.getCarrierId()), MedicalGroupDto.class);
    }
}