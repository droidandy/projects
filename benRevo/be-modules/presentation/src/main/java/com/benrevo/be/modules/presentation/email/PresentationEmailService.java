package com.benrevo.be.modules.presentation.email;

import com.benrevo.be.modules.presentation.service.PresentationVelocityService;
import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.enums.StageType;
import com.benrevo.be.modules.shared.service.BaseEmailService;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.mail.SMTPMailer;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.repository.ClientRepository;
import io.vavr.control.Try;

import java.util.ArrayList;
import java.util.List;
import javax.mail.Message.RecipientType;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.salesforce.enums.OpportunityType.NewBusiness;
import static com.benrevo.common.enums.CarrierType.fromStrings;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Collections.singletonList;
import static java.util.Optional.ofNullable;
import static org.apache.commons.lang3.StringUtils.*;

@Service
@Transactional
public class PresentationEmailService extends BaseEmailService {

    public static String NEW_SALE_NOTIFICATION_TEMPLATE = "/new-sale-notification.vm";
    public static String QUOTE_VIEWED_TEMPLATE = "/quote_viewed.vm";
    public static String QUOTE_VIEWED_SUBJECT = "%s - Proposal Viewed in BenRevo Portal by %s";

    @Value("${app.env}")
    private String appEnv;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    protected PresentationVelocityService velocityService;

    @Autowired
    protected ClientRepository clientRepository;

    public void sendNewSaleNotification(Long clientId) {
        Client client = clientRepository.findOne(clientId);
//        ClientDto clientDto = ClientMapper.clientToDTO(client);
        Broker clientBroker = client.getBroker();

        Broker authenticatedBroker = findCurrentBroker();

        // send mail to carrier
        String templatePath = getPrefix() + NEW_SALE_NOTIFICATION_TEMPLATE;
        String emailTemplate = velocityService.getNewSaleNotificationTemplate(
            templatePath,
            authenticatedBroker,
            clientBroker,
            client,
            null
        );
        MailDto mailDto = setRecipients(clientBroker, clientId);
        mailDto.setSubject(getNewSaleNotificationSubject(client));
        mailDto.setContent(emailTemplate);
        send(mailDto);

        // send mail to client team
        sendNewSaleNotificationRecord(clientId);

        storeEmailNotification(clientId, "NEW_SALES");
    }

    /**
     * Used as a "stop-gap" until Carriers integrate with Salesforce. This method is used to set
     * the carrier emails ONLY. NO BROKERS/CLIENT_TEAM MEMBERS.
     *
     * @param broker, clientId
     * @return
     */
    protected MailDto setRecipients(Broker broker, Long clientId) {
        Client client = clientRepository.findOne(clientId);
        String presaleEmail = client.getPresalesEmail();
        String salesEmail = client.getSalesEmail();

        //send the message
        if(isBlank(presaleEmail) && isBlank(salesEmail)) {
            throw new BaseException("Missing pre-sales and sales email address from broker. " +
                                    "Since no email was provided, email notification cannot be " +
                                    "sent.");
        }
        
        //send the message
        MailDto mailDto = new MailDto();
        List<String> recipientsList = new ArrayList<>();

        if(isNotBlank(presaleEmail)) {
            recipientsList.add(presaleEmail);
        }

        if(isNotBlank(salesEmail)) {
            recipientsList.add(salesEmail);
        }

        if(shouldAddSpecialtyBrokerEmail(client)) {
            recipientsList.add(client.getSpecialtyEmail());
        }

        if(isNotBlank(broker.getBcc())) {
            mailDto.setBccRecipients(singletonList(broker.getBcc()));
        }

        if(recipientsList.isEmpty()) {
            throw new BaseException("No email recipients specified. Exiting.");
        }

        mailDto.setRecipients(recipientsList);

        return mailDto;
    }

    // carrier specific
    protected String getNewSaleNotificationSubject(Client client) {
        throw new NotImplementedException("Carrier specific");
    }
    
    // carrier specific
    protected String getNewSaleNotificationEmailTemplate(Client client) {
        throw new NotImplementedException("Carrier specific");
    }

    // carrier specific
    protected void sendNewSaleNotificationRecord(Long clientId) {
        throw new NotImplementedException("Carrier specific");
    }

    public void sendQuoteViewedNotification(Long clientId) {
        Client client = clientRepository.findOne(clientId);
        ClientDto clientDto = ClientMapper.clientToDTO(client);
        Broker authenticatedBroker = findCurrentBroker();
        Broker nonGABroker = client.getBroker();

        String salesEmail = client.getSalesEmail();
        String presalesEmail = client.getPresalesEmail();
        if (salesEmail == null ) {
            // do nothing
            logger.errorLog(
                "Could not send quote viewed notification - broker sales email missing.",
                field("broker_id", nonGABroker.getBrokerId())
            );
            return; 
        }

        String emailTemplate = velocityService.getQuoteViewedNotificationTemplate(
            getPrefix() + QUOTE_VIEWED_TEMPLATE, authenticatedBroker, nonGABroker, clientDto, getLoggedInUserName() );

        MailDto mailDto = new MailDto();
        SMTPMailer.setMailRecipients(mailDto, RecipientType.TO, salesEmail, presalesEmail);
        mailDto.setSubject(String.format(QUOTE_VIEWED_SUBJECT, client.getClientName(), authenticatedBroker.getName() ));
        mailDto.setContent(emailTemplate);

        send(mailDto);

        // Salesforce
        Try.run(
            () -> publisher.publishEvent(
                new SalesforceEvent.Builder()
                    .withObject(
                        new SFOpportunity.Builder()
                            .withBrokerageFirm(client.getBroker().getName())
                            .withName(client.getClientName())
                            .withCarrier(fromStrings(appCarrier))
                            .withTest(!equalsIgnoreCase(appEnv, "prod"))
                            .withCarrierContact(salesEmail)
                            .withViewedByBroker(true)
                            .withCloseDate(client.getDueDate())
                            .withStageName(StageType.fromClientState(client.getClientState()))
                            .withType(NewBusiness)
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
}
