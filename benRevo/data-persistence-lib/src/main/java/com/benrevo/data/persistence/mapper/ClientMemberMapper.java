package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.ClientTeam;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.modelmapper.PropertyMap;

public class ClientMemberMapper {
    
    static {

        ObjectMapperUtils
            .createTypeMap(ClientTeam.class, ClientMemberDto.class)
            .addMapping(ClientTeam::getName, ClientMemberDto::setFullName)
            .addMappings(mapper -> mapper.skip(ClientMemberDto::setFirstName))
            .addMappings(mapper -> mapper.skip(ClientMemberDto::setLastName))
            .addMappings(mapper -> mapper
                    .using(ctx -> ctx.getSource() == null ? null : ((Broker) ctx.getSource()).getBrokerId())
                    .map(ClientTeam::getBroker, ClientMemberDto::setBrokerageId)
            )
            .addMappings(mapper -> mapper
                .using(ctx -> ctx.getSource() == null ? null : ((Broker) ctx.getSource()).getName())
                .map(ClientTeam::getBroker, ClientMemberDto::setBrokerName)
            )
            .addMappings(mapper -> mapper
                .using(ctx -> ctx.getSource() == null ? null : ((Broker) ctx.getSource()).isGeneralAgent())
                .map(ClientTeam::getBroker, ClientMemberDto::setGeneralAgent)
            )
        ;
        
        ObjectMapperUtils
            .createTypeMap(ClientMemberDto.class, ClientTeam.class)
            .addMappings(mapper -> mapper.skip(ClientTeam::setClient))
            .addMappings(mapper -> mapper
                    .using(ctx -> MapperUtil.brokerFromId((Long)ctx.getSource()))
                    .map(ClientMemberDto::getBrokerageId, ClientTeam::setBroker))
            .addMappings(
                    new PropertyMap<ClientMemberDto, ClientTeam>() {
                        @Override
                        protected void configure() {
                            using(ctx -> ctx.getSource() == null ? null : getFullName((ClientMemberDto)ctx.getSource()))
                            .map(source).setName(null);
                        }
                    });

    }

    public static List<ClientMemberDto> toDtos(List<ClientTeam> clientTeamList) {
        return ObjectMapperUtils.mapAll(clientTeamList, ClientMemberDto.class);
    }

    public static List<ClientTeam> dtoToClientTeamList(List<ClientMemberDto> memberDtos) {
        return ObjectMapperUtils.mapAll(memberDtos, ClientTeam.class);
    }

    public static ClientMemberDto clientTeamToDto(ClientTeam clientTeam) {
        return ObjectMapperUtils.map(clientTeam, ClientMemberDto.class);
    }

    public static ClientTeam dtoToClientTeam(ClientMemberDto memberDto) {
        return ObjectMapperUtils.map(memberDto, ClientTeam.class);
    }
    
    public static String getFullName(ClientMemberDto memberDto) {
    	StringBuilder sb = new StringBuilder();
    	if (StringUtils.isNotBlank(memberDto.getFirstName())) {
    		sb.append(memberDto.getFirstName());
    	}
    	if (StringUtils.isNotBlank(memberDto.getLastName())) {
    		sb.append(' ').append(memberDto.getLastName());
    	}
    	if (sb.length() == 0 && StringUtils.isNotBlank(memberDto.getFullName())) {
    		sb.append(memberDto.getFullName());
    	}
    	return sb.toString();
    }

}
