package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.BenefitDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Benefit;

import java.util.List;

/**
 * Created by ebrandell on 4/16/18 at 3:19 PM.
 */
public class BenefitMapper {

    static {
        ObjectMapperUtils
            .createTypeMap(Benefit.class, BenefitDto.class)
            .addMappings(m -> {
                m.map(Benefit::getBenefitId, BenefitDto::setId);
                m.map(s -> s.getBenefitName().getDisplayName(), BenefitDto::setName);
                m.map(Benefit::getValue, BenefitDto::setValue);
                m.map(Benefit::getFormat, BenefitDto::setFormat);
                m.map(Benefit::getRestriction, BenefitDto::setRestriction);
                m.map(Benefit::getCreated, BenefitDto::setCreated);
                m.map(Benefit::getUpdated, BenefitDto::setUpdated);
            });
    }

    public static List<BenefitDto> toDto(List<Benefit> entityList) {
        return ObjectMapperUtils.mapAll(entityList, BenefitDto.class);
    }

    public static BenefitDto toDto(Benefit entity) {
        return ObjectMapperUtils.map(entity, BenefitDto.class);
    }
}
