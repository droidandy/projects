package com.benrevo.core.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.be.modules.onboarding.service.PostSalesDocumentService;
import com.benrevo.be.modules.onboarding.service.email.report.Document;
import com.benrevo.be.modules.onboarding.service.email.report.PdfProcessor;
import com.benrevo.be.modules.onboarding.service.email.report.Document.Output;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.enums.FormType;
import com.benrevo.common.exception.DocumentGeneratorException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.repository.AnswerRepository;
import com.benrevo.data.persistence.repository.ClientRepository;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemPostSalesDocumentService extends PostSalesDocumentService {

    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @Override
    public Document.Output getDocument(String code, Long clientId) throws DocumentGeneratorException {

        switch (code) {
            case "anthem-tpa-2":
                return getTPADocument(code, clientId, 2L);
            case "anthem-tpa-3":
                return getTPADocument(code, clientId, 3L);
            case "anthem-tpa-4":
                return getTPADocument(code, clientId, 4L);
            case "anthem-tpa-5":
                return getTPADocument(code, clientId, 5L);
            default:
                return super.getDocument(code, clientId);
        }
    }

    private Output getTPADocument(String code, Long clientId, long index) {
        
        Client client = clientRepository.findOne(clientId);
        
        Document<PDDocument> doc = new PdfProcessor().build(
                "/templates/anthem_blue_cross/postsales/anthem-tpa.pdf", 
                getTpaFormData(code, client, index));
        
        return getPDDocument(doc,String.format("tpa-%s.pdf", index));
    }

    public Map<String, String> getTpaFormData(String code, Client client, long index) {

        Map<String, String> answers = new HashMap<>(answerRepository.getAnswers(code, client.getClientId()));
        answers.putAll(answerRepository.getMultiselectableAnswers(code, client.getClientId()));

        if (NumberUtils.toInt(answers.remove("tpa_quantity"), 0) < index) {
            throw new NotFoundException(String.format("No TPA Data found for index=%s", index));
        }
        
        answers.put("client_name", client.getClientName());
        answers.put("tpa_name", answers.remove("tpa_name_" + index));
        answers.put("tpa_city", answers.remove("tpa_city_" + index));
        answers.put("is_tpa_broker", answers.remove("is_tpa_broker_" + index));
        answers.put("tpa_phone", answers.remove("tpa_phone_" + index));
        answers.put("tpa_zip", answers.remove("tpa_zip_" + index));
        answers.put("tpa_title", answers.remove("tpa_title_" + index));
        answers.put("tpa_state", answers.remove("tpa_state_" + index));
        answers.put("tpa_email", answers.remove("tpa_email_" + index));
        String feeType = answers.remove("tpa_administration_fee_" + index);
        answers.put("tpa_administration_fee", feeType);
        if ("$ per member".equals(feeType)) {
            answers.put("tpa_administration_fee_per", "On");
            answers.put("tpa_fee_per", answers.remove("tpa_fee_per_member_" + index));    
        } else if ("$ per subscriber".equals(feeType)) {
            answers.put("tpa_administration_fee_per", "On");
            answers.put("tpa_fee_per", answers.remove("tpa_fee_per_subscriber_" + index));    
        } 
        
        // join cobra and other values
        String otherValue = answers.remove("tpa_other_value_" + index);
        String cobraValue = answers.remove("tpa_functions_3"); 
        if (answers.containsKey("tpa_functions_4")) { 
            // there is Other value
            if (cobraValue != null) {
                answers.put("tpa_other_value", "COBRA, " + otherValue);
            } else {
                answers.put("tpa_other_value", otherValue);
            }
        } else {
            if (cobraValue != null) {
                answers.put("tpa_functions_4","Other");
                answers.put("tpa_other_value", "COBRA");
            }
        }

        answers.put("tpa_how_admin_fee_paid", answers.remove("tpa_how_admin_fee_paid_" + index));
        answers.put("tpa_street_address", answers.remove("tpa_street_address_" + index));
        
        
        return answers;
    }

    @Override
    public Map<String, String> getAvailableFormList(Long clientId) {
        Map<String, String> result = new LinkedHashMap<>();
        
        result.put("Questionnaire", FormType.ANTHEM_QUESTIONNAIRE.getMessage());
        result.put("Employer Application", FormType.ANTHEM_EMPLOYER_APPLICATION.getMessage());
        result.put("Common Ownership", FormType.ANTHEM_COMMON_OWNERSHIP.getMessage());
        result.put("LogonID Agreement", FormType.ANTHEM_EMPLOYER_ACCESS.getMessage());
        
        int counter = NumberUtils.toInt(answerRepository.findAnswerByClientIdAndCode(clientId, "tpa_quantity"), 0);
        for (int i=2; i<=counter; i++) {
            result.put(String.format("TPA Form %s", i), String.format("anthem-tpa-%s", i));
        }

        return result;
    }

}
