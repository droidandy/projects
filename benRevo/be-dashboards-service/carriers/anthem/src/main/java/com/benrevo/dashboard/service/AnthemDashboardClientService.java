package com.benrevo.dashboard.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.be.modules.client.service.ClientService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ExtClientAccess;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ExtClientAccessRepository;


@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemDashboardClientService extends ClientService{

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;

    @Autowired
    private ClientRepository  clientRepository;
    
    @Autowired
    private BrokerRepository brokerRepository;
    
    @Override
    public ClientDto create(ClientDto clientDto, Long brokerId, boolean carrierOwned) {
        
        ClientDto result = super.create(clientDto, clientDto.getBrokerId(), true);

        // add GA info
        if (clientDto.getGaId() != null)  {
            // add new gaAccess
            Client client = clientRepository.findOne(result.getId());
            Broker agent = brokerRepository.findOne(clientDto.getGaId());
            if (agent == null || !agent.isGeneralAgent()) {
                throw new BaseException(String.format("Ga not found id=%s", clientDto.getGaId()));
            }
            extClientAccessRepository.save(new ExtClientAccess(agent, client));
            result.setGaId(clientDto.getGaId());
        }
        
        return result;
    }
    
    @Override
    public ClientDto getById(Long id) {
        ClientDto clientDto = super.getById(id);

        // add GA info
        Client client = clientRepository.findOne(clientDto.getId());
        
        // Get GA from external access list
        extClientAccessRepository
            .findByClient(client)
            .stream()
            .filter(access -> !StringUtils.containsIgnoreCase(access.getExtBroker().getName(), "Benrevo GA"))
            .findFirst()
            .ifPresent(access -> clientDto.setGaId(access.getExtBroker().getBrokerId()));


        return clientDto;
        
    }
    
    @Override
    public ClientDto update(ClientDto clientDto) {
        
        ClientDto result = super.update(clientDto);

        // update GA info
        Client client = clientRepository.findOne(clientDto.getId());
        
        // Get GA from external access list
        boolean gaFound = false;
        for (ExtClientAccess gaAccess : extClientAccessRepository.findByClient(client)) {
            if (StringUtils.containsIgnoreCase(gaAccess.getExtBroker().getName(), "Benrevo GA")) {
                // skip
                continue;
            }
            if (clientDto.getGaId() != null && gaAccess.getExtBroker().getBrokerId().equals(clientDto.getGaId())) {
                gaFound = true;
            } else {
                extClientAccessRepository.delete(gaAccess);
            }
        }

        if (clientDto.getGaId() != null && !gaFound)  {
            // add new gaAccess
            Broker agent = brokerRepository.findOne(clientDto.getGaId());
            if (agent == null || !agent.isGeneralAgent()) {
                throw new BaseException(String.format("Ga not found id=%s", clientDto.getGaId()));
            }
            extClientAccessRepository.save(new ExtClientAccess(agent, client));
        }
        result.setGaId(clientDto.getGaId());
        
        return result;

    }

}
