package com.benrevo.be.modules.shared.service;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.FeedbackDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.mail.SMTPMailer;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class FeedbackService {

    @Autowired // privete - to use BaseEmailService.send() in children classes
    private SMTPMailer smtpMailer;

    @Autowired
    private SharedVelocityService sharedVelocityService;

    protected static String FEEDBACK_TEMPLATE = "/templates/feedback.vm";
    protected static String FEEDBACK_SUBJECT = "New Feedback for BenRevo!";


    public void sendFeedback(FeedbackDto dto) {

        String templatePath = FEEDBACK_TEMPLATE;
        String emailTemplate = sharedVelocityService.getFeedbackTemplate(templatePath, dto);

        MailDto mailDto = new MailDto();
        List<String> recipientsList = new ArrayList<>();
        recipientsList.add(Constants.BENREVO_SUPPORT_EMAIL_ADDRESS);
        mailDto.setRecipients(recipientsList);

        mailDto.setSubject(FEEDBACK_SUBJECT);
        mailDto.setContent(emailTemplate);

        smtpMailer.send(mailDto);
    }
}
