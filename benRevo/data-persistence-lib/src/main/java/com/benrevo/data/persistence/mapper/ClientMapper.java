package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.ClientTeam;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.Converter;

public class ClientMapper {
    
    static {

        Converter<List<ClientAttribute>, List<AttributeName>> attributeConverter =
                ctx -> ctx.getSource() == null || ctx.getSource().isEmpty()
                ? null
                : ctx.getSource()
                .stream()
                .map(ClientAttribute::getName)
                .collect(Collectors.toList());
        
        ObjectMapperUtils
            .createTypeMap(Client.class, ClientDto.class)
            .addMapping(Client::getClientId,ClientDto::setId)
            .addMappings(mapper -> mapper.skip(ClientDto::setAddressComplementary))
            .addMappings(mapper -> mapper.skip(ClientDto::setImageUrl))
            .addMappings(mapper -> mapper.skip(ClientDto::setRfps))
            .addMappings(mapper -> mapper.skip(ClientDto::setRfpProducts))
            .addMappings(mapper -> mapper.skip(ClientDto::setExtProducts))
            .addMappings(mapper -> mapper.skip(ClientDto::setGaId))
            .addMappings(mapper -> mapper
                    .using(ctx -> ClientMemberMapper.toDtos((List<ClientTeam>)ctx.getSource()))
                    .map(Client::getClientTeamList, ClientDto::setClientMembers))
            .addMappings(mapper -> mapper
                    .using(ctx -> ctx.getSource() == null ? null : ((Broker) ctx.getSource()).getBrokerId())
                    .map(Client::getBroker, ClientDto::setBrokerId))
            .addMappings(mapper -> mapper
                    .using(ctx -> ctx.getSource() == null ? null : ((Broker) ctx.getSource()).getName())
                    .map(Client::getBroker, ClientDto::setBrokerName))
            .addMappings(mapper -> mapper
                    .using(attributeConverter)
                    .map(Client::getAttributes, ClientDto::setAttributes));

        
        ObjectMapperUtils
            .createTypeMap(ClientDto.class, Client.class)
            .addMappings(mapper -> mapper.skip(Client::setClientId))
            .addMappings(mapper -> mapper.skip(Client::setAttributes))
            .addMappings(mapper -> mapper.skip(Client::setDateFormSubmitted))
            .addMappings(mapper -> mapper.skip(Client::setDateQuoteOptionSubmitted))
            .addMappings(mapper -> mapper.skip(Client::setClientPlans))
            .addMappings(mapper -> mapper.skip(Client::setArchived))
            .addMappings(mapper -> mapper.skip(Client::setAddress2))
            .addMappings(mapper -> mapper.skip(Client::setImage))
            .addMappings(mapper -> mapper
                    .using(ctx -> MapperUtil.brokerFromId((Long)ctx.getSource()))
                    .map(ClientDto::getBrokerId,Client::setBroker))
            .addMappings(mapper -> mapper
                    .using(ctx -> ClientMemberMapper.dtoToClientTeamList((List<ClientMemberDto>)ctx.getSource()))
                    .map(ClientDto::getClientMembers,Client::setClientTeamList));
    }


  public static List<ClientDto> clientsToDTOs(List<Client> clients) {
      return ObjectMapperUtils.mapAll(clients, ClientDto.class);
  }

  public static ClientDto clientToDTO(Client client) {
      return ObjectMapperUtils.map(client, ClientDto.class);
  }

  public static Client dtoToClient(ClientDto clientDto) {
      return ObjectMapperUtils.map(clientDto, Client.class);
  }

}
