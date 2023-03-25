package com.benrevo.data.persistence.mapper;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.dto.ancillary.*;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.ancillary.*;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.google.common.collect.ImmutableMap.of;

public class RfpMapper {

    private static Map<Class<? extends AncillaryClassDto>, Class<? extends AncillaryClass>> dtoToEntityClassMap = of(
            LtdClassDto.class, LtdClass.class,
            LifeClassDto.class, LifeClass.class,
            StdClassDto.class, StdClass.class
    );
    private static Map<Class<? extends AncillaryRateDto>, Class<? extends AncillaryRate>> dtoToEntityRateMap = of(
            BasicRateDto.class, BasicRate.class,
            VoluntaryRateDto.class, VoluntaryRate.class
    );
    private static Map<Class<? extends AncillaryClass>, Class<? extends AncillaryClassDto>> entityToDtoClassMap = of(
            LtdClass.class, LtdClassDto.class,
            LifeClass.class, LifeClassDto.class,
            StdClass.class, StdClassDto.class
    );
    private static Map<Class<? extends AncillaryRate>, Class<? extends AncillaryRateDto>> entityToDtoRateMap = of(
            BasicRate.class, BasicRateDto.class,
            VoluntaryRate.class, VoluntaryRateDto.class
    );


    public static List<RfpDto> rfpsToRfpDTOs(List<RFP> rfpList) {
        if(rfpList == null) {
            return null;
        }

        return rfpList.stream().map((rfp) -> rfpToDTO(rfp)).collect(Collectors.toList());
    }

    public static RfpDto rfpToDTO(RFP rfp) {
        if(rfp == null) {
            return null;
        }

        RfpDto rfpDto = new RfpDto();

        rfpDto.setId(rfp.getRfpId());
        rfpDto.setClientId(rfp.getClient().getClientId());
        rfpDto.setProduct(rfp.getProduct());
        rfpDto.setWaitingPeriod(rfp.getWaitingPeriod());
        rfpDto.setPaymentMethod(rfp.getPaymentMethod());
        rfpDto.setCommission(rfp.getCommission());
        rfpDto.setContributionType(rfp.getContributionType());
        rfpDto.setPriorCarrier(rfp.isPriorCarrier());
        rfpDto.setRatingTiers(rfp.getRatingTiers());
        rfpDto.setOptionCount(rfp.getOptionCount());
        rfpDto.setBuyUp(rfp.isBuyUp());
        rfpDto.setBrokerOfRecord(rfp.isBrokerOfRecord());
        rfpDto.setSelfFunding(rfp.isSelfFunding());
        rfpDto.setAlongside(rfp.isAlongside());
        rfpDto.setTakeOver(rfp.isTakeOver());
        rfpDto.setQuoteAlteTiers(rfp.getQuoteAlteTiers());
        rfpDto.setComments(rfp.getComments());
        rfpDto.setLargeClaims(rfp.getLargeClaims());
        if(rfp.getLastUpdated() != null){
            rfpDto.setLastUpdated(DateHelper.fromDateToString(rfp.getLastUpdated(), Constants.DATETIME_FORMAT));
        }
        rfpDto.setAdditionalRequests(rfp.getAdditionalRequests());
        rfpDto.setAlternativeQuote(rfp.getAlternativeQuote());
        rfpDto.setVisits(rfp.getVisits());
        rfpDto.setEap(rfp.getEap());
        if(rfp.getOptions() != null) {
            rfpDto.setOptions(OptionMapper.optionsToDTOs(rfp.getOptions()));
        }
        if(rfp.getCarrierHistories() != null) {
            rfpDto.setCarrierHistories(CarrierHistoryMapper.toDTOs(rfp.getCarrierHistories()));
        }

        rfp.getAttributes().forEach(attr -> rfpDto.getAttributes().put(attr.getName(), attr.getValue()));
        
        return rfpDto;
    }



    public static RFP rfpDtoToRFP(RfpDto rfpDto) {
        if(rfpDto == null) {
            return null;
        }

        RFP rfp = new RFP();

        rfp.setClient(MapperUtil.clientFromId(rfpDto.getClientId()));
        rfp.setProduct(rfpDto.getProduct());
        rfp.setWaitingPeriod(rfpDto.getWaitingPeriod());
        rfp.setPaymentMethod(rfpDto.getPaymentMethod());
        rfp.setCommission(rfpDto.getCommission());
        rfp.setContributionType(rfpDto.getContributionType());
        rfp.setPriorCarrier(rfpDto.isPriorCarrier());
        rfp.setRatingTiers(rfpDto.getRatingTiers());
        rfp.setOptionCount(rfpDto.getOptionCount());
        rfp.setBuyUp(rfpDto.isBuyUp());
        rfp.setSelfFunding(rfpDto.isSelfFunding());
        rfp.setAlongside(rfpDto.isAlongside());
        rfp.setTakeOver(rfpDto.isTakeOver());
        rfp.setQuoteAlteTiers(rfpDto.getQuoteAlteTiers());
        rfp.setComments(rfpDto.getComments());
        rfp.setLargeClaims(rfpDto.getLargeClaims());
        rfp.setBrokerOfRecord(rfpDto.isBrokerOfRecord());
        rfp.setAdditionalRequests(rfpDto.getAdditionalRequests());
        rfp.setAlternativeQuote(rfpDto.getAlternativeQuote());
        rfp.setVisits(rfpDto.getVisits());
        rfp.setEap(rfpDto.getEap());
        if(rfpDto.getOptions() != null) {
            rfp.setOptions(OptionMapper.dtosToOptions(rfpDto.getOptions()));
            rfp.getOptions().forEach(option -> option.setRfp(rfp));
        } else {
        	rfp.setOptions(new ArrayList<>());
        }
        if(rfpDto.getCarrierHistories() != null) {
            rfp.setCarrierHistories(CarrierHistoryMapper.dtosToCarrierHistories(rfpDto.getCarrierHistories()));
            rfp.getCarrierHistories().forEach(history -> history.setRfp(rfp));
        } else {
        	rfp.setCarrierHistories(new ArrayList<>());
        }
        return rfp;
    }

    public static AncillaryPlanDto rfpPlanToRfpPlanDto(AncillaryPlan plan) {
        AncillaryPlanDto dto = new AncillaryPlanDto();
        rfpPlanToRfpPlanDto(plan, dto);
        return dto;
    }
    
    public static void rfpPlanToRfpPlanDto(AncillaryPlan plan, AncillaryPlanDto dto) {
        dto.setPlanType(plan.getPlanType());
        dto.setAncillaryPlanId(plan.getAncillaryPlanId());
        dto.setPlanYear(plan.getPlanYear());
        dto.setPlanName(plan.getPlanName());
        if (plan.getCarrier() != null) {
            dto.setCarrierId(plan.getCarrier().getCarrierId()); 
            dto.setCarrierName(plan.getCarrier().getName());  
            dto.setCarrierDisplayName(plan.getCarrier().getDisplayName());  
        }
        if (plan.getClasses() != null) {
            ArrayList<AncillaryClassDto> classDtos = new ArrayList<>();
            plan.getClasses().forEach(clazz -> classDtos.add(rfpClassToRfpClassDto(clazz)));
            dto.setClasses(classDtos);
        }
        if (plan.getRates() != null) {
            dto.setRates(rfpRateToRfpRateDto(plan.getRates()));
        }
    }
    
    public static RfpQuoteAncillaryPlanDto ancQuotePlanToAncQuotePlanDto(RfpQuoteAncillaryPlan quotePlan) {
        RfpQuoteAncillaryPlanDto dto = new RfpQuoteAncillaryPlanDto();
        ancQuotePlanToAncQuotePlanDto(quotePlan, dto);

        return dto;
    }
    
    public static void ancQuotePlanToAncQuotePlanDto(RfpQuoteAncillaryPlan quotePlan, RfpQuoteAncillaryPlanDto dto) {
        AncillaryPlanDto planDto = rfpPlanToRfpPlanDto(quotePlan.getAncillaryPlan());
        BeanUtils.copyProperties(planDto, dto);
        
        dto.setMatchPlan(quotePlan.isMatchPlan());
        dto.setRfpQuoteAncillaryPlanId(quotePlan.getRfpQuoteAncillaryPlanId());
        dto.setRfpQuoteId(quotePlan.getRfpQuote().getRfpQuoteId());
    }
    
    public static RfpQuoteAncillaryPlan ancQuotePlanDtoToAncQuotePlan(RfpQuoteAncillaryPlanDto planDto) {
        AncillaryPlan plan = rfpPlanDtoToRfpPlan(planDto);
        RfpQuoteAncillaryPlan quotePlan = new RfpQuoteAncillaryPlan();
        quotePlan.setAncillaryPlan(plan);
        quotePlan.setMatchPlan(planDto.isMatchPlan());
        quotePlan.setRfpQuoteAncillaryPlanId(planDto.getRfpQuoteAncillaryPlanId());
        if(planDto.getRfpQuoteId() != null) {
            RfpQuote rfpQuote = new RfpQuote();
            rfpQuote.setRfpQuoteId(planDto.getRfpQuoteId());
            quotePlan.setRfpQuote(rfpQuote);
        }
        return quotePlan;
    }

    private static AncillaryClassDto rfpClassToRfpClassDto(AncillaryClass clazz) {
        if (clazz == null) {
            return null;
        }
        try {
            AncillaryClassDto classDto = entityToDtoClassMap.get(clazz.getClass()).newInstance();
            BeanUtils.copyProperties(clazz, classDto);
            return classDto;
        } catch (InstantiationException | IllegalAccessException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private static AncillaryRateDto rfpRateToRfpRateDto(AncillaryRate rate) {
        if (rate == null) {
            return null;
        }
        try {
            AncillaryRateDto rateDto = entityToDtoRateMap.get(rate.getClass()).newInstance();
            BeanUtils.copyProperties(rate, rateDto, "ages");
            if (rate instanceof VoluntaryRate && ((VoluntaryRate) rate).getAges() != null) {
                ArrayList<AncillaryRateAgeDto> ages = new ArrayList<>();
                ((VoluntaryRate) rate).getAges().forEach(age -> ages.add(rfpRateAgeToRfpRateAgeDto(age)));
                ((VoluntaryRateDto) rateDto).setAges(ages);
            }
            return rateDto;
        } catch (InstantiationException | IllegalAccessException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private static AncillaryRateAgeDto rfpRateAgeToRfpRateAgeDto(AncillaryRateAge age) {
        AncillaryRateAgeDto dto = new AncillaryRateAgeDto();
        BeanUtils.copyProperties(age, dto);
        return dto;
    }

    public static AncillaryPlan rfpPlanDtoToRfpPlan(AncillaryPlanDto planDto) {
        AncillaryPlan plan = new AncillaryPlan();
        plan.setPlanType(planDto.getPlanType());
        plan.setAncillaryPlanId(planDto.getAncillaryPlanId());
        plan.setPlanYear(planDto.getPlanYear());
        plan.setPlanName(planDto.getPlanName());
        if(planDto.getCarrierId() != null) {
            Carrier carrier = new Carrier();
            carrier.setCarrierId(planDto.getCarrierId());
            plan.setCarrier(carrier);
        }
        if (planDto.getClasses() != null) {
            ArrayList<AncillaryClass> classes = new ArrayList<>();
            planDto.getClasses().forEach(clazz -> classes.add(rfpClassDtoToRfpClass(clazz, plan)));
            plan.setClasses(classes);
        }
        if (planDto.getRates() != null) {
            plan.setRates(rfpRateDtoToRfpRate(planDto.getRates(), plan));
        }
        return plan;
    }

    private static AncillaryClass rfpClassDtoToRfpClass(AncillaryClassDto classDto, AncillaryPlan plan) {
        if (classDto == null) {
            return null;
        }
        try {
            AncillaryClass entity = dtoToEntityClassMap.get(classDto.getClass()).newInstance();
            BeanUtils.copyProperties(classDto, entity);
            entity.setAncillaryPlan(plan);
            return entity;
        } catch (InstantiationException | IllegalAccessException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private static AncillaryRate rfpRateDtoToRfpRate(AncillaryRateDto rateDto, AncillaryPlan plan) {
        if (rateDto == null) {
            return null;
        }
        try {
            AncillaryRate entity = dtoToEntityRateMap.get(rateDto.getClass()).newInstance();
            BeanUtils.copyProperties(rateDto, entity, "ages");
            if (rateDto instanceof VoluntaryRateDto && ((VoluntaryRateDto) rateDto).getAges() != null) {
                ArrayList<AncillaryRateAge> ages = new ArrayList<>();
                ((VoluntaryRateDto) rateDto).getAges().forEach(age -> ages.add(rfpRateAgeDtoToRfpRateAge(age, (VoluntaryRate) entity)));
                ((VoluntaryRate) entity).setAges(ages);
            }
            entity.setAncillaryPlan(plan);
            return entity;
        } catch (InstantiationException | IllegalAccessException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private static AncillaryRateAge rfpRateAgeDtoToRfpRateAge(AncillaryRateAgeDto age, VoluntaryRate rate) {
        AncillaryRateAge entity = new AncillaryRateAge();
        BeanUtils.copyProperties(age, entity);
        entity.setAncillaryRate(rate);
        return entity;
    }
}
