package com.benrevo.be.modules.client.service;


import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.SharedClientMemberService;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.mapper.ClientMemberMapper;
import com.benrevo.data.persistence.mapper.MapperUtil;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientTeamRepository;
import com.benrevo.common.exception.NotFoundException;
import com.google.common.collect.Lists;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static com.benrevo.common.util.MapBuilder.field;

@Service
@Transactional
public class ClientMemberService {

    @Autowired
    private ClientTeamRepository clientTeamRepository;

    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private SharedClientMemberService sharedClientMemberService;

    @Autowired
    private Auth0Service auth0Service;

    public List<ClientMemberDto> save(List<ClientMemberDto> memberDtos, Long clientId) {
        if(clientRepository.findOne(clientId) == null) {
            throw new NotFoundException("Client not found")
                .withFields(
                    field("client_id", clientId)
                );
        }

        List<ClientMemberDto> dtoList = new ArrayList<>();

        // TODO: Use Orika for mapping...
        for(ClientMemberDto dto : memberDtos) {
            ClientTeam clientTeam = ClientMemberMapper.dtoToClientTeam(dto);
            clientTeam.setClient(MapperUtil.clientFromId(clientId));
            clientTeam = clientTeamRepository.save(clientTeam);
            dtoList.add(ClientMemberMapper.clientTeamToDto(clientTeam));
        }

        return dtoList;
    }

    public void delete(List<ClientMemberDto> memberDtos, Long clientId) {
        sharedClientMemberService.delete(memberDtos, clientId);
    }

	public List<ClientMemberDto> updateNameByAuthId(String authId, String name) {
		List<ClientTeam> members = clientTeamRepository.findByAuthId(authId);
		for (ClientTeam member : members) {
			member.setName(name);
		}
		return ClientMemberMapper.toDtos(Lists.newArrayList(clientTeamRepository.save(members)));
	}

    /**
     * Add current user to client team
     * TODO: What to do about Auth0 for each project(Core, admin, dashboards?)
     */
	public void addCurrentUserToClientTeam(Client client, Broker broker){
        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        ClientMemberDto clientMember = auth0Service.getUserByAuthId(currentUser.getName());
        ClientTeam clientTeam = ClientMemberMapper.dtoToClientTeam(clientMember);
        clientTeam.setClient(client);
        clientTeam.setBroker(broker);
        clientTeamRepository.save(clientTeam);
    }
}
