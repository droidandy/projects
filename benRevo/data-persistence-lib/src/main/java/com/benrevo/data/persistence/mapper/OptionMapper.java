package com.benrevo.data.persistence.mapper;

import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Option;

import java.util.List;

public class OptionMapper {
    
    static {

        ObjectMapperUtils
            .createTypeMap(Option.class, OptionDto.class)
            .addMapping(src -> src.getRfp().getRfpId(), OptionDto::setRfpId)
            .addMappings(mapper -> mapper.skip(OptionDto::setPlans))
            .addMapping(Option::getContributionTier1, OptionDto::setTier1Contribution)
            .addMapping(Option::getContributionTier2, OptionDto::setTier2Contribution)
            .addMapping(Option::getContributionTier3, OptionDto::setTier3Contribution)
            .addMapping(Option::getContributionTier4, OptionDto::setTier4Contribution)
            .addMapping(Option::getRateTier1, OptionDto::setTier1Rate)
            .addMapping(Option::getRateTier2, OptionDto::setTier2Rate)
            .addMapping(Option::getRateTier3, OptionDto::setTier3Rate)
            .addMapping(Option::getRateTier4, OptionDto::setTier4Rate)
            .addMapping(Option::getRenewalTier1, OptionDto::setTier1Renewal)
            .addMapping(Option::getRenewalTier2, OptionDto::setTier2Renewal)
            .addMapping(Option::getRenewalTier3, OptionDto::setTier3Renewal)
            .addMapping(Option::getRenewalTier4, OptionDto::setTier4Renewal)
            .addMapping(Option::getCensusTier1, OptionDto::setTier1Census)
            .addMapping(Option::getCensusTier2, OptionDto::setTier2Census)
            .addMapping(Option::getCensusTier3, OptionDto::setTier3Census)
            .addMapping(Option::getCensusTier4, OptionDto::setTier4Census)
            .addMapping(Option::getOosContributionTier1, OptionDto::setTier1OosContribution)
            .addMapping(Option::getOosContributionTier2, OptionDto::setTier2OosContribution)
            .addMapping(Option::getOosContributionTier3, OptionDto::setTier3OosContribution)
            .addMapping(Option::getOosContributionTier4, OptionDto::setTier4OosContribution)
            .addMapping(Option::getOosRateTier1, OptionDto::setTier1OosRate)
            .addMapping(Option::getOosRateTier2, OptionDto::setTier2OosRate)
            .addMapping(Option::getOosRateTier3, OptionDto::setTier3OosRate)
            .addMapping(Option::getOosRateTier4, OptionDto::setTier4OosRate)
            .addMapping(Option::getOosRenewalTier1, OptionDto::setTier1OosRenewal)
            .addMapping(Option::getOosRenewalTier2, OptionDto::setTier2OosRenewal)
            .addMapping(Option::getOosRenewalTier3, OptionDto::setTier3OosRenewal)
            .addMapping(Option::getOosRenewalTier4, OptionDto::setTier4OosRenewal)
            .addMapping(Option::getOosCensusTier1, OptionDto::setTier1OosCensus)
            .addMapping(Option::getOosCensusTier2, OptionDto::setTier2OosCensus)
            .addMapping(Option::getOosCensusTier3, OptionDto::setTier3OosCensus)
            .addMapping(Option::getOosCensusTier4, OptionDto::setTier4OosCensus);
        
        ObjectMapperUtils
            .createTypeMap(OptionDto.class, Option.class)
            .addMappings(mapper -> mapper
                    .using(ctx -> MapperUtil.rfpFromId((Long)ctx.getSource()))
                    .map(OptionDto::getRfpId,Option::setRfp))
            .addMapping(OptionDto::getTier1Contribution, Option::setContributionTier1)
            .addMapping(OptionDto::getTier2Contribution, Option::setContributionTier2)
            .addMapping(OptionDto::getTier3Contribution, Option::setContributionTier3)
            .addMapping(OptionDto::getTier4Contribution, Option::setContributionTier4)
            .addMapping(OptionDto::getTier1Rate, Option::setRateTier1)
            .addMapping(OptionDto::getTier2Rate, Option::setRateTier2)
            .addMapping(OptionDto::getTier3Rate, Option::setRateTier3)
            .addMapping(OptionDto::getTier4Rate, Option::setRateTier4)
            .addMapping(OptionDto::getTier1Renewal, Option::setRenewalTier1)
            .addMapping(OptionDto::getTier2Renewal, Option::setRenewalTier2)
            .addMapping(OptionDto::getTier3Renewal, Option::setRenewalTier3)
            .addMapping(OptionDto::getTier4Renewal, Option::setRenewalTier4)
            .addMapping(OptionDto::getTier1Census, Option::setCensusTier1)
            .addMapping(OptionDto::getTier2Census, Option::setCensusTier2)
            .addMapping(OptionDto::getTier3Census, Option::setCensusTier3)
            .addMapping(OptionDto::getTier4Census, Option::setCensusTier4)
            .addMapping(OptionDto::getTier1OosContribution, Option::setOosContributionTier1)
            .addMapping(OptionDto::getTier2OosContribution, Option::setOosContributionTier2)
            .addMapping(OptionDto::getTier3OosContribution, Option::setOosContributionTier3)
            .addMapping(OptionDto::getTier4OosContribution, Option::setOosContributionTier4)
            .addMapping(OptionDto::getTier1OosRate, Option::setOosRateTier1)
            .addMapping(OptionDto::getTier2OosRate, Option::setOosRateTier2)
            .addMapping(OptionDto::getTier3OosRate, Option::setOosRateTier3)
            .addMapping(OptionDto::getTier4OosRate, Option::setOosRateTier4)
            .addMapping(OptionDto::getTier1OosRenewal, Option::setOosRenewalTier1)
            .addMapping(OptionDto::getTier2OosRenewal, Option::setOosRenewalTier2)
            .addMapping(OptionDto::getTier3OosRenewal, Option::setOosRenewalTier3)
            .addMapping(OptionDto::getTier4OosRenewal, Option::setOosRenewalTier4)
            .addMapping(OptionDto::getTier1OosCensus, Option::setOosCensusTier1)
            .addMapping(OptionDto::getTier2OosCensus, Option::setOosCensusTier2)
            .addMapping(OptionDto::getTier3OosCensus, Option::setOosCensusTier3)
            .addMapping(OptionDto::getTier4OosCensus, Option::setOosCensusTier4);
    }
    
    public static List<OptionDto> optionsToDTOs(List<Option> optionList) {
        return ObjectMapperUtils.mapAll(optionList, OptionDto.class);
    }

    public static List<Option> dtosToOptions(List<OptionDto> dtoList) {
        return ObjectMapperUtils.mapAll(dtoList, Option.class);
    }

    public static OptionDto optionToDTO(Option option) {
        return ObjectMapperUtils.map(option, OptionDto.class);
    }

    public static Option dtoToOption(OptionDto optionDto) {
        return ObjectMapperUtils.map(optionDto, Option.class);
    }
}