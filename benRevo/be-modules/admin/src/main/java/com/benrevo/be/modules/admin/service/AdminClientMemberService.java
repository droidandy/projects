package com.benrevo.be.modules.admin.service;


import com.auth0.json.mgmt.users.User;
import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.access.BrokerageRole;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.SharedClientMemberService;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.mapper.ClientMemberMapper;
import com.benrevo.data.persistence.mapper.MapperUtil;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientTeamRepository;
import com.benrevo.data.persistence.repository.ExtBrokerageAccessRepository;
import com.benrevo.data.persistence.repository.ExtClientAccessRepository;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.ClientException;
import com.benrevo.common.exception.NotFoundException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Optional.ofNullable;

@Service
@Transactional
public class AdminClientMemberService {

    @Autowired
    private ClientTeamRepository clientTeamRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private Auth0Service auth0Service;
    
    @Autowired
    private BaseAdminEmailService emailService;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private SharedClientMemberService sharedClientMemberService;

    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

    public List<ClientMemberDto> getClientTeamsByClientId(Long clientId){
        List<ClientMemberDto> clientMembers = ClientMemberMapper.toDtos(clientTeamRepository.findByClientClientId(clientId));
        Collections.sort(clientMembers, Comparator.comparingLong(ClientMemberDto::getBrokerageId));
        return clientMembers;
    }

    public List<ClientMemberDto> save(List<ClientMemberDto> memberDtos, Long clientId, Long brokerId) {
        Client client = clientRepository.findOne(clientId);
        if(client == null) {
            throw new NotFoundException("Client not found")
                .withFields( field("client_id", clientId));
        }

        Broker broker = brokerRepository.findOne(brokerId);
        if(broker == null){
            throw new NotFoundException("Broker not found")
                    .withFields( field("broker_id", brokerId));
        }

        Long immediateBrokerId = client.getBroker().getBrokerId();

        // If given brokerId != client.getBrokerId, then make sure given broker is a GA that is associated with
        // both the client and the client's immediate broker, otherwise failure
        ExtClientAccess extClientAccess = extClientAccessRepository.findDistinctFirstByClientClientIdAndExtBrokerBrokerId(clientId,brokerId);
        ExtBrokerageAccess extBrokerageAccess = extBrokerageAccessRepository.findByExtBrokerIdAndBrokerId(brokerId,immediateBrokerId);
        if(!brokerId.equals(immediateBrokerId) && (extClientAccess == null || extBrokerageAccess == null)){
            throw new NotFoundException("GA broker not associated with client or the immediate broker")
                    .withFields( field("ga_broker_id", brokerId))
                    .withFields( field("immediate_broker_id",immediateBrokerId))
                    .withFields( field("client_id", brokerId));
        }

        List<ClientMemberDto> dtoList = new ArrayList<>();

        List<User> usersFromAuth0 = auth0Service.getUsersForBrokerage(broker.getBrokerId());

        Map<String, User> usersMapInAuth0 = usersFromAuth0.stream()
                .collect(Collectors.toMap(User::getEmail,Function.identity()));
        
        for(ClientMemberDto dto : memberDtos) {
            
            String authId = null;
            User user = usersMapInAuth0.get(dto.getEmail());
            if (user != null) {
                // user exists in auth0
                Map<String, Object> data = user.getAppMetadata();
                String brokerageToken = (String) data.get("brokerageId");
                if (brokerageToken == null || !brokerageToken.equals(broker.getBrokerToken())) {
                    // wrong broker
                    throw new BaseException("Users exists in Auth0 with different brokerage")
                        .withFields(field("Email", dto.getEmail()), field("BrokerId", broker.getBrokerId()));
                }
                String brokerageRole = (String) data.get("brokerageRole");
                if (!StringUtils.equalsAnyIgnoreCase(brokerageRole, BrokerageRole.USER.getValue(),
                    BrokerageRole.FULL_CLIENT_ACCESS.getValue())) {
                    // wrong role
                    throw new ClientException("Users exists in Auth0 with different role")
                        .withFields(field("brokerageRole", brokerageRole));
                }
                authId = user.getId();
            }
            dto.setBrokerageId(broker.getBrokerId());
            dto.setAuthId(authId);
            
            ClientTeam clientTeam = ClientMemberMapper.dtoToClientTeam(dto);
            clientTeam.setClient(MapperUtil.clientFromId(clientId));
            clientTeam = clientTeamRepository.save(clientTeam);
            dtoList.add(ClientMemberMapper.clientTeamToDto(clientTeam));
        }

        return dtoList;
    }

    public List<ClientMemberDto> createUsersFromClientTeams(Long clientId) {
        Client client = clientRepository.findOne(clientId);
        if(client == null) {
            throw new NotFoundException("Client not found")
                .withFields( field("client_id", clientId));
        }

        List<ClientMemberDto> dtoList = new ArrayList<>();
        List<ClientTeam> clientTeams = clientTeamRepository.findByClientClientId(client.getClientId());
        for (ClientTeam clientTeam : clientTeams) {
            if (clientTeam.getAuthId() == null) {
                User user = auth0Service.createUserIfNotExists(
                        clientTeam.getEmail(), 
                        clientTeam.getBroker().getBrokerId(),
                        BrokerageRole.USER.getValue(), 
                        new String[] {AccountRole.BROKER.getValue()});
                clientTeam.setAuthId(user.getId());
                dtoList.add(ClientMemberMapper.clientTeamToDto(clientTeam));
                String salesFullName = client.getSalesFullName();
                emailService.sendWelcomeEmail(salesFullName, clientTeam.getEmail(), clientTeam.getName(), "");
            }
        }
        
        return dtoList;
    }

    
}
