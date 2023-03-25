package com.benrevo.core.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.util.MapBuilder.field;

import com.benrevo.be.modules.shared.service.BaseEmailService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.MailDto;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Timeline;
import com.benrevo.data.persistence.repository.ClientRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemTimelineEmailService extends BaseEmailService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AnthemVelocityService anthemVelocityService;

    protected static String COMPLETION_EMAIL_TEMPLATE = "/templates/anthem/email/completion-email.html";
    protected static String COMPLETION_EMAIL_SUBJECT = "%s - milestone is completed!";
    protected static String REMINDER_EMAIL_TEMPLATE = "/templates/anthem/email/reminder-email.html";
    protected static String REMINDER_EMAIL_SUBJECT = "%s - milestones are overdue!";
    protected static String TIMELINE_CREATION_EMAIL_TEMPLATE = "/templates/anthem/email/timeline-creation-email.html";
    protected static String TIMELINE_CREATION_EMAIL_SUBJECT = "%s - Timeline Created!";


    public AnthemTimelineEmailService() {
        appCarrier = new String[]{ ANTHEM_BLUE_CROSS.name() };
    }

    public void sendCompletionNotification(Long clientId, String item) {
        
        Client client = clientRepository.findOne(clientId);

        String templatePath = COMPLETION_EMAIL_TEMPLATE;
        String emailTemplate = anthemVelocityService.getCompletionEmailTemplate(templatePath, client.getClientName(), item);

        MailDto mailDto = setRecordKeepingRecipients(clientId);

        mailDto.setSubject(String.format(COMPLETION_EMAIL_SUBJECT,client.getClientName()));
        mailDto.setContent(emailTemplate);

        send(mailDto);
    }

    public void sendReminderNotification(Long clientId, List<Timeline> items) {
        Client client = clientRepository.findOne(clientId);

        if (client == null) {
            logger.errorLog(
                "Client not found",
                field("client_id", clientId)
            );
            return;
        }
        
        String templatePath = REMINDER_EMAIL_TEMPLATE;
        String emailTemplate = anthemVelocityService.getCompletionEmailTemplate(templatePath, client.getClientName(), items);

        MailDto mailDto = new MailDto();

        addClientTeamAsRecipients(mailDto, clientId);

        mailDto.setSubject(String.format(REMINDER_EMAIL_SUBJECT,client.getClientName()));
        mailDto.setContent(emailTemplate);

        send(mailDto);

        
    }

    public void sendTimelineCreationNotification(Long clientId) {
        Client client = clientRepository.findOne(clientId);

        if (client == null) {
            logger.errorLog(
                "Client not found",
                field("client_id", clientId)
            );
            return;
        }
        
        String templatePath = TIMELINE_CREATION_EMAIL_TEMPLATE;
        String emailTemplate = anthemVelocityService.getTimelineCreationEmailTemplate(templatePath, client.getClientName());

        MailDto mailDto = new MailDto();

        addClientTeamAsRecipients(mailDto, clientId);

        mailDto.setSubject(String.format(TIMELINE_CREATION_EMAIL_SUBJECT,client.getClientName()));
        mailDto.setContent(emailTemplate);

        send(mailDto);
    }
}
