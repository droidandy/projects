package com.benrevo.dashboard.service;

import static com.benrevo.be.modules.shared.service.SharedRfpQuoteService.MONTHS_IN_YEAR;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calRfpQuoteOptionNetworkTotalEnrollment;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcAlterPlanTotal;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcAlterRateBankPlanTotal;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcClientPlanRenewalTotal;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcClientPlanTotal;
import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.RfpQuoteAttributeName.COMMUNICATION_BUDGET;
import static com.benrevo.common.enums.RfpQuoteAttributeName.IMPLEMENTATION_BUDGET;
import static com.benrevo.common.enums.RfpQuoteAttributeName.WELLNESS_BUDGET;
import static com.benrevo.common.mail.SMTPMailer.setMailRecipients;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.MathUtils.round;
import static java.lang.String.format;
import static java.util.Objects.isNull;
import static java.util.Optional.ofNullable;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toMap;
import static javax.mail.Message.RecipientType.BCC;
import static javax.mail.Message.RecipientType.CC;
import static javax.mail.Message.RecipientType.TO;
import static org.apache.commons.collections4.CollectionUtils.isEmpty;

import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.ClientRateBankDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.enums.RfpQuoteAttributeName;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.MathUtils;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Notification;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteAttribute;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.NotificationRepository;
import com.benrevo.data.persistence.repository.PersonRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemDashboardRateBankService {

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;

    @Autowired
    private AttributeRepository attributeRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private AnthemDashboardEmailService anthemDashboardEmailService;

    public ClientRateBankDto getRateBankDetails(Long clientId, QuoteType quoteType) {
        ClientRateBankDto result = getRateBankPlans(clientId, quoteType, Constants.MEDICAL);

        // set budget information from rfpQuote
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.
            findByClientIdAndCategoryAndQuoteType(clientId, Constants.MEDICAL, quoteType);

        if(!isEmpty(rfpQuotes)){
            RfpQuote rfpQuote = rfpQuotes.get(0); // there should be only one latest quote
            rfpQuote.getAttributes().forEach(attr -> {
                switch(attr.getName()){
                    case WELLNESS_BUDGET:
                        result.setWellnessBudget(new Float(attr.getValue()));
                        break;
                    case COMMUNICATION_BUDGET:
                        result.setCommunicationBudget(new Float(attr.getValue()));
                        break;
                    case IMPLEMENTATION_BUDGET:
                        result.setImplementationBudget(new Float(attr.getValue()));
                        break;
                    default:
                        throw new BaseException(format("Quote attribute with name '%s' not acceptable", attr.getName()));
                }
            });
        }

        return result;
    }

    public ClientRateBankDto getRateBankPlans(Long clientId, QuoteType quoteType, String product){

        List<RfpQuoteOption> rfpQuoteOptions = rfpQuoteOptionRepository.
            findByClientIdAndCategoryAndQuoteType(clientId, product, quoteType)
            .stream()
            .filter(o -> o.getRfpQuoteOptionName().equalsIgnoreCase("Option 1"))
            .collect(Collectors.toList());

        RfpQuoteOption quoteOption = isEmpty(rfpQuoteOptions)? null : rfpQuoteOptions.get(0);
        return getRateBankPlans(clientId, quoteOption, product);
    }

    public ClientRateBankDto getRateBankPlans(Long clientId, RfpQuoteOption quoteOption, String product) {
        
        ClientRateBankDto result = new ClientRateBankDto();

        if (quoteOption == null) {
            return result;
        }
        
        List<ClientRateBankDto.RateBankPlanDto> plans = new ArrayList<>();

        Map<Long, RfpQuoteOptionNetwork> optionNetworkIndex = quoteOption
            .getRfpQuoteOptionNetworks().stream()
            .filter(on -> on.getClientPlan() != null)
            .collect(
                toMap(
                    on -> {
                        return on.getClientPlan().getClientPlanId();
                    },
                    identity()
                )
            );

        PlanCategory planCategory = PlanCategory.valueOf(product);
        List<ClientPlan> clientPlans = clientPlanRepository
            .findByClientClientIdAndPnnPlanTypeIn(
                clientId, planCategory.getPlanTypes());

        if (!Constants.MEDICAL.equals(product)) {
            // FIXME EligibleForDiscount if option have name "Renewal" ?
            result.setEligibleForDiscount(SharedRfpQuoteService.isEligibleForDiscount(quoteOption, false));
        }
        
        // 1) starting from all client plans
        boolean isOptionAlongsideKaiser = sharedRfpQuoteService.isAlongsideKaiser(quoteOption);
        Set<Long> layoutQuoteOptionNetworks = new HashSet<>();

        Float totalMonthlyCostOfAllAnthemPlansWithoutRateBank = 0f;
        Float totalMonthlyAnthemPremium = 0F;
        Float totalMonthlyCostOfAllPlansWithRateBankApplied = 0f;
        Long totalEnrollmentOfAnthemPlans = 0L;


        Float totalMonthlyCostOfIncumbentPlans = 0F;
        Float totalRenewalMonthlyCostOfIncumbentPlans = 0F;
        
        int currentEnrollment = 0;
        String carrierName = "";

        for (ClientPlan clientPlan : clientPlans) {
            ClientRateBankDto.RateBankPlanDto plan = new ClientRateBankDto.RateBankPlanDto();
            plan.setPlanType(clientPlan.getPnn().getNetwork().getType());
            Float currentPlanTotal = calcClientPlanTotal(clientPlan);
            Float currentPlanRenewalTotal = calcClientPlanRenewalTotal(clientPlan);
            
            currentEnrollment += clientPlan.getTier1Census() 
                    + clientPlan.getTier2Census() 
                    + clientPlan.getTier3Census() 
                    + clientPlan.getTier4Census();
            
            String currentCarrierName = clientPlan.getPnn().getNetwork().getCarrier().getDisplayName();
            if (carrierName.isEmpty()) {
                carrierName = currentCarrierName;
            } else if (!carrierName.equals(currentCarrierName)) {
                carrierName = Constants.MULTIPLE_CARRIER_DISPLAY_NAME;
            }
            
            // if option (rfp_quote_option_network) already has item for current plan (client_plan_id = current)
            RfpQuoteOptionNetwork optNetwork = optionNetworkIndex.get(clientPlan.getClientPlanId());
            if(optNetwork != null) {
                plan.setNetworkName(optNetwork.getRfpQuoteNetwork().getNetwork().getName());
                // isKaiserNetwork should be "false" for Full takeover case
                plan.setKaiserNetwork(sharedRfpQuoteService.isKaiserNetwork(optNetwork)
                    && isOptionAlongsideKaiser);

                plan.setEnrollment(calRfpQuoteOptionNetworkTotalEnrollment(optNetwork));
                plan.setOutOfState(optNetwork.isOutOfState());

                if (optNetwork.getSelectedRfpQuoteNetworkPlan() != null) {

                    RfpQuoteNetworkPlan networkPlan = optNetwork.getSelectedRfpQuoteNetworkPlan();
                    plan.setRfpQuoteNetworkPlanId(networkPlan.getRfpQuoteNetworkPlanId());
                    plan.setPlanName(networkPlan.getPnn().getName());

                    // do not calc info for kaiser rqon(s)
                    if(!plan.isKaiserNetwork()) {
                        totalMonthlyCostOfIncumbentPlans += currentPlanTotal;
                        totalRenewalMonthlyCostOfIncumbentPlans += currentPlanRenewalTotal;

                        if (optNetwork.getRfpQuoteNetwork() != null &&
                            optNetwork.getRfpQuoteNetwork().getDiscountPercent() != null) {

                            plan.setNetworkRateBank(
                                optNetwork.getRfpQuoteNetwork().getDiscountPercent());
                            plan.setRateBankApplied(true);
                        }

                        // Apply discount to plan cost
                        Float newPlanTotal = calcAlterRateBankPlanTotal(optNetwork, networkPlan);
                        totalMonthlyCostOfAllAnthemPlansWithoutRateBank += newPlanTotal;
                        if (plan.isRateBankApplied()) {
                            Float discountFactor = MathUtils
                                .getDiscountFactor(plan.getNetworkRateBank());
                            totalMonthlyCostOfAllPlansWithRateBankApplied +=
                                newPlanTotal * discountFactor;
                            newPlanTotal *= discountFactor;
                        }

                        totalEnrollmentOfAnthemPlans += plan.getEnrollment();
                        totalMonthlyAnthemPremium += newPlanTotal;
                        plan.setDollarDifference(newPlanTotal - currentPlanTotal);
                        plan.setPercentDifference(
                            MathUtils.diffPecent(newPlanTotal, currentPlanTotal, 1));

                        plan.setRenewalDollarDifference(newPlanTotal - currentPlanRenewalTotal);
                        plan.setRenewalPercentDifference(
                            MathUtils.diffPecent(newPlanTotal, currentPlanRenewalTotal, 1));
                    }
                }
                layoutQuoteOptionNetworks.add(optNetwork.getRfpQuoteOptionNetworkId());
            }
            plans.add(plan);
        }

        // 2) if option includes proposed plan of type that have no client plan, add it
        for(RfpQuoteOptionNetwork optNetwork : quoteOption.getRfpQuoteOptionNetworks()) {
            if(layoutQuoteOptionNetworks.contains(optNetwork.getRfpQuoteOptionNetworkId())) {
                continue;
            }
            // item of plans layout by network
            ClientRateBankDto.RateBankPlanDto plan = new ClientRateBankDto.RateBankPlanDto();
            plan.setNetworkName(optNetwork.getRfpQuoteNetwork().getNetwork().getName());
            plan.setPlanType(optNetwork.getRfpQuoteNetwork().getNetwork().getType());

            // zero values since no client plan
            Float currentPlanTotal = 0F;
            Float currentPlanRenewalTotal = 0F;

            // isKaiserNetwork should be "false" for Full takeover case
            plan.setKaiserNetwork(sharedRfpQuoteService.isKaiserNetwork(optNetwork) && isOptionAlongsideKaiser);
            plan.setEnrollment(calRfpQuoteOptionNetworkTotalEnrollment(optNetwork));
            plan.setOutOfState(optNetwork.isOutOfState());

            if(optNetwork.getSelectedRfpQuoteNetworkPlan() != null) {
                RfpQuoteNetworkPlan networkPlan = optNetwork.getSelectedRfpQuoteNetworkPlan();
                plan.setRfpQuoteNetworkPlanId(networkPlan.getRfpQuoteNetworkPlanId());
                plan.setPlanName(networkPlan.getPnn().getName());

                // do not calc info for kaiser rqon(s)
                if(!plan.isKaiserNetwork()) {
                    if (optNetwork.getRfpQuoteNetwork() != null &&
                        optNetwork.getRfpQuoteNetwork().getDiscountPercent() != null) {

                        plan.setNetworkRateBank(
                            optNetwork.getRfpQuoteNetwork().getDiscountPercent());
                        plan.setRateBankApplied(true);
                    }

                    // Apply discount to plan cost
                    Float newPlanTotal = calcAlterRateBankPlanTotal(optNetwork, networkPlan);
                    totalMonthlyCostOfAllAnthemPlansWithoutRateBank += newPlanTotal;
                    if (plan.isRateBankApplied()) {
                        Float discountFactor = MathUtils
                            .getDiscountFactor(plan.getNetworkRateBank());
                        totalMonthlyCostOfAllPlansWithRateBankApplied +=
                            newPlanTotal * discountFactor;
                        newPlanTotal *= discountFactor;
                    }

                    totalEnrollmentOfAnthemPlans += plan.getEnrollment();
                    totalMonthlyAnthemPremium += newPlanTotal;
                    plan.setDollarDifference(newPlanTotal - currentPlanTotal);
                    plan.setPercentDifference(
                        MathUtils.diffPecent(newPlanTotal, currentPlanTotal, 1));

                    plan.setRenewalDollarDifference(newPlanTotal - currentPlanRenewalTotal);
                    plan.setRenewalPercentDifference(
                        MathUtils.diffPecent(newPlanTotal, currentPlanRenewalTotal, 1));
                }
            }
            plans.add(plan);
        }

        result.setEnrollment(currentEnrollment);
        result.setCarrierName(carrierName);
        result.setPEPY(
            round(
                ((totalMonthlyCostOfAllAnthemPlansWithoutRateBank * MONTHS_IN_YEAR)
                - (totalMonthlyCostOfAllPlansWithRateBankApplied * MONTHS_IN_YEAR)) /
                (totalEnrollmentOfAnthemPlans),
                2)
        );

        result.setRateBankAmountRequested(
            round(
                (totalMonthlyCostOfAllAnthemPlansWithoutRateBank * MONTHS_IN_YEAR) -
                    (totalMonthlyCostOfAllPlansWithRateBankApplied * MONTHS_IN_YEAR),
                2)
        );

        result.setTotalPremium(round(totalMonthlyAnthemPremium * MONTHS_IN_YEAR, 2));

        result.setTotalDollarDifference(round(totalMonthlyAnthemPremium - totalMonthlyCostOfIncumbentPlans,2));
        result.setTotalRenewalDollarDifference(round(totalMonthlyAnthemPremium - totalRenewalMonthlyCostOfIncumbentPlans,2));
        
        // current cost
        result.setCostVsCurrent(round(
            (totalMonthlyAnthemPremium * MONTHS_IN_YEAR) -
                (totalMonthlyCostOfIncumbentPlans * MONTHS_IN_YEAR),2));

        if(totalMonthlyCostOfIncumbentPlans != 0F) {
            result.setCostVsCurrentPercentage(
                round((result.getCostVsCurrent() / (totalMonthlyCostOfIncumbentPlans
                    * MONTHS_IN_YEAR)) * 100, 2));
        }

        // renewal
        result.setCostVsRenewal(
            round((totalMonthlyAnthemPremium * MONTHS_IN_YEAR) -
                (totalRenewalMonthlyCostOfIncumbentPlans * MONTHS_IN_YEAR),2)
        );

        if(totalRenewalMonthlyCostOfIncumbentPlans != 0F){
            result.setCostVsRenewalPercentage(
                round((result.getCostVsRenewal()/(totalRenewalMonthlyCostOfIncumbentPlans
                    * MONTHS_IN_YEAR)) * 100, 2));
        }

        result.setPlans(plans);
        return result;
    }

    public void update(Long clientId, QuoteType quoteType, ClientRateBankDto dto) {
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.
            findByClientIdAndCategoryAndQuoteType(clientId, Constants.MEDICAL, quoteType);

        if (!isEmpty(rfpQuotes)) {
            RfpQuote rfpQuote = rfpQuotes.get(0); // there should be only one latest quote

            // update or create attribute
            saveRfpQuoteAttribute(rfpQuote, WELLNESS_BUDGET, dto.getWellnessBudget().toString());
            saveRfpQuoteAttribute(rfpQuote, COMMUNICATION_BUDGET, dto.getCommunicationBudget().toString());
            saveRfpQuoteAttribute(rfpQuote, IMPLEMENTATION_BUDGET, dto.getImplementationBudget().toString());
        }

        // save rate bank discount in rfpQuoteNetwork
        Map<Long, Set<String>> networkIdToRateBankDiscount = new HashMap<>();
        for(ClientRateBankDto.RateBankPlanDto plan : dto.getPlans()){
            if(isNull(plan.getRfpQuoteNetworkPlanId())){
                throw new BaseException(format("Plan with name %s has no rfpQuoteNetworkId", plan.getPlanName()));
            }

            RfpQuoteNetworkPlan rfpQuoteNetworkPlan = rfpQuoteNetworkPlanRepository.findOne(
                plan.getRfpQuoteNetworkPlanId());

            if(isNull(rfpQuoteNetworkPlan)){
                throw new BaseException(format("Plan with name %s and id not found!", plan.getPlanName(),
                    plan.getRfpQuoteNetworkPlanId()));
            }

            if(!isNull(plan.getNetworkRateBank())) {
                RfpQuoteNetwork rfpQuoteNetwork = rfpQuoteNetworkPlan.getRfpQuoteNetwork();
                if (!networkIdToRateBankDiscount
                    .containsKey(rfpQuoteNetwork.getRfpQuoteNetworkId())) {
                    networkIdToRateBankDiscount.put(rfpQuoteNetwork.getRfpQuoteNetworkId(),
                        new HashSet<>(Arrays.asList(plan.getNetworkRateBank().toString())));
                } else {
                    Set<String> prevRateBank = networkIdToRateBankDiscount
                        .get(rfpQuoteNetwork.getRfpQuoteNetworkId());
                    if (!prevRateBank.contains(plan.getNetworkRateBank().toString())) {
                        throw new BaseException(
                            format("Plan with name %s has a different rate bank than previous"
                                    + " plans in the same network. All plans in the same network must have the same rate bank amount!",
                                plan.getPlanName()));
                    }
                    prevRateBank.add(plan.getNetworkRateBank().toString());
                    networkIdToRateBankDiscount
                        .put(rfpQuoteNetwork.getRfpQuoteNetworkId(), prevRateBank);
                }
                rfpQuoteNetwork.setDiscountPercent(plan.getNetworkRateBank());
                rfpQuoteNetworkRepository.save(rfpQuoteNetwork);
            }
        }
    }


    private void saveRfpQuoteAttribute(RfpQuote rfpQuote, RfpQuoteAttributeName name, String value){
        if(!isNull(value)) {
            RfpQuoteAttribute attribute = attributeRepository
                .findRfpQuoteAttributeByRfpQuoteIdIdAndName(rfpQuote.getRfpQuoteId(),
                    name);
            if(isNull(attribute)){
                attribute = new RfpQuoteAttribute(rfpQuote, name,
                    value);
            }else{
                attribute.setValue(value);
            }
            attributeRepository.save(attribute);
        }
    }

    public void sendRateBank(Long clientId, QuoteType quoteType, String note, List<MultipartFile> files) {
        ClientRateBankDto dto = getRateBankDetails(clientId, quoteType);
        anthemDashboardEmailService.sendRateRequest(clientId, quoteType, dto, note, files);
    }
}
