package com.benrevo.be.modules.shared.service.pptx;

import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcEmployerCost;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcEmployerFund;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.getSpecialRiderCosts;
import static com.benrevo.common.util.MathUtils.getDiscountFactor;
import static com.benrevo.common.util.MathUtils.round;
import static java.util.Optional.ofNullable;

import com.benrevo.be.modules.shared.service.AdministrativeFeeService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.util.PlanCalcHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.PresentationOption;
import com.benrevo.data.persistence.entities.QuoteOption;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.PresentationOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import com.google.common.base.Functions;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.MutableTriple;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class BasePptxDataPreparationService {

    private static final int MONTHS_IN_YEAR = 12;

    private final String[] MEDICAL_BENEFITS_TEMPLATE = new String[] {
        "INDIVIDUAL_DEDUCTIBLE",
        "FAMILY_DEDUCTIBLE",
        "CO_INSURANCE",
        "INDIVIDUAL_OOP_LIMIT",
        "FAMILY_OOP_LIMIT",
        "PCP",
        "SPECIALIST",
        "INPATIENT_HOSPITAL",
        "OUTPATIENT_SURGERY",
        "EMERGENCY_ROOM",
        "URGENT_CARE",
        "RX_INDIVIDUAL_DEDUCTIBLE",
        "RX_FAMILY_DEDUCTIBLE",
        "MEMBER_COPAY_TIER_1",
        "MEMBER_COPAY_TIER_2",
        "MEMBER_COPAY_TIER_3",
        "MEMBER_COPAY_TIER_4",
        "MAIL_ORDER"  };

    private final String[] DHMO_BENEFITS_TEMPLATE = new String[] {
        "ORAL_EXAMINATION",
        "ADULT_PROPHY",
        "CHILD_PROPHY",
        "SILVER_FILL_1_SURFACE",
        "WHITE_FILL_1_SURFACE_ANTERIOR",
        "MOLAR_ROOT_CANAL",
        "PERIO_MAINTAINANCE",
        "SIMPLE_EXTRACTION_ERUPTED_TOOTH",
        "ORTHO_SERVICES_ADULTS",
        "ORTHO_SERVICES_CHILDREN"
    };

    private final String[] DPPO_BENEFITS_TEMPLATE = new String[] {
        "CALENDAR_YEAR_MAXIMUM",
        "DENTAL_INDIVIDUAL",
        "DENTAL_FAMILY",
        "WAIVED_FOR_PREVENTIVE",
        "CLASS_1_PREVENTIVE",
        "CLASS_2_BASIC",
        "CLASS_3_MAJOR",
        "CLASS_4_ORTHODONTIA",
        "ORTHODONTIA_LIFETIME_MAX",
        "ORTHO_ELIGIBILITY",
        "REIMBURSEMENT_SCHEDULE",
        "IMPLANT_COVERAGE"};

    private final String[] VISION_BENEFITS_TEMPLATE = new String[] {
        "EXAMS_FREQUENCY",
        "LENSES_FREQUENCY",
        "FRAMES_FREQUENCY",
        "CONTACTS_FREQUENCY",
        "EXAM_COPAY",
        "MATERIALS_COPAY",
        "FRAME_ALLOWANCE",
        "CONTACTS_ALLOWANCE" };


    protected static final Logger logger = LoggerFactory.getLogger(BasePptxDataPreparationService.class);

    @Autowired
    protected RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    protected RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private PresentationOptionRepository presentationOptionRepository;

    @Autowired
    protected RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;

    @Autowired
    private AdministrativeFeeService administrativeFeeService;

    @Autowired
    protected SharedRfpQuoteService sharedRfpQuoteService;

    @Value("${app.carrier}")
    protected String[] appCarrier;

    public Data prepareData(Client client) {
        Data data = new Data();
        // prepare data
        prepareCurrent(data.medical, client.getClientId());
        prepareCurrent(data.dental, client.getClientId());
        prepareCurrent(data.vision, client.getClientId());
        prepareAncillaryCurrent(data.life, client.getClientId());
        prepareAncillaryCurrent(data.volLife, client.getClientId());
        prepareAncillaryCurrent(data.ltd, client.getClientId());
        prepareAncillaryCurrent(data.std, client.getClientId());
        fillDataExcludeCurrent(data, client);
        return data;
    };

    protected void fillDataExcludeCurrent(Data data, Client client) {
        prepareRenewal(data.medical, client.getClientId());
        prepareRenewal(data.dental, client.getClientId());
        prepareRenewal(data.vision, client.getClientId());
        prepareAncillaryRenewal(data.life, client.getClientId());
        prepareAncillaryRenewal(data.volLife, client.getClientId());
        prepareAncillaryRenewal(data.ltd, client.getClientId());
        prepareAncillaryRenewal(data.std, client.getClientId());
        prepareAlternative(data, client);
    }

    private void prepareCurrent(Product product, Long clientId) {

        String category = product.category;
        PlanCategory planCategory = PlanCategory.valueOf(category);
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(
            clientId,
            planCategory.getPlanTypes());

        product.currentCarriers = SharedRfpQuoteService.getCarrierNames(clientPlans);

        RfpQuote currentQuote = sharedRfpQuoteService.prepareCurrentQuote(clientPlans);
        product.current.name = "Current";
        Carrier carrier = currentQuote.getRfpSubmission().getRfpCarrier().getCarrier();
        product.current.carrierDisplayName = carrier.getDisplayName();
        if(QuoteType.KAISER.equals(currentQuote.getQuoteType())) {
            product.current.carrierDisplayName += " / " + CarrierType.KAISER.displayName;
        }
        product.current.carrierAmBestRating = carrier.getAmBestRating();
        product.isCarrierNameAppCarrier = CarrierType.isCarrierNameAppCarrier(carrier.getName(), appCarrier);
        product.current.plans = new ArrayList<>(clientPlans.size());
        for (ClientPlan clientPlan : clientPlans) {
            PrepPlan prepPlan = new PrepPlan();

            prepPlan.name = clientPlan.getPnn().getName();
            prepPlan.enrollment1 = clientPlan.getTier1Census();
            prepPlan.enrollment2 = clientPlan.getTier2Census();
            prepPlan.enrollment3 = clientPlan.getTier3Census();
            prepPlan.enrollment4 = clientPlan.getTier4Census();
            prepPlan.enrollment = prepPlan.enrollment1 + prepPlan.enrollment2 + prepPlan.enrollment3 + prepPlan.enrollment4;

            prepPlan.rate1 = clientPlan.getTier1Rate();
            prepPlan.rate2 = clientPlan.getTier2Rate();
            prepPlan.rate3 = clientPlan.getTier3Rate();
            prepPlan.rate4 = clientPlan.getTier4Rate();

            prepPlan.total1 = clientPlan.getTier1Rate() * clientPlan.getTier1Census();
            prepPlan.total2 = clientPlan.getTier2Rate() * clientPlan.getTier2Census();
            prepPlan.total3 = clientPlan.getTier3Rate() * clientPlan.getTier3Census();
            prepPlan.total4 = clientPlan.getTier4Rate() * clientPlan.getTier4Census();

            prepPlan.total = round(prepPlan.total1 + prepPlan.total2 + prepPlan.total3 + prepPlan.total4, 2);
            Plan plan = clientPlan.getPnn().getPlan();
            prepPlan.carrierName = plan.getCarrier().getDisplayName();
            product.current.plans.add(prepPlan);

            // sum
            product.current.employer += calcEmployerCost(clientPlan);
            product.current.total += prepPlan.total;
            product.current.enrollment += prepPlan.enrollment;

            String planType = clientPlan.getPnn().getPlanType();
            product.binding.add(Pair.of("CLIENT_PLAN-" + clientPlan.getClientPlanId(), planType));
            
            Plan rxPlan = Constants.MEDICAL.equals(category)
                    ? ofNullable(clientPlan.getRxPnn())
                        .map(PlanNameByNetwork::getPlan)
                        .orElse(null)
                    : null;

            prepareBenefits(prepPlan, plan, rxPlan, planType);
        }

        product.current.annualEmployer = product.current.employer * MONTHS_IN_YEAR;
        product.current.annualTotal = product.current.total * MONTHS_IN_YEAR;
        
        // find ratingTiers
        rfpQuoteRepository.findByClientIdAndCategory(clientId, category)
            .stream()
            .findFirst()
            .ifPresent(q -> product.ratingTiers = q.getRatingTiers());
    }

    private void prepareRenewal(Product product, Long clientId) {

        String category = product.category;
        Option option = product.renewal;
        option.name = "Renewal";
        rfpQuoteOptionRepository.findByClientIdAndCategory(clientId, category)
            .stream()
            .filter(o -> StringUtils.containsIgnoreCase(o.getRfpQuoteOptionName(), "Renewal 1") ||
                StringUtils.equalsIgnoreCase(o.getRfpQuoteOptionName(), "Renewal"))
            .findFirst()
            .ifPresent(renewal -> {
                prepareRenewalOption(renewal, option, product);
            });

    }

    protected void prepareRenewalOption(RfpQuoteOption renewal, Option option, Product product) {
        for (RfpQuoteOptionNetwork optNetwork : renewal.getRfpQuoteOptionNetworks()) {
            RfpQuoteNetworkPlan networkPlan = optNetwork.getSelectedRfpQuoteNetworkPlan();
            if (networkPlan != null) {
                PrepPlan prepPlan = new PrepPlan();
                preparePlan(null, optNetwork, prepPlan);
                option.total += prepPlan.total;
                option.employer += prepPlan.employer;
                bindPlan(product, option, optNetwork, prepPlan);
                option.annualEmployer = option.employer * MONTHS_IN_YEAR;
                option.annualTotal = option.total * MONTHS_IN_YEAR;
            }
        }
    }

    private void prepareAlternative(Data data, Client client) {

        List<PresentationOption> presentationOptions = presentationOptionRepository.findByClientClientId(client.getClientId());

        // Medical can have the same option but different discounts
        // check optionId and discounts for Medical  
        Map<Pair<Long, Float>, Option> existedMedicalOptions = new HashMap<>();
        Map<Long, Option> existedOptions = new HashMap<>();
        Map<Long, Option> existedAncillaryOptions = new HashMap<>();
        
        for (PresentationOption presentationOption : presentationOptions) {

            boolean isPresentationOptionNotEmpty = false;
            List<MutableTriple<Product, QuoteOption, Option>> quoteOptions = Arrays.asList(
                    MutableTriple.of(data.medical, presentationOption.getMedicalRfpQuoteOption(), null),
                    MutableTriple.of(data.dental, presentationOption.getDentalRfpQuoteOption(), null),
                    MutableTriple.of(data.vision, presentationOption.getVisionRfpQuoteOption(), null),
                    MutableTriple.of(data.life, presentationOption.getLifeRfpQuoteAncillaryOption(), null),
                    MutableTriple.of(data.std, presentationOption.getStdRfpQuoteAncillaryOption(), null),
                    MutableTriple.of(data.ltd, presentationOption.getLtdRfpQuoteAncillaryOption(), null) );

            for (MutableTriple<Product, QuoteOption, Option> productQuoteOption : quoteOptions) {
                Product product = productQuoteOption.getLeft();
                QuoteOption quoteOption = productQuoteOption.getMiddle();
                Option option = null;
                if (quoteOption != null) {
                    isPresentationOptionNotEmpty = true;
                    if (quoteOption instanceof RfpQuoteOption) {
                        if (product == data.medical) {
                            float discounts = 0f;
                            List<String> discountTypes = new ArrayList<>();
                            List<Pair<String, Float>> discountsByType = Arrays.asList(
                                    Pair.of("dental", presentationOption.getDentalDiscountPercent()),
                                    Pair.of("vision", presentationOption.getVisionDiscountPercent()),
                                    Pair.of("life", presentationOption.getLifeDiscountPercent()),
                                    Pair.of("ltd", presentationOption.getLtdDiscountPercent()),
                                    Pair.of("std", presentationOption.getStdDiscountPercent()) );
                            
                            for (Pair<String, Float> discountEntry : discountsByType) {
                                if (discountEntry.getValue() != null) {
                                    discounts += discountEntry.getValue();
                                    discountTypes.add(discountEntry.getKey());
                                }
                            }
                            option = prepareAlternativeOption(product, presentationOption.getName(), (RfpQuoteOption) quoteOption, discounts);
                            if (!discountTypes.isEmpty()) {
                                option.notes = String.format("includes %.1f%% %s bundling discount", discounts, joinNames(discountTypes));
                            }
                            // TODO reuse existedOption
                            processDuplicatedOption(existedMedicalOptions, Pair.of(quoteOption.getOptionId(), discounts), option);
                        } else {
                            option = prepareAlternativeOption(product, presentationOption.getName(), (RfpQuoteOption) quoteOption, null);
                            // TODO reuse existedOption
                            processDuplicatedOption(existedOptions, quoteOption.getOptionId(), option);
                        }
                    } else if (quoteOption instanceof RfpQuoteAncillaryOption) {
                        option = prepareAlternativeAncillaryOption(product, presentationOption.getName(), (RfpQuoteAncillaryOption) quoteOption);
                        // TODO reuse existedOption
                        processDuplicatedOption(existedAncillaryOptions, quoteOption.getOptionId(), option);
                    }
                    
                    productQuoteOption.setRight(option);
                }
                
            }

            // skip empty PresentationOption
            if (isPresentationOptionNotEmpty) {    
                for (MutableTriple<Product, QuoteOption, Option> productQuoteOption : quoteOptions) {
                    Product product = productQuoteOption.getLeft();
                    Option option = productQuoteOption.getRight();
                    if(option != null && isRenewalAlternative(product, option)) {
                        product.renewalAlternatives.list.add(option);
                        product.alternatives.list.add(null);
                    } else {
                        product.alternatives.list.add(option);
                        product.renewalAlternatives.list.add(null);
                    }
                }
            }
        }
    }

    private <T> void processDuplicatedOption(Map<T, Option> existedOptions, T key, Option option) {
        Option existedOption = existedOptions.get(key);
        if (existedOption != null) {
            // already existed
            existedOption.duplicateOptions.add(option);
            option.isDuplicate = true;
        } else {
            existedOptions.put(key, option);
        }
    }

    private boolean isRenewalAlternative(Product product, Option option) {
        TreeSet<String> set = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
        set.addAll(product.currentCarriers);
        return set.removeAll(option.carriers);
    }

    protected Option prepareAlternativeOption(Product product, String optionName,
        RfpQuoteOption quoteOption, Float discounts
    ) {
        Option alternativeOption = new Option();
        alternativeOption.name = optionName;
        //alternativeOption.quoteOptionName = quoteOption.getName();
        Carrier carrier = quoteOption.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
        alternativeOption.carrierDisplayName = carrier.getDisplayName();
        alternativeOption.carriers.add(carrier.getName());
        if (QuoteType.KAISER.equals(quoteOption.getRfpQuote().getQuoteType())) {
            alternativeOption.carrierDisplayName += " / " + CarrierType.KAISER.displayName;
            alternativeOption.carriers.add(Constants.KAISER_CARRIER);
        }

        alternativeOption.carrierAmBestRating = carrier.getAmBestRating();
        for (RfpQuoteOptionNetwork rqon : quoteOption.getRfpQuoteOptionNetworks()) {
            RfpQuoteNetworkPlan rqnp = rqon.getSelectedRfpQuoteNetworkPlan();
            if (rqnp == null) { continue; }

            PrepPlan prepPlan = new PrepPlan();
            prepPlan.name = rqnp.getPnn().getName();
            prepPlan.carrierName = rqnp.getPnn().getPlan().getCarrier().getDisplayName();
            preparePlan(discounts, rqon, prepPlan);
            String bindingPlanType = bindPlan(product, alternativeOption, rqon, prepPlan);

            Plan rxPlan = Constants.MEDICAL.equals(product.category) 
                    ? ofNullable(rqon.getSelectedRfpQuoteNetworkRxPlan())
                        .map(RfpQuoteNetworkPlan::getPnn)
                        .map(PlanNameByNetwork::getPlan)
                        .orElse(null)
                    : null;
            
            prepareBenefits(prepPlan, rqnp.getPnn().getPlan(), rxPlan, bindingPlanType);

            alternativeOption.total += prepPlan.total;
            alternativeOption.employer += prepPlan.employer;
            alternativeOption.enrollment += prepPlan.enrollment;
        }

        alternativeOption.annualEmployer = alternativeOption.employer * MONTHS_IN_YEAR;
        alternativeOption.annualTotal = alternativeOption.total * MONTHS_IN_YEAR;

        return alternativeOption;
    }

    private void prepareBenefits(PrepPlan prepPlan, Plan plan, Plan rxPlan, String planType) {
        // Group benefits by name
        Map<String, Object> benefitsMap = Stream.concat(
                benefitRepository.findByPlanId(plan.getPlanId()).stream(),
                rxPlan == null ? Stream.empty() : benefitRepository.findByPlanId(rxPlan.getPlanId()).stream()) 
            .collect(
                Collectors.toMap(
                    b -> b.getBenefitName().getName(),
                    Functions.identity(),
                    (oldValue, newValue) -> {
                        prepPlan.twoColumnFlag = true;
                        if (!(oldValue instanceof Benefit)) {
                            throw new BaseException(
                                String.format("More than two benefits with the same name: benefitName=%s planId=%s",
                                    ((Benefit)newValue).getBenefitName(),
                                    plan.getPlanId()));
                        }
                        // put InNetwork first
                        if ("IN".equals(((Benefit)oldValue).getInOutNetwork())) {
                            return new Benefit[] {(Benefit)oldValue, (Benefit)newValue};
                        } else {
                            return new Benefit[] {(Benefit)newValue, (Benefit)oldValue};
                        }
                    }
                )
            );

        String[] BENEFITS_TEMPLATE = null;
        switch(planType) {
            case "HMO":
            case "PPO":
            case "HSA":
                BENEFITS_TEMPLATE = MEDICAL_BENEFITS_TEMPLATE;
                break;
            case "DHMO":
                BENEFITS_TEMPLATE = DHMO_BENEFITS_TEMPLATE;
                break;
            case "DPPO":
                BENEFITS_TEMPLATE = DPPO_BENEFITS_TEMPLATE;
                break;
            case "VISION":
                BENEFITS_TEMPLATE = VISION_BENEFITS_TEMPLATE;
                break;
        }
        if (BENEFITS_TEMPLATE != null) {
            prepPlan.benefits = new Object[BENEFITS_TEMPLATE.length];
            for(int i=0; i<BENEFITS_TEMPLATE.length; i++) {
                prepPlan.benefits[i] = benefitsMap.get(BENEFITS_TEMPLATE[i]);
            }
        }
    }

    private void preparePlan(Float discounts, RfpQuoteOptionNetwork optNetwork, PrepPlan plan) {

        RfpQuoteNetworkPlan networkPlan = optNetwork.getSelectedRfpQuoteNetworkPlan();
        if(networkPlan == null) {
            return;
        }
        float[] rxRates = PlanCalcHelper.getRXRates(optNetwork.getSelectedRfpQuoteNetworkRxPlan());
        float[] dollarRxRates = PlanCalcHelper.getDollarRXRates(optNetwork.getSelectedRfpQuoteNetworkRxPlan());
        float[] riders = PlanCalcHelper.getRiderCosts(optNetwork);
        float[] specialRiders = getSpecialRiderCosts(optNetwork);

        float discountFactor = discounts == null || PlanCalcHelper.isSelectedPlanFromKaiser(optNetwork)
                               ? 1F
                               : getDiscountFactor(discounts);

        plan.enrollment1 = longValue(optNetwork.getTier1Census());
        plan.enrollment2 = longValue(optNetwork.getTier2Census());
        plan.enrollment3 = longValue(optNetwork.getTier3Census());
        plan.enrollment4 = longValue(optNetwork.getTier4Census());
        plan.enrollment = plan.enrollment1 + plan.enrollment2 + plan.enrollment3 + plan.enrollment4;

        plan.rate1 = ((floatValue(networkPlan.getTier1Rate()) * rxRates[0] + dollarRxRates[0] + specialRiders[0]) * discountFactor + riders[0]);
        plan.rate2 = ((floatValue(networkPlan.getTier2Rate()) * rxRates[1] + dollarRxRates[1] + specialRiders[1]) * discountFactor + riders[1]);
        plan.rate3 = ((floatValue(networkPlan.getTier3Rate()) * rxRates[2] + dollarRxRates[2] + specialRiders[2]) * discountFactor + riders[2]);
        plan.rate4 = ((floatValue(networkPlan.getTier4Rate()) * rxRates[3] + dollarRxRates[3] + specialRiders[3]) * discountFactor + riders[3]);

        plan.total1 = plan.enrollment1 * plan.rate1;
        plan.total2 = plan.enrollment2 * plan.rate2;
        plan.total3 = plan.enrollment3 * plan.rate3;
        plan.total4 = plan.enrollment4 * plan.rate4;

        plan.total = round(plan.total1 + plan.total2 + plan.total3 + plan.total4, 2);

        if(optNetwork.getErContributionFormat().equals(Constants.ER_CONTRIBUTION_FORMAT_PERCENT)) {
            plan.employer1 = optNetwork.getTier1ErContribution() * plan.total1 / 100f;
            plan.employer2 = optNetwork.getTier2ErContribution() * plan.total2 / 100f;
            plan.employer3 = optNetwork.getTier3ErContribution() * plan.total3 / 100f;
            plan.employer4 = optNetwork.getTier4ErContribution() * plan.total4 / 100f;
        } else {
            plan.employer1 = optNetwork.getTier1ErContribution() * plan.enrollment1;
            plan.employer2 = optNetwork.getTier2ErContribution() * plan.enrollment2;
            plan.employer3 = optNetwork.getTier3ErContribution() * plan.enrollment3;
            plan.employer4 = optNetwork.getTier4ErContribution() * plan.enrollment4;
        }
        plan.employer =  round(plan.employer1 + plan.employer2 + plan.employer3 + plan.employer4, 2);

        String planType = networkPlan.getPnn().getNetwork().getType();

        plan.total += calcEmployerFund(optNetwork, planType);
        plan.total += administrativeFeeService.calcAdministrativeFee(optNetwork, planType);

    }

    /**
     * Put plan to array with index corresponding to the plans of other options
     *
     * @param product
     * @param alternative
     * @param rqon
     * @param prepPlan
     *
     * @return binding plan type
     */
    private String bindPlan(Product product, Option alternative, RfpQuoteOptionNetwork rqon,
        PrepPlan prepPlan) {
        ClientPlan clientPlan = rqon.getClientPlan();
        String bindingName = null;
        Network network = rqon.getRfpQuoteNetwork().getNetwork();
        if (clientPlan != null) {
            bindingName = "CLIENT_PLAN-" + clientPlan.getClientPlanId();
        } else {
            // binding by network name and type
            bindingName = network.getName() + "-" + network.getType();
        }

        // bind plan
        for (int i=0; i < product.binding.size(); i++) {
            if (i == alternative.plans.size()) {
                // increase
                alternative.plans.add(null);
            }
            if (product.binding.get(i) != null && bindingName.equals(product.binding.get(i).getLeft())) {
                // found
                if (alternative.plans.get(i) == null) {
                    alternative.plans.set(i, prepPlan);
                    return product.binding.get(i).getRight();
                } // else row is not empty - find next
            }
        }

        // not found - here binding and alternative.plans have the same size
        product.binding.add(Pair.of(bindingName, network.getType()));
        alternative.plans.add(prepPlan);
        return network.getType();
    }

    private void prepareAncillaryCurrent(Product product, Long clientId) {

        String category = product.category;
        // prepare current
        PlanCategory planCategory = PlanCategory.valueOf(category);
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(
            clientId,
            planCategory.getPlanTypes());


        product.currentCarriers = SharedRfpQuoteService.getCarrierNames(clientPlans);

        RfpQuote currentQuote = sharedRfpQuoteService.prepareCurrentQuote(clientPlans);
        Carrier carrier = currentQuote.getRfpSubmission().getRfpCarrier().getCarrier();
        product.current.carrierDisplayName = carrier.getDisplayName();
        product.current.carrierAmBestRating = carrier.getAmBestRating();
        product.isCarrierNameAppCarrier = CarrierType.isCarrierNameAppCarrier(carrier.getName(), appCarrier);
        product.current.plans = new ArrayList<>(clientPlans.size());
        for (ClientPlan clientPlan : clientPlans) {
            PrepPlan plan = new PrepPlan();

            plan.ancillary = clientPlan.getAncillaryPlan();
            plan.name = plan.ancillary.getPlanName();
            plan.carrierName = plan.ancillary.getCarrier().getDisplayName();
            plan.total = PlanCalcHelper.calcAncillaryPlanTotal(clientPlan.getAncillaryPlan(), planCategory);

            product.current.plans.add(plan);

            // sum
            product.current.total += plan.total;
            product.current.employer += plan.total;
        }

        product.current.annualTotal = product.current.total * MONTHS_IN_YEAR;
        product.current.annualEmployer = product.current.employer * MONTHS_IN_YEAR;
        
    }

    private void prepareAncillaryRenewal(Product product, Long clientId) {

        String category = product.category;
        Option option = product.renewal;
        option.name = "Renewal";
        PlanCategory planCategory = PlanCategory.valueOf(category);

        rfpQuoteRepository.findByClientIdAndCategoryAndQuoteType(clientId, category, QuoteType.STANDARD)
            .stream()
            .flatMap(q -> rfpQuoteAncillaryOptionRepository.findByRfpQuote(q).stream())
            .filter(o ->
                StringUtils.containsIgnoreCase(o.getName(), "Renewal 1") ||
                StringUtils.equalsIgnoreCase(o.getName(), "Renewal")
            )
            .forEach(renewal -> {
                prepareAncillaryRenewalOption(renewal, planCategory, product);
            });
    }

    protected void prepareAncillaryRenewalOption(
        RfpQuoteAncillaryOption renewal, PlanCategory planCategory, Product product
    ) {
        RfpQuoteAncillaryPlan quotePlan = renewal.getRfpQuoteAncillaryPlan();
        AncillaryPlan plan = quotePlan.getAncillaryPlan();
        PrepPlan prepPlan = new PrepPlan();

        prepPlan.ancillary = plan;
        prepPlan.name = prepPlan.ancillary.getPlanName();
        prepPlan.carrierName = prepPlan.ancillary.getCarrier().getDisplayName();
        prepPlan.total = PlanCalcHelper.calcAncillaryPlanTotal(plan, planCategory);

        product.renewal.plans.add(prepPlan);
        product.renewal.total += prepPlan.total;
        product.renewal.employer += prepPlan.total;
        product.renewal.annualTotal = product.renewal.total * MONTHS_IN_YEAR;
        product.renewal.annualEmployer = product.renewal.employer * MONTHS_IN_YEAR;
    }

    protected Option prepareAlternativeAncillaryOption(Product product, String optionName,
        RfpQuoteAncillaryOption ancillaryQuoteOption)
    {
        Option alternativeOption = new Option();
        alternativeOption.name = optionName;
        //alternativeOption.quoteOptionName = ancillaryQuoteOption.getName();

        Carrier carrier = ancillaryQuoteOption.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
        alternativeOption.carrierDisplayName = carrier.getDisplayName();
        alternativeOption.carriers.add(carrier.getName());
        if (QuoteType.KAISER.equals(ancillaryQuoteOption.getRfpQuote().getQuoteType())) {
            alternativeOption.carrierDisplayName += " / " + CarrierType.KAISER.displayName;
            alternativeOption.carriers.add(Constants.KAISER_CARRIER);
        }
        alternativeOption.carrierAmBestRating = carrier.getAmBestRating();

        RfpQuoteAncillaryPlan quotePlan = ancillaryQuoteOption.getRfpQuoteAncillaryPlan();
        if (quotePlan != null) {
            PrepPlan prepPlan = new PrepPlan();

            AncillaryPlan plan = quotePlan.getAncillaryPlan();
            prepPlan.ancillary = plan;
            prepPlan.name = prepPlan.ancillary.getPlanName();
            prepPlan.carrierName = prepPlan.ancillary.getCarrier().getDisplayName();

            String category = product.category;
            PlanCategory planCategory = PlanCategory.valueOf(category);
            prepPlan.total = PlanCalcHelper.calcAncillaryPlanTotal(plan, planCategory);

            alternativeOption.plans.add(prepPlan);
            alternativeOption.total += prepPlan.total;
            alternativeOption.employer += prepPlan.total;
        }

        alternativeOption.annualTotal = alternativeOption.total * MONTHS_IN_YEAR;
        alternativeOption.annualEmployer *= alternativeOption.employer * MONTHS_IN_YEAR;

        return alternativeOption;
    }

    private String joinNames(List<String> names) {

        if (names.size() == 0) {
            return "";
        }
        if (names.size() == 1) {
            return names.get(0);
        }

        StringBuilder sb = new StringBuilder(names.get(0));
        for (int i=1; i<names.size() - 1; i++) {
            sb.append(", ");
            sb.append(names.get(i));
        }
        sb.append(" and ");
        sb.append(names.get(names.size() - 1));
        return sb.toString();
    }

    private static Float floatValue(Float value) {
        return value == null ? 0F : value.floatValue();
    }

    private static Long longValue(Long value) {
        return value == null ? 0L : value;
    }
}
