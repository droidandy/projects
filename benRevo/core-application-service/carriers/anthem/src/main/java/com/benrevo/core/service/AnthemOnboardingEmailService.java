package com.benrevo.core.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;

import com.benrevo.be.modules.onboarding.service.PostSalesDocumentService;
import com.benrevo.be.modules.onboarding.service.email.OnboardingEmailService;
import com.benrevo.be.modules.shared.service.DocumentGeneratorService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.enums.FormType;
import com.benrevo.data.persistence.repository.AnswerRepository;
import java.io.ByteArrayOutputStream;
import java.util.List;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemOnboardingEmailService extends OnboardingEmailService {

    @Autowired
    private DocumentGeneratorService documentGeneratorService;

    @Autowired
    private PostSalesDocumentService postSalesDocumentService;
    
    @Autowired
    private AnswerRepository answerRepository;

    protected static String MEETINGS_AND_PACKETS_REQUEST_FILENAME = "Anthem_Onboarding_OE_Meetings_and_Packets.pdf";
    protected static String MEETINGS_AND_PACKETS_REQUEST_TEMPLATE = "/templates/anthem_blue_cross/postsales/meetings-and-packets.vm";
    protected static String EMPLOYER_ACCESS_FILENAME = "LogonID Agreement.pdf";
    protected static String EMPLOYER_APPLICATION_FILENAME = "Employer Application.pdf";
    protected static String QUESTIONNAIRE_FILENAME = "Questionnaire.pdf";
    protected static String TPA_FILENAME_FORMAT = "TPA %s.pdf";
    protected static String COMMON_OWNERSHIP_FILENAME = "Common Ownership.pdf";

    public AnthemOnboardingEmailService() {
        appCarrier = new String[]{ ANTHEM_BLUE_CROSS.name() };
    }
    
    @Override
    protected FileDto buildQuestionnaire(Long clientId) {
        ByteArrayOutputStream questionnaire = postSalesDocumentService.getDocument(FormType.ANTHEM_QUESTIONNAIRE.getMessage(), clientId).getOutputStream();
        return buildFileDto(
            questionnaire,
            QUESTIONNAIRE_FILENAME,
            MediaType.APPLICATION_PDF_VALUE
        );

    }
    
    @Override
    protected AttachmentDto buildMeetingsAndPacketsRequest(Long clientId) {
        
        String kitRequestPages[] = onboardingVelocityService.getMeetingsAndPacketsPagesArray(clientId, MEETINGS_AND_PACKETS_REQUEST_TEMPLATE);
        if(kitRequestPages.length == 0) {
            return null;
        }
        ByteArrayOutputStream baos = documentGeneratorService.stringArrayToPdfOS(kitRequestPages);
        return new AttachmentDto(
            MEETINGS_AND_PACKETS_REQUEST_FILENAME,
            baos.toByteArray()
        );
    }

    @Override
    protected FileDto buildEmployerApplication(Long clientId) {
        ByteArrayOutputStream employerApplication = postSalesDocumentService.getDocument(FormType.ANTHEM_EMPLOYER_APPLICATION.getMessage(),
                clientId).getOutputStream();
        return buildFileDto(
            employerApplication,
            EMPLOYER_APPLICATION_FILENAME,
            MediaType.APPLICATION_PDF_VALUE
        );

    }

    @Override
    protected void addAttachments(List<AttachmentDto> attachments, Long clientId) {
        
        // add TPA forms
        int counter = NumberUtils.toInt(answerRepository.findAnswerByClientIdAndCode(clientId, "tpa_quantity"), 0);
        for (int i=2; i<=counter; i++) {
            ByteArrayOutputStream baos = postSalesDocumentService
                    .getDocument(String.format("anthem-tpa-%s", i), clientId)
                    .getOutputStream();
            attachments.add(new AttachmentDto(String.format(TPA_FILENAME_FORMAT, i), baos.toByteArray()));
        }

        // add Employer Access form
        ByteArrayOutputStream baos = postSalesDocumentService
                .getDocument(FormType.ANTHEM_EMPLOYER_ACCESS.getMessage(), clientId)
                .getOutputStream();
        attachments.add(new AttachmentDto(EMPLOYER_ACCESS_FILENAME, baos.toByteArray()));

        // add Common Ownership form
        baos = postSalesDocumentService
                .getDocument(FormType.ANTHEM_COMMON_OWNERSHIP.getMessage(), clientId)
                .getOutputStream();
        attachments.add(new AttachmentDto(COMMON_OWNERSHIP_FILENAME, baos.toByteArray()));

    }

}
