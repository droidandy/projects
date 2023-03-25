package com.benrevo.core.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import com.benrevo.be.modules.onboarding.service.document.AbstractDocumentDataService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.enums.FormType;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.repository.AnswerRepository;
import com.google.common.base.Joiner;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("anthem-employer-access")
@AppCarrier(ANTHEM_BLUE_CROSS)
public class AnthemEmployerAccessDataServiceImpl extends AbstractDocumentDataService {

    @Autowired
    private AnswerRepository answerRepository;

    @Override
    public Map<String, String> getData(Client client) {

        Map<String, String> answers = new HashMap<>(answerRepository.getAnswers(
                FormType.ANTHEM_EMPLOYER_ACCESS.getMessage(), client.getClientId()));
        answers.putAll(answerRepository.getMultiselectableAnswers(
                FormType.ANTHEM_EMPLOYER_ACCESS.getMessage(), client.getClientId()));
        
        transformContactInformation(answers);
        
        answers.put("Anthem Employer access administrator_city_state_zip", 
            Joiner.on(", ").skipNulls().join(
                answers.remove("Anthem Employer access administrator_city"), 
                answers.remove("Anthem Employer access administrator_state"), 
                answers.remove("Anthem Employer access administrator_zip")));

        answers.put("client_name", client.getClientName());

        return answers;
    }
}
