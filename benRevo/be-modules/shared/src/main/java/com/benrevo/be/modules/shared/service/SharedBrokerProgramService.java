package com.benrevo.be.modules.shared.service;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.DHMO;
import static com.benrevo.common.Constants.DPPO;
import static com.benrevo.common.Constants.HMO;
import static com.benrevo.common.Constants.HSA;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.METLIFE_DENTAL_CLSA_DISCLAIMER;
import static com.benrevo.common.Constants.METLIFE_VISION_CLSA_DISCLAIMER;
import static com.benrevo.common.Constants.PPO;
import static com.benrevo.common.Constants.RX_HMO;
import static com.benrevo.common.Constants.RX_HSA;
import static com.benrevo.common.Constants.RX_PPO;
import static com.benrevo.common.Constants.UHC_CLSA_DISCLAIMER;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.longValue;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.floatValue;
import static com.benrevo.common.util.ObjectMapperUtils.map;
import static org.apache.commons.lang3.StringUtils.equalsAny;
import static org.apache.commons.lang3.StringUtils.equalsAnyIgnoreCase;
import static org.springframework.web.util.HtmlUtils.htmlEscape;
import static com.benrevo.common.enums.PlanCategory.*;
import static java.lang.Integer.parseUnsignedInt;
import static java.lang.Long.compare;
import static java.util.Objects.isNull;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.equalsAny;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.springframework.web.util.HtmlUtils.htmlEscape;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.CreateProgramQuoteDto;
import com.benrevo.common.dto.ProgramDto;
import com.benrevo.common.dto.RfpCarrierDto;
import com.benrevo.common.dto.RfpQuoteDto;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.PlanRateType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.enums.RiderMetaType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.ClientLocaleUtils;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.PlanRate;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.ProgramToPnn;
import com.benrevo.data.persistence.entities.QuoteOption;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkCombination;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteVersion;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.entities.RiderMeta;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.ProgramToAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import com.benrevo.data.persistence.mapper.MapperUtil;
import com.benrevo.data.persistence.repository.BrokerProgramAccessRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRateRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.ProgramToPnnRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkCombinationRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpQuoteVersionRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.RiderMetaRepository;
import com.benrevo.data.persistence.repository.RiderRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.ProgramToAncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryOptionRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpQuoteAncillaryPlanRepository;
import com.google.common.base.Objects;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SharedBrokerProgramService {

    public static final String ANTHEM_PLAN_APPLICABLE_RIDER_CODE = "$15 Chiro";
    public static final String ANTHEM_RIDER_APPLICABLE_PLAN_NAME = "T-Premier HMO 10/100A/50OP";

    private final String DEFAULT_HMO_PLAN_NAME = "HMO 10/0 (U8M/4PJ)";
    private final String DEFAULT_PPO_PLAN_NAME = "PPO 250/10 (AB6G/242)";
    private final String DEFAULT_HSA_PLAN_NAME = "PPO w/HSA 1500/10 (ULR/0C2)";
    private final String DEFAULT_RX_HMO_PLAN_NAME = "Advantage (4PJ)";
    private final String DEFAULT_RX_PPO_PLAN_NAME = "Advantage (242)";
    private final String DEFAULT_RX_HSA_PLAN_NAME = "Advantage (0C2)";
    private final String DEFAULT_DHMO_PLAN_NAME = "No CLSA Plan";
    private final String DEFAULT_DPPO_PLAN_NAME = "Option 1 - $1500 100/80/50 w/Ortho";
    private final String DEFAULT_VPPO_PLAN_NAME = "VISPLAN1 - M130D-10/25";
    private final String DEFAULT_LIFE_PLAN_NAME_PREFIX = "Option 1";
    private final String DEFAULT_VOL_LIFE_PLAN_NAME_PREFIX = "Option 4";
    private final String DEFAULT_STD_PLAN_NAME_PREFIX = "Option 1";
    private final String DEFAULT_LTD_PLAN_NAME_PREFIX = "Option 1";
    
    @Autowired
    protected BrokerProgramAccessRepository brokerProgramAccessRepository;

    @Autowired
    protected SharedCarrierService sharedCarrierService; 

    @Autowired
    protected BrokerRepository brokerRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;

    @Autowired
    private ClientLocaleUtils clientLocaleUtils;

    @Autowired
    private ProgramToPnnRepository programToPnnRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private PlanNameByNetworkRepository pnnRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteVersionRepository rfpQuoteVersionRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private PlanRateRepository planRateRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private RfpQuoteNetworkCombinationRepository rfpQuoteNetworkCombinationRepository;

    @Autowired
    private RiderMetaRepository riderMetaRepository;

    @Autowired
    private RiderRepository riderRepository;
    
    @Autowired
    private ProgramToAncillaryPlanRepository programToAncillaryPlanRepository;
    
    @Autowired
    private RfpQuoteAncillaryPlanRepository rfpQuoteAncillaryPlanRepository;
    
    @Autowired
    private RfpQuoteAncillaryOptionRepository rfpQuoteAncillaryOptionRepository;
    
    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;
    
    @Autowired
    private AncillaryPlanRepository ancillaryPlanRepository;
    
    @Autowired
    private AdministrativeFeeService administrativeFeeService;
    
    public static String getEmployeeBandRateValue(Integer numEligibleEmployees) {
        if(numEligibleEmployees == null) {
            return null;
        } else if (numEligibleEmployees >= 2 && numEligibleEmployees <= 9) {
            return "2-9";
        } else if (numEligibleEmployees >= 10 && numEligibleEmployees <= 24) {
            return "10-24";
        } else if (numEligibleEmployees >= 25 && numEligibleEmployees <= 49) {
            return "25-49";
        } else if (numEligibleEmployees >= 50) {
            return "50-99";
        }
        return null;
    }

    // Placed here because current mapping looks like API specific and will not be used somewhere else
    public static final Map<String, String> REGION_CODES = new HashMap<>(128);
    static {
        REGION_CODES.put("900", "3");
        REGION_CODES.put("901", "4");
        REGION_CODES.put("902", "4");
        REGION_CODES.put("903", "4");
        REGION_CODES.put("904", "4");
        REGION_CODES.put("905", "3");
        REGION_CODES.put("906", "4");
        REGION_CODES.put("907", "3");
        REGION_CODES.put("908", "3");
        REGION_CODES.put("910", "4");
        REGION_CODES.put("911", "3");
        REGION_CODES.put("912", "4");
        REGION_CODES.put("913", "3");
        REGION_CODES.put("914", "4");
        REGION_CODES.put("915", "4");
        REGION_CODES.put("916", "4");
        REGION_CODES.put("917", "3");
        REGION_CODES.put("918", "4");
        REGION_CODES.put("919", "2");
        REGION_CODES.put("920", "1");
        REGION_CODES.put("921", "2");
        REGION_CODES.put("922", "2");
        REGION_CODES.put("923", "2");
        REGION_CODES.put("924", "2");
        REGION_CODES.put("925", "2");
        REGION_CODES.put("926", "3");
        REGION_CODES.put("927", "3");
        REGION_CODES.put("928", "3");
        REGION_CODES.put("930", "2");
        REGION_CODES.put("931", "3");
        REGION_CODES.put("932", "1");
        REGION_CODES.put("933", "1");
        REGION_CODES.put("934", "2");
        REGION_CODES.put("935", "2");
        REGION_CODES.put("936", "1");
        REGION_CODES.put("937", "1");
        REGION_CODES.put("939", "3");
        REGION_CODES.put("940", "3");
        REGION_CODES.put("941", "4");
        REGION_CODES.put("942", "5");
        REGION_CODES.put("943", "5");
        REGION_CODES.put("944", "5");
        REGION_CODES.put("945", "4");
        REGION_CODES.put("946", "4");
        REGION_CODES.put("947", "3");
        REGION_CODES.put("948", "5");
        REGION_CODES.put("949", "4");
        REGION_CODES.put("950", "4");
        REGION_CODES.put("951", "4");
        REGION_CODES.put("952", "3");
        REGION_CODES.put("953", "3");
        REGION_CODES.put("954", "3");
        REGION_CODES.put("955", "5");
        REGION_CODES.put("956", "1");
        REGION_CODES.put("957", "2");
        REGION_CODES.put("958", "2");
        REGION_CODES.put("959", "2");
        REGION_CODES.put("960", "3");
        REGION_CODES.put("961", "3");
    }

    public String getAverageAgeGroup(Integer avgAge){
        if(avgAge == null) {
            return null;
        } else if (avgAge >= 0 && avgAge <= 33) {
            return "A";
        } else if (avgAge >= 34 && avgAge <= 43) {
            return "B";
        } else if (avgAge >= 44 && avgAge <= 53) {
            return "C";
        } else if (avgAge >= 54) {
            return "D";
        }

        return null;
    }

    public static String getRegionCodeByZip(String zipCode) {
        if(zipCode == null || zipCode.length() < 3) {
            return null;
        }
        return REGION_CODES.get(zipCode.substring(0, 3));
    }
    
    public List<ProgramDto> getBrokerPrograms(Long brokerId) {
        Broker currentBroker = brokerRepository.findOne(brokerId);
        
        List<Program> programs = brokerProgramAccessRepository.findProgramsByBrokerId(currentBroker.getBrokerId());
        
        List<ProgramDto> result = new ArrayList<>();
        
        for(Program program : programs) {
            ProgramDto dto = new ProgramDto();
            dto.setName(program.getName());
            dto.setProgramId(program.getProgramId());
            dto.setDescription(program.getDescription());
            dto.setRfpCarrier(mapToDto(program.getRfpCarrier()));
            result.add(dto);
        }
        return result;  
    }

    private RfpCarrierDto mapToDto(RfpCarrier rfpCarrier) {
        RfpCarrierDto dto = map(rfpCarrier, RfpCarrierDto.class);
        dto.getCarrier().setLogoUrl(sharedCarrierService.getLogoUrl(dto.getCarrier().getName()));
        dto.getCarrier().setOriginalImageUrl(SharedCarrierService.getOriginalImageUrl(dto.getCarrier().getName()));
        return dto;
    }

    public RfpQuote createQuotes(CreateProgramQuoteDto createParams) {
        Program program = programRepository.findOne(createParams.getProgramId());
        if(program == null) {
            throw new BaseException("Program by id not found").withFields(field("program_id", createParams.getProgramId()));
        }
        PlanCategory planCategory =  PlanCategory.valueOf(program.getRfpCarrier().getCategory());
        
        List<PlanRate> rates = null;
        List<ProgramToAncillaryPlan> programPlans = null;
        if(planCategory.isAncillary()) {
        	Client client = clientRepository.findOne(createParams.getClientId());
        	int getEffectiveYear;
        	if (program.getName().equals(Constants.CLSA_TRUST_PROGRAM)) {
        		getEffectiveYear = Integer.parseUnsignedInt(getCLSARateYear(client.getEffectiveDate()));
        	} else {
        		getEffectiveYear = client.getEffectiveYear();
        	}
        	programPlans = programToAncillaryPlanRepository.findByProgramIdAndAncillaryPlanPlanYear(
        			program.getProgramId(), getEffectiveYear);
        	if(programPlans.isEmpty()) {
        		return null;
        	}
        } else {
        	rates = findPlanRates(program, createParams);
            if(rates.isEmpty()) {
                return null;
            }
        }

        QuoteType quoteType;
        String disclaimer = null;
        if(program.getName().equalsIgnoreCase(Constants.TECH_TRUST_PROGRAM)) {
            quoteType = QuoteType.TECHNOLOGY_TRUST_PROGRAM;
        } else if(program.getName().equalsIgnoreCase(Constants.BEYOND_BENEFITS_TRUST_PROGRAM)) {
            quoteType = QuoteType.BEYOND_BENEFIT_TRUST_PROGRAM;
        } else if(program.getName().equalsIgnoreCase(Constants.CLSA_TRUST_PROGRAM)) {
            quoteType = QuoteType.CLSA_TRUST_PROGRAM;
            disclaimer = getCLSADisclaimer(program);
        } else {
            throw new BaseException("Unsupported Trust program name: " + program.getName());
        }

        RfpQuote previousQuote = rfpQuoteRepository.findByRfpSubmissionProgramProgramIdAndRfpSubmissionClientClientIdAndLatestIsTrueAndQuoteType(
            createParams.getProgramId(), createParams.getClientId(), quoteType);
        if(previousQuote == null) {
            previousQuote = rfpQuoteRepository.findByRfpSubmissionProgramProgramIdAndRfpSubmissionClientClientIdAndLatestIsTrueAndQuoteType(
                createParams.getProgramId(), createParams.getClientId(), QuoteType.DECLINED);
        }

        RfpSubmission rfpSubmission = rfpSubmissionRepository.findByProgramAndClient(
            program, MapperUtil.clientFromId(createParams.getClientId()));
        if(rfpSubmission == null){
            throw new NotFoundException("No RFP Submission found")
                .withFields(field("program_id", createParams.getProgramId()),
                    field("client_id", createParams.getClientId()));
        }
        RfpQuoteVersion rfpQuoteVersion = new RfpQuoteVersion();
        rfpQuoteVersion.setRfpSubmissionId(rfpSubmission.getRfpSubmissionId());
        rfpQuoteVersionRepository.save(rfpQuoteVersion);

        PlanCategory category = PlanCategory.valueOf(rfpSubmission.getRfpCarrier().getCategory());
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(
            createParams.getClientId(), category.getPlanTypes());

        RfpQuote newQuote = new RfpQuote();
        newQuote.setRatingTiers(sharedRfpQuoteService.findRatingTiers(clientPlans));
        newQuote.setLatest(true);
        newQuote.setUpdated(new Date());
        newQuote.setQuoteType(quoteType);
        newQuote.setRfpSubmission(rfpSubmission);
        newQuote.setRfpQuoteVersion(rfpQuoteVersion);
        newQuote.setDisclaimer(disclaimer);
        rfpQuoteRepository.save(newQuote);

        if(previousQuote != null) {
            previousQuote.setLatest(false);
            rfpQuoteRepository.save(previousQuote);
        }
        
        if(planCategory.isAncillary()) {
        	for (ProgramToAncillaryPlan programToAncillaryPlan : programPlans) {
				RfpQuoteAncillaryPlan ancPlan = new RfpQuoteAncillaryPlan();
				// NOTE do not use original CLSA program plans! Create Copy
				AncillaryPlan planCopy = programToAncillaryPlan.getAncillaryPlan().copy();
		    	ancillaryPlanRepository.save(planCopy);
		    	
				ancPlan.setAncillaryPlan(planCopy);
				ancPlan.setMatchPlan(false); // FIXME
				ancPlan.setRfpQuote(newQuote);
				rfpQuoteAncillaryPlanRepository.save(ancPlan);
			}
        	return newQuote;
        }

        // possible values: SINGLE, DUAL
        Map<String, List<PlanRate>> ratesByCombination = rates.stream()
            .filter(pr -> PlanRateType.NETWORK_COMBINATION.equals(pr.getType()) || PlanRateType.NETWORK_COMBINATION.equals(pr.getType2()))
            .collect(Collectors.groupingBy(pr -> {
                return PlanRateType.NETWORK_COMBINATION.equals(pr.getType()) ? pr.getTypeValue() : pr.getTypeValue2();
            }));
        // FIXME extract to method
        Map<Long, RfpQuoteNetworkCombination> combinationsByProgramToPnnId = new HashMap<>();
        for(Entry<String, List<PlanRate>> entry : ratesByCombination.entrySet()) {
            String combinationName;
            int networkCount = 0;
            List<PlanRate> conbined = entry.getValue();
            Set<String> networks = new TreeSet<>(); // sorted
            for(PlanRate planRate : conbined) {
                ProgramToPnn progToPnn = programToPnnRepository.findOne(planRate.getProgramToPnnId());
                networks.add(progToPnn.getPnn().getNetwork().getName());
            }
            if(entry.getKey().equals("SINGLE")) {
                combinationName = networks.stream().collect(Collectors.joining(", ", "Single (", ")"));
                networkCount = 1;
            } else { // DUAL
                combinationName = networks.stream().collect(Collectors.joining(" / ", "Dual (", ")"));
                networkCount = 2;
            }
            RfpQuoteNetworkCombination combination = rfpQuoteNetworkCombinationRepository.findByName(combinationName);
            if(combination == null) {
                combination = new RfpQuoteNetworkCombination(program.getRfpCarrier().getCarrier(), combinationName, networkCount);
                combination = rfpQuoteNetworkCombinationRepository.save(combination);
            }
            for(PlanRate planRate : conbined) {
                combinationsByProgramToPnnId.put(planRate.getProgramToPnnId(), combination);
            }
        }

        List<PlanRate> rxPlanRates = new ArrayList<>();
        for(PlanRate planRate : rates) {
            ProgramToPnn progToPnn = programToPnnRepository.findOne(planRate.getProgramToPnnId());
            
            /* FIXME: is progToPnn.getPnn().COPY() required or no?
             * if no, then quote plan benefits/name (not rates) change will be propagated to all CLSA program and other quotes plans
             * see CLSATrustClientParser.findOrCreatePlan()
             */
            
            if(progToPnn.getPnn().getNetwork().getType().startsWith("RX_")){
                rxPlanRates.add(planRate);
                continue;
            }
            RfpQuoteNetworkCombination comb = combinationsByProgramToPnnId.get(planRate.getProgramToPnnId());
            createRfpQuoteNetworkPlan(newQuote, planRate, progToPnn, comb);
        }

        for(PlanRate planRate : rxPlanRates) {
            ProgramToPnn progToPnn = programToPnnRepository.findOne(planRate.getProgramToPnnId());
            RfpQuoteNetworkCombination comb = combinationsByProgramToPnnId.get(planRate.getProgramToPnnId());

            if(quoteType.equals(QuoteType.CLSA_TRUST_PROGRAM)
                && program.getRfpCarrier().getCarrier().getName().equals(UHC.name())
                && program.getRfpCarrier().getCategory().equals(MEDICAL)){
                // add all rx per plan type into each plan type main rfpQuoteNetwork

                String networkType = progToPnn.getPnn().getNetwork().getType().replace("RX_", "");
                boolean atLeastOneRfpQuoteNetworkFound = false;
                for(RfpQuoteNetwork rfpQuoteNetwork : newQuote.getRfpQuoteNetworks()){
                    if(equalsAnyIgnoreCase(networkType, HSA, PPO)){
                        if(rfpQuoteNetwork.getNetwork().getType().equals(PPO)
                            && equalsAny(progToPnn.getPnn().getName(), getDEFAULT_RX_PPO_PLAN_NAME(), "Access (242)")){

                            atLeastOneRfpQuoteNetworkFound = true;
                            createRfpQuoteNetworkPlan(rfpQuoteNetwork, progToPnn.getPnn(),
                                planRate.getTier1Rate(), planRate.getTier2Rate(), planRate.getTier3Rate(), planRate.getTier4Rate());
                        } else if(rfpQuoteNetwork.getNetwork().getType().equals(HSA)
                            && equalsAny(progToPnn.getPnn().getName(), getDEFAULT_RX_HSA_PLAN_NAME(), "Access (0C2)")) {

                            atLeastOneRfpQuoteNetworkFound = true;
                            createRfpQuoteNetworkPlan(
                                rfpQuoteNetwork, progToPnn.getPnn(),
                                planRate.getTier1Rate(), planRate.getTier2Rate(),
                                planRate.getTier3Rate(), planRate.getTier4Rate());
                        }
                    } else if(networkType.equals(HMO) && rfpQuoteNetwork.getNetwork().getType().equals(networkType)){
                        atLeastOneRfpQuoteNetworkFound = true;
                        createRfpQuoteNetworkPlan(rfpQuoteNetwork, progToPnn.getPnn(),
                            planRate.getTier1Rate(), planRate.getTier2Rate(), planRate.getTier3Rate(), planRate.getTier4Rate());
                    }
                }
                if(!atLeastOneRfpQuoteNetworkFound){
                    createRfpQuoteNetworkPlan(newQuote, planRate, progToPnn, comb);
                }
            } else {
                createRfpQuoteNetworkPlan(newQuote, planRate, progToPnn, comb);
            }

        }

        return newQuote;
    }

    private void createRfpQuoteNetworkPlan(RfpQuote newQuote, PlanRate planRate,
        ProgramToPnn progToPnn, RfpQuoteNetworkCombination comb) {
        RfpQuoteNetwork qNetw = createRfpQuoteNetwork(newQuote, progToPnn.getPnn().getNetwork(), comb);
        RfpQuoteNetworkPlan qNetwPlan = createRfpQuoteNetworkPlan(qNetw, progToPnn.getPnn(),
            planRate.getTier1Rate(), planRate.getTier2Rate(), planRate.getTier3Rate(), planRate.getTier4Rate());
    }

    private String getCLSADisclaimer(Program program) {
        switch(program.getRfpCarrier().getCategory()){
            case MEDICAL:
                return UHC_CLSA_DISCLAIMER;
            case DENTAL:
                return METLIFE_DENTAL_CLSA_DISCLAIMER;
            case VISION:
                return METLIFE_VISION_CLSA_DISCLAIMER;
        }
        return null;
    }

    private void applyCommission(PlanRate planRate, Float commission) {
        if(commission != null && commission > 0f) {
            float factor = (1f + commission / 100f);
            planRate.setTier1Rate(planRate.getTier1Rate() * factor);
            planRate.setTier2Rate(planRate.getTier2Rate() * factor);
            planRate.setTier3Rate(planRate.getTier3Rate() * factor);
            planRate.setTier4Rate(planRate.getTier4Rate() * factor);
        }
    }
    
    public int findLastCLSAOptionNumber(List<? extends QuoteOption> rfpQuoteOptions) {
        QuoteOption lastQuoteOption = rfpQuoteOptions.stream()
            .filter(option -> containsIgnoreCase(option.getName(), "CLSA"))
            .sorted(
                (o1, o2) -> {
                    // IMPORTANT: desc comparator!
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

            if(!lastOptionName.matches("CLSA \\w+ \\d{1,2}") ) {
                return 0;
            }

            String[] nameParts = lastOptionName.split(" ");
            return parseUnsignedInt(nameParts[nameParts.length-1]);
        }

        return 0;
    }
    
    public Long createOption(RfpQuote rfpQuote, String product, OptionType optionType) {
    	
    	PlanCategory planCategory = PlanCategory.valueOf(product);
    	if (planCategory.isAncillary()) {
    		return createAncillaryOption(rfpQuote, planCategory, optionType);
    	}
    	
        RfpQuoteOption option = new RfpQuoteOption();
        option.setRfpQuote(rfpQuote);
        if (optionType == OptionType.RENEWAL) {
        	option.setRfpQuoteOptionName("CLSA Renewal");
        } else {
        	List<RfpQuoteOption> existingOptions = rfpQuoteOptionRepository.findByClientId(
                rfpQuote.getRfpSubmission().getClient().getClientId())
                .stream().filter(rqo ->
                    rqo.getRfpQuote().getQuoteType().equals(QuoteType.CLSA_TRUST_PROGRAM)
                    && rqo.getRfpQuote().getRfpSubmission().getRfpCarrier().getCategory().equals(product)
                ).collect(Collectors.toList());
        	
            int lastOptionNumber = findLastCLSAOptionNumber(existingOptions);
            
        	option.setRfpQuoteOptionName("CLSA Option " + (lastOptionNumber + 1));
        }
        option.setRfpQuoteVersion(rfpQuote.getRfpQuoteVersion());
        option = rfpQuoteOptionRepository.save(option);
        rfpQuote.getRfpQuoteOptions().add(option);
        final RfpQuoteOption finalOption = option;

        List<ClientPlan> clientPlanList = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(rfpQuote.getRfpSubmission().getClient().getClientId(), planCategory.getPlanTypes());

        Map<String, RfpQuoteNetworkPlan> basePlans = new HashMap<>();
        if (product.equals(MEDICAL)) {
            basePlans.put(HMO, findMatchPlan(rfpQuote, HMO, "Signature", DEFAULT_HMO_PLAN_NAME));
            basePlans.put(PPO, findMatchPlan(rfpQuote, PPO, "Select Plus", DEFAULT_PPO_PLAN_NAME));
            basePlans.put(HSA, findMatchPlan(rfpQuote, HSA, "Select Plus HSA", DEFAULT_HSA_PLAN_NAME));

            // Note: Below statement is not a typo! RX_HSA is included in RX_PPO but key has to match clientPlan networkType
            // Note: Rx is moved into main network so we have to find them there
            basePlans.put(RX_PPO, findMatchPlan(rfpQuote, PPO, "Select Plus", DEFAULT_RX_PPO_PLAN_NAME));
            basePlans.put(RX_HSA, findMatchPlan(rfpQuote, HSA, "Select Plus HSA", DEFAULT_RX_HSA_PLAN_NAME));
            basePlans.put(RX_HMO, findMatchPlan(rfpQuote, HMO, "Signature", DEFAULT_RX_HMO_PLAN_NAME));
        } else if (product.equals(DENTAL)) {
            basePlans.put(DPPO, findMatchPlan(rfpQuote, DPPO, "DPPO Network", DEFAULT_DPPO_PLAN_NAME));
            basePlans.put(DHMO, findMatchPlan(rfpQuote, DHMO, "DHMO Network", DEFAULT_DHMO_PLAN_NAME));
        } else if (product.equals(VISION)) {
            basePlans.put(VISION, findMatchPlan(rfpQuote, VISION, "VPPO Network", DEFAULT_VPPO_PLAN_NAME));
        }

        final List<RfpQuoteOptionNetwork> rqonsForCopy = new ArrayList<>();
        clientPlanList.forEach(clientPlan -> {
            RfpQuoteOptionNetwork rqon = new RfpQuoteOptionNetwork();
            rqon.setRfpQuoteVersion(finalOption.getRfpQuoteVersion());
            rqon.setRfpQuoteOption(finalOption);

            rqon.setClientPlan(clientPlan);
            rqon.setOutOfState(clientPlan.isOutOfState());

            rqon.setErContributionFormat(clientPlan.getErContributionFormat());
            rqon.setTier1ErContribution(floatValue(clientPlan.getTier1ErContribution()));
            rqon.setTier2ErContribution(floatValue(clientPlan.getTier2ErContribution()));
            rqon.setTier3ErContribution(floatValue(clientPlan.getTier3ErContribution()));
            rqon.setTier4ErContribution(floatValue(clientPlan.getTier4ErContribution()));

            rqon.setTier1Census(longValue(clientPlan.getTier1Census()));
            rqon.setTier2Census(longValue(clientPlan.getTier2Census()));
            rqon.setTier3Census(longValue(clientPlan.getTier3Census()));
            rqon.setTier4Census(longValue(clientPlan.getTier4Census()));

            String networkType = null;
            RfpQuoteNetwork rfpQuoteNetwork = null;
            if (clientPlan.getPnn() != null) {
                networkType = clientPlan.getPnn().getNetwork().getType();
                RfpQuoteNetworkPlan selectedPlan = null;

                if(optionType == OptionType.RENEWAL){
                    selectedPlan = findMatchPlan(rfpQuote, clientPlan.getPnn().getPlanType(),
                        clientPlan.getPnn().getNetwork().getName(), clientPlan.getPnn().getName());
                    rfpQuoteNetwork = selectedPlan.getRfpQuoteNetwork();
                } else {
                    if (basePlans.containsKey(networkType)) {
                        selectedPlan = basePlans.get(networkType);
                        rfpQuoteNetwork = selectedPlan.getRfpQuoteNetwork();
                    }
                }

                if(selectedPlan != null) {
                    selectedPlan.setMatchPlan(true);
                    rqon.setSelectedRfpQuoteNetworkPlan(selectedPlan);
                    rqon.setRfpQuoteNetwork(rfpQuoteNetwork);
                }

                if("HSA".equals(networkType)) {
                    Carrier carrier = finalOption.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
                    rqon.setAdministrativeFee(administrativeFeeService.getDefault(carrier.getCarrierId()));
                }
            }
            if(product.equals(MEDICAL)){
                if(optionType == OptionType.RENEWAL){
                    if (clientPlan.getRxPnn() != null) {
                        RfpQuoteNetworkPlan selectedRxPlan = findMatchPlan(rfpQuoteNetwork, clientPlan.getRxPnn().getName());
                        if (selectedRxPlan != null) {
                            selectedRxPlan.setMatchPlan(true);
                            rqon.setSelectedRfpQuoteNetworkRxPlan(selectedRxPlan);
                        }
                    }
                } else {
                    if (networkType != null) {
                        String rxNetworkType = "RX_" + networkType;
                        if (basePlans.containsKey(rxNetworkType)) {
                            RfpQuoteNetworkPlan selectedRxPlan = basePlans.get(rxNetworkType);
                            if (selectedRxPlan != null) {
                                selectedRxPlan.setMatchPlan(true);
                                rqon.setSelectedRfpQuoteNetworkRxPlan(selectedRxPlan);
                            }
                        }
                    }
                }
            }
            rqonsForCopy.add(rqon);
            rfpQuoteOptionNetworkRepository.save(rqon);
        });
        option.getRfpQuoteOptionNetworks().addAll(rqonsForCopy);

        return option.getRfpQuoteOptionId();
    }

    private RfpQuoteNetwork findOrCreateRfpQuoteNetwork(RfpQuote rfpQuote, Network network) {
        List<RfpQuoteNetwork> networks = rfpQuoteNetworkRepository
            .findByRfpQuoteAndNetworkNetworkId(rfpQuote, network.getNetworkId());
        RfpQuoteNetwork quoteNetwork = networks.stream()
            .filter(n -> n.isaLaCarte() && n.getRfpQuoteNetworkCombination() == null)
            .findFirst().orElseGet(() -> {
                RfpQuoteNetwork rqn = new RfpQuoteNetwork(rfpQuote, network, network.getName());
                rqn.setaLaCarte(true);
                return rfpQuoteNetworkRepository.save(rqn);
            });
        return quoteNetwork;
    }
    
    private Long createAncillaryOption(RfpQuote rfpQuote, PlanCategory product, OptionType optionType) {
		List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategoryAndQuoteType(
				rfpQuote.getRfpSubmission().getClient().getClientId(), 
				product.name(), 
				QuoteType.CLSA_TRUST_PROGRAM);
		List<RfpQuoteAncillaryOption> existingOptions;
		if (rfpQuotes.isEmpty()) {
			existingOptions = Collections.emptyList();
		} else {
			existingOptions = rfpQuoteAncillaryOptionRepository.findByRfpQuote(rfpQuotes.get(0));
		}
		RfpQuoteAncillaryOption option = new RfpQuoteAncillaryOption();
		if (optionType == OptionType.RENEWAL) {
			option.setName("CLSA Renewal");
		} else {
			int lastOptionNumber = findLastCLSAOptionNumber(existingOptions);
			option.setName("CLSA Option " + (lastOptionNumber + 1));
		}
		option.setRfpQuote(rfpQuote);
		
		
		List<RfpQuoteAncillaryPlan> alternatives = rfpQuoteAncillaryPlanRepository.findByRfpQuote(option.getRfpQuote());

		List<ClientPlan> clientPlanList = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(
				rfpQuote.getRfpSubmission().getClient().getClientId(), product.getPlanTypes());
		
		RfpQuoteAncillaryPlan matchPlan;
		if(optionType == OptionType.RENEWAL){
			if (clientPlanList.isEmpty()) {
				throw new BaseException("Cannot create Renewal option: Current option plans not found");
			}
			ClientPlan currentPlan = clientPlanList.get(0);
			// find plan with the same name
			String currentPlanName = currentPlan.getAncillaryPlan().getPlanName();
			matchPlan = findMatchPlan(alternatives, currentPlanName);
			/* FIXME is exception required?
			if (matchPlan == null) {
				throw new BaseException("Cannot find match plan for Renewal option: " + currentPlanName);
			}*/
		} else {
			String planNamePrefix = null;
			switch (product) {
			case LIFE:
				planNamePrefix = DEFAULT_LIFE_PLAN_NAME_PREFIX;
				break;
			case VOL_LIFE:
				planNamePrefix = DEFAULT_VOL_LIFE_PLAN_NAME_PREFIX;
				break;
			case STD:
				planNamePrefix = DEFAULT_STD_PLAN_NAME_PREFIX;
				break;
			case LTD:
				planNamePrefix = DEFAULT_LTD_PLAN_NAME_PREFIX;
				break;
			default:
				throw new BaseException("Ancillary product not supported yet: " + product.name());
			}
			matchPlan = findMatchPlan(alternatives, planNamePrefix);
			if (matchPlan == null && !alternatives.isEmpty()) {
				matchPlan = alternatives.get(0); // select any if not found by condition
	    	}
		}
		
		if (!clientPlanList.isEmpty()) {
			// The current covered volume amount should copy into the CLSA option to allow for monthly cost calculation
			ClientPlan currentPlan = clientPlanList.get(0);
			double currentVolume = currentPlan.getAncillaryPlan().getRates().getVolume();
			for (RfpQuoteAncillaryPlan altPlan : alternatives) {
				altPlan.getAncillaryPlan().getRates().setVolume(currentVolume);
			}
			rfpQuoteAncillaryPlanRepository.save(alternatives);
		}
		option.setRfpQuoteAncillaryPlan(matchPlan);
		
		option = rfpQuoteAncillaryOptionRepository.save(option);

		return option.getRfpQuoteAncillaryOptionId();
	}
    
    private RfpQuoteNetworkPlan findMatchPlan(RfpQuote rfpQuote, String networkType,
        String networkName, String planName) {

        RfpQuoteNetwork matchNetwork = findMatchNetwork(rfpQuote, networkType, networkName);
        return findMatchPlan(matchNetwork, planName);
    }
    
    private RfpQuoteAncillaryPlan findMatchPlan(List<RfpQuoteAncillaryPlan> alternatives, String planNamePrefix) {
    	RfpQuoteAncillaryPlan match = null;
    	for (RfpQuoteAncillaryPlan plan : alternatives) {
			if (plan.getAncillaryPlan().getPlanName().startsWith(planNamePrefix)) {
				match = plan;
				break;
			}
		}
        return match;
    }

    private RfpQuoteNetworkPlan findMatchPlan(RfpQuoteNetwork rfpQuoteNetwork, String planName){

        return rfpQuoteNetwork.getRfpQuoteNetworkPlans().stream()
            .filter(p -> p.getPnn() != null && p.getPnn().getName().equals(planName))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException(String.format("Could not find rfpQuoteNetworkPlan '%s' in quote %s",
                planName, rfpQuoteNetwork.getRfpQuote().getRfpQuoteId())));
    }

    private RfpQuoteNetwork findMatchNetwork(RfpQuote rfpQuote, String networkType, String networkName) {
        RfpQuoteNetwork quoteNetwork = rfpQuote.getRfpQuoteNetworks()
            .stream()
            .filter(rfpQuoteNetwork -> networkType.equals(rfpQuoteNetwork.getNetwork().getType())
                && rfpQuoteNetwork.getNetwork().getName().contains(networkName)
                && !rfpQuoteNetwork.getNetwork().getCarrier().getName().equals(Constants.KAISER_CARRIER))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException(String.format("Could not find network '%s' in quote %s", networkType, rfpQuote.getRfpQuoteId())));
        return quoteNetwork;
    }
        
    public List<PlanRate> findPlanRates(Program program, CreateProgramQuoteDto quoteParams) {
        RfpCarrier rfpCarrier = program.getRfpCarrier();
        if(program.getName().equalsIgnoreCase(Constants.TECH_TRUST_PROGRAM)) {
            switch(CarrierType.fromString(rfpCarrier.getCarrier().getName())) {
                case ANTHEM_BLUE_CROSS:
                    // Anthem_TT_MEDICAL
                    if(rfpCarrier.getCategory().equals(MEDICAL)) {
                        if(quoteParams.getRatingBand() == null) {
                            throw new BaseException("Missing required param: ratingBand");
                        }
                        List<PlanRate> rates = planRateRepository.findByProgramIdAndRatingBandAndRateTypeAndValue(
                            program.getProgramId(), quoteParams.getRatingBand(), null, null);
                        // Commission 6% already included to rates
                        // rates.forEach(pr -> applyCommission(pr, 6f));
                        return rates;
                        // Anthem_TT_DENTAL
                    } else if(rfpCarrier.getCategory().equals(Constants.DENTAL)) {
                        if(quoteParams.getRatingBand() == null) {
                            throw new BaseException("Missing required param: ratingBand");
                        }
                        List<PlanRate> rates = planRateRepository.findByProgramId(program.getProgramId());
                        // Commission 7% already included to rates
                        return rates.stream().filter(r -> {
                            ProgramToPnn progToPnn = programToPnnRepository.findOne(r.getProgramToPnnId());
                            if(progToPnn.getPnn().getPlanType().equals("DHMO")) {
                                return true; // not filter required
                            } else if(progToPnn.getPnn().getPlanType().equals("DPPO")) {
                                return quoteParams.getRatingBand().equals(r.getRatingBand());
                            }
                            return false;
                        }).collect(Collectors.toList());
                        // Anthem_TT_VISION
                    } else if(rfpCarrier.getCategory().equals(VISION)) {
                        List<PlanRate> rates = planRateRepository.findByProgramId(program.getProgramId());
                        // FIXME is required Vision Commission: 10% ? (see file for details)
                        return rates;
                    } else {
                        throw new BaseException("Anthem does not support Technology Trust program for product: " + rfpCarrier.getCategory());
                    }
                default:
                    throw new BaseException("Carrier does not support Technology Trust program: " + rfpCarrier.getCarrier().getDisplayName());
            }
        } else if(program.getName().equalsIgnoreCase(Constants.BEYOND_BENEFITS_TRUST_PROGRAM)) {
            Client client = clientRepository.findOne(quoteParams.getClientId());
            if(client == null) {
                throw new BaseException("Client by id not found").withFields(field("client_id", quoteParams.getClientId()));
            }
            BrokerLocale clientLocale = clientLocaleUtils.getLocale(client.getPredominantCounty(), client.getZip(), client.getCity());
            switch(CarrierType.fromString(rfpCarrier.getCarrier().getName())) {
                case ANTHEM_BLUE_CROSS:
                    // Anthem_BBT_MEDICAL_DENTAL
                    if(rfpCarrier.getCategory().equals(MEDICAL)
                        || rfpCarrier.getCategory().equals(Constants.DENTAL)) {
                        if(quoteParams.getRatingBand() == null) {
                            throw new BaseException("Missing required param: ratingBand");
                        }
                        return planRateRepository.findByProgramIdAndRatingBandAndRateTypeAndValue(
                            program.getProgramId(), quoteParams.getRatingBand(), PlanRateType.COUNTY, clientLocale.name());
                        // Anthem_BBT_VISION
                    } else if(rfpCarrier.getCategory().equals(VISION)) {
                        List<PlanRate> rates = planRateRepository.findByProgramIdAndRatingBandAndRateType(
                            program.getProgramId(), null, PlanRateType.GROUP_SIZE);
                        return rates.stream().filter(r -> {
                            String rateTypeValue = r.getTypeValue();
                            // required format: <digit(s)>-<digit(s)> (for example 51-249 or 250-499)
                            // TODO validate?
                            String[] range = rateTypeValue.split("-");
                            if(range.length != 2) {
                                return false;
                            }
                            boolean countyEquals = true;
                            if(r.getType2() != null && r.getType2() == PlanRateType.COUNTY) {
                                countyEquals = clientLocale.name().equals(r.getTypeValue2());
                            }
                            Integer from = Integer.parseUnsignedInt(range[0]);
                            Integer to = Integer.parseUnsignedInt(range[0]);
                            return (client.getEmployeeCount() >= from && client.getEmployeeCount() <= to)
                                && countyEquals;

                            // FIXME is the ratingTiers check required?
                        })
                            .peek(pr -> applyCommission(pr, 7.0f)) // FIXME extract all commission constants
                            .collect(Collectors.toList());
                    } else if(rfpCarrier.getCategory().equals(Constants.LIFE)
                        || rfpCarrier.getCategory().equals(Constants.LTD)
                        || rfpCarrier.getCategory().equals(Constants.STD)) {
                        // TODO
                        return Collections.emptyList();
                    }
                case DELTA_DENTAL:
                    String county = client.getPredominantCounty();
                    if(county == null) {
                        county = clientLocaleUtils.getCountyByZipCode(client.getZip());
                    }
                    if(county == null) {
                        county = clientLocaleUtils.getCountyByCity(client.getCity());
                    }
                    if(county == null) {
                        throw new BaseException("Cannot find client county");
                    }
                    final String finalCounty = county;
                    List<PlanRate> rates = planRateRepository.findByProgramIdAndRatingBandAndRateType(
                        program.getProgramId(), null, PlanRateType.COUNTY);
                    return rates.stream().filter(r -> {
                        ProgramToPnn progToPnn = programToPnnRepository.findOne(r.getProgramToPnnId());
                        if(progToPnn.getPnn().getPlanType().equals("DHMO")) {
                            if(r.getTypeValue() != null && r.getTypeValue().equals(finalCounty)) {
                                return true;
                            }
                        } else if(progToPnn.getPnn().getPlanType().equals("DPPO")) {
                            if(r.getTypeValue() != null && r.getTypeValue().equals(clientLocale.name())) {
                                return true;
                            }
                        }
                        return false;
                    }).collect(Collectors.toList());
                case VSP:
                    return planRateRepository.findByProgramId(program.getProgramId());
                default:
                    throw new BaseException("Carrier does not support Beyond Benefits Trust program: " + rfpCarrier.getCarrier().getDisplayName());
            }
        } else if(program.getName().equalsIgnoreCase(Constants.CLSA_TRUST_PROGRAM)) {
            Client client = clientRepository.findOne(quoteParams.getClientId());
            if(client == null) {
                throw new BaseException("Client by id not found").withFields(field("client_id", quoteParams.getClientId()));
            }
            switch(CarrierType.fromString(rfpCarrier.getCarrier().getName())) {
                case UHC:
                    // Medical only
                    if(quoteParams.getAverageAge() == null) {
                        throw new BaseException("Missing required param: averageAge");
                    }
                    if(quoteParams.getZipCode() == null) {
                        throw new BaseException("Missing required param: zipCode");
                    }
                    String region = clientLocaleUtils.getCLSARegionByZipCode(quoteParams.getZipCode());
                    if(region.equals("NCAL")) {
                        region = BrokerLocale.NORTH.name();
                    } else if(region.equals("SCAL")) {
                        region = BrokerLocale.SOUTH.name();
                    } else {
                        throw new IllegalArgumentException("Cannot parse Region: " + region);
                    }
                    if(region == null) {
                        throw new BaseException("Cannot find client Region by ZipCode: " + quoteParams.getZipCode());
                    }
                    
                    if(rfpCarrier.getCategory().equals(MEDICAL)) {
                        return planRateRepository.findByProgramIdAndRateTypeAndValue(program.getProgramId(),
                            PlanRateType.COUNTY, region,
                            PlanRateType.RATE_YEAR, getCLSARateYear(client.getEffectiveDate()),
                            PlanRateType.AGE_GROUP, getAverageAgeGroup(Integer.parseInt(quoteParams.getAverageAge())));
                    }
                    return Collections.emptyList();
                case METLIFE:
                    if(rfpCarrier.getCategory().equals(Constants.DENTAL)
                        || rfpCarrier.getCategory().equals(VISION)) {
                        if(quoteParams.getNumEligibleEmployees() == null) {
                            throw new BaseException("Missing required param: numEligibleEmployees");
                        }
                        if (quoteParams.getZipCode() == null && quoteParams.getRegion() == null) {
                            throw new BaseException("Missing required param: zipCode or region");
                        }
                        String regionCode = quoteParams.getRegion();
                        if (regionCode == null) {
	                        regionCode = getRegionCodeByZip(quoteParams.getZipCode());
	                        if(regionCode == null) {
	                            throw new BaseException("Cannot find client Region by ZipCode: " + quoteParams.getZipCode());
	                        }
                        }
                        return planRateRepository.findByProgramIdAndRateTypeAndValue(program.getProgramId(),
                            PlanRateType.COUNTY, regionCode,
                            PlanRateType.GROUP_SIZE, getEmployeeBandRateValue(Integer.parseInt(quoteParams.getNumEligibleEmployees())),
                            PlanRateType.RATE_YEAR, getCLSARateYear(client.getEffectiveDate()));
                    }
                    return Collections.emptyList();
                default:
                    throw new BaseException("Carrier does not support Beyond Benefits Trust program: " + rfpCarrier.getCarrier().getDisplayName());
            }
        } else {
            throw new BaseException("Program is not supported: " + program.getName());
        }
    }

    /**
     * Logic to determine CLSA year based on Oct 1st of each year(2019 = date after Oct 1st)
     */
    public String getCLSARateYear(Date clientEffectiveDate){
        Calendar clientEffectiveCalendar = Calendar.getInstance();
        Calendar clickOverCalendar = Calendar.getInstance();
        clientEffectiveCalendar.setTime(clientEffectiveDate);
        clickOverCalendar.setTime(DateHelper.fromStringToDate("10/01/2018")); // received 2018+ rates

        if(clientEffectiveCalendar.get(Calendar.YEAR) != Calendar.getInstance().get(Calendar.YEAR)){
            return String.valueOf(clientEffectiveCalendar.get(Calendar.YEAR));
        }

        // do year comparison
        if(clientEffectiveCalendar.get(Calendar.MONTH) >= clickOverCalendar.get(Calendar.MONTH)){
            return String.valueOf(Calendar.getInstance().get(Calendar.YEAR) + 1);
        } else {
            return String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
        }
    }

    private RfpQuoteNetworkPlan createRfpQuoteNetworkPlan(RfpQuoteNetwork rfpQuoteNetwork, PlanNameByNetwork pnn,
        Float tier1Rate, Float tier2Rate, Float tier3Rate, Float tier4Rate) {

        RfpQuoteNetworkPlan qnp = new RfpQuoteNetworkPlan();
        qnp.setPnn(pnn);
        qnp.setRfpQuoteNetwork(rfpQuoteNetwork);
        qnp.setRfpQuoteVersion(rfpQuoteNetwork.getRfpQuoteVersion());
        qnp.setTier1Rate(tier1Rate);
        qnp.setTier2Rate(tier2Rate);
        qnp.setTier3Rate(tier3Rate);
        qnp.setTier4Rate(tier4Rate);

        RfpCarrier rfpCarrier = rfpQuoteNetwork.getRfpQuote().getRfpSubmission().getRfpCarrier();
        if(pnn.getName().equalsIgnoreCase(ANTHEM_RIDER_APPLICABLE_PLAN_NAME)
            && CarrierType.fromString(rfpCarrier.getCarrier().getName()) == CarrierType.ANTHEM_BLUE_CROSS) {
            List<RiderMeta> riderMetas = riderMetaRepository.findByCodeAndPlanType(ANTHEM_PLAN_APPLICABLE_RIDER_CODE, "HMO");

            if(riderMetas.size() != 1) {
                throw new BaseException("Unique rider meta not found: " + ANTHEM_PLAN_APPLICABLE_RIDER_CODE)
                    .withFields(field("code", ANTHEM_PLAN_APPLICABLE_RIDER_CODE));
            }
            List<Rider> riders = riderRepository.findByRiderMeta(riderMetas.get(0));
            if(riders.size() != 1) {
                throw new BaseException("Rider not found: " + ANTHEM_PLAN_APPLICABLE_RIDER_CODE)
                    .withFields(field("code", ANTHEM_PLAN_APPLICABLE_RIDER_CODE));
            }
            qnp.getRiders().addAll(riders);
        }

        rfpQuoteNetwork.getRfpQuoteNetworkPlans().add(qnp);

        return rfpQuoteNetworkPlanRepository.save(qnp);
    }

    private RfpQuoteNetwork createRfpQuoteNetwork(RfpQuote rfpQuote, Network network, RfpQuoteNetworkCombination combination) {
        RfpQuoteNetwork rqn = rfpQuote.getRfpQuoteNetworks().stream()
            .filter(n -> n.getNetwork().getNetworkId().equals(network.getNetworkId())
                && Objects.equal(n.getRfpQuoteNetworkCombination(), combination))
            .findFirst().orElse(null);
        if(rqn != null) {
            return rqn;
        }
        // FIXME how to build rfpQuoteOptionName ? (at now used network.getName())
        rqn = new RfpQuoteNetwork(rfpQuote, network, network.getName());
        rqn.setaLaCarte(combination == null); // if == null - aLaCarte
        rqn.setRfpQuoteNetworkCombination(combination);

        RfpCarrier rfpCarrier = rfpQuote.getRfpSubmission().getRfpCarrier();
        if(CarrierType.fromString(rfpCarrier.getCarrier().getName()) == CarrierType.DELTA_DENTAL
            && network.getType().equals("DPPO")) {
            Client client = rfpQuote.getRfpSubmission().getClient();
            BrokerLocale clientLocale = clientLocaleUtils.getLocale(client.getPredominantCounty(), client.getZip(), client.getCity());

            List<RiderMeta> riderMetas = riderMetaRepository.findByPlanTypeAndTypeAndTypeValueAndType2AndTypeValue2(
                "DPPO", RiderMetaType.COUNTY.name(), clientLocale.name(),
                RiderMetaType.RATING_TIERS.name(), String.valueOf(rfpQuote.getRatingTiers()));
            for(RiderMeta riderMeta : riderMetas) {
                List<Rider> riders = riderRepository.findByRiderMeta(riderMeta);
                rqn.getRiders().addAll(riders);
            }
        }

        rfpQuote.getRfpQuoteNetworks().add(rqn);

        return rfpQuoteNetworkRepository.save(rqn);
    }
    
    public String getDEFAULT_HMO_PLAN_NAME() {
        return DEFAULT_HMO_PLAN_NAME;
    }

    public String getDEFAULT_PPO_PLAN_NAME() {
        return DEFAULT_PPO_PLAN_NAME;
    }

    public String getDEFAULT_HSA_PLAN_NAME() {
        return DEFAULT_HSA_PLAN_NAME;
    }

    public String getDEFAULT_RX_HMO_PLAN_NAME() {
        return DEFAULT_RX_HMO_PLAN_NAME;
    }

    public String getDEFAULT_RX_PPO_PLAN_NAME() {
        return DEFAULT_RX_PPO_PLAN_NAME;
    }

    public String getDEFAULT_RX_HSA_PLAN_NAME() {
        return DEFAULT_RX_HSA_PLAN_NAME;
    }

    public String getDEFAULT_DPPO_PLAN_NAME() {
        return DEFAULT_DPPO_PLAN_NAME;
    }

    public String getDEFAULT_VPPO_PLAN_NAME() {
        return DEFAULT_VPPO_PLAN_NAME;
    }

    public String getDEFAULT_DHMO_PLAN_NAME() {
        return DEFAULT_DHMO_PLAN_NAME;
    }

	public String getDEFAULT_LIFE_PLAN_NAME_PREFIX() {
		return DEFAULT_LIFE_PLAN_NAME_PREFIX;
	}

	public String getDEFAULT_VOL_LIFE_PLAN_NAME_PREFIX() {
		return DEFAULT_VOL_LIFE_PLAN_NAME_PREFIX;
	}

	public String getDEFAULT_STD_PLAN_NAME_PREFIX() {
		return DEFAULT_STD_PLAN_NAME_PREFIX;
	}

	public String getDEFAULT_LTD_PLAN_NAME_PREFIX() {
		return DEFAULT_LTD_PLAN_NAME_PREFIX;
	}
}