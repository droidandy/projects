package com.benrevo.be.modules.onboarding.service.document;

import com.benrevo.common.enums.FormType;
import com.benrevo.data.persistence.entities.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class DocumentDataContext {

    @Autowired
    @Lazy
    @Qualifier("questionnaire")
    private AbstractDocumentDataService questionnaireService;

    @Autowired
    @Lazy
    @Qualifier("employer-application")
    private AbstractDocumentDataService employerApplicationService;

    @Autowired
    @Lazy
    @Qualifier("anthem-blue-cross-questionnaire")
    private AbstractDocumentDataService anthemQuestionnaireDataService;

    @Autowired
    @Lazy
    @Qualifier("anthem-employer-access")
    private AbstractDocumentDataService anthemEmployerAccessDataService;

    @Autowired
    @Lazy
    @Qualifier("anthem-blue-cross-employer-application")
    private AbstractDocumentDataService anthemEmployerApplicationDataService;

    @Autowired
    @Lazy
    @Qualifier("anthem-common-ownership")
    private AbstractDocumentDataService anthemCommonOwnershipDataService;

    public Map<String, String> getData(Client client, FormType formType) {
        switch (formType) {
            case QUESTIONNAIRE:
                return questionnaireService.getData(client);
            case EMPLOYER_APPLICATION:
                return employerApplicationService.getData(client);
            case ANTHEM_QUESTIONNAIRE:
                return anthemQuestionnaireDataService.getData(client);
            case ANTHEM_EMPLOYER_ACCESS:
                return anthemEmployerAccessDataService.getData(client);
            case ANTHEM_EMPLOYER_APPLICATION:
                return anthemEmployerApplicationDataService.getData(client);
            case ANTHEM_COMMON_OWNERSHIP:
                return anthemCommonOwnershipDataService.getData(client);
            default:
                return null;
        }
    }
}
