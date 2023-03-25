package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.MedicalGroupDto;
import com.benrevo.common.dto.NetworkDto;
import com.benrevo.data.persistence.entities.MedicalGroup;
import org.modelmapper.Converter;
import org.modelmapper.PropertyMap;

import java.util.List;
import java.util.stream.Collectors;

public class MedicalGroupToMedicalGroupDtoMapper extends PropertyMap<MedicalGroup, MedicalGroupDto> {
    @Override
    protected void configure() {
        Converter<MedicalGroup, List<NetworkDto>> networkConverter = context ->
                context.getSource().getNetworkMedicalGroups().stream().map(networkMedicalGroup -> {
                    NetworkDto networkDto = new NetworkDto();
                    networkDto.setNetworkId(networkMedicalGroup.getNetwork().getNetworkId());
                    networkDto.setName(networkMedicalGroup.getNetwork().getName());
                    networkDto.setType(networkMedicalGroup.getNetwork().getType());
                    return networkDto;
                }).collect(Collectors.toList());

        using(networkConverter).map(source).setNetworks(null);
    }
}