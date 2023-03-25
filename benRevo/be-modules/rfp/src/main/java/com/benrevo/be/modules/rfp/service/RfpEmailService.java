package com.benrevo.be.modules.rfp.service;

import com.benrevo.be.modules.shared.service.*;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientFileUpload;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.mapper.FileMapper;
import com.benrevo.data.persistence.repository.ClientRepository;
import javax.mail.Message.RecipientType;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.mail.SMTPMailer.setMailRecipients;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.StreamUtils.mapToList;
import static java.lang.String.format;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static javax.mail.Message.RecipientType.BCC;
import static javax.mail.Message.RecipientType.CC;
import static javax.mail.Message.RecipientType.TO;

@Service
@Transactional
public class RfpEmailService extends BaseEmailService {

    protected static String RFP_SUBMISSION_TEMPLATE = "/rfp-submission.vm";
    protected static String RFP_SUBMISSION_RECORD_TEMPLATE = "/rfp-submission-record.vm";

    @Autowired
    protected SharedClientService sharedClientService;

    @Autowired
    protected SharedFileService sharedFileService;

    @Autowired
    protected SharedBrokerService sharedBrokerService;

    @Autowired
    protected DocumentGeneratorService documentGeneratorService;

    @Autowired
    protected S3FileManager s3FileManager;
    
    @Autowired
    protected ClientRepository clientRepository;

    @Autowired
    protected RfpVelocityService rfpVelocityService;


    protected String buildRfpSubmissionEmailTemplate(Broker broker, ClientDto clientDto, String template) {
        final String templatePath = getPrefix() + template;
        return rfpVelocityService.getSubmissionTemplate(templatePath, broker, clientDto );
    }

    public void sendRFPSubmission(Long clientId, List<Long> rfpIds) throws BaseException {
        final Broker broker = findCurrentBroker();

        final ClientDto clientDto = sharedClientService.getById(clientId);

        Client client = clientRepository.findOne(clientId);
        
        List<RFP> rfps = rfpRepository.findByClientClientIdAndRfpIdIn(clientId, rfpIds);

        rfps.sort(comparing(RFP::getRfpId));

        List<FileDto> rfpFileAttachments = new ArrayList<>();
        
        // add RFP file
        String rfpPagesArray[] = preparePages(broker, clientDto, rfps);
        if(rfpPagesArray.length > 0) {
            ByteArrayOutputStream baos = documentGeneratorService.stringArrayToPdfOS(rfpPagesArray);
            FileDto fileDto = new FileDto();
            fileDto.setName("RFP.pdf");
            fileDto.setContent(baos.toByteArray());
            rfpFileAttachments.add(fileDto);
        }
        
        // add client's files
        prepareFileParts(rfps, rfpFileAttachments);
        
        // add carrier specific file 
        List<FileDto> fileAttachmentsToCarrier = addAdditionalFilesToCarrier(rfpFileAttachments, clientDto, rfpIds);

        String subject = buildSubject(clientDto.getClientName(), broker.getName(), clientDto.getEffectiveDate());
        
        // Send email to the carrier (presales/sales/specialty/bcc)
        MailDto mailDto = new MailDto();

        // Set recipients

        Broker clientBroker = brokerRepository.findOne(clientDto.getBrokerId());
        setMailRecipients(mailDto, TO, client.getPresalesEmail(), client.getSalesEmail());
        setMailRecipients(mailDto, CC, clientBroker.getBcc());

        if(shouldAddSpecialtyBrokerEmail(client)){
            mailDto.getRecipients().add(client.getSpecialtyEmail());
        }

        mailDto.setContent(buildRfpSubmissionEmailTemplate(broker, clientDto, RFP_SUBMISSION_TEMPLATE));
        sendMailsWithAttachments(mailDto, subject, fileAttachmentsToCarrier, clientDto.getClientName());
        
        // Send email to the client team
        MailDto recordMailDto = setRecordKeepingRecipients(clientId);
        if(recordMailDto.getRecipients().size() > 0) {
            recordMailDto.setContent(buildRfpSubmissionEmailTemplate(broker, clientDto, RFP_SUBMISSION_RECORD_TEMPLATE));
            sendMailsWithAttachments(recordMailDto, subject, rfpFileAttachments, clientDto.getClientName());
        } else {
            logger.errorLog(
                "The recipient list for the record-keeping RFP submission email is empty",
                field("broker_id", clientDto.getBrokerId()),
                field("client_id", clientDto.getId())
            );
        }
        
        storeEmailNotification(clientDto.getId(), "RFP_SUBMISSION");
    }

    protected String[] preparePages(Broker broker, ClientDto clientDto, List<RFP> rfps) {
        List<String> rfpPages = new ArrayList<> ();
        
        String waitingPeriod = (rfps.size() == 0) ? "" : rfps.get(0).getWaitingPeriod();
        rfpPages.add(rfpVelocityService.getRfpClientPage(broker, clientDto, waitingPeriod));
        
        for(RFP rfp : rfps) {
            Collections.addAll(rfpPages, 
                    rfpVelocityService.getRfpPagesArray(broker, clientDto, rfp.getProduct() ));
        }

        String brokerLanguage = sharedBrokerService.getBrokerLanguage(broker.getBrokerId());
        if (brokerLanguage != null && ! brokerLanguage.isEmpty()) {
            rfpPages.add(rfpVelocityService.getRfpBrokerLanguagePage(broker, brokerLanguage));
        }
        
        return rfpPages.toArray(new String[rfpPages.size()]);
    }

    protected void prepareFileParts(List<RFP> rfps, List<FileDto> fileAttachments) {
        for(RFP rfp : rfps) {
            downloadRfpFilesHelper(fileAttachments, rfp.getRfpId());
        }
    }

    public void downloadRfpFilesHelper(List<FileDto> fileAttachments, Long rfpId) {
        List<ClientFileUpload> files = sharedFileService.getClientFilesByRfpId(rfpId);
        if(files != null) {
            for(ClientFileUpload file : files) {
                try {
                    FileDto fileDto = s3FileManager.download(file.getS3Key());
                    FileDto f = FileMapper.fileToDto(file);
                    f.setContent(fileDto.getContent());
                    //TODO: getName from fileDto ?
                    f.setName(s3FileManager.getNameFromKey(file.getS3Key()));

                    fileAttachments.add(f);

                } catch(IOException e) {
                    logger.errorLog(
                        "Error attempting to download file attachment from S3",
                        e,
                        field("client_file_upload_id", file.getClientFileUploadId())
                    );
                }
            }
        }
    }

    protected void sendMailsWithAttachments(
            MailDto mailDto, 
            String subject, 
            List<FileDto> fileAttachments, 
            String clientName) {

        // split file list by SIZE_LIMITATION
        // we need to know how many emails we are gonna send
        List<List<FileDto>> fileAttachmentsList = new ArrayList<>();
        List<FileDto> fileAttachmentsPart = new ArrayList<>();
        fileAttachmentsList.add(fileAttachmentsPart);
        long currentPartSize = 0;
        for(FileDto fileDto : fileAttachments) {
            long fileLength = fileDto.getContent().length;
            if(fileLength + currentPartSize > SIZE_LIMITATION && currentPartSize != 0) {
                currentPartSize = 0;
                fileAttachmentsPart = new ArrayList<>();
                fileAttachmentsList.add(fileAttachmentsPart);
            }
            currentPartSize += fileLength;
            fileAttachmentsPart.add(fileDto);
        }

        // prepare subject format
        String subjectFormat =
                (fileAttachmentsList.size() > 1)
                ? format("[%s] (%%d of %d) %s", clientName, fileAttachmentsList.size(), subject)
                : subject;
        // prepare attachment suffix format        
        String attachSuffixFormat =   fileAttachmentsList.size() > 1
                ? format("-%%d-of-%d", fileAttachmentsList.size() )
                : "" ;                

        for(int i = 0; i < fileAttachmentsList.size(); i++) {
            
            mailDto.setSubject(format(subjectFormat, i + 1));

            try {
                List<AttachmentDto> attachments = buildAttachments(
                        fileAttachmentsList.get(i),
                        format(attachSuffixFormat, i + 1) );

                send(mailDto, attachments);

                // send empty message with the next emails (if any)
                if(fileAttachmentsList.size() > 1) {
                    mailDto.setContent("");
                }
            } catch(BaseException e) {
                throw e;
            } catch(Exception e) {
                throw new BaseException("Error attempting to send email attachment", e)
                    .withFields(
                        field("email", mailDto.getRecipients().toString()),
                        field(
                            "client_file_upload_ids",
                            fileAttachments.stream()
                                .map(f -> String.valueOf(f.getClientFileUploadId()))
                                .collect(toList())
                                .toString()
                        )
                    );
            }
        }
    }

    protected List<FileDto> addAdditionalFilesToCarrier(List<FileDto> fileAttachments, ClientDto clientDto, List<Long> rfpIds) {
        // default, do nothing
        return fileAttachments;
    }

    protected String buildSubject(String clientName, String brokerFirm, String effectiveDate) {
        return format(Constants.RFP_SUBMISSION_SUBJECT, clientName, brokerFirm, effectiveDate);
    }

    // carrier specific
    protected List<AttachmentDto> buildAttachments(List<FileDto> fileAttachments, String partSuffix) {
        return mapToList(fileAttachments, fileDto -> new AttachmentDto(fileDto.getName(), fileDto.getContent()));
    }
    
}
