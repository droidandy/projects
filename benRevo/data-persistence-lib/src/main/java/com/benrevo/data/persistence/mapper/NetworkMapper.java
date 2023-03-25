package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.NetworkDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Network;

import java.util.List;
import org.modelmapper.TypeMap;

/**
 * Created by ebrandell on 4/16/18 at 3:53 PM.
 */
public class NetworkMapper {

    static {
        TypeMap<Network, NetworkDto> typeMap = ObjectMapperUtils.getTypeMap(Network.class, NetworkDto.class);
        if(typeMap == null) {
            ObjectMapperUtils.createTypeMap(Network.class, NetworkDto.class)
                .addMappings(m -> {
                    m.map(Network::getNetworkId, NetworkDto::setNetworkId);
                    m.map(Network::getName, NetworkDto::setName);
                    m.map(Network::getType, NetworkDto::setType);
                });
        }
    }

    public static List<NetworkDto> toDto(List<Network> entityList) {
        return ObjectMapperUtils.mapAll(entityList, NetworkDto.class);
    }

    public static NetworkDto toDto(Network entity) {
        return ObjectMapperUtils.map(entity, NetworkDto.class);
    }
}
