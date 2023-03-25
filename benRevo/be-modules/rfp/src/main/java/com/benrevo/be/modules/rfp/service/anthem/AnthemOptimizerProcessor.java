package com.benrevo.be.modules.rfp.service.anthem;

import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.SharedClientMemberService;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.*;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Comment;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemOptimizerProcessor {

    private static final int EXHIBIT_PLANS_ROW_NUM = 19;
    private static final int EXHIBIT_PLANS_START_ROW = 6;
    private static final int MAX_KEY_LEN = 50;

    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private BrokerRepository brokerRepository;
    
    @Autowired
    private RfpRepository rfpRepository;
    
    @Autowired
    private BenefitRepository benefitRepository;
    
    @Autowired
    private RfpToPnnRepository rfpToPnnRepository;
    
    @Autowired
    private ClientRfpProductRepository clientRfpProductRepository;

    @Autowired
    private SharedClientMemberService sharedClientMemberService;
    
    private class PlanInfo {
        
        RFP rfp;
        Option option;
        PlanNameByNetwork pnn;
        Long enrollment;

        public PlanInfo(RFP rfp, Option option, PlanNameByNetwork pnn) {
            this.rfp = rfp;
            this.option = option;
            this.pnn = pnn;
        }

        public long getEnrollment() {
            if (enrollment == null) {
                enrollment = longValue(option.getCensusTier1()) + 
                        longValue(option.getCensusTier2()) + 
                        longValue(option.getCensusTier3()) + 
                        longValue(option.getCensusTier4());
            }
            return enrollment;
        }
        
    }
    
    public byte[] build(String path, Long clientId, List<Long> rfpIds) {

        Client client = clientRepository.findOne(clientId);
        
        if (client == null) {
            throw new BaseException("Client not found");
        }
        
        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder
                .getContext()
                .getAuthentication();

        Long currentBrokerId = (Long) authentication.getDetails();
        Broker currentBroker = brokerRepository.findOne(currentBrokerId);
        if (currentBroker == null) {
            throw new BaseException("Broker not found");
        }
        
        Map<String, Object> data = new HashMap<String, Object>(320);

        data.put("client_name", client.getClientName());
        data.put("client_zip", getDoubleOrString(client.getZip()));
        data.put("client_sic", getDoubleOrString(client.getSicCode()));
        // commented out - calculated in excel
        //data.put("total_employees", client.getEligibleEmployees());
        data.put("effective_date", client.getEffectiveDate());
        data.put("due_date", client.getDueDate());
        data.put("cobra_enrollees", client.getCobraCount());
        
        if (! currentBroker.isGeneralAgent()) {
            List<ClientMemberDto> contacts = sharedClientMemberService.getByClientId(clientId);
            if(!contacts.isEmpty()) {
                data.put("broker_email", contacts.get(0).getEmail());
            }
            // broker
            data.put("agent_name", "No GA");
        } else {
            List<ClientMemberDto> contacts = sharedClientMemberService.getByClientId(clientId);
            ClientMemberDto gaContact = contacts.stream()
                .filter(c -> currentBroker.getBrokerId().equals(c.getBrokerageId()))
                .findFirst()
                .orElse(null);
            if(gaContact != null) {
                data.put("agent_email", gaContact.getEmail());
            }
            // general agent
            String agentName = currentBroker.getName();
            if ("LISI".equalsIgnoreCase(agentName)) {
                data.put("agent_name", "LISI");
            } else if ("Warner Pacific".equalsIgnoreCase(agentName)) {
                data.put("agent_name", "Warner Pacific");
            }else{
                data.put("agent_name", agentName);
            }
        }

        Broker broker = client.getBroker();
        data.put("broker_name", broker.getName());
       
        data.put("sales_name", client.getSalesFullName());
        data.put("presales_name", client.getPresalesFullName());

        int medical_tiers = 0;
        int dental_tiers = 0;
        int vision_tiers = 0;
        boolean isDentalVoluntary = false; 

        boolean isMedicalVirgin = false;
        boolean isDentalVirgin = false;
        boolean isVisionVirgin = false;
        
        for ( ClientRfpProduct clientRfpProduct : clientRfpProductRepository.findByClientId(clientId)) {
            if (clientRfpProduct.isVirginGroup()) {
                String product = clientRfpProduct.getExtProduct().getName();
                if (Constants.MEDICAL.equals(product)) {
                    isMedicalVirgin = true;
                } else if (Constants.DENTAL.equals(product)) {
                    isDentalVirgin = true;
                } else if (Constants.VISION.equals(product)) {
                    isVisionVirgin = true;
                }
            }
        };

        List<RFP> rfps = (rfpIds == null) ? 
                rfpRepository.findByClientClientId(clientId) :
                rfpRepository.findByClientClientIdAndRfpIdIn(clientId, rfpIds);
            
        // collect plans        
        List<PlanInfo> plans = new ArrayList<>();
        for (RFP rfp : rfps) {
            if (rfp.getOptions() != null) {
                for (Option option : rfp.getOptions()) {
                    RfpToPnn rfpToPnn = rfpToPnnRepository
                            .findByRfpRfpIdAndOptionIdAndPlanType(rfp.getRfpId(), option.getId(),
                                option.getPlanType());
                    if (rfpToPnn != null) {
                        PlanNameByNetwork pnn = rfpToPnn.getPnn();
                        if (pnn != null) {
                            plans.add(new PlanInfo(rfp, option, pnn));
                        }
                    }
                }
            }
        }

        for (RFP rfp : rfps) {
            switch (rfp.getProduct()) {
                case Constants.MEDICAL :
                    medical_tiers = rfp.getRatingTiers();
                    data.put("medical_tiers", Double.valueOf(medical_tiers));
                    fillCommission(data, rfp, "medical_commission");  
                    if ( rfp.isAlongside() && rfp.isTakeOver() ) {
                        data.put("kaiser_options", "Alongside and Total Takeover");
                    } else if ( rfp.isAlongside() ) {
                        data.put("kaiser_options", "Alongside Kaiser");
                    } else if ( rfp.isTakeOver() ) {
                        data.put("kaiser_options", "Total Takeover");        
                    }
                    setCarrierHistory(data, rfp.getCarrierHistories());
                    processMedicalAttributes(rfp, data);
                    break;
                case Constants.DENTAL :
                    dental_tiers = rfp.getRatingTiers();
                    data.put("dental_tiers", Double.valueOf(dental_tiers));
                    fillCommission(data, rfp, "dental_commission");
                    isDentalVoluntary = Constants.ER_CONTRIBUTION_TYPE_VOLUNTARY
                            .equalsIgnoreCase(rfp.getContributionType());
                    processDentalAttributes(rfp, data);
                    break;
                case Constants.VISION :
                    vision_tiers = rfp.getRatingTiers();
                    data.put("vision_tiers", Double.valueOf(vision_tiers));
                    fillCommission(data, rfp, "vision_commission");
                    break;
            }
        };
        
        plans.sort(Comparator
            .<PlanInfo>comparingLong( p -> p.getEnrollment())
            .reversed() );
        
        int medicalPlanNum = 0;
        int dppoPlanNum = 0;
        int dhmoPlanNum = 0;
        int visionPlanNum = 0;
        PlanInfo highestEnrollmentDentalPlan = null;
        for ( PlanInfo planInfo : plans ) {
            Plan plan = planInfo.pnn.getPlan();
            switch(planInfo.option.getPlanType()) {
            
            case "DPPO":
                if ( dppoPlanNum > 1 ) {
                    // skip
                    break;
                }
                if (!isDentalVirgin) {
                    setPlanInfo(data, "dppo" + dppoPlanNum + "_", planInfo, dental_tiers);
                    addDppoBenefitInfo(data, dppoPlanNum, plan);
                }
                if (highestEnrollmentDentalPlan == null) {
                    highestEnrollmentDentalPlan = planInfo;
                }
                dppoPlanNum ++ ;
                break;

            case "DHMO":
                if ( dhmoPlanNum > 0 ) {
                    // skip
                    break;
                }
                if (!isDentalVirgin) {
                    // set current plan info
                    setPlanInfo(data, "dhmo" + dhmoPlanNum + "_", planInfo, dental_tiers);
                    addDhmoBenefitInfo(data, dhmoPlanNum, plan);
                }
                if (highestEnrollmentDentalPlan == null) {
                    highestEnrollmentDentalPlan = planInfo;
                }
                dhmoPlanNum ++ ;
                break;
            
            case "VISION":
                if ( visionPlanNum > 0 ) {
                    // skip
                    break;
                }
                String visionPrefix = "vision" + visionPlanNum + "_";
                if (!isVisionVirgin) {
                    // set current plan info
                    setPlanInfo(data, visionPrefix, planInfo, vision_tiers);
                    data.put(visionPrefix + "carrier", plan.getCarrier().getDisplayName());
                }
                data.put(visionPrefix + "ee_contr", getEeContribution(planInfo));
                data.put(visionPrefix + "dep_contr", getDepContribution(planInfo, vision_tiers));
                visionPlanNum ++ ;
                break;
            
            default:
                if ( isMedicalVirgin || medicalPlanNum > 9 ) {
                    // skip
                    break;
                }
                String medicalPrefix = "medical" + medicalPlanNum + "_";
                
                setPlanInfo(data, medicalPrefix, planInfo, medical_tiers);
                addMedicalBenefitInfo(data, medicalPrefix, plan);

                data.put(medicalPrefix + "carrier", plan.getCarrier().getDisplayName());
                data.put(medicalPrefix + "ee_contr", getEeContribution(planInfo));
                data.put(medicalPrefix + "dep_contr", getDepContribution(planInfo, medical_tiers));

                medicalPlanNum ++ ;
                break;
            }
        }

        data.put("medical_plan_num", Double.valueOf(medicalPlanNum));

        if (highestEnrollmentDentalPlan != null) {
            data.put("dental_ee_contr", getEeContribution(highestEnrollmentDentalPlan));
            data.put("dental_dep_contr", getDepContribution(highestEnrollmentDentalPlan, dental_tiers));
            if (!isDentalVirgin) {
                // set current carrier
                data.put("dental_carrier", highestEnrollmentDentalPlan.pnn.getPlan().getCarrier().getDisplayName());
            }
        }
        
        if ( dppoPlanNum == 0 && dhmoPlanNum == 0 ) {
            data.put("dental_options", "N/A");
        } else if ( dppoPlanNum == 1 && dhmoPlanNum == 0 ) {
            data.put("dental_options", isDentalVoluntary ? "Voluntary Single Option PPO" : "Single Option PPO");
        } else if ( dppoPlanNum > 1 && dhmoPlanNum == 0 ) {
            data.put("dental_options", isDentalVoluntary ? "Voluntary Dual Option PPO" : "Dual Option PPO");
        } else if ( dppoPlanNum == 0 && dhmoPlanNum == 1 ) {
            data.put("dental_options", isDentalVoluntary ? "Voluntary Single Option DHMO" : "Single Option DHMO");
        } else if ( dppoPlanNum == 0 && dhmoPlanNum > 1 ) {
            data.put("dental_options", isDentalVoluntary ? "Voluntary Dual Option DHMO" : "Dual Option DHMO");
        } else if ( dppoPlanNum > 0 && dhmoPlanNum > 0 ) {
            data.put("dental_options", isDentalVoluntary ? "Voluntary Dual Option PPO & DHMO" : "Dual Option PPO & DHMO");
        } 

        if ( visionPlanNum > 0 ) {
            data.put("vision_options", "Blue View Vision");
        } 

        // apply template
        try ( InputStream is = getClass().getResourceAsStream(path);
              Workbook myWorkBook = new XSSFWorkbook (is); ) {
            int startRowExhibitPlans = EXHIBIT_PLANS_START_ROW;
            int endRowExhibitPlans = startRowExhibitPlans + EXHIBIT_PLANS_ROW_NUM * medicalPlanNum;

            for (Sheet sheet : myWorkBook) {
                for (Row r : sheet) {
                    boolean unhide = false;
                    for (Cell c : r) {
                        Comment cellComment = c.getCellComment();
                        if (cellComment != null) {
                            RichTextString rtsComment = cellComment.getString();
                            if ( rtsComment.length() > 2 && rtsComment.length() < MAX_KEY_LEN) {
                                String comment = rtsComment.getString().trim();
                                 if ( comment.charAt(0) == '{' && comment.charAt(comment.length() - 1) == '}' ) {
                                    // found special comment
                                    String key = comment.substring(1, comment.length() - 1);
                                    // remove special comment
                                    c.setCellComment(null);
                                    Object value = data.get(key);
                                    if (value instanceof Float) {
                                        c.setCellType(CellType.NUMERIC);
                                        c.setCellValue((Float) value);
                                    } else if (value instanceof Long) {
                                        c.setCellType(CellType.NUMERIC);
                                        c.setCellValue((Long) value);
                                    } else if (value instanceof Double) {
                                        c.setCellType(CellType.NUMERIC);
                                        c.setCellValue((Double) value);
                                        unhide = key.contains("rate") || key.contains("census");
                                    } else if (value instanceof String) {
                                        c.setCellType(CellType.STRING);
                                        c.setCellValue((String) value);
                                    } else if (value instanceof Date) {
                                        c.setCellType(CellType.NUMERIC);
                                        c.setCellValue((Date) value);
                                    } else if (value instanceof Integer) {
                                        c.setCellType(CellType.NUMERIC);
                                        c.setCellValue((Integer) value);
                                    }
                                }
                            }
                        }
                    }
                    if ("EXHIBIT".equals(sheet.getSheetName()) 
                            && r.getRowNum() > startRowExhibitPlans 
                            && r.getRowNum() < endRowExhibitPlans) {
                        unhide = true;
                    }
                    if (unhide) {
                        r.setZeroHeight(false);
                    }
                }
            }
            
            // recalculate formulas
            myWorkBook.getCreationHelper().createFormulaEvaluator().evaluateAll();
    
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            myWorkBook.write(baos);
            return baos.toByteArray();
            
        } catch (IOException e) {
            throw new BaseException("Can't process Optimizer file", e);
        }
    }

    private void fillCommission(Map<String, Object> data, RFP rfp, String key) {

        if (rfp == null || rfp.getPaymentMethod() == null || rfp.getCommission() == null) {
            return;
        }
        
        switch(rfp.getPaymentMethod()) {
            case "%":
                data.put(key , Double.valueOf(rfp.getCommission()) / 100);
                break;
            case "COMMISSION":
                data.put(key, "Net of Commission");
                break;
            case "PEPM":
            case "$":
                data.put(key, "$" + rfp.getCommission() + " PEPM");
                break;
            default:
                // do nothing
        }
    }

    private void processMedicalAttributes(RFP rfp, Map<String, Object> data) {
        for (RFPAttribute attribute : rfp.getAttributes()) {
            switch (attribute.getName()) {
                case FIXED_UW_COMMENTS:
                    data.put("FIXED_UW_COMMENTS", attribute.getValue());
                    break;
                case INVALID_WAIVERS:
                    data.put("INVALID_WAIVERS", attribute.getValue());
                    break;
                case KAISER_OR_SIMNSA:
                    data.put("kaiser_options", attribute.getValue());
                    break;
                case TEXT_UW_COMMENTS:
                    data.put("TEXT_UW_COMMENTS", attribute.getValue());
                    break;
                case VALID_WAIVERS:
                    data.put("VALID_WAIVERS", attribute.getValue());
                    break;
                default:
                    break;
            }
        }
    }

    private void processDentalAttributes(RFP rfp, Map<String, Object> data) {
        boolean contactLength12 = false;
        boolean contactLength24 = false;
        for (RFPAttribute attribute : rfp.getAttributes()) {
            switch (attribute.getName()) {
                case CONTRACT_LENGTH_12_MONTHS:
                    contactLength12 = true;
                    break;
                case CONTRACT_LENGTH_24_MONTHS:
                    contactLength24 = true;
                    break;
                case QUOTING_SCENARIOS:
                    data.put("QUOTING_SCENARIOS", attribute.getValue());
                    break;
                case TYPE_OF_PLAN:
                    data.put("TYPE_OF_PLAN", attribute.getValue());
                    break;
                default:
                    break;
            }
        }
        if (contactLength12 && contactLength24) {
            data.put("CONTRACT_LENGTH", "24 & 12 Months");
        } else if (contactLength12) {
            data.put("CONTRACT_LENGTH", "12 Months");
        } else if (contactLength24) {
            data.put("CONTRACT_LENGTH", "24 Months");
        }
        
    }

    
    private void addDhmoBenefitInfo(Map<String, Object> data, int index, Plan plan) {
        if (plan == null || plan.getBenefits() == null) {
            return;
        }    
        for (Benefit benefit : plan.getBenefits()) {
            String name = benefit.getBenefitName().getName();
            String value = getBenefitRawValue(benefit);
            if (name.equals("PRODUCT_TYPE")) {
                data.put(String.format("PRODUCT_TYPE%s",index), value);
            } else if (name.equals("NETWORK")) {
                data.put(String.format("NETWORK%s",index), value);
            } 
        } 
    }

    private void addDppoBenefitInfo(Map<String, Object> data, int index, Plan plan) {
        if (plan == null || plan.getBenefits() == null) {
            return;
        }    
        for (Benefit benefit : plan.getBenefits()) {
            String name = benefit.getBenefitName().getName();
            String inOut = benefit.getInOutNetwork();
            String value = getBenefitRawValue(benefit);
            String restriction = benefit.getRestriction();
            switch (name) {
                case "CLASS_1_PREVENTIVE":
                case "CLASS_2_BASIC":  
                case "NON_SURGICAL_ENDODONTICS":
                case "SURGICAL_ENDODONTICS":
                case "NON_SURGICAL_PERIODONTICS":
                case "SURGICAL_PERIODONTICS":
                case "SIMPLE_ORAL_SURGERY":
                case "COMPLEX_ORAL_SURGERY":
                case "CLASS_3_MAJOR":
                case "PROSTHDONTIC":
                case "CLASS_4_ORTHODONTIA":
                case "DENTAL_INDIVIDUAL":
                case "LIFETIME_DEDUCTIBLE":
                case "WAIVED_FOR_PREVENTIVE":
                case "CALENDAR_YEAR_MAXIMUM":
                case "INDIVIDUAL_OOP_LIMIT":
                    data.put(String.format("%s_%s%s",name,inOut,index), value);
                    if (restriction != null && inOut.equals("IN")) {
                        data.put(String.format("%s_%s%s",name,"RST",index), restriction);
                    }
                    break;
                case "BASIC_WAITING_PERIOD":    
                case "MAJOR_WAITING_PERIOD":
                case "ORTHO_ELIGIBILITY":
                case "ORTHODONTIA_LIFETIME_MAX":
                case "ORTHODONTIA_WAITING_PERIOD":
                case "OFFICE_COPAY":
                case "DENTAL_FAMILY":
                case "CALENDAR_YEAR_MAXIMUM_CARRYOVER":
                case "CARRY_IN":
                case "PREVENTIVE_APPLIES":
                case "FAMILY_OOP_LIMIT":
                case "REIMBURSEMENT_SCHEDULE":
                case "CHILD_DEPENDENT_AGE":
                case "CHILD_ORTHONTIC_DEPENDENT_AGE":
                case "SEALANTS":
                case "POSTERIOR_COMPOSITES":
                case "IMPLANT_COVERAGE":
                case "BRUSH_BIOPSY":
                case "COSMETICS":
                case "TMJ":
                case "ORAL_EXAMINATION":
                case "ADULT_PROPHY":
                case "BITEWING_X_RAY":
                case "FULL_MOUTH_X_RAY":
                case "FLUORIDE":
                case "PERIO_MAINTAINANCE": 
                case "CROWNS":
                    data.put(String.format("%s%s",name,index), value);
                    break;
            }
        } 
    }

    private void setCarrierHistory( Map<String, Object> data, List<CarrierHistory> carrierHistories ) {

        if (carrierHistories == null) { return; }

        int indexHistory = 0;
        // find current history with max years 
        CarrierHistory maxCurrentHistory = carrierHistories
                .stream()
                .filter(CarrierHistory::isCurrent)
                .max( Comparator.comparing(CarrierHistory::getYears) )
                .orElse(null);
        
        if (maxCurrentHistory != null) {
            for (int i=0; i < maxCurrentHistory.getYears(); i++) {
                data.put("history" + indexHistory, maxCurrentHistory.getName());
                if ( indexHistory >= 4 ) { return; }
                indexHistory ++;
            }
        }
        
        for (CarrierHistory h : carrierHistories) {
            if (h.isCurrent()) { continue; }
            for (int i=0; i < h.getYears(); i++) {
                data.put("history" + indexHistory, h.getName());
                if ( indexHistory >= 4 ) { return; }
                indexHistory ++;
            }
        }
        
    }
    
    private void setPlanInfo(Map<String, Object> data, String prefix, PlanInfo planInfo, int num_tiers) {

        Plan plan = planInfo.pnn.getPlan();
        
        data.put(prefix + "type", derivePlanType(planInfo.pnn.getNetwork().getName(), plan.getPlanType()));
        data.put(prefix + "name", plan.getName());
        
        data.put(prefix + "rate1", planInfo.option.getRateTier1());
        data.put(prefix + "census1", planInfo.option.getCensusTier1());
        data.put(prefix + "renewal1", planInfo.option.getRenewalTier1());
        
        if (num_tiers > 1) {
            data.put(prefix + "rate2", planInfo.option.getRateTier2());
            data.put(prefix + "census2", planInfo.option.getCensusTier2());
            data.put(prefix + "renewal2", planInfo.option.getRenewalTier2());
        }
        if (num_tiers > 2) {
            data.put(prefix + "rate3", planInfo.option.getRateTier3());
            data.put(prefix + "census3", planInfo.option.getCensusTier3());
            data.put(prefix + "renewal3", planInfo.option.getRenewalTier3());
        }
        if (num_tiers > 3) {
            data.put(prefix + "rate4", planInfo.option.getRateTier4());
            data.put(prefix + "census4", planInfo.option.getCensusTier4());
            data.put(prefix + "renewal4", planInfo.option.getRenewalTier4());
        }
    }

    private void addMedicalBenefitInfo(Map<String, Object> data, String prefix, Plan plan) {
        String deductible ="";
        String pcp ="";
        String specialist ="";
        String oop ="";
        String inpatient = "";
        String outpatient = "";
        String rxDeductible ="";
        String rxFamilyDeductible ="";
        String rxTier1 ="";
        String rxTier2 ="";
        String rxTier3 ="";
        String rxTier4 ="";
        String rxMo ="";
        List<Benefit> benefits = benefitRepository.findByPlanId(plan.getPlanId());
        for (Benefit benefit : benefits) {
            switch(benefit.getBenefitName().getName()) {
            case "INDIVIDUAL_DEDUCTIBLE":
                if ("IN".equals(benefit.getInOutNetwork())) {
                    deductible = getBenefitRawValue(benefit) + deductible;
                } else { // OUT
                    deductible = deductible + "/" + getBenefitRawValue(benefit);
                };
                break;
            case "PCP":
                if ("IN".equals(benefit.getInOutNetwork())) {
                    pcp = getBenefitRawValue(benefit);
                } 
                break;
            case "SPECIALIST":
                if ("IN".equals(benefit.getInOutNetwork())) {
                    specialist = getBenefitRawValue(benefit);
                }
                break;
            case "INDIVIDUAL_OOP_LIMIT":
                if ("IN".equals(benefit.getInOutNetwork())) {
                    oop = getBenefitRawValue(benefit) + oop;
                } else { // OUT
                    oop = oop + "/" + getBenefitRawValue(benefit);
                };
                break;
            case "INPATIENT_HOSPITAL":
                if ("IN".equals(benefit.getInOutNetwork())) {
                    inpatient = getBenefitRawValue(benefit) + inpatient;
                } else { // OUT
                    inpatient = inpatient + "/" + getBenefitRawValue(benefit);
                };
                break;
            case "OUTPATIENT_SURGERY":
                if ("IN".equals(benefit.getInOutNetwork())) {
                    outpatient = getBenefitRawValue(benefit) + outpatient;
                } else { // OUT
                    outpatient = outpatient + "/" + getBenefitRawValue(benefit);
                };
                break;
            case "RX_INDIVIDUAL_DEDUCTIBLE":
                rxDeductible = getBenefitRawValue(benefit);
                break;
            case "RX_FAMILY_DEDUCTIBLE":
                rxFamilyDeductible = getBenefitRawValue(benefit);
                break;
            case "MEMBER_COPAY_TIER_1":
                rxTier1 = getBenefitRawValue(benefit);
                break;
            case "MEMBER_COPAY_TIER_2":
                rxTier2 = getBenefitRawValue(benefit);
                break;
            case "MEMBER_COPAY_TIER_3":
                rxTier3 = getBenefitRawValue(benefit);
                break;
            case "MEMBER_COPAY_TIER_4":
                rxTier4 = getBenefitRawValue(benefit);
                break;
            case "MAIL_ORDER":
                rxMo = getBenefitRawValue(benefit);
                break;
            }
        }
        data.put(prefix + "deductible", deductible);
        data.put(prefix + "oop", oop);
        data.put(prefix + "copay", pcp + "/" + specialist);
        data.put(prefix + "inpatient", inpatient);
        data.put(prefix + "outpatient", outpatient);
        data.put(prefix + "rx", String.format("%s/%s %s/%s/%s/%s %s", 
                rxDeductible, rxFamilyDeductible, rxTier1, rxTier2, rxTier3, rxTier4, rxMo));
    }

    private String getBenefitRawValue(Benefit benefit) {
        switch(benefit.getFormat()) {
        case "DOLLAR":
            return "$" + benefit.getValue();
        case "PERCENT":
            return benefit.getValue() + "%";
        case "MULTIPLE":
            return benefit.getValue() + "x";
        }
        return benefit.getValue();
    }

    private Double getEeContribution(PlanInfo planInfo) {
        if (planInfo.rfp.getContributionType().equals("%")) {
            return doubleValue(planInfo.option.getContributionTier1()) / 100;
        } else { // ER_CONTRIBUTION_FORMAT_DOLLAR
            return doubleValue(planInfo.option.getContributionTier1()) / 
                    (planInfo.option.getRateTier1() == null ? 1D : planInfo.option.getRateTier1());
        }
    }

    private Double getDepContribution(PlanInfo planInfo, int tierRates) {
        if (tierRates == 1) {
            return 0d;
        }
        if (planInfo.rfp.getContributionType().equals("%")) {
            if (tierRates == 2) {
                return doubleValue(planInfo.option.getContributionTier2()) / 100;
            } 
            if (tierRates == 3) { 
                return doubleValue(planInfo.option.getContributionTier3()) / 100;
            }
            return doubleValue(planInfo.option.getContributionTier4()) / 100;
        } else { // ER_CONTRIBUTION_FORMAT_DOLLAR
            if (tierRates == 2) {
                return doubleValue(planInfo.option.getContributionTier2()) / 
                        (planInfo.option.getRateTier2() == null ? 1D : planInfo.option.getRateTier2());
            } 
            if (tierRates == 3) {
                return doubleValue(planInfo.option.getContributionTier3()) / 
                        (planInfo.option.getRateTier3() == null ? 1D : planInfo.option.getRateTier3());
            }
            return doubleValue(planInfo.option.getContributionTier4()) / 
                    (planInfo.option.getRateTier4() == null ? 1D : planInfo.option.getRateTier4());
        }
    }

    private Object getDoubleOrString(String value) {
        if (value == null) {  return null; }
        try {
            return Double.valueOf(value);
        } catch(NumberFormatException e) {
            return value; 
        }
    }
    
    private String derivePlanType(String networkName, String planType) {
        
        switch(planType) {
        case "HMO":
            if (networkName.toUpperCase().contains("PRIORITY")) {
                return "PSHMO";
            } else if (networkName.toUpperCase().contains("SELECT")) {
                return "SHMO";
            } else if (networkName.toUpperCase().contains("VIVITY")) {
                return "VIVITY";
            } else {
                return "THMO";
            }
        case "PPO":
            if (networkName.toUpperCase().contains("SOLUTION")) {
                return "SOL";
            } else {
                return "PPO";
            }
        case "HSA":
            return "CDHP";
        }
        
        return "THMO";
    }

    protected Cell getCell(Row row, char letter) {
        return row.getCell(letter - 'a');
    }

    protected static Long longValue(Double value) {
        return value == null ? 0L : value.longValue();
    }

    protected static Float floatValue(Double value) {
        return value == null ? 0F : value.floatValue();
    }

    protected static Double doubleValue(Double value) {
        return value == null ? 0D : value;
    }

}
