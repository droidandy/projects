package com.benrevo.be.modules.shared.service;

import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.mapper.ClientMemberMapper;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientTeamRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.util.MapBuilder.field;

@Service
@Transactional
public class SharedClientMemberService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientTeamRepository clientTeamRepository;

    public List<ClientMemberDto> getByClientId(Long clientId) {
        if(clientRepository.findOne(clientId) == null) {
            throw new NotFoundException("Client not found")
                .withFields(
                    field("client_id", clientId)
                );
        }

        return ClientMemberMapper.toDtos(clientTeamRepository.findByClientClientId(clientId));
    }
    
    public void delete(List<ClientMemberDto> memberDtos, Long clientId) {
        if(clientRepository.findOne(clientId) == null) {
            throw new NotFoundException("Client not found")
                .withFields(
                    field("client_id", clientId)
                );
        }

        Set<Long> idSet = getMembersIdSet(clientId);

        for(ClientMemberDto memberDto : memberDtos) {
            if(!idSet.contains(memberDto.getId())) {
                throw new BadRequestException("Cannot delete member that client does not own")
                    .withFields(
                        field("client_id", clientId),
                        field("member_id", memberDto.getId())
                    );
            }

            clientTeamRepository.delete(memberDto.getId());
        }
    }
    
    private Set<Long> getMembersIdSet(Long clientId) {
        Set<Long> idSet = new HashSet<>();
        List<ClientTeam> clientTeamList = clientTeamRepository.findByClientClientId(clientId);

        for(ClientTeam clientTeam : clientTeamList) {
            idSet.add(clientTeam.getId());
        }

        return idSet;
    }


}
