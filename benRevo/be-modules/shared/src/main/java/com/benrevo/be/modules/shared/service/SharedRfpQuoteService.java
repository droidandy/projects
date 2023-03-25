package com.benrevo.be.modules.shared.service;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.*;
import com.benrevo.common.dto.QuoteOptionBriefDto.PlanBriefDto;
import com.benrevo.common.enums.*;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.util.DateHelper;
import com.benrevo.common.util.MathUtils;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.BasicRate;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.repository.*;
import com.google.common.collect.Iterables;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.*;
import io.vavr.control.Try;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.shared.util.PlanCalcHelper.*;
import static com.benrevo.common.Constants.*;
import static com.benrevo.common.enums.CarrierType.isCarrierNameAppCarrier;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.MathUtils.getDiscountFactor;
import static com.benrevo.common.util.MathUtils.round;
import static java.lang.Integer.parseUnsignedInt;
import static java.lang.Long.compare;
import static java.util.Objects.isNull;
import static java.util.Optional.ofNullable;
import static org.apache.commons.lang3.ObjectUtils.defaultIfNull;
import static org.apache.commons.lang3.StringUtils.capitalize;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.lowerCase;

@Service
@Transactional
public class SharedRfpQuoteService {

    public static final String NETWORK_TYPE_PPO = "PPO";

    public static final String NETWORK_TYPE_HSA = "HSA";

    public static final String NETWORK_TYPE_HMO = "HMO";

    public static final int MONTHS_IN_YEAR = 12;

    public static float DENTAL_BUNDLE_DISCOUNT_PERCENT;
    public static float VISION_BUNDLE_DISCOUNT_PERCENT;
    public static Map<String, Float> CV_PRODUCT_DISCOUNT_PERCENT = new HashMap<>();

    private static final String OPTION_1 = "Option 1";
    private static final String RENEWAL_1 = "Renewal 1";
    private static final String CLEAR_VALUE = "Clear Value";

    protected static final int DEFAULT_RATING_TIERS = 4;

    @Autowired
    private RfpQuoteVersionRepository rfpQuoteVersionRepository;

    @Autowired
    CarrierRepository carrierRepository;

    @Autowired
    protected RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    protected RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    protected AdministrativeFeeService administrativeFeeService;

    @Autowired
    protected RfpRepository rfpRepository;

    @Autowired
    protected ClientExtProductRepository clientExtProductRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private SharedClientService sharedClientService;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private SharedActivityService sharedActivityService;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private AttributeRepository attributeRepository;

    @Autowired
    private OptionRepository optionRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private CustomLogger logger;

    @Value("${app.carrier}")
    String[] appCarrier;

    @PostConstruct
    public void initDiscounts() {
        switch (CarrierType.fromStrings(appCarrier)) {
            case ANTHEM_BLUE_CROSS: case ANTHEM_CLEAR_VALUE:
                DENTAL_BUNDLE_DISCOUNT_PERCENT = 1.0F;
                VISION_BUNDLE_DISCOUNT_PERCENT = 1.0F;
                break;
            case UHC:
                DENTAL_BUNDLE_DISCOUNT_PERCENT = 1.0F;
                VISION_BUNDLE_DISCOUNT_PERCENT = 0.5F;
                CV_PRODUCT_DISCOUNT_PERCENT.put("SUPP_LIFE", 0.5F);
                CV_PRODUCT_DISCOUNT_PERCENT.put("STD_LTD", 0.5F);
                CV_PRODUCT_DISCOUNT_PERCENT.put("HEALTH", 0.5F);
                break;
            default:
                DENTAL_BUNDLE_DISCOUNT_PERCENT = 1.0F;
                VISION_BUNDLE_DISCOUNT_PERCENT = 0.5F;
                break;
        }
        CV_PRODUCT_DISCOUNT_PERCENT.put(DENTAL, DENTAL_BUNDLE_DISCOUNT_PERCENT);
        CV_PRODUCT_DISCOUNT_PERCENT.put(VISION, VISION_BUNDLE_DISCOUNT_PERCENT);
        CV_PRODUCT_DISCOUNT_PERCENT.put(LIFE, 1.0F);
        CV_PRODUCT_DISCOUNT_PERCENT.put(STD, 0.5F);
        CV_PRODUCT_DISCOUNT_PERCENT.put(LTD, 0.5F);
    }

    public static class BundleDiscounts {
        // medical plans total without: Kaiser, Fees, EmpFund, Riders
        public Double medicalDiscountBaseTotal = 0.0;
        public Double dentalBundleDiscount;
        public Float dentalBundleDiscountPercent;
        public Boolean dentalBundleDiscountApplied;
        public Double visionBundleDiscount;
        public Float visionBundleDiscountPercent;
        public Boolean visionBundleDiscountApplied;
        public Double extProductsBundleDiscount;
        public Float extProductsBundleDiscountPercent;
        public Double summaryBundleDiscount = 0.0;
        // FIXME replace with double
        public Float summaryBundleDiscountPercent = 0f;
    }

    // Common used APIs (in presentation and onboarding modules)

    public QuoteOptionFinalSelectionDto getSelectedQuoteOptions(Long clientId) {
        QuoteOptionFinalSelectionDto result = new QuoteOptionFinalSelectionDto();
        List<RfpQuoteOption> selected = rfpQuoteOptionRepository.findSelectedByClientId(clientId);
        double totalAnnual = 0.0;
        Map<Long, QuoteOptionPlanBriefDto> selectedPlansByPlanId = new HashMap<>();
        RfpQuoteOption medicalOption = null, selectedDentalOption = null, selectedVisionOption = null;
        boolean isAlongsideKaiser = false;
        double medicalWithoutKaiserTotal = 0.0;

		for (RfpQuoteOption opt : selected) {
			switch (opt.getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory()) {
			case Constants.MEDICAL:
				medicalOption = opt;
				break;
			case Constants.DENTAL:
				selectedDentalOption = opt;
				break;
			case Constants.VISION:
				selectedVisionOption = opt;
				break;
			}
		}
        /* for clients that has Medical Renewal & Dental Renewal, and the client elects 
         * not to renew Dental > The medical rates will need to reverse the 1% discount applied */
        if (medicalOption != null && getOptionType(medicalOption.getName()) == OptionType.RENEWAL) {
        	float penaltyDiscountPercent = 0f;
        	RfpQuoteOption dentalRenewal = rfpQuoteOptionRepository.findByClientIdAndCategory(clientId, 
        			PlanCategory.DENTAL.name()).stream()
        		.filter(o -> getOptionType(o.getName()) == OptionType.RENEWAL)
        		.findFirst().orElse(null);
        	// Renewal Dental option exist, but not selected
        	if (dentalRenewal != null && (selectedDentalOption == null)/* || 
        			!selectedDentalOption.getOptionId().equals(dentalRenewal.getOptionId()))*/) {
        		result.setDentalRenewalDiscountPenalty(DENTAL_BUNDLE_DISCOUNT_PERCENT);
        		penaltyDiscountPercent += DENTAL_BUNDLE_DISCOUNT_PERCENT;
        	}
        	RfpQuoteOption visionRenewal = rfpQuoteOptionRepository.findByClientIdAndCategory(clientId, 
        			PlanCategory.VISION.name()).stream()
        		.filter(o -> getOptionType(o.getName()) == OptionType.RENEWAL)
        		.findFirst().orElse(null);
        	// Renewal Vision option exist, but not selected
        	if (visionRenewal != null && (selectedVisionOption == null)/* || 
        			!selectedVisionOption.getOptionId().equals(visionRenewal.getOptionId()))*/) {
        		result.setVisionRenewalDiscountPenalty(VISION_BUNDLE_DISCOUNT_PERCENT);
        		penaltyDiscountPercent += VISION_BUNDLE_DISCOUNT_PERCENT;
        	}
        	if (penaltyDiscountPercent > 0f) {
        		// 1.5% -> 0.985, 1% -> 0.99, 0.5% -> 0.995
        		penaltyDiscountPercent = getDiscountFactor(penaltyDiscountPercent);
        		for (RfpQuoteOptionNetwork optNetwork : medicalOption.getRfpQuoteOptionNetworks()) {
        			List<RfpQuoteNetworkPlan> plansForPenaltyApply = new ArrayList<>();
        			RfpQuoteNetworkPlan selectedPlan = optNetwork.getSelectedRfpQuoteNetworkPlan();
                    if (selectedPlan != null) {
                    	plansForPenaltyApply.add(selectedPlan);
                    }
                    // penaltyDiscount should worrk correct for Dollar RX as well
                    RfpQuoteNetworkPlan rxPlan = optNetwork.getSelectedRfpQuoteNetworkRxPlan();
                    if (rxPlan != null) {
                    	plansForPenaltyApply.add(rxPlan);
                    }
              
					for (RfpQuoteNetworkPlan plan : plansForPenaltyApply) {
						/* 
						 * NOTE: we need to update rates for method scope and DO NOT store this change in DB.
						 * If entity is not detached Hibernate will apply auto flush/commit feature
						 */
						entityManager.detach(plan);

						Float tier1Rate = defaultIfNull(plan.getTier1Rate(), 0f);
						if (tier1Rate > 0f) {
							plan.setTier1Rate(tier1Rate / penaltyDiscountPercent);
						}
						Float tier2Rate = defaultIfNull(plan.getTier2Rate(), 0f);
						if (tier2Rate > 0f) {
							plan.setTier2Rate(tier2Rate / penaltyDiscountPercent);
						}
						Float tier3Rate = defaultIfNull(plan.getTier3Rate(), 0f);
						if (tier3Rate > 0f) {
							plan.setTier3Rate(tier3Rate / penaltyDiscountPercent);
						}
						Float tier4Rate = defaultIfNull(plan.getTier4Rate(), 0f);
						if (tier4Rate > 0f) {
							plan.setTier4Rate(tier4Rate / penaltyDiscountPercent);
						}
					}
				}
        	}
        }
        
        BundleDiscounts discounts = calcBundleDiscount(clientId, selected);
        
        for (RfpQuoteOption opt : selected) {
            List<QuoteOptionPlanBriefDto> plans = new ArrayList<>();
            double total = 0.0;
            double withoutKaiserTotal = 0.0;
            if (!isAlongsideKaiser) {
                isAlongsideKaiser = isAlongsideKaiser(opt);
            }
            for(RfpQuoteOptionNetwork optNetwork : opt.getRfpQuoteOptionNetworks()) {
                if(optNetwork.getSelectedRfpQuoteNetworkPlan() != null) {
                    // NOTE: call buildNewQuoteOptionPlanBrief() with pre-calculated discounts
                    QuoteOptionPlanBriefDto planParams = buildNewQuoteOptionPlanBrief(
                            optNetwork, optNetwork.getSelectedRfpQuoteNetworkPlan(), discounts);
                    // grouping final selection rows by plan
                    QuoteOptionPlanBriefDto existPlan = selectedPlansByPlanId.get(planParams.getPlanId());
                    if(existPlan == null) {
                         plans.add(planParams);
                         selectedPlansByPlanId.put(planParams.getPlanId(), planParams);
                    } else {
                        existPlan.setEmployee(existPlan.getEmployee() + planParams.getEmployee());
                        existPlan.setEmployer(existPlan.getEmployer() + planParams.getEmployer());
                        existPlan.setTotal(existPlan.getTotal() + planParams.getTotal());
                    }
                    Float planCost = planParams.getTotal();
                    planCost += calcEmployerFund(optNetwork, planParams.getType());
                    planCost += administrativeFeeService.calcAdministrativeFee(optNetwork, planParams.getType());

                    // round() workaround for float-to-double cast: 88883.73f -> 88883.7265625d
                    total += round(planCost.doubleValue(), 2);

                    if(!isSelectedPlanFromKaiser(optNetwork)) {
                        withoutKaiserTotal += round(planCost.doubleValue(), 2);
                    }
                }
            }
            // current product annual premium total
            total = round(total * MONTHS_IN_YEAR, 2);

            // all products annual premium total
            totalAnnual += total;

            switch(opt.getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory()) {
                case Constants.MEDICAL:
                    medicalOption = opt;
                    result.setMedicalPlans(plans);
                    result.setMedicalTotal(total);
                    result.setMedicalQuoteOptionId(opt.getRfpQuoteOptionId());
                    result.setMedicalQuoteOptionName(opt.getRfpQuoteOptionName());
                    medicalWithoutKaiserTotal = round(withoutKaiserTotal * MONTHS_IN_YEAR, 2);
                    break;
                case Constants.DENTAL:
                    result.setDentalPlans(plans);
                    result.setDentalTotal(total);
                    result.setDentalQuoteOptionId(opt.getRfpQuoteOptionId());
                    result.setDentalQuoteOptionName(opt.getRfpQuoteOptionName());
                    break;
                case Constants.VISION:
                    result.setVisionPlans(plans);
                    result.setVisionTotal(total);
                    result.setVisionQuoteOptionId(opt.getRfpQuoteOptionId());
                    result.setVisionQuoteOptionName(opt.getRfpQuoteOptionName());
                    break;
                default:
                    throw new BaseException("Unsupported RfpCarrier.category value")
                        .withFields(field("valid_categories", Arrays.asList(Constants.MEDICAL, Constants.DENTAL, Constants.VISION)));
            }
        }

        // set submitted date if exists
        Client client = getClientById(clientId);
        if (client.getDateQuoteOptionSubmitted() != null) {
            result.setSubmittedDate(DateHelper.fromDateToString(client.getDateQuoteOptionSubmitted(), Constants.DATETIME_FORMAT));
        }

        // add selected ex-products
        if (discounts.medicalDiscountBaseTotal > 0 && isValidAppCarrierOption(medicalOption)) {
            List<ExtProductDto> products = sharedClientService.getExtProducts(clientId);
                clientExtProductRepository.findByClientId(clientId);
            if (products != null) {
                for(ExtProductDto product : products){
                    /* discounts already calculated in discounts.extProductsBundleDiscount,
                     * but we need to calc discount for each extProduct dto */
                    Float discountPercent = CV_PRODUCT_DISCOUNT_PERCENT.get(product.getName());
                    if (discountPercent == null) {
                    	throw new BaseException("Discount percent is not defined for external product: " + product.getName());
                    }
                    product.setDiscountPercent(discountPercent);
                    Double discount = round(discounts.medicalDiscountBaseTotal * discountPercent / 100.0, 2);
                    product.setDiscount(discount);
                }
                result.setExternalProducts(products);
            }
        }
        result.setDentalBundleDiscount(discounts.dentalBundleDiscount);
        result.setDentalBundleDiscountPercent(discounts.dentalBundleDiscountPercent);
        result.setDentalBundleDiscountApplied(discounts.dentalBundleDiscountApplied);
        result.setVisionBundleDiscount(discounts.visionBundleDiscount);
        result.setVisionBundleDiscountPercent(discounts.visionBundleDiscountPercent);
        result.setVisionBundleDiscountApplied(discounts.visionBundleDiscountApplied);
        if (isAlongsideKaiser) {
            /* 1) discounts.medicalWithoutKaiserTotal was renamed to discounts.medicalDiscountBaseTotal
             * 2) medicalWithoutKaiserTotal calculation changed:
             * Before: result.medicalWithoutKaiserTotal = medical plans total w/o Kaiser, W/O discount applied + Fees, EmpFund, Riders
             *  After: result.medicalWithoutKaiserTotal = medical plans total w/o Kaiser, WITH discount applied + Fees, EmpFund, Riders
             */
            result.setMedicalWithoutKaiserTotal(medicalWithoutKaiserTotal);
        }
        if (result.getVisionBundleDiscountPercent() != null
                || result.getDentalBundleDiscountPercent() != null
                || discounts.extProductsBundleDiscountPercent != null) {
            // eligible for the discount
            result.setSummaryBundleDiscount(discounts.summaryBundleDiscount);
        }
        result.setTotal(totalAnnual);

        return result;
    }
    
    public QuoteOptionPlanBriefDto buildNewQuoteOptionPlanBrief(RfpQuoteOptionNetwork optNetwork, RfpQuoteNetworkPlan networkPlan,
        RfpQuoteNetworkPlan networkRxPlan, BundleDiscounts discounts) {

        Float employer = calcEmployerCost(optNetwork, networkPlan, networkRxPlan, discounts.summaryBundleDiscountPercent);
        Float total = calcAlterPlanTotal(optNetwork, networkPlan, networkRxPlan, discounts.summaryBundleDiscountPercent);
        Float tier1Rate = networkPlan.getTier1Rate();
        Float tier2Rate = networkPlan.getTier2Rate();
        Float tier3Rate = networkPlan.getTier3Rate();
        Float tier4Rate = networkPlan.getTier4Rate();

        if (isDiscountApplicable(optNetwork, networkPlan)) {
            tier1Rate = defaultIfNull(tier1Rate, 0F) * getDiscountFactor(discounts.summaryBundleDiscountPercent);
            tier2Rate = defaultIfNull(tier2Rate, 0F) * getDiscountFactor(discounts.summaryBundleDiscountPercent);
            tier3Rate = defaultIfNull(tier3Rate, 0F) * getDiscountFactor(discounts.summaryBundleDiscountPercent);
            tier4Rate = defaultIfNull(tier4Rate, 0F) * getDiscountFactor(discounts.summaryBundleDiscountPercent);
        }
        QuoteOptionPlanBriefDto newPlan = new QuoteOptionPlanBriefDto();
        newPlan.setPlanId(networkPlan.getRfpQuoteNetworkPlanId());
        newPlan.setType(networkPlan.getPnn().getNetwork().getType());
        newPlan.setName(networkPlan.getPnn().getName());
        newPlan.setEmployer(employer);
        newPlan.setEmployee(total - employer);
        newPlan.setTotal(total);
        newPlan.setQuoteType(networkPlan.getRfpQuoteNetwork().getRfpQuote().getQuoteType());
        RfpCarrier rfpCarrier = networkPlan.getRfpQuoteNetwork().getRfpQuote().getRfpSubmission().getRfpCarrier();
        newPlan.setCarrier(rfpCarrier.getCarrier().getDisplayName());
        newPlan.setCarrierId(rfpCarrier.getCarrier().getCarrierId());
        newPlan.setRfpCarrierId(rfpCarrier.getRfpCarrierId());
        newPlan.setTier1Rate(tier1Rate);
        newPlan.setTier2Rate(tier2Rate);
        newPlan.setTier3Rate(tier3Rate);
        newPlan.setTier4Rate(tier4Rate);

        return newPlan;
    }

    public QuoteOptionPlanBriefDto buildNewQuoteOptionPlanBrief(RfpQuoteOptionNetwork optNetwork, RfpQuoteNetworkPlan networkPlan, BundleDiscounts discounts) {
        return buildNewQuoteOptionPlanBrief(optNetwork, networkPlan, !isNull(optNetwork) ? optNetwork.getSelectedRfpQuoteNetworkRxPlan() : null, discounts);
    }

    public List<QuoteOptionContributionsDto> getQuoteOptionNetworkContributions(Long rfpQuoteOptionId) {
        RfpQuoteOption quoteOption = rfpQuoteOptionRepository.findOne(rfpQuoteOptionId);
        List<QuoteOptionContributionsDto> result = new ArrayList<>();

        // calculate bundle discount
        BundleDiscounts discounts = calcBundleDiscount(quoteOption);

        boolean isOptionAlongsideKaiser = isAlongsideKaiser(quoteOption);

        for(RfpQuoteOptionNetwork optNetwork : quoteOption.getRfpQuoteOptionNetworks()) {
            List<QuoteOptionPlanContributionDto> contributions = new ArrayList<>();
            ClientPlan clientPlan = optNetwork.getClientPlan();
            RfpQuoteNetworkPlan selectedPlan = optNetwork.getSelectedRfpQuoteNetworkPlan();
            float[] proposedEERates = selectedPlan != null ? calcEmployeeRates(optNetwork, selectedPlan, discounts.summaryBundleDiscountPercent) : null;
            float[] currentEERates = clientPlan != null ? calcEmployeeRates(clientPlan) : null;

            RfpQuote rfpQuote = optNetwork.getRfpQuoteOption().getRfpQuote();

            QuoteOptionPlanContributionDto contr = new QuoteOptionPlanContributionDto();
            contr.setPlanName(TIER1_PLAN_NAME);

            contr.setProposedEnrollment(optNetwork.getTier1Census());
            contr.setProposedER(optNetwork.getTier1ErContribution());
            contr.setFundEE(optNetwork.getTier1EeFund());

            QuoteOptionContributionsDto contributionItem = new QuoteOptionContributionsDto();
            // isKaiserNetwork should be "false" for Full takeover case
            contributionItem.setKaiserNetwork(isKaiserNetwork(optNetwork) && isOptionAlongsideKaiser);

            if(selectedPlan != null) {
                contr.setProposedEE(proposedEERates[0]);

                if(clientPlan != null) {
                    contr.setDiffEE(round(proposedEERates[0] - currentEERates[0], 2));
                }
            }

            if(clientPlan != null) {
                contr.setCurrentEnrollment(clientPlan.getTier1Census());
                contr.setCurrentER(
                    (Constants.ER_CONTRIBUTION_FORMAT_DOLLAR.equals(clientPlan.getErContributionFormat()))?
                    clientPlan.getTier1ErContribution():
                    round(clientPlan.getTier1Rate() * clientPlan.getTier1ErContribution() / 100f,2)
                );

            }
            if (rfpQuote.getRatingTiers() >= 1) {
                contributions.add(contr);
            }

            contr = new QuoteOptionPlanContributionDto();
            if (rfpQuote.getRatingTiers() == 2) {
                 contr.setPlanName(TIER4_PLAN_NAME);
            } else if (rfpQuote.getRatingTiers() == 3) {
                contr.setPlanName(TIER2_PLAN_NAME_SPECIAL);
            } else {
                contr.setPlanName(TIER2_PLAN_NAME);
            }
            contr.setProposedEnrollment(optNetwork.getTier2Census());
            contr.setProposedER(optNetwork.getTier2ErContribution());
            contr.setFundEE(optNetwork.getTier2EeFund());

            if(selectedPlan != null) {
                contr.setProposedEE(proposedEERates[1]);
                if(clientPlan != null) {
                    contr.setDiffEE(round(proposedEERates[1] - currentEERates[1], 2));
                }
            }

            if(clientPlan != null) {
                contr.setCurrentEnrollment(clientPlan.getTier2Census());
                contr.setCurrentER(
                        (Constants.ER_CONTRIBUTION_FORMAT_DOLLAR.equals(clientPlan.getErContributionFormat()))?
                        clientPlan.getTier2ErContribution():
                        round(clientPlan.getTier2Rate() * clientPlan.getTier2ErContribution() / 100f,2)
                    );

            }
            if (rfpQuote.getRatingTiers() >= 2) {
                contributions.add(contr);
            }

            contr = new QuoteOptionPlanContributionDto();
            contr.setPlanName(rfpQuote.getRatingTiers() == 3 ? TIER3_PLAN_NAME_SPECIAL : TIER3_PLAN_NAME);
            contr.setProposedEnrollment(optNetwork.getTier3Census());
            contr.setProposedER(optNetwork.getTier3ErContribution());
            contr.setFundEE(optNetwork.getTier3EeFund());

            if(selectedPlan != null) {
                contr.setProposedEE(proposedEERates[2]);

                if(clientPlan != null) {
                    contr.setDiffEE(round(proposedEERates[2] - currentEERates[2], 2));
                }
            }

            if(clientPlan != null) {
                contr.setCurrentEnrollment(clientPlan.getTier3Census());
                contr.setCurrentER(
                        (Constants.ER_CONTRIBUTION_FORMAT_DOLLAR.equals(clientPlan.getErContributionFormat()))?
                        clientPlan.getTier3ErContribution():
                        round(clientPlan.getTier3Rate() * clientPlan.getTier3ErContribution() / 100f,2)
                );
            }
            if (rfpQuote.getRatingTiers() >= 3) {
                contributions.add(contr);
            }

            contr = new QuoteOptionPlanContributionDto();
            contr.setPlanName(TIER4_PLAN_NAME);
            contr.setProposedEnrollment(optNetwork.getTier4Census());
            contr.setProposedER(optNetwork.getTier4ErContribution());
            contr.setFundEE(optNetwork.getTier4EeFund());

            if(selectedPlan != null) {
                contr.setProposedEE(proposedEERates[3]);
                if(clientPlan != null) {
                    contr.setDiffEE(round(proposedEERates[3] - currentEERates[3], 2));
                }
            }

            if(clientPlan != null) {
                contr.setCurrentEnrollment(clientPlan.getTier4Census());
                contr.setCurrentER(
                        (Constants.ER_CONTRIBUTION_FORMAT_DOLLAR.equals(clientPlan.getErContributionFormat()))?
                        clientPlan.getTier4ErContribution():
                        round(clientPlan.getTier4Rate() * clientPlan.getTier4ErContribution() / 100f,2)
                );
            }
            if (rfpQuote.getRatingTiers() >= 4) {
                contributions.add(contr);
            }

            contributionItem.setPlanType(optNetwork.getRfpQuoteNetwork().getNetwork().getType());
            String carrier = optNetwork.getRfpQuoteNetwork().getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier().getDisplayName();

            if(contributionItem.isKaiserNetwork()) {
                contributionItem.setCarrier(extractClientPlanCarrierDisplayName(clientPlan));
            } else {
                contributionItem.setCarrier(carrier);
            }

            Float proposedERTotalCost = null;
            if(selectedPlan != null) {
                Float proposedTotalPlanCost = calcAlterPlanTotal(optNetwork, selectedPlan, discounts.summaryBundleDiscountPercent);
                proposedERTotalCost = calcEmployerCost(optNetwork, selectedPlan, discounts.summaryBundleDiscountPercent);
                // Monthly Total ER Cost row
                contributionItem.setProposedERTotalCost(proposedERTotalCost);
                // Monthly Total row
                contributionItem.setProposedERTotal(proposedTotalPlanCost);

                contributionItem.setPlanNameByNetwork(selectedPlan.getPnn().getName());

            }

            Float currentERTotalCost = null;
            if(clientPlan != null) {
                Float currentTotalPlanCost = calcClientPlanTotal(clientPlan);
                currentERTotalCost = calcEmployerCost(clientPlan);
                // Monthy Total ER Cost row
                contributionItem.setCurrentERTotalCost(currentERTotalCost);
                // Monthy Total row
                contributionItem.setCurrentERTotal(currentTotalPlanCost);

                contributionItem.setCurrentContrFormat(clientPlan.getErContributionFormat());
                contributionItem.setCurrentPlan(clientPlan.getPnn().getPlanType() + " - " + clientPlan.getPnn().getName());
                contributionItem.setCurrentEnrollmentTotal(clientPlan.getTier1Census() + clientPlan.getTier2Census() +
                        clientPlan.getTier3Census() + clientPlan.getTier4Census());
                if(selectedPlan == null) {
                    // show current network if no proposed plan selected
                    contributionItem.setPlanNameByNetwork(clientPlan.getPnn().getName());
                }
            }

            if(clientPlan != null && selectedPlan != null) {
                // % Change Cost row
                Float changeProposedERCost = MathUtils.diffPecent(proposedERTotalCost, currentERTotalCost, 2);
                contributionItem.setChangeProposedERCost(changeProposedERCost);
                Float currentEETotalCost = currentEERates[0] * clientPlan.getTier1Census() +
                    currentEERates[1] * clientPlan.getTier2Census() +
                    currentEERates[2] * clientPlan.getTier3Census() +
                    currentEERates[3] * clientPlan.getTier4Census();
                Float proposedEETotalCost = proposedEERates[0] * optNetwork.getTier1Census() +
                    proposedEERates[1] * optNetwork.getTier2Census() +
                    proposedEERates[2] * optNetwork.getTier3Census() +
                    proposedEERates[3] * optNetwork.getTier4Census();
                Float changeProposedEECost = MathUtils.diffPecent(proposedEETotalCost, currentEETotalCost, 2);
                contributionItem.setChangeProposedEECost(changeProposedEECost);
            }

            contributionItem.setRfpQuoteOptionNetworkId(optNetwork.getRfpQuoteOptionNetworkId());
            contributionItem.setProposedContrFormat(optNetwork.getErContributionFormat());
            contributionItem.setContributions(contributions);
            contributionItem.setFundEETotal(calcEmployerFund(optNetwork, contributionItem.getPlanType()));
            contributionItem.setProposedEnrollmentTotal(optNetwork.getTier1Census() + optNetwork.getTier2Census() +
                    optNetwork.getTier3Census() + optNetwork.getTier4Census());
            result.add(contributionItem);
        }

        return result;
    }

    public QuoteOptionBriefDto findCurrentAncillaryOption(Long clientId, String product) {
        PlanCategory category = PlanCategory.valueOf(product);
        Collection<String> planTypes = category.getPlanTypes();
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(clientId, planTypes);

        return findCurrentClientOption(clientPlans);
    }

    public QuoteOptionBriefDto findCurrentClientOption(List<ClientPlan> clientPlans) {
        Float currentTotal = 0f;
        List<PlanBriefDto> currentPlans = new ArrayList<>();

        for(ClientPlan plan : clientPlans) {
            if(plan.getPnn() != null) {
                currentPlans.add(new PlanBriefDto(plan.getPnn().getName(), plan.getPnn().getNetwork().getType()));
            }
            currentTotal += calcClientPlanTotal(plan);
        }

        // FIXME maybe return null instead of an empty option?
        RfpQuoteOption currentOption = prepareCurrentOption(clientPlans);

        QuoteOptionBriefDto currentOptionDto = new QuoteOptionBriefDto();
        Carrier carrier = currentOption.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
        currentOptionDto.setCarrier(carrier.getDisplayName());
        currentOptionDto.setQuoteType(currentOption.getRfpQuote().getQuoteType());
        currentOptionDto.setName(currentOption.getRfpQuoteOptionName());
        currentOptionDto.setOptionType(getOptionType(currentOption.getRfpQuoteOptionName()));
        currentOptionDto.setPlans(currentPlans);
        currentOptionDto.setTotalAnnualPremium(currentTotal * MONTHS_IN_YEAR);
        currentOptionDto.setPercentDifference(0.0f);

        // If client has no client plan, the current option is not complete
        currentOptionDto.setComplete(currentPlans.isEmpty());
        currentOptionDto.setCarriers(getCarrierNames(clientPlans));
        return currentOptionDto;
    }

    public static List<String> getCarrierNames(List<ClientPlan> clientPlans) {
        Set<String> carriers = new HashSet<>();
        for(ClientPlan plan : clientPlans) {
            if(plan.getAncillaryPlan() != null) {
                Carrier c = plan.getAncillaryPlan().getCarrier();
                carriers.add(c.getName());
            } else if(plan.getPnn() != null &&
                plan.getPnn().getPlan() != null &&
                plan.getPnn().getPlan().getCarrier() != null) {
                Carrier c = plan.getPnn().getPlan().getCarrier();
                carriers.add(c.getName());
            }
        }
        return new ArrayList<>(carriers);
    }

    public static OptionType getOptionType(String optionName){
        if(containsIgnoreCase(optionName, "Renewal")){
            return OptionType.RENEWAL;
        }else if(containsIgnoreCase(optionName, "Negotiated")){
            return OptionType.NEGOTIATED;
        }else{
            return OptionType.OPTION;
        }
    }

    public RfpQuoteOption prepareCurrentOption(List<ClientPlan> clientPlans) {

        RfpQuote currentQuote = prepareCurrentQuote(clientPlans);

        RfpQuoteOption currentOption = new RfpQuoteOption();
        // fake option used below for building common comparison structure
        currentOption.setRfpQuoteOptionId(null);
        currentOption.setRfpQuoteOptionName(Constants.CURRENT_NAME);
        currentOption.setFinalSelection(false);
        currentOption.setRfpQuote(currentQuote);

        return currentOption;
    }

    public RfpQuote prepareCurrentQuote(List<ClientPlan> clientPlans) {
        QuoteType quoteType = QuoteType.STANDARD;
        Map<String, Carrier> carriers = new HashMap<>();
        for(ClientPlan plan : clientPlans) {
            if(plan.getAncillaryPlan() != null) {
                Carrier c = plan.getAncillaryPlan().getCarrier();
                carriers.put(c.getName(), c);
            } else if(plan.getPnn() != null &&
                      plan.getPnn().getPlan() != null &&
                      plan.getPnn().getPlan().getCarrier() != null) {
                Carrier c = plan.getPnn().getPlan().getCarrier();
                carriers.put(c.getName(), c);
            }
        }

        Carrier kaiserCarrier = carriers.get(Constants.KAISER_CARRIER);
        if(kaiserCarrier != null) {
            if(carriers.size() == 1) {
                quoteType = QuoteType.STANDARD;
            } else if(carriers.size() == 2) {
                quoteType = QuoteType.KAISER;
                carriers.remove(Constants.KAISER_CARRIER);
            }
        }
        Carrier currentCarrier = null;
        if(carriers.size() > 1) {
            currentCarrier = new Carrier();
            currentCarrier.setName(MULTIPLE_CARRIER);
            currentCarrier.setDisplayName(MULTIPLE_CARRIER_DISPLAY_NAME);
        } else if(carriers.size() == 0) {
            currentCarrier = new Carrier();
            currentCarrier.setName(StringUtils.EMPTY);
            currentCarrier.setDisplayName(StringUtils.EMPTY);
        } else {
            currentCarrier = Iterables.getFirst(carriers.values(), null);
        }

        RfpCarrier rfpCarrier = new RfpCarrier();
        rfpCarrier.setCarrier(currentCarrier);
        RfpSubmission sub = new RfpSubmission();
        sub.setRfpCarrier(rfpCarrier);
        RfpQuote rfpQuote = new RfpQuote();
        rfpQuote.setUpdated(new Date());
        rfpQuote.setRfpSubmission(sub);
        rfpQuote.setQuoteType(quoteType);

        return rfpQuote;
    }

    public int findLastOptionNumber(List<? extends QuoteOption> rfpQuoteOptions, OptionType optionType) {
        QuoteOption lastQuoteOption = rfpQuoteOptions.stream()
            // TODO check isDeleted flag as when it will be added
            .filter(option -> containsIgnoreCase(option.getName(), optionType.name()))
            .sorted(
                (o1, o2) -> {
                    // IMORTANT: desc comparator!
                    return compare(
                        o2.getOptionId(),
                        o1.getOptionId()
                    );
                }
            )
            .findFirst()
            .orElse(null);

        if(lastQuoteOption != null) {
            String lastOptionName = lastQuoteOption.getName();

            if(!lastOptionName.matches("\\w+ \\d{1,2}") && !lastOptionName.contains("CLSA")) { // "Option N" or "Renewal N" or "Negotiated N or CLSA Trust N"
                return 0;
                /*throw new BadRequestException("Unexpected option name")
                    .withFields(
                        field("last_option_name", lastOptionName)
                    );*/
            }

            String[] nameParts = lastOptionName.split(" ");
            return parseUnsignedInt(nameParts[nameParts.length-1]);
        }

        return 0;
    }

    public List<RfpQuoteOption> findAllCarrierQuoteOptions(Long clientId, String category) {
        return rfpQuoteOptionRepository.findByClientIdAndCategory(clientId, category);
    }

    public boolean isValidTierRates(int tier, Long tier1, Long tier2, Long tier3, Long tier4){
        if(tier >= 1 && isNull(tier1)) return false;
        else if(tier >= 2 && isNull(tier2)) return false;
        else if(tier >= 3 && isNull(tier3)) return false;
        else if(tier >= 4 && isNull(tier4)) return false;
        return true;
    }

    public boolean isCompleteRfpQuoteOptionNetwork(RfpQuoteOptionNetwork rqon){
        if(isNull(rqon.getClientPlan()) || isNull(rqon.getSelectedRfpQuoteNetworkPlan())){
            return false;
        }

        /** If select rx is null, make sure the medical plan carrier is not UHC, Blue Shield, Aetna
         * and Health Net per requirements from https://app.asana.com/0/570820516890590/570820516890601
         */

        RfpQuoteNetworkPlan selectRx = rqon.getSelectedRfpQuoteNetworkRxPlan();
        if(isNull(selectRx)){
            Carrier carrier = rqon.getSelectedRfpQuoteNetworkPlan().getPnn().getNetwork().getCarrier();
            if (!carrier.getName().equals(CarrierType.AETNA.displayName)
                || !carrier.getName().equals(CarrierType.BLUE_SHIELD.displayName)
                || !carrier.getName().equals(CarrierType.UHC.displayName)
                || !carrier.getName().equals(CarrierType.HEALTHNET.displayName)) {
                return false;
            }
        }

        if(!isValidTierRates(rqon.getRfpQuoteOption().getRfpQuote().getRatingTiers(),
            rqon.getTier1Census(), rqon.getTier2Census(), rqon.getTier3Census(), rqon.getTier4Census())){
            return false;
        }

        return true;
    }
    
    public float calcOptionTotal(RfpQuoteOption option) {

        BundleDiscounts discounts = calcBundleDiscount(option);
        return calcOptionTotal(option, discounts.summaryBundleDiscountPercent);
    }

    public float calcOptionTotal(RfpQuoteOption option, float discounts) {
        float optionTotal = 0f;
        for(RfpQuoteOptionNetwork optNetwork : option.getRfpQuoteOptionNetworks()) {
            if(optNetwork.getSelectedRfpQuoteNetworkPlan() == null) {
                continue;
            }
            String planType = optNetwork.getSelectedRfpQuoteNetworkPlan().getPnn().getNetwork().getType();
            optionTotal += calcAlterPlanTotal(optNetwork, optNetwork.getSelectedRfpQuoteNetworkPlan(), discounts);
            optionTotal += calcEmployerFund(optNetwork, planType);
            optionTotal += administrativeFeeService.calcAdministrativeFee(optNetwork, planType);
        }
        return optionTotal;
    }
    
    public double calcAncillaryOptionTotal(RfpQuoteAncillaryOption option) {
        if(option.getRfpQuoteAncillaryPlan() == null) {
            return 0.0;
        }
        String product = option.getRfpQuoteAncillaryPlan().getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory();
        PlanCategory category = PlanCategory.valueOf(product);
        return calcAncillaryPlanTotal(option.getRfpQuoteAncillaryPlan().getAncillaryPlan(), category);
    }
    
    // RfpQuoteOptions bundle discount APIs
    
    public BundleDiscounts calcBundleDiscount(RfpQuoteOption option) {
        String optionCategory = option.getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory();
        if (!Constants.MEDICAL.equals(optionCategory)) {
            // slight optimization: discounts only for medical rates
            return new BundleDiscounts();
        }
        Long clientId = option.getRfpQuote().getRfpSubmission().getClient().getClientId();
        return calcBundleDiscount(clientId);
    }
    
    public BundleDiscounts calcBundleDiscount(Long clientId) {
        List<RfpQuoteOption> options = rfpQuoteOptionRepository.findSelectedByClientId(clientId);
        return calcBundleDiscount(clientId, options);
    }
    
    public BundleDiscounts calcBundleDiscount(Long clientId, List<RfpQuoteOption> selectedOptions) {
        BundleDiscounts result = new BundleDiscounts();
        RfpQuoteOption medicalOption = null, dentalOption = null, visionOption = null;
        boolean isMedicalRenewal = false;
        double medicalDiscountBaseTotal = 0.0;
        for (RfpQuoteOption opt : selectedOptions) {  
            switch(opt.getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory()) {
                case Constants.MEDICAL:
                    medicalOption = opt;
                    // FIXME
                    // Treat new business option with name "Renewal" the same way as a renewal option?
                    // For example: 
                    // Apply discount if new business options have names "Renewal" ?
                    isMedicalRenewal = OptionType.RENEWAL.equals(getOptionType(medicalOption.getName()));
                    double discountBaseTotal = 0.0;
                    for (RfpQuoteOptionNetwork optNetwork : opt.getRfpQuoteOptionNetworks()) {
                        if (optNetwork.getSelectedRfpQuoteNetworkPlan() != null) {
                            discountBaseTotal += calcPlanTotalBaseForDiscount(optNetwork, optNetwork.getSelectedRfpQuoteNetworkPlan());
                        }
                    }
                    medicalDiscountBaseTotal = round(discountBaseTotal * MONTHS_IN_YEAR, 2);
                    result.medicalDiscountBaseTotal = medicalDiscountBaseTotal;
                    break;
                case Constants.DENTAL:
                    dentalOption = opt;
                    break;
                case Constants.VISION:
                    visionOption = opt;
                    break;
            }
        }
        // calculate bundle discount
        float summaryBundleDiscountPercent = 0f;
        double summaryBundleDiscount = 0.0;
        // selected DENTAL option
        if (isValidAppCarrierOption(medicalOption)) {
            //  if the client didn't select "Voluntary" for contribution then add bundling discount
            Float dentalDiscount = checkAndReturnCarrierBundlingDiscount(dentalOption, DENTAL_BUNDLE_DISCOUNT_PERCENT, isMedicalRenewal);
            if (!isNull(dentalDiscount)) {
                result.dentalBundleDiscountPercent = dentalDiscount;
                // possible discount
                result.dentalBundleDiscount = round(medicalDiscountBaseTotal * dentalDiscount / 100.0, 2);
                if (dentalOption != null) {
                    // add current discount for DENTAL
                    result.dentalBundleDiscountApplied = true;
                    summaryBundleDiscount += result.dentalBundleDiscount;
                    summaryBundleDiscountPercent += dentalDiscount;
                } else {
                    result.dentalBundleDiscountApplied = false;
                }
            }
        }
        // selected VISION option
        if (isValidAppCarrierOption(medicalOption)) {
            //  if the client didn't select "Voluntary" for contribution then add bundling discount
            Float visionDiscount = checkAndReturnCarrierBundlingDiscount(visionOption, VISION_BUNDLE_DISCOUNT_PERCENT, isMedicalRenewal);
            if (!isNull(visionDiscount)) {
                result.visionBundleDiscountPercent = visionDiscount;
                // possible discount
                result.visionBundleDiscount = round(medicalDiscountBaseTotal * visionDiscount / 100.0, 2);
                if (visionOption != null) {
                    // add current discount for VISION
                    result.visionBundleDiscountApplied = true;
                    summaryBundleDiscount += result.visionBundleDiscount;
                    summaryBundleDiscountPercent += visionDiscount;
                } else {
                    result.visionBundleDiscountApplied = false;
                }
            }
        } 
        // selected ex-products
        
        if (medicalDiscountBaseTotal > 0 && isValidAppCarrierOption(medicalOption)) {
            List<ClientExtProduct> products = clientExtProductRepository.findByClientId(clientId);
            if (!products.isEmpty()) {
                double extProductsBundleDiscount = 0.0;
                float extProductsBundleDiscountPercent = 0f;
                for (ClientExtProduct product : products) {
                    Float discountPercent = CV_PRODUCT_DISCOUNT_PERCENT.get(product.getExtProduct().getName());
                    if (discountPercent == null) {
                    	throw new BaseException("Discount percent is not defined for external product: " + product.getExtProduct().getName());
                    }
                    double discount = round(medicalDiscountBaseTotal * discountPercent / 100.0, 2);
                    extProductsBundleDiscount += discount;
                    extProductsBundleDiscountPercent += discountPercent;
                }   
                result.extProductsBundleDiscount = extProductsBundleDiscount;
                result.extProductsBundleDiscountPercent = extProductsBundleDiscountPercent;
                summaryBundleDiscount += extProductsBundleDiscount;
                summaryBundleDiscountPercent += extProductsBundleDiscountPercent;
            }
        }
        result.summaryBundleDiscount = round(summaryBundleDiscount, 2);
        result.summaryBundleDiscountPercent = round(summaryBundleDiscountPercent, 2);
        return result;
    }
    
    public Float calcMaxBundleDiscount(Float total, BundleDiscounts discounts) {
        if (total == null) {
            return 0f;
        }
        float maxBundleDiscount = 0f;
        if (discounts.dentalBundleDiscount != null) {
            maxBundleDiscount += discounts.dentalBundleDiscount;
        }
        if (discounts.visionBundleDiscount != null) {
            maxBundleDiscount += discounts.visionBundleDiscount;
        }
        return maxBundleDiscount > 0f ? maxBundleDiscount : null;
    } 
    
    public boolean isValidAppCarrierOption(RfpQuoteOption rfpQuoteOption){
        if(rfpQuoteOption == null) {
            return false;
        }

        Carrier optionCarrier = rfpQuoteOption.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
        return isCarrierNameAppCarrier(optionCarrier.getName(), appCarrier);
    }

    public Float checkAndReturnCarrierBundlingDiscount(RfpQuoteOption rfpQuoteOption, Float discount, boolean isMedicalRenewal){
        if(rfpQuoteOption == null // default proposed discount if client will include dental option
                || (isValidAppCarrierOption(rfpQuoteOption) // if option include quotes only from current carrier
                    && isEligibleForDiscount(rfpQuoteOption, isMedicalRenewal))) { 
            return discount;
        }else{
            return null;
        }
    }
    
    // if option have at least one "Employer Paid" plan (not all "Voluntary")
    // and option is not belong to Trust Program (no bundling discounts for trust plans)
    // and option product or medical is a new line of coverage (not product renewing)
    public static boolean isEligibleForDiscount(RfpQuoteOption rfpQuoteOption, boolean isMedicalRenewal){
        if(QuoteType.isTrustProgramType(rfpQuoteOption.getRfpQuote().getQuoteType())) {
            return false;
        }
        if(isMedicalRenewal && OptionType.RENEWAL.equals(getOptionType(rfpQuoteOption.getName()))) {
            return false;
        }
        for(RfpQuoteOptionNetwork rqon : rfpQuoteOption.getRfpQuoteOptionNetworks()) {
            if(rqon.getSelectedRfpQuoteNetworkPlan() != null 
                && !rqon.getSelectedRfpQuoteNetworkPlan().isVoluntary()) {
                return true;
            }
        }
        return false;
    }

    // 3) common helper methods used in SharedRfpQuoteService and RfpQuoteService
    
    protected Client getClientById(Long clientId) {
        Client client = clientRepository.findOne(clientId);

        if(client == null) {
            throw new BaseException("Client not found")
                .withFields(
                    field("client_id", clientId)
                );
        }
        return client;
    }
    
    // TODO rename to isCurrentPlanFromKaiser ?
    public boolean isKaiserNetwork(RfpQuoteOptionNetwork optNetwork) {
        ClientPlan clientPlan = optNetwork != null ? optNetwork.getClientPlan() : null;
        Carrier carrier = extractClientPlanCarrier(clientPlan);
        return carrier != null && Constants.KAISER_CARRIER.equals(carrier.getName());
    }
    
    public String extractClientPlanCarrierDisplayName(ClientPlan clientPlan) {
        Carrier carrier = extractClientPlanCarrier(clientPlan);
        return carrier != null ? carrier.getDisplayName() : null;
    }
    
    /* Is the scenario when the selected_quote_network_plan_id on the quote option network is from Kaiser. 
     * This mean the have Anthem plans and are keeping the Kaiser plan. Example: 
     * 
     * The client can have:
     *  HMO - Aetna (2017)
     *  PPO - Aetna (2017)
     *  HMO - Kaiser (2017)
     *  
     *  For this year when buying insurance from UHC or ANTHEM, the client has two options when moving over:
     *  1. Keep the Kaiser plan and the employees in it (Along side)
     *  HMO - Anthem (2018)
     *  PPO - Anthem (2018)
     *  HMO - Kaiser (2018) <-- keeping Kaiser
     * 
     *  2. Move everyone from Kaiser to a HMO from Anthem (Full takeover)
     *  HMO - Anthem (2018)
     *  PPO - Anthem  (2018)
     *  HMO Plus - Anthem (2018) <-- moving from Kaiser to Anthem 
     */
    public boolean isAlongsideKaiser(RfpQuoteOption option) {
        for (RfpQuoteOptionNetwork optNetwork : option.getRfpQuoteOptionNetworks()) {
            if (isKaiserNetwork(optNetwork) && isSelectedPlanFromKaiser(optNetwork)) {
                return true;
            }
        }
        return false;
    }
    
    public RfpQuote processDeclinedQuote(Long clientId, Long brokerId, String carrier, String category, boolean persist) {
        
        List<Client> clientList = clientRepository.findByClientIdAndBrokerBrokerId(clientId, brokerId);
        if(null == clientList  || clientList.size() == 0) {
            throw new NotFoundException("No client with ID=" + clientId +", broker id= " + brokerId + " found");
        }
        Client client = clientList.get(0);

        RfpCarrier rfpCarrier  = rfpCarrierRepository.findByCarrierNameAndCategory(carrier, category);

        //TODO: get by product
        RfpSubmission rfpSubmission = rfpSubmissionRepository.findByRfpCarrierAndClient(rfpCarrier, client); 
        if(null == rfpSubmission){
            throw new NotFoundException("No RFP Submission found for category="+ category +", clientId=" + client.getClientId());
        }

        RfpQuote rfpQuote = null;
        if(persist) {
            // mark previous quotes as not latest (except ClearValue)
            List<RfpQuote> previousQuotes = rfpQuoteRepository.findByClientIdAndCategory(clientId, category);
            for (RfpQuote previousQuote : previousQuotes) {
                switch(previousQuote.getQuoteType()) {
                    case DECLINED:
                        throw new BaseException("Already DECLINED");
                    case CLEAR_VALUE:
                        // skip
                        break;
                    default:
                        previousQuote.setQuoteType(QuoteType.DECLINED);
                        rfpQuoteRepository.save(previousQuote);
                        rfpQuote = previousQuote;
                        break;
                }
            }
            if(rfpQuote == null) {
                // create new version
                RfpQuoteVersion rfpQuoteVersion = new RfpQuoteVersion();
                rfpQuoteVersion.setRfpSubmissionId(rfpSubmission.getRfpSubmissionId());
                rfpQuoteVersionRepository.save(rfpQuoteVersion);

                // create new quote w/ version
                rfpQuote = new RfpQuote();
                rfpQuote.setRatingTiers(0);
                rfpQuote.setLatest(true);
                rfpQuote.setUpdated(new Date());
                rfpQuote.setQuoteType(QuoteType.DECLINED);
                rfpQuote.setRfpSubmission(rfpSubmission);
                rfpQuote.setRfpQuoteVersion(rfpQuoteVersion);
                rfpQuote = rfpQuoteRepository.save(rfpQuote);
            }
        }
        // change OPTION1_RELEASED activity note language
        ofNullable(activityRepository
            .findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(
                clientId, ActivityType.OPTION1_RELEASED, null, category, null))
            .ifPresent(activity -> {
                Float diffPercent = activity.getValue() == null ? null : Float.parseFloat(activity.getValue());
                String notes = "DTQ " + capitalize(lowerCase(category)) + " Option 1 " 
                        + (diffPercent == null ? "" : Float.toString(Math.abs(diffPercent)) + ((diffPercent < 0) ? "% below" : "% above")) 
                        + " current. Quote not released to broker";
                activity.setNotes(notes);
                activity.setUpdated(new Date());
                activityRepository.save(activity);
            });
        return rfpQuote;
    }

    public void saveOption1ReleaseActivity(Long clientId, String category, RfpQuote rfpQuote) {

        if(rfpQuote == null){
            return;
        }

        Try.run(() -> rfpQuote
                .getRfpQuoteOptions()
                .stream()
                .filter(o -> StringUtils.equalsAny(o.getRfpQuoteOptionName(), OPTION_1, RENEWAL_1))
                .findFirst()
                .ifPresent(o -> {
                    // calculate current option
                    PlanCategory planCategory = PlanCategory.valueOf(category);
                    List<ClientPlan> clientPlans = clientPlanRepository
                            .findByClientClientIdAndPnnPlanTypeIn(clientId, planCategory.getPlanTypes());
                    float currentTotal = 0f;
                    for (ClientPlan plan : clientPlans) {
                        currentTotal += calcClientPlanTotal(plan);
                    }

                    // calculate Option1
                    float optionTotal = calcOptionTotal(o);
                    float diffPercent = MathUtils.diffPecent(optionTotal, currentTotal, 2);

                    if (OPTION_1.equals(o.getRfpQuoteOptionName())) {
                        Activity activity;
                        if (rfpQuote.getQuoteType().equals(QuoteType.CLEAR_VALUE)) {
                            // InstantQuote
                            activity = new Activity(
                                    clientId, 
                                    ActivityType.COMPETITIVE_INFO,
                                    Float.toString(diffPercent),
                                    ": " + capitalize(lowerCase(category))  + " competitive info")
                                            .created(o.getRfpQuote().getUpdated()).product(category)
                                            .option(CompetitiveInfoOption.DIFFERENCE.name())
                                            .carrierId(carrierRepository
                                                    .findByName(Constants.ANTHEM_CLEAR_VALUE_CARRIER)
                                                    .getCarrierId());
                        } else {
                            activity = new Activity(
                                    clientId, 
                                    ActivityType.OPTION1_RELEASED,
                                    Float.toString(diffPercent),
                                    capitalize(lowerCase(category)) + " Option 1 released at "
                                            + Float.toString(Math.abs(diffPercent))
                                            + ((diffPercent < 0) ? "% below" : "% above") + " current")
                                                    .created(o.getRfpQuote().getUpdated())
                                                    .product(category);
                        }
                        sharedActivityService.save(activity);
                        
                    } else if (RENEWAL_1.equals(o.getRfpQuoteOptionName())) {
                        
                        RfpQuoteOptionAttribute attribute = attributeRepository.findRfpQuoteOptionAttributeByRfpQuoteOptionIdAndName(
                                o.getRfpQuoteOptionId(),
                                RfpQuoteOptionAttributeName.STARTING_TOTAL);
                        if (attribute == null) {
                            attribute = new RfpQuoteOptionAttribute(
                                o, 
                                RfpQuoteOptionAttributeName.STARTING_TOTAL,
                                Float.toString(optionTotal));
                            attributeRepository.save(attribute);
                        }

                        // diffPercent rounding precision must be the same with RENEWAL_ADDED activity
                        float renewalDiffPercent = MathUtils.diffPecent(optionTotal, currentTotal, 1);
                        Activity activity = activityRepository.findByClientIdAndTypeAndOptionAndProductAndCarrierIdAndLatestIsTrue(
                                        clientId, 
                                        ActivityType.INITIAL_RENEWAL, 
                                        null, 
                                        category, 
                                        null);
                        if (activity == null) {
                            activity = new Activity(
                                    clientId, 
                                    ActivityType.INITIAL_RENEWAL,
                                    Float.toString(renewalDiffPercent),
                                    capitalize(lowerCase(category)) + " starting Renewal rates")
                                        .created(o.getRfpQuote().getUpdated())
                                        .product(category);
                            sharedActivityService.save(activity);
                        }    
                    }
                    

                })).onFailure(t -> logger.errorLog(t.getMessage(), t));
    }


    public void copyQuote(Client client, Client clientCopy){
        for(RfpSubmission rfpSubmission : rfpSubmissionRepository.findByClient(client)){
            RfpSubmission rfpSubmissionCopy = rfpSubmission.copy();
            rfpSubmissionCopy.setClient(clientCopy);
            rfpSubmissionRepository.save(rfpSubmissionCopy);

            RfpQuote rfpQuote = rfpQuoteRepository.
                findByRfpSubmissionAndRfpSubmissionClientClientIdAndLatestIsTrue(rfpSubmission, client.getClientId());

            if(!isNull(rfpQuote)){
                // copy rfpQuote
                copyRfpQuoteAndReturn(rfpSubmissionCopy, rfpQuote);
            }
        }
    }

    public RfpQuote copyRfpQuoteAndReturn(RfpSubmission rfpSubmissionCopy, RfpQuote rfpQuote) {
        RfpQuote rfpQuoteCopy = rfpQuote.copy();

        if(rfpSubmissionCopy != null){
            rfpQuoteCopy.setRfpSubmission(rfpSubmissionCopy);
        }

        rfpQuoteCopy = rfpQuoteRepository.save(rfpQuoteCopy);
        for(RfpQuoteNetwork rfpQuoteNetworkCopy : rfpQuoteCopy.getRfpQuoteNetworks()){
            rfpQuoteNetworkCopy = rfpQuoteNetworkRepository.save(rfpQuoteNetworkCopy);

            for(RfpQuoteNetworkPlan rfpQuoteNetworkPlan : rfpQuoteNetworkCopy.getRfpQuoteNetworkPlans()){
                rfpQuoteNetworkPlanRepository.save(rfpQuoteNetworkPlan);
            }
        }
        return rfpQuoteCopy;
    }

    public Integer findRatingTiers(List<ClientPlan> clientPlans) {
        if(clientPlans == null || clientPlans.isEmpty()) {
            return DEFAULT_RATING_TIERS; // default value for new option (if no plans created yet)
        }
        int ratingTiers = 0;
        for(ClientPlan clientPlan : clientPlans) {
            if(clientPlan.getOptionId() != null) {
                com.benrevo.data.persistence.entities.Option opt = optionRepository.findOne(clientPlan.getOptionId());
                ratingTiers = Math.max(ratingTiers, opt.getRfp().getRatingTiers());
            } else {
                ratingTiers = Math.max(ratingTiers, clientPlan.calcRatingTiers());
            }
        }
        return ratingTiers > 0 ? ratingTiers : DEFAULT_RATING_TIERS;
    }

}
