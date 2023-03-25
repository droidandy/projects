package com.benrevo.core.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.util.MathUtils.round;
import com.benrevo.be.modules.onboarding.service.document.AbstractDocumentDataService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.QuoteOptionContributionsDto;
import com.benrevo.common.dto.QuoteOptionFinalSelectionDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.FormType;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.repository.AnswerRepository;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("anthem-blue-cross-employer-application")
@AppCarrier(ANTHEM_BLUE_CROSS)
public class AnthemEmployerApplicationDataServiceImpl extends AbstractDocumentDataService {
    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private SharedRfpQuoteService rfpQuoteService;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;
    
    @Autowired
    private AttributeRepository attributeRepository;

    @Override
    public Map<String, String> getData(Client client) {
        RFP medicalRfp = rfpRepository.findByClientClientIdAndProduct(client.getClientId(), Constants.MEDICAL);
        RFP visionRfp = rfpRepository.findByClientClientIdAndProduct(client.getClientId(), Constants.VISION);
        RFP dentalRfp = rfpRepository.findByClientClientIdAndProduct(client.getClientId(), Constants.DENTAL);

        Map<String, String> answers = new HashMap<>(answerRepository.getAnswers(FormType.ANTHEM_EMPLOYER_APPLICATION.getMessage(), client.getClientId()));
        addGeneralInformation(client, answers);
        
        // map State to 2-letter abbreviation
        String state = answers.get("general_information_state");
        String stateAbbreviation = Constants.STATES_ABBREVIATIONS.get(state);
        if(stateAbbreviation != null) {
            answers.put("general_information_state", stateAbbreviation);
        }

        answers.put("total_employees", format(client.getEmployeeCount()));
        answers.put("groups_legal_name", format(client.getClientName()));
        int medicalRatingTiers = 0;
        if (medicalRfp != null) {
        	answers.put("medical_waiting_period_begin_date", format(medicalRfp.getWaitingPeriod()));
        	answers.put("medical_commission", format(medicalRfp.getCommission()));
        	medicalRatingTiers = medicalRfp.getRatingTiers();
        }
        answers.put("effective_date", client.getEffectiveDate() != null ? DateHelper.fromDateToString(client.getEffectiveDate(), Constants.ANTHEM_TEMPLATE_DATE_FORMAT) : "");

        int dentalRatingTiers = 0;
        if (dentalRfp != null) {
        	answers.put("dental_commission", format(dentalRfp.getCommission()));
        	dentalRatingTiers = dentalRfp.getRatingTiers();
        }
        int visionRatingTiers = 0;
        if (visionRfp != null) {
        	answers.put("vision_commission", format(visionRfp.getCommission()));
        	visionRatingTiers = visionRfp.getRatingTiers();
        }

        answers.put("total_anthem_eligible_employees", format(client.getEligibleEmployees()));
        
        // we cannot remove old answers if them was selected before, so check and filtering before template build
        String medicalWaitingPeriodFor = answers.get("medical_waiting_period_for");
        if (medicalWaitingPeriodFor != null && medicalWaitingPeriodFor.equalsIgnoreCase("ALL products sold (medical and specialty)")) {
          answers.remove("speciality_waiting_period_for");
          answers.remove("speciality_waiting_period_begin_date");
        }
        
        QuoteOptionFinalSelectionDto finalSelection = rfpQuoteService.getSelectedQuoteOptions(client.getClientId());

        if (finalSelection.getMedicalQuoteOptionId() != null) {
            List<QuoteOptionContributionsDto> contributions = rfpQuoteService.getQuoteOptionNetworkContributions(finalSelection.getMedicalQuoteOptionId());
            int planIndex = 1;

            for (QuoteOptionContributionsDto contribution : contributions) {
                if (contribution.isKaiserNetwork() || StringUtils.containsIgnoreCase(contribution.getCarrier(), CarrierType.KAISER.name())) {
                    continue;
                }
                RfpQuoteOptionNetwork optNetwork = rfpQuoteOptionNetworkRepository.findOne(contribution.getRfpQuoteOptionNetworkId());
                if (optNetwork.getSelectedRfpQuoteNetworkPlan() == null) {
                    continue; // skip
                }
                answers.put("medical_coverage_plan_name_" + planIndex, format(contribution.getPlanNameByNetwork()));
                fillRates(answers, optNetwork, "medical", planIndex, medicalRatingTiers);
                planIndex++;

                if (planIndex > 6) {
                    break;//only 6 plans are required
                }
                
            }
        }

        if (finalSelection.getDentalQuoteOptionId() != null) {
            List<QuoteOptionContributionsDto> contributions = rfpQuoteService.getQuoteOptionNetworkContributions(finalSelection.getDentalQuoteOptionId());
            int planIndex = 1;

            for (QuoteOptionContributionsDto contribution: contributions){
                RfpQuoteOptionNetwork optNetwork = rfpQuoteOptionNetworkRepository.findOne(contribution.getRfpQuoteOptionNetworkId());
                if (optNetwork.getSelectedRfpQuoteNetworkPlan() == null) {
                    continue; // skip
                }
                answers.put("dental_coverage_plan_name_" + planIndex, derivePlanName(optNetwork));
                fillRates(answers, optNetwork, "dental", planIndex, dentalRatingTiers);
                planIndex++;

                if(planIndex > 4){
                    break;//only 4 plans are supported by template
                }
            }
        }

        if (finalSelection.getVisionQuoteOptionId() != null) {
            List<QuoteOptionContributionsDto> contributions = rfpQuoteService.getQuoteOptionNetworkContributions(finalSelection.getVisionQuoteOptionId());
            int planIndex = 1;

            for (QuoteOptionContributionsDto contribution: contributions){
                RfpQuoteOptionNetwork optNetwork = rfpQuoteOptionNetworkRepository.findOne(contribution.getRfpQuoteOptionNetworkId());
                if (optNetwork.getSelectedRfpQuoteNetworkPlan() == null) {
                    continue; // skip
                }
                answers.put("vision_coverage_plan_name_" + planIndex, format(contribution.getPlanNameByNetwork()));
                fillRates(answers, optNetwork, "vision", planIndex, visionRatingTiers);
                planIndex++;

                if (planIndex > 2){
                    break;//only 2 plans are supported by template
                }
            }
        }
        answers.putAll(answerRepository.getMultiselectableAnswers(FormType.ANTHEM_EMPLOYER_APPLICATION.getMessage(), client.getClientId()));
        // answers.put("total_sponsored_anthem_eligible_employees", format());

        transformContactInformation(answers);

        return answers;
    }

    private String derivePlanName(RfpQuoteOptionNetwork optNetwork) {
        RfpQuoteNetworkPlan selectedPlan = optNetwork.getSelectedRfpQuoteNetworkPlan();
        if (selectedPlan == null) { return ""; }
        switch(selectedPlan.getPnn().getPlanType()) {
            case "DHMO":
                return selectedPlan.isVoluntary() ? "Voluntary Dental Net" : "Dental Net";
            case "DPPO":
                // find program attribute
                String program = attributeRepository
                    .findQuotePlanAttributeByRqnpId(selectedPlan.getRfpQuoteNetworkPlanId())
                    .stream()
                    .filter(a -> QuotePlanAttributeName.PROGRAM.equals(a.getName()))
                    .map(QuotePlanAttribute::getValue)
                    .findFirst()
                    .orElse("");
                
                if ("Prime".equals(program)) {
                    return selectedPlan.isVoluntary() ? "Dental Prime Voluntary" : "Dental Prime";
                } else {
                    return selectedPlan.isVoluntary() ? "Dental Complete Voluntary" : "Dental Complete";
                }
            default:
                return selectedPlan.getPnn().getName();
        }
    }

    
    private void fillRates(Map<String, String> answers, RfpQuoteOptionNetwork optNetwork, String prefix, int planIndex, int ratingTiers){
        RfpQuoteNetworkPlan plan = optNetwork.getSelectedRfpQuoteNetworkPlan();

        // take the dependent contribution from the largest tier that is available
        Float depContribution = 0F;
        Float depRate = 1F;

        if(plan != null) {
            switch(ratingTiers) {
                case 2:
                    depContribution = optNetwork.getTier2ErContribution();
                    depRate = plan.getTier2Rate();
                    break;
                case 3:
                    depContribution = optNetwork.getTier3ErContribution();
                    depRate = plan.getTier3Rate();
                    break;
                case 4:
                    depContribution = optNetwork.getTier4ErContribution();
                    depRate = plan.getTier4Rate();
                    break;
                default:
                    depContribution = 0F;
                    depRate = 1F;
            }
        }
        
        Float eeContribution;

        if (optNetwork.getErContributionFormat().equals(Constants.ER_CONTRIBUTION_FORMAT_PERCENT)){
            eeContribution = optNetwork.getTier1ErContribution();
        } else {
            eeContribution = round(optNetwork.getTier1ErContribution() / plan.getTier1Rate() * 100f, 0);
            depContribution = round(depContribution / depRate * 100f, 0);
        }

        if(optNetwork.isOutOfState()){
            answers.put(prefix + "_employee_ca_contribution_" + planIndex, "");
            answers.put(prefix + "_employee_non_ca_contribution_" + planIndex, format(eeContribution));
            answers.put(prefix + "_dependent_ca_contribution_" + planIndex, "");
            answers.put(prefix + "_dependent_non_ca_contribution_" + planIndex, (ratingTiers == 1) ? "N/A" : format(depContribution));
        }else{
            answers.put(prefix + "_employee_ca_contribution_" + planIndex, format(eeContribution));
            answers.put(prefix + "_employee_non_ca_contribution_" + planIndex, "");
            answers.put(prefix + "_dependent_ca_contribution_" + planIndex, (ratingTiers == 1) ? "N/A" : format(depContribution));
            answers.put(prefix + "_dependent_non_ca_contribution_" + planIndex, "");
        }
    }
}
