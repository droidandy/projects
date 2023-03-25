package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.ClientPlanDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.ClientPlan;

import java.util.List;

public class ClientPlanMapper {

    static {

        ObjectMapperUtils
                .createTypeMap(ClientPlan.class, ClientPlanDto.class)
                .addMapping(src -> src.getClient().getClientId(), ClientPlanDto::setClientId)
                .addMapping(src -> src.getPnn().getPnnId(), ClientPlanDto::setPnnId)
                .addMapping(src -> src.getRxPnn().getPnnId(), ClientPlanDto::setRxPnnId)
                .addMapping(src -> src.getAncillaryPlan().getAncillaryPlanId(), ClientPlanDto::setAncillaryPlanId)
                .addMappings(mapper -> mapper.skip(ClientPlanDto::setPlanName))
                .addMappings(mapper -> mapper.skip(ClientPlanDto::setIsKaiser))
                .addMappings(mapper -> mapper.skip(ClientPlanDto::setCarrierName));

        ObjectMapperUtils
                .createTypeMap(ClientPlanDto.class, ClientPlan.class)
                .addMappings(mapper -> mapper
                        .using(ctx -> MapperUtil.clientFromId((Long) ctx.getSource()))
                        .map(ClientPlanDto::getClientId, ClientPlan::setClient))
                .addMappings(mapper -> mapper
                        .using(ctx -> MapperUtil.pnnFromId((Long) ctx.getSource()))
                        .map(ClientPlanDto::getPnnId, ClientPlan::setPnn))
                .addMappings(mapper -> mapper
                        .using(ctx -> MapperUtil.pnnFromId((Long) ctx.getSource()))
                        .map(ClientPlanDto::getRxPnnId, ClientPlan::setRxPnn))
                .addMappings(mapper -> mapper
                        .using(ctx -> MapperUtil.rfpPlanFromId((Long) ctx.getSource()))
                        .map(ClientPlanDto::getAncillaryPlanId, ClientPlan::setAncillaryPlan));
    }

    public static List<ClientPlanDto> toDto(List<ClientPlan> entityList) {
        return ObjectMapperUtils.mapAll(entityList, ClientPlanDto.class);
    }

    public static ClientPlanDto toDto(ClientPlan entity) {
        return ObjectMapperUtils.map(entity, ClientPlanDto.class);
    }

    public static ClientPlan toEntity(ClientPlanDto dto) {
        return ObjectMapperUtils.map(dto, ClientPlan.class);
   }
}