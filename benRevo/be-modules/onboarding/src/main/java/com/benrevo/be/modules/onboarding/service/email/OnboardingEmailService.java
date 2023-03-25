package com.benrevo.be.modules.onboarding.service.email;

import static java.lang.String.format;
import com.benrevo.be.modules.onboarding.service.OnboardingVelocityService;
import com.benrevo.be.modules.shared.service.BaseEmailService;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.repository.ClientRepository;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OnboardingEmailService extends BaseEmailService {
    
    protected static String ON_BOARDING_SUBMISSION_TEMPLATE = "/onboarding-submission.vm";
    protected static String ON_BOARDING_SUBMISSION_SUBJECT = "%s - On-boarding Documents Completed";
    protected static String ON_BOARDING_SUBMISSION_EMAIL = "info@benrevo.com";
    
    @Autowired
    protected OnboardingVelocityService onboardingVelocityService;

    @Autowired
    protected ClientRepository clientRepository;

    @SuppressWarnings("unchecked")
    public void sendPostSalesNotification(Long clientId) {

        Client client = clientRepository.findOne(clientId);
        Broker clientBroker = client.getBroker();
        Broker authenticatedBroker = findCurrentBroker();

        String templatePath = getPrefix() + ON_BOARDING_SUBMISSION_TEMPLATE;
        String emailTemplate = onboardingVelocityService.getOnboardingSubmissionTemplate(
            templatePath,
            authenticatedBroker,
            clientBroker,
            client
        );

        List<String> recipients = new ArrayList<>();

        recipients.add(ON_BOARDING_SUBMISSION_EMAIL);

        if(shouldAddSpecialtyBrokerEmail(client)) {
            recipients.add(client.getSpecialtyEmail());
        }

        String emailSubject = format(ON_BOARDING_SUBMISSION_SUBJECT, client.getClientName());
        MailDto mailDto = buildMailDto(emailTemplate, emailSubject, emailTemplate, recipients);

        List<AttachmentDto> attachments = new ArrayList<>();
        
        FileDto employerApplicationFileDto = buildEmployerApplication(clientId);
        attachments.add(new AttachmentDto(employerApplicationFileDto.getName(), employerApplicationFileDto.getContent()));
        
        FileDto questionnaireFileDto = buildQuestionnaire(clientId);
        attachments.add(new AttachmentDto(questionnaireFileDto.getName(), questionnaireFileDto.getContent()));
        
        addAttachments(attachments, clientId);
        
        AttachmentDto meetingsAndPackets = buildMeetingsAndPacketsRequest(clientId);
        if(meetingsAndPackets != null) {
            attachments.add(meetingsAndPackets);
        }
        try {
            send(
                mailDto,
                attachments
            );
            storeEmailNotification(clientId, "POST_SALES");
            client.setDateFormSubmitted(new Date());
        } catch(BaseException e) {
            logger.errorLog("Can't email post sales documents", e);
        }
    }

    protected void addAttachments(List<AttachmentDto> attachments, Long clientId) {
       // default for UHC
    }

    protected FileDto buildQuestionnaire(Long clientId) {
        throw new UnsupportedOperationException("Not implemented");
    }

    protected FileDto buildEmployerApplication(Long clientId) {
        throw new UnsupportedOperationException("Not implemented");
    }
    
    protected AttachmentDto buildMeetingsAndPacketsRequest(Long clientId) {
        // default for UHC
        return null;
    }

}
