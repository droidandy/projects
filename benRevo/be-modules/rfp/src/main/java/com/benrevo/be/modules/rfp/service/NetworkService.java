package com.benrevo.be.modules.rfp.service;

import static java.util.Objects.isNull;

import com.benrevo.common.dto.NetworkDto;
import com.benrevo.common.dto.PlanNameByNetworkDto;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.mapper.NetworkMapper;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.ProgramToPnnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class NetworkService {

    @Autowired
    private NetworkRepository networkRepository;
    
    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private ProgramToPnnRepository programToPnnRepository;

    public List<NetworkDto> getNetworksForCarrier(Long carrierId, String networkType) { 
        List<Network> allNetworks;
        if(networkType == null) {
            allNetworks = networkRepository.findByCarrierCarrierId(carrierId);
        } else {
            Carrier carrier = new Carrier();
            carrier.setCarrierId(carrierId);
            allNetworks = networkRepository.findByTypeAndCarrier(networkType, carrier);
        }
        return NetworkMapper.toDto(allNetworks);
    }

    public List<PlanNameByNetworkDto> getPlansForNetwork(Long networkId) {
        List<PlanNameByNetwork> pnns = planNameByNetworkRepository.findByNetworkNetworkId(networkId);
        List<PlanNameByNetworkDto> result = new ArrayList<>(pnns.size());
        for(PlanNameByNetwork pnn : pnns) {
            if(!isNull(pnn.getClientId()) || pnn.isCustomPlan() || programToPnnRepository.existsByPnn(pnn)){
                continue;
            }

            PlanNameByNetworkDto dto = new PlanNameByNetworkDto();
            dto.setPnnId(pnn.getPnnId());
            dto.setName(pnn.getName());
            dto.setPlanType(pnn.getPlanType());
            dto.setNetworkId(pnn.getNetwork().getNetworkId());
            dto.setNetworkName(pnn.getNetwork().getName());
            result.add(dto);
        }
        return result;
    }
}
