package com.benrevo.dashboard.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.PersonType.CARRIER_MANAGER;
import static com.benrevo.common.mail.SMTPMailer.setMailRecipients;
import static com.benrevo.common.util.MapBuilder.field;
import static java.lang.String.format;
import static javax.mail.Message.RecipientType.BCC;
import static javax.mail.Message.RecipientType.CC;
import static javax.mail.Message.RecipientType.TO;
import static java.util.Optional.ofNullable;
import com.benrevo.be.modules.rfp.service.anthem.AnthemOptimizerProcessor;
import static javax.mail.Message.RecipientType.CC;
import static org.apache.commons.collections4.CollectionUtils.isEmpty;

import com.benrevo.common.dto.ClientRateBankDto;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Notification;
import com.benrevo.data.persistence.repository.PersonRelationRepository;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.be.modules.shared.service.DocumentGeneratorService;
import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.be.modules.shared.service.SharedHistoryService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.ClientAllQuoteDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.EmailType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.Recipient;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientTeamRepository;
import com.benrevo.data.persistence.repository.PersonRepository;
import com.benrevo.data.persistence.repository.RecipientRepository;
import com.benrevo.data.persistence.repository.RfpQuoteSummaryRepository;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemDashboardEmailService extends DashboardEmailService {
    
    protected static String RATER_TEMPLATE = "/rater.html";
    protected static String RATER_REQUEST_APPROVAL_TEMPLATE = "/rate_request.html";
    protected static String RATER_BCC_EMAIL = Constants.SITE_CONTACT_US_EMAIL;
    protected static String ANTHEM_OPTIMIZER_TEMPLATE = "/2018 Optimizer v33_template.xlsm";
    protected static String QUOTE_READY_TEMPLATE = "/quote_ready.html";
    protected static String FINANCIAL_SUMMARY_TEMPLATE = "/financial_summary.html";
    
    @Value("${app.env:local}")
    private String appEnv;
    
    @Autowired
    private RecipientRepository recipientRepository;
    
    @Autowired
    private SharedCarrierService sharedCarrierService;
    
    @Autowired
    private AnthemOptimizerProcessor optimizerProcessor;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private PersonRepository personRepository;
    
    @Autowired
    private RfpQuoteSummaryRepository rfpQuoteSummaryRepository;
    
    @Autowired
    private SharedHistoryService sharedHistoryService;
    
    @Autowired
    private ClientTeamRepository clientTeamRepository;
    
    @Autowired
    private DocumentGeneratorService documentGeneratorService;

    @Autowired
    private PersonRelationRepository personRelationRepository;
    
    public AnthemDashboardEmailService() {
        appCarrier = new String[]{ ANTHEM_BLUE_CROSS.name() };
    }

    @Override
    protected String getRewardsNotificationSubject() {
        return "Anthem Broker Rewards Program – Weekly List";
    }
    
    @Override
    protected List<String> getRewardsNotificationRecipients() {
        Carrier carrier = sharedCarrierService.findByName(ANTHEM_BLUE_CROSS);
        List<Recipient> recipients = recipientRepository.findByEmailTypeAndCarrierId(
            EmailType.REWARDS, carrier.getCarrierId());
        return recipients.stream()
            .filter(Recipient::isActive)
            .map(Recipient::getEmail)
            .collect(Collectors.toList());  
    }

    public byte[] getOptimizer(Long clientId){
        return optimizerProcessor.build(getPrefix() + ANTHEM_OPTIMIZER_TEMPLATE, clientId, null);
    }

    public String getOptimizerFileName(Long clientId){
        Client client = ofNullable(clientRepository.findOne(clientId))
            .orElseThrow(() -> new NotFoundException("Client not found").withFields(field("client_id", clientId)));

        return client.getClientName() + "_Optimizer.xlsm";
    }

    public void sendOptimizerToRater(Long clientId, Long personId, MultipartFile file, String notes) {

        Client client = ofNullable(clientRepository.findOne(clientId))
                .orElseThrow(() -> new NotFoundException("Client not found").withFields(field("client_id", clientId)));
        Person rater = ofNullable(personRepository.findOne(personId))
                .orElseThrow(() -> new NotFoundException("Person not found").withFields(field("person_id", personId)));

        String effectiveDate = DateHelper.fromDateToString(client.getEffectiveDate());
        String subject = format("Rating Request:  %s, %s", client.getClientName(), effectiveDate);

        List<AttachmentDto> attachments = new ArrayList<>();
        // add optimizer file
        AttachmentDto optimizerFileDto = new AttachmentDto();
        optimizerFileDto.setFileName(client.getClientName() + "_Optimizer.xlsm");
        optimizerFileDto.setContent(optimizerProcessor.build(getPrefix() + ANTHEM_OPTIMIZER_TEMPLATE, clientId, null));
        attachments.add(optimizerFileDto);

        if (file != null) {
            // add attach
            AttachmentDto fileDto = new AttachmentDto();
            fileDto.setFileName(file.getOriginalFilename());
            try {
                fileDto.setContent(file.getBytes());
            } catch (IOException e) {
                throw new BaseException("Error reading attached file", e);
            }
            attachments.add(fileDto);
        }
        
        
        MailDto mailDto = new MailDto();

        ClientMemberDto loggedInUser = getLoggedInUser();
        
        // Set recipients
        setMailRecipients(mailDto, TO, rater.getEmail());
        setMailRecipients(mailDto, CC, loggedInUser.getEmail(), client.getPresalesEmail());
        setMailRecipients(mailDto, BCC, RATER_BCC_EMAIL);
        
        mailDto.setSubject(subject);

        String templatePath = getPrefix() + RATER_TEMPLATE;
        String emailContent = velocityService.getRaterEmailTemplate(templatePath, client, loggedInUser.getFullName(), notes, rater.getFullName());

        mailDto.setContent(emailContent);
        
        send(mailDto, attachments);
        
        sharedHistoryService.storeNotification(client.getClientId(), "SENT_TO_RATER");
    }

    public void sendRateRequest(Long clientId, QuoteType quoteType,
        ClientRateBankDto dto, String note, List<MultipartFile> files){

        // send email with all information
        List<AttachmentDto> attachments = new ArrayList<>();
        if (files != null) {
            for(MultipartFile file : files) {
                AttachmentDto fileDto = new AttachmentDto();
                fileDto.setFileName(file.getOriginalFilename());
                try {
                    fileDto.setContent(file.getBytes());
                } catch (IOException e) {
                    throw new BaseException("Error reading attached file", e);
                }
                attachments.add(fileDto);
            }
        }

        MailDto mailDto = new MailDto();
        Client client = ofNullable(clientRepository.findOne(clientId))
            .orElseThrow(() -> new NotFoundException("Client not found").withFields(field("client_id", clientId)));

        // find the person - could be SAR, SAE, or Manager
        ClientMemberDto loggedInUser = getLoggedInUser();
        Carrier carrier = sharedCarrierService.findByName(ANTHEM_BLUE_CROSS);
        Person foundPerson = personRepository.findByCarrierId(carrier.getCarrierId()).stream()
            .filter(p -> p.getEmail().equalsIgnoreCase(loggedInUser.getEmail()))
            .findFirst()
            .orElseThrow(() -> new BaseException("Rate Request cannot be sent because"
                + " authenticated user cannot be found in person table").withFields(field("email", loggedInUser.getEmail())));

        Person personManager = null;
        if(foundPerson.getType().equals(CARRIER_MANAGER)){
            personManager = foundPerson;
        }else{
            List<Person> personManagers = personRelationRepository.findParent(foundPerson.getPersonId());
            if(isEmpty(personManagers)){
                throw new BaseException("Rate Request cannot be sent because"
                    + " authenticated user;s manager cannot be found in relation table").withFields(field("email", loggedInUser.getEmail()));
            }else {
                if(personManagers.size() > 1) {
                    logger.warnLog(format(
                        "Multiple managers found for person with email=%s. Picking first one!",
                        loggedInUser.getEmail()));
                }
                personManager = personManagers.get(0);
            }
        }

        // Set recipients
        setMailRecipients(mailDto, TO, personManager.getEmail());
        setMailRecipients(mailDto, CC, client.getPresalesEmail(), client.getSalesEmail());

        String effectiveDate = DateHelper.fromDateToString(client.getEffectiveDate());
        String subject = format("Rating Request Approval:  %s, %s", client.getClientName(), effectiveDate);
        mailDto.setSubject(subject);

        String templatePath = getPrefix() + RATER_REQUEST_APPROVAL_TEMPLATE;
        String emailContent = velocityService.getRaterBankApprovalEmailTemplate(templatePath, client,
            dto, note, personManager.getFullName());

        mailDto.setContent(emailContent);
        send(mailDto, attachments);

        // store rate bank notification
        sharedHistoryService.storeNotification(clientId, quoteType.name() + "_RATE_BANK_REQUEST");
    }

    public void sendQuoteReady(Long clientId, ClientAllQuoteDto quoteDto) {

        Client client = ofNullable(clientRepository.findOne(clientId))
                .orElseThrow(() -> new BaseException(
                    format("Client not found clientId=%s", clientId)));

        RfpQuoteSummary rqs = ofNullable(rfpQuoteSummaryRepository.findByClientClientId(clientId))
               .orElseThrow(() -> new BaseException(
                   format("Quote Summary not found clientId=%s", clientId)));

        List<AttachmentDto> attachments = new ArrayList<>();
       
        // add financial summary PDF file
        String page = velocityService.getFinancialSummaryPage(getPrefix() + FINANCIAL_SUMMARY_TEMPLATE, client, quoteDto);
        ByteArrayOutputStream baos = documentGeneratorService.stringArrayToPdfOS(new String[] {page}, true);
        AttachmentDto fileDto = new AttachmentDto();
        fileDto.setFileName(client.getClientName() + "_financial_summary.pdf");
        fileDto.setContent(baos.toByteArray());
        attachments.add(fileDto);

        MailDto mailDto = new MailDto();
        
        // Set recipients
        setClientTeamRecipients(mailDto, clientId);
        setMailRecipients(mailDto, CC, client.getPresalesEmail(), client.getSalesEmail());
        //setMailRecipients(mailDto, BCC, Constants.SITE_CONTACT_US_EMAIL);
        
        mailDto.setSubject(format("Your quote for %s is ready for review!", client.getClientName()));

        String templatePath = getPrefix() + QUOTE_READY_TEMPLATE;
        String emailContent = velocityService.getQuoteReadyEmailTemplate(templatePath, client, rqs, quoteDto);

        mailDto.setContent(emailContent);
        
        send(mailDto, attachments);
        
        storeEmailNotification(client.getClientId(), "QUOTE_READY");
    }

    protected MailDto setClientTeamRecipients(MailDto mailDto, Long clientId) {

        List<String> recipients = mailDto.getRecipients();
        if(recipients == null){
            recipients = new ArrayList<>();
        }

        recipients.addAll(
            clientTeamRepository.
                findByClientClientId(clientId).
                stream().
                map(ClientTeam::getEmail).
                filter(StringUtils::isNotBlank).
                collect(Collectors.toList())
        );

        if(recipients.isEmpty()){
            throw new BaseException("Email cannot be sent because client has no brokers in client team!");
        }
        mailDto.setRecipients(recipients);
        return mailDto;
    }

}
