package com.benrevo.core.service;

import com.benrevo.be.modules.onboarding.service.PostSalesDocumentService;
import com.benrevo.be.modules.onboarding.service.email.OnboardingEmailService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.enums.FormType;

import java.io.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.enums.CarrierType.UHC;

@Service
@AppCarrier(UHC)
@Transactional
public class UHCOnboardingEmailService extends OnboardingEmailService {
	
    protected static String EMPLOYER_APPLICATION_FILENAME = "Employer Application.pdf";
    protected static String QUESTIONNAIRE_FILENAME = "Questionnaire.xlsx";

    @Autowired
    private PostSalesDocumentService postSalesDocumentService;

	
    static {
        ON_BOARDING_SUBMISSION_EMAIL = "unitedhealthcare@benrevo.com";
    }

    public UHCOnboardingEmailService() {
        appCarrier = new String[] { UHC.name() };
    }

	@Override
	protected FileDto buildQuestionnaire(Long clientId) {
		ByteArrayOutputStream questionnaire = postSalesDocumentService.
			getDocument(FormType.QUESTIONNAIRE.getMessage(), clientId).
			getOutputStream();
        
		return buildFileDto(
            questionnaire,
            QUESTIONNAIRE_FILENAME,
            Constants.HTTP_HEADER_CONTENT_TYPE_XLSX
        );
	}

	@Override
	protected FileDto buildEmployerApplication(Long clientId) {
		ByteArrayOutputStream employerApplication = postSalesDocumentService.
			getDocument(FormType.EMPLOYER_APPLICATION.getMessage(), clientId).
			getOutputStream();
        
		return buildFileDto(
            employerApplication,
            EMPLOYER_APPLICATION_FILENAME,
            MediaType.APPLICATION_PDF_VALUE
        );
	}
}
