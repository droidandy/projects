package com.benrevo.data.persistence.helper;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.repository.BenefitNameRepository;
import com.benrevo.data.persistence.repository.BenefitRepository;

import com.benrevo.data.persistence.repository.CarrierRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import static com.benrevo.common.Constants.DHMO;
import static com.benrevo.common.Constants.DPPO;
import static com.benrevo.common.Constants.HMO;
import static com.benrevo.common.Constants.HSA;
import static com.benrevo.common.Constants.PPO;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.UHC;
import static org.apache.commons.lang3.StringUtils.equalsAny;

@Component
public class PlanBenefitsHelper {

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private BenefitNameRepository benefitNameRepository;

    @Autowired
    private CarrierRepository carrierRepository;

    @Value("${app.carrier}")
    String[] appCarrier;


    public void createBenefitInPlan(Plan plan, List<BenefitName> benefitNames,
        String strBenefitName, String inOut, String value) {

        BenefitName benefitName = lookupBenefitName(benefitNames, strBenefitName);
        if(benefitName == null) {
            throw new IllegalArgumentException("Invalid benefitName passed: " + strBenefitName);
        }

        //create benefit that belongs to this plan
        Benefit newBenefit = new Benefit();
        newBenefit.setPlan(plan);
        newBenefit.setBenefitName(benefitName);
        newBenefit.setInOutNetwork(inOut);
        newBenefit.setValue(value);
        benefitRepository.save(newBenefit);
    }

    public void addBenefit(List<QuoteOptionAltPlanDto.Benefit> benefitNameResult, List<BenefitName> benefitNames, String sysName, String in, String out){
        BenefitName benefitName = lookupBenefitName(benefitNames, sysName);
        if (benefitName == null) {
            throw new IllegalArgumentException("Invalid benefitName passed: " + sysName);
        }
        QuoteOptionAltPlanDto.Benefit newBenefit = null;

        if(in != null && out == null) {
            newBenefit = new QuoteOptionAltPlanDto.Benefit(sysName,
                benefitName.getDisplayName(), in, null);

        } else {
            newBenefit = new QuoteOptionAltPlanDto.Benefit(sysName,
                benefitName.getDisplayName(), in, out, null, null);
        }

        benefitNameResult.add(newBenefit);
    }

    public List<QuoteOptionAltPlanDto.Benefit> getBenefitNamesByPlanType(String planType, boolean includeRx) {
        Map<String, List<QuoteOptionAltPlanDto.Benefit>> benefitsByPlanType = getDefaultBenefitNames(includeRx);
        List<QuoteOptionAltPlanDto.Benefit> result = benefitsByPlanType.get(planType);
        if(result == null) {
            throw new BaseException("Default benefits not found for planType: " + planType);
        }
        return result;
    }
    
    public Map<String, List<QuoteOptionAltPlanDto.Benefit>> getDefaultBenefitNames(boolean includeRx) {

        List<BenefitName> benefitNames = benefitNameRepository.findAll();
        Map<String, List<QuoteOptionAltPlanDto.Benefit>> result = new HashMap<>();
        List<QuoteOptionAltPlanDto.Benefit> benefitNameResult; 

//        if(planType.equals(HMO)) {
            benefitNameResult = new ArrayList<>();
            result.put(HMO, benefitNameResult);
            
            addBenefit(benefitNameResult, benefitNames, "INDIVIDUAL_DEDUCTIBLE", "-", null);
            addBenefit(benefitNameResult, benefitNames, "INDIVIDUAL_OOP_LIMIT", "-", null);
            addBenefit(benefitNameResult, benefitNames, "PCP", "-", null);
            addBenefit(benefitNameResult, benefitNames, "SPECIALIST", "-", null);
            addBenefit(benefitNameResult, benefitNames, "INPATIENT_HOSPITAL", "-", null);
            addBenefit(benefitNameResult, benefitNames, "IP_COPAY_MAX", "-", null);
            addBenefit(benefitNameResult, benefitNames, "IP_COPAY_TYPE", "-", null);
            addBenefit(benefitNameResult, benefitNames, "OUTPATIENT_SURGERY", "-", null);
            addBenefit(benefitNameResult, benefitNames, "EMERGENCY_ROOM", "-", null);
            addBenefit(benefitNameResult, benefitNames, "DEDUCTIBLE_TYPE", "-", null);
            addBenefit(benefitNameResult, benefitNames, "COMBINE_MED_RX_DEDUCTIBLE", "-", null);
            addBenefit(benefitNameResult, benefitNames, "URGENT_CARE", "-", null);
            if(includeRx) {
                addBenefit(benefitNameResult, benefitNames, "RX_INDIVIDUAL_DEDUCTIBLE", "-", null);
                addBenefit(benefitNameResult, benefitNames, "RX_FAMILY_DEDUCTIBLE", "-", null);
                addBenefit(benefitNameResult, benefitNames, "MEMBER_COPAY_TIER_1", "-", null);
                addBenefit(benefitNameResult, benefitNames, "MEMBER_COPAY_TIER_2", "-", null);
                addBenefit(benefitNameResult, benefitNames, "MEMBER_COPAY_TIER_3", "-", null);
                addBenefit(benefitNameResult, benefitNames, "MEMBER_COPAY_TIER_4", "-", null);
                addBenefit(benefitNameResult, benefitNames, "MAIL_ORDER", "-", null);
            }
//        } else if (planType.equals(PPO) || planType.equals(HSA)) {
            benefitNameResult = new ArrayList<>();
            result.put(PPO, benefitNameResult);
            result.put(HSA, benefitNameResult);

            addBenefit(benefitNameResult, benefitNames, "INDIVIDUAL_DEDUCTIBLE", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "CO_INSURANCE", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "INDIVIDUAL_OOP_LIMIT", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "PCP", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "SPECIALIST", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "INPATIENT_HOSPITAL", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "IP_PER_OCCURENCE_DEDUCTIBLE", "-", null);
            addBenefit(benefitNameResult, benefitNames, "OUTPATIENT_SURGERY", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "EMERGENCY_ROOM", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "DEDUCTIBLE_TYPE", "-", null);
            addBenefit(benefitNameResult, benefitNames, "COMBINE_MED_RX_DEDUCTIBLE", "-", null);

            if(includeRx) {
                addBenefit(benefitNameResult, benefitNames, "RX_INDIVIDUAL_DEDUCTIBLE", "-", null);
                addBenefit(benefitNameResult, benefitNames, "RX_FAMILY_DEDUCTIBLE", "-", null);
                addBenefit(benefitNameResult, benefitNames, "MEMBER_COPAY_TIER_1", "-", null);
                addBenefit(benefitNameResult, benefitNames, "MEMBER_COPAY_TIER_2", "-", null);
                addBenefit(benefitNameResult, benefitNames, "MEMBER_COPAY_TIER_3", "-", null);
                addBenefit(benefitNameResult, benefitNames, "MEMBER_COPAY_TIER_4", "-", null);
                addBenefit(benefitNameResult, benefitNames, "MAIL_ORDER", "-", null);
            }
//        } else if(planType.equals(DPPO)) {
            benefitNameResult = new ArrayList<>();
            result.put(DPPO, benefitNameResult);

            addBenefit(benefitNameResult, benefitNames, "CALENDAR_YEAR_MAXIMUM", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "DENTAL_INDIVIDUAL", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "DENTAL_FAMILY", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "WAIVED_FOR_PREVENTIVE", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "CLASS_1_PREVENTIVE", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "CLASS_2_BASIC", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "CLASS_3_MAJOR", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "CLASS_4_ORTHODONTIA", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "ORTHODONTIA_LIFETIME_MAX", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "ORTHO_ELIGIBILITY", "-", "-");
            addBenefit(benefitNameResult, benefitNames, "REIMBURSEMENT_SCHEDULE", "-", null);
            addBenefit(benefitNameResult, benefitNames, "IMPLANT_COVERAGE", "-", null);
//        } else if(planType.equals(DHMO)) {
            benefitNameResult = new ArrayList<>();
            result.put(DHMO, benefitNameResult);
            
            addBenefit(benefitNameResult, benefitNames, "ORAL_EXAMINATION", "-", null);
            addBenefit(benefitNameResult, benefitNames, "ADULT_PROPHY", "-", null);
            addBenefit(benefitNameResult, benefitNames, "CHILD_PROPHY", "-", null);
            addBenefit(benefitNameResult, benefitNames, "SILVER_FILL_1_SURFACE", "-", null);
            addBenefit(benefitNameResult, benefitNames, "WHITE_FILL_1_SURFACE_ANTERIOR", "-", null);
            addBenefit(benefitNameResult, benefitNames, "MOLAR_ROOT_CANAL", "-", null);
            addBenefit(benefitNameResult, benefitNames, "PERIO_MAINTAINANCE", "-", null);
            addBenefit(benefitNameResult, benefitNames, "SIMPLE_EXTRACTION_ERUPTED_TOOTH", "-", null);
            addBenefit(benefitNameResult, benefitNames, "ORTHO_SERVICES_ADULTS", "-", null);
            addBenefit(benefitNameResult, benefitNames, "ORTHO_SERVICES_CHILDREN", "-", null);
//        } else if(planType.equals(VISION)) {
            benefitNameResult = new ArrayList<>();
            result.put(VISION, benefitNameResult);
            
            addBenefit(benefitNameResult, benefitNames, "EXAMS_FREQUENCY", "-", null);
            addBenefit(benefitNameResult, benefitNames, "LENSES_FREQUENCY", "-", null);
            addBenefit(benefitNameResult, benefitNames, "FRAMES_FREQUENCY", "-", null);
            addBenefit(benefitNameResult, benefitNames, "CONTACTS_FREQUENCY", "-", null);
            addBenefit(benefitNameResult, benefitNames, "EXAM_COPAY", "-", null);
            addBenefit(benefitNameResult, benefitNames, "MATERIALS_COPAY", "-", null);
            addBenefit(benefitNameResult, benefitNames, "CONTACTS_ALLOWANCE", "-", null);
            addBenefit(benefitNameResult, benefitNames, "FRAME_ALLOWANCE", "-", null);

//        } else if(planType.startsWith("RX_")) {
            benefitNameResult = new ArrayList<>();
            result.put("RX_HMO", benefitNameResult);
            result.put("RX_PPO", benefitNameResult);
            result.put("RX_HSA", benefitNameResult);

            addBenefit(benefitNameResult, benefitNames, "RX_INDIVIDUAL_DEDUCTIBLE", "-", null);
            addBenefit(benefitNameResult, benefitNames, "RX_FAMILY_DEDUCTIBLE", "-", null);
            addBenefit(benefitNameResult, benefitNames, "MEMBER_COPAY_TIER_1", "-", null);
            addBenefit(benefitNameResult, benefitNames, "MEMBER_COPAY_TIER_2", "-", null);
            addBenefit(benefitNameResult, benefitNames, "MEMBER_COPAY_TIER_3", "-", null);
            addBenefit(benefitNameResult, benefitNames, "MEMBER_COPAY_TIER_4", "-", null);
            addBenefit(benefitNameResult, benefitNames, "MAIL_ORDER", "-", null);
//        }else{
//            throw new BaseException("Plan type not found!");
//        }

        return result;
    }

    // FIXME can we reuse result of getBenefitNamesByPlanType() API to get only one mapping place?
    public void addPlaceHolderBenefitsToPlan(List<BenefitName> benefitNames, Carrier carrier, Plan plan) {
        String type = plan.getPlanType();

        if(type.equals("HMO")) {
            createBenefitInPlan(plan, benefitNames, "INDIVIDUAL_DEDUCTIBLE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "INDIVIDUAL_OOP_LIMIT", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "PCP", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "SPECIALIST", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "INPATIENT_HOSPITAL", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "IP_COPAY_MAX", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "IP_COPAY_TYPE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "OUTPATIENT_SURGERY", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "EMERGENCY_ROOM", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "DEDUCTIBLE_TYPE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "COMBINE_MED_RX_DEDUCTIBLE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "URGENT_CARE", "IN", "-");

            //Rx is included in the actual plan for Anthem
            if(!equalsAny(UHC.name(), appCarrier)){
                createRxBenefitsInPlan(benefitNames, plan);
            }
        } else if(type.equals("PPO") || type.equals("HSA")) {
            createBenefitInPlan(plan, benefitNames, "INDIVIDUAL_DEDUCTIBLE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "INDIVIDUAL_DEDUCTIBLE", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "CO_INSURANCE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "CO_INSURANCE", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "INDIVIDUAL_OOP_LIMIT", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "INDIVIDUAL_OOP_LIMIT", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "PCP", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "PCP", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "SPECIALIST", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "SPECIALIST", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "INPATIENT_HOSPITAL", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "INPATIENT_HOSPITAL", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "IP_PER_OCCURENCE_DEDUCTIBLE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "OUTPATIENT_SURGERY", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "OUTPATIENT_SURGERY", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "EMERGENCY_ROOM", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "EMERGENCY_ROOM", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "DEDUCTIBLE_TYPE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "COMBINE_MED_RX_DEDUCTIBLE", "IN", "-");

            //Rx is included in the actual plan for Anthem
            if(!equalsAny(UHC.name(), appCarrier)){
                createRxBenefitsInPlan(benefitNames, plan);
            }
        } else if(type.equals("DPPO")) {
            createBenefitInPlan(plan, benefitNames, "CALENDAR_YEAR_MAXIMUM", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "CALENDAR_YEAR_MAXIMUM", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "DENTAL_INDIVIDUAL", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "DENTAL_INDIVIDUAL", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "DENTAL_FAMILY", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "DENTAL_FAMILY", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "WAIVED_FOR_PREVENTIVE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "CLASS_1_PREVENTIVE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "CLASS_1_PREVENTIVE", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "CLASS_2_BASIC", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "CLASS_2_BASIC", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "CLASS_3_MAJOR", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "CLASS_3_MAJOR", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "CLASS_4_ORTHODONTIA", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "CLASS_4_ORTHODONTIA", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "ORTHODONTIA_LIFETIME_MAX", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "ORTHODONTIA_LIFETIME_MAX", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "ORTHO_ELIGIBILITY", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "ORTHO_ELIGIBILITY", "OUT", "-");
            createBenefitInPlan(plan, benefitNames, "REIMBURSEMENT_SCHEDULE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "IMPLANT_COVERAGE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "IMPLANT_COVERAGE", "OUT", "-");

        } else if(type.equals("DHMO")) {
            createBenefitInPlan(plan, benefitNames, "ORAL_EXAMINATION", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "ADULT_PROPHY", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "CHILD_PROPHY", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "SILVER_FILL_1_SURFACE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "WHITE_FILL_1_SURFACE_ANTERIOR", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "MOLAR_ROOT_CANAL", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "PERIO_MAINTAINANCE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "SIMPLE_EXTRACTION_ERUPTED_TOOTH", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "ORTHO_SERVICES_ADULTS", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "ORTHO_SERVICES_CHILDREN", "IN", "-");

        } else if(type.equals("VISION")) {
            createBenefitInPlan(plan, benefitNames, "EXAMS_FREQUENCY", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "LENSES_FREQUENCY", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "FRAMES_FREQUENCY", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "CONTACTS_FREQUENCY", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "EXAM_COPAY", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "MATERIALS_COPAY", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "CONTACTS_ALLOWANCE", "IN", "-");
            createBenefitInPlan(plan, benefitNames, "FRAME_ALLOWANCE", "IN", "-");

        } else if(type.equals("RX_HMO") || type.equals("RX_PPO") || type.equals("RX_HSA")) {
            // filter incorrect and unavailable DENTAL and VISION types: RX_DPPO, RX_DHMO, RX_VISION
            createRxBenefitsInPlan(benefitNames, plan);
        }
    }
    
    private void createRxBenefitsInPlan(List<BenefitName> benefitNames, Plan plan) {
        for(Rx rx : Constants.RX) {
            createBenefitInPlan(plan, benefitNames, rx.sysName, "IN", "-");
        }
    }

    private BenefitName lookupBenefitName(List<BenefitName> benefitNames, String benName)
        throws IllegalArgumentException {
        for(BenefitName bn : benefitNames) {
            if(bn.getName().equals(benName)) { return bn; }
        }
        throw new IllegalArgumentException("Benefit with name: " + benName
            + " was not found in list of allowed benefits. Aborting.");
    }
}
