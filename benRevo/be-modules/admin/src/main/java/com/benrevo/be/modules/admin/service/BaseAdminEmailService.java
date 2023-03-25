package com.benrevo.be.modules.admin.service;

import com.benrevo.be.modules.client.service.ClientService;
import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.RfpQuoteSummaryShortDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.mail.SMTPMailer;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.*;
import io.vavr.control.Try;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang.NotImplementedException;
import org.apache.commons.lang3.StringUtils;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.salesforce.enums.OpportunityType.NewBusiness;
import static com.benrevo.be.modules.salesforce.enums.StageType.Onboarding;
import static com.benrevo.be.modules.salesforce.enums.StageType.Quoted;
import static com.benrevo.common.Constants.*;
import static com.benrevo.common.enums.CarrierType.carrierMatches;
import static com.benrevo.common.enums.CarrierType.fromStrings;
import static com.benrevo.common.enums.CarrierType.isCarrierNameAppCarrier;
import static com.benrevo.common.mail.SMTPMailer.setMailRecipients;
import static com.benrevo.common.util.MapBuilder.field;
import static java.lang.String.format;
import static java.util.Objects.isNull;
import static javax.mail.Message.RecipientType.*;
import static org.apache.commons.lang.StringEscapeUtils.escapeXml;
import static org.apache.commons.lang3.StringUtils.*;

@Service
@Transactional
public class BaseAdminEmailService {

    @Value("${app.carrier}")
    private String[] appCarrier;

    @Value("${app.env}")
    private String appEnv;

    @Autowired
    private CustomLogger logger;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private ClientService clientService;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private VelocityEngine velocityEngine;

    @Autowired
    private SMTPMailer smtpMailer;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    protected ClientRepository clientRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private RfpSubmissionRepository submissionRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private ClientTeamRepository clientTeamRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    protected ClientPlanRepository clientPlanRepository;

    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private Auth0Service auth0Service;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private AdminRfpQuoteSummaryService adminRfpQuoteSummaryService;

    protected static final String QUOTE_READY_TEMPLATE = "quote_ready.vm";
    private static final String QUOTE_READY_SUBJECT = "%s - Proposal Ready in BenRevo Portal for Broker";

    protected static final String APPROVE_TEMPLATE = "approve.vm";
    private static final String APPROVE_SUBJECT = "%s - The final selections submitted have been approved ";

    protected static final String INTRODUCING_TEMPLATE = "introducing.vm";
    private static final String INTRODUCING_SUBJECT = "Introducing our new online platform";

    protected static final String WELCOME_TEMPLATE = "welcome.vm";
    private static final String WELCOME_SUBJECT = "Introducing our new online platform";

    protected static final String ACCOUNT_APPROVE_TEMPLATE = "account_approval.vm";
    // FIXME correct subject text
    private static final String ACCOUNT_APPROVE_SUBJECT = "Your account have been approved";

    protected static final String ACCOUNT_DENY_TEMPLATE = "account_denial.vm";
    // FIXME correct subject text
    private static final String ACCOUNT_DENY_SUBJECT = "Your account have been denied";
    private static final String OPTION_1 = "Option 1";
    private static final String RENEWAL_1 = "Renewal 1";
    private static final String RENEWAL = "Renewal";

    public void sendEmail(ClientState clientState, Long clientId, String carrierName){
        switch(clientState){
            case QUOTED:
                sendQuoteReadyNotification(clientId, carrierName);
                break;
            case ON_BOARDING:
                sendApproveOnBoarding(clientId);
                break;
        }
    }

    public void sendAccountRequestApproveEmail(String brokerageName, String agentName, String agentEmail){
        MailDto mailDto = prepareAccountApproveMailDto(brokerageName, agentName, agentEmail);
        smtpMailer.send(mailDto);
        // storeNotification(clientId, "ACCOUNT_APPROVED");
    }

    public void sendAccountRequestDenyEmail(String agentName, String agentEmail, String reason){
        MailDto mailDto = prepareAccountDenyMailDto(agentName, agentEmail, reason);
        smtpMailer.send(mailDto);
        // storeNotification(clientId, "ACCOUNT_APPROVED");
    }

    public void sendWelcomeEmail(String salesFullName, String brokerEmail, String agentName, String gaName) {
        MailDto mailDto = prepareWelcomeMailDto(salesFullName, brokerEmail, agentName, gaName);
        smtpMailer.send(mailDto);
    }

    protected MailDto prepareQuoteReadyNotificationMailDto(Long clientId, String carrierName, Long programId) {
        ClientDto clientDto = clientService.getById(clientId);
        Program program = !isNull(programId) ? programRepository.findOne(programId) : null;
        Client client = clientRepository.findOne(clientId);
        Broker broker = client.getBroker();
        MailDto mailDto = new MailDto();
        List<AttributeName> attrs = clientDto.getAttributes();

        if(attrs != null && attrs.contains(AttributeName.DIRECT_TO_PRESENTATION) && !attrs.contains(AttributeName.RENEWAL)) {
            mailDto.setContent(getIntroducingContent(getIntroducingEmailTemplatePath(), client));
            mailDto.setSubject("Your quote for " + clientDto.getClientName() + " is ready for review!");
        } else {
            mailDto.setContent(getQuoteReadyNotificationContent(getQuoteReadyEmailTemplatePath(), broker, clientDto, program));
            mailDto.setSubject(String.format(QUOTE_READY_SUBJECT, clientDto.getClientName()));
        }

        setClientTeamRecipients(mailDto, clientId);
        setCarrierRepRecipients(mailDto, clientId);
        return mailDto;
    }

    protected String getIntroducingContent(String templatePath, Client client) {

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("client_name", client.getClientName());
        velocityContext.put("sales_first_name", client.getSalesFirstName());

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public void sendProgramReadyEmail(Long clientId, Long programId) {

        MailDto mailDto = prepareQuoteReadyNotificationMailDto(clientId, null, programId);
        smtpMailer.send(mailDto);
        clientService.updateClientState(clientId, ClientState.QUOTED);
        storeNotification(clientId, "QUOTE_READY");
    }

    public void sendQuoteReadyNotification(Long clientId, String carrierName) {
        if(!validateQuoteReady(clientId)){
            return;
        }

        MailDto mailDto = prepareQuoteReadyNotificationMailDto(clientId, carrierName, null);
        smtpMailer.send(mailDto);
        clientService.updateClientState(clientId, ClientState.QUOTED);
        storeNotification(clientId, "QUOTE_READY");

        ClientDto client = clientService.getById(clientId);

        // Salesforce
        Try.run(() -> publisher.publishEvent(
            new SalesforceEvent.Builder()
                .withObject(
                    new SFOpportunity.Builder()
                        .withBrokerageFirm(client.getBrokerName())
                        .withName(client.getClientName())
                        .withCarrier(fromStrings(appCarrier))
                        .withTest(!equalsIgnoreCase(appEnv, "prod"))
                        .withType(NewBusiness)
                        .withStageName(Quoted)
                        .build()
                )
                .withEmail(
                    Try.of(
                        () -> ((AuthenticatedUser) SecurityContextHolder
                            .getContext()
                            .getAuthentication())
                            .getEmail()
                    ).getOrNull()
                )
                .build()
                )
        ).onFailure(t -> logger.error(t.getMessage(), t));

        // create OPTION1_RELEASED activity
        createOption1ReleasedActivity(clientId, MEDICAL);
        createOption1ReleasedActivity(clientId, DENTAL);
        createOption1ReleasedActivity(clientId, VISION);

    }

    public boolean allQuotesAreDTQ(Long clientId){
        List<QuoteType> quoteTypes = rfpQuoteRepository
            .findByClientId(clientId)
            .stream()
            .filter(q -> {
                    String category = q.getRfpSubmission().getRfpCarrier().getCategory();
                    return Constants.MEDICAL.equals(category)
                            || Constants.DENTAL.equals(category)
                            || Constants.VISION.equals(category);
                }
            )
            .map(RfpQuote::getQuoteType)
            .filter(t -> !t.equals(QuoteType.CLEAR_VALUE))
            .collect(Collectors.toList());

        if(quoteTypes.isEmpty()) {
            return true;
        }else {
            return false;
        }
    }

    private boolean validateQuoteReady(Long clientId){
        if(allQuotesAreDTQ(clientId)){
            return false;
        }
        validateRenewal(clientId);
        validateOption1Exists(clientId);
        validateQuoteSummaryExists(clientId);
        return true;
    }

    public void validateRenewal(Long clientId){}

    public void validateOption1Exists(Long clientId) {
        // check to make sure at least one (non-CV and non-DTQ) option 1  was created for either Medical, Dental and Vision
        List<RfpQuoteOption> rfpQuoteOptions1 = rfpQuoteOptionRepository.findByClientId(clientId);
        if (rfpQuoteOptions1 != null) {
            rfpQuoteOptions1 = rfpQuoteOptions1.stream()
                    .filter(o -> {
                        boolean isOption1 = equalsAnyIgnoreCase(o.getRfpQuoteOptionName(), OPTION_1, RENEWAL_1, RENEWAL);
                        boolean isClearValue = o.getRfpQuote().getQuoteType().equals(QuoteType.CLEAR_VALUE);
                        boolean isDTQ = o.getRfpQuote().getQuoteType().equals(QuoteType.DECLINED);
                        return isOption1 && !isClearValue && !isDTQ;
                    })
                    .collect(Collectors.toList());
        }

        if(rfpQuoteOptions1 == null || rfpQuoteOptions1.isEmpty()) {
            throw new BaseException("No Option 1 created for any product!");
        }
    }

    private void validateQuoteSummaryExists(Long clientId){
        // check to make sure Admin added Rfp Quote Summary
        RfpQuoteSummaryShortDto summaryShortDto = adminRfpQuoteSummaryService.getByClientId(clientId);
        if(isNull(summaryShortDto) || StringUtils.isAllEmpty(
            summaryShortDto.getMedicalNotes(),
            summaryShortDto.getMedicalWithKaiserNotes(),
            summaryShortDto.getDentalNotes(),
            summaryShortDto.getVisionNotes())){

            // admin did not set quote summary
            throw new BaseException("No quote summaries added for client! Please add quote summaries!");
        }

    }

    protected void createOption1ReleasedActivity(Long clientId, String category) {

        // find Option1
        List<RfpQuote> rfpQuotes = filterQuotesByQuoteType(
            rfpQuoteRepository.findByClientIdAndCategory(clientId, category), Arrays.asList(QuoteType.STANDARD));

        /** If client has standard and kaiser quote AND client has incumbent kaiser carrier,
         *  use the kaiser quotes in the Option 1 released activity
         *  https://app.asana.com/0/308554828644777/545008038751212/f
         */
        if(category.equalsIgnoreCase(Constants.MEDICAL)) {
            List<RfpQuote> kaiserRfpQuotes = filterQuotesByQuoteType(
                rfpQuoteRepository.findByClientIdAndCategory(clientId, category), Arrays.asList(QuoteType.KAISER));

            List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(clientId);
            if(clientPlans != null && clientPlans.size() > 0){
                boolean containsKaiserIncumbentCarrier = clientPlans.stream()
                    .filter(o -> o.getPnn() != null)
                    .anyMatch(c -> c.getPnn()
                        .getNetwork().getCarrier().getName().equalsIgnoreCase(KAISER_CARRIER));

                if(null != kaiserRfpQuotes && !kaiserRfpQuotes.isEmpty() && containsKaiserIncumbentCarrier){
                    rfpQuotes = kaiserRfpQuotes;
                }
            }
        }

        if(rfpQuotes.isEmpty()) {
            return;
        }

        sharedRfpQuoteService.saveOption1ReleaseActivity(clientId, category, rfpQuotes.get(0));
    }


    protected String getQuoteReadyNotificationContent(String templatePath, Broker broker, ClientDto client, Program program) {
        VelocityContext velocityContext = fillContextQuoteReadyNotification(broker, client, program);
        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }


    protected VelocityContext fillContextQuoteReadyNotification(Broker broker, ClientDto client, Program program) {
        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("client_name", client.getClientName());
        velocityContext.put("effective_date", client.getEffectiveDate());
        velocityContext.put("proposal_date", isEmpty(client.getDueDate()) ? "N/A" : client.getDueDate());
        velocityContext.put("eligible_employees", client.getEligibleEmployees());
        velocityContext.put("broker_name", broker.getName());
        if(!isNull(program)) {
            velocityContext.put("program", program.getName());
        }

        velocityContext.put("isMedicalRenewal", isAppCarrierRenewal(client.getId(), MEDICAL));
        velocityContext.put("isDentalRenewal", isAppCarrierRenewal(client.getId(), DENTAL));
        velocityContext.put("isVisionRenewal", isAppCarrierRenewal(client.getId(), VISION));

        // add quote summaries
        RfpQuoteSummaryShortDto summaryShortDto = adminRfpQuoteSummaryService.getByClientId(client.getId());
        if(!isNull(summaryShortDto)) {
            if(!isEmpty(summaryShortDto.getMedicalNotes())) {
                velocityContext.put(
                    "medical_quote_summary",
                    replaceLineBreaks(escapeXml(summaryShortDto.getMedicalNotes()))
                );
            }
            if(!isEmpty(summaryShortDto.getMedicalWithKaiserNotes())) {
                velocityContext.put(
                    "medical_kaiser_quote_summary",
                    replaceLineBreaks(escapeXml(summaryShortDto.getMedicalWithKaiserNotes()))
                );
            }
            if(!isEmpty(summaryShortDto.getDentalNotes())) {
                velocityContext.put(
                    "dental_quote_summary",
                    replaceLineBreaks(escapeXml(summaryShortDto.getDentalNotes()))
                );
            }
            if(!isEmpty(summaryShortDto.getVisionNotes())) {
                velocityContext.put(
                    "vision_quote_summary",
                    replaceLineBreaks(escapeXml(summaryShortDto.getVisionNotes()))
                );
            }
        }

        velocityContext.put("proposals", buildNotificationProposalList(client.getId()));
        velocityContext.put("StringUtils", StringUtils.class);
        return velocityContext;
    }

    protected void setCarrierRepRecipients(MailDto mailDto, Long clientId) {
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

    protected void storeNotification(Long clientId, String name){
        Notification not = new Notification();
        not.setChannel("EMAIL");
        not.setDate(new Date());
        not.setClientId(clientId);
        not.setName(name.toUpperCase());
        notificationRepository.save(not);
    }

    protected boolean shouldAddSpecialtyBrokerEmail(Client client) {
        if(client != null && client.getClientId() != null) {
            List<RFP> rfps = rfpRepository.findByClientClientId(client.getClientId());

            return rfps != null &&
                   rfps.stream()
                       .anyMatch(r -> equalsAnyIgnoreCase(r.getProduct(), DENTAL, VISION)) &&
                   isNotBlank(client.getSpecialtyEmail());
        }

        return false;
    }

    private List<RfpQuote> filterQuotesByQuoteType(List<RfpQuote> quotes, List<QuoteType> quoteTypes){
        if(quotes == null || quotes.isEmpty()){
            return new ArrayList<>();
        }

        List<RfpQuote> result = quotes.stream()
            .filter(quote -> quoteTypes.contains(quote.getQuoteType())
                  && (
                      (isCarrierNameAppCarrier(quote.getRfpSubmission().getRfpCarrier().getCarrier().getName(), appCarrier))
                            ||
                               (quote.getQuoteType().equals(QuoteType.BEYOND_BENEFIT_TRUST_PROGRAM)
                                      || quote.getQuoteType().equals(QuoteType.TECHNOLOGY_TRUST_PROGRAM)))
                )
            .collect(Collectors.toList());
        return result;
    }

    public boolean isAppCarrierRenewal(Long clientId, String category){
        List<RfpQuoteOption> rfpQuoteOptions = rfpQuoteOptionRepository.findByClientIdAndCategory(clientId, category);
        if(isNull(rfpQuoteOptions)) return false;

        return rfpQuoteOptions.stream()
            .parallel()
            .anyMatch(p -> containsIgnoreCase(p.getRfpQuoteOptionName(), "renewal")
                && isCarrierNameAppCarrier(p.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier().getName(), appCarrier)
            );
    }


    private String buildNotificationProposalList(Long clientId) {
        boolean medical = false, dental = false, vision = false;
        List<RfpQuote> allQuoteTypeMedicalQuotes = rfpQuoteRepository.findByClientIdAndCategory(clientId, MEDICAL);

        List<RfpQuote> medicalQuotes = filterQuotesByQuoteType(allQuoteTypeMedicalQuotes,
            Arrays.asList(QuoteType.STANDARD, QuoteType.KAISER, QuoteType.BEYOND_BENEFIT_TRUST_PROGRAM,
                QuoteType.TECHNOLOGY_TRUST_PROGRAM));

        List<RfpQuote> dentalQuotes = filterQuotesByQuoteType(
            rfpQuoteRepository.findByClientIdAndCategory(clientId, DENTAL),
            Arrays.asList(QuoteType.STANDARD, QuoteType.BEYOND_BENEFIT_TRUST_PROGRAM,
                QuoteType.TECHNOLOGY_TRUST_PROGRAM));

        List<RfpQuote> visionQuotes = filterQuotesByQuoteType(
            rfpQuoteRepository.findByClientIdAndCategory(clientId, VISION),
            Arrays.asList(QuoteType.STANDARD, QuoteType.BEYOND_BENEFIT_TRUST_PROGRAM,
                QuoteType.TECHNOLOGY_TRUST_PROGRAM));

        if(medicalQuotes != null && medicalQuotes.size() > 0){
            medical = true;
        }
        if(dentalQuotes != null && dentalQuotes.size() > 0){
            dental = true;
        }
        if(visionQuotes != null && visionQuotes.size() > 0){
            vision = true;
        }

        StringBuilder sb = new StringBuilder();

        if(medical) {
            sb.append("Medical"); // only "Medical"
            if(isAppCarrierRenewal(clientId, MEDICAL)){
                sb.append("(Renewal)");
            }
        }
        if(dental) {
            if(medical && vision) {
                sb.append(", "); // "Medical, Dental and Vision"
            } else if(medical ) {
                sb.append(" and ");	// "Medical and Dental"
            }
            sb.append("Dental");
            if(isAppCarrierRenewal(clientId, DENTAL)){
                sb.append("(Renewal)");
            }
        }
        if(vision) {
            if(medical || dental) {
                sb.append(" and ");	// "... and Vision"
            }
            sb.append("Vision");
            if(isAppCarrierRenewal(clientId, VISION)){
                sb.append("(Renewal)");
            }
        }
        return sb.toString();
    }

    public void sendApproveOnBoarding(Long clientId) {
        Client client = clientRepository.findOne(clientId);

        MailDto mailDto = prepareApproveMailDto(clientId);
        smtpMailer.send(mailDto);
        clientService.updateClientState(clientId, ClientState.ON_BOARDING);
        storeNotification(clientId, "ON_BOARDING_APPROVED");

        // Salesforce: update existing Opportunity to onboarding stage
        Try.run(() -> publisher.publishEvent(
            new SalesforceEvent.Builder()
                .withObject(
                    new SFOpportunity.Builder()
                        .withBrokerageFirm(client.getBroker().getName())
                        .withName(client.getClientName())
                        .withCarrier(fromStrings(appCarrier))
                        .withTest(!equalsIgnoreCase(appEnv, "prod"))
                        .withCloseDate(client.getDueDate())
                        .withType(NewBusiness)
                        .withStageName(Onboarding)
                        .build()
                )
                .withEmail(
                    Try.of(
                        () -> ((AuthenticatedUser) SecurityContextHolder
                            .getContext()
                            .getAuthentication())
                            .getEmail()
                    ).getOrNull()
                )
                .build()
                )
        ).onFailure(t -> logger.error(t.getMessage(), t));
    }

    protected MailDto prepareApproveMailDto(Long clientId) {
        ClientDto clientDto = clientService.getById(clientId);
        Client client = clientRepository.findOne(clientId);
        Broker broker = client.getBroker();
        String content;

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("client_name", clientDto.getClientName());
        velocityContext.put("effective_date", clientDto.getEffectiveDate());
        velocityContext.put("broker_name", broker.getName());
        velocityContext.put("StringUtils", StringUtils.class);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(getOnBoardingApproveMailTemplatePath(), "UTF-8", velocityContext, stringWriter);
            content=stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }

        MailDto mailDto = new MailDto();
        mailDto.setSubject(String.format(APPROVE_SUBJECT, clientDto.getClientName()));
        mailDto.setContent(content);
        setClientTeamRecipients(mailDto, clientId);

        // Set bcc recipients
        if (!carrierMatches(CarrierType.BENREVO.name(), appCarrier)) {
        	setMailRecipients(mailDto, BCC, client.getPresalesEmail(), client.getSalesEmail());
            if(shouldAddSpecialtyBrokerEmail(client)){
                mailDto.getBccRecipients().add(client.getSpecialtyEmail());
            }
        }

        return mailDto;
    }

    protected String getOnBoardingApproveMailTemplatePath() {
        throw new NotImplementedException("Carrier specific implementation");
    }

    protected String getAccountRequestApproveEmailTemplatePath() {
        throw new NotImplementedException("Carrier specific implementation");
    }

    protected String getAccountRequestDenyEmailTemplatePath() {
        throw new NotImplementedException("Carrier specific implementation");
    }

    protected String getQuoteReadyEmailTemplatePath() {
        throw new NotImplementedException("Carrier specific implementation");
    }

    protected String getIntroducingEmailTemplatePath() {
        throw new NotImplementedException("Carrier specific implementation");
    }

    protected String getWelcomeEmailTemplatePath() {
        throw new NotImplementedException("Carrier specific implementation");
    }

    protected MailDto prepareAccountApproveMailDto(String brokerageName, String agentName, String agentEmail) {

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("agent_name", agentName);
        velocityContext.put("brokerage_name", brokerageName);

        String content;
        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(getAccountRequestApproveEmailTemplatePath(), "UTF-8", velocityContext, stringWriter);
            content = stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }

        MailDto mailDto = new MailDto();
        mailDto.setSubject(ACCOUNT_APPROVE_SUBJECT);
        mailDto.setContent(content);
        List<String> recipientsList = new ArrayList<>();
        recipientsList.add(agentEmail);
        mailDto.setRecipients(recipientsList);
        return mailDto;
    }

    protected MailDto prepareAccountDenyMailDto(String agentName, String agentEmail, String reason) {

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("agent_name", agentName);
        velocityContext.put("deny_reason", reason);

        String content;
        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(getAccountRequestDenyEmailTemplatePath(), "UTF-8", velocityContext, stringWriter);
            content = stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }

        MailDto mailDto = new MailDto();
        mailDto.setSubject(ACCOUNT_DENY_SUBJECT);
        mailDto.setContent(content);
        List<String> recipientsList = new ArrayList<>();
        recipientsList.add(agentEmail);
        mailDto.setRecipients(recipientsList);
        return mailDto;
    }

    protected MailDto prepareWelcomeMailDto(String salesFullName, String brokerEmail, String agentName, String gaName) {

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("general_agency", gaName);
        velocityContext.put("agent_name", agentName);
        velocityContext.put("sales_full_name", salesFullName);

        String content;

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(getWelcomeEmailTemplatePath(), "UTF-8", velocityContext, stringWriter);
            content = stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }

        MailDto mailDto = new MailDto();

        mailDto.setRecipient(brokerEmail);
        mailDto.setSubject(WELCOME_SUBJECT);
        mailDto.setContent(content);

        return mailDto;
    }

    private Broker getBrokerById(Long brokerId) {
        Broker broker = brokerRepository.findOne(brokerId);
        if(broker == null) {
            throw new NotFoundException(format("Broker not found; broker_id=%s", brokerId));
        }
        return broker;
    }

    private String replaceLineBreaks(String str){
        return str.replaceAll("(\r\n|\n)", "<br/>");
    }
}
