package com.benrevo.core.service;

import com.benrevo.be.modules.onboarding.service.document.AbstractDocumentDataService;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.FormType;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.AnswerRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static com.benrevo.common.enums.CarrierType.UHC;

@Service("questionnaire")
@AppCarrier(UHC)
public class UHCQuestionnaireDataService extends AbstractDocumentDataService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Override
    public Map<String, String> getData(Client client) {
        Map<String, String> answers = new HashMap<>(answerRepository.getAnswers(FormType.QUESTIONNAIRE.getMessage(), client.getClientId()));

        RFP medicalRfp = rfpRepository.findByClientClientIdAndProduct(client.getClientId(), Constants.MEDICAL);
        answers.put("waiting_period_for_new_hires", Optional.ofNullable(medicalRfp).map(RFP::getWaitingPeriod).orElse(""));

        answers.put("effective_date", client.getEffectiveDate() != null ? DateHelper.fromDateToString(client.getEffectiveDate(), Constants.DATE_FORMAT) : "");
        answers.put("groups_legal_name", format(client.getClientName()));
        answers.put("date_questionnaire_completed", format(client.getDateQuestionnaireCompleted()));
        answers.put("policy_number", format(client.getPolicyNumber()));
        answers.put("consultant_broker_company", format(client.getBroker().getName()));

        answers.put("situs_state", format(client.getState()));
        answers.put("min_hrs_wks_to_be_considered", format(client.getMinimumHours()));
        addGeneralInformation(client, answers);
        
        String initialEligibilityTransmissionOption = answers.get("initial_eligibility_transmission_option");
        String subsequentEligibilityTransmissionOption = answers.get("subsequent_eligibility_transmission_option");
        
        if (StringUtils.equalsAnyIgnoreCase("Excel spreadsheet / xTool (Standard)", 
                initialEligibilityTransmissionOption,
                subsequentEligibilityTransmissionOption)) {
            answers.put("type_of_eligibility_transmission_1", "Excel spreadsheet / xTool (Standard)");
        }
        
        if (StringUtils.equalsAnyIgnoreCase("Employer eServices (Standard)", 
                initialEligibilityTransmissionOption,
                subsequentEligibilityTransmissionOption)) {
            answers.put("type_of_eligibility_transmission_2", "Employer eServices (Standard)");
        }

        if (StringUtils.equalsAnyIgnoreCase("Electronic Feed", 
                initialEligibilityTransmissionOption,
                subsequentEligibilityTransmissionOption)) {
            answers.put("type_of_eligibility_transmission_3", "Electronic Feed");
        }

        if (StringUtils.equalsAnyIgnoreCase("Enrollment Forms", 
                initialEligibilityTransmissionOption,
                subsequentEligibilityTransmissionOption)) {
            answers.put("type_of_eligibility_transmission_4", "Enrollment Forms");
        }

        return answers;
    }
}
