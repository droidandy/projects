package com.benrevo.be.modules.shared.service;

import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.mail.SMTPMailer;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.Notification;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientTeamRepository;
import com.benrevo.data.persistence.repository.NotificationRepository;
import com.benrevo.data.persistence.repository.RfpRepository;

import javax.mail.MessagingException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.docx4j.openpackaging.exceptions.Docx4JException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.common.enums.CarrierType.fromStrings;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.StreamUtils.mapToList;
import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.equalsAnyIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
@Transactional
public class BaseEmailService {
    
    private static final String EMAIL_TEMPLATE_DIR = "/templates/%s/email";
    
    protected long SIZE_LIMITATION = 5 * 1024 * 1024;

    @Value("${app.carrier}")
    protected String[] appCarrier;

    @Autowired
    protected CustomLogger logger;

    @Autowired // privete - to use BaseEmailService.send() in children classes
    private SMTPMailer smtpMailer;
    
    @Autowired
    protected Auth0Service auth0Service;

    @Autowired
    protected BrokerRepository brokerRepository;
    
    @Autowired
    protected RfpRepository rfpRepository;

    @Autowired
    protected NotificationRepository notificationRepository;

    @Autowired
    private ClientTeamRepository clientTeamRepository;
    
    @Autowired
    protected ClientRepository clientRepository;

    protected List<AttachmentDto> buildAttachments(List<FileDto> fileAttachments) throws Docx4JException, IOException {
        return mapToList(fileAttachments, fileDto -> new AttachmentDto(fileDto.getName(), fileDto.getContent()));
    }

    protected Broker findCurrentBroker() {
        final Long id = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();
        Optional<Broker> broker = Optional.ofNullable(brokerRepository.findOne(id));
        return broker.orElseThrow(() -> new NotFoundException("Broker not found").withFields(field("broker_id", id)));
    }


    // TODO common method to build attachment file parts (split by size limit)

    
    public void storeEmailNotification(Long clientId, String name) {
        Notification not = new Notification();
        not.setChannel("EMAIL");
        not.setDate(new Date());
        not.setClientId(clientId);
        not.setName(name.toUpperCase());
        notificationRepository.save(not);
    }

    /**
     * Used to provide the copy of RFP sent to carriers to the brokers and their client team for
     * record-keeping purposes.
     *
     * @param clientId
     * @return
     */
    protected MailDto setRecordKeepingRecipients(Long clientId) {
        List<ClientTeam> clientTeam = clientTeamRepository.findByClientClientId(clientId);

        MailDto mailDto = new MailDto();
        List<String> recipientList = new ArrayList<>();

        if(clientTeam != null) {
            for(ClientTeam ct : clientTeam) {
                if(isNotBlank(ct.getEmail())) {
                    recipientList.add(ct.getEmail());
                }
            }
        }

        mailDto.setRecipients(recipientList);

        return mailDto;
    }

    protected void addClientTeamAsRecipients(MailDto mailDto, Long clientId) {
        List<ClientTeam> clientTeam = clientTeamRepository.findByClientClientId(clientId);

        List<String> recipientList = mailDto.getRecipients();
        if(recipientList == null){
            recipientList = new ArrayList<>();
        }

        if(clientTeam != null) {
            for(ClientTeam ct : clientTeam) {
                if(isNotBlank(ct.getEmail())) {
                    recipientList.add(ct.getEmail());
                }
            }
        }

        mailDto.setRecipients(recipientList);
    }

    protected void send(MailDto mailDto) {
        smtpMailer.send(mailDto);
    }
    
    protected void send(MailDto mailDto, List<AttachmentDto> attachments) {
        try {
            smtpMailer.send(mailDto, attachments);
        } catch(MessagingException e) {
            throw new BaseException("Mail send error", e);
        }
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

    protected MailDto buildMailDto(String emailTemplate, String subject, String body, List<String> recipients) {
        MailDto mailDto = new MailDto();
        mailDto.setRecipients(recipients);
        mailDto.setSubject(subject);
        mailDto.setContent(body);
        return mailDto;
    }

    protected FileDto buildFileDto(ByteArrayOutputStream outputStream, String filename, String mimeType) {
        FileDto fileDto = new FileDto();
        fileDto.setContent(outputStream.toByteArray());
        fileDto.setName(filename);
        fileDto.setType(mimeType);
        return fileDto;
    }

    protected String getLoggedInUserName() {
        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        return auth0Service.getUserName(authentication.getName());
    }

    protected ClientMemberDto getLoggedInUser() {
        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        return auth0Service.getUserByAuthId(authentication.getName());
    }

    public String getPrefix() {
        CarrierType ct = fromStrings(appCarrier);

        return ct != null ? format(EMAIL_TEMPLATE_DIR, ct.abbreviation) : null;
    }
}
