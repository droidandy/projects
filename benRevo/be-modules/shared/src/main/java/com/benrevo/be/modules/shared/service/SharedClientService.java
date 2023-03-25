package com.benrevo.be.modules.shared.service;

import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.ExtProductDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.exception.NotAuthorizedException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.ClientExtProduct;
import com.benrevo.data.persistence.entities.ClientRfpProduct;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.ExtProduct;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientExtProductRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientRfpProductRepository;

import com.benrevo.data.persistence.repository.ExtProductRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpToAncillaryPlanRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.util.MapBuilder.field;

@Service
@Transactional
public class SharedClientService {


    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ClientRfpProductRepository clientRfpProductRepository;
    
    @Autowired
    private ClientExtProductRepository clientExtProductRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private AttributeRepository attributeRepository;

    @Autowired
    private ExtProductRepository extProductRepository;


    public ClientDto getById(Long id) {
        final Client client = clientRepository.findOne(id);

        if(client == null) {
            throw new NotFoundException("Client not found").withFields(field("client_id", id));
        }

        Long brokerId = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();
        Broker broker = brokerRepository.findOne(brokerId);
        if(broker == null) {
            throw new NotAuthorizedException().withFields(field("broker_id", brokerId));
        }

        filterClientClientTeamByBrokerId(client, brokerId);

        ClientDto result = ClientMapper.clientToDTO(client);
        result.setRfpProducts(getRfpProducts(id));
        result.setExtProducts(getExtProducts(id));

        return result;
    }

    public List<ExtProductDto> getExtProducts(Long clientId) {
        List<ClientExtProduct> products = clientExtProductRepository.findByClientId(clientId);
        if(products.isEmpty()) {
            return null;
        }
        List<ExtProductDto> result = new ArrayList<>();
        for(ClientExtProduct clExtProduct : products) {
            ExtProduct ep = clExtProduct.getExtProduct();
            ExtProductDto dto = new ExtProductDto();
            dto.setExtProductId(ep.getExtProductId());
            dto.setName(ep.getName());
            dto.setDisplayName(ep.getDisplayName());
            /* virginGroup not supported by ClientExtProduct */
            dto.setVirginGroup(false);
            result.add(dto);
        }
        return result;
    }
    
    public List<ExtProductDto> getRfpProducts(Long clientId) {
        List<ClientRfpProduct> clientRfpProducts = getClientRfpProducts(clientId);
        if (clientRfpProducts == null) {
            return null;
        }
        List<ExtProductDto> result = new ArrayList<>();
        for(ClientRfpProduct rfpProduct : clientRfpProducts) {
            ExtProductDto dto = new ExtProductDto();
            dto.setExtProductId(rfpProduct.getExtProduct().getExtProductId());
            dto.setName(rfpProduct.getExtProduct().getName());
            dto.setDisplayName(rfpProduct.getExtProduct().getDisplayName());
            dto.setVirginGroup(rfpProduct.isVirginGroup());
            result.add(dto);
        }
        return result;
    }

    public List<ClientRfpProduct> getClientRfpProducts(Long clientId) {
        List<ClientRfpProduct> clientRfpProducts =
            clientRfpProductRepository.findByClientId(clientId);
        if(clientRfpProducts.isEmpty()) {
            return null;
        }
        return clientRfpProducts;
    }

    public void filterClientClientTeamByBrokerId(List<Client> clients, Long brokerId){
        for(Client client : clients){
            filterClientClientTeamByBrokerId(client, brokerId);
        }
    }

    private void filterClientClientTeamByBrokerId(Client client, Long brokerId) {
        List<ClientTeam> clientTeamList = client.getClientTeamList();

        if(clientTeamList != null){
            clientTeamList = clientTeamList.stream()
                .filter(c -> c.getBroker().getBrokerId().equals(brokerId))
                .collect(Collectors.toList());
        }

        client.setClientTeamList(clientTeamList);
    }

    public void addClientRfpProductIfNotExist(Long clientId, String product, boolean isVirgin){
        // save client rfp product
        ExtProduct extProduct = extProductRepository.findByName(product);
        if(extProduct != null){
            ClientRfpProduct clientRfpProduct = clientRfpProductRepository.findByClientId(clientId)
                .stream()
                .filter(c -> c.getExtProduct().getName().equalsIgnoreCase(product))
                .findFirst()
                .orElse(new ClientRfpProduct(clientId, extProduct, isVirgin));

            clientRfpProductRepository.save(clientRfpProduct);
        }
    }
}
