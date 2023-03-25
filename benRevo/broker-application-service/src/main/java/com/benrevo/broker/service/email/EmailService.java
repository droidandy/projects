package com.benrevo.broker.service.email;

import com.benrevo.be.modules.client.service.ClientService;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.BaseEmailService;
import com.benrevo.be.modules.shared.service.S3FileManager;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.*;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.mail.SMTPMailer;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.broker.service.VelocityService;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Timeline;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.NotificationRepository;
import com.benrevo.data.persistence.repository.RfpRepository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.enums.CarrierType.fromStrings;
import static java.lang.String.format;

/**
 * Created by elliott on 7/13/17.
 */
@Service
@Transactional
public class EmailService extends BaseEmailService {
    private static final String EMAIL_TEMPLATE_DIR = "/templates/%s/email";

    protected static String SIGN_UP_TEMPLATE = "/templates/signup.vm";
    protected static String SIGN_UP_SUBJECT = "New SignUp Request for BenRevo!";
    protected static String REQUEST_DEMO_TEMPLATE = "/templates/requestdemo.vm";
    protected static String REQUEST_DEMO_SUBJECT = "New Demo Request for BenRevo!";
    protected static String ACCOUNT_REQUEST_TEMPLATE = "/templates/account_request.vm";
    protected static String ACCOUNT_REQUEST_SUBJECT = "New Account Request for BenRevo!";
    protected static String CONTACT_US_TEMPLATE = "/templates/contactus.vm";
    protected static String CONTACT_US_SUBJECT = "New Contact Request for BenRevo!";
    protected static String QUTOE_READY_TEMPLATE = "/quote-ready.html";
    protected static String QUTOE_READY_SUBJECT = "Your Quote is Ready!";
    protected static String PURCHASE_CONFIRMATION_TEMPLATE = "/purchase-confirmation.html";
    protected static String PURCHASE_CONFIRMATION_SUBJECT = "New RFP submission from BenRevo!";
    protected static String VERIFICATION_EMAIL_TEMPLATE = "/verification-email.html";
    protected static String VERIFICATION_EMAIL_SUBJECT = "Please verify your email!";

    @Value("${app.carrier}")
    protected String[] appCarrier;

    @Autowired
    protected S3FileManager s3FileManager;

    @Autowired
    protected CustomLogger logger;

    @Autowired
    protected VelocityService velocityService;

    @Autowired
    protected ClientService clientService;

    @Autowired
    protected BrokerRepository brokerRepository;

    @Autowired
    protected RfpRepository rfpRepository;

    @Autowired
    protected SMTPMailer smtpMailer;

    @Autowired
    protected NotificationRepository notificationRepository;

    @Autowired
    protected ClientRepository clientRepository;
    
    @Autowired
    private Auth0Service auth0Service;

    protected ClientMemberDto getLoggedInUser() {
        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        return auth0Service.getUserByAuthId(authentication.getName());
    }

    public void sendSignUpEmail(SignupDto signupDto) {
        validateSignUpDto(signupDto);
        String templatePath = SIGN_UP_TEMPLATE;
        String emailTemplate = velocityService.getSignUpTemplate(templatePath, signupDto);

        MailDto mailDto = new MailDto();
        List<String> recipientsList = new ArrayList<>();
        recipientsList.add(Constants.BENREVO_SUPPORT_EMAIL_ADDRESS);
        mailDto.setRecipients(recipientsList);

        mailDto.setSubject(SIGN_UP_SUBJECT);
        mailDto.setContent(emailTemplate);

        smtpMailer.send(mailDto);
    }

    public void sendAccountRequestEmail(AccountRequestDto dto) {
        String templatePath = ACCOUNT_REQUEST_TEMPLATE;
        String emailTemplate = velocityService.getAccountRequestTemplate(templatePath, dto);

        MailDto mailDto = new MailDto();

        mailDto.setRecipient(Constants.SITE_CONTACT_US_EMAIL);
        mailDto.setSubject(ACCOUNT_REQUEST_SUBJECT);
        mailDto.setContent(emailTemplate);

        smtpMailer.send(mailDto);
    }
    
    public void sendRequestDemoEmail(RequestDemoDto dto) {
        String templatePath = REQUEST_DEMO_TEMPLATE;
        String emailTemplate = velocityService.getRequestDemoTemplate(templatePath, dto);

        MailDto mailDto = new MailDto();
        List<String> recipientsList = new ArrayList<>();
        recipientsList.add(Constants.BENREVO_SUPPORT_EMAIL_ADDRESS);
        mailDto.setRecipients(recipientsList);

        mailDto.setSubject(REQUEST_DEMO_SUBJECT);
        mailDto.setContent(emailTemplate);

        smtpMailer.send(mailDto);
    }

    public void sendContactUsEmail(ContactUsDto contactUsDto) {
        String templatePath = CONTACT_US_TEMPLATE;
        String emailTemplate = velocityService.getContactUsTemplate(templatePath, contactUsDto);

        MailDto mailDto = new MailDto();
        List<String> recipientsList = new ArrayList<>();
        recipientsList.add(Constants.BENREVO_SUPPORT_EMAIL_ADDRESS);
        mailDto.setRecipients(recipientsList);

        mailDto.setSubject(CONTACT_US_SUBJECT);
        mailDto.setContent(emailTemplate);

        smtpMailer.send(mailDto);
    }

    public void sendVerificationCode(String agentName, String agentEmail, String verificationCode) {

        String templatePath = getPrefix() + VERIFICATION_EMAIL_TEMPLATE;
        String emailTemplate = velocityService.getVerificationEmailTemplate(templatePath, agentName, verificationCode);

        MailDto mailDto = new MailDto();
        mailDto.setRecipient(agentEmail);

        mailDto.setSubject(VERIFICATION_EMAIL_SUBJECT);
        mailDto.setContent(emailTemplate);

        smtpMailer.send(mailDto);
    }

    public void sendCompletionNotification(Long clientId, String item) {
        // default for UHC
    }

    public void sendReminderNotification(Long clientId, List<Timeline> list) {
        // default for UHC
    }
    
    public void sendTimelineCreationNotification(Long clientId) {
        // default
    }

    protected String buildBrokerErrorMessage(Long id) {
        return format(
            Constants.VALIDATION_MESSAGE_ENTITY_NOT_FOUND_EXTENDED,
            Broker.class.getSimpleName(),
            id
        );
    }

    public String getPrefix() {
        CarrierType ct = fromStrings(appCarrier);

        return ct != null ? format(EMAIL_TEMPLATE_DIR, ct.abbreviation) : null;
    }

    private void validateSignUpDto(SignupDto signupDto) {

        if (signupDto == null) {
            throw new BadRequestException("Cannot create Sign Up Dto, Sign Up Dto cannot be null.");
        }
        if (signupDto.getBrokerageFirmName() == null || signupDto.getBrokerageFirmName().isEmpty()) {
            throw new BadRequestException("Cannot create Sign Up Dto, Brokerage Firm Name cannot be null or empty.");
        }
        if (signupDto.getBrokerageFirmZipCode() == null || signupDto.getBrokerageFirmZipCode().isEmpty()) {
            throw new BadRequestException("Cannot create Sign Up Dto, Brokerage Firm Zip Code cannot be null or empty.");
        }
        if (signupDto.getEmail() == null || signupDto.getEmail().isEmpty()) {
            throw new BadRequestException("Cannot create Sign Up Dto, Email cannot be null or empty.");
        }
        if (signupDto.getFirstName() == null || signupDto.getFirstName().isEmpty()) {
            throw new BadRequestException("Cannot create Sign Up Dto, First Name cannot be null or empty.");
        }
        if (signupDto.getLastName() == null || signupDto.getLastName().isEmpty()) {
            throw new BadRequestException("Cannot create Sign Up Dto, Last Name cannot be null or empty.");
        }
    }
}
