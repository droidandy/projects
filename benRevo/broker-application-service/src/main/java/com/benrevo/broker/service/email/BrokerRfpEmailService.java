package com.benrevo.broker.service.email;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Comparator.comparing;
import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.mapping;
import static java.util.stream.Collectors.toList;
import static javax.mail.Message.RecipientType.CC;
import static javax.mail.Message.RecipientType.TO;
import static com.benrevo.common.mail.SMTPMailer.setMailRecipients;

import com.benrevo.be.modules.rfp.service.BaseRfpService;
import com.benrevo.be.modules.rfp.service.RfpEmailService;
import com.benrevo.be.modules.shared.access.CheckAccess;
import com.benrevo.broker.service.BrokerDocumentService;
import com.benrevo.broker.service.VelocityService;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.RfpSubmissionDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.PdfCopy;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfSmartCopy;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BrokerRfpEmailService extends RfpEmailService {

    protected static String RFP_SUBMISSION_BROKER_TEMPLATE = "/templates/broker-rfp-submission.vm";
    protected static String RFP_SUBMISSION_CARRIER_TEMPLATE = "/templates/carrier-rfp-submission.vm";
    
    @Autowired
    private VelocityService velocityService;
    
    @Autowired
    private CarrierRepository carrierRepository;
    
    @Autowired
    private BrokerDocumentService documentService;
    
    @Autowired
    private ProgramRepository programRepository;
    
    @Autowired
    private BaseRfpService baseRfpService;
    
    @Autowired
    private CheckAccess checkAccess;

    @Autowired
    @Lazy
    private BrokerRfpEmailService self;

    private Map<Long, List<FileDto>> generateRfpAttachedFile(List<Long> rfpIds){
        Map<Long, List<FileDto>> result = new HashMap<>();

        for(Long rfpId : rfpIds) {
            List<FileDto> rfpFileAttachments = new ArrayList<>();
            downloadRfpFilesHelper(rfpFileAttachments, rfpId);
            result.put(rfpId, rfpFileAttachments);
        }
        return result;
    }

    public void sendRFPSubmissions(Long clientId, List<RfpSubmissionDto> rfpSubmissionDtos, List<Long> rfpIds) throws BaseException {
        
        final Broker currentBroker = findCurrentBroker();

        final ClientDto clientDto = sharedClientService.getById(clientId);
        final Broker clientBroker = brokerRepository.findOne(clientDto.getBrokerId());
        
        byte[] brokerLanguagePage = baseRfpService.getBrokerLanguagePagePdf(currentBroker);
        Map<String, byte[]> rfpPagesByProduct = new HashMap<>();
        // will be created below
        byte[] clientPage = null;

        Map<Long, List<FileDto>> rfpAttachedFilesMap = generateRfpAttachedFile(rfpIds);
        
        String subject = buildSubject(clientDto.getClientName(), currentBroker.getName(), clientDto.getEffectiveDate());
        
        Map<Carrier, List<RFP>> allRfpsByCarrier = new HashMap<>();
        List<FileDto> trustFileAttachments = new ArrayList<>();
        
        for(RfpSubmissionDto rfpSubmissionDto : rfpSubmissionDtos) {

            List<RFP> clientRfps = rfpRepository.findByClientClientIdAndRfpIdIn(clientId, rfpSubmissionDto.getRfpIds());
    
            List<FileDto> rfpFileAttachments = new ArrayList<>();
            
            Map<Carrier, List<RFP>> rfpsByCarrier = new HashMap<>();

            if(rfpSubmissionDto.getProgramName() != null) {
                List<Program> trustPrograms = programRepository.findByName(rfpSubmissionDto.getProgramName());
                // FIXME is filtering required here?
                // List<Program> trustPrograms = checkAccess.findAvailablePrograms(rfpSubmissionDto.getProgramName());
                for(Program trustProgram : trustPrograms) {
                    FileDto trustFileDto = prepareTrustFileAttachment(trustProgram, currentBroker,
                        clientId, clientRfps, trustFileAttachments);
                    if(trustFileDto != null) {
                        rfpFileAttachments.add(trustFileDto);
                    }
                }
                
                Map<Carrier, List<String>> productsByCarrier = trustPrograms.stream()
                    .map(Program::getRfpCarrier)
                    .collect(groupingBy(rc -> rc.getCarrier(), mapping(rc -> rc.getCategory(), toList())));

                productsByCarrier.forEach((car, prods) -> {
                    List<RFP> rfps = clientRfps.stream()
                        .filter(r -> prods.contains(r.getProduct()))
                        .collect(toList());
                    if(!rfps.isEmpty()) {
                        rfpsByCarrier.put(car, rfps);
                    }
                });
                    
            } else if(rfpSubmissionDto.getCarrierId() != null) {
                Carrier carrier = carrierRepository.findOne(rfpSubmissionDto.getCarrierId());
                rfpsByCarrier.put(carrier, clientRfps);
            } else {
                throw new BaseException("Missing one of required params: carrierId or programId");
            }
            
            // pre-build all common parts of RFP document
            for(List<RFP> rfps : rfpsByCarrier.values()) {
                if(clientPage == null) {
                    clientPage = baseRfpService.getClientPagePdf(clientDto, currentBroker, rfps);  
                }
                for(RFP rfp : rfps) {
                    if(!rfpPagesByProduct.containsKey(rfp.getProduct())) {
                        byte[] pdfPage = baseRfpService.getRfpPagePdf(clientDto, currentBroker, rfp);
                        rfpPagesByProduct.put(rfp.getProduct(), pdfPage);
                    }   
                }
            }
            final byte[] finalClientPage = clientPage;

            rfpsByCarrier.forEach((carrier, rfps) -> {
                sendCarrierEmails(currentBroker, clientDto, clientBroker, brokerLanguagePage, rfpPagesByProduct,
                    rfpAttachedFilesMap, subject, allRfpsByCarrier, rfpSubmissionDto,
                    rfpFileAttachments,
                    rfpsByCarrier, finalClientPage, carrier, rfps);
            });
        }
       
        // Send email to the client team
        MailDto recordMailDto = setRecordKeepingRecipients(clientId);
        if(recordMailDto.getRecipients().size() > 0) {
            String template = velocityService.getBrokerRfpSubmissionTemplate(RFP_SUBMISSION_BROKER_TEMPLATE, 
                clientDto, getLoggedInUserName(), allRfpsByCarrier, currentBroker.getLogo());
            recordMailDto.setContent(template);
            
            List<FileDto> brokerEmailFileAttachments = new ArrayList<>();
            List<RFP> brokerEmailRfps = allRfpsByCarrier.values().stream()
                .flatMap(rfps -> rfps.stream())
                .distinct()
                .collect(Collectors.toList());
            prepareRfpPages(clientPage, brokerLanguagePage, rfpPagesByProduct, brokerEmailRfps, brokerEmailFileAttachments);
            addRfpAttachmentsFromMap(brokerEmailRfps, brokerEmailFileAttachments, rfpAttachedFilesMap);
            brokerEmailFileAttachments.addAll(trustFileAttachments);
            
            sendMailsWithAttachments(recordMailDto, subject, brokerEmailFileAttachments, clientDto.getClientName());
        } else {
            logger.errorLog(
                "The recipient list for the record-keeping RFP submission email is empty",
                field("broker_id", clientDto.getBrokerId()),
                field("client_id", clientDto.getId())
            );
        }

        storeEmailNotification(clientDto.getId(), "RFP_SUBMISSION");
    }

    @Async
    private void sendCarrierEmails(Broker currentBroker, ClientDto clientDto, Broker clientBroker,
        byte[] brokerLanguagePage, Map<String, byte[]> rfpPagesByProduct,
        Map<Long, List<FileDto>> rfpAttachedFilesMap, String subject,
        Map<Carrier, List<RFP>> allRfpsByCarrier, RfpSubmissionDto rfpSubmissionDto,
        List<FileDto> rfpFileAttachments, Map<Carrier, List<RFP>> rfpsByCarrier,
        byte[] finalClientPage, Carrier carrier, List<RFP> rfps) {

        // add RFP file
        prepareRfpPages(finalClientPage, brokerLanguagePage, rfpPagesByProduct, rfps, rfpFileAttachments);

        // add client's files
        addRfpAttachmentsFromMap(rfps, rfpFileAttachments, rfpAttachedFilesMap);

        String products = rfps.stream()
            .map(r -> {
                allRfpsByCarrier.putAll(rfpsByCarrier);
                return r.getProduct();
            }).distinct().collect(Collectors.joining(", "));

        // Send email to the carrier
        String template = velocityService.getCarrierRfpSubmissionTemplate(RFP_SUBMISSION_CARRIER_TEMPLATE,
            clientDto, currentBroker, products);
        MailDto mailDto = setRecipients(carrier, rfpSubmissionDto, clientBroker, clientDto.getId());
        mailDto.setContent(template);

        sendMailsWithAttachments(mailDto, subject, rfpFileAttachments, clientDto.getClientName());
    }

    private void addRfpAttachmentsFromMap(List<RFP> rfps, List<FileDto> rfpFileAttachments,
        Map<Long, List<FileDto>> rfpAttachedFilesMap){
        rfps.forEach(rfp ->
            ofNullable(rfpAttachedFilesMap.get(rfp.getRfpId()))
                .ifPresent(e -> rfpFileAttachments.addAll(e))
        );
    }
    
    private FileDto prepareTrustFileAttachment(Program trustProgram, Broker broker, Long clientId,
            List<RFP> clientRfps, List<FileDto> fileAttachments) {
        Carrier carrier = trustProgram.getRfpCarrier().getCarrier();
        if(CarrierType.carrierMatches(carrier.getName(), CarrierType.ANTHEM_BLUE_CROSS)) {  
            String fileName = "Anthem " + trustProgram.getName() + ".xlsm";
            // build file only if not contains
            if(fileAttachments.stream().noneMatch(a -> a.getName().equals(fileName))) {
                byte[] trustDocument =  documentService.buildTrustDocument(
                    trustProgram.getName(), clientId, broker, clientRfps);
                FileDto fileDto = new FileDto();
                fileDto.setName(fileName);
                fileDto.setContent(trustDocument);
                fileAttachments.add(fileDto);
                return fileDto;
            }
        } 
        return null;
    }
    
    private FileDto buildRfpFileAttachment(List<byte[]> pages) {
        try {
            Document document = new Document();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfCopy copy = new PdfSmartCopy(document, out);
            document.open();

            for(byte[] page : pages) {
                if(page != null && page.length > 0) {
                    PdfReader reader = new PdfReader(page);
                    copy.addDocument(reader);
                    reader.close();
                }
            }
            document.close();
            
            FileDto fileDto = new FileDto();
            fileDto.setName("RFP.pdf");
            fileDto.setContent(out.toByteArray());
            
            return fileDto;
            
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }
    
    protected void prepareRfpPages(byte[] clientPage, byte[] brokerLanguagePage, 
            Map<String, byte[]> rfpPagesByProduct, List<RFP> rfps, List<FileDto> fileAttachments) {

        rfps.sort(comparing(RFP::getRfpId));
       
        List<byte[]> pages = new ArrayList<>();
        for(RFP rfp : rfps) {
            byte[] page = rfpPagesByProduct.get(rfp.getProduct());
            pages.add(page);
        }
        // first page
        pages.add(0, clientPage);
        // last page
        pages.add(brokerLanguagePage);
        // add RFP file
        FileDto fileDto = buildRfpFileAttachment(pages);
        fileAttachments.add(fileDto);
    }

    // TODO: Need to pull in email from the BrokerConfig as well - to be done with task https://app.asana.com/0/570820516890590/588533622505231
    protected MailDto setRecipients(Carrier carrier, RfpSubmissionDto rfpSubmissionDto, Broker broker, Long clientId) {
        MailDto mailDto = new MailDto();
        
        /* Remove lookup of connected carrier contacts for RFP email
           https://app.asana.com/0/310271518148409/776324118483241/f
        
        if(CarrierType.carrierMatches(carrier.getName(), UHC)) {
            // For incumbent carriers(Anthem and UHC) - the RFP will be sent to the sales, pre-sales reps as we do today.
            Client client = clientRepository.findOne(clientId);
            setMailRecipients(mailDto, TO, client.getPresalesEmail(), client.getSalesEmail());
            setMailRecipients(mailDto, CC, broker.getBcc());
            if(shouldAddSpecialtyBrokerEmail(client)){
                mailDto.getRecipients().add(client.getSpecialtyEmail());
            }
        } else {*/
            mailDto.setRecipients(new ArrayList<>());
        //}
        
        // now add list of emails passed in by user AND make it distinct.
        mailDto.getRecipients().addAll(rfpSubmissionDto.getEmails());
        mailDto.setRecipients(
            mailDto.getRecipients().stream().distinct().collect(Collectors.toList())
        );
        return mailDto;
    }
}
