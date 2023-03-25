package com.benrevo.be.modules.admin.domain.plans;

import static com.benrevo.common.util.MapBuilder.field;

import com.amazonaws.services.cloudfront.model.InvalidArgumentException;
import com.benrevo.be.modules.admin.util.PlanUtil;
import com.benrevo.be.modules.admin.util.helper.PlanHistoryHelper;
import com.benrevo.be.modules.shared.util.BenefitUtil;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CarrierPlansPreviewDto;
import com.benrevo.common.dto.CarrierPlansPreviewDto.ChangedBenefit;
import com.benrevo.common.dto.CarrierPlansPreviewDto.ChangedPlan;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.ancillary.AncillaryClass;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.AncillaryRate;
import com.benrevo.data.persistence.entities.ancillary.BasicRate;
import com.benrevo.data.persistence.entities.ancillary.LifeClass;
import com.benrevo.data.persistence.entities.ancillary.LtdClass;
import com.benrevo.data.persistence.entities.ancillary.StdClass;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.repository.*;
import com.benrevo.data.persistence.repository.ancillary.AncillaryClassRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryRateRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.ss.formula.ConditionalFormattingEvaluator;
import org.apache.poi.ss.formula.WorkbookEvaluatorProvider;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.multimap.ArrayListValuedHashMap;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;

@Component
@Transactional
public class FormattedPlanPortfolioLoader {

    @Autowired
    private CustomLogger LOGGER;

    private List<BenefitName> benefitNames;
    private static DataFormatter formatter = new DataFormatter();

    private final String HMO = "HMO";
    private final String PPO = "PPO";
    private final String HSA = "HSA";
    private final String DHMO = "DHMO";
    private final String DPPO = "DPPO";
    private final String VISION = "VISION";
    private final String RX_HMO = "RX_HMO";
    private final String RX_PPO = "RX_PPO";
    private final String HMO_RIDER = "HMO_RIDER";
    private final String PPO_RIDER = "PPO_RIDER";

    private final int NUM_OF_NETWORK_COLS = 10;
    private Long batchNumber;
    FormulaEvaluator evaluator;
    ConditionalFormattingEvaluator cfEvaluator;

    private final List<String> productsToLoad = new ArrayList<>(Arrays.asList(HMO, PPO, HSA, DHMO, DPPO, VISION, RX_HMO, RX_PPO, HMO_RIDER, PPO_RIDER));

    public static final Map<String, String> ANCILLARY_BENEFITS_TO_PROPERTY = new HashMap<>(128);
    static {
    	// Basic LIFE/AD&D
    	ANCILLARY_BENEFITS_TO_PROPERTY.put("Benefit Amount", "employeeBenefitAmount");
    	ANCILLARY_BENEFITS_TO_PROPERTY.put("Maximum Benefit", "employeeMaxBenefit");
    	ANCILLARY_BENEFITS_TO_PROPERTY.put("Guarantee Issue", "employeeGuaranteeIssue");
    	ANCILLARY_BENEFITS_TO_PROPERTY.put("Waiver of Premium", "waiverOfPremium");
    	ANCILLARY_BENEFITS_TO_PROPERTY.put("Accelerated Death Benefit", "deathBenefit");
    	ANCILLARY_BENEFITS_TO_PROPERTY.put("Conversion", "conversion");
    	ANCILLARY_BENEFITS_TO_PROPERTY.put("Portability", "portability");
    	ANCILLARY_BENEFITS_TO_PROPERTY.put("Rate Guarantee", "rateGuarantee");
    	ANCILLARY_BENEFITS_TO_PROPERTY.put("Age Reduction - Age 65", "age65reduction");
    	ANCILLARY_BENEFITS_TO_PROPERTY.put("Age Reduction - Age 70", "age70reduction");
    	ANCILLARY_BENEFITS_TO_PROPERTY.put("Age Reduction - Age 75", "age75reduction");
    	ANCILLARY_BENEFITS_TO_PROPERTY.put("Age Reduction - Age 80", "age80reduction");
    	// Voluntary LIFE/AD&D
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Benefit Amount - Employee", "employeeBenefitAmount");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Maximum Benefit - Employee", "employeeMaxBenefit");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Guarantee Issue - Employee", "employeeGuaranteeIssue");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Benefit Amount - Spouse", "spouseBenefitAmount");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Maximum Benefit - Spouse", "spouseMaxBenefit");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Guarantee Issue - Spouse", "spouseGuaranteeIssue");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Benefit Amount - Child", "childBenefitAmount");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Maximum Benefit - Child", "childMaxBenefit");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Guarantee Issue - Child", "childGuaranteeIssue");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Spouse Rate Basis", "spouseBased");
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Waiver of Premium", "waiverOfPremium");
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Accelerated Death Benefit", "deathBenefit");
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Conversion", "conversion");
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Portability", "portability");
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Rate Guarantee", "rateGuarantee");
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Age Reduction - Age 65", "age65reduction");
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Age Reduction - Age 70", "age70reduction");
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Age Reduction - Age 75", "age75reduction");
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Age Reduction - Age 80", "age80reduction");
		//private Float percentage;
		// Basic STD
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Weekly Benefit %", "weeklyBenefit");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Max. Weekly Benefit $", "maxWeeklyBenefit");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Max. Benefit Duration", "maxBenefitDuration");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Waiting Period - Accident & Injury", "waitingPeriodAccident");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Waiting Period - Sickness", "waitingPeriodSickness");
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Rate Guarantee", "rateGuarantee");
		//private String conditionExclusion;
		// Basic LTD
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Monthly Benefit %", "monthlyBenefit");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Max. Benefit", "maxBenefit");
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Max. Benefit Duration", "maxBenefitDuration");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Elimination Period", "eliminationPeriod");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Definition of Disability", "occupationDefinition");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Pre-Existing Condition Exclusion", "conditionExclusion");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Mental Health/Substance Abuse Limitation", "abuseLimitation");
		ANCILLARY_BENEFITS_TO_PROPERTY.put("Premiums Paid", "premiumsPaid");
		// FIXME missing
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Value-Add EAP", "");
//		ANCILLARY_BENEFITS_TO_PROPERTY.put("Face-to-Face Visits", "");
    }
    
    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private BenefitNameRepository benefitNameRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private PlanRepository planRepository;
    

    @Autowired
    private RiderMetaRepository riderMetaRepository;

    @Autowired
    private PlanHistoryHelper planHistoryHelper;

    @Autowired
    private PlanUtil planUtil;

    @Autowired
    private BenefitUtil benefitUtil;

    public FormattedPlanPortfolioLoader() {}

    private boolean doUploadForProduct(String product) {
        return productsToLoad.contains(product);
    }
    public List<PlanNameByNetwork> getLastLoadedPlans(String planType, Carrier carrier, Integer planYear) {
        List<PlanNameByNetwork> pnnList = planNameByNetworkRepository.findByPlanCarrierAndPlanTypeAndPlanPlanYear(carrier, planType, planYear);
        return pnnList;
    }

    public CarrierPlansPreviewDto previewPlans(Carrier carrier, InputStream fis, Integer planYear) throws Exception {
        CarrierPlansPreviewDto result = new CarrierPlansPreviewDto();

        Map<String, List<GenericPlanDetails>> parsedPlans = parsePlans(carrier, fis, false);
        parsedPlans.forEach((planType, planDetails) -> {
            CarrierPlansPreviewDto planTypeResult = comparePlans(planType, carrier, planDetails, planYear);
            result.getAdded().addAll(planTypeResult.getAdded());
            result.getUpdated().addAll(planTypeResult.getUpdated());
            result.getRemoved().addAll(planTypeResult.getRemoved());
        });

        return result;
    }

    private CarrierPlansPreviewDto comparePlans(String planType, Carrier carrier, List<GenericPlanDetails> newPlans, Integer planYear) {
        CarrierPlansPreviewDto result = new CarrierPlansPreviewDto();
        List<PlanNameByNetwork> loadedPlans = getLastLoadedPlans(planType, carrier, planYear);
        Map<String, List<PlanNameByNetwork>> loadedPlansByName = loadedPlans.stream().collect(Collectors.groupingBy(pnn -> pnn.getName()));
        Set<String> newPnnNames = new HashSet<>();
        Map<Long, List<Benefit>> idx = new HashMap<Long, List<Benefit>>();
        // find added plans
        for (GenericPlanDetails newPlan : newPlans) {
            newPlan.getPlanNamesByNetwork().forEach((pnnName, network) -> {
                newPnnNames.add(pnnName);
                List<PlanNameByNetwork> plansByName = loadedPlansByName.get(pnnName);
                PlanNameByNetwork loadedPlan = null;
                if (plansByName != null) {
                    for (PlanNameByNetwork pnn : plansByName) {
                        if (pnn.getNetwork().getName().equals(network.getName())) {
                            loadedPlan = pnn;
                            break;
                        }
                    }
                }
                if (loadedPlan != null) {
                    // find updated benefits
                    List<Benefit> loadedBenefits = benefitRepository.findByPlanId(loadedPlan.getPlan().getPlanId());
                    List<ChangedBenefit> changedBenefits = compareBenefits(loadedBenefits, newPlan.getBenefits());
                    if (!changedBenefits.isEmpty()) {
                        ChangedPlan updated = new ChangedPlan();
                        updated.networkName = network.getName();
                        updated.planType = planType;
                        updated.planName = pnnName;
                        updated.changedBenefits = changedBenefits;
                        result.getUpdated().add(updated);
                    }
                } else {
                    ChangedPlan added = new ChangedPlan();
                    added.networkName = network.getName();
                    added.planType = planType;
                    added.planName = pnnName;
                    result.getAdded().add(added);
                }
            });
        }
        // find removed plans
        for (PlanNameByNetwork loadedPlan : loadedPlans) {
            if (!newPnnNames.contains(loadedPlan.getName())) {
                ChangedPlan removed = new ChangedPlan();
                removed.networkName = loadedPlan.getNetwork().getName();
                removed.planType = loadedPlan.getPlanType();
                removed.planName = loadedPlan.getName();
                result.getRemoved().add(removed);
            }
        }
        return result;
    }

    private List<ChangedBenefit> compareBenefits(List<Benefit> loadedBenefits, List<Benefit> newBenefits) {
        List<ChangedBenefit> result = new ArrayList<>();
        Map<String, String> loadedValuesByName = mapBenefits(loadedBenefits);
        Map<String, String> newValuesByName = mapBenefits(newBenefits);

        newValuesByName.forEach((name, value) -> {
            String oldValue = loadedValuesByName.get(name);
            if (!Objects.equals(value, oldValue)) {
                ChangedBenefit cb = new ChangedBenefit(name, String.valueOf(oldValue), String.valueOf(value));
                result.add(cb);
            }
        });
        return result;
    }

    private Map<String, String> mapBenefits(List<Benefit> benefits) {
        Map<String, String> result = new HashMap<>();
        benefits.forEach(b -> {
            final String key = b.getBenefitName().getDisplayName();
            if (result.containsKey(key)) {
                String oldValue = result.remove(key);
                if (b.getInOutNetwork().equals("IN")) {
                    result.put(key + " OUT", oldValue);
                    result.put(key + " IN", b.getValue());
                } else {
                    result.put(key + " IN", oldValue);
                    result.put(key + " OUT", b.getValue());
                }
            } else {
                result.put(key, b.getValue());
            }
        });
        return result;
    }

    /**
     * We need to flatten the plan and plan_name_by_networks table. Today, we have many pnn's pointing
     * to one plan. This is a issue when trying to update the benefits of only one of those pnn's.
     * We are moving to a one to one model for anything new and anything that gets updated.
     */
    private void flattenGroupedPlanIfNeeded(Carrier carrier, PlanNameByNetwork pnnToCheck, String planType, Integer planYear) {

        Plan oldPlan = pnnToCheck.getPlan();

        //1. check if there are many pnns tied to this plan.
        List<PlanNameByNetwork> pnnList = planNameByNetworkRepository.findByPlanPlanId(oldPlan.getPlanId());
        if(1 == pnnList.size()) {
            return;
        }

        //2. create individual plans for each found with same benefits
        for(PlanNameByNetwork pnn : pnnList) {

            List<PlanNameByNetwork> existingPnnList = planNameByNetworkRepository.findByNetworkAndNameAndPlanTypeAndPlanPlanYearAndClientIdAndCustomPlan(
                pnn.getNetwork(), pnn.getName(), planType, planYear,null, false);

            if(existingPnnList.size() > 1) {
                //LOGGER.info("---- Deleting, another plan already exists: " + pnn.getName());
                planNameByNetworkRepository.delete(pnn);
                continue;
            }

            //create new plan, with this name
            Plan newPlan = pnn.getPlan().copy();
            newPlan.setName(pnn.getName());
            planRepository.save(newPlan);

            pnn.setPlan(newPlan);
            planNameByNetworkRepository.save(pnn);
            //LOGGER.info("----- New plan created: " + pnn.getName());
        }

        //3. delete the current plan
        planRepository.delete(oldPlan);
    }

    public void savePlans(Carrier carrier, Map<String, List<GenericPlanDetails>> parsedPlans, Integer planYear) {
        parsedPlans.forEach((planType, planDetails) -> {
            planDetails.forEach(detail -> {

                //1. Does this plan_name_by_network exist?
                Map<String, Network> nameToNetworkMap = detail.getPlanNamesByNetwork();
                Set<String> planNames = nameToNetworkMap.keySet();

                for(String planName : planNames) {
                    Network network = detail.getPlanNamesByNetwork().get(planName);

                    List<PlanNameByNetwork> existingPnnList = planNameByNetworkRepository.findByNetworkAndNameAndPlanTypeAndPlanPlanYearAndClientIdAndCustomPlan(
                        network, planName, planType, planYear,null, false);

                    //new plan
                    if(0 == existingPnnList.size()) {
                        LOGGER.info("New Plan: " + planName);

                        planUtil.createPlan(null, false, carrier, planType, planName, detail, planYear, true);

                    } else if(1 == existingPnnList.size()) {
                        LOGGER.info("Existing Plan: " + planName);

                        PlanNameByNetwork pnn = existingPnnList.get(0);

                        //2. We found one pnn, check if we need to flatten before updating
                        flattenGroupedPlanIfNeeded(carrier, pnn, planType, planYear);

                        //update benefits
                        planUtil.updatePlan(pnn.getPlan(), detail, batchNumber, true);
                    } else {
                        LOGGER.error("CRITICAL: Two or more plans found with same name|network|custom=false|client=null: " + existingPnnList.get(0).getName() + ". Need manual intervention!!!");
                    }
                }
            });
            benefitRepository.flush();
        });
    }
	
	public Map<String, List<AncillaryPlan>> parseAncillaryPlans(Carrier carrier, InputStream fis, Integer planYear) throws Exception {
	    
		ArrayListValuedHashMap<String, AncillaryPlan> plansByProduct = new ArrayListValuedHashMap<>();
	    
	    try (XSSFWorkbook myWorkBook = new XSSFWorkbook (fis)) {
	        // Walk through all the sheets
            for (int sheetIndex = 0; sheetIndex < myWorkBook.getNumberOfSheets(); sheetIndex++) {
                if (myWorkBook.isSheetHidden(sheetIndex)) {
                    continue; // skip hidden sheet
                }
                XSSFSheet mySheet = myWorkBook.getSheetAt(sheetIndex);
                
                String product = mySheet.getSheetName().toUpperCase().trim();
                if (!PlanCategory.isAncillary(product)) {
                	continue;
                }   
                Iterator<Row> rowIterator = mySheet.iterator();
                final Row benefitNameRow = rowIterator.next(); // skip empty row
                
                Map<Integer, String> benefitPropertyByColumn = new HashMap<>();
                for (int colIndex = NUM_OF_NETWORK_COLS; colIndex < NUM_OF_NETWORK_COLS + ANCILLARY_BENEFITS_TO_PROPERTY.size(); colIndex++) {
					String benefitName = getString(benefitNameRow, colIndex);
					if(StringUtils.isNoneBlank(benefitName)) {
						String propertyName = ANCILLARY_BENEFITS_TO_PROPERTY.get(benefitName);
						if(propertyName == null) {
							throw new IllegalArgumentException("Unknown benefit name: " + benefitName);
						}
						benefitPropertyByColumn.put(colIndex, propertyName);
					}
				}
                final Row networkNameRow = rowIterator.next(); // skip unused row
                
                Set<String> planNames = new HashSet<>();
                // Traversing over each row of XLSX file
                while (rowIterator.hasNext()) {
                    Row planRow = rowIterator.next();
                	if (isEmptyRow(planRow)) { 
                		break;
                	}
                    try {
                    	// Note: plan name always in first column, networks not supported
                    	String planName = getString(planRow, 0);
                    	if (StringUtils.isBlank(planName)) {
           				 	throw new IllegalArgumentException(String.format("Plan name is empty: product=%s, row=%s", product, planRow.getRowNum()));
                    	}
                    	// check for duplicates
            			if (planNames.contains(planName)) {
            				 throw new IllegalArgumentException("Dublicate plan name: " + planName);
            			}
            			planNames.add(planName);
            			
                    	AncillaryPlan plan = new AncillaryPlan();
                    	plan.setPlanName(planName);
                    	plan.setCarrier(carrier);
                    	plan.setPlanYear(planYear);
                    	AncillaryRate ancRate = null;
                    	if (product.startsWith("VOL_")) {
                    		ancRate = new VoluntaryRate();
                    		plan.setPlanType(AncillaryPlanType.VOLUNTARY);
                    	} else {
                    		ancRate = new BasicRate();
                    		plan.setPlanType(AncillaryPlanType.BASIC);
                    	}
                    	ancRate.setAncillaryPlan(plan);
                    	plan.setRates(ancRate);
                    	AncillaryClass ancClass = null;
                    	if (product.endsWith(PlanCategory.LIFE.name())) {
                    		ancClass = new LifeClass();
                    	} else if (product.endsWith(PlanCategory.STD.name())) {
                    		ancClass = new StdClass();
                    	} else if (product.endsWith(PlanCategory.LTD.name())) {
                    		ancClass = new LtdClass();
                    	}
                    	ancClass.setName("Class 1");
                    	ancClass.setAncillaryPlan(plan);
                    	plan.setClasses(new ArrayList<>());
                    	plan.getClasses().add(ancClass);
                    	// fill benefits
                    	Map<String, Object> ancClassProperties = new HashMap<>();
                    	benefitPropertyByColumn.forEach((column, property) -> {
                    		ancClassProperties.put(property, getString(planRow, column));
                    	});
                    	// postprocessing for some benefits
                    	String deathBenefit = (String) ancClassProperties.get("deathBenefit");
                    	String conditionExclusion = (String) ancClassProperties.get("conditionExclusion");
                    	String occupationDefinition = (String) ancClassProperties.get("occupationDefinition");
                    	String abuseLimitation = (String) ancClassProperties.get("abuseLimitation");
                    	if(deathBenefit != null) {
                    		for (String part : deathBenefit.split(" ")) {
								if (part.contains("%")) { // exmaple: "50% up to $250,000"
									// extract 50 and save to separate field
									ancClassProperties.put("percentage", part.replace("%", "").replace(",", ".").trim());
									break;
								}
							}
                    		plan.getRates().setRateGuarantee((String) ancClassProperties.get("rateGuarantee"));
                    	}
                    	if(conditionExclusion != null) {
                    		if (!StringUtils.equalsAny(conditionExclusion, "3/6", "3/12", "12/12")) {
                    			ancClassProperties.put("conditionExclusionOther", conditionExclusion);
                    			ancClassProperties.put("conditionExclusion", "Other");
                    		}
                    	}
                    	if(occupationDefinition != null) {
                    		if (StringUtils.containsIgnoreCase(occupationDefinition, "12 Months")) {
                    			occupationDefinition = "12 Months";
                    		} else if (StringUtils.containsIgnoreCase(occupationDefinition, "24 Months")) {
                    			occupationDefinition = "24 Months";
                    		} else if (StringUtils.containsIgnoreCase(occupationDefinition, "SSNRA")) {
                    			occupationDefinition = "SSNRA";
                    		} else {
                    			ancClassProperties.put("occupationDefinitionOther", occupationDefinition);
                    			occupationDefinition = "Other";
                    		}
                    		ancClassProperties.put("occupationDefinition", occupationDefinition);
                    	}
                    	if(abuseLimitation != null) {
                    		if (StringUtils.containsIgnoreCase(abuseLimitation, "12 Months")) {
                    			abuseLimitation = "12 Months";
                    		} else if (StringUtils.containsIgnoreCase(abuseLimitation, "24 Months")) {
                    			abuseLimitation = "24 Months";
                    		} else {
                    			ancClassProperties.put("abuseLimitationOther", abuseLimitation);
                    			abuseLimitation = "Other";
                    		}
                    		ancClassProperties.put("abuseLimitation", abuseLimitation);
                    	}
                    	
                    	ObjectMapperUtils.map(ancClassProperties, ancClass);
                    	
                    	// special "benefit" stored in rate object
                    	if(ancClassProperties.get("rateGuarantee") != null) {
                    		plan.getRates().setRateGuarantee((String) ancClassProperties.get("rateGuarantee"));
                    	} 

                    	plansByProduct.put(product, plan);
                    	
                    } catch (Exception e) {
                        throw new BaseException(String.format("An error occured at: product=%s, row=%s", product, planRow.getRowNum()), e);
                    }        
                }
                LOGGER.info("Loading plans for product '" + product + "' in plan upload");
            }
    	} catch (Exception e) {
             LOGGER.error("An error occurred while parsing plans for carrier " + carrier.getName(), e);
        } 
	    return (Map) plansByProduct.asMap();
	}
	
    public Map<String, List<GenericPlanDetails>> parsePlans(Carrier carrier, InputStream fis, boolean pareseRider) throws Exception {

        //
        // Finds the workbook instance for XLSX file
        batchNumber = planHistoryHelper.getNextBatchNumber();
        XSSFWorkbook myWorkBook = new XSSFWorkbook (fis);
        evaluator = myWorkBook.getCreationHelper().createFormulaEvaluator();
        cfEvaluator = new ConditionalFormattingEvaluator(myWorkBook, (WorkbookEvaluatorProvider) evaluator);

        ArrayListValuedHashMap<String, GenericPlanDetails> planDetailsByProduct = new ArrayListValuedHashMap<>();
        try {
            /**********************************************
             * Set up all the pieces required
             **********************************************/

            //get all the networks for carrier
            List<Network> carrierNetworks = networkRepository.findByCarrierCarrierId(carrier.getCarrierId());
            if(null == carrierNetworks || 0 == carrierNetworks.size()) {
                LOGGER.error("No networks found in DB for carrier "+ carrier.getName() +", this should be loaded as part of the static data.");
                return Collections.emptyMap();
            }

            //get all the benefits allowed
            benefitNames = benefitNameRepository.findAll();
            if(null == benefitNames || 0 == benefitNames.size()) {
                LOGGER.error("No benefits found in the system, they should be loaded as part of the static data.");
                return Collections.emptyMap();
            }

            /**********************************************
             * Parse the document and load plans by product
             **********************************************/
            List<Network> fileNetworkList = null;

            // Walk through all the sheets
            for (int sheetIndex= 0; sheetIndex < myWorkBook.getNumberOfSheets(); sheetIndex++) {

                if (myWorkBook.isSheetHidden(sheetIndex)) {
                    // skip hidden sheet
                    continue;
                }
                XSSFSheet mySheet = myWorkBook.getSheetAt(sheetIndex);
                String product = mySheet.getSheetName().trim();

                if(!isValidProduct(product)) {
                    LOGGER.error("ROLLBACK + EXIT: Unknown product tab found in plan portfolio: '" + product + "'");
                    return Collections.emptyMap();
                }

                if(!doUploadForProduct(product)) {
                    LOGGER.info("Skipping product '"+ product +"' for plan upload.");
                    continue;
                }
                LOGGER.info("Loading plans for product '"+ product +"' in plan upload.");

                int rowNum = 0;
                // Get iterator to all the rows in current sheet
                Iterator<Row> rowIterator = mySheet.iterator();

                //burn the first row, empty space
                rowNum++;
                rowIterator.next();

                // Parser riders differently then plans.
                if(product.equals(HMO_RIDER) || product.equals(PPO_RIDER)) {
                    // TODO extract to parseRider() method
                    if (pareseRider) {
                        parseAndSaveRider(rowIterator, rowNum, carrier, product);
                    }
                    continue;
                }

                String defaultNetwork = null;
                if (!CarrierType.isCarrierNameOnboardedAppCarrier(carrier.getName())) {
                    // non-connected carriers
                    //defaultNetwork = product;
                    if ("RX_PPO".equals(product)) {
                        defaultNetwork = "PPO";
                    } else if ("RX_HMO".equals(product)) {
                        defaultNetwork = "HMO";
                    }
                }
                //and create the network list in the file with the second
                rowNum++;
                fileNetworkList = prepareNetworkList(carrierNetworks, product, rowIterator.next(), defaultNetwork);

                Set<String> planNames = new HashSet<>();

                // Traversing over each row of XLSX file
                while (rowIterator.hasNext()) {
                	Row planRow = rowIterator.next();
                	if (isEmptyRow(planRow)) { 
                		break;
                	}
                    rowNum++;

                    try {
                        GenericPlanDetails planDetails = getPlanDetails(rowNum, carrier, product, planRow, fileNetworkList);
                        if (planDetails == null) {
                            LOGGER.error("Skipping row number " + rowNum + " for product " + product + " there was an unknown issues creating Generic Plan Details.");
                            continue;
                        }

                        if(planDetails.getPlanNamesByNetwork().size() != 0){
                            // skip empty row plans
                            planDetailsByProduct.put(product, planDetails);
                            // check for duplicates
                            for (String planNameByNetworkName : planDetails.getPlanNamesByNetwork().keySet()) {
                                if (!planNames.add(planNameByNetworkName)) {
                                    throw new IllegalArgumentException("Duplicate planNameByNetwork name: " + planNameByNetworkName);
                                }
                            }
                        }
                    } catch (Exception e) {
                        throw new BaseException(String.format("An error occurred at: product=%s, row=%s", product, rowNum), e);
                    }

                    //bulk updates to plans if needed
                    //updatePlanFromDetails(carrier, product, planDetails);
                    // FIXME not here: parsePlans read only. Move to savePlans()
                }
            }
            System.out.println("Plans for carrier "+ carrier.getName() +" have been successfully parsed.");
        } catch (Exception e) {
            LOGGER.error("An error occurred while parsing plans for carrier " + carrier.getName(), e);
        } finally {
            if(benefitNames != null) {
                benefitNames.clear();
            }
            evaluator = null;
            cfEvaluator = null;
            myWorkBook.close();
        }
        return (Map) planDetailsByProduct.asMap();
    }
    
    private boolean isEmptyRow(Row row) {
    	for(int index = 0; index < NUM_OF_NETWORK_COLS; index++) {
            String planName = getString(row, index);
            if(StringUtils.isNotBlank(planName)) { 
               return false;
            }
        }
    	return true;
    }

    private void parseAndSaveRider(Iterator<Row> rowIterator, int rowNum, Carrier carrier, String product) {

        String type = "";
        if(product.equals(HMO_RIDER)) {
            type = "HMO";
        } else if (product.equals(PPO_RIDER)){
            type = "PPO";
        } else {
            throw new IllegalArgumentException("Rider with type '" + product + "' was found in plan design, only HMO or PPO allowed.");
        }

        // Traversing over each row of XLSX file
        while (rowIterator.hasNext()) {
            rowNum++;
            Row row = rowIterator.next();

            String code = getString(row, 0);
            String description = getString(row, 1);
            String category = getString(row, 2);

            List<RiderMeta> existingRiderMetas = riderMetaRepository.findByCodeAndPlanType(code, type);

            if(existingRiderMetas.isEmpty()) {
                RiderMeta existingRiderMeta = new RiderMeta();
                existingRiderMeta.setCode(code);
                existingRiderMeta.setDescription(description);
                existingRiderMeta.setCategory(category);
                existingRiderMeta.setPlanType(type);

                if(carrier.getName().equals(Constants.ANTHEM_CARRIER)) {
                    existingRiderMeta.setSelectable(true);
                } else {
                    existingRiderMeta.setSelectable(false);
                }

                riderMetaRepository.save(existingRiderMeta);
            } else {
                if(existingRiderMetas.size() != 1) {
                    throw new BaseException("Found more than  one RiderMeta by code and plan type")
                        .withFields(field("code", code), field("plan_type", type));
                }
                RiderMeta existingRiderMeta = existingRiderMetas.get(0);

                String oldBenefit = planHistoryHelper.gson.toJson(existingRiderMeta);

                if(existingRiderMeta.getCategory().equalsIgnoreCase(category)
                    && existingRiderMeta.getCode().equalsIgnoreCase(code)
                    && existingRiderMeta.getDescription().equalsIgnoreCase(description)){
                    continue;
                }

                existingRiderMeta.setDescription(description);
                existingRiderMeta.setCategory(category);
                existingRiderMeta = riderMetaRepository.save(existingRiderMeta);
                String newBenefit = planHistoryHelper.gson.toJson(existingRiderMeta);
                planHistoryHelper.addRiderHistory(batchNumber, existingRiderMeta, oldBenefit, newBenefit);
            }

        }
    }

    private boolean isValidProduct(String product) {
        return product.equals(HMO) || product.equals(PPO) || product.equals(HSA) ||
            product.equals(RX_HMO) || product.equals(RX_PPO) ||
            product.equals(DHMO) || product.equals(DPPO) || product.equals(VISION) ||
            product.equals(HMO_RIDER) || product.equals(PPO_RIDER);
    }

    private List<Network> prepareNetworkList(List<Network> carrierNetworks, String product, Row row, String defaultNetworkName) throws IllegalArgumentException {

        List<Network> networkList = new ArrayList<>();

        //First x columns of the second row are reserved for network names (could be null)
        for(int index = 0; index < NUM_OF_NETWORK_COLS; index++) {
            String networkName = getString(row, index).trim();
            if(null == networkName || networkName.isEmpty()) { // we find an empty col we are done
                if(0 == index) {
                    throw new InvalidArgumentException("There are no networks included in the first 4 cols of row two for " + product);
                }
                break;
            }
            Network validNetwork = findValidNetworkByName(carrierNetworks, product, defaultNetworkName == null ? networkName : defaultNetworkName);
            networkList.add(validNetwork);
        }
        return networkList;
    }

    private Network findValidNetworkByName(List<Network> carrierNetworks, String product, String networkName) {
        for(Network n : carrierNetworks) {
            if(n.getType().equals(product) && (n.getName().equals(networkName) || n.getName().indexOf(networkName) != -1)
                // hardcoding vision network name
                || (product.equalsIgnoreCase("VISION") && n.getName().equals("VPPO Network"))){
                return n;
            }
        }
        throw new IllegalArgumentException("Invalid network name was provided for plans in '" + product + "'. Network does not exist: " + networkName);
    }

    private GenericPlanDetails getPlanDetails(int rowNum, Carrier carrier, String product, Row row, List<Network> networkList) throws Exception {
        //if (!isValidRow(rowNum, planType)) return null;

        GenericPlanDetails details = new GenericPlanDetails();

        //Add the name of the plan for each network we have in the list
        for(int index = 0; index < networkList.size(); index++) {
            details.addIfValidPlanNameByNetwork(networkList.get(index), getString(row, index).trim());
        }

        if(details.getPlanNamesByNetwork().size() == 0){
            // skip
            return details;
        }

        //parse out product specific fields from the row
        if (product.equals(HMO)) {
            parseHmo(row, details);

            //Rx is included in the actual plan
            if (StringUtils.equalsAny(carrier.getName(),
                Constants.ANTHEM_CARRIER,
                Constants.ANTHEM_CLEAR_VALUE_CARRIER,
                CarrierType.CIGNA.name(),
                CarrierType.KAISER.name())) {
                parseRx(row, details, NUM_OF_NETWORK_COLS + 12);
            }
        } else if (product.equals(PPO) || product.equals(HSA)) {
            parsePpo(row, details);
            //Rx is included in the actual plan
            if(StringUtils.equalsAny(carrier.getName(),
                Constants.ANTHEM_CARRIER,
                Constants.ANTHEM_CLEAR_VALUE_CARRIER,
                CarrierType.CIGNA.name(),
                CarrierType.KAISER.name())) {
                parseRx(row, details, NUM_OF_NETWORK_COLS + 21);
            }
        } else if(product.equals(DPPO)) {
            parseDppo(row, details);
        } else if(product.equals(DHMO)) {
            parseDhmo(row, details);
        } else if(product.equals("VISION")) {
            parseVision(row, details);
        } else if(product.startsWith("RX_")) {
            parseRx(row, details, NUM_OF_NETWORK_COLS);
        }

        //validation, we should have something in the beenfit list
        if(0 == details.getBenefits().size()) {
            throw new ParseException("Could not find any benefits to parse in " + product + " row number " + rowNum + ": " + row.toString(), rowNum);
        }

        return details;
    }

    private void parseHmo(Row row, GenericPlanDetails details) {
        //List<String> values = benefitUtil.splitBenefits(getString(row, NUM_OF_NETWORK_COLS + 0));
        //details.addBenefit(benefitNames, "INDIVIDUAL_DEDUCTIBLE", "IN", values.get(0));
        //details.addBenefit(benefitNames, "FAMILY_DEDUCTIBLE", "IN", values.get(1));
        // TODO: put back splitting of benefits once UI has accounted for new benefits.
        details.addBenefit(benefitNames, "INDIVIDUAL_DEDUCTIBLE", "IN", getString(row, NUM_OF_NETWORK_COLS + 0));

        //values = benefitUtil.splitBenefits(getString(row, NUM_OF_NETWORK_COLS + 1));
        //details.addBenefit(benefitNames, "INDIVIDUAL_OOP_LIMIT", "IN", values.get(0));
        //details.addBenefit(benefitNames, "FAMILY_OOP_LIMIT", "IN", values.get(1));
        // TODO: put back splitting of benefits once UI has accounted for new benefits.
        details.addBenefit(benefitNames, "INDIVIDUAL_OOP_LIMIT", "IN", getString(row, NUM_OF_NETWORK_COLS + 1));

        details.addBenefit(benefitNames, "PCP", "IN", getString(row, NUM_OF_NETWORK_COLS + 2));
        details.addBenefit(benefitNames, "SPECIALIST", "IN", getString(row, NUM_OF_NETWORK_COLS + 3));
        details.addBenefit(benefitNames, "EMERGENCY_ROOM", "IN", getString(row, NUM_OF_NETWORK_COLS + 4));
        details.addBenefit(benefitNames, "URGENT_CARE", "IN", getString(row, NUM_OF_NETWORK_COLS + 5));
        details.addBenefit(benefitNames, "INPATIENT_HOSPITAL", "IN", getString(row, NUM_OF_NETWORK_COLS + 6));
        details.addBenefit(benefitNames, "IP_COPAY_MAX", "IN", getString(row, NUM_OF_NETWORK_COLS + 7));
        details.addBenefit(benefitNames, "IP_COPAY_TYPE", "IN", getString(row, NUM_OF_NETWORK_COLS + 8));
        details.addBenefit(benefitNames, "OUTPATIENT_SURGERY", "IN", getString(row, NUM_OF_NETWORK_COLS + 9));
        details.addBenefit(benefitNames, "DEDUCTIBLE_TYPE", "IN", getString(row, NUM_OF_NETWORK_COLS + 10));
        details.addBenefit(benefitNames, "COMBINE_MED_RX_DEDUCTIBLE", "IN", getString(row, NUM_OF_NETWORK_COLS + 11));
    }

    private void parsePpo(Row row, GenericPlanDetails details) {
        details.addBenefit(benefitNames, "CO_INSURANCE", "IN", getString(row, NUM_OF_NETWORK_COLS + 0));
        details.addBenefit(benefitNames, "CO_INSURANCE", "OUT", getString(row, NUM_OF_NETWORK_COLS + 1));

        //List<String> values = benefitUtil.splitBenefits(getString(row, NUM_OF_NETWORK_COLS + 2));
        //details.addBenefit(benefitNames, "INDIVIDUAL_DEDUCTIBLE", "IN", values.get(0));
        //details.addBenefit(benefitNames, "FAMILY_DEDUCTIBLE", "IN", values.get(1));
        // TODO: put back splitting of benefits once UI has accounted for new benefits.
        details.addBenefit(benefitNames, "INDIVIDUAL_DEDUCTIBLE", "IN", getString(row, NUM_OF_NETWORK_COLS + 2));

        //values = benefitUtil.splitBenefits(getString(row, NUM_OF_NETWORK_COLS + 3));
        //details.addBenefit(benefitNames, "INDIVIDUAL_DEDUCTIBLE", "OUT", values.get(0));
        //details.addBenefit(benefitNames, "FAMILY_DEDUCTIBLE", "OUT", values.get(1));
        // TODO: put back splitting of benefits once UI has accounted for new benefits.
        details.addBenefit(benefitNames, "INDIVIDUAL_DEDUCTIBLE", "OUT", getString(row, NUM_OF_NETWORK_COLS + 3));

        details.addBenefit(benefitNames, "DEDUCTIBLE_TYPE", "IN", getString(row, NUM_OF_NETWORK_COLS + 4));
        details.addBenefit(benefitNames, "COMBINE_MED_RX_DEDUCTIBLE", "IN", getString(row, NUM_OF_NETWORK_COLS + 5));

        //values = benefitUtil.splitBenefits(getString(row, NUM_OF_NETWORK_COLS + 6));
        //details.addBenefit(benefitNames, "INDIVIDUAL_OOP_LIMIT", "IN", values.get(0));
        //details.addBenefit(benefitNames, "FAMILY_OOP_LIMIT", "IN", values.get(1));
        // TODO: put back splitting of benefits once UI has accounted for new benefits.
        details.addBenefit(benefitNames, "INDIVIDUAL_OOP_LIMIT", "IN", getString(row, NUM_OF_NETWORK_COLS + 6));

        //values = benefitUtil.splitBenefits(getString(row, NUM_OF_NETWORK_COLS + 7));
        //details.addBenefit(benefitNames, "INDIVIDUAL_OOP_LIMIT", "OUT", values.get(0));
        //details.addBenefit(benefitNames, "FAMILY_OOP_LIMIT", "OUT", values.get(1));
        // TODO: put back splitting of benefits once UI has accounted for new benefits.
        details.addBenefit(benefitNames, "INDIVIDUAL_OOP_LIMIT", "OUT", getString(row, NUM_OF_NETWORK_COLS + 7));

        details.addBenefit(benefitNames, "PCP", "IN", getString(row, NUM_OF_NETWORK_COLS + 8));
        details.addBenefit(benefitNames, "PCP", "OUT", getString(row, NUM_OF_NETWORK_COLS + 9));
        details.addBenefit(benefitNames, "SPECIALIST", "IN", getString(row, NUM_OF_NETWORK_COLS + 10));
        details.addBenefit(benefitNames, "SPECIALIST", "OUT", getString(row, NUM_OF_NETWORK_COLS + 11));
        details.addBenefit(benefitNames, "EMERGENCY_ROOM", "IN", getString(row, NUM_OF_NETWORK_COLS + 12));
        details.addBenefit(benefitNames, "EMERGENCY_ROOM", "OUT", getString(row, NUM_OF_NETWORK_COLS + 13));

        // TODO: put back splitting of benefits once UI has accounted for new benefits.
        //details.addBenefit(benefitNames, "URGENT_CARE", "IN", getString(row, NUM_OF_NETWORK_COLS + 14));
        //details.addBenefit(benefitNames, "URGENT_CARE", "OUT", getString(row, NUM_OF_NETWORK_COLS + 15));

        details.addBenefit(benefitNames, "INPATIENT_HOSPITAL", "IN", getString(row, NUM_OF_NETWORK_COLS + 16));
        details.addBenefit(benefitNames, "INPATIENT_HOSPITAL", "OUT", getString(row, NUM_OF_NETWORK_COLS + 17));
        details.addBenefit(benefitNames, "IP_PER_OCCURENCE_DEDUCTIBLE", "IN", getString(row, NUM_OF_NETWORK_COLS + 18));
        details.addBenefit(benefitNames, "OUTPATIENT_SURGERY", "IN", getString(row, NUM_OF_NETWORK_COLS + 19));
        details.addBenefit(benefitNames, "OUTPATIENT_SURGERY", "OUT", getString(row, NUM_OF_NETWORK_COLS + 20));
    }

    private void parseDppo(Row row, GenericPlanDetails details) {
        details.addBenefit(benefitNames, "CALENDAR_YEAR_MAXIMUM", "IN", getString(row, NUM_OF_NETWORK_COLS + 0));
        details.addBenefit(benefitNames, "CALENDAR_YEAR_MAXIMUM", "OUT", getString(row, NUM_OF_NETWORK_COLS + 1));
        details.addBenefit(benefitNames, "INDIVIDUAL_DEDUCTIBLE", "IN", getString(row, NUM_OF_NETWORK_COLS + 2));
        details.addBenefit(benefitNames, "INDIVIDUAL_DEDUCTIBLE", "OUT", getString(row, NUM_OF_NETWORK_COLS + 3));
        details.addBenefit(benefitNames, "WAIVED_FOR_PREVENTIVE", "IN", getString(row, NUM_OF_NETWORK_COLS + 4));
        details.addBenefit(benefitNames, "WAIVED_FOR_PREVENTIVE", "OUT", getString(row, NUM_OF_NETWORK_COLS + 5));
        details.addBenefit(benefitNames, "CLASS_1_PREVENTIVE", "IN", getString(row, NUM_OF_NETWORK_COLS + 6));
        details.addBenefit(benefitNames, "CLASS_1_PREVENTIVE", "OUT", getString(row, NUM_OF_NETWORK_COLS + 7));
        details.addBenefit(benefitNames, "CLASS_2_BASIC", "IN", getString(row, NUM_OF_NETWORK_COLS + 8));
        details.addBenefit(benefitNames, "CLASS_2_BASIC", "OUT", getString(row, NUM_OF_NETWORK_COLS + 9));
        details.addBenefit(benefitNames, "CLASS_3_MAJOR", "IN", getString(row, NUM_OF_NETWORK_COLS + 10));
        details.addBenefit(benefitNames, "CLASS_3_MAJOR", "OUT", getString(row, NUM_OF_NETWORK_COLS + 11));
        details.addBenefit(benefitNames, "CLASS_4_ORTHODONTIA", "IN", getString(row, NUM_OF_NETWORK_COLS + 12));
        details.addBenefit(benefitNames, "CLASS_4_ORTHODONTIA", "OUT", getString(row, NUM_OF_NETWORK_COLS + 13));
        details.addBenefit(benefitNames, "ORTHODONTIA_LIFETIME_MAX", "IN", getString(row, NUM_OF_NETWORK_COLS + 14));
        details.addBenefit(benefitNames, "ORTHODONTIA_LIFETIME_MAX", "OUT", getString(row, NUM_OF_NETWORK_COLS + 15));
        details.addBenefit(benefitNames, "ORTHO_ELIGIBILITY", "IN", getString(row, NUM_OF_NETWORK_COLS + 16));
        details.addBenefit(benefitNames, "ORTHO_ELIGIBILITY", "OUT", getString(row, NUM_OF_NETWORK_COLS + 17));
        details.addBenefit(benefitNames, "REIMBURSEMENT_SCHEDULE", "IN", getString(row, NUM_OF_NETWORK_COLS + 18));
        details.addBenefit(benefitNames, "IMPLANT_COVERAGE", "IN", getString(row, NUM_OF_NETWORK_COLS + 19));
    }

    private void parseRx(Row row, GenericPlanDetails details, int offset) {
        details.addBenefit(benefitNames, "MAIL_ORDER", "IN", getString(row, offset + 0));
        details.addBenefit(benefitNames, "RX_INDIVIDUAL_DEDUCTIBLE", "IN", getString(row, offset + 1));
        details.addBenefit(benefitNames, "RX_FAMILY_DEDUCTIBLE", "IN", getString(row, offset + 2));
        details.addBenefit(benefitNames, "MEMBER_COPAY_TIER_1", "IN", getString(row, offset + 3));
        details.addBenefit(benefitNames, "MEMBER_COPAY_TIER_2", "IN", getString(row, offset + 4));
        details.addBenefit(benefitNames, "MEMBER_COPAY_TIER_3", "IN", getString(row, offset + 5));
        details.addBenefit(benefitNames, "MEMBER_COPAY_TIER_4", "IN", getString(row, offset + 6));
    }

    private void parseVision(Row row, GenericPlanDetails details) {
        details.addBenefit(benefitNames, "EXAMS_FREQUENCY", "IN", getString(row, NUM_OF_NETWORK_COLS + 0));
        details.addBenefit(benefitNames, "LENSES_FREQUENCY", "IN", getString(row, NUM_OF_NETWORK_COLS + 1));
        details.addBenefit(benefitNames, "FRAMES_FREQUENCY", "IN", getString(row, NUM_OF_NETWORK_COLS + 2));
        details.addBenefit(benefitNames, "CONTACTS_FREQUENCY", "IN", getString(row, NUM_OF_NETWORK_COLS + 3));
        details.addBenefit(benefitNames, "EXAM_COPAY", "IN", getString(row, NUM_OF_NETWORK_COLS + 4));
        details.addBenefit(benefitNames, "MATERIALS_COPAY", "IN", getString(row, NUM_OF_NETWORK_COLS + 5));
        details.addBenefit(benefitNames, "FRAME_ALLOWANCE", "IN", getString(row, NUM_OF_NETWORK_COLS + 6));
        details.addBenefit(benefitNames, "CONTACTS_ALLOWANCE", "IN", getString(row, NUM_OF_NETWORK_COLS + 7));
    }

    private void parseDhmo(Row row, GenericPlanDetails details) {
        details.addBenefit(benefitNames, "ORAL_EXAMINATION", "IN", getString(row, NUM_OF_NETWORK_COLS + 0));
        details.addBenefit(benefitNames, "ADULT_PROPHY", "IN", getString(row, NUM_OF_NETWORK_COLS + 1));
        details.addBenefit(benefitNames, "CHILD_PROPHY", "IN", getString(row, NUM_OF_NETWORK_COLS + 2));
        details.addBenefit(benefitNames, "SILVER_FILL_1_SURFACE", "IN", getString(row, NUM_OF_NETWORK_COLS + 3));
        details.addBenefit(benefitNames, "WHITE_FILL_1_SURFACE_ANTERIOR", "IN", getString(row, NUM_OF_NETWORK_COLS + 4));
        details.addBenefit(benefitNames, "MOLAR_ROOT_CANAL", "IN", getString(row, NUM_OF_NETWORK_COLS + 5));
        details.addBenefit(benefitNames, "PERIO_MAINTAINANCE", "IN", getString(row, NUM_OF_NETWORK_COLS + 6));
        details.addBenefit(benefitNames, "SIMPLE_EXTRACTION_ERUPTED_TOOTH", "IN", getString(row, NUM_OF_NETWORK_COLS + 7));
        details.addBenefit(benefitNames, "ORTHO_SERVICES_ADULTS", "IN", getString(row, NUM_OF_NETWORK_COLS + 8));
        details.addBenefit(benefitNames, "ORTHO_SERVICES_CHILDREN", "IN", getString(row, NUM_OF_NETWORK_COLS + 9));
    }

    private String getString(Row row, int col) {
        return formatter.formatCellValue(row.getCell(col), evaluator, cfEvaluator);
    }

}
