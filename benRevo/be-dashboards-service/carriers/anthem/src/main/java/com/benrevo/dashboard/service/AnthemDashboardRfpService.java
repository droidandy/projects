package com.benrevo.dashboard.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.be.modules.rfp.service.BaseRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.enums.RFPAttributeName;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemDashboardRfpService extends BaseRfpService {

    // Participation Rate to Participation Adjustment Factor
    // See sheet "PART ADJ 2" at Optimizer file
    private static double[] rateToFactor = {
            2.50D, 2.40D, 2.30D, 2.20D, 2.15D, 2.10D, 2.05D, 2.00D, 1.95D, 1.90D, 
            1.85D, 1.80D, 1.76D, 1.72D, 1.68D, 1.64D, 1.61D, 1.58D, 1.55D, 1.52D, 
            1.49D, 1.46D, 1.43D, 1.40D, 1.38D, 1.36D, 1.34D, 1.32D, 1.30D, 1.28D, 
            1.27D, 1.26D, 1.25D, 1.24D, 1.23D, 1.22D, 1.21D, 1.20D, 1.19D, 1.18D, 
            1.17D, 1.16D, 1.15D, 1.14D, 1.13D, 1.12D, 1.11D, 1.10D, 1.09D, 1.09D, 
            1.08D, 1.08D, 1.07D, 1.07D, 1.06D, 1.06D, 1.05D, 1.05D, 1.05D, 1.04D, 
            1.04D, 1.04D, 1.03D, 1.03D, 1.03D, 1.02D, 1.02D, 1.02D, 1.02D, 1.01D, 
            1.01D, 1.01D, 1.01D, 1.01D, 1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 
            1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 
            1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 1.00D, 
            1.00D };

    @Autowired
    private RfpToPnnRepository rfpToPnnRepository;

    @Override
    protected void validateRfpAttributes(RfpDto rfpDto) {
        rfpDto.getAttributes().forEach((name, value) -> {
            boolean error = false;
            if (rfpDto.getProduct().equals(Constants.MEDICAL)) {
                    switch (name) {
                        case FIXED_UW_COMMENTS:
                            error = !StringUtils.equalsAny(value, 
                                    "UW Approval Not Required", 
                                    "Claims Over $50K",
                                    "Known Disabilities",
                                    "Common Ownership",
                                    "Prior Client < 2 Yrs",
                                    "Virgin Group",
                                    "Other");
                            break;
                        case KAISER_OR_SIMNSA:
                            error = !StringUtils.equalsAny(value, 
                                    "N/A", 
                                    "Alongside Kaiser",
                                    "Alongside SIMNSA",
                                    "Alongside Kaiser/SIMNSA",
                                    "Total Takeover",
                                    "Alongside and Total Takeover");
                            break;
                        case TEXT_UW_COMMENTS:
                            // no restrictions
                            break;
                        case VALID_WAIVERS:
                        case INVALID_WAIVERS:
                            error = !StringUtils.isNumeric(value);
                            break;
                        default: // unexpected
                            error = true;
                            break;
                    };
            } else if (rfpDto.getProduct().equals(Constants.DENTAL)) {
                    switch (name) {
                        case CONTRACT_LENGTH_12_MONTHS:
                        case CONTRACT_LENGTH_24_MONTHS:
                            // no restrictions
                            break;
                        case QUOTING_SCENARIOS:
                            error = !StringUtils.equalsAny(value, 
                                    "Single Option PPO", 
                                    "Dual Option PPO",
                                    "Single Option DHMO",
                                    "Dual Option DHMO",
                                    "Dual Option PPO & DHMO",
                                    "Voluntary Single Option PPO",
                                    "Voluntary Dual Option PPO",
                                    "Voluntary Single Option DHMO",
                                    "Voluntary Dual Option DHMO",
                                    "Voluntary Dual Option PPO & DHMO");
                            break;
                        case TYPE_OF_PLAN:
                            error = !StringUtils.equalsAny(value, 
                                    "Calendar Year", 
                                    "Contract Year");
                            break;
                        default: // unexpected
                            error = true;
                            break;
                    };
            } else if (rfpDto.getProduct().equals(Constants.LIFE)) {
                    error = !(name == RFPAttributeName.CENSUS_PASSWORD);
            } else if (rfpDto.getProduct().equals(Constants.LTD)) {
                    error = !(name == RFPAttributeName.CENSUS_PASSWORD);
            } else { // should not have any attributes
                    error = true;
            }
            if (error) {
                throw new BadRequestException(
                        String.format("Illegal attribute name='%s' value='%s' for %s product", name, value, rfpDto.getProduct()));
            }
        });
    }

    @Override
    protected void calcRfpAttributes(List<RfpDto> rfpDtos) {
        
        RfpDto medicalRfp = null;
        RfpDto dentalRfp = null;
        for (RfpDto rfpDto : rfpDtos) {
            if (Constants.MEDICAL.equals(rfpDto.getProduct())) {
                medicalRfp = rfpDto;
            } else if (Constants.DENTAL.equals(rfpDto.getProduct())) {
                dentalRfp = rfpDto;
            }
        }
        Double medicalTotal = caclMedicalAttributes(medicalRfp);
        caclDentalAttributes(dentalRfp, medicalTotal);

    }

    private void caclDentalAttributes(RfpDto rfpDto, Double medicalTotal) {
        if (rfpDto == null || medicalTotal == null) { return;}

        double dentalTotalEnrollment = 0d;
        for (OptionDto option : rfpDto.getOptions()) {
            dentalTotalEnrollment += getEnrollment(option);
        };

        rfpDto.getAttributes().put(RFPAttributeName.DENTAL_PARTICIPATION, 
                Long.toString(Math.round(dentalTotalEnrollment * 100 / medicalTotal)) + "%");
    }

    private double getEnrollment(OptionDto option) {
        return getOrDefault(option.getTier1Census()) + 
            getOrDefault(option.getTier2Census()) + 
            getOrDefault(option.getTier3Census()) + 
            getOrDefault(option.getTier4Census());
    }

    private Double caclMedicalAttributes(RfpDto rfpDto) {
        
        if (rfpDto == null) { return null;}
        String validWaiversValue = rfpDto.getAttributes().get(RFPAttributeName.VALID_WAIVERS);
        if (validWaiversValue == null) { return null; }
        int validWaivers = Integer.parseInt(validWaiversValue);

        String invalidWaiversValue = rfpDto.getAttributes().get(RFPAttributeName.INVALID_WAIVERS);
        if (invalidWaiversValue == null) { return null; }
        int invalidWaivers = Integer.parseInt(invalidWaiversValue);

        double totalEnrollment = 0d;
        double kaiserEnrollment = 0d;
        for (OptionDto option : rfpDto.getOptions()) {
            double enrollment = getEnrollment(option);
            totalEnrollment += enrollment;
            
            RfpToPnn rfpToPnn = rfpToPnnRepository.findByRfpRfpIdAndOptionIdAndPlanType(
                    rfpDto.getId(), option.getId(), option.getPlanType());
            PlanNameByNetwork pnn = rfpToPnn != null ? rfpToPnn.getPnn() : null;
            if (pnn !=null && Constants.KAISER_CARRIER.equals(pnn.getNetwork().getCarrier().getName())) {
                kaiserEnrollment += enrollment;
            }
        };

        double net = totalEnrollment + invalidWaivers;
        double total = net + validWaivers;
 
        int totalParticipationNet = (int)Math.round(totalEnrollment * 100D / net);
        int anthemParticipationNet = (int)Math.round((totalEnrollment - kaiserEnrollment) * 100D / net);
        
        double totalParticipationFactor = rateToFactor[totalParticipationNet];
        double anthemParticipationFactor = rateToFactor[anthemParticipationNet];
        
        double hmoKaiserLoadFactorPartial = (1D / 3D * anthemParticipationFactor + 2D / 3D * totalParticipationFactor) 
                / totalParticipationFactor;
        double ppoKaiserLoadFactorPartial = (1D / 8D * anthemParticipationFactor + 7D / 8D * totalParticipationFactor) 
                / totalParticipationFactor;

        double hmoKaiserLoadFactorTotal = Math.max(1 / hmoKaiserLoadFactorPartial, 0.85D);
        double ppoKaiserLoadFactorTotal = Math.max(1 / ppoKaiserLoadFactorPartial, 0.93D);
        
        // Math.nextUp is needed for round accuracy 
        double hmoTotalFactor = Math.nextUp(totalParticipationFactor * hmoKaiserLoadFactorTotal);
        double ppoTotalFactor = Math.nextUp(totalParticipationFactor * ppoKaiserLoadFactorTotal);
        double hmoPartialFactor = Math.nextUp(totalParticipationFactor * hmoKaiserLoadFactorPartial);
        double ppoPartialFactor = Math.nextUp(totalParticipationFactor * ppoKaiserLoadFactorPartial);
        
        int hmoFirstAdjustmentFactorLoadTakeover = (int)Math.round(hmoTotalFactor * 100) - 100;
        int ppoFirstAdjustmentFactorLoadTakeover = (int)Math.round(ppoTotalFactor * 100) - 100;

        int hmoFirstAdjustmentFactorLoadAlongside = (int)Math.round(hmoPartialFactor * 100) - 100;
        int ppoFirstAdjustmentFactorLoadAlongside = (int)Math.round(ppoPartialFactor * 100) - 100;

        rfpDto.getAttributes().put(RFPAttributeName.TOTAL_EMPLOYEES, Integer.toString((int)total));
        rfpDto.getAttributes().put(RFPAttributeName.FACTOR_LOAD_TAKEOVER_HMO, Integer.toString(hmoFirstAdjustmentFactorLoadTakeover)+"%");
        rfpDto.getAttributes().put(RFPAttributeName.FACTOR_LOAD_TAKEOVER_PPO, Integer.toString(ppoFirstAdjustmentFactorLoadTakeover)+"%");
        rfpDto.getAttributes().put(RFPAttributeName.FACTOR_LOAD_ALONGSIDE_HMO, Integer.toString(hmoFirstAdjustmentFactorLoadAlongside)+"%");
        rfpDto.getAttributes().put(RFPAttributeName.FACTOR_LOAD_ALONGSIDE_PPO, Integer.toString(ppoFirstAdjustmentFactorLoadAlongside)+"%");
        return total;
    }

    private double getOrDefault(Double number) {
        if (number == null) { return 0D;}
        return number;
    }
    
}
