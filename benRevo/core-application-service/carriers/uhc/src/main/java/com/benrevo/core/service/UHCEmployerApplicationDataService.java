package com.benrevo.core.service;

import com.benrevo.be.modules.onboarding.service.document.AbstractDocumentDataService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.QuoteOptionContributionsDto;
import com.benrevo.common.dto.QuoteOptionFinalSelectionDto;
import com.benrevo.common.enums.FormType;
import com.benrevo.common.util.DateHelper;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.CarrierHistory;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.repository.AnswerRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.util.MathUtils.round;

@Service("employer-application")
@AppCarrier(UHC)
public class UHCEmployerApplicationDataService extends AbstractDocumentDataService {
    private static final Integer DEFAULT_TIER = 1;
    
    private static final String WAITING_PERIOD_FIRST_OF_MONTH = "1st of the month following date of hire";
    private static final String WAITING_PERIOD_FIRST = "1st of the month following ";
    private static final String WAITING_PERIOD_END = " from date of hire";
    private static final String WAITING_PERIOD_DATE_OF_HIRE = "Date of hire";
    


    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private SharedRfpQuoteService rfpQuoteService;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Override
    public Map<String, String> getData(Client client) {
        RFP medicalRfp = rfpRepository.findByClientClientIdAndProduct(client.getClientId(), Constants.MEDICAL);
        RFP dentalRfp = rfpRepository.findByClientClientIdAndProduct(client.getClientId(), Constants.DENTAL);

        Map<String, String> answers = new HashMap<>(answerRepository.getAnswers(FormType.EMPLOYER_APPLICATION.getMessage(), client.getClientId()));

        addAdditionalAnswers(client, medicalRfp, dentalRfp, answers);
        addWaitingPeriodData(medicalRfp, answers);
        answers.putAll(answerRepository.getMultiselectableAnswers(FormType.EMPLOYER_APPLICATION.getMessage(), client.getClientId()));

        return answers;
    }

    public void addWaitingPeriodData(RFP medicalRfp, Map<String, String> answers) {
        
        if (medicalRfp == null || medicalRfp.getWaitingPeriod() == null) { return; }
        
        String waitingPeriod = medicalRfp.getWaitingPeriod();
        if (waitingPeriod.equals(WAITING_PERIOD_FIRST_OF_MONTH)) {
            answers.put("waiting_period_for_new_hires", "First Of The Month Date of Hire");
        } else if (waitingPeriod.equals(WAITING_PERIOD_DATE_OF_HIRE)) {
            answers.put("waiting_period_for_new_hires", "Date of Hire No Waiting Period");   
        } else {
            int indDateOfHire = waitingPeriod.indexOf(WAITING_PERIOD_END);
            if (indDateOfHire > 0) {
                if (waitingPeriod.startsWith(WAITING_PERIOD_FIRST)) {
                    answers.put("waiting_period_for_new_hires", "First Of The Month");
                    answers.put("first_of_month", waitingPeriod.substring(WAITING_PERIOD_FIRST.length(), indDateOfHire));
                } else {
                    answers.put("waiting_period_for_new_hires", "Amount of days");
                    answers.put("months_days_of_employment_following_date_of_hire", waitingPeriod.substring(0, indDateOfHire));
                }
            }
        }
            
    }

    
    private void addAdditionalAnswers(Client client, RFP medicalRfp, RFP dentalRfp, Map<String, String> answers) {
        answers.put("effective_date", client.getEffectiveDate() != null ? DateHelper.fromDateToString(client.getEffectiveDate()) : "");
        answers.put("groups_legal_name", format(client.getClientName()));
        answers.put("total_employees", format(client.getEmployeeCount()));
        answers.put("elligible_employees", format(client.getEligibleEmployees()));
        answers.put("cobra_participants", format(client.getCobraCount()));
        answers.put("industry_sic_code", format(client.getSicCode()));
        answers.put("number_of_hours_per_week_to_be_eligible", format(client.getMinimumHours()));
        answers.put("tier_structure_requested", format(Optional.ofNullable(medicalRfp).map(RFP::getRatingTiers).orElse(DEFAULT_TIER)));

        Stream<CarrierHistory> medCarHistoryStream =  Optional.ofNullable(medicalRfp).map(RFP::getCarrierHistories).map(List::stream).orElseGet(Stream::empty);
        String medicalCarrierHistory = medCarHistoryStream.filter(CarrierHistory::isCurrent).map(CarrierHistory::getName).collect(Collectors.joining(", "));
        answers.put("current_medical_carrier", medicalCarrierHistory);
        answers.put("current_medical_carrier_date_began", client.getEffectiveDate() != null ? DateHelper.fromDateToString(client.getEffectiveDate()) : "");

        Stream<CarrierHistory> dentalCarHistoryStream =  Optional.ofNullable(dentalRfp).map(RFP::getCarrierHistories).map(List::stream).orElseGet(Stream::empty);
        String dentalCarrierHistory = dentalCarHistoryStream.filter(CarrierHistory::isCurrent).map(CarrierHistory::getName).collect(Collectors.joining(", "));
        answers.put("current_dental_carrier", dentalCarrierHistory);
        answers.put("current_dental_carrier_date_began", client.getEffectiveDate() != null ? DateHelper.fromDateToString(client.getEffectiveDate()) : "");

        addGeneralInformation(client, answers);

        // page 3: Product Selection

        QuoteOptionFinalSelectionDto finalSelection = rfpQuoteService.getSelectedQuoteOptions(client.getClientId());

        // medical
        if (finalSelection.getMedicalQuoteOptionId() != null) {
            List<QuoteOptionContributionsDto> contributions = rfpQuoteService.getQuoteOptionNetworkContributions(finalSelection.getMedicalQuoteOptionId());
            //QuoteOptionRidersDto medicalRiders = rfpQuoteService.getQuoteOptionRiders(finalSelection.getMedicalQuoteOptionId());
            int planIndex = 1;
            for (QuoteOptionContributionsDto contribution : contributions) {
                RfpQuoteOptionNetwork optNetwork = rfpQuoteOptionNetworkRepository.findOne(contribution.getRfpQuoteOptionNetworkId());
                answers.put("medical_plan_description_" + planIndex, format(contribution.getPlanNameByNetwork()));
                answers.put("medical_plan_code_" + planIndex, format(contribution.getPlanType()));
                answers.put("behavioral_plan_type_" + planIndex, StringUtils.EMPTY);
                if (optNetwork.getSelectedRfpQuoteNetworkRxPlan() != null) {
                    answers.put("rx_plan_description_" + planIndex, format(optNetwork.getSelectedRfpQuoteNetworkRxPlan().getPnn().getName()));
                    answers.put("rx_plan_code_" + planIndex, format(optNetwork.getSelectedRfpQuoteNetworkRxPlan().getPnn().getPlanType()));
                }
                Set<Rider> riders = optNetwork.getSelectedRiders();
                int riderIndex = 1;
                for (Rider rider : riders) {
                    answers.put("optional_rider_description_" + planIndex + "_" + riderIndex, format(rider.getRiderMeta().getDescription()));
                    answers.put("plan_code_" + planIndex + "_" + riderIndex, format(rider.getRiderMeta().getCode()));
                    riderIndex++;
                    if (riderIndex > 3) {
                        break;
                    }
                }
                fillRates(answers, optNetwork, "medical", "_" + planIndex);
                planIndex++;
                if (planIndex > 3) {
                    break; // only 3 plans supported by template
                }
            }
        }
        // dental
        if (finalSelection.getDentalQuoteOptionId() != null) {
            List<QuoteOptionContributionsDto> contributions = rfpQuoteService.getQuoteOptionNetworkContributions(finalSelection.getDentalQuoteOptionId());
            int planIndex = 1;
            for (QuoteOptionContributionsDto contribution : contributions) {
                RfpQuoteOptionNetwork optNetwork = rfpQuoteOptionNetworkRepository.findOne(contribution.getRfpQuoteOptionNetworkId());
                answers.put("dental_plan_description_" + planIndex, format(contribution.getPlanNameByNetwork()));
                answers.put("dental_plan_code_" + planIndex, format(contribution.getPlanType()));
                fillRates(answers, optNetwork, "dental_plan", "_" + planIndex);
                planIndex++;
                if (planIndex > 2) {
                    break; // only 2 plans supported by template
                }
            }
        }
        // vision
        if (finalSelection.getVisionQuoteOptionId() != null) {
            List<QuoteOptionContributionsDto> contributions = rfpQuoteService.getQuoteOptionNetworkContributions(finalSelection.getVisionQuoteOptionId());
            for (QuoteOptionContributionsDto contribution : contributions) {
                RfpQuoteOptionNetwork optNetwork = rfpQuoteOptionNetworkRepository.findOne(contribution.getRfpQuoteOptionNetworkId());
                answers.put("vision_plan_description", format(contribution.getPlanNameByNetwork()));
                answers.put("vision_plan_code", format(contribution.getPlanType()));
                fillRates(answers, optNetwork, "vision_plan", "");
                break; // only 1 plan supported by template
            }
        }
    }

    private void fillRates(Map<String, String> answers, RfpQuoteOptionNetwork optNetwork, String prefix, String planIndex) {
        RfpQuoteNetworkPlan plan = optNetwork.getSelectedRfpQuoteNetworkPlan();
        // is RX necessary?
        // float[] rxRates = RfpQuoteService.getRXRates(optNetwork.getSelectedRfpQuoteNetworkRxPlan());
        Float employer1, employer2, employer3, employer4;
        if (optNetwork.getErContributionFormat().equals(Constants.ER_CONTRIBUTION_FORMAT_PERCENT)) {
            employer1 = optNetwork.getTier1ErContribution() * plan.getTier1Rate() / 100f;
            employer2 = optNetwork.getTier2ErContribution() * plan.getTier2Rate() / 100f;
            employer3 = optNetwork.getTier3ErContribution() * plan.getTier3Rate() / 100f;
            employer4 = optNetwork.getTier4ErContribution() * plan.getTier4Rate() / 100f;
        } else {
            employer1 = optNetwork.getTier1ErContribution();
            employer2 = optNetwork.getTier2ErContribution();
            employer3 = optNetwork.getTier3ErContribution();
            employer4 = optNetwork.getTier4ErContribution();
        }
        float tier1 = round(employer1 / plan.getTier1Rate() * 100f, 0);
        float tier2 = Math.max(round((employer2 - employer1) / (plan.getTier2Rate() - plan.getTier1Rate()) * 100f, 0), 0f);
        float tier3 = Math.max(round((employer3 - employer1) / (plan.getTier3Rate() - plan.getTier1Rate()) * 100f, 0), 0f);
        float tier4 = Math.max(round((employer4 - employer1) / (plan.getTier4Rate() - plan.getTier1Rate()) * 100f, 0), 0f);

       
        answers.put(prefix + "_rates" + planIndex + "_tier_1", "$" +  amountFormat.format(plan.getTier1Rate()));
        answers.put(prefix + "_contribution" + planIndex + "_tier_1", format(tier1) + "%");
        answers.put(prefix + "_rates" + planIndex + "_tier_2", "$"+ amountFormat.format(plan.getTier2Rate()));
        answers.put(prefix + "_contribution" + planIndex + "_tier_2", format(tier2) + "%");
        answers.put(prefix + "_rates" + planIndex + "_tier_3", "$" + amountFormat.format(plan.getTier3Rate()));
        answers.put(prefix + "_contribution" + planIndex + "_tier_3", format(tier3) + "%");
        answers.put(prefix + "_rates" + planIndex + "_tier_4", "$" + amountFormat.format(plan.getTier4Rate()));
        answers.put(prefix + "_contribution" + planIndex + "_tier_4", format(tier4) + "%");
    }
}
