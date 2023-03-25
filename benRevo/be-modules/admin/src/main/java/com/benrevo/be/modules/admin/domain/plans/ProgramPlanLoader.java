package com.benrevo.be.modules.admin.domain.plans;

import static java.util.Objects.isNull;

import com.benrevo.common.Constants;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.ProgramToPnn;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.ancillary.AncillaryClass;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.ProgramToAncillaryPlan;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.ProgramToPnnRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryClassRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.ProgramToAncillaryPlanRepository;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
public class ProgramPlanLoader {

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private FormattedPlanPortfolioLoader planLoader;

    @Autowired
    private ProgramToPnnRepository programToPnnRepository;
    
    @Autowired
    private ProgramToAncillaryPlanRepository programToAncillaryPlanRepository;
    
    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;
    
    @Autowired
    private AncillaryPlanRepository ancillaryPlanRepository;
    
    @Autowired
    private AncillaryClassRepository ancillaryClassRepository;

    public ProgramPlanLoader() {}
    
    public void saveAncillaryPlans(InputStream fis, Carrier carrier, String programName, Integer planYear) throws Exception{
    	Map<String, List<AncillaryPlan>> parsedPlans = planLoader.parseAncillaryPlans(carrier, fis, planYear);        
        // store pnn and program in program_to_ancillary_plan table
        parsedPlans.forEach((planType, plans) -> {
        	plans.forEach(plan -> {
    			PlanCategory category = PlanCategory.findByPlanType(planType);
                Program program = getProgram(programName, carrier, category.name());
                if (isNull(program)){
                    LOGGER.warn("Warning: Program is null. Skipping");
                    return; // skip iteration
                }
                ProgramToAncillaryPlan prog2Plan = programToAncillaryPlanRepository.findByProgramIdAndAncillaryPlanPlanNameAndAncillaryPlanPlanYear(
                		program.getProgramId(), plan.getPlanName(), plan.getPlanYear());	
                if (prog2Plan == null) {
                	plan = ancillaryPlanRepository.save(plan);
                	prog2Plan = new ProgramToAncillaryPlan();
                	prog2Plan.setProgramId(program.getProgramId());
                	prog2Plan.setAncillaryPlan(plan);
                	programToAncillaryPlanRepository.save(prog2Plan);
                } else {
                	updatePlan(plan, prog2Plan.getAncillaryPlan());
                }
            });
        });
    }
    
    private void updatePlan(AncillaryPlan plan, AncillaryPlan existingPlan) {
    	if(CollectionUtils.isNotEmpty(existingPlan.getClasses()) 
    			&& CollectionUtils.isNotEmpty(plan.getClasses())) {
    		if (existingPlan.getClasses().size() != 1) {
    			throw new IllegalArgumentException("To many classes in anclillary plan: " + existingPlan.getPlanName());
    		}
    		if (plan.getClasses().size() != 1) {
    			// parser supports only 1 class
    			throw new IllegalArgumentException("To many classes in anclillary plan: " + plan.getPlanName());
    		}
    		AncillaryClass oldClass = existingPlan.getClasses().get(0);
    		AncillaryClass newClass = plan.getClasses().get(0);
    		// replace all fields with new ones, but keep original classId
    		BeanUtils.copyProperties(newClass, oldClass, "ancillaryClassId");
    		oldClass.setAncillaryPlan(existingPlan);
    		// update old class 
    		ancillaryClassRepository.save(oldClass);
    	} else if (CollectionUtils.isEmpty(existingPlan.getClasses())) {
    		// fill missing classes from new plan
    		for (AncillaryClass ac : plan.getClasses()) {
				ac.setAncillaryPlan(existingPlan);
			}
    		existingPlan.getClasses().addAll(plan.getClasses());
    	}
    	if(existingPlan.getRates() != null && plan.getRates() != null) {
    		// update only one benefit, rates will be updated in ratesParser
    		existingPlan.getRates().setRateGuarantee(plan.getRates().getRateGuarantee());
    	} else if (existingPlan.getRates() == null) {
    		// fill missing rates from new plan
    		if(plan.getRates() != null) {
    			plan.getRates().setAncillaryPlan(existingPlan);
    			existingPlan.setRates(plan.getRates());
    		}
    	}
    	ancillaryPlanRepository.save(existingPlan);
    }
    
    public void savePlans(InputStream fis, Carrier carrier, String programName, Integer planYear) throws Exception{
        Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, fis, true);
        planLoader.savePlans(carrier, parsedPlans, planYear);

        Program medicalProgram = getProgram(programName, carrier, Constants.MEDICAL);
        Program dentalProgram = getProgram(programName, carrier, Constants.DENTAL);
        Program visionProgram = getProgram(programName, carrier, Constants.VISION);

        // store pnn and program in program_to_pnn table
        parsedPlans.forEach((planType, planDetails) -> {
            planDetails.forEach(detail -> {
                for(Entry<String, Network> entry : detail.getPlanNamesByNetwork().entrySet()) {
                	String planName = entry.getKey();
                	Network network = entry.getValue();
                    List<PlanNameByNetwork> pnns = planNameByNetworkRepository
                    	.findByNetworkAndNameAndPlanTypeAndPlanPlanYear(network, planName, planType, planYear);

                    PlanNameByNetwork pnn = null;
                    if(pnns != null && !pnns.isEmpty()){
                        pnn = pnns.get(0);
                    }else{
                        throw new NotFoundException("Pnn is not found!");
                    }

                    Program program = null;
                    if(Constants.MEDICAL.equalsIgnoreCase(deriveProduct(pnn.getPlanType())) && !isNull(medicalProgram)){
                        program = medicalProgram;
                    } else if(Constants.DENTAL.equalsIgnoreCase(deriveProduct(pnn.getPlanType())) && !isNull(dentalProgram)){
                        program = dentalProgram;
                    } else if(Constants.VISION.equalsIgnoreCase(deriveProduct(pnn.getPlanType())) && !isNull(visionProgram)){
                        program = visionProgram;
                    }

                    if(isNull(program)){
                        LOGGER.warnLog("Warning: Program is null. Skipping");
                        return; // skip iteration
                    }

                    ProgramToPnn prog2Pnn = programToPnnRepository.findByProgramIdAndPnn(program.getProgramId(), pnn);
                    if(prog2Pnn == null) {
                        prog2Pnn = new ProgramToPnn();
                        prog2Pnn.setProgramId(program.getProgramId());
                        prog2Pnn.setPnn(pnn);
                        programToPnnRepository.save(prog2Pnn);
                    }
                }
            });
        });
    }

    public Program getProgram(String programName, Carrier carrier, String product) {
        Program program = null;
        RfpCarrier rfpCarrier = getRfpCarrier(carrier, product);

        if(rfpCarrier == null){
            return program;
        }
        program = programRepository.findByRfpCarrierAndName(rfpCarrier, programName);
        return program;
    }

    public RfpCarrier getRfpCarrier(Carrier carrier, String category) {
        RfpCarrier rfpCarrier = rfpCarrierRepository
            .findByCarrierCarrierIdAndCategory(carrier.getCarrierId(), category);
        return rfpCarrier;
    }

    private String deriveProduct(String planType){
        if(planType.equalsIgnoreCase("HMO") || planType.equalsIgnoreCase("PPO") || planType.equalsIgnoreCase("HSA")
            || planType.equalsIgnoreCase("RX_HMO") || planType.equalsIgnoreCase("RX_PPO")) {
            return Constants.MEDICAL;
        }else if(planType.equalsIgnoreCase("DHMO") || planType.equalsIgnoreCase("DPPO")){
            return Constants.DENTAL;
        }else if(planType.equalsIgnoreCase("VISION")){
            return Constants.VISION;
        }
        return null;
    }
}
