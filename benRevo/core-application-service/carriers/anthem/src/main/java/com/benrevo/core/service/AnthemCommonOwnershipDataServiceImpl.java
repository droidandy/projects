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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("anthem-common-ownership")
@AppCarrier(ANTHEM_BLUE_CROSS)
public class AnthemCommonOwnershipDataServiceImpl extends AbstractDocumentDataService {
    
    final static int MAX_AFFILIATED_FIRMS_QUANTITY = 10;

    @Autowired
    private AnswerRepository answerRepository;

    @Override
    public Map<String, String> getData(Client client) {

        Map<String, String> answers = new HashMap<>(answerRepository.getAnswers(FormType.ANTHEM_COMMON_OWNERSHIP.getMessage(), client.getClientId()));

        String countStr = answers.remove("affiliated_firms_quantity");
        int count = 0;
        if (countStr != null && !countStr.isEmpty()) {
            try {
                count = Integer.parseInt(countStr);
            } catch (NumberFormatException e) {
                // do nothing, use default value
            }
        }
        for (int i=1; i<=MAX_AFFILIATED_FIRMS_QUANTITY; i++) {
            String name = answers.remove("affiliated_company_name_" + i);
            String address = answers.remove("affiliated_company_address_" + i);
            if (count >= i) { // skip unused answers
                if (name != null) {
                    String nameAndAddress = name;
                    if (address != null) {
                        nameAndAddress += " " + address;
                    }
                    answers.put("affiliated_company_name_and_address_" + i, nameAndAddress);
                }
            } else {
                answers.remove("affiliated_company_ein_" + i);
            }
        }

        return answers;
    }
}
