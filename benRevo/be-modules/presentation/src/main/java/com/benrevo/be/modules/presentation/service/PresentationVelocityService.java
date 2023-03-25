package com.benrevo.be.modules.presentation.service;

import static com.benrevo.common.enums.CarrierType.carrierMatches;
import static com.benrevo.common.util.MathUtils.getDiscountFactor;
import static com.benrevo.common.util.StreamUtils.mapToList;
import static com.benrevo.common.util.StreamUtils.mapToMap;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import static org.apache.commons.lang.StringEscapeUtils.escapeXml;
import static org.apache.commons.lang3.ObjectUtils.defaultIfNull;
import static org.apache.commons.lang3.ObjectUtils.firstNonNull;

import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CarrierHistoryDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.ExtProductDto;
import com.benrevo.common.dto.QuoteOptionContributionsDto;
import com.benrevo.common.dto.QuoteOptionFinalSelectionDto;
import com.benrevo.common.dto.QuoteOptionNetworkRidersDto;
import com.benrevo.common.dto.QuoteOptionPlanBriefDto;
import com.benrevo.common.dto.QuoteOptionRidersDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.dto.RiderDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.google.common.base.Joiner;
import java.io.IOException;
import java.io.StringWriter;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PresentationVelocityService {

    @Autowired
    private VelocityEngine velocityEngine;

    @Autowired
    private SharedRfpService sharedRfpService;

    @Autowired
    private RfpQuoteService rfpQuoteService;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;
    
    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Value("${app.carrier}")
    String[] appCarrier;

    public String getQuoteViewedNotificationTemplate(String templatePath, Broker authenticatedBroker, Broker clientBroker, ClientDto client, String userName) {

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("client_name", escapeXml(client.getClientName()));
        velocityContext.put("effective_date", client.getEffectiveDate());
        velocityContext.put("eligible_employees", client.getEligibleEmployees());
        velocityContext.put("user_name", escapeXml(userName));

        velocityContext.put("submittedByGA", authenticatedBroker.isGeneralAgent());
        velocityContext.put("brokerage_name", escapeXml(clientBroker.getName()));
        velocityContext.put("ga_broker_name", escapeXml(authenticatedBroker.getName()));

        
        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }
    
    public String getNewSaleNotificationTemplate(String templatePath, Broker authenticatedBroker, Broker clientBroker, Client client, ClientMemberDto user) {
        VelocityContext velocityContext = new VelocityContext();
        String presaleName = null, salesName = null;
        DecimalFormat df = new DecimalFormat("#0.00");
        DecimalFormat rxFormat = new DecimalFormat("0.#x");

        salesName = client.getSalesFullName();
        presaleName = client.getPresalesFullName();
        
        velocityContext.put("submittedByGA", authenticatedBroker.isGeneralAgent());
        velocityContext.put("brokerage_name", escapeXml(clientBroker.getName()));
        velocityContext.put("ga_broker_name", escapeXml(authenticatedBroker.getName()));

        velocityContext.put("presale_name", escapeXml(presaleName));
        velocityContext.put("sales_name", escapeXml(salesName));
        velocityContext.put("case_name", escapeXml(client.getClientName())); // same as company name
        velocityContext.put("company_name", escapeXml(client.getClientName()));
        if (user != null) {
            velocityContext.put("user_name", escapeXml(user.getFullName()));
        }
        velocityContext.put("effective_date", DateHelper.fromDateToString(client.getEffectiveDate()));
        velocityContext.put("nbc_name", escapeXml(salesName));
        velocityContext.put("address_city", firstNonNull(client.getCity(), client.getContactCity()));
        velocityContext.put("address_state", firstNonNull(client.getState(), client.getContactState()));
        velocityContext.put("eligible_employees", client.getEligibleEmployees());
        velocityContext.put("expected_subscribers", client.getParticipatingEmployees());
        QuoteOptionFinalSelectionDto finalSelection = rfpQuoteService.getSelectedQuoteOptions(client.getClientId());
        LinkedHashMap<String, Map<Integer, List<QuoteOptionPlanBriefDto>>> selectedPlans = new LinkedHashMap<>();
        
        // discount
        List<Pair<String,Float>> discounts = new ArrayList<>();
        if (Boolean.TRUE.equals(finalSelection.getDentalBundleDiscountApplied())) {
            discounts.add(Pair.of("Dental", finalSelection.getDentalBundleDiscountPercent()));
        };
        if (Boolean.TRUE.equals(finalSelection.getVisionBundleDiscountApplied())) {
            discounts.add(Pair.of("Vision",finalSelection.getVisionBundleDiscountPercent()));
        };
        for(ExtProductDto extProduct : finalSelection.getExternalProducts()) {
            discounts.add(Pair.of(extProduct.getDisplayName(),extProduct.getDiscountPercent()));
        }
        // renewal penalty discounts
        List<Pair<String,Float>> renewalDiscounts = new ArrayList<>();
        if (finalSelection.getDentalRenewalDiscountPenalty() != null) {
        	renewalDiscounts.add(Pair.of("Dental", finalSelection.getDentalRenewalDiscountPenalty()));
        };
        if (finalSelection.getVisionRenewalDiscountPenalty() != null) {
        	renewalDiscounts.add(Pair.of("Vision", finalSelection.getVisionRenewalDiscountPenalty()));
        };
        
        // group selected plans by tiers count
        if(!finalSelection.getMedicalPlans().isEmpty() && isValidAppCarrierPlans(finalSelection.getMedicalPlans())) {

            // find RX plans and Riders
            Map<Long, QuoteOptionPlanBriefDto> rxPlansMap = new HashMap<>();
            Map<Long, List<QuoteOptionPlanBriefDto>> riderPlansMap = new HashMap<>();
            if(finalSelection.getMedicalQuoteOptionId() != null) {
                RfpQuoteOption quoteOption = rfpQuoteOptionRepository.findOne(finalSelection.getMedicalQuoteOptionId());
                for (RfpQuoteOptionNetwork optNetwork : quoteOption.getRfpQuoteOptionNetworks()) {
                    RfpQuoteNetworkPlan selectedPlan = optNetwork.getSelectedRfpQuoteNetworkPlan();
                    if(selectedPlan == null) {
                        continue;
                    }
                    
                    RfpQuoteNetworkPlan selectedRxPlan = optNetwork.getSelectedRfpQuoteNetworkRxPlan();
                    if(selectedRxPlan != null) {
                        QuoteOptionPlanBriefDto rxPlan = new QuoteOptionPlanBriefDto();
                        rxPlan.setName(selectedRxPlan.getPnn().getName());
                        rxPlan.setType(selectedRxPlan.getPnn().getPlanType());
                        rxPlan.setTier1Rate(selectedRxPlan.getTier1Rate());
                        rxPlan.setTier2Rate(selectedRxPlan.getTier2Rate());
                        rxPlan.setTier3Rate(selectedRxPlan.getTier3Rate());
                        rxPlan.setTier4Rate(selectedRxPlan.getTier4Rate());
                        if(carrierMatches(CarrierType.UHC.name(), appCarrier)) {
                            rxPlan.setIsDollarPlan(selectedRxPlan.getAttributes()
                                    .stream()
                                    .anyMatch(attribute -> QuotePlanAttributeName.DOLLAR_RX_RATE.equals(attribute.getName())));
                        }
                        rxPlansMap.put(selectedPlan.getRfpQuoteNetworkPlanId(), rxPlan);
                    }

                    List<QuoteOptionPlanBriefDto> rPlans = mapToList(optNetwork.getSelectedRiders(), rider -> {
                        QuoteOptionPlanBriefDto riderPlan = new QuoteOptionPlanBriefDto();
                        riderPlan.setName(rider.getRiderMeta().getCode() + " (" + selectedPlan.getPnn().getName() + ")");
                        riderPlan.setType("RIDER_" + optNetwork.getRfpQuoteNetwork().getNetwork().getType());
                        riderPlan.setTier1Rate(rider.getTier1Rate());
                        riderPlan.setTier2Rate(rider.getTier2Rate());
                        riderPlan.setTier3Rate(rider.getTier3Rate());
                        riderPlan.setTier4Rate(rider.getTier4Rate());
                        return riderPlan;
                    });

                    /*
                     * Apply Renewal discount penalty for riders as well
                     * https://app.asana.com/0/310271518148409/720392218984113/f
                     */
                    float renewalDiscountPenalty = 0f;
                    if (finalSelection.getDentalRenewalDiscountPenalty() != null ) {
                        renewalDiscountPenalty += finalSelection.getDentalRenewalDiscountPenalty();
                    }
                    if (finalSelection.getVisionRenewalDiscountPenalty() != null) {
                        renewalDiscountPenalty += finalSelection.getVisionRenewalDiscountPenalty();
                    }
                    if (renewalDiscountPenalty > 0f) {
                        // 1.5% -> 0.985, 1% -> 0.99, 0.5% -> 0.995
                        renewalDiscountPenalty = getDiscountFactor(renewalDiscountPenalty);
                        for (QuoteOptionPlanBriefDto rPlan : rPlans) {
                            Float tier1Rate = defaultIfNull(rPlan.getTier1Rate(), 0f);
                            if (tier1Rate > 0f) {
                                rPlan.setTier1Rate(tier1Rate / renewalDiscountPenalty);
                            }
                            Float tier2Rate = defaultIfNull(rPlan.getTier2Rate(), 0f);
                            if (tier2Rate > 0f) {
                                rPlan.setTier2Rate(tier2Rate / renewalDiscountPenalty);
                            }
                            Float tier3Rate = defaultIfNull(rPlan.getTier3Rate(), 0f);
                            if (tier3Rate > 0f) {
                                rPlan.setTier3Rate(tier3Rate / renewalDiscountPenalty);
                            }
                            Float tier4Rate = defaultIfNull(rPlan.getTier4Rate(), 0f);
                            if (tier4Rate > 0f) {
                                rPlan.setTier4Rate(tier4Rate / renewalDiscountPenalty);
                            }
                        }
                    }
                    riderPlansMap.put(selectedPlan.getRfpQuoteNetworkPlanId(), rPlans);
                }
            }
            
            // Adding RX plans and riders to medical plans grouping by plan
            List<QuoteOptionPlanBriefDto> medicalPlans = new ArrayList<>();
            for (QuoteOptionPlanBriefDto medicalPlan : finalSelection.getMedicalPlans()) {
                medicalPlans.add(medicalPlan);
                QuoteOptionPlanBriefDto rxPlan = rxPlansMap.get(medicalPlan.getPlanId());
                if (rxPlan != null) {
                    medicalPlans.add(rxPlan);    
                }
                List<QuoteOptionPlanBriefDto> riderPlans = riderPlansMap.get(medicalPlan.getPlanId());
                if (riderPlans != null) {
                    medicalPlans.addAll(riderPlans);    
                }
            }
            
            LinkedHashMap<Integer, List<QuoteOptionPlanBriefDto>> temp = new LinkedHashMap<>();
            temp.put(findRatingTiersByPlans(finalSelection.getMedicalPlans()), medicalPlans);
            selectedPlans.put(Constants.MEDICAL, temp);
        }
        if(!finalSelection.getDentalPlans().isEmpty() && isValidAppCarrierPlans(finalSelection.getDentalPlans())) {
            LinkedHashMap<Integer, List<QuoteOptionPlanBriefDto>> temp = new LinkedHashMap<>();
            temp.put(findRatingTiersByPlans(finalSelection.getDentalPlans()), finalSelection.getDentalPlans());
            selectedPlans.put(Constants.DENTAL, temp);
        }
        if(!finalSelection.getVisionPlans().isEmpty() && isValidAppCarrierPlans(finalSelection.getVisionPlans())) {
            LinkedHashMap<Integer, List<QuoteOptionPlanBriefDto>> temp = new LinkedHashMap<>();
            temp.put(findRatingTiersByPlans(finalSelection.getVisionPlans()), finalSelection.getVisionPlans());
            selectedPlans.put(Constants.VISION, temp);
        }


        velocityContext.put("carriers_replaced", StringUtils.join(findCurrentCarriers(client.getClientId(), finalSelection), '/'));
        if(!client.getAttributes().stream().anyMatch(a -> a.getName().equals(AttributeName.RENEWAL))) {
        	velocityContext.put("bundle", getBundleText(!finalSelection.getMedicalPlans().isEmpty(),
	            !finalSelection.getDentalPlans().isEmpty(), !finalSelection.getVisionPlans().isEmpty()));
	    }

        velocityContext.put("selected_plans_by_tiers", selectedPlans);
        velocityContext.put("bundle_discounts", discounts);
        velocityContext.put("renewal_discounts", renewalDiscounts);
        velocityContext.put("StringUtils", StringUtils.class);
        velocityContext.put("DecimalFormat", df);
        velocityContext.put("RXFormat", rxFormat); 
        
        //Plan type and description (All data fount the in the Final Selection Page)
        try (StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch (IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }
    
    private List<String> findCurrentCarriers(Long clientId, QuoteOptionFinalSelectionDto finalSelection) {
        List<String> result = new ArrayList<>();
        List<RfpDto> rfpDto = sharedRfpService.getByClientId(clientId);
        for (RfpDto dto : rfpDto) {
            String category = dto.getProduct();
            if(category.equalsIgnoreCase(Constants.MEDICAL) && isValidAppCarrierPlans(finalSelection.getMedicalPlans())){
                getCurrentCarrierNames(result, dto);
            }else if(category.equalsIgnoreCase(Constants.DENTAL) && isValidAppCarrierPlans(finalSelection.getDentalPlans())){
                getCurrentCarrierNames(result, dto);
            }else if(category.equalsIgnoreCase(Constants.VISION) && isValidAppCarrierPlans(finalSelection.getVisionPlans())) {
                getCurrentCarrierNames(result, dto);
            }
        }
        return result;
    }
    
    private void getCurrentCarrierNames(List<String> result, RfpDto dto) {
        for (CarrierHistoryDto ch : dto.getCarrierHistories()) {
            if (ch.isCurrent()) {
                result.add(ch.getName());
            }
        }
    }
    
    private Integer findRatingTiersByPlans(List<QuoteOptionPlanBriefDto> plans) {
        if(plans.isEmpty()) {
            // not client error, programmer error
            throw new IllegalArgumentException("Plan list cannot be empty");
        }
        QuoteOptionPlanBriefDto anyPlanFromCommonQuote = plans.get(0);
        RfpQuoteNetworkPlan plan = rfpQuoteNetworkPlanRepository.findOne(anyPlanFromCommonQuote.getPlanId());
        return plan.getRfpQuoteNetwork().getRfpQuote().getRatingTiers();
    }
    
    // only include app_carrier plans in the new case submission email
    private boolean isValidAppCarrierPlans(List<QuoteOptionPlanBriefDto> plans){
        if(plans.isEmpty()) {
            return false;
        }
        QuoteOptionPlanBriefDto anyPlanFromCommonQuote = plans.get(0);
        RfpQuoteNetworkPlan plan = rfpQuoteNetworkPlanRepository.findOne(anyPlanFromCommonQuote.getPlanId());

        Carrier carrier = plan.getRfpQuoteNetwork().getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();

        if(carrierMatches(Constants.ANTHEM_CARRIER, appCarrier)) {
            if(!carrier.getName().equals(CarrierType.ANTHEM_BLUE_CROSS.name())
                && !carrier.getName().equals(CarrierType.ANTHEM_CLEAR_VALUE.name())){
                return false;
            }
        }

        if(carrierMatches(CarrierType.UHC.name(), appCarrier)) {
            if(!carrier.getName().equals(CarrierType.UHC.name())){
                return false;
            }
        }

        return true;
    }
    
    private List<QuoteOptionPlanBriefDto> removeDuplicatesByName(List<QuoteOptionPlanBriefDto> dtos) {
        return mapToMap(dtos, QuoteOptionPlanBriefDto::getName, identity()).values().stream().collect(toList());
    }
    
    private String getBundleText(Boolean isMedicalPlansAvailable, Boolean isDentalPlansAvailable, Boolean isVisionPlansAvailable){
        String text = "";

        if(!isDentalPlansAvailable && !isVisionPlansAvailable){
            text = "1% for Dental, 0.5% for Vision. The premiums below do not reflect applicable dental and vision bundling discounts, please apply separately.";
        } else if(!isDentalPlansAvailable){
            text = "1% for Dental. The premiums below do not reflect applicable dental bundling discount, please apply separately.";
        } else if(!isVisionPlansAvailable){
            text = "0.5% for Vision. The premiums below do not reflect applicable vision bundling discount, please apply separately.";
        }

        return text;
    }
}
