package com.benrevo.be.modules.admin.service;

import com.benrevo.common.dto.NetworkDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.repository.NetworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;

@Service
@Transactional
public class AdminNetworkService {

    @Autowired
    private NetworkRepository networkRepository;

    public List<NetworkDto> getNetworksForCarrier(Long carrierId, String networkType) {

        List<Network> allNetworks = networkRepository.findByCarrierCarrierId(carrierId);

        return allNetworks.stream()
            .filter(n -> equalsIgnoreCase(n.getType(), networkType))
            .map(n -> ObjectMapperUtils.map(n, NetworkDto.class))
            .collect(toList());
    }
}
