package com.benrevo.common.mail;

import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.ClientException;
import com.benrevo.common.logging.CustomLogger;
import io.vavr.control.Try;

import java.util.Arrays;
import java.util.StringJoiner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import javax.activation.DataHandler;
import javax.mail.Address;
import javax.mail.Message.RecipientType;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.SendFailedException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import static com.benrevo.common.enums.CarrierType.fromStrings;
import static com.benrevo.common.util.StreamUtils.mapToList;
import static java.lang.String.format;
import static java.util.Arrays.copyOf;
import static java.util.Arrays.stream;
import static java.util.stream.Collectors.toList;
import static javax.mail.Message.RecipientType.*;
import static org.apache.commons.lang3.StringUtils.equalsAnyIgnoreCase;

@Component
public class SMTPMailer implements ISMTPMailer {

    // Properties
    public static final String HOST = "mail.host";
    public static final String PORT = "mail.smtp.port";
    public static final String USERNAME = "mail.smtp.username";
    public static final String PASSWORD = "mail.smtp.password";

    // Encrypted origin emnails
    public static final String[] ENCRYPTED_EMAILS = {
        "notifications@benrevo.com"
    };

    // Standard origin emails
    public static final String[] STANDARD_EMAILS = {
        "anthem@benrevo.com", // TODO: Move this to the above
        "unitedhealthcare@benrevo.com", // TODO: Move this to the above
        "info@benrevo.com"
    };

    static Session mailSession;

    private final String BENREVO_BCC_1 = "info@benrevo.com";

    private static CustomLogger LOGGER = CustomLogger.create();

    @Value("${app.carrier}")
    private String[] appCarrier;

    @Value("${mail.smtp.auth:true}")
    private String smtpAuth;

    @Value("${mail.smtp.starttls.enable:true}")
    private String smtpTlsEnable;

    @Value("${mail.smtp.starttls.required:true}")
    private String smtpTlsRequired;

    // Standard configs
    @Value("${aws.ses.port}")
    private String standardPort;

    @Value("${aws.ses.host}")
    private String standardHost;

    @Value("${aws.ses.access.key}")
    private String standardUsername;

    @Value("${aws.ses.secret.key}")
    private String standardPassword;

    // Paubox/Encrypted configs
    @Value("${paubox.port}")
    private String encryptedPort;

    @Value("${paubox.host}")
    private String encryptedHost;

    @Value("${paubox.username}")
    private String encryptedUsername;

    @Value("${paubox.password}")
    private String encryptedPassword;

    private Properties resolveMailConfiguration(String email) {
        Properties config = new Properties();

        config.putAll(System.getProperties());

        if(equalsAnyIgnoreCase(email, ENCRYPTED_EMAILS)) {
            config.put(HOST, encryptedHost);
            config.put(PORT, encryptedPort);
            config.put(USERNAME, encryptedUsername);
            config.put(PASSWORD, encryptedPassword);
        } else if(equalsAnyIgnoreCase(email, STANDARD_EMAILS)) {
            config.put(HOST, standardHost);
            config.put(PORT, standardPort);
            config.put(USERNAME, standardUsername);
            config.put(PASSWORD, standardPassword);
        }

        config.put("mail.smtp.auth", smtpAuth);
        config.put("mail.smtp.starttls.enable", smtpTlsEnable);
        config.put("mail.smtp.starttls.required", smtpTlsRequired);

        return config;
    }

    /**
     * Method for sending the email with multiple attachments
     *
     * @param mailDto
     * @param attachments
     *
     * @return
     */
    @Override
    public void send(MailDto mailDto, List<AttachmentDto> attachments) throws MessagingException {
        MimeBodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setContent(mailDto.getContent(), "text/html");

        Multipart multipart = new MimeMultipart();
        multipart.addBodyPart(messageBodyPart);

        List<Optional<AttachmentDto>> attachedDocuments = mapToList(attachments, attachment -> {
            try {
                MimeBodyPart part = new MimeBodyPart();

                part.setFileName(attachment.getFileName());
                multipart.addBodyPart(part);

                ByteArrayDataSource dataSource = new ByteArrayDataSource(attachment.getContent(), "application/octet-stream");
                DataHandler dataHandler = new DataHandler(dataSource);

                part.setDataHandler(dataHandler);

                return Optional.of(attachment);
            } catch (Exception e) {
                return Optional.empty();
            }
        });

        boolean hasErrors = attachedDocuments.stream().anyMatch(x -> !x.isPresent());

        if (hasErrors) {
            throw new MessagingException("Can't attach the document(s)");
        }

        send(mailDto, multipart);
    }

    private void send(MailDto mailDto, Multipart multipart) {
        // Generate and send message
        MimeMessage email = createMailMessage(mailDto, multipart);
    }

    @Override
    public void send(MailDto mailDto) {
        // Generate and send message
        MimeMessage email = createMailMessage(mailDto, null);
    }

    /****************************************
     * Helper methods
     ****************************************/

    private MimeMessage createMailMessage(MailDto mailDto, Multipart multipart) {

        if(null == mailDto || null == mailDto.getRecipients()) {
            throw new BadRequestException("Invalid mail object/recipient list provided");
        }

        MimeMessage mailMessage;
        Transport transport = null;

        validateRecipients(mailDto);

        try {
            InternetAddress fromEmail = new InternetAddress(getFromEmailAddress());
            Properties config = resolveMailConfiguration(fromEmail.getAddress());

            mailSession = Session.getDefaultInstance(
                config,
                null
            );

            mailMessage = new MimeMessage(mailSession);
            mailMessage.setFrom(fromEmail);

            // copy BenRevo on every email
            addRecipient(mailMessage, BCC, BENREVO_BCC_1);

            // add TO list
            for(String recipient : mailDto.getRecipients()) {
                mailMessage.addRecipient(TO, new InternetAddress(recipient));
            }

            // add CC list
            if(null != mailDto.getCcRecipients()) {
                mailDto.getCcRecipients().forEach(ccr -> addRecipient(mailMessage, CC, ccr));
            }

            // add BCC list
            if(null != mailDto.getBccRecipients()) {
                mailDto.getBccRecipients().forEach(bccRecipient -> addRecipient(mailMessage, BCC, bccRecipient));
            }

            if(null == multipart) {
                MimeBodyPart messageBodyPart = new MimeBodyPart();
                messageBodyPart.setContent(mailDto.getContent(), "text/html");
                multipart = new MimeMultipart();
                multipart.addBodyPart(messageBodyPart);
            }

            mailMessage.setSubject(mailDto.getSubject());
            mailMessage.setContent(multipart);

            transport = mailSession.getTransport("smtp");

            if(!transport.isConnected()) {
                transport.connect(
                    config.getProperty(HOST),
                    Integer.parseInt(config.getProperty(PORT)),
                    config.getProperty(USERNAME),
                    config.getProperty(PASSWORD)
                );
            }

            transport.sendMessage(mailMessage, mailMessage.getAllRecipients());
        } catch(SendFailedException e) {
            // If email address domain is wrong, return client exception to the user
            String message = ExceptionUtils.getRootCauseMessage(e);
            Pattern pattern = Pattern.compile("\\<(.*?)\\>");
            Matcher matcher = pattern.matcher(message);
            StringJoiner joiner = new StringJoiner(",");
            while(matcher.find()) {
                joiner.add(matcher.group(1));
            }
            throw new ClientException(e.getMessage() + " " + joiner.toString() + ". Email was not sent. Please verify and resend. ", e);
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        } finally {
            try {
                if(transport != null && transport.isConnected()) {
                    transport.close();
                }
            } catch(MessagingException e) {
                LOGGER.error(e.getMessage(), e);
            }
        }

        return mailMessage;
    }
    
    private void validateRecipients(MailDto mailDto) {
        if(mailDto == null) {
            throw new BadRequestException("Invalid mail object provided");
        }
        if(mailDto.getRecipients() == null) {
            throw new BadRequestException("Invalid mail recipient list provided");
        }
        // remove invalid To recipients
        mailDto.getRecipients().removeIf(StringUtils::isBlank);

        if(mailDto.getRecipients().isEmpty()) {
            throw new BadRequestException("Empty mail recipient list provided");
        }
        // remove invalid Bcc and Cc recipients
        if(mailDto.getBccRecipients() != null) {
            mailDto.getRecipients().removeIf(StringUtils::isBlank);
        }
        if(mailDto.getCcRecipients() != null) {
            mailDto.getRecipients().removeIf(StringUtils::isBlank);
        }
    }

    /**
     * Helper method to set the appropriate bcc or cc email recipients on a given {@link MailDto} (mutator).
     * Used typically in business logic outside this class.
     *
     * @param mailDto
     *     the {@link MailDto} to modify/mutate
     * @param type
     *     the {@link RecipientType} for the specific recipients
     * @param recipients
     *     a varargs array of String email addresses
     */
    public static void setMailRecipients(MailDto mailDto, RecipientType type, String ... recipients) {
        Try.run(() -> {
            if(type != null) {
                if(recipients == null || recipients.length == 0) {
                    throw new BaseException("Provided recipient list is null/empty. Exiting.");
                }

                List<String> r = stream(copyOf(recipients, recipients.length))
                    .filter(StringUtils::isNotBlank)
                    .filter(rs -> EmailValidator.getInstance().isValid(rs))
                    .collect(toList());

                if(r.size() > 0) {
                    switch(type.toString()) {
                        case "Cc":
                            mailDto.setCcRecipients(r);
                            break;
                        case "Bcc":
                            mailDto.setBccRecipients(r);
                            break;
                        case "To":
                        default:
                            mailDto.setRecipients(r);
                            break;
                    }
                }
            } else {
                throw new BaseException("Email recipient type not specified. Exiting.");
            }
        }).onFailure(t -> LOGGER.errorLog(t.getMessage(), t));
    }

    public static void addMailRecipients(MailDto mailDto, RecipientType type, String ... recipients) {
        Try.run(() -> {
            if(type != null) {
                if(recipients == null || recipients.length == 0) {
                    throw new BaseException("Provided recipient list is null/empty. Exiting.");
                }

                List<String> r = stream(copyOf(recipients, recipients.length))
                    .filter(StringUtils::isNotBlank)
                    .filter(rs -> EmailValidator.getInstance().isValid(rs))
                    .collect(toList());

                if(r.size() > 0) {
                    switch(type.toString()) {
                        case "Cc":
                            mailDto.getCcRecipients().addAll(r);
                            break;
                        case "Bcc":
                            mailDto.getBccRecipients().addAll(r);
                            break;
                        case "To":
                        default:
                            mailDto.getRecipients().addAll(r);
                            break;
                    }
                }
            } else {
                throw new BaseException("Email recipient type not specified. Exiting.");
            }
        }).onFailure(t -> LOGGER.errorLog(t.getMessage(), t));
    }

    public void addRecipient(MimeMessage mailMessage, RecipientType type, String recipient) {
        try {
            InternetAddress recipientEmail = new InternetAddress(recipient);

            mailMessage.addRecipient(type, recipientEmail);
        } catch(Exception e) {
            LOGGER.error(
                format(
                    "Invalid email provided to email message; email=%s",
                    recipient
                )
            );
        }
    }

    /**
     * Retrieve the source email address based on APP_CARRIER.
     *
     * @return
     *     {@link String} email address
     */
    private String getFromEmailAddress() {
        CarrierType ct = fromStrings(appCarrier);

        switch(ct) {
            case ANTHEM_BLUE_CROSS:
                return "anthem@benrevo.com";
            case UHC:
                return "unitedhealthcare@benrevo.com";
            case BENREVO:
                return "notifications@benrevo.com";
            default:
                return "info@benrevo.com";
        }
    }
}
