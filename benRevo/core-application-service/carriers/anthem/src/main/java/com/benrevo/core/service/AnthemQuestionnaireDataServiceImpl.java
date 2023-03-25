package com.benrevo.core.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import com.benrevo.be.modules.onboarding.service.document.AbstractDocumentDataService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.enums.FormType;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.repository.AnswerRepository;
import java.util.HashMap;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("anthem-blue-cross-questionnaire")
@AppCarrier(ANTHEM_BLUE_CROSS)
public class AnthemQuestionnaireDataServiceImpl extends AbstractDocumentDataService {

    @Autowired
    private AnswerRepository answerRepository;

    @Override
    public Map<String, String> getData(Client client) {

        Map<String, String> answers = new HashMap<>(answerRepository.getAnswers(FormType.ANTHEM_QUESTIONNAIRE.getMessage(), client.getClientId()));
        answers.putAll(answerRepository.getMultiselectableAnswers(FormType.ANTHEM_QUESTIONNAIRE.getMessage(), client.getClientId()));

        transformContactInformation(answers);

        String enrMeetingDate = answers.get("first_proposed_enrollment_meeting_date");
        if (StringUtils.isNoneBlank(enrMeetingDate)) {
          String formattedDate = enrMeetingDate.replaceAll("/", "");
          answers.put("first_proposed_enrollment_meeting_date", formattedDate);
        }
        String eocSentOutTo = answers.get("eoc_will_be_sent_out_to");

        if(answers.containsKey("Decision Maker_name")) {
            answers.put("authorized_signer_for_group_name", answers.getOrDefault("Decision Maker_name", ""));
        }

        if (StringUtils.isNoneBlank(eocSentOutTo)) {
          if (eocSentOutTo.equals("Group administrator")) {
            answers.put("eoc_name", StringUtils.defaultString(answers.get("Group Administrator_name"),""));
            answers.put("eoc_email", StringUtils.defaultString(answers.get("Group Administrator_email"),""));
          } else {
            answers.put("eoc_name", StringUtils.defaultString(answers.get("Decision Maker_name"),""));
            answers.put("eoc_email", StringUtils.defaultString(answers.get("Decision Maker_email"),""));
          }  
        }
        
        if (NumberUtils.toInt(answers.get("tpa_quantity"), 0) > 0) {
            answers.put("tpa","Yes");
        } else {
            answers.put("tpa","No");
        }
        
        return answers;
    }
}
