package com.benrevo.admin.service;

import static com.benrevo.common.util.MapBuilder.field;
import static java.lang.String.format;
import static org.apache.commons.lang.StringUtils.isBlank;

import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.SharedBrokerService;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ExtBrokerageAccess;
import com.benrevo.data.persistence.entities.ExtClientAccess;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ExtBrokerageAccessRepository;
import com.benrevo.data.persistence.repository.ExtClientAccessRepository;
import com.benrevo.data.persistence.repository.PersonRepository;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class BrokerService extends SharedBrokerService{

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;

    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private Auth0Service auth0Service;

    @Value("${app.env:local}")
    String appEnv;

    private final String BENREVO_BROKER_GA_NAME = "Benrevo GA";

    public void requestAccessToBrokerageAndClient(Long brokerageId, Long clientId){
        Broker broker = getById(brokerageId);
        Client client = clientRepository.findOne(clientId);

        Broker benrevoGABroker = brokerRepository.findByName(BENREVO_BROKER_GA_NAME);
        if(client == null){
            throw new NotFoundException(
                format(
                    "Client not found; client_id=%s",
                    clientId
                )
            );
        }

        if(benrevoGABroker == null){
            throw new NotFoundException(
                format(
                    "Benrevo broker not found; broker_name=%s",
                    BENREVO_BROKER_GA_NAME
                )
            );
        }

        ExtBrokerageAccess brokerageAccess = extBrokerageAccessRepository.findByExtBrokerIdAndBrokerId(benrevoGABroker.getBrokerId(), broker.getBrokerId());
        ExtClientAccess extClientAccess = extClientAccessRepository.findDistinctFirstByClientClientIdAndExtBrokerBrokerId(clientId, benrevoGABroker.getBrokerId());
        if(brokerageAccess != null && extClientAccess != null){
            throw new BaseException("Benrevo GA already has access to client and client's brokerage");
        }

        if(brokerageAccess == null) {
            extBrokerageAccessRepository.save(new ExtBrokerageAccess(benrevoGABroker, broker));
        }
        if (extClientAccess == null) {
            extClientAccessRepository.save(new ExtClientAccess(benrevoGABroker, client));
        }
    }

    public void removeAccessToBrokerageAndClient(Long clientId){
        Client client = clientRepository.findOne(clientId);
        Broker broker = client.getBroker();

        Broker benrevoGABroker = brokerRepository.findByName(BENREVO_BROKER_GA_NAME);
        if(client == null){
            throw new NotFoundException(
                format(
                    "Client not found; client_id=%s",
                    clientId
                )
            );
        }

        if(benrevoGABroker == null){
            throw new NotFoundException(
                format(
                    "Benrevo broker not found; broker_name=%s",
                    BENREVO_BROKER_GA_NAME
                )
            );
        }
//        ExtBrokerageAccess brokerageAccess = extBrokerageAccessRepository.findByExtBrokerIdAndBrokerId(benrevoGABroker.getBrokerId(), broker.getBrokerId());
//        if(brokerageAccess != null){
//            extBrokerageAccessRepository.delete(brokerageAccess);
//        }

        ExtClientAccess extClientAccess = extClientAccessRepository.findDistinctFirstByClientClientIdAndExtBrokerBrokerId(clientId, benrevoGABroker.getBrokerId());

        if(extClientAccess != null){
            extClientAccessRepository.delete(extClientAccess);
        }
    }

    public List<BrokerDto> getAllBrokers() {
        List<BrokerDto> result = new ArrayList<>();

        List<Broker> allBroker = (List<Broker>)brokerRepository.findAll();

        allBroker.forEach(broker -> {
            result.add(broker.toBrokerDto());
        });

        return result;
    }
}
