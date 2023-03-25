package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.CarrierHistoryDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.CarrierHistory;

import java.util.List;

public class CarrierHistoryMapper {

    static {

        ObjectMapperUtils
            .createTypeMap(CarrierHistory.class, CarrierHistoryDto.class)
            .addMapping(src -> src.getRfp().getRfpId(),CarrierHistoryDto::setRfpId);
        
        ObjectMapperUtils
            .createTypeMap(CarrierHistoryDto.class, CarrierHistory.class)
            .addMappings(mapper -> mapper
                    .using(ctx -> MapperUtil.rfpFromId((Long)ctx.getSource()))
                    .map(CarrierHistoryDto::getRfpId,CarrierHistory::setRfp));
    }

    
    public static List<CarrierHistoryDto> toDTOs(List<CarrierHistory> optionList) {
        return ObjectMapperUtils.mapAll(optionList, CarrierHistoryDto.class);
    }

    public static List<CarrierHistory> dtosToCarrierHistories(List<CarrierHistoryDto> dtoList) {
        return ObjectMapperUtils.mapAll(dtoList, CarrierHistory.class);
    }

    public static CarrierHistoryDto toDto(CarrierHistory carrierHistory) {
        return ObjectMapperUtils.map(carrierHistory, CarrierHistoryDto.class);
    }

    public static CarrierHistory dtoToCarrierHistory(CarrierHistoryDto dto) {
        return ObjectMapperUtils.map(dto, CarrierHistory.class);
    }

}
